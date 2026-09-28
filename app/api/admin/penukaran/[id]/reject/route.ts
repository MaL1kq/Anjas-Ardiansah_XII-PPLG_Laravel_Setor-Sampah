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
  });

  if (!existing) {
    return NextResponse.json({ error: "Data penukaran tidak ditemukan" }, { status: 404 });
  }
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Permintaan penukaran ini sudah diproses sebelumnya" }, { status: 400 });
  }

  try {
    const updated = await prisma.penukaranPoin.update({
      where: { id: params.id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json({ success: true, penukaran: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal menolak penukaran" }, { status: 400 });
  }
}
