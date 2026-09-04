# Schedule notes — Saturday, September 5, 2026 (Day 7, third round)

Fetched: 2026-09-04 ~13:10 ET (Friday, Day 6 of the main draw).

## Date / day-number correction
2026-09-04 is a **Friday**, not a Thursday. Per the official usopen.org day feed, the main draw runs 15 days from Sunday Aug 30 (Day 1); the third round is split across **Friday Sept 4 (Day 6)** and **Saturday Sept 5 (Day 7)**. So Saturday is Day 7, third round, second half. `round` in schedule.json reflects the official numbering ("Day 7").

## Order of play: NOT published
- usopen.org `scheduleDays.json` shows Day 7 (Sat Sept 5) with `released: false`, no feed URL, no match count.
- Sky Sports / TennisTourCalendar / Yahoo / ESPN only list Friday's order of play. WTA order-of-play page renders client-side (empty via fetch). ATP daily-schedule page timed out.
- Therefore `orderOfPlayPublished: false`; every match has `court: "TBD"`, `session: "TBD"`, `startTimeET: null`, `order: null`. Tiers are by seed only (Tier 1 = a top-10 seed in the match; Tier 2 = any other seed; Tier 3 = two unseeded players). Re-run once the OOP drops (normally Friday evening ET) to fill in courts/sessions and re-tier Ashe/Armstrong matches to Tier 1.

## Which half plays Saturday (confident)
The official draw feeds (`draws/MS.json`, `draws/WS.json`) stamp each R3 match with `eventDay`. Exactly 8 men's and 8 women's R3 matches carry `eventDay: 13` (Friday) — the men's bottom half (sections 5-8: Medvedev, Tiafoe, Shelton, Alcaraz, etc.) and the women's top half (sections 1-4: Sabalenka, Pegula, Svitolina, Muchova, etc.). This matches Friday's published OOP (`schedule13.json`). The remaining 8 + 8 R3 matches have no eventDay yet and are the Saturday matches: **men's top half (sections 1-4)** and **women's bottom half (sections 5-8)**. `halfSplitConfident: true`.

## Second-round status
All 64 second-round matches in both draws are complete in the official feed, so every Saturday R3 pairing is fixed; no `pending` matches. The Wikipedia bracket pages were parsed independently and agree with all 16 pairings.

## Saturday matches (16)
Men (top half): Zverev(1) v Tabilo(25); Darderi(21) v Sweeny(WC); Zheng(WC) v Gea(LL); Bergs(31) v van de Zandschulp; Khachanov v Bonzi; Mensik(17) v Tien(14); Fritz(9) v F. Cerundolo(24); Blockx(28) v Cobolli(5).
Women (bottom half): M. Andreeva(5) v Bartunkova; Potapova(24) v Anisimova(10); Jovic(14) v Eala(17); Bucsa v Gauff(4); Swiatek(8) v Bouzkova(25); Keys(22) v Zheng Qinwen(Q); Osaka(13) v Mertens(23); Starodubtseva v Rybakina(2).

## Data details / caveats
- Rankings come from usopen.org `players/players.json` (`singles_rank`), snapshot at fetch time; treat as approximate current ATP/WTA rank.
- Countries: usopen.org IOC codes mapped to ISO 3166 alpha-2. Russian/Belarusian players are listed under their nationality (RU/BY) even though they compete as neutrals; Potapova is listed as AUT (Austria) per the official feed.
- `usopenMatchId` on each match is the official usopen.org match id (useful to join with the OOP feed once released: `schedule14.json`).
- Sources live at fetch time: usopen.org JSON feeds (schedule days, Friday schedule, both draws, players), Wikipedia raw wikitext for both draws, ESPN scoreboard, Sky Sports OOP article, TennisTourCalendar. Timed out: usopen.org HTML schedule page, the usopen.org "who won Thursday" article, olympics.com, atptour.com daily schedule.
