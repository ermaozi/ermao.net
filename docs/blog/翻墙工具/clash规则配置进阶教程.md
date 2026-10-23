---
title: Clash 规则配置进阶教程：订阅前置规则、规则集与扩展脚本
createTime: 2026/02/28 14:11:48
permalink: /blog/clash-rules-config/
tags:
  - Clash
  - 科学上网
  - 翻墙教程
  - 规则配置
  - Clash Verge Rev
description: 按 Clash Verge Rev 当前扩展机制配置 Loyalsoldier 规则集，通过订阅前置规则或保留原配置的脚本分流，检查代理组、最终配置与命中日志。
---

Clash 的分流取决于订阅规则、规则顺序与运行模式。本文使用 Loyalsoldier 规则集，说明如何在保留现有订阅规则的基础上添加直连、代理和拦截策略，并验证结果。

<!-- more -->

规则不会改变节点 IP 的信誉，也不保证解锁流媒体或避免账号风控。已有订阅通常包含规则，先检查是否需要调整，再做增量修改。

> 还没安装 Clash？先看前置教程：
> - Windows / Mac / Linux 用户 → [Clash Verge Rev 安装与配置教程](/article/0gematwc/)
> - Android 用户 → [Clash for Android 下载安装教程](/article/eh8f4n86/)
> - 还没买机场？→ [2026 年便宜好用的翻墙机场推荐](/posts/vpn/)

## 什么是 Clash 规则？为什么一定要配？

订阅通常已经包含基础规则，但未必适合你的网络或应用。路由不合适时，可能出现国内流量绕远、服务出口与预期不一致，或请求被拦截。

**规则，就是解决这个问题的"交通指挥员"。** 它告诉 Clash：

| 流量类型 | 处理方式 | 效果 |
|---------|---------|------|
| 🟢 国内网站及 IP | **直连**（DIRECT） | 使用本地网络出口 |
| 🔴 被墙的海外网站 | **代理**（PROXY） | 走节点翻墙访问 |
| 🛑 广告和追踪器 | **拦截**（REJECT） | 拒绝命中列表的域名请求 |

规则控制请求的去向，不能让机房 IP 变成住宅 IP。

## Clash 规则的工作原理（大白话版）

其实就是**查字典**。

当你访问一个网址时，Clash 会从规则列表里**从上往下逐条匹配**：

1. 查到 `youtube.com` → 规则写着 `PROXY` → 走代理节点
2. 查到 `taobao.com` → 规则写着 `DIRECT` → 走家里宽带
3. 查不到匹配项 → 按最底下的**兜底策略**处理（以订阅实际兜底规则为准）

**规则越全面 = 字典越厚 = Clash 越聪明。** 成熟的开源规则库早已把苹果、谷歌、Telegram 等各大服务，甚至国内精确到 IP 段的流量都覆盖了。

## 推荐规则库：Loyalsoldier/clash-rules

![Loyalsoldier clash-rules GitHub 截图 =900x784](https://image.ermao.net/images/blog/clash-rules-config/20260228_141256-b26939.png)

在 [上一期小火箭规则教程](/blog/shadowrocket-rules-config/) 中推荐了 Johnshall 规则集，而 **Clash 领域的"武林盟主"则非 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 莫属**，目前接近 30k Star。

它有 3 个核心优势：

### 1. 规则精准度极高

整合了 V2Ray 社区最权威的域名和 IP 名单，国内 IP 段精准无比，Apple、Google、Telegram 等服务都做了独立细分规则。

### 2. 每日自动更新

项目通过 [GitHub Actions](https://github.com/Loyalsoldier/clash-rules/blob/master/.github/workflows/run.yml)定期拉取上游数据并构建规则集；上游构建成功不等于本地客户端已更新。客户端仍需按配置的间隔成功下载并加载规则集，使用时应检查下载状态、更新时间和实际命中。

### 3. 按内核确认兼容性

规则集格式与客户端入口是两回事。使用支持相应 `RULE-SET` 行为的内核，并按客户端版本确认添加方式；不要将本教程的 Verge 扩展操作直接套到其他客户端。

> GitHub 原地址：[https://github.com/Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)

## 3 步配置 Clash 分流规则（Clash Verge Rev）

本文按 Clash Verge Rev v2.5.8 的扩展行为核对。其他客户端需单独确认语法与入口。

::: warning 先备份，再添加
先导出或备份现有订阅扩展配置、扩展脚本和自定义规则，记录当前代理组名称。不要清空现有扩展，也不要直接改会随订阅刷新被替换的原始文件。以下只对选定订阅操作。
:::

[官方扩展说明](https://www.clashverge.dev/guide/extend.html)指出，v1.7.x 已将 prepend/append 移至订阅的可视化编辑器。[v2.5.8 Merge 源码](https://github.com/clash-verge-rev/clash-verge-rev/blob/v2.5.8/src-tauri/src/enhance/merge.rs)不把 `prepend-rule-providers`、`prepend-rules` 当作注入指令；在扩展 YAML 写 `rules` 会替换整张规则表，不能用它追加几条规则。

### 第 1 步：为当前订阅添加规则集

在“订阅”中右键当前使用的配置，进入其扩展配置编辑器。将下面的 `rule-providers` 合并到现有配置；已有这个键时，只添加它下面的条目，不要重复顶层键。先确认 `local-ls-` 名称和缓存路径未被占用；如有冲突，换前缀并同步修改后面的引用。

![历史版本的扩展配置入口参考 =900x697](https://image.ermao.net/images/blog/clash-rules-config/20260228_141318-51a08a.png)

> 旧截图展示的是全局入口，仅作历史界面参考；本方案使用当前订阅的扩展配置。

```yaml
rule-providers:
  local-ls-reject:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
    path: ./ruleset/local-ls-reject.yaml
    interval: 86400

  local-ls-icloud:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"
    path: ./ruleset/local-ls-icloud.yaml
    interval: 86400

  local-ls-apple:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"
    path: ./ruleset/local-ls-apple.yaml
    interval: 86400

  local-ls-google:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"
    path: ./ruleset/local-ls-google.yaml
    interval: 86400

  local-ls-proxy:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"
    path: ./ruleset/local-ls-proxy.yaml
    interval: 86400

  local-ls-direct:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"
    path: ./ruleset/local-ls-direct.yaml
    interval: 86400

  local-ls-private:
    type: http
    behavior: domain
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"
    path: ./ruleset/local-ls-private.yaml
    interval: 86400

  local-ls-telegramcidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt"
    path: ./ruleset/local-ls-telegramcidr.yaml
    interval: 86400

  local-ls-cncidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"
    path: ./ruleset/local-ls-cncidr.yaml
    interval: 86400

  local-ls-lancidr:
    type: http
    behavior: ipcidr
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"
    path: ./ruleset/local-ls-lancidr.yaml
    interval: 86400

  local-ls-applications:
    type: http
    behavior: classical
    url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt"
    path: ./ruleset/local-ls-applications.yaml
    interval: 86400

```

### 第 2 步：在“编辑规则”中前置引用

按[官方自定义规则说明](https://www.clashverge.dev/guide/rules.html)，右键同一个订阅，选择“编辑规则”，在前置区域按下列顺序添加。若界面要求分字段填写，分别填写类型、规则集名与策略；下面是最终规则字符串示意，不是要粘贴到扩展 YAML 的 `rules` 表。

把所有 `YOUR_EXISTING_GROUP` 换成该订阅中真实存在的代理组名称，字符须完全一致；`PROXY` 不是每个订阅都自带的组名。`DIRECT`、`REJECT` 是内置策略。前置规则可能改变订阅原有分流，请先审查顺序，保留原规则及末尾 `MATCH`。

```text
RULE-SET,local-ls-applications,DIRECT
RULE-SET,local-ls-private,DIRECT
RULE-SET,local-ls-reject,REJECT
RULE-SET,local-ls-icloud,DIRECT
RULE-SET,local-ls-apple,DIRECT
RULE-SET,local-ls-google,YOUR_EXISTING_GROUP
RULE-SET,local-ls-proxy,YOUR_EXISTING_GROUP
RULE-SET,local-ls-direct,DIRECT
RULE-SET,local-ls-lancidr,DIRECT
RULE-SET,local-ls-cncidr,DIRECT
RULE-SET,local-ls-telegramcidr,YOUR_EXISTING_GROUP
GEOIP,LAN,DIRECT
GEOIP,CN,DIRECT
```

下表使用规则集原名；实际配置与引用统一带 `local-ls-` 前缀。表中的 `PROXY` 表示你选定的真实代理组，不是可直接照抄的名称。

**各规则说明一览：**

| 规则集 | 类型 | 动作 | 说明 |
|-------|------|------|------|
| `applications` | 本地应用 | DIRECT | 迅雷、百度网盘等 P2P 应用直连 |
| `private` | 私有域名 | DIRECT | localhost、局域网域名等 |
| `reject` | 广告/追踪 | REJECT | 拦截广告域名和隐私追踪器 |
| `icloud` / `apple` | Apple 服务 | DIRECT | iCloud、App Store 等直连 |
| `google` | Google 服务 | PROXY | Google 搜索、YouTube 等走代理 |
| `proxy` | 常见海外站 | PROXY | Twitter、Telegram、Netflix 等 |
| `direct` | 国内域名 | DIRECT | 国内各大网站直连 |
| `cncidr` / `lancidr` | CN IP 段 | DIRECT | 国内 IP 和局域网 IP 直连 |
| `telegramcidr` | Telegram IP | PROXY | Telegram 专用 IP 段走代理 |

### 第 3 步：应用并验证

保存后按当前版本界面重新应用该订阅，检查配置校验、核心加载和规则集下载是否成功；保存文件本身不等于已生效。切换订阅或刷新后也要复查最终配置。失败时恢复备份，避免继续叠加修改。

### 可选：跨订阅使用扩展脚本

若要对多个指定订阅应用同一规则，使用[官方 Script 机制](https://www.clashverge.dev/guide/script.html)。下面是上面两步的**替代方案，不要叠加使用**。先备份已有全局脚本；有现成 `main` 时将逻辑整合进去，不要清空或再定义一个 `main`。把 `policies` 的键改为实际配置名称，值改为各自存在的代理组；未列出的订阅原样返回。

脚本保留原 `rule-providers`、规则顺序和兜底规则，只把新条目前置；遇同名 provider 或无效代理组就报错，不静默覆盖。若已用其他扩展添加了同名前缀，先选择一种方案或更换独立前缀。

```javascript
function main(config, profileName) {
  const policies = {
    "YOUR_PROFILE_A": "YOUR_EXISTING_GROUP_A",
    "YOUR_PROFILE_B": "YOUR_EXISTING_GROUP_B"
  };
  if (!Object.prototype.hasOwnProperty.call(policies, profileName)) return config;
  const policy = policies[profileName];
  if (!Array.isArray(config.rules) || !Array.isArray(config["proxy-groups"]) ||
      !config["proxy-groups"].some(group => group.name === policy)) {
    throw new Error("Check existing rules and the selected proxy group");
  }
  const existing = config["rule-providers"] || {};
  if (typeof existing !== "object" || Array.isArray(existing)) {
    throw new Error("Invalid rule-providers object");
  }
  const specs = [
    ["applications", "classical", "DIRECT"],
    ["private", "domain", "DIRECT"],
    ["reject", "domain", "REJECT"],
    ["icloud", "domain", "DIRECT"],
    ["apple", "domain", "DIRECT"],
    ["google", "domain", policy],
    ["proxy", "domain", policy],
    ["direct", "domain", "DIRECT"],
    ["lancidr", "ipcidr", "DIRECT"],
    ["cncidr", "ipcidr", "DIRECT"],
    ["telegramcidr", "ipcidr", policy]
  ];
  const additions = {};
  const rules = [];
  for (const [name, behavior, target] of specs) {
    const key = "local-ls-" + name;
    if (Object.prototype.hasOwnProperty.call(existing, key)) {
      throw new Error("Provider name already exists: " + key);
    }
    additions[key] = {
      type: "http", behavior,
      url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/" + name + ".txt",
      path: "./ruleset/" + key + ".yaml", interval: 86400
    };
    rules.push("RULE-SET," + key + "," + target);
  }
  rules.push("GEOIP,LAN,DIRECT", "GEOIP,CN,DIRECT");
  config["rule-providers"] = Object.assign({}, existing, additions);
  config.rules = rules.concat(config.rules);
  return config;
}
```

后续订阅扩展仍可能改写全局脚本的结果，必须检查最终配置。以上示例仅做静态与逻辑验证，不代表在你的客户端或网络中实测通过。

## 配置成功后体验变化

规则匹配正确时，列出的国内流量走直连、海外流量走所选代理组，命中拒绝列表的请求被拦截。实际结果取决于列表、节点和网络；规则不保证流媒体解锁、防封号或完全去广告。

## 如何确认规则是否配置成功？

不确定规则有没有生效？用这个方法验证：

1. 在主界面左侧点击 **「设置」**
2. 向下滚动找到 **「Verge 高级设置」** → 点击 **「当前配置」**
3. 会弹出一个文本编辑器，显示最终合并后的完整配置文件

入口名称随版本变化，以查看当前实际运行配置的功能为准。逐项确认：

- `rule-providers` 同时保留原条目和新增 `local-ls-*`；下载状态正常，不能只看名字出现。
- `rules` 中引用位于预期顺序，原订阅规则和末尾 `MATCH` 仍在；每个 `RULE-SET` 名称都能找到定义。
- 所有自定义策略名都对应真实代理组，核心校验/加载日志没有错误。
- 发起一个无敏感信息的测试请求，在“连接”或命中日志中核对实际规则、策略与出口；已有连接可能沿用旧路由，应检查新连接。

![验证规则配置成功截图 =900x721](https://image.ermao.net/images/blog/clash-rules-config/20260228_141336-94acd7.png)

::: danger 必须检查的一点
要按本文的规则列表分流，请使用 **「规则 (Rule)」模式**。规则、全局和直连决定进入客户端的流量如何转发；流量是否进入客户端则取决于系统代理、TUN 或应用自身的代理设置。切换为规则模式不会自动接管所有应用，需结合连接日志确认，参见[官方模式说明](https://www.clashverge.dev/guide/term.html)。
:::

## 常见问题

### 配完规则后某些网站打不开怎么办？

极少数网站可能被规则误判为"直连"或"代理"。你可以在 Clash Verge Rev 的「连接」面板中查看某个域名实际匹配到了哪条规则，再手动添加自定义规则覆盖。

### 手机端 Clash 也能配规则吗？

兼容的 Android Clash 客户端可使用自定义规则，但不能直接套用 Verge 的扩展入口与语法。参见 [Clash for Android](/article/eh8f4n86/)，并核对实际内核与版本。

iOS 用户建议使用 [Shadowrocket（小火箭）](/article/z747kgjd/)，规则配置方法参考 → [小火箭规则配置教程](/blog/shadowrocket-rules-config/)。

### 规则会自动更新吗？

`interval: 86400` 请求每 24 小时刷新规则集，成功与否取决于客户端能否访问配置中的 URL。检查下载状态与更新时间，不把定时设置当作已成功更新的证明。

## 延伸阅读

如果你觉得这篇教程有帮助，以下相关文章也值得一看：

- **入门科普** — [电脑如何翻墙？Windows 与 Mac 科学上网指南](/blog/how-to-vpn-on-computer/) ｜ [手机如何翻墙？Android 与 iOS 教程](/blog/how-to-vpn-on-mobile/)
- **客户端安装** — [Clash Verge Rev 全平台安装教程](/article/0gematwc/) ｜ [Clash for Android 安装教程](/article/eh8f4n86/) ｜ [macOS Clash Verge Rev 安装指南](/article/6vxkmmuh/)
- **iOS 用户** — [Shadowrocket 新手教程](/article/z747kgjd/) ｜ [小火箭规则配置教程](/blog/shadowrocket-rules-config/) ｜ [免费 Apple ID 共享账号](/blog/freeappleid/)
- **选机场** — [2026 年便宜好用的翻墙机场推荐](/posts/vpn/)
