"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi noHp sebelum submit
    if (!noHp || noHp.length < 10) {
      setError("Nomor HP minimal 10 digit");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, email, noHp, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Gagal mendaftar");
      return;
    }

    // Auto login setelah berhasil daftar
    const loginRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (loginRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand-500 text-white p-12 relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-brand-400/30" />
        <div className="absolute -left-16 top-1/3 w-64 h-64 rounded-full bg-brand-600/40" />
        <div className="relative z-10 flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain bg-white/20 p-1 rounded-lg" />
          <span className="font-display font-semibold text-lg tracking-tight">Setor Sampah</span>
        </div>
        <div className="relative z-10 space-y-3">
          <h1 className="font-display text-4xl font-semibold leading-tight max-w-md">
            Daftar dulu,<br />baru mulai setor.
          </h1>
          <p className="text-brand-50/90 max-w-sm text-sm leading-relaxed">
            Akun yang kamu daftarkan di sini otomatis jadi akun warga — untuk setor dan pantau
            status setoranmu sendiri.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-display font-semibold text-lg tracking-tight text-brand-600">Setor Sampah</span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Buat akun</h2>
            <p className="text-sm text-ink/60 mt-1">Daftar sebagai warga untuk mulai setor sampah.</p>
          </div>

          {error && (
            <div className="text-sm text-b3 bg-b3/10 border border-b3/20 rounded-card px-3.5 py-2.5">
              {error}
            </div>
          )}

          {/* NAMA LENGKAP */}
          <div>
            <label className="label-field">Nama lengkap</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              placeholder="cth. Anjas Pratama" 
            />
          </div>

          {/* EMAIL */}
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

          {/* NOMOR HP - INI YANG DITAMBAHKAN */}
          <div>
            <label className="label-field">Nomor HP</label>
            <input 
              type="tel" 
              required 
              className="input-field" 
              value={noHp} 
              onChange={(e) => setNoHp(e.target.value)} 
              placeholder="081234567890" 
              minLength={10}
              maxLength={15}
            />
            <p className="text-xs text-ink/50 mt-1">Minimal 10 digit angka</p>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="label-field">Password</label>
            <input 
              type="password" 
              required 
              minLength={6} 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="minimal 6 karakter" 
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <p className="text-sm text-ink/60 text-center">
            Sudah punya akun? <Link href="/login" className="text-brand-600 font-medium hover:underline">Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  );
}