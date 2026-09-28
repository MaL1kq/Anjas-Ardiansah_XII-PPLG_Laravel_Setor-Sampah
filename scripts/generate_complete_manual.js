const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

function toBase64(relPath) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('Image not found:', fullPath);
    return '';
  }
  const ext = path.extname(fullPath).replace('.', '');
  const data = fs.readFileSync(fullPath).toString('base64');
  return `data:image/${ext === 'png' ? 'png' : 'jpeg'};base64,${data}`;
}

const logoBase64 = toBase64('public/logo.png');
const ssLoginFull = toBase64('scripts/manual_screenshots/ss_login_full.png');
const ssRegisterFull = toBase64('scripts/manual_screenshots/ss_register_full.png');
const ssDashWarga = toBase64('scripts/manual_screenshots/ss_03_dashboard_warga.png');
const ssSetor = toBase64('scripts/manual_screenshots/ss_04_setor_sampah.png');
const ssTukar = toBase64('scripts/manual_screenshots/ss_06_tukar_poin.png');
const ssRiwayatTukar = toBase64('scripts/manual_screenshots/ss_07_riwayat_penukaran.png');
const ssProfil = toBase64('scripts/manual_screenshots/ss_08_profil.png');
const ssDashAdmin = toBase64('scripts/manual_screenshots/ss_09_dashboard_admin.png');
const ssAdminSetoran = toBase64('scripts/manual_screenshots/ss_10_admin_setoran.png');
const ssAdminBarang = toBase64('scripts/manual_screenshots/ss_11_admin_barang.png');
const ssAdminEditBarang = toBase64('scripts/manual_screenshots/ss_12_admin_edit_barang.png');
const ssAdminPenukaran = toBase64('scripts/manual_screenshots/ss_13_admin_penukaran.png');
const ssAdminJenis = toBase64('scripts/manual_screenshots/ss_14_admin_jenis_sampah.png');
const ssAdminWilayah = toBase64('scripts/manual_screenshots/ss_15_admin_wilayah.png');
const ssAdminTags = toBase64('scripts/manual_screenshots/ss_16_admin_tags.png');
const ssAdminWarga = toBase64('scripts/manual_screenshots/ss_17_admin_warga.png');

console.log('Generating complete HTML content...');

function pageHeader(bab, title, badge = 'MODUL OPERASIONAL') {
  return `
    <div class="page-header">
      <div class="header-left">
        <span class="header-badge">${badge} // ${bab}</span>
        <h2 class="header-title">${title}</h2>
      </div>
      <div class="header-right">
        <div class="header-app">
          <img src="${logoBase64}" class="app-mini-logo" alt="Logo" />
          <span class="app-name">Setor Sampah Mandiri</span>
        </div>
      </div>
    </div>
  `;
}

function pageFooter(pageNum, total = 19) {
  return `
    <div class="page-footer">
      <div class="footer-left">Buku Panduan Pengguna (User Manual) - Sistem Pengelolaan Setor Sampah</div>
      <div class="footer-center">Pengembang: Anjas Ardiansah (Kelas XII PPLG)</div>
      <div class="footer-right">Halaman ${pageNum} dari ${total}</div>
    </div>
  `;
}

function browserMockup(imageSrc, url = "https://setorsampah.id/app", caption = "") {
  return `
    <div class="browser-mockup">
      <div class="browser-bar">
        <div class="browser-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="browser-url">${url}</div>
      </div>
      <div class="browser-viewport">
        <img src="${imageSrc}" class="mockup-img" alt="Screenshot Antarmuka" />
      </div>
      ${caption ? `<div class="mockup-caption">${caption}</div>` : ''}
    </div>
  `;
}

const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buku Panduan Pengguna (User Manual) - Sistem Setor Sampah</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 297mm 210mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    body {
      margin: 0;
      padding: 0;
      background: #E5E7EB;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #16211B;
      font-size: 11px;
      line-height: 1.45;
    }

    .page {
      width: 297mm;
      height: 210mm;
      max-height: 210mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
    }

    /* TYPOGRAPHY */
    h1, h2, h3, h4, .font-display {
      font-family: 'Sora', 'Inter', sans-serif;
      color: #16211B;
      margin: 0;
    }
    p {
      margin: 0 0 6px 0;
      color: #374151;
    }

    /* HEADER & FOOTER */
    .page-header {
      height: 15mm;
      padding: 0 16mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #E3E7DE;
      background: #FAFCFA;
      flex-shrink: 0;
    }
    .header-badge {
      display: block;
      font-size: 8px;
      font-weight: 700;
      color: #2E6B4E;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 2px;
    }
    .header-title {
      font-size: 13px;
      font-weight: 700;
      color: #16211B;
      letter-spacing: -0.2px;
    }
    .header-app {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px;
      background: #EAF3EC;
      border: 1px solid #CFE6D5;
      border-radius: 6px;
    }
    .app-mini-logo {
      width: 14px;
      height: 14px;
      object-fit: contain;
    }
    .app-name {
      font-size: 9px;
      font-weight: 700;
      color: #245439;
    }

    .page-footer {
      height: 11mm;
      padding: 0 16mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #E3E7DE;
      background: #FAFCFA;
      font-size: 8.5px;
      color: #6B7280;
      flex-shrink: 0;
    }
    .footer-left { font-weight: 500; }
    .footer-center { color: #2E6B4E; font-weight: 600; }
    .footer-right {
      font-weight: 700;
      color: #16211B;
      background: #EAF3EC;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #CFE6D5;
    }

    /* PAGE CONTENT CONTAINER */
    .page-body {
      flex: 1;
      padding: 8mm 16mm;
      display: flex;
      gap: 16mm;
      overflow: hidden;
      background: #FFFFFF;
    }
    .page-body.full-width {
      display: block;
    }
    .col-left {
      flex: 0 0 45%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 8px;
      overflow: hidden;
    }
    .col-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    /* STEP ITEMS & CALLOUTS */
    .step-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .step-num {
      width: 20px;
      height: 20px;
      background: #2E6B4E;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .step-num.gold {
      background: #D9A02A;
      color: #16211B;
    }
    .step-text {
      flex: 1;
    }
    .step-title {
      font-weight: 700;
      color: #16211B;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .step-desc {
      font-size: 9.5px;
      color: #4B5563;
      line-height: 1.4;
    }

    .callout {
      background: #F7F8F4;
      border-left: 3px solid #2E6B4E;
      border-radius: 0 6px 6px 0;
      padding: 8px 10px;
      margin: 4px 0;
    }
    .callout.warning {
      background: #FEF7EA;
      border-left-color: #D9A02A;
    }
    .callout.danger {
      background: #FDF2F2;
      border-left-color: #B8433A;
    }
    .callout-title {
      font-size: 9.5px;
      font-weight: 700;
      color: #245439;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .callout.warning .callout-title { color: #8C5E09; }
    .callout.danger .callout-title { color: #9B1C1C; }
    .callout-desc {
      font-size: 9px;
      color: #374151;
      line-height: 1.35;
    }

    /* BROWSER MOCKUP */
    .browser-mockup {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .browser-bar {
      height: 24px;
      background: #F3F4F6;
      border-bottom: 1px solid #E5E7EB;
      padding: 0 10px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .browser-dots {
      display: flex;
      gap: 5px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot-red { background: #FF5F56; }
    .dot-yellow { background: #FFBD2E; }
    .dot-green { background: #27C93F; }
    .browser-url {
      font-size: 8px;
      color: #6B7280;
      background: #FFFFFF;
      padding: 2px 12px;
      border-radius: 4px;
      border: 1px solid #E5E7EB;
      width: 70%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-family: monospace;
    }
    .browser-viewport {
      width: 100%;
      overflow: hidden;
      background: #F9FAFB;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mockup-img {
      width: 100%;
      height: auto;
      max-height: 130mm;
      object-fit: contain;
      display: block;
    }
    .mockup-caption {
      font-size: 8.5px;
      color: #6B7280;
      padding: 5px 10px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-style: italic;
    }

    /* BADGES & PILLS */
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 600;
    }
    .badge-green { background: #EAF3EC; color: #245439; border: 1px solid #CFE6D5; }
    .badge-yellow { background: #FEF7EA; color: #8C5E09; border: 1px solid #F8DEAE; }
    .badge-red { background: #FDF2F2; color: #9B1C1C; border: 1px solid #FBD5D5; }
    .badge-gray { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }

    /* TABLES */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      margin: 4px 0;
    }
    .data-table th {
      background: #FAFCFA;
      color: #16211B;
      font-weight: 700;
      text-align: left;
      padding: 5px 8px;
      border-bottom: 1px solid #E3E7DE;
      border-top: 1px solid #E3E7DE;
    }
    .data-table td {
      padding: 4.5px 8px;
      border-bottom: 1px solid #F0F2ED;
      color: #374151;
    }
    .data-table tr:last-child td {
      border-bottom: 1px solid #E3E7DE;
    }

    /* GRID BOXES */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
    }
    .card-box {
      background: #FAFCFA;
      border: 1px solid #E3E7DE;
      border-radius: 6px;
      padding: 8px 10px;
    }

    /* COVER PAGE STYLING */
    .cover-container {
      width: 100%;
      height: 100%;
      display: flex;
      background: #1E4734;
      color: #FFFFFF;
      position: relative;
      overflow: hidden;
    }
    .cover-left {
      width: 58%;
      height: 100%;
      padding: 16mm 20mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    .cover-right {
      width: 42%;
      height: 100%;
      background: #245439;
      border-left: 4px solid #D9A02A;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 16mm;
      z-index: 1;
    }
    .cover-logo-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .cover-logo {
      width: 46px;
      height: 46px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.12);
      padding: 6px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .cover-tagline {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #CFE6D5;
    }
    .cover-title-group {
      margin-top: 10mm;
    }
    .cover-pill {
      display: inline-block;
      padding: 4px 12px;
      background: #D9A02A;
      color: #16211B;
      font-size: 10px;
      font-weight: 800;
      border-radius: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .cover-title {
      font-size: 32px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin-bottom: 10px;
    }
    .cover-subtitle {
      font-size: 13px;
      color: #CFE6D5;
      line-height: 1.5;
      max-width: 480px;
    }
    .cover-meta {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .cover-author-title {
      font-size: 8.5px;
      color: #A3C9AE;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .cover-author-name {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 2px;
    }
    .cover-author-role {
      font-size: 10px;
      color: #CFE6D5;
    }
    .cover-version {
      text-align: right;
      font-size: 10px;
      color: #A3C9AE;
    }
    .cover-version strong {
      color: #D9A02A;
      font-size: 12px;
      display: block;
    }
    .cover-card-preview {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    .cover-preview-img {
      width: 100%;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .cover-feature-list {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cover-feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      color: #CFE6D5;
    }
    .cover-feature-bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #D9A02A;
    }
  </style>
</head>
<body>

  <!-- ==================== HALAMAN 1: COVER ==================== -->
  <div class="page">
    <div class="cover-container">
      <div class="cover-left">
        <div class="cover-logo-row">
          <img src="${logoBase64}" class="cover-logo" alt="Logo" />
          <div>
            <div class="cover-tagline">Panduan Pengguna Resmi // Role Warga & Admin</div>
            <div style="font-size: 9px; color: #A3C9AE;">Platform Manajemen Bank Sampah Digital Berbasis Poin</div>
          </div>
        </div>

        <div class="cover-title-group">
          <div class="cover-pill">USER MANUAL & PETUNJUK TEKNIS</div>
          <h1 class="cover-title">SISTEM INFORMASI<br>SETOR SAMPAH MANDIRI</h1>
          <p class="cover-subtitle">
            Buku panduan lengkap operasional platform web pemilahan sampah, kalkulator insentif poin,
            penukaran sembako, dan sistem verifikasi persetujuan bagi Warga dan Petugas Bank Sampah.
          </p>
        </div>

        <div class="cover-meta">
          <div>
            <div class="cover-author-title">Disusun & Dikembangkan Oleh</div>
            <div class="cover-author-name">Anjas Ardiansah</div>
            <div class="cover-author-role">Pengembang Perangkat Lunak Mandiri (XII PPLG)</div>
          </div>
          <div class="cover-version">
            Edisi Revisi Resmi
            <strong>Tahun 2026 // Versi 1.0</strong>
          </div>
        </div>
      </div>

      <div class="cover-right">
        <div class="cover-card-preview">
          <div style="font-size: 9px; font-weight: 700; color: #D9A02A; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
            Arsitektur Terpadu
          </div>
          <img src="${ssDashWarga}" class="cover-preview-img" alt="Pratinjau Antarmuka" />
          <div class="cover-feature-list">
            <div class="cover-feature-item">
              <span class="cover-feature-bullet"></span>
              <span>Kalkulator Otomatis Estimasi Poin Sampah</span>
            </div>
            <div class="cover-feature-item">
              <span class="cover-feature-bullet"></span>
              <span>Approval Bertingkat: Poin Terpotong Pasca Verifikasi</span>
            </div>
            <div class="cover-feature-item">
              <span class="cover-feature-bullet"></span>
              <span>Katalog Barang & Upload Foto Produk Tanpa URL</span>
            </div>
            <div class="cover-feature-item">
              <span class="cover-feature-bullet"></span>
              <span>Desain Ergonomis Berbasis Psikologi Warna</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 2: DAFTAR ISI ==================== -->
  <div class="page">
    ${pageHeader("BAGIAN AWAL", "Daftar Isi & Struktur Panduan", "NAVIGASI DOKUMEN")}
    <div class="page-body full-width">
      <div style="margin-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #16211B;">Struktur Dokumen Panduan Pengguna</h3>
        <p style="font-size: 10px; color: #4B5563;">Panduan ini disusun secara sistematis mengacu pada standar buku manual teknis perangkat lunak.</p>
      </div>

      <div class="grid-3" style="gap: 16px;">
        <!-- KOLOM 1 -->
        <div class="card-box" style="padding: 12px; background: #FFFFFF; border-top: 3px solid #2E6B4E;">
          <div style="font-size: 11px; font-weight: 700; color: #2E6B4E; margin-bottom: 8px; text-transform: uppercase;">
            Bagian I: Fondasi & Sistem
          </div>
          <table style="width: 100%; font-size: 9.5px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Daftar Isi & Struktur Panduan</td><td style="text-align: right; font-weight: 700;">Hal 2</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Psikologi Warna & Sistem Desain</td><td style="text-align: right; font-weight: 700;">Hal 3</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab I: Pendahuluan & Gambaran Umum</td><td style="text-align: right; font-weight: 700;">Hal 4</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab II: Persyaratan Sistem & Akses Web</td><td style="text-align: right; font-weight: 700;">Hal 5</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab III: Alur Kerja & Diagram Proses</td><td style="text-align: right; font-weight: 700;">Hal 6</td></tr>
            <tr><td style="padding: 4px 0;">Bab IV: Akses Masuk & Manajemen Akun</td><td style="text-align: right; font-weight: 700;">Hal 7</td></tr>
          </table>
        </div>

        <!-- KOLOM 2 -->
        <div class="card-box" style="padding: 12px; background: #FFFFFF; border-top: 3px solid #D9A02A;">
          <div style="font-size: 11px; font-weight: 700; color: #8C5E09; margin-bottom: 8px; text-transform: uppercase;">
            Bagian II: Panduan Role Warga
          </div>
          <table style="width: 100%; font-size: 9.5px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab V: Dashboard & Monitoring Saldo Poin</td><td style="text-align: right; font-weight: 700;">Hal 8</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab V: Formulir Setor Sampah Mandiri</td><td style="text-align: right; font-weight: 700;">Hal 9</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab V: Katalog Sembako & Tukar Poin</td><td style="text-align: right; font-weight: 700;">Hal 10</td></tr>
            <tr><td style="padding: 4px 0;">Bab V: Pemantauan Riwayat Penukaran</td><td style="text-align: right; font-weight: 700;">Hal 11</td></tr>
          </table>
          <div style="margin-top: 12px; font-size: 11px; font-weight: 700; color: #2E6B4E; margin-bottom: 8px; text-transform: uppercase;">
            Bagian III: Panduan Role Admin
          </div>
          <table style="width: 100%; font-size: 9.5px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VI: Dashboard Eksekutif TPU</td><td style="text-align: right; font-weight: 700;">Hal 12</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VI: Validasi & Approval Setoran Sampah</td><td style="text-align: right; font-weight: 700;">Hal 13</td></tr>
            <tr><td style="padding: 4px 0;">Bab VI: Manajemen Katalog Barang & Foto</td><td style="text-align: right; font-weight: 700;">Hal 14</td></tr>
          </table>
        </div>

        <!-- KOLOM 3 -->
        <div class="card-box" style="padding: 12px; background: #FFFFFF; border-top: 3px solid #16211B;">
          <div style="font-size: 11px; font-weight: 700; color: #16211B; margin-bottom: 8px; text-transform: uppercase;">
            Bagian IV: Kelola & Pemecahan Masalah
          </div>
          <table style="width: 100%; font-size: 9.5px; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VI: Validasi & Persetujuan Penukaran</td><td style="text-align: right; font-weight: 700;">Hal 15</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VI: Pengelolaan Master Data Sistem</td><td style="text-align: right; font-weight: 700;">Hal 16</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VII: Profil Pengguna & Keamanan Akun</td><td style="text-align: right; font-weight: 700;">Hal 17</td></tr>
            <tr><td style="padding: 4px 0; border-bottom: 1px dashed #E3E7DE;">Bab VIII: Tanya Jawab (FAQ) & Solusi Error</td><td style="text-align: right; font-weight: 700;">Hal 18</td></tr>
            <tr><td style="padding: 4px 0;">Penutup & Lembar Profil Pengembang</td><td style="text-align: right; font-weight: 700;">Hal 19</td></tr>
          </table>
          <div class="callout" style="margin-top: 14px;">
            <div class="callout-title">Catatan Standar Dokumen</div>
            <div class="callout-desc">Buku manual ini disusun tanpa menggunakan karakter emoji guna menjamin integritas format dokumen resmi kedinasan dan kepatuhan akademis.</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(2)}
  </div>

  <!-- ==================== HALAMAN 3: PSIKOLOGI WARNA & SISTEM DESAIN ==================== -->
  <div class="page">
    ${pageHeader("BAGIAN AWAL", "Psikologi Warna & Sistem Desain Antarmuka", "LANDASAN DESAIN")}
    <div class="page-body full-width">
      <div style="margin-bottom: 8px;">
        <h3 style="font-size: 15px; font-weight: 700; color: #16211B;">Analisis Psikologi Warna & Filosofi Antarmuka</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Pemilihan palet warna dalam aplikasi Setor Sampah didasarkan pada studi psikologi warna terapan (color psychology)
          untuk mendorong partisipasi masyarakat dalam pemilahan sampah, memberikan rasa aman dalam transaksi poin, dan menyajikan hierarki visual yang jelas.
        </p>
      </div>

      <div class="grid-4" style="gap: 8px; margin-bottom: 10px;">
        <!-- HIJAU HUTAN -->
        <div class="card-box" style="border-top: 4px solid #2E6B4E; background: #FFFFFF;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; font-size: 11px; color: #2E6B4E;">Hijau Hutan</span>
            <span class="badge badge-green">#2E6B4E</span>
          </div>
          <div style="font-size: 8.5px; font-weight: 600; color: #16211B; margin-bottom: 3px;">Peran: Warna Primer (Identitas Utama)</div>
          <p style="font-size: 8.5px; color: #4B5563; line-height: 1.35;">
            Secara psikologis, hijau membangkitkan rasa kesegaran ekologis, pembaharuan, dan harmoni lingkungan.
            Warna ini menegaskan komitmen keberlanjutan dan memberikan ketenangan batin bagi warga bahwa setiap kilogram sampah yang mereka pilah membawa dampak nyata bagi kelestarian bumi.
          </p>
        </div>

        <!-- EMAS MARIGOLD -->
        <div class="card-box" style="border-top: 4px solid #D9A02A; background: #FFFFFF;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; font-size: 11px; color: #8C5E09;">Emas Marigold</span>
            <span class="badge badge-yellow">#D9A02A</span>
          </div>
          <div style="font-size: 8.5px; font-weight: 600; color: #16211B; margin-bottom: 3px;">Peran: Warna Sekunder (Insentif & Poin)</div>
          <p style="font-size: 8.5px; color: #4B5563; line-height: 1.35;">
            Kuning keemasan mengomunikasikan nilai ekonomi, penghargaan, dan optimisme. Dalam psikologi motivasi,
            emas merepresentasikan slogan "Sampah Menjadi Berkah", memberi dorongan psikologis bahwa sampah anorganik memiliki nilai tukar riil yang setara dengan kebutuhan sembako warga.
          </p>
        </div>

        <!-- KERTAS ALAMI -->
        <div class="card-box" style="border-top: 4px solid #E3E7DE; background: #FFFFFF;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; font-size: 11px; color: #374151;">Kertas Alami</span>
            <span class="badge badge-gray">#F7F8F4</span>
          </div>
          <div style="font-size: 8.5px; font-weight: 600; color: #16211B; margin-bottom: 3px;">Peran: Latar Belakang (Kanvas)</div>
          <p style="font-size: 8.5px; color: #4B5563; line-height: 1.35;">
            Warna off-white hangat ini menyerupai kertas daur ulang berkualitas tinggi. Mengurangi kelelahan mata (eye-strain)
            dibandingkan latar putih murni, serta menciptakan atmosfer sanitasi, kebersihan, dan transparansi tata kelola data.
          </p>
        </div>

        <!-- SLATE GELAP / INK -->
        <div class="card-box" style="border-top: 4px solid #16211B; background: #FFFFFF;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; font-size: 11px; color: #16211B;">Tinta Gelap (Ink)</span>
            <span class="badge badge-gray">#16211B</span>
          </div>
          <div style="font-size: 8.5px; font-weight: 600; color: #16211B; margin-bottom: 3px;">Peran: Tipografi & Kontras Tinggi</div>
          <p style="font-size: 8.5px; color: #4B5563; line-height: 1.35;">
            Warna slate pekat menghadirkan wibawa, ketepatan kalkulasi, dan kestabilan data pembukuan. Memberikan rasio kontras
            melebihi 11:1 terhadap latar belakang untuk memenuhi standar aksesibilitas tertinggi (WCAG AAA).
          </p>
        </div>
      </div>

      <div class="grid-2" style="gap: 12px;">
        <div class="card-box" style="background: #FAFCFA;">
          <div style="font-size: 10.5px; font-weight: 700; color: #2E6B4E; margin-bottom: 4px;">Prinsip Ergonomi & Tipografi Terpadu</div>
          <table style="width: 100%; font-size: 9px; line-height: 1.4;">
            <tr>
              <td style="font-weight: 700; width: 30%; padding: 3px 0;">Font Display (Sora)</td>
              <td>Digunakan pada judul, angka metrik saldo poin, dan ringkasan bobot. Karakter geometrisnya tegas, modern, dan mudah dipindai (scannable).</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 3px 0;">Font Body (Inter)</td>
              <td>Didesain khusus untuk keterbacaan antarmuka digital. Menjamin teks panduan, label formulir, dan tabel data tetap tajam di layar gawai.</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 3px 0;">Hierarki Spasial</td>
              <td>Pengelompokan kartu (card-based layout) memudahkan pemisahan informasi antara tindakan setor, data riwayat, dan katalog barang.</td>
            </tr>
          </table>
        </div>

        <div class="card-box" style="background: #FAFCFA;">
          <div style="font-size: 10.5px; font-weight: 700; color: #2E6B4E; margin-bottom: 4px;">Aksesibilitas & Kepatuhan WCAG 2.1</div>
          <table style="width: 100%; font-size: 9px; line-height: 1.4;">
            <tr>
              <td style="font-weight: 700; width: 30%; padding: 3px 0;">Kontras Visual</td>
              <td>Seluruh elemen tombol utama memiliki kontras minimal 4.8:1, memastikan teks dapat terbaca jelas oleh lansia maupun warga tuna aksara parsial.</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 3px 0;">Kategori Warna</td>
              <td>Organik (Hijau #2E6B4E), Anorganik (Kuning #D9A02A), B3 (Merah #B8433A), dan Residu (Abu #5B6660) mempermudah pemilahan secara intuitif.</td>
            </tr>
            <tr>
              <td style="font-weight: 700; padding: 3px 0;">Bebas Distraksi</td>
              <td>Antarmuka dirancang bersih tanpa animasi berlebih atau emotikon, menjaga fokus operasional pada fungsi layanan masyarakat.</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    ${pageFooter(3)}
  </div>

  <!-- ==================== HALAMAN 4: BAB I PENDAHULUAN ==================== -->
  <div class="page">
    ${pageHeader("BAB I", "Pendahuluan & Gambaran Umum Sistem", "PENGANTAR SISTEM")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">1.1 Latar Belakang Digitalisasi</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Pengelolaan sampah rumah tangga di tingkat Rukun Tetangga (RT) dan Rukun Warga (RW) kerap mengalami hambatan akibat pencatatan manual,
          ketidakakuratan penimbangan, dan minimnya transparansi saldo poin bagi nasabah bank sampah.
          Sistem Informasi Setor Sampah Mandiri hadir sebagai solusi digital terintegrasi untuk mendokumentasikan, memvalidasi, dan mengonversi timbulan sampah menjadi insentif kebutuhan pokok.
        </p>

        <h3 style="font-size: 13px; font-weight: 700; color: #16211B; margin-top: 4px;">1.2 Maksud dan Tujuan</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Meningkatkan Partisipasi Pemilahan</div>
            <div class="step-desc">Memotivasi warga memilah sampah dari sumbernya melalui skema poin insentif yang transparan dan dapat dikalkulasi secara otomatis.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Menjamin Akuntabilitas Pembukuan</div>
            <div class="step-desc">Menyediakan pencatatan digital real-time bagi pengurus bank sampah untuk mencegah kebocoran saldo poin atau selisih stok logistik sembako.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Mewujudkan Ekonomi Sirkular Lokal</div>
            <div class="step-desc">Memfasilitasi pertukaran sampah bernilai daur ulang dengan barang kebutuhan pokok sehari-hari (beras, minyak goreng, gula, dan sabun).</div>
          </div>
        </div>

        <div class="callout" style="margin-top: 4px;">
          <div class="callout-title">Sasaran Pengguna Sistem</div>
          <div class="callout-desc">Sistem ini melayani dua entitas utama: <strong>Warga (User Nasabah)</strong> yang menyetor sampah dan menukar poin, serta <strong>Administrator TPU</strong> yang bertindak sebagai verifikator fisik dan pengelola gudang sembako.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashWarga, "https://setorsampah.id/overview", "Gambar 1.1: Halaman Ikhtisar Layanan Setor Sampah Mandiri")}
      </div>
    </div>
    ${pageFooter(4)}
  </div>

  <!-- ==================== HALAMAN 5: BAB II PERSYARATAN SISTEM ==================== -->
  <div class="page">
    ${pageHeader("BAB II", "Persyaratan Sistem & Lingkungan Operasional", "SPESIFIKASI TEKNIS")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">2.1 Kebutuhan Perangkat Keras & Lunak</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Aplikasi Setor Sampah dibangun dengan teknologi web responsif modern, sehingga dapat diakses secara fleksibel menggunakan komputer desktop, laptop, tablet, maupun telepon pintar (smartphone) tanpa memerlukan instalasi aplikasi tambahan.
        </p>

        <table class="data-table">
          <thead>
            <tr>
              <th>Komponen</th>
              <th>Spesifikasi Minimal</th>
              <th>Rekomendasi Optimal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Prosesor</strong></td>
              <td>Dual Core 1.5 GHz</td>
              <td>Quad Core 2.0 GHz atau lebih tinggi</td>
            </tr>
            <tr>
              <td><strong>Memori (RAM)</strong></td>
              <td>2 GB RAM</td>
              <td>4 GB RAM atau lebih</td>
            </tr>
            <tr>
              <td><strong>Layar Tampilan</strong></td>
              <td>Resolusi 360 x 640 px (Ponsel)</td>
              <td>1280 x 720 px atau 1920 x 1080 px</td>
            </tr>
            <tr>
              <td><strong>Konektivitas</strong></td>
              <td>Internet 3G / 1 Mbps</td>
              <td>Internet 4G/WiFi stabil minimal 5 Mbps</td>
            </tr>
            <tr>
              <td><strong>Peramban (Browser)</strong></td>
              <td>Chrome 90+, Edge 90+, Safari 14+</td>
              <td>Google Chrome / Edge versi terbaru</td>
            </tr>
          </tbody>
        </table>

        <h3 style="font-size: 13px; font-weight: 700; color: #16211B; margin-top: 6px;">2.2 Tautan Akses Aplikasi Resmi</h3>
        <div class="card-box" style="margin-top: 4px; background: #FAFCFA;">
          <div style="font-size: 9px; font-weight: 700; color: #2E6B4E; margin-bottom: 2px;">Alamat Produksi (Cloud GitHub Pages):</div>
          <div style="font-family: monospace; font-size: 8.5px; color: #16211B; word-break: break-all; margin-bottom: 6px;">
            https://mal1kq.github.io/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah/
          </div>
          <div style="font-size: 9px; font-weight: 700; color: #8C5E09; margin-bottom: 2px;">Alamat Lingkungan Pengembangan Lokal (Next.js):</div>
          <div style="font-family: monospace; font-size: 8.5px; color: #16211B;">
            http://localhost:3000 atau http://localhost:3005
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssLoginFull, "https://setorsampah.id/login", "Gambar 2.1: Tampilan Halaman Autentikasi Pengguna")}
      </div>
    </div>
    ${pageFooter(5)}
  </div>

  <!-- ==================== HALAMAN 6: BAB III ALUR KERJA SISTEM ==================== -->
  <div class="page">
    ${pageHeader("BAB III", "Alur Kerja & Diagram Proses Sistem", "ARSITEKTUR BISNIS")}
    <div class="page-body full-width">
      <div style="margin-bottom: 10px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #16211B;">Diagram Proses End-to-End Layanan Setor Sampah</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Sistem menerapkan verifikasi dua arah (two-way verification) guna menjamin keaslian bobot sampah dan keamanan penukaran logistik.
        </p>
      </div>

      <div class="grid-3" style="gap: 12px; margin-bottom: 12px;">
        <!-- TAHAP 1 -->
        <div class="card-box" style="background: #FFFFFF; border-left: 4px solid #2E6B4E;">
          <div style="font-size: 11px; font-weight: 700; color: #2E6B4E; margin-bottom: 4px;">Tahap 1: Pemilahan & Input Setoran</div>
          <div class="step-desc" style="font-size: 9px; line-height: 1.4;">
            <strong>Pelaksana: Warga</strong><br>
            [1] Warga memilah sampah dari rumah tangga (Organik, Anorganik, B3, Residu).<br>
            [2] Membuka formulir Setor Sampah dan memasukkan estimasi bobot (KG).<br>
            [3] Sistem menampilkan kalkulator estimasi poin.<br>
            [4] Data tersimpan dengan status awal <strong>PENDING</strong> (Menunggu Verifikasi).
          </div>
        </div>

        <!-- TAHAP 2 -->
        <div class="card-box" style="background: #FFFFFF; border-left: 4px solid #D9A02A;">
          <div style="font-size: 11px; font-weight: 700; color: #8C5E09; margin-bottom: 4px;">Tahap 2: Verifikasi Fisik & Kredit Poin</div>
          <div class="step-desc" style="font-size: 9px; line-height: 1.4;">
            <strong>Pelaksana: Admin TPU</strong><br>
            [1] Warga membawa sampah ke bank sampah atau petugas menjemput ke lokasi RT/RW.<br>
            [2] Admin memeriksa fisik sampah dan melakukan penimbangan timbangan digital.<br>
            [3] Jika sesuai, Admin menekan tombol <strong>Setujui</strong>.<br>
            [4] Saldo poin warga bertambah secara otomatis dan tercatat dalam pembukuan.
          </div>
        </div>

        <!-- TAHAP 3 -->
        <div class="card-box" style="background: #FFFFFF; border-left: 4px solid #16211B;">
          <div style="font-size: 11px; font-weight: 700; color: #16211B; margin-bottom: 4px;">Tahap 3: Penukaran Sembako & Serah Terima</div>
          <div class="step-desc" style="font-size: 9px; line-height: 1.4;">
            <strong>Pelaksana: Warga & Admin</strong><br>
            [1] Warga memilih barang sembako pada Katalog Tukar Poin.<br>
            [2] Pengajuan berstatus <strong>PENDING (Poin Belum Terpotong)</strong>.<br>
            [3] Warga datang ke Bank Sampah mengambil barang fisik.<br>
            [4] Admin menekan <strong>Setujui Penukaran</strong> -> Poin warga dan stok barang terpotong bersamaan.
          </div>
        </div>
      </div>

      <div class="callout warning">
        <div class="callout-title">Aturan Ketat Integritas Saldo Poin</div>
        <div class="callout-desc">
          Sesuai standar operasional, saldo poin warga <strong>TIDAK BERKURANG</strong> pada saat penekanan tombol tukar oleh warga. Poin dan stok barang hanya dipotong secara sah apabila pengurus bank sampah telah menyetujui transaksi setelah memastikan ketersediaan barang fisik di loket penyerahan.
        </div>
      </div>
    </div>
    ${pageFooter(6)}
  </div>

  <!-- ==================== HALAMAN 7: BAB IV AUTENTIKASI ==================== -->
  <div class="page">
    ${pageHeader("BAB IV", "Akses Masuk & Manajemen Akun Pengguna", "MANAJEMEN AKUN")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">4.1 Prosedur Pendaftaran Akun Warga Baru</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Akses Halaman Registrasi</div>
            <div class="step-desc">Klik tautan "Daftar" pada halaman masuk untuk membuka formulir registrasi warga.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Pengisian Identitas Lengkap</div>
            <div class="step-desc">Masukkan Nama Lengkap, Alamat Surel (Email) aktif, dan Kata Sandi minimal 6 karakter.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Validasi Nomor Telepon / HP</div>
            <div class="step-desc">Wajib memasukkan Nomor HP aktif dengan panjang minimal 10 digit guna keperluan notifikasi penjemputan sampah.</div>
          </div>
        </div>

        <h3 style="font-size: 13px; font-weight: 700; color: #16211B; margin-top: 6px;">4.2 Prosedur Masuk ke Akun (Login)</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Masukkan email dan password terdaftar, kemudian tekan tombol "Masuk". Pada versi demonstrasi GitHub Pages, pengguna dapat menggunakan tombol pemilih peran cepat (Warga atau Admin) untuk memudahkan simulasi sistem.
        </p>

        <div class="callout">
          <div class="callout-title">Keamanan Sesi</div>
          <div class="callout-desc">Setiap sesi login dilindungi token terenkripsi. Hindari membagikan kata sandi Anda kepada orang lain untuk menjaga keamanan saldo poin yang telah dikumpulkan.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssRegisterFull, "https://setorsampah.id/register", "Gambar 4.1: Antarmuka Registrasi Akun Warga dengan Validasi Nomor HP")}
      </div>
    </div>
    ${pageFooter(7)}
  </div>

  <!-- ==================== HALAMAN 8: BAB V ROLE WARGA - DASHBOARD ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Role Warga: Dashboard Utama & Saldo Poin", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">5.1 Antarmuka Beranda Nasabah Warga</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Setelah berhasil masuk, warga disambut oleh halaman dashboard yang menampilkan ringkasan performa pemilahan sampah, saldo tabungan poin aktif, dan panduan edukasi.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Elemen Utama Dashboard:</h3>
        <div class="step-item">
          <div class="step-num">A</div>
          <div class="step-text">
            <div class="step-title">Kartu Saldo Poin Aktif</div>
            <div class="step-desc">Menampilkan akumulasi poin sah yang siap ditukarkan dengan sembako atau barang kebutuhan rumah tangga.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">B</div>
          <div class="step-text">
            <div class="step-title">Kartu Status Setoran</div>
            <div class="step-desc">Menampilkan jumlah setoran yang telah disetujui (Approved) dan setoran yang masih dalam antrean pemeriksaan (Pending).</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">C</div>
          <div class="step-text">
            <div class="step-title">Modul Edukasi Pemilahan Sampah</div>
            <div class="step-desc">Panduan singkat tata cara memilah sampah Organik, Anorganik, B3, dan Residu sebelum diserahkan ke bank sampah.</div>
          </div>
        </div>

        <div class="callout">
          <div class="callout-title">Tip Warga</div>
          <div class="callout-desc">Pastikan sampah anorganik (kardus, botol plastik, kaleng) dalam kondisi kering dan bersih untuk mempercepat proses penimbangan di lokasi.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashWarga, "https://setorsampah.id/dashboard", "Gambar 5.1: Dashboard Nasabah Warga dengan Indikator Saldo Poin")}
      </div>
    </div>
    ${pageFooter(8)}
  </div>

  <!-- ==================== HALAMAN 9: BAB V ROLE WARGA - SETOR SAMPAH ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Role Warga: Formulir Setor Sampah Mandiri", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">5.2 Langkah Pengisian Setoran Sampah</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Pilih Kategori Sampah</div>
            <div class="step-desc">Pilih salah satu jenis: Organik (10 poin/kg), Anorganik (15 poin/kg), B3 (20 poin/kg), atau Residu (5 poin/kg).</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Input Estimasi Bobot</div>
            <div class="step-desc">Ketik perkiraan berat sampah dalam satuan Kilogram (KG) dengan presisi desimal (contoh: 2.5 KG).</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Pantau Kalkulator Estimasi Poin</div>
            <div class="step-desc">Sistem menghitung proyeksi poin secara otomatis (contoh: 2.5 kg Anorganik x 15 = 37 Poin).</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-text">
            <div class="step-title">Pilih Wilayah Penjemputan / Setor</div>
            <div class="step-desc">Tentukan lokasi domisili RT/RW tempat sampah diserahkan.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">5</div>
          <div class="step-text">
            <div class="step-title">Kirim Pengajuan Setoran</div>
            <div class="step-desc">Tekan tombol "Kirim Setoran" untuk meneruskan data ke antrean verifikasi Admin TPU.</div>
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssSetor, "https://setorsampah.id/setor", "Gambar 5.2: Formulir Pengajuan Setor Sampah Mandiri")}
      </div>
    </div>
    ${pageFooter(9)}
  </div>

  <!-- ==================== HALAMAN 10: BAB V ROLE WARGA - KATALOG TUKAR POIN ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Role Warga: Katalog Sembako & Penukaran Poin", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">5.3 Menjelajahi Katalog & Menukar Poin</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Warga dapat menukarkan saldo poin yang telah terverifikasi dengan aneka barang kebutuhan pokok yang tersedia di etalase bank sampah.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Mekanisme Penukaran:</h3>
        <div class="step-item">
          <div class="step-num gold">1</div>
          <div class="step-text">
            <div class="step-title">Periksa Saldo & Stok Barang</div>
            <div class="step-desc">Pastikan saldo poin mencukupi harga barang dan indikator stok gudang masih tersedia.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num gold">2</div>
          <div class="step-text">
            <div class="step-title">Klik Tombol "Tukar Sekarang"</div>
            <div class="step-desc">Sistem memproses permohonan penukaran barang yang dipilih.</div>
          </div>
        </div>

        <div class="callout warning" style="margin-top: 6px;">
          <div class="callout-title">PENTING: Status Poin Pengajuan</div>
          <div class="callout-desc">
            Saat Anda menekan tombol "Tukar Sekarang", status transaksi adalah <strong>MENUNGGU PERSETUJUAN (PENDING)</strong>. Poin Anda <strong>BELUM BERKURANG</strong> pada tahap ini. Saldo poin baru akan terpotong secara sah saat petugas bank sampah menyetujui transaksi dan menyerahkan barang fisik kepada Anda.
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssTukar, "https://setorsampah.id/tukar-poin", "Gambar 5.3: Katalog Barang & Penukaran Sembako")}
      </div>
    </div>
    ${pageFooter(10)}
  </div>

  <!-- ==================== HALAMAN 11: BAB V ROLE WARGA - RIWAYAT PENUKARAN ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Role Warga: Pemantauan Riwayat Penukaran", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">5.4 Memantau Status Permintaan Barang</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Warga dapat mengecek progres pengajuan barang sembako melalui panel "Riwayat Penukaran Poin".
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Tiga Status Transaksi Penukaran:</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Arti Transaksi</th>
              <th>Kondisi Poin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-yellow">PENDING</span></td>
              <td>Menunggu validasi stok fisik oleh admin di loket.</td>
              <td><strong>Belum terpotong</strong></td>
            </tr>
            <tr>
              <td><span class="badge badge-green">APPROVED</span></td>
              <td>Disetujui. Barang telah diserahkan ke warga.</td>
              <td><strong>Terpotong otomatis</strong></td>
            </tr>
            <tr>
              <td><span class="badge badge-red">REJECTED</span></td>
              <td>Ditolak karena stok fisik habis/alasan lain.</td>
              <td><strong>Utuh (tidak berubah)</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="callout" style="margin-top: 8px;">
          <div class="callout-title">Tata Cara Pengambilan Barang Fisik</div>
          <div class="callout-desc">
            Bawalah identitas atau tunjukkan layar riwayat transaksi ini ke loket bank sampah. Petugas akan memverifikasi data dan menyerahkan barang pesanan Anda.
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssRiwayatTukar, "https://setorsampah.id/tukar-poin/riwayat", "Gambar 5.4: Tabel Riwayat Penukaran Poin dengan Status Menunggu")}
      </div>
    </div>
    ${pageFooter(11)}
  </div>

  <!-- ==================== HALAMAN 12: BAB VI ROLE ADMIN - DASHBOARD ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Role Administrator: Dashboard Eksekutif TPU", "PANDUAN ADMINISTRATOR")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">6.1 Pusat Kendali & Statistik Operasional</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Dashboard administrator dirancang khusus bagi pengurus dan operator Tempat Pengolahan Sampah (TPU) untuk memantau neraca timbulan sampah dan sirkulasi poin warga secara menyeluruh.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Indikator Utama Metrik Bank Sampah:</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Total Sampah Terkumpul (KG)</div>
            <div class="step-desc">Akumulasi bobot fisik sampah yang telah berhasil dikumpulkan dari seluruh warga terdaftar.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Total Poin Beredar</div>
            <div class="step-desc">Nilai total kewajiban poin bank sampah yang dimiliki warga dan siap ditukarkan dengan logistik sembako.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Jumlah Warga Aktif</div>
            <div class="step-desc">Total kepala keluarga atau nasabah yang aktif menyetorkan sampah dalam siklus periode berjalan.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-text">
            <div class="step-title">Monitoring Stok Gudang Sampah</div>
            <div class="step-desc">Rincian inventaris sampah yang tersimpan berdasarkan kategori Organik, Anorganik, B3, dan Residu.</div>
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashAdmin, "https://setorsampah.id/admin/dashboard", "Gambar 6.1: Dashboard Eksekutif Administrator Bank Sampah")}
      </div>
    </div>
    ${pageFooter(12)}
  </div>

  <!-- ==================== HALAMAN 13: BAB VI ROLE ADMIN - APPROVAL SETORAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Role Administrator: Validasi & Approval Setoran", "PANDUAN ADMINISTRATOR")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">6.2 Alur Persetujuan Setoran Sampah Warga</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Seluruh setoran yang diajukan warga berstatus PENDING hingga diverifikasi secara langsung oleh petugas di loket penimbangan.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Instruksi Kerja Petugas:</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Cocokkan Sampah Fisik</div>
            <div class="step-desc">Periksa apakah jenis sampah (misal: Anorganik) dan berat riil pada timbangan sesuai dengan data pengajuan.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Klik Tombol "Setujui"</div>
            <div class="step-desc">Sistem otomatis mengubah status menjadi APPROVED, menambahkan poin ke akun warga, dan memperbarui stok gudang sampah.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Opsi Tombol "Tolak"</div>
            <div class="step-desc">Jika sampah tercampur, kotor, atau basah berlebihan, klik Tolak dan masukkan alasan penolakan resmi untuk warga.</div>
          </div>
        </div>

        <div class="callout">
          <div class="callout-title">Otomasi Perhitungan Poin</div>
          <div class="callout-desc">Perhitungan poin dilakukan otomatis oleh mesin sistem sesuai tarif per kilogram yang terdaftar di Master Data.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminSetoran, "https://setorsampah.id/admin/kelola-sampah", "Gambar 6.2: Antarmuka Verifikasi & Persetujuan Setoran Sampah Masuk")}
      </div>
    </div>
    ${pageFooter(13)}
  </div>

  <!-- ==================== HALAMAN 14: BAB VI ROLE ADMIN - KELOLA BARANG ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Role Administrator: Manajemen Katalog & Foto Barang", "PANDUAN ADMINISTRATOR")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">6.3 Menambah, Mengunggah Foto & Mengedit Barang</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Administrator memiliki kendali penuh dalam mengelola barang sembako penukaran poin, termasuk fitur unggah gambar dari file lokal.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Prosedur Pengelolaan Barang:</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Isi Data Barang Baru / Edit</div>
            <div class="step-desc">Ketik Nama Barang (cth: Minyak Goreng 2L), Nilai Poin (cth: 50 Poin), dan Jumlah Stok Fisik.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Upload Foto Langsung dari File Gambar</div>
            <div class="step-desc">Pilih file gambar (JPG/PNG) dari komputer tanpa memerlukan input tautan URL eksternal. Sistem langsung memunculkan pratinjau thumbnail foto.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Fitur Edit Barang Eksisting</div>
            <div class="step-desc">Klik tombol "Edit" pada tabel untuk memuat data ke formulir, ubah parameter yang diperlukan, lalu klik "Simpan Perubahan".</div>
          </div>
        </div>

        <div class="callout">
          <div class="callout-title">Sinkronisasi Katalog</div>
          <div class="callout-desc">Perubahan data barang, foto, atau stok yang disimpan oleh admin akan seketika tampil di katalog belanja warga.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminEditBarang, "https://setorsampah.id/admin/barang", "Gambar 6.3: Formulir Edit & Upload Foto Barang Sembako")}
      </div>
    </div>
    ${pageFooter(14)}
  </div>

  <!-- ==================== HALAMAN 15: BAB VI ROLE ADMIN - APPROVAL PENUKARAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Role Administrator: Approval Penukaran Barang", "PANDUAN ADMINISTRATOR")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">6.4 Verifikasi & Serah Terima Sembako</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Menu ini memuat seluruh daftar pengajuan penukaran poin yang diajukan warga. Petugas memastikan barang fisik tersedia sebelum menyetujui.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Langkah Verifikasi Penukaran:</h3>
        <div class="step-item">
          <div class="step-num gold">1</div>
          <div class="step-text">
            <div class="step-title">Periksa Permintaan Warga</div>
            <div class="step-desc">Lihat nama pemohon, barang yang diminta, jumlah poin yang dibutuhkan, dan tanggal pengajuan.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num gold">2</div>
          <div class="step-text">
            <div class="step-title">Pastikan Kesiapan Fisik Barang</div>
            <div class="step-desc">Ambil paket sembako dari gudang untuk diserahkan ke tangan warga di loket pelayanan.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num gold">3</div>
          <div class="step-text">
            <div class="step-title">Klik "Setujui" untuk Eksekusi Pemotongan</div>
            <div class="step-desc">Setelah tombol Setujui ditekan, poin warga dan stok barang di sistem akan terpotong secara bersamaan (atomic transaction).</div>
          </div>
        </div>

        <div class="callout warning">
          <div class="callout-title">Perlindungan Saldo Warga</div>
          <div class="callout-desc">Jika barang kosong atau warga membatalkan, klik Tolak. Saldo poin warga dijamin tidak terpotong sama sekali.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminPenukaran, "https://setorsampah.id/admin/penukaran", "Gambar 6.4: Antarmuka Verifikasi & Persetujuan Penukaran Poin Warga")}
      </div>
    </div>
    ${pageFooter(15)}
  </div>

  <!-- ==================== HALAMAN 16: BAB VI ROLE ADMIN - MASTER DATA ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Role Administrator: Pengelolaan Master Data", "PANDUAN ADMINISTRATOR")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">6.5 Konfigurasi Master Data Bank Sampah</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Administrator memiliki wewenang untuk mengatur parameter dasar operasional sistem melalui menu Master Data:
        </p>

        <div class="step-item">
          <div class="step-num">A</div>
          <div class="step-text">
            <div class="step-title">Master Jenis Sampah & Tarif Poin</div>
            <div class="step-desc">Menentukan tarif konversi poin per kilogram untuk setiap kategori sampah (Organik, Anorganik, B3, Residu).</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">B</div>
          <div class="step-text">
            <div class="step-title">Master Wilayah Cakupan & Titik Jemput</div>
            <div class="step-desc">Menambah dan mengelola daftar RT/RW yang masuk dalam jangkauan operasional penjemputan sampah.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">C</div>
          <div class="step-text">
            <div class="step-title">Master Tagging Sampah</div>
            <div class="step-desc">Label prioritas untuk menandai setoran khusus (misal: "Prioritas", "Volume Besar", "Kerjasama Event").</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">D</div>
          <div class="step-text">
            <div class="step-title">Direktori Warga Terdaftar</div>
            <div class="step-desc">Memantau seluruh akun warga terdaftar beserta nomor kontak telepon dan alamat domisili.</div>
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminJenis, "https://setorsampah.id/admin/master-data", "Gambar 6.5: Pengelolaan Master Jenis Sampah & Tarif Poin")}
      </div>
    </div>
    ${pageFooter(16)}
  </div>

  <!-- ==================== HALAMAN 17: BAB VII PROFIL & KEAMANAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VII", "Profil Pengguna & Keamanan Akun", "PENGATURAN AKUN")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">7.1 Manajemen Data Pengguna</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Setiap pengguna dapat melihat informasi akun pribadinya melalui menu Profil Pengguna di pojok kanan navigasi.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 4px;">Informasi yang Ditampilkan:</h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">
            <div class="step-title">Identitas & Wilayah Domisili</div>
            <div class="step-desc">Menampilkan Nama Lengkap, Alamat Email terdaftar, Nomor Telepon, dan RT/RW domisili tempat tinggal.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">
            <div class="step-title">Ringkasan Saldo Poin Akun</div>
            <div class="step-desc">Memperlihatkan jumlah saldo poin terkini yang tersimpan di sistem.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">
            <div class="step-title">Fitur Pembaruan Kata Sandi (Password)</div>
            <div class="step-desc">Formulir ganti password untuk memperbarui kata sandi secara berkala demi menjaga keamanan akun.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-text">
            <div class="step-title">Prosedur Keluar Sesi (Logout)</div>
            <div class="step-desc">Selalu klik tombol "Keluar" setelah selesai bertransaksi pada perangkat yang digunakan bersama.</div>
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssProfil, "https://setorsampah.id/profil", "Gambar 7.1: Antarmuka Profil Akun Pengguna & Pengaturan Keamanan")}
      </div>
    </div>
    ${pageFooter(17)}
  </div>

  <!-- ==================== HALAMAN 18: BAB VIII FAQ & TROUBLESHOOTING ==================== -->
  <div class="page">
    ${pageHeader("BAB VIII", "Tanya Jawab (FAQ) & Pemecahan Masalah", "BANTUAN & DUKUNGAN")}
    <div class="page-body full-width">
      <div style="margin-bottom: 10px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #16211B;">Panduan Solusi Masalah Teknis Operasional</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Berikut adalah solusi langkah demi langkah terhadap kendala yang kerap dihadapi oleh pengguna warga maupun administrator.
        </p>
      </div>

      <div class="grid-2" style="gap: 12px; margin-bottom: 10px;">
        <div class="card-box" style="background: #FFFFFF;">
          <div style="font-size: 10.5px; font-weight: 700; color: #2E6B4E; margin-bottom: 4px;">Pertanyaan Sering Diajukan (FAQ)</div>
          <div style="font-size: 9px; line-height: 1.4; color: #374151;">
            <p><strong>T: Mengapa poin saya tidak langsung bertambah saat setor sampah?</strong><br>
            J: Setoran berstatus PENDING hingga petugas menimbang fisik sampah di lokasi. Poin bertambah otomatis setelah disetujui.</p>

            <p style="margin-top: 6px;"><strong>T: Mengapa saldo poin belum berkurang saat menukar barang?</strong><br>
            J: Ini adalah fitur keamanan sistem. Poin baru dipotong saat admin menyetujui transaksi dan menyerahkan barang secara langsung.</p>

            <p style="margin-top: 6px;"><strong>T: Apakah warga bisa membatalkan penukaran poin?</strong><br>
            J: Warga dapat menghubungi admin TPU untuk menolak permohonan penukaran sebelum statusnya diubah menjadi Approved.</p>
          </div>
        </div>

        <div class="card-box" style="background: #FFFFFF;">
          <div style="font-size: 10.5px; font-weight: 700; color: #B8433A; margin-bottom: 4px;">Panduan Penanganan Kendala (Troubleshooting)</div>
          <div style="font-size: 9px; line-height: 1.4; color: #374151;">
            <p><strong>1. Gagal Unggah Gambar Foto Barang</strong><br>
            Pastikan ukuran file foto tidak melebihi 2MB dan berformat JPG/PNG. Jika gagal, gunakan foto dengan resolusi standar.</p>

            <p style="margin-top: 6px;"><strong>2. Formulir Registrasi Menolak Nomor HP</strong><br>
            Periksa panjang nomor telepon. Sistem mewajibkan nomor HP minimal 10 digit angka tanpa karakter khusus (hanya angka).</p>

            <p style="margin-top: 6px;"><strong>3. Halaman Menampilkan Data Lama (Cache)</strong><br>
            Lakukan hard-refresh pada peramban web dengan menekan kombinasi tombol Ctrl + F5 (Windows) atau Cmd + Shift + R (Mac).</p>
          </div>
        </div>
      </div>

      <div class="callout">
        <div class="callout-title">Layanan Bantuan & Dukungan Teknis</div>
        <div class="callout-desc">
          Apabila Anda mengalami kendala data yang tidak tercantum di atas, silakan hubungi pengelola bank sampah setempat atau kirimkan laporan teknis melalui portal repositori resmi aplikasi.
        </div>
      </div>
    </div>
    ${pageFooter(18)}
  </div>

  <!-- ==================== HALAMAN 19: PENUTUP & LEMBAR PENGEMBANG ==================== -->
  <div class="page">
    ${pageHeader("PENUTUP", "Lembar Pengesahan & Informasi Pengembang", "LEGALITAS & PENUTUP")}
    <div class="page-body">
      <div class="col-left">
        <h3 style="font-size: 13px; font-weight: 700; color: #16211B;">9.1 Kesimpulan & Komitmen Berkelanjutan</h3>
        <p style="font-size: 9.5px; color: #4B5563;">
          Aplikasi Sistem Informasi Setor Sampah Mandiri dikembangkan dengan visi mewujudkan tata kelola lingkungan yang bersih, sehat, dan berdaya guna secara ekonomi.
          Melalui sistem insentif poin yang transparan dan alur validasi bertingkat, masyarakat terdorong untuk memilah sampah secara sukarela dan konsisten.
        </p>

        <h3 style="font-size: 12px; font-weight: 700; color: #16211B; margin-top: 6px;">9.2 Lembar Identitas Pengembang</h3>
        <table class="data-table">
          <tbody>
            <tr>
              <td style="width: 38%; font-weight: 700;">Nama Pengembang</td>
              <td><strong>Anjas Ardiansah</strong></td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Status Proyek</td>
              <td>Tugas Portofolio Mandiri (Individual Project)</td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Program Keahlian</td>
              <td>Pengembangan Perangkat Lunak dan Gim (PPLG)</td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Tingkat Pendidikan</td>
              <td>Kelas XII SMK</td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Tahun Rilis</td>
              <td>Edisi Resmi 2026 // Versi 1.0</td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Repositori Kode Sumber</td>
              <td style="word-break: break-all; font-family: monospace; font-size: 8px;">https://github.com/MaL1kq/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah</td>
            </tr>
            <tr>
              <td style="font-weight: 700;">Alamat Publikasi Live</td>
              <td style="word-break: break-all; font-family: monospace; font-size: 8px;">https://mal1kq.github.io/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah/</td>
            </tr>
          </tbody>
        </table>

        <div class="callout" style="margin-top: 6px;">
          <div class="callout-title">Hak Cipta & Integritas Dokumen</div>
          <div class="callout-desc">
            Seluruh kode program, desain antarmuka, dan materi panduan ini adalah karya orisinal Anjas Ardiansah. Dilarang mengubah atribusi atau menyalahgunakan hak cipta tanpa izin tertulis.
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="card-box" style="width: 100%; text-align: center; padding: 24px 16px; background: #FAFCFA; border: 2px dashed #CFE6D5;">
          <img src="${logoBase64}" style="width: 54px; height: 54px; object-fit: contain; margin-bottom: 12px;" alt="Logo" />
          <h4 style="font-size: 14px; font-weight: 700; color: #2E6B4E; margin-bottom: 4px;">SISTEM SETOR SAMPAH MANDIRI</h4>
          <div style="font-size: 9.5px; color: #6B7280; margin-bottom: 14px;">Platform Digital Bank Sampah Berbasis Insentif Poin</div>

          <div style="display: inline-block; padding: 4px 12px; background: #EAF3EC; border: 1px solid #CFE6D5; border-radius: 6px; font-size: 9px; font-weight: 700; color: #245439;">
            DOKUMEN PANDUAN PENGGUNA RESMI TERVERIFIKASI
          </div>

          <p style="font-size: 8.5px; color: #9CA3AF; margin-top: 14px; line-height: 1.4;">
            Hak Cipta 2026 Anjas Ardiansah. Seluruh hak cipta dilindungi undang-undang.<br>
            Diterbitkan untuk mendukung program digitalisasi kebersihan dan ekonomi sirkular lingkungan.
          </p>
        </div>
      </div>
    </div>
    ${pageFooter(19)}
  </div>

</body>
</html>
`;

async function buildPdf() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Loading HTML content into Puppeteer...');
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputHtmlPath = path.resolve(__dirname, '..', 'User_Manual_Sistem_Setor_Sampah_Anjas_Ardiansah.html');
  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log('HTML User Manual saved to:', outputHtmlPath);

  const outputPdfPath = path.resolve(__dirname, '..', 'User_Manual_Sistem_Setor_Sampah_Anjas_Ardiansah.pdf');
  console.log('Rendering PDF to:', outputPdfPath);

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  console.log('PDF User Manual successfully generated!');
  await browser.close();
}

buildPdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
