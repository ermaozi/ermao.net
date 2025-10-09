---
title: 软路由安装openwrt
createTime: 2024/10/14 19:35:47
permalink: /article/9zktdhyx/
tags:
    - openwrt
    - 路由器
    - 软路由
    - 刷机
---

最近有朋友找我帮忙给他的软路由装个 openwrt，顺手写个教程，后面有想要装 openwrt 的朋友可以参考一下。

<!-- more -->

## 一句话流程

给U盘写入系统，插入小主机，从U盘启动，上传openwrt固件，使用DD命令刷入固件，重启。

## 准备工作

- 一个U盘
- 一个小主机
- 一个电脑
- 一根网线

## 下载openwrt固件与写盘工具

### 下载openwrt固件

官方地址：[https://downloads.openwrt.org/](https://downloads.openwrt.org/)

根据你的设备型号下载对应的固件，这里以我手头的设备为例，下载的是 `x86_64` 的固件。

### 下载写盘工具

我使用的是`rufus`, 下载地址：[https://rufus.ie/](https://rufus.ie/)

## 制作启动盘

插入U盘，打开`rufus`，选择你下载的openwrt固件，点击下方“开始”就可以了。

## 安装openwrt

### 连接小主机

将U盘插入小主机，连接电源和网线，用网线连接电脑和小主机。

### 启动小主机

开机时按`F2`或`F12`或`del`进入BIOS，选择从U盘启动。

### 上传openwrt固件

启动成功后可以直接使用`scp`命令将下载好的固件上传到小主机。

```bash
cd 固件所在目录
scp 固件名 root@你的小主机IP:/tmp/
```

### 刷入固件

使用`dd`命令刷入固件。后面的`/dev/sda`是小主机的系统盘，如果你的小主机是其他盘，可以使用`lsblk`命令查看。

```bash
ssh root@你的小主机IP
cd /tmp
gzip -dc 固件名 | dd of=/dev/sda
```

### 重启

完成后可以输入`reboot`重启小主机，等待一会儿就可以访问。

## 后话

这个教程写的比较笼统，如果有问题可以在评论区留言，我会尽量回答并补充文档。