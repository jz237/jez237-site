# Layered livery milestone — October 1, 2026

Status: implemented and validated locally; **not transferred to or installed on VENGEANCE**. Full Wreckfest 2 PC parity remains active and unproven.

## Implemented behavior

The garage now offers up to 32 editable layers on the left, right, top, front and rear painted surfaces. Artwork includes stripes, circles, stars, chevrons, checkers, numbers, short text, seeded spray, rust and chipped-paint patterns. Layers support color, position, width/height, rotation, opacity, horizontal flip, visibility, duplication, order and deletion. Numeric fields update the preview while typing. The canvas supports pointer dragging and arrow-key position adjustments. Multi-selection supports translation, scaling and rotation; opposite-side copying keeps text readable. Top copies mirror in place; front/rear and left/right copies switch surfaces.

The editor retains 40 undo steps per editing session. Up to eight named decal groups per car can be saved and reinserted. Groups persist with Apply & Return. Existing setup presets and setup-data exchange include the active livery; the group library itself is local to that car and is not included in shared setup data. Old garage/setup/replay records migrate to an empty livery. Import is bounded to 64 KiB, 32 layers, eight groups and bounded numeric/text fields.

Body-space shader coordinates stay with deforming meshes and loose panels. Livery color blends before dust, exposed metal, transferred paint and heat damage. A separate finish mask gives rust a rough, nonmetallic surface and chips an exposed-metal appearance. Canvas textures are allocated only for a nonempty visible livery and disposed when cleared or when the car is removed. Stock AI cars keep their existing shaders and avoid extra artwork attributes/textures. Existing replay setup metadata preserves the design and reconstructs it on playback.

Garage cameras show the selected surface relative to the car's rotation. An off-center projection keeps all five views in the exposed preview pane; leaving the garage clears the projection offset and restores the ordinary up vector.

## Validation performed

- TypeScript check and local production Vite build pass. Local build reports the existing large-bundle warning and a missing local font asset (the full asset set remains on VENGEANCE).
- 31 targeted tests pass: seven livery rules/camera/audit tests, one actual-model livery test spanning all three cars, seven garage tests, eight replay tests and eight route tests.
- New tests cover migration and malicious values, maximum-size sharing, independent presets/groups, transforms/mirroring, deterministic spray/weathering, finish-mask coverage, all-surface camera centering, source recovery, real-model damage/repair/replay behavior and texture disposal.
- The actual-model test loads the existing GLBs, verifies stock and customized materials remain independent, preserves immutable livery coordinates through impacts and repairs, checks shader composition beneath damage, and verifies livery metadata after replay file exchange and seeking.
- A localhost-only validation scene uses the real game Vehicle, garage UI, livery shader, camera helper and existing GLBs. It is not a full quarry race, online test or VENGEANCE performance benchmark.
- Browser checks created a stripe and number, recolored the number, selected/saved a two-layer group, inserted that group, exercised group rotation and undo/redo, mirrored artwork, saved a four-layer design, reloaded it, and confirmed the saved group returned. UI setup export contained all four layers.
- Damage preview reduced the customized car to 35% condition with three detached panels. The visible number and stripe followed the damaged body and remained underneath scraped paint.
- Surface checks covered both sides on the coupe, sedan side/top framing, top coverage, and hatch front/rear painting including an opposite-face copy. The top check exposed and fixed camera framing and delayed numeric-preview updates. A diagnostic atlas confirmed numeric edits reached the texture.
- No console errors occurred in the final local preview tab. An earlier incorrectly rooted scratch preview failed to fetch assets; it was corrected before validation.

## Remaining gates and limits

The full regression suite, full-scene live race/replay check, performance measurement on VENGEANCE, and guarded installation have not run for this milestone. The installed original remains the route release: `index-DZCl-cOG.js` / `index-lxV9Hsn2.css`, baseline commit `afe7661` in the local source history.

The editor uses five box-projected surfaces, not arbitrary mesh UV painting. Dominant-normal boundaries can form seams; artwork clips to supported body paint and excludes glass/trim. The color atlas has 512 pixels per surface and the finish atlas 256; together they require about 7.5 MiB of uncompressed texture storage per customized car, before browser/canvas overhead. No broad 24-custom-car benchmark has been performed. There is no arbitrary image import, freehand stroke editor, sculpted cosmetic dents, downloadable group library or online livery replication. These remain part of the full parity work.

## Transfer approval

Automatic approval review rejected the outgoing source/test archive twice. After the first rejection, read-only checks confirmed the destination hostname is VENGEANCE, user jrb04, and installed main/garage source hashes match the previous release. Review still required explicit permission to export the update to its staging path. No outgoing livery archive was transferred and no remote livery files were changed.

A pending question asks permission to copy the update to the VENGEANCE candidate, test it and install it with a recovery backup. Do not bypass that rejection or infer permission from elapsed time. Read-only inbound download of the four existing vehicle models was approved and enabled the local actual-asset tests.

Reference features: THQ Nordic's [customization update](https://thqnordic.com/news/may-the-fourth-be-with-you-update-4-for-wreckfest-2-adds-car-customization-today) and [decal-group saving update](https://thqnordic.com/news/time-to-get-dirty-wreckfest-2-s-biggest-content-update-yet-out-today). No reference game assets or code were copied.
