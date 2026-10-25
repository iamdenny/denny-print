---
title: "Multilingual launch, 22 October 2026"
summary: "Historical release record; consult operations for the current implementation"
read_when:
  - Maintaining this service or reviewing its implementation
---

# Multilingual launch, 22 October 2026

> Historical record: counts, layouts and provider observations below describe that release. See [current operations](operations.md) for the reviewed implementation and outstanding verification.

- 84 indexable pages: English at `/`, Korean `/ko/`, Japanese `/ja/`, Spanish `/es/`.
- Activity catalogs expose real playable presets. Existing English editorial guides keep their original URLs and are not mislabeled as translated articles.
- Reciprocal hreflang, x-default, self-canonical URLs, localized metadata/JSON-LD and sitemap alternatives are built statically.
- GA4 property `560080384`, stream `16182240448`, measurement `G-8HTTYH2LF8` in the existing iamdenny.com account. Enhanced measurement is off. The public measurement ID is not a credential.
- Analytics loads only on the production hostname and only after explicit analytics consent. Advertising consent is independent. No URL queries, fragments, input words, custom values, or quiz answers enter analytics events.
- Page views and curated feature events use the real issued GA4 ID. Provider receipt must be verified in Realtime after deployment; code presence alone is not receipt.
- Approved Adsterra 300x250 banner moved beside content on desktop and below the introduction on narrow screens. A labeled consent placeholder is shown before permission; declining preserves all functionality. No popunder or click interception is added.
- Bing verification meta tag is included. Verification and sitemap submission are external follow-up checks after deployment.
- Google sitemap URLs remain stable. IndexNow automatically submits the expanded sitemap after Pages deployment.

Run `npm run verify`. Browser validation covers language switching, representative presets, quiz feedback, maze answers, and a 390px layout. Provider registration is separate from indexing, ad fill, and revenue.

## First-party service discovery

A labeled image banner above page content chooses one of Games, Everyday Tools or MODU TT on each page load. All artwork is copied unchanged from the existing public promotion kits at https://games.iamdenny.com/ko/promote/, https://tools.iamdenny.com/ko/promo/ and https://modutt.kr/brand. Source URLs and SHA-256 provenance are in `service-promo-assets.json`. Other owned sites are not candidates until an approved banner kit exists.

Games uses existing 970×250 and mobile 320×100 artwork in English/Korean. MODU TT uses existing 1200×300 and 320×100 SVGs. Tools uses its existing 1500×500 banner at natural aspect ratio. MODU TT and Tools currently supply Korean artwork; image language is marked explicitly while surrounding labels use the page language. Banners have keyboard focus, meaningful link names and are hidden when printing. No generated text cards, remote image requests, storage, timers or analytics are added. Initial static artwork remains a working link without JavaScript. This is owned-service promotion, independent of advertising consent and paid ad serving.
