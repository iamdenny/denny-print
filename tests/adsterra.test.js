import { test } from "node:test";
import assert from "node:assert/strict";
import { readChoice, validBanner, frameUrl } from "../src/adsterra.js";
test("consent expires, rejects future or malformed records", () => {
  const now = 1800000000000;
  assert.equal(
    readChoice(JSON.stringify({ choice: "granted", at: now }), now),
    "granted",
  );
  for (const value of [
    "bad",
    "null",
    JSON.stringify({ choice: "yes", at: now }),
    JSON.stringify({ choice: "granted", at: now + 1 }),
    JSON.stringify({ choice: "granted", at: now - 181 * 86400000 }),
  ])
    assert.equal(readChoice(value, now), null);
});
test("ad frame uses an opaque origin and only issued HTTPS pattern", () => {
  const c = {
    approved: true,
    key: "a".repeat(32),
    scriptUrl: "https://bauval.org/22/" + "a".repeat(32),
  };
  assert(validBanner(c));
  assert(frameUrl(c).startsWith("data:text/html"));
  assert(decodeURIComponent(frameUrl(c)).includes("no-referrer"));
  assert(!validBanner({ ...c, approved: false }));
  assert(!validBanner({ ...c, scriptUrl: "https://example.com/script" }));
  assert.throws(() => frameUrl({ ...c, key: "<script>" }));
});
