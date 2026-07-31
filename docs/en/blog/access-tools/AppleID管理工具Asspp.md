---
title: 'Asspp Guide: Switch App Store Accounts, Download Regional Apps, and Save IPA Files'
createTime: 2026/02/24 07:29:07
permalink: /en/blog/asspp-download-guide/
lang: en-US
translationOf: /blog/asspp-download-guide/
tags:
  - Apple ID
  - App Store
  - regional downloads
  - iOS tools
  - TrollStore
  - censorship circumvention
  - Asspp
description: Install Asspp on iPhone or Mac, manage multiple Apple IDs, browse regional App Stores, download IPA files or older app versions, and assess the risks.
---

Downloading a U.S.-only app, a Japanese game, or an older version of an app normally requires changing App Store accounts or regions. **Asspp** is an open-source third-party tool designed to manage multiple Apple IDs, browse different App Store regions, download apps, and obtain IPA files without signing out of the device's main iCloud account.

> 💡 Connecting to Apple's regional services may require a network route that can reach the relevant servers. See the [2026 proxy-service guide](/en/posts/vpn/) if the ordinary connection cannot reach them.

<!-- more -->

## What Asspp can do

![Asspp interface preview](https://image.ermao.net/images/blog/asspp-download-guide/20260224_073116-3c6273.png)

| Feature | What it does | Typical user |
|---|---|---|
| 🌍 **Switch App Store regions** | Browse U.S., Japanese, Hong Kong, mainland China, and other stores without changing the device's main account | Someone downloading a region-specific app |
| 👥 **Manage multiple Apple IDs** | Store several accounts and select the matching one for a download | Someone who owns accounts in several regions |
| 📦 **Download IPA packages** | Obtain an App Store IPA from Apple's servers through the tool | Someone backing up an app or installing through TrollStore |
| ⏪ **Download an older app version** | Browse and request a historical version where Apple still serves it | Someone whose required feature was removed or regressed |
| 📱 **iOS and macOS** | The project supplies builds for both platforms | Users of several Apple devices |

## Install Asspp

### Method 1: sideload the iOS app

1. Open [Asspp Releases](https://github.com/Lakr233/Asspp/releases), select the intended release, and download its `.ipa`.
2. Install it with a signing or sideloading method available to your device:
   - **TrollStore:** Install the IPA directly on a compatible device.
   - **AltStore:** Sideload it through AltStore.
   - **SideStore:** Use its supported wireless installation flow.
3. Open Asspp and sign in with a secondary Apple ID, subject to the security warnings below.

TrollStore, AltStore, and SideStore are third-party methods for installing iOS apps outside the public App Store. Their availability and security requirements differ by iOS version.

### Method 2: build and sign through GitHub Actions

Users with the required Apple developer signing assets can fork the project and use its workflow to create a signed build:

1. **Fork** the [Asspp repository](https://github.com/Lakr233/Asspp).
2. Configure GitHub Actions with the required certificate and provisioning profile.
3. After a successful build, use the generated over-the-air installation page.

::: collapse

- Detailed build and signing guide

    Upstream reference: [Fork Auto-Build Guide](https://github.com/Lakr233/Asspp/blob/main/Resources/Document/FORK_AUTOBUILD_GUIDE.md)

    ## GitHub Actions build and signing

    This process configures a fork to update from upstream, sign the iOS build with your own assets, publish a release, and produce an over-the-air installation page.

    ### 1. Requirements

    - **Apple Developer account:** A paid account is normally required to create the distribution certificate and provisioning profile used by this workflow.
    - **Signing assets:**
      - a `.p12` distribution certificate exported from Keychain Access and protected with a password;
      - an Ad Hoc `.mobileprovision` profile that contains the target device's UDID.
    - **GitHub account:** Used for the fork and Actions workflow.

    ### 2. Fork and configure the repository

    1. Fork the [Asspp repository](https://github.com/Lakr233/Asspp).
    2. Open **Settings → Actions → General**.
       - Under **Workflow permissions**, select **Read and write permissions**.
       - Save the setting.
    3. Open **Settings → Pages**.
       - Under **Build and deployment**, set **Source** to **GitHub Actions**.

    ### 3. Configure secrets and variables

    GitHub needs the signing assets to sign the build. Repository secrets are sensitive: restrict access to the fork and review the workflow before uploading them.

    #### Option A: generate the inputs with the upstream script

    1. Open a terminal in the project directory.
    2. Run:

        ```bash
        ./Resources/Scripts/generate.github.action.inputs.sh \
        --p12 /path/to/your/certificate.p12 \
        --p12-password 'your-p12-password' \
        --mobileprovision /path/to/your/profile.mobileprovision
        ```

    3. Copy the generated secrets and variables into GitHub Settings, or inspect and run the generated `apply-with-gh.sh` with GitHub's `gh` CLI.

    #### Option B: configure manually

    Open **Settings → Secrets and variables → Actions**.

    **Repository secrets**

    | Name | Value | Purpose |
    | :--- | :--- | :--- |
    | `IOS_CERT_P12_BASE64` | `[Base64 string]` | Base64 representation of the `.p12` certificate |
    | `IOS_CERT_PASSWORD` | `[string]` | Password for the `.p12` file |
    | `IOS_PROVISIONING_PROFILE_BASE64` | `[Base64 string]` | Base64 representation of the `.mobileprovision` profile |

    On macOS, one way to copy the certificate as Base64 is:

    ```bash
    base64 -i certificate.p12 | pbcopy
    ```

    **Repository variables**

    | Name | Value | Purpose |
    | :--- | :--- | :--- |
    | `IOS_BUNDLE_ID` | `wiki.qaq.Asspp` | Must match the App ID in the provisioning profile |
    | `IOS_EXPORT_METHOD` | `ad-hoc` | The typical export method for this workflow |
    | `IOS_OTA_BASE_URL` | optional | Custom GitHub Pages domain, such as `https://apps.example.com`; otherwise leave empty |

    ### 4. Run the workflow

    1. Open the fork's **Actions** tab.
    2. Select **Upstream Signed iOS Build**.
    3. Select **Run workflow** and keep the defaults unless the upstream guide says otherwise.
    4. Wait for the build and inspect any warnings or failures.

    ### 5. Install

    1. Open the fork's **Releases** page and confirm that a new release exists.
    2. On the iPhone, open the generated page in Safari:
       `https://<username>.github.io/<repository>/ios/latest/install.html`
    3. Select **Install**.

    ### Troubleshooting

    - **“Unable to Verify App”:** Open iOS Settings → General → VPN & Device Management and review the signing certificate.
    - **Installation remains waiting:** Confirm that the device UDID is in the uploaded provisioning profile.
    - **Build fails:** Inspect the Actions log. A mismatched bundle ID or expired certificate is a common cause.

:::

### Method 3: install on macOS

1. Download the latest intended `.zip` from [Asspp Releases](https://github.com/Lakr233/Asspp/releases).
2. Extract it and move `Asspp.app` to **Applications**.
3. On first launch, macOS may show a Gatekeeper warning:

If the app will not open:

- In Finder, right-click `Asspp.app`, choose **Open**, then confirm **Open** after verifying the source.
- If that option is unavailable, open **System Settings → Privacy & Security**, locate the blocked app, and choose **Open Anyway** after reviewing the package.

Gatekeeper commonly prompts for apps downloaded outside the App Store. The prompt does not by itself prove that an app is safe; verify the release and signature before bypassing it.

## Requirements listed by the source

- **iPhone or iPad:** iOS 17.0 or later
- **Mac:** macOS 15.0 or later
- **Apple ID:** At least one account; the source strongly recommends a secondary account

## Security considerations

::: warning Use a secondary Apple ID
**Do not use your primary Apple ID with Asspp.**

Asspp uses an unofficial workflow similar to `ipatool`, rather than a public Apple-supported API intended for this use. The source article had not identified a confirmed account ban caused by Asspp, but Apple can change or restrict the underlying service. Losing a primary Apple ID can affect purchases, iCloud data, and Activation Lock.

Treat the device GUID as a secret and never share it.
:::

::: info Protocol stability
The communication method used by Asspp has stopped working on several occasions. Possible causes include abuse triggering security controls, Apple changing the interface, or stricter gateway enforcement.

There is no guarantee that the project can restore access after a future server-side change. Keep legitimate backups of any files you are entitled to retain.
:::

## Need an Apple ID for another region?

Asspp needs an Apple ID for the target App Store region. See the [shared Apple ID page](/en/blog/freeappleid/) for the temporary-account option and its lockout, privacy, and update limitations. Creating and securing your own regional account is more reliable.

## Network access

Apple's regional servers may not be reachable from every network. Related guides:

- [2026 proxy-service selection guide](/en/posts/vpn/)
- [Shadowrocket for iPhone](/en/article/z747kgjd/)
- [Computer access guide](/en/blog/how-to-vpn-on-computer/)

## Frequently asked questions

### Asspp reports a login error

Confirm that the connection can reach Apple's servers. If the direct route cannot, test an appropriate alternative network route before assuming that the account is invalid.

### How is Asspp different from changing the App Store region?

Changing the device account or region through system settings can affect iCloud and store behavior. Asspp runs separately and is intended not to replace the device's main iCloud account. It still receives credentials for any account entered into it, so use a secondary account and review the source and releases.

### What is an IPA file used for?

An IPA is an iOS application package. Subject to the application's license and Apple's terms, it may be used to preserve an app version or install it through a compatible signing method such as TrollStore.

### Is Asspp free?

Asspp is published as open-source software at no charge. Its source is hosted on [GitHub](https://github.com/Lakr233/Asspp).

---

::: tip Disclaimer
This page is for technical reference. Asspp is a third-party open-source project and is not affiliated with Apple Inc. Review the project's code, permissions, licensing, and applicable law before use.
:::
