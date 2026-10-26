// What Water mode says (WaterCare.ts and its panel), all in one place for review: the card shown as
// it is first turned on, what each reading is, the fish's condition and what troubles it, the
// panel's line on what is happening in the bowl, and the words on its controls. Plain words for
// people who keep bettas, accurate to the simulation (chemistry.mjs) and to real bowls.
// (Plain data, no imports but a type: the tests read it in Node. A number and its unit are kept
// together by a no-break space, \u00a0.)

import type { LearnCard } from '../app/learn/content';

/** Shown the first time Water mode is turned on. */
export const INTRO: LearnCard = {
  kicker: 'Water',
  title: 'Water mode',
  body: 'This bowl’s water, simulated: the fish’s waste, the bacteria that clear it, the heater, the pH. Time runs fast, about a day a minute. Try a water change, or skip a few and watch the readings.',
};

/** The readings, as a test kit and a thermometer give them: a name, the unit (for a screen reader;
 *  the chart's legend says ppm), and what it is (shown as a reading is tapped). */
export const READINGS = {
  ammonia: { name: 'Ammonia', unit: ' ppm', about: 'Ammonia (NH3/NH4+, in ppm) comes from the fish’s gills and rotting food. It should read 0. It is most toxic in warm, alkaline water.' },
  nitrite: { name: 'Nitrite', unit: ' ppm', about: 'Nitrite (NO2-, in ppm) is what the first bacteria make of ammonia. It should read 0: it stops the blood carrying oxygen.' },
  nitrate: { name: 'Nitrate', unit: ' ppm', about: 'Nitrate (NO3-, in ppm) is the end of the cycle, far milder. Water changes keep it under 20 to 40\u00a0ppm.' },
  ph: { name: 'pH', unit: '', about: 'Bettas do well from about 6.5 to 7.5. A steady pH matters more than the exact number.' },
  temp: { name: 'Temp', unit: '', about: 'Keep a betta at 78 to 80\u00a0°F (25.5 to 27\u00a0°C). This room is 70\u00a0°F: the heater makes up the rest.' },
} as const;
export type ReadingId = keyof typeof READINGS;

/** The fish's condition (chemistry.mjs condition().level). */
export const CONDITIONS = ['Thriving', 'Uncomfortable', 'Stressed', 'In danger'] as const;

/** What troubles it most (chemistry.mjs CAUSES), after its condition. */
export const CAUSES: Record<string, string> = {
  ammonia: 'ammonia burns its gills',
  nitrite: 'nitrite stops its blood carrying oxygen',
  nitrate: 'nitrate is high',
  cold: 'the water is too cold',
  chlorine: 'chlorine burns its gills',
  acid: 'the water is too acid',
  swing: 'the pH changed too fast',
};

/** In danger: what it would mean in a real bowl, and what to do. */
export const DANGER: Record<string, string> = {
  ammonia: 'In a real bowl this much ammonia would likely kill it. Change half the water now, and again each day until ammonia reads 0.',
  nitrite: 'In a real bowl this much nitrite would likely kill it. Change half the water now, and again each day until nitrite reads 0.',
  nitrate: 'Nitrate this high wears a fish down. Change a quarter of the water every day or two until it is under 40\u00a0ppm.',
  cold: 'This cold for long, a betta stops eating and falls ill. Turn the heater back on.',
  chlorine: 'In a real bowl chlorine this strong could kill it. Change water again with dechlorinator, which also neutralizes what is left.',
  acid: 'This acid for long harms a betta. Change a quarter of the water a day so the pH rises slowly.',
  swing: 'A sudden pH change shocks a fish. Change smaller amounts, more often, so the pH moves slowly.',
};

/** What is happening (chemistry.mjs happening()), most pressing first. */
export const HAPPENING: Record<string, string> = {
  chlorine: 'Untreated tap water: its chlorine is burning the fish’s gills and killing the filter’s bacteria. Always dechlorinate new water.',
  cooling: 'The heater is off. The water is cooling toward the room’s 70\u00a0°F.',
  cold: 'The water is too cold. At 70\u00a0°F a betta is sluggish, eats little and falls ill more easily.',
  warming: 'The heater is warming the water back up to 79\u00a0°F.',
  tapRinse: 'Rinsing the sponge under the tap killed most of its bacteria. Expect ammonia and nitrite for a week or two: test and change water.',
  feast: 'That is far more food than a betta can eat. Uneaten pellets rot into ammonia and feed a cloud of bacteria.',
  acid: 'The buffer (KH) is spent and the pH has fallen, slowing the bacteria. Change a quarter of the water a day to bring it back slowly.',
  bloomNew: 'A bacterial bloom: free-floating bacteria feeding on a new bowl’s organics cloud the water. It clears by itself in a few days.',
  bloomFood: 'Rotting food is feeding a bloom of bacteria that clouds the water. Siphon out leftovers and feed less.',
  stage1: 'Stage 1 of the cycle: ammonia builds up while the bacteria that eat it are few. A bowl this small needs a test, and often a change, every day while it cycles.',
  ammoniaBack: 'Ammonia in a cycled bowl: more waste than its bacteria can keep up with. Change water and go easy on food.',
  stage2: 'Stage 2: bacteria now turn ammonia into nitrite, just as toxic; the ones that eat nitrite grow more slowly. In a bowl this small, test and change water daily until both read 0.',
  stage3: 'Stage 3: ammonia is cleared, and nitrite lingers until the second bacteria catch up. Keep testing daily, changing water when it reads 0.5.',
  uncycled: 'A new bowl: no bacteria yet to clear the fish’s waste, so ammonia will build up over the first days.',
  nitrate: 'Nitrate is building up. Only water changes (and the plants, a little) take it away.',
  kh: 'The bacteria use up the water’s buffer (KH) as they work. Water changes bring it back.',
  rotting: 'Uneaten pellets are rotting on the sand into ammonia. A water change siphons them out.',
  rinsed: 'The sponge was rinsed in a cup of the bowl’s own water: the muck is out and its bacteria are safe.',
  changed: 'Fresh, dechlorinated water: ammonia, nitrite and nitrate diluted, the buffer topped up.',
  cycled: 'The bowl is cycled: bacteria turn ammonia into nitrite and nitrite into nitrate as fast as they come.',
};

/** The panel's own names: itself, its groups, its intro card's close button. */
export const PANEL = { label: 'Water', readings: 'Test readings', clock: 'Clock', care: 'Care', routine: 'Routine', start: 'Start over', sure: 'Tap again to start over', close: 'Close' } as const;

/** The panel's controls: each a label and a title (what it does). */
export const CONTROLS = {
  open: { label: 'Water', title: 'Simulate the bowl’s water: test readings, water changes, the heater and the filter' },
  expand: { label: 'More', title: 'Show the chart and the care controls' },
  collapse: { label: 'Less', title: 'Hide the chart and the care controls' },
  pause: { label: 'Pause', title: 'Stop the clock' },
  play: { label: 'Play', title: 'Run the clock: half an hour a second' },
  fast: { label: 'Fast', title: 'Run the clock fast: six hours a second' },
  change25: { label: 'Change 25%', title: 'Siphon a quarter of the water out, with the debris on the sand, and refill with tap water' },
  change50: { label: 'Change 50%', title: 'Siphon half the water out, with the debris on the sand, and refill with tap water' },
  rinseTank: { label: 'Rinse sponge in bowl water', title: 'Squeeze the filter sponge out in a cup of the bowl’s own water' },
  rinseTap: { label: 'Rinse sponge under tap', title: 'Rinse the filter sponge under the tap' },
  heater: { label: 'Heater', title: 'Switch the heater on or off' },
  dechlor: { label: 'Dechlorinator', title: 'Treat the new water of each change with dechlorinator' },
  meals: { label: 'Meals a day', title: 'Three pellets a meal, given on time (at Fast, counted without opening the lid)' },
  routine: { label: 'Water changes', title: 'Water changes done for you at 10\u00a0am; or the water tested daily, half changed when ammonia or nitrite reads 0.5\u00a0ppm or more' },
} as const;

/** The routine's choices. */
export const MEALS = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Once' },
  { value: 2, label: 'Twice' },
  { value: 4, label: 'Four times' },
] as const;
export const CHANGES = [
  { value: 'none', label: 'None' },
  { value: 'weekly', label: '25% weekly' },
  { value: 'twice', label: '50% twice a week' },
  { value: 'test', label: 'When the test says so' },
] as const;

/** Where the simulation can start (chemistry.mjs BowlWater.start). */
export const STARTS = [
  { value: 'new', label: 'New bowl', title: 'Set up today, the fish in today: no bacteria yet' },
  { value: 'cycled', label: 'Cycled bowl', title: 'Its bacteria grown, kept well with weekly changes' },
  { value: 'neglected', label: 'Neglected bowl', title: 'Cycled, then two months without a water change' },
] as const;

/** The chart: its title, and its series' names (ppm). */
export const CHART = {
  title: 'The nitrogen cycle, day by day',
  unit: 'all in ppm',
  top: 'Ammonia and nitrite (ppm)',
  bottom: 'Nitrate (ppm)',
  day: 'Day',
} as const;
