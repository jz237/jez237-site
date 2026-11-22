// UNDERSTORM 2026 — the far structures of each stage, between the painted backdrop and the play plane.
// Everything is instanced: a few geometries, a few materials, hundreds of parts. Each stage kind assembles its
// landmarks from small builders (lattice towers, tank farms, hulks, rock masses, crystal clusters, sky whales).
import * as THREE from '../vendor/three.module.min.js';
import { G } from './models.js?v=150';
import { detailize } from './gfx.js?v=150';

const col = (h) => new THREE.Color(h), PI = Math.PI, TIME = { value: 0 }; // TIME is shared by every flowing material

// Move everything buildFar marked as moving. t in seconds; L is the loop length (whales swim around it).
export function tickFar(far, t) {
  TIME.value = t; if (!far) return; far.warn.color.copy(far.warnC).multiplyScalar(0.45 + 0.55 * Math.max(0, Math.sin(t * 2.4))); // beacons pulse together
  for (const a of far.anim) {
    if (a.k === 0) { a.o.rotation.y = Math.sin(t * 0.16 + a.ph) * 1.25; const sw = Math.sin(t * 0.9 + a.ph) * 0.05; a.cab.rotation.z = sw; a.load.position.y = -3.8 + Math.sin(t * 0.23 + a.ph * 2.0) * 0.9; a.cab.scale.y = 3.6 - (a.load.position.y + 3.8) * 1.0; a.cab.position.y = (a.load.position.y + 0.2) / 2; }
    else if (a.k === 1) { const u = 0.5 + 0.5 * Math.sin(t * 0.25 + a.ph); a.o.position.y = a.y0 + (a.y1 - a.y0) * u * u * (3 - 2 * u); }
    else if (a.k === 2) { a.o.position.x = ((((a.x0 - t * a.sp) % far.L) + far.L) % far.L); a.o.position.y = a.y0 + Math.sin(t * 0.3 + a.ph) * 1.4; a.o.rotation.z = Math.sin(t * 0.3 + a.ph + 1.2) * 0.05; a.tail.rotation.y = Math.sin(t * 1.3 + a.ph) * 0.22; for (const f of a.fins) f.rotation.x = f.userData.k * (0.55 + Math.sin(t * 0.9 + a.ph) * 0.22); }
    else if (a.k === 3) a.o.rotation.z = a.base + Math.sin(t * 0.22 + a.ph) * a.amp;
  }
}

// T: { plate, rock, facet } detail maps. Returns { groups: [a, b] (two copies, L apart, for wrapping), mats, L }.
export function buildFar(st, dens, T) {
  const P = st.pal, kind = st.backdrop, L = 170, dark = !!st.dark;
  const winC = col(P.glow).lerp(col(0xffe2b0), 0.55);
  const struct = detailize(new THREE.MeshStandardMaterial({ color: col(P.tb).lerp(col(P.ta), 0.35).lerp(col(P.fog), 0.3).multiplyScalar(0.62), metalness: 0.55, roughness: 0.7, envMapIntensity: 0.4 }), T.plate, 0.16, 1, dark ? 0.5 : 1.5, winC);
  const frame = detailize(new THREE.MeshStandardMaterial({ color: col(P.tb).multiplyScalar(0.42), metalness: 0.6, roughness: 0.75, envMapIntensity: 0.3 }), T.plate, 0.5, 0.6);
  const accent = detailize(new THREE.MeshStandardMaterial({ color: col(P.ta).lerp(col(P.fog), 0.3).multiplyScalar(0.62), metalness: 0.6, roughness: 0.55, envMapIntensity: 0.45 }), T.plate, 0.22, 1);
  const rock = detailize(new THREE.MeshStandardMaterial({ color: col(P.tb).lerp(col(P.ta), 0.4).multiplyScalar(0.8), metalness: 0.05, roughness: 0.95, flatShading: true, envMapIntensity: 0.2 }), T.rock, 0.07, 1);
  const cry = new THREE.MeshStandardMaterial({ color: col(P.ta), metalness: 0.2, roughness: 0.1, emissive: col(P.glow), emissiveIntensity: 0.55, flatShading: true, transparent: true, opacity: 0.8, envMapIntensity: 1.4 });
  const skin = new THREE.MeshStandardMaterial({ color: col(P.ta).lerp(col(P.cl), 0.4), metalness: 0.1, roughness: 0.45, emissive: col(P.glow), emissiveIntensity: 0.12, envMapIntensity: 0.6 });
  const glow = new THREE.MeshBasicMaterial({ color: col(P.glow).multiplyScalar(1.9) }), warn = new THREE.MeshBasicMaterial({ color: col(P.rim).multiplyScalar(2.2) }), hot = new THREE.MeshBasicMaterial({ color: col(P.liq || 0xff7a2a).multiplyScalar(2.4) });
  const defs = { box: [G.box, struct], boxF: [G.box, frame], boxA: [G.box, accent], cyl: [G.cyl, struct], cylA: [G.cyl, accent], cylF: [G.cyl, frame], dome: [G.half, accent], cone: [G.cone, frame], tor: [G.tor, frame], torF: [G.torF, accent],
    ico: [G.ico1, rock], icoS: [G.ico, rock], coneR: [G.cone, rock], cylR: [G.cyl, rock], oct: [G.oct, cry], sph: [G.sph, skin], coneS: [G.cone, skin], boxS: [G.box, skin], glow: [G.box, glow], gsph: [G.sph, glow], warn: [G.sph, warn], hot: [G.box, hot] };
  const lists = {}; for (const k in defs) lists[k] = [];
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), Sc = new THREE.Vector3();
  const put = (k, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) => { E.set(rx, ry, rz); Q.setFromEuler(E); M.compose(V.set(x, y, z), Q, Sc.set(sx, sy, sz)); lists[k].push(M.clone()); };
  let seed = st.idx * 97 + 5; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }, pick = (a) => a[(R() * a.length) | 0];

  const cranes = [], lifts = [], vents = [], falls = [], whales = [], lights = []; // things that move: collected here, built per copy at the end
  // ---- builders. (x, y, z) is the base centre; s is the overall size.
  const tank = (x, y, z, r, h, k = 'cylA') => { put(k, x, y + h / 2, z, r, h, r); put('dome', x, y + h, z, r, r * 0.55, r); for (let b = 0.2; b < 0.95; b += 0.3) put('tor', x, y + h * b, z, r * 1.03, r * 1.03, r * 1.2, PI / 2); put('boxF', x + r * 0.95, y + h / 2, z + r * 0.3, 0.08, h, 0.08); for (let q = 0.4; q < h; q += 0.6) put('boxF', x + r * 0.98, y + q, z + r * 0.3, 0.05, 0.05, 0.4); };
  const deck = (x, y, z, w, d) => { put('box', x, y, z, w, 0.28, d); for (let q = -w / 2; q <= w / 2 + 0.01; q += w / 6) put('boxF', x + q, y + 0.5, z + d / 2, 0.06, 0.8, 0.06); put('boxF', x, y + 0.9, z + d / 2, w, 0.06, 0.06); };
  const mast = (x, y, z, h) => { put('cylF', x, y + h / 2, z, 0.07, h, 0.07); put('warn', x, y + h, z, 0.16, 0.16, 0.16); if (R() < 0.6) put('dome', x + 0.3, y + h * 0.55, z, 0.55, 0.3, 0.55, 0, 0, -1.1); for (let q = 0.3; q < 0.9; q += 0.3) put('boxF', x, y + h * q, z, 0.9 - q * 0.6, 0.04, 0.04); };
  const tower = (x, y, z, h, s, furnace) => {
    const w = 1.2 * s;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put('boxF', x + sx * w, y + h / 2, z + sz * w, 0.2 * s, h, 0.2 * s);
    for (let q = 1.6 * s, i = 0; q < h; q += 3.4 * s, i++) { for (const sz of [-1, 1]) { put('boxF', x, y + q, z + sz * w, 2 * w, 0.14 * s, 0.14 * s); put('boxF', x, y + q + 1.7 * s, z + sz * w, 0.1 * s, 4.1 * s, 0.1 * s, 0, 0, (i % 2 ? 1 : -1) * 0.62); } for (const sx of [-1, 1]) put('boxF', x + sx * w, y + q, z, 0.14 * s, 0.14 * s, 2 * w); }
    put(furnace ? 'cylA' : 'cyl', x, y + h / 2, z, 0.5 * s, h, 0.5 * s);
    const levels = 1 + ((R() * 3) | 0);
    for (let i = 0; i < levels; i++) { const q = h * (0.25 + 0.6 * (i + R() * 0.6) / levels), dw = (3.4 + R() * 2.6) * s; deck(x, y + q, z, dw, 2.8 * s);
      const side = R() < 0.5 ? -1 : 1; put('box', x + side * dw * 0.22, y + q + 0.9 * s, z, dw * 0.38, 1.5 * s, 2.2 * s); put('boxF', x + side * dw * 0.22, y + q + 1.75 * s, z, dw * 0.42, 0.12, 2.4 * s);
      if (R() < 0.7) tank(x - side * dw * 0.26, y + q + 0.14, z + 0.3, 0.7 * s, 1.5 * s + R() * s); if (R() < 0.5) put('glow', x + side * dw * 0.22, y + q + 0.3, z + 1.12 * s, dw * 0.3, 0.07, 0.03); }
    if (furnace) { put('hot', x, y + h * 0.3, z + 0.52 * s, 0.5 * s, 0.9 * s, 0.05); put('cylF', x, y + h + 2 * s, z, 0.34 * s, 4 * s, 0.34 * s); put('tor', x, y + h + 3.4 * s, z, 0.4 * s, 0.4 * s, 0.6 * s, PI / 2); } else mast(x, y + h, z, 3 + R() * 5);
    if (R() < 0.55) cranes.push({ x, y: y + h * (0.5 + R() * 0.4), z, len: (5 + R() * 6) * s, s, ph: R() * 6 }); // a slewing crane, built per copy below
    if (R() < 0.5) lifts.push({ x: x + w + 0.45 * s, y0: y + 2, y1: y + h - 2, z: z + w + 0.3 * s, s, ph: R() * 6 });
    if (furnace) vents.push([x, y + h + 4 * s, z]); else if (R() < 0.45) vents.push([x + 1.2, y + h * (0.3 + R() * 0.5), z + 1]);
    if (!furnace && R() < 0.3) lights.push({ x, y: y + h + 0.6, z, ph: R() * 6 });
  };
  const pipeRun = (x, y, z, len, r) => { put('cylA', x, y, z, r, len, r, 0, 0, PI / 2); for (let q = -len / 2; q <= len / 2; q += 4) { put('tor', x + q, y, z, r * 1.25, r * 1.25, r * 2.5, 0, PI / 2); put('boxF', x + q, y - 4, z, 0.2, 8, 0.2); } if (R() < 0.6) { const fh = 6 + R() * 7; falls.push({ x: x + (R() - 0.5) * len * 0.6, y: y - fh / 2, z: z + 0.2, w: 0.7, h: fh, hot: 0 }); } if (R() < 0.5) vents.push([x + (R() - 0.5) * len * 0.5, y + 0.6, z]); };
  const rockMass = (x, y, z, s, up) => { const n = 3 + ((R() * 3) | 0); for (let i = 0; i < n; i++) { const r = s * (1 - i * 0.16) * (0.7 + R() * 0.5); put(i % 2 ? 'icoS' : 'ico', x + (R() - 0.5) * s * 1.1, y + up * i * s * 0.55, z + (R() - 0.5) * s * 0.6, r * (0.9 + R() * 0.5), r * (0.55 + R() * 0.5), r * 0.8, R() * 3, R() * 3, R()); } for (let i = 0; i < 4; i++) { const hh = s * (0.5 + R() * 1.2); put('coneR', x + (R() - 0.5) * s * 1.6, y + up * (n * s * 0.5 + hh * 0.2), z + (R() - 0.5) * s, 0.25 * s * (0.4 + R()), hh, 0.25 * s * (0.4 + R()), up < 0 ? PI : 0, R() * 3, (R() - 0.5) * 0.3); } };
  const mesa = (x, y, z, s) => { let r = s * (1.3 + R() * 0.6), yy = y; for (let i = 0; i < 5; i++) { const hh = s * (0.7 + R() * 0.9); put(i % 2 ? 'ico' : 'icoS', x + (R() - 0.5) * s * 0.5, yy + hh * 0.45, z + (R() - 0.5) * s * 0.4, r, hh * 0.75, r * (0.7 + R() * 0.3), (R() - 0.5) * 0.3, R() * 3, (R() - 0.5) * 0.3); if (R() < 0.6) put('icoS', x + (R() < 0.5 ? -1 : 1) * r * 0.8, yy + hh * 0.3, z + 0.5, r * 0.45, hh * 0.5, r * 0.4, R() * 3, R() * 3, R()); yy += hh * 0.8; r *= 0.74 + R() * 0.14; } put('icoS', x, yy, z, r * 1.2, s * 0.25, r, 0, R() * 3, 0); };
  const hulk = (x, y, z, s, wrecked) => { const len = (9 + R() * 14) * s, hh = (2 + R() * 3) * s, tilt = wrecked ? (R() - 0.5) * 1.5 : (R() - 0.5) * 0.14, c = Math.cos(tilt), sn = Math.sin(tilt), at = (dx, dy) => [x + dx * c - dy * sn, y + dx * sn + dy * c];
    put('box', x, y, z, len, hh, 3.5 * s, 0, 0, tilt); for (let q = -len / 2 + 0.6; q < len / 2; q += 1.5 * s) { const [ax, ay] = at(q, 0); put('boxF', ax, ay, z + 1.8 * s, 0.14 * s, hh * 1.04, 0.16, 0, 0, tilt); }
    { const [ax, ay] = at(0, hh * 0.52); put('boxF', ax, ay, z, len * 1.01, 0.16 * s, 3.7 * s, 0, 0, tilt); } { const [ax, ay] = at(-len * 0.3, hh * 0.5 + 1.1 * s); put('box', ax, ay, z, len * 0.2, 2.2 * s, 2.6 * s, 0, 0, tilt); const [bx, by] = at(-len * 0.3, hh * 0.5 + 2.6 * s); put('boxA', bx, by, z, len * 0.12, 0.9 * s, 2 * s, 0, 0, tilt); const [mx, my] = at(-len * 0.3, hh * 0.5 + 3 * s); if (!wrecked) mast(mx, my, z, 3 * s); }
    if (!wrecked) for (let q = -len * 0.12; q < len * 0.45; q += 1.25 * s) for (let r = 0; r < 1 + ((R() * 3) | 0); r++) { const [ax, ay] = at(q, hh * 0.5 + (0.5 + r) * 0.95 * s); put(R() < 0.4 ? 'boxA' : 'box', ax, ay, z + (R() - 0.5) * 1.6 * s, 1.1 * s, 0.9 * s, 1.5 * s, 0, 0, tilt); }
    else { for (let i = 0; i < 7; i++) { const [ax, ay] = at((R() - 0.5) * len, hh * (0.4 + R() * 0.6)); put('boxF', ax, ay, z + (R() - 0.5) * 3 * s, 0.14 * s, (1.5 + R() * 3) * s, 0.14 * s, R() * 0.6, 0, tilt + (R() - 0.5) * 1.2); } const [wx, wy] = at(len * 0.2, 0); put('warn', wx, wy, z + 1.9 * s, 0.14, 0.14, 0.14); }
    for (let i = 0; i < 3; i++) { const [ax, ay] = at((R() - 0.5) * len * 0.8, (R() - 0.5) * hh * 0.5); put('glow', ax, ay, z + 1.78 * s, 0.5 + R() * 1.6, 0.08, 0.03, 0, 0, tilt); } };
  const crystals = (x, y, z, s, up) => { const n = 5 + ((R() * 5) | 0); for (let i = 0; i < n; i++) { const hh = s * (1.2 + R() * 3.4) * (i ? 0.6 : 1), a = (R() - 0.5) * 1.1; put('oct', x + Math.sin(a) * hh * 0.3 * (i ? 1 : 0) + (R() - 0.5) * s, y + up * hh * 0.42, z + (R() - 0.5) * s, 0.22 * hh + 0.1, hh, 0.22 * hh + 0.1, (R() - 0.5) * 0.5, R() * 3, -a * up); } put('icoS', x, y - up * s * 0.3, z, s * 1.4, s * 0.6, s * 1.1, R(), R(), R()); if (R() < 0.6) put('gsph', x + (R() - 0.5) * s, y + up * s * (0.5 + R()), z + 0.6, 0.12, 0.12, 0.12); };
  const whale = (x, y, z, s) => { put('sph', x, y, z, 5 * s, 1.9 * s, 2.2 * s); put('coneS', x + 6.4 * s, y + 0.2 * s, z, 1.2 * s, 5 * s, 1.5 * s, 0, 0, -PI / 2); put('boxS', x + 8.9 * s, y + 0.3 * s, z, 1.5 * s, 0.14 * s, 4.4 * s, 0, 0.1, 0.15); for (const k of [1, -1]) put('boxS', x - 1 * s, y - 0.9 * s, z + k * 2.2 * s, 2.6 * s, 0.14 * s, 1.8 * s, k * 0.55, k * 0.3, 0.1); for (let i = 0; i < 7; i++) put('gsph', x - 3.4 * s + i * 1.05 * s, y + 0.25 * s + Math.sin(i * 1.3) * 0.3 * s, z + 2.1 * s, 0.26 * s, 0.07 * s, 0.07 * s); put('gsph', x - 4.3 * s, y + 0.5 * s, z + 1.2 * s, 0.1 * s, 0.1 * s, 0.1 * s); };
  const ribRing = (x, y, z, r, ry) => { put('torF', x, y, z, r, r * 0.9, 3.2, 0, ry, 0); for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2; put('boxF', x + Math.cos(a) * r * Math.cos(ry) * 0.2, y + Math.sin(a) * r * 0.9, z + Math.cos(a) * r * Math.sin(ry), 0.5, 2.4, 0.5, 0, 0, a + PI / 2); } };

  // ---- each stage kind lays its landmarks out along the loop, at three depths
  const n = Math.max(6, Math.round(16 * dens));
  for (let i = 0; i < n; i++) { const x = (i + R() * 0.8) * (L / n), band = i % 3, z = (band === 0 ? -27 : band === 1 ? -44 : -66) - R() * 14, s = 1 + R() * 0.8 + band * 0.25;
    if (kind === 'pylons') { tower(x, -16 - R() * 6, z, 26 + R() * 30, s); if (R() < 0.6) { const tx = x + 6 + R() * 3, dy = -4 + R() * 12; deck(tx, dy, z, 5 * s, 3 * s); put('boxF', tx, dy - 12, z, 0.3 * s, 24, 0.3 * s); for (let k = 0; k < 2; k++) tank(tx - 1.2 * s + k * 2.4 * s, dy + 0.14, z, 0.9 * s, 2.4 * s + R() * 2); } }
    else if (kind === 'works') { tower(x, -16 - R() * 6, z, 20 + R() * 26, s); pipeRun(x + 8, 2 + R() * 22, z - 2, 14 + R() * 12, 0.5 + R() * 0.5); if (R() < 0.5) tank(x - 6, -8 + R() * 4, z + 2, 2 * s, 7 * s); }
    else if (kind === 'foundry') { tower(x, -16 - R() * 4, z, 18 + R() * 22, s * 1.2, true); if (R() < 0.7) { const cx = x + 7; put('boxF', cx, 22, z, 0.16, 16, 0.16); put('cylA', cx, 13.2, z, 1.3, 1.6, 1.3); put('hot', cx, 14.05, z, 1.9, 0.12, 1.9); } if (R() < 0.6) falls.push({ x: x - 5, y: 2 + R() * 8, z: z - 1, w: 0.8, h: 14 + R() * 10, hot: 1 }); }
    else if (kind === 'canyon') { if (i % 3 === 0) lights.push({ x: x + 4, y: 34, z: z + 6, ph: R() * 6, down: 1 }); if (i % 2) mesa(x, -14 - R() * 4, z, 4 + R() * 3); else rockMass(x, 27 + R() * 5, z, 5 + R() * 4, -1); if (R() < 0.4) rockMass(x + 7, -9, z + 3, 3, 1); }
    else if (kind === 'eyewall') { rockMass(x, i % 2 ? 27 + R() * 5 : -9 - R() * 4, z, 5 + R() * 5, i % 2 ? -1 : 1); for (let k = 0; k < 3; k++) put('icoS', x + 4 + R() * 9, R() * 20 - 1, z + R() * 6, 0.5 + R() * 1.4, 0.4 + R(), 0.5 + R(), R() * 3, R() * 3, R() * 3); }
    else if (kind === 'deep') { const top = i % 2; rockMass(x, top ? 27 + R() * 4 : -9 - R() * 3, z, 5 + R() * 4, top ? -1 : 1); if (R() < 0.5) { put('cylR', x + 6, 9, z - 6, 2.2 + R(), 46, 2.2 + R()); put('icoS', x + 6, 9 + (R() - 0.5) * 14, z - 6, 3.4, 1.6, 3); } for (let k = 0; k < 4; k++) put('gsph', x + R() * 10, R() * 18, z + 2 + R() * 4, 0.1, 0.1, 0.1); for (let k = 0; k < 3; k++) put('coneR', x + R() * 9, 24 - R() * 3, z + 2, 0.12, 5 + R() * 6, 0.12, PI); }
    else if (kind === 'hauler') { const hy = R() * 34 - 8; hulk(x, hy, z - 14, s * 1.3, false); if (R() < 0.6) lights.push({ x: x - 3, y: hy + 5 * s, z: z - 14, ph: R() * 6 }); }
    else if (kind === 'graveyard') { hulk(x, R() * 34 - 8, z - 12, s, true); for (let k = 0; k < 4; k++) put('boxF', x + R() * 10, R() * 22 - 2, z + R() * 8, 0.4 + R() * 1.6, 0.1 + R() * 0.3, 0.3 + R(), R() * 3, R() * 3, R() * 3); }
    else if (kind === 'reef') { if (i % 3 === 0) lights.push({ x: x + 4, y: 34, z: z + 6, ph: R() * 6, down: 1 }); const top = i % 2; crystals(x, top ? 24 + R() * 4 : -5 - R() * 4, z, 2 + R() * 2.4, top ? -1 : 1); if (R() < 0.5) crystals(x + 5, R() * 18, z - 10, 1 + R(), R() < 0.5 ? 1 : -1); }
    else if (kind === 'core') { const top = i % 2; crystals(x, top ? 24 + R() * 4 : -5 - R() * 4, z, 2 + R() * 2, top ? -1 : 1); if (i % 3 === 0) ribRing(x, 9, z - 24, 17 + R() * 8, R() * 1.2); }
    else if (kind === 'throat') { if (i % 2 === 0) ribRing(x, 9, z * 0.4 - 6, 15 + R() * 6, PI / 2 - 0.5 + R()); else rockMass(x, i % 4 === 1 ? 26 : -8, z, 5, i % 4 === 1 ? -1 : 1); }
    else if (kind === 'herd') { if (i % 2 === 0) whales.push({ x, y: R() * 26 - 4, z: z - 12, s: 0.9 + R() * 0.9, ph: R() * 6 }); }
  }
  // ---- the moving things, one set per copy: slewing cranes, lifts, swimming whales, falls of water or metal, searchlights
  const fallMat = (c, sp) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide, uniforms: { t: TIME, c: { value: c }, sp: { value: sp } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec2 vUv; uniform float t, sp; uniform vec3 c; float h(float x){ return fract(sin(x * 91.7) * 43758.5); } void main(){ float col = floor(vUv.x * 9.0), k = h(col); float flow = fract(vUv.y * (2.0 + k * 2.0) + t * sp * (0.7 + k)); float a = (0.35 + 0.65 * smoothstep(0.0, 0.5, flow) * smoothstep(1.0, 0.5, flow)) * smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(1.0, 0.9, vUv.y) * smoothstep(0.0, 0.25, vUv.y); gl_FragColor = vec4(c * a, 1.0); }' });
  const beamMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide, uniforms: { c: { value: col(P.key).lerp(col(0xffffff), 0.4).multiplyScalar(dark ? 0.5 : 0.3) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec2 vUv; uniform vec3 c; void main(){ float w = 1.0 - abs(vUv.x * 2.0 - 1.0) / (0.12 + vUv.y * 0.88); float a = clamp(w, 0.0, 1.0) * pow(1.0 - vUv.y, 1.6) * smoothstep(0.0, 0.04, vUv.y); gl_FragColor = vec4(c * a, 1.0); }' });
  const water = fallMat(col(P.liq || P.glow).multiplyScalar(0.9), 1.3), metal = fallMat(col(0xff6a1a).multiplyScalar(2.2), 0.5), plane = new THREE.PlaneGeometry(1, 1), beamGeo = new THREE.PlaneGeometry(1, 1); beamGeo.translate(0, 0.5, 0);
  const mk = (par, geo, mat, px, py, pz, sx, sy, sz, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.scale.set(sx, sy, sz); m.rotation.z = rz; m.frustumCulled = false; par.add(m); return m; };
  const anim = [];
  const groups = [0, L].map((off) => { const g = new THREE.Group(); g.userData.off = off; for (const k in lists) { const a = lists[k]; if (!a.length) continue; const im = new THREE.InstancedMesh(defs[k][0], defs[k][1], a.length); a.forEach((m, i) => im.setMatrixAt(i, m)); im.frustumCulled = false; g.add(im); }
    for (const c of cranes) { const j = new THREE.Group(); j.position.set(c.x, c.y, c.z); mk(j, G.box, frame, c.len * 0.5, 0, 0, c.len, 0.24 * c.s, 0.24 * c.s); mk(j, G.box, frame, c.len * 0.5, c.len * 0.07, 0, c.len * 1.02, 0.07, 0.07, 0.14); mk(j, G.box, frame, -c.len * 0.16, 0, 0, c.len * 0.32, 0.3 * c.s, 0.3 * c.s); mk(j, G.box, accent, -c.len * 0.3, -0.3 * c.s, 0, 0.9 * c.s, 0.8 * c.s, 0.9 * c.s); mk(j, G.box, struct, 0, 0.5 * c.s, 0, 1.1 * c.s, 0.9 * c.s, 1.1 * c.s); const cab = mk(j, G.box, frame, c.len * 0.94, -1.8, 0, 0.05, 3.6, 0.05), load = mk(j, G.box, accent, c.len * 0.94, -3.8, 0, 0.7, 0.6, 0.7); g.add(j); anim.push({ k: 0, o: j, ph: c.ph, cab, load }); }
    for (const l of lifts) { const o = new THREE.Group(); o.position.set(l.x, l.y0, l.z); mk(o, G.box, accent, 0, 0, 0, 0.7 * l.s, 0.9 * l.s, 0.7 * l.s); mk(o, G.box, glow, 0, 0.1 * l.s, 0.36 * l.s, 0.5 * l.s, 0.12 * l.s, 0.02); g.add(o); mk(g, G.box, frame, l.x, (l.y0 + l.y1) / 2, l.z - 0.2 * l.s, 0.06, l.y1 - l.y0, 0.06); anim.push({ k: 1, o, y0: l.y0, y1: l.y1, ph: l.ph }); }
    for (const f of falls) mk(g, plane, f.hot ? metal : water, f.x, f.y, f.z, f.w, f.h, 1);
    for (const b of lights) { const o = mk(g, beamGeo, beamMat, b.x, b.y, b.z + 0.5, b.down ? 13 : 7, b.down ? 52 : 46, 1); if (!b.down) mk(g, G.sph, glow, b.x, b.y, b.z + 0.5, 0.3, 0.3, 0.3); anim.push({ k: 3, o, ph: b.ph, base: b.down ? PI + 0.35 : 0, amp: b.down ? 0.08 : 0.9 }); }
    for (const w of whales) { const o = new THREE.Group(), s2 = w.s; o.position.set(w.x, w.y, w.z); mk(o, G.sph, skin, 0, 0, 0, 5 * s2, 1.9 * s2, 2.2 * s2); const tail = new THREE.Group(); tail.position.set(4.2 * s2, 0.15 * s2, 0); o.add(tail); mk(tail, G.cone, skin, 2.3 * s2, 0, 0, 1.2 * s2, 5 * s2, 1.5 * s2, -PI / 2); const fl = mk(tail, G.box, skin, 4.8 * s2, 0.1 * s2, 0, 1.5 * s2, 0.14 * s2, 4.4 * s2); fl.rotation.y = 0.1;
      const fins = [1, -1].map((k) => { const f = mk(o, G.box, skin, -1 * s2, -0.9 * s2, k * 2.2 * s2, 2.6 * s2, 0.14 * s2, 1.8 * s2); f.rotation.set(k * 0.55, k * 0.3, 0.1); f.userData.k = k; return f; }); for (let i = 0; i < 7; i++) mk(o, G.sph, glow, -3.4 * s2 + i * 1.05 * s2, 0.25 * s2 + Math.sin(i * 1.3) * 0.3 * s2, 2.1 * s2, 0.26 * s2, 0.07 * s2, 0.07 * s2); mk(o, G.sph, glow, -4.3 * s2, 0.5 * s2, 1.2 * s2, 0.1 * s2, 0.1 * s2, 0.1 * s2);
      g.add(o); anim.push({ k: 2, o, tail, fins, x0: w.x, y0: w.y, ph: w.ph, sp: 0.5 + (w.ph % 1) * 0.5 }); }
    return g; });
  return { groups, mats: [struct, frame, accent, rock, cry, skin, glow, warn, hot, water, metal, beamMat], L, anim, vents, warn, warnC: col(P.rim).multiplyScalar(2.2), parts: Object.values(lists).reduce((s, a) => s + a.length, 0) };
}
