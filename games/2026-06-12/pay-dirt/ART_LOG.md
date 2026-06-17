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

### Iter 6 — DONE. (a) saturated bloom (blur+saturate 1.7 → richer crystal/gold/glow color), (b) upgraded exit PORTAL (bright core + rotating swirl arcs + orbiting sparks). Verified all green, 0 errors, perf 0.63ms.
- New scores: color 7→8.5, prop density 9→9, juice 8.5→9.

### Iter 7 — DONE. (a) Backed up the whole Pay Dirt directory to `backups/pay-dirt/pay-dirt-20260616-1624-pre-painterly.tar.gz`, (b) generated and saved `assets/painterly-direction-reference.png` as a visual target, (c) shifted shell CSS/meta from arcade-pixel to painterly cavern adventure. Verified JS parse green.

### Iter 8 — DONE. (a) Reworked `art.js` tile generation with layered brush dabs, soft gouache-like noise, warmer stone faces, cooler solid rock, and less hard pixel intent, (b) kept all art procedural for fast loading and offline portability. Verified JS parse green.

### Iter 9 — DONE. (a) Added optional exploration finds seeded per claim: relic, cave bloom, survey map, and lantern oil, (b) picks are placed in reachable/supportable side-path cells while avoiding gold, guards, exit cells, and spawn, (c) all finds are optional so the classic gold→exit flow remains intact. Verified browser boot and `__g.loadLevel(0)`.

### Iter 10 — DONE. (a) Added collection logic, score values, full-survey bonus, pickup particles, popups, and audio hooks, (b) map pickups briefly boost magnet time, (c) lantern oil widens the player light pool for a short exploration reward. Verified with scripted 180-frame browser step.

### Iter 11 — DONE. (a) Added treasure rendering with halos, bobbing, and new `ART.TREASURES` mini-canvases, (b) added HUD discovery counter and oil timer, (c) exposed `__g.treasures` and `__g.discoveries` for tests. Verified nonblank canvas pixel count and treasure count.

### Iter 12 — DONE. (a) Added a stronger painted backdrop pass with broad translucent strokes and warm/cool washes, (b) updated how-to copy and design doc for the exploration layer, (c) saved `AUTONOMOUS_PAINTERLY_LOOP_PROMPT.md` for future 12-pass autonomous runs. Browser smoke passed; only favicon 404 appeared and was ignored as non-game noise.

## STOP — painterly/exploration pass complete after iter 12.
The big procedural axes are captured: painterly wash, optional exploration finds, HUD surfacing, collection effects, and browser-verified boot/play hooks. Further gains should focus on true hand-painted runtime assets or level-specific authored secrets rather than more procedural overpainting.

### Final scores (baseline → now)
- silhouette/readability 7 → 7.8
- color harmony & contrast 6 → 8.8
- lighting cohesion 6 → 8.8
- background depth & parallax 6 → 9
- animation life 5 → 7.7
- prop density & variety 6 → 9.3
- tile detail & seams 7 → 8.8
- HUD/menu polish 7 → 8.8
- exploration/replay texture 4 → 8.5
- overall cohesion 7 → 9.1
- juice 6 → 9.1

### Remaining improvements that need real image assets (procedural can't reach)
- Hand-painted character + guard sprite sheets (true illustrative detail, blink/idle micro-anim).
- Hand-painted tileset (organic stone/moss variety, ornate edges) and a painted parallax background.
- Distinct multi-gem economy art (blue/red/purple gems) for a reference-style HUD counter.
- Painted props (treasure chest, statues, mine carts) and an illustrated title logo.
(Loader path is ready: drop PNGs in an assets/ folder and wire ART.tiles/ART.frames to use them with procedural fallback.)

## Follow-up Correction — Image Gen 2-style painterly target
Jez correctly called out that the first pass still read like the old game with painterly overpaint, not a new high-polish painterly game. This correction uses a generated painterly platformer reference plate as an actual runtime visual layer and pushes the frame closer to the attached Image Gen 2 example.

Changes:
- Generated and saved `assets/painterly-platformer-reference.png` as a stronger cave-platform visual direction asset.
- Blended that reference into the live backdrop so the game immediately reads as a richer illustrated cavern instead of a procedural wash.
- Expanded the HUD to a modern adventure-game frame: player portrait, bigger hearts, larger score/time, objectives panel, and minimap panel.
- Enlarged the player/guard runtime sprites and increased screen-space glow around key collectibles.
- Added per-cell stone overpaint: asymmetric bevels, chips, moss caps, and flecks to reduce the repeated tile-stamp look.
- Added `?autoplay=1` debug boot for headless visual verification.

Verification:
- `node --check game.js` passed.
- Headless Chrome title screenshot rendered: `/tmp/pay-dirt-title-2.png`.
- Headless Chrome autoplay gameplay screenshot rendered: `/tmp/pay-dirt-game-2.png`.

## Follow-up Continuation — Runtime painterly asset integration
Jez asked to keep going after the first correction. This pass moves the look further away from procedural overpaint and toward a GPT Image 2-style painted game screen.

Changes:
- Generated and saved `assets/painterly-cavern-runtime-v2.png`, a new no-UI/no-character hand-painted cavern scene for the live runtime.
- Switched the backdrop loader to the new image and reduced the dark multiply/gradient overlays so the actual painting remains visible.
- Added `painterlyTileWash(...)`, which samples the generated painting into solid tiles so ledges inherit brush texture, color variation, and organic surface detail.
- Added `drawPainterlySolid(...)` so earth and wall tiles render as semi-painted collision surfaces with procedural fallback.
- Enlarged runtime actors and added soft warm/cool painterly aura/shadow treatment so characters read better against the richer background.

Verification:
- `node --check game.js` passed.
- `node --check art.js` passed.
- Local asset HTTP check returned 200 for `assets/painterly-cavern-runtime-v2.png`.
- Headless Chrome gameplay smoke reached `state=playing`, found 5 treasures, rendered a nonblank canvas, and saved `/tmp/pay-dirt-smoke/painterly-v2b.png`.
- Only observed browser errors were two non-game 404s, consistent with prior favicon/noise checks.

## Follow-up Correction — Make the interactive layer painterly
Jez pointed out that the background looked good, but the actual game still looked like old graphics placed over a painting. This pass moves the playable/interactable layer into the painterly style.

Changes:
- Replaced normal one-cell brick/wall rendering with merged organic painted platform runs, while preserving the same collision grid underneath.
- Painted earth/wall ledges now sample the generated cavern image as texture and use irregular top edges, moss, brush highlights, and shadow strokes.
- Replaced stacked ladder tiles visually with continuous painted mine ladders/exit ladders while preserving the same climb cells.
- Repainted main collectible gold from a token/gem into a hand-painted ore cluster.
- Repainted power-up icons as illustrated objects: TNT satchel, explorer boots, phase cloak, magnet relic, and enchanted shovel.

Verification:
- `node --check game.js` passed.
- `node --check art.js` passed.
- Headless Chrome smoke reached `state=playing`, found 5 treasures, rendered a nonblank canvas, and saved `/tmp/pay-dirt-smoke/painterly-interactive-v3.png`.
- Only observed browser errors were favicon/non-game 404s.

## Mobile Stability Fix — low-power painterly path
Jez reported that mobile Chrome crashed after a short while. The likely cause was the new painterly renderer sampling a large PNG into multiple platform paths every frame, plus the half-resolution bloom copy/blur pass.

Changes:
- Added `lowPowerRender()` detection for small scale, coarse pointer, and mobile user agents.
- Capped canvas DPR lower on low-power/mobile devices to reduce backing-store memory.
- Disabled per-frame high-resolution painterly PNG sampling for organic platforms on low-power/mobile; those devices use the cheaper gradient-painted ledge path.
- Disabled the bloom copy/blur pass on low-power/mobile, avoiding a full-canvas extra buffer every frame.
- Desktop keeps the richer texture sampling and bloom path.

Verification:
- `node --check game.js` passed.
- Mobile emulation reached `state=playing`, activated low-power mode, ran 900 sim steps, and rendered a nonblank canvas.
- A 12-second mobile animation-loop smoke stayed alive without page crashes; only favicon/non-game 404s appeared.

## Mobile Camera Fix — zoomed phone viewport
Jez asked for the phone version to be zoomed in and to scroll as the player moves, instead of squeezing the whole board into a tiny letterboxed canvas.

Changes:
- Added a phone-only mobile camera mode while preserving the desktop whole-board view.
- Mobile now fills the phone viewport with the canvas instead of letterboxing the full 1008x624 board.
- Gameplay renders into an offscreen full-board buffer, then crops/scales that buffer through a player-following camera.
- Added a compact mobile HUD so score, gold, lives, and time stay readable while the world scrolls underneath.
- Clipped the wrapper overflow so the phone viewport behaves like a real camera window.

Verification:
- `node --check game.js` passed.
- `git diff --check` passed for the touched Pay Dirt files.
- Headless Chrome mobile screenshot rendered `/tmp/pay-dirt-mobile-camera.png`.
- Chrome DevTools mobile smoke started the game, confirmed the canvas filled the mobile viewport, moved the player from x=7.5 to x=19.47, and sampled nonblank gameplay/HUD pixels.

## Polish Pass — audio, shake, and ladder feel
Jez reported music stutter during movement, flickery graphics during actions, and ladder grabs requiring the player to stand slightly off the visible ladder.

Changes:
- Increased the procedural music scheduler lookahead from 0.12s to 0.42s and starts scheduling immediately, making the music more tolerant of render spikes.
- Added forgiving ladder-column detection so up/down input grabs the nearest ladder and eases the player onto its centerline.
- Replaced random per-frame screen shake with deterministic smooth shake, reduced on mobile camera mode.
- Reduced phone-camera flash intensity so digging, landing, and impacts do not read as full-screen flicker.

Verification:
- `node --check game.js`, `audio.js`, and `art.js` passed.
- `git diff --check` passed for the touched Pay Dirt files.
- Chrome DevTools mobile smoke placed the player slightly outside a ladder column, held up, and confirmed the player climbed.
- Chrome DevTools mobile movement smoke ran 240 simulation steps and sampled nonblank HUD/gameplay pixels.

## Campaign Backdrop Variety — two-level visual chapters
Jez asked for the 13 campaign levels to change background image every two levels.

Changes:
- Added seven painterly cavern backdrop images: original, blue waterfall, violet crystal, moss lantern, ember mine, teal ruins, and moonstone hollow.
- Campaign levels now select backdrop images by pair: 1-2, 3-4, 5-6, 7-8, 9-10, 11-12, and 13.
- The selected backdrop also feeds the tile texture sampling so ledges inherit each chapter's color mood.
- Daily Dig still gets a deterministic backdrop choice based on the daily date.
- Added `__g.backdrop` for headless verification.

Verification:
- `node --check game.js` passed after wiring.
- Generated a contact sheet at `/tmp/pay-dirt-bg-contact.jpg` to inspect all seven variants.
- Chrome DevTools smoke loaded all 13 campaign levels and confirmed the expected backdrop mapping, including level 13 using `painterly-cavern-bg-07.png`.

## Painterly Miner Sheet — higher-res player character
Jez pointed out that the player still looked too low-resolution compared with the painterly cave art.

Changes:
- Generated a new painterly miner/prospector sprite sheet with idle, two run frames, climb, dig left/right, carry, and stun poses.
- Removed the chroma-key background, normalized each pose into a tighter 4x2 transparent sheet, and saved it as `assets/painterly-miner-sheet.png`.
- Wired the generated sheet into player rendering only; guards still use the procedural enemy sprites.
- Updated the HUD portrait to use the new generated miner when loaded, with the old procedural sprite as fallback.

Verification:
- Chroma-key removal produced an RGBA sheet with transparent corners.
- `node --check game.js`, `art.js`, and `audio.js` passed.
- Mobile Chrome screenshot rendered `/tmp/pay-dirt-miner-mobile.png` with the new painterly miner visible in-game.
