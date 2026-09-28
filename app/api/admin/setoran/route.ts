import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminLaporanSchema } from "@/lib/validation";

// POST: admin menambahkan laporan secara manual (mis. warga setor offline), status bisa dipilih langsung
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = adminLaporanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const data = parsed.data;

  const wilayah = await prisma.wilayah.findUnique({ where: { id: data.wilayahId } });
  if (!wilayah) return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 400 });
  if (wilayah.namaWilayah.toLowerCase() === "lainnya" && !data.asalSetoranLainnya?.trim()) {
    return NextResponse.json({ error: "Sebutkan asal setoran" }, { status: 400 });
  }
  if (data.status === "REJECTED" && !data.alasanPenolakan?.trim()) {
    return NextResponse.json({ error: "Alasan penolakan wajib diisi" }, { status: 400 });
  }

  const adminId = (session.user as any).id;
  const isApproved = data.status === "APPROVED";
  const isRejected = data.status === "REJECTED";

  const ops: any[] = [
    prisma.laporanSampah.create({
      data: {
        userId: data.userId,
        jenisSampahId: data.jenisSampahId,
        wilayahId: data.wilayahId,
        asalSetoranLainnya: wilayah.namaWilayah.toLowerCase() === "lainnya" ? data.asalSetoranLainnya : null,
        jumlah: data.jumlah,
        satuan: data.satuan,
        status: data.status,
        alasanPenolakan: isRejected ? data.alasanPenolakan : null,
        approvedById: isApproved || isRejected ? adminId : null,
        approvedAt: isApproved || isRejected ? new Date() : null,
        tags: data.tagIds.length ? { connect: data.tagIds.map((id) => ({ id })) } : undefined,
        foto: body.fotoUrl ? { create: { url: body.fotoUrl } } : undefined,
      },
      include: { foto: true },
    }),
  ];

  if (isApproved) {
    ops.push(
      prisma.stok.upsert({
        where: { jenisSampahId: data.jenisSampahId },
        update: { totalJumlah: { increment: data.jumlah } },
        create: { jenisSampahId: data.jenisSampahId, totalJumlah: data.jumlah },
      })
    );
  }

  const [created] = await prisma.$transaction(ops);
  return NextResponse.json(created, { status: 201 });
}
