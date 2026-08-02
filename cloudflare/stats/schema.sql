-- Migration for Cloudflare D1
CREATE TABLE IF NOT EXISTS views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  ts INTEGER NOT NULL,
  ua TEXT,
  ref TEXT,
  ip TEXT,
  country TEXT,
  city TEXT,
  lang TEXT,
  screen TEXT,
  browser TEXT
);

-- Existing Indices
CREATE INDEX IF NOT EXISTS idx_views_path ON views(path);
CREATE INDEX IF NOT EXISTS idx_views_ts ON views(ts);
CREATE INDEX IF NOT EXISTS idx_views_ts_path ON views(ts, path);
CREATE INDEX IF NOT EXISTS idx_views_ts_country ON views(ts, country);
CREATE INDEX IF NOT EXISTS idx_views_ts_ref ON views(ts, ref);

-- New Index for IP Deduplication Optimization
CREATE INDEX IF NOT EXISTS idx_views_dedup ON views(ip, path, ts);

-- Counter Table: Stores aggregated view counts to minimize Read Rows on D1
CREATE TABLE IF NOT EXISTS page_counts (
  path TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Daily Statistics Table: Stores historical daily aggregations
-- date: YYYY-MM-DD
-- type: 'path', 'country', 'browser', 'ref'
CREATE TABLE IF NOT EXISTS daily_stats (
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  PRIMARY KEY (date, type, name)
);

-- The primary key already covers date and (date, type) lookups.
DROP INDEX IF EXISTS idx_daily_stats_date;

-- Anonymous article likes.
-- `like_day` is calculated by the Worker in Asia/Shanghai and must never trust
-- a browser-supplied date. Only hashed identifiers are persisted.
CREATE TABLE IF NOT EXISTS article_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  network_day_hash TEXT NOT NULL,
  like_day TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  country TEXT,
  UNIQUE(path, visitor_hash, like_day)
);

-- The UNIQUE constraint already creates this exact index.
DROP INDEX IF EXISTS idx_article_likes_status;
CREATE INDEX IF NOT EXISTS idx_article_likes_network_day
  ON article_likes(network_day_hash, like_day);
CREATE INDEX IF NOT EXISTS idx_article_likes_created_at
  ON article_likes(created_at);

-- The trigger keeps all-time totals in sync atomically with each accepted like.
CREATE TABLE IF NOT EXISTS article_like_counts (
  path TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0 CHECK(count >= 0),
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_article_like_counts_rank
  ON article_like_counts(count DESC);

CREATE TRIGGER IF NOT EXISTS article_likes_increment_count
AFTER INSERT ON article_likes
BEGIN
  INSERT INTO article_like_counts(path, count, updated_at)
  VALUES (NEW.path, 1, NEW.created_at)
  ON CONFLICT(path) DO UPDATE SET
    count = article_like_counts.count + 1,
    updated_at = NEW.created_at;
END;

CREATE TRIGGER IF NOT EXISTS article_likes_decrement_count
AFTER DELETE ON article_likes
BEGIN
  UPDATE article_like_counts
  SET
    count = MAX(count - 1, 0),
    updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
  WHERE path = OLD.path;

  DELETE FROM article_like_counts
  WHERE path = OLD.path AND count = 0;
END;


-- Update commands (Run these in Cloudflare D1 Console or via wrangler d1 execute if you already have data)
-- ALTER TABLE views ADD COLUMN ip TEXT;
-- ALTER TABLE views ADD COLUMN country TEXT;
-- ALTER TABLE views ADD COLUMN city TEXT;
-- ALTER TABLE views ADD COLUMN lang TEXT;
-- ALTER TABLE views ADD COLUMN screen TEXT;
