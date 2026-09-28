"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetoranActions({ id }: { id: string }) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function approve() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/setoran/${id}/approve`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Gagal menyetujui");
    router.push("/admin/setoran");
    router.refresh();
  }

  async function reject() {
    if (!alasan.trim()) {
      setError("Alasan penolakan wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/setoran/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alasanPenolakan: alasan }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Gagal menolak");
    router.push("/admin/setoran");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">{error}</div>
      )}

      {!showReject ? (
        <div className="flex gap-3">
          <button onClick={approve} disabled={loading} className="btn-primary">
            {loading ? "Memproses..." : "Setujui"}
          </button>
          <button onClick={() => setShowReject(true)} disabled={loading} className="btn-danger">
            Tolak
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-w-md">
          <div>
            <label className="label-field">Alasan penolakan</label>
            <textarea
              className="input-field"
              rows={3}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="cth. Foto tidak sesuai dengan jenis sampah yang dipilih"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={reject} disabled={loading} className="btn-danger">
              {loading ? "Memproses..." : "Konfirmasi tolak"}
            </button>
            <button onClick={() => setShowReject(false)} disabled={loading} className="btn-secondary">
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
