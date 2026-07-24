---
url: /blog/cross-border-network-ai-weekly-2026-07-23/index.md
description: >-
  本期核验 v2rayN 下载器安全修复、sing-box 1.14 beta、GitHub Actions 证书故障、OpenAI 与 Claude
  连续可用性事件，并追踪新德里与 AJK 停复网报道及 Google Play DMA 处罚，区分已确认事实、媒体转述和仍待核实的影响边界。
---
本期覆盖 2026 年 7 月 17 日至 23 日。v2rayN 修复下载器安全风险，sing-box 1.14 进入 beta；GitHub Actions 证书故障影响部分 AI 工作流，OpenAI 与 Claude 连续出现可用性事件。新德里停网、AJK 复网和 Google Play 监管变化仍有证据缺口。

## 本周概览

| 选题线 | 事件 | 已核验事实 | 读者影响 | 证据状态 |
| --- | --- | --- | --- | --- |
| 网络安全与供应链 | v2rayN 7.24.1 | 维护者称已修复旧版内置下载器可能遭 MITM 并下载恶意文件的问题 | 旧版用户应只从官方 Release 更新 | 项目原文；页面标为 pre-release，且无 CVE、受影响版本下界或在野利用证据 |
| 代理工具与协议 | sing-box 1.14.0-beta.1 | 修正规则集匹配语义，增加搜索域规则和并行 DNS 响应评估 | 复杂规则/DNS 配置应先测试再升级 | 项目原文；预发布，缺少独立回归测试 |
| 服务商风险与基础设施 | GitHub Actions 证书故障 | 自托管与 larger-hosted runners 因内部证书过期无法连接，并级联影响 API 等组件 | CI、开源发布与依赖 GitHub 的 AI 工作流可能延迟或失败 | GitHub 完整事故报告 + OpenAI 状态交叉确认 |
| AI 与海外服务 | OpenAI 连续故障 | 对话、图像、上传、登录及多组件先后出现官方事件 | 应按组件查状态，不能把所有失败归因于代理或账号 | 官方状态；根因和影响比例多数未公布 |
| AI 与海外服务 | Claude 连续故障 | 多模型及 claude.ai、API、Code、Cowork、Office add-in 先后受影响 | 同一时段不同模型和产品面的表现可能不同 | 官方状态；根因和地区分布未公布 |
| 网络审查与断网 | 新德里 Jantar Mantar 局部停网 | 两家媒体均报道 1.5 公里范围的移动互联网暂停延至 7 月 23 日午夜 | 局部运营商级停网不能等同普通网站或 DNS 故障 | 多家媒体转述；命令原文和测量缺失 |
| 网络审查与断网 | AJK Mirpur 开始复网 | 媒体称 Mirpur 市及周边在 45 天中断后开始恢复 | 不能由 Mirpur 进展外推 AJK 全区已复网 | 三家媒体；缺运营商/监管原文和测量 |
| 平台规则与数字监管 | Google Play DMA anti-steering 决定 | 欧盟委员会认定 Google Play 的导流限制不合规，并就此罚款 4.3 亿欧元 | 可能影响开发者提供站外购买入口的方式 | 委员会原文 + AP 等独立报道；产品改动尚未落地核验 |

## 客户端更新：先处理下载链风险，再评估预发布功能

### v2rayN 7.24.1 是安全更新，但影响边界仍不完整

v2rayN 项目在 7 月 17 日发布 [`7.24.1`](https://github.com/2dust/v2rayN/releases/tag/7.24.1)，维护者把它标为紧急安全更新：旧版内置下载器可能受到中间人攻击并下载恶意文件，新版本已修复。Release 同时列出 Avalonia 12、Happy Eyeballs 和连接代理解析策略等变化，GitHub 页面则仍将该版本标为 pre-release。

最重要的行动不是从第三方站点寻找“已打补丁版本”，而是从项目官方 Release 获取更新、备份配置并保存校验信息；介意预发布稳定性的用户还应留意维护者是否补发稳定版。当前仍未公开 CVE、受影响版本下界、利用条件或在野利用证据，因此只能确认**项目方发布了安全修复和升级建议**，不能写成已经发生大规模攻击。需要比较 v2rayN、Clash Verge Rev 与 sing-box 定位的读者，可先看本站的[翻墙工具汇总](/article/fanqiang-tools/)。

### sing-box 1.14 进入 beta，复杂规则集需要回归验证

7 月 23 日发布的 [`v1.14.0-beta.1`](https://github.com/SagerNet/sing-box/releases/tag/v1.14.0-beta.1)把 1.14 系列从 alpha 推进到首个 beta。项目修正此前未定义且反直觉的规则集匹配行为，新增搜索域相关 DNS 规则项，并允许多个响应评估并行竞争。

项目方不把规则集修正定义为 breaking change，但同时承认依赖旧有未定义行为的配置可能受影响。使用自定义规则集、`evaluate`/`race` 或复杂 DNS 分流的用户，应在副本配置中对照命中结果与延迟；普通机场订阅用户无需把 beta 当作稳定版强制升级。本周 alpha 版本还加入 OpenVPN/OpenConnect endpoint 和互操作能力，但这些均缺少独立兼容矩阵。需要先理解 sing-box 与图形客户端、订阅格式关系的读者，可参考[翻墙工具汇总](/article/fanqiang-tools/)。

## 基础设施故障：GitHub 证书过期影响到 AI 工作流

GitHub 的[完整事故报告](https://www.githubstatus.com/incidents/8vfyvq16hzh9)确认，7 月 20 日上海时间约 07:05–11:55，自托管与 larger-hosted Actions runners 因一组内部服务的证书生命周期管理失败、SSL 证书过期而无法连接。重连流量又增加 API 负载，Issues、Pages 和 API Requests 随之出现降级；标准与 Mac hosted runners 不在报告列出的影响范围内。

OpenAI 在独立[状态事件](https://status.openai.com/incidents/01KXYF4BTCV9DTZ5NDSFN716FH)中说明，依赖 GitHub 的 ChatGPT/Codex 工作流也可能失败或延迟，主要涉及 Codex web 和 PR code review。这是一次可由两个官方状态系统交叉确认的依赖传导，不是“代理线路导致 GitHub 和 Codex 一起坏了”的证据。遇到类似异常时，可结合本站的[GitHub 访问与故障排查](/article/github/)先区分网页、Git、API、Actions 和上层连接器。

## AI 服务故障：按模型、组件和官方时段判断

### OpenAI 的异常从单项功能扩展到多组件

OpenAI 本周至少有四段值得合并观察的官方时间线：

* 7 月 19 日晚，[ChatGPT 对话、Voice 与 Work Mode](https://status.openai.com/incidents/01KXXDNEAKEPRGFM661SBJJAM6)出现错误，次日凌晨恢复。
* 7 月 21 日至 22 日，[ChatGPT 图像生成](https://status.openai.com/incidents/01KY23YCPJ9M5BFFT6ZHKQE9MP)跨日不可用；7 月 22 日又出现[登录与注册](https://status.openai.com/incidents/01KY2ZF047ZNVDX0Z6F3QFXB1K)、[API 图像生成](https://status.openai.com/incidents/01KY32PEQHPV5F2W4HCNFJ60RD)及[文件上传/图像生成](https://status.openai.com/incidents/01KY4BT971GFN59WBT0CKSGCPJ)事件。
* 7 月 23 日上海时间 23:36，[新的 Elevated Error Rates 事件](https://status.openai.com/incidents/01KY7SX5MYJ2BP51X5MXAPYX71)开始，状态页列出 API、ChatGPT 与 Codex 多个受影响组件。

截至 7 月 24 日 09:06 的复核截点，最后一项仍为 monitoring，官方没有公布完整根因、地区或请求失败比例。用户可据此判断某段异常是否落在官方窗口内，但不能由状态页推断自己的账号一定未触发地区/IP 风控。海外服务打不开时，先把平台状态、账号权限、出口 IP 和本地线路分开检查；本站的[翻墙后海外服务入口整理](/blog/gfwwebstie/)可作为下一步阅读。

### Claude 多模型和不同产品面连续出现事件

[Claude 官方 incidents API](https://status.claude.com/api/v2/incidents.json)在 7 月 20–23 日记录了多轮 Opus、Haiku、Sonnet、Fable 相关错误，以及 claude.ai、API、Console、Claude Code、Cowork 和 Microsoft 365 add-in 的不同影响组合。7 月 21 日深夜至 22 日凌晨出现标为 critical 的多模型/服务事件；7 月 23 日又有 Sonnet 5、Claude services、Haiku 4.5 和 Office add-in 可用性问题。

截至本次复核，Office add-in 事件仍为 identified；各段事件是否同源、受影响请求比例、地区和套餐分布均未公开。准确结论是“官方记录了连续但边界不同的故障”，而不是“Claude 全周一直宕机”或“所有模型都不可用”。

## 局部停网与复网：范围和原始命令仍是证据缺口

### 新德里 Jantar Mantar 周边停网延至 7 月 23 日午夜

The Week 在 7 月 23 日晚的[后续报道](https://www.theweek.in/news/india/2026/07/23/mha-s-fifth-internet-cut-around-cjp-protests-at-jantar-mantar-since-july-17-what-we-know-so-far.html)称，Jantar Mantar 周边 1.5 公里的移动互联网暂停延至当地午夜，并称这是 7 月 17 日以来第五次；[LiveMint 时间线](https://www.livemint.com/news/india/cjp-protest-news-live-updates-salman-khan-support-delhi-police-opposition-dharmendra-pradhan-narendra-modi-jantar-mantar-11784765327647.html)也记录了当地 16:00–24:00 的延长范围。

两家媒体对范围和结束时间一致，但本次仍未找到可公开核对的政府命令全文，也没有运营商清单、跨运营商测量或午夜后的恢复证据。因此，主管部门、法律依据和“第五次”等细节应明确归于媒体对命令的转述。理解运营商级停网与普通访问失败的区别，可先阅读[什么是翻墙与网络封锁](/article/fanqiang2/)。

### AJK 只能确认 Mirpur 出现开始恢复的报道

7 月 23 日，[Geo News](https://www.geo.tv/latest/674428-mobile-internet-services-begin-restoring-in-ajks-mirpur-after-45-day-suspension)称 Mirpur 市及周边的移动和互联网服务在 45 天中断后开始恢复；[Dawn](https://www.dawn.com/news/2017643/ppp-asks-ajk-cec-to-seek-internet-restoration-ahead-of-polls)与[The News](https://www.thenews.pk/print/1427620-ch-yasin-urges-cec-to-restore-internet-service-in-ajk)同日报道了选举前要求复网的信函和政治诉求。

这些来源足以支持“Mirpur 开始恢复的媒体报道”，不足以支持“AJK 全区已经复网”。运营商、固定/移动网络差异、实际覆盖和性能仍没有监管原文或测量证明，Muzaffarabad 等其他地区也仍在报道的复网诉求中。

## Google Play DMA 决定针对导流限制，不等于应用地区限制已经改变

欧盟委员会 7 月 23 日的[正式公告](https://digital-strategy.ec.europa.eu/en/news/commission-fines-google-eu890-million-breaches-digital-markets-act)认定 Google 在 Search 自我优待和 Google Play anti-steering 两方面不合规，分别罚款 4.6 亿与 4.3 亿欧元。就 Google Play 而言，核心是开发者能否向用户说明外部优惠，并把用户引导到网站或第三方应用商店等替代渠道。[AP 的独立报道](https://apnews.com/article/199c77e09d3829ebfc3d9e51281a369a)确认总罚款和两类决定。

截至本次复核，尚无证据表明具体 VPN/代理应用已因此恢复某地区上架、Google Play 已取消地区限制或站外购买规则已经完成产品改写。Google 对安全影响的回应也只是公司主张。需要处理海外应用获取问题的读者，可查看[手机科学上网与应用安装说明](/blog/how-to-vpn-on-mobile/)，但不要把监管决定当作即时可用性保证。

## 工具与服务更新表

| 项目 | 本期已核验变化 | 当前边界 | 建议 |
| --- | --- | --- | --- |
| v2rayN | `7.24.1` 修复项目方所述下载器 MITM 风险 | 无 CVE、受影响版本下界或在野利用证据 | 从官方 Release 更新，保存哈希与旧配置 |
| sing-box | `1.14.0-beta.1` 修正规则集语义并增加 DNS 响应竞速 | beta，缺独立回归测试 | 复杂配置先在副本验证 |
| Mihomo | `v1.19.29` 已在窗口内发布，并被 Clash Verge Rev v2.5.2 采用 | 已在上一期周报记录，不重复展开 | 关注 AnyTLS、OpenVPN、DNS 与规则回归 |
| Clash Verge Rev | `v2.5.2` 修复订阅导入、TUN、DNS、规则编辑等问题 | 未见统一环境回归报告 | 备份配置，只从官方 Release 下载 |
| OpenAI | 多个功能和多组件状态事件 | 最后一项在复核时仍 monitoring | 按组件查状态，保留备用工作流 |
| Claude | 多模型、多产品面连续事件 | Office add-in 事件仍 identified | 按模型/产品面核对，不把错误都归因于网络 |

## 对普通用户的实际建议

1. **把更新来源当作安全边界。** 客户端安全修复期间更不要使用陌生网盘、群文件或“优化版”；优先核对项目 Release、签名和哈希。
2. **把服务故障拆成组件。** 网页、API、模型、文件上传、登录、Code/CLI 和第三方 connector 可能各自有状态，某一项恢复不代表全部正常。
3. **把依赖方状态一起查。** GitHub、云/CDN 或身份系统故障可能传导到 AI 与自动化工作流；只切换节点往往无法解决上游问题。
4. **停复网报道要看范围。** “1.5 公里”“Mirpur 市及周边”和“AJK 全区”不是同一结论；没有命令原文和测量时，应保留不确定性。
5. **监管决定不等于产品立即变化。** Google Play 的 anti-steering 决定可能影响未来导流方式，但不能据此宣称应用上架、付款或地区可用性已经改变。

## 下周观察与内容缺口

* OpenAI 7 月 23 日多组件事件和 Claude Office add-in 事件何时最终 resolved，是否公布根因或影响比例。
* v2rayN 是否补充 CVE、受影响版本范围或技术说明；这是本期的**常青专题候选**：“代理客户端自动更新与下载链完整性核验指南”。
* sing-box 1.14 beta 是否出现规则集/DNS 回归、客户端采用情况或稳定版迁移说明。
* 新德里停网命令全文、运营商范围和午夜后恢复测量；AJK 其他地区是否复网。
* Google 是否公布具体 Play 合规方案、实施时间或申诉，开发者导流与地区下载限制是否出现可验证变化。

本期没有发现可同时满足解释价值、明确复用权利和 `approved` 状态的本地图片；媒体照片、Reuters/AP/PTI 素材与装饰性标题图均未使用，因此草稿没有图片，也没有执行 R2 上传。

## 信息来源

1. 2dust/v2rayN，7 月 17 日：[v2rayN 7.24.1 Release](https://github.com/2dust/v2rayN/releases/tag/7.24.1)
2. SagerNet，7 月 23 日：[sing-box v1.14.0-beta.1 Release](https://github.com/SagerNet/sing-box/releases/tag/v1.14.0-beta.1)
3. GitHub，7 月 20 日：[Incident with GitHub Actions](https://www.githubstatus.com/incidents/8vfyvq16hzh9)
4. OpenAI，7 月 20 日：[GitHub-dependent ChatGPT and Codex workflows incident](https://status.openai.com/incidents/01KXYF4BTCV9DTZ5NDSFN716FH)
5. OpenAI，7 月 19–23 日：[OpenAI Status incident history](https://status.openai.com/history)
6. OpenAI，7 月 23 日：[Elevated Error Rates](https://status.openai.com/incidents/01KY7SX5MYJ2BP51X5MXAPYX71)
7. Anthropic，7 月 20–23 日：[Claude Status incidents API](https://status.claude.com/api/v2/incidents.json)
8. The Week，7 月 23 日：[Jantar Mantar fifth internet cut report](https://www.theweek.in/news/india/2026/07/23/mha-s-fifth-internet-cut-around-cjp-protests-at-jantar-mantar-since-july-17-what-we-know-so-far.html)
9. LiveMint，7 月 23 日：[Jantar Mantar mobile internet suspension timeline](https://www.livemint.com/news/india/cjp-protest-news-live-updates-salman-khan-support-delhi-police-opposition-dharmendra-pradhan-narendra-modi-jantar-mantar-11784765327647.html)
10. Geo News，7 月 23 日：[Mirpur mobile and internet services begin restoring](https://www.geo.tv/latest/674428-mobile-internet-services-begin-restoring-in-ajks-mirpur-after-45-day-suspension)
11. Dawn，7 月 23 日：[AJK internet restoration request ahead of polls](https://www.dawn.com/news/2017643/ppp-asks-ajk-cec-to-seek-internet-restoration-ahead-of-polls)
12. The News，7 月 23 日：[AJK restoration request](https://www.thenews.pk/print/1427620-ch-yasin-urges-cec-to-restore-internet-service-in-ajk)
13. 欧盟委员会，7 月 23 日：[Google DMA non-compliance and €890 million fine](https://digital-strategy.ec.europa.eu/en/news/commission-fines-google-eu890-million-breaches-digital-markets-act)
14. AP，7 月 23 日：[EU Google Play and Search fine report](https://apnews.com/article/199c77e09d3829ebfc3d9e51281a369a)
15. MetaCubeX，7 月 18 日：[Mihomo v1.19.29 Release](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.29)
16. clash-verge-rev，7 月 19 日 UTC（上海时间 7 月 20 日）：[Clash Verge Rev v2.5.2 Release](https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.2)

> 本文是信息摘要，不构成法律意见、投资建议、产品背书或任何服务可用性保证。软件版本、平台状态、地区政策和网络可用性都可能继续变化；如发现来源更新或事实错误，请通过本站[更正页面](/corrections/)反馈。
