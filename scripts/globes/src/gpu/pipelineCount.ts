// The pipelines the page builds (?stats, ?bench, ?qa: gpu/device.ts watches the device): how many,
// how long the betta bowl's two large ones took to compile (a phone spends most of its load on
// them), how many were built in the first frame, and how many after it (each a hitch, and a large
// one many seconds: the bowl must be built once, for every target it is drawn into, before it is
// first shown).

import { LINE, wrap } from '../app/frameProfile';

/** A large pipeline's shader (the bowl's are 140 K characters and more; the next largest a few
 *  tens of K): which of the bowl's passes it is, if it is one. */
const LARGE = 60_000;

interface Built {
  /** Its pass (bowl, bowlKoi; the second of a pass bowl#2, and so on). */
  label: string;
  /** When it was asked for, and when it was ready (ms since navigation; null: not yet). */
  asked: number;
  ready: number | null;
  /** Built at once (createRenderPipeline): its compile is not timed here - the browser makes it as
   *  the GPU first draws with it, and that frame waits. */
  sync: boolean;
}

/** What has been built: every pipeline, the large ones by name, those in the first frame and those
 *  after it. */
export interface PipelineSnapshot {
  total: number;
  /** The large ones (bowl, bowlKoi), in the order asked for. */
  large: Built[];
  inFirstFrame: number;
  sinceFirstFrame: number;
  /** Their labels (three's: renderPipeline_<material>_<id>; the sim's own). */
  lateLabels: string[];
}

/** When each was asked for (ms since navigation). */
const asked: number[] = [];
const large: Built[] = [];
let inFirst = -1;
const late: string[] = [];
/** Each shader module's pass, where it is a large one. */
const modules = new WeakMap<GPUShaderModule, string>();

/** The bowl's pass a shader's code is (or another large one's). */
function passOf(code: string): string {
  if (!code.includes('fn globes_bowlTrace')) return 'large';
  return /const GLOBES_KOI\s*:\s*bool\s*=\s*true/.test(code) ? 'bowlKoi' : 'bowl';
}

function built(label: string | undefined, module: GPUShaderModule | undefined, sync: boolean): Built | null {
  const now = performance.now();
  asked.push(now);
  if (inFirst >= 0) late.push(label ?? '?');
  const pass = module ? modules.get(module) : undefined;
  if (!pass) return null;
  const n = large.filter((b) => b.label.split('#')[0] === pass).length;
  const b: Built = { label: n ? `${pass}#${n + 1}` : pass, asked: now, ready: null, sync };
  large.push(b);
  return b;
}

/** Counts what the device builds from now on. */
export function watchPipelines(device: GPUDevice): void {
  const createShaderModule = device.createShaderModule.bind(device);
  device.createShaderModule = (desc) => {
    const module = createShaderModule(desc);
    if (desc.code.length > LARGE) modules.set(module, passOf(desc.code));
    return module;
  };
  const createRenderPipeline = device.createRenderPipeline.bind(device);
  device.createRenderPipeline = (desc) => {
    built(desc.label, desc.fragment?.module, true);
    return createRenderPipeline(desc);
  };
  const createRenderPipelineAsync = device.createRenderPipelineAsync.bind(device);
  device.createRenderPipelineAsync = (desc) => {
    const b = built(desc.label, desc.fragment?.module, false);
    const p = createRenderPipelineAsync(desc);
    if (b) void p.then(() => { b.ready = performance.now(); }, () => {});
    return p;
  };
  const createComputePipeline = device.createComputePipeline.bind(device);
  device.createComputePipeline = (desc) => {
    built(desc.label, undefined, true);
    return createComputePipeline(desc);
  };
  const createComputePipelineAsync = device.createComputePipelineAsync.bind(device);
  device.createComputePipelineAsync = (desc) => {
    built(desc.label, undefined, false);
    return createComputePipelineAsync(desc);
  };
}

/** Once the first frame is drawn (main.ts; start: when it began, ms since navigation): those built
 *  since are its own, and from now on a pipeline built is a late one. */
export function pipelinesFirstFrame(start: number): void {
  inFirst = asked.filter((t) => t >= start).length;
}

export function pipelineSnapshot(): PipelineSnapshot {
  return { total: asked.length, large: large.map((b) => ({ ...b })), inFirstFrame: Math.max(inFirst, 0), sinceFirstFrame: late.length, lateLabels: [...late] };
}

/** The large pipelines' compiles as load milestones ('bowl compiled' at when it was ready), for
 *  the HUD's load line. */
export function pipelineMarks(): [string, number][] {
  return large.filter((b) => b.ready !== null).map((b) => [`${b.label} compiled`, b.ready!]);
}

/** For the HUD: how many, the large ones' compile times, how many came in the first frame and
 *  after it, and the first of those after (their labels). */
export function describePipelines(): string {
  const big = large.map((b) => `${b.label} ${b.sync ? 'sync' : b.ready === null ? '...' : `${((b.ready - b.asked) / 1000).toFixed(1)} s`}`);
  const first = inFirst >= 0 ? [`${inFirst} in the first frame`] : [];
  const labels = late.slice(0, 3).map((l) => l.slice(0, LINE - 2));
  return wrap('pipelines:', [`${asked.length} built`, ...big, ...first, `${late.length} late`, ...labels, ...(late.length > 3 ? [`+${late.length - 3}`] : [])]);
}
