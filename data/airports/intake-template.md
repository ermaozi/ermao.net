# 机场标准录入模板

> 把商家、投稿人或你自测整理的信息贴到这里。AI 标准化时，不知道的字段填 `unknown`，不要补编。

使用方式：

```bash
pnpm airport:intake data/airports/intake-template.md
pnpm airport:check
```

## 原始录入

机场名称:
机场网址:
机场logo:
支持的付款方式:
佣金比例(循环):
机场运营时长:
机场简介/广告词:
是否支持通用订阅:
TG群或频道:
测速截图:
是否有一次性订阅(限量不限时):
最便宜的订阅价格与流量:
价格表:

## AI 标准化输出

```yaml
id:
name:
status: active
rank:
anchor:
officialHref:
logo:
paymentMethods: []
operationTime: unknown
slogan:
description:
universalSubscription: unknown
telegramHref:
speedTestImages: []
hasOneTimePackage: unknown
minPlanText:
minPlan:
  text:
  price:
  currency: CNY
  traffic:
  period:
  oneTime:
plans:
  - name:
    text:
    price:
    currency: CNY
    traffic:
    period:
    oneTime:
tags: []
claimedByProvider: true
private:
  commissionRateRecurring:
  publishDecision: testing
  sourceNote:
  notes: []
```

## 标准化规则

1. `佣金比例(循环)` 只能进入 `private.commissionRateRecurring`，不能进入文章、榜单、卡片文案。
2. 官网链接可以包含推广参数，但渲染组件会统一输出 `rel="sponsored nofollow noopener"`。
3. `是否支持通用订阅` 和 `是否有一次性订阅` 统一转成 `true`、`false` 或 `unknown`。
4. 价格尽量拆成 `price`、`traffic`、`period`；无法拆分时保留到 `text`。
5. 商家宣传但未经实测的信息保留 `claimedByProvider: true`，文章措辞避免写成实测结论。
6. 缺少 logo、测速截图、价格表时不要阻塞录入，后续补齐。
