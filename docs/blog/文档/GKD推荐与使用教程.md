---
title: GKD 下载与使用：自动跳过开屏广告，4 步上手
createTime: 2026/10/01 17:30:00
updateTime: 2026/10/01 19:53:12
permalink: /blog/gkd-guide/
tags:
  - GKD
  - Android
  - 安卓工具
  - 自动点击
  - 无障碍
  - 开屏广告
  - 李跳跳
description: 点这里下载 GKD 安卓安装包，跟着 4 步完成安装、无障碍授权、添加规则和验证自动跳过开屏广告。附李跳跳对比与常见问题。
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

::: tip 下载 GKD（安卓）

<VPButton size="big" text="下载 GKD 安卓安装包" href="https://github.com/gkd-kit/gkd/releases/download/v1.12.1/gkd-v1.12.1.apk" style="display: inline-flex; align-items: center; background: var(--vp-c-text-1); color: var(--vp-c-bg); text-decoration: none;" />

**官方正式版 v1.12.1 · 无需 Root · 不支持 iPhone**

按钮直接下载 APK。打不开？去 [GKD 官网选择下载方式](https://gkd.li/guide/)，或使用 [Google Play](https://play.google.com/store/apps/details?id=li.songe.gkd)。

:::

打开 App 还要抢着点“跳过”？**让 GKD 替你点。** 它能按规则自动跳过开屏广告、关闭部分推广弹窗，还能处理展开评论等重复点击。你负责打开 App，它负责少让你动几次手指。

先记住一件事：**装好 GKD，还要开启无障碍、添加规则，才会开始工作。** 下面按这条路线操作，不用写代码，也不用先研究高级模式。

<!-- more -->

## 1. 安装：打开刚下载的 APK

在手机浏览器的**下载记录**中打开 `gkd-v1.12.1.apk`，按提示安装，然后打开 GKD。

如果手机提示“不允许安装此来源的应用”，按提示允许**当前浏览器或文件管理器**安装，返回继续即可；装好后可以关掉这项来源权限。

**看到 GKD 首页，就进入下一步。** 需要其他版本时，在[官方发布页](https://github.com/gkd-kit/gkd/releases/latest)的 Assets 中选 `.apk`，不要下载 `Source code`。

## 2. 授权：打开无障碍服务

1. 在 GKD **首页 → 服务状态**进入授权页，保留**基础**模式，点**手动授权**。
2. 系统会打开无障碍设置。在“已下载的应用”或“已安装的服务”里找到 **GKD**，打开开关并确认提示。
3. 返回 GKD，看到 **无障碍正在运行**，这一步就完成了。

无障碍允许 GKD 读取界面并执行点击，请只给上方官方渠道下载的应用授权。**本文不需要设置 Root、Shizuku 或命令授权。**

::: details 提示“受限制的设置”，无法打开开关？

长按桌面上的 GKD 图标 → **应用信息** → 右上角菜单或高级设置 → **允许受限制的设置**，确认后再去开启无障碍。入口因手机系统而异，没有这一项时查看[官方对应系统的说明](https://gkd.li/guide/faq#restriction)。

如果系统开关已打开，但 GKD 仍提示故障，先把这个服务关闭再打开；仍不正常时查看[官方排查说明](https://gkd.li/guide/faq#unable_open_a11y)。

:::

## 3. 加规则：复制链接，粘贴到“订阅”

**这是必做的一步，当前 GKD 不自带规则。** 这里的“订阅”是规则更新地址，不是购买会员。本文使用第三方社区维护的[奥怪的 GKD 订阅](https://github.com/aoguai/subscription)，先用一份就够了。

**复制下面这一整行：** 手机也可以长按[这个规则链接](https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5)，选“复制链接地址”。

```text
https://raw.githubusercontent.com/aoguai/subscription/custom/dist/aoguai_gkd.json5
```

接着在 GKD 里操作：

1. 点击底部 **订阅**，再点右下角 **＋**。
2. 粘贴刚才的链接，点 **确定**，等待导入。
3. 列表里出现 **奥怪的GKD订阅**，并且右侧开关已打开，就完成了。

这份订阅默认启用开屏相关规则，**先保留默认配置，不用把所有类别都打开。**

::: details 找不到加号？看订阅页示意图

![GKD 官方订阅页示例，添加订阅的加号位于右下角 =1280x2772](https://registry.npmmirror.com/@gkd-kit/assets/0.0.21/files/assets/0049.png)

*官方示意图：名称、版本和数量仅作示例。本文只添加一份订阅。*

:::

::: details 链接导入失败？换这个备用地址

长按[备用规则链接](https://cdn.jsdelivr.net/gh/aoguai/subscription@custom/dist/aoguai_gkd.json5)复制，或复制下面这一行，重新添加：

```text
https://cdn.jsdelivr.net/gh/aoguai/subscription@custom/dist/aoguai_gkd.json5
```

两个地址指向维护者提供的同一套规则，**二选一即可**。检查链接是否完整、末尾有没有多余标点；不要把 GitHub 项目主页当成规则地址。

:::

## 4. 试一下：打开一个有开屏广告的 App

先确认 GKD **订阅页顶部的闪电图标（规则匹配）已开启**，刚添加的订阅也已开启。

然后选一个你平时见过开屏广告、带“跳过”按钮的 App：

1. 在最近任务中划掉**这个目标 App**，再重新打开，保留 GKD 在后台。
2. 本次出现广告时，先别自己点，看看“跳过”是否被自动点击。
3. 返回 GKD **首页 → 触发记录**，查看是否有刚才对应 App 的操作。

**按钮确实被正确点击，记录也能对应上，就可以开始用了。** 没出现广告时，换一次实际遇到广告的场景再试；广告自己倒计时结束，不能算验证成功。

GKD 不是“所有广告一键消失”：广告可能先出现再被跳过，没有可匹配的按钮或规则时仍需手动操作。首次验证时，先暂停其他自动点击工具，方便判断效果。

## 先用起来，有问题再看这里

::: details 都装好了，还是不会自动跳过

按这个顺序看：**无障碍正在运行 → 规则匹配已开启 → 订阅已开启 → 当前有“跳过”按钮。**

仍不行，打开 **订阅 → 奥怪的GKD订阅**，在“规则类别”里检查“开屏广告”，再到“全局规则”里检查开屏规则组是否开启。类别和全局规则组是两个入口。

只有某个 App 无效时，查看它是否有适配规则、是否被加入了“应用白名单”。GKD 的白名单会让应用避开自动点击。应用改版也可能需要等待规则更新；在订阅页下拉刷新即可检查更新。

:::

::: details 刚开始有效，过一会儿就失效

先看 GKD 首页的服务状态。无障碍关闭或故障时，重新授权。

再按手机支持的选项调整 **GKD 自己**的后台设置：最近任务中给它加锁、允许自启动和后台活动、将电池策略改为“不限制”。需要时打开首页的“常驻通知”。无需修改其他 App 的设置。

调整后正常使用一段时间，再试刚才有效的 App；手机重启后也检查一次服务。各系统入口可参考[官方后台说明](https://gkd.li/guide/faq#persistent)。

:::

::: details 它点错了，或者我想暂停使用

**先关闭订阅页的“规则匹配”，立即暂停自动点击。**

想保留其他功能：到 **首页 → 触发记录**，找到误触，点“查看规则”，关闭对应规则组，再恢复总开关。全局规则还可选择“在此应用禁用”。

完全停用时，到手机系统的无障碍设置关闭 GKD 服务即可。

:::

## GKD 和李跳跳怎么选？

**只想省心跳开屏、已经用李跳跳且效果满意，可以继续用；想按 App 调整规则、查清误触原因，可以试 GKD。**

| 你关心的事 | GKD | 李跳跳 |
| --- | --- | --- |
| 第一次设置 | 安装、授权，再添加规则 | 旧版基础使用步骤较少 |
| 想增加功能 | 可订阅规则，按应用和规则组开关 | 可导入社区规则，能力随版本而异 |
| 出现误触 | 可用触发记录定位规则 | 按社区说明检查、调整规则 |

李跳跳这里以常见的**派大星 2.2 旧版**为参照。原作者在 **2023 年**宣布无限期停更，这是[历史报道](https://app.xinhuanet.com/news/article.html?articleId=7b5425b5-fff5-4b21-90c4-22001a09ce3c)；社区更新规则不等于原作者恢复更新。[社区说明](https://github.com/kernelai/LiTiaotiao)也提醒，导入新的规则文件会覆盖上一份。本文比较使用方式，没有做同机速度或耗电测试。

## 用顺手了，再加你需要的功能

想关闭某个 App 的推广弹窗，进入 **订阅 → 奥怪的GKD订阅 → 应用规则 → 对应 App**，读清说明，只开启需要的规则组。[适配列表](https://github.com/aoguai/subscription/blob/custom/dist/README.md)可以查有哪些功能。

::: details 举个例子：让 B 站自动展开更多评论

1. 在“应用规则”中搜索并打开 **哔哩哔哩**。
2. 找到 **功能类-自动点击评论区的[展开更多评论]**，打开这一组的开关。
3. 打开 B 站视频评论区，在实际出现“展开更多评论”的位置观察效果，再到 GKD 的触发记录里确认。

不需要时关闭同一个开关即可。按钮未出现或界面改版时，规则可能不生效；不用开启整个“功能类”。

:::

**付款、删除、账户授权这些决定，留给自己操作。** 从开屏规则开始，确认好用后再多开一两项，比一次开满更容易掌握。

::: details 耗电、隐私和资料来源

耗电与启用的规则、手机界面和使用方式有关，见[官方耗电说明](https://gkd.li/guide/faq#power)。先用一份订阅，观察自己手机的表现。

[官方隐私政策](https://gkd.li/guide/privacy)说明界面数据、调试截图等在本地处理，订阅和更新可能联网；这是开发者声明。应用和规则都选择可信来源，分享排错截图前去掉私人信息。

本文于 **2026 年 10 月 1 日**核对正式版下载和规则文件，按官方文档与 v1.12.1 界面整理，尚未进行 Android 实机跨机型验证。后续版本以官网为准。

- [GKD 是什么](https://gkd.li/guide/what-is-gkd) · [官方下载](https://gkd.li/guide/) · [正式发布记录](https://github.com/gkd-kit/gkd/releases/latest)
- [演示订阅项目与使用说明](https://github.com/aoguai/subscription) · [常见问题](https://gkd.li/guide/faq)

:::
