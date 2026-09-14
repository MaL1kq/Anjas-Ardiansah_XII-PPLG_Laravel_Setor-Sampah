import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tagSchema = z.object({
  nama: z.string().min(2, "Nama tag minimal 2 karakter").max(30, "Nama tag maksimal 30 karakter"),
});

// GET: daftar semua tag (admin & user boleh baca, dipakai buat tampilkan badge)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const tags = await prisma.tag.findMany({
    orderBy: { nama: "asc" },
    include: { _count: { select: { laporan: true } } },
  });
  return NextResponse.json(tags);
}

// POST: admin membuat tag baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.tag.findUnique({ where: { nama: parsed.data.nama } });
  if (existing) return NextResponse.json(existing, { status: 200 });

  const tag = await prisma.tag.create({ data: { nama: parsed.data.nama } });
  return NextResponse.json(tag, { status: 201 });
}
