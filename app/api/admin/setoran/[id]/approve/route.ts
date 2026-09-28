import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function hitungPoin(namaJenis: string, jumlah: number, satuan: string) {
  if (satuan !== "KG") return 0; // Poin hanya dihitung untuk KG (seperti di HTML)
  
  const jenis = namaJenis.toLowerCase();
  let poinPerKg = 5; // Default (Residu)
  
  if (jenis.includes("organik") && !jenis.includes("anorganik")) poinPerKg = 10;
  else if (jenis.includes("anorganik")) poinPerKg = 15;
  else if (jenis.includes("b3")) poinPerKg = 20;

  return Math.floor(poinPerKg * jumlah);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const existing = await prisma.laporanSampah.findUnique({ 
    where: { id: params.id },
    include: { jenisSampah: true }
  });
  if (!existing) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Laporan ini sudah diproses sebelumnya" }, { status: 400 });
  }

  const poinDidapat = hitungPoin(existing.jenisSampah.namaJenis, existing.jumlah, existing.satuan);
  const adminId = (session.user as any).id;

  const [updated] = await prisma.$transaction([
    // 1. Approve laporan
    prisma.laporanSampah.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedBy: { connect: { id: adminId } },
        approvedAt: new Date(),
        alasanPenolakan: null,
      },
    }),
    // 2. Tambah stok admin
    prisma.stok.upsert({
      where: { jenisSampahId: existing.jenisSampahId },
      update: { totalJumlah: { increment: existing.jumlah } },
      create: { jenisSampahId: existing.jenisSampahId, totalJumlah: existing.jumlah },
    }),
    // 3. Tambah poin user (jika poin > 0)
    ...(poinDidapat > 0 ? [
      prisma.poin.upsert({
        where: { userId: existing.userId },
        update: { totalPoin: { increment: poinDidapat } },
        create: { userId: existing.userId, totalPoin: poinDidapat },
      })
    ] : [])
  ]);

  return NextResponse.json(updated);
}
