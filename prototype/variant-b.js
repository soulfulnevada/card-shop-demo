// PROTOTYPE Variant B: "Link-in-bio feed". Instagram-style profile, story-circle categories,
// one big card per row, trade tray as a bottom sheet. Mobile-first.
(() => {
  const STORIES = [
    { key: "all", icon: "🔥", label: "All", test: () => true },
    { key: "nfl", icon: "🏈", label: "NFL", test: (c) => c.sport === "NFL" },
    { key: "nba", icon: "🏀", label: "NBA", test: (c) => c.sport === "NBA" },
    { key: "graded", icon: "💎", label: "Graded", test: (c) => !!c.grader },
    { key: "rc", icon: "⭐", label: "Rookies", test: (c) => c.rookie },
    { key: "u50", icon: "💵", label: "Under $50", test: (c) => c.price < 50 },
  ];
  const state = { story: "all", q: "", tray: [], liked: new Set(), trayOpen: false };
  const app = document.getElementById("app");
  const handle = CONFIG.instagram || "yourcardshop";

  app.innerHTML = `
    <div class="b-wrap">
      <header class="b-profile">
        <div class="b-avatar"><span>G&H</span></div>
        <div class="b-stats">
          <div><b>${CARDS.length}</b><span>cards</span></div>
          <div><b>${CARDS.filter((c) => c.grader).length}</b><span>graded</span></div>
          <div><b>${CARDS.filter((c) => c.rookie).length}</b><span>rookies</span></div>
        </div>
      </header>
      <div class="b-bio">
        <b>${CONFIG.shopName}</b>
        <span class="b-handle">@${handle}</span>
        <p>${CONFIG.tagline}<br>💳 ${CONFIG.payments}<br>📦 Ships in 1–2 days, tracked</p>
        <div class="b-actions">
          <button class="b-btn primary" id="b-msg">Message</button>
          <a class="b-btn" href="#b-sell">Sell me your cards</a>
        </div>
      </div>

      <nav class="b-stories" id="b-stories">
        ${STORIES.map((s) => `<button data-story="${s.key}"><span class="b-ring"><span>${s.icon}</span></span>${s.label}</button>`).join("")}
      </nav>

      <div class="b-search"><input type="search" id="b-q" placeholder="🔍 Search players or teams"></div>
      <div id="b-feed"></div>

      <section class="b-sell" id="b-sell">
        <h3>💰 Sell me your collection</h3>
        <p>Send a few photos and the highlights. I'll get back to you with a cash or trade offer.</p>
        <label>What do you have?<textarea rows="3" placeholder="e.g. 300 football cards 2018–2023, a few PSA 9s, Mahomes rookie"></textarea></label>
        <label>Photos<input type="file" accept="image/*" multiple></label>
        <button class="b-btn primary" id="b-sell-btn">Send to ${CONFIG.shopName}</button>
      </section>
      <footer class="b-foot">${CONFIG.shopName} · Sample prices for demo</footer>
    </div>

    <div class="b-tray" id="b-tray"></div>`;

  const $ = (s) => app.querySelector(s);

  function cards() {
    const s = STORIES.find((x) => x.key === state.story);
    const q = state.q.toLowerCase();
    return CARDS.filter((c) => s.test(c) && (!q || `${c.player} ${c.team} ${c.set}`.toLowerCase().includes(q)))
      .sort((a, b) => a.added - b.added);
  }

  function renderFeed() {
    app.querySelectorAll("[data-story]").forEach((b) => b.classList.toggle("on", b.dataset.story === state.story));
    const list = cards();
    $("#b-feed").innerHTML = list.length ? list.map((c) => `
      <article class="b-post">
        <div class="b-post-head"><span class="b-mini">G&H</span><b>${handle}</b><span class="b-ago">· ${c.added}d</span></div>
        <div class="b-post-media" style="--c1:${c.colors[0]};--c2:${c.colors[1]}"><div class="b-post-art">${cardArt(c, "lg")}</div></div>
        <div class="b-post-actions">
          <button data-like="${c.id}" aria-label="Save">${state.liked.has(c.id) ? "❤️" : "🤍"}</button>
          <button data-dm="${c.id}" aria-label="DM to buy">💬</button>
          <button data-trade="${c.id}" aria-label="Add to trade">${state.tray.includes(c.id) ? "✅" : "🔁"}</button>
          <span class="b-price">${money(c.price)}</span>
        </div>
        <div class="b-caption">
          <b>${c.player}</b> ${c.year} ${c.set} #${c.num} · ${gradeLabel(c)}${c.rookie ? " · RC" : ""}
          <div class="b-tags">#${c.team.replace(/\s/g, "")} #${c.sport} ${c.rookie ? "#rookiecard" : ""} ${c.grader ? "#" + c.grader.toLowerCase() : "#raw"}</div>
          <button class="b-dm-link" data-dm="${c.id}">DM to buy →</button>
        </div>
      </article>`).join("")
      : `<p class="b-empty">Nothing here yet. Check back soon!</p>`;
  }

  function renderTray() {
    const items = state.tray.map((id) => CARDS.find((c) => c.id === id));
    const tray = $("#b-tray");
    tray.classList.toggle("show", items.length > 0);
    tray.classList.toggle("open", state.trayOpen && items.length > 0);
    const total = items.reduce((s, c) => s + c.price, 0);
    tray.innerHTML = `
      <button class="b-tray-bar" id="b-tray-toggle">🔁 Trade tray · ${items.length} card${items.length === 1 ? "" : "s"} · ${money(total)} <span>${state.trayOpen ? "▼" : "▲"}</span></button>
      <div class="b-tray-body">
        <div class="b-tray-cards">${items.map((c) => `<div class="b-tray-card">${cardArt(c, "sm")}<button data-untrade="${c.id}">✕</button></div>`).join("")}</div>
        <textarea id="b-offer" rows="3" placeholder="What are you offering? Cards, cash, or both"></textarea>
        <button class="b-btn primary" id="b-send">💬 Send trade offer</button>
      </div>`;
  }

  $("#b-stories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-story]");
    if (b) { state.story = b.dataset.story; renderFeed(); }
  });
  $("#b-q").addEventListener("input", (e) => { state.q = e.target.value; renderFeed(); });
  $("#b-msg").onclick = () => dmSeller("Hi! I saw your site and had a question about your cards.");
  $("#b-sell-btn").onclick = () => toast("Demo: in the live site this sends your collection info to the seller.");

  app.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.like) { const id = +t.dataset.like; state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id); renderFeed(); }
    if (t.dataset.dm) dmSeller(buyMessage(CARDS.find((c) => c.id === +t.dataset.dm)));
    if (t.dataset.trade) {
      const id = +t.dataset.trade;
      state.tray = state.tray.includes(id) ? state.tray.filter((x) => x !== id) : [...state.tray, id];
      renderFeed(); renderTray();
    }
    if (t.dataset.untrade) { state.tray = state.tray.filter((x) => x !== +t.dataset.untrade); renderFeed(); renderTray(); }
    if (t.id === "b-tray-toggle") { state.trayOpen = !state.trayOpen; renderTray(); }
    if (t.id === "b-send") dmSeller(tradeMessage(state.tray.map((id) => CARDS.find((c) => c.id === id)), $("#b-offer").value));
  });

  renderFeed();
  renderTray();
})();
