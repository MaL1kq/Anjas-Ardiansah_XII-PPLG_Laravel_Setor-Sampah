"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type NavItem = { href: string; label: string };

function initials(nama: string) {
  const parts = nama.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function TopNav({
  role,
  nama,
  items,
}: {
  role: "USER" | "ADMIN";
  nama: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  const activeHref = [...items]
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <header className="border-b border-line bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center h-16 gap-8">
        <div className="flex items-baseline gap-2.5 shrink-0">
          <span className="font-display font-semibold text-lg tracking-tight text-brand-600">
            Setor Sampah
          </span>
          <span className="text-xs text-ink/40 hidden sm:inline">
            {role === "ADMIN" ? "Panel Admin" : "Panel Warga"}
          </span>
        </div>

        <nav className="flex items-stretch gap-6 flex-1 overflow-x-auto">
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center px-0.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  active
                    ? "border-brand-500 text-ink"
                    : "border-transparent text-ink/55 hover:text-ink hover:border-line"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/profil"
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-paper transition group"
          >
            <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
              {initials(nama)}
            </span>
            <span className="text-sm font-medium text-ink/80 group-hover:text-ink hidden sm:inline truncate max-w-[140px]">
              {nama}
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm font-medium text-b3/80 hover:text-white hover:bg-b3 border border-b3/25 hover:border-b3 rounded-card px-3 py-1.5 transition"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
