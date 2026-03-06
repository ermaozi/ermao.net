---
url: /blog/yecv6pn6/index.md
description: >-
  手把手带你完成 OpenClaw 入门：环境准备、安装配置、Telegram Bot
  接入、模型接入、代理设置、安全加固与常见问题排查，并附站内相关教程导航。
---
![OpenClaw 初阶教程封面](https://image.ermao.net/images/blog/yecv6pn6/20260303_132046-c34687.png)

如果你想把 AI 助手放进 Telegram/Discord 里用，而不是每次都开网页，这篇就是给你的。本文按「准备 → 安装 → 配置 → 排错 → 安全」顺序写，新手照着做基本都能跑通。

## OpenClaw 是什么？适合谁用？

OpenClaw 可以理解为一个本地运行的 AI 网关：

* 你的设备运行 Gateway（中转服务）
* Gateway 连接聊天平台（Telegram/Discord/WhatsApp）
* Gateway 再连接大模型（GPT/Claude/DeepSeek 等）
* 你在聊天软件发消息，Gateway 转给模型并返回结果

它适合：

* 希望在聊天软件里随时调用 AI 的用户
* 不想频繁切换多个 AI 网页/客户端的人
* 想保留本地配置和可控工作流的进阶用户

::: tip 先看基础
如果你是纯新手，建议先补一下 [什么是翻墙](./什么是翻墙.md)，再继续本文。
:::

## 开始前准备（务必先做）

### 1）系统与运行环境

* **macOS**：体验最好，原生支持
* **Windows**：建议使用 WSL2 + Ubuntu 22.04（可参考 [WSL 将 Ubuntu 换成 Debian](./wsl将ubuntu换成debian.md) 的操作思路）
* **Linux**：可直接安装

如果打算 24 小时在线，可选低功耗设备（如 Mac mini）或 VPS。

### 2）模型 API 准备

OpenClaw 本身不是模型，它需要你接入模型提供商。新手建议：

* 先用按量计费方案（如 OpenRouter / AI/ML API）快速试错
* 稳定使用后再考虑订阅型方案
* 不建议一上来就用不稳定中转，排错成本高

### 3）网络环境检查（关键）

Telegram/Discord 需要可用代理环境。常见客户端可参考：

* [ClashVergeRev 安装与使用指南](../翻墙工具/ClashVergeRev安装与使用指南.md)
* [windows 下载安装 clash](../翻墙工具/windows下载安装clash.md)
* [Shadowrocket 新手使用教程](../翻墙工具/Shadowrocket新手使用教程.md)

终端快速验证：

```bash
curl -I https://api.telegram.org
```

返回 `200` 或 `301/302` 通常说明链路可达。

## 安装 OpenClaw（按顺序执行）

### Step 1：安装 Node.js（要求 >= 22）

```bash
node --version
npm --version
```

如果版本低于 22，请先升级 Node.js。

### Step 2：安装 OpenClaw

推荐官方安装脚本：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装后验证：

```bash
openclaw --version
```

### Step 3：初始化并安装守护进程

```bash
openclaw onboard --install-daemon
```

`--install-daemon` 表示后台常驻运行，重启后可自动恢复。

## 首次配置流程（最容易卡住的部分）

### 1）选择模型提供商

* 已有官方账号：按向导授权
* 使用第三方 API：先选 `Skip`，稍后手动配置

### 2）选择聊天平台

新手建议先接 **Telegram（Bot API）**：

* 配置简单，出错面较小
* Bot 管理成熟，验证流程清晰

如果你还没有 Telegram 账号，可先看 [Telegram 注册使用教程](./telegram注册使用教程.md)。

### 3）创建 Telegram Bot

在 Telegram 中搜索 `@BotFather`，依次执行：

1. `/start`
2. `/newbot`
3. 设置 Bot 名称
4. 设置用户名（必须以 `_bot` 结尾）

随后会得到 Token（例如 `123456:xxxx`），粘贴回 OpenClaw 向导即可。

### 4）完成引导并确认启动

正常情况下会看到类似输出：

```text
Gateway started on http://127.0.0.1:18789
Telegram channel connected
Ready to chat
```

## 配置第三方模型（以 OpenRouter 为例）

### 方式 A：Web UI（推荐）

访问：`http://127.0.0.1:18789`

路径：`Settings -> Models -> Add Provider`

填写：

* Provider Name：`openrouter`
* Base URL：`https://openrouter.ai/api/v1`
* API Key：你的密钥
* Model ID：如 `anthropic/claude-opus-4`

### 方式 B：直接改配置文件

```bash
nano ~/.openclaw/openclaw.json
```

示例（按你自己的 key 与模型替换）：

```json
{
  "models": {
    "providers": {
      "openrouter": {
        "baseUrl": "https://openrouter.ai/api/v1",
        "apiKey": "your-api-key-here",
        "api": "openai-completions",
        "models": [
          {
            "id": "anthropic/claude-opus-4",
            "name": "Claude Opus 4",
            "reasoning": true
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/anthropic/claude-opus-4"
      }
    }
  }
}
```

重启服务：

```bash
openclaw restart
```

## 代理设置（Bot 不回消息时先看这里）

先确认本地代理端口（如 `7890/7891`），再设置环境变量：

```bash
# zsh
nano ~/.zshrc

# bash
nano ~/.bashrc
```

追加：

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7891
```

生效并重启：

```bash
source ~/.zshrc   # 或 source ~/.bashrc
openclaw restart
```

如果你代理本身还不稳定，建议先按 [电脑如何翻墙](../翻墙工具/电脑如何翻墙.md) 或 [手机如何翻墙](../翻墙工具/手机如何翻墙.md) 把基础链路跑通。

## 常见问题排查（先执行这三步）

### 1）Bot 不回消息

```bash
openclaw status
openclaw logs --tail 50
openclaw agent --message "测试" --thinking high
```

* `ECONNREFUSED` / `timeout`：通常是网络或代理问题
* `401 Unauthorized`：API Key 错误或失效
* `rate limit`：额度不足或触发限流

### 2）端口占用（18789）

```bash
lsof -i :18789
kill -9 YOUR_PID
openclaw restart
```

### 3）Telegram 配对失败

```bash
openclaw pairing list
openclaw pairing approve telegram YOUR_TELEGRAM_USER_ID
```

`User ID` 可通过 Telegram 的 `@userinfobot` 获取。

## 安全加固（强烈建议）

OpenClaw 能力很强，安全配置不能省：

1. 在模型提供商后台设置每日/每月预算上限
2. 对高风险工具启用审批（如 `exec`、`email`）
3. Gateway 保持本地监听（`127.0.0.1`），不要改成 `0.0.0.0`

审批示例：

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "approvalRequired": true
    },
    "email": {
      "enabled": true,
      "approvalRequired": true
    }
  }
}
```

## 成本建议（新手版）

* **轻度尝鲜**：按量 API + 本地设备，优先验证可用性
* **稳定使用**：按月评估成本后再升级模型档位
* **不建议**：在未跑通流程前直接年付或重投入

先跑通再优化，是最省钱的路径。

## 本站相关文章（建议收藏）

* [ClashVergeRev安装与使用指南](../翻墙工具/ClashVergeRev安装与使用指南.md)
* [windows下载安装clash](../翻墙工具/windows下载安装clash.md)
* [Shadowrocket新手使用教程](../翻墙工具/Shadowrocket新手使用教程.md)
* [电脑如何翻墙](../翻墙工具/电脑如何翻墙.md)
* [手机如何翻墙](../翻墙工具/手机如何翻墙.md)
* [telegram注册使用教程](./telegram注册使用教程.md)
* [如何解决github无法访问](./如何解决github无法访问.md)
* [本地部署DeepSeek](./本地部署DeepSeek.md)

## 写在最后

OpenClaw 的价值，在于把 AI 使用场景从「打开网页」变成「在聊天软件里直接工作」。

如果你第一次配置没成功，优先检查三件事：**代理是否可用、API Key 是否有效、日志是否有明确报错**。按本文顺序排查，基本都能定位问题。
