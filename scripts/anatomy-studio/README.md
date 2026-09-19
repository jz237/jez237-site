# Anatomy Studio asset preparation and validation

Install tooling here with `npm ci` (gltf-transform 4.5, meshoptimizer, three 0.180, Playwright) and `npx playwright install chromium`.
Blender 4.5 LTS must be on the box (`BLENDER` env, default `~/.local/bin/blender`).

```sh
bash fetch-models.sh                 # sparse clone of Z-Anatomy (PC-Version) into ~/.cache/anatomy-studio/z-anatomy (~230 MB)
blender -b --factory-startup -P blender-inspect.py -- --fbx <SkeletalSystem100.fbx> --system skeletal --out ~/.cache/anatomy-studio/work
python3 make-normalize.py            # work/normalize.json from skeletal landmarks (feet on y=0, trunk axis at origin)
bash run-exports.sh                  # eight headless Blender exports in parallel -> work/raw/*.glb (+ anchors, reports)
node prepare.mjs                     # compress to ../../demos/anatomy-studio/assets/*.glb, write manifest.json + descriptions.json
node check-assemblies.mjs            # prove the four nested assemblies resolve against real piece names
node preview.mjs                     # 1100x579 preview JPEG for the demos catalog (needs the site served on :8791)
node verify.mjs                      # Playwright checks against STUDIO_URL (default http://127.0.0.1:8791/demos/anatomy-studio/)
```

`blender-inspect.py` dumps one CSV per FBX (name, suffix kind, parent chain, triangles, bounds). Read it before changing
`blender-export.py`: Z-Anatomy uses `.l/.r` sides, `.g` group empties, `.j`/`.i` 12-triangle label placeholders, `.t`/`.s`
label-anchor empties and `.ol/.or/.el/.er/.oNl…` muscle-attachment overlays on bones. `normalize.json` (translation that
puts the feet on y = 0 and the trunk axis at the origin) is computed from skeletal landmarks and applied to every system.

`rules.json` holds per-file triangle budgets; merge logic lives in `unit_for()` in `blender-export.py`: every bone, tooth,
cartilage, muscle, organ, heart and brain structure stays individual; vessels and nerves keep units to depth 4 of their tree;
small ligaments, lymph nodes, fasciae/bursae and skin sub-regions join their group per side. Decimation is budget-driven with
a floor for small pieces and a boost for the heart and brain. Each exported piece carries `id, name, system, file, side,
parent, path, merged, tris` as glTF extras; three.js sanitises node names, so the runtime keys everything on `extras.id`.

Skin (`regions`) gets its own treatment in `blender-export.py`: every Z-Anatomy region is a solidified shell (outer sheet,
inner sheet, rim), so each patch is split into smooth components and only components whose faces can see open air along
their normals are kept (`SKIN_ESCAPE`, default 0.08; concave skin such as an armpit still sees some, inner sheets see none).
The outer sheets are joined, welded, pinholes filled, border chains bridged run-by-run where another chain lies within
`SKIN_BRIDGE` (16 mm), slits and finger/toe tips capped, each sheet re-oriented the way the source faced, subdivided (x1
base, x2 full tier), border vertices seated onto neighbouring sheets, and finally split back into pieces by material with
the shared custom normals. `SKIN_DIAG=1` logs component escape fractions, bridge groups and the remaining open chains.

`prepare.mjs` welds, quantises (14-bit positions) and meshopt-compresses each file, asserts every file is under the 25 MiB
Cloudflare Pages limit, derives each piece's body region from its centre, matches descriptions with fallback rules
(exact → parenthetical → side → qualifier → “of …” → aliases → parent → path), computes the radial envelope used by
`explode-rules.js`, and resolves the assembly member lists by importing `demos/anatomy-studio/assemblies.js`.

`verify.mjs` runs headless Chromium with SwiftShader (`--use-angle=swiftshader --enable-unsafe-swiftshader`) and
`?quality=verify` (no shadows/AA) and checks piece counts per stage, rendered triangle count, explosion with intermediate
motion, exact reassembly, each nested study (only members visible, members framed, primary members separated), filters,
search, isolate and descriptions, finish modes, labels, sequence, keyboard, the non-overlapping all-parts board at three
viewports, mobile layout, deep links, the manual and reduced motion. Screenshots land in `STUDIO_SHOTS` or the temp dir.
