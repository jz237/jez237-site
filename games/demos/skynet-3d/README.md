# SKYNET 3D Demo

An unfinished, live Three.js interpretation of the Cyberdyne Systems / Skynet concept image. The sculpture uses solid extruded lettering and crest plates, animated mechanical rings, a neural globe, red core lights, particles, and an illuminated platform. The reference PNG is displayed only by the Reference control; it is not used as a substitute for the 3D model.

Live demo: https://jez237.com/games/demos/skynet-3d/

Listed in the **Unfinished** section of https://jez237.com/games/.

## Controls

Drag to orbit; scroll or pinch to zoom. Arrow keys orbit when the scene is focused. Home, double-click, or Reset view returns to the front. The toolbar also provides automatic orbit, animation pause, adjustable glow, original-image comparison, and fullscreen.

## Development

Run `npm ci`, then `npm run build` to rebuild `skynet-live.js` from `src.js`. The checked-in bundle includes Three.js, font data, and postprocessing. Opening `index.html` requires no installation or external CDN. Three.js license is included in `THREE-LICENSE.txt` and in the bundle.

This is a modeled visual demo, not a playable game. Fine details and reflections differ from the generated reference image.
