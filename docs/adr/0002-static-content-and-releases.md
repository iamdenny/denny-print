---
title: "ADR 0002: Static content and versioned releases"
summary: "Preserve searchable routes, distinct activity identities and coherent assets"
read_when:
  - Maintaining this service or reviewing its implementation
---

# ADR 0002: Static content and versioned releases

Status: Accepted; records the existing architecture, reviewed 2026-10-25.

## Context

Six small services must publish useful multilingual pages, support browser-local tools and deploy independently. Repeated content expansions must not break established links. Cached entry points and unversioned dependencies previously risked serving mismatched behavior or styling.

## Decision

Generate `dist/` from versioned source using Node 22+ without a runtime backend. Publish meaningful HTML, metadata and structured data before client JavaScript executes. Browser modules handle tool interaction and local state. Explicit share links may expose their encoded payload; they are neither authenticated sessions nor synchronized multiplayer state.

Use stable activity identifiers and preserve published paths. Count an activity once across locales; count rendered pages separately. This service's English prefix is `/`, with `/ko/`, `/ja/` and `/es/` for the other locales. Never infer English route prefixes from a sibling repository. Existing English-only editorial routes remain English-only until genuinely translated.

`scripts/version-modules.mjs` computes a shared content version for JavaScript entry points and relative imports. `scripts/version-styles.mjs` creates content-hashed stylesheet filenames and rewrites generated HTML. Deploy the complete generated artifact through GitHub Pages; do not publish selected assets manually.

The workflow verifies pull requests, deploys pushes to `main`, and attempts release-checked IndexNow submission after deployment. Public `/release.json` provides the serving revision (`commit` for Spin/Type/Bracket, `sha` for Print/Daily/Compare). Read it after deployment and rollback. IndexNow is best-effort; inspect its job independently of the overall workflow result.

## Consequences

Static hosting and local processing keep operations small and reduce server-side handling of user input. New content requires a build; cross-repository helpers can drift because these are independent repositories. QA must validate locale parity, preset correctness, retained IDs, meaningful source citations, relative links and representative tasks.

SEO/GEO artifacts improve crawlability and expose factual context. They do not guarantee search placement, AI citations, traffic or income. Search-console ownership, provider approval and actual measurement remain separate operational checks.

## Alternatives considered

A server-rendered application with a shared database would enable centralized state but add service dependencies and a data-retention surface. Client-only route content would omit useful initial HTML. Counting translated URLs as unique activities would overstate catalog depth. Unversioned assets simplify filenames but make stale dependencies harder to detect.

## References

- [Source map](../codemap.md)
- [Operations and verification](../operations.md)
- [Latest recorded expansion](../content-expansion-300.md)
