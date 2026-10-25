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
  /** The plants' motion (scapeBuild.mjs, scapeRefit.mjs): its kernels, their buffers (to upload
   *  once), the counts and refit passes they are dispatched by, the leaves' table and tips. */
  motion: {
    wgsl: { skin: string; tris: string; refit: string };
    buffers: Record<string, { data: ArrayBufferView | null; size: number; usage: 'uniform' | 'storage' }>;
    moving: number;
    slotCount: number;
    passes: { first: number; count: number; wide: boolean; groups: number }[];
    leafCount: number;
    leaves: Float32Array;
    leafTips: Float32Array;
  };
  /** The leaves' phases at a time (plantMotion.mjs leafPhases), each frame. */
  phases: (leaves: Float32Array, t: number, out: Float32Array | null) => Float32Array;
}

type Built = Omit<Furnishings, 'wgsl' | 'phases'>;
type Ask = { n: number; extent: number; none: number; detail: number };

/** The worker betta.html starts as the page is read (in a build: see vite.config.ts), what it was
 *  asked, and what it makes. */
interface EarlyFurnishing {
  worker: Worker;
  ask: Ask;
  built: Promise<Built>;
}

/** What `ask` makes, from a worker: the one betta.html started if it was asked the same (the
 *  page's script loads and runs meanwhile), else a new one. */
function fromWorker(ask: Ask): Promise<Built> {
  const page = window as unknown as { globesFurnishing?: EarlyFurnishing };
  const early = page.globesFurnishing;
  delete page.globesFurnishing;
  if (early) {
    if ((Object.keys(ask) as (keyof Ask)[]).every((k) => early.ask[k] === ask[k])) return early.built;
    early.worker.terminate();
  }
  return new Promise<Built>((resolve, reject) => {
    const worker = new Worker(new URL('./scapeWorker.mjs', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<Built>) => {
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(e.message || 'the furnishings worker failed'));
    };
    worker.postMessage(ask);
  });
}

/** n, extent, none: the bed's map (FluidSim's BED_SOLIDS_N, its radius, BED_SOLIDS_NONE); detail:
 *  how finely they are made (1; phones 0.5: about a quarter of the triangles). */
export function furnish(n: number, extent: number, none: number, detail = 1): Promise<Furnishings> {
  const wgsl = import('./scapeShader.mjs').then((m) => m.scapeShaderWGSL() as string);
  const phases = import('./plantMotion.mjs').then((m) => m.leafPhases as Furnishings['phases']);
  const built = fromWorker({ n, extent, none, detail }).catch(async (err: unknown) => {
    console.warn('[globes] furnishings built on the main thread:', err);
    const m = await import('./scapeBuild.mjs');
    return m.buildFurnishings(n, extent, none, detail) as Built;
  });
  return Promise.all([built, wgsl, phases]).then(([b, w, p]) => ({ ...b, wgsl: w, phases: p }));
}
