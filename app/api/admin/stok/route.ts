import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const stok = await prisma.stok.findMany({
    include: { jenisSampah: true },
    orderBy: { jenisSampah: { namaJenis: "asc" } },
  });
  return NextResponse.json(stok);
}
