import { t } from "./i18n.js";
const KEY = "denny-analytics-consent-v1",
  TTL = 180 * 86400000;
export function analyticsChoice(raw, now = Date.now()) {
  try {
    const c = JSON.parse(raw);
    return ["granted", "denied"].includes(c?.choice) &&
      Number.isFinite(c.at) &&
      c.at <= now &&
      now - c.at < TTL
      ? c.choice
      : null;
  } catch {
    return null;
  }
}
export function safePage(raw) {
  const u = new URL(raw);
  return u.origin + u.pathname;
}
export function validMeasurement(id) {
  return /^G-[A-Z0-9]{6,15}$/.test(id || "");
}
if (typeof document !== "undefined") {
  const config = JSON.parse(document.querySelector("#ad-config").textContent),
    id = location.hostname === config.siteDomain ? config.measurementId : null,
    panel = document.querySelector("#analytics-choice");
  let loaded = false,
    choice = null;
  const read = () => {
    try {
      return analyticsChoice(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  };
  choice = read();
  function send() {
    window.dataLayer ||= [];
    window.dataLayer.push(arguments);
  }
  function apply() {
    if (!validMeasurement(id)) return;
    window["ga-disable-" + id] = choice !== "granted";
    if (choice !== "granted" || loaded) return;
    loaded = true;
    send("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    send("consent", "update", { analytics_storage: "granted" });
    send("js", new Date());
    send("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safePage(location.href),
      page_referrer: document.referrer ? safePage(document.referrer) : "",
      cookie_domain: location.hostname,
    });
    send("event", "page_view", {
      page_location: safePage(location.href),
      page_title: document.title,
      page_referrer: document.referrer ? safePage(document.referrer) : "",
      language: document.documentElement.lang,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.append(script);
  }
  const open = () => {
    if (!validMeasurement(id)) return;
    document.querySelector("#ad-choice").hidden = true;
    panel.hidden = false;
    panel.querySelector("button").focus();
  };
  document
    .querySelector("#analytics-settings")
    ?.addEventListener("click", open);
  document.addEventListener("ad-choice-saved", () => {
    if (choice === null) open();
  });
  if (
    validMeasurement(id) &&
    choice === null &&
    document.querySelector("#ad-choice").hidden
  )
    panel.hidden = false;
  for (const b of document.querySelectorAll("[data-analytics-choice]"))
    b.addEventListener("click", () => {
      const wasLoaded = loaded;
      choice = b.dataset.analyticsChoice;
      try {
        localStorage.setItem(KEY, JSON.stringify({ choice, at: Date.now() }));
      } catch {}
      panel.hidden = true;
      apply();
      if (wasLoaded && choice !== "granted") location.reload();
    });
  document.addEventListener("click", (e) => {
    if (choice !== "granted" || !loaded) return;
    if (e.target.closest("[data-discovery-link]")) send("event", "select_discovery", { page_location: safePage(location.href), language: document.documentElement.lang });
    const b = e.target.closest("button");
    if (!b) return;
    const actions = {
      print: "print_activity",
      download: "download_svg",
      share: "share_result",
      next: "quiz_next",
    };
    const event =
      actions[b.id] ||
      (b.dataset.mode
        ? "select_activity"
        : b.dataset.category
          ? "select_comparison"
          : null);
    if (event)
      send("event", event, {
        page_location: safePage(location.href),
        language: document.documentElement.lang,
      });
  });
  document.addEventListener("submit", (e) => {
    if (
      choice === "granted" &&
      loaded &&
      ["maker", "compare-form"].includes(e.target.id)
    )
      send("event", "tool_used", {
        tool: e.target.id,
        page_location: safePage(location.href),
        language: document.documentElement.lang,
      });
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === null) {
      choice = read();
      apply();
      if (loaded && choice !== "granted") location.reload();
    }
  });
  apply();
}
