import { mathActivities, mathWorksheet } from "./math.js";
import { t, locale, country, preset } from "./i18n.js";
import { bingo, maze, wordsearch } from "./logic.js";
const $ = (s) => document.querySelector(s),
  preview = $("#preview"),
  status = $("#status");
let mode = "bingo",
  answers = false;
const original = $("#words").value;
const wordPreset =
  "OCEAN\nFOREST\nRIVER\nMOUNTAIN\nGARDEN\nFLOWER\nSUNSHINE\nRAINBOW";
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function draw() {
  try {
    const seed = Number($("#seed").value),
      count = Number($("#count").value);
    if (
      !Number.isInteger(seed) ||
      seed < 1 ||
      seed > 999999 ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 12
    )
      throw Error(t("Choose an edition from 1–999999 and 1–12 sheets."));
    let html = "";
    for (let c = 0; c < count; c++) {
      const title = esc($("#title").value || t("A little adventure"));
      let content = "";
      if (mode === "bingo") {
        content =
          '<div class="bingo">' +
          bingo($("#words").value.split("\n"), seed + c)
            .map(
              (w, i) =>
                `<span class="${i === 12 ? "free" : ""}">${esc(i === 12 ? t("FREE") : w)}</span>`,
            )
            .join("") +
          "</div>";
      } else if (mode === "math") {
        const rows=mathWorksheet($("#math-activity").value,seed+c);
        content=`<p class="math-name">${t("Name")}: ____________________ &nbsp; ${t("Date")}: __________</p><ol class="math-grid">${rows.map(q=>`<li><span>${esc(q.prompt)}</span>${answers?`<strong class="math-answer">${esc(q.answer)}</strong>`:""}</li>`).join("")}</ol>`;
      } else if (mode === "maze") {
        const size = Number($("#size").value);
        const m = maze(size, seed + c),
          step = 336 / size,
          pad = 12;
        let lines = "";
        m.walls.forEach((w, i) => {
          let x = (i % size) * step + pad,
            y = Math.floor(i / size) * step + pad;
          const coords = [
            [x, y, x + step, y],
            [x + step, y, x + step, y + step],
            [x, y + step, x + step, y + step],
            [x, y, x, y + step],
          ];
          w.forEach((wall, d) => {
            if (wall)
              lines += `<line x1="${coords[d][0]}" y1="${coords[d][1]}" x2="${coords[d][2]}" y2="${coords[d][3]}"/>`;
          });
        });
        content = `<p class="muted">${t("Start at the opening at the top. Find the exit at the bottom.")}</p><svg viewBox="0 0 360 360" role="img" aria-label="${t("Printable maze")}"><g stroke="#252821" stroke-width="1.8">${lines}</g>${answers ? `<polyline points="${m.path.map((i) => `${(i % size) * step + pad + step / 2},${Math.floor(i / size) * step + pad + step / 2}`).join(" ")}" fill="none" stroke="#c34e30" stroke-width="4"/>` : ""}</svg>`;
      } else {
        const w = wordsearch($("#words").value.split("\n"), seed + c),
          highlight = new Set();
        if (answers)
          w.placements.forEach((p) =>
            [...p.word].forEach((_, i) =>
              highlight.add(`${p.x + p.dx * i},${p.y + p.dy * i}`),
            ),
          );
        content =
          '<div class="wordgrid">' +
          w.grid
            .flatMap((row, y) =>
              row.map(
                (letter, x) =>
                  `<span${highlight.has(`${x},${y}`) ? ' style="background:#f5d9b0"' : ""}>${letter}</span>`,
              ),
            )
            .join("") +
          '</div><p class="wordlist">' +
          w.words.join(" · ") +
          "</p>";
      }
      html += `<article class="sheet"><small>DENNY PRINT / ${t({ bingo: "Bingo", maze: "Maze", words: "Word search", math: "Math" }[mode])} ${answers && mode !== "bingo" ? "· " + t("ANSWER SHEET") : ""}</small><h2>${title}</h2>${content}<small>${t("Edition {n}", { n: seed + c })} · print.iamdenny.com</small></article>`;
    }
    preview.innerHTML = html;
    status.textContent = t("{n} sheets ready.", { n: count });
    $("#print").disabled = false;
    return true;
  } catch (e) {
    status.textContent = t(e.message);
    preview.replaceChildren();
    $("#print").disabled = true;
    return false;
  }
}
function setMode(next) {
  mode = next;
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
    );
  $("#word-controls").hidden = mode === "maze" || mode === "math";
  $("#math-controls").hidden = mode !== "math";
  $("#maze-controls").hidden = mode !== "maze";
  $("#solution").hidden = mode === "bingo";
  answers = false;
  $("#solution").textContent = t("Show answers");
  $("#solution").setAttribute("aria-pressed", "false");
}
document.querySelectorAll("[data-mode]").forEach((b) =>
  b.addEventListener("click", () => {
    setMode(b.dataset.mode);
    $("#words").value =
      mode === "words"
        ? preset.mode === "words"
          ? original
          : wordPreset
        : preset.mode === "words"
          ? preset.bingoWords.join("\n")
          : original;
    draw();
  }),
);
$("#maker").addEventListener("submit", (e) => {
  e.preventDefault();
  draw();
});
$("#print").addEventListener("click", () => {
  if (draw()) window.print();
});
$("#solution").addEventListener("click", () => {
  answers = !answers;
  $("#solution").textContent = answers ? t("Hide answers") : t("Show answers");
  $("#solution").setAttribute("aria-pressed", String(answers));
  draw();
});
$("#share").addEventListener("click", async () => {
  if (!draw()) return;
  const params = new URLSearchParams({
    mode,
    title: $("#title").value,
    words: $("#words").value,
    seed: $("#seed").value,
    count: $("#count").value,
    size: $("#size").value,
    math: $("#math-activity").value,
  });
  const url = new URL(location.href);
  url.hash = params.toString();
  try {
    await navigator.clipboard.writeText(url.href);
    status.textContent = t(
      "Link copied. Your title and words are included in this link.",
    );
  } catch {
    status.textContent = t("Copy this link: ") + url.href;
  }
});
$("#math-activity").addEventListener("change",()=>{
 const selected=mathActivities.find(a=>a.id===$("#math-activity").value);
 $("#title").value=selected.title[["en","ko","ja","es"].indexOf(locale)];
 answers=false; $("#solution").textContent=t("Show answers"); $("#solution").setAttribute("aria-pressed","false"); draw();
});
const params = new URLSearchParams(location.hash.slice(1));
if(mathActivities.some(a=>a.id===params.get("math"))) $("#math-activity").value=params.get("math");
if (["bingo", "maze", "words", "math"].includes(params.get("mode")))
  setMode(params.get("mode"));
else setMode(preset.mode || "bingo");
if (mode === "words" && preset.mode !== "words") $("#words").value = wordPreset;
if (["10", "14", "20"].includes(params.get("size")))
  $("#size").value = params.get("size");
for (const key of ["title", "words", "seed", "count"])
  if (params.has(key))
    $("#" + key).value = params.get(key).slice(0, key === "words" ? 2000 : 65);
draw();
