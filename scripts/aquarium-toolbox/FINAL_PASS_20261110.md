# Final pass — 2026-11-10, 05:30 request

Jez, #hidden-reef-3, 05:30 EST: "Do another pass. Try to make this the final pass".
Publication scope: Hidden Reef **Lab only**. Source `08d4b6f88` was the starting point.

Earlier passes checked the arithmetic, the verdicts and the journeys around the calculators. This pass read
what none of them had read end to end: every "math & sources" note and link, every message a visitor can
trigger by typing a wrong number, the guide and help text, the search box, the printed page, and the two
passes made after 02:00 for regressions.

## Found and fixed

- **Search could not find CO₂.** Typing `co2` matched nothing, because the titles say "CO₂". Search now reads
  subscripts and accents the way people type them (`co2`, `decor`), ignores a plural ending and the word
  "calculator", and knows more everyday words: chlorine, chloramine, nitrite, phosphate, betta, goldfish,
  liters, turnover, doser, kalkwasser, coral, cycling.
- **Wrong-number messages showed converted internal limits**: "Inside length must be between 0.03937008 and
  1968.504 in.", "pH must be between 4 and 10 pH.", "The label says to use must be between 0.001 and
  1000000 ." They now say what to fix: `“Inside length” must be more than 0.`, `“pH” must be between 4 and
  10.`, `“Reading in the tank now” cannot be negative.`, `“Water in your tank” must be no more than
  2,640,000 US gal.` A blank field is named as written on screen (`Enter a number for “RO water you need”.`,
  not "…for ro water you need"). Readings say ppm, as the fields do.
  - Rule (`rangeMessage` in `calculators.mjs`): a tiny lower limit that only keeps zero out says "more than
    0"; a zero limit says "cannot be negative"; temperature, specific gravity and real ranges (1–100 %,
    pH 4–10) say "between"; anything else says "at least" or "no more than". Limits are rounded inward (lower
    up to 2 significant digits, upper down to 3), so every number inside the stated range is accepted.
- **The tank panel** said "Enter a name and a water volume between 0.002642 and 2,641,720 US gallons", and its
  Save button let the browser answer first with its own "Value must be greater than or equal to
  0.00264172052". It now names the box to fix ("Give the tank a name.", "The water in the tank must be more
  than 0.") and puts the cursor there; the form is `novalidate`, so both buttons behave the same.
- The hint under "Reading you want" (RO blend, reef supplement) called the target a test result.
- **A typed comma was blocked for everyone** (04:58 change). Where the comma is the decimal mark, Safari and
  Chrome read `24,5` correctly, and an iPhone's decimal keypad only offers the comma, so those visitors could
  not enter a decimal at all. The comma is now stopped only where the browser would drop it: Chrome and Safari
  follow the visitor's language, Firefox the page's (English). Measured in all three engines.
- **US "math & sources" text**: filled-tank weight showed "1 kg per litre" in US units (now 8.345 lb per US
  gallon fresh, about 8.54 salt); the tank formula named four of the six shapes (corner and oval added, both
  unit systems); pipe speed and heat-up were conversion recipes (now `0.00681 × GPH ÷ in²` and
  `gallons × °F × 0.00245 ÷ share kept`); the fertilizer formula said mg/L where the field says ppm.
- **Reference links**: product dose, reef supplement dose and reef consumption linked the dilution article,
  which is not their method. They now show the method line.
- **Top-off**: "The prediction exceeds 100 ppt, outside this dissolved-salt approximation…" now reads "That
  much evaporation would leave the water saltier than 100 ppt, about three times seawater, which is more than
  this estimate covers. Use fewer days."
- **Phone summary button** still said "See diagram" in the page source until the script replaced it.
- **Safari before 15.4** has no `<dialog>`: the guide, share, tank and backup panels did nothing. They now open
  as fixed panels there (`dialog-fallback`), close with × or Escape.

## Checked and left as it is

- All eight reference links answer (HTTP 200) and say what the note claims.
- axe-core 4.12 on the Lab build: no violations in 26 states (8 tools, an error, three panels, empty search, at
  phone and desktop width). Worst-case text contrast over every gradient stop: 5.78:1 (AA needs 4.5:1).
- Formulas and notes of all 38 tools against the code, in US and metric text.
- Guide, hero, tank and backup wording; favourites and search empty states; "Link copied".
- Volumes are US gallons (no UK gallons); stocking, heater and flow answers are rules of thumb and say so.

## Tests

- `final.test.mjs` (7): every out-of-range message for every field in US, metric and specific gravity is one
  short line, names the field as shown, carries no long converted number, and states only limits that are
  themselves accepted; the US formula numbers are checked against the calculators.
- `final-browser.mjs <toolbox-url> [evidence-dir] [chromium|firefox|webkit]`: search words, error cards,
  formula text, comma in English and German, panels without `<dialog>`.
