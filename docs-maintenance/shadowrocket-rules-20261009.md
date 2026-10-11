# Shadowrocket configuration corrections — 2026-10-09

Base and rollback source: `3daa2ec08e01c1b16f6ba00eed5e7b8aefb13430` (PR #220).

## Verified source facts

- Johnshall release snapshot: https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever/tree/e2200b2369531a648eaf2b2db99cf9dd13ba4bbd
- The complete `lazy_group.conf` ends its Rule section with `GEOIP,CN,DIRECT` and `FINAL,PROXY`. Policy groups select proxy or direct policies; the default is not blacklist/direct behavior.
- All 34 enabled RULE-SET references were fetched in full on 2026-10-09. Their 47,286 active lines contain no nested RULE-SET/DOMAIN-SET imports or advertising-blocking rejection policies. No active DOMAIN-SET or include imports exist in the root file. The large Global.list was read via its Git blob `eea63a14f2aa75ddc43f2bc7e9b39dc58f82053e`, rather than treating the empty Contents API response as an empty file. The adjacent JSON manifest records URLs, policies, counts and SHA-256 fingerprints.
- This is specifically an absence of advertising-blocking rules. The root configuration has unsupported-UDP rejection and QUIC blocking settings, so it must not be described as having no rejection/blocking of any kind.
- The same release README distinguishes lazy profiles from separately labeled ad-blocking variants and disclaims complete ad removal. It documents scheduled 8 a.m. Beijing-time publication, not guaranteed refresh on a user's device.
- The lazy profile's upstream maintainer documents routing modes and separate configuration, module and server-subscription updates: https://github.com/LOWERTOP/Shadowrocket/blob/3537f928451038ba74258eccbb6d9bd7865628dd/README.md . Updating a remote configuration can overwrite local changes; Use/Compile Configuration refreshes referenced resources. This is the maintainer's community manual, not an official vendor manual.

## Scope and evidence boundaries

Correct the Chinese article and matching English translation. Preserve main titles, permalinks, translation identity, creation times, screenshot and existing commercial/navigation targets. Explain the proxy fallback, separate ad-blocking profiles, Config routing-mode activation, backup and update distinctions. Remove unsupported deterministic claims about traffic leaks, account bans, ad removal, load time and a fixed 50% data saving. No device setting or user network configuration was changed.

The work is a source/configuration review. It does not claim an iPhone test, performance benchmark, successful account registration, a particular advertising outcome, an SEO ranking improvement or revenue gain. Remote rule sets can change after the recorded review.

## Verification and release procedure

Run source contracts plus the complete existing type, lint, Node, selector-data, Python, site-build, comparison-browser, content and SEO gates. New rendered-body assertions cover both article routes in local checks, fresh-query release verification and ordinary-URL propagation checks. Preserve update-date consistency with the generated BlogPosting metadata.

Before merge, recheck main and open changes, wait for docs CI and CodeQL on the exact head SHA, and merge through the existing deployment workflow. Verify the resulting production revision and corrected article bodies. Keep fresh-query CDN evidence distinct from unparameterized public URLs; do not call propagation complete while ordinary URLs remain stale. No additional deployment just to refresh cache evidence.

## Rollback

Revert this PR's squash commit and use the same checks and normal deployment workflow. Do not force-push main, alter credentials, DNS, hosting/security permissions or prune old assets. The source rollback point is the base SHA above; the existing GitHub Pages workflow retains deployment history and cached-asset compatibility.
