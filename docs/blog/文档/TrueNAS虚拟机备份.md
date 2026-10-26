---
createTime: '2024/08/04 12:00:00'
tags:
  - NAS
  - 虚拟机
  - 备份
  - TrueNAS
title: TrueNAS虚拟机备份
permalink: /article/vgf2ez1r/
description: TrueNAS Scale 虚拟机备份教程，记录如何找到 ZVOL 虚拟磁盘路径，并使用 dd 命令导出 raw 镜像，适合迁移和灾备前参考。
---

TrueNAS虚拟机备份

<!-- more -->

## 虚拟机导出

本文记录的是使用 ZVOL 作为虚拟磁盘时的 raw 镜像导出，不是包含全部配置的一键虚拟机备份。请另行记录 CPU、内存、启动方式、磁盘顺序和网络配置；多块磁盘需分别备份。

开始前先在客体系统内正常关机，确认 TrueNAS 显示虚拟机已停止，并在导出期间保持停止，避免复制过程中磁盘仍被写入。不要把强制断电当作正常关机。

ZVOL 虚拟磁盘的设备路径位于：

```shell
/dev/zvol
```

旧版界面依次点击 虚拟化 -> 设备 -> 磁盘 -> 编辑，可查看虚拟磁盘路径。下图保留旧版界面；较新版本从 **Virtual Machines（虚拟机）→ Devices（设备）** 查看磁盘，具体入口以所用版本为准。

![TrueNAS虚拟机备份 示例图片 =1891x776](https://image.ermao.net/images/article/vgf2ez1r/image.png)

![TrueNAS虚拟机备份 示例图片 =1422x397](https://image.ermao.net/images/article/vgf2ez1r/image-1.png)

![TrueNAS虚拟机备份 示例图片 =664x509](https://image.ermao.net/images/article/vgf2ez1r/image-2.png)

先确认备份目录存在、空间足够容纳整个虚拟磁盘容量，并为每次备份使用新的文件名。下面的池名、ZVOL 和文件名仅为示例，必须替换为实际路径；`of` 是写入目标，选错会覆盖数据。

使用 `dd` 将已停止虚拟机的一块磁盘导出为 raw 格式的 img 文件：

```shell
dd if=/dev/zvol/main/winserver-93x9q3 of=/mnt/main/backup/winserver.img
```

其中 `if` 为源 ZVOL 设备，`of` 为导出文件。等待命令成功完成并检查有无读写或空间不足错误；失败或中断生成的文件不能直接当作完整备份。不要仅把备份留在源磁盘所在存储池，还应保留独立副本。

## 虚拟机导入

先创建容量不小于原虚拟磁盘的新 ZVOL，并确认它未被运行中的虚拟机使用。核对 `if` 是备份镜像、`of` 是专门用于恢复的新 ZVOL；以下写入会覆盖目标内容，不能对仍需保留数据的原盘照抄执行。

```shell
dd if=/mnt/main/backup/winserver.img of=/dev/zvol/main/winserver-restored
```

恢复完成且无错误后，按先前记录重建虚拟机配置，将恢复的 ZVOL 作为现有磁盘接入，再启动检查系统、文件和应用数据。不要重新安装系统覆盖恢复盘；完成恢复验证前保留原备份。

参考：[TrueNAS 虚拟机管理、正常关机与现有磁盘配置](https://www.truenas.com/docs/scale/25.10/scaletutorials/virtualmachines/)。本页是磁盘复制步骤说明，不代表已在你的设备上完成备份或恢复测试。
