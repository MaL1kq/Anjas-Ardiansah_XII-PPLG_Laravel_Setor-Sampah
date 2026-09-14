"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KategoriBadge, StatusBadge } from "@/components/Badge";
import { SATUAN_LABEL, STATUS_LABEL } from "@/lib/labels";

type LaporanRow = {
  id: string;
  jenisSampah: { namaJenis: string };
  jumlah: number;
  satuan: string;
  wilayah: { id: string; namaWilayah: string };
  asalSetoranLainnya: string | null;
  status: string;
  createdAt: string;
  user: { nama: string; email: string };
  tags: { id: string; nama: string }[];
};

type WilayahOption = { id: string; namaWilayah: string };

export default function AdminSetoranPage() {
  const [data, setData] = useState<LaporanRow[]>([]);
  const [wilayahList, setWilayahList] = useState<WilayahOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [wilayahFilter, setWilayahFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/wilayah").then((res) => res.json()).then(setWilayahList);
  }, []);

  // Debounce pencarian biar gak nembak API tiap ketikan
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams({ all: "1" });
    if (statusFilter) params.set("status", statusFilter);
    if (wilayahFilter) params.set("wilayahId", wilayahFilter);
    if (search) params.set("q", search);

    setLoading(true);
    fetch(`/api/setoran?${params.toString()}`)
      .then((res) => res.json())
      .then((rows) => setData(rows))
      .finally(() => setLoading(false));
  }, [statusFilter, wilayahFilter, search]);

  function exportCsv() {
    const header = ["Nama", "Email", "Jenis", "Jumlah", "Satuan", "Wilayah", "Status", "Tanggal"];
    const rows = data.map((s) => [
      s.user.nama,
      s.user.email,
      s.jenisSampah.namaJenis,
      s.jumlah,
      SATUAN_LABEL[s.satuan],
      s.wilayah.namaWilayah.toLowerCase() === "lainnya" ? s.asalSetoranLainnya || "" : s.wilayah.namaWilayah,
      STATUS_LABEL[s.status],
      new Date(s.createdAt).toLocaleDateString("id-ID"),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-sampah-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isFiltering = statusFilter || wilayahFilter || search;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Kelola Setoran</h1>
          <p className="text-sm text-ink/60 mt-1">Tinjau, setujui, atau tolak laporan yang masuk.</p>
        </div>
        <Link href="/admin/setoran/tambah" className="btn-primary">+ Tambah Setoran</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            className="input-field"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama, email, atau tag..."
          />
        </div>
        <select className="input-field max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Semua status</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="input-field max-w-[180px]" value={wilayahFilter} onChange={(e) => setWilayahFilter(e.target.value)}>
          <option value="">Semua wilayah</option>
          {wilayahList.map((w) => <option key={w.id} value={w.id}>{w.namaWilayah}</option>)}
        </select>
        <button onClick={exportCsv} disabled={data.length === 0} className="btn-secondary ml-auto">
          Ekspor CSV
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-ink/50">Memuat...</p>
        ) : data.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/60">
            {isFiltering ? "Tidak ada laporan yang cocok dengan pencarian/filter ini." : "Belum ada laporan."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Warga</th>
                <th className="px-5 py-3 font-medium">Jenis</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Wilayah</th>
                <th className="px-5 py-3 font-medium">Tag</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{s.user.nama}</p>
                    <p className="text-xs text-ink/50">{s.user.email}</p>
                  </td>
                  <td className="px-5 py-3.5"><KategoriBadge nama={s.jenisSampah.namaJenis} /></td>
                  <td className="px-5 py-3.5 font-mono text-ink/80">{s.jumlah} {SATUAN_LABEL[s.satuan]}</td>
                  <td className="px-5 py-3.5 text-ink/70">
                    {s.wilayah.namaWilayah.toLowerCase() === "lainnya" ? s.asalSetoranLainnya : s.wilayah.namaWilayah}
                  </td>
                  <td className="px-5 py-3.5">
                    {s.tags.length === 0 ? (
                      <span className="text-ink/30">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {s.tags.map((t) => (
                          <span key={t.id} className="text-xs px-2 py-0.5 rounded-full border border-line text-ink/60">
                            {t.nama}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/setoran/${s.id}`} className="text-brand-600 text-sm font-medium hover:underline">
                      Tinjau
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
