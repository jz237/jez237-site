// What a compute dispatch costs the GPU on its own (?bench's sim section): a run of dispatches of
// one workgroup each, every one waiting on the last (they write the same storage), timed against
// an empty pass. Phones pay tens of microseconds a dispatch where a desktop pays a few, and the
// water's solver is many small dispatches: this is what decides how many it can afford.

/** Dispatches in the timed run, and runs (the middle one's taken). */
const DISPATCHES = 256;
const RUNS = 9;

export class DispatchProbe {
  private readonly pipeline: GPUComputePipeline;
  private readonly group: GPUBindGroup;
  private readonly set: GPUQuerySet | null;
  private readonly resolve: GPUBuffer | null;

  /** Built with the page's pipelines, before the first frame (one built later is a late one:
   *  gpu/pipelineCount.ts). */
  constructor(private readonly device: GPUDevice) {
    const module = device.createShaderModule({
      label: 'dispatch probe',
      code: '@group(0) @binding(0) var<storage, read_write> n: array<u32, 1>;\n@compute @workgroup_size(1) fn main() { n[0] = n[0] + 1u; }',
    });
    this.pipeline = device.createComputePipeline({ label: 'dispatch probe', layout: 'auto', compute: { module, entryPoint: 'main' } });
    const buffer = device.createBuffer({ label: 'dispatch probe', size: 16, usage: GPUBufferUsage.STORAGE });
    this.group = device.createBindGroup({ layout: this.pipeline.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer } }] });
    const timed = device.features.has('timestamp-query');
    this.set = timed ? device.createQuerySet({ type: 'timestamp', count: 4 }) : null;
    this.resolve = timed ? device.createBuffer({ size: 32, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC }) : null;
  }

  /** The GPU's time a dispatch (µs; null where the device cannot time its passes). */
  async measure(): Promise<number | null> {
    const { device, set, resolve } = this;
    if (!set || !resolve) return null;
    const each: number[] = [];
    for (let r = 0; r < RUNS; r++) {
      const enc = device.createCommandEncoder();
      for (const [n, at] of [[DISPATCHES, 0], [0, 2]]) {
        const pass = enc.beginComputePass({ timestampWrites: { querySet: set, beginningOfPassWriteIndex: at, endOfPassWriteIndex: at + 1 } });
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.group);
        for (let k = 0; k < n; k++) pass.dispatchWorkgroups(1);
        pass.end();
      }
      const read = device.createBuffer({ size: 32, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      enc.resolveQuerySet(set, 0, 4, resolve, 0);
      enc.copyBufferToBuffer(resolve, 0, read, 0, 32);
      device.queue.submit([enc.finish()]);
      await read.mapAsync(GPUMapMode.READ);
      const t = new BigInt64Array(read.getMappedRange());
      each.push(Number(t[1] - t[0] - (t[3] - t[2])) / 1e3 / DISPATCHES);
      read.unmap();
      read.destroy();
    }
    return each.sort((a, b) => a - b)[RUNS >> 1];
  }
}
