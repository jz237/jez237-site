# Anatomy Studio

Interactive exploded view of a complete human body: 2,270 selectable anatomical pieces across ten systems, plus seventeen nested
exploded views (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary system, face, aorta, pelvis, shoulder, larynx, foot). Built on the open [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) model
(CC BY-SA 4.0, see `ASSET-LICENSE.txt`). Published at https://jez237.com/demos/anatomy-studio/.

## Controls

- Slider / **Explode the body** / `E` — separate every system from the skeleton outward; skeleton stays as the axis.
- **Seventeen nested studies** (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary, face, aorta, pelvis, shoulder, larynx, foot; keys `1`–`0` for the first ten, `H` `L` `S` `B` for the first four) — isolate that structure and explode it along its own anatomy. Paired structures (eye, hand, knee, shoulder, foot) have a Left / Right toggle (`&side=R`). “Label every piece” names all members of the open study.
- Finish: Organs & vessels (default: realistic with the bones, viscera, heart, brain, lymphoid organs, blood vessels, nerves and spinal cord and the skin of the face shown; the greater omentum is hidden so the bowel behind it shows, and so are the external genitalia), X-ray, Skin (opaque body: surface only until the body opens; loads the skin file on demand), Realistic, Colour-coded, Clay. Shadowing toggles ground-truth ambient occlusion; Zoom detail streams the undecimated tier (`assets/hi/`) for any piece that grows large on screen. Both are on by default on desktop, off on phones. Visible system filter, Labels, Auto orbit, Play sequence.
- Click a piece, pick it from the list, or type in the search box for a ranked list over the whole model (choosing a piece loads its system if needed): description (Z-Anatomy / Wikipedia), hierarchy path, size, triangles, merged sub-parts. Clicks pass through ghosted or see-through pieces (X-ray tissue, translucent skin, pleura) to the solid piece behind.
- **Focus** (`F`, or double-click a piece) frames it in context; **Isolate** shows it alone; **Hide** (`X`) removes it so you can dissect layer by layer, and **Show hidden** brings everything back.
- Key facts and related pieces: where a description states an origin, insertion, action, nerve supply or blood supply, that sentence is lifted out under its heading, and other pieces of the model named in the description become links. Nothing is authored; it all comes from the description text.
- **Cross-section** — slice along the sagittal, coronal or transverse plane, move the cut with the slider, flip to keep the other half. Cut faces are not capped; ambient occlusion pauses while a section is active.
- **Guided tours** — *Tour the ten systems* steps through the body one system at a time; inside a nested study, *Guided tour* visits its landmark pieces. `←` `→` move between stops, `Esc` ends.
- **Quiz** — the studio names a piece and you find it on the body; three tries, then it shows you. Tooltips and labels are off while a round runs.
- The camera can go underneath (skull base, soles of the feet); the floor and platform hide when it does.
- **All parts on screen** — every loaded piece on one non-overlapping board.
- Shareable links: the address tracks the open study and side (`?assembly=knee&side=R`), the selected piece (`?piece=visceral/liver`), the finish (`?mode=xray`), the system filter (`?system=muscular`), the explode amount (`?x=60`) and the all-parts board (`?view=parts`). Opening or leaving a study adds a history entry, so Back works. `?stage=core|muscles|full` picks how much loads; `?debug` exposes the inspection hooks on `window.anatomyStudio`; `?render=always` turns off render-on-demand.
- Deep links: `?assembly=heart|lungs|spine|brain|skull|eye|hand|knee|ribcage|digestive`, `?view=parts`, `?stage=core|muscles|full`. Phones load the core stage (skeleton, ligaments, viscera, heart, brain) and offer a button for the rest.

## Files

`index.html` + `studio.js` (engine), `labels.js` (label layout), `section.js` (cross-section plane), `quiz.js`, `tour.js`, `facts.js` (key facts and related pieces from descriptions), `url-state.js` (shareable links), `assemblies.js` (nested explodes, dependency-free), `explode-rules.js` (whole-body vectors),
`materials.js` (per-system finishes), `parts-board.js`, `manifest.json` (every piece: id, system, hierarchy, side, region, centre, size),
`descriptions.json`, `assets/*.glb` (one meshopt-compressed file per system, each under 25 MiB), `manual.html`, `vendor/` (three.js 0.180).

## Rendering and loading

The studio draws a frame only while something is moving and for a moment after any input, so an idle page costs no GPU time. The files of a stage download in parallel and attach in order; the body appears as soon as the skeleton is in. A lost WebGL context is waited out and restored rather than treated as fatal.

## Version stamps

Every local URL carries a content hash: module imports, stylesheets, the JSON files, and the `.glb` models (via `v` in `manifest.json`). After editing anything in this folder run `node scripts/anatomy-studio/stamp.mjs`; `--check` fails if a stamp is stale. Do not edit `?v=` values by hand. `assets/*` is served `immutable` (see `_headers`), which is safe only because of these stamps.

## Rebuilding the assets

See `../../scripts/anatomy-studio/README.md`: `fetch-models.sh` → `run-exports.sh` (Blender 4.5, headless) → `node prepare.mjs` → `node check-assemblies.mjs` → `node verify.mjs`.
Pieces keep Z-Anatomy's Terminologia Anatomica names. Every bone, tooth, cartilage, muscle, organ, lobe, bronchus, heart and
brain structure is an individual piece; branches of vessels and nerves below the fourth level of their tree, small ligaments,
lymph-node groups, fasciae/bursae and skin sub-regions are merged into their parent structure. Geometry is decimated to about
4.7 M triangles in total (35 MB, plus a 9 M-triangle zoom tier that streams per system); vessels and nerves are individual to the seventh and sixth levels of their trees. This is a teaching model, not a clinical reference.
