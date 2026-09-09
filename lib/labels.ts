// JENIS_SAMPAH_LABEL & ASAL_SETORAN_LABEL dihapus — sekarang JenisSampah dan Wilayah
// adalah tabel master data (bukan enum lagi), jadi namanya langsung diambil dari
// relasi (`laporan.jenisSampah.namaJenis`, `laporan.wilayah.namaWilayah`), bukan dari peta statis.

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export const SATUAN_LABEL: Record<string, string> = {
  KG: "Kg",
  PCS: "Pcs",
};

// Palet warna dipilih deterministik dari nama kategori (bukan key enum tetap lagi),
// supaya kategori baru yang dibuat admin tetap dapat warna yang konsisten.
const KATEGORI_PALETTE = ["organik", "anorganik", "b3", "residu"] as const;

export function kategoriColor(namaJenis: string): (typeof KATEGORI_PALETTE)[number] {
  let hash = 0;
  for (let i = 0; i < namaJenis.length; i++) hash = (hash * 31 + namaJenis.charCodeAt(i)) >>> 0;
  return KATEGORI_PALETTE[hash % KATEGORI_PALETTE.length];
}
