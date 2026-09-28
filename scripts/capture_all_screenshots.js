const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  const outputDir = path.join(__dirname, 'manual_screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const targetUrl = 'https://mal1kq.github.io/Anjas-Ardiansah_XII-PPLG_Laravel_Setor-Sampah/';
  console.log('Navigating to', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  async function take(name, waitMs = 500) {
    if (waitMs) await new Promise(r => setTimeout(r, waitMs));
    const filePath = path.join(outputDir, name);
    await page.screenshot({ path: filePath });
    console.log('Captured:', name);
  }

  // 1. Dashboard Warga (default view)
  await page.evaluate(() => {
    switchRole('USER');
    showView('user-dashboard');
  });
  await take('ss_03_dashboard_warga.png');

  // 2. Setor Sampah Form
  await page.evaluate(() => {
    showView('user-setor');
  });
  await take('ss_04_setor_sampah.png');

  // 3. Katalog Penukaran Poin
  await page.evaluate(() => {
    showView('user-tukar-poin');
  });
  await take('ss_06_tukar_poin.png');

  // 4. Riwayat Penukaran Poin (toggle open)
  await page.evaluate(() => {
    const cont = document.getElementById('userRiwayatTukarContainer');
    if (cont && cont.classList.contains('hidden')) {
      toggleUserRiwayatTukar();
    }
  });
  await take('ss_07_riwayat_penukaran.png');

  // 5. Profil Pengguna
  await page.evaluate(() => {
    showView('profil');
  });
  await take('ss_08_profil.png');

  // 6. Login View
  await page.evaluate(() => {
    showView('login');
  });
  await take('ss_02_login.png');

  // Switch to ADMIN role
  await page.evaluate(() => {
    switchRole('ADMIN');
  });

  // 7. Dashboard Admin
  await page.evaluate(() => {
    showView('admin-dashboard');
  });
  await take('ss_09_dashboard_admin.png');

  // 8. Admin Verifikasi Setoran
  await page.evaluate(() => {
    showView('admin-setoran');
  });
  await take('ss_10_admin_setoran.png');

  // 9. Admin Kelola Barang
  await page.evaluate(() => {
    showView('admin-barang');
  });
  await take('ss_11_admin_barang.png');

  // 10. Admin Form Edit Barang
  await page.evaluate(() => {
    startEditBarang('1');
    window.scrollTo(0, 0);
  });
  await take('ss_12_admin_edit_barang.png');

  // Cancel edit
  await page.evaluate(() => {
    cancelEditBarang();
  });

  // 11. Admin Persetujuan Penukaran Poin
  await page.evaluate(() => {
    showView('admin-penukaran');
  });
  await take('ss_13_admin_penukaran.png');

  // 12. Admin Master Data: Jenis Sampah
  await page.evaluate(() => {
    showView('admin-jenis-sampah');
  });
  await take('ss_14_admin_jenis_sampah.png');

  // 13. Admin Master Data: Wilayah
  await page.evaluate(() => {
    showView('admin-wilayah');
  });
  await take('ss_15_admin_wilayah.png');

  // 14. Admin Master Data: Tags Prioritas
  await page.evaluate(() => {
    showView('admin-tags');
  });
  await take('ss_16_admin_tags.png');

  // 15. Admin Master Data: Warga Terdaftar
  await page.evaluate(() => {
    showView('admin-warga');
  });
  await take('ss_17_admin_warga.png');

  console.log('All screenshots captured successfully!');
  await browser.close();
}

captureAll().catch(err => {
  console.error(err);
  process.exit(1);
});
