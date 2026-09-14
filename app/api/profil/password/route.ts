import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

// PATCH: ganti password akun sendiri, wajib verifikasi password lama
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Belum login" }, { status: 401 });

  const body = await req.json();
  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });

  const valid = await bcrypt.compare(parsed.data.passwordLama, user.password);
  if (!valid) return NextResponse.json({ error: "Password lama salah" }, { status: 400 });

  const hashed = await bcrypt.hash(parsed.data.passwordBaru, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return NextResponse.json({ ok: true });
}
