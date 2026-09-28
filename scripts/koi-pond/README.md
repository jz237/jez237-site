# Stillwater — Hidden Reef koi garden preview

An original browser-rendered woodland pond, authored for the Hidden Reef living collection. This is a review preview for **GitHub and jez237.com only**. Do not add it to or deploy it on the Hidden Reef production site until the owner accepts it.

## Build and run

Requires Node.js 22.12+ (tested on 24) and npm:

```sh
npm ci
npm test
npm run build
npm run dev
```

The output in `dist/` is relocatable under a subdirectory. The preview route is `/demos/hidden-reef-koi/`. Source belongs in `scripts/koi-pond/` in the jez237-site repository. The root repository's `AGENTS.md` and guarded deployment wrapper remain authoritative for publishing the complete site.

## Original assets

`model-source/build_koi.py` creates the koi geometry, seven painted color patterns, fin rays, lips, eyes, gill seams, barbels and scale bump texture. `original-koi.blend` is the editable Blender source with packed textures. `koi-study.png` is a studio render. Rebuild with Blender 5.2:

```sh
blender --background --python model-source/build_koi.py -- --render
```

The woodland scene, shoreline, pond bowl, deck, bench, cascade, pebbles, planting, water-lily flowers are original procedural geometry in `src/PondScene.js`. Foliage maps, lily veins, fish skins, and water effects are authored for this scene. Ground, gravel, bark and mossy-rock PBR maps come from Poly Haven under CC0 1.0; exact source URLs are recorded in `public/textures/sources.json`. The reference pond was viewed for broad visual inspiration. Its source, meshes, textures, layout and interaction implementation were not copied. Library notices remain in `public/LICENSES.txt`.

## Inhabitants and motion

Seven illustrative koi varieties: Kohaku, Taisho Sanke, Showa, Yamabuki Ogon, Asagi, Shiro Utsuri and Ochiba. This is a variety display, not a volume-based stocking recommendation or show-quality grading tool.

The simulation uses separate phases and decisions for each fish: an arc-length-preserving 16-segment spine with a steady head, independently flexing paired fins, glides, inspection pauses, gradual upright turns and continuous depth changes. Local food perception, hunger, energy, nearby fish and memory influence their behavior. Pellets are removed only after a mouth reaches them, or after their visible lifetime ends. The anatomy is three-dimensional; fish are not sprites. Motion rates are authored for the experience, not measurements of individual real koi.

## Water lab

The lab is independent of the animation and is explicitly labeled as a teaching scenario. It models oxygen exchange, simplified respiration, organic waste, two-stage nitrification, plant nitrate uptake and water-change dilution. Nitrogen species use mg/L as N throughout. Nitrification transfers nitrogen between pools and consumes oxygen/alkalinity. pH is a user-set sample, not a computed carbonate equilibrium.

Ammonia speciation uses the freshwater Emerson relationship: pKa = 0.09018 + 2729.92 / temperature in kelvin. Oxygen saturation uses a freshwater, sea-level approximation over the UI's 10–32°C range. Conversion and exchange rates are illustrative; the model is not calibrated to a particular pond, feeding regime, volume, altitude or filter. It does not provide dosing, treatment or stocking instructions.

Research references:

- USGS carp/koi anatomy: https://www.usgs.gov/labs/fish-health-program/science/koi-cyprinus-carpio-koi-fhp
- OATA pond fish care: https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-coldwater-fish/how-to-look-after-pond-fish/
- UF/IFAS dissolved oxygen: https://ask.ifas.ufl.edu/publication/FA002
- UF/IFAS ammonia: https://edis.ifas.ufl.edu/publication/FA031
- EPA ammonia equilibrium: https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=20008UJP.TXT
- ZNA Northwest variety identification: https://nwkg.org/koi-identification/

## Interaction and accessibility

Drag to orbit; scroll/pinch to zoom. Camera presets, koi selection and inspection are available through labeled buttons and the guide. Click water for a ripple. Feed a small group of visible morsels. Pause stops pond life and water motion while keeping navigation available. Hidden tabs suspend animation. Quality Auto reduces only water-target resolution after sustained slow rendering; Quality Full overrides that adjustment. The fish geometry is preserved in both modes. A reduced-motion preference starts the pond paused.

## Verification

`tests/pond.test.mjs` exercises two minutes of swimming, fixed spine length, pinned-head and traveling-wave amplitude/phase, depth/floor bounds, upright turns, individual phases, speed variation, pause, mouth contact, satiation, ammonia speciation, nitrogen balance, water-change dilution, aeration/filter comparisons and long-run finite/nonnegative chemistry.

Browser checks cover desktop and 390 × 844 layouts, camera views, feeding, guide selection, warm low-oxygen scenario, reset, pause/resume, lighting and render errors. This is a stylized real-time garden; botanical placement and plumbing are illustrative.

## Expanded garden revision

The basin is roughly 4.6 times the original preview area. Rolling terrain supports layered green canopies, red maples, pink flowering trees, dense understory, ferns, iris leaves and 12,600 curved grass blades. The original terrace, bench and slate cascade remain in a distinct layout. The water combines planar reflection/refraction, depth absorption, moving caustics, fish wakes, ripple interaction and cascade spray.
