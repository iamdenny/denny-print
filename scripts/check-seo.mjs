import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const site = JSON.parse(await readFile("site.json")),
  xml = await readFile("dist/sitemap.xml", "utf8"),
  urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const seen = new Set();
for (const url of urls) {
  const path = new URL(url).pathname,
    html = await readFile("dist" + path + "index.html", "utf8");
  assert(html.includes(`<link rel="canonical" href="${url}">`), url);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !seen.has(title), "unique title: " + url);
  seen.add(title);
  assert(html.match(/<meta name="description" content="[^"]{20,}"/));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert(!html.includes('content="noindex"'));
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/g,
  )) {
    const data = JSON.parse(match[1]);
    assert.equal(data["@context"], "https://schema.org");
    assert(data["@graph"].some((x) => x["@type"] === "WebPage"));
  }
  for (const match of html.matchAll(
    /(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g,
  )) {
    const target = match[1];
    await stat("dist" + target + (target.endsWith("/") ? "index.html" : ""));
  }
}
assert(
  (await readFile("dist/ads.txt", "utf8")).includes("pub-3539037484563455"),
);
assert((await readFile("dist/llms.txt", "utf8")).includes(site.domain));
assert((await stat("dist/social.png")).size > 1000);
console.log(
  `SEO audit passed: ${urls.length} pages, JSON-LD, links, social image, ads.txt and llms.txt`,
);
