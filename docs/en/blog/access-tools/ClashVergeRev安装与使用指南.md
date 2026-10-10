---
title: Install and Use Clash Verge Rev on macOS
createTime: '2025/01/22 22:50:41'
permalink: /en/article/6vxkmmuh/
lang: en-US
translationOf: /article/6vxkmmuh/
description: Install Clash Verge Rev on an Intel or Apple Silicon Mac, import a subscription, select a node, choose a proxy mode, and troubleshoot common issues.
tags:
  - censorship circumvention
  - Clash
  - macOS
  - Mac
---

Clash Verge Rev is a proxy client for macOS with builds for both Apple Silicon and Intel processors. This guide explains how to install the app, import a subscription, select a node, and configure the proxy.

<!-- more -->

## 1. Download and install

### Choose the correct build

The [official installation guide](https://www.clashverge.dev/install.html) currently requires **macOS 12 or later**. Check the OS version and processor, then choose the matching package from the official GitHub releases. The ermao.net download links below are mirrors, not upstream release channels.

- **GitHub:** [Clash Verge Rev releases](https://github.com/Clash-Verge-rev/clash-verge-rev/releases)
- [Clash Verge macOS x64 for Intel](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg)
- [Clash Verge macOS for Apple Silicon](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg)

### Installation

1. Verify the package source and processor architecture, open the `.dmg`, drag **Clash Verge Rev** into **Applications**, and launch it from there.
2. If the developer cannot be verified or Apple cannot check the app for malicious software, stop and verify the source, version, and file integrity. Review [Apple's safety guidance](https://support.apple.com/zh-cn/102445) before proceeding. On recent macOS versions, the relevant settings are under **System Settings > Privacy & Security**; labels can differ on older versions.
3. If macOS reports malware, says the app will damage the computer, or reports a damaged file, do not force it open. Stop installation and contact the developer if the source or integrity is uncertain. Do not disable Gatekeeper or remove quarantine attributes to bypass warnings.

---

## 2. Basic configuration

### Add a subscription URL

If you do not have a subscription URL, consult the [proxy-service selection and review guide](/en/posts/vpn/).

1. Open **Clash Verge Rev** and select **Profiles** or **Subscriptions** in the navigation.
2. Paste the subscription URL into the subscription input and select **Import**.
3. Wait for the import to finish. If it fails, refresh the page and request a current URL from the provider.

**Note:** Import can fail when a plan has expired or its subscription URL has been revoked.

### Select a proxy node

1. After the subscription is imported, open **Proxies**.
2. The main panel displays the servers supplied by the subscription.
3. Select the required policy group, then choose a node.

In most cases, no other setting must be changed before testing the selected node.

---

## 3. Proxy modes

System Proxy and TUN determine how traffic enters Clash Verge Rev. Rule, Global, and Direct modes determine the outbound path for **traffic already captured by the client**. See the [official terminology guide](https://www.clashverge.dev/guide/term.html).

- **Rule mode:** Applies the profile's rules to captured traffic, selecting a proxy node, a direct connection, or another policy. The actual rules determine how each site is handled.
- **Global mode:** Sends captured traffic through the selected global outbound. A proxy-node selection uses that node; a direct selection remains direct. This does not capture additional apps or guarantee encryption of all device traffic.
- **Direct mode:** Sends captured traffic through the local network without a remote proxy node.

---

## 4. System Proxy and TUN

- **System Proxy:** Enabling this option in Settings affects only apps that honor the macOS system proxy settings. Other apps may still connect directly. A successful browser test does not prove that every app is proxied.
- **TUN:** Uses a virtual network interface and system routes to capture traffic, including traffic from apps that ignore system proxy settings. Coverage depends on routes and exclusions in the configuration. Captured traffic still follows the outbound mode described above; TUN does not unconditionally guarantee capture of every connection. See the [Mihomo TUN configuration](https://wiki.metacubex.one/config/inbound/tun/).

Start by testing the target app with System Proxy. If TUN is needed, review the official service-component and permission requirements before enabling it. System Proxy and TUN are independent switches, not inherently mutually exclusive; the [v2.5.8 source](https://github.com/clash-verge-rev/clash-verge-rev/blob/v2.5.8/src/components/shared/proxy-control-switches.tsx) handles them separately. During troubleshooting, test one capture method at a time and check the target app's connections and logs before choosing a configuration.

---

## 5. Troubleshooting

- **Subscription import fails:** Confirm that the URL is complete and valid and that the underlying network works.
- **A target app is not proxied:** Verify the subscription, selected node, and running core. Then check whether the app honors System Proxy, whether TUN routes capture it, and whether the rule or global outbound is correct. Global mode is not a switch that captures every app.
- **DNS resolution fails after disabling TUN or quitting:** The [v2.5.8 release notes](https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.8) document a fix for macOS system DNS remaining at `114.114.114.114`. If the symptoms match, back up the configuration and check the official version. This does not establish the cause of every connectivity or DNS failure. Record the app version, error, and current network settings before continuing with the official troubleshooting guidance.

---

## 6. Uninstall

Removing the app and uninstalling its background service are separate steps. The official documentation notes that the service can keep running after the app exits; moving the app to Trash alone does not uninstall it.

1. Back up subscriptions and configuration you want to keep, disable System Proxy and TUN, and confirm that ordinary network access works.
2. If a service component was installed, follow the [official macOS service-removal instructions](https://www.clashverge.dev/uninstall.html) to use the bundled `uninstall-service` before deleting the app. Check the actual app path and version; do not delete configuration directories as a shortcut.
3. Quit the app, then move **Clash Verge Rev** from **Applications** to **Trash**. Keep the backup and Trash contents until network access is confirmed and recovery is no longer needed, then decide how to handle them.

These steps cover the basic macOS installation and configuration. Consult the current upstream release notes if the interface or permission prompts differ from the screenshots or labels described here.
