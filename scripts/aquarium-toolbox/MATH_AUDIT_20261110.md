# Aquarium Toolbox math and decision-logic audit — 2026-11-10

Scope: all 38 calculators, mathematical formulas, units, boundaries, decision text,
and the inputs/graphs customers actually use. Release target: **Hidden Reef Lab only**.
No production store, inventory, checkout, or personal-site publication is included.

## Confirmed fixes

- Integer rounding: exact whole bag/dose counts could gain or lose one through
  binary floating-point noise. Round only machine-precision noise at integer
  boundaries; real partial bags still round up and partial doses down. Shortcuts
  and the result use the same rule. Reject counts beyond safe integer precision.
- Bow-front geometry: use a stable angle and small-angle segment formula so a
  shallow positive bow does not disappear through subtraction cancellation.
- Ammonia: the graphic now converts total-ammonia-as-nitrogen to the same NH3
  mass basis as the toxic-ammonia result. Clarify that the input is total ammonia,
  not a free-NH3-only test. This estimate remains freshwater-only.
- Hardness units: switching degrees/ppm/meq now converts the entered physical
  reading instead of reinterpreting it as a different concentration.
- Reef supplements: changing the parameter clears all three product-strength
  numbers. A calcium dose cannot silently inherit an alkalinity product label.
- Consumption: an increasing reading is a positive observed rise, not a negative
  consumption/dosing instruction.
- Nitrate chart: elapsed days follow the chosen interval. Water changes are
  instantaneous vertical steps, not week-long gradual declines.
- Stocking: goldfish count and status agree at the exact 20-gallon/10-gallon
  thresholds. Numeric rules remain available, but volume/length comparisons no
  longer claim safe stocking approval or guaranteed room for more fish.
- Heater: capacity below the calculated requirement no longer passes through a
  10% allowance. Graphs use the unrounded estimate; splitting heaters is not
  described as automatic protection against failure.
- Tiny times and graphs: preserve nonzero drip and CO2 duration results; do not
  invent a one-minute heating time or display zero seconds for a positive trace.
  Normalize small chart values relative to the data, not an arbitrary 1e-9 floor.
- Fertilizer: stock concentration uses final solution volume after dissolving,
  not water added to powder. Flag a calculated dose larger than one stock bottle.
- Salinity/units: reject evaporation extrapolations beyond the dissolved-salt
  model range; accept only arithmetic noise at converted input endpoints.
- Supporting logic: salt supply capacity is not labelled as capacity remaining
  after the current batch; splitting water changes is not claimed equivalent to
  one large change; RO rejection is compared with the membrane's own rating;
  sump measurements include return-siphon drawdown. ppm and mg/L are described as
  approximately equivalent in dilute freshwater, not universally identical.

## Independent numerical coverage

Each of these 38 tools has a separately specified reference example in
`scripts/aquarium-toolbox/independent-math.test.mjs`:

Tank volume; substrate; stocking; filled tank weight; system volume; sump;
DIY glass; water change; target water change; repeated changes; nitrate;
RO/tap blend; RO time/waste; label dose; ammonia; hardness; stock dilution;
salt mixing; salinity adjustment; salinity blend; SG/ppt; ATO;
supplement dose; consumption; turnover; head loss; pump curve; pipe speed;
drip timer; heater; electricity; heat-up; water/salt cost; CO2 KH/pH;
CO2 cylinder; dry fertilizer; dosing pump; DLI.

Additional checks cover all six tank shapes, exact integer boundaries, molecular
mass equivalence, unit inverses, a laminar head-loss check using Hagen–Poiseuille,
and 500 deterministic randomized conservation/inverse/scaling scenarios. Nitrate
equilibrium is also checked as a fixed point of water change plus production.

## Verification before publication

- 191 Node calculation tests passed (includes the 500-scenario property test).
- Source browser suites: 118 general, 21 US units, 119 presets, 333 sliders,
  15 hobbyist, 1,293 edge-case assertions, and 66 new math/logic assertions.
- Lab local checks: 975 presentation/interaction assertions across all 38 tools,
  plus 70 new math/logic assertions at 1440px and 390px.
- Lab worker/isolation tests, build privacy scan, link checks and visual review
  of desktop/phone output passed.

These are automated assertions, not claims of an exhaustive proof of every
possible aquarium. Stocking/heater/flow guidelines, salt recipes, SG conversion,
CO2 KH/pH and simplified hydraulic models retain their stated assumptions.
A calculator cannot infer species compatibility, product strength or actual
installed-system performance from numbers it has not been given.

## Reproduce

From the shared-source checkout:

```sh
node --test scripts/aquarium-toolbox/*.test.mjs
node scripts/aquarium-toolbox/math-logic-browser.mjs http://127.0.0.1:8899/aquarium-toolbox/ /tmp/toolbox-math-browser
node scripts/aquarium-toolbox/edge-cases-browser.mjs http://127.0.0.1:8899/aquarium-toolbox/ /tmp/toolbox-edge-browser
```

For the Lab, sync the committed source with the existing adapter, then use
`npm run build`, `npm run test:lab`, and
`node tools/aquarium-toolbox.browser.mjs http://127.0.0.1:8790`.
The focused math/logic browser suite also accepts the Lab toolbox URL.

## Sources checked

- Aqueon FAQ: https://www.aqueon.com/resources/faqs — adult-length guideline and
  its stocking limitations.
- Aquarium Co-Op fancy goldfish guide:
  https://www.aquariumcoop.com/blogs/aquarium/care-guide-for-fancy-goldfish —
  20/10-gallon starting guideline, adult growth and swimming-space caveats.
- Bulk Reef Supply membrane rejection FAQ:
  https://www.bulkreefsupply.com/content/post/faq-47-dow-membrane-rejection-rates-explained
  — membrane-specific ratings and operating conditions.
- Emerson freshwater ammonia equilibrium and ordinary dimensional analysis,
  mass conservation, geometry, hydraulic and heat-energy equations as linked
  in the calculators' math/source sections.

## Publication separation

The shared-source commit is retained on `task/aquarium-math-20261110`, not merged
into `jez237-site/main`. A main commit can be published later by an unrelated
personal-site auto-build even when its own build was skipped. Lab sync records
this task's exact source commit and file hashes. Promote the source branch to the
personal site only when that publication is authorized.

## Follow-up check, same day

Superseded by the follow-up check recorded in README.md ("Follow-up check"):
the stocking, heater-splitting and RO messages are plain verdicts again, flow
above the usual range is no longer coloured as a fault, and the CO2 bands were
widened to five. The numerical fixes listed above are unchanged and still tested.
