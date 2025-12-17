---
title: 飞牛OS虚拟机安装openwrt作为旁路由
createTime: 2025/11/20 05:41:43
permalink: /blog/fnoswrt/
tags:
    - 飞牛OS
    - openwrt
    - 旁路由
    - 虚拟机
    - nas
description: 飞牛OS虚拟机安装OpenWrt作为旁路由的详细教程，帮助你在飞牛OS上轻松搭建OpenWrt旁路由，实现家庭网络管理与优化。
---

最近我的软路由 R5S 挂掉了，经过一番考虑后，我决定通过飞牛 OS 的虚拟机功能安装 OpenWrt 作为旁路由，继续为家庭网络提供服务。下面是详细的安装与配置步骤。

<!-- more -->

## 痛，太痛了！

我那用了两年零九个月的R5S软路由，终于在昨天彻底挂掉了。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image.png)

这台 R5S 于 2023 年 2 月斥巨资（616 元）购入，陪我度过了无数个日日夜夜、严寒酷暑，始终如一地为我提供网络服务。

或许是因为我多次暴力关机、或许是因为没有为它加装散热、又或许是多次刷入不稳定的固件，如今，它终于在 2025 年 11 月 19 日寿终正寝。

为此我感到无比悲痛。

只是……

生活还要继续，上网更要继续。我的生活已经无法离开网络，同样地，网络也离不开软路由。

我不得不在悲痛之余，迅速寻找替代方案。

## 飞牛OS虚拟机安装OpenWrt作为旁路由

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-1.png)

非常幸运，前几天我刚买了台小机器并安装了飞牛 OS 作为家庭 NAS。

我干脆通过飞牛 OS 的虚拟机功能，安装一个 OpenWrt 虚拟机作为旁路由。

说干就干，上网是最重要的。

### 1. 下载OpenWrt固件

我直接在 [openwrt.ai](https://openwrt.ai/) 自己简单定制并编译了一个固件。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-2.png)

根据需求简单选一下功能，然后编译打包下载。

编译成功后直接下载镜像。一般直接下载`EFI.img.gz`结尾的文件即可。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-3.png)

因为涉及到的基础知识比较多，我不太清楚哪里需要展开，哪里可以带过。如果有不懂的地方，==欢迎留言提问==。我将在第一时间回复，并在后续文章中补充。

### 2. 上传固件文件到nas

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-4.png)

直接在飞牛 OS 的文件管理器中上传刚才下载的固件文件。或者通过 Samba、FTP 等方式上传也可以。

### 3. 创建OpenWrt虚拟机

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-5.png)

打开飞牛 OS 的`虚拟机`，点击`新建虚拟机`。没有的话去`应用中心`下载一个。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-6.png)

给虚拟机取个名字，操作系统选`Linux`，版本随便选。然后点下一步

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-7.png)

系统镜像选择刚才上传的固件文件，其他的按自己需求来，基本上是不需要改的。==开机启动建议选择是==。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-8.png)

存储空间可以随意选择。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-9.png)

点一下添加网卡，选择好网卡，默认配置即可。

如果有同学在这个页面找不到网卡，多半是因为没有开启过对应网口的 `OVS`。

这时需要在`设置`-`网络设置`中，点击对应网口左上角的`...`，然后选择`启用 OVS`。短暂等待后该网卡即可启用 `OVS`。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-10.png)

硬件直通直接忽略，点下一步。这样你的虚拟机就创建好了。

### 4. 启动OpenWrt虚拟机

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-11.png)

刚创建好的虚拟机会是关机状态，点击开关按钮，然后点击`开机`即可。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-12.png)

开机后点击这个显示器图标，也就是`VNC 访问`。

这样你就可以看到 OpenWrt 的后台界面了。

### 5. 配置OpenWrt虚拟机网络

如果在编译镜像那一步没有选择好你的 IP 段，那么你需要手动配置一下 OpenWrt 的网络。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-13.png)

执行以下命令
``` bash
vi /etc/config/network
```

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-14.png)

修改 lan 口内容：

其中 `option ipaddr` 将后面引号内 IP 改为 OpenWrt 虚拟机的 IP 地址，可以自由发挥，但是==不要跟你内网环境中的其他设备冲突==。

`option netmask` 子网掩码一般不需要改动。

`option gateway` 将后面引号内 IP 改为你内网的网关地址，一般是你主路由器的 IP 地址。

修改完成后按 `ESC` 键，然后输入 `:wq` 保存并退出。

然后执行以下命令重启网络服务
``` bash
/etc/init.d/network restart
```

然后执行
``` bash
ip a
```

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-15.png)

查看一下你的 OpenWrt 虚拟机的 IP 是否配置正确。

### 6. 通过浏览器访问OpenWrt后台

如果上面的步骤配置得没有问题,那么你就可以通过浏览器访问 OpenWrt 虚拟机的后台了。地址栏输入你刚才配置的 OpenWrt 虚拟机的 IP 地址即可。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-16.png)

第一次访问会提示你设置密码，设置好密码后即可登录后台。==请务必牢记密码==。

### 7. 配置旁路由

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-17.png)

在`系统`-`设置向导`-`网络设置`中勾选`旁路由模式`，然后填入 IPv4 网关地址（也就是你主路由器的 IP 地址），点击保存并应用即可。

## 家中设备使用旁路由

旁路由跟主路由不同，旁路由并不会分配 IP 地址给家中的设备。所以其他设备如果需要使用旁路由提供的网络服务，需要手动设置设备的网关为旁路由的 IP 地址。

例如我的旁路由 IP 地址是 `192.168.1.32`，那么我家中其他设备的网关就需要设置为 `192.168.1.32`。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-18.png)

PC 端可以直接在网络设置中修改网关地址。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-19.png)

以 Win10 为例，点击 WiFi 图标，点击对应 WiFi 下方的属性。

![alt text](https://image.ermao.net/images/blog/fnoswrt/image-20.png)

在下方的 IP 设置中点击编辑。IP 分配方式选择手动，然后开启 IPv4。网关地址填写旁路由的 IP 地址，点击保存即可。

其他设备（手机、平板、智能设备等）同理，在对应的网络设置中修改网关地址即可。

## 结语

飞牛 OS 虚拟机安装 OpenWrt 作为旁路由的过程其实并不复杂，关键是要理解旁路由的工作原理以及如何配置网络。

通过这种方式，我成功地替代了已经挂掉的 R5S 软路由，继续享受稳定的网络服务。

同样地，希望这篇文章能帮助到有需要的朋友们。如果在操作过程中遇到任何问题，欢迎在评论区留言，我会尽力帮助大家解决。

祝大家上网愉快！

## 推荐阅读

- [飞牛OS通过docker安装OneDrive备份文件(超多废话版)](https://www.ermao.net/article/aofygutj/)
- [便宜好用的翻墙机场推荐评测(长期更新 欢迎推荐)](https://www.ermao.net/posts/vpn/)
- [OKX虚拟币入门教程：注册、USDT充值、转账与提现全流程攻略](https://www.ermao.net/blog/web3okx/)
