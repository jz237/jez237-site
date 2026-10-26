// What Learn mode says (app/learn/Learn.ts), all in one place for review: a card for each thing in
// the betta bowl a tap can land on (pick.mjs finds it), a caption for each behaviour of the fish
// (captions.mjs says when), and the feeding advice the Feed button brings. Plain words for people
// who keep bettas (Betta splendens), kept short: a title and two or three sentences each.
// (Plain data, no imports: the tests read it in Node. A number and its unit are kept together by a
// no-break space, \u00a0.)

export interface LearnCard {
  /** A small heading over the title (what kind of card it is). */
  kicker: string;
  title: string;
  body: string;
}

/** What a tap can land on (pick.mjs TOPIC_IDS). */
export type TopicId = 'fish' | 'driftwood' | 'rock' | 'anubias' | 'rosette' | 'sand' | 'leaf' | 'nest' | 'lid' | 'water' | 'glass' | 'heater' | 'filter';

const IN_BOWL = 'In the bowl';

export const TOPICS: Record<TopicId, LearnCard> = {
  fish: {
    kicker: 'The fish',
    title: 'Betta splendens, the Siamese fighting fish',
    body: 'Wild bettas live in warm, shallow, slow water thick with plants: the rice paddies and marshes of Thailand and nearby. This male halfmoon was bred for huge fins. Keep males alone, as two will fight. With good care they live 3 to 5 years.',
  },
  driftwood: {
    kicker: IN_BOWL,
    title: 'Driftwood',
    body: 'Soaked hardwood gives cover and places to rest. Long betta fins tear easily, so choose wood and decor with no sharp points or rough edges. New wood can tint the water tea-brown with tannins, which is harmless.',
  },
  rock: {
    kicker: IN_BOWL,
    title: 'Rocks',
    body: 'Smooth, rounded aquarium stone is safe for long fins. Avoid jagged rock, and limestone or shells, which slowly harden the water and raise its pH.',
  },
  anubias: {
    kicker: IN_BOWL,
    title: 'Anubias (Anubias barteri)',
    body: 'A tough, slow-growing plant from West Africa that does well in low light. Its rhizome, the thick stem the leaves rise from, rots if buried: rest it on the sand or tie it to wood or rock. Bettas like to rest on its broad leaves.',
  },
  rosette: {
    kicker: IN_BOWL,
    title: 'A rosette plant',
    body: 'Leaves rising from one crown in the sand. It is not modelled on one species; Cryptocoryne wendtii grows much like this. Java fern is easy too, tied to wood: it rots if buried. Live plants use up fish waste and give a betta cover.',
  },
  sand: {
    kicker: IN_BOWL,
    title: 'Sand',
    body: 'A fine, smooth bed is kind to a fish that rests on the bottom, and plants root in it. Leftover food and waste settle here: siphon a little away with each water change.',
  },
  leaf: {
    kicker: IN_BOWL,
    title: 'Indian almond leaf (catappa)',
    body: 'A dried leaf of Terminalia catappa. As it soaks it releases tannins that tint the water tea-brown and can lower the pH a little, like the leaf-stained waters bettas come from. Males often nest under one. Replace it as it breaks down.',
  },
  nest: {
    kicker: IN_BOWL,
    title: 'The bubble nest',
    body: 'Male bettas blow saliva-coated bubbles into a floating raft against cover or the glass, to guard eggs and fry in. Settled males often build one, even alone; some seldom do. This one adds to it after trips for air.',
  },
  lid: {
    kicker: IN_BOWL,
    title: 'Lid and LED lamp',
    body: 'Bettas jump, so a tank needs a cover; this one has air holes, as the fish breathes at the surface. Its LED lights the fish and plants: 8 to 12 hours a day, then dark so it can sleep. Feed lifts the lid.',
  },
  water: {
    kicker: IN_BOWL,
    title: 'The water',
    body: 'Keep it at 78 to 80\u00a0°F (25.5 to 27\u00a0°C), and treat tap water with a dechlorinator. In a cycled tank, bacteria turn the fish’s toxic ammonia into nitrite, then into milder nitrate, which weekly water changes remove. The Water button simulates it.',
  },
  glass: {
    kicker: IN_BOWL,
    title: 'The bowl',
    body: 'A glass bowl about 24\u00a0cm (9.5\u00a0in) across, holding about a gallon (4\u00a0L): the size bettas are often sold in. It has a heater and filter, but a betta does far better in 5 gallons (19\u00a0L) or more: steadier warmth, cleaner water, room to swim.',
  },
  heater: {
    kicker: IN_BOWL,
    title: 'Heater',
    body: 'Most rooms are too cool for a betta. A small heater with a thermostat holds the water at 78 to 80\u00a0°F (25.5 to 27\u00a0°C); its light shows when it is heating. Check it with a thermometer.',
  },
  filter: {
    kicker: IN_BOWL,
    title: 'Sponge filter',
    body: 'Air bubbling up the tube draws water through the sponge, where helpful bacteria break down waste. The flow is gentle: long fins tire in a strong current. Rinse the sponge in old tank water, never tap water, so the bacteria survive.',
  },
};

/** What the fish can be seen doing (captions.mjs MODE_CAPTIONS), and the moments Learn.ts watches
 *  for: the nest growing, the fins flared at the button, a pellet sunk uneaten. */
export type CaptionId = 'cruise' | 'hover' | 'air' | 'nest' | 'mirror' | 'flare' | 'lap' | 'rest' | 'startle' | 'feed' | 'sunk';

const NOW = 'What it’s doing';

export const CAPTIONS: Record<CaptionId, LearnCard> = {
  cruise: {
    kicker: NOW,
    title: 'Exploring',
    body: 'It swims slowly round its territory, looking over the plants and the wood. Bettas are curious and learn their surroundings well.',
  },
  hover: {
    kicker: NOW,
    title: 'Hovering',
    body: 'It holds still in mid-water, its small clear pectoral fins fanning to keep it in place while it looks around.',
  },
  air: {
    kicker: NOW,
    title: 'A gulp of air',
    body: 'Bettas have a labyrinth organ, folds above the gills that take oxygen from air. That lets them live in still, warm water short of oxygen, but they must always be able to reach the surface.',
  },
  nest: {
    kicker: NOW,
    title: 'Tending the bubble nest',
    body: 'Back from the surface, it adds bubbles to its nest by the glass. Males often build when they are settled and comfortable.',
  },
  mirror: {
    kicker: NOW,
    title: 'Flaring at its reflection',
    body: 'It takes its reflection in the glass for a rival male: gill covers out, fins spread. A short display is natural, even good exercise; flaring all day (a mirror left in, another male in view) stresses it.',
  },
  flare: {
    kicker: NOW,
    title: 'Flaring',
    body: 'Gill covers out, fins spread wide: how a male warns off a rival. A mirror held up for a minute now and then is fine; never leave one up.',
  },
  lap: {
    kicker: NOW,
    title: 'Patrolling',
    body: 'A slow lap of the bowl along the glass. Bettas are territorial and keep checking the edges of their space.',
  },
  rest: {
    kicker: NOW,
    title: 'Resting on the bottom',
    body: 'Bettas rest often, on the bottom or on a broad leaf, and long-finned males tire easily. It is normal. Lying there all the time, with clamped fins or no appetite, can mean the water is too cold or dirty.',
  },
  startle: {
    kicker: NOW,
    title: 'Startled',
    body: 'A sudden jolt of the water sets off its escape reflex: it bends and darts away. Keep a bowl where it won’t be knocked, and don’t tap the glass.',
  },
  feed: {
    kicker: NOW,
    title: 'Taking food at the surface',
    body: 'Bettas feed at the surface: their upturned mouths are made for snatching insects and larvae off the water. It rises under each pellet and takes it lips first.',
  },
  sunk: {
    kicker: 'Care',
    title: 'Food on the sand',
    body: 'A pellet has sunk uneaten. In a real tank, net or siphon out leftovers after a few minutes: rotting food fouls the water.',
  },
};

/** The feeding advice the Feed button brings (Learn.ts, from feedLog.mjs's count). */
export const FEEDING = {
  /** A first meal. */
  rule: {
    kicker: 'Care',
    title: 'Feeding a betta',
    body: 'Two or three pellets, once or twice a day, is plenty: its stomach is about the size of its eye. Watch it take them: bettas feed at the surface, rising under each pellet lips first. Uneaten food rots and fouls the water.',
  } as LearnCard,
  /** Fed already, not yet a day's worth: `pellets` of them, `minutes` ago. */
  again: (pellets: number, minutes: number): LearnCard => ({
    kicker: 'Care',
    title: 'Already fed',
    body: `It had ${count(pellets)} ${ago(minutes)}. One or two small meals a day, spaced out, suit a betta best; it will gladly wait.`,
  }),
  /** A day's food or more already (six pellets: feedLog.mjs DAY_PELLETS): `pellets` over the last
   *  `minutes`. */
  over: (pellets: number, minutes: number): LearnCard => ({
    kicker: 'Care',
    title: 'That’s a lot of food',
    body: `${capital(count(pellets))} in ${span(minutes)} is ${pellets > 6 ? 'more than a' : 'a whole'} day’s food for a betta. Overfed bettas get bloated, and leftovers foul the water. In a real tank, it would wait until tomorrow.`,
  }),
};

/** Shown as Night is turned on (app/night.mjs), with Learn mode on. */
export const NIGHT: LearnCard = {
  kicker: 'Care',
  title: 'Bettas sleep at night',
  body: 'In the dark a betta rests on the bottom or on a broad leaf, barely moving. A real bowl needs a long night: light 8 to 12 hours a day, dark the rest. A dim blue night light is for viewing, not for leaving on all night.',
};

/** Shown as Learn mode is turned on. */
export const INTRO: LearnCard = {
  kicker: 'Learn',
  title: 'Learn mode',
  body: 'Captions explain what the fish does as it does it. Tap anything in the bowl (the fish, a plant, the lid) to learn about it.',
};

const count = (n: number): string => (n === 1 ? 'one pellet' : `${n} pellets`);
const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const ago = (minutes: number): string => (minutes < 1 ? 'just now' : minutes < 90 ? `${Math.round(minutes)} min ago` : `${Math.round(minutes / 60)} hours ago`);
const span = (minutes: number): string => (minutes < 2 ? 'a minute or two' : minutes < 90 ? `${Math.round(minutes)} minutes` : `${Math.round(minutes / 60)} hours`);
