import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/TopNav";
import { EditNamaForm, UbahPasswordForm } from "@/components/ProfileForms";
import { kategoriColor } from "@/lib/labels";

export const dynamic = "force-dynamic";

const ADMIN_ITEMS = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/setoran", label: "Kelola Setoran" },
  { href: "/admin/jenis-sampah", label: "Jenis Sampah" },
  { href: "/admin/wilayah", label: "Wilayah" },
  { href: "/admin/tags", label: "Kelola Tag" },
  { href: "/admin/warga", label: "Warga" },
];

const USER_ITEMS = [
  { href: "/dashboard", label: "Riwayat Setoran" },
  { href: "/setor", label: "Setor Sampah" },
];

const dotClass: Record<string, string> = {
  organik: "bg-organik",
  anorganik: "bg-anorganik",
  b3: "bg-b3",
  residu: "bg-residu",
};

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;
  const role = (session.user as any).role as "USER" | "ADMIN";

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  let statBlocks: { label: string; value: string }[] = [];
  let kategoriBreakdown: { nama: string; total: number }[] = [];

  if (role === "USER") {
    const laporan = await prisma.laporanSampah.findMany({ where: { userId }, include: { jenisSampah: true } });
    const approved = laporan.filter((s) => s.status === "APPROVED");
    statBlocks = [
      { label: "Total Laporan", value: String(laporan.length) },
      { label: "Disetujui", value: String(approved.length) },
      { label: "Menunggu", value: String(laporan.filter((s) => s.status === "PENDING").length) },
      { label: "Ditolak", value: String(laporan.filter((s) => s.status === "REJECTED").length) },
    ];
    const byKategori: Record<string, number> = {};
    for (const s of approved) {
      if (s.satuan !== "KG") continue;
      byKategori[s.jenisSampah.namaJenis] = (byKategori[s.jenisSampah.namaJenis] || 0) + s.jumlah;
    }
    kategoriBreakdown = Object.entries(byKategori).map(([nama, total]) => ({ nama, total }));
  } else {
    const diproses = await prisma.laporanSampah.count({ where: { approvedById: userId } });
    const totalWarga = await prisma.user.count({ where: { role: "USER" } });
    statBlocks = [
      { label: "Laporan Diproses", value: String(diproses) },
      { label: "Warga Terdaftar", value: String(totalWarga) },
    ];
  }

  return (
    <div className="min-h-screen bg-paper">
      <TopNav role={role} nama={user.nama} items={role === "ADMIN" ? ADMIN_ITEMS : USER_ITEMS} />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-brand-500 text-white text-lg font-semibold flex items-center justify-center shrink-0">
            {user.nama.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{user.nama}</h1>
            <p className="text-sm text-ink/60">
              {user.email} · {user.noHp} · {role === "ADMIN" ? "Admin" : "Warga"} · Terdaftar sejak{" "}
              {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-3 content-start">
            {statBlocks.map((s) => (
              <div key={s.label} className="card p-4">
                <p className="text-xs text-ink/50">{s.label}</p>
                <p className="font-display text-xl font-semibold font-mono text-ink mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {role === "USER" && (
            <div className="card p-5">
              <h3 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide mb-4">
                Kontribusi per Kategori
              </h3>
              {kategoriBreakdown.length === 0 ? (
                <p className="text-sm text-ink/50">Belum ada laporan yang disetujui dalam satuan Kg.</p>
              ) : (
                <div className="space-y-2.5">
                  {kategoriBreakdown.map((k) => (
                    <div key={k.nama} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink/70">
                        <span className={`w-2 h-2 rounded-full ${dotClass[kategoriColor(k.nama)]}`} />
                        {k.nama}
                      </span>
                      <span className="font-mono text-ink/60">{k.total.toFixed(1)} kg</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6">
            <h2 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide mb-4">
              Info Akun
            </h2>
            <EditNamaForm namaAwal={user.nama} />
          </section>

          <section className="card p-6">
            <h2 className="font-display text-sm font-semibold text-ink/80 uppercase tracking-wide mb-4">
              Ubah Password
            </h2>
            <UbahPasswordForm />
          </section>
        </div>
      </main>
    </div>
  );
}
