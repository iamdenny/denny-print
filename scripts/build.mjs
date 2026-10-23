import { services, destination, artwork } from "../src/service-promo.js";
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tool, esc, json } from "./views.mjs";
const read = async (p) => JSON.parse(await readFile(p, "utf8"));
const s = await read("site.json"),
  growth = await read("growth.json"),
  messages = await read("src/messages.json"),
  articles = await read("content.json");
const origin = `https://${s.domain}`,
  langs = ["en", "ko", "ja", "es"],
  names = { en: "English", ko: "한국어", ja: "日本語", es: "Español" };
const url = (lang, path = "") =>
  origin + (lang === "en" ? "/" : `/${lang}/`) + path;
const local = (lang, path = "") => (lang === "en" ? "/" : `/${lang}/`) + path;
const trans =
  (lang) =>
  (key, v = {}) =>
    (messages[key]?.[lang] || key).replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m);
const themes = s.slug === "print" ? await read("src/themes.json") : [];
const daily = s.slug === "daily" ? await import("../src/logic.js") : null;
const packs = s.slug === "daily" ? (await import("../src/packs.js")).packs : [];
const categories =
  s.slug === "compare" ? (await import("../src/data.js")).categories : {};
const titleKey = {
  print: "Free printable activities",
  daily: "Daily flag quiz & practice",
  compare: "Compare countries, planets & heights",
}[s.slug];
const descKey = {
  print:
    "Make bingo cards, solvable mazes and English word searches. Customize, share and print in your browser.",
  daily:
    "Five new flags each UTC day. Learn country names in your language and practice by region without changing your daily streak.",
  compare:
    "Explore sourced measurements with proportional shapes, exact ratios and downloadable SVG images. Choose a pair or enter your own reference.",
}[s.slug];
const countryCodes = {
  kor: "KR",
  jpn: "JP",
  deu: "DE",
  ind: "IN",
  aus: "AU",
  bra: "BR",
  usa: "US",
};
const itemName = (item, lang) =>
  countryCodes[item[0]]
    ? new Intl.DisplayNames([lang], { type: "region" }).of(
        countryCodes[item[0]],
      )
    : trans(lang)(item[1]);
const fmt = (n, lang) => n.toLocaleString(lang, { maximumFractionDigits: 3 });
const printHow =
  "Choose a title and 1–12 sheets. Each sheet uses the next edition number. Print the puzzle first, then reveal the answers for a separate teaching copy.";
const bingoHow =
  "Choose a caller and decide whether a line or a full card wins. Call the words in random order. The center square is free, and each card contains 24 different entries.";
const ratioHow =
  "Ratio = first value ÷ second value. For areas, side lengths use the square root of the area ratio. Diameter and height use a linear scale.";
const compareHow =
  "Choose another pair, swap objects or enter a custom reference. Shared links preserve your settings; SVG downloads preserve the labels and exact values.";
const practiceHow =
  "Five questions are drawn from this group. Each has four choices from the same group. Review the names and flags below, then try a new round.";
const practiceNote =
  "Country names are localized. Flag emoji appearance depends on your device. Practice rounds do not save scores or change daily progress.";
function catalog(lang) {
  const t = trans(lang),
    out = [];
  if (s.slug === "print") {
    for (const th of themes)
      for (const mode of ["bingo", "words"]) {
        const words =
          mode === "bingo"
            ? th.words[lang]
            : th.words.en.slice(0, 10).map((x) => x.toUpperCase());
        const title = t(
          mode === "bingo"
            ? "{theme} bingo cards"
            : "{theme} English word search",
          { theme: t(th.name) },
        );
        const desc = t(
          mode === "bingo"
            ? "Ready-made vocabulary for a {theme} activity. Edit the words, choose an edition and print a different card for each player."
            : "Find the {n} English words from the {theme} list in a 12 × 12 grid. Words run right, down or diagonally down-right. An answer sheet is included.",
          { theme: t(th.name), n: words.length },
        );
        out.push({
          path: `${mode === "bingo" ? "bingo" : "word-search"}/${th.id}/`,
          title,
          desc,
          preset: { mode, words, title, bingoWords: th.words[lang] },
          body: `<h2>${t("Word list")}</h2><ul class="word-catalog">${words.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h2>${t("How it works")}</h2><p>${t(printHow)}</p><p>${mode === "bingo" ? t(bingoHow) : t("Bingo needs 24 unique words. Word search uses 3–12 words, A–Z only, up to 12 letters each.")}</p>`,
        });
      }
    for (const [i, size] of [10, 14, 20].entries()) {
      const title = t("{theme} maze · {size} × {size}", {
        theme: t(["Easy", "Medium", "Challenging"][i]),
        size,
      });
      out.push({
        path: `maze/${["easy", "medium", "challenging"][i]}/`,
        title,
        desc: t(
          "This maze has {size} × {size} cells and one route from top to bottom. Change the edition to make another puzzle of the same size.",
          { size },
        ),
        preset: { mode: "maze", size, title, words: themes[0].words[lang] },
        body: `<h2>${t("How it works")}</h2><p>${t(printHow)}</p><p>${t("Start at the opening at the top. Find the exit at the bottom.")}</p>`,
      });
    }
  }
  if (s.slug === "daily")
    for (const pack of packs) {
      const pool = daily.countries.filter(
        (c) => !pack.codes || pack.codes.includes(c[0]),
      );
      out.push({
        path: `practice/${pack.id}/`,
        title: t("{region} flag practice", { region: t(pack.name) }),
        desc: t(
          "Learn {n} country flags from {region}, then answer five questions with localized country names. Play again with a new selection.",
          { region: t(pack.name), n: pool.length },
        ),
        preset: { pack: pack.id },
        body: `<h2>${t("Countries in this pack")}</h2><ul class="flag-catalog">${pool.map((c) => `<li><span aria-hidden="true">${daily.emoji(c[0])}</span> ${esc(new Intl.DisplayNames([lang], { type: "region" }).of(c[0]))}</li>`).join("")}</ul><h2>${t("How it works")}</h2><p>${t(practiceHow)}</p><p>${t(practiceNote)}</p>`,
      });
    }
  if (s.slug === "compare")
    for (const [category, c] of Object.entries(categories))
      for (let i = 0; i < c.items.length; i++)
        for (let j = i + 1; j < c.items.length; j++) {
          const a = c.items[i],
            b = c.items[j],
            an = itemName(a, lang),
            bn = itemName(b, lang),
            ratio = a[2] / b[2],
            ratioText =
              ratio < 0.001 ? ratio.toExponential(2) : fmt(ratio, lang);
          const title =
            t("{a} vs {b}", { a: an, b: bn }) + " · " + t(c.dimension);
          out.push({
            path: `${category}/${a[0]}-vs-${b[0]}/`,
            title,
            desc:
              t("{a} has {ratio} times the {dimension} of {b}.", {
                a: an,
                b: bn,
                ratio: ratioText,
                dimension: t(c.dimension),
              }) +
              " " +
              t(
                "Choose another pair, swap objects or enter a custom reference. Shared links preserve your settings; SVG downloads preserve the labels and exact values.",
              ),
            preset: { category, first: a[0], second: b[0] },
            body: `<h2>${t("Measurement")}: ${t(c.dimension)}</h2><table class="data-table"><thead><tr><th>${t("First object")}</th><th>${t("Value")}</th></tr></thead><tbody>${[a, b].map((x) => `<tr><th>${esc(itemName(x, lang))}</th><td>${fmt(x[2], lang)} ${c.unit}</td></tr>`).join("")}</tbody></table><p>${fmt(a[2], lang)} ÷ ${fmt(b[2], lang)} ≈ ${ratioText}</p><h2>${t("Sources & method")}</h2><p>${t(c.note)}</p><p>${t(ratioHow)}</p><p><a href="${c.source}">${category === "area" ? "World Bank · 2024" : category === "space" ? "NASA Planetary Fact Sheet" : "Eiffel Tower"}</a>${category === "height" ? ' · <a href="https://www.skyscrapercenter.com/building/burj-khalifa/3">CTBUH · Burj Khalifa</a>' : ""}</p><p>${t(compareHow)}</p>`,
          });
        }
  return out;
}
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
await cp("src", "dist", { recursive: true });
await rm("dist/body.html");
const publicConfig = { ...growth, siteDomain: s.domain };
delete publicConfig.indexNowKey;
const pages = [];
function frame(
  lang,
  path,
  title,
  desc,
  content,
  preset = null,
  alternates = langs,
) {
  const t = trans(lang),
    u = url(lang, path),
    home = path === "";
  const graph = [
    {
      "@type": "WebSite",
      "@id": url(lang) + "#website",
      url: url(lang),
      name: s.name,
      inLanguage: lang,
    },
    {
      "@type": "WebPage",
      "@id": u + "#page",
      url: u,
      name: title,
      description: desc,
      inLanguage: lang,
      isPartOf: { "@id": url(lang) + "#website" },
      dateModified: "2026-10-22",
      author: {
        "@type": "Person",
        name: "Denny Lim",
        url: "https://iamdenny.com/",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: s.name, item: url(lang) },
        ...(!home
          ? [{ "@type": "ListItem", position: 2, name: title, item: u }]
          : []),
      ],
    },
  ];
  if (preset)
    graph.push({
      "@type": "WebApplication",
      name: title,
      url: u,
      inLanguage: lang,
      applicationCategory:
        s.slug === "daily" ? "GameApplication" : "UtilitiesApplication",
      operatingSystem: "Any web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  const localized = Object.fromEntries(
    Object.entries(messages).map(([k, v]) => [k, v[lang]]),
  );
  const promoted = services.find(service => service.id !== s.slug);
  const creative = artwork(promoted, lang);
  const promotion = `<aside class="service-promo no-print" data-service-promo="${s.slug}" aria-label="${esc(t("From the same maker"))}"><small>${esc(t("From the same maker"))}</small><a href="${destination(promoted, lang)}" referrerpolicy="no-referrer" aria-label="${esc(promoted.name)}"><picture lang="${creative.language}"><source media="(max-width: 600px)" srcset="${creative.mobile}" width="${creative.mobileWidth}" height="${creative.mobileHeight}"><img src="${creative.wide}" width="${creative.width}" height="${creative.height}" alt="${esc(promoted.name)}" decoding="async"></picture></a></aside>`;
  const ad = `<aside class="ad-placement no-print" data-ad-placement aria-label="${t("Advertisement")}"><small>${t("Advertisement")}</small><div class="ad-empty" data-ad-empty><p>${t("Ads appear here after permission. You can keep using every tool without ads.")}</p><button class="secondary" type="button" data-open-ads>${t("Ad settings")}</button></div></aside>`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | ${s.name}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="${path === "404.html" ? "noindex" : "index,follow,max-image-preview:large"}"><link rel="canonical" href="${u}">${alternates.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, path)}">`).join("")}${alternates.length ? `<link rel="alternate" hreflang="x-default" href="${url("en", path)}">` : ""}<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${u}"><meta property="og:locale" content="${{ en: "en_US", ko: "ko_KR", ja: "ja_JP", es: "es_ES" }[lang]}"><meta property="og:image" content="${origin}/social.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${origin}/social.png">${growth.bingVerification ? `<meta name="msvalidate.01" content="${esc(growth.bingVerification)}">` : ""}${growth.naverVerification ? `<meta name="naver-site-verification" content="${esc(growth.naverVerification)}">` : ""}<meta name="google-adsense-account" content="${growth.publisher}"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph })}</script></head><body><a class="skip" href="#main">${t("Skip to content")}</a><header><a class="brand" href="${local(lang)}">denny<b> ${s.slug}.</b></a><nav aria-label="${t("Main navigation")}"><a href="${local(lang, "activities/")}">${t("Explore")}</a><a href="${local(lang, "guides/")}">${t("Guides")}</a><a href="${local(lang, "about/")}">${t("About")}</a></nav><nav class="languages" aria-label="${t("Language")}">${(alternates.length ? alternates : langs).map((l) => `<a data-language href="${local(l, alternates.includes(l) ? path : "")}" lang="${l}" hreflang="${l}"${l === lang ? ' aria-current="page"' : ""}>${names[l]}</a>`).join("")}</nav></header><main id="main">${promotion}<div class="page-layout"><div class="page-content">${preset ? `<noscript><p>${t("Enable JavaScript to use this interactive tool.")}</p></noscript>` : ""}${content}</div>${ad}</div></main><footer><span>© 2026 ${s.name}</span><div><a href="${local(lang, "about/")}">${t("About & contact")}</a><a href="${local(lang, "privacy/")}">${t("Privacy")}</a><button id="ad-settings" class="secondary">${t("Ad settings")}</button><button id="analytics-settings" class="secondary">${t("Analytics settings")}</button><a href="https://github.com/iamdenny/denny-${s.slug}">${t("Source")}</a></div></footer><section id="ad-choice" class="consent no-print" aria-label="${t("Advertising choices")}" hidden><p><strong>${t("A choice about advertising.")}</strong> ${t("With your permission, Adsterra can display ads and process connection and device information. Your activity text and quiz answers stay separate.")} <a href="${local(lang, "privacy/")}">${t("Privacy details")}</a></p><div class="actions"><button class="secondary" data-ad-choice="denied">${t("Decline ads")}</button><button data-ad-choice="granted">${t("Allow ads")}</button></div><p id="ad-choice-status" role="status"></p></section><section id="analytics-choice" class="consent no-print" aria-label="${t("Analytics settings")}" hidden><p>${t("Help improve these tools with optional Google Analytics. We send page paths and feature names, never your words, custom values or quiz answers.")}</p><div class="actions"><button class="secondary" data-analytics-choice="denied">${t("Decline analytics")}</button><button data-analytics-choice="granted">${t("Allow analytics")}</button></div></section><script id="locale-messages" type="application/json">${json(localized)}</script><script id="page-preset" type="application/json">${json(preset || {})}</script><script id="ad-config" type="application/json">${json(publicConfig)}</script><script type="module" src="/site.js"></script><script type="module" src="/service-promo.js"></script><script type="module" src="/adsterra.js"></script><script type="module" src="/analytics.js"></script><script type="module" src="/ads.js"></script>${preset ? '<script type="module" src="/app.js"></script>' : ""}</body></html>`;
}
async function emit(
  lang,
  path,
  title,
  desc,
  content,
  preset = null,
  alternates = langs,
) {
  const dir = "dist" + local(lang, path);
  await mkdir(dir, { recursive: true });
  await writeFile(
    dir + "index.html",
    frame(lang, path, title, desc, content, preset, alternates),
  );
  pages.push({ lang, path, title, url: url(lang, path), alternates });
}
for (const lang of langs) {
  const t = trans(lang),
    items = catalog(lang),
    cards = (list) =>
      `<div class="catalog-grid">${list.map((p) => `<article class="card"><h3><a href="${local(lang, p.path)}">${esc(p.title)}</a></h3><p>${esc(p.desc)}</p></article>`).join("")}</div>`;
  const hero = (title, desc) =>
    `<section class="hero"><p class="eyebrow">${t("Free tools. No account required.")}</p><h1>${esc(title)}</h1><p class="lead">${esc(desc)}</p></section>`;
  const defaultPreset =
    s.slug === "print" ? { words: themes[0].words[lang] } : {};
  await emit(
    lang,
    "",
    t(titleKey),
    t(descKey),
    hero(t(titleKey), t(descKey)) +
      tool(s.slug, t, defaultPreset) +
      `<section class="info"><h2>${t("All activities")}</h2>${cards(items.slice(0, 9))}<p><a class="button" href="${local(lang, "activities/")}">${t("All activities")} (${items.length}) →</a></p></section>`,
    defaultPreset,
  );
  for (const p of items)
    await emit(
      lang,
      p.path,
      p.title,
      p.desc,
      hero(p.title, p.desc) +
        tool(s.slug, t, p.preset) +
        `<article class="info">${p.body}<p class="muted">${t("Updated 22 October 2026 · Denny Lim")}</p><h2>${t("Related activities")}</h2>${cards(items.filter((x) => x.path !== p.path && x.path.split("/")[0] === p.path.split("/")[0]).slice(0, 6))}</article>`,
      p.preset,
    );
  await emit(
    lang,
    "activities/",
    t("All activities"),
    t(descKey),
    hero(t("All activities"), t(descKey)) + cards(items),
  );
  await emit(
    lang,
    "guides/",
    t("Guides"),
    t(descKey),
    hero(t("Guides"), t(descKey)) +
      `<article class="info"><h2>${t("How it works")}</h2>${(s.slug === "print" ? [printHow, bingoHow, "Bingo needs 24 unique words. Word search uses 3–12 words, A–Z only, up to 12 letters each."] : s.slug === "daily" ? [practiceHow, practiceNote] : [compareHow, ratioHow]).map((k) => `<p>${t(k)}</p>`).join("")}</article>` +
      cards(items) +
      (lang === "en"
        ? `<section class="info">${articles.map((a) => `<p><a href="/${a.path}/">${esc(a.title)}</a></p>`).join("")}</section>`
        : ""),
  );
  await emit(
    lang,
    "about/",
    t("About these tools"),
    t(descKey),
    hero(t("About these tools"), t("Free tools. No account required.")) +
      `<article class="info"><p>${t("Independent tools by Denny Lim. No account is required. Activities run in your browser. Source code and issue tracking are public; do not put private information in public issues.")}</p><p>${t("Guides describe implemented behavior. Comparisons cite measurement definitions and sources. Localized pages keep the same underlying data and functionality. Corrections are welcome through the repository.")}</p><a href="https://github.com/iamdenny/denny-${s.slug}/issues">GitHub Issues</a></article>`,
  );
  const privacy = [
    [
      "Your input and progress",
      "Inputs are processed locally. Daily progress stays in this browser. Shared links include the settings you choose, so avoid private information. Reset progress or clear site data to remove local records.",
    ],
    [
      "Hosting and fonts",
      "GitHub Pages hosts this site. Google Fonts supplies fonts. These providers receive ordinary connection information such as IP addresses under their own privacy policies.",
    ],
    [
      "Advertising and analytics",
      "Optional Adsterra ads load only after advertising permission. Optional Google Analytics loads only after analytics permission. Providers may process cookies, device and connection information. Choices are stored for up to 180 days and can be changed in the footer. Refusing does not restrict any tool. AdSense is not served while approval is pending.",
    ],
  ];
  await emit(
    lang,
    "privacy/",
    t("Privacy"),
    t(
      "Inputs are processed locally. Daily progress stays in this browser. Shared links include the settings you choose, so avoid private information. Reset progress or clear site data to remove local records.",
    ),
    hero(t("Privacy"), t("Updated 22 October 2026 · Denny Lim")) +
      `<article class="info">${privacy.map(([h, p]) => `<h2>${t(h)}</h2><p>${t(p)}</p>`).join("")}<p>${t("Analytics receives page paths and feature names. We exclude URL queries, URL fragments, user-entered text, custom values and quiz answers. Withdrawing consent stops future collection on this site; it does not remove data already processed by the provider.")}</p><ul><li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub</a></li><li><a href="https://policies.google.com/privacy">Google</a></li><li><a href="https://adsterra.com/privacy-policy/">Adsterra</a></li></ul></article>`,
  );
}
// Keep existing published English guides at their established URLs. Do not claim untranslated articles as language equivalents.
for (const a of articles)
  await emit(
    "en",
    a.path + "/",
    a.title,
    a.description,
    `<article class="info"><h1>${esc(a.title)}</h1><p class="lead">${esc(a.answer)}</p><a class="button" href="${esc(a.cta)}">${esc(a.action)} ↗</a><h2>How it works</h2><p>${esc(a.how)}</p><h2>What to know</h2><p>${a.detail}</p><p><a href="/activities/">All activities</a></p></article>`,
    null,
    ["en"],
  );
await writeFile(
  "dist/404.html",
  frame(
    "en",
    "404.html",
    "Page not found",
    "Find your way back to our free tools.",
    '<h1>Page not found</h1><a href="/">Go home</a>',
    null,
    [],
  ),
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${pages.map((p) => `<url><loc>${p.url}</loc>${p.alternates.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(l, p.path)}"/>`).join("")}<xhtml:link rel="alternate" hreflang="x-default" href="${url("en", p.path)}"/><lastmod>2026-10-22</lastmod></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  "dist/llms.txt",
  `# ${s.name}\n\n> ${trans("en")(descKey)}\n\n## Languages\n${langs.map((l) => `- [${names[l]}](${url(l)})`).join("\n")}\n\n## Activities and reference pages\n${pages
    .filter((p) => p.lang === "en")
    .map((p) => `- [${p.title}](${p.url})`)
    .join(
      "\n",
    )}\n\nGenerated comparisons use stated reference measurements, not maps or volumes. This file is a navigation aid, not a guarantee of AI citation.\n`,
);
await writeFile(
  "dist/ads.txt",
  `google.com, ${growth.publisher.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`,
);
await writeFile(`dist/${growth.indexNowKey}.txt`, growth.indexNowKey);
await writeFile(
  "dist/favicon.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#252821"/><text x="19" y="47" fill="white" font-size="48" font-family="sans-serif">d</text></svg>',
);
const sha =
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
await writeFile(
  "dist/release.json",
  json({
    sha,
    site: s.name,
    builtAt: new Date().toISOString(),
    pages: pages.length,
    languages: langs,
  }),
);
console.log(
  `Built ${s.name}: ${pages.length} indexable pages in ${langs.length} languages`,
);
