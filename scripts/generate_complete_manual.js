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

console.log('Generating complete human-designed User Manual V3 (Full Layout & Human Tone)...');

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
      <div class="footer-left">Buku Panduan Pengguna & Dokumentasi Teknis - Sistem Setor Sampah</div>
      <div class="footer-center">Karya Mandiri: Anjas Ardiansah (Kelas XII PPLG)</div>
      <div class="footer-right">Halaman ${pageNum} dari ${total}</div>
    </div>
  `;
}

function browserMockup(imageSrc, url = "https://setorsampah.id/app", caption = "", badges = []) {
  const badgeHtml = badges.length > 0 ? `
    <div class="mockup-badges">
      ${badges.map(b => `<div class="badge-item"><span class="badge-dot"></span><span>${b}</span></div>`).join('')}
    </div>
  ` : '';

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
        <img src="${imageSrc}" class="mockup-img" alt="Tangkapan Layar Antarmuka" />
      </div>
      ${caption ? `<div class="mockup-caption">${caption}</div>` : ''}
      ${badgeHtml}
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 297mm 210mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #D1D5DB;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #111827;
      font-size: 13px;
      line-height: 1.5;
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
      color: #111827;
      margin: 0;
    }
    p {
      margin: 0 0 6px 0;
      color: #374151;
    }

    /* HEADER & FOOTER */
    .page-header {
      height: 18mm;
      padding: 0 18mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #E5E7EB;
      background: #FAFCFA;
      flex-shrink: 0;
    }
    .header-badge {
      display: block;
      font-size: 9.5px;
      font-weight: 800;
      color: #2D6A4F;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }
    .header-title {
      font-size: 16.5px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.3px;
    }
    .header-app {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      background: #EAF3EC;
      border: 1px solid #CFE6D5;
      border-radius: 8px;
    }
    .app-mini-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }
    .app-name {
      font-size: 11px;
      font-weight: 800;
      color: #1B4332;
    }

    .page-footer {
      height: 12mm;
      padding: 0 18mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid #E5E7EB;
      background: #FAFCFA;
      font-size: 10.5px;
      color: #6B7280;
      flex-shrink: 0;
    }
    .footer-left { font-weight: 600; color: #374151; }
    .footer-center { color: #2D6A4F; font-weight: 700; }
    .footer-right {
      font-weight: 800;
      color: #111827;
      background: #EAF3EC;
      padding: 3px 12px;
      border-radius: 6px;
      border: 1px solid #CFE6D5;
    }

    /* FULL PAGE BODY CONTAINER */
    .page-body {
      flex: 1;
      height: 180mm;
      max-height: 180mm;
      padding: 8mm 18mm;
      display: flex;
      gap: 14mm;
      overflow: hidden;
      background: #FFFFFF;
      align-items: stretch;
    }
    .page-body.full-width {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .col-left {
      flex: 0 0 44%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow: hidden;
    }
    .col-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow: hidden;
    }

    /* STEP CARDS - TALL, CONFIDENT, FULL */
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      margin: 6px 0;
      justify-content: space-between;
    }
    .step-card {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      background: #F9FAF8;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 8px 12px;
    }
    .step-num {
      width: 26px;
      height: 26px;
      background: #2D6A4F;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 800;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .step-num.gold {
      background: #E5A93C;
      color: #111827;
    }
    .step-num.dark {
      background: #111827;
      color: #FFFFFF;
    }
    .step-text {
      flex: 1;
    }
    .step-title {
      font-weight: 800;
      color: #111827;
      font-size: 12.5px;
      margin-bottom: 2px;
    }
    .step-desc {
      font-size: 11px;
      color: #4B5563;
      line-height: 1.4;
    }

    /* EXTRA DETAIL ROW / MINI BOX */
    .detail-box {
      background: #F3F4F6;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 10.5px;
      color: #374151;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0;
    }

    /* HIGHLIGHT BANNERS / CALLOUTS */
    .bottom-banner {
      border-radius: 8px;
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex-shrink: 0;
    }
    .bottom-banner.gold {
      background: #FEF3C7;
      border-left: 5px solid #E5A93C;
    }
    .bottom-banner.green {
      background: #EAF3EC;
      border-left: 5px solid #2D6A4F;
    }
    .bottom-banner.dark {
      background: #1F2937;
      border-left: 5px solid #10B981;
      color: #FFFFFF;
    }
    .bottom-banner.dark .banner-title { color: #34D399; }
    .bottom-banner.dark .banner-text { color: #E5E7EB; }
    .banner-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .bottom-banner.gold .banner-title { color: #92400E; }
    .bottom-banner.green .banner-title { color: #1B4332; }
    .banner-text {
      font-size: 10.5px;
      color: #374151;
      line-height: 1.4;
    }

    /* BROWSER MOCKUP - EXPANDED & CRISP */
    .browser-mockup {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border: 1.5px solid #D1D5DB;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .browser-bar {
      height: 28px;
      background: #F3F4F6;
      border-bottom: 1.5px solid #E5E7EB;
      padding: 0 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .browser-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-red { background: #EF4444; }
    .dot-yellow { background: #F59E0B; }
    .dot-green { background: #10B981; }
    .browser-url {
      font-size: 10px;
      color: #4B5563;
      background: #FFFFFF;
      padding: 3px 14px;
      border-radius: 5px;
      border: 1px solid #E5E7EB;
      width: 75%;
      font-family: monospace;
      font-weight: 600;
    }
    .browser-viewport {
      flex: 1;
      width: 100%;
      background: #ECEEF0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 4px;
    }
    .mockup-img {
      width: 100%;
      height: 100%;
      max-height: 136mm;
      object-fit: contain;
      display: block;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .mockup-caption {
      font-size: 10px;
      font-weight: 600;
      color: #4B5563;
      padding: 5px 14px;
      background: #F3F4F6;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      flex-shrink: 0;
    }
    .mockup-badges {
      display: flex;
      gap: 8px;
      padding: 6px 12px;
      background: #FAFAFA;
      border-top: 1px solid #E5E7EB;
      flex-shrink: 0;
      flex-wrap: wrap;
    }
    .badge-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      font-weight: 700;
      color: #1F2937;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2D6A4F;
    }

    /* BADGES & DATA TABLES */
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 5px;
      font-size: 10px;
      font-weight: 700;
    }
    .badge-green { background: #EAF3EC; color: #1B4332; border: 1px solid #CFE6D5; }
    .badge-yellow { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
    .badge-red { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
    .badge-gray { background: #F3F4F6; color: #1F2937; border: 1px solid #E5E7EB; }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin: 6px 0;
    }
    .data-table th {
      background: #F3F4F6;
      color: #111827;
      font-weight: 800;
      text-align: left;
      padding: 7px 10px;
      border-bottom: 2px solid #D1D5DB;
      border-top: 1px solid #E5E7EB;
    }
    .data-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #E5E7EB;
      color: #374151;
    }
    .data-table tr:last-child td {
      border-bottom: 2px solid #D1D5DB;
    }

    /* GRID BOXES */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 12px;
    }
    .card-box {
      background: #FFFFFF;
      border: 1.5px solid #E5E7EB;
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* COVER PAGE STYLING - EDITORIAL SPREAD LOOK */
    .cover-container {
      width: 100%;
      height: 100%;
      display: flex;
      background: #111827;
      color: #FFFFFF;
      position: relative;
      overflow: hidden;
    }
    .cover-left {
      width: 55%;
      height: 100%;
      padding: 16mm 18mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      background: #1B4332;
    }
    .cover-right {
      width: 45%;
      height: 100%;
      background: #111827;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16mm;
      z-index: 1;
      border-left: 6px solid #E5A93C;
    }
    .cover-top-tag {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cover-logo-box {
      width: 52px;
      height: 52px;
      background: #FFFFFF;
      padding: 6px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .cover-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .cover-tagline-text {
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #FBBF24;
    }
    .cover-title-group {
      margin: 6mm 0;
    }
    .cover-pill {
      display: inline-block;
      padding: 5px 14px;
      background: #E5A93C;
      color: #111827;
      font-size: 11px;
      font-weight: 900;
      border-radius: 5px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .cover-title {
      font-size: 38px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.12;
      letter-spacing: -0.8px;
      margin-bottom: 10px;
    }
    .cover-subtitle {
      font-size: 13.5px;
      color: #D1FAE5;
      line-height: 1.5;
      max-width: 480px;
    }
    .cover-badges-row {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .cover-pill-tag {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      color: #FFFFFF;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
    }
    .cover-meta {
      border-top: 1.5px solid rgba(255, 255, 255, 0.2);
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .cover-author-title {
      font-size: 9.5px;
      color: #A7F3D0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .cover-author-name {
      font-size: 16px;
      font-weight: 800;
      color: #FFFFFF;
      margin-top: 2px;
    }
    .cover-author-role {
      font-size: 11px;
      color: #D1FAE5;
    }
    .cover-version {
      text-align: right;
      font-size: 11px;
      color: #A7F3D0;
    }
    .cover-version strong {
      color: #FBBF24;
      font-size: 14px;
      display: block;
    }

    /* RIGHT HERO PREVIEW */
    .cover-hero-card {
      background: #1F2937;
      border: 1px solid #374151;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .cover-hero-bar {
      height: 24px;
      background: #374151;
      display: flex;
      align-items: center;
      padding: 0 10px;
      gap: 6px;
    }
    .cover-hero-img-box {
      flex: 1;
      background: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .cover-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
    .cover-feature-grid {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cover-feature-row {
      background: #1F2937;
      border: 1px solid #374151;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 11.5px;
      color: #F3F4F6;
    }
    .cover-feature-icon {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #E5A93C;
      flex-shrink: 0;
    }
  </style>
</head>
<body>

  <!-- ==================== HALAMAN 1: COVER ==================== -->
  <div class="page">
    <div class="cover-container">
      <div class="cover-left">
        <div class="cover-top-tag">
          <div class="cover-logo-box">
            <img src="${logoBase64}" class="cover-logo" alt="Logo Setor Sampah" />
          </div>
          <div>
            <div class="cover-tagline-text">Dokumentasi & Panduan Resmi Pengguna</div>
            <div style="font-size: 11px; color: #D1FAE5; font-weight: 500;">Aplikasi Bank Sampah Mandiri Berbasis Poin Sembako</div>
          </div>
        </div>

        <div class="cover-title-group">
          <div class="cover-pill">BUKU PANDUAN PENGGUNA (USER MANUAL)</div>
          <h1 class="cover-title">SISTEM INFORMASI<br>SETOR SAMPAH</h1>
          <p class="cover-subtitle">
            Panduan lengkap langkah demi langkah untuk Warga dan Petugas Bank Sampah.
            Mulai dari pemilahan sampah di rumah, penimbangan akurat, kalkulasi poin hadiah,
            hingga penukaran beras dan minyak goreng secara aman.
          </p>
          <div class="cover-badges-row">
            <span class="cover-pill-tag">Bebas Emotikon / Emoji</span>
            <span class="cover-pill-tag">Validasi Fisik & Poin Akurat</span>
            <span class="cover-pill-tag">Next.js 14 + Tailwind CSS</span>
          </div>
        </div>

        <div class="cover-meta">
          <div>
            <div class="cover-author-title">Dibuat & Dikembangkan Oleh</div>
            <div class="cover-author-name">Anjas Ardiansah</div>
            <div class="cover-author-role">Tugas Portofolio Mandiri - Kelas XII PPLG</div>
          </div>
          <div class="cover-version">
            Edisi Revisi Resmi
            <strong>Tahun 2026 // Versi 1.0</strong>
          </div>
        </div>
      </div>

      <div class="cover-right">
        <div class="cover-hero-card">
          <div class="cover-hero-bar">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span style="font-size: 9.5px; color: #9CA3AF; margin-left: 8px; font-family: monospace;">setorsampah.id/dashboard</span>
          </div>
          <div class="cover-hero-img-box">
            <img src="${ssDashWarga}" class="cover-hero-img" alt="Pratinjau Dashboard" />
          </div>
        </div>

        <div class="cover-feature-grid">
          <div class="cover-feature-row">
            <span class="cover-feature-icon"></span>
            <span><strong>Kalkulator Poin Otomatis:</strong> Hitung estimasi hadiah poin saat memasukkan berat sampah.</span>
          </div>
          <div class="cover-feature-row">
            <span class="cover-feature-icon"></span>
            <span><strong>Poin Aman (Pending):</strong> Saldo warga baru terpotong saat barang sembako diserahkan fisik.</span>
          </div>
          <div class="cover-feature-row">
            <span class="cover-feature-icon"></span>
            <span><strong>Kelola Foto Mudah:</strong> Admin bisa upload foto barang langsung dari file tanpa link URL.</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== HALAMAN 2: DAFTAR ISI ==================== -->
  <div class="page">
    ${pageHeader("BAGIAN AWAL", "Daftar Isi & Struktur Buku Panduan", "NAVIGASI DOKUMEN")}
    <div class="page-body full-width">
      <div style="margin-bottom: 6px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #111827;">Struktur Pembahasan Buku Panduan</h3>
        <p style="font-size: 12px; color: #4B5563;">Panduan ini dirancang agar mudah dibaca oleh warga maupun petugas pengelola bank sampah.</p>
      </div>

      <div class="grid-3" style="gap: 14px; flex: 1;">
        <!-- BAGIAN 1 -->
        <div class="card-box" style="border-top: 5px solid #2D6A4F; background: #FAFCFA;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #2D6A4F; margin-bottom: 10px; text-transform: uppercase;">
              Bagian 1: Pengenalan & Sistem
            </div>
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Daftar Isi & Struktur Buku</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 2</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Psikologi Warna & Alasan Desain</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 3</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab I: Pendahuluan & Latar Belakang</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 4</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab II: Syarat Akses & Perangkat</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 5</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab III: Alur Kerja Penimbangan</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 6</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Bab IV: Cara Daftar Akun & Login</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 7</td></tr>
            </table>
          </div>
          <div class="bottom-banner green" style="margin-top: 10px; padding: 8px 10px;">
            <div class="banner-title" style="font-size: 10.5px;">Bagi Pengguna Baru</div>
            <div class="banner-text" style="font-size: 10px;">Warga disarankan membaca Bab IV dan Bab V terlebih dahulu sebelum menyetor sampah ke lokasi.</div>
          </div>
        </div>

        <!-- BAGIAN 2 -->
        <div class="card-box" style="border-top: 5px solid #E5A93C; background: #FAFCFA;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #92400E; margin-bottom: 10px; text-transform: uppercase;">
              Bagian 2: Panduan Warga & Sembako
            </div>
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab V: Dashboard & Cek Saldo Poin</td><td style="text-align: right; font-weight: 800; color: #92400E;">Hal 8</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab V: Cara Mengisi Form Setor Sampah</td><td style="text-align: right; font-weight: 800; color: #92400E;">Hal 9</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab V: Katalog Sembako & Cara Tukar Poin</td><td style="text-align: right; font-weight: 800; color: #92400E;">Hal 10</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab V: Cek Status Pengajuan Sembako</td><td style="text-align: right; font-weight: 800; color: #92400E;">Hal 11</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VI: Dashboard Petugas Admin</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 12</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Bab VI: Verifikasi & Setujui Setoran</td><td style="text-align: right; font-weight: 800; color: #2D6A4F;">Hal 13</td></tr>
            </table>
          </div>
          <div class="bottom-banner gold" style="margin-top: 10px; padding: 8px 10px;">
            <div class="banner-title" style="font-size: 10.5px;">Aturan Poin Sembako</div>
            <div class="banner-text" style="font-size: 10px;">Poin tidak langsung berkurang saat klik tukar demi keamanan saldo warga.</div>
          </div>
        </div>

        <!-- BAGIAN 3 -->
        <div class="card-box" style="border-top: 5px solid #111827; background: #FAFCFA;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #111827; margin-bottom: 10px; text-transform: uppercase;">
              Bagian 3: Admin & Bantuan Teknis
            </div>
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VI: Kelola Barang, Stok & Upload Foto</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 14</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VI: Setujui Penukaran Sembako Warga</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 15</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VI: Master Tarif Poin & Wilayah RT/RW</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 16</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VII: Edit Profil & Ganti Password</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 17</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px dashed #E5E7EB; font-weight: 600;">Bab VIII: Tanya Jawab (FAQ) & Solusi Error</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 18</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Penutup & Lembar Identitas Pembuat</td><td style="text-align: right; font-weight: 800; color: #111827;">Hal 19</td></tr>
            </table>
          </div>
          <div class="bottom-banner dark" style="margin-top: 10px; padding: 8px 10px;">
            <div class="banner-title" style="font-size: 10.5px;">Bebas Emotikon / Emoji</div>
            <div class="banner-text" style="font-size: 10px;">Dokumen ini mematuhi standar laporan teknis formal tanpa menggunakan karakter emoji.</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFooter(2)}
  </div>

  <!-- ==================== HALAMAN 3: PSIKOLOGI WARNA & SISTEM DESAIN ==================== -->
  <div class="page">
    ${pageHeader("BAGIAN AWAL", "Kenapa Warna Ini Dipilih? (Psikologi Warna & Desain)", "LANDASAN DESAIN")}
    <div class="page-body full-width">
      <div style="margin-bottom: 6px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #111827;">Alasan Pemilihan Warna Pada Aplikasi Setor Sampah</h3>
        <p style="font-size: 12px; color: #4B5563;">
          Warna di aplikasi ini bukan sekadar hiasan. Setiap warna dipilih agar warga merasa nyaman, termotivasi memilah sampah,
          dan gampang membedakan mana sampah organik, anorganik, sampai bahan berbahaya.
        </p>
      </div>

      <div class="grid-4" style="gap: 12px; flex: 1; margin-bottom: 10px;">
        <!-- HIJAU HUTAN -->
        <div class="card-box" style="border-top: 6px solid #2D6A4F; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 14px; color: #1B4332;">Hijau Hutan</span>
              <span class="badge badge-green">#2D6A4F</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #2D6A4F; margin-bottom: 8px;">Warna Utama (Identitas Lingkungan)</div>
            <p style="font-size: 11.5px; color: #374151; line-height: 1.45;">
              Warna hijau identik dengan alam, kesegaran daun, dan kebersihan. Kami memilih hijau tua yang tenang (bukan hijau neon)
              supaya antarmuka terlihat resmi, bersih, dan memberi rasa percaya kepada warga bahwa sampah mereka dikelola dengan jujur.
            </p>
          </div>
          <div style="font-size: 10.5px; background: #EAF3EC; padding: 6px 8px; border-radius: 6px; color: #1B4332; font-weight: 600;">
            Dipakai pada: Tombol utama, header status, dan kategori sampah Organik.
          </div>
        </div>

        <!-- EMAS MARIGOLD -->
        <div class="card-box" style="border-top: 6px solid #E5A93C; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 14px; color: #92400E;">Emas Marigold</span>
              <span class="badge badge-yellow">#E5A93C</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #92400E; margin-bottom: 8px;">Warna Aksen (Nilai Poin & Sembako)</div>
            <p style="font-size: 11.5px; color: #374151; line-height: 1.45;">
              Sesuai pepatah 'Sampah Menjadi Berkah', warna emas ini dipakai untuk menunjukkan nilai uang dan poin.
              Warna ini menarik perhatian dan membuat warga bersemangat mengumpulkan poin karena tahu poin itu bisa ditukar beras atau minyak goreng.
            </p>
          </div>
          <div style="font-size: 10.5px; background: #FEF3C7; padding: 6px 8px; border-radius: 6px; color: #92400E; font-weight: 600;">
            Dipakai pada: Angka saldo poin, badge Anorganik, dan katalog sembako.
          </div>
        </div>

        <!-- KERTAS ALAMI -->
        <div class="card-box" style="border-top: 6px solid #D1D5DB; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 14px; color: #374151;">Putih Kertas</span>
              <span class="badge badge-gray">#F9FAF8</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 8px;">Latar Belakang (Nyaman di Mata)</div>
            <p style="font-size: 11.5px; color: #374151; line-height: 1.45;">
              Kami tidak memakai warna putih silau 100%, melainkan putih lembut seperti kertas daur ulang.
              Latar belakang ini membuat warga dan petugas tidak cepat lelah matanya saat melihat daftar setoran di layar HP atau komputer.
            </p>
          </div>
          <div style="font-size: 10.5px; background: #F3F4F6; padding: 6px 8px; border-radius: 6px; color: #374151; font-weight: 600;">
            Dipakai pada: Bidang latar kartu, form input, dan sel tabel data.
          </div>
        </div>

        <!-- TINTA GELAP -->
        <div class="card-box" style="border-top: 6px solid #111827; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 14px; color: #111827;">Tinta Slate</span>
              <span class="badge badge-gray">#111827</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #111827; margin-bottom: 8px;">Tulisan Jelas & Kontras Tinggi</div>
            <p style="font-size: 11.5px; color: #374151; line-height: 1.45;">
              Warna teks menggunakan abu-abu arang pekat (slate ink). Ini memastikan tulisan di layar sangat tajam,
              sehingga tetap gampang dibaca oleh orang tua di RT/RW meski layar ponselnya sedang berada di bawah sinar matahari.
            </p>
          </div>
          <div style="font-size: 10.5px; background: #E5E7EB; padding: 6px 8px; border-radius: 6px; color: #111827; font-weight: 600;">
            Dipakai pada: Judul menu, teks panduan, dan angka berat timbangan.
          </div>
        </div>
      </div>

      <div class="bottom-banner dark" style="padding: 12px 18px;">
        <div class="banner-title" style="font-size: 13px;">Prinsip Desain: Mudah Dipahami Warga Semua Usia</div>
        <div class="banner-text" style="font-size: 11.5px;">
          Font tulisan menggunakan <strong>Google Inter</strong> yang terkenal sangat jelas di layar HP, dan font judul menggunakan <strong>Google Sora</strong> yang tegas.
          Semua tombol sengaja dibuat besar agar tidak meleset saat ditekan oleh warga lanjut usia.
        </div>
      </div>
    </div>
    ${pageFooter(3)}
  </div>

  <!-- ==================== HALAMAN 4: BAB I PENDAHULUAN ==================== -->
  <div class="page">
    ${pageHeader("BAB I", "Kenapa Aplikasi Ini Dibuat? (Latar Belakang & Tujuan)", "PENGANTAR SISTEM")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">1.1 Masalah di Bank Sampah RT/RW</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Selama ini di lingkungan tempat tinggal kami, bank sampah masih dicatat manual pakai buku tulis biasa.
            Pencatatan manual ini sering menimbulkan masalah: buku kas ketumpahan air, warga lupa berapa tabungan sampahnya,
            dan pengurus kewalahan menghitung berapa banyak sembako yang harus disiapkan.
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Warga Tahu Poin dari Rumah</div>
              <div class="step-desc">Sebelum bawa sampah ke balai RT, warga bisa cek dulu perkiraan poin yang didapat lewat fitur kalkulator otomatis.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Pencatatan Timbangan yang Jujur</div>
              <div class="step-desc">Petugas menimbang sampah di lokasi dan langsung memasukkan angka ke sistem di depan warga agar tidak ada selisih.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Tukar Sampah Jadi Beras & Minyak</div>
              <div class="step-desc">Warga bisa menukar poin mereka dengan barang kebutuhan dapur tanpa uang tunai, sehingga lingkungan bersih dan dapur terbantu.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Laporan Kas & Neraca Sampah Bersih</div>
              <div class="step-desc">Pengurus RT/RW bisa melihat total tonase sampah yang terkumpul kapan saja tanpa perlu merekap kertas kwitansi lama.</div>
            </div>
          </div>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Siapa Saja yang Menggunakan Aplikasi Ini?</div>
          <div class="banner-text"><strong>Warga:</strong> Menyetor sampah dan menukar poin sembako. | <strong>Admin TPU:</strong> Menimbang sampah fisik, menyetujui setoran, dan mengelola stok sembako.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashWarga, "https://setorsampah.id/overview", "Gambar 1.1: Halaman Depan Layanan Setor Sampah Mandiri", ["Tampilan Ringkas", "Poin Real-Time", "Navigasi Jelas"])}
      </div>
    </div>
    ${pageFooter(4)}
  </div>

  <!-- ==================== HALAMAN 5: BAB II PERSYARATAN SISTEM ==================== -->
  <div class="page">
    ${pageHeader("BAB II", "Perangkat yang Dibutuhkan & Cara Membuka Web", "SYARAT AKSES")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">2.1 Bisa Dibuka Lewat HP dan Komputer</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Aplikasi ini dibuat berbasis web, jadi warga tidak perlu repot mendownload file aplikasi berat dari Play Store.
            Cukup buka browser yang sudah ada di HP masing-masing lalu ketik alamat web kami.
          </p>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Perangkat</th>
              <th>Spesifikasi Cukup</th>
              <th>Keterangan Penggunaan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>HP Android / iPhone</strong></td>
              <td>RAM 2 GB, Ada Chrome</td>
              <td>Sangat praktis untuk warga mengisi setoran sampah dari rumah.</td>
            </tr>
            <tr>
              <td><strong>Laptop / Komputer</strong></td>
              <td>RAM 4 GB, Layar 14 inch</td>
              <td>Sangat nyaman untuk petugas admin di balai RT saat menimbang sampah.</td>
            </tr>
            <tr>
              <td><strong>Koneksi Internet</strong></td>
              <td>Kuota 3G/4G atau WiFi RT</td>
              <td>Halaman web sangat hemat kuota (ukuran data di bawah 1 MB).</td>
            </tr>
          </tbody>
        </table>

        <div class="step-card" style="padding: 7px 10px;">
          <div class="step-num gold">Tip</div>
          <div class="step-text">
            <div class="step-title">Pasang di Layar Utama HP (Add to Home Screen)</div>
            <div class="step-desc">Buka link web di Chrome HP, klik titik tiga di pojok kanan atas, lalu pilih <em>Tambahkan ke Layar Utama</em>. Web akan berfungsi seperti aplikasi biasa!</div>
          </div>
        </div>

        <div class="bottom-banner gold">
          <div class="banner-title">Alamat Web Resmi (Link Akses Langsung):</div>
          <div class="banner-text" style="font-family: monospace; font-size: 10.5px; word-break: break-all; margin-top: 2px;">
            https://mal1kq.github.io/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah/
          </div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssLoginFull, "https://setorsampah.id/login", "Gambar 2.1: Halaman Masuk Akun yang Pas di Segala Ukuran Layar", ["Bisa di HP", "Bisa di Laptop", "Bebas Download"])}
      </div>
    </div>
    ${pageFooter(5)}
  </div>

  <!-- ==================== HALAMAN 6: BAB III ALUR KERJA ==================== -->
  <div class="page">
    ${pageHeader("BAB III", "Bagaimana Cara Kerjanya? (Alur Dari Rumah ke Sembako)", "ALUR KERJA")}
    <div class="page-body full-width">
      <div style="margin-bottom: 6px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #111827;">Tiga Langkah Utama: Dari Pilah Sampah Sampai Dapat Beras</h3>
        <p style="font-size: 12px; color: #4B5563;">
          Sistem ini menerapkan verifikasi fisik di lokasi timbangan agar tidak ada warga yang salah klaim poin atau salah timbang.
        </p>
      </div>

      <div class="grid-3" style="gap: 14px; flex: 1;">
        <!-- LANGKAH 1 -->
        <div class="card-box" style="border-top: 5px solid #2D6A4F; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="step-num">01</span>
              <span style="font-size: 14px; font-weight: 800; color: #1B4332;">Warga Pilah Sampah</span>
            </div>
            <div style="font-size: 11.5px; color: #374151; line-height: 1.5;">
              <strong>Di Rumah Warga:</strong><br>
              1. Pisahkan sampah organik (sisa makanan) dan sampah anorganik (kardus, botol plastik, kaleng).<br>
              2. Buka menu <em>Setor Sampah</em> di HP.<br>
              3. Ketik perkiraan berat (misal: 3 kg botol plastik).<br>
              4. Sistem langsung menghitung estimasi poin yang bakal didapat.<br>
              5. Klik kirim. Status di HP menjadi <strong>Menunggu Verifikasi</strong>.
            </div>
          </div>
          <div style="background: #EAF3EC; padding: 8px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #1B4332;">
            Hasil: Data setoran masuk ke layar admin RT.
          </div>
        </div>

        <!-- LANGKAH 2 -->
        <div class="card-box" style="border-top: 5px solid #E5A93C; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="step-num gold">02</span>
              <span style="font-size: 14px; font-weight: 800; color: #92400E;">Admin Timbang Fisik</span>
            </div>
            <div style="font-size: 11.5px; color: #374151; line-height: 1.5;">
              <strong>Di Balai RT / Bank Sampah:</strong><br>
              1. Warga bawa sampah ke balai warga (atau dijemput petugas).<br>
              2. Petugas menimbang sampah di timbangan digital secara terbuka.<br>
              3. Petugas mencocokkan data di aplikasi.<br>
              4. Petugas menekan tombol <strong>Setujui</strong>.<br>
              5. Poin langsung masuk ke akun HP warga detik itu juga.
            </div>
          </div>
          <div style="background: #FEF3C7; padding: 8px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #92400E;">
            Hasil: Saldo poin warga bertambah otomatis.
          </div>
        </div>

        <!-- LANGKAH 3 -->
        <div class="card-box" style="border-top: 5px solid #111827; background: #FAFCFA;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="step-num dark">03</span>
              <span style="font-size: 14px; font-weight: 800; color: #111827;">Tukar Jadi Sembako</span>
            </div>
            <div style="font-size: 11.5px; color: #374151; line-height: 1.5;">
              <strong>Serah Terima Barang:</strong><br>
              1. Warga buka menu <em>Tukar Poin</em> dan pilih beras/minyak goreng.<br>
              2. Status pesanan menjadi <strong>Pending (Poin belum terpotong)</strong>.<br>
              3. Warga datang mengambil paket sembako di loket.<br>
              4. Petugas menyerahkan barang lalu klik <strong>Setujui Penukaran</strong>.<br>
              5. Poin warga dan stok sembako berkurang bersamaan.
            </div>
          </div>
          <div style="background: #E5E7EB; padding: 8px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #111827;">
            Hasil: Warga bawa pulang beras, poin terpotong sah.
          </div>
        </div>
      </div>

      <div class="bottom-banner dark" style="padding: 10px 16px;">
        <div class="banner-title">Kenapa Poin Belum Berkurang Saat Warga Klik Tukar?</div>
        <div class="banner-text">
          Ini adalah fitur keamanan terbaik di aplikasi kami. Kalau stok beras di balai RT tiba-tiba habis, poin warga tetap utuh dan tidak hilang. Poin baru berkurang kalau barangnya sudah ada di tangan warga!
        </div>
      </div>
    </div>
    ${pageFooter(6)}
  </div>

  <!-- ==================== HALAMAN 7: BAB IV DAFTAR & LOGIN ==================== -->
  <div class="page">
    ${pageHeader("BAB IV", "Cara Mendaftar Akun Warga Baru & Masuk (Login)", "PANDUAN AKUN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">4.1 Cara Membuat Akun Baru</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Bagi warga yang baru pertama kali ingin menyetor sampah, buat akun dengan mengisi formulir sederhana:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Isi Nama Lengkap & Email</div>
              <div class="step-desc">Tulis nama asli sesuai KTP agar petugas bank sampah mengenali Anda saat penimbangan.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Masukkan Nomor HP (Minimal 10 Digit)</div>
              <div class="step-desc">Nomor HP wajib aktif agar petugas bisa mengirim pesan jadwal penjemputan sampah ke rumah Anda.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Buat Password Aman (Minimal 6 Huruf/Angka)</div>
              <div class="step-desc">Gunakan kata sandi yang mudah Anda ingat tapi sulit ditebak orang lain.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Klik Tombol Hijau 'Daftar'</div>
              <div class="step-desc">Akun langsung aktif seketika tanpa perlu menunggu verifikasi email yang berbelit-belit.</div>
            </div>
          </div>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Uji Coba Cepat (Versi Web Demo):</div>
          <div class="banner-text">Pada versi GitHub Pages, Anda bisa langsung memilih tombol 'Warga' atau 'Admin TPU' untuk mencoba seluruh fitur tanpa perlu ketik password.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssRegisterFull, "https://setorsampah.id/register", "Gambar 4.1: Layar Pendaftaran Akun Warga dengan Input Nomor Telepon", ["Nomor HP Wajib", "Validasi Otomatis", "Langsung Aktif"])}
      </div>
    </div>
    ${pageFooter(7)}
  </div>

  <!-- ==================== HALAMAN 8: BAB V ROLE WARGA - DASHBOARD ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Tampilan Utama Warga: Pantau Saldo Poin & Edukasi", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">5.1 Apa Saja yang Ada di Layar Beranda Warga?</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Setiap kali login, warga langsung disajikan informasi ringkas mengenai pencapaian pilah sampahnya:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num gold">A</div>
            <div class="step-text">
              <div class="step-title">Kotak Saldo Poin Aktif</div>
              <div class="step-desc">Menampilkan jumlah poin yang Anda miliki sekarang. Poin ini langsung siap ditukar dengan barang sembako.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">B</div>
            <div class="step-text">
              <div class="step-title">Kotak Status Setoran Terakhir</div>
              <div class="step-desc">Memperlihatkan berapa kali setoran Anda yang sudah disetujui (Approved) dan berapa yang masih diperiksa petugas (Pending).</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">C</div>
            <div class="step-text">
              <div class="step-title">Panduan Singkat Memilah Sampah</div>
              <div class="step-desc">Pengingat praktis jenis sampah apa saja yang laku dan diterima di bank sampah RT/RW.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">D</div>
            <div class="step-text">
              <div class="step-title">Tombol Cepat '+ Setor Sampah Sekarang'</div>
              <div class="step-desc">Tombol hijau di pojok kanan atas untuk langsung membuka formulir pengajuan setoran baru.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span><strong>Tarif Resmi Poin:</strong> Organik: 10/kg | Anorganik: 15/kg | B3: 20/kg</span>
          <span class="badge badge-green">Poin Tetap</span>
        </div>

        <div class="bottom-banner gold">
          <div class="banner-title">Tips Agar Cepat Dapat Poin Banyak:</div>
          <div class="banner-text">Kumpulkan sampah kardus dan botol plastik air mineral dalam keadaan bersih dan kering. Sampah kering bernilai poin lebih tinggi!</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashWarga, "https://setorsampah.id/dashboard", "Gambar 5.1: Layar Beranda Warga dengan Angka Saldo Poin yang Jelas", ["Saldo Poin Besar", "Status Setoran", "Edukasi Pemilahan"])}
      </div>
    </div>
    ${pageFooter(8)}
  </div>

  <!-- ==================== HALAMAN 9: BAB V ROLE WARGA - SETOR SAMPAH ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Cara Mengisi Formulir Setor Sampah dari Rumah", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">5.2 Langkah Demi Langkah Mengisi Setoran</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Tidak perlu bingung menghitung tarif, sistem kami sudah menyediakan kalkulator poin otomatis:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Pilih Jenis Sampah Anda</div>
              <div class="step-desc">Pilih kategori: Organik (10 poin/kg), Anorganik (15 poin/kg), B3 (20 poin/kg), atau Residu (5 poin/kg).</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Ketik Perkiraan Berat (KG)</div>
              <div class="step-desc">Masukkan berat sampah, misalnya 2.5 KG. Boleh pakai koma atau angka desimal.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Lihat Hasil Estimasi Poin</div>
              <div class="step-desc">Layar langsung menampilkan berapa poin yang akan Anda terima begitu petugas menimbang fisik.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">4</div>
            <div class="step-text">
              <div class="step-title">Pilih Wilayah RT Anda & Kirim</div>
              <div class="step-desc">Pilih lokasi RT/RW tempat Anda tinggal, lalu tekan tombol hijau 'Kirim Setoran'.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Contoh: 2.5 KG Anorganik x 15 Poin = <strong>37 Poin Hadiah</strong></span>
          <span class="badge badge-yellow">Hitung Otomatis</span>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Perlu Dicatat:</div>
          <div class="banner-text">Angka berat ini adalah estimasi awal. Berat resmi yang dipakai adalah hasil timbangan digital milik petugas di lokasi penyerahan balai RT.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssSetor, "https://setorsampah.id/setor", "Gambar 5.2: Formulir Pengisian Setoran Sampah Mandiri", ["Pilihan Kategori", "Kalkulator Poin", "Pilih RT/RW"])}
      </div>
    </div>
    ${pageFooter(9)}
  </div>

  <!-- ==================== HALAMAN 10: BAB V ROLE WARGA - KATALOG TUKAR POIN ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Belanja Sembako dengan Poin (Katalog Barang)", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">5.3 Cara Menukar Poin Menjadi Sembako</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Kalau saldo poin Anda sudah cukup, Anda bisa langsung memilih barang kebutuhan pokok di katalog:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num gold">1</div>
            <div class="step-text">
              <div class="step-title">Buka Menu 'Tukar Poin'</div>
              <div class="step-desc">Anda akan melihat deretan barang sembako lengkap dengan foto asli, jumlah poin yang dibutuhkan, dan sisa stok.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num gold">2</div>
            <div class="step-text">
              <div class="step-title">Pilih Barang yang Anda Butuhkan</div>
              <div class="step-desc">Contoh: Beras 5 KG (100 Poin), Minyak Goreng 2L (60 Poin), Gula Pasir 1 KG (30 Poin).</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num gold">3</div>
            <div class="step-text">
              <div class="step-title">Klik Tombol 'Tukar Sekarang'</div>
              <div class="step-desc">Sistem mencatat pesanan Anda. Statusnya adalah Menunggu Persetujuan Admin.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Pantau Status di Menu Riwayat</div>
              <div class="step-desc">Buka riwayat penukaran poin untuk memastikan pengajuan Anda sudah masuk antrean serah terima.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Daftar Sembako: Beras 5KG (100 Poin) | Sabun Cuci (50 Poin) | Voucher Tunai (500 Poin)</span>
          <span class="badge badge-green">Tersedia</span>
        </div>

        <div class="bottom-banner gold">
          <div class="banner-title">JAMINAN SALDO AMAN:</div>
          <div class="banner-text">Poin Anda <strong>BELUM BERKURANG</strong> pada langkah ini! Saldo baru dipotong kalau barang sembakonya sudah siap diambil dan disetujui petugas bank sampah.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssTukar, "https://setorsampah.id/tukar-poin", "Gambar 5.3: Etalase Katalog Sembako Penukaran Poin", ["Foto Barang Jelas", "Stok Terlihat", "Poin Dibutuhkan"])}
      </div>
    </div>
    ${pageFooter(10)}
  </div>

  <!-- ==================== HALAMAN 11: BAB V ROLE WARGA - RIWAYAT PENUKARAN ==================== -->
  <div class="page">
    ${pageHeader("BAB V", "Cek Status Pengajuan Sembako & Cara Pengambilan", "PANDUAN WARGA")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">5.4 Memantau Status Pesanan Barang Anda</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Warga bisa memantau apakah barang sembakonya sudah disetujui atau belum lewat tabel Riwayat Penukaran:
          </p>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Status di Layar</th>
              <th>Artinya</th>
              <th>Status Saldo Poin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-yellow">MENUNGGU</span></td>
              <td>Pengajuan sudah masuk, petugas sedang mengecek ketersediaan beras/minyak di gudang.</td>
              <td><strong>Poin masih utuh</strong> (belum dipotong).</td>
            </tr>
            <tr>
              <td><span class="badge badge-green">DISETUJUI</span></td>
              <td>Barang sudah siap dan diserahkan ke tangan warga di balai RT.</td>
              <td><strong>Poin dipotong resmi</strong> secara otomatis.</td>
            </tr>
            <tr>
              <td><span class="badge badge-red">DITOLAK</span></td>
              <td>Stok barang fisik di gudang habis atau pemesanan dibatalkan.</td>
              <td><strong>Poin tetap aman</strong> tanpa potongan apapun.</td>
            </tr>
          </tbody>
        </table>

        <div class="step-card" style="padding: 7px 10px;">
          <div class="step-num">!</div>
          <div class="step-text">
            <div class="step-title">Cara Ambil Barang Fisik di Balai RT</div>
            <div class="step-desc">Datang ke lokasi bank sampah, sebutkan nama akun Anda, dan petugas akan menyerahkan barang sembakonya kepada Anda setelah status disetujui.</div>
          </div>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Kepastian Transaksi:</div>
          <div class="banner-text">Tidak ada risiko poin hilang tanpa barang. Sistem pencatatan ini melindungi hak setiap warga yang sudah rajin memilah sampah.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssRiwayatTukar, "https://setorsampah.id/tukar-poin/riwayat", "Gambar 5.4: Tabel Riwayat Penukaran Barang dan Status Persetujuan", ["Status Jelas", "Tanggal Pesan", "Jumlah Poin"])}
      </div>
    </div>
    ${pageFooter(11)}
  </div>

  <!-- ==================== HALAMAN 12: BAB VI ROLE ADMIN - DASHBOARD ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Tampilan Petugas: Dashboard Statistik Bank Sampah", "PANDUAN ADMIN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">6.1 Pusat Kendali & Pembukuan Petugas</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Petugas bank sampah memiliki layar khusus untuk memantau neraca sampah dan peredaran poin warga secara real-time:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Total Timbulan Sampah (KG)</div>
              <div class="step-desc">Jumlah total berat sampah yang sudah berhasil dikumpulkan dari warga di seluruh RT.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Total Poin Beredar di Warga</div>
              <div class="step-desc">Jumlah tabungan poin yang dipegang warga dan sewaktu-waktu bisa ditukar beras/sembako.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Jumlah Warga Aktif Menyetor</div>
              <div class="step-desc">Total kepala keluarga atau warga yang terdaftar dan rutin menyetorkan sampah.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">4</div>
            <div class="step-text">
              <div class="step-title">Stok Sampah di Gudang Penyimpanan</div>
              <div class="step-desc">Rincian berapa kilogram kardus/plastik (Anorganik) dan pupuk (Organik) yang siap dijual ke pengepul.</div>
            </div>
          </div>
        </div>

        <div class="bottom-banner dark">
          <div class="banner-title">Transparansi Laporan RT/RW:</div>
          <div class="banner-text">Data ini bisa langsung dicatat atau dipresentasikan saat rapat pengurus RT/RW sebagai bukti keberhasilan program kebersihan.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssDashAdmin, "https://setorsampah.id/admin/dashboard", "Gambar 6.1: Layar Dashboard Petugas Pengelola Bank Sampah", ["Ringkasan Metrik", "Grafik Setoran", "Stok Gudang"])}
      </div>
    </div>
    ${pageFooter(12)}
  </div>

  <!-- ==================== HALAMAN 13: BAB VI ROLE ADMIN - APPROVAL SETORAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Cara Petugas Menimbang & Menyetujui Setoran Sampah", "PANDUAN ADMIN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">6.2 Langkah Verifikasi Setoran di Balai RT</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Semua sampah yang dibawa warga harus ditimbang dan diverifikasi oleh petugas sebelum poin diberikan:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Timbang Fisik Sampah di Timbangan Digital</div>
              <div class="step-desc">Periksa apakah jenis sampah sesuai (misal: botol plastik bersih) dan timbang berat aslinya.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Cek Data Pengajuan di Tabel Layar</div>
              <div class="step-desc">Cari nama warga yang bersangkutan pada tabel 'Verifikasi Setoran Masuk'.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Klik Tombol 'Setujui'</div>
              <div class="step-desc">Begitu diklik, sistem langsung menambahkan poin ke HP warga detik itu juga dan mencatatnya ke buku kas digital.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Jika Sampah Basah/Kotor: Klik 'Tolak'</div>
              <div class="step-desc">Masukkan alasan penolakan (misal: 'Kardus basah terkena minyak') agar warga tahu dan bisa memilah lebih baik lagi.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Otomasi: 5 KG Anorganik x 15 Tarif = <strong>+75 Poin Otomatis</strong></span>
          <span class="badge badge-green">Poin Masuk</span>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Otomatisasi Hitungan:</div>
          <div class="banner-text">Petugas tidak perlu menghitung manual pakai kalkulator. Sistem otomatis mengalikan berat dengan tarif poin resmi.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminSetoran, "https://setorsampah.id/admin/kelola-sampah", "Gambar 6.2: Layar Persetujuan Setoran Sampah yang Masuk dari Warga", ["Tabel Antrean", "Tombol Setujui", "Tombol Tolak"])}
      </div>
    </div>
    ${pageFooter(13)}
  </div>

  <!-- ==================== HALAMAN 14: BAB VI ROLE ADMIN - KELOLA BARANG ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Tambah, Edit Barang & Upload Foto Produk Tanpa Link", "PANDUAN ADMIN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">6.3 Mengatur Barang Sembako & Foto Produk</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Petugas admin bisa menambah barang sembako baru, mengubah harga poin, dan mengganti foto langsung dari komputer:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Ketik Nama, Poin & Jumlah Stok</div>
              <div class="step-desc">Contoh: Nama 'Beras Ramos 5 KG', Harga '100 Poin', Stok Tersedia '15 Karung'.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Upload Foto Langsung dari File Gambar</div>
              <div class="step-desc"><strong>Tidak perlu link URL!</strong> Cukup klik 'Pilih File Gambar' lalu pilih foto beras/minyak dari laptop. Foto langsung muncul di pratinjau.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">3</div>
            <div class="step-text">
              <div class="step-title">Fitur Edit Barang Eksisting</div>
              <div class="step-desc">Jika stok beras bertambah atau harga poin berubah, cukup klik tombol 'Edit' di baris barang tersebut, perbarui datanya, lalu klik 'Simpan Perubahan'.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Ganti atau Hapus Foto Produk</div>
              <div class="step-desc">Klik tombol merah 'Hapus Foto' jika ingin mengganti foto dengan gambar sembako yang lebih jernih.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Format Didukung: JPG, PNG, WEBP | Maksimal 2 Megabyte</span>
          <span class="badge badge-yellow">Bebas Link URL</span>
        </div>

        <div class="bottom-banner gold">
          <div class="banner-title">Langsung Tampil di HP Warga:</div>
          <div class="banner-text">Begitu admin menekan tombol simpan, foto barang dan jumlah stok yang diperbarui akan langsung muncul di katalog belanja warga.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminEditBarang, "https://setorsampah.id/admin/barang", "Gambar 6.3: Formulir Pengaturan Barang Sembako & Upload File Gambar", ["Upload dari File", "Pratinjau Foto", "Edit Stok & Poin"])}
      </div>
    </div>
    ${pageFooter(14)}
  </div>

  <!-- ==================== HALAMAN 15: BAB VI ROLE ADMIN - APPROVAL PENUKARAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Cara Petugas Menyetujui Penukaran Sembako Warga", "PANDUAN ADMIN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">6.4 Proses Serah Terima Barang & Potong Poin</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Layar ini berisi daftar warga yang ingin menukarkan poinnya dengan sembako. Pastikan barang fisiknya sudah ada sebelum menyetujui:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num gold">1</div>
            <div class="step-text">
              <div class="step-title">Cek Permintaan Warga</div>
              <div class="step-desc">Lihat nama pemohon, barang yang diminta (misal: Minyak Goreng 2L), dan jumlah poin yang akan dipotong.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num gold">2</div>
            <div class="step-text">
              <div class="step-title">Ambilkan Barang dari Gudang Balai RT</div>
              <div class="step-desc">Ambilkan paket sembako pesanan warga dan serahkan ke tangan warga di loket balai RT.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num gold">3</div>
            <div class="step-text">
              <div class="step-title">Klik Tombol 'Setujui'</div>
              <div class="step-desc">Begitu tombol diklik, sistem akan memotong poin di HP warga dan mengurangi stok barang di gudang secara bersamaan.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">4</div>
            <div class="step-text">
              <div class="step-title">Opsi Tolak Jika Stok Kosong</div>
              <div class="step-desc">Jika barang sedang habis di gudang, klik Tolak. Saldo poin warga dijamin tetap utuh tanpa berkurang sedikitpun.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Keamanan: Poin dan Stok Terpotong Bersamaan (Atomic Transaction)</span>
          <span class="badge badge-green">Poin Aman</span>
        </div>

        <div class="bottom-banner dark">
          <div class="banner-title">Perlindungan Saldo Warga:</div>
          <div class="banner-text">Sistem ini menjamin saldo poin warga tidak pernah hangus sia-sia jika barang sembako belum diserahkan ke tangan mereka.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminPenukaran, "https://setorsampah.id/admin/penukaran", "Gambar 6.4: Layar Persetujuan Penukaran Poin & Serah Terima Sembako", ["Daftar Pemohon", "Verifikasi Fisik", "Potong Bersamaan"])}
      </div>
    </div>
    ${pageFooter(15)}
  </div>

  <!-- ==================== HALAMAN 16: BAB VI ROLE ADMIN - MASTER DATA ==================== -->
  <div class="page">
    ${pageHeader("BAB VI", "Pengaturan Master Data: Tarif Poin, Wilayah RT/RW & Warga", "PANDUAN ADMIN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">6.5 Mengatur Data Dasar Operasional RT/RW</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Aplikasi ini fleksibel dan bisa disesuaikan dengan aturan di lingkungan RT/RW masing-masing:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">A</div>
            <div class="step-text">
              <div class="step-title">Master Tarif Poin Sampah</div>
              <div class="step-desc">Tentukan berapa poin per kilogram untuk Organik, Anorganik, B3, atau Residu sesuai harga jual ke pengepul.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">B</div>
            <div class="step-text">
              <div class="step-title">Master Wilayah Cakupan (RT/RW)</div>
              <div class="step-desc">Tambah daftar RT binaan atau titik jemput sampah (misal: RT 012/RW 005, Balai RW, Pos Ronda).</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">C</div>
            <div class="step-text">
              <div class="step-title">Master Label / Tag Sampah</div>
              <div class="step-desc">Beri tanda khusus untuk sampah prioritas, misalnya 'Volume Besar' atau 'Kerjasama Kerja Bakti'.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">D</div>
            <div class="step-text">
              <div class="step-title">Data Seluruh Warga Terdaftar</div>
              <div class="step-desc">Daftar buku induk seluruh warga yang ikut program, nomor kontak telepon, dan total poin tabungan mereka.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Fleksibel: Tambah Kategori Baru | Tambah Titik Jemput RT/RW</span>
          <span class="badge badge-green">Master Data</span>
        </div>

        <div class="bottom-banner green">
          <div class="banner-title">Kemudahan Tambah Data:</div>
          <div class="banner-text">Admin bisa menambah jenis sampah baru atau wilayah baru kapan saja tanpa perlu merombak program aplikasi.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssAdminJenis, "https://setorsampah.id/admin/master-data", "Gambar 6.5: Pengaturan Tarif Nilai Poin Sampah per Kilogram", ["Atur Tarif Poin", "Tambah Kategori", "Hapus Kategori"])}
      </div>
    </div>
    ${pageFooter(16)}
  </div>

  <!-- ==================== HALAMAN 17: BAB VII PROFIL & KEAMANAN ==================== -->
  <div class="page">
    ${pageHeader("BAB VII", "Pengaturan Akun Pengguna, Ganti Password & Logout", "PENGATURAN AKUN")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">7.1 Mengatur Data Akun Pribadi Anda</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Setiap warga maupun admin bisa melihat rincian akun dan menjaga keamanannya lewat menu Profil Pengguna:
          </p>
        </div>

        <div class="step-list">
          <div class="step-card">
            <div class="step-num">1</div>
            <div class="step-text">
              <div class="step-title">Cek Data Diri & Wilayah RT</div>
              <div class="step-desc">Lihat nama terdaftar, nomor telepon, alamat surel, dan posisi saldo poin yang siap dibelanjakan sembako.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num">2</div>
            <div class="step-text">
              <div class="step-title">Cara Ganti Password Baru</div>
              <div class="step-desc">Jika Anda merasa password lama diketahui orang lain, ketik password baru di formulir ganti kata sandi lalu klik simpan.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num dark">3</div>
            <div class="step-text">
              <div class="step-title">Selalu Keluar (Logout) Setelah Pakai</div>
              <div class="step-desc">Jika Anda memakai HP pinjaman atau laptop balai RT bersama, selalu klik tombol merah 'Keluar' agar saldo poin Anda aman.</div>
            </div>
          </div>
          <div class="step-card">
            <div class="step-num gold">4</div>
            <div class="step-text">
              <div class="step-title">ID Warga Khusus Bank Sampah</div>
              <div class="step-desc">Setiap akun memiliki nomor ID warga unik yang membedakan identitas Anda dari warga lain di lingkungan RT/RW.</div>
            </div>
          </div>
        </div>

        <div class="detail-box">
          <span>Keamanan: Enkripsi Kata Sandi Bcrypt | Sesi Login Terproteksi</span>
          <span class="badge badge-green">Tersandi</span>
        </div>

        <div class="bottom-banner gold">
          <div class="banner-title">Jaga Kerahasiaan Akun:</div>
          <div class="banner-text">Poin Anda bernilai sembako nyata. Jangan pernah memberitahukan password akun kepada orang lain di luar anggota keluarga Anda.</div>
        </div>
      </div>

      <div class="col-right">
        ${browserMockup(ssProfil, "https://setorsampah.id/profil", "Gambar 7.1: Layar Informasi Profil Akun & Formulir Ganti Kata Sandi", ["Informasi Lengkap", "Form Ganti Password", "Tombol Keluar Aman"])}
      </div>
    </div>
    ${pageFooter(17)}
  </div>

  <!-- ==================== HALAMAN 18: BAB VIII FAQ & SOLUSI ERROR ==================== -->
  <div class="page">
    ${pageHeader("BAB VIII", "Pertanyaan yang Sering Diajukan & Solusi Masalah", "BANTUAN TEKNIS")}
    <div class="page-body full-width">
      <div style="margin-bottom: 6px;">
        <h3 style="font-size: 18px; font-weight: 800; color: #111827;">Pertanyaan yang Kerap Muncul & Solusinya</h3>
        <p style="font-size: 12px; color: #4B5563;">Berikut jawaban jelas dan solusi cepat jika Anda mengalami kendala saat memakai aplikasi:</p>
      </div>

      <div class="grid-2" style="gap: 14px; flex: 1; margin-bottom: 10px;">
        <!-- KOLOM FAQ -->
        <div class="card-box" style="border-top: 5px solid #2D6A4F; background: #FAFCFA;">
          <div style="font-size: 14px; font-weight: 800; color: #1B4332; margin-bottom: 10px;">
            Pertanyaan Umum (FAQ)
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 11.5px; line-height: 1.45;">
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">T: Saya sudah kirim formulir setor sampah di HP, tapi kok poinnya belum nambah?</strong><br>
              <span style="color: #4B5563;">J: Karena sampah Anda belum ditimbang secara fisik oleh petugas di balai RT. Begitu petugas menimbang dan klik 'Setujui', poin Anda otomatis bertambah detik itu juga.</span>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">T: Saya sudah klik tukar beras, kenapa saldo poin saya belum berkurang?</strong><br>
              <span style="color: #4B5563;">J: Ini memang sistem pengaman kami. Poin baru berkurang kalau berasnya sudah diambil dan disetujui petugas. Jadi kalau stok beras di balai kosong, poin Anda tidak akan hilang.</span>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">T: Apakah sampah basah seperti sisa sayuran boleh disetor?</strong><br>
              <span style="color: #4B5563;">J: Boleh, pilih kategori Organik. Namun pastikan airnya sudah ditiriskan agar wadahnya tidak bocor saat dibawa ke balai RT.</span>
            </div>
          </div>
        </div>

        <!-- KOLOM TROUBLESHOOTING -->
        <div class="card-box" style="border-top: 5px solid #E5A93C; background: #FAFCFA;">
          <div style="font-size: 14px; font-weight: 800; color: #92400E; margin-bottom: 10px;">
            Solusi Masalah Teknis (Troubleshooting)
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 11.5px; line-height: 1.45;">
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">1. Tombol 'Daftar' Menolak Nomor HP</strong><br>
              <span style="color: #4B5563;">Pastikan nomor HP yang Anda ketik minimal 10 angka dan hanya berisi angka saja (jangan pakai spasi atau tanda setrip). Contoh: 081234567890.</span>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">2. Gagal Upload Foto Barang Sembako</strong><br>
              <span style="color: #4B5563;">Pastikan foto berformat gambar biasa (JPG atau PNG) dan ukurannya tidak terlalu besar (maksimal 2 MB). Jangan gunakan file dokumen PDF.</span>
            </div>
            <div style="background: #FFFFFF; padding: 10px; border-radius: 6px; border: 1px solid #E5E7EB;">
              <strong style="color: #111827;">3. Layar Menampilkan Data Lama (Macet)</strong><br>
              <span style="color: #4B5563;">Tarik layar HP dari atas ke bawah untuk refresh, atau tekan tombol F5 pada keyboard komputer agar peramban memuat data terbaru.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-banner dark" style="padding: 10px 16px;">
        <div class="banner-title">Butuh Bantuan Lebih Lanjut?</div>
        <div class="banner-text">Silakan hubungi pengurus bank sampah RT/RW setempat pada jam kerja, atau kirimkan pesan ke kontak pengembang yang tertera di halaman belakang.</div>
      </div>
    </div>
    ${pageFooter(18)}
  </div>

  <!-- ==================== HALAMAN 19: PENUTUP & PROFIL PENGEMBANG ==================== -->
  <div class="page">
    ${pageHeader("PENUTUP", "Kata Penutup & Lembar Identitas Pembuat Aplikasi", "LEGALITAS & PENUTUP")}
    <div class="page-body">
      <div class="col-left">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #111827;">9.1 Kata Penutup Pembuat</h3>
          <p style="font-size: 11.5px; color: #374151; margin-top: 3px;">
            Aplikasi <strong>Setor Sampah Mandiri</strong> ini saya rancang dan bangun sendiri sebagai proyek tugas kejuruan mandiri.
            Tujuannya sederhana: membuktikan bahwa teknologi web bisa diterapkan secara nyata untuk membantu warga RT/RW peduli lingkungan sekaligus mendapatkan manfaat sembako.
          </p>
        </div>

        <table class="data-table">
          <tbody>
            <tr>
              <td style="width: 36%; font-weight: 800;">Nama Pembuat</td>
              <td><strong style="color: #1B4332; font-size: 13px;">Anjas Ardiansah</strong></td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Status Proyek</td>
              <td>Tugas Portofolio Mandiri (Individu)</td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Program Keahlian</td>
              <td>Pengembangan Perangkat Lunak dan Gim (PPLG)</td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Tingkat Sekolah</td>
              <td>Kelas XII SMK</td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Teknologi Dibangun</td>
              <td>Next.js 14, React, Tailwind CSS, TypeScript, SQLite Prisma</td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Repositori GitHub</td>
              <td style="word-break: break-all; font-family: monospace; font-size: 9.5px;">github.com/MaL1kq/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah</td>
            </tr>
            <tr>
              <td style="font-weight: 800;">Akses Online (Live)</td>
              <td style="word-break: break-all; font-family: monospace; font-size: 9.5px;">mal1kq.github.io/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah/</td>
            </tr>
          </tbody>
        </table>

        <div class="bottom-banner green" style="margin-top: 6px;">
          <div class="banner-title">Pernyataan Orisinalitas:</div>
          <div class="banner-text">Seluruh kode program, desain antarmuka, dan penyusunan buku panduan ini dikerjakan secara orisinal oleh Anjas Ardiansah tanpa melibatkan pihak luar.</div>
        </div>
      </div>

      <div class="col-right">
        <div class="card-box" style="width: 100%; height: 100%; text-align: center; padding: 24px 20px; background: #FAFCFA; border: 2.5px solid #2D6A4F; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 70px; height: 70px; background: #FFFFFF; border-radius: 16px; border: 2px solid #CFE6D5; padding: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
              <img src="${logoBase64}" style="width: 100%; height: 100%; object-fit: contain;" alt="Logo Setor Sampah" />
            </div>
            <h4 style="font-size: 18px; font-weight: 800; color: #1B4332; margin-bottom: 4px;">SISTEM SETOR SAMPAH MANDIRI</h4>
            <div style="font-size: 12px; color: #4B5563; font-weight: 600;">Platform Digital Bank Sampah Berbasis Insentif Poin Sembako</div>
          </div>

          <div style="background: #EAF3EC; border: 1.5px solid #CFE6D5; border-radius: 10px; padding: 14px; margin: 16px 0;">
            <div style="font-size: 13px; font-weight: 800; color: #1B4332; text-transform: uppercase; letter-spacing: 0.5px;">
              DOKUMEN PANDUAN PENGGUNA RESMI TERVERIFIKASI
            </div>
            <div style="font-size: 11px; color: #2D6A4F; margin-top: 4px; font-weight: 600;">
              Edisi Rilis Resmi Tahun 2026 // Versi 1.0 (Produksi)
            </div>
          </div>

          <div>
            <p style="font-size: 10.5px; color: #6B7280; line-height: 1.5; margin: 0;">
              Hak Cipta 2026 Anjas Ardiansah. Seluruh hak cipta dilindungi undang-undang.<br>
              Diterbitkan untuk memajukan sistem pengelolaan sampah mandiri dan ekonomi sirkular lingkungan.
            </p>
          </div>
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

  const outputHtmlPath = path.resolve(__dirname, '..', 'User_Manual_Sistem_Setor_Sampah_Anjas_Ardiansah.html');
  fs.writeFileSync(outputHtmlPath, html, 'utf8');
  console.log('HTML User Manual V3 saved to:', outputHtmlPath);

  const page = await browser.newPage();
  console.log('Loading HTML V3 content into Puppeteer...');
  await page.goto('file:///' + outputHtmlPath.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));

  const outputPdfPath = path.resolve(__dirname, '..', 'User_Manual_Sistem_Setor_Sampah_Anjas_Ardiansah.pdf');
  console.log('Rendering PDF V3 to:', outputPdfPath);

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  console.log('PDF User Manual V3 successfully generated!');
  await browser.close();
}

buildPdf().catch(err => {
  console.error('Error generating PDF V3:', err);
  process.exit(1);
});
