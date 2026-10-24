const KEY = "denny-privacy-preferences-v2";
const LIFETIME = 180 * 86400000;

export function readConsentRecord(value, now = Date.now()) {
  try {
    const record = JSON.parse(value);
    return record?.version === 2 &&
      (typeof record.ads === "boolean" || record.ads === null) &&
      (typeof record.analytics === "boolean" || record.analytics === null) &&
      Number.isFinite(record.at) &&
      record.at <= now &&
      now - record.at < LIFETIME
      ? { version: 2, ads: record.ads, analytics: record.analytics, at: record.at }
      : null;
  } catch {
    return null;
  }
}

export function readLegacyChoice(value, now = Date.now()) {
  try {
    const record = JSON.parse(value);
    return ["granted", "denied"].includes(record?.choice) &&
      Number.isFinite(record.at) &&
      record.at <= now &&
      now - record.at < LIFETIME
      ? { allowed: record.choice === "granted", at: record.at }
      : null;
  } catch {
    return null;
  }
}

const copy = {
  en: {
    title: "Your privacy choices",
    intro: "Allow or reject optional advertising and usage measurement in one tap, or customize each choice. Your preference is shared across Denny services on iamdenny.com.",
    group: "Optional purposes",
    ads: "Advertising · Adsterra",
    adsDetail: "Displays ads. Adsterra may process connection and device information.",
    analytics: "Usage measurement · Google Analytics",
    analyticsDetail: "Measures page visits and feature use. We do not send names, typed text, custom values or quiz answers.",
    save: "Save choices",
    reject: "Reject optional",
    allow: "Allow all",
    customize: "Customize choices",
    privacy: "Privacy details",
    settings: "Privacy settings",
  },
  ko: {
    title: "개인정보 선택 설정",
    intro: "선택 광고와 이용 분석을 한 번에 허용·거부하거나, 세부 항목을 따로 설정할 수 있습니다. 선택은 iamdenny.com의 Denny 서비스에 공통 적용됩니다.",
    group: "선택 항목",
    ads: "광고 · Adsterra",
    adsDetail: "광고를 표시합니다. Adsterra가 접속·기기 정보를 처리할 수 있습니다.",
    analytics: "이용 분석 · Google Analytics",
    analyticsDetail: "페이지 방문과 기능 사용만 측정합니다. 이름, 입력 문장, 직접 입력한 값, 퀴즈 답변은 보내지 않습니다.",
    save: "선택 저장",
    reject: "선택 항목 거부",
    allow: "모두 허용",
    customize: "세부 설정",
    privacy: "개인정보 안내",
    settings: "개인정보 설정",
  },
  ja: {
    title: "プライバシー設定",
    intro: "任意の広告と利用状況の測定を一度に許可または拒否できます。個別に設定することもできます。設定は iamdenny.com の Denny サービスで共通です。",
    group: "任意の利用目的",
    ads: "広告 · Adsterra",
    adsDetail: "広告を表示します。Adsterra が接続情報や端末情報を処理する場合があります。",
    analytics: "利用状況の測定 · Google Analytics",
    analyticsDetail: "ページ閲覧と機能の利用を測定します。名前、入力文、独自の値、クイズの回答は送信しません。",
    save: "選択を保存",
    reject: "任意の利用を拒否",
    allow: "すべて許可",
    customize: "個別に設定",
    privacy: "プライバシーの詳細",
    settings: "プライバシー設定",
  },
  es: {
    title: "Tus opciones de privacidad",
    intro: "Permite o rechaza la publicidad y la medición de uso en un solo toque, o personaliza cada opción. La elección se comparte en los servicios de Denny en iamdenny.com.",
    group: "Opciones voluntarias",
    ads: "Publicidad · Adsterra",
    adsDetail: "Muestra anuncios. Adsterra puede procesar datos de conexión y del dispositivo.",
    analytics: "Medición de uso · Google Analytics",
    analyticsDetail: "Mide visitas y uso de funciones. No enviamos nombres, texto escrito, valores personalizados ni respuestas del cuestionario.",
    save: "Guardar opciones",
    reject: "Rechazar opcionales",
    allow: "Permitir todo",
    customize: "Personalizar opciones",
    privacy: "Detalles de privacidad",
    settings: "Privacidad",
  },
};

const storedConfig = typeof document === "undefined"
  ? {}
  : JSON.parse(document.querySelector("#config, #ad-config")?.textContent || "{}");
const lang = typeof document === "undefined" ? "en" : document.documentElement.lang.split("-")[0];
const text = copy[lang] || copy.en;

function readCookie() {
  if (typeof document === "undefined") return null;
  const entry = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(KEY + "="));
  try { return entry ? decodeURIComponent(entry.slice(KEY.length + 1)) : null; } catch { return null; }
}

function readLegacy() {
  if (typeof localStorage === "undefined") return null;
  const isAppFamily = Boolean(document.querySelector("#config"));
  const adKey = isAppFamily ? "denny-adsterra-choice-v1" : "denny-ad-consent-v1";
  const analyticsKey = isAppFamily
    ? "denny-" + (storedConfig.kind || location.hostname.split(".")[0]) + "-analytics-v1"
    : "denny-analytics-consent-v1";
  let ads = null;
  let analytics = null;
  try { ads = readLegacyChoice(localStorage.getItem(adKey)); } catch {}
  try { analytics = readLegacyChoice(localStorage.getItem(analyticsKey)); } catch {}
  if (ads && analytics) {
    return { version: 2, ads: ads.allowed, analytics: analytics.allowed, at: Math.min(ads.at, analytics.at) };
  }
  if (ads || analytics) {
    return {
      ads: ads?.allowed ?? null,
      analytics: analytics?.allowed ?? null,
      at: Math.min(ads?.at ?? Date.now(), analytics?.at ?? Date.now()),
    };
  }
  return null;
}

export function getPreferences() {
  if (typeof document === "undefined") return null;
  const cookie = readConsentRecord(readCookie());
  if (cookie) return cookie;
  try {
    const local = readConsentRecord(localStorage.getItem(KEY));
    if (local) return local;
  } catch {}
  const legacy = readLegacy();
  if (legacy?.version === 2) return savePreferences(legacy, false);
  return legacy;
}

function dispatchPreferences(record) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("denny-consent-changed", {
      detail: { ads: record.ads === true, analytics: record.analytics === true },
    }));
  }
}

export function savePreferences(preferences, dispatch = true) {
  const record = {
    version: 2,
    ads: preferences.ads === null ? null : preferences.ads === true,
    analytics: preferences.analytics === null ? null : preferences.analytics === true,
    at: Number.isFinite(preferences.at) ? preferences.at : Date.now(),
  };
  if (typeof document !== "undefined") {
    const domain = location.hostname === "iamdenny.com" || location.hostname.endsWith(".iamdenny.com")
      ? "; Domain=.iamdenny.com"
      : "";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = KEY + "=" + encodeURIComponent(JSON.stringify(record)) +
      "; Max-Age=" + Math.floor(LIFETIME / 1000) + "; Path=/; SameSite=Lax" + domain + secure;
    try { localStorage.setItem(KEY, JSON.stringify(record)); } catch {}
  }
  if (dispatch) dispatchPreferences(record);
  return record;
}

if (typeof document !== "undefined") {
  const panel = document.querySelector("#privacy-consent");
  if (panel) {
    const title = document.createElement("h2");
    title.id = "privacy-title";
    title.textContent = text.title;
    const intro = document.createElement("p");
    intro.id = "privacy-intro";
    intro.textContent = text.intro;
    const group = document.createElement("fieldset");
    group.className = "privacy-options";
    const legend = document.createElement("legend");
    legend.textContent = text.group;
    group.append(legend);
    for (const [name, heading, description] of [
      ["ads", text.ads, text.adsDetail],
      ["analytics", text.analytics, text.analyticsDetail],
    ]) {
      const label = document.createElement("label");
      label.className = "privacy-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.consentChoice = name;
      const copyBlock = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = heading;
      const small = document.createElement("small");
      small.textContent = description;
      copyBlock.append(strong, small);
      label.append(input, copyBlock);
      group.append(label);
    }
    const privacy = document.createElement("a");
    privacy.className = "privacy-link";
    privacy.textContent = text.privacy;
    const isAppFamily = Boolean(document.querySelector("#config"));
    privacy.href = isAppFamily ? "/" + lang + "/privacy/" : lang === "en" ? "/privacy/" : "/" + lang + "/privacy/";
    const actions = document.createElement("div");
    actions.className = "privacy-actions";
    const button = (key, label, className = "") => {
      const item = document.createElement("button");
      item.type = "button";
      item.dataset[key] = "";
      item.textContent = label;
      if (className) item.className = className;
      return item;
    };
    const customize = button("consentCustomize", text.customize, "secondary");
    const save = button("consentSave", text.save, "secondary");
    save.hidden = true;
    actions.append(
      button("consentAllow", text.allow),
      button("consentReject", text.reject, "secondary"),
      customize,
      save,
    );
    const status = document.createElement("p");
    status.className = "privacy-status";
    status.setAttribute("role", "status");
    const content = document.createElement("div");
    content.className = "privacy-content";
    content.append(title, intro, group, privacy);
    panel.replaceChildren(content, actions, status);
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", title.id);
    panel.setAttribute("aria-describedby", intro.id);
    for (const item of document.querySelectorAll("#privacy-settings, #analytics-settings, #ad-settings, [data-open-consent], [data-open-ads]")) {
      item.textContent = text.settings;
      item.addEventListener("click", open);
    }
    function open() {
      const current = getPreferences();
      panel.querySelector('[data-consent-choice="ads"]').checked = current?.ads === true;
      panel.querySelector('[data-consent-choice="analytics"]').checked = current?.analytics === true;
      group.hidden = true;
      customize.hidden = false;
      save.hidden = true;
      panel.hidden = false;
      actions.querySelector("[data-consent-allow]").focus();
    }
    function commit(values) {
      savePreferences(values);
      panel.hidden = true;
      group.hidden = true;
      customize.hidden = false;
      save.hidden = true;
      status.textContent = "";
    }
    customize.addEventListener("click", () => {
      group.hidden = false;
      customize.hidden = true;
      save.hidden = false;
      panel.querySelector('[data-consent-choice="ads"]').focus();
    });
    actions.querySelector("[data-consent-save]").addEventListener("click", () => {
      commit({
        ads: panel.querySelector('[data-consent-choice="ads"]').checked,
        analytics: panel.querySelector('[data-consent-choice="analytics"]').checked,
      });
    });
    actions.querySelector("[data-consent-reject]").addEventListener("click", () => commit({ ads: false, analytics: false }));
    actions.querySelector("[data-consent-allow]").addEventListener("click", () => commit({ ads: true, analytics: true }));
    window.dennyOpenConsent = open;
    window.addEventListener("focus", () => {
      const current = getPreferences();
      if (current && (current.ads !== null && current.analytics !== null)) dispatchPreferences(current);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        const current = getPreferences();
        if (current && current.ads !== null && current.analytics !== null) dispatchPreferences(current);
      }
    });
    const current = getPreferences();
    const config = storedConfig.adsterra || {};
    const adsActive = config.approved === true && /^[a-f0-9]{32}$/i.test(config.key || "");
    const measurementId = storedConfig.measurementId;
    const analyticsActive = /^G-[A-Z0-9]{6,15}$/.test(measurementId || "") &&
      location.hostname === (storedConfig.domain || storedConfig.siteDomain);
    const needsAdsChoice = adsActive && current?.ads == null;
    const needsAnalyticsChoice = analyticsActive && current?.analytics == null;
    if (needsAdsChoice || needsAnalyticsChoice) open();
  }
}
