---
url: /en/article/z747kgjd/index.md
description: >-
  A 2026 beginner guide to installing Shadowrocket on iPhone, iPad, or Mac,
  importing a subscription, connecting, testing, and troubleshooting.
---
::: tip Free alternative
Shadowrocket is a paid App Store app. If you do not own it and prefer a free client, see the [Clash Mi for iOS guide](/en/blog/clashmi/).
:::

This 2026 Shadowrocket guide covers iPhone and iPad, as well as supported Macs. It explains installation, subscription import, node selection, connection testing, and common problems. The linked Apple ID page also documents shared non-mainland App Store accounts, with important account-safety warnings.

## 0. Identify the official app

The official Shadowrocket App Store listing uses the icon shown below.

![Official Shadowrocket App Store listing =731x337](https://image.ermao.net/images/article/z747kgjd/image.png)

## 1. Download and install

Shadowrocket is not available in mainland China's App Store. The source guide uses a non-mainland Apple ID to access the app.

::: caution Account-lock warning
When using a shared account, sign in **only inside the App Store by following the documented steps**. Never sign in to the shared account under the device's main **Settings** or iCloud account section.

Signing in to an untrusted shared Apple ID at the system level can expose the device to account lockout or remote-control risk.
:::

1. Open the **App Store**, select the profile icon, scroll down, and sign out of your own store account. Sign in with the shared store account. If an Apple ID security page appears, choose **Other Options**, then decline the upgrade.
2. The App Store should switch to that account's region. The interface may remain in Chinese. Restart the App Store or the phone if the store does not change.
3. Search for **Shadowrocket** and compare the icon with the screenshot above to avoid similarly named apps. You can also open the [U.S. App Store listing](https://apps.apple.com/us/app/shadowrocket/id932747118).
4. Install and open Shadowrocket.
5. Sign out of the shared App Store account immediately after the download, then return to your own account.
6. If Apple asks to verify a phone number for the shared account, use a different listed account rather than attempting to change its security information.
7. A request to answer account-security questions usually indicates that the shared-account procedure was not followed correctly.

## 2. Import a subscription

1. If you do not have a subscription URL, consult the provider guide below.

2) Open Shadowrocket.
3) Select the **+** button in the upper-right corner, choose **Subscribe** as the type, and paste the subscription URL.
4) Select **Save**. The app downloads and updates the subscription.

## 3. Select a server

1. Return to Shadowrocket's main screen after the subscription is imported.
2. Open the server list below the subscription and select a suitable server.

## 4. Connect

1. Turn on the switch at the top of the screen. On the first connection, iOS asks for permission to add a VPN configuration and may require the passcode or Face ID.

![Shadowrocket connection switch and iOS authorization =554x375](https://image.ermao.net/images/article/z747kgjd/20260112_111749-15697a.png)

2. A VPN indicator appears in the status area while Shadowrocket is running.

## 5. Test the connection

1. Open a browser and visit a site that is unavailable on the original network, such as `google.com`.
2. If the site opens and the required services work, the basic configuration is complete.

## 6. Optional settings

1. **Routing:** Keep **Global Routing** set to **Config** for rule-based routing. If a specific site is not proxied, temporarily choose **Proxy** to determine whether the rule set is the cause.
2. **Connectivity test:** Use the connectivity test on the home screen and choose a node that responds.

## 7. Common problems

1. **Cannot connect:** Check that the subscription URL is valid, the selected server is online, and the underlying network works.
2. **Slow connection:** Test another server or use the connectivity test to compare nodes.

## 8. Update a subscription

Select the circular update button next to the subscription on the home screen.

## 9. Further reading

* [Shadowrocket Rules, Split Routing, and Ad Blocking](/en/blog/shadowrocket-rules-config/)
* [Clash Mi for iOS](/en/blog/clashmi/)
* [Mobile Access Guide for Android and iOS](/en/blog/how-to-vpn-on-mobile/)
