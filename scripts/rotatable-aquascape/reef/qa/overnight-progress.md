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

## September 22, 22:12 EDT � rock surface realism and geometry memory

- Replaced broad generated camouflage maps with free CC0 scanned coastal-stone diffuse, OpenGL normal and roughness maps by Dimitrios Savva / Poly Haven. Smaller purple/rose/olive crusts are baked into world-space vertex colors. Local 1K assets add 2.49 MB to initial download; no runtime external service or payment. Startup awaits textures as well as lighting.
- Compared reference, prior front/macro, new front/oblique/mobile/macro and planted desktop. Rock surface now has much finer natural grain and more restrained crust coloration. Silhouette still too smooth and stacked; coral stems and potted-looking polyp colonies remain conspicuously modeled. The scene is still far from photographic parity.
- Retained indexed anemone meshes instead of expanding every triangle. Verified every expanded position, normal, UV, color and flex attribute exactly matches prior version. Buffers decrease 28,717,200 to 7,621,920 bytes (73.5% smaller); triangles unchanged. Regression check enforces indexed buffers below 8 MB.
- check:reef passed: local ready 1464 ms vs 1526 ms prior, roughly 58�60 FPS (another macro browser briefly ran concurrently), 2,387,574 rendered triangles unchanged, 36/36 food eaten by 12.34 seconds; zero sampled proxy overlaps. Pause, exploration, views, lighting, fullscreen, identification, reload randomness and phone layout pass. No promise of these frame rates on other hardware or mobile networks. JS 179.74 KB gzip vs 178.72 KB; full reef network payload increases for scanned detail.
- Planted sync/release guards pass, shared assets and Hidden Reef unchanged. Publishing only jez237/GitHub after verified build and current-main checks.
- Next visible priority: replace spherical polyp support bowls with rock-conforming encrusting colonies; improve organic branching joins/corallites and plate tissue. Investigate scanned coral geometry only with verified free provenance. No photo background substitution.

## September 22, 22:47 EDT - six reference-led Blender marine fish

- User specifically requested photographic fish references and Blender models while continuing the overnight goal. Created six species references and six clean-flank edits with built-in GPT Image; saved exact prompts and sources in model-source. No paid API fallback, purchases or reset credits.
- Blender 5.2.1 generates separate traced species bodies, rounded fin membranes, paired independently animated pectorals, shallow eyes and conformed breathing gills. Editable marine-fish.blend and six self-contained GLBs retained. Removed old procedural fish templates; models share geometry/textures across 20 animals.
- Fixed dorsal attachment gaps, blocky dorsal outlines, duplicate painted pectorals, gill normal shading seams and eye winding during iterative macro/proof review. A new actual-GLB regression test covers closed bodies, finite attributes, embedded textures, paired anatomy and outward gill/eye normals. Fin flex is rooted; food contact uses modeled mouth coordinates.
- Final build/check: local ready 1454 ms vs prior 1464 ms; about 60 FPS; 36/36 particles eaten by 12.29 seconds; zero sampled proxy overlaps. Movement, independent fins/breathing, pause, views, lighting, full screen, identification, mobile layout and reload randomness pass. No claim of measured phone/network performance.
- 94,712 source triangles across six unique fish; reported scene render triangles 2,450,422 vs 2,387,574 (~2.6% increase). Six full-resolution embedded GLBs total about 5.5 MB additional first-load payload; JS 198.19 KB gzip vs 179.74 KB. Full detail preserved; shared resources and GPU body/fin movement retained.
- Front/oblique/mobile and all species macros inspected. Considerably better patterns/scales/fins, but strong highlights, projected-texture limitations and approximate shapes remain. Overall reef is still clearly short of the reference. Large next gaps: overly smooth coral stems, spherical polyp support bowls, fine corallite tissue, irregular live-rock silhouette and more natural reef lighting/sand.
- Planted release/sync and main deployment guards pass. Publish only jez237/GitHub; preserve all Hidden Reef and planted files. Existing overnight automation remains active through its 08:00 EDT cutoff; no competing task or loop created.

## September 22, 23:03 EDT - rock-attached polyp colonies

- Compared reference, mature planted desktop and prior reef. Replaced eleven spherical colony supports with directly attached and oriented polyps. No image background or paid assets.
- 560 polyps with varied sizes, tissue folds, recessed mouths and short columns. Zoanthids have two fringes totaling 3,072 tapered tentacles. Free ends move; stony colonies stay rigid. Anatomy informed by Museums Victoria (README link), motion illustrative.
- Rejected jagged connecting mat and 7013 ms raycast prototype. Removed mat, refined tissue, shortened stalks, densified colonies. Temporary triangle index matches 452 Three.js hits including overhangs/depth limits. No per-frame queries.
- Final check:reef passes geometry, feeding, proxy spacing, fish animation/breathing, pause, cameras, lighting, fullscreen, identification, mobile and randomness. 36 food particles eaten by 12.35 s; zero sampled overlaps. Local ready 1781 ms versus 1454 prior; about 60 FPS both. Other devices unmeasured.
- Render triangles 2,931,102 versus 2,450,422 (19.6% increase). Indexed geometry, one garden mesh, no new capture pass. JS 199.09 KB gzip versus 198.19; no new image/model payload.
- Inspected front, oblique, mobile and macro. Pot-like bases gone; colonies follow slopes. Still far from photographic: smooth branch joints, pale plate tissue, regular islands and lighting remain major gaps. Next: branching/plating tissue and growth shapes.
- Planted sync/release guards pass. Preserve Hidden Reef/planted; publish only jez237/GitHub after current-main checks. Existing loop continues to 08:00 EDT.

## September 22, 23:25 EDT - stony coral structure and tissue

- Reviewed reference, mature planted aquarium and previous reef. Refined branch taper, terminal caps, radial contours and shading seams; added sparse actual corallite cups. Plates have asymmetric folds, scallops and a narrow pale growth edge. No photo background, paid assets or service calls.
- Rejected the first oversized repeating cup texture after macro inspection. Reduced and varied it, then baked three full-resolution 512-pixel PNGs (0.87 MB total) instead of runtime synthesis. Deterministic generator retained. Hidden basal halves of terminal caps removed; visible rounded tips retained.
- Representative indexed colony/plate geometry uses 1,643,836 bytes versus prior 2,674,320 (38.5% less). Geometry regression checks indices, finite attributes, branch seam normals and outward plate faces. More detailed geometry raises reported rendered triangles to 3,671,150 from 2,931,102 (25.2%); no new capture or material draw pass. JS 199.63 KB gzip versus 199.09.
- Final check:reef passes all geometry, movement/feeding, proxy collision, pause, view, lighting, fullscreen, identification, mobile and randomized-start checks. All 36 particles eaten by 8.32 seconds; zero sampled proxy overlaps. Local ready 1653 ms versus 1781 prior; about 60 FPS both. These are local measurements, not a mobile/network performance promise.
- Inspected front, angle, coral macro and mobile screenshots. Finer branch/cup detail and richer ruffled plates are visible. Still far from photographic: bouquet-like branch arrangements, joins, stacked smooth islands, lighting and depth remain. Before-stony screenshots/results retained in qa. Next major priority: less regular live-rock silhouettes or underwater lighting/depth.
- Planted sync/release guards passed; publish only jez237/GitHub after current-main checks. Preserve all Hidden Reef/planted files. Existing loop remains active to its 08:00 EDT cutoff; reference target is not reached.

## September 22, 23:39 EDT - water light and sand relief

- Compared reference, mature planted scene and prior reef front/angle. Rebalanced overhead versus ambient/front illumination, added moving caustic-like light to lit material surfaces and bounded water-path color attenuation. Hooks compose with all existing fish/fin, polyp and anemone shaders. No emissive cave overlay, background photograph, paid assets or generation.
- Sand now has shallow actual geometric ripples/drifts. Retained all 1,600 rubble instances and their geometry, with finer sizes; positions sample the same surface. No new texture payload, draw group, capture pass or triangle. Reported triangles remain 3,671,150. JS 200.53 KB gzip versus 199.63 previously.
- Final check:reef passes movement, anatomy/breathing, feeding (36/36 by 8.31 seconds), sampled proxy collision, views, fullscreen, identification, mobile and randomized starts. Caustic time freezes with pause and strength decreases in blue hour. Fixed a status-text encoding regression caught in screenshot review and added an assertion. Local ready 1650 ms versus 1653 prior; about 60 FPS both, other devices unmeasured.
- Inspected final front, oblique, sand/coral close-up, blue hour and mobile. Caustics are legible on plate tissue and sand, exposed tops/recesses have more separation. Still not photographic: island silhouettes and regular branching silhouettes dominate the remaining gap; warm/cool material response and water-surface reflections could improve further. Optical coefficients and ripple shapes are artistic, not measured tank physics.
- Before-optics front/angle/results retained in qa. Planted release/sync guards passed. Publish only jez237/GitHub, preserving Hidden Reef and planted. Continue existing loop to 08:00 EDT; target not reached.

## September 22, 23:55 EDT - branching growth and rock-conforming coral bases

- Compared reference, mature planted screenshot and prior reef. Varied primary shoulders and lateral attachment positions, flared branch junctions, increased taper and rounded fine growth tips. Child radii now follow supporting-branch taper with a minimum thickness. Same branch count, corallite detail and merged material draw group retained.
- Replaced flattened spherical support discs with thin irregular rock-conforming tissue. Rejected an early stretched/jagged patch prototype after macro review; exclude steep discontinuities and graph-disconnected fragments. Fixed inward winding/degenerate center triangles caught by a new slope/ledge geometry regression. The surface index is built once and shared with polyp gardens.
- Final check:reef passes all geometry, feeding (36/36 by 12.29 seconds), sampled proxy collisions, independent motion/breathing, pause, optics/daylight, cameras, fullscreen, identification, mobile and randomness. Local ready 1675 ms versus 1650 prior, about 60 FPS both. Other hardware unmeasured.
- Representative indexed colony/plate buffers 1,659,484 bytes versus 1,643,836 prior (+0.95%); rendered scene triangles 3,685,416 versus 3,671,150 (+0.39%). JS 201.07 KB gzip versus 200.53. No new downloads beyond the bundle, image assets or capture passes.
- Final front/oblique/coral macro/mobile inspected. Less blunt primary growth and support-disc appearance. Still not photographic: broad uniform exposed rocks, repeated colony arrangements and insufficient layered coral coverage remain. Branch joins use overlapping flared surfaces, not watertight implicit fusion. Prior screenshots/results kept as before-growth evidence.
- Planted release/sync guards passed. Publish jez237/GitHub only after current-main check. Preserve Hidden Reef and planted. Existing overnight loop continues; reference target remains unmet. Next priority: irregular live-rock morphology and layered coverage rather than another fine texture-only pass.
