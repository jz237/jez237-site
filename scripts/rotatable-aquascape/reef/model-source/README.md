# Marine fish reference and Blender sources

## Reef options — October 19, 2026

Six more species (`strigosus`, `vulpinus`, `bispinosa`, `loricula`,
`hexataenia`, `cinctus`) follow the black tang's route, now generalized:
`prepare_plates.py <species> [--edit <raw edit>]` composites a clean flank and
pads textures (backdrop removed by a fitted color model), and
`trace_profiles.py [species]` writes profiles from the hand-read landmarks in
`references/trace-specs.json`, with review overlays in `proofs/`. Rebuild one:

```powershell
python reef/model-source/trace_profiles.py loricula
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python reef/model-source/build_marine_fish.py -- --only loricula
```

Prompts and request ids: `references/reef-options-prompts.md` and
`references/fal-requests.json`. Each species' editable `<species>.blend` is saved
beside the build script.

Plate preparation settings (rerun after a trace change that `--tint-fins` reads):

```powershell
python reef/model-source/prepare_plates.py vulpinus --distance 16 --tint-fins --extend-patch 2116,2190,810,870
python reef/model-source/prepare_plates.py strigosus --saturation 1.5
python reef/model-source/prepare_plates.py loricula   # likewise bispinosa, hexataenia, cinctus
```

Close-up pass (October 19, 2026), against the user's foxface reference sheet:

- Foxface snout traced as a taper to small pursed lips (`lipRings`, with an
  optional fourth value: the ring's height ratio, below 1 a pressed slit). The
  dark lips come from `--extend-patch`, which repeats the skin behind the
  plate's pale snout tip over it. The dome covers the whole iris, centred on
  the pupil.
- Its back and belly near the tail follow the real peduncle: the plate's soft
  dorsal and anal lobes overhang it with backdrop between, which the old trace
  had counted as body (a deep peduncle with blue-gray patches).
  `--tint-fins` recolors dorsal, anal and caudal membranes from the dark backdrop's
  olive to the body's yellow; short `dorsalFade`/`analFade` keep the lobes'
  near-vertical trailing margins.
- `finDepth: 0` (foxface, coral beauty, flame angel, kole tang) centres the tail
  fin in the peduncle and drops the flat tail cap, whose normals shaded a dark
  band where the fin begins; these species' unpaired fins render opaque.
- `bridgeMargin` widens the top-view spans skipped for spread pectorals and
  eyes, and fills each gap with a slope-matched cubic plus light smoothing. A
  sample just outside a span had made a one-column width spike: the vertical
  line on the coral beauty (and flame angel, goby, kole tang). `width` was
  rescaled by the old/new peak so overall thickness is unchanged.

## Black tang — October 19, 2026

`rostratum.glb` is *Zebrasoma rostratum*, authored from fal `openai/gpt-image-2`
plates generated at the user's request: a lateral plate, a masked clean-flank
edit, and dorsal and front views. `references/rostratum-prompts.md` has every
prompt, the rejected first plate and the modeling choices;
`references/fal-requests.json` has the request ids. Rebuild only this model:

```powershell
python reef/model-source/prepare_plates.py rostratum --luminance 105 --paint-scalpel 626,836,42,16  # add --edit <raw> after a new edit
python reef/model-source/trace_rostratum.py
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python reef/model-source/build_marine_fish.py -- --only rostratum
```

Its profile uses optional keys that other species leave unset, so their builds
are unchanged: `texture`/`skinTexture` (edge-padded copies of plates shot on
gray), `thickness` (traced width along the body), `crossPower` (lens-shaped
section), `dorsalFade` and `rings`/`sides` (26,672 source triangles). At runtime
the near-black skin gets brighter albedo, relief from its own scale texture and
a soft velvet sheen. `rostratum.blend` is the editable source.

## Golden butterflyfish replacement — September 27, 2026

The former yellow tang slot now loads `semilarvatus.glb`, a separately authored
*Chaetodon semilarvatus* model, and identifies it as Golden butterflyfish.
`semilarvatus.blend` is the editable Blender 5.2 source. Rebuild only this model:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python reef/model-source/build_marine_fish.py -- --only semilarvatus
```

Its traced rounded body, reduced sail profile, short snout, fine orange stripes,
blue cheek patch and independent paired pelvic fins come from the generated
reference and clean-flank texture. The runtime preserves traveling body waves,
independent fins, breathing, varied cruising, inspection pauses and 3D routing.
The previous yellow assets remain as historical sources but are not loaded.
See `references/semilarvatus-prompts.md` for generation provenance. This is an
artistic reconstruction, not a measured specimen. Natural-history reference:
https://doris.ffessm.fr/Especes/Chaetodon-semilarvatus-Poisson-papillon-jaune-masque-5223
The species can feed on coral; the display is not a coral-safe stocking guide.

Six photorealistic-style reference images were created with the built-in GPT Image tool: palette surgeonfish, yellow tang, ocellaris clownfish, female lyretail anthias, blue-green chromis and royal gramma. These are generated artistic references, not photographs of measured specimens. No paid API fallback, purchases or third-party paid assets were used.

`references/prompts.json` contains all six generation prompts and the clean-flank edit prompt. Original images are `<species>.png`; `<species>-skin.png` removes the near-side pectoral from the texture so a separate animated 3D fin can move without revealing a painted duplicate.

`profiles.json` records manually traced species-specific silhouettes, fin contours, eye and mouth locations. `build_marine_fish.py` creates closed 3D bodies, rounded subdivided fins, paired conformed gill covers and shallow corneal domes. It exports the six GLBs in `../assets/fish`, renders neutral three-quarter proofs and saves `marine-fish.blend` for editing.

Run from the aquarium source directory in PowerShell:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python reef/model-source/build_marine_fish.py
npm run build:reef
npm run check:reef
```

The runtime shares geometry and embedded full-resolution textures across inhabitants. Body waves, rooted fin flex, separate pectoral pivots, breathing and modeled-mouth food contact remain individual. All six unique models together contain 94,712 source triangles. Collision tests use conservative volumes, not triangle-perfect contact. These models improve detail but do not establish photographic parity with the supplied reef reference.

Anatomy cross-check: https://doris.ffessm.fr/Especes/Gramma-loreto-Gramma-royal-1213 (royal gramma coloration, eye line and anterior dorsal spot).

## Added diamond goby

A seventh species, *Valenciennea puellaris*, has its own generated reference and clean-flank image, profile, GLB and editable `goby.blend`. The original six exports are unchanged. Prompts are in `references/goby-prompts.md`; research, behavior choices and limitations are in `../qa/goby-research.md`.

To rebuild only the goby without replacing the accepted models:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python reef/model-source/build_marine_fish.py -- --only goby
```

The runtime uses its own bottom-hop/rest/sift behavior, independently moving fins, visible mouth and gill breathing, and small instanced sediment grains. This is a detailed photorealistic-style model, not proof of photographic equivalence.

## Procedural coral surface maps

`generate_coral_maps.ts` generates deterministic 512 x 512 RGBA diffuse, normal
and roughness textures from jittered corallites, recessed centers, raised rims,
septa and fine tissue grain. These are original procedural maps, with no external
image inputs or paid services. The runtime loads the baked PNGs from assets/coral.

From the aquarium source directory, export raw RGBA bytes with Node:

```javascript
import fs from 'node:fs';
import {coralSurfaceMaps} from './reef/model-source/generate_coral_maps.ts';
for (const [name, tex] of Object.entries(coralSurfaceMaps())) {
  fs.writeFileSync('reef/assets/coral/' + name + '.rgba', tex.image.data);
}
```

Encode each raw buffer using Pillow `Image.frombytes('RGBA', (512, 512), bytes)`
and `save(path, optimize=True)`. Raw intermediates are ignored. Keep PNG pixels
unaltered; CoralSurface.ts uses flipY=false to preserve DataTexture orientation.
