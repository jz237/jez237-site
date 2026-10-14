import * as THREE from 'three';
import {TANK} from './Case';
import type {Cloud, Clouds} from './Clouds';
import type {WindField} from './WindField';

/** Levels the funnel's axis and radius are described at, ground to cloud base. */
const N_AX = 24;
const MAX_BITS = 340;
const TAU = Math.PI * 2;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const ss = (a: number, b: number, x: number) => {const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t);};
const approach = (x: number, target: number, rate: number, dt: number) => x + (target - x) * (1 - Math.exp(-rate * dt));

export type TornadoPhase = 'idle' | 'brewing' | 'forming' | 'mature' | 'roping';

interface Bit {
  alive: boolean;
  rho: number; phi: number; h: number; // around the axis at its own height
  vr: number; vh: number;
  /** Height at which it leaves the updraft and is flung out. */
  out: number;
  kind: number; // 0 soil, 1 leaf litter and moss, 2 spray
  size: number; alpha: number; age: number;
  pos: THREE.Vector3; vel: THREE.Vector3;
}

/**
 * A tornado under a storm cloud. The rotating cloud lowers a wall cloud; a
 * condensation funnel reaches down from it while a whirl of soil and litter is
 * already spinning up on the ground; the vortex then wanders under its storm,
 * leaning as the ground drags its foot, and finally ropes out: thinning,
 * stretching and writhing before it lifts back into the cloud.
 *
 * The funnel and the debris cloud are one ray-marched volume (helical
 * striations turn with the air, the surface is torn by billows and frays at
 * the tip, the base is dusty). Debris is simulated as motion-blurred specks
 * spiralling up the core and thrown out aloft. The vortex also stirs the air
 * of the case, so plants, rain, fog, dust and loose leaves are drawn into it;
 * over the pool it becomes a waterspout.
 */
export class Tornado {
  readonly group = new THREE.Group();
  readonly mesh: THREE.Mesh;
  private distMat: THREE.ShaderMaterial;
  private distRes = {value: new THREE.Vector2(1, 1)};
  readonly uniforms: Record<string, THREE.IUniform>;
  phase: TornadoPhase = 'idle';
  /** Strength of the vortex, 0..1 (wind, debris, sound). */
  intensity = 0;
  /** 0..1 how much of the funnel reaches the ground. */
  touch = 0;
  /** 0..1 over the pool: a waterspout. */
  water = 0;
  /** The storm cloud it hangs from. */
  cloud: Cloud | null = null;
  /** Foot of the vortex (on the ground or the water) and the top of the funnel under the cloud. */
  readonly ground = new THREE.Vector3(0, 0.15, 0);
  readonly top = new THREE.Vector3(0, 0.5, 0);
  /** Called a few times a second where the waterspout's foot whips the pool. */
  onWater?: (x: number, z: number, strength: number) => void;
  /** Called about once a second while the vortex scours the ground. */
  onGround?: (p: THREE.Vector3) => void;
  /** The funnel has reached the ground (once per tornado). */
  onTouchdown?: (water: boolean) => void;
  private age = 0;
  private life = 40;
  /** The storm the brewed cloud was heading for before brewing (it goes back to it if no tornado comes). */
  private brewedFrom = 0;
  private time = 0;
  private ext = 0;
  private groundR = 0.004;
  private topR = 0.01;
  private wallR = 0.02;
  private debris = 0;
  private rope = 0;
  private fade = 0;
  private spin = 0;
  private spinD = 0;
  private rise = 0;
  private bend = new THREE.Vector2();
  private ropeDir = new THREE.Vector2(1, 0);
  private wander = Math.random() * 100;
  private touched = false;
  private waterT = 0;
  private groundT = 0;
  private tableX = new Float32Array(N_AX);
  private tableZ = new Float32Array(N_AX);
  private bits: Bit[] = [];
  private spawnBudget = 0;
  private streaks: THREE.Mesh[] = [];
  private buf: {pos: Float32Array; vel: Float32Array; aux: Float32Array; geo: THREE.InstancedBufferGeometry}[] = [];
  private tmp = new THREE.Vector2();

  /**
   * `floorAt`: the height of whatever the foot stands on (ground, rock or water);
   * `isWater`: whether that is the pool; `shared`: the clouds' light and noise,
   * `particleLight`: the rain's light, for the debris.
   */
  constructor(
    private floorAt: (x: number, z: number) => number,
    private isWater: (x: number, z: number) => boolean,
    shared: Clouds['shared'],
    particleLight: {uLight: THREE.IUniform; uAmbient: THREE.IUniform; uFlash: THREE.IUniform; uRes: THREE.IUniform},
  ) {
    this.uniforms = {
      tNoise: shared.tNoise, tDepth: shared.tDepth, uUseDepth: shared.uUseDepth, uResolution: shared.uResolution,
      uLightPos: shared.uLightPos, uLightColor: shared.uLightColor, uAmbient: shared.uAmbient, uSky: shared.uSky, uFlash: shared.uFlash,
      uAxis: {value: Array.from({length: N_AX}, () => new THREE.Vector4())},
      uY: {value: new THREE.Vector2(0, 1)},
      uLook: {value: new THREE.Vector4()},
      uLook2: {value: new THREE.Vector4(0, 0.05, 0.035, 0)},
      uSpin: {value: 0}, uSpinD: {value: 0}, uRise: {value: 0}, uSlope: {value: 0},
      uBoxMin: {value: new THREE.Vector3()}, uBoxMax: {value: new THREE.Vector3()},
      uSeed: {value: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10)},
      uSteps: {value: 56},
    };
    const geo = new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5);
    const vertexShader = /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
    const common = {
      transparent: true, depthWrite: false, depthTest: false, side: THREE.BackSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader, fragmentShader: TORNADO_FRAG,
    } as const;
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({uniforms: this.uniforms, ...common}));
    this.distMat = new THREE.ShaderMaterial({uniforms: {...this.uniforms, uResolution: this.distRes}, defines: {TORNADO_DIST: 1}, ...common});
    this.mesh.frustumCulled = false;
    // (with the clouds: in the glass pass and in the pool's reflection; after the panes, before the clouds)
    this.mesh.layers.set(2);
    this.mesh.renderOrder = 10.005;
    this.mesh.visible = false;
    this.mesh.name = 'tornado';
    this.group.add(this.mesh);

    for (let i = 0; i < MAX_BITS; i++) this.bits.push({alive: false, rho: 0, phi: 0, h: 0, vr: 0, vh: 0, out: 0, kind: 0, size: 0, alpha: 0, age: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3()});
    // debris: motion-blurred specks, in two draws (behind the funnel, then in front of it)
    const quad = () => {
      const g = new THREE.InstancedBufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0], 3));
      g.setIndex([0, 1, 2, 1, 3, 2]);
      const pos = new Float32Array(MAX_BITS * 3), vel = new Float32Array(MAX_BITS * 3), aux = new Float32Array(MAX_BITS * 4);
      g.setAttribute('iPos', new THREE.InstancedBufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('iVel', new THREE.InstancedBufferAttribute(vel, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('iAux', new THREE.InstancedBufferAttribute(aux, 4).setUsage(THREE.DynamicDrawUsage));
      g.instanceCount = 0;
      this.buf.push({pos, vel, aux, geo: g});
      return g;
    };
    const debrisMat = new THREE.ShaderMaterial({
      uniforms: particleLight,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: DEBRIS_VERT, fragmentShader: DEBRIS_FRAG,
    });
    for (const order of [10.004, 10.006]) {
      const m = new THREE.Mesh(quad(), debrisMat);
      m.frustumCulled = false;
      m.layers.set(2);
      m.renderOrder = order;
      m.name = 'tornado-debris';
      this.streaks.push(m);
      this.group.add(m);
    }
  }

  get active() {return this.phase !== 'idle';}
  /** On the ground or coming down (not brewing, not roping out). */
  get live() {return this.phase === 'forming' || this.phase === 'mature';}

  /**
   * Asks for a tornado: from the stormiest cloud if there is a storm, or after
   * feeding the biggest cloud into one first.
   */
  request(clouds: Clouds): TornadoPhase {
    if (this.active) return this.phase;
    const live = clouds.clouds.filter((c) => !c.dissolving);
    const stormy = live.reduce<Cloud | null>((a, c) => (!a || c.storm * Math.min(1, c.water) > a.storm * Math.min(1, a.water) ? c : a), null);
    this.reset();
    if (stormy && stormy.storm > 0.4 && stormy.water > 0.6) {
      this.cloud = stormy;
      this.phase = 'forming';
    } else {
      this.cloud = live.reduce<Cloud | null>((a, c) => (!a || c.size * (0.5 + c.water) > a.size * (0.5 + a.water) ? c : a), null)
        ?? clouds.spawn({x: (Math.random() - 0.5) * 0.4, z: (Math.random() - 0.5) * 0.12, size: 0.5, water: 0.7, fadeIn: true});
      this.brewedFrom = this.cloud.stormTarget;
      this.phase = 'brewing';
    }
    this.placeUnder(this.cloud);
    return this.phase;
  }

  /** Sends it back up: the funnel ropes out and lifts into the cloud. */
  dissipate() {
    if (this.phase === 'brewing') {this.unbrew(); return;}
    if (this.live) {this.phase = 'roping'; this.age = 0;}
  }

  /** No tornado after all: the storm the brewing built settles back to what the cloud had. */
  private unbrew() {
    const c = this.cloud;
    if (c && !c.dissolving) c.stormTarget = Math.min(c.stormTarget, this.brewedFrom);
    this.phase = 'idle';
  }

  private reset() {
    this.age = 0;
    this.life = 38 + Math.random() * 22;
    this.ext = 0; this.debris = 0; this.rope = 0; this.fade = 0; this.intensity = 0; this.touch = 0;
    this.groundR = 0.004; this.topR = 0.012; this.wallR = 0.03;
    this.bend.set(0, 0);
    this.touched = false;
    for (const b of this.bits) b.alive = false;
  }

  private placeUnder(c: Cloud) {
    this.top.set(c.pos.x, c.baseY + 0.012, c.pos.z);
    this.ground.set(clamp(c.pos.x, -TANK.w / 2 + 0.06, TANK.w / 2 - 0.06), 0, clamp(c.pos.z, -TANK.d / 2 + 0.05, TANK.d / 2 - 0.05));
    this.ground.y = this.floorAt(this.ground.x, this.ground.z);
    this.water = this.isWater(this.ground.x, this.ground.z) ? 1 : 0;
  }

  /** The vortex in the case's air: called before the wind field steps. */
  force(wind: WindField, dt: number) {
    const I = this.intensity, V = wind.vortex;
    V.v = I < 0.01 ? 0 : 1.15 * I;
    if (!V.v) return;
    V.x = this.ground.x; V.z = this.ground.z;
    V.core = 0.03 + 0.012 * (1 - this.rope);
    V.reach = 0.22;
    // (and stirs the simulated air round it, which carries the swirl further out)
    wind.addVortex(this.ground.x, this.ground.z, 0.6 * I, 0.05, 0.26, 1 - Math.exp(-dt * 4 * I));
  }

  /**
   * Extra air movement at p from the vortex (m/s) that the flat wind field can't
   * carry: the updraft in the core, inflow along the ground, outflow aloft, and
   * the swirl round the funnel where it leans away from its foot.
   */
  airflow(p: THREE.Vector3, out: THREE.Vector3) {
    out.set(0, 0, 0);
    const I = this.intensity;
    if (I < 0.01) return out;
    const H = Math.max(0.05, this.top.y - this.ground.y);
    const h = p.y - this.ground.y, s = clamp(h / H, 0, 1);
    this.centreAt(s, this.tmp);
    const dx = p.x - this.tmp.x, dz = p.z - this.tmp.y, r = Math.hypot(dx, dz) + 1e-4;
    const rc = 0.03;
    const core = Math.exp(-((r / (rc * 1.7)) ** 2));
    out.y = I * 0.6 * core * (1 - ss(0.65, 1, s)) * (h > -0.01 ? 1 : 0);
    const radial = h < 0.035 ? -0.3 * I * Math.exp(-r / 0.1) * Math.min(1, r / rc) : h > 0.1 ? 0.22 * I * core : 0;
    // swirl round the leaning funnel, over what the field has round its foot
    const fx = p.x - this.ground.x, fz = p.z - this.ground.z, fr = Math.hypot(fx, fz) + 1e-4;
    const vt = (r2: number) => 1.1 * I * (r2 < rc ? r2 / rc : rc / r2);
    const lean = ss(0.05, 0.3, s);
    out.x = (dx / r) * radial + lean * (vt(r) * dz / r - vt(fr) * fz / fr);
    out.z = (dz / r) * radial + lean * (-vt(r) * dx / r + vt(fr) * fx / fr);
    return out;
  }

  /** Centre of the funnel (xz) at height fraction s, from this frame's axis. */
  centreAt(s: number, out: THREE.Vector2) {
    const f = clamp(s, 0, 1) * (N_AX - 1), i = Math.min(N_AX - 2, Math.floor(f)), t = f - i;
    return out.set(this.tableX[i] + (this.tableX[i + 1] - this.tableX[i]) * t, this.tableZ[i] + (this.tableZ[i + 1] - this.tableZ[i]) * t);
  }

  update(dt: number, clouds: Clouds, wind: WindField, camera: THREE.Camera) {
    this.time += dt;
    if (this.phase === 'idle') {this.hide(); return;}
    this.age += dt;
    // the parent cloud: if it merged into another, the vortex goes with the merged storm
    let c = this.cloud;
    if (c && (c.dissolving || !clouds.clouds.includes(c))) {
      const near = clouds.clouds.filter((k) => !k.dissolving && Math.hypot(k.pos.x - c!.pos.x, k.pos.z - c!.pos.z) < 0.3);
      c = this.cloud = near.sort((a, b) => b.storm - a.storm)[0] ?? null;
    }
    if (this.phase === 'brewing') {
      if (!c) {this.phase = 'idle'; return;}
      clouds.brew(c, dt);
      this.placeUnder(c);
      this.hide();
      if (this.age > 3 && c.storm > 0.5) {this.phase = 'forming'; this.age = 0;}
      else if (this.age > 30) this.unbrew();
      return;
    }
    if (!c && this.live) {this.phase = 'roping'; this.age = 0;}
    if (c && this.live) {
      // (evaporated small with right-clicks, the storm can't hold it up)
      if (c.size < 0.8) {this.phase = 'roping'; this.age = 0;}
      else clouds.sustain(c, dt, this.intensity);
      // a supercell's rain falls on its forward flank: the funnel hangs under the
      // rain-free base behind it, with the rain curtain alongside
      const k = this.intensity;
      for (const r of clouds.sources) {
        if (r.cloud !== c) continue;
        const dx = r.x - this.top.x, dz = r.z - this.top.z, d = Math.hypot(dx, dz) || 1;
        r.x = clamp(r.x + (dx / d) * c.radius * 0.55 * k, -TANK.w / 2 + 0.03, TANK.w / 2 - 0.03);
        r.z = clamp(r.z + (dz / d) * c.radius * 0.3 * k, -TANK.d / 2 + 0.03, TANK.d / 2 - 0.03);
        r.radius *= 1 - 0.35 * k;
        r.rate *= 1 - 0.3 * k;
      }
      if (this.phase === 'mature' && (this.age > this.life || c.storm < 0.25)) {this.phase = 'roping'; this.age = 0;}
    }
    if (this.phase === 'forming' && this.age > 5.5) {this.phase = 'mature'; this.age = 0;}

    // targets for this stage of its life
    const t = this.time, a = this.age;
    let ext = 1, debris = 1, I = 1, rope = 0, fade = 1, gR = 0.016, tR = 0.042, wR = 0.085;
    if (this.phase === 'forming') {
      // the wall cloud lowers and a funnel cloud grows down from it; the ground
      // circulation spins up before the condensation gets there
      ext = a < 2.8 ? 0.45 * ss(0, 2.8, a) : 0.45 + 0.55 * ss(2.8, 5.5, a);
      debris = ss(1.6, 4.6, a);
      I = ss(0.4, 4.5, a);
      fade = ss(0, 0.8, a);
      gR = 0.006 + 0.008 * ss(2, 5.5, a);
    } else if (this.phase === 'mature') {
      // it breathes: a cone, a stovepipe, a cone again; now and then it lifts a little
      const w = 0.5 + 0.5 * Math.sin(t * 0.11 + this.wander) * Math.sin(t * 0.047 + 1.3);
      gR = 0.009 + 0.01 * w;
      tR = 0.036 + 0.012 * (1 - w);
      ext = 1 - 0.1 * ss(0.75, 1, Math.sin(t * 0.09 + this.wander * 2) * 0.5 + 0.5);
    } else if (this.phase === 'roping') {
      rope = ss(0, 3.2, a);
      gR = 0.016 - 0.012 * rope;
      tR = 0.042 - 0.031 * rope;
      wR = 0.085 - 0.04 * rope;
      I = 1 - ss(1.5, 6.5, a);
      debris = 1 - ss(0.4, 4.2, a);
      ext = 1 - ss(4.2, 7.4, a);
      fade = 1 - ss(6.4, 7.8, a);
      if (a > 7.8) {this.phase = 'idle'; this.hide(); return;}
    }
    const k = this.phase === 'forming' ? 4 : 1.6;
    this.ext = approach(this.ext, ext, k, dt);
    this.debris = approach(this.debris, debris, 1.8, dt);
    this.intensity = approach(this.intensity, I, 2.2, dt);
    this.rope = approach(this.rope, rope, 2.5, dt);
    this.fade = approach(this.fade, fade, 3, dt);
    this.groundR = approach(this.groundR, gR, 1.4, dt);
    this.topR = approach(this.topR, tR, 1.4, dt);
    this.wallR = approach(this.wallR, wR, 1.2, dt);
    this.touch = ss(0.82, 0.97, this.ext);
    if (!this.touched && this.touch > 0.6) {this.touched = true; this.onTouchdown?.(this.water > 0.5);}

    // the top hangs under the cloud's base, and follows it when it is dragged
    if (c) {
      const off = 0.16 * c.radius;
      const tx = c.pos.x + Math.cos(c.yaw + 2.2) * off, tz = c.pos.z + Math.sin(c.yaw + 2.2) * off * 0.5;
      this.top.x = approach(this.top.x, tx, 6, dt);
      this.top.z = approach(this.top.z, tz, 6, dt);
      this.top.y = approach(this.top.y, c.baseY + 0.014, 4, dt);
    }
    this.top.x = clamp(this.top.x, -TANK.w / 2 + 0.05, TANK.w / 2 - 0.05);
    this.top.z = clamp(this.top.z, -TANK.d / 2 + 0.04, TANK.d / 2 - 0.04);
    // the foot wanders under the storm and lags behind it (the funnel leans);
    // roping out, it is left behind and the funnel stretches into a rope
    const g = this.ground;
    let gx: number, gz: number, maxV: number;
    if (this.phase === 'roping') {
      const dx = g.x - this.top.x, dz = g.z - this.top.z, d = Math.hypot(dx, dz);
      if (d > 1e-3 && a < 0.1) this.ropeDir.set(dx / d, dz / d);
      gx = this.top.x + this.ropeDir.x * 0.13 * this.rope;
      gz = this.top.z + this.ropeDir.y * 0.06 * this.rope;
      maxV = 0.045;
    } else {
      gx = this.top.x + Math.sin(t * 0.23 + this.wander) * 0.022 + Math.sin(t * 0.61 + 2 * this.wander) * 0.008;
      gz = this.top.z + Math.sin(t * 0.19 + 3 * this.wander) * 0.018;
      maxV = 0.06;
    }
    {
      const vx = (gx - g.x) * 0.9, vz = (gz - g.z) * 0.9, v = Math.hypot(vx, vz), m = v > maxV ? maxV / v : 1;
      g.x = clamp(g.x + vx * m * dt, -TANK.w / 2 + 0.055, TANK.w / 2 - 0.055);
      g.z = clamp(g.z + vz * m * dt, -TANK.d / 2 + 0.045, TANK.d / 2 - 0.045);
    }
    g.y = approach(g.y, this.floorAt(g.x, g.z), 5, dt);
    this.water = approach(this.water, this.isWater(g.x, g.z) ? 1 : 0, 2.5, dt);

    // the axis: a curve from the foot to the cloud, bowed by the wind aloft and,
    // roping out, writhing like a snake
    const w = wind.sample((g.x + this.top.x) / 2, (g.z + this.top.z) / 2, this.tmp);
    this.bend.x = approach(this.bend.x, clamp(w.x * 0.03, -0.02, 0.02) + Math.sin(t * 0.37 + this.wander) * 0.008, 1.5, dt);
    this.bend.y = approach(this.bend.y, clamp(w.y * 0.03, -0.015, 0.015) + Math.sin(t * 0.29 + 2.1) * 0.006, 1.5, dt);
    this.writeAxis(t);

    // its motion: the funnel turns faster as it narrows (and faster still as a rope)
    const omega = (4.5 + 4 * this.intensity) * (1 + 1.6 * this.rope);
    this.spin = (this.spin + omega * dt) % TAU;
    this.spinD = (this.spinD + omega * 0.6 * dt) % TAU;
    this.rise += (0.1 + 0.25 * this.intensity) * dt;
    const u = this.uniforms;
    u.uSpin.value = this.spin;
    u.uSpinD.value = this.spinD;
    u.uRise.value = this.rise;
    const dRad = this.water > 0.5 ? 0.034 + 0.016 * this.intensity : 0.034 + 0.03 * this.intensity;
    const dH = this.water > 0.5 ? 0.026 : 0.05;
    (u.uLook.value as THREE.Vector4).set(this.ext, this.debris * this.touchGround(), this.rope, this.fade);
    (u.uLook2.value as THREE.Vector4).set(this.water, dRad, dH, 0);
    this.fitBox(dRad, dH);
    this.mesh.visible = this.fade > 0.003;

    this.stepDebris(dt, camera);
    // what it does to its surroundings
    if (this.intensity > 0.2 && this.debris > 0.2) {
      if (this.water > 0.5) {
        this.waterT -= dt * 14 * this.intensity;
        while (this.waterT < 0) {
          this.waterT += 1;
          const ang = Math.random() * TAU, r = 0.012 + Math.random() * 0.04;
          this.onWater?.(g.x + Math.cos(ang) * r, g.z + Math.sin(ang) * r, this.intensity * this.debris);
        }
      }
      this.groundT -= dt;
      if (this.groundT < 0) {this.groundT = 0.8 + Math.random() * 0.6; this.onGround?.(g);}
    }
  }

  /** The circulation reaches the ground (debris) once the funnel is far enough down. */
  private touchGround() {return this.phase === 'forming' ? ss(0.25, 0.6, this.ext) : 1;}

  private writeAxis(t: number) {
    const g = this.ground, top = this.top;
    const y0 = g.y, y1 = Math.max(top.y, y0 + 0.08);
    const ax = this.uniforms.uAxis.value as THREE.Vector4[];
    // directions across and along the lean, for the writhing
    let lx = top.x - g.x, lz = top.z - g.z;
    const ll = Math.hypot(lx, lz);
    if (ll > 1e-4) {lx /= ll; lz /= ll;} else {lx = 1; lz = 0;}
    const amp = 0.0035 + 0.032 * this.rope;
    const tip = 1 - this.ext;
    const mx = (g.x + top.x) / 2 + this.bend.x, mz = (g.z + top.z) / 2 + this.bend.y;
    let slope = 0;
    for (let i = 0; i < N_AX; i++) {
      const s = i / (N_AX - 1), q = 1 - s;
      let cx = q * q * g.x + 2 * q * s * mx + s * s * top.x;
      let cz = q * q * g.z + 2 * q * s * mz + s * s * top.z;
      const env = Math.sin(Math.PI * s) * (0.35 + 0.65 * s);
      const w1 = Math.sin(TAU * 1.4 * s - t * 2.3 + this.wander) * amp * env;
      const w2 = Math.sin(TAU * 2.2 * s - t * 1.7 + 2 * this.wander) * amp * 0.55 * env;
      cx += -lz * w1 + lx * w2;
      cz += lx * w1 + lz * w2 * 0.6;
      // radius: narrow at the foot, flaring under the cloud into the wall cloud
      let R = this.groundR + (this.topR - this.groundR) * Math.pow(s, 1.4);
      R += (this.wallR - R) * Math.pow(ss(0.8, 1, s), 1.5);
      // (a tip while it is coming down; on the ground it is broad to the bottom)
      const down = ss(0.9, 1, this.ext);
      R *= Math.sqrt(ss(tip - 0.14 * down, tip + 0.14 * (1 - down), s));
      // a rope is thin all along, with knots and pinches
      R *= 1 - 0.35 * this.rope * (0.5 + 0.5 * Math.sin(TAU * 3.1 * s - t * 1.1));
      ax[i].set(cx, cz, R, 0);
      this.tableX[i] = cx; this.tableZ[i] = cz;
      if (i > 0) slope = Math.max(slope, Math.hypot(cx - this.tableX[i - 1], cz - this.tableZ[i - 1]) / ((y1 - y0) / (N_AX - 1)));
    }
    (this.uniforms.uY.value as THREE.Vector2).set(y0, y1);
    this.uniforms.uSlope.value = slope;
  }

  /** The box the volume is marched in: round the funnel and its debris, inside the glass. */
  private fitBox(dRad: number, dH: number) {
    const ax = this.uniforms.uAxis.value as THREE.Vector4[];
    const y0 = (this.uniforms.uY.value as THREE.Vector2).x, y1 = (this.uniforms.uY.value as THREE.Vector2).y;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < N_AX; i++) {
      const s = i / (N_AX - 1), h = s * (y1 - y0);
      let r = Math.max(0.004, ax[i].z * 2);
      if (h < dH * 3.4) r = Math.max(r, dRad * (1 + 0.35 * h / dH) * 1.35);
      minX = Math.min(minX, ax[i].x - r); maxX = Math.max(maxX, ax[i].x + r);
      minZ = Math.min(minZ, ax[i].y - r); maxZ = Math.max(maxZ, ax[i].y + r);
    }
    const mn = this.uniforms.uBoxMin.value as THREE.Vector3, mxv = this.uniforms.uBoxMax.value as THREE.Vector3;
    mn.set(Math.max(-TANK.w / 2 + 0.003, minX), y0 - 0.012, Math.max(-TANK.d / 2 + 0.003, minZ));
    mxv.set(Math.min(TANK.w / 2 - 0.003, maxX), Math.min(TANK.h - 0.01, y1 + 0.03), Math.min(TANK.d / 2 - 0.003, maxZ));
    this.mesh.position.copy(mn);
    this.mesh.scale.subVectors(mxv, mn).max(new THREE.Vector3(1e-4, 1e-4, 1e-4));
  }

  // --- debris ---------------------------------------------------------------
  private spawn(b: Bit) {
    const spray = this.water > 0.5;
    b.alive = true;
    b.rho = 0.012 + Math.random() * 0.05;
    b.phi = Math.random() * TAU;
    b.h = 0.0015 + Math.random() * 0.006;
    b.vr = -0.05; b.vh = 0.05 + Math.random() * 0.1;
    b.out = spray ? 0.02 + Math.random() * 0.07 : 0.025 + Math.pow(Math.random(), 1.5) * 0.26;
    b.kind = spray ? 2 : Math.random() < 0.72 ? 0 : 1;
    b.size = b.kind === 0 ? 0.0006 + Math.random() * 0.0011 : b.kind === 1 ? 0.0014 + Math.random() * 0.0022 : 0.0004 + Math.random() * 0.0005;
    b.alpha = b.kind === 2 ? 0.28 + Math.random() * 0.2 : 0.75 + Math.random() * 0.25;
    b.age = 0;
  }

  private stepDebris(dt: number, camera: THREE.Camera) {
    const I = this.intensity, g = this.ground;
    const H = Math.max(0.05, this.top.y - g.y);
    const rc = 0.016 + 0.6 * this.groundR;
    const V = 0.25 + 0.75 * I;
    this.spawnBudget = Math.min(30, this.spawnBudget + dt * 220 * this.debris * this.touchGround() * (this.phase === 'roping' ? 1 - this.rope : 1));
    const toCam = new THREE.Vector2();
    const c = new THREE.Vector2();
    const counts = [0, 0];
    for (const b of this.bits) {
      if (!b.alive) {
        if (this.spawnBudget < 1) continue;
        this.spawnBudget -= 1;
        this.spawn(b);
      }
      b.age += dt;
      const vt = V * (b.rho < rc ? b.rho / rc : Math.pow(rc / b.rho, 0.8));
      const omega = Math.min(60, vt / Math.max(b.rho, 0.002));
      b.phi -= omega * dt;
      const rising = b.h < b.out && b.rho < rc * 3.2 && I > 0.15;
      const term = b.kind === 0 ? 0.24 : b.kind === 1 ? 0.11 : 0.16;
      let tr: number, th: number;
      if (rising) {
        tr = b.h < 0.012 ? -0.16 * I : -0.03 * I;
        th = (0.22 + 0.4 * I) * (b.kind === 1 ? 0.8 : 1) * (b.rho < rc * 1.8 ? 1 : 0.5);
      } else {
        tr = b.h > 0.015 ? 0.1 + 0.08 * I : 0.03;
        th = -term;
      }
      b.vr += (tr - b.vr) * (1 - Math.exp(-dt * 3));
      b.vh += (th - b.vh) * (1 - Math.exp(-dt * 2.6));
      b.rho = Math.max(0.0025, b.rho + b.vr * dt);
      b.h += b.vh * dt;
      this.centreAt(b.h / H, c);
      const cs = Math.cos(b.phi), sn = Math.sin(b.phi);
      b.pos.set(c.x + b.rho * cs, g.y + b.h, c.y + b.rho * sn);
      b.vel.set(vt * sn + b.vr * cs, b.vh, -vt * cs + b.vr * sn);
      const out = Math.abs(b.pos.x) > TANK.w / 2 - 0.004 || Math.abs(b.pos.z) > TANK.d / 2 - 0.004 || b.pos.y > TANK.h - 0.01;
      if ((b.h < 0 && b.vh < 0) || b.rho > 0.26 || out || b.age > 9) {b.alive = false; continue;}
      // behind the funnel or in front of it, as the camera sees it
      toCam.set(camera.position.x - c.x, camera.position.z - c.y);
      const side = (b.pos.x - c.x) * toCam.x + (b.pos.z - c.y) * toCam.y > 0 ? 1 : 0;
      const B = this.buf[side], n = counts[side]++;
      B.pos.set([b.pos.x, b.pos.y, b.pos.z], n * 3);
      B.vel.set([b.vel.x, b.vel.y, b.vel.z], n * 3);
      const fadeIn = Math.min(1, b.age / 0.25) * Math.min(1, (b.h + 0.004) / 0.01);
      B.aux.set([b.size, b.kind, b.alpha * fadeIn * this.fade, Math.random()], n * 4);
    }
    for (let i = 0; i < 2; i++) {
      const B = this.buf[i];
      B.geo.instanceCount = counts[i];
      if (counts[i]) for (const k of ['iPos', 'iVel', 'iAux']) (B.geo.attributes[k] as THREE.InstancedBufferAttribute).needsUpdate = true;
      this.streaks[i].visible = counts[i] > 0;
    }
  }

  private hide() {
    this.intensity = 0;
    this.touch = 0;
    this.mesh.visible = false;
    for (const m of this.streaks) m.visible = false;
  }

  /** Draws the funnel's camera depth, weighted by its opacity, for the depth of field (as the clouds do). */
  renderDistance(renderer: THREE.WebGLRenderer, camera: THREE.Camera, target: THREE.WebGLRenderTarget) {
    if (!this.mesh.visible) return;
    this.distRes.value.set(target.width, target.height);
    const mat = this.mesh.material;
    this.mesh.material = this.distMat;
    const mask = camera.layers.mask;
    camera.layers.set(2);
    const streaks = this.streaks.map((m) => m.visible);
    for (const m of this.streaks) m.visible = false;
    renderer.render(this.group, camera);
    this.streaks.forEach((m, i) => (m.visible = streaks[i]));
    camera.layers.mask = mask;
    this.mesh.material = mat;
  }
}

const TORNADO_FRAG = /* glsl */ `
precision highp float;
precision highp sampler3D;
#define N_AX ${N_AX}
uniform sampler3D tNoise; uniform sampler2D tDepth;
uniform float uUseDepth, uSteps, uSpin, uSpinD, uRise, uSlope, uFlash;
uniform vec4 uAxis[N_AX];
uniform vec2 uY, uResolution;
uniform vec4 uLook, uLook2;
uniform vec3 uBoxMin, uBoxMax, uLightPos, uLightColor, uAmbient, uSky, uSeed;
varying vec3 vW;
const float TAU = 6.28318530718;
// (written to stay finite on every GPU, as the fog's is)
float hg(float c, float g){ float g2 = g * g; return (1.0 - g2) / (12.566 * pow(max(1.0 + g2 - 2.0 * g * c, 1e-4), 1.5)); }
float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float remap01(float v, float lo, float hi){ return clamp((v - lo) / max(hi - lo, 1e-4), 0.0, 1.0); }
vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec2 boxHit(vec3 ro, vec3 rd){
  vec3 safe = vec3(abs(rd.x) < 1e-5 ? 1e-5 : rd.x, abs(rd.y) < 1e-5 ? 1e-5 : rd.y, abs(rd.z) < 1e-5 ? 1e-5 : rd.z);
  vec3 inv = 1.0 / safe;
  vec3 a = (uBoxMin - ro) * inv, b = (uBoxMax - ro) * inv;
  vec3 lo = min(a, b), hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}
// the axis and funnel radius at height fraction s
vec4 axisAt(float s){
  float f = clamp(s, 0.0, 1.0) * float(N_AX - 1);
  int i = int(min(floor(f), float(N_AX - 2)));
  return mix(uAxis[i], uAxis[i + 1], f - float(i));
}
struct Geo { float s; float h; vec4 ax; vec2 d; float r; };
float gStreak = 0.5;
Geo geo(vec3 p){
  Geo g;
  g.h = p.y - uY.x;
  g.s = g.h / max(uY.y - uY.x, 1e-3);
  g.ax = axisAt(g.s);
  g.d = p.xz - g.ax.xy;
  g.r = length(g.d);
  return g;
}
// the debris cloud billows outward as it rises
float debrisR(float h){ return uLook2.y * (1.0 + 0.35 * max(h, 0.0) / uLook2.z); }
// how far from the axis anything reaches at this height (the rest is skipped)
float reach(Geo g){
  float b = g.s < 1.12 ? g.ax.z * 1.9 : 0.0;
  if (uLook.y > 0.001 && g.h < uLook2.z * 3.4 + 0.02) b = max(b, debrisR(g.h + 0.02) * 1.3);
  return b;
}
// x: condensation funnel, y: debris; 'fine' adds the noise (the light rays go without)
vec2 field(Geo g, bool fine){
  vec2 o = vec2(0.0);
  float R = g.ax.z;
  float tip = 1.0 - uLook.x;
  if (R > 2e-4 && g.r < R * 1.9 && g.s < 1.12) {
    float rr = g.r / R;
    // ragged towards the tip, frayed as a rope
    float rag = max(1.0 - clamp((g.s - tip) / 0.35, 0.0, 1.0), uLook.z * 0.55);
    // the wall cloud above is ragged and thinner
    float wall = smoothstep(0.8, 1.0, g.s);
    rag = max(rag, wall * 0.75);
    float e = 1.0, streak = 0.6, tipN = 0.0;
    if (fine) {
      // helical striations: noise drawn out along lines that wind up the funnel,
      // turning with the air (the angle wraps seamlessly: seven bands round it)
      float a = atan(g.d.y, g.d.x) / TAU + uSpin / TAU;
      vec4 n1 = texture(tNoise, vec3((a - g.s * 0.8) * 7.0, g.s * 1.1 - uRise * 0.35, rr * 0.25 + uSeed.x));
      // billows and tears, carried round with the funnel
      vec2 q = rot(g.d, uSpin);
      vec4 n2 = texture(tNoise, vec3(q.x, g.h * 0.55 - uRise * 0.05, q.y) * 14.0 + uSeed);
      // (the striations corrugate the surface; billows tear it where it is ragged)
      e = 1.0 + (n2.r - 0.5) * (0.1 + 0.7 * rag) + (n1.a - 0.5) * 0.26;
      streak = n1.a;
      gStreak = streak;
      tipN = (n2.a - 0.5) * 0.16;
    }
    float x = rr / max(e, 0.2);
    float soft = mix(0.15, 0.55, rag);
    float f = 1.0 - smoothstep(1.0 - soft, 1.0, x);
    // a faint sheath of shredded cloud and dust round it
    f += 0.022 * (1.0 - smoothstep(1.0, 1.45, x)) * streak;
    // the ragged tip, and the top melting into the cloud base
    float down = smoothstep(0.9, 1.0, uLook.x);
    f *= smoothstep(tip - 0.01 - 0.12 * down, tip + 0.1 * (1.0 - down), g.s + tipN);
    f *= 1.0 - smoothstep(0.98, 1.12, g.s);
    o.x = f * mix(1.0, 0.7, wall);
  }
  if (uLook.y > 0.001 && g.h > -0.012 && g.h < uLook2.z * 3.4) {
    float hd = max(g.h, 0.0) / uLook2.z;
    float Rd = debrisR(g.h);
    float nb = 0.6, nd = 0.5;
    if (fine) {
      vec2 q = rot(g.d, uSpinD);
      nb = texture(tNoise, vec3(q.x, g.h * 0.7 - uRise * 0.05, q.y) * 12.0 + uSeed.zxy).r;
      nd = texture(tNoise, vec3(q.x, g.h - uRise * 0.1, q.y) * 30.0 + uSeed.yzx).g;
    }
    float rd = g.r / Rd + (nb - 0.5) * 0.55;
    float prof = exp(-hd * 0.95) * (1.0 - smoothstep(0.5, 1.05, rd));
    // swept partly clear at the core: the dust is thrown out into a ring
    prof *= mix(0.5, 1.0, smoothstep(0.05, 0.55, g.r / Rd));
    float m = fine ? remap01(nb * 0.6 + nd * 0.4, 0.22, 0.75) : 0.55;
    o.y = uLook.y * prof * m;
  }
  return o;
}
void main(){
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vW - ro);
  vec2 hit = boxHit(ro, rd);
  float t0 = max(hit.x, 0.0), t1 = hit.y;
  if (uUseDepth > 0.5) t1 = min(t1, texture2D(tDepth, gl_FragCoord.xy / uResolution).r);
  if (t1 <= t0) discard;
  float ds = max((t1 - t0) / uSteps, 0.0012);
  float t = t0 + ds * ign(gl_FragCoord.xy);
  const float SIG_F = 430.0, SIG_D = 330.0;
  vec3 dust = mix(vec3(0.27, 0.21, 0.16), vec3(0.8, 0.84, 0.9), uLook2.x);
  vec3 col = vec3(0.0);
  float T = 1.0, zacc = 0.0, od = 0.0;
  int every = 0;
  for (int i = 0; i < 110; i++) {
    if (t > t1) break;
    vec3 p = ro + rd * t;
    Geo g = geo(p);
    float b = reach(g);
    if (g.r > b) { t += clamp((g.r - b) / (1.0 + uSlope) * 0.9, ds, ds * 4.0); continue; }
    // fine steps through the funnel's skin (a rope is only millimetres across)
    float step = g.r < g.ax.z * 1.7 ? clamp(g.ax.z * 0.09, 0.0007, ds) : ds;
    vec2 f = field(g, true);
    float sig = f.x * SIG_F + f.y * SIG_D;
    if (sig > 0.4) {
      float a = 1.0 - exp(-sig * step);
#ifdef TORNADO_DIST
      zacc += T * a * -(viewMatrix * vec4(p, 1.0)).z;
#else
      vec3 L = normalize(uLightPos - p);
      // light from the lamp: a few steps towards it through the shapes alone
      if (every == 0) {
        od = 0.0;
        float st = 0.005;
        vec3 lp = p;
        for (int j = 0; j < 3; j++) { lp += L * st; vec2 lf = field(geo(lp), false); od += (lf.x * SIG_F + lf.y * SIG_D) * st; st *= 2.3; }
      }
      every = 1 - every;
      float sf = clamp(g.s, 0.0, 1.0);
      float c = dot(rd, L);
      float ph0 = mix(hg(c, -0.25), hg(c, 0.75), 0.5);
      float ph1 = mix(hg(c, -0.12), hg(c, 0.4), 0.5);
      float ph2 = mix(hg(c, -0.06), hg(c, 0.2), 0.5);
      float powder = mix(1.0, 1.0 - exp(-od * 2.0 - sig * 0.004), 0.6);
      float lum = exp(-od) * ph0 * powder + 0.45 * exp(-od * 0.3) * ph1 + 0.22 * exp(-od * 0.1) * ph2;
      // the storm overhead shades the top of the funnel; the lamp reaches under it from the side
      vec3 sunCol = uLightColor * 13.0 * mix(0.7, 0.28, sf);
      vec3 amb = mix(uAmbient * 1.1, uSky, smoothstep(0.0, 1.0, sf)) * (0.5 + 0.5 * exp(-od * 0.3));
      vec3 Lin = sunCol * lum + amb + vec3(0.8, 0.85, 1.0) * uFlash * 1.5;
      // grey condensation, dusty low down where it is full of debris; brown debris (white spray)
      vec3 cond = mix(vec3(0.56, 0.58, 0.62), dust * 0.9, exp(-max(g.h, 0.0) / 0.09) * uLook.y * 0.7);
      // light and dark bands winding round it, turning with the air
      cond *= 0.86 + 0.28 * gStreak;
      vec3 alb = mix(cond, dust, f.y * SIG_D / max(sig, 1e-3));
      col += T * alb * Lin * a;
#endif
      T *= 1.0 - a;
      if (T < 0.015) break;
    }
    t += step;
  }
  float alpha = (1.0 - T) * uLook.w;
  if (!(alpha >= 0.003 && alpha <= 1.0) || any(isnan(col)) || any(isinf(col))) discard;
#ifdef TORNADO_DIST
  gl_FragColor = vec4(zacc * uLook.w, 0.0, 0.0, alpha);
#else
  gl_FragColor = vec4(clamp(col, 0.0, 64.0) * uLook.w, alpha);
#endif
}`;

// Debris: each speck is drawn as the streak it makes in a short exposure.
const DEBRIS_VERT = /* glsl */ `
attribute vec3 iPos, iVel; attribute vec4 iAux;
uniform vec2 uRes; uniform vec3 uLight, uAmbient; uniform float uFlash;
varying vec2 vU; varying vec3 vCol; varying float vA;
void main(){
  float speed = length(iVel);
  vec3 axis = speed > 1e-4 ? iVel / speed : vec3(0.0, 1.0, 0.0);
  vec3 view = normalize(cameraPosition - iPos);
  vec3 side = cross(axis, view);
  float sl = length(side);
  side = sl > 1e-4 ? side / sl : vec3(1.0, 0.0, 0.0);
  float dist = length(cameraPosition - iPos);
  float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / dist;
  float widPx = max(iAux.x * pxPerM, 1.1);
  float len = speed * 0.02 + iAux.x;
  vec3 p = iPos + side * position.x * 0.5 * widPx / pxPerM - axis * len * position.y;
  vU = position.xy;
  // a smear spreads the same speck over more of the picture
  vA = iAux.z * clamp(iAux.x * 1.6 / len + 0.3, 0.3, 1.0) * clamp(iAux.x * pxPerM / widPx + 0.35, 0.35, 1.0);
  float k = iAux.y;
  vec3 alb = k < 0.5 ? mix(vec3(0.12, 0.09, 0.07), vec3(0.22, 0.17, 0.12), iAux.w)
    : k < 1.5 ? mix(vec3(0.17, 0.2, 0.08), vec3(0.3, 0.21, 0.1), iAux.w)
    : vec3(0.85, 0.9, 0.95);
  vCol = alb * (uAmbient * 2.4 + uLight * 0.75 + vec3(0.8, 0.86, 1.0) * uFlash * 1.4);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;
const DEBRIS_FRAG = /* glsl */ `
varying vec2 vU; varying vec3 vCol; varying float vA;
void main(){
  float a = vA * exp(-vU.x * vU.x * 2.2) * smoothstep(0.0, 0.2, vU.y) * (1.0 - smoothstep(0.6, 1.0, vU.y));
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol * a, a);
}`;
