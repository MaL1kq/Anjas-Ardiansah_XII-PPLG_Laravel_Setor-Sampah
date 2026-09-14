const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  const sql = `SELECT ls.id, u.nama AS nama_warga, u.email, js."namaJenis" AS jenis_sampah, w."namaWilayah" AS wilayah, ls.jumlah, ls.satuan, ls.status, ls."createdAt"
FROM laporan_sampah ls
JOIN users u ON u.id = ls."userId"
JOIN jenis_sampah js ON js.id = ls."jenisSampahId"
JOIN wilayah w ON w.id = ls."wilayahId"
ORDER BY ls."createdAt" DESC
LIMIT 10`;

  const rows = await prisma.$queryRawUnsafe(sql);
  console.table(rows);
  await prisma.$disconnect();
})().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
