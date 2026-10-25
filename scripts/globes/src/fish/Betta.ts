import * as THREE from 'three/webgpu';
import { createBetta } from '../../../betta-atelier/src/fish.js';
import { TriangleBVH } from './triangleBVH.mjs';
import { BETTA_LEAF_WORKGROUP, bettaRefitBuffers, bettaRefitLayout, bettaRefitPlan, bettaRefitWGSL } from './bettaRefit.mjs';
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

/** What updateVertices reads of a fin's solver (betta-atelier's FinDynamics). */
interface FinSolver {
  columns: number;
  rows: number;
  rest: Float32Array;
  displacement: Float32Array;
  carried: Float64Array;
  carriedBy: unknown;
  carriedAt: number;
}

/** One mesh's share of the vertices, and what deforming it takes, worked out once: its rest
 *  positions; whether the body carries it (deform), its cover's lift (the opercula), its fin; for
 *  a fin's vertices, the four displacement texels round each (offsets), its place between them
 *  (u, v), and the solver node it sits on (or -1). */
interface Part {
  mesh: THREE.Mesh;
  offset: number;
  rest: Float32Array;
  deform: boolean;
  cover: Float32Array | null;
  fin: FinSolver | null;
  cells: Int32Array | null;
  place: Float64Array | null;
  nodes: Int32Array | null;
}

/** The actual Atelier specimen, evaluated on the CPU for the refracted rays.
 * No screenshot/billboard: skin, seven membranes, mouth, covers and both eye
 * sockets remain separate animated three-dimensional surfaces. */
export class Betta implements Feeder {
  readonly fish = createBetta({ compact: true });
  readonly rig = new THREE.Group();
  readonly atlas: THREE.CanvasTexture;
  /** Its BVH for the shader (triangleBVH.mjs's layout), on the GPU, where it is refitted round the
   *  moving fish each frame (bettaRefit.mjs). */
  readonly texture: THREE.Texture;
  /** (As built round the first pose: the texture's first contents.) */
  readonly bvh: TriangleBVH;
  readonly ready: Promise<void>;
  private readonly meshes: { mesh: THREE.Mesh; offset: number }[] = [];
  private readonly parts: Part[];
  private readonly vertices: Float32Array;
  private readonly device: GPUDevice;
  private readonly gpu: { texture: GPUTexture; vertices: GPUBuffer; group: GPUBindGroup; leaves: GPUComputePipeline; nodes: GPUComputePipeline; leafGroups: number };
  /** The texture's first texel (node count, triangle texel offset, triangle count, visible), and
   *  whether it says visible. */
  private readonly header: Float32Array;
  private shown = false;
  private readonly probes = new Float32Array(16 * 4);
  private readonly flow = new THREE.Vector3();
  // (Scratch, so that a frame allocates little.)
  private readonly carry = [0, 0, 0, 0];
  private readonly point = new THREE.Vector3();
  private readonly flowTarget = new THREE.Vector3();
  private readonly flowNow = [0, 0, 0];
  private readonly flowLocal = [0, 0, 0];
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

  constructor(device: GPUDevice) {
    this.device = device;
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
    this.parts = this.meshes.map(({ mesh, offset }) => {
      const g = mesh.geometry, rest = g.attributes.position.array as Float32Array;
      const deform = (mesh.material as THREE.Material).userData.bettaDeform;
      const fin: FinSolver | null = deform?.dynamics ?? null;
      const part: Part = { mesh, offset, rest, deform: !!deform, cover: deform?.operculum ? g.attributes.coverLift.array as Float32Array : null, fin, cells: null, place: null, nodes: null };
      if (fin) {
        const count = g.attributes.position.count, fu = g.attributes.finUV.array as Float32Array;
        const w = fin.columns, h = fin.rows;
        part.cells = new Int32Array(count * 4);
        part.place = new Float64Array(count * 2);
        part.nodes = new Int32Array(count);
        for (let i = 0; i < count; i++) {
          const x = fu[i * 2] * (w - 1), y = fu[i * 2 + 1] * (h - 1);
          const a = Math.floor(x), b = Math.floor(y), xx = Math.min(a + 1, w - 1), yy = Math.min(b + 1, h - 1);
          part.cells.set([(b * w + a) * 4, (b * w + xx) * 4, (yy * w + a) * 4, (yy * w + xx) * 4], i * 4);
          part.place[i * 2] = x - a;
          part.place[i * 2 + 1] = y - b;
          // (The node it sits on, if its rest is that node's to the bit: the body carries both alike.)
          const n = Math.round(y) * w + Math.round(x);
          part.nodes[i] = [0, 1, 2].every((k) => fin.rest[n * 3 + k] === rest[i * 3 + k]) ? n : -1;
        }
      }
      return part;
    });
    // (Its tree is split round the first pose, in the bowl's frame, where the shader traces it.)
    this.updateVertices();
    this.bvh = new TriangleBVH(this.vertices, new Uint32Array(indices), new Float32Array(uv), materials, new Float32Array(finUV));
    this.header = this.bvh.data.slice(0, 4);
    this.gpu = this.refitter();
    // (Wrapped for three.js as GlobeView's texelTexture wraps the others: read texel by texel, no sampler.)
    this.texture = new THREE.ExternalTexture(this.gpu.texture);
    (this.texture as unknown as { image: object }).image = { width: this.bvh.width, height: this.bvh.height };
    this.texture.type = THREE.FloatType;
    this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 3072;
    this.atlas = new THREE.CanvasTexture(canvas);
    // Raw shader samples explicitly decode sRGB; no implicit colour-space node.
    this.atlas.colorSpace = THREE.NoColorSpace;
    this.atlas.flipY = false;
    // (No mipmaps: betta_sample reads level 0 only, bettaWGSL.ts.)
    this.atlas.generateMipmaps = false;
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
    // (The whole texture once; hidden until it swims.)
    device.queue.writeTexture({ texture: this.gpu.texture }, this.bvh.data as unknown as BufferSource, { bytesPerRow: this.bvh.width * 16, rowsPerImage: this.bvh.height }, [this.bvh.width, this.bvh.height]);
    this.updateProbes();
  }

  /** The GPU's side of the BVH: its texture, the kernels that refit it (bettaRefit.mjs) and their
   *  tables, uploaded once; the vertices' buffer, written each frame. */
  private refitter(): Betta['gpu'] {
    const device = this.device, plan = bettaRefitPlan(this.bvh, this.vertices.length / 3);
    const texture = device.createTexture({ label: 'betta BVH', size: [this.bvh.width, this.bvh.height], format: 'rgba32float', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST });
    const U = GPUBufferUsage;
    const buffers: Record<string, GPUBuffer> = {};
    for (const [name, b] of Object.entries(bettaRefitBuffers(plan))) {
      buffers[name] = device.createBuffer({ label: `betta: ${name}`, size: b.size, usage: (b.usage === 'uniform' ? U.UNIFORM : U.STORAGE) | U.COPY_DST });
      if (b.data) device.queue.writeBuffer(buffers[name], 0, b.data as unknown as BufferSource);
    }
    const layout = device.createBindGroupLayout({ label: 'betta refit', entries: bettaRefitLayout() as GPUBindGroupLayoutEntry[] });
    const module = device.createShaderModule({ label: 'betta refit', code: bettaRefitWGSL });
    const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [layout] });
    const pipe = (entryPoint: string) => device.createComputePipeline({ label: `betta: ${entryPoint}`, layout: pipelineLayout, compute: { module, entryPoint } });
    const names = ['bettaRefit', 'bettaVerts', 'bettaSlots', 'bettaWords', 'bettaRecords', 'bettaNodeBox'];
    const group = device.createBindGroup({
      label: 'betta refit',
      layout,
      entries: [...names.map((name, binding) => ({ binding, resource: { buffer: buffers[name] } })), { binding: names.length, resource: texture.createView() }],
    });
    return { texture, vertices: buffers.bettaVerts, group, leaves: pipe('bettaLeaves'), nodes: pipe('bettaNodes'), leafGroups: Math.ceil(plan.leafCount / BETTA_LEAF_WORKGROUP) };
  }

  update(dt: number, sense: KoiSense | null, env: KoiEnv): void {
    if (!this.active || !this.loaded) {
      this.show(false);
      return;
    }
    dt = Math.max(0, Math.min(dt, 0.07));
    this.time += dt;
    this.level = env.level;
    // Sample the actual current and its rotation across the moving anatomy.
    this.waterState = readBettaWater(sense, this.probes, env);
    this.flow.lerp(this.flowTarget.fromArray(this.waterState.flow), 1 - Math.exp(-5 * dt));
    this.swim.food = this.food ? this.food.pos : null;
    this.swim.obstacles = this.obstacles;
    this.swim.gape = this.gapeWant;
    // The tail's own working (read back from last frame's gait) is what lets the body gain speed.
    this.swim.advance(dt, this.flow.toArray(this.flowNow), env, this.waterState.submerged > 0.99, this.waterState, this.fish.userData.stroke ?? null);
    this.fish.userData.locomotion = this.locomotion();
    const toLocal = 1 / SCALE;
    this.flowLocal[0] = this.flow.x * toLocal; this.flowLocal[1] = this.flow.y * toLocal; this.flowLocal[2] = this.flow.z * toLocal;
    this.fish.userData.externalFlow = this.flowLocal;
    // The same one-second opening as the standalone specimen.
    this.fish.userData.display.requested = this.flared || this.swim.flaring;
    this.fish.userData.update(this.time);
    // (Its BVH is refitted once, after the contact passes have moved it.)
    this.updateVertices();
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
      const v = this.vertices;
      for (let i = 0; i < v.length; i += 3) { v[i] += dx; v[i + 1] += dy; v[i + 2] += dz; }
    }
    this.refit();
    this.show(true);
    this.updateProbes();
    this.disturb(dt);
  }

  /** The BVH refitted round this frame's vertices, on the GPU: submitted now, before the frame that
   *  draws them is. */
  private refit(): void {
    const { device, gpu } = this;
    device.queue.writeBuffer(gpu.vertices, 0, this.vertices as unknown as BufferSource);
    const enc = device.createCommandEncoder({ label: 'betta' });
    const pass = enc.beginComputePass({ label: 'betta refit' });
    pass.setBindGroup(0, gpu.group);
    pass.setPipeline(gpu.leaves);
    pass.dispatchWorkgroups(gpu.leafGroups);
    pass.setPipeline(gpu.nodes);
    pass.dispatchWorkgroups(1);
    pass.end();
    device.queue.submit([enc.finish()]);
  }

  /** Whether the shader traces it (the header's flag), written when that changes. */
  private show(on: boolean): void {
    if (this.shown === on) return;
    this.shown = on;
    this.header[3] = on ? 1 : 0;
    this.device.queue.writeTexture({ texture: this.gpu.texture }, this.header as unknown as BufferSource, { bytesPerRow: 16 }, [1, 1]);
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
    const scratch = this.carry, p = this.point;
    for (let i = 0; i < 16; i++) {
      const local = BETTA_PROBES[i];
      this.fish.userData.bodyMotion.transform(local[0], local[1], local[2], scratch);
      p.set(scratch[0], scratch[1], scratch[2]).applyMatrix4(this.fish.matrixWorld);
      this.probes[i * 4] = p.x; this.probes[i * 4 + 1] = p.y; this.probes[i * 4 + 2] = p.z; this.probes[i * 4 + 3] = 0;
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

  private updateVertices(): void {
    this.rig.updateMatrixWorld(true);
    const body = this.fish.userData.bodyMotion, out = this.vertices, s = this.carry;
    const lift = body.gill * 0.046 + this.fish.userData.display.flare * 0.085;
    for (const { mesh, offset, rest, deform, cover, fin, cells, place, nodes } of this.parts) {
      const e = mesh.matrixWorld.elements, count = rest.length / 3;
      // (A fin's vertices that sit on its solver's nodes: the body carried those this frame already,
      // for the solver's displacement, unless the solver took no step.)
      const carried = fin && fin.carriedBy === body && fin.carriedAt === body.revision ? fin.carried : null;
      const data = fin ? fin.displacement : null;
      for (let i = 0; i < count; i++) {
        let x = rest[i * 3], y = rest[i * 3 + 1], z = rest[i * 3 + 2];
        if (deform) {
          if (cover) z += cover[i] * lift;
          const n = carried ? nodes![i] : -1;
          if (n >= 0) {
            x = carried![n * 3]; y = carried![n * 3 + 1]; z = carried![n * 3 + 2];
          } else {
            body.transform(x, y, z, s);
            x = s[0]; y = s[1]; z = s[2];
          }
          if (data) {
            const c0 = cells![i * 4], c1 = cells![i * 4 + 1], c2 = cells![i * 4 + 2], c3 = cells![i * 4 + 3];
            const u = place![i * 2], v = place![i * 2 + 1];
            x = x + (data[c0] * (1 - u) + data[c1] * u) * (1 - v) + (data[c2] * (1 - u) + data[c3] * u) * v;
            y = y + (data[c0 + 1] * (1 - u) + data[c1 + 1] * u) * (1 - v) + (data[c2 + 1] * (1 - u) + data[c3 + 1] * u) * v;
            z = z + (data[c0 + 2] * (1 - u) + data[c1 + 2] * u) * (1 - v) + (data[c2 + 2] * (1 - u) + data[c3 + 2] * u) * v;
          }
        }
        // (Vector3.applyMatrix4, written out.)
        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]), o = (offset + i) * 3;
        out[o] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        out[o + 1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        out[o + 2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
      }
    }
  }
}
