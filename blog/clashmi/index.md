---
url: /blog/clashmi/index.md
description: 2026年最新 Clash Mi 使用教程，覆盖 iPhone/iPad 安装、订阅链接导入、连接设置、TUN 覆写和常见报错解决。新手可按步骤快速上手。
---
Clash Mi 是一款内置 `mihomo`（Clash Meta）内核的代理工具，支持 iOS、macOS、Android 和 Windows，开源且完全免费。我个人把手机的主力代理客户端切换到 Clash Mi 已经有一个月左右的时间了，整体体验非常棒，不仅没有杂乱的广告，后台刷新和连接也相当稳定，可以说它是目前苹果设备上最良心的免费科学上网工具之一。

如果你是第一次接触 Clash Mi，不用担心，这篇文章会用更轻松的大白话，按「怎么下载 -> 导入订阅 -> 开启连接 -> 遇到问题怎么办」的顺序，手把手带你完成基础配置。

![Clash Mi 官网与应用概览](https://image.ermao.net/images/blog/clashmi/20260305_103545-57abfa.png)

官网地址：<https://clashmi.app/>

## 聊聊 Clash Mi 到底好在哪

* **强劲的内核**：内置并持续更新 `mihomo`（也就是大家常说的 Clash Meta）内核，市面上那些主流的 Clash 机场配置它都能完美兼容，几乎不会遇到“带不动”或者不识别的情况。
* **傻瓜式上手**：用起来是真的简单，不像以前一些老客户端还要折腾一堆复杂的设置。只要你有机场的订阅链接，复制粘贴进去就能直接用，门槛极低。
* **界面清爽**：没有花里胡哨的多余按钮，主界面干干净净的。对于新手来说，一眼就能看懂该点哪里，可以说非常贴心了。

![Clash Mi 主界面预览](https://image.ermao.net/images/blog/clashmi/20260305_103743-3935fc.png)

## 使用前准备

| 项目 | 要求 |
| --- | --- |
| iOS | >= 15 |
| macOS | >= 12 |
| Android | >= 8 |
| Windows | >= 10 |

::: tip 先准备好订阅链接
Clash Mi 只是客户端，连接外网还需要可用的 Clash 订阅。

还没有节点可以先看：[便宜好用的翻墙机场推荐评测](/posts/vpn/)
:::

## 一、怎么下载并安装 Clash Mi？

想要用上这个神器，第一步当然是把它装到手机或电脑里。

### iOS / iPadOS / macOS

苹果全家桶用户可以直接在应用商店下载：

* **求稳就选它（App Store 正式版）**：[点击前往 App Store 下载](https://apps.apple.com/us/app/clash-mi/id6744321968)
* **喜欢尝鲜（TestFlight Beta 版）**：[点击加入 TestFlight 测试](https://testflight.apple.com/join/bjHXktB3)

**几点需要特别唠叨的注意事项：**

* 大家都懂的，国区 Apple ID 肯定是搜不到也下不了的，你得换成美区或者港区等海外账号。如果自己没有海外 Apple ID，大家可以使用我每日更新维护的免费共享账号来下载：

- 对了，App Store 的正式版和 TestFlight 的测试版只能“二选一”，同时装的话，其中一个会把另一个给覆盖掉。

### Android / Harmony / Windows / Linux 用户

安卓、鸿蒙或者电脑端的朋友，可以直接去官网下载对应系统的安装包：

👉 [前往官网下载页面](https://clashmi.app/download)

## 二、只需 3 步，轻松连上外网（以 iOS 为例）

别看它功能强大，其实真用起来特别简单，新手跟着这三步走就行了：

### 第 1 步：把订阅链接导进去

打开应用底部菜单的 `我的配置`，稍微抬眼看下右上角，会发现有个 `+` 号。点它，然后选 `添加配置链接`，把你买好的机场订阅 URL 直接粘贴进去。

![Clash Mi 添加配置](https://image.ermao.net/images/blog/clashmi/20260305_103809-b1ab1b.png)

### 第 2 步：告诉软件“我要用这个配置”

导完之后还不算完，你得在配置列表里找一找，点击选中你刚刚费劲添加进去的那个订阅卡片，让软件知道你打算用它。

![Clash Mi 配置列表](https://image.ermao.net/images/blog/clashmi/20260305_103816-7c1edf.png)

### 第 3 步：一键起飞

这下配置完了。点击底部的 `首页` 退回去，看到那个圆溜溜的连接按钮了吗？点它！这时候如果系统弹出让你允许添加 VPN 配置之类的提示框，记得点允许哦。

![Clash Mi 开启连接](https://image.ermao.net/images/blog/clashmi/20260305_103836-d45527.png)

## 三、关于在线面板的小知识

可能有的老玩家习惯了以前那种网页端管理台。在 Clash Mi 里，你直接划拉一下底部菜单里面的“面板”就能搞定绝大部分平时需要网页端做的事。

* 面板默认是需要密码的，也就是那个 `secret`，怎么看呢？你可以去 `核心设置` 里查到。
* 假如软件自带的控制面板你用着不适应，或者因为什么情况没法用了，它也支持让你临时换成其他的局域网管理面板（不过要注意，只认 `http` 协议哦）。

## 四、那些大家最容易卡住的问题（FAQ）

这里整理了新手第一次用十有八九会遇到的坑，出了问题来这儿看：

### 1) 开了“全局（GLOBAL）”却还是上不了网

**为啥会这样：** 很多从其他代理软件转过来的小伙伴最爱踩这个坑，以为点全局就行了，结果发现还是翻不出去。

**怎么自救：**

* 第一种办法：去 `代理 -> GLOBAL` 这个分组下面，老老实实选一下“节点选择”或者“自动选择”，别让它空着。
* 第二种办法：稍微懂点代码的朋友，可以直接去你订阅配置那个 `yaml` 文件的 `proxy-groups` 下边自己加个 `GLOBAL`，配好节点选择就行了。

### 2 连接成功但流量一直为 0

解决：

* 开启 TUN 覆写并启用后重连
* Windows 需用管理员身份重新启动 Clash Mi 后再启用 TUN
* 如果你完全使用机场下发配置且未开启覆写，联系服务商优化订阅

### 3 订阅添加失败

排查顺序：

* Clash Mi 仅支持 `.yml/.yaml`（不支持 sing-box、v2ray 订阅）
* 先在浏览器验证订阅链接是否可打开
* 某些机场需要指定 `User-Agent`，可在应用设置中修改
* 若订阅域名被拦截，先临时使用其他代理打开再导入

提示：若要关闭默认覆写，可在订阅链接参数加 `overwrite=false`。

### 4 iOS 点击连接后立刻断开

原因通常是 iOS 对 VPN 扩展的内存限制（约 50MB）触发。

解决：

* 减少 `geosite/geoip/ip-asn` 规则数量
* 优先使用 `mrs` 格式规则集

### 5 Windows 报错 `configure tun interface: Access is denied`

以管理员身份启动 Clash Mi，然后重新连接。

### 6 iOS/macOS 无法下载或更新 Clash Mi

* 改用可下载 Clash Mi 的 Apple ID（如美区）
* 如果之前装过 TestFlight 版，先卸载再用有效账号重新安装

### 7 Clash Mi 会泄露数据吗

* Clash Mi 本身不会主动收集用户信息
* 面板默认启用 `secret`，即使开启非本机访问也需要有效 secret 才能访问

### 8 如何通过外部链接控制连接

* 连接：`clash://connect?background=true`
* 断开：`clash://disconnect?background=true`
* 重连：`clash://reconnect?background=true`

## 五、进阶补充

* `geo ruleset` 不支持手动更新，可在核心设置里配置自动更新间隔。
* 面板中“更新核心/重启核心/重载配置/更新 GEO”等功能在部分平台受限。
* macOS 某些机型需要授予“完全磁盘访问权限”，否则系统扩展可能无法读取配置文件。

## 延伸阅读

* [手机如何翻墙（Android + iOS 全流程）](/blog/how-to-vpn-on-mobile/)
* [Android 手机 Clash 使用教程](/article/eh8f4n86/)
* [Shadowrocket 新手使用教程](/article/z747kgjd/)
* [小火箭规则配置教程（分流与去广告）](/blog/shadowrocket-rules-config/)
* [电脑如何翻墙（Windows + Mac）](/blog/how-to-vpn-on-computer/)
* [免费美区 Apple ID 共享账号](/blog/freeappleid/)
