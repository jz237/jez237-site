# Understorm 2026

An original side-scrolling shooter for the GameMaster Arcade. Twelve stages in three acts, ten bosses,
a charging Lance and a tethered Anchor drone. No build step: plain ES modules and a vendored three.js.

## Layout

| File | What it holds |
| ---- | ------------- |
| `js/config.js` | Playfield size, speeds, difficulty ranks, version |
| `js/sim.js` | Deterministic fixed-step simulation (60 Hz). No rendering, audio or DOM |
| `js/foes.js` | Enemy behaviours and the ten bosses |
| `js/stages.js` | The twelve stages as data, written through a small builder |
| `js/bot.js` | Autopilot used by the attract-mode demo and the headless tests |
| `js/render.js`, `js/post.js`, `js/models.js` | three.js scene, HDR post chain with light shafts, models built from primitives |
| `js/gfx.js` | Generated normal-mapped surfaces, the reflection environment, scenery props, near silhouettes |
| `js/audio.js` | Synthesised adaptive score and effects (WebAudio, no samples) |
| `js/input.js`, `js/scores.js`, `js/main.js` | Input, score boards, game shell and menus |

Stages are authored in time order with a cursor: `b.go(seconds, floor, ceiling)` lays terrain and advances,
`b.wave(...)`, `b.turret(...)`, `b.cp()` and `b.boss(name)` place things at the cursor.

## Testing

```
node scripts/understorm/simtest.mjs            # every stage, autopilot, hits counted but not fatal
node scripts/understorm/simtest.mjs --real     # no cheats, base loadout: deaths per checkpoint
node scripts/understorm/simtest.mjs 7 --real --diff=hard
node scripts/understorm/deaths.mjs 4 2         # where the autopilot dies from stage 4, checkpoint 2
```

URL switches for the browser: `?stage=5&cp=1` starts a practice run there, `?bot` lets the autopilot fly,
`?god` makes hits harmless, `?q=low|med|high` forces a picture tier, `?all` unlocks stage select.
Any of `?stage`, `?bot`, `?god`, `?noscores` stops scores being posted. In the console, `__us.skip(30)`
advances a practice run thirty seconds.

## AI playthrough

WATCH THE AI FLY IT on the title screen runs the autopilot through all twelve stages with no cheats and
unlimited ships. The bar at the bottom shows what it is doing; `V` toggles its vision overlay (target,
tracked bullets, intended move), `F` cycles speed, `N` skips to the next stage and `Enter` hands you the
stick mid-flight. AI runs never post scores or unlock stages.

## Releasing

The site caches scripts in the browser for hours, so every import carries a version query (`?v=111`).
Bump it everywhere in one go when you ship, or returning players get a mix of old and new files:

```
sed -i -E "s#from '\./([a-z]+)\.js(\?v=[0-9]+)?'#from './\1.js?v=112'#g" js/*.js
sed -i -E 's#src="js/main\.js(\?v=[0-9]+)?"#src="js/main.js?v=112"#' index.html
```

## Score boards

`understorm-2026-easy`, `understorm-2026-normal` and `understorm-2026-hard` on the shared scores worker.
Practice, Sightseer and autopilot runs never post.

## What has and has not been checked

Checked: all twelve stages clear on the autopilot with no cheats on all three ranks; menus, pause, stage
select, ending, loop two, game over and the best-run ghost in a desktop browser; layout at phone size.

Not checked on real hardware: phones, a physical gamepad, and how the score sounds. The autopilot does not
tell you how hard it is for a person.
