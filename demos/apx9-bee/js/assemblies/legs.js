// APX-9 legs: the three right articulated legs (front, middle, rear), built in bee space and mirrored to the left.
// Each leg is one insect-style kinematic chain  hip (H) -> coxa -> J1 (hip pitch servo) -> femur -> knee (Kn) -> tibia -> tarsus -> claw -> foot (F)
// solved by solveLeg() in legs-core.js; one parametric limb builder (legs-hip / -femur / -knee / -tibia / -foot) serves all three
// legs, every leg gets its own proportions (PARAMS), the front legs a broader femur, the rear legs a longer tibia and the pollen brush.
//
// INVENTORY (per right leg; each leg is a top-level part leg-<front|mid|rear>-r, mirrored to -l; ids below are children)
//   coxa-shell         hip yaw housing from the hip point: knurled chrome flange with bolt circle, black drum, vented two-part yellow sleeve with
//                      hinge pins and cap screws, chrome retaining rings
//   rotary-servo       hip pitch servo at J1: knurled chrome ring, stepped disc, gold ring + hub, six-bolt circle, cable gland
//   femur-shell-outer  layered yellow clear-coat plates (main plate + raised end cap) with gill slits over a black under-layer, rivets, screws, cuff
//   femur-shell-inner  dark belly plate on the inner face of the femur: raised yellow bezel, louvred vent cassette, two bolted access rings, black under-layer
//   femur-frame        glossy black composite body, titanium collars, matte flank plates (louvred grilles over silver floors / end windows), flanged encoder cap
//   knee-servo         second chrome-ringed servo disc on the knee hinge axis
//   knee-bracket       brushed-silver vented clamp bracket over a black backing plate on the tibia flank, corner screws, gold collar band
//   hydraulic-joint    micro-hydraulic cylinder across the knee: ribbed barrel, chrome piston rod, gold collars, pinned clevis eyes
//   shock-absorber     coil-over damper: steel spring between gold seats, black damper body, chrome rod, pinned eyelets on bolted feet
//   hoses              smooth copper pressure lines with gold crimp ferrules to a bolted gold manifold block, ribbed black rubber supply hose, clamp and grommet
//   joint-covers       yellow knee guard with inlay slits and chrome bolts, chrome hinge-pin cap with black gasket
//   tibia-frame        glossy black ribbed core, titanium collars / rib rings / vented flank plates, gold clamp bands + socket ring, knee axle barrel
//   tibia-shell        yellow shin plate with louvre slits over a black inlay, raised distal cap, ankle cuff, chrome fasteners
//   tarsus-1..3        three lathed segments: black anodised bodies, gold rings, chrome ball joints and pins
//   foot-pad           black ankle ball + ribbed neck, gold bolted palm flange, clevis-hinged hooked toes, knurled rubber sole on y = K.footLevel
//   pollen-brush       REAR LEGS ONLY: gold holder rails with clamp bands on the lower femur / upper tibia and a beard of golden bristles (makeFur + idProxy)
import { ex } from '../kit.js';
import { PARAMS, solveLeg } from './legs-core.js';
import { buildHip } from './legs-hip.js';
import { buildFemur } from './legs-femur.js';
import { buildKnee } from './legs-knee.js';
import { buildTibia } from './legs-tibia.js';
import { buildFoot } from './legs-foot.js';

const TOP_EXPLODE = { front: [8, -14, 14], mid: [0, -16, 18], rear: [-8, -14, 14] };
const INFO = {
  front: 'Front right leg: short, broad armoured femur with a chrome hip servo, knee servo, hydraulic joint and shock absorber, a segmented tarsus and a claw foot pad.',
  mid: 'Middle right leg: the longest reach outward, with chrome-ringed hip and knee servos, a hydraulic knee joint, coil-over shock absorber, segmented tarsus and claw foot pad.',
  rear: 'Rear right leg: long tibia carrying the golden pollen brush, with chrome servo discs, a hydraulic joint, shock absorber, segmented tarsus and a claw foot pad.',
};

// ordered leaf builders; each gets (ctx, L, top). A failure in one leaf is logged and does not stop the others.
const STEPS = [
  ['hip', buildHip],
  ['femur', buildFemur],
  ['knee', buildKnee],
  ['tibia', buildTibia],
  ['foot', buildFoot],
];

export async function build(ctx) {
  const { bee } = ctx;
  const tops = [];
  for (const key of ['front', 'mid', 'rear']) {
    const p = PARAMS[key];
    const L = solveLeg(p);
    const top = bee.part(`leg-${key}-r`, {
      name: `${p.title} Leg Assembly`, group: 'legs', info: INFO[key],
      specs: { Material: 'Clear-coat yellow composite, black composite and titanium frame, chrome servo discs', Mass: '0.3 g' },
      explode: ex(TOP_EXPLODE[key], 'top'),
    });
    L.top = top;
    for (const [name, fn] of STEPS) {
      try { fn(ctx, L, top); } catch (e) { console.warn(`[legs] ${key} ${name} failed:`, e && e.stack ? e.stack : e); }
    }
    tops.push(top);
  }
  for (const t of tops) bee.mirror(t);
}
