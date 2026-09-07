# Crystal Edition — authored art revision 5

Weathered expedition armour, cold crystal light and warm directional sunlight. Organic stages use layered rock relief, cavity vertex colours, weathered arches and vegetation; industrial stages use ribbed machinery, conduits and turbines. Each of the five worlds retains its own palette and backdrop.

All new geometry, surface textures and effects in this revision were authored in this repository. No paid generation services, asset purchases or new subscriptions were used. Existing Three.js and existing game backgrounds are retained.

- `artisan.mjs`: contoured armour shells, surface wear, relief, local geometry batching, smoke texture.
- `models.mjs`: animated hero, enemies, fighter and six boss variants.
- `cliffs.mjs`, `vistas.mjs`: level contours, strata and scenery assemblies.
- `modern-renderer.mjs`: lighting, smoke/debris pools, shield, camera and quality budgets.
- `viewport.mjs`: expanded landscape camera without stretching or changing physics.

Smooth quality uses smaller shadow maps, baked environmental shading and fewer particles and crystal lights. Live actor shadows and gameplay information remain visible. Desktop performance is measured in browser diagnostics; physical-phone performance must be evaluated on the target handset.

Validation: `npm test`, `npm run test:models`, `node terrain-test.mjs`, `node art-test.mjs`, and browser scene/portrait/landscape checks.
