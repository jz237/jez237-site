// Smoke screens from turret dischargers. Grenades arc out in a fan and bloom
// into billowing clouds of large sprites (not capped points, so a screen
// right beside the tank still reads as a wall). Clouds are line-of-sight
// blockers: blocks() is a segment-vs-sphere test that the enemy AI, pillboxes
// and infantry consult before firing.

import * as THREE from 'three';
import { getHeight } from './terrain.js?v=polish2';
import { SMOKE } from './config.js?v=polish2';

const SPRITES_PER_CLOUD = 7;
const MAX_CLOUDS = 14;
const FLIGHT = 0.55;

function puffTexture() {
  const s = 128, cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  let seed = 4051;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  // overlapping soft lobes, lighter on top: reads as a lit billow
  for (let i = 0; i < 22; i++) {
    const a = rng() * Math.PI * 2, r = rng() * s * 0.2;
    const x = s / 2 + Math.cos(a) * r, y = s / 2 + Math.sin(a) * r * 0.8;
    const rad = s * (0.14 + rng() * 0.16);
    const g = ctx.createRadialGradient(x, y - rad * 0.25, 0, x, y, rad);
    const lit = 225 + (y < s / 2 ? 25 : 0);
    g.addColorStop(0, `rgba(${lit},${lit},${lit - 6},0.5)`);
    g.addColorStop(0.6, `rgba(196,198,192,0.28)`);
    g.addColorStop(1, 'rgba(180,182,176,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class SmokeScreens {
  constructor(scene) {
    this.scene = scene;
    this.clouds = [];
    this.pending = [];
    const map = puffTexture();
    this.pool = [];
    for (let i = 0; i < MAX_CLOUDS * SPRITES_PER_CLOUD; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map, transparent: true, depthWrite: false, opacity: 0, color: 0xbfc3bb,
      }));
      sp.visible = false;
      scene.add(sp);
      this.pool.push(sp);
    }
    // grenade bodies in flight
    const gGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.22, 6);
    gGeo.rotateX(Math.PI / 2);
    const gMat = new THREE.MeshStandardMaterial({ color: 0x3d4434, roughness: 0.8 });
    this.grenades = [];
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(gGeo, gMat);
      m.visible = false;
      scene.add(m);
      this.grenades.push({ mesh: m, t: 1, from: new THREE.Vector3(), to: new THREE.Vector3() });
    }
    this.gHead = 0;
  }

  // fan of grenades from `origin` toward `yaw` (world, 0 = +z)
  deploy(origin, yaw, { grenades = SMOKE.grenades, spread = SMOKE.spread, range = SMOKE.range } = {}) {
    for (let i = 0; i < grenades; i++) {
      const a = yaw + (grenades > 1 ? (i / (grenades - 1) - 0.5) * spread : 0);
      const r = range * (0.85 + Math.random() * 0.25);
      const x = origin.x + Math.sin(a) * r, z = origin.z + Math.cos(a) * r;
      const g = this.grenades[this.gHead++ % this.grenades.length];
      g.t = 0;
      g.from.copy(origin);
      g.to.set(x, getHeight(x, z) + 0.4, z);
      g.mesh.visible = true;
      this.pending.push({ at: FLIGHT + i * 0.05, x, z });
    }
  }

  spawnCloud(x, z) {
    if (this.clouds.length >= MAX_CLOUDS) this.retire(this.clouds.shift());
    const sprites = [];
    for (let k = 0; k < SPRITES_PER_CLOUD; k++) {
      const sp = this.pool.pop();
      if (!sp) break;
      sp.visible = true;
      sp.material.rotation = Math.random() * Math.PI * 2;
      const shade = 0.82 + Math.random() * 0.14;
      sp.material.color.setRGB(0.75 * shade, 0.765 * shade, 0.735 * shade);
      sprites.push({
        sp, ox: (Math.random() - 0.5) * 3.4, oz: (Math.random() - 0.5) * 3.4,
        oy: 1.2 + (k / SPRITES_PER_CLOUD) * 4.2 + Math.random() * 0.8, size: 6 + Math.random() * 3.2, spin: (Math.random() - 0.5) * 0.12,
      });
    }
    this.clouds.push({ x, z, y: getHeight(x, z), age: 0, life: SMOKE.life * (0.9 + Math.random() * 0.2), sprites });
  }

  retire(c) {
    for (const s of c.sprites) { s.sp.visible = false; s.sp.material.opacity = 0; this.pool.push(s.sp); }
  }

  // 0..1 blocking strength of a cloud (grows in, thins out at the end)
  density(c) {
    const grow = Math.min(1, c.age / 1.1);
    const fade = 1 - THREE.MathUtils.smoothstep(c.age, c.life - 3, c.life);
    return grow * fade;
  }

  // does the segment a→b pass through a cloud dense enough to hide a tank?
  blocks(ax, ay, az, bx, by, bz) {
    if (!this.clouds.length) return false;
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len2 = dx * dx + dy * dy + dz * dz || 1;
    for (const c of this.clouds) {
      const d = this.density(c);
      if (d < 0.45) continue;
      const r = SMOKE.radius * d, cy = c.y + 2;
      let t = ((c.x - ax) * dx + (cy - ay) * dy + (c.z - az) * dz) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = ax + dx * t - c.x, py = ay + dy * t - cy, pz = az + dz * t - c.z;
      if (px * px + py * py * 0.5 + pz * pz < r * r) return true;
    }
    return false;
  }

  update(dt) {
    for (const g of this.grenades) {
      if (!g.mesh.visible) continue;
      g.t += dt / FLIGHT;
      if (g.t >= 1) { g.mesh.visible = false; continue; }
      const t = g.t;
      g.mesh.position.lerpVectors(g.from, g.to, t);
      g.mesh.position.y += Math.sin(t * Math.PI) * 3.2;
      g.mesh.rotation.x += dt * 14;
    }
    for (let i = this.pending.length - 1; i >= 0; i--) {
      const p = this.pending[i];
      p.at -= dt;
      if (p.at <= 0) { this.spawnCloud(p.x, p.z); this.pending.splice(i, 1); }
    }
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const c = this.clouds[i];
      c.age += dt;
      if (c.age >= c.life) { this.retire(c); this.clouds.splice(i, 1); continue; }
      const bloom = 1 - Math.pow(1 - Math.min(1, c.age / 1.4), 3);
      const fade = 1 - THREE.MathUtils.smoothstep(c.age, c.life - 3, c.life);
      const drift = c.age * 0.35; // light breeze
      for (const s of c.sprites) {
        const size = s.size * (0.3 + bloom * 0.7) * (1 + c.age * 0.025);
        s.sp.scale.set(size, size, 1);
        s.sp.position.set(c.x + s.ox * (0.4 + bloom * 0.6) + drift, c.y + s.oy * (0.5 + bloom * 0.5) + c.age * 0.05, c.z + s.oz * (0.4 + bloom * 0.6));
        s.sp.material.rotation += s.spin * dt;
        s.sp.material.opacity = 0.92 * Math.min(1, c.age * 4) * fade;
      }
    }
  }

  clear() {
    for (const c of this.clouds) this.retire(c);
    this.clouds.length = 0;
    this.pending.length = 0;
    for (const g of this.grenades) g.mesh.visible = false;
  }
}
