# Fleece Atelier — automatic fleece roller

Route: `/demos/roller-studio/`. Collection: `/demos/aquarium-filtration/`.
Field study 036. Added October 31, 2026 at the user's request.

## Intent and boundaries

A detailed educational automatic mechanical filter, following the Red Sea ReefMat 500's general operating principles. The Hidden Reef sells this product. This is original teaching geometry, not a CAD replica or firmware emulation. It shows the random nonwoven fabric, continuous U-shaped web, supported wet chamber, upstream level sensor, geared take-up, external high-water guard, bypass and downstream sump/media basket. Exposed gears, thresholds and timing are explanatory abstractions. Rates, particles, roll consumption and service are accelerated.

Primary sources:
- https://redseafish.com/smart-hardware/reefmat/
- https://g1.redseafish.com/support/manuals/categories/reefmat/
- https://www.thehiddenreef.com/red-sea-reefmat-500.html

No links to other aquarium retailers. Current manufacturer manuals govern real installation/service. ReefMat is designed for seawater and allows fleece changes without shutting the aquarium pumps down. The demonstration pauses its inflow for a simplified roll-change animation; it does not represent an actual automated roll-changing machine.

## Runtime

- `simulation.js`: deterministic, substepped qualitative loading/level/drive model, minimum pulse spacing, jam and high-water interlocks, roll conservation, nine-second service with midpoint exchange. Pure JavaScript, no browser requirement.
- `model.js`: original Three.js geometry, local procedural textile texture, moving textile UVs, dirty-web shader, concentric roll layers, shrinking supply/growing take-up, support slots, hose corrugations, gears/coupling, wet highlights, water surfaces, suspended solids, flow arrows and enlarged fiber network.
- `studio.js`: orbit/picking, four views, 14 component descriptions, eight lessons, six experiments, three ranges, guided particle route, water-level history, quiz, pause/slow motion, reduced-motion and WebGL fallback.
- `data.js`: content and scenario definitions.
- `index.html`: readable science/care/source content, including no-JavaScript fallback.

Default automatic care replaces nearly exhausted rolls (5.5% remaining) and resumes the user's inflow preference. User can disable it to study exhaustion and trigger service manually. Clearing a jam is an abstract inspection/repair action. Pause, exploded mode, Care tab and hidden document freeze physical/service clocks. Reduced-motion starts paused; camera remains interactive. Reset restores default automatic care. Presets retain the user's care preference.

## Verification and publishing

Run from the repository:

```
node scripts/roller-studio/simulation.test.mjs
node scripts/roller-studio/qa.cjs http://127.0.0.1:8822/demos/roller-studio/
node scripts/build-demos.mjs
```

The browser check exercises four views, all parts/lessons, live advance, jam/bypass/recovery, high-water inhibit, automatic roll replacement, manual exhaustion, pause, Care freeze, guided route, mobile controls, reduced motion and WebGL fallback. It records errors and failed requests. Screenshots go to ignored `tmp/roller-qa/`. `inspect.cjs` captures diagnostic views. The cover is an actual 1440×900 screenshot.

Uses self-hosted Three.js and OrbitControls from AquaClear, studio lighting from Drum and base styles/finish helpers from Sand/Trickle. Preserve those paths; there are no CDN/runtime dependencies. No edits to those sibling demos are needed.

Add only one child card to the filtration catalog; keep the main demo gallery's single Aquarium Filtration entry. Use the root deployment reuse wrapper after committing and pushing. Do not create a full-site copy or deploy static assets without the Pages Functions bundle. This publication is on jez237.com only; Hidden Reef's storefront is owned separately by OpenClaw on Evo X2.
