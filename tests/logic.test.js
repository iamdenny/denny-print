import { test } from "node:test";
import assert from "node:assert/strict";
import { bingo, maze, wordsearch } from "../src/logic.js";
test("bingo has a free center and 24 unique words, stable by edition", () => {
  const words = Array.from({ length: 30 }, (_, i) => "Word " + i);
  const a = bingo(words, 42);
  assert.equal(a.length, 25);
  assert.equal(a[12], "FREE");
  assert.equal(new Set(a).size, 25);
  assert.deepEqual(a, bingo(words, 42));
  assert.notDeepEqual(a, bingo(words, 43));
  assert.throws(() => bingo(["a"], 1));
});
test("maze visits every cell and solution crosses only open walls", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const { walls, path, size } = maze(14, seed);
    assert.equal(path[0], 0);
    assert.equal(path.at(-1), 195);
    const visited = new Set([0]),
      queue = [0];
    while (queue.length) {
      const i = queue.shift();
      for (const [n, d, ok] of [
        [i - size, 0, i >= size],
        [i + 1, 1, i % size < size - 1],
        [i + size, 2, i < size * (size - 1)],
        [i - 1, 3, i % size > 0],
      ])
        if (ok && !walls[i][d] && !visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
    }
    assert.equal(visited.size, 196);
    for (let j = 1; j < path.length; j++) {
      const diff = path[j] - path[j - 1];
      assert.equal(
        walls[path[j - 1]][[-size, 1, size, -1].indexOf(diff)],
        false,
      );
    }
  }
});
test("every listed search word exists at its reported placement", () => {
  for (let seed = 1; seed < 30; seed++) {
    const w = wordsearch(["OCEAN", "FOREST", "RAINBOW", "SUNSHINE"], seed);
    for (const p of w.placements)
      assert.equal(
        [...p.word]
          .map((_, i) => w.grid[p.y + p.dy * i][p.x + p.dx * i])
          .join(""),
        p.word,
      );
  }
  assert.throws(() => wordsearch(["a"], 1));
});
