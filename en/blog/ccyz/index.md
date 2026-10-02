---
url: /en/blog/ccyz/index.md
description: >-
  CCYZ plan prices, its BGP and IEPL claims, a documented traffic inconsistency,
  sample tests, setup steps, and checks before buying.
---
[CCYZ](https://xxyun.at/?code=HOWnn58c) advertises BGP transit plus IEPL routes, access to services such as Netflix, Disney+, and ChatGPT, 1GB of trial traffic, and a 5% coupon. Its lowest listed price is CNY 15 per month.

There is an important source inconsistency: the headline and introduction say the entry plan contains 100GB, but the plan table and structured FAQ say 150GB. This English version does not guess which is current; check the live checkout page.

Website: <https://xxyun.at/?code=HOWnn58c>

## Contents

* [Overview](#overview)
* [Plans and prices](#price)
* [Advertised advantages](#section-3)
* [Performance sample](#performance)
* [Client setup](#client)
* [Usage scenarios](#section-6)
* [Frequently asked questions](#faq)
* [Conclusion](#conclusion)

## Overview {#overview}

![CCYZ logo =927x375](https://image.ermao.net/images/blog/ccyz/image-1.png)

**[CCYZ](https://xxyun.at/?code=HOWnn58c)** promotes low-cost dedicated routes using BGP and IEPL, including evening-peak performance, streaming access, and round-the-clock support. These are provider claims except where a specific test environment is stated below.

### Key facts

| Item | Details |
| --- | --- |
| Website | [xxyun.at](https://xxyun.at/?code=HOWnn58c) |
| Cheapest subscription | CNY 15/month; quota conflicts between 100GB and 150GB in the source |
| Trial | 1GB advertised on registration |
| Coupon | `ccyz`, advertised as 5% off |
| Routes | BGP transit plus IEPL |
| Advertised access | Netflix, Disney+, HBO, and ChatGPT |
| Protocols | Shadowsocks, Trojan, and other common protocols |
| Support | Advertised as available 24/7 |

## Plans and prices {#price}

| Plan | Price | Monthly traffic | Peak bandwidth | Route | Suggested use | Link |
| --- | ---: | ---: | ---: | --- | --- | --- |
| Lite 150G | CNY 15/month | 150GB in the table | Depends on node | IEPL claim | Light use and a first test | [View plan](https://xxyun.at/?code=HOWnn58c) |
| Pro 280G | CNY 25/month | 280GB | Depends on node | IEPL claim | Regular or multi-device use | [View plan](https://xxyun.at/?code=HOWnn58c) |

The provider advertised 1GB of trial traffic and a 5% discount with coupon `ccyz`. Confirm that the trial, quota, and coupon are still shown on the final order screen.

## Advertised advantages {#section-3}

* **BGP plus IEPL:** promoted as a lower-latency, stable cross-border route.
* **Low entry price:** CNY 15 before any valid discount.
* **Peak-hour performance:** the provider says it does not reduce speeds during evening peaks.
* **Streaming tests:** Netflix, Disney+, and HBO were reachable in the stated test; results can change by node and platform policy.
* **Support:** advertised as continuously available.

## Performance sample {#performance}

![CCYZ speed-test sample =6306x2145](https://image.ermao.net/images/blog/ccyz/image.png)

* Test connection: China Telecom 200Mbps in Jiangsu
* Test time: 20:00–21:00 evening peak
* Download: 80–120Mbps depending on node
* Latency: 25–35ms to Hong Kong; 60–70ms to Singapore
* Observed in the sample: Netflix and Disney+ regional access, fast YouTube 4K startup, and usable ChatGPT responses

This is a short test from one connection, not a performance guarantee. Local routing, hardware, time, and node load all affect results.

## Client setup {#client}

1. Register through the [website](https://xxyun.at/?code=HOWnn58c) and complete any email verification.
2. Select Lite or Pro and enter `ccyz` at checkout if the coupon remains valid.
3. Copy the subscription for your supported client from the dashboard.
4. Import it into the client on your device.
5. Test several nodes and retain the best one for your connection.

Common choices include Clash for Android or v2rayNG on Android, Shadowrocket or Quantumult X on iOS, Clash Verge Rev or v2rayN on Windows, and Clash Verge Rev on macOS.

* [Android setup guide](/en/article/eh8f4n86/)
* [Windows setup guide](/en/article/0gematwc/)
* [Shadowrocket guide](/en/article/z747kgjd/)

## Usage scenarios {#section-6}

| Scenario | Nodes to test first | What to verify |
| --- | --- | --- |
| Streaming | Hong Kong, Taiwan, Japan | Resolution, startup time, and the exact catalog region |
| AI services | United States, Singapore | Account availability and response stability |
| Remote work | Hong Kong, Singapore | SaaS access and video-call stability |
| Gaming | Japan, South Korea | Latency, jitter, and packet loss |
| Social and news | Hong Kong, Taiwan | Sustained browsing rather than a one-time connection |

These are starting points, not guaranteed best routes.

## Frequently asked questions {#faq}

### Does CCYZ support refunds?

The source describes used virtual-service plans as generally non-refundable. Read the current terms and use the trial or smallest plan first.

### Can several people share an account?

No device limit was stated in the source material, but the provider recommends personal or household use. Confirm simultaneous-connection and fair-use rules.

### What if performance is poor?

Try another node or protocol. If the issue continues, contact the provider's support channel.

## Before you order {#risks}

* Resolve the 100GB-versus-150GB entry-plan conflict on the checkout page.
* Recheck the coupon, traffic multiplier, device count, reset date, and refund terms.
* Test evening peaks, ChatGPT, streaming, and your usual regions on a small monthly plan.
* Keep a backup service for work, livestreaming, commerce, or account operations.

## Conclusion {#conclusion}

CCYZ has a low CNY 15 entry price, advertised trial traffic, a listed 5% coupon, and BGP/IEPL marketing. The unresolved entry-quota conflict means buyers should not rely on the headline alone. It is best treated as a low-cost test candidate.

[Open the CCYZ website](https://xxyun.at/?code=HOWnn58c)

### More proxy reviews

* [2026 proxy-service recommendations](/en/posts/vpn/)
* [Popular budget proxy services](/en/airport/)

::: info Disclaimer
This article is for technical information. Follow the laws and rules that apply where you live and use network services responsibly.
:::

## Client guides {#client-usage}

| Platform | Suggested client | Guide |
| --- | --- | --- |
| Android | Clash for Android | [Android guide](/en/article/eh8f4n86/) |
| iOS | Shadowrocket | [Shadowrocket guide](/en/article/z747kgjd/) |
| Windows | Clash Verge Rev | [Windows guide](/en/article/0gematwc/) |
| macOS | Clash Verge Rev | [macOS guide](/en/article/6vxkmmuh/) |
