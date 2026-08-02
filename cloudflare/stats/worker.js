/*
  Module-format Cloudflare Worker for vuepress-plugin-stats.
  Uses `env.VIEWS_DB` (D1) or `env.VIEWS_KV` as fallback.
*/

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const STATS_CACHE_VERSION = 'v5';
const COMPARABLE_PERIODS = new Set(['24h', '7d', '30d']);
const PRIVATE_STATS_HOSTS = new Set(['ermao.net', 'www.ermao.net']);

const getCorsHeaders = (request) => {
  const origin = request.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  }
}

const LIKE_COOKIE_NAME = '__Host-ermao_like_id';
const LIKE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const LIKE_NETWORK_DAILY_LIMIT = 50;
const LIKE_TOP_CACHE_KEY = 'article-likes:top:v2';
const LIKE_ALLOWED_ORIGINS = new Set([
  'https://www.ermao.net',
  'https://ermao.net'
]);
const ARTICLE_PATH_PREFIXES = [
  '/article/',
  '/blog/',
  '/news/',
  '/posts/',
  '/scamvpn/'
];
const ARTICLE_PATH_EXCLUSIONS = [
  '/blog/',
  '/blog/archives/',
  '/blog/categories/',
  '/blog/tags/'
];

const isLikeApiPath = (path) =>
  path === '/api/likes'
  || path === '/api/likes/status'
  || path === '/api/likes/top'
  || path === '/api/engagement';

const resolveStatsRoutePath = (method, path) => {
  if (path === '/stats/api') return method === 'GET' ? '/stats' : path;
  if (path === '/api/stats') return method === 'POST' ? '/' : path;
  if (!path.startsWith('/api/stats/')) return path;

  const suffix = path.slice('/api/stats'.length);
  return suffix === '/engagement' || suffix.startsWith('/likes')
    ? `/api${suffix}`
    : suffix;
};

const isAllowedLikeOrigin = (origin) => {
  if (!origin) return true;
  if (LIKE_ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1');
  } catch {
    return false;
  }
};

const getLikeCorsHeaders = (request) => {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Ermao-Visitor',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff'
  };

  if (origin && isAllowedLikeOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
};

const jsonResponse = (data, status, corsHeaders, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });

const parseCookie = (request, name) => {
  const cookieHeader = request.headers.get('Cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return '';
    }
  }
  return '';
};

const isValidVisitorId = (value) =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{20,128}$/.test(value);

const createVisitorId = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
};

const hmacHex = async (secret, value) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('');
};

const getLikeIdentity = async (request, env) => {
  const secret = env.LIKE_ID_SECRET;
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('LIKE_ID_SECRET is not configured');
  }

  const cookieId = parseCookie(request, LIKE_COOKIE_NAME);
  const fallbackId = request.headers.get('X-Ermao-Visitor') || '';
  const visitorId = isValidVisitorId(cookieId)
    ? cookieId
    : isValidVisitorId(fallbackId)
      ? fallbackId
      : createVisitorId();

  return {
    visitorHash: await hmacHex(secret, `visitor:${visitorId}`),
    setCookie: isValidVisitorId(cookieId)
      ? ''
      : `${LIKE_COOKIE_NAME}=${encodeURIComponent(visitorId)}; Path=/; Max-Age=${LIKE_COOKIE_MAX_AGE}; Secure; HttpOnly; SameSite=Lax`
  };
};

const getShanghaiDay = (timestamp = Date.now()) =>
  new Date(timestamp + 8 * HOUR_MS).toISOString().slice(0, 10);

const normalizeStatsPath = (rawPath) => {
  if (typeof rawPath !== 'string' || !rawPath.startsWith('/') || rawPath.length > 255) {
    return '';
  }

  let path;
  try {
    path = new URL(rawPath, 'https://www.ermao.net').pathname;
  } catch {
    return '';
  }

  path = path.replace(/\/{2,}/g, '/');
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) path = path.slice(3);
  return path || '/';
};

const getStatsPathVariants = (path) =>
  path === '/' ? ['/', '/en/', '/en'] : [path, `/en${path}`];

const normalizeArticlePath = (rawPath) => {
  let path = normalizeStatsPath(rawPath);
  if (!path) return '';
  if (!path.endsWith('/')) path += '/';

  if (!ARTICLE_PATH_PREFIXES.some(prefix => path.startsWith(prefix))) return '';
  if (ARTICLE_PATH_EXCLUSIONS.includes(path)) return '';
  if (path.includes('/page/')) return '';

  return path;
};

const getLikeCount = async (env, path) => {
  const row = await env.VIEWS_DB
    .prepare('SELECT count FROM article_like_counts WHERE path = ?')
    .bind(path)
    .first();
  return Number(row?.count || 0);
};

const invalidateLikeTopCache = async (env) => {
  if (!env.VIEWS_KV) return;
  try {
    await env.VIEWS_KV.delete(LIKE_TOP_CACHE_KEY);
  } catch (error) {
    console.error('Like ranking cache invalidation failed:', error);
  }
};

const queryEngagementItems = async (env, paths, visitorHash, likeDay) => {
  const result = await env.VIEWS_DB.prepare(`
    WITH requested(position, path) AS (
      SELECT CAST(key AS INTEGER), CAST(value AS TEXT)
      FROM json_each(?)
    )
    SELECT
      requested.path,
      COALESCE((
        SELECT SUM(page_counts.count)
        FROM page_counts
        WHERE page_counts.path = requested.path
           OR page_counts.path = CASE
             WHEN requested.path = '/' THEN '/en/'
             ELSE '/en' || requested.path
           END
           OR (requested.path = '/' AND page_counts.path = '/en')
      ), 0) AS view_count,
      COALESCE((
        SELECT article_like_counts.count
        FROM article_like_counts
        WHERE article_like_counts.path = requested.path
      ), 0) AS like_count,
      EXISTS(
        SELECT 1
        FROM article_likes
        WHERE article_likes.path = requested.path
          AND article_likes.visitor_hash = ?
          AND article_likes.like_day = ?
      ) AS liked_today
    FROM requested
    ORDER BY requested.position
  `).bind(JSON.stringify(paths), visitorHash, likeDay).all();

  return (result.results || []).map(row => ({
    path: row.path,
    views: Number(row.view_count || 0),
    count: Number(row.like_count || 0),
    likedToday: Boolean(row.liked_today),
    likeDay
  }));
};

const handleEngagementBatch = async (request, env, corsHeaders) => {
  if (!env.VIEWS_DB) {
    return jsonResponse({ error: '文章统计服务暂不可用' }, 503, corsHeaders);
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body?.paths) || body.paths.length === 0 || body.paths.length > 20) {
      return jsonResponse({ error: '文章地址数量必须在 1 到 20 之间' }, 400, corsHeaders);
    }

    const paths = Array.from(new Set(body.paths.map(rawPath =>
      normalizeArticlePath(rawPath) || normalizeStatsPath(rawPath)
    )));
    if (paths.some(path => !path) || paths.length === 0) {
      return jsonResponse({ error: '文章地址无效' }, 400, corsHeaders);
    }

    const identity = await getLikeIdentity(request, env);
    const likeDay = getShanghaiDay();
    const items = await queryEngagementItems(env, paths, identity.visitorHash, likeDay);
    const extraHeaders = { 'Cache-Control': 'private, no-store' };
    if (identity.setCookie) extraHeaders['Set-Cookie'] = identity.setCookie;
    return jsonResponse({ items }, 200, corsHeaders, extraHeaders);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonResponse({ error: '请求数据无效' }, 400, corsHeaders);
    }
    console.error('Engagement batch failed:', error);
    return jsonResponse({ error: '文章统计服务尚未配置完成' }, 503, corsHeaders);
  }
};

const handleLikeStatus = async (request, env, corsHeaders, url) => {
  if (!env.VIEWS_DB) {
    return jsonResponse({ error: '点赞服务暂不可用' }, 503, corsHeaders);
  }

  const path = normalizeArticlePath(url.searchParams.get('path'));
  if (!path) {
    return jsonResponse({ error: '文章地址无效' }, 400, corsHeaders);
  }

  try {
    const identity = await getLikeIdentity(request, env);
    const likeDay = getShanghaiDay();
    const [item] = await queryEngagementItems(env, [path], identity.visitorHash, likeDay);
    const extraHeaders = {
      'Cache-Control': 'private, no-store'
    };
    if (identity.setCookie) extraHeaders['Set-Cookie'] = identity.setCookie;

    return jsonResponse(item, 200, corsHeaders, extraHeaders);
  } catch (error) {
    console.error('Like status failed:', error);
    return jsonResponse({ error: '点赞服务尚未配置完成' }, 503, corsHeaders);
  }
};

const handleLikeTop = async (env, ctx, corsHeaders, url) => {
  if (!env.VIEWS_DB) {
    return jsonResponse({ error: '点赞服务暂不可用' }, 503, corsHeaders);
  }

  const requestedLimit = Number.parseInt(url.searchParams.get('limit') || '6', 10);
  const limit = Math.min(Math.max(Number.isFinite(requestedLimit) ? requestedLimit : 6, 1), 15);

  try {
    let items = null;
    if (env.VIEWS_KV) {
      items = await env.VIEWS_KV.get(LIKE_TOP_CACHE_KEY, { type: 'json' });
    }

    if (!Array.isArray(items)) {
      const { results } = await env.VIEWS_DB
        .prepare('SELECT path, count FROM article_like_counts WHERE count > 0 ORDER BY count DESC, updated_at DESC LIMIT 15')
        .all();
      items = results || [];

      if (env.VIEWS_KV) {
        ctx.waitUntil(
          env.VIEWS_KV.put(LIKE_TOP_CACHE_KEY, JSON.stringify(items), { expirationTtl: 120 })
        );
      }
    }

    return jsonResponse(items.slice(0, limit), 200, corsHeaders, {
      'Cache-Control': 'public, max-age=30, s-maxage=120'
    });
  } catch (error) {
    console.error('Like ranking failed:', error);
    return jsonResponse({ error: '点赞排行暂不可用' }, 503, corsHeaders);
  }
};

const handleLikePost = async (request, env, corsHeaders) => {
  if (!env.VIEWS_DB) {
    return jsonResponse({ error: '点赞服务暂不可用' }, 503, corsHeaders);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ error: '请求格式无效' }, 415, corsHeaders);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 2048) {
    return jsonResponse({ error: '请求内容过大' }, 413, corsHeaders);
  }

  try {
    const data = await request.json();
    const path = normalizeArticlePath(data?.path);
    if (!path) {
      return jsonResponse({ error: '文章地址无效' }, 400, corsHeaders);
    }

    const ua = request.headers.get('User-Agent') || '';
    if (isBot(ua)) {
      return jsonResponse({ error: '自动化请求不能点赞' }, 403, corsHeaders);
    }

    const identity = await getLikeIdentity(request, env);
    const now = Date.now();
    const likeDay = getShanghaiDay(now);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const networkDayHash = await hmacHex(env.LIKE_ID_SECRET, `network:${likeDay}:${ip}`);
    const existing = await env.VIEWS_DB
      .prepare('SELECT 1 AS liked FROM article_likes WHERE path = ? AND visitor_hash = ? AND like_day = ? LIMIT 1')
      .bind(path, identity.visitorHash, likeDay)
      .first();

    const extraHeaders = {
      'Cache-Control': 'private, no-store'
    };
    if (identity.setCookie) extraHeaders['Set-Cookie'] = identity.setCookie;

    if (existing) {
      const count = await getLikeCount(env, path);
      return jsonResponse(
        { path, count, likedToday: true, created: false, likeDay },
        200,
        corsHeaders,
        extraHeaders
      );
    }

    const networkUsage = await env.VIEWS_DB
      .prepare('SELECT COUNT(*) AS count FROM article_likes WHERE network_day_hash = ? AND like_day = ?')
      .bind(networkDayHash, likeDay)
      .first();
    if (Number(networkUsage?.count || 0) >= LIKE_NETWORK_DAILY_LIMIT) {
      return jsonResponse(
        { error: '当前网络今天的点赞次数已达上限，请明天再试' },
        429,
        corsHeaders,
        { ...extraHeaders, 'Retry-After': '3600' }
      );
    }

    const results = await env.VIEWS_DB.batch([
      env.VIEWS_DB
        .prepare(
          'INSERT OR IGNORE INTO article_likes (path, visitor_hash, network_day_hash, like_day, created_at, country) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .bind(
          path,
          identity.visitorHash,
          networkDayHash,
          likeDay,
          now,
          request.cf?.country || ''
        ),
      env.VIEWS_DB
        .prepare('SELECT count FROM article_like_counts WHERE path = ?')
        .bind(path)
    ]);

    const inserted = Number(results[0]?.meta?.changes || results[0]?.meta?.rows_written || 0) > 0;
    const count = Number(results[1]?.results?.[0]?.count || 0);
    if (inserted) await invalidateLikeTopCache(env);

    return jsonResponse(
      { path, count, likedToday: true, created: inserted, likeDay },
      inserted ? 201 : 200,
      corsHeaders,
      extraHeaders
    );
  } catch (error) {
    console.error('Like request failed:', error);
    const message = error instanceof SyntaxError ? '请求格式无效' : '点赞服务尚未配置完成';
    const status = error instanceof SyntaxError ? 400 : 503;
    return jsonResponse({ error: message }, status, corsHeaders);
  }
};

const handleLikeDelete = async (request, env, corsHeaders) => {
  if (!env.VIEWS_DB) {
    return jsonResponse({ error: '点赞服务暂不可用' }, 503, corsHeaders);
  }

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return jsonResponse({ error: '请求格式无效' }, 415, corsHeaders);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 2048) {
    return jsonResponse({ error: '请求内容过大' }, 413, corsHeaders);
  }

  try {
    const data = await request.json();
    const path = normalizeArticlePath(data?.path);
    if (!path) {
      return jsonResponse({ error: '文章地址无效' }, 400, corsHeaders);
    }

    const ua = request.headers.get('User-Agent') || '';
    if (isBot(ua)) {
      return jsonResponse({ error: '自动化请求不能取消点赞' }, 403, corsHeaders);
    }

    const identity = await getLikeIdentity(request, env);
    const likeDay = getShanghaiDay();
    const results = await env.VIEWS_DB.batch([
      env.VIEWS_DB
        .prepare('DELETE FROM article_likes WHERE path = ? AND visitor_hash = ? AND like_day = ?')
        .bind(path, identity.visitorHash, likeDay),
      env.VIEWS_DB
        .prepare('SELECT count FROM article_like_counts WHERE path = ?')
        .bind(path)
    ]);

    const removed = Number(results[0]?.meta?.changes || results[0]?.meta?.rows_written || 0) > 0;
    const count = Number(results[1]?.results?.[0]?.count || 0);
    if (removed) await invalidateLikeTopCache(env);

    const extraHeaders = {
      'Cache-Control': 'private, no-store'
    };
    if (identity.setCookie) extraHeaders['Set-Cookie'] = identity.setCookie;

    return jsonResponse(
      { path, count, likedToday: false, removed, likeDay },
      200,
      corsHeaders,
      extraHeaders
    );
  } catch (error) {
    console.error('Unlike request failed:', error);
    const message = error instanceof SyntaxError ? '请求格式无效' : '取消点赞服务尚未配置完成';
    const status = error instanceof SyntaxError ? 400 : 503;
    return jsonResponse({ error: message }, status, corsHeaders);
  }
};

const parseBrowser = (ua) => {
    if (!ua) return 'Other';
    const lower = ua.toLowerCase();
    if (lower.includes('micromessenger')) return 'WeChat';
    if (lower.includes('edg')) return 'Edge';
    if (lower.includes('opr') || lower.includes('opera')) return 'Opera';
    if (lower.includes('chrome')) return 'Chrome';
    if (lower.includes('firefox')) return 'Firefox';
    if (lower.includes('safari')) return 'Safari';
    if (lower.includes('trident') || lower.includes('msie')) return 'IE';
    return 'Other';
}

// 简单的 Bot 检测列表
const isBot = (ua) => {
  if (!ua) return false;
  const lowerUA = ua.toLowerCase();
  const botKeywords = [
    'bot', 'spider', 'crawl', 'slurp', 'mediapartners', 'inspect',
    'headless', 'googlebot', 'bingbot', 'baiduspider', 'yandex',
    'sogou', 'curl', 'wget', 'python-requests'
  ];
  return botKeywords.some(keyword => lowerUA.includes(keyword));
}

const browserSql = (browserColumn = 'browser', uaColumn = 'ua') => `
  COALESCE(
    NULLIF(${browserColumn}, ''),
    CASE
      WHEN ${uaColumn} LIKE '%MicroMessenger%' THEN 'WeChat'
      WHEN ${uaColumn} LIKE '%Edg%' THEN 'Edge'
      WHEN ${uaColumn} LIKE '%OPR%' OR ${uaColumn} LIKE '%Opera%' THEN 'Opera'
      WHEN ${uaColumn} LIKE '%Chrome%' THEN 'Chrome'
      WHEN ${uaColumn} LIKE '%Firefox%' THEN 'Firefox'
      WHEN ${uaColumn} LIKE '%Safari%' THEN 'Safari'
      WHEN ${uaColumn} LIKE '%Trident%' OR ${uaColumn} LIKE '%MSIE%' THEN 'IE'
      ELSE 'Other'
    END
  )
`;

const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

// 辅助函数：将 YYYY-MM-DD 转换为左闭右开的 Unix 时间戳范围
const getDateRange = (dateStr) => {
    const start = new Date(dateStr + 'T00:00:00Z').getTime();
    const end = start + DAY_MS;
    return { start, end };
}

// 核心聚合函数：将指定日期的 views 数据聚合到 daily_stats
async function consolidateDailyStats(env, dateStr) {
    if (!isValidDateString(dateStr)) {
        throw new Error('Invalid date. Expected YYYY-MM-DD.');
    }

    const { start, end } = getDateRange(dateStr);
    
    // 1. 检查该日期是否已经聚合过 (避免重复)
    const existing = await env.VIEWS_DB.prepare(
        "SELECT 1 FROM daily_stats WHERE date = ? AND type = 'total' LIMIT 1"
    ).bind(dateStr).first();
    if (existing) {
        console.log(`Date ${dateStr} already consolidated.`);
        return { skipped: true, date: dateStr };
    }

    console.log(`Consolidating stats for ${dateStr}...`);

    // 2. 只扫描一次原始日期范围，在一个 D1 调用中完成各维度聚合
    const aggregation = await env.VIEWS_DB.prepare(`
        WITH day_rows AS MATERIALIZED (
          SELECT path, country, ${browserSql()} AS browser, ref
          FROM views
          WHERE ts >= ? AND ts < ?
        )
        SELECT
          (
            SELECT json_group_array(json_object('name', name, 'count', count))
            FROM (
              SELECT path AS name, COUNT(*) AS count
              FROM day_rows
              WHERE path IS NOT NULL AND path != ''
              GROUP BY path
            )
          ) AS paths_json,
          (
            SELECT json_group_array(json_object('name', name, 'count', count))
            FROM (
              SELECT country AS name, COUNT(*) AS count
              FROM day_rows
              WHERE country IS NOT NULL AND country != ''
              GROUP BY country
            )
          ) AS countries_json,
          (
            SELECT json_group_array(json_object('name', name, 'count', count))
            FROM (
              SELECT browser AS name, COUNT(*) AS count
              FROM day_rows
              GROUP BY browser
            )
          ) AS browsers_json,
          (
            SELECT json_group_array(json_object('name', name, 'count', count))
            FROM (
              SELECT ref AS name, COUNT(*) AS count
              FROM day_rows
              WHERE ref IS NOT NULL AND ref != ''
              GROUP BY ref
            )
          ) AS refs_json,
          (SELECT COUNT(*) FROM day_rows) AS total
    `).bind(start, end).all();
    const row = aggregation.results?.[0] || {};
    const parseMetricJson = (value) => {
        try {
            const parsed = JSON.parse(value || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };
    const results = [
        ...parseMetricJson(row.paths_json).map(item => ({ type: 'path', ...item })),
        ...parseMetricJson(row.countries_json).map(item => ({ type: 'country', ...item })),
        ...parseMetricJson(row.browsers_json).map(item => ({ type: 'browser', ...item })),
        ...parseMetricJson(row.refs_json).map(item => ({ type: 'ref', ...item })),
        { type: 'total', name: 'total', count: Number(row.total || 0) }
    ];

    // 3. 批量插入/写入 daily_stats
    const stmt = env.VIEWS_DB.prepare('INSERT OR REPLACE INTO daily_stats (date, type, name, count) VALUES (?, ?, ?, ?)');
    const batch = results
        .filter(row => row.type === 'total' || row.name)
        .map(row => stmt.bind(dateStr, row.type, row.name, row.count));

    if (batch.length > 0) {
        const BATCH_SIZE = 50; 
        for (let i = 0; i < batch.length; i += BATCH_SIZE) {
            await env.VIEWS_DB.batch(batch.slice(i, i + BATCH_SIZE));
        }
    }

    return { success: true, count: batch.length, date: dateStr };
}

const getUtcDayStart = (timestamp) => {
    const date = new Date(timestamp);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const toDateString = (timestamp) => new Date(timestamp).toISOString().slice(0, 10);

const getFullDayRange = (start, end) => {
    const startDay = getUtcDayStart(start);
    const fullStart = start === startDay ? startDay : startDay + DAY_MS;
    const fullEnd = getUtcDayStart(end);
    const normalizedStart = Math.min(fullStart, fullEnd);

    return {
        start: normalizedStart,
        end: fullEnd,
        startDate: toDateString(normalizedStart),
        endDate: toDateString(fullEnd)
    };
};

const resolveStatsRequest = (url) => {
    const period = url.searchParams.get('period') || '24h';
    const startParam = url.searchParams.get('start');
    const endParam = url.searchParams.get('end');
    const now = Date.now();
    let start;
    let end;
    let timeFormat;
    let ttl = 300;
    let cacheKey;
    let includeComparison = false;

    if (startParam !== null || endParam !== null) {
        if (startParam === null || endParam === null) {
            throw new Error('Both start and end are required.');
        }

        start = Number(startParam);
        end = Number(endParam);
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
            throw new Error('Invalid stats range.');
        }
        if (end - start > 5 * 365 * DAY_MS) {
            throw new Error('Stats range cannot exceed five years.');
        }

        const diff = end - start;
        timeFormat = diff <= DAY_MS + 1000
            ? '%Y-%m-%d %H:00'
            : diff > 180 * DAY_MS
                ? '%Y-%m'
                : '%Y-%m-%d';
        cacheKey = `stats:${STATS_CACHE_VERSION}:custom:${start}-${end}`;
    } else {
        const periodConfig = {
            '24h': { duration: DAY_MS, format: '%Y-%m-%d %H:00', ttl: 300 },
            '7d': { duration: 7 * DAY_MS, format: '%Y-%m-%d', ttl: 1800 },
            '30d': { duration: 30 * DAY_MS, format: '%Y-%m-%d', ttl: 1800 },
            '1y': { duration: 365 * DAY_MS, format: '%Y-%m', ttl: 21600 }
        }[period];

        if (!periodConfig) {
            throw new Error('Unsupported stats period.');
        }

        end = now;
        start = end - periodConfig.duration;
        timeFormat = periodConfig.format;
        ttl = periodConfig.ttl;
        includeComparison = COMPARABLE_PERIODS.has(period);
        cacheKey = `stats:${STATS_CACHE_VERSION}:${period}`;
    }

    const duration = end - start;
    return {
        period: startParam !== null ? 'custom' : period,
        current: { start, end },
        previous: includeComparison
            ? { start: start - duration, end: start }
            : { start, end: start },
        includeComparison,
        timeFormat,
        ttl,
        cacheKey,
        useAggregated: duration > 48 * HOUR_MS
    };
};

const RAW_STATS_SQL = (timeFormat) => `
    WITH
    bounds(current_start, current_end, previous_start, previous_end) AS (
      VALUES (?, ?, ?, ?)
    ),
    source AS MATERIALIZED (
      SELECT
        CASE WHEN views.ts >= bounds.current_start THEN 'current' ELSE 'previous' END AS period_key,
        views.path,
        views.country,
        ${browserSql('views.browser', 'views.ua')} AS browser,
        views.ref,
        views.ts
      FROM views, bounds
      WHERE views.ts >= bounds.previous_start
        AND views.ts < bounds.current_end
    )
    SELECT
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT path AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'current' AND path IS NOT NULL AND path != ''
          GROUP BY path
          ORDER BY count DESC, name ASC
          LIMIT 100
        )
      ) AS pages_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT country AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'current' AND country IS NOT NULL AND country != ''
          GROUP BY country
          ORDER BY count DESC, name ASC
          LIMIT 50
        )
      ) AS countries_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT browser AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'current'
          GROUP BY browser
          ORDER BY count DESC, name ASC
          LIMIT 20
        )
      ) AS browsers_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT ref AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'current' AND ref IS NOT NULL AND ref != ''
          GROUP BY ref
          ORDER BY count DESC, name ASC
          LIMIT 50
        )
      ) AS refs_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', ts / 1000, 'unixepoch') AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'current'
          GROUP BY name
          ORDER BY name ASC
        )
      ) AS current_series_json,
      (SELECT COUNT(*) FROM source WHERE period_key = 'current') AS current_total,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', ts / 1000, 'unixepoch') AS name, COUNT(*) AS count
          FROM source
          WHERE period_key = 'previous'
          GROUP BY name
          ORDER BY name ASC
        )
      ) AS previous_series_json,
      (SELECT COUNT(*) FROM source WHERE period_key = 'previous') AS previous_total
`;

const HYBRID_STATS_SQL = (timeFormat) => `
    WITH
    bounds(
      current_start,
      current_end,
      previous_start,
      previous_end,
      current_full_start,
      current_full_end,
      previous_full_start,
      previous_full_end,
      current_full_start_date,
      current_full_end_date,
      previous_full_start_date,
      previous_full_end_date
    ) AS (
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ),
    daily_source AS MATERIALIZED (
      SELECT
        CASE
          WHEN daily_stats.date >= bounds.current_full_start_date
           AND daily_stats.date < bounds.current_full_end_date
          THEN 'current'
          ELSE 'previous'
        END AS period_key,
        daily_stats.date,
        daily_stats.type,
        daily_stats.name,
        daily_stats.count
      FROM daily_stats, bounds
      WHERE (
        daily_stats.date >= bounds.current_full_start_date
        AND daily_stats.date < bounds.current_full_end_date
      ) OR (
        daily_stats.date >= bounds.previous_full_start_date
        AND daily_stats.date < bounds.previous_full_end_date
      )
    ),
    digits(n) AS (
      VALUES (0), (1), (2), (3), (4), (5), (6), (7), (8), (9)
    ),
    twenties(n) AS (
      VALUES
        (0), (1), (2), (3), (4), (5), (6), (7), (8), (9),
        (10), (11), (12), (13), (14), (15), (16), (17), (18), (19)
    ),
    day_offsets(day_offset) AS MATERIALIZED (
      SELECT ones.n + tens.n * 10 + hundreds.n * 100
      FROM digits AS ones, digits AS tens, twenties AS hundreds
      WHERE ones.n + tens.n * 10 + hundreds.n * 100 <= ${5 * 365}
    ),
    expected_days(period_key, day_start, day_end, day_date) AS (
      SELECT
        'current',
        bounds.current_full_start + day_offsets.day_offset * ${DAY_MS},
        bounds.current_full_start + (day_offsets.day_offset + 1) * ${DAY_MS},
        strftime(
          '%Y-%m-%d',
          (bounds.current_full_start + day_offsets.day_offset * ${DAY_MS}) / 1000,
          'unixepoch'
        )
      FROM day_offsets, bounds
      WHERE bounds.current_full_start + day_offsets.day_offset * ${DAY_MS}
        < bounds.current_full_end

      UNION ALL

      SELECT
        'previous',
        bounds.previous_full_start + day_offsets.day_offset * ${DAY_MS},
        bounds.previous_full_start + (day_offsets.day_offset + 1) * ${DAY_MS},
        strftime(
          '%Y-%m-%d',
          (bounds.previous_full_start + day_offsets.day_offset * ${DAY_MS}) / 1000,
          'unixepoch'
        )
      FROM day_offsets, bounds
      WHERE bounds.previous_full_start + day_offsets.day_offset * ${DAY_MS}
        < bounds.previous_full_end
    ),
    missing_days AS MATERIALIZED (
      SELECT
        expected_days.period_key,
        expected_days.day_start,
        expected_days.day_end
      FROM expected_days
      LEFT JOIN daily_stats
        ON daily_stats.date = expected_days.day_date
       AND daily_stats.type = 'total'
       AND daily_stats.name = 'total'
      WHERE daily_stats.date IS NULL
    ),
    raw_ranges(period_key, range_start, range_end) AS MATERIALIZED (
      SELECT
        'current',
        bounds.current_start,
        MIN(bounds.current_full_start, bounds.current_end)
      FROM bounds
      WHERE bounds.current_start < MIN(bounds.current_full_start, bounds.current_end)

      UNION ALL

      SELECT
        'current',
        MAX(bounds.current_full_end, bounds.current_start),
        bounds.current_end
      FROM bounds
      WHERE MAX(bounds.current_full_end, bounds.current_start) < bounds.current_end

      UNION ALL

      SELECT
        'previous',
        bounds.previous_start,
        MIN(bounds.previous_full_start, bounds.previous_end)
      FROM bounds
      WHERE bounds.previous_start < bounds.previous_end
        AND bounds.previous_start < MIN(bounds.previous_full_start, bounds.previous_end)

      UNION ALL

      SELECT
        'previous',
        MAX(bounds.previous_full_end, bounds.previous_start),
        bounds.previous_end
      FROM bounds
      WHERE bounds.previous_start < bounds.previous_end
        AND MAX(bounds.previous_full_end, bounds.previous_start) < bounds.previous_end

      UNION ALL

      SELECT period_key, day_start, day_end
      FROM missing_days
    ),
    raw_source AS MATERIALIZED (
      SELECT
        raw_ranges.period_key,
        views.path,
        views.country,
        ${browserSql('views.browser', 'views.ua')} AS browser,
        views.ref,
        views.ts
      FROM raw_ranges
      JOIN views
        ON views.ts >= raw_ranges.range_start
       AND views.ts < raw_ranges.range_end
    )
    SELECT
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'current' AND type = 'path'
          GROUP BY name
          ORDER BY count DESC, name ASC
          LIMIT 200
        )
      ) AS daily_pages_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT path AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'current' AND path IS NOT NULL AND path != ''
          GROUP BY path
          ORDER BY count DESC, name ASC
          LIMIT 200
        )
      ) AS raw_pages_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'current' AND type = 'country'
          GROUP BY name
          ORDER BY count DESC, name ASC
          LIMIT 100
        )
      ) AS daily_countries_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT country AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'current' AND country IS NOT NULL AND country != ''
          GROUP BY country
          ORDER BY count DESC, name ASC
          LIMIT 100
        )
      ) AS raw_countries_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'current' AND type = 'browser'
          GROUP BY name
          ORDER BY count DESC, name ASC
          LIMIT 50
        )
      ) AS daily_browsers_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT browser AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'current'
          GROUP BY browser
          ORDER BY count DESC, name ASC
          LIMIT 50
        )
      ) AS raw_browsers_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'current' AND type = 'ref'
          GROUP BY name
          ORDER BY count DESC, name ASC
          LIMIT 100
        )
      ) AS daily_refs_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT ref AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'current' AND ref IS NOT NULL AND ref != ''
          GROUP BY ref
          ORDER BY count DESC, name ASC
          LIMIT 100
        )
      ) AS raw_refs_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', date) AS name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'current' AND type = 'total'
          GROUP BY strftime('${timeFormat}', date)
          ORDER BY strftime('${timeFormat}', date) ASC
        )
      ) AS daily_current_series_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', ts / 1000, 'unixepoch') AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'current'
          GROUP BY name
          ORDER BY name ASC
        )
      ) AS raw_current_series_json,
      (
        SELECT COALESCE(SUM(count), 0)
        FROM daily_source
        WHERE period_key = 'current' AND type = 'total'
      ) AS daily_current_total,
      (SELECT COUNT(*) FROM raw_source WHERE period_key = 'current') AS raw_current_total,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', date) AS name, SUM(count) AS count
          FROM daily_source
          WHERE period_key = 'previous' AND type = 'total'
          GROUP BY strftime('${timeFormat}', date)
          ORDER BY strftime('${timeFormat}', date) ASC
        )
      ) AS daily_previous_series_json,
      (
        SELECT json_group_array(json_object('name', name, 'count', count))
        FROM (
          SELECT strftime('${timeFormat}', ts / 1000, 'unixepoch') AS name, COUNT(*) AS count
          FROM raw_source
          WHERE period_key = 'previous'
          GROUP BY name
          ORDER BY name ASC
        )
      ) AS raw_previous_series_json,
      (
        SELECT COALESCE(SUM(count), 0)
        FROM daily_source
        WHERE period_key = 'previous' AND type = 'total'
      ) AS daily_previous_total,
      (SELECT COUNT(*) FROM raw_source WHERE period_key = 'previous') AS raw_previous_total
`;

const parseJsonArray = (value) => {
    try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const getResultRow = (result) => result?.results?.[0] || {};

const toMetricRows = (items, periodKey, type) => (items || [])
    .filter(item => item?.name !== null && item?.name !== undefined)
    .map(item => ({
        period_key: periodKey,
        type,
        name: String(item.name),
        count: Number(item.count || 0)
    }));

const mergeMetricLists = (first, second, limit) => {
    const counts = new Map();
    for (const item of [...(first || []), ...(second || [])]) {
        if (item?.name === null || item?.name === undefined) continue;
        const name = String(item.name);
        counts.set(name, (counts.get(name) || 0) + Number(item.count || 0));
    }

    const merged = Array.from(counts, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return limit ? merged.slice(0, limit) : merged;
};

const queryRawStats = async (env, requestConfig) => {
    const { current, previous, timeFormat } = requestConfig;
    const result = await env.VIEWS_DB.prepare(RAW_STATS_SQL(timeFormat))
        .bind(current.start, current.end, previous.start, previous.end)
        .all();
    const row = getResultRow(result);

    return [
        ...toMetricRows(parseJsonArray(row.pages_json), 'current', 'path'),
        ...toMetricRows(parseJsonArray(row.countries_json), 'current', 'country'),
        ...toMetricRows(parseJsonArray(row.browsers_json), 'current', 'browser'),
        ...toMetricRows(parseJsonArray(row.refs_json), 'current', 'ref'),
        ...toMetricRows(parseJsonArray(row.current_series_json), 'current', 'series'),
        {
            period_key: 'current',
            type: 'total',
            name: 'total',
            count: Number(row.current_total || 0)
        },
        ...toMetricRows(parseJsonArray(row.previous_series_json), 'previous', 'series'),
        {
            period_key: 'previous',
            type: 'total',
            name: 'total',
            count: Number(row.previous_total || 0)
        }
    ];
};

const queryHybridStats = async (env, requestConfig) => {
    const { current, previous, timeFormat } = requestConfig;
    const currentFull = getFullDayRange(current.start, current.end);
    const previousFull = getFullDayRange(previous.start, previous.end);

    const result = await env.VIEWS_DB.prepare(HYBRID_STATS_SQL(timeFormat))
        .bind(
            current.start,
            current.end,
            previous.start,
            previous.end,
            currentFull.start,
            currentFull.end,
            previousFull.start,
            previousFull.end,
            currentFull.startDate,
            currentFull.endDate,
            previousFull.startDate,
            previousFull.endDate
        )
        .all();
    const row = getResultRow(result);

    const pages = mergeMetricLists(
        parseJsonArray(row.daily_pages_json),
        parseJsonArray(row.raw_pages_json),
        100
    );
    const countries = mergeMetricLists(
        parseJsonArray(row.daily_countries_json),
        parseJsonArray(row.raw_countries_json),
        50
    );
    const browsers = mergeMetricLists(
        parseJsonArray(row.daily_browsers_json),
        parseJsonArray(row.raw_browsers_json),
        20
    );
    const refs = mergeMetricLists(
        parseJsonArray(row.daily_refs_json),
        parseJsonArray(row.raw_refs_json),
        50
    );
    const currentSeries = mergeMetricLists(
        parseJsonArray(row.daily_current_series_json),
        parseJsonArray(row.raw_current_series_json)
    );
    const previousSeries = mergeMetricLists(
        parseJsonArray(row.daily_previous_series_json),
        parseJsonArray(row.raw_previous_series_json)
    );

    return [
        ...toMetricRows(pages, 'current', 'path'),
        ...toMetricRows(countries, 'current', 'country'),
        ...toMetricRows(browsers, 'current', 'browser'),
        ...toMetricRows(refs, 'current', 'ref'),
        ...toMetricRows(currentSeries, 'current', 'series'),
        {
            period_key: 'current',
            type: 'total',
            name: 'total',
            count: Number(row.daily_current_total || 0) + Number(row.raw_current_total || 0)
        },
        ...toMetricRows(previousSeries, 'previous', 'series'),
        {
            period_key: 'previous',
            type: 'total',
            name: 'total',
            count: Number(row.daily_previous_total || 0) + Number(row.raw_previous_total || 0)
        }
    ];
};

const queryStats = async (env, requestConfig) => {
    if (requestConfig.useAggregated) {
        try {
            const hybridRows = await queryHybridStats(env, requestConfig);
            return { rows: hybridRows, source: 'hybrid' };
        } catch (error) {
            console.warn('daily_stats query failed; falling back to views.', error);
        }
    }

    return { rows: await queryRawStats(env, requestConfig), source: 'views' };
};

const buildPeriodStats = (rows, periodKey, includeDimensions) => {
    const periodRows = rows.filter(row => row.period_key === periodKey);
    const pick = (type) => periodRows.filter(row => row.type === type);
    const ranked = (type) => pick(type).sort(
        (a, b) => Number(b.count || 0) - Number(a.count || 0)
            || String(a.name || '').localeCompare(String(b.name || ''))
    );
    const totalRow = pick('total')[0];
    const base = {
        total: Number(totalRow?.count || 0),
        timeSeries: pick('series')
            .map(row => ({ label: row.name, count: Number(row.count || 0) }))
            .sort((a, b) => a.label.localeCompare(b.label))
    };

    if (!includeDimensions) return base;

    return {
        ...base,
        pages: ranked('path').map(row => ({ path: row.name, count: Number(row.count || 0) })),
        countries: ranked('country').map(row => ({ country: row.name, count: Number(row.count || 0) })),
        uas: ranked('browser').map(row => ({ ua_group: row.name, count: Number(row.count || 0) })),
        refs: ranked('ref').map(row => ({ ref: row.name, count: Number(row.count || 0) }))
    };
};

const buildStatsResponse = (rows, requestConfig, source) => {
    const currentStats = buildPeriodStats(rows, 'current', true);
    const previousStats = requestConfig.includeComparison
        ? buildPeriodStats(rows, 'previous', false)
        : null;

    return {
        period: requestConfig.period,
        range: requestConfig.current,
        ...currentStats,
        previousPeriod: previousStats
            ? {
                range: requestConfig.previous,
                ...previousStats,
                change: currentStats.total - previousStats.total,
                changePercent: previousStats.total > 0
                    ? (currentStats.total - previousStats.total) * 100 / previousStats.total
                    : null
            }
            : null,
        meta: {
            source,
            generatedAt: Date.now()
        }
    };
};

const handler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (
      url.pathname === '/stats'
      || (url.pathname === '/stats/api' && !PRIVATE_STATS_HOSTS.has(url.hostname))
    ) {
      return new Response('Not Found', { status: 404 });
    }
    const routePath = resolveStatsRoutePath(request.method, url.pathname);
    const likeApiRequest = isLikeApiPath(routePath);
    const corsHeaders = likeApiRequest ? getLikeCorsHeaders(request) : getCorsHeaders(request);

    if (likeApiRequest && !isAllowedLikeOrigin(request.headers.get('Origin'))) {
      return jsonResponse({ error: '不允许的请求来源' }, 403, corsHeaders);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (request.method === 'GET' && routePath === '/api/likes/status') {
      return handleLikeStatus(request, env, corsHeaders, url);
    }

    if (request.method === 'POST' && routePath === '/api/engagement') {
      return handleEngagementBatch(request, env, corsHeaders);
    }

    if (request.method === 'GET' && routePath === '/api/likes/top') {
      return handleLikeTop(env, ctx, corsHeaders, url);
    }

    if (request.method === 'POST' && routePath === '/api/likes') {
      return handleLikePost(request, env, corsHeaders);
    }

    if (request.method === 'DELETE' && routePath === '/api/likes') {
      return handleLikeDelete(request, env, corsHeaders);
    }

    const cacheControlLink = 'public, max-age=60, s-maxage=300'; // 浏览器缓存 60 秒，CDN 缓存 5 分钟
    if (request.method === 'GET') {
      if (routePath === '/count') {
          const path = normalizeStatsPath(url.searchParams.get('path'));
          if (!path) return new Response('Missing path', { status: 400, headers: corsHeaders });
          const pathVariants = getStatsPathVariants(path);
          
          let count = 0;
          try {
            if (env.VIEWS_DB) {
                // 1. 优先查询聚合表 page_counts (性能最佳, Read Rows = 1)
                try {
                    const row = await env.VIEWS_DB
                      .prepare(`SELECT COALESCE(SUM(count), 0) AS count FROM page_counts WHERE path IN (${pathVariants.map(() => '?').join(', ')})`)
                      .bind(...pathVariants)
                      .first();
                    if (Number(row?.count || 0) > 0) {
                        count = Number(row.count);
                    } else {
                        // 2. 如果聚合表中没有记录（可能是旧数据未迁移），回退到全表 COUNT 查询
                        const res = await env.VIEWS_DB
                          .prepare(`SELECT COUNT(*) as count FROM views WHERE path IN (${pathVariants.map(() => '?').join(', ')})`)
                          .bind(...pathVariants)
                          .first();
                        count = res.count;
                    }
                } catch (e) {
                     // 3. 如果表不存在等异常，降级回退
                     const res = await env.VIEWS_DB
                       .prepare(`SELECT COUNT(*) as count FROM views WHERE path IN (${pathVariants.map(() => '?').join(', ')})`)
                       .bind(...pathVariants)
                       .first();
                     count = res.count;
                }
            } else if (env.VIEWS_KV) {
                const counts = await Promise.all(
                  pathVariants.map(item => env.VIEWS_KV.get(`count:${item}`))
                );
                count = counts.reduce((total, item) => total + Number(item || 0), 0);
            }
          } catch(e) {
             console.error(e)
          }
          return new Response(JSON.stringify({ path, count }), { 
              headers: { 
                  'content-type': 'application/json', 
                  'Cache-Control': cacheControlLink,
                  ...corsHeaders 
              }
          });
      }

      if (routePath === '/popular') {
         if (!env.VIEWS_DB) {
             return new Response(JSON.stringify({ error: 'Database not configured' }), { 
                 status: 500, 
                 headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
             });
         }
         
         const cacheKey = 'popular:articles:24h:v1';
         // Try KV Cache first
         if (env.VIEWS_KV) {
            const cached = await env.VIEWS_KV.get(cacheKey, { type: 'json' });
            if (cached) {
                return new Response(JSON.stringify(cached), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Stats-Cache': 'HIT', 'Cache-Control': 'public, max-age=300' }
                });
            }
         }

         const endTime = Date.now();
         const startTime = endTime - 24 * 3600 * 1000;
         const articlePathPatterns = ARTICLE_PATH_PREFIXES.flatMap(prefix => [`${prefix}%`, `/en${prefix}%`]);
         const articlePathExclusions = ARTICLE_PATH_EXCLUSIONS.flatMap(path => [path, `/en${path}`]);

         try {
            // Using covering index (ts, path)
            const { results } = await env.VIEWS_DB.prepare(
                `SELECT
                   CASE
                     WHEN path = '/en' OR path = '/en/' THEN '/'
                     WHEN path LIKE '/en/%' THEN substr(path, 4)
                     ELSE path
                   END AS path,
                   COUNT(*) as count
                 FROM views
                 WHERE ts >= ? AND ts <= ?
                   AND (${articlePathPatterns.map(() => 'path LIKE ?').join(' OR ')})
                   AND path NOT IN (${articlePathExclusions.map(() => '?').join(', ')})
                   AND path NOT LIKE '%/page/%'
                 GROUP BY
                   CASE
                     WHEN path = '/en' OR path = '/en/' THEN '/'
                     WHEN path LIKE '/en/%' THEN substr(path, 4)
                     ELSE path
                 END
                 ORDER BY count DESC
                 LIMIT 15`
            ).bind(startTime, endTime, ...articlePathPatterns, ...articlePathExclusions).all();
            
            if (env.VIEWS_KV) {
                // Cache for 5 minutes
                ctx.waitUntil(env.VIEWS_KV.put(cacheKey, JSON.stringify(results), { expirationTtl: 300 }));
            }
            
            return new Response(JSON.stringify(results), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Stats-Cache': 'MISS', 'Cache-Control': 'public, max-age=300' }
            });

         } catch (e) {
             return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
         }
      }

      if (routePath === '/consolidate') {
          if (!env.VIEWS_DB) return new Response('No DB', { status: 500 });
          const targetDate = url.searchParams.get('date'); // YYYY-MM-DD
          const auth = request.headers.get('Authorization');
          const secret = env.ADMIN_SECRET;

          if (!secret) {
               return new Response('ADMIN_SECRET is not configured', { status: 503 });
          }
          
          if (auth !== `Bearer ${secret}` && url.searchParams.get('key') !== secret) {
               return new Response('Unauthorized', { status: 401 });
          }

          try {
              const date = targetDate || new Date(Date.now() - DAY_MS).toISOString().split('T')[0];
              const res = await consolidateDailyStats(env, date);
              return new Response(JSON.stringify(res), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
          } catch (error) {
              return new Response(JSON.stringify({ error: error.message }), {
                  status: /invalid date/i.test(error.message || '') ? 400 : 500,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
          }
      }

      if (routePath === '/stats') {
        if (!env.VIEWS_DB) {
           return new Response(JSON.stringify({ error: 'Database not configured' }), { 
             status: 500, 
             headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
           });
        }

        try {
            const requestConfig = resolveStatsRequest(url);

            if (env.VIEWS_KV) {
                const cachedData = await env.VIEWS_KV.get(requestConfig.cacheKey, { type: 'json' });
                if (cachedData) {
                    return new Response(JSON.stringify(cachedData), {
                        headers: {
                            ...corsHeaders,
                            'Content-Type': 'application/json',
                            'X-Stats-Cache': 'HIT',
                            'Cache-Control': 'private, no-store'
                        }
                    });
                }
            }

            const { rows, source } = await queryStats(env, requestConfig);
            const result = buildStatsResponse(rows, requestConfig, source);

            // Write to KV
            if (env.VIEWS_KV) {
                ctx.waitUntil(
                    env.VIEWS_KV.put(
                        requestConfig.cacheKey,
                        JSON.stringify(result),
                        { expirationTtl: requestConfig.ttl }
                    )
                );
            }

            return new Response(JSON.stringify(result), { 
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
                'X-Stats-Cache': 'MISS',
                'Cache-Control': 'private, no-store'
              } 
            });
        } catch (e) {
            const isBadRequest = /required|invalid|unsupported|exceed/i.test(e.message || '');
            return new Response(JSON.stringify({ error: e.message }), {
                status: isBadRequest ? 400 : 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
      }
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    if (request.method === 'POST' && routePath === '/') {
      try {
        const data = await request.json();
        const path = normalizeStatsPath(data.path || '/');
        if (!path) {
          return new Response('Invalid path', { status: 400, headers: corsHeaders });
        }
        const receivedAt = Date.now();
        const submittedAt = Number(data.ts);
        const ts = Number.isFinite(submittedAt) && Math.abs(submittedAt - receivedAt) <= 5 * 60 * 1000
            ? submittedAt
            : receivedAt;
        const ua = (data.ua || '').substring(0, 500); // 限制 UA 长度
        const ref = (data.referrer || '').substring(0, 500); // referrer

        // 1. Bot 过滤
        if (isBot(ua)) {
          // console.log(`Skipping bot: ${ua}`); // 减少日志
          return new Response(null, { status: 204, headers: corsHeaders });
        }

        // New fields
        const ip = request.headers.get('CF-Connecting-IP') || '';

        // 2. IP 访问频率限制 (简单去重)
        // 同一个 IP 访问同一个页面，10分钟内只记录一次
        // 有 KV 时优先用短期键，避免每次访问先读取 D1
        let dedupedWithKV = false;
        if (env.VIEWS_KV && ip) {
            const dedupKey = `dedup:${ip}:${path}`;
            try {
                const visited = await env.VIEWS_KV.get(dedupKey);
                if (visited) {
                    return new Response(null, { status: 204, headers: corsHeaders });
                }
                ctx.waitUntil(env.VIEWS_KV.put(dedupKey, '1', { expirationTtl: 600 }));
                dedupedWithKV = true;
            } catch (e) {
                // KV 异常时再回退到 D1 去重
            }
        }

        if (!dedupedWithKV && env.VIEWS_DB && ip) {
            const tenMinutesAgo = receivedAt - 10 * 60 * 1000;
            try {
                const recent = await env.VIEWS_DB.prepare(
                    'SELECT 1 FROM views WHERE ip = ? AND path = ? AND ts > ? LIMIT 1'
                ).bind(ip, path, tenMinutesAgo).first();
                if (recent) {
                    return new Response(null, { status: 204, headers: corsHeaders });
                }
            } catch (e) {
                // Ignore errors (e.g. missing columns during migration)
            }
        }

        const country = request.cf?.country || '';
        const city = (request.cf?.city || '').substring(0, 100);
        const lang = (data.lang || '').substring(0, 20);
        const screen = (data.screen || '').substring(0, 20);
        const browser = parseBrowser(ua); // Pre-calculate browser

        // console.log(`Logging view: ${path} from ${country}`);

        if (env.VIEWS_DB) {
          const insertTask = async () => {
            const createFullInsert = () => env.VIEWS_DB.prepare(
                'INSERT INTO views (path, ts, ua, ref, ip, country, city, lang, screen, browser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(path, ts, ua, ref, ip, country, city, lang, screen, browser);
            const createNoBrowserInsert = () => env.VIEWS_DB.prepare(
                'INSERT INTO views (path, ts, ua, ref, ip, country, city, lang, screen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(path, ts, ua, ref, ip, country, city, lang, screen);
            const createLegacyInsert = () => env.VIEWS_DB.prepare(
                'INSERT INTO views (path, ts, ua, ref) VALUES (?, ?, ?, ?)'
            ).bind(path, ts, ua, ref);
            const createPageCountUpsert = () => env.VIEWS_DB.prepare(
                'INSERT INTO page_counts (path, count) VALUES (?, 1) ON CONFLICT(path) DO UPDATE SET count = count + 1'
            ).bind(path);

            // 正常 schema 下一次 batch 同时完成日志写入和页面计数更新
            try {
                await env.VIEWS_DB.batch([createFullInsert(), createPageCountUpsert()]);
                return;
            } catch (batchError) {
                // 旧 schema 或缺少 page_counts 时按兼容路径重试
            }

            let insertSuccess = false;
            for (const createInsert of [createFullInsert, createNoBrowserInsert, createLegacyInsert]) {
                try {
                    await createInsert().run();
                    insertSuccess = true;
                    break;
                } catch (error) {
                    // Continue to the next compatible schema.
                }
            }

            if (!insertSuccess) {
                console.error('All view insert attempts failed.');
                return;
            }

            try {
                await createPageCountUpsert().run();
            } catch (error) {
                // page_counts is optional for legacy deployments.
            }
          };
          
          // 使用 ctx.waitUntil 异步执行写入，不阻塞响应
          ctx.waitUntil(insertTask());
          return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (env.VIEWS_KV) {
            // KV fallback task
            const kvTask = async () => {
                const key = `count:${path}`;
                try {
                    const current = Number(await env.VIEWS_KV.get(key) || 0);
                    await env.VIEWS_KV.put(key, String(current + 1));
                } catch (e) {}
            };
            ctx.waitUntil(kvTask());
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        return new Response('No storage bound', { status: 500, headers: corsHeaders });
      } catch (e) {
        return new Response('bad request', { status: 400, headers: corsHeaders });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },

  async scheduled(_event, env, ctx) {
    if (!env.VIEWS_DB) return;
    const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
    ctx.waitUntil(consolidateDailyStats(env, yesterday));
  }
};

export default handler;
