import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TopNav from "@/components/TopNav";

const items = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/setoran", label: "Kelola Setoran" },
  { href: "/admin/jenis-sampah", label: "Jenis Sampah" },
  { href: "/admin/wilayah", label: "Wilayah" },
  { href: "/admin/tags", label: "Kelola Tag" },
  { href: "/admin/barang", label: "Katalog Barang" },
  { href: "/admin/penukaran", label: "Riwayat Tukar" },
  { href: "/admin/warga", label: "Warga" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-paper">
      <TopNav role="ADMIN" nama={session.user?.name || ""} items={items} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
