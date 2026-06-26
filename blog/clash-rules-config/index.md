---
url: /blog/clash-rules-config/index.md
description: >-
  详解 Clash 分流规则的作用与配置方法，基于 Loyalsoldier 开源规则库，3 步实现国内直连、海外代理、广告拦截。适用于 Clash
  Verge Rev / Clash for Windows 等全客户端，附懒人一键配置代码。
---
你的 Clash 还在"裸奔"吗？不配规则 = 国内网站绕路海外、TikTok 黑屏、Netflix 检测代理、账号随时被封。本文手把手教你用 Loyalsoldier 开源规则库，只需 3 步就能实现国内直连、海外代理、广告拦截，一次配置永久生效。

绝大多数用 Clash 翻墙的人，其实都在"裸奔"——买了机场、导入订阅、选个节点就完事，根本不知道还有「分流规则」要配置。

结果呢？TikTok 黑屏、Netflix 提示代理、国内网站卡得转圈圈，甚至账号莫名被封。

这篇教程就带你**一次性搞定 Clash 规则配置**：搞懂原理、导入规则、永久生效。只需 3 步，有手就行。

> 还没安装 Clash？先看前置教程：
>
> * Windows / Mac / Linux 用户 → [Clash Verge Rev 安装与配置教程](/article/0gematwc/)
> * Android 用户 → [Clash for Android 下载安装教程](/article/eh8f4n86/)
> * 还没买机场？→ [2026 年便宜好用的翻墙机场推荐](/posts/vpn/)

## 什么是 Clash 规则？为什么一定要配？

很多人以为连上代理后，Clash 会自动判断哪些网站该翻墙、哪些该直连。

**其实不是。**

如果你不配精细的分流规则，Clash 根本不知道该怎么处理流量。结果就是：

* 访问淘宝、微信、B 站等国内网站，流量也绕到海外节点去 → **又慢又浪费流量**
* 上一秒用家里宽带登微信，下一秒突然从日本 IP 刷抖音 → **平台风控直接标记异常**
* TikTok、Netflix、推特检测到 IP 频繁跳国家或识别到机房 IP → **账号被拉黑**

**规则，就是解决这个问题的"交通指挥员"。** 它告诉 Clash：

| 流量类型 | 处理方式 | 效果 |
|---------|---------|------|
| 🟢 国内网站及 IP | **直连**（DIRECT） | 走家里宽带，速度拉满 |
| 🔴 被墙的海外网站 | **代理**（PROXY） | 走节点翻墙访问 |
| 🛑 广告和追踪器 | **拦截**（REJECT） | 从底层干掉弹窗广告 |

配好规则后，你的网络活动看起来完全就像一个正常的"当地人"，流量井然有序。

## Clash 规则的工作原理（大白话版）

其实就是**查字典**。

当你访问一个网址时，Clash 会从规则列表里**从上往下逐条匹配**：

1. 查到 `youtube.com` → 规则写着 `PROXY` → 走代理节点
2. 查到 `taobao.com` → 规则写着 `DIRECT` → 走家里宽带
3. 查不到匹配项 → 按最底下的**兜底策略**处理（通常默认走代理，保证冷门海外网站不卡壳）

**规则越全面 = 字典越厚 = Clash 越聪明。** 成熟的开源规则库早已把苹果、谷歌、Telegram 等各大服务，甚至国内精确到 IP 段的流量都覆盖了。

## 推荐规则库：Loyalsoldier/clash-rules

![Loyalsoldier clash-rules GitHub 截图](https://image.ermao.net/images/blog/clash-rules-config/20260228_141256-b26939.png)

在 [上一期小火箭规则教程](/blog/shadowrocket-rules-config/) 中推荐了 Johnshall 规则集，而 **Clash 领域的"武林盟主"则非 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 莫属**，目前接近 30k Star。

它有 3 个核心优势：

### 1. 规则精准度极高

整合了 V2Ray 社区最权威的域名和 IP 名单，国内 IP 段精准无比，Apple、Google、Telegram 等服务都做了独立细分规则。

### 2. 每日自动更新

每天早上 6:30 由 GitHub Actions 自动抓取全网最新数据并重新构建。网站天天变，但你的规则永远是最新的。

### 3. 全客户端兼容

不管你用的是 Clash Premium 内核、[Clash Verge Rev](/article/0gematwc/)、Clash for Windows，还是 [Clash for Android](/article/eh8f4n86/)，全都完美兼容。

> GitHub 原地址：<https://github.com/Loyalsoldier/clash-rules>

## 3 步配置 Clash 分流规则（Clash Verge Rev 实操）

以目前最主流的 **Clash Verge Rev** 为例演示（其他客户端同理，只要支持 Merge 覆写即可）。

::: warning 重要提醒
**千万别直接修改机场的原始配置文件！** 一旦更新订阅，你的所有修改都会被覆盖清空。正确做法是使用下面的 **"全局扩展覆写（Merge）"** 功能。
:::

### 第 1 步：打开全局扩展配置

1. 打开 Clash Verge Rev → 点击左侧 **「订阅」**
2. 在右边找到 **「全局扩展覆写配置 (Merge)」** 卡片
3. **右键点击** → 选择 **「编辑文件」**

![全局扩展覆写配置入口截图](https://image.ermao.net/images/blog/clash-rules-config/20260228_141318-51a08a.png)

### 第 2 步：粘贴分流规则代码

在弹出的编辑器中，**全选并清空**原有内容，然后粘贴以下配置：

> 以下规则会以 `prepend`（前置）方式注入，优先级最高，不会被机场订阅覆盖。

```yaml
prepend-rule-providers:
  reject:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
    path: ./ruleset/reject.yaml
    interval: 86400

  icloud:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"
    path: ./ruleset/icloud.yaml
    interval: 86400

  apple:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"
    path: ./ruleset/apple.yaml
    interval: 86400

  google:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"
    path: ./ruleset/google.yaml
    interval: 86400

  proxy:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"
    path: ./ruleset/proxy.yaml
    interval: 86400

  direct:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"
    path: ./ruleset/direct.yaml
    interval: 86400

  private:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"
    path: ./ruleset/private.yaml
    interval: 86400

  telegramcidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt"
    path: ./ruleset/telegramcidr.yaml
    interval: 86400

  cncidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"
    path: ./ruleset/cncidr.yaml
    interval: 86400

  lancidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"
    path: ./ruleset/lancidr.yaml
    interval: 86400

  applications:
    type: http
    behavior: classical
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt"
    path: ./ruleset/applications.yaml
    interval: 86400

prepend-rules:
  - RULE-SET,applications,DIRECT
  - RULE-SET,private,DIRECT
  - RULE-SET,reject,REJECT
  - RULE-SET,icloud,DIRECT
  - RULE-SET,apple,DIRECT
  - RULE-SET,google,PROXY
  - RULE-SET,proxy,PROXY
  - RULE-SET,direct,DIRECT
  - RULE-SET,lancidr,DIRECT
  - RULE-SET,cncidr,DIRECT
  - RULE-SET,telegramcidr,PROXY
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
```

**各规则说明一览：**

| 规则集 | 类型 | 动作 | 说明 |
|-------|------|------|------|
| `applications` | 本地应用 | DIRECT | 迅雷、百度网盘等 P2P 应用直连 |
| `private` | 私有域名 | DIRECT | localhost、局域网域名等 |
| `reject` | 广告/追踪 | REJECT | 拦截广告域名和隐私追踪器 |
| `icloud` / `apple` | Apple 服务 | DIRECT | iCloud、App Store 等直连 |
| `google` | Google 服务 | PROXY | Google 搜索、YouTube 等走代理 |
| `proxy` | 常见海外站 | PROXY | Twitter、Telegram、Netflix 等 |
| `direct` | 国内域名 | DIRECT | 国内各大网站直连 |
| `cncidr` / `lancidr` | CN IP 段 | DIRECT | 国内 IP 和局域网 IP 直连 |
| `telegramcidr` | Telegram IP | PROXY | Telegram 专用 IP 段走代理 |

### 第 3 步：保存即刻生效

点击**保存**（右下角按钮或 `Ctrl + S`）。

在 Clash Verge Rev 中，全局扩展覆写配置**没有单独的"启用"按钮**——保存后即自动注入到所有订阅节点的底层，立即生效。

**以后无论机场订阅怎么更新，这套分流规则都会始终生效。** 一劳永逸，大功告成。

## 配置成功后体验变化

按照以上 3 步做完，你会明显感受到：

* **国内网站秒开** — B 站、淘宝等国内流量走直连，不再绕到海外节点，加载速度拉满。
* **流媒体完美解锁** — Netflix 不再提示"检测到代理"；TikTok 不再黑屏无网络。可搭配干净的落地节点使用效果更佳。
* **Telegram 收发极速** — 规则单独将 Telegram IP 段分配给代理，消息收发无延迟。
* **广告大幅减少** — `reject` 规则在底层拦截追踪器和弹窗广告域名，体验清爽。

## 如何确认规则是否配置成功？

不确定规则有没有生效？用这个方法验证：

1. 在主界面左侧点击 **「设置」**
2. 向下滚动找到 **「Verge 高级设置」** → 点击 **「当前配置」**
3. 会弹出一个文本编辑器，显示最终合并后的完整配置文件

当你看到 `reject`、`google`、`apple`、`cncidr` 等规则集整齐排列，说明配置已成功注入。

![验证规则配置成功截图](https://image.ermao.net/images/blog/clash-rules-config/20260228_141336-94acd7.png)

::: danger 必须检查的一点
确保 Clash 运行在 **「规则 (Rule)」模式**，而不是全局 (Global) 或直连 (Direct)！只有在规则模式下，分流引擎才会接管你的网络。
:::

## 常见问题

### 配完规则后某些网站打不开怎么办？

极少数网站可能被规则误判为"直连"或"代理"。你可以在 Clash Verge Rev 的「连接」面板中查看某个域名实际匹配到了哪条规则，再手动添加自定义规则覆盖。

### 手机端 Clash 也能配规则吗？

可以。[Clash for Android](/article/eh8f4n86/) 同样支持自定义规则，配置方式类似，只是界面入口不同。

iOS 用户建议使用 [Shadowrocket（小火箭）](/article/z747kgjd/)，规则配置方法参考 → [小火箭规则配置教程](/blog/shadowrocket-rules-config/)。

### 规则会自动更新吗？

会。配置中 `interval: 86400` 表示每 24 小时自动从 GitHub 拉取最新规则文件。Loyalsoldier 也会在每天凌晨同步更新数据源。

## 延伸阅读

如果你觉得这篇教程有帮助，以下相关文章也值得一看：

* **入门科普** — [电脑如何翻墙？Windows 与 Mac 科学上网指南](/blog/how-to-vpn-on-computer/) ｜ [手机如何翻墙？Android 与 iOS 教程](/blog/how-to-vpn-on-mobile/)
* **客户端安装** — [Clash Verge Rev 全平台安装教程](/article/0gematwc/) ｜ [Clash for Android 安装教程](/article/eh8f4n86/) ｜ [macOS Clash Verge Rev 安装指南](/article/6vxkmmuh/)
* **iOS 用户** — [Shadowrocket 新手教程](/article/z747kgjd/) ｜ [小火箭规则配置教程](/blog/shadowrocket-rules-config/) ｜ [免费 Apple ID 共享账号](/blog/freeappleid/)
* **选机场** — [2026 年便宜好用的翻墙机场推荐](/posts/vpn/)
