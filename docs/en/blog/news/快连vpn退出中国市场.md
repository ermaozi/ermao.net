---
title: LetsVPN Announced the End of Its Mainland China Business
createTime: '2026/04/29 06:31:14'
permalink: /en/blog/j0qbrzgj/
lang: en-US
translationOf: /blog/j0qbrzgj/
description: A dated record of LetsVPN's April 2026 mainland China exit announcement, its stated refund plan, evidence limits, migration steps, and provider-risk lessons.
tags:
  - LetsVPN
  - VPN
  - service closure
  - refunds
  - provider risk
---

On April 29, 2026, the Chinese source recorded an in-app notice from LetsVPN, also known as Kuailian, saying it would terminate operations directed at mainland China.

The notice said:

- connection problems had continued despite nearly hourly adjustments over 20 days;
- refund calculations would begin from April 8 regardless of recent data use;
- mainland payment channels had closed but refunds would continue;
- an automated refund system was being developed;
- the operator could no longer sustain this line of business.

This article records that announcement. It cannot confirm every refund outcome or infer the exact blocking mechanism from the notice alone.

<!-- more -->

![LetsVPN mainland business-closure notice](https://image.ermao.net/images/blog/j0qbrzgj/20260429_063117-00f104.png)

## Closure rather than maintenance

The wording describes termination of the mainland-facing business, not a short maintenance window. A user should therefore preserve data and arrange an alternative rather than assuming the old service will return.

This does not necessarily mean the entire company or every service worldwide closed. The scope in the archived notice is mainland China.

## Refund statements

![Additional LetsVPN notice screenshot](https://image.ermao.net/images/blog/j0qbrzgj/20260429_063306-b464a4.png)

The notice promises refunds calculated from April 8 and says an automated process was under development. The source also includes a user report of waiting more than ten business days:

![User report of a LetsVPN refund delay](https://image.ermao.net/images/blog/j0qbrzgj/20260429_065751-5aca7c.png)

One report does not establish the general processing time. Affected users should:

1. submit through the authenticated application or official support channel;
2. preserve the order, payment receipt, plan term, balance, request ID, and screenshots;
3. record the published calculation method and date;
4. avoid impostor support accounts and never disclose one-time codes;
5. use the payment provider's dispute process only within its rules and deadlines.

## What the notice does and does not reveal

The Chinese commentary concludes that a fixed protocol fingerprint was precisely identified. The announcement itself says only that connection issues could not be solved after frequent adjustments.

Possible causes can include IP blocking, active probing, traffic classification, distribution-channel restrictions, capacity, cost, compliance, or a combination. Without packet captures, server telemetry, architecture, and operator evidence, a specific technical cause is inference.

The same applies to claims that one-click VPN traffic is “naked” or uniquely traceable. An encrypted tunnel is not plaintext, but metadata, endpoints, protocol fingerprints, accounts, devices, and payments can still expose information. Risk cannot be ranked from product category alone.

## Alleged enforcement screenshots

The source includes:

- a screenshot said to concern a CNY 300 administrative penalty after LetsVPN use;
- a screenshot said to concern a CNY 500 penalty in Dalian after use of a different “Kuaimiao VPN” to access Telegram.

![Screenshot described as a CNY 300 LetsVPN-related penalty](https://image.ermao.net/images/blog/j0qbrzgj/20260429_065528-a22ac3.png)

![Screenshot described as a CNY 500 Kuaimiao VPN-related penalty](https://image.ermao.net/images/blog/j0qbrzgj/20260429_070034-44258b.png)

The article provides no primary decision documents, issuing authority links, case numbers, or authentication chain. These screenshots must not be treated as verified legal precedents. Legal rules and enforcement depend on jurisdiction and facts; obtain qualified local advice.

## Why a large one-click service can struggle

The source identifies two broad risks:

### Fixed architecture and concentration

A large service can concentrate users on recognizable endpoints, distribution channels, and update infrastructure. Blocking one shared dependency may affect many users. A proprietary client can also slow independent migration if the operator does not export compatible profiles.

This does not mean every one-click product uses an old or fixed protocol, or that a retail subscription is automatically more resilient.

### Counterparty and continuity risk

An operator may decide that engineering, resource, refund, or compliance costs exceed the value of continuing. The same risk exists for subscription providers, including small ones that can exit without an orderly refund.

The April disruption context is covered in [April 2026 Proxy-Service Outages](/en/blog/april-airport-outage-2026/).

## Choosing an alternative

Do not migrate on the assumption that a Clash-compatible subscription is inherently safer, more private, or harder to block.

Evaluate:

- legal and organizational authorization;
- operator identity and billing entity;
- current client and protocol support;
- reproducible performance on the intended network;
- refund and short-term billing;
- software release provenance;
- password, subscription, DNS, and IPv6 handling;
- operational independence of the backup.

Use the [proxy-service review index](/en/posts/vpn/) as a dated starting point, not a guarantee. Prefer monthly billing and keep two genuinely independent access paths for important work.

## Summary

The LetsVPN notice described a mainland business exit and a promised refund process beginning from April 8. Users should submit and document refund requests, move critical workflows, and avoid large prepayments to an untested replacement.

The event demonstrates concentration and counterparty risk; it does not prove that one protocol category is universally obsolete or that another is inherently safe.

::: warning Evidence and legal note
This page is based on the archived in-app notice and user screenshots in the Chinese source. Technical-cause and enforcement claims are bounded to the available evidence and are not legal advice.
:::
