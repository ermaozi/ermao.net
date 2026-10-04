# 工具点击统计：待上线配置

2026-10-03：本次仅完成本地实现和测试，未迁移线上 D1、未部署 Worker、未验证生产收集。实际 checkout origin 为 `https://github.com/ermaozi/ermao.net.git`。此文档不证明 GitHub 应用内部 repository ID。

沿用 `docs/.vuepress/config.ts` 的 `STATS_WORKER_URL`（默认同源 `/api/stats`）及现有 `cloudflare/stats/wrangler.toml` 的 Worker/D1。没有新增第三方服务、凭据、Cookie 或权限。新端点 `POST /api/stats/events` 与旧 PV 写入代码分开处理，只接受 `{surface,event}` 两个字段；枚举在 `data/tool-events.js`。D1 仅保存 UTC 日期、surface、event 和计数，不保存原始事件、URL、查询参数、referrer、IP、UA、城市、筛选值、账号或访客标识。旧 PV 的字段不属于本次事件统计，也不用于本次指标。

浏览器通过 `data-tool-event` 和最近祖先的 `data-tool-surface` 委托监听点击；筛选使用 change。发送请求省略凭据和 Referer，遵循 DNT/GPC，同一类事件 800ms 内重复点击去重。非生产域名完全不发送；不会因失败阻止导航。只有同源配置可发送，跨域配置会禁用本功能。服务器要求生产 Origin，拒绝任意额外字段并限制请求体 256 字节。没有用户识别或跨会话去重，计数仅用于方向性的有效操作量，不应解释为唯一用户、购买转化或精确防刷指标。攻击者仍可能伪造 Origin，因此不用于财务结算。

## 获准部署后的步骤（本次未执行）

1. 保留现有 Access 保护：`/stats/api`、`/stats/`、`/en/stats/`。公开 `GET /api/stats` 继续关闭；本次不新增公开事件汇总 API。
2. 使用现有授权 Cloudflare 配置备份数据库后，应用增量 `tool-events.sql`，或由现有 `cloudflare/deploy.sh stats` 流程应用已合并的 `schema.sql`。不需要新增 Secret。
3. 对 Worker 进行 dry-run，审核后部署；再发布站点。旧 Worker 尚无该路由时事件不会入库，这段时间不能计作完整实验窗口。
4. 生产域测试一次操作、快速重复点击、键盘激活与页面跳转；检查请求仅含两个枚举字段、无 Cookie/Referer，然后通过既有 Cloudflare D1 管理访问查询下方聚合。检查缺表返回 503；正常事件 204 在写入成功后返回；DNT/GPC 请求直接返回 204 且不写入。不得把本地 mock 结果当线上数据。
5. 记录部署时间和版本后开启至少 14 天观察窗，与上线后同口径基线比较。事件量不能代替 GSC 曝光、CTR 或排名证据。

```sql
SELECT day, surface, event, count
FROM tool_event_daily
ORDER BY day DESC, surface, event;
```

没有新增公开报表。若将来需要网站报表，仅在既有受 Access 保护的私有报表路由增加，并重新验收访问控制。服务器不储存任何事件标识，因此无法事后证明单次操作是否由同一用户重复触发。

测试：`node --test scripts/tool-events.test.mjs cloudflare/stats/rankings.test.mjs`。覆盖实际 Worker 路由、SQLite schema/累加、字段和 Origin 白名单、超长输入、未配置返回 503、前端去重/筛选/隐私首选项/预览禁用及旧私有路由回归。
