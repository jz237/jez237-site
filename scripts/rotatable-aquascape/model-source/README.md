# Silver angelfish source

Original Blender model based on the owner's supplied silver angelfish photograph.
The supplied photo provides flank pigment through a fitted UV cage on the curved
mesh, including the natural iris and eye stripe. Dorsal, anal and caudal fin pigment also follows fitted photo UVs;
pectoral tissue and subtle scale normals are procedural; all geometry is authored by `build_angelfish.py`. No purchased
models or paid services are used. The reference photo is preserved unmodified.

Run with Blender 5.2 from the aquarium source directory:

    blender --background --python model-source/build_angelfish.py

This writes the editable `.blend`, the studio proof PNG, and the site's GLB plus
embedded-map originals under `public/models/angelfish`, plus a fitted collision
envelope in `lib/AngelfishEnvelope.json`. Then run
`npm run build:sites` to update the content hashes and synchronize all three sites.

Both live fish share geometry and textures; separate small shader uniforms drive
the body, median fins, paired pectorals and pelvic streamers. The teaching close-up
shares the same prototype. Runtime motion and species notes are documented in
`public/angelfish-study.md`; `tests/angelfish.test.mjs` checks behavior, contacts,
geometry coverage, shared resources and pause behavior.
