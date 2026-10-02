// APX-9 head: sensor housing (tray, bezel, louvred stack) and sensor hub (chrome bearing + shaft end) in the face-plate window.
import * as THREE from 'three';
import { cyl, torus, mergeGeometries, rivet } from '../geo.js';
import { rbox, sub, union, seg } from './head-sdf.js';
import { plateFrame, SENSOR, SENSOR_DIR, headPoint2 } from './head-layout.js';
import { layer, placeAt } from './head-plates.js';
import { boltField } from './head-util.js';

/** plate-space description of the window, shared with the face-plate recipe */
export function sensorFrame() {
  const fr = plateFrame('face-plate');
  const sc = fr.inv(headPoint2(SENSOR_DIR));
  return { fr, cx: sc[0], cy: sc[1], hw: SENSOR.hw + 0.03, hh: SENSOR.hh + 0.03, r: SENSOR.r + 0.03 };
}

export function buildSensor(ctx, shell) {
  const { M, ex } = ctx;
  const { fr, cx, cy, hw, hh, r } = sensorFrame();
  const bx = [cx - hw - 0.3, cy - hh - 0.3, cx + hw + 0.3, cy + hh + 0.3];
  const rb = (x, y, w, h, rr = 0.04) => rbox(cx + x, cy + y, w, h, rr);
  const L = (f, o) => layer(fr, f, bx, o);
  const iw = hw - 0.22, ih = hh - 0.22;                // inside the bezel ring
  const place = (x, y, lift, mode, spin) => placeAt(fr, cx + x, cy + y, lift, mode, spin);

  /* ------------------------------------------------------------------ housing */
  const housing = shell.part('sensor-housing', {
    name: 'Sensor Housing', tag: 'shell',
    info: 'Machined sensor cartridge seated in the face window: polished bezel, gunmetal body, louvred cooling stack, lens cap and corner fasteners.',
    explode: ex([5.6, -0.8, 0], 'mid'),
  });
  // glossy tray that closes the window
  housing.add(L(rb(0, 0, hw - 0.02, hh - 0.02, r - 0.02), { top: -0.2, thickness: 0.5, bevel: 0.04 }), M.black);
  // polished bezel ring
  housing.add(L(sub(rb(0, 0, hw, hh, r), rb(0, 0, iw, ih, r - 0.2)), { top: 0.08, thickness: 0.32, bevel: 0.07 }), M.steel);
  // gunmetal body
  housing.add(L(rb(0, 0, iw - 0.02, ih - 0.02, r - 0.22), { top: -0.05, thickness: 0.2, bevel: 0.04 }), M.gunmetalDark);

  // upper lens cap
  const capY = ih - 0.24, capH = 0.2, capW = iw - 0.12;
  housing.add(L(rb(0, capY, capW, capH, 0.08), { top: 0.1, thickness: 0.2, bevel: 0.05 }), M.gunmetalDark);
  housing.add(L(sub(rb(0, capY, capW, capH, 0.08), rb(0, capY, capW - 0.07, capH - 0.07, 0.05)), { top: 0.135, thickness: 0.08, bevel: 0.025 }), M.steel);
  housing.add(L(rb(0, capY, capW - 0.1, capH - 0.1, 0.05), { top: 0.125, thickness: 0.1, bevel: 0.02 }), M.black);

  // hub boss (raised pad the chrome hub sits on)
  const hubY = 0.1;
  housing.add(L(sub(rb(0, hubY, iw - 0.12, 0.5, 0.18), rb(0, hubY, iw - 0.2, 0.42, 0.14)), { top: 0.07, thickness: 0.2, bevel: 0.04 }), M.steel);

  // louvred cooling stack (lower half)
  const ribs = [];
  for (let i = 0; i < 7; i++) ribs.push(rb(0, -ih + 0.2 + i * 0.125, iw - 0.15, 0.033, 0.014));
  housing.add(L(union(...ribs), { top: 0.07, thickness: 0.16, bevel: 0.02 }), M.steel);
  // dark shroud around the stack
  housing.add(L(sub(rb(0, -ih + 0.54, iw - 0.08, 0.5, 0.06), rb(0, -ih + 0.54, iw - 0.13, 0.45, 0.04)), { top: 0.02, thickness: 0.12, bevel: 0.025 }), M.gunmetalDark);

  // corner fasteners on the bezel
  const bolts = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x = sx * (hw - 0.11), y = sy * (hh - 0.3);
    const f = fr.frameAt(cx + x, cy + y);
    bolts.push({ p: [f.p[0] + f.n[0] * 0.075, f.p[1] + f.n[1] * 0.075, f.p[2] + f.n[2] * 0.075], n: f.n });
  }
  housing.add(boltField(bolts, { kind: 'hex', r: 0.06 }), M.steel);

  /* ------------------------------------------------------------------ hub */
  const hub = shell.part('sensor-hub', {
    name: 'Sensor Hub', tag: 'shell',
    info: 'Chrome shaft hub and bearing collar that terminate the central drive shaft at the sensor housing, with a brass sleeve and an amber status ring.',
    explode: ex([7.8, -0.9, 0], 'fine'),
  });
  const m = place(0, hubY, 0.08, 'y');
  hub.add(cyl(0.4, 0.15, { bevel: 0.03, rIn: 0.27, bevelIn: 0.02, segments: 56 }), M.chrome, m.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0.075, 0)));
  hub.add(cyl(0.27, 0.12, { bevel: 0.02, rIn: 0.13, bevelIn: 0.02, segments: 48 }), M.brass, m.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0.06, 0)));
  hub.add(cyl(0.125, 0.3, { bevel: 0.03, segments: 40 }), M.chrome, m.clone().multiply(new THREE.Matrix4().makeTranslation(0, 0.15, 0)));
  hub.add(torus(0.33, 0.018, { radial: 8, tubular: 56 }), M.glowAmber, m.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(0, 0.152, 0), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), new THREE.Vector3(1, 1, 1))));
  // six socket screws on the collar
  const hb = [];
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + 0.3;
    const v = new THREE.Vector3(Math.cos(a) * 0.34, 0.15, Math.sin(a) * 0.34).applyMatrix4(m);
    const n = new THREE.Vector3(0, 1, 0).transformDirection(m);
    hb.push({ p: [v.x, v.y, v.z], n: [n.x, n.y, n.z] });
  }
  hub.add(boltField(hb, { kind: 'dome', r: 0.032 }), M.chrome);
  // amber status strip beside the stack
  const strip = L(rb(iw - 0.1, -0.55, 0.035, 0.32, 0.015), { top: 0.06, thickness: 0.1, bevel: 0.015 });
  hub.add(strip, M.glowAmber);
  void mergeGeometries; void rivet; void seg;
  return { housing, hub };
}
