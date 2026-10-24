// The globes in the collection, in the order the interface shows them. The betta bowl has a page
// of its own (betta.html, <html data-globes="betta">): it shows the betta alone, and the globes'
// page (index.html) the rest.

import type { IdleMotion } from '../sim/IdleWater';

export type GlobeId = 'water' | 'betta' | 'koi' | 'kelp' | 'reef' | 'foam';

export interface GlobeEntry {
  id: GlobeId;
  name: string;
  description: string;
  /** A koi swims in it. */
  koi: boolean;
  betta?: boolean;
  /** A kelp forest grows in it. */
  kelp?: boolean;
  /** A slice of reef: a rock in the sand, an anemone on it, and its two clownfish. */
  reef?: boolean;
  /** What its water does when the globe is left alone (src/sim/IdleWater.ts). */
  idle: IdleMotion;
  /** How much water it holds, relative to the others (1 when unset). */
  water?: number;
  /** How clear its water is: the water's absorption times this (1 when unset). */
  clarity?: number;
  /** Its water's colour: how strongly it absorbs red, green and blue, each relative to the usual
   *  water (1s when unset). */
  waterColour?: readonly [number, number, number];
  /** Its water froths where it is churned, and the foam rides the surface (FluidSim.foam). */
  foam?: boolean;
  /** Shown, but not available yet. */
  comingSoon?: boolean;
}

const ALL: readonly GlobeEntry[] = [
  {
    id: 'water',
    name: 'Clear Water',
    description:
      'A sealed glass sphere of water over a bed of sand. Tilt it and the water sloshes, settles and throws light across the sand.',
    koi: false,
    idle: 'wave',
  },
  {
    id: 'betta',
    name: 'Living Silk',
    description: 'A small betta explores its glass bowl, gliding between quiet pauses and curling into turns. Feed it through the lid, tilt the water through its flowing fins, or watch its one-second display.',
    koi: false,
    betta: true,
    clarity: 0.22,
    water: 1.15,
    idle: 'still',
  },
  {
    id: 'koi',
    name: 'Koi',
    description:
      'A koi drifts through the water, carried by every current you make. Tip the globe and it swims clear of the glass and the air.',
    koi: true,
    idle: 'swirl',
  },
  {
    id: 'kelp',
    name: 'Kelp Forest',
    description:
      'Giant kelp rises from the sand to the light, held up by its bladders. Swells roll through, and every frond sways with the water.',
    koi: false,
    kelp: true,
    water: 1.15,
    idle: 'sea',
  },
  {
    id: 'reef',
    name: 'Anemone Reef',
    description:
      'A purple anemone on a rock of the reef, home to two clownfish. They peek out from its tentacles, venture out for a swim and dart back in.',
    koi: false,
    reef: true,
    water: 1.15,
    // (Clear tropical water: through the usual turquoise the anemone's purple would read blue.)
    clarity: 0.35,
    idle: 'surge',
  },
  {
    id: 'foam',
    name: 'Sea Foam',
    description:
      'Dark green water from the open sea. Shake it and the churned water froths, and the foam rises to drift across the surface in lace.',
    koi: false,
    // (Green and deep: blue taken out almost as fast as red.)
    waterColour: [1.6, 1.7, 4.8],
    foam: true,
    idle: 'sea',
  },
];

/** This page's: the betta bowl's page shows the betta alone. */
export const BETTA_PAGE = typeof document !== 'undefined' && document.documentElement.dataset.globes === 'betta';

export const GLOBES: readonly GlobeEntry[] = ALL.filter((g) => !!g.betta === BETTA_PAGE);

/** Where a globe this page does not show lives (?globe=<id> asked of the wrong page), relative to
 *  this page. */
export function elsewhere(id: string): string | null {
  if (GLOBES.some((g) => g.id === id) || !ALL.some((g) => g.id === id)) return null;
  return BETTA_PAGE ? `../globes/?globe=${id}` : '../betta-bowl/';
}
