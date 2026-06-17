# Autonomous Build Prompt — "Steel Duel: Campaign"

**Grow the existing _Steel Duel_ arena duel into a full single-player & co-op PvE campaign — levels,
multiple enemy tank types, and bosses — built and self-graded with zero human input.**

> Paste this entire file as the prompt to a Claude Code (or equivalent agentic) session opened at the
> root of the `jez237-site` repo. The agent runs **unattended** in a plan → build → test → score loop
> until the §7 rubric passes (or the §8 cap hits). It makes every decision itself, logs each one, and
> **never stops to ask a human**.

---

## 0. Autonomy contract (read first, obey throughout)

1. **Never ask the human anything.** No human is in the loop. At any fork (a name, a stat, a layout,
   a tuning value, an ambiguous spec), pick the option that best serves — in order — **(a) not
   breaking the existing faithful Versus game, (b) fun/feel of the campaign, (c) visual quality,
   (d) performance** — write one line in `BUILD_LOG.md`, and keep moving.
2. **Done only when §7's rubric fully passes** (or the §8 hard cap). "Looks done" is not done — prove
   it with the self-test harness and the captured scenes.
3. **Test before you trust.** Every iteration ends with the automated suite (`?test=1&headless=1`),
   a bot soak, and a visual capture pass. No gate is "green" without a check from the harness.
4. **Small, verified loops** — one concern per loop; `BUILD_LOG.md` stays append-only and auditable.
5. **Build ON the existing game; do not rewrite it.** The current `game.js` / `art.js` / `audio.js`
   already ship a faithful, deterministic, fully-tested duel. Extend it; keep its modes and tests
   green. Treat a regression in the existing faithfulness gates (F1–F8) as a build-stopping bug.

Working directory: **`games/2026-06-14/steel-duel/`**. All paths are relative to it unless noted.

---

## 1. Mission

The shipped game is **Steel Duel** — a faithful HD remaster of Atari _Tank_ (1974): a top-down,
maze-and-minefield **PvP duel** with modes `cpu` (1P vs CPU), `duel` (local 2P), `coop` (vs enemy
tanks), `watch`, an **online** worker (`steel-duel-online`, Durable Objects), an A\* AI with a
Stupid→Can't-Defeat skill slider, destructible walls, a 1974-mode CRT homage, a leaderboard
(namespace `steel-duel`), and a `window.__g` self-test harness.

**Your job:** turn the single 60-second arena into a **full campaign** for **single-player and
co-op** — a sequence of hand-shaped **levels** with **waves of varied enemy tank types** and periodic
**boss** fights — while leaving the existing Versus identity intact. New, **larger arenas with
thinner walls and more open room to maneuver** are explicitly encouraged for campaign levels.

> North star: _Versus still plays like 1974 Tank. Campaign feels like a modern arcade tank shooter
> you and a friend can fight through together._

---

## 2. What already exists (read the code before changing it)

Read these first — do not guess:
- `game.js` — fixed-timestep deterministic sim (seeded mulberry32), entities (`tanks`, `shells`,
  `mines`, `walls`/`wallHP`), A\* AI, command bus (keys/mouse/twin-stick/AI), state machine
  (`state`: `attract|playing|paused|over|how|scores`; `mode`: `cpu|duel|coop|watch`), `COOP_SPAWNS`
  (4), online sync (`online` object, `ONLINE_WS`), HUD/overlay flow, leaderboard, `window.__g` hooks,
  `runTests()`.
- `art.js` — render/particles/CRT shader; `audio.js` — WebAudio synth.
- `index.html` — shell, overlays (`ovTitle|ovOnline|ovHow|ovPause|ovOver|ovScores`), desktop letterbox.
- `worker/src/index.js` + `worker/wrangler.jsonc` — online rooms/lobby (Durable Objects). The PvE
  campaign should run **host-authoritative on the existing input-relay model** (host simulates enemy
  AI; peers send input) so co-op needs **minimal or no** worker change. Only touch the worker if a
  campaign feature truly requires it, and if so keep the existing duel/coop online paths working.
- `design.md`, `BUILD_LOG.md`, `ART_LOG.md`, and the sibling `AUTONOMOUS_BUILD_PROMPT.md` (the
  original spec — its faithfulness gates F1–F8 still apply to Versus).

**Preserve:** determinism (no `Math.random`/`Date.now`/rAF-delta in sim), the desktop pattern
(logical-res cap, window-wide input — Millipede is canonical), 1974-mode, mobile twin-stick, the
existing harness URLs, and the leaderboard contract (worker drops `extra`; bucket via namespace).

---

## 3. Campaign spec — what to build (the new game)

Add a **`campaign` mode** (selectable for 1P and co-op; co-op also via the existing local 2–4P and
online paths) alongside the untouched Versus modes. Design the specifics yourself; these are the
required pillars, each backed by a self-test in §6:

- **C1. Levels & progression.** A campaign is an ordered list of **levels** (data-driven — define
  them in a `levels.js`-style table or a `LEVELS` array so they're easy to author/test). Each level:
  an arena layout + an enemy plan (waves) + a clear condition (default: destroy all enemies / survive
  all waves) + optional objective flavor. Clearing a level advances to the next; a results beat shows
  progress. The campaign has a **beginning, a difficulty ramp, and an end** (a final boss + victory).
  Target a satisfying length (≈8–15 levels incl. bosses — pick and log the count).
- **C2. Lives / health & fail state.** Give the player(s) a survivability model (a small health pool
  or a lives count with respawn, your call — log it). Define **game-over** (all players out) and
  **continue/restart** flow. In co-op, define shared-vs-individual lives and a **revive** rule so one
  player dying doesn't end everyone's run instantly.
- **C3. Enemy tank types (≥5 distinct).** Each is a variant of the tank with its own stats, color,
  silhouette, and AI behavior — visually and tactically distinguishable. Suggested roster (rename/
  retune freely, log choices): **Grunt** (baseline), **Scout** (fast, fragile, swarms), **Brute/
  Heavy** (slow, high HP, heavy shell), **Sniper** (long range, leads, keeps distance), **Layer**
  (drops mines), and one "trick" type — **Shielded** (front armor that must be flanked) or **Bouncer**
  (ricocheting shells). Reuse the A\* driver + skill model; differentiate via stats + behavior knobs,
  not a parallel AI rewrite. Heavies/some types may take **multiple hits** (introduce tank HP for
  enemies; the faithful Versus one-shot rule is unchanged in Versus modes).
- **C4. Bosses (≥2, multi-phase).** Large, special encounters every few levels and as the finale.
  Each boss has **distinct attacks, more HP, weak points or phases**, and a telegraph→punish loop the
  player can learn. Examples (invent your own): a multi-turret **Fortress**, coordinated **Twin
  Heavies**, a giant **Warlord** with exposed weak points between salvos. Bosses must be **beatable**
  solo at default difficulty and scale sensibly in co-op.
- **C5. New arenas — bigger & thinner-walled.** Author several fresh campaign arenas. They **may be
  larger than the duel field and use thinner walls with more open maneuvering space** (the user
  explicitly allows this). Walls stay **solid and non-clipping** (tested at the new thickness). Vary
  layouts (open fields, corridors, arenas, choke points, mine-heavy zones) so levels feel different.
  Keep performance within §7's budget as entity counts rise.
- **C6. Co-op as a first-class mode.** Campaign co-op for **2–4 players**: local (shared keyboard/
  twin-stick splits already supported by `COOP_SPAWNS`) and **online** (existing room/host model).
  Enemy counts/HP **scale with player count**. Friendly fire off by default (log if you choose
  otherwise). Shared progression and a combined score.
- **C7. Difficulty.** Reuse the skill slider as a campaign difficulty selector (e.g. Recruit →
  Veteran → Lethal) that scales enemy aim/HP/counts. Keep the curve fair: early levels teachable,
  late levels demanding.
- **C8. Onboarding & flow.** A campaign entry on the title/menu; a brief in-level intro (level name/
  number, wave indicator), wave/level-clear and boss-incoming beats, results/continue/game-over
  overlays consistent with the repo's other games. The player should understand goals without a
  manual.

**Modern feel (extend the existing juice, don't regress it):** distinct enemy/boss visuals & SFX,
damage states for multi-HP tanks, wave/boss telegraphs, screen-shake scaled to bosses, a readable
campaign HUD (level, wave, lives/health, co-op players). 1974-mode must still toggle and look right.

---

## 4. Hard constraints (do not break)

- **Versus untouched in feel.** `cpu`/`duel`/`watch` and the online duel keep playing exactly as now;
  F1–F8 self-tests stay green. Enemy tank HP, lives, etc. are **campaign-only** systems.
- **Determinism preserved.** All new systems (waves, enemy spawns, boss phases, level RNG) run inside
  the fixed-timestep sim off the seeded PRNG. `__g.reset(seed)`+identical inputs ⇒ identical result,
  including campaign progression. No `Math.random`/`Date.now`/rAF-delta in sim logic.
- **No build step / no deps.** Vanilla JS + Canvas 2D, self-contained in the folder, matching repo
  conventions. Split new code sensibly (e.g. `levels.js`, `enemies.js`, `bosses.js`, or well-marked
  sections) — keep files readable.
- **Stay self-contained & offline-tolerant.** Leaderboard and online degrade gracefully when the
  worker is unreachable (the campaign must be fully playable solo offline).
- **Performance budget holds** under the heaviest campaign moment (boss + max enemies + 4 co-op
  tanks + particles) — see §7C.

---

## 5. Self-test harness — extend it for the campaign (this is what makes the loop autonomous)

Keep the existing `window.__g` surface and **add** campaign hooks so you can grade yourself headlessly:

```js
// extend window.__g
startCampaign(level, players, difficulty, seed)  // deterministic boot into a campaign level
get campaign()        // { level, wave, enemiesLeft, lives|health, players, state }
get enemies()         // active enemy tanks (with type)
get boss()            // boss entity/phase or null
spawnEnemy(type, x, y)// for targeted type tests
advanceLevel() / loseLife()   // drive progression deterministically
```

Add these to `runTests()` (each returns pass/fail + message; all must be green):
- **T-C1 progression:** clearing a level's enemies advances `level`; finishing the last level reaches
  a victory state; failing all lives reaches game-over. No soft-locks.
- **T-C2 enemy types:** each enemy type spawns with its distinct stats and exhibits its signature
  behavior (Scout faster than Brute; Sniper keeps distance & fires from range; Layer drops a mine;
  Shielded/Bouncer trick verified). Multi-HP enemies take the intended number of hits.
- **T-C3 boss:** a boss spawns, survives ≥2 hits, transitions phases, and is defeatable by a scripted
  attack sequence; defeating it advances/wins. Boss never NaNs or soft-locks.
- **T-C4 walls (new arenas):** drive bots into every wall of every campaign arena over a soak — no
  clip/tunnel even at the new thinner thickness; border indestructible.
- **T-C5 co-op scaling:** with N=2..4 players, enemy count/HP scales; one player's death does not end
  the run while others live; revive rule works; shared score correct.
- **T-C6 determinism:** `startCampaign(L,P,D,seed)` + identical input script twice ⇒ identical
  `{level, wave, enemiesLeft, lives, positions}` hash. Guards the no-RNG-leak rule for new systems.
- **T-soak+:** a bot-driven campaign run (AI plays the player tank) clears ≥1 full level incl. a wave
  cycle with **0 console errors/warnings**, no NaN, no deadlock.
- **T-perf+:** median tick (sim+render) at the **heaviest** campaign frame meets §7C.
- **Keep T-F1…T-F7, T-WALL, T-AI green** (Versus regression guard).

Add `?shot=` scenes for the new content and capture/grade them (paused-frame method — see below):
`campaign` (mid-level with several enemy types), `boss` (a boss mid-fight), `coop` (2–4 tanks vs a
wave), plus keep `title/duel/explosion/minefield/mobile/classic`.

**Hidden-preview gotcha (obey):** the preview browser runs hidden ⇒ the animation clock is frozen and
live screenshots time out/blank. Capture by **stepping deterministically and sampling the paused
frame** (`__g.reset/startCampaign(seed)` → `__g.step(n)` → `__g.snap()`), not by waiting on rAF. Use
`preview_*` tools against the `?shot=` URL, or a local headless Node/Puppeteer screenshot of the same
URL — either way produce a **real PNG you look at** and grade.

---

## 6. Plan first (iteration 0)

Before coding, write a concrete plan into **`CAMPAIGN_DESIGN.md`**: the level list (numbers, arena
theme, enemy plan, boss positions), the enemy-type roster with stats/behaviors, the boss designs
(phases/weak points), the lives/health & co-op rules, and the difficulty curve. This is your contract
with yourself; refine it as you learn, but always keep it current. Log "Iter 0 — plan" in
`BUILD_LOG.md`.

---

## 7. Acceptance rubric (the loop's exit condition — verified, not assumed)

- **A. Versus intact:** F1–F8 + T-WALL + T-AI all green. Any red here blocks completion.
- **B. Campaign complete & correct:** T-C1…T-C6 green; the campaign is **playable start-to-finish**
  solo (boot → clear all levels → beat final boss → victory) and the bot soak proves a level + wave
  cycle runs clean.
- **C. Performance:** median tick (sim+render) **≤ 8 ms** at the heaviest campaign frame on a normal
  laptop profile; sustained ~60 fps in live play; no GC stutter in the soak. (Versus stays ≤6 ms.)
- **D. Stability:** full campaign bot soak + a boss fight complete with **0 console errors/warnings**,
  no NaN, no soft-lock; determinism (T-C6 & T-F7) passes.
- **E. Content bar:** ≥5 distinct enemy types (each visually & behaviorally distinct), ≥2 multi-phase
  bosses incl. a finale, ≥6 distinct arenas (some larger/thinner-walled), and a working lives/health
  + co-op-scaling model.
- **F. Visual quality ≥ 8/10**, self-assessed from the captured scenes (`campaign`, `boss`, `coop`
  + the originals): enemy/boss readability & distinctiveness, combat juice, arena depth, HUD clarity,
  and a still-convincing 1974-mode. Note per-scene scores in `ART_LOG.md`.
- **G. Reach:** desktop (keyboard, 1P + local co-op + vs-CPU) and mobile (touch, portrait & landscape)
  both work; overlays/controls never clip; window-wide input + letterbox hold.
- **H. Integration:** campaign result writes to the `steel-duel` leaderboard sensibly (e.g. encode
  difficulty + level-reached/score into the score, bucket via namespace if needed) and degrades
  offline; the `games/index.html` card/desc reflects the campaign; no index regressions; online
  co-op still connects (or, if untouched, still works as before).

All boxes checked → write a final `BUILD_LOG.md` summary and go to §9.

---

## 8. The autonomous iteration loop

Repeat until §7 fully passes **or 20 iterations elapse** (hard safety cap):

1. **Plan** the smallest next step that moves a failing/weak gate. Rough order: (i) campaign
   scaffolding — mode, state, level table, one arena, win/lose, harness hooks; (ii) enemy types +
   tank-HP; (iii) waves + progression across several levels; (iv) bosses; (v) co-op scaling + lives/
   revive; (vi) onboarding/HUD/flow; (vii) visual & audio polish; (viii) balance/difficulty; (ix)
   integration + leaderboard + index card.
2. **Implement** it (smallest edit that works; keep files readable).
3. **Self-test:** `?test=1&headless=1` → read `window.__testResults`; run the bot soak; capture the
   relevant `?shot=` scenes.
4. **Score** against §7. Append to `BUILD_LOG.md`: iteration #, what changed, every gate's status
   (pass/fail/score), and the top 1–3 issues to fix next.
5. **Diagnose & fix** the highest-value failure; loop.

**Stop conditions:** all §7 gates green → done. Hit iteration 20 with gates red → stop anyway and
write a clear **"Remaining gaps"** section in `BUILD_LOG.md` (exactly what's unmet + suspected cause —
no silent truncation). Never loop forever; never widen scope to avoid finishing.

**Anti-stuck rules:** if the same fix fails twice, change approach instead of retrying verbatim. If a
tool stalls (e.g. live screenshot), use the paused-sample method. If a number needs tuning (enemy HP,
counts, speeds, wave timing, boss phases), pick a sensible default, hoist it to a named constant at
the top of its file, and move on — don't agonize. If determinism breaks, bisect the new system that
introduced RNG/time leakage and route it through the seeded PRNG.

---

## 9. Definition of done & ship

When §7 passes (or the cap stops you):

1. Final `BUILD_LOG.md` summary (every gate's status, key autonomous decisions, any remaining gaps).
2. `CAMPAIGN_DESIGN.md` reflects the shipped campaign; `design.md` updated; `ART_LOG.md` has scores.
3. `games/index.html` card/desc updated to mention the campaign (keep it newest-first; don't regress
   the index).
4. Remove dead code, debug spam, and `?test`/`?bots` console noise from the default play path (keep
   the hooks, just don't log normally).
5. **Ship — push to GitHub and jez237.com:**
   - The game lives in **`jez237-site`** (branch `main`); **jez237.com is its GitHub Pages deploy**,
     so a single commit+push to `jez237-site main` publishes to **both GitHub and jez237.com**.
     Stage all changed game files, commit, and push. Suggested message:

     ```
     Steel Duel: Campaign — single-player & co-op PvE campaign

     Adds a level-based campaign on top of the faithful Versus duel:
     N levels with waves, 5+ enemy tank types, multi-phase bosses, new
     larger/thinner-walled arenas, lives/health + co-op scaling, campaign
     HUD and flow. Versus faithfulness gates (F1-F8) preserved; new
     campaign self-tests (T-C1..T-C6) green. Built via autonomous
     iterate-and-test loop.

     Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
     ```
   - **Only if you changed `worker/`** for co-op: deploy it with `wrangler deploy` from `worker/`
     (it targets `steel-duel-online`). If wrangler auth isn't available in the environment, **do not
     block** — note the exact deploy command in `BUILD_LOG.md` and ship the client (which must still
     work offline/solo).
   - After pushing, **verify the deploy**: fetch `https://jez237.com/games/2026-06-14/steel-duel/`
     (and `?test=1&headless=1`) and confirm 200 + assets load + tests pass on the live URL. Note the
     result in `BUILD_LOG.md`. (GitHub Pages may take a minute to publish.)
   - If commit/push is blocked, stage everything and write the exact commands into `BUILD_LOG.md`.

---

### Quick reference
- **Folder:** `games/2026-06-14/steel-duel/` · **Title:** Steel Duel (campaign mode) · **Scores ns:** `steel-duel`
- **New mode:** `campaign` (1P + co-op, local & online) · **Versus modes:** `cpu|duel|coop|watch` (unchanged feel)
- **Test URLs:** `?test=1&headless=1` (suite incl. T-C*) · `?bots=1` (soak) ·
  `?shot=campaign|boss|coop|title|duel|explosion|minefield|mobile|classic` (deterministic captures)
- **Ship:** commit+push `jez237-site main` ⇒ GitHub + jez237.com; deploy `worker/` only if changed.
- **North star:** _Versus still plays like 1974. Campaign is a modern arcade tank-shooter you beat with a friend._
</content>
</invoke>
