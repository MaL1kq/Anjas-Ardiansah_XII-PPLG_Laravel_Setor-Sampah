import React from 'react';

export default function TukarPoinPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Toko Penukaran Poin</h1>
        <p className="text-sm text-ink/60">Tukarkan poin yang kamu kumpulkan dengan sembako atau uang tunai.</p>
      </div>

      <div className="card p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-50 border-brand-200 rounded-xl">
        <div>
          <span className="text-xs text-brand-600 font-semibold block mb-1">Total Poin Kamu Saat Ini:</span>
          <span className="font-display text-3xl font-bold text-brand-600">325 Poin</span>
        </div>
        <button className="bg-white text-brand-600 border border-brand-200 font-semibold px-4 py-2 rounded-lg text-sm transition hover:bg-brand-100">
          Riwayat Penukaran
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Item 1 */}
        <div className="card p-4 flex flex-col bg-white border border-line rounded-xl">
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">Uang</div>
          <h3 className="font-bold text-ink mb-1">Uang Tunai Rp 50.000</h3>
          <p className="text-xs text-ink/60 mb-3 flex-1">Penarikan saldo tunai langsung ke rekening atau e-wallet (GoPay/OVO/Dana).</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold text-brand-600">500 Poin</span>
            <button className="text-xs bg-gray-200 text-gray-500 font-semibold px-3 py-1.5 rounded cursor-not-allowed">Poin Kurang</button>
          </div>
        </div>
        {/* Item 2 */}
        <div className="card p-4 flex flex-col bg-white border border-line rounded-xl">
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">Beras</div>
          <h3 className="font-bold text-ink mb-1">Beras 5 KG</h3>
          <p className="text-xs text-ink/60 mb-3 flex-1">Beras premium ukuran 5 KG. Bisa diambil langsung di bank sampah.</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold text-brand-600">300 Poin</span>
            <button className="text-xs bg-brand-500 text-white hover:bg-brand-600 font-semibold px-3 py-1.5 rounded transition">Tukar Poin</button>
          </div>
        </div>
        {/* Item 3 */}
        <div className="card p-4 flex flex-col bg-white border border-line rounded-xl">
          <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">Sabun</div>
          <h3 className="font-bold text-ink mb-1">Sabun & Sunlight</h3>
          <p className="text-xs text-ink/60 mb-3 flex-1">Paket kebersihan rumah tangga berisi sabun cuci piring dan sabun mandi.</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold text-brand-600">150 Poin</span>
            <button className="text-xs bg-brand-500 text-white hover:bg-brand-600 font-semibold px-3 py-1.5 rounded transition">Tukar Poin</button>
          </div>
        </div>
      </div>
    </section>
  );
}
