"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand-500 text-white p-12 relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-brand-400/30" />
        <div className="absolute -left-16 top-1/3 w-64 h-64 rounded-full bg-brand-600/40" />
        <div className="relative z-10">
          <span className="font-display font-semibold text-lg tracking-tight">Setor Sampah</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="font-display text-4xl font-semibold leading-tight max-w-md">
            Pilah dari rumah,<br />catat sampai tuntas.
          </h1>
          <p className="text-brand-50/90 max-w-sm text-sm leading-relaxed">
            Setiap setoran dipilah ke 4 kategori resmi — organik, anorganik, B3, dan residu —
            lalu diverifikasi tim pengelola sebelum masuk stok daur ulang.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              { c: "bg-organik", l: "Organik" },
              { c: "bg-anorganik", l: "Anorganik" },
              { c: "bg-b3", l: "B3" },
              { c: "bg-residu", l: "Residu" },
            ].map((k) => (
              <div key={k.l} className="flex items-center gap-1.5 text-xs text-brand-50/90">
                <span className={`w-2.5 h-2.5 rounded-full ${k.c}`} />
                {k.l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden mb-6">
            <span className="font-display font-semibold text-lg tracking-tight text-brand-600">Setor Sampah</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Masuk ke akunmu</h2>
            <p className="text-sm text-ink/60 mt-1">Gunakan email dan password yang terdaftar.</p>
          </div>

          {error && (
            <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-sm text-ink/60 text-center">
            Belum punya akun? <Link href="/register" className="text-brand-600 font-medium hover:underline">Daftar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
