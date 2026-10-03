# PROTOTYPE: card shop layouts (throwaway)

**Question:** What should a website for an Instagram-based football/basketball card seller look like?

Three structurally different variants on one page, switchable via `?variant=`:

| Key | Name | Idea |
|---|---|---|
| A | Showroom | Dark shop: sidebar filters, card grid, detail modal, slide-out trade binder |
| B | Link-in-bio feed | Instagram-style profile, story-circle categories, one card per row, bottom trade tray, "sell me your collection" form |
| C | Trade desk | Trade builder first: dense sortable table + sticky trade slip with a value-balance meter, "you give / you get" |

## Run
```
python -m http.server 5176
```
Then open http://localhost:5176/prototype/?variant=A and use the pink bar (or ← →) to switch.

## Notes
- All cards, prices and the shop name are sample data (`data.js`). Card faces are drawn with CSS, not real card photos.
- DM buttons copy a pre-written message. Instagram can't pre-fill DM text, so the live site will copy it, then open `ig.me/m/<handle>`. With no handle set, it runs in demo mode.
- No persistence: everything resets on reload.
- The pink switcher only shows on localhost.

## Verdict
**Winner: A (Showroom)**, chosen by Jacob on 2026-10-02. Rebuilt properly on `main` as the real demo. B and C stay here for reference.
