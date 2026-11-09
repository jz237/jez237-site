// The VR rig: where the player's room sits in the world.
//
// The engine's player stays the body: a box that walks, falls, is pushed
// and rides. The room (the XR reference space) is carried along with it, so
// everything that moves the body moves the view, and the head moves inside
// the room one to one, always, whatever the simulation is doing.
//
// Walking about the real room takes the head away from the body. Up to
// FOLLOW_AT nothing happens (leaning, looking round a corner). Beyond it the
// body is walked after the head by ordinary movement input, so it collides
// with the world on the way like any other walking, and the part of its
// motion that closes the gap is not passed on to the room: the body catches
// up under a head that stays put. A body that cannot follow (a wall in the
// way) holds the head on a leash of LEASH metres: past that the room is
// pulled back, which the player sees as the world coming along with them.
// Fading to black instead was the alternative; it would hide the scene
// exactly when something in it has the player pinned.
export const FOLLOW_AT = 0.3;     // head this far from the body's axis: the body follows (m)
export const FOLLOW_KEEP = 0.25;  // and stops closing in at this distance
export const FOLLOW_GAIN = 6;     // follow speed, as a share of walking speed per metre beyond that
export const LEASH = 0.75;
// The body moved further than this between two frames: it was put
// somewhere (respawn, restart), and the room goes with it whole.
const TELEPORT = 2;
// After the body has caught up it coasts to a stop: for this long (s) its
// motion is still its own business, not the room's.
const SETTLE = 0.6;
// Faster than following ever walks (m/s): something else moved the body.
const THROWN = 5.5;

// Which way a pose faces about the vertical, from its matrix. Taken from
// the axis that points to its right, which stays level when the head looks
// up or down (past straight up, the forward axis would point backwards).
export function facing(m) {
  return Math.atan2(-m[2], m[0]);
}

export class Rig {
  constructor() {
    this.x = 0; this.z = 0;       // the room's origin in the world (m)
    this.yaw = 0;                 // the room's turn about the vertical
    this.lift = 0;                // added to heights (seated mode, no floor known)
    this.placed = false;
    this.following = false;
    this.offX = 0; this.offZ = 0; // head relative to the body's axis, world (m)
    this.m = new Float32Array(16);
    this.m[5] = this.m[15] = 1;
    this._fx = NaN; this._fz = NaN;
    this.settle = 0;              // seconds of coasting still to be absorbed
    this.pulled = 0;              // metres the leash has pulled the room in all
  }

  // A point of the room in the world (horizontal part).
  wx(px, pz) { return this.x + Math.cos(this.yaw) * px + Math.sin(this.yaw) * pz; }
  wz(px, pz) { return this.z - Math.sin(this.yaw) * px + Math.cos(this.yaw) * pz; }

  // Stand the head (hx, hz in the room, facing headYaw there) over the body
  // at (fx, fz), looking the way the flat game looked.
  place(fx, fz, hx, hz, lookYaw, headYaw) {
    this.yaw = lookYaw - headYaw;
    this.x = 0; this.z = 0;
    const wx = this.wx(hx, hz), wz = this.wz(hx, hz);
    this.x = fx - wx;
    this.z = fz - wz;
    this._fx = fx; this._fz = fz;
    this.offX = this.offZ = 0;
    this.following = false;
    this.placed = true;
  }

  // Turn the room by `angle` about the head, which stays where it is.
  turn(angle, hx, hz) {
    const wx = this.wx(hx, hz), wz = this.wz(hx, hz);
    this.yaw += angle;
    this.x += wx - this.wx(hx, hz);
    this.z += wz - this.wz(hx, hz);
  }

  // The headset re-centred its space (or lost and found its tracking): the
  // head that was at (px, pz) facing pyaw in the room is now reported at
  // (nx, nz) facing nyaw without having moved. The room is turned and
  // shifted so that it has not moved in the world either.
  rebase(px, pz, pyaw, nx, nz, nyaw) {
    const wx = this.wx(px, pz), wz = this.wz(px, pz);
    this.yaw += pyaw - nyaw;
    this.x += wx - this.wx(nx, nz);
    this.z += wz - this.wz(nx, nz);
  }

  // Head relative to a body at (fx, fz); also decides whether the body
  // should be following. Returns the distance.
  offset(fx, fz, hx, hz) {
    this.offX = this.wx(hx, hz) - fx;
    this.offZ = this.wz(hx, hz) - fz;
    const len = Math.hypot(this.offX, this.offZ);
    if (len > FOLLOW_AT) this.following = true;
    else if (len < FOLLOW_KEEP + 0.02) this.following = false;
    return len;
  }

  // The body as drawn this frame stands at (fx, fz): bring the room along.
  // dt: seconds since the last frame. idle: nothing but following is
  // moving the body (no stick, feet on the ground, not riding anything).
  carry(fx, fz, hx, hz, dt, idle) {
    let mx = fx - this._fx, mz = fz - this._fz;
    this._fx = fx; this._fz = fz;
    if (!(Math.abs(mx) + Math.abs(mz) < 1e6)) return;
    if (this.following) this.settle = SETTLE;
    else if (this.settle > 0) this.settle -= dt;
    const moved = Math.hypot(mx, mz);
    if ((this.following || this.settle > 0) && moved < TELEPORT) {
      if (idle && moved < THROWN * Math.max(dt, 1e-3)) {
        // All of it is the body walking after the head, or coasting to a
        // stop once it got there: none of it is the room's.
        mx = 0;
        mz = 0;
      } else {
        // Something else moves the body as well (the stick, a fall, a
        // push): only what closes the gap to the head is taken out.
        const ox = this.wx(hx, hz) - (fx - mx), oz = this.wz(hx, hz) - (fz - mz), len = Math.hypot(ox, oz);
        const room = this.following ? len - FOLLOW_KEEP : len;
        if (room > 0) {
          const ux = ox / len, uz = oz / len;
          const closing = Math.max(0, Math.min(mx * ux + mz * uz, room));
          mx -= ux * closing;
          mz -= uz * closing;
        }
      }
    }
    this.x += mx;
    this.z += mz;
    const ox = this.wx(hx, hz) - fx, oz = this.wz(hx, hz) - fz, len = Math.hypot(ox, oz);
    if (len > LEASH) {
      const k = (len - LEASH) / len;
      this.x -= ox * k;
      this.z -= oz * k;
      this.pulled += len - LEASH;
    }
  }

  // room -> world, with the room's floor at height y.
  matrix(y) {
    const m = this.m, c = Math.cos(this.yaw), s = Math.sin(this.yaw);
    m[0] = c; m[2] = -s;
    m[8] = s; m[10] = c;
    m[12] = this.x; m[13] = y + this.lift; m[14] = this.z;
    return m;
  }
}

// How tall the player stands in the game. A headset says where its floor
// is, or says nothing (a 'local' space: the head starts near the origin),
// or says something no person fits: nobody has seen what each device hands
// back, so what it says is checked against what a body can be. The head's
// height over the device's floor is taken over the first tracked frames
// (their median: a headset still being put on reads anything). If the
// device has a floor and that height is one a standing person has, the
// floor is believed: the game's ground is the real floor and the player is
// as tall as they are. Otherwise (seated, no floor, a floor at the knees)
// the player is lifted so that the eyes are at a standing person's height
// over the game's ground where the head is now, and from there the head
// moves freely; a player raised for sitting who then stands up on a floor
// the device knows gets their own height. `rise` is the player's own
// correction on top, kept by the page. `stand()` takes the head's place now as standing height, whatever
// the device says of its floor.
export const EYE = 1.65;              // a standing person's eyes over the ground (m)
export const STAND_LOW = 1.35, STAND_HIGH = 2.1;   // head heights over a floor that a standing person has
const MEASURE = 30;                   // tracked frames the height is taken over

export class Stature {
  constructor() {
    this.samples = new Float32Array(MEASURE);
    this.sorted = new Float32Array(MEASURE);
    this.forced = false;        // stand(): lifted whatever the floor says
    this.believed = false;      // the device's floor is the game's ground
    this.base = 0;              // the lift before the player's own correction (m)
    this.measured = NaN;        // the head's height in the device's space when it was decided (m)
    this.again();
  }

  // Measure afresh (a session's start, a headset put back on, a re-centred
  // space when the player was lifted).
  again() {
    this.n = 0;
    this.up = 0;
    this.decided = false;
  }

  // "This is my standing height": the eyes at a person's height here.
  stand() {
    this.forced = true;
    this.again();
  }

  // y: the head's height in the device's space this frame; floor: the
  // space has one; lifted: the player asked for it (the seated option).
  // Returns the lift for this frame, without the player's correction.
  feed(y, floor, lifted) {
    if (this.decided) {
      // Raised because they sat, and now they stand on a floor the device
      // knows: the height is taken again (and comes out their own).
      if (!this.believed && floor && !lifted && !this.forced && y >= STAND_LOW + 0.1 && y <= STAND_HIGH) {
        if (++this.up >= 45) this.again();
      } else this.up = 0;
      return this.base;
    }
    this.samples[this.n++] = y;
    const s = this.sorted.subarray(0, this.n);
    s.set(this.samples.subarray(0, this.n));
    s.sort();
    const h = s[this.n >> 1];
    this.measured = h;
    this.believed = floor && !lifted && !this.forced && h >= STAND_LOW && h <= STAND_HIGH;
    this.base = this.believed ? 0 : EYE - h;
    if (this.n === MEASURE) this.decided = true;
    return this.base;
  }

  // The device's space jumped by dy under a head that did not move.
  shift(dy) {
    if (!this.believed) this.base += dy;
  }
}

// Evidence that the headset is not holding its refresh rate because of the
// picture. A frame is due as many display periods after the one before as
// that one's own work on the main thread needed (one, for a frame that took
// 5 ms; two, for one whose simulation took 20): one that arrives later
// than that was held up by something else, which is the drawing. Frames
// that are late only because the main thread was busy say nothing about
// the picture, and a cheaper picture would not help them.
const SLOWEST_HEADSET = 1000 / 72;
// The gap after a pause (the headset taken off, its own menu up) is not a
// frame; anything shorter is one, however slow: a headset at three frames
// a second is the one that needs the cheaper picture most.
export const PAUSE_MS = 2000;
// The start of a session is its own case. A headset that cannot draw its
// first picture at ten frames a second is making its wearer ill from the
// first second, and the rule below would take a quarter of a minute over
// each step at that pace. So: the first second is left out (the picture is
// being set up in it); if every frame of the second after it (three at
// least) is slower than a tenth of a second and later than its own work
// explains, the session goes straight to its cheap picture (`CRAWL`), two
// seconds in. One frame that keeps up ends the case: an ordinary session,
// judged as below.
const START_SKIP_MS = 1000, START_MS = 2000, CRAWL_MS = 100;
// What `frame` answers: nothing to do, one step down, or the start's case.
export const STEP = 1, CRAWL = 2;

export class Pace {
  constructor() {
    this.period = 0;
    this.fast = 0; this.fastSum = 0;
    this.age = 0;      // ms of frames since the session's first that was judged
    this.crawl = 0;    // crawling frames in a row after the first second; -1: the start is over
    this.reset();
  }

  // After a change of picture a second and a half (or 90 frames) are left
  // out; then every four seconds (or 240 frames) are judged. By the clock
  // as well as by the count: a headset at 15 frames a second must not wait
  // a quarter of a minute for each step. (Four seconds of at least forty
  // frames: a few slow ones while a world loads are not a slow headset.)
  reset() {
    this.frames = 0;
    this.late = 0;
    this.span = 0;
    this.settle = 90;
    this.settleMs = 1500;
  }

  // The display's period where the session does not say its rate: the
  // cadence the frames come at when they come fastest, taken from a run of
  // them (one short interval is jitter, not a faster display), and never
  // slower than 72 Hz, the slowest headsets run at.
  _learn(interval) {
    if (!this.period) this.period = Math.min(interval, SLOWEST_HEADSET);
    if (interval < this.period * 0.85) {
      this.fast++;
      this.fastSum += interval;
      if (this.fast >= 6) { this.period = this.fastSum / this.fast; this.fast = this.fastSum = 0; }
    } else {
      this.fast = this.fastSum = 0;
      // Frames on the beat refine it.
      if (interval < this.period * 1.15) this.period += (interval - this.period) * 0.02;
    }
    if (this.period > SLOWEST_HEADSET) this.period = SLOWEST_HEADSET;
  }

  // interval: ms between the previous frame and this one; busy: ms of JS
  // the previous frame took; rate: the session's frame rate if it says.
  // STEP when the last few seconds call for a cheaper picture, CRAWL when
  // the session's start does (above), else 0.
  frame(interval, busy, rate) {
    if (!(interval > 0 && interval < PAUSE_MS)) return 0;
    if (rate > 0) this.period = 1000 / rate;
    else this._learn(interval);
    const due = Math.max(1, Math.ceil(busy / this.period));
    const late = interval > (due + 0.5) * this.period;
    if (this.crawl >= 0) {
      this.age += interval;
      if (this.age > START_SKIP_MS) {
        if (!(late && interval > CRAWL_MS)) this.crawl = -1;
        else if (++this.crawl >= 3 && this.age >= START_MS) { this.crawl = -1; return CRAWL; }
      }
    }
    if (this.settle > 0 && this.settleMs > 0) { this.settle--; this.settleMs -= interval; return 0; }
    this.frames++;
    this.span += interval;
    if (late) this.late++;
    if (this.frames < 240 && !(this.span >= 4000 && this.frames >= 40)) return 0;
    const down = this.late > this.frames * 0.25;
    this.frames = this.late = this.span = 0;
    return down ? STEP : 0;
  }
}
