"use client";

import { useEffect, useState } from "react";

type Tag = { id: string; nama: string; createdAt: string; _count: { laporan: number } };

export default function KelolaTagPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/admin/tags")
      .then((res) => res.json())
      .then(setTags)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: nama.trim() }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return setError(data.error || "Gagal membuat tag");
    setNama("");
    load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  }

  const totalPemakaian = tags.reduce((sum, t) => sum + t._count.laporan, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Kelola Tag</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-xl">
            Tag dipakai buat mengategorikan setoran secara bebas (mis. program tertentu, kondisi barang).
            Satu setoran bisa punya banyak tag, dan satu tag bisa dipakai di banyak setoran.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card px-4 py-3">
            <p className="text-xs text-ink/50">Total Tag</p>
            <p className="font-display text-xl font-semibold font-mono text-ink mt-0.5">{tags.length}</p>
          </div>
          <div className="card px-4 py-3">
            <p className="text-xs text-ink/50">Total Pemakaian</p>
            <p className="font-display text-xl font-semibold font-mono text-ink mt-0.5">{totalPemakaian}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="card p-5 flex gap-3 max-w-xl">
        <input
          type="text"
          className="input-field"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama tag baru, cth. Program RW 05"
          maxLength={30}
        />
        <button type="submit" disabled={submitting || !nama.trim()} className="btn-primary shrink-0">
          {submitting ? "Menyimpan..." : "Tambah Tag"}
        </button>
      </form>

      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5 max-w-xl">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Memuat...</p>
      ) : tags.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">Belum ada tag. Buat yang pertama di atas.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="card p-5 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{tag.nama}</p>
                <p className="text-xs text-ink/50 mt-1">
                  Dipakai di <span className="font-mono">{tag._count.laporan}</span> laporan
                </p>
              </div>
              <button
                onClick={() => handleDelete(tag.id)}
                disabled={deletingId === tag.id}
                className="text-sm text-b3 font-medium hover:underline disabled:opacity-50 mt-4 self-start"
              >
                {deletingId === tag.id ? "Menghapus..." : "Hapus tag"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
