import * as THREE from 'three';
import { RNG } from '../core/rng.js';
import { clamp, lerp, smooth } from '../core/ease.js';
import { butterflyTexture } from '../materials/textures.js';
import { lightFieldMaterial } from '../world/lightfield.js';
import { groundHeight, ceilingAt } from './bounds.js';
import { L } from '../world/layout.js';
import { flutterInit, flutterStep } from './flutter.js';

// Hundreds of butterflies by day (interactive modes): monarchs, and enamel
// swallowtails in a dozen tints, each living round a bloom of its own, all
// through the house and up in the great tree's blossom. They fly as
// butterflies do (flutter.js: bobbing with every beat, jinking, banking,
// gliding), at every height from just over the blooms to well up under the
// glass, hop from bloom to bloom, settle on one with their wings slowly
// opening and closing, and scatter from APX-9 rushing past. As the evening
// falls they go to roost (thin out and are gone by night, when the fireflies
// come out).
//
// One instanced batch per wing pattern: a small body and two wings whose
// flapping is worked out on the GPU from a per-butterfly phase, rate and
// opening; the main thread only steers them (a few vector operations each).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const TINTS = ['#ffffff', '#a8d0ff', '#ffd27a', '#ffb3c8', '#c9b3ff', '#b9f0d0', '#ffe9a8', '#9fe0ff', '#ffc2a0', '#f2f2f2'];

function butterflyGeometry() {
  // wings: span along x (root at the body, 0..1 in u), chord along z; the
  // fore wing is the texture's top half, the hind its bottom (butterflyTexture)
  const span = 3.6, chord = 3.8;
  const pos = [], uv = [], side = [], idx = [];
  for (const s of [-1, 1]) {
    const base = pos.length / 3;
    const N = 6;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const u = i / N, v = j / N;
      pos.push(s * (0.2 + u * span), Math.sin(u * Math.PI * 0.8) * 0.18, (v - 0.5) * chord);
      uv.push(u, v);
      side.push(s);
    }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = base + j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  // the body: a slim spindle along z (side 0: it doesn't flap)
  const base = pos.length / 3;
  const R = 6, Lz = 9;
  for (let j = 0; j <= Lz; j++) {
    const k = j / Lz;
    const z = -1.7 + k * 2.6;
    const r = 0.26 * Math.sin(Math.PI * Math.min(1, k * 1.05)) + 0.05;
    for (let i = 0; i <= R; i++) {
      const a = (i / R) * TAU;
      pos.push(Math.cos(a) * r, Math.sin(a) * r, z);
      uv.push(0.001, 0.5);
      side.push(0);
    }
  }
  for (let j = 0; j < Lz; j++) for (let i = 0; i < R; i++) {
    const a = base + j * (R + 1) + i, b = a + 1, c = a + R + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class ButterflyCloud {
  constructor({ world, quality }) {
    this.flora = world.flora;
    this.group = new THREE.Group();
    this.group.name = 'butterflies';
    const rng = new RNG('butterflies');
    const n = quality.tier === 'low' ? 220 : quality.tier === 'med' ? 380 : 560;
    // homes: blooms all through the house, and the great tree's blossom
    const fl = world.flora.flowers;
    const gt = world.greatTree;
    const homes = [];
    // (half of them by the path, where APX-9 and the camera mostly are)
    const byPath = fl.filter((f) => f.base.x > L.pathX[0] - 70 && f.base.x < L.pathX[1] + 70);
    // (in loose companies of four to eight round one bloom: a swirl of wings
    // reads as many, where the same number spread evenly reads as few)
    while (homes.length < n) {
      let h;
      if (gt && rng.chance(0.15)) { const c = gt.clusters[Math.floor(rng.float() * gt.clusters.length)]; h = { p: c.c.clone(), tree: true }; }
      else { const src = rng.chance(0.55) && byPath.length ? byPath : fl; const f = src[Math.floor(rng.float() * src.length)]; h = { p: f.top.clone(), f }; }
      const k = 4 + Math.floor(rng.float() * 5);
      for (let j = 0; j < k && homes.length < n; j++) homes.push(h);
    }
    // (shuffle, so each wing pattern gets a share of every company)
    for (let i = homes.length - 1; i > 0; i--) { const j = Math.floor(rng.float() * (i + 1)); [homes[i], homes[j]] = [homes[j], homes[i]]; }
    this.geo = butterflyGeometry();
    this.uT = { value: 0 };
    const mats = ['monarch', 'swallowtail'].map((sp) => this._material(butterflyTexture({ species: sp, size: quality.tier === 'low' ? 256 : 512, seed: sp === 'monarch' ? 4 : 9 })));
    const counts = [Math.round(n * 0.35), n - Math.round(n * 0.35)];
    this.batches = counts.map((c, k) => {
      const m = new THREE.InstancedMesh(this.geo, mats[k], c);
      const flap = new THREE.InstancedBufferAttribute(new Float32Array(c * 4), 4); // phase, rate, amplitude, rest opening
      flap.setUsage(THREE.DynamicDrawUsage);
      m.geometry = this.geo.clone();
      m.geometry.setAttribute('aFlap', flap);
      m.frustumCulled = false;
      m.castShadow = false;
      m.receiveShadow = false;
      this.group.add(m);
      return { mesh: m, flap, n: c };
    });
    this.b = [];
    const col = new THREE.Color();
    let k = 0;
    for (const B of this.batches) {
      for (let i = 0; i < B.n; i++, k++) {
        const h = homes[k];
        const b = {
          B, i, home: h, pos: h.p.clone().add(V(rng.range(-15, 15), rng.range(4, 18), rng.range(-15, 15))), vel: V(), aim: V(),
          sc: rng.range(1.0, 1.55), ph: rng.range(0, TAU), state: 'fly', t: rng.range(0, 6),
          yaw: rng.range(0, TAU), open: 0.6, amp: 1,
        };
        // (monarchs glide more, on flatter wings)
        flutterInit(b, rng, { glider: B === this.batches[0] ? 0.7 : 0.5 });
        b.aim.copy(b.pos);
        this._newAim(b, rng);
        if (B === this.batches[1]) B.mesh.setColorAt(i, col.set(TINTS[Math.floor(rng.float() * TINTS.length)]));
        this.b.push(b);
      }
      if (B.mesh.instanceColor) B.mesh.instanceColor.needsUpdate = true;
    }
    this.rng = rng;
    this.visK = 0;
    this.frame = 0;
    this._m4 = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._e = new THREE.Euler(0, 0, 0, 'YXZ');
    this._s = V();
    this._s2 = V();
  }

  _material(map) {
    const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, metalness: 0.25, roughness: 0.38 });
    const uT = this.uT;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uBT = uT;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aSide; attribute vec4 aFlap; uniform float uBT; varying float vSide;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\nvSide = aSide;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          if (aSide != 0.0) {
            // the wing beats about the body's long axis (z): up till the wings
            // nearly meet overhead, down a little below level; at rest only a
            // slow open and close (aFlap: phase at t=0, rate, amplitude, opening)
            float s = sin(uBT * aFlap.y + aFlap.x);
            float beat = aFlap.z * (s > 0.0 ? s : s * 0.8);
            float ang = (aFlap.w + beat) * aSide;
            float c = cos(ang), sn = sin(ang);
            transformed.xy = vec2(transformed.x * c - transformed.y * sn, transformed.x * sn + transformed.y * c);
          }`)
        .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
          if (aSide != 0.0) {
            float s = sin(uBT * aFlap.y + aFlap.x);
            float ang = (aFlap.w + aFlap.z * (s > 0.0 ? s : s * 0.8)) * aSide;
            float c = cos(ang), sn = sin(ang);
            objectNormal.xy = vec2(objectNormal.x * c - objectNormal.y * sn, objectNormal.x * sn + objectNormal.y * c);
          }`);
    };
    // (the body is dark enamel, not cut from the wing pattern)
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => {
      prev(sh, r);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vSide;')
        // (far away the wing pattern's smaller mip levels blur its edge into
        // the clear surround and the cut-out would erase the wing: its
        // coverage is kept up as the texture shrinks)
        .replace('#include <alphatest_fragment>', `
          float cgLod = max(0.0, log2(max(length(dFdx(vMapUv)), length(dFdy(vMapUv))) * ${map.image?.width || 512}.0));
          diffuseColor.a = clamp(diffuseColor.a * (1.0 + cgLod * 0.32), 0.0, 1.0);
          if (abs(vSide) < 0.5) diffuseColor = vec4(0.07, 0.05, 0.04, 1.0);
          #include <alphatest_fragment>`);
    };
    m.customProgramCacheKey = () => 'cg-butterfly-cloud';
    return lightFieldMaterial(m);
  }

  // day: how many are out (0 by night); bee: { pos, vel, speed }
  update(dt, t, day, bee, camera) {
    this.uT.value = t;
    // they go to roost as the evening falls (the furthest from the camera first)
    this.visK += (day - this.visK) * (1 - Math.exp(-dt * 0.8));
    const on = this.visK > 0.02;
    this.group.visible = on;
    if (!on) return;
    this.frame = (this.frame + 1) | 0;
    const rng = this.rng, m4 = this._m4, q = this._q, e = this._e, s = this._s, s2 = this._s2;
    const bp = bee?.pos;
    const cp = camera.position;
    for (const b of this.b) {
      const B = b.B;
      // thinning out by the hour: each has its own threshold
      const out = (b.i % 17) / 17 < this.visK * 1.06;
      if (!out) { m4.makeScale(0, 0, 0); B.mesh.setMatrixAt(b.i, m4); continue; }
      // far ones are steered at half rate, alternate halves on alternate
      // frames (by a frame count: the clock's parity sticks at 30 fps)
      const far = b.pos.distanceToSquared(cp) > 260 * 260;
      if (far && (b.i & 1) === (this.frame & 1)) continue;
      const step = far ? dt * 2 : dt;
      b.t -= step;
      // and none flutters into the lens
      if (b.state !== 'flee' && b.pos.distanceToSquared(cp) < 7.5 * 7.5) {
        b.state = 'flee'; b.t = rng.range(1, 1.8);
        b.aim.copy(b.pos).add(b.pos.clone().sub(cp).normalize().multiplyScalar(14)).add(V(0, 4, 0));
      }
      // APX-9 rushing by sends it off
      if (bp && b.state !== 'flee') {
        const d = b.pos.distanceTo(bp);
        if (d < 6 || (d < 11 && bee.speed > 8)) {
          b.state = 'flee'; b.t = rng.range(1.2, 2.2);
          b.aim.copy(b.pos).add(b.pos.clone().sub(bp).normalize().multiplyScalar(rng.range(14, 24))).add(V(0, rng.range(5, 10), 0));
        }
      }
      const F = b.fl;
      let rate;
      if (b.state === 'rest') {
        // settled on its bloom: wings open and close, slowly
        if (b.t <= 0) { b.state = 'fly'; b.t = rng.range(3, 7); this._newAim(b); b.vel.set(0, F.cruise * 0.5, 0); }
        b.vel.multiplyScalar(0.8);
        rate = 1.4;
        b.ph += step * rate;
        b.amp = lerp(b.amp, 0.5, 1 - Math.exp(-step * 3));
        b.open = lerp(b.open, 0.75, 1 - Math.exp(-step * 3));
        F.bob = 0; F.pitch = 0; F.roll *= 0.9;
      } else {
        if (b.t <= 0 || b.pos.distanceToSquared(b.aim) < 9) {
          if (b.state === 'fly' && b.home.f && rng.chance(0.14)) {
            // settle on the home bloom (or a neighbour's)
            b.state = 'land';
            const f = b.home.f;
            b.aim.copy(f.topNow || f.top).add(V(rng.range(-1.2, 1.2), 1.2 + f.scale * 0.6, rng.range(-1.2, 1.2)));
            b.t = 6;
          } else if (b.state === 'land') {
            b.state = 'rest'; b.t = rng.range(2, 5);
          } else { b.state = 'fly'; b.t = rng.range(2.5, 6); this._newAim(b); }
        }
        // flutter toward the aim (flutter.js: bobbing, jinking, banking, gliding)
        const want = s.copy(b.aim).sub(b.pos);
        const dist = want.length();
        const sp = b.state === 'flee' ? F.cruise * 1.8 : b.state === 'land' ? Math.min(F.cruise * 0.6, 1 + dist * 1.2) : F.cruise;
        want.multiplyScalar(sp / Math.max(dist, 1e-3));
        const gliding = flutterStep(b, want, step, rng, b.state === 'flee' ? 'flee' : b.state === 'land' && dist < 10 ? 'land' : 'fly');
        rate = F.rate;
        b.amp = 1.0 * F.amp;
        // (wings held out in a glide: monarchs flat, swallowtails a shallow V)
        b.open = lerp(b.open, gliding ? (B === this.batches[0] ? 0.08 : 0.26) : 0.42, 1 - Math.exp(-step * 10));
      }
      b.pos.addScaledVector(b.vel, step);
      const g = groundHeight(b.pos.x, b.pos.z) + 2;
      if (b.pos.y < g) { b.pos.y = g; b.vel.y = Math.abs(b.vel.y); }
      const c = ceilingAt(b.pos.x) - 12;
      if (b.pos.y > c) { b.pos.y = c; b.vel.y = -Math.abs(b.vel.y); }
      // drawn with the beat's bob (each downstroke lifts it), rocking and banking
      q.setFromEuler(e.set(F.pitch, b.yaw, F.roll));
      m4.compose(s.copy(b.pos).setY(b.pos.y + F.bob * 1.0 * b.sc), q, s2.setScalar(b.sc));
      B.mesh.setMatrixAt(b.i, m4);
      // (the phase lives on the CPU; the GPU carries it on at this rate between
      // steering updates, so a far one steered every other frame still beats smoothly)
      b.ph %= TAU;
      B.flap.setXYZW(b.i, b.ph - ((t * rate) % TAU), rate, b.amp, b.open);
    }
    for (const B of this.batches) { B.mesh.instanceMatrix.needsUpdate = true; B.flap.needsUpdate = true; }
  }

  // somewhere new round home (or, now and then, the next bloom along)
  _newAim(b, rng = this.rng) {
    if (b.home.f && rng.chance(0.12)) {
      // the next bloom along: the nearest of a few picked at random
      const all = this.flora.flowers;
      let best = null, bd = 70 * 70;
      for (let k = 0; k < 6; k++) {
        const f = all[Math.floor(rng.float() * all.length)];
        const d = f.top.distanceToSquared(b.home.p);
        if (d < bd && f !== b.home.f) { bd = d; best = f; }
      }
      if (best) b.home = { p: best.top.clone(), f: best };
    }
    const r = b.home.tree ? 18 : 24;
    // (at every height: mostly just over the blooms, some higher, a few well up)
    const u = rng.float();
    const y = b.home.tree ? rng.range(-6, 14) : u < 0.5 ? rng.range(1.5, 9) : u < 0.85 ? rng.range(9, 24) : rng.range(24, 46);
    b.aim.copy(b.home.p).add(V(rng.range(-r, r), y, rng.range(-r, r)));
    b.aim.x = clamp(b.aim.x, L.house.x0 + 15, L.house.x1 - 15);
    b.aim.z = clamp(b.aim.z, L.house.z1 + 15, L.house.z0 - 15);
  }
}
