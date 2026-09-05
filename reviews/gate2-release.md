# Gate 2 — release-manager review
Verdict: **SHIP**

Fresh-eyes click-through of commit `8a64b68` (post-review photo re-encode to ≤480px / ≤28.6KB, `sw.js` VERSION `nora-usopen-v3`, Blockx SVG de-flagged, README + .nojekyll). Playwright / chromium_headless_shell-1228, viewports 390×844 (`hasTouch`, `isMobile`, DPR 2) and 768×1024 (`hasTouch`), against both `file:///…/us-open-kids-guide/index.html` and the subpath `http://localhost:8765/us-open-kids-guide/`. Scripts and log in the scratchpad: `gate2.js` (`gate2.log`, 122 checks), `gate2b.js`, `gate2c.js`; screenshots in `review-shots/release-manager/` (`{file,http}-{phone,tablet}-01…10`, `dpr2-*`, `*-instant`, `*-dnav-botic`).

## Checklist (evidence)

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Zero console errors/warnings, zero failed/4xx requests | PASS ×4 | `gate2.log`: "zero console errors/warnings" and "zero failed/4xx requests" on file-phone, file-tablet, http-phone, http-tablet across the full interaction suite (loads, 32 open/close, deep links, reloads, filters, SW install). |
| 2 | 32 cards + 16 matches render; no horizontal overflow | PASS ×4 | `scrollWidth <= clientWidth` at both widths, both origins. |
| 3 | Every one of the 32 cards opens and closes (loop) | PASS ×4 | For each slug: tap card → sheet visible, `#p/<slug>`, `body.locked`, photo `complete && naturalWidth>0` (or avatar), ≥5 flip cards, focus on `#d-close`; tap ✕ → sheet hidden, hash cleared, body unlocked. 32/32 open, 32/32 close on all four combos. |
| 4 | Deep link `#p/iga-swiatek` opens on load; ✕ stays on the page | PASS ×4 | Fresh navigation from `about:blank` → sheet open "Iga Świątek", locked. ✕ → hidden, `location.href` = same document, 32 cards still present. Escape after deep link also stays. (`*-07-detail-iga.png`) |
| 5 | Browser back button | PASS ×4 | Open from page → `page.goBack()` → sheet hidden, hash empty, body unlocked, same page. ✕ after an in-page open (which uses `history.back()`) also stays on the page. |
| 6 | Favorites persist across reload | PASS ×4 | Tap ☆ on Coco → `localStorage['nora-favorites']=["coco-gauff"]`; reload → `aria-pressed=true`, ⭐ glyph, count "All 32 players · ⭐ 1 collected", ⭐ dot on her match row, sheet star pressed. |
| 7 | Each filter pill | PASS ×4 | ⭐ My favorites 1 card/1 match; 👩 Women 16/8; 👨 Men 16/8; ⭐ Superstars 8/8; 🌱 Seeded 14/11; 🐶 Underdogs 10/8. Toggle-off returns 32. Empty state (⭐ with no favorites) shows the cream box, "Show everyone" resets to 32. Only 6 pills (court/session hidden until OOP publishes; note text shown). |
| 8 | Flip a fact by touch | PASS ×4 | `locator.tap()` on fact #1 → `aria-pressed=true`, front `aria-hidden=true`, back `aria-hidden=false`, transform `matrix3d(-1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1)` (exactly 180°), back face not overflowing; tap again unflips. (`*-09-fact-flipped.png`) |
| 9 | Prev / next | PASS ×4 | From Iga: next → Taylor Fritz (`#p/taylor-fritz`), prev → back to `#p/iga-swiatek`. Opponent pill in Iga's sheet → Marie Bouzková. |
| 10 | Photo credits footer lists all 31 real photos with author + license + link | PASS ×4 | `#credits li` = 31; every row matches `Name — Author — <a>License</a>`, no "Unknown"/"see source"; all 31 hrefs on `commons.wikimedia.org`; licenses CC BY-SA 4.0 / 2.0 / Public domain; Blockx (avatar) correctly excluded. (`phone-footer-instant.png`, `tablet-footer-instant.png`) |
| 11 | Avatar player (alexander-blockx) renders | PASS ×4 | Card: `<img src=…/alexander-blockx.svg>` loads (`naturalWidth 150`), single 🇧🇪 sticker (the baked-in second flag is gone). Sheet: avatar + "🕵️ No photo yet — a mystery card!" caption, ✕ not overlapping. (`dpr2-card-blockx.png`, `*-06-blockx.png`) |
| 12 | Service worker on the subpath | PASS ×2 | Registered with scope `http://localhost:8765/us-open-kids-guide/`, active; caches = `["nora-usopen-v3"]` only (v2 evicted), 39 entries (7 shell + 32 photos). |
| 13 | Base path safe | PASS | `grep -nE "[\"'(]/[A-Za-z]" index.html scripts/app.js sw.js manifest.webmanifest styles/main.css` → no matches. All hrefs/srcs relative; `manifest` `start_url`/`scope` = `./`; SW registered as `./sw.js`; photos as `img/players/…`; `.nojekyll` present. |
| 14 | Re-encoded photos at 390 DPR 2 | PASS (cards) / soft (sheet) | Card `<img>` is 162 CSS px wide → 324 device px from 296–478 px sources: effectively 1:1, crisp (`dpr2-card-coco.png`, `dpr2-card-iga.png`, `dpr2-grid-viewport.png`). Sheet `.d-photo` is 390×293 CSS at DPR 2 (and 768×576 on tablet) → **2.4× upscale** of a 320–380 px source. Visibly soft, not blocky (`dpr2-sheet-photo-coco.png`, `http-tablet-07-detail-iga.png`). Acceptable for a kid's guide; see cosmetic C2. |
| 15 | First-load weight (http, 390, no scroll) | PASS | 25 requests / 600 KB including the SW precaching all 39 entries (was 910 KB before the re-encode per qa-engineer S1). |
| 16 | Screenshots reviewed by me | done | hero (phone + tablet), grid (phone + tablet), detail (phone + tablet), flipped fact (phone + tablet), matches (phone), footer (phone + tablet), Blockx card + sheet, d-nav, DPR2 card crops. |

## Remaining reviewer "should-fix" items — all cosmetic, none blocking

Re-checked each open item from the three iteration-2 reviews:

- design-critic S-new-1 (tagline one-line clamp) — **still present**: 20/32 taglines clipped at 390 ("The Teen Who…", "Big-Serving…", "The Comeback…", "Big Server fro…"), 9/32 at 768. Cosmetic: the full tagline is shown in the sheet. → C1.
- design-critic S-new-2 (`.hero-date` wraps to 3 lines with the ball alone on a line at 390) — **still present** (`.hero-date` height 128 px). Cosmetic. → C3.
- qa-engineer S1 (910 KB first load) — **addressed** by the re-encode (600 KB incl. SW precache).
- qa-engineer N1/N2 (focus-halo specificity on `.opp`, 43 px "source" link) — untouched, nice-to-have.
- kid-ux S1/S4 (facts that repeat the story box; eight "speaks N languages" facts) — content, untouched. Not a functional or safety issue.
- kid-ux S2 (baked-in 🇧🇪 in the Blockx SVG) — **fixed** (commit `7b9b709`).
- kid-ux S3 ("Botic van de…" in `.d-nav` at 390) — **still present** (`phone-dnav-botic.png`); the `aria-label` carries the full name. Cosmetic.
- kid-ux S5 (unflipped front stretches to the tallest back in its row) — still present, cosmetic.

Nothing in the post-review diff (photos, `sw.js` VERSION, SVG, README/.nojekyll) introduced a regression: photo loads 32/32, SW v3 installs 39 entries and evicts v2, avatar renders.

## Cosmetic items worth 15 minutes (in priority order)

- **C1 — Tagline clamp** (`styles/main.css` `.card-tag{-webkit-line-clamp:1}`): change to `-webkit-line-clamp:2` and give `.card-body` a `min-height` sized for a 2-line name + 2-line tagline so rows stay level. It is the kid-facing hook on every card and it is cut mid-phrase on 20 of 32 phone cards.
- **C2 — Sheet photo softness** (2.4× upscale): cap `.d-photo` height, e.g. `.d-photo{max-height:240px}` at ≤600 px and `max-height:360px` above, or centre the photo in a `max-width:520px` column on tablet. Brings the upscale to ≈1.5–1.8× with no new assets. (Alternative: keep a 720 px copy for the sheet only; ≈+600 KB, reverses part of the perf win.)
- **C3 — Hero date** (`.hero-date` at 390): wrap "Day 7 · Third Round" in a `.nowrap` span and drop `.hero-date` to 18 px on ≤420 px so it is two lines with the ball beside the second; or give the ball its own deliberate line with a little top margin.

Then, if time remains: kid-ux S3 (`firstName()` for `.d-nav .nm` under 600 px) and the content pass on story-repeating facts.

## Not changed by me
No repo files edited other than this review. Test scripts and screenshots live in the scratchpad only.
