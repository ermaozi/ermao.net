---
title: Is Buying or Using a VPN Legal in Mainland China?
createTime: 2025/10/11 00:57:41
permalink: /en/blog/vpnhefa/
lang: en-US
translationOf: /blog/vpnhefa/
description: A cautious overview of mainland China rules on international network channels, unauthorized VPN businesses, enterprise leased lines, individual use, and legal uncertainty.
tags:
  - VPN
  - mainland China law
  - telecommunications regulation
  - compliance
  - legal risk
---

There is no reliable basis for the blanket claim that “building or selling a VPN is illegal, but an individual buyer is always legal.” Mainland China's current international-networking regulation addresses both establishing **and using** unauthorized channels, while separate telecommunications rules and enforcement documents focus heavily on unlicensed cross-border business activity.

Whether a particular service, connection, or person violates a rule depends on facts, location, purpose, authorization, and current enforcement. This page provides general information, not legal advice.

<!-- more -->

::: danger Do not rely on an “ordinary users are exempt” slogan
The regulation discussed below does not contain a general personal-use exception. The absence of a commercial resale operation may change the applicable facts and enforcement exposure, but it does not by itself prove that a connection is authorized.
:::

## First distinguish four different situations

The word “VPN” can describe technically and legally different services:

1. an encrypted tunnel inside a company or home network that does not provide an alternative international channel;
2. a cross-border office connection leased from an authorized telecommunications operator;
3. an unlicensed operator selling access to a cross-border proxy or VPN service;
4. an individual using a third-party service to reach the international Internet.

A rule aimed at international channels or telecommunications business cannot be applied accurately from the product label alone. The route, provider authorization, and use matter.

## The current international-networking regulation

The official [National Administrative Regulations Database](https://xzfg.moj.gov.cn/SearchTitleFront?QueryAll=%E8%AE%A1%E7%AE%97%E6%9C%AF%E6%9C%BA%E4%BF%A1%E6%81%AF%E7%BD%91%E7%BB%9C%E5%9B%BD%E9%99%85%E8%81%94%E7%BD%91%E7%AE%A1%E7%90%86%E6%9A%82%E8%A1%8C%E8%A7%84%E5%AE%9AZVING1) lists the 2024 revision of the *Interim Provisions of the People's Republic of China on the Administration of International Networking of Computer Information Networks*, effective May 1, 2024.

### Article 6

Article 6 requires direct international networking to use international gateway channels supplied through the state public telecommunications network. It also states that entities and individuals must not independently establish **or use** other channels for international networking.

The words “or use” are important. The text is broader than only constructing infrastructure or operating a paid service, so this provision should not be summarized as a construction-only ban.

### Article 14

Article 14 provides an administrative enforcement mechanism for violations of Articles 6, 8, and 10. It authorizes public-security organs to order disconnection, issue a warning, impose a fine of up to CNY 15,000, and confiscate unlawful income where present.

That provision does not mean every technical VPN connection automatically receives the maximum sanction. It does mean that “personal purchase can never be an administrative violation” is too strong.

### Article 13 and other laws

Article 13 separately requires international-network users to comply with other laws and prohibits specified unlawful activity. Fraud, unauthorized intrusion, unlawful data handling, dissemination offenses, and other conduct can create distinct administrative or criminal exposure regardless of the networking tool used.

## The 2017 MIIT notice focuses on cross-border business

The Ministry of Industry and Information Technology's [2017 network-access market notice](https://www.miit.gov.cn/zwgk/zcwj/wjfb/tz/art/2017/art_a940645e940946e1a62cd6c90a4e994e.html) addressed licensing, unauthorized IDC/ISP/CDN activity, resale of network resources, and cross-border telecommunications business.

For cross-border activity, the notice says a party may not establish or lease a dedicated line, including a VPN, without approval to conduct cross-border **business operations**.

MIIT's official [question-and-answer explanation](https://www.miit.gov.cn/zwgk/zcjd/art/2020/art_6d942fea3c824343bdd1e01f2d6e12af.html) clarifies two points:

- the provision targets entities or individuals without the required telecommunications authorization who use leased lines or VPNs to conduct cross-border telecommunications business;
- foreign-trade and multinational companies needing cross-border connectivity for internal office use can lease a line from a telecommunications operator legally authorized to provide the international gateway.

This clarification is useful for business licensing, but it does not repeal or create a personal-use exception to Article 6 of the separate State Council regulation.

## Practical risk by scenario

| Scenario | Main issue | Cautious conclusion |
| --- | --- | --- |
| Selling access to an unauthorized cross-border service | Unlicensed telecommunications business, unauthorized resources, income, scale, and other facts | High regulatory risk; serious cases may implicate additional laws |
| Sharing or reselling paid accounts | Can turn personal access into supply or business activity | Do not assume a personal-use argument still applies |
| Company self-building or buying a cross-border line | Provider qualification, approval, contract, and permitted internal-office purpose | Use an authorized operator and obtain fact-specific compliance review |
| Individual buying and using an overseas proxy or VPN | Article 6 channel restriction, service authorization, purpose, and local enforcement | No blanket safe conclusion; risk is not eliminated by “no profit” |
| Using any network to commit another offense | The elements of the underlying conduct | The tool does not shield the user from separate liability |
| Domestic VPN that does not create an alternative international channel | Different technical and factual category | Do not infer illegality solely from the word VPN |

## Why enforcement reports must be read carefully

A news headline saying someone was “punished for a VPN” may involve facts omitted from the headline:

- building servers or nodes;
- collecting subscription fees;
- reselling access;
- supplying telecommunications service to others;
- unlawful income and operating scale;
- another underlying offense.

Conversely, a lack of a reported case about an ordinary buyer does not establish a legal exemption. Public case databases and media reports are incomplete, enforcement can vary, and an administrative action is not always published.

Do not cite an unattributed hypothetical case as evidence. The earlier Chinese version listed three generic “case” summaries without verifiable decisions or official links; this English version therefore does not present them as documented cases.

## Enterprise compliance

An organization needing stable cross-border office connectivity should:

1. define whether the connection is internal office use or part of a service offered to customers;
2. obtain the service from an operator authorized to provide the relevant international telecommunications channel;
3. verify the provider's current license, service scope, contract entity, and permitted use;
4. document data-security, cybersecurity, personal-information, export-control, and sector-specific requirements separately;
5. obtain advice from qualified mainland China counsel for the actual architecture.

A provider calling a product “enterprise VPN,” “IPLC,” “IEPL,” or “dedicated line” is not proof of regulatory authorization.

## Guidance for individuals

- Do not sell, share for payment, or operate access for others.
- Do not treat a foreign website, app-store listing, or cryptocurrency checkout as evidence that a provider is authorized in mainland China.
- Do not use a network tool for fraud, intrusion, unlawful distribution, or another prohibited activity.
- If the legal status matters to work, study, travel, or an investigation, ask a qualified lawyer about the exact facts and current local practice.
- For an official administrative interpretation, contact the competent public-security or telecommunications authority; a blog cannot bind an agency or court.

## Frequently asked questions

### Is buying a VPN different from using it?

Yes as a matter of facts: a purchase, installation, connection, resale, and underlying activity are separate acts. But Article 6 expressly addresses using an unauthorized international channel, so “I only bought it for myself” is not a complete legal analysis.

### Does personal, noncommercial use guarantee no penalty?

No public official source identified for this article provides that guarantee. Lack of profit can distinguish an individual from an unlicensed operator and can be relevant to the case, but it is not a written personal-use exception in Article 6.

### Can a company provide employees with a cross-border VPN?

Potentially, when the company obtains an appropriate service from an authorized telecommunications operator and uses it within the permitted internal-office scope. The provider, route, contract, business purpose, and other regulatory duties need review.

### How can I determine whether a provider is compliant?

Ask for the legal entity, telecommunications license, licensed service category and geographic scope, international-channel authorization, contracting operator, and permitted use. Verify them through the relevant official licensing or regulatory channel. A registration page or marketing claim is insufficient.

## Summary

- Unauthorized construction and sale of cross-border access carry clear regulatory risk.
- The 2017 MIIT notice and its official explanation concentrate on unauthorized cross-border telecommunications business and provide a route for enterprise internal-office lines through authorized operators.
- The current State Council regulation also prohibits entities and individuals from using other channels for direct international networking; it does not state a blanket personal-use exception.
- Another unlawful act remains unlawful regardless of whether a VPN is involved.
- Legal advice must be based on the exact service, route, authorization, purpose, location, and current enforcement practice.

This page was checked against the official sources linked above on July 31, 2026. It is an informational summary, not a legal opinion or a prediction of enforcement.
