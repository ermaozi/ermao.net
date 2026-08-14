---
title: HyperOrbit 使用教程：Android、iPhone、iPad、Mac 与 Apple TV 配置指南（2026）
createTime: 2026/08/15 07:27:12
updateTime: 2026/08/15 07:27:12
permalink: /blog/HyperOrbit/
tags:
  - HyperOrbit
  - Android翻墙
  - iOS翻墙
  - iPhone科学上网
  - iPad翻墙
  - Mac科学上网
  - Apple TV
  - 代理工具
  - VLESS
  - Trojan
  - 翻墙教程
description: 2026年 HyperOrbit 使用教程，覆盖 Android、iPhone、iPad、Apple TV 和 Apple Silicon Mac 安装、订阅导入、路由、测速及常见问题。
---
# HyperOrbit 使用指南（Android / iPhone / iPad / Mac / Apple TV）

HyperOrbit 是一款基于自研 HyperCore 内核的代理客户端，支持 VLESS、VMess、Shadowsocks、Trojan、AnyTLS、Hysteria2、TUIC 等协议。官方当前提供 Android、iPhone、iPad、Apple TV 和 Apple Silicon Mac 版本。

> HyperOrbit 是代理工具，本身不提供节点服务，需要你自备订阅或节点。

<!-- more -->

::: tip 还没有节点？
如果你还没有可用的订阅链接，可以参考我们整理的 [便宜好用的翻墙机场推荐评测](/posts/vpn/)，选一个稳定的服务商再回来配置。
:::

---

![Connected =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_230232-cd78fc.png)

> 本文现有截图来自 iPhone 版；Android 和 Apple TV 的布局、按钮名称可能随版本不同。

---

## 为什么选择 HyperOrbit

**自研 HyperCore 内核，协议支持更全面**
开发者称 HyperCore 使用 C++ 构建，兼容 Xray 配置，并已加入 Clash 节点导入，支持 VLESS + Reality、VMess、Shadowsocks、Trojan 等。Reality 的实际隐蔽性仍取决于节点配置和当前网络。

原始 iOS 资料记录的开发者测试数据为：VPN 启动后约 ==5 MB==，高负载下低于 ==15 MB==；Mac 与 iPhone 直连的 `iperf3` 本地测试超过 ==6.5 Gbps==。这些不是本站独立测试，也不代表实际互联网速度。

**多种导入方式，上手零门槛**
手机版支持订阅 URL、二维码、剪贴板和手动节点导入；Apple TV 版支持二维码或文本输入。

**规则路由，国内外流量自动分流**
内置"规则"模式，国内网站直连、海外流量走代理，无需手动配置，日常使用体验更流畅。

**iCloud 同步，多设备无缝切换**
苹果设备上的订阅、节点和设置可通过 iCloud 同步；Android 版不适用这一步。

**节点测速，辅助筛选线路**
支持批量测试节点的 TCP 延迟。低延迟只是一项参考，还要结合实际应用和持续吞吐量选择。

---

## 价格

截至 2026 年 8 月 15 日，[Apple 美国区 App Store](https://apps.apple.com/us/app/hyperorbit/id6761375312) 列出 ==$0.99 / 月==、==$1.99 / 年== 和 ==$9.99 买断==，新用户有 ==7 天免费试用==。[Google Play](https://play.google.com/store/apps/details?id=net.hyperorbit.app.fast) 当前也标注“应用内购买”和 7 天试用，具体价格以 Android 应用内结算页为准。

7 月 21 日提供的 Android 资料曾写“免费体验”，但它不再能作为当前免费承诺。价格、试用和上架地区都可能变化，请在订阅前检查自己账号的商店页面。

![Free Trial =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231550-c18a35.png)

> 原文提供的 [TestFlight 公测](https://testflight.apple.com/join/TmUdbPCt) 链接当前显示“测试名额已满”，不建议把它当作稳定的免费获取方式。

---

## 使用前准备

| 项目 | 要求 |
|------|------|
| Android | >= 8.0（附件资料标注） |
| iOS | >= 16.0 |
| iPadOS | >= 16.0 |
| macOS (Designed for iPad) | >= 13.0 |
| tvOS | >= 17.0 |

另外你需要准备好：

- **一个可用的代理订阅链接或节点 URI**（HyperOrbit 不提供节点服务）
- 苹果设备需要 **HyperOrbit 已上架地区的 Apple ID**
- Android 设备需要能访问 Google Play

---

## 一、下载安装

优先从官方商店下载，不要从不明网盘安装修改版。

- **[App Store](https://apps.apple.com/us/app/hyperorbit/id6761375312)**
- **[Google Play](https://play.google.com/store/apps/details?id=net.hyperorbit.app.fast)**
- **[HyperOrbit 官网](https://app.hyperorbit.net/)**
- **[TG 交流群](https://t.me/HyperOrbitNet)**

### iPhone / iPad

如果当前区域可用，在 App Store 搜索 **HyperOrbit** 或打开上方官方页面安装。中国大陆区商店可能无法搜索，以当前商店实际显示为准。

### Android

在 Google Play 搜索 **HyperOrbit - Fast VPN & Proxy** 或打开上方链接安装。附件资料标注 Android 8.0 及以上；如果商店显示不兼容，以 Google Play 对当前设备的判断为准。官方网站目前的 Android 下载按钮同样指向 Google Play。

### Apple TV

App Store 当前列出 Apple TV 支持，最低需要 tvOS 17.0。在 Apple TV 的 App Store 搜索 **HyperOrbit** 安装；官方 tvOS 介绍列出二维码或文本输入订阅，也可使用 iCloud 同步苹果设备上的配置。

### Mac

HyperOrbit 支持以「Designed for iPad」的方式在 Apple Silicon Mac（M1 及以上）上运行，**无需单独下载 Mac 版**。

在 Mac 上打开 App Store，使用已上架地区的账号搜索 **HyperOrbit**，即可安装 iPad 版并在 Mac 上运行。

Mac 版额外支持：
- **TUN 模式**：将所有系统流量通过隧道转发，可在**设置 → Mac 设置**中开关
- **SOCKS5 本地代理**：可配置自定义端口，供其他应用单独使用
- 完整的键鼠交互和窗口缩放

> **注意**：Mac 版基于 iPad App 运行。如果 macOS 请求权限，请在「系统设置 → 隐私与安全性」中核对后允许。Intel Mac 不支持。

---

## 二、导入节点 / 订阅

HyperOrbit 支持四种导入方式，选一种最方便的即可：

> 下面以手机版为主。Android 的中文按钮名来自附件资料，会随版本变化；Apple TV 请使用二维码、文本输入或 iCloud 同步。

### 方式一：订阅链接（推荐）

适合从机场购买订阅的用户，可以一次导入全部节点，还支持一键更新。

1. 首页点击右上角 **+**
2. 选择 **添加订阅**
3. 粘贴订阅 URL
4. 确认导入

![Add Sub =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_230305-edc2ac.png)

![Add Sub2 =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_230313-2902b2.png)

### 方式二：扫描二维码

适合别人分享节点给你的场景。

1. 首页点击右上角 **+**
2. 选择 **扫描二维码**
3. 对准二维码扫描

![Scan QRCode =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_230845-da0f61.png)

### 方式三：剪贴板导入

复制好节点 URI（如 `vless://...`、`vmess://...`），然后：

1. 首页点击右上角 **+**
2. 选择 **从剪贴板导入**
3. 确认

### 方式四：手动添加单个节点

如果你有节点的具体参数（服务器地址、端口、UUID 等），可以手动填入：

1. 首页点击右上角 **+**
2. 选择 **添加节点**
3. 按协议填写参数

---

## 三、连接

导入节点后，在首页的节点列表中**点击选中**目标节点，然后点击连接按钮。

首次连接时：

- iPhone / iPad 会请求添加 VPN 配置，确认后通过 Face ID 或密码验证。
- Android 会请求允许创建 VPN 连接，核对应用后点击确定。如果另一个 VPN 正在运行，需要先断开它。

![Connect =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_230953-b90205.png)

连接成功后状态栏会出现 ==VPN== 标识。

---

## 四、路由模式

附件教程中的版本提供下列三种路由结果。2026 年 8 月的 iOS 1.4.x 版本已将原来分开的“模式”和“规则”合并到首页的“路由”选择器；Android 或其他版本的位置可能不同。

| 模式 | 说明 | 适合场景 |
|------|------|----------|
| **规则** | 国内流量直连，境外流量走代理 | 日常使用，兼顾速度与体验 |
| **全局** | 所有流量都走代理 | 测试节点连通性，或需要全程走代理 |
| **直连** | 所有流量直连，不经过代理 | 临时关闭代理但保持 VPN 开启 |

排查连通性时可以短暂使用 ==全局==，日常使用通常选 ==规则==。如果当前版本没有单独的模式按钮，请在“路由”选择器中找对应选项。

![Mode =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231009-a016d7.png)
![Rules =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231013-c163ec.png)

---

## 五、节点测速

在首页点击 ==全部测速==，HyperOrbit 会对所有节点发起 TCP 延迟测试，结果会显示在每个节点右侧。

可以先试用 ==延迟较低== 的节点，再用实际网页、视频或下载测试稳定性与持续速度。

![Ping =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231025-873908.png)

---

## 六、iCloud 同步（仅苹果设备）

换新手机或在 iPad 上也想用同一套配置？进入 **设置 → iCloud 同步**，选择 ==全部上传到 iCloud==。

在新设备上登录同一 iCloud 账号，打开 HyperOrbit，同样进入 iCloud 同步页面，选择 ==从 iCloud 全部下载==，所有订阅和节点即可恢复。

![iCloud =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231041-8bc167.png)

![iCloudDetail =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231053-a776aa.png)

---

## 七、高级功能

以下功能主要来自手机和 Mac 版资料；Apple TV 是否显示相同入口，以当前 tvOS 版本为准。

### 活跃连接实时查看

HyperOrbit 会记录所有经过隧道的连接，在首页点击连接卡片上的活跃连接数，可以进入**连接统计**页面，实时查看每一条连接的：

- 目标域名 / IP
- 所用代理节点
- 上传 / 下载流量
- 连接状态（活跃 / 已关闭）

![Connection View =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231113-2a017e.png)

这对排查「哪个 App 在偷跑流量」或「某个请求走了直连还是代理」非常有用。

### 流量统计与慢连接分析

**统计**页面提供按域名聚合的连接数据，帮助你发现潜在问题：

- **DNS 解析慢**：如果某个域名的首次连接耗时明显高于后续连接，通常是 DNS 解析拖慢了速度，可以考虑在配置中为该域名指定直连或更换 DNS 服务器
- **持续高延迟的域名**：通过连接耗时排序，快速定位哪些域名走代理后仍然很慢，针对性地调整路由规则
- **直连 vs 代理分布**：直观看出哪些流量走了代理、哪些直连，验证规则路由是否按预期工作

<!-- 截图：统计页面，域名列表带连接耗时数据 -->
![Stats View =1170x2532](https://image.ermao.net/images/blog/HyperOrbit/20260527_231129-7cc9cb.png)
---

## 常见问题

:::details Q：连接后网络没变化 / 还是上不了某些网站？
检查路由模式是否设置为 ==规则== 或 ==全局==。可以用 ==全局== 模式短暂测试；如果全局也失败，节点、订阅配置或当前网络都可能有问题，可更换节点或联系服务商。
:::

:::details Q：订阅导入失败？
- 先在浏览器中直接打开订阅链接，确认链接本身可以访问
- 某些机场需要特定的 User-Agent，可以在 **设置 → 订阅 User-Agent** 中修改（常用值：`clash-verge/1.0.0`、`v2rayNG/1.8.0`）
- 如果订阅域名本身被屏蔽，需要先通过其他方式翻墙后再导入
:::

:::details Q：iOS 点击连接后立刻断开？
iOS 可能在 VPN 扩展超过内存限制时终止连接，该限制常被记录为约 ==50 MB==。可以尝试：
- 减少同时启用的自定义配置数量（内置规则没问题）
- 在设置中将日志级别调低（调为 `Warning` 或 `Error`，默认为 `None`）
:::

:::details Q：Android 点击连接后无反应或立即断开？
- 确认已授予 Android VPN 权限
- 断开其他正在运行的 VPN 应用
- 将日志级别调为 `Warning` 或 `Error` 后重试
:::

:::details Q：Mac 上可以用吗？
可以。HyperOrbit 支持在 ==Apple Silicon Mac（M1 及以上）== 上以 iPad App 方式运行，在 App Store 搜索安装即可。Mac 版额外提供 TUN 模式和 SOCKS5 本地代理，可在 **设置 → Mac 设置** 中配置。==Intel Mac 不支持==。
:::

:::details Q：Apple TV 上可以用吗？
可以。App Store 当前列出 tvOS 17.0 及以上支持，tvOS 版可通过二维码、文本输入或 iCloud 同步导入配置。
:::

:::details Q：HyperOrbit 国区 App Store 能下载吗？
截至 2026 年 8 月 15 日，中国大陆区的 App Store 页面不可用，需要使用已上架地区的账号下载。如果没有海外账号，可以先阅读 [2026 最新免费美区 Apple ID 共享账号](/blog/freeappleid/) 中的安全限制。
:::

:::details Q：Android 必须通过 Google Play 下载吗？
当前官方网站的 Android 下载按钮指向 Google Play，附件资料也未提供官方 APK。在官方发布可验证的直下载前，不建议使用第三方 APK。
:::

:::details Q：HyperOrbit 会收集我的数据吗？
官方网站称不记录流量；Google Play 的开发者申报称不收集或共享数据；Apple App Store 的隐私标签则写明，应用可能收集不与身份关联的使用数据和诊断数据。这些都是开发者申报，本站未独立审计应用流量；如果隐私很重要，请同时检查当前商店隐私标签、[隐私政策](https://app.hyperorbit.net/privacy) 和系统权限。
:::

---

## 支持的协议

HyperOrbit 基于自研 HyperCore，支持以下协议：

| 协议 | 支持的传输层 / 说明 |
|------|--------------------|
| **VLESS** | Reality、TLS、WS、gRPC、HTTP/2 |
| **VMess** | TLS、WS、gRPC、HTTP/2 |
| **Shadowsocks** | AEAD 加密；**ShadowsocksR** 同样支持 |
| **Trojan** | TLS |
| **AnyTLS** | — |
| **Hysteria2** | — |
| **TUIC** | — |

---

> HyperOrbit 持续更新中，如有问题欢迎加入官方 [TG 交流群](https://t.me/HyperOrbitNet) 反馈。
