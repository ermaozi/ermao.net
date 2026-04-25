#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(root, "..");

const sourceTableFile = path.join(root, "docs/blog/机场推荐/vpn.md");
const pyjichangDir = path.join(workspaceRoot, "pyjichang.com/src/vpnrecs");
const ermaoOrgTableFile = path.join(workspaceRoot, "ermao.org/src/content/blog/vpn-recommendation.md");
const ermaoziTableFile = path.join(workspaceRoot, "ermaozi.org/src/data/blog/vpn-recommendation.md");
const monthlySyncDir = path.join(root, ".github/monthly-sync");
const monthlyRecordDir = path.join(monthlySyncDir, "records");

const aliasMap = new Map([
  ["xx云", "xxyun"],
  ["cyberguard", "cyberguard"],
  ["xsus", "xsus"],
  ["tnt", "tnt"],
  ["runway", "runway"],
  ["danke", "danke"],
  ["ssone", "ssone"],
  ["flybit", "flybit"],
  ["superbiu", "superbiu"],
  ["uuone", "uuone"],
  ["xxyun", "xxyun"],
]);

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [key, value] = arg.slice(2).split("=");
    args[key] = value ?? true;
  }
  return args;
}

function normalizeName(name) {
  const lowered = name.trim().toLowerCase().replace(/\s+/g, "");
  return aliasMap.get(lowered) ?? lowered;
}

function uniqueSorted(items) {
  return [...new Set(items)].sort((left, right) => left.localeCompare(right, "zh-Hans-CN"));
}

function extractTableNames(markdown) {
  const names = [];
  const regex = /^\|\[([^\]]+)\]\(#/gm;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    names.push(match[1]);
  }
  return uniqueSorted(names);
}

function extractPyjichangNames() {
  const files = readdirSync(pyjichangDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .filter((name) => name.startsWith("机场推荐"));

  return uniqueSorted(
    files.map((name) => name.replace(/^机场推荐/, "").replace(/\.md$/, "")),
  );
}

function toNormalizedSet(items) {
  return new Set(items.map(normalizeName));
}

function findMissing(sourceNames, targetNames) {
  const targetSet = toNormalizedSet(targetNames);
  return sourceNames.filter((name) => !targetSet.has(normalizeName(name)));
}

function runGit(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

function extractRecentCandidates(since) {
  if (!since) return [];

  let hashes = [];
  try {
    const output = runGit(["log", `--since=${since}`, "--format=%H", "--", "docs/blog/机场推荐/vpn.md"]);
    hashes = output.split("\n").map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }

  const found = [];
  for (const hash of hashes) {
    const diff = runGit(["show", "--format=", "--unified=0", hash, "--", "docs/blog/机场推荐/vpn.md"]);
    const rowRegex = /^\+\|\[([^\]]+)\]\(#/gm;
    const headingRegex = /^\+###\s+(.+)$/gm;
    let match;
    while ((match = rowRegex.exec(diff)) !== null) {
      found.push(match[1]);
    }
    while ((match = headingRegex.exec(diff)) !== null) {
      found.push(match[1].trim());
    }
  }

  return uniqueSorted(found.filter((name) => !["---", "什么是VPN和机场？如何选择科学上网工具？"].includes(name)));
}

function printList(title, items) {
  console.log(`\n${title}`);
  if (items.length === 0) {
    console.log("- 无");
    return;
  }
  for (const item of items) {
    console.log(`- ${item}`);
  }
}

function printChecklist(names) {
  console.log("\n建议复制到月度清单的表格：\n");
  console.log("| 机场名 | 来源状态 | pyjichang.com | ermao.org | ermaozi.org | 备注 |");
  console.log("|---|---|---|---|---|---|");
  for (const name of names) {
    console.log(`| ${name} | 待确认 | 待同步 | 待同步 | 待同步 | |`);
  }
}

function resolveRecordFile(args, since) {
  if (typeof args["record-file"] === "string" && args["record-file"].trim()) {
    const customPath = args["record-file"].trim();
    return path.isAbsolute(customPath) ? customPath : path.join(root, customPath);
  }

  const fallbackMonth = new Date().toISOString().slice(0, 7);
  const month = since ? since.slice(0, 7) : fallbackMonth;
  return path.join(monthlyRecordDir, `${month}.md`);
}

function buildChecklistTable(names) {
  const lines = [
    "| 机场名 | 来源状态 | pyjichang.com | ermao.org | ermaozi.org | 备注 |",
    "|---|---|---|---|---|---|",
  ];
  for (const name of names) {
    lines.push(`| ${name} | 待确认 | 待同步 | 待同步 | 待同步 | |`);
  }
  return lines.join("\n");
}

function buildRecordMarkdown({
  recordMonth,
  since,
  sourceNames,
  pyjichangNames,
  ermaoOrgNames,
  ermaoziNames,
  recentCandidates,
  missingInPyjichang,
  missingInErmaoOrg,
  missingInErmaozi,
  suggested,
}) {
  const listOrNone = (items) => {
    if (items.length === 0) return "- 无";
    return items.map((item) => `- ${item}`).join("\n");
  };

  return `# ${recordMonth} 月度同步记录

## 基本信息

- 月份：${recordMonth}
- 扫描起点：${since || "未指定"}
- 扫描时间：${new Date().toISOString()}
- 主站总表：[docs/blog/机场推荐/vpn.md](../../../docs/blog/机场推荐/vpn.md)

## 统计摘要

- 主站总表数量：${sourceNames.length}
- pyjichang.com 已有文章数量：${pyjichangNames.length}
- ermao.org 总表数量：${ermaoOrgNames.length}
- ermaozi.org 总表数量：${ermaoziNames.length}

## 近期候选（主站 git 增量）

${listOrNone(recentCandidates)}

## 缺失项

### pyjichang.com 缺失

${listOrNone(missingInPyjichang)}

### ermao.org 总表缺失

${listOrNone(missingInErmaoOrg)}

### ermaozi.org 总表缺失

${listOrNone(missingInErmaozi)}

## 本期建议同步清单

${buildChecklistTable(suggested)}

## 给 AI 的执行输入

\`\`\`text
请按月度站点同步流程执行。本期扫描起点是 ${since || `${recordMonth}-01`}，建议优先处理以下机场：
${suggested.map((name) => `- ${name}`).join("\n") || "- 无"}

要求：
1. 主站 ermao.net 为唯一事实源。
2. 同步到 pyjichang.com、ermao.org、ermaozi.org。
3. 三站文章结构不同，避免雷同。
4. 更新对应总表。
5. 完成后给出已同步项、修改文件和校验结果。
\`\`\`
`;
}

function writeRecordFile(args, since, payload) {
  if (!args.record) return null;

  const recordFile = resolveRecordFile(args, since);
  mkdirSync(path.dirname(recordFile), { recursive: true });

  const recordMonth = path.basename(recordFile, ".md");
  const content = buildRecordMarkdown({ recordMonth, since, ...payload });
  writeFileSync(recordFile, content, "utf8");

  return recordFile;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const since = typeof args.since === "string" ? args.since : "";

  const sourceTable = readFileSync(sourceTableFile, "utf8");
  const ermaoOrgTable = readFileSync(ermaoOrgTableFile, "utf8");
  const ermaoziTable = readFileSync(ermaoziTableFile, "utf8");

  const sourceNames = extractTableNames(sourceTable);
  const pyjichangNames = extractPyjichangNames();
  const ermaoOrgNames = extractTableNames(ermaoOrgTable);
  const ermaoziNames = extractTableNames(ermaoziTable);

  const missingInPyjichang = findMissing(sourceNames, pyjichangNames);
  const missingInErmaoOrg = findMissing(sourceNames, ermaoOrgNames);
  const missingInErmaozi = findMissing(sourceNames, ermaoziNames);
  const recentCandidates = extractRecentCandidates(since);

  console.log("月度同步扫描结果");
  console.log(`源站总表数量: ${sourceNames.length}`);
  console.log(`pyjichang.com 已有文章数量: ${pyjichangNames.length}`);
  console.log(`ermao.org 总表数量: ${ermaoOrgNames.length}`);
  console.log(`ermaozi.org 总表数量: ${ermaoziNames.length}`);
  if (since) {
    console.log(`扫描起点: ${since}`);
  }

  printList("近期候选（来自主站 git 增量）", recentCandidates);
  printList("pyjichang.com 缺失", missingInPyjichang);
  printList("ermao.org 总表缺失", missingInErmaoOrg);
  printList("ermaozi.org 总表缺失", missingInErmaozi);

  const suggested = uniqueSorted([
    ...recentCandidates,
    ...missingInPyjichang,
    ...missingInErmaoOrg,
    ...missingInErmaozi,
  ]);

  printChecklist(suggested);

  const recordFile = writeRecordFile(args, since, {
    sourceNames,
    pyjichangNames,
    ermaoOrgNames,
    ermaoziNames,
    recentCandidates,
    missingInPyjichang,
    missingInErmaoOrg,
    missingInErmaozi,
    suggested,
  });

  if (recordFile) {
    console.log(`\n已写入月度记录: ${path.relative(root, recordFile)}`);
  }
}

main();