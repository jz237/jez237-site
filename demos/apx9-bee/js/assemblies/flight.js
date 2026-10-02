// flight.js - APX-9 flight assembly (CONTRACT 13.4): the two wing mounts and the central flight motor.
// (bring-up version: mount hardware only, motor is a placeholder box)
import { K, ex, M, box } from '../kit.js';
import { makeFasteners } from './flight-util.js';
import { buildBearings, buildRetainingRing, buildSpacers } from './flight-bearings.js';
import { buildShaft, buildShaftPin, buildShaftNut, buildHinge, buildClampPlates, buildBoltCircles } from './flight-mount.js';
import { buildGearbox, buildSensor, buildServo } from './flight-servo.js';
import { buildDamper, buildLever, buildHarness } from './flight-damper.js';

export async function build(ctx) {
  const { bee } = ctx;
  const F = makeFasteners();
  const sp = K.wing.span2;

  const mount = bee.part('wing-mount-r', {
    name: 'Right Wing Mount', group: 'wing-mount', matrix: K.wing.frameR,
    info: 'Bearing-supported oscillation actuator at the right wing root: servo, planetary gearbox, damper and clamp hardware drive the wing hinge.',
    specs: { Material: 'Chrome steel, gunmetal, yellow anodised aluminium', Mass: '0.4 g', Function: 'Wing oscillation drive' },
    explode: ex([sp.x * 12, sp.y * 12, sp.z * 12], 'top'),
  });
  buildShaft(mount);
  buildShaftPin(mount, F);
  buildShaftNut(mount);
  buildHinge(mount, F);
  buildBearings(mount);
  buildRetainingRing(mount);
  buildSpacers(mount);
  buildClampPlates(mount);
  buildBoltCircles(mount, F);
  buildGearbox(mount, F);
  buildSensor(mount, F);
  buildServo(mount, F);
  buildDamper(mount, F);
  buildLever(mount);
  buildHarness(mount, F);

  const motor = bee.part('flight-motor', {
    name: 'Flight Motor', group: 'wing-mount', pos: [2.5, 3.6, 0],
    info: 'Placeholder flight motor block for the bring-up build of the flight assembly.',
    specs: { Material: 'test', Mass: '0.4 g' },
    explode: ex([0, 10, 0], 'top'),
  });
  motor.add(box(3.6, 1.8, 1.6, 0.1), M.gunmetal);

  bee.mirror(mount);
}
