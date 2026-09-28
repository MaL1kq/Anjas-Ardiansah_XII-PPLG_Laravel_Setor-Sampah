import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TopNav from "@/components/TopNav";

const items = [
  { href: "/dashboard", label: "Riwayat Setoran" },
  { href: "/setor", label: "Setor Sampah" },
  { href: "/tukar-poin", label: "Tukar Poin" },
];

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role === "ADMIN") redirect("/admin");

  return (
    <div className="min-h-screen bg-paper">
      <TopNav role="USER" nama={session.user?.name || ""} items={items} />
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
