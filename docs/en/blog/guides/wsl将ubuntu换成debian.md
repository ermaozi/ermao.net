---
title: Replace Ubuntu with Debian in WSL 2 Without Losing Your Backup
createTime: '2025/01/26 20:18:30'
permalink: /en/article/ubm5k5vn/
lang: en-US
translationOf: /article/ubm5k5vn/
tags:
  - WSL
  - Debian
  - Ubuntu
  - Windows
  - Linux
  - WSL 2
description: Export an Ubuntu WSL distribution, install Debian alongside it, migrate selected data, verify the new environment, and only then unregister Ubuntu.
---

I wanted a smaller Debian environment in WSL 2, so these notes document a safe replacement workflow.

::: danger Important correction
Importing an Ubuntu export under a name such as `Debian-Backup` does **not** convert it to Debian. It creates another WSL distribution containing the same Ubuntu root filesystem. Install a clean Debian distribution and migrate only the files and configuration you need.
:::

<!-- more -->

Run the following WSL commands in **Windows PowerShell or Command Prompt**, not inside the Linux shell. Microsoft's current [WSL command reference](https://learn.microsoft.com/windows/wsl/basic-commands) documents the same export, install, default-distribution, and unregister operations.

## 1. Identify and stop the Ubuntu distribution

List every installed distribution, including stopped ones:

```powershell
wsl --list --verbose
```

The exact name may be `Ubuntu`, `Ubuntu-20.04`, or another value. Substitute the name shown on your computer in every later command.

Close work running inside Ubuntu, then stop that distribution:

```powershell
wsl --terminate Ubuntu-20.04
```

## 2. Export a complete backup

Choose an explicit backup path with enough free space:

```powershell
wsl --export Ubuntu-20.04 C:\WSL-Backups\ubuntu-20.04-backup.tar
```

![Exporting the current Ubuntu WSL distribution =1292x260](https://image.ermao.net/images/article/ubm5k5vn/image.png)

Confirm that the TAR file exists and has a plausible non-zero size. Keep it until Debian has been tested and any required data has been copied.

To validate the backup without touching the original distribution, you can import it under a temporary name:

```powershell
wsl --import Ubuntu-Restore-Test C:\WSL\Ubuntu-Restore-Test C:\WSL-Backups\ubuntu-20.04-backup.tar --version 2
wsl -d Ubuntu-Restore-Test
```

After checking important files, leave the test shell and remove only the temporary test instance:

```powershell
wsl --unregister Ubuntu-Restore-Test
```

## 3. Install a clean Debian distribution

Check the currently offered distribution names:

```powershell
wsl --list --online
```

Install Debian:

```powershell
wsl --install -d Debian
```

![Installing Debian for WSL =1863x431](https://image.ermao.net/images/article/ubm5k5vn/image-2.png)

Launch Debian and create the requested Linux user and password:

```powershell
wsl -d Debian
```

Keep Ubuntu and Debian installed side by side during migration. WSL supports multiple distributions, so there is no need to delete the working environment first.

## 4. Migrate selected data

Copy projects, documents, SSH configuration, and dotfiles only after reviewing them. Linux distributions use different package names, versions, defaults, and system configuration; copying the entire Ubuntu root filesystem over Debian would defeat the purpose of a clean migration.

From Windows Explorer, both distributions are available under paths similar to:

```text
\\wsl.localhost\Ubuntu-20.04\home\your-ubuntu-user
\\wsl.localhost\Debian\home\your-debian-user
```

For large development trees, an archive preserves Linux permissions more reliably than dragging files through a Windows filesystem. One option is to create an archive in Ubuntu:

```bash
tar --xattrs --acls -czf /mnt/c/WSL-Backups/home-projects.tar.gz \
  -C "$HOME" projects .ssh .gitconfig
```

Then extract it as the intended Debian user:

```bash
tar --xattrs --acls -xzf /mnt/c/WSL-Backups/home-projects.tar.gz -C "$HOME"
```

Review `.ssh` permissions after extraction and reinstall packages from Debian's repositories rather than copying Ubuntu package databases or system binaries.

## 5. Verify Debian and make it the default

Test the projects, network access, shell configuration, credentials, and services you rely on. Then set Debian as the distribution used by a plain `wsl` command:

```powershell
wsl --set-default Debian
wsl --list --verbose
```

If you use Windows Terminal, select Debian as its default profile.

![Changing the default Windows Terminal profile =1770x1211](https://image.ermao.net/images/article/ubm5k5vn/image-3.png)

## 6. Unregister Ubuntu only after verification

`wsl --unregister` permanently removes the distribution's WSL filesystem, installed packages, settings, and local data.

When Debian has been verified and the export is safely retained:

```powershell
wsl --unregister Ubuntu-20.04
```

![Unregistering the old Ubuntu distribution =909x163](https://image.ermao.net/images/article/ubm5k5vn/image-1.png)

Do not delete the exported backup until you have completed at least one normal work cycle in Debian and confirmed that nothing important is missing.
