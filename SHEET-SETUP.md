# Running the shop from a Google Sheet

The website reads its card list from a Google Sheet. Add a row and the card appears on the site. Change "available" to "sold" and it gets a SOLD stamp. No code needed.

## One-time setup (about 10 minutes)

### 1. Create the sheet from the template
1. Download the template: open the site's `/inventory-sample.csv` (e.g. `https://gridiron-hardwood-demo.netlify.app/inventory-sample.csv`) and save it.
2. Go to https://sheets.google.com and create a **Blank spreadsheet**.
3. **File → Import → Upload**, choose the file, select **Replace spreadsheet**, then **Import data**.
4. Rename the tab at the bottom to **Inventory**.
5. Delete the sample rows (keep row 1, the headers) and start adding your own cards.

### 2. Publish it so the website can read it
1. **File → Share → Publish to web**
2. Under **Link**, pick the **Inventory** tab (not "Entire document"), and change "Web page" to **Comma-separated values (.csv)**.
3. Click **Publish**, confirm, and copy the link. It ends in `output=csv`.

> ⚠️ Published means **anyone with the link can read that tab**. Keep private info (what you paid, buyer names, addresses) on a separate tab that you don't publish.

### 3. Connect it to the site
Send the link to whoever manages the website. They paste it into `inventoryUrl` at the top of `script.js` and push. That's the only code change ever needed.

## Columns

| Column | What to put | Example |
|---|---|---|
| **player** | Player name *(required)* | C.J. Stroud |
| **price** | Price in dollars *(required)* | 185 |
| sport | NFL, NBA, MLB, NHL… (new sports get their own filter automatically) | NFL |
| team | Team name | Texans |
| year | Card year | 2023 |
| set | Set name | Panini Prizm |
| number | Card number | 339 |
| rookie | yes / no | yes |
| grader | PSA, BGS, SGC, CGC… (leave blank for raw) | PSA |
| grade | Grade number (blank for raw) | 10 |
| status | `available` or `sold` | available |
| date_added | When you listed it (newest show first) | 2026-10-04 |
| photo | Link to a photo of the card (see below) | |
| notes | Anything buyers should know | Sharp corners, centered |
| colors | Optional card colors, like `#03202f/#a71930`. Leave blank and the site picks colors. | |

Rows missing a player or price are skipped, so half-finished rows won't break anything.

## Daily use
- **New card:** add a row.
- **Sold a card:** change `status` to `sold`. Keep the row; sold cards build trust.
- **Price change:** edit the price.
- Google takes **up to about 5 minutes** to update the published copy, so changes don't appear instantly.

## Adding photos
1. Put the photo in Google Drive (the Drive app on your phone works).
2. On the file: **Share → General access → Anyone with the link → Viewer**.
3. **Copy link** and paste it into the `photo` column.

Direct image links (starting with `https://`) work too. If a photo link breaks, the site shows the drawn card instead.
