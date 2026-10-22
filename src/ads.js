// Only enable after provider approval and a verified certified CMP integration.
export function canLoadAds(c, consent) {
  return (
    c.adMode === "live" &&
    c.adApproved === true &&
    c.cmpCertified === true &&
    /^ca-pub-\d{16}$/.test(c.publisher) &&
    /^\d{10}$/.test(c.slot) &&
    consent === true
  );
}
const el =
  typeof document === "undefined" ? null : document.querySelector("#ad-config");
if (el) {
  const c = JSON.parse(el.textContent);
  const load = () => {
    if (
      !canLoadAds(
        c,
        window.dennyCmp?.certified === true &&
          window.dennyCmp.canRequestAds?.(),
      )
    )
      return;
    const container = document.querySelector("[data-ad-placement]");
    if (!container || container.dataset.loaded) return;
    container.dataset.loaded = "true";
    container.hidden = false;
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.dataset.adClient = c.publisher;
    ins.dataset.adSlot = c.slot;
    ins.dataset.adFormat = "auto";
    ins.dataset.fullWidthResponsive = "true";
    container.append(ins);
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      c.publisher;
    document.head.append(script);
    (window.adsbygoogle ??= []).push({});
  };
  window.addEventListener("denny-consent-changed", load);
  load();
}
