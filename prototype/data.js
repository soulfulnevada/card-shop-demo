// PROTOTYPE: shared sample data + helpers for all three variants. Throwaway.

const CONFIG = {
  shopName: "Gridiron & Hardwood",
  tagline: "Football & basketball cards · Buy · Sell · Trade",
  instagram: "", // Seller's handle without @. Empty = demo mode (DM buttons show a notice instead).
  payments: "PayPal G&S · Venmo",
  shipping: "Penny sleeve + top loader + bubble mailer, tracked. Ships in 1–2 days.",
};

// Prices and listings are fictional sample data.
// grade: null = raw. colors = [primary, secondary] used to draw the card face.
const CARDS = [
  { id: 1, sport: "NFL", player: "C.J. Stroud", team: "Texans", year: 2023, set: "Panini Prizm", num: "339", rookie: true, grader: "PSA", grade: 10, price: 185, colors: ["#03202f", "#a71930"], added: 1 },
  { id: 2, sport: "NBA", player: "Victor Wembanyama", team: "Spurs", year: 2023, set: "Panini Prizm", num: "136", rookie: true, grader: "PSA", grade: 9, price: 240, colors: ["#1b1b1b", "#c4ced4"], added: 2 },
  { id: 3, sport: "NFL", player: "Patrick Mahomes", team: "Chiefs", year: 2017, set: "Donruss Optic", num: "177", rookie: true, grader: "BGS", grade: 9.5, price: 420, colors: ["#e31837", "#ffb81c"], added: 9 },
  { id: 4, sport: "NBA", player: "Anthony Edwards", team: "Timberwolves", year: 2020, set: "Panini Prizm", num: "258", rookie: true, grader: null, grade: null, price: 65, colors: ["#0c2340", "#78be20"], added: 3 },
  { id: 5, sport: "NBA", player: "Stephen Curry", team: "Warriors", year: 2022, set: "Donruss", num: "1", rookie: false, grader: null, grade: null, price: 6, colors: ["#1d428a", "#ffc72c"], added: 14 },
  { id: 6, sport: "NFL", player: "Justin Jefferson", team: "Vikings", year: 2020, set: "Panini Mosaic", num: "211", rookie: true, grader: "PSA", grade: 9, price: 70, colors: ["#4f2683", "#ffc62f"], added: 5 },
  { id: 7, sport: "NBA", player: "LeBron James", team: "Lakers", year: 2021, set: "Panini Select", num: "48", rookie: false, grader: "SGC", grade: 9.5, price: 55, colors: ["#552583", "#fdb927"], added: 11 },
  { id: 8, sport: "NFL", player: "Caleb Williams", team: "Bears", year: 2024, set: "Panini Prizm", num: "301", rookie: true, grader: null, grade: null, price: 28, colors: ["#0b162a", "#c83803"], added: 4 },
  { id: 9, sport: "NBA", player: "Luka Dončić", team: "Mavericks", year: 2018, set: "Panini Donruss", num: "177", rookie: true, grader: "PSA", grade: 9, price: 210, colors: ["#00538c", "#b8c4ca"], added: 7 },
  { id: 10, sport: "NFL", player: "Josh Allen", team: "Bills", year: 2018, set: "Panini Prizm", num: "205", rookie: true, grader: "PSA", grade: 8, price: 160, colors: ["#00338d", "#c60c30"], added: 16 },
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

// ---------- Helpers shared by variants ----------

const money = (n) => "$" + n.toLocaleString();
const gradeLabel = (c) => (c.grader ? `${c.grader} ${c.grade}` : "Raw");
const cardTitle = (c) => `${c.year} ${c.set} ${c.player}${c.rookie ? " RC" : ""}`;

// Draws a card face with CSS (no real card photos). size: "sm" | "md" | "lg"
function cardArt(c, size = "md") {
  const slab = c.grader
    ? `<div class="art-slab"><b>${c.grader}</b><span>${c.grade}</span></div>`
    : "";
  return `
    <div class="art art-${size} ${c.grader ? "is-graded" : ""}" style="--c1:${c.colors[0]};--c2:${c.colors[1]}">
      ${slab}
      <div class="art-face">
        <div class="art-top"><span>${c.set}</span><span>${c.year}</span></div>
        <div class="art-silhouette">${c.sport === "NFL" ? "🏈" : "🏀"}</div>
        ${c.rookie ? `<div class="art-rc">RC</div>` : ""}
        <div class="art-name">${c.player}</div>
        <div class="art-team">${c.team} · #${c.num}</div>
      </div>
    </div>`;
}

function toast(msg) {
  let t = document.querySelector(".proto-toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "proto-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3200);
}

// Instagram can't pre-fill DM text, so copy the message first, then open the DM.
async function dmSeller(message) {
  try { await navigator.clipboard.writeText(message); } catch {}
  if (!CONFIG.instagram) {
    toast("Demo mode: message copied. In the live site this opens his Instagram DMs.");
    return;
  }
  toast("Message copied. Paste it into the DM!");
  window.open(`https://ig.me/m/${CONFIG.instagram}`, "_blank", "noopener");
}

const buyMessage = (c) => `Hi! Is the ${cardTitle(c)} (${gradeLabel(c)}, ${money(c.price)}) still available?`;

function tradeMessage(cards, offer) {
  return [
    "Hi! Trade offer:",
    "I'd like:",
    ...cards.map((c) => `• ${cardTitle(c)} (${gradeLabel(c)}, ${money(c.price)})`),
    "I'm offering:",
    offer.trim() || "(describe your cards)",
  ].join("\n");
}
