---
title: 搜索引擎查找 Ollama 本地部署的 DeepSeek，实现免费 AI 运行
createTime: '2025/02/12 7:25:01'
permalink: /article/tj38tso3/
tags:
  - Ollama
  - DeepSeek
  - Fofa
  - Shodan
  - Chatbox
  - AI
  - 搜索引擎
  - 免费
description: >-
  大多数教程都集中在如何本地部署 DeepSeek 模型，但本教程将引导您探索另一种方法：通过搜索引擎（如 Fofa 和 Shodan）查找公开的
  Ollama 模型 API 服务。 Ollama 是一个强大的支持本地部署的大型语言模型，允许用户通过 API 进行交互。借助 Fofa 和 Shodan
  等搜索引擎，...
---

大多数教程都集中在如何本地部署 DeepSeek 模型，但本教程将引导您探索另一种方法：通过搜索引擎（如 Fofa 和 Shodan）查找公开的 Ollama 模型 API 服务。

Ollama 是一个强大的支持本地部署的大型语言模型，允许用户通过 API 进行交互。借助 Fofa 和 Shodan 等搜索引擎，您可以定位那些暴露在互联网上的 Ollama 服务，并将其集成到自己的项目中，以便更加便捷地实现 AI 交互。

<!-- more -->

## 一、通过 Fofa 搜索 Ollama API

Fofa 是一个强大的互联网设备和服务搜索引擎，可以帮助用户发现公开的 API 服务。通过在 Fofa 中输入特定的关键词，您可以精准地找到暴露在互联网上的 Ollama API 服务。

### 1.1 Fofa 搜索步骤

1. 打开 Fofa 官网，在搜索框中输入以下查询语句：

   ```
   app="Ollama" && is_domain=false
   ```

   - **app="Ollama"**：用于筛选与 Ollama 相关的在线服务。
   - **is_domain=false**：排除域名服务，仅显示直接暴露的 API 端点，减少干扰信息。

2. 点击搜索后，您将看到所有公开的 Ollama API 服务列表，并可以根据需要进行进一步筛选和分析。

### 1.2 结果分析

如果搜索结果显示相关的 IP 地址和端口号，您可以尝试访问这些服务，以检查是否开放了 Ollama API。

请注意，访问时务必遵守相关法律法规，确保您连接到合法且授权的 API，避免未经许可的操作，防止违反法律。

![Ollama 本地部署的 DeepSeek](https://image.ermao.net/images/article/tj38tso3/image.png)

## 二、Shodan 搜索 Ollama API

Shodan 是另一个强大的搜索引擎，专门用于查找互联网上的各种设备和服务。通过 Shodan，您可以发现运行中的 Ollama 服务实例。

### 2.1 Shodan 搜索步骤

1. 打开 [Shodan 官网](https://shodan.io)，在搜索框中输入以下查询语句：

   ```
   Ollama is running
   ```

   这个查询用于查找运行中的 Ollama 服务。

2. 搜索结果将返回包含 Ollama API 实例的 IP 地址和端口号。

### 2.2 结果分析

Shodan 会提供关于公开服务的详细信息，如 IP 地址、端口号和可能的 API 路径等。同样，确保这些服务是合法的，并且您有权访问。

![Ollama 本地部署的 DeepSeek](https://image.ermao.net/images/article/tj38tso3/image-1.png)

## 三、如何访问找到的 Ollama API

### 3.1 使用 Chatbox 连接到远程 Ollama 服务

1. 下载并安装 [Chatbox AI](https://chatboxai.app/)。
2. 打开 Chatbox 设置，在模型提供方中选择 "Ollama"。
![Ollama 本地部署的 DeepSeek](https://image.ermao.net/images/article/tj38tso3/image-2.png)
3. 在模型下拉框中选择您运行的本地模型。
![Ollama 本地部署的 DeepSeek](https://image.ermao.net/images/article/tj38tso3/image-3.png)
4. 点击保存后，您便可以通过 Chatbox 与远程 Ollama 服务进行交互。
![Ollama 本地部署的 DeepSeek](https://image.ermao.net/images/article/tj38tso3/image-4.png)

## 四、安全性和合规性

在访问和使用这些 API 时，请务必考虑以下几点：

1. **合法性**：确保您访问的 API 是公开且经过授权的，避免任何未经许可的访问行为。
2. **安全性**：如果您计划公开暴露自己的 Ollama API，确保使用 HTTPS 加密，并采取身份验证措施，防止恶意访问。
3. **防火墙配置**：确保防火墙配置正确，允许合法请求访问您的 API，同时阻止不必要的外部访问。

遵循这些安全措施，您可以在使用 Ollama API 时确保合法性与安全性。

## 五、总结

通过 Fofa 和 Shodan 等搜索引擎，您可以轻松找到暴露在互联网上的 Ollama 本地模型 API 服务。利用这些 API，您能够将 Ollama 模型集成到自己的项目中，进行各种自然语言处理任务。

但在使用这些服务时，请务必遵守相关法律法规并采取适当的安全措施，确保操作合法并且安全。

希望本教程能帮助您顺利上手，并有效地利用 Ollama 本地模型 API！

## 六、相关链接

[通过Ollama本地部署DeepSeek代码大模型：从硬件配置到VSCode实战指南](/article/c3gj5lqy/)

[便宜好用的翻墙机场推荐评测(长期更新 欢迎推荐)](/posts/vpn/)

[使用cloudflare进行URL重定向](/article/jqtuqouj/)
