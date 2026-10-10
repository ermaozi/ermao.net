---
title: AnyTLS协议是什么？AnyTLS原理、sing-box部署与客户端配置完整指南（2026）
createTime: 2026/05/08 08:33:10
updateTime: 2026/10/10 05:35:00
permalink: /article/anytls-guide/
tags:
  - AnyTLS
  - sing-box
  - 科学上网
  - 代理协议
  - 翻墙教程
description: 2026年 AnyTLS 协议完整指南：从协议原理、填充机制、会话管理到 sing-box 服务端部署、Windows/macOS/Linux/Android/iOS 客户端配置与常见问题排查，帮助你快速上手 AnyTLS。
---

如果你正在找「AnyTLS 协议怎么用」，这篇可以直接当实战手册：先讲清 AnyTLS 是什么、和其他代理协议有什么差异，再一步步完成 sing-box 服务端部署与多平台客户端配置，最后给出常见报错和排查思路，方便你少踩坑、快速落地。

<!-- more -->

## 一、AnyTLS协议介绍

### 1.1 什么是AnyTLS协议

AnyTLS 是基于 TLS 的代理协议，参考实现和协议文档位于 [anytls/anytls-go](https://github.com/anytls/anytls-go)。sing-box 是支持 AnyTLS 的实现之一，从 1.12.0 起提供 AnyTLS 入站和出站支持。本文以 sing-box 配置为例，不将它与协议项目本身混为一谈。

AnyTLS 的核心思路是把标准 TLS 当作传输外壳，再配合可自定义的填充策略（Padding Scheme）来提升流量隐蔽性，同时尽量维持性能和兼容性。

```mermaid
graph LR
    AnyTLS --> Client["客户端"]
    AnyTLS --> Server["服务端"]
    AnyTLS --> TLSTransport["TLS传输"]

    %% 客户端子项
    Client --> SOCKS5["SOCKS5监听"]
    Client --> SessionMgmt["会话管理"]
    Client --> PaddingProc["填充处理"]

    %% 服务端子项
    Server --> Auth["用户认证"]
    Server --> MultiUser["多用户支持"]
    Server --> Forwarding["流量转发"]

    %% TLS传输子项
    TLSTransport --> Encryption["TLS加密"]
    TLSTransport --> PaddingScheme["填充方案"]
    TLSTransport --> CertValidation["证书验证"]
```

### 1.2 协议与实现版本

[参考协议文档](https://github.com/anytls/anytls-go/blob/main/docs/protocol.md)记录了协议 v2 在 2025 年 4 月引入流打开响应、心跳和服务端设置协商。sing-box 的支持版本以其 [AnyTLS 入站](https://sing-box.sagernet.org/configuration/inbound/anytls/)和[出站文档](https://sing-box.sagernet.org/configuration/outbound/anytls/)为准。协议版本与 sing-box 软件版本是不同概念，部署前需确认两端实现兼容。

主要能力：

```mermaid
graph LR
    AnyTLS((AnyTLS))

    %% 第一层级
    AnyTLS --> Padding["灵活填充"]
    AnyTLS --> Compatibility["TLS兼容"]
    AnyTLS --> Session["会话管理"]
    AnyTLS --> MultiUser["多用户支持"]

    %% 灵活填充子项
    Padding --> CustomPadding["自定义填充方案"]
    Padding --> Stealth["流量隐蔽增强"]
    Padding --> AntiDetection["抗检测能力"]

    %% TLS兼容子项
    Compatibility --> StandardTLS["标准TLS协议"]
    Compatibility --> CertSupport["证书支持"]
    Compatibility --> BroadCompat["广泛兼容"]

    %% 会话管理子项
    Session --> IdleDetect["空闲会话检测"]
    Session --> Timeout["会话超时管理"]
    Session --> KeepAlive["最小会话保持"]

    %% 多用户支持子项
    MultiUser --> Auth["密码哈希认证"]
    MultiUser --> UserMgmt["多用户管理"]
    MultiUser --> AccessControl["访问控制"]
```

### 1.3 设计理念与特点

#### 1.3.1 设计理念

AnyTLS的设计遵循以下原则：

- TLS兼容：基于标准TLS协议，确保广泛兼容性
- 灵活填充：支持自定义填充方案，增强流量隐蔽性
- 会话管理：完善的空闲会话检测和超时机制
- 简单配置：配置简洁，易于部署和维护
- 安全优先：使用现代加密算法，确保通信安全

#### 1.3.2 协议特点

| 特点 | 说明 |
|------|------|
| 基于TLS | 使用标准TLS协议传输，兼容性好 |
| 填充方案 | 支持自定义填充，增强隐蔽性 |
| 会话管理 | 空闲会话检测、超时机制 |
| 密码认证 | TLS 内校验密码哈希 |
| 多用户支持 | 支持多用户管理 |
| TCP/UDP支持 | 同时支持TCP和UDP转发 |

### 1.4 适用场景

AnyTLS 比较适合下面这些场景：

- 流量隐蔽需求：需要TLS流量伪装的场景
- 实验性部署：对新协议感兴趣的技术用户
- 特定需求：需要自定义填充方案的代理方案
- 学习和研究：研究和学习代理协议
- 稳定网络环境：在稳定网络环境下使用

::: info 重要说明
AnyTLS 仍在持续迭代。和 VLESS、Hysteria2 这类成熟方案相比，它的生态和客户端支持还在补齐中，更适合愿意折腾、愿意做测试的用户先用起来。
:::

### 1.5 与其他代理协议对比

| 特性 | AnyTLS | VLESS | Trojan | Hysteria2 | TUIC |
|------|--------|-------|--------|-----------|------|
| 传输协议 | TCP/TLS | TCP/UDP | TCP | UDP(QUIC) | UDP(QUIC) |
| 加密方式 | TLS | TLS/XTLS | TLS | QUIC TLS | QUIC TLS |
| 流量伪装 | 填充方案 | Reality/WS | 强 | HTTP/3 | 弱 |
| 多用户支持 | 支持 | 支持 | 支持 | 支持 | 支持 |
| 性能 | 中 | 高 | 中 | 极高 | 高 |
| 配置复杂度 | 低 | 中 | 低 | 低 | 低 |
| 客户端支持 | sing-box | 广泛 | 广泛 | 较广 | 较广 |

## 二、协议工作原理

### 2.1 整体架构

AnyTLS采用客户端-服务器架构，基于TLS协议构建：

```mermaid
flowchart TB
    %% 客户端区域
    subgraph Client ["客户端"]
        App["应用程序"] --> Proxy["AnyTLS客户端 SOCKS5代理"]
        Proxy --> Padding["填充处理"]
    end

    %% 传输区域
    subgraph Transport ["TLS传输"]
        Auth["用户认证"]
    end

    %% 服务端区域
    subgraph Server ["服务端"]
        ServerEnd["AnyTLS服务端"]
        Decrypt["解密模块"] --> Target["目标服务器"]
    end

    %% 跨区域连线
    Padding -- "TLS加密" --> Auth
    Auth -- "TLS加密" --> ServerEnd
    ServerEnd --> Auth
    Auth --> Decrypt
```

组件说明：

| 组件 | 功能|
|------|------|
| TLS连接 | 提供加密传输通道|
| 填充处理 | 添加填充数据，增强隐蔽性|
| 用户认证 | 验证客户端身份|
| 会话管理 | 管理连接会话生命周期|

### 2.2 填充方案机制

AnyTLS 会通过填充方案来增强流量隐蔽性：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务端

    Note over C, S: TLS握手阶段
    C->>S: ClientHello
    S->>C: ServerHello + Certificate
    C->>S: Finished

    Note over C, S: 填充数据处理
    C->>S: 应用数据 + 填充数据
    S->>C: 响应数据 + 填充数据

    Note over C, S: 会话管理
    C->>S: 心跳 / 保活
    S->>C: 会话确认
```

### 2.3 填充方案详解

AnyTLS 支持自定义填充方案，下面是常见默认配置：

``` routeros
默认填充方案：
┌──────────────────────────────────────────────────────────────────────┐
│ stop=8                                                 # 停止条件     │
│ 0=30-30                                                # 初始填充     │
│ 1=100-400                                              # 小数据填充   │
│ 2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000  # 中等数据     │
│ 3=9-9,500-1000                                         # 快速填充     │
│ 4=500-1000                                             # 大数据填充   │
│ 5=500-1000                                             # 备用填充     │
│ 6=500-1000                                             # 备用填充     │
│ 7=500-1000                                             # 备用填充     │
└──────────────────────────────────────────────────────────────────────┘
```

填充方案参数说明：

| 参数 | 说明 | 示例 |
|------|------|------|
| stop | 停止处理填充的序号；stop=8 只处理序号 0–7，并非连接数量 | stop=8 |
| 数字键 | 按 Write TLS 次数计数的序号；0 是认证阶段的特殊项 | 0、1、2 |
| 数字范围 | 0 项指定认证填充长度；1 起指定分包的 TLS 明文目标尺寸，不含 TLS 加密开销 | 100-400 |
| c | 检查标记：上一个分包后若用户数据已发完，结束本次 Write TLS，跳过后续填充包 | 500-1000,c,500-1000 |

序号 0 的 `padding0` 随认证请求发送，不支持分包。从序号 1 起，可按策略分包或用 `cmdWaste` 填充；`stop` 之前未定义策略的序号直接发送。具体含义以[协议中的填充说明](https://github.com/anytls/anytls-go/blob/main/docs/protocol.md#paddingscheme-具体含义与实现)为准，填充不能保证流量不可识别。

### 2.4 会话管理机制

AnyTLS 也提供了比较完整的会话管理能力：

``` nix
会话管理参数：
┌────────────────────────────────────────────────────────────────┐
│ idle_session_check_interval: 30s    # 空闲会话检查间隔          │
│ idle_session_timeout: 30s           # 空闲会话超时时间          │
│ min_idle_session: 5                 # 最小空闲会话数量          │
└────────────────────────────────────────────────────────────────┘
```

会话管理流程：

1. 空闲检测：定期检查会话空闲状态
2. 超时处理：超过设定时间自动关闭空闲会话
3. 最小保持：保持一定数量的空闲会话以快速响应

### 2.5 认证机制

AnyTLS 在 TLS 握手完成后发送密码哈希认证请求：`sha256(password)`（32 字节）、`padding0` 长度（大端 uint16）和填充内容。认证通过后才进入会话循环，不会发送用户名与密码的组合。

sing-box 的 `users[].name` 是用于区分用户配置的标签，不是客户端必须发送的第二项凭证。客户端 `password` 应与服务端对应用户的密码一致，配置中仍填写原始密码，由实现计算认证哈希；不要手动把哈希填入 `password`。

1. 客户端建立 TLS 连接并验证服务端证书
2. TLS 握手完成后，在加密连接内发送认证请求
3. 服务端校验密码哈希并完整读取认证填充
4. 认证成功后处理会话和代理流；失败则按实现关闭连接或进入已配置的回落处理

## 三、服务端部署教程

### 3.1 环境准备

#### 3.1.1 服务器要求

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 1核 | 2核+ |
| 内存 | 256MB | 1GB+ |
| 存储 | 5GB | 20GB+ |
| 带宽 | 10Mbps | 100Mbps+ |
| 系统 | Debian 10+/Ubuntu 18.04+/CentOS 7+ | 最新稳定版 |

### 3.1.2 端口规划

| 服务 | 端口 | 说明 |
|------|------|------|
| AnyTLS | 443/TCP | 推荐使用443端口 |
| AnyTLS | 自定义 | 可修改端口 |

### 3.2 安装sing-box

本文使用 sing-box 1.12.0 或更高版本的 AnyTLS 支持。以下安装方式任选一种，不要在同一台机器上混用包管理安装和手动二进制安装。

#### 3.2.1 使用官方软件包安装

当前[官方安装文档](https://sing-box.sagernet.org/installation/package-manager/)提供的软件包安装脚本是 `https://sing-box.app/install.sh`。生产服务器应先下载并检查脚本、核对来源，再决定是否执行，不要直接运行不明来源的安装命令：

``` bash
curl -fsSL https://sing-box.app/install.sh -o sing-box-install.sh
# 阅读并核对脚本后再执行
sudo sh sing-box-install.sh
```

也可以按官方步骤配置 APT 软件源（Debian/Ubuntu），与上面的安装脚本二选一：

``` bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://sing-box.app/gpg.key -o /etc/apt/keyrings/sagernet.asc
sudo chmod a+r /etc/apt/keyrings/sagernet.asc
cat <<'EOF' | sudo tee /etc/apt/sources.list.d/sagernet.sources
Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc
EOF
sudo apt-get update
sudo apt-get install sing-box
```

软件包通常已经带有 systemd 服务。安装后用 `command -v sing-box` 和 `systemctl cat sing-box` 确认实际二进制和配置路径；官方 Linux [systemd 服务模板](https://github.com/SagerNet/sing-box/blob/stable/release/config/sing-box.service)使用 `/usr/bin/sing-box`，不要另建指向 `/usr/local/bin/sing-box` 的同名服务覆盖它。

#### 3.2.2 手动安装二进制

下面只适用于 Linux amd64；其他架构应在[官方 Releases](https://github.com/SagerNet/sing-box/releases)选择对应文件。先核对版本与发布校验信息，再安装。压缩包内包含版本目录，不能直接移动当前目录下并不存在的 `sing-box`。

``` bash
# 下载最新版本
SING_BOX_VERSION=$(curl -s https://api.github.com/repos/SagerNet/sing-box/releases/latest | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
wget https://github.com/SagerNet/sing-box/releases/download/v${SING_BOX_VERSION}/sing-box-${SING_BOX_VERSION}-linux-amd64.tar.gz

# 解压安装
tar -xzf "sing-box-${SING_BOX_VERSION}-linux-amd64.tar.gz"
sudo install -m 755 "sing-box-${SING_BOX_VERSION}-linux-amd64/sing-box" /usr/local/bin/sing-box

# 验证安装
sing-box version
```

#### 3.2.3 Docker安装

镜像名称以[官方 Docker 文档](https://sing-box.sagernet.org/installation/docker/)为准。下面的 `latest` 便于演示，生产环境应改用已验证的版本标签或摘要，保留旧版本以便回滚。

``` bash
# 拉取镜像
docker pull ghcr.io/sagernet/sing-box:latest

# 创建配置目录
sudo mkdir -p /etc/sing-box

# 运行容器（需要先创建配置文件）
docker run -d \
  --name sing-box \
  --restart=always \
  -v /etc/sing-box:/etc/sing-box \
  -p 443:443 \
  ghcr.io/sagernet/sing-box:latest \
  run -c /etc/sing-box/config.json
```

### 3.3 获取TLS证书

AnyTLS 依赖 TLS 证书，通常用 ACME 自动签发会更省心。

#### 3.3.1 使用acme.sh获取证书

``` bash
# 安装acme.sh
curl https://get.acme.sh | sh

# 设置默认CA
~/.acme.sh/acme.sh --set-default-ca --server letsencrypt

# 获取证书（需要域名已解析到服务器）
~/.acme.sh/acme.sh --issue -d your-domain.com --standalone

# 安装证书到指定目录
~/.acme.sh/acme.sh --install-cert -d your-domain.com \
  --key-file       /etc/sing-box/privkey.pem  \
  --fullchain-file /etc/sing-box/fullchain.pem \
  --reloadcmd      "systemctl restart sing-box"
```

#### 3.3.2 使用certbot获取证书

``` bash
# 安装certbot
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com

# 复制证书到sing-box目录
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /etc/sing-box/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /etc/sing-box/

# 设置自动续签
sudo systemctl enable certbot.timer
```

### 3.4 配置AnyTLS服务端

#### 3.4.1 基础配置文件

创建配置文件 `/etc/sing-box/config.json`：

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "user1",
          "password": "your_password_here"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ]
}
```

#### 3.4.2 完整配置示例

示例不指定 `log.output`，由 systemd journal 或容器日志收集输出，避免软件包服务用户没有 `/var/log/sing-box` 写权限导致启动失败。若自行启用文件日志，先为实际服务用户配置可写目录。

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "user1",
          "password": "password_for_user1"
        },
        {
          "name": "user2",
          "password": "password_for_user2"
        }
      ],
      "padding_scheme": [
        "stop=8",
        "0=30-30",
        "1=100-400",
        "2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000",
        "3=9-9,500-1000",
        "4=500-1000",
        "5=500-1000",
        "6=500-1000",
        "7=500-1000"
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "final": "direct"
  }
}
```

### 3.5 配置参数说明

#### 3.5.1 Inbound部分

| 参数 | 说明 | 示例值 |
|------|------|------|
| type | 协议类型 | anytls |
| tag | 标签名称 | anytls-in |
| listen | 监听地址 | ::（IPv6）或 0.0.0.0 |
| listen_port | 监听端口 | 443 |
| users | 用户配置列表 | 包含标签和密码的数组 |
| padding_scheme | 填充方案 | 数组形式 |
| tls | TLS配置 | 证书和密钥路径 |

#### 3.5.2 用户配置

| 参数 | 说明 | 示例值 |
|------|------|------|
| name | 用户配置标签，不参与协议认证 | user1 |
| password | 密码 | your_password |

#### 3.5.3 TLS配置

| 参数 | 说明 | 示例值 |
|------|------|------|
| enabled | 是否启用TLS | true |
| server_name | 服务器名称 | your-domain.com |
| key_path | 私钥路径 | /etc/sing-box/privkey.pem |
| certificate_path | 证书路径 | /etc/sing-box/fullchain.pem |

### 3.6 配置防火墙

#### 3.6.1 UFW配置（Ubuntu/Debian）

``` bash
# 允许AnyTLS端口
sudo ufw allow 443/tcp comment 'AnyTLS'

# 重新加载防火墙
sudo ufw reload

# 查看状态
sudo ufw status
```

#### 3.6.2 firewalld配置（CentOS/RHEL）

``` bash
# 添加AnyTLS端口
sudo firewall-cmd --permanent --add-port=443/tcp

# 重新加载防火墙
sudo firewall-cmd --reload

# 查看规则
sudo firewall-cmd --list-all
```

#### 3.6.3 iptables配置

``` bash
# 允许TCP端口
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 保存规则
sudo iptables-save > /etc/iptables/rules.v4
```

### 3.7 启动sing-box服务

#### 3.7.1 按安装方式选择systemd服务

**软件包安装**：先运行 `systemctl cat sing-box`，沿用安装包自带服务和它指定的配置路径，不要创建同名服务覆盖它。

**手动二进制安装**：仅当按 3.2.2 节安装到 `/usr/local/bin/sing-box`，且系统没有已有的 `sing-box.service` 时，才创建 `/etc/systemd/system/sing-box.service`。若路径不同，先用 `command -v sing-box` 核实并修改 `ExecStart`：

``` ini
[Unit]
Description=sing-box service
Documentation=https://sing-box.sagernet.org
After=network.target nss-lookup.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/sing-box run -c /etc/sing-box/config.json
Restart=on-failure
RestartSec=5s
LimitNOFILE=infinity

[Install]
WantedBy=multi-user.target
```

#### 3.7.2 启动服务

``` bash
# 设置权限
sudo chmod 600 /etc/sing-box/config.json

# 重载systemd
sudo systemctl daemon-reload

# 验证配置（必须通过后再启动）
sudo sing-box check -c /etc/sing-box/config.json

# 启动服务
sudo systemctl start sing-box

# 设置开机自启
sudo systemctl enable sing-box

# 查看状态
sudo systemctl status sing-box
```

#### 3.7.3 验证服务

``` bash
# 检查端口监听
sudo ss -tlnp | grep 443

# 查看日志
sudo journalctl -u sing-box -f

# 测试连接（需要客户端）
```

### 3.8 使用Docker部署

#### 3.8.1 Docker Compose配置

创建 `docker-compose.yml` 文件。将 3.4.1 节的基础配置保存为同目录的 `config.json`，把证书和私钥放入 `certs/fullchain.pem`、`certs/privkey.pem`。下面分别挂载到 JSON 中相同的绝对路径。示例使用容器日志，不要求额外挂载日志目录：

``` yaml
version: "3.8"

services:
  sing-box:
    image: ghcr.io/sagernet/sing-box:latest
    container_name: sing-box
    restart: always
    ports:
      - "443:443"
    volumes:
      - ./config.json:/etc/sing-box/config.json:ro
      - ./certs/fullchain.pem:/etc/sing-box/fullchain.pem:ro
      - ./certs/privkey.pem:/etc/sing-box/privkey.pem:ro
    command: run -c /etc/sing-box/config.json
```

#### 3.8.2 启动Docker服务

``` bash
# 启动服务
docker compose config
docker compose run --rm sing-box check -c /etc/sing-box/config.json
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

## 四、客户端配置指南

### 4.1 各平台客户端推荐

| 平台 | 客户端 | 特点 | 推荐度 |
|------|--------|------|------|
| Windows | sing-box | 官方支持，功能完整 | ★★★★★ |
| Windows | v2rayN | 多协议支持，界面友好 | ★★★★☆ |
| macOS | sing-box | 官方支持，功能强大 | ★★★★★ |
| Linux | sing-box | 官方支持，性能最佳 | ★★★★★ |
| Android | sing-box | 多协议支持，功能全面 | ★★★★★ |
| Android | v2rayNG | 多协议支持，界面友好 | ★★★★☆ |
| iOS | sing-box | 多协议支持 | ★★★★★ |
| iOS | Shadowrocket | 功能全面，支持AnyTLS | ★★★★☆ |

### 4.2 配置参数说明

#### 4.2.1 客户端配置字段

| 参数 | 说明 | 示例值 |
|------|------|------|
| type | 协议类型 | anytls |
| tag | 标签名称 | anytls-out |
| server | 服务器地址 | your-domain.com |
| server_port | 服务器端口 | 443 |
| password | 密码 | your_password |
| idle_session_check_interval | 空闲会话检查间隔 | 30s |
| idle_session_timeout | 空闲会话超时时间 | 30s |
| min_idle_session | 最小空闲会话数 | 5 |

### 4.3 Windows客户端配置

#### 4.3.1 sing-box配置

创建配置文件 `client.json`：

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "socks",
      "tag": "socks-in",
      "listen": "127.0.0.1",
      "listen_port": 1080
    },
    {
      "type": "http",
      "tag": "http-in",
      "listen": "127.0.0.1",
      "listen_port": 8080
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "30s",
      "idle_session_timeout": "30s",
      "min_idle_session": 5,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

#### 4.3.2 运行sing-box客户端

``` bash
# 使用配置文件运行
sing-box run -c client.json

# 或使用命令行参数
sing-box run -c client.json --log-level info

# 后台运行
Start-Process -NoNewWindow sing-box -ArgumentList "run -c client.json"
```

#### 4.3.3 v2rayN配置

1. 打开v2rayN
2. 点击"服务器" → “添加sing-box服务器”
3. 配置如下：

``` json
{
  "type": "anytls",
  "tag": "proxy",
  "server": "your-domain.com",
  "server_port": 443,
  "password": "your_password",
  "tls": {
    "enabled": true,
    "server_name": "your-domain.com"
  }
}
```

### 4.4 macOS客户端配置

#### 4.4.1 安装sing-box

``` bash
# 使用Homebrew安装
brew install sing-box

```

或手动下载

[https://github.com/SagerNet/sing-box/releases](https://github.com/SagerNet/sing-box/releases)

#### 4.4.2 创建配置文件

创建 `/usr/local/etc/sing-box/config.json`：

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "socks",
      "tag": "socks-in",
      "listen": "127.0.0.1",
      "listen_port": 1080
    },
    {
      "type": "http",
      "tag": "http-in",
      "listen": "127.0.0.1",
      "listen_port": 8080
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "30s",
      "idle_session_timeout": "30s",
      "min_idle_session": 5,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

### 4.4.3 运行sing-box

``` bash
# 前台运行（测试）
sing-box run -c /usr/local/etc/sing-box/config.json

# 后台运行
nohup sing-box run -c /usr/local/etc/sing-box/config.json &

# 使用LaunchAgent服务（推荐）
```

#### 4.4.4 配置LaunchAgent

创建文件 `~/Library/LaunchAgents/com.sagernet.sing-box.plist`：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.sagernet.sing-box</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/sing-box</string>
        <string>run</string>
        <string>-c</string>
        <string>/usr/local/etc/sing-box/config.json</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

加载服务：

``` bash
launchctl load ~/Library/LaunchAgents/com.sagernet.sing-box.plist
```

### 4.5 Linux客户端配置

#### 4.5.1 安装sing-box

``` bash
# Debian/Ubuntu
sudo apt install sing-box

# Arch Linux
sudo pacman -S sing-box

# 或按 3.2.2 节下载对应版本和架构的二进制，安装到 /usr/local/bin/sing-box
```

4.5.2 创建配置文件

创建 `/etc/sing-box/config.json`：

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "socks",
      "tag": "socks-in",
      "listen": "127.0.0.1",
      "listen_port": 1080
    },
    {
      "type": "http",
      "tag": "http-in",
      "listen": "127.0.0.1",
      "listen_port": 8080
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "30s",
      "idle_session_timeout": "30s",
      "min_idle_session": 5,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

#### 4.5.3 配置systemd服务

软件包安装沿用已有的 `sing-box.service`，用 `systemctl cat sing-box` 查看它的二进制和配置路径。手动二进制安装才参考 3.7.1 节创建服务，确保 `ExecStart` 与实际安装路径一致；不要混用 `/usr/bin/sing-box` 和 `/usr/local/bin/sing-box`。

仅在客户端机器执行以下检查和启动命令；如果这台机器已运行服务端，不要用客户端配置覆盖服务端配置：

``` bash
sudo sing-box check -c /etc/sing-box/config.json
sudo systemctl start sing-box
sudo systemctl enable sing-box
sudo systemctl status sing-box
```

### 4.6 Android客户端配置

#### 4.6.1 sing-box配置

安装支持 AnyTLS 的 sing-box 客户端。按[官方迁移说明](https://sing-box.sagernet.org/migration/#tun-address-fields-are-merged)，当前 TUN 配置使用 `address` 数组；旧 `inet4_address` / `inet6_address` 字段已在 1.12.0 移除。以下 Android 和 iOS 示例均使用新字段。

创建配置文件：

``` json
{
  "log": {
    "level": "info"
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "address": ["172.19.0.1/30"],
      "auto_route": true,
      "strict_route": true,
      "stack": "system"
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

#### 4.6.2 v2rayNG配置

v2rayNG 对 AnyTLS 的支持目前还比较有限，如果追求稳定，优先用 sing-box 客户端会更稳妥。

### 4.7 iOS客户端配置

#### 4.7.1 sing-box配置

1. 从App Store安装sing-box
2. 创建配置文件：

``` json
{
  "log": {
    "level": "info"
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "address": ["172.19.0.1/30"],
      "auto_route": true,
      "strict_route": true
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "anytls-out"
  }
}
```

### 4.8 订阅链接格式

AnyTLS 现在还没有统一的订阅链接规范，实际使用中大多还是直接下发 JSON 配置。

#### 4.8.1 sing-box配置示例

``` json
{
  "outbounds": [
    {
      "type": "anytls",
      "tag": "proxy",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "30s",
      "idle_session_timeout": "30s",
      "min_idle_session": 5,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ]
}
```

## 五、高级配置

### 5.1 多用户管理

#### 5.1.1 服务端多用户配置

``` json
{
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "user1",
          "password": "password_for_user1"
        },
        {
          "name": "user2",
          "password": "password_for_user2"
        },
        {
          "name": "user3",
          "password": "password_for_user3"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    }
  ]
}
```

### 5.2 自定义填充方案

#### 5.2.1 理解填充方案

填充方案可以理解成“包大小和节奏的伪装规则”，主要目的是提高流量隐蔽性：

``` hsp
填充方案格式说明：
┌────────────────────────────────────────────────────────────────┐
│ stop=N              # 只处理序号 0 到 N-1                       │
│ 数字=范围            # 数字是 Write TLS 序号，不是连接类型       │
│ c                   # 检查剩余数据；已发完则结束本次 Write      │
└────────────────────────────────────────────────────────────────┘
```

#### 5.2.2 自定义填充方案示例

```json
{
  "padding_scheme": [
    "stop=10",
    "0=50-50",
    "1=200-500",
    "2=500-800,c,800-1500",
    "3=10-10,500-1000",
    "4=500-1500",
    "5=500-1500",
    "6=500-1500",
    "7=500-1500"
  ]
}
```

### 5.3 会话参数调优

#### 5.3.1 客户端会话参数

``` json
{
  "outbounds": [
    {
      "type": "anytls",
      "tag": "anytls-out",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "60s",
      "idle_session_timeout": "120s",
      "min_idle_session": 3,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ]
}
```

参数说明：

| 参数 | 建议值 | 说明 |
|------|--------|------|
| idle_session_check_interval | 30s-60s | 检查间隔不宜过短 |
| idle_session_timeout | 60s-120s | 超时时间根据网络调整 |
| min_idle_session | 3-10 | 保持适量的空闲会话 |

### 5.4 与其他协议混用

#### 5.4.1 多协议服务端配置

``` json
{
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "user1",
          "password": "password1"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    },
    {
      "type": "vless",
      "tag": "vless-in",
      "listen": "::",
      "listen_port": 8443,
      "users": [
        {
          "uuid": "uuid-here",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ]
}
```

## 六、安全性注意事项

### 6.1 TLS配置安全

#### 6.1.1 证书安全

1. 使用有效的TLS证书（推荐Let's Encrypt）
2. 定期更新证书（建议自动续签）
3. 保护私钥安全，设置正确的文件权限
4. 使用强加密套件

#### 6.1.2 证书权限设置

``` bash
# 设置证书目录权限
sudo chmod 700 /etc/sing-box
sudo chmod 600 /etc/sing-box/privkey.pem
sudo chmod 644 /etc/sing-box/fullchain.pem
sudo chown root:root /etc/sing-box/*.pem
```

### 6.2 用户认证安全

#### 6.2.1 密码安全

1. 使用强密码（建议16位以上，包含大小写字母、数字、特殊字符）
2. 不同用户使用不同密码
3. 定期更换密码
4. 不要使用常见密码或字典词汇

#### 6.2.2 生成强密码

``` bash
# 使用openssl生成密码
openssl rand -base64 24

# 或使用pwgen
sudo apt install pwgen
pwgen -s 32 1
```

### 6.3 网络安全

#### 6.3.1 防火墙配置

``` bash
# 只开放必要端口
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 443/tcp
sudo ufw allow ssh
sudo ufw enable

# 查看规则
sudo ufw status numbered
```

### 6.3.2 限制访问来源（可选）

``` bash
# 只允许特定IP访问
sudo ufw allow from 192.168.1.0/24 to any port 443 proto tcp

# 或使用iptables
sudo iptables -A INPUT -p tcp --dport 443 -s 192.168.1.0/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j DROP
```

### 6.4 日志与监控

#### 6.4.1 日志配置

``` json
{
  "log": {
    "level": "warn",
    "timestamp": true
  }
}
```

#### 6.4.2 日志轮转（仅文件日志）

默认的 journal / 容器日志不使用下面的配置。仅当自行启用了文件日志，才创建 `/etc/logrotate.d/sing-box`；示例的 `root root` 只对应本文手动服务，使用软件包时应改为实际服务用户和组，并核实该服务支持 `reload`：

``` fsharp
/var/log/sing-box/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
    postrotate
        systemctl reload sing-box > /dev/null 2>&1 || true
    endscript
}
```

### 6.5 安全最佳实践

1. 保持sing-box版本更新
2. 定期检查日志，关注异常连接
3. 使用强密码，定期更换
4. 配置防火墙，限制访问来源
5. 使用有效TLS证书，开启自动续签
6. 定期备份配置文件
7. 监控服务器资源使用情况
8. 最小权限原则运行服务

## 七、常见问题排查

### 7.1 连接失败排查

现象：AnyTLS 无法建立连接。

排查步骤：

``` bash
# 1. 检查服务状态
sudo systemctl status sing-box

# 2. 检查端口是否监听
sudo ss -tlnp | grep 443

# 3. 检查防火墙
sudo ufw status
sudo iptables -L -n | grep 443

# 4. 测试端口连通性
nc -zv your-domain.com 443

# 5. 检查证书
sudo ls -la /etc/sing-box/*.pem

# 6. 查看日志
sudo journalctl -u sing-box -n 50

# 7. 验证配置
sing-box check -c /etc/sing-box/config.json
```

常见原因及解决方案：

| 原因 | 解决方案 |
|------|----------|
| 防火墙阻止 | 开放TCP端口 |
| 服务未启动 | 启动sing-box服务 |
| 证书无效 | 检查证书路径和有效期 |
| 密码错误 | 核对客户端与服务端对应用户的密码 |
| TLS配置错误 | 检查server_name和证书 |

### 7.2 连接建立但无法通信

现象：连接看起来正常，但就是上不了网。

排查步骤：

``` bash
# 1. 检查出站配置
# 确保outbounds正确配置direct或自定义路由

# 2. 检查路由配置
# 确保route.final指向正确的出站

# 3. 测试DNS解析
nslookup google.com

# 4. 检查系统代理设置
# 确保浏览器或应用使用正确的代理地址
```

解决方案：

下面是可解析的配置片段，合并到现有客户端配置时保留自己的入站设置：

``` json
{
  "route": {
    "final": "proxy"
  },
  "outbounds": [
    {
      "type": "anytls",
      "tag": "proxy",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    },
    {
      "type": "direct",
      "tag": "direct"
    }
  ]
}
```

### 7.3 性能问题排查

现象：能连上，但速度慢或延迟偏高。

排查步骤：

``` bash
# 1. 检查服务器负载
top
htop

# 2. 检查网络延迟
mtr your-domain.com

# 3. 检查带宽
iperf3 -c your-domain.com

# 4. 检查sing-box日志
sudo journalctl -u sing-box -f
```

优化方案：

| 问题 | 解决方案 |
|------|----------|
| 服务器负载高 | 升级服务器配置 |
| 网络质量差 | 更换服务器或线路 |
| 会话参数不当 | 调整idle_session参数 |
| 填充方案复杂 | 简化填充方案 |

### 7.4 证书问题

现象：TLS 证书验证失败。

排查步骤：

``` bash
# 1. 检查证书有效期
openssl x509 -in /etc/sing-box/fullchain.pem -noout -dates

# 2. 验证证书链
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt /etc/sing-box/fullchain.pem

# 3. 检查证书域名
openssl x509 -in /etc/sing-box/fullchain.pem -noout -text | grep -A1 "Subject Alternative Name"

# 4. 测试TLS连接
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

解决方案：

``` bash
# 重新获取证书
sudo certbot renew --force-renewal

# 或使用acme.sh
~/.acme.sh/acme.sh --renew -d your-domain.com --force
```

### 7.5 常见错误信息
| 错误信息 | 可能原因 | 解决方案 |
|----------------|----------------|----------------|
| certificate verify failed | 证书无效或过期 | 更新证书 |
| connection refused | 服务未启动或端口被占 | 检查服务状态 |
| authentication failed | 密码错误 | 核对客户端与服务端对应用户的密码 |
| timeout | 网络问题或防火墙 | 检查网络和防火墙 |
| TLS handshake failed | TLS配置错误 | 检查TLS配置 |
| 认证或用户匹配失败（日志因实现而异） | 密码未匹配服务端用户配置 | 检查 `users[].password`，无需在客户端填写 `name` |

## 八、总结

### 8.1 协议优势

1. TLS 兼容性好：基于标准 TLS 协议，适配范围广。
2. 填充策略灵活：可按场景调整隐蔽性和开销。
3. 上手门槛不高：配置结构清晰，部署路径明确。
4. 会话管理完整：空闲检测和超时控制都比较实用。
5. 与 sing-box 结合紧密：维护和排障路径更统一。

### 8.2 协议局限

1. 还在发展阶段：生态完整度不如老牌协议。
2. 客户端选择偏少：目前主要依赖 sing-box。
3. 官方资料偏精简：不少细节要靠实测摸索。
4. 线上样本相对有限：稳定性还需要更多长期验证。
5. 社区体量不大：可参考的案例和讨论还不算多。

### 8.3 适用场景建议

| 场景 | 推荐方案 | 说明 |
|------|--------|------|
| 流量隐蔽需求 | AnyTLS | 填充方案增强隐蔽 |
| 实验性部署 | AnyTLS | 适合技术尝鲜 |
| 生产环境 | VLESS/Hysteria2 | 成熟稳定 |
| 高性能需求 | Hysteria2 | UDP协议更优 |
| 广泛兼容 | Trojan/VLESS | 客户端支持广 |

### 8.4 推荐配置

最佳实践配置（服务端）：

``` json
{
  "log": {
    "level": "warn",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "anytls",
      "tag": "anytls-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "user1",
          "password": "strong_password_here"
        }
      ],
      "padding_scheme": [
        "stop=8",
        "0=30-30",
        "1=100-400",
        "2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000",
        "3=9-9,500-1000",
        "4=500-1000",
        "5=500-1000",
        "6=500-1000",
        "7=500-1000"
      ],
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com",
        "key_path": "/etc/sing-box/privkey.pem",
        "certificate_path": "/etc/sing-box/fullchain.pem"
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ]
}
```

最佳实践配置（客户端）：

``` json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "socks",
      "tag": "socks-in",
      "listen": "127.0.0.1",
      "listen_port": 1080
    },
    {
      "type": "http",
      "tag": "http-in",
      "listen": "127.0.0.1",
      "listen_port": 8080
    }
  ],
  "outbounds": [
    {
      "type": "anytls",
      "tag": "proxy",
      "server": "your-domain.com",
      "server_port": 443,
      "password": "your_password",
      "idle_session_check_interval": "30s",
      "idle_session_timeout": "30s",
      "min_idle_session": 5,
      "tls": {
        "enabled": true,
        "server_name": "your-domain.com"
      }
    }
  ],
  "route": {
    "final": "proxy"
  }
}
```

## 九、相关文章

如果你想继续完善自己的使用链路，可以按下面的顺序继续看：

### 9.1 客户端配置延伸

- [Android手机使用clash](../翻墙工具/Android手机使用clash.md)
- [windows下载安装clash](../翻墙工具/windows下载安装clash.md)
- [ClashVergeRev安装与使用指南](../翻墙工具/ClashVergeRev安装与使用指南.md)
- [Shadowrocket新手使用教程](../翻墙工具/Shadowrocket新手使用教程.md)

### 9.2 基础概念补充

- [什么是翻墙](./什么是翻墙.md)
- [如何判断一个机场使用的线路类型](./如何判断一个机场使用的线路类型.md)
- [路由器翻墙详细教程](./路由器翻墙详细教程.md)

### 9.3 选机场与避坑

- [机场推荐总览](/posts/vpn/)
- [如何选择机场](./如何选择机场.md)
- [机场跑路汇总](../跑路机场/机场跑路汇总.md)
