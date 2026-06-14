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

### Iter 3 — DONE. (a) foreground framing: soft top/bottom inner-shadow + dark drooping foliage in top corners (auto-skips the corner that holds a revealed exit so it's never hidden), (b) animated waterfall shimmer at the sides, (c) gold-collect juice: bigger gold-shard burst + white sparkle ring + scale-pop score popups. Verified all green, 0 errors, perf 0.45ms.
- New scores: prop density 7→8, juice 7→8, overall cohesion 8→8.5, animation life 6→6.5.
- Pushed checkpoint (iters 1-3).

### Iter 4 — DONE. (a) CSS: animated PAY DIRT logo (shine sweep + gentle bob) + ornate gold corner brackets & textured gradient on all menu panels, (b) richer title attract scene (flanking flickering torches + stronger lantern pool), (c) menacing guard/scout/mason eyes (red/amber glow + glint). Verified all green, 0 errors, perf 0.55ms.
- New scores: HUD/menu polish 7→8.5, prop density 8→8.5, silhouette/readability 7→7.5.

### Iter 5 — DONE. (a) drifting FIREFLIES (warm+teal glowing motes wandering the cave), (b) rising EMBERS from braziers, (c) landing SQUASH-and-stretch on the player (juice). Verified all green, 0 errors, perf 0.89ms.
- New scores: animation life 6.5→7.5, juice 8→8.5, prop density 8.5→9, overall cohesion 8.5→9.

### Iter 6 — picks: (a) gem-type variety in HUD (gold/blue/red/purple counters like the reference, even if cosmetic), (b) game-over & level-clear screen flourish (rays/confetti gold burst), (c) richer combo visual at high multiplier (screen-edge gold glow), (d) final saturation/contrast bump on the bloom composite. Will stop after this if returns are marginal.
