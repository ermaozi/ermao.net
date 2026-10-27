---
url: /en/article/9zktdhyx/index.md
description: >-
  Install OpenWrt on an x86 mini PC by writing a USB image, booting it,
  uploading firmware, copying it with dd, and rebooting.
---
A friend recently asked me to install OpenWrt on a software router. I wrote down the process for anyone who wants to do the same.

## Process in one sentence

Write the system image to a USB drive, insert it into the small computer, boot from USB, upload the OpenWrt firmware, write it to the system disk with `dd`, and reboot.

## What you need

* A USB drive
* A small computer
* Another computer
* An Ethernet cable

## Download the OpenWrt firmware and imaging tool

### Download OpenWrt

Official downloads: <https://downloads.openwrt.org/>

Download the firmware for your device model. The example here uses an `x86_64` image.

### Download an imaging tool

This guide uses `Rufus`: <https://rufus.ie/>

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

::: danger Confirm the destination disk before writing
Writing an image overwrites the selected disk's partition table and data. Back up anything you need to retain to another device and verify that it can be restored. `/dev/sda` is not a fixed name for the internal disk: it may be the USB boot drive or another disk. Do not infer the destination from the device name alone.
:::

From the USB-booted system, identify the intended **whole disk** by its capacity, model, serial number, and mount points; distinguish it from the boot USB and any data disks. `lsblk` can help if installed; otherwise use the available disk-management tools. Do not write to a mounted destination or a partition such as `/dev/sda1`. If the disk identity or image compatibility is uncertain, stop here.

The following is a template for a gzip-compressed image. Replace the image path and set `TARGET_DISK` to the verified whole-disk path. The empty default deliberately prevents writing; the block-device check does not prove that you selected the correct disk.

```bash
ssh root@your-router-ip
cd /tmp
IMAGE='replace-with-image.img.gz'
TARGET_DISK='' # Set only after identifying the intended whole disk

if [ -n "$TARGET_DISK" ] && [ -b "$TARGET_DISK" ] && gzip -t "$IMAGE"; then
    gzip -dc "$IMAGE" | dd of="$TARGET_DISK"
    sync
else
    echo 'Stopped: verify the image and destination disk.'
fi
```

`gzip -t` checks compressed-file integrity, not authenticity or hardware compatibility. Compare the download against the official checksum separately. Check both decompression and write output for errors; do not reboot after an error. `sync` flushes pending writes but does not verify the installed system. See the [GNU dd manual](https://www.gnu.org/software/coreutils/manual/html_node/dd-invocation.html) for the meaning of `of=`; the tools included in OpenWrt may be BusyBox versions with different optional flags.

### Reboot

When the write finishes, run `reboot`. Wait briefly, then connect to OpenWrt.

## Closing note

This is a high-level guide. If something is unclear, leave a comment and I will try to answer and expand the documentation.
