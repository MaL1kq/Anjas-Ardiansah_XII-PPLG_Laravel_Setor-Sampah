import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import { KategoriBadge, StatusBadge } from "@/components/Badge";
import { kategoriColor } from "@/lib/labels";

export const dynamic = "force-dynamic";

const barColor: Record<string, string> = {
  organik: "bg-organik",
  anorganik: "bg-anorganik",
  b3: "bg-b3",
  residu: "bg-residu",
};

export default async function AdminDashboard() {
  const [
    totalPending,
    totalApproved,
    totalRejected,
    totalWarga,
    stok,
    laporanByWilayah,
    terbaru,
  ] = await Promise.all([
    prisma.laporanSampah.count({ where: { status: "PENDING" } }),
    prisma.laporanSampah.count({ where: { status: "APPROVED" } }),
    prisma.laporanSampah.count({ where: { status: "REJECTED" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.stok.findMany({ include: { jenisSampah: true }, orderBy: { jenisSampah: { namaJenis: "asc" } } }),
    prisma.laporanSampah.groupBy({
      by: ["wilayahId"],
      where: { status: "APPROVED" },
      _count: { _all: true },
    }),
    prisma.laporanSampah.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { nama: true } }, jenisSampah: true },
    }),
  ]);

  const wilayahMap = new Map(
    (await prisma.wilayah.findMany({ where: { id: { in: laporanByWilayah.map((r) => r.wilayahId) } } })).map((w) => [
      w.id,
      w.namaWilayah,
    ])
  );

  const totalLaporan = totalPending + totalApproved + totalRejected;
  const totalStok = stok.reduce((sum, s) => sum + s.totalJumlah, 0) || 1;
  const maxWilayahCount = Math.max(1, ...laporanByWilayah.map((r) => r._count._all));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Dashboard Admin TPU</h1>
          <p className="text-sm text-ink/60">Ringkasan operasional penerimaan sampah dan ketersediaan stok daur ulang.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/setoran" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm">
            Verifikasi Setoran Masuk →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Setoran" value={`${totalLaporan} Setoran`} sub="Semua kategori" accent="brand" />
        <StatCard label="Perlu Verifikasi" value={`${totalPending} Menunggu`} sub="Klik untuk review" accent="anorganik" />
        <StatCard label="Total Warga Terdaftar" value={`${totalWarga} Warga`} sub="Tugas Individu" accent="gray" />
        <StatCard label="Total Stok Material" value={`${totalStok.toFixed(1)} KG`} sub="Terkumpul di gudang" accent="organik" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink mb-3">Stok per Kategori</h2>
          <div className="card p-6 space-y-5">
            {stok.length === 0 ? (
              <p className="text-sm text-ink/50">Belum ada stok tercatat (nambah setelah ada setoran yang disetujui).</p>
            ) : (
              stok.map((s) => {
                const pct = Math.round((s.totalJumlah / totalStok) * 100);
                const warna = kategoriColor(s.jenisSampah.namaJenis);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-ink/80">{s.jenisSampah.namaJenis}</span>
                      <span className="font-mono text-ink/60">{s.totalJumlah.toFixed(1)} kg-setara</span>
                    </div>
                    <div className="h-2 rounded-full bg-paper overflow-hidden">
                      <div className={`h-full ${barColor[warna]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink mb-3">Laporan Disetujui per Wilayah</h2>
          <div className="card p-6">
            {laporanByWilayah.length === 0 ? (
              <p className="text-sm text-ink/50">Belum ada laporan disetujui.</p>
            ) : (
              <div className="space-y-4">
                {laporanByWilayah.map((row) => {
                  const pct = Math.round((row._count._all / maxWilayahCount) * 100);
                  return (
                    <div key={row.wilayahId}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-ink/80">{wilayahMap.get(row.wilayahId) || "—"}</span>
                        <span className="font-mono text-ink/60">{row._count._all} laporan</span>
                      </div>
                      <div className="h-2 rounded-full bg-paper overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-semibold text-ink">Laporan Terbaru</h2>
          <Link href="/admin/setoran" className="text-sm font-medium text-brand-600 hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="card overflow-hidden">
          {terbaru.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink/60">Belum ada laporan masuk.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Warga</th>
                  <th className="px-5 py-3 font-medium">Jenis</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {terbaru.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/admin/setoran/${s.id}`} className="font-medium text-ink hover:text-brand-600">
                        {s.user.nama}
                      </Link>
                    </td>
                    <td className="px-5 py-3"><KategoriBadge nama={s.jenisSampah.namaJenis} /></td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3 text-ink/60">
                      {new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
