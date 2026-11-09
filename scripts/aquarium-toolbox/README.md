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

`node --test scripts/aquarium-toolbox/math.test.mjs`

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
