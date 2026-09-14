import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    select: { id: true, nama: true, email: true },
    orderBy: { nama: "asc" },
  });

  return NextResponse.json(users);
}
