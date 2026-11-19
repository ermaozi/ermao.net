// Record and probe the selected browser; errors fail the job, never skip checks.
const { chromium } = require('playwright');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  try {
    const fonts = execFileSync('fc-list', [':lang=zh', 'family'], { encoding: 'utf8' }).trim();
    assert(fonts, 'Chinese-capable fonts are required for meaningful visual checks');
    const page = await browser.newPage();
    await page.setContent('<p>中文页面 Browser check</p>');
    assert.equal(await page.locator('p').innerText(), '中文页面 Browser check');
    const result = { browser: browser.version(), playwright: require('playwright/package.json').version,
      executable: process.env.CHROMIUM_PATH || 'playwright-bundled',
      runnerImage: process.env.ImageVersion || null, chineseFonts: fonts.split('\n') };
    fs.mkdirSync('artifacts/airport-summary', { recursive: true });
    fs.writeFileSync('artifacts/airport-summary/browser-environment.json', JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
