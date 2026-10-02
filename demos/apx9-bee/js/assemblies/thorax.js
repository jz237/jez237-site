// APX-9 thorax assembly (CONTRACT 13.3): thorax-armor (group thorax-armor) + thorax-chassis (group chassis).
//
// Completed inventory: armor, fur mantle, internal structural cage and six hip sockets.
//  thorax-armor : dorsal-cap (+vent), cap-segment-1..3, side-plate-r/l, text-plate, sensor-pod-r/l, wing-collar-r/l,
//                 aperture-rim-r/l, fur-dome-front, fur-dome-rear, black-band-r/l
//  thorax-chassis: ring-frames, rails, bearing-collar-stack, injector-pegs, front-collar, rear-collar,
//                 hip-socket-front/mid/rear-r/l, core-cradle, pollination-cradle, wing-mount-seat-r/l, battery-bay,
//                 wiring-harness, bolts
// Helper modules: thorax-common (frames, hub maths), thorax-collars, thorax-armor, thorax-fur, thorax-chassis,
// thorax-hips, thorax-cradles. Right-hand parts are built explicitly and mirrored at the very end.
import { ex } from '../kit.js';
import { makeShared } from './thorax-common.js';
import { buildCollars } from './thorax-collars.js';
import { buildCap } from './thorax-armor.js';
import { buildFlank } from './thorax-plates.js';
import { buildChassis } from './thorax-chassis.js';
import { buildFur } from './thorax-fur.js';

export async function build(ctx) {
  const { bee } = ctx;
  const armor = bee.part('thorax-armor', {
    name: 'Thorax Armor', group: 'thorax-armor', tag: 'shell',
    info: 'Fuzzy biomimetic covering over an impact-resistant composite shell: segmented dorsal cap, side plates, golden fur domes, sensor pods and chrome wing-root collars.',
    bullets: ['Fuzzy biomimetic covering', 'Impact-resistant composite', 'Environmental sensors'],
    specs: { Material: 'Carbon-composite shell, synthetic golden fur', Mass: '1.0 g' },
    explode: ex([0, 15, 0], 'top'),
  });
  const chassis = bee.part('thorax-chassis', {
    name: 'Thorax Chassis', group: 'chassis',
    info: 'Black and chrome load-bearing frame of the thorax: bulkhead rings, rails, hip sockets, bearing collar stack and the core and pollination cradles.',
    bullets: ['Bulkhead rings and rails', 'Six hip sockets', 'Neck and petiole collars'],
    specs: { Material: 'Anodised magnesium frame, chrome bearings', Mass: '0.9 g' },
    explode: ex([0, -2, 0], 'top'),
  });
  const W = { ctx, bee, armor, chassis, fx: makeShared(), mirrors: [], keep: { both: [], right: [] } };

  buildCollars(W);
  buildCap(W);
  buildFlank(W);
  buildFur(W);
  buildChassis(W);

  for (const p of W.mirrors) bee.mirror(p);          // left-hand twins last (descendants are cloned at finalize)
}
