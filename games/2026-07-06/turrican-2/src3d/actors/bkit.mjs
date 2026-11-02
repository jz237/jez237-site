// Boss animation framework: state-machine signals, damage states, shedding and break-up.
import { clamp, approach, smooth, TAU, rng } from './lib.mjs';
import { playerDir, aimAt } from './ekit.mjs';

const ATK_DUR = { shockwave: 0.5, lob: 0.6, volley: 0.6, dash: 1.1, spawn: 0.7, barrage: 1.4, beam: 1.3 };
export function attackList(b) {
  const c = b.cfg; if (!c) return null;
  return c.phases ? c.phases[Math.min(b.phase || 0, c.phases.length - 1)].attacks : c.attacks;
}
// signals shared by every boss; mutates st, returns the animation dt (0 when frozen)
export function bossSignals(st, b, s, dt, inst, faceRate = 3) {
  dt = Math.min(dt || 0, 0.05);
  const frozen = !!(s && s.freeze > 0);
  const adt = frozen ? 0 : dt;
  st.time += adt;
  const key = (b.state || 'idle') + ':' + (b.attack ? b.attack.kind : '') + ':' + (b.ai || 0);
  if (key !== st.key) { st.key = key; st.sT = 0; if (b.state === 'attack') st.kick = 1; }
  st.sT += adt;
  const list = attackList(b);
  st.next = list && list.length ? list[(b.ai || 0) % list.length].kind : (st.defaultNext || 'volley');
  const tele = (b.cfg && b.cfg.tele) || 0.7;
  st.tele = b.state === 'tele' ? clamp(b.stateT != null && b.cfg ? 1 - b.stateT / tele : st.sT / tele, 0, 1) : 0;
  st.teleS = approach(st.teleS || 0, st.tele, 14, dt);
  st.kind = b.state === 'attack' && b.attack ? b.attack.kind : null;
  const dur = st.kind ? (b.attack.dur || ATK_DUR[st.kind] || 0.5) : 1;
  st.ap = st.kind ? clamp(st.sT / dur, 0, 1) : 0;
  st.kick = Math.max(0, (st.kick || 0) - adt * 4);
  st.atk = approach(st.atk || 0, st.kind ? 1 : 0, 16, dt);
  st.open = approach(st.open || 0, b.open && !b.dying ? 1 : 0, 7, dt);
  st.phaseS = approach(st.phaseS || 0, b.phase || 0, 2.5, dt);
  st.die = b.dying ? clamp(1 - (b.deathT != null ? b.deathT : 0) / 2.2, 0, 1) : 0;
  st.flash = b.hitFlash > 0 ? Math.min(1, b.hitFlash * 12) * 0.5 : 0;
  st.frost = frozen ? Math.min(1, s.freeze * 2) : 0;
  // facing (bosses face the player; vx estimated from position change)
  const vx = st.px != null && dt > 0 ? (b.x - st.px) / dt : 0; st.px = b.x;
  st.vx = approach(st.vx || 0, vx, 8, dt);
  if (!b.dying) st.dir = playerDir(b, s);
  st.yaw = approach(st.yaw, (st.dir || -1) >= 0 ? 0 : -Math.PI, faceRate, adt);
  // local aim angle toward the player (in the boss's own facing frame)
  const a = aimAt(b, s, 0.42);
  let l = (st.dir || -1) > 0 ? a : Math.PI - a; if (l > Math.PI) l -= TAU;
  st.aim = approach(st.aim || 0, clamp(l, -1.2, 1.2), 6, adt);
  return adt;
}
// glowing crack sets + sparks by phase
export function damage(B, st, b) {
  const ph = b.phase || 0;
  if (B.cracks1) B.cracks1.scale.setScalar(ph >= 1 || b.dying ? 1 : 0.0001);
  if (B.cracks2) B.cracks2.scale.setScalar(ph >= 2 || b.dying ? 1 : 0.0001);
  if (B.spark) {
    const h = Math.sin(Math.floor(st.time * 18) * 91.7) * 43758.5; const r = h - Math.floor(h);
    B.spark.scale.setScalar(ph >= 1 && r > 0.45 ? 0.6 + r : 0.0001);
    B.spark.rotation.set(r * 6, r * 3, r * 9);
  }
}
// armour plates fall away once phase 2 is reached
export function shed(B, st, b, names, adt) {
  if ((b.phase || 0) >= 2 || b.dying) st.shedT = (st.shedT || 0) + adt; else st.shedT = 0;
  const t = st.shedT || 0;
  names.forEach((n, i) => {
    const bone = B[n]; if (!bone) return;
    const r = bone.userData.rest;
    if (t <= 0) { bone.position.copy(r); bone.rotation.set(0, 0, 0); bone.scale.setScalar(1); return; }
    const k = t * (1 + i * 0.15);
    bone.position.set(r.x - k * 6 * (i % 2 ? 1 : -1), r.y - 70 * k * k, r.z + (r.z >= 0 ? 1 : -1) * 18 * k);
    bone.rotation.set(k * 2.2 * (i % 2 ? 1 : -1), 0, k * 3.1);
    bone.scale.setScalar(k > 0.75 ? 0.0001 : 1);
  });
}
// death: parts fly apart from the body with spin; whole rig shakes
export function breakup(B, st, names, seed = 1, dist = 46) {
  const d = st.die; if (d <= 0) return;
  if (!st.brk) { const R = rng(seed); st.brk = names.map(() => [R() * 2 - 1, R() * 0.9 + 0.2, (R() * 2 - 1), R() * 6 - 3, R() * 6 - 3, R() * 6 - 3]); }
  const e = Math.max(0, d - 0.25) / 0.75, k = e * e;
  names.forEach((n, i) => {
    const bone = B[n]; if (!bone) return; const v = st.brk[i], r = bone.userData.rest;
    bone.position.set(r.x + v[0] * dist * k, r.y + (v[1] * dist * 0.8) * k - 60 * k * k, r.z + v[2] * dist * k * 0.6);
    bone.rotation.set(v[3] * k, v[4] * k, v[5] * k);
  });
}
export function shake(st, amt) { const t = st.time; return [Math.sin(t * 61) * amt, Math.sin(t * 53 + 1) * amt * 0.7, Math.sin(t * 47 + 2) * amt * 0.5]; }
export { smooth, clamp, approach, TAU };
