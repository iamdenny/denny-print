import assert from "node:assert/strict";
const base = "https://print.iamdenny.com";
const get = async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert(response.ok, `${path}: HTTP ${response.status}`);
  return response;
};
const release = await (await get("/release.json")).json();
const robots = await (await get("/robots.txt")).text();
assert(robots.includes(`${base}/sitemap.xml`), "robots sitemap missing");
assert(!/^Disallow:\s*\/\s*$/mi.test(robots), "site-wide crawl block");
const xml = await (await get("/sitemap.xml")).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.length >= 400, "unexpected sitemap contraction");
assert.equal(new Set(urls).size, urls.length, "duplicate sitemap URLs");
for (const url of urls) assert.equal(new URL(url).origin, base, "foreign sitemap origin");
const selected = [];
for (const lang of ["en", "ko", "ja", "es"]) {
  const localized = urls.filter(url => lang === "en"
    ? !/^\/(ko|ja|es)\//.test(new URL(url).pathname)
    : new URL(url).pathname.startsWith(`/${lang}/`));
  assert(localized.length >= 100, `missing ${lang} content`);
  selected.push(localized[0], localized[Math.floor(localized.length / 2)]);
}
const assets = new Set(["/favicon.svg"]);
for (const url of selected) {
  const html = await (await get(url)).text();
  assert(html.includes(`rel="canonical" href="${url}"`), `${url}: canonical`);
  assert(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html), `${url}: noindex`);
  assert(/<h1[ >]/.test(html), `${url}: heading`);
  assert(html.includes('application/ld+json'), `${url}: structured data`);
  assert(html.includes('hreflang="x-default"'), `${url}: language alternates`);
  assert(/name="description" content="[^"]+"/.test(html), `${url}: description`);
  for (const match of html.matchAll(/<(?:img|script)[^>]+src="(\/[^"?#]+)"/g)) assets.add(match[1]);
}
for (const asset of assets) {
  const response = await get(asset);
  assert(!response.headers.get("content-type")?.includes("text/html"), `${asset}: HTML fallback`);
  await response.arrayBuffer();
}
console.log(JSON.stringify({site: base, release: release.commit || release.sha, sitemapUrls: urls.length, pagesChecked: selected.length, assetsChecked: assets.size, checkedAt: new Date().toISOString(), note: "Availability and crawlability checks; not proof of indexing, ranking, or analytics collection."}, null, 2));
