---
url: /en/blog/how-to-vpn-on-mobile/index.md
description: >-
  A beginner guide to configuring proxy access on Android and iPhone, from
  installing Clash or Shadowrocket to importing a subscription and connecting.
---
This beginner guide explains how to configure proxy access on Android phones, iPhones, and iPads in 2026. It covers client installation, subscription import, connection authorization, and common problems.

## What you need

Before changing anything on the phone, understand two components: a **client** and a **node subscription**.

1. **Client app:** Software installed on the phone.
   * **Android:** Clash for Android or Clash Meta are common choices.
   * **iOS:** Shadowrocket is commonly used; Clash Mi is a free alternative covered elsewhere on this site.
2. **Nodes and subscription:** A provider supplies a subscription URL. Import it into the client to receive the available proxy nodes.

::: tip Need a subscription?
Consult the [proxy-service selection and review guide](/en/posts/vpn/) to compare options, evidence, and current risk records.
:::

***

## 1. Android

Android allows installation from an APK file after the user grants the required permission. Verify the source and package before installing any APK.

### Download a client

The source guide recommends **Clash Meta for Android**, a feature-rich client that has received relatively recent updates.

* **Detailed guide:** [Install and Use Clash on Android](/en/article/eh8f4n86/)

### Basic steps

1. **Install the APK:** Obtain the package through the detailed guide above and install it.
2. **Import the subscription:** Open the app, select **Profiles**, choose import from **URL**, and paste the provider's subscription URL.
3. **Connect:** Return to the home screen and select **Start**. Android displays a VPN-connection permission dialog the first time; review it and confirm.

***

## 2. iPhone and iPad

First check whether Shadowrocket is offered in the store region of your own App Store account. Region, device compatibility, and current availability affect access. Prefer an account you control whose store offers the app.

### Prepare an App Store account

Prefer your own account for purchasing and managing the app. If you already bought it, check the purchase history of the original purchasing account and try redownloading it. Shared accounts are only an optional, temporary App Store route; sign-in, an existing purchase, downloading, and future updates are not guaranteed.

* **Optional temporary-account information:** [Shared U.S. Apple IDs](/en/blog/freeappleid/)

::: danger Account safety
**Never sign in to an untrusted shared Apple ID under the device's main Settings or iCloud section.**

The documented shared accounts are intended only for the App Store. System-level sign-in can expose the phone to lockout or remote-control risk.
:::

### Install Shadowrocket

Check the name and developer, **Shadow Launch Technology Limited**, on the [official Shadowrocket App Store page](https://apps.apple.com/us/app/shadowrocket/id932747118). It is a paid app: buy it at the current price in your store, or check the original purchasing account for a redownload, subject to current availability and device compatibility.

* **Detailed guide:** [Install and Configure Shadowrocket](/en/article/z747kgjd/)

### Basic steps

1. **Confirm the account:** Prefer an account you control whose store offers Shadowrocket; signing out of your own account is not a default requirement. A temporary shared account is for the App Store only, never device Settings or iCloud.
2. **Install the app:** Verify the app, then buy it at the current price or redownload it with the original purchasing account. If you temporarily use a shared account, sign out afterward and return to your own App Store account. This does not transfer the purchase or guarantee future updates, which may still require the account originally used to obtain the app.
3. **Add nodes:**
   * **Method A:** Use the provider dashboard's one-click Shadowrocket import, if available.
   * **Method B:** Copy the subscription URL, open Shadowrocket, and approve the detected URL or add it manually with the **+** button.
4. **Connect:** Enable the home-screen switch, review the request to add a VPN configuration, and authenticate with the device passcode or Face ID.

***

## Frequently asked questions

**Why is the connection slow?**\
Run the client's node or latency test and compare several nodes. Peak-hour congestion can also affect performance.

**Why does it work on Wi-Fi but not mobile data?**\
Check whether the app is allowed to use cellular data and review the client's proxy or routing mode.

**Should I use a free VPN?**\
Some free VPN products are slow, advertising-heavy, or unclear about data collection. Evaluate the operator and privacy policy before trusting one. A low-cost paid service is not automatically safe either, so use the same evidence and risk checks.

**Why do local apps become slow after connecting?**\
Rule-based routing matches the current rules and follows their policies; it does not inherently mean local traffic goes direct and foreign traffic is proxied. In global or proxy modes, forwarding depends on the selected node or policy and the traffic actually captured by the client; not all traffic necessarily travels abroad. Clash modes and Shadowrocket’s Config/Proxy options are not identical. Check the mode, matched rules, selected policy, and capture scope, then compare connection logs and observed behavior.

For screenshots and app-specific details, use the Android or iOS guides linked above.
