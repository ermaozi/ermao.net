---
title: HyperOrbit 使用教程：iPhone / iPad / Mac 科学上网配置指南（2026）
createTime: 2026/05/29 12:12:52
permalink: /blog/HyperOrbit/
tags:
  - HyperOrbit
  - iOS翻墙
  - iPhone科学上网
  - iPad翻墙
  - Mac科学上网
  - 代理工具
  - VLESS
  - Trojan
  - 翻墙教程
description: 2026年 HyperOrbit 完整使用教程，涵盖 iPhone、iPad、Mac 下载安装、订阅导入、路由模式配置及常见问题排查，自研 HyperCore 内核，支持 VLESS Reality、Trojan、TUIC 等主流协议，$1.99/年或 TestFlight 免费体验。
---
# HyperOrbit 使用指南

HyperOrbit 是一款基于自研 HyperCore 内核的代理工具，支持 VLESS、VMess、Shadowsocks、Trojan、AnyTLS、TUIC 等主流协议，适用于 iPhone、iPad 和 Mac，界面简洁，开箱即用。

> HyperOrbit 是代理工具，本身不提供节点服务，需要你自备订阅或节点。

<!-- more -->

::: tip 还没有节点？
如果你还没有可用的订阅链接，可以参考我们整理的 [便宜好用的翻墙机场推荐评测](/posts/vpn/)，选一个稳定的服务商再回来配置。
:::

---

![Connected](https://image.ermao.net/images/blog/HyperOrbit/20260527_230232-cd78fc.png)

---

## 为什么选择 HyperOrbit

**自研 HyperCore 内核，协议支持更全面**
完全通过 C++ 构建，在速度、内存占用方面业界领先，完整兼容 Xray 的配置，原生支持 VLESS + Reality、VMess、Shadowsocks、Trojan。Reality 是目前抗检测能力最强的协议之一，HyperOrbit 对其支持完整。

在性能上，HyperCore 同样表现出色：VPN 启动后内存占用仅约 ==5 MB==，高负载下也不超过 ==15 MB==，远低于 iOS 对 VPN 扩展 50 MB 的内存上限，从根本上杜绝了因内存超限导致的 VPN 意外断连。吞吐量方面，本地实测（Mac 与 iPhone 直连，iperf3）轻松突破 ==6.5 Gbps==，日常使用完全无瓶颈。

**多种导入方式，上手零门槛**
支持订阅链接、扫描二维码、粘贴剪贴板、分享文件四种导入方式，拿到节点后几秒钟即可开始使用。

**规则路由，国内外流量自动分流**
内置"规则"模式，国内网站直连、海外流量走代理，无需手动配置，日常使用体验更流畅。

**iCloud 同步，多设备无缝切换**
订阅、节点、自定义配置均可备份到 iCloud，换设备后一键恢复，无需重新配置。

**节点测速，一键找最快线路**
支持对所有节点批量测速，延迟一目了然，选最快的那个连接即可。

---

## 价格

HyperOrbit 订阅价格为 ==$1.99 / 年==，下载后可 ==免费试用 7 天==，试用期结束前取消，**不收费**。

![Free Trial](https://image.ermao.net/images/blog/HyperOrbit/20260527_231550-c18a35.png)

如果你想完全免费体验完整功能，可以加入 **TestFlight 公测版**：

👉 **[加入 TestFlight 公测](https://testflight.apple.com/join/TmUdbPCt)**

> TestFlight 版本中所有付费功能均免费开放，无需任何购买。

---

## 使用前准备

| 项目 | 要求 |
|------|------|
| iOS | >= 16.0 |
| iPadOS | >= 16.0 |
| macOS (Designed for iPad) | >= 13.0 |

另外你需要准备好：

- **一个可用的代理订阅链接或节点 URI**（HyperOrbit 不提供节点服务）
- **非大陆区 Apple ID**（国区 App Store 无法搜索到）

---

## 一、下载安装

由于众所周知的原因，HyperOrbit 无法在中国区 App Store 下载，需要切换到美区、港区、台湾区等海外账号。

👉 **[前往 App Store 下载](https://apps.apple.com/us/app/hyperorbit/id6761375312)**
👉 **[官网](https://app.hyperorbit.net/)**
👉 **[TG交流群](https://t.me/HyperOrbitNet)**

### iPhone / iPad

在 App Store 搜索 **HyperOrbit** 或点击上方链接直接下载，安装后即可使用。

### Mac

HyperOrbit 支持以「Designed for iPad」的方式在 Apple Silicon Mac（M1 及以上）上运行，**无需单独下载 Mac 版**。

在 Mac 上打开 App Store，切换到海外账号后搜索 **HyperOrbit**，即可安装 iOS 版并在 Mac 上运行。

Mac 版额外支持：
- **TUN 模式**：将所有系统流量通过隧道转发，可在**设置 → Mac 设置**中开关
- **SOCKS5 本地代理**：可配置自定义端口，供其他应用单独使用
- 完整的键鼠交互和窗口缩放

> **注意**：Mac 版基于 iOS App 运行，部分 Apple Silicon 机型首次启动需要在「系统设置 → 隐私与安全性」中允许来自 App Store 的应用。Intel Mac 不支持。

---

## 二、导入节点 / 订阅

HyperOrbit 支持四种导入方式，选一种最方便的即可：

### 方式一：订阅链接（推荐）

适合从机场购买订阅的用户，可以一次导入全部节点，还支持一键更新。

1. 首页点击右上角 **+**
2. 选择 **添加订阅**
3. 粘贴订阅 URL
4. 确认导入

![Add Sub](https://image.ermao.net/images/blog/HyperOrbit/20260527_230305-edc2ac.png)

![Add Sub2](https://image.ermao.net/images/blog/HyperOrbit/20260527_230313-2902b2.png)

### 方式二：扫描二维码

适合别人分享节点给你的场景。

1. 首页点击右上角 **+**
2. 选择 **扫描二维码**
3. 对准二维码扫描

![Scan QRCode](https://image.ermao.net/images/blog/HyperOrbit/20260527_230845-da0f61.png)

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

首次连接时 iOS 会弹出「是否允许添加 VPN 配置」的提示，点击 ==允许==，并通过 Face ID / 密码验证即可。

![Connect](https://image.ermao.net/images/blog/HyperOrbit/20260527_230953-b90205.png)

连接成功后状态栏会出现 ==VPN== 标识。

---

## 四、路由模式

HyperOrbit 提供三种路由模式，在首页顶部可以随时切换：

| 模式 | 说明 | 适合场景 |
|------|------|----------|
| **规则** | 国内流量直连，境外流量走代理 | 日常使用，兼顾速度与体验 |
| **全局** | 所有流量都走代理 | 测试节点连通性，或需要全程走代理 |
| **直连** | 所有流量直连，不经过代理 | 临时关闭代理但保持 VPN 开启 |

日常使用如果不太懂可以先用 ==全局== 模式，最终建议选 ==规则== 模式。

![Mode](https://image.ermao.net/images/blog/HyperOrbit/20260527_231009-a016d7.png)
![Rules](https://image.ermao.net/images/blog/HyperOrbit/20260527_231013-c163ec.png)

---

## 五、节点测速

不确定哪个节点最快？在首页点击 ==全部测速==，HyperOrbit 会对所有节点发起 TCP 延迟测试，测速结果会显示在每个节点右侧。

选 ==延迟最低== 的那个连接即可。

![Ping](https://image.ermao.net/images/blog/HyperOrbit/20260527_231025-873908.png)

---

## 六、iCloud 同步

换新手机或在 iPad 上也想用同一套配置？进入 **设置 → iCloud 同步**，选择 ==全部上传到 iCloud==。

在新设备上登录同一 iCloud 账号，打开 HyperOrbit，同样进入 iCloud 同步页面，选择 ==从 iCloud 全部下载==，所有订阅和节点即可恢复。

![iCloud](https://image.ermao.net/images/blog/HyperOrbit/20260527_231041-8bc167.png)

![iCloudDetail](https://image.ermao.net/images/blog/HyperOrbit/20260527_231053-a776aa.png)

---

## 七、高级功能

### 活跃连接实时查看

HyperOrbit 会记录所有经过隧道的连接，在首页点击连接卡片上的活跃连接数，可以进入**连接统计**页面，实时查看每一条连接的：

- 目标域名 / IP
- 所用代理节点
- 上传 / 下载流量
- 连接状态（活跃 / 已关闭）

![Connection View](https://image.ermao.net/images/blog/HyperOrbit/20260527_231113-2a017e.png)

这对排查「哪个 App 在偷跑流量」或「某个请求走了直连还是代理」非常有用。

### 流量统计与慢连接分析

**统计**页面提供按域名聚合的连接数据，帮助你发现潜在问题：

- **DNS 解析慢**：如果某个域名的首次连接耗时明显高于后续连接，通常是 DNS 解析拖慢了速度，可以考虑在配置中为该域名指定直连或更换 DNS 服务器
- **持续高延迟的域名**：通过连接耗时排序，快速定位哪些域名走代理后仍然很慢，针对性地调整路由规则
- **直连 vs 代理分布**：直观看出哪些流量走了代理、哪些直连，验证规则路由是否按预期工作

<!-- 截图：统计页面，域名列表带连接耗时数据 -->
![Stats View](https://image.ermao.net/images/blog/HyperOrbit/20260527_231129-7cc9cb.png)
---

## 常见问题

:::details Q：连接后网络没变化 / 还是上不了某些网站？
检查路由模式是否设置为 ==规则== 或 ==全局==。另外确认节点本身是可用的——用 ==全局== 模式测试，如果全局也不行，说明节点有问题，更换节点或联系服务商。
:::

:::details Q：订阅导入失败？
- 先在浏览器中直接打开订阅链接，确认链接本身可以访问
- 某些机场需要特定的 User-Agent，可以在 **设置 → 订阅 User-Agent** 中修改（常用值：`clash-verge/1.0.0`、`v2rayNG/1.8.0`）
- 如果订阅域名本身被屏蔽，需要先通过其他方式翻墙后再导入
:::

:::details Q：iOS 点击连接后立刻断开？
通常是内存不足导致的，VPN 扩展在 iOS 上有约 ==50 MB== 的内存限制。建议：
- 减少同时启用的自定义配置数量（内置规则没问题）
- 在设置中将日志级别调低（调为 `Warning` 或 `Error`，默认为 `None`）
:::

:::details Q：Mac 上可以用吗？
可以。HyperOrbit 支持在 ==Apple Silicon Mac（M1 及以上）== 上以 iOS App 方式运行，在 App Store 搜索安装即可。Mac 版额外提供 TUN 模式和 SOCKS5 本地代理，可在 **设置 → Mac 设置** 中配置。==Intel Mac 不支持==。
:::

:::details Q：HyperOrbit 国区 App Store 能下载吗？
不能。HyperOrbit 未在中国区 App Store 上架，需要使用美区、港区、台湾区等海外账号下载。如果没有海外账号，可以参考 [2026 最新免费美区 Apple ID 共享账号](/blog/freeappleid/) 获取。
:::

:::details Q：HyperOrbit 会收集我的数据吗？
不会。HyperOrbit 不会收集任何用户流量数据或个人信息。
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
