import dotenv from "dotenv";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import R2Uploader, { UploadProgress } from "./lib/r2Uploader";

dotenv.config();

function requiredEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing environment variable: ${name}`);
    return v;
}

type ReleaseAsset = {
    name: string;
    browser_download_url: string;
    size: number;
    content_type?: string;
};

type LatestRelease = {
    tag_name: string;
    name?: string;
    assets: ReleaseAsset[];
    published_at?: string;
    draft?: boolean;
    prerelease?: boolean;
};

type OS = "windows" | "macos" | "linux";
type Arch = "x64" | "arm64";

interface Target {
    os: OS;
    arch: Arch;
}

const REPO = "clash-verge-rev/clash-verge-rev";
const DEST_PREFIX = "files/clash-verge-rev"; // 存储到 R2 的目录前缀

const PREFERRED_EXT: Record<OS, string[]> = {
    windows: [".exe", ".msi", ".zip"],
    macos: [".dmg", ".zip"],
    linux: [".AppImage", ".tar.gz", ".deb", ".rpm"],
};

const TARGETS: Target[] = [
    { os: "windows", arch: "x64" },
    { os: "windows", arch: "arm64" },
    { os: "macos", arch: "x64" },
    { os: "macos", arch: "arm64" },
    { os: "linux", arch: "x64" },
    { os: "linux", arch: "arm64" },
];

function createR2Client(): S3Client {
    const accountId = requiredEnv("R2_ACCOUNT_ID");
    const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
    const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    return new S3Client({
        region: "auto",
        endpoint,
        credentials: { accessKeyId, secretAccessKey },
    });
}

function normalizeArch(name: string): Arch | undefined {
    const s = name.toLowerCase();
    if (/(arm64|aarch64)/.test(s)) return "arm64";
    if (/(x64|amd64|x86_64)/.test(s)) return "x64";
    return undefined;
}

function detectOS(name: string): OS | undefined {
    const s = name.toLowerCase();
    if (/(windows|win)/.test(s)) return "windows";
    if (/(macos|darwin|mac|osx)/.test(s)) return "macos";
    if (/linux/.test(s)) return "linux";
    // 有些资产不带 os 关键词，但通过扩展名可以推断
    if (s.endsWith(".dmg")) return "macos";
    if (s.endsWith(".msi") || s.endsWith(".exe")) return "windows";
    if (s.endsWith(".appimage") || s.endsWith(".deb") || s.endsWith(".rpm")) return "linux";
    return undefined;
}

function getExt(name: string): string {
    // 处理 .tar.gz 等双扩展
    const lower = name.toLowerCase();
    if (lower.endsWith(".tar.gz")) return ".tar.gz";
    const idx = lower.lastIndexOf(".");
    return idx >= 0 ? name.slice(idx) : "";
}

function scoreByPreference(os: OS, ext: string): number {
    const list = PREFERRED_EXT[os];
    const idx = list.findIndex((e) => e.toLowerCase() === ext.toLowerCase());
    return idx >= 0 ? idx : 999; // 越小越优先
}

function pickBestAssets(assets: ReleaseAsset[]): Map<string, ReleaseAsset> {
    // 为每个 target(os+arch)选择一个最优资产
    const selected = new Map<string, ReleaseAsset>();

    for (const asset of assets) {
        const osDetected = detectOS(asset.name);
        const archDetected = normalizeArch(asset.name);
        if (!osDetected || !archDetected) continue;

        const key = `${osDetected}-${archDetected}`;
        const ext = getExt(asset.name);
        const score = scoreByPreference(osDetected, ext);

        const prev = selected.get(key);
        if (!prev) {
            selected.set(key, asset);
        } else {
            const prevScore = scoreByPreference(osDetected, getExt(prev.name));
            if (score < prevScore) selected.set(key, asset);
        }
    }

    // 为未命中但在 TARGETS 中的组合，不强行兜底（避免选错包），按需求可开启兜底策略
    return selected;
}

async function fetchLatestRelease(): Promise<LatestRelease> {
    const url = `https://api.github.com/repos/${REPO}/releases/latest`;
    const headers: Record<string, string> = {
        "User-Agent": "ermao.net-update-script",
        Accept: "application/vnd.github+json",
    };
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
        const text = await res.text();
        if (res.status === 403 && /rate limit/i.test(text)) {
            throw new Error(
                `GitHub API rate limited. 请设置 GITHUB_TOKEN 或 GH_TOKEN 环境变量再试。原始响应: ${text}`
            );
        }
        throw new Error(`GitHub API error ${res.status}: ${text}`);
    }
    return (await res.json()) as LatestRelease;
}

async function getRemoteLatestTag(s3: S3Client, bucket: string, key: string): Promise<string | null> {
    try {
        const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        const body = await obj.Body?.transformToString();
        return body?.trim() || null;
    } catch (e: any) {
        if (e?.$metadata?.httpStatusCode === 404) return null;
        return null;
    }
}

async function setRemoteLatestTag(s3: S3Client, bucket: string, key: string, tag: string) {
    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: tag,
            ContentType: "text/plain; charset=utf-8",
        })
    );
}

async function downloadToTemp(url: string, hintName: string): Promise<{ filePath: string; cleanup: () => Promise<void> }> {
    const res = await fetch(url, {
        headers: { "User-Agent": "ermao.net-update-script", Accept: "application/octet-stream" },
        redirect: "follow",
    } as any);
    if (!res.ok) {
        const t = await res.text();
        throw new Error(`Download failed ${res.status}: ${t}`);
    }

    const total = Number(res.headers.get("content-length") || 0);
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "clash-verge-"));
    const filePath = path.join(dir, hintName);
    const fileStream = createWriteStream(filePath);

    let transferred = 0;
    let lastLogged = -10;

    const nodeStream = Readable.fromWeb(res.body as any);
    nodeStream.on("data", (chunk) => {
        transferred += chunk.length;
        if (total > 0) {
            const pct = Math.floor((transferred / total) * 100);
            if (pct >= lastLogged + 10 || pct === 100) {
                console.log(`下载进度 ${hintName}: ${pct}% (${(transferred / 1_000_000).toFixed(1)}MB/${(total / 1_000_000).toFixed(1)}MB)`);
                lastLogged = pct;
            }
        }
    });

    await new Promise<void>((resolve, reject) => {
        nodeStream.on("error", reject);
        fileStream.on("error", reject);
        fileStream.on("finish", resolve);
        nodeStream.pipe(fileStream);
    });

    return { filePath, cleanup: () => fs.rm(dir, { recursive: true, force: true }) };
}

function buildDestFileName(os: OS, arch: Arch, srcName: string): string {
    const ext = getExt(srcName);
    const osLabel = os === "windows" ? "Windows" : os === "macos" ? "macOS" : "Linux";
    const archLabel = arch === "x64" ? "x64" : "arm64";
    return `Clash.Verge.${osLabel}.${archLabel}${ext}`;
}

function makeUploadProgressLogger(label: string) {
    let last = -10;
    return (p: UploadProgress) => {
        if (!p.total) return;
        const pct = Math.floor(p.percent);
        if (pct >= last + 10 || pct === 100) {
            console.log(`上传进度 ${label}: ${pct}% (${(p.transferred / 1_000_000).toFixed(1)}MB/${(p.total / 1_000_000).toFixed(1)}MB)`);
            last = pct;
        }
    };
}

async function main() {
    const bucket = requiredEnv("R2_BUCKET_NAME");
    const s3 = createR2Client();
    const versionKey = `${DEST_PREFIX}/.latest-tag`;

    const uploader = R2Uploader.fromEnv();
    const release = await fetchLatestRelease();
    if (release.draft) {
        console.log("最新版本是 draft，跳过。");
        return;
    }
    console.log(`最新版本: ${release.tag_name} (${release.name || ""})`);

    const remoteTag = await getRemoteLatestTag(s3, bucket, versionKey);
    if (remoteTag && remoteTag === release.tag_name) {
        console.log(`远端版本已是最新 (${remoteTag})，跳过上传。`);
        return;
    }

    const selected = pickBestAssets(release.assets);
    let uploaded = 0;
    let skipped = 0;

    for (const target of TARGETS) {
        const key = `${target.os}-${target.arch}`;
        const asset = selected.get(key);
        if (!asset) {
            console.log(`未找到资产: ${target.os}/${target.arch}`);
            continue;
        }

        const destName = buildDestFileName(target.os, target.arch, asset.name);
        const r2Key = `${DEST_PREFIX}/${destName}`;
        console.log(`处理 ${asset.name} -> ${r2Key}`);

        const { filePath, cleanup } = await downloadToTemp(asset.browser_download_url, asset.name);
        try {
            const url = await uploader.upload(filePath, r2Key, {
                onProgress: makeUploadProgressLogger(destName),
            });
            if (url) {
                // R2Uploader 内部会在相同内容时跳过上传
                console.log(`完成: ${url}`);
                uploaded++;
            } else {
                skipped++;
            }
        } finally {
            await cleanup();
        }
    }

    console.log(`完成。上传: ${uploaded}, 跳过(已存在且一致): ${skipped}`);

    if (uploaded > 0) {
        await setRemoteLatestTag(s3, bucket, versionKey, release.tag_name);
        console.log(`已记录最新版本标记: ${release.tag_name}`);
    }
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});

