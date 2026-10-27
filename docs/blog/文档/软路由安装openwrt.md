---
title: 软路由安装openwrt
createTime: '2024/10/14 19:35:47'
permalink: /article/9zktdhyx/
tags:
  - openwrt
  - 路由器
  - 软路由
  - 刷机
description: 最近有朋友找我帮忙给他的软路由装个 openwrt，顺手写个教程，后面有想要装 openwrt 的朋友可以参考一下。
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

::: danger 写入前先确认目标磁盘
写入镜像会覆盖所选磁盘的分区表和数据。先把需要保留的数据备份到其他设备，并确认能够恢复。`/dev/sda` 不是内置系统盘的固定名称，也可能是启动 U 盘或其他磁盘，不能仅凭设备名判断目标。
:::

在从 U 盘启动的系统中，结合容量、型号、序列号和挂载点确认要安装的**整块磁盘**，区分启动 U 盘与其他数据盘。系统有 `lsblk` 时可以辅助查看；没有时使用可用的磁盘管理工具。不要写入仍在挂载使用的目标，也不要把 `/dev/sda1` 这样的分区当作整盘。无法确认磁盘身份或镜像兼容性时，先停止。

下面仅为 gzip 压缩镜像的模板。替换镜像路径，并把 `TARGET_DISK` 设置为已核对的目标整盘路径；默认留空会阻止写入。块设备检查只能确认设备类型，不能证明选对了磁盘。

```bash
ssh root@你的小主机IP
cd /tmp
IMAGE='替换为固件文件.img.gz'
TARGET_DISK='' # 核对目标整盘后再填写，不要照抄别人的设备名

if [ -n "$TARGET_DISK" ] && [ -b "$TARGET_DISK" ] && gzip -t "$IMAGE"; then
    gzip -dc "$IMAGE" | dd of="$TARGET_DISK"
    sync
else
    echo '已停止：请核对镜像和目标磁盘。'
fi
```

`gzip -t` 只检查压缩文件完整性，不验证来源真伪或硬件兼容性；下载后还应单独核对官方校验值。检查解压与写入输出是否报错，出现错误时不要直接重启。`sync` 用于刷新待写入数据，不代表系统安装已经验证成功。`of=` 的含义可参考 [GNU dd 手册](https://www.gnu.org/software/coreutils/manual/html_node/dd-invocation.html)；OpenWrt 自带工具可能是 BusyBox 版本，可选参数不一定相同。

### 重启

完成后可以输入`reboot`重启小主机，等待一会儿就可以访问。

## 后话

这个教程写的比较笼统，如果有问题可以在评论区留言，我会尽量回答并补充文档。
