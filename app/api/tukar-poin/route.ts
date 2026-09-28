import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const userId = (session.user as any).id;
  const { barangId } = await req.json();

  if (!barangId) return NextResponse.json({ error: "Barang tidak valid" }, { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get barang
      const barang = await tx.barang.findUnique({ where: { id: barangId } });
      if (!barang) throw new Error("Barang tidak ditemukan");
      if (barang.stok <= 0) throw new Error("Stok barang habis");

      // 2. Get user poin
      const poin = await tx.poin.findUnique({ where: { userId } });
      if (!poin) throw new Error("Kamu belum memiliki poin");
      if (poin.totalPoin < barang.hargaPoin) throw new Error("Poin kamu tidak cukup untuk menukar barang ini");

      // 3. Create penukaran record with PENDING status (poin dan stok belum berkurang sampai disetujui admin)
      const penukaran = await tx.penukaranPoin.create({
        data: {
          userId,
          barangId,
          jumlah: 1,
          totalPoinDipakai: barang.hargaPoin,
          status: "PENDING",
        },
      });

      return penukaran;
    });

    return NextResponse.json({
      success: true,
      message: "Pengajuan penukaran berhasil dikirim. Menunggu persetujuan Admin.",
      penukaran: result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
