// The betta bowl on a phone (its lighter shader, bowl.ts lite): where its water march can meet
// nothing, worked out once a frame from what it reads (the water's density, FluidSim's
// densityTexture, and the sand's height), so that it can step over its samples there at once
// (shaders.ts, the march). It steps on by whole steps, so the samples it does take are where they
// were and it finds the same surfaces in the same places: only the reads that would have found
// nothing are left out. A texel the bowl's passes read in the kelp's slot (the bowl has no kelp),
// heights in the translating frame:
// - x: over all the water, and two of the march's steps over the bed: a sample from there up (the
//   meniscus' lift and all) blends no voxel over the surface's level, so is in the air, meets no
//   sand, and the march's next step is a whole one;
// - y and z: under any air in the open water, and over the bed: a sample between them, in the
//   open, blends only voxels over the level, so is in the water;
// - w: the open water's reach from the middle, squared (in from the glass).
// (Near the glass and the bed, where the density dips, every sample is read as before, and the
// march decides there whether a dip is the water's edge: globes_boundarySliver.)

import type { FluidSim } from '../sim/FluidSim';

/** How far from the glass, and over the bed, the open water starts (in voxels of the density
 *  map): the density dips nearer them than this. */
const CLEAR_VOXELS = 3;
/** The bed's height is gathered in fixed point (for the atomics), this many to a unit. */
const FIXED = 65536;

export class MarchBand {
  /** The band's texel (rgba32float, 1x1). */
  readonly texture: GPUTexture;
  private readonly bed: GPUComputePipeline;
  private readonly columns: GPUComputePipeline;
  private readonly finish: GPUComputePipeline;
  private readonly group: GPUBindGroup;
  private readonly groups: number;
  private readonly bedGroups: number;

  constructor(
    private readonly sim: FluidSim,
    innerRadius: number,
    capillaryLength: number,
    iso: number,
    marchStep: number,
  ) {
    const device = sim.device;
    const n = sim.renderN;
    const v = sim.renderVoxel;
    // (A sample's read blends voxels up to a voxel off it each way, and the meniscus' lift reads
    // it from lower down, up to twice the capillary length, within six of the glass: the open
    // water's samples are further from it than that, so read where they are.)
    const clear = CLEAR_VOXELS * v;
    const open = innerRadius - Math.max(clear + 2 * v, 6 * capillaryLength);
    const f = (x: number) => x.toFixed(6);
    const code = /* wgsl */ `
const N: i32 = ${n};
const ORIGIN: vec3f = vec3f(${f(sim.origin[0])}, ${f(sim.origin[1])}, ${f(sim.origin[2])});
const VOXEL: f32 = ${f(v)};
const ISO: f32 = ${f(iso)};
const R_IN: f32 = ${f(innerRadius)};
const CLEAR: f32 = ${f(clear)};
const LIFT: f32 = ${f(2 * capillaryLength)};
const STEP: f32 = ${f(marchStep)};
const OPEN: f32 = ${f(open)};
const FIXED: f32 = ${f(FIXED)};

@group(0) @binding(0) var densTex: texture_3d<f32>;
@group(0) @binding(1) var sand: texture_2d<f32>;
// What the columns find: the highest layer with a voxel over ISO; the lowest in the open with one
// at or under it; the bed's highest over all the map, and over the open water (fixed point).
@group(0) @binding(2) var<storage, read_write> found: array<atomic<i32>, 4>;
@group(0) @binding(3) var band: texture_storage_2d<rgba32float, write>;

// (A little either way for the reads' own rounding: a voxel within it of the level is taken as
// both air and water.)
const SLACK: f32 = 1e-3;
fn dens(x: i32, y: i32, z: i32) -> f32 {
  return textureLoad(densTex, vec3i(x, y, z), 0).r;
}

// The bed's highest: over all the map, and over the open water (where the march's reads there
// blend it: its texels within one of the open water's reach), a texel each.
@compute @workgroup_size(8, 8)
fn bandBed(@builtin(global_invocation_id) id: vec3u) {
  let sn = textureDimensions(sand);
  if (any(id.xy >= sn)) { return; }
  let h = i32(ceil(textureLoad(sand, vec2i(id.xy), 0).r * FIXED));
  atomicMax(&found[2], h);
  let texel = 2.0 * R_IN / f32(sn.x);
  if (length(((vec2f(id.xy) + 0.5) * texel - R_IN)) < OPEN + 2.0 * texel) { atomicMax(&found[3], h); }
}

// One column of the density map each: its highest wet voxel, and its lowest dry one in the open
// water (in from the glass, and over the bed by CLEAR).
@compute @workgroup_size(8, 8)
fn bandColumns(@builtin(global_invocation_id) id: vec3u) {
  let c = vec2i(id.xy);
  if (any(c >= vec2i(N))) { return; }
  let xz = ORIGIN.xz + (vec2f(c) + 0.5) * VOXEL;
  // (No read inside the glass blends a voxel further out than this.)
  if (length(xz) > R_IN + 2.0 * VOXEL) { return; }
  var top = N - 1;
  while (top >= 0 && dens(c.x, top, c.y) <= ISO - SLACK) { top--; }
  if (top >= 0) { atomicMax(&found[0], top); }
  // (The open water's reads blend voxels within this of the middle.)
  let h2 = (OPEN + 2.0 * VOXEL) * (OPEN + 2.0 * VOXEL) - dot(xz, xz);
  if (h2 <= 0.0) { return; }
  let lo = max(-sqrt(h2), f32(atomicLoad(&found[3])) / FIXED + CLEAR);
  let j0 = max(i32(ceil((lo - ORIGIN.y) / VOXEL - 0.5)), 0);
  let j1 = min(i32(floor((sqrt(h2) - ORIGIN.y) / VOXEL - 0.5)), N - 1);
  for (var j = j0; j <= j1; j++) {
    if (dens(c.x, j, c.y) <= ISO + SLACK) {
      atomicMin(&found[1], j);
      break;
    }
  }
}

// The band, from what the columns found; and ready for the next frame's.
@compute @workgroup_size(1)
fn bandFinish() {
  let top = atomicLoad(&found[0]);
  let dry = atomicLoad(&found[1]);
  let bed = f32(atomicLoad(&found[2])) / FIXED;
  let bedOpen = f32(atomicLoad(&found[3])) / FIXED;
  // (A read blends the two layers round it: from a voxel over the top layer's, none of them is
  // wet; and from a voxel under the dry one's, all are. A voxel more for the filter's rounding;
  // the lift for the meniscus, which reads from lower down; and over the bed, a voxel more for
  // the open water's reads, which must blend only voxels the columns looked at.)
  let air = select(ORIGIN.y + (f32(top) + 2.5) * VOXEL + LIFT, -1e9, top < 0);
  let water = select(ORIGIN.y + (f32(dry) - 1.5) * VOXEL, 1e9, dry >= N);
  textureStore(band, vec2i(0), vec4f(max(air, bed + 2.0 * STEP), water, bedOpen + CLEAR + 2.0 * VOXEL, OPEN * OPEN));
  atomicStore(&found[0], -1);
  atomicStore(&found[1], N);
  atomicStore(&found[2], i32(-1e9));
  atomicStore(&found[3], i32(-1e9));
}
`;
    const C = GPUShaderStage.COMPUTE;
    const layout = device.createBindGroupLayout({
      label: 'march band',
      entries: [
        { binding: 0, visibility: C, texture: { sampleType: 'unfilterable-float', viewDimension: '3d' } },
        { binding: 1, visibility: C, texture: { sampleType: 'unfilterable-float' } },
        { binding: 2, visibility: C, buffer: { type: 'storage' } },
        { binding: 3, visibility: C, storageTexture: { access: 'write-only', format: 'rgba32float' } },
      ],
    });
    const module = device.createShaderModule({ label: 'march band', code });
    const pipe = (entryPoint: string) =>
      device.createComputePipeline({ label: `march band: ${entryPoint}`, layout: device.createPipelineLayout({ bindGroupLayouts: [layout] }), compute: { module, entryPoint } });
    this.bed = pipe('bandBed');
    this.columns = pipe('bandColumns');
    this.finish = pipe('bandFinish');
    // (Until the first frame's: a band that leaves nothing out.)
    const found = device.createBuffer({ label: 'march band: found', size: 16, usage: GPUBufferUsage.STORAGE, mappedAtCreation: true });
    new Int32Array(found.getMappedRange()).set([-1, n, -1e9, -1e9]);
    found.unmap();
    this.texture = device.createTexture({ label: 'march band', size: [1, 1], format: 'rgba32float', usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST });
    device.queue.writeTexture({ texture: this.texture }, new Float32Array([1e9, -1e9, 1e9, 0]), { bytesPerRow: 16 }, [1, 1]);
    this.group = device.createBindGroup({
      layout,
      entries: [
        { binding: 0, resource: sim.densityTexture.createView() },
        { binding: 1, resource: sim.sandTexture.createView() },
        { binding: 2, resource: { buffer: found } },
        { binding: 3, resource: this.texture.createView() },
      ],
    });
    this.groups = Math.ceil(n / 8);
    this.bedGroups = Math.ceil(sim.sandN / 8);
  }

  /** The band from the water and the bed as they now are (after the frame's sim step, before it
   *  is drawn). */
  update(): void {
    const enc = this.sim.device.createCommandEncoder({ label: 'march band' });
    const pass = enc.beginComputePass({ label: 'march band' });
    pass.setBindGroup(0, this.group);
    pass.setPipeline(this.bed);
    pass.dispatchWorkgroups(this.bedGroups, this.bedGroups);
    pass.setPipeline(this.columns);
    pass.dispatchWorkgroups(this.groups, this.groups);
    pass.setPipeline(this.finish);
    pass.dispatchWorkgroups(1);
    pass.end();
    this.sim.device.queue.submit([enc.finish()]);
  }
}
