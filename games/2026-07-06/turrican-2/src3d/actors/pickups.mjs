// Pickups (origin = hitbox centre, 16x16) and the morph mine (origin = hitbox bottom-centre).
import * as THREE from 'three';
import { G, Rig, xf, lin, clamp, approach, TAU } from './lib.mjs';

export const PICKUP_TYPES = ['gem', 'pu_weapon', 'pu_energy', 'pu_life', 'pu_line', 'pu_bomb'];
const CAP = { pu_weapon: '#ffd23f', pu_energy: '#54e36b', pu_life: '#ff5d7a', pu_line: '#67ffd4', pu_bomb: '#a9eeff' };
const at = (g, x, y, z, r, s) => xf(g, [x, y, z], r, s);

function icon(type) {
  const out = [];
  const E = (pts, d = 1.1) => G.ext(pts, d, 0.18, { bevelSeg: 1 });
  if (type === 'pu_energy') out.push(E([[0.8, 3.6], [-2.0, -0.2], [-0.2, -0.2], [-1.0, -3.6], [2.1, 0.7], [0.3, 0.7], [1.5, 3.6]]));
  else if (type === 'pu_life') {
    const pts = []; for (let i = 0; i < 18; i++) { const t = (i / 18) * TAU; pts.push([0.19 * 16 * Math.pow(Math.sin(t), 3), 0.19 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) + 0.4]); }
    out.push(E(pts));
  } else if (type === 'pu_weapon') {
    for (const y of [-2.2, 0.4]) out.push(E([[-2.6, y], [0, y + 2.4], [2.6, y], [2.6, y + 1.2], [0, y + 3.6], [-2.6, y + 1.2]]));
  } else if (type === 'pu_line') {
    out.push(G.box(1.0, 5.2, 1.0));
    out.push(E([[-1.8, 2.2], [1.8, 2.2], [0, 4.1]]), E([[-1.8, -2.2], [0, -4.1], [1.8, -2.2]]));
  } else if (type === 'pu_bomb') {
    for (let k = 0; k < 3; k++) {
      out.push(at(G.box(0.8, 7.2, 0.8), 0, 0, 0, [0, 0, k * Math.PI / 3]));
      for (const s of [1, -1]) for (const d of [2.1]) {
        const a = k * Math.PI / 3 + Math.PI / 2;
        const cx = Math.cos(a) * d * s, cy = Math.sin(a) * d * s;
        out.push(at(G.box(0.5, 1.9, 0.6), cx, cy, 0, [0, 0, a + Math.PI / 2 + 0.7]));
        out.push(at(G.box(0.5, 1.9, 0.6), cx, cy, 0, [0, 0, a + Math.PI / 2 - 0.7]));
      }
    }
  }
  return out;
}

export function buildPickup(type) {
  const r = new Rig(1 / 14);
  if (type === 'gem') {
    r.bone('spin', 'root', 0, 0, 0).bone('core', 'spin', 0, 0, 0).bone('orbit', 'root', 0, 0, 0);
    r.add('core', 'core', G.shard(2.0, 10.5, 7, 11, 0.1), lin('#2a7dff', 3.0));
    r.add('core', 'core', G.shard(1.0, 12.5, 5, 12, 0.1), lin('#8fd0ff', 2.6));
    r.add('spin', 'glass', G.shard(4.6, 16, 7, 5, 0.12), '#2f6fe0');
    // crisp opaque facet caps + satellite chips catch the light
    r.add('spin', 'crystal', at(G.shard(1.6, 4.2, 5, 9), 0, 6.6, 0), '#4a8cf0');
    r.add('spin', 'crystal', at(G.shard(1.4, 3.6, 5, 13), 0, -6.6, 0), '#2a5ec8');
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU;
      r.add('orbit', 'crystal', at(G.shard(0.7, 2.6, 5, 20 + i), Math.cos(a) * 6.6, (i - 1) * 2.4, Math.sin(a) * 6.6, [0.3, a, 0.4]), '#8fd8ff');
    }
    return r.build();
  }
  const c = CAP[type];
  r.bone('spin', 'root', 0, 0, 0).bone('icon', 'spin', 0, 0, 0);
  const capProfile = [[0.001, 0], [4.9, 0], [5.3, 0.4], [5.3, 1.3], [4.7, 1.8], [3.6, 2.0], [1.4, 2.5], [0.001, 2.6]];
  for (const s of [1, -1]) {
    const cap = G.lathe(capProfile, 12);
    r.add('spin', 'metal', at(cap, 0, s * 5.2, 0, s < 0 ? [Math.PI, 0, 0] : null), '#8a919b');
    r.add('spin', 'metal', at(G.torus(5.05, 0.42, 4, 16), 0, s * 5.55, 0, [Math.PI / 2, 0, 0]), c);
    r.add('spin', 'metal', at(G.cyl(1.1, 1.3, 0.8, 6), 0, s * 7.8, 0), '#3a3e45');
  }
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; r.add('spin', 'metal', at(G.box(0.7, 10.6, 0.7), Math.cos(a) * 4.75, 0, Math.sin(a) * 4.75), '#5a606a'); }
  r.add('spin', 'glass', G.cyl(4.4, 4.4, 10.4, 14, true), c);
  for (const g of icon(type)) r.add('icon', 'core', g, lin(c, 4.2));
  return r.build();
}

export function pickupAnimator(inst, type) {
  const B = inst.bones, st = { a: Math.random() * TAU, time: Math.random() * 3 };
  const core = inst.byMat.core;
  function update(it, s, dt) {
    dt = Math.min(dt, 0.05); st.time += dt;
    if (type === 'gem') {
      st.a += dt * 1.9;
      B.spin.rotation.set(0.18 * Math.sin(st.time * 1.3), st.a, 0.12);
      B.orbit.rotation.set(0, -st.a * 1.6, 0.25);
      B.core.scale.setScalar(1 + 0.08 * Math.sin(st.time * 5));
      inst.fx.pulse(core, 0.85 + 0.3 * (0.5 + 0.5 * Math.sin(st.time * 5)));
    } else {
      st.a += dt * 1.4;
      B.spin.rotation.set(0.1 * Math.sin(st.time * 1.1), st.a, 0.08 * Math.sin(st.time * 0.9));
      B.icon.rotation.set(0, -st.a, 0); // icon keeps facing the camera
      inst.fx.pulse(core, 0.8 + 0.35 * (0.5 + 0.5 * Math.sin(st.time * 4)));
    }
    inst.fx.apply(0, 0);
  }
  return { update };
}

// morph mine: armed disc, resting 3.5 px above the root (engine snaps it 3.5 into the floor)
export function buildMine() {
  const r = new Rig(1 / 10);
  r.bone('disc', 'root', 0, 3.5, 0).bone('led', 'disc', 0, 6.6, 0);
  r.add('disc', 'metal', G.lathe([[0.001, 3.5], [3.3, 3.5], [3.7, 4.0], [3.6, 4.7], [3.0, 5.0], [0.001, 5.0]], 16), '#3a3e45');
  r.add('disc', 'paint', G.lathe([[0.001, 4.95], [2.9, 4.95], [2.6, 5.6], [1.6, 6.1], [0.001, 6.2]], 16), '#56677a');
  r.add('disc', 'paint', xf(G.torus(3.45, 0.25, 4, 20), [0, 4.4, 0], [Math.PI / 2, 0, 0]), '#c35f28');
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; r.add('disc', 'metal', xf(G.box(1.1, 0.5, 0.6, 0.12), [Math.cos(a) * 3.6, 3.8, Math.sin(a) * 3.6], [0, -a, 0]), '#9aa3ad'); }
  r.add('disc', 'metal', xf(G.cyl(0.65, 0.75, 0.5, 8), [0, 6.25, 0]), '#1c1e22');
  r.add('led', 'core', xf(G.sph(0.55, 8, 6), [0, 6.65, 0]), lin('#ff3b30', 5));
  return r.build();
}
export function mineAnimator(inst) {
  const B = inst.bones, st = { time: 0, spin: Math.random() * TAU };
  const core = inst.byMat.core;
  function update(m, s, dt) {
    dt = Math.min(dt, 0.05); st.time += dt;
    if (m && m.vy) st.spin += dt * 4;
    B.disc.rotation.set(0, st.spin, 0);
    const late = m && m.life != null && m.life < 1.2;
    const rate = late ? 9 : 3;
    const on = (st.time * rate) % 1 < 0.35;
    inst.fx.pulse(core, on ? 1.3 : 0.08);
    B.led.scale.setScalar(on ? 1.15 : 0.9);
    inst.fx.apply(0, 0);
  }
  return { update };
}
