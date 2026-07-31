---
title: Shared U.S. Apple IDs for App Store Downloads (2026)
createTime: 2026/3/22 09:22:04
permalink: /en/blog/freeappleid/
lang: en-US
translationOf: /blog/freeappleid/
tags:
  - Apple ID
  - shared Apple ID
  - U.S. Apple ID
  - Shadowrocket
  - iOS App Store
  - regional downloads
description: Shared Apple IDs for downloading region-limited App Store apps, with live account data and prominent device-lock, privacy, update, and availability warnings.
---

This page lists shared Apple IDs for the United States, Japan, South Korea, Hong Kong, Taiwan, and other App Store regions. They are intended only for downloading region-limited apps such as Shadowrocket, TikTok, ChatGPT, and Clash Mi. Availability can change at any time because the accounts are shared publicly and subject to Apple's security controls.

> 💡 If you frequently switch among store regions, the source article also reviews [Asspp, an Apple ID account manager](/en/blog/asspp-download-guide/). Review its security model before giving any third-party app access to accounts or installation files.

<!-- more -->

::: danger Critical safety boundaries
1. **Device-lock risk:** **Never sign in to a shared account under Settings or iCloud.** Sign in only from the App Store profile screen. A malicious or compromised system-level account can expose an iPhone or iPad to remote lockout.
2. **Privacy risk:** Many people use each shared account. Never store photos, contacts, backups, or other personal data in it, and never attach a payment method or add funds.
3. **Frequent account failure:** Cross-region and multi-device sign-ins can trigger Apple's security systems. A locked account or two-factor-authentication request is a common failure mode for public accounts. Do not attempt to change security settings; use another listed account.
:::

<LinkCard title="Clash Mi for iOS: Free Client Setup Guide" href="/en/blog/clashmi/" description="Install Clash Mi on iPhone or iPad, import a compatible node subscription, connect through TUN, and resolve common errors." />

## Who should and should not use a shared account?

Public Apple IDs offer temporary access to another App Store region but sacrifice reliability and account isolation.

- **Possible fit:** A user who needs a one-time or occasional download of a region-specific app, such as Shadowrocket, Clash Mi, TikTok, ChatGPT, or Potatso Lite, and will not make in-app purchases or rely on the shared account for long-term ownership.
- **Poor fit:** Anyone who depends heavily on apps from another region, needs reliable updates, or makes in-app purchases. Because a public account may be locked or rotated without notice, such users should create and secure their own Apple ID for the required region.

## Shared Apple ID pool

The pool may include U.S., Japanese, South Korean, Hong Kong, and Taiwan accounts. The source page states that an automated interface tests and rotates the data. This does not guarantee that an account will remain available between the test and your sign-in. Do not enable two-factor authentication or change a password.

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 10px 16px; background-color: var(--vp-c-bg-alt); border-radius: 8px;">
  <div style="color: var(--vp-c-text-2); font-size: 14px;">
    Updated: {{ updateTime || 'Loading...' }}
  </div>
  <button class="refresh-btn" @click="fetchData" :disabled="loading">
    <span v-if="loading">Refreshing...</span>
    <span v-else>Refresh</span>
  </button>
</div>

<div v-if="loading && accounts.length === 0" style="text-align: center; padding: 20px;">
  Loading the latest account information...
</div>

<div v-else-if="error" style="color: red; text-align: center; padding: 20px;">
  {{ error }}
</div>

<div v-else class="account-grid">
  <Card v-for="(acc, index) in accounts" :key="index">
    <Badge :type="getBadgeType(acc.region)" :text="getRegionLabel(acc.region)" />
    <span class="account_warring">App Store only. Signing in under Settings can lock the device.</span>
    <br><br>
    Account <code>{{ acc.email }}</code>
    <br><br>
    Password <Plot trigger="click" effect="blur"><code>{{ acc.password }}</code></Plot>
    <br><br>
    <button class="copy-btn" @click="copy(acc.email, acc, 'email')">
        {{ acc.copiedEmail ? 'Copied' : 'Copy account' }}
    </button>
    <button class="copy-btn" @click="copy(acc.password, acc, 'password')">
        {{ acc.copiedPassword ? 'Copied' : 'Copy password' }}
    </button>
  </Card>
</div>

<style>
.account_warring {
  color: #ff4d4f;
  font-size: 13px;
  margin: 4px;
}
.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

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

## Frequently asked questions

### Why does a free U.S. Apple ID say it is locked?

Many devices sign in to the public account from different regions within a short time, triggering Apple's security protections. Lockouts cannot be eliminated for a publicly shared account. Do not attempt account recovery, which usually requires the owner's phone number or security answers. Refresh the page and try another account currently reported as available.

### How do I update an app downloaded with a shared Apple ID?

The App Store may require the Apple ID that originally obtained the app before installing an update. If Clash Mi or another region-limited app was downloaded with one of these accounts, the same account may be required later. Because accounts in this pool rotate frequently, it may no longer be available.

If an update cannot be installed, the source guide suggests removing the old app and reinstalling the current release with an available account. **Back up any local app configuration first**, because deleting an app can also delete its on-device data.

## Related tools

<LinkCard title="Asspp Review: Managing Multiple Apple IDs and Regions" href="/en/blog/asspp-download-guide/" description="A review of a third-party manager for switching App Store accounts, downloading older app versions, and extracting IPA packages. Evaluate account and package security before use." />

<LinkCard title="Proxy-Service Selection and Long-Term Review Guide" href="/en/posts/vpn/" description="Plan comparisons, testing criteria, detailed reviews, and shutdown-risk records for China-focused proxy services." />

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

const getRegionLabel = (region) => {
  const labels = [
    ['美国', 'United States'],
    ['美区', 'United States'],
    ['日本', 'Japan'],
    ['日区', 'Japan'],
    ['韩国', 'South Korea'],
    ['韩区', 'South Korea'],
    ['香港', 'Hong Kong'],
    ['港区', 'Hong Kong'],
    ['台湾', 'Taiwan'],
    ['台区', 'Taiwan'],
    ['中国', 'Mainland China'],
    ['国区', 'Mainland China'],
  ]
  const match = labels.find(([key]) => region.includes(key))
  return match ? match[1] : region
}

const fetchData = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('https://api.ermao.net/get_apple_id')
    if (!res.ok) throw new Error('Network request failed')
    const data = await res.json()
    accounts.value = (data.accounts || []).map(acc => ({
        ...acc,
        copiedEmail: false,
        copiedPassword: false
    }))
    updateTime.value = data.updated_at || ''
  } catch (e) {
    console.error(e)
    error.value = 'Could not load accounts. Refresh and try again later.'
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

      setTimeout(() => {
        if (type === 'email') acc.copiedEmail = false;
        if (type === 'password') acc.copiedPassword = false;
      }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(err => {
      console.error('Copy failed: ', err);
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
      console.error('Copy failed: ', err);
      alert('Copy failed. Copy the value manually.')
  }
  document.body.removeChild(textarea);
}
</script>
