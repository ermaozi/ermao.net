---
url: /en/blog/how-to-vpn-on-computer/index.md
description: >-
  A beginner guide to installing Clash Verge Rev on Windows or macOS, importing
  a proxy subscription, enabling the system proxy, and fixing common issues.
---
This beginner guide explains how to configure proxy access on a Windows PC or Mac in 2026. It covers the basic terminology, Clash Verge Rev installation, subscription import, the system proxy, and common problems.

## Core concepts: client and subscription

Only two components are required for the basic setup:

1. **Client software:** The application installed on the computer, such as **Clash Verge Rev**. The client itself can be free, but it does not supply network nodes.
2. **Subscription and nodes:** A provider supplies a URL, usually beginning with `http`. Importing it into the client adds the available nodes and routing profile.

::: tip Need a subscription?
Consult the [proxy-service selection and review guide](/en/posts/vpn/) to compare options, evidence, and current risk records.
:::

***

## 1. Windows

The source guide recommends the open-source Clash Verge Rev instead of the discontinued Clash for Windows project.

### Download and install

* **Detailed guide and downloads:** [Install Clash Verge on Windows, Linux, and macOS](/en/article/0gematwc/)

### Basic steps

1. **Install the client:** Download the `.exe` installer for the correct architecture and install it.
2. **Obtain a subscription:** Copy the provider's Clash-compatible subscription URL.
3. **Import the profile:** Open Clash Verge Rev, select **Profiles** or **Subscriptions**, paste the URL, and choose **Import**.
4. **Enable the proxy:**
   * Open **Proxies** and select **Rule** for rule-based routing, or use **Global** temporarily when testing.
   * Open **Settings** and enable **System Proxy**.
   * Confirm that the system-proxy control is enabled before testing browser access.

***

## 2. macOS

Installing an app on macOS may trigger an unidentified-developer warning. Confirm the package source before bypassing any warning. The remaining configuration is similar to Windows.

### Download a client

Clash Verge Rev supports both Intel and Apple Silicon Macs. The source guide also mentions ClashX Pro as an alternative.

* **Detailed guide and downloads:** [Install and Use Clash Verge Rev on macOS](/en/article/6vxkmmuh/)

### Basic steps

1. **Install the app:** Open the `.dmg` and drag the app into Applications. If macOS cannot verify the developer, review the source first, then use **Open Anyway** under **System Settings → Privacy & Security** if you choose to proceed.
2. **Import the subscription:**
   * Copy the provider's subscription URL.
   * Open the client, find **Profiles** or **Subscriptions**, paste the URL, and download the profile.
3. **Connect:**
   * Open the client from the menu bar or app window.
   * Enable **Set as System Proxy**, or configure TUN according to the current client version.
   * The source guide also refers to **Enhanced Mode** in clients that provide that option.

***

## 3. Frequently asked questions

### The client is open, but websites still do not load

* **Check the system proxy:** Confirm that **System Proxy** is enabled.
* **Check the mode:** Use **Rule** normally. Temporarily switch to **Global** to determine whether the rule set is the cause.
* **Check the nodes:** Run the latency or connectivity test. If every node times out, the subscription may have expired or the provider may be experiencing an outage.

### The computer cannot access the internet after the client closes

The system proxy may have remained enabled after the client exited.

1. Reopen Clash.
2. Disable **System Proxy**.
3. Exit normally.

On Windows, you can also open **Settings → Network & Internet → Proxy** and disable the manually configured proxy server.

### Can the same subscription be used on a phone and computer?

Usually, but the provider determines the device and concurrent-connection limits. The source guide notes that many plans allow roughly three to five devices; verify the actual plan terms before use.

See the [Mobile Access Guide for Android and iOS](/en/blog/how-to-vpn-on-mobile/).

***

## Summary

The basic sequence is: **install a client → import a subscription → enable the system proxy or TUN mode**.

Use the detailed platform guides above when the interface, permissions, or package architecture needs closer attention.
