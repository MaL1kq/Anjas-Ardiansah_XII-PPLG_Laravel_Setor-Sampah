import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSetoranForm from "@/components/AdminSetoranForm";

export const dynamic = "force-dynamic";

export default async function EditSetoranAdminPage({ params }: { params: { id: string } }) {
  const [laporan, users, jenisSampahList, wilayahList, tags] = await Promise.all([
    prisma.laporanSampah.findUnique({ where: { id: params.id }, include: { tags: true, foto: true } }),
    prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, nama: true, email: true },
      orderBy: { nama: "asc" },
    }),
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } }),
    prisma.tag.findMany({ orderBy: { nama: "asc" } }),
  ]);
  if (!laporan) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Edit Setoran</h1>
        <p className="text-sm text-ink/60 mt-1">Perubahan jenis/jumlah/status akan otomatis menyesuaikan stok.</p>
      </div>
      <AdminSetoranForm
        users={users}
        jenisSampahList={jenisSampahList}
        wilayahList={wilayahList}
        tags={tags}
        initial={{
          id: laporan.id,
          userId: laporan.userId,
          jenisSampahId: laporan.jenisSampahId,
          jumlah: laporan.jumlah,
          satuan: laporan.satuan,
          wilayahId: laporan.wilayahId,
          asalSetoranLainnya: laporan.asalSetoranLainnya,
          fotoUrl: laporan.foto?.url || null,
          status: laporan.status,
          alasanPenolakan: laporan.alasanPenolakan,
          tagIds: laporan.tags.map((t) => t.id),
        }}
      />
    </div>
  );
}
