# V8 Engine Laboratory

Public demo: https://jez237.com/demos/v8-engine/

The complete React / Three.js source is here. Geometry, surface finishes, and animation are generated in code. The mechanical model uses one crank angle, a 90-degree cross-plane V8, firing order 1–8–4–3–6–5–7–2, and idealized four-stroke valve timing. Model simplifications are explained in the demo's Engine notes.

With Node.js 22.13 or newer:

```sh
cd scripts/v8-engine
npm ci
npm run dev
npm run build
```

The build replaces only `demos/v8-engine/`. Commit both source and generated assets. Relative asset URLs support jez237.com and the GitHub Pages mirror. The static app has no server, credentials, analytics, or sign-in requirement. Existing private Sites hosting is separate from this public build.

Features: orbit/pan/zoom, synchronized pistons and valvetrain, 720-degree scrubbing, assembled/cutaway/exploded views, part inspection and isolation, guided lessons, motion charts, schematic oil/coolant overlays, lighting and quality presets, presentation mode, and PNG export.

Reference-inspired detail lives in `app/engine-details.ts`: hollow profiled rocker covers, machined gasket rails, socket fasteners, casting webs, curved exhaust primaries and collectors, header welds, chain rivets, pump fittings and sump ribs. Every added component has inspector text and is parented to its owning assembly. Counterweight profiles and collector routing are illustrative, not production specifications. The cutaway plane follows the near bank's cylinder axes; caps and the section handle share its orientation. Deeper hollow piston skirts retain the original crown and wrist-pin coordinates.

The rounded hollow intake plenum feeds curved runners. `app/engine-accessories.ts` constructs the accessory belt from the convex envelope of circular pitch radii (45 / 32 / 25 mm). Pump and alternator speeds are 1.40625× and 1.8× crank speed; the physical crank angle is continuous while the UI displays it modulo 720°. The belt uses a no-slip model; electrical output and coolant dynamics are not simulated.

Two-cylinder windows reveal cylinders 1 and 3 while retaining cylinders 5 and 7 assembled; disable the switch for a continuous section. Combustion lighting is a short, crank-synchronized teaching effect, not a combustion simulation. Hover highlights the target and clicking displays an anchored part label. Follow this part tracks its translation; manual orbit or a camera preset stops following. The 3.3-second assembled-to-cutaway opening supports replay, interruption, and live reduced-motion preference changes.

Validation: `npx tsc --noEmit` and `node --experimental-strip-types lib/features.test.mjs`. The latter checks belt wrap and clearance, continuous accessory ratios across cycle boundaries, selected inspection windows, opening cancellation/replay/reduced motion, and linkage geometry across two cycles.
