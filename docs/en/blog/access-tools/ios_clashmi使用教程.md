---
title: 'Clash Mi for iOS: Installation, Subscription Import, and Troubleshooting (2026)'
createTime: 2026/03/05 10:34:23
permalink: /en/blog/clashmi/
lang: en-US
translationOf: /blog/clashmi/
description: Install Clash Mi on iPhone or iPad, import a Clash subscription, connect through TUN, and resolve common profile, memory, and permission errors.
tags:
  - Clash Mi
  - iOS proxy
  - censorship circumvention
  - Mihomo
  - Clash tutorial
---

Clash Mi is a proxy client built around the `mihomo` core, also known as Clash Meta. It supports iOS, macOS, Android, and Windows and is distributed as open-source software at no charge. At the time of the source review, the author had used it as the primary mobile client for about a month and reported a clean interface, no intrusive advertising, reliable background refreshes, and stable connections.

This guide follows four steps: download the client, import a subscription, connect, and troubleshoot common problems.

<!-- more -->

![Clash Mi website and app overview =256x256](https://image.ermao.net/images/blog/clashmi/20260305_103545-57abfa.png)

Website: [https://clashmi.app/](https://clashmi.app/)

## What the source review liked

- **Current core:** Clash Mi includes and updates `mihomo`, the core commonly called Clash Meta. It is intended to support mainstream Clash-compatible profiles, although compatibility ultimately depends on the profile syntax and features used.
- **Simple setup:** A valid Clash subscription URL can be pasted directly into the app without extensive manual settings.
- **Clean interface:** The main screen avoids unnecessary controls and makes the basic connection flow easier for beginners.

![Clash Mi home-screen preview =480x651](https://image.ermao.net/images/blog/clashmi/20260305_103743-3935fc.png)

## Requirements

| Platform | Minimum version listed by the source |
| --- | --- |
| iOS | 15 or later |
| macOS | 12 or later |
| Android | 8 or later |
| Windows | 10 or later |

::: tip Prepare a Clash subscription
Clash Mi is only the client. It needs a valid Clash-compatible subscription to provide nodes.

If you do not have one, consult the [proxy-service selection and review guide](/en/posts/vpn/).
:::

## 1. Download and install Clash Mi

### iOS, iPadOS, and macOS

Apple-platform users can obtain the app through either channel:

- **Stable App Store release:** [Open Clash Mi in the App Store](https://apps.apple.com/us/app/clash-mi/id6744321968)
- **TestFlight beta:** [Join the TestFlight beta](https://testflight.apple.com/join/bjHXktB3)

Important details:

- Clash Mi may not appear under a mainland China Apple ID. A supported App Store region such as the United States or Hong Kong may be required. The following page lists shared accounts and their safety restrictions:

<LinkCard title="Shared U.S. Apple IDs for App Store Downloads" href="/en/blog/freeappleid/" description="Shared non-mainland Apple IDs intended only for App Store sign-in. Read the device-lock and privacy warnings before use." />

- The App Store and TestFlight versions cannot normally be installed side by side. Installing one may replace the other.

### Android, HarmonyOS, Windows, and Linux

Download the package for the intended platform from the project's download page:

👉 [Clash Mi downloads](https://clashmi.app/download)

## 2. Connect in three steps

The screenshots below use iOS.

### Step 1: import the subscription

Open **My Profiles** in the bottom navigation, select **+** in the upper-right corner, choose **Add Profile URL**, and paste the provider's subscription URL.

![Adding a profile URL in Clash Mi =706x480](https://image.ermao.net/images/blog/clashmi/20260305_103809-b1ab1b.png)

### Step 2: activate the imported profile

After importing, select the new subscription card in the profile list so the app knows which profile to use.

![Selecting a profile in Clash Mi =854x422](https://image.ermao.net/images/blog/clashmi/20260305_103816-7c1edf.png)

### Step 3: connect

Return to **Home** and select the round connection button. If the system asks to add a VPN configuration, review the request and allow it.

![Starting the Clash Mi connection =480x543](https://image.ermao.net/images/blog/clashmi/20260305_103836-d45527.png)

## 3. Online dashboard

The **Dashboard** section in Clash Mi provides most of the controls that experienced users may know from browser-based Mihomo dashboards.

- The dashboard is protected by a `secret` by default. View it under **Core Settings**.
- If the built-in dashboard does not work for a particular setup, Clash Mi can temporarily expose another dashboard on the local network. The source guide notes that this option accepts `http` rather than `https`.

## 4. Troubleshooting

### 1) Global mode is enabled, but traffic still does not work

**Cause:** The `GLOBAL` group may not have a selected node or policy.

**Fix:**

- Open **Proxies → GLOBAL** and choose **Node Selection** or **Automatic Selection**.
- Advanced users can add or correct a `GLOBAL` group under `proxy-groups` in the subscription's YAML profile.

### 2) The app says connected, but traffic remains at zero

- Enable the TUN override, apply it, and reconnect.
- On Windows, restart Clash Mi as administrator before enabling TUN.
- If you use the provider's profile without any override, ask the provider whether its subscription is Clash Mi compatible.

### 3) Subscription import fails

Check in this order:

- Clash Mi accepts Clash `.yml` or `.yaml` profiles; it does not directly accept sing-box or raw V2Ray subscriptions.
- Open the subscription URL in a browser to confirm that it responds.
- Some providers require a particular `User-Agent`, which can be changed in app settings.
- If the subscription domain is blocked on the current network, use another temporary connection before importing it.

To disable the default override where supported, append `overwrite=false` as a subscription URL parameter.

### 4) The connection closes immediately on iOS

A common cause is iOS terminating the VPN extension when its memory use exceeds the platform's limit, reported by the source as approximately 50 MB.

- Reduce the number of `geosite`, `geoip`, and `ip-asn` rules.
- Prefer `mrs` rule-set files where the profile supports them.

### 5) Windows reports `configure tun interface: Access is denied`

Run Clash Mi as administrator, then reconnect.

### 6) Clash Mi cannot be downloaded or updated on iOS or macOS

- Use an Apple ID for a region where Clash Mi is available.
- If a TestFlight build was previously installed, remove it before installing the App Store release with the appropriate account.

### 7) Does Clash Mi collect data?

The project is described by the source as not actively collecting user information. The dashboard enables a `secret` by default, so a valid secret is required even when access beyond the local device is enabled. Review the current source code, release documentation, and network behavior if this assurance is important to your threat model.

### 8) Control the connection through external URLs

- Connect: `clash://connect?background=true`
- Disconnect: `clash://disconnect?background=true`
- Reconnect: `clash://reconnect?background=true`

## 5. Advanced notes

- A `geo ruleset` cannot be updated manually in the interface; configure its automatic-update interval in the core settings.
- Dashboard actions such as updating or restarting the core, reloading the profile, or updating GEO data may be restricted on some platforms.
- Some Macs require Full Disk Access before a system extension can read the needed configuration files.

## Further reading

- [Mobile Access Guide for Android and iOS](/en/blog/how-to-vpn-on-mobile/)
- [Install and Use Clash on Android](/en/article/eh8f4n86/)
- [Install and Configure Shadowrocket](/en/article/z747kgjd/)
- [Shadowrocket Rules, Split Routing, and Ad Blocking](/en/blog/shadowrocket-rules-config/)
- [Computer Access Guide for Windows and macOS](/en/blog/how-to-vpn-on-computer/)
- [Shared U.S. Apple IDs](/en/blog/freeappleid/)
