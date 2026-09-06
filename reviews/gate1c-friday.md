# Gate 1c — Friday (third-round exits) content scorecard (content-gatekeeper, fresh eyes)

Audited: the 16 players with `eliminated: true` in `data/players.json` (generatedAt 2026-09-05T21:39:08) against `data/schedule.json` m25–m40 (fetchedAt 2026-09-05T17:40:50Z). Audit date: Sat 2026-09-05. Reader: Nora, 9. These players lost their third-round match on Fri 2026-09-04 and stay in the guide as "finished Friday" cards. Same criteria as `reviews/gate1-content.md` / `reviews/gate1b-sunday.md`, plus a tone pass: every story must frame Friday's loss kindly.

Players: elina-svitolina, karolina-muchova, jasmine-paolini, leylah-fernandez, alexander-bublik, denis-shapovalov, jiri-lehecka, valentin-vacherot, ekaterina-alexandrova, diana-shnaider, ann-li, kamilla-rakhimova, arthur-rinderknech, yibing-wu, daniel-merida, mariano-navone.

## Verdict: PASS

Every programmatic check passes for all 16 (daniel-merida's avatar and near-zero non-tennis facts are the two pre-declared exceptions, recorded below). The full manual read found no disqualifying content and no negative loss framing in any `story`; the only "Lost to ..." wording in the product lives in `scripts/app.js`, not in the data (fix 2). Both personas approved all 5 sampled players (two are "approve but weakest"). 5/5 source spot-checks reached their cited page and were fully supported. Nothing blocks shipping.

## Metrics

| # | Check | Result | Threshold | Pass? |
|---|---|---|---|---|
| 1 | All 16 slugs present; exactly 16 have `eliminated: true`; each appears in its schedule match m25–m40; none is `winnerSlug` of its own match | 16/16 | 100% | PASS |
| 2a | `verified === true` | 16/16 | 100% | PASS |
| 2b | `funFacts` >= 5, each with http(s) `source` | 16/16 (15 x 7 facts, svitolina 8; 113 total) | 100% | PASS |
| 2c | >= 2 non-tennis facts | 15/16 by keyword pass (min 2: bublik, rakhimova, wu; manual read confirms 3+ for those). **daniel-merida: 1 by keyword (F1 "from Madrid, the capital city of Spain"), effectively 0 personal facts — known exception, recorded, not failed** | 100% | PASS (exception noted) |
| 2d | Every fact <= 20 words | 0 violations across 113 facts (longest 19: shnaider F3, bublik F5) | 0 | PASS |
| 2e | `intro`/`story`/`watchFor` non-empty; `sources` non-empty | 16/16 | 100% | PASS |
| 2f | Readability (`python3 tools/readability.py data/players.json`) | max 4.0 (kamilla-rakhimova, mariano-navone), min 2.2 (bublik), 0 over 4.5; whole file 64 players 0 over | <= 4.5 | PASS |
| 2g | `age` matches `birthDate` as of 2026-09-05 | 16/16 (fernandez 23 today, turns 24 Sun 9/6 as her story says; svitolina 31, turns 32 on 9/12 as F7 says) | 100% | PASS |
| 2h | `matchTomorrow.opponent`/`opponentSlug`/`court`/`session`/`order`/`startTimeET`/`round`/`day`/`status`/`winnerSlug`/`score` match schedule m25–m40 | 16/16, 0 field diffs; all 16 `status: completed`, `winnerSlug` = opponent | 100% | PASS |
| 2i | seed / ranking / country match schedule | 16/16 (countryName intentionally overridden for the 2 neutral players, see 7) | 100% | PASS |
| 2j | `data/players.json` prose/facts/verified/age in sync with `data/players/<slug>.json` and `data/players.js` | 0 diffs on authored fields (per-player files lack merge-derived keys `matchTier`/`playsSaturday`/`eliminated`/`round`/`tier`, by design of `tools/merge.py`); `players.js` 0 diffs | 0 | PASS |
| 3 | Age-inappropriate content (keyword sweep + full manual read of all 16, all rendered fields incl. visible source link text) | 0 disqualifying hits; 25 keyword hits reviewed, all benign (notes below); 2 optional softenings (fixes 3, 4) | 0 | PASS |
| 3b | Loss framing in `story`/`intro`/`watchFor` (no "lost", "crashed out", "upset", "knocked out", "eliminated") | 0 hits in any of the 16 (all use "won two matches ... Next time ..." / "pushed X hard" / "five-set thriller" / "battled for three sets" / "What a run!") | 0 | PASS |
| 4a | Real photo, `localPath` exists, license OK, author + sourceUrl | 15/16 (10 CC BY-SA 4.0, 5 CC BY-SA 2.0; all Commons). **daniel-merida = generated avatar `img/players/daniel-merida.svg` (`isAvatar: true`, license "generated", author "site", no sourceUrl) — allowed exception** | >= 95% real, avatar allowed | PASS |
| 4b | jpg size | max 27.8 KB (svitolina), min 16.4 KB (ann-li); merida svg 0.6 KB | <= 150 KB | PASS |
| 5 | Persona sample (5 players, both personas) | 5/5 approved (merida, rakhimova "approve, weakest") | all approve | PASS |
| 6 | Source spot-check (5 facts across 5 players; 4 required) | 5/5 reachable, 5/5 fully supported | supported | PASS |
| 7 | Neutral-flag players (alexandrova, shnaider) | both: `flagEmoji` 🎾, `countryName` "Plays without a flag"; no political commentary anywhere in their text | 2/2 | PASS |
| 8 | svitolina: no war/politics content | 0 hits; Ukraine appears only as country/hometown ("tennis star from Ukraine", "Odesa, Ukraine") | 0 | PASS |

Story-vs-schedule consistency (extra check): every Friday reference matches m25–m40. Bublik "five-set thriller" (6-4 3-6 6-7(4) 6-1 6-3 vs Paul); Shapovalov "pushed Ben Shelton hard on Arthur Ashe Stadium" (m26 Ashe night, two tiebreaks); Shnaider "battled for three sets" (6-2 6-7(3) 6-3); Ann Li "pushed the No. 6 seed to three sets" (Noskova seed 6, 6-2 6-7(6) 6-2); Rakhimova "play the world No. 1 on a big stadium court" (Sabalenka ranking 1, Armstrong); Wu "play Carlos Alcaraz on the biggest court" (Ashe); Muchova/Paolini/Fernandez/Svitolina/Alexandrova/Lehecka/Vacherot/Rinderknech/Merida/Navone "won two matches" = third-round exit. Fernandez 2021 claim (beat three top-five players incl. Osaka) is historically correct.

## Fixes (all non-blocking, priority order)

1. **daniel-merida / `funFacts[0]`**: "His birthday is September 26. He turns 22 three weeks after the US Open." The final is Sun Sept 13; Sept 26 is 13 days later. Change to: "His birthday is September 26. He turns 22 two weeks after the US Open ends." (source unchanged).
2. **`scripts/app.js` line 316 (detail sheet, eliminated players)** — outside the data files, not edited: renders `Lost to <strong>Name</strong> on Friday · score` under "💪 Played a great tournament!". This is the only "lost" wording a kid will see for these 16; the stories themselves avoid it. Suggest: `'<p>Played <strong>' + esc(oppName) + '</strong> on Friday' + score + '</p>'` (the 🏁 Fri chip and the opponent's 🏆 in the match card already tell the result).
3. **diana-shnaider / `funFacts[1]`**: "Her favorite movie is Never Back Down. Her favorite food is Asian food." Never Back Down is a PG-13 cage-fighting film; a curious 9-year-old may look it up. Optional swap: "Her favorite food is Asian food. She started tennis at age four." (first half already on the cited WTA page; verify the second half there or cite en.wikipedia, which the story already relies on).
4. **jasmine-paolini / `funFacts[2]`**: "Her dad Ugo ran a bar in their little town." In Italy a bar is a coffee bar, but a US kid reads "bar" as a pub. Optional: "Her dad Ugo ran a little café in their town." (same it.wikipedia source; "bar" there is the café sense).
5. **kamilla-rakhimova / `funFacts[4]` + `funFacts[6]` (+ `funFacts[0]`)**: three facts restate the story/intro nearly word for word (Venus Williams win; "favorite courts are hard courts ... New York"; mom Rufina played for Uzbekistan). Worst overlap in this set. Replace F6 with something new from the already-cited WTA profile (wtatennis.com/players/325936) and verify wording before use.
6. **elina-svitolina / `funFacts[3]`**: "Her big brother Yulian played tennis first. She wanted to play too." repeats the story verbatim. Replace with a new fact from en.wikipedia (already cited).
7. **karolina-muchova / `funFacts[1]` and `[3]`**, **valentin-vacherot / `[2]`**, **alexander-bublik / `[6]`**, **ekaterina-alexandrova / `[5]`**, **leylah-fernandez / `[0]`**, **daniel-merida / `[5]`**: each restates a story/intro sentence (75–85% word overlap). Cosmetic; known gap in BUILD_LOG.
8. **ekaterina-alexandrova / `hometown`**: "Prague, Czech Republic (born in Chelyabinsk, Russia)" — the rest of the file says "Czechia" (muchova, lehecka). Change to "Prague, Czechia (born in Chelyabinsk, Russia)".
9. **yibing-wu / `story`**: "Then he missed many months and came back stronger." Deliberately vague (source: 3 years of injuries + Covid); acceptable, but if a parent asks, the sentence can simply be dropped without harming the story.
10. **daniel-merida**: only tennis facts and an avatar instead of a photo — the least engaging card in the set (see persona notes). Adding even one personal fact (food, pet, hobby) from the mutuamadridopen "three musketeers" piece already cited would help; no photo fix possible without a licensed image.

## Criterion 3 notes (every keyword hit, all judged benign)

- Russia/Ukraine: hometowns only (Odesa, Ukraine; Gatchina, Russia [bublik, plays for Kazakhstan]; Yekaterinburg, Russia [rakhimova, plays for Uzbekistan]; Moscow / Zhigulevsk, Russia [shnaider]; Chelyabinsk, Russia [alexandrova]); alexandrova intro "was born in Russia. She grew up in Prague"; language lists (shapovalov, alexandrova "Russian"). No war, politics, sanctions, flag or nationality-switch commentary anywhere. Rakhimova F3 "joined the Uzbekistan team ... They called it a historic event" is sports-federation news, no politics. Svitolina: no mention of Monfils/marriage, no war.
- "partner": paolini F6 "doubles partner and now her coach", shnaider F4 "doubles ... her partner Mirra Andreeva" — clearly doubles partners in context.
- "lost"/"losing": shnaider F3 "won 20 matches and lost only 3" (positive framing); paolini watchFor "huge smile, even after losing a point" (positive). Vacherot story "out of nowhere" (idiom).
- Parenthood: svitolina F0 "She is a mom! Her daughter Skaï"; bublik F4 "little boy named Vasily" — no partner/spouse content.
- Body/clothing: shnaider bandana (x5) "to avoid sunburn" — fine.
- Games/media: shapovalov F2 "Nintendo Switch ... Mario Kart" (source also lists Skyrim — correctly left out); lehecka F3 "Inception" (PG-13, benign mention); vacherot F5 "Friends"; shnaider F1 "Never Back Down" (fix 3); shapovalov F0/F1 rapper, song "Night Train" (clean title).
- Food/drink: lehecka "guilty pleasure is sweet desserts", vacherot "Haribo candy", alexandrova "baking cakes"; paolini F2 "ran a bar" (fix 4). No alcohol.
- Health: wu story "missed many months" (fix 9); shnaider F2 "dad ... used to be a boxer" (sport, fine). No injury detail, doping, bans, scandals, betting/odds, prize money or dollar amounts in any rendered field.
- Visible `sources[]` link text: svitolina/muchova/paolini/fernandez cite a bleacherreport "...results-winners-losers-and-highlights..." URL; rendered text is truncated at 60 chars ("bleacherreport.com/articles/25496089-us-open-tennis-2026-res"), so "losers" is not visible. Fine.
- No "girlfriend/boyfriend/wife/husband/married" anywhere in the 16.

## Criterion 5 persona notes

Sample: `random.seed(20260907); random.sample(eliminated_players, 5)` on the players.json list order of the 16 -> yibing-wu, daniel-merida, valentin-vacherot, kamilla-rakhimova, ann-li.

**Skeptical parent**
- yibing-wu: APPROVE. Junior US Open, first Chinese ATP champion, map with flight paths, Bradenton. "missed many months" is the only shadow and it is vague; framing is "came back stronger".
- daniel-merida: APPROVE. Nothing objectionable at all; will ask why there is a cartoon avatar instead of a photo (no licensed image, per BUILD_LOG). Thin on personality.
- valentin-vacherot: APPROVE. Haribo, skiing, F1, AS Monaco, beat his cousin in a final, brother is his coach. "Friends" is fine as a title mention.
- kamilla-rakhimova: APPROVE. Plays for Uzbekistan, hometown in Russia — presented plainly with no commentary, which is right for this audience. "They called it a historic event" is a slightly odd sentence but harmless.
- ann-li: APPROVE. Ukulele, country music, aunt a pro speed skater, funny hometown name, Federer idol. Model card.

**Bored 9-year-old**
- yibing-wu: KEEP READING. "He dove like a soccer goalie!" and drawing plane routes on a world map are the hooks; watch-for "diving for a volley" is concrete.
- daniel-merida: SKIM. Six of seven facts are about tournaments, rankings and Grand Slam counts ("only his seventh tour event"); the only kid hook is best friends since age eight. No photo. Weakest card in the sample (fix 10) but nothing wrong with it.
- valentin-vacherot: KEEP READING. Haribo, pizza, "beat his own cousin", ranked 204 to champion "out of nowhere". Watch-for "notice how tall he is" is easy.
- kamilla-rakhimova: SKIM. Facts repeat what the story just said (Venus, hard courts, Uzbekistan); "Tashkent is the capital" reads like homework. Approve, but fix 5 would help.
- ann-li: KEEP READING. "King of Prussia" is a funny name, ukulele, aunt speed skater; watch-for two-handed backhand is spottable.

Both personas approve all five; suggestions are cosmetic and listed under Fixes.

## Criterion 6 source spot-checks (WebFetch; web search unavailable this session)

| Player / fact | Cited source | Result |
|---|---|---|
| denis-shapovalov F2/F3/F5/F6/F4: Nintendo Switch + Mario Kart; hockey; Leafs/Raptors; ShapoShelter; English + Russian | atptour.com su55/bio | Supported: "Travels with his Nintendo Switch and enjoys playing Skyrim and Mario Kart"; "If he wasn't a tennis player, he would be an ice hockey player"; "Fan of Toronto Maple Leafs (NHL) and Toronto Raptors (NBA)"; "Launched ShapoShelter in April 2022 ... dogs and cats in need"; "Speaks English and Russian". (Skyrim correctly omitted from kid text.) |
| yibing-wu F3/F4: world map with flight paths to the four Slams; Federer posters | atptour.com wu-miami-2023-feature | Supported: "a world map. Wu drew a plane's path on it from Melbourne to Paris, London and New York, noting the locations of the four Grand Slams"; "a poster on his wall featuring several ATP Tour stars including Roger Federer". Source mentions "three years of injury struggles" — correctly kept vague in the story. |
| mariano-navone F0/F1/F2/F3/F4: racket-shaped rattle; dad took him to car races; NBA + Argentinos Juniors; dancing and impressions; jokes with ball kids | lanacion.com.ar nid15112023 | Supported: "un sonajero con forma de raqueta de tenis"; "me llevó varias veces a ver las carreras"; "Desde los 14 años que miro mucho la NBA"; "Yo soy de Argentinos Juniors"; "soy el primero en bailar"; "Imitaba a Messi caminando"; ball-kid nutmeg anecdote. |
| ann-li F0/F3: ukulele; Federer idol, makes tennis look easy | usta.com ann-li-motivated-by-wimbledon-run | Supported: "He loves music, watching movies, reading books, relaxing and playing the ukulele" (article's typo, refers to Li); "someone I look up to ... the way he plays is so effortless". |
| ekaterina-alexandrova F0/F2/F5: bakes cakes; siblings Anna and Jury; forehand; started at six | wtatennis.com/players/319007 | Supported: "Likes to cook, especially making cakes"; "sister, Anna, and brother Jury"; "Favorite shot is forehand"; "Began playing tennis at age 6". |

No source was unreachable.
