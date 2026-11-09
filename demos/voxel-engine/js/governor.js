// How game time is running against the clock, and saying so.
//
// A machine that cannot run sixty steps of the simulation a second gets
// slow motion: the sim runs the steps a frame can afford and drops the
// time for the rest (sim_local.js, advance; sim_remote.js, stepsThatFit).
// That is the only thing a slow machine gets. Nothing here, and nothing
// in the engine, makes the simulation do less: the same inputs give the
// same world on every machine, only later (engine/src/effort.rs has the
// history: a governor that turned the simulation's budgets down scored a
// fifth as much with the same play, and left standing what full effort
// brought down).
//
// So this only measures. Per frame it is told the steps the sim ran, the
// game time that was asked of it, the time since the last frame, and the
// main thread's time (the sim's part of it, and all of it). From those it
// keeps, smoothed:
//
//   speed    game time run as a share of game time asked for, over the
//            last second or so: 1 when the sim keeps up
//   slow     true once speed has been under 0.85, until it is over 0.93
//            again: the HUD shows its slow-motion mark while it is
//            (game_hud.js), with the factor
//   load     how full the thread the sim runs on is: the main thread's
//            time for a frame against the display's period (learned: the
//            shortest interval seen lately) with the sim on the page's
//            thread; what the worker says its steps, meshing and packet
//            took against the game time they covered with the sim in a
//            worker
//   late     share of frames that took 1.5 periods or more
//
// What may be shed for frame rate is what is drawn, and that is the
// renderer's own scaler (render_quality.js). Everything here is
// arithmetic on a handful of numbers per frame: no allocation.
import { SIM_DT } from './engine.js';

const SLOW_BELOW = 0.85, SLOW_UNTIL = 0.93;

export function createGovernor(sim) {
  // Smoothed: load, late, the cost of a step (ms), game seconds run and
  // asked for a frame. Then the frame period (ms) as learned, the game
  // time (s) the sim has yet to run, and (a worker's) time and the game
  // time it covered, both ms a frame, smoothed.
  const S = new Float64Array(9);
  const LOAD = 0, LATE = 1, COST = 2, RAN = 3, ASKED = 4, PERIOD = 5, LAG = 6, WORK = 7, COVERED = 8;
  S[PERIOD] = 1000 / 60;
  let slow = false;
  // (The level a governor of 2026-10-15 kept across visits: gone.)
  try { localStorage.removeItem('vx.effort'); } catch (e) { /* no storage */ }

  return {
    // (For the tools written while this turned a dial: nothing is turned.)
    get level() { return 1; },
    get enabled() { return false; },
    get speed() { return S[ASKED] > 1e-6 ? Math.min(1, S[RAN] / S[ASKED]) : 1; },
    get slow() { return slow; },
    get load() { return S[LOAD]; },
    get late() { return S[LATE]; },
    get cost() { return S[COST]; },
    get period() { return S[PERIOD]; },
    // A new world: what the old one cost says nothing about it.
    reset() {
      S[LAG] = S[RAN] = S[ASKED] = 0;
      slow = false;
    },
    // One frame: the sim ran `steps` steps of the `seconds` of game time
    // that passed (all of it: main.js gives the game a tenth of a second
    // of a longer frame at most, and the rest is slow motion like any
    // other time not run), the frame before this one was `dtMs` ago, and
    // the main thread spent `simMs` in the sim and `cpuMs` in all on this
    // one.
    frame(steps, seconds, dtMs, simMs, cpuMs) {
      if (!(seconds > 0) || !(dtMs > 0) || dtMs > 1000) return;
      // The display's period: snaps down to a shorter interval, creeps up
      // otherwise (a second or two to follow a display that got slower).
      S[PERIOD] = Math.max(4, Math.min(S[PERIOD] * 1.004, dtMs, 50));
      const period = S[PERIOD], k = 0.1, remote = sim.remote === true;
      // Game time the sim has not run yet. It may owe a step or two (more
      // in a worker, whose answer may be a few frames away: and when the
      // worker keeps the clock and the page draws three frames a second,
      // a frame comes with eighteen steps, or none, or thirty-six, so the
      // allowance there is two and a half frames of whatever length);
      // what is over that will never be run, and is what slow motion is
      // made of.
      const most = remote ? Math.max(0.3, 2.5 * dtMs / 1000) : 2.5 * SIM_DT;
      const lag = Math.max(0, S[LAG] + seconds - steps * SIM_DT);
      S[LAG] = Math.min(lag, most);
      const dropped = Math.min(seconds, lag - S[LAG]);
      // (Over about a second of the clock, at any frame rate: a mark on
      // the screen must not flicker, nor take five seconds to come up at
      // eight frames a second.)
      const ks = Math.min(0.5, dtMs / 550);
      S[ASKED] += (seconds - S[ASKED]) * ks;
      S[RAN] += (seconds - dropped - S[RAN]) * ks;
      const speed = this.speed;
      if (speed < SLOW_BELOW) slow = true;
      else if (speed > SLOW_UNTIL) slow = false;
      if (remote) {
        // What the worker says its last answer took, counted once.
        const f = sim.frame, fresh = steps > 0 && f.paced > 0;
        S[WORK] += ((fresh ? f.stepMs + f.prepareMs + f.copyMs : 0) - S[WORK]) * k;
        S[COVERED] += ((fresh ? f.paced * SIM_DT * 1000 : 0) - S[COVERED]) * k;
        S[LOAD] = S[COVERED] > 0.01 ? S[WORK] / S[COVERED] : 0;
        S[LATE] += (0 - S[LATE]) * k;
        if (fresh) S[COST] += (f.stepMs / f.paced - S[COST]) * k;
      } else if (steps > 0) {
        S[LOAD] += (cpuMs / period - S[LOAD]) * k;
        S[LATE] += ((dtMs >= 1.5 * period ? 1 : 0) - S[LATE]) * k;
        S[COST] += (simMs / steps - S[COST]) * k;
      }
    },
    // One line for the F3 panel.
    describe() {
      const pace = `game time ${this.speed.toFixed(2)}x${slow ? ' (slow motion)' : ''}  step ${S[COST].toFixed(1)} ms`;
      return `${pace}  ${sim.remote ? `worker load ${Math.round(S[LOAD] * 100)}%` : `load ${Math.round(S[LOAD] * 100)}% of ${S[PERIOD].toFixed(1)} ms  late ${Math.round(S[LATE] * 100)}%`}`;
    },
  };
}
