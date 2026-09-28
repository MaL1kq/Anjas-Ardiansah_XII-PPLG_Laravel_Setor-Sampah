"use client";

import { useEffect, useState, useRef } from "react";

type Barang = {
  id: string;
  namaBarang: string;
  hargaPoin: number;
  stok: number;
  deskripsi: string | null;
  gambarUrl: string | null;
};

export default function KelolaBarangPage() {
  const [list, setList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    namaBarang: "",
    hargaPoin: 100,
    stok: 10,
    deskripsi: "",
    gambarUrl: "",
  });

  function load() {
    setLoading(true);
    fetch("/api/admin/barang")
      .then((res) => res.json())
      .then(setList)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar");

      setForm((prev) => ({ ...prev, gambarUrl: data.url }));
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah file");
    } finally {
      setUploading(false);
    }
  }

  function handleStartEdit(b: Barang) {
    setEditingId(b.id);
    setError("");
    setSuccess("");
    setForm({
      namaBarang: b.namaBarang,
      hargaPoin: b.hargaPoin,
      stok: b.stok,
      deskripsi: b.deskripsi || "",
      gambarUrl: b.gambarUrl || "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ namaBarang: "", hargaPoin: 100, stok: 10, deskripsi: "", gambarUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.namaBarang.trim()) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/admin/barang/${editingId}` : "/api/admin/barang";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hargaPoin: Number(form.hargaPoin),
          stok: Number(form.stok),
          gambarUrl: form.gambarUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan barang");

      setSuccess(editingId ? "Data barang berhasil diperbarui." : "Barang baru berhasil ditambahkan.");
      handleCancelEdit();
      load();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    const res = await fetch(`/api/admin/barang/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Gagal menghapus");
      return;
    }
    setSuccess("Barang berhasil dihapus.");
    if (editingId === id) handleCancelEdit();
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Katalog Barang (Tukar Poin)</h1>
        <p className="text-sm text-ink/60 mt-1 max-w-xl">
          Kelola barang yang bisa ditukarkan oleh warga menggunakan poin reward mereka, lengkap dengan foto atau gambar produk.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4 max-w-2xl border-line">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">
            {editingId ? "Edit Data Barang" : "Tambah Barang Baru"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-b3 font-medium hover:underline"
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-xs font-medium text-ink mb-1">Stok Tersedia</label>
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
              placeholder="Deskripsi produk atau ketentuan..."
            />
          </div>
        </div>

        {/* Gambar Upload / URL */}
        <div className="border-t border-line pt-4 space-y-3">
          <label className="block text-xs font-medium text-ink">Foto atau Gambar Barang</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              className="text-xs text-ink/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
            />
            <span className="text-xs text-ink/40">atau ketik URL:</span>
            <input
              type="url"
              className="input-field text-xs flex-1"
              value={form.gambarUrl}
              onChange={(e) => setForm({ ...form, gambarUrl: e.target.value })}
              placeholder="https://contoh.com/gambar.jpg"
            />
          </div>

          {uploading && <p className="text-xs text-brand-600">Mengunggah gambar...</p>}

          {form.gambarUrl && (
            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-line">
              <img
                src={form.gambarUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md border border-line bg-white"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="text-xs text-ink/60 truncate flex-1">
                Preview Gambar: <span className="font-mono text-ink/80">{form.gambarUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm({ ...form, gambarUrl: "" });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-b3 hover:underline font-medium"
              >
                Hapus Foto
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink/70 hover:bg-gray-100 transition"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || uploading || !form.namaBarang.trim()}
            className="btn-primary"
          >
            {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Barang"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5 max-w-2xl">{error}</div>
      )}
      {success && (
        <div className="text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5 max-w-2xl">{success}</div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Memuat data...</p>
      ) : list.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink/60">Belum ada barang di katalog. Tambah di atas.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Foto</th>
                <th className="px-5 py-3 font-medium">Nama Barang</th>
                <th className="px-5 py-3 font-medium">Deskripsi</th>
                <th className="px-5 py-3 font-medium">Harga Poin</th>
                <th className="px-5 py-3 font-medium">Stok</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0 hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3">
                    {b.gambarUrl ? (
                      <img
                        src={b.gambarUrl}
                        alt={b.namaBarang}
                        className="w-12 h-12 object-cover rounded-lg border border-line bg-gray-50"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs text-ink/40">
                        No Pic
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ink">{b.namaBarang}</td>
                  <td className="px-5 py-3.5 text-ink/60">{b.deskripsi || "-"}</td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-brand-600 whitespace-nowrap">{b.hargaPoin} Pts</td>
                  <td className="px-5 py-3.5 font-mono text-ink/70">{b.stok}</td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="text-sm text-brand-600 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        disabled={deletingId === b.id}
                        className="text-sm text-b3 font-medium hover:underline disabled:opacity-50"
                      >
                        {deletingId === b.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
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
