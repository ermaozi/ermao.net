---
title: XXYUN Review—CNY 9.99 for 100 GB and BGP Relay Claims
createTime: 2025/10/13 01:15:58
updateTime: 2026/02/24 10:00:00
permalink: /en/blog/xxyun/
lang: en-US
translationOf: /blog/xxyun/
tags:
  - proxy-service review
  - XXYUN
  - BGP relay
  - budget proxy
  - streaming access
description: A dated XXYUN review covering its CNY 9.99 monthly 100 GB tier, non-expiring packages, BGP and service-access claims, coupon snapshot, and test limits.
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
            "name": "What was XXYUN's lowest recorded plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source recorded CNY 9.99 per month for 100 GB. It also recorded code xxyun for 5% off and one-time new-customer code xxyun85 for 15% off; verify both at checkout."
            }
          },
          {
            "@type": "Question",
            "name": "Does XXYUN offer refunds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source warns that virtual services are normally non-refundable. Read the current refund terms before payment and test the entry monthly plan first."
            }
          },
          {
            "@type": "Question",
            "name": "Can an XXYUN account be shared?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Provider information in the source says there is no device-count limit, but that does not necessarily permit sharing among unrelated users. Confirm simultaneous-session and fair-use rules."
            }
          },
          {
            "@type": "Question",
            "name": "What should I do when an XXYUN node is slow?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Refresh the subscription, test another node, confirm local connectivity and system time, and contact the provider through a verified support channel if the problem continues."
            }
          }
        ]
      }
---

XXYUN's recorded entry tier costs CNY 9.99 per month for 100 GB. Provider materials describe all-BGP relay, optimization for China Telecom, China Unicom, and China Mobile access networks, no evening-peak throttling, and access to major streaming and AI services.

- Recorded website: [xxyun.at](https://xxyun.at/?code=HOWnn58c)
- Another domain named in the source: `xxyun.de`
- Recorded codes: `xxyun` for 5% off; `xxyun85` for a one-time 15% new-customer discount

The domain difference and every code should be verified before entering credentials or paying.

<!-- more -->

## Overview

![XXYUN logo and account screen](https://image.ermao.net/images/blog/xxyun/image.png)

| Item | Source record |
| --- | --- |
| Lowest plan | CNY 9.99 for 100 GB/month |
| Coupons | `xxyun` for 5% off; `xxyun85` for 15% off once for a new customer |
| Route description | All-BGP relay and optimization for three mainland access carriers |
| Service-access claims | Netflix, Disney+, HBO, and ChatGPT |
| Protocol claims | Shadowsocks, V2Ray-compatible, and Trojan |
| Support claim | 24/7 online response |
| Operating-history claim | Approximately two years at the review date |

“BGP relay” describes routing architecture, not automatically a dedicated line. “No throttling” also does not prevent congestion or upstream capacity limits.

## Recorded plans

<AirportPlanTable airport-id="xxyun" />

The catalog includes:

- CNY 9.99/month for 100 GB;
- CNY 19.90/month for 300 GB;
- CNY 39.90/month for 1,000 GB;
- CNY 66.66 once for a 500 GB non-expiring allowance;
- CNY 199 once for a 2,888 GB non-expiring allowance.

“Non-expiring” applies to the recorded data-reset rule, not the lifetime of the service. Test a monthly tier before placing a large prepaid balance with one operator.

## Provider-stated strengths

- approximately two years of operation at the source date;
- BGP relay and access-carrier optimization;
- streaming and AI-service access;
- no evening-peak node speed cap;
- no device-count limit;
- continuous support.

These statements are not substitutes for current route evidence, provider status, or local testing. Absence of negative reports in a limited search is not proof of future solvency or service quality.

## Archived performance observation

![XXYUN speed-test screenshot](https://image.ermao.net/images/blog/xxyun/image-1.png)

The source records this environment:

- Guangdong China Telecom 300 Mbps broadband;
- evening peak around 20:00–21:00;
- download results of roughly 70–110 Mbps depending on node;
- approximately 25 ms to Hong Kong, 50–60 ms to Japan, and above 70 ms to Singapore;
- successful tests of Netflix, Disney+, YouTube 4K, and ChatGPT;
- a 24-hour run with no observed disconnect and a reported 99.7% online figure.

No raw logs or calculation method accompany the 99.7% figure, so it should not be interpreted as a service-level measurement. All results are specific to the source network and test window.

## Setup path

1. Verify the current operator and official domain.
2. Register and choose the smallest monthly tier.
3. Test a coupon at checkout and confirm the final amount.
4. Copy the subscription URL from the authenticated dashboard.
5. Import it into a trusted client.
6. Test the required nodes during and outside the evening peak.

Do not post the subscription URL publicly; it functions as an account credential.

## Use-case guidance

| Use case | Candidate region | What to verify |
| --- | --- | --- |
| Video | Hong Kong, Taiwan, or Japan | Exact catalog region, bitrate, seeking, and evening peak |
| AI services | United States or Singapore | Supported-country rules, login risk, and exact feature |
| Remote work | Hong Kong or Singapore | Calls, source-code downloads, and packet loss |
| Gaming | Japan or South Korea | UDP support, game route, NAT, and jitter |
| Social media | Region matching the account's legitimate use | IP stability and platform terms |

A region recommendation is only a starting point; physical distance and the local ISP determine the actual route.

## Frequently asked questions

### Are refunds available?

The source warns that used virtual services are normally non-refundable. Read the live refund policy before purchase and do not assume a screenshot overrides the current terms.

### Can several people share an account?

The provider description says the device count is unlimited. That may cover one user's devices and does not necessarily authorize sharing or resale. Confirm simultaneous-connection and fair-use rules.

### What if speed is poor?

Refresh the subscription, check the local connection, test a different node, verify system time, and compare the provider's status notice. Changing protocol is useful only when the subscription and client actually support the alternative.

## Before purchasing

- Confirm the live plan, traffic, multiplier, expiry, device, and refund terms.
- Verify the official domain because the source names both `.at` and `.de`.
- Test a monthly tier for several days.
- Retest streaming and AI services rather than relying on the archived screenshot.
- Keep an independently operated backup.

## Client guides

- [Clash Meta for Android](/en/article/eh8f4n86/)
- [Clash Verge for Windows, Linux, and macOS](/en/article/0gematwc/)
- [Shadowrocket for iPhone and iPad](/en/article/z747kgjd/)

Compare current entries in the [2026 proxy-service review list](/en/posts/vpn/) and [provider-selection guide](/en/article/choose-good-airport/).

::: info
This page is a dated technical and purchasing record. Follow the laws and service terms that apply to you.
:::
