# Swarmbreak tools

Game: `games/2026-11-05/swarmbreak/` (three.js r181 vendored, plain ES modules, no build).
Every local import carries the same `?v=N`; bump them all together (plus `js/main.js?v=` in index.html and `V` in js/audio.js).

| Script | What it does |
| --- | --- |
| `ramp_check.mjs [trials] [sectors] [profile] [difficulty]` | Human-like autopilot (0.35 s reaction with scatter, sometimes late, aim wobble and a limited turn speed, tracks only the ~8 nearest threats and often misses things behind it) plays each sector from wave 1 with 3 Wardens and the typical upgrades (`TYPICAL_UP`); prints the clear rate, deaths / hits per wave try and what killed it. Run sectors in parallel: `for s in 1 2 3 4 5; do node scripts/swarmbreak/ramp_check.mjs 100 $s & done; wait` |
| `action_check.mjs [trials] [difficulty]` | Pace: seconds per wave, kills per minute, machines alive, share of time between waves, and seconds until the first machine is within 6 m. |
| `replay_check.mjs [seeds]` | Records autopilot runs and re-runs every death and boss kill from its saved clip; the world must match bit for bit. |
| `autopilot_check.mjs [runs]` | Chained campaigns (lives and score carry over, salvage buys upgrades) for the demo and human profiles. |
| `console_check.mjs [baseUrl]` | Playwright + Edge: the `?test=1` self-test page, the attract demo, an autoplay campaign and the AI playthrough rolling from the S1 boss into S2; fails on console errors or score POSTs. Needs a static server on the repo root. |
| `gen_audio.py [music\|sfx\|voice\|all] [--only a,b]` | ElevenLabs generation (key read from the Windows user env, never printed). |
| `process_audio.py <game folder> [names]` | Trim / normalise / encode; loop clips (dart, crawl, brute, arc) get a crossfaded seam. |

Difficulty lives in one table: `RAMP` in `js/config.js` (per sector, `[first wave, last wave]`, interpolated per wave).
Last Stand walks the same curve via `standLevel()`. Boss armour/attack rate are `bossHP` / `bossRate` in the same rows.

Page hooks: `?autoplay` (demo autopilot plays), `?sector=N`, `?wave=N` (0-4 waves, 5 = boss), `?seed=N`, `?fixed` (no RAF; drive frames with
`__sb.tick(n)`), `?test=1`, `?demo` (attract demo after 1 s), `?playthrough`, `?stand`, `?relay=ws://127.0.0.1:8787` (local relay), `?netlag=ms`,
`?room=CODE`, `?noscores`, `?q=high|medium|low`.

Online: rooms `SB-XXXX` / `SB-Q-XXXXX` on the Steel Duel relay (its lobby filter hides `^(PPB|A26|CR|SB)-`). Local test: copy
`games/2026-06-14/steel-duel/worker` somewhere, `npx wrangler dev --local --port 8787`, open two pages with `?relay=ws://127.0.0.1:8787`.

Difficulty levels (`DIFFICULTY` in config.js: easy / normal / hard / nightmare) scale the RAMP through `applyDiff()`; warnings never
drop below `MIN_WARN`. Each level has its own boards (`swarmbreak[-easy|-hard|-nightmare]`, `swarmbreak-laststand[-...]`) and best times.
v1.1.0 ramp_check (60 runs): Normal 100/95/93/73/40 %, Hard 100/87/63/23/7 %, Easy 100 % everywhere, Nightmare 100/85/20/0/0 % (40 runs).
Power-ups: `POWERUPS` + `DROP` in config.js; drops, supply pods, WINGMAN, SEEKERS, RAIL and TIME WARP live in sim.js (search `power-ups`).

v1.2.0: sector hazards (`haz` in RAMP; sim.js `sectorHazards`: metro surge strips, foundry spill pools, vault laser strips, reactor
lightning rings, none in sector 1, from wave 2, tell >= 0.9 s), kill streak (`STREAK`, `streakMul`; extra lives use `W.lifePts`, points
without the streak bonus), DAILY CHALLENGE (main.js `dailyCfg`: UTC date -> seed + sector, Hard, board `swarmbreak-daily-YYYYMMDD`),
SUITS unlocked by medals, clear coat only on the high graphics tier. Ramp (60 runs): Normal 100/100/87/73/52 %, Hard 100/88/72/32/12 %.
Freeze fix (v1.1.1): the light count never changes after boot (fixed light pools; never toggle a light's visibility) and every sector is
compiled at load. Check with a real-RAF long-frame logger (headless Edge) before shipping visual changes.

v1.3.0: new machines (config ENEMY bulwark / leaper / mimic, INTRO, RAMP mix + `mimic` count; sim.js behaviours under
`case 'bulwark'|'leaper'|'mimic'`, `reveal()`; shields soak `shield + 2*sector` hits and only cover +-arc radians in front; leapers
mark `lx/lz` before jumping and can't be hit in the air; disguised mimics (`e.hidden`) don't block wave clear and slip away at the end).
Ramp (60 runs): Normal 100/95/90/77/38 %, Hard 100/87/65/25/10 %.

- `node scripts/swarmbreak/crowd_check.mjs [trials] [difficulty]`: how crowded the arena gets - average and peak machines alive per wave, per sector (human-like autopilot).

v1.7.0 (enemy AI): RAMP `smart` (0.55 in S1 up to 1.0 in S5; Easy x0.55, Hard x1.1, Nightmare x1.25; sector 1 keeps it at 0 for its first 30 s of fighting and eases it in over 20 s, for the idle-player self-test) sharpens the machines' tactics in sim.js `enemy()`. Crawlers wander less, close on the Warden's predicted position (`leadPos`) from spread flank angles and pounce over the last 2.6 m. Brutes hunt a Warden within 6-10 m. Spitters keep closer, strafe out of the Warden's line of fire (`inFire`) and lead 60 % of the way. Darts, splitters, shards and mimics cut the Warden off and weave out of its fire. Leapers lead further and recover faster; bulwarks plod faster. SWARM SURGES (`swarmSurge`, not in boss fights): every 19 - 7*smart s a tell (`surgetell`: low crawl + alarm, caption, red edge glow `#surgeglow`), then the 5-9 nearest crawlers / shards / splitters / mimics rush (`e.sg`, faster, no wandering) for 1.8-2.6 s (`surgego`). Paid for with smaller later hordes (S2 ends at 38 ... S5 48-54), slower spitter fire in S3-S5 (0.46-0.53) and a free shield on the early waves of S3-S5. `aggro_check.mjs [runs] [sectors]` compares the tactics at smart 0 with now. Ramp (100 runs): Normal 100/85/61/43/28 %, Hard (60 runs) 100/65/30/10/12 %.

v2.0.0: the visual overhaul, all in the renderer (the simulation is untouched: same RAMP, same clear rates, replays still bit-exact).
`js/gfx.js` holds the new pieces: the sky (sun, clouds, stars; `heaven` in each `LOOKS` row), the living floor (`livingFloor()` injects
into the floor's standard material: cloud shadows / standing water with rain rings / heat in the seams / data along the lines / energy
under the grate, plus up to 3 pulses of light, `Renderer.pulse()`; off on the low tier), `Warp` (instanced warp-in beams and floor
rings, 72), `Trails` (instanced shot and bolt streaks), `Traffic`, `crownGeometry`, sign / water / lightning helpers.
fx.js: `glow()` light pools on the floor (instanced, 56) and instanced scorch marks (96, kept until replaced).
Scenery is built once per sector and cached (`makeProps` / `propSets`); lights still come from the fixed pool (never add or toggle a light).
Wall lights react (`stripFlash`, red throb in boss fights and surges). Results show a rank (main.js `rankOf`: rescues 35, Wardens kept 30,
best streak 20, accuracy 15). A beat of slow motion when a wave is cleared (not online, not with reduced flashes).
Programs: 53 after warm-up and fixed (was 43). Draw calls / triangles / CPU per frame unchanged (measure with a per-frame
`renderer.info` hook; `info.autoReset = false`). GLSL: never `pow(x, 2.0)` with a possibly negative x (NaN on some GPUs), write `x * x`.
Capture hook: `__sb.scenic(sector)` shows a sector on the title.

