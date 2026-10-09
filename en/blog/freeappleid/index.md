---
url: /en/blog/freeappleid/index.md
description: >-
  Shared Apple IDs for downloading region-limited App Store apps, with live
  account data and prominent device-lock, privacy, update, and availability
  warnings.
---
See the [shared account list and data timestamp](#shared-apple-id-pool) for the regions currently available. **Use shared accounts only inside the App Store, never in the device's Settings or iCloud.** A data update does not guarantee that an account will still work when you sign in.

> 💡 To manage accounts for several App Store regions, see [Asspp, a third-party Apple ID manager](/en/blog/asspp-download-guide/). It cannot guarantee verification-free access, stable connections, or continued account availability. Read the [project's security notice](https://github.com/Lakr233/Asspp#-special-notice) and use only a secondary account you control; its unofficial communication method may stop working without a fix.

::: danger Critical safety boundaries

1. **Device-lock risk:** **Never sign in to a shared account under Settings or iCloud.** Sign in only from the App Store profile screen. A malicious or compromised system-level account can expose an iPhone or iPad to remote lockout.
2. **Privacy risk:** Many people use each shared account. Never store photos, contacts, backups, or other personal data in it, and never attach a payment method or add funds.
3. **Availability is not guaranteed:** A shared account may be locked, disabled, or require two-factor authentication. These prompts alone do not establish a cross-region sign-in as the cause. Stop trying an inaccessible account and do not change another person's password or security settings; see the FAQ for the different alerts.
   :::

## Who should and should not use a shared account?

Public Apple IDs offer temporary access to another App Store region but sacrifice reliability and account isolation.

* **Possible fit:** A user who needs a one-time or occasional download of a region-specific app, such as Shadowrocket, Clash Mi, TikTok, ChatGPT, or Potatso Lite, and will not make in-app purchases or rely on the shared account for long-term ownership.
* **Poor fit:** Anyone who depends heavily on apps from another region, needs reliable updates, or makes in-app purchases. Because a public account may be locked or rotated without notice, such users should create and secure their own Apple ID for the required region.

## Shared Apple ID pool

The interface below loads account data and its update timestamp, not a live sign-in test for each account. Regions, purchase histories, and availability can differ; an account may not own paid apps such as Shadowrocket. Do not change passwords, attach a payment method, or alter two-factor-authentication settings.

::: tip After downloading the app
**A shared Apple ID does not provide servers, and installing a client does not supply a network service.** If you came here to install Shadowrocket or Clash Mi, read the [iPhone subscription selection notes](/en/posts/vpn/#ios-subscription), then follow the [Shadowrocket](/en/article/z747kgjd/) or [Clash Mi](/en/blog/clashmi/) import guide. Keep using an existing compatible subscription; there is no need to buy another.
:::

## Frequently asked questions

### Why does a free U.S. Apple ID say it is locked?

A lockout alert alone does not establish cross-region sign-ins as the cause. [Apple distinguishes several alerts](https://support.apple.com/en-us/102640):

* **Locked or disabled for security reasons:** Repeated incorrect passwords or account details can cause this; the owner needs to reset the password
* **Locked or inactive account:** The owner can try requesting access, with no guaranteed outcome
* **Disabled Media & Purchases account:** The owner can request reactivation as directed by the alert

Recovery applies only to an account you own. Stop trying an inaccessible shared account; do not reset another person's password or change security settings. Label colors identify regions, not a successful sign-in test. Refreshing the list does not verify account availability. Use an Apple Account you own for continued use.

### How do I update an app downloaded with a shared Apple ID?

The App Store may require the Apple ID that originally obtained the app before installing an update. If Clash Mi or another region-limited app was downloaded with one of these accounts, the same account may be required later. Because accounts in this pool rotate frequently, it may no longer be available.

Do not immediately delete the old app to obtain an update. **Export subscriptions, settings, and other local data first, and confirm that the replacement account can download the app.** A paid app may require another purchase. For continued use, follow [Apple's account-creation guide](https://support.apple.com/en-us/108647) and manage your own purchase history and account security.

## Related tools
