// The gun answers on the page at the press.
//
// With the simulation in its worker the world's answer to a press is drawn
// one frame after the frame that takes it, and that frame is not the
// transport's to give back: after a mouse press or a key the browser
// delivers nothing a worker posts until the next animation frame has run
// (tools/harness/press_hold_probe.mjs). So what needs nothing from the
// world but the knowledge that the shot will be fired is done here, in the
// frame of the press: the kick of the view (game_feel.js), the shot's own
// sound (audio.press), the muzzle's flash (below), a hand's pulse. The
// world follows a frame
// later as it always did (the shot's event, the streak, the rocket, the
// hit), and then none of those is done a second time for that shot.
//
// The page answers a press only on the engine's own word that a press
// taken by its next step makes a shot of the tool in hand
// (TOOL_STATE.READY, tools.rs `ready_at_a_press`: the step's conditions,
// not a second copy of them here), for a new edge the shell itself sends,
// with that tool in hand in the frame it has. Whenever it is not sure it
// does nothing, and the answer comes a frame late as before: a flash with
// no shot is worse than a late one (the designer's rule). A press it
// answered that the world then does not is counted (`unanswered`), and
// nothing is un-drawn.
//
// docs/design/gun_at_the_press.md; the orchestrator's rule of 16 October.
import { EV, EV_STRIDE, LIGHT_STRIDE, OUT, TOOL, TOOL_STATE } from './engine.js';

// Whether the page answers a press when nobody says (`?press=1` and
// `?press=0` say). On since 16 October, by the third critic's judgement
// of it both ways (180 presses a side and every frame round the press on
// film) and its count on the build that has the worker's clock cured.
export const PRESS_BY_DEFAULT = true;

// The tools whose shot is at the press and at the muzzle.
const AT_THE_PRESS = (1 << TOOL.RIFLE) | (1 << TOOL.SHOTGUN) | (1 << TOOL.ROCKET) | (1 << TOOL.CANNON);
// Frames that bring steps, after a press, within which the world's shot
// must have come: the step that takes the press is the next one or the one
// after, and its events are in the packet of that step.
const PATIENCE = 3;

// Presses answered that the world has not answered yet, by tool: kept by
// whoever does something at the press and must not do it again at the
// event (one each: the shot's event is read by several, in no order).
export class Owed {
  constructor() {
    this.n = new Uint8Array(TOOL.COUNT);
    this.age = new Uint8Array(TOOL.COUNT);
    this.lapsed = 0;
  }

  add(tool) {
    this.n[tool]++;
    this.age[tool] = 0;
  }

  // For a shot's event of `tool`: true when it is the world's answer to a
  // press answered here already.
  take(tool) {
    if (!(tool >= 0 && tool < this.n.length) || this.n[tool] === 0) return false;
    this.n[tool]--;
    this.age[tool] = 0;
    return true;
  }

  // Once for every frame that brought steps, after its events were read:
  // a press the world has not answered by now is not going to be.
  stepped() {
    for (let t = 0; t < this.n.length; t++) {
      if (this.n[t] > 0 && ++this.age[t] > PATIENCE) {
        this.lapsed += this.n[t];
        this.n[t] = 0;
      }
    }
  }

  clear() {
    this.n.fill(0);
  }
}

// ctx: the page's context (ctx.sim, ctx.renderer). inPlay(): the shell is
// in play. enabled: the page answers presses at all.
export function createPress(ctx, inPlay, enabled = PRESS_BY_DEFAULT) {
  const { sim } = ctx;
  const owed = new Owed();
  const listeners = [];
  let lastStep = -1, total = -1;
  // The muzzle's flash of a press answered and not yet drawn: the light
  // the world's own frame of that shot will have (TOOL_STATE.FLASH,
  // tools.rs `flash_at_a_press`: the place, the reach and the colour are
  // the engine's, none of them said again here). It goes into the picture
  // of the press, and that one only (renderer.flash): the world's light
  // comes with its shot at the same place, and the two in one picture
  // would be a flash twice as bright. So it is given when the frame of
  // the press has read its packet (`read`), and as what that picture's
  // own lights lack of it: all of it with the sim in its worker, whose
  // shot is a frame away; nothing where the shot's step is in this very
  // picture (the sim on the page's thread at a step a frame); and the
  // rest where a frame of two or three steps already shows the world's
  // light well down its fall, or past it (at 30 frames a second a rifle's
  // flash was a quarter of itself, at 20 it was not drawn at all).
  const light = new Float32Array(7);
  let lit = false;
  // How much of `light` the frame's own lights hold already, 0..1.
  const held = (out) => {
    const f = sim.frame.f32;
    let most = 0;
    for (let i = 0, p = out[OUT.LIGHTS_PTR] >> 2; i < out[OUT.LIGHT_COUNT]; i++, p += LIGHT_STRIDE) {
      // (The muzzle's own light: there, of that reach. A step or two of
      // the player's walk away at most.)
      const dx = f[p] - light[0], dy = f[p + 1] - light[1], dz = f[p + 2] - light[2];
      if (dx * dx + dy * dy + dz * dz < 0.25 && Math.abs(f[p + 3] - light[3]) < 1e-3) most = Math.max(most, f[p + 4] / light[4]);
    }
    return most < 1 ? most : 1;
  };
  const press = {
    // Presses answered here, shots of the world that were those presses,
    // and presses answered here that no shot followed.
    answered: 0, paired: 0,
    get unanswered() { return owed.lapsed; },
    // Flashes given to the picture of a press, and those left to the
    // world's own light: that picture had it whole already, or it is a
    // headset's.
    flashed: 0, flashLeft: 0,
    // (The light of the last press answered, for the checks.)
    light,
    enabled,
    // The frame of the last answered press (the page's count of frames
    // drawn is not kept here: the step the page had), for the checks.
    lastTool: -1,

    // fn(tool): called at an answered press, in the task of the press.
    on(fn) { listeners.push(fn); },

    // A new press of Fire, as the shell sends it, with `tool` chosen on
    // the page. Returns the tool whose shot was answered, or -1.
    at(tool) {
      if (!press.enabled || !inPlay()) return -1;
      const ts = sim.frame.toolState;
      if (!ts || ts.length <= TOOL_STATE.READY) return -1;
      if (ts[TOOL_STATE.ACTIVE] !== tool || (AT_THE_PRESS & (1 << tool)) === 0 || ts[TOOL_STATE.READY] !== 1) return -1;
      owed.add(tool);
      press.answered++;
      press.lastTool = tool;
      light.set(ts.subarray(TOOL_STATE.FLASH, TOOL_STATE.FLASH + 7));
      lit = light[3] > 0;
      for (let i = 0; i < listeners.length; i++) listeners[i](tool);
      return tool;
    },

    // Once a drawn frame, with its out block: the world's shots of the
    // steps since the last one, paired with the presses answered.
    read(out) {
      const step = out[OUT.STAT_FRAME];
      if (step !== lastStep) {
        // (A new world: nothing of the old one is owed.)
        if (step < lastStep) { owed.clear(); total = -1; lit = false; }
        lastStep = step;
        const all = out[OUT.EVENT_TOTAL], n = out[OUT.EVENT_COUNT];
        const fresh = total < 0 ? n : Math.min(n, (all - total) >>> 0);
        total = all;
        const f = sim.frame.f32;
        let p = (out[OUT.EVENTS_PTR] >> 2) + (n - fresh) * EV_STRIDE;
        for (let i = 0; i < fresh; i++, p += EV_STRIDE) {
          if (f[p] === EV.SHOT && owed.take(f[p + 6])) press.paired++;
        }
        owed.stepped();
      }
      if (lit) {
        lit = false;
        const r = ctx.renderer, rest = 1 - held(out);
        // (Not in a headset, by its owner's word: what is shown at a
        // muzzle there is drawn at the tool in the hand, for both eyes,
        // and is the VR engineer's to add.)
        if (rest < 0.02 || ctx.xr) press.flashLeft++;
        else if (r && r.flash) {
          r.flash(light[0], light[1], light[2], light[3], light[4] * rest, light[5] * rest, light[6] * rest);
          press.flashed++;
        }
      }
    },
  };
  return press;
}
