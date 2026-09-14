const puppeteer = require('puppeteer-core');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  const userEmail = "warga@test.com";
  const userPassword = "warga12345";
  const hashedUserPass = await bcrypt.hash(userPassword, 10);
  
  await prisma.user.upsert({
    where: { email: userEmail },
    update: { password: hashedUserPass },
    create: {
      nama: "Warga Test",
      email: userEmail,
      noHp: "081234567891",
      password: hashedUserPass,
      role: "USER"
    }
  });

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const outDir = path.join(__dirname, '..', 'screenshots');

  console.log("1. Capturing Login Page...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, '01_login.png') });

  console.log("2. Capturing Register Page...");
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, '02_register.png') });

  console.log("3. Logging in as User...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', userEmail);
  await page.type('input[type="password"]', userPassword);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  console.log("4. Capturing User Dashboard...");
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '03_dashboard_user.png') });

  console.log("5. Capturing User Setor Form...");
  await page.goto('http://localhost:3000/setor', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '04_form_setor.png') });

  console.log("6. Capturing User Profil...");
  await page.goto('http://localhost:3000/profil', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_profil_user.png') });

  // Clear cookies to log out
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');

  console.log("7. Logging in as Admin...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'admin@tpu.com');
  await page.type('input[type="password"]', 'admin12345');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  console.log("8. Capturing Admin Dashboard...");
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '06_dashboard_admin.png') });

  console.log("9. Capturing Admin Kelola Setoran...");
  await page.goto('http://localhost:3000/admin/setoran', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '07_kelola_setoran.png') });

  console.log("10. Capturing Admin Kelola Tags...");
  await page.goto('http://localhost:3000/admin/tags', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '08_kelola_tags.png') });

  console.log("11. Capturing Admin Daftar Warga...");
  await page.goto('http://localhost:3000/admin/warga', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '09_daftar_warga.png') });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
