# Fleece Atelier — automatic fleece roller

Route: `/demos/roller-studio/`. Collection: `/demos/aquarium-filtration/`.
Field study 036. Added October 31, 2026 at the user's request.

## Version 4 — hardware surface textures

`hardware.js` adds separate molded-plastic finishes to the red housings, ivory frame, dark controllers/sensors and rubber guides, plus a coarser coated-metal motor finish and directional brushing on steel. Each finish combines fine color grain, roughness variation and matching surface-normal relief. Grain uses object-space coordinates so it stays attached to moving parts and does not stretch across narrow rails. Screen derivatives fade fine relief at distance to reduce shimmer. No image downloads or extra geometry are required; labels and teaching behavior are unchanged.

Verified close-up and assembled/cutaway/exploded/macro rendering, mobile layout and existing synchronized-motion/pause checks. The gallery cover shows the updated materials.

## Version 3 — seven realism and learning improvements

1. Each roll has 60 irregular exposed layer lines at both edges, a subtly uneven fabric surface, and fine lint or larger waste deposits. Empty take-up cores reveal the spindle instead of retaining a fictitious fleece skin.
2. The U-shaped path now follows tangent curves around the guide rollers. Unsupported spans relax between advances and tighten when the drive starts. Wrinkles flatten at the roll contact points. All physical changes follow simulation time and freeze on pause.
3. Wet shading follows the actual model water height. Saturated fleece darkens, a contact highlight follows each waterline, acrylic carries clinging beads, and pendant drops grow and fall from exposed wet fabric. Fresh replacement fleece resets the stored waste staining.
4. A particle transport state machine keeps each particle's identity from incoming water to capture, web transport and winding. Captured particles are anchored to a material distance, not water time. Buried particles can recycle as a new incoming visual particle. This is illustrative transport, not CFD.
5. The explanatory drive has beveled 10-, 20- and 40-tooth gears, face openings, bearings, a motor shaft and a retracting coupling. Output angles follow the actual take-up angle: motor 4x, idler -2x, take-up 1x. The UI explains changing supply-roll speed and that this geometry is not proprietary ReefMat internals.
6. Service now has five labeled human-maintenance stages: release retainers, remove spent rolls, install fresh material, feed the leader around the U path, and secure/tension. Automatic care uses the same nine-second model service. **Watch a roll change** shows it at one-third speed, starting nearly exhausted. Care remains a paused reading panel. The real manufacturer's procedure remains authoritative.
7. **Track one fleece patch** follows one amber-marked material location from the supply surface through the wet chamber onto the take-up. The camera adjusts its angle near the outgoing roll. Dragging releases camera tracking; a Resume control restores it. Patch and particle studies request repeated illustrative advances; ending a study cancels those requests and restores sensor-driven operation. They respect pause, high-water/jam interlocks and reduced-motion preferences.

New modules: `web-shape.js` (supported path and wrinkles), `transport.js` (particle identities and service phases), and `roller-detail.js` (layers, gears, retainers, wet contact). `studies-qa.cjs` exercises the complete patch route, particle capture/export, all service phases, gear ratio, pause, mobile and reduced motion. `transport.test.mjs` checks material anchoring, service state and guide clearance. The original eight lessons, 14 assemblies and four modes remain available.

## Version 2 — visible winding and surface detail

The Explore panel now has **Watch one advance**. It loads the wet chamber enough to trigger the existing level sensor, moves to the front of the mechanism and runs at one-third speed. It respects reduced-motion preferences (press Resume). The motor still runs intermittently; the demonstration does not turn the spindles continuously when no fleece is being consumed. Initial arrival starts with a partially loaded web so the first automatic burst can be seen promptly. Reset retains the original clean-start experiment.

The fleece has physical-distance UVs, advected mottled soil, a locally generated 1024-pixel nonwoven texture, slight cross-web wrinkles, 1,100 raised fiber segments and 260 attached dirt flecks. Surface detail travels only when the web advances. The used roll has uneven staining and speckles. Guide rollers use their actual model radius to derive rotation; both spindle angles integrate web travel divided by the changing roll radius. Amber/black index marks make rotation visible against stationary bearings. Fasteners and screw slots add scale cues. All geometry and materials are original code-generated assets.

`finishes.js` owns these procedural materials and details. `motion-qa.cjs` checks spindle motion, guide-radius ratio, texture advection, idle/pause/jam freezing and reduced-motion behavior. Do not animate these parts from wall-clock time independently of `simulation.travel`.

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
node scripts/roller-studio/transport.test.mjs
node scripts/roller-studio/studies-qa.cjs http://127.0.0.1:8822/demos/roller-studio/
node scripts/roller-studio/motion-qa.cjs http://127.0.0.1:8822/demos/roller-studio/
node scripts/roller-studio/qa.cjs http://127.0.0.1:8822/demos/roller-studio/
node scripts/build-demos.mjs
```

The browser check exercises four views, all parts/lessons, live advance, jam/bypass/recovery, high-water inhibit, automatic roll replacement, manual exhaustion, pause, Care freeze, guided route, mobile controls, reduced motion and WebGL fallback. It records errors and failed requests. Screenshots go to ignored `tmp/roller-qa/`. `inspect.cjs` captures diagnostic views. The cover is an actual 1440×900 screenshot.

Uses self-hosted Three.js and OrbitControls from AquaClear, studio lighting from Drum and base styles/finish helpers from Sand/Trickle. Preserve those paths; there are no CDN/runtime dependencies. No edits to those sibling demos are needed.

Add only one child card to the filtration catalog; keep the main demo gallery's single Aquarium Filtration entry. Use the root deployment reuse wrapper after committing and pushing. Do not create a full-site copy or deploy static assets without the Pages Functions bundle. This publication is on jez237.com only; Hidden Reef's storefront is owned separately by OpenClaw on Evo X2.
