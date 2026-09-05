# SKYNET 3D Demo

An unfinished, live Three.js interpretation of the Cyberdyne Systems / Skynet concept image. The sculpture uses solid extruded lettering and crest plates, animated mechanical rings, a neural globe, red core lights, particles, and an illuminated platform. The reference PNG is displayed only by the Reference control; it is not used as a substitute for the 3D model.

Live demo: https://jez237.com/games/demos/skynet-3d/

Listed in the **Unfinished** section of https://jez237.com/games/.

## Controls

Drag to orbit within the front hemisphere; scroll or pinch to zoom. Arrow keys orbit when the scene is focused. Home, double-click, or Reset view returns to the front. The toolbar also provides automatic orbit (left 45°, up 45°, right 90°, down 45°, then left 90° and repeat), animation pause, adjustable glow (default 0), original-image comparison, and fullscreen.

## Development

Run `npm ci`, then `npm run build` to rebuild `skynet-live.js` from `src.js`. The checked-in bundle includes Three.js, font data, and postprocessing. Opening `index.html` requires no installation or external CDN. Three.js license is included in `THREE-LICENSE.txt` and in the bundle.

This is a modeled visual demo, not a playable game. Fine details and reflections differ from the generated reference image.

### September 5 visual update

Version `2026.09.05.2` brings a lower, reference-inspired camera angle, dark studio-reflected chrome, finer engraved armor, more detailed core machinery, chamber ribs, and independently blinking red/ice-blue points on the neural globe, mechanical rings, crest, and platform. Light banks are batched for efficient rendering. All blinking follows the animation pause control and starts paused when reduced motion is requested.

### Cinematic update

Version `2026.09.05.3` adds a 7.5-second close-up-to-wide reveal and Replay intro control, followed by a gentle orbit. Dragging, zooming, keyboard navigation or Reset view interrupts the reveal immediately. Animation pause freezes the reveal, orbit, highlights, mist, blinking lights, and 161 traveling neural signal paths. Reduced-motion visitors start at the full front view with motion disabled.

The scene now includes soft shadow mapping for major solid bodies, deeper letter bodies, recessed mounting hardware and cooling vents, swept chrome highlights, five procedural ground-mist layers, three overhead shafts, and subtle red floor reflections. Neural links are batched into a few draw calls. `cinematic.js` contains the new effects; the normal build bundles it into the offline-capable script.

### Typography and reactor refinement

Version `2026.09.05.5` replaces the subtitle font with custom chamfered, extruded letterforms and rebuilds the main reactor with a recessed red lens, nine layered iris blades, a stepped annular housing, engraved surfaces, and mounting hardware. The previously removed silver strip remains absent. Background scaffolding is dimmer and procedural smoke breaks into curling patches around the platform.

The intro and replay now stage the ignition: core, rings/platform, neural network/crest, then wordmark. Manual camera input or Reset view skips to full power. Pausing also pauses the sequence, and reduced-motion mode starts fully powered without animation. `refinements.js` holds the custom alphabet and staged lighting behavior.

### Showcase and finishing pass

Version `2026.09.05.6` includes the locally approved flat K/Y bevels, darker brushed-gunmetal word backing, textured satin-metal panel sides, and corrected backing corner beside the T. The backing has five subtle assembly seams and nine recessed fasteners. Nine iris blades slide open during ignition, and five panel outlines carry intermittent sparks synchronized to the neural signal clock. All effects respect animation pause and reduced motion.

Showcase hides the interface and requests fullscreen when available. Escape exits; moving the pointer or tapping the scene reveals an Exit showcase button. The button is also keyboard accessible. Exiting preserves fullscreen if it was already active before Showcase, and embedded viewers without fullscreen support still get an interface-free presentation. `showcase.js` implements these additions; `panel-metal.js` generates the metal texture maps locally.

### Front-facing orbit and upper core

Version `2026.09.05.7` adds a raised rotating scanner and counter-rotating inner segments to the small upper core, synchronized with pause and reduced motion. Glow now starts at 0 but remains adjustable. Auto-orbit reverses at either 90-degree side profile, and manual controls share those front-facing limits. CYBERDYNE SYSTEMS is lowered slightly to center it vertically within its backing panel.

### Choreographed viewing loop

Version `2026.09.05.8` replaces the side-to-side auto-orbit with an eased viewing path. From the front it moves left 45°, up 45°, right 90°, down 45°, then left 90° and repeats. Each 45° leg takes five seconds and each 90° sweep ten seconds. Zoom distance is preserved. Pause freezes the current leg; dragging takes priority, then the path smoothly rejoins the left-hand starting point. Reduced-motion visitors still start with animation disabled.
