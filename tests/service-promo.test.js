import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { services, destination, artwork, chooseService } from "../src/service-promo.js";
test("random selection reaches every eligible service and excludes self", () => {
  for (const current of [...services.map(s => s.id), "print", "daily", "compare"]) {
    const count = services.filter(s => s.id !== current).length;
    const selected = Array.from({length: count}, (_, i) => chooseService(current, () => (i + .5) / count));
    assert.equal(new Set(selected.map(s => s.id)).size, count);
    assert(selected.every(s => s.id !== current));
  }
});
test("localized destinations and responsive creative are safe local assets", async () => {
  for (const service of services) for (const locale of ["en", "ko", "ja", "es"]) {
    const target = new URL(destination(service, locale));
    assert.equal(target.protocol, "https:");
    assert.equal(target.search, "");
    assert.equal(target.hash, "");
    assert.equal(target.pathname, service.id === "modutt" ? "/busu/" : locale === "ko" ? "/ko/" : "/en/");
    const art = artwork(service, locale);
    for (const file of [art.wide, art.mobile]) assert((await readFile(`src${file}`)).length > 0);
    assert(art.width > 0 && art.height > 0 && art.mobileWidth > 0 && art.mobileHeight > 0);
  }
});
test("all existing banner assets retain exact published-source provenance", async () => {
  const assets = JSON.parse(await readFile("docs/service-promo-assets.json", "utf8"));
  for (const asset of assets) assert.equal(createHash("sha256").update(await readFile(`src/service-promo/${asset.file}`)).digest("hex"), asset.sha256);
});
