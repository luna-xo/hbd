const qs = (sel, root = document) => root.querySelector(sel);

function initNameFromQuery() {
  const url = new URL(window.location.href);
  const name = url.searchParams.get("name");
  const el = qs("#tlName");
  if (name && el) el.textContent = `${name}’s timeline`;
}

window.addEventListener("DOMContentLoaded", () => {
  initNameFromQuery();
});

