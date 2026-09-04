#!/usr/bin/env python3
"""Generate a stylized SVG avatar: flag emoji + initials on a bold colored ball.
Usage: python3 tools/avatar.py <slug> "<Full Name>" <flagEmoji>
Writes img/players/<slug>.svg and prints the local path."""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PALETTES = [("#1D4ED8", "#FDE047"), ("#0F766E", "#FDE68A"), ("#BE123C", "#FBCFE8"), ("#7C3AED", "#DDD6FE"),
            ("#EA580C", "#FFEDD5"), ("#0369A1", "#BAE6FD"), ("#15803D", "#BBF7D0"), ("#B45309", "#FEF3C7")]
def main():
    slug, name, flag = sys.argv[1], sys.argv[2], sys.argv[3]
    parts = [p for p in name.replace("-", " ").split() if p]
    initials = (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper()
    bg, fg = PALETTES[int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(PALETTES)]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="{name} avatar">
<rect width="400" height="400" fill="{bg}"/>
<circle cx="200" cy="200" r="150" fill="{fg}"/>
<path d="M95 95 Q200 200 95 305" fill="none" stroke="{bg}" stroke-width="10" stroke-linecap="round"/>
<path d="M305 95 Q200 200 305 305" fill="none" stroke="{bg}" stroke-width="10" stroke-linecap="round"/>
<text x="200" y="228" font-family="Arial Black, Arial, sans-serif" font-size="112" font-weight="900" text-anchor="middle" fill="{bg}">{initials}</text>
<text x="330" y="90" font-size="72" text-anchor="middle">{flag}</text>
</svg>'''
    out = os.path.join(ROOT, "img", "players", slug + ".svg")
    with open(out, "w") as f:
        f.write(svg)
    print("img/players/" + slug + ".svg")
if __name__ == "__main__":
    main()
