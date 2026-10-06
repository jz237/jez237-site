import * as THREE from 'three';
import { RNG } from '../core/rng.js';
import { clamp, smooth } from '../core/ease.js';
import { L } from '../world/layout.js';

// Clockwork fireflies for the night garden: tiny brass beetles with a lamp in
// the abdomen, thousands of them, drifting in loose swarms over the beds, the
// fountain's water, the skep, the rose arch, along the promenade and all
// through the great tree's crown. They blink in slow waves that roll across
// each swarm and keep to their swarms: APX-9 passing makes the nearest glow
// brighter and drift aside, and a boost through scatters them. Each swarm
// also lights the leaves under it through the light field (night.js), and the
// ones by APX-9 light the bee.
//
// The drift, the blinking and the reaction to the bee are worked out on the
// GPU, per point, from fixed per-firefly parameters and a handful of
// uniforms (the swarms' wandering centres, the bee, the clock), so their
// number costs almost nothing on the main thread. Each is one point sprite
// (an HDR core and a soft halo: the bloom pass does the rest); the nearest
// few also get a little brass body.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const MAX_SWARMS = 80;

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

const lerpZ = (k) => L.house.z0 - 60 - k * (L.house.z0 - L.house.z1 - 140);
function moreSwarms(rng) {
  const out = [];
  const H = L.house;
  // over the beds on both sides, the length of the house
  for (let i = 0; i < 22; i++) {
    const left = i % 2 === 0;
    const x = left ? rng.range(H.x0 + 30, L.pathX[0] - 18) : rng.range(L.pathX[1] + 18, H.x1 - 30);
    const z = rng.range(H.z1 + 60, H.z0 - 40);
    out.push([x, rng.range(16, 34), z, rng.range(13, 20), rng.range(7, 12), rng.range(0.8, 1.2)]);
  }
  // along the promenade, under the arches
  for (let z = 160; z > -480; z -= 95) out.push([70, rng.range(30, 60), z + rng.range(-20, 20), 14, 10, 0.9]);
  // all through the great tree's crown, like lights strung in it
  const T = L.tree;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU, r = rng.range(40, 150);
    out.push([T.x + Math.cos(a) * r * 1.3, rng.range(130, 330), T.z + Math.sin(a) * r * 0.55, rng.range(18, 28), rng.range(12, 20), 1.6]);
  }
  out.push([T.x, 40, T.z + 30, 26, 14, 1.2]); // round its roots
  // and a loose scattering through the whole house, high and low
  for (let i = 0; i < 9; i++) out.push([rng.range(H.x0 + 60, H.x1 - 60), rng.range(50, 120), lerpZ(i / 8), 75, 45, 2.2]);
  return out;
}

export class Fireflies {
  constructor(quality) {
    this.low = quality.tier === 'low';
    const n = this.low ? 1200 : quality.tier === 'med' ? 2400 : 4000;
    const rng = new RNG('fireflies');
    const list = [...SWARMS, ...moreSwarms(rng)];
    const swarms = (this.low ? list.filter((_, i) => i % 4 !== 3) : list).slice(0, MAX_SWARMS).map(([x, y, z, r, h, w]) => ({ c: V(x, y, z), r, h, w, ph: rng.range(0, TAU), glow: 0, pos: V(x, y, z), near: 0, cnt: 0 }));
    this.swarms = swarms;
    const wsum = swarms.reduce((a, s) => a + s.w, 0);
    // per firefly, fixed: its swarm, its place in it, its wander, its blink
    const geo = new THREE.BufferGeometry();
    const P = new Float32Array(n * 3), S = new Float32Array(n), F = new Float32Array(n * 4), Ph = new Float32Array(n * 4), Bl = new Float32Array(n * 4);
    this.flies = [];
    let si = 0, acc = 0;
    for (let i = 0; i < n; i++) {
      while (si < swarms.length - 1 && i >= ((acc + swarms[si].w) / wsum) * n) { acc += swarms[si].w; si++; }
      const s = swarms[si];
      s.cnt++;
      const a = rng.range(0, TAU), rr = Math.sqrt(rng.float()) * s.r;
      const o = V(Math.cos(a) * rr, rng.range(-s.h, s.h) * 0.6, Math.sin(a) * rr);
      const f = [rng.range(0.13, 0.32), rng.range(0.1, 0.25), rng.range(0.12, 0.3)], amp = rng.range(2.2, 5.5);
      const p = [rng.range(0, TAU), rng.range(0, TAU), rng.range(0, TAU)];
      const ph = rng.range(0, TAU), wv = rng.range(0.75, 1.15), flick = rng.range(0, TAU), curious = rng.chance(0.55) ? 1 : 0;
      P.set([o.x, o.y, o.z], i * 3);
      S[i] = si;
      F.set([...f, amp], i * 4);
      Ph.set([...p, ph], i * 4);
      Bl.set([wv, flick, curious, 0], i * 4);
      this.flies.push({ si, o, f, p, amp, ph, wv, flick, pos: V(), glow: 0 });
    }
    this.n = n;
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
    geo.setAttribute('aSwarm', new THREE.BufferAttribute(S, 1));
    geo.setAttribute('aWander', new THREE.BufferAttribute(F, 4));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(Ph, 4));
    geo.setAttribute('aBlink', new THREE.BufferAttribute(Bl, 4));
    geo.boundingSphere = new THREE.Sphere(V(25, 100, -300), 2000);
    this.u = {
      uPixel: { value: 1 }, uVis: { value: 0 }, uScale: { value: 600 }, uT: { value: 0 },
      uSwarm: { value: Array.from({ length: MAX_SWARMS }, () => new THREE.Vector4()) },
      uBee: { value: new THREE.Vector4(0, -1e5, 0, 0) }, // position, boost (0..1)
      uBeeSpeed: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      defines: { MAX_SWARMS },
      vertexShader: /* glsl */ `
        attribute float aSwarm; attribute vec4 aWander; attribute vec4 aPhase; attribute vec4 aBlink;
        uniform float uPixel, uVis, uScale, uT, uBeeSpeed;
        uniform vec4 uSwarm[MAX_SWARMS];
        uniform vec4 uBee;
        varying float vG; varying float vFar;
        void main(){
          vec4 s = uSwarm[int(aSwarm + 0.5)];
          // a slow Lissajous wander about its place in the swarm
          vec3 p = s.xyz + position + vec3(sin(uT * aWander.x + aPhase.x) * aWander.w,
                                           sin(uT * aWander.y + aPhase.y) * aWander.w * 0.45,
                                           cos(uT * aWander.z + aPhase.z) * aWander.w);
          // APX-9: every one drifts aside to let it through, a boost scatters
          // them, and the curious ones brighten as it goes by
          vec3 d = p - uBee.xyz;
          float dist = length(d);
          float ex = 0.0;
          if (dist < 30.0 && dist > 1e-3) {
            vec3 n = d / dist;
            if (dist < 7.0) p += n * (7.0 - dist) * 0.75;
            if (uBee.w > 0.35 && uBeeSpeed > 14.0 && dist < 22.0) p += normalize(n + vec3(0.0, 0.4, 0.0)) * (1.0 - dist / 22.0) * 9.0 * uBee.w;
            ex = aBlink.z * (1.0 - dist / 30.0);
          }
          p.y = max(p.y, 1.5);
          // blinking in slow waves that roll across the swarm, each its own beat
          float wave = 0.5 + 0.5 * sin(uT * 0.95 * aBlink.x - (p.x * 0.055 + p.z * 0.04) + aPhase.w * 0.35);
          float flick = 0.75 + 0.25 * sin(uT * 7.3 + aBlink.y);
          float g = (0.16 + 0.84 * smoothstep(0.0, 1.0, clamp((wave - 0.42) / 0.5, 0.0, 1.0))) * flick;
          g = min(1.6, g + ex * 0.55);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float dz = -mv.z;
          vG = g * uVis;
          vFar = exp(-dz * 0.0016);
          // a halo about 1.8 units across at full glow, never smaller than a few pixels
          gl_PointSize = clamp((0.6 + g * 0.8) * uScale * uPixel / max(dz, 0.5), 3.2 * uPixel, 72.0 * uPixel);
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
    this.beeGlow = 0;
    this.beeC = V();
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
    const U = this.u;
    U.uVis.value = vis;
    U.uPixel.value = pixelRatio;
    U.uScale.value = this._scale(camera);
    U.uT.value = t;
    const bp = bee?.pos;
    if (bp) U.uBee.value.set(bp.x, bp.y, bp.z, bee.boost ?? 0); else U.uBee.value.set(0, -1e5, 0, 0);
    U.uBeeSpeed.value = bee?.speed ?? 0;
    // each swarm wanders slowly round its home; its light (for the light
    // field) follows its blink waves on average, brighter by the bee
    let bg = 0, bx = 0, by = 0, bz = 0;
    this.swarms.forEach((s, i) => {
      s.pos.set(s.c.x + Math.sin(t * 0.071 + s.ph) * 5, s.c.y + Math.sin(t * 0.053 + s.ph * 2) * 2, s.c.z + Math.cos(t * 0.064 + s.ph) * 5);
      U.uSwarm.value[i].set(s.pos.x, s.pos.y, s.pos.z, 0);
      let g = 0.36 + 0.12 * Math.sin(t * 0.9 + s.ph);
      if (bp) {
        const d = s.pos.distanceTo(bp);
        const k = clamp(1 - (d - s.r) / 30);
        g += k * 0.25;
        if (k > 0) { const w = k * Math.min(1, s.cnt / 40); bg += w * 12; bx += s.pos.x * w; by += s.pos.y * w; bz += s.pos.z * w; }
      }
      s.glow = g;
    });
    this.beeGlow = bg;
    if (bg > 0) { const w = bg / 12; this.beeC.set(bx / w, by / w, bz / w).lerp(bp, 0.6); }
    this._bodies(camera, vis, bp);
  }

  // screen scale: pixels per world unit at distance 1
  _scale(camera) { return (0.5 * window.innerHeight) / Math.tan((camera.fov * Math.PI) / 360); }

  // where a firefly is now (the shader's wander, without the bee's push)
  _at(f, out) {
    const s = this.swarms[f.si].pos, t = this.t;
    return out.set(
      s.x + f.o.x + Math.sin(t * f.f[0] + f.p[0]) * f.amp,
      Math.max(1.5, s.y + f.o.y + Math.sin(t * f.f[1] + f.p[1]) * f.amp * 0.45),
      s.z + f.o.z + Math.cos(t * f.f[2] + f.p[2]) * f.amp,
    );
  }

  _bodies(camera, vis, bp) {
    if (!this.bodies) return;
    const cp = camera.position;
    const near = [];
    // (only the swarms by the camera can hold its nearest fireflies)
    const close = new Set(this.swarms.map((s, i) => (s.pos.distanceTo(cp) < 40 + s.r ? i : -1)).filter((i) => i >= 0));
    if (close.size) {
      for (const f of this.flies) {
        if (!close.has(f.si)) continue;
        this._at(f, f.pos);
        if (bp) { const d = this._d.subVectors(f.pos, bp); const l = d.length(); if (l < 7 && l > 1e-3) f.pos.addScaledVector(d, ((7 - l) * 0.75) / l); }
        const d2 = f.pos.distanceToSquared(cp);
        if (d2 < 32 * 32) near.push([d2, f]);
      }
    }
    near.sort((a, b) => a[0] - b[0]);
    const m4 = this._m4 || (this._m4 = new THREE.Matrix4()), q = this._q || (this._q = new THREE.Quaternion()), one = V(1, 1, 1), col = this._c || (this._c = new THREE.Color());
    const n = Math.min(this.bodyMax, near.length);
    const t = this.t;
    for (let i = 0; i < n; i++) {
      const f = near[i][1];
      const a = Math.atan2(Math.cos(f.p[0] + t * f.f[0]), Math.sin(f.p[2] + t * f.f[2]));
      q.setFromAxisAngle(_Y, a);
      m4.compose(f.pos, q, one);
      this.bodies.setMatrixAt(i, m4);
      this.lamps.setMatrixAt(i, m4);
      const wave = 0.5 + 0.5 * Math.sin(t * 0.95 * f.wv - (f.pos.x * 0.055 + f.pos.z * 0.04) + f.ph * 0.35);
      const g = (0.06 + 0.94 * smooth(clamp((wave - 0.42) / 0.5))) * (0.75 + 0.25 * Math.sin(t * 7.3 + f.flick)) * vis * 3;
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
