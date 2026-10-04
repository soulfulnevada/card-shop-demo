# Gridiron & Hardwood: sports card shop demo

A demo website for a football/basketball card seller who sells on Instagram. Plain HTML, CSS and JavaScript, with no build step.

## Features
- Card inventory with search, sport / graded-raw / grading company / rookie / price filters, and sorting
- Card detail pop-up with **DM to buy** (copies a ready-made message, then opens Instagram DMs)
- **Trade binder**: collect cards you want, describe your offer, send it as one DM
- Sold cards stay visible with a SOLD stamp (social proof), with an "Ask me to find one" button
- "Sell me your collection" form (Netlify Forms)
- Filters slide in as a panel on phones

## Personalizing
- `CONFIG` at the top of `script.js`: shop name, initials, Instagram handle (empty = demo mode), payment and shipping info, and `inventoryUrl`.
- **Inventory comes from a Google Sheet** published as CSV, so the seller updates cards from his phone. Until it's connected, the site reads `inventory-sample.csv`. Setup steps for the seller are in [SHEET-SETUP.md](SHEET-SETUP.md).

## Preview locally
```
python -m http.server 5176
```
Then open http://localhost:5176

## Notes
- Instagram doesn't let websites pre-fill DM text, so the buttons copy the message to the clipboard and open `ig.me/m/<handle>`.
- Card faces are drawn with CSS unless a row has a `photo` link (direct `https://` image or Google Drive share link). If a photo fails to load, the drawn card shows instead.
- Sheet text is always escaped before display, so nothing typed into the sheet can run as code on the site.
- The layout came from a prototype of three options. See the `prototype/card-shop-layouts` branch.
