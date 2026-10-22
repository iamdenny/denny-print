import { readFile } from "node:fs/promises";
const site = JSON.parse(await readFile("site.json")),
  growth = JSON.parse(await readFile("growth.json")),
  base = "https://" + site.domain;
const get = async (path) => {
  const r = await fetch(base + path, { signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw Error(`Public readback ${path}: ${r.status}`);
  return r;
};
const release = await (await get("/release.json")).json();
if (process.env.GITHUB_SHA && release.sha !== process.env.GITHUB_SHA)
  throw Error("Public release does not match deployment; skip submission.");
if (
  (await (await get("/" + growth.indexNowKey + ".txt")).text()).trim() !==
  growth.indexNowKey
)
  throw Error("Public IndexNow key mismatch");
const xml = await (await get("/sitemap.xml")).text(),
  urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host: site.domain,
    key: growth.indexNowKey,
    keyLocation: base + "/" + growth.indexNowKey + ".txt",
    urlList,
  }),
  signal: AbortSignal.timeout(20000),
});
console.log(
  JSON.stringify({
    provider: "IndexNow",
    status: r.status,
    urls: urlList.length,
    sha: release.sha,
    note: "Submission receipt does not prove indexing or ranking.",
  }),
);
if (!r.ok) process.exitCode = 1;
