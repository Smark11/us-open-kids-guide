# Nora's US Open Guide

A kid-friendly, collector's-card guide to every singles player on court at the US Open on **Saturday, September 5, 2026** (third round, Day 7). Built for a 9-year-old to use on a phone at the stadium.

- Plain HTML/CSS/JS, no build step. Served by GitHub Pages from `main`.
- All content lives in `data/players/*.json` (one per player) and `data/schedule.json`; `python3 tools/merge.py` produces `data/players.json` and `data/players.js`, which the page renders.
- Player photos are openly licensed (Wikimedia Commons, CC BY / CC BY-SA / public domain); credits render in the page footer and are stored with each player.
- Every fact is traceable to a source URL in the player file; each file carries a `factCheck` block.
- A service worker caches the whole guide for use with weak signal.

See `BUILD_LOG.md` for how it was built, `DESIGN.md` for the visual direction, and `scripts/refresh.md` for the Saturday-morning order-of-play update.
