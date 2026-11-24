/**
 * Life: the assembled body moves.
 *
 *   breathing   about 14 breaths a minute at rest. Each rib swings up and out about its joint with the spine,
 *               carrying the sternum forward and up; the diaphragm descends, the lungs lengthen from a fixed apex,
 *               the abdominal organs are pushed down and the belly wall moves out. Inhalation is quicker than
 *               exhalation and there is a short rest before the next breath.
 *   heartbeat   about 70 beats a minute at rest, a little faster while breathing in. The atria contract first and
 *               top up the ventricles; the ventricles then contract towards the apex, pulling the atria and the
 *               roots of the great vessels down with them while the atria refill; the aorta and pulmonary trunk
 *               swell as the blood is ejected. The valve leaflets hinge on their rings: the two inflow valves are
 *               open while the ventricles fill and shut when they contract, the two outflow valves the reverse.
 *   pulse       each artery swells slightly as the pressure wave reaches it, later the further it is from the heart.
 *   gut         a slow ripple travels along the stomach, intestines and ureters (a vertex-shader wave, materials.js).
 *   sway        nobody stands perfectly still: the whole body leans a few millimetres about the ankles, slowly and
 *               irregularly, more front-to-back than side-to-side, and the calf and shin muscles take turns to hold it.
 *   head        turns and nods a degree or two, the neck bending with it vertebra by vertebra.
 *   elbows      each forearm bends a few degrees at the elbow and straightens again, slowly and independently.
 *   wrists      each hand flexes and extends a few degrees at the wrist, on its own slow rhythm.
 *   effort      with the heart rate up (exercise), the arteries widen and pulse harder and the jaw drops a few
 *               millimetres on each breath in, as it does when breathing through the mouth.
 *   eyes        both eyes jump together to a new point of gaze every second or two, with small corrections between,
 *               and blink every few seconds.
 *   swallowing  now and then the larynx and hyoid rise about two centimetres and drop back, stretching the trachea.
 *   brain       swells very slightly with each arterial pulse, as it does inside the skull.
 *   veins       the large veins narrow a little on the in-breath in the chest and neck and fill in the abdomen.
 *
 * How it is done: every motion is a smooth displacement field over body space, F(point, time), so neighbours always
 * move together and nothing tears or collides. What a piece does with the field depends on what it is made of:
 *   solid     heart, liver and the other organs, sternum, vertebrae, skull: moved (and for the head, turned) as a
 *             whole by the field at their centre, never resized by breathing;
 *   elastic   diaphragm, cartilage: also stretched by the field's change across the piece;
 *   ribs      rigid: rotated about the joint with the spine by exactly the angle that keeps the front end on the
 *             chest-wall field, which is what joins it to its cartilage and the sternum;
 *   layers    skin, muscle, fascia, the vessels, nerves and ligaments in them, and the lungs: not moved here at
 *             all. Each vertex follows the field in the shader (materials.js, enliven), because these lie on each
 *             other with no gap and would otherwise show through one another.
 * For whole pieces that reduces to a few fixed vectors multiplied by a signal (breath, ventricles, atria, pulse),
 * so a frame costs a handful of multiplications per piece.
 *
 * Amplitudes are those of quiet breathing and a resting heart, slightly enlarged so they read at arm's length.
 * This is an illustration of the motion, not a measurement of it.
 */
import * as THREE from 'three';
import { lifeUniforms, layerOf } from './materials.js?v=4f6f543d94';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const smoother = t => { t = Math.min(1, Math.max(0, t)); return t * t * t * (t * (t * 6 - 15) + 10); };
const TAU = Math.PI * 2;

// ---- timing
export const REST = { bpm: 70, breaths: 14, depth: 1 }, EXERCISE = { bpm: 132, breaths: 30, depth: 1.6 };
const INHALE = 0.38, EXHALE_END = 0.92;   // fractions of a breath: in, out, rest

/** 0 = end of exhalation, 1 = full (quiet) inhalation. */
function breathCurve(phase) {
  if (phase < INHALE) return smoother(phase / INHALE);
  if (phase < EXHALE_END) return 1 - smoother(Math.pow((phase - INHALE) / (EXHALE_END - INHALE), 0.8));   // passive recoil: quick at first, then easing
  return 0;
}
/** A contraction: quick rise from `start` to `peak`, slower release until `end`. */
const contraction = (phase, start, peak, end) => phase < start || phase > end ? 0 : phase < peak ? smoother((phase - start) / (peak - start)) : 1 - smoother((phase - peak) / (end - peak));

// One heartbeat, as fractions of the beat. The mechanical events and their names:
export const BEAT_PHASES = [
  { until: 0.14, name: 'Atrial systole', note: 'The atria contract and top up the ventricles. Inflow valves open, outflow valves shut.' },
  { until: 0.19, name: 'Isovolumetric contraction', note: 'The ventricles start to squeeze. All four valves are shut, so pressure rises with no flow.' },
  { until: 0.46, name: 'Ejection', note: 'Pressure opens the aortic and pulmonary valves and blood leaves the ventricles.' },
  { until: 0.56, name: 'Isovolumetric relaxation', note: 'The ventricles relax. The outflow valves snap shut and all four are closed again.' },
  { until: 1.00, name: 'Filling', note: 'The inflow valves open and blood runs from the atria into the relaxed ventricles.' }
];
export const beatPhase = phase => BEAT_PHASES.find(p => phase < p.until) || BEAT_PHASES[BEAT_PHASES.length - 1];
const atrialCurve = phase => contraction(phase, 0.0, 0.07, 0.17);
const ventricularCurve = phase => contraction(phase, 0.14, 0.31, 0.56);
const outflowOpen = phase => smooth(0.185, 0.215, phase) * (1 - smooth(0.44, 0.47, phase));                 // aortic and pulmonary valves
const inflowOpen = phase => phase < 0.4 ? 1 - smooth(0.125, 0.15, phase) : smooth(0.555, 0.61, phase);       // mitral and tricuspid valves
/** Arterial pressure: sharp upstroke, slow run-off with a small second bump after the aortic valve closes. */
function pulseCurve(phase) {
  phase -= Math.floor(phase);
  return contraction(phase, 0.16, 0.28, 0.75) + 0.12 * contraction(phase, 0.46, 0.52, 0.66);
}

// ---- amplitudes (metres, or fractions of size)
const CHEST_SIDE = 0.012;      // lateral widening per metre from the midline (about 1.5 mm at the ribs: as much as the rigid ribs of this model deliver, so the lungs never pass through them)
const CHEST_FRONT = 0.036;     // forward travel per metre in front of the spine (about 6 mm at the sternum)
const CHEST_LIFT = 0.004;      // the sternum end of the ribs rises
const BELLY_OUT = 0.007;       // anterior abdominal wall
const DIAPHRAGM_DROP = 0.016;  // descent of the dome
const HEART_RIDE = 0.6;        // how much of that descent the heart follows
const VENTRICLE = 0.075, ATRIUM = 0.06, ATRIUM_FILL = 0.035, GREAT_VESSEL = 0.03, ARTERY = 0.014;
const PULSE_SPEED = 6;         // metres per second along the arterial tree
const RIB = /^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth) rib$/;
const SWAY_FRONT = 0.0045, SWAY_SIDE = 0.0022;   // radians about the ankles: about 7 mm and 3.5 mm at the head
const CALF_TONE = 0.012;                          // the muscle holding the lean thickens by this fraction
const GAZE_SIDE = 0.13, GAZE_UP = 0.055;          // radians: how far the eyes wander from straight ahead
const HEAD_YAW = 0.045, HEAD_PITCH = 0.02, HEAD_ROLL = 0.008;   // radians: about 2.6, 1.1 and 0.5 degrees
const SWALLOW_RISE = [0, 0.018, 0.004], SWALLOW_SECONDS = 1.1;
const BLINK_SECONDS = 0.32;
const BRAIN_PULSE = 0.003, VEIN_BREATH = 0.012;
const OUTFLOW_SWING = 1.0, INFLOW_SWING = 0.9;   // radians a leaflet turns on its ring between shut and open
const ELBOW_BEND = 0.075;                        // radians: the forearm wanders between straight and about 4 degrees bent
const WRIST_BEND = 0.085;                        // radians: the hand wanders about 5 degrees either side of straight
const JAW_DROP = 0.06;                           // radians: about 5 mm between the front teeth, for mouth breathing
const ARTERY_EFFORT = 0.045, PULSE_EFFORT = 0.7; // exercise: arteries this much wider, and the pulse this much stronger
const LOWER_TOOTH = /^Lower (medial incisor|lateral incisor|canine|first premolar|second premolar|first molar tooth|second molar tooth|third molar tooth)$/;

/**
 * Conditions for teaching. Each is a deliberately simplified picture of one thing going wrong, built from the same
 * controls as the healthy body: it shows what the word means, not how a real case behaves, and is not a diagnosis.
 */
export const CONDITIONS = {
  normal: { name: 'Healthy', note: 'A resting heart of about 70 beats a minute and quiet breathing.', rates: REST },
  fast: { name: 'Fast heartbeat', note: 'Tachycardia: over 100 beats a minute at rest. The ventricles have less time to fill between beats.', rates: { bpm: 150, breaths: 18, depth: 1 } },
  slow: { name: 'Slow heartbeat', note: 'Bradycardia: under 60 beats a minute. Normal in sleep and in trained athletes; otherwise each beat has to do more.', rates: { bpm: 44, breaths: 12, depth: 1 } },
  irregular: { name: 'Irregular heartbeat', note: 'As in atrial fibrillation: the atria quiver instead of contracting, so there is no P wave and no atrial kick, and the ventricles beat at uneven intervals.', rates: { bpm: 96, breaths: 15, depth: 1 }, irregular: true },
  shallow: { name: 'Shallow breathing', note: 'Fast, shallow breaths: the diaphragm and ribs travel less than half as far, so each breath moves much less air.', rates: { bpm: 88, breaths: 26, depth: 0.42 } },
  leak: { name: 'Leaking aortic valve', note: 'Aortic regurgitation: the valve does not shut fully, so some blood falls back into the left ventricle while it should be filling from the atrium.', rates: { bpm: 76, breaths: 14, depth: 1 }, leak: 0.3 },
  // the next three change the shape of something, not only its timing
  enlarged: { name: 'Enlarged heart', note: 'Cardiomegaly: a heart that has stretched to keep up, here about a fifth bigger. Its walls move less with each beat, so it pumps less of what it holds. Switch off the skeleton under Systems shown for a clear view.', rates: { bpm: 88, breaths: 18, depth: 1 }, shape: 'heart' },
  collapsed: { name: 'Collapsed lung', note: 'Pneumothorax: air between the left lung and the chest wall lets the lung shrink towards its root. The ribs still move but that lung takes in little air, so breathing and the heart speed up. Switch off the skeleton under Systems shown for a clear view.', rates: { bpm: 108, breaths: 26, depth: 0.8 }, shape: 'lung' },
  narrowed: { name: 'Narrowed leg artery', note: 'Peripheral arterial disease: the left femoral artery is narrowed, so less blood gets past it and the pulse below the knee is weak. Switch on Blood flow to see it slow.', rates: { bpm: 74, breaths: 14, depth: 1 }, shape: 'artery' }
};
export const SHAPES = { heart: 1.2, lung: 0.58, artery: 0.5 };   // how big the affected pieces become

export function createLife() {
  const life = { on: true, breath: 0.15, beat: 0, time: Math.random() * 60, weight: 0, anchors: null, animated: [], planned: 0, swayGain: 0, swayX: 0, swayZ: 0,
    rate: { ...REST }, speed: 1, scrub: null, head: [0, 0, 0], elbow: [0, 0], wrist: [0, 0], jaw: 0, effort: 0, shape: { heart: 0, lung: 0, artery: 0 }, condition: 'normal', interval: 1, loopBeat: null, loopBreath: null, loopSwallow: null,
    gaze: { x: 0, y: 0, fromX: 0, fromY: 0, toX: 0, toY: 0, t: 1, seconds: 0.05, wait: 1.2 }, swallow: { t: -1, wait: 14 + Math.random() * 14 }, blink: { t: -1, wait: 2 + Math.random() * 3 } };
  const signals = { breath: 0, ventricle: 0, atrium: 0, sway: 0, swallow: 0, outflow: 0, inflow: 1, blink: 0, leak: 0, effort: 0, narrow: 0 };
  const wristNow = [new THREE.Vector3(), new THREE.Vector3()], wristPivot = [[0, 0, 0], [0, 0, 0]];
  const turn = new THREE.Quaternion(), arm = new THREE.Vector3(), axis = new THREE.Vector3();
  const eyeTurn = new THREE.Quaternion(), eyeNow = new THREE.Quaternion(), lean = new THREE.Quaternion(), tilt = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), ACROSS = new THREE.Vector3(1, 0, 0), FORWARD = new THREE.Vector3(0, 0, 1);

  /** Landmarks of the body, read from the model so the fields fit it. */
  function setup(manifest) {
    const piece = name => manifest.pieces.find(p => p.name === name);
    const mark = name => manifest.landmarks.find(l => l.name === name)?.position;
    const t6 = piece('Vertebra T6'), sternum = piece('Body of sternum'), rib1 = piece('First rib'), rib12 = piece('Twelfth rib');
    const lung = piece('Inferior lobe of left lung'), hip = piece('Hip bone'), lv = piece('Left ventricle'), la = piece('Left atrium'), rv = piece('Right ventricle'), ra = piece('Right atrium'), arch = piece('Aortic arch');
    const c1 = piece('Atlas (C1)'), c4 = piece('Vertebra C4'), c7 = piece('Vertebra C7');
    // the elbow: the lower end of each humerus (left first, to match the shader's arrays)
    const elbows = [1, -1].map(sign => { const h = manifest.pieces.find(p => p.name === 'Humerus' && Math.sign(p.center[0]) === sign); return h ? [h.center[0] + sign * 0.02, h.center[1] - h.size[1] / 2 + 0.012, h.center[2] + 0.005] : [sign * 0.217, 1.09, -0.039]; });
    // the wrist: the lower end of each radius. The jaw: the hinge in front of the ear, where the lips meet, and the chin
    const wrists = [1, -1].map(sign => { const r = manifest.pieces.find(p => p.name === 'Radius' && Math.sign(p.center[0]) === sign); return r ? [r.center[0], r.center[1] - r.size[1] / 2 + 0.006, r.center[2] + 0.012] : [sign * 0.255, 0.853, -0.012]; });
    const mandible = piece('Mandible'), incisor = piece('Lower medial incisor');
    const jaw = mandible ? { pivot: [0, mandible.center[1] + mandible.size[1] / 2 - 0.006, mandible.center[2] - mandible.size[2] / 2 + 0.008], lips: incisor ? incisor.center[1] + incisor.size[1] / 2 : mandible.center[1], chin: mandible.center[1] - mandible.size[1] / 2 } : null;
    // conditions that change a shape: what they act on, and the point each shrinks or swells about
    const lungSet = new Set(manifest.assemblies?.lungs || []), root = piece('Left main bronchus'), femoral = manifest.pieces.find(p => p.name === 'Femoral artery' && p.center[0] > 0);
    const apex = mark('Apex of heart') || [0.099, 1.231, 0.072], base = mark('Base of heart') || [-0.066, 1.311, -0.018];
    const heart = lv ? lv.center : [0.04, 1.27, 0.01];
    const a = life.anchors = {
      spineZ: t6 ? t6.center[2] : -0.083, sternumZ: sternum ? sternum.center[2] : 0.074,
      ribsTop: rib1 ? rib1.center[1] : 1.408, ribsBottom: rib12 ? rib12.center[1] : 1.096,
      lungTop: (mark('Apex of lung') || [0, 1.431, 0])[1], dome: lung ? lung.center[1] - lung.size[1] / 2 + 0.02 : 1.177,
      pelvis: hip ? hip.center[1] + hip.size[1] / 2 - 0.05 : 0.95,
      // the ventricles contract towards a point a quarter of the way up from the apex; the plane between atria and
      // ventricles (where the valves sit) is what gets pulled down
      heartPivot: apex.map((v, i) => v + (base[i] - v) * 0.25),
      valvePlane: la && lv ? la.center.map((v, i) => (v + lv.center[i]) / 2) : heart,
      archY: arch ? arch.center[1] + arch.size[1] / 2 : 1.39, heart,
      ankle: (() => { const t = piece('Talus'); return t ? [0, t.center[1], t.center[2]] : [0, 0.059, -0.053]; })(),
      eyes: manifest.pieces.filter(p => p.name === 'Sclera').map(p => p.center),
      brain: (() => { const list = manifest.pieces.filter(p => p.file === 'brain' && p.region === 'head' && p.size[0] > 0.03), n = Math.max(1, list.length); return list.reduce((s, p) => s.map((v, i) => v + p.center[i] / n), [0, 0, 0]); })(),
      larynx: new Set(manifest.assemblies?.larynx || []),
      // the head turns about the middle of the neck; the turn fades in from the base of the neck to the base of the skull
      neckPivot: c4 ? [0, c4.center[1], c4.center[2]] : [0, 1.484, -0.043], neckBase: c7 ? c7.center[1] - 0.005 : 1.438, skullBase: c1 ? c1.center[1] - 0.004 : 1.53,
      valves: new Map(), elbows, wrists, jaw,
      collapse: new Set(manifest.pieces.filter(p => lungSet.has(p.id) && p.center[0] > 0.03).map(p => p.id)), lungRoot: root ? [root.center[0] + root.size[0] / 2, root.center[1] - 0.01, root.center[2]] : [0.04, 1.3, -0.02],
      heartMiddle: apex.map((v, i) => (v + base[i]) / 2), narrow: femoral ? femoral.id : null, narrowBelow: femoral ? femoral.center[1] - femoral.size[1] / 2 + 0.03 : 0
    };
    // Valve leaflets. Each hinges on the valve ring, at its edge furthest from the middle of the valve, about an
    // axis lying in the ring; turning it swings its free edge the way the blood goes.
    const valve = (names, from, to, swing, signal) => {
      const leaflets = manifest.pieces.filter(p => names.test(p.name)); if (!leaflets.length || !from || !to) return;
      const flow = new THREE.Vector3().fromArray(to.center).sub(new THREE.Vector3().fromArray(from.center)).normalize();
      const middle = leaflets.length > 1 ? leaflets.reduce((s, p) => s.add(new THREE.Vector3().fromArray(p.center).multiplyScalar(1 / leaflets.length)), new THREE.Vector3()) : new THREE.Vector3().fromArray(from.center).lerp(new THREE.Vector3().fromArray(to.center), 0.5);
      for (const p of leaflets) {
        const c = new THREE.Vector3().fromArray(p.center), out = c.clone().sub(middle); out.addScaledVector(flow, -out.dot(flow));
        if (out.lengthSq() < 1e-8) continue; out.normalize();
        a.valves.set(p.id, { pivot: c.clone().addScaledVector(out, Math.max(...p.size) * 0.4).toArray(), axis: flow.clone().cross(out).normalize().toArray(), swing, signal });
      }
    };
    valve(/^(Left coronary|Non-coronary|Right coronary) leaflet$/, lv, piece('Ascending aorta'), OUTFLOW_SWING, 'outflow');
    valve(/semilunar leaflet of pulmonary valve$/, rv, piece('Pulmonary trunk'), OUTFLOW_SWING, 'outflow');
    valve(/leaflet of right atrioventricular valve$/, ra, rv, INFLOW_SWING, 'inflow');
    valve(/leaflet of left atrioventricular valve$/, la, lv, INFLOW_SWING, 'inflow');
    // the shaders evaluate the same fields: give them the same numbers
    lifeUniforms.trunk.value.set(a.ribsBottom, a.ribsTop, a.pelvis, a.dome); lifeUniforms.spine.value.set(a.spineZ, a.sternumZ); lifeUniforms.chest.value.set(CHEST_SIDE, CHEST_LIFT, CHEST_FRONT, BELLY_OUT);
    lifeUniforms.lung.value.set(a.lungTop, DIAPHRAGM_DROP); lifeUniforms.neckPivot.value.fromArray(a.neckPivot); lifeUniforms.neckRange.value.set(a.neckBase, a.skullBase);
    a.eyes.slice(0, 2).forEach((e, i) => lifeUniforms.eyes.value[i].fromArray(e));
    a.elbows.forEach((e, i) => lifeUniforms.elbows.value[i].fromArray(e));
    a.wrists.forEach((w, i) => lifeUniforms.wrists.value[i].fromArray(w));
    if (jaw) lifeUniforms.jaw.value.set(jaw.pivot[1], jaw.pivot[2], jaw.lips, jaw.chin);
  }

  // ---- breathing fields. Each returns the displacement of a body-space point at full inhalation.
  function trunkWeight(p) {
    const a = life.anchors, side = 1 - smooth(0.19, 0.27, Math.abs(p[0]));   // fades out before the arms
    return { side, chest: smooth(a.ribsBottom - 0.06, a.ribsBottom + 0.07, p[1]) * (1 - smooth(a.ribsTop - 0.01, a.ribsTop + 0.07, p[1])) * side,
      belly: smooth(a.pelvis - 0.02, a.pelvis + 0.09, p[1]) * (1 - smooth(a.dome - 0.05, a.dome + 0.03, p[1])) * side };
  }
  const front = z => smooth(life.anchors.spineZ, life.anchors.sternumZ, z);   // 0 at the spine, 1 at the sternum
  /** Chest wall and everything riding on it. */
  function wallField(p) {
    const a = life.anchors, w = trunkWeight(p), f = front(p[2]);
    return [p[0] * CHEST_SIDE * w.chest, CHEST_LIFT * f * w.chest, Math.max(0, p[2] - a.spineZ) * CHEST_FRONT * w.chest + BELLY_OUT * f * f * w.belly];
  }
  /** How far the diaphragm's descent carries at a given height: nothing at the lung apex, all of it at the dome, fading out towards the pelvis. */
  function descent(y) {
    const a = life.anchors;
    return y >= a.dome ? smooth(a.lungTop, a.dome, y) : 1 - smooth(a.dome, a.pelvis, y);
  }
  /** Organs: carried out with the wall, and pushed down by the diaphragm. */
  function organField(p) {
    const wall = wallField(p), w = trunkWeight(p);
    return [wall[0], -DIAPHRAGM_DROP * descent(p[1]) * w.side, wall[2]];
  }

  /** Offset and stretch of a piece under a field: the field at its centre, and its change across the piece. */
  function sample(field, piece) {
    const c = piece.center, h = piece.size.map(v => Math.max(v / 2, 0.004));
    const offset = field(c), stretch = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const lo = c.slice(), hi = c.slice(); lo[i] -= h[i]; hi[i] += h[i];
      stretch[i] = (field(hi)[i] - field(lo)[i]) / (2 * h[i]);
    }
    return { offset, stretch };
  }

  /**
   * A rib is rigid. Its head stays on the spine; its front end must stay on the chest wall. The small rotation
   * about the head that carries the front end by the wall's displacement d is w = (r x d) / |r|^2, r being the
   * vector from head to front end (the "pump handle" lift).
   */
  function ribSwing(piece) {
    const a = life.anchors, c = piece.center, s = piece.size, sx = Math.sign(c[0]) || 1;
    const head = [sx * 0.025, c[1] + s[1] / 2 - 0.012, a.spineZ + 0.012];                                // the ribs slope down from the spine, so the head is the high end
    const tip = [c[0] - sx * (s[0] / 2 - 0.02), c[1] - s[1] / 2 + 0.012, c[2] + s[2] / 2 - 0.006];       // the front, lower, inner end
    const r = tip.map((v, i) => v - head[i]), d = wallField(tip), len2 = r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
    if (len2 < 1e-6) return null;
    const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const swing = cross(r, d).map(v => v / len2);
    // That fixes the front end. Turning about the head-to-tip line leaves both ends where they are and swings the
    // side of the rib up and out, so use it to keep the rib's outermost point on the wall as well (the bucket handle).
    const len = Math.sqrt(len2), along = r.map(v => v / len), side = [c[0] + sx * s[0] / 2, c[1], c[2]], rs = side.map((v, i) => v - head[i]);
    const reach = cross(along, rs), reach2 = reach[0] * reach[0] + reach[1] * reach[1] + reach[2] * reach[2];
    if (reach2 > 1e-6) {
      const got = cross(swing, rs), wanted = wallField(side), roll = reach.reduce((sum, v, i) => sum + v * (wanted[i] - got[i]), 0) / reach2;
      for (let i = 0; i < 3; i++) swing[i] += along[i] * roll;
    }
    return { pivot: head, turn: swing };
  }

  const isArtery = piece => piece.file === 'vessels' && (/arter|aorta|trunk|circle/i.test(piece.name) || /Arterial system/.test(piece.path || ''));
  const heartRole = name => /atrium/i.test(name) ? 'atrium'
    : /ventricle|papillary|atrioventricular|coronary (artery|sinus)|cardiac vein|interventricular|circumflex|inferolateral/i.test(name) ? 'ventricle' : 'vessel';

  /**
   * Work out a piece's motion once: { channels: [{ signal, offset, stretch, delay }], rib, eye, valve, head }.
   * A channel moves the piece by offset x signal and scales it by 1 + stretch x signal; the rest are turns.
   */
  function plan(part) {
    const a = life.anchors, piece = part.piece, c = piece.center, channels = [], NONE = [0, 0, 0], layered = layerOf(piece) > 0;
    const add = (signal, offset, stretch, delay = 0) => { if (offset.some(v => Math.abs(v) > 2e-5) || stretch.some(v => Math.abs(v) > 2e-4)) channels.push({ signal, offset, stretch, delay }); };
    let rib = null, eye = null, head = 0, elbow = null, wrist = null, shape = null;
    // breathing (layered pieces follow the same fields per vertex, in their shaders)
    if (!layered && piece.region !== 'upper limb' && piece.region !== 'lower limb' && piece.region !== 'head') {
      if (piece.file === 'skeletal' && RIB.test(piece.name)) rib = ribSwing(piece);
      else {
        const organ = piece.file !== 'skeletal';   // viscera, heart, diaphragm, spleen, thymus
        const s = sample(organ ? organField : wallField, piece);
        const elastic = organ ? piece.name === 'Diaphragm' : /cartilage/i.test(piece.name);
        if (piece.file === 'heart') s.offset[1] *= HEART_RIDE;
        add('breath', s.offset, elastic ? s.stretch : NONE);
      }
    }
    // heartbeat
    if (piece.file === 'heart') {
      const role = heartRole(piece.name), about = (p, k) => p.map((v, i) => (c[i] - v) * k);
      const pull = a.valvePlane.map((v, i) => (v - a.heartPivot[i]) * -VENTRICLE);   // how far the valve plane travels at full contraction
      if (role === 'ventricle') add('ventricle', about(a.heartPivot, -VENTRICLE), [-VENTRICLE, -VENTRICLE, -VENTRICLE]);
      else if (role === 'atrium') {
        add('atrium', about(a.valvePlane, -ATRIUM), [-ATRIUM, -ATRIUM, -ATRIUM]);                                                     // the atrial kick
        add('ventricle', pull.map((v, i) => v + (c[i] - a.valvePlane[i]) * ATRIUM_FILL), [ATRIUM_FILL, ATRIUM_FILL, ATRIUM_FILL]);   // dragged down with the valves, and refilling
      } else {
        const hold = 1 - smooth(a.valvePlane[1], a.archY, c[1]);   // the roots move with the heart, the arch stays put
        add('ventricle', pull.map(v => v * hold), NONE);
        if (/aort|pulmonary (trunk|artery)|bifurcation/i.test(piece.name)) add('pulse', NONE, [GREAT_VESSEL, GREAT_VESSEL, GREAT_VESSEL], 0.02);
      }
    }
    const valve = a.valves.get(piece.id) || null;
    // arterial pulse: swell across the vessel, not along it
    if (isArtery(piece)) {
      const longest = piece.size.indexOf(Math.max(...piece.size));
      const delay = Math.hypot(c[0] - a.heart[0], c[1] - a.heart[1], c[2] - a.heart[2]) / PULSE_SPEED / (60 / REST.bpm);
      add('pulse', NONE, [0, 1, 2].map(i => i === longest ? 0 : ARTERY), delay);
      add('effort', NONE, [0, 1, 2].map(i => i === longest ? 0 : ARTERY_EFFORT));   // exercise opens the arteries
      if (piece.id === a.narrow) shape = { kind: 'artery', pivot: c, k: [0, 1, 2].map(i => i === longest ? 1 : SHAPES.artery) };
      else if (a.narrow && piece.region === 'lower limb' && c[0] > 0 && c[1] < a.narrowBelow) channels.forEach(ch => { if (ch.signal === 'pulse') ch.weak = true; });   // downstream of the narrowing
    }
    // veins: the big ones empty towards the chest on the in-breath and fill below the diaphragm
    if (piece.file === 'vessels' && !isArtery(piece) && /thorax|neck|abdomen/.test(piece.region)) {
      const longest = piece.size.indexOf(Math.max(...piece.size)), k = piece.region === 'abdomen' ? VEIN_BREATH * 0.7 : -VEIN_BREATH;
      add('breath', NONE, [0, 1, 2].map(i => i === longest ? 0 : k));
    }
    // the muscles that hold the lean: calf when leaning forward, shin when leaning back
    if (piece.file === 'muscular' && /soleus|gastrocnemius|tibialis anterior/i.test(piece.name)) {
      const longest = piece.size.indexOf(Math.max(...piece.size)), k = /tibialis/i.test(piece.name) ? -CALF_TONE : CALF_TONE;
      add('sway', NONE, [0, 1, 2].map(i => i === longest ? -k * 0.5 : k));
    }
    // swallowing: the larynx and hyoid rise together; the trachea is pulled up at its top end only
    if (a.larynx.has(piece.id)) add('swallow', SWALLOW_RISE, NONE);
    else if (piece.name === 'Trachea') add('swallow', SWALLOW_RISE.map(v => v * 0.5), [0, SWALLOW_RISE[1] / Math.max(piece.size[1], 0.05), 0]);
    // the brain swells a little with each pulse, about its centre; the eyeballs turn instead
    if (piece.file === 'brain' && piece.region === 'head') {
      const centre = a.eyes.find(e => Math.hypot(c[0] - e[0], c[1] - e[1], c[2] - e[2]) < 0.014);
      if (centre && !/lacrimal/i.test(piece.name)) eye = { pivot: centre };
      else if (!centre && !/ear|cochlea|vestibul|lacrimal|ossicle|tympan/i.test(piece.name)) add('pulse', c.map((v, i) => (v - a.brain[i]) * BRAIN_PULSE), [BRAIN_PULSE, BRAIN_PULSE, BRAIN_PULSE], 0.12);
    }
    // the head and neck: whole pieces turn about the neck by their share of the head's turn
    if (!layered && (piece.region === 'head' || piece.region === 'neck')) head = smooth(a.neckBase, a.skullBase, c[1]);
    // the forearm and hand: whole pieces below the elbow turn about it (their soft layers do the same per vertex)
    if (!layered && piece.region === 'upper limb') {
      const arm = c[0] > 0 ? 0 : 1, share = smooth(-0.035, 0.035, a.elbows[arm][1] - c[1]), hand = smooth(-0.02, 0.02, a.wrists[arm][1] - c[1]);
      if (share > 0.001) elbow = { arm, share }; if (hand > 0.001) wrist = { arm, share: hand };
    }
    // the mandible and the teeth in it hinge at the jaw joint (the soft tissue over them follows per vertex)
    const jaw = !!a.jaw && (piece.name === 'Mandible' || LOWER_TOOTH.test(piece.name));
    // conditions: an enlarged heart swells about its middle, a collapsed lung shrinks towards its root
    if (piece.file === 'heart' && !/vena cava|pulmonary (artery|vein)|aort/i.test(piece.name)) shape = { kind: 'heart', pivot: a.heartMiddle, k: [SHAPES.heart, SHAPES.heart, SHAPES.heart] };
    else if (a.collapse.has(piece.id)) shape = { kind: 'lung', pivot: a.lungRoot, k: [SHAPES.lung, SHAPES.lung, SHAPES.lung] };
    if (!channels.length && !rib && !eye && !valve && !elbow && !wrist && !jaw && !shape && head <= 0.001) return null;
    if (rib || eye || valve || elbow || wrist || jaw || head > 0.001) part.baseQuaternion = part.mesh.quaternion.clone();
    return { channels, rib, eye, valve, elbow, wrist, jaw, shape, head: head > 0.001 ? head : 0 };
  }

  /** Advance the clocks. The heart runs a little faster during inhalation. */
  function advance(dt) {
    dt *= life.scrub === null ? life.speed : 0;   // scrubbing through a beat holds everything else still
    life.time += dt;
    const cond = CONDITIONS[life.condition];
    // a lesson can run one part of a breath or of a beat over and over, slowed down
    if (life.loopBreath) { const [from, to] = life.loopBreath; life.breath = from + ((Math.max(from, life.breath) - from + dt * life.rate.breaths / 60 * 0.6) % (to - from)); }
    else life.breath = (life.breath + dt * life.rate.breaths / 60) % 1;
    signals.breath = breathCurve(life.breath) * life.rate.depth;
    if (life.scrub !== null) life.beat = life.scrub;
    else if (life.loopBeat) { const [from, to] = life.loopBeat; life.beat = from + ((Math.max(from, Math.min(to, life.beat)) - from + dt * 0.16) % (to - from)); }
    else {
      const next = life.beat + dt * life.rate.bpm / 60 / life.interval / (1.05 - 0.1 * Math.min(1, signals.breath));
      if (next >= 1) life.interval = cond.irregular ? 0.62 + Math.random() * 0.85 : 1;   // an irregular rhythm: every beat waits a different time
      life.beat = next % 1;
    }
    signals.atrium = cond.irregular ? 0.1 + 0.05 * Math.sin(life.time * 38) : atrialCurve(life.beat);   // fibrillating atria only quiver
    // effort follows the heart rate, a few seconds behind; a condition's change of shape eases in and out the same way
    const ease = 1 - Math.exp(-dt / 1.6);
    life.effort += (smooth(84, 132, life.rate.bpm) * (cond.shape || cond.irregular || life.condition === 'fast' ? 0 : 1) - life.effort) * ease; signals.effort = life.effort;
    for (const k in life.shape) life.shape[k] += ((cond.shape === k ? 1 : 0) - life.shape[k]) * ease * 1.6;
    signals.narrow = life.shape.artery;
    signals.ventricle = ventricularCurve(life.beat) * (1 - 0.4 * life.shape.heart);   // a stretched heart squeezes less
    signals.outflow = Math.max(outflowOpen(life.beat), cond.leak || 0);   // a leaking valve never quite shuts
    signals.inflow = inflowOpen(life.beat);
    signals.leak = cond.leak ? 1 - outflowOpen(life.beat) : 0;            // and lets blood back while it should be shut
    lifeUniforms.time.value = life.time;
    // postural sway: a few slow, unrelated rhythms add up to a wander that never quite repeats
    const t = life.time, front = 0.5 * Math.sin(TAU * t / 7.3) + 0.3 * Math.sin(TAU * t / 11.9 + 1.3) + 0.2 * Math.sin(TAU * t / 4.1 + 2.1);
    const sideways = 0.5 * Math.sin(TAU * t / 9.7 + 0.6) + 0.3 * Math.sin(TAU * t / 5.3 + 2.9) + 0.2 * Math.sin(TAU * t / 13.7);
    signals.sway = front; life.swayX = front * SWAY_FRONT; life.swayZ = -sideways * SWAY_SIDE;
    // the head: the same kind of slow wander, mostly side to side
    life.head[1] = HEAD_YAW * (0.6 * Math.sin(TAU * t / 13.1 + 0.4) + 0.4 * Math.sin(TAU * t / 5.9 + 1.0));
    life.head[0] = HEAD_PITCH * (0.6 * Math.sin(TAU * t / 8.9 + 2.0) + 0.4 * Math.sin(TAU * t / 17.3));
    life.head[2] = HEAD_ROLL * Math.sin(TAU * t / 10.7 + 0.9);
    // the elbows: each arm on its own slow rhythm, between straight and slightly bent (an elbow does not bend backwards)
    life.elbow[0] = ELBOW_BEND * (0.5 + 0.3 * Math.sin(TAU * t / 9.1 + 1.7) + 0.2 * Math.sin(TAU * t / 4.7));
    life.elbow[1] = ELBOW_BEND * (0.5 + 0.3 * Math.sin(TAU * t / 11.3 + 4.0) + 0.2 * Math.sin(TAU * t / 6.1 + 2.2));
    life.wrist[0] = WRIST_BEND * (0.15 + 0.5 * Math.sin(TAU * t / 7.7 + 0.9) + 0.35 * Math.sin(TAU * t / 3.9 + 2.6));
    life.wrist[1] = WRIST_BEND * (0.15 + 0.5 * Math.sin(TAU * t / 8.9 + 3.3) + 0.35 * Math.sin(TAU * t / 4.3));
    // mouth breathing: only when breathing deeply, and wider on the way in
    life.jaw = JAW_DROP * smooth(1.15, 1.6, life.rate.depth) * life.effort * (0.55 + 0.45 * Math.min(1, signals.breath / Math.max(1, life.rate.depth)));
    // eyes: hold, then jump. Larger jumps take longer (about 30 ms plus 2.5 ms a degree), as real saccades do
    const g = life.gaze;
    if (g.t >= 1 && (g.wait -= dt) <= 0) {
      const far = Math.random() < 0.35, rnd = () => Math.random() * 2 - 1;
      g.fromX = g.x; g.fromY = g.y;
      g.toX = Math.max(-GAZE_SIDE, Math.min(GAZE_SIDE, far ? rnd() * GAZE_SIDE : g.x * 0.6 + rnd() * 0.025));
      g.toY = Math.max(-GAZE_UP, Math.min(GAZE_UP, far ? rnd() * GAZE_UP : g.y * 0.6 + rnd() * 0.012));
      g.seconds = 0.03 + Math.hypot(g.toX - g.fromX, g.toY - g.fromY) * 0.145; g.t = 0; g.wait = far ? 1.2 + Math.random() * 2.6 : 0.35 + Math.random() * 1.3;
    }
    if (g.t < 1) { g.t = Math.min(1, g.t + dt / g.seconds); const e = smoother(g.t); g.x = g.fromX + (g.toX - g.fromX) * e; g.y = g.fromY + (g.toY - g.fromY) * e; }
    eyeTurn.setFromAxisAngle(UP, g.x).multiply(turn.setFromAxisAngle(ACROSS, -g.y));
    // swallowing: every twenty to forty seconds. Blinking: every two to six, shut in a third of the time it takes to open
    const s = life.swallow;
    if (life.loopSwallow) { const [from, to] = life.loopSwallow; s.t = from + ((Math.max(from, Math.min(to, s.t)) - from + dt * 0.22) % (to - from)); signals.swallow = contraction(s.t, 0, 0.3, 1); }   // a lesson: one part of a swallow, over and over
    else if (s.t < 0) { if ((s.wait -= dt) <= 0) s.t = 0; signals.swallow = 0; }
    else { s.t += dt / SWALLOW_SECONDS; signals.swallow = contraction(s.t, 0, 0.3, 1); if (s.t >= 1) { s.t = -1; s.wait = 20 + Math.random() * 20; } }
    const b = life.blink;
    if (b.t < 0) { if ((b.wait -= dt) <= 0) b.t = 0; signals.blink = 0; }
    else { b.t += dt / BLINK_SECONDS; signals.blink = contraction(b.t, 0, 0.3, 1); if (b.t >= 1) { b.t = -1; b.wait = 2 + Math.random() * 4; } }
  }

  /** Turn a mesh about a point in the body, on top of whatever it has been turned by already. */
  function swing(mesh, pivot, q) {
    mesh.quaternion.premultiply(q);
    arm.set(mesh.position.x - pivot[0], mesh.position.y - pivot[1], mesh.position.z - pivot[2]).applyQuaternion(q);
    mesh.position.set(pivot[0] + arm.x, pivot[1] + arm.y, pivot[2] + arm.z);
  }

  /**
   * Apply to the pieces. `weight` is 1 with the body assembled and falls to 0 as it starts to separate, so the
   * motion eases out instead of stopping dead. Positions must already hold this frame's assembled/exploded pose.
   * `body` is the group holding every piece; `still` drops the motions that move the body as a whole.
   */
  function apply(parts, weight, body = null, still = false) {
    if (!life.anchors) return;
    // The lean: the whole body turns about the ankles as one rigid thing, so every joint stays closed. It and the
    // head's turn are dropped (smoothly) for a cross-section, whose plane is fixed in space, and inside a study.
    life.swayGain = weight <= 0 ? 0 : life.swayGain + ((still ? 0 : weight) - life.swayGain) * 0.06;
    if (body) {
      if (life.swayGain > 1e-4) {
        lean.setFromAxisAngle(ACROSS, life.swayX * life.swayGain).multiply(tilt.setFromAxisAngle(FORWARD, life.swayZ * life.swayGain));
        const p = life.anchors.ankle;
        body.quaternion.copy(lean); body.position.set(p[0], p[1], p[2]).applyQuaternion(lean).multiplyScalar(-1); body.position.x += p[0]; body.position.y += p[1]; body.position.z += p[2];
      } else { body.quaternion.identity(); body.position.set(0, 0, 0); }
      body.updateMatrixWorld(true); lifeUniforms.bodyInverse.value.copy(body.matrixWorld).invert();
    }
    const hx = life.head[0] * life.swayGain, hy = life.head[1] * life.swayGain, hz = life.head[2] * life.swayGain, headAngle = Math.hypot(hx, hy, hz);
    lifeUniforms.headTurn.value.set(hx, hy, hz); lifeUniforms.blink.value = signals.blink * weight;
    const bend = [life.elbow[0] * life.swayGain, life.elbow[1] * life.swayGain];   // bending brings the forearm forward: a turn about the body's left-right axis
    lifeUniforms.elbowTurn.value[0].set(-bend[0], 0, 0); lifeUniforms.elbowTurn.value[1].set(-bend[1], 0, 0);
    // the hand turns about the wrist, which the forearm has already carried
    const flex = [life.wrist[0] * life.swayGain, life.wrist[1] * life.swayGain], jawAngle = life.jaw * weight;
    for (let i = 0; i < 2; i++) {
      lifeUniforms.wristTurn.value[i].set(-flex[i], 0, 0);
      const e = life.anchors.elbows[i], w = life.anchors.wrists[i]; turn.setFromAxisAngle(ACROSS, -bend[i]); wristNow[i].set(w[0] - e[0], w[1] - e[1], w[2] - e[2]).applyQuaternion(turn);
      wristPivot[i][0] = e[0] + wristNow[i].x; wristPivot[i][1] = e[1] + wristNow[i].y; wristPivot[i][2] = e[2] + wristNow[i].z;
    }
    lifeUniforms.jawTurn.value = jawAngle;
    eyeNow.identity().slerp(eyeTurn, weight);
    if (parts.length !== life.planned) { for (const p of parts) if (p.life === undefined) { p.life = plan(p); if (p.life) life.animated.push(p); } life.planned = parts.length; }
    const was = life.weight;
    life.weight = weight;
    lifeUniforms.gain.value = weight; lifeUniforms.breath.value = signals.breath * weight;
    if (weight <= 0 && was <= 0) return;
    const neck = life.anchors.neckPivot;
    for (const p of life.animated) {
      const mesh = p.mesh, s0 = p.baseScale, plan = p.life;
      let ox = 0, oy = 0, oz = 0, kx = 1, ky = 1, kz = 1;
      if (weight > 0) for (const ch of plan.channels) {
        const v = (ch.signal === 'pulse' ? pulseCurve(life.beat - ch.delay) * (1 + PULSE_EFFORT * life.effort) * (ch.weak ? 1 - 0.75 * life.shape.artery : 1) : signals[ch.signal]) * weight;
        if (v === 0) continue;
        ox += ch.offset[0] * v; oy += ch.offset[1] * v; oz += ch.offset[2] * v;
        kx += ch.stretch[0] * v; ky += ch.stretch[1] * v; kz += ch.stretch[2] * v;
      }
      // scale about the piece's centre: the mesh origin sits somewhere else, so it shifts by (1 - k) x (centre - origin)
      const c = p.piece.center, b = p.base;
      if (plan.shape) { const g = life.shape[plan.shape.kind] * weight; if (g > 1e-4) { const sh = plan.shape, sx = 1 + (sh.k[0] - 1) * g, sy = 1 + (sh.k[1] - 1) * g, sz = 1 + (sh.k[2] - 1) * g;   // about the condition's own centre, not the piece's
        ox += (c[0] - sh.pivot[0]) * (sx - 1); oy += (c[1] - sh.pivot[1]) * (sy - 1); oz += (c[2] - sh.pivot[2]) * (sz - 1); kx *= sx; ky *= sy; kz *= sz; } }
      mesh.position.x += ox + (1 - kx) * (c[0] - b.x); mesh.position.y += oy + (1 - ky) * (c[1] - b.y); mesh.position.z += oz + (1 - kz) * (c[2] - b.z);
      mesh.scale.set(s0.x * kx, s0.y * ky, s0.z * kz);
      if (!p.baseQuaternion) continue;
      mesh.quaternion.copy(p.baseQuaternion);
      if (weight <= 0) continue;
      if (plan.eye) swing(mesh, plan.eye.pivot, eyeNow);
      if (plan.valve) {
        const v = plan.valve, angle = v.swing * signals[v.signal] * weight;
        if (angle > 1e-5) { axis.fromArray(v.axis); turn.setFromAxisAngle(axis, angle); swing(mesh, [v.pivot[0] + ox, v.pivot[1] + oy, v.pivot[2] + oz], turn); }   // the ring travels with the heart
      }
      if (plan.rib) {
        axis.fromArray(plan.rib.turn);
        const angle = axis.length() * signals.breath * weight;
        if (angle > 0) { turn.setFromAxisAngle(axis.normalize(), angle); swing(mesh, plan.rib.pivot, turn); }
      }
      if (plan.elbow && bend[plan.elbow.arm] > 1e-6) { turn.setFromAxisAngle(ACROSS, -bend[plan.elbow.arm] * plan.elbow.share); swing(mesh, life.anchors.elbows[plan.elbow.arm], turn); }
      if (plan.wrist && Math.abs(flex[plan.wrist.arm]) > 1e-6) { turn.setFromAxisAngle(ACROSS, -flex[plan.wrist.arm] * plan.wrist.share); swing(mesh, wristPivot[plan.wrist.arm], turn); }
      if (plan.jaw && jawAngle > 1e-6) { turn.setFromAxisAngle(ACROSS, jawAngle); swing(mesh, life.anchors.jaw.pivot, turn); }
      if (plan.head && headAngle > 1e-6) { axis.set(hx, hy, hz).normalize(); turn.setFromAxisAngle(axis, headAngle * plan.head); swing(mesh, neck, turn); }
    }
  }

  return {
    setup, advance, apply,
    get on() { return life.on; }, set on(v) { life.on = !!v; },
    /** Heart rate (beats a minute), breathing rate (breaths a minute) and depth of breathing (1 = quiet). */
    setRates({ bpm, breaths, depth } = {}) {
      if (Number.isFinite(bpm)) life.rate.bpm = Math.min(200, Math.max(30, bpm));
      if (Number.isFinite(breaths)) life.rate.breaths = Math.min(60, Math.max(4, breaths));
      if (Number.isFinite(depth)) life.rate.depth = Math.min(2, Math.max(0.3, depth));
    },
    /** Playback speed of everything: 1 = real time, 0.25 = quarter speed, 0 = paused. */
    setSpeed(k) { life.speed = Math.min(2, Math.max(0, k)); },
    /** Hold the heart at a point in its beat (0..1), with everything else still; null lets it run again. */
    scrub(phase) { life.scrub = phase === null || phase === undefined ? null : Math.min(0.9999, Math.max(0, phase)); },
    /** One of CONDITIONS: sets the pace and whatever else that condition changes. */
    setCondition(id) { if (!CONDITIONS[id]) return; life.condition = id; life.interval = 1; Object.assign(life.rate, CONDITIONS[id].rates); },
    /** Run one stretch of the heartbeat, or of the breath, over and over ([from, to] as fractions; null to stop). */
    loopBeat(range) { life.loopBeat = range && range[1] > range[0] ? range : null; },
    loopBreath(range) { life.loopBreath = range && range[1] > range[0] ? range : null; },
    loopSwallow(range) { life.loopSwallow = range && range[1] > range[0] ? range : null; if (!life.loopSwallow) { life.swallow.t = -1; life.swallow.wait = 12 + Math.random() * 12; } },
    /** Start a swallow or a blink now (they otherwise happen on their own). */
    swallow() { if (life.swallow.t < 0) life.swallow.t = 0; },
    blink() { if (life.blink.t < 0) life.blink.t = 0; },
    signals,
    getState: () => ({ on: life.on, weight: +life.weight.toFixed(3), animated: life.animated.length, breath: +signals.breath.toFixed(3), ventricle: +signals.ventricle.toFixed(3),
      beat: +life.beat.toFixed(4), phase: beatPhase(life.beat).name, breathPhase: +life.breath.toFixed(4), bpm: life.rate.bpm, breaths: life.rate.breaths, depth: life.rate.depth, speed: life.speed, scrub: life.scrub, condition: life.condition, looping: !!(life.loopBeat || life.loopBreath || life.loopSwallow), wrist: life.wrist.map(v => +(v * life.swayGain * 180 / Math.PI).toFixed(2)), jaw: +(life.jaw * 180 / Math.PI).toFixed(2), effort: +life.effort.toFixed(3), shape: Object.fromEntries(Object.entries(life.shape).map(([k, v]) => [k, +v.toFixed(3)])), elbow: life.elbow.map(v => +(v * life.swayGain * 180 / Math.PI).toFixed(2)),
      outflow: +signals.outflow.toFixed(3), inflow: +signals.inflow.toFixed(3), blink: +signals.blink.toFixed(3), head: life.head.map(v => +(v * life.swayGain * 180 / Math.PI).toFixed(3)),
      sway: [life.swayX * life.swayGain, life.swayZ * life.swayGain].map(v => +(v * 180 / Math.PI).toFixed(4)), gaze: [+life.gaze.x.toFixed(4), +life.gaze.y.toFixed(4)], swallow: +signals.swallow.toFixed(3) })
  };
}
