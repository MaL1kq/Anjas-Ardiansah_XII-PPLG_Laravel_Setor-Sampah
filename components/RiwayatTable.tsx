"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KategoriBadge, StatusBadge } from "@/components/Badge";
import { SATUAN_LABEL } from "@/lib/labels";

type Row = {
  id: string;
  jenisSampah: { namaJenis: string };
  jumlah: number;
  satuan: string;
  wilayah: { namaWilayah: string };
  asalSetoranLainnya: string | null;
  status: string;
  alasanPenolakan: string | null;
  createdAt: string;
  tags: { id: string; nama: string }[];
};

export default function RiwayatTable({ laporan }: { laporan: Row[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return laporan;
    const needle = q.trim().toLowerCase();
    return laporan.filter((s) => {
      const haystack = [s.jenisSampah.namaJenis, s.wilayah.namaWilayah, ...s.tags.map((t) => t.nama)]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [q, laporan]);

  if (laporan.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm text-ink/60">Belum ada laporan. Yuk mulai pilah dan setor sampahmu.</p>
        <Link href="/setor" className="btn-primary inline-flex mt-4">+ Setor Sampah</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="input-field max-w-sm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari jenis, wilayah, atau tag..."
      />

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/60">Tidak ada laporan yang cocok dengan pencarian.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink/50 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Jenis</th>
                <th className="px-5 py-3 font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Wilayah</th>
                <th className="px-5 py-3 font-medium">Tag</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5"><KategoriBadge nama={s.jenisSampah.namaJenis} /></td>
                  <td className="px-5 py-3.5 font-mono text-ink/80">{s.jumlah} {SATUAN_LABEL[s.satuan]}</td>
                  <td className="px-5 py-3.5 text-ink/70">{s.wilayah.namaWilayah}</td>
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
                  <td className="px-5 py-3.5">
                    <StatusBadge status={s.status} />
                    {s.status === "REJECTED" && s.alasanPenolakan && (
                      <p className="text-xs text-ink/50 mt-1 max-w-[180px]">{s.alasanPenolakan}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-ink/60">
                    {new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {s.status === "PENDING" && (
                      <Link href={`/setor/${s.id}/edit`} className="text-brand-600 text-sm font-medium hover:underline">
                        Edit
                      </Link>
                    )}
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
