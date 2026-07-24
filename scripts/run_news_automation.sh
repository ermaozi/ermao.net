#!/usr/bin/env bash

set -Eeuo pipefail

export PATH="/home/emz/.npm-global/bin:/usr/local/bin:/usr/bin:/bin"
export TZ="Asia/Shanghai"

umask 077

REPO_ROOT="/home/emz/ermao.net"
CODEX_BIN="/home/emz/.npm-global/bin/codex"
ARCHIVE_ROOT="${REPO_ROOT}/.news-archive"
LOG_DIR="${ARCHIVE_ROOT}/logs"
LOCK_DIR="${ARCHIVE_ROOT}/locks"
MODE="${1:-}"
DRY_RUN="${2:-}"

usage() {
  echo "Usage: $0 daily|weekly [--dry-run]" >&2
  exit 2
}

if [[ "${MODE}" != "daily" && "${MODE}" != "weekly" ]]; then
  usage
fi

if [[ -n "${DRY_RUN}" && "${DRY_RUN}" != "--dry-run" ]]; then
  usage
fi

if [[ ! -x "${CODEX_BIN}" ]]; then
  echo "Codex CLI not found or not executable: ${CODEX_BIN}" >&2
  exit 1
fi

mkdir -p "${LOG_DIR}" "${LOCK_DIR}"

RUN_ID="$(date '+%Y-%m-%d-%H%M%S')"
LOG_FILE="${LOG_DIR}/${MODE}-${RUN_ID}.log"
SUMMARY_FILE="${LOG_DIR}/${MODE}-${RUN_ID}-summary.txt"
LOCK_FILE="${LOCK_DIR}/news-automation.lock"

exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  echo "[$(date --iso-8601=seconds)] Another news automation run is active; skipping ${MODE}."
  exit 0
fi

if [[ "${MODE}" == "daily" ]]; then
  TARGET_DATE="$(date '+%F')"
  PROMPT="使用 \$publish-censorship-weekly 执行每日新闻采集。目标日期是 ${TARGET_DATE}，时区 Asia/Shanghai。搜索技能规定的六条选题线，核验、评分、去重后合并保存到本地 .news-archive；对有解释价值的图片按 image-contract 使用 pnpm news:image:download 保存图片和授权元数据，只保存在本地，不上传 R2。当前是夜间定时运行；若当天尚未完整结束，按契约标记 partial，不要虚报完整覆盖。不要生成周报，不要发布、提交或推送。"
else
  WINDOW_END="$(date -d 'yesterday' '+%F')"
  WINDOW_START="$(date -d "${WINDOW_END} -6 days" '+%F')"
  PROMPT="使用 \$publish-censorship-weekly 执行周五自动周报。报告窗口固定为 ${WINDOW_START} 至 ${WINDOW_END}，时区 Asia/Shanghai，即七个已经结束的自然日。读取这七天的本地记录，补采缺失或实质 partial 的日期，重新核验来源并按技能评分筛选，生成“跨境网络与 AI 服务周报”可审核草稿。仅选择 image-contract 标记为 approved 的本地图片；若草稿选用了本地图片，运行 pnpm r2 -- <文章路径>，使用 scripts/upload_r2.ts 上传所选图片并把 Markdown 改写为 R2 URL，确认文章中没有本地图片路径后再运行 pnpm build；没有 approved 图片则明确记录并跳过 R2。严格使用文章契约中的日期范围文件名和以 ${WINDOW_END} 为结束日期的 permalink；如果同一窗口文章已存在则不要重复创建。检查 diff，但不要发布、提交或推送。"
fi

if [[ "${DRY_RUN}" == "--dry-run" ]]; then
  printf 'mode=%s\nlog=%s\nsummary=%s\nprompt=%s\n' \
    "${MODE}" "${LOG_FILE}" "${SUMMARY_FILE}" "${PROMPT}"
  exit 0
fi

exec >>"${LOG_FILE}" 2>&1

echo "[$(date --iso-8601=seconds)] Starting ${MODE} news automation."

"${CODEX_BIN}" \
  --search \
  --sandbox workspace-write \
  --ask-for-approval never \
  -c "sandbox_workspace_write.network_access=true" \
  -C "${REPO_ROOT}" \
  exec \
  --ephemeral \
  --color never \
  --output-last-message "${SUMMARY_FILE}" \
  "${PROMPT}"

echo "[$(date --iso-8601=seconds)] Completed ${MODE} news automation."
