# Living Silk — Betta Atelier 1.4

An interactive, genuinely volumetric male halfmoon Betta study for Jez237.
Live: https://jez237.com/demos/betta-atelier/

## Build

Node 22.12 or newer. From this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Vite writes to `../../demos/betta-atelier/`. Publish only with the existing guarded
full-site Cloudflare workflow from a complete committed/pushed publishing tree.
Never deploy this sparse task worktree or run a static-only upload.

## Reference-driven construction

Six separate GPT Image 2 studies were generated at explicitly requested quality
high. Their prompts, actual dimensions, hashes, model-verification limitations and
R2 URLs are retained in `reference-provenance.json`. Original JPEGs and returned
metadata remain in GameMaster's `artifacts/betta-atelier-20261022/references/` on
Evo X2; generated image binaries do not belong in Git.

- The lateral profile supplies measured body contours and UV-projected scale,
  face, dorsal/anal and pectoral pigmentation.
- The head study guides the mouth, gills, thickness and inset eye construction.
- The fin macro supplies the caudal membrane texture and guides radial folds,
  branching rays and thin pale margins.

Images are used unchanged as texture assets. This is not a billboard or a video:
the body is volumetric 3D geometry with 220 longitudinal and 96 radial segments,
independent dorsal/ventral contours and varying lateral thickness. Both sides,
the recessed mouth and the seven folded fin meshes are rendered in real time. The eyes
have separate textured convex irises and dark pupils. Iridescence, roughness,
subtle bump and reflections respond to light.

Version 1.1 replaces the first version's uniform scale instances and procedural
fin stripes after Jez explicitly requested greater realism. The skin now uses
irregular reference pigmentation instead of a repeating geometric scale pattern.
The images are artwork, not photographs of a real specimen. This remains an
artistic reconstruction, not a scientific digital twin.

## Motion

The deterministic 32-second behavior cycle alternates stabilization, acceleration,
gliding, braking and full turns. Integrated tail phase changes frequency/amplitude
with thrust, rather than jumping when speed changes. Caudal motion lags the spine;
fin-edge ripples, alternating pectoral beats, small jaw/gill respiration and gentle
pitch/roll continue during hovering. The frame is compensated around the specimen
center so turns do not clip the opposite side on phones. Inspection views ease
back to quiet hovering. Pause freezes simulation time; reduced-motion preference
starts paused.

## Runtime assets

Five JPEG textures load from the existing public `media.jez237.com` R2 bucket.
CORS for the production origin `https://jez237.com` was verified. Localhost is not
an allowed bucket origin: local QA serves identical original JPEG bytes through
Playwright route fixtures. Production QA must run **without** those fixtures and
verify actual R2 delivery. A failed texture request shows an explicit retry message,
not an indefinitely empty aquarium. The optional gallery displays all six images.

## Verification

Task QA scripts and screenshots are retained under
`artifacts/betta-atelier-20261022/qa-v1.2/` in the GameMaster workspace. Checks cover:

- Desktop 1440x1000 and touch-emulated 390x844 layouts and controls.
- Pause/resume, fin relaxation, all cameras, light, info, reset and reverse side.
- Integrated motion states, facing direction, thrust and finite positions.
- Screenshot inspection of profile, head, fins, reverse side and full-turn stages.
- Gallery preview/launch/back links, all six reference images, no-WebGL fallback.
- Live bundle/asset hashes and production-origin texture loading without mocks.

Approximately 60fps was observed on the host AMD GPU; this is not a physical-phone
performance claim. The references include baked photographic lighting, so close-up
and strongly oblique views remain an artistic real-time approximation.

## Magnified section revision 1.2

Three new GPT Image 2 / high section studies use the original profile or fin image
as an input reference: head/gill (1350x1165), flank scales (1665x945), and membrane
(1177x1336). All are retained unchanged, with original results and prompts in the
workspace `artifacts/betta-atelier-20261022/macro-v1.2/`. No image was rerolled.

`src/surfaces.js` blends a calibrated head projection into the original UVs.
The scale study continues across the full flank with softened horizontal joins,
keeping the scale-edge direction. Arc-aware body UVs reduce stretching over the
back and belly; the facial mapping remains fixed. Colour, luminance-derived bump and roughness variation
use the new detail. Fin microtexture separates fine spatial detail from the broad
ray pattern through mip sampling, so enlarged reference markings do not become
oversized rays. The pectoral and pelvic fins retain their original material.
Animated fin normals are derived from the actual deformed surface. Body contour
radii use smooth Hermite interpolation; iris/pupil geometry is more flush with
the face; restrained lighting reduces the broad plastic-looking highlights.

This improves close-up fidelity but does not establish scientifically measured
microanatomy. The inputs remain AI-generated artwork and retain some baked light.
Production textures are immutable R2 object URLs with checksum query keys.
The versioned Demos preview avoids reusing the previous browser-cache key.

## Water-driven fins · revision 1.3 (2026-10-22)

Jez requested separate contributions from the fish's own power and water moving
at different speeds/directions. `src/fin-dynamics.js` simulates all seven fins as
anchored, wet membranes on 29 × 17 point grids, stepped at 120 Hz. Stiff radial
links represent fin rays; softer cross-ray/diagonal links maintain the membrane;
restoring force falls toward the flexible edge. The original high-resolution
geometry/textures remain intact: a float displacement texture with explicit
bilinear sampling transfers the solver motion to the display mesh. Lighting
normals follow the deformed surface on all seven fins.

- Caudal, dorsal and anal motor targets differ; paired pectorals row alternately
  and feather on recovery; pelvic fins flex and trail independently.
- Fluid force uses membrane normals and water velocity relative to fin motion,
  body translation and yaw. Momentum persists after current/stroke changes.
- The same world-space current and coherent eddies drive every fin and the
  suspended particles. Turning the specimen changes its exposure to that current.
- Water Flow 0–100% and the direction menu are independent of fin relaxation.
  Directions are fixed in the scene: across left/right, toward/away from viewer,
  up/down, or gradually changing currents. Zero disables imposed current, not
  swimming. Percent is an artistic strength control, not a calibrated flow rate.
- Roots follow the exact body deformation. Paired fins have a flank collision
  guard. Fixed simulation substeps avoid frame-rate-dependent instability.
- Pause freezes the solver; reduced-motion starts paused. Flow setting changes
  take effect on resume. Strength eases in and direction reversals act through
  forces rather than teleporting the mesh.

This is a reduced-order interactive approximation, not a fluid-volume CFD solver
or measured betta biomechanics. It does not add fin-to-fin self-collision.

Run `npm test` for anchoring/stretch bounds, reversal response on all seven fins,
self-powered strokes in still water, pause and 30/60/120-fps convergence. Build
with `npm run build`. Browser QA must inspect both sides through the full turn,
maximum currents, macro views, controls and mobile layout, plus real production
texture delivery without the localhost fixture. Local verification receipts and
screenshots: `/home/jez237/.openclaw/workspace/tmp/betta-water-fins-20261022/`.

## Muscular body and breathing · revision 1.4 (2026-10-22)

Jez requested a visibly less rigid trunk, swimming effort even in still water,
and more pronounced mouth/gill respiration. `src/body-motion.js` integrates an
arc-length spine from a head-to-tail bending wave. Cross-sections rotate along
that curve instead of merely sliding sideways. The stable head, rearward-growing
flex and turn curvature preserve the existing specimen proportions.

- One 161-sample spine table drives both the skin shader and CPU fin insertions;
  fin motor targets rotate with the local spine tangent. Attachment targets are
  interpolated across the 120 Hz solver substeps to reduce frame-rate drift.
- Baseline effort remains nonzero with Water Flow at Still. Relative water
  velocity and locomotion increase effort smoothly; integrated swimming,
  pectoral and breathing phases avoid discontinuities when flow changes.
- The mouth has a recessed, closed-throat cavity and flexible lips/lower jaw.
  Bilateral textured gill covers lift at the rear edge after mouth intake,
  exposing a narrow outlet. Skin and cover normals follow their deformations;
  matching outward winding avoids a false lighting seam on the near cover.
- Pause freezes the spine, fins, mouth and gills. Inspection views keep a quiet
  but clearly active swimmer. Existing texture files and flow controls are intact.

Seven automated checks cover the previous fin invariants plus substantial
low-effort trunk flex, approximate centerline-length preservation, mouth aperture
and delayed gill opening. Browser QA includes desktop and touch-emulated phone
controls, both sides/full turns, still/max/reversed currents, and paused close-ups
at intake, outlet and closed-mouth phases. Verify production without texture
fixtures. Evidence: `/home/jez237/.openclaw/workspace/tmp/betta-body-breathing-20261022/`.

Effort, cadence and ventilation are artistic controls, not measured betta
physiology or a fluid-volume simulation. Fin-to-fin collision remains approximate.
