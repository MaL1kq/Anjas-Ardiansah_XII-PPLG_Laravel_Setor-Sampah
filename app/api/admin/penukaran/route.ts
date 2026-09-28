import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const list = await prisma.penukaranPoin.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          nama: true,
          email: true,
          poin: { select: { totalPoin: true } },
        },
      },
      barang: {
        select: {
          id: true,
          namaBarang: true,
          hargaPoin: true,
          stok: true,
          gambarUrl: true,
        },
      },
    },
  });

  return NextResponse.json(list);
}
