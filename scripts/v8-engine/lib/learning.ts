import { cylinderState, ORDER, mod } from './mechanics';

export const LESSONS = [
  {
    title: 'Power',
    text: 'Ignition starts the burn near top dead center. Expanding gas pushes the piston down while both valves stay closed.',
    cue: 'Both valves closed · piston descends',
  },
  {
    title: 'Exhaust',
    text: 'The exhaust valve opens. The rising piston pushes spent gas out through the exhaust port.',
    cue: 'Exhaust open · gas leaves',
  },
  {
    title: 'Intake',
    text: 'The intake valve opens as the piston descends. Fresh fuel–air charge enters the growing space above the piston.',
    cue: 'Intake open · fresh charge enters',
  },
  {
    title: 'Compression',
    text: 'Both valves close. The rising piston squeezes the trapped charge into a smaller volume, ready for ignition.',
    cue: 'Both valves closed · charge compresses',
  },
];
export const TOUR = [
  {
    title: 'One synchronized machine',
    part: 'Cross-plane crankshaft',
    text: 'Eight cylinders share one crankshaft. Each cylinder completes its four strokes in 720°; a different cylinder fires every 90°.',
    view: 'assembled',
  },
  {
    title: 'The piston',
    part: 'Piston 1',
    text: 'The piston travels in a straight bore. Watch one full intake, compression, power, and exhaust cycle using the colored charge.',
    view: 'cutaway',
  },
  {
    title: 'The connecting rod',
    part: 'Connecting rod 1',
    text: 'The wrist pin pivots while the big end circles the crankshaft. The rigid rod joins those two motions without changing length.',
    view: 'cutaway',
  },
  {
    title: 'The crankshaft',
    part: 'Cross-plane crankshaft',
    text: 'Four shared crankpins lie in two perpendicular planes. Their offset converts the rods’ reciprocating motion into rotation.',
    view: 'cutaway',
  },
  {
    title: 'The camshaft and timing drive',
    part: 'Camshaft',
    text: 'The chain turns a 40-tooth cam sprocket from a 20-tooth crank sprocket. The cam therefore turns once per complete four-stroke cycle.',
    view: 'cutaway',
  },
  {
    title: 'Valves, springs, and rockers',
    part: 'Rocker arm 1',
    text: 'A cam lobe lifts a follower and pushrod. The rocker opens the valve; the spring closes it. Use the cycle buttons to compare intake and exhaust.',
    view: 'cutaway',
  },
  {
    title: 'Trace the supporting systems',
    part: 'Intake plenum',
    text: 'The intake feeds the cylinders, ignition leads reach the spark plugs, and blue coolant passages surround the bores. Exploded view separates the assemblies for inspection.',
    view: 'exploded',
  },
] as const;
export function lessonAngle(id: number, stroke: number) {
  return mod(ORDER.indexOf(id) * 90 + stroke * 180 + 90);
}
export function chargeState(id: number, angle: number) {
  const s = cylinderState(id, angle);
  return {
    ...s,
    crown: s.distance + 0.23,
    height: Math.max(0.015, 2.46 - s.distance - 0.23),
    flow: s.intake > 0.001 ? 'in' : s.exhaust > 0.001 ? 'out' : 'closed',
    burn: s.cycle < 65 ? 1 - s.cycle / 65 : 0,
  };
}
