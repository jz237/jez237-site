# Hidden Reef Stillwater — named koi and customer care

Live location: https://jez237.com/demos/hidden-reef-koi/

This revision adapts **Koi Pond Garden by Sourany Phomhome**, released under the MIT license at https://github.com/souranyp-stack/koi-pond-garden. Its rendering foundation replaces the earlier simplified Stillwater renderer. The required copyright and MIT permission notice are preserved in `public/LICENSES.txt`, together with the Three.js and dat.GUI licenses. This is an adapted work, not a claim of independent authorship of the upstream engine. The tutorial is https://www.youtube.com/watch?v=uSCUkGlHY30.

## Run and build

Node 24 or later. No package installation is required; Three.js r160 and dat.GUI are vendored under their original licenses.

```sh
npm test
npm run build:sites
python -m http.server 8797 --bind 127.0.0.1 --directory dist
```

`dist` is a static, self-hosted page. It makes no calls to AI services, analytics or remote asset hosts. The renderer synthesizes its textures and meshes at startup, so first load includes texture generation and shader compilation. Automatic quality adjustment trades resolution before effects on slower devices.

## Current experience

- Opens with the animated pond tour playing automatically. Garden remains available as a stationary camera view; fish, water and foliage remain alive in both modes.
- A labeled Pause pond / Resume pond control and a persistent paused notice make motion easy to restore. Feeding resumes a paused pond. Holding the O shortcut does not repeatedly toggle the state.
- The tour stays with the pond: thirteen compositions include one turtle portrait and one frog portrait, while the pond and koi views cover overhead, water-level, opposite-bank and underwater angles. Smooth close-ups follow different koi on successive shots and loops; camera positions stay clear of the submerged banks and gravel floor. Land plants have no dedicated tour shots. The advanced Stay above water setting and winter ice skip submerged shots.
- Wheel and trackpad scrolling over the scene zoom in/out in all camera modes.
- Every one of the twenty fish has a unique name, with its variety retained in the guide and follow-camera label.
- Feeding drops food directly onto visible water without a hand, arm or forced camera move.
- Sixteen searchable, sourced care topics cover pond planning, buying, quarantine, KHV, water tests, nitrogen cycling, oxygen, alkalinity, source water, diet, seasons, health and variety identification.
- The top-left preview badge is removed.
- The Water Lab includes oxygen/TAN/nitrite/nitrate/alkalinity trends, a recorded-sample inspector, interactive pH and temperature response curves, a 24-hour aeration or biofilter comparison, dilution diagrams, a sample log, and sourced explanations of nitrogen units, hardness and buffering.

## Rendering and behavior

- Preserved the tutorial's integrated HDR render pipeline: depth-aware reflection and refraction, absorption, Fresnel, ripple simulation, underwater caustics and koi shadows, foliage transmission, sky lighting, ambient occlusion, bloom and depth of field.
- Widened the southern open basin and shoreline while keeping the bridge and northern approach intact. The new starting composition favors the pond and garden together.
- Added Hidden Reef branding, garden / water / underwater view buttons, a fish guide matching all 20 displayed individuals, and a separate interactive water-chemistry lesson.
- Pinned the koi's head during the traveling body wave; grew lateral flex toward the tail; preserved separately animated paired fins, tail membranes, breathing and eyes.
- Reduced maximum turning rate and acceleration, feeding rush speed, pitch and roll. Fish vary depth continuously and choose new preferred depths, alternate bursts with glides and inspection pauses, retain loose social spacing, and track local hunger, energy and a fading feeding-location memory.
- Corrected freeze behavior and final floor/surface bounds after crowding. Muted audio by default, kept technical settings out of the opening view, and made the pond tour the default opening camera. The Garden button holds a stationary overview. Pond motion now starts on every device, including when reduced motion is enabled; interface transitions still honor reduced motion.

The chemistry model uses mg/L as nitrogen, with explicit nitrogen mass balance and user-supplied pH. Its readings are illustrative, separate from the visual scene, and are not a stocking or treatment prescription. Care sources and model limits are available in the guide. History retains the last 97 hourly or control-change records. Comparison experiments clone the current sample and never advance or overwrite the visitor's experiment; pH remains a selected input rather than a solved buffer equilibrium.

## Validation

Node tests exercise the actual scene's simulation function against its actual basin geometry for 150 simulated seconds, plus a feeding run and freeze check. They verify finite positions, basin/floor/surface bounds, upright attitude, variable speed, continuous depth exploration and independent phases. The shared body curve is checked for a steady head, traveling phase, growing tail amplitude and a matching analytical slope. Chemistry and chart tests cover speciation, nitrogen conservation, independent aeration/filter comparisons, real-time graph coordinates, immutable history, dilution, response curves, accessible empty/single-point charts and nonnegative long-run state.

Interaction tests also exercise automatic tour startup, stationary Garden views, wildlife tracking, bounded/reversible zoom, hand-free feeding and food cleanup. Browser checks cover initial rendering, garden and underwater cameras, variety selection/following, chemistry controls, weather, feeding, pause and phone layout. The browser preview may throttle background WebGL tabs; FPS from a background tab is not a device benchmark.

## Publishing

The user accepted the pond for Hidden Reef. Publish synchronized updates to GitHub, jez237 and the Hidden Reef site. The repository's root `AGENTS.md` deployment wrapper must be used to preserve all public assets and Pages Functions. Do not use a standalone static upload for jez237-site.

Previous Blender-authored models and their generator remain archived in the repository's `model-source` directory; the v3 runtime uses the upstream procedural koi with revised kinematics.

The storefronts host the pond at `learn/koi-pond/` and link to their own `learn/filtoclear/` exhibit. `build:sites` synchronizes both demo routes and both storefronts; keep the pond shopping links on the current host.
