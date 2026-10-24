import test from 'node:test';
import assert from 'node:assert/strict';
import {readConsentRecord, readLegacyChoice} from '../src/consent.js';

test('shared preferences retain separate optional purposes for six services', () => {
  const now = 1_800_000_000_000;
  const value = JSON.stringify({version: 2, ads: false, analytics: true, at: now});
  assert.deepEqual(readConsentRecord(value, now), {
    version: 2, ads: false, analytics: true, at: now,
  });
});

test('shared and legacy choices expire and reject malformed or future records', () => {
  const now = 1_800_000_000_000;
  const valid = {version: 2, ads: true, analytics: null, at: now};
  assert.equal(readConsentRecord(JSON.stringify({...valid, at: now - 180 * 86400000}), now), null);
  assert.equal(readConsentRecord(JSON.stringify({...valid, at: now + 1}), now), null);
  assert.equal(readConsentRecord(JSON.stringify({...valid, ads: 'yes'}), now), null);
  assert.equal(readConsentRecord('{broken', now), null);
  assert.equal(readLegacyChoice(JSON.stringify({choice: 'denied', at: now}), now)?.allowed, false);
  assert.equal(readLegacyChoice(JSON.stringify({choice: 'granted', at: now - 180 * 86400000}), now), null);
  assert.equal(readLegacyChoice(JSON.stringify({choice: 'allow', at: now}), now), null);
});
