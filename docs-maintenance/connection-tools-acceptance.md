# 连接工具交付与验收

日期：2026-10-03 UTC。仓库 `ermaozi/ermao.net`，已通过 GitHub 返回的 repository ID `797628745` 核对。起点 `093571d`，工作分支 `feat/connection-tools-20261003`。初始工作区干净；未发现仓库 AGENTS.md 或 .agents/skills，环境 /workspace/.agents 为空。保留既有 SEO 修复；不迁移 Sites，不推送、不合并、不正式部署。

## 功能入口

- `/posts/vpn/#connection-selector`：设备教程、严格人民币月付预算/最低流量筛选、2–3 家对比、默认 6 家展开/收起。
- `/posts/vpn/`：手机首屏双 CTA，将原远程首图移至说明之后，保留首页摘要图片优先级契约；保留原文、canonical、FAQ、比较锚点和旧榜单。
- `/connection-help/`：桌面 Clash、Android Clash、Shadowrocket 三类客户端各三类问题，共九条分步流程。
- `/airport/`：补充选择器与排错内链。

选择器纳入 26 家来源可匹配的月付记录，仍不是服务实时核验或稳定性排名。不纳入优惠码或折算年付。unknown 保持未知；XSUS/网际快车歧义套餐排除，Danke/迅达原文无法对应的目录套餐暂不纳入。未改动原目录。每卡附来源编辑日期及原文，不能把 2026-10-03 工具整理日期当服务价格验证日。

排错不要求凭据，不修改设备，完成流程不等于已修复。原文日期包括桌面教程“未声明更新日期”；所有九条摘要在测试中对应来源。

## 可复现验证

安装使用仓库锁文件与兼容 pnpm（本环境已有 pnpm 10.32.1）：

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm test:data
pnpm airport:check
pnpm audit:site
python3 scripts/seo-regression.py
pnpm preview
# 另一个终端；默认 /usr/bin/chromium，可用 CHROMIUM_PATH 覆盖
pnpm test:browser
```

本云环境全局 pnpm 12 与预装 store v10 不兼容，使用 `/workspace/.onboarding-tools/node_modules/pnpm/bin/pnpm.cjs` 安装；验证直接调用 node_modules/.bin 中同一锁文件工具，不改变 HOME 或凭据。构建完成后再运行浏览器，避免 VuePress 清理 dist 时误读 404。

新增类型配置覆盖 client.ts 和它导入的组件、选择器数据及一致性测试；新增 lint 覆盖本轮入口、交互组件和事件模块。既有项目没有类型/lint脚本，本次没有声称所有旧脚本已通过严格静态检查。发现旧 ClaudeEnvCheck 浏览器计时器被 Node Timeout 类型污染，改为浏览器 number 类型，运行行为不变。

浏览器使用真实 Chromium 390×844 与 1440×1000，覆盖条件变更、空结果、重置、重复点击、对比返回/Escape/取消、隐藏已选保留、源链接、本地不发事件、浏览器历史；排错另覆盖18条宽窄组合、键盘、各步骤与原文日期。统计浏览器测试拦截所有请求，将生产域名的静态内容映射到本地，绝不请求线上写入，验证编译后正确端点、键盘、Ctrl/中键新标签一次事件、仅两字段、无 Cookie/Referer、503 不阻断导航。

## 证据

`artifacts/ux-20261003/` 包含改前后窄宽首屏截图、选择器截图、排错截图、浏览器 JSON 和构建/审计/类型/lint/自动化日志。初始 366 篇、改后 367 篇审计。已有英文长摘要警告仍保留；机场全目录 71 条记录的 3 条 unknown 警告仍明确保留，未伪造未知资料。

## 统计与部署

新增 `POST /api/stats/events` 与独立日聚合 D1 表；只有固定 surface/event 字段，无原始事件或用户标识。不使用旧 PV 作分母，不声称购买成交。生产收集尚未启用，当前没有真实点击结果。详见 `cloudflare/stats/TOOL_EVENTS.md` 与 `docs-maintenance/seo-experiment-20261003.md`。

本次 Worker 仅执行 dry-run，没有迁移远端 D1。待用户批准发布后，使用已有 Cloudflare 配置迁移表并部署 Worker，再发布静态站点；保持 `/stats/api`、`/stats/`、`/en/stats/` 的 Access，保持公开 GET /api/stats 禁用。不新增第三方服务或 Secret。默认同源 STATS_WORKER_URL 可复用；若生产覆盖成跨域值，新事件会禁用，需确认现有配置。主分支推送会触发部署，因此当前分支仅本地提交。

SEO 历史报告只能作历史背景，GSC 性能基线仍待导出；用户需提供适当数据，不需要交付凭据。正式效果至少在上线后完整等长窗口（建议28天）后评估。本次完成可用性和实现验收，不声称增长验证。

## 最终结果与已修复问题

- 完整静态构建 398 页通过；367 篇内容审计 0 错误、1 条既有英文摘要长度警告；中英文 SEO 回归通过。
- 类型检查与本轮 lint 通过；12 项 Node 自动化通过；26 家来源数据一致性通过；71 条目录检查通过并保留 3 条既有未知数据警告。
- Worker dry-run 成功；没有执行远端写入或正式 deploy。
- 浏览器发现并回归修复：统计配置被双重序列化导致错误端点，现已对实际编译 JS 验证；首页摘要图片移除打破既有 eager/high 契约，现改为下移；首次验收脚本遇到构建期间目录清理导致暂时404，已固定先完整构建再测。浏览器测试关闭时的请求清理竞争已在测试脚本修正。
- 真实手机首屏双 CTA 可见，选择器与排错无横向溢出；截图为真实 Chromium 渲染。既有远程横幅在云环境截图中未加载成功（改前也存在），工具本身不依赖该图片；未声称全站第三方资源均可访问。
