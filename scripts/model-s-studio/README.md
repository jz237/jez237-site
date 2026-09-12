# Model S asset preparation and validation

Install tooling here with `npm ci`. Source glTF attribution and mirror links are in `../../demos/model-s-studio/README.md`. Obtain `scene.gltf`, `scene.bin` and the referenced texture from that asset mirror, preserving their relative paths in an external scratch directory.

```sh
node prepare.mjs /path/to/source/scene.gltf /path/to/prepared.glb
npx gltf-transform optimize /path/to/prepared.glb ../../demos/model-s-studio/model-s.glb --compress meshopt --join false --palette false --instance false --simplify-error 0.0001 --texture-size 1024
```

Preparation reconstructs connectivity across the source's arbitrary material chunks, preserving original normals. Connected islands with at least 250 triangles become standalone surfaces. Smaller islands are assigned to the nearest substantial surface of the same material. This produces 297 visual pieces. Positions are normalized to meters around the car center. Source materials, texture and attribution remain in the asset. The result is a visual inspection model, not engineering CAD.

Serve the repository root on port 8768, then run `npm run verify`. Set `STUDIO_URL` to validate a published studio URL, and `CHROME_PATH` if Chrome is not at the default Windows path. Alternatively install Playwright Chromium and supply its executable. Browser checks exercise explosion, exact reassembly, filtering, isolated close-up, search, paint, sequence playback, keyboard, mobile layout and reduced motion. Screenshots go to an external directory specified by `STUDIO_SHOTS`, or the OS temp directory.
