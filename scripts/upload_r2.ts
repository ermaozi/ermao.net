import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import dotenv from "dotenv";
import R2Uploader from "./lib/r2Uploader";
import crypto from "crypto";
import exifr from "exifr";

// 加载环境变量
dotenv.config();

// 扫描目录
const SCAN_DIR = "docs/blog"; 
// ===========================================
const uploader = R2Uploader.fromEnv();

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

    // 生成 R2 Key: 使用 图片日期 + 哈希前6位
    const ext = path.extname(localImgPath);
    // 读取文件并计算哈希
    const buf = await fs.readFile(localImgPath);
    const hash6 = crypto.createHash("sha256").update(buf).digest("hex").slice(0, 6);

    // 优先尝试读取 EXIF 日期（DateTimeOriginal），回退到文件 mtime
    let date: Date | null = null;
    try {
      const exif = await exifr.parse(buf as any);
      const exifDate = (exif && (exif.DateTimeOriginal || (exif as any).CreateDate || (exif as any).ModifyDate)) as any;
      if (exifDate) {
        date = exifDate instanceof Date ? exifDate : new Date(exifDate);
      }
    } catch (e) {
      // 忽略 EXIF 解析错误
    }

    if (!date) {
      const stat = await fs.stat(localImgPath);
      date = stat.mtime;
    }

    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(
      date.getHours()
    )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

    const newFilename = `${dateStr}-${hash6}${ext}`;
    const r2Key = `images/${targetDir}/${newFilename}`;

    // 上传
    let remoteUrl: string | null = null;
    try {
      remoteUrl = await uploader.upload(localImgPath, r2Key);
      // 控制台输出与原逻辑一致的提示
      console.log(`已上传或已存在: ${localImgPath} -> ${r2Key}`);
    } catch (e) {
      console.error(`上传失败 ${localImgPath}:`, e);
      remoteUrl = null;
    }

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
