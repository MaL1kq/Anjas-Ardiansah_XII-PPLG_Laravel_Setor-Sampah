const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  PageNumber
} = require('docx');

const screenshotsDir = path.join(__dirname, '..', 'screenshots');

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: "1B5E20",
        font: "Calibri"
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: "2E7D32",
        font: "Calibri"
      })
    ]
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22, // 11pt
        color: "333333",
        font: "Calibri"
      })
    ]
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { after: 140, line: 300 }, // 1.25 line spacing
    alignment: options.alignment || AlignmentType.BOTH,
    children: [
      new TextRun({
        text,
        size: 22, // 11pt
        font: "Calibri",
        color: "222222",
        ...options
      })
    ]
  });
}

function createBullet(text, boldPrefix = "") {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 280 },
    children: [
      ...(boldPrefix ? [new TextRun({ text: boldPrefix + " ", bold: true, size: 22, font: "Calibri" })] : []),
      new TextRun({ text, size: 22, font: "Calibri" })
    ]
  });
}

function createImageParagraph(imageFileName, caption, width, height) {
  const imgPath = path.join(screenshotsDir, imageFileName);
  if (!fs.existsSync(imgPath)) {
    return [createParagraph(`[Gambar ${imageFileName} tidak ditemukan]`)];
  }
  const imgBuffer = fs.readFileSync(imgPath);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: { width, height },
          type: 'png'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: caption,
          italics: true,
          bold: true,
          size: 19, // 9.5pt
          color: "555555",
          font: "Calibri"
        })
      ]
    })
  ];
}

function createStyledTable(headers, rows) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h) => new TableCell({
        borders,
        shading: { fill: "2E7D32" },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20, font: "Calibri" })]
          })
        ]
      }))
    }),
    ...rows.map((row, idx) => new TableRow({
      children: row.map((cellText, cellIdx) => new TableCell({
        borders,
        shading: { fill: idx % 2 === 0 ? "F9FBF9" : "FFFFFF" },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            alignment: cellIdx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [new TextRun({ text: cellText, size: 19, font: "Calibri", color: "333333" })]
          })
        ]
      }))
    }))
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

async function buildDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Dokumentasi Proyek Web Pengelolaan Sampah Terintegrasi Basis Data", italics: true, size: 16, color: "888888" })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Halaman ", size: 18, color: "888888" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })
                ]
              })
            ]
          })
        },
        children: [
          // COVER PAGE
          new Paragraph({ spacing: { before: 1000 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "LAPORAN DOKUMENTASI PROYEK BASIS DATA",
                bold: true,
                size: 28,
                color: "555555",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: "SISTEM INFORMASI PENGELOLAAN & SETOR SAMPAH MANDIRI BERBASIS WEB TERINTEGRASI RDBMS",
                bold: true,
                size: 36,
                color: "1B5E20",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
            children: [
              new TextRun({
                text: "Aplikasi Web Pemilahan Sampah (Next.js 14, Prisma ORM, PostgreSQL) dengan Pengamanan Constraint, Relasi Antar-Entitas, dan Rencana Transaksi Poin Reward",
                italics: true,
                size: 22,
                color: "444444"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 120 },
            children: [
              new TextRun({ text: "Disusun Oleh:", bold: true, size: 22 })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Nama Siswa: ", size: 24 }),
              new TextRun({ text: "Anjas Ardiansah", bold: true, size: 26, color: "1B5E20" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({ text: "Nomor Absen: ", size: 24 }),
              new TextRun({ text: "[Nomor Absen]", bold: true, size: 26, color: "1B5E20" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Tahun Ajaran 2026", bold: true, size: 22, color: "666666" })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // DAFTAR ISI RINGKAS
          createHeading1("DAFTAR ISI"),
          createBullet("Latar Belakang dan Tujuan Aplikasi", "BAB I PENDAHULUAN:"),
          createBullet("Arsitektur Teknologi dan Peran Pengguna", ""),
          createBullet("Penerapan Relasi Entitas (1:1, 1:N, M:N)", "BAB II INTEGRASI BASIS DATA (RDBMS & CONSTRAINT):"),
          createBullet("Katalog Constraint Integritas Data", ""),
          createBullet("Struktur Tabel dan Kamus Data", ""),
          createBullet("Halaman Autentikasi (Login & Registrasi)", "BAB III DOKUMENTASI ANTARMUKA PENGGUNA (WEB):"),
          createBullet("Antarmuka Warga (Dashboard, Setor Sampah, Profil)", ""),
          createBullet("Antarmuka Admin TPU (Dashboard, Kelola Setoran, Tag, Warga)", ""),
          createBullet("Konsep dan Aturan Transaksi Poin", "BAB IV RENCANA PROSES TRANSAKSI POIN & REWARD:"),
          createBullet("Use Case Diagram Transaksi", ""),
          createBullet("Activity Diagram Alur Transaksi Penukaran Hadiah", ""),
          createBullet("Entity Relationship Diagram (ERD) Sistem Saat Ini", "BAB V ENTITY RELATIONSHIP DIAGRAM (ERD):"),
          createBullet("Entity Relationship Diagram (ERD) Rencana Transaksi Poin", ""),
          createBullet("Kesimpulan dan Pengembangan Masa Depan", "BAB VI PENUTUP:"),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB I
          createHeading1("BAB I: PENDAHULUAN"),
          createHeading2("1.1 Latar Belakang"),
          createParagraph(
            "Masalah pengelolaan sampah di lingkungan perkotaan maupun pemukiman warga membutuhkan sistem pencatatan yang akurat, transparan, dan terstruktur. Aplikasi Web Setor Sampah dibangun untuk memfasilitasi warga masyarakat dalam memilah dan menyetorkan sampah berdasarkan kategori resmi, serta membantu tim pengelola tempat pengelolaan sampah (TPU/Bank Sampah) dalam memverifikasi setoran dan memantau ketersediaan stok sampah daur ulang."
          ),
          createParagraph(
            "Sistem ini dirancang secara terpadu dengan Basis Data Relasional (RDBMS) modern untuk menjamin keutuhan data (data integrity) melalui berbagai aturan constraint (Primary Key, Foreign Key, Unique, Not Null, Default, Check, Enum, dan Cascading Rules)."
          ),

          createHeading2("1.2 Arsitektur dan Tumpukan Teknologi"),
          createParagraph(
            "Aplikasi dibangun menggunakan teknologi web modern full-stack dengan pemisahan lapisan logika dan data yang terstruktur:"
          ),
          createStyledTable(
            ["Komponen", "Teknologi", "Keterangan / Fungsi"],
            [
              ["Frontend Framework", "Next.js 14 (App Router) & React 18", "Rendering server-side dan client-side modern, UI responsif."],
              ["Styling / Desain", "Tailwind CSS", "Antarmuka berbasis utility-first dengan palet warna ramah lingkungan."],
              ["Database (RDBMS)", "PostgreSQL 17", "Sistem manajemen basis data relasional andal dan berkemampuan tinggi."],
              ["Object-Relational Mapping", "Prisma ORM 5", "Manajemen skema database, migrasi terstruktur, dan type-safe query."],
              ["Autentikasi & Keamanan", "NextAuth.js v4 & Bcrypt.js", "Manajemen sesi pengguna berbasis token dan hashing password."],
              ["Validasi Data", "Zod", "Skema validasi input form dan API request untuk mencegah data invalid."],
              ["Bahasa Pemrograman", "TypeScript", "Menjamin keamanan tipe data pada sisi klien maupun server."]
            ]
          ),

          createHeading2("1.3 Pembagian Peran Pengguna (Role System)"),
          createParagraph(
            "Aplikasi membagi hak akses ke dalam dua peran utama menggunakan ENUM Role:"
          ),
          createBullet("Dapat mendaftar mandiri secara publik melalui formulir registrasi. Warga memiliki hak akses untuk mengajukan setoran sampah, mengunggah foto bukti, memantau riwayat setoran, mengubah data setoran selama masih berstatus 'Menunggu' (PENDING), dan melihat ringkasan statistik pribadi.", "1. Peran Warga (USER):"),
          createBullet("Hanya dapat dibuat melalui proses database seeding terproteksi demi alasan keamanan operasional. Admin bertugas meninjau setoran masuk, memverifikasi (setujui/tolak) setoran, mengelola stok sampah daur ulang, melakukan entri transaksi offline (CRUD manual), mengelola master data wilayah, jenis sampah, label tags, serta melihat rekapitulasi data warga.", "2. Peran Administrator (ADMIN):"),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB II
          createHeading1("BAB II: INTEGRASI BASIS DATA (RDBMS & CONSTRAINT)"),
          createHeading2("2.1 Implementasi Sistem Basis Data Relasional"),
          createParagraph(
            "Sistem basis data dirancang secara normalisasi dengan memecah entitas data ke dalam tabel-tabel terpisah guna menghindari anomali penyisipan, pembaruan, maupun penghapusan data. Struktur database saat ini terdiri dari 8 tabel utama yang saling berelasi:"
          ),
          createBullet("Menyimpan kredensial autentikasi pengguna, peran (USER/ADMIN), nomor HP, dan profil.", "1. users:"),
          createBullet("Tabel master data yang mendefinisikan 4 kategori resmi sampah (Organik, Anorganik, B3, Residu).", "2. jenis_sampah:"),
          createBullet("Tabel master data sumber asal setoran (Rumah, Sekolah, RT/RW, dan Lainnya).", "3. wilayah:"),
          createBullet("Tabel transaksi utama penyetoran sampah yang mencatat kuantitas, satuan, status, dan waktu.", "4. laporan_sampah:"),
          createBullet("Tabel penyimpan tautan berkas foto dokumentasi timbangan atau fisik sampah (Relasi 1:1).", "5. foto_sampah:"),
          createBullet("Tabel label dinamis seperti 'Prioritas', 'Volume Besar', dan 'Kerjasama Event' (Relasi M:N).", "6. tags:"),
          createBullet("Tabel jembatan (junction table) otomatis yang menghubungkan setoran sampah dengan banyak label tag.", "7. _LaporanTags:"),
          createBullet("Tabel pencatatan saldo agregat material sampah per kategori yang otomatis bertambah saat disetujui.", "8. stok:"),
          createBullet("Tabel penyimpanan saldo poin reward warga untuk rencana transaksi masa depan.", "9. poin:"),

          createHeading2("2.2 Penjelasan Constraint Basis Data"),
          createParagraph(
            "Constraint diterapkan secara ketat pada tingkat skema database PostgreSQL untuk memastikan integritas dan konsistensi data:"
          ),
          createStyledTable(
            ["Jenis Constraint", "Tabel & Kolom Penerapan", "Fungsi & Perilaku"],
            [
              ["PRIMARY KEY (PK)", "Seluruh tabel (kolom id tipe UUID)", "Menjamin setiap baris data memiliki pengenal unik dan tidak bernilai ganda."],
              ["FOREIGN KEY (FK)", "laporan_sampah.userId, jenisSampahId, wilayahId", "Menghubungkan data setoran dengan tabel induk pengguna, kategori, dan wilayah."],
              ["UNIQUE CONSTRAINT", "users.email, users.noHp, jenis_sampah.namaJenis", "Mencegah duplikasi pendaftaran email/noHp warga dan nama jenis sampah."],
              ["NOT NULL", "users.nama, users.password, laporan_sampah.jumlah", "Menolak masukan data kosong pada kolom-kolom kritis sistem."],
              ["DEFAULT VALUE", "laporan_sampah.status='PENDING', satuan='KG'", "Memberikan nilai awal otomatis apabila tidak disertakan dalam input pengguna."],
              ["ENUMERATION (ENUM)", "Role (USER, ADMIN), Satuan (KG, PCS), StatusLaporan", "Membatasi variasi input hanya pada kumpulan nilai konstan yang diizinkan."],
              ["ON DELETE CASCADE", "foto_sampah -> laporan_sampah, poin -> users", "Jika baris laporan/user dihapus, berkas foto dan data anak ikut terhapus bersih."],
              ["ON DELETE RESTRICT", "laporan_sampah -> jenis_sampah, wilayah", "Mencegah penghapusan master data sampah/wilayah yang masih memiliki transaksi."],
              ["INDEXING", "laporan_sampah(userId), laporan_sampah(status)", "Mempercepat waktu pencarian dan pembuatan laporan statistik agregat."]
            ]
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB III
          createHeading1("BAB III: DOKUMENTASI ANTARMUKA PENGGUNA (WEB)"),
          createParagraph(
            "Bab ini menyajikan tangkapan layar (screenshot) asli dari setiap halaman aplikasi web Setor Sampah yang berjalan di lingkungan lokal beserta penjelasan fungsionalitasnya."
          ),

          createHeading2("3.1 Halaman Autentikasi Pengguna"),
          ...createImageParagraph("01_login.png", "Gambar 1: Halaman Masuk (Login) Aplikasi Setor Sampah", 500, 312),
          createParagraph(
            "Halaman Login menyediakan formulir masuk yang terhubung langsung dengan NextAuth.js. Pengguna memasukkan alamat email dan kata sandi yang telah terenkripsi menggunakan Bcrypt. Terdapat panel informasi visual di sisi kiri yang memperkenalkan 4 kategori resmi sampah."
          ),

          ...createImageParagraph("02_register.png", "Gambar 2: Halaman Pendaftaran Akun Warga Mandiri", 500, 312),
          createParagraph(
            "Halaman Registrasi memungkinkan warga baru untuk mendaftarkan akun secara mandiri. Formulir dilengkapi validasi nama lengkap, email unik, nomor HP (minimal 10 digit angka), dan kata sandi (minimal 6 karakter). Akun yang terdaftar di sini secara otomatis memperoleh peran (Role) USER."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading2("3.2 Antarmuka Pengguna / Warga (User Interface)"),
          ...createImageParagraph("03_dashboard_user.png", "Gambar 3: Dashboard Riwayat dan Status Setoran Pengguna", 500, 312),
          createParagraph(
            "Dashboard Pengguna menyajikan rekapitulasi riwayat seluruh setoran yang pernah diajukan oleh warga bersangkutan. Terdapat badge status berwarna (Kuning untuk Menunggu, Hijau untuk Disetujui, dan Merah untuk Ditolak lengkap dengan catatan alasan penolakan dari admin)."
          ),

          ...createImageParagraph("04_form_setor.png", "Gambar 4: Formulir Pengajuan Setor Sampah", 500, 312),
          createParagraph(
            "Formulir Setor Sampah digunakan warga untuk mengirimkan data pemilahan sampah. Pengguna memilih Kategori Sampah (Organik, Anorganik, B3, Residu), menginputkan kuantitas dan satuan (KG / PCS), memilih asal wilayah setoran, serta dapat mengunggah foto bukti fisik sampah secara langsung."
          ),

          ...createImageParagraph("05_profil_user.png", "Gambar 5: Halaman Profil dan Pengaturan Keamanan Akun", 500, 312),
          createParagraph(
            "Halaman Profil menyajikan statistik ringkas aktivitas penyetoran sampah akun warga, data akun (nama dan email), serta formulir untuk memperbarui nama dan mengganti kata sandi secara berkala."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading2("3.3 Antarmuka Administrator (Admin TPU)"),
          ...createImageParagraph("06_dashboard_admin.png", "Gambar 6: Dashboard Utama Ringkasan Statistik Administrator", 500, 312),
          createParagraph(
            "Dashboard Admin menampilkan metrik operasional secara waktu nyata (real-time): Total Setoran Masuk, Jumlah Setoran Menunggu Verifikasi, Setoran Disetujui, Setoran Ditolak, Total Warga Terdaftar, Rekapitulasi Stok Terkumpul per Kategori Sampah, serta Distribusi Sampah per Wilayah Asal."
          ),

          ...createImageParagraph("07_kelola_setoran.png", "Gambar 7: Halaman Kelola, Pencarian, Filter, dan Verifikasi Setoran", 500, 312),
          createParagraph(
            "Halaman Kelola Setoran memuat daftar seluruh kiriman sampah warga. Dilengkapi fitur pencarian pintar (berdasarkan nama warga, email, atau tag), penyaringan status, tombol 'Ekspor CSV', serta aksi cepat 'Setujui' (Approve) yang secara otomatis menambahkan stok daur ulang dan 'Tolak' (Reject) dengan kewajiban menuliskan alasan penolakan."
          ),

          ...createImageParagraph("08_kelola_tags.png", "Gambar 8: Halaman Manajemen Label Tags (Relasi Many-to-Many)", 500, 312),
          createParagraph(
            "Halaman Manajemen Tag digunakan admin untuk menambah dan menghapus label penanda khusus (seperti 'Prioritas', 'Volume Besar', 'Kerjasama Event'). Label ini dapat disematkan ke berbagai setoran sampah melalui relasi Many-to-Many."
          ),

          ...createImageParagraph("09_daftar_warga.png", "Gambar 9: Halaman Daftar Warga dan Rekapitulasi Kontribusi", 500, 312),
          createParagraph(
            "Halaman Warga menyajikan daftar seluruh akun masyarakat yang terdaftar, mencakup nama, alamat email, nomor handphone, tanggal registrasi, serta rekapitulasi kontribusi setoran masing-masing warga."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB IV
          createHeading1("BAB IV: RENCANA PROSES TRANSAKSI POIN & REWARD"),
          createParagraph(
            "Sebagai nilai tambah (sesuai poin 5 dan 6 instruksi penugasan), bab ini mendokumentasikan rencana pengembangan fitur transaksi insentif (poin reward) di mana warga yang menyetorkan sampah berhak memperoleh poin yang dapat dikumpulkan dan ditukarkan dengan hadiah atau voucher belanja."
          ),

          createHeading2("4.1 Aturan Konversi Poin Transaksi"),
          createParagraph(
            "Poin akan dikreditkan secara otomatis ke saldo akun warga saat laporan setoran disetujui (APPROVED) oleh petugas admin TPU. Skema konversi poin dirumuskan sebagai berikut:"
          ),
          createStyledTable(
            ["Kategori Sampah", "Poin per Kilogram (KG)", "Poin per Satuan (PCS)", "Tingkat Nilai Insentif"],
            [
              ["Sampah Organik", "10 Poin / KG", "2 Poin / PCS", "Menengah (Bahan Kompos & Pakan)"],
              ["Sampah Anorganik", "15 Poin / KG", "3 Poin / PCS", "Tinggi (Nilai Daur Ulang Tinggi)"],
              ["Sampah B3 (Berbahaya)", "20 Poin / KG", "5 Poin / PCS", "Sangat Tinggi (Penanganan Khusus)"],
              ["Sampah Residu", "5 Poin / KG", "1 Poin / PCS", "Dasar (Pemilahan Akhir)"]
            ]
          ),
          createParagraph(
            "Formula kalkulasi: Total Poin Didapat = Kuantitas Setoran × Tarif Poin Kategori. Contoh: Seorang warga menyetor 4 KG sampah anorganik bersih, maka sistem otomatis menambahkan 4 × 15 = 60 Poin ke tabel poin pengguna."
          ),

          createHeading2("4.2 Perancangan Tabel Tambahan Transaksi"),
          createParagraph(
            "Untuk mewujudkan fitur transaksi penukaran ini, dirancang dua tabel relasional baru:"
          ),
          createBullet("Tabel berisi katalog reward yang dapat ditukarkan, mencakup namaHadiah, deskripsi, poinDibutuhkan, stokHadiah, foto, dan status keaktifan.", "1. Tabel hadiah:"),
          createBullet("Tabel transaksi penukaran mencatat id, userId (FK), hadiahId (FK), jumlahPoin, status ('MENUNGGU', 'DIPROSES', 'SELESAI', 'DIBATALKAN'), catatanAdmin, serta timestamp pencatatan.", "2. Tabel penukaran:"),

          createHeading2("4.3 Use Case Diagram Transaksi Poin"),
          ...createImageParagraph("12_usecase_diagram.png", "Gambar 10: Use Case Diagram Sistem Pengelolaan Sampah dan Transaksi Poin", 400, 580),
          createParagraph(
            "Pada diagram use case di atas, terlihat interaksi antara Aktor Warga dan Aktor Admin. Terdapat use case baru yaitu 'Lihat Saldo Poin', 'Katalog Hadiah', 'Transaksi Tukar Poin', dan 'Riwayat Penukaran' untuk warga, serta 'Kelola Master Hadiah' dan 'Validasi Penukaran' bagi Admin."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading2("4.4 Activity Diagram Transaksi Penukaran Poin"),
          ...createImageParagraph("13_activity_transaksi.png", "Gambar 11: Activity Diagram Alur Transaksi Penukaran Saldo Poin Menjadi Hadiah", 360, 650),
          createParagraph(
            "Activity diagram di atas menggambarkan alur logika validasi transaksi: dari pengecekan kecukupan saldo poin pengguna, ketersediaan stok fisik barang, pemotongan saldo sementara, peninjauan oleh admin, hingga proses penyerahan barang dan penyesuaian stok secara otomatis."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB V
          createHeading1("BAB V: ENTITY RELATIONSHIP DIAGRAM (ERD)"),
          createParagraph(
            "Bagian ini menyajikan diagram ERD dari dua kondisi sistem: sistem yang sedang berjalan saat ini dan rencana pengembangan yang telah mengintegrasikan transaksi poin secara penuh."
          ),

          createHeading2("5.1 ERD Sistem Saat Ini (Struktur Berjalan)"),
          ...createImageParagraph("10_erd_sekarang.png", "Gambar 12: Entity Relationship Diagram (ERD) Sistem Setor Sampah Saat Ini", 480, 516),
          createParagraph(
            "Pada ERD saat ini, struktur berpusat pada entitas 'laporan_sampah' yang menghubungkan 'users', 'jenis_sampah', dan 'wilayah'. Foto bukti setoran berelasi 1:1 ('foto_sampah'), kategori memiliki saldo 'stok' (1:1), dan relasi Many-to-Many dengan entitas 'tags' diakomodasi melalui tabel jembatan."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading2("5.2 ERD Rencana (Pengembangan Transaksi Poin & Hadiah)"),
          ...createImageParagraph("11_erd_rencana.png", "Gambar 13: Entity Relationship Diagram (ERD) Rencana Integrasi Transaksi Poin & Hadiah", 520, 320),
          createParagraph(
            "Pada ERD Rencana di atas, entitas 'poin' diintegrasikan secara aktif dengan 'laporan_sampah' sebagai sumber perolehan poin. Ditambahkan pula entitas 'hadiah' dan tabel transaksi 'penukaran' yang menghubungkan pengguna dengan hadiah yang dipilih, membentuk siklus transaksi tertutup yang lengkap dan konsisten."
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // BAB VI
          createHeading1("BAB VI: PENUTUP"),
          createHeading2("6.1 Kesimpulan"),
          createParagraph(
            "Aplikasi Web Setor Sampah telah berhasil dibangun dan diintegrasikan dengan sistem basis data relasional PostgreSQL menggunakan Prisma ORM. Seluruh prinsip integritas data (RDBMS Constraint seperti Primary Key, Foreign Key, Unique, Not Null, Enum, dan Cascading Rules) telah diimplementasikan secara optimal untuk mencegah inkonsistensi data."
          ),
          createParagraph(
            "Dokumentasi ini telah melengkapi seluruh persyaratan penugasan, mencakup pemaparan antarmuka web, perancangan diagram UML (Use Case dan Activity), serta perbandingan ERD eksisting dengan ERD rencana transaksi poin reward."
          ),

          createHeading2("6.2 Saran dan Pengembangan Lanjutan"),
          createBullet("Mengaktifkan antarmuka katalog reward dan formulir penukaran poin pada antarmuka warga sesuai rencana ERD BAB V.", "1. Implementasi UI Transaksi Poin:"),
          createBullet("Menyediakan opsi penjemputan sampah langsung ke rumah warga untuk volume sampah besar.", "2. Layanan Penjemputan Sampah:"),
          createBullet("Memindahkan penyimpanan berkas bukti dari penyimpanan lokal ke Cloud Object Storage (misal: AWS S3 atau Supabase Storage) untuk kebutuhan produksi skala besar.", "3. Cloud Storage Migration:")
        ]
      }
    ]
  });

  const docxBuffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, '..', 'Dokumentasi_Web_Setor_Sampah.docx');
  fs.writeFileSync(outPath, docxBuffer);
  console.log(`Document created successfully at: ${outPath}`);
}

buildDocument().catch(console.error);
