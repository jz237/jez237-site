// The phone's quality controller (controller.mjs) on the page: what it is fed each frame (the GPU's
// time on a frame, the bowl's area on screen, whether anything moved), where a view starts, and what
// the page keeps of it for the next visit (record.mjs).

import type * as THREE from 'three/webgpu';
import type { DeviceInfo } from '../../gpu/device';
import type { FluidSim } from '../../sim/FluidSim';
import type { buildLadder } from './ladder.mjs';
import { deviceKey, keepCompileMs, keepLevel, keptCompileMs, priorLevel, priorSpeed, readRecord, startLevel, writeRecord } from './record.mjs';

/** The build a level was held in (in a new build a view starts a rung lower: its shaders may cost
 *  more): the page script's own file, whose name a build hashes. */
const BUILD = new URL(import.meta.url).pathname.split('/').pop() ?? '';

type Levels = ReturnType<typeof buildLadder>;

/** The GPU's time on a frame: three's render passes and the sim's compute passes, timed with
 *  timestamp queries where the device has them (one resolve in flight at a time: a frame's times
 *  come in a few frames after it, about every other frame; the sim's each pass's, smoothed:
 *  FluidSim.gpuTimes), else the queue's pace (when a frame's work was done, after its start and the
 *  last frame's: what the GPU spent on it, about, when it is the limit). */
export class GpuClock {
  readonly timed: boolean;
  private pending = false;
  private sample: { sim: number; draw: number } | null = null;
  private queueMs: number | null = null;
  private queueDoneAt = 0;

  constructor(
    private readonly renderer: THREE.WebGPURenderer,
    private readonly sim: FluidSim,
    private readonly device: GPUDevice,
  ) {
    // (The renderer times its passes where it was asked to and the device can: main.ts.)
    this.timed = device.features.has('timestamp-query') && (renderer.backend as unknown as { trackTimestamp: boolean }).trackTimestamp;
    if (this.timed) sim.setProfiling(true);
  }

  /** Once a frame, after its work is submitted (start: when the frame began, ms). */
  frame(start: number): void {
    if (this.timed) {
      if (this.pending) return;
      this.pending = true;
      void this.renderer.resolveTimestampsAsync('render').then((ms) => {
        this.pending = false;
        if (!(ms && ms > 0)) return;
        // (Every frame the resolve took in, averaged: the last alone, at a steady cadence, could
        // always be a frame the table's mirror is drawn in, or always one it is not.)
        const pool = (this.renderer.backend as unknown as { timestampQueryPool?: Record<string, { timestamps: Map<string, number>; frames: number[] } | undefined> }).timestampQueryPool?.render;
        let draw = ms;
        if (pool && pool.frames.length > 1) {
          let sum = 0;
          for (const d of pool.timestamps.values()) sum += d;
          draw = sum / pool.frames.length;
        }
        this.sample = { sim: Object.values(this.sim.gpuTimes).reduce((a, b) => a + b, 0), draw };
      });
      return;
    }
    void this.device.queue.onSubmittedWorkDone().then(() => {
      const done = performance.now();
      this.queueMs = done - Math.max(start, this.queueDoneAt);
      this.queueDoneAt = done;
    });
  }

  /** The times that came in since the last take (null: none). */
  take(): { sim: number; draw: number } | null {
    const s = this.sample;
    this.sample = null;
    return s;
  }

  /** The queue's pace of the last frame done, untimed (null: timed, or none yet). */
  takeQueue(): number | null {
    const ms = this.queueMs;
    this.queueMs = null;
    return ms;
  }
}

/** The bowl's area on the stage (CSS px^2), the part in view: its glass's outline (an ellipse:
 *  GlobeController.screenOutline), 1.15x for its lid, clipped to the stage (w x h) by its bounding
 *  box. */
export function bowlArea(o: { x: number; y: number; rx: number; ry: number; angle: number }, w: number, h: number): number {
  const c = Math.cos(o.angle);
  const s = Math.sin(o.angle);
  const ex = Math.max(Math.hypot(o.rx * c, o.ry * s), 1e-6);
  const ey = Math.max(Math.hypot(o.rx * s, o.ry * c), 1e-6);
  const inX = Math.max(0, Math.min(o.x + ex, w) - Math.max(o.x - ex, 0)) / (2 * ex);
  const inY = Math.max(0, Math.min(o.y + ey, h) - Math.max(o.y - ey, 0)) / (2 * ey);
  return Math.PI * o.rx * o.ry * 1.15 * inX * inY;
}

/** Whether anything the picture's motion follows has moved since the last frame (the camera, the
 *  bowl's place and turn, its lid): numbers compared with those last seen moved, to within STILL
 *  (a millionth: far under a pixel; a spring easing a let-go bowl back upright creeps on through
 *  ever smaller numbers for minutes, and would read as moving all that while). */
const STILL = 1e-6;

export class PoseWatch {
  private readonly last = new Float64Array(64);

  still(...parts: ArrayLike<number>[]): boolean {
    let same = true;
    let k = 0;
    for (const p of parts) {
      for (let i = 0; i < p.length; i++, k++) {
        if (Math.abs(this.last[k] - p[i]) > STILL) {
          same = false;
          this.last[k] = p[i];
        }
      }
    }
    return same;
  }
}

/** What the page keeps of this device's picture (record.mjs): where a view starts, the level it
 *  held longest, and how long the bowl took to build. */
export class QualityRecord {
  private readonly storage: Storage | null;
  private readonly key: string;
  private readonly speed: number;

  constructor(info: DeviceInfo | null) {
    this.storage = (() => {
      try {
        return localStorage;
      } catch {
        return null;
      }
    })();
    this.key = deviceKey(info, { width: screen.width, height: screen.height, devicePixelRatio });
    this.speed = priorSpeed(info);
  }

  private read() {
    return readRecord(this.storage);
  }

  /** The level a view held this way (way) starts at: the one kept, else one the GPU's name
   *  suggests for the bowl this large (area, CSS px^2). */
  start(levels: Levels, way: string, area: number): number {
    return startLevel(this.read(), this.key, way, BUILD, levels, priorLevel(levels, this.speed, area));
  }

  /** The level kept for this way, if any (no guess). */
  kept(levels: Levels, way: string): number | null {
    const level = startLevel(this.read(), this.key, way, BUILD, levels, -1);
    return level < 0 ? null : level;
  }

  keep(way: string, level: number): void {
    writeRecord(this.storage, keepLevel(this.read(), this.key, way, BUILD, level));
  }

  /** How long the bowl's pipelines took to build here last time (ms), or null. */
  get compileMs(): number | null {
    return keptCompileMs(this.read(), this.key);
  }

  set compileMs(ms: number | null) {
    if (ms !== null) writeRecord(this.storage, keepCompileMs(this.read(), this.key, ms));
  }
}
