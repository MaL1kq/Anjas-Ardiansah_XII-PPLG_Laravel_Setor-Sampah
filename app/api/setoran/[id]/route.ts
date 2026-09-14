import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { laporanSchema } from "@/lib/validation";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const laporan = await prisma.laporanSampah.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { nama: true, email: true } },
      approvedBy: { select: { nama: true } },
      jenisSampah: true,
      wilayah: true,
      foto: true,
      tags: true,
    },
  });
  if (!laporan) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const isOwner = laporan.userId === (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  return NextResponse.json(laporan);
}

// PATCH: user mengedit laporan miliknya sendiri, hanya jika masih PENDING
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const existing = await prisma.laporanSampah.findUnique({ where: { id: params.id }, include: { foto: true } });
  if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const isOwner = existing.userId === (session.user as any).id;
  if (!isOwner) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Laporan yang sudah diproses tidak bisa diedit" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = laporanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const data = parsed.data;

  const wilayah = await prisma.wilayah.findUnique({ where: { id: data.wilayahId } });
  if (!wilayah) return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 400 });
  if (wilayah.namaWilayah.toLowerCase() === "lainnya" && !data.asalSetoranLainnya?.trim()) {
    return NextResponse.json({ error: "Sebutkan asal setoran" }, { status: 400 });
  }

  // FotoSampah one-to-one: update kalau sudah ada baris foto, create kalau belum
  const fotoUrl: string | undefined = body.fotoUrl;
  let fotoWrite: any = undefined;
  if (fotoUrl && existing.foto) {
    fotoWrite = { update: { url: fotoUrl } };
  } else if (fotoUrl && !existing.foto) {
    fotoWrite = { create: { url: fotoUrl } };
  }

  const updated = await prisma.laporanSampah.update({
    where: { id: params.id },
    data: {
      jenisSampahId: data.jenisSampahId,
      wilayahId: data.wilayahId,
      asalSetoranLainnya: wilayah.namaWilayah.toLowerCase() === "lainnya" ? data.asalSetoranLainnya : null,
      jumlah: data.jumlah,
      satuan: data.satuan,
      tags: { set: data.tagIds.map((id) => ({ id })) },
      foto: fotoWrite,
    },
    include: { foto: true },
  });

  return NextResponse.json(updated);
}
