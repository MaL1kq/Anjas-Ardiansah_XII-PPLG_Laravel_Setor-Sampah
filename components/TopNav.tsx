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
    <>
      <header className="bg-brand-600 text-white text-xs py-2 px-4 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded font-semibold text-[11px] uppercase tracking-wider">GitHub Pages Preview</span>
          <span>Website Pengelolaan Sampah — Oleh Anjas Ardiansah</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/80">Lihat Tampilan Sebagai:</span>
          <Link href="/dashboard" className="bg-white text-brand-600 font-semibold px-2.5 py-1 rounded shadow-sm hover:bg-brand-50 transition">
             Warga (User)
          </Link>
          <Link href="/admin/dashboard" className="bg-brand-500 text-white/90 font-semibold px-2.5 py-1 rounded hover:bg-brand-400 transition">
             Admin TPU
          </Link>
        </div>
      </header>

      <nav className="bg-white border-b border-line sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href={role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-display font-bold text-lg text-ink tracking-tight">Setor Sampah</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 rounded-full">
                Role: {role === "ADMIN" ? "Admin" : "Warga"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              {items.map((item) => {
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-btn px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? "bg-brand-50 text-brand-600 font-semibold"
                        : "text-ink/70 hover:text-ink hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-5 w-px bg-line mx-1"></div>
            
            <Link
              href="/profil"
              className="nav-btn px-3 py-1.5 rounded-lg text-sm font-medium text-ink/70 hover:text-ink hover:bg-gray-100 transition flex items-center gap-1.5"
            >
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                {initials(nama)}
              </span>
              <span className="hidden md:inline truncate max-w-[120px]">{nama}</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-b3 bg-b3/10 hover:bg-b3/20 transition shrink-0"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
