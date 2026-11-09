# Aquarium Toolbox

Standalone preview at `https://jez237.com/aquarium-toolbox/`, requested by Jez on
2026-11-09. This is not installed on Hidden Reef. Keep the preview `noindex`
until an intentional final publishing decision. No accounts, backend writes,
analytics added by this application, third-party fonts, dependencies, or build step.

## Source

- `aquarium-toolbox/calculators.mjs`: 36 calculators, field schema, domain limits,
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

- No generic stocking-per-gallon rule, prescribed medication dose, floor-safety
  verdict, structural glass specification or pH mixing calculation.
- Dosing scales a supplied label/analysis; it does not pick the correct product,
  safe target or dose interval. Disclose units and purity.
- Ammonia is freshwater-only, 0–40°C / pH6–10, with N and NH3 mass bases distinct.
- CO2 from KH/pH assumes carbonate-only buffering; it is not a direct measurement.
- Salinity mixing uses volume-weighted approximation, not exact density balance.
- Heater sizing is a user-selected allowance, not a heat-loss model.
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
litres, kept in label units even in US mode. Bag count is ceil(bed mass / bag mass)
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
