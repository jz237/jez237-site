import * as THREE from 'three/webgpu';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { TriangleBVH } from './triangleBVH.mjs';
import { BettaSwim, BETTA_SCALE as SCALE } from './bettaSwim.mjs';
import { BETTA_PROBES, BETTA_SURFACE_COUNT, bettaSurfaceHeights, readBettaWater } from './bettaWater.mjs';
import type { Feeder, FoodAim } from './FishFood';
import type { KoiEnv, KoiSense } from './Koi';

/** The dimple the lips make at the film: for how long (s into the gulp), at what rate it adds speed
 *  to the water under them (world units/s per s), over what radius; the bubbles let go diving
 *  from the film and darting off it (per second), their radius. */
export const RIPPLE_TIME = 0.34, RIPPLE_RATE = 6, RIPPLE_RADIUS = 0.045;
const DIVE_BUBBLES = 14, STARTLE_BUBBLES = 36;
export const BUBBLE_RADIUS = 0.0035;

/** The actual Atelier specimen, evaluated on the CPU for the refracted rays.
 * No screenshot/billboard: skin, seven membranes, mouth, covers and both eye
 * sockets remain separate animated three-dimensional surfaces. */
export class Betta implements Feeder {
  readonly fish = createBetta({ compact: true });
  readonly rig = new THREE.Group();
  readonly atlas: THREE.CanvasTexture;
  readonly texture: THREE.DataTexture;
  readonly bvh: TriangleBVH;
  readonly ready: Promise<void>;
  private readonly meshes: { mesh: THREE.Mesh; offset: number }[] = [];
  private readonly vertices: Float32Array;
  private readonly probes = new Float32Array(16 * 4);
  private readonly flow = new THREE.Vector3();
  private readonly surface = new Float32Array(BETTA_SURFACE_COUNT * 4);
  private readonly mouth = new THREE.Vector3();
  private level = 0.18;
  private readonly rippleAt = new THREE.Vector3();
  private readonly bubbleAt = new THREE.Vector3();
  private ripple = 0;
  private bubbleDebt = 0;
  private bubbleCount = 0;
  readonly swim = new BettaSwim();
  waterState: ReturnType<typeof readBettaWater> | null = null;
  private time = 0;
  private loaded = false;
  active = false;
  flared = false;
  /** Feeding (FishFood): the pellet it is after and how wide to open for it, set each frame; how
   *  far from its lips it can take one. */
  food: FoodAim | null = null;
  gapeWant = 0;
  readonly reach = 0.055;
  /** What else is in the water (the bowl's furnishings: sim frame), set by the host. Its route
   *  keeps round them (bettaSwim.mjs), and its body out of their solid parts. */
  obstacles: { a: number[]; b: number[]; r: number; solid: number }[] = [];

  /** The obstacles' solid parts its body could touch this frame (inside its box, grown by what
   *  the contact passes can shift it), each ready for the test: its start, its length, and one
   *  over its length squared. */
  private solidsNear(): { ax: number; ay: number; az: number; abx: number; aby: number; abz: number; inv: number; solid: number }[] {
    if (!this.obstacles.length) return [];
    const v = this.vertices;
    const lo = [Infinity, Infinity, Infinity];
    const hi = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < v.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (v[i + k] < lo[k]) lo[k] = v[i + k];
        if (v[i + k] > hi[k]) hi[k] = v[i + k];
      }
    }
    const near = [];
    for (const o of this.obstacles) {
      if (o.solid <= 0) continue;
      const s = o.solid + 0.05;
      let apart = false;
      for (let k = 0; k < 3; k++) if (Math.min(o.a[k], o.b[k]) - s > hi[k] || Math.max(o.a[k], o.b[k]) + s < lo[k]) apart = true;
      if (apart) continue;
      const abx = o.b[0] - o.a[0], aby = o.b[1] - o.a[1], abz = o.b[2] - o.a[2];
      const l2 = abx * abx + aby * aby + abz * abz;
      near.push({ ax: o.a[0], ay: o.a[1], az: o.a[2], abx, aby, abz, inv: l2 > 1e-12 ? 1 / l2 : 0, solid: o.solid });
    }
    return near;
  }

  constructor() {
    this.rig.add(this.fish);
    this.rig.scale.setScalar(SCALE);
    this.fish.userData.locomotion = this.locomotion();
    this.fish.userData.update(0);
    this.rig.updateMatrixWorld(true);
    const positions: number[] = [], indices: number[] = [], uv: number[] = [], finUV: number[] = [], materials: number[] = [];
    this.fish.traverse((object: THREE.Object3D) => {
      if (!(object as THREE.Mesh).isMesh) return;
      const mesh = object as THREE.Mesh, g = mesh.geometry;
      const offset = positions.length / 3;
      this.meshes.push({ mesh, offset });
      for (let i = 0; i < g.attributes.position.count; i++) {
        positions.push(g.attributes.position.getX(i), g.attributes.position.getY(i), g.attributes.position.getZ(i));
        uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i));
        const fu = g.attributes.finUV;
        finUV.push(fu ? fu.getX(i) : 0, fu ? fu.getY(i) : 0);
      }
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      // 0: skin; 1: caudal; 2: other fins; 3: eye; 4: dark mouth/pupil.
      const material = !mat.map ? 4 : mesh.parent !== this.fish ? 3 : mesh.userData.kind === 0 ? 1 : mesh.userData.kind !== undefined ? 2 : 0;
      for (let i = 0; i < g.index!.count; i++) indices.push(g.index!.getX(i) + offset);
      for (let i = 0; i < g.index!.count / 3; i++) materials.push(material);
    });
    this.vertices = new Float32Array(positions);
    this.bvh = new TriangleBVH(this.vertices, new Uint32Array(indices), new Float32Array(uv), materials, new Float32Array(finUV));
    this.texture = new THREE.DataTexture(this.bvh.data, this.bvh.width, this.bvh.height, THREE.RGBAFormat, THREE.FloatType);
    this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.needsUpdate = true;
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 3072;
    this.atlas = new THREE.CanvasTexture(canvas);
    // Raw shader samples explicitly decode sRGB; no implicit colour-space node.
    this.atlas.colorSpace = THREE.NoColorSpace;
    this.atlas.flipY = false;
    this.atlas.generateMipmaps = true;
    this.ready = this.fish.userData.ready.then(() => {
      const body = this.meshes.find(({ mesh }) => mesh.name.startsWith('Arc-length'))!.mesh;
      const tail = this.meshes.find(({ mesh }) => mesh.userData.kind === 0)!.mesh;
      const macro = this.fish.userData.macroTextures;
      const textures = [(body.material as THREE.MeshPhysicalMaterial).map!, (tail.material as THREE.MeshPhysicalMaterial).map!, macro.head, macro.scales, macro.fin];
      const ctx = canvas.getContext('2d')!;
      textures.forEach((t, i) => ctx.drawImage(t.image, (i % 2) * 1024, Math.floor(i / 2) * 1024, 1024, 1024));
      this.atlas.needsUpdate = true;
      this.loaded = true;
    });
    this.updateVertices();
    this.updateProbes();
  }

  update(dt: number, sense: KoiSense | null, env: KoiEnv): void {
    if (!this.active || !this.loaded) {
      if (this.bvh.data[3]) { this.bvh.data[3] = 0; this.texture.needsUpdate = true; }
      return;
    }
    dt = Math.max(0, Math.min(dt, 0.07));
    this.time += dt;
    this.level = env.level;
    // Sample the actual current and its rotation across the moving anatomy.
    this.waterState = readBettaWater(sense, this.probes, env);
    const target = new THREE.Vector3().fromArray(this.waterState.flow);
    this.flow.lerp(target, 1 - Math.exp(-5 * dt));
    this.swim.food = this.food ? this.food.pos : null;
    this.swim.obstacles = this.obstacles;
    this.swim.gape = this.gapeWant;
    // The tail's own working (read back from last frame's gait) is what lets the body gain speed.
    this.swim.advance(dt, this.flow.toArray(), env, this.waterState.submerged > 0.99, this.waterState, this.fish.userData.stroke ?? null);
    this.fish.userData.locomotion = this.locomotion();
    this.fish.userData.externalFlow = this.flow.clone().multiplyScalar(1 / SCALE).toArray();
    // The same one-second opening as the standalone specimen.
    this.fish.userData.display.requested = this.flared || this.swim.flaring;
    this.fish.userData.update(this.time);
    // (Its BVH is refitted once, after the contact passes have moved it.)
    this.updateVertices(false);
    // Contact against the glass and sampled bed, not a fixed waterline: sloshing
    // can carry the fish vertically and the density probes guide its recovery.
    const near = this.solidsNear();
    for (let pass = 0; pass < 4; pass++) {
      let worst = 0, dx = 0, dy = 0, dz = 0, bottom = Infinity;
      for (let i = 0; i < this.vertices.length; i += 3) {
        const x = this.vertices[i], y = this.vertices[i + 1], z = this.vertices[i + 2];
        bottom = Math.min(bottom, y);
        const r = Math.sqrt(x * x + y * y + z * z), excess = r - env.radius + 0.012;
        if (excess > worst) { worst = excess; dx = -x / r * excess; dy = -y / r * excess; dz = -z / r * excess; }
        for (const o of near) {
          const t = Math.max(0, Math.min(1, ((x - o.ax) * o.abx + (y - o.ay) * o.aby + (z - o.az) * o.abz) * o.inv));
          const ox = x - o.ax - o.abx * t, oy = y - o.ay - o.aby * t, oz = z - o.az - o.abz * t, l = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const into = o.solid - l;
          if (into > worst && l > 1e-9) { worst = into; dx = ox / l * into; dy = oy / l * into; dz = oz / l * into; }
        }
      }
      dy += Math.max(0, this.waterState.sand + 0.012 - bottom - dy);
      if (Math.hypot(dx, dy, dz) < 1e-6) break;
      const shift = [dx, dy, dz];
      for (let k = 0; k < 3; k++) {
        this.swim.position[k] += shift[k];
        this.fish.position.setComponent(k, this.fish.position.getComponent(k) + shift[k] / SCALE);
        if (shift[k] * this.swim.drift[k] < 0) this.swim.drift[k] = 0;
      }
      for (let i = 0; i < this.vertices.length; i++) this.vertices[i] += shift[i % 3];
    }
    this.bvh.refit(this.vertices);
    this.bvh.data[3] = 1;
    this.texture.needsUpdate = true;
    this.updateProbes();
    this.disturb(dt);
  }

  /** What the fish did to the water at the film this frame, for the sim to take once (main.ts):
   *  a push down at the lips (speed to add along the water's weight; where) and bubbles let go
   *  (how many; where). Both reset. */
  takeDisturbance(): { push: number; pushAt: THREE.Vector3; bubbles: number; bubblesAt: THREE.Vector3 } {
    const out = { push: this.ripple, pushAt: this.rippleAt, bubbles: this.bubbleCount, bubblesAt: this.bubbleAt };
    this.ripple = 0;
    this.bubbleCount = 0;
    return out;
  }

  private disturb(dt: number): void {
    const s = this.swim, surface = this.waterState?.surface ?? this.level, lip = this.mouth;
    // Opening its mouth at the film, the lips draw the water in: the surface dimples, then rings.
    if (s.mode === 'gulp' && s.gulpClock < RIPPLE_TIME && Math.abs(lip.y - surface) < 0.03) {
      this.rippleAt.set(lip.x, surface, lip.z);
      this.ripple += RIPPLE_RATE * dt * Math.sin(Math.PI * Math.min(1, s.gulpClock / RIPPLE_TIME));
    }
    // Diving from the film (and darting off it), the air it took in leaves as a few small bubbles.
    const bubbling = (s.mode === 'dive' && s.timer > 0.55) ? DIVE_BUBBLES : (s.mode === 'startle' && s.startleDive && s.startleClock < 0.4) ? STARTLE_BUBBLES : 0;
    if (bubbling > 0 && surface - lip.y < 0.09) {
      this.bubbleDebt += bubbling * dt;
      const n = Math.floor(this.bubbleDebt);
      if (n > 0) {
        this.bubbleDebt -= n;
        this.bubbleCount += n;
        this.bubbleAt.set(lip.x, lip.y - 0.004, lip.z);
      }
    } else this.bubbleDebt = 0;
  }

  private updateProbes(): void {
    this.rig.updateMatrixWorld(true);
    const scratch = [0, 0, 0, 0], p = new THREE.Vector3();
    for (let i = 0; i < 16; i++) {
      const local = BETTA_PROBES[i];
      this.fish.userData.bodyMotion.transform(local[0], local[1], local[2], scratch);
      p.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
      this.probes.set([p.x, p.y, p.z, 0], i * 4);
    }
    // The lips, where it would meet the surface.
    this.fish.userData.bodyMotion.transform(-1.68, 0.0832, 0, scratch);
    this.mouth.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
  }

  probePoints(): Float32Array { return this.probes; }

  mouthAt(): [number, number, number] {
    return [this.mouth.x, this.mouth.y, this.mouth.z];
  }

  ahead(): [number, number, number] {
    const s = this.swim;
    return [-Math.cos(s.heading) * Math.cos(s.pitch), Math.sin(s.pitch), Math.sin(s.heading) * Math.cos(s.pitch)];
  }

  busy(): boolean {
    return !this.active || !this.loaded || this.swim.mode === 'startle';
  }

  /** A vertical column of density probes through the free surface above the mouth. */
  surfaceProbes(): Float32Array {
    const heights = bettaSurfaceHeights(this.level);
    for (let k = 0; k < BETTA_SURFACE_COUNT; k++) this.surface.set([this.mouth.x, heights[k], this.mouth.z, 0], k * 4);
    return this.surface;
  }

  private locomotion() {
    // The route belongs to the neck/head, not a pivot in the middle of the fish.
    // Offsetting the model origin lets the head lead while the rear curls behind.
    const s = this.swim, h = s.heading, p = s.pitch, length = 1.22 * SCALE;
    const offset = [length * Math.cos(h) * Math.cos(p), -length * Math.sin(p), -length * Math.sin(h) * Math.cos(p)];
    const offsetVelocity = [
      -length * (Math.sin(h) * Math.cos(p) * s.angularVelocity + Math.cos(h) * Math.sin(p) * s.pitchRate),
      -length * Math.cos(p) * s.pitchRate,
      length * (-Math.cos(h) * Math.cos(p) * s.angularVelocity + Math.sin(h) * Math.sin(p) * s.pitchRate),
    ];
    return { ...s, speed: s.speed / SCALE, position: s.position.map((v, k) => (v + offset[k]) / SCALE), velocity: s.velocity.map((v, k) => (v + offsetVelocity[k]) / SCALE) };
  }

  private updateVertices(refit = true): void {
    this.rig.updateMatrixWorld(true);
    const body = this.fish.userData.bodyMotion;
    const scratch = [0, 0, 0, 0], p = new THREE.Vector3();
    for (const { mesh, offset } of this.meshes) {
      const g = mesh.geometry, source = g.attributes.position;
      const deform = (mesh.material as THREE.Material).userData.bettaDeform;
      for (let i = 0; i < source.count; i++) {
        p.fromBufferAttribute(source, i);
        if (deform) {
          if (deform.operculum) p.z += g.attributes.coverLift.getX(i) * (body.gill * 0.046 + this.fish.userData.display.flare * 0.085);
          body.transform(p.x, p.y, p.z, scratch);
          p.set(scratch[0], scratch[1], scratch[2]);
          const fin = deform.dynamics;
          if (fin) {
            const x = g.attributes.finUV.getX(i) * (fin.columns - 1), y = g.attributes.finUV.getY(i) * (fin.rows - 1);
            const a = Math.floor(x), b = Math.floor(y), xx = Math.min(a + 1, fin.columns - 1), yy = Math.min(b + 1, fin.rows - 1);
            const u = x - a, v = y - b, data = fin.displacement;
            for (let k = 0; k < 3; k++) {
              const upper = data[(b * fin.columns + a) * 4 + k] * (1 - u) + data[(b * fin.columns + xx) * 4 + k] * u;
              const lower = data[(yy * fin.columns + a) * 4 + k] * (1 - u) + data[(yy * fin.columns + xx) * 4 + k] * u;
              p.setComponent(k, p.getComponent(k) + upper * (1 - v) + lower * v);
            }
          }
        }
        p.applyMatrix4(mesh.matrixWorld);
        p.toArray(this.vertices, (offset + i) * 3);
      }
    }
    if (refit) this.bvh.refit(this.vertices);
  }
}
