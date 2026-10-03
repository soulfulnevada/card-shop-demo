// ---------- Settings (change these to personalize the shop) ----------

const CONFIG = {
  shopName: "Gridiron & Hardwood",
  initials: "G&H",
  tagline: "Football & basketball cards",
  instagram: "",  // Seller's handle without the @. Leave empty for demo mode.
  payments: "PayPal G&S · Venmo",
  shipping: "Penny sleeve + top loader + bubble mailer, tracked. Ships in 1–2 days.",
};

// ---------- Inventory (sample data) ----------
// grader/grade: null = raw card. colors: [main, accent] used to draw the card.
// added: days since listed (lower = newer). sold: true shows the card with a SOLD stamp.

const CARDS = [
  { id: 1, sport: "NFL", player: "C.J. Stroud", team: "Texans", year: 2023, set: "Panini Prizm", num: "339", rookie: true, grader: "PSA", grade: 10, price: 185, colors: ["#03202f", "#a71930"], added: 1 },
  { id: 2, sport: "NBA", player: "Victor Wembanyama", team: "Spurs", year: 2023, set: "Panini Prizm", num: "136", rookie: true, grader: "PSA", grade: 9, price: 240, colors: ["#1b1b1b", "#c4ced4"], added: 2 },
  { id: 3, sport: "NFL", player: "Patrick Mahomes", team: "Chiefs", year: 2017, set: "Donruss Optic", num: "177", rookie: true, grader: "BGS", grade: 9.5, price: 420, colors: ["#e31837", "#ffb81c"], added: 9, sold: true },
  { id: 4, sport: "NBA", player: "Anthony Edwards", team: "Timberwolves", year: 2020, set: "Panini Prizm", num: "258", rookie: true, grader: null, grade: null, price: 65, colors: ["#0c2340", "#78be20"], added: 3 },
  { id: 5, sport: "NBA", player: "Stephen Curry", team: "Warriors", year: 2022, set: "Donruss", num: "1", rookie: false, grader: null, grade: null, price: 6, colors: ["#1d428a", "#ffc72c"], added: 14 },
  { id: 6, sport: "NFL", player: "Justin Jefferson", team: "Vikings", year: 2020, set: "Panini Mosaic", num: "211", rookie: true, grader: "PSA", grade: 9, price: 70, colors: ["#4f2683", "#ffc62f"], added: 5 },
  { id: 7, sport: "NBA", player: "LeBron James", team: "Lakers", year: 2021, set: "Panini Select", num: "48", rookie: false, grader: "SGC", grade: 9.5, price: 55, colors: ["#552583", "#fdb927"], added: 11 },
  { id: 8, sport: "NFL", player: "Caleb Williams", team: "Bears", year: 2024, set: "Panini Prizm", num: "301", rookie: true, grader: null, grade: null, price: 28, colors: ["#0b162a", "#c83803"], added: 4 },
  { id: 9, sport: "NBA", player: "Luka Dončić", team: "Mavericks", year: 2018, set: "Panini Donruss", num: "177", rookie: true, grader: "PSA", grade: 9, price: 210, colors: ["#00538c", "#b8c4ca"], added: 7 },
  { id: 10, sport: "NFL", player: "Josh Allen", team: "Bills", year: 2018, set: "Panini Prizm", num: "205", rookie: true, grader: "PSA", grade: 8, price: 160, colors: ["#00338d", "#c60c30"], added: 16, sold: true },
  { id: 11, sport: "NBA", player: "Ja Morant", team: "Grizzlies", year: 2019, set: "Panini Prizm", num: "249", rookie: true, grader: "PSA", grade: 10, price: 310, colors: ["#12173f", "#5d76a9"], added: 6 },
  { id: 12, sport: "NFL", player: "Lamar Jackson", team: "Ravens", year: 2022, set: "Donruss Optic", num: "9", rookie: false, grader: null, grade: null, price: 8, colors: ["#241773", "#9e7c0c"], added: 18 },
  { id: 13, sport: "NBA", player: "Giannis Antetokounmpo", team: "Bucks", year: 2021, set: "Panini Mosaic", num: "112", rookie: false, grader: null, grade: null, price: 12, colors: ["#00471b", "#eee1c6"], added: 13 },
  { id: 14, sport: "NFL", player: "Brock Purdy", team: "49ers", year: 2022, set: "Panini Prizm", num: "331", rookie: true, grader: "SGC", grade: 10, price: 95, colors: ["#aa0000", "#b3995d"], added: 8 },
  { id: 15, sport: "NBA", player: "Jayson Tatum", team: "Celtics", year: 2017, set: "Panini Prizm", num: "16", rookie: true, grader: "BGS", grade: 9, price: 175, colors: ["#007a33", "#ba9653"], added: 15 },
  { id: 16, sport: "NFL", player: "Ja'Marr Chase", team: "Bengals", year: 2021, set: "Panini Select", num: "52", rookie: true, grader: null, grade: null, price: 40, colors: ["#fb4f14", "#000000"], added: 10 },
  { id: 17, sport: "NBA", player: "Shai Gilgeous-Alexander", team: "Thunder", year: 2023, set: "Donruss Optic", num: "88", rookie: false, grader: null, grade: null, price: 15, colors: ["#007ac1", "#ef3b24"], added: 12 },
  { id: 18, sport: "NFL", player: "Jayden Daniels", team: "Commanders", year: 2024, set: "Donruss Optic", num: "Rated Rookie", rookie: true, grader: "PSA", grade: 9, price: 75, colors: ["#5a1414", "#ffb612"], added: 2 },
  { id: 19, sport: "NBA", player: "Nikola Jokić", team: "Nuggets", year: 2015, set: "Panini Prizm", num: "291", rookie: true, grader: "PSA", grade: 8, price: 260, colors: ["#0e2240", "#fec524"], added: 17 },
  { id: 20, sport: "NFL", player: "Puka Nacua", team: "Rams", year: 2023, set: "Panini Mosaic", num: "290", rookie: true, grader: null, grade: null, price: 22, colors: ["#003594", "#ffd100"], added: 6 },
];

// ---------- Helpers ----------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => "$" + n.toLocaleString();
const gradeLabel = (c) => (c.grader ? `${c.grader} ${c.grade}` : "Raw");
const cardTitle = (c) => `${c.year} ${c.set} ${c.player}${c.rookie ? " RC" : ""}`;
const byId = (id) => CARDS.find((c) => c.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function cardArt(c, size) {
  return `
    <div class="art art-${size} ${c.grader ? "graded" : ""}" style="--c1:${c.colors[0]};--c2:${c.colors[1]}" aria-hidden="true">
      ${c.grader ? `<div class="art-label"><b>${c.grader}</b><span>${c.grade}</span></div>` : ""}
      <div class="art-face">
        <div class="art-top"><span>${c.set}</span><span>${c.year}</span></div>
        <div class="art-ball">${c.sport === "NFL" ? "🏈" : "🏀"}</div>
        ${c.rookie ? `<div class="art-rc">RC</div>` : ""}
        <div class="art-name">${c.player}</div>
        <div class="art-team">${c.team} · #${c.num}</div>
      </div>
    </div>`;
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3500);
}

// Instagram can't pre-fill DM text, so copy the message, then open the DM thread.
async function dmSeller(message) {
  try { await navigator.clipboard.writeText(message); } catch {}
  if (!CONFIG.instagram) {
    toast("Demo mode: message copied. On the live site this opens Instagram DMs.");
    return;
  }
  toast("Message copied. Paste it into the DM!");
  window.open(`https://ig.me/m/${CONFIG.instagram}`, "_blank", "noopener");
}

// ---------- Apply settings ----------

$$(".js-shop").forEach((el) => (el.textContent = CONFIG.shopName));
$$(".js-initials").forEach((el) => (el.textContent = CONFIG.initials));
$$(".js-tagline").forEach((el) => (el.textContent = CONFIG.tagline));
$$(".js-payments").forEach((el) => (el.textContent = CONFIG.payments));
$$(".js-shipping").forEach((el) => (el.textContent = CONFIG.shipping));
$$(".js-ig").forEach((el) => (el.href = CONFIG.instagram ? `https://www.instagram.com/${CONFIG.instagram}/` : "#"));
document.title = `${CONFIG.shopName} · Sports Cards`;
$("#year").textContent = new Date().getFullYear();

// ---------- Filters ----------

const PRICE_CAP = Math.ceil(Math.max(...CARDS.map((c) => c.price)) / 5) * 5;
const SEGMENTS = { sport: ["All", "NFL", "NBA"], condition: ["All", "Graded", "Raw"] };
const GRADERS = [...new Set(CARDS.map((c) => c.grader).filter(Boolean))].sort();
const DEFAULTS = { q: "", sport: "All", condition: "All", graders: [], rookies: false, hideSold: false, max: PRICE_CAP, sort: "new" };
const state = { ...DEFAULTS, graders: [], binder: [] };

$$(".seg").forEach((seg) => {
  seg.innerHTML = SEGMENTS[seg.dataset.key].map((v) => `<button type="button" data-v="${v}">${v}</button>`).join("");
});
$("#grader-checks").innerHTML = GRADERS.map((g) => `<label class="check"><input type="checkbox" value="${g}" data-grader> ${g}</label>`).join("");
$("#max-price").max = PRICE_CAP;
$("#max-price").min = Math.ceil(Math.min(...CARDS.map((c) => c.price)) / 5) * 5;

function syncControls() {
  $$(".seg").forEach((seg) =>
    seg.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === state[seg.dataset.key])));
  $$("[data-grader]").forEach((cb) => (cb.checked = state.graders.includes(cb.value)));
  $("#rookies").checked = state.rookies;
  $("#hide-sold").checked = state.hideSold;
  $("#max-price").value = state.max;
  $("#max-label").textContent = state.max >= PRICE_CAP ? "Any" : money(state.max);
  $("#search").value = state.q;
  $("#sort").value = state.sort;
}

function activeFilterCount() {
  return [state.sport !== "All", state.condition !== "All", state.graders.length > 0,
    state.rookies, state.hideSold, state.max < PRICE_CAP].filter(Boolean).length;
}

function filteredCards() {
  const q = state.q.trim().toLowerCase();
  const sorters = {
    new: (a, b) => (a.sold - b.sold) || (a.added - b.added),
    low: (a, b) => (a.sold - b.sold) || (a.price - b.price),
    high: (a, b) => (a.sold - b.sold) || (b.price - a.price),
  };
  return CARDS.filter((c) =>
    (state.sport === "All" || c.sport === state.sport) &&
    (state.condition === "All" || (state.condition === "Graded") === !!c.grader) &&
    (!state.graders.length || state.graders.includes(c.grader)) &&
    (!state.rookies || c.rookie) &&
    (!state.hideSold || !c.sold) &&
    c.price <= state.max &&
    (!q || `${c.player} ${c.team} ${c.set} ${c.year}`.toLowerCase().includes(q))
  ).sort((a, b) => sorters[state.sort]({ ...a, sold: +!!a.sold }, { ...b, sold: +!!b.sold }));
}

function renderGrid() {
  const list = filteredCards();
  const forSale = list.filter((c) => !c.sold).length;
  $("#result-count").textContent = `${forSale} for sale${list.length > forSale ? ` · ${list.length - forSale} sold` : ""}`;
  $("#grid").innerHTML = list.length
    ? list.map((c) => `
      <button type="button" class="tile ${c.sold ? "sold" : ""}" data-id="${c.id}" aria-label="${esc(cardTitle(c))}, ${gradeLabel(c)}, ${c.sold ? "sold" : money(c.price)}">
        ${cardArt(c, "md")}
        ${c.sold ? `<span class="sold-stamp">Sold</span>` : ""}
        <div class="tile-info">
          <div class="tile-name">${c.player}</div>
          <div class="tile-meta">${c.year} ${c.set}</div>
          <div class="tile-foot"><span class="chip">${gradeLabel(c)}</span><b>${c.sold ? "Sold" : money(c.price)}</b></div>
        </div>
      </button>`).join("")
    : `<p class="empty">No cards match those filters. <button type="button" class="link-btn" data-clear>Clear filters</button></p>`;

  const n = activeFilterCount();
  $("#filter-count").hidden = n === 0;
  $("#filter-count").textContent = n;
  $("#show-results").textContent = `Show ${forSale} card${forSale === 1 ? "" : "s"}`;
}

function update() { syncControls(); renderGrid(); }

$("#search").addEventListener("input", (e) => { state.q = e.target.value; renderGrid(); });
$("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
$("#rookies").addEventListener("change", (e) => { state.rookies = e.target.checked; renderGrid(); });
$("#hide-sold").addEventListener("change", (e) => { state.hideSold = e.target.checked; renderGrid(); });
$("#max-price").addEventListener("input", (e) => { state.max = +e.target.value; update(); });
$("#grader-checks").addEventListener("change", () => {
  state.graders = [...$$("[data-grader]:checked")].map((cb) => cb.value);
  renderGrid();
});
$$(".seg").forEach((seg) => seg.addEventListener("click", (e) => {
  const v = e.target.dataset.v;
  if (v) { state[seg.dataset.key] = v; update(); }
}));

function clearFilters() {
  Object.assign(state, { ...DEFAULTS, graders: [], q: state.q, sort: state.sort });
  update();
}
$("#clear-filters").addEventListener("click", clearFilters);

// ---------- Panels: filters (phone), binder, modal ----------

let lastFocus = null;

function openPanel(el) {
  lastFocus = document.activeElement;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  $("#scrim").hidden = false;
  document.body.classList.add("locked");
  el.querySelector(".close-btn")?.focus();
}
function closePanels() {
  $$(".filters, .drawer").forEach((el) => { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); });
  $("#scrim").hidden = true;
  document.body.classList.remove("locked");
  lastFocus?.focus();
}

$("#open-filters").addEventListener("click", () => openPanel($("#filters")));
$("#close-filters").addEventListener("click", closePanels);
$("#show-results").addEventListener("click", closePanels);
$("#open-binder").addEventListener("click", () => openPanel($("#binder")));
$("#close-binder").addEventListener("click", closePanels);
$("#scrim").addEventListener("click", closePanels);

function openModal(c) {
  lastFocus = document.activeElement;
  const inBinder = state.binder.includes(c.id);
  $("#modal").innerHTML = `
    <div class="modal-card">
      <button type="button" class="close-btn" data-close aria-label="Close">✕</button>
      <div class="modal-art">${cardArt(c, "lg")}</div>
      <div class="modal-info">
        <span class="chip">${gradeLabel(c)}</span>${c.rookie ? ` <span class="chip rc">Rookie</span>` : ""}
        <h2 id="modal-title">${c.player}</h2>
        <p class="muted">${c.year} ${c.set} #${c.num} · ${c.team}</p>
        ${c.sold
          ? `<p class="price is-sold">Sold</p>
             <p class="muted">This one's gone, but I may be able to find another.</p>
             <button type="button" class="btn primary" data-dm-find="${c.id}">💬 Ask me to find one</button>`
          : `<p class="price">${money(c.price)}</p>
             <button type="button" class="btn primary" data-dm="${c.id}">💬 DM to buy</button>
             <button type="button" class="btn" data-binder="${c.id}" ${inBinder ? "disabled" : ""}>${inBinder ? "✓ In trade binder" : "🗂️ Add to trade binder"}</button>
             <p class="muted small">${CONFIG.shipping}</p>`}
      </div>
    </div>`;
  $("#modal").hidden = false;
  document.body.classList.add("locked");
  $("#modal .close-btn").focus();
}
function closeModal() {
  $("#modal").hidden = true;
  document.body.classList.remove("locked");
  lastFocus?.focus();
}

$("#grid").addEventListener("click", (e) => {
  if (e.target.closest("[data-clear]")) return clearFilters();
  const tile = e.target.closest(".tile");
  if (tile) openModal(byId(+tile.dataset.id));
});

$("#modal").addEventListener("click", (e) => {
  const t = e.target;
  if (t === $("#modal") || t.closest("[data-close]")) return closeModal();
  if (t.dataset.dm) dmSeller(`Hi! Is the ${cardTitle(byId(+t.dataset.dm))} (${gradeLabel(byId(+t.dataset.dm))}, ${money(byId(+t.dataset.dm).price)}) still available?`);
  if (t.dataset.dmFind) dmSeller(`Hi! I saw the ${cardTitle(byId(+t.dataset.dmFind))} sold. Could you find me another one?`);
  if (t.dataset.binder) {
    addToBinder(+t.dataset.binder);
    t.textContent = "✓ In trade binder";
    t.disabled = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#modal").hidden) closeModal();
  else closePanels();
});

// ---------- Trade binder ----------

function addToBinder(id) {
  if (state.binder.includes(id) || byId(id).sold) return;
  state.binder.push(id);
  renderBinder();
  toast("Added to your trade binder");
}

function renderBinder() {
  const cards = state.binder.map(byId);
  $("#binder-count").textContent = cards.length;
  const total = cards.reduce((s, c) => s + c.price, 0);
  const offer = $("#offer")?.value || "";
  $("#binder-body").innerHTML = cards.length
    ? `<ul class="binder-list">${cards.map((c) => `
        <li>${cardArt(c, "sm")}
          <div><b>${c.player}</b><br><small class="muted">${c.year} ${c.set} · ${gradeLabel(c)}</small><br>${money(c.price)}</div>
          <button type="button" data-remove="${c.id}" aria-label="Remove ${esc(c.player)}">✕</button></li>`).join("")}</ul>
      <p class="binder-total">Total value: <b>${money(total)}</b></p>
      <label class="offer">What are you offering?
        <textarea id="offer" rows="4" placeholder="e.g. 2020 Prizm Justin Herbert RC PSA 9 + $20">${esc(offer)}</textarea>
      </label>
      <button type="button" class="btn primary" id="send-trade">💬 Send trade offer by DM</button>`
    : `<p class="muted">Add cards you want from the shop, then describe what you're offering. I'll get back to you in DMs.</p>`;
}

$("#binder-body").addEventListener("click", (e) => {
  const remove = e.target.closest("[data-remove]");
  if (remove) {
    state.binder = state.binder.filter((id) => id !== +remove.dataset.remove);
    renderBinder();
  }
  if (e.target.id === "send-trade") {
    const lines = [
      "Hi! Trade offer:",
      "I'd like:",
      ...state.binder.map(byId).map((c) => `• ${cardTitle(c)} (${gradeLabel(c)}, ${money(c.price)})`),
      "I'm offering:",
      $("#offer").value.trim() || "(describe your cards)",
    ];
    dmSeller(lines.join("\n"));
  }
});

// ---------- Sell-your-collection form (Netlify Forms) ----------

$("#sell-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const msg = $("#sell-msg");
  btn.disabled = true;
  btn.textContent = "Sending…";
  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error(res.status);
    msg.textContent = "Got it! I'll look it over and reach out with an offer.";
    msg.classList.remove("error");
    form.reset();
  } catch {
    msg.textContent = "Sorry, that didn't send. Please DM me on Instagram instead.";
    msg.classList.add("error");
  }
  msg.hidden = false;
  btn.disabled = false;
  btn.textContent = "Send";
});

// ---------- Start ----------

update();
renderBinder();
