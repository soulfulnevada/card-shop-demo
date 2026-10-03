// PROTOTYPE Variant C: "Trade desk". Trade builder is the primary affordance.
// Dense sortable inventory table on the left, sticky trade slip with a value balance on the right.
(() => {
  const state = { q: "", chips: new Set(), sortKey: "added", sortDir: 1, get: [], give: [] };
  const CHIPS = [
    { k: "NFL", test: (c) => c.sport === "NFL" }, { k: "NBA", test: (c) => c.sport === "NBA" },
    { k: "Graded", test: (c) => !!c.grader }, { k: "Raw", test: (c) => !c.grader },
    { k: "Rookies", test: (c) => c.rookie }, { k: "$100+", test: (c) => c.price >= 100 },
  ];
  const COLS = [
    { k: "player", label: "Player" }, { k: "year", label: "Year / Set" },
    { k: "grade", label: "Grade" }, { k: "price", label: "Price" },
  ];
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="c-top">
      <div><span class="c-mark">G&H</span> <b>${CONFIG.shopName}</b> <span class="c-sub">Trade Desk</span></div>
      <button class="c-ask" id="c-ask">💬 Ask a question</button>
    </header>
    <div class="c-hero">
      <h1>Build a trade. See where it stands. Send it in one tap.</h1>
      <p>Pick cards you want, add what you're offering, and the slip shows how the values line up.</p>
    </div>
    <div class="c-layout">
      <section class="c-inv">
        <div class="c-controls">
          <input type="search" id="c-q" placeholder="Filter by player, team, set…">
          <div class="c-chips">${CHIPS.map((c) => `<button data-chip="${c.k}">${c.k}</button>`).join("")}</div>
        </div>
        <table class="c-table">
          <thead><tr><th></th>${COLS.map((c) => `<th><button data-sort="${c.k}">${c.label} <i></i></button></th>`).join("")}<th></th></tr></thead>
          <tbody id="c-rows"></tbody>
        </table>
      </section>

      <aside class="c-slip" id="c-slip">
        <h2>Trade slip</h2>
        <div class="c-side">
          <h3>You get <span id="c-get-total"></span></h3>
          <ul id="c-get" class="c-list"></ul>
        </div>
        <div class="c-side">
          <h3>You give <span id="c-give-total"></span></h3>
          <ul id="c-give" class="c-list"></ul>
          <form id="c-give-form" class="c-give-form">
            <input name="desc" placeholder="Your card, e.g. 2020 Prizm Herbert RC PSA 9" required>
            <input name="value" type="number" min="0" step="1" placeholder="$ value" required>
            <button>Add</button>
          </form>
          <button class="c-cash" id="c-add-cash">+ Add cash</button>
        </div>
        <div class="c-balance">
          <div class="c-meter"><div class="c-meter-fill" id="c-meter"></div><div class="c-meter-mid"></div></div>
          <p id="c-verdict"></p>
          <p class="c-fine">Values are estimates. Final trade is up to the seller.</p>
        </div>
        <button class="c-send" id="c-send">💬 Send trade offer</button>
        <button class="c-buy" id="c-buy">or just buy these for <span id="c-buy-total">$0</span></button>
      </aside>
    </div>
    <div class="c-mobile-pill" id="c-pill"></div>`;

  const $ = (s) => app.querySelector(s);
  const sumGet = () => state.get.reduce((s, id) => s + CARDS.find((c) => c.id === id).price, 0);
  const sumGive = () => state.give.reduce((s, g) => s + g.value, 0);

  function rows() {
    const q = state.q.toLowerCase();
    const active = CHIPS.filter((c) => state.chips.has(c.k));
    const val = (c) => ({ player: c.player, year: c.year, grade: c.grade || 0, price: c.price, added: c.added }[state.sortKey]);
    return CARDS.filter((c) => active.every((ch) => ch.test(c)) &&
        (!q || `${c.player} ${c.team} ${c.set} ${c.year}`.toLowerCase().includes(q)))
      .sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * state.sortDir);
  }

  function renderTable() {
    app.querySelectorAll("[data-chip]").forEach((b) => b.classList.toggle("on", state.chips.has(b.dataset.chip)));
    app.querySelectorAll("[data-sort]").forEach((b) => (b.querySelector("i").textContent = b.dataset.sort === state.sortKey ? (state.sortDir > 0 ? "▲" : "▼") : ""));
    const list = rows();
    $("#c-rows").innerHTML = list.length ? list.map((c) => {
      const picked = state.get.includes(c.id);
      return `
      <tr class="${picked ? "picked" : ""}">
        <td class="c-thumb">${cardArt(c, "sm")}</td>
        <td><b>${c.player}</b>${c.rookie ? ` <span class="c-rc">RC</span>` : ""}<small>${c.team} · ${c.sport}</small></td>
        <td>${c.year}<small>${c.set} #${c.num}</small></td>
        <td><span class="c-grade ${c.grader ? "g" : ""}">${gradeLabel(c)}</span></td>
        <td class="c-price">${money(c.price)}</td>
        <td><button class="c-pick" data-pick="${c.id}">${picked ? "✓" : "+"}</button></td>
      </tr>`;
    }).join("") : `<tr><td colspan="6" class="c-empty">No matches.</td></tr>`;
  }

  function renderSlip() {
    const get = state.get.map((id) => CARDS.find((c) => c.id === id));
    $("#c-get").innerHTML = get.length
      ? get.map((c) => `<li><span>${cardTitle(c)} · ${gradeLabel(c)}</span><b>${money(c.price)}</b><button data-unpick="${c.id}">✕</button></li>`).join("")
      : `<li class="c-placeholder">Tap + on any card</li>`;
    $("#c-give").innerHTML = state.give.length
      ? state.give.map((g, i) => `<li><span>${g.desc}</span><b>${money(g.value)}</b><button data-ungive="${i}">✕</button></li>`).join("")
      : `<li class="c-placeholder">Add your cards or cash below</li>`;

    const a = sumGet(), b = sumGive();
    $("#c-get-total").textContent = money(a);
    $("#c-give-total").textContent = money(b);
    $("#c-buy-total").textContent = money(a);

    // Meter: 50% = even. Left = you're short, right = you're over.
    const diff = b - a;
    const pct = a + b ? Math.max(4, Math.min(96, 50 + (diff / Math.max(a, b)) * 50)) : 50;
    const meter = $("#c-meter");
    meter.style.width = pct + "%";
    let verdict, tone;
    if (!a) { verdict = "Pick at least one card to start."; tone = "idle"; }
    else if (!b) { verdict = `Add what you're offering (worth about ${money(a)}).`; tone = "short"; }
    else if (Math.abs(diff) <= a * 0.1) { verdict = "⚖️ Looks like a fair trade."; tone = "even"; }
    else if (diff < 0) { verdict = `You're about ${money(-diff)} short. Add a card or cash.`; tone = "short"; }
    else { verdict = `You're giving about ${money(diff)} more than you get.`; tone = "over"; }
    $("#c-verdict").textContent = verdict;
    $("#c-slip").dataset.tone = tone;

    $("#c-pill").textContent = `🔁 Slip: ${get.length} card${get.length === 1 ? "" : "s"} · ${tone === "even" ? "fair" : tone === "short" ? "short" : tone === "over" ? "over" : "empty"} ↓`;
    $("#c-pill").classList.toggle("show", get.length > 0);
  }

  // ---------- Events ----------
  $("#c-q").addEventListener("input", (e) => { state.q = e.target.value; renderTable(); });
  app.querySelector(".c-chips").addEventListener("click", (e) => {
    const k = e.target.dataset.chip; if (!k) return;
    state.chips.has(k) ? state.chips.delete(k) : state.chips.add(k);
    renderTable();
  });
  app.querySelector("thead").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]"); if (!b) return;
    state.sortDir = state.sortKey === b.dataset.sort ? -state.sortDir : 1;
    state.sortKey = b.dataset.sort;
    renderTable();
  });
  $("#c-give-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.give.push({ desc: f.get("desc").trim(), value: Math.round(+f.get("value")) });
    e.target.reset();
    renderSlip();
  });
  $("#c-add-cash").onclick = () => {
    const short = sumGet() - sumGive();
    const amt = short > 0 ? short : 20;
    state.give.push({ desc: "Cash", value: amt });
    renderSlip();
  };
  app.addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.pick) { const id = +t.dataset.pick; state.get = state.get.includes(id) ? state.get.filter((x) => x !== id) : [...state.get, id]; renderTable(); renderSlip(); }
    if (t.dataset.unpick) { state.get = state.get.filter((x) => x !== +t.dataset.unpick); renderTable(); renderSlip(); }
    if (t.dataset.ungive) { state.give.splice(+t.dataset.ungive, 1); renderSlip(); }
  });
  $("#c-send").onclick = () => {
    if (!state.get.length) return toast("Pick at least one card first.");
    const cards = state.get.map((id) => CARDS.find((c) => c.id === id));
    const offer = state.give.map((g) => `• ${g.desc} (~${money(g.value)})`).join("\n");
    dmSeller(tradeMessage(cards, offer));
  };
  $("#c-buy").onclick = () => {
    if (!state.get.length) return toast("Pick at least one card first.");
    const cards = state.get.map((id) => CARDS.find((c) => c.id === id));
    dmSeller(`Hi! I'd like to buy:\n${cards.map((c) => `• ${cardTitle(c)} (${gradeLabel(c)}, ${money(c.price)})`).join("\n")}\nTotal: ${money(sumGet())}`);
  };
  $("#c-pill").onclick = () => $("#c-slip").scrollIntoView({ behavior: "smooth" });
  $("#c-ask").onclick = () => dmSeller("Hi! I had a question about your cards.");

  renderTable();
  renderSlip();
})();
