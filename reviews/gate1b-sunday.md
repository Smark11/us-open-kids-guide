# Gate 1b — Sunday (fourth round) content scorecard (content-gatekeeper, fresh eyes)

Audited: the 16 players with `playsSaturday: false` in `data/players.json` (generatedAt 2026-09-05T14:01:46) against `data/schedule.json` m17–m24 (fetched 2026-09-05T17:40:50Z). Audit date: Sat 2026-09-05. Reader: Nora, 9. Match day for these players: Sun 2026-09-06 (Day 8, fourth round). Same criteria as `reviews/gate1-content.md`.

Players: carlos-alcaraz, aryna-sabalenka, daniil-medvedev, jessica-pegula, ben-shelton, frances-tiafoe, linda-noskova, marta-kostyuk, stefanos-tsitsipas, tommy-paul, taylor-townsend, sorana-cirstea, emma-navarro, anna-kalinskaya, alex-michelsen, tomas-martin-etcheverry.

## Verdict: PASS

Every programmatic check passes for all 16; the full manual read found no disqualifying content; both personas approved all 5 sampled players; 6/6 source spot-checks reached their cited page and 5/6 were fully supported. The one discrepancy (Townsend fact 0: the cited article says her son is four, the fact says five) is a sourcing mismatch, not a false statement, and is listed as fix 1 below. Nothing blocks shipping.

## Metrics

| # | Check | Result | Threshold | Pass? |
|---|---|---|---|---|
| 1 | All 16 slugs present; exactly 16 have `playsSaturday: false`; each appears in its schedule match m17–m24 | 16/16 | 100% | PASS |
| 2a | `verified === true` | 16/16 | 100% | PASS |
| 2b | `funFacts` >= 5, each with http(s) `source` | 16/16 (7 facts each, 112 total) | 100% | PASS |
| 2c | >= 2 non-tennis facts | 16/16 (keyword pass min 2: shelton, noskova, townsend, kalinskaya; manual read confirms all have at least 2, most 4+) | 100% | PASS |
| 2d | Every fact <= 20 words | 0 violations across 112 facts (longest 19) | 0 | PASS |
| 2e | `intro`/`story`/`watchFor` non-empty; `sources` non-empty | 16/16 | 100% | PASS |
| 2f | Readability (`python3 tools/readability.py data/players.json`) | max 4.4 (tommy-paul, emma-navarro), min 3.0 (sabalenka), 0 over 4.5; whole file 48 players 0 over | <= 4.5 | PASS |
| 2g | `age` matches `birthDate` as of 2026-09-06 | 16/16 | 100% | PASS |
| 2h | `matchTomorrow.opponent`/`opponentSlug`/`court`/`session`/`order`/`startTimeET`/`round`/`day` match schedule m17–m24 | 16/16, 0 field diffs | 100% | PASS |
| 2i | seed / ranking / country match schedule | 16/16 (countryName intentionally overridden for the 3 neutral players, see 7) | 100% | PASS |
| 2j | `data/players.json` in sync with `data/players/<slug>.json` and `data/players.js` | 0 diffs (players.js drops `factCheck` by design, `tools/build_data_js.py`) | 0 | PASS |
| 3 | Age-inappropriate content (keyword sweep + full manual read of all 16, all fields incl. visible source link text) | 0 disqualifying hits; 22 keyword hits reviewed, all benign (notes below) | 0 | PASS |
| 4a | Real photo, `localPath` exists, license OK, author + sourceUrl | 16/16 (15 CC BY-SA 4.0, 1 CC BY-SA 2.0; all Commons) | >= 95% | PASS |
| 4b | jpg size | max 28.1 KB (tommy-paul), min 17.3 KB | <= 150 KB | PASS |
| 5 | Persona sample (5 players, both personas) | 5/5 approved | all approve | PASS |
| 6 | Source spot-check (6 facts, 6 players; 4 required) | 6/6 reachable, 5/6 fully supported, 1 minor mismatch (townsend F0 age) | supported | PASS (see fix 1) |
| 7 | Neutral-flag players (sabalenka, medvedev, kalinskaya) | all 3: `flagEmoji` 🎾, `countryName` "Plays without a flag"; no political commentary anywhere in their text | 3/3 | PASS |

Story-vs-schedule consistency (extra check): every "On Friday ..." sentence matches the m17–m24 result strings in schedule.json (Pegula 1-6 6-4 6-3 "lost the first set, then roared back"; Tsitsipas 2-6 6-1 7-6 6-1 "back to win in four"; Paul "down two sets to one" 6-4 3-6 6-7 6-1 6-3; Townsend beat Shnaider(15); Navarro beat Muchova(7); Kalinskaya beat Svitolina(9) in three; Cirstea beat Paolini(19) in straight sets; Noskova three sets; Kostyuk, Tiafoe, Michelsen, Etcheverry straight sets; Medvedev beat Rinderknech; Alcaraz beat Wu; Sabalenka beat Rakhimova). Shelton "On Friday night" — session not in the feed, unverified but harmless.

## Fixes (all non-blocking, priority order)

1. **taylor-townsend / `funFacts[0]`**: text "Her son AJ is five. He gives her tips: hit it where she isn't!" The cited profootballnetwork article (25 Feb 2026) says he was four at the time ("he just said at 4 just hit it where she's not"). AJ was born March 2021, so five is true today, but the fact does not match its own source. Change to: "Her little son AJ gives her tennis tips: hit it where she isn't!" (keeps the source honest, drops the age).
2. **anna-kalinskaya / `funFacts[5]`**: "She started tennis at five after watching her cousin play at Grandma's house." and `funFacts[2]` "Her mom and dad were both pro badminton players." both repeat the story paragraph word for word (two duplicates, the worst overlap in the set). Replace F5 with something new from the already-cited WTA profile or Wikipedia, e.g. "She lives and trains in Miami, Florida now." (source: en.wikipedia.org/wiki/Anna_Kalinskaya).
3. **aryna-sabalenka / `funFacts[0]`**: "She has a tiger tattoo on her arm. She was born in the Year of the Tiger." Tattoo is not on the banned list and it explains her nickname (intro says "People call her The Tiger"), so I kept it, but it is the one fact in this set a cautious parent might rather skip. Optional swap: "Fans call her The Tiger. She was born in the Year of the Tiger!" (same source). If kept, note the fact-level source URL (not rendered) contains the word "infamous".
4. **taylor-townsend / `funFacts[3]`**: "She taught rapper Cardi B how to play tennis on a TV show." Benign sentence, but Cardi B is an explicit-lyrics artist a 9-year-old might look up. Optional swap from the same Yahoo source: "She learned tennis at a public park in Chicago." (verify wording against the source before use).
5. **alex-michelsen / `funFacts[0]` + `funFacts[1]`**: both restate the story (garage backhands at three; mom hit with him daily). Replace F0 with a new fact, e.g. from the tennis-prose biofile already cited.
6. **daniil-medvedev / `funFacts[3]`**: "When he won here in 2021, he flopped down like a video game celebration." A 9-year-old will not picture this. Suggest: "When he won here in 2021, he fell flat on the court like a fish. It was a video game move!" (source unchanged, newsweek "dead fish celebration").
7. **frances-tiafoe / `watchFor`**: "Watch his funny forehand windup, arm above the racket, then a heavy spinning whip." Hard to spot from the stands. Suggest: "Watch his forehand: he lifts his elbow way up high before he swings!"
8. **ben-shelton / `story`**: "On Friday night he beat Denis Shapovalov" — the feed does not confirm night session; safe to drop "night".

## Criterion 3 notes (every keyword hit, all judged benign)

- Russia/Ukraine/Belarus: hometowns only (Minsk, Belarus; Moscow, Russia x2; Kyiv, Ukraine); language lists (medvedev, tsitsipas "speaks Russian"); "His name means bear in Russian"; Kostyuk "Her uncle played for Ukraine too". No war, politics, sanctions or flag commentary anywhere. The three neutral players render as "Plays without a flag · from Moscow, Russia" / "from Minsk, Belarus", the same treatment Gate 1 accepted for Khachanov and Andreeva.
- "tattoo" (sabalenka F0), "nose ring" (noskova F4): body-decoration mentions, no injury or drugs; see fix 3.
- "cry", "quit" (etcheverry story): "one loss made him cry so hard his parents almost quit tennis" — a sweet kid-relatable story, kept. "never broken a racket" (etcheverry F1): positive framing, kept.
- "dead" appears only in an unrendered fact-source URL (medvedev newsweek "dead-fish"); "hot" only in URL slugs "hot-shot" (kalinskaya, etcheverry sources, visible link text truncated at 60 chars reads "hot-shot-kalinskaya-foils-shnai" — tennis jargon, fine).
- Video games: medvedev F0 "PlayStation ... video game contests", michelsen F3 "video games ... with his pal Learner Tien", etcheverry F3 "PlayStation" — no titles, no mature games.
- Money/business: pegula F0 "parents own the Buffalo Bills ... Sabres", F3 "skincare company" — no dollar amounts; jessica-pegula sources include en.wikipedia.org/wiki/Terry_Pegula (link text harmless).
- Parenthood: medvedev F4 "two little daughters", townsend tagline "The Net-Rushing Lefty Mom", story "first mom ever ranked No. 1 in doubles", F0 son AJ — not relationship content, kept.
- Retirement: cirstea story "This is her last season on tour, so cheer extra loud!" — appropriate.
- "dirt bikes", "deep-sea fishing", "camo" (paul), "Formula One race car" (navarro), "pro wrestling / WWE" (noskova), "Cardi B" (townsend, fix 4), "Rocky Balboa", "Will Smith" (alcaraz): all fine for 9.
- No betting/odds, injuries, doping/bans, scandals, dating/partners/spouses, alcohol, or prize money in any rendered field. No "girlfriend/boyfriend/wife/husband" anywhere in the 16.
- Fact/story duplicates (cosmetic, known gap in BUILD_LOG): kalinskaya (2), michelsen (2), alcaraz (youngest No. 1), navarro (born in NYC; college title), medvedev (math), tiafoe (age four), kostyuk (mom pro), etcheverry (nickname Tomy). Fixes 2 and 5 cover the worst two.

## Criterion 5 persona notes

Sample: `random.seed(20260906); random.sample(sunday_players, 5)` on the players.json list order of the 16 -> emma-navarro, daniil-medvedev, marta-kostyuk, tommy-paul, carlos-alcaraz.

**Skeptical parent**
- emma-navarro: APPROVE. Wholesome throughout (Bernedoodle Marti, RipStik to practice, class clown). "human backboard" is explained by the watch-for sentence itself. No money mention despite the famous family.
- daniil-medvedev: APPROVE. "Plays without a flag" with zero commentary is the right call. Math-school, chess, daughters, Octopus nickname. Only quibble: F3 "flopped down like a video game celebration" is confusing (fix 6).
- marta-kostyuk: APPROVE. Kyiv is just a hometown; nothing about the war, which is correct for this audience. Backflip story is joyful and sourced; sleep mask and lavender spray are charming.
- tommy-paul: APPROVE. Fishing, camo, Eagles, racket-spinning. "dirt bikes" is fine. Story explains the Fritz friendship and Olympic bronze. Nothing to object to.
- carlos-alcaraz: APPROVE. Serena doubles fact is delightful and dated this year. "Rocky Balboa" and "Will Smith" fine. "seven Grand Slams" is a bold claim but consistent with the 2026 season source in `sources[]`.

**Bored 9-year-old**
- emma-navarro: KEEP READING. Drove a real Formula One car, dog on the court, class clown. Watch-for "every ball comes back ... human backboard" gives her something to test from the seats.
- daniil-medvedev: KEEP READING. "His name means bear", 6 feet 6, PlayStation contests, Octopus. Watch-for "stands almost at the wall" is the most spottable one in the sample.
- marta-kostyuk: KEEP READING. "Stay to see if she does a backflip!" is the best hook in the file; Nadia Comaneci's perfect 10 lands even without knowing who she is.
- tommy-paul: KEEP READING. "Spins his racket on his fingers between points, like a toy" is a fun thing to watch for; Eagles fan and dirt bikes are relatable.
- carlos-alcaraz: KEEP READING. Giggling with Serena, kebabs and sushi, three brothers. Watch-for "drop shot, a sneaky soft shot, then his giant grin" is explained inline.

Both personas approve all five; suggestions are cosmetic and listed under Fixes.

## Criterion 6 source spot-checks (WebFetch; web search unavailable this session)

| Player / fact | Cited source | Result |
|---|---|---|
| tomas-martin-etcheverry F1: never broken a racket | atptour.com etcheverry-rome-2023-feature | Supported: "I've never broken or hit a racquet in my life." (Source also mentions weekly psychologist sessions — correctly left out of kid text.) |
| linda-noskova F1: WWE fan since 14, Charlotte Flair cheered this week | wtatennis.com 4571829 (3 Sep 2026) | Supported: "diehard professional wrestling fan since she was 14"; Flair sat in her player's box Wednesday night. |
| taylor-townsend F0: son AJ is five, "hit it where she isn't" | profootballnetwork.com coached-by-son (25 Feb 2026) | Tip supported ("just hit it where she's not"); age NOT supported — article says four. True today (born Mar 2021) but mismatched with cited source. Fix 1. |
| marta-kostyuk F0/F1: backflip after Madrid win; Comaneci perfect 10 | gulfnews.com madrid-open-2026 | Supported: "she did the acrobatic backflip"; Comaneci "#perfect10 landing". Also confirms final vs Mirra Andreeva 7-5 6-3. |
| aryna-sabalenka F1/F2/F3: sweet tooth / candy gift; grandma's pancakes; Count of Monte Cristo | wtatennis.com/players/320760 | Supported: "sweet tooth and considers something sweet as a perfect present"; "grandmother's ... pancakes"; "The Count of Monte Cristo". Also confirms tiger tattoo / "The Tiger" nickname. |
| emma-navarro F5: drove a Formula One car; plays golf | profootballnetwork.com emma-navarro off-season | Supported: "driving Red Bull's Formula One car" at 2025 Las Vegas GP; golf at RSM Classic pro-am. |

No source was unreachable.
