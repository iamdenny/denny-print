// Owned-service creative, copied locally from each public promotion kit.
export const services = [
  { id: "games", name: "Denny Games", url: "https://games.iamdenny.com/" },
  { id: "tools", name: "Everyday Tools", url: "https://tools.iamdenny.com/" },
  { id: "modutt", name: "MODU TT", url: "https://modutt.kr/busu/" },
];
export function destination(service, locale) {
  if (service.id === "modutt") return service.url;
  return service.url + (locale === "ko" ? "ko/" : "en/");
}
export function artwork(service, locale) {
  const lang = locale === "ko" ? "ko" : "en";
  const root = "/service-promo/";
  if (service.id === "games") return { wide: root + `denny-games-${lang}-970x250.png`, mobile: root + `denny-games-${lang}-320x100.png`, width: 970, height: 250, mobileWidth: 320, mobileHeight: 100, language: lang };
  if (service.id === "modutt") return { wide: root + "modutt-wide-light.svg", mobile: root + "modutt-mobile-light.svg", width: 1200, height: 300, mobileWidth: 320, mobileHeight: 100, language: "ko" };
  return { wide: root + "everyday-tools-ko-banner-1500x500.png", mobile: root + "everyday-tools-ko-banner-1500x500.png", width: 1500, height: 500, mobileWidth: 1500, mobileHeight: 500, language: "ko" };
}
export function chooseService(current, random = Math.random) {
  const choices = services.filter(service => service.id !== current);
  return choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))];
}
if (typeof document !== "undefined") {
  const banner = document.querySelector("[data-service-promo]");
  if (banner) {
    const service = chooseService(banner.dataset.servicePromo);
    const creative = artwork(service, document.documentElement.lang);
    const link = banner.querySelector("a");
    link.href = destination(service, document.documentElement.lang);
    link.setAttribute("aria-label", service.name);
    const picture = banner.querySelector("picture");
    picture.lang = creative.language;
    const source = picture.querySelector("source");
    source.srcset = creative.mobile;
    source.width = creative.mobileWidth;
    source.height = creative.mobileHeight;
    const img = picture.querySelector("img");
    img.src = creative.wide;
    img.width = creative.width;
    img.height = creative.height;
    img.alt = service.name;
  }
}
