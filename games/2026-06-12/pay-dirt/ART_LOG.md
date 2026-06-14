# Pay Dirt — autonomous art-polish log

Target: AAA hand-painted temple-mine platformer (Spelunky 2 / Lode Runner Legacy / Ori),
crisp outlined pixel sprites over a painterly bloomed cave. Loop: assess→critique→implement→verify→commit.

## Baseline (iter 0) — axis scores /10
- silhouette/readability: 7
- color harmony & contrast: 6
- lighting cohesion: 6
- background depth & parallax: 6
- animation life: 5
- prop density & variety: 6
- tile detail & seams: 7
- HUD/menu polish: 7
- overall cohesion: 7
- juice: 6

### Baseline weaknesses (worst first)
1. Overhead BAR/pipe tile reads as a faint dotted line — weakest asset, poor readability.
2. Scene lighting is flat & even — no drama; static god-rays; lit areas don't pop; weak contrast.
3. Background is static and identical every level — no ambient motion (mist/drift), no per-level variety.
4. Gold is a tiny bright dot — wants a richer faceted gem + moving specular glint.
5. No FOREGROUND framing — reference frames the scene with dark near elements; ours has none.
6. Animation life thin — minimal frames; no blink/secondary motion; no water shimmer.
7. Crystals/props sparse & small; platform tone repetitive.
8. Combo/juice could be punchier.

## Iterations
### Iter 1 — DONE. (a) brass bar/pipe tile w/ bolt collars + bright sheen (was a beaded line → solid pipe), (b) cinematic vignette + warm-key/cool-shadow soft-light grade, (c) animated atmosphere: breathing+drifting god-ray shafts & drifting mist blobs, (d) faceted gold gem w/ bright core, (e) per-level `overlay` hue tint so claims differ. Verified: all gameplay green, 0 errors, perf<6ms.
- New scores: lighting 6→8, bg depth/parallax 6→7, tile detail 7→8, color 6→7, animation life 5→6, juice 6→7.

### Iter 2 — DONE. (a) under-ledge CONTACT SHADOWS (cached strip in the air cell beneath every platform → real grounding/depth), (b) per-cell tonal variation on stone (kills flat repetition), (c) richer background crystals (9 clusters, bigger, brighter cores + glints + double glow). Verified all green, 0 errors, perf 0.52ms.
- New scores: bg depth/parallax 7→8, tile detail 8→8.5, prop density 6→7, overall cohesion 7→8.
- Biggest remaining gaps now: character animation life (still thin at scale), foreground framing layer, gem-collect juice, menu/HUD richness, and water/waterfall motion.

### Iter 3 — picks: (a) foreground framing layer (dark, slightly blurred near rocks/foliage at screen edges + bottom corners, NOT obscuring play), (b) animated waterfall shimmer in bg, (c) gold-collect juice (sparkle burst + score-pop scale), (d) subtle platform top rim-light from the warm key.
