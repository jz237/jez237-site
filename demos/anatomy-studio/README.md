# Anatomy Studio

Interactive exploded view of a complete human body: 1,897 selectable anatomical pieces across ten systems, plus four nested
exploded views (heart, lungs, spine, brain). Built on the open [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) model
(CC BY-SA 4.0, see `ASSET-LICENSE.txt`). Published at https://jez237.com/demos/anatomy-studio/.

## Controls

- Slider / **Explode the body** / `E` — separate every system from the skeleton outward; skeleton stays as the axis.
- **Heart · Lungs · Spine · Brain** (`H` `L` `S` `B`) — isolate that structure and explode it along its own anatomy.
- Finish: Realistic, Colour-coded, X-ray, Clay. Visible system filter, Labels, Auto orbit, Play sequence.
- Click a piece or pick it from the list: description (Z-Anatomy / Wikipedia), hierarchy path, size, triangles, merged sub-parts. Isolate to frame it alone.
- **All parts on screen** — every loaded piece on one non-overlapping board.
- Deep links: `?assembly=heart|lungs|spine|brain`, `?view=parts`, `?stage=core|muscles|full`. Phones load the core stage (skeleton, ligaments, viscera, heart, brain) and offer a button for the rest.

## Files

`index.html` + `studio.js` (engine), `assemblies.js` (nested explodes, dependency-free), `explode-rules.js` (whole-body vectors),
`materials.js` (per-system finishes), `parts-board.js`, `manifest.json` (every piece: id, system, hierarchy, side, region, centre, size),
`descriptions.json`, `assets/*.glb` (one meshopt-compressed file per system, each under 25 MiB), `manual.html`, `vendor/` (three.js 0.180).

## Rebuilding the assets

See `../../scripts/anatomy-studio/README.md`: `fetch-models.sh` → `run-exports.sh` (Blender 4.5, headless) → `node prepare.mjs` → `node check-assemblies.mjs` → `node verify.mjs`.
Pieces keep Z-Anatomy's Terminologia Anatomica names. Every bone, tooth, cartilage, muscle, organ, lobe, bronchus, heart and
brain structure is an individual piece; branches of vessels and nerves below the fourth level of their tree, small ligaments,
lymph-node groups, fasciae/bursae and skin sub-regions are merged into their parent structure. Geometry is decimated to about
2.2 M triangles in total. This is a teaching model, not a clinical reference.
