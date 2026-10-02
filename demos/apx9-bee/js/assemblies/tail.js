// APX-9 tail: the rear stabilizer system and the stinger / probe unit (CONTRACT 13.7).
// Everything is modelled in the abdomen-local frame (K.abdomen.frame): a point at distance a behind the petiole is
// (-a, R(a) cos phi, R(a) * aspect * sin phi). The abdomen shell ends at a = 9 (R = 3.175); the stabilizer cowl continues
// the taper to a = 11.15 and the stinger runs from the a = 9 ring centre to K.abdomen.tipLocal along a straight axis.
//
// INVENTORY
//   stabilizer  (tail-panels.js, tail-gimbal.js)
//     mount-ring         ring that ties the stabilizer to the abdomen at a = 9, with four diagonal longerons
//     louvered-panel-1..4  curved black louvered cowl panels (2 large dorsal-side, 2 small) with yellow trim, barcode plates
//     gimbal-ring        black C-arcs, chrome inner ring with bearings, conical turbine hub
//     thruster-1..4      micro-thruster nozzles with glow, one in each diagonal gap between the panels
//     attitude-sensor    IMU board in a bezel behind the hub
//     control-fins       aft rim ring with four swept vanes
//     actuators          four linear actuators linking the panels to the gimbal ring
//     flex-cable         ribbon cable from the sensor to the abdomen
//     bolts              cap screws on the mount ring, panels and gimbal
//   stinger  (tail-stinger.js; every leaf is modelled about +Y = the stinger axis, node matrix = stingerFrame(0))
//     root-mount, joint-1, valve, ampoule, scanner-head, joint-2,
//     sheath (container) with seg-1..7, joint-3, needle, sampling-tube
import { K, ex } from '../kit.js';
import { buildStinger } from './tail-stinger.js';
import { buildStabilizer } from './tail-panels.js';

export async function build(ctx) {
  const { bee } = ctx;

  const stabilizer = bee.part('stabilizer', {
    name: 'Rear Stabilizer System', group: 'stabilizer', matrix: K.abdomen.frame,
    info: 'Louvered black cowl panels with yellow trim, a chrome gimbal ring with four micro-thrusters and an attitude sensor that trim the bee in flight and steady the stinger while it probes.',
    specs: {
      Material: 'Black anodised aluminium panels, yellow trim, chrome gimbal bearings',
      Mass: '0.25 g', Function: 'Attitude trim and thrust vectoring', Dimensions: '6.4 mm across, 2.2 mm deep',
    },
    explode: ex([-30, -4, 0], 'top'),
  });

  const stinger = bee.part('stinger', {
    name: 'Stinger / Probe Unit', group: 'stinger', matrix: K.abdomen.frame,
    info: 'Telescoping probe on a ball joint: scanner head, valve, amber micro-injection ampoule, a seven-segment black and gold sheath, a glass sampling tube and a retractable chrome needle.',
    specs: {
      Material: 'Black polymer sheath, gold collars, chrome knuckles, borosilicate glass',
      Mass: '0.25 g', Function: 'Plant scanning, sampling and micro-injection', Dimensions: '4.9 mm long, 1.9 mm across the root',
    },
    explode: ex([-38, -8, 0], 'top'),
  });

  buildStabilizer(stabilizer);
  buildStinger(stinger);
}
