# Denny Print

Free printable bingo, mazes and word searches. Make it yours, then make their day.

Production: https://print.iamdenny.com

## Development

Node 22+, no runtime dependencies. `npm run verify`, then `npm run dev` (port 4300).

## Deployment

GitHub Actions validates and deploys `dist` to GitHub Pages on main pushes. DNS: CNAME `print.iamdenny.com` to `iamdenny.github.io`. Configure the custom domain with the Pages API and enable HTTPS after certificate issuance. Compare `/release.json` with the deployed commit. Roll back by reverting a commit and allowing the workflow to deploy.

## Revenue readiness

No ad scripts or analytics identifiers are enabled. Ad-provider approval, consent requirements and actual traffic validation are separate operational work.
