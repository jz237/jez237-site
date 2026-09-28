# FiltoClear 5200 Studio — The Hidden Reef

Standalone, self-hosted educational 3D exhibit. Original procedural geometry; no purchased model, manufacturer CAD or external runtime dependency. Local Three.js and OrbitControls are reused from the site's Model S Studio, with their MIT license preserved in `vendor/LICENSE`.

Run `python -m http.server 8801 --bind 127.0.0.1` from this directory. Run geometry and assembly checks with `node --test --test-isolation=none tests/*.test.mjs` on Node 24+. No package installation or build step is needed.

## Experience

32 selectable assemblies; animated explode/reassemble sequence and continuous slider; assembled, exploded, cutaway, normal flow and Easy-Clean modes. Mouse/touch orbit and zoom, preset views, automatic orbit, motion pause, selected-part isolation, system visibility, collision-avoiding labels, text search and a keyboard-accessible component selector. Eight guided chapters and retailer-specific fish-load sizing guidance. Reduced-motion preference starts animation paused; all lessons and component text remain usable if WebGL fails.

## Reference and model scope

OASE FiltoClear 5200 third generation, SKU 91670. The manufacturer’s diagrams and manual identify the parts, assembly hierarchy and foam sequence (top to bottom: blue / red / blue / purple). There are four foam rings, three pore densities and a 42 W UVC lamp. The 5200 includes a quartz cleaning rotor. Repeated clips, ribs, pins and fasteners are grouped into selectable assemblies.

- Retail product and light/medium/heavy sizing chart: https://www.thehiddenreef.com/oase-3-rd-gen-filtoclear-pressure-flo-filter-5200.html
- Official specifications, photographs and exploded spare-parts diagrams: https://www.oase.com/en-US/pond-and-water-garden/filtoclear-5200
- OASE operating manual, hosted by The Pond Guy: https://www.thepondguy.com/content/pdp/docs/oase-filtoclear-gen3-product-manual.pdf (overview pp. 6–9, cleaning pp. 16–21, specifications pp. 29–30).

This is an original approximate reconstruction, not a measured service model. Internal manifold channels, helix shape, clear fitting transparency and hydraulic traces are schematic. Violet beads explain the UV path; UV-C itself is invisible and the lamp is never illustrated as a powered exposed service part. The flow lesson includes the UV bypass; the cleaning lesson routes water to waste and raises the lower plate to compress the foam. The real lid remains closed during routine Easy-Clean. The linked manual governs actual servicing and safety. Retail capacity guidance is shown as under 5,200 / 2,600 / 1,300 gallons for light / medium / heavy loads, rather than presenting 5,200 gallons as koi capacity.

## Publishing

Publish identical static files to `demos/filtoclear-studio`, `prototypes/hidden-reef/learn/filtoclear` and `prototypes/hidden-reef-header-preview/learn/filtoclear` in jez237-site. Local pond links adapt when mounted under `/learn/filtoclear/`. Exclude package.json and tests from public copies; preserve this source with the tests under `scripts/filtoclear-studio`.

The jez237 Pages wrapper in root AGENTS.md is mandatory. The separate Hidden Reef Pages project publishes the full current `prototypes/hidden-reef` tree using its existing footer-link cleanup policy.
