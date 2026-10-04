<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

type Client = 'desktop' | 'android' | 'shadowrocket'
type Issue = { id: string; label: string; steps: string[] }
const sources = {
  desktop: { label: 'Clash Verge · Windows / macOS / Linux', href: '/article/0gematwc/', date: '原文未声明更新日期（发布于 2024-10-23）' },
  android: { label: 'Clash Meta · Android', href: '/article/eh8f4n86/', date: '原文更新：2026-10-01' },
  shadowrocket: { label: 'Shadowrocket · iPhone / iPad', href: '/article/z747kgjd/', date: '原文更新：2026-10-01' },
}
const issues: Record<Client, Issue[]> = {
  desktop: [
    { id: 'subscription', label: '订阅导入失败 / 没有节点', steps: ['在自己的服务商后台确认订阅未过期，重新复制当前订阅地址。不要将订阅地址发给本站。', '在客户端「订阅」中导入，确认列表出现该订阅。若仍无效，向服务商确认订阅格式与有效期。'] },
    { id: 'tun', label: 'TUN 无法启动', steps: ['先关闭其他正在运行的 VPN 或代理软件，避免相互影响。', '按原文检查「服务模式」是否安装并启动，再检查 TUN 开关。Windows 可按原文以管理员权限运行；不同系统的权限设置请查原文，不要运行来源不明的提权命令。'] },
    { id: 'rules', label: '规则模式没有生效', steps: ['在「代理」页确认模式是「规则」，并刷新订阅。', '核对系统代理与 TUN 开关是否符合原文的配置步骤，然后在浏览器实际访问目标网站。无法解决时保留自己的原始配置，联系客户端或服务商支持。'] },
  ],
  android: [
    { id: 'install', label: '安装包不兼容', steps: ['确认下载的是 .apk 安装包，而非源码压缩包。', '回到教程链接的官方发布页核对架构；不确定时选择 universal。若要更换不同签名的版本，先导出已有配置，避免卸载造成丢失。'] },
    { id: 'subscription', label: '导入后没有节点', steps: ['客户端本身不提供节点。先在自己的服务商后台确认有兼容的订阅 URL。', '在客户端内检查地址是否复制完整、订阅是否过期，再重新导入。不要把订阅凭证贴到公开评论中。'] },
    { id: 'connection', label: 'VPN 已开启但网页打不开', steps: ['在客户端切换另一个节点，再访问目标网站测试。', '分别在 Wi-Fi 和移动网络下测试。单个节点能连通不代表所有网站可用；若仍失败，向服务商说明网络类型与现象，不提供订阅凭据。'] },
  ],
  shadowrocket: [
    { id: 'subscription', label: '更新订阅失败 / 没有节点', steps: ['从自己已确认的服务商官网后台重新复制当前订阅，检查空格、截断与有效期。', '在「+」中将 Type 设为 Subscribe，使用服务商提供的 Shadowrocket 兼容订阅，然后保存并更新节点。'] },
    { id: 'timeout', label: '一直超时 / 无法联网', steps: ['关闭后重新打开 VPN；首次连接时按系统提示允许添加 VPN 配置。', '换两个不同地区节点测试，再比较 Wi-Fi 与蜂窝网络。', '更新订阅后再测。若机场公告提示订阅域名失效，从已确认的官网后台获取新地址，不要反复刷新旧地址。'] },
    { id: 'partial', label: '部分网站打不开', steps: ['记住当前路由模式，短暂从「配置（Config）」切到「代理（Proxy）」测试同一个网站。', '若代理模式可用，按原文检查规则、DNS 或配置文件；不要随意安装陌生证书。测试后恢复原来的路由模式。节点连通性测试不等于目标服务可用，请在服务本身验证。'] },
  ],
}
const client = ref<Client>('desktop')
const issueId = ref('')
const stage = ref<'choose' | 'steps' | 'done' | 'cancelled'>('choose')
const step = ref(0)
const heading = ref<HTMLElement | null>(null)
const choice = computed(() => issues[client.value].find(item => item.id === issueId.value))
const source = computed(() => sources[client.value])
let lastAction = -Infinity
function transition(action: () => void) {
  // A double click must not skip a diagnostic step or immediately restart it.
  const now = Date.now()
  if (now - lastAction < 350) return
  lastAction = now
  action()
  nextTick(() => heading.value?.focus())
}
function reset() {
  transition(() => { stage.value = 'choose'; step.value = 0; issueId.value = '' })
}
function start() {
  if (!choice.value) return
  transition(() => { step.value = 0; stage.value = 'steps' })
}
function next() {
  if (stage.value !== 'steps' || !choice.value) return
  transition(() => {
    if (step.value < choice.value!.steps.length - 1) step.value++
    else stage.value = 'done'
  })
}
function back() {
  transition(() => {
    if (stage.value === 'done') stage.value = 'steps'
    else if (step.value > 0) step.value--
    else stage.value = 'choose'
  })
}
</script>

<template>
  <section class="connection-help" data-tool-surface="troubleshooter" aria-label="连接问题排查工具">
    <p class="help-kicker">按现象逐步排查 · 整理日期 2026-10-03</p>
    <h2 ref="heading" tabindex="-1">{{ stage === 'choose' ? '先选客户端与遇到的问题' : stage === 'steps' ? choice?.label : stage === 'done' ? '本组步骤已检查完' : '已取消排查' }}</h2>
    <p class="help-privacy">无需输入订阅链接、账号或令牌。选项仅保留在当前页面，不会自动检测或修改你的设备。</p>
    <form v-if="stage === 'choose'" @submit.prevent="start">
      <label for="help-client">正在使用的客户端</label>
      <select id="help-client" v-model="client" @change="issueId = ''">
        <option v-for="(item, key) in sources" :key="key" :value="key">{{ item.label }}</option>
      </select>
      <label for="help-issue">遇到的现象</label>
      <select id="help-issue" v-model="issueId">
        <option value="" disabled>请选择一个现象</option>
        <option v-for="item in issues[client]" :key="item.id" :value="item.id">{{ item.label }}</option>
      </select>
      <p v-if="!issueId" class="help-hint">选择现象后即可开始。没有对应问题时，请阅读下方原文；本站不猜测故障原因。</p>
      <button type="submit" data-tool-event="start" :disabled="!choice">开始排查</button>
    </form>
    <div v-else-if="stage === 'steps' && choice" class="help-step" aria-live="polite" aria-atomic="true">
      <p class="help-kicker">步骤 {{ step + 1 }} / {{ choice.steps.length }}</p>
      <p>{{ choice.steps[step] }}</p>
      <div class="help-actions">
        <button type="button" data-tool-event="step_back" @click="back">{{ step ? '上一步' : '返回选择' }}</button>
        <button type="button" data-tool-event="step_next" @click="next">{{ step < choice.steps.length - 1 ? '检查后继续' : '完成检查' }}</button>
        <button type="button" data-tool-event="cancel" @click="transition(() => { stage = 'cancelled'; step = 0; issueId = '' })">取消排查</button>
      </div>
    </div>
    <div v-else>
      <p v-if="stage === 'done'">完成步骤不代表已修复。请在自己的设备验证目标网站；仍失败时查看原文或联系服务商，描述客户端版本、网络类型和错误现象，不发送订阅地址、令牌或账户截图。</p>
      <p v-else>本次选项已清空。工具没有修改你的设备；若你在客户端临时切换过代理模式，请恢复原设置。</p>
      <div class="help-actions">
        <button v-if="stage === 'done'" type="button" data-tool-event="step_back" @click="back">返回最后一步</button>
        <button type="button" data-tool-event="reset" @click="reset">重新开始</button>
      </div>
    </div>
    <p class="help-source">依据：<a :href="source.href" data-tool-event="tutorial_click">{{ source.label }} 原文教程</a><br>{{ source.date }}。以上为站内教程摘要，不是本次设备实测；界面可能随版本变化。</p>
  </section>
</template>

<style scoped>
.connection-help { border: 1px solid var(--vp-c-divider, #d9dde3); border-radius: 16px; padding: clamp(16px, 4vw, 28px); margin: 24px 0; background: var(--vp-c-bg-soft, #f5f7fa); }
.connection-help h2 { margin-top: 8px; padding-top: 0; border-top: 0; }
.help-kicker, .help-hint, .help-source, .help-privacy { font-size: 14px; }
.help-kicker { font-weight: 650; }
.help-source { border-top: 1px solid var(--vp-c-divider, #d9dde3); padding-top: 16px; margin-bottom: 0; }
.connection-help label { display: block; margin: 16px 0 6px; font-weight: 650; }
.connection-help select { width: 100%; min-height: 48px; border: 1px solid var(--vp-c-divider, #a2a9b4); border-radius: 8px; padding: 10px; background: var(--vp-c-bg, white); color: var(--vp-c-text-1, #202632); font: inherit; }
.connection-help button { min-height: 44px; padding: 10px 16px; border: 1px solid var(--vp-c-brand-1, #345dba); border-radius: 8px; color: var(--vp-c-text-1, #202632); background: var(--vp-c-bg, white); cursor: pointer; font: inherit; }
.connection-help form > button { margin-top: 16px; }
.connection-help button:disabled { opacity: .5; cursor: not-allowed; }
.connection-help :is(button, select, a):focus-visible { outline: 3px solid var(--vp-c-brand-1, #345dba); outline-offset: 3px; }
.help-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
.help-step > p { line-height: 1.8; }
@media (max-width: 480px) { .help-actions > button { flex: 1 1 100%; } }
</style>
