"use client";

import { useEffect, useState } from "react";

type Barang = {
  id: string;
  namaBarang: string;
  hargaPoin: number;
  stok: number;
  deskripsi: string | null;
};

export default function KelolaBarangPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    namaBarang: "",
    hargaPoin: 100,
    stok: 10,
    deskripsi: "",
  });

  function load() {
    setLoading(true);
    fetch("/api/admin/barang")
      .then((res) => res.json())
      .then(setList)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.namaBarang.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/barang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        hargaPoin: Number(form.hargaPoin),
        stok: Number(form.stok),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return setError(data.error || "Gagal menambah barang");
    setForm({ namaBarang: "", hargaPoin: 100, stok: 10, deskripsi: "" });
    load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    const res = await fetch(`/api/admin/barang/${id}`, { method: "DELETE" });
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
        <h1 className="font-display text-2xl font-semibold text-ink">Katalog Barang (Tukar Poin)</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-xl">
          Kelola barang yang bisa ditukarkan oleh warga menggunakan poin reward mereka.
        </p>
      </div>

      <form onSubmit={handleAdd} className="card p-5 flex flex-col gap-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink mb-1">Nama Barang / Reward</label>
            <input
              type="text"
              className="input-field"
              value={form.namaBarang}
              onChange={(e) => setForm({ ...form, namaBarang: e.target.value })}
              placeholder="Contoh: Beras 5 KG"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1">Harga (Poin)</label>
            <input
              type="number"
              className="input-field"
              value={form.hargaPoin}
              onChange={(e) => setForm({ ...form, hargaPoin: e.target.valueAsNumber })}
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1">Stok Awal</label>
            <input
              type="number"
              className="input-field"
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.valueAsNumber })}
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1">Deskripsi Singkat</label>
            <input
              type="text"
              className="input-field"
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Deskripsi..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={submitting || !form.namaBarang.trim()} className="btn-primary">
            {submitting ? "Menyimpan..." : "Tambah Barang"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5 max-w-2xl">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Memuat...</p>
      ) : list.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">Belum ada barang di katalog. Tambah di atas.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Nama Barang</th>
                <th className="px-5 py-3 font-medium">Deskripsi</th>
                <th className="px-5 py-3 font-medium">Harga Poin</th>
                <th className="px-5 py-3 font-medium">Stok</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 font-medium text-ink">{b.namaBarang}</td>
                  <td className="px-5 py-3.5 text-ink/60">{b.deskripsi || "-"}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-brand-600">{b.hargaPoin} Pts</td>
                  <td className="px-5 py-3.5 font-mono text-ink/70">{b.stok}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      className="text-sm text-b3 font-medium hover:underline disabled:opacity-50"
                    >
                      {deletingId === b.id ? "Menghapus..." : "Hapus"}
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
