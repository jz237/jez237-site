# Coupe detail and western verge

This September 28, 2026 increment concentrates on the coupe and one western
road bend. It is an incremental visual improvement, not Wreckfest 2 parity.

## Authoring and provenance

Run Blender 5.2 from the game directory:

```text
blender --background --python tools/detail-coupe.py
```

The input `source/models-refined/coupe.blend` remains unchanged. The generator
writes `source/models-detailed/coupe.blend`, `public/models/coupe.glb`, and
`source/coupe-detail-manifest.json`. The ordinary model/refinement manifests
point to that detail manifest for the new coupe output. Their original refined
editable-file record still describes the retained input scene.

The derivative retains the credited Car Concept asset's CC-BY-4.0 attribution,
all embedded image bytes, the existing 28 material slots, wheel pivots, original
glass geometry and untouched body panels. An actual clipped lower cooling
aperture replaces the previously solid fascia there. Open honeycomb, a recessed
surround, four independent lamp lenses, optical divisions, small wheel lugs,
tire ribs, brake details and cabin piping add 21,082 triangles. Total GLB
triangles are 216,893; production car draw meshes rise from 76 to 88. The six
new damage panels consist of the grille, surround and four lenses, for 35
exterior panels. Their original materials are reused.

The runtime GLB is 11,355,504 bytes, SHA-256
`dc3bae23e49b8d4e5f80de5973bd38ed87b485ad40af5aee0a14d9ebf10e32ea`.
The separate Blender scene is 10,802,336 bytes. The manifest records both hashes.

## Rendering and damage

`src/coupe-realism.ts` configures coupe-only paint, neutral glass, tires and lamp
materials. Paint grain is filtered; wear is anchored to the undeformed body,
and scratches follow the local projected impact direction. A geometric-normal
delta preserves authored shading and joins matching smooth seams around dents.
The exposed substrate loses clearcoat. Lamp wear locally darkens and breaks
the illuminated surface. Existing brake-light controls remain active.

Nearby root-batched interior and structure meshes receive local damage as well,
preventing rigid cabin trim and radiator pieces from protruding through deeply
dented outer panels. Wheel-attached detail remains on the wheel pivots. These
changes add no physics bodies. Exact repair and serialized replay are tested.
Rigid-body mechanics, engine damage, scoring, steering and suspension remain
unchanged. This still uses simplified collision shapes, not structural
soft-body destruction; deep tears and some gaps remain approximate.

`src/scenery-west-verge.ts` dresses a limited western bend with interrupted
grass pockets, existing scanned young firs and small photographed scree chips.
Three spatial LOD groups use 75 m and 160 m transitions. Placement conforms to
the unchanged terrain and stays outside the 12 m lane. The new flexible plants
and small chips add no colliders. Existing CC0 provenance is in `CREDITS.md`.

## Verification and reproduction

`npm test` includes four new actual-asset/render-contract checks and retains
historical fixture checks. Exact reversible source changes are recorded in
`source/coupe-realism-revision.json`; the compressed prior coupe GLB and its
inventory under `tests/fixtures/` preserve previous geometry evidence.
Historical fixture hashes are not replaced with the new assets.

`tools/coupe-realism-qa.mjs` captures twenty 1440p Ultra views, including front,
rear, wheel and side details, several damage levels, repair and the western
bend. Use a fresh `QUARRY_CAR_QA_OUTPUT`. The normal gameplay, shadow lifecycle
and isolated ten-minute tools remain applicable. Exact release results are
recorded at the top of `VALIDATION.md`; screenshots and large private reports
remain local in ignored `outputs/coupe-realism/`.

All 23 deployed multiplayer input hashes remain unchanged and are recorded in
`source/coupe-realism-physics.json`. This art release needs no Worker update.
All 35 existing ElevenLabs clips are reused without generation or purchases.
