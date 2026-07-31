-- Cloudflare D1 schema for the ermao.net advertising board.
-- Required Worker binding: DB

CREATE TABLE IF NOT EXISTS ad_board_state (
  singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
  next_layer INTEGER NOT NULL DEFAULT 0 CHECK (next_layer >= 0),
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO ad_board_state (singleton, next_layer, updated_at)
VALUES (1, 0, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));

CREATE TABLE IF NOT EXISTS ad_board_notes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL
    CHECK (length(trim(content)) BETWEEN 1 AND 100),
  color TEXT NOT NULL
    CHECK (color IN (
      'butter', 'mint', 'blush', 'sky', 'lilac',
      'sand', 'sage', 'mauve', 'slate', 'apricot'
    )),
  x REAL NOT NULL CHECK (x BETWEEN 0 AND 78),
  y REAL NOT NULL CHECK (y BETWEEN 0 AND 68),
  layer INTEGER NOT NULL UNIQUE CHECK (layer > 0),
  likes_count INTEGER NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
  has_links INTEGER NOT NULL DEFAULT 0 CHECK (has_links IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- This ledger is deliberately independent from ad_board_notes. Deleting a
-- covered or bottom-layer note must not let its author post again that day.
CREATE TABLE IF NOT EXISTS ad_board_daily_posts (
  visitor_hash TEXT NOT NULL CHECK (length(visitor_hash) = 64),
  post_date TEXT NOT NULL CHECK (length(post_date) = 10),
  note_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (visitor_hash, post_date)
);

CREATE INDEX IF NOT EXISTS idx_ad_board_daily_posts_date
ON ad_board_daily_posts (post_date);

CREATE TABLE IF NOT EXISTS ad_board_likes (
  note_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL CHECK (length(visitor_hash) = 64),
  created_at TEXT NOT NULL,
  PRIMARY KEY (note_id, visitor_hash),
  FOREIGN KEY (note_id) REFERENCES ad_board_notes (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ad_board_notes_created_at
ON ad_board_notes (created_at DESC);
