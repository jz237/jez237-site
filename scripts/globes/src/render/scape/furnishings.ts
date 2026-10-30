// The betta bowl's furnishings for its page (scape/): built in a worker while the page sets up
// WebGPU (scapeWorker.mjs), else on the main thread, and handed back as their BVH's texture data,
// the bed's solids and the fish's obstacles, with their shader code. Their modules load only on
// this page.

import { withNest } from './nest.mjs';

export interface Furnishings {
  /** The BVH (scapeBVH.mjs packScape): rgba32float texels, width x height. */
  data: Float32Array;
  width: number;
  height: number;
  /** The bed's solids (bedSolids.mjs, FluidSim.bedSolids). */
  map: Float32Array;
  /** Where the fish keeps clear of them (the bowl's frame); those round the plants' leaves move with
   *  them (follow: scapeBuild.mjs, MovingPlants.place). */
  obstacles: { a: number[]; b: number[]; r: number; solid: number; fin?: number; follow?: { a: LeafFollow; b: LeafFollow } }[];
  /** The sponge filter's air (equipment.mjs): where it bubbles out of the lift tube (the bowl's
   *  frame), how many bubbles a second, their radius. */
  bubbles: { at: number[]; rate: number; radius: number } | null;
  /** Each mesh's name and vertex count, in the order their vertices were packed (scapeBuild.mjs). */
  parts: [string, number][];
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
  /** Where some leaf vertices are, with the leaves' phases and lean (plantMotion.mjs placeVertices). */
  place: (rest: Float32Array, mv: Float32Array, leaves: Float32Array, phases: Float32Array, lean: Float32Array, out: Float32Array) => Float32Array;
}

/** Leaf vertices an obstacle's end moves with: at rest (xyz a vertex), their motion
 *  (plantMotion.mjs MOTION_VERTEX_STRIDE floats a vertex) and how much of each one's move it takes. */
export type LeafFollow = { rest: Float32Array; mv: Float32Array; k: number[] };

type Built = Omit<Furnishings, 'wgsl' | 'phases' | 'place'>;
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
  const motion = import('./plantMotion.mjs');
  const built = fromWorker({ n, extent, none, detail }).catch(async (err: unknown) => {
    console.warn('[globes] furnishings built on the main thread:', err);
    const m = await import('./scapeBuild.mjs');
    return m.buildFurnishings(n, extent, none, detail) as Built;
  });
  // (The bubble nest's rows are written into their texture here, as the page has made the nest
  // already: nest.mjs.)
  return Promise.all([built, wgsl, motion]).then(([b, w, m]) => ({
    ...b, data: withNest(b.data), wgsl: w, phases: m.leafPhases as Furnishings['phases'], place: m.placeVertices as Furnishings['place'],
  }));
}
