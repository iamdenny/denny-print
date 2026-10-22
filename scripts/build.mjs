import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const read = async (p) => JSON.parse(await readFile(p, "utf8"));
const s = await read("site.json"),
  growth = await read("growth.json"),
  articles = await read("content.json");
const body = await readFile("src/body.html", "utf8"),
  origin = `https://${s.domain}`;
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
await cp("src", "dist", { recursive: true });
await rm("dist/body.html");
const esc = (x) =>
  String(x)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const safeJSON = (o) => JSON.stringify(o).replaceAll("<", "\\u003c");
const publicAds = { ...growth };
delete publicAds.indexNowKey;
function page(title, desc, content, path = "", script = false) {
  const url = origin + "/" + path,
    home = path === "";
  const graph = [
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: s.name,
      inLanguage: "en",
      publisher: { "@id": origin + "/#publisher" },
    },
    {
      "@type": "Person",
      "@id": origin + "/#publisher",
      name: "Denny Lim",
      url: "https://iamdenny.com/",
    },
    {
      "@type": "WebPage",
      "@id": url + "#page",
      url,
      name: title,
      description: desc,
      isPartOf: { "@id": origin + "/#website" },
      inLanguage: "en",
      dateModified: "2026-10-22",
      author: { "@id": origin + "/#publisher" },
    },
  ];
  if (home)
    graph.push({
      "@type": "WebApplication",
      name: s.name,
      url: origin + "/",
      applicationCategory:
        s.slug === "daily" ? "GameApplication" : "UtilitiesApplication",
      operatingSystem: "Any web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  else
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: s.name, item: origin + "/" },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | ${s.name}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="${path === "404.html" ? "noindex" : "index,follow,max-image-preview:large"}"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:site_name" content="${s.name}"><meta property="og:image" content="${origin}/social.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${origin}/social.png"><meta name="google-adsense-account" content="${growth.publisher}"><meta name="theme-color" content="#f6f5f0"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><script type="application/ld+json">${safeJSON({ "@context": "https://schema.org", "@graph": graph })}</script></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="/">denny<b> ${s.slug}.</b></a><nav aria-label="Main navigation"><a href="/#play">Explore</a><a href="/guides/">Guides</a><a href="/about/">About</a></nav></header><main id="main">${script ? '<noscript><p class="panel">Enable JavaScript to use the interactive tool. Our <a href="/guides/">guides</a> explain how it works.</p></noscript>' : ""}${content}<aside class="ad-placement no-print" data-ad-placement hidden aria-label="Advertisement"><small>Advertisement</small></aside></main><footer><span>© ${new Date().getUTCFullYear()} ${s.name} · Little things, well made.</span><div><a href="/guides/">Guides</a><a href="/about/">About & contact</a><a href="/privacy/">Privacy</a><button id="ad-settings" class="secondary" type="button">Ad settings</button><a href="https://github.com/iamdenny/denny-${s.slug}">Source</a></div></footer><section id="ad-choice" class="consent no-print" aria-label="Advertising choices" hidden><p><strong>A choice about advertising.</strong> With your permission, Adsterra can display ads and process connection and device information. Your activity text and quiz answers stay separate. <a href="/privacy/">Privacy details</a></p><div class="actions"><button class="secondary" data-ad-choice="denied">Decline ads</button><button data-ad-choice="granted">Allow ads</button></div><p id="ad-choice-status" role="status"></p></section><script type="module" src="/adsterra.js"></script><script id="ad-config" type="application/json">${safeJSON(publicAds)}</script><script type="module" src="/ads.js"></script>${script ? '<script type="module" src="/app.js"></script>' : ""}</body></html>`;
}
const guideCards = articles
  .map(
    (a) =>
      `<article class="card"><h3><a href="/${a.path}/">${esc(a.title)}</a></h3><p>${esc(a.description)}</p></article>`,
  )
  .join("");
await writeFile(
  "dist/index.html",
  page(
    s.title,
    s.description,
    body +
      `<section class="info"><p class="eyebrow">A little guidance</p><h2>Explore a little further</h2>${guideCards}</section>`,
    "",
    true,
  ),
);
const pages = {
  about: [
    "Made for curious people.",
    `<p>${s.description}</p><p>${s.name} is an independent project by Denny Lim. Everything here works without an account. Our goal is to make useful, playful experiences that feel good to use.</p><h2>Editorial approach</h2><p>Guides describe the actual tool behavior. Factual comparisons name their measurement definitions, source and reference date. We correct material errors when we find them. We do not claim scientific precision beyond the cited reference data.</p><p>Questions, accessibility problems, or a correction? <a href="https://github.com/iamdenny/denny-${s.slug}/issues">Open an issue on GitHub</a>. Do not include private information in a public issue.</p><p>Free for personal and classroom use. Source code and generation logic are available in the project repository.</p>`,
  ],
  privacy: [
    "Your privacy, plainly.",
    `<p>Last updated: 22 October 2026.</p><h2>Your input and progress</h2><p>No account is required. Activity text and custom comparison values are processed in your browser. We do not operate a server that receives these inputs. Daily quiz progress is stored locally and can be removed with Reset my progress or your browser settings.</p><p>Shared links may include your chosen titles, word lists and comparison settings. Anyone with the link can read them. Avoid including private information.</p><h2>Hosting and fonts</h2><p>GitHub Pages hosts this site and processes technical connection data under <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">its privacy statement</a>. Google Fonts receives ordinary connection information to serve fonts.</p><h2>Advertising</h2><p>We use Adsterra for optional display advertising after you choose Allow ads. Ads can involve cookies, device identifiers, IP addresses and measurement by the advertising provider. The banner runs in an isolated frame and does not receive your activity text or quiz answers. Choose Decline ads to use the site without optional advertising. You can change your choice at any time through Ad settings in the footer. We store your choice in this browser for up to 180 days. Google AdSense verification identifies our publisher account, but AdSense serving is not enabled while its approval and certified consent requirements remain pending.</p><p>Provider information: <a href="https://policies.google.com/technologies/ads">Google advertising privacy</a> and <a href="https://adsterra.com/privacy-policy/">Adsterra privacy policy</a>. No analytics tracker is enabled in this launch version.</p>`,
  ],
  guides: ["A little guidance.", guideCards],
};
for (const [path, [title, content]] of Object.entries(pages)) {
  await mkdir("dist/" + path);
  await writeFile(
    "dist/" + path + "/index.html",
    page(
      title,
      `${s.name}: ${title}`,
      `<article class="info"><p class="eyebrow">${s.name}</p><h1>${title}</h1>${content}</article>`,
      path + "/",
    ),
  );
}
for (const a of articles) {
  await mkdir("dist/" + a.path);
  await writeFile(
    "dist/" + a.path + "/index.html",
    page(
      a.title,
      a.description,
      `<article class="info"><p class="eyebrow"><a href="/guides/">Guides</a> / ${s.name}</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.answer)}</p><p><a class="button" href="${esc(a.cta)}">${esc(a.action)} ↗</a></p><h2>How it works</h2><p>${esc(a.how)}</p><h2>What to know</h2><p>${a.detail}</p><p class="muted">By Denny Lim · Updated 22 October 2026</p><h2>Keep exploring</h2>${articles
        .filter((x) => x.path !== a.path)
        .map((x) => `<p><a href="/${x.path}/">${esc(x.title)}</a></p>`)
        .join("")}</article>`,
      a.path + "/",
    ),
  );
}
await writeFile(
  "dist/404.html",
  page(
    "Page not found",
    "Find your way back.",
    '<h1>Let’s get you back.</h1><p>This page does not exist.</p><a class="button" href="/">Go home</a>',
    "404.html",
  ),
);
const urls = [
  "",
  ...Object.keys(pages).map((p) => p + "/"),
  ...articles.map((a) => a.path + "/"),
].map((p) => origin + "/" + p);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc><lastmod>2026-10-22</lastmod></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/llms.txt",
  `# ${s.name}\n\n> ${s.description}\n\nFree browser-based interactive tools by Denny Lim. No account required.\n\n## Guides\n${articles.map((a) => `- [${a.title}](${origin}/${a.path}/): ${a.description}`).join("\n")}\n\n## Context\n- [About and editorial policy](${origin}/about/)\n- [Privacy](${origin}/privacy/)\n\nThis file is a navigation aid, not a guarantee of discovery or citation by an AI system.\n`,
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
let sha = process.env.GITHUB_SHA;
try {
  sha ||= execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  sha = "local";
}
await writeFile(
  "dist/release.json",
  JSON.stringify({
    sha,
    site: s.name,
    builtAt: new Date().toISOString(),
    pages: urls.length,
  }),
);
console.log(`Built ${s.name}: ${urls.length} indexable pages`);
