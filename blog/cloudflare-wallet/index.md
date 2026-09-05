---
url: /blog/cloudflare-wallet/index.md
description: >-
  Cloudflare Wallet 是给 AI Agent 使用的可编程钱包与身份系统。本文说清它与 x402、稳定币和 AI
  自动支付的关系，并附当前可实操的名称预留步骤、功能边界及未来影响。
---
Cloudflare 最近发布了一个很有意思的东西：[Cloudflare Wallet](https://cloudflare.pay/)。

我第一次看到它时，想的不是“Cloudflare 也要做虚拟币钱包了”，而是：**AI 终于要有自己的钱包了。**

以前 AI 能帮你写代码、查资料、调用 API，但一遇到注册、绑卡、充值和创建 API Key，还是得把任务踢回给人。Cloudflare Wallet 想补上的，就是 AI 缺少的**身份和支付能力**。

我已经抢先预留了 `@ermaozi`：

![Cloudflare Wallet @ermaozi 名称预留成功页面，页面提示 Wallet 尚未正式开放 =1488x1158](https://image.ermao.net/images/blog/cloudflare-wallet/20260806_090941-e3483a.png)

::: warning 先说清楚当前状态
截至 **2026 年 8 月 6 日**，Cloudflare Wallet 尚未正式上线。现在可以做的是预留唯一名称，还不能充值、创建虚拟钱包或让 AI 真正付钱。

官方用词是 **Soon**，没有公布具体开放日期、费率和支持地区。现在的“申请教程”，准确说应该是**名称预留教程**。
:::

## Cloudflare Wallet 是什么？

简单来说，**Cloudflare Wallet 是一套面向 AI Agent 的可编程钱包和可选身份系统**。

它不是一张给人刷的银行卡，也不只是又一个用来炒币的 App。Cloudflare 设想的是：人先把钱和规则放进账户钱包，再把一小部分可用额度交给 AI，让 AI 自己购买 API、MCP 工具、数据或付费内容。

官方规划了两种钱包：

| 类型 | 谁来管 | 做什么 |
|---|---|---|
| **Account Wallet** | Cloudflare 账户所有者 | 充值、取回资金、给 AI 分配额度和设置规则 |
| **Virtual Wallet** | AI Agent 通过 API Key 使用 | 在额度、允许名单和单笔上限内自动付款 |

这个设计的重点不是“让 AI 随便花钱”，而是**把人的逐笔审批，变成人预先设定的财务边界**。

## x402 是什么？它和 Cloudflare Wallet 有什么关系？

![402 logo](https://x402.org/wp-content/uploads/sites/10/2026/06/x402_logo.svg)

Cloudflare Wallet 不是凭空做出来的，它会通过 [x402 协议](https://www.x402.org/) 向网站和 API 付款。

`402 Payment Required` 本来就是 HTTP 中的“需要付款”状态码。x402 做的事情，可以理解成把报价、付款和请求放进同一套机器可理解的 HTTP 流程中。

传统的 API 试用流程往往是：

> 找官网 → 注册账号 → 验证邮箱 → 绑定付款方式 → 充值 → 创建 API Key → 再调用 API

官方设想中的 x402 流程会更接近：

> AI 请求服务 → 服务返回价格 → Virtual Wallet 按规则付款 → AI 获取 API 结果或付费内容

对于几分钱一次的 API 调用，这比先注册一堆账号要合理得多。Cloudflare 的 [Monetization Gateway](https://blog.cloudflare.com/monetization-gateway/) 负责帮符合条件的卖家收钱，Wallet 则准备帮买家和 AI 付钱。

## Cloudflare Wallet 现在能怎么用？

现在只有两个切实可行的用法：

1. **先抢一个名称**：类似域名和用户名，好名称大概率会越来越少。
2. **建立一个公开身份占位**：预留成功后，例如 `ermaozi.cloudflare.pay` 会跳转到对应的公开 Wallet 页面。

它现在**不能**完成以下操作：

* 存入稳定币
* 从 Wallet 提现
* 创建 Virtual Wallet
* 给 AI Agent 生成付款 API Key
* 设置每周预算、允许名单或单笔上限
* 用 Cloudflare Wallet 在 x402 接口上真正付款

所以，现在不要往任何声称“Cloudflare Wallet 充值地址”的链上地址转钱。官方的名称预留流程不要求助记词、私钥或充值。

## Cloudflare Wallet 怎么申请？

### 申请前准备

你只需要：

* 一个可正常登录的 Cloudflare 账户
* 一个尚未被占用的 Wallet 名称
* 使用 `cloudflare.pay` 和 `dash.cloudflare.com` 官方域名完成操作

当前页面对名称的要求是：

* 长度 **3–32 个字符**
* 使用小写英文字母、数字和连字符 `-`
* 不要输入 `@`
* 每个 Cloudflare 账户只能预留一个名称

官方暂未公布改名流程，所以别为了测试随便抢一个不想长期使用的名称。Cloudflare 也在预留页面写明：它有权因任何原因拒绝某个名称。

### 步骤 1：打开 Cloudflare Wallet 官网

访问：<https://cloudflare.pay/>

进入页面后，你会看到 **Reserve your Cloudflare Wallet** 和一张橙色的 Wallet 卡片。

### 步骤 2：输入想要的名称

在输入框里填入名称，例如 `ermaozi`。页面会自动检查是否可用：

* 出现绿色对勾和 **available**：可以预留
* 提示 **already reserved** 或 **taken**：已被占用，换一个名称
* 提示长度或字符错误：按上面的名称规则修改

### 步骤 3：点击预留

名称可用时，点击 **Reserve @你的名称**。

正常情况下，浏览器会跳转到 `dash.cloudflare.com` 的 Cloudflare 授权页。登录你的 Cloudflare 账户，检查域名无误后，按页面提示继续即可。

### 步骤 4：确认预留成功

授权完成后，页面会显示 **It's yours.**，并提示：

> `@你的名称` has been reserved. We'll let you know when Cloudflare Wallets is ready.

这才代表名称已经预留成功。建议保存成功页面，然后等待 Cloudflare 通知正式开放。

如果页面显示 **Already reserved**，说明当前 Cloudflare 账户已经预留过一个名称，不能再抢第二个。

## 正式开放后，Cloudflare Wallet 可能怎么用？

![Cloudflare Wallet 官方图 =1080x607](https://image.ermao.net/images/blog/cloudflare-wallet/20260806_095855-acc638.png)

下面是 [Cloudflare 官方公告](https://blog.cloudflare.com/wallets/) 描述的目标流程，**不是已经可以照做的产品界面教程**：

1. 用户向 Account Wallet 存入资金，官方计划支持稳定币，并在受支持地区提供资金进出渠道。
2. 为某个 AI Agent 创建 Virtual Wallet。
3. 设置总额度、单笔上限、允许商家或 API 名单等规则。
4. AI 使用 Virtual Wallet 的 API Key，购买 x402 兼容的 API、MCP 工具、数据或内容。
5. 花费超出限制时，AI 不会继续花钱，而是向有权限的人请求一次性放行或提高上限。

如果你现在就在做 AI Agent，可以先了解 Cloudflare 已公开的 [x402 开发文档](https://developers.cloudflare.com/agents/tools/payments/x402/)。但在 Wallet 真正开放前，不必提前写死充值、费率或地区判断逻辑。

## Cloudflare Wallet 以后会带来什么影响？

### 1. AI 可以自己挑 API，而不是只用人预先选好的服务

一个 AI 可以花几分钱分别测试几十个翻译、搜索或推理 API，再根据价格和效果选最合适的一个。

这会让 API 的竞争从“谁的市场做得好”，逐渐变成“谁的价格和结果更适合当前任务”。

### 2. 网站可能不再只靠订阅和广告收钱

以后的付费单位可以是一次 API 调用、一条数据、一篇文章，甚至只是一次高成本计算。用户不需要为了用一次就订阅一个月，卖家也可以用微支付直接回收成本。

### 3. AI 会开始拥有长期可识别的身份

例如 `research.example.cloudflare.pay` 可以表示某个组织的研究 Agent。商家可以知道这个 AI 来自哪个账户，再决定是否给它试用额度、优先服务或限制。

官方表示身份申明会是可选的。它更像是给机器密钥配一个人能记住的名称，而不是说所有 AI 都必须公开真实主人。

### 4. 公司可以给 AI 预算，不必每笔都找人签字

例如给每位员工的 AI 每周 100 美元推理额度，或给研究 Agent 10 美元用来比较数据源。只要花费没超过规则，AI 就能继续工作；出现异常消耗时，再由人介入。

这比“把主钱包私钥直接丢给 AI”靠谱得多，但它也不会让风险消失。提示词注入、恶意 API、错误报价、凭据泄露和稳定币合规，都会变成新的问题。

## AI 都能帮你花钱了，替你开公司的日子还远吗？

我觉得，**从“干活”的角度看已经不远，从“法律主体”的角度看还很远。**

一个 AI 如果能够自己选购 API、付服务费、调数据、生成产品、做客服和买广告，它确实已经很像一家“一人公司”的运营系统。Cloudflare Wallet 补上了其中很重要的一块：可控的花钱能力。

但真正开公司还包括注册地、受益所有人、实名和 KYC、签字授权、纳税、雇佣、退款以及出事后谁负责。一个钱包解决不了这些问题。

所以更准确的说法是：

> AI 不会因为 Cloudflare Wallet 立刻变成公司老板，但它会从“只能建议买什么”，向“在你划定的预算内直接去买”迈出一大步。

我相信以后会出现越来越多由一个人提供目标、多个 AI Agent 负责运营的小公司。那时候人最重要的工作，不是亲自点每一个按钮，而是定目标、画边界，然后在 AI 做错时承担责任。

## Cloudflare Wallet 常见问题

### Cloudflare Wallet 现在可以充值吗？

不可以。截至 2026 年 8 月 6 日，官方只开放了名称预留，还没有开放 Wallet 充值界面。

### Cloudflare Wallet 申请收费吗？

当前的名称预留页面没有收费步骤。正式 Wallet 的费率、链上成本和资金进出费用尚未公布。

### 中国用户以后能使用吗？

官方只说会在“受支持的地区”提供资金进出渠道，没有公布完整国家和地区名单。能够预留名称，不等于以后一定能完成充值、KYC 或提现。

### Cloudflare Wallet 是自托管钱包吗？

官方公告没有说明最终的私钥托管模式。它确实计划存储稳定币、支付和收款，但在官方文档更新前，不要自行假设它会提供助记词或完全自托管。

### AI 会不会把钱一次花完？

官方计划通过可用额度、商家允许名单和单笔交易上限来限制 Virtual Wallet。这能降低损失上限，但不能代替 API Key 保护、异常监控和人工复核。

## 官方资料

* [Cloudflare Wallet 官方发布文章](https://blog.cloudflare.com/wallets/)
* [Cloudflare Wallet 名称预留页](https://cloudflare.pay/)
* [Cloudflare Agents 的 x402 支付文档](https://developers.cloudflare.com/agents/tools/payments/x402/)
* [x402 协议官网](https://www.x402.org/)

名称我已经抢了，接下来就等 Cloudflare 把真正的 Wallet 放出来。到时候，我会再用实际账户把充值、Virtual Wallet、预算限制和 x402 支付全部跑一遍，而不是照着产品宣传页猜它怎么用。
