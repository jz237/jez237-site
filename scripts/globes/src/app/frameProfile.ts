// Where a frame's time goes, for ?stats and ?bench (a phone has no profiler to read): the main
// thread's time on each part of the frame, the GPU's on the sim and the drawing (timestamp queries
// where the device has them; otherwise the queue's own pace), the frames' pace, and the load. (Its
// lines fit a phone's screenshot held upright: LINE characters at most.)

/** The main thread's parts of a frame, in the order they run. */
export const PARTS = ['input', 'betta', 'plants', 'life', 'food', 'sim', 'scene', 'draw'] as const;
export type Part = (typeof PARTS)[number];

/** The HUD's widest line (characters): a 384 CSS px phone's screen, upright. */
export const LINE = 52;

export interface Sample {
  frames: number;
  fps: number;
  /** Frame intervals (ms): the middle one and the slowest tenth's start. */
  p50: number;
  p90: number;
  /** Main thread (ms a frame): each part, and all of it. */
  cpu: Record<Part, number>;
  cpuTotal: number;
  /** GPU (ms a frame): the sim's passes and the drawing, where timed (the middle frame's); the
   *  queue's pace otherwise (on average). */
  gpuSim: number | null;
  gpuDraw: number | null;
  gpuQueue: number | null;
}

/** The middle value (of an even count, the middle two's mean; null for none). */
export function median(v: readonly number[]): number | null {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b);
  const k = s.length >> 1;
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
}

export class FrameProfile {
  private t = 0;
  private frameStart = 0;
  private cpu = Object.fromEntries(PARTS.map((p) => [p, 0])) as Record<Part, number>;
  private intervals: number[] = [];
  private lastFrame = -1;
  private gpuSims: number[] = [];
  private gpuDraws: number[] = [];
  /** The last minute's GPU times, a second to a bucket (a soak: how a phone holds up as it
   *  warms). */
  private readonly minuteBuckets = Array.from({ length: 60 }, () => ({ second: -1, sim: 0, simN: 0, draw: 0, drawN: 0 }));
  private queueSum = 0;
  private queueN = 0;
  private queueDoneAt = 0;
  /** Load milestones: ms since navigation. */
  readonly load: [string, number][] = [];

  constructor(readonly on: boolean) {}

  mark(name: string): void {
    if (this.on) this.load.push([name, performance.now()]);
  }

  /** At the frame's start. */
  begin(): void {
    if (!this.on) return;
    const now = performance.now();
    if (this.lastFrame >= 0) this.intervals.push(now - this.lastFrame);
    this.lastFrame = now;
    this.frameStart = now;
    this.t = now;
  }

  /** The part just done (the time since the last lap or the frame's start). */
  lap(part: Part): void {
    if (!this.on) return;
    const now = performance.now();
    this.cpu[part] += now - this.t;
    this.t = now;
  }

  /** At the frame's end, once its work is submitted: the queue's pace (when the frame's GPU work
   *  was done, after both its start and the last frame's work: what the GPU spent on it, roughly,
   *  when it is the limit). */
  end(queue: GPUQueue): void {
    if (!this.on) return;
    const start = this.frameStart;
    void queue.onSubmittedWorkDone().then(() => {
      const done = performance.now();
      const from = Math.max(start, this.queueDoneAt);
      this.queueDoneAt = done;
      this.queueSum += done - from;
      this.queueN++;
    });
  }

  gpuSim(ms: number): void {
    this.gpuSims.push(ms);
    const b = this.bucket();
    b.sim += ms;
    b.simN++;
  }

  gpuDraw(ms: number): void {
    this.gpuDraws.push(ms);
    const b = this.bucket();
    b.draw += ms;
    b.drawN++;
  }

  private bucket() {
    const second = Math.floor(performance.now() / 1000);
    const b = this.minuteBuckets[second % 60];
    if (b.second !== second) Object.assign(b, { second, sim: 0, simN: 0, draw: 0, drawN: 0 });
    return b;
  }

  /** The GPU's sim and drawing over the last minute (ms a frame, on average; null: not timed). */
  minute(): { sim: number | null; draw: number | null } {
    const now = Math.floor(performance.now() / 1000);
    const live = this.minuteBuckets.filter((b) => now - b.second < 60);
    const mean = (sum: number, n: number): number | null => (n ? sum / n : null);
    return {
      sim: mean(live.reduce((a, b) => a + b.sim, 0), live.reduce((a, b) => a + b.simN, 0)),
      draw: mean(live.reduce((a, b) => a + b.draw, 0), live.reduce((a, b) => a + b.drawN, 0)),
    };
  }

  /** The frames since the last take, summed up; and a fresh start. */
  take(): Sample | null {
    const n = this.intervals.length;
    if (n < 2) return null;
    const sorted = [...this.intervals].sort((a, b) => a - b);
    const total = this.intervals.reduce((a, b) => a + b, 0);
    const cpu = Object.fromEntries(PARTS.map((p) => [p, this.cpu[p] / n])) as Record<Part, number>;
    const s: Sample = {
      frames: n,
      fps: (n * 1000) / total,
      p50: sorted[Math.floor(n * 0.5)],
      p90: sorted[Math.min(n - 1, Math.floor(n * 0.9))],
      cpu,
      cpuTotal: PARTS.reduce((a, p) => a + cpu[p], 0),
      gpuSim: median(this.gpuSims),
      gpuDraw: median(this.gpuDraws),
      gpuQueue: this.queueN ? this.queueSum / this.queueN : null,
    };
    this.intervals = [];
    for (const p of PARTS) this.cpu[p] = 0;
    this.gpuSims = [];
    this.gpuDraws = [];
    this.queueSum = this.queueN = 0;
    return s;
  }
}

const f1 = (v: number | null): string => (v === null ? '-' : v.toFixed(1));

/** Parts after head, joined with ' · ' into lines of LINE characters at most (the lines after the
 *  first indented). */
export function wrap(head: string, parts: readonly string[]): string {
  const lines = [head];
  for (const p of parts) {
    const last = lines[lines.length - 1];
    const joined = last.endsWith(':') ? `${last} ${p}` : `${last} · ${p}`;
    if (joined.length <= LINE) lines[lines.length - 1] = joined;
    else lines.push(`  ${p}`);
  }
  return lines.join('\n');
}

/** A sample as the HUD shows it (extra: more of the picture's settings, after its pixel ratio). */
export function describe(s: Sample, ratio: number, extra: readonly string[] = []): string {
  const gpu = s.gpuSim !== null || s.gpuDraw !== null ? `gpu sim ${f1(s.gpuSim)} · draw ${f1(s.gpuDraw)} ms` : `gpu ~${f1(s.gpuQueue)} ms (queue)`;
  return [`${s.fps.toFixed(1)} fps (frames ${f1(s.p50)} / ${f1(s.p90)} ms)`, wrap(`cpu ${f1(s.cpuTotal)} ms:`, PARTS.map((p) => `${p} ${f1(s.cpu[p])}`)), gpu, wrap(`pixel ratio ${ratio.toFixed(2)}`, extra)].join('\n');
}

/** The load milestones as the HUD shows them, in the order they came: seconds since navigation. */
export function describeLoad(load: readonly [string, number][]): string {
  return wrap('load (s):', [...load].sort((a, b) => a[1] - b[1]).map(([n, t]) => `${n} ${(t / 1000).toFixed(2)}`));
}
