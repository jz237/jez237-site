# Western quarry wall recovery checkpoint

Saved September 28, 2026 after the user requested recovery and publication when the agent credit allowance was exhausted.

The playable release retains the tested **Dew9** build, all three solo modes, internet multiplayer on the dedicated Free account, reversed arrow steering (WASD unchanged), the photographic Rock Face 03 cliffs, the shared pavement-grip correction, and 35 locally bundled ElevenLabs effects. No paid service or additional generation was used for recovery.

## Work preserved

- `tools/author-quarry-west-wall.py`: draft Blender authoring generator. It parses as Python but has **not been executed or visually validated**.
- `source/models/quarry-west-wall-base.json`: immutable measured 275–325 degree sector, exact apron and boundary data, normals, road and terrain references.
- `tests/fixtures/quarry-west-wall-baseline.json` and `quarry-west-wall-legacy-scatter.json.gz`: immutable accepted scene, collision and scatter baseline.
- `tools/export-quarry-west-wall-base.ts`: one-time guarded baseline capture; do not overwrite existing frozen files.
- `src/scenery-west-wall.ts`: unused draft geometry loader, expecting twelve WestWallRock/WestWallRubble section/detail nodes.
- `tools/west-wall-qa.mjs` and additional-view support in `tools/cliff-material-qa.mjs`: captured fifteen exact-build baseline views locally.
- The source snapshots in this directory preserve the interrupted world integration and live-verification changes. They are **not active runtime files**. See `recovery-manifest.json` for exact hashes and paths.

## Intended design and remaining work

Replace the uniform western terrace bands across 275–325 degrees, split into 275/292/309/325 sections. Use a tall fractured extraction mass at 280–296, an asymmetric collapse around 297–304, and a lower offset face toward 322. Preserve the road, exact lower apron, crest and perimeter, and add buried toe closure: the inherited toe gap reaches approximately 1.91 metres. No medium tree trunk lies in the original replacement footprint; road-center clearance is at least 33.95 metres.

The new GLB, editable Blender scene, generated manifest and collision JSON **do not yet exist**. Collision integration, overlap removal, historical invariant adapters, wall validation, motion/LOD inspection and performance checks are unfinished. Do not enable the saved world integration until those assets and shared client/server physics are complete and tested. The proposed nine-stop playground benchmark protocol was discussed but not implemented; existing benchmark files retain their earlier behavior.

Baseline screenshots and private diagnostic logs remain in local `outputs/west-wall/`. They are diagnostic evidence, not game runtime assets. Existing large editable fir scenes and original scan downloads remain local with their established source/reproduction records; no private credentials or audio account usage records are included in publication.
