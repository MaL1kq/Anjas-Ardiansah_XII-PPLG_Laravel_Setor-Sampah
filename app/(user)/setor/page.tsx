import { prisma } from "@/lib/prisma";
import SetoranForm from "@/components/SetoranForm";

export const dynamic = "force-dynamic";

export default async function SetorPage() {
  const [jenisSampahList, wilayahList, tags] = await Promise.all([
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } }),
    prisma.tag.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Form Setoran Sampah Mandiri</h1>
        <p className="text-sm text-ink/60 mt-1">
          Lengkapi data setoran dengan benar agar cepat diverifikasi oleh admin TPU.
        </p>
      </div>
      <SetoranForm jenisSampahList={jenisSampahList} wilayahList={wilayahList} tags={tags} />
    </div>
  );
}
