# Provider information corrections, 2026-10-09

Base: `c1a1b6dac45926f6a0771f83804845230ec47d95`.

## Evidence and scope

- Ermao Cloud's old `t.me/ermaov1` destination could not be attributed to the merchant: a public preview showed a wallet-verification template without provider information. Withdraw that unverified Telegram entry without guessing a replacement. The merchant's purchase link, recorded price, package flags and other providers' links are unchanged. No wallet link, login or signature was used.
- SuperBiu's public [price notice](https://t.me/biubiugroup/482) says prices increased while node multipliers decreased and directs readers to the current plan page. It does not establish exact new prices.
- The [entrance notice](https://t.me/biubiugroup/473) describes a move from OPT to three-carrier CN2 entrances. The [protocol notice](https://t.me/biubiugroup/469) describes replacing VLESS with AnyTLS. These are merchant statements, not independently tested architecture or performance.
- [The redesigned panel notice](https://t.me/biubiugroup/483) says plan listings show the default billing period's price. Check the billing period before interpreting the amount.
- Exact notice publication dates and current one-time-plan availability were not established. October 9 is the source-review date. February 24 is the previous article version's date, not a newly established test date.

## Changes

Retain both articles, permalinks, affiliate destinations, historical price tables and images. Replace unsupported current-price/line claims in titles, descriptions, excerpts and FAQs with evidence-bounded wording. FAQ questions and answers match visible text in both languages.

The shared source now displays `Price unverified` / `现价待核实`. The four historical one-time plans keep their exact prices, traffic, purchase destinations and classification. A historical-record date produces bilingual table notices and historical-price labels, and prevents archived monthly plans from entering the monthly comparison tool. The current tool remains 27 providers and 94 comparable plans. The generated catalog remains 46 providers and 332 plans. Original table widths and list order are unchanged.

## Verification and release

Local checks cover the 66 Node tests, 18 Python SEO contract tests, TypeScript, lint, source-plan consistency and a 399-page build. Source-only local checkout lacks Git history, so the complete generated-date SEO gate must run in the official PR checkout. New tests assert the preserved price rows, unknown current availability, historical monthly exclusion, bilingual FAQ alignment and withdrawn Telegram link. The existing 24 Chinese/English browser cases at 320–1440px also assert the history notice and labels.

Both SuperBiu routes join the existing release and public-cache verification gate. Deployment must wait for the full PR checks and 24 browser cases on the final commit. After the main-branch deployment, check fresh-query release files and unparameterized public URLs separately. A passing release check does not establish ordinary-URL cache propagation.

Rollback: revert this correction's merge commit, run the same checks and publish through the existing workflow. The base revision above and GitHub Pages history remain available. No credentials, access, DNS, cache configuration or deployment permissions are changed.
