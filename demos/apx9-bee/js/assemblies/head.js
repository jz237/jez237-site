// head.js - APX-9 head assembly (CONTRACT 13.1). Units mm, bee space: +X forward, +Y up, +Z bee-right.
//
// Top-level parts and leaves (child ids are <top>/<leaf>):
//   head-shell        (group head-shell)  crown-plate face-plate clypeus-plate occipital-plate brow-plate-r/l cheek-plate-r/l
//                                         under-shell-r/l vent-slats thermal-fins sensor-housing sensor-hub
//   head-frame        (chassis)           front-ring rear-ring cross-braces eye-brackets-r/l antenna-sockets-r/l mandible-hinges
//                                         servo-blocks bolt-circles
//   neural-processor  (chassis)           die heat-spreader pcb memory-modules ribbon-cable status-led mounting-posts
//   mandibles         (group head-shell)  mandible-r/l labrum proboscis actuators return-springs
//   neck-joint        (chassis)           ring bearing servo cable-bundle
//
// Helper modules: head-sdf (2-D signed-distance fields + tracing), head-util (ellipsoid frames, cuts, fasteners),
// head-layout (plate partition), head-plates (armour panel builders), head-sensor, head-shell, ...
import { buildShell } from './head-shell.js';
import { buildNeural } from './head-neural.js';
import { buildNeck } from './head-neck.js';

export async function build(ctx) {
  const { bee, ex } = ctx;

  const shell = bee.part('head-shell', {
    name: 'Head Shell', group: 'head-shell',
    info: 'Yellow armoured skull of the APX-9: layered crown, face, clypeus, brow, cheek and occipital plates over a black carbon liner, with the sensor housing at its centre.',
    specs: { Material: 'Clear-coated anodised aluminium plates, carbon liner', Mass: '0.55 g' },
    explode: ex([16, 4, 0], 'top'),
  });
  buildShell(ctx, shell);

  const neural = bee.part('neural-processor', {
    name: 'Neural Processor', group: 'chassis',
    info: 'Vertical control card of the APX-9: neural die under a finned heat spreader, four memory sticks, status LEDs and a flat ribbon cable that runs back through the neck.',
    specs: { Material: 'Four-layer PCB, copper spreader, gold contacts', Mass: '0.25 g' },
    explode: ex([6, 12, 0], 'top'),
  });
  buildNeural(ctx, neural);

  const neck = bee.part('neck-joint', {
    name: 'Neck Joint', group: 'chassis',
    info: 'Pivot joint between head and thorax: gunmetal flange ring with a spigot into the head frame, a ball bearing, a ring servo and the hose bundle that threads the bore.',
    specs: { Material: 'Gunmetal ring, chrome bearing, copper-wound servo', Mass: '0.10 g' },
    explode: ex([4, -2, 0], 'top'),
  });
  buildNeck(ctx, neck);
}
