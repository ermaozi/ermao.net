---
title: Installing OpenWrt on a Software Router
createTime: '2024/10/14 19:35:47'
permalink: /en/article/9zktdhyx/
lang: en-US
translationOf: /article/9zktdhyx/
tags:
  - OpenWrt
  - routers
  - software routers
  - firmware installation
description: Install OpenWrt on an x86 mini PC by writing a USB image, booting it, uploading firmware, copying it with dd, and rebooting.
---

A friend recently asked me to install OpenWrt on a software router. I wrote down the process for anyone who wants to do the same.

<!-- more -->

## Process in one sentence

Write the system image to a USB drive, insert it into the small computer, boot from USB, upload the OpenWrt firmware, write it to the system disk with `dd`, and reboot.

## What you need

- A USB drive
- A small computer
- Another computer
- An Ethernet cable

## Download the OpenWrt firmware and imaging tool

### Download OpenWrt

Official downloads: [https://downloads.openwrt.org/](https://downloads.openwrt.org/)

Download the firmware for your device model. The example here uses an `x86_64` image.

### Download an imaging tool

This guide uses `Rufus`: [https://rufus.ie/](https://rufus.ie/)

## Create the bootable drive

Insert the USB drive, open `Rufus`, select the downloaded OpenWrt image, and click **Start**.

## Install OpenWrt

### Connect the small computer

Insert the USB drive into the small computer and connect power and Ethernet. Connect the other end of the Ethernet cable to your computer.

### Boot the small computer

Press `F2`, `F12`, or `Del` during startup to enter the BIOS, then select the USB drive as the boot device.

### Upload the OpenWrt firmware

After the system boots successfully, upload the downloaded firmware with `scp`.

```bash
cd path-to-the-firmware
scp firmware-file root@your-router-ip:/tmp/
```

### Write the firmware

Use `dd` to write the firmware. `/dev/sda` in the command below is the small computer's system disk. If your device uses another disk, identify it with `lsblk`.

```bash
ssh root@your-router-ip
cd /tmp
gzip -dc firmware-file | dd of=/dev/sda
```

### Reboot

When the write finishes, run `reboot`. Wait briefly, then connect to OpenWrt.

## Closing note

This is a high-level guide. If something is unclear, leave a comment and I will try to answer and expand the documentation.
