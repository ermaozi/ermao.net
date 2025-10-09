---
createTime: 2024/08/04 12:00:00
tags:
  - NAS
  - 虚拟机
  - 备份
  - TrueNAS
title: TrueNAS虚拟机备份
permalink: /article/vgf2ez1r/
---

TrueNAS虚拟机备份

<!-- more -->

## 虚拟机导出

TrueNAS Scale虚拟化使用ZVOL存储虚拟机，存储路径为：

```shell
/dev/zvol
```

依次点击 虚拟化 -> 设备 -> 磁盘 -> 编辑 就可以看到该虚拟机具体路径

![alt text](images/truenas_vm_backup/image.png)

![alt text](images/truenas_vm_backup/image-1.png)

![alt text](images/truenas_vm_backup/image-2.png)

使用dd命令可将虚拟机打包为raw格式的img文件：

```shell
dd if=/dev/zvol/main/winserver-93x9q3 of=/mnt/main/backup/winserver.img
```

其中if为源文件即为zvol文件，of为导出目的文件。

## 虚拟机导入

可以使用dd命令在新建zvol文件之后导入zvol文件:

```shell
dd if=/mnt/main/backup/winserver.img of=/dev/zvol/main/winserver-93x9q3
```