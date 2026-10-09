import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const telegram = read('docs/blog/文档/telegram注册使用教程.md')
const esim = read('docs/blog/文档/9esim使用指南.md')

test('Telegram separates account two-step verification from the local app lock', () => {
  assert.match(telegram, /两步验证（Two-Step Verification）.*额外的账号登录密码/)
  assert.match(telegram, /本机密码锁（Passcode Lock \/ App Passcode）.*当前设备/)
  assert.match(telegram, /不能替代账号两步验证/)
  assert.doesNotMatch(telegram, /独立的密码（App Passcode）|防止验证码被盗/)
  assert.match(telegram, /https:\/\/telegram.org\/faq#q-how-does-2-step-verification-work/)
})

test('Telegram verification channels follow current prompts rather than a mandatory email-and-SMS sequence', () => {
  assert.match(telegram, /如果应用要求提供邮箱/)
  assert.match(telegram, /登录邮箱与两步验证的恢复邮箱用途不同/)
  assert.match(telegram, /不一定同时发送到邮箱和手机号/)
  assert.match(telegram, /https:\/\/core.telegram.org\/api\/auth/)
  assert.doesNotMatch(telegram, /会向你的邮箱和手机号发送验证码|注册必须在移动端完成|（支持虚拟号码）/)
})

test('9eSIM hardware, separate carrier service and registration limits remain explicit', () => {
  for (const fact of ['实体可编程卡', '实体 SIM 卡槽', '卡片出厂不含号码、流量或预装配置', '通信服务需向其他供应商另购', '第三方验证码均不保证成功', '不能据此保证 Telegram']) assert.ok(esim.includes(fact), fact)
  assert.doesNotMatch(esim, /无需实体 SIM 卡|完美支持|有效期内可无限使用|2026年实测|号码可长期使用/)
  assert.match(esim, /https:\/\/www.9esim.com\/en\/faq/)
})

test('Worldwide plan has a term and metered charges; regional data plans do not include numbers', () => {
  assert.match(esim, /Worldwide.*购买或激活日起 365 天.*可用余额.*按流量、分钟和短信计费/)
  assert.match(esim, /Local \/ Regional.*仅提供流量，不含号码、语音或短信/)
  assert.match(esim, /一次性付款不代表永久号码或无限使用/)
  assert.match(esim, /https:\/\/esimplus.me\/terms/)
})

test('Historical costs, delivery and verification examples retain attribution without current promises', () => {
  for (const fact of ['2025 年 10 月的费用记录', '原文曾写预计 3–5 天', '预计约两周', '运费按目的地在结账计算', '本次没有重新购买或注册测试']) assert.ok(esim.includes(fact), fact)
  assert.match(esim, /https:\/\/www.9esim.com\/\?coupon=ermao/)
  assert.match(esim, /https:\/\/esimplus.onelink.me\/WxwP\/c7eggfvh/)
  assert.match(esim, /推广码 `ermao`/)
  assert.match(esim, /\]\(\/affiliate-disclosure\/\)/)
})

test('Article identity, historical screenshots and existing English factual boundaries are retained', () => {
  for (const [source, route, created, images] of [[telegram, 'telegram', '2025/10/15 01:31:07', 10], [esim, '9esim', '2025/10/14 11:14:12', 21]]) {
    assert.ok(source.includes(`permalink: /blog/${route}/`))
    assert.ok(source.includes(`createTime: ${created}`))
    assert.match(source, /updateTime: 2026\/10\/09 /)
    assert.equal((source.match(/!\[/g) || []).length, images)
  }
  assert.match(telegram, /title: 2026年最新 telegram（电报、飞机）注册使用教程/)
  assert.match(esim, /title: 9esim使用指南 - 获取国外手机号，注册Google、Telegram等账号/)
  const enTelegram = read('docs/en/blog/guides/telegram注册使用教程.md')
  const enEsim = read('docs/en/blog/guides/9esim使用指南.md')
  assert.match(enTelegram, /This is separate from the account's two-step-verification password/)
  assert.match(enEsim, /physical, SIM-shaped programmable eUICC card/)
  assert.match(enEsim, /does not prove future support/)
  assert.match(enEsim, /permanent number or lifetime service/)
})
