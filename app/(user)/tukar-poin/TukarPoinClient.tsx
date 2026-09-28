"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/Badge";

type Barang = {
  id: string;
  namaBarang: string;
  hargaPoin: number;
  stok: number;
  deskripsi: string | null;
  gambarUrl: string | null;
};

type RiwayatItem = {
  id: string;
  jumlah: number;
  totalPoinDipakai: number;
  status: string;
  createdAt: string | Date;
  barang: {
    namaBarang: string;
    gambarUrl: string | null;
  };
};

export default function TukarPoinClient({
  barangList,
  totalPoin,
  initialRiwayat,
}: {
  barangList: Barang[];
  totalPoin: number;
  initialRiwayat: RiwayatItem[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRiwayat, setShowRiwayat] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>(initialRiwayat);

  async function handleTukar(b: Barang) {
    if (!confirm(`Ajukan penukaran ${b.namaBarang} seharga ${b.hargaPoin} poin?`)) return;
    setLoadingId(b.id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/tukar-poin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangId: b.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengajukan penukaran poin");
      }

      setSuccess(`Permintaan penukaran ${b.namaBarang} berhasil diajukan. Poin kamu akan dipotong saat admin menyetujui.`);
      
      // Add to local riwayat list
      if (data.penukaran) {
        const newItem: RiwayatItem = {
          id: data.penukaran.id,
          jumlah: data.penukaran.jumlah || 1,
          totalPoinDipakai: b.hargaPoin,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          barang: {
            namaBarang: b.namaBarang,
            gambarUrl: b.gambarUrl,
          },
        };
        setRiwayat((prev) => [newItem, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="card p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-50 border-brand-200 rounded-xl">
        <div>
          <span className="text-xs text-brand-600 font-semibold block mb-1">Total Poin Kamu Saat Ini:</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-brand-600">{totalPoin} Poin</span>
            <span className="text-xs text-ink/50">(Poin hanya berkurang jika transaksi disetujui admin)</span>
          </div>
        </div>
        <button
          onClick={() => setShowRiwayat(!showRiwayat)}
          className="bg-white text-brand-600 border border-brand-200 font-semibold px-4 py-2 rounded-lg text-sm transition hover:bg-brand-100 flex items-center gap-2"
        >
          {showRiwayat ? "Tutup Riwayat" : "Riwayat Penukaran"}
          {riwayat.length > 0 && (
            <span className="bg-brand-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
              {riwayat.length}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}
      {success && (
        <div className="mb-6 text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5">{success}</div>
      )}

      {/* Riwayat Penukaran Section / Modal Drawer */}
      {showRiwayat && (
        <div className="card p-5 mb-6 border-brand-200 bg-white">
          <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
            <h2 className="font-semibold text-ink text-base">Riwayat Pengajuan Penukaran Poin</h2>
            <button
              onClick={() => setShowRiwayat(false)}
              className="text-xs text-ink/50 hover:text-ink font-medium"
            >
              Tutup
            </button>
          </div>

          {riwayat.length === 0 ? (
            <p className="text-sm text-ink/50 text-center py-6">Kamu belum pernah mengajukan penukaran poin.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                    <th className="px-4 py-2.5 font-medium">Tanggal</th>
                    <th className="px-4 py-2.5 font-medium">Barang</th>
                    <th className="px-4 py-2.5 font-medium">Poin</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-ink/70 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {r.barang?.gambarUrl ? (
                            <img
                              src={r.barang.gambarUrl}
                              alt={r.barang.namaBarang}
                              className="w-8 h-8 object-cover rounded border border-line bg-gray-50 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px] text-ink/40 shrink-0">
                              Item
                            </div>
                          )}
                          <span className="font-medium text-ink">{r.barang?.namaBarang}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-brand-600 whitespace-nowrap">
                        -{r.totalPoinDipakai} Pts
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-ink/60">
                        {r.status === "PENDING" && "Menunggu persetujuan Admin (poin belum dipotong)"}
                        {r.status === "APPROVED" && "Disetujui. Silakan ambil barang di bank sampah"}
                        {r.status === "REJECTED" && "Pengajuan ditolak oleh admin"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {barangList.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Belum ada barang di katalog yang bisa ditukar saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {barangList.map((b) => {
            const cukup = totalPoin >= b.hargaPoin;
            const habis = b.stok <= 0;

            return (
              <div key={b.id} className="card p-4 flex flex-col bg-white border border-line rounded-xl hover:shadow-sm transition">
                {b.gambarUrl ? (
                  <div className="w-full h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden border border-line">
                    <img
                      src={b.gambarUrl}
                      alt={b.namaBarang}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl font-display font-bold text-gray-300">
                    {b.namaBarang.charAt(0)}
                  </div>
                )}

                <h3 className="font-bold text-ink mb-1">{b.namaBarang}</h3>
                <p className="text-xs text-ink/60 mb-2 line-clamp-2 flex-1">{b.deskripsi || "Tidak ada deskripsi"}</p>
                <div className="text-xs font-medium text-ink/40 mb-3">Stok tersedia: {b.stok}</div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-line/60">
                  <span className="font-semibold text-brand-600">{b.hargaPoin} Poin</span>
                  {habis ? (
                    <button disabled className="text-xs bg-gray-200 text-gray-500 font-semibold px-3 py-1.5 rounded cursor-not-allowed">
                      Habis
                    </button>
                  ) : cukup ? (
                    <button
                      onClick={() => handleTukar(b)}
                      disabled={loadingId === b.id}
                      className="text-xs bg-brand-500 text-white hover:bg-brand-600 font-semibold px-3 py-1.5 rounded transition disabled:opacity-50"
                    >
                      {loadingId === b.id ? "Mengirim..." : "Tukar Poin"}
                    </button>
                  ) : (
                    <button disabled className="text-xs bg-gray-200 text-gray-500 font-semibold px-3 py-1.5 rounded cursor-not-allowed">
                      Poin Kurang
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
