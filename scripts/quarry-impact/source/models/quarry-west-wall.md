# Western extraction wall

The recovered draft is now exported and integrated. It replaces the legacy 275–325 degree ring sector, split into three adjoining sections at 292 and 309 degrees. The authoring design forms unequal extraction faces around an asymmetric collapse channel, with a connected partly buried rubble foot.

`tools/author-quarry-west-wall.py` runs in Blender 5.2. The editable scene is `source/models/quarry-west-wall.blend`; runtime geometry is `public/models/quarry-west-wall.glb`; the generated hashes are in `quarry-west-wall-manifest.json`. Geometry is original, with fragments from the existing credited Poly Haven Rock Moss Set 01 CC0 scan. The runtime loader reuses the reviewed Rock Face 03 / Rock Boulder Dry wall material and existing rock atlas. No texture maps, purchases or sound generation were added.

## Geometry and physics

- Three independent near/far LODs; twelve exported geometry nodes and six visible draws before culling. Transition distance 120 m, hysteresis 0.12.
- Near 100,135 triangles; far 32,535 triangles. Runtime GLB 6,383,784 bytes.
- Exact rendered near-wall collision: 23,154 triangles, including 234 toe-closure triangles.
- All 600 original lower-apron triangles, perimeter vertices and crest are preserved. Apron normals are independently checked against the frozen original per-band basis.
- Two hundred visible fragments; fifty major fragments have simplified convex collision hulls.
- Seventy-six intersecting old rock/scree colliders are removed. Fifty-one new wall/hull colliders yield 2,262 total. All other collision shapes, terrain, driving surfaces, grip, controls, scoring and server rules stay exact.
- Conservative major-rubble XZ bounds extend the old-scatter overlap filter beyond the wall toe. The visible near-wall collision itself is unsimplified. Camera clearance includes the new wall height.

## Verification

The eight added frontend tests check exact source evolution, finite/wound/manifold triangles, intact apron/perimeter, backing-terrain clearance, toe closure against exact terrain triangles, road/arena clearance, every near render/collision triangle, bidirectional exposed-face probes, grounded hulls, mixed-LOD seams, loader UV/position preservation and original apron normals. A new backend test fires real Rapier bodies at the extraction faces, collapsed channel and toe closure and requires solver contacts with stopped penetration/velocity.

`tools/audit-quarry-west-wall.ts` records all 23 deployment inputs and asset hashes. `tests/quarry-west-wall-invariants.ts` validates bounded changes before reconstructing historical states for older gates; old fixture hashes are not rewritten. The supplemental six-variant rock-placement fixture was captured by executing the exact hash-restored pre-wall layout because the original freeze contained only the first three variants.

The fifteen 1440p Ultra comparison views are in local `outputs/west-wall/candidate1`. CPU preflight confirms two ordinary chase-camera inspection positions with four grounded wheels, under 0.10 m drift, no obstacle contacts and settled speed below 0.062 m/s. Actual game-mode and WebGL lifecycle evidence is retained locally. Final performance and publication results are recorded in `VALIDATION.md`.

The original recovery directory is a historical snapshot, not current runtime instructions. This update completes that saved western-wall milestone; it does not claim Wreckfest 2 visual parity.
