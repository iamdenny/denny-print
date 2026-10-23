const search = document.querySelector("#activity-search");
search?.addEventListener("input", () => {
  const query = search.value.normalize("NFC").trim().toLocaleLowerCase();
  const cards = [...document.querySelectorAll("#activity-catalog .card")];
  for (const card of cards) card.hidden = !card.textContent.normalize("NFC").toLocaleLowerCase().includes(query);
  document.querySelector("#activity-count").textContent = `${cards.filter(card => !card.hidden).length} / ${cards.length}`;
});
