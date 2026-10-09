# Clash Mi installation-channel correction — 2026-10-09

Base release and rollback source: `3daa2ec08e01c1b16f6ba00eed5e7b8aefb13430`.

## Evidence and scope

Official sources checked on 2026-10-09:

- https://clashmi.app/guide/macos — macOS uses DMG files for installation and updates; macOS 12 (Monterey) or later is required.
- https://clashmi.app/download — iPhone/iPad have App Store and TestFlight channels; macOS has separate stable and beta downloads.
- https://apps.apple.com/us/app/clash-mi/id6744321968 — the current compatibility list does not include Mac.

The Chinese and English Clash Mi guides previously grouped macOS with iOS/iPadOS for App Store/TestFlight downloads and Apple ID troubleshooting. Keep those channels scoped to iPhone/iPad, add a separate official macOS DMG section, and split FAQ item 6 by platform. Titles, permalinks, creation dates, screenshots and commercial/internal conversion links remain unchanged. No software installation or hands-on app test is claimed.

This change is independent of the pending Shadowrocket rules correction. Do not include that branch's content or trigger its checks.

## Verification and release

Run the existing type, lint, Node, selector-data, Python, build, comparison-browser, content and SEO gates. The new source tests cover platform separation, official links and preserved identity. Both language routes join release and ordinary-URL verification, including corrected rendered content, official source links and updated metadata/schema dates. The Python negative cases reject stale copy and missing source links even when the revision marker is current.

Open as a draft PR. Require successful docs CI and CodeQL for its exact head before merging. If platform startup or permissions fail, leave it unmerged; do not bypass checks, retrigger blocked workflows or change security settings. Use the existing main-branch deployment, preserve history and verify the exact release commit and corrected content. Record fresh-query verification and ordinary public-URL propagation separately; do not redeploy merely to refresh a cache check.

## Rollback

Revert this PR's eventual squash commit, pass the same checks and use the normal deployment workflow. Do not force-push main or prune cached assets. The base commit above remains the pre-change source rollback point.
