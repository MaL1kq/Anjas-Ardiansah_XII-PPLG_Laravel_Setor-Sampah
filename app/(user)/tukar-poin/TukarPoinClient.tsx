"use client";

import { useState } from "react";

type Barang = {
  id: string;
  namaBarang: string;
  hargaPoin: number;
  stok: number;
  deskripsi: string | null;
};

export default function TukarPoinClient({
  barangList,
  totalPoin,
}: {
  barangList: Barang[];
  totalPoin: number;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPoin, setCurrentPoin] = useState(totalPoin);

  async function handleTukar(b: Barang) {
    if (!confirm(`Tukar ${b.namaBarang} seharga ${b.hargaPoin} poin?`)) return;
    setLoadingId(b.id);
    setError("");
    setSuccess("");

    const res = await fetch("/api/tukar-poin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barangId: b.id }),
    });
    const data = await res.json();
    setLoadingId(null);

    if (!res.ok) {
      setError(data.error || "Gagal menukar poin");
    } else {
      setSuccess(`Berhasil menukar ${b.namaBarang}! Silakan ambil di admin TPU.`);
      setCurrentPoin((prev) => prev - b.hargaPoin);
      // Optional: Update stock in local state to avoid refresh
      const idx = barangList.findIndex((x) => x.id === b.id);
      if (idx !== -1) {
        barangList[idx].stok -= 1;
      }
    }
  }

  return (
    <>
      <div className="card p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-50 border-brand-200 rounded-xl">
        <div>
          <span className="text-xs text-brand-600 font-semibold block mb-1">Total Poin Kamu Saat Ini:</span>
          <span className="font-display text-3xl font-bold text-brand-600">{currentPoin} Poin</span>
        </div>
        <button className="bg-white text-brand-600 border border-brand-200 font-semibold px-4 py-2 rounded-lg text-sm transition hover:bg-brand-100 disabled:opacity-50" onClick={() => alert("Fitur riwayat masih dalam pengembangan")}>
          Riwayat Penukaran
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}
      {success && (
        <div className="mb-6 text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5">{success}</div>
      )}

      {barangList.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">
          Belum ada barang yang bisa ditukar saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {barangList.map((b) => {
            const cukup = currentPoin >= b.hargaPoin;
            const habis = b.stok <= 0;
            return (
              <div key={b.id} className="card p-4 flex flex-col bg-white border border-line rounded-xl">
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl font-display font-bold text-gray-300">
                  {b.namaBarang.charAt(0)}
                </div>
                <h3 className="font-bold text-ink mb-1">{b.namaBarang}</h3>
                <p className="text-xs text-ink/60 mb-2 flex-1">{b.deskripsi || "Tidak ada deskripsi"}</p>
                <div className="text-xs font-medium text-ink/40 mb-3">Stok: {b.stok}</div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-brand-600">{b.hargaPoin} Poin</span>
                  {habis ? (
                    <button disabled className="text-xs bg-gray-200 text-gray-500 font-semibold px-3 py-1.5 rounded cursor-not-allowed">Habis</button>
                  ) : cukup ? (
                    <button
                      onClick={() => handleTukar(b)}
                      disabled={loadingId === b.id}
                      className="text-xs bg-brand-500 text-white hover:bg-brand-600 font-semibold px-3 py-1.5 rounded transition disabled:opacity-50"
                    >
                      {loadingId === b.id ? "Memproses..." : "Tukar Poin"}
                    </button>
                  ) : (
                    <button disabled className="text-xs bg-gray-200 text-gray-500 font-semibold px-3 py-1.5 rounded cursor-not-allowed">Poin Kurang</button>
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
