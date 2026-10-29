# Trickle Atelier

Original interactive wet/dry filter teaching model. This is an independent generic design, not a commercial product replica, measured CAD, plumbing plan or installation guide. User selected this mechanism after the AquaClear HOB exhibit, ahead of the previously suggested sponge filter.

Editable ES modules live directly here. Serve the repository over HTTP and open `/demos/trickle-studio/`. No build step or new package is needed. Three.js, OrbitControls, studio environment, cellular sponge and molding textures are shared via relative imports from `../aquaclear-studio/`. Keep that dependency available when moving this demo. The existing vendor MIT license remains there. No purchased assets, model downloads, external fonts or API keys are used by the exhibit; shared site middleware may add analytics.

## Experience

- Eighteen selectable assemblies, assembled/cutaway views, continuous explosion, automatic explode-and-return, single-part isolation, orbit, zoom, fit, front and overhead cameras.
- Complete upper aquarium section, open overflow weir, gravity drain, fibrous mechanical pad, a distributor with 63 actual through-holes, 96 independently rotated ribbed bio-balls, raised grate, over-under-over baffles, final sponge, return pump, union, riser and outlet.
- Seven guided close-ups: circuit, gravity drain, distributor, biological bed, baffles, exposed working impeller and power-off drain-down.
- Water lab: low/high pump setting, sump fill, loaded pad with uneven distribution, stop/restart power, low return-level protection and insufficient-reserve warning.
- Small tangent-aligned directional arrows. Cyan marks the drain, mint the return, amber bypass or power-off drain-down. Return arrows reverse when power is off.
- Falling droplets and short distributor jets, collection bubbles, mesh waves, visible water depth and meniscus cues. Main collection surface has bounded planar reflection and depth-guarded screen-space refraction.
- Four care stages disable operation and separate relevant components. Pause/reduced motion freezes simulation time and drain-down while leaving camera controls available.
- Responsive controls, keyboard tabs/component selection, mobile tour navigation, fullscreen and readable component descriptions when WebGL fails.

## Evidence and limits

Primary references reviewed October 28, 2026:

- [Aqueon ProFlex manual](https://www.aqueon.com/-/media/project/oneweb/aqueon/files/us/instructions/filtration/proflex-modular-sump-model-1_2_3_4-pdf.pdf): modular-sump arrangement, wet/dry conversion, biological-media support and distributor.
- [Aqueon filtration principles](https://www.aqueon.com/articles/filtration): mechanical and biological filtration context.
- [Aqueon wet/dry setup video](https://www.youtube.com/watch?v=TICzgBiJJ3A): manufacturer setup reference.

The model's arrangement and proportions are original. It does not claim to duplicate ProFlex geometry or capacity. No aquarium-store competitor links are used. Mechanical capture does not remove material from the system until maintenance; nitrification does not remove nitrate. The biological bed is represented as wet surfaces with air passages, not literal visible bacteria.

`hydraulics()` in `data.js` is an explicit illustrative compartment model. Running collection level crests the first baffle; the return compartment varies with the fill control. Power-off adds a finite upper-circuit volume to a weighted sump balance while the display level falls. At the end of drain-down, delivery and drops reach zero. High fill can exceed the rim; rendered surfaces clamp to the rim and the UI explains overflow. This does not calculate real volume, head loss, siphon geometry, pump curves or fluid dynamics. A real installation needs its own complete power-off test.

Pump setting is qualitative, with nonzero flow at its low end; the power button switches it off. Low return level stops the illustrative pump. The final sponge, bypass channel, droplet paths and bubble separation are simplified. Water falls through the bed along illustrative paths rather than colliding with each rib. The rotor is slowed for inspection. Exploded positions are teaching offsets, not a servicing sequence. Care mode does not replace manufacturer instructions.

Bio-ball placement uses deterministic conservative sphere envelopes; spheres do not overlap or leave the chamber. Ribs are real geometry, not alpha textures. Fibers and plastic grain are procedural; their scale, wet sheen and material response are artistic approximations, not measured scans. The main water sheet shares a horizontal reflection approximation; the aquarium and return surfaces use simpler physical shading. Tinted vertical surfaces and meniscus lines deliberately improve water visibility. There is no volumetric ray tracing, chemistry model or biological-growth prediction.

## Architecture and maintenance

- `data.js`: descriptions, sources, tour/care chapters and pure qualitative hydraulic mapping.
- `model.js`: deterministic geometry, material generation, pick targets, component offsets, water meshes, instanced drops/bubbles/arrows and pose application.
- `optics.js`: offscreen scene capture, depth-guarded refraction and reflection shader. Width is capped at 1024 pixels, with half-resolution capture below 760 CSS pixels. Renderer state is restored in `finally`; captures stop when water is hidden.
- `studio.js`: accessible UI, unified animation state/clock, guided cameras, selection, care and read-only diagnostics at `window.trickleStudio.snapshot()`.
- `studio.css`: the HOB exhibit's responsive visual system, with water-lab state styling.

All moving effects use the same paused/reduced-motion clock. Avoid adding independent timers for water or pump effects. Pure pose evaluation is also used while calculating camera bounds, so it must not increment physical time. Preserve the original opaque canvas and scene background: an alpha canvas can give physically transmissive acrylic pale halos.

## Checks and publication

From the repository root, with an HTTP preview server:

```sh
node --check demos/trickle-studio/model.js
node --check demos/trickle-studio/studio.js
node scripts/trickle-studio/qa.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/trickle-studio/cover.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/build-demos.mjs
```

The QA runner uses Playwright and Chrome; `CHROME_PATH` overrides the browser path. It verifies finite drain-down, overtopping, low-level stop, baffle crest level, loaded outlets, arrow tangents/reversal, nonintersecting media inside the chamber, finite exploded bounds, all component pick targets, all modes/chapters, pause, care shutdown, keyboard controls, orbit, mobile layout, reduced motion, bounded optics, WebGL fallback and failed requests/console errors. Captures go to ignored `tmp/trickle-qa/`. The cover is an actual 1440×900 browser screenshot, registered as exhibit 030 in `demos/catalog.json`.

Follow root `AGENTS.md` and the workspace `deploy-reusing-stage.mjs --deploy` wrapper after checks and a committed/pushed update. Reuse the existing stage; do not copy the full website or bypass Pages Functions. The Hidden Reef storefront and Lab remain separate projects.
