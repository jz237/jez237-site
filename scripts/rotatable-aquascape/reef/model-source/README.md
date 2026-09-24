# Marine fish reference and Blender sources

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
