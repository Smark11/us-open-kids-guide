#!/usr/bin/env python3
"""Merge data/players/*.json + data/schedule.json + data/config.json -> data/players.json (what the site renders).
Usage: python3 tools/merge.py"""
import glob, json, os, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sched = json.load(open(os.path.join(ROOT, "data/schedule.json")))
cfg = json.load(open(os.path.join(ROOT, "data/config.json")))
by_slug = {p["slug"]: p for p in sched["players"]}
matches = {m["id"]: m for m in sched["matches"]}
players = []
for f in sorted(glob.glob(os.path.join(ROOT, "data/players/*.json"))):
    p = json.load(open(f))
    s = by_slug.get(p["slug"], {})
    # schedule is authoritative for seed/ranking/tier/match
    for k in ("seed", "ranking", "tier", "draw"):
        if k in s: p[k] = s[k]
    mid = s.get("matchId") or p.get("matchTomorrow", {}).get("matchId")
    m = matches.get(mid)
    if m:
        opp = [x for x in m["players"] if x["slug"] != p["slug"]]
        p["matchTomorrow"] = {"opponent": opp[0]["name"] if opp else None, "opponentSlug": opp[0]["slug"] if opp else None,
                              "court": m.get("court", "TBD"), "session": m.get("session", "TBD"), "order": m.get("order"),
                              "startTimeET": m.get("startTimeET"), "matchId": mid}
    if p.get("photo") and p["photo"].get("localPath"):
        p["photo"]["exists"] = os.path.exists(os.path.join(ROOT, p["photo"]["localPath"]))
    players.append(p)
players.sort(key=lambda p: (p.get("tier", 3), p.get("seed") or 999, p["name"]))
out = {"config": cfg, "schedule": {k: sched[k] for k in ("date", "round", "orderOfPlayPublished", "fetchedAt")}, "matches": sched["matches"],
       "generatedAt": datetime.datetime.now().isoformat(timespec="seconds"), "players": players}
json.dump(out, open(os.path.join(ROOT, "data/players.json"), "w"), ensure_ascii=False, indent=1)
print(f"merged {len(players)} players -> data/players.json")
# also emit data/players.js (window.PLAYERS_DATA) for file:// + subpath use
import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_data_js; build_data_js.build()
