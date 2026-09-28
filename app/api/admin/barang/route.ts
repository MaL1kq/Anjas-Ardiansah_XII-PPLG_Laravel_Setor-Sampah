import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  namaBarang: z.string().min(1),
  hargaPoin: z.number().min(1),
  stok: z.number().min(0),
  deskripsi: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const list = await prisma.barang.findMany({
    orderBy: { namaBarang: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const b = await prisma.barang.create({
      data: parsed,
    });
    return NextResponse.json(b);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
