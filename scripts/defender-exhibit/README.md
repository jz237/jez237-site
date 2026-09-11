# Defender — Inside the Arcade

Original interactive cabinet homage for https://jez237.com/demos/defender-exhibit/.

## Build and asset pipeline

Run `npm ci`, then `npm run build`. The build first runs `build-model.mjs`, producing `public/cabinet.glb`, checks TypeScript, and writes the self-contained public build to `../../demos/defender-exhibit/`. Run `npm run dev` for local development. Run `node --test tests/*.test.mjs` for gameplay and model integrity checks on Node 24+.

The cabinet is authored in Three.js and exported as a GLB with 13 named assemblies and independent pivots. Static hardware is merged by assembly and material to reduce draw calls. Geometry, offsets, and material roles are editable in `model-detail.mjs`, `src/choreography.ts`, `src/data.ts`, and `src/Scene.tsx`. GLTF Transform welds, deduplicates, reorders, and Meshopt-compresses the model without quantizing its interactive transforms. The detailed cabinet has 155 meshes and approximately 114,000 triangles; the compressed GLB is about 1.7 MB. The runtime uses React, TypeScript, React Three Fiber, and Three.js OrbitControls. Animation is a deterministic damped state transition, with capped delta time.

`public/side-art.webp` is original AI-generated cabinet artwork, downsampled to 768 × 1152 WebP. Keep the portrait aspect ratio for replacements. `public/concept.webp` is the user-supplied visual reference and is shown only as an explicitly labeled fallback if WebGL cannot run. The gallery thumbnail is a screenshot of the live upgraded exhibit. The reference image is not the rendered live exhibit. Original generated cabinet wood, floor and marquee textures are shipped as optimized WebP assets with derived normal and roughness maps. Additional material wear maps and display/control typography are generated at runtime. Generation prompts are recorded in `TEXTURE-PROMPTS.txt`. The game canvas supplies the live CRT texture.

To replace the model, retain the assembly/node names checked in `tests/model.test.mjs`; preserve centimeter-like proportions in the current 3.4-unit cabinet scale and material roles, or update the offsets, anchors, and runtime mappings together. Named interactive nodes include `joystick`, `button_0` through `button_6`, `leaf_0` through `leaf_6`, `crt_screen`, `speaker_cone`, `fan_rotor`, and `travelling_coin`.

## Controls

Mouse: drag to orbit, scroll to zoom, right-drag to pan; click assemblies to inspect. Touch: one finger to orbit, pinch to zoom, two fingers to pan. The component selector exposes the same notes to keyboard users. Number keys 1–4 switch modes when focus is outside a control. Reset restores the mode's camera position.

The CRT now runs an autonomous Defender-inspired attract sequence implemented in `src/DefenderShow.ts`: target tracking, laser collisions, distinct landers, pursuing mutants and baiters, mine-laying bombers, pods that split into swarmers, finite waves, evasive hyperspace, periodic lander abductions, laser-triggered releases, falling-human catches and safe deliveries, a compact terrain scanner, single-line jagged terrain, pixel shrapnel and a 294 � 240 pixel renderer with crisp magnification and anisotropic mipmapped sampling at oblique viewing angles. It is an original visual recreation, not the original ROM. Watch keeps the physical cabinet visible and moves the camera closer. Pause display and cabinet power stop the sequence; reduced motion pauses it as well. There is no playable overlay or gameplay keyboard/touch input. The original game module remains as the shared audio/state base and for its existing regression tests.

The 0.1–2× slider changes exhibit animation only, keeping gameplay consistent. Sound is on by default at 25% volume, with original sound samples played through Web Audio. If browser autoplay is blocked, the first click, tap, or key press starts audio; the SOUND control can mute it. Guided-tour narration uses the browser's speech synthesis where available. Every tour chapter remains readable as a caption in its component card. There are seven tour chapters plus additional ventilation notes.

## Performance and access

High quality caps DPR at 1.75, uses one 2048px shadow map, restrained bloom, and a 768 × 512 floor reflection. Postprocessing caps DPR at 1.3. Performance mode uses DPR 1, no renderer shadows or floor reflector, direct rendering, and fewer dust particles. Mobile defaults to Performance. Reduced motion honors the OS preference initially and can be changed in Help: it disables orbit, particles, fan/cone motion, and animated circuit travel and makes transitions immediate. The autonomous display pauses under reduced motion. The page includes focus styles, labeled controls, a focus-trapped drawer with Escape dismissal, and a fallback illustration. No account or external game service is required.

## Historical and licensing boundaries

This is an interpretive educational model, not a measured restoration scan, factory schematic, or safe repair procedure. Cabinet layout, electrical paths, game logic, cooling, and control arrangement are simplified. Internal CRT servicing requires trained expertise.

Defender is used as a historical reference. The autonomous display renderer, marquee, side-panel homage artwork, and synthesized audio are original; no Williams ROMs, original cabinet graphics, or proprietary audio ship here. User-supplied reference-image rights remain with its owner. A legally supplied ROM would require a separately licensed emulator and integration; none is bundled or downloaded by this exhibit.

## Publishing

The existing jez237 Cloudflare Pages/GitHub deployment is retained. The gallery entry lives in `../../demos/catalog.json`; regenerate it from the repository root with `node scripts/build-demos.mjs`. Publish the full current repository state through its existing main-branch deployment, preserving concurrent changes and the site's deployment guard.
