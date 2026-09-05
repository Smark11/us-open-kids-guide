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

---

# Run 2 — Saturday, September 5, 2026, ~1:40 pm ET (Day 7 live; Day 8 preview)

## Sources (all live at fetch time, all official usopen.org JSON feeds)
- `schedule/scheduleDays.json` — Day 7 (Sat, `schedule14.json`, released 8:47 AM) and Day 8 (Sun, `schedule15.json`, released 9:46 AM, "SINGLES ONLY") both `released: true`; Day 9+ not yet released.
- `schedule/schedule13.json` (Friday results), `schedule/schedule14.json` (Saturday OOP + status), `schedule/schedule15.json` (Sunday OOP).
- `draws/MS.json`, `draws/WS.json` (completed scores, R4 pairings stamped `eventDay: 15`), `players/players.json` (rankings, nations).
- ESPN scoreboard was fetched only as a live-score glimpse; its court/time listing disagreed with the official feed and was not used.

## JOB A — Saturday order of play (published; `orderOfPlayPublished: true`)
- Ashe day (11:30): 1. Fritz(9) v F. Cerundolo(24); 2. Bucsa v Gauff(4), not before 1:30 PM.
- Ashe night (7:00): 1. Jovic(14) v Eala(17); 2. Zverev(1) v Tabilo(25).
- Armstrong day (11:00): 1. Potapova(24) v Anisimova(10); 2. Blockx(28) v Cobolli(5).
- Armstrong night (7:00): 1. Osaka(13) v Mertens(23); 2. Mensik(17) v Tien(14).
- Grandstand (11:00): 1. Keys(22) v Zheng Qinwen; 2. Swiatek(8) v Bouzkova(25); 3. M. Zheng v Gea; 4. Starodubtseva v Rybakina(2), not before 5:00 PM.
- Court 17 (11:00): 2. M. Andreeva(5) v Bartunkova; 3. Khachanov v Bonzi; 4. Bergs(31) v van de Zandschulp, not before 4:30 PM. (Slot 1 is a non-singles match.)
- Court 5 (11:00): 3. Darderi(21) v Sweeny. (Slots 1-2 non-singles.)
- `startTimeET` = session start for the first match on a court, the official "not before" time where one exists, otherwise `null` with `startTimeNote: "Follows previous match on this court"`. Times are ET, 24h.
- `status` from the day feed at ~1:38 pm ET. Completed: **Potapova d. Anisimova 6-2 7-5** (upset of the No. 10 seed); **Zheng Qinwen d. Keys 1-6 7-6(3) 7-5** (upset of the No. 22 seed). In progress: Fritz v Cerundolo, Blockx v Cobolli, Andreeva v Bartunkova (no live set scores in the usopen.org feeds; ESPN showed Fritz leading in the 3rd set and Blockx/Cobolli in the 1st set at fetch time). `score` strings are written from the winner's perspective.
- Re-tiered: Tier 1 = top-10 seed in the match OR on Ashe/Armstrong. Newly Tier 1 because of court: Jovic v Eala, Osaka v Mertens, Mensik v Tien. Player `tier` values updated to match.

## JOB B — Friday (Day 6) results and Sunday (Day 8) fourth round
All 16 Friday R3 matches finished (no `pending`). Winners and Sunday R4 pairings (official OOP, `schedule15.json`):
- m17 Armstrong day, 3rd on (NB 3:00 PM): Medvedev(7) d. Rinderknech 6-4 6-4 6-4 v Tiafoe(11) d. Vacherot 6-4 6-2 6-4.
- m18 Grandstand, 3rd on (NB 2:30 PM): Michelsen d. Merida 7-6(5) 6-4 6-3 v Etcheverry(27) d. Navone 6-4 6-4 6-3.
- m19 Ashe night, 1st (7:00 PM): Shelton(8) d. Shapovalov 7-6(3) 6-7(5) 6-3 6-4 v Tsitsipas d. Lehecka(18) 2-6 6-1 7-6(3) 6-1.
- m20 Ashe day, 2nd (NB 2:00 PM): Paul(20) d. Bublik(15) 6-4 3-6 6-7(4) 6-1 6-3 v Alcaraz(2) d. Wu 6-3 6-4 6-1.
- m21 Ashe day, 1st (11:30 AM): Sabalenka(1) d. Rakhimova 6-3 6-4 v Townsend d. Shnaider(15) 6-2 6-7(3) 6-3.
- m22 Armstrong day, 2nd (NB 12:30 PM): Kostyuk(11) d. Alexandrova(18) 6-3 6-2 v Noskova(6) d. Li(29) 6-2 6-7(6) 6-2.
- m23 Armstrong day, 4th (follows): Pegula(3) d. Fernandez(31) 1-6 6-4 6-3 v Cirstea(16) d. Paolini(19) 6-3 6-3.
- m24 Ashe night, 2nd (follows): Kalinskaya(21) d. Svitolina(9) 6-3 2-6 6-3 v Navarro(26) d. Muchova(7) 6-3 7-5.
- Only m18 is Tier 2 (Grandstand, no top-10 seed); the other seven are Tier 1.
- Sunday players appended to `players[]` with `playsSaturday: false`, `round: "Fourth round"`; the 32 Saturday players got `playsSaturday: true`, `round: "Third round"`.
- Etcheverry's feed name is "Tomas Martin Etcheverry" -> slug `tomas-martin-etcheverry`. Sabalenka is listed as BLR -> `BY` (competes as a neutral). Rankings are `singles_rank` from players.json at fetch time (Sabalenka 1, Pegula 3, Alcaraz 3, Noskova 6, Medvedev 8, Shelton 9, Kostyuk 11, Tiafoe 12, Cirstea 17, Paul 21, Kalinskaya 23, Navarro 27, Etcheverry 32, Michelsen 46, Tsitsipas 53, Townsend 96).

## Uncertainty / next run
- Saturday `status`/`score` is a snapshot; 14 of 16 Saturday matches were unfinished at fetch time. Re-run in the evening to fill winners and to add Monday's (Day 9) R4 for the Saturday half once `schedule16.json` releases.
- Night-session order on Ashe/Armstrong can be swapped by the tournament; "follows" matches have no fixed start.
- The Sunday feed is marked "SINGLES ONLY" (the extra non-singles slots on Armstrong/Grandstand are juniors/wheelchair events per the feed).
