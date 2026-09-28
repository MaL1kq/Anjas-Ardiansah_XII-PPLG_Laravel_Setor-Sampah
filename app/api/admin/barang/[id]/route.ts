import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  namaBarang: z.string().min(1),
  hargaPoin: z.number().min(1),
  stok: z.number().min(0),
  deskripsi: z.string().optional().nullable(),
  gambarUrl: z.string().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = updateSchema.parse(body);

    const updated = await prisma.barang.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal mengupdate barang" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  try {
    await prisma.barang.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal menghapus barang, mungkin sudah pernah ditukarkan" }, { status: 400 });
  }
}
