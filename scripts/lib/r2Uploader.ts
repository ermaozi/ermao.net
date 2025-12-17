import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs/promises";
import { createReadStream } from "fs";
import crypto from "crypto";
import mime from "mime-types";

export interface R2Config {
  accountId?: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  endpoint?: string;
  region?: string; // default: auto
  customDomain?: string; // optional public domain
}

export interface UploadProgress {
  transferred: number;
  total: number;
  percent: number;
}

export interface UploadOptions {
  force?: boolean;
  onProgress?: (p: UploadProgress) => void;
  maxAttempts?: number;
  retryDelayMs?: number;
}

export class R2Uploader {
  private s3: S3Client;
  private bucket: string;
  private endpoint: string;
  private customDomain?: string;

  constructor(config: R2Config) {
    const endpoint =
      config.endpoint ||
      (config.accountId ? `https://${config.accountId}.r2.cloudflarestorage.com` : "");

    if (!endpoint) {
      throw new Error("R2Uploader requires either endpoint or accountId to be provided");
    }

    this.s3 = new S3Client({
      region: config.region || "auto",
      endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
    this.endpoint = endpoint;
    this.customDomain = config.customDomain;
  }

  static requiredEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing environment variable: ${name}`);
    return v;
  }

  static fromEnv(): R2Uploader {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = this.requiredEnv("R2_ACCESS_KEY_ID");
    const secretAccessKey = this.requiredEnv("R2_SECRET_ACCESS_KEY");
    const bucket = this.requiredEnv("R2_BUCKET_NAME");
    const customDomain = process.env.R2_CUSTOM_DOMAIN || undefined;
    const endpoint = accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : process.env.R2_ENDPOINT;

    return new R2Uploader({
      accountId,
      accessKeyId,
      secretAccessKey,
      bucket,
      endpoint,
      customDomain,
      region: "auto",
    });
  }

  private async calculateMD5AndSize(filePath: string): Promise<{ md5: string; size: number }> {
    const hashSum = crypto.createHash("md5");
    let size = 0;

    await new Promise<void>((resolve, reject) => {
      const stream = createReadStream(filePath);
      stream.on("data", (chunk) => {
        hashSum.update(chunk);
        size += chunk.length;
      });
      stream.on("end", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    return { md5: hashSum.digest("hex"), size };
  }

  private async isRemoteSame(key: string, localMD5: string): Promise<boolean> {
    try {
      const head = await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key })
      );
      const remoteETag = head.ETag?.replace(/"/g, "");
      return remoteETag === localMD5;
    } catch {
      return false;
    }
  }

  async upload(localFilePath: string, key: string, opts?: UploadOptions): Promise<string> {
    const force = !!opts?.force;
    const contentType = mime.lookup(localFilePath) || "application/octet-stream";
    const { md5: localMD5, size } = await this.calculateMD5AndSize(localFilePath);

    if (!force) {
      const same = await this.isRemoteSame(key, localMD5);
      if (same) {
        return this.buildPublicUrl(key);
      }
    }

    const maxAttempts = opts?.maxAttempts ?? 3;
    const retryDelayMs = opts?.retryDelayMs ?? 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      opts?.onProgress?.({ transferred: 0, total: size, percent: 0 });

      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: createReadStream(localFilePath),
          ContentType: contentType,
          ContentLength: size,
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024, // 5MB 分片
        leavePartsOnError: false,
      });

      upload.on("httpUploadProgress", (p) => {
        const total = p.total ?? size;
        const loaded = p.loaded ?? 0;
        const percent = total ? Math.min(100, (loaded / total) * 100) : 0;
        opts?.onProgress?.({ transferred: loaded, total, percent });
      });

      try {
        await upload.done();
        opts?.onProgress?.({ transferred: size, total: size, percent: 100 });
        return this.buildPublicUrl(key);
      } catch (err) {
        if (attempt >= maxAttempts) {
          throw err;
        }
        console.warn(`上传失败，准备重试 (${attempt}/${maxAttempts}): ${String(err)}`);
        await new Promise((r) => setTimeout(r, retryDelayMs));
      }
    }

    throw new Error("Upload failed after retries");
  }

  private buildPublicUrl(key: string): string {
    const cleanKey = key.replace(/^\//, "");
    if (this.customDomain) {
      const domain = this.customDomain.replace(/\/$/, "");
      return `${domain}/${cleanKey}`;
    }
    return `${this.endpoint}/${this.bucket}/${cleanKey}`;
  }
}

export default R2Uploader;
