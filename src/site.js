for (const link of document.querySelectorAll("[data-language]")) {
  const target = new URL(link.href);
  target.hash = location.hash;
  link.href = target.href;
}
