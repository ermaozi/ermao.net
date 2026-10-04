/* Run after a production build is served: node scripts/troubleshooter-browser.cjs
 * Optional: BASE_URL=http://127.0.0.1:4173 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=...
 */
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const output = path.resolve('artifacts/ux-20261003')
const cases = {
  desktop: { source: '/article/0gematwc/', date: '原文未声明更新日期', issues: { subscription: ['订阅未过期', '订阅'], tun: ['关闭其他', '服务模式'], rules: ['规则', '系统代理'] } },
  android: { source: '/article/eh8f4n86/', date: '2026-10-01', issues: { install: ['.apk', 'universal'], subscription: ['不提供节点', '是否过期'], connection: ['另一个节点', 'Wi-Fi'] } },
  shadowrocket: { source: '/article/z747kgjd/', date: '2026-10-01', issues: { subscription: ['官网后台', 'Subscribe'], timeout: ['VPN 配置', '不同地区', '域名失效'], partial: ['Proxy', '恢复原来的路由模式'] } },
}
;(async () => {
  fs.mkdirSync(output, { recursive: true })
  const executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined)
  const browser = await chromium.launch({ headless: true, ...(executable ? { executablePath: executable } : {}) })
  const records = []
  const errors = []
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport })
      page.on('pageerror', error => errors.push(error.message))
      const response = await page.goto(`${process.env.BASE_URL || 'http://127.0.0.1:4173'}/connection-help/`, { waitUntil: 'networkidle' })
      assert.equal(response.status(), 200)
      const tool = page.locator('.connection-help')
      await tool.waitFor()
      const button = name => tool.getByRole('button', { name, exact: true })
      const settle = () => page.waitForTimeout(400)
      const act = async name => { await settle(); await button(name).click() }
      const heading = () => tool.locator('h2').innerText()
      assert.equal(await button('开始排查').isDisabled(), true, 'Empty choice blocks start')
      await page.screenshot({ path: path.join(output, `troubleshooter-${viewport.width}-choose.png`), fullPage: true })
      for (const [client, data] of Object.entries(cases)) {
        for (const [issue, expectedSteps] of Object.entries(data.issues)) {
          await tool.locator('#help-client').selectOption(client)
          await tool.locator('#help-issue').selectOption(issue)
          assert.equal(await tool.locator('.help-source a').getAttribute('href'), data.source)
          assert.ok((await tool.locator('.help-source').innerText()).includes(data.date))
          await act('开始排查')
          assert.equal(await tool.locator('h2').evaluate(node => node === document.activeElement), true)
          for (let index = 0; index < expectedSteps.length; index++) {
            assert.ok((await tool.locator('.help-step').innerText()).includes(`步骤 ${index + 1} / ${expectedSteps.length}`))
            assert.ok((await tool.locator('.help-step').innerText()).includes(expectedSteps[index]), `${client}/${issue}/${index}: source consistency`)
            if (client === 'shadowrocket' && issue === 'timeout' && index === 0) {
              await page.screenshot({ path: path.join(output, `troubleshooter-${viewport.width}-step.png`), fullPage: true })
              await settle()
              await button('检查后继续').dblclick()
              assert.ok((await tool.locator('.help-step').innerText()).includes('步骤 2 / 3'), 'Double click advances only one step')
            } else await act(index < expectedSteps.length - 1 ? '检查后继续' : '完成检查')
          }
          assert.equal(await heading(), '本组步骤已检查完')
          assert.ok((await tool.innerText()).includes('完成步骤不代表已修复'))
          await act('返回最后一步')
          assert.ok((await tool.locator('.help-step').innerText()).includes(`步骤 ${expectedSteps.length} / ${expectedSteps.length}`))
          await act('上一步')
          assert.ok((await tool.locator('.help-step').innerText()).includes(`步骤 ${expectedSteps.length - 1} / ${expectedSteps.length}`))
          await act('取消排查')
          assert.equal(await heading(), '已取消排查')
          await act('重新开始')
          assert.equal(await tool.locator('#help-issue').inputValue(), '')
          assert.equal(await button('开始排查').isDisabled(), true)
          records.push({ viewport: viewport.width, client, issue, passed: true })
        }
      }
      // Changing clients invalidates the old issue; keyboard-only start and return work.
      await tool.locator('#help-issue').selectOption('partial')
      await tool.locator('#help-client').selectOption('android')
      assert.equal(await tool.locator('#help-issue').inputValue(), '')
      assert.equal(await button('开始排查').isDisabled(), true)
      await tool.locator('#help-issue').focus()
      await page.keyboard.press('ArrowDown')
      assert.notEqual(await tool.locator('#help-issue').inputValue(), '')
      await page.keyboard.press('Tab')
      assert.equal(await button('开始排查').evaluate(node => node === document.activeElement), true)
      await settle()
      await page.keyboard.press('Enter')
      assert.equal(await tool.locator('h2').evaluate(node => node === document.activeElement), true)
      await page.keyboard.press('Tab')
      assert.equal(await button('返回选择').evaluate(node => node === document.activeElement), true)
      await settle()
      await page.keyboard.press('Enter')
      assert.equal(await heading(), '先选客户端与遇到的问题')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'No horizontal overflow')
      assert.equal(await tool.locator('input, textarea').count(), 0, 'No credential fields')
      records.push({ viewport: viewport.width, keyboard: true, resetOnClientChange: true, noOverflow: true, noCredentialFields: true })
      await page.close()
    }
    assert.deepEqual(errors, [], 'No page JavaScript errors')
    fs.writeFileSync(path.join(output, 'troubleshooter-results.json'), JSON.stringify({ checkedAt: new Date().toISOString(), baseURL: process.env.BASE_URL || 'http://127.0.0.1:4173', records, errors }, null, 2))
    console.log(`PASS: ${records.length} checks groups; 18 issue flows across 1440px and 390px; screenshots in ${output}`)
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
