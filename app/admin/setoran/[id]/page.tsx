import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KategoriBadge, StatusBadge } from "@/components/Badge";
import { SATUAN_LABEL } from "@/lib/labels";
import SetoranActions from "@/components/SetoranActions";
import DeleteSetoranButton from "@/components/DeleteSetoranButton";

export const dynamic = "force-dynamic";

export default async function AdminSetoranDetail({ params }: { params: { id: string } }) {
  const laporan = await prisma.laporanSampah.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { nama: true, email: true } },
      approvedBy: { select: { nama: true } },
      jenisSampah: true,
      wilayah: true,
      foto: true,
      tags: true,
    },
  });
  if (!laporan) notFound();

  const isLainnya = laporan.wilayah.namaWilayah.toLowerCase() === "lainnya";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Tinjau Setoran</h1>
        <p className="text-sm text-ink/60 mt-1">Diajukan oleh {laporan.user.nama} ({laporan.user.email})</p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <KategoriBadge nama={laporan.jenisSampah.namaJenis} />
          <StatusBadge status={laporan.status} />
          {laporan.tags.map((t) => (
            <span key={t.id} className="text-xs px-2.5 py-1 rounded-full border border-line text-ink/60">
              {t.nama}
            </span>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink/50">Jumlah</dt>
            <dd className="font-mono text-ink mt-0.5">{laporan.jumlah} {SATUAN_LABEL[laporan.satuan]}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Wilayah</dt>
            <dd className="text-ink mt-0.5">
              {isLainnya ? laporan.asalSetoranLainnya : laporan.wilayah.namaWilayah}
            </dd>
          </div>
          <div>
            <dt className="text-ink/50">Tanggal setor</dt>
            <dd className="text-ink mt-0.5">
              {new Date(laporan.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </dd>
          </div>
          {laporan.approvedBy && (
            <div>
              <dt className="text-ink/50">Diproses oleh</dt>
              <dd className="text-ink mt-0.5">{laporan.approvedBy.nama}</dd>
            </div>
          )}
        </dl>

        {laporan.foto && (
          <div>
            <p className="text-ink/50 text-sm mb-2">Foto bukti</p>
            <img src={laporan.foto.url} alt="Bukti setoran" className="w-56 h-56 object-cover rounded-card border border-line" />
          </div>
        )}

        {laporan.status === "REJECTED" && laporan.alasanPenolakan && (
          <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">
            Alasan penolakan: {laporan.alasanPenolakan}
          </div>
        )}
      </div>

      {laporan.status === "PENDING" && <SetoranActions id={laporan.id} />}

      <div className="flex items-center gap-4 pt-2 border-t border-line">
        <Link href={`/admin/setoran/${laporan.id}/edit`} className="btn-secondary">
          Edit data
        </Link>
        <DeleteSetoranButton id={laporan.id} />
      </div>
    </div>
  );
}
