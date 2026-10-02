---
url: /blog/vscode-deepseek-v4/index.md
description: >-
  手把手教你把 DeepSeek V4 接进 VS Code：接入有什么好处、十分钟可行的配置步骤、token
  预算怎么算（含本文自己的成本）、日常使用场景，以及适合什么人用。
---
把 DeepSeek V4 接进 VS Code，是我最近做过的性价比最高的一次配置。

我第一次填好 API Key、看着编辑器里弹出第一行补全时，脑子里只有一个念头：**以后真没必要再交上百块一个月的 AI 订阅费了。** 这篇文章不绕弯子，直接说清楚四件事——接它图啥、怎么接、花多少钱、什么人适合。

::: warning 非常糟糕
本篇文章写完不久，deepseek 宣布涨价且幅度较大！评级从梁圣下调为梁子，是否继续下调得看具体涨价幅度和Pro正式版的成色。

![deepseek涨价 =1024x342](https://image.ermao.net/images/blog/vscode-deepseek-v4/20260806_164022-1d8f14.png)

本文中的单价计算已失去参考价值，请以 [DeepSeek 官方定价页面](https://api-docs.deepseek.com/quick_start/pricing) 为准。
:::

## 接入 DeepSeek V4 有什么好处

先别急着看步骤，把「值不值得折腾」说清楚。

* **上下文就是整个项目**：插件能直接读你打开的文件、选中的代码，甚至整个工作区。它回答你的时候，是看着你的真实代码说的，而不是你复制粘贴的一小段。这个体验差距，用过就回不去了。
* **不用来回切窗口**：补全、提问、改代码都在编辑器内完成，心流不断。以前我写代码卡住，要切到浏览器把报错贴给 AI，再切回来抄代码，来回一趟耐心基本清零。
* **便宜，而且是真便宜**：DeepSeek 按量计费，没有包月门槛，用得少花得少，重度用一个月也就几块到几十块。对比动辄上百一个月的订阅制助手，这是明显的性价比优势。
* **数据流向清楚**：对话走你自己的 API Key 直连 DeepSeek 官方接口，不经过第三方网页，数据归属心里有数。
* **国内直连不用折腾**：`api.deepseek.com` 在国内可直接访问，不用额外配置代理。

## 接入前的准备

动手前确认三样东西：

1. 装了 **VS Code**（Windows / macOS / Linux 均可）。
2. 一个 **DeepSeek 开放平台账号**：到 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并完成实名认证，几分钟搞定。
3. 一个 **API Key**：登录平台 → 控制台 → 「API Keys」→ 创建，得到一串 `sk-` 开头的密钥。**这串密钥只会完整显示一次，务必当场保存。**

::: warning 密钥是钱，别乱发
API Key 就是钱包的钥匙，用多少扣多少。**不要**提交进 Git 仓库，也不要随手贴在群里。一旦怀疑泄露，立刻去控制台删除并重新生成。
:::

## 怎么接入：三个方案怎么选

接入方式不只一种，我按「要不要装新插件」和「要不要 AI 自己动手」帮你理一下，三个方案对应三类人：

| 你的情况 | 推荐方案 | 装插件？ |
|---|---|---|
| 没装过任何 AI 插件 | 方案一 Continue | 装一个（免费） |
| 已经用着 GitHub Copilot | 方案二 DeepSeek for Copilot | 不装，直接加模型 |
| 想要 AI 自己读写文件、跑命令 | 方案三 Cline | 装一个（免费） |

### 方案一：Continue 扩展（推荐给没装过插件的人）

![Continue 配置文件中添加 DeepSeek V4 与 DeepSeek V4 Flash 模型 =2346x1468](https://image.ermao.net/images/blog/vscode-deepseek-v4/20260806_124832-641b7e.png)

[Continue](https://continue.dev/) 是目前最流行的开源 AI 编程助手之一，补全、聊天、编辑都支持，配置灵活且免费，适合第一次接触 AI 编程助手的人。

1. 打开 VS Code，左侧扩展市场搜 **Continue**，安装，装完右下角会弹出欢迎页。
2. 按 `Ctrl+Shift+P`（macOS 是 `Cmd+Shift+P`）打开命令面板，输入 `Continue: Open Config` 回车，打开 Continue 的配置文件 `~/.continue/config.json`。
3. 在配置里加一个 DeepSeek 的模型（DeepSeek 用的是 OpenAI 兼容接口，所以 provider 填 openai）：

```json
{
  "models": [
    {
      "title": "DeepSeek V4",
      "provider": "openai",
      "model": "deepseek-v4",
      "apiBase": "https://api.deepseek.com/v1",
      "apiKey": "sk-这里填你的密钥"
    },
    {
      "title": "DeepSeek V4 Flash",
      "provider": "openai",
      "model": "deepseek-v4-flash",
      "apiBase": "https://api.deepseek.com/v1",
      "apiKey": "sk-这里填你的密钥"
    }
  ]
}
```

4. 保存文件，重启 Continue。之后在侧边栏模型下拉框里选中 **DeepSeek V4** 或 **DeepSeek V4 Flash**，就能开始对话和补全了。

::: tip 两个模型怎么选
日常写代码、图快，用 **Flash**；遇到复杂任务、长代码、架构设计，切旗舰 **V4**。两个都配上随时切换，这是最稳的用法。
:::

### 方案二：DeepSeek for Copilot（推荐给已经在用 Copilot 的人）

![GitHub Copilot 模型与提供商设置，通过 OpenAI Compatible 添加 DeepSeek =2266x1501](https://image.ermao.net/images/blog/vscode-deepseek-v4/20260806_125848-eef8a2.png)

DeepSeek 官方提供了一条在 GitHub Copilot 里直接用 DeepSeek 模型的接入方式（DeepSeek for Copilot），底层走的是 Copilot 的 BYOK（Bring Your Own Key，自带密钥）机制。如果你已经装了 VS Code 官方的 **GitHub Copilot** 扩展，不用装第三方插件，加个模型就能用：

1. 确认装了 **GitHub Copilot** 和 **GitHub Copilot Chat** 两个扩展（都免费安装，Chat 需要登录 GitHub 账号）。
2. 打开设置：`Ctrl+Shift+P` → 输入 `Preferences: Open Settings (UI)`，搜索 `copilot chat`。
3. 找到 **Models & Providers** 一栏（或 `chat models`），点「Manage」进入模型管理页。
4. 添加一个新的模型提供商，类型选 **OpenAI Compatible**，然后填三样东西：
   * **Base URL**：`https://api.deepseek.com/v1`
   * **API Key**：你的 DeepSeek 密钥
   * **模型名**：`deepseek-v4` 或 `deepseek-v4-flash`
5. 保存后，在 Copilot Chat 的模型下拉框里就能看到并选到 DeepSeek V4，补全和聊天都能用。

::: tip 为什么推荐这条路
如果你公司/学校已经统一买了 Copilot，或者早就用惯了 Copilot 的交互，这条路改动最小：**不用换插件，只换模型**。Copilot 的代码补全本身免费（需登录），你只需要为 Chat 部分调用的 DeepSeek 付 API 费。
:::

### 方案三：Cline 扩展（推荐给想要 AI 自己动手的人）

![Cline 设置中的 DeepSeek 提供商，Base URL 为 api.deepseek.com/v1 =2277x1474](https://image.ermao.net/images/blog/vscode-deepseek-v4/20260806_125939-3b346e.png)

如果你希望 AI 不只是聊天，而是能自己读写文件、执行命令、跑测试，那就用 **Cline**：

1. 扩展市场搜 **Cline** 安装。
2. 打开 Cline 设置，Provider 一栏选 **DeepSeek**；如果列表里没有，就选 **OpenAI Compatible**。
3. Base URL 填 `https://api.deepseek.com/v1`，模型名填 `deepseek-v4` 或 `deepseek-v4-flash`，API Key 填你的密钥。
4. 授权 Cline 访问工作区，然后就可以让它「帮我写个测试」「帮我重构这个函数」——它会自己动手。

::: warning 权限大，风险也大
Cline 这类 Agent 有读写文件、执行命令的能力，好用但危险。建议先在测试目录或临时分支里练手，确认行为符合预期再放开权限。
:::

## Token 预算：花多少钱，心里要有数

Token 可以理解成模型计数的"字数"，一段中文大约一个字算一个左右。**用量（Token 数）决定账单**，所以这个必须看懂。

### 计费逻辑

DeepSeek 按 **输入 Token** 和 **输出 Token** 分开计费，规则是：

* 输入（你问的、喂给它的上下文）便宜，输出（它生成的结果）贵一些；
* 命中缓存的输入（比如反复用到的项目上下文）更便宜；
* 具体单价以 DeepSeek 官方实时定价为准，V4 系列整体在同类模型里属于很有竞争力的档位。

下面用一个示例单价演示怎么算（实际以官方页面为准）：

| 项目 | 输入价（每百万 Token） | 输出价（每百万 Token） |
| --- | --- | --- |
| DeepSeek V4 | ¥4 | ¥16 |
| DeepSeek V4 Flash | ¥1 | ¥4 |

一次普通的代码补全：输入约 800 Token + 输出约 120 Token，成本大约是：

$$800 \div 1{,}000{,}000 \times 4 + 120 \div 1{,}000{,}000 \times 16 \approx 0.005\ \text{元}$$

一次带完整上下文的对话：输入约 2 万 Token + 输出约 2000 Token，大约是：

$$20{,}000 \div 1{,}000{,}000 \times 4 + 2{,}000 \div 1{,}000{,}000 \times 16 \approx 0.11\ \text{元}$$

也就是说，**就算一天用个几十上百次，一个月也就几块到几十块钱**，比包月订阅划算太多。

### 这篇文章自己花了多少钱？

既然题目是预算，我把这篇的成本也摊开算一下，给你一个真实的参考。成品文件：正文约 **2400 个汉字**，加上 Markdown 语法、表格和代码块，全文大概 **5800 个字符**。中文对模型来说大约一个字折合 1~1.5 个 Token，再算上英文、代码和格式符号，模型单次生成输出约 **4600 Token**；生成过程中我还读了项目里已有的文章格式和几篇参考文章（这部分算输入，约 **2800 Token**）。

按上面的示例单价估算，**单次成稿**的裸成本大约是：

$$4600 \div 1{,}000{,}000 \times 16 + 2800 \div 1{,}000{,}000 \times 4 \approx 0.085\ \text{元}$$

但 0.085 元只是"一次生成"的钱。实际写一篇能发的稿子，前面还有**构思、改稿、补内容、核对数据**这些来回，这些操作同样在消耗 Token。这篇**从起草到定稿（含所有调整），真实账单大约 3 毛 2**——这才是日常用 AI 写作的真实成本，也更有参考价值。

![本文的 DeepSeek Token 用量与计费截图，成本约 0.32 元 =1811x1470](https://image.ermao.net/images/blog/vscode-deepseek-v4/20260806_130454-5f2eff.png)

3 毛 2 是什么概念？一篇两千多字、带表格和代码块的完整教程，成本不到一根雪糕钱，而且不满意随时能改。这就是 API 按量计费相比订阅制的真实差距——你自己写代码用起来，成本大概率比这还低，因为补全和短问答占大头。

### 控制成本的五个建议

* **小事用 Flash**：简单补全、问答、写注释用轻量模型，旗舰版留给复杂任务。
* **别把整个项目喂进去**：只给相关文件或选中区域，上下文越小越省钱。
* **开缓存**：插件配置里启用上下文缓存，重复内容打折计费。
* **限制输出长度**：配置 `maxTokens`，防止生成过长的无关内容。
* **设用量提醒**：DeepSeek 控制台可以设余额提醒，防止月底才发现超支。

::: tip 关于示例单价
上面表格里的单价是我用来演示计算的示例值，**不是** DeepSeek 官方实时价格。实际费率请以 [DeepSeek 官方定价页面](https://api-docs.deepseek.com/quick_start/pricing) 为准，模型名也以 [官方模型列表](https://api-docs.deepseek.com/) 为准。
:::

## 适合什么使用场景

接入之后，这些场景的提效最明显：

* **代码补全**：写到一半的函数、重复的样板代码，按 `Tab` 直接补完。
* **解释陌生代码**：丢一段没有注释的遗留代码，让它逐行讲清楚。
* **写单元测试**：基于现有函数生成测试用例，再由你人工把关边界情况。
* **重构与迁移**：老代码换新写法、换库，让它先出方案再动手。
* **排查报错**：把终端里的报错贴进去，快速定位原因和修复思路。
* **写提交信息**：让它根据改动总结 commit message，格式规范且省事。
* **补注释和文档**：给函数加 JSDoc、给模块写 README，都是它的强项。

## 适合什么人群

* **日常写代码的全栈 / 前端 / 后端开发者**：主力用户，补全和问答的提效最明显。
* **学生和自学者**：预算有限，需要一个随问随答的"导师"，按量付费很友好。
* **独立开发者 / 自由职业者**：没有团队统一配 AI 工具，自己接一个省钱省心。
* **中小企业团队**：想在代码评审、补测试上借力，又不想被订阅制绑死。
* **对数据隐私敏感的人**：不想把代码贴到公共网页，用自己的 Key 走官方接口更踏实。

## 需要说明的边界

* DeepSeek V4 是**云端模型**，必须联网调用，无法离线使用；需要完全离线、数据不出本地的场景，可参考站内的[本地部署 DeepSeek 指南](/article/c3gj5lqy/)。
* 三个方案里，Continue 与 Cline 需要你自行维护 API Key 和配置；DeepSeek for Copilot 则依赖 GitHub Copilot 的 BYOK 功能，该能力的具体支持范围以 GitHub 官方为准。

## 常见问题

**接入免费吗？**

接入本身免费（插件、配置都不收费），调用模型按 Token 计费，轻量使用每月几块钱。

**需要科学上网吗？**

不需要，`api.deepseek.com` 国内直连。

**和 GitHub Copilot 比呢？**

看你怎么用：如果走 Copilot 官方订阅（GPT 等闭源模型），价格确实不便宜；但本文方案二讲了 **DeepSeek for Copilot**——你仍然用 Copilot 的界面，只是把模型换成按量付费的 DeepSeek V4，两全其美。既想要 Copilot 交互、又不想被订阅费绑死的，走这条最合适。

**代码会被别人看到吗？**

代码通过你自己的 API Key 发给 DeepSeek 官方接口，数据流向明确。涉及商业机密的生产代码，请先确认公司的数据合规要求，必要时参考 DeepSeek 的[隐私与安全说明](https://api-docs.deepseek.com/)。

## 相关阅读

* [通过 Ollama 本地部署 DeepSeek](/article/c3gj5lqy/)：如果你在意数据完全不出本地，可以走本地部署路线，和本文的 API 接入互补。
* [免费 DeepSeek 运行指南](/article/tj38tso3/)：想一分钱不花先体验 DeepSeek，可以先看这篇。

## 结语

一句话总结：**已经装了 Copilot 的，直接用 DeepSeek for Copilot 把模型换成 DeepSeek（方案二）；没装过任何插件，装个 Continue 配上 Flash 跑通流程（方案一）；想要 AI 自己动手干活，上 Cline（方案三）。**

配置不到十分钟，从起草到定稿也就三毛二，试错成本几乎为零。DeepSeek 的 API 模式让"AI 写代码"这件事真正进入了按量付费的理性时代——花多少、干什么、值不值，每一分都算得清楚。

相关工具与信息源：Continue 官方[配置文档](https://docs.continue.dev/)、GitHub Copilot 官方[模型与 BYOK 说明](https://docs.github.com/copilot)、DeepSeek [开放平台](https://platform.deepseek.com/)与[定价](https://api-docs.deepseek.com/quick_start/pricing)。
