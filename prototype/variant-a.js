// PROTOTYPE Variant A: "Showroom". Sidebar filters + card grid + detail modal + trade binder drawer.
(() => {
  const state = { q: "", sport: "All", type: "All", graders: [], rookies: false, max: 500, sort: "new", binder: [] };
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="a-header">
      <div class="a-brand"><span class="a-logo">G&H</span><div><b>${CONFIG.shopName}</b><small>${CONFIG.tagline}</small></div></div>
      <input class="a-search" id="a-q" type="search" placeholder="Search player, team, set…">
      <button class="a-binder-btn" id="a-open-binder">🗂️ Trade binder <span id="a-count">0</span></button>
    </header>
    <div class="a-layout">
      <aside class="a-filters">
        <h4>Sport</h4>
        <div class="a-seg" data-key="sport">${["All", "NFL", "NBA"].map((s) => `<button data-v="${s}">${s}</button>`).join("")}</div>
        <h4>Condition</h4>
        <div class="a-seg" data-key="type">${["All", "Graded", "Raw"].map((s) => `<button data-v="${s}">${s}</button>`).join("")}</div>
        <h4>Grading company</h4>
        ${["PSA", "BGS", "SGC"].map((g) => `<label class="a-check"><input type="checkbox" value="${g}" data-grader> ${g}</label>`).join("")}
        <h4>Extras</h4>
        <label class="a-check"><input type="checkbox" id="a-rookies"> Rookies only</label>
        <h4>Max price: <span id="a-max-label">$500</span></h4>
        <input type="range" id="a-max" min="5" max="500" step="5" value="500">
        <div class="a-info">
          <p><b>💳 Payment</b><br>${CONFIG.payments}</p>
          <p><b>📦 Shipping</b><br>${CONFIG.shipping}</p>
        </div>
      </aside>
      <main>
        <div class="a-toolbar">
          <span id="a-result-count"></span>
          <select id="a-sort">
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        <div class="a-grid" id="a-grid"></div>
      </main>
    </div>

    <div class="a-modal" id="a-modal" hidden></div>
    <aside class="a-drawer" id="a-drawer" aria-hidden="true">
      <div class="a-drawer-head"><h3>Trade binder</h3><button id="a-close-binder">✕</button></div>
      <div id="a-binder-body"></div>
    </aside>`;

  const $ = (s) => app.querySelector(s);

  function filtered() {
    const q = state.q.toLowerCase();
    let list = CARDS.filter((c) =>
      (state.sport === "All" || c.sport === state.sport) &&
      (state.type === "All" || (state.type === "Graded") === !!c.grader) &&
      (!state.graders.length || state.graders.includes(c.grader)) &&
      (!state.rookies || c.rookie) &&
      c.price <= state.max &&
      (!q || `${c.player} ${c.team} ${c.set} ${c.year}`.toLowerCase().includes(q)));
    const sorters = { new: (a, b) => a.added - b.added, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price };
    return list.sort(sorters[state.sort]);
  }

  function renderGrid() {
    const list = filtered();
    $("#a-result-count").textContent = `${list.length} card${list.length === 1 ? "" : "s"}`;
    $("#a-grid").innerHTML = list.length
      ? list.map((c) => `
        <button class="a-tile" data-id="${c.id}">
          ${cardArt(c, "md")}
          <div class="a-tile-info">
            <div class="a-tile-name">${c.player}</div>
            <div class="a-tile-meta">${c.year} ${c.set}</div>
            <div class="a-tile-foot"><span class="a-badge">${gradeLabel(c)}</span><b>${money(c.price)}</b></div>
          </div>
        </button>`).join("")
      : `<p class="a-empty">No cards match. Try loosening the filters.</p>`;
    app.querySelectorAll(".a-seg").forEach((seg) =>
      seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === state[seg.dataset.key])));
  }

  function openModal(c) {
    const inBinder = state.binder.includes(c.id);
    $("#a-modal").innerHTML = `
      <div class="a-modal-card">
        <button class="a-modal-x" data-close>✕</button>
        <div class="a-modal-art">${cardArt(c, "lg")}</div>
        <div class="a-modal-info">
          <span class="a-badge">${gradeLabel(c)}</span>${c.rookie ? ` <span class="a-badge rc">Rookie</span>` : ""}
          <h2>${c.player}</h2>
          <p class="a-muted">${c.year} ${c.set} #${c.num} · ${c.team}</p>
          <p class="a-price">${money(c.price)}</p>
          <button class="a-btn primary" data-dm="${c.id}">💬 DM to buy</button>
          <button class="a-btn" data-binder="${c.id}">${inBinder ? "✓ In trade binder" : "🗂️ Add to trade binder"}</button>
          <p class="a-muted small">${CONFIG.shipping}</p>
        </div>
      </div>`;
    $("#a-modal").hidden = false;
  }

  function renderBinder() {
    const cards = state.binder.map((id) => CARDS.find((c) => c.id === id));
    $("#a-count").textContent = cards.length;
    const total = cards.reduce((s, c) => s + c.price, 0);
    $("#a-binder-body").innerHTML = cards.length
      ? `<ul class="a-binder-list">${cards.map((c) => `
          <li><div class="a-binder-art">${cardArt(c, "sm")}</div>
            <div><b>${c.player}</b><br><small>${c.year} ${c.set} · ${gradeLabel(c)}</small><br>${money(c.price)}</div>
            <button data-remove="${c.id}" aria-label="Remove">✕</button></li>`).join("")}</ul>
        <p class="a-binder-total">Value: <b>${money(total)}</b></p>
        <label class="a-offer">What are you offering?<textarea id="a-offer" rows="4" placeholder="e.g. 2021 Prizm Ja'Marr Chase PSA 9 + $20"></textarea></label>
        <button class="a-btn primary" id="a-send-trade">💬 Send trade offer by DM</button>`
      : `<p class="a-muted">Add cards you want from the shop, then describe what you're offering in return.</p>`;
  }

  // ---------- Events ----------
  $("#a-q").addEventListener("input", (e) => { state.q = e.target.value; renderGrid(); });
  $("#a-sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $("#a-rookies").addEventListener("change", (e) => { state.rookies = e.target.checked; renderGrid(); });
  $("#a-max").addEventListener("input", (e) => { state.max = +e.target.value; $("#a-max-label").textContent = money(state.max); renderGrid(); });
  app.querySelectorAll("[data-grader]").forEach((cb) => cb.addEventListener("change", () => {
    state.graders = [...app.querySelectorAll("[data-grader]:checked")].map((x) => x.value);
    renderGrid();
  }));
  app.querySelectorAll(".a-seg").forEach((seg) => seg.addEventListener("click", (e) => {
    if (!e.target.dataset.v) return;
    state[seg.dataset.key] = e.target.dataset.v;
    renderGrid();
  }));
  $("#a-grid").addEventListener("click", (e) => {
    const tile = e.target.closest(".a-tile");
    if (tile) openModal(CARDS.find((c) => c.id === +tile.dataset.id));
  });

  const toggleDrawer = (open) => { $("#a-drawer").classList.toggle("open", open); $("#a-drawer").setAttribute("aria-hidden", !open); };
  $("#a-open-binder").onclick = () => toggleDrawer(true);
  $("#a-close-binder").onclick = () => toggleDrawer(false);

  app.addEventListener("click", (e) => {
    const t = e.target;
    if (t.matches("[data-close]") || t.id === "a-modal") $("#a-modal").hidden = true;
    if (t.dataset.dm) dmSeller(buyMessage(CARDS.find((c) => c.id === +t.dataset.dm)));
    if (t.dataset.binder) {
      const id = +t.dataset.binder;
      if (!state.binder.includes(id)) state.binder.push(id);
      t.textContent = "✓ In trade binder";
      renderBinder();
      toast("Added to your trade binder");
    }
    if (t.dataset.remove) { state.binder = state.binder.filter((id) => id !== +t.dataset.remove); renderBinder(); }
    if (t.id === "a-send-trade") {
      const cards = state.binder.map((id) => CARDS.find((c) => c.id === id));
      dmSeller(tradeMessage(cards, $("#a-offer").value));
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { $("#a-modal").hidden = true; toggleDrawer(false); } });

  renderGrid();
  renderBinder();
})();
