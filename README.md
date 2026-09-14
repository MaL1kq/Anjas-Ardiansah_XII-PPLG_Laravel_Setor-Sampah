# Setor Sampah

Web app pemilahan & setor sampah — dibangun dengan Next.js 14 (App Router), Prisma, PostgreSQL, dan NextAuth.

## Fitur

**User**
- Register mandiri (selalu jadi akun role USER) dan login
- Setor sampah: pilih jenis (Organik/Anorganik/B3/Residu), jumlah + satuan (Kg/Pcs), asal setoran (Rumah/Sekolah/RT-RW/Lainnya), dan foto bukti opsional
- Riwayat setoran + status (Menunggu/Disetujui/Ditolak), lengkap dengan alasan bila ditolak
- Edit setoran — hanya selama status masih **Menunggu**

**Admin**
- Dashboard ringkasan yang lebih lengkap: total setoran, menunggu, disetujui, ditolak, jumlah warga terdaftar, stok per kategori, rekap per wilayah, dan daftar setoran terbaru
- Kelola setoran dengan **pencarian** (nama/email warga, wilayah, atau tag) plus filter status & asal wilayah
- **Ekspor CSV** dari daftar setoran yang sedang ditampilkan (ikut filter/pencarian aktif)
- Setujui (otomatis menambah stok kategori terkait) atau tolak (wajib isi alasan) setoran yang masuk
- **CRUD penuh**: tambah setoran manual atas nama warga manapun (untuk setoran offline) dengan status bisa dipilih langsung; edit setoran apapun statusnya (stok otomatis disesuaikan); hapus setoran (stok otomatis dikurangi kalau sebelumnya disetujui)
- **Kelola Tag** — buat/hapus tag bebas (mis. nama program, kondisi barang) dan tempelkan banyak tag ke satu setoran (relasi many-to-many)
- **Warga** — daftar akun warga terdaftar beserta rekap jumlah setoran (total/disetujui/menunggu/ditolak) per orang
- Akun admin dibuat lewat seed, bukan lewat form publik — register publik selalu membuat akun USER

Navigasi memakai tab horizontal di bagian atas (bukan sidebar) untuk kedua peran.

**Profil (semua peran)** — klik nama/avatar di kanan atas untuk membuka halaman profil: lihat statistik pribadi (total setoran, breakdown per kategori untuk warga; jumlah setoran diproses untuk admin), ubah nama, dan ganti password.

Skema `Poin` sudah disiapkan untuk fitur reward ke depannya (belum aktif dihitung); setiap setoran yang disetujui otomatis ditandai `siapDihitungPoin`.

## Relasi database

- **One-to-Many**: `User` → `Setoran` (sebagai penyetor, via `userId`), dan `User` (admin) → `Setoran` (sebagai yang memproses, via `approvedById`)
- **One-to-One**: `User` ↔ `Poin` (satu user, satu baris poin — disiapkan untuk fitur reward)
- **Many-to-Many**: `Setoran` ↔ `Tag` (satu setoran bisa punya banyak tag, satu tag bisa dipakai di banyak setoran)

## Setup

File `.env` di project ini **sudah diisi** sesuai database PostgreSQL lokal yang kamu buat (`setor_sampah`, user `anjas`). Kalau kamu pindah komputer atau ganti kredensial database, tinggal edit `.env` — bukan `.env.example`.

> ⚠️ Karena `.env` di sini berisi password database asli, **jangan upload folder ini ke GitHub publik atau bagikan ke orang lain** tanpa menghapus/mengganti isinya dulu. File `.env` sudah otomatis di-ignore oleh git (lihat `.gitignore`), jadi aman kalau kamu nanti `git init` + push — tapi zip ini sendiri belum di-strip.

> ℹ️ **Skema database berubah di versi ini** (nambah tabel `tags`). Kalau kamu extract ke folder baru, jalankan `npx prisma migrate dev --name init` seperti biasa — kalau muncul peringatan drift/reset karena migration history sebelumnya beda, ikuti instruksinya (pilih reset kalau data lama boleh hilang, lalu `npm run seed` lagi).

### 1. Install dependency

```bash
npm install
```

### 2. Migrasi database (kalau belum)

```bash
npx prisma migrate dev --name init
```

### 3. Seed akun admin + baris stok awal (kalau belum)

```bash
npm run seed
```

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — login pakai email/password admin dari `.env`, atau buat akun user langsung lewat Prisma Studio (`npx prisma studio`) karena belum ada form register publik.

## Struktur penting

```
prisma/schema.prisma      Model User, Setoran, Stok, Poin
app/login                 Halaman login
app/register               Halaman register (selalu bikin akun USER)
app/dashboard              Dashboard user (riwayat setoran)
app/setor                  Form setor sampah + edit (user)
app/admin                  Dashboard admin, kelola setoran (CRUD penuh), tambah/edit/hapus
app/api/register           API register publik
app/api/setoran            API create/list/edit setoran (user)
app/api/admin/...          API CRUD setoran, approve/reject, users, stok (khusus admin)
app/api/upload              Upload foto ke /public/uploads
middleware.ts               Proteksi route berdasarkan role
```

## Menambahkan user baru

Sekarang sudah ada halaman **register** (`/register`) — warga bisa daftar sendiri, otomatis jadi akun role USER. Admin tetap hanya dibuat lewat seed (`npm run seed`), tidak lewat form publik.

## Catatan

- Foto bukti disimpan di `public/uploads` (local filesystem) — folder ini di-gitignore isinya (kecuali `.gitkeep`), jadi hilang kalau redeploy ke platform serverless seperti Vercel. Untuk deploy production sungguhan, pertimbangkan pindah ke cloud storage.
- Field `Poin` sudah ada di skema tapi belum ada logic penghitungan — tinggal diaktifkan kapan saja tanpa migrasi ulang struktur besar.
