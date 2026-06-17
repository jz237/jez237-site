# Steel Duel: Campaign — design plan

Autonomous build plan for the PvE campaign expansion (see `CAMPAIGN_BUILD_PROMPT.md`).
This file is the living contract; refine as the build learns. All choices below are made
autonomously and may be retuned — log changes in `BUILD_LOG.md`.

## Vision
Add a **`campaign` mode** (1P + co-op 2–4, local & online) on top of the untouched Versus duel.
A 12-level PvE run: clear waves of varied enemy tanks across distinct arenas, beat 3 bosses,
reach victory. Versus (`cpu|duel|watch` + online duel) keeps its faithful 1974 feel; campaign-only
systems (tank HP, lives, waves, bosses) never touch Versus.

## Survivability model (campaign only)
- **Player tank HP:** 3. A shell does 1 dmg (Brute shells 2). **Mines = instant kill** (faithful danger).
- **Lives:** solo 3; co-op shared pool = `2 + players`. Losing all HP or hitting a mine costs a life;
  respawn at a safe spawn after a short freeze. **Game over** when lives hit 0 (all players down in co-op).
- **Co-op revive:** a downed player respawns at the start of the next wave if any teammate is alive,
  or by spending a shared life immediately. Friendly fire **off**.
- HP refills between levels. Lives carry across levels; small +1 life on boss clear.

## Enemy tank types (6 — each distinct visual + behavior)
| Type | HP | Speed | Fire | Behavior |
|------|----|-------|------|----------|
| **Grunt** | 1 | 1.0× | normal | baseline A* seek/aim (existing AI) |
| **Scout** | 1 | 1.7× | fast/weak | erratic flanking swarm, low accuracy |
| **Brute** | 4 | 0.6× | slow, 2 dmg | pushes forward, tanky, heavy shell |
| **Sniper** | 2 | 0.9× | slow, leads | keeps max range, high accuracy, retreats when approached |
| **Layer** | 2 | 1.0× | rare | drops mines on a timer, avoids direct duels |
| **Warden** | 3 | 0.8× | normal | **front armor**: shells hitting its front arc deflect (no dmg) → must be flanked |

All reuse the A* driver + skill model; differentiated by stats + behavior knobs (no parallel AI).
Enemy tank HP is campaign-only; Versus stays one-shot.

## Bosses (3 — multi-phase, beatable solo, scale in co-op)
1. **L4 — The Bastion** (stationary fortress, center): 3 turret weak-points + armored core. Phase 1:
   2 turrets fire spread. Phase 2 (turrets down): core exposed, enraged faster fire + spawns 2 grunts.
2. **L8 — Mauler** (giant fast tank): charges in straight lines (telegraphed), weak point = **rear**.
   Phase 2 at ≤50% HP: adds a radial mine-spray and summons 2 scouts.
3. **L12 — Iron Warlord** (finale): 3 phases — (a) salvo barrage from 4 barrels; (b) summons a scout
   pack while shielded; (c) core exposed between salvos. Defeat → **victory** screen.

Boss HP scales ×(1 + 0.5×(players−1)) in co-op.

## Levels (12; bosses at 4/8/12)
1. **Boot Camp** — small arena · 4 Grunts, 1 wave (teaches drive/aim/fire)
2. **Skirmish** — medium · Grunts + Scouts, 2 waves
3. **Heavy Metal** — medium · introduce Brute · 2 waves
4. **BOSS: The Bastion** — fortress arena
5. **Sharpshooters** — open thin-wall arena · Snipers + Grunts · 2 waves
6. **Mined** — mine-heavy · Layers + Scouts · 2 waves
7. **Wardens** — corridors · Wardens + Brutes (flank practice) · 2 waves
8. **BOSS: Mauler** — large open charging arena
9. **Onslaught** — **large thin-wall** arena · all types mixed · 3 waves
10. **Gauntlet** — escalating waves · mixed · 3 waves
11. **Last Stand** — elite mix (Brutes+Snipers+Wardens) · 3 waves
12. **BOSS: Iron Warlord** — finale arena → victory

## Arenas (≥6 distinct; some larger + thinner-walled — explicitly allowed)
Data-driven layouts. Campaign may use a **larger logical field** than the duel and **thinner walls**
with more open maneuver room. Variety: tight maze (Boot Camp), open field (Sharpshooters/Onslaught),
corridors (Wardens), central-fortress (Bastion), arena ring (bosses). Walls stay **solid/non-clipping**
(T-C4 soak at the new thickness). Border indestructible.

## Difficulty
Reuse the skill slider as **Recruit / Veteran / Lethal**: scales enemy aim, fire cadence, +0/+1/+2
partial HP on tanky types, and wave sizes. Early levels teachable; late levels demanding. Bosses
beatable solo on Recruit/Veteran.

## Progression / leaderboard
- Campaign score = Σ(enemy value by type) + per-level clear bonus + boss bonus, × difficulty mult.
- Encode **level-reached** into the submitted score so deeper runs rank higher; bucket campaign on
  namespace **`steel-duel-campaign`** (worker drops `extra`, so use the namespace per repo convention).
- Fully playable + scorable offline (degrades like the rest of the game).

## Code layout (extend, keep readable)
- `levels.js` — `LEVELS` table (arena ref + wave plan + clear cond), `ARENAS` layouts, enemy-type stats.
- `campaign.js` — campaign state machine: waves, spawns, progression, lives/revive, boss orchestration.
- `enemies.js` (or a section) — per-type behavior knobs layered on the existing A* tank.
- `bosses.js` — boss entities/phases (or a clearly-marked section of campaign.js).
- Extend `art.js` (enemy/boss visuals, damage states, telegraphs), `audio.js` (boss/enemy SFX),
  `game.js` (mode wiring, campaign HUD, `__g` campaign hooks), `index.html` (campaign menu/overlays).
- Keep determinism: all new RNG via the seeded PRNG; no `Math.random`/`Date.now`/rAF-delta in sim.

## Test plan (added to runTests; all green to ship)
T-C1 progression · T-C2 enemy types · T-C3 boss · T-C4 new-arena walls · T-C5 co-op scaling ·
T-C6 determinism · T-soak+ (bot campaign run) · T-perf+ (heaviest frame ≤8ms). Keep F1–F8, T-WALL,
T-AI green. New `?shot=` scenes: `campaign`, `boss`, `coop`.

## Build order (maps to §8 of the prompt)
1. Campaign scaffold: `campaign` mode/state, `LEVELS`/`ARENAS` data, one arena, wave→clear→advance,
   lives/game-over, `__g` hooks + T-C1/T-C6/T-C4 + `?shot=campaign`.
2. Enemy types + tank-HP + T-C2.
3. Multi-level progression + difficulty.
4. Bosses + T-C3 + `?shot=boss`.
5. Co-op scaling + lives/revive + T-C5 + `?shot=coop`.
6. Onboarding/HUD/flow + menu wiring.
7. Visual + audio polish.
8. Balance pass.
9. Integration: leaderboard (`steel-duel-campaign`), index card, cleanup → ship (push jez237-site main).
</content>
