import * as THREE from 'three/webgpu';
import { TriangleBVH } from './triangleBVH.mjs';
import { BETTA_LEAF_WORKGROUP, bettaRefitBuffers, bettaRefitLayout, bettaRefitPlan, bettaRefitWGSL } from './bettaRefit.mjs';
import { BettaRemote } from './bettaLink.mjs';
import { BettaSpecimen } from './bettaSpecimen.mjs';
import { BETTA_SURFACE_COUNT, bettaSurfaceHeights } from './bettaWater.mjs';
import { CAUDAL, caudalCells, luminanceOf, MACRO, measure, painting, prepare, PROFILE, profileCells } from './bettaPaint.mjs';
import { VARIETIES, varietyLook, varietyOf } from './varieties.mjs';
import type { Feeder, FoodAim } from './FishFood';
import type { KoiEnv, KoiSense } from './Koi';
import { CLEAR_WATER, type WaterEffects } from '../water/effects';

export { BUBBLE_RADIUS, RIPPLE_RADIUS, RIPPLE_RATE, RIPPLE_TIME } from './bettaSpecimen.mjs';

/** A bowl not turning (update's omega, unless given). */
const STILL = [0, 0, 0] as const;
/** Where the colour maps (tiles 4 and 5) start down the atlas (px). */
export const MAPS_AT = 2048;
/** How long a variety's maps are painted for in a frame (ms; Betta.showVariety). */
const PAINT_MS = 3;

/** The actual Atelier specimen, evaluated on the CPU for the refracted rays (bettaSpecimen.mjs).
 * No screenshot/billboard: skin, seven membranes, mouth, covers and both eye
 * sockets remain separate animated three-dimensional surfaces. It is moved on the page's thread, or
 * (inWorker) a twin of it is moved in a worker (bettaWorker.mjs, bettaLink.mjs), off the page's
 * thread and a frame behind: each frame the page then draws the pose the worker made of the last
 * frame's step (after a late reply, of the one before), and reads that pose's probes, mouth and
 * swim, so the fish drawn and the fish the water and the food meet are one. */
export class Betta implements Feeder {
  /** The fish, moved here; with a worker, as built (the worker's twin is moved instead). */
  private readonly specimen = new BettaSpecimen();
  readonly fish = this.specimen.fish;
  /** Its photographs, for the shader: six 1024 px tiles, two across and three down (the profile, the
   *  fins, the head and scale macros, then its variety's two colour maps: bettaPaint.mjs). */
  readonly atlas: THREE.CanvasTexture;
  /** The atlas's bottom row as a variety repaints it (its colour maps, drawn up to the tiles' size),
   *  for the host to copy in (lookHost). */
  readonly maps: THREE.CanvasTexture;
  /** The shader's numbers for its variety (varieties.mjs varietyLook: GlobeView setBettaLook). */
  readonly look = new Float32Array(16);
  /** The host, told as a variety is shown (lookHost). */
  private host: ((copy: boolean) => void) | null = null;
  /** A variety shown before there was a host, and whether its maps are still to be copied. */
  private unsent: boolean | null = null;
  private variety = 'classic';
  /** The variety being painted, a few ms a frame (showVariety): a newer choice ends it. */
  private paintJob: object | null = null;
  /** The photographs' brightness, measured as they come in (bettaPaint.mjs measure), with where each
   *  cell of the maps lies on the fish. */
  private field: (ReturnType<typeof measure> & { cells: ReturnType<typeof profileCells>; caudalOut: Float32Array }) | null = null;
  /** Its BVH for the shader (triangleBVH.mjs's layout), on the GPU, where it is refitted round the
   *  moving fish each frame (bettaRefit.mjs). */
  readonly texture: THREE.Texture;
  /** (As built round the first pose: the texture's first contents.) */
  readonly bvh: TriangleBVH;
  readonly ready: Promise<void>;
  private readonly meshes = this.specimen.meshes;
  private readonly device: GPUDevice;
  private readonly gpu: { texture: GPUTexture; vertices: GPUBuffer; group: GPUBindGroup; leaves: GPUComputePipeline; nodes: GPUComputePipeline; leafGroups: number };
  /** The texture's first texel (node count, triangle texel offset, triangle count, visible), and
   *  whether it says visible. */
  private readonly header: Float32Array;
  private shown = false;
  /** The worker that moves it, if it is moved in one. */
  private remote: BettaRemote | null = null;
  private readonly surface = new Float32Array(BETTA_SURFACE_COUNT * 4);
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
  /** What the bowl's water is doing to it (water/effects.ts), set by the host each frame: how
   *  listless it is, how short of air, how closely it holds its fins (bettaSpecimen.mjs), and how
   *  keen it is on food (FishFood). */
  water: Readonly<WaterEffects> = CLEAR_WATER;

  get appetite(): number {
    return this.water.appetite;
  }

  constructor(device: GPUDevice, inWorker = false) {
    this.device = device;
    const indices: number[] = [], uv: number[] = [], finUV: number[] = [], materials: number[] = [];
    for (const { mesh, offset } of this.meshes) {
      const g = mesh.geometry;
      for (let i = 0; i < g.attributes.position.count; i++) {
        uv.push(g.attributes.uv.getX(i), g.attributes.uv.getY(i));
        const fu = g.attributes.finUV;
        finUV.push(fu ? fu.getX(i) : 0, fu ? fu.getY(i) : 0);
      }
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      // 0: skin; 1: caudal; 2: other fins; 3: eye; 4: dark mouth/pupil.
      const material = !mat.map ? 4 : mesh.parent !== this.fish ? 3 : mesh.userData.kind === 0 ? 1 : mesh.userData.kind !== undefined ? 2 : 0;
      for (let i = 0; i < g.index!.count; i++) indices.push(g.index!.getX(i) + offset);
      for (let i = 0; i < g.index!.count / 3; i++) materials.push(material);
    }
    // (Its tree is split round the first pose, in the bowl's frame, where the shader traces it.)
    this.bvh = new TriangleBVH(this.specimen.vertices, new Uint32Array(indices), new Float32Array(uv), materials, new Float32Array(finUV));
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
    const maps = document.createElement('canvas');
    maps.width = 2048; maps.height = 1024;
    this.maps = new THREE.CanvasTexture(maps);
    this.maps.colorSpace = THREE.NoColorSpace;
    this.maps.flipY = false;
    this.maps.generateMipmaps = false;
    this.ready = this.fish.userData.ready.then(() => {
      const body = this.meshes.find(({ mesh }) => mesh.name.startsWith('Arc-length'))!.mesh;
      const tail = this.meshes.find(({ mesh }) => mesh.userData.kind === 0)!.mesh;
      const macro = this.fish.userData.macroTextures;
      const textures = [(body.material as THREE.MeshPhysicalMaterial).map!, (tail.material as THREE.MeshPhysicalMaterial).map!, macro.head, macro.scales];
      const ctx = canvas.getContext('2d')!;
      textures.forEach((t, i) => ctx.drawImage(t.image, (i % 2) * 1024, Math.floor(i / 2) * 1024, 1024, 1024));
      this.atlas.needsUpdate = true;
      this.loaded = true;
      void this.measurePhotographs(textures);
    });
    // (The whole texture once; hidden until it swims.)
    device.queue.writeTexture({ texture: this.gpu.texture }, this.bvh.data as unknown as BufferSource, { bytesPerRow: this.bvh.width * 16, rowsPerImage: this.bvh.height }, [this.bvh.width, this.bvh.height]);
    // (The worker builds its twin while the page loads; the fish shows once its first pose is back.)
    if (inWorker) {
      try {
        this.remote = new BettaRemote(new Worker(new URL('./bettaWorker.mjs', import.meta.url), { type: 'module' }), this.specimen);
      } catch (err) {
        console.warn("[globes] the betta is moved on the page's thread:", err);
      }
    }
  }

  /** The photographs' brightness, on the maps' grids, for every variety to come (bettaPaint.mjs
   *  measure); then the variety chosen, if not Classic, is painted and shown. (Drawn down to the grids
   *  by createImageBitmap, off the page's thread: drawn down on it, for getImageData, they took a
   *  phone's main thread over 100 ms.) */
  private async measurePhotographs(textures: THREE.Texture[]): Promise<void> {
    try {
      const grid = async (t: THREE.Texture, w: number, h: number): Promise<Float32Array> => {
        const bitmap = await createImageBitmap(t.image as ImageBitmapSource, { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' });
        const small = document.createElement('canvas');
        small.width = w; small.height = h;
        const c = small.getContext('2d', { willReadFrequently: true })!;
        c.drawImage(bitmap, 0, 0);
        bitmap.close();
        return luminanceOf(c.getImageData(0, 0, w, h).data);
      };
      const [profile, caudal, head, scales] = await Promise.all([grid(textures[0], PROFILE.w, PROFILE.h), grid(textures[1], CAUDAL.w, CAUDAL.h), grid(textures[2], MACRO, MACRO), grid(textures[3], MACRO, MACRO)]);
      const cells = profileCells();
      this.field = { ...measure({ profile, caudal, head, scales }, cells), cells, caudalOut: caudalCells() };
      prepare(VARIETIES);
      this.showVariety(this.variety);
    } catch (err) {
      // (The fish stays as photographed.)
      console.warn("[globes] the betta's varieties:", err);
    }
  }

  /** Shows a variety (varieties.mjs id) once its photographs are in (else as they come): its colour
   *  maps painted a few ms a frame (bettaPaint.mjs), then drawn up into maps and, with its numbers in
   *  look, handed to the host together (lookHost). Classic, which has none, at once. */
  showVariety(variety: string): void {
    this.variety = variety;
    const field = this.field;
    if (!field) return;
    const v = varietyOf(variety);
    const job = (this.paintJob = {});
    if (!v.body) {
      varietyLook(v, field, this.look);
      this.handOver(false);
      return;
    }
    const rows = painting(v, field);
    const step = (): void => {
      if (this.paintJob !== job) return;
      const until = performance.now() + PAINT_MS;
      for (let r = rows.next(); ; r = rows.next()) {
        if (r.done) {
          this.drawMaps(r.value);
          this.maps.needsUpdate = true;
          varietyLook(v, field, this.look);
          this.handOver(true);
          return;
        }
        if (performance.now() > until) break;
      }
      requestAnimationFrame(step);
    };
    step();
  }

  /** Who is told as a variety is shown (once its photographs are in): it sets look in the shader,
   *  and, with copy, copies maps into the atlas's bottom row (MAPS_AT). Told at once of one shown
   *  before it came. */
  lookHost(host: (copy: boolean) => void): void {
    this.host = host;
    if (this.unsent !== null) host(this.unsent);
    this.unsent = null;
  }

  private handOver(copy: boolean): void {
    if (this.host) this.host(copy);
    // (Maps painted and not yet copied stay to be copied, whatever is shown after them.)
    else this.unsent = this.unsent === true || copy;
  }

  /** A variety's maps (bettaPaint.mjs painting's) drawn up to the tiles' size in maps: the caudal's
   *  at its left (tile 4), the profile's at its right (tile 5). */
  private drawMaps(painted: { profile: Uint8ClampedArray; caudal: Uint8ClampedArray }): void {
    const ctx = (this.maps.image as HTMLCanvasElement).getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    for (const [bytes, { w, h }, x] of [[painted.caudal, CAUDAL, 0], [painted.profile, PROFILE, 1024]] as const) {
      const small = document.createElement('canvas');
      small.width = w; small.height = h;
      small.getContext('2d')!.putImageData(new ImageData(bytes as Uint8ClampedArray<ArrayBuffer>, w, h), 0, 0);
      ctx.drawImage(small, x, 0, 1024, 1024);
    }
  }

  /** The GPU's side of the BVH: its texture, the kernels that refit it (bettaRefit.mjs) and their
   *  tables, uploaded once; the vertices' buffer, written each frame. */
  private refitter(): Betta['gpu'] {
    const device = this.device, plan = bettaRefitPlan(this.bvh, this.specimen.vertices.length / 3);
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

  /** One frame (dt s): what the water told it (FluidSim's koiSense), the globe; omega: the bowl's
   *  spin (rad/s, sim frame), for a worker's pose drawn a frame or more on; turn: the bowl's turn
   *  about its own axis this frame (rad, along the axis, sim frame), which carries the fish round
   *  with it (BettaSwim.turnWith), or null. */
  update(dt: number, sense: KoiSense | null, env: KoiEnv, omega: readonly number[] = STILL, turn: readonly number[] | null = null): void {
    if (!this.active || !this.loaded) {
      this.show(false);
      return;
    }
    if (this.remote?.failed) {
      // (Its twin there lost: the fish starts again here, from where it was built.)
      console.warn("[globes] the betta is moved on the page's thread:", this.remote.failed);
      this.remote.close();
      this.remote = null;
    }
    const remote = this.remote;
    if (!remote) {
      this.specimen.step(dt, sense, env, this, turn);
      // (Its BVH is refitted once, after the contact passes have moved it.)
      this.refit(this.specimen.vertices);
      this.show(true);
      return;
    }
    // A frame behind: the pose back from an earlier frame's step is drawn (once the first is back;
    // carried on by the bowl's turn since that step), then this frame's step is sent.
    const vertices = remote.take(turn);
    if (vertices) this.refit(vertices);
    remote.post(dt, sense, env, this, omega, turn);
    this.show(remote.posed);
  }

  /** The BVH refitted round these vertices, on the GPU: submitted now, before the frame that draws
   *  them is. */
  private refit(vertices: Float32Array): void {
    const { device, gpu } = this;
    device.queue.writeBuffer(gpu.vertices, 0, vertices as unknown as BufferSource);
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

  /** What moves it, as the page reads it: the specimen, or the worker (its last pose taken). */
  private get moving(): BettaSpecimen | BettaRemote {
    return this.remote ?? this.specimen;
  }

  /** Its swim (bettaSwim.mjs): its mode, heading and pitch, read; its gulpUrge, set by the host. */
  get swim(): BettaSpecimen['swim'] | BettaRemote['swim'] {
    return this.moving.swim;
  }

  /** What the fish did to the water at the film this frame, for the sim to take once (main.ts):
   *  a push down at the lips (speed to add along the water's weight; where) and bubbles let go
   *  (how many; where). Both reset. */
  takeDisturbance(): { push: number; pushAt: THREE.Vector3; bubbles: number; bubblesAt: THREE.Vector3 } {
    return this.moving.takeDisturbance();
  }

  probePoints(): Float32Array { return this.moving.probes; }

  mouthAt(): [number, number, number] {
    const m = this.moving.mouth;
    return [m.x, m.y, m.z];
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
    const { level, mouth } = this.moving;
    const heights = bettaSurfaceHeights(level);
    for (let k = 0; k < BETTA_SURFACE_COUNT; k++) this.surface.set([mouth.x, heights[k], mouth.z, 0], k * 4);
    return this.surface;
  }
}
