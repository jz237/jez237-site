// ?bench: what a frame costs this device, measured row by row for a phone's screenshot. Each row
// sets something up (a pixel ratio; a part of the frame left out; a setting of the sim's), lets it
// settle, measures, and puts it back: the pixel ratios in an order that comes back to some (a
// device that slows as it warms shows it), the frame's parts by what they save when left out, and
// the sim's passes, its pressure sweeps, a shaken bowl and the GPU's cost of a dispatch. Then the
// device, the pipelines it built and the load. ?bench=<group> runs one group alone (ratio, split,
// sim). Other parts of the page add rows of their own: registerBenchRows.

import type * as THREE from 'three/webgpu';
import { deviceInfo } from '../gpu/device';
import { DispatchProbe } from '../gpu/dispatchProbe';
import { describePipelines, pipelineMarks } from '../gpu/pipelineCount';
import type { GlobeController } from '../interaction/GlobeController';
import type { FluidSim } from '../sim/FluidSim';
import { describeLoad, FrameProfile, median, PARTS, type Sample, wrap } from './frameProfile';

/** What rows reach into (main.ts's world). */
export interface BenchWorld {
  renderer: THREE.WebGPURenderer;
  camera: THREE.Camera;
  sim: FluidSim;
  controller: GlobeController;
  globe: { mesh: THREE.Object3D };
  studio: { table: THREE.Object3D; mirror: THREE.Object3D } | null;
  device: GPUDevice;
}

export interface BenchRow {
  label: string;
  /** The pixel ratio it is measured at (left out where the screen has fewer pixels); none: the
   *  page's own. */
  ratio?: number;
  apply(world: BenchWorld): void;
  restore(world: BenchWorld): void;
  /** Each frame while it runs (s since it was applied). */
  frame?(world: BenchWorld, t: number): void;
}

/** How long a row settles, then is measured (ms); and the wait before the first. */
const SETTLE = 1500;
const MEASURE = 3000;
const START = 5000;

const groups = new Map<string, BenchRow[]>();

/** Adds rows to a group (a new group runs after those before it). */
export function registerBenchRows(group: string, rows: BenchRow[]): void {
  groups.set(group, [...(groups.get(group) ?? []), ...rows]);
}

// The picture at each pixel ratio, coming back to 0.6 and 1 (a device warming up shows in them).
registerBenchRows(
  'ratio',
  [0.6, 1, 0.8, 1.25, 0.6, 1.5, 2, 1].map((ratio) => ({ label: 'ratio', ratio, apply() {}, restore() {} })),
);

/** A part of the frame left out (shown, on): what the frame costs without it. */
function without(label: string, shown: (w: BenchWorld, on: boolean) => void): BenchRow[] {
  return [0.6, 1].map((ratio) => ({ label, ratio, apply: (w) => shown(w, false), restore: (w) => shown(w, true) }));
}

/** The fish's own pass's layer (GlobeView's BOWL_KOI_LAYER, not imported here: the row tests run
 *  without three.js). The bowl's main pass still marks where the fish goes. */
const FISH_LAYER = 1;

/** The sim's passes' times as the '-sim' rows found them. */
let simTimes: Record<string, number> = {};

registerBenchRows('split', [
  ...without('-table', (w, on) => {
    if (w.studio) w.studio.table.visible = w.studio.mirror.visible = on;
  }),
  ...without('-fish', (w, on) => {
    if (on) w.camera.layers.enable(FISH_LAYER);
    else w.camera.layers.disable(FISH_LAYER);
  }),
  ...without('-bowl', (w, on) => {
    w.globe.mesh.visible = on;
  }),
  // (The sim's step skipped: its GPU work, and its readbacks. Its passes' times stay as they were
  // last measured, and main.ts would count them every frame: so the skipped step lets them go,
  // each frame - one may yet come back, measured before the row began - and they are put back
  // after.)
  ...without('-sim', (w, on) => {
    const sim = w.sim as unknown as { step?: () => void; gpuTimes: Record<string, number> };
    if (on) {
      delete sim.step;
      Object.assign(sim.gpuTimes, simTimes);
      return;
    }
    simTimes = { ...sim.gpuTimes };
    sim.step = () => {
      for (const l of Object.keys(sim.gpuTimes)) delete sim.gpuTimes[l];
    };
  }),
]);

/** The sim's settings a row changes, and puts back. */
function simRow(label: string, set: Partial<Pick<FluidSim['cfg'], 'pressureIterations' | 'minSubsteps' | 'maxSubsteps' | 'minSubstepDt'>>, shake = false): BenchRow {
  let kept: typeof set = {};
  let half = -1;
  return {
    label,
    ratio: 0.6,
    apply: (w) => {
      kept = Object.fromEntries(Object.keys(set).map((k) => [k, w.sim.cfg[k as keyof typeof set]]));
      Object.assign(w.sim.cfg, set);
      half = -1;
    },
    restore: (w) => {
      Object.assign(w.sim.cfg, kept);
      if (shake) w.controller.glideTo(0, 0.45);
    },
    // (Shaken: the bowl rolled one way and back across the table, a roll each half second.)
    frame: shake
      ? (w, t) => {
          if (Math.floor(t / 0.5) === half) return;
          half = Math.floor(t / 0.5);
          w.controller.glideTo(half % 2 ? -0.5 : 0.5, 0.45);
        }
      : undefined,
  };
}

registerBenchRows('sim', [
  simRow('sim', {}),
  simRow('iters 8', { pressureIterations: 8 }),
  simRow('iters 24', { pressureIterations: 24 }),
  simRow('iters 40', { pressureIterations: 40 }),
  // (So many substeps a frame, however short the frame: FluidSim.step.)
  simRow('shake 2', { minSubsteps: 2, maxSubsteps: 2, minSubstepDt: 1e-6 }, true),
  simRow('shake 3', { minSubsteps: 3, maxSubsteps: 3, minSubstepDt: 1e-6 }, true),
]);

const f1 = (v: number | null): string => (v === null ? '  -' : v.toFixed(1).padStart(4));

/** The features the device's report names, as the HUD names them: short, on one line (the bench's
 *  text just fits a phone's screen held upright). */
const FEATURE_NAMES: Record<string, string> = { 'timestamp-query': 'timestamps', 'shader-f16': 'f16', subgroups: 'subgroups', 'texture-formats-tier1': 'tier1' };

/** The device's report, as the HUD shows it (with limits: a line of its key limits too). */
export function describeDevice(limits = false, info = deviceInfo()): string[] {
  if (!info) return [];
  const lines = [
    // (?gpu=low asked for the low-power GPU: the one named is what the browser gave.)
    wrap('gpu:', [info.vendor, info.architecture, info.description, info.lowPower ? 'low-power asked' : ''].filter(Boolean)),
    wrap('has:', info.features.length ? info.features.map((f) => FEATURE_NAMES[f] ?? f) : ['none of timestamps, f16, subgroups, tier1']),
  ];
  const l = info.limits;
  if (limits) lines.push(`tex ${l.maxTextureDimension2D} · storage ${l.maxStorageBuffersPerShaderStage} · wg ${l.maxComputeWorkgroupStorageSize / 1024} KB`);
  return lines;
}

interface Measured {
  row: BenchRow;
  ratio: number;
  s: Sample;
  /** The sim's passes (ms, the middle frame's). */
  passes: Record<string, number>;
}

/** A ?bench run. */
export class Bench {
  private readonly rows: BenchRow[];
  private k = -1;
  private at: number;
  private applied = 0;
  private measuring = false;
  private readonly done: Measured[] = [];
  private passTimes: Record<string, number[]> = {};
  private readonly probe: DispatchProbe | null;
  private dispatchUs: number | null | undefined;

  /** only: the group to run alone (?bench=<group>), or '' for all. */
  constructor(
    private readonly world: BenchWorld,
    private readonly prof: FrameProfile,
    private readonly setRatio: (ratio: number | null) => void,
    only: string,
    private readonly phone: boolean,
  ) {
    const dpr = window.devicePixelRatio;
    const run = only && groups.has(only) ? [only] : [...groups.keys()];
    this.rows = run.flatMap((g) => groups.get(g)!).filter((r) => r.ratio === undefined || r.ratio <= dpr + 0.01);
    this.probe = run.includes('sim') ? new DispatchProbe(world.device) : null;
    this.at = performance.now() + START;
  }

  get finished(): boolean {
    return this.k >= this.rows.length;
  }

  /** Each frame, after it is drawn. */
  frame(now: number): void {
    const row = this.rows[this.k];
    if (row?.frame && this.k >= 0) row.frame(this.world, (now - this.applied) / 1000);
    if (this.measuring) {
      for (const [l, ms] of Object.entries(this.world.sim.gpuTimes)) (this.passTimes[l] ??= []).push(ms);
    }
    if (now < this.at || this.finished) return;
    if (this.measuring) {
      const s = this.prof.take();
      if (s) this.done.push({ row, ratio: this.world.renderer.getPixelRatio(), s, passes: Object.fromEntries(Object.entries(this.passTimes).map(([l, v]) => [l, median(v)!])) });
      row.restore(this.world);
      this.measuring = false;
      this.k++;
    } else if (this.k >= 0) {
      this.prof.take();
      this.passTimes = {};
      this.measuring = true;
      this.at = now + MEASURE;
      return;
    } else {
      this.k = 0;
      if (this.probe) void this.probe.measure().then((us) => { this.dispatchUs = us; });
    }
    const next = this.rows[this.k];
    if (next) {
      this.setRatio(next.ratio ?? null);
      next.apply(this.world);
      this.applied = now;
      this.at = now + SETTLE;
    } else {
      this.setRatio(null);
    }
  }

  /** The HUD's text so far. */
  text(load: [string, number][]): string {
    const lines = [`bench${this.phone ? ' · phone' : ''} · ${innerWidth}x${innerHeight} css · dpr ${window.devicePixelRatio.toFixed(2)}`, ...describeDevice(true)];
    lines.push('row       ratio  fps frame ms  cpu sim/draw saved');
    // (A part left out: the drawing it saved, against the ratio rows' at its ratio.)
    const draw = (ratio: number): number | null => median(this.done.filter((m) => m.row.label === 'ratio' && Math.abs(m.ratio - ratio) < 0.01 && m.s.gpuDraw !== null).map((m) => m.s.gpuDraw!));
    for (const m of this.done) {
      const { s } = m;
      const base = m.row.label.startsWith('-') ? draw(m.ratio) : null;
      const saved = base !== null && s.gpuDraw !== null ? ` ${f1(base - s.gpuDraw)}` : '';
      lines.push(`${m.row.label.padEnd(9)} ${m.ratio.toFixed(2)} ${s.fps.toFixed(1).padStart(5)} ${f1(s.p50)}/${f1(s.p90)} ${f1(s.cpuTotal)} ${f1(s.gpuSim)}/${f1(s.gpuDraw)}${saved}`);
    }
    // (The main thread's parts, at the first row's ratio.)
    const first = this.done[0];
    if (first) lines.push(wrap(`cpu ${first.s.cpuTotal.toFixed(1)} ms at ${first.ratio.toFixed(2)}:`, PARTS.map((p) => `${p} ${first.s.cpu[p].toFixed(1)}`)));
    const sim = this.done.find((m) => m.row.label === 'sim');
    if (sim) lines.push(wrap('sim passes (ms):', Object.entries(sim.passes).sort((a, b) => b[1] - a[1]).map(([l, ms]) => `${l} ${ms.toFixed(2)}`)));
    if (this.dispatchUs !== undefined) lines.push(`a dispatch: ${this.dispatchUs === null ? 'no timestamps' : `${this.dispatchUs.toFixed(1)} µs`}`);
    const row = this.rows[this.k];
    if (this.k < 0) lines.push('... starting');
    else if (row) lines.push(`... ${this.k + 1}/${this.rows.length} ${row.label}${row.ratio ? ` ${row.ratio.toFixed(2)}` : ''}${this.measuring ? ' measuring' : ''}`);
    lines.push(describePipelines());
    lines.push(describeLoad([...load, ...pipelineMarks()]));
    if (this.finished) lines.push('reload: is "compiled" sooner (a warm cache)?');
    return lines.join('\n');
  }
}
