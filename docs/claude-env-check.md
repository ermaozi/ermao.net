---
title: Claude 环境自检
description: 在浏览器本地检测系统时区、语言、区域格式、中文字体和设备线索，并结合出口 IP 的位置、ASN 与可选风险数据评估 Claude 使用环境。
permalink: /claude-env-check/
pageClass: claude-env-check-page
sidebar: false
aside: false
comments: false
---

# Claude 环境自检

在购买或订阅 Claude 前，检查当前浏览器、系统区域与网络出口是否存在明显冲突。浏览器指纹在本机计算；出口 IP 检测需要请求本站的 Cloudflare Worker。

<ClaudeEnvCheck />

::: info 结果应该怎么理解
本页分数是基于浏览器可见信号建立的启发式评估，不是 Anthropic 或 Claude 的官方风控结论。单项命中不等于账号一定受限，稳定一致的账号资料、设备环境和网络出口通常比追求某个固定分数更重要。
:::

如果网络检测显示代理、机房或高风险出口，可继续阅读[机场评测与 VPN 选择指南](/posts/vpn/)，结合线路、风险记录和使用场景判断是否需要更换网络。

<style>
.claude-env-check-page .vp-doc,
.claude-env-check-page .vp-doc-container .content,
.claude-env-check-page .vp-doc-container .content-container {
  max-width: 1120px !important;
}

.claude-env-check-page .vp-doc > h1,
.claude-env-check-page .vp-doc > h1 + p {
  max-width: 860px;
}

@media (max-width: 719px) {
  .claude-env-check-page .vp-doc {
    padding-inline: 16px;
  }
}
</style>
