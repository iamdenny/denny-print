import { t } from "./i18n.js";
import { getPreferences } from "./consent.js";
const KEY = "denny-ad-consent-v1",
  LIFETIME = 180 * 86400000;
export function readChoice(value, now = Date.now()) {
  try {
    const v = JSON.parse(value);
    return v &&
      ["granted", "denied"].includes(v.choice) &&
      Number.isFinite(v.at) &&
      v.at <= now &&
      now - v.at < LIFETIME
      ? v.choice
      : null;
  } catch {
    return null;
  }
}
export function validBanner(c) {
  return (
    c?.approved === true &&
    /^[a-f0-9]{32}$/.test(c.key) &&
    c.scriptUrl === `https://bauval.org/22/${c.key}`
  );
}
export function frameUrl(c) {
  if (!validBanner(c)) throw Error("Invalid approved ad configuration");
  const options = JSON.stringify({
    key: c.key,
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  });
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><base href="https://bauval.org/"><style>html,body{margin:0;width:300px;height:250px;overflow:hidden}</style></head><body><script>window.atOptions=${options};</script><script src="${c.scriptUrl}"></script></body></html>`;
  return "data:text/html;charset=utf-8," + encodeURIComponent(html);
}
if (typeof document !== "undefined") {
  const config = JSON.parse(document.querySelector("#ad-config").textContent),
    c = config.adsterra,
    box = document.querySelector("[data-ad-placement]");
  let choice = getPreferences()?.ads === true ? "granted" : "denied";
  function render() {
    if (!c || !validBanner(c) || !box) return;
    box.hidden = false;
    box.querySelector("[data-ad-empty]").hidden = choice === "granted";
    if (choice !== "granted") {
      box.querySelector("iframe")?.remove();
      return;
    }
    if (box.querySelector("iframe")) return;
    const iframe = document.createElement("iframe");
    iframe.title = t("Advertisement by Adsterra");
    iframe.width = "300";
    iframe.height = "250";
    iframe.style.border = "0";
    iframe.referrerPolicy = "no-referrer";
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox",
    );
    iframe.src = frameUrl(c);
    box.append(iframe);
  }
  window.addEventListener("denny-consent-changed", (event) => {
    choice = event.detail.ads ? "granted" : "denied";
    render();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      choice = getPreferences()?.ads === true ? "granted" : "denied";
      render();
    }
  });
  render();
}
