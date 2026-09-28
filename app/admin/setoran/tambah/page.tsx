import { prisma } from "@/lib/prisma";
import AdminSetoranForm from "@/components/AdminSetoranForm";

export const dynamic = "force-dynamic";

export default async function TambahSetoranPage() {
  const [users, jenisSampahList, wilayahList, tags] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, nama: true, email: true },
      orderBy: { nama: "asc" },
    }),
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } }),
    prisma.tag.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Tambah Setoran</h1>
        <p className="text-sm text-ink/60 mt-1">Untuk mencatat setoran yang terjadi di luar aplikasi (offline).</p>
      </div>
      {users.length === 0 ? (
        <div className="card p-6 text-sm text-ink/60 max-w-xl">
          Belum ada akun warga yang terdaftar. Warga perlu daftar dulu lewat halaman register sebelum kamu bisa mencatatkan setoran untuk mereka.
        </div>
      ) : jenisSampahList.length === 0 || wilayahList.length === 0 ? (
        <div className="card p-6 text-sm text-ink/60 max-w-xl">
          Data master Jenis Sampah/Wilayah masih kosong. Tambahkan dulu di halaman{" "}
          <a href="/admin/jenis-sampah" className="text-brand-600 underline">Jenis Sampah</a> dan{" "}
          <a href="/admin/wilayah" className="text-brand-600 underline">Wilayah</a>.
        </div>
      ) : (
        <AdminSetoranForm users={users} jenisSampahList={jenisSampahList} wilayahList={wilayahList} tags={tags} />
      )}
    </div>
  );
}
