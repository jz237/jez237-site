# Model S asset preparation and validation

Install tooling here with `npm ci`. Source glTF attribution and mirror links are in `../../demos/model-s-studio/README.md`. Obtain `scene.gltf`, `scene.bin` and the referenced texture from that asset mirror, preserving their relative paths in an external scratch directory.

```sh
node prepare.mjs /path/to/source/scene.gltf /path/to/prepared.glb
npx gltf-transform optimize /path/to/prepared.glb ../../demos/model-s-studio/model-s.glb --compress meshopt --join false --palette false --instance false --simplify false --texture-size 1024
```

Preparation reconstructs connectivity across the source's arbitrary material chunks, preserving original normals. Connected islands with at least 250 triangles become standalone surfaces. Smaller islands are assigned to the nearest substantial surface of the same material. This produces 297 visual pieces. The runtime adds 11 schematic battery pieces, making 308 selectable groups. Geometry is compressed without simplification. Positions are normalized to meters around the car center. Source materials, texture and attribution remain in the asset. The result is a visual inspection model, not engineering CAD.

Serve the repository root on port 8768, then run `npm run verify`. Set `STUDIO_URL` to validate a published studio URL, and `CHROME_PATH` if Chrome is not at the default Windows path. Alternatively install Playwright Chromium and supply its executable. Browser checks prove all 308 projected geometry bounds are on screen without overlap across four viewport sizes; they also cover tile selection, board isolation and fit, schematic battery filtering, the manual and deep links. Further checks exercise explosion, exact reassembly, filtering, isolated close-up, search, paint, sequence playback, keyboard, mobile layout and reduced motion. Screenshots go to an external directory specified by `STUDIO_SHOTS`, or the OS temp directory.

Run `npm run verify:cockpit` for the driver’s-seat studio. These checks cover first-person camera positions, physical 3D screen clicks, interactive software and shared state, charging progress, enlarged-dialog keyboard controls, phone layouts, reduced motion and links from the main studio/manual. Use the same `STUDIO_URL` base directory and `STUDIO_SHOTS` overrides. The cockpit uses the existing GLB with independently authored canvas interfaces; no additional model download is needed.

Run `npm run verify:tour` for the nine-stop tour and four detail cameras. It checks chapter transitions, battery visibility, playback, interaction pause, restart, touchscreen access, direct links, phone layouts, keyboard look controls, reduced motion, and failed-scene recovery.
