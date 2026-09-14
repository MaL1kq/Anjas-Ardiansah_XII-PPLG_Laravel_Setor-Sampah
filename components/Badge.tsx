import { STATUS_LABEL, kategoriColor } from "@/lib/labels";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        STATUS_STYLE[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}

const KATEGORI_STYLE: Record<string, string> = {
  organik: "bg-green-50 text-green-700 border-green-200",
  anorganik: "bg-blue-50 text-blue-700 border-blue-200",
  b3: "bg-rose-50 text-rose-700 border-rose-200",
  residu: "bg-gray-50 text-gray-700 border-gray-200",
};

// Dulu KategoriBadge nerima key enum (ORGANIK/ANORGANIK/dst) yang jumlahnya tetap 4.
// Sekarang JenisSampah tabel bebas (admin bisa nambah kategori baru kapan aja),
// jadi warnanya di-hash dari `nama` teksnya, bukan lookup langsung ke key tetap.
export function KategoriBadge({ nama }: { nama: string }) {
  const warna = kategoriColor(nama);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${KATEGORI_STYLE[warna]}`}
    >
      {nama}
    </span>
  );
}
