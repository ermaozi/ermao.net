# Deployment and cached-asset safety

The `docs` workflow validates pull requests with read-only repository permissions. It does not run `pull_request_target` and the validation job receives no deployment secret. Only a main-branch push or a manually dispatched main-branch run can enter the separate deployment job after validation succeeds.

Production deployment jobs use one concurrency group with `cancel-in-progress: false`. Before publishing, the job confirms that the build commit is still main's HEAD. An outdated queued build fails instead of publishing over a newer commit.

## Compatibility with cached HTML

Observed public HTML cache lifetime on October 7, 2026 was 7200 seconds. The existing `crazy-max/ghaction-github-pages@v4` deployment with `keep_history: true` clones the published branch and overlays the new build. It currently preserves old files, including hashed assets; this patch retains that behavior. It does not add pruning, delete historical pages or assets, change Cloudflare settings, or purge caches.

Cached older HTML must still be checked against the assets it actually references. The unparameterized-URL verification below treats a missing or invalid old asset as a failure, rather than an ordinary propagation delay. Any future asset cleanup or deployment-mirroring change needs a separate retention design covering multiple releases within the public cache lifetime.

## Release versus propagation verification

`seo-regression.py --live` checks the expected commit through CDN requests containing the commit and a fresh nonce for each attempt. It validates canonical metadata, indexability, discovery files, and critical JS/CSS, including the changed traffic pages. These requests still pass through the CDN; they are not a direct-origin probe.

`seo-regression.py --canonical-status` separately checks unparameterized public URLs. Exit code 0 means those pages and their assets match the expected release. Exit code 2 means cached old pages remain, but the hashed assets those actual pages reference are still healthy. Exit code 1 means an HTTP, content, robots, or asset failure. CI reports pending propagation explicitly in a warning and job summary; a successful release-file check alone is not evidence that ordinary visitors have received the new HTML. Continue checking public URLs until propagation is established.
