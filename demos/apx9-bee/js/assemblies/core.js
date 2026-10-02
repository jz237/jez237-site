// core.js - APX-9 core assembly (CONTRACT 13.8): the central power core and the pollination module.
//
// INVENTORY
//   power-core (group core, axis X through K.core.c)
//     shaft (collar, retaining-nut), end-cap-rear (terminals), end-cap-front (status-leds), chrome-ring-a..e,
//     bearing-stack (outer-races, inner-races, balls, seals), thermal-fins, power-board, wireless-coil (core),
//     cell (filament, plates, heat-pipes, clamp-straps [upper, lower], coolant-lines [supply, return])
//   pollination-module (group pollination, axis X through K.pollination.c, brush toward +X)  -> core-pollen*.js
import { ex } from '../kit.js';
import { buildShaft, buildCaps, buildRings, buildBearings, buildFins, buildBoard } from './core-power.js';
import { buildCell, buildCoil, buildLeds, buildTerminals } from './core-cell.js';
import { buildPollen } from './core-pollen.js?v=8d1930e2df49';

export async function build(ctx) {
  const { bee } = ctx;

  const pc = bee.part('power-core', {
    name: 'Central Power Core', group: 'core', pos: [1.6, 0.3, 0],
    info: 'Glowing blue energy cell on a chrome shaft, clamped between flanged end caps, chrome rings, a bearing stack, fin pack, power board and wireless charging coil.',
    specs: { Material: 'Borosilicate, gunmetal aluminium, polished stainless', Mass: '2.5 g', Output: '3.7 V solid-state', Length: '6.5 mm' },
    explode: ex([2, -12, 0], 'top'),
  });
  buildShaft(pc);
  const { rear, front } = buildCaps(pc);
  buildTerminals(rear);
  buildLeds(front);
  buildRings(pc);
  buildBearings(pc);
  buildFins(pc);
  buildBoard(pc);
  buildCoil(pc);
  buildCell(pc);

  const pm = bee.part('pollination-module', {
    name: 'Pollination Module', group: 'pollination', pos: [3.6, -4.9, 0],
    info: 'Rotary pollen collector: a yellow drum with banded rings, golden brush at the front, translucent collection chamber, vanes, pollen sensor and drive motor.',
    specs: { Material: 'Clear-coated aluminium, gold-plated bristles', Mass: '0.6 g', Length: '6.0 mm' },
    explode: ex([6, -20, 0], 'top'),
  });
  buildPollen(pm);
}
