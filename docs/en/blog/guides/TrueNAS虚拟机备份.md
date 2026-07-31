---
createTime: '2024/08/04 12:00:00'
tags:
  - NAS
  - virtual machines
  - backups
  - TrueNAS
title: Backing Up a TrueNAS Virtual Machine
permalink: /en/article/vgf2ez1r/
lang: en-US
translationOf: /article/vgf2ez1r/
description: Back up a TrueNAS SCALE virtual machine by locating its ZVOL disk and exporting a raw image with dd before migration or recovery.
---

TrueNAS virtual-machine backup

<!-- more -->

## Exporting a virtual machine

TrueNAS SCALE virtualization stores virtual machines in ZVOLs. Their device paths are under:

```shell
/dev/zvol
```

Open **Virtualization → Devices → Disk → Edit** to view the path used by a particular virtual machine.

![Example of backing up a TrueNAS virtual machine](https://image.ermao.net/images/article/vgf2ez1r/image.png)

![Example of backing up a TrueNAS virtual machine](https://image.ermao.net/images/article/vgf2ez1r/image-1.png)

![Example of backing up a TrueNAS virtual machine](https://image.ermao.net/images/article/vgf2ez1r/image-2.png)

Use `dd` to export the virtual machine as a raw `.img` file:

```shell
dd if=/dev/zvol/main/winserver-93x9q3 of=/mnt/main/backup/winserver.img
```

Here, `if` is the source—the ZVOL device—and `of` is the destination file.

## Importing a virtual machine

After creating a new ZVOL, use `dd` to restore the image into it:

```shell
dd if=/mnt/main/backup/winserver.img of=/dev/zvol/main/winserver-93x9q3
```
