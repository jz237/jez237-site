# APX-9 pollination engineering
Original procedural Three.js reconstruction of the two APX-9 concept references supplied by Jez. Not factory CAD; concept specifications are not verified engineering performance claims.

## Build
`npm ci && npm run build` produces `demos/apx9-bee/`.

## Interaction
Drag/touch to orbit, wheel/pinch to zoom, select geometry or search the directory, focus a component, smoothly explode/reassemble, play the reversible sequence, enable automatic orbit, or enter fullscreen. Reduced-motion preferences disable assembly interpolation.

The model contains individually selectable armor, optical arrays, four membrane wings, wing motors, six articulated leg systems, antenna segments, battery and collars, cooling fins, navigation electronics, gears, harnesses and pollen modules. A fixed-seed fur mesh and canvas-made identification plaques require no external image assets. All geometry is original.

`node qa.mjs` runs the local browser smoke check with the documented Chromium executable; start a repository-root HTTP server on port 8793 first.
