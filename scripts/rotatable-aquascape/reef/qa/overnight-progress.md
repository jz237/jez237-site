# Overnight reef realism checkpoint

Automation: overnight-reef-realism. Current task; every 15 minutes through September 23, 2026 at 08:00 America/New_York. Publication restricted to jez237 + GitHub. No Hidden Reef changes, spending, paid generation, or credit resets.

## Starting accepted build

- Commit: 506ebc99b4a5134e7c4d82567a4ab6320c5cbc5c
- Live: https://jez237.com/demos/reef-aquarium/?v=reef-506ebc99b
- Reference: C:/Users/jrb04/Desktop/ChatGPT Image Sep 22, 2026, 08_13_11 PM.png
- Repo: C:/Users/jrb04/Documents/Codex/2026-09-10/rotatable-3d-aquascape/work/comparison-site
- Source: scripts/rotatable-aquascape/reef
- Entry: demos/reef-aquarium
- Existing local Vite preview: http://127.0.0.1:5240/ (check before starting another).
- npm run build:reef; npm run check:reef from scripts/rotatable-aquascape.
- Initial test: 20 fish; all 36 food particles eaten; no reported conservative-volume overlaps; pause, views, blue hour, fullscreen, identification, randomization and mobile fit pass.
- Local desktop ready ~1.49 sec, ~60 FPS on this host. Not a measured phone guarantee. Initial reported triangles 2,166,582; generated JavaScript ~175 KB gzip. Preserve a consistent measurement method and full effects comparison.
- Planted aquarium: 264 behavior tests pass, shared sync and release gates pass, shared source/bundles unchanged.
- Screenshots: reef/qa/front.png, angle.png, side.png, mobile.png, blue-hour.png, live.png. Copy accepted comparison captures to uniquely named files before overwriting them.

## Honest visual assessment and first priorities

The preview is functional but not close to the reference's photographic realism. Do not equate passing tests with visual completion.

1. Reef rock still looks like stacked rounded boulders. Build porous limestone-like architecture with interconnected arches, smaller irregular encrustations, crevices, convincing micro-normal detail and varied silhouettes.
2. Branching coral is overly regular, sparse and plantlike. Improve species-appropriate irregular fork junctions, lateral growth, branch taper, polyp/corallite scale, colony density and colors. Plates need convincing thickness, scalloped growth edges and tissue rather than a flat radial fan.
3. Anemones look like uniform pale cylinders with bead tips. Vary tentacle length, taper, curvature and rooted distribution; improve translucency/color variation and coherent flowing motion without synchronized waving.
4. Marine fish need species-specific anatomy, fin-ray and membrane detail, more realistic skin/scale response, and deliberate irregular locomotion. Maintain the steady head, flexible traveling body wave, independently active fins, bursts/glides, upright gradual turns and 3D depth exploration.
5. The backdrop is smooth and lighting fairly flat. Improve underwater depth, blue light falloff, grazing highlights and substrate caustics without adding costly full-scene captures or fake photograph planes.
6. Collision tests currently use approximate conservative volumes; add rendered body/fin clearance checks and tighten navigation where needed. Do not claim triangle-perfect contact from the proxy test.

## Iteration and release

Choose a substantial visual improvement, implement, screenshot front and oblique plus close-up and phone, inspect directly against the reference, measure CPU/GPU/frame/load changes, fix regressions and retain the better version. Do not simply inflate mesh counts. Keep a dated log of actual changes, evidence, unresolved gaps and next priorities below.

Publish meaningful verified milestones only. Latest root main may advance from other tasks; fetch/rebase without discarding their work. Existing process: npm run build:reef, npm run check:reef; node scripts/check_aquarium_sync.mjs and check_aquarium_release.mjs; record the reef checked build; commit scoped changes, fetch/rebase, push HEAD:main. Stage the full current site using the established staging helper template in ../stage-reef-506ebc99b.mjs with a new unique output path, preserving site functions and deployment guard. Use the documented Cloudflare/Wrangler skills and the existing jez237-site project only. Verify live HTML (existing site analytics may be injected), exact JS/CSS bytes, the selector and live behavior; verify GitHub Pages rollout. NEVER deploy hidden-reef.

Stop at the overnight cutoff or if verified realism is achieved earlier. Clearly state remaining discrepancies at the final checkpoint. Leave the last accepted live version intact if a new iteration fails.

## September 22, 21:25 EDT — coral morphology pass

- Replaced the pointed twig clusters with irregular connected forks, rounded pale growth tips and attached encrusting bases. Attachment raycasts run once during construction.
- Plates now have closed thin sides, separate upper/lower coloring, scalloped contours and subtle radial relief. Reduced the previous corrugated texture after inspecting a macro view.
- Rock has recessed geometric pits and generated albedo, normal and roughness maps. More directional lighting and a slightly raised front camera reveal the plate tops and channel.
- Full browser suite passes: all 36 particles consumed, no proxy-volume fish/obstacle overlaps in the samples, random starts, pause, views, lighting, fullscreen, identification, phone controls and planted-to-reef navigation. Fixed the navigation test to account for the intentionally hidden PREVIEW label on phones.
- Local ready time 1507 ms; approximately 60 FPS; 2,168,022 reported rendered triangles (baseline 2,166,582, essentially unchanged). JS 176.11 KB gzip. No mobile hardware speed claim. Planted sync and approved-release guards pass; no shared planted or Hidden Reef source/bundle edits.
- Visual review: front/angle/mobile/macro are functional and branch/plate silhouettes improve. Still far from reference: rock crust is too broad/soft, coral junctions and basal crust look modeled, anemone tentacles too uniform, fish anatomy/skin too simplified, lower background empty. Next pass should improve anemone taper/flow and finer surface detail before increasing object count. Do not claim realism complete.

## September 22, 21:40 EDT — anemone anatomy and rooted flow

- Replaced separate shafts/bead tips with 540 continuous tapered tentacles, rounded ends, curved individual silhouettes, darker roots and pale tips. Added oral disc/mouth and a short column that reaches a sampled rock surface. Surface normals follow the bend; one merged mesh and shader time uniform avoid per-frame CPU vertex updates.
- Replaced the old world-position root guess with explicit root-to-tip attributes. The shared current combines a broad surge and smaller individual offsets, keeping roots pinned and tips more flexible. Successive macro captures show the change in bending.
- Rejected an inward-wound prototype after macro inspection. Added a geometry regression check: 540 root/tip pairs, finite vertices/normals, 100% outward normals. It runs with check:reef.
- Lower attachment exposed floating old polyp rings: colonies now sit on sampled rock surfaces with continuous supporting tissue instead of unsupported disks. Colony supports remain visibly simple; refine irregular encrustation and polyp fringes in a future pass.
- Final browser suite: 1587 ms to ready, approximately 60 FPS local, all 36 food particles eaten by ~12 seconds, zero sampled fish/obstacle proxy overlaps, controls/pause/reload randomness/mobile fit pass. 2,305,734 reported rendered triangles versus 2,168,022 previously (~6.4% increase for rounded closed tissue); JS 177.83 KB gzip versus 176.11 KB. No extra scene captures or detail reduction.
- Planted release/sync guards pass. Only reef files and its generated bundle change; jez237/GitHub publication only.
- Still clearly short of reference: tentacles need finer optical tissue response, polyp supports are too spherical, rock needs smaller-scale realistic crust/pores, and fish remain stylized. Next substantial priority: marine fish anatomy/skin (especially protruding mouths, eyes and planar fins), while preserving smooth swimming.

## September 22, 21:55 EDT — marine fish detail

- Replaced pointed oval body geometry with a smooth sampled cheek/snout profile, closed ends and averaged normals at the side UV seam. First prototype showed profile bumps and a hard cheek shading seam; both were corrected after macro inspection. Body lighting now follows the traveling body wave.
- Smaller inset irises/pupils with darker rims, body-conforming textured gill covers that lift subtly for breathing, and a small slit-like mouth that opens during approaches replace protruding eyes, untextured round gill pieces and the large expanding mouth ring.
- Shared-vertex radial fin membranes retain deformation subdivisions with fine ray textures and dark fringe colors; rounded clownfish/gramma tails differ from forked open-water tails. Blue tang pectorals have warmer yellow coloring. Reduced exaggerated high-contrast scale outlines. No new draw pass or full-scene capture.
- Geometry regression covers finite closed bodies, smooth seam normals and outward gill covers. Final check:reef passes, including anemones, feeding (36/36 particles by ~12.4 seconds), sampled proxy collision spacing, pause, controls and mobile fit. Local ready 1526 ms, approximately 60 FPS. Reported render triangles 2,387,574 versus 2,305,734 (~3.5% increase, chiefly smoother bodies); JS 178.72 KB gzip. Preserve truthful local-only performance claims.
- Front, angle, mobile and three species macro captures inspected. Fish now have more legible anatomy/fin detail, but patterns, eyes and tissue response remain stylized. Reef still not photographic. Rock coloration/porosity and spherical polyp cushions remain major scene-wide gaps.
- Only reef files change; planted release and synchronization guards pass. Publish jez237/GitHub only. Next visual pass should address rock/coral material realism; consider freely licensed real surface maps if useful, with no purchases. A detail-preserving memory optimization remains: keep the existing Anemones.ts geometry indexed through merging instead of converting every piece to non-indexed.
