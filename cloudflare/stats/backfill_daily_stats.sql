-- One-time backfill for the completed UTC days needed by the 1-year report.
-- Raw views are materialized once, then reused for every daily dimension.
DROP INDEX IF EXISTS idx_daily_stats_date;
DROP INDEX IF EXISTS idx_article_likes_status;

WITH RECURSIVE
backfill_needed(needed) AS (
  SELECT COUNT(*) < 366
  FROM daily_stats
  WHERE date >= date('now', '-366 days')
    AND date < date('now')
    AND type = 'total'
    AND name = 'total'
),
source AS MATERIALIZED (
  SELECT
    strftime('%Y-%m-%d', ts / 1000, 'unixepoch') AS date,
    path,
    country,
    COALESCE(
      NULLIF(browser, ''),
      CASE
        WHEN ua LIKE '%MicroMessenger%' THEN 'WeChat'
        WHEN ua LIKE '%Edg%' THEN 'Edge'
        WHEN ua LIKE '%OPR%' OR ua LIKE '%Opera%' THEN 'Opera'
        WHEN ua LIKE '%Chrome%' THEN 'Chrome'
        WHEN ua LIKE '%Firefox%' THEN 'Firefox'
        WHEN ua LIKE '%Safari%' THEN 'Safari'
        WHEN ua LIKE '%Trident%' OR ua LIKE '%MSIE%' THEN 'IE'
        ELSE 'Other'
      END
    ) AS browser,
    ref
  FROM views
  WHERE (SELECT needed FROM backfill_needed)
    AND ts >= CAST(strftime('%s', date('now', '-366 days')) AS INTEGER) * 1000
    AND ts < CAST(strftime('%s', date('now')) AS INTEGER) * 1000
),
days(date) AS (
  SELECT date('now', '-366 days')
  WHERE (SELECT needed FROM backfill_needed)
  UNION ALL
  SELECT date(date, '+1 day')
  FROM days
  WHERE date < date('now', '-1 day')
),
aggregated(date, type, name, count) AS (
  SELECT date, 'path', path, COUNT(*)
  FROM source
  WHERE path IS NOT NULL AND path != ''
  GROUP BY date, path

  UNION ALL

  SELECT date, 'country', country, COUNT(*)
  FROM source
  WHERE country IS NOT NULL AND country != ''
  GROUP BY date, country

  UNION ALL

  SELECT date, 'browser', browser, COUNT(*)
  FROM source
  GROUP BY date, browser

  UNION ALL

  SELECT date, 'ref', ref, COUNT(*)
  FROM source
  WHERE ref IS NOT NULL AND ref != ''
  GROUP BY date, ref

  UNION ALL

  SELECT days.date, 'total', 'total', COUNT(source.date)
  FROM days
  LEFT JOIN source ON source.date = days.date
  GROUP BY days.date
)
INSERT OR REPLACE INTO daily_stats (date, type, name, count)
SELECT date, type, name, count
FROM aggregated;
