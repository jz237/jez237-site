# CHROME RIOT — design doc (v1.0.0, unfinished review build)

Clean-room, Robotron: 2084–inspired twin-stick arena shooter. Single self-contained
`index.html`, mobile-first with twin floating on-screen joysticks. Original name, art,
audio, and enemy fiction — no Williams assets or trademarks. Year is 2086 (not 2084).

**Fiction:** 2086. The Chrome — humanity's own machines — have voted their makers
obsolete. One augmented courier and the last human family are all that's left to save.

## Research base

Mechanics were reconstructed from primary sources, not memory:

- Scott Tunstall's commented arcade ROM disassembly (seanriddle.com/robomame.asm) —
  per-enemy speeds/caps/AI cadence, safe-spawn rectangles, death-rebuild logic.
- Sean Riddle's decoded per-wave enemy table (robowaves.html) — exact 40-wave counts.
- Eugene Jarvis's 2012 "Enemy Dynamics" essays — designer-stated behavior intent.
- StrategyWiki / original Williams manual — scoring table, rescue-bonus reset rules.

Touch design follows the Game Developer iOS twin-stick usability study + nipplejs
defaults (floating origin, display-on-touch, per-pointerId tracking, radial dead zones).
Rendering/audio follow mobile canvas practice: no per-frame shadowBlur (baked glow
sprites + `lighter` compositing), pooled particles, one AudioContext with
compressor-protected master bus, all SFX/music/voice synthesized (zero assets).

## Roster mapping (clone name = original role)

| Chrome Riot | Role | Pts | Behavior kept from research |
|---|---|---|---|
| DRUDGE | Grunt | 100 | 4px jumps at random intervals; speeds up 0.875× per kill + time ramp; dies on Pylons |
| PYLON | Electrode | 0 | static, one-shot kill, kills player+Drudges (mutual), crushed by Juggernauts, new shape each wave |
| JUGGERNAUT | Hulk | — | indestructible; stalks humans in H/V legs; shots push it ~4–12px along bullet direction |
| HIVE | Spheroid | 1000 | edge spawn, curving drift, drops 1–6 Wasps then despawns for 0 pts; 8-Wasp cap |
| WASP | Enforcer | 150 | glide at player ± 16px offset, velocity ∝ distance |
| · stinger | Spark | 25 | aim jitter ±16px, speed ∝ distance, random curvature (curve balls), no bounce — slides walls into corners; cap 20 |
| CORTEX | Brain | 500 | brain waves (every 5th) only; walks to nearest human, converts within 6px |
| · seeker | Cruise missile | 25 | zigzag homing snake with trail, wall bounce, cap 8 |
| THRALL | Prog | 100 | converted human; fast erratic axis-run chaser with glow trail |
| FORGE | Quark | 1000 | bouncing diagonal drift; drops 1–6 Crawlers then leaves; 20-Crawler cap |
| CRAWLER | Tank | 200 | slow roller; shells ~50% direct / ~50% one-bounce bank shots, speed ∝ distance |
| · shell | Tank shell | 50 | shootable, true wall bounce |
| Family (MA/PA/KID) | Mommy/Daddy/Mikey | 1000→5000 | wander; rescue chain 1k/2k/3k/4k/5k(cap), resets on new wave AND on death |

Core rules kept: fixed single-screen arena (268×200 logic units, uniform-scaled to the
screen); player always spawns center; enemies spawn outside a shrinking safe rectangle
(~192×112 wave 1 → 72×50 wave 10+); ~1s materialization shimmer with AI frozen; max 4
player shots, ~7.5 shots/s held, 6px/tick bullets that splash on walls; wave ends when
all killable robots die (Juggernauts/Pylons/humans don't count); on death the wave
rebuilds — survivors re-placed, loose Wasps fold back into Hives, Hives/Forges get fresh
quotas, Drudge speed re-throttles, rescue chain resets; exact 40-wave ROM composition
table, waves 21–40 cycling forever after 40; 3 lives, extra life every 25,000.

## Controls

- **Touch (primary):** twin floating sticks — invisible until touched, base spawns
  under the thumb, left half = move, right half = aim + auto-fire past a 0.15 dead zone
  (move 0.12), radius ~55px, input active beyond the ring, zeroed instantly on release,
  250ms fade. Pointer Events with per-pointerId ownership + setPointerCapture;
  pointercancel = release. Both inputs quantized to 8 ways (authentic).
- **Keyboard:** WASD move, arrow keys fire. **Mouse:** hold button to fire toward cursor.
- **Gamepad:** left stick move, right stick fire.
- Mobile hygiene: touch-action:none, overscroll none, viewport-fit=cover + safe-area
  insets, DPR capped at 2, dt clamped, pause on tab hide, wake-lock best effort,
  audio unlocked on first gesture (touchend-safe) with interrupted-state recovery.

## Voice + audio

All synthesized. SFX per event (fire/kills/rescue/materialize/death/wave-clear), dark
118 BPM synth loop via lookahead scheduler, and a ring-mod "machine voice" that barks
robot gibberish with a text caption. Every bark is generated fresh (randomized syllables,
formants, contour) so no two repeats; caption text pools per event (wave start, brain
wave, rescue, chain-max, Juggernaut push, death, extra life, game over). speechSynthesis
rejected deliberately (latency, no WebAudio routing, device-dependent voices).

## QA hooks

- `window.__CHROME_RIOT__`: state getters, `frame(q)` screenshot, `setInput()`,
  synchronous `autoRun(seconds, {untilWave})` — fixed-step, rAF-free (headless-safe),
  returns {waves, score, deaths, ticks, errors, nanCheck}. Bot = weighted threat
  repulsion + human attraction + nearest-target fire.
- `?autoRun=1` — real-time self-playing mode. `?wave=N` — start at wave N.

## v1 shipped vs deferred

**In v1:** full 12-type roster incl. Forges/Crawlers, 40-wave table + cycling, rescue
chain, death-rebuild rule, twin floating sticks + keyboard/mouse/gamepad, synth
SFX/music/voice with captions, local top-10 high scores (initials), pause, field-manual
title screen, autoRun QA.

**Deferred:** 2-player, global leaderboard (fleet worker endpoint exists), attract-mode
demo on title, gamepad rumble, enforcer "scared puppy" + "Mikey bug" quirk emulation,
Bozo mode, per-wave Pylon shape variety beyond 4 shapes, PWA manifest,
difficulty settings.

## v1.1.0 — arcade authenticity pass (same day)

Pushed the presentation and pressure much closer to the 1982 original:
- Playfield is now stark black (grid removed); the arena border is drawn live every frame
  and colour-cycles arcade-style, flashing gold on rescues, red on death, cyan on extra
  lives, white on wave clear.
- The materialization is the iconic warp-in: four sparks converge, a vertical scan line
  grows, and the sprite unfolds sideways out of it — rainbow/psychedelic on brain waves.
  The player warps in the same way.
- Thralls (Progs) now leave the classic colour-cycling segmented trail.
- Fifth electrode variant: a flashing "2086" text mine (nod to the original's 2084
  electrode). Shapes cycle over 5 per wave.
- Mikey-bug emulation: every Cortex fixates on the same single human at wave setup
  (the kid when present), reverting to nearest-human when that one is gone — enabling
  the authentic brain-wave farming strategy.
- Late-wave frenzy: grunt-speed floor drops at 45s and 60s into a wave, producing the
  "frenzied charge" Jarvis described.
- Hives now bias their drift toward the nearest wall (edge-hugging Spheroids), and 25%
  of Wasp stingers lead the player's movement instead of aiming at their position.
- Robotron HUD colours (red score / yellow best / cyan wave), bigger multi-colour death
  bloom with colour-cycling shockwave rings.
- Robustness: zero-sized-viewport guard in computeFit/draw (seed-tab/iframe edge case).

## Post-review fixes (same day, pre-publish)

A 4-dimension review (correctness / mobile / perf / spec fidelity) with adversarial
verification confirmed 19 findings (13 unique); all fixed: tap-vs-scroll discrimination
on modal buttons, window-blur input latch (keys/mouse/sticks) with auto-pause, mouse
pointer capture, lethal Hives (were pass-through), 1–6 factory quotas (were 1–5), forge
materialize ghost used the hive sprite, orientation-change re-baked the background 9×
with fresh canvases (now cached + seeded stars), glow sprites now draw smoothed while
pixel sprites stay crisp, shake gated off in menus, waveclear now auto-pauses on tab
hide (resume returns to the correct state), iOS landscape top-edge dead zone padding,
44pt initials buttons, wake lock, and the missing setInput() QA hook.
