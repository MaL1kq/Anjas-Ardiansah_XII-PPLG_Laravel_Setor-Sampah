import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE: admin menghapus wilayah. Ditolak (400) kalau masih dipakai
// di laporan manapun — sesuai constraint onDelete: Restrict di schema.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  try {
    await prisma.wilayah.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Wilayah ini masih dipakai di laporan, tidak bisa dihapus" },
      { status: 400 }
    );
  }
}
