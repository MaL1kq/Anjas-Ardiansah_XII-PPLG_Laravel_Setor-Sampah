"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSetoranButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/setoran/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Gagal menghapus");
      return;
    }
    router.push("/admin/setoran");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn-secondary text-b3 border-b3/25">
        Hapus
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-b3">{error}</p>}
      <p className="text-sm text-ink/70">Yakin hapus laporan ini? Foto dan tag yang menempel ikut terhapus.</p>
      <div className="flex gap-3">
        <button onClick={handleDelete} disabled={loading} className="btn-danger">
          {loading ? "Menghapus..." : "Ya, hapus"}
        </button>
        <button onClick={() => setConfirming(false)} disabled={loading} className="btn-secondary">
          Batal
        </button>
      </div>
    </div>
  );
}
