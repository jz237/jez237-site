# Anatomy Studio

Interactive exploded view of a complete human body: 2,270 selectable anatomical pieces across ten systems, plus seventeen nested
exploded views (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary system, face, aorta, pelvis, shoulder, larynx, foot). Built on the open [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) model
(CC BY-SA 4.0, see `ASSET-LICENSE.txt`). Published at https://jez237.com/demos/anatomy-studio/.

## Controls

- Slider / **Explode the body** / `E` — separate every system from the skeleton outward; skeleton stays as the axis.
- **Seventeen nested studies** (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary, face, aorta, pelvis, shoulder, larynx, foot; keys `1`–`0` for the first ten, `H` `L` `S` `B` for the first four) — isolate that structure and explode it along its own anatomy. Paired structures (eye, hand, knee, shoulder, foot) have a Left / Right toggle (`&side=R`). “Label every piece” names all members of the open study.
- Finish: X-ray (default), Skin (opaque body: surface only until the body opens; loads the skin file on demand), Realistic, Organs & vessels (realistic with only the viscera, heart, brain, lymphoid organs and blood vessels shown; external genitalia hidden), Colour-coded, Clay. Shadowing toggles ground-truth ambient occlusion; Zoom detail streams the undecimated tier (`assets/hi/`) for any piece that grows large on screen. Both are on by default on desktop, off on phones. Visible system filter, Labels, Auto orbit, Play sequence.
- Click a piece or pick it from the list: description (Z-Anatomy / Wikipedia), hierarchy path, size, triangles, merged sub-parts. Isolate to frame it alone.
- **All parts on screen** — every loaded piece on one non-overlapping board.
- Deep links: `?assembly=heart|lungs|spine|brain|skull|eye|hand|knee|ribcage|digestive`, `?view=parts`, `?stage=core|muscles|full`. Phones load the core stage (skeleton, ligaments, viscera, heart, brain) and offer a button for the rest.

## Files

`index.html` + `studio.js` (engine), `assemblies.js` (nested explodes, dependency-free), `explode-rules.js` (whole-body vectors),
`materials.js` (per-system finishes), `parts-board.js`, `manifest.json` (every piece: id, system, hierarchy, side, region, centre, size),
`descriptions.json`, `assets/*.glb` (one meshopt-compressed file per system, each under 25 MiB), `manual.html`, `vendor/` (three.js 0.180).

## Rebuilding the assets

See `../../scripts/anatomy-studio/README.md`: `fetch-models.sh` → `run-exports.sh` (Blender 4.5, headless) → `node prepare.mjs` → `node check-assemblies.mjs` → `node verify.mjs`.
Pieces keep Z-Anatomy's Terminologia Anatomica names. Every bone, tooth, cartilage, muscle, organ, lobe, bronchus, heart and
brain structure is an individual piece; branches of vessels and nerves below the fourth level of their tree, small ligaments,
lymph-node groups, fasciae/bursae and skin sub-regions are merged into their parent structure. Geometry is decimated to about
4.7 M triangles in total (35 MB, plus a 9 M-triangle zoom tier that streams per system); vessels and nerves are individual to the seventh and sixth levels of their trees. This is a teaching model, not a clinical reference.
