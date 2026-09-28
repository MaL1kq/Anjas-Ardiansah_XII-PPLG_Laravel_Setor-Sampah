const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureAuth() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  const outputDir = path.join(__dirname, 'manual_screenshots');

  // Login
  await page.goto('http://localhost:3005/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outputDir, 'ss_login_full.png') });
  console.log('Captured ss_login_full.png');

  // Register
  await page.goto('http://localhost:3005/register', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outputDir, 'ss_register_full.png') });
  console.log('Captured ss_register_full.png');

  await browser.close();
}

captureAuth().catch(console.error);
