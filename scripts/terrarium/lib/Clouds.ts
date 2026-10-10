import * as THREE from 'three';
import {TANK} from './Case';
import type {WindField} from './WindField';

/** Metres per cloud "size unit": a size-1 cloud's core puff has a radius of 0.6 S. */
export const S = 0.1;
const MAX_PUFFS = 20;
const MAX_CLOUDS = 7;
const TOP_Y = TANK.h - 0.016;
const HOME_Y = 0.555;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const clamp01 = (x: number) => clamp(x, 0, 1);
const ss = (a: number, b: number, x: number) => {const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t);};
const approach = (x: number, target: number, rate: number, dt: number) => x + (target - x) * (1 - Math.exp(-rate * dt));

interface Puff {
  rest: THREE.Vector3; // size units, cloud frame
  r: number; // size units
  pos: THREE.Vector3; // world
  vel: THREE.Vector3;
  rCur: number; // world radius
  ph: number;
  storm: number; // 0 normal, 1 tower, 2 anvil
  weight: number; // storm puffs grow in with the storm
  idx: number;
}

export interface Cloud {
  id: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  size: number;
  water: number; // 0 .. 1.5
  squeeze: number;
  userSqueeze: number;
  wheelSqueeze: number;
  wheelHold: number;
  heldSqueeze: number; // scripted / tool squeeze
  charge: number;
  storm: number;
  stormTarget: number;
  comp: number;
  compVel: number;
  rate: number; // current rain rate 0..2.2
  fade: number;
  dissolving: boolean;
  hover: number;
  hoverTarget: number;
  glow: number;
  glowPos: THREE.Vector3;
  puffs: Puff[];
  grabbed: boolean;
  yaw: number;
  phase: number;
  vfit: number;
  baseY: number;
  radius: number; // horizontal radius (m)
  lastSquish: number;
  crackleT: number;
  shake: number;
  mesh: THREE.Mesh;
  uniforms: Record<string, THREE.IUniform>;
  seed: THREE.Vector3;
}

export interface CloudEvents {
  squish?: (c: Cloud, amount: number) => void;
  grab?: (c: Cloud) => void;
  release?: (c: Cloud, speed: number) => void;
  merge?: (c: Cloud) => void;
  pop?: (c: Cloud) => void;
  zap?: (c: Cloud) => void;
  strike?: (c: Cloud, start: THREE.Vector3, strength: number) => void;
}

export class Clouds {
  readonly group = new THREE.Group();
  readonly clouds: Cloud[] = [];
  readonly shared = {
    tNoise: {value: null as THREE.Texture | null},
    uTime: {value: 0},
    uLightPos: {value: new THREE.Vector3(0, 1.1, 0.3)},
    uLightColor: {value: new THREE.Color(1, 0.85, 0.65)},
    uAmbient: {value: new THREE.Color(0.35, 0.3, 0.26)},
    uSky: {value: new THREE.Color(0.4, 0.38, 0.36)},
    uFlash: {value: 0},
    uLidGlow: {value: new THREE.Color(1, 0.6, 0.25)},
    tDepth: {value: null as THREE.Texture | null},
    uUseDepth: {value: 0},
    uInvProj: {value: new THREE.Matrix4()},
    uCamWorld: {value: new THREE.Matrix4()},
    uResolution: {value: new THREE.Vector2(1, 1)},
    uSteps: {value: 34},
  };
  events: CloudEvents = {};
  private nextId = 1;
  private geo = new THREE.BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5);
  /** The cloud held by the hand, and the pointer target it is pulled toward. */
  private held: {cloud: Cloud; target: THREE.Vector3; last: THREE.Vector3; vel: THREE.Vector3; prevVel: THREE.Vector3; grabY: number; offset: THREE.Vector3; still: number; plane: THREE.Plane} | null = null;
  floorAt: (x: number, z: number) => number = () => 0.2;

  constructor(noise: THREE.Texture) {
    this.shared.tNoise.value = noise;
    this.spawn({x: -0.22, z: -0.05, y: 0.55, size: 1.1, water: 0.45});
    this.spawn({x: 0.05, z: 0.04, y: 0.535, size: 0.9, water: 0.35});
    this.spawn({x: 0.32, z: -0.07, y: 0.565, size: 1.2, water: 0.5});
    for (const c of this.clouds) c.fade = 1;
  }

  // ---------------------------------------------------------------------------
  spawn(o: {x: number; z: number; y?: number; size?: number; water?: number; squeeze?: number; storm?: number; fadeIn?: boolean}): Cloud {
    if (this.clouds.filter((c) => !c.dissolving).length >= MAX_CLOUDS) {
      const old = this.clouds.find((c) => !c.grabbed && !c.dissolving);
      if (old) old.dissolving = true;
    }
    const size = o.size ?? 1;
    const uniforms: Record<string, THREE.IUniform> = {
      ...this.shared,
      uPuffs: {value: Array.from({length: MAX_PUFFS}, () => new THREE.Vector4(0, -10, 0, 0))},
      uCount: {value: 0},
      uBoxMin: {value: new THREE.Vector3()},
      uBoxMax: {value: new THREE.Vector3()},
      uShape: {value: new THREE.Vector4()},
      uLook: {value: new THREE.Vector4()},
      uLook2: {value: new THREE.Vector4()},
      uGlow: {value: new THREE.Vector4()},
      uCenter: {value: new THREE.Vector3()},
      uSeed: {value: new THREE.Vector3(Math.random() * 20, Math.random() * 20, Math.random() * 20)},
      uInside: {value: 0},
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: CLOUD_FRAG,
    });
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.frustumCulled = false;
    mesh.layers.set(2);
    mesh.name = 'cloud';
    this.group.add(mesh);
    const c: Cloud = {
      id: this.nextId++, pos: new THREE.Vector3(o.x, o.y ?? HOME_Y, o.z), vel: new THREE.Vector3(), size, water: o.water ?? 0.5,
      squeeze: 0, userSqueeze: 0, wheelSqueeze: 0, wheelHold: 0, heldSqueeze: o.squeeze ?? 0, charge: 0, storm: o.storm ?? 0, stormTarget: o.storm ?? 0,
      comp: 0, compVel: 0, rate: 0, fade: o.fadeIn ? 0 : 1, dissolving: false, hover: 0, hoverTarget: 0, glow: 0, glowPos: new THREE.Vector3(),
      puffs: [], grabbed: false, yaw: Math.random() * Math.PI * 2, phase: Math.random() * 10, vfit: 1, baseY: 0, radius: 0.05,
      lastSquish: 0, crackleT: 0, shake: 0, mesh, uniforms, seed: uniforms.uSeed.value as THREE.Vector3,
    };
    this.layout(c, 8 + Math.floor(Math.random() * 4));
    this.clouds.push(c);
    return c;
  }

  /** Puff layout in size units: a core, two body lobes, a crown and a flat base. */
  private layout(c: Cloud, total: number, from?: Puff[]) {
    const e = 1 + Math.max(0, c.size - 1.1) * 0.25;
    const fixed: [number, number, number, number][] = [
      [0, 0.14, 0, 0.6], [0.62 * e, 0, 0.1, 0.45], [-0.62 * e, 0, -0.1, 0.47],
      [-0.3, 0.52, 0, 0.37], [0.26, 0.46, 0, 0.35], [0.05, -0.05, 0.4, 0.37], [-0.08, -0.05, -0.4, 0.36],
    ];
    const extra: [number, number, number, number][] = [
      [0.05, 0.76, 0, 0.27], [1.02 * e, -0.02, -0.05, 0.3], [-1.02 * e, -0.02, 0.05, 0.3],
      [0.45, -0.05, -0.32, 0.33], [-0.45, -0.05, 0.32, 0.33], [0.62 * e, 0.36, 0, 0.28],
    ].sort(() => Math.random() - 0.5) as [number, number, number, number][];
    const spec = [...fixed, ...extra].slice(0, Math.min(13, Math.max(7, total)));
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const puffs: Puff[] = spec.map(([x, y, z, r], i) => {
      const rest = new THREE.Vector3(x + (Math.random() - 0.5) * 0.1, y + (Math.random() - 0.5) * 0.07, z + (Math.random() - 0.5) * 0.1);
      const world = new THREE.Vector3(rest.x * cy - rest.z * sy, rest.y, rest.x * sy + rest.z * cy).multiplyScalar(c.size * S).add(c.pos);
      // start each puff from the nearest old one, so merges and re-layouts flow
      let start = world;
      if (from?.length) start = from.reduce((a, b) => (a.pos.distanceTo(world) < b.pos.distanceTo(world) ? a : b)).pos.clone();
      return {rest, r: r * (0.92 + Math.random() * 0.16), pos: start.clone(), vel: new THREE.Vector3(), rCur: from ? r * c.size * S * 0.8 : 0.001, ph: Math.random() * 10, storm: 0, weight: 1, idx: i};
    });
    // storm towers and anvil, grown in when the cloud turns stormy
    for (let m = 0; m < 3; m++) puffs.push({rest: new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.9 + m * 0.45, (Math.random() - 0.5) * 0.2), r: 0.64 - 0.05 * m, pos: c.pos.clone(), vel: new THREE.Vector3(), rCur: 0.001, ph: Math.random() * 10, storm: 1, weight: 0, idx: m});
    for (let m = 0; m < 4; m++) {
      const a = (m / 4) * Math.PI * 2 + 0.4;
      puffs.push({rest: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), r: 0.4, pos: c.pos.clone(), vel: new THREE.Vector3(), rCur: 0.001, ph: Math.random() * 10, storm: 2, weight: 0, idx: m});
    }
    c.puffs = puffs;
  }

  // ---------------------------------------------------------------------------
  /** The cloud a ray meets (by its puffs), and where. */
  pick(ray: THREE.Ray): {cloud: Cloud; point: THREE.Vector3} | null {
    let best: {cloud: Cloud; point: THREE.Vector3} | null = null, bd = Infinity;
    const sphere = new THREE.Sphere();
    for (const c of this.clouds) {
      if (c.dissolving || c.fade < 0.3) continue;
      for (const p of c.puffs) {
        if (p.rCur < 0.004) continue;
        sphere.center.copy(p.pos);
        sphere.radius = p.rCur * 1.05;
        const hit = ray.intersectSphere(sphere, new THREE.Vector3());
        if (hit) {const d = hit.distanceTo(ray.origin); if (d < bd) {bd = d; best = {cloud: c, point: hit};}}
      }
    }
    return best;
  }

  setHover(c: Cloud | null) {for (const k of this.clouds) k.hoverTarget = k === c ? 0.65 : 0;}

  grab(c: Cloud, hit: THREE.Vector3, ray: THREE.Ray) {
    c.grabbed = true;
    c.compVel -= 0.8;
    c.userSqueeze = Math.max(c.userSqueeze, c.heldSqueeze * 0.7);
    c.heldSqueeze = 0;
    let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -c.pos.y);
    if (Math.abs(ray.direction.y) <= 0.1) plane = new THREE.Plane().setFromNormalAndCoplanarPoint(ray.direction.clone().negate(), c.pos);
    const offset = c.pos.clone().sub(hit);
    offset.y = 0;
    offset.clampLength(0, c.radius * 0.8);
    this.held = {cloud: c, target: c.pos.clone(), last: c.pos.clone(), vel: new THREE.Vector3(), prevVel: new THREE.Vector3(), grabY: c.pos.y, offset, still: 0, plane};
    this.events.grab?.(c);
  }

  /** Moves the held cloud's target with the pointer ray; `moved` = pointer travel in px. */
  drag(ray: THREE.Ray, movedPx: number) {
    const h = this.held;
    if (!h) return;
    const p = ray.intersectPlane(h.plane, new THREE.Vector3());
    if (!p) return;
    p.add(h.offset);
    const m = 0.03;
    p.x = clamp(p.x, -TANK.w / 2 + m, TANK.w / 2 - m);
    p.z = clamp(p.z, -TANK.d / 2 + m, TANK.d / 2 - m);
    p.y = clamp(p.y, 0.4, TOP_Y - 0.03);
    h.target.copy(p);
    if (movedPx > 1.5) h.still = 0;
  }

  release() {
    const h = this.held;
    if (!h) return;
    const c = h.cloud;
    c.grabbed = false;
    c.vel.set(h.vel.x, 0, h.vel.z).clampLength(0, 0.42);
    c.userSqueeze = 0;
    this.held = null;
    this.events.release?.(c, c.vel.length());
  }

  get holding() {return this.held?.cloud ?? null;}

  /** Mouse-wheel squeeze over a cloud. */
  wheel(c: Cloud, deltaY: number) {
    c.wheelSqueeze = clamp01(c.wheelSqueeze + Math.max(0, deltaY) * 0.0016);
    c.wheelHold = 2.2;
  }

  // Cloud tool ------------------------------------------------------------------
  private growing: {cloud: Cloud; lastPuff: THREE.Vector3} | null = null;

  /** Starts condensing a cloud at a point (or grows the one under the pointer). */
  condense(at: THREE.Vector3, existing: Cloud | null) {
    let c = existing;
    if (!c || c.size >= 2.2) {
      c = this.spawn({x: clamp(at.x, -TANK.w / 2 + 0.06, TANK.w / 2 - 0.06), z: clamp(at.z, -TANK.d / 2 + 0.05, TANK.d / 2 - 0.05), y: HOME_Y + (Math.random() - 0.5) * 0.012, size: 0.22, water: 0.12, fadeIn: true});
    }
    this.growing = {cloud: c, lastPuff: at.clone()};
    this.events.pop?.(c);
  }
  condenseMove(at: THREE.Vector3) {
    const g = this.growing;
    if (!g) return;
    const c = g.cloud;
    const step = Math.max(0.32, c.size * 0.4) * S;
    if (at.distanceTo(g.lastPuff) < step) return;
    g.lastPuff.copy(at);
    const normal = c.puffs.filter((p) => !p.storm);
    if (normal.length >= 13) return;
    // a new lobe where the pointer is, in the cloud's own frame
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const d = at.clone().sub(c.pos).divideScalar(c.size * S);
    const rest = new THREE.Vector3(d.x * cy + d.z * sy, (Math.random() - 0.3) * 0.2, -d.x * sy + d.z * cy);
    rest.x = clamp(rest.x, -2.2, 2.2);
    rest.z = clamp(rest.z, -1.2, 1.2);
    const r = Math.max(0.2, 0.32 + Math.random() * 0.12);
    c.puffs.splice(normal.length, 0, {rest, r, pos: at.clone().setY(c.pos.y), vel: new THREE.Vector3(), rCur: 0.002, ph: Math.random() * 10, storm: 0, weight: 1, idx: normal.length});
    c.size = Math.min(2.2, c.size + 0.03);
    this.events.pop?.(c);
  }
  condenseEnd() {
    const g = this.growing;
    if (!g) return;
    // re-centre on the puffs' weighted centroid
    const c = g.cloud;
    const centroid = new THREE.Vector3();
    let w = 0;
    for (const p of c.puffs) if (!p.storm) {const k = p.r * p.r; centroid.addScaledVector(p.rest, k); w += k;}
    centroid.divideScalar(w || 1);
    for (const p of c.puffs) if (!p.storm) p.rest.sub(centroid);
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    c.pos.x += (centroid.x * cy - centroid.z * sy) * c.size * S;
    c.pos.z += (centroid.x * sy + centroid.z * cy) * c.size * S;
    this.growing = null;
  }

  // ---------------------------------------------------------------------------
  /** Rain sources this frame. */
  readonly sources: {cloud: Cloud; x: number; y: number; z: number; radius: number; rate: number; vx: number; vz: number}[] = [];
  /** Total cloud cover 0..1 and storminess 0..1 (darken the lamp). */
  cover = 0;
  storminess = 0;

  update(dt: number, time: number, wind: WindField, humidity: number, day: number) {
    this.shared.uTime.value = time;
    this.sources.length = 0;
    // held cloud: pointer velocity and shake
    const h = this.held;
    if (h) {
      const q = h.target.clone().sub(h.last).divideScalar(Math.max(dt, 1e-3));
      h.last.copy(h.target);
      h.prevVel.copy(h.vel);
      h.vel.lerp(q, 1 - Math.exp(-dt * 14));
      const accel = h.vel.distanceTo(h.prevVel) / Math.max(dt, 1e-3);
      const c = h.cloud;
      c.shake = approach(c.shake, accel, 5, dt);
      const n = ss(1.6, 6.5, c.shake);
      c.charge = Math.min(1.02, c.charge + dt * n * 0.8);
      h.still += dt;
      if (h.still > 0.2) c.userSqueeze = Math.min(1, c.userSqueeze + dt * 0.55 * (1 - 0.35 * c.userSqueeze));
      else c.userSqueeze = Math.max(0, c.userSqueeze - dt * 0.6);
    }
    // a cloud being condensed grows and gathers water while the pointer is held
    if (this.growing) {
      const c = this.growing.cloud;
      c.size = Math.min(1.8, c.size + dt * (0.18 + 0.5 * humidity) * (1.2 - c.size / 1.9));
      c.water = Math.min(1.5, c.water + dt * (0.04 + 0.1 * humidity));
      c.dissolving = false;
    }
    for (const c of [...this.clouds]) this.step(c, dt, time, wind, humidity, day);
    this.mergePass(dt);
    // remove faded-out clouds
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const c = this.clouds[i];
      if (c.dissolving && c.fade <= 0) {this.group.remove(c.mesh); (c.mesh.material as THREE.Material).dispose(); this.clouds.splice(i, 1);}
    }
    let cover = 0, storm = 0;
    for (const c of this.clouds) {
      cover += Math.PI * c.radius * c.radius * (0.55 + 0.45 * Math.min(1, c.water)) * c.fade;
      storm = Math.max(storm, c.storm * ss(0.25, 0.8, c.water) * c.fade);
    }
    this.cover = clamp01(cover / (TANK.w * TANK.d) * 1.5);
    this.storminess = clamp01(storm * 0.92 + Math.min(0.08, this.clouds.length * 0.004));
  }

  private step(c: Cloud, dt: number, time: number, wind: WindField, humidity: number, day: number) {
    c.fade = c.dissolving ? Math.max(0, c.fade - dt * 0.7) : Math.min(1, c.fade + dt * 1.6);
    c.hover = approach(c.hover, c.hoverTarget + (c.grabbed ? 0.45 : 0), 8, dt);
    // squeeze: holding still, the wheel, or a scripted squeeze
    c.wheelHold -= dt;
    if (c.wheelHold < 0) c.wheelSqueeze = Math.max(0, c.wheelSqueeze - dt * 0.18);
    const target = Math.max(c.grabbed ? 0 : c.heldSqueeze, c.userSqueeze, c.wheelSqueeze);
    const before = c.squeeze;
    c.squeeze = approach(c.squeeze, target, target > c.squeeze ? 5 : 2.6, dt);
    if (c.squeeze - c.lastSquish > 0.06 && c.squeeze > 0.08 && time - (c as any).squishT > 0.28) {
      c.lastSquish = c.squeeze;
      (c as any).squishT = time;
      this.events.squish?.(c, c.squeeze);
    }
    if (c.squeeze < c.lastSquish - 0.1) c.lastSquish = c.squeeze;
    void before;
    // jelly: the squash spring
    c.compVel += ((c.squeeze - c.comp) * 62 - c.compVel * 2 * Math.sqrt(62) * 0.24) * dt;
    c.comp = clamp(c.comp + c.compVel * dt, -0.5, 1.15);
    // body motion
    const w = wind.sample(c.pos.x, c.pos.z, new THREE.Vector2());
    const wallD = Math.min(TANK.w / 2 - Math.abs(c.pos.x), TANK.d / 2 - Math.abs(c.pos.z));
    const u1 = wallD > 0.11 ? 1 : -0.15 + 1.15 * (wallD / 0.11) ** 2;
    if (this.held?.cloud === c) {
      const hd = this.held;
      c.vel.x += ((hd.target.x - c.pos.x) * 48 - c.vel.x * 10.5) * dt;
      c.vel.z += ((hd.target.z - c.pos.z) * 48 - c.vel.z * 10.5) * dt;
      c.vel.y += ((hd.grabY - c.pos.y) * 30 - c.vel.y * 9) * dt;
    } else {
      const k = 0.75 / (0.55 + 0.45 * c.size);
      c.vel.x = approach(c.vel.x, w.x * 0.5 * u1, k, dt);
      c.vel.z = approach(c.vel.z, w.y * 0.5 * u1, k, dt);
      const homeY = HOME_Y - 0.45 * c.storm * S + 0.07 * S * Math.sin(0.45 * time + c.phase);
      c.vel.y += ((homeY - c.pos.y) * 2.2 - c.vel.y * 2) * dt;
    }
    c.pos.addScaledVector(c.vel, dt);
    // glass walls: push back and bounce
    const s = c.size * (0.55 + 0.45 * ss(0, 1, c.fade * 1.4));
    const ext = this.extent(c);
    const hx = TANK.w / 2 - 0.01, hz = TANK.d / 2 - 0.01;
    const bump = (over: number, axis: 'x' | 'z', sign: number) => {
      if (over <= 0) return;
      const v = c.vel[axis] * sign;
      c.pos[axis] -= sign * over * Math.min(1, 60 * dt);
      if (v > 0) {c.vel[axis] = -c.vel[axis] * 0.45; if (v > 0.054) c.compVel += 0.6 * v / S * 0.06;}
    };
    bump(ext.maxX - hx, 'x', 1); bump(-hx - ext.minX, 'x', -1);
    bump(ext.maxZ - hz, 'z', 1); bump(-hz - ext.minZ, 'z', -1);
    // stay above the peaks and below the lid
    const floor = this.floorAt(c.pos.x, c.pos.z) + (0.45 + 0.28 * c.size) * S;
    if (c.pos.y < floor) {c.pos.y += (floor - c.pos.y) * Math.min(1, 8 * dt); c.vel.y = Math.max(0, c.vel.y);}
    const tall = ext.maxY - c.pos.y;
    const room = TOP_Y - c.pos.y;
    c.vfit = approach(c.vfit, clamp(room / Math.max(tall / c.vfit, 1e-3), 0.45, 1), 6, dt);
    if (c.pos.y > TOP_Y - 0.03) {c.pos.y = TOP_Y - 0.03; c.vel.y = Math.min(0, c.vel.y);}
    // puffs
    const a = 1 - 0.38 * c.comp;
    const l = (1 - 0.16 * c.comp) * (1 + 0.32 * c.storm) * c.vfit;
    const cs = (1 - 0.2 * c.comp) * (1 + 0.12 * c.storm);
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const turb = wind.turbulence(c.pos.x, c.pos.z);
    const rel = new THREE.Vector3(w.x - c.vel.x, 0, w.y - c.vel.z);
    const tgt = new THREE.Vector3();
    let top = -Infinity, base = Infinity;
    for (const p of c.puffs) {
      let rest = p.rest, r = p.r, weightT = 1;
      if (p.storm === 1) {
        weightT = clamp01(c.storm * 2.2 - p.idx * 0.45);
        rest = new THREE.Vector3(p.rest.x, 0.5 + (p.rest.y - 0.5) * Math.max(0.2, weightT), p.rest.z);
        r = p.r * (0.55 + 0.45 * weightT);
      } else if (p.storm === 2) {
        weightT = clamp01((c.storm - 0.35) * 2.2);
        const ring = 0.25 + 0.55 * weightT;
        rest = new THREE.Vector3(p.rest.x * ring + w.x * 2 * weightT, (TOP_Y - 0.012 - c.pos.y) / (s * S) / Math.max(l, 0.2), p.rest.z * ring + w.y * 2 * weightT);
        r = p.r * (1 + 0.3 * weightT);
      }
      p.weight = approach(p.weight, weightT, 1.5, dt);
      const lx = rest.x * a, ly = rest.y * l, lz = rest.z * a;
      tgt.set(lx * cy - lz * sy, ly, lx * sy + lz * cy).multiplyScalar(s * S).add(c.pos);
      tgt.x += Math.sin(time * 0.31 + p.ph) * 0.02 * s * S;
      tgt.y += Math.sin(time * 0.27 + p.ph * 1.3) * 0.012 * s * S;
      tgt.addScaledVector(new THREE.Vector3(Math.sin(time * 13 + p.ph), Math.sin(time * 11 + p.ph * 2), Math.cos(time * 12 + p.ph)), Math.max(0, c.comp) * 0.05 * s * S);
      const rT = r * s * S * cs * (1 + Math.sin(time * 0.55 + p.ph) * 0.03 + Math.sin(time * 0.23 + 1.7 * p.ph) * 0.025) * (p.storm ? p.weight : 1);
      const hd = Math.hypot(rest.x, rest.z);
      const k = clamp(88 - 26 * hd - 20 * Math.max(0, rest.y) + Math.sin(p.ph * 7) * 5, 46, 96);
      const damp = 2 * Math.sqrt(k) * (0.3 + 0.08 * Math.abs(Math.sin(p.ph * 3)));
      const windF = 5 * (0.35 + 1.4 * Math.max(0, rest.y));
      p.vel.x += ((tgt.x - p.pos.x) * k - p.vel.x * damp + rel.x * windF * 0.1 + Math.sin(time * 1.7 + p.ph * 5) * turb * 14 * s * S) * dt;
      p.vel.y += ((tgt.y - p.pos.y) * k - p.vel.y * damp) * dt;
      p.vel.z += ((tgt.z - p.pos.z) * k - p.vel.z * damp + rel.z * windF * 0.1 + Math.cos(time * 1.3 + p.ph * 4) * turb * 14 * s * S) * dt;
      p.pos.addScaledVector(p.vel, dt);
      p.rCur = approach(p.rCur, rT, 9, dt);
      // inside the glass
      const mx = TANK.w / 2 - p.rCur * 0.6, mz = TANK.d / 2 - p.rCur * 0.6;
      if (Math.abs(p.pos.x) > mx) {p.pos.x = Math.sign(p.pos.x) * mx; p.vel.x *= -0.3;}
      if (Math.abs(p.pos.z) > mz) {p.pos.z = Math.sign(p.pos.z) * mz; p.vel.z *= -0.3;}
      if (p.pos.y + p.rCur * 0.5 > TOP_Y) {p.pos.y = TOP_Y - p.rCur * 0.5; p.vel.y *= -0.3;}
      if (p.rCur > 0.003) {top = Math.max(top, p.pos.y + p.rCur); base = Math.min(base, p.pos.y - 0.1 * p.rCur);}
    }
    c.baseY = base - 0.14 * c.size * S * (1 - 0.3 * c.comp);
    c.radius = Math.max(0.03, (ext.maxX - ext.minX + ext.maxZ - ext.minZ) * 0.25);
    this.waterCycle(c, dt, humidity, day, wind);
    this.lightningCharge(c, dt, time);
    this.syncRender(c, top);
  }

  private extent(c: Cloud) {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxY = -Infinity;
    for (const p of c.puffs) {
      if (p.rCur < 0.003) continue;
      minX = Math.min(minX, p.pos.x - p.rCur); maxX = Math.max(maxX, p.pos.x + p.rCur);
      minZ = Math.min(minZ, p.pos.z - p.rCur); maxZ = Math.max(maxZ, p.pos.z + p.rCur);
      maxY = Math.max(maxY, p.pos.y + p.rCur);
    }
    if (!Number.isFinite(minX)) return {minX: c.pos.x, maxX: c.pos.x, minZ: c.pos.z, maxZ: c.pos.z, maxY: c.pos.y};
    return {minX, maxX, minZ, maxZ, maxY};
  }

  private waterCycle(c: Cloud, dt: number, humidity: number, day: number, wind: WindField) {
    const eff = c.squeeze;
    let f = ss(0.02, 0.3, c.water) * (Math.pow(eff, 1.25) * (0.5 + 1.1 * Math.min(c.water, 1.2)) + 0.5 * ss(1.25, 1.5, c.water) + c.storm * (0.45 + 0.8 * Math.min(c.water, 1.2)));
    f = c.dissolving ? 0 : Math.min(2.2, f * c.fade);
    c.rate = approach(c.rate, f, f > c.rate ? 3 : 1.6, dt);
    const before = c.water;
    c.water -= c.rate * dt * (c.heldSqueeze > 0 ? 0.006 : 0.04) * (1 - 0.6 * c.storm);
    // only saturated air feeds the clouds (the case's usual humid air holds them steady)
    if (humidity > 0.7) c.water += (humidity - 0.7) * dt * 0.04 * (0.6 + 0.4 * c.size);
    c.water += c.storm * Math.max(0, humidity - 0.5) * dt * 0.03;
    const k = clamp01((0.5 - humidity) / 0.25);
    c.water -= dt * 0.03 * k * day * (1.3 - 0.6 * Math.min(c.size, 1.2)) * 0.5;
    c.water = clamp(c.water, 0, 1.5);
    c.size = clamp(c.size + (c.water - before) * 0.28, 0.1, 2.4);
    if (c.water < 0.03 && !c.grabbed && !this.growing) {
      c.size -= 0.12 * dt;
      if (c.size < 0.18) c.dissolving = true;
    }
    // storms wind down without water
    if (c.water < 0.45) c.stormTarget = Math.max(0, c.stormTarget - 0.08 * dt);
    else if (c.storm > 0.5) c.stormTarget = Math.max(0, c.stormTarget - 0.0035 * dt);
    c.storm = approach(c.storm, c.stormTarget, 0.35, dt);
    if (c.rate > 0.02) {
      this.sources.push({cloud: c, x: c.pos.x, y: c.baseY, z: c.pos.z, radius: c.radius * 0.72, rate: c.rate, vx: c.vel.x, vz: c.vel.z});
      // a downdraught spreads out under heavy rain
      (c as any).gustT = ((c as any).gustT ?? 0) - dt;
      if (c.rate > 0.7 && (c as any).gustT < 0) {(c as any).gustT = 0.3; wind.addRadial(c.pos.x, c.pos.z, 0.05 * c.rate, Math.max(0.05, c.radius * 0.9));}
    }
  }

  private lightningCharge(c: Cloud, dt: number, time: number) {
    c.charge += dt * 0.07 * c.storm * ss(0.35, 0.9, c.water) * (0.6 + 0.8 * Math.random());
    if (!c.grabbed && c.storm < 0.1) c.charge = Math.max(0, c.charge - 0.035 * dt);
    // crackle: flickers inside the cloud as the charge builds
    c.glow *= Math.exp(-13 * dt);
    if (c.charge > 0.33) {
      c.crackleT -= dt;
      if (c.crackleT < 0) {
        c.crackleT = (0.05 + 0.45 * Math.random()) / (0.25 + 1.6 * c.charge);
        const p = c.puffs[Math.floor(Math.random() * Math.min(7, c.puffs.length))];
        c.glowPos.copy(p.pos);
        c.glow = Math.max(c.glow, (0.3 + 0.7 * Math.random()) * c.charge * (c.grabbed ? 1.2 : 0.8));
        if (c.grabbed) this.events.zap?.(c);
      }
    }
    if (c.charge >= 1 && c.water > 0.05) {
      const strength = 0.8 + 0.3 * Math.min(1, c.storm + 0.3 * c.water);
      const start = new THREE.Vector3(c.pos.x + (Math.random() - 0.5) * 0.5 * c.radius, c.baseY + 0.08 * S, c.pos.z + (Math.random() - 0.5) * 0.4 * c.radius);
      c.glow = 2.6;
      c.glowPos.copy(start).y += 0.25 * c.size * S;
      c.charge = 0.04 + Math.random() * 0.28;
      c.compVel += 1.8;
      this.events.strike?.(c, start, strength);
    }
    void time;
  }

  private mergePass(dt: number) {
    for (let i = 0; i < this.clouds.length; i++) for (let j = i + 1; j < this.clouds.length; j++) {
      const A = this.clouds[i], B = this.clouds[j];
      if (A.dissolving || B.dissolving) continue;
      const dx = B.pos.x - A.pos.x, dz = B.pos.z - A.pos.z;
      const c = Math.hypot(dx, dz);
      const u = 0.75 * (A.radius + B.radius);
      if (c >= u) continue;
      const closing = -((B.vel.x - A.vel.x) * dx + (B.vel.z - A.vel.z) * dz) / Math.max(c, 1e-4);
      if ((A.grabbed || B.grabbed) && c < 0.6 * (A.radius + B.radius) || (closing > 0.14 && c < 0.62 * (A.radius + B.radius))) {
        this.merge(A.grabbed || (!B.grabbed && A.size >= B.size) ? A : B, A.grabbed || (!B.grabbed && A.size >= B.size) ? B : A);
        return;
      }
      // push apart, weighted by mass
      const mA = A.size ** 3, mB = B.size ** 3;
      const push = (u - c) / u * 5.5 * dt * S;
      const nx = c > 1e-4 ? dx / c : 1, nz = c > 1e-4 ? dz / c : 0;
      if (!A.grabbed) {A.pos.x -= nx * push * mB / (mA + mB); A.pos.z -= nz * push * mB / (mA + mB);}
      if (!B.grabbed) {B.pos.x += nx * push * mA / (mA + mB); B.pos.z += nz * push * mA / (mA + mB);}
    }
  }

  private merge(keep: Cloud, gone: Cloud) {
    const n1 = keep.puffs.filter((p) => !p.storm).length, n2 = gone.puffs.filter((p) => !p.storm).length;
    const old = [...keep.puffs, ...gone.puffs].filter((p) => !p.storm);
    keep.size = Math.min(2.4, Math.cbrt(keep.size ** 3 + gone.size ** 3));
    keep.water = Math.min(1.5, keep.water + gone.water);
    keep.charge = Math.max(keep.charge, gone.charge);
    keep.storm = Math.max(keep.storm, gone.storm);
    keep.stormTarget = Math.max(keep.stormTarget, gone.stormTarget);
    if (keep.water >= 1 && keep.size >= 1.4) keep.stormTarget = Math.max(keep.stormTarget, 0.55 + 0.45 * ss(1, 1.45, keep.water));
    const total = clamp(Math.round(0.7 * (n1 + n2)), 9, 13);
    this.layout(keep, total, old);
    keep.compVel += 2.4;
    gone.dissolving = true;
    gone.fade = 0;
    this.events.merge?.(keep);
  }

  private syncRender(c: Cloud, top: number) {
    const u = c.uniforms;
    const arr = u.uPuffs.value as THREE.Vector4[];
    let n = 0;
    const box = new THREE.Box3();
    for (const p of c.puffs) {
      if (p.rCur < 0.002 || n >= MAX_PUFFS) continue;
      arr[n++].set(p.pos.x, p.pos.y, p.pos.z, p.rCur);
      box.expandByPoint(new THREE.Vector3(p.pos.x - p.rCur, p.pos.y - p.rCur, p.pos.z - p.rCur));
      box.expandByPoint(new THREE.Vector3(p.pos.x + p.rCur, p.pos.y + p.rCur, p.pos.z + p.rCur));
    }
    u.uCount.value = n;
    const edge = (0.06 + 0.26 * Math.min(c.size, 2.2)) * S;
    box.expandByScalar(edge * 1.08);
    box.max.y = Math.min(box.max.y, TOP_Y + 0.005);
    (u.uBoxMin.value as THREE.Vector3).copy(box.min);
    (u.uBoxMax.value as THREE.Vector3).copy(box.max);
    c.mesh.position.copy(box.min);
    c.mesh.scale.subVectors(box.max, box.min).max(new THREE.Vector3(1e-4, 1e-4, 1e-4));
    (u.uShape.value as THREE.Vector4).set(c.baseY, Math.min(TOP_Y - 0.008, top), edge, (0.2 + 0.2 * c.size) * S);
    const grey = clamp01(ss(0.35, 1.35, c.water) * 0.55 + c.comp * 0.6 + c.storm * 0.35 + c.rate * 0.1);
    const densMul = (0.85 + 0.35 * Math.min(c.water, 1.2) / 1.2 + 0.7 * Math.max(0, c.comp) + 0.55 * c.storm) * (c.dissolving ? 0.5 + 0.5 * c.fade : 1);
    (u.uLook.value as THREE.Vector4).set(grey, c.storm, densMul, c.hover);
    (u.uLook2.value as THREE.Vector4).set(c.fade, clamp01(c.rate * 0.6 + grey * 0.25), c.size, TOP_Y);
    (u.uGlow.value as THREE.Vector4).set(c.glowPos.x, c.glowPos.y, c.glowPos.z, c.glow);
    (u.uCenter.value as THREE.Vector3).copy(c.pos);
    c.mesh.visible = n > 0 && c.fade > 0.01;
  }

  /** Back-to-front order for blending, and inside-the-box handling. */
  sort(camera: THREE.Camera) {
    const sorted = [...this.clouds].sort((a, b) => b.pos.distanceToSquared(camera.position) - a.pos.distanceToSquared(camera.position));
    sorted.forEach((c, i) => {
      c.mesh.renderOrder = 10 + i * 0.01;
      const u = c.uniforms;
      const mn = u.uBoxMin.value as THREE.Vector3, mx = u.uBoxMax.value as THREE.Vector3;
      const p = camera.position, m = 0.01;
      const inside = p.x > mn.x - m && p.x < mx.x + m && p.y > mn.y - m && p.y < mx.y + m && p.z > mn.z - m && p.z < mx.z + m;
      const mat = c.mesh.material as THREE.ShaderMaterial;
      mat.side = inside ? THREE.BackSide : THREE.FrontSide;
      mat.depthTest = !inside;
      u.uInside.value = inside ? 1 : 0;
    });
  }
}

const CLOUD_FRAG = /* glsl */ `
precision highp float;
precision highp sampler3D;
uniform sampler3D tNoise; uniform sampler2D tDepth;
uniform float uTime, uFlash, uUseDepth, uInside, uSteps; uniform int uCount;
uniform vec4 uPuffs[${MAX_PUFFS}];
uniform vec3 uBoxMin, uBoxMax, uLightPos, uLightColor, uAmbient, uSky, uLidGlow, uCenter, uSeed;
uniform vec4 uShape, uLook, uLook2, uGlow;
uniform mat4 uInvProj, uCamWorld; uniform vec2 uResolution;
varying vec3 vW;
const float S = ${S.toFixed(4)};
float cloudSmin(float a, float b, float k){ float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float remap01(float v, float lo, float hi){ return clamp((v - lo) / max(hi - lo, 1e-4), 0.0, 1.0); }
float hg(float c, float g){ float g2 = g * g; return (1.0 - g2) / (12.566 * pow(1.0 + g2 - 2.0 * g * c, 1.5)); }
float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float shapeSD(vec3 p){
  float d = 1e5;
  for (int i = 0; i < ${MAX_PUFFS}; i++) {
    if (i >= uCount) break;
    vec4 s = uPuffs[i];
    d = cloudSmin(d, length(p - s.xyz) - s.w, uShape.w);
  }
  return d;
}
vec3 noiseCoord(vec3 p){ return (p - uCenter) / S + uSeed; }
float heightFrac(vec3 p){ return clamp((p.y - uShape.x) / max(uShape.y - uShape.x, 1e-3), 0.0, 1.0); }
// coverage and base shape; cov out for rim lighting
float baseDensity(vec3 p, float sd, out vec4 n1, out float cov){
  float edge = uShape.z;
  float hf = heightFrac(p);
  cov = smoothstep(edge, -edge * 1.6, sd);
  vec3 q = noiseCoord(p);
  n1 = texture(tNoise, q * 0.34 + vec3(0.0, -uTime * 0.012, 0.0));
  float d = remap01(cov, (1.0 - n1.r) * mix(0.62, 0.78, hf), 1.0);
  float soft = uLook2.z * mix(0.05, 0.3, uLook2.y) * S;
  float baseY = uShape.x + (n1.a - 0.5) * soft * 2.2 * uLook2.y;
  d *= smoothstep(baseY - soft * 0.4, baseY + soft, p.y);
  float ceil_ = uShape.y - n1.g * 0.2 * S;
  d *= smoothstep(ceil_, ceil_ - 0.24 * S, p.y);
  return d;
}
float fullDensity(vec3 p, float sd, out float cov){
  vec4 n1;
  float d = baseDensity(p, sd, n1, cov);
  if (d <= 0.0) return 0.0;
  float hf = heightFrac(p);
  vec3 q = noiseCoord(p);
  vec3 w = (n1.aga - 0.5) * 0.3;
  vec4 n2 = texture(tNoise, q * 0.72 + w + vec3(0.0, -uTime * 0.03, uTime * 0.006));
  float detail = mix(n2.g, n2.b, 0.2);
  float billowy = smoothstep(0.06, 0.4, hf);
  d = remap01(d, mix(1.0 - detail, detail, billowy) * mix(0.5, 0.42, billowy), 1.0);
  return pow(d, mix(1.05, 0.55, hf));
}
float lightDensity(vec3 p){
  float sd = shapeSD(p);
  if (sd > uShape.z) return 0.0;
  vec4 n1; float cov;
  return baseDensity(p, sd, n1, cov);
}
vec2 boxHit(vec3 ro, vec3 rd){
  vec3 inv = 1.0 / rd;
  vec3 a = (uBoxMin - ro) * inv, b = (uBoxMax - ro) * inv;
  vec3 lo = min(a, b), hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}
void main(){
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vW - ro);
  vec2 h = boxHit(ro, rd);
  float t0 = max(h.x, 0.0), t1 = h.y;
  if (uUseDepth > 0.5) {
    t1 = min(t1, texture2D(tDepth, gl_FragCoord.xy / uResolution).r);
  }
  if (t1 <= t0) discard;
  float size = uLook2.z;
  float grey = uLook.x, storm = uLook.y, hover = uLook.w;
  float sigma = 20.0 / S * uLook.z / max(0.6, pow(size, 0.35));
  float chord = t1 - t0;
  float ds = max(chord / uSteps, 0.02 * S);
  float t = t0 + ds * ign(gl_FragCoord.xy);
  vec3 col = vec3(0.0);
  float T = 1.0;
  int lightEvery = 0;
  float od = 0.0;
  for (int i = 0; i < 64; i++) {
    if (t > t1) break;
    vec3 p = ro + rd * t;
    float sd = shapeSD(p);
    if (sd > uShape.z) { t += max(ds, sd - uShape.z); continue; }
    float cov;
    float dens = fullDensity(p, sd, cov);
    if (dens > 0.004) {
      vec3 L = normalize(uLightPos - p);
      if (lightEvery == 0) {
        od = 0.0;
        float st = (size * 0.09 + 0.03) * S;
        vec3 lp = p;
        for (int j = 0; j < 5; j++) { lp += L * st; od += lightDensity(lp) * st; st *= 1.65; }
        od *= sigma;
      }
      lightEvery = 1 - lightEvery;
      float hf = heightFrac(p);
      float low = 1.0 - smoothstep(0.02, 0.7, hf);
      float c = dot(rd, L);
      float backlit = smoothstep(0.3, 0.9, c);
      float ph0 = mix(hg(c, -0.3), hg(c, 0.8), 0.5);
      float ph1 = mix(hg(c, -0.15), hg(c, 0.4), 0.5);
      float ph2 = mix(hg(c, -0.07), hg(c, 0.2), 0.5);
      float powder = mix(1.0, 1.0 - exp(-od * 2.0 - dens * 0.6), 0.75 * (1.0 - backlit));
      float lum = exp(-od) * ph0 * powder + 0.45 * exp(-od * 0.3) * ph1 + 0.22 * exp(-od * 0.1) * ph2;
      vec3 sunCol = uLightColor * 13.0;
      float depthIn = clamp(-sd / (size * S * 0.6), 0.0, 1.0);
      vec3 amb = mix(uAmbient * 0.8 + uLidGlow * 0.05 * low, uSky, smoothstep(0.0, 0.85, hf)) * mix(1.0, 0.3, depthIn) * (0.55 + 0.45 * exp(-od * 0.35));
      vec3 Lin = sunCol * lum + amb;
      Lin *= 1.0 - low * (grey * 0.45 + storm * 0.58);
      Lin += vec3(0.8, 0.85, 1.0) * uFlash * 1.6 * (0.35 + 0.65 * low);
      Lin += vec3(0.72, 0.8, 1.0) * uGlow.w * 2.6 * exp(-length(p - uGlow.xyz) / (size * S) * 3.4);
      Lin += hover * smoothstep(0.7, 0.3, cov) * (sunCol * 0.03 + uSky * 0.3);
      vec3 alb = mix(vec3(1.0), vec3(0.37, 0.4, 0.47), grey);
      alb = mix(alb, vec3(0.2, 0.215, 0.26), storm * 0.85);
      float a = 1.0 - exp(-dens * sigma * ds);
      col += T * alb * Lin * a;
      T *= 1.0 - a;
      if (T < 0.02) break;
    }
    t += ds;
  }
  float alpha = (1.0 - T) * uLook2.x;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col * uLook2.x, alpha);
}`;
