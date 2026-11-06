// "What to do now" plans for the reef section. Treatment types, never doses.
// Every plan starts with the tests. Steps can carry a tag:
//   'safe' → a product or action that is fine in a reef display ("Reef-safe")
//   'dip'  → pest/coral dips: in a separate container, never in the display.
// No plan ever doses copper or fish medicine in the display.

import { POND_PLANS } from './pond-data.mjs';

export const STEP_TAGS = {
  safe: 'Reef-safe',
  dip: 'Separate dip — never in the display',
  pond: 'Pond product — dose by pond volume',
};

export const INVERT_WARNING = 'Copper and most fish medicines kill shrimp, crabs and snails. Never dose them in a tank with inverts.';

const TEST_CORAL = { text: 'Test alkalinity, calcium, magnesium, nitrate, phosphate, temperature and salinity. Usual ranges: alk 7–11 dKH · calcium 400–450 · magnesium 1250–1400 · nitrate 2–10 ppm · phosphate 0.03–0.1 ppm · 76–79 °F (25–26 °C) · salinity 1.025–1.026.' };
const TEST_INVERT = { text: 'Test salinity, temperature, ammonia, nitrite and magnesium. Usual: salinity 1.025–1.026 · 76–79 °F (25–26 °C) · ammonia and nitrite 0 · magnesium 1250–1400.' };
const s = (text, tag) => (tag ? { text, tag } : { text });

const PLANS = {
  bleaching: {
    steps: [TEST_CORAL,
      s('Check the temperature first. Keep it steady at 76–79 °F (25–26 °C)—a stuck heater or a hot room is a common cause.'),
      s('If the light changed lately, turn it down or move the coral lower.'),
      s('Leave it in one spot and spot-feed a little coral food once or twice a week.', 'safe')],
    treatment: 'Fix the heat or light, then keep everything steady',
    recovery: 'Color can return over 2–8 weeks if the flesh stays on.',
  },
  'alk-swing': {
    steps: [TEST_CORAL,
      s('Bring alkalinity back slowly—no more than 1 dKH a day.', 'safe'),
      s('Check your dosing pump, kalk or two-part. A missed, empty or doubled dose is the usual cause.'),
      s('Test alkalinity every day for a week until it holds steady.')],
    treatment: 'Steady alkalinity with small, slow corrections',
    recovery: 'Polyps often open again within days once alk is steady.',
  },
  'high-nutrients': {
    steps: [TEST_CORAL,
      s('Bring nitrate and phosphate down slowly. Aim for nitrate under 10 ppm and phosphate under 0.1 ppm.'),
      s('Feed a little less and clean filter socks or sponges every few days.'),
      s('Do a 10–20% water change each week. A skimmer or phosphate remover helps too.', 'safe'),
      s('Check the light still works and isn’t blocked—shaded corals go brown too.')],
    treatment: 'Lower nutrients slowly; check the light',
    recovery: 'Color comes back over 2–6 weeks.',
  },
  'low-nutrients': {
    steps: [TEST_CORAL,
      s('If nitrate and phosphate read zero, feed a little more. Aim for nitrate 2–10 ppm and phosphate 0.03–0.1 ppm.'),
      s('Ease off nutrient removal: less phosphate remover or carbon dosing for now.'),
      s('Spot-feed corals a little coral food once or twice a week.', 'safe')],
    treatment: 'Feed a bit more; ease off nutrient removal',
    recovery: 'Color usually improves over 2–4 weeks.',
  },
  rtn: {
    steps: [TEST_CORAL,
      s('Frag off the healthy part today. Cut above the line where flesh is peeling and glue the piece to a plug.'),
      s('Dip the frags in a coral dip, then rinse in tank water.', 'dip'),
      s('Take the dying piece out so it doesn’t foul the water.'),
      s('Keep alkalinity and temperature steady, and check your other SPS every day.')],
    treatment: 'Frag the healthy part fast; steady alk and temperature',
    recovery: 'Frags that keep their flesh heal over 1–3 weeks.', product: true,
  },
  stn: {
    steps: [TEST_CORAL,
      s('Check alkalinity and phosphate first. Slow loss often follows low phosphate or alk swings.'),
      s('Look closely at the base for flatworms or red bugs.'),
      s('If it keeps creeping, frag off the healthy tips and dip them.', 'dip'),
      s('Take a photo each day to see if it has stopped.')],
    treatment: 'Steady parameters; frag if it keeps creeping',
    recovery: 'Often stops in 1–2 weeks once the cause is fixed.', product: true,
  },
  'brown-jelly': {
    steps: [TEST_CORAL,
      s('Take the coral out today into a bowl of tank water.'),
      s('Blow or siphon the jelly off with a turkey baster.'),
      s('Dip it in an iodine-type coral dip, then rinse.', 'dip'),
      s('Keep it apart from other LPS until it’s been clean for a week—it spreads.')],
    treatment: 'Remove, blow off the jelly and dip',
    recovery: 'Clean corals can recover in 1–3 weeks.', product: true,
  },
  'light-shock': {
    steps: [TEST_CORAL,
      s('Turn the light down or move the coral lower in the tank.'),
      s('Raise the light slowly—start at about half and go up over 2–4 weeks.'),
      s('Give it a week before moving it again.')],
    treatment: 'Less light, then raise it slowly',
    recovery: 'Usually 1–3 weeks.',
  },
  'flow-placement': {
    steps: [TEST_CORAL,
      s('Check the flow. Polyps should sway gently—not be blasted flat or sit in still water.'),
      s('Give it a hand’s width of space from other corals. Many sting their neighbors at night.'),
      s('Move it once, then leave it a week to settle.')],
    treatment: 'A better spot: gentle flow, space and the right light',
    recovery: 'Opens again within days in a good spot.',
  },
  'red-bugs': {
    steps: [TEST_CORAL,
      s('Look closely with a flashlight for tiny red-orange specks.'),
      s('Dip affected corals in a coral pest dip. Repeat once a week for 3–4 weeks to catch new hatchlings.', 'dip'),
      s('Dip every new acropora before it goes in the tank.', 'dip')],
    treatment: 'Repeated coral pest dips',
    recovery: '3–4 weeks of weekly dips.', product: true,
  },
  aefw: {
    steps: [TEST_CORAL,
      s('Dip the coral in a coral pest dip and blow it off with a turkey baster. Repeat every week for a month.', 'dip'),
      s('Look for egg clusters on bare skeleton and scrape or cut them off.'),
      s('Dip and check every new acropora before it goes in.', 'dip')],
    treatment: 'Weekly pest dips and scraping off eggs',
    recovery: '4+ weeks; repeat dips catch new hatchlings.', product: true,
  },
  'monti-nudi': {
    steps: [TEST_CORAL,
      s('Pick off any slugs you can see with tweezers or a turkey baster.'),
      s('Dip the montipora in a coral pest dip. Repeat weekly for 3–4 weeks.', 'dip'),
      s('Look under the plates for white egg spirals and scrape them off.')],
    treatment: 'Remove slugs and eggs; weekly pest dips',
    recovery: '3–4 weeks.', product: true,
  },
  'zoa-pests': {
    steps: [TEST_CORAL,
      s('Look closely at night with a flashlight for tiny spiders or slugs.'),
      s('Dip the colony and blow it off with a turkey baster. Pest dip for spiders or slugs; iodine-type dip for white pox bumps. Repeat weekly.', 'dip'),
      s('Remove fully melted polyps so they don’t spread it.')],
    treatment: 'Coral dips (pest or iodine) in a separate container',
    recovery: '2–4 weeks.', product: true,
  },
  aiptasia: {
    steps: [TEST_CORAL,
      s('Kill each one with an aiptasia gel or paste made for reef tanks. Squirt it right onto the anemone.', 'safe'),
      s('Or add a natural predator, like peppermint shrimp or Berghia nudibranchs.', 'safe'),
      s('Don’t scrape or break them—every bit can grow back.'),
      s('Feed a little less—they live off leftovers.')],
    treatment: 'Reef-safe aiptasia gel, or a natural predator',
    recovery: 'A few weeks; check for new ones each week.', product: true,
  },
  'anemone-stress': {
    steps: [TEST_CORAL,
      s('Cover pump and powerhead intakes so it can’t get sucked in.'),
      s('Check the light. Anemones need strong light; if the light is new, raise it slowly.'),
      s('Feed a small piece of shrimp or mysis once a week. If it spits food, feed smaller bits less often.', 'safe'),
      s('Let it pick its own spot—don’t pull it off the rock.')],
    treatment: 'Steady water, good light, covered intakes, light feeding',
    recovery: 'Usually settles within 1–2 weeks.',
  },
  nipped: {
    steps: [TEST_CORAL,
      s('Watch the tank for a while, and at night with a dim red light, to catch who’s nibbling.'),
      s('Move the coral, or rehome the fish or crab that picks at it.'),
      s('Common culprits: angelfish, butterflyfish, some crabs and hungry hermits.')],
    treatment: 'Find the nibbler; move or protect the coral',
    recovery: 'Heals in 1–3 weeks once it stops.',
  },
  'coral-normal': {
    steps: [TEST_CORAL,
      s('Corals close at night and for a day or two after being moved or handled.'),
      s('Leather corals shed a waxy skin every few weeks. A little extra flow helps it come off.'),
      s('Take a photo and compare tomorrow.')],
    treatment: 'Nothing—just keep things steady',
    recovery: 'Opens again within a day or two.',
  },

  'failed-molt': {
    steps: [TEST_INVERT,
      s('Don’t pull the old shell off—you can tear the new one.'),
      s('Keep salinity steady: top off with fresh RO water every day so it doesn’t creep up.'),
      s('Keep magnesium in range, and do small regular water changes to replace iodine.', 'safe'),
      s('If fish are picking at it, move it to a breeder box in the tank.')],
    treatment: 'Steady salinity, good magnesium, regular water changes',
    recovery: 'Many survive if they get free within a day.',
  },
  copper: {
    steps: [TEST_INVERT,
      s('Stop all medicine now. Never dose copper or fish medicine in a tank with inverts.'),
      s('Add fresh activated carbon or a copper remover, and do a 25–50% water change.', 'safe'),
      s('Move surviving inverts to a copper-free tank if you have one.'),
      s('Copper sticks to rock and sand—test for copper before adding new inverts.')],
    treatment: 'Stop the medicine; carbon and big water changes',
    recovery: 'Survivors improve within days; copper can linger for months.', product: true,
  },
  acclimation: {
    steps: [TEST_INVERT,
      s('Match salinity and temperature. Inverts need them almost exactly the same.'),
      s('Keep the light dim for a day and don’t move it again.'),
      s('Next time, drip-acclimate slowly over 1–2 hours.')],
    treatment: 'Steady salinity and temperature; slow drip acclimation',
    recovery: 'If it gets through the first 2–3 days, it usually recovers.',
  },
  'invert-water': {
    steps: [TEST_INVERT,
      s('Add aeration—point a pump at the surface so it ripples.'),
      s('Do a 25% water change with salinity- and temperature-matched water.', 'safe'),
      s('Remove anything dead or rotting right away.'),
      s('Check the pumps and skimmer are running.')],
    treatment: 'More oxygen, a water change, remove anything dead',
    recovery: 'Improves within hours to days.',
  },
  starvation: {
    steps: [TEST_INVERT,
      s('Feed algae wafers or nori for snails and urchins.', 'safe'),
      s('Spot-feed shrimp and crabs a pinch of sinking food twice a week.', 'safe'),
      s('Don’t add more clean-up crew until the ones you have are thriving.')],
    treatment: 'Extra food (nori, algae wafers, sinking pellets)',
    recovery: '1–2 weeks.',
  },
  bopyrid: {
    steps: [TEST_INVERT,
      s('Leave it be. It’s a parasite under the shell—usually not deadly.'),
      s('Don’t medicate the tank—nothing reef-safe kills it.'),
      s('It sometimes comes off at a molt. Keep the shrimp if it’s eating and active.')],
    treatment: 'Usually just watch—no medicine',
    recovery: 'May drop off at a molt; often lives with it.',
  },
  'normal-molt': {
    steps: [TEST_INVERT,
      s('Leave the empty shell. Your shrimp or crab is hiding while its new shell hardens.'),
      s('Look for it in a day or two—it will look extra bright and clean.'),
      s('Take the shell out only if it starts to smell.')],
    treatment: 'Nothing—a molt means it’s growing',
    recovery: 'The new shell hardens in 1–2 days.',
  },
  'invert-injury': {
    steps: [TEST_INVERT,
      s('Give hermit crabs spare empty shells—they fight over them.'),
      s('Separate a bully with a breeder box, or rehome it.'),
      s('Lost legs and claws grow back over the next few molts.')],
    treatment: 'Spare shells, hiding places, separate the bully',
    recovery: 'Legs regrow over 2–3 molts.',
  },
  flipped: {
    steps: [TEST_INVERT,
      s('Turn the snail right side up onto the rock or glass.'),
      s('If it doesn’t move in a day, smell it. A dead snail smells bad—take it out.'),
      s('Turbo and astrea snails often can’t flip back. Check on them every day.')],
    treatment: 'Turn it over; remove it if it has died',
    recovery: 'Most start moving within hours.',
  },
};

export function reefPlanFor(id) {
  const plan = PLANS[id] || POND_PLANS[id];
  if (!plan) return null;
  return { ...plan, steps: plan.steps.map(step => ({ ...step })), dip: plan.steps.some(step => step.tag === 'dip') };
}

export const REEF_PLAN_IDS = [...Object.keys(PLANS), ...Object.keys(POND_PLANS)];
