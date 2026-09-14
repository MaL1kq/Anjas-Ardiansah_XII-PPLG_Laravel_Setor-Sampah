import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profilSchema } from "@/lib/validation";

// PATCH: update nama akun sendiri
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const body = await req.json();
  const parsed = profilSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { nama: parsed.data.nama },
    select: { id: true, nama: true, email: true },
  });

  return NextResponse.json(updated);
}
