/**
 * Measure: click two points on the body and read the straight-line distance between them.
 *
 * The model is built to scale (one unit is one metre, and the figure stands about 1.70 m), so the reading is the
 * real distance on this body. The two points and the line belong to the body's own group, so they lean with it;
 * they do not follow a single piece when the body is pulled apart, and are cleared instead.
 *
 * The studio hands over each clicked point (in world space); this module draws the markers and the label.
 */
import * as THREE from 'three';

export const formatLength = metres => metres < 0.1 ? `${Math.round(metres * 1000)} mm` : metres < 1 ? `${(metres * 100).toFixed(1)} cm` : `${metres.toFixed(2)} m`;

export function createMeasure({ parent, label, readout, onChange }) {
  const points = [];   // in the parent's own space
  const flat = new THREE.MeshBasicMaterial({ color: '#ffd28a', depthTest: false, depthWrite: false, fog: false, toneMapped: false });
  const dots = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 12, 8), flat); m.renderOrder = 60; m.visible = false; m.raycast = () => {}; parent.add(m); return m; });
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#ffd28a', depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  line.renderOrder = 60; line.visible = false; line.frustumCulled = false; line.raycast = () => {}; parent.add(line);
  const mid = new THREE.Vector3();
  let active = false;

  const distance = () => points.length === 2 ? points[0].distanceTo(points[1]) : null;
  function show() {
    dots.forEach((d, i) => { d.visible = active && !!points[i]; if (points[i]) d.position.copy(points[i]); });
    line.visible = active && points.length === 2;
    if (points.length === 2) { geometry.attributes.position.setXYZ(0, points[0].x, points[0].y, points[0].z); geometry.attributes.position.setXYZ(1, points[1].x, points[1].y, points[1].z); geometry.attributes.position.needsUpdate = true; }
    const d = distance();
    label.textContent = d === null ? '' : formatLength(d);
    readout.textContent = !active ? '' : d !== null ? `${formatLength(d)} between the two points. Click again to start a new measurement.` : points.length ? 'Now click the second point.' : 'Click two points on the body.';
    onChange?.();
  }
  /** A point the visitor clicked, in world space. The third click starts a new measurement. */
  function add(world) { if (!active) return; if (points.length === 2) points.length = 0; points.push(parent.worldToLocal(world.clone())); show(); }
  function clear() { points.length = 0; show(); }
  function setActive(on) { active = !!on; if (!active) points.length = 0; show(); }
  /** Once per drawn frame: keep the label on the middle of the line. */
  function frame(camera, width, height) {
    const on = active && points.length === 2;
    if (on) { mid.copy(points[0]).add(points[1]).multiplyScalar(0.5); parent.localToWorld(mid).project(camera); }
    label.hidden = !on || mid.z > 1 || Math.abs(mid.x) > 1 || Math.abs(mid.y) > 1;
    if (!label.hidden) { label.style.left = `${(mid.x * 0.5 + 0.5) * width}px`; label.style.top = `${(-mid.y * 0.5 + 0.5) * height}px`; }
  }
  return { add, clear, setActive, frame, get active() { return active; }, getState: () => ({ active, points: points.length, metres: distance() }) };
}
