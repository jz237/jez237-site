// "Stop it before it starts": quarantine, acclimation and everyday prevention
// (Jez, Nov 6 2026 07:32 EST: "Do option 1 and 4"). One page of picture cards.
// Pictures: prevent-images-data.mjs (one AI contact sheet, 12 crops).
import { MEDIA_BASE } from './fish-images-data.mjs';
import { CROPS, IMAGE_SOURCE } from './prevent-images-data.mjs';

const KEY_PREFIX = 'experiments/fish-health-lab/';
const pic = id => {
  const entry = CROPS[id];
  if (!entry) throw new Error(`prevent: no crop ${id}`);
  return { id, ...entry, url: IMAGE_SOURCE === 'media' ? MEDIA_BASE + entry.key : `local-images/${entry.key.slice(KEY_PREFIX.length)}` };
};

// Each section: a title, who it's for, and picture cards with a short how-to.
export const PREVENT_SECTIONS = [
  {
    id: 'new-fish', title: 'New fish: quarantine first', who: 'Freshwater & saltwater',
    lead: 'Most sick tanks start with one new fish. A few weeks in a separate tank catches it before it spreads.',
    cards: [
      { image: 'qt-tank', title: 'Set up a simple quarantine tank', text: 'A small bare tank, a sponge filter, a heater and a pipe to hide in. Keep the sponge in your main filter for a few weeks first so it’s ready.' },
      { image: 'float-bag', title: 'Float the bag', text: 'Float the sealed bag for 15–20 minutes so the temperature evens out. Saltwater: floating doesn’t match salinity—check the bag water, and if it’s more than a little different from your tank, drip-acclimate first (see below).' },
      { image: 'net-transfer', title: 'Net it in, leave the store water', text: 'Net the fish into the tank and throw the store water away—it can carry ich and other bugs.' },
      { image: 'watch-qt', title: 'Watch for 2–4 weeks', text: 'Look every day for spots, rubbing, clamped fins or not eating. If it’s still well after 2–4 weeks (4 for saltwater), it can go in.' },
    ],
  },
  {
    id: 'inverts', title: 'Shrimp and snails: go slow', who: 'Freshwater & saltwater',
    lead: 'Shrimp and snails die from sudden changes. Never drop them straight in.',
    cards: [
      { image: 'drip', title: 'Drip them in slowly', text: 'Put them in a bucket with their bag water and drip tank water in through airline tubing with a loose knot—about 2–3 drops a second for an hour, until the water has doubled a few times. Then net them in.' },
    ],
  },
  {
    id: 'corals', title: 'New corals: check and dip', who: 'Reef tanks',
    lead: 'Pests like flatworms, red bugs and nudibranchs ride in on new corals.',
    cards: [
      { image: 'inspect-coral', title: 'Look it over first', text: 'Check the coral and the underside of the plug with a flashlight for bugs, worms and egg clusters.' },
      { image: 'coral-dip', title: 'Dip it in a container', text: 'Use a coral dip in a separate container, blow it over with a baster, then rinse in tank water. Never pour the dip into the tank. Wear gloves and eye protection with zoas and palys (palytoxin).' },
    ],
  },
  {
    id: 'pond', title: 'New pond fish: a tub first', who: 'Ponds',
    lead: 'Koi herpes, flukes and anchor worm usually arrive with new fish.',
    cards: [
      { image: 'pond-qt', title: 'Quarantine in a tub', text: 'Keep new koi or goldfish in a covered, aerated tub with a filter for 3–4 weeks, ideally at 68–77 °F (20–25 °C). Don’t share nets with the pond.' },
    ],
  },
  {
    id: 'everyday', title: 'Every week', who: 'Every tank and pond',
    lead: 'Clean, stable water prevents most problems in this guide.',
    cards: [
      { image: 'test-kit', title: 'Test the water', text: 'Ammonia, nitrite and nitrate every week, plus pH. Ammonia and nitrite should always read 0.' },
      { image: 'water-change', title: 'Change some water', text: 'About 20–30% a week in a tank (10–20% in a reef). Treat tap water with a conditioner and match the temperature—and in saltwater, the salinity.' },
      { image: 'feed-lightly', title: 'Feed lightly', text: 'Only what they finish in a minute or two. Leftover food turns into ammonia.' },
      { image: 'separate-gear', title: 'Separate nets and buckets', text: 'Keep a set just for the quarantine tank so you don’t carry bugs back.' },
    ],
  },
];

export const preventImage = pic;
export const PREVENT_IMAGE_IDS = PREVENT_SECTIONS.flatMap(s => s.cards.map(c => c.image));
