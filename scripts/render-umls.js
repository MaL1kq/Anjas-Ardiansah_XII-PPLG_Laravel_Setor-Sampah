const puppeteer = require('puppeteer-core');
const path = require('path');

async function renderMermaid(title, mermaidCode, outputPath) {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1400, height: 1200, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 30px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 {
      color: #1e293b;
      margin-bottom: 20px;
    }
    #diagram {
      background: #ffffff;
      padding: 25px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <div id="diagram" class="mermaid">
${mermaidCode}
  </div>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default'
    });
  </script>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.mermaid svg', { timeout: 20000 });
  
  const element = await page.$('#diagram');
  await element.screenshot({ path: outputPath });

  await browser.close();
  console.log(`Rendered: ${outputPath}`);
}

async function main() {
  const outDir = path.join(__dirname, '..', 'screenshots');

  const usecaseCode = `
flowchart LR
    U["👤 User / Warga"]

    subgraph S["🖥️ Sistem Web Setor Sampah"]
        direction TB

        subgraph existing["Fitur Operasional Utama"]
            UC1(["Register Akun"])
            UC2(["Login"])
            UC3(["Setor Sampah"])
            UC5(["Lihat Riwayat Setoran"])
            UC6(["Edit Setoran Pending"])
            UC8(["Dashboard Statistik"])
            UC9(["Verifikasi/Approve Setoran"])
            UC10(["Tolak/Reject Setoran"])
            UC11(["Kelola Tag Kategori"])
            UC15(["Ekspor Data CSV"])
        end

        subgraph poin_feature["🆕 Rencana Fitur Transaksi Poin & Hadiah"]
            UCP1(["Lihat Saldo Poin"])
            UCP2(["Katalog Hadiah"])
            UCP3(["Transaksi Tukar Poin"])
            UCP4(["Riwayat Transaksi Penukaran"])
            UCP5(["Kelola Master Data Hadiah"])
            UCP6(["Proses & Validasi Penukaran"])
            UCP7(["Kalkulasi Poin Otomatis"])
        end
    end

    A["🛡️ Admin TPU"]

    U --- UC1
    U --- UC2
    U --- UC3
    U --- UC5
    U --- UC6
    U --- UCP1
    U --- UCP2
    U --- UCP3
    U --- UCP4

    A --- UC2
    A --- UC8
    A --- UC9
    A --- UC10
    A --- UC11
    A --- UC15
    A --- UCP5
    A --- UCP6

    UC9 -.->|"≪include≫"| UCP7
`;

  const activityCode = `
flowchart TD
    Start(("🟢 Mulai")) --> Login["User Login ke Akun"]
    Login --> BukaKatalog["Buka Halaman Katalog Hadiah"]
    BukaKatalog --> PilihHadiah["Pilih Hadiah yang Diinginkan"]
    PilihHadiah --> CekSaldo{"Saldo Poin User >=<br/>Poin Hadiah?"}

    CekSaldo -->|"❌ Tidak Cukup"| GagalPoin["Tampilkan Notifikasi Poin Kurang"]
    GagalPoin --> BukaKatalog

    CekSaldo -->|"✅ Cukup"| CekStok{"Stok Hadiah<br/>Tersedia?"}
    CekStok -->|"❌ Habis"| GagalStok["Tampilkan Notifikasi Stok Habis"]
    GagalStok --> BukaKatalog

    CekStok -->|"✅ Ada"| Konfirmasi["Konfirmasi Transaksi Penukaran"]
    Konfirmasi --> SimpanTrx["Sistem Simpan Transaksi Penukaran<br/>Status: MENUNGGU"]
    SimpanTrx --> PotongPoin["Potong Saldo Poin Pengguna"]

    PotongPoin --> AdminReview["Admin Menerima Permintaan Penukaran"]
    AdminReview --> Keputusan{"Verifikasi Admin?"}

    Keputusan -->|"✅ Disetujui / Selesai"| SelesaiTrx["Status: SELESAI<br/>Kurangi Stok Fisik Hadiah"]
    SelesaiTrx --> SerahHadiah["Serahkan Hadiah / Voucher ke User"]
    SerahHadiah --> Selesai(("🔴 Selesai"))

    Keputusan -->|"❌ Dibatalkan"| BatalTrx["Status: DIBATALKAN<br/>Catat Alasan Pembatalan"]
    BatalTrx --> RefundPoin["Refund Saldo Poin ke Akun User"]
    RefundPoin --> Selesai
`;

  console.log("Rendering Use Case Diagram...");
  await renderMermaid("Use Case Diagram - Sistem Pengelolaan Sampah & Transaksi Poin", usecaseCode, path.join(outDir, '12_usecase_diagram.png'));

  console.log("Rendering Activity Diagram...");
  await renderMermaid("Activity Diagram - Alur Transaksi Penukaran Poin Hadiah", activityCode, path.join(outDir, '13_activity_transaksi.png'));
}

main().catch(console.error);
