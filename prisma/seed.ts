import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@tpu.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin12345";
  const nama = process.env.SEED_ADMIN_NAME || "Admin TPU";
  const noHp = process.env.SEED_ADMIN_NOHP || "081200000000";

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { nama, email, password: hashed, noHp, role: "ADMIN" },
  });
  console.log(`Admin siap: ${admin.email}`);

  // Master data JenisSampah (dulu enum, sekarang tabel relasi)
  const jenisSampahList = ["Organik", "Anorganik", "B3", "Residu"];
  for (const namaJenis of jenisSampahList) {
    await prisma.jenisSampah.upsert({
      where: { namaJenis },
      update: {},
      create: { namaJenis },
    });
  }
  console.log("Master data JenisSampah siap.");

  // Master data Wilayah (dulu enum asalSetoran, sekarang tabel relasi)
  const wilayahList = ["Rumah", "Sekolah", "RT/RW", "Lainnya"];
  for (const namaWilayah of wilayahList) {
    await prisma.wilayah.upsert({
      where: { namaWilayah },
      update: {},
      create: { namaWilayah },
    });
  }
  console.log("Master data Wilayah siap.");

  const defaultTags = ["Prioritas", "Volume Besar", "Perlu Verifikasi Ulang", "Kerjasama Event"];
  for (const nama of defaultTags) {
    await prisma.tag.upsert({ where: { nama }, update: {}, create: { nama } });
  }
  console.log("Tag default siap.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
