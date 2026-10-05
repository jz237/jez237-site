import * as THREE from 'three';
import { RNG } from '../core/rng.js';
import { clamp, lerp, smooth, smoother, settle, sseg } from '../core/ease.js';
import { tickState } from '../direction/beats.js';
import { L } from '../world/layout.js';

// What the clockmaker built the garden to do when a bee is about.
//  · Pollination: settle on any bloom; it answers mechanically (petals flex
//    open, its pollen boss lights and stays gilded, a music-box note) and the
//    pollen gauge fills.
//  · The skep: carry pollen home; the hive flares, chimes, and the next
//    planting site sprouts glass blooms (see growth.js).
//  · Winding: touch the escapement and the garden is wound: the movement
//    races, a pulse runs the copper roots, the train spins up, light climbs
//    the great stem and a bloom wave ripples out across the house, kindling
//    every lantern on its way.
//  · Lanterns, seed lanterns and path lamps kindle as you pass.
//  · The armillary spins up when you fly through its rings.
//  · Porcelain bellflowers ring when brushed (bells.js).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const PENTA = [74, 76, 78, 81, 83, 86, 88, 90, 93];
const WAVE_SPEED = 150;
const ARM = V((L.pathX[0] + L.pathX[1]) / 2, 86, -560);
// lamps the evening kindles (night.js) burn at a soft, dreamy level; a passing
// bee kindles them to full brightness (so at night too it leaves a warmer trail)
const AMB = { lantern: 0.55, lamp: 0.6, orb: 0.65 };

export class Interactions {
  constructor({ world, mat, quality, bounds, growth, bells, audio, emit }) {
    this.world = world;
    this.bounds = bounds;
    this.growth = growth;
    this.bells = bells;
    this.audio = audio;
    this.emit = emit || (() => {});
    this.group = new THREE.Group();
    this.group.name = 'interactions';
    this.now = 0;
    this.pollinated = new Map(); // landable id → time
    this.honey = 0;
    this.night = 0;
    this.depositAt = -100;
    this.wind = null;
    this.windCount = 0;
    this.escT = 0;
    this.crownT = 0;
    this.armA = 0;
    this.armSpin = 0;
    this.armGlowK = 0;
    this.lilyLandAt = undefined;
    this.sipUntil = -1;
    const flora = world.flora;
    // kindle state: 0 asleep (an ember), 1 lit; plus the time of the last flare
    this.lanterns = world.foliage.lanterns.map(() => ({ lit: 0, flare: -100, amb: 0, ignite: -100 }));
    this.orbs = flora.orbs.map(() => ({ lit: 0.0, flare: -100, amb: 0, ignite: -100 }));
    this.lamps = world.garden.lamps.map(() => ({ lit: 0, flare: -100, amb: 0, ignite: -100 }));
    this.flowerWave = new Float32Array(flora.flowers.length).fill(-100); // time the wave reached each bloom
    this.flowerTouch = new Float32Array(flora.flowers.length).fill(-100);
    this.flowerDist = flora.flowers.map((f) => Math.hypot(f.top.x, f.top.z));
    this.welcome = new Float32Array(flora.flowers.length);
    this.steady = new Float32Array(flora.flowers.length); // a bloom with a bee on it holds still
    this._buildBosses(mat);
    this._buildMarker();
    this._buildSparks(quality);
    this._buildRipple();
  }

  // the bloom wave made visible: a faint golden curtain expanding from the
  // great bloom, brightest at the ground, shimmering as it travels
  _buildRipple() {
    const geo = new THREE.CylinderGeometry(1, 1, 1, 128, 1, true);
    geo.translate(0, 0.5, 0);
    this.rippleU = { uK: { value: 0 }, uTime: { value: 0 } };
    const m = new THREE.ShaderMaterial({
      uniforms: this.rippleU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uK, uTime; varying vec2 vUv; varying vec3 vW;
        void main(){
          float h = vUv.y;
          float shimmer = 0.65 + 0.35 * sin(vUv.x * 160.0 + uTime * 9.0) * sin(vUv.x * 37.0 - uTime * 4.0);
          float a = pow(1.0 - h, 1.3) * smoothstep(0.0, 0.06, h) * shimmer * uK;
          float camFade = smoothstep(4.0, 30.0, length(cameraPosition - vW));
          gl_FragColor = vec4(vec3(1.0, 0.58, 0.2) * a * camFade, 1.0);
        }`,
    });
    this.ripple = new THREE.Mesh(geo, m);
    this.ripple.frustumCulled = false;
    this.ripple.visible = false;
    this.ripple.renderOrder = 6;
    this.group.add(this.ripple);
  }

  // ---- world hooks --------------------------------------------------------------
  install() {
    const w = this.world;
    const self = this;
    w.flora.live = {
      open(f, t) {
        const i = f.landing?.index ?? 0;
        let k = 1 + Math.sin(t * 0.7 + f.sway) * 0.025;
        // a bloom opens wide to receive an approaching bee
        k += self.welcome[i] * 0.55;
        // pollinated: petals flex wider, then rest a little more open
        const dp = self.now - self.flowerTouch[i];
        if (dp > 0) k += dp < 4 ? Math.sin(dp * 8) * Math.exp(-dp * 2.2) * 0.22 + 0.12 * (1 - Math.exp(-dp * 3)) : 0.12;
        // the bloom wave: snap shut, spring open with an overshoot
        const dw = self.now - self.flowerWave[i];
        if (dw > 0 && dw < 3) k = dw < 0.22 ? lerp(k, 0.35, smooth(dw / 0.22)) : lerp(0.35, k, settle((dw - 0.22) / 1.4, 1.1, 3.2));
        return k;
      },
      hold(f) {
        const i = f.landing?.index;
        return i === undefined ? 1 : 1 - self.steady[i];
      },
      orb(o, i) {
        // kindled by the passing bee (lit) or by the evening itself (amb, night.js)
        const s = self.orbs[i];
        const fl = self.now - s.flare, ig = self.now - s.ignite;
        const a = Math.max(s.lit, s.amb * AMB.orb);
        return 0.06 + self.night * 0.1 + a * (0.9 + 0.15 * Math.sin(self.now * 2 + o.ph)) + (fl > 0 ? Math.exp(-fl * 1.5) * 1.8 : 0) + (ig > 0 ? Math.exp(-ig * 2.5) * 0.6 : 0);
      },
      armAngle() { return self.armA; },
      armGlow() { return 0.45 + self.night * 0.3 + self.armGlowK * 2.2; },
    };
    w.foliage.live = {
      lantern(l, i) {
        const s = self.lanterns[i];
        const fl = self.now - s.flare, ig = self.now - s.ignite;
        const a = Math.max(s.lit, s.amb * AMB.lantern);
        return 0.12 + self.night * 0.12 + a * (3.0 + 0.25 * Math.sin(self.now * 7 + l.ph) + 0.15 * Math.sin(self.now * 13.3 + l.ph * 2)) + (fl > 0 ? Math.exp(-fl * 1.2) * 4 : 0) + (ig > 0 ? Math.exp(-ig * 2.2) * 1.4 : 0);
      },
    };
    w.garden.live = {
      lamp(core, i) {
        const s = self.lamps[i];
        const fl = self.now - s.flare, ig = self.now - s.ignite;
        return 0.15 + Math.max(s.lit, s.amb * AMB.lamp) * 2.2 + (fl > 0 ? Math.exp(-fl * 1.2) * 3 : 0) + (ig > 0 ? Math.exp(-ig * 2.2) * 1.0 : 0);
      },
    };
  }

  uninstall() {
    const w = this.world;
    w.flora.live = null;
    w.foliage.live = null;
    w.garden.live = null;
  }

  // ---- pollen bosses on every far-field bloom (explore only) ------------------------
  _buildBosses(mat) {
    const parts = [];
    const dome = new THREE.SphereGeometry(1, 12, 6, 0, TAU, 0, Math.PI * 0.6);
    dome.scale(1, 0.55, 1);
    parts.push(dome);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU;
      const fil = new THREE.CylinderGeometry(0.04, 0.05, 1.1, 3, 1, true);
      fil.translate(0, 0.55, 0);
      fil.rotateZ(-0.55);
      fil.rotateY(-a);
      parts.push(fil);
      const knob = new THREE.OctahedronGeometry(0.17, 0);
      knob.translate(Math.cos(a) * 0.57, 0.92, Math.sin(a) * 0.57);
      parts.push(knob);
    }
    const geo = mergeAll(parts);
    const m = new THREE.MeshStandardMaterial({ color: '#c99a45', metalness: 0.55, roughness: 0.4 });
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <color_fragment>', '')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += vColor.rgb;');
    };
    m.customProgramCacheKey = () => 'cg-boss-v1';
    const flowers = this.world.flora.flowers;
    this.bosses = new THREE.InstancedMesh(geo, m, flowers.length);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = V();
    flowers.forEach((f, i) => {
      q.setFromUnitVectors(V(0, 1, 0), f.dir);
      m4.compose(f.top.clone().addScaledVector(f.dir, 0.15 * f.scale), q, s.setScalar(0.95 * f.scale));
      this.bosses.setMatrixAt(i, m4);
      this.bosses.setColorAt(i, new THREE.Color(0, 0, 0));
    });
    this.bosses.castShadow = false;
    this.bosses.receiveShadow = true;
    this.bosses.computeBoundingSphere();
    this.group.add(this.bosses);
  }

  _buildMarker() {
    const g = new THREE.TorusGeometry(1, 0.035, 6, 48);
    g.rotateX(Math.PI / 2);
    this.markerMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    this.marker = new THREE.Group();
    this.marker.add(new THREE.Mesh(g, this.markerMat));
    const inner = new THREE.Mesh(g, this.markerMat);
    inner.scale.setScalar(0.62);
    this.marker.add(inner);
    this.marker.visible = false;
    this.marker.renderOrder = 8;
    this.group.add(this.marker);
  }

  _buildSparks(quality) {
    const n = quality.tier === 'low' ? 400 : 1200;
    this.sparkN = n;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
    this.sparkU = { uPixel: { value: 1 } };
    const m = new THREE.ShaderMaterial({
      uniforms: this.sparkU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float size; attribute vec3 color; varying vec3 vC; uniform float uPixel;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = clamp(size * 300.0 * uPixel / -mv.z, 0.0, 28.0 * uPixel); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC * a * a, 1.0); }`,
    });
    this.sparks = new THREE.Points(geo, m);
    this.sparks.frustumCulled = false;
    this.sparks.renderOrder = 7;
    this.sparkData = Array.from({ length: n }, () => ({ life: 0, max: 1, p: V(), v: V(), c: [1, 0.6, 0.2], s: 0.2 }));
    this.sparkI = 0;
    this.group.add(this.sparks);
  }

  burst(p, n, { speed = 4, up = 2, life = 1.4, color = [1.6, 1.0, 0.35], size = 0.25, spread = 0.6 } = {}) {
    const rng = this._rng || (this._rng = new RNG('sparks'));
    for (let i = 0; i < n; i++) {
      const s = this.sparkData[this.sparkI];
      this.sparkI = (this.sparkI + 1) % this.sparkN;
      s.p.copy(p).add(V(rng.range(-spread, spread), rng.range(-spread, spread), rng.range(-spread, spread)));
      const a = rng.range(0, TAU), el = rng.range(-0.2, 1.2);
      s.v.set(Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el)).multiplyScalar(speed * rng.range(0.3, 1)).add(V(0, up, 0));
      s.max = s.life = life * rng.range(0.6, 1.2);
      s.c = color;
      s.s = size * rng.range(0.6, 1.3);
    }
  }

  // ---- events ---------------------------------------------------------------------------------
  isPollinated(l) { return this.pollinated.has(l.id); }

  touchdown(l, who = 'player') {
    const t = this.now;
    const first = !this.pollinated.has(l.id);
    this.pollinated.set(l.id, t);
    const note = PENTA[(l.id * 7) % PENTA.length];
    if (l.kind === 'flora') {
      this.flowerTouch[l.index] = t;
      this.audio?.bell(note, 0.05, 0);
      this.audio?.bell(note + 7, 0.025, 0, 0.18);
    } else if (l.kind === 'hero') {
      this.heroRespondAt = t + 0.6;
      this.audio?.chord([62, 66, 69, 73, 76], 0.035, 0.08);
    } else if (l.kind === 'lily') {
      this.lilyLandAt = t;
      this.audio?.chord([78, 83], 0.04, 0.12);
    } else if (l.kind === 'blossom') {
      this.sipUntil = t + 3;
      this.audio?.bell(86, 0.05);
      this.audio?.bell(93, 0.03, 0.2, 0.15);
    } else if (l.kind === 'grown') {
      l.ref.pollinated = 1;
      l.ref.flareAt = t;
      this.audio?.bell(note + 12, 0.045, 0);
    }
    this.burst(l.spot, 18, { speed: 2.5, up: 1.5, life: 1.2, size: 0.18 });
    this.emit('pollinate', { landable: l, first, who });
  }

  deposit(amount, who = 'player') {
    const t = this.now;
    this.depositAt = t;
    this.honey++;
    this.audio?.chord([62, 69, 74, 78, 81], 0.04, 0.1);
    const site = amount > 0.05 ? this.growth.sprout(t + 1.6) : null;
    if (site) {
      setTimeout(() => this.audio?.chord([74, 78, 81, 86], 0.03, 0.22), 1700);
      this._siteBursts = { site, t: t + 1.6 };
    }
    this.emit('deposit', { amount, honey: this.honey, site, who });
  }

  windBusy() { return !!this.wind && this.now - this.wind.t0 < 10; }

  windUp(source = 'player') {
    if (this.windBusy()) return false;
    this.wind = { t0: this.now, source, wave: false };
    this.windCount++;
    this.audio?.ratchet(16, 0.22);
    this.audio?.swell(73, 220, 1.7, 0.06);
    this.burst(L.escapement.clone().add(V(0, 1.5, 0)), 30, { speed: 4, up: 2, life: 1.2, size: 0.22 });
    this.emit('wind', { source });
    return true;
  }

  // ---- per frame -----------------------------------------------------------------------------------
  // before the world update: clocks and context overrides
  pre(now, dt, ctx, bodies) {
    this.now = now;
    this.night = 1 - Math.min(1, ctx.dawn / 0.55);
    const w = this.wind;
    const wt = w ? now - w.t0 : 99;
    // winding races the movement, then the train
    const frenzy = wt < 2.2 ? Math.sin(Math.PI * clamp(wt / 2.2)) : 0;
    const spin = wt > 1.7 && wt < 7 ? Math.sin(Math.PI * clamp((wt - 1.7) / 5.3)) : 0;
    this.escT += dt * (1 + frenzy * 7);
    this.crownT += dt * (1 + spin * 6);
    ctx.escT = 70 + this.escT;
    ctx.crownT = 70 + this.crownT;
    // the hero flower answers a landing, or the wound stem
    let respond = this.heroRespondAt;
    if (w && wt > 3.2 && (respond === undefined || respond < w.t0 + 3.2)) respond = w.t0 + 3.3;
    ctx.respondAt = respond === undefined ? -1000 : respond - now + ctx.t;
    // lily dips under the bee, blossom glows while sipped
    ctx.lilyLandAt = this.lilyLandAt === undefined ? undefined : this.lilyLandAt - now + ctx.t;
    ctx.lilyWeight = 0.55;
    ctx.sip = now < this.sipUntil ? smooth(clamp((this.sipUntil - now) / 0.6)) * smooth(clamp((now - this.sipUntil + 3) / 0.5)) : 0;
    const ds = now - this.depositAt;
    ctx.skepFlare = ds > 0 && ds < 6 ? Math.sin(Math.PI * clamp(ds / 0.5)) * 2 * (ds < 0.5 ? 1 : 0) + (ds >= 0.5 ? 2 * Math.exp(-(ds - 0.5) * 0.9) : 0) : 0;
    // the armillary: spun by a passing bee or the wave, then coasts
    for (const b of bodies) {
      if (!b) continue;
      const d = b.pos.distanceTo(ARM);
      if (d < 24 && b.speed > 2 && (this._armTouch === undefined || now - this._armTouch > 1.5)) {
        this._armTouch = now;
        this.armSpin = Math.min(4, this.armSpin + 1.4);
        this.audio?.chord([69, 76, 81], 0.03, 0.1);
        this.burst(ARM, 20, { speed: 6, up: 0, life: 1.2, size: 0.4, spread: 6 });
      }
    }
    if (w && !w.armDone && wt > 3.4 + 560 / WAVE_SPEED) { w.armDone = true; this.armSpin = Math.min(4, this.armSpin + 2); }
    this.armSpin *= Math.exp(-dt * 0.35);
    this.armA += dt * (0.12 + this.armSpin);
    this.armGlowK += ((this.armSpin > 0.3 ? 1 : 0) - this.armGlowK) * (1 - Math.exp(-dt * 2));
    const core = this.world.flora.armCore.material;
    if (core.emissiveIntensity !== undefined) core.emissiveIntensity = 0.5 + this.night * 0.8 + this.armGlowK * 3.5;
    // kindle what the bees pass
    this._kindle(bodies);
    // blooms near a bee open to it (eased, so they swing like the film's petals)
    const fl = this.world.flora.flowers;
    const b0 = bodies[0];
    for (let i = 0; i < fl.length; i++) {
      let target = 0;
      if (b0) {
        const f = fl[i];
        const dx = b0.pos.x - f.top.x, dz = b0.pos.z - f.top.z;
        if (Math.abs(dx) < 16 && Math.abs(dz) < 16) {
          const d = Math.hypot(dx, dz, (b0.pos.y - f.top.y) * 0.7);
          target = clamp(1 - (d - 4) / 10);
        }
        if (b0.landedOn === f.landing) target = 1;
      }
      this.welcome[i] += (target - this.welcome[i]) * (1 - Math.exp(-dt * (target > this.welcome[i] ? 3 : 1.2)));
      const f = fl[i];
      const still = b0 && b0.landedOn === f.landing ? 1 : this._candidate === f.landing ? 0.7 : 0;
      this.steady[i] += (still - this.steady[i]) * (1 - Math.exp(-dt * 4));
    }
    // the bloom wave front
    if (w && wt > 3.4) {
      const r = (wt - 3.4) * WAVE_SPEED;
      const rPrev = Math.max(0, (wt - dt - 3.4) * WAVE_SPEED);
      const flowers = this.world.flora.flowers;
      for (let i = 0; i < flowers.length; i++) {
        const d = this.flowerDist[i];
        if (d <= r && d > rPrev - 1e-6) {
          this.flowerWave[i] = w.t0 + 3.4 + d / WAVE_SPEED;
          if (i % 2 === 0) this.burst(flowers[i].top.clone().add(V(0, 1.5 * flowers[i].scale, 0)), 2, { speed: 2, up: 3, life: 1.6, size: 0.45, spread: 1.5, color: [1.25, 0.7, 0.22] });
        }
      }
      // the curtain: 0 → beyond the far wall in about seven seconds
      this.ripple.visible = r < 1150;
      this.ripple.scale.set(Math.max(1, r), 70 + r * 0.08, Math.max(1, r));
      this.ripple.position.set(0.5, 1, -0.8);
      this.rippleU.uK.value = 0.32 * Math.min(1, (wt - 3.4) * 2) * (1 - clamp(r / 1150));
      this.rippleU.uTime.value = now;
      const kindle = (arr, posOf) => arr.forEach((s, i) => {
        const p = posOf(i);
        if (!p) return;
        const d = Math.hypot(p.x, p.z);
        if (d <= r && d > rPrev - 1e-6) { s.flare = now; s.lit = 1; }
      });
      kindle(this.lanterns, (i) => this.world.foliage.lanterns[i].p);
      kindle(this.orbs, (i) => this.world.flora.orbs[i].pos);
      kindle(this.lamps, (i) => this.world.garden.lamps[i].position);
      // bells chase the front: a rising arpeggio
      const step = Math.floor(wt * 3.2);
      if (step !== w.step && wt < 9) { w.step = step; if (step >= 11) this.audio?.bell(PENTA[(step - 11) % PENTA.length] + (step > 19 ? 12 : 0), 0.03, ((step % 5) - 2) * 0.25); }
      if (!w.wave) { w.wave = true; this.audio?.chord([62, 69, 74, 78], 0.03, 0.12); }
    } else if (this.ripple) this.ripple.visible = false;
    if (this._siteBursts && now > this._siteBursts.t) {
      const s = this._siteBursts;
      for (const b of s.site.blooms) this.burst(b.base.clone().add(V(0, 1, 0)), 10, { speed: 3, up: 5, life: 1.6, size: 0.22, color: [1.2, 1.1, 0.7] });
      this._siteBursts = null;
    }
  }

  _kindle(bodies) {
    const now = this.now;
    for (const b of bodies) {
      if (!b) continue;
      const p = b.pos;
      this.world.foliage.lanterns.forEach((l, i) => {
        const s = this.lanterns[i];
        if (s.lit < 1 && p.distanceToSquared(l.p) < 30 * 30) {
          s.lit = 1; s.flare = now;
          this.burst((l.now || l.p).clone().add(V(0, 2 * l.sc, 0)), 26, { speed: 5, up: 1, life: 1.6, size: 0.42, spread: 2.2 * l.sc, color: [1.7, 0.95, 0.35] });
          this.audio?.bell(PENTA[i % PENTA.length] + 12, 0.025, 0); this.emit('kindle', { kind: 'lantern' });
        }
      });
      this.world.flora.orbs.forEach((o, i) => {
        const s = this.orbs[i];
        if (s.lit < 1 && o.pos && p.distanceToSquared(o.pos) < 16 * 16) { s.lit = 1; s.flare = now; }
      });
      this.world.garden.lamps.forEach((c, i) => {
        const s = this.lamps[i];
        if (s.lit < 1 && p.distanceToSquared(c.position) < 34 * 34) {
          s.lit = 1; s.flare = now;
          this.burst(c.position, 18, { speed: 4, up: 1.5, life: 1.4, size: 0.36, spread: 3, color: [1.6, 0.95, 0.4] });
          this.audio?.bell(PENTA[(i * 3) % PENTA.length], 0.025); this.emit('kindle', { kind: 'lamp' });
        }
      });
    }
  }

  // after the world update: light along the roots and up the stem while winding
  post(dt, bodies, ctx, landable) {
    this._candidate = landable;
    const now = this.now;
    const w = this.wind;
    const wt = w ? now - w.t0 : 99;
    const world = this.world;
    const P = world.lighting.pulse;
    P.intensity = 0;
    if (w && wt < 12) {
      for (const r of world.roots.roots) {
        const main = r === world.mainRoot;
        const t0 = main ? 0.3 : 1.9 + (r.len % 7) * 0.05, dur = main ? 1.6 : 1.8;
        const k = clamp((wt - t0) / dur);
        const active = wt >= t0;
        r.pulse.uPulse.value = active ? lerp(-0.02, 1.04, smooth(k)) : -1;
        r.pulse.uCharge.value = active ? clamp(k * 1.2) * 0.9 : 0.3;
        r.pulse.uPulseGain.value = active ? 1 - clamp((wt - t0 - dur) / 2) * 0.7 : 0;
        if (main && active && k < 1) {
          r.curve.getPointAt(smooth(k), P.position);
          P.position.y += 0.6;
          P.intensity = 7;
          P.distance = 18;
        }
      }
      const vk = clamp((wt - 1.9) / 1.5);
      const vp = world.flower.veinPulse;
      if (wt > 1.9 && wt < 4.2) {
        vp.uPulse.value = lerp(-0.05, 1.08, smoother(vk));
        vp.uCharge.value = clamp(vk * 1.4) * 0.8;
        world.flower.stemCurve.getPointAt(clamp(vp.uPulse.value), P.position);
        P.position.add(V(-0.6, 0, 0.6));
        P.intensity = 4 * (1 - sseg(wt, 3.4, 4.2));
        P.distance = 18;
      }
      world.escapement.outletGlow.material.color.multiplyScalar(1 + Math.exp(-wt * 2) * 4);
    }
    // pollen bosses: dim gold until pollinated, then lit; flare with touch and wave
    const flowers = world.flora.flowers;
    const col = this._col || (this._col = new THREE.Color());
    const day = ctx.dawn;
    for (let i = 0; i < flowers.length; i++) {
      const f = flowers[i];
      const id = f.landing?.id;
      const pol = id !== undefined && this.pollinated.has(id);
      const dt0 = now - this.flowerTouch[i], dw = now - this.flowerWave[i];
      let g = (pol ? 1.25 + 0.2 * Math.sin(now * 2.4 + f.sway) : 0.1 + this.night * (0.42 + 0.12 * Math.sin(now * 1.7 + f.sway * 3)));
      if (dt0 > 0 && dt0 < 3) g += Math.exp(-dt0 * 1.8) * 3;
      if (dw > 0 && dw < 3) g += Math.sin(Math.PI * clamp(dw / 0.6)) * (dw < 0.6 ? 1.6 : 0) + (dw >= 0.6 ? 1.6 * Math.exp(-(dw - 0.6) * 1.6) : 0);
      col.setRGB(1.0 * g, 0.62 * g, 0.22 * g);
      this.bosses.setColorAt(i, col);
    }
    this.bosses.instanceColor.needsUpdate = true;
    // landing marker
    if (landable && landable.enabled !== false) {
      this.marker.visible = true;
      this.marker.position.copy(landable.spot).add(V(0, -0.9, 0));
      const pulse = 0.5 + 0.5 * Math.sin(now * 4);
      this.marker.scale.setScalar(landable.radius * (0.9 + pulse * 0.12));
      const a = 0.35 + pulse * 0.35;
      this.markerMat.color.setRGB(1.2 * a, 0.85 * a, 0.4 * a);
    } else this.marker.visible = false;
    // sparks
    const pos = this.sparks.geometry.attributes.position, cl = this.sparks.geometry.attributes.color, sz = this.sparks.geometry.attributes.size;
    for (let i = 0; i < this.sparkN; i++) {
      const s = this.sparkData[i];
      if (s.life > 0) {
        s.life -= dt;
        s.v.multiplyScalar(Math.exp(-dt * 1.6));
        s.v.y -= dt * 0.6;
        s.p.addScaledVector(s.v, dt);
        const k = Math.max(0, s.life / s.max);
        const tw = 0.6 + 0.4 * Math.sin(now * 23 + i);
        pos.setXYZ(i, s.p.x, s.p.y, s.p.z);
        cl.setXYZ(i, s.c[0] * k * tw, s.c[1] * k * tw, s.c[2] * k * tw);
        sz.setX(i, s.s * (0.4 + k));
      } else sz.setX(i, 0);
    }
    pos.needsUpdate = cl.needsUpdate = sz.needsUpdate = true;
    this.sparkU.uPixel.value = ctx.pixelRatio || 1;
    // escapement ticks are heard near it
    const ts = tickState(ctx.escT ?? 0);
    if (ts.count !== this._tick) {
      this._tick = ts.count;
      const b = bodies[0];
      const near = b ? 1 / (1 + Math.max(0, b.pos.distanceTo(L.escapement) - 4) / 10) : 0;
      this.audio?.tick(ts.count % 2 === 0, near * 0.4);
    }
  }
}

function mergeAll(parts) {
  // positions + normals only, non-indexed
  const geos = parts.map((g) => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; });
  let count = 0;
  for (const g of geos) count += g.attributes.position.count;
  const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3);
  let o = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    o += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return out;
}
