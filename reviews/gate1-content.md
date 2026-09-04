# Gate 1 — Content scorecard (content-gatekeeper, iteration 1)

Audited: `data/players.json` (generatedAt 2026-09-04T18:03:10, 32 players) against `data/schedule.json` (16 matches / 32 players, fetched 2026-09-04T17:05:33Z). Audit date: Fri 2026-09-04. Reader: Nora, 9, attending Sat 2026-09-05 (third round, Day 7).

## Verdict: FAIL (one blocking item; criteria 1, 2, 3, 5, 6 all pass)

The single blocker is criterion 4: Tier 1 real-photo coverage is 15/16 = 93.75%, under the 95% bar. With 16 Tier 1 players, 95% effectively requires 16/16. The missing player is Alexander Blockx (Tier 1 because he faces 5-seed Cobolli). I verified independently that Wikimedia Commons has no photo of him (MediaSearch and the API search on "Blockx tennis" return only unrelated art-supply/composer files), so the gap is real and not fixable from Commons. See "Fixes required" for the two ways to clear it. Every other check passed cleanly.

## Metrics

| # | Check | Result | Threshold | Pass? |
|---|---|---|---|---|
| 1 | Coverage, schedule slug -> player entry | Tier 1 16/16, Tier 2 12/12, Tier 3 4/4 (32/32); no extra players | T1/T2 100%, T3 >= 90% | PASS |
| 2a | `verified === true` | 32/32 | 100% | PASS |
| 2b | `funFacts` >= 5, each with http(s) `source` | 32/32 (min 7, max 8 facts) | 100% | PASS |
| 2c | >= 2 non-tennis facts | 32/32 (manual read of every fact; typical: food, pets, languages, siblings, hobbies) | 100% | PASS |
| 2d | Every fact <= 20 words | 0 violations across 228 facts | 0 | PASS |
| 2e | `intro`/`story`/`watchFor` non-empty; `sources` non-empty | 32/32 | 100% | PASS |
| 2f | Readability (`tools/readability.py`) | max 4.4 (michael-zheng), min 2.5, 0 over 4.5 | <= 4.5 | PASS |
| 2g | `age` consistent with `birthDate` as of 2026-09-05 | 32/32 | 100% | PASS |
| 2h | `matchTomorrow.opponent`/`opponentSlug` match schedule pairing | 32/32 | 100% | PASS |
| 2i | seed / ranking / country match schedule | 32/32 | 100% | PASS |
| 2j | `data/players.json` in sync with `data/players/*.json` (prose, facts, verified, age) | 0 diffs | 0 | PASS |
| 3 | Age-inappropriate content (keyword sweep of intro/story/watchFor/tagline/hometown/all facts + full manual read of all 32) | 0 disqualifying hits; 25 keyword hits reviewed, all benign (see notes) | 0 | PASS |
| 4a | Tier 1 real photo, license OK, author + sourceUrl | 15/16 = 93.75% | >= 95% | **FAIL** |
| 4b | Overall real photo | 31/32 = 96.9% | >= 80% | PASS |
| 4c | Licenses present | CC BY-SA 4.0, CC BY-SA 2.0, Public domain (all allowed); 1 "generated" SVG avatar | allowed set | PASS |
| 4d | jpg size | 31 jpgs, largest 73.5 KB (nikola-bartunkova) | <= 150 KB | PASS |
| 5 | Persona sample (5 players, both personas) | 5/5 approved, minor suggestions only | all approve | PASS |
| 6 | Source spot-check (6 facts, 6 players) | 6/6 supported by cited source | supported | PASS |

Informational (not a defect): 8 `name` values differ from schedule.json by diacritics only (players.json keeps them, e.g. "Iga Świątek" vs "Iga Swiatek"; "Zheng Qinwen" family-name-first per BUILD_LOG decision). Rendering uses players.json, which is the more correct form.

## Fixes required

1. **alexander-blockx / `photo`** (blocking, criterion 4a): replace the SVG avatar with a real photo, or record a waiver. No Commons photo exists. Options, in order: (a) search Flickr with the license filter set to CC BY / CC BY-SA (the repo's existing CC BY-SA 2.0 photos are Flickr-origin; queries "Alexander Blockx", "Blockx tennis", "Blockx Challenger"), download, resize to <= 150 KB, set `license`, `author`, `sourceUrl`, `url`, `localPath: img/players/alexander-blockx.jpg`, `isAvatar: false`, re-run `tools/merge.py`; (b) if none is found, the orchestrator records an explicit waiver in BUILD_LOG.md ("Blockx: no free-licensed photo exists as of 2026-09-04; avatar accepted") and Gate 1 may be re-scored as PASS on that basis, since the avatar itself is compliant and 31/32 overall is well above the 80% bar.

## Advisory (non-blocking; fix if there is time, in priority order)

1. **anastasia-potapova / `sources[]`** and **naomi-osaka / `sources[]`**: the Sources list renders URL text as tappable links; two link texts read `tennis.com/news/articles/anastasia-potapova-burnout-new-coac` and `tennis.com/news/articles/mother-no-drama-osaka-shows-off-her`. Harmless, but the word "burnout" in visible link text is the closest thing to a sensitive term Nora could see. Option: move those URLs to the corresponding fun fact's `source` only (fact sources are not rendered) and keep a cleaner URL in `sources[]`.
2. **mirra-andreeva / funFacts[5].source**: cites an essentiallysports.com "...net-worth-and-more" listicle for the "picked tennis because of her mom" fact. Not rendered, but it is the weakest source in the file; the same fact is in the Tennis Majors profile already cited for fact 2.
3. **alexander-zverev / funFacts[1]**: "He travels with a little grey poodle named Lovik." The Roland Garros source says grey, not little (factCheck already softened "tiny" -> "little", but size is still unsupported). Change to "He travels with a grey poodle named Lovik."
4. **learner-tien / funFacts[2]**: "He plays Fortnite with fellow pro Alex Michelsen." Fortnite is ESRB Teen, not Mature; widely played by 9-year-olds, so I judged it acceptable. Flagging so the parent knows; optional change: "He plays video games online with fellow pro Alex Michelsen."
5. **taylor-fritz / story + funFacts[1]**: "His mom was a top-10 player." appears in the story and again as fact 1 ("His mom, Kathy May, was a top-10 tennis player too."). Duplicate; drop the story sentence or swap fact 1.
6. **jakub-mensik / `nicknameOrTagline`**: "Menimal" is shown in quotes under his name with no explanation; a kid will not get it. Either explain in the intro ("Fans call him Menimal") or use a descriptive tagline like "Big Serve, Cool Head".
7. **iva-jovic / `watchFor`**: "Watch her two-handed backhand flip cross-court in a flash." "Flip" is not something a 9-year-old can spot from the stands. Suggest: "Watch her hit her two-handed backhand hard and low across the court."

## Criterion 3 notes (every keyword hit, all judged benign)

- Russia/Russian/Ukraine (zverev, andreeva, khachanov, rybakina, anisimova, potapova, starodubtseva): language lists and hometowns only; no war or politics anywhere. Starodubtseva's story is college -> tennis teacher -> pro; no conflict mention.
- "lucky loser" (potapova, gea x3): tennis jargon, explained in plain words both times.
- "baby" (bucsa): "New Year's baby". "shooting" (bucsa): biathlon, "skiing plus target shooting". "Top Gun: Maverick" (gea): PG-13 film title. "hates losing" (bartunkova): fine. "earned" (starodubtseva): degrees, not money. TikTok/Instagram (gauff, bucsa, bergs): neutral mentions, no drama.
- Parenthood mentions (osaka "became a mom to a girl named Shai", fritz "has a son named Jordan", khachanov "dad to two little boys"): not relationship/dating content; kept.
- The factCheck notes confirm earlier removals: Bartůňková doping allusion removed (story now clean), Zheng Qinwen injury sentence rewritten (no injury text remains), Bergs twerking story deleted, Menšík "partner Muchová" not present in current text. Anisimova's break is phrased as "took a break from tennis to rest" — appropriate.
- Swiatek's cat is named "Grappa" (a liquor). It is a pet's name; a 9-year-old will not know; kept.
- No betting/odds, prize money/dollar amounts, bans, scandals, alcohol, or mature games anywhere in rendered text.

## Criterion 5 persona notes

Sample: `random.seed(20260905); random.sample(players, 5)` on the players.json list order -> iva-jovic, iga-swiatek, jakub-mensik, karen-khachanov, taylor-fritz (tiers 2, 1, 2, 3, 1).

**Skeptical parent**
- iva-jovic: APPROVE. Nothing cringey; "Her parents are both pharmacists" and the Djokovic autograph wait are sweet. Claim "youngest player in the top 20" is plausible at 18/No. 14.
- iga-swiatek: APPROVE. Jargon lands: "6-0 sets, which fans call bagels. So they call her Iga's Bakery!" is the best explanation in the file. "AC/DC and Led Zeppelin" fine.
- jakub-mensik: APPROVE. Djokovic invitation story is sourced; nothing about his girlfriend remains. Would explain "Menimal" (advisory 6).
- karen-khachanov: APPROVE. "This week he beat the number 3 seed, one of the top-ranked players" explains seed inline. Flag-less display is handled by BUILD_LOG decision, no commentary in prose. Good.
- taylor-fritz: APPROVE. Chipotle/gaming facts are harmless; "son named Jordan" is fine. Duplicate mom sentence (advisory 5).

**Bored 9-year-old**
- iva-jovic: KEEP READING. Six Flags, surfing, and waiting 2.5 hours for an autograph are relatable. Watch-for is the weak spot: "backhand flip cross-court in a flash" - what does flip look like? (advisory 7).
- iga-swiatek: KEEP READING. Pasta with strawberries, a 3,000-brick LEGO strawberry, cat Grappa: all fun. Watch-for "spinny forehand dip, then jump up high off the court" is spottable (the ball kicks up).
- jakub-mensik: KEEP READING. Drums from YouTube, Harry Potter, Steph Curry, ribs. Watch-for "second serve that kicks up high" is spottable if she watches the bounce.
- karen-khachanov: KEEP READING. "Formulas danced around in his head" is a great line; chess. Watch-for "booming serve come down from way up high" works because he is 6'6".
- taylor-fritz: KEEP READING. "Count his aces, the serves nobody even touches!" is the most spottable watch-for in the sample: a counting game. Facts are fun (double chicken Chipotle, Netflix show).

Both personas approve all five; suggested sentence changes are quoted above and are non-blocking.

## Criterion 6 source spot-checks (all supported)

| Player / fact | Cited source | Result |
|---|---|---|
| alexander-zverev F1: grey poodle Lovik with his own tournament pass | rolandgarros.com A-Z of Zverev | Supported ("grey poodle", "has been known to get his own tournament pass"); also confirms Wade, 3 languages, golf/FIFA. "little" not in source (advisory 3). |
| taylor-fritz F7: won Washington 2026, 11th trophy | atptour.com fritz-jodar-washington-2026 | Supported ("clinched his 11th ATP Tour title ... Mubadala DC Open"). |
| coco-gauff F5: US flag bearer Paris 2024, youngest ever | en.wikipedia.org/wiki/Coco_Gauff | Supported ("youngest athlete to be so honored"). |
| cristina-bucsa F3: too-big shoes stuffed with socks, still won | wtatennis.com 4301091 | Supported (two sizes too big, extra socks, beat Osuigwe); karate blue belt and ski-morning/swim-afternoon also confirmed. |
| michael-zheng F5: missed Columbia graduation for French Open | westsiderag.com 2026/08/31 | Supported; wild card also confirmed. |
| elise-mertens F1: peacocks, pheasants, chickens, cranes | tennismajors.com 329467 | Supported; sister Lauren airline pilot also confirmed. |

Extra skeptical checks on story claims that looked risky: Rybakina "in 2026 the Australian Open" confirmed (beat Sabalenka 6-4 4-6 6-4, Jan 31 2026; olympics.com, ausopen.com). Learner Tien "His coach now is former champ Michael Chang" confirmed (Chang coaching since July 2025; atptour.com). No source was unreachable.
