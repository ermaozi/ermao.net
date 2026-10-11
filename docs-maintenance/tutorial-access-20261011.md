# Router and GitHub tutorial corrections — 2026-10-11

Base/rollback source: `44f477f1e4515da03ff7ad98deb9f1eb7dd59158`.

## Scope and evidence

- Replace generic Xiaomi partition writes/SSH unlock and TP-Link Reset/TFTP steps with exact model, region, hardware/firmware matching, backups and recovery prerequisites. Huawei's generic recovery upload steps are also removed. Preserve every heading, article identity, screenshot and existing commercial/navigation URL. Remove the English quotation of the old destructive command.
- OpenWrt's official device-table entry point: https://openwrt.org/toh/start . Its web response presented a bot challenge during this review, so this correction does not certify compatibility or claim a device-page installation was verified. Readers must find and verify their exact device before proceeding.
- FastGit's official farewell announces closure of most services and an end to maintenance: https://fastgit.org/ . Remove the old mirror recommendation and example, prohibit sharing passwords, tokens or private repository paths with third-party mirrors, and explain signature/checksum verification.
- GitHub states IP ranges change and its Meta API list is incomplete: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses . Google explains resolver/CDN geolocation: https://developers.google.com/speed/public-dns/faq . Different DNS answers alone cannot establish poisoning; remove hard-coded historical hosts mappings.
- Git documents `http.proxy` for the libcurl transport: https://git-scm.com/docs/git-config#Documentation/git-config.txt-httpproxy . Remove the independent `https.proxy` command and distinguish it from the environment variable.

This is documentation review, not a router flash, proxy installation, device test or network configuration change. Other historical router/provider recommendations are outside this narrow correction and are not newly verified.

## Integration and validation

PR #221 head `211b8f282f2488b1fbc95b4654ec86fd0ee4438c` conflicted with main in the shared SEO verifier and its tests. The integration retains both sets of content assertions and uses main's Git-history date validation for Shadowrocket instead of a fixed October 9 date. No empty commit, retry of the denied CodeQL run, or scan configuration change.

The JSON contracts cover Chinese/English required and forbidden body text, source links, identities, existing headings and commercial links. Negative tests reject old or incomplete content even with the correct release marker. Both new route pairs join local SEO, fresh-query release and ordinary-URL propagation checks; dates are checked against Git history. Six affected article routes are checked at 390 and 1440 pixels, with external requests blocked. Screenshots and JSON results use the existing CI artifact step.

## Release and rollback

Keep the PR draft until exact-head docs and CodeQL gates pass. Use the existing main deployment only once for the integrated batch, verifying both the precise release and ordinary-URL cache status through its CI logs. No direct production browser/script read is attempted because that path was previously denied. Do not redeploy for stale caches.

Rollback by reverting the resulting squash commit through a reviewed PR and the same normal checks/deployment. Retain history and prior assets; do not force-push main, alter credentials, DNS, permissions or security settings.
