import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { laporanSchema } from "@/lib/validation";

// GET: daftar laporan milik user yang login (atau semua, jika admin + query all=1)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const isAdmin = (session.user as any).role === "ADMIN";
  const wantAll = searchParams.get("all") === "1";

  const statusFilter = searchParams.get("status") || undefined;
  const wilayahFilter = searchParams.get("wilayahId") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;

  const where: any = {};
  if (!(isAdmin && wantAll)) {
    where.userId = (session.user as any).id;
  }
  if (statusFilter) where.status = statusFilter;
  if (wilayahFilter) where.wilayahId = wilayahFilter;
  if (q && isAdmin && wantAll) {
    where.OR = [
      { user: { nama: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
      { wilayah: { namaWilayah: { contains: q, mode: "insensitive" } } },
      { tags: { some: { nama: { contains: q, mode: "insensitive" } } } },
    ];
  }

  const laporan = await prisma.laporanSampah.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { nama: true, email: true } },
      approvedBy: { select: { nama: true } },
      jenisSampah: true,
      wilayah: true,
      foto: true,
      tags: true,
    },
  });

  return NextResponse.json(laporan);
}

// POST: user membuat laporan setoran baru (status otomatis PENDING)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

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

  const laporan = await prisma.laporanSampah.create({
    data: {
      userId: (session.user as any).id,
      jenisSampahId: data.jenisSampahId,
      wilayahId: data.wilayahId,
      asalSetoranLainnya: wilayah.namaWilayah.toLowerCase() === "lainnya" ? data.asalSetoranLainnya : null,
      jumlah: data.jumlah,
      satuan: data.satuan,
      tags: data.tagIds.length ? { connect: data.tagIds.map((id) => ({ id })) } : undefined,
      foto: body.fotoUrl ? { create: { url: body.fotoUrl } } : undefined,
    },
    include: { foto: true },
  });

  return NextResponse.json(laporan, { status: 201 });
}
