# Living Silk — Betta Atelier

An original interactive 3D male halfmoon Betta study for Jez237, built 2026-10-22.
Live route: https://jez237.com/demos/betta-atelier/

## Build

Node 22.12 or newer. From this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Vite writes the static build to `../../demos/betta-atelier/`. `public/` contains
its reference-study page and the Three.js license. Do not put generated reference
image binaries into Git; `reference-provenance.json` retains prompts, hashes,
dimensions, exact requested model/quality and verified R2 URLs. The three original
JPEGs and raw returned metadata are retained in GameMaster's
`artifacts/betta-atelier-20261022/references/` on Evo X2.

## Reference-driven construction

Three separately generated GPT Image 2 studies guide the model, not a projected
fish photograph. Their use is documented rather than presented as real specimens:

- **Profile:** body taper, caudal peduncle, separate dorsal/anal/caudal fins,
  halfmoon outline and paired pelvic filaments.
- **Head:** small upturned mouth, convex black eyes with copper irises, curved
  operculum seams and the transition to small facial scales.
- **Fins:** branching ray colour channels, radial pleats, thin membranes and
  fine pale trailing edges.

GPT was explicitly requested at quality high. The stock response identifies the
request as gpt-image-2 but supplies no independent backend-model or actual-quality
attestation. We do not infer verification from the echoed model. No model fallback,
image reroll, resizing or subjective rejection was performed.

## Geometry and materials

- Continuous capped body with 150 longitudinal sections and 80 radial segments.
- 2,646 individual overlapping flank scales and 900 smaller facial scales.
- Seven separate fins (caudal, dorsal, anal, two pelvic, two pectoral), with
  radial pleats and scalloped contour geometry, branching shader rays,
  transparent membranes and independently moving pectorals.
- Sculpted mouth/lips, eye sockets, copper irises, black pupils, clear corneas,
  nostril pores and body-surface-projected gill seams.
- Shared spine deformation, fin travel waves and breathing gills.
- Physical iridescent materials, local procedural environment, three-point
  lighting, subtle bloom, water light shafts and drifting motes.

The fish contains 706,808 triangles including all scale instances. The rendering
is an artistic anatomical study, not a scientific digital twin. No claim is made
that AI-generated anatomy is authoritative. Runtime code and environment are
self-contained; only the optional reference gallery fetches R2 images.

## Interaction and accessibility

Orbit by dragging, scroll/pinch to zoom, pause (also Space), open/relax fins,
choose whole fish/head/scales/fin views, change light, reset, fullscreen. Buttons
are semantic and labelled; pointer/touch handling belongs to OrbitControls and
never blocks the HTML controls. Reduced-motion preference pauses the fish at
startup. No WebGL 2 or lost context produces a readable route back to Demos.

## Verification

`/tmp/betta-qa/check.mjs` (retained with task artifacts) checks desktop and
phone-sized layouts, no horizontal overflow, animation pause/resume, fin-state
transition, all inspection cameras, lighting, information panel, reset and the
reverse side, plus page/console/network failures. Actual AMD-GPU rendering at
1440x1000 and emulated touch 390x844 measured approximately 60 frames per second;
that is not a performance claim for physical phones.

Publish only through the existing guarded full-site Cloudflare workflow from a
complete committed/pushed publishing checkout, never from this sparse task tree.
