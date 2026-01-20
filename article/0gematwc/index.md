---
url: /article/0gematwc/index.md
description: >-
  手把手教学 Windows、macOS、Linux 安装 Clash Verge 与 Clash，附订阅导入、Tun
  模式开启、系统代理与测试步骤，新手也能快速完成科学上网配置。
---
想要最快速地在 Windows、macOS 或 Linux 上安装 Clash Verge/Clash 并导入订阅？这篇指南提供官方与国内加速镜像下载、安装要点、Tun 模式开启以及常见问题，帮助你 5 分钟内跑通科学上网配置。

## 下载安装（直链与镜像）

::: tabs

@tab Windows

* 推荐：Clash Verge Windows x64（直链下载，含系统代理/TUN 支持）
  * [国内加速下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.x64.exe)
  * [ARM 版本下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.arm64.exe)

@tab macOS

* 推荐：Clash Verge macOS x64 / Apple Silicon (M 系列)
  * [Intel 芯片下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg)
  * [Apple Silicon 下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg)

@tab Linux

* 推荐：Deb 包（多数发行版）
  * [Linux x64 deb](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.x64.deb)
  * [Linux arm64 deb](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.arm64.deb)

@tab GitHub 官方

* [GitHub Releases（更多版本）](https://github.com/clash-verge-rev/clash-verge-rev/releases)
* [Clash for Windows 汉化版](https://github.com/Z-Siqi/Clash-for-Windows_Chinese/releases/)

:::

下载后直接安装即可，推荐使用 Clash Verge（界面清晰、内置 TUN）。

## 快速安装要点

* Windows：安装后启用「服务模式」和「Tun 模式」，并开启系统代理。
* macOS：拖到应用程序后，首次运行授予网络权限，开启系统代理与 Tun。
* Linux：优先使用 deb 包，安装后按提示启动服务或参考发行版文档开启 TUN。
* 订阅准备：提前准备好机场订阅链接，方便导入。

## 配置

![Clash Verge 导入订阅界面示例](https://image.ermao.net/images/article/0gematwc/image.png)

点击`订阅`，把你的订阅链接粘贴到输入框中，点击`导入`。

如果没有订阅链接可以参考这篇文章：[便宜好用的翻墙机场推荐评测](https://www.ermao.net/posts/vpn)

![订阅列表显示示例](https://image.ermao.net/images/article/0gematwc/image-1.png)

导入成功后就会出现该订阅

该订阅默认是 1440分钟（24小时）更新一次，可以根据自己的需求调整。

![编辑订阅更新时间与名称](https://image.ermao.net/images/article/0gematwc/image-2.png)

右键点击`编辑配置`即可调整更新时间、订阅链接、名称等信息。

![开启服务模式与 Tun 模式](https://image.ermao.net/images/article/0gematwc/image-3.png)

在`设置`中点击`服务模式`右侧的安装，安装成功后点击`启动`，然后打开`Tun 模式`开关与`系统代理`开关。

![确认代理模式为规则模式](https://image.ermao.net/images/article/0gematwc/image-4.png)

最后检查一下`代理`中的模式是否为`规则`

## 测试

![测速与连通性检查示例](https://image.ermao.net/images/article/0gematwc/image-5.png)

点击`测试`中的`测试全部`，如果没啥问题就大功告成了！

## 常见问题（FAQ）

* 下载失败/速度慢？优先使用上方「国内加速下载」直链；或切换网络/开代理再试。
* 订阅导入无效？确认订阅链接未过期，或更换节点供应商后重试。
* TUN 无法启动？以管理员/Root 权限运行，关闭其他 VPN/代理软件后再试。
* 规则模式没生效？在「代理」页确认模式选择为「规则」，并刷新订阅。

## 其他

任何问题都可以留言提问，知无不言。

回复如果回复不及时，可以给我发邮件：<admin@ermao.net>

如果当前内容过时，可以访问我的博客：<https://ermao.net>，其中内容将会保持更新。
