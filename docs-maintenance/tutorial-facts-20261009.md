# Telegram and 9eSIM Chinese tutorial corrections — 2026-10-09

Base release: `9c5d1af6a3617024646b8d94f22884b5aa1483a1` (PR #219).

## Evidence and scope

Official sources checked on 2026-10-09:

- https://telegram.org/faq#q-how-does-2-step-verification-work — separate login password and local application lock.
- https://core.telegram.org/api/auth — the server chooses verification channels; email setup is conditional.
- https://www.9esim.com/en/faq — blank physical hardware, compatible SIM tray and separately obtained profiles; current delivery estimate and checkout-calculated shipping.
- https://esimplus.me/terms — March 20, 2026 terms, Worldwide duration and metered charges, regional data-only services and third-party verification limits.

Only the two Chinese guides and their verification contracts change. Titles, permalinks, creation dates, every historical screenshot, purchase/referral URLs and code remain intact. Existing English content stays unchanged and is checked for aligned core facts. Historical prices and screenshots are labeled as historical; no new purchase, registration, delivery or reception test is claimed. The eSIM description no longer advertises a new 2026 hands-on test or guaranteed long-term number retention.

## Verification

Run the complete existing type, lint, Node, selector-data, Python, build, 30-case comparison browser, content and SEO gates. New Node contracts check both corrected concepts and preserved article identity. Add both language variants to release and ordinary-URL coverage, with rendered Chinese body assertions and consistent updated metadata/schema dates. GitHub CI and CodeQL must succeed for the exact PR head before ready/merge.

Production verification uses the existing deployment workflow. Record the merge SHA, workflow and deployment IDs, fresh-query verification and ordinary URL results separately. Do not treat fresh CDN query keys as direct-origin evidence or a guarantee of ordinary URL propagation, and do not redeploy solely to refresh a cache check. No promised SEO or revenue improvement.

## Rollback

Revert this PR's squash commit, then pass the same gates and allow the normal deployment workflow to publish the rollback. Do not force-push main, edit hosting/security settings or prune cached assets. Previous release source is the base SHA above; GitHub Pages retains deployment history and old hashed assets under the existing policy.
