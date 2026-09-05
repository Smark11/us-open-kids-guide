#!/usr/bin/env python3
"""Refresh match status/winner/score in data/schedule.json from the official usopen.org day feeds.
Usage: python3 tools/refresh_status.py            (then run tools/merge.py)
Matches are joined on `usopenMatchId`; feeds are chosen by each match's `day` (Sat Sept 5 = day 14, Sun Sept 6 = day 15)."""
import json, os, datetime, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) USOpenKidsGuide/1.0"}
FEED = "https://www.usopen.org/en_US/scores/feeds/2026/schedule/schedule{n}.json"
DAY_TO_FEED = {"2026-09-05": 14, "2026-09-06": 15, "2026-09-07": 16}

def slugify(first, last):
    import unicodedata, re
    s = unicodedata.normalize("NFKD", f"{first} {last}").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def score_str(m, flip=False):
    """Score from the winner's perspective (feed sets are team1-first; flip when team2 won)."""
    sets = m.get("scores", {}).get("sets") or []
    out = []
    for st in sets:
        try:
            a, b = st[0], st[1]
            tba = tbb = None
            if isinstance(a, dict):
                a, b, tba, tbb = a.get("score"), b.get("score"), a.get("tiebreak"), b.get("tiebreak")
            if flip: a, b, tba, tbb = b, a, tbb, tba
            tb = f"({min(x for x in (tba, tbb) if x is not None)})" if (tba is not None or tbb is not None) else ""
            out.append(f"{a}-{b}{tb}")
        except Exception:
            pass
    return " ".join(out) or (m.get("shortScore") or None)

def main():
    sp = os.path.join(ROOT, "data/schedule.json")
    sched = json.load(open(sp))
    feeds = {}
    for day, n in DAY_TO_FEED.items():
        try:
            d = json.loads(urllib.request.urlopen(urllib.request.Request(FEED.format(n=n), headers=UA), timeout=30).read().decode())
            feeds[day] = {m["match_id"]: m for c in d.get("courts", []) for m in c.get("matches", [])}
        except Exception as e:
            print("feed", n, "unavailable:", e)
    changed = 0
    for m in sched["matches"]:
        fm = feeds.get(m.get("day", sched["date"]), {}).get(str(m.get("usopenMatchId")))
        if not fm: continue
        t1, t2 = fm["team1"][0], fm["team2"][0]
        winner = t1 if t1.get("won") else (t2 if t2.get("won") else None)
        if winner:
            status = "completed"
        elif fm.get("statusCode") == "A" or (fm.get("status") or "").lower().startswith("in progress"):
            status = "in_progress"
        else:
            status = "scheduled"
        new = {"status": status, "winnerSlug": slugify(winner["firstNameA"], winner["lastNameA"]) if winner else None,
               "score": score_str(fm, flip=(winner is t2)) if status != "scheduled" else None}
        # map the feed's winner slug onto our slugs (handles accents / name order)
        if new["winnerSlug"]:
            ours = {p["slug"] for p in m["players"]}
            if new["winnerSlug"] not in ours:
                cand = [p["slug"] for p in m["players"] if winner["lastNameA"].lower().split()[-1] in p["slug"]]
                new["winnerSlug"] = cand[0] if cand else new["winnerSlug"]
        if any(m.get(k) != v for k, v in new.items()):
            m.update(new); changed += 1
            print(f"{m['id']}: {status} {new['winnerSlug'] or ''} {new['score'] or ''}")
    sched["statusFetchedAt"] = datetime.datetime.now().isoformat(timespec="minutes")
    json.dump(sched, open(sp, "w"), ensure_ascii=False, indent=1)
    print(f"{changed} matches updated; statusFetchedAt {sched['statusFetchedAt']}")

if __name__ == "__main__":
    main()
