# BUILD_LOG — US Open Kids Guide

Target: Saturday, September 5, 2026 (Day 6, third round). Build started 2026-09-04 12:58 local.

## Node status
| Node | Status | Iterations | Notes |
|---|---|---|---|
| 0 Setup | DONE | 1 | git init, folders, gh auth OK (account Smark11). Playwright not preinstalled. |
| 1 Schedule | DONE | 1 | 16 matches / 32 players. Official OOP NOT published (usopen.org day feed `released:false`); courts/sessions TBD, tiers by seed only. Half-split confident via draw feed eventDay. Sept 5 is officially Day 7 (spec said Day 6). |
| 2 Research | DONE | 1 | 6 parallel researchers, batched (6/6/6/5/5/4 players), Tier 1 first. Deviation from 1-agent-per-player for wall-clock efficiency; files are per-player so no write conflicts. |
| 3 Fact check | DONE | 2 | 32/32 verified: true. ~40 claims rewritten/re-sourced, 3 removed (X-post serve speed, doping allusion, unsourced dog). Batches B/C/D re-ran after the API outage. |
| 4 Kid editor | DONE | 1 | 32/32 at FK grade <= 4.5 (max 4.4). 9 content cuts (injury, prize wording, mature game titles, etc). |
| Gate 1 | PASS (with waiver) | 1 | Coverage 32/32; verified 32/32; 0 inappropriate hits; readability max 4.4; photos: Tier 1 15/16 (93.75%, below the 95% bar), overall 31/32 (96.9%); 6/6 source spot-checks supported; both personas approved 5/5 samples. 7 advisory edits applied by orchestrator. |
| 5 Design/build | DONE | 1 | "Sticker album on a blue court" (see DESIGN.md). Vanilla HTML/CSS/JS, players.js data bundle, service worker, favorites, hash routing. |
| 6 Review loop | RUNNING | 1 | Iter 1: design-critic FAIL (4 blocking: ball/kicker overlap, title wrap, tall match cards bury player grid, sticky filter fade), qa-engineer FAIL (2 blocking: SW precaches 0 photos, deep-link close leaves site), kid-ux-tester FAIL (3 blocking: cards buried, tier labels contradict seed lesson, sticky hover flip glitch). Fix pass 1 done (builder cut off by a 2nd API session limit at ~18:40 ET, reset 22:40; code was complete, orchestrator smoke-tested: 0 console errors both origins, grid at y=617). Content mini-pass: 19 facts replaced, 6 watchFor rewritten. Iter 2: design-critic PASS (14/15 items fixed, 1 partial), qa-engineer PASS (all blocking fixed; SW cache verified 39 entries; noted 910KB first load), kid-ux-tester PASS (all blocking fixed; ~9 players have a fact that repeats the story). Orchestrator re-encoded photos 1223KB -> 671KB. |
| Gate 2 | SHIP | 1 | 122 scripted checks passed on file:// and subpath at 390/768; 0 console errors; 32/32 cards; SW v3 39 entries; credits 31/31. 3 cosmetic fixes applied after (tagline 2-line clamp, capped sheet photo height, nowrap date). |
| 7 Deploy | LIVE | 2 | https://smark11.github.io/us-open-kids-guide/ — repo github.com/Smark11/us-open-kids-guide, Pages from main:/ (legacy). First attempt failed on SSH push + a shell-globbed Pages arg; fixed by switching the remote to HTTPS via `gh auth setup-git` and quoting `source[branch]`. Live QA PASS: 0 console errors, 0 failed requests, 32/32 photos, SW v4 40 entries, deep link OK. |
| 8 Wrap | pending | | |

## Decisions
- Tier is now a PLAYER property (seed <=10 or Ashe/Armstrong = Superstars; other seeds = Seeded; unseeded = Underdogs). The original match-level tier confused the kid persona ("Seeds" filter showed unseeded players). Match-level tier kept as `matchTier`.
- Russian players (Andreeva, Khachanov) are shown with a 🎾 in place of a flag and "Plays without a flag", matching how the tournament lists them. No commentary on why; that's a parent conversation.
- Zheng Qinwen displayed family-name-first, as she is known on tour.
- Kid name is "Nora" (user confirmed mid-build). Stored in `data/config.json` as `kidName`; hero renders "Nora's US Open Guide".

## Photo pass
- Six parallel researchers tripped Wikipedia API 429s; orchestrator ran a serial pass with backoff. 31/32 players have CC-licensed Commons photos; Alexander Blockx has no Commons photo -> SVG avatar.

## Gate 1 waiver
- Alexander Blockx has no free-licensed photo on Wikimedia Commons as of 2026-09-04 (gatekeeper re-searched). SVG avatar (flag + initials) used, which is compliant. Tier 1 photo coverage 93.75% vs 95% target; waived per the gate's own recommendation.

## Open issues
- API session limit hit twice (~17:20 ET, reset 17:50; ~18:40 ET, reset 22:40). Lost work was relaunched/recovered each time. Wall-clock budget blown by the outages, not by the build.
- Order of play for Sat Sept 5 not yet released. Re-run schedule scout Friday evening (see scripts/refresh.md).

## Final stats (2026-09-04 23:25 ET)
| Metric | Value |
|---|---|
| Players | 32 (Superstars 8, Seeded 14, Underdogs 10) |
| Matches | 16 (8 men, 8 women), all court/session TBD until OOP drops |
| Verified | 32/32 |
| Fun facts | 225 total, every one with a source URL |
| Source URLs | 153 |
| Readability | max FK grade 4.4, target <= 4.5 |
| Licensed photos | 31/32 (1 SVG avatar: Blockx) — 671KB total, max 27KB |
| Site payload | 152KB (HTML+CSS+JS+data), 0 external JS, Google Fonts optional |
| Review iterations | 2 (all three reviewers PASS on iter 2); Gate 2 SHIP |
| Live | https://smark11.github.io/us-open-kids-guide/ |

## Known gaps / follow-ups
- Order of play not published at build time: every match shows "Court: coming Saturday morning!". Run `scripts/refresh.md` once usopen.org posts it; courts, sessions, Ashe/Armstrong tier promotion and "Who's playing where" grouping all switch on automatically.
- Alexander Blockx: no free-licensed photo exists; avatar used (Gate 1 waiver).
- Rankings are the usopen.org feed snapshot (a few differ by 1-15 spots from live ATP/WTA lists).
- ~9 players still have one fun fact that overlaps their story paragraph (cosmetic; kid-ux-tester iter 2).
- 'Botic van de…' truncates in the prev/next pill on phone.
- Doubles and juniors not included (singles only, per priority rules).
- Detail-sheet photo is a ~1.6x upscale of the 480px source on DPR2 phones (soft, not blocky).
