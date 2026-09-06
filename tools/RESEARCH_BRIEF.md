# Player researcher brief

Working dir: /Users/mac-mini/_src/tennis_player_site/us-open-kids-guide
Today: Saturday, September 5, 2026. Players marked `eliminated: true` LOST their third-round match on Friday Sept 4 and are out of the tournament; for them `matchTomorrow` is that Friday match (status completed, winnerSlug is the opponent). Frame it kindly in `story` ("had a great run here", "won two matches in New York this year"), never negatively; `watchFor` becomes something to watch for NEXT time they see them (a signature shot or habit). Players marked `playsSaturday: false` in data/schedule.json won their third-round match on Friday and play the FOURTH round on Sunday, September 6, 2026; for them `matchTomorrow` means Sunday's match and `story` may mention they won on Friday (source it from the schedule/results). The kid reading this is 9 years old. She and her parent are attending in person.

For EACH player assigned to you, produce `data/players/<slug>.json` (slug is given). Use the seed/ranking/country/matchId from `data/schedule.json` (read it first; find the player's match in `matches` to get the opponent name, `court`, `session`).

## Research
- Load tools first: ToolSearch "select:WebFetch,WebSearch".
- Primary sources: the player's English Wikipedia article (fetch `https://en.wikipedia.org/wiki/<Name>`; also `https://en.wikipedia.org/api/rest_v1/page/summary/<Title>` for a quick summary), atptour.com / wtatennis.com player profile, usopen.org player page, plus 1–2 interviews/features for non-tennis fun facts. Capture every URL you actually used in `sources`.
- Age: compute from birth date as of 2026-09-05. Include `birthDate` (YYYY-MM-DD).
- Photo: run `python3 tools/fetch_photo.py "<Wikipedia article title>" <slug>`. It prints a JSON photo object (CC-BY / CC-BY-SA / CC0 / PD only, compressed ≤150KB) or `{"photo": null,...}`. If null, try once more with an alternate article title spelling; if still null, run `python3 tools/avatar.py <slug> "<Full Name>" <flagEmoji>` and set `photo` to `{"localPath": "img/players/<slug>.svg", "license": "generated", "author": "site", "sourceUrl": null, "url": null, "isAvatar": true}`. Look at the downloaded JPG once with the Read tool to confirm it actually shows the player's face (not a crowd, trophy, or a different person); if it's wrong, delete it and fall back to the avatar.

## Writing rules (draft quality; an editor will polish, but get the voice close)
- 3rd–4th grade reading level. Sentences ≤ 12 words. Concrete, vivid, funny, warm. No jargon without a tiny explanation.
- Positive only. NO: betting/odds, injuries in detail (a simple "she missed some months and came back stronger" is fine), scandals, doping, relationships/dating, politics, war, money/prize figures, controversies, social-media drama.
- `intro`: 2–3 sentences: who they are, where from, what they're known for.
- `story`: one short paragraph (3–5 sentences): how they got here / what makes them special.
- `funFacts`: 5–7 items, each ≤ 20 words, at least 2 NOT about tennis (pets, food, hobbies, languages, siblings, school, music, quirky habits). Each fun fact is an object `{"text": "...", "source": "<url>"}`.
- `watchFor`: 1 sentence naming something she can spot live: a signature shot, a ritual, a celebration, a grunt, a hat, a bounce count.
- `nicknameOrTagline`: a real nickname if one exists, else a short punchy tagline you write (≤ 6 words).

## Output schema (exact keys)
{
  "slug","name","country" (ISO2),"countryName","flagEmoji","birthDate","age","seed","ranking","draw" ("men"|"women"),"tier",
  "plays": "Right-handed, two-handed backhand", "heightCm", "hometown" (town, country),
  "nicknameOrTagline","intro","story","funFacts":[{"text","source"}],"watchFor",
  "matchTomorrow": {"opponent","opponentSlug","court","session","matchId"},
  "photo": {...} | null,
  "sources": [urls],
  "verified": false,
  "researchedAt": "<ISO timestamp>"
}
Validate each file with `python3 -c "import json;json.load(open('data/players/<slug>.json'))"` before finishing.
Final report: one line per player (slug, photo yes/avatar, any facts you're unsure about). Under 250 words. Do not modify any other files.
