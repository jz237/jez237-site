import * as THREE from 'three';
import { LightField } from '../world/lightfield.js';
import { Fireflies } from './fireflies.js';
import { RNG } from '../core/rng.js';
import { clamp, smooth } from '../core/ease.js';

// A night that glows (interactive modes). Owns:
//  · the light field's sources (world/lightfield.js): the ~26 vault lanterns,
//    the path lamps, ~160 seed lanterns, the great bloom's core, the glass
//    blossom, the skep's doorway, the seedpods, the armillary's lamp, sprouted
//    glass blooms, every pollinated bloom and the firefly swarms;
//  · ambient kindling: as dusk falls each lantern, lamp and seed lantern
//    kindles at its own hour (a soft ignition), separate from the interactive
//    "lit" flare of a passing bee; at dawn they gutter out one by one;
//  · haloes in the humid air round every lit lamp, an explore-only flame
//    (a glowing mantle, not a flat disc) and glass that glows round it;
//  · blooms that glow from within (per-bloom: brighter when pollinated, when
//    APX-9 comes near, when the bloom wave passes), shimmering glass;
//  · cool moon shafts and moonlit dust in place of the sun's;
//  · the fireflies (fireflies.js).
// Everything is a function of the hour (TimeOfDay.phases) and the explore
// clock, so review captures are repeatable.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const LANTERN = new THREE.Color(1.0, 0.52, 0.2); // linear: warm amber
const LAMP = new THREE.Color(1.0, 0.56, 0.24);
const ORB = new THREE.Color(1.0, 0.5, 0.2);
const POLLEN = new THREE.Color(1.0, 0.62, 0.26);
const FLY = new THREE.Color(0.9, 1.0, 0.45);
const SHAFT_SUN = new THREE.Color('#ffd49a'), SHAFT_MOON = new THREE.Color('#9cc4e4');
const DUST_SUN = new THREE.Color('#ffe2b0'), DUST_MOON = new THREE.Color('#bcd8ee');
// light-field gains (intensity per unit of each lamp's glow)
const G = { lantern: 6.8, lamp: 7.5, orb: 3.8 };

export class Night {
  constructor({ world, quality, mat, upgrade, interactions, growth, bells, group }) {
    this.world = world;
    this.ia = interactions;
    this.field = new LightField(quality);
    this.group = new THREE.Group();
    this.group.name = 'night';
    group.add(this.group);
    const rng = new RNG('night');
    const F = this.field;
    const src = (pos, radius, core) => F.add({ pos, radius, core, color: new THREE.Color(0, 0, 0), k: 1 });

    // ---- sources --------------------------------------------------------------------------
    const fo = world.foliage, ga = world.garden, fl = world.flora;
    // each lamp kindles at its own hour as the evening falls (and goes out at dawn)
    this.lanterns = fo.lanterns.map((l) => ({ l, src: src(V(), 165, 80), thr: rng.range(0.45, 0.62), was: 0 }));
    this.lamps = ga.lamps.map((c) => ({ c, src: src(c.position.clone(), 135, 34), thr: rng.range(0.47, 0.6), was: 0 }));
    this.orbs = fl.orbs.map((o) => ({ o, src: src(V(), 42, 10), thr: rng.range(0.43, 0.6), was: 0 }));
    this.hero = src(V(), 78, 14);
    this.blossom = src(V(), 34, 7);
    this.skep = src(V(), 52, 10);
    this.pods = world.pods.pods.map((p) => ({ p, src: src(p.pos.clone(), 16, 4) }));
    this.arm = src(V(70, 86, -560), 120, 26);
    this.sites = growth.sites.map((s) => ({ s, src: src(V(s.c.x, 12, s.c.z), 38, 9) }));
    this.pollen = new Map(); // flower index → source
    fl.flowers.forEach((f, i) => { f._gi = i; });

    // ---- fireflies ------------------------------------------------------------------------
    this.ff = new Fireflies(quality);
    this.ff.buildBodies(mat);
    this.group.add(this.ff.group);
    this.swarmSrc = this.ff.swarms.map((s) => src(s.pos, 34, 9));
    this.beeFlies = src(V(), 15, 4);

    // ---- haloes round the lamps ------------------------------------------------------------
    this._halos(fo, ga, fl);
    // ---- the lanterns' flames and glass (explore only) -------------------------------------
    this._lanternLook(fo, upgrade);
    // ---- blooms glow from within ---------------------------------------------------------------
    this.bloomAttr = fl.inst.map(({ ty, petals }) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(ty.list.length * ty.petals), 1);
      a.setUsage(THREE.DynamicDrawUsage);
      ty.geo.setAttribute('aBloomGlow', a);
      return a;
    });
    // the porcelain bellflowers glow from within at night too (their own material: explore only)
    if (bells?.bellMesh) {
      const m = bells.bellMesh.material.clone();
      m.emissive = new THREE.Color('#ffd09a');
      m.emissiveIntensity = 0;
      bells.bellMesh.material = m;
      this.bellMat = m;
    }
    this.P = null;
    this._v = V();
  }

  _halos(fo, ga, fl) {
    const geo = new THREE.PlaneGeometry(1, 1);
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vC; varying vec2 vQ; varying float vFade;
        void main(){
          vec3 c = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          float s = length(instanceMatrix[0].xyz);
          vec4 mv = viewMatrix * vec4(c, 1.0);
          float d = -mv.z;
          mv.xy += position.xy * s;
          mv.z += min(s * 0.45, max(d - 1.0, 0.0) * 0.5); // in front of the lamp's own body
          vFade = smoothstep(s * 0.35, s * 1.6, d) * exp(-d * 0.0011);
          #ifdef USE_INSTANCING_COLOR
            vC = instanceColor;
          #else
            vC = vec3(1.0);
          #endif
          vQ = position.xy * 2.0;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vC; varying vec2 vQ; varying float vFade;
        void main(){
          float r2 = dot(vQ, vQ);
          if (r2 > 1.0) discard;
          float a = exp(-r2 * 5.0) * 0.75 + exp(-r2 * 22.0) * 0.5;
          a *= 1.0 - smoothstep(0.55, 1.0, r2);
          gl_FragColor = vec4(vC * a * vFade, 1.0);
        }`,
    });
    const items = [];
    fo.lanterns.forEach((l, i) => items.push({ kind: 'lantern', i, size: 26 * l.sc }));
    ga.lamps.forEach((c, i) => items.push({ kind: 'lamp', i, size: 28 }));
    fl.orbs.forEach((o, i) => items.push({ kind: 'orb', i, size: 6.5 * o.sc }));
    items.push({ kind: 'hero', size: 12 }, { kind: 'skep', size: 9 }, { kind: 'arm', size: 46 }, { kind: 'blossom', size: 6 });
    this.haloItems = items;
    this.halos = new THREE.InstancedMesh(geo, m, items.length);
    this.halos.frustumCulled = false;
    this.halos.renderOrder = 8;
    this.halos.setColorAt(0, new THREE.Color(0, 0, 0));
    this.group.add(this.halos);
  }

  // a glowing mantle for each lantern (bright core, soft rim) and glass that
  // catches its light; swapped in only while exploring
  _lanternLook(fo, upgrade) {
    const flame = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec3 vC;
        void main(){
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
          vV = -mv.xyz;
          #ifdef USE_INSTANCING_COLOR
            vC = instanceColor;
          #else
            vC = vec3(1.0);
          #endif
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec3 vC;
        void main(){
          float ndv = abs(dot(normalize(vN), normalize(vV)));
          float core = pow(ndv, 2.2);
          vec3 c = vC * (0.25 + 1.25 * core) + vec3(dot(vC, vec3(0.33))) * core * core * 0.6;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    upgrade.swap(fo.flames, 'material', flame);
    // the seed lanterns too: glowing glass bulbs rather than flat discs
    upgrade.swap(this.world.flora.orbMesh, 'material', flame);
    // the glass: a per-lantern glow attribute, brighter toward the panes' edges
    const g = fo.lanternGlass.geometry;
    this.glassGlow = new THREE.InstancedBufferAttribute(new Float32Array(fo.lanterns.length), 1);
    this.glassGlow.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('aLGlow', this.glassGlow);
    const gm = fo.lanternGlass.material.clone();
    gm.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aLGlow; varying float vLGlow;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\nvLGlow = aLGlow;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vLGlow;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          {
            float ndv = abs(dot(normal, normalize(vViewPosition)));
            totalEmissiveRadiance += vec3(1.0, 0.6, 0.26) * vLGlow * (0.55 + 1.6 * pow(1.0 - ndv, 2.0));
          }`);
    };
    gm.customProgramCacheKey = () => 'cg-lantern-glass';
    gm.userData.noLightField = true; // (its own flame would wash it out)
    upgrade.swap(fo.lanternGlass, 'material', gm);
  }

  // ---- per frame ---------------------------------------------------------------------------------
  // before the world update: the evening's kindling, glow hooks for the world
  pre(ctx, P, now) {
    this.P = P;
    const d = ctx.dawn;
    const ia = this.ia;
    const kin = (list, states, w = 0.022) => list.forEach((x, i) => {
      const a = 1 - smooth(clamp((d - (x.thr - w)) / (2 * w)));
      const s = states[i];
      // a soft ignition as it catches (not the bee's flare)
      if (a > 0.5 && x.was <= 0.5 && x.primed) s.ignite = now;
      x.primed = true;
      x.was = a;
      s.amb = a;
    });
    kin(this.lanterns, ia.lanterns);
    kin(this.lamps, ia.lamps);
    kin(this.orbs, ia.orbs, 0.03);
    // the world's own glows read these (inert in the film: the film's context has none)
    ctx.heroNight = P.blooms;
    ctx.podNight = P.blooms;
    ctx.blossomNight = P.blooms;
    ctx.skepNight = P.lamps;
  }

  // after the world update and the camera: sources, haloes, glows, fireflies, the field
  post(dt, camera, beeState, pixelRatio, ctx) {
    const P = this.P;
    if (!P) return;
    const w = this.world, ia = this.ia;
    const fo = w.foliage, ga = w.garden, fl = w.flora;
    const now = ia.now;
    const night = P.night;
    // lanterns: light from the flame, colour by its glow (above the cold ember)
    const H = this.halos, m4 = this._m4 || (this._m4 = new THREE.Matrix4()), col = this._c || (this._c = new THREE.Color());
    const q0 = new THREE.Quaternion();
    const hk = 0.22 + 0.78 * night; // haloes read most in the dark
    let hi = 0;
    const halo = (pos, size, c, k) => {
      m4.compose(pos, q0, this._v.set(size, size, size));
      H.setMatrixAt(hi, m4);
      H.setColorAt(hi, col.copy(c).multiplyScalar(k));
      hi++;
    };
    this.lanterns.forEach((x, i) => {
      const l = x.l;
      const g = fo.live ? fo.live.lantern(l, i) : 0;
      const e = Math.max(0, g - 0.16);
      x.src.pos.copy(l.now || l.p);
      x.src.color.copy(LANTERN).multiplyScalar(e * G.lantern);
      this.glassGlow.array[i] = e * 0.12;
    });
    this.glassGlow.needsUpdate = true;
    this.lamps.forEach((x, i) => {
      const g = ga.live ? ga.live.lamp(x.c, i) : 0;
      x.src.color.copy(LAMP).multiplyScalar(Math.max(0, g - 0.18) * G.lamp);
    });
    this.orbs.forEach((x, i) => {
      const o = x.o;
      const g = fl.live ? fl.live.orb(o, i) : 0;
      x.src.pos.copy(o.now || o.base);
      x.src.color.copy(ORB).multiplyScalar(Math.max(0, g - 0.08) * G.orb);
    });
    // the great bloom's core is a lantern
    const head = w.flower.head.getWorldPosition(this.hero.pos);
    head.y += 1.2;
    const coreG = w.flower.coreGlass.material.emissiveIntensity;
    this.hero.color.copy(LANTERN).multiplyScalar(coreG * (0.8 + 2.6 * night));
    // the glass blossom's nectar, the skep's door, the seedpods, the armillary
    w.blossom.nectarWorld(this.blossom.pos);
    this.blossom.color.copy(w.blossom.nectarMat.color).multiplyScalar(1.1 * (0.3 + night));
    w.skep.entranceWorld(this.skep.pos).y += 0.5;
    this.skep.color.copy(w.skep.doorGlow.material.color).multiplyScalar(1.4 * (0.3 + night));
    for (const x of this.pods) x.src.color.copy(x.p.seedMat.color).multiplyScalar(1.4 * (0.3 + night));
    this.arm.color.copy(fl.armCore.material.color).multiplyScalar(2.4 * (0.25 + night));
    w.flora.armRings[0].parent.getWorldPosition(this.arm.pos);
    // sprouted glass blooms glow at their site
    for (const x of this.sites) {
      if (!x.s.grown) { x.src.color.setRGB(0, 0, 0); continue; }
      let g = 0, n = 0;
      for (const b of x.s.blooms) { g += (b.k || 0) * (1 + (b.pollinated || 0)); n++; }
      x.src.color.copy(POLLEN).multiplyScalar((g / Math.max(1, n)) * 2.6 * (0.3 + night));
    }
    // pollinated blooms: their gilded bosses light their own petals and leaves
    for (let i = 0; i < fl.flowers.length; i++) {
      const f = fl.flowers[i];
      const id = f.landing?.id;
      if (id === undefined || !ia.pollinated.has(id)) continue;
      let s = this.pollen.get(i);
      if (!s) { s = this.field.add({ pos: V(), radius: 24, core: 8, color: new THREE.Color(), k: 1 }); this.pollen.set(i, s); }
      s.pos.copy(f.topNow || f.top).y += 1.5 * f.scale;
      const dt0 = now - ia.flowerTouch[i];
      const flare = dt0 > 0 && dt0 < 3 ? Math.exp(-dt0 * 1.8) * 3 : 0;
      // (mostly a night glow: by day only a gentle warmth when touched)
      s.color.copy(POLLEN).multiplyScalar((0.1 + 1.2 * night + flare * (0.15 + 0.85 * night)) * (0.92 + 0.08 * Math.sin(now * 2.4 + f.sway)));
    }
    // blooms glow from within: per bloom, brighter pollinated, welcoming a bee, in the wave
    const base = P.blooms;
    fl.inst.forEach(({ ty }, k) => {
      const A = this.bloomAttr[k].array;
      let o = 0;
      for (const f of ty.list) {
        const i = f._gi;
        const id = f.landing?.id;
        const pol = id !== undefined && ia.pollinated.has(id) ? 1 : 0;
        const dt0 = now - ia.flowerTouch[i], dw = now - ia.flowerWave[i];
        let g = base * (0.85 + 0.15 * Math.sin(now * 0.9 + f.sway * 3)) * (1 + pol * 0.8 + ia.welcome[i] * 0.3);
        if (dt0 > 0 && dt0 < 3) g += Math.exp(-dt0 * 1.8) * (0.3 + 1.0 * night);
        if (dw > 0 && dw < 3) g += (dw < 0.6 ? Math.sin(Math.PI * dw / 0.6) : Math.exp(-(dw - 0.6) * 1.6)) * (0.6 + base);
        g += pol * 0.15; // a pollinated bloom keeps a little warmth by day
        for (let p = 0; p < ty.petals; p++) A[o++] = g;
      }
      this.bloomAttr[k].needsUpdate = true;
    });
    // porcelain bells glow like the blooms
    if (this.bellMat) this.bellMat.emissiveIntensity = 0.22 * base;
    // fireflies
    const ffv = P.flies;
    this.ff.update(dt, ffv, beeState, camera, pixelRatio);
    this.ff.swarms.forEach((s, i) => this.swarmSrc[i].color.copy(FLY).multiplyScalar(s.glow * ffv * 2.4));
    if (this.ff.beeGlow > 0 && ffv > 0) { this.beeFlies.pos.copy(this.ff.beeC); this.beeFlies.color.copy(FLY).multiplyScalar(Math.min(3, this.ff.beeGlow * 0.25) * ffv); }
    else this.beeFlies.color.setRGB(0, 0, 0);
    // haloes (after the sources: same glows)
    this.lanterns.forEach((x, i) => halo(x.src.pos, this.haloItems[i].size, LANTERN, (x.src.color.r / G.lantern) * 0.045 * hk));
    const nl = this.lanterns.length;
    this.lamps.forEach((x, i) => halo(x.c.position, this.haloItems[nl + i].size, LAMP, (x.src.color.r / G.lamp) * 0.05 * hk));
    this.orbs.forEach((x, i) => halo(x.src.pos, this.haloItems[nl + this.lamps.length + i].size, ORB, (x.src.color.r / G.orb) * 0.05 * hk));
    halo(this.hero.pos, 12, LANTERN, Math.min(2, coreG) * 0.1 * hk);
    halo(this.skep.pos, 9, LANTERN, (this.skep.color.r / 1.4) * 0.1 * hk);
    halo(this.arm.pos, 40, LAMP, (this.arm.color.r / 2.4) * 0.05 * hk);
    halo(this.blossom.pos, 6, LANTERN, (this.blossom.color.r / 1.1) * 0.1 * hk);
    H.count = hi;
    H.instanceMatrix.needsUpdate = true;
    H.instanceColor.needsUpdate = true;
    // moonlight through the vault: cool shafts and moonlit dust
    const A = w.atmosphere;
    A.shaftUniforms.uIntensity.value += 0.045 * P.moon * (ctx?.shaftGain ?? 1);
    A.shaftUniforms.uColor.value.copy(SHAFT_SUN).lerp(SHAFT_MOON, P.moon);
    A.dustUniforms.uShaftGain.value += 0.6 * P.moon;
    A.dustUniforms.uColor.value.copy(DUST_SUN).lerp(DUST_MOON, P.moon);
    // pack the field
    this.field.update(camera.position);
  }

  exit() {
    const A = this.world.atmosphere;
    A.shaftUniforms.uColor.value.copy(SHAFT_SUN);
    A.dustUniforms.uColor.value.copy(DUST_SUN);
  }
}
