# Aquarium Toolbox

Standalone preview at `https://jez237.com/aquarium-toolbox/`, requested by Jez on
2026-11-09. This is not installed on Hidden Reef. Keep the preview `noindex`
until an intentional final publishing decision. No accounts, backend writes,
analytics added by this application, third-party fonts, dependencies, or build step.

## Source

- `aquarium-toolbox/calculators.mjs`: 38 calculators, field schema, domain limits,
  formulas, assumptions and references. Internal SI units never depend on UI units.
- `aquarium-toolbox/illustrations.mjs`: original SVG diagrams, updated from results.
- `aquarium-toolbox/app.mjs`: saved working tanks, search, favorites, validated
  imports, exports, sharing via URL fragment, print layout and live interaction.
- `aquarium-toolbox/styles.css`, `index.html`, `icon.svg`: responsive presentation.

## Verification

`node --test scripts/aquarium-toolbox/*.test.mjs`

This includes independent worked examples for every calculator, dilution/mass
conservation, unit round trips, impossible targets, invalid numbers, ammonia
reporting basis and volume scaling. Keep tests independent of implementation
formulas. The ammonia example uses the Emerson equilibrium at 25°C / pH8 and
explicit nitrogen-to-NH3 molecular-weight conversion.

`node scripts/aquarium-toolbox/browser.mjs [base-URL] [evidence-directory]`

The local browser runner uses the already-installed OpenClaw Playwright package
and Chromium. It runs each calculator at 1440, 390 and 320 px and exercises
validation, saved state, sharing and units. Run on the hosted preview as well.
Paths are host-specific QA tooling, never imported by the browser app.

## Scientific limits

- No prescribed medication dose, floor-safety verdict, structural glass
  specification or pH mixing calculation. The stocking check applies the classic
  volume and surface rules of thumb and says so; it is not a species guide.
- Dosing scales a supplied label/analysis; it does not pick the correct product,
  safe target or dose interval. Disclose units and purity.
- Ammonia is freshwater-only, 0–40°C / pH6–10, with N and NH3 mass bases distinct.
- CO2 from KH/pH assumes carbonate-only buffering; it is not a direct measurement.
- Salinity mixing uses volume-weighted approximation, not exact density balance.
- Heater sizing is a rule of thumb fitted to published heater charts for covered
  glass tanks, not a heat-loss model.
- Pipe head uses 20°C water, single full-bore line, Darcy–Weisbach with 64/Re
  laminar and Swamee–Jain turbulent friction; flag the transition regime.
- A pump curve is bracketed interpolation, never extrapolation or a guaranteed
  operating point. Sump reserve needs a real supervised power-off test.
- Show litres with US gallons and L/h with US GPH. Round displayed US gallons to
  whole gallons; positive sub-gallon amounts display `<1`. Calculation precision
  is retained internally. Converted input display is rounded separately.

## State and privacy

Browser storage key: `aquarium-toolbox-v1`. No tank data leaves the device through
the application. Explicit shared links include only one calculation's inputs and
units in a URL fragment, not the tank name. Backups are bounded to 100 KB / 20
profiles and validated before replacing state. Invalid edits are not persisted.
Shared links and imported text are untrusted; escape display text and select only
known fields/IDs. All mathematics is deterministic client-side JavaScript.

## Release

Use the repository's guarded Pages release wrapper from a complete current,
committed and pushed publishing checkout. Never upload the sparse editing worktree.
Preserve all unrelated assets, Functions and route policies. Do not deploy the
Hidden Reef project. The existing Pages wrapper verifies its established site
contracts before production; preserve those checks.

## Slider controls

Every visible numeric calculator field has a companion touch-friendly native
range input. Exact-number inputs remain authoritative: never clamp a typed value
to the convenience slider range, nor convert an untouched value back from its
rounded display. `sliders.mjs` chooses useful editing windows and increments,
including selector-dependent calcium/alkalinity, hardness and TDS scales. Manual
values outside the window expand it on input/re-render; dragging itself never
changes its bounds. These ranges are not husbandry or dosing recommendations.

Range inputs use `step=any` to reflect precise typed values; pointer values snap
to the defined editing increment, and Arrow/Page/Home/End keys are handled with
that same increment and native range bounds. Fields retain focus during updates.
Blank or invalid numeric fields cannot leave a stale result visible. The mobile
summary is shown only when inputs intersect the viewport and the full result
does not, and repeats no live region. Sliders/summary are excluded from printing.

The Filter & flow check asks the tank type before the flow, because the type decides
what to add up: one filter, every pump and wavemaker in a reef, or the return pump
alone (`labelFor` / `helpFor`). Its flow slider follows the tank: the window is twice
the top of the usual range for that tank type (`flowGuide`), so the range can be
reached by dragging on a nano tank and a large reef alike, and changing the tank
volume gives the flow slider its new window. The result graphic carries `kind`,
`mark` (the visitor's bar) and `status` (`low`, `ok`, `high`) for renderers that
show a picture or a colour by answer. The Stocking check (kind of fish) and Gravel &
substrate (material) results carry `kind` for the same reason. The note about the size on the box is said
once, in the volume field's help.

`node scripts/aquarium-toolbox/sliders-browser.mjs [base-URL] [evidence-directory]`
checks all numeric sliders in US/metric, keyboard steps, actual mouse dragging,
touch input, precision, adaptive ranges, persistence, invalid input, mobile
summary visibility and print hiding. Run alongside the original browser suite.

## Familiar-size shortcuts (2026-11-09)

`presets.mjs` holds curated common package sizes, nominal tank capacities,
container/bottle sizes, depths, equipment wattages and time intervals. No preset
represents store inventory, a measured water reading, or a safe chemical dose.
Users may always type a custom value. Profile size buttons edit the dialog only;
saving remains explicit. Nominal volumes need adjustment to actual water volume.

Substrate bags accept either kg (displayed as lb in US mode) or volume-labelled
litres (US mode shows gallons plus the original package litres). Bag count is ceil(bed mass / bag mass)
or ceil(bed volume / bag litres), respectively. Loose bulk density is a rough,
user-overridable estimate; generic material buttons are not measured brand data.
The shopping guide compares every displayed common size using the same units.
Volume-labelled bag counts do not depend on material density. Water displacement
and substrate bed volume are different concepts; do not conflate them.

`migrateInputs` narrowly upgrades legacy substrate saves/links missing both new
fields to **volume** mode, preserving the old bag quantity and resulting count.
Malformed new fields still fail validation. The storage version is unchanged
because existing source fields/units retain meaning. Backup, restore, share,
printing, sliders and typed precision must remain compatible.

Representative package references (checked 2026-11-09):
- CaribSea 2025 catalog: https://caribsea.com/wp-content/uploads/2025/09/2025-CaribSea-Catalog-new_compressed.pdf
- https://aquariumswest.com/collections/plant-soil (2/4/8 kg and 3 L packages)
- https://www.zynaquatics.com/shop-12 (5 lb gravel, 10 L soil)
These are evidence of package conventions, not a current stock or price feed.

Run `node scripts/aquarium-toolbox/presets-browser.mjs [base] [evidence-dir]` for
US/metric shortcuts, exact custom entry, both bag modes, bag comparison, legacy
saved settings/shares, profiles and mobile checks. The formula/preset unit tests
are included by `node --test scripts/aquarium-toolbox/*.test.mjs`.


## US-first presentation (2026-11-09)

US is the default; explicit saved, restored and shared metric preferences remain
available. Fields, drawings, graph values, accessible descriptions, result cards,
error ranges, common-size buttons and printed results use the selected units.
Lengths/bore use inches, head/pipe runs use feet, volumes use US gallons, flow uses
US GPH, bulk weights use pounds, temperatures use °F, areas use ft²/in², footprint
load uses lb/ft², and velocity uses ft/s. Costs use $/lb, $/ft² and $/1,000 US gal.
Heater allowance uses W/US gal and salt recipes oz/US gal. Product doses, fertilizer
weights, chemistry and PAR retain conventional mL/g/mg/L/dKH/ppt/PAR units.

`convert` stores each ratio as SI quantity per ONE US unit; unit prices require
inverse denominator factors. Do not just rename units. The salt bag's displayUnit
metadata converts bulk grams to pounds without changing its persisted grams;
chemical grams are not globally converted. Volume bags similarly keep stored
litres and their actual product-label litres visible beside rounded US gallons.
Graphs receive unit metadata and are converted on a copy at rendering time.
`us-copy.mjs` supplies matching US formula explanations (e.g. cubic inches / 231).

Do not recompute canonical inputs from rounded displayed values during unit
switches. Valid saved profiles, links and backups retain their exact physical
meaning and original source units. Browser tests include both US/metric bag modes,
legacy data, billing equivalents, label units, phone widths and printed diagrams.
Run `node scripts/aquarium-toolbox/us-units-browser.mjs [base] [evidence-dir]`
alongside unit/conversion and existing browser/preset/slider suites.


## Everyday-use rework (2026-11-09)

Jez asked that the calculators be truly useful to the average hobbyist. Every tool
was read as a US hobbyist would see it; the rework keeps the math and changes what
is asked, how it is worded and what leads the page.

- **Starting examples.** `defaults(calc, us)` gives round numbers in the selected
  system (24 x 12 x 16 in tank, 20 US gal saved tank, 100 GPH filter) instead of
  converted metric values. `legacy.mjs` holds the first preview's examples so an
  untouched one saved by an earlier visit is replaced; anything a visitor typed
  never matches and is kept exactly.
- **Standard tanks.** `standardTanks` in `presets.mjs` fills length, width, height,
  volume and empty weight for 5.5 to 180 gal glass tanks (Aqueon's 2023 dimension
  chart). Tank volume also handles bow-front, hexagon and corner tanks, and shows
  only the measurements that apply to the chosen shape.
- **New tools.** Stocking check (1 in of adult fish per US gal and 12 in² of surface
  per inch for small tropicals; 3 gal / 30 in² coldwater; 5 gal / 48 in² marine) and
  a salinity / specific gravity converter. 38 tools in all.
- **Heater size** asks for the coldest room temperature and the water temperature
  wanted: W = 0.85 x (US gal)^(2/3) x °F rise, rounded up to a common size, split
  into two heaters above 300 W.
- **Filter & flow check** compares turnover with the usual range for the tank type:
  community 4-6x, messy fish 6-10x, soft coral / LPS 20-30x, SPS 30-40x, sump
  return 3-5x after head loss.
- **Reef tools** accept specific gravity or ppt (`sg = 1 + 0.000754 x ppt` at
  77 °F); the choice is saved and travels in shared links as `sal=`.
- **Return pump head** counts elbows and valves (K = 0.9, 0.4, 0.2 and 2 for a
  90° elbow, 45° elbow, open valve and check valve) and offers Schedule 40 pipe
  sizes, instead of asking for a loss coefficient and roughness.
- **Everyday units.** Test readings say ppm, RO units are rated in gallons per
  day (default waste ratio 4 : 1), small amounts read in cups, quarts, teaspoons
  and five-gallon buckets, durations in hours and minutes.
- **Library.** "Most used" opens first, specialist tools carry an Advanced tag,
  and search matches plain words (`keywords` in `calculators.mjs`). A tool opened
  from a link, a search result or a saved visit switches the library to its own
  category, so the open tool is always marked in the list.

Reference numbers were checked on 2026-11-09 against Aqueon (tank chart, heater
charts, stocking and turnover guidance), Bulk Reef Supply (reef flow, return
pumps, RO units), Randy Holmes-Farley (specific gravity table), Red Sea and
Tropic Marin directions (salt per gallon), Seachem (free-ammonia alert scale),
GF Harvel (pipe sizes) and EIA (electricity price). Read second-hand only: Fritz
and Instant Ocean directions (retailer copies of the label) and CaribSea, Seachem
and Oase substrate weights (a third-party compilation). Instant Ocean needs about
0.6 cup per gallon for 35 ppt, more than the 1/2 cup most reef salts use; the
salt tool says so. Not confirmed from a maker: glass thickness for standard tanks
(inferred from empty weights), whether hobby ammonia kits report as NH3 or as
nitrogen, and any authoritative marine inches-per-gallon figure.

`hobbyist.test.mjs` covers the new formulas, standard-tank data, legacy upgrades
and search words, and runs with `node --test scripts/aquarium-toolbox/*.test.mjs`.
`node scripts/aquarium-toolbox/hobbyist-browser.mjs [base-URL] [evidence-directory]`
checks the first visit, the tank picker, the new shapes, everyday units, heater /
flow / stocking guidance, specific gravity entry, legacy settings, search, the
library following the open tool, phone widths and print.
