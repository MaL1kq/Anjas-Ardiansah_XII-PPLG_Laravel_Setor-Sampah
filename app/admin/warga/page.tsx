import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WargaPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { nama: "asc" },
    include: {
      _count: { select: { laporan: true } },
      laporan: { select: { status: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    noHp: u.noHp,
    createdAt: u.createdAt,
    total: u._count.laporan,
    approved: u.laporan.filter((s) => s.status === "APPROVED").length,
    pending: u.laporan.filter((s) => s.status === "PENDING").length,
    rejected: u.laporan.filter((s) => s.status === "REJECTED").length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Warga</h1>
        <p className="text-sm text-ink/60 mt-1">
          Daftar akun warga yang terdaftar, beserta rekap laporan masing-masing.
        </p>
      </div>

      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/60">Belum ada warga yang mendaftar.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">No HP</th>
                <th className="px-5 py-3 font-medium">Terdaftar</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
                <th className="px-5 py-3 font-medium text-right">Disetujui</th>
                <th className="px-5 py-3 font-medium text-right">Menunggu</th>
                <th className="px-5 py-3 font-medium text-right">Ditolak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ink">{r.nama}</td>
                  <td className="px-5 py-3.5 text-ink/60">{r.email}</td>
                  <td className="px-5 py-3.5 text-ink/60">{r.noHp}</td>
                  <td className="px-5 py-3.5 text-ink/60">
                    {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-ink/80">{r.total}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-organik">{r.approved}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-anorganik">{r.pending}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-b3">{r.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
