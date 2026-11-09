// VR with nothing held: the game's intents from hands alone. A headset
// without controllers gives a page one or both of two things:
//   - sources with `hand` (the joints; needs the 'hand-tracking' feature
//     and the player's yes), which are there for as long as the hand is seen;
//   - sources with targetRayMode 'transient-pointer' (what a Vision Pro
//     gives a page without joints, and with them too): one exists only while
//     the fingers are pinched, its ray from between the eyes to where the
//     player looked when the pinch began, its grip where the fingers are.
// Either kind announces its primary action on the session: `selectstart`
// when the pinch closes, `selectend` when it opens. A pinch, which hand
// made it and where that hand is are all the game needs to be played:
//   the tool hand's pinch is the trigger, aimed along its source's ray;
//   the other hand's pinch, held, is a stick: where the hand goes from
//     where the pinch began is where the body goes, further is faster,
//     further still runs; far out to one side is a turn instead;
//   the other hand's pinch, short and still, is a jump;
//   a pinch that begins on a tile of the belt (xr_hands_belt.js) chooses
//     that tile: the tools, the second button, turning, pause, leaving,
//     the player's height and the picture's sharpness.
// With joints as well: the hands are drawn, thumb to middle finger of the
// tool hand is the second button, and the belt comes to the open palm of
// the other hand when it faces the eyes, where a tile is touched with the
// tool hand's index finger.
//
// xr_input.js hands a frame's sources to this file when none of them is a
// controller, and gets the same intents back that controllers give it.
// Nothing here has been tried on a headset: see docs/reports/vr_hands.md.
import { BUTTON, VIEW_FX } from './engine.js';
import { BELT, TILES, tileAt, helpLines, facePoint, palmOf } from './xr_hands_belt.js';

// Which of this file's heads a build carries, for the line the player can
// read out from inside the headset (the commit comes from web/build.json,
// which whoever publishes writes; a build without one says so).
export const HANDS_HEAD = 'hands C6';

// The walking hand, metres from where its pinch began: nothing under DEAD,
// full speed at FULL, running past RUN (and until back inside RUN_OFF);
// TURN out to one side is a turn, armed again inside TURN_OFF.
export const WALK = { DEAD: 0.02, FULL: 0.09, RUN: 0.15, RUN_OFF: 0.12, TURN: 0.13, TURN_OFF: 0.09 };
// A pinch of the walking hand this short (milliseconds) that moved less
// than this (metres) is a jump, held for this many frames.
const TAP_MS = 350, TAP_MOVE = 0.03, JUMP_FRAMES = 4;
// Fingers not seen for GONE frames hold nothing until they are seen
// again; a hand that announced its own pinch and is not seen for BLIND
// frames has let go, whatever it has not said.
const GONE = 20, BLIND = 45;
// Milliseconds: no sign or belt in the first of a session (its controllers
// may only be waking up); the belt is hung again after the head has faced
// away from it this long; a smooth turn asked for by a tile lasts this
// long; the status lines on the boards are brought up to date this often
// (each time is a picture to paint and send); a first pinch on Leave VR
// waits this long for the second.
const WAKE_MS = 1200, AWAY_MS = 500, TURN_MS = 240, STATUS_MS = 2500, SETTLE_MS = 5000, LEAVE_MS = 4000;
// Thumb tip to finger tip, metres: closed under ON, open again past OFF,
// and closed for this many frames before it counts (tracking noise).
const PINCH_ON = 0.015, PINCH_OFF = 0.025, PINCH_FRAMES = 2;
// The joints this file reads, by their place in a hand's list of 25.
const J = { WRIST: 0, THUMB_TIP: 4, INDEX_TIP: 9, MIDDLE_TIP: 14 };
// A fingertip this near the board's face touches it; it must come back
// this far out before it can touch again.
const TOUCH = 0.012, TOUCH_OFF = 0.035;

const hand = () => ({ on: false, p: new Float32Array(75), pinch: 0, idx: false, mid: false, idxN: 0, midN: 0, near: 0 });
// What the overlay draws for the hands (xr_overlay.js reads this; one VR
// session at a time, so one of these). Positions are the room's.
export const shared = {
  active: false,      // the hands are the input this frame
  bare: false,        // the tool's ray starts between the eyes: no model is drawn on it
  fault: false,       // the overlay could not draw the hands' boards (it says so)
  build: '',
  head: new Float32Array(16),   // the head in the room this frame
  headOk: false,
  // The sign in front of the player: { title, lines: [[who, what]], foot }
  // or null. `key` changes when what it says does.
  sign: null,
  // The walking stick while it is held: where the pinch began, where the
  // hand is, and whether it runs or turns.
  stick: { on: false, from: [0, 0, 0], at: [0, 0, 0], run: false, turn: 0 },
  // The joints of each hand (25 points) and which pinch the game takes it
  // to be making: 0 none, 1 thumb to index, 2 thumb to middle.
  joints: { left: hand(), right: hand() },
  // The belt: its middle, the directions along it and up it, its size, and
  // what is on it (xr_hands_belt.js: paintBelt).
  belt: { on: false, palm: false, c: [0, 0, 0], r: [1, 0, 0], u: [0, 1, 0], n: [0, 0, 1], w: BELT.HOME[0], h: BELT.HOME[1], tool: 0, allowed: -1, paused: false, note: '', card: false, lit: -1, hand: 'right', leave: false, status: ['', '', ''], build: '' },
};

let asked = false;
function askBuild() {
  if (asked) return;
  asked = true;
  shared.build = `${HANDS_HEAD}, build not stamped`;
  try {
    fetch(new URL('../build.json', import.meta.url), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => { if (b && typeof b.commit === 'string') shared.build = `build ${b.commit.slice(0, 12)} ${HANDS_HEAD}`; })
      .catch(() => {});
  } catch (e) { /* no fetch here: the line says so */ }
}

// A controller is read through its gamepad (xr_input.js). Everything else
// that can select is a hand of one kind or the other.
export const isController = (s) => !s.hand && s.targetRayMode === 'tracked-pointer';
const isTransient = (s) => s.targetRayMode === 'transient-pointer';
const isHand = (s) => !isController(s) && (isTransient(s) || !!s.hand);
const finite = (m) => { for (let i = 0; i < 16; i++) if (!Number.isFinite(m[i])) return false; return true; };
// A space's pose as a matrix, or null: not to be had, not finite, or the
// browser threw (a space whose source has just gone).
function poseOf(frame, sp, space) {
  try {
    const pose = frame.getPose(sp, space);
    return pose && finite(pose.transform.matrix) ? pose.transform.matrix : null;
  } catch (e) {
    return null;
  }
}
const gap = (p, a, b) => Math.hypot(p[a * 3] - p[b * 3], p[a * 3 + 1] - p[b * 3 + 1], p[a * 3 + 2] - p[b * 3 + 2]);

// One hand's pinch, from whichever of its sources announce it.
class Pinch {
  constructor() {
    this.selecting = [];    // sources of this hand between selectstart and selectend
    this.starts = 0;        // selectstarts since the last frame was read
    this.ends = 0;
    this.down = false;      // as the last frame had it
    this.press = false;     // went down this frame (or closed and opened before it)
    this.tap = false;       // closed and opened between two frames
    this.lift = false;      // went up this frame
    this.frames = 0;        // frames it has been down
    this.since = 0;         // when it went down (ms)
    this.blind = 0;         // frames in a row its fingers were not seen while down
    this.gone = false;      // not seen for too long: it holds nothing until seen again
    this.stale = false;     // found closed after nothing was held: not a press
    this.renew = false;     // a new pinch closed since the last frame, which saw the one before
    this.byJoints = false;  // taken from the fingers' distance alone
    this.rx0 = 1; this.rz0 = 0;   // the head's right-hand axis, level, when it closed
    this.from = [0, 0, 0];  // the fingers when it closed (room)
    this.at = [0, 0, 0];    // the fingers now
    this.known = false;     // from and at are known
    this.src = null;        // the source they were last read from
    this.far = 0;           // furthest the fingers went from where it closed
    this.ro = [0, 0, 0];    // the ray it began with: from, along
    this.rd = [0, 0, -1];
    this.rayOk = false;
    this.m = new Float32Array(16);   // that ray's pose and its grip's, as the source gave them
    this.g = new Float32Array(16);
    this.bare = false;      // the ray starts between the eyes (a transient source's)
    this.mute = false;      // it took the sign down or chose a tile: it does nothing else
    this.middle = false;    // the joints say it is thumb to middle finger
  }

  reset() {
    this.selecting.length = 0;
    this.starts = this.ends = this.frames = this.blind = 0;
    this.down = this.press = this.tap = this.lift = this.known = this.rayOk = this.mute = this.middle = false;
    this.gone = this.renew = this.byJoints = false;
    this.stale = true;
    this.src = null;
  }
}

export class Hands {
  constructor() {
    this.vr = null;             // the session object of xr.js, when it has said who it is
    this.now = 0;               // this frame's time (ms)
    this.faults = 0;            // frames that could not be read
    this.session = null;
    this.space = null;
    this.toolHand = 'right';
    this.pinch = { left: new Pinch(), right: new Pinch() };
    this.sides = new WeakMap(); // which hand a source that does not say is taken for
    this.pending = [];          // events of sources whose hand could not be told yet: source, start
    this.lat = { left: -0.12, right: 0.12 };   // where each hand last pinched, metres to the right of the head's middle
    this.spaces = new WeakMap();// a hand source's 25 joint spaces
    this._mats = new Float32Array(25 * 16);
    this._cur = { left: { transient: null, hand: null }, right: { transient: null, hand: null } };
    this.ray = new Float32Array(16);
    this.grip = new Float32Array(16);
    this.has = false;           // a ray has been seen in this session
    this.fresh = false;         // the ray is this frame's
    this.begun = false;         // the player has pinched once: the sign is down
    this.help = false;          // the sign was asked for (the Help tile)
    this.t0 = 0;                // when the hands became the input (ms)
    this.signWas = false;       // the sign was up last frame
    this.awayAt = 0;            // since when the head has faced away from the belt (ms; 0: it has not)
    this.snapUntil = 0;         // a smooth turn asked for by a tile lasts until then (ms)
    this.statusAt = 0;          // when the boards' status lines were last brought up to date (ms)
    this.leaveBy = 0;           // a second pinch on Leave VR before then leaves (ms)
    this.cardLabel = ''; this.cardNote = '';   // the lit button of the card that is up, and the line that says so
    this.seen = false;          // a hand of either kind has been there
    this.eyes = false;          // this headset aims by where the eyes look (transient sources)
    this.announced = false;     // a pinch has been announced by a select event or a transient source
    this.turn = 0;              // the walking hand is out to one side: -1, 0, 1
    this.run = false;
    this.jump = 0;              // frames of jump still to hold
    this.alt = 0;               // frames of the second button still to hold (its tile)
    this.altWas = false;
    this.snap = 0; this.snapFor = 0;   // a turn asked for by a tile, and frames of it left
    this.leaving = 0;           // frames the pause button has been held to leave VR
    this.palm = false;          // the other hand's open palm faces the eyes
    this.palmN = 0;
    this.hung = false;          // the belt has a place low in front
    this.hungAt = [0, 0, 0];    // the head when it was hung there
    this.touching = true;       // the finger must be seen away from the board's face before it can touch it
    this.lit = -1; this.litFor = 0;
    this._start = (ev) => this._select(ev, true);
    this._end = (ev) => this._select(ev, false);
  }

  // The session object of xr.js: the game's mode and tool, the player's
  // height and the picture's sharpness are reached through it. xr.js may
  // say who it is (`input.hands.vr = this`); the page's own handle on it
  // does where it has not.
  _vr() {
    if (this.vr) return this.vr;
    const vx = globalThis.__vx;
    return vx && vx.ctx && vx.ctx.xr ? vx.ctx.xr : null;
  }

  attach(session) {
    if (this.session === session) return;
    this.detach();
    this.session = session;
    session.addEventListener('selectstart', this._start);
    session.addEventListener('selectend', this._end);
    shared.fault = false;
    askBuild();
  }

  detach() {
    const s = this.session;
    if (!s) return;
    s.removeEventListener('selectstart', this._start);
    s.removeEventListener('selectend', this._end);
    this.session = null;
    this.idle();
  }

  // Which hand a source is. One that does not say (a headset may not) is
  // decided once, when its fingers are first seen: the hand whose joints
  // they are at, if joints are seen; else the hand whose own pinch is not
  // down already; else the hand whose last pinch was nearer, side to side
  // of the head (12 cm either side of the middle to begin with), so hands
  // that lie in the lap near the middle keep their sides from pinch to
  // pinch for as long as neither moves, between two of its pinches, more
  // than half way to where the other last was. '' when it cannot be said
  // yet (no pose) and `last` is not set; with `last`, the hand that is not
  // pinching, or the tool's.
  _side(s, frame, space, last) {
    if (s.handedness === 'left' || s.handedness === 'right') return s.handedness;
    let side = this.sides.get(s);
    if (side) return side;
    const L = this.pinch.left.down, R = this.pinch.right.down;
    const m = frame && space && s.gripSpace ? poseOf(frame, s.gripSpace, space) : null;
    if (m && shared.headOk) {
      const h = shared.head, lat = this.lat;
      const x = (m[12] - h[12]) * h[0] + (m[13] - h[13]) * h[1] + (m[14] - h[14]) * h[2];
      const jl = shared.joints.left, jr = shared.joints.right, t = J.THUMB_TIP * 3;
      const dl = jl.on ? Math.hypot(m[12] - jl.p[t], m[13] - jl.p[t + 1], m[14] - jl.p[t + 2]) : Infinity;
      const dr = jr.on ? Math.hypot(m[12] - jr.p[t], m[13] - jr.p[t + 1], m[14] - jr.p[t + 2]) : Infinity;
      if (Math.min(dl, dr) < 0.12) side = dl < dr ? 'left' : 'right';
      else if (L !== R) side = L ? 'right' : 'left';
      else side = Math.abs(x - lat.left) < Math.abs(x - lat.right) ? 'left' : 'right';
      lat[side] = x;
      // (Never crossed: the left hand's place stays left of the right's.)
      if (lat.left > lat.right - 0.04) { const mid = (lat.left + lat.right) / 2; lat.left = mid - 0.02; lat.right = mid + 0.02; }
    } else if (!last) return '';
    else side = L !== R ? (L ? 'right' : 'left') : this.toolHand;
    this.sides.set(s, side);
    return side;
  }

  _select(ev, start) {
    const s = ev.inputSource;
    if (s && isHand(s)) this._event(s, start, ev.frame || null, false);
  }

  // A pinch closed (start) or opened. `last`: the frame's own reading of
  // what the events could not place.
  _event(s, start, frame, last) {
    const side = this._side(s, frame, this.space, last);
    // A source whose hand cannot be told yet waits for the next frame.
    if (!side) { this.pending.push(s, start); return; }
    const p = this.pinch[side], i = p.selecting.indexOf(s);
    if (start) {
      // A new pinch, not a second source saying the same one: none of this
      // hand's sources was selecting.
      const fresh = p.selecting.length === 0 && (!p.down || p.ends > 0);
      if (i < 0) p.selecting.push(s);
      p.starts++;
      this.announced = true;
      if (isTransient(s)) this.eyes = true;
      if (fresh) {
        // (Since the last frame, which saw the pinch before it closed.)
        p.renew = p.down;
        p.known = p.rayOk = false;
        // A pinch can open again before the next frame comes: the event's
        // own frame says where it pointed and where the fingers were.
        if (frame && this.space) {
          this._fingers(frame, this.space, s, p, true);
          this._ray(frame, this.space, s, p);
        }
      }
    } else {
      if (i >= 0) p.selecting.splice(i, 1);
      p.ends++;
      if (!last && p.selecting.length === 0) this._release(p);
    }
  }

  // A pinch has opened, between two frames. The next frame will read it
  // open; until then the engine would go on with what the last frame
  // said (the trigger held, the body walking), which at a headset's rate
  // is a hundredth of a second and at ten pictures a second is most of a
  // metre. So the engine is told now: the input xr_play.js last gave it
  // (`vr.given`), with this hand's part taken out. The press bits are not
  // sent again (they have been), and where the simulation runs on another
  // thread it is told at once.
  _release(p) {
    if (!p.down || p.mute || p.gone) return;
    const vr = this._vr(), g = vr ? vr.given : null, host = vr ? vr.host : null, game = vr && vr.ctx ? vr.ctx.game : null;
    if (!g || !host || !game || game.mode !== 'play' || typeof host.input !== 'function') return;
    try {
      if (p === this.pinch[this.toolHand]) g[4] &= ~(p.middle ? BUTTON.SECONDARY : BUTTON.PRIMARY);
      else { g[0] = g[1] = 0; g[4] &= ~BUTTON.SPRINT; }
      g[5] = 0;
      host.input(g[0], g[1], g[2], g[3], g[4], 0, g[6]);
      const sim = vr.ctx.sim;
      if (sim && typeof sim.tell === 'function') sim.tell();
    } catch (e) {
      if (!this.faults++) console.warn('VR hands: a release could not be told at once:', e);
    }
  }

  // The ray and the grip of one source into this.ray / this.grip.
  _pose(frame, space, s) {
    const ray = s.targetRaySpace ? poseOf(frame, s.targetRaySpace, space) : null;
    if (!ray) return false;
    this.ray.set(ray);
    const grip = s.gripSpace ? poseOf(frame, s.gripSpace, space) : null;
    this.grip.set(grip || this.ray);
    this.has = true;
    this.fresh = true;
    shared.bare = isTransient(s);
    return true;
  }

  // Where the fingers of a pinch are (the grip of its source), into p.
  // False when they are not to be had.
  _fingers(frame, space, s, p, first) {
    const m = s.gripSpace ? poseOf(frame, s.gripSpace, space) : null;
    if (!m) return false;
    const a = p.at, f = p.from;
    if (first || !p.known) {
      f[0] = m[12]; f[1] = m[13]; f[2] = m[14];
      p.known = true;
      p.far = 0;
    } else if (s !== p.src) {
      // Another source of the same pinch (a hand and its transient source):
      // its grip is not the same point of the hand. The way gone so far is
      // carried over, or the change of source would be a step of the stick.
      f[0] = m[12] - (a[0] - f[0]); f[1] = m[13] - (a[1] - f[1]); f[2] = m[14] - (a[2] - f[2]);
    }
    p.src = s;
    a[0] = m[12]; a[1] = m[13]; a[2] = m[14];
    p.far = Math.max(p.far, Math.hypot(a[0] - f[0], a[1] - f[1], a[2] - f[2]));
    return true;
  }

  // The ray a pinch begins with, for choosing a tile by it and for a shot
  // whose source is gone before a frame comes: a transient source's (the
  // eyes'), or a hand's own where the headset has no other.
  _ray(frame, space, s, p) {
    if (!isTransient(s) && this.eyes) return;
    const m = s.targetRaySpace ? poseOf(frame, s.targetRaySpace, space) : null;
    if (!m) return;
    p.ro[0] = m[12]; p.ro[1] = m[13]; p.ro[2] = m[14];
    p.rd[0] = -m[8]; p.rd[1] = -m[9]; p.rd[2] = -m[10];
    p.m.set(m);
    const grip = s.gripSpace ? poseOf(frame, s.gripSpace, space) : null;
    p.g.set(grip || p.m);
    p.bare = isTransient(s);
    p.rayOk = true;
  }

  // The 25 joints of one hand into j.p, and the two pinches its fingers
  // show. j.on: the whole hand is seen this frame.
  _joints(frame, space, s, j) {
    j.on = false;
    if (s && s.hand) {
      let spaces = this.spaces.get(s);
      if (!spaces) {
        try { spaces = Array.from(s.hand.values()); } catch (e) { spaces = []; }
        this.spaces.set(s, spaces);
      }
      const m = this._mats;
      let ok = spaces.length >= 25;
      try {
        if (!ok) { /* not a hand this file knows */ } else if (frame.fillPoses) ok = frame.fillPoses(spaces, space, m);
        else if (frame.getJointPose) {
          for (let i = 0; i < 25 && ok; i++) {
            const pose = frame.getJointPose(spaces[i], space);
            if (pose) m.set(pose.transform.matrix, i * 16); else ok = false;
          }
        } else ok = false;
      } catch (e) { ok = false; }
      for (let i = 0; i < 25 && ok; i++) {
        const x = m[i * 16 + 12], y = m[i * 16 + 13], z = m[i * 16 + 14];
        if (!Number.isFinite(x + y + z)) ok = false;
        j.p[i * 3] = x; j.p[i * 3 + 1] = y; j.p[i * 3 + 2] = z;
      }
      j.on = ok;
    }
    if (!j.on) { j.idx = j.mid = false; j.idxN = j.midN = j.near = 0; return; }
    const di = gap(j.p, J.THUMB_TIP, J.INDEX_TIP), dm = gap(j.p, J.THUMB_TIP, J.MIDDLE_TIP);
    // Which finger is clearly the nearer to the thumb: 1 index, 2 middle.
    j.near = di < dm - 0.01 ? 1 : dm < di - 0.01 ? 2 : 0;
    j.idxN = di < PINCH_ON || (j.idx && di < PINCH_OFF) ? j.idxN + 1 : 0;
    j.midN = (dm < PINCH_ON || (j.mid && dm < PINCH_OFF)) && j.near === 2 ? j.midN + 1 : 0;
    j.idx = j.idxN >= PINCH_FRAMES;
    j.mid = j.midN >= PINCH_FRAMES;
  }

  // One hand's pinch brought up to this frame: is it down, did it go down
  // or up, where are its fingers. `c` is that hand's sources this frame,
  // `j` its joints.
  _level(p, c, j, frame, space, sources) {
    // A source that has gone without a selectend is not selecting.
    for (let i = p.selecting.length - 1; i >= 0 && p.starts === 0 && p.ends === 0; i--) {
      let there = false;
      for (let k = 0; k < sources.length; k++) if (sources[k] === p.selecting[i]) there = true;
      if (!there) p.selecting.splice(i, 1);
    }
    if (c.transient) this.eyes = this.announced = true;
    // Both kinds of source may announce one pinch (joints and a transient
    // source): the pinch is down while any of them says so, and a press is
    // the moment it goes down, so one pinch is one press. Where nothing has
    // ever announced a pinch (joints and no events), the fingers' own
    // distance does; a pinch taken that way stays so until they open.
    const byJoints = j.idx && (!this.announced || p.byJoints);
    const down = p.selecting.length > 0 || !!c.transient || p.starts > p.ends || byJoints;
    p.byJoints = byJoints;
    // Opened, and a new pinch closed, between two frames: another press.
    const again = down && p.down && p.renew;
    // Closed and opened between two frames: a press all the same.
    p.tap = !down && p.starts > 0;
    p.press = (down && !p.down) || p.tap || again;
    p.lift = (!down && p.down) || p.tap;
    if (again || (p.tap && p.renew)) p.mute = p.middle = false;
    // Found closed after nothing was held (the session came back into
    // view, a controller went away): not a new press, and it does nothing
    // until it has opened.
    if (p.stale) {
      if (down && p.starts === 0) { p.press = false; p.mute = true; }
      p.stale = false;
    }
    p.starts = p.ends = 0;
    p.renew = false;
    if (p.press) {
      p.frames = p.tap ? 1 : 0;
      p.since = this.now;
      p.blind = 0;
      if (!p.known) p.far = 0;
      // The way the head faced, level, when the pinch began: a turn and a
      // run are told by that, not by where the head has turned since.
      if (shared.headOk) { const h = shared.head, rl = Math.hypot(h[0], h[2]) || 1; p.rx0 = h[0] / rl; p.rz0 = h[2] / rl; }
    }
    p.down = down;
    if (down) {
      const s = c.transient || p.selecting[0] || c.hand;
      let seen = false;
      if (s) {
        if (p.press && !p.rayOk) this._ray(frame, space, s, p);
        seen = this._fingers(frame, space, s, p, false);
      }
      p.frames++;
      // Fingers that are not seen hold nothing (the stick would stay where
      // it was last seen), and a hand that said it pinched and has gone
      // without saying it let go has let go (a transient source goes with
      // its pinch).
      p.blind = seen ? 0 : p.blind + 1;
      if (p.blind > BLIND && !c.transient) p.selecting.length = 0;
    }
    p.gone = down && p.blind > GONE;
    // Thumb to middle finger is another button, however it was announced.
    if (p.press) p.middle = j.on && j.near === 2;
  }

  // Where the belt is this frame: over the open palm of the hand without
  // the tool while it faces the eyes, otherwise low in front of where the
  // player stood when it was hung, in the room, so that it comes along.
  // It is hung again when the player has walked away from that spot or
  // has faced away from it for half a second.
  _belt(jo, side, busy) {
    const b = shared.belt, h = shared.head, palm = this._palm || (this._palm = { facing: 0, open: false, c: [0, 0, 0], top: 0 });
    let raw = false;
    if (jo.on && shared.headOk && !busy) {
      palmOf(jo.p, side, h, palm);
      raw = palm.open && palm.facing > (this.palm ? 0.35 : 0.6);
    }
    this.palmN = raw ? Math.min(this.palmN + 1, 12) : Math.max(this.palmN - 1, 0);
    if (this.palmN >= 8) this.palm = true;
    else if (this.palmN === 0) this.palm = false;
    if (!shared.headOk) return;
    const was = b.palm && b.on;
    b.palm = this.palm;
    if (b.palm) {
      // (A hand whose joints drop out for a few frames keeps its belt
      // where it was: a board that jumped away and back would be touched
      // twice by a finger that never moved.)
      if (jo.on) {
        // Over the fingertips, a little towards the head; eased, so that a
        // hand that trembles does not shake the tiles under the finger.
        const tx = palm.c[0] + (h[12] - palm.c[0]) * 0.05, ty = palm.top + BELT.PALM[1] / 2 + 0.03, tz = palm.c[2] + (h[14] - palm.c[2]) * 0.05, k = was ? 0.35 : 1;
        b.c[0] += (tx - b.c[0]) * k; b.c[1] += (ty - b.c[1]) * k; b.c[2] += (tz - b.c[2]) * k;
        b.w = BELT.PALM[0]; b.h = BELT.PALM[1];
        facePoint(b, h[12], h[13], h[14]);
      }
      this.hung = false;
      return;
    }
    const fl = Math.hypot(h[0], h[2]) || 1, fx = h[2] / fl, fz = -h[0] / fl;
    const dx = b.c[0] - h[12], dz = b.c[2] - h[14], d = Math.hypot(dx, dz) || 1;
    if (!this.hung || (dx * fx + dz * fz) / d >= 0.26) this.awayAt = 0;
    else if (!this.awayAt) this.awayAt = this.now;
    if (!this.hung || (this.awayAt && this.now - this.awayAt > AWAY_MS) || Math.hypot(h[12] - this.hungAt[0], h[14] - this.hungAt[2]) > 0.7 || Math.abs(h[13] - this.hungAt[1]) > 0.4) {
      b.c[0] = h[12] + fx * 0.8; b.c[1] = h[13] - 0.42; b.c[2] = h[14] + fz * 0.8;
      this.hungAt[0] = h[12]; this.hungAt[1] = h[13]; this.hungAt[2] = h[14];
      this.hung = true;
      this.awayAt = 0;
      b.w = BELT.HOME[0]; b.h = BELT.HOME[1];
      facePoint(b, h[12], h[13], h[14]);
    }
  }

  // The tile a pinch's ray begins on, or -1. Only a ray from the eyes
  // chooses: a hand's own ray, from the hip, crosses the board on its way
  // to most of what the player aims at (such a hand has joints, and
  // touches the belt on its palm instead).
  _tileOf(p) {
    const b = shared.belt;
    if (!b.on || !p.rayOk || !p.bare) return -1;
    const n = b.n, dn = p.rd[0] * n[0] + p.rd[1] * n[1] + p.rd[2] * n[2];
    if (!(dn < -1e-3)) return -1;
    const t = ((b.c[0] - p.ro[0]) * n[0] + (b.c[1] - p.ro[1]) * n[1] + (b.c[2] - p.ro[2]) * n[2]) / dn;
    if (!(t > 0)) return -1;
    const x = p.ro[0] + p.rd[0] * t - b.c[0], y = p.ro[1] + p.rd[1] * t - b.c[1], z = p.ro[2] + p.rd[2] * t - b.c[2];
    const u = (x * b.r[0] + y * b.r[1] + z * b.r[2]) / b.w + 0.5, v = 0.5 - (x * b.u[0] + y * b.u[1] + z * b.u[2]) / b.h;
    return u >= 0 && u <= 1 && v >= 0 && v <= 1 ? tileAt(u, v) : -1;
  }

  // The tile under the tool hand's index fingertip (lit while the finger
  // is near the board), chosen when the tip comes to the board's face from
  // in front of it: a tip that was not seen out there first (the board has
  // just come, the hand was not seen, the tip came in from the side or
  // from behind) chooses nothing until it has been.
  _touch(jt) {
    const b = shared.belt;
    if (!b.on || !b.palm || !jt.on) { this.touching = true; return -1; }
    const p = jt.p, i = J.INDEX_TIP * 3, x = p[i] - b.c[0], y = p[i + 1] - b.c[1], z = p[i + 2] - b.c[2];
    const d = x * b.n[0] + y * b.n[1] + z * b.n[2];
    const u = (x * b.r[0] + y * b.r[1] + z * b.r[2]) / b.w + 0.5, v = 0.5 - (x * b.u[0] + y * b.u[1] + z * b.u[2]) / b.h;
    const tile = u >= 0 && u <= 1 && v >= 0 && v <= 1 && d > -0.03 && d < 0.08 ? tileAt(u, v) : -1;
    if (d > TOUCH_OFF) this.touching = false;
    if (tile >= 0 && this.litFor <= 0) this.lit = tile;
    if (tile >= 0 && d < TOUCH && !this.touching) { this.touching = true; return tile; }
    return -1;
  }

  // Presses a button of the card that is up, through the game's own hook
  // ('confirm': its lit button; 'back': its other one). True if a card
  // took it; false where there is no card or no such hook.
  _card(game, which) {
    try {
      return !!game && typeof game[which] === 'function' && game[which]() === true;
    } catch (e) {
      console.warn('VR hands: the card did not take the pinch:', e);
      return false;
    }
  }

  // What a chosen tile does.
  _act(i, vr) {
    const t = TILES[i], game = vr && vr.ctx ? vr.ctx.game : null;
    this.lit = i;
    this.litFor = 24;
    this.statusAt = 0;
    if (t.id !== 'leave') this.leaveBy = 0;
    const call = (name, arg) => { try { if (vr && typeof vr[name] === 'function') vr[name](arg); } catch (e) { console.warn(e); } };
    switch (t.id) {
      case 'tool': if (game) game.tool = t.tool; break;
      case 'alt': this.alt = 6; break;
      case 'left': case 'right':
        this.snap = t.id === 'left' ? -1 : 1;
        // (A snap turn takes one push of the stick; a smooth one is held.)
        this.snapFor = 2;
        this.snapUntil = vr && vr.opts && vr.opts.turn === 'smooth' ? this.now + TURN_MS : 0;
        break;
      // (While a card is up this tile is its other button.)
      case 'pause': if (!(shared.belt.card && this._card(game, 'back'))) this.pauseNow = true; break;
      // (Twice: the way out is one pinch away from the ground the player
      // may have meant to look at.)
      case 'leave':
        if (this.now < this.leaveBy) { this.leaving = 1; this.leaveBy = 0; } else this.leaveBy = this.now + LEAVE_MS;
        break;
      case 'swap': {
        // The tool to the other hand, kept by the page like the menu's own choice.
        const o = vr ? vr.opts : null;
        if (o) { o.hand = o.hand === 'left' ? 'right' : 'left'; if (typeof o.keep === 'function') o.keep('hand', o.hand); }
        break;
      }
      case 'help': this.help = !this.help; this.begun = true; break;
      case 'stand': call('stand'); break;
      case 'lower': call('rise', -1); break;
      case 'raise': call('rise', 1); break;
      // (xr.js: -1 is the sharper picture, +1 the cheaper.)
      case 'smoother': call('sharpness', 1); break;
      case 'sharper': call('sharpness', -1); break;
      default: break;
    }
  }

  // One frame with no controller in it. `input` is the XrInput to fill.
  // Never throws: xr.js takes an exception here for a frame without a
  // pose, and a fault that came every frame would leave the player with
  // no picture. A frame that faults holds nothing.
  read(frame, session, space, toolHand, input) {
    try {
      this._read(frame, session, space, toolHand, input);
    } catch (e) {
      if (!this.faults++) console.warn('VR hands: a frame could not be read:', e);
      this.pinch.left.reset();
      this.pinch.right.reset();
      input.buttons = input.pressed = 0;
      input.moveX = input.moveY = input.turn = 0;
      input.toolStep = 0;
      input.pauseEdge = input.pauseDown = input.heightEdge = input.answer = false;
      input.sprint = false;
      input.tool.tracked = input.other.tracked = false;
    }
  }

  _read(frame, session, space, toolHand, input) {
    this.attach(session);
    this.space = space;
    this.toolHand = toolHand;
    const otherHand = toolHand === 'left' ? 'right' : 'left';
    // Not in play: paused on the menu, or behind a card (a job that has
    // ended: 'score'). A pinch then plays on, and does nothing else.
    const vr = this._vr(), game = vr && vr.ctx ? vr.ctx.game : null, mode = game ? game.mode : 'play', paused = mode !== 'play';
    // The frame's own time where xr.js is to be asked; else a headset's rate.
    this.now = vr && Number.isFinite(vr.now) && vr.now > 0 ? vr.now : this.now + 11;
    if (!this.t0) this.t0 = this.now;
    // The head this frame: xr.js has just asked for it; where it has not
    // said who it is, it is asked for again.
    shared.headOk = false;
    try {
      const vp = vr && vr.xf === frame ? vr.pose : frame.getViewerPose(space);
      if (vp && finite(vp.transform.matrix)) { shared.head.set(vp.transform.matrix); shared.headOk = true; }
    } catch (e) { /* no head this frame: the walking hand and the belt wait */ }
    // What the events could not place, now that there is a frame to see by.
    if (this.pending.length) {
      const q = this.pending;
      this.pending = this._spare || [];
      for (let i = 0; i < q.length; i += 2) this._event(q[i], q[i + 1], frame, true);
      q.length = 0;
      this._spare = q;
    }
    const sources = session.inputSources, cur = this._cur;
    cur.left.transient = cur.left.hand = cur.right.transient = cur.right.hand = null;
    let any = false;
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i];
      if (!isHand(s)) continue;
      any = true;
      const c = cur[this._side(s, frame, space, true)];
      if (isTransient(s)) c.transient = c.transient || s; else c.hand = c.hand || s;
    }
    const T = this.pinch[toolHand], O = this.pinch[otherHand], ct = cur[toolHand], co = cur[otherHand];
    const jt = shared.joints[toolHand], jo = shared.joints[otherHand];
    this._joints(frame, space, ct.hand, jt);
    this._joints(frame, space, co.hand, jo);
    this._level(T, ct, jt, frame, space, sources);
    this._level(O, co, jo, frame, space, sources);
    if (any || T.press || O.press) this.seen = true;
    // Not in the first second of a session whose controllers may only be
    // waking up: then there is neither sign nor belt.
    const ready = this.seen || this.now - this.t0 > WAKE_MS;

    // The belt, and what a pinch that has just closed is for: a tile it
    // began on; or, in a paused game, going on; or taking the sign down.
    // Such a pinch does nothing else.
    const b = shared.belt;
    this._belt(jo, otherHand, O.down);
    b.on = ready && shared.headOk && (this.hung || b.palm);
    let pauseEdge = false, answer = false;
    this.pauseNow = false;
    for (let k = 0; k < 2; k++) {
      const p = k ? O : T;
      if (!p.press) continue;
      const tile = this._tileOf(p);
      if (tile >= 0) {
        this._act(tile, vr);
        if (TILES[tile].id !== 'help') { this.begun = true; this.help = false; }
        p.mute = true;
      } else if (paused) {
        // Behind a card the pinch is the card's lit button, where the game
        // offers it (game.js: confirm); else, and on the menu, it plays on.
        if (!this._card(game, 'confirm')) pauseEdge = answer = true;
        p.mute = true;
      } else if ((!this.begun || this.help) && this.signWas) {
        // (Only a sign that was up to be read is taken down: a pinch
        // before it came is a pinch like any other.)
        this.begun = true;
        this.help = false;
        p.mute = true;
      } else if (p === T && b.palm && jt.on && Math.hypot(jt.p[27] - b.c[0], jt.p[28] - b.c[1], jt.p[29] - b.c[2]) < 0.22) {
        // A finger on its way to a tile is not a trigger.
        p.mute = true;
      }
    }
    if (this.litFor > 0) this.litFor--; else this.lit = -1;
    const touched = this._touch(jt);
    if (touched >= 0) this._act(touched, vr);
    if (this.pauseNow) pauseEdge = true;

    // The tool's ray: its hand's transient source while there is one (it
    // is where the player looked), and after it has gone the last it had,
    // so the tool goes on pointing where it last fired. Where there are no
    // transient sources (hands that announce their own pinch), the hand's
    // own ray; a headset that has once sent a transient source aims by the
    // eyes from then on, or the line shown would not be the shot's.
    this.fresh = false;
    const from = ct.transient || (this.eyes ? null : T.selecting[0] || ct.hand);
    if (from && !(T.mute && isTransient(from))) this._pose(frame, space, from);
    // (A pinch whose source is gone again, or has no pose in the frame it
    // is first seen in: the ray it began with.)
    if (!this.fresh && T.press && !T.mute && T.rayOk) { this.ray.set(T.m); this.grip.set(T.g); this.has = this.fresh = true; shared.bare = T.bare; }
    const t = input.tool, o = input.other;
    t.source = o.source = null;
    t.x = t.y = o.x = o.y = 0;
    t.down = t.edge = o.down = o.edge = 0;
    o.tracked = false;
    t.tracked = this.fresh || (this.has && shared.bare);
    if (t.tracked) { t.ray.set(this.ray); t.grip.set(this.grip); }
    let held = 0, pressed = 0;
    // Held while the fingers are closed. A pinch that closed and opened
    // between two frames is a press and nothing held: the engine keeps a
    // press for its next step and fires once on it, and a trigger held
    // for a frame it was never down in would fire again across a frame
    // that takes longer than the tool's cooldown.
    const live = T.down && !T.mute && !T.gone;
    if (live && !T.middle) held |= BUTTON.PRIMARY;
    if (T.press && !T.mute && !T.middle) pressed |= BUTTON.PRIMARY;
    // The second button: thumb to middle finger of the tool hand (announced
    // as a pinch, or seen in the joints alone), or its tile.
    const alt = (live && T.middle) || (jt.mid && !T.down) || this.alt > 0;
    if (this.alt > 0) this.alt--;
    if (alt) held |= BUTTON.SECONDARY;
    if ((alt && !this.altWas) || (T.tap && T.middle && !T.mute)) pressed |= BUTTON.SECONDARY;
    this.altWas = alt;

    // The other hand's held pinch is the stick.
    let mx = 0, my = 0;
    const st = shared.stick;
    st.on = false;
    if (O.down && !O.mute && !O.middle && !O.gone && O.known && shared.headOk) {
      const h = shared.head;
      let dx = O.at[0] - O.from[0], dz = O.at[2] - O.from[2];
      // A turn and a run are told by the way the head faced when the pinch
      // began: a head that turns to look about while the hand stays out
      // ahead has not pushed the hand to the side.
      const side0 = dx * O.rx0 + dz * O.rz0, fwd0 = dx * O.rz0 - dz * O.rx0;
      if (Math.abs(side0) > WALK.TURN) this.turn = Math.sign(side0);
      else if (Math.abs(side0) < WALK.TURN_OFF) this.turn = 0;
      this.run = fwd0 > WALK.RUN || (this.run && fwd0 > WALK.RUN_OFF);
      // (Out to the side is a turn, not a step to the side as well.)
      if (this.turn) { dx -= side0 * O.rx0; dz -= side0 * O.rz0; }
      // The way the hand went is the way the body goes, in the room. The
      // stick's axes are the head's as it faces now (xr_play.js walks by
      // them), level: its right-hand axis stays level when it looks up.
      const rl = Math.hypot(h[0], h[2]) || 1, rx = h[0] / rl, rz = h[2] / rl;
      const side = dx * rx + dz * rz, fwd = dx * rz - dz * rx, len = Math.hypot(side, fwd);
      if (len > WALK.DEAD) {
        const k = Math.min(1, (len - WALK.DEAD) / (WALK.FULL - WALK.DEAD)) / len;
        mx = side * k;
        my = fwd * k;
      }
      st.on = true;
      st.from[0] = O.from[0]; st.from[1] = O.from[1]; st.from[2] = O.from[2];
      st.at[0] = O.at[0]; st.at[1] = O.at[1]; st.at[2] = O.at[2];
      st.run = this.run;
      st.turn = this.turn;
    } else {
      this.turn = 0;
      this.run = false;
    }
    // Short and still: a jump, when the fingers open.
    if (O.lift && !O.mute && !O.middle && this.now - O.since <= TAP_MS && O.far < TAP_MOVE) {
      this.jump = JUMP_FRAMES;
      pressed |= BUTTON.JUMP;
    }
    if (this.jump > 0) { this.jump--; held |= BUTTON.JUMP; }
    if (this.run) held |= BUTTON.SPRINT;
    jt.pinch = T.down ? (T.middle ? 2 : 1) : jt.mid ? 2 : 0;
    jo.pinch = O.down ? (O.middle ? 2 : 1) : jo.mid ? 2 : 0;
    if (T.lift) { T.mute = T.known = T.rayOk = T.middle = false; T.src = null; }
    if (O.lift) { O.mute = O.known = O.rayOk = O.middle = false; O.src = null; }

    // Leaving VR is the pause button held for a second (xr_play.js).
    if (this.leaving > 0) {
      if (this.leaving === 1) pauseEdge = true;
      if (++this.leaving > 600 || (vr && (vr.leaving || vr.ended))) this.leaving = 0;
    }
    let turn = this.turn;
    if (this.snapFor > 0 || this.now < this.snapUntil) { if (this.snapFor > 0) this.snapFor--; turn = this.snap; }
    input.buttons = held;
    input.pressed = pressed;
    input.toolStep = 0;
    input.pauseEdge = pauseEdge;
    input.answer = answer;
    input.pauseDown = this.leaving > 0;
    input.heightEdge = false;
    input.sprint = this.run;
    input.moveX = mx;
    input.moveY = my;
    input.turn = turn;
    shared.active = true;

    // What the belt and the sign say.
    if (vr) {
      // (The readout's place is the belt's: its lines are on the belt. A
      // belt that is not up, or cannot be drawn, leaves the readout be.)
      vr.cardOff = b.on && !shared.fault;
      try { if (typeof vr._status === 'function') vr._status(); } catch (e) { /* its lines stay as they were */ }
    }
    b.tool = game ? game.tool : 0;
    b.allowed = game && Number.isFinite(game.allowed) ? game.allowed : -1;
    b.paused = paused;
    // What a pinch does when the game is not in play: the words of the
    // card's lit button where the game says them, else that it plays on.
    let label = '';
    try { label = paused && game && typeof game.cardLabel === 'string' ? game.cardLabel : ''; } catch (e) { label = ''; }
    b.card = label !== '' && typeof game.back === 'function';
    if (label !== this.cardLabel) { this.cardLabel = label; this.cardNote = label ? `Pinch: ${label}` : ''; }
    b.note = !paused ? '' : this.cardNote || (mode === 'score' ? 'The job is over: pinch to play on' : mode === 'menu' ? 'Paused: pinch to go on' : 'Pinch to go on');
    b.lit = this.lit;
    b.hand = toolHand;
    b.leave = this.now < this.leaveBy;
    // (Its own copy of the lines, now and then: they carry the frame's
    // milliseconds and change twice a second, and every change is a
    // picture to paint and send.)
    // (In the first seconds they are still finding out what the device
    // gave: then twice a second, as they change.)
    if (vr && Array.isArray(vr.status) && (!this.statusAt || this.now - this.statusAt > (this.now - this.t0 < SETTLE_MS ? 500 : STATUS_MS))) {
      this.statusAt = this.now;
      for (let i = 0; i < 3; i++) b.status[i] = vr.status[i] || '';
    }
    b.build = shared.build;
    const up = ready && (!this.begun || this.help || paused || (b.palm && b.on));
    if (up) {
      // (Written again only when what it says has changed; `key` counts
      // the writings, for the overlay to repaint by.)
      const sg = this._sign || (this._sign = { title: '', lines: [], foot: [], big: false, key: 0, hand: '', joints: null, paused: null, free: null, full: null, build: '', status: ['', '', ''] });
      // (xr.js starts a session of hands alone in the sandbox, and says so.)
      const joints = jt.on || jo.on, free = !!(vr && vr.free);
      // The whole of it when it was asked for (the Help tile, the open
      // palm); before the first pinch, and over a pause or a card, only
      // what is needed to fire and to walk.
      const full = this.help || (b.palm && b.on);
      // What it is headed: what a pinch does when the game is not in
      // play; else, over the whole of it, how it goes away again.
      const head = b.note || (!full ? '' : this.help ? 'Help: pinch to close' : 'Help');
      let same = sg.hand === toolHand && sg.joints === joints && sg.paused === head && sg.free === free && sg.full === full && sg.build === shared.build;
      for (let i = 0; i < 3 && full; i++) if (sg.status[i] !== b.status[i]) same = false;
      if (!same) {
        const text = helpLines(toolHand === 'left' ? 'Left' : 'Right', toolHand === 'left' ? 'Right' : 'Left', joints, head, free, full, !!VIEW_FX.BLAST_STILL);
        sg.title = text.title;
        sg.lines = text.lines;
        sg.big = text.big;
        // Under the rule: the build; then, on the whole sign, what the
        // device gave (the belt has those lines always); on the short one,
        // that this is the sandbox.
        sg.foot.length = 0;
        sg.foot.push(shared.build);
        for (let i = 0; i < 3; i++) { sg.status[i] = b.status[i] || ''; if (full) sg.foot.push(sg.status[i]); }
        if (!full && free) sg.foot.push('Sandbox: everything is free');
        sg.hand = toolHand; sg.joints = joints; sg.paused = head; sg.free = free; sg.full = full; sg.build = shared.build;
        sg.key++;
      }
      shared.sign = sg;
    } else shared.sign = null;
    this.signWas = up;
  }

  // Controllers are back, or nothing is held (lost focus).
  idle() {
    this.pinch.left.reset();
    this.pinch.right.reset();
    this.turn = this.jump = this.alt = this.snapFor = this.leaving = this.palmN = 0;
    this.t0 = this.snapUntil = this.leaveBy = this.awayAt = 0;
    this.run = this.altWas = this.palm = this.signWas = false;
    this.touching = true;
    this.pending.length = 0;
    if (shared.active) {
      const vr = this._vr();
      if (vr) vr.cardOff = false;
    }
    shared.active = false;
    shared.sign = null;
    shared.bare = false;
    shared.stick.on = false;
    shared.belt.on = false;
    shared.joints.left.on = shared.joints.right.on = false;
  }
}
