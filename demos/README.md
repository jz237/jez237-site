# Website demos

The gallery is a static page styled to match the Jez237 cosmic workbench.

To add a demo:
1. Put its public build in a subfolder of `demos/` and its preview image in `demos/assets/`.
2. Add an entry to `catalog.json`, following the existing fields. Entries appear in catalog order; the first is the featured exhibit. Use a unique ID and a GitHub source URL.
3. From the repository root, run `node scripts/build-demos.mjs`. It checks local demo pages and preview images, then updates the static gallery and collection count.
4. Commit the catalog, generated `index.html`, and new demo assets together.

The layout supports additional cards without editing CSS. The gallery works without JavaScript; the shared site menu is enhanced by `assets/side-menu.js`.
