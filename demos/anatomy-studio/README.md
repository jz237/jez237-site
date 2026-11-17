# Anatomy Studio

Interactive exploded view of a complete human body: 2,270 selectable anatomical pieces across ten systems, plus seventeen nested
exploded views (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary system, face, aorta, pelvis, shoulder, larynx, foot). Built on the open [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) model
(CC BY-SA 4.0, see `ASSET-LICENSE.txt`). Published at https://jez237.com/demos/anatomy-studio/.

## Controls

- Slider / **Explode the body** / `E` — separate every system from the skeleton outward; skeleton stays as the axis.
- **Seventeen nested studies** (heart, lungs, spine, brain, skull, eye, hand, knee, rib cage, digestive tract, urinary, face, aorta, pelvis, shoulder, larynx, foot; keys `1`–`0` for the first ten, `H` `L` `S` `B` for the first four) — isolate that structure and explode it along its own anatomy. Paired structures (eye, hand, knee, shoulder, foot) have a Left / Right toggle (`&side=R`). “Label every piece” names all members of the open study.
- Finish: X-ray (default: the skeleton solid and every other system as clear glass with glowing edges), Organs & vessels (realistic with the bones, viscera, heart, brain, lymphoid organs, blood vessels, nerves and spinal cord and the skin of the face shown; the greater omentum is hidden so the bowel behind it shows, and so are the external genitalia), X-ray, Skin (opaque body: surface only until the body opens; loads the skin file on demand), Realistic, Colour-coded, Clay. Shadowing toggles ground-truth ambient occlusion; Zoom detail streams the undecimated tier (`assets/hi/`) for any piece that grows large on screen. Both are on by default on desktop, off on phones. Visible system filter, Labels, Auto orbit, Play sequence.
- Click a piece, pick it from the list, or type in the search box for a ranked list over the whole model (choosing a piece loads its system if needed): description (Z-Anatomy / Wikipedia), hierarchy path, size, triangles, merged sub-parts. Clicks pass through ghosted or see-through pieces (X-ray tissue, translucent skin, pleura) to the solid piece behind.
- **Focus** (`F`, or double-click a piece) frames it in context; **Isolate** shows it alone; **Hide** (`X`) removes it so you can dissect layer by layer, and **Show hidden** brings everything back.
- Key facts and related pieces: where a description states an origin, insertion, action, nerve supply or blood supply, that sentence is lifted out under its heading, and other pieces of the model named in the description become links. Nothing is authored; it all comes from the description text.
- **Cross-section** — slice along the sagittal, coronal or transverse plane, move the cut with the slider, flip to keep the other half. *Fill cuts* caps the cut faces of watertight, opaque pieces (about half the model: bones and muscles; organs with openings, vessels with open ends and sheets stay hollow). Ambient occlusion pauses while a section is active.
- **Systems shown** — a checkbox per system, to build views such as skeleton + nerves (`?hide=muscular,regions` in a link). **Pull apart** — explode every system, or only one, leaving the rest assembled.
- **Guided tours** — *Tour the ten systems* steps through the body one system at a time; inside a nested study, *Guided tour* visits its landmark pieces. `←` `→` move between stops, `Esc` ends.
- **Quiz** — two games, played from a card on the stage: *Find it* (the studio names a piece and you click it; three tries) and *Name it* (the studio shows a piece alone and you pick its name from four, which works from the keyboard). A region can be chosen; it asks about whatever is on screen. Tooltips and labels are off while a round runs.
- The camera can go underneath (skull base, soles of the feet); the floor and platform hide when it does. With the 3D view focused, arrow keys orbit and `+` / `-` zoom.
- The selected piece's name shows in a chip on the stage. On a phone a vertical swipe on the model scrolls the page; sideways drags orbit.
- A piece that borrows the description of the structure it belongs to (457 of them) says so, and a description's Wikipedia address is shown as a source link.
- **All parts on screen** — every loaded piece on one non-overlapping board.
- Shareable links: the address tracks the open study and side (`?assembly=knee&side=R`), the selected piece (`?piece=visceral/liver`), the finish (`?mode=xray`), the system filter (`?system=muscular`), the explode amount (`?x=60`) and the all-parts board (`?view=parts`). Opening or leaving a study adds a history entry, so Back works. `?stage=core|muscles|full` picks how much loads; `?debug` exposes the inspection hooks on `window.anatomyStudio`; `?render=always` turns off render-on-demand.
- Deep links: `?assembly=heart|lungs|spine|brain|skull|eye|hand|knee|ribcage|digestive`, `?view=parts`, `?stage=core|muscles|full`. Phones load the core stage (skeleton, ligaments, viscera, heart, brain) and offer a button for the rest.

## Files

`index.html` + `studio.js` (engine), `life.js` (the living body), `vitals.js` (pace controls, monitor, sound), `flow.js` (blood-flow particles), `labels.js` (label layout), `effects.js` (selection outline, skin depth pre-pass, bone cavity shading, platform reflection), `section.js` (cross-section plane), `quiz.js`, `tour.js`, `tour-notes.js` (text written for the tours), `facts.js` (key facts and related pieces from descriptions), `url-state.js` (shareable links), `assemblies.js` (nested explodes, dependency-free), `explode-rules.js` (whole-body vectors),
`materials.js` (per-system finishes), `parts-board.js`, `manifest.json` (every piece: id, system, hierarchy, side, region, centre, size),
`descriptions.json`, `assets/*.glb` (one meshopt-compressed file per system, each under 25 MiB), `manual.html`, `vendor/` (three.js 0.180).

## Life

With the body assembled (and in a study put back together) it moves; **Alive** in the explorer turns this off, as do `?life=0` and the reduced-motion setting. It starts off on phones, where drawing continuously costs battery (`?life=1` or the button turns it on). It eases out as the body starts to separate and every piece returns exactly to its place and size.

- **Breathing**, about 14 a minute: each rib swings rigidly about its joint with the spine, carrying the sternum forward and up; the diaphragm descends, the lungs lengthen and widen, the abdominal organs are pushed down and the belly wall moves out. Inhalation is quicker than exhalation, with a short rest.
- **Heartbeat**, about 70 a minute and slightly faster on the in-breath: the atria contract first, then the ventricles contract towards the apex, pulling the atria and the vessel roots down while the atria refill; the aorta and pulmonary trunk swell with the ejected blood.
- **Pulse**: each artery swells a little as the pressure wave reaches it, later with distance from the heart.
- **Gut**: a slow ripple travels along the stomach, intestines and ureters. After loading, each tube's vertices are given their distance along the tube (`tubePath` in `effects.js`, a walk over the surface from one end), so the wave runs down the tube coil after coil instead of straight across the piece.
- **Sway**: the whole body leans a few millimetres about the ankles, slowly and irregularly, more front-to-back than side-to-side, as anyone standing does; the calf and shin muscles thicken in turn to hold it. It is one rigid turn of the whole body, so every joint stays closed. It is dropped during a cross-section and inside a study.
- **Eyes**: both eyes jump together to a new point of gaze every second or two, with small corrections between, and blink every few seconds (the skin of the upper lids is drawn down over the eye in the shader).
- **Head and neck**: the head turns and nods a degree or two; each neck vertebra takes its share of the turn and the skin and muscles of the neck follow per vertex. Limb joints do not move.
- **Valves**: the leaflets hinge on their rings. The mitral and tricuspid valves are open while the ventricles fill and shut when they contract; the aortic and pulmonary valves the reverse.
- **Swallowing**: every twenty to forty seconds the larynx and hyoid rise about two centimetres and drop back, stretching the trachea.
- **Brain, veins, arms**: the brain swells very slightly with each pulse; the large veins narrow on the in-breath in the chest and neck and fill in the abdomen.

**Vitals** (explorer, section 05): At rest / Exercise presets, heart-rate and breathing-rate sliders, playback speed down to a tenth, and a scrubber that holds the heart anywhere in one beat with the phase named (atrial systole, isovolumetric contraction, ejection, isovolumetric relaxation, filling). A monitor on the stage draws an ECG and the breathing curve from the same clock as the motion (a textbook trace, not a recording); **Sound** plays the two heart sounds as the valves shut, and the breath; **Blood flow** shows points of light travelling through the heart and great vessels with the right direction and timing, in the X-ray finish (`flow.js`, `vitals.js`).

`life.js` holds the timing, the amplitudes and the method: each motion is a smooth displacement field over body space, sampled at every piece, so neighbours move together. Bone and solid organs are moved but never resized. The layers of the body wall (skin, muscle, fascia and what runs through them) and the lungs follow the same fields per vertex in their shaders, because they lie on each other with no gap and would otherwise show through one another. Those pieces carry a vertex attribute (`lifeLayer`), so every pass that draws them deforms them the same way: their own material, the shadow pass, ambient occlusion, the selection outline and the cross-section's caps. Amplitudes are those of quiet breathing and a resting heart, slightly enlarged to be visible; it is an illustration, not a measurement. While the body is alive the page keeps drawing, at half the display's rate when nothing else is moving, so the idle saving described below applies in full only when it is exploded, on the board, or switched off.

## Graphics

- **Selection** is marked by an outline (`effects.js`): a stencil mask of the piece's silhouette, then its back faces pushed out along the normals, so hollow pieces are outlined and not flooded. The colour tint is only a hint.
- **X-ray** soft tissue is drawn additively with a rim term (clear faces, glowing edges), which looks the same whatever the draw order. Each system has its own strength: muscle, skin and ligaments are faint so the organs, vessels and nerves inside them read. A click in X-ray skips the wrappings (skin, fascia) and takes an organ if one lies in front of the first bone, otherwise that bone, otherwise the smallest structure under the pointer.
- **See-through skin** gets a depth pre-pass, so only the nearest layer of skin is blended and limbs cannot show through each other in the wrong order.
- **Skin** light wraps further in red than in green and blue; **organs** differ in gloss (matte lung, glossy liver, slick gut) and share a broad mottle map; **bone** gets cavity shading computed from each mesh's curvature after loading.
- **Cut faces** carry a pattern per tissue (stipple for bone, lines for muscle, hatch otherwise), and ambient occlusion stays on while a section is active.
- **Effects** (one toggle, desktop only, `?fx=0` to start without): a soft reflection of the body in the platform, a light bloom on true highlights, and depth of field when a piece of a study is in focus. They are the first thing the automatic quality step-down switches off.
- **Motion**: the body explodes in layers (skin first, skeleton last; every piece still arrives at 100% and reassembly is exact), camera moves swing around the target, and the opening view pushes in.

## Rendering and loading

The studio draws a frame only while something is moving and for a moment after any input, so an idle page costs no GPU time. The files of a stage download in parallel and attach in order; the body appears as soon as the skeleton is in. The opening X-ray finish shows every system, so a desktop visit loads all of them. A link that opens in Organs & vessels (`?mode=organs`) loads only what that finish shows and leaves the muscles (10.7 MB, a third of the download) until a finish, system, search result, tour or the all-parts board needs them. Piece numbers and explode directions come from the manifest's order, not from load order. If frames stay under about 20 fps while something is moving, the effects, then ambient occlusion, then shadows, then resolution are switched off (a note says so; `?quality=fixed` disables this, and using the Shadowing button does too). three.js is vendored minified (`vendor/three.*.min.js`, r180). A lost WebGL context is waited out and restored rather than treated as fatal.

## Version stamps

Every local URL carries a content hash: module imports, stylesheets, the JSON files, and the `.glb` models (via `v` in `manifest.json`). After editing anything in this folder run `node scripts/anatomy-studio/stamp.mjs`; `--check` fails if a stamp is stale. Do not edit `?v=` values by hand. `assets/*` is served `immutable` (see `_headers`), which is safe only because of these stamps.

## Rebuilding the assets

Body regions are assigned by height, then corrected for the organs under the diaphragm (liver, stomach, spleen, kidneys and the vessels and nodes named for them are abdominal even though they sit level with the lower ribs).

See `../../scripts/anatomy-studio/README.md`: `fetch-models.sh` → `run-exports.sh` (Blender 4.5, headless) → `node prepare.mjs` → `node check-assemblies.mjs` → `node verify.mjs`.
Pieces keep Z-Anatomy's Terminologia Anatomica names. Every bone, tooth, cartilage, muscle, organ, lobe, bronchus, heart and
brain structure is an individual piece; branches of vessels and nerves below the fourth level of their tree, small ligaments,
lymph-node groups, fasciae/bursae and skin sub-regions are merged into their parent structure. Geometry is decimated to about
4.7 M triangles in total (35 MB, plus a 9 M-triangle zoom tier that streams per system); vessels and nerves are individual to the seventh and sixth levels of their trees. This is a teaching model, not a clinical reference.
