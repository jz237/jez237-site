# The Living Aquascape

A cinematic photographic aquarium with WebGL motion, a deterministic educational ecosystem model, six modes and ten scenarios. Published under /demos/living-aquascape/ on jez237.com and the GitHub Pages mirror.

The visual foundation is newly generated photographic art. This project does not import the old AquariumEngine, FishSystem, plants or textures. Camera movement is intentionally limited to panning and magnifying image-based layers. It is not free-orbit volumetric 3D.

## Run and build

Node 22.13+ and npm. Use npm ci, npm run dev, npm test and npm run build.
The relative-URL static deployment is written to static-dist/. Copy its contents to demos/living-aquascape/. Keep static/public assets beside index.html. No runtime keys or external network requests are required.

## Controls

Drag/arrow keys pan; wheel, pinch, + and - zoom. Keys 1-6 choose modes; Space pauses. H hides the interface and Escape restores it. Select animals for identification. The camera menu restores framing. Gamepad left stick pans and A pauses where supported.

Environment contains light intensity, photoperiod, CO2 supply, flow, agitation, heater target, feeding rate, nutrient rate and KH. Discrete actions feed, trim, clean algae and change 30% of water. Chemistry explains the score. Playback is real time, one hour/second or one day/second.

## Model and assumptions

lib/aquarium/Ecosystem.ts contains the pure model, reset states and scenario descriptions. Time uses hours, temperature Celsius, dissolved gas mg/L and nitrogen mg N/L. Integration is bounded to one simulated minute. Waste mineralization feeds ammonia oxidation, nitrite oxidation and nitrate uptake. Photosynthesis depends on light, carbon, nitrogen and circulation. Gas exchange and temperature lag their controls. Algae and biomass respond more slowly.

The pH estimate assumes carbonate-only alkalinity: 7 - log10(CO2 / (3 * KH)). It is not valid for arbitrary aquasoil or organic-buffer systems. Rate constants are illustrative and not empirical calibration. The model omits complete mass balances, species-specific chemistry and trace nutrient compartments. See static/public/about.html for biological references and detailed limits.

Seven tests check deterministic resets, gas/biomass timescales, overfeeding effects, water-change behavior, 60-day finite bounds and integration consistency, plus the first-frame timing regression.

## Rendering and assets

lib/aquarium/PhotographicScene.ts is the new image-based renderer. It uses original scene and leaf-macro imagery, isolated species artwork, a local water/plant displacement shader, fin deformation, boids-style steering, bubbles, analytic flow paths and a root-zone diagram. A fixed seeded PRNG initializes animal state; visual steering is timestep-dependent while ecological presets/integration are reproducible.

static/public/aquascape.png: 1672 x 941 photographic foundation.
static/public/leaf-macro.png: 1672 x 941 close-up.
static/public/living-species.png: 1254 x 1254 RGBA sheet: cardinal tetra, harlequin rasbora, pearl gourami, Amano shrimp.
art-prompts/ contains exact generation prompts. All three were produced with built-in imagegen for this project using the owner's concept direction. Shrimp sprite antenna tips are clipped at the artwork edge; it is rendered only at small foreground scale. Species art is illustrative, not a taxonomic plate.

Performance lowers render density and particle count. High uses up to 1.5 DPR; Ultra/Photography up to 2 DPR. Photography pauses but does not path trace or progressively accumulate. Settings preserve ecological state. Frame time is reported without a fixed FPS guarantee. Reduced-motion preferences are detected.

Flow and roots are educational diagrams; equipment mode is a photographic functional guide, not an exploded mechanical model. Plant-image displacement does not produce biologically correct growth topology. Microbes are described through educational text rather than claimed microscopic scans. Sound is generated locally and starts only on a user action.

## Extension points

Replace the image layers with independently authored textured GLB assets to support full orbit. Add a depth atlas for stronger occlusion, species-specific growth models, calibrated carbon/oxygen chemistry, nutrient mass balance, and detailed equipment geometry if expanding beyond the cinematic exhibit.

The optional feature-detected WebMCP tool load_aquascape_scenario uses the same scenario action as the UI and validates the name. No supported WebMCP test context was available during this build, so live registration was not verified. Browser UI testing was not requested; validation covers TypeScript, production compilation, pure-model tests and deployment asset availability.

## Dependencies

React, React DOM and Three.js use their upstream licenses. Artwork is generated for this exhibit. Runtime is fully static, with no accounts, server storage or tracking added by this demo.

Plant motion uses ten authored, rooted displacement regions with phase-delayed bending, stronger motion in tall leaves and minimal carpet motion. Red stems move as coherent image regions too. Filter flow controls the amplitude with a smoothed response; pause and reduced motion still freeze animation. This remains image deformation rather than a volumetric plant simulation.

Water surface uses crossing waves and damped outlet ripples to perturb reflected imagery, refract the surface, and break overhead highlights into moving ribbons. Surface agitation and filter flow drive wave strength. The authored surface mask excludes the emergent wood and glass pipe. It remains an image-based approximation, not full scene ray tracing.
