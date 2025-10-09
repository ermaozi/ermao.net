---
title: macOS ClashVergeRev 安装与使用指南
createTime: 2025/01/22 22:50:41
permalink: /article/6vxkmmuh/
---
Clash Verge Rev 是一款高效的代理工具，专为 macOS 用户打造，兼容 M 芯片和 Intel 芯片。本文将为您详细介绍如何在 macOS 上安装和配置 Clash Verge Rev，帮助您顺利开始使用。

<!-- more -->

## 1. 下载与安装

### 选择版本：
前往 Clash Verge Rev 的官方网站，根据您的设备架构下载相应的版本：

- **GitHub (推荐)**: [Clash Verge Rev Releases](https://github.com/Clash-Verge-rev/clash-verge-rev/releases)
- M 芯片版本: [Clash.Verge-aarch64.dmg](https://down.shudongapi.monster/client-download/Clash.Verge-aarch64.dmg)
- Intel 芯片版本: [Clash.Verge.dmg](https://down.shudongapi.monster/client-download/Clash.Verge.dmg)

### 安装过程：
1. 下载完成后，双击打开 `.dmg` 文件，系统可能会提示您允许打开来自未知开发者的文件。
2. 如果出现安全警告（“无法打开 Clash Verge，因为 Apple 无法检查是否包含恶意软件”），请按照以下步骤解决：
   - 打开“系统偏好设置” > “安全性与隐私” > “通用”。
   - 点击“仍然打开”以允许运行该应用。

   *官方教程：[如何打开来自未知开发者的 Mac App](https://support.apple.com/zh-cn/guide/mac-help/mh40616/15.0/mac/15.0)*

### 完成安装：
1. 将 **Clash Verge Rev** 拖动到“应用程序”文件夹中。
2. 安装完成后，您可以从“应用程序”文件夹启动 Clash Verge Rev。

---

## 2. 基本设置

### 添加订阅链接：
如果没有订阅链接，可以参考这篇文章：[https://www.ermao.net/posts/vpn](https://www.ermao.net/posts/vpn)。

1. 打开 **Clash Verge Rev** 软件，点击顶部菜单栏中的“订阅”选项。
2. 在订阅页面，将复制好的订阅地址粘贴到“订阅文件链接”框内，并点击“导入”。
3. 等待导入完成。如果导入失败，尝试刷新页面并获取新的订阅地址。

**注意**：如果套餐已过期或订阅地址失效，导入可能会失败，请确保链接有效。

### 选择代理节点：
1. 订阅导入成功后，点击软件中的“代理”选项。
2. 在主界面左侧的“代理”栏中，您将看到通过订阅导入的服务器列表。
3. 点击“手动选择节点”并选择您需要使用的节点。

**说明**：默认情况下，您无需修改其他设置，只需选择所需的代理节点即可。

---

## 3. 代理模式说明

- **规则模式**：根据预设的规则，决定哪些流量通过代理。
- **全局模式**：所有流量都通过代理。请注意，开启全局模式可能会导致国内网络的速度变慢，建议仅在必要时使用。
- **直连模式**：所有网络流量不通过代理，直接访问。

---

## 4. 系统代理设置

为了确保 macOS 系统中的所有应用都通过 Clash Verge Rev 进行代理，您需要启用系统代理。

1. 在 **Clash Verge Rev** 的主界面，点击左侧的“设置”按钮，启用“TUN（虚拟网卡）模式”。此时，所有网络流量将通过 Clash Verge Rev 进行处理。
   
2. 如果您的设备无法启用 TUN 模式，可以选择开启“系统代理”选项，以确保流量通过代理。

**注意**：TUN 模式和系统代理模式不能同时启用，您只能选择其中之一。

---

## 5. 问题排查

- **导入订阅失败**：如果在导入订阅时提示“链接无效”或“无法连接”，请确保订阅链接正确，并检查网络连接是否正常。
- **Clash Verge Rev 无效**：若软件无法正常工作，尝试重启应用或重新设置系统代理。

---

## 6. 卸载 Clash Verge Rev

如果您需要卸载 Clash Verge Rev，可以按以下步骤操作：

1. 打开“应用程序”文件夹。
2. 找到 **Clash Verge Rev** 应用图标，右键点击并选择“移到废纸篓”。
3. 清空废纸篓，完成卸载。

---

以上就是在 macOS 上安装和配置 **Clash Verge Rev** 的完整步骤，按照这些简单的指导，您可以快速开始使用这一高效的代理工具。如果有任何问题，请随时查阅官方教程或联系我们获取更多帮助！