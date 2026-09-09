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

Reference-inspired detail lives in `app/engine-details.ts`: hollow profiled rocker covers, machined gasket rails, socket fasteners, casting webs, header welds, chain rivets, pump fittings and sump ribs. Every added component has inspector text and is parented to its owning assembly. Counterweight profiles are illustrative, not mass-balanced production specifications; the front case has a deliberate inspection opening and the accessory belt drive is omitted. The far-bank cover remains visible in cutaway for context. Check TypeScript with `npx tsc --noEmit`.
