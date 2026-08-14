# ermao.net 自建评论系统开发计划

> 状态：讨论中的开发基线，尚未开始实施
>
> 更新日期：2026-08-08
>
> 本文档不代表创建 Cloudflare 资源、迁移数据、部署或切换生产环境的授权。

## 1. 目标

将 ermao.net 当前的 Giscus 评论区替换为站内评论组件：

- 后端运行在 Cloudflare Worker；
- 评论、用户、会话和管理记录存入独立 D1；
- 评论图片存入私有 R2；
- 图片由浏览器使用 Presigned URL 直接上传到 R2；
- 发言前必须通过 Cloudflare Turnstile 人机验证；
- 支持使用 GitHub OAuth 登录后发言；
- 将现有 Giscus/GitHub Discussions 评论和图片迁入新后台；
- 保留旧 GitHub Discussions，确认新系统稳定前不删除数据。

## 2. 当前已确认的方向

- 使用自有评论组件替换 Giscus。
- 使用一个评论 Worker、一个独立 D1、一个私有 R2 Bucket。
- 图片使用 Presigned `PUT` URL 直传 R2，不实现 Worker 代理上传的第二条路径。
- 发言和回复由 Turnstile 保护，并在 Worker 服务端验证。
- 支持 GitHub OAuth 登录。
- 迁移现有 GitHub 评论及其中的图片附件。
- 先完成隔离预览和迁移演练，再申请生产切换授权。

## 3. 仍可调整的默认值

以下是当前基线，不是不可变更的最终决定：

- 仅登录 GitHub 后可以发表、回复、编辑和删除；未登录用户只能阅读。
- 中英文对应文章共享同一评论线程。
- 每条评论最多上传 3 张图片，每张不超过 3 MB，总计不超过 9 MB。
- 用户可选择 JPEG、PNG、WebP，浏览器上传前统一压缩为 WebP。
- 新评论只支持一级回复。
- 管理员依据不可变的 GitHub 数字用户 ID 判断。
- 第一版只提供隐藏、恢复和审计记录，不建设独立管理后台。

## 4. 总体架构

```text
VuePress 评论组件
  ├─ 读取/发表/管理评论 ──> /api/comments/* ──> Comment Worker ──> D1
  ├─ 申请上传地址 ───────> Comment Worker ──> R2 Presigned URL
  ├─ 直接 PUT 图片 ─────────────────────────> R2 pending 对象
  └─ 确认图片/读取图片 ──> Comment Worker ──> 私有 R2 final 对象

GitHub OAuth ──> Comment Worker ──> D1 会话
Turnstile ─────> Comment Worker 服务端验证
GitHub GraphQL ─> 迁移脚本 ──> D1 + 私有 R2 迁移归档
```

规划资源：

- Worker：`ermao-comments`
- D1：`ermao_comments`
- 私有 R2 Bucket：`ermao-comments`
- 同源 API：`https://www.ermao.net/api/comments/*`
- 代码目录：`cloudflare/comments/`

## 5. 功能范围

### 5.1 第一版实现

- 无需登录即可分页读取评论；
- GitHub 登录和退出；
- 发表评论和一级回复；
- 编辑、软删除自己的评论；
- 安全渲染 Markdown，禁用原始 HTML；
- 上传、预览和移除评论图片；
- 管理员隐藏、恢复评论；
- 管理操作审计；
- 亮色、暗色、桌面和移动端适配；
- 中英文对应文章共享评论；
- 完整迁移 Giscus 历史数据。

### 5.2 第一版不实现

- 匿名发言；
- 邮件通知；
- 点赞和表情；
- 无限层级回复；
- 独立管理后台；
- AI 内容或图片审核。

有明确需求后再增加这些功能，不提前搭建扩展框架。

## 6. 身份验证与会话

### 6.1 GitHub OAuth

建议创建 OAuth App：

- Application name：`ermao.net Comments`
- Homepage URL：`https://www.ermao.net/`
- Callback URL：`https://www.ermao.net/api/comments/auth/github/callback`
- 不申请额外 scope；
- 不启用 Device Flow。

Worker 只保留 GitHub 数字用户 ID、用户名、头像和个人主页地址。GitHub Access Token 仅用于读取用户资料，完成后立即丢弃。

OAuth 使用一次性 `state` 和 PKCE。登录会话的原始 Token 只存于 `Secure`、`HttpOnly`、`SameSite=Lax` Cookie；D1 只保存 Token 哈希。

### 6.2 Turnstile

- 无图片评论：提交评论时验证 Turnstile Token。
- 有图片评论：申请上传会话时验证 Token；最终提交必须消费同一个一次性上传会话。
- Worker 验证 `success`、`hostname` 和 `action`。
- 过期、重复使用或与操作不匹配的 Token 一律拒绝。

## 7. Presigned URL 图片上传

### 7.1 上传流程

1. 已登录用户选择图片。
2. 浏览器缩放、压缩并清除图片元数据；服务端仍不信任客户端结果。
3. 浏览器提交 Turnstile Token、文章规范路径、图片数量和大小。
4. Worker 验证登录、Turnstile、频率和配额，创建绑定用户与文章的一次性上传会话。
5. Worker 为随机 `pending/{sessionId}/{uuid}.webp` Key 生成有效期 5 分钟的 Presigned `PUT` URL。
6. 浏览器按 Worker 指定的 `Content-Type` 直接上传到 R2 S3 API 地址。
7. 浏览器请求 Worker 确认上传。
8. Worker 通过 R2 Binding 检查对象大小、文件头、MIME、尺寸、校验值以及 EXIF/XMP 等元数据。
9. 验证通过后，将对象固化为新的 `comments/YYYY/MM/{uuid}-{hash}.webp` Key，并删除临时对象。
10. 最终提交评论时，D1 将已固化图片与评论关联，并使上传会话失效。

Presigned URL 在过期前可能被重复使用，因此未经确认的 Key 永远不作为正式公开对象。正式图片使用新的不可预测 Key，避免验证后的内容被覆盖。

### 7.2 默认限制

- 每条评论最多 3 张；
- 每张最大 3 MB；
- 每条评论图片总计最大 9 MB；
- 输入支持 JPEG、PNG、WebP；
- 新上传统一转换为 WebP；
- 最大宽高为 6000×6000；
- 拒绝 SVG、GIF、HEIC；
- 不使用用户原始文件名；
- Presigned URL 有效期 5 分钟；
- 未关联临时对象保留不超过 24 小时。

### 7.3 R2 安全边界

- Bucket 保持私有，不开放 R2 公共域名。
- 正式图片通过 `/api/comments/assets/{imageId}` 读取。
- Worker 只返回已经关联到可见评论的图片。
- 响应设置安全的 `Content-Type`、`X-Content-Type-Options: nosniff` 和可撤销的缓存策略。
- R2 S3 Access Key 仅授予该 Bucket 所需的对象读写权限，并只保存为 Worker Secret。
- CORS 只开放 `https://www.ermao.net`、`https://ermao.net` 和明确的本地开发地址，只允许上传所需的方法和请求头。
- Cron Trigger 定期删除超过 24 小时的 pending 对象和未关联孤儿对象，并记录失败以便重试。

## 8. D1 数据模型

计划使用以下表：

- `comment_users`：GitHub 用户资料；
- `comment_sessions`：登录会话哈希和过期时间；
- `comment_oauth_states`：一次性 OAuth state/PKCE；
- `comments`：正文、作者、文章路径、父评论和软删除状态；
- `comment_upload_sessions`：一次性上传会话、配额和消费状态；
- `comment_images`：R2 对象、校验值、状态及评论关联；
- `comment_moderation_log`：管理员操作审计。

GitHub 迁移数据以来源平台和来源 ID 建立唯一约束，确保全量或增量导入脚本可以安全重复运行。

## 9. 前端接入

- 关闭 Plume 内置 Giscus 配置。
- 在 VuePress 客户端注册自有异步 `CommentService`，继续使用主题现有评论插槽，不复制或修改整套主题。
- 复用站内已有的文章路径规范化逻辑，让中英文对应文章使用同一个评论数据键。
- 图片上传提供压缩状态、进度、错误提示、重试和移除操作。
- 保持键盘操作、焦点状态、表单标签和错误反馈等基本无障碍能力。

## 10. GitHub/Giscus 数据迁移

2026-08-08 的只读盘点结果：

- 72 个 Giscus Discussions；
- 327 条顶层评论；
- 225 条回复；
- 共 552 条评论和回复；
- 6 个 GitHub 托管图片附件。

迁移步骤：

1. 使用 GitHub GraphQL 游标导出全部 Discussions、评论和回复。
2. 将原始 JSONL、清单和校验值保存到私有 R2，作为可审计备份。
3. 转换并幂等写入 D1，保留作者、正文、时间、回复关系、原 Discussion URL 和来源 ID。
4. 下载 6 个历史图片附件，校验后写入正式 R2 路径并更新正文引用。
5. Giscus 在线期间执行第一次全量迁移。
6. 生产切换前执行一次增量迁移。
7. 切换后 24 至 48 小时再执行一次兜底增量迁移。

旧 Discussions 默认保留。是否锁定旧讨论在新系统稳定后另行决定。

## 11. 开发阶段与预计工期

预计共 6 至 8 个工作日：

1. D1 Schema、Worker API 和基础测试：1 天；
2. GitHub OAuth 与会话安全：1 天；
3. Turnstile、评论写入和权限控制：0.5 至 1 天；
4. Presigned URL、R2 校验固化、CORS 和孤儿清理：1.5 至 2 天；
5. VuePress 评论组件及响应式/暗色适配：1 至 2 天；
6. 基础管理操作：0.5 天；
7. GitHub 数据导出、转换和迁移演练：1 天；
8. 隔离预览、增量迁移、生产切换和回滚验证：0.5 至 1 天。

前后端和迁移工具可以部分交叉开发，因此阶段工时之和不等于总工期。

## 12. 验收条件

- 未登录用户能够分页阅读评论；
- GitHub 登录、退出和会话过期行为正确；
- Turnstile 成功、失败、过期和重放均得到正确处理；
- 发表、回复、编辑、软删除和管理隐藏符合权限；
- 正常图片可以上传、关联和读取；
- 超限、伪造 MIME、非法格式和异常尺寸被拒绝；
- 过期 Presigned URL 不可使用；
- 重复上传不能覆盖已确认的正式图片；
- pending 和孤儿对象能够自动清理；
- 历史评论数量、作者、时间和回复关系与导出结果一致；
- 中英文对应文章展示同一评论线程；
- 手机、桌面、亮色和暗色模式可用；
- D1 导出和 Time Travel 恢复流程经过演练；
- 回滚前端到 Giscus 后旧评论仍然可访问。

生产验收需要真实浏览器完成登录、Turnstile、评论和图片上传；构建通过或 Worker 返回健康状态不能替代真实交互验证。

## 13. 发布与回滚

1. 先部署到不影响生产页面的预览入口。
2. 完成本地测试、迁移演练和真实浏览器预览验证。
3. 经授权后创建生产资源并部署尚未被前端使用的 API。
4. 执行最终增量迁移。
5. 经单独授权后关闭 Giscus 前端并启用自有组件。
6. 切换后验证生产登录、发言、图片和历史数据。

发生问题时只回滚前端评论提供者到 Giscus；D1、R2 和迁移归档保留，不删除 GitHub Discussions。

## 14. 分工

### Codex 可以完成

- Worker、D1、R2、Presigned URL、OAuth、Turnstile 和清理任务代码；
- VuePress 评论组件及相关测试；
- GitHub 评论与图片导出、转换、幂等导入脚本；
- 本地和隔离预览验证；
- 经明确授权后的 Cloudflare 资源创建、部署、迁移、生产验证和回滚；
- 按后续讨论持续更新本计划。

### 站点所有者需要完成或授权

- 在正确的 GitHub 账号下创建 OAuth App；
- 安全写入 GitHub Client Secret、R2 S3 Secret 等凭证，不在聊天或仓库中传递明文；
- 提供或授权最小范围的 Worker、D1、R2、Turnstile 和 Zone Route 权限；
- 确认第 3 节中的可调整默认值；
- 分别批准生产资源创建、Secret 写入、正式迁移、前端切换和真实生产发言测试；
- 新系统稳定后决定是否锁定旧 GitHub Discussions。

## 15. 调整记录

- 2026-08-08：建立初始开发计划；确认评论图片使用 R2 Presigned URL 直传方案。

## 16. 参考资料

- [R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/)
- [Turnstile 服务端验证](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [GitHub OAuth Web Application Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub GraphQL Discussions](https://docs.github.com/en/graphql/reference/discussions)
- [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)
