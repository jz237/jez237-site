# Starling 2026

An original formation shooter for the GameMaster Arcade. Flocks of machine-birds murmurate over a
lighthouse at dusk, settle into formation and stoop on you. You can call the lighthouse beam down onto
your column: anything caught in it is dazzled. Endless waves; plays upright on a phone or wide on a desktop.

No build step: plain ES modules and a vendored three.js.

| File | What it holds |
| ---- | ------------- |
| `js/sim.js` | Deterministic fixed-step rules (60 Hz) and the autopilot. No rendering, audio or DOM |
| `js/render.js` | three.js scene: painted sky blended into the sky shader, the sea, the lighthouse and its rock, the flock (one instanced mesh per kind, shader-flapped wings), the Roost, the ship, debris, smoke and sprites |
| `img/` | Four painted far backdrops, one per time of day (`dusk`, `night`, `dawn`, and `roost` for the storm; about 150 KB together), generated with fal |
| `js/post.js` | HDR bloom chain, shared with Understorm 2026 |
| `js/audio.js` | Recorded music and effects (ElevenLabs), with a synthesised pad, pulse and effects as the fallback |
| `audio/`, `music/` | 15 effect clips (the shot and the small explosion in three takes each), a sea ambience loop and two music tracks generated with ElevenLabs |
| `js/scores.js`, `js/main.js` | Score board (`starling-2026`), game shell, menus and input |

## Waves

Every wave arrives in ribbons, flocks with boids steering, then takes formation. Wave 3, 8, 13... is a
passing flight that does not shoot. Wave 5, 10, 15... is the Roost.

## Graphics

- **Time of day.** The look moves on as the waves go by: dusk (waves 1-2), night (3-4), the storm that comes with
  the Roost (5), dawn (6-7), then round again, so the wave after every Roost is a sunrise. Each look is one row of
  `TOD` in `js/render.js` (sky, sea, foam, cloud, haze and light colours, star and moon strength, the sun) and one
  painting in `img/`; `sky()` eases the colours and cross-fades the paintings. Each painting's bottom edge sits on
  the game's own sea line. If an image fails to load, that sky stays procedural. Regenerate with
  `python scripts/starling/gen_images.py gen` then `build` (FLUX 1.1 pro ultra through
  `scripts/understorm/fal_image.py`, key from `FAL_KEY`); bump `IMG` in `js/render.js` when the files change.
- **Weather and sky events.** Roost waves bring rain (two layers of streaks in the front cloud layer, so it goes
  when the game has had to lower its resolution) and lightning: a stroke in the sky shader that lights the cloud
  round it, the sea, the birds and the models. LESS FLASH cuts the stroke to under half and the screen flash to a
  quarter. Clear dark skies get shooting stars, and from wave 10 the night and dusk skies carry an aurora.
- **Sea.** One piece of shader code (`SEA`) draws the water behind everything and again over the foot of the rock.
  It mirrors the painted sky, the moon or the rising sun, the lamp, the sweeping beam and up to four blasts. A
  rolling swell with foam runs in towards the rock (taller in the storm), spray breaks on the rock, the flock's
  shadow crosses the water under it, and a ring of foam spreads from where the Roost goes in.
- **Birds.** `birdGeo()` folds each kind from triangles (body, head, beak, eyes, layered wing, fingered primaries,
  tail; `SHAPE` holds the proportions). Facets are shaded from the screen-space normal, and shots, embers, blasts
  and both beams light the birds near them. Hit boxes are unchanged.
- **The Roost** flaps three-jointed wings, spins its fans and iris, and comes apart in five stages: sparks from the
  seams and a loose plate below 85% health, plates off below two thirds (glowing ribs underneath), a wing tip gone
  and two fires below one third, four fires, a stalled fan and limp talons below 15%. When it dies the wreck
  tumbles out of the sky burning, steered clear of the rock, and goes into the sea with a column of spray.
- **Lighthouse life.** The lens turns and flares as each panel swings past, moths circle the lamp, the keeper's
  windows flicker and his chimney smokes (leaning in the storm), and a small boat rides the swell off the jetty.
- **Feathers.** Every bird killed leaves feathers that sway down and fade; stooping birds shed them as they dive.
- **Debris** is an instanced mesh of lit shards that tumble, fall and splash; smoke is a second, non-additive
  sprite batch. A thin cloud layer drifts in front of the flock unless the game has had to lower its resolution.

## Audio

Generated with ElevenLabs by `scripts/understorm/gen_audio.py starling` and processed by
`scripts/understorm/process_audio.py starling games/2026-11-21/starling` (one script serves both games).
Bump `AV` in `js/audio.js` when the audio files change.

The effects were redone once with `scripts/understorm/regen_sfx.py starling` (several takes of each weak sound, picked by
measurement). OPTIONS has a sound test button that plays each effect in turn and names it.

On a wide screen the ship may travel past the edges of the 18-unit formation area, out to the edge of the view
(`Sim.xr`, set from the camera on resize), and the murmuration swings wider to match.

## Testing

```
node scripts/starling/simtest.mjs               # autopilot, hits counted but not fatal
node scripts/starling/simtest.mjs --real --waves=30
```

URL switches: `?wave=7` starts there, `?bot` lets the autopilot fly, `?god` makes hits harmless.
Any of those, or `?noscores`, stops scores being posted.

The autopilot dodges far better than a person, so it is not a guide to difficulty.

## Releasing

Every import carries a version query (`?v=130`). Bump it everywhere when you ship:

```
sed -i -E "s#from '\./([a-z]+)\.js(\?v=[0-9]+)?'#from './\1.js?v=131'#g" js/*.js
sed -i -E 's#src="js/main\.js(\?v=[0-9]+)?"#src="js/main.js?v=131"#' index.html
```
