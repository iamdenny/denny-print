export const locale =
  typeof document === "undefined" ? "en" : document.documentElement.lang;
const messages =
  typeof document === "undefined"
    ? {}
    : JSON.parse(
        document.querySelector("#locale-messages")?.textContent || "{}",
      );
export function t(key, values = {}) {
  return (messages[key] || key).replace(
    /\{(\w+)\}/g,
    (match, name) => values[name] ?? match,
  );
}
export function country(code, fallback = code) {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "region" }).of(code) || fallback
    );
  } catch {
    return fallback;
  }
}
export const preset =
  typeof document === "undefined"
    ? {}
    : JSON.parse(document.querySelector("#page-preset")?.textContent || "{}");
