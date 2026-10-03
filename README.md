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
Everything lives at the top of `script.js`:
- `CONFIG`: shop name, initials, Instagram handle (empty = demo mode), payment and shipping info
- `CARDS`: the inventory. Add, remove or mark `sold: true`.

## Preview locally
```
python -m http.server 5176
```
Then open http://localhost:5176

## Notes
- Instagram doesn't let websites pre-fill DM text, so the buttons copy the message to the clipboard and open `ig.me/m/<handle>`.
- Card faces are drawn with CSS. Real listings should use the seller's own photos of each card.
- Next step for a real seller: load `CARDS` from a Google Sheet so inventory can be updated from a phone.
- The layout came from a prototype of three options. See the `prototype/card-shop-layouts` branch.
