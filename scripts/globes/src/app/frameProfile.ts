// Where a frame's time goes, for ?stats and ?bench (a phone has no profiler to read): the main
// thread's time on each part of the frame, the GPU's on the sim and the drawing (timestamp queries
// where the device has them; otherwise the queue's own pace), the frames' pace, and the load.

/** The main thread's parts of a frame, in the order they run. */
export const PARTS = ['input', 'betta', 'plants', 'life', 'food', 'sim', 'scene', 'draw'] as const;
export type Part = (typeof PARTS)[number];

export interface Sample {
  frames: number;
  fps: number;
  /** Frame intervals (ms): the middle one and the slowest tenth's start. */
  p50: number;
  p90: number;
  /** Main thread (ms a frame): each part, and all of it. */
  cpu: Record<Part, number>;
  cpuTotal: number;
  /** GPU (ms a frame): the sim's passes and the drawing, where timed; the queue's pace otherwise. */
  gpuSim: number | null;
  gpuDraw: number | null;
  gpuQueue: number | null;
}

export class FrameProfile {
  private t = 0;
  private frameStart = 0;
  private cpu = Object.fromEntries(PARTS.map((p) => [p, 0])) as Record<Part, number>;
  private intervals: number[] = [];
  private lastFrame = -1;
  private gpuSimSum = 0;
  private gpuSimN = 0;
  private gpuDrawSum = 0;
  private gpuDrawN = 0;
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
    this.gpuSimSum += ms;
    this.gpuSimN++;
  }

  gpuDraw(ms: number): void {
    this.gpuDrawSum += ms;
    this.gpuDrawN++;
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
      gpuSim: this.gpuSimN ? this.gpuSimSum / this.gpuSimN : null,
      gpuDraw: this.gpuDrawN ? this.gpuDrawSum / this.gpuDrawN : null,
      gpuQueue: this.queueN ? this.queueSum / this.queueN : null,
    };
    this.intervals = [];
    for (const p of PARTS) this.cpu[p] = 0;
    this.gpuSimSum = this.gpuSimN = this.gpuDrawSum = this.gpuDrawN = this.queueSum = this.queueN = 0;
    return s;
  }
}

const f1 = (v: number | null): string => (v === null ? '-' : v.toFixed(1));

/** A sample as the HUD shows it. */
export function describe(s: Sample, ratio: number, extra = ''): string {
  const parts = PARTS.map((p) => `${p} ${f1(s.cpu[p])}`).join(' · ');
  const gpu = s.gpuSim !== null || s.gpuDraw !== null ? `gpu sim ${f1(s.gpuSim)} · draw ${f1(s.gpuDraw)} ms` : `gpu ~${f1(s.gpuQueue)} ms (queue)`;
  return `${s.fps.toFixed(1)} fps (frames ${f1(s.p50)} / ${f1(s.p90)} ms)\ncpu ${f1(s.cpuTotal)} ms: ${parts}\n${gpu}\npixel ratio ${ratio.toFixed(2)}${extra}`;
}

/** The load milestones as the HUD shows them: seconds since navigation. */
export function describeLoad(load: readonly [string, number][]): string {
  return 'load ' + load.map(([n, t]) => `${n} ${(t / 1000).toFixed(2)}`).join(' · ') + ' s';
}
