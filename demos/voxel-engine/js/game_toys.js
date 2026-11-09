// The sandbox's toy box: a small panel that lists five things to set off
// (and a sixth line that clears them away)
// where the player is looking (engine/src/tools/toys.rs does them), and
// reminds of the time controls that make them worth watching.
//
// G opens and closes it, and so does the d-pad of a gamepad and, on touch,
// the Toys button. While it is open the keys 1 to 6 pick a toy instead of
// a tool (the pad: d-pad to move, A to pick, B to close; touch: tap a
// row), the panel closes after a pick, and G or Esc closes it without one.
// It exists only in the sandbox: while a contract, an objective or a run
// of Mayhem is on, G does nothing and the button is not shown (the engine
// would refuse the toy anyway).
//
// Closed, it costs nothing: nothing here runs per frame and nothing
// writes to the DOM. The panel is built once, shown and hidden from the
// events that open and close it, and the hint of the first seconds runs
// on a CSS animation. (Only with a gamepad connected is it asked once a
// tick, from the pad's own poll, whether the d-pad was pressed: three
// comparisons.) A toy is set off with `sim.ask('toy', kind)`, so that the
// engine's answer comes back: a toy pointed at the sky is refused, and
// the player is told so in a line.
//
// hooks: { used() -> true when a gamepad is in use (the hint names its
//          button) }
import { TOOL_STATE, TOY } from './engine.js';

const TOYS = [
  { kind: TOY.WRECKING_BALL, name: 'Wrecking ball', text: 'four swings through what you look at' },
  { kind: TOY.DOMINOES, name: 'Dominoes', text: 'a row toward what you look at, each bigger than the last' },
  { kind: TOY.BARRELS, name: 'Barrels', text: 'a pyramid of ten fuel drums' },
  { kind: TOY.METEOR, name: 'Meteor', text: 'a rock out of the sky, onto the mark' },
  { kind: TOY.CARPET, name: 'Carpet', text: 'nine bombs, walking away from you' },
  // Not a toy: what the others left standing or hanging, taken away.
  { kind: TOY.CLEAR, name: 'Clear', text: 'take the balls, the slabs and the rock away' },
];
// The standard gamepad's buttons, as bits of game_pad.js's mask.
const PAD_A = 1 << 0, PAD_B = 1 << 1, PAD_UP = 1 << 12, PAD_DOWN = 1 << 13;

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
};

export function createToys(ctx, state, hooks) {
  const { sim } = ctx;
  const body = document.body;
  const ui = document.getElementById('ui');
  let open = false, sandbox = false, sel = 0;
  // Pad buttons that picked or closed and are still down: they are the
  // panel's until they are let go (A would jump, B would crouch).
  let latched = 0, padHint = false;

  const panel = el('div');
  panel.id = 'toys';
  panel.hidden = true;
  const head = el('div', 'toys-head');
  head.append(el('b', '', 'Toy box'), el('span', '', 'goes off where you look'));
  panel.appendChild(head);
  const rows = TOYS.map((t, i) => {
    const row = el('button', 'toy');
    const text = el('span');
    text.append(el('b', '', t.name), el('small', '', t.text));
    row.append(el('kbd', '', String(i + 1)), text);
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      pick(i);
    });
    panel.appendChild(row);
    return row;
  });
  const foot = el('div', 'toys-foot');
  for (const [key, what] of [['T', 'slow motion'], ['P', 'pause'], ['R', 'restart']]) {
    const item = el('span');
    item.append(el('kbd', '', key), what);
    foot.appendChild(item);
  }
  const shut = el('div', 'toys-shut');
  shut.append(el('kbd', '', 'G'), ' or ', el('kbd', '', 'Esc'), ' closes');
  panel.append(foot, shut);
  // A press on the panel is the panel's: it neither fires the tool nor
  // turns the view.
  for (const type of ['mousedown', 'pointerdown']) panel.addEventListener(type, (e) => e.stopPropagation());
  ui.appendChild(panel);

  // The hint of the first seconds in the sandbox. CSS shows it while the
  // sandbox is being played and fades it out; when it has, it is gone
  // for good.
  let hint = el('div');
  hint.id = 'toys-hint';
  hint.addEventListener('animationend', () => {
    hint.remove();
    hint = null;
  });
  ui.appendChild(hint);
  const note = el('div');
  note.id = 'toys-note';
  note.hidden = true;
  note.addEventListener('animationend', () => { note.hidden = true; });
  ui.appendChild(note);

  const button = document.getElementById('tb-toys');

  function mark() {
    rows.forEach((row, i) => row.classList.toggle('on', i === sel));
  }

  function show(byPad) {
    if (open || !sandbox || state.mode !== 'play') return;
    open = true;
    panel.classList.toggle('by-pad', !!byPad);
    mark();
    panel.hidden = false;
    if (button) button.classList.add('down');
    // Whoever has opened it needs no hint.
    if (hint) hint.hidden = true;
  }

  // Presses of the button that met nothing, as last seen (-1: not yet).
  let nothing = -1;

  function close() {
    if (!open) return;
    open = false;
    panel.hidden = true;
    if (button) button.classList.remove('down');
  }

  function toggle(byPad) {
    if (open) close();
    else show(byPad);
  }

  // What is said when a toy was refused: a line where the hint was, gone
  // again in a moment (the animation restarts with each showing).
  function say(text) {
    note.textContent = text;
    note.hidden = false;
    note.style.animation = 'none';
    void note.offsetWidth;
    note.style.animation = '';
  }

  function pick(i) {
    if (!open || i < 0 || i >= TOYS.length) return;
    sel = i;
    close();
    // Asked, not just told: the engine says whether the toy went off, and
    // a player who pointed it at the sky is told why nothing happened.
    sim.ask('toy', TOYS[i].kind).then((went) => {
      if (!went) say(TOYS[i].kind === TOY.CLEAR ? 'Nothing of the toy box is out.' : 'No room for that there. It wants clear, level ground in front of you, or a bare wall.');
    }, () => {});
  }

  // Before game.js sees the key: G, and while the panel is open the
  // digits and Esc, are the toy box's.
  document.addEventListener('keydown', (e) => {
    if (state.mode !== 'play') {
      close();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const code = e.code;
    const digit = /^(Digit|Numpad)[1-9]$/.test(code) ? Number(code.slice(-1)) : 0;
    const ours = code === 'KeyG' ? sandbox : open && (code === 'Escape' || digit > 0);
    if (!ours) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat) return;
    if (code === 'KeyG') toggle(false);
    else if (code === 'Escape') close();
    else if (digit <= TOYS.length) pick(digit - 1);
  }, true);
  // Esc under pointer lock never arrives as a key: the lock goes, and the
  // menu comes up.
  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement) close();
  });
  if (button) button.addEventListener('click', () => toggle(false));
  const menuButton = document.getElementById('tb-menu');
  if (menuButton) menuButton.addEventListener('click', close);

  return {
    get open() { return open; },
    get sandbox() { return sandbox; },
    toggle,
    close,
    pick,

    // Every frame in play: the big red button pressed at nothing (the
    // sky, or out through an opened front) fires nothing, and nothing
    // said so. The tools count such presses (TOOL_STATE.BUTTON_NOTHING,
    // since the engine started); a new one is said here, in the sandbox,
    // where the button's own blast lives.
    frame(toolState) {
      const at = TOOL_STATE.BUTTON_NOTHING;
      if (at === undefined || !toolState) return;
      const n = toolState[at];
      if (n !== nothing && nothing >= 0 && sandbox) say('Nothing there: the button goes off on what the crosshair is on.');
      nothing = n;
    },

    // The mode being played has changed (game_modes.js: refresh).
    mode(m) {
      const on = m === 'sandbox';
      if (on === sandbox) return;
      sandbox = on;
      body.classList.toggle('toys-on', on);
      if (!on) close();
      else if (hint) hint.textContent = hooks.used() ? 'D-pad: toy box' : 'G: toy box';
    },

    // The gamepad, once a tick in play (game_pad.js): `hit` the buttons
    // that went down, `now` the ones that are down. Returns the buttons
    // that are the panel's this tick, for the pad to leave alone.
    pad(hit, now) {
      // (Somebody with a pad in their hands is told its button, once.)
      if (now && hint && !padHint) {
        padHint = true;
        hint.textContent = 'D-pad: toy box';
      }
      latched &= now;
      if (!open) {
        if (sandbox && hit & (PAD_UP | PAD_DOWN)) show(true);
        return latched;
      }
      if (hit & (PAD_UP | PAD_DOWN)) {
        sel = (sel + (hit & PAD_UP ? TOYS.length - 1 : 1)) % TOYS.length;
        panel.classList.add('by-pad');
        mark();
      }
      latched |= now & (PAD_A | PAD_B);
      if (hit & PAD_A) pick(sel);
      else if (hit & PAD_B) close();
      return latched;
    },
  };
}
