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

All landscape geometry is procedural: glass panels and edges, a sloped substrate, sand channel, irregular rocks and pebbles, tapered driftwood, curved instanced leaves, fern pinnae, moss, plumbing, water surface, light fixture and cabinet. Materials use locally generated textures and built-in Three.js room reflections. The tetra skin reuses the user's existing `living-species.png` artwork; no new assets were purchased or generated using paid services.

## Fish

`Tetra3D` is adapted from the existing Living Aquascape mesh. The photographic depth-mask shader is removed; normal depth testing handles occlusion. `TetraKinematics`, `TetraSwimming`, `FishBrain`, `FishCollisions`, and `SchoolRoute` retain the established traveling body wave, steady head, independently animated fins, bursts/glides, inspections, upright turns, individual needs, memory, schooling, and continuous depth movement. The scene maps the behavior coordinates uniformly into world units; fish do not change scale as a fake substitute for perspective. `TankSpace` adds world-space hardscape contact and confines plant geometry to the glass.

27 automated tests cover the reused locomotion, body/fin motion, needs, food perception, schooling, depth and spacing, plus world-coordinate conversion, solid contact, and leaf confinement. Browser checks cover the camera presets, drag, zoom, feeding, pause, lighting, responsive controls and comparison navigation.

## Limits

This is a procedural real-time 3D study, not a photogrammetric or path-traced reconstruction of the photographic scene. Glass reflections, surface ripples and caustics are approximations; the tank is not a fluid simulation. Hardscape avoidance uses conservative spherical envelopes, and small leaves are not individual collision obstacles. The fish behavior is illustrative, not a biological research model. The detailed scene needs WebGL and will be more demanding on older mobile GPUs.
