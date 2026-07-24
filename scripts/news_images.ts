import crypto from "node:crypto";
import dns from "node:dns/promises";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";

const MAX_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 30_000;
const ARCHIVE_ROOT = path.resolve(process.env.NEWS_IMAGE_ARCHIVE_ROOT || ".news-archive/images");

const MIME_EXTENSIONS = new Map([
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

type RightsStatus = "approved" | "review-only";

interface DownloadOptions {
  url: string;
  date: string;
  eventKey: string;
  sourcePage: string;
  rights: RightsStatus;
  rightsBasis: string;
  alt: string;
  credit: string;
  dryRun: boolean;
}

function usage(exitCode = 2): never {
  console.error(
    [
      "Usage:",
      "  pnpm news:image:download -- --url <https-url> --date <YYYY-MM-DD>",
      "    --event-key <slug> --source-page <https-url>",
      "    --rights <approved|review-only> --rights-basis <text>",
      "    --alt <text> --credit <text> [--dry-run]",
    ].join("\n")
  );
  process.exit(exitCode);
}

function parseArgs(argv: string[]): DownloadOptions {
  argv = argv.filter((arg) => arg !== "--");

  if (argv.includes("--help") || argv.includes("-h")) {
    usage(0);
  }

  const values = new Map<string, string>();
  const allowed = new Set([
    "url",
    "date",
    "event-key",
    "source-page",
    "rights",
    "rights-basis",
    "alt",
    "credit",
  ]);
  let dryRun = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (!arg.startsWith("--")) usage();

    const name = arg.slice(2);
    if (!allowed.has(name)) throw new Error(`Unknown option: ${arg}`);

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) usage();
    values.set(name, value);
    index += 1;
  }

  const required = (name: string): string => {
    const value = values.get(name)?.trim();
    if (!value) throw new Error(`Missing required option: --${name}`);
    return value;
  };

  const rights = required("rights");
  if (rights !== "approved" && rights !== "review-only") {
    throw new Error("--rights must be approved or review-only");
  }

  const options: DownloadOptions = {
    url: required("url"),
    date: required("date"),
    eventKey: required("event-key"),
    sourcePage: required("source-page"),
    rights,
    rightsBasis: required("rights-basis"),
    alt: required("alt"),
    credit: required("credit"),
    dryRun,
  };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    throw new Error("--date must use YYYY-MM-DD");
  }
  const [dateYear, dateMonth, dateDay] = options.date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(dateYear, dateMonth - 1, dateDay));
  if (
    parsedDate.getUTCFullYear() !== dateYear ||
    parsedDate.getUTCMonth() + 1 !== dateMonth ||
    parsedDate.getUTCDate() !== dateDay
  ) {
    throw new Error("--date is invalid");
  }
  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(options.eventKey)) {
    throw new Error("--event-key must be a 2–80 character lowercase slug");
  }
  if (options.alt.length > 200 || options.credit.length > 200) {
    throw new Error("--alt and --credit must be 200 characters or fewer");
  }

  validateHttpsUrl(options.url, "--url");
  validateHttpsUrl(options.sourcePage, "--source-page");
  return options;
}

function validateHttpsUrl(value: string, option: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`${option} must be an HTTPS URL without embedded credentials`);
  }
  return url;
}

function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }

  const normalized = address.toLowerCase().split("%")[0];
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.")
  );
}

async function assertPublicHost(url: URL): Promise<void> {
  const hostname = url.hostname.toLowerCase();
  if (
    net.isIP(hostname) !== 0 ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error(`Unsafe image host: ${hostname}`);
  }

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error(`Image host does not resolve exclusively to public addresses: ${hostname}`);
  }
}

async function fetchImage(startUrl: string, signal: AbortSignal): Promise<Response> {
  let current = validateHttpsUrl(startUrl, "--url");

  for (let redirects = 0; redirects <= 5; redirects += 1) {
    await assertPublicHost(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal,
      headers: {
        Accept: "image/png,image/jpeg,image/webp,image/gif",
        "User-Agent": "ermao.net-news-archive/1.0",
      },
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return response;
    }

    const location = response.headers.get("location");
    await response.body?.cancel();
    if (!location) throw new Error(`Image redirect ${response.status} has no Location header`);
    current = validateHttpsUrl(new URL(location, current).toString(), "Redirect URL");
  }

  throw new Error("Image request exceeded five redirects");
}

function hasValidSignature(buffer: Buffer, contentType: string): boolean {
  if (contentType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (contentType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (contentType === "image/gif") {
    const signature = buffer.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (contentType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  return false;
}

async function readLimitedBody(response: Response): Promise<Buffer> {
  if (!response.body) throw new Error("Image response has no body");

  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of response.body as any) {
    const buffer = Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BYTES) {
      throw new Error(`Image exceeds ${MAX_BYTES} bytes`);
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const [year, month, day] = options.date.split("-");
  const eventDir = path.join(ARCHIVE_ROOT, year, month, day, options.eventKey);

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          status: "dry-run",
          eventDir,
          rights: options.rights,
          sourcePage: options.sourcePage,
          url: options.url,
        },
        null,
        2
      )
    );
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  let buffer: Buffer;
  try {
    response = await fetchImage(options.url, controller.signal);
    if (!response.ok) {
      throw new Error(`Image request failed: HTTP ${response.status}`);
    }

    const declaredLength = Number(response.headers.get("content-length") || "0");
    if (declaredLength > MAX_BYTES) {
      throw new Error(`Image exceeds ${MAX_BYTES} bytes`);
    }
    buffer = await readLimitedBody(response);
  } finally {
    clearTimeout(timeout);
  }

  validateHttpsUrl(response.url, "Final image URL");

  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() || "";
  const extension = MIME_EXTENSIONS.get(contentType);
  if (!extension) {
    throw new Error(`Unsupported or unsafe image content type: ${contentType || "missing"}`);
  }

  if (!hasValidSignature(buffer, contentType)) {
    throw new Error(`Image signature does not match ${contentType}`);
  }

  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const basename = sha256.slice(0, 16);
  const imagePath = path.join(eventDir, `${basename}${extension}`);
  const metadataPath = path.join(eventDir, `${basename}.json`);

  await fs.mkdir(eventDir, { recursive: true, mode: 0o700 });
  try {
    await fs.writeFile(imagePath, buffer, { flag: "wx", mode: 0o600 });
  } catch (error: any) {
    if (error?.code !== "EEXIST") throw error;
  }

  const metadata = {
    eventKey: options.eventKey,
    eventDate: options.date,
    localPath: path.relative(process.cwd(), imagePath),
    originalUrl: options.url,
    resolvedUrl: response.url,
    sourcePage: options.sourcePage,
    rightsStatus: options.rights,
    rightsBasis: options.rightsBasis,
    alt: options.alt,
    credit: options.credit,
    contentType,
    bytes: buffer.length,
    sha256,
    downloadedAt: new Date().toISOString(),
  };

  await fs.writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, {
    mode: 0o600,
  });

  console.log(
    JSON.stringify(
      {
        status: "saved",
        imagePath,
        metadataPath,
        rights: options.rights,
        sha256,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
