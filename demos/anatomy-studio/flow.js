/**
 * Blood flow: points of light travelling through the heart and the great vessels, in the right direction and with
 * the right timing. Blue is blood returning to the lungs, red is blood leaving them.
 *
 *   venae cavae -> right atrium -> (tricuspid) -> right ventricle -> (pulmonary valve) -> pulmonary arteries
 *   pulmonary veins -> left atrium -> (mitral) -> left ventricle -> (aortic valve) -> aorta -> iliac arteries
 *
 * Each route is a smooth curve through the centres of the pieces it passes. A particle's speed depends on the
 * stretch it is in: veins run steadily, the step from atrium to ventricle only moves while the inflow valves are
 * open, the step out of the ventricle only while the outflow valves are open, and the arteries surge with the pulse.
 * It is a diagram laid over the model, drawn through everything, so it is shown in the X-ray finish only.
 */
import * as THREE from 'three';

const BLUE = new THREE.Color('#2f8cff'), RED = new THREE.Color('#ff3a2e');
const SPEED = { vein: 0.05, inflow: 0.3, outflow: 0.55, artery: 0.07, surge: 0.4 };   // metres a second (slowed from life so the eye can follow)

export function createFlow({ manifest, parent }) {
  const piece = (name, side) => manifest.pieces.find(p => p.name === name && (!side || p.side === side));
  const at = (name, side, shift = [0, 0, 0]) => { const p = piece(name, side); return p ? new THREE.Vector3(p.center[0] + shift[0] * p.size[0], p.center[1] + shift[1] * p.size[1], p.center[2] + shift[2] * p.size[2]) : null; };
  const routes = [];
  /** stops: [point, kind of the stretch that ARRIVES at this point]. Missing pieces drop the whole route. */
  function route(color, width, stops) {
    if (stops.some(s => !s[0])) return;
    const points = stops.map(s => s[0]), curve = new THREE.CatmullRomCurve3(points, false, 'centripetal'), total = curve.getLength();
    // where each stop falls along the curve, so a particle knows which stretch it is in
    const marks = [0]; let run = 0;
    for (let i = 1; i < points.length; i++) { run += points[i].distanceTo(points[i - 1]); marks.push(run); }
    routes.push({ color, width, curve, total, marks: marks.map(m => m / run * total), kinds: stops.map(s => s[1]), systemic: color === RED });
  }
  const ra = at('Right atrium'), rv = at('Right ventricle'), la = at('Left atrium'), lv = at('Left ventricle');
  const trunk = at('Pulmonary trunk'), fork = at('Bifurcation of pulmonary trunk');
  for (const [vein, start] of [['Superior vena cava', [0, 0.5, 0]], ['Inferior vena cava (thoracic part)', [0, -0.5, 0]]])
    for (const lung of ['Left pulmonary artery', 'Right pulmonary artery'])
      route(BLUE, 0.006, [[at(vein, null, start), 'vein'], [at(vein), 'vein'], [ra, 'vein'], [rv, 'inflow'], [trunk, 'outflow'], [fork, 'artery'], [at(lung), 'artery'], [at(lung, null, lung.startsWith('Left') ? [0.45, -0.3, 0] : [-0.45, 0, 0]), 'artery']]);
  const aorta = [[at('Ascending aorta'), 'outflow'], [at('Aortic arch', null, [0, 0.3, 0.2]), 'artery'], [at('Aortic arch', null, [0, 0.1, -0.4]), 'artery'], [at('Thoracic aorta'), 'artery'], [at('Abdominal aorta', null, [0, 0.35, 0]), 'artery'], [at('Abdominal aorta', null, [0, -0.4, 0]), 'artery']];
  for (const vein of [['Left superior pulmonary vein', 'L'], ['Left inferior pulmonary vein', 'L'], ['Right superior pulmonary vein', 'R'], ['Right inferior pulmonary vein', 'R']])
    for (const side of ['L', 'R'])
      route(RED, 0.006, [[at(vein[0], null, [vein[1] === 'L' ? 0.5 : -0.5, 0, 0]), 'vein'], [at(vein[0]), 'vein'], [la, 'vein'], [lv, 'inflow'], ...aorta, [at('Common iliac artery', side), 'artery']]);

  const PER_ROUTE = 34, count = routes.length * PER_ROUTE;
  const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  const particles = [];
  routes.forEach(r => { for (let i = 0; i < PER_ROUTE; i++) particles.push({ r, s: Math.random() * r.total, jitter: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(3.2 * r.width) }); });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.0075, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 1, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  points.frustumCulled = false; points.renderOrder = 50; points.visible = false; points.raycast = () => {};
  parent.add(points);
  const p = new THREE.Vector3();

  /**
   * Move the particles. `signals` are the heart's (inflow and outflow valves 0..1, atrium and ventricle 0..1);
   * `shown` hides the whole thing without stopping the bookkeeping.
   */
  function update(dt, signals, shown) {
    points.visible = shown && particles.length > 0;
    if (!points.visible) return;
    const surge = Math.max(0, signals.ventricle);
    const speed = { vein: SPEED.vein * (0.6 + 0.8 * signals.inflow), inflow: SPEED.inflow * signals.inflow * (0.5 + signals.atrium), outflow: SPEED.outflow * signals.outflow, artery: SPEED.artery + SPEED.surge * surge * signals.outflow };
    for (let i = 0; i < particles.length; i++) {
      const q = particles[i], r = q.r;
      let k = 1; while (k < r.marks.length - 1 && q.s > r.marks[k]) k++;
      let v = speed[r.kinds[k]];
      if (r.kinds[k] === 'outflow' && r.systemic && signals.leak > 0) v -= SPEED.inflow * 0.5 * signals.leak;   // a leaking aortic valve: blood falls back towards the ventricle
      q.s += v * dt;
      if (q.s < r.marks[k - 1]) q.s = r.marks[k - 1];
      if (q.s >= r.total) q.s -= r.total;
      r.curve.getPointAt(q.s / r.total, p).add(q.jitter);
      positions[i * 3] = p.x; positions[i * 3 + 1] = p.y; positions[i * 3 + 2] = p.z;
      // a particle waiting at a shut valve dims, so the stop-and-go of the heart reads at a glance
      const glow = r.kinds[k] === 'inflow' ? 0.35 + 0.65 * signals.inflow : r.kinds[k] === 'outflow' ? 0.35 + 0.65 * signals.outflow : 0.85;
      colors[i * 3] = r.color.r * glow; colors[i * 3 + 1] = r.color.g * glow; colors[i * 3 + 2] = r.color.b * glow;
    }
    geometry.attributes.position.needsUpdate = true; geometry.attributes.color.needsUpdate = true;
  }
  return { update, points, routes: routes.length, particles: particles.length };
}
