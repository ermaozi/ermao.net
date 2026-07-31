# English translation workflow

This directory tracks the complete English mirror under `docs/en/`.

## Quality rules

1. Preserve factual scope, uncertainty, evidence level, prices, dates, versions,
   coupon codes, commands, configuration keys, logs, and source URLs.
2. Translate meaning rather than Chinese word order. Do not add claims,
   recommendations, or certainty that are absent from the source.
3. Keep provider and product names unchanged unless the product has an official
   English name.
4. Point translated internal links to `/en/` counterparts. External links and
   image URLs stay unchanged.
5. Every translated page must use `lang: en-US`, an `/en/` permalink, and a
   `translationOf` value containing the canonical Chinese route.
6. Code blocks, inline code, shell commands, API fields, and literal error
   messages remain exact. Translate explanatory comments only when doing so
   cannot change how the example works.
7. Review tables row by row. Numbers and units must match the Chinese source.
8. Re-run `pnpm i18n:status` after every batch and `pnpm i18n:check` only after
   the complete mirror is ready.

## Execution batches

| Batch | Scope | Source pages |
|---|---|---:|
| A | Homepage, trust pages, landing pages | 10 |
| B | Core selection guides and long-form documentation | 38 |
| C | Client and access-tool guides | 13 |
| D | Python and miscellaneous articles | 4 |
| E | News and weekly digests | 10 |
| F | Provider shutdown and risk records | 17 |
| G | Proxy-service reviews | 77 |
| **Total** |  | **169** |

The generated `status.json` is the source of truth for file-level coverage.
