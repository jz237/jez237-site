// Shared enemy-building and enemy-animation helpers.
import { G, Rig, xf, warp, lin, clamp, lerp, smooth, approach, TAU, V3, mountOf } from './lib.mjs';
export { G, Rig, xf, warp, lin, clamp, lerp, smooth, approach, TAU, V3 };

export const at = (g, x, y, z, r, s) => xf(g, [x, y, z], r, s);
export const tube3 = (a, b, c, r0, r1, seg = 6, rs = 6) => G.taperTube([a, b, c], (t) => lerp(r0, r1, t), seg, rs);
const hn = (x, y, z, s) => { const v = Math.sin(Math.round(x * 97) * 12.9898 + Math.round(y * 97) * 78.233 + Math.round(z * 97) * 37.719 + s * 11.1) * 43758.5453; return v - Math.floor(v); };
// faceted boulder / lump
export function rock(rad, seed = 1, rough = 0.22, detail = 1, sx = 1, sy = 1, sz = 1) {
  const g = G.ico(1, detail);
  warp(g, (v) => { const n = hn(v.x, v.y, v.z, seed); v.multiplyScalar(rad * (1 + (n - 0.5) * rough * 2)); v.x *= sx; v.y *= sy; v.z *= sz; }, false);
  g.computeVertexNormals();
  return g;
}
// lumpy organic ellipsoid (smooth)
const vn = (x, y, z, s) => { // smooth 3D value noise
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const h = (a, b, c) => { const q = Math.sin(a * 127.1 + b * 311.7 + c * 74.7 + s * 19.3) * 43758.5453; return q - Math.floor(q); };
  const l = (a, b, t) => a + (b - a) * t;
  return l(l(l(h(xi, yi, zi), h(xi + 1, yi, zi), u), l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), u), v),
    l(l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), u), l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), u), v), w);
};
export function blob(rx, ry, rz, seed = 1, rough = 0.12, ws = 14, hs = 10) {
  const g = G.ell(1, 1, 1, ws, hs);
  warp(g, (v) => { const n = vn(v.x * 1.6 + 5, v.y * 1.6, v.z * 1.6, seed) * 0.65 + vn(v.x * 4 + 9, v.y * 4, v.z * 4, seed + 3) * 0.35; v.multiplyScalar(1 + (n - 0.5) * rough * 2.4); v.x *= rx; v.y *= ry; v.z *= rz; }, 'smooth');
  return g;
}
// crystal cluster: list of [x, y, z, r, h, tiltX, tiltZ, seed]
export function crystals(r, bone, list, col, mat = 'crystal') {
  for (const [x, y, z, rad, h, tx, tz, seed] of list) r.add(bone, mat, at(G.crystal(rad, h, 6, 0.32, seed || 1), x, y, z, [tx || 0, (seed || 1) * 0.7, tz || 0]), col);
}
// 2-segment leg: bones name (hip) + name+'k' (knee)
export function leg(r, name, parent, hip, knee, foot, rad, mat, col, jointCol = '#24221f') {
  r.bone(name, parent, hip[0], hip[1], hip[2]).bone(name + 'k', name, knee[0], knee[1], knee[2]);
  const m1 = [(hip[0] + knee[0]) / 2, (hip[1] + knee[1]) / 2 + rad * 0.6, (hip[2] + knee[2]) / 2];
  const m2 = [(knee[0] + foot[0]) / 2 + rad * 0.3, (knee[1] + foot[1]) / 2 + rad * 0.3, (knee[2] + foot[2]) / 2];
  r.add(name, mat, tube3(hip, m1, knee, rad, rad * 0.8), col);
  r.add(name, 'suit', at(G.sph(rad * 0.85, 7, 5), knee[0], knee[1], knee[2]), jointCol);
  r.add(name + 'k', mat, tube3(knee, m2, foot, rad * 0.78, rad * 0.22), col);
}

// ---- animation helpers -------------------------------------------------------------
export function common(st, inst, e, s, dt) {
  const frozen = !!(s && s.freeze > 0);
  const adt = frozen ? 0 : Math.min(dt, 0.05);
  st.time += adt;
  const flash = e && e.hitFlash > 0 ? Math.min(1, e.hitFlash * 14) : 0;
  const frost = frozen ? Math.min(1, s.freeze * 2) : 0;
  st.flash = flash; st.frost = frost;
  return adt;
}
export function finish(st, inst) { inst.fx.apply(st.flash, st.frost); }
// yaw that always turns through the camera side: right = 0, left = -PI
export function faceYaw(st, dir, dt, rate = 10) { st.yaw = approach(st.yaw, dir >= 0 ? 0 : -Math.PI, rate, dt); return st.yaw; }
export function playerDir(e, s) { const p = s && s.player; if (!p) return e.facing || -1; return Math.sign((p.x + p.w / 2) - (e.x + e.w / 2)) || (e.facing || -1); }
// aim angle (y-up radians) from a point on the entity to the player centre
export function aimAt(e, s, oy = 0.5) {
  const p = s && s.player; if (!p) return Math.PI;
  return Math.atan2(-((p.y + p.h / 2) - (e.y + e.h * oy)), (p.x + p.w / 2) - (e.x + e.w / 2));
}
// turret fire signals: charge 0..1 just before a shot, kick 1 when a shot leaves
export function turretSignals(st, e, dt, every = 1.6) {
  const f = e.fireT != null ? e.fireT : 1;
  if (st.lastFire != null && f > st.lastFire + 0.05) st.kick = 1;
  st.lastFire = f;
  st.kick = Math.max(0, (st.kick || 0) - dt * 5);
  st.charge = f < 0.45 && f > 0 ? 1 - f / 0.45 : 0;
}
export function hopSignals(e, cad) {
  const ground = !e.vy || Math.abs(e.vy) < 1e-3;
  const ph = ((e.t || 0) % cad);
  const crouch = ground ? smooth((ph - (cad - 0.3)) / 0.3) : 0;
  const air = ground ? 0 : clamp((e.vy || 0) / 400, -1, 1); // -1 rising fast .. +1 falling
  return { ground, crouch, air };
}
// mount orientation for wall/ceiling turrets: rotates the inner pivot about the hitbox centre
export function applyMount(st, inst, e, s, h) {
  if (st.mount == null) st.mount = mountOf(e, s);
  const P = inst.bones.root;
  if (st.mount === 'ceil') { P.rotation.set(0, 0, Math.PI); P.position.set(0, h, 0); }
  else if (st.mount === 'wallL') { P.rotation.set(0, 0, -Math.PI / 2); P.position.set(-h / 2, h / 2, 0); }
  else if (st.mount === 'wallR') { P.rotation.set(0, 0, Math.PI / 2); P.position.set(h / 2, h / 2, 0); }
  return st.mount;
}
// convert a world-space aim angle into the turret's local frame given its mount
export function mountAim(mount, a) {
  if (mount === 'ceil') return a - Math.PI;
  if (mount === 'wallL') return a + Math.PI / 2;
  if (mount === 'wallR') return a - Math.PI / 2;
  return a;
}
// yaw + pitch split so a turret head turns toward the camera instead of flipping
export function yawPitch(st, a, dt, minP = -0.35, maxP = 1.45) {
  const right = Math.cos(a) >= 0;
  faceYaw(st, right ? 1 : -1, dt, 8);
  let pitch = right ? a : Math.PI - a;
  if (pitch > Math.PI) pitch -= TAU;
  st.pitch = approach(st.pitch || 0, clamp(pitch, minP, maxP), 10, dt);
  return st.pitch;
}
export function legSwing(b, side, swing, lift) { b.rotation.set(-side * lift, side * swing, 0); }
