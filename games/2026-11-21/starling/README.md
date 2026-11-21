# Starling 2026

An original formation shooter for the GameMaster Arcade. Flocks of machine-birds murmurate over a
lighthouse at dusk, settle into formation and stoop on you. You can call the lighthouse beam down onto
your column: anything caught in it is dazzled. Endless waves; plays upright on a phone or wide on a desktop.

No build step: plain ES modules and a vendored three.js.

| File | What it holds |
| ---- | ------------- |
| `js/sim.js` | Deterministic fixed-step rules (60 Hz) and the autopilot. No rendering, audio or DOM |
| `js/render.js` | three.js scene: sky shader, lighthouse, the flock as one instanced mesh with shader-flapped wings |
| `js/post.js` | HDR bloom chain, shared with Understorm 2026 |
| `js/audio.js` | Synthesised pad, pulse and effects (WebAudio, no samples) |
| `js/scores.js`, `js/main.js` | Score board (`starling-2026`), game shell, menus and input |

## Waves

Every wave arrives in ribbons, flocks with boids steering, then takes formation. Wave 3, 8, 13... is a
passing flight that does not shoot. Wave 5, 10, 15... is the Roost.

## Testing

```
node scripts/starling/simtest.mjs               # autopilot, hits counted but not fatal
node scripts/starling/simtest.mjs --real --waves=30
```

URL switches: `?wave=7` starts there, `?bot` lets the autopilot fly, `?god` makes hits harmless.
Any of those, or `?noscores`, stops scores being posted.

The autopilot dodges far better than a person, so it is not a guide to difficulty.

## Releasing

Every import carries a version query (`?v=101`). Bump it everywhere when you ship:

```
sed -i -E "s#from '\./([a-z]+)\.js(\?v=[0-9]+)?'#from './\1.js?v=101'#g" js/*.js
sed -i -E 's#src="js/main\.js(\?v=[0-9]+)?"#src="js/main.js?v=102"#' index.html
```
