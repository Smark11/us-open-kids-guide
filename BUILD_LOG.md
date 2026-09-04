# BUILD_LOG — US Open Kids Guide

Target: Saturday, September 5, 2026 (Day 6, third round). Build started 2026-09-04 12:58 local.

## Node status
| Node | Status | Iterations | Notes |
|---|---|---|---|
| 0 Setup | DONE | 1 | git init, folders, gh auth OK (account Smark11). Playwright not preinstalled. |
| 1 Schedule | DONE | 1 | 16 matches / 32 players. Official OOP NOT published (usopen.org day feed `released:false`); courts/sessions TBD, tiers by seed only. Half-split confident via draw feed eventDay. Sept 5 is officially Day 7 (spec said Day 6). |
| 2 Research | DONE | 1 | 6 parallel researchers, batched (6/6/6/5/5/4 players), Tier 1 first. Deviation from 1-agent-per-player for wall-clock efficiency; files are per-player so no write conflicts. |
| 3 Fact check | RUNNING | 2 | Batches A, E, F verified (15 players). Batches B, C, D re-running after an API session-limit outage at ~17:20 ET killed 4 checkers + designer mid-run. |
| 4 Kid editor | pending | | |
| Gate 1 | pending | | |
| 5 Design/build | RUNNING | 1 | Started early (parallel with research; no shared files). Cut off by API limit; resumed 17:50 ET. |
| 6 Review loop | pending | | |
| Gate 2 | pending | | |
| 7 Deploy | pending | | |
| 8 Wrap | pending | | |

## Decisions
- Kid name is "Nora" (user confirmed mid-build). Stored in `data/config.json` as `kidName`; hero renders "Nora's US Open Guide".

## Photo pass
- Six parallel researchers tripped Wikipedia API 429s; orchestrator ran a serial pass with backoff. 31/32 players have CC-licensed Commons photos; Alexander Blockx has no Commons photo -> SVG avatar.

## Open issues
- API session limit hit at ~17:20 ET (reset 17:50). Lost: fact-check B/C/D, designer mid-review. All relaunched.
- Order of play for Sat Sept 5 not yet released. Re-run schedule scout Friday evening (see scripts/refresh.md).
