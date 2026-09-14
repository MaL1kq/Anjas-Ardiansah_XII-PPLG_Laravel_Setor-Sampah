import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const wilayahSchema = z.object({
  namaWilayah: z.string().min(2, "Nama minimal 2 karakter").max(40, "Nama maksimal 40 karakter"),
});

// GET: daftar wilayah lengkap sama jumlah laporan (buat halaman admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const wilayah = await prisma.wilayah.findMany({
    orderBy: { namaWilayah: "asc" },
    include: { _count: { select: { laporan: true } } },
  });
  return NextResponse.json(wilayah);
}

// POST: admin menambah wilayah baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = wilayahSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.wilayah.findUnique({ where: { namaWilayah: parsed.data.namaWilayah } });
  if (existing) return NextResponse.json({ error: "Wilayah ini sudah ada" }, { status: 400 });

  const wilayah = await prisma.wilayah.create({ data: { namaWilayah: parsed.data.namaWilayah } });
  return NextResponse.json(wilayah, { status: 201 });
}
