---
title: Stash for Mac Accused of Copying Open-Source Implementations
createTime: '2025/07/05 10:18:57'
permalink: /en/news/kne6vczb/
lang: en-US
translationOf: /news/kne6vczb/
tags:
  - Stash for Mac
  - open source
  - GPL
  - AGPL
  - software licensing
description: A dated, allegation-bounded record of claims that Stash for Mac incorporated code or structures from sing-box, shadowsocks-go, tun2socket, and netstack-lwip.
---

An anonymous community submission and a public post accused the Stash for Mac client of incorporating code or binary structures from several open-source projects without satisfying the applicable license obligations.

Original allegation: [post by `@nek0hasekai`](https://x.com/nek0hasekai/status/1941361311130235189)

These are allegations based on binary-string and structural comparisons available in July 2025. This page does not contain a source-code comparison, response from Stash, or legal judgment.

<!-- more -->

## Projects named in the allegation

The source attributes these claims:

- **Shadow-TLS:** allegedly copied from SagerNet/sing-box, identified as GPL-licensed by the source;
- **Shadowsocks 2022:** allegedly derived in part from `database64128/shadowsocks-go`, identified as AGPL-licensed;
- **VLESS:** allegedly shares parts or naming with SagerNet/sing-box;
- **TUN system stack:** allegedly derived in part from `Kr328/tun2socket`, which the source identifies as MIT-licensed;
- **TUN lwIP stack:** possibly derived from `eycorsican/netstack-lwip`, which the source says had no visible license.

The accuser also said a `quic-go` dependency appeared twice, interpreting that as evidence of copied components.

Similarity in strings, filenames, symbols, or structure can be evidence worth investigating, but does not by itself prove that protectable source code was copied or that a license was violated. Build artifacts, common APIs, generated code, and compatible reimplementations need separate analysis.

## License context

The Chinese source described GPL and AGPL in overly categorical terms. A more precise summary is:

- **GPL:** distributing a derivative or combined covered work can trigger source and license obligations. Whether a particular combination is a derivative work depends on technical and legal facts.
- **AGPL:** includes GPL-style distribution obligations and an additional requirement to offer corresponding source to users who interact remotely with a modified covered program over a network.
- **MIT:** generally permits use, modification, and distribution when its copyright and permission notice are preserved.
- **No license:** public source code without a license normally grants no broad permission to copy, modify, or redistribute, apart from limited rights supplied by the hosting platform and applicable law.

Only qualified legal analysis of the actual code, provenance, distribution, modifications, notices, and corresponding-source offer can determine compliance.

## Structural comparison screenshots

The source says strings extracted from a Stash macOS download showed a Shadow-TLS layout matching sing-box:

![Alleged Stash and sing-box structural similarity =1200x727](https://image.ermao.net/images/news/kne6vczb/image.png)

![Alleged Shadow-TLS similarity =551x1199](https://image.ermao.net/images/news/kne6vczb/image-1.png)

![Additional alleged Shadow-TLS similarity =551x1199](https://image.ermao.net/images/news/kne6vczb/image-2.png)

![Additional alleged file-layout similarity =551x1199](https://image.ermao.net/images/news/kne6vczb/image-3.png)

The accuser's post also included a performance comparison on an iPhone 16 Pro:

> sing-box TestFlight 1.12.0-beta.31: 9.9G; Surge 5 TestFlight build 3516: 5.8G; Surge 5 App Store version: 5.3G.

The source does not define the measurement unit, test method, duration, route, or reproducibility. Those numbers should not be treated as a reliable benchmark.

![Performance screenshot included with the allegation =1199x953](https://image.ermao.net/images/news/kne6vczb/image-4.png)

## Other alleged components

The source says the SS2022 structure and names resembled the AGPL-covered `database64128/shadowsocks-go`:

![Alleged SS2022 structural similarity =1200x591](https://image.ermao.net/images/news/kne6vczb/image-5.png)

It says parts of the VLESS implementation used names matching sing-box:

![Alleged VLESS naming similarity =1200x922](https://image.ermao.net/images/news/kne6vczb/image-6.png)

It attributes the system TUN stack to the MIT-licensed `Kr328/tun2socket`:

![Alleged tun2socket-derived structure 1 =1200x447](https://image.ermao.net/images/news/kne6vczb/image-7.png)

![Alleged tun2socket-derived structure 2 =1200x644](https://image.ermao.net/images/news/kne6vczb/image-8.png)

MIT-licensed reuse is not infringement merely because code is reused; compliance depends on preserving required notices and other facts.

The source further speculates that the lwIP stack came from `netstack-lwip` and that other protocol components might incorporate code from mihomo, sing-box, or other GPL projects. It explicitly says those additional claims were not confirmed through decompilation.

![Final screenshot accompanying the allegation =1199x774](https://image.ermao.net/images/news/kne6vczb/image-9.png)

## What would establish the facts

A reliable conclusion would require:

1. authenticated Stash binaries and version hashes;
2. reproducible extraction or decompilation steps;
3. exact source versions and commit hashes used for comparison;
4. line- or function-level similarity analysis;
5. separation of generated, vendored, API-compatible, and original code;
6. bundled license and source-offer review;
7. Stash's provenance records and response;
8. legal analysis of each license and distribution model.

Until then, the accurate wording is “accused” or “alleged,” not “proven plagiarism.”

::: warning Source boundary
This page translates and qualifies a July 2025 allegation. Screenshots and a social-media post are not a court decision or a complete software-forensics report.
:::
