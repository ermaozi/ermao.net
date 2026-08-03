---
title: UUOne Review—CNY 12 for 150 GB and BGP Relay Plans
createTime: 2026/01/08 12:53:24
updateTime: 2026/02/24 10:00:00
permalink: /en/blog/uuone/
lang: en-US
translationOf: /blog/uuone/
tags:
  - proxy-service review
  - UUOne
  - BGP relay
  - budget proxy
  - non-expiring data
description: A dated UUOne review covering its CNY 12 monthly 150 GB tier, BGP relay claims, non-expiring package, coupon snapshot, service tests, and purchase limits.
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
            "name": "Does UUOne offer a free trial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source reported no free trial. Its recorded entry tier was CNY 12 per month for 150 GB, with code uuone advertised for 10% off. Verify the current checkout."
            }
          },
          {
            "@type": "Question",
            "name": "Does UUOne work with Netflix?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source test and provider materials report Netflix and Disney+ access on many nodes. Catalog region and availability can vary by node, IP, account, and time."
            }
          },
          {
            "@type": "Question",
            "name": "How does a BGP relay differ from an IPLC-labelled route?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A BGP relay normally uses selected public or hosted ingress paths, while an IPLC label is intended to describe private international transport. Neither label alone proves the actual route or its quality; verify with route evidence and local tests."
            }
          },
          {
            "@type": "Question",
            "name": "What should I do if UUOne nodes do not work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Confirm that the subscription refreshed, the plan has data, system time is correct, and local networking works. Then test another node and use the provider's verified ticket channel."
            }
          }
        ]
      }
---

UUOne's recorded entry plan costs CNY 12 per month for 150 GB. It markets BGP relay optimization for China Telecom, China Unicom, and China Mobile access networks, evening-peak capacity, and access to common streaming services.

- Website used by the source: [uuone.at](https://uuone.at/?code=AjqYdZlJ)
- A different display domain in the source: `uuone.de`
- Recorded code: `uuone`
- Stated discount: 10%

Verify the operator, current official domain, code, and final amount before payment.

<!-- more -->

## Overview

![UUOne logo and provider page =1280x1280](https://image.ermao.net/images/blog/uuone/image-1.png)

| Item | Source record |
| --- | --- |
| Lowest price | CNY 12/month for 150 GB |
| Route description | BGP relay optimized for three mainland access carriers |
| Service-access observation | Netflix, Disney+, HBO, and YouTube 4K were accessible in the source test |
| Client families | Clash, Shadowrocket, Stash, V2Ray-compatible clients, and Quantumult X |
| Support claim | Continuous online and ticket support |

The source describes good evening-peak behavior, but it does not provide a controlled multi-day dataset. A “no throttling” policy does not eliminate congestion, packet loss, or upstream limits.

## Recorded plans and coupon

| Plan | List price | Price after the recorded 10% code | Data | Source description |
| --- | ---: | ---: | ---: | --- |
| Lite | CNY 12/month | CNY 10.80 | 150 GB/month | Entry BGP relay tier |
| Pro | CNY 23/month | CNY 20.70 | 300 GB/month | Larger regular-use tier |
| Max | CNY 45/month | CNY 40.50 | 800 GB/month | Higher-data tier |
| Non-expiring | CNY 80 once | CNY 72 | 450 GB | One-time allowance advertised not to expire |

The source simultaneously says the lowest effective subscription is “about CNY 12” even though a 10% reduction from CNY 12 is CNY 10.80. Use the checkout total rather than the narrative.

“Non-expiring” refers to the recorded allowance rule; it does not guarantee provider, domain, account, or node lifetime.

## Provider-stated features

### BGP optimization

The provider says its relay selects ingress paths for the three major mainland access carriers. BGP can help route selection, but it is not equivalent to a private leased line and does not guarantee low latency. Test the actual path from the intended ISP.

### Streaming access

Provider materials and the source test report Netflix, Disney+, HBO Max, DAZN, TikTok, and 4K video access on selected nodes. “Native IP” and DNS-unlock labels need verification. A landing page is not proof of a full regional catalog.

### Support

The provider advertises continuous support and tickets. Submit a pre-purchase question and preserve the answer; do not trust an unsolicited support handle that cannot be verified in the authenticated dashboard.

## Client support

The source lists:

- iOS: Shadowrocket or Stash;
- Android: Clash Meta or v2rayNG;
- Windows: Clash Verge or v2rayN;
- macOS: Clash Verge or a compatible Clash client.

The provider dashboard reportedly offered one-click imports. Review the destination URL before allowing a deep link to open another application, and keep the subscription URL private.

## Archived evening-peak test

![UUOne evening-peak speed test =1280x668](https://image.ermao.net/images/blog/uuone/image.png)

The screenshot records one test state and does not prove that another subscriber can saturate a broadband line, play 4K without buffering, or reach the same service later.

## BGP relay versus IPLC

The source's original answer described IPLC as an internal line that “physically does not pass the firewall” and said UUOne's BGP experience was close to a dedicated line. That wording is too absolute.

- **BGP relay:** usually exposes a domestic or regional ingress and uses selected public or hosted routes toward an overseas egress.
- **IPLC-labelled service:** is intended to describe private international transport, but a retail provider's label is not proof of its contract or full path.

Neither name establishes latency, congestion, or blocking resistance. Use traceroute or MTR where visible, current IP/ASN data, peak-hour application tests, and provider evidence. See [How to Identify a Route Type](/en/article/r50bpg9j/).

## Frequently asked questions

### Is there a free trial?

The source reported none. Use the Lite monthly plan for the smallest recorded exposure and check the current refund policy before payment.

### Does it provide full Netflix access?

The source says many nodes reached non-original Netflix content and Disney+. Test the exact catalog region; platform classifications and node addresses change.

### What if no node works?

Refresh the subscription, confirm remaining data, synchronize system time, and test basic local connectivity. Try a different node and then submit a ticket through the verified provider dashboard.

## Before purchasing

- Resolve the `.at` versus `.de` domain references.
- Confirm the live price, allowance, reset, multiplier, device, and refund rules.
- Test the entry monthly tier on the actual ISP and during the evening peak.
- Check the exact streaming, work, or AI service required.
- Keep an independently operated backup.

## Client guides

| Platform | Guide |
| --- | --- |
| Android | [Clash Meta setup](/en/article/eh8f4n86/) |
| iOS | [Shadowrocket setup](/en/article/z747kgjd/) |
| Windows and macOS | [Clash Verge setup](/en/article/0gematwc/) |

Compare it in the [2026 proxy-service review list](/en/posts/vpn/) and [provider-selection guide](/en/article/choose-good-airport/).

::: info
This page is a dated technical and purchasing record. Follow the laws and service terms that apply to you.
:::
