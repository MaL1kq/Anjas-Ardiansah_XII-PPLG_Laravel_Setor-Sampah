"use client";

import { useEffect, useState } from "react";

type JenisSampah = {
  id: string;
  namaJenis: string;
  createdAt: string;
  _count: { laporan: number };
  stok: { totalJumlah: number } | null;
};

export default function KelolaJenisSampahPage() {
  const [list, setList] = useState<JenisSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/jenis-sampah")
      .then((res) => res.json())
      .then(setList)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/jenis-sampah", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaJenis: nama.trim() }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return setError(data.error || "Gagal menambah jenis sampah");
    setNama("");
    load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    const res = await fetch(`/api/admin/jenis-sampah/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Gagal menghapus");
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Kelola Jenis Sampah</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-xl">
          Master data kategori sampah yang bisa dipilih warga saat setor. Tidak bisa dihapus kalau masih
          dipakai di laporan manapun.
        </p>
      </div>

      <form onSubmit={handleAdd} className="card p-5 flex gap-3 max-w-xl">
        <input
          type="text"
          className="input-field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama jenis sampah baru, cth. Elektronik"
          maxLength={40}
        />
        <button type="submit" disabled={submitting || !nama.trim()} className="btn-primary shrink-0">
          {submitting ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5 max-w-xl">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Memuat...</p>
      ) : list.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">Belum ada jenis sampah. Tambah yang pertama di atas.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Total Laporan</th>
                <th className="px-5 py-3 font-medium">Stok Terkumpul</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((j) => (
                <tr key={j.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ink">{j.namaJenis}</td>
                  <td className="px-5 py-3.5 font-mono text-ink/70">{j._count.laporan}</td>
                  <td className="px-5 py-3.5 font-mono text-ink/70">{j.stok?.totalJumlah ?? 0}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(j.id)}
                      disabled={deletingId === j.id}
                      className="text-sm text-b3 font-medium hover:underline disabled:opacity-50"
                    >
                      {deletingId === j.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
