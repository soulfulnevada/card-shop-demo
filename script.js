// ---------- Settings (change these to personalize the shop) ----------

const CONFIG = {
  shopName: "Gridiron & Hardwood",
  initials: "G&H",
  tagline: "Football & basketball cards",
  instagram: "",  // Seller's handle without the @. Leave empty for demo mode.
  payments: "PayPal G&S · Venmo",
  shipping: "Penny sleeve + top loader + bubble mailer, tracked. Ships in 1–2 days.",

  // Where the inventory comes from. Paste the Google Sheet's "Publish to web" CSV link here
  // (see SHEET-SETUP.md). The sample file is used until then.
  inventoryUrl: "inventory-sample.csv",
};

// Every card comes from the inventory sheet. Columns (header names, any order):
// player, sport, team, year, set, number, rookie, grader, grade, price, status, date_added, photo, notes, colors
let CARDS = [];

// ---------- Helpers ----------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const money = (n) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
const gradeLabel = (c) => (c.grader ? `${c.grader} ${c.grade ?? ""}`.trim() : "Raw");
const cardTitle = (c) => `${c.year || ""} ${c.set} ${c.player}${c.rookie ? " RC" : ""}`.trim();
const byId = (id) => CARDS.find((c) => c.id === id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const SPORT_ICONS = { NFL: "🏈", NBA: "🏀", WNBA: "🏀", MLB: "⚾", NHL: "🏒" };
const FALLBACK_COLORS = [
  ["#1d3557", "#e63946"], ["#14213d", "#fca311"], ["#2b2d42", "#8d99ae"], ["#003049", "#f77f00"],
  ["#283618", "#dda15e"], ["#3a0ca3", "#4cc9f0"], ["#432818", "#bb9457"], ["#0b525b", "#99e2b4"],
];
const HEX = /^#[0-9a-f]{3,8}$/i;

// Same team always gets the same colors when the sheet doesn't specify them.
function colorsFor(team, given) {
  const parts = (given || "").split("/").map((s) => s.trim());
  if (parts.length === 2 && parts.every((p) => HEX.test(p))) return parts;
  const hash = [...(team || "x")].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

// Accepts direct image links and Google Drive share links. Anything else is ignored.
function imageUrl(raw) {
  const s = (raw || "").trim();
  const drive = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1000`;
  return /^https:\/\//i.test(s) ? s : "";
}

function cardArt(c, size) {
  const drawn = `
    <div class="art art-${size} ${c.grader ? "graded" : ""}" style="--c1:${c.colors[0]};--c2:${c.colors[1]}" aria-hidden="true">
      ${c.grader ? `<div class="art-label"><b>${esc(c.grader)}</b><span>${esc(c.grade ?? "")}</span></div>` : ""}
      <div class="art-face">
        <div class="art-top"><span>${esc(c.set)}</span><span>${esc(c.year || "")}</span></div>
        <div class="art-ball">${SPORT_ICONS[c.sport] || "🃏"}</div>
        ${c.rookie ? `<div class="art-rc">RC</div>` : ""}
        <div class="art-name">${esc(c.player)}</div>
        <div class="art-team">${esc(c.team)}${c.num ? ` · #${esc(c.num)}` : ""}</div>
      </div>
    </div>`;
  if (!c.photo) return drawn;
  // Real photo on top of the drawn card; if the photo fails to load, the drawn card shows instead.
  return `
    <div class="photo-wrap art-${size}">
      ${drawn}
      <img class="card-photo" src="${esc(c.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">
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

// ---------- Loading the inventory sheet ----------

// Minimal CSV parser: handles quoted fields, commas and line breaks inside quotes, and "" escapes.
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim()));
}

function rowsToCards(rows) {
  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const yes = (v) => /^(y|yes|true|1|x|✓|✔)$/i.test((v || "").trim());
  const num = (v) => { const n = parseFloat(String(v || "").replace(/[$,\s]/g, "")); return Number.isFinite(n) ? n : null; };

  return body.map((cells, i) => {
    const r = Object.fromEntries(keys.map((k, j) => [k, (cells[j] || "").trim()]));
    const price = num(r.price);
    if (!r.player || price === null) return null; // skip half-filled rows
    const grader = r.grader ? r.grader.toUpperCase() : null;
    const listed = Date.parse(r.date_added);
    return {
      id: i + 1,
      player: r.player,
      sport: (r.sport || "Other").toUpperCase(),
      team: r.team || "",
      year: parseInt(r.year, 10) || null,
      set: r.set || "",
      num: r.number || "",
      rookie: yes(r.rookie),
      grader,
      grade: grader ? num(r.grade) : null,
      price,
      sold: /^sold$/i.test(r.status),
      listed: Number.isFinite(listed) ? listed : 0,
      row: i,
      photo: imageUrl(r.photo),
      notes: r.notes || "",
      colors: colorsFor(r.team, r.colors),
    };
  }).filter(Boolean);
}

async function loadInventory() {
  const url = CONFIG.inventoryUrl + (CONFIG.inventoryUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (/^\s*</.test(text)) throw new Error("Got a web page instead of CSV. Is the sheet published as CSV?");
  return rowsToCards(parseCSV(text));
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

let PRICE_CAP = 0;
let PRICE_FLOOR = 0;
const SEGMENTS = { sport: ["All"], condition: ["All", "Graded", "Raw"] };
let DEFAULTS = {};
const state = { binder: [] };

// Built after the inventory loads, since sports, graders and prices come from the sheet.
function setupFilters() {
  const prices = CARDS.map((c) => c.price);
  PRICE_CAP = Math.max(5, Math.ceil(Math.max(...prices, 0) / 5) * 5);
  PRICE_FLOOR = Math.min(PRICE_CAP, Math.ceil(Math.min(...prices, PRICE_CAP) / 5) * 5);
  SEGMENTS.sport = ["All", ...new Set(CARDS.map((c) => c.sport))];
  const graders = [...new Set(CARDS.map((c) => c.grader).filter(Boolean))].sort();

  DEFAULTS = { q: "", sport: "All", condition: "All", graders: [], rookies: false, hideSold: false, max: PRICE_CAP, sort: "new" };
  Object.assign(state, { ...DEFAULTS, graders: [] });

  $$(".seg").forEach((seg) => {
    seg.innerHTML = SEGMENTS[seg.dataset.key].map((v) => `<button type="button" data-v="${esc(v)}">${esc(v)}</button>`).join("");
  });
  $("#grader-checks").innerHTML = graders.length
    ? graders.map((g) => `<label class="check"><input type="checkbox" value="${esc(g)}" data-grader> ${esc(g)}</label>`).join("")
    : `<p class="muted small">No graded cards right now.</p>`;
  $("#max-price").max = PRICE_CAP;
  $("#max-price").min = PRICE_FLOOR;
}

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
  const newest = (a, b) => (b.listed - a.listed) || (b.row - a.row);
  const sorters = {
    new: newest,
    low: (a, b) => (a.price - b.price) || newest(a, b),
    high: (a, b) => (b.price - a.price) || newest(a, b),
  };
  return CARDS.filter((c) =>
    (state.sport === "All" || c.sport === state.sport) &&
    (state.condition === "All" || (state.condition === "Graded") === !!c.grader) &&
    (!state.graders.length || state.graders.includes(c.grader)) &&
    (!state.rookies || c.rookie) &&
    (!state.hideSold || !c.sold) &&
    c.price <= state.max &&
    (!q || `${c.player} ${c.team} ${c.set} ${c.year}`.toLowerCase().includes(q))
  ).sort((a, b) => (a.sold - b.sold) || sorters[state.sort](a, b)); // sold cards always last
}

function renderGrid() {
  const list = filteredCards();
  const forSale = list.filter((c) => !c.sold).length;
  $("#result-count").textContent = `${forSale} for sale${list.length > forSale ? ` · ${list.length - forSale} sold` : ""}`;
  $("#grid").innerHTML = list.length
    ? list.map((c) => `
      <button type="button" class="tile ${c.sold ? "sold" : ""}" data-id="${c.id}" aria-label="${esc(cardTitle(c))}, ${esc(gradeLabel(c))}, ${c.sold ? "sold" : money(c.price)}">
        ${cardArt(c, "md")}
        ${c.sold ? `<span class="sold-stamp">Sold</span>` : ""}
        <div class="tile-info">
          <div class="tile-name">${esc(c.player)}</div>
          <div class="tile-meta">${esc(`${c.year || ""} ${c.set}`.trim())}</div>
          <div class="tile-foot"><span class="chip">${esc(gradeLabel(c))}</span><b>${c.sold ? "Sold" : money(c.price)}</b></div>
        </div>
      </button>`).join("")
    : CARDS.length
      ? `<p class="empty">No cards match those filters. <button type="button" class="link-btn" data-clear>Clear filters</button></p>`
      : `<p class="empty">No cards listed right now. Check back soon!</p>`;

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
        <span class="chip">${esc(gradeLabel(c))}</span>${c.rookie ? ` <span class="chip rc">Rookie</span>` : ""}
        <h2 id="modal-title">${esc(c.player)}</h2>
        <p class="muted">${esc([`${c.year || ""} ${c.set}`.trim() + (c.num ? ` #${c.num}` : ""), c.team].filter(Boolean).join(" · "))}</p>
        ${c.notes ? `<p class="notes">${esc(c.notes)}</p>` : ""}
        ${c.sold
          ? `<p class="price is-sold">Sold</p>
             <p class="muted">This one's gone, but I may be able to find another.</p>
             <button type="button" class="btn primary" data-dm-find="${c.id}">💬 Ask me to find one</button>`
          : `<p class="price">${money(c.price)}</p>
             <button type="button" class="btn primary" data-dm="${c.id}">💬 DM to buy</button>
             <button type="button" class="btn" data-binder="${c.id}" ${inBinder ? "disabled" : ""}>${inBinder ? "✓ In trade binder" : "🗂️ Add to trade binder"}</button>
             <p class="muted small">${esc(CONFIG.shipping)}</p>`}
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
  if (t.dataset.dm) {
    const c = byId(+t.dataset.dm);
    dmSeller(`Hi! Is the ${cardTitle(c)} (${gradeLabel(c)}, ${money(c.price)}) still available?`);
  }
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
          <div><b>${esc(c.player)}</b><br><small class="muted">${esc(`${c.year || ""} ${c.set}`.trim())} · ${esc(gradeLabel(c))}</small><br>${money(c.price)}</div>
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

renderBinder();
$("#grid").innerHTML = `<p class="empty">Loading cards…</p>`;
loadInventory()
  .then((cards) => { CARDS = cards; })
  .catch((err) => {
    console.error("Inventory failed to load:", err);
    $("#grid").innerHTML = `<p class="empty">Couldn't load the card list right now. Please try again in a minute, or DM me on Instagram.</p>`;
  })
  .finally(() => {
    setupFilters();
    if (CARDS.length || !$("#grid").textContent.includes("Couldn't")) update();
  });
