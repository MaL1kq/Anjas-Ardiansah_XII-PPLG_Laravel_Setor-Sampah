import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: daftar jenis sampah (dibaca semua role yang login, buat isi dropdown form)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const jenisSampah = await prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } });
  return NextResponse.json(jenisSampah);
}
