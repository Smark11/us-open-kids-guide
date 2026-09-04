# Fact-checker brief

Working dir: /Users/mac-mini/_src/tennis_player_site/us-open-kids-guide. Today: Friday Sept 4, 2026. Match day: Sat Sept 5, 2026.
You are NOT the researcher who wrote these files. Be skeptical. Load tools: ToolSearch "select:WebFetch,WebSearch".

For EACH assigned `data/players/<slug>.json`:
1. Verify against ≥1 independent source (Wikipedia article + ATP/WTA or usopen.org profile; for fun facts, the cited `source` URL or another reputable page): `birthDate`/`age` (as of 2026-09-05), `country`, `seed` and `ranking` (must match `data/schedule.json`, which came from the official usopen.org feed), `plays`, `heightCm`, `hometown`, `matchTomorrow.opponent` (must match the schedule), and EVERY fun fact and every factual claim in `intro`, `story`, `watchFor`.
2. If a claim is unsupported: fix it if you can source the correct version (update the text and its `source`); otherwise DELETE the fun fact or rewrite the sentence to a claim you can support. Never leave an unsupported claim. Keep ≥5 fun facts; if deletions drop it below 5, find and add a sourced replacement (≤20 words, kid-friendly).
3. Age-appropriateness sweep: remove anything about betting, injuries in detail, doping, scandals, dating/relationships, politics/war, prize money, controversies. Rewrite positively.
4. Set `"verified": true` only if every remaining claim is sourced. Otherwise `"verified": false`. In both cases add `"factCheck": {"checkedAt": "<ISO>", "notes": ["..."], "changes": ["..."]}`.
5. Validate JSON after editing.

Final report: one line per player: slug, verified true/false, # facts removed/rewritten, anything still doubtful. Under 250 words. Do not touch other players' files.
