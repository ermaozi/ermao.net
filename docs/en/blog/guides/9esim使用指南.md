---
title: 9eSIM V3 Guide for Loading a Carrier eSIM Profile
createTime: 2025/10/14 11:14:12
permalink: /en/blog/9esim/
lang: en-US
translationOf: /blog/9esim/
tags:
  - 9eSIM
  - eSIM
  - removable eUICC
  - mobile number
  - account verification
  - Android
description: Understand what the 9eSIM V3 card does, verify device compatibility, buy a separate carrier profile, load it securely, and test calls, SMS, and data.
---

## What 9eSIM is—and is not

9eSIM V3 is a **physical, SIM-shaped programmable eUICC card**. It stores eSIM profiles and lets a compatible phone use them through a physical SIM slot. It is not itself a mobile carrier, telephone number, verification-code service, or data plan.

9eSIM's current [terms](https://www.9esim.com/en/terms) state that its cards ship blank and that customers obtain profiles separately from a GSMA-compatible carrier or travel-eSIM provider. The source article used a plan purchased through the separate eSIM Plus app as its example.

<!-- more -->

::: warning No registration guarantee
An eSIM profile may be data-only, may not include a telephone number, or may not receive application verification messages. Google, Telegram, X, and other services can reject VoIP, shared, recycled, or unsupported number ranges. A successful test in the source article is not a guarantee for another number or a later date.
:::

## Reasons to use a removable eUICC

- Store and switch among compatible eSIM profiles on a device with a physical SIM tray.
- Reuse the hardware after a plan expires by loading another supported profile.
- Move the physical card between compatible devices, subject to the profile provider's rules.
- Use an open LPA workflow instead of depending on one travel-plan vendor's app.

It does not automatically improve privacy. The hardware vendor, carrier or travel-eSIM provider, visited network, and online service can still process identifiers and connection records according to their roles.

## Cost snapshot

The original October 2025 test recorded:

| Item | Price recorded by the source | What it buys |
| --- | ---: | --- |
| 9eSIM V3 | USD 24 list price; USD 21.60 after the recorded code | Reusable physical card hardware |
| eSIM Plus plan | USD 5.75 in the tested app flow | A separate eSIM profile or service plan |
| Approximate total | CNY 195 at the source's exchange-rate snapshot | Hardware plus the example plan |

The official product page listed 9eSIM V3 at USD 24 when this English version was checked. Taxes, shipping, customs, exchange rates, plan prices, payment methods, and discounts can change.

The referral link and code below may support this site. See the [affiliate disclosure](/en/affiliate-disclosure/).

- Website: [9eSIM V3](https://www.9esim.com/?coupon=ermao)
- Recorded code: `ermao`
- Discount claimed by the source: 10%

Confirm the price shown by checkout before paying.

![9eSIM price shown in the source article](https://image.ermao.net/images/blog/9esim/image.png)

## Check compatibility before purchase

9eSIM's [supported-device guidance](https://www.9esim.com/en/devices) says the device needs a physical SIM tray. An eSIM-only phone cannot accept the card.

Also check how profiles will be written:

- On a compatible Android device, an LPA app may access the card through OMAPI.
- iOS restricts direct third-party writing to a physical SIM, so an external reader or another compatible device may be needed to load a profile.
- A PC workflow needs a compatible PC/SC reader.

Use the official compatibility checker or LPA before ordering. Exact model, regional firmware, Android version, and card revision can affect support.

## Purchase the 9eSIM V3 hardware

1. Open the [official 9eSIM website](https://www.9esim.com/?coupon=ermao) and sign in if checkout requires it.
2. Select the V3 or another card only after comparing capacity and compatibility.

![Selecting Buy now on the source checkout](https://image.ermao.net/images/blog/9esim/image-1.png)

3. Add the card and, when required by the intended workflow, a compatible card reader.

![Adding 9eSIM V3 to the basket](https://image.ermao.net/images/blog/9esim/image-3.png)

4. Review the delivery address, shipping charge, taxes, return policy, and payment methods. Apply `ermao` only if the checkout still recognizes it.

![Proceeding to checkout](https://image.ermao.net/images/blog/9esim/image-4.png)

5. Save the order confirmation and track the shipment. The source received its order after an estimated three to five days; international delivery is not guaranteed to match that result.

![9eSIM payment screen in the source test](https://image.ermao.net/images/blog/9esim/image-5.png)

![9eSIM order confirmation in the source test](https://image.ermao.net/images/blog/9esim/image-6.png)

## Buy a separate eSIM profile

The following screens show the source author's eSIM Plus purchase flow. They are not part of the 9eSIM product, and current availability must be checked in the provider's app.

1. Install eSIM Plus from a verified store listing or the provider's [app link](https://esimplus.onelink.me/WxwP/c7eggfvh).
2. Create an account and review its terms, privacy policy, refund rules, supported networks, and number-retention policy.

![Registering in eSIM Plus](https://image.ermao.net/images/blog/9esim/image-7.png)

3. In the source flow, the author chose **Add eSIM → Mobile Data → Global → Pay as you go**.

![Adding an eSIM in eSIM Plus](https://image.ermao.net/images/blog/9esim/image-8.png)

![Choosing Mobile Data](https://image.ermao.net/images/blog/9esim/image-9.png)

![Choosing the Global region](https://image.ermao.net/images/blog/9esim/image-10.png)

4. The source then selected a one-time purchase and saw cryptocurrency or PayPal payment options.

![Selecting the plan](https://image.ermao.net/images/blog/9esim/image-11.png)

![Selecting a one-time purchase](https://image.ermao.net/images/blog/9esim/image-12.png)

![Payment options displayed in the source flow](https://image.ermao.net/images/blog/9esim/image-13.png)

Before purchase, verify explicitly:

- whether the profile includes data, voice, SMS, or a combination;
- whether it receives application short codes and verification messages;
- its activation window, service validity, inactivity rules, and renewal cost;
- whether the number is dedicated, recycled, or can be reclaimed;
- whether the intended device and country are supported.

## Load the eSIM profile onto the card

### 1. Insert the physical card

Power down the phone if its manufacturer requires it, insert the 9eSIM V3 into the physical SIM tray, and restart.

### 2. Install a compatible LPA

Use 9eSIM's current [software and tool-selection page](https://www.9esim.com/ecosystem-software-download/). Prefer a verified store build or the vendor's linked source release.

![9eSIM software download page](https://image.ermao.net/images/blog/9esim/image-14.png)

### 3. obtain the activation data

In the plan provider's app, open the purchased profile and choose its QR-code or manual-activation option.

![Opening the purchased profile](https://image.ermao.net/images/blog/9esim/image-16.png)

![Choosing the QR-code method](https://image.ermao.net/images/blog/9esim/image-17.png)

![eSIM activation QR screen](https://image.ermao.net/images/blog/9esim/image-18.png)

::: danger The activation QR code is a credential
Do not publish, email, or upload the QR image to an online converter. Many activation codes can be consumed only once. Store it only as long as needed and follow the profile provider's recovery procedure if loading fails.
:::

### 4. Download the profile

Open the approved LPA, select the physical slot or reader containing the 9eSIM card, add a profile, and scan or import the activation data.

![Selecting the card in the 9eSIM LPA](https://image.ermao.net/images/blog/9esim/image-15.png)

![Downloading the profile to 9eSIM](https://image.ermao.net/images/blog/9esim/image-19.png)

Keep the device connected and powered during the download. If it fails, do not repeatedly consume the activation code; save the exact error and contact the profile provider.

### 5. Enable and test the profile

Select the new profile, enable roaming only when the plan requires it, enter any required APN, and test data. If the plan claims a number with voice or SMS, test those separately.

## Verification test shown in the source

The source author used the loaded profile during a Google Account flow:

1. Open [Google Account](https://accounts.google.com/) and start account creation.

![Google Account creation screen](https://image.ermao.net/images/blog/9esim/image-20.png)

2. If Google requests telephone verification, enter the number supplied by the profile provider.
3. Enter the message only on Google's official page.

![Verification message received in the source test](https://image.ermao.net/images/blog/9esim/image-21.png)

That test shows only that the particular number received the particular message at that time. It does not prove future support for Google, Telegram, X, or another platform.

## Frequently asked questions

### Which countries are available?

9eSIM hardware does not determine the country. Country, network, number, and roaming coverage come from the separately purchased carrier profile. Check the provider's current listing.

### How long does the service last?

The physical 9eSIM card is reusable. Each loaded profile has its own activation, expiration, inactivity, top-up, and number-reclamation rules. “One-time purchase” does not necessarily mean a permanent number or lifetime service.

### How do I change numbers?

Obtain another eligible carrier profile or number from the profile provider, load it if necessary, and switch profiles. Preserve access to any old number until every important account has been updated.

### Is it safe?

The programmable card is only one component. Safety depends on device security, LPA authenticity, QR-code handling, the carrier or travel provider, account recovery, and the online service's rules. Use a long-term number under your control for valuable accounts and enable an independent recovery method.

## Related guides

- [Clash Meta for Android](/en/article/eh8f4n86/)
- [Clash Verge for Windows, Linux, and macOS](/en/article/0gematwc/)
- [Telegram registration and security](/en/blog/telegram/)
- [Proxy-service reviews](/en/posts/vpn/)

::: info
This guide documents a technical workflow, not a guarantee that a particular number will satisfy a platform's verification policy. Follow the laws, carrier terms, and account rules that apply to you.
:::
