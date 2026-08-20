---
url: /en/article/6vxkmmuh/index.md
description: >-
  Install Clash Verge Rev on an Intel or Apple Silicon Mac, import a
  subscription, select a node, choose a proxy mode, and troubleshoot common
  issues.
---
Clash Verge Rev is a proxy client for macOS with builds for both Apple Silicon and Intel processors. This guide explains how to install the app, import a subscription, select a node, and configure the proxy.

## 1. Download and install

### Choose the correct build

Download the version that matches the Mac's processor:

* **GitHub:** [Clash Verge Rev releases](https://github.com/Clash-Verge-rev/clash-verge-rev/releases)
* [Clash Verge macOS x64 for Intel](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg)
* [Clash Verge macOS for Apple Silicon](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg)

### Installation

1. Open the downloaded `.dmg` file. macOS may ask for permission to open an app from an unidentified developer.
2. If macOS reports that Apple cannot check the app for malicious software, open **System Settings** or **System Preferences**, go to **Privacy & Security**, and use **Open Anyway** only after confirming that the package came from the intended release source.

   Apple documentation: [Open a Mac app from an unidentified developer](https://support.apple.com/zh-cn/guide/mac-help/mh40616/15.0/mac/15.0)

### Finish

1. Drag **Clash Verge Rev** into the **Applications** folder.
2. Launch it from Applications.

***

## 2. Basic configuration

### Add a subscription URL

If you do not have a subscription URL, consult the [proxy-service selection and review guide](/en/posts/vpn/).

1. Open **Clash Verge Rev** and select **Profiles** or **Subscriptions** in the navigation.
2. Paste the subscription URL into the subscription input and select **Import**.
3. Wait for the import to finish. If it fails, refresh the page and request a current URL from the provider.

**Note:** Import can fail when a plan has expired or its subscription URL has been revoked.

### Select a proxy node

1. After the subscription is imported, open **Proxies**.
2. The main panel displays the servers supplied by the subscription.
3. Select the required policy group, then choose a node.

In most cases, no other setting must be changed before testing the selected node.

***

## 3. Proxy modes

* **Rule mode:** Sends traffic through the proxy according to the profile's routing rules.
* **Global mode:** Sends all supported traffic through the proxy. This can slow access to local services and should be used only when necessary.
* **Direct mode:** Sends traffic directly without the proxy.

***

## 4. System proxy and TUN

To route traffic from macOS applications through Clash Verge Rev, enable the appropriate system integration:

1. Open **Settings** in Clash Verge Rev and enable **TUN Mode** after installing any required service component and granting the requested system permissions.
2. If TUN cannot be enabled, use **System Proxy** for applications that honor the macOS proxy settings.

The source guide advises choosing either TUN mode or system-proxy mode rather than enabling both. Exact behavior varies by Clash Verge Rev version, so follow the current app labels and documentation.

***

## 5. Troubleshooting

* **Subscription import fails:** Confirm that the URL is complete and valid and that the underlying network works.
* **Clash Verge Rev does not proxy traffic:** Restart the app, select a working node, and recheck the TUN or system-proxy setting.

***

## 6. Uninstall

1. Open the **Applications** folder.
2. Right-click **Clash Verge Rev** and select **Move to Trash**.
3. Empty the Trash if you want to remove the app immediately.

These steps cover the basic macOS installation and configuration. Consult the current upstream release notes if the interface or permission prompts differ from the screenshots or labels described here.
