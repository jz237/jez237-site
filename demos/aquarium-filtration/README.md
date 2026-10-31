# Aquarium Filtration collection

User instruction, October 29, 2026: Website Demos should show **one Aquarium Filtration entry**, with every filter study inside that collection.

The collection is at `/demos/aquarium-filtration/`. Its nine children are Fleece, Skimmer, Sand, Drum, Moving Bed, Trickle, AquaClear, FiltoClear and Inside the Reef (reef sump/roller/skimmer). Their established URLs, source folders, deep links and dependencies are preserved. General aquarium ecosystems remain separate main-gallery entries.

For another filter demo:

1. Keep its runtime in its own `demos/<slug>/` directory.
2. Add its existing-style metadata to this directory's `catalog.json`, not the main `demos/catalog.json`.
3. Add its mechanism label in `scripts/build-filtration.mjs`.
4. Include a return link to `../aquarium-filtration/` in the demo.
5. Run `node scripts/build-demos.mjs`. This now builds the filter collection first, then the main gallery and pagination. Update the main collection card's descriptive count/features when the collection grows.

`gallery.css` styles a static, responsive collection. Covers are actual screenshots of the demos. No JavaScript is needed for collection navigation. The main catalog's collection ID is 032; child exhibit IDs are 036, 035, 034, 033, 031, 030, 027, 028 and 029.

QA: `scripts/roller-studio/release-check.cjs` checks nine child destinations, exactly one filtration collection entry in the main catalog, desktop/mobile overflow and captures the current Fleece cover. Each study also has its own runtime checks. Use the mandatory workspace deployment wrapper; do not relocate the child runtimes or create full-site copies.
