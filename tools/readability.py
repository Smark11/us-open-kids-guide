#!/usr/bin/env python3
"""Flesch-Kincaid grade for player prose. Usage: python3 tools/readability.py data/players.json  (or a single player file)
Prints per-player grade and flags > 4.5. Exit code 1 if any fail."""
import json, re, sys

def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w: return 0
    if len(w) <= 3: return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w)
    w = re.sub(r"^y", "", w)
    return max(1, len(re.findall(r"[aeiouy]{1,2}", w)))

def fk_grade(text):
    sents = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    words = re.findall(r"[A-Za-z']+", text)
    if not sents or not words: return 0.0
    syl = sum(syllables(w) for w in words)
    return 0.39 * len(words) / len(sents) + 11.8 * syl / len(words) - 15.59

def player_text(p):
    parts = [p.get("intro", ""), p.get("story", ""), p.get("watchFor", "")] + [f.get("text", f) if isinstance(f, dict) else f for f in p.get("funFacts", [])]
    return " ".join(x for x in parts if x)

def main():
    data = json.load(open(sys.argv[1]))
    players = data["players"] if isinstance(data, dict) and "players" in data else ([data] if isinstance(data, dict) else data)
    bad = 0
    for p in players:
        g = fk_grade(player_text(p))
        flag = "" if g <= 4.5 else "  <-- TOO HARD"
        if g > 4.5: bad += 1
        print(f"{g:4.1f}  {p.get('slug')}{flag}")
    print(f"{len(players)} players, {bad} over grade 4.5")
    sys.exit(1 if bad else 0)
if __name__ == "__main__":
    main()
