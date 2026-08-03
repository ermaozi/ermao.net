---
title: XSUS Review—CNY 10 for 168 GB and Non-Expiring Data Packages
createTime: 2026/01/29 14:23:34
updateTime: 2026/02/24 10:00:00
permalink: /en/blog/xsus/
lang: en-US
translationOf: /blog/xsus/
tags:
  - proxy-service review
  - XSUS
  - BGP relay
  - non-expiring data
  - budget proxy
description: A dated XSUS review covering its CNY 10 monthly 168 GB tier, four non-expiring packages, BGP and peak-hour claims, plan reset rules, and test limits.
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who might consider XSUS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Its low-cost monthly tier and non-expiring packages may suit someone testing evening-peak performance or keeping a backup. Stability and service access must be verified on the user's own network."
            }
          },
          {
            "@type": "Question",
            "name": "What happens when an XSUS monthly allowance is exhausted?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source says to wait for the monthly reset, purchase the applicable reset option, or upgrade. Non-expiring packages are a separate product whose balance is advertised to last until used."
            }
          },
          {
            "@type": "Question",
            "name": "Does XSUS require annual billing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The source lists monthly plans beginning at CNY 10 for 168 GB, plus one-time data packages."
            }
          },
          {
            "@type": "Question",
            "name": "How can an XSUS user contact support?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source lists online support, a ticket system, and Telegram handle @Misaka_Yuki. Verify any handle from the authenticated provider dashboard."
            }
          }
        ]
      }
---

XSUS markets BGP ingress optimization for China Telecom, China Unicom, and China Mobile, with special attention to the 20:00–24:00 evening peak. The source records a CNY 10 monthly 168 GB entry tier and four one-time data packages advertised not to expire.

- Website: [xsus.cloud](https://xsus.cloud/register?code=xJFcT1Dw)
- Route claim: BGP ingress optimization and provider-controlled cabinet resources
- Service-access claims: Netflix, Disney+, HBO, TikTok, and YouTube
- Support recorded by the source: online chat, tickets, and `@Misaka_Yuki`

Those network, capacity, service-access, and support descriptions require current local verification.

<!-- more -->

## Overview

![XSUS logo and dashboard =256x256](https://image.ermao.net/images/blog/xsus/20260129_162650-08b59d.png)

| Item | Source record |
| --- | --- |
| Lowest plan | CNY 10/month for 168 GB |
| Route description | BGP ingress optimization for three mainland access carriers |
| Infrastructure claim | Provider-controlled cabinet resources |
| Package types | Monthly and non-expiring one-time allowances |
| Device claim | Most plans advertised without a device-count limit |
| Service access | Netflix, Disney+, HBO, TikTok, and YouTube |

The site's ranking dataset may be updated independently from this February 2026 article, so confirm the current entry price in the live checkout.

## Recorded plans

<AirportPlanTable airport-id="xsus" />

### Monthly tiers

| Plan | Price | Data | Provider-stated bandwidth | Other recorded terms |
| --- | ---: | ---: | ---: | --- |
| P-Small Basic | CNY 10/month | 168 GB | 500 Mbps | Personal use, no device-count limit, Netflix/Disney access claim |
| P-Plus Advanced | CNY 20/month | 336 GB | 1 Gbps | Personal use, no device-count limit, Netflix/Disney access claim |
| P-Max Professional | CNY 24/month | 420 GB | 1 Gbps | Personal or small group, no device-count limit |
| P-Ultra | CNY 58/month | 1,024 GB | 5 Gbps burst | Small-group use |

The bandwidth figures are plan labels, not a promise that one subscriber can sustain that throughput from every ISP or node.

### One-time packages

| Package | Price | Data | Recorded expiry rule |
| --- | ---: | ---: | --- |
| 188 GB | CNY 65 | 188 GB | No time limit; valid until used |
| 240 GB | CNY 82 | 240 GB | No time limit; valid until used |
| 400 GB | CNY 122 | 400 GB | No time limit; valid until used |
| 1,024 GB | CNY 260 | 1,024 GB | No time limit; valid until used |

“No time limit” does not guarantee the lifetime of the operator, domain, account, or nodes. Avoid a large prepaid balance until the service has been tested.

### Reset rules recorded by the source

- unused monthly data does not carry forward;
- renewal extends time but does not immediately reset the allowance;
- repeated purchase of a one-time package does not stack and instead resets according to the newly purchased package.

These details materially affect value. Confirm them at checkout and in the current terms.

## Speed and stability evidence

![XSUS speed-test screenshot =695x1280](https://image.ermao.net/images/blog/xsus/20260129_162438-1da0b7.png)

The provider emphasizes consistent real use over isolated speed-test screenshots and advertises evening-peak optimization. The source describes smooth browsing, video, and remote work, but it does not provide raw multi-day latency, loss, or uptime logs.

Test:

1. the same node during and outside 20:00–24:00;
2. destination loss and jitter, not only throughput;
3. several access-carrier paths where relevant;
4. recovery after a node or subscription update.

## Streaming-service claims

The provider describes native IP and smart-DNS techniques and claims access to Netflix, Disney+, HBO, TikTok, and YouTube without repeated node changes.

“Native IP” is not a standardized quality guarantee, and a platform can reclassify an address. Test the exact regional catalog, AI feature, or TikTok workflow needed. Valuable creator or business accounts require stable sign-in behavior and an independent backup.

## Setup

1. Verify the current XSUS domain and operator.
2. Choose the entry monthly tier or the smallest one-time allowance.
3. Copy the subscription URL from the authenticated dashboard.
4. Import it into a trusted client.
5. Test required nodes at several times of day.

The one-click subscription link is a credential; do not share it publicly.

## Frequently asked questions

### Who might consider XSUS?

Someone looking for a low-cost monthly test, an occasional non-expiring backup, or an alternative route during the evening peak. The provider's stability slogan is not evidence until reproduced locally.

### What happens when monthly data is exhausted?

Wait for the scheduled reset, use the current paid-reset option if available, or upgrade. Check whether renewal changes only the expiration date.

### Is annual payment required?

No annual requirement appears in the source; monthly tiers are listed.

### How is support reached?

The source lists online support, tickets, and Telegram handle `@Misaka_Yuki`. Verify the handle through the authenticated dashboard before sending account information.

## Before purchasing

- Confirm the live price, traffic, reset, multiplier, device, and refund rules.
- Treat bandwidth and service-access entries as claims to test.
- Begin with a small monthly tier or allowance.
- Test the actual evening peak and required services.
- Keep an independently operated backup.

## Client guides

| Platform | Guide |
| --- | --- |
| Android | [Clash Meta setup](/en/article/eh8f4n86/) |
| iOS | [Shadowrocket setup](/en/article/z747kgjd/) |
| Windows and macOS | [Clash Verge setup](/en/article/0gematwc/) |

Compare it in the [2026 proxy-service review list](/en/posts/vpn/) and [provider-selection guide](/en/article/choose-good-airport/).
