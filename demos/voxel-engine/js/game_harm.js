// The player's body on the page: a red edge that deepens as their health
// goes and a flare on the side a hurt came from. The engine keeps the
// number and says what took it (player/harm.rs: PLAYER_STATE.HEALTH,
// PFLAG.DOWN, EV.HURT); what nothing left costs is the mode's
// (player/objective: a contract is lost to a blow, a fall or a blast at
// arm's length; Mayhem and the Sandbox go on). This file only shows it,
// in every mode, and writes nothing while the player is whole.
import { EV, EV_STRIDE, OUT, PFLAG, PLAYER_STATE, TOOL, VEHICLE_STATE } from './engine.js';

// Whether any mode holds a player with nothing left down (objective.rs
// sets `Harm::hold`; off since 16 October).
const HOLDS = false;
// How long the line that says what took it stays (ms), and its words by
// `harm::by` (the material for a blow).
const NOTE_MS = 2600;
const NOTES = {
  1: () => 'Blast',
  2: (m) => `Struck by ${STUFF[m] || 'debris'}`,
  3: () => 'Fall',
  4: (m) => `Crushed under ${STUFF[m] || 'what fell'}`,
  // (In the cabin of a burning car, or beside one when its tank goes.)
  // (A little at a time is standing in it; a ball of fire comes at once.)
  5: (m, driving, amount) => (driving ? 'Burning: get out of the car' : amount < 0.1 ? 'Burning: get out of the fire' : 'Burnt by the fire'),
};
// The big red button's blast, as its explosion's event names what set it
// off (tools.rs `source::BUTTON`), and how long the first line about
// one's own stays (ms): it says the button's rule, once a session.
const BUTTON = TOOL.COUNT + 1;
// What a blast of the player's own is called, by its source (a tool's id
// plus one): "Blast" did not say it was their own rocket.
const OWN = { [TOOL.ROCKET + 1]: 'Your own rocket', [TOOL.CHARGE + 1]: 'Your own charge', [TOOL.SATCHEL + 1]: 'Your own satchel', [TOOL.BREACH + 1]: 'Your own charge', [TOOL.STRIKE + 1]: 'Your own air strike', [BUTTON]: 'Your own button' };
const RULE_MS = 5000;
// How long the flare of a hurt lasts (ms).
const FLARE_MS = 700;
// What a piece that struck is made of, in a word (material ids:
// engine/src/material.rs).
const STUFF = { 5: 'concrete', 6: 'concrete', 28: 'concrete', 7: 'brick', 25: 'brick', 26: 'brick', 8: 'timber', 9: 'timber', 15: 'timber', 40: 'timber', 41: 'timber', 42: 'timber', 10: 'glass', 47: 'glass', 11: 'steel', 29: 'iron', 30: 'iron', 31: 'steel', 59: 'steel', 20: 'stone', 51: 'stone', 43: 'slate', 13: 'roof', 45: 'tile', 16: 'rubble', 55: 'rubble', 56: 'timber', 57: 'steel', 58: 'earth' };

// What got the player, for a card: `by` is harm::by (1 a blast, 2 struck,
// 3 a fall, 4 crushed, 5 burnt), `material` what the piece was made of.
export function gotBy(by, material) {
  if (by === 1) return 'Caught in the blast';
  if (by === 2) return `Struck by falling ${STUFF[material | 0] || 'debris'}`;
  if (by === 3) return 'A fall too far';
  if (by === 4) return `Crushed under ${STUFF[material | 0] || 'what fell'}`;
  if (by === 5) return 'Burnt by the fire';
  return 'Down';
}

export function createHarm(ctx) {
  const ui = document.getElementById('ui');
  const make = (id) => {
    const e = document.createElement('div');
    e.id = id;
    e.hidden = true;
    ui.appendChild(e);
    return e;
  };
  const edge = make('harm');
  const flare = make('harm-flare');
  const word = make('harm-word');
  word.textContent = 'Down';
  // What took it, and how much, for a moment after each hurt: nobody in
  // the Sandbox ever saw a card, and a rocket bursting down the road
  // took a third of them without a word.
  const note = make('harm-note');
  let noteAt = -1e9, noteText = '', took = 0, tookBy = 0, noteFor = NOTE_MS;
  // Where the button's last blast was, and whether its rule has been said.
  let bx = 0, by = 0, bz = 0, bAt = -1e9, bBy = 0, told = false;
  // The player's feet at the last frame (before this frame's events).
  const was = [0, 0, 0];
  let lastFrame = -1, flareAt = -1e9, side = '', shown = 0, flared = 0, down = false;

  return {
    // out: the frame's header; now: ms. Every frame, in every mode.
    frame(out, now) {
      const sim = ctx.sim, ps = sim.frame.playerState;
      if (!ps) return;
      const frame = out[OUT.STAT_FRAME];
      if (frame !== lastFrame) {
        lastFrame = frame;
        const n = out[OUT.EVENT_COUNT], f = sim.frame.f32;
        let p = out[OUT.EVENTS_PTR] >> 2;
        for (let i = 0, q = p; i < n; i++, q += EV_STRIDE) {
          // (The last blast of the player's own making: the one that
          // hurts them is the one nearest in time.)
          if (f[q] === EV.EXPLOSION && OWN[f[q + 7] | 0]) { bx = f[q + 1]; by = f[q + 2]; bz = f[q + 3]; bAt = now; bBy = f[q + 7] | 0; }
        }
        for (let i = 0; i < n; i++, p += EV_STRIDE) {
          if (f[p] !== EV.HURT) continue;
          // Which side it came from, by where the player looks.
          const yaw = sim.frame.camera[3];
          const dx = f[p + 1] - ps[PLAYER_STATE.FEET_X], dz = f[p + 3] - ps[PLAYER_STATE.FEET_Z];
          const ahead = -Math.sin(yaw) * dx - Math.cos(yaw) * dz, right = Math.cos(yaw) * dx - Math.sin(yaw) * dz;
          const s = f[p + 6] === 3 || dx * dx + dz * dz < 0.04 ? 'b' : Math.abs(right) > Math.abs(ahead) ? (right > 0 ? 'r' : 'l') : ahead > 0 ? 'f' : 'b';
          if (s !== side) flare.className = side = s;
          flareAt = now;
          // (Hurts of one kind within a second are one line: being
          // crushed comes a twentieth at a time.)
          const kind = f[p + 6] | 0;
          took = kind === tookBy && now - noteAt < NOTE_MS ? took + f[p + 4] : f[p + 4];
          tookBy = kind;
          noteAt = now;
          // One's own button: the blast is where its line first met
          // something, and that was this near. (A press on Broadway
          // meant for a wall fourteen metres on went off on a column of
          // the el at four, and nothing said why.)
          const own = kind === 1 && now - bAt < 500 && Math.abs(f[p + 1] - bx) + Math.abs(f[p + 2] - by) + Math.abs(f[p + 3] - bz) < 1.5;
          const vs = sim.frame.vehicleState;
          let what = NOTES[kind] ? NOTES[kind](f[p + 5] | 0, !!(vs && vs[VEHICLE_STATE.DRIVING]), f[p + 4]) : 'Hurt';
          noteFor = NOTE_MS;
          if (own) {
            // (From where they stood a frame ago: by the frame that
            // carries the hurt the blast has thrown them, and a charge
            // at their own feet read "5 m off".)
            const d = Math.hypot(f[p + 1] - was[0], f[p + 2] - was[1] - 1.0, f[p + 3] - was[2]);
            what = `${OWN[bBy]}, ${Math.max(1, Math.round(d))} m off`;
            if (bBy === BUTTON && !told) { told = true; what += ': it goes off on the first thing the crosshair meets'; noteFor = RULE_MS; }
          }
          // (Nobody is held down: with nothing left, the line says so.)
          const t = `${what}  −${Math.min(100, Math.max(1, Math.round(took * 100)))}%${f[p + 7] <= 0 ? '  Knocked down' : ''}`;
          if (t !== noteText) note.textContent = noteText = t;
        }
      }
      was[0] = ps[PLAYER_STATE.FEET_X]; was[1] = ps[PLAYER_STATE.FEET_Y]; was[2] = ps[PLAYER_STATE.FEET_Z];
      // The edge: how much is gone. In twentieths, so that a mending
      // body writes a style a few times a second and a whole one never.
      // (And a weight resting on them, from before it takes anything:
      // PLAYER_STATE.PRESS, the player engineer's.)
      const gone = Math.max(1 - Math.max(0, Math.min(1, ps[PLAYER_STATE.HEALTH])), Math.min(1, ps[PLAYER_STATE.PRESS] || 0));
      const want = Math.round(gone * 20) / 20;
      const noting = now - noteAt < noteFor;
      if (noting === note.hidden) note.hidden = !noting;
      if (want !== shown) {
        shown = want;
        edge.hidden = want === 0;
        edge.style.opacity = String(want);
      }
      const k = Math.round(Math.max(0, 1 - (now - flareAt) / FLARE_MS) * 10) / 10;
      if (k !== flared) {
        flared = k;
        flare.hidden = k === 0;
        flare.style.opacity = String(k);
      }
      // (The word is for a player who is held down, and nobody is, in
      // any mode: `Harm::hold` is off. With nothing left the edge is at
      // its reddest, a contract ends with a card that says why, and the
      // Sandbox and Mayhem go on.)
      const isDown = HOLDS && (out[OUT.PLAYER_FLAGS] & PFLAG.DOWN) !== 0;
      if (isDown !== down) {
        down = isDown;
        word.hidden = !down;
      }
    },
  };
}
