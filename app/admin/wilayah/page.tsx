"use client";

import { useEffect, useState } from "react";

type Wilayah = { id: string; namaWilayah: string; createdAt: string; _count: { laporan: number } };

export default function KelolaWilayahPage() {
  const [list, setList] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/wilayah")
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
    const res = await fetch("/api/admin/wilayah", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaWilayah: nama.trim() }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return setError(data.error || "Gagal menambah wilayah");
    setNama("");
    load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    const res = await fetch(`/api/admin/wilayah/${id}`, { method: "DELETE" });
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
        <h1 className="font-display text-2xl font-semibold text-ink">Kelola Wilayah</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-xl">
          Master data asal setoran yang bisa dipilih warga. Tidak bisa dihapus kalau masih dipakai di
          laporan manapun.
        </p>
      </div>

      <form onSubmit={handleAdd} className="card p-5 flex gap-3 max-w-xl">
        <input
          type="text"
          className="input-field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama wilayah baru, cth. Kompleks Melati"
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
        <div className="card p-10 text-center text-sm text-ink/60">Belum ada wilayah. Tambah yang pertama di atas.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((w) => (
            <div key={w.id} className="card p-5 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{w.namaWilayah}</p>
                <p className="text-xs text-ink/50 mt-1">
                  Dipakai di <span className="font-mono">{w._count.laporan}</span> laporan
                </p>
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                disabled={deletingId === w.id}
                className="text-sm text-b3 font-medium hover:underline disabled:opacity-50 mt-4 self-start"
              >
                {deletingId === w.id ? "Menghapus..." : "Hapus wilayah"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
