import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TukarPoinClient from "./TukarPoinClient";

export const dynamic = "force-dynamic";

export default async function TukarPoinPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const [poin, barangList] = await Promise.all([
    prisma.poin.findUnique({ where: { userId } }),
    prisma.barang.findMany({ orderBy: { namaBarang: "asc" } })
  ]);

  const totalPoin = poin?.totalPoin || 0;

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Toko Penukaran Poin</h1>
        <p className="text-sm text-ink/60">Tukarkan poin yang kamu kumpulkan dengan sembako atau uang tunai.</p>
      </div>

      <TukarPoinClient barangList={barangList} totalPoin={totalPoin} />
    </section>
  );
}
