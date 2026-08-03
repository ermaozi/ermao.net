---
title: Edge-X Review—IEPL Routes and 0.5x/0.2x Traffic Multipliers
description: An evidence-bounded Edge-X review covering its CNY 22.80 entry tier, IEPL and direct nodes, off-peak multipliers, conflicting data allowances, and purchase checks.
createTime: 2026/05/09 12:00:00
updateTime: 2026/05/09 12:00:00
permalink: /en/article/edge-x/
lang: en-US
translationOf: /article/edge-x/
tags:
  - proxy-service review
  - Edge-X
  - IEPL
  - traffic multiplier
  - budget proxy
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
            "name": "What is Edge-X's lowest recorded monthly price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The lowest published monthly tier in the source was CNY 22.80. Public materials disagreed on whether it included 100 GB or 200 GB, so verify the live checkout page."
            }
          },
          {
            "@type": "Question",
            "name": "How do Edge-X traffic multipliers work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The source says IEPL nodes deduct data at 1x normally and 0.5x from 02:00 to 10:00, while optimized direct nodes deduct at 0.2x all day. Confirm the current rules and time zone."
            }
          },
          {
            "@type": "Question",
            "name": "Does Edge-X support standard and overseas subscriptions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The provider information recorded by the source says it supports a standard subscription and a separate subscription intended for users outside mainland China."
            }
          },
          {
            "@type": "Question",
            "name": "Does Edge-X offer a non-expiring one-time data package?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No one-time non-expiring package was listed in the information available to the source."
            }
          }
        ]
      }
---

Edge-X is positioned as a moderately priced combination of IEPL routes and lower-multiplier direct nodes. Its published multiplier scheme may suit users who can schedule downloads or synchronization outside peak hours.

The main uncertainty is the entry tier: source materials showed both 100 GB and 200 GB for the same CNY 22.80 price. This page preserves that conflict instead of choosing one figure. The live checkout page is the only suitable source for the amount being purchased.

<!-- more -->

## Conclusion and limits

![Edge-X website and brand screen =640x640](https://image.ermao.net/images/article/edge-x/20260509_083554-1403ca.png)

Edge-X is a candidate for a small monthly test, not an evidence-free long commitment. Its useful characteristics are the advertised IEPL/direct mix, off-peak multiplier, and access-carrier optimization. Its public technical and plan information remains incomplete.

## Fact and claim table

| Item | Information recorded by the source |
| --- | --- |
| Provider | Edge-X |
| Website | [edge-x.net registration route](https://edge-invite.com/#/register?code=LCH9laOs) |
| Operating-history claim | One to two years |
| Route description | Primarily IEPL plus some optimized direct nodes |
| Access-network claim | Optimization for the three major mainland access carriers |
| Service-access claim | Mainstream streaming and AI services |
| Multiplier rule | IEPL 1x normally and 0.5x from 02:00–10:00; direct nodes 0.2x all day |
| Node speed cap | Provider says none |
| Standard subscription | Advertised as supported |
| Overseas-user subscription | Advertised as supported |
| Telegram channel | [EdgeX_Notice](https://t.me/EdgeX_Notice) |
| One-time package | None listed |

The route, optimization, service access, and cap entries are provider information. Verify them from the intended access network.

## Plan guidance

Begin with the lowest tier and observe one or two weeks before upgrading.

| Tier | Recorded price and data | Possible use | Purchase |
| --- | --- | --- | --- |
| Entry | CNY 22.80/month; source conflict of 100 GB versus 200 GB | A low-exposure local test | [Check current checkout](https://edge-invite.com/#/register?code=LCH9laOs) |
| Intermediate | CNY 34.80/month, 300 GB | Regular video and AI use | [Check current checkout](https://edge-invite.com/#/register?code=LCH9laOs) |
| Higher-data | CNY 64.80/month, 600 GB | Several devices or moderately heavy use | [Check current checkout](https://edge-invite.com/#/register?code=LCH9laOs) |

Confirm the data allowance, renewal date, multiplier time zone, eligible nodes, and refund rules before payment.

## Speed and stability evidence

![Edge-X speed-test screenshot =3980x3946](https://image.ermao.net/images/article/edge-x/20260509_083605-ac9b00.png)

The screenshot and published parameters support testable hypotheses, not universal conclusions:

1. Use an IEPL-labelled node as the candidate primary route and verify that it performs consistently.
2. Schedule large, delay-tolerant transfers during the stated 02:00–10:00 0.5x period after confirming the time zone.
3. Treat a 0.2x direct node as a lower-data-cost alternative whose performance may depend more heavily on the local ISP.

A traffic multiplier controls how much allowance is deducted; it does not prove route quality. A speed-test screenshot represents one server, network, node, and time.

## Streaming and AI-service limits

The provider information says Edge-X supports mainstream streaming and AI services. A successful landing page does not prove every catalog region, feature, or account operation works. Test the exact service and region both during and outside the evening peak.

## Who should avoid it?

- Anyone seeking a one-time non-expiring package;
- anyone unwilling to resolve the entry-plan allowance conflict at checkout;
- a heavy downloader expecting one inexpensive line to provide guaranteed capacity;
- a work or account-operation use case without an independent backup.

## Purchase and configuration path

1. Open the [recorded registration route](https://edge-invite.com/#/register?code=LCH9laOs) and verify the current domain and operator.
2. Select the CNY 22.80 monthly tier only after confirming its allowance.
3. Copy the subscription URL from the authenticated dashboard and keep it private.
4. Import it into a trusted client.
5. Test required nodes at several times of day.
6. Upgrade only when measured traffic and stability justify it.

## Client guides

| Platform | Client | Guide |
| --- | --- | --- |
| Android | Clash Meta or v2rayNG | [Android Clash guide](/en/article/eh8f4n86/) |
| iOS | Shadowrocket | [Shadowrocket guide](/en/article/z747kgjd/) |
| Windows | Clash Verge Rev | [Windows guide](/en/article/0gematwc/) |
| macOS | Clash Verge Rev or compatible client | [macOS Clash Verge Rev guide](/en/article/6vxkmmuh/) |

## Frequently asked questions

### Can a beginner use Edge-X?

The plan structure is approachable for someone who understands data multipliers. Begin with the smallest tier and test the relevant nodes rather than assuming an IEPL label makes every node stable.

### Which tier is reasonable?

Use CNY 22.80 for an initial test. The CNY 34.80 tier can be more rational than immediately buying 600 GB when normal use is browsing, video, and AI services.

### What must be confirmed before checkout?

Resolve the 100 GB versus 200 GB conflict, then confirm which nodes and time zone receive the 0.5x and 0.2x rates.

## Summary

Edge-X's practical proposition is a primary dedicated-route label paired with lower-multiplier alternatives. It belongs on a test list when that billing design matches the workload, but the entry-plan conflict and incomplete public evidence argue for a small monthly purchase and an independent backup.

See the [2026 proxy-service review list](/en/posts/vpn/) and [provider-selection guide](/en/article/choose-good-airport/) for comparisons.
