import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const existing = await prisma.laporanSampah.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Laporan ini sudah diproses sebelumnya" }, { status: 400 });
  }

  const adminId = (session.user as any).id;
  const [updated] = await prisma.$transaction([
    prisma.laporanSampah.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedBy: { connect: { id: adminId } },
        approvedAt: new Date(),
        alasanPenolakan: null,
      },
    }),
    prisma.stok.upsert({
      where: { jenisSampahId: existing.jenisSampahId },
      update: { totalJumlah: { increment: existing.jumlah } },
      create: { jenisSampahId: existing.jenisSampahId, totalJumlah: existing.jumlah },
    }),
  ]);

  return NextResponse.json(updated);
}
