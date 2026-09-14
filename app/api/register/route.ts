import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const { nama, email, noHp, password } = parsed.data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  }
  const existingNoHp = await prisma.user.findUnique({ where: { noHp } });
  if (existingNoHp) {
    return NextResponse.json({ error: "Nomor HP sudah terdaftar" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  // Registrasi publik selalu membuat akun role USER — admin hanya dibuat lewat seed
  await prisma.user.create({
    data: { nama, email, noHp, password: hashed, role: "USER" },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
