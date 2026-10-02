// flight.js - APX-9 flight assembly (CONTRACT 13.4): the two wing mounts and the central flight motor.
// Complete bearing mounts and central slider-crank flight drive.
import { createMotor, buildHousing, buildFlangeStack, buildPosts, buildStrap } from './flight-motor.js';
import { buildDriveMotor, buildGearTrain, buildCam, buildLinkage } from './flight-motor-mech.js';
import { K, ex, M, box, THREE } from '../kit.js';
import { makeFasteners } from './flight-util.js';
import { buildBearings, buildRetainingRing, buildSpacers } from './flight-bearings.js';
import { buildShaft, buildShaftPin, buildShaftNut, buildHinge, buildClampPlates, buildBoltCircles } from './flight-mount.js';
import { buildGearbox, buildSensor, buildServo } from './flight-servo.js?v=763f6f391edb';
import { buildDamper, buildLever, buildHarness } from './flight-damper.js';

export async function build(ctx) {
  const { bee } = ctx;
  const F = makeFasteners();
  const sp = K.wing.span2;

  const mount = bee.part('wing-mount-r', {
    name: 'Right Wing Mount', group: 'wing-mount', matrix: K.wing.frameR.clone().multiply(new THREE.Matrix4().makeScale(1, 0.65, 0.65)),
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

  const motor = createMotor(bee);
  buildHousing(motor, F);
  buildFlangeStack(motor, F);
  buildPosts(motor, F);
  buildStrap(motor, F);
  buildDriveMotor(motor, F);
  buildGearTrain(motor, F);
  buildCam(motor, F);
  buildLinkage(motor, F);
  const pcb = motor.part('controller', {
    name: 'Flight Controller PCB',
    info: 'Motor drive controller with power MOSFETs, current-sense components, ceramic capacitors and a finned heat sink.',
    explode: ex([0, 2.1, 0], 'mid'),
  });
  pcb.add(box(1.25, 0.06, 1.1, 0.04), M.pcb, [0.65, 0.24, 0]);
  pcb.add(box(0.48, 0.14, 0.5, 0.025), M.black, [0.65, 0.35, 0]);
  for (let i = 0; i < 8; i++) pcb.add(box(0.035, 0.18, 0.51, 0.006), M.steel, [0.43 + i * 0.065, 0.46, 0]);
  for (const side of [-1, 1]) for (let i = 0; i < 5; i++) {
    pcb.add(box(0.06, 0.04, 0.16, 0.008), M.gold, [0.22 + i * 0.19, 0.3, side * 0.46]);
  }

  bee.mirror(mount);
}
