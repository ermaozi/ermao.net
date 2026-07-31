---
title: AList Ownership-Change Concerns—A June 2025 Community Record
createTime: '2025/06/11 03:13:39'
permalink: /en/article/dsbch7va/
lang: en-US
translationOf: /article/dsbch7va/
tags:
  - AList
  - open source
  - supply-chain security
  - GitHub
  - Docker
description: A dated record of June 2025 community concerns about possible AList ownership and distribution changes, with screenshots, issue link, and safe update guidance.
---

In June 2025, community members raised concerns that ownership or operational control of the AList open-source storage-management project might have changed. They pointed to documentation, download, container, repository, website, and Telegram changes.

This page preserves those reports. A changed maintainer or commercial product is not inherently malicious, and the screenshots alone do not prove a sale or compromise.

<!-- more -->

## Reported signs

The source lists:

1. documentation download links changing without a prominent explanation;
2. changes in the latest Docker image;
3. difficulty contacting the former developer and a change in Telegram group control;
4. repository commits containing advertising-related material.

![AList community ownership-change report](https://image.ermao.net/images/article/dsbch7va/image.png)

## Repository activity

The Chinese article linked the AList repository and included these archived screenshots:

![AList repository activity screenshot 1](https://image.ermao.net/images/article/dsbch7va/image-1.png)

![AList repository activity screenshot 2](https://image.ermao.net/images/article/dsbch7va/image-2.png)

![AList repository activity screenshot 3](https://image.ermao.net/images/article/dsbch7va/image-3.png)

![AList repository activity screenshot 4](https://image.ermao.net/images/article/dsbch7va/image-4.png)

Repository history can show that files changed, but interpreting intent requires authenticated maintainer statements, organization-transfer records, signed releases, and code review.

## Desktop commercialization concerns

The source also reported that an AList desktop application appeared to be packaged and sold:

![AList desktop screenshot 1](https://image.ermao.net/images/article/dsbch7va/image-5.png)

![AList desktop screenshot 2](https://image.ermao.net/images/article/dsbch7va/image-6.png)

![AList desktop screenshot 3](https://image.ermao.net/images/article/dsbch7va/image-7.png)

![AList desktop screenshot 4](https://image.ermao.net/images/article/dsbch7va/image-8.png)

![AList desktop screenshot 5](https://image.ermao.net/images/article/dsbch7va/image-9.png)

Commercial distribution can be compatible with an open-source license. The relevant questions are license compliance, source and notice obligations, binary provenance, data practices, and whether branding or download changes were disclosed.

## Community reports

The source says Telegram participants reported:

- possible ownership change;
- nontechnical WeChat links added to Chinese documentation;
- website and download addresses changing;
- a new Tencent Cloud COS download link later blocked as an “illegal file.”

Those are dated community reports rather than an independent malware finding.

## New maintainer response

![AList new-maintainer response screenshot](https://image.ermao.net/images/article/dsbch7va/image-10.png)

The source links the discussion:
[“Was the project sold? The official website is 404 and the docs have changed for two weeks”](https://github.com/AlistGo/alist/issues/8649)

Readers should review the full issue history, maintainer responses, current organization, and current release process rather than relying only on the screenshot.

## Safe response to an ownership or release change

For a self-hosted tool with storage credentials:

1. do not pull a moving `latest` image automatically;
2. pin the last reviewed image digest or release;
3. export configuration and back up data;
4. inventory cloud tokens, cookies, mount credentials, and webhook secrets;
5. compare source and build changes before updating;
6. rotate secrets if an untrusted build ran with access;
7. restrict outbound network access where practical;
8. monitor release signatures, SBOMs, checksums, and maintainer announcements;
9. test a migration or alternative before an emergency.

Switching to another project solely because it is open source does not remove supply-chain risk. Review its maintainers, license, release provenance, update mechanism, and security history.

## Conclusion

The June 2025 evidence justified caution and a pause before automatically updating AList. It did not, by itself, prove that a sale occurred or that every new build was malicious.

::: warning Dated security record
Project ownership, domains, repositories, and maintainers may have changed again since this article. Verify the current official project and signed release chain before installing or updating.
:::
