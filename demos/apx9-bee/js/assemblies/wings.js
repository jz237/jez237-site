// wings.js - APX-9 wing assembly: a long insect wing of clear iridescent smart-glass in a gold nano-vein frame, a black
// woven-carbon leading-edge boom with gold collars, a chrome/gold root bundle, three clamped micro-actuators, a bellows flex
// joint with a link plate, hinge pins, a yellow root bracket and a glowing tip sensor.
//
// INVENTORY (CONTRACT 13.5)
//   wing-r (wing)   spar, vein-frame, membrane, micro-actuator-1..3, flex-joint, tip-sensor, root-fairing,
//                   trailing-edge-trim, hinge-pins        -> bee.mirror -> wing-l
// Wing frame (K.wing.frameR): x = span root->tip (23.5 mm), y = toward the leading edge, z = upper-surface normal.
// Modules: wings-shape (planform + Voronoi network), wings-vein, wings-spar, wings-root, wings-mem, wings-tex, wings-geo.
import { buildNetwork } from './wings-shape.js';
import { buildVeinFrame } from './wings-vein.js';
import { buildSpar, buildTrim } from './wings-spar.js';
import { buildFlexJoint, buildHingePins, buildRootFairing, buildMicroActuator, buildTipSensor, ACT_X } from './wings-root.js';
import { makeMembraneTextures } from './wings-tex.js';
import { membraneGeometry, glassMaterial } from './wings-mem.js';

const local = (v) => ({ ...v, space: 'local' });

export async function build(ctx) {
  const { bee, Q, M, T, K, S, ex } = ctx;

  /* ------------------------------------------------------------------ shared data */
  const net = buildNetwork({ seed: 42 });
  const spar = buildSpar(S);
  const veins = buildVeinFrame(net, S);
  const trim = buildTrim(S);

  /* ------------------------------------------------------------------ the assembly */
  const wing = bee.part('wing-r', {
    name: 'Right Wing Assembly', group: 'wing-r',
    info: 'Right flight wing: a smart-glass membrane in a gold nano-vein frame, driven from a carbon leading-edge boom with micro-actuators, a bellows flex joint and a pinned root bracket.',
    specs: { Material: 'Smart glass, gold-plated nano-veins, woven carbon spar', Mass: '0.20 g', Span: '23.5 mm', Function: 'Lift and thrust at 230 Hz flapping' },
    matrix: K.wing.frameR,
    explode: ex([0, 12, 26], 'top'),
  });

  /* ---- membrane (transparent glass; ID buffer still records it so it stays pickable) */
  const membrane = wing.part('membrane', {
    name: 'Smart Glass Membrane', group: 'wing-r', tag: 'shell',
    info: 'Hand-blown clear membrane, one slightly domed facet per vein cell, with frosted smart-glass patches, etched circuit traces, gold self-healing cracks and an embedded amber LED strip.',
    specs: { Material: 'Iridescent borosilicate film, 40 micron', Mass: '0.04 g', Function: 'Aerodynamic surface and status display' },
  });
  const tex = makeMembraneTextures(T, net, Q);
  membrane.add(membraneGeometry(net), glassMaterial(tex));

  /* ---- vein frame */
  const vf = wing.part('vein-frame', {
    name: 'Nano-vein Frame', group: 'wing-r',
    info: 'Polished gold ribbon veins on every cell edge, thick along the spar and thin across, joined at black solder nodes with chrome micro-bolts and chrome sensor ferrules.',
    specs: { Material: 'Gold-plated titanium ribbon', Mass: '0.05 g', Function: 'Stiffens and tensions the membrane' },
    explode: local(ex([0, 0, 2.6], 'mid')),
  });
  vf.add(veins.gold.geometry(), M.gold);
  vf.add(veins.black.geometry(), M.black);
  vf.add(veins.chrome.geometry(), M.chrome);

  /* ---- leading-edge spar */
  const sp = wing.part('spar', {
    name: 'Carbon Leading-Edge Spar', group: 'wing-r',
    info: 'Tapering woven-carbon boom along the leading edge, wrapped around the tip, with gold ferrules, cinch bands and a chrome and gold bundle that fans out over the membrane at the root.',
    specs: { Material: 'Carbon twill, gold ferrules, chrome tube', Mass: '0.06 g', Dimensions: '25 x 1.6 mm, tapering' },
    explode: local(ex([0, 2.4, 0.8], 'mid')),
  });
  sp.add(spar.carbon.geometry(), M.carbon);
  sp.add(spar.gold.geometry(), M.gold);
  sp.add(spar.chrome.geometry(), M.chrome);

  /* ---- micro-actuators clamped on the underside of the boom */
  const act = ACT_X;
  const taken = new Set();
  act.forEach((x, i) => {
    const a = wing.part(`micro-actuator-${i + 1}`, {
      name: `Micro-Actuator ${i + 1}`, group: 'wing-r',
      info: `Piezo micro-actuator ${i + 1}: a gold clamp band on the leading-edge boom, a ringed gunmetal housing, a return spring and a chrome push rod whose eyelet is clamped on a vein-node stud to trim membrane camber.`,
      specs: { Material: 'Gunmetal housing, gold clamp, chrome rod and spring', Mass: '0.004 g', Function: 'Camber and twist control' },
      explode: local(ex([0, 2.4, -3.2 - i * 0.9], 'fine')),
    });
    buildMicroActuator(ctx, a, x, spar, i, net, veins.nodes, taken);
  });

  /* ---- flex joint + hinge hardware + root bracket */
  const fj = wing.part('flex-joint', {
    name: 'Flex Joint', group: 'wing-r',
    info: 'Hinge flex joint: a bolted chrome flange, rubber-sealed chrome barrel, gold bellows and a knurled collar, capped by a slotted chrome link plate.',
    specs: { Material: 'Chrome steel, gold bellows, EPDM seal', Mass: '0.03 g', Function: 'Flapping hinge with torsional compliance' },
    explode: local(ex([-2.6, 0, 0], 'mid')),
  });
  buildFlexJoint(ctx, fj);

  const pins = wing.part('hinge-pins', {
    name: 'Hinge Pins', group: 'wing-r',
    info: 'Two chrome cross pins with knurled heads, gold spacer sleeves, washers, castle nuts and cotter pins that lock the link plate to the root bracket.',
    specs: { Material: 'Chrome steel, gold spacers', Mass: '0.006 g', Function: 'Retain the hinge stack' },
    explode: local(ex([0, 0, 3.6], 'fine')),
  });
  buildHingePins(ctx, pins);

  const bracket = wing.part('root-fairing', {
    name: 'Root Bracket', group: 'wing-r', tag: 'shell',
    info: 'Yellow clear-coated root bracket: a lightened base plate with a bent-up flange and gusset, bolted under the hinge stack.',
    specs: { Material: 'Anodized aluminium, yellow clear coat', Mass: '0.02 g', Function: 'Carries the hinge pins' },
    explode: local(ex([0, 0, -2.8], 'mid')),
  });
  buildRootFairing(ctx, bracket);

  /* ---- tip sensor + trailing-edge trim */
  const tip = wing.part('tip-sensor', {
    name: 'Tip Sensor', group: 'wing-r',
    info: 'Gold-bezelled sensor capsule over the end of the boom with an amber beacon dome that reports flapping phase.',
    specs: { Material: 'Gold plated brass, amber polymer dome', Mass: '0.004 g', Function: 'Tip position and airflow sensing' },
    explode: local(ex([0.9, -2.3, 0.6], 'fine')),
  });
  buildTipSensor(ctx, tip, spar);

  const tr = wing.part('trailing-edge-trim', {
    name: 'Trailing-Edge Trim', group: 'wing-r',
    info: 'Thin gold ribbon along the root and trailing edges, held to the membrane by chrome micro-clips.',
    specs: { Material: 'Gold-plated ribbon, chrome clips', Mass: '0.01 g', Function: 'Edge stiffening and tear stop' },
    explode: local(ex([0, -2.6, 0], 'fine')),
  });
  tr.add(trim.gold.geometry(), M.gold);
  tr.add(trim.chrome.geometry(), M.chrome);

  /* ------------------------------------------------------------------ left wing (last) */
  bee.mirror(wing, { group: 'wing-l' });
}
