---
title: "Denny Print operations"
summary: "Current features, provider boundaries, release checks and operational follow-ups"
read_when:
  - Maintaining this service or reviewing its implementation
---

# Denny Print operations

Reviewed: 2026-10-25. This guide describes the checked-in implementation. Provider-console status is not inferred from public configuration.

## Current release evidence

The public [release record](https://print.iamdenny.com/release.json) matched source commit `539773491d531e3b3231f622f8f04ede05bbbdaf` during this review. It reported 303 activities and 1236 pages. This is a dated snapshot; subsequent documentation commits may advance the deployed revision without changing those counts.

| Setting | Reviewed value or evidence source |
| --- | --- |
| Production | `https://print.iamdenny.com` |
| GA4 measurement ID | `G-8HTTYH2LF8` in `growth.json` |
| Adsterra unit | `31866055`; configuration marks it approved |
| Public activity manifest | `/activity-manifest.json` |
| Deployment workflow | `.github/workflows/deploy.yml` |
| Availability workflow | `.github/workflows/search-health.yml` |

GA measurement IDs and public verification records are not credentials. Never add private access tokens, cookies or provider account secrets to documentation.

## Implemented workflows

Printable bingo, mazes, English word searches and arithmetic worksheets. Editions generate reproducible questions and answers; users can customize and print separate puzzle/answer sheets. Word searches remain English; localized controls do not imply localized word-search puzzles.

Owned-service artwork promotes Games, Everyday Tools and MODU TT. Interactive content precedes the paid ad placement on narrow screens.

Privacy UI transitions and storage contracts are defined in [ADR 0001](adr/0001-shared-privacy-choices.md); content, URL and cache contracts are defined in [ADR 0002](adr/0002-static-content-and-releases.md).

## Advertising and analytics boundaries

- Adsterra requires advertising permission; GA4 requires analytics permission and the production hostname. Rejecting optional purposes leaves tools usable.
- GA uses explicit page views and curated feature events. Google Signals and Google advertising personalization are disabled in the loader. GA cookies are scoped to each hostname; only the preference cookie is shared across participating sites.
- AdSense remains in verification mode: `adMode: verification`, `adApproved: false`, `cmpCertified: false`, and no slot. The custom privacy panel does not enable AdSense.
- Owned-service banners are first-party promotion, independent of third-party advertising permission. Original artwork provenance is recorded in `service-promo-assets.json`; optimized derivatives must retain their source attribution.
- Category blocking (adult, betting, casino), partner registration, ad fill and revenue must be confirmed in the relevant provider console. A support request or an approved unit is not proof that category exclusions were applied.
- GA provider receipt requires a deliberate consented Realtime/DebugView check. Script presence and a measurement ID do not prove collection.

## Search and content maintenance

Keep titles, descriptions, canonicals, reciprocal hreflang, structured data, sitemap, robots, social images, favicon and `llms.txt` consistent with visible content. Maintain source links for factual comparisons. Existing English editorial guides in the Print/Daily/Compare family are not automatically translated or treated as language equivalents.

After content edits, compare distinct activity IDs and representative payloads against the previous public manifest. Preserve old routes. Count locales separately from distinct activities. Add useful instructions and correct practice materials rather than repeated near-identical pages.

Google, Bing, Naver and Daum ownership/registration must be verified in their consoles. Verification tags prove only that the tags are served. Submitted sitemaps and IndexNow receipts do not establish indexing, rankings or GEO citations.

## Release and rollback runbook

1. Inspect the branch, worktree changes and repository-local `ghr.profile`; preserve unrelated user work. Use `ghr` for GitHub CLI operations and commit as Denny Lim.
2. Run `npm run verify`. This executes native Node tests, the static build and `scripts/check-seo.mjs`. Do not edit `dist/` by hand.
3. For UI changes, check representative pages at 320px and 390px as well as desktop. Test keyboard focus, labels, language switching, task completion, ads not covering controls and print/export where applicable.
4. In a fresh browser context, confirm that no optional provider starts before permission. Test immediate allow, immediate reject, independent custom choices, reload, expiry, withdrawal and regrant. Confirm shared preferences on a second service and recheck an already-open tab after focus returns.
5. Commit and push the reviewed changes. Verify the intended commit's build and deploy jobs using `ghr run list` / `ghr run view`. Check the IndexNow job separately: it is configured as best-effort and may fail without failing the workflow.
6. Fetch public `/release.json` and compare `commit` or `sha` to the intended revision. Open representative localized URLs and their versioned assets. A cached local build is not evidence of the serving revision.
7. To roll back, revert the offending source commit and let the same workflow verify and deploy. Confirm the new revert commit in the public release record; never declare rollback complete from the Git operation alone.

The scheduled public-health workflow runs at `22:17 UTC` (`07:17 Asia/Seoul` the following day), subject to GitHub scheduling delays. It samples localized pages and assets, checks crawlability and emits a release summary. It does not log into search consoles or measure traffic, conversion or revenue.

## Known limits and follow-up checks

- The six repositories carry copies of the consent and build helpers. Review the counterparts when changing their contracts; they are not a centrally published package.
- Consent sharing depends on cookie availability and the same browser profile. Other domains and private browsing contexts do not inherit the preference. Open tabs refresh preference state on focus/visibility; there is no server push.
- The consent panel is a fixed non-modal section with dialog semantics. Do not describe it as a native modal with an Escape handler or focus trap; those behaviors are not implemented by `src/consent.js`.
- Inspect analytics revoke/regrant without navigation before claiming it works end to end: the current loader's `loaded` guard returns before issuing a renewed analytics consent update. Withdrawal also does not erase data already processed by providers.
- No provider-console re-verification, new visual accessibility certification or ranking measurement was performed as part of this documentation review.

## Documentation maintenance

Update this guide and `DESIGN.md` when behavior changes. Preserve dated launch documents as historical records. Add an ADR for a durable architecture decision, not for each copy edit. Keep README and AGENTS documentation links valid.

These repositories do not define the AIO monorepo `docs-check:scan`, `docs-check:freshness` or VitePress setup commands. Validate Markdown, required frontmatter and relative links locally; do not add a new documentation runtime solely to run those commands. Knowledge graphs are absent at this review and are optional generated discovery artifacts, not runtime or release requirements.

Markdown style check (pinned CLI, no runtime dependency):

```sh
npx --yes markdownlint-cli2@0.24.0 "*.md" "docs/**/*.md"
```

The local lint config permits long prose/table lines and bare operational URLs, and treats frontmatter titles as metadata rather than a second rendered H1. Check relative link targets and required `title`, `summary`, `read_when` fields alongside the style check.
