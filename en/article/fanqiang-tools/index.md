---
url: /en/article/fanqiang-tools/index.md
description: >-
  Compare proxy clients for Windows, macOS, Linux, Android, iOS, and routers,
  then import a subscription, select nodes, configure TUN, and troubleshoot.
---
# 2026 Access-Tool Guide: Clash, Shadowrocket, V2RayNG, and sing-box

Names such as Clash, Shadowrocket, V2RayNG, v2rayN, sing-box, Hiddify, subscription, and node can be confusing at first.

The relationship is simple: **the access tool is the client, the provider subscription supplies the routes, and a node is an individual server or route**. Install a client appropriate for the device, import a compatible subscription URL, select a node, and enable the proxy.

\[\[toc]]

::: warning Before use
This guide covers ordinary activities such as research, remote work, cross-border information access, open-source development, and personal streaming accounts. VPN and proxy rules differ by jurisdiction. Understand and follow the laws and service terms that apply to you.
:::

![Overview of proxy and censorship-circumvention tools =1814x352](https://image.ermao.net/images/posts/vpn/20260315_110648-5171d6.png)

## Quick recommendation by device

| Device | First choice | Alternatives | Typical use | Guide |
| --- | --- | --- | --- | --- |
| Windows | Clash Verge Rev | v2rayN, Hiddify | Beginners, work, ChatGPT, YouTube | [Install Clash Verge](/en/article/0gematwc/) |
| macOS | Clash Verge Rev | Clash Mi, Surge | Mac users and rule-based routing | [Clash Verge Rev for macOS](/en/article/6vxkmmuh/) |
| Linux | Clash Verge Rev | sing-box, Hiddify | Developers and desktop systems | [Computer access guide](/en/blog/how-to-vpn-on-computer/) |
| Android | Clash Meta for Android | V2RayNG, Hiddify | Phones, tablets, and backup devices | [Clash for Android](/en/article/eh8f4n86/) |
| iPhone and iPad | Clash Mi | Shadowrocket, Stash, Quantumult X | iOS and iPadOS users | [Clash Mi for iOS](/en/blog/clashmi/) |
| Paid iOS client | Shadowrocket | Stash, Surge | Users who already own Shadowrocket | [Shadowrocket beginner guide](/en/article/z747kgjd/) |
| Router and whole home | OpenClash | PassWall, sing-box | TVs, consoles, and household devices | [Whole-home router guide](/en/blog/softrouter/) |

If you do not have a provider subscription, consult the [2026 proxy-service selection and review guide](/en/posts/vpn/). If the relationship among provider, subscription, node, and client is still unclear, start with the [proxy-subscription beginner guide](/en/article/jichang-subscription-guide/).

## Client, subscription, node, and VPN: what is the difference?

| Term | Plain-language meaning | Examples |
| --- | --- | --- |
| Access tool or client | Software installed on a computer or phone | Clash Verge Rev, Shadowrocket, V2RayNG |
| Provider subscription | A URL supplied by a service provider | Clash, V2Ray, or standard subscription |
| Node | A specific server or route | Hong Kong, Japan, Singapore, or U.S. node |
| VPN app | An integrated app bundled with its own routes | One-click commercial VPN |
| Rule-based routing | Decides which traffic is proxied and which is direct | Local sites direct; Google and YouTube proxied |

A useful model is:

**Connection quality = stable provider routes + a compatible client + correct routing rules + the quality of the local network**

The client itself is often free. Speed and stability usually depend more on the provider's routes, node capacity, protocol compatibility, and peak-hour load.

## Mainstream clients in 2026

### 1. Clash Verge Rev: a beginner-friendly desktop client

Clash Verge Rev is a graphical proxy client for Windows, macOS, and Linux. It supports subscription management, rule mode, the system proxy, TUN mode, and switching among nodes.

It can suit users who:

* are configuring desktop access for the first time;
* need Google, YouTube, GitHub, ChatGPT, or Claude;
* want local services to connect directly while selected traffic uses the proxy;
* prefer a similar workflow across Windows, macOS, and Linux.

Basic setup:

1. Use the [Clash Verge installation guide](/en/article/0gematwc/) to download the correct build.
2. Copy a **Clash** or standard subscription URL from the provider.
3. Paste and import it under **Profiles** or **Subscriptions**.
4. Open **Proxies** and select a responsive node.
5. Enable **System Proxy** under Settings. Enable TUN only when the use case requires it.
6. Prefer **Rule Mode** for regular use rather than leaving all traffic in Global Mode.

The original Clash for Windows project is no longer maintained and should not be a beginner's default. When a provider uses AnyTLS, VLESS, Hysteria2, TUIC, or another recently added protocol, verify that the installed client version supports it.

### 2. v2rayN: broad protocol support on Windows

v2rayN is a common Windows client for VLESS, VMess, Trojan, Shadowsocks, and related configurations. Its interface may require more familiarity than Clash Verge Rev, but many providers offer a separate v2rayN subscription.

Consider it when:

* the provider supplies a V2Ray subscription;
* the Clash import fails but support supplies a v2rayN configuration;
* you need to add an individual node manually or compare protocols.

If both Clash and v2rayN profiles are available, a beginner can start with Clash Verge Rev and move to v2rayN only when compatibility requires it.

### 3. Clash Meta for Android

Clash Meta for Android accepts common Clash profiles and supports rule-based routing.

Quick setup:

1. Follow the [Clash for Android guide](/en/article/eh8f4n86/) to install the client.
2. Open **Profiles**.
3. Select **+**, then choose **URL**.
4. Paste the subscription URL, save it, and activate the profile.
5. Return to the home screen and start the connection. Approve Android's VPN permission on first use.
6. Test the nodes, choose a responsive one, and use rule mode for ordinary use.

For a newer protocol or sing-box profile, V2RayNG, Hiddify, or a provider's own client may be more compatible.

### 4. Shadowrocket: the established iPhone client

Shadowrocket is a long-established paid proxy client for iPhone and iPad. It supports subscriptions, rules, node tests, and common proxy protocols. It is most convenient for someone who already owns the app through an App Store region where it is available.

Basic setup:

1. Open the appropriate App Store region.
2. Find Shadowrocket and verify the official icon and developer.
3. Copy a Shadowrocket-compatible or standard subscription URL.
4. Select **+** in Shadowrocket and choose **Subscribe**.
5. Paste and save the URL.
6. Select a node, enable the main switch, and approve the VPN configuration.

See the [Shadowrocket beginner guide](/en/article/z747kgjd/) for screenshots. If you prefer a free client, see [Clash Mi](/en/blog/clashmi/).

### 5. Clash Mi: a free iOS option

Clash Mi includes the Mihomo core and supports iOS, macOS, Android, and Windows. It has a relatively simple interface and accepts Clash-compatible subscriptions, making it an option for iPhone users who do not want to purchase Shadowrocket.

It may suit users who:

* use an iPhone or iPad and want a free client;
* receive a standard Clash profile;
* want to import a subscription and connect without extensive manual rules.

Subscription formats are not interchangeable. If Clash Mi rejects a URL, first confirm that the provider supplied a Clash profile rather than a sing-box or raw V2Ray subscription. See the [Clash Mi troubleshooting section](/en/blog/clashmi/) for details.

### 6. V2RayNG: a lightweight Android alternative

V2RayNG is commonly used on Android for V2Ray subscriptions, manual nodes, and lightweight backup access. It emphasizes individual connections and protocol support more than Clash-style rule groups.

Typical cases:

* Clash import fails on an Android phone;
* the provider supplies a V2Ray subscription;
* only one node must be connected without complex routing.

Do not keep two VPN or proxy clients connected at once, because they can compete for Android's VPN permission.

### 7. sing-box and Hiddify: newer protocols and cross-platform profiles

sing-box is a general proxy core that supports a wide range of current formats and protocols. Hiddify and similar apps expose sing-box or Xray capabilities through a graphical interface.

Consider them when:

* the provider explicitly supplies a sing-box subscription;
* the profile uses AnyTLS, Hysteria2, TUIC, VLESS Reality, or another feature supported by that client build;
* a similar workflow is needed on Windows, macOS, Android, and iOS;
* a Clash client cannot import the available format.

Do not choose a protocol solely because it is new. Stable routes, peak-hour performance, support responses, and standard-subscription availability often matter more. See [How to Choose a Proxy Service](/en/article/choose-good-airport/).

## Configure a client from scratch

### Step 1: choose a provider subscription

Without a subscription, the client has no provider nodes. For a first purchase:

1. Start with a trial or monthly plan rather than an annual, multi-year, or “lifetime” plan.
2. Prefer a provider that supplies the formats required by Clash, Shadowrocket, V2RayNG, or the other intended clients.
3. Test commonly needed regions, such as Hong Kong, Japan, Singapore, Taiwan, and the United States.

Use the [provider guide](/en/posts/vpn/) to compare low-cost monthly plans, and read the [subscription beginner guide](/en/article/jichang-subscription-guide/) for the purchase and import sequence.

### Step 2: install the client for the device

* Desktop: [Clash Verge Rev](/en/article/0gematwc/)
* Android: [Clash Meta for Android](/en/article/eh8f4n86/)
* iPhone and iPad: [Clash Mi](/en/blog/clashmi/) or [Shadowrocket](/en/article/z747kgjd/)
* Whole home: [Router access guide](/en/blog/softrouter/)

Prefer the upstream project, a verified store listing, or a trusted package source. Avoid unknown “cracked,” “high-speed,” or modified builds.

### Step 3: copy and import the correct subscription

A provider dashboard may show several options:

* `Clash subscription`
* `Import to Clash`
* `Shadowrocket`
* `V2Ray`
* `sing-box`
* `Standard subscription`

If import fails, check:

1. whether the URL is expired, truncated, or copied incorrectly;
2. whether the client accepts that format;
3. whether the provider requires a refreshed URL or a different import endpoint.

A sing-box profile will not usually import directly into Clash Verge Rev, and the reverse is also true.

### Step 4: prefer Rule Mode for regular use

| Mode | Behavior | Typical use |
| --- | --- | --- |
| Rule | Local services connect directly; selected traffic uses the proxy | Regular use |
| Global | All supported traffic uses the proxy | Temporary troubleshooting |
| Direct | No traffic uses the proxy | Pausing or checking the local network |

Leaving Global Mode enabled can route messaging, shopping, banking, or local video services through a distant exit, reducing performance and consuming subscription data.

### Step 5: test the actual services

After importing and connecting:

1. Open Google to confirm basic access.
2. Play YouTube at 1080p or 4K to check sustained throughput.
3. Open GitHub to test development resources.
4. Test ChatGPT, Claude, or other required AI services from the selected region.
5. If needed, test Netflix, Disney+, or another streaming platform.

Repeat the test during the common 8–11 p.m. peak period. Daytime availability does not prove peak-hour stability.

## Troubleshooting

### Subscription import fails

Check:

* the complete subscription URL;
* whether the plan has expired or consumed all data;
* the client version;
* whether the wrong format was selected, such as sing-box for a Clash client;
* whether the subscription domain is temporarily inaccessible.

Ask the provider for a profile formatted for the specific client when a configuration error appears. For AnyTLS-specific details, see the [AnyTLS guide](/en/article/anytls-guide/).

### Every node shows an error or timeout

Possible causes include:

* an unstable local network;
* a provider outage;
* an expired or reset subscription;
* a client version that does not support the current protocol;
* multiple connected VPN or proxy clients conflicting.

Refresh the subscription, switch nodes, restart the client, close other proxy apps, read the provider's announcement, and open a support ticket—in that order.

### Google opens, but ChatGPT does not

This is often an exit-region, IP-reputation, or service-risk-control issue rather than a client failure.

* Try a U.S., Japanese, or Singapore node.
* Avoid heavily abused free exit IPs.
* Look for provider labels such as `OpenAI`, `AI`, `native IP`, or `residential`, but verify rather than trusting the label alone.
* If AI access is a daily requirement, choose a provider whose current review includes an actual access check.

### Local websites become slow after connecting

Global Mode is a common cause. Return to Rule Mode and confirm that the rule set is active. If the problem continues, refresh the profile or consult the [advanced Clash rules guide](/en/blog/clash-rules-config/).

### Shadowrocket or Clash Mi does not appear in the App Store

These apps may not be searchable in mainland China's App Store. A supported non-mainland Apple ID may be required. The [shared U.S. Apple ID page](/en/blog/freeappleid/) includes prominent warnings: sign in only inside the App Store, never under the device's main Settings or iCloud section.

## Are free clients and free VPNs reliable?

A free client is not the same as free network service. Clash Verge Rev, Clash Mi, and V2RayNG can be installed without charge, but they still require a usable node or subscription.

Unknown free VPNs and free nodes are poor long-term defaults because:

* capacity may be inadequate during peak hours;
* heavily abused exit IPs can trigger controls at ChatGPT, Google, or streaming services;
* the subscription may disappear without notice;
* an opaque operator creates additional privacy and security uncertainty.

For temporary access, see the [free subscription page](/en/article/oh8wwokl/), with its limitations. For regular use, limit advance payment, choose a small monthly plan, and keep an independent non-expiring backup.

## Selection guide by need

| Need | Suggested starting point |
| --- | --- |
| Complete beginner | Clash Verge Rev + monthly subscription |
| Free iPhone client | Clash Mi + Clash subscription |
| Established iPhone client | Shadowrocket + compatible subscription |
| Android backup | Clash Meta for Android + V2RayNG |
| Windows protocol coverage | Clash Verge Rev + v2rayN |
| Newer protocol support | Hiddify or a sing-box client |
| Whole-home access | OpenClash or sing-box on a router |
| Reduce outage exposure | Primary provider + independent non-expiring backup |

The practical advice is to make one client work before installing five or six alternatives. Add a backup only after you understand subscription import, node testing, Rule Mode, and basic troubleshooting.

## Official downloads and documentation

Verify the project name, developer, and package before installing:

* Clash Verge Rev releases: <https://github.com/clash-verge-rev/clash-verge-rev/releases>
* v2rayN releases: <https://github.com/2dust/v2rayN/releases>
* v2rayNG releases: <https://github.com/2dust/v2rayNG/releases>
* Clash Meta for Android releases: <https://github.com/MetaCubeX/ClashMetaForAndroid/releases>
* Shadowrocket App Store listing: <https://apps.apple.com/us/app/shadowrocket/id932747118>
* Clash Mi website: <https://clashmi.app/>
* sing-box documentation: <https://sing-box.sagernet.org/>
* Hiddify releases: <https://github.com/hiddify/hiddify-app/releases>

## Summary

A sound 2026 approach is to choose a mature client for the device and pair it with a compatible, currently operating provider rather than chasing protocol names.

Clash Verge Rev is a practical desktop default, Clash Meta for Android is a common Android choice, and Clash Mi or Shadowrocket can serve iPhone users. Add Hiddify, sing-box, or v2rayN when the subscription format or protocol requires it. Route quality, peak-hour stability, subscription compatibility, and support responses remain the main determinants of the experience.

Continue with the relevant guide:

* [Computer Access Guide for Windows and macOS](/en/blog/how-to-vpn-on-computer/)
* [Mobile Access Guide for Android and iOS](/en/blog/how-to-vpn-on-mobile/)
* [2026 Proxy-Service Selection and Review Guide](/en/posts/vpn/)
* [How to Choose a Proxy Service in 2026](/en/article/choose-good-airport/)
