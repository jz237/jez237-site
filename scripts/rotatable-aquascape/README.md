# Rotatable Living Aquascape

Independent comparison to the photographic Living Aquascape. Public route: `/demos/rotatable-aquascape/`. The original lives at `/demos/living-aquascape/`; its scene and application bundle are unchanged by this project.

## Run

Requires Node 22.13 or newer. From this directory:

```sh
npm ci
npm run dev
npm run build
npm test
```

The production build is in `dist/`. Copy its contents into `demos/rotatable-aquascape/` before site publication. Vite uses relative asset URLs; the demo can also be served independently from any static web server. No API keys, external CDNs, paid services, or runtime network calls are needed.

## Scene and controls

Three.js perspective scene with a limited front-and-side orbit. Drag to rotate; wheel/pinch or buttons to zoom. Front, three-quarter, and side presets ease to their destination. Pause freezes fish, food, water, plant sway, and bubbles while the camera remains usable. Evening dims the lighting. Feeding releases actual sinking particles that individual fish perceive and consume.

The landscape combines procedural glass, substrate, sand, planting, plumbing, light fixture and cabinet with freely licensed scanned hardscape. Poly Haven Dead Tree Trunk 02 retains its scanned geometry, UVs and physical material maps while being bent into asymmetric branches. Rock Moss Set 01 supplies independently placed irregular stones. Fern 02 supplies textured curved fronds with alpha-tested edges. The botanical plant meshes have modeled blades and petioles, varied proportions, tissue textures, venation and restrained current movement. See public/models/ATTRIBUTION.md for authors and CC0 source links. Water uses an actual two-sided planar scene reflection with moving distortion; the underside reflects planting and the top reflects the light fixture. The tetra skin reuses the user's existing `living-species.png` artwork; no new assets were purchased or generated using paid services.

## Fish

`Tetra3D` is adapted from the existing Living Aquascape mesh. The photographic depth-mask shader is removed; normal depth testing handles occlusion. `TetraKinematics`, `TetraSwimming`, `FishBrain`, `FishCollisions`, and `SchoolRoute` retain the established traveling body wave, steady head, independently animated fins, bursts/glides, inspections, upright turns, individual needs, memory, schooling, and continuous depth movement. The scene maps the behavior coordinates uniformly into world units; fish do not change scale as a fake substitute for perspective. `TankSpace` adds world-space hardscape contact and confines plant geometry to the glass.

27 automated tests cover the reused locomotion, body/fin motion, needs, food perception, schooling, depth and spacing, plus world-coordinate conversion, solid contact, and leaf confinement. Browser checks cover the camera presets, drag, zoom, feeding, pause, lighting, responsive controls and comparison navigation.

## Limits

This is a real-time 3D composition using both procedural planting and photogrammetric hardscape, not a path-traced reconstruction of the reference photograph. The reference-driven realism goal remains active: plant shading, natural group arrangement and optical detail still need work. The fern assets are artistic ornamental stand-ins, not species-accurate aquatic specimens. Glass reflections, surface ripples and caustics are approximations; the tank is not a fluid simulation. Hardscape avoidance uses conservative spherical envelopes, and small leaves are not individual collision obstacles. The fish behavior is illustrative, not a biological research model. The detailed scene needs WebGL and will be more demanding on older mobile GPUs.

## Realism iteration checks

The scan files are bundled locally; their download MD5s were checked against the source manifest. GLTF loading completes before the loading overlay is removed. Front and side views were inspected with the new meshes. All 27 fish/tank tests still pass. The development build exposes FPS, rendered triangle count and fish positions as data attributes on the scene element for inspection; those diagnostics are absent from the production build. Small-leaf meshes were reduced from 96 to 24 triangles while retaining their blade profiles and fine shader/material detail.
