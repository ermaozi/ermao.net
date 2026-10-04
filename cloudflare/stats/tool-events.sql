-- Additive migration; UTC daily aggregates only, no identity or raw event log.
CREATE TABLE IF NOT EXISTS tool_event_daily (
  day TEXT NOT NULL,
  surface TEXT NOT NULL,
  event TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK(count >= 0),
  PRIMARY KEY (day, surface, event)
);
