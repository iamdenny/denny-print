# Multilingual launch, 22 October 2026

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
