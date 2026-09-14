import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rejectSchema } from "@/lib/validation";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const laporan = await prisma.laporanSampah.findUnique({ where: { id: params.id } });
  if (!laporan) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (laporan.status !== "PENDING") {
    return NextResponse.json({ error: "Setoran sudah diproses sebelumnya" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const updated = await prisma.laporanSampah.update({
    where: { id: params.id },
    data: {
      status: "REJECTED",
      approvedBy: { connect: { id: (session.user as any).id } },
      approvedAt: new Date(),
      alasanPenolakan: parsed.data.alasanPenolakan,
    },
  });

  return NextResponse.json(updated);
}
