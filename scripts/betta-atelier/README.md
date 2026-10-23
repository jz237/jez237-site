# Living Silk — Betta Atelier 1.7

The standalone published build remains 1.7. Shared source also includes the globe
1.4 motion revision: broad fins bend across their full span rather than pinning
the inner half to a target; ray-length constraints, root attachment and the
one-second display remain. Optional host locomotion supplies model-space speed
and a separate voluntary `steerRate` for delayed head-to-tail tangent memory and
deep, curvature-limited turns. The globe anchors its route at the neck and keeps
passive fluid rotation separate from muscle flexion. See
[`../globes/HOSTING.md`](../globes/HOSTING.md) for the integration and verification
procedure. Rebuilding this standalone directory would adopt the shared-source
changes; the globe revision deliberately does not rebuild its compiled demo.

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

Historical behavior: the exaggerated low-effort swing described below is
superseded by revision 1.5. The spine and breathing anatomy remain in use.

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


## Reference-informed compact gait · revision 1.5 (2026-10-22)

Jez corrected the movement: a resting betta holds almost still; propulsion uses
quicker, narrower strokes, with much faster pectorals against a current. Still
water is now the initial setting, with quiet trunk motion and less whole-body bob.
The 32-second path now spends 20 seconds holding, with two short swimming bouts
and separate turns. The visible mouth/gill pump remains.

Reference: Colorsbetta Thailand, “Red Copper Halfmoon Male, Live Betta Fish
Thailand”, https://www.youtube.com/watch?v=WDZqSs-VLXc (published 2019).
Reviewed twelve overview frames and 36 usable dense samples: 4.30–5.00 seconds
(turn, every 0.05 s) and 20.00–21.00 seconds (holding, every 0.05 s). The first six
attempted samples at 4.00–4.25 showed the loading page and were excluded.
The holding sequence has a relatively straight trunk, whereas the turn changes
curvature and the trailing fin fan follows. This fish is displaying near another
betta, not resting in a controlled current experiment. Capture timestamps are
playback times, not calibrated biological beat-rate measurements. Current-related
cadence follows Jez's observations; no flow rate was inferred from these images.
The earlier Commons GIF was rejected as a tuning reference because its camera
motion and blur obscured the body. Reference captures are local research evidence,
not bundled assets, textures or replacements for the original artwork.

`src/swim-gait.js` separates locomotor/current effort from excursion. The idle drive
is below the propulsion threshold. Body cadence grows from approximately 0.55 to
4.7 cycles/s and pectoral cadence from 1.6 to 7.4 cycles/s as effort rises; those are
animation settings, not measurements of the reference fish. Peak trunk wave angle
is limited to 0.246 radians (~14 degrees); turn curvature is separate. The large
fins retain passive drag and inertia rather than all following a rigid sine wave.
Pectoral rays have an actively driven proximal span and free outer membrane; extra
constraint passes stabilize the pectorals during rapid strokes. A root-to-tip
length limit prevents the tiny insertion segments of long fins from stretching
during fast trunk motion. Merely increasing a
weak spring's target frequency had filtered the visible beat into a slow sway.

Ten tests cover fin anchoring/strain, direction response, frame-rate consistency,
quiet-hover versus compact propulsion, breathing order, smooth effort changes and
**actual simulated pectoral edge cadence**, including at 30 fps. Browser QA checks
rendered behavior and original R2 textures on desktop and touch-emulated phone.
Evidence: `/home/jez237/.openclaw/workspace/tmp/betta-gait-reference-20261022/`.

## Relaxed/display posture and socket gaze · revision 1.6 (2026-10-23)

The quarter-second opening, resting angles and independent gaze below are superseded by v1.6.1.

Jez requested the large relaxed-to-flared change and rapid opening, plus eye
rotation. Reference comparison: LoveToKnow Pets, Kelly Roper's 2018 “Betta Fish
Pictures”, **Halfmoon Butterfly Betta** photograph (caption identifies resting
fins), https://www.lovetoknowpets.com/aquariums/betta-fish-pictures; and the
Colorsbetta Thailand footage above, including its 21-second display frame.
The resting photo is not fully closed: its caudal fan is narrower, gill covers
are not displaying, and the dorsal/anal fins still retain area. The display
footage shows a much broader tail/dorsal/anal silhouette near another betta.
These are different fish/angles, qualitative references, not a measured paired
experiment or proof of a particular transition time. Reference files stay in
local research evidence, not the public assets.

- Starts relaxed. The fin button toggles **Fins relaxed / Display flared**.
  Caudal, dorsal and anal rays have different resting angles; their rays retain
  length. Cross-ray/diagonal chord lengths follow the fan pose to represent
  unresolved accordion folds; this is not a material-area-conserving cloth model.
- `DisplayMotion` drives a fast opening and slightly softer closing, independent
  of the v1.5 swimming effort. Proximal ray actuation gives the visible fin a fast
  response while flexible edges retain water-driven lag. Local rendered-solver
  QA measured >80% of the tail's opening in 0.25 seconds. This is an animation
  response, not a biological measurement. Gill covers also widen for display,
  with the breathing cycle retained underneath.
- Each iris and pupil share a fixed socket pivot. Bounded, short glances alternate
  with quiet fixations; the eyes have slightly different timing. Display favors
  a forward gaze. The face shader masks the static painted pupil under the moving
  globe, without changing the original JPEGs. Pause/reduced-motion freezes gaze
  and display too; changes requested while paused wait for resume.
- Twelve tests cover previous gait/physics invariants plus actual fan opening,
  closure, anchoring and ray lengths at 30/60/120 fps, and gaze bounds/fixations/
  saccades/independence/pause. Browser QA checks both silhouettes, close-up gaze,
  opposite side, currents/reversals, desktop and touch-emulated phone controls.

Evidence: `/home/jez237/.openclaw/workspace/tmp/betta-display-gaze-20261023/`.

## Partly open resting fins and one-second flare · revision 1.6.1

Jez clarified in `1563082328945860649` that still-water fins hang partly open,
and explicitly requested a one-second flare rather than a quarter-second.
The resting caudal/dorsal/anal fan factors are now 0.58/0.55/0.72 (previously
0.43/0.34/0.60), retaining the tail's relaxed droop and water-driven flexible edges.
`DisplayMotion` uses a one-second smoothstep from the current pose to full display,
not a rapid exponential approach. Mid-transition reversals start at the current
pose; pause still freezes the transition. Breathing and swimming are unchanged. Jez also clarified that both eyes look in
the same direction simultaneously: they now share one gaze controller, advanced
once per frame, with mirrored socket axes for matching forward/upward movement.
The existing solver test now verifies an incomplete quarter-second opening and
near-complete one-second opening at 30/60/120 fps, plus partly open resting posture.
Evidence: `/home/jez237/.openclaw/workspace/tmp/betta-one-second-flare-20261023/`.


## Turning curvature and fin follow-through · revision 1.7

Jez requested more body and fin bending specifically while turning
(`1563118644097982515`). Re-reviewed the existing real Colorsbetta frames at
4.30–5.00 seconds: the head leads the change of heading while the rear body and
large fan remain curled, then unfold behind it. This is a qualitative oblique
reference, not a calibrated angle measurement or a flow experiment.

- Turning now produces a softly saturated, sustained C-curve through the trunk,
  separate from the unchanged narrow propulsion stroke. It builds and releases
  with smoothed yaw rate; head attachments remain steady and spine length is
  preserved. Both turn directions use the same symmetric response.
- The caudal fan wraps further behind its peduncle. Dorsal and anal rays cup
  laterally along their distributed body insertions. These motor targets retain
  ray length; the existing flexible membrane and rotational water drag provide
  edge lag and recovery. Drag uses actual angular velocity, not the delayed
  muscle response. No extra flaring or larger idle swing was introduced.
- One-second display, partly open resting fins, synchronized gaze and breathing
  are preserved. Fourteen tests cover existing behavior plus bilateral turns,
  centerline length, rendered fin cupping/lag/recovery at 30 and 120 fps.

Evidence: `/home/jez237/.openclaw/workspace/tmp/betta-turn-bend-20261023/`.
The model remains an artistic reduced-order approximation; fin-to-fin
self-collision is not simulated.


### Reuse in Globes

`createBetta({ compact: true })` keeps the same motion and reference textures with
lower render tessellation for the globe ray tracer. The default is unchanged.
Animated materials expose `userData.bettaDeform` so a CPU adapter can evaluate the
same spine, cover lift and fin displacement used by the WebGL vertex shader.
Optional `fish.userData.externalFlow` is a world-frame velocity in Atelier units;
when present it replaces the artistic current for both effort and membrane drag.
The globe adapter converts its solver units explicitly. These are additive hooks;
the standalone v1.7 compiled demo is not changed by the integration release.
