import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { bingo, wordsearch } from '../src/logic.js';
const themes = JSON.parse(fs.readFileSync('src/themes.json','utf8'));
test('103 distinct print activities have usable multilingual bingo and English word searches', () => {
 assert.ok(themes.length * 2 + 3 >= 103);
 assert.equal(new Set(themes.map(t => t.id)).size,themes.length);
 for (const theme of themes) {
  for (const lang of ['en','ko','ja','es']) {
   assert.ok(theme.words[lang].length >= 24);
   assert.equal(new Set(theme.words[lang]).size,theme.words[lang].length);
   assert.equal(bingo(theme.words[lang],42).length,25);
  }
  const words=[...new Set(theme.words.en.map(w=>w.toUpperCase().replace(/[^A-Z]/g,'')))].filter(w=>w.length>=2 && w.length<=12).slice(0,10);
  for (const seed of [1,42,2026]) {
   const result=wordsearch(words,seed);
   assert.equal(result.placements.length,words.length);
   for (const p of result.placements) assert.equal([...p.word].map((_,i)=>result.grid[p.y+p.dy*i][p.x+p.dx*i]).join(''),p.word);
  }
 }
});
