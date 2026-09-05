# Refreshing the guide (scores, order of play, new rounds)

## Live scores / winners (any time, ~10 seconds)
```
python3 tools/refresh_status.py && python3 tools/merge.py && git add -A && git commit -m "scores" && git push
```
This pulls status, winner and score for every match from the official usopen.org day feeds (joined on `usopenMatchId`), regenerates the data bundle, and publishes. Bump `VERSION` in `sw.js` if phones seem stuck on old data.

## Order of play (done Saturday morning)

The official order of play for Sat Sept 5 was **not published** when this site was built (Friday afternoon).
Every match currently shows court/session **TBD**. Once usopen.org posts it (usually Friday evening ET), do this:

## One command (with Claude Code, from the repo root)

```
claude -p "Re-run the schedule-scout step: fetch the published Sat Sept 5, 2026 US Open order of play (usopen.org day feed 'schedule14.json' for Day 7, or ESPN/ATP/WTA as fallback), update data/schedule.json in place (fill court, session day|night, order, startTimeET for every match; keep ids, slugs and players unchanged; set orderOfPlayPublished true), then run python3 tools/merge.py, verify data/players.js loads, commit and push to main."
```

## Manual (no AI)
1. Open `data/schedule.json`. For each match set `"court"` (e.g. `"Arthur Ashe Stadium"`, `"Louis Armstrong Stadium"`, `"Grandstand"`, `"Court 17"`, `"Court 5"`), `"session"` (`"day"` or `"night"`), `"order"` (1 = first on that court) and `"startTimeET"` (`"11:00"`). Set top-level `"orderOfPlayPublished": true`.
2. Run `python3 tools/merge.py` (regenerates `data/players.json` and `data/players.js`; player tiers auto-promote anyone on Ashe/Armstrong to Superstars).
3. Bump `VERSION` in `sw.js` so phones drop the old cache.
4. `git add -A && git commit -m "Order of play for Sat Sept 5" && git push`. GitHub Pages redeploys in ~1 minute.

## Change Nora's name or the date line
Edit `data/config.json` (`kidName`, `eventLabel`), run `python3 tools/merge.py`, commit, push.

## If a player withdraws
Remove the player from `matches[].players` and `players[]` in `data/schedule.json` (or swap in the replacement's slug and add a `data/players/<slug>.json` via the researcher brief in `tools/RESEARCH_BRIEF.md`), then merge, commit, push.
