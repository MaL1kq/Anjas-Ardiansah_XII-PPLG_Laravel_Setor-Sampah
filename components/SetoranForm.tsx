"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SATUAN_LABEL, kategoriColor } from "@/lib/labels";

type Option = { id: string; namaJenis?: string; namaWilayah?: string };
type TagOption = { id: string; nama: string };

type InitialData = {
  id?: string;
  jenisSampahId?: string;
  jumlah?: number;
  satuan?: string;
  wilayahId?: string;
  asalSetoranLainnya?: string | null;
  fotoUrl?: string | null;
  tagIds?: string[];
};

const dotClass: Record<string, string> = {
  organik: "bg-organik",
  anorganik: "bg-anorganik",
  b3: "bg-b3",
  residu: "bg-residu",
};

export default function SetoranForm({
  jenisSampahList,
  wilayahList,
  tags,
  initial,
}: {
  jenisSampahList: Option[];
  wilayahList: Option[];
  tags?: TagOption[];
  initial?: InitialData;
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jenisSampahId, setJenisSampahId] = useState(initial?.jenisSampahId || jenisSampahList[0]?.id || "");
  const [jumlah, setJumlah] = useState(initial?.jumlah?.toString() || "");
  const [satuan, setSatuan] = useState(initial?.satuan || "KG");
  const [wilayahId, setWilayahId] = useState(initial?.wilayahId || wilayahList[0]?.id || "");
  const [asalLainnya, setAsalLainnya] = useState(initial?.asalSetoranLainnya || "");
  const [fotoUrl, setFotoUrl] = useState<string | null>(initial?.fotoUrl || null);
  const [fotoNama, setFotoNama] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initial?.tagIds || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const jenisAktif = jenisSampahList.find((j) => j.id === jenisSampahId);
  const wilayahAktif = wilayahList.find((w) => w.id === wilayahId);
  const isLainnya = wilayahAktif?.namaWilayah?.toLowerCase() === "lainnya";

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoNama(file.name);
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Gagal mengunggah foto");
      return;
    }
    setFotoUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      jenisSampahId,
      jumlah: Number(jumlah),
      satuan,
      wilayahId,
      asalSetoranLainnya: isLainnya ? asalLainnya : null,
      fotoUrl,
      tagIds: selectedTagIds,
    };

    const res = await fetch(isEdit ? `/api/setoran/${initial!.id}` : "/api/setoran", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Terjadi kesalahan");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      <form onSubmit={handleSubmit} className="card overflow-hidden">
        {error && (
          <div className="mx-6 mt-6 text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">
            {error}
          </div>
        )}

        <section className="p-6 space-y-4">
          <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide">
            Jenis &amp; Jumlah
          </h3>

          {jenisSampahList.length === 0 ? (
            <p className="text-sm text-ink/50">
              Belum ada data jenis sampah. Minta admin menambahkannya dulu di halaman Jenis Sampah.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {jenisSampahList.map((j) => {
                const active = jenisSampahId === j.id;
                const dot = dotClass[kategoriColor(j.namaJenis!)];
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => setJenisSampahId(j.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-card border text-sm font-medium text-left transition ${
                      active
                        ? "border-brand-500 bg-white text-ink shadow-sm ring-1 ring-brand-500"
                        : "border-line bg-white text-ink/60 hover:border-ink/25"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${dot}`} />
                    {j.namaJenis}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="label-field">Jumlah</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                className="input-field"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="cth. 2.5"
              />
            </div>
            <div>
              <label className="label-field">Satuan</label>
              <select className="input-field" value={satuan} onChange={(e) => setSatuan(e.target.value)}>
                <option value="KG">Kilogram (Kg)</option>
                <option value="PCS">Buah (Pcs)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="border-t border-line" />

        <section className="p-6 space-y-4">
          <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide">
            Wilayah
          </h3>
          <div>
            <label className="label-field">Kamu setor untuk wilayah apa?</label>
            <select className="input-field" value={wilayahId} onChange={(e) => setWilayahId(e.target.value)}>
              {wilayahList.map((w) => (
                <option key={w.id} value={w.id}>{w.namaWilayah}</option>
              ))}
            </select>
            {isLainnya && (
              <input
                type="text"
                required
                className="input-field mt-2.5"
                value={asalLainnya}
                onChange={(e) => setAsalLainnya(e.target.value)}
                placeholder="Sebutkan, cth. Kompleks Melati Blok C"
              />
            )}
          </div>
        </section>

        <div className="border-t border-line" />

        <section className="p-6 space-y-4">
          <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide">
            Bukti Foto <span className="text-ink/40 normal-case font-normal tracking-normal">(opsional)</span>
          </h3>

          <div className="flex items-start gap-4">
            {fotoUrl ? (
              <img src={fotoUrl} alt="Bukti setoran" className="w-24 h-24 object-cover rounded-card border border-line shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-card border border-dashed border-line flex items-center justify-center text-xs text-ink/30 shrink-0">
                Belum ada
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                disabled={uploading}
              >
                {uploading ? "Mengunggah..." : fotoUrl ? "Ganti foto" : "Pilih foto"}
              </button>
              <p className="text-xs text-ink/50">
                {fotoNama || "JPG, PNG, atau WEBP. Maksimal 4MB."}
              </p>
            </div>
          </div>
        </section>

        {tags && tags.length > 0 && (
          <>
            <div className="border-t border-line" />
            <section className="p-6 space-y-4">
              <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide">
                Tag <span className="text-ink/40 normal-case font-normal tracking-normal">(opsional)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                        active
                          ? "border-brand-500 bg-brand-50 text-brand-600"
                          : "border-line bg-white text-ink/60 hover:border-ink/25"
                      }`}
                    >
                      {tag.nama}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <div className="border-t border-line p-6">
          <button type="submit" disabled={submitting || uploading || !jenisSampahId || !wilayahId || (isLainnya && !asalLainnya.trim())} className="btn-primary w-full">
            {submitting ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Setor sekarang"}
          </button>
        </div>
      </form>

      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="card p-5">
          <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide mb-4">
            Ringkasan
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink/50">Jenis</dt>
              <dd className="flex items-center gap-1.5 font-medium text-ink">
                {jenisAktif && (
                  <span className={`w-2 h-2 rounded-full ${dotClass[kategoriColor(jenisAktif.namaJenis!)]}`} />
                )}
                {jenisAktif?.namaJenis || "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/50">Jumlah</dt>
              <dd className="font-mono text-ink">{jumlah ? `${jumlah} ${SATUAN_LABEL[satuan]}` : "—"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/50">Wilayah</dt>
              <dd className="font-medium text-ink text-right max-w-[140px] truncate">
                {isLainnya ? (asalLainnya || "—") : (wilayahAktif?.namaWilayah || "—")}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/50">Foto</dt>
              <dd className="font-medium text-ink">{fotoUrl ? "Terlampir" : "Tidak ada"}</dd>
            </div>
          </dl>
          <p className="text-xs text-ink/40 mt-4 pt-4 border-t border-line">
            Laporan akan berstatus <span className="font-medium text-anorganik">Menunggu</span> sampai
            ditinjau oleh admin.
          </p>
        </div>
      </div>
    </div>
  );
}
