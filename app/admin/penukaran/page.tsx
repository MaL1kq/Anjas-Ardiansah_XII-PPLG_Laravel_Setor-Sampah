"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/Badge";

type PenukaranItem = {
  id: string;
  jumlah: number;
  totalPoinDipakai: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    nama: string;
    email: string;
    poin: { totalPoin: number } | null;
  };
  barang: {
    id: string;
    namaBarang: string;
    hargaPoin: number;
    stok: number;
    gambarUrl: string | null;
  };
};

export default function PenukaranAdminPage() {
  const [list, setList] = useState<PenukaranItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin/penukaran")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setList(data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    const actionText = action === "approve" ? "menyetujui" : "menolak";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} permintaan penukaran ini?`)) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/penukaran/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Gagal ${actionText} permintaan`);
      }

      setSuccess(`Berhasil ${actionText} permintaan penukaran.`);
      load();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses");
    } finally {
      setProcessingId(null);
    }
  }

  const filteredList = list.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Riwayat & Persetujuan Penukaran Poin</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-xl">
            Kelola dan konfirmasi permintaan penukaran barang dari warga. Poin dan stok barang akan berkurang saat Anda menyetujui transaksi.
          </p>
        </div>

        {/* Filter Tab */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "ALL" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "PENDING" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Menunggu Persetujuan
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "APPROVED" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Disetujui
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "REJECTED" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            Ditolak
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}
      {success && (
        <div className="text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5">{success}</div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Memuat data...</p>
      ) : filteredList.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Belum ada data penukaran poin {filter !== "ALL" ? `dengan status ${filter}` : ""}.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Tanggal</th>
                  <th className="px-5 py-3 font-medium">Barang</th>
                  <th className="px-5 py-3 font-medium">Warga</th>
                  <th className="px-5 py-3 font-medium">Poin Dipakai</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((h) => {
                  const isPending = h.status === "PENDING";
                  const isProcessing = processingId === h.id;
                  const currentWargaPoin = h.user?.poin?.totalPoin ?? 0;

                  return (
                    <tr key={h.id} className="border-b border-line last:border-0 hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5 text-ink/70 whitespace-nowrap">
                        {new Date(h.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {h.barang.gambarUrl ? (
                            <img
                              src={h.barang.gambarUrl}
                              alt={h.barang.namaBarang}
                              className="w-10 h-10 object-cover rounded-lg border border-line bg-gray-50 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs text-ink/40 shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-ink">{h.barang.namaBarang}</div>
                            <div className="text-xs text-ink/50">Stok tersisa: {h.barang.stok}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-ink">{h.user.nama}</div>
                        <div className="text-xs text-ink/50">Saldo saat ini: {currentWargaPoin} Poin</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-brand-600 font-semibold whitespace-nowrap">
                        -{h.totalPoinDipakai} Pts
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={h.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(h.id, "approve")}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-organik hover:bg-organik/90 transition disabled:opacity-50"
                            >
                              {isProcessing ? "Memproses..." : "Setujui"}
                            </button>
                            <button
                              onClick={() => handleAction(h.id, "reject")}
                              disabled={isProcessing}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-b3 bg-b3/10 hover:bg-b3/20 transition disabled:opacity-50"
                            >
                              {isProcessing ? "..." : "Tolak"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-ink/40 font-medium">Selesai</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
