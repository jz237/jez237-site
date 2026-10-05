import * as THREE from 'three';
import { RNG } from '../core/rng.js';
import { clamp, smooth } from '../core/ease.js';

// Clockwork fireflies for the night garden: tiny brass beetles with a lamp in
// the abdomen, drifting in loose swarms over the beds, the fountain's water,
// the skep and the rose arch. They blink in slow waves that roll across each
// swarm and keep to their swarms: APX-9 passing makes the nearest glow
// brighter and drift aside, and a boost through scatters them. Each swarm
// also lights the leaves under it through the light field (night.js), and the
// ones by APX-9 light the bee.
//
// Drawn as one point sprite each (an HDR core and a soft halo: the bloom pass
// does the rest); the nearest few also get a little brass body.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;

// [x, y, z, radius, height, weight]
const SWARMS = [
  [-60, 20, -95, 16, 9, 1.2], [-150, 22, -40, 15, 9, 1], [-30, 18, -230, 14, 8, 1], [-120, 26, -330, 16, 10, 1],
  [-60, 22, -470, 15, 9, 1], [-170, 24, -600, 16, 9, 1], [-60, 20, 120, 14, 8, 0.9], [-190, 22, 150, 13, 8, 0.8],
  [150, 20, -150, 16, 9, 1.2], [220, 24, -60, 15, 9, 1], [130, 22, -330, 14, 9, 1], [200, 26, -480, 16, 10, 1],
  [150, 22, -650, 15, 9, 0.9], [200, 20, 100, 14, 8, 0.9],
  [30, 18, -545, 14, 6, 1], [110, 18, -575, 14, 6, 1], [70, 15, -560, 18, 4, 1.1], // over the fountain's water
  [40, 15, 12, 10, 6, 0.7], // between the skep and the path
  [70, 44, -250, 12, 10, 0.7], // under the rose arch
];

export class Fireflies {
  constructor(quality) {
    this.low = quality.tier === 'low';
    const n = this.low ? 170 : quality.tier === 'med' ? 340 : 520;
    const rng = new RNG('fireflies');
    const swarms = (this.low ? SWARMS.filter((_, i) => i % 3 !== 2) : SWARMS).map(([x, y, z, r, h, w]) => ({ c: V(x, y, z), r, h, w, ph: rng.range(0, TAU), glow: 0, pos: V(x, y, z), near: 0 }));
    this.swarms = swarms;
    const wsum = swarms.reduce((a, s) => a + s.w, 0);
    this.flies = [];
    let si = 0, acc = 0;
    for (let i = 0; i < n; i++) {
      while (si < swarms.length - 1 && i >= ((acc + swarms[si].w) / wsum) * n) { acc += swarms[si].w; si++; }
      const s = swarms[si];
      const a = rng.range(0, TAU), rr = Math.sqrt(rng.float()) * s.r;
      this.flies.push({
        s, o: V(Math.cos(a) * rr, rng.range(-s.h, s.h) * 0.6, Math.sin(a) * rr),
        f: [rng.range(0.13, 0.32), rng.range(0.1, 0.25), rng.range(0.12, 0.3)],
        p: [rng.range(0, TAU), rng.range(0, TAU), rng.range(0, TAU)],
        amp: rng.range(2.2, 5.5),
        ph: rng.range(0, TAU), wv: rng.range(0.75, 1.15), flick: rng.range(0, TAU),
        curious: rng.chance(0.55), orbit: rng.range(4.5, 8.5), orbA: rng.range(0, TAU), orbW: rng.range(0.6, 1.2) * (rng.chance(0.5) ? 1 : -1),
        r: V(), v: V(), pos: V(), glow: 0, excite: 0,
      });
    }
    this.n = n;
    // point sprites: position + glow
    const geo = new THREE.BufferGeometry();
    this.posA = new Float32Array(n * 3);
    this.glowA = new Float32Array(n);
    geo.setAttribute('position', new THREE.BufferAttribute(this.posA, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('glow', new THREE.BufferAttribute(this.glowA, 1).setUsage(THREE.DynamicDrawUsage));
    this.u = { uPixel: { value: 1 }, uVis: { value: 0 }, uScale: { value: 600 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float glow; uniform float uPixel, uVis, uScale; varying float vG; varying float vFar;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float d = -mv.z;
          vG = glow * uVis;
          vFar = exp(-d * 0.0016);
          // a halo about 1.8 units across at full glow, never smaller than a few pixels
          gl_PointSize = clamp((0.55 + glow * 0.75) * uScale * uPixel / max(d, 0.5), 2.5 * uPixel, 72.0 * uPixel);
          if (vG < 0.002) gl_PointSize = 0.0;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vG; varying float vFar;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float r2 = dot(c, c) * 4.0;
          float core = exp(-r2 * 26.0);
          float halo = exp(-r2 * 4.0) * (1.0 - smoothstep(0.6, 1.0, r2));
          vec3 col = vec3(1.0, 0.96, 0.5) * core * 6.0 + vec3(0.5, 0.9, 0.18) * halo * 0.5;
          gl_FragColor = vec4(col * vG * mix(0.5, 1.0, vFar), 1.0);
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 7;
    this.group = new THREE.Group();
    this.group.name = 'fireflies';
    this.group.add(this.points);
    this.group.visible = false;
    this.t = 0;
    this._d = V();
  }

  // little brass bodies for the nearest few (lit by the light field like everything else)
  buildBodies(mat) {
    if (this.low) return;
    const body = new THREE.SphereGeometry(0.12, 8, 6);
    body.scale(1, 0.85, 2.0);
    body.translate(0, 0, 0.08);
    const wingL = new THREE.PlaneGeometry(0.3, 0.12);
    wingL.translate(0.18, 0.08, 0.02);
    wingL.rotateZ(0.25);
    const wingR = wingL.clone();
    wingR.scale(-1, 1, 1);
    const g = mergeSimple([body, wingL, wingR]);
    this.bodyMax = 48;
    this.bodies = new THREE.InstancedMesh(g, mat.brassAged, this.bodyMax);
    const lamp = new THREE.SphereGeometry(0.13, 10, 8);
    lamp.scale(1, 0.95, 1.5);
    lamp.translate(0, -0.01, -0.24);
    this.lamps = new THREE.InstancedMesh(lamp, new THREE.MeshBasicMaterial({ color: '#ffffff' }), this.bodyMax);
    for (const m of [this.bodies, this.lamps]) { m.count = 0; m.frustumCulled = false; m.castShadow = false; this.group.add(m); }
    this.lamps.setColorAt(0, new THREE.Color(0, 0, 0));
  }

  // vis: how far into the night (0 hides them); bee: { pos, vel, speed, boost }
  update(dt, vis, bee, camera, pixelRatio) {
    this.group.visible = vis > 0.001;
    if (!this.group.visible) return;
    this.t += dt;
    const t = this.t;
    this.u.uVis.value = vis;
    this.u.uPixel.value = pixelRatio;
    this.u.uScale.value = this._scale(camera);
    const bp = bee?.pos, boost = bee?.boost ?? 0, speed = bee?.speed ?? 0;
    const d = this._d;
    for (const s of this.swarms) {
      // each swarm wanders slowly round its home
      s.pos.set(s.c.x + Math.sin(t * 0.071 + s.ph) * 5, s.c.y + Math.sin(t * 0.053 + s.ph * 2) * 2, s.c.z + Math.cos(t * 0.064 + s.ph) * 5);
      s.glow = 0;
      s.near = 0;
      s.cnt = 0;
    }
    const k = 3.2, c = 2.6;
    const step = Math.min(dt, 1 / 30);
    let bx = 0, by = 0, bz = 0, bg = 0;
    for (let i = 0; i < this.n; i++) {
      const f = this.flies[i];
      const s = f.s;
      // drift: a slow Lissajous wander about its place in the swarm
      const px = s.pos.x + f.o.x + Math.sin(t * f.f[0] + f.p[0]) * f.amp;
      const py = s.pos.y + f.o.y + Math.sin(t * f.f[1] + f.p[1]) * f.amp * 0.45;
      const pz = s.pos.z + f.o.z + Math.cos(t * f.f[2] + f.p[2]) * f.amp;
      // reaction to APX-9: a displacement on a damped spring
      let fx = 0, fy = 0, fz = 0, ex = 0;
      if (bp) {
        d.set(px + f.r.x - bp.x, py + f.r.y - bp.y, pz + f.r.z - bp.z);
        const dist = d.length();
        if (dist < 30 && dist > 1e-3) {
          d.multiplyScalar(1 / dist);
          if (boost > 0.35 && speed > 14 && dist < 22) {
            // scatter: a burst away from the rushing bee
            const kk = (1 - dist / 22) * 90 * boost;
            fx += d.x * kk; fy += (d.y + 0.4) * kk; fz += d.z * kk;
            f.excite = Math.min(1.5, f.excite + dt * 3);
          } else if (f.curious) {
            // the bee going by: the curious ones brighten (they don't follow it)
            ex = 1 - dist / 30;
          }
          // and every one drifts aside to let it through
          if (dist < 7) { const kk = (7 - dist) * 6; fx += d.x * kk; fy += d.y * kk; fz += d.z * kk; }
        }
      }
      // the spring (stiffer home pull when nothing is acting)
      f.v.x += (fx - k * f.r.x - c * f.v.x) * step;
      f.v.y += (fy - k * f.r.y - c * f.v.y) * step;
      f.v.z += (fz - k * f.r.z - c * f.v.z) * step;
      f.r.addScaledVector(f.v, step);
      f.pos.set(px + f.r.x, Math.max(1.5, py + f.r.y), pz + f.r.z);
      f.excite += (ex - f.excite) * (1 - Math.exp(-dt * 1.5));
      // blinking in slow waves that roll across the swarm, each its own beat
      const wave = 0.5 + 0.5 * Math.sin(t * 0.95 * f.wv - (f.pos.x * 0.055 + f.pos.z * 0.04) + f.ph * 0.35);
      const flick = 0.75 + 0.25 * Math.sin(t * 7.3 + f.flick);
      let g = (0.06 + 0.94 * smooth(clamp((wave - 0.42) / 0.5))) * flick;
      g = Math.min(1.6, g + f.excite * 0.55);
      f.glow = g;
      const o = i * 3;
      this.posA[o] = f.pos.x; this.posA[o + 1] = f.pos.y; this.posA[o + 2] = f.pos.z;
      this.glowA[i] = g;
      s.glow += g;
      s.cnt++;
      if (bp && f.excite > 0.2) { bx += f.pos.x * g; by += f.pos.y * g; bz += f.pos.z * g; bg += g; }
    }
    for (const s of this.swarms) s.glow /= Math.max(1, s.cnt);
    this.beeGlow = bg;
    if (bg > 0) (this.beeC ||= V()).set(bx / bg, by / bg, bz / bg);
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.glow.needsUpdate = true;
    this._bodies(camera, vis);
  }

  // screen scale: pixels per world unit at distance 1
  _scale(camera) { return (0.5 * window.innerHeight) / Math.tan((camera.fov * Math.PI) / 360); }

  _bodies(camera, vis) {
    if (!this.bodies) return;
    const cp = camera.position;
    const near = [];
    for (const f of this.flies) {
      const d2 = f.pos.distanceToSquared(cp);
      if (d2 < 32 * 32) near.push([d2, f]);
    }
    near.sort((a, b) => a[0] - b[0]);
    const m4 = this._m4 || (this._m4 = new THREE.Matrix4()), q = this._q || (this._q = new THREE.Quaternion()), one = V(1, 1, 1), col = this._c || (this._c = new THREE.Color());
    const n = Math.min(this.bodyMax, near.length);
    for (let i = 0; i < n; i++) {
      const f = near[i][1];
      const a = Math.atan2(f.v.x + Math.cos(f.p[0] + this.t * f.f[0]), f.v.z + Math.sin(f.p[2] + this.t * f.f[2]));
      q.setFromAxisAngle(_Y, a);
      m4.compose(f.pos, q, one);
      this.bodies.setMatrixAt(i, m4);
      this.lamps.setMatrixAt(i, m4);
      const g = f.glow * vis * 3;
      this.lamps.setColorAt(i, col.setRGB(g, g, g * 0.55));
    }
    this.bodies.count = this.lamps.count = n;
    this.bodies.instanceMatrix.needsUpdate = this.lamps.instanceMatrix.needsUpdate = true;
    if (this.lamps.instanceColor) this.lamps.instanceColor.needsUpdate = true;
  }
}

const _Y = V(0, 1, 0);

function mergeSimple(geos) {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0;
  for (const g of parts) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  let o = 0;
  for (const g of parts) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    o += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return out;
}
