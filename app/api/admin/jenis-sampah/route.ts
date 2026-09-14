import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const jenisSampahSchema = z.object({
  namaJenis: z.string().min(2, "Nama minimal 2 karakter").max(40, "Nama maksimal 40 karakter"),
});

// GET: daftar jenis sampah lengkap sama jumlah laporan & data stok (buat halaman admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const jenisSampah = await prisma.jenisSampah.findMany({
    orderBy: { namaJenis: "asc" },
    include: { _count: { select: { laporan: true } }, stok: true },
  });
  return NextResponse.json(jenisSampah);
}

// POST: admin menambah jenis sampah baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = jenisSampahSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.jenisSampah.findUnique({ where: { namaJenis: parsed.data.namaJenis } });
  if (existing) return NextResponse.json({ error: "Jenis sampah ini sudah ada" }, { status: 400 });

  const jenisSampah = await prisma.jenisSampah.create({ data: { namaJenis: parsed.data.namaJenis } });
  return NextResponse.json(jenisSampah, { status: 201 });
}
