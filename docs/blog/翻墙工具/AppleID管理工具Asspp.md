---
title: Asspp下载使用教程：iPhone多账号切换App Store、跨区下载应用神器
createTime: 2026/02/24 07:29:07
permalink: /blog/asspp-download-guide/
tags:
  - Apple ID
  - App Store
  - 跨区下载
  - iOS工具
  - TrollStore
  - 科学上网
  - Asspp
description: 2026最新Asspp下载安装使用教程，iPhone/Mac多Apple ID管理、一键切换美区日区港区App Store、跨区下载应用、提取IPA安装包、回退App旧版本，附详细图文步骤。
---

# Asspp下载使用教程：iPhone多账号切换App Store、跨区下载应用神器

很多果粉都有这样的烦恼：想下载美区的 ChatGPT、日区的游戏，或者某个 App 更新后变难用了想退回旧版——但每次都要退出 Apple ID、重新登录、换区，操作繁琐又容易出问题。

**Asspp** 就是为了解决这个痛点而生的工具。简单来说，它能让你**同时管理多个 Apple ID**，在不同国家的 App Store 之间**一键切换**，下载任何区域的应用，而且**完全不用退出你手机上的系统账号**。

> 💡 **使用 Asspp 下载外区应用时，你可能需要科学上网环境才能正常连接 Apple 服务器。** 如果你还没有稳定的翻墙工具，可以先看看这篇 👉 [2026年好用的翻墙机场推荐](/posts/vpn/)，找一个适合自己的线路。

<!-- more -->

## Asspp 能做什么？

![Asspp界面预览](https://image.ermao.net/images/blog/asspp-download-guide/20260224_073116-3c6273.png)

在开始安装之前，先了解一下 Asspp 到底有哪些实用功能：

| 功能 | 说明 | 适合谁 |
|------|------|--------|
| 🌍 **一键切换 App Store 区域** | 美区、日区、港区、国区……随意浏览，不用换区 | 想下载外区独占 App 的用户 |
| 👥 **多 Apple ID 管理** | 添加多个账号，自动匹配对应区域下载 | 有多个 Apple ID 的用户 |
| 📦 **下载 IPA 安装包** | 从苹果服务器直接下载正版 IPA 文件 | 需要备份 App 或用巨魔安装的用户 |
| ⏪ **下载 App 旧版本** | 查看并下载某个 App 的历史版本 | App 更新后变卡/变难用，想退回旧版 |
| 📱 **支持 iOS + macOS** | 两个平台都能用，体验流畅 | 苹果全家桶用户 |

## Asspp 安装教程

### 方法一：iOS 手动安装（推荐新手）

这是最简单直接的方式，不需要折腾 GitHub：

1. **下载 IPA 文件**：打开 [Asspp Releases 页面](https://github.com/Lakr233/Asspp/releases)，找到最新版本，下载 `.ipa` 文件
2. **选择签名工具安装**：
   - **TrollStore（巨魔）用户**：直接用巨魔安装，最省心
   - **AltStore 用户**：通过 AltStore 侧载安装
   - **SideStore 用户**：WiFi 无线安装，不需要连电脑
3. **打开 Asspp**，登录你的 Apple ID 即可开始使用

> 如果你不知道什么是巨魔/AltStore，简单理解就是：它们是 iPhone 上安装第三方 App 的工具，类似安卓的 APK 安装。

### 方法二：iOS 自动构建（适合有开发者账号的用户）

如果你有 Apple 开发者证书，可以通过 GitHub Actions 实现自动构建和推送更新：

1. 在 GitHub 上 **Fork** [Asspp 仓库](https://github.com/Lakr233/Asspp)
2. 配置 GitHub Actions，填入你的开发者证书信息
3. 构建完成后会生成一个 **OTA 安装链接**，以后直接在手机浏览器打开就能安装/更新


::: collapse

- 详细配置指南（点击展开）

    [详细配置指南英文原文](https://github.com/Lakr233/Asspp/blob/main/Resources/Document/FORK_AUTOBUILD_GUIDE.md)

    # GitHub Actions 自动构建与签名指南

    本指南介绍如何设置你自己 Fork 的 Asspp 仓库，通过 GitHub Actions 自动构建、签名并发布应用。

    这样做的好处：

    1.  **始终保持最新版本**：工作流会自动拉取上游仓库的更新。
    2.  **OTA 安装**：通过网页链接直接在 iPhone 上安装应用，无需电脑。
    3.  **自动签名**：使用你自己的 Apple 开发者证书完成签名。

    ---

    ## 1. 前置条件

    - **Apple 开发者账号**：需要付费账号才能创建所需的证书和描述文件。
    - **签名资源**：
    - **分发证书**：从钥匙串访问（Keychain Access）导出的 `.p12` 文件（需设置密码）。
    - **描述文件**：包含你设备 UDID 的 Ad Hoc `.mobileprovision` 文件。
    - **GitHub 账号**：用于 Fork 仓库和运行 Actions。

    ## 2. Fork 并配置仓库

    1.  将 [Asspp 仓库](https://github.com/Lakr233/Asspp) **Fork** 到你的账号下。
    2.  进入 **Settings** -> **Actions** -> **General**。
        - 在 "Workflow permissions" 下，选择 **Read and write permissions**（读写权限）。
        - 点击 **Save** 保存。
    3.  进入 **Settings** -> **Pages**。
        - 在 "Build and deployment" 下，将 **Source** 设为 **GitHub Actions**。

    ## 3. 配置 Secrets 和 Variables

    你需要将签名密钥提供给 GitHub，这样它才能帮你签名应用。

    ### 方式 A：自动配置（推荐）

    我们提供了一个脚本来自动生成所需的值。

    1.  打开终端，进入项目目录。
    2.  运行辅助脚本：

        ```bash
        ./Resources/Scripts/generate.github.action.inputs.sh \
        --p12 /path/to/your/certificate.p12 \
        --p12-password 'your-p12-password' \
        --mobileprovision /path/to/your/profile.mobileprovision
        ```

    3.  脚本会输出一组 Secrets 和 Variables 的值。你可以：
        - 手动复制粘贴到 GitHub Settings 中。
        - 或者使用生成的 `apply-with-gh.sh` 脚本（需要安装 `gh` CLI 工具）自动应用。

    ### 方式 B：手动配置

    进入 **Settings** -> **Secrets and variables** -> **Actions**。

    #### Secrets（新建仓库密钥）

    | 名称                              | 值                | 说明                                               |
    | :-------------------------------- | :---------------- | :------------------------------------------------- |
    | `IOS_CERT_P12_BASE64`             | `[Base64 字符串]` | 你的 `.p12` 证书文件转换为 Base64 后的内容。       |
    | `IOS_CERT_PASSWORD`               | `[字符串]`        | 你的 `.p12` 文件的密码。                           |
    | `IOS_PROVISIONING_PROFILE_BASE64` | `[Base64 字符串]` | 你的 `.mobileprovision` 描述文件转换为 Base64 后的内容。 |

    _在 macOS 上获取 Base64：_ `base64 -i certificate.p12 | pbcopy`

    #### Variables（新建仓库变量）

    | 名称                | 值               | 说明                                                                                                     |
    | :------------------ | :--------------- | :------------------------------------------------------------------------------------------------------- |
    | `IOS_BUNDLE_ID`     | `wiki.qaq.Asspp` | **重要**：必须与你的描述文件（Provisioning Profile）中的 App ID 一致。                                   |
    | `IOS_EXPORT_METHOD` | `ad-hoc`         | 通常填 `ad-hoc`。                                                                                        |
    | `IOS_OTA_BASE_URL`  | _（可选）_       | 如果你为 GitHub Pages 使用了自定义域名，在此填入（如 `https://apps.example.com`）。否则留空。             |

    ## 4. 触发构建

    1.  进入你 Fork 仓库的 **Actions** 标签页。
    2.  在左侧选择 **Upstream Signed iOS Build** 工作流。
    3.  点击 **Run workflow**。
        - 输入项保持默认即可。
    4.  等待构建完成（通常需要 5-10 分钟）。

    ## 5. 安装应用

    构建完成后：

    1.  进入你仓库的 **Releases** 页面，应该能看到一个新的发布版本。
    2.  在 iPhone 上用 **Safari** 打开 **安装页面**：
        - 链接格式：`https://<你的用户名>.github.io/<仓库名>/ios/latest/install.html`
    3.  点击 **Install（安装）**。

    ## 常见问题排查

    - **提示"无法验证 App"**：前往 iOS 设置 -> 通用 -> VPN 与设备管理，信任你的证书。
    - **安装一直等待中**：确认你的设备 UDID 已包含在上传的描述文件中。
    - **构建失败**：查看 Actions 日志。常见错误包括 Bundle ID 不匹配或证书过期。

:::

### 方法三：macOS 安装

Mac 端安装非常简单：

1. 前往 [Releases 页面](https://github.com/Lakr233/Asspp/releases) 下载最新的 `.zip` 文件
2. 解压后，将 `Asspp.app` 拖到「**应用程序**」文件夹
3. **首次打开**时，macOS 可能会弹出安全提示，按以下步骤处理：

**如果提示"无法打开"：**
- 在 Finder 中找到 `Asspp.app` → **右键点击** → 选择「**打开**」→ 在弹窗中再点一次「**打开**」
- 这样操作一次后，以后就能正常双击打开了

**如果右键打开也不行：**
- 打开「**系统设置**」→「**隐私与安全**」
- 滚动到底部，找到被阻止的 Asspp，点击「**仍要打开**」
- 输入你的 Mac 开机密码确认

> 这是 macOS 的正常安全机制（Gatekeeper），不是 Asspp 有问题，所有非 App Store 下载的应用都会遇到。

## 系统要求

- **iPhone/iPad**：需要 iOS 17.0 或更高版本
- **Mac**：需要 macOS 15.0 或更高版本
- **Apple ID**：至少需要一个 Apple ID 来登录（建议用备用号，原因见下文）

## 使用 Asspp 的注意事项

::: warning 重要安全提醒
**请一定使用备用 Apple ID 登录 Asspp，不要使用你的主力账号！**

原因很简单：Asspp 使用的底层协议（和 ipatool 相同）并非苹果官方公开支持的方式。虽然目前还没出现过账号被封的极端案例，但理论上苹果有权对此类行为做出限制。如果你的主力 Apple ID 被封，可能会导致 **iPhone 被激活锁锁定**，后果非常严重。

另外，**你的设备 GUID 类似于密码，千万不要泄露给别人**。
:::

::: info 关于协议稳定性
Asspp 底层使用的通信协议曾经历过几次失效，可能的原因包括：
- 太多人滥用，触发苹果风控
- 苹果修改了接口或协议
- 苹果加强了网关安全策略

如果将来协议再次失效，Asspp 可能无法修复。所以趁现在能用，赶紧把需要的 App 和 IPA 下载好。
:::

## 没有外区 Apple ID？教你注册一个

要使用 Asspp 跨区下载应用，你至少需要一个外区 Apple ID。如果你还没有，可以参考我们的教程：👉 [免费外区Apple ID获取方法](../翻墙工具/免费AppleID账号.md)

## 搭配科学上网效果更佳

Asspp 连接 Apple 服务器下载外区应用时，有时需要对应地区的网络环境。搭配一个稳定的翻墙工具，可以让下载更顺畅、连接更稳定。

如果你还没有合适的科学上网工具，推荐阅读：

- 👉 [2026年便宜好用的翻墙机场推荐](/posts/vpn/) — 精选高性价比机场，低至2元/月
- 👉 [iPhone 翻墙教程（Shadowrocket）](../翻墙工具/Shadowrocket新手使用教程.md) — 小火箭配合 Asspp 使用效果最佳
- 👉 [电脑翻墙教程](../翻墙工具/电脑如何翻墙.md) — Mac 上使用 Asspp 时的翻墙方案

## 常见问题

### Asspp 登录时报错怎么办？

检查你的网络环境，确保能正常连接 Apple 服务器。如果在国内直连不行，请开启 [科学上网工具](/posts/vpn/) 后再试。

### Asspp 和直接换区有什么区别？

直接在系统设置里换区需要退出当前 Apple ID，可能导致 iCloud 数据同步问题。Asspp 完全独立运行，不影响你手机上的任何设置和数据。

### 下载的 IPA 文件有什么用？

IPA 是 iOS 应用的安装包。你可以用它来：备份喜欢的 App、通过巨魔安装到其他设备、保存旧版本以备不时之需。

### 免费吗？

Asspp 是开源免费的工具，代码托管在 [GitHub](https://github.com/Lakr233/Asspp) 上，任何人都可以查看源码。

---

::: tip 免责声明
本文仅供学习和研究参考，Asspp 是第三方开源项目，与 Apple Inc. 无关。使用本软件产生的任何后果由用户自行承担。请遵守当地法律法规。
:::
