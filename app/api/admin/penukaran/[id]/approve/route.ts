import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const existing = await prisma.penukaranPoin.findUnique({
    where: { id: params.id },
    include: { barang: true, user: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Data penukaran tidak ditemukan" }, { status: 404 });
  }
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Permintaan penukaran ini sudah diproses sebelumnya" }, { status: 400 });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Cek stok barang
      if (existing.barang.stok < existing.jumlah) {
        throw new Error("Stok barang tidak mencukupi untuk disetujui");
      }

      // 2. Cek saldo poin user saat ini
      const poin = await tx.poin.findUnique({ where: { userId: existing.userId } });
      if (!poin || poin.totalPoin < existing.totalPoinDipakai) {
        throw new Error("Poin warga tidak mencukupi untuk disetujui");
      }

      // 3. Potong poin user
      await tx.poin.update({
        where: { id: poin.id },
        data: { totalPoin: { decrement: existing.totalPoinDipakai } },
      });

      // 4. Kurangi stok barang
      await tx.barang.update({
        where: { id: existing.barangId },
        data: { stok: { decrement: existing.jumlah } },
      });

      // 5. Update status penukaran menjadi APPROVED
      const res = await tx.penukaranPoin.update({
        where: { id: params.id },
        data: { status: "APPROVED" },
      });

      return res;
    });

    return NextResponse.json({ success: true, penukaran: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal memproses persetujuan" }, { status: 400 });
  }
}
