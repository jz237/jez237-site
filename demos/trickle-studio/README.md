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

`hydraulics()` in `data.js` is an explicit illustrative compartment model. Running collection level crests the first baffle; the return compartment varies with the fill control. Power-off adds a finite upper-circuit volume to a weighted sump balance while the display level falls. Bulk delivery reaches zero when the finite upper volume has drained. Small retained-film drips decay separately to zero over six animation seconds. High fill can exceed the rim; rendered surfaces clamp to the rim and the UI explains overflow. This does not calculate real volume, head loss, siphon geometry, pump curves or fluid dynamics. A real installation needs its own complete power-off test.

Pump setting is qualitative, with nonzero flow at its low end; the power button switches it off. Low return level stops the illustrative pump. The final sponge, bypass channel, droplet paths and bubble separation are simplified. Free streams deflect around conservative media envelopes; beads separately follow actual molded rib arcs. This does not solve exact droplet-to-rib collisions, surface tension or film mass conservation. The rotor is slowed for inspection and holds its last angle at power-off. A separate one-third-speed control slows all operating effects. Exploded positions are teaching offsets, not a servicing sequence. Care mode does not replace manufacturer instructions.

Bio-ball placement uses deterministic conservative sphere envelopes; spheres do not overlap or leave the chamber. Ribs are real geometry, not alpha textures. Fibers and plastic grain are procedural; their scale, wet sheen and material response are artistic approximations, not measured scans. The main water sheet shares a horizontal reflection approximation; the aquarium and return surfaces use simpler physical shading. Tinted vertical surfaces and meniscus lines deliberately improve water visibility. There is no volumetric ray tracing, chemistry model or biological-growth prediction.

## Architecture and maintenance

- `data.js`: descriptions, sources, tour/care chapters and pure qualitative hydraulic mapping.
- `model.js`: deterministic geometry, material generation, pick targets, component offsets, water meshes, instanced drops/bubbles/arrows and pure pose application.
- `detail.js`: rounded construction, seam fillets, fasteners, curved vanes, rotor magnet/shaft/seal, open pipe bores and upstream pad deposits.
- `water-detail.js`: deterministic envelope-deflected streams, beads/film glints aligned to actual ribs, distributor film, weir sheet, impact ripples/splashes and restrained procedural floor light.
- `dynamics.js`: pure staged transport and deterministic outlet selection for continuous pad loading.
- `surface-water.js`: outlet menisci/pendants/neck breakup, pad pooling, separate weir tongues, sectioned drain/air and return-line charge.
- `acrylic.js`: subtle procedural polish marks, physical thickness/roughness and edge highlights.
- `optics.js`: offscreen scene capture, depth-guarded refraction and reflection shader. Width is capped at 1024 pixels, with half-resolution capture below 760 CSS pixels. Renderer state is restored in `finally`; captures stop when water is hidden.
- `studio.js`: accessible UI, unified animation state/clock, guided cameras, selection, care and read-only diagnostics at `window.trickleStudio.snapshot()`.
- `studio.css`: the HOB exhibit's responsive visual system, with water-lab state styling.

All moving effects use controller-owned paused/reduced-motion clocks. Flow and arrow phase are integrated so moving a rate slider does not reposition every particle; rotor angle is integrated and held when power stops. The one-third-speed control scales operating time; camera transitions retain their ordinary interaction speed. Avoid adding independent timers for water or pump effects. Pure pose evaluation is also used while calculating camera bounds, so it must not increment physical time. Preserve the original opaque canvas and scene background: an alpha canvas can give physically transmissive acrylic pale halos.

## Checks and publication

From the repository root, with an HTTP preview server:

```sh
node --check demos/trickle-studio/model.js
node --check demos/trickle-studio/studio.js
node scripts/trickle-studio/qa.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/trickle-studio/detail-qa.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/trickle-studio/realism-qa.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/trickle-studio/cover.cjs http://127.0.0.1:8818/demos/trickle-studio/
node scripts/build-demos.mjs
```

The QA runner uses Playwright and Chrome; `CHROME_PATH` overrides the browser path. It verifies finite drain-down, overtopping, low-level stop, baffle crest level, loaded outlets, arrow tangents/reversal, nonintersecting media inside the chamber, finite exploded bounds, all component pick targets, all modes/chapters, pause, care shutdown, keyboard controls, orbit, mobile layout, reduced motion, bounded optics, WebGL fallback and failed requests/console errors. Captures go to ignored `tmp/trickle-qa/`. The cover is an actual 1440×900 browser screenshot, registered as exhibit 030 in `demos/catalog.json`.

Follow root `AGENTS.md` and the workspace `deploy-reusing-stage.mjs --deploy` wrapper after checks and a committed/pushed update. Reuse the existing stage; do not copy the full website or bypass Pages Functions. The Hidden Reef storefront and Lab remain separate projects.


## Detail and animation pass — October 29, 2026

The tower base is now open beneath the support grate. The earlier closed acrylic bottom incorrectly obstructed the intended drain path. Sixty-three deterministic water paths use a conservative sphere-envelope deflection approximation; 45 paths in the default packing deflect laterally by more than 0.1 scene units. The count describes this fixed teaching geometry, not a real filter measurement.

Water beads and short film highlights travel along rotated ribs. The biological chapter isolates one actual ball at its existing position, with higher mesh tessellation for the macro camera. The distributor has a shallow visible film, the weir has a falling sheet, and landing points create small expanding crests and splashes. The baffle sheet bends as it descends. Wave interference and moving floor-light patterns improve legibility; the latter are artistic caustic cues, not photon transport. Effects remain qualitative rather than CFD.

Construction now includes narrow seam fillets, rounded acrylic edges and pump casing, tower/tray screws, open pipe-end bores, a curved six-vane impeller, rotor magnet, ceramic-colored shaft and retaining seal. The clean pad shows sparse deposits and the loaded study shows 520 instanced particles on its upstream face. Materials, bead sizes, lighting and construction details remain an original interpretation rather than measured product specifications.

The studio has a graded backdrop and contact-shadow receiver. No HOB runtime files were changed. The new scripts remain local and introduce no paid services or remote model assets. Cache versions for this exhibit advance to `v=2`.

`detail-qa.cjs` checks bounded descending stream paths, the open tower base, phase-deterministic bead motion, macro isolation, loaded deposits, care shutdown, pause across all clocks and the measured one-third animation rate. Its desktop/mobile captures supplement the main interaction suite.


## Surface realism and operating studies — October 29, 2026 (v3)

All five requested refinements are implemented. Outlet rims collect water into swelling pendants, narrowing necks and detached threads; media beads gather at rib low points before falling. These remain deterministic mesh animations, not a surface-tension solver. Acrylic uses sparse polish marks in bump/roughness, physical thickness, clearcoat and restrained edge highlights. Existing depth-guarded water refraction remains in place.

The overflow button and tour stop 2 move to a closer sectioned view: eight water tongues correspond to the gaps between nine modeled teeth. A translucent pipe reveals the drain core and downward entrained-air bubbles. Cutting the overflow front and hiding the broad water-depth tint makes its interior readable; ordinary views restore those surfaces/materials. Direction arrows are smaller in this close-up.

On restart the return-line charge travels upward for 1.4 animation seconds; the display then rises, drainage develops around 3.35 seconds, the distributor wets after 4 seconds, and rib film reaches steady operation by 6.2 seconds. After power-off the rotor stops immediately, finite bulk drain-down raises the sump, and residual film drains out by six seconds. These timings explain sequence, not measured equipment performance. The residual film is a visual approximation without a separate volume balance. Care, isolation and exploded modes suppress operation; pause and one-third speed apply to operating clocks.

The Water lab has a continuous 0–100% debris slider and a twelve-animation-second loading demonstration. The same pad goes from 28 to 520 deposits, darkens, pools above its upstream face, and progressively reduces active outlets from 63 to 21 with a deterministic mask. A visible bypass begins above 35% loading. No clogging curve, elapsed maintenance interval or actual distributor failure probability is implied. The original loaded-pad checkbox remains a clean/loaded shortcut. Navigation away cancels the automatic comparison; reset restores all controls and clocks.

`realism-qa.cjs` checks transport order, finite residual drainage, matching outlet counts, progressive loading, pooling, sectioned drain, pause, care, restart, desktop/mobile layout and browser errors. `qa.cjs` additionally waits for residual film to end after bulk settling. All local imports use v3 cache keys.
