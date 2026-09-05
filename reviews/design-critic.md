# design-critic review — iteration 2
Verdict: PASS

Re-tested at 390×844 and 768×1024 via Playwright (chromium_headless_shell-1228, `hasTouch:true`), `http://localhost:8765/us-open-kids-guide/` and `file:///…/index.html` (file:// still renders 32 cards / 16 matches; 16 "incomplete" images are only `loading="lazy"` and all load after scrolling; 0 console errors; no horizontal overflow at either width). Fresh screenshots: scratchpad `review-shots/design-critic/it2/` (`phone-*`/`tablet-*` 01-hero, 02-filters, 03/03b-grid, 04-matches, 05-footer, 06-empty, 07-detail-top, 08-detail-stats, 09-facts-front, 10-facts-back, 11-detail-bottom, 12-longname-nav). Measurements below come from `dc2.js` in the scratchpad.

## Iteration-1 items — status

### Blocking
- [B1] Ball overlapping the kicker — **FIXED**. Ball is now inside `.hero-date` (`.ball-bounce{position:relative}`); @390 ball rect l175–r215 / t227–b283, kicker starts at t293 — no overlap, no overlap on tablet either (phone-01, tablet-01). Kicker is now plain white 17px (N2 also done).
- [B2] Title hierarchy — **FIXED**. `#hero-title` renders `<span class="hero-name">Nora's</span><span class="hero-rest">US Open Guide</span>`; "Nora's" is a ball-yellow rotated sticker with ink border + hard shadow, "US Open Guide" is one nowrap line (41px @390, 80px @768). "Nora's" is unmistakably the star at both widths (phone-01, tablet-01).
- [B3] Match cards / album buried — **FIXED**. `.match-row{grid-template-columns:1fr auto 1fr}` puts the vs badge dead centre (left=166 of 366 at both widths); cards are 130–150px tall (was ~230). Players section now precedes matches (`#players` at y=617 @390, y=583 @768; matches at y=6871/5638), and a yellow "🃏 See my player cards" jump pill sits in the hero. Tablet uses a 2-column match grid (tablet-04). Page height 9,951 → the album is one swipe from the top.
- [B4] Sticky gradient filter bar — **FIXED**. `#filters` computed `position:static`, `background-image:none`; no floating pills over card faces at any scroll position (tablet-03b).

### Should fix
- [S1] Small type — **FIXED** (with one 15px straggler). `.tag` 16px, `.card-tag` 17px, `.match-meta` 18/19px, `.footer` 17px, `.src-list` 17px, `.verified` 16px, `.stat .k` 15px (was 13; asked for 14 — fine). DOM audit at 390: the only text <16px is `.seed` numerals (15px Lilita in a 34px ball) and the `.vs` badge (15px) — both single tokens in badges, acceptable.
- [S2] Fun-fact overflow — **FIXED**. `.flip-inner{display:grid}`, `.face{grid-area:1/1; position:relative}`; the box now grows with the longer face (Gauff #5/#6 flipH 238 @390, 186 @768). Scripted check of all 32 players × 7 facts at both widths: 0 back faces with scrollHeight > clientHeight.
- [S3] Sticky hover skew on touch — **FIXED**. Both `.flip:hover` rules and all other hover rules are inside `@media (hover:hover)`; flipped transform with `hasTouch` is a clean `rotateY(180deg)` matrix (tablet-10).
- [S4] Purple slab front faces — **FIXED**. Big 52px "?", "Fun fact #n", 17px "Tap to flip! 🔄", front colours cycle c0/c1/c2 (purple/orange/green), folded-corner `::after` cue, 2 columns @390 (`172px 172px`), 3 @768 (phone-09, tablet-08).
- [S5] Orphaned Tier stat — **FIXED**. Tier stat removed; stats are Age / Seed / Height / Hits with — a clean 2×2 @390 and 4×1 @768 (phone-08, tablet-08).
- [S6] Truncated prev/next names — **FIXED**. `.d-nav .pill .nm` wraps to 2 lines (17px); "Nikola Bartůňková", "Elena Rybakina", "Zheng Qinwen" all fully legible @390 (phone-11, phone-12). (My scripted scrollHeight probe flags every clamped `.nm` — that is a `-webkit-line-clamp` measurement artefact; visually nothing is cut.)
- [S7] Muted "Court filters unlock" pill — **FIXED**. Now `.filter-note` plain white text: "🏟️ Court and time filters appear Saturday morning." (0 `.pill.muted` in DOM).
- [S8] Seed badge orphaned in hero tip — **FIXED**. Badge is inside `<span class="nowrap">the bigger the star! ①</span>`; badge sits on the same line as "star!" (phone-01). Side effect noted in N-new-2 below.
- [S9] Ragged card bottoms — **PARTIAL**. `.card-tag` is clamped to one line, so taglines no longer add height; but 14 two-line names @390 still make rows uneven (cards 350/349 vs 327/327 — a 23px step, phone-03b: Andreeva/Świątek, Fritz/Anisimova). And the clamp introduces a new problem, see S-new-1.
- [S10] Floating ✕ merging with content — **FIXED (better than asked)**. `.d-close` is now `position:absolute` on the photo (scrolls away with it) and has the `0 0 0 4px var(--paper)` ring + hard shadow.

### Nice to have
- [N1] Country repeated in hometown — **FIXED** ("United States · from Delray Beach, Florida").
- [N2] Kicker out-shouting the title — **FIXED** (white 17px under the date).
- [N3] Body court lines — not changed; still nice-to-have.
- [N4] Empty-state → footer gap — **FIXED**. Empty card is followed 30px later by the matches section, which has its own "No matches match!" empty card; no bare blue field (phone-06).
- [N5] Thumbnails in match rows — not done (0 img/svg inside `.match`); still nice-to-have.

## Blocking (must fix)
- none

## Should fix
- [S-new-1] styles/main.css `.card-tag{-webkit-line-clamp:1}` @390 and @768: the one-line clamp cuts 20 of 32 taglines on the phone ("The Teen Who…", "Big-Serving…", "The Comeback…", "Four-Time Grand Slam…", "The Quiet Problem…", "Tennis Teacher to…") and 9 on the tablet. The tagline is the kid-facing hook on every card and half of them are now unreadable mid-phrase (phone-03b, tablet-03b). → `-webkit-line-clamp:2` plus `.card-body{min-height}` sized for a 2-line name + 2-line tagline so rows stay level (this also finishes S9), or shorten taglines in `data/players.js` to ≤ 20 characters so they fit at 17px in a 172px column.
- [S-new-2] `.hero-date` @390 wraps to three lines: "Saturday, September 5, 2026 · Day 7 ·" / "Third Round" / (ball alone, centred). The orphaned "Third Round" and the lonely ball make the hero's middle look accidental (phone-01; `.hero-date` height 128px). → Wrap "Day 7 · Third Round" in a `.nowrap` span and drop `.hero-date` to 18px on ≤ 420px so it fits on two lines with the ball beside the second line, or put the ball in its own `.hero-ball` line deliberately with a little more top margin.

## Nice to have
- [N-new-1] `.face.back{align-content:center}`: in a row where one fact is longer, the shorter back face floats vertically centred (Gauff #5 vs #6, phone-10/tablet-10 — "#5" starts 90px below the card top while "#6" starts at the top). → `.face.back{align-content:start}` so every fact reads top-down like a note.
- [N-new-2] `.hero-tip` @390: the `.nowrap` span "the bigger the star! ①" is ~200px, so it always drops to its own line, leaving "lower the number," as a short second line (phone-01). → Only nowrap "star! ①" (`<span class="nowrap">star! <span class="seed-demo">1</span></span>`).
- [N3]/[N5] carried over from iteration 1.

## What's great (keep)
- The hero is now a proper poster: yellow rotated "Nora's" sticker over the white "US Open Guide", ball bouncing beside the date, the jump pill, and the cream tip card. It answers "whose guide is this?" instantly.
- Album-first ordering plus the compact 1fr/auto/1fr match cards fixes the hierarchy completely; the 2-column match grid on tablet is tidy and the "vs" badges line up down the page.
- Fun-fact fronts are now genuinely collectible: the big "?", three-colour cycle and folded corner say "flip me", and the yellow back grows to fit every fact for all 32 players at both widths.
- Removing sticky filters, the Tier stat, and the muted pill each simplified the page rather than patching it.
- Hygiene held: fonts load, file:// works, 0 console errors, no horizontal overflow, focus rings visible, hover isolated behind `(hover:hover)`, reduced-motion path intact.
