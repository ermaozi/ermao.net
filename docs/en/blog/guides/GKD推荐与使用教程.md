---
title: "GKD Tutorial: Skip Startup Ads and Automate Repetitive Android Taps"
createTime: 2026/10/01 17:30:00
updateTime: 2026/10/01 18:05:09
permalink: /en/blog/gkd-guide/
lang: en-US
translationOf: /blog/gkd-guide/
tags:
  - GKD
  - Android
  - automation
  - accessibility
  - startup ads
  - Li Tiaotiao
description: Learn what GKD does, install it, grant accessibility, add a working rule subscription, verify actions, and troubleshoot. Includes a comparison with Li Tiaotiao.
sources:
  - https://gkd.li/guide/what-is-gkd
  - https://gkd.li/guide/
  - https://github.com/gkd-kit/gkd
  - https://github.com/gkd-kit/gkd/releases/latest
  - https://gkd.li/guide/faq
  - https://gkd.li/guide/privacy
  - https://github.com/aoguai/subscription
  - https://github.com/aoguai/subscription/blob/custom/dist/README.md
  - https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5
  - https://github.com/kernelai/LiTiaotiao
  - https://app.xinhuanet.com/news/article.html?articleId=7b5425b5-fff5-4b21-90c4-22001a09ce3c
---

You open an app to track a parcel or play a song. First comes a startup ad, then a popup, then another invitation you have already dismissed. Your thumb has done a small shift before you have done anything useful.

**GKD can take over some of those repetitive taps.** With compatible rules enabled, it can click a visible Skip button, dismiss a supported popup, or carry out another screen action you have chosen.

If you know Li Tiaotiao, the idea will feel familiar. GKD has one extra setup step that often catches newcomers: **it currently comes without default rules. Installing it is only the beginning.** This guide takes you through installation, permissions, a concrete subscription, and checking the first successful action.

<!-- more -->

## What can GKD actually do?

GKD is a screen-action assistant. Its rules describe where to look, what conditions to match, and which action to perform. The [official introduction](https://gkd.li/guide/what-is-gkd) includes repetitive shortcuts and skipping startup flows as examples.

| Repetitive task | Possible assistance |
| --- | --- |
| An app starts with an ad | Tap an accessible, clickable Skip control when a rule matches |
| A promotion interrupts the screen | Close or cancel it using a compatible rule |
| Comments require repeated expansion | Tap the supported Expand more comments button |
| The same confirmation appears repeatedly | Apply a specific rule, such as certain computer-login confirmations |

Each task needs its own rule. The subscription used below contains examples for Taobao popups and expanding Bilibili comments; its [supported-rule list](https://github.com/aoguai/subscription/blob/custom/dist/README.md) describes them. Compatibility depends on the app version and screen.

GKD acts on the interface. It does not remove every ad network request, invent a missing close button, or unlock paid membership. An ad may appear briefly before the skip action. If the interface cannot be matched, you still handle it yourself.

Its appeal is practical: give the phone the taps whose outcome you already know, and keep your attention for what you opened the app to do.

## GKD versus Li Tiaotiao: which should you choose?

Li Tiaotiao helped make Android startup-ad skipping familiar. In August 2023, its developer announced an indefinite pause in updates, prompting discussion about startup ads. This [report documents the 2023 event](https://app.xinhuanet.com/news/article.html?articleId=7b5425b5-fff5-4b21-90c4-22001a09ce3c); it is not a new announcement in 2026.

Here, Li Tiaotiao means the commonly preserved **Paida Xing 2.2 version and community-rule workflow**. A community rule update, APK backup, or similarly named app does not establish that the original developer resumed releases.

| Point | GKD | Li Tiaotiao |
| --- | --- | --- |
| Main use | Startup shortcuts and other configured screen actions | Best known for startup-ad skipping |
| Initial setup | Grant permission, then add rules | Fewer steps for basic use; custom rules are optional |
| Rule updates | Check updates through a remote subscription URL | Community rules generally require copying and importing |
| Controls | Subscription, category, app, and rule-group settings | Custom rules, with capabilities depending on version |
| Unwanted actions | Trigger history helps locate the responsible rule | Inspect and adjust community rules through its own workflow |
| Maintenance sources | Official app releases; separate rule maintainers | Original update-pause announcement; distinguish community sources |

GKD's capabilities are documented in its [official project](https://github.com/gkd-kit/gkd). The [Li Tiaotiao community-rule documentation](https://github.com/kernelai/LiTiaotiao) explains imports, including that importing a second rule file replaces the previous one rather than adding a GKD-style subscription.

**If Li Tiaotiao already works well for you, choose according to your needs. For a new setup, or more control over rules and unwanted taps, GKD is worth trying first.** Its extra setup step gives you more controls afterward. This is a workflow comparison, not a same-device speed or battery benchmark.

During the first test, let only one tool handle the same target so you can identify which one performed the action.

## What you need before starting

- **An Android phone.** These GKD installation and permission steps do not apply to iPhone.
- **A connection that can download the app and rule file.** Root and Shizuku are unnecessary for the basic route below.
- **An app where you normally encounter a startup ad.** Use an existing app for verification.

The sequence is **install → grant accessibility → add rules → verify → check background operation**. Each step ends with a completion check.

## Step 1: install GKD from an official source

1. Open the [official download page](https://gkd.li/guide/) in your phone browser.
2. Under Installation, choose the stable APK. On **October 1, 2026**, the stable version was **v1.12.1**; follow the page for later releases.
3. Open the downloaded APK from your browser downloads or file manager and install it.
4. If Android blocks installation from this source, allow installation for **the browser or file manager used for this download**, then return to the installer. You can disable that source permission afterward.
5. Open GKD.

Alternatively, open the [official GitHub release](https://github.com/gkd-kit/gkd/releases/latest), expand **Assets**, and choose the `.apk` file. The Source code archives are not Android installers. The official guide also links to [Google Play](https://play.google.com/store/apps/details?id=li.songe.gkd).

**Completion check:** GKD opens and shows Home, Subscriptions, Apps, and Settings navigation. It is normal for nothing to be clicked yet.

## Step 2: grant accessibility permission

Accessibility allows interface reading and actions. Verify that you installed the official application before granting it.

1. On GKD's Home screen, find **Service status (服务状态)** and open its authorization flow.
2. Under **Working mode (工作模式)**, choose or retain **Basic (基础)**, then tap **Manual authorization (手动授权)**. Older interfaces may label this simply Authorize. Use ordinary accessibility for this guide.
3. In Android's Accessibility settings, open the installed or downloaded services list. Its name varies by phone.
4. Select **GKD**, enable the service, read the system prompt, and confirm.
5. Return to GKD. In basic mode, the status should indicate **Accessibility is running (无障碍正在运行)**.

![Official GKD authorization example showing the manual authorization entry =816x1808](https://registry.npmmirror.com/@gkd-kit/assets/0.0.21/files/assets/0001.png)

*Source: [official getting-started guide](https://gkd.li/guide/). This is an example; current versions may call ordinary authorization Basic, and Android settings vary.*

### If Android shows Restricted settings

Long-press GKD's launcher icon and open **App info**. Look in the top-right menu or advanced settings for **Allow restricted settings**, confirm as prompted, then retry accessibility authorization. Consult the [official restricted-settings guidance](https://gkd.li/guide/faq#restriction) for your system.

If that option is absent, follow the system-specific explanation instead of disabling the phone's overall security protections.

**Completion check:** GKD reports that accessibility is running. If Android's switch is on but GKD reports a fault, try turning that service off and on; see the [accessibility troubleshooting guide](https://gkd.li/guide/faq#unable_open_a11y) if it persists.

## Step 3: import a rule subscription

**GKD currently does not bundle default rules.** The app executes actions; rules specify the app, conditions, and target. Its [README](https://github.com/gkd-kit/gkd#订阅) describes local rules and remote subscriptions.

A subscription here means a **rule-file update URL**, not a paid membership. This route uses one existing rule file, with no coding required.

### The subscription used in this guide

We use [aoguai's GKD subscription](https://github.com/aoguai/subscription), displayed as **奥怪的GKD订阅**. It is a **third-party community project**, not an official GKD default subscription. Read its project description, [license](https://github.com/aoguai/subscription/blob/custom/LICENSE), and [usage notice](https://github.com/aoguai/subscription/blob/custom/LEGAL.md) before importing. Startup-related rules are its main default-enabled rules; other features need deliberate selection.

On a phone, long-press the [primary rule link](https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5) and choose Copy link address, then paste it into GKD. You can also copy this entire line:

```text
https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5
```

If retrieval fails, long-press and copy the [alternative rule link](https://cdn.jsdelivr.net/gh/aoguai/subscription@custom/dist/aoguai_gkd.json5), or use the address below. Its maintainer lists this alternative for the same file:

```text
https://cdn.jsdelivr.net/gh/aoguai/subscription@custom/dist/aoguai_gkd.json5
```

**Choose one, not both.** Both addresses returned parseable rule files when this guide was updated. Availability on your connection and mirror freshness still depend on the actual import.

### Import it inside GKD

1. Tap **Subscriptions (订阅)** in the bottom navigation.
2. Tap the **＋** at the bottom right.
3. Paste the full URL into the subscription-link field.
4. Tap **Confirm (确定)** and wait for the download.
5. Check that **奥怪的GKD订阅** appears and its switch is enabled.
6. Tap that card. The detail sheet should contain **Global rules (全局规则)**, **App rules (应用规则)**, and **Rule categories (规则类别)**.

![Official GKD subscription example with the add button at the bottom right =1280x2772](https://registry.npmmirror.com/@gkd-kit/assets/0.0.21/files/assets/0049.png)

*Source: [official introduction](https://gkd.li/guide/what-is-gkd). Names, versions, and counts are example data. Import one remote subscription for this guide.*

**Completion check:** the correct subscription name, version, and rule contents appear, and the subscription is enabled. The checked file was v89; future versions need not match. Only seeing Local subscription, Loading, File missing, or an update error means this step is incomplete.

Use the `.json5` **file URL**, not the GitHub repository homepage. The latter returns a web page rather than rules.

## Step 4: enable startup rules and verify an action

Start with startup ads; leave other categories unchanged.

### Check three places

1. **Home:** accessibility is running in basic mode.
2. **Subscriptions:** the imported subscription is on, and the top **Rule matching (规则匹配)** master switch is enabled. In this version, it uses a lightning icon.
3. **Subscription details:** open Rule categories and enable **Startup ads (开屏广告)**. Then open Global rules and confirm that its **Startup ads** group is enabled too. Category settings and global groups are separate controls.

The demonstration subscription already has startup defaults. Avoid enabling permission, login, or update-handling categories just to make everything automatic.

### Test with an app you already use

1. Pick an app where you have actually seen a startup ad with a Skip button.
2. Return to the launcher, remove **that target app** from recent tasks, and launch it again. Leave GKD running.
3. If an ad appears, do not tap it immediately. Observe whether its skip control is handled automatically.
4. Return to GKD Home and open **Trigger history (触发记录)**. Look for the matching app and rule at that time.
5. Continue using the target app and check that wanted screens remain open and no ad detail was opened by mistake.

![Official GKD home example showing the trigger-history entry =1280x2772](https://registry.npmmirror.com/@gkd-kit/assets/0.0.21/files/assets/0048.png)

*Source: [official introduction](https://gkd.li/guide/what-is-gkd). Subscription and trigger counts are examples, not expected results of this setup.*

**Completion check:** the intended button was handled correctly and the corresponding action appears in history. A larger trigger count alone does not prove the right control was clicked.

An ad does not appear at every launch. No ad is not a failed test, and an ad timing out by itself is not proof of GKD acting. Temporarily disabling Rule matching can help compare behavior; restore it afterward. Ad delivery may differ between launches, so that comparison is only supporting evidence.

## Step 5: enable one additional feature

Once startup skipping works, try a specific extra task. You can automate one action in one app without enabling every category.

This subscription includes **Bilibili → 功能类-自动点击评论区的[展开更多评论]**, which clicks Expand more comments. Skip this example if you do not use Bilibili.

1. Open **Subscriptions → 奥怪的GKD订阅 → App rules**.
2. Search for **哔哩哔哩**, then open its rule list. Install the target app first. If filtering hides it, you can also search under the bottom Apps tab and open its rule summary.
3. Enable only **功能类-自动点击评论区的[展开更多评论]**. Leave the overall Functional category alone.
4. In Bilibili, open a video's detail/comments view and find a comment location that actually shows **展开更多评论**. Observe whether that button is clicked.
5. Check the corresponding trigger entry. Turn that rule group off to return to manual expansion.

The rule requires a matching screen and button text. A missing button or changed layout cannot be fixed merely by enabling its switch. Its current name and conditions can be checked in the [subscription file](https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5).

Other tasks, such as dismissing a supported Taobao promotion, follow the same pattern: find the app, read the description, enable one needed group, and verify it. Keep payment, login authorization, and deletion decisions manual.

## Step 6: check background operation

If actions work briefly after opening GKD but stop later, check whether Android is suspending it.

1. In recent tasks, **lock GKD's task card** if your system supports it. The gesture or menu varies.
2. If interruptions continue, enable **Persistent notification (常驻通知)** on GKD Home. Allow its notification permission when asked.
3. In GKD's Android App info, allow background activity and auto-start as needed. Set **GKD's own battery policy** to unrestricted or the equivalent option.
4. Use the phone normally, then retest the previously verified app and inspect service status/history. Check again after restarting the phone.

The [official background guidance](https://gkd.li/guide/faq#persistent) describes these options. Adjust GKD's settings rather than the entire phone's power-saving configuration.

## Troubleshooting: follow this order

### Nothing happens anywhere

Check **accessibility running → Rule matching on → subscription on → relevant rule on → target button actually present**.

If the first four checks pass but the button is absent, wait for a real matching scene. If the button is present with no trigger, inspect the **App whitelist (应用白名单)**. In GKD, that list exempts apps from rule processing; it is not an allowlist for automation.

### Import fails or keeps loading

Check for a complete URL without trailing punctuation or spaces. Open it in the phone browser: it should display or download rule text. If unreachable, try the alternative URL above. More subscriptions will not solve a connection failure.

### It worked, then stopped

Check Home's service status first. If accessibility stopped or faulted, reauthorize and revisit background settings. If it is running, check rule updates and the target app's compatibility.

To update rules, pull down on the Subscriptions page or use **Update subscriptions (更新订阅)** in subscription settings. Updating the GKD app and updating its rules are separate tasks.

### Only one app fails

Check its rule list and enabled groups. A global startup rule can sometimes handle an app without a dedicated app group; having an app listed likewise does not guarantee every screen is covered.

An interface redesign may require an updated rule. Include the app name, version, and affected screen in feedback. Remove chats, phone numbers, account details, and other private information before sharing screenshots or snapshots.

### A rule clicked the wrong thing

**Disable Rule matching first.** Open Trigger history, locate the action, choose **View rule (查看规则)**, and disable the responsible group before restoring the master switch. Global-rule records also provide options such as **Disable in this app (在此应用禁用)** to narrow the change.

Identifying the rule is more useful than immediately deleting everything and reinstalling.

## Common questions

### Do I need Root, Shizuku, or programming?

No for this basic setup. Ordinary accessibility and the existing subscription let you try supported actions. Consider advanced working modes only after the basic route is configured and you have a specific need.

### What about battery use?

It depends on enabled rules and usage. The [official battery explanation](https://gkd.li/guide/faq#power) identifies rules, interface nodes, and event refresh as factors. Start with one subscription and a small set of useful rules, then observe your own phone.

### What does accessibility mean for privacy?

It is a significant permission that supports interface reading and actions. Check both the application source and the rule source. The [developer's privacy policy](https://gkd.li/guide/privacy) says screen text, rules, debug screenshots, and logs are processed locally; subscription imports and update checks may use the network. This is a policy statement, not an independent security audit.

Avoid unknown rules and keep sensitive confirmations under your control.

### How do I stop it?

Disable Rule matching to pause actions. Disable GKD in Android Accessibility settings to stop its accessibility access. Back up custom configuration you need before uninstalling.

## A useful first configuration

**Official GKD + basic accessibility + one subscription + startup rules** is a sensible first trial. After checking correct actions and background operation, add one or two app-specific tasks.

A saved tap is a small thing. Fewer interruptions every day can make a phone feel much easier to use. That is the reason to try GKD: let rules handle the repetition while you get on with what matters.

## Sources and further reading

Official downloads, v1.12.1 interface implementation, and the demonstration rule file were checked on **October 1, 2026**. Images are official examples. This guide is based on documentation and current interface code; it has not been verified across physical Android devices.

- [What GKD is](https://gkd.li/guide/what-is-gkd), [official download/setup](https://gkd.li/guide/), [stable releases](https://github.com/gkd-kit/gkd/releases/latest)
- [Demonstration subscription](https://github.com/aoguai/subscription), [supported-rule list](https://github.com/aoguai/subscription/blob/custom/dist/README.md)
- [FAQ](https://gkd.li/guide/faq), [privacy policy](https://gkd.li/guide/privacy)
- [Current authorization/working modes](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/AuthA11yPage.kt), [subscription addition/updates](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/home/SubsManagePage.kt), [subscription details](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/component/SubsSheet.kt)
- [App rule controls](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/AppConfigPage.kt), [category controls](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/SubsCategoryPage.kt), [trigger history](https://github.com/gkd-kit/gkd/blob/v1.12.1/app/src/main/kotlin/li/songe/gkd/ui/ActionLogPage.kt)
- [Li Tiaotiao community rules](https://github.com/kernelai/LiTiaotiao), [report on its 2023 update pause](https://app.xinhuanet.com/news/article.html?articleId=7b5425b5-fff5-4b21-90c4-22001a09ce3c)
- [Clash on Android: download, setup, and subscriptions](/en/article/eh8f4n86/). GKD itself does not provide a network proxy.
