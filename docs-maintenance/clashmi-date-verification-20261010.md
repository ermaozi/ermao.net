# Clash Mi release-date verification repair — 2026-10-10

PR #222 passed all checks at `b6bf872c71e03d331dc4bc7f4da227f8af99c2c5` and was squash-merged as `c4ce976d69508597b8a45b42c9951dff0281a1f0`. The main build and 30 browser cases passed, but its final SEO check rejected the Clash Mi modification date because it was hardcoded to October 9. The legitimate squash commit occurred October 10 UTC. The GitHub Pages deploy job was therefore skipped.

## Correct date semantics

The existing VuePress git plugin reads author timestamps for each page's followed file history and uses their maximum. The visible last-updated label, Open Graph `article:modified_time` and JSON-LD `dateModified` use that Git value. Frontmatter `updateTime` records the editorial correction separately; it does not control those generated modification dates when Git data exists. No article text, frontmatter date or metadata-generation code changes in this repair.

Replace the fixed-day assertion with exact verification against the same per-file Git author timestamp semantics during the full-history build job. Require a unique BlogPosting and modification meta tag, require those two generated dates to agree, and reject any other past/future date. The live deployment verifier compares against the exact already-validated build artifact, because the deploy checkout is shallow and cannot reproduce historical page dates. Revision and corrected-body checks stay intact.

Regression cases cover the October 9 branch date, October 10 squash date, legitimate later edits, unordered history, arbitrary wrong dates, mismatched/missing/duplicate dates, invalid/missing Git output, and live checks without consulting shallow Git history.

## Publication and rollback

Use a separate draft repair PR and require its exact-head docs and CodeQL checks before merge. Use the unchanged normal main deployment and verify both release files and ordinary public URL propagation. Revert the repair squash commit through the same gates to undo this verifier change. The content correction's pre-change rollback source remains `3daa2ec08e01c1b16f6ba00eed5e7b8aefb13430`. Do not bypass checks, rerun blocked security workflows, force-push or change deployment/security settings.
