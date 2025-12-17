import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import mime from "mime-types";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import crypto from "crypto";

// 加载环境变量
dotenv.config();

// 读取必需的环境变量（并确保类型为 string）
function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

// ================= 配置区域 =================
// 请在 .env 文件中设置这些变量
const ACCOUNT_ID = requiredEnv("R2_ACCOUNT_ID");
const ACCESS_KEY_ID = requiredEnv("R2_ACCESS_KEY_ID");
const SECRET_ACCESS_KEY = requiredEnv("R2_SECRET_ACCESS_KEY");
const BUCKET_NAME = requiredEnv("R2_BUCKET_NAME");
const CUSTOM_DOMAIN = process.env.R2_CUSTOM_DOMAIN || ""; // 可为空
const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

// 扫描目录
const SCAN_DIR = "docs/blog"; 
// ===========================================

const s3 = new S3Client({
  region: "auto",
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// 计算文件 MD5
async function calculateMD5(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// 检查文件是否已存在于 R2 且内容一致
async function checkFileExistsAndMatch(key: string, localMD5: string): Promise<boolean> {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    // S3 ETag 通常被引号包围，如 "d41d8cd98f00b204e9800998ecf8427e"
    const remoteETag = head.ETag?.replace(/"/g, "");
    
    if (remoteETag === localMD5) {
      return true; // 存在且内容一致
    }
    return false; // 不存在或内容不一致
  } catch (error) {
    return false;
  }
}

async function uploadFile(filePath: string, key: string): Promise<string | null> {
  try {
    const fileContent = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";
    const localMD5 = await calculateMD5(filePath);

    // 检查是否需要上传
    const isMatch = await checkFileExistsAndMatch(key, localMD5);
    
    if (isMatch) {
        console.log(`跳过 (已存在且一致): ${key}`);
    } else {
        console.log(`正在上传: ${filePath} -> ${key}`);
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
          })
        );
    }

    if (CUSTOM_DOMAIN) {
        // 确保 CUSTOM_DOMAIN 不以 / 结尾，key 不以 / 开头
        const domain = CUSTOM_DOMAIN.replace(/\/$/, "");
        const cleanKey = key.replace(/^\//, "");
        return `${domain}/${cleanKey}`;
    } else {
        // R2 默认公开链接 (如果 bucket 是公开的)
        // 或者使用 endpoint 拼接，但通常 R2 需要自定义域名才能公开访问
        return `${ENDPOINT}/${BUCKET_NAME}/${key}`;
    }
  } catch (error) {
    console.error(`上传失败 ${filePath}:`, error);
    return null;
  }
}

async function processFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const parsed = matter(content);
  const permalink = parsed.data.permalink;

  if (!permalink) {
    console.log(`跳过 (无 permalink): ${filePath}`);
    return;
  }

  // 规范化 permalink 目录: /foo/bar/ -> foo/bar
  let targetDir = permalink.replace(/^\//, "").replace(/\/$/, "");
  if (targetDir === "") targetDir = "root"; // 根目录 fallback

  let newContent = content;
  let hasChanges = false;

  // 匹配 Markdown 图片: ![alt](url)
  // 也要匹配 HTML img 标签吗？暂时只匹配 Markdown 语法
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  
  // 使用 replace 的回调函数来处理异步替换比较麻烦，这里先收集所有需要替换的图片
  const replacements: { original: string; newUrl: string }[] = [];
  
  // 重新匹配以遍历
  const matches = [...content.matchAll(regex)];

  for (const m of matches) {
    const alt = m[1];
    const imgUrl = m[2];

    // 忽略网络图片
    if (imgUrl.startsWith("http") || imgUrl.startsWith("//")) {
      continue;
    }

    // 解析本地图片路径
    let localImgPath = "";
    const potentialPaths: string[] = [];
    
    // 处理可能存在的 title，例如: image.png "title"
    const cleanImgUrl = imgUrl.split(" ")[0];

    if (cleanImgUrl.startsWith("/")) {
      // 1. 尝试作为绝对路径 (相对于 docs/)
      potentialPaths.push(path.join(process.cwd(), "docs", cleanImgUrl));
      // 2. 尝试作为绝对路径 (相对于 docs/.vuepress/public/)
      potentialPaths.push(path.join(process.cwd(), "docs/.vuepress/public", cleanImgUrl));
      // 3. 尝试作为相对路径 (去掉开头的 /，相对于当前 md 文件) - 解决用户提到的"少了一层目录"问题
      potentialPaths.push(path.resolve(path.dirname(filePath), cleanImgUrl.replace(/^\//, "")));
    } else {
      // 1. 尝试作为相对路径
      potentialPaths.push(path.resolve(path.dirname(filePath), cleanImgUrl));
      // 2. 尝试作为绝对路径 (相对于 docs/)
      potentialPaths.push(path.join(process.cwd(), "docs", cleanImgUrl));
    }

    let found = false;
    for (const p of potentialPaths) {
      try {
        await fs.access(p);
        localImgPath = p;
        found = true;
        break;
      } catch (e) {
        // continue
      }
    }

    if (!found) {
      console.warn(`图片不存在 (跳过): ${cleanImgUrl} (in ${filePath})`);
      continue;
    }

    // 生成 R2 Key
    const ext = path.extname(localImgPath);
    const filename = path.basename(localImgPath);
    // 为了防止重名覆盖，可以加 hash，或者保持原文件名（用户需求似乎倾向于简单）
    // 这里使用: permalink目录/文件名
    const r2Key = `${targetDir}/${filename}`;

    // 上传
    const remoteUrl = await uploadFile(localImgPath, r2Key);

    if (remoteUrl) {
      replacements.push({
        original: m[0], // ![alt](url)
        newUrl: `![${alt}](${remoteUrl})`,
      });
    }
  }

  // 执行替换
  if (replacements.length > 0) {
    for (const rep of replacements) {
      // 简单的字符串替换可能会误伤（如果有完全相同的引用），但通常没问题
      // 更严谨的方法是基于索引替换，但需要倒序处理
      // 这里简单 replaceAll
      newContent = newContent.split(rep.original).join(rep.newUrl);
    }
    
    await fs.writeFile(filePath, newContent, "utf-8");
    console.log(`已更新: ${filePath} (${replacements.length} 张图片)`);
  }
}

async function main() {
  console.log("开始扫描 Markdown 文件...");
  // 扫描 docs 下所有 md 文件
  const files = await glob(`${SCAN_DIR}/**/*.md`, { ignore: "**/node_modules/**" });
  
  console.log(`找到 ${files.length} 个文件。`);

  for (const file of files) {
    await processFile(file);
  }
  
  console.log("处理完成!");
}

main().catch(console.error);
