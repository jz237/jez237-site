/**
 * Life: the assembled body moves.
 *
 *   breathing   about 14 breaths a minute. Each rib swings up and out about its joint with the spine, carrying the
 *               sternum forward and up; the diaphragm descends, the lungs lengthen and widen to fill the space, the
 *               abdominal organs are pushed down and the belly wall moves out. Inhalation is quicker than
 *               exhalation and there is a short rest before the next breath.
 *   heartbeat   about 70 beats a minute, a little faster while breathing in (as in a healthy heart). The atria
 *               contract first and top up the ventricles; the ventricles then contract towards the apex, pulling
 *               the atria and the roots of the great vessels down with them while the atria refill; the aorta and
 *               pulmonary trunk swell as the blood is ejected.
 *   pulse       each artery swells slightly as the pressure wave reaches it, later the further it is from the heart.
 *   gut         a slow travelling ripple along the stomach, intestines and ureters (a vertex-shader wave, see materials.js).
 *   sway        nobody stands perfectly still: the whole body leans a few millimetres about the ankles, slowly and
 *               irregularly, more front-to-back than side-to-side, and the calf and shin muscles take turns to hold it.
 *   eyes        both eyes jump together to a new point of gaze every second or two, with small corrections between.
 *   swallowing  now and then the larynx and hyoid rise about two centimetres and drop back, stretching the trachea.
 *   brain       swells very slightly with each arterial pulse, as it does inside the skull.
 *   veins       the large veins narrow a little on the in-breath in the chest and neck and fill in the abdomen.
 *
 * How it is done: every motion is a smooth displacement field over body space, F(point, time). A piece is moved
 * by the field at its centre, so neighbours always move together and nothing tears or collides. What else happens
 * to the piece depends on what it is made of:
 *   elastic   lungs, pleura, bronchi, diaphragm, cartilage: also stretched by the field's change across the piece;
 *   wall      skin, muscle, fascia and the vessels, nerves and ligaments in them: not moved here at all. They
 *             lie on each other with no gap, so each vertex follows the chest-wall field in the shader
 *             (materials.js, breathe) and no layer can slip through the next;
 *   solid     heart, liver and the other organs, sternum, vertebrae: moved, never resized by breathing;
 *   ribs      rigid: rotated about the joint with the spine by exactly the angle that keeps the front end on the
 *             chest-wall field, which is what joins it to its cartilage and the sternum.
 * Per piece that reduces to a few fixed vectors multiplied by a signal (breath, ventricles, atria, pulse), so a
 * frame costs a handful of multiplications per piece.
 *
 * Amplitudes are those of quiet breathing and a resting heart, slightly enlarged so they read at arm's length.
 * This is an illustration of the motion, not a measurement of it.
 */
import * as THREE from 'three';
import { lifeUniforms, ridesWall } from './materials.js?v=984d071ad9';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const smoother = t => { t = Math.min(1, Math.max(0, t)); return t * t * t * (t * (t * 6 - 15) + 10); };

// ---- timing
const BREATH_SECONDS = 4.3, BEAT_SECONDS = 0.86;
const INHALE = 0.38, EXHALE_END = 0.92;   // fractions of a breath: in, out, rest

/** 0 = end of exhalation, 1 = full (quiet) inhalation. */
function breathCurve(phase) {
  if (phase < INHALE) return smoother(phase / INHALE);
  if (phase < EXHALE_END) return 1 - smoother(Math.pow((phase - INHALE) / (EXHALE_END - INHALE), 0.8));   // passive recoil: quick at first, then easing
  return 0;
}
/** A contraction: quick rise from `start` to `peak`, slower release until `end`. */
const contraction = (phase, start, peak, end) => phase < start || phase > end ? 0 : phase < peak ? smoother((phase - start) / (peak - start)) : 1 - smoother((phase - peak) / (end - peak));
const atrialCurve = phase => contraction(phase, 0.0, 0.07, 0.17);
const ventricularCurve = phase => contraction(phase, 0.14, 0.31, 0.56);
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
const INFLATES = /lung|pleura|bronch|^Diaphragm$/i;
const TAU = Math.PI * 2;
const SWAY_FRONT = 0.0045, SWAY_SIDE = 0.0022;   // radians about the ankles: about 7 mm and 3.5 mm at the head
const CALF_TONE = 0.012;                          // the muscle holding the lean thickens by this fraction
const GAZE_SIDE = 0.13, GAZE_UP = 0.055;          // radians: how far the eyes wander from straight ahead
const SWALLOW_RISE = [0, 0.018, 0.004], SWALLOW_SECONDS = 1.1;
const BRAIN_PULSE = 0.003, VEIN_BREATH = 0.012;

export function createLife() {
  const life = { on: true, breath: 0.15, beat: 0, time: Math.random() * 60, weight: 0, anchors: null, animated: [], planned: 0, swayGain: 0, swayX: 0, swayZ: 0,
    gaze: { x: 0, y: 0, fromX: 0, fromY: 0, toX: 0, toY: 0, t: 1, seconds: 0.05, wait: 1.2 }, swallow: { t: -1, wait: 14 + Math.random() * 14 } };
  const signals = { breath: 0, ventricle: 0, atrium: 0, sway: 0, swallow: 0 };
  const turn = new THREE.Quaternion(), arm = new THREE.Vector3(), axis = new THREE.Vector3();
  const eyeTurn = new THREE.Quaternion(), eyeNow = new THREE.Quaternion(), lean = new THREE.Quaternion(), tilt = new THREE.Quaternion(), UP = new THREE.Vector3(0, 1, 0), ACROSS = new THREE.Vector3(1, 0, 0), FORWARD = new THREE.Vector3(0, 0, 1);

  /** Landmarks of the trunk, read from the model so the fields fit this body. */
  function setup(manifest) {
    const piece = name => manifest.pieces.find(p => p.name === name);
    const mark = name => manifest.landmarks.find(l => l.name === name)?.position;
    const t6 = piece('Vertebra T6'), sternum = piece('Body of sternum'), rib1 = piece('First rib'), rib12 = piece('Twelfth rib');
    const lung = piece('Inferior lobe of left lung'), hip = piece('Hip bone'), lv = piece('Left ventricle'), la = piece('Left atrium'), arch = piece('Aortic arch');
    const apex = mark('Apex of heart') || [0.099, 1.231, 0.072], base = mark('Base of heart') || [-0.066, 1.311, -0.018];
    const heart = lv ? lv.center : [0.04, 1.27, 0.01];
    life.anchors = {
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
      larynx: new Set(manifest.assemblies?.larynx || [])
    };
    const a = life.anchors;   // the skin's shader evaluates the same chest-wall field: give it the same numbers
    lifeUniforms.trunk.value.set(a.ribsBottom, a.ribsTop, a.pelvis, a.dome); lifeUniforms.spine.value.set(a.spineZ, a.sternumZ); lifeUniforms.chest.value.set(CHEST_SIDE, CHEST_LIFT, CHEST_FRONT, BELLY_OUT);
  }

  // ---- breathing fields. Each returns the displacement of a body-space point at full inhalation.
  function trunkWeight(p) {
    const a = life.anchors, side = 1 - smooth(0.19, 0.27, Math.abs(p[0]));   // fades out before the arms
    return { side, chest: smooth(a.ribsBottom - 0.06, a.ribsBottom + 0.07, p[1]) * (1 - smooth(a.ribsTop - 0.01, a.ribsTop + 0.07, p[1])) * side,
      belly: smooth(a.pelvis - 0.02, a.pelvis + 0.09, p[1]) * (1 - smooth(a.dome - 0.05, a.dome + 0.03, p[1])) * side };
  }
  const front = z => smooth(life.anchors.spineZ, life.anchors.sternumZ, z);   // 0 at the spine, 1 at the sternum
  /** Chest wall and everything riding on it: sternum, cartilages, muscles, skin, the vessels and nerves between the ribs. */
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
    const turn = cross(r, d).map(v => v / len2);
    // That fixes the front end. Turning about the head-to-tip line leaves both ends where they are and swings the
    // side of the rib up and out, so use it to keep the rib's outermost point on the wall as well (the bucket handle).
    const len = Math.sqrt(len2), along = r.map(v => v / len), side = [c[0] + sx * s[0] / 2, c[1], c[2]], rs = side.map((v, i) => v - head[i]);
    const reach = cross(along, rs), reach2 = reach[0] * reach[0] + reach[1] * reach[1] + reach[2] * reach[2];
    if (reach2 > 1e-6) {
      const got = cross(turn, rs), wanted = wallField(side), roll = reach.reduce((sum, v, i) => sum + v * (wanted[i] - got[i]), 0) / reach2;
      for (let i = 0; i < 3; i++) turn[i] += along[i] * roll;
    }
    return { pivot: head, turn };
  }

  const isArtery = piece => piece.file === 'vessels' && (/arter|aorta|trunk|circle/i.test(piece.name) || /Arterial system/.test(piece.path || ''));
  const heartRole = name => /atrium/i.test(name) ? 'atrium'
    : /ventricle|papillary|atrioventricular|coronary (artery|sinus)|cardiac vein|interventricular|circumflex|inferolateral/i.test(name) ? 'ventricle' : 'vessel';

  /**
   * Work out a piece's motion once: { channels: [{ signal, offset, stretch, delay }], rib }. A channel moves the
   * piece by offset x signal and scales it by 1 + stretch x signal.
   */
  function plan(part) {
    const a = life.anchors, piece = part.piece, c = piece.center, channels = [], NONE = [0, 0, 0];
    const add = (signal, offset, stretch, delay = 0) => { if (offset.some(v => Math.abs(v) > 2e-5) || stretch.some(v => Math.abs(v) > 2e-4)) channels.push({ signal, offset, stretch, delay }); };
    let rib = null;
    // breathing
    // (the wall layers are not moved here: they follow the same chest-wall field per vertex, in their shaders)
    if (!ridesWall(piece) && piece.region !== 'upper limb' && piece.region !== 'lower limb' && piece.region !== 'head') {
      if (piece.file === 'skeletal' && RIB.test(piece.name)) rib = ribSwing(piece);
      else {
        const organ = piece.file !== 'skeletal';   // viscera, heart, diaphragm, spleen, thymus
        const s = sample(organ ? organField : wallField, piece);
        const elastic = organ ? INFLATES.test(piece.name) : /cartilage/i.test(piece.name);
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
    // arterial pulse: swell across the vessel, not along it
    if (isArtery(piece)) {
      const longest = piece.size.indexOf(Math.max(...piece.size));
      const delay = Math.hypot(c[0] - a.heart[0], c[1] - a.heart[1], c[2] - a.heart[2]) / PULSE_SPEED / BEAT_SECONDS;
      add('pulse', NONE, [0, 1, 2].map(i => i === longest ? 0 : ARTERY), delay);
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
    // the brain swells a little with each pulse, about its centre
    let eye = null;
    if (piece.file === 'brain' && piece.region === 'head') {
      const centre = a.eyes.find(e => Math.hypot(c[0] - e[0], c[1] - e[1], c[2] - e[2]) < 0.014);
      if (centre && !/lacrimal/i.test(piece.name)) eye = { pivot: centre };   // an eyeball: it turns, it does not pulse
      else if (!centre && !/ear|cochlea|vestibul|lacrimal|ossicle|tympan/i.test(piece.name)) add('pulse', c.map((v, i) => (v - a.brain[i]) * BRAIN_PULSE), [BRAIN_PULSE, BRAIN_PULSE, BRAIN_PULSE], 0.12);
    }
    if (!channels.length && !rib && !eye) return null;
    if (rib || eye) part.baseQuaternion = part.mesh.quaternion.clone();
    return { channels, rib, eye };
  }

  /** Advance the clocks. The heart runs a little faster during inhalation. */
  function advance(dt) {
    life.time += dt;
    life.breath = (life.breath + dt / BREATH_SECONDS) % 1;
    signals.breath = breathCurve(life.breath);
    life.beat = (life.beat + dt / (BEAT_SECONDS * (1.05 - 0.1 * signals.breath))) % 1;
    signals.atrium = atrialCurve(life.beat);
    signals.ventricle = ventricularCurve(life.beat);
    lifeUniforms.time.value = life.time;
    // postural sway: a few slow, unrelated rhythms add up to a wander that never quite repeats
    const t = life.time, front = 0.5 * Math.sin(TAU * t / 7.3) + 0.3 * Math.sin(TAU * t / 11.9 + 1.3) + 0.2 * Math.sin(TAU * t / 4.1 + 2.1);
    const sideways = 0.5 * Math.sin(TAU * t / 9.7 + 0.6) + 0.3 * Math.sin(TAU * t / 5.3 + 2.9) + 0.2 * Math.sin(TAU * t / 13.7);
    signals.sway = front; life.swayX = front * SWAY_FRONT; life.swayZ = -sideways * SWAY_SIDE;
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
    // swallowing: every twenty to forty seconds
    const s = life.swallow;
    if (s.t < 0) { if ((s.wait -= dt) <= 0) s.t = 0; signals.swallow = 0; }
    else { s.t += dt / SWALLOW_SECONDS; signals.swallow = contraction(s.t, 0, 0.3, 1); if (s.t >= 1) { s.t = -1; s.wait = 20 + Math.random() * 20; } }
  }

  /**
   * Apply to the pieces. `weight` is 1 with the body assembled and falls to 0 as it starts to separate, so the
   * motion eases out instead of stopping dead. Positions must already hold this frame's assembled/exploded pose.
   */
  function apply(parts, weight, body = null, still = false) {
    if (!life.anchors) return;
    // The lean: the whole body turns about the ankles as one rigid thing, so every joint stays closed. It is
    // dropped (smoothly) for a cross-section, whose plane is fixed in space, and inside a nested study.
    life.swayGain = weight <= 0 ? 0 : life.swayGain + ((still ? 0 : weight) - life.swayGain) * 0.06;
    if (body) {
      if (life.swayGain > 1e-4) {
        lean.setFromAxisAngle(ACROSS, life.swayX * life.swayGain).multiply(tilt.setFromAxisAngle(FORWARD, life.swayZ * life.swayGain));
        const p = life.anchors.ankle;
        body.quaternion.copy(lean); body.position.set(p[0], p[1], p[2]).applyQuaternion(lean).multiplyScalar(-1); body.position.x += p[0]; body.position.y += p[1]; body.position.z += p[2];
      } else { body.quaternion.identity(); body.position.set(0, 0, 0); }
    }
    eyeNow.identity().slerp(eyeTurn, weight);
    if (parts.length !== life.planned) { for (const p of parts) if (p.life === undefined) { p.life = plan(p); if (p.life) life.animated.push(p); } life.planned = parts.length; }
    const was = life.weight;
    life.weight = weight;
    lifeUniforms.gain.value = weight; lifeUniforms.breath.value = signals.breath * weight;
    if (weight <= 0 && was <= 0) return;
    for (const p of life.animated) {
      const mesh = p.mesh, s0 = p.baseScale;
      let ox = 0, oy = 0, oz = 0, kx = 1, ky = 1, kz = 1;
      if (weight > 0) for (const ch of p.life.channels) {
        const v = (ch.signal === 'pulse' ? pulseCurve(life.beat - ch.delay) : signals[ch.signal]) * weight;
        if (v === 0) continue;
        ox += ch.offset[0] * v; oy += ch.offset[1] * v; oz += ch.offset[2] * v;
        kx += ch.stretch[0] * v; ky += ch.stretch[1] * v; kz += ch.stretch[2] * v;
      }
      // scale about the piece's centre: the mesh origin sits somewhere else, so it shifts by (1 - k) x (centre - origin)
      const c = p.piece.center, b = p.base;
      mesh.position.x += ox + (1 - kx) * (c[0] - b.x); mesh.position.y += oy + (1 - ky) * (c[1] - b.y); mesh.position.z += oz + (1 - kz) * (c[2] - b.z);
      mesh.scale.set(s0.x * kx, s0.y * ky, s0.z * kz);
      const eye = p.life.eye;
      if (eye) {
        mesh.quaternion.copy(eyeNow).multiply(p.baseQuaternion);
        arm.set(mesh.position.x - eye.pivot[0], mesh.position.y - eye.pivot[1], mesh.position.z - eye.pivot[2]).applyQuaternion(eyeNow);
        mesh.position.set(eye.pivot[0] + arm.x, eye.pivot[1] + arm.y, eye.pivot[2] + arm.z);
      }
      const rib = p.life.rib;
      if (rib) {
        const v = signals.breath * weight;
        axis.set(rib.turn[0], rib.turn[1], rib.turn[2]);
        const angle = axis.length() * v;
        if (angle > 0) {
          turn.setFromAxisAngle(axis.normalize(), angle);
          mesh.quaternion.copy(turn).multiply(p.baseQuaternion);
          arm.set(mesh.position.x - rib.pivot[0], mesh.position.y - rib.pivot[1], mesh.position.z - rib.pivot[2]).applyQuaternion(turn);
          mesh.position.set(rib.pivot[0] + arm.x, rib.pivot[1] + arm.y, rib.pivot[2] + arm.z);
        } else mesh.quaternion.copy(p.baseQuaternion);
      }
    }
  }

  return {
    setup, advance, apply,
    get on() { return life.on; }, set on(v) { life.on = !!v; },
    /** Start a swallow now (the studio's tests use it; it otherwise happens on its own). */
    swallow() { if (life.swallow.t < 0) life.swallow.t = 0; },
    getState: () => ({ on: life.on, weight: +life.weight.toFixed(3), animated: life.animated.length, breath: +signals.breath.toFixed(3), ventricle: +signals.ventricle.toFixed(3),
      sway: [life.swayX * life.swayGain, life.swayZ * life.swayGain].map(v => +(v * 180 / Math.PI).toFixed(4)), gaze: [+life.gaze.x.toFixed(4), +life.gaze.y.toFixed(4)], swallow: +signals.swallow.toFixed(3) })
  };
}
