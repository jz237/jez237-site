# Rimstorm 2026 tools

Game: `games/2026-11-06/rimstorm/` (three.js r181 vendored in `vendor/`, plain ES modules, no build step).
Every local import carries the same `?v=N`; bump them all together (plus `js/main.js?v=` in index.html and `V` in js/audio.js). Now `?v=10`, version 1.5.0. Since 1.5 (load + smoothness): index.html modulepreloads every module (keep its list in step with new modules); the warm-up is async (`await R.warmUp()`: compileAsync with KHR_parallel_shader_compile, the first look's lighting map via `envForAsync`, only the first look's scenery); the other looks' scenery + lighting maps are built in idle time on the title (`buildEnvsIdle`, `ensureBack(i, true)` compiles in the background and keeps a look's scenery hidden until ready; `R.prepared` is true when done, ~1.4 s; perf_check waits for it); banner / boss-bar pulses restart their animations without a forced layout (`restartAnim`), the tip's box is read once per tip. Measured (scratchpad loadprobe / framepace / bootprof): warm-up main thread 575 -> ~195 ms, play at 4x CPU: 1 frame over 34 ms (the run start, 50 ms). Since 1.4: frames are drawn between sim steps (main.js `snapPrev` before every step incl. scenic and Replay `preStep`, `lerpIn`/`lerpOut` around `drawFrame`: pos / lane / d / drag of players, enemies, shots, bolts, pods, droids, boss, and W.rot; lanes wrap on closed webs; at 144 Hz enemy motion unevenness 0.50 -> 0.07); the tip is a side card left of the web in landscape that dims over enemies / bolts / the boss (`dimTut`); a threat warning (`threatWarn`: rim riders closing in, climbers about to reach the rim by you, bolts in your lane -> side glow `#threatL/R`, marker `#threatmk`, `A.pulse` blip); the boss flinches on a damped spring (render `bossKick`, heads recoil on `headhit`, big kick on `phase`), wreckage falls away down the tube; 11 new SFX for the events that were silent (boltrim, bossspawn, droidend, droidfire, droidzap, eyeshut, headhit, headmove, podlost, sectorclear) and `wreck`.

| Script | What it does |
| --- | --- |
| `smoke.mjs [profile=demo] [difficulty]` | Sim smoke: the autopilot plays every sector (web 1 to the boss), every boss on its own, a chained campaign S1 to the S5 boss (lives and score carried over, retries like the AI PLAYTHROUGH) and ENDLESS DESCENT, checking world invariants (no NaN, lanes / depths in range, unique ids, clones exact). Exit 1 on any problem. |
| `determinism.mjs [seeds=6]` | Same seed twice = identical world (all sectors, both profiles, endless); a clone fed the same inputs stays identical; every death and boss kill replays bit for bit from its Recorder clip. |
| `ramp_check.mjs [trials=100] [sectors=1,2,3,4,5] [profile=human] [difficulty=normal] [--seed=N] [--set=...] [--causes] [--tol=8]` | THE difficulty measure. The human-like autopilot plays each sector from web 1 with 3 Rimrunners and `TYPICAL_UP`, one child process per sector (in parallel, 100 trials x 5 sectors in ~3 s). Prints the clear % against the target, then per web try (W1..W4, BOSS): deaths, hits (deaths + plates), enemies alive on average, riders at the rim, peak, threats (enemies + bolts + strikes), seconds; what killed it; the WARNING check (for every hit the time from the threat's first visible tell to the hit: lancer charge, boss tell, strike tell, a rider's crouch or its lane entry, a mite's crackle, a reflection; never shorter than that web's RAMP `warn`; hits where the Rimrunner moved into a lane that already held the threat count as "walked in"), and the BUSY floor (2.5 / 3.5 / 4.5 / 5 / 5.5 enemies alive on average per web on Normal). Exit 1 when a sector misses its target by more than `--tol` points, a warning was short or a web was thin. `--set="RAMP.4.flip=0.2,0.18;RAMP.*.grab=*0.9;AI.human.miss0=0.1"` experiments on the tables in the child processes only (`*` multiplies, `+` adds, `a,b` sets a pair, `*` in a path walks every key). Targets: Normal ~85/65/45/30/18 %, Hard ~70/45/25/12/5 %, Easy 95 %+ in sector 1 (near-certain after), Nightmare ~25/10/3/1/0. 100 trials swing about +-6 points; use 300 for a final word. |
| `page_check.mjs [baseUrl] [shotDir] [--quick] [--tests]` | Playwright + headless Edge: loads `?fixed&noscores`, checks console errors and shader-program counts, screenshots title / sector 1 / dive / all five bosses / S3 + S5 / phone portrait (`SHOT_TAG` env sets the file prefix), `--tests` also runs the `?test=1` page. Score POSTs are intercepted and must be 0. |
| `flow_check.mjs [baseUrl]` | Playwright: attract demo starts by itself, AI PLAYTHROUGH beats the S1 boss, shops and rolls into S2, a lost campaign lands on results with initials + checkpoint CONTINUE + instant replay, ENDLESS DESCENT runs. |
| `program_check.mjs [baseUrl] [maxMinutes=7]` | Playwright: the AI PLAYTHROUGH plays all five sectors (and their bosses, with the shop between) at 6x game speed while `renderer.info.programs` is sampled; the count must equal the warm-up count the whole way (anything compiled mid-game would hitch on a phone). Also fails on console errors or score POSTs. |
| `audio_check.mjs [baseUrl]` | Playwright: unlocks Web Audio, waits for every effect and voice line to decode, decodes every music track, plays through a spatial panner, the arc-mite loop and the voice gate; reports anything missing or any mp3 HTTP error. |
| `replay_check.mjs [seeds=10]` | Node: records runs exactly like the game loop (Recorder.tick, controls, Recorder.input, step) on every sector, boss webs, both autopilot profiles, all four difficulty levels and ENDLESS DESCENT; every death and boss kill is re-run from its clip with the game's Replay class and the WHOLE world (`worldSig`: every field, every double) must equal the live world at the key tick and at the end of the clip. |
| `autopilot_check.mjs [runs=12] [difficulty=normal]` | Node: chained campaigns the way the game chains them (score and Rimrunners carried, +1 Rimrunner per cleared sector, salvage `salvageFor` buys upgrades in the `AI_SHOP` order), for the demo and the human autopilot, as a player's run (3 Rimrunners, no retries: how far it gets) and as the AI PLAYTHROUGH (5 Rimrunners, retries a lost sector). Exit 1 if the demo PLAYTHROUGH ever fails to finish. |
| `console_check.mjs [baseUrl]` | Playwright + headless Edge: the `?test=1` page (every self-test must pass), the idle title rolling into the attract demo at 12 s, an `?autoplay` campaign, the AI PLAYTHROUGH from the S1 boss into S2, and the online pages (ONLINE screen, a `?room=RS-ABCD` join link on a phone; nothing connects). Fails on any console error or score POST. ~50 s. |
| `perf_check.mjs [baseUrl] [quality=high]` | Playwright: counts every WebGL `compileShader` / `linkProgram` from page start; after the boot warm-up the count must not move while S1-S5 webs, all five bosses (to their kills) and ENDLESS DESCENT are played; `renderer.info.programs` constant; the light count never changes; per-frame JS time (no frame over 50 ms after each scene's first second); draw calls and triangles per frame (all passes). ~1.5 min. |
| `medal_check.mjs [trials=16] [sectors]` | Node: how often UNBROKEN / DEAD EYE / QUICKSILVER fall to the human-like autopilot, the sharp demo autopilot and a "sniper" (demo autopilot that only fires at something in its lane), playing each sector from web 1. Par times (`PAR` in config.js) sit at about the demo autopilot's median; DEAD EYE (`AIM_MEDAL` 55 %) needs deliberate aim (sniper ~75-85 %, spraying ~25-45 %). Re-measure after ramp changes. |
| `systems_check.mjs [baseUrl] [shotDir]` | Playwright, ?fixed pages: the title world board fetches all 8 boards and each tab shows its own; game over asks for initials, the typed initials reach the local table and the body that would be posted (`Scores.last`, never sent: NO_POST); HARD endless goes to its own board; the death and the boss-kill instant replays are bit exact in the page (`G.replayExact`); the shop (costs, max, refusals, upgrades carried); a full sector stores best time + sector score + medals + reach and they survive a reload; every option persists under `rs.`; a fake gamepad navigates menus, steers, fires and rumbles; touch in portrait and landscape (drag steers + fires, PURGE button, buttons on screen and clear of the HUD, the phone vibrates); keyboard + mouse spinner + ESC pause; the attract demo (starts at 12 s, reaches a boss, shows its upgrades, every slow-mo framed on its cause, hands over); the AI PLAYTHROUGH (highlighted picks, no records, retries a lost sector). Screenshots `sys_*.png`. ~40 s. |
| `online_check.mjs [baseUrl] [relay] [seconds=45] [shotDir]` | Playwright, two pages on the LOCAL relay (refuses any other): host room + join by code, both flown by the autopilot, at 0 ms and at 80 ms each way on the guest (`?netlag=80`). Checks snapshot rate / size, guest input rate, guest shots killing on the host, both pages agreeing on web / phase / score / lives / enemies, the host's picture of the guest, a guest death judged on the host and shown + respawned on the guest, climbers gliding between snapshots on the guest, the sector clear landing both on results, the host's NEXT SECTOR taking both into sector 2 with the score, a partner leaving, the host landing on results (not the title) when the partner leaves mid-sector, and quick match pairing two pages in an `RS-Q-` room. Screenshots `net_*.png`. ~2.5 min. |
| `fix_check.mjs [baseUrl] [shotDir]` | Playwright, stage-6 regressions (~30 s): on the results screen P / Escape / pad START / Backspace never leave (P is a letter in the initials; Enter posts `KPX`), Escape on endless results stays, FINISH posts; Escape / P / Backspace / START / B never close the shop (NEXT SECTOR still goes on); a quick key tap (down + up between two frames) purges and steps one lane, a key pressed while paused does not fire on resume, a quick tap on the phone PURGE button purges; tutorial tips show once (`rs.tips.v1`; the same run again +0, HARD no enemy tips); the post pass has scene depth; the S5 lens frames (`fix_lens_s5w3_*.png`); a grabbing rider rides the Rimrunner down (`R.draggers`) and is gone on respawn; the attract demo hands over at 100 s without setting `W.over`; the phone-landscape title fits without scrolling with the board in its own card. The score worker is intercepted (fake board, POSTs answered locally); webdriver is hidden only on the score pages. Exit 1 on any failure or console error. |
| `endrun_check.mjs [baseUrl] [shotDir]` | Playwright (~1.5 min): the shop's END RUN. Keyboard: the arrow keys reach it, ENTER asks first with KEEP GOING picked, ESC / P / Backspace / pad START / pad B / a second ENTER all go back to the shop with the run, yes lands on the results (no CONTINUE, FINISH picked), ESC / P stay there (P is a letter), ENTER posts the initials once to `rimstorm-2026` with extra `S1B END`; a HARD run banks to `rimstorm-2026-hard`. Gamepad (stubbed `navigator.getGamepads`): d-pad, A, B, START the same way, A on FINISH posts. Touch in phone portrait and landscape: taps on END RUN, KEEP GOING, END RUN, FINISH (both answers on screen). `?noscores` and a WebDriver browser build the board body but send nothing; the AI PLAYTHROUGH shop has no END RUN. The score worker is intercepted (fake board, POSTs answered locally, nothing leaves the machine). Shots `endrun_*.png`. |
| `net_live_check.mjs [baseUrl] [playSeconds=25] [hiddenSeconds=12] [shotDir]` | Playwright, two pages on the LIVE relay (`wss://steel-duel-online.jez237.workers.dev/ws/RS-TEST-XXXXX`, a throwaway room): connection and pairing time, snapshot / input rates and sizes, RTT, host and guest agreeing; then the host's tab goes to the background (a real background tab when headless allows it, else visibilityState hidden + requestAnimationFrame stopped): the host's web must keep going on the worker tick, the guest must keep getting snapshots, never go stale and be told the host is away; the host comes back to its running web. Score POSTs intercepted and must be 0. |
| `phone_perf.mjs [baseUrl] [shotDir]` | Playwright: an S25 Ultra-class phone (412x915 portrait and 915x412 landscape, touch, Android UA, deviceScaleFactor 3, CDP CPU throttling 4x) on the tier the game picks (auto = medium). For S4 web 3, S5 web 3, S5 web 4 (black-hole lens) and the final boss: draw calls / triangles per frame (every pass), shader programs, JS ms per frame split into sim + HUD and render submit; checks no HUD / button / tip / caption covers the tube centre or the Rimrunner and the boss name does not wrap. Shots `phone_*.png`. |
| `gen_audio.py [music\|sfx\|voice\|all\|credits] [--only a,b] [--force]` | ElevenLabs generation (Python, `python -I`). The key comes from the Windows user env var `ELEVENLABS_API_KEY` via PowerShell and is never printed or written. At most 2 requests at a time, 429 backs off, stops below 15 % of the account's credits (`credits` just prints the balance). Raw clips go to `%TEMP%/rimstorm-audio-raw/<kind>/` (or `RS_RAW`). Prompts for the 48 effects, 9 music tracks and 12 voice lines (one voice, `Xb7hH8MSUJpSbSDYk0k2`) live in the file. |
| `process_audio.py <game folder> [names]` | Trims, normalises and encodes the raw clips into `audio/`, `music/`, `voice/` (`python -P -E`: numpy is in the user site-packages). Frequent effects get a 4-pole low-pass so nothing chirps; `crackle` gets a crossfaded loop; music is EBU -16 LUFS at 112 kb/s. Prints each clip's spectral centroid. |

Browser scripts need a static server on the repo root: `python -I D:/Projects/.tmp/arcade-trio-work/rimstorm/serve.py 8772`
(no-cache) and Playwright from `D:/Projects/.tmp/model-s-tools`. Only one headless Edge at a time across the
arcade-trio agents: `mkdir D:/Projects/.tmp/arcade-trio-edge.lock` before, `rmdir` after.

## Audio

`js/audio.js`: `FILE` maps every sound name the game uses to `audio/<name>.mp3` (48 effects) and `music:<name>` to `music/<name>.mp3`
(title, s1-s5, boss, clear and over stings); `VOICE` lists the 12 rare flight-control lines (`voice/v_<name>.mp3`). Effects are positioned
with PannerNodes (listener on the camera), the arc-mite crackle is a positioned loop, music loops with a 3 s crossfade and ducks under a
voice line. Voice lines only go through `say()` in main.js (key moments; colour lines wait 26 s and roll a chance; NARRATION ON/OFF option).
Regenerate: `python -I gen_audio.py all` then `python -P -E process_audio.py games/2026-11-06/rimstorm`, bump `?v=`.

## Page hooks

`?test=1` self-test page (results in `window.__rsTests`) · `?fixed` (no RAF; drive frames with `__rs.tick(n)`; `__rs.R.dbgCam = {pos, look, fov}` holds a debug camera for close-ups) · `?autoplay` (demo
autopilot plays the campaign; `&endless` for ENDLESS DESCENT) · `?sector=N` (0-4) · `?web=N` (0-3, 4 = boss) · `?seed=N` · `?demo` (attract demo
after 1 s) · `?playthrough` · `?noscores` · `?q=high|medium|low` · `?relay=ws://127.0.0.1:8782` (local relay) · `?netlag=ms` · `?room=CODE`.

`window.__rs`: `G` (game state), `R` (renderer), `A` (audio), `I` (input), `NET`, `REC`, `settings`, `VERSION`, `W` (current world, getter),
`tick(n, dt)`, `startCampaign(sector, web)`, `startEndless()`, `startDemo()`, `startPlaythrough()`, `toTitle()`, `playReplay()`, `pause()`,
`resume()`, `act(name)`, `buy(key)`, `online.hostStart/startOnline`, `noPost`, `boardOf(mode, diff)` (a `Scores` board), `Scores`
(`Scores.last` = the last `{board, body, sent}`), `worldSig(W)`, `medals`, `best`, `bestSc`, `CALM`, `quality`. After an instant replay
`G.replayExact` is true when the replayed world equalled the live world at the key tick. `NET.stat`: `snaps, inputs, shots, kills2,
deaths2, claims, bytes, maxBytes`. `R.draggers` (pid -> the rider view dragging a grabbed Rimrunner down), `R.post.depthOK` (scene
depth texture present: the S5 lens is masked by depth), `I.tap` (latched taps: a press and release between two sim steps still counts;
taps older than 250 ms are dropped, so a key pressed in a menu never fires in play), `I.handlers` (the 'key' handler returns true when it
used a key, and then no pause is sent for it).

`localStorage` (all `rs.`): `rs.settings.v1` (options), `rs.medals.v1`, `rs.best.v1` (best sector time per difficulty), `rs.bestsc.v1`
(best sector score), `rs.reach.v1` (sectors open), `rs.hs.<board>` (local top 10 per board), `rs.initials` (falls back to reading the
site-wide `jez237_initials`, never writes it), `rs.tips.v1` (tutorial tips already shown: each shows once per device; the 10 s control hint
shows once per visit at the start of sector 1, shorter on touch; in phone landscape every tip sits in the strip left of the web, clear of
the tube; HARD and NIGHTMARE show no enemy tips).

## Meta systems

- Shop END RUN (stage 7): asks first (END THE RUN? with KEEP GOING picked; ESC / P / START / B / Backspace on the question all mean
  KEEP GOING), then banks the run through the normal game-over flow: results (RUN ENDED, no CONTINUE, FINISH picked), initials, a POST to
  the run's own board (mode + difficulty), extra `S<n>B END`. Only in a player's campaign (hidden in the AI PLAYTHROUGH); NO_POST rules
  unchanged. The results screen now always starts on a VISIBLE button (CONTINUE after a fall, NEXT SECTOR for the co-op host, else
  FINISH): before, a hidden CONTINUE could take a pad's A press on a cleared run's results.
- Shop between sectors: salvage = sector score / 30 + 250 per medal earned (`SALVAGE_DIV`, `SALVAGE_MEDAL`, `salvageFor`, `AI_SHOP` in config.js), costs `UP_COST`
  500 / 1100 / 1900 per level; that buys about what `TYPICAL_UP` assumes. Sector select starts with `TYPICAL_UP` + 500 salvage per sector.
- Medals (15): UNBROKEN / DEAD EYE / QUICKSILVER per sector; only for a sector played from its first web without a continue, not on EASY.
  Best time and best sector score per sector and difficulty also only count from the first web.
- Instant replay: last death or boss kill (pause menu, results, shop). The Recorder keeps a world clone every 0.5 s (14 kept).
- Attract demo after 12 s idle on the title: the demo autopilot starts on a sector's last web with upgrades fitted (caption), meets the
  boss, slow motion only for its deaths, a purge that wipes 4+ climbers and boss kills, each framed on the cause; alternates sectors.
- AI PLAYTHROUGH: demo autopilot plays S1-S5, its shop picks glow (`.upg.pick`), retries a lost sector, no scores / medals / bests.

## Tuning (stage 4: measured with ramp_check.mjs)

Difficulty lives in one table: `RAMP` in `js/config.js` (per sector `[first web, last web]`, interpolated per web; ENDLESS DESCENT walks
the same curve via `endlessLevel()` / `rampLevel()`). Difficulty levels scale it in `applyDiff()` (`DIFFICULTY`; warnings never below
`MIN_WARN` 0.45 s; Easy also takes one hit point off every climber). Boss armour / attack rate: `bossHP` / `bossRate` in the RAMP rows;
attack lists in `BOSSES`.

| RAMP (Normal) | S1 Orbital Ring | S2 Abyss Trench | S3 Molten Core | S4 Crystal Moon | S5 Event Horizon |
| --- | --- | --- | --- | --- | --- |
| spd (climb speed) | 1.05 - 1.25 | 1.3 - 1.42 | 1.47 - 1.59 | 1.64 - 1.76 | 1.85 - 1.95 |
| count / active | 17-21 / 3-5 | 21-25 / 5-7 | 26-30 / 7-9 | 31-35 / 9-11 | 36-41 / 11-14 |
| warn (every tell) | 1.2 - 1.1 s | 1.04 - 0.96 | 0.92 - 0.84 | 0.81 - 0.72 | 0.7 - 0.6 |
| flip (rider rest) / grab | 0.46-0.38 / 0.235-0.215 | 0.35-0.32 / 0.19-0.185 | 0.21-0.2 / 0.15-0.14 | 0.2-0.19 / 0.14-0.135 | 0.19-0.17 / 0.115-0.105 |
| hpS / hpB (extra hits) | 1 / 0 | 1 / 1 | 1.3-1.45 / 1 | 1.45-1.75 / 1.5-2 | 2.0-2.55 / 2 |
| shock interval | 5.0 - 4.6 s | 4.3 - 3.9 | 3.2 - 2.9 | 2.9 - 2.6 | 2.6 - 2.3 |
| boss HP / rate | 150 / 0.7 | 210 / 0.9 | 340 / 1.2 | 150 / 0.35 | 480 / 1.22 |

Measured (human-like autopilot, `node scripts/rimstorm/ramp_check.mjs 300`): **Normal 85 / 66 / 46 / 30 / 19 %** (target 85/65/45/30/18;
100 trials at the default seed: 79 / 64 / 48 / 31 / 17; stage 7 moved only S5's `hpS` 2.0-2.6 -> 2.0-2.55, which took S5 from 15 % to
19 % and left S1-S4 identical), **Hard 72 / 45 / 26 / 9 / 3 %** (200 trials; target 70/45/25/12/5), **Easy 100 %**
in every sector, Nightmare 21 / 9 / 1 / 0 / 1 % (two Rimrunners, for experts). Deaths per web try on Normal (W1 W2 W3 W4 BOSS):
S1 .25 .19 .31 .31 .35 · S2 .26 .43 .49 .43 .35 · S3 .46 .45 .54 .59 .60 · S4 .50 .69 .67 .72 .62 · S5 .46 .72 .86 .99 .84 (each sector
opens a little gentler after the shop on its open web, then rises). Enemies alive on average: S1 2.9-3.9 (the medium start: 2-3 threats at
once), S2 3.9-4.8, S3 4.8-5.5, S4 5.5-6.3, S5 5.8-6.8 (peaks 6 to 14). Every hit had at least the RAMP warning time of telegraph.

What drives it (found by sweeping with `--set`):
- **One more hit per climber** (`hpS`) is the strongest lever by far; a fraction is a chance per climber (1.4 = 40 % take one more hit),
  so toughness ramps smoothly web by web instead of in cliffs.
- **Rider pounce**: a rider at the rim that flips into a Rimrunner's lane crouches for `warn - hop time` with that lane flaring red, then
  grabs as it lands (airborne riders cannot be shot). Walking into a sitting rider gives `grab` plus the time the gun needs for the hits it
  takes, so a player who fires at once always wins that one. `flip` (rest between rim hops) sets how often riders pounce.
- **Lane count / topology**: a 12-lane web is about half as deadly as a 16-lane one at the same values, and open webs about a third
  gentler than closed ones, so the fought webs all have 14-16 lanes (hexagon and cross are boss arenas) and each sector runs one open
  web then three closed ones.
- **Shield plates** refill on every web (max level 1): refills every other web or on a timer made a sawtooth death curve.
- `active` / `count` barely change the clear rate (more climbers mean more purges and pods); they keep the screen busy.
- Extra Rimrunner every 80,000 points (`SCORE.lifeEvery`), +1 per cleared sector in a campaign: the human-like autopilot finishes a whole
  campaign in one go about 1 run in 3 (`autopilot_check.mjs`); the demo autopilot nearly always.

The human-like autopilot (`ai.js` profile `human`): 0.35 s reaction (+-0.1, 15 % of the time 0.28 s later); a threat (bolt, strike, a rider's
crouch or landing, a mite's crackle) only counts once it has been on screen that long, then it re-plans at once; attention: the busier the
screen near it, the likelier a threat is noticed 0.5-1.3 s late (10 % + 3 % per threat in view; whole-lane strikes 0.4x as likely to be
missed); tracks 4 lanes either side and the near 72 % of the tube; keyboard-speed steering; holds the trigger 86 % of the time but always
fires at a rider it goes after; purges a little late, 60 % of the time. The `demo` profile (attract mode, AI PLAYTHROUGH) is sharp and sees
everything. Par times (`PAR` in config.js) = the demo autopilot's median sector time (181 / 193 / 184 / 206 / 179 s, `medal_check.mjs`).

## Stage 6 fixes (review)

- Results and shop keep the run: ESC / P / pad START / Backspace never leave the results (P is a letter in the initials) or the shop
  between sectors (the AI PLAYTHROUGH still stops on ESC). Leaving the results any other way still posts a qualifying score (`toTitle`).
- S5 black-hole lens: the post pass reads the scene depth (`DepthTexture` on the scene target, WebGL2) and only bends pixels more than
  160 units away, and only toward far pixels: the web, the Rimrunner and everything on the web are never warped.
- Tips once per device (`rs.tips.v1`), not once per world (every sector / run / CONTINUE builds a new world).
- Quick taps latched in `Input` (purge, hop, fire, one-lane step, touch PURGE / HOP).
- Partner leaving mid-sector: results screen (title YOUR PARTNER LEFT / CONNECTION LOST) instead of a jump to the title.
- Boss name / hint on a dark plate, lighter and larger; phone landscape title in two columns with the board in its own card, tips on the
  left side clear of the tube's middle.
- A grabbing rider stays on the Rimrunner during the drag (render only: the sim already removed it, so nothing changes in replays).
- The attract demo ends at 100 s from main.js without setting `W.over` (nothing outside `step()` touches the world).

## Round 2 UI (presentation only; sim.js / ai.js / sim config untouched, replays bit exact)
- Boss bar hides while the boss is `dying`; the plate is two lines (`.bn` name + phase, `.bh` hint), so it never wraps to an orphan word;
  the `phase` event no longer shows a caption (the plate carries the phase).
- Results: `#res-hero` is the score as the hero number with a comparison against this device's best on the same board (`runBoard(W)`).
- Pause: `body.rs-hold` (set every frame while `paused` / `paused-online`) dims the scene behind any open card and hides `#touch`.
- HUD `#medtrack`: UNBROKEN / AIM % / PAR delta while the sector can still earn medals (campaign, not Easy, from web 1, no continues).
  Chip classes: `ok`, `got` (already earned, gold), `lost` (struck: a death or past par, cannot come back), `low` (aim under the
  mark, can still recover). Phone landscape keeps the boss plate on one line (`.bh` inline). The pounce tip says AMBER in colour-safe.
- Options: TELEGRAPHS (`settings.tell` std | safe -> `R.tellSafe`: pounce / grab amber, harmless landing blue instead of red / green;
  strip colour is a uniform) and PAINT (`settings.suit`, `SUITS` in main.js: cobalt / jade / violet / gold / obsidian / arctic at
  0 / 3 / 6 / 9 / 12 / 15 medals -> `R.suit`; the player views are rebuilt, models are cached per colour, programs stay 51).
- DAILY CHALLENGE (title button): `dailyCfg(day)` = FNV of `rimstorm:YYYY-MM-DD` -> seed, sector = seed % 5, Hard, `TYPICAL_UP[sector]`;
  `G.mode = 'daily'`, board `rimstorm-2026-daily-YYYYMMDD` (`dailyBoard(day)`), results DAILY CLEARED / DAILY OVER, no medals, bests,
  checkpoint or shop. Hooks: `__rs.startDaily()`, `__rs.dailyCfg()`, `__rs.dailyBoard()`.

## Scores

Global boards on the site's game-scores worker: `rimstorm-2026[-easy|-hard|-nightmare]` and `rimstorm-2026-endless[-easy|-hard|-nightmare]`,
body `{initials, score, level, extra}` (extra e.g. `S3W2`, `S5B DONE`, `C1` for a continued run). No POST from `?test`, `?autoplay`,
`?fixed`, `?noscores`, `?demo`, `?playthrough` or a WebDriver browser.

## Online

Rooms `RS-XXXX` / `RS-Q-XXXXX` on the Steel Duel relay (`wss://steel-duel-online.jez237.workers.dev/ws/<ROOM>`; its lobby filter needs
the `RS-` prefix). Host = p1 runs the web and sends snapshots at 20 Hz (`type: 'snapshot'`); the guest steers locally and sends
`type: 'input'` (position, shots, PURGE / HOP claims). The start message is `{type: 'start', mode: 'coop', cfg}` (the relay rewrites
`start.mode`, `t`, `from`, `role`). Local test: copy `games/2026-06-14/steel-duel/worker` to the work folder and run
`D:/Projects/.tmp/descent2-site/node_modules/.bin/wrangler dev --local --port 8782`, then open two pages with `?relay=ws://127.0.0.1:8782`
(`online_check.mjs` does all of it). Between snapshots the guest's climbers, flips, bolts, pods and boss armour drift on (`guestDrift`
in sim.js, rates from the last two snapshots); the host carries the guest's last report on toward the lane it is gliding to by about
one trip (so deaths are judged where the guest really is). After a sector the host gets NEXT SECTOR (score and lives carried,
`TYPICAL_UP` for the next sector) or RETRY / PLAY AGAIN / DESCEND AGAIN; the guest follows. Co-op posts no scores. A guest whose host
stops sending sees WAITING FOR THE HOST (connection trouble). A tab in the background no longer stops the web (stage 7): while an
online tab is hidden a dedicated worker (`js/tick.js`, worker timers are not throttled like requestAnimationFrame) ticks 40 times a second
and main.js runs the same `playStep()` on it (no rendering, no sound, no popups; the hidden player's Rimrunner gets no input, it is
paused-online). The host keeps sending snapshots (now paced with the remainder kept, so 20 a second whatever the tick) with `aw: 1`, and
the guest shows THE HOST'S TAB IS IN THE BACKGROUND · THE WEB KEEPS GOING. The host comes back to its pause card (ONLINE · THE WEB KEEPS
GOING). `G.bgTicks` counts the worker ticks. Online play is never recorded and `step()` is untouched, so replays stay bit exact.
