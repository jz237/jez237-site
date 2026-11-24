/**
 * Blood flow: points of light travelling round the whole circulation, in the right direction and with the right
 * timing. Blue is blood on its way to the lungs, red is blood that has been through them.
 *
 *   veins of the legs, arms and head -> venae cavae -> right atrium -> (tricuspid) -> right ventricle
 *     -> (pulmonary valve) -> pulmonary arteries                                   [blue]
 *   pulmonary veins -> left atrium -> (mitral) -> left ventricle -> (aortic valve) -> aorta
 *     -> arteries of the legs, arms and head                                       [red]
 *
 * Each route is a smooth curve through the centres of the pieces it passes. A particle's speed depends on the
 * stretch it is in: veins run steadily, the step from atrium to ventricle only moves while the inflow valves are
 * open, the step out of the ventricle only while the outflow valves are open, and the arteries surge with the pulse.
 * Every stretch also belongs to a zone (venous, right heart, lungs, left heart, arterial) so a lesson can light one
 * part of the round trip at a time.
 * It is a diagram laid over the model, drawn through everything, so it is shown in the X-ray finish only.
 */
import * as THREE from 'three';

const BLUE = new THREE.Color('#2f8cff'), RED = new THREE.Color('#ff3a2e');
const SPEED = { vein: 0.07, inflow: 0.3, outflow: 0.55, artery: 0.07, surge: 0.4 };   // metres a second (slowed from life so the eye can follow)
export const ZONES = ['venous', 'right', 'lungs', 'left', 'arterial'];

export function createFlow({ manifest, parent }) {
  const piece = (name, side) => manifest.pieces.find(p => p.name === name && (!side || p.side === side));
  const at = (name, side, shift = [0, 0, 0]) => { const p = piece(name, side); return p ? new THREE.Vector3(p.center[0] + shift[0] * p.size[0], p.center[1] + shift[1] * p.size[1], p.center[2] + shift[2] * p.size[2]) : null; };
  const word = side => side === 'L' ? 'Left' : 'Right';
  const routes = [];
  /** stops: [point, kind of the stretch that ARRIVES at this point, zone, piece name]. Missing pieces drop the whole route. */
  function route(color, stops) {
    if (stops.some(s => !s[0])) return;
    const points = stops.map(s => s[0]), curve = new THREE.CatmullRomCurve3(points, false, 'centripetal'), total = curve.getLength();
    // where each stop falls along the curve, so a particle knows which stretch it is in
    const marks = [0]; let run = 0;
    for (let i = 1; i < points.length; i++) { run += points[i].distanceTo(points[i - 1]); marks.push(run); }
    const narrow = stops.findIndex(s => s[3] === 'Femoral artery/L');
    routes.push({ color, curve, total, marks: marks.map(m => m / run * total), kinds: stops.map(s => s[1]), zones: stops.map(s => s[2]), systemic: color === RED, narrow });
  }
  const chain = (kind, zone, list) => list.map(([name, side, shift]) => [at(name, side, shift), kind, zone, `${name}/${side || ''}`]);
  const ra = at('Right atrium'), rv = at('Right ventricle'), la = at('Left atrium'), lv = at('Left ventricle');
  const trunk = at('Pulmonary trunk'), fork = at('Bifurcation of pulmonary trunk');

  // ---- blue: back from the body, through the right heart, out to the lungs
  const cavaLow = [['Inferior vena cava (abdominal part)'], ['Inferior vena cava (thoracic part)']], cavaHigh = side => [[`${word(side)} brachiocephalic vein`, side], ['Superior vena cava']];
  const veins = {
    leg: side => chain('vein', 'venous', [['Popliteal vein', side, [0, -0.4, 0]], ['Popliteal vein', side], ['Femoral vein', side], ['External iliac vein', side], ['Common iliac vein', side], ...cavaLow]),
    arm: side => chain('vein', 'venous', [['Brachial veins', side, [side === 'L' ? 0.3 : -0.3, -0.45, 0]], ['Brachial veins', side], ['Axillary vein', side], [`${word(side)} subclavian vein`, side], ...cavaHigh(side)]),
    head: side => chain('vein', 'venous', [['Internal jugular vein', side, [0, 0.45, 0]], ['Internal jugular vein', side], ...cavaHigh(side)])
  };
  const toLungs = lung => [[ra, 'vein', 'right'], [rv, 'inflow', 'right'], [trunk, 'outflow', 'right'], [fork, 'artery', 'lungs'], [at(lung), 'artery', 'lungs'], [at(lung, null, lung.startsWith('Left') ? [0.45, -0.3, 0] : [-0.45, 0, 0]), 'artery', 'lungs']];
  [['leg', 'L', 'Left'], ['leg', 'R', 'Right'], ['arm', 'L', 'Right'], ['arm', 'R', 'Left'], ['head', 'L', 'Left'], ['head', 'R', 'Right']]
    .forEach(([from, side, lung]) => route(BLUE, [...veins[from](side), ...toLungs(`${lung} pulmonary artery`)]));

  // ---- red: back from the lungs, through the left heart, out to the body
  const archUp = [['Ascending aorta'], ['Aortic arch', null, [0, 0.3, 0.2]]], archOver = [['Aortic arch', null, [0, 0.1, -0.4]], ['Thoracic aorta'], ['Abdominal aorta', null, [0, 0.35, 0]], ['Abdominal aorta', null, [0, -0.4, 0]]];
  const arteries = {
    leg: side => [...archOver, ['Common iliac artery', side], ['External iliac artery', side], ['Femoral artery', side], ['Popliteal artery', side], ['Posterior tibial artery', side], ['Posterior tibial artery', side, [0, -0.42, 0]]],
    arm: side => [...(side === 'R' ? [['Brachiocephalic trunk']] : []), [`${word(side)} subclavian artery`, side], ['Axillary artery', side], ['Brachial artery', side], ['Radial artery', side], ['Radial artery', side, [side === 'L' ? 0.25 : -0.25, -0.45, 0]]],
    head: side => [...(side === 'R' ? [['Brachiocephalic trunk']] : []), [`${word(side)} common carotid artery`, side], ['Internal carotid artery', side], ['Internal carotid artery', side, [0, 0.4, 0]]]
  };
  const fromLungs = (vein, side) => [[at(vein, null, [side === 'L' ? 0.5 : -0.5, 0, 0]), 'vein', 'lungs'], [at(vein), 'vein', 'lungs'], [la, 'vein', 'left'], [lv, 'inflow', 'left']];
  const out = list => { const stops = chain('artery', 'arterial', [...archUp, ...list]); stops[0][1] = 'outflow'; stops[0][2] = 'left'; return stops; };
  [['Left superior pulmonary vein', 'L', 'leg', 'L'], ['Right superior pulmonary vein', 'R', 'leg', 'R'], ['Left inferior pulmonary vein', 'L', 'arm', 'L'], ['Right inferior pulmonary vein', 'R', 'arm', 'R'],
    ['Left superior pulmonary vein', 'L', 'head', 'L'], ['Right inferior pulmonary vein', 'R', 'head', 'R'], ['Left inferior pulmonary vein', 'L', 'leg', 'R'], ['Right superior pulmonary vein', 'R', 'leg', 'L']]
    .forEach(([vein, lungSide, to, side]) => route(RED, [...fromLungs(vein, lungSide), ...out(arteries[to](side))]));

  // particles: about one every two centimetres, so a long route is as dense as a short one
  const particles = [], WIDTH = 0.006;
  routes.forEach(r => { const n = Math.min(96, Math.max(20, Math.round(r.total / 0.021))); for (let i = 0; i < n; i++) particles.push({ r, s: Math.random() * r.total, jitter: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(3.2 * WIDTH) }); });
  const count = particles.length, positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.0075, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 1, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  points.frustumCulled = false; points.renderOrder = 50; points.visible = false; points.raycast = () => {};
  parent.add(points);
  const p = new THREE.Vector3();
  let focus = null;

  /**
   * Move the particles. `signals` are the heart's (inflow and outflow valves 0..1, atrium and ventricle 0..1, and
   * `narrow`, 0..1, for the narrowed-artery condition); `rate` speeds everything up with the heart (1 = at rest);
   * `shown` hides the whole thing without stopping the bookkeeping.
   */
  function update(dt, signals, shown, rate = 1) {
    points.visible = shown && particles.length > 0;
    if (!points.visible) return;
    const surge = Math.max(0, signals.ventricle), narrowed = signals.narrow || 0;
    const speed = { vein: SPEED.vein * (0.6 + 0.8 * signals.inflow) * rate, inflow: SPEED.inflow * signals.inflow * (0.5 + signals.atrium) * rate, outflow: SPEED.outflow * signals.outflow * rate, artery: (SPEED.artery + SPEED.surge * surge * signals.outflow) * rate };
    for (let i = 0; i < particles.length; i++) {
      const q = particles[i], r = q.r;
      let k = 1; while (k < r.marks.length - 1 && q.s > r.marks[k]) k++;
      let v = speed[r.kinds[k]];
      if (r.kinds[k] === 'outflow' && r.systemic && signals.leak > 0) v -= SPEED.inflow * 0.5 * signals.leak;   // a leaking aortic valve: blood falls back towards the ventricle
      const past = narrowed > 0 && r.narrow > 0 && k > r.narrow;   // beyond a narrowed artery less gets through, and slowly
      if (past) v *= 1 - 0.72 * narrowed;
      q.s += v * dt;
      if (q.s < r.marks[k - 1]) q.s = r.marks[k - 1];
      if (q.s >= r.total) q.s -= r.total;
      r.curve.getPointAt(q.s / r.total, p).add(q.jitter);
      positions[i * 3] = p.x; positions[i * 3 + 1] = p.y; positions[i * 3 + 2] = p.z;
      // a particle waiting at a shut valve dims, so the stop-and-go of the heart reads at a glance
      let glow = r.kinds[k] === 'inflow' ? 0.35 + 0.65 * signals.inflow : r.kinds[k] === 'outflow' ? 0.35 + 0.65 * signals.outflow : 0.85;
      if (past) glow *= 1 - 0.55 * narrowed;
      if (focus && r.zones[k] !== focus) glow *= 0.1;
      colors[i * 3] = r.color.r * glow; colors[i * 3 + 1] = r.color.g * glow; colors[i * 3 + 2] = r.color.b * glow;
    }
    geometry.attributes.position.needsUpdate = true; geometry.attributes.color.needsUpdate = true;
  }
  /** Light one zone of the round trip and dim the rest; null lights everything. */
  const setFocus = zone => { focus = ZONES.includes(zone) ? zone : null; };
  /** For the tests: where the particles are, by zone, and how far the routes reach. */
  const getState = () => { const box = new THREE.Box3(); for (const r of routes) for (let i = 0; i <= 24; i++) box.expandByPoint(r.curve.getPointAt(i / 24, p)); return { routes: routes.length, particles: count, focus, low: +box.min.y.toFixed(3), high: +box.max.y.toFixed(3), wide: +(box.max.x - box.min.x).toFixed(3) }; };
  return { update, points, setFocus, getState, routes: routes.length, particles: count };
}
