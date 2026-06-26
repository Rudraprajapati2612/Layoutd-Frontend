import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";
const OUT = "/tmp/shots";
if (!existsSync(OUT)) mkdirSync(OUT);
const browser = await chromium.launch();

async function shot(width, label) {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= h; y += 300) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/final-${label}.png`, fullPage: true });
  await page.close();
  console.log(`✓ final-${label}.png`);
}

await shot(1280, "1280");
await shot(768,  "768");
await shot(390,  "390");
await shot(360,  "360");

await browser.close();
