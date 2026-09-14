const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function renderMermaid(title, mermaidCode, outputPath) {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1400, height: 1000, deviceScaleFactor: 2 },
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
      theme: 'default',
      er: { useMaxWidth: false }
    });
  </script>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.mermaid svg', { timeout: 15000 });
  
  const element = await page.$('#diagram');
  await element.screenshot({ path: outputPath });

  await browser.close();
  console.log(`Rendered: ${outputPath}`);
}

async function main() {
  const outDir = path.join(__dirname, '..', 'screenshots');

  const erdSekarang = `
erDiagram
    users ||--o{ laporan_sampah : "menyetor (userId)"
    users ||--o| poin : "memiliki"
    jenis_sampah ||--o{ laporan_sampah : "mengkategorikan"
    jenis_sampah ||--o| stok : "dihitung di"
    wilayah ||--o{ laporan_sampah : "asal wilayah"
    laporan_sampah ||--o| foto_sampah : "dilampiri"
    laporan_sampah }o--o{ tags : "ditandai"

    users {
        uuid id PK
        text nama
        text email UK
        text noHp UK
        text password
        enum role
        timestamp createdAt
    }

    jenis_sampah {
        uuid id PK
        text namaJenis UK
    }

    wilayah {
        uuid id PK
        text namaWilayah UK
    }

    laporan_sampah {
        uuid id PK
        uuid userId FK
        uuid jenisSampahId FK
        uuid wilayahId FK
        text asalSetoranLainnya
        float jumlah
        enum satuan
        enum status
        text alasanPenolakan
        uuid approvedById FK
        timestamp approvedAt
        timestamp createdAt
        timestamp updatedAt
    }

    foto_sampah {
        uuid id PK
        uuid laporanId FK
        text url
        timestamp createdAt
    }

    tags {
        uuid id PK
        text nama UK
        text warna
        timestamp createdAt
    }

    poin {
        uuid id PK
        uuid userId FK
        int totalPoin
        timestamp updatedAt
    }

    stok {
        uuid id PK
        uuid jenisSampahId FK
        float totalJumlah
        timestamp updatedAt
    }
`;

  const erdRencana = `
erDiagram
    users ||--o| poin : "memiliki saldo"
    users ||--o{ laporan_sampah : "menyetor"
    users ||--o{ penukaran : "menukarkan poin"
    hadiah ||--o{ penukaran : "ditukar menjadi"
    jenis_sampah ||--o{ laporan_sampah : "kategori"
    jenis_sampah ||--o| stok : "stok daur ulang"
    wilayah ||--o{ laporan_sampah : "asal wilayah"
    laporan_sampah ||--o| foto_sampah : "lampiran bukti"
    laporan_sampah }o--o{ tags : "label tag"

    users {
        uuid id PK
        text nama
        text email UK
        text noHp UK
        text password
        enum role
    }

    poin {
        uuid id PK
        uuid userId FK
        int totalPoin
        timestamp updatedAt
    }

    laporan_sampah {
        uuid id PK
        uuid userId FK
        uuid jenisSampahId FK
        uuid wilayahId FK
        float jumlah
        enum satuan
        enum status
        timestamp approvedAt
    }

    hadiah {
        uuid id PK
        text namaHadiah UK
        text deskripsi
        int poinDibutuhkan
        int stokHadiah
        boolean aktif
        timestamp createdAt
    }

    penukaran {
        uuid id PK
        uuid userId FK
        uuid hadiahId FK
        int jumlahPoin
        enum status
        text catatanAdmin
        timestamp createdAt
    }

    jenis_sampah {
        uuid id PK
        text namaJenis UK
    }

    stok {
        uuid id PK
        uuid jenisSampahId FK
        float totalJumlah
        timestamp updatedAt
    }

    wilayah {
        uuid id PK
        text namaWilayah UK
    }

    foto_sampah {
        uuid id PK
        uuid laporanId FK
        text url
    }

    tags {
        uuid id PK
        text nama UK
        text warna
    }
`;

  console.log("Rendering ERD Sekarang...");
  await renderMermaid("Entity Relationship Diagram (ERD) - Sistem Saat Ini", erdSekarang, path.join(outDir, '10_erd_sekarang.png'));

  console.log("Rendering ERD Rencana...");
  await renderMermaid("Entity Relationship Diagram (ERD) - Rencana Fitur Transaksi Poin & Hadiah", erdRencana, path.join(outDir, '11_erd_rencana.png'));
}

main().catch(console.error);
