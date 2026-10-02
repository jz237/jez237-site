// APX-9 abdomen: armoured yellow cap with the bee logo, alternating black / golden fur bands over ribbed black rings,
// the concentric-ring skeleton inside (payload bay, climate unit, hoses, central shaft) and the chrome petiole ball joint.
// Everything is modelled in the abdomen-local frame (K.abdomen.frame): a point at distance a behind the petiole is
// (-a, R(a) cos phi, R(a) * aspect * sin phi). The shell covers a in [0, 9]; the tail assembly continues from a = 9.
//
// abdomen-shell   abdomen-shell.js (cap, hatches, displays, ribs, clamps) + abdomen-bands.js (four fur bands, underbelly, vent)
// abdomen-frame   abdomen-frame.js (rings, rails, bulkheads, shaft, bolts) + abdomen-bay.js (payload bay, climate unit, hoses)
// petiole-joint   abdomen-petiole.js (ball, socket ring, servos, bellows, cable bundle)
import { K, ex } from '../kit.js';
import { buildPetiole } from './abdomen-petiole.js';
import { buildShell } from './abdomen-shell.js';
import { buildBelt } from './abdomen-belt.js';
import { buildBands } from './abdomen-bands.js';
import { buildBelly } from './abdomen-belly.js';

export async function build(ctx) {
  const { bee } = ctx;

  const shell = bee.part('abdomen-shell', {
    name: 'Abdomen Shell', group: 'abdomen-shell', matrix: K.abdomen.frame,
    info: 'Armoured yellow front cap with the bee logo, black ribbed belt and four alternating black and golden fur bands that close over the abdomen skeleton.',
    specs: { Material: 'Clear-coated yellow composite, black anodised rings, synthetic fur', Mass: '0.6 g', Dimensions: '9.0 mm long, 10.0 x 10.4 mm at the widest ring' },
    explode: ex([-20, 3, 0], 'top'),
  });
  const frame = bee.part('abdomen-frame', {
    name: 'Abdomen Frame', group: 'abdomen-shell', matrix: K.abdomen.frame,
    info: 'Internal skeleton of the abdomen: nested bearing rings, rails and bulkheads that carry the pollen payload bay, the climate unit with its hoses and the central shaft.',
    specs: { Material: 'Titanium and gunmetal bulkheads, chrome bearing races', Mass: '0.5 g', Function: 'Carries payload, cooling and tail loads' },
    explode: ex([-12, 0, 0], 'top'),
  });
  const petiole = bee.part('petiole-joint', {
    name: 'Petiole Joint', group: 'chassis', matrix: K.abdomen.frame,
    info: 'Chrome ball-and-socket waist between thorax and abdomen, driven by two micro servos and sealed by a ribbed rubber bellows and a cable harness.',
    specs: { Material: 'Hard-chrome steel ball, anodised aluminium socket', Mass: '0.1 g', Function: 'Two-axis waist articulation' },
    explode: ex([-5, 0, 0], 'top'),
  });

  buildPetiole(petiole);
  buildShell(shell);
  buildBelt(shell);
  buildBands(shell);
  buildBelly(shell);
  void frame;
}
