// The betta bowl's plants in motion (its page only): every frame their vertices are moved on the
// GPU (plantMotion.mjs: each leaf swaying on its stalk and fluttering, the plant swaying as a
// whole, and leaning with the water round it), written into the furnishings' BVH texture, and the
// BVH's boxes over them refitted (scapeRefit.mjs's kernels), so the bowl's shader traces them
// where they are, shadows and all.
//
// The lean is the water's: a probe at each leaf's tip (FluidSim's, slots from PLANT_PROBE_AT)
// reads the water's velocity there; less the glass's own motion at that point, turned into the
// bowl's frame and followed with a lag (a leaf answers the current, not each eddy), it pushes the
// leaf's tip that way, as far as the current would carry it in LEAN_TIME.

import type { KoiSense } from '../../fish/Koi';
import type { Furnishings, LeafFollow } from './furnishings';

/** Where the leaves' probes start in FluidSim's list (as many as there are leaves). */
export const PLANT_PROBE_AT = 64;
/** How long a leaf takes to answer the current (s), and how far it leans for its speed: the
 *  distance the current would carry it in this time (s). */
const FLOW_TIME = 0.4;
const LEAN_TIME = 0.35;

type Motion = Furnishings['motion'];
/** What it keeps of the motion once its buffers are on the GPU. */
type Kept = Pick<Motion, 'leaves' | 'leafTips' | 'leafCount' | 'moving' | 'slotCount' | 'passes'>;
/** Bytes between the refit's passes' uniforms (scapeRefit.mjs PLANT_LEVEL_STRIDE). */
const PASS_STRIDE = 256;

export class MovingPlants {
  private readonly buffers: Record<string, GPUBuffer> = {};
  private readonly pipelines: { skin: GPUComputePipeline; tris: GPUComputePipeline; refit: GPUComputePipeline };
  private readonly groups: { skin: GPUBindGroup; tris: GPUBindGroup; refit: GPUBindGroup };
  private readonly lean: Float32Array;
  private readonly felt: Float32Array;
  private readonly points: Float32Array;
  private phases: Float32Array | null = null;
  /** Leaf vertices where they are (place). */
  private moved: Float32Array | null = null;
  private readonly motion: Kept;
  /** Each refit pass's dynamic offset into its uniforms. */
  private readonly offsets: Uint32Array;

  constructor(
    private readonly device: GPUDevice,
    texture: GPUTexture,
    motion: Motion,
    private readonly phasesAt: Furnishings['phases'],
    private readonly placeAt: Furnishings['place'],
  ) {
    // (The buffers' data is only needed for the upload.)
    this.motion = { leaves: motion.leaves, leafTips: motion.leafTips, leafCount: motion.leafCount, moving: motion.moving, slotCount: motion.slotCount, passes: motion.passes };
    this.offsets = Uint32Array.from(motion.passes, (_, i) => i * PASS_STRIDE);
    const U = GPUBufferUsage;
    for (const [name, b] of Object.entries(motion.buffers)) {
      const buffer = device.createBuffer({ label: `plants: ${name}`, size: b.size, usage: (b.usage === 'uniform' ? U.UNIFORM : U.STORAGE) | U.COPY_DST });
      if (b.data) device.queue.writeBuffer(buffer, 0, b.data as unknown as BufferSource);
      this.buffers[name] = buffer;
    }
    const C = GPUShaderStage.COMPUTE;
    const uniform = (binding: number, dynamic = false): GPUBindGroupLayoutEntry => ({ binding, visibility: C, buffer: { type: 'uniform', hasDynamicOffset: dynamic, minBindingSize: dynamic ? PASS_STRIDE : 16 } });
    const read = (binding: number): GPUBindGroupLayoutEntry => ({ binding, visibility: C, buffer: { type: 'read-only-storage' } });
    const write = (binding: number): GPUBindGroupLayoutEntry => ({ binding, visibility: C, buffer: { type: 'storage' } });
    const tex = (binding: number): GPUBindGroupLayoutEntry => ({ binding, visibility: C, storageTexture: { access: 'write-only', format: 'rgba32float', viewDimension: '2d' } });
    const layouts = {
      skin: device.createBindGroupLayout({ label: 'plants: skin', entries: [uniform(0), read(1), read(2), read(3), read(4), write(5), tex(6)] }),
      tris: device.createBindGroupLayout({ label: 'plants: tris', entries: [uniform(0), read(1), read(2), tex(3)] }),
      refit: device.createBindGroupLayout({ label: 'plants: refit', entries: [uniform(0, true), read(1), read(2), read(3), read(4), write(5), tex(6)] }),
    };
    const pipe = (name: 'skin' | 'tris' | 'refit', entryPoint: string) =>
      device.createComputePipeline({
        label: `plants: ${name}`,
        layout: device.createPipelineLayout({ bindGroupLayouts: [layouts[name]] }),
        compute: { module: device.createShaderModule({ label: `plants: ${name}`, code: motion.wgsl[name] }), entryPoint },
      });
    this.pipelines = { skin: pipe('skin', 'plantSkin'), tris: pipe('tris', 'plantTris'), refit: pipe('refit', 'plantRefit') };
    const view = texture.createView();
    const B = this.buffers;
    const group = (name: 'skin' | 'tris' | 'refit', list: (string | GPUBindingResource)[]) =>
      device.createBindGroup({ layout: layouts[name], entries: list.map((r, binding) => ({ binding, resource: typeof r === 'string' ? { buffer: B[r] } : r })) });
    this.groups = {
      skin: group('skin', ['plantSkinParams', 'plantVerts', 'plantLeaves', 'plantLean', 'plantPhase', 'dPos', view]),
      tris: group('tris', ['plantTrisParams', 'plantSlots', 'dPos', view]),
      refit: group('refit', [{ buffer: B.plantLevel, offset: 0, size: PASS_STRIDE }, 'plantNodes', 'plantSlots', 'plantStatic', 'dPos', 'nodeBox', view]),
    };
    const n = motion.leafCount;
    this.lean = new Float32Array(n * 4);
    this.felt = new Float32Array(n * 3);
    this.points = new Float32Array(n * 4);
  }

  /** Where the end `from` of an obstacle round a leaf is, the leaves where the last update left
   *  them (the bowl's frame; `from` itself before the first), into out. */
  place(follow: LeafFollow, from: readonly number[], out: number[]): number[] {
    out[0] = from[0]; out[1] = from[1]; out[2] = from[2];
    if (!this.phases || !follow.k.length) return out;
    const moved = (this.moved = this.moved && this.moved.length >= follow.rest.length ? this.moved : new Float32Array(follow.rest.length));
    this.placeAt(follow.rest, follow.mv, this.motion.leaves, this.phases, this.lean, moved);
    follow.k.forEach((k, i) => {
      for (let c = 0; c < 3; c++) out[c] += k * (moved[i * 3 + c] - follow.rest[i * 3 + c]);
    });
    return out;
  }

  /** How many probes the leaves take (from PLANT_PROBE_AT). */
  get probeCount(): number {
    return this.motion.leafCount;
  }

  /** The leaves' probe points (the sim frame: each leaf's tip, where the bowl's turn has carried
   *  it), for FluidSim.setProbes(PLANT_PROBE_AT, ...). rotation: the bowl's turn (column-major). */
  probePoints(rotation: ArrayLike<number>): Float32Array {
    const e = rotation;
    const tips = this.motion.leafTips;
    for (let i = 0; i < this.motion.leafCount; i++) {
      const x = tips[i * 4], y = tips[i * 4 + 1], z = tips[i * 4 + 2];
      this.points[i * 4] = e[0] * x + e[3] * y + e[6] * z;
      this.points[i * 4 + 1] = e[1] * x + e[4] * y + e[7] * z;
      this.points[i * 4 + 2] = e[2] * x + e[5] * y + e[8] * z;
    }
    return this.points;
  }

  /** Moves the plants to time t (s: any origin), leaning with the water as the probes last read
   *  it (sense: FluidSim.koiSense; null before the first reading), and refits the BVH over them.
   *  dt: since the last update; rotation, omega: the bowl's turn and its angular velocity (sim
   *  frame); iso: the water's surface density (a probe above it is in the air). */
  update(t: number, dt: number, sense: KoiSense | null, rotation: ArrayLike<number>, omega: readonly number[], iso: number): void {
    const n = this.motion.leafCount;
    const e = rotation;
    const k = 1 - Math.exp(-dt / FLOW_TIME);
    for (let i = 0; i < n; i++) {
      let ux = 0, uy = 0, uz = 0;
      if (sense) {
        const at = (PLANT_PROBE_AT + i) * 4;
        if (sense.probes[at + 3] > iso) {
          // The water's velocity less the glass's at the point (the sim frame moves with the
          // bowl's centre, so the glass moves only by turning), into the bowl's frame.
          const px = this.points[i * 4], py = this.points[i * 4 + 1], pz = this.points[i * 4 + 2];
          const wx = sense.probes[at] - (omega[1] * pz - omega[2] * py);
          const wy = sense.probes[at + 1] - (omega[2] * px - omega[0] * pz);
          const wz = sense.probes[at + 2] - (omega[0] * py - omega[1] * px);
          ux = e[0] * wx + e[1] * wy + e[2] * wz;
          uy = e[3] * wx + e[4] * wy + e[5] * wz;
          uz = e[6] * wx + e[7] * wy + e[8] * wz;
        }
      }
      const f = this.felt;
      f[i * 3] += (ux - f[i * 3]) * k;
      f[i * 3 + 1] += (uy - f[i * 3 + 1]) * k;
      f[i * 3 + 2] += (uz - f[i * 3 + 2]) * k;
      this.lean.set([f[i * 3] * LEAN_TIME, f[i * 3 + 1] * LEAN_TIME, f[i * 3 + 2] * LEAN_TIME, 0], i * 4);
    }
    this.phases = this.phasesAt(this.motion.leaves, t, this.phases);
    const q = this.device.queue;
    q.writeBuffer(this.buffers.plantPhase, 0, this.phases as unknown as BufferSource);
    q.writeBuffer(this.buffers.plantLean, 0, this.lean as unknown as BufferSource);
    const enc = this.device.createCommandEncoder({ label: 'plants' });
    const pass = enc.beginComputePass({ label: 'plants' });
    const groupsOf = (count: number) => Math.ceil(count / 64);
    pass.setPipeline(this.pipelines.skin);
    pass.setBindGroup(0, this.groups.skin);
    pass.dispatchWorkgroups(groupsOf(this.motion.moving));
    pass.setPipeline(this.pipelines.tris);
    pass.setBindGroup(0, this.groups.tris);
    pass.dispatchWorkgroups(groupsOf(this.motion.slotCount));
    pass.setPipeline(this.pipelines.refit);
    this.motion.passes.forEach((p, i) => {
      pass.setBindGroup(0, this.groups.refit, this.offsets, i, 1);
      pass.dispatchWorkgroups(p.groups);
    });
    pass.end();
    q.submit([enc.finish()]);
  }
}
