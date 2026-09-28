import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RiwayatTable from "@/components/RiwayatTable";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const laporan = await prisma.laporanSampah.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { jenisSampah: true, wilayah: true, tags: true },
  });

  const totalApproved = laporan.filter((s) => s.status === "APPROVED").length;
  const totalPending = laporan.filter((s) => s.status === "PENDING").length;
  const totalRejected = laporan.filter((s) => s.status === "REJECTED").length;
  const totalKg = laporan
    .filter((s) => s.status === "APPROVED" && s.satuan === "KG")
    .reduce((sum, s) => sum + s.jumlah, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Dashboard Warga</h1>
          <p className="text-sm text-ink/60">Pantau seluruh riwayat setoran dan akumulasi poin reward Anda.</p>
        </div>
        <Link
          href="/setor"
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm"
        >
          + Setor Sampah Sekarang
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Setoran" value={`${laporan.length} Setoran`} sub="Semua kategori" accent="brand" />
        <StatCard label="Menunggu Verifikasi" value={`${totalPending} Setoran`} sub="Sedang ditinjau petugas" accent="anorganik" />
        <StatCard label="Disetujui" value={`${totalApproved} Setoran`} sub="Masuk stok daur ulang" accent="organik" />
      </div>

      <RiwayatTable laporan={JSON.parse(JSON.stringify(laporan))} />
    </div>
  );
}
