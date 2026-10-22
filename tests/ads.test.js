import { test } from "node:test";
import assert from "node:assert/strict";
import { canLoadAds } from "../src/ads.js";
import { readFileSync } from "node:fs";
test("ads stay inactive without every provider and consent gate", () => {
  const live = {
    publisher: "ca-pub-3539037484563455",
    slot: "1234567890",
    adMode: "live",
    adApproved: true,
    cmpCertified: true,
  };
  assert.equal(canLoadAds(live, true), true);
  for (const key of ["adApproved", "cmpCertified"])
    assert.equal(canLoadAds({ ...live, [key]: false }, true), false);
  assert.equal(canLoadAds(live, false), false);
  assert.equal(canLoadAds({ ...live, slot: "" }, true), false);
  assert.equal(
    canLoadAds(JSON.parse(readFileSync("growth.json")), true),
    false,
  );
});
