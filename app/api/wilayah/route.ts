import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: daftar wilayah (dibaca semua role yang login, buat isi dropdown form)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const wilayah = await prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } });
  return NextResponse.json(wilayah);
}
