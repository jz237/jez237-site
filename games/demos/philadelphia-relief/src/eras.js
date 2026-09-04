/**
 * Historical views — the pure half.
 *
 * An era is a year and a set of rules for what the map can honestly show at
 * that year with the data it ships. Buildings carry a construction year when
 * one is documented (a curated list of dated buildings, or OpenStreetMap's
 * start_date); an era draws documented-older buildings solid, hides anything
 * documented newer, and ghosts the undated majority, because absence of a
 * date is not evidence of absence. Bridges have opening years. Railways did
 * not exist in 1776 and motorways not before the 1950s. The 1776 view adds an
 * approximate built-up extent traced from a public-domain 1777 plan.
 *
 * Nothing here pretends to know what an undated rowhouse looked like in 1900.
 */

export const PRESENT_YEAR = 9999;

export const ERAS = [
  {
    id: 'present', year: PRESENT_YEAR, label: 'Present', short: 'Now',
    note: 'Every footprint and bridge the map knows about.',
    sources: [],
  },
  {
    id: '1950s', year: 1955, label: 'The 1950s', short: '1955',
    note: 'Buildings documented as built by 1955 are solid; documented-newer buildings are gone; '
      + 'the undated majority is ghosted. Only the Benjamin Franklin (1926), Tacony-Palmyra '
      + '(1929) and Burlington-Bristol (1931) bridges cross the Delaware. Motorways are ghosted: '
      + 'the Schuylkill Expressway opened in stages from 1958 and I-95 through the 1960s and 70s.',
    sources: [
      ['Wikipedia: Benjamin Franklin Bridge', 'https://en.wikipedia.org/wiki/Benjamin_Franklin_Bridge'],
      ['Wikipedia: Schuylkill Expressway', 'https://en.wikipedia.org/wiki/Schuylkill_Expressway'],
      ['Wikipedia: Interstate 95 in Pennsylvania',
        'https://en.wikipedia.org/wiki/Interstate_95_in_Pennsylvania'],
    ],
  },
  {
    id: 'industrial', year: 1900, label: 'Industrial city, 1900', short: '1900',
    note: 'City Hall is rising, Reading Terminal and the rowhouse grid are here, but only buildings '
      + 'documented as built by 1900 are solid; the undated majority is ghosted. No road bridge '
      + 'crossed the Delaware at Philadelphia until 1926, so the river is unbridged. Railways are '
      + 'shown (the first, the Philadelphia and Columbia, opened in 1834); motorways are hidden.',
    sources: [
      ['Wikipedia: Philadelphia City Hall', 'https://en.wikipedia.org/wiki/Philadelphia_City_Hall'],
      ['Wikipedia: Philadelphia and Columbia Railroad',
        'https://en.wikipedia.org/wiki/Philadelphia_and_Columbia_Railroad'],
      ['Wikipedia: Benjamin Franklin Bridge', 'https://en.wikipedia.org/wiki/Benjamin_Franklin_Bridge'],
    ],
  },
  {
    id: '1776', year: 1776, label: '1776', short: '1776',
    note: 'Only buildings documented as standing by 1776 are solid (Independence Hall, Christ Church, '
      + 'Carpenters\' Hall, Gloria Dei and a few more); everything undated is ghosted. No bridges, no '
      + 'railways, no motorways. The amber outline is the approximate built-up extent of the town '
      + 'and of Germantown, traced from William Faden\'s 1777 plan; it is not a survey. The relief '
      + 'and shoreline are today\'s.',
    sources: [
      ['Faden, A plan of the city and environs of Philadelphia (1777), Library of Congress',
        'https://www.loc.gov/item/gm71000629/'],
      ['Wikipedia: Independence Hall', 'https://en.wikipedia.org/wiki/Independence_Hall'],
    ],
  },
];

export const ERA_IDS = ERAS.map((e) => e.id);

export function getEra(id) {
  return ERAS.find((e) => e.id === id) || ERAS[0];
}

export function eraYear(id) {
  return getEra(id).year;
}

/** What an era does to the map's layers. */
export function eraRules(id) {
  const year = eraYear(id);
  return {
    year,
    present: year >= PRESENT_YEAR,
    rail: year >= 1834,
    motorways: year >= 1980 ? 'show' : year >= 1950 ? 'ghost' : 'hide',
    extent1776: year <= 1776,
    ghostUndated: year < PRESENT_YEAR,
  };
}

/**
 * How a building with a documented `year` (0 = undated) shows in an era:
 * 'solid' (documented at or before the era), 'hidden' (documented after it),
 * or 'ghost' (undated, in a past era).
 */
export function buildingEraState(year, era) {
  const y = eraYear(era);
  if (y >= PRESENT_YEAR) return 'solid';
  if (!year) return 'ghost';
  return year <= y ? 'solid' : 'hidden';
}

/** Bridges (with `opened`) that exist in an era. */
export function bridgesInEra(bridges, era) {
  const y = eraYear(era);
  return bridges.filter((b) => !b.opened || b.opened <= y);
}

/** Landmarks with a `since` year later than the era vanish from the labels. */
export function landmarkInEra(landmark, era) {
  const y = eraYear(era);
  return !landmark.since || landmark.since <= y;
}
