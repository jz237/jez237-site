# Hidden Reef Stillwater — tutorial garden revision

Preview location: https://jez237.com/demos/hidden-reef-koi/

This revision adapts **Koi Pond Garden by Sourany Phomhome**, released under the MIT license at https://github.com/souranyp-stack/koi-pond-garden. Its rendering foundation replaces the earlier simplified Stillwater renderer. The required copyright and MIT permission notice are preserved in `public/LICENSES.txt`, together with the Three.js and dat.GUI licenses. This is an adapted work, not a claim of independent authorship of the upstream engine. The tutorial is https://www.youtube.com/watch?v=uSCUkGlHY30.

## Run and build

Node 24 or later. No package installation is required; Three.js r160 and dat.GUI are vendored under their original licenses.

```sh
npm test
npm run build
python -m http.server 8797 --bind 127.0.0.1 --directory dist
```

`dist` is a static, self-hosted page. It makes no calls to AI services, analytics or remote asset hosts. The renderer synthesizes its textures and meshes at startup, so first load includes texture generation and shader compilation. Automatic quality adjustment trades resolution before effects on slower devices.

## What changed

- Preserved the tutorial's integrated HDR render pipeline: depth-aware reflection and refraction, absorption, Fresnel, ripple simulation, underwater caustics and koi shadows, foliage transmission, sky lighting, ambient occlusion, bloom and depth of field.
- Widened the southern open basin and shoreline while keeping the bridge and northern approach intact. The new starting composition favors the pond and garden together.
- Added Hidden Reef branding, garden / water / underwater view buttons, a fish guide matching all 20 displayed individuals, and a separate interactive water-chemistry lesson.
- Pinned the koi's head during the traveling body wave; grew lateral flex toward the tail; preserved separately animated paired fins, tail membranes, breathing and eyes.
- Reduced maximum turning rate and acceleration, feeding rush speed, pitch and roll. Fish vary depth continuously and choose new preferred depths, alternate bursts with glides and inspection pauses, retain loose social spacing, and track local hunger, energy and a fading feeding-location memory.
- Corrected freeze behavior and final floor/surface bounds after crowding. Muted audio by default, kept technical settings out of the opening view, and added a reduced-motion initial state.

The chemistry model uses mg/L as nitrogen, with explicit nitrogen mass balance and user-supplied pH. Its readings are illustrative, separate from the visual scene, and are not a stocking or treatment prescription. Care sources and model limits are available in the guide.

## Validation

Node tests exercise the actual scene's simulation function against its actual basin geometry for 150 simulated seconds, plus a feeding run and freeze check. They verify finite positions, basin/floor/surface bounds, upright attitude, variable speed, continuous depth exploration and independent phases. The shared body curve is checked for a steady head, traveling phase, growing tail amplitude and a matching analytical slope. Chemistry tests cover speciation, nitrogen conservation, aeration/filter comparisons and nonnegative long-run state.

Browser checks cover initial rendering, garden and underwater cameras, variety selection/following, chemistry controls, weather, feeding, pause and phone layout. The browser preview may throttle background WebGL tabs; FPS from a background tab is not a device benchmark.

## Publishing

Publish only to GitHub and jez237 until the user accepts this for the Hidden Reef site. The repository's root `AGENTS.md` deployment wrapper must be used to preserve all public assets and Pages Functions. Do not use a standalone static upload for jez237-site.

Previous Blender-authored models and their generator remain archived in the repository's `model-source` directory; the v3 runtime uses the upstream procedural koi with revised kinematics.
