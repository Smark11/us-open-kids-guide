# qa-engineer live check — post-deploy
Verdict: PASS

Target: https://smark11.github.io/us-open-kids-guide/ (GitHub Pages subpath), checked 2026-09-04 with headless Chromium 1228 via Playwright at 390×844 (touch, isMobile, DPR 2) and 768×1024 (DPR 1).
Scripts + logs: scratchpad `live-check.js` / `live-check.log`, `img-check.js` / `img-check.log`, `blockx.js`. Screenshots: scratchpad `review-shots/live/` (phone-hero, phone-grid, phone-detail, tablet-hero, tablet-grid, tablet-detail, phone-blockx-card) — all viewed.

## Blocking (must fix)
- none

## Should fix
- none

## Nice to have
- [N1] Card photos use `loading="lazy"`; on a fast full-page scroll a handful of below-the-fold cards can still be mid-download when you land on them (first run showed 8 phone / 2 tablet not yet complete until the scroll settled). All 32 do finish (see check 2), and the SW precache makes second visits instant, so this is cosmetic only.

## Evidence per check (identical results on both viewports unless noted)
1. Console / network: 0 console errors, 0 warnings, 0 `pageerror`, 0 failed requests, 0 responses with status ≠ 200/304 across initial load, card interactions, reload, and the deep-link page. (List of non-200/304 requests: empty.)
2. Photos: 32 cards rendered, 32 `<img>` in `.card-photo`, all `complete && naturalWidth > 0` after lazy-load completes (`img-check.log`: `loaded=32 bad=[]` on both viewports). No player is missing a photo (`photo.exists` is `true` for all 32). The Blockx avatar is served as `img/players/alexander-blockx.svg` (150×150, loaded) and renders as the "AB" tennis-ball placeholder with flag, seed 28 and Seeded tag — see `phone-blockx-card.png`. Detail-sheet photo also loaded (`naturalWidth > 0`) for every opened card.
3. Subpath resources (all HTTP 200 at `https://smark11.github.io/us-open-kids-guide/…`): `styles/main.css`, `scripts/app.js`, `data/players.js`, `manifest.webmanifest`, `sw.js`, `img/icon.svg`. Service worker: `navigator.serviceWorker.ready` → scope `https://smark11.github.io/us-open-kids-guide/`, script `…/sw.js`, state `activated`. Cache `nora-usopen-v4` holds 40 entries after install: shell (`./`, `index.html`, `styles/main.css`, `scripts/app.js`, `data/players.js`, `manifest.webmanifest`, `sw.js`) + 32 player photos (incl. the Blockx SVG).
4. Deep link `#p/coco-gauff` in a fresh tab: sheet visible, `#sheet-name` = "Coco Gauff". Tapping ✕ (`#d-close`): sheet hidden, URL stays `https://smark11.github.io/us-open-kids-guide/`, title "Nora's US Open Guide", 32 cards still in the grid (no navigation away, no blank page).
5. Interactions: opened/closed 5 random cards per viewport (phone: Jovic, Cerúndolo, M. Zheng, Bouzková, Bucșa; tablet: Menšík, Tabilo, Starodubtseva, Cobolli, Osaka) — each set `#p/<slug>`, showed the correct name, and ✕ returned to hash `""` on the same page. Flip: first fact card → `aria-pressed=true`, back face "#1 He is 6 feet 6 inches tall…" (see detail screenshots). Favorite: ⭐ on Zverev → `aria-pressed=true`, count "All 32 players · ⭐ 1 collected"; after `reload()` still pressed, `localStorage['nora-favorites'] = ["alexander-zverev"]`, count unchanged.
6. Fonts: `fonts.googleapis.com/css2?family=Lilita+One&family=Nunito…` 200, four `fonts.gstatic.com` woff2 files 200; `document.fonts` reports "Lilita One" and "Nunito" loaded, `document.fonts.check()` true for the h1. Screenshots show the rounded display face on headings and Nunito body text (no fallback in use).

## What's great (keep)
- Relative-path SW registration + `./`-prefixed precache list works unchanged on the Pages subpath; second load is fully offline-capable.
- Deep-link close is history-safe on a cold tab (no back-navigation off the site).
- Hero, filter pills, grid and detail sheet all render cleanly at both viewports with no clipping or overflow.
