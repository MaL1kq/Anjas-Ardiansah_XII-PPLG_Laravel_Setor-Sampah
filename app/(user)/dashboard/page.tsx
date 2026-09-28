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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Riwayat Laporan</h1>
          <p className="text-sm text-ink/60 mt-1">Pantau status laporan setoran sampah kamu di sini.</p>
        </div>
        <Link href="/setor" className="btn-primary">+ Setor Sampah</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Laporan" value={String(laporan.length)} accent="brand" />
        <StatCard label="Disetujui" value={String(totalApproved)} sub={`${totalKg.toFixed(1)} kg terkumpul`} accent="organik" />
        <StatCard label="Menunggu" value={String(totalPending)} accent="anorganik" />
        <StatCard label="Ditolak" value={String(totalRejected)} accent="b3" />
      </div>

      <RiwayatTable laporan={JSON.parse(JSON.stringify(laporan))} />
    </div>
  );
}
