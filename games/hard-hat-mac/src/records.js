// Per-shift records on this device (best time, medal, best-run ghost) and the global shift-time boards.
import * as THREE from 'three';
import { Puppet } from './characters.js';

const KEY = 'hhm3d-records-v1';
export const SCORE_BASE = 'https://game-scores.jez237.workers.dev/scores/';
export const TIME_BASE = 1e6; // board score = TIME_BASE - milliseconds, so faster times rank higher on a high-score board
export const MEDAL_NAME = ['COMPLETE', 'BRONZE', 'SILVER', 'GOLD'];
export const MEDAL_ICON = ['✔', '🥉', '🥈', '🥇'];
export const STAR_ICON = ['⏱', '❤', '★'];
export const STAR_TIP = ['Beat the par time', 'No injuries', 'Every bonus item'];

export function fmtTime(s) {
  if (s == null || !isFinite(s)) return '—';
  const m = Math.floor(s / 60), r = s - m * 60;
  return m + ':' + r.toFixed(2).padStart(5, '0');
}
export const timeToScore = s => Math.max(1, TIME_BASE - Math.round(s * 1000));
export const scoreToTime = sc => (TIME_BASE - sc) / 1000;

export class Records {
  constructor() { try { this.d = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { this.d = {}; } }
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch {} }
  get(id) { return Object.assign({ best: null, medal: -1, starsEver: [false, false, false], ghost: null }, this.d[id]); }
  // A finished shift: three stars (par time, no deaths, every bonus item); the medal is the star count of the best run.
  finish(id, par, run) {
    const r = this.get(id), stars = [run.secs <= par, run.deaths === 0, run.bonus];
    const n = stars.filter(Boolean).length;
    const out = { stars, medal: n, newMedal: n > r.medal, newBest: r.best == null || run.secs < r.best, prevBest: r.best };
    if (n > r.medal) r.medal = n;
    r.starsEver = r.starsEver.map((v, i) => v || stars[i]);
    if (out.newBest) { r.best = run.secs; if (run.ghost) r.ghost = run.ghost; }
    this.d[id] = r; this.save();
    return out;
  }
}

// ---- ghost: Mac's pose sampled 15 times a second, packed as int16 and stored as base64
const RATE = 15, MODES = ['idle', 'walk', 'air', 'climb', 'rivet', 'flat', 'hurt', 'cheer', 'crank'], CARRY = [null, 'girder', 'crate', 'topbeam'];
export class GhostRecorder {
  constructor() { this.a = []; this.t = 0; }
  add(dt, p) {
    this.t += dt;
    while (this.t >= 1 / RATE && this.a.length < RATE * 600 * 5) {
      this.t -= 1 / RATE;
      const b = p.body, mode = p.dead ? (p.deathMode === 'flat' ? 'flat' : 'hurt') : p.state === 'climb' ? 'climb' : p.state === 'rivet' ? 'rivet' : p.state === 'crank' ? 'crank' : !b.onGround ? 'air' : Math.hypot(b.vx, b.vz) > .4 ? 'walk' : 'idle';
      let yaw = p.yaw % (Math.PI * 2); if (yaw > Math.PI) yaw -= Math.PI * 2; if (yaw < -Math.PI) yaw += Math.PI * 2;
      const fl = MODES.indexOf(mode) | (Math.max(0, CARRY.indexOf(p.carry ? p.carry.kind : null)) << 4) | ((p.dead && p.deathMode === 'gone') ? 128 : 0);
      this.a.push(Math.round(b.x * 100), Math.round(b.y * 100), Math.round(b.z * 100), Math.round(yaw * 1000), fl);
    }
  }
  encode() {
    const u = new Uint8Array(new Int16Array(this.a).buffer); let s = '';
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }
}
function decode(b64) {
  try { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new Int16Array(u.buffer); } catch { return null; }
}

export class Ghost {
  constructor(scene) {
    this.rig = new Puppet('mac');
    const mat = new THREE.MeshBasicMaterial({ color: 0x8fe6ff, transparent: true, opacity: .3, depthWrite: false });
    this.rig.root.traverse(o => { if (o.isMesh) { o.material = mat; o.castShadow = false; o.renderOrder = 3; } });
    this.root = this.rig.root; this.root.visible = false; scene.add(this.root);
    this.data = null;
  }
  load(b64) { this.data = b64 ? decode(b64) : null; this.root.visible = false; }
  update(t, dt) {
    const D = this.data; if (!D) { this.root.visible = false; return; }
    const n = D.length / 5, f = t * RATE, i = Math.floor(f), k = f - i;
    if (i >= n - 1) { this.root.visible = false; return; }
    const a = i * 5, b = a + 5, lerp = (j) => (D[a + j] + (D[b + j] - D[a + j]) * k) / 100;
    const jump = Math.hypot(D[b] - D[a], D[b + 2] - D[a + 2]) > 400; // respawn teleport: don't slide across the map
    const x = jump ? D[a] / 100 : lerp(0), y = jump ? D[a + 1] / 100 : lerp(1), z = jump ? D[a + 2] / 100 : lerp(2);
    let dyaw = (D[b + 3] - D[a + 3]) / 1000; if (dyaw > Math.PI) dyaw -= Math.PI * 2; if (dyaw < -Math.PI) dyaw += Math.PI * 2;
    this.root.position.set(x, y, z); this.root.rotation.y = D[a + 3] / 1000 + dyaw * k;
    const fl = D[a + 4], speed = Math.hypot(D[b] - D[a], D[b + 2] - D[a + 2]) / 100 * RATE / 5.4;
    this.root.visible = !(fl & 128);
    this.rig.update(dt, { mode: MODES[fl & 15] || 'idle', speed, vy: (D[b + 1] - D[a + 1]) / 100 * RATE, carry: CARRY[(fl >> 4) & 7], climbPhase: t * 9 });
  }
  hide() { this.data = null; this.root.visible = false; }
}
