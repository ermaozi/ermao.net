---
title: 2025最新免费美区Apple ID共享账号 | Shadowrocket/小火箭下载 | iOS美区账号每日更新
createTime: 2025/12/15 09:22:04
permalink: /blog/freeappleid/
tags:
  - Apple ID
  - 免费Apple ID
  - 美区Apple ID
  - Shadowrocket
  - 小火箭
  - iOS美区账号
  - 共享账号
  - App Store
description: 2025年最新免费共享美区Apple ID账号，每日更新可用。提供美国、日本、韩国、香港、台湾等地区iOS账号，支持下载Shadowrocket（小火箭）、TikTok、ChatGPT等海外应用。
---

本文提供2025年最新免费共享的美区Apple ID账号，以及日本、韩国、香港、台湾等地区的iOS账号。这些账号主要供大家下载Shadowrocket（小火箭）、TikTok、ChatGPT等非国区App Store应用使用。账号会定期维护更新，确保可用性。

<!-- more -->

::: warning 试用须知
1. 这些Apple ID账号是免费共享的，可能会被多人使用，存在一定的安全风险，请勿用于存储个人隐私信息。
2. 使用后请及时退出账号，避免影响其他用户使用。
3. 如果遇到账号无法登录或需要验证等问题，请尝试更换其他账号。
4. 本站不对账号的使用问题负责，仅提供共享服务。
:::

<LinkCard title="🚀 Shadowrocket(小火箭)新手使用教程：下载安装、节点订阅与配置指南" href="/article/z747kgjd/" description="最新Shadowrocket（小火箭）新手使用教程。详细介绍如何在iOS/iPhone/iPad及Mac上下载安装Shadowrocket，如何获取免费美区Apple ID，以及如何配置节点订阅链接进行科学上网。" />


## 免费美区 Apple ID账号

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 10px 16px; background-color: var(--vp-c-bg-alt); border-radius: 8px;">
  <div style="color: var(--vp-c-text-2); font-size: 14px;">
    更新时间：{{ updateTime || '加载中...' }}
  </div>
  <button class="refresh-btn" @click="fetchData" :disabled="loading">
    <span v-if="loading">刷新中...</span>
    <span v-else>刷新</span>
  </button>
</div>

<div v-if="loading && accounts.length === 0" style="text-align: center; padding: 20px;">
  正在获取最新账号信息...
</div>

<div v-else-if="error" style="color: red; text-align: center; padding: 20px;">
  {{ error }}
</div>

<div v-else class="account-grid">
  <Card v-for="(acc, index) in accounts" :key="index">
    <Badge :type="getBadgeType(acc.region)" :text="acc.region" />
    <br><br>
    账号 <code>{{ acc.email }}</code>
    <br><br>
    密码 <Plot trigger="click" effect="blur"><code>{{ acc.password }}</code></Plot>
    <br><br>
    <button class="copy-btn" @click="copy(acc.email, acc, 'email')">
        {{ acc.copiedEmail ? '已复制' : '复制账号' }}
    </button> 
    <button class="copy-btn" @click="copy(acc.password, acc, 'password')">
        {{ acc.copiedPassword ? '已复制' : '复制密码' }}
    </button>
  </Card>
</div>

<style>
.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

/* 强制清除 Card 组件可能自带的外边距 */
.account-grid > * {
  margin: 0 !important;
}

.copy-btn {
  cursor: pointer;
  margin-right: 8px;
  padding: 4px 12px;
  font-size: 13px;
  border: 1px solid var(--vp-c-gutter);
  background-color: transparent;
  color: var(--vp-c-text-2);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.refresh-btn {
  cursor: pointer;
  padding: 4px 12px;
  font-size: 13px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  transition: all 0.3s;
}
.refresh-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}
.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .account-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>



## 机场推荐

<LinkCard title="✈️便宜好用的翻墙机场推荐评测" href="https://www.ermao.net/posts/vpn/" description="最好用且便宜的机场推荐，每个机场至少由我试用一周后才决定是否推荐。 有较为严格的审核标准，让大家伙儿们放心使用。" />

<script setup>
import { ref, onMounted } from 'vue'

const accounts = ref([])
const updateTime = ref('')
const loading = ref(true)
const error = ref('')

const getBadgeType = (region) => {
  if (region.includes('美')) return 'tip';
  if (region.includes('日')) return 'warning';
  if (region.includes('韩')) return 'danger';
  if (region.includes('中') || region.includes('国区')) return 'tip';
  return 'info';
}

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('https://api.ermao.net/get_apple_id')
    if (!res.ok) throw new Error('网络请求失败')
    const data = await res.json()
    // 为每个账号添加复制状态标记
    accounts.value = (data.accounts || []).map(acc => ({
        ...acc,
        copiedEmail: false,
        copiedPassword: false
    }))
    updateTime.value = data.updated_at || ''
  } catch (e) {
    console.error(e)
    error.value = '获取账号失败，请稍后刷新重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const copy = (text, acc, type) => {
  const onSuccess = () => {
      if (type === 'email') acc.copiedEmail = true;
      if (type === 'password') acc.copiedPassword = true;
      
      // 2秒后恢复状态
      setTimeout(() => {
        if (type === 'email') acc.copiedEmail = false;
        if (type === 'password') acc.copiedPassword = false;
      }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(err => {
      console.error('复制失败: ', err);
      fallbackCopy(text, onSuccess);
    });
  } else {
    fallbackCopy(text, onSuccess);
  }
}

const fallbackCopy = (text, onSuccess) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
      document.execCommand('copy');
      onSuccess();
  } catch (err) {
      console.error('复制失败: ', err);
      alert('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}
</script>
