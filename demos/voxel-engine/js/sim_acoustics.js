// The audio asks the world two things: how much solid lies between the
// listener and a sound, and what encloses the listener. A sim on this thread
// answers by asking the engine (LocalSim.acoustics). A sim that is somewhere
// else cannot be asked in the middle of a frame, so there the answers come
// from what a frame carries:
//
// - the enclosure where the picture is drawn from (`frame.enclosure`): the
//   sim camera's last two positions and the frame's alpha, which is where
//   the audio's listener is but for the shell's camera shake;
// - for each event record, the solid between that point and the event as
//   the engine measured it (`frame.eventSolid(i)`): a sound played at a new
//   event gets the engine's own answer;
// - the acoustic map (`frame.sound`): for every texel of the AO volume, how
//   much its voxels block sound, materials counted as the engine counts them
//   (Engine.acousticMap). For a sound played anywhere else a ray is marched
//   through it here. Most sounds are such: the grains of a collapse are
//   scattered around the middle of its events, not played at them.
//
// (And where the line skims a flat face, by which part of a half-full texel
// it is in: `atFace`.)
// Measured against the engine's own ray for grains scattered round the events
// of blasts in the town and the high-rise (sim_remote_check.mjs has the
// check): the march is within 3 dB of the engine's answer for 98 to 99% of
// them (a step of one map texel, 20 cm; at the engine's 10 cm it was 99 to
// 99.6%, for twice the time: 20 us a sound 25 m off, and a collapse asks
// seventy times a second). Borrowing the answer of the nearest event instead (what this did
// first) was within 3 dB for 38 to 78%, and told one sound in ten behind a
// wall that its line was clear; a march through the AO density volume, which
// knows no materials (a pane of glass and a concrete wall look alike, and
// soil is as dense as either), for 83 to 90%.
import { OUT, EV_STRIDE } from './engine.js';

// As engine/src/acoustics.rs has them (metres): the stretch next to the
// listener and next to the source that is ignored, the longest path looked
// at, the solid past which the answer no longer changes what is heard, and
// the byte the map has for a texel of concrete all through. The march steps
// by a texel of the map (the engine's own ray by a voxel, half that), each
// stretch taken at its middle.
const SKIP_LISTENER = 0.3, SKIP_SOURCE = 0.6, MAX_PATH = 60, ENOUGH = 4, STEP = 0.2, MAP_ONE = 170;
// The map has one texel per 20 cm.
const TEXELS_PER_M = 5;
// A sound this close to an event record (m, per axis) is that event.
const AT_EVENT = 1e-3;

export class FrameAcoustics {
  constructor() {
    this.enclosure = 0;
    this.count = 0;
    this._pos = new Float32Array(3 * 64);
    this._solid = new Float32Array(64);
    this._total = -1;
    this._frame = null;
    this._ox = this._oy = this._oz = 0;
  }

  // Once per frame, as it arrives: keeps the frame's new events (a frame's
  // own memory does not outlive it) and the size of its acoustic map.
  take(frame) {
    const out = frame.out;
    this._frame = frame;
    this._ox = out[OUT.OCC_SX];
    this._oy = out[OUT.OCC_SY];
    this._oz = out[OUT.OCC_SZ];
    this.enclosure = frame.enclosure;
    const total = out[OUT.EVENT_TOTAL], count = out[OUT.EVENT_COUNT];
    // (Wrapping difference: correct across u32 overflow.)
    let fresh = this._total < 0 ? count : (total - this._total) >>> 0;
    this._total = total;
    if (fresh > count) fresh = count;
    this.count = fresh;
    if (fresh === 0) return;
    if (fresh > this._solid.length) {
      this._pos = new Float32Array(3 * fresh * 2);
      this._solid = new Float32Array(fresh * 2);
    }
    const f = frame.f32, first = count - fresh;
    let p = (out[OUT.EVENTS_PTR] >> 2) + first * EV_STRIDE;
    for (let i = 0; i < fresh; i++, p += EV_STRIDE) {
      this._pos[i * 3] = f[p + 1];
      this._pos[i * 3 + 1] = f[p + 2];
      this._pos[i * 3 + 2] = f[p + 3];
      this._solid[i] = frame.eventSolid(first + i);
    }
  }

  // (The listener is where the frame's picture is drawn from; the arguments
  // are the audio's own idea of it, a camera shake away.)
  acousticEnclosure(x, y, z) {
    return this.enclosure;
  }

  acousticOcclusion(lx, ly, lz, sx, sy, sz) {
    const pos = this._pos;
    for (let i = 0, p = 0; i < this.count; i++, p += 3) {
      if (Math.abs(pos[p] - sx) < AT_EVENT && Math.abs(pos[p + 1] - sy) < AT_EVENT && Math.abs(pos[p + 2] - sz) < AT_EVENT) {
        // (An answer under nothing, or not a number, is an event the
        // frame did not measure: the map answers for it, as for a sound
        // played anywhere else.)
        const solid = this._solid[i];
        if (solid >= 0) return solid;
        break;
      }
    }
    return this.march(lx, ly, lz, sx, sy, sz);
  }

  // Concrete-equivalent metres of solid on the line from the listener to the
  // source, from the acoustic map of the newest frame. 0 where there is no
  // map (a frame that is not a packet's).
  march(lx, ly, lz, sx, sy, sz) {
    const frame = this._frame, ox = this._ox, oy = this._oy, oz = this._oz;
    if (frame === null) return 0;
    const map = frame.sound;
    let dx = sx - lx, dy = sy - ly, dz = sz - lz;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    // (Also false for a position that is not a number.)
    if (!(len > SKIP_LISTENER + SKIP_SOURCE) || !map || map.length < ox * oy * oz) return 0;
    const k = TEXELS_PER_M / len;
    dx *= k; dy *= k; dz *= k;
    const x0 = lx * TEXELS_PER_M, y0 = ly * TEXELS_PER_M, z0 = lz * TEXELS_PER_M;
    const end = Math.min(len - SKIP_SOURCE, MAX_PATH), enough = ENOUGH * MAP_ONE / STEP;
    // (How much of the line's direction lies along each axis, 0..1.)
    const nx = Math.abs(dx) / TEXELS_PER_M, ny = Math.abs(dy) / TEXELS_PER_M, nz = Math.abs(dz) / TEXELS_PER_M;
    let sum = 0;
    for (let t = SKIP_LISTENER + 0.5 * STEP; t < end; t += STEP) {
      const fx = x0 + dx * t, fy = y0 + dy * t, fz = z0 + dz * t;
      const x = Math.floor(fx), y = Math.floor(fy), z = Math.floor(fz);
      if (x < 0 || y < 0 || z < 0 || x >= ox || y >= oy || z >= oz) continue;
      const at = x + ox * (z + oz * y);
      let v = map[at];
      if (v !== 0) v = atFace(map, at, v, x, y, z, ox, oy, oz, fx - x, fy - y, fz - z, nx, ny, nz);
      sum += v;
      if (sum >= enough) return ENOUGH;
    }
    return sum * (STEP / MAP_ONE);
  }
}

// What a texel of the map counts for at a point inside it (ux, uy, uz, each
// 0..1) on a line that runs along a flat face of something (nx, ny, nz: how
// much of the line's direction lies along each axis): its own byte, except
// there. A texel is the mean of its eight voxels, and a line that skims a
// floor or runs along a wall passes through texels that are half ground for
// metres without touching the ground: the engine's ray counted 0.07 m of
// solid on such a line 28 m long and this march 0.93 (the worker engineer's
// row; two to six sounds in two thousand low over the ground were told
// "walled off" in the open). Where the texel has open air on one side and
// as much as it holds or more on the other, along the axis the map changes
// most on, and the line crosses that axis at a shallow angle (GRAZE), the
// solid in it lies against the fuller side and fills that much of it: the
// point is in it, and counts as the fullest of the seven does, or is in the
// air, and counts nothing. Over all the points of the texel that is the
// texel's own byte again. (A line that crosses a face steeply keeps the
// byte: it is in the texel for one step, and all or nothing there is a
// coin tossed for a tenth of a metre.)
// Held against the engine's ray for sounds low over the ground 10 to 40 m
// off (2,000 in the town and in New York, 1,600 in the high-rise): within
// 3 dB of it for 99.5, 99.0 and 99.8% of them (98.2, 96.8 and 99.3% as it
// was), none told walled off in the open (2, 6 and 2 as it was). Grains
// round blasts: within a fifth of a percent of what they were, either way
// (sim_remote_check's row: 99.0 -> 98.8% in the town, 98.4 -> 99.1% in
// the high-rise). 3 to 4 us a sound.
const GRAZE = 0.25;
function atFace(map, at, v, x, y, z, ox, oy, oz, ux, uy, uz, nx, ny, nz) {
  if (nx > GRAZE && ny > GRAZE && nz > GRAZE) return v;
  const xa = x > 0 ? map[at - 1] : 0, xb = x + 1 < ox ? map[at + 1] : 0;
  const za = z > 0 ? map[at - ox] : 0, zb = z + 1 < oz ? map[at + ox] : 0;
  const ya = y > 0 ? map[at - ox * oz] : 0, yb = y + 1 < oy ? map[at + ox * oz] : 0;
  const full = Math.max(v, xa, xb, ya, yb, za, zb);
  if (v >= full) return v;
  const gx = xb - xa, gy = yb - ya, gz = zb - za, ax = Math.abs(gx), ay = Math.abs(gy), az = Math.abs(gz);
  let u, toward, lo, hi, along;
  if (ay >= ax && ay >= az) { u = uy; toward = gy; lo = Math.min(ya, yb); hi = Math.max(ya, yb); along = ny; }
  else if (ax >= az) { u = ux; toward = gx; lo = Math.min(xa, xb); hi = Math.max(xa, xb); along = nx; }
  else { u = uz; toward = gz; lo = Math.min(za, zb); hi = Math.max(za, zb); along = nz; }
  if (along > GRAZE || lo !== 0 || hi < v) return v;
  const fill = v / full;
  return (toward > 0 ? u >= 1 - fill : u < fill) ? full : 0;
}
