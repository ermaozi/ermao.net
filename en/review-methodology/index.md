---
url: /en/review-methodology/index.md
description: >-
  How Ermao Blog evaluates proxy services through test environments, latency,
  speed, source classes, evidence limits, purchase advice, and retesting.
---
# Proxy-Service Review Methodology and Evidence Standards

::: warning Understand the limits of a test first
Proxy-service performance changes with the user's location, ISP, time of day, and server load. Results on this site describe a specific sample and do not promise that every user will obtain the same result.
:::

::: card-grid cols="3"

* **Reproducible**

  Retain dates, environments, tools, time windows, and the number of test runs whenever possible.

* **No unsupported extrapolation**

  One speed test or one server cannot represent long-term performance across the whole service.

* **Time-sensitive**

  Plans, routes, IP addresses, and unlock status can change at any time.

:::

## Basic test record

A complete test should record as much of the following as possible: date and time window, location, ISP, baseline bandwidth, device and client, server region, and number of test runs. Data without this context can serve only as limited supporting information.

## Primary metrics

| Metric | How it is recorded | Important limitation |
|---|---|---|
| Latency and packet loss | Test the same server multiple times and favor the median | A single lowest-latency result does not represent long-term performance |
| Download and upload | Record baseline bandwidth and the test tool | Results depend on the local network and test server |
| Evening peak stability | Normally retest between 20:00 and 23:00 local time | One evening cannot establish long-term availability |
| Streaming and AI services | Record the server, region, service, and date | Unlock status may change when the IP address changes |
| Support response | Record the support channel and time to a useful response | One ticket cannot represent every user's experience |

## Evidentiary limits

* Route labels such as “IPLC,” “IEPL,” and “BGP transit” are described as provider-advertised specifications when they come only from the seller.
* A “no-logs” claim usually cannot be independently verified from outside the service and should not receive definitive endorsement based only on marketing.
* Absolute promises such as “no speed limits,” “will never shut down,” or “perfect unlocking” are not treated as verifiable facts by this site.
* When comparable quantitative data from a consistent environment is unavailable, the article should clearly identify the material as a source summary or preliminary experience.

## Evidence levels

| Level | Statements the evidence can support | Conclusions it cannot establish directly |
|---|---|---|
| A: Repeated tests by this site with environment records | “In this test” or “the median in these tests was” | Long-term stability in every region |
| B: One test or screenshot from this site | “Connected in this test” or “unlocked in this test” | Permanent unlocking or an enduring absence of speed limits |
| C: Official page or announcement | “The official specification states” or “the provider says” | Independent verification |
| D: User report or indirect material | “A user reported” or “there are related indications” | A general fact or final determination |

## Purchasing guidance

For a first purchase, the site generally recommends a short billing period and a low-cost plan, together with a backup option. No amount of historical performance can guarantee future availability.

***

**Related policies:** [Editorial Policy](/en/editorial-policy/) · [Affiliate Disclosure](/en/affiliate-disclosure/) · [Report a Data Error](/en/corrections/)
