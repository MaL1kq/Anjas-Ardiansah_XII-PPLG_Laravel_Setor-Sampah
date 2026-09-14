import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SetoranForm from "@/components/SetoranForm";

export const dynamic = "force-dynamic";

export default async function EditSetoranPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const laporan = await prisma.laporanSampah.findUnique({
    where: { id: params.id },
    include: { tags: true, foto: true },
  });
  if (!laporan || laporan.userId !== userId) notFound();
  if (laporan.status !== "PENDING") redirect("/dashboard");

  const [jenisSampahList, wilayahList, tags] = await Promise.all([
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } }),
    prisma.tag.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Edit Laporan</h1>
        <p className="text-sm text-ink/60 mt-1">Hanya bisa diedit selama status masih menunggu.</p>
      </div>
      <SetoranForm
        jenisSampahList={jenisSampahList}
        wilayahList={wilayahList}
        tags={tags}
        initial={{
          id: laporan.id,
          jenisSampahId: laporan.jenisSampahId,
          jumlah: laporan.jumlah,
          satuan: laporan.satuan,
          wilayahId: laporan.wilayahId,
          fotoUrl: laporan.foto?.url || null,
          tagIds: laporan.tags.map((t) => t.id),
        }}
      />
    </div>
  );
}
