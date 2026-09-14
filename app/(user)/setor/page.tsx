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
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Setor Sampah</h1>
        <p className="text-sm text-ink/60 mt-1">
          Kamu setor untuk wilayah apa? Pilih dulu, lalu isi jenis dan jumlah sampahnya.
        </p>
      </div>
      <SetoranForm jenisSampahList={jenisSampahList} wilayahList={wilayahList} tags={tags} />
    </div>
  );
}
