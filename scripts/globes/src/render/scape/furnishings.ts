// The betta bowl's furnishings for its page (scape/): built in a worker while the page sets up
// WebGPU (scapeWorker.mjs), else on the main thread, and handed back as their BVH's texture data,
// the bed's solids and the fish's obstacles, with their shader code. Their modules load only on
// this page.

export interface Furnishings {
  /** The BVH (scapeBVH.mjs packScape): rgba32float texels, width x height. */
  data: Float32Array;
  width: number;
  height: number;
  /** The bed's solids (bedSolids.mjs, FluidSim.bedSolids). */
  map: Float32Array;
  /** Where the fish keeps clear of them (the bowl's frame). */
  obstacles: { a: number[]; b: number[]; r: number; solid: number }[];
  /** Their shader code (scapeShader.mjs). */
  wgsl: string;
}

type Built = Omit<Furnishings, 'wgsl'>;

/** n, extent, none: the bed's map (FluidSim's BED_SOLIDS_N, its radius, BED_SOLIDS_NONE). */
export function furnish(n: number, extent: number, none: number): Promise<Furnishings> {
  const wgsl = import('./scapeShader.mjs').then((m) => m.scapeShaderWGSL() as string);
  const built = new Promise<Built>((resolve, reject) => {
    const worker = new Worker(new URL('./scapeWorker.mjs', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<Built>) => {
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(e.message || 'the furnishings worker failed'));
    };
    worker.postMessage({ n, extent, none });
  }).catch(async (err: unknown) => {
    console.warn('[globes] furnishings built on the main thread:', err);
    const m = await import('./scapeBuild.mjs');
    return m.buildFurnishings(n, extent, none) as Built;
  });
  return Promise.all([built, wgsl]).then(([b, w]) => ({ ...b, wgsl: w }));
}
