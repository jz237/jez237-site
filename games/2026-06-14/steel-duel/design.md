# Steel Duel — design notes

A faithful HD remaster of **Atari _Tank_ (1974)** (Kee Games; the first tank-combat arcade game).
Two tanks duel in a fixed walled maze around a central minefield, top-down, on a 60-second clock.

## Faithful mechanics (the 1974 core)
- **Fixed asymmetric maze** of right-angle blocks with an **open central minefield**.
- **Differential tank steering** — throttle + rotate; pivot in place or curve while moving (not 8-way).
- **Mines** drawn as X devices; touching one destroys a tank and the mine is **removed permanently**.
- **Shells** fly straight, are **stopped/absorbed by walls** (no bounce), one in flight per tank.
- A kill (shell **or** mine) scores **the opponent** a point, triggers a brief **death freeze** during
  which neither tank can fire, then both respawn at their fixed spawns.
- **Timed match** (60s); score above the field, **flashing in the final 20s**; higher score wins.

## Modern layer ("better graphics")
- HD canvas (devicePixelRatio), beveled armored maze blocks with drop-shadow depth.
- Tanks with rotating turret/barrel, animated treads, fading track marks, color-coded (amber vs teal).
- Combat juice: muzzle flash, glowing shell tracers, layered explosions (shockwave ring + debris +
  smoke + sparks), screen shake.
- Pulsing glowing mines.
- **1974 mode** (key `C` / toolbar): B&W-TV palette + scanlines + vignette homage. Gameplay unchanged.
- WebAudio synth SFX + engine rumble, muteable.

## Modes & controls
- **2-Player Duel** (local) and **Play vs CPU** (AI, easy/normal/hard).
- P1 `W/A/S/D` + `Space`; P2 `↑↓←→` + `Enter`. Touch: D-pad + FIRE (best in landscape).
- `P` pause · `C` 1974 mode · `M` mute.

## Tech
- Vanilla JS + Canvas 2D, no build step. `audio.js` (synth), `art.js` (render/particles/CRT),
  `game.js` (sim/AI/UI/scores/tests).
- **Fixed-timestep deterministic sim** (1/60) with a seeded PRNG (mulberry32) — required for the
  self-test harness and bot-vs-bot soak runs.
- Global leaderboard via the shared scores worker, namespace **`steel-duel`**. Because the core game
  is PvP (unrankable), the board tracks **points scored vs the CPU** in a match. Degrades to an
  "offline" state if the worker is unreachable.

## Self-test harness
- `window.__g`: `reset(seed)`, `step(n)`, `snap()`, `input(p,action,down)`, `setBot(p,on)`,
  `runTests()`, `shot(scene)`, `hash()`, plus state getters.
- `?test=1` runs the assertion suite (T-F1…T-F7 + soak + perf) and logs a summary.
- `?bots=1` self-play soak; `?shot=title|duel|explosion|minefield|mobile|classic` deterministic,
  **paused** capture frames (sampled via reset→step→snap so they render under a hidden preview).
