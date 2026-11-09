// The picture between two packets.
//
// A sim on another thread that takes longer than a display frame over an
// answer leaves frames with no new packet. Drawn from the packet before,
// the world stands still in those frames and jumps in the next: thirty
// moves a second under a camera that turns sixty times. So where packets
// come further apart than frames, the bodies and the camera's position are
// not shown at the newest packet at once: they travel there from where the
// picture last had them, over the time the next packet is expected to take,
// and every frame draws them a little further on. The world is then shown
// part of a packet late (the price), moving at the display's rate, as fast
// as the sim gets through it: a sim that cannot keep up is slow motion, not
// a slide show.
//
// What travels: body transforms (position and rotation of each body in the
// transform buffer) and the point the picture is drawn from. What does
// not: quads, the AO volume, particles, lights and events are the newest
// packet's from its first frame (a wall is gone the moment its packet is
// in; particles have no identity from packet to packet to follow them by).
// A body is the same body in both packets if its slot says the same about
// what it is (scale, where it was cut from, flags) and it has not gone
// further than anything flies in that time; otherwise it is where the
// newest packet has it, at once. A new world, a cut of more than three
// metres in the camera: at once too.
//
// Packets that come every frame are shown as they are, at once: a sim that
// keeps up looks exactly as it did. The pace is what the last packets kept
// (one answer far behind it is waited out and forgotten, two running are
// the new pace), down to two packets a second; a pause or a frame loop that
// stood is not the sim being slow, and the packet after it is shown at once.
//
// Two ways of timing the journey (`even`; main.js: ?tween=2 and ?tween=1).
//
// By the take (as it was first built): a journey begins when its packet is
// taken and lasts as long as packets have lately been apart. Right where a
// packet takes several frames. Where a step costs a little more than a
// frame (17 to 21 ms on a display at 60) most frames have a packet and one
// in six to twenty has none: packets are then "on time" by this reckoning,
// each is shown at once, and the picture stands a whole frame and leaps,
// three to ten times a second (sim_pace_check --slow).
//
// By the world's time (`even`): the picture has a time of its own, in the
// world's steps, and goes on by the pace the last packets kept (steps of
// the world for a millisecond of the display), whenever they happened to be
// taken. It is held far enough behind the newest packet not to reach it
// before the next is in: no further on than the packet before, when a
// packet is taken. So it is one to two packets behind the newest, where by
// the take it is none to one: that is the price, paid only while frames go
// without a packet (two of them inside a second; none for a second ends
// it), and never by a worker that keeps up.
//
// It works on the frame it is given, in place: the transforms in the
// packet's own buffer and the frame's camPrev / camCur / alpha are
// overwritten for each drawn frame, so nothing downstream knows (the
// renderer uploads the transforms that differ from the ones it has, the
// frame loop places the camera between camPrev and camCur by alpha, as
// ever).
import { OUT, XF_STRIDE } from './engine.js';

// A body further than this from where it was (m), or a camera further than
// CUT, did not travel there.
const FAR = 1.5, CUT = 3;
// Packets no further apart than this many frames are shown at once.
const ON_TIME = 1.25;
// The longest a journey is spread over (ms): two packets a second is the
// slowest pace the picture follows; past that it shows each as it comes.
const LONGEST = 500;
// A packet this many times later than the pace so far is one long answer,
// not a new pace, until the next one is as late.
const SPIKE = 3;
// The journey is timed by the world's time unless the address says
// otherwise (?tween=1, ?tween=2).
export const EVEN_BY_DEFAULT = true;
// By the world's time. The packets the pace is read from: the last so many.
// And when the last NEW_PACE of them keep a pace NEW_PACE_BY times that of
// all (or as much slower), with twice as many before them: from those on.
const PACE = 32, NEW_PACE = 4, NEW_PACE_OVER = 4, NEW_PACE_BY = 1.5;
// Two frames drawn with no new packet inside this long (ms): the worker is
// not keeping up, and the picture goes by its own time; none for as long:
// it keeps up again.
const WITHIN = 1000;
// How much faster than the pace the picture comes on when the worker keeps
// up again; over how long (ms) room made for an uneven stretch is given
// back; over how many frames what is beyond that is made up; and how much
// faster than the pace the picture ever goes, all told. (A tenth: what
// moves on the screen is then never a tenth faster than it is in the
// world. In a headset the room's speed is read from the picture's place,
// and a player at a run must not read as carried: xr_play.js, rideOf.)
const CATCH_UP = 1.08, GIVEN_BACK_IN = 1000, MADE_UP_IN = 4, FASTEST = 1.1;

export class Tween {
  constructor() {
    this.enabled = true;
    // Transforms as last shown and as the newest packet has them (grown as
    // bodies come), and the bodies on their way between the two.
    this._from = new Float32Array(256 * XF_STRIDE);
    this._to = new Float32Array(256 * XF_STRIDE);
    this._ids = new Uint16Array(256);
    this._count = 0;
    this._bodies = 0;
    this._camFrom = new Float64Array(3);
    this._camTo = new Float64Array(3);
    this._camShown = new Float64Array(3);
    this._camKnown = false;
    this._camMoves = false;
    // When the newest packet was taken, the smoothed time between packets
    // (ms: the pace), whether the last one was far behind it, and what the
    // journey under way is spread over.
    this._at = 0;
    this._gap = 0;
    this._spiked = false;
    this._over = 0;
    // The journey is timed by the world's time (above). Off: by the take.
    this.even = EVEN_BY_DEFAULT;
    // The time the display gave the frame being made (ms, on the clock
    // `now` is read from; NaN: not known): what `even` goes by where it is
    // known, so that a callback that ran late is not a longer stride.
    this.beat = NaN;
    // By the world's time: the last PACE packets, when each was taken and
    // the world's time it is of (steps); the pace they keep (steps a ms);
    // whether a packet has come since the last frame drawn; when the last
    // two frames were drawn without one, and the packet each followed;
    // whether the picture goes by its own time, and whether it is making
    // up what it is behind since the worker kept up again.
    this._pt = new Float64Array(PACE);
    this._pw = new Float64Array(PACE);
    this._pn = 0;
    this._rho = 0;
    this._fresh = false;
    this._spiked2 = false;
    this._missAt = [-Infinity, -Infinity];
    this._missT = [0, 0];
    this._missW = [0, 0];
    this._late = false;
    this._closing = false;
    // The world's time of the newest packet and of the one before; the
    // picture's own; where the journey under way began and ends; how much
    // faster than the pace it goes; when the picture was last drawn; it
    // got to the newest packet and a frame was drawn with nothing new.
    this._w = NaN;
    this._wd = NaN;
    this._wFrom = 0;
    this._wTo = 0;
    this._hurry = 1;
    this._more = 0;
    this._drawnAt = 0;
    this._there = false;
    this._stood = false;
    // A journey is under way: the frame after this one differs from it
    // even if no packet comes.
    this.moving = false;
    // How far along the last drawn frame was, 0..1.
    this.u = 1;
  }

  // The frame is about to take a new packet: what it shows now is where
  // everything starts from.
  before(frame) {
    this._bodies = 0;
    if (!frame.buffer) return;
    const out = frame.out, n = Math.min(out[OUT.XF_COUNT], 8192), words = n * XF_STRIDE;
    if (n < 2) return;
    if (this._from.length < words) this._from = new Float32Array(Math.min(8192, n * 2) * XF_STRIDE);
    const xp = out[OUT.XF_PTR] >> 2;
    this._from.set(frame.f32.subarray(xp, xp + words));
    this._bodies = n;
  }

  // The frame has taken it. now: ms; frameMs: the display's frame; idle:
  // since the packet before, the game was paused or the frame loop stood
  // (a menu, a hidden tab): the time between the two says nothing about
  // the sim's pace, and nothing travels across it.
  after(frame, now, frameMs, idle = false) {
    const gap = Math.min(now - this._at, LONGEST);
    if (!(this._gap > 0) || this._at === 0) {
      this._gap = frameMs;
    } else if (!idle) {
      // One answer far behind the pace (a step that took ten times the
      // rest) is waited out and forgotten; two running are the new pace.
      const spike = gap > this._gap * SPIKE;
      if (!spike) this._gap += (gap - this._gap) * 0.3;
      else if (this._spiked) this._gap = gap;
      this._spiked = spike && !this._spiked;
    }
    const paused = idle;
    this._at = now;
    this._count = 0;
    this._camMoves = false;
    const out = frame.out, f32 = frame.f32;
    const cx = frame.camPrev[0] + (frame.camCur[0] - frame.camPrev[0]) * frame.alpha;
    const cy = frame.camPrev[1] + (frame.camCur[1] - frame.camPrev[1]) * frame.alpha;
    const cz = frame.camPrev[2] + (frame.camCur[2] - frame.camPrev[2]) * frame.alpha;
    const to = this._camTo, was = this._camShown;
    to[0] = cx; to[1] = cy; to[2] = cz;
    // Packets on time, a new world, or switched off: as the packet has it.
    const late = this.even ? this._paced(frame, now, frameMs, paused) : this.enabled && !frame.world && !paused && this._gap > frameMs * ON_TIME;
    if (!late) {
      this.moving = false;
      return;
    }
    this._over = Math.min(this._gap, LONGEST);
    if (this._camKnown) {
      const dx = cx - was[0], dy = cy - was[1], dz = cz - was[2], d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > 0 && d2 < CUT * CUT) {
        this._camFrom.set(was);
        this._camMoves = true;
      }
    }
    const n = Math.min(out[OUT.XF_COUNT], 8192, this._bodies), words = Math.min(out[OUT.XF_COUNT], 8192) * XF_STRIDE;
    if (n > 1) {
      if (this._to.length < words) this._to = new Float32Array(Math.min(8192, (words / XF_STRIDE) * 2) * XF_STRIDE);
      if (this._ids.length < n) this._ids = new Uint16Array(Math.min(8192, n * 2));
      const xp = out[OUT.XF_PTR] >> 2, a = this._from, b = this._to, ids = this._ids;
      b.set(f32.subarray(xp, xp + n * XF_STRIDE));
      let count = 0;
      for (let id = 1; id < n; id++) {
        const o = id * XF_STRIDE;
        // The same body: what the slot says it is has not changed, and it
        // was a body (a slot never used is all zeros).
        if (a[o + 7] !== b[o + 7] || a[o + 8] !== b[o + 8] || a[o + 9] !== b[o + 9] || a[o + 10] !== b[o + 10] || a[o + 11] !== b[o + 11] || a[o + 7] === 0) continue;
        const dx = b[o + 4] - a[o + 4], dy = b[o + 5] - a[o + 5], dz = b[o + 6] - a[o + 6];
        const still = dx === 0 && dy === 0 && dz === 0 && a[o] === b[o] && a[o + 1] === b[o + 1] && a[o + 2] === b[o + 2] && a[o + 3] === b[o + 3];
        if (still || dx * dx + dy * dy + dz * dz > FAR * FAR) continue;
        // (The short way round: q and -q are one rotation.)
        if (a[o] * b[o] + a[o + 1] * b[o + 1] + a[o + 2] * b[o + 2] + a[o + 3] * b[o + 3] < 0) {
          a[o] = -a[o]; a[o + 1] = -a[o + 1]; a[o + 2] = -a[o + 2]; a[o + 3] = -a[o + 3];
        }
        ids[count++] = id;
      }
      this._count = count;
    }
    this.moving = this._count > 0 || this._camMoves;
  }

  // By the world's time: the packet just taken is counted, and the picture's
  // own time is set for the journey to it. Returns whether the picture goes
  // by its own time (false: as the packet has it, at once).
  _paced(frame, now, frameMs, paused) {
    const t = this.beat > 0 ? this.beat : now;
    // (The world's time this packet's picture is of: the step before its
    // last and how far past it.)
    const w = frame.out[OUT.STAT_FRAME] - 1 + (Number.isFinite(frame.alpha) ? Math.max(0, Math.min(1, frame.alpha)) : 1);
    const pt = this._pt, pw = this._pw, wWas = this._w, tWas = this._pn > 0 ? pt[this._pn - 1] : NaN;
    this._w = w;
    const stood = this._stood, undrawn = this._fresh;
    this._stood = false;
    this._there = false;
    this._fresh = true;
    // A new world, a pause, the world's time going back, or a packet taken
    // with the one before never drawn (a tool stepping the world, not the
    // frame loop): the packets before say nothing about the pace from
    // here on, and this one is shown as it is. (A world's first packet is
    // not counted at all: its first answer is taken two frames after it,
    // and that is not a frame the worker missed.)
    if (!this.enabled || frame.world || paused || undrawn || !(w >= wWas) || !(t > tWas)) {
      this._pn = 0;
      this._missAt[0] = this._missAt[1] = -Infinity;
      if (!frame.world) { pt[0] = t; pw[0] = w; this._pn = 1; }
      this._late = this._closing = this._spiked2 = false;
      this._wd = w;
      return false;
    }
    let late = this._late, spiked = false;
    if (!late) {
      if (t - this._missAt[0] <= WITHIN) {
        // Two frames without a packet inside a second: late from here.
        // The pace is read from the packet before the first of the two on
        // (the many before it, on time, are another pace: a collapse has
        // begun).
        late = true;
        pt[0] = this._missT[0]; pw[0] = this._missW[0];
        this._pn = 1;
      }
    } else if (t - this._missAt[1] > WITHIN) {
      // None for a second: the worker keeps up. The picture makes up what
      // it is behind, a quarter faster than the pace, and is shown as the
      // packets have it once it is within a packet of the newest.
      this._closing = true;
      if (!(w - this._wd > 1.01 * (w - wWas))) late = false;
    } else {
      this._closing = false;
      if (stood && this._pn >= 8 && this._rho > 0) {
        // The picture got to the newest packet and a frame was drawn with
        // nothing new. One answer far out of line (three times what the
        // pace makes of the world's time it brought) is waited out and
        // forgotten: the packets before it are counted as if it had come
        // when it was due. Two running, or one less far out: the world
        // has slowed, and the pace is read from the packet before this
        // one on.
        const due = (w - wWas) / this._rho, over = t - tWas - due;
        if (over > (SPIKE - 1) * due && !this._spiked2) {
          for (let i = 0; i < this._pn; i++) pt[i] += over;
          spiked = true;
        } else {
          pt[0] = pt[this._pn - 1]; pw[0] = wWas;
          this._pn = 1;
        }
      }
    }
    this._spiked2 = spiked;
    if (this._pn === PACE) { pt.copyWithin(0, 1); pw.copyWithin(0, 1); this._pn--; }
    pt[this._pn] = t;
    pw[this._pn] = w;
    const n = ++this._pn;
    let rho = this._slope(n);
    if (n > NEW_PACE_OVER + NEW_PACE) {
      // The last few packets keep another pace than the many (half again
      // faster or slower): the world's pace has changed, and the many are
      // forgotten.
      const k = n - 1 - NEW_PACE, short = (w - pw[k]) / (t - pt[k]);
      if (short > rho * NEW_PACE_BY || short * NEW_PACE_BY < rho) {
        pt.copyWithin(0, k, n); pw.copyWithin(0, k, n);
        this._pn = NEW_PACE + 1;
        rho = this._slope(this._pn);
      }
    }
    this._rho = rho;
    if (!(rho > 0)) late = false;
    this._late = late;
    if (!late) {
      this._closing = false;
      this._wd = w;
      return false;
    }
    // When a packet is taken and its first frame drawn, the picture is no
    // further on than the packet before: it cannot reach the newest before
    // one frame has gone without a packet, and the next is in by then.
    // (Further back than that it stays: the packets' beat against the
    // display's puts it up to a frame behind and brings it back.)
    const bound = this._closing ? w : wWas - rho * frameMs;
    if (!(this._wd <= bound)) this._wd = bound;
    // (It stood all the same: packets are coming less evenly than one
    // packet's room allows for. Half a packet further back.)
    if (stood && !this._closing) this._wd = Math.min(this._wd, bound - 0.5 * (w - wWas));
    // Further back than it need be, it comes on faster than the pace. Up
    // to a frame's worth is the packets' beat against the display's and is
    // left alone; up to half a packet more is room made for an uneven
    // stretch, given back over a second or so; what is beyond that (the
    // world has quickened, and the pace read is behind it) in a few frames.
    const extra = Math.max(0, bound - this._wd - rho * frameMs), room = 0.5 * (w - wWas);
    this._hurry = this._closing ? CATCH_UP : 1;
    this._more = Math.min(extra, room) / GIVEN_BACK_IN + Math.max(0, extra - room) / (MADE_UP_IN * frameMs);
    this._wFrom = this._wd;
    this._wTo = w;
    return true;
  }

  // The pace the last n packets keep, steps of the world a ms: the line
  // that fits them best. (Not from the first of them to the last: packets
  // are taken on the display's beat, so each of those two times is up to
  // a frame out, and that is 3% of half a second.)
  _slope(n) {
    const pt = this._pt, pw = this._pw;
    let st = 0, sw = 0;
    for (let i = 0; i < n; i++) { st += pt[i]; sw += pw[i]; }
    st /= n; sw /= n;
    let a = 0, b = 0;
    for (let i = 0; i < n; i++) { const d = pt[i] - st; a += d * (pw[i] - sw); b += d * d; }
    return b > 0 ? a / b : 0;
  }

  // By the world's time: a frame is drawn at `now`. One with no packet
  // since the frame before is counted (with the packet it follows).
  // Returns the display's time for it.
  _drawn(now) {
    const t = this.beat > 0 ? this.beat : now;
    if (!this._fresh && this._pn > 0) {
      const i = this._pn - 1;
      this._missAt[0] = this._missAt[1]; this._missT[0] = this._missT[1]; this._missW[0] = this._missW[1];
      this._missAt[1] = t; this._missT[1] = this._pt[i]; this._missW[1] = this._pw[i];
    }
    this._fresh = false;
    return t;
  }

  // By the world's time: the picture's own time on by what the pace makes
  // of the time since it was last drawn. Returns how far that is between
  // where this journey began and the newest packet, 0..1.
  _along(now, frameMs) {
    const t = this.beat > 0 ? this.beat : now;
    const since = this._drawnAt > 0 ? Math.min(Math.max(t - this._drawnAt, 0), 4 * frameMs) : frameMs;
    this._drawnAt = t;
    const span = this._wTo - this._wFrom;
    // (Never slower than a journey of half a second: LONGEST.)
    this._wd = Math.min(this._wTo, this._wd + Math.max(Math.min(this._rho * this._hurry + this._more, this._rho * FASTEST), span / LONGEST) * since);
    return span > 1e-6 ? Math.min(1, Math.max(0, (this._wd - this._wFrom) / span)) : 1;
  }

  // The frame is about to be drawn. Returns how far along it is, 0..1.
  apply(frame, now, frameMs) {
    const shown = this._camShown;
    if (!this.moving) {
      // (As the packet has it: remembered, for the next journey to start from.)
      shown.set(this._camTo);
      this._camKnown = true;
      this.u = 1;
      if (this.even) {
        this._drawnAt = this._drawn(now);
        // (At the newest packet; and if it had been travelling there, this
        // frame is one in which it stood.)
        if (this._late) { this._wd = this._wTo; if (this._there && !this._closing) this._stood = true; }
      }
      return 1;
    }
    if (this.even) this._drawn(now);
    // A frame is drawn for the moment it will be seen at: one frame on.
    const u = this.even ? this._along(now, frameMs) : Math.min(1, (now - this._at + frameMs) / this._over), v = 1 - u;
    const f32 = frame.f32, xp = frame.out[OUT.XF_PTR] >> 2, a = this._from, b = this._to, ids = this._ids;
    for (let i = 0; i < this._count; i++) {
      const o = ids[i] * XF_STRIDE, p = xp + o;
      if (u >= 1) {
        for (let k = 0; k < 7; k++) f32[p + k] = b[o + k];
        continue;
      }
      const q0 = a[o] * v + b[o] * u, q1 = a[o + 1] * v + b[o + 1] * u, q2 = a[o + 2] * v + b[o + 2] * u, q3 = a[o + 3] * v + b[o + 3] * u;
      const l = 1 / Math.sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3 || 1);
      f32[p] = q0 * l; f32[p + 1] = q1 * l; f32[p + 2] = q2 * l; f32[p + 3] = q3 * l;
      f32[p + 4] = a[o + 4] * v + b[o + 4] * u;
      f32[p + 5] = a[o + 5] * v + b[o + 5] * u;
      f32[p + 6] = a[o + 6] * v + b[o + 6] * u;
    }
    if (this._camMoves) {
      const from = this._camFrom, to = this._camTo;
      frame.camPrev.set(from);
      frame.camCur.set(to);
      frame.alpha = u;
      shown[0] = from[0] * v + to[0] * u; shown[1] = from[1] * v + to[1] * u; shown[2] = from[2] * v + to[2] * u;
    } else {
      shown.set(this._camTo);
    }
    this._camKnown = true;
    this.u = u;
    if (u >= 1) { this.moving = false; this._there = true; }
    return u;
  }
}
