import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  analyticsChoice,
  safePage,
  validMeasurement,
} from "../src/analytics.js";
test("analytics never carries query or hash inputs; consent expires", () => {
  assert.equal(
    safePage("https://example.com/ko/?email=private#words=secret"),
    "https://example.com/ko/",
  );
  const now = Date.now();
  assert.equal(
    analyticsChoice(JSON.stringify({ choice: "granted", at: now }), now),
    "granted",
  );
  for (const raw of [
    "null",
    "bad",
    JSON.stringify({ choice: "granted", at: now + 1 }),
    JSON.stringify({ choice: "granted", at: now - 181 * 86400000 }),
  ])
    assert.equal(analyticsChoice(raw, now), null);
  assert(validMeasurement("G-ABC1234567"));
  assert(!validMeasurement("G-<script>"));
});
test("every message has all locales and consistent interpolation fields", async () => {
  const messages = JSON.parse(await readFile("src/messages.json", "utf8"));
  for (const [key, values] of Object.entries(messages))
    for (const lang of ["en", "ko", "ja", "es"]) {
      assert(values[lang], `${key}: ${lang}`);
      assert.deepEqual(
        [...values[lang].matchAll(/\{\w+\}/g)].map((x) => x[0]).sort(),
        [...key.matchAll(/\{\w+\}/g)].map((x) => x[0]).sort(),
        key,
      );
    }
});
import { bingo, wordsearch, maze } from "../src/logic.js";
test("all theme translations produce playable bingo and English word searches", async () => {
  const themes = JSON.parse(await readFile("src/themes.json", "utf8"));
  for (const theme of themes)
    for (let seed = 1; seed <= 12; seed++) {
      for (const words of Object.values(theme.words))
        assert.equal(bingo(words, seed).length, 25);
      assert.equal(
        wordsearch(theme.words.en.slice(0, 10), seed).placements.length,
        10,
      );
    }
  for (const size of [10, 14, 20]) {
    const m = maze(size, 9);
    assert.equal(m.walls.length, size * size);
    assert.equal(m.path.at(-1), size * size - 1);
  }
});
