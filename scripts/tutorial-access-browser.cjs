// Test only the locally built articles; block all non-local requests.
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs')
const { chromium } = require('playwright')
const contracts = JSON.parse(readFileSync('scripts/tutorial-access-fixtures.json', 'utf8'))
const base = 'http://127.0.0.1:4175'
const output = 'artifacts/airport-summary/tutorials'
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
async function main() {
  mkdirSync(output, { recursive: true })
  const server = spawn('python3', ['-m', 'http.server', '4175', '--bind', '127.0.0.1', '--directory', 'docs/.vuepress/dist'], { stdio: 'ignore' })
  let browser
  const results = []
  try {
    for (let i = 0; ; i++) {
      try { const response = await fetch(base, { method: 'HEAD' }); assert.equal(response.status, 200); break }
      catch (error) { if (i === 30) throw error; await pause(200) }
    }
    browser = await chromium.launch({ headless: true })
    const routes = [...Object.keys(contracts), '/blog/shadowrocket-rules-config/', '/en/blog/shadowrocket-rules-config/']
    for (const route of routes) for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await page.route('**/*', request => request.request().url().startsWith(base + '/') ? request.continue() : request.abort())
      await page.goto(base + route, { waitUntil: 'networkidle' })
      const article = page.locator('.vp-doc').first()
      await article.waitFor()
      const text = (await article.innerText()).replace(/\s+/g, '')
      for (const required of contracts[route]?.required || ['FINAL,PROXY']) assert.ok(text.includes(required.replace(/\s+/g, '')), route + ': ' + required)
      for (const forbidden of contracts[route]?.forbidden || []) assert.ok(!text.includes(forbidden.replace(/\s+/g, '')), route + ': ' + forbidden)
      const result = await page.evaluate(() => {
        const article = document.querySelector('.vp-doc')
        const missingAnchors = [...article.querySelectorAll('a[href^="#"]')].map(a => decodeURIComponent(a.hash.slice(1))).filter(id => id && !document.getElementById(id))
        return { overflow: document.documentElement.scrollWidth > innerWidth + 2, missingAnchors }
      })
      results.push({ route, width, ...result })
      assert.equal(result.overflow, false, route + ': viewport overflow')
      assert.deepEqual(result.missingAnchors, [], route + ': broken deep links')
      await page.screenshot({ path: `${output}/${route.replaceAll('/', '_')}-${width}.png` })
      await page.close()
    }
    console.log(`PASS ${results.length} article viewport/body/anchor checks`)
  } finally {
    writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n')
    if (browser) await browser.close()
    server.kill()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
