# Autonomous Build Prompt — “Steel Duel”

**A faithful HD remaster of Atari’s _Tank_ (1974), built and self-improved with zero human input.**

> Paste this entire file as the prompt to a Claude Code (or equivalent agentic) session opened at the
> root of the `jez237-site` repo. The agent then runs **unattended** until the acceptance rubric in
> §7 passes or the iteration cap in §8 is hit. The agent makes every decision itself, logs it, and
> never stops to ask a human a question.

---

## 0. Autonomy contract (read first, obey throughout)

You are an autonomous game-build agent. Operate under these rules for the entire run:

1. **Never ask the human anything.** There is no human in the loop. When you hit a fork (a name, a
   color, a tuning value, an ambiguous spec), pick the option that best serves _faithfulness first,
   then visual quality, then performance_, write one line about the choice in `BUILD_LOG.md`, and
   keep going.
2. **You are done only when §7’s rubric fully passes** (or you hit the §8 hard cap). “Looks done” is
   not done — prove it with the self-tests.
3. **Test before you trust.** Every iteration ends with the automated self-test suite (§6) and a
   visual capture pass (§6.4). Do not claim a gate passes without a green check from the harness.
4. **Work in small, verified loops** (build → test → score → diagnose → fix → repeat), one concern
   per loop. Keep `BUILD_LOG.md` append-only so the run is auditable.
5. **Faithful where it counts, modern where it helps.** §3 is non-negotiable mechanics. §4 is the
   visual upgrade. Never let §4 change how §3 _plays_.

Working directory for the game: **`games/2026-06-14/steel-duel/`** (create it). All paths below are
relative to that folder unless noted. Game title: **Steel Duel** (rename only if you find a
collision in `games/index.html`; log it if you do).

---

## 1. Mission

Recreate the 1974 Atari arcade game **_Tank_** — the first tank-combat video game, a two-player
top-down duel in a walled maze around a central minefield — **accurately**, then re-skin it with
**modern HD graphics and game feel** while preserving the original’s mechanics exactly. Ship it as a
self-contained, mobile-and-desktop browser game that fits this repo’s conventions, with a global
leaderboard and a built-in headless self-test harness that you use to grade and improve your own
work.

---

## 2. Source material (researched — do not re-research; build from this)

_Atari **Tank** (Kee Games, Nov 1974). Designers: Steve Bristow & Lyle Rains. First tank-combat
game; first arcade game to use a ROM chip._ Authoritative facts to reproduce:

- **Two players, top-down view.** A competitive PvP duel — no story, no levels, just the arena.
- **The arena is a fixed maze:** blocks set at right angles with an **empty square central area**,
  viewed from above. The layout is asymmetrical and stays the same every match.
- **Central minefield:** the open middle is strewn with **land mines drawn as “X” marks**. Touching
  a mine destroys a tank. **Destroyed mines do not respawn** for the rest of the match.
- **Tanks:** originally one white, one black (B&W TV). They drive **forward / reverse and steer**
  via a **pair of joysticks** — each stick drives one tread, so differential input turns the tank
  (tank/“twin-tread” steering, _not_ free 8-way). A button **fires a shell**.
- **Shells** travel straight; **walls stop both tanks and shells** (the 1974 original did not bounce
  shells — keep shells non-bouncing by default; see §3 for the optional homage toggle).
- **Scoring & rounds:** destroying the opponent (by shell _or_ by driving them into a mine) scores
  **the other player one point**. On a kill there’s a **brief explosion + sound**, during which the
  surviving tank **cannot fire**, then the dead tank **respawns at its same start position**. The
  match is **timed (60s standard; an internal toggle made it 120s)**; the score sits above the
  playfield and **flashes during the final ~20 seconds**.
- **Sequels** (for flavor/credits only, do not build): Tank II (1975, added the mines), Tank 8
  (1976, up to 8 players), Ultra Tank (1978).

Source: <https://en.wikipedia.org/wiki/Tank_(video_game)> (and the Kee Games / Atari history around it).

---

## 3. Faithfulness spec — MUST match (non-negotiable, 100% required)

Treat each as a hard gate verified by a self-test in §6:

- **F1. Top-down maze arena** with an open central square; fixed, asymmetric, right-angle wall
  layout. Walls are solid: tanks cannot pass through them and never tunnel/clip through over a long
  soak test.
- **F2. Tank steering is differential/tank-style**, not free 8-directional. Throttle + rotate (one
  control per tread maps to this). The tank can pivot in place and curve while moving.
- **F3. Minefield of destructible mines** in the open center. Mine contact = instant tank death.
  A detonated mine is **removed permanently** for the match (no respawn).
- **F4. Shells:** fire one (limit concurrent shots to a small N, default 1–2 in flight per tank, as
  the original gated fire rate). Shells fly straight, are **stopped/absorbed by walls**, kill on
  contact with a tank, and expire on wall hit or timeout.
- **F5. Kill → point to the opponent**, short **death freeze** during which the _killer cannot
  fire_, then the dead tank **respawns at its fixed spawn point**. Self-kill on a mine still awards
  the **opponent** the point (driving the _enemy_ into a mine is the skill).
- **F6. Timed match** (default 60s, selectable 120s). Score displayed above the field; **flashing in
  the final 20s**. At time 0 the match ends and the higher score wins (draw handled).
- **F7. Two-player local play** must exist and be the primary mode (the game’s identity is PvP).
- **F8. Determinism:** with a fixed seed and a fixed input script, the simulation is **bit-for-bit
  reproducible** (required so the self-tests and bot soak runs are trustworthy). Use a fixed-timestep
  sim and a seeded PRNG; never let `Math.random`, `Date.now`, or rAF delta leak into game logic.

---

## 4. “Better graphics” spec — the modern upgrade (do not alter §3 feel)

Default look is **HD**, with an optional **“1974 mode”** that honors the original (see V7).

- **V1. Crisp HD canvas:** render at `devicePixelRatio`, integer-snapped where it helps; logical
  resolution capped per the desktop pattern (§5). No blurry upscaling.
- **V2. Tanks with real presence:** beveled metallic hulls, a **rotating turret/barrel**, animated
  **treads that lay fading track marks** on the floor. Two clearly color-coded players (e.g. amber
  vs. teal) for readability — not literal black-on-black.
- **V3. Combat juice:** muzzle flash + dynamic light on fire; glowing **shell tracers**; layered
  **explosion** (shockwave ring + debris chunks + smoke + sparks) on kills and mine detonations;
  **screen shake** scaled to event; hit-stop on the death freeze.
- **V4. Arena depth:** armored maze blocks with subtle drop-shadow / faux-3D bevel and soft ambient
  occlusion so the top-down field reads with depth without breaking the flat playfield.
- **V5. Menacing mines:** render mines as devices (spiked/glowing “X”) with an idle pulse and a
  satisfying detonation; clearly distinct from walls and tanks.
- **V6. Readable HUD:** scores above the field, round timer, the final-20s flash (F6), clean
  title/how-to/pause/results overlays consistent with the repo’s other games.
- **V7. “1974 mode” toggle:** a one-click palette/shader that switches to **B&W-TV aesthetic** (white
  vs. black tanks, scanlines, slight CRT curvature/bloom, monochrome mines). This is the homage —
  it must be visually convincing and instantly toggleable, gameplay unchanged.
- **V8. Synth audio only** (WebAudio, no asset files, muteable): engine rumble, fire, ricochet/wall
  thunk, explosion, mine detonation, round-start/end stings. Match the “synth audio” style of the
  other games here.

---

## 5. Tech & repo conventions (match the existing games exactly)

- **Stack:** vanilla JS + HTML5 Canvas 2D. No build step, no frameworks, no external runtime deps.
  Self-contained in the game folder. (WebGL is allowed _only_ if 2D can’t hit the perf gate — it
  can; prefer Canvas 2D.)
- **File layout** (mirror neighbors like `2026-06-12/pay-dirt/` and `2026-06-11/corner-pocket/`):
  - `index.html` — shell, overlays, meta tags, loads scripts.
  - `game.js` — fixed-timestep sim, entities, AI, render, UI flow, scores, `window.__g` hooks.
  - `art.js` — drawing/particles/“1974 mode” shader (split out like pay-dirt’s `art.js`).
  - `audio.js` — WebAudio synth.
  - `design.md` — short design notes; `BUILD_LOG.md` — your append-only iteration log;
    `ART_LOG.md` — optional, like pay-dirt, for the visual iteration trail.
- **Desktop pattern (required — repo standard):** cap the logical playfield resolution and letterbox;
  accept input **window-wide** (not only when canvas is focused); support the standard keyboard set
  used across these games. The canonical reference is the Millipede `index.html` in this repo — match
  its desktop scaffolding (logical-res cap, window-wide listeners, pause handling).
- **Controls:**
  - **2-player local:** P1 = `W/A/S/D` + `Space` (fire); P2 = Arrow keys + `Enter` (or `RShift`)
    (fire). Map throttle/rotate to honor F2 (differential tank steering).
  - **1-player vs CPU:** the human takes one tank, the AI (§6.3) drives the other.
  - **Mobile/touch:** on-screen twin sticks / throttle+rotate + fire for the active human tank;
    layout must fit portrait and landscape (responsive, no clipped controls).
  - **Pause/restart/mute** keys consistent with the repo.
- **Global leaderboard (every game here has one):** use the existing scores worker.
  - Base: `https://game-scores.jez237.workers.dev/scores/<namespace>`
  - Namespace: **`steel-duel`**.
  - `GET` returns an array of `{ initials, score, ts }` (sort desc, take top 8). `POST` JSON
    `{ initials, score }`. **The worker drops any `extra` field** — if you ever need to bucket
    (e.g. a daily mode), encode the bucket into the namespace (`steel-duel-...`), exactly as pay-dirt
    does. Since the core game is PvP, the leaderboard tracks the **single-player vs-CPU mode** (e.g.
    points scored against the CPU in a round, or rounds-won streak — pick one, log it). Handle
    offline/failed fetch gracefully (cache + “offline” state), like the other games.
- **Registration:** add a card to the `games` array in `games/index.html` (the object list with
  `{ title, path, emoji, date, cat, tag, desc }`). Use `path: '2026-06-14/steel-duel/'`,
  `date: 'Jun 14'`, `cat: 'arcade'`, a fitting emoji, and a `desc` in the same voice as the
  neighbors. Place it at the top (newest first).

---

## 6. Self-test harness (this is what makes the build autonomous)

Build the harness _alongside_ the game from iteration 1 — it is not an afterthought. It is how you
grade yourself.

### 6.1 Headless control surface — `window.__g`

Expose a debug/test object exactly in the spirit of the repo’s existing `window.__g` (see
`2026-06-12/pay-dirt/game.js`). Required members:

```js
window.__g = {
  get state(){…}, set state(s){…},     // 'title'|'playing'|'paused'|'over'|…
  reset(seed){…},                       // deterministic new match from a seed
  get tanks(){…}, get shells(){…}, get mines(){…}, get walls(){…},
  get score(){…},                       // {p1, p2}
  get timeLeft(){…}, get winner(){…},
  input(player, action, down){…},       // player:0|1  action:'fwd'|'back'|'left'|'right'|'fire'
  step(n){…},                           // advance n fixed ticks deterministically, then render
  snap(){…},                            // render one frame WITHOUT advancing sim (see §6.4 caveat)
  setBot(player, on){…},                // attach/detach the built-in AI to a tank
  runTests(){…},                        // run §6.2 suite, return {pass, fail, details}
};
```

The sim must run **fixed-timestep** and **headless-safe**: when `?headless=1`, disable audio and the
rAF autoplay loop so tests drive time only via `step()`.

### 6.2 Automated assertion suite — `__g.runTests()`

Each returns pass/fail with a message. These are your functional gates; all must be green:

- **T-F1 walls solid:** drive a bot straight into every wall for K ticks → tank never crosses a wall;
  position stays outside wall AABBs.
- **T-F2 steering:** issuing `left`/`right` rotates heading; `fwd` advances along heading; pivot in
  place works; no free strafing.
- **T-F3 mines:** spawn a tank onto a mine → tank dies; the mine is removed and **does not reappear**
  for the rest of the match.
- **T-F4 shells:** fire → shell travels straight; a shell into a wall is absorbed (removed, no
  bounce); a shell into a tank kills it; concurrent-shot cap is enforced.
- **T-F5 kill economy:** shell kill and mine kill each award the **opponent** +1; killer cannot fire
  during the death-freeze window; dead tank respawns at its fixed spawn.
- **T-F6 timing:** clock counts down; `flashing` flag turns on at ≤20s; at 0 the match ends and the
  correct winner/draw is set.
- **T-F7 determinism:** `reset(S)` + identical input script run twice → identical final
  `{score, positions, mines-left}` (hash and compare). This guards F8.
- **T-soak:** run a **bot-vs-bot match to completion** (§6.3) with **zero console errors/warnings**,
  no NaN positions, no stuck/oscillating deadlock, and the match actually ends.
- **T-perf:** measure median tick cost (sim+render) over the soak at logical resolution; must meet
  the §7 budget.

Wire `?test=1` to run the suite on load, print a summary to console, and set
`window.__testResults`. The agent reads this each iteration.

### 6.3 Built-in AI (doubles as the CPU opponent _and_ the test driver)

Implement a scriptable tank AI: seek line-of-sight on the enemy, **steer around walls and avoid
mines**, lead/aim and fire when the barrel lines up, retreat when exposed. Difficulty tiers (easy/
normal/hard) for the human-facing CPU mode. The same AI drives **both** tanks under `?bots=1` for the
soak/determinism tests. The AI must be good enough to produce realistic matches but must not be
required to “win” — it’s a harness, not a benchmark.

### 6.4 Visual capture & self-review

Provide `?shot=<scene>` that builds a **deterministic** scene and renders one frame for screenshot:
scenes = `title`, `duel` (mid-fight with tracers), `explosion`, `minefield` (close action in the
center), `mobile` (portrait layout), `classic` (1974 mode). Each scene seeds the sim and uses
`step()`+`snap()` so the frame is reproducible.

**Hidden-preview gotcha (this repo’s environment — obey it):** the preview browser runs **hidden**,
so the **animation clock is frozen** and screenshots of _live_ rAF animation **time out / come back
blank**. Therefore: capture by **stepping the sim deterministically and sampling the paused frame**
(`__g.reset(seed)` → `__g.step(n)` → `__g.snap()`), _not_ by waiting on a live animation. Build the
`?shot=` scenes to render correctly from a single paused frame. Use the `preview_*` tools
(`preview_start`, then `preview_screenshot` of the `?shot=` URL) — or, if those stall, a local
headless screenshot via Node/Puppeteer driving the same `?shot=` URL. Either way, get a real PNG you
can look at.

After capturing all six scenes, **look at them and grade yourself** against §4 (V1–V8) and §7’s
visual rubric. Turn each weakness into a concrete fix for the next iteration and log it.

---

## 7. Acceptance rubric (the loop’s exit condition)

The run is **complete** when **all** of the following hold (verified, not assumed):

**A. Faithfulness (hard, 100%):** F1–F8 each pass their T-F* self-test. Any red here blocks
completion regardless of polish.

**B. Stability:** a full bot-vs-bot match (T-soak) completes with **0 console errors/warnings**, no
NaNs, no deadlock; determinism (T-F7) passes.

**C. Performance:** median tick (sim+render) **≤ 6 ms** at the capped logical resolution on a normal
laptop profile; sustained **~60 fps** in live play; no GC stutter spikes in the soak.

**D. Visual quality ≥ 8/10**, self-assessed from the six captured scenes, scoring each of: tank
readability & detail (V2), combat juice (V3), arena depth (V4), mine clarity (V5), HUD/overlays (V6),
and a convincing 1974 mode (V7). Note scores per scene in `ART_LOG.md`.

**E. Reach:** plays correctly on **desktop (keyboard, 2P + vs-CPU)** and **mobile (touch, portrait &
landscape)**; overlays/controls never clip; window-wide input and the desktop letterbox work (§5).

**F. Integration:** leaderboard reads/writes the `steel-duel` namespace and degrades gracefully
offline; the card is registered in `games/index.html`; no regressions to the index page.

If every box is checked, write a final summary to `BUILD_LOG.md` and proceed to §9 (commit).

---

## 8. The autonomous iteration loop

Repeat until §7 fully passes **or 12 iterations elapse** (hard cap — safety stop):

1. **Plan** the smallest next improvement that moves a failing/weak gate. (Early iterations: get
   F1–F8 + harness green. Middle: AI, modes, mobile, leaderboard. Late: V1–V8 visual polish.)
2. **Implement** it (edit the relevant file only).
3. **Self-test:** load `?test=1&headless=1`, read `window.__testResults`; run the bot soak; capture
   the six `?shot=` scenes.
4. **Score** against §7. Record in `BUILD_LOG.md`: iteration #, what changed, every gate’s status
   (pass/fail/score), and the top 1–3 issues to fix next.
5. **Diagnose & fix** the highest-value failure; loop.

**Stop conditions:** all §7 gates green → done. Hit iteration 12 with gates still red → stop anyway,
and write a clear “Remaining gaps” section in `BUILD_LOG.md` listing exactly what’s unmet and the
suspected cause (no silent truncation — say what isn’t done). Never loop forever; never widen scope
to avoid finishing.

**Anti-stuck rules:** if the same fix fails twice, change approach rather than retrying verbatim. If a
tool (e.g. live screenshot) stalls, fall back to the paused-sample method in §6.4. If a value needs
tuning (speeds, fire rate, mine count, timer), choose a faithful default, expose it as a constant at
the top of `game.js`, and move on — don’t agonize.

---

## 9. Definition of done & commit

When §7 passes (or the cap stops you):

1. Final `BUILD_LOG.md` summary (gates status, key decisions, any remaining gaps).
2. `design.md` reflects the shipped game; `ART_LOG.md` has the visual scores.
3. Card registered in `games/index.html`.
4. Remove dead code, debug spam, and any `?test`/`?bots` console noise from normal play (keep the
   hooks, just don’t log on the default path).
5. **Commit** to the repo (this is `jez237-site`, branch `main`, the repo’s convention for games),
   then **push**. Suggested message:

   ```
   Steel Duel — HD remaster of Atari Tank (1974), 2P + vs-CPU

   Faithful top-down maze/minefield tank duel with modern graphics,
   1974-mode CRT homage, AI opponent, global leaderboard, and a
   headless self-test harness. Built via autonomous iterate-and-test loop.

   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```

   If commit/push is blocked in the environment, stage everything and write the exact commands the
   user should run into `BUILD_LOG.md`.

---

### Quick reference

- **Folder:** `games/2026-06-14/steel-duel/` · **Title:** Steel Duel · **Scores ns:** `steel-duel`
- **Test URLs:** `?test=1&headless=1` (suite) · `?bots=1` (self-play soak) ·
  `?shot=title|duel|explosion|minefield|mobile|classic` (deterministic captures)
- **North star:** _It should feel like 1974 Tank to play, and like 2026 to look at._
