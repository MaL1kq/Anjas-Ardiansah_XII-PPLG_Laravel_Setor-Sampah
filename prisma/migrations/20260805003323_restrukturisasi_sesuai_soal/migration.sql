-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Satuan" AS ENUM ('KG', 'PCS');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_sampah" (
    "id" UUID NOT NULL,
    "namaJenis" TEXT NOT NULL,

    CONSTRAINT "jenis_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wilayah" (
    "id" UUID NOT NULL,
    "namaWilayah" TEXT NOT NULL,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_sampah" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "jenisSampahId" UUID NOT NULL,
    "wilayahId" UUID NOT NULL,
    "asalSetoranLainnya" TEXT,
    "jumlah" DOUBLE PRECISION NOT NULL,
    "satuan" "Satuan" NOT NULL DEFAULT 'KG',
    "status" "StatusLaporan" NOT NULL DEFAULT 'PENDING',
    "alasanPenolakan" TEXT,
    "approvedById" UUID,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laporan_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_sampah" (
    "id" UUID NOT NULL,
    "laporanId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "warna" TEXT NOT NULL DEFAULT 'brand',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poin" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "totalPoin" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stok" (
    "id" UUID NOT NULL,
    "jenisSampahId" UUID NOT NULL,
    "totalJumlah" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LaporanTags" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_noHp_key" ON "users"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_sampah_namaJenis_key" ON "jenis_sampah"("namaJenis");

-- CreateIndex
CREATE UNIQUE INDEX "wilayah_namaWilayah_key" ON "wilayah"("namaWilayah");

-- CreateIndex
CREATE INDEX "laporan_sampah_userId_idx" ON "laporan_sampah"("userId");

-- CreateIndex
CREATE INDEX "laporan_sampah_status_idx" ON "laporan_sampah"("status");

-- CreateIndex
CREATE UNIQUE INDEX "foto_sampah_laporanId_key" ON "foto_sampah"("laporanId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_nama_key" ON "tags"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "poin_userId_key" ON "poin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stok_jenisSampahId_key" ON "stok"("jenisSampahId");

-- CreateIndex
CREATE UNIQUE INDEX "_LaporanTags_AB_unique" ON "_LaporanTags"("A", "B");

-- CreateIndex
CREATE INDEX "_LaporanTags_B_index" ON "_LaporanTags"("B");

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "jenis_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_sampah" ADD CONSTRAINT "foto_sampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "laporan_sampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poin" ADD CONSTRAINT "poin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok" ADD CONSTRAINT "stok_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "jenis_sampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaporanTags" ADD CONSTRAINT "_LaporanTags_A_fkey" FOREIGN KEY ("A") REFERENCES "laporan_sampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LaporanTags" ADD CONSTRAINT "_LaporanTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
