# Reviewer brief (Node 6)

Repo: /Users/mac-mini/_src/tennis_player_site/us-open-kids-guide — a static site (index.html, styles/main.css, scripts/app.js, sw.js, data/players.js) for a 9-year-old ("Nora") attending the US Open on Sat Sept 5, 2026. Read DESIGN.md for the intended direction. You are NOT the builder; be a tough, specific, fair critic.

## How to run it
- Playwright is installed in /private/tmp/claude-501/-Users-mac-mini--src-tennis-player-site/b752de7a-8692-4cd9-a566-ede116a0d8a8/scratchpad (`cd` there; `node -e "require('playwright')"` works). Chromium binaries live in ~/Library/Caches/ms-playwright/ (chromium-1134 and chromium-1228 both present). If launch fails, pass `executablePath` to `~/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing` (check the exact path with `ls`). There is an existing helper `shoot.js` in that directory you can read and reuse.
- Serve the subpath case: `python3 -m http.server 8765 --directory /Users/mac-mini/_src/tennis_player_site` (bind may already be running; try another port if taken) then load `http://localhost:8765/us-open-kids-guide/`. Also test `file:///Users/mac-mini/_src/tennis_player_site/us-open-kids-guide/index.html`.
- Viewports: 390×844 (phone) and 768×1024 (tablet). Save screenshots to the scratchpad `review-shots/<your-role>/` and LOOK at them with the Read tool.
- Do not edit any repo files. Write findings to `/Users/mac-mini/_src/tennis_player_site/us-open-kids-guide/reviews/<your-role>.md` (create the folder) using this format:

```
# <role> review — iteration N
Verdict: PASS | FAIL
## Blocking (must fix)
- [B1] <file/area>: <problem> → <concrete fix>
## Should fix
- [S1] ...
## Nice to have
- [N1] ...
## What's great (keep)
- ...
```
Verdict is FAIL only if there is at least one Blocking item. Be concrete: name the element, viewport, and what to change. Final report to the orchestrator: verdict + the blocking list, under 200 words.
