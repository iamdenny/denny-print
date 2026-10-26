# Denny Print

Production: https://print.iamdenny.com/

Printable bingo, mazes, English word searches and arithmetic worksheets. Editions generate reproducible questions and answers; users can customize and print separate puzzle/answer sheets. Word searches remain English; localized controls do not imply localized word-search puzzles.

## Development

Node.js 24.22.1 (24.x), native ES modules, no runtime dependencies. Run `npm run verify` for tests, static build and SEO/link audits. Run `npm run dev` (default port 4300); set `PORT` to use another port. Generated output is `dist/`.

## Content and languages

The reviewed release contains **303 distinct activities** and **1236 indexable pages**. English starts at `/`; Korean, Japanese and Spanish use `/ko/`, `/ja/` and `/es/`. Translation variants are pages, not additional activities. Existing routes and IDs must be preserved. Historical expansion documents record earlier release counts.

## Privacy, analytics and revenue

`src/consent.js` provides one shared panel. The initial allow/reject actions save immediately; individual purpose controls and the save action appear only after customization. Advertising and analytics remain separate choices, shared across the six participating Denny services using an `iamdenny.com` cookie for up to 180 days.

GA4 is configured in `growth.json` and loads only on the production hostname after analytics permission. Adsterra uses a site-specific unit after advertising permission and provider/configuration checks. Inputs, answers and URL query/fragment payloads are excluded from the curated analytics events. AdSense remains in verification mode: `adMode: verification`, `adApproved: false`, `cmpCertified: false`, and no slot. The custom privacy panel does not enable AdSense.

Owned-service artwork promotes Games, Everyday Tools and MODU TT. Interactive content precedes the paid ad placement on narrow screens. Provider approval, ad category filtering, actual ad fill, GA receipt and revenue require separate evidence.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`: verify, upload `dist`, deploy GitHub Pages, then attempt IndexNow submission. Pull requests verify without deployment. DNS targets `iamdenny.github.io` with the service CNAME. Compare the public `/release.json` commit with the intended revision; a successful build alone is not deployment proof. See the operations guide for rollback and provider checks.

## Documentation

- [Design and UX](DESIGN.md)
- [Operations and release checks](docs/operations.md)
- [Source map](docs/codemap.md)
- [ADR 0001: shared privacy choices](docs/adr/0001-shared-privacy-choices.md)
- [ADR 0002: static content and versioned releases](docs/adr/0002-static-content-and-releases.md)
- [content-expansion-200](docs/content-expansion-200.md)
- [content-expansion-300](docs/content-expansion-300.md)
- [launch](docs/launch.md)
- [multilingual-growth](docs/multilingual-growth.md)
