// Reef picture manifest — empty on purpose (Jez, Nov 5 2026: "Hold off of the
// reef invertebrates etc pictures for now"). Every picture spot shows a calm
// "Picture coming soon" tile until an entry is added here.
//
// To add pictures later (same pattern as the fish sets in fish-images.mjs):
//   REEF_IMAGES[group].signs[signId]          → the sign tile (one image)
//   REEF_IMAGES[group].signs[`${kind}:${signId}`] → a kind-specific sign tile
//   REEF_IMAGES[group].conditions[conditionId] → [hero, ...more] for results,
//                                                 could-also cards and the library
//   REEF_IMAGES[group].conditions[`${kind}:${conditionId}`] → kind-specific set
//   REEF_IMAGES[group].kinds[kindId]           → the kind tile
// Each image: { url, width, height, alt, caption }. Never commit image binaries.
export const REEF_IMAGES = {
  coral: { kinds: {}, signs: {}, conditions: {} },
  invert: { kinds: {}, signs: {}, conditions: {} },
};

// Library/detail slots per reef entry. Filled from conditions[id] in order.
export const REEF_SLOTS = [
  { id: 'overview', label: 'What it looks like' },
  { id: 'closeup', label: 'Close-up' },
  { id: 'lookalikes', label: 'Look-alikes' },
];

const asList = value => (Array.isArray(value) ? value : value ? [value] : []);

// Pictures for a sign, condition or kind. Kind-specific pictures win; an empty
// list means "show the placeholder".
export function reefImagesFor(group, key, kind = '', section = 'conditions') {
  const set = REEF_IMAGES[group]?.[section] || {};
  const images = asList(kind && set[`${kind}:${key}`]).length ? asList(set[`${kind}:${key}`]) : asList(set[key]);
  return { images, placeholder: images.length === 0 };
}

export const reefImageFor = (group, key, kind, section) => reefImagesFor(group, key, kind, section).images[0] || null;

export function reefSlotsFor(group, id, kind = '') {
  const { images } = reefImagesFor(group, id, kind);
  return REEF_SLOTS.map((slot, i) => ({ ...slot, image: images[i] || null }));
}
