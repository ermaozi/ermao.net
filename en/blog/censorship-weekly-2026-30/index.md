---
url: /en/blog/censorship-weekly-2026-30/index.md
description: >-
  A verified July 14–20 digest on the UK's child-safety proposal, US sanctions
  on 1VPNS and possible Telegram spillover, and Apple and Google access
  anomalies in Russia.
---
This issue covers **July 14–20, 2026**. The UK proposed requiring social platforms to prevent under-16 users from evading restrictions through VPNs, but did not announce a general VPN ban. The United States sanctioned 1VPNS, followed by reports of collateral problems with Telegram short links. Several Russian regions reported connection anomalies affecting Apple, Google, and other foreign services.

## Key points

| Event | Confirmed fact | What an ordinary user should know |
| --- | --- | --- |
| UK child online-safety policy | Government proposal puts responsibility on platforms to stop under-16 users from using VPNs to evade restrictions; no general VPN prohibition was announced | Do not turn a platform obligation into a claim that ordinary VPN use is banned |
| US sanctions on 1VPNS | US Treasury listed First VPN Service and its manager | Sanctions can spill into domains, IP addresses, hosting, payments, and automated filters |
| Foreign-service anomalies in Russia | Several measurement and media sources recorded problems with Apple, Google, and other services | One event is not enough to call a permanent nationwide block |

## The UK did not announce a general VPN restriction

The UK government published results from its consultation on protecting children online and planned restrictions on some social-media use by people under 16. Whether VPNs would be restricted alongside those rules became a major point of debate.

At the cutoff, the government had not announced a general VPN ban.

* The July 15 [evidence and methodology summary](https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation/outcome/summary-of-evidence-methodology-and-organisations-who-responded-to-the-consultation-july-2026) recorded little direct support for banning children's VPN use and objections centered on privacy, surveillance, business use, and collateral effects.
* The [consultation outcome page](https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation), updated July 17, proposed that social-media companies identify and prevent under-16 users from using VPNs to enter their services.
* The [official fact sheet](https://www.gov.uk/government/publications/fact-sheet-new-rules-to-protect-children-online/fact-sheet-new-rules-to-protect-children-online) confirmed the under-16 social-media proposal but did not introduce a general-user VPN ban.

The accurate boundary is: the UK was advancing an age restriction for social media and placing circumvention-detection responsibility on platforms, while not announcing a broad VPN restriction. Required detection measures, appeals, and final statutory language remained unknown.

Ordinary users did not need to switch services because of a headline saying “UK bans VPNs.” More relevant questions were whether platforms would identify age-check circumvention and how much identity-document or facial data an age-assurance system would process.

## 1VPNS sanctions and reported Telegram spillover

On July 13, the US Treasury's Office of Foreign Assets Control sanctioned First VPN Service, or 1VPNS, and manager Dmytro Rashevskyi. Although the announcement preceded the statistical window by one day, reported network effects continued during the week.

The [Treasury announcement](https://home.treasury.gov/news/press-releases/sb0559) says customers included ransomware groups and other cybercriminals and that the infrastructure helped hide attack origins, deploy malware, and manage stolen data. It also recognizes legitimate privacy and security uses for VPN technology. The designation targeted the named service and manager, not VPN technology or ordinary users as a category.

Media later reported that Telegram's `t.me` short-link domain was temporarily inaccessible on some networks and connected the anomaly with sanctions lists and automated filtering. [Meduza](https://meduza.io/en/news/2026/07/14/u-s-treasury-sanctions-on-a-vpn-service-knocked-out-telegram-s-short-link-domain-worldwide) documented the timing. Telegram had not published a complete technical postmortem, so the exact claim that sanctions directly caused a worldwide short-link failure remained a media attribution.

The lesson is not that Telegram was sanctioned. Sanctions data, shared IP space, DNS, hosting policies, and automated risk controls can create collateral effects. If a familiar domain suddenly fails:

* compare official status and several networks;
* inspect DNS resolution;
* avoid assuming permanent blocking;
* do not install an unknown “fixed” client.

## Apple and Google access anomalies in Russia

Around July 16, users in several Russian regions reported unreliable access to Apple, Google, GitHub, and other foreign services. Some recovered after using a foreign network exit.

[TechRadar](https://www.techradar.com/vpn/vpn-privacy-security/russians-need-a-vpn-to-access-google-and-apple-as-unexplained-nationwide-outages-hit) cited local measurement services Detector404 and Sboy.rf and described especially visible Apple failures. A July 20 [Meduza report](https://meduza.io/en/feature/2026/07/20/roskomnadzor-says-it-isn-t-blocking-the-app-store-but-russia-s-outage-started-the-day-after-its-ultimatum-to-apple-expired) cited OONI measurements showing more connection anomalies for Apple resources from July 16 and varying effects on the App Store, Apple websites, and Google Play.

Multiple regions and sources observed anomalies. Public evidence was insufficient to establish one mechanism or a permanent block. Network failure, operator configuration, and intervention can produce similar symptoms.

Watch whether cross-network measurements persist, whether carriers exhibit the same failure signature, and whether regulators or service operators provide an explanation.

Users relying on App Store, Google Play, or GitHub for updates should preserve authentic download sources and verify signatures or hashes. Do not move to modified applications from unknown file-sharing sites during an outage.

## Tool and security updates

The issue verified Mihomo stable release `v1.19.29` in the window. No major new stable sing-box release was found.

| Item | Verified result | Action |
| --- | --- | --- |
| Mihomo | [v1.19.29](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.29) on July 18, including AnyTLS, OpenVPN, and other changes | Read release notes, back up, and download only from the official release |
| sing-box | No major stable release in the window | Read migration notes and keep a rollback config |
| Telegram | `t.me` anomaly reports, no complete public postmortem | Do not reinstall through an unknown mirror |

## Practical actions

1. **Separate platform duties from user prohibitions.** Read the government's publication date, scope, and effective status.
2. **Use several incident signals.** Compare the status page, trusted measurements, operators, and DNS. One screenshot does not prove a nationwide block.
3. **Prioritize supply-chain integrity.** Outages create opportunities for fake clients and updates. Use the official project release and verify artifacts.
4. **Do not treat a VPN as a complete security system.** It cannot replace endpoint updates, multifactor authentication, password management, or malware defense. See [Proxies, Clash, and VPNs](/en/article/fanqiang2/).

## Next week

* any clearer UK research or final statutory language on VPN circumvention;
* a Telegram or network-provider explanation for the `t.me` incident;
* whether OONI measurements of Apple and Google anomalies persist or diverge by carrier;
* further 1VPNS spillover into shared hosting or DNS.

## Sources

1. [UK consultation evidence summary](https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation/outcome/summary-of-evidence-methodology-and-organisations-who-responded-to-the-consultation-july-2026)
2. [UK child online-safety fact sheet](https://www.gov.uk/government/publications/fact-sheet-new-rules-to-protect-children-online/fact-sheet-new-rules-to-protect-children-online)
3. [UK consultation result](https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation)
4. [US Treasury designation](https://home.treasury.gov/news/press-releases/sb0559)
5. [Meduza on sanctions and Telegram links](https://meduza.io/en/news/2026/07/14/u-s-treasury-sanctions-on-a-vpn-service-knocked-out-telegram-s-short-link-domain-worldwide)
6. [TechRadar summary of Russia access anomalies](https://www.techradar.com/vpn/vpn-privacy-security/russians-need-a-vpn-to-access-google-and-apple-as-unexplained-nationwide-outages-hit)
7. [Meduza and OONI data](https://meduza.io/en/feature/2026/07/20/roskomnadzor-says-it-isn-t-blocking-the-app-store-but-russia-s-outage-started-the-day-after-its-ultimatum-to-apple-expired)
8. [Mihomo v1.19.29](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.29)

> This public-source digest is not legal advice and does not guarantee any service or software will remain available. Submit corrections through the [corrections page](/en/corrections/).
