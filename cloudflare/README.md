# ermao.net Cloudflare 后端

本站 Cloudflare Worker、Wrangler 配置和 D1 SQL 的统一维护目录。这里不保存 Token 或 Worker Secret。

| 目录 | Worker | 入口 | 绑定与 Secret |
| --- | --- | --- | --- |
| `stats/` | `vuepress-stats-worker` | `/api/stats*` | D1 `VIEWS_DB`、KV `VIEWS_KV`、Secret `LIKE_ID_SECRET` |
| `ad-board/` | `ad-board` | `/api/board/*` | D1 `DB`、Secret `VISITOR_HASH_SECRET`、`TURNSTILE_SECRET` |
| `claude-env-check/` | `claude-env-check` | `/api/claude-env-check` | 可选 Secret `PROXYCHECK_API_KEY` |

三个 Worker 共用账号 `b0021b5742f923f992a9e15ad797de45`；统计与广告牌共用 D1 `ermao_net`（`54251901-dd08-4a02-a577-a4d96215843d`）。统计 Worker 另绑定 KV `85cccaee38234c2db6cab0dec578f0f2`，每天 UTC 01:15 聚合前一天数据。

## 首次准备

```bash
cd cloudflare
cp .cloudflare.env.example .cloudflare.env
chmod 600 .cloudflare.env
# 编辑 .cloudflare.env，填入 CLOUDFLARE_API_TOKEN
pnpm install --frozen-lockfile
```

Token 文件已加入 `.gitignore`。所有 Secret 的值只能在 Cloudflare 中设置/更新，无法导出，也不会出现在本目录。首次新建 Worker 时分别设置：

```bash
set -a; source .cloudflare.env; set +a
pnpm exec wrangler secret put LIKE_ID_SECRET --config stats/wrangler.toml
pnpm exec wrangler secret put VISITOR_HASH_SECRET --config ad-board/wrangler.toml
pnpm exec wrangler secret put TURNSTILE_SECRET --config ad-board/wrangler.toml
pnpm exec wrangler secret put PROXYCHECK_API_KEY --config claude-env-check/wrangler.toml
```

`LIKE_ID_SECRET`、`VISITOR_HASH_SECRET` 至少使用 32 个随机字符。`PROXYCHECK_API_KEY` 是可选项；未设置时环境检测仍返回 Cloudflare 原生网络信息。

## 部署

```bash
./deploy.sh stats
./deploy.sh ad-board
./deploy.sh claude-env-check
# 或依次部署全部
./deploy.sh all
```

脚本先检查 Token、执行严格 dry-run，再应用幂等 D1 SQL 并部署。统计后端只有在最近 366 个已完成 UTC 日的聚合数据不完整时，才扫描原始 `views` 回填。

公开统计接口继续使用 `/api/stats`：访问写入为 `POST /api/stats`，热门、互动和点赞分别位于 `/api/stats/popular`、`/api/stats/engagement`、`/api/stats/likes`。私有报表改为 `GET /stats/api`，必须与 `/stats/`、`/en/stats/` 一起由 Cloudflare Access 保护；旧公开 `GET /api/stats` 已关闭。

四个 Zone Route 已写入 `stats/wrangler.toml`，运行 `./deploy.sh stats` 即可应用。确认网站已发布且同源接口正常后，再从 Cloudflare 删除 `views.ermao.net` Custom Domain。

## 文件职责

- `*/worker.js`：Worker 源码。
- `*/wrangler.toml`：Worker 名称、兼容日期和非敏感绑定。
- `stats/schema.sql`：访问统计、日聚合和文章点赞表结构。
- `stats/backfill_daily_stats.sql`：最近 366 个已完成 UTC 日的条件回填。
- `ad-board/schema.sql`：广告牌四张表及索引。
- `stats/rankings.test.mjs`：热门与点赞排行回归测试。

R2 图片上传仍属于站点内容工具，保留在 `scripts/upload_r2.ts` 与 `scripts/lib/r2Uploader.ts`，不与 Worker 部署混在一起。
