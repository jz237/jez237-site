# Mechanical Flower: Exploded View

An animated, interactive exploded view of a jeweled-enamel clockwork flower, rendered live in the browser with Three.js (WebGL). No image assets: every petal, gear, braid, gem, enamel texture and the parchment sheet are generated in code.

The exploded state matches the "Mechanical Flower: Exploded View" infographic (ten callouts, core/gear/enamel insets, bloom sequence, 240 mm by 150 mm dimensions, floating gold screws). The assembled state matches the photo of the finished flower on a dark charcoal studio backdrop; the page crossfades between the two as the parts come together.

## Use it

- It plays on its own, on a 28 second cycle: hold exploded, close the bloom, assemble, hold, bloom, hold, explode.
- Drag to orbit, scroll or pinch to zoom, double-click to reset the view.
- The dock has Play/Pause, Explode and Bloom sliders (scrub either by hand), and a Poster/Studio switch.

## How it was made

An iterating loop rendered fixed states, compared them to the references, fixed the biggest gap, and was gated by an independent reviewer. The second run ended in success (mean 3.83 against a 3.8 gate). A third and fourth run set a much harder bar, a mean above 4.5 judged against the full photo, and did not reach it: the published build scores 3.28 out of 5 under that stricter reviewer. The fourth run added multicolour metals, flashing glints and drifting motes, removed an unattached gear, and rebuilt the closed bud; petal shape, enamel detail and mechanical density are the biggest remaining gaps. It is a close match in layout and palette, not an exact one. The loop prompt, rubric, stop rules, pass log and the gaps that remain are in [LOOP.md](LOOP.md).

## Layout

- `index.html`, `styles.css`: poster page, callouts, insets, dock.
- `src/`: parts (`petals.js`, `gears.js`, `stem.js`, `leaves.js`, `mech.js`, `screws.js`), assembly rig (`assembly.js`, `explode.js`, `layout.js`), materials, backdrop, UI, main loop.
- `vendor/three/`: vendored Three.js r185.
- `tools/`: `shoot.mjs` (headless GPU capture), `score.py` (proxy metrics), `cachebust.mjs` (stamps module hashes before publishing).

Capture API for tests: `window.__flower.renderAt({explode, bloom, time, theme, view})`.
