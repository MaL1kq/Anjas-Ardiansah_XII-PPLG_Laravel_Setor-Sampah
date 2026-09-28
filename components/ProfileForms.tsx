"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditNamaForm({ namaAwal }: { namaAwal: string }) {
  const router = useRouter();
  const [nama, setNama] = useState(namaAwal);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) return setError(data.error || "Gagal menyimpan");
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}
      {success && (
        <div className="text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5">
          Nama berhasil diperbarui. Tampilan penuh terlihat setelah login ulang.
        </div>
      )}
      <div>
        <label className="label-field">Nama lengkap</label>
        <input type="text" required className="input-field" value={nama} onChange={(e) => setNama(e.target.value)} />
      </div>
      <button type="submit" disabled={submitting || nama.trim() === namaAwal} className="btn-primary">
        {submitting ? "Menyimpan..." : "Simpan nama"}
      </button>
    </form>
  );
}

export function UbahPasswordForm() {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (passwordBaru !== konfirmasi) {
      setError("Konfirmasi password baru tidak cocok");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/profil/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passwordLama, passwordBaru }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) return setError(data.error || "Gagal mengubah password");
    setSuccess(true);
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasi("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}
      {success && (
        <div className="text-sm text-organik bg-organik/10 border border-organik/20 rounded-card px-3.5 py-2.5">
          Password berhasil diperbarui.
        </div>
      )}
      <div>
        <label className="label-field">Password lama</label>
        <input type="password" required className="input-field" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field">Password baru</label>
          <input type="password" required minLength={6} className="input-field" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Konfirmasi</label>
          <input type="password" required minLength={6} className="input-field" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Menyimpan..." : "Ubah password"}
      </button>
    </form>
  );
}
