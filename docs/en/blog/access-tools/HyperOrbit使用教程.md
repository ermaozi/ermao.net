---
title: HyperOrbit Setup Guide for iPhone, iPad, and Mac (2026)
createTime: 2026/05/29 12:12:52
permalink: /en/blog/HyperOrbit/
lang: en-US
translationOf: /blog/HyperOrbit/
tags:
  - HyperOrbit
  - iOS proxy
  - iPhone
  - iPad
  - Mac
  - proxy client
  - VLESS
  - Trojan
description: Install HyperOrbit on iPhone, iPad, or Apple Silicon Mac, import subscriptions or nodes, choose a routing mode, test latency, sync with iCloud, and troubleshoot.
---

# HyperOrbit setup guide

HyperOrbit is a proxy client built around its developer's HyperCore engine. It supports VLESS, VMess, Shadowsocks, Trojan, AnyTLS, Hysteria2, and TUIC and is available for iPhone, iPad, and supported Macs.

> HyperOrbit is a client. It does not supply proxy nodes; bring a compatible subscription or individual node.

<!-- more -->

::: tip Need a subscription?
Consult the [proxy-service selection and review guide](/en/posts/vpn/) before returning to the client setup.
:::

---

![HyperOrbit connected screen](https://image.ermao.net/images/blog/HyperOrbit/20260527_230232-cd78fc.png)

---

## Features highlighted by the source

**HyperCore and protocol support**

The developer describes HyperCore as a C++ engine compatible with Xray configurations and supporting VLESS with Reality, VMess, Shadowsocks, and Trojan. The source article calls Reality one of the more identification-resistant options. Actual resistance depends on configuration and network conditions.

The source also reports approximately **5 MB** of VPN-extension memory use at startup, under **15 MB** under load, and more than **6.5 Gbps** in a local `iperf3` test between a directly connected Mac and iPhone. These are developer/source test figures, not a guarantee of internet throughput or performance on every device.

**Several import methods**

The app can import a subscription URL, scan a QR code, read a node URI from the clipboard, or accept a shared file.

**Rule-based routing**

Its built-in Rule mode is intended to send local traffic directly and selected external traffic through the proxy.

**iCloud synchronization**

Subscriptions, nodes, and custom profiles can be backed up to iCloud and restored on another device using the same iCloud account.

**Node latency tests**

The app can test all imported nodes and show their TCP latency.

## Price recorded by the source

At the source article's May 29, 2026 snapshot, HyperOrbit listed a price of **USD 1.99 per year** and a **seven-day free trial** that could be canceled before billing.

![HyperOrbit free-trial screen](https://image.ermao.net/images/blog/HyperOrbit/20260527_231550-c18a35.png)

The source also linked a TestFlight beta in which paid features were available without purchase:

👉 [Join the TestFlight beta](https://testflight.apple.com/join/TmUdbPCt)

Prices, trials, and TestFlight availability can change. Verify the current App Store purchase screen before subscribing.

## Requirements listed by the source

| Platform | Minimum version |
|---|---|
| iOS | 16.0 |
| iPadOS | 16.0 |
| macOS, Designed for iPad | 13.0 |

You also need:

- a compatible proxy subscription URL or node URI;
- an Apple ID for an App Store region where the app is available.

## 1. Install

The app was not listed in mainland China's App Store at the source snapshot. Another supported App Store region, such as the United States, Hong Kong, or Taiwan, may be required.

- [App Store listing](https://apps.apple.com/us/app/hyperorbit/id6761375312)
- [HyperOrbit website](https://app.hyperorbit.net/)
- [Telegram group](https://t.me/HyperOrbitNet)

### iPhone and iPad

Search for **HyperOrbit** in the appropriate App Store region or use the listing above, verify the app, and install it.

### Mac

HyperOrbit runs as a **Designed for iPad** app on an Apple Silicon Mac, with M1 or later listed by the source. It does not require a separate Mac package.

Open the App Store on the Mac, use a supported store account, and install the iPad app. The Mac version also lists:

- **TUN mode**, under **Settings → Mac Settings**;
- a configurable local **SOCKS5 proxy** for individual applications;
- keyboard, mouse, and resizable-window support.

The source states that Intel Macs are not supported. If macOS requests permission for the App Store app, review it under **System Settings → Privacy & Security**.

## 2. Import nodes or a subscription

### Method 1: subscription URL

This imports all nodes supplied by a provider and can be refreshed later.

1. Select **+** on the home screen.
2. Choose **Add Subscription**.
3. Paste the subscription URL.
4. Confirm the import.

![Adding a HyperOrbit subscription](https://image.ermao.net/images/blog/HyperOrbit/20260527_230305-edc2ac.png)

![HyperOrbit subscription form](https://image.ermao.net/images/blog/HyperOrbit/20260527_230313-2902b2.png)

### Method 2: scan a QR code

1. Select **+**.
2. Choose **Scan QR Code**.
3. Scan a node or subscription QR code that you trust.

![Scanning a QR code in HyperOrbit](https://image.ermao.net/images/blog/HyperOrbit/20260527_230845-da0f61.png)

### Method 3: import from the clipboard

Copy a node URI such as `vless://...` or `vmess://...`, then:

1. select **+**;
2. choose **Import from Clipboard**;
3. review and confirm the imported data.

### Method 4: add one node manually

If you have the server address, port, UUID, and protocol details:

1. select **+**;
2. choose **Add Node**;
3. enter the parameters for the selected protocol.

## 3. Connect

Select the intended node in the home-screen list, then select the connection button.

On the first connection, iOS asks whether the app may add a VPN configuration. Review the request, allow it, and authenticate with Face ID or the passcode.

![Connecting in HyperOrbit](https://image.ermao.net/images/blog/HyperOrbit/20260527_230953-b90205.png)

A VPN indicator appears while the connection is active.

## 4. Routing modes

| Mode | Behavior | Typical use |
|---|---|---|
| **Rule** | Selected external traffic uses the proxy; local traffic is direct | Regular use |
| **Global** | All supported traffic uses the proxy | Connectivity testing or a temporary all-proxy requirement |
| **Direct** | All traffic is direct | Temporarily bypass the proxy while keeping the VPN profile active |

Global mode can be useful for a first connectivity test, but Rule mode is normally preferable for regular use.

![Changing HyperOrbit routing mode](https://image.ermao.net/images/blog/HyperOrbit/20260527_231009-a016d7.png)

![HyperOrbit rules view](https://image.ermao.net/images/blog/HyperOrbit/20260527_231013-c163ec.png)

## 5. Test node latency

Select **Test All** on the home screen. HyperOrbit sends TCP latency tests and displays a result next to each node.

Low latency is one useful signal, but also test the actual application and sustained throughput before selecting a primary node.

![HyperOrbit node-latency test](https://image.ermao.net/images/blog/HyperOrbit/20260527_231025-873908.png)

## 6. iCloud sync

Open **Settings → iCloud Sync** and choose **Upload All to iCloud**.

On another device using the same iCloud account, open the same screen and choose **Download All from iCloud** to restore subscriptions and nodes.

![HyperOrbit iCloud synchronization](https://image.ermao.net/images/blog/HyperOrbit/20260527_231041-8bc167.png)

![HyperOrbit iCloud synchronization details](https://image.ermao.net/images/blog/HyperOrbit/20260527_231053-a776aa.png)

## 7. Advanced features

### Active connections

Select the active-connection count on the connection card to inspect:

- target domain or IP;
- selected proxy node;
- upload and download traffic;
- active or closed status.

![HyperOrbit active-connections view](https://image.ermao.net/images/blog/HyperOrbit/20260527_231113-2a017e.png)

This can help determine which app is using data and whether a request followed the direct or proxied route.

### Traffic statistics and slow connections

The Statistics page aggregates connections by domain:

- **Slow DNS resolution:** A much slower first connection can indicate DNS lookup overhead. Test another DNS configuration or routing rule before changing it permanently.
- **Consistently slow domains:** Sort by connection time to identify requests that remain slow through the proxy.
- **Direct versus proxied traffic:** Compare how the current rules divide connections.

![HyperOrbit statistics view](https://image.ermao.net/images/blog/HyperOrbit/20260527_231129-7cc9cb.png)

## Frequently asked questions

::: details The network does not change after connecting
Check whether the mode is **Rule** or **Global**. Test Global mode temporarily. If Global also fails, select another node or contact the provider because the node itself may be unavailable.
:::

::: details Subscription import fails
- Open the URL in a browser to verify that it responds.
- Some providers require a particular `User-Agent`. HyperOrbit lists this under **Settings → Subscription User-Agent**. Examples in the source include `clash-verge/1.0.0` and `v2rayNG/1.8.0`.
- If the subscription domain is blocked on the current network, use another temporary connection before importing.
:::

::: details The iOS connection closes immediately
iOS can terminate a VPN extension that exceeds its memory limit, commonly reported as approximately **50 MB**.

- Reduce the number of simultaneously enabled custom profiles.
- Lower logging to `Warning` or `Error`; the source reports `None` as the default.
:::

::: details Does it work on a Mac?
The source lists support on an **Apple Silicon Mac with M1 or later** through the iPad app. The Mac interface adds TUN and local SOCKS5 settings. Intel Macs are listed as unsupported.
:::

::: details Is it available in mainland China's App Store?
It was not available there at the source snapshot. Use an Apple ID for a region where the app is listed. If necessary, read the safety restrictions on the [shared U.S. Apple ID page](/en/blog/freeappleid/).
:::

::: details Does HyperOrbit collect user data?
The source article states that HyperOrbit does not collect traffic or personal information. This translation has not independently audited the app or its network behavior. Review its current privacy disclosures and permissions if that claim is important to your threat model.
:::

## Supported protocols

| Protocol | Transports or notes listed by the source |
|---|---|
| **VLESS** | Reality, TLS, WebSocket, gRPC, HTTP/2 |
| **VMess** | TLS, WebSocket, gRPC, HTTP/2 |
| **Shadowsocks** | AEAD; ShadowsocksR also listed |
| **Trojan** | TLS |
| **AnyTLS** | Supported |
| **Hysteria2** | Supported |
| **TUIC** | Supported |

For project-specific support, use the official [Telegram group](https://t.me/HyperOrbitNet).
