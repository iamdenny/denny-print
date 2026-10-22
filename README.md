# Denny Print

Free printable bingo, mazes and word searches. Make it yours, then make their day.

Production: https://print.iamdenny.com

## Development

Node 22+, no runtime dependencies. `npm run verify`, then `npm run dev` (port 4300).

## Deployment

GitHub Actions validates and deploys `dist` to GitHub Pages on main pushes. DNS: CNAME `print.iamdenny.com` to `iamdenny.github.io`. Configure the custom domain with the Pages API and enable HTTPS after certificate issuance. Compare `/release.json` with the deployed commit. Roll back by reverting a commit and allowing the workflow to deploy.

## Revenue readiness

Adsterra uses an approved site-specific banner behind explicit visitor consent. AdSense verification metadata and seller records are present; AdSense serving remains disabled pending its approval and certified CMP integration. SEO/GEO includes static guides, JSON-LD, Open Graph, sitemap, robots, llms.txt and release-checked IndexNow submission. No analytics identifier is configured. See docs/launch.md for provider and validation evidence.

## Languages and growth

English, Korean, Japanese and Spanish activity pages are generated at build time. See [multilingual growth](docs/multilingual-growth.md) for catalogs, analytics, advertising and search registration.
