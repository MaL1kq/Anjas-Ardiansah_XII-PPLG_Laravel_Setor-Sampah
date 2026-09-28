import { prisma } from "@/lib/prisma";
import { KategoriBadge, StatusBadge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function PenukaranAdminPage() {
  const history = await prisma.penukaranPoin.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { nama: true } },
      barang: { select: { namaBarang: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Penukaran Poin</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-xl">
          Pantau daftar warga yang telah menukarkan poin reward mereka dengan barang.
        </p>
      </div>

      <div className="card overflow-hidden">
        {history.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/60">Belum ada warga yang menukarkan poin.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Warga</th>
                <th className="px-5 py-3 font-medium">Barang</th>
                <th className="px-5 py-3 font-medium">Poin Dipakai</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 text-ink/70">
                    {new Date(h.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ink">{h.user.nama}</td>
                  <td className="px-5 py-3.5 text-ink">{h.barang.namaBarang}</td>
                  <td className="px-5 py-3.5 font-mono text-brand-600 font-semibold">-{h.totalPoinDipakai} Pts</td>
                  <td className="px-5 py-3.5"><StatusBadge status={h.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
