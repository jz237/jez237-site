# Living Silk — Betta Atelier 1.1

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

Three separate GPT Image 2 studies were generated at explicitly requested quality
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
the body is closed 3D geometry with 220 longitudinal and 96 radial segments,
independent dorsal/ventral contours and varying lateral thickness. Both sides,
the mouth cap and the seven folded fin meshes are rendered in real time. The eyes
have separate textured convex irises and dark pupils. Geometry totals 183,744
triangles. Iridescence, roughness, subtle bump and reflections respond to light.

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

Two JPEG textures load from the existing public `media.jez237.com` R2 bucket.
CORS for the production origin `https://jez237.com` was verified. Localhost is not
an allowed bucket origin: local QA serves identical original JPEG bytes through
Playwright route fixtures. Production QA must run **without** those fixtures and
verify actual R2 delivery. A failed texture request shows an explicit retry message,
not an indefinitely empty aquarium. The optional gallery displays all three images.

## Verification

Task QA scripts and screenshots are retained under
`artifacts/betta-atelier-20261022/qa-v1.1/` in the GameMaster workspace. Checks cover:

- Desktop 1440x1000 and touch-emulated 390x844 layouts and controls.
- Pause/resume, fin relaxation, all cameras, light, info, reset and reverse side.
- Integrated motion states, facing direction, thrust and finite positions.
- Screenshot inspection of profile, head, fins, reverse side and full-turn stages.
- Gallery preview/launch/back links, all three reference images, no-WebGL fallback.
- Live bundle/asset hashes and production-origin texture loading without mocks.

Approximately 60fps was observed on the host AMD GPU; this is not a physical-phone
performance claim. The references include baked photographic lighting, so close-up
and strongly oblique views remain an artistic real-time approximation.
