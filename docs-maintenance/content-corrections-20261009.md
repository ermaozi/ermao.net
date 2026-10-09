# Content corrections, October 9, 2026

Base: `a784d567ed659d322bb550bce89d8d2f6fb3d5c2` (#216). This change corrects source interpretation and safety wording; it does not claim a new merchant-price or device verification.

## Source-backed scope

- Guangsu Cloud's recorded `ok88` campaign was scheduled to end January 31, 2026 at 23:59. Chinese description, FAQ JSON-LD and visible offer now identify it as historical. English FAQ no longer assumes the code is definitely expired; an extension or replacement offer remains unverified.
- Jilian: CNY 96/year, 60 GB/month. Guangsu: CNY 99/year, 59 GB/month. Annual payment and monthly allowance remain distinct in the short summaries and longer descriptions, matching the existing 2026 detail tables. Existing source dates are retained.
- Plan sync now consults the table's scoped headings, traffic and features, and protects recurring rows and mixed-category headings. Unlimited speed/devices, permanent IP/support and negated statements are not sufficient evidence.
- Regeneration retains 46 generated providers and 332 plans. Only 16 generated plan classifications change: XSUS (4), Wangji Express (3), SuperBiu (4), Runway (1), Sogo (4). All original names, prices, allowances and purchase links remain unchanged. The monthly selector still has the same 27 providers and 94 comparable plans.
- Apple guidance is corrected in both languages. Asspp's [official notice](https://github.com/Lakr233/Asspp#-special-notice) recommends secondary accounts and warns that its unofficial communication method may fail. [Apple's account guidance](https://support.apple.com/en-us/102640) distinguishes several lock/disable alerts. [Apple's Mac guidance](https://support.apple.com/en-us/102445) distinguishes unverified-developer warnings from malware or damaged-app warnings.

## Intentionally unresolved

Ermao Cloud has conflicting price, one-time-package and Telegram records. SuperBiu's provider-level one-time flag also conflicts with its archived plan table. Neither field set is guessed or newly certified here; current merchant evidence is needed. An archived one-time-plan classification does not establish present-day availability.

## Verification and release

- Dependency-free source and generator tests cover all changed classifications, scoped headings (including immediately adjacent headings), English labels, annual summaries, coupon metadata and Apple safety wording.
- Re-running the generator must reproduce `airports.ts` exactly. #216's summary length, column widths, numbering, original source ranks and bilingual layout contracts remain in place.
- Existing CI runs typecheck, lint, the full Node suite, source-backed selector tests, Python SEO tests, the full build and content audit.
- The existing Chromium gate still checks 24 built-page cases across Chinese/English and 320–1440 px, now asserting the 16 corrected plan labels and the two annual summaries. It retains light/dark screenshots and adds the annual summary rows to captured evidence.
- SEO local/live checks now include the Chinese and English Guangsu and Asspp routes, their exact build revision and critical assets. Corrected visible content and Guangsu metadata/FAQ are checked before release is called successful.
- Ordinary public URLs are checked separately. Old cached HTML with healthy referenced assets is pending propagation, not evidence that all visitors received the release.

## Rollback

Revert this PR's squash commit in a new commit on `main`; do not reset or force-push production branches. Let the existing validation and deployment workflow build and deploy the revert. Verify its exact build revision and assets, then ordinary URL propagation. #216 remains the prior known-good change. No DNS, credentials, cache rules, security permissions or deployment workflow changes are included.
