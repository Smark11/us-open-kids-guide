# DESIGN — Nora's US Open Guide

## Direction: "Sticker album on a blue court"

A collector's sticker album dropped onto a US Open hard court. Every player is a
thick cream trading card with a hard black-blue offset shadow, stuck on at a
slight tilt like a kid pressed it down herself. The page ground is court blue
with white court lines; the accent is neon tennis-ball yellow. Nothing is
grey, nothing is thin, nothing is subtle — it has to read at arm's length in
full September sun on a phone.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--court` | `#1E56D9` | page ground (US Open blue). White text on it = 6.2:1 |
| `--court-deep` | `#12358F` | hero bands, night-session badge |
| `--ink` | `#0B1B4A` | all body text, borders, hard shadows (on cream = 15:1) |
| `--paper` | `#FFF9EC` | card faces (warm cream, not white — sticker feel) |
| `--line` | `#FFFFFF` | court lines, text on blue |
| `--ball` | `#E0FF3A` | primary accent: seed badges, active pills, CTA |
| `--star` | `#FFC531` | favorite star |
| `--t1` | `#FF7A1A` | tier 1 "Superstars" (ink text on it = 6.4:1) |
| `--t2` | `#7A3CE6` | tier 2 "Seeds" (white text = 5.8:1) |
| `--t3` | `#2FBF71` | tier 3 "Rising Stars" (ink text = 7:1) |

## Type

- Display: **Lilita One** (chunky, rounded, one weight — sticker lettering).
  Fallback: `"Arial Rounded MT Bold", "Helvetica Neue", Arial, sans-serif`.
- Body: **Nunito** 700/800 (rounded, friendly, bold enough for sun).
  Fallback: system-ui / Helvetica.
- Body ≥ 18px on phone; card names 20px+; hero title ~44px on phone.
- Loaded via Google Fonts with `display=swap`; offline it still looks right.

## Tactile rules

- Cards: 4px ink border, 24px radius, `6px 6px 0 var(--ink)` hard shadow.
  Odd cards tilt −1.2°, even +1°. Hover/focus: un-tilt, lift 3px, shadow grows.
  Active/tap: press down (shadow 2px).
- Pills (filters): 48px tall, 3px ink border, ball-yellow when active, with a
  sticker-peel wobble on activation.
- Seed badge: yellow ball circle with the number — "the ranking badge".
- Fun facts: 3D flip cards (front = "Fun fact #1 — tap!", back = fact) with a
  ball-yellow back face. `prefers-reduced-motion` → instant swap, no 3D.
- Loader/decor: a bouncing tennis ball in the hero (CSS only, reduced-motion
  safe).
- Focus: 4px ball-yellow outline + 2px ink offset — visible on blue and cream.

## Layout

- Hero band (court blue, white court-line stripes) → sticky filter bar →
  "Saturday's Matches" court groups → player sticker grid
  (2 col @ 390, 3 @ 768, 4 @ ≥1100) → photo credits footer.
- Detail = full-screen cream sheet with a huge round close button top-right,
  prev/next arrows bottom, URL hash `#p/<slug>`.
