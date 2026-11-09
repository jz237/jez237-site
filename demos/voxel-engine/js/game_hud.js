// Tool belt, crosshair, tool hint and status pills. DOM writes happen only
// when a displayed value changes; nothing here allocates per frame.
import { OBJ, OUT, PFLAG, TOOL, TOOL_STATE } from './engine.js';

// `bar` marks the tools whose cooldown is long enough to be worth a bar
// under the crosshair. Reach, cooldowns and limits are the engine's own
// (TOOL_STATE.AIM / COOL_FRACTION / MAX_CHARGES): nothing is copied here.
export const TOOLS = [
  { name: 'Sledgehammer', short: 'Hammer', bar: true, hint: 'Hold Fire to swing. Chews wood, plaster and brick; concrete only chips.', icon: '<path d="M5 20l8.5-10"/><path d="M10.5 6.5l3-3.5 7 6-3 3.5z"/>' },
  { name: 'Rifle', short: 'Rifle', bar: false, hint: 'Hold Fire. Through boards, plaster and thin metal; brick only pocks.', icon: '<circle cx="12" cy="12" r="5.5"/><path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5"/>' },
  { name: 'Shotgun', short: 'Shotgun', bar: true, hint: 'Ten pellets. Tears up anything close and shoves loose debris.', icon: '<path d="M3 12h6"/><circle class="f" cx="13.5" cy="6.5" r="1.4"/><circle class="f" cx="15.5" cy="12" r="1.4"/><circle class="f" cx="13.5" cy="17.5" r="1.4"/><circle class="f" cx="20" cy="8.5" r="1.4"/><circle class="f" cx="20" cy="15.5" r="1.4"/>' },
  { name: 'Rocket launcher', short: 'Rocket', bar: false, hint: 'Blows a 6 m hole in brick or concrete and cuts the concrete columns it reaches. Steel takes a cutting charge.', icon: '<path d="M9 8.5h7l5 3.5-5 3.5H9z"/><path d="M9 8.5L5.5 6v12L9 15.5"/><path d="M2.5 12h3"/>' },
  { name: 'Charges', short: 'Charges', bar: false, hint: 'Fire sticks one on, Alt sets them off in order. Each cuts through 1.2 m of stone, concrete or steel.', icon: '<rect x="5.5" y="10" width="13" height="9.5" rx="1.5"/><path d="M12 10V7.5c0-2 3.5-1.5 3.5-4"/><circle class="f" cx="12" cy="14.75" r="1.6"/>' },
  { name: 'Gravity gun', short: 'Gravity', bar: false, hint: 'Hold Fire to carry a loose piece. Alt throws it.', icon: '<path d="M6.5 4v8a5.5 5.5 0 0 0 11 0V4"/><path d="M4 4h5M15 4h5M4 8h5M15 8h5"/>' },
  { name: 'Cannon', short: 'Cannon', bar: true, hint: 'A 450 kg steel ball: through a brick wall and out the other side.', icon: '<circle cx="14.5" cy="12" r="6"/><path d="M2.5 8.5h4M2.5 12h2.5M2.5 15.5h4"/>' },
  { name: 'Spawner', short: 'Spawner', bar: false, hint: 'Fire sets one down. Alt picks something else.', icon: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>' },
  { name: 'Flamethrower', short: 'Flame', bar: false, hint: 'Hold Fire. Leaves and cloth catch at once, timber in a moment. What chars gives way.', icon: '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3 2.2-4.6 3.2-7.4.5 1.6 1.4 2.4 2.3 2.8C11.2 8 12.4 5 11.6 3c3.6 2 6.4 6.6 6.4 11.4 0 4-2.6 6.6-6 6.6z"/>' },
  { name: 'Satchel', short: 'Satchel', bar: true, hint: 'Fire throws one; it goes off in 3.5 s, or at once on Alt. Takes out two bays of a frame, or a brick house: do not be near it.', icon: '<rect x="4.5" y="9" width="15" height="10.5" rx="2"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"/><path d="M4.5 13.5h15"/>' },
  { name: 'Breaching charges', short: 'Breach', bar: false, hint: 'Fire sticks one on, Alt sets them off one after another. Each cuts a clean hole 1.7 m across straight through up to 2.4 m of anything: duck to go through it.', icon: '<rect x="3.5" y="5" width="5" height="14" rx="1"/><path d="M8.5 12h12"/><path d="M17 8.5l3.5 3.5-3.5 3.5"/>' },
  { name: 'Air strike', short: 'Strike', bar: true, hint: 'Fire marks the spot. Three bombs follow in a line away from you: get clear.', icon: '<path d="M12 3v9"/><path d="M8.5 6.5L12 3l3.5 3.5"/><path d="M9 12h6l-1 6h-4z"/><path d="M5 21h14"/>' },
];
// Keys of the belt, in its order: digits, then the two keys right of 0.
export const TOOL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
const SPAWN_NAMES = ['Wooden crate', 'Concrete block', 'Steel beam', 'Glass pane', 'Explosive barrel', 'Car', 'Dump truck', 'Bulldozer'];
const HINT_MS = 6000;
// Pre-built style values so crosshair updates create no strings. Each part
// of the crosshair is moved by a transform on its own element, which costs
// no layout (and no style pass over the rest of the crosshair).
const steps = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i));
const MAX_GAP = 200;
const SHIFT = [
  steps(MAX_GAP, (i) => `translateY(${-i}px)`), steps(MAX_GAP, (i) => `translateX(${i}px)`),
  steps(MAX_GAP, (i) => `translateY(${i}px)`), steps(MAX_GAP, (i) => `translateX(${-i}px)`),
];
const PX = steps(400, (i) => i * 0.5 + 'px');
const SCALE = steps(20, (i) => `scaleX(${i / 20})`);
const STATUS = ['Slow motion 0.2x', 'Paused', 'Fly'];
// The player's own slow motion (game.js, SLOW_MOTION), as the first pill says.
const SLOW_FACTOR = 0.2;

export function createHud(ctx, state, feel) {
  const { sim } = ctx;
  const cross = document.getElementById('cross');
  const ticks = ['t', 'r', 'b', 'l'].map((side) => cross.querySelector('.tick.' + side));
  const ringEl = cross.querySelector('.ring');
  const coolEl = cross.querySelector('.cool');
  const belt = document.getElementById('belt');
  const hint = document.getElementById('toolhint');
  const nameEl = document.getElementById('toolname');
  const textEl = document.getElementById('tooltext');
  const statusEl = document.getElementById('status');
  const slots = [];
  let chargeBadge = null, breachBadge = null, fuelBadge = null;

  // Icons are static markup from the table above, never user input.
  TOOLS.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'slot';
    b.tabIndex = -1;
    b.setAttribute('aria-label', t.name);
    b.innerHTML = `<span class="key">${TOOL_KEYS[i] || ''}</span><svg viewBox="0 0 24 24" aria-hidden="true">${t.icon}</svg><span class="name">${t.short}</span>`;
    if (i === TOOL.CHARGE) {
      chargeBadge = document.createElement('span');
      chargeBadge.className = 'badge';
      b.appendChild(chargeBadge);
    }
    if (i === TOOL.BREACH) {
      breachBadge = document.createElement('span');
      breachBadge.className = 'badge';
      b.appendChild(breachBadge);
    }
    if (i === TOOL.FLAME) {
      fuelBadge = document.createElement('span');
      fuelBadge.className = 'badge';
      b.appendChild(fuelBadge);
    }
    b.addEventListener('click', () => state.selectTool(i));
    belt.appendChild(b);
    slots.push(b);
  });

  // Last values written to the DOM.
  let tool = -1, gap = -1, ring = -1, cool = -1, classes = -1, status = -1;
  let charges = -1, item = -1, maxCharges = 0, stock = -1, allowed = -1, fuel = -1, afield = -1;
  // Pixels per radian at the screen centre, per degree of fov: the window
  // height is read on resize, not per frame (reading it can force layout).
  let halfHeight = window.innerHeight * 0.5;
  window.addEventListener('resize', () => { halfHeight = window.innerHeight * 0.5; });
  // When the hint was last (re)written; it fades out HINT_MS later.
  let hintAt = 0, hintIdle = false;

  function showTool(t, ts) {
    tool = t;
    for (let i = 0; i < slots.length; i++) slots[i].classList.toggle('on', i === t);
    cross.dataset.tool = String(t);
    describe(ts);
  }

  function describe(ts) {
    const t = TOOLS[tool];
    charges = ts[TOOL_STATE.CHARGES];
    item = ts[TOOL_STATE.SPAWN_ITEM];
    maxCharges = ts[TOOL_STATE.MAX_CHARGES];
    // In an objective the charges are counted down, not up.
    const placed = stock >= 0 ? `${charges} placed, ${stock} left` : `${charges}/${maxCharges}`;
    // Satchels out, and air strikes on their way (and how many a mode
    // has left): one number that says both, for the change check.
    const sat = ts[TOOL_STATE.SATCHELS] | 0, strikes = ts[TOOL_STATE.STRIKES] | 0, calls = ts[TOOL_STATE.STRIKE_STOCK];
    afield = sat + 16 * strikes + 256 * (calls | 0);
    const called = (strikes > 0 ? ' on its way' : '') + (calls >= 0 ? `, ${calls} left` : '');
    nameEl.textContent = tool === TOOL.SPAWNER ? SPAWN_NAMES[item] || t.name : tool === TOOL.CHARGE || tool === TOOL.BREACH ? `${t.name} ${placed}` : tool === TOOL.FLAME ? `${t.name} ${fuel}%`
      : tool === TOOL.SATCHEL && sat > 0 ? `${t.name} ${sat}/${ts[TOOL_STATE.MAX_SATCHELS]} out` : tool === TOOL.STRIKE && called ? `${t.name}${called}` : t.name;
    textEl.textContent = t.hint;
    // Each kind's count on its own slot: the two share one allowance.
    const breaches = ts[TOOL_STATE.BREACHES] | 0;
    chargeBadge.textContent = charges - breaches > 0 ? String(charges - breaches) : '';
    breachBadge.textContent = breaches > 0 ? String(breaches) : '';
    hintAt = performance.now();
    hintIdle = false;
    hint.classList.remove('idle');
  }

  return {
    frame(out, now) {
      const frame = sim.frame, ts = frame.toolState;
      const t = state.tool;
      if (state.allowed !== allowed) {
        allowed = state.allowed;
        for (let i = 0; i < slots.length; i++) slots[i].classList.toggle('off', !(allowed & (1 << i)));
      }
      const left = frame.objective[OBJ.CHARGES_LEFT];
      const restock = left !== stock;
      stock = left;
      // The flamethrower's tank, in steps of 5%: on its slot while it is
      // not full, and beside the name while the tool is in hand.
      const fu = Math.round(ts[TOOL_STATE.FUEL] * 20) * 5;
      if (fu !== fuel) {
        fuel = fu;
        fuelBadge.textContent = fu < 100 ? fu + '%' : '';
        if (tool === TOOL.FLAME) nameEl.textContent = `${TOOLS[tool].name} ${fu}%`;
      }
      if (t !== tool) showTool(t, ts);
      // (`afield`, not `out`: under that name the number was hidden here by
      // this function's own `out`, the engine's block, which no number
      // equals: the tool was described again every frame, and its hint,
      // written "just now" every frame, never faded.)
      else if (restock || ts[TOOL_STATE.CHARGES] !== charges || ts[TOOL_STATE.SPAWN_ITEM] !== item || (ts[TOOL_STATE.SATCHELS] | 0) + 16 * (ts[TOOL_STATE.STRIKES] | 0) + 256 * (ts[TOOL_STATE.STRIKE_STOCK] | 0) !== afield) describe(ts);
      if (!hintIdle && now - hintAt > HINT_MS) {
        hintIdle = true;
        hint.classList.add('idle');
      }

      // Crosshair geometry follows the real spread: the rifle's gap and the
      // shotgun's ring are the cone the shots land in.
      const fov = frame.f32[(out.byteOffset >> 2) + OUT.CAM_FOV];
      const pxPerRad = halfHeight / Math.tan(fov * Math.PI / 360);
      const spread = ts[TOOL_STATE.SPREAD] * pxPerRad;
      const held = ts[TOOL_STATE.HELD_BODY] !== 0;
      let g = 6, r = 12;
      if (t === TOOL.RIFLE) g = 3.5 + spread;
      else if (t === TOOL.SHOTGUN) r = 2 * spread;
      else if (t === TOOL.ROCKET) g = 7;
      else if (t === TOOL.CHARGE || t === TOOL.BREACH) g = 9;
      else if (t === TOOL.SATCHEL) g = 7;
      else if (t === TOOL.STRIKE) r = 20;
      else if (t === TOOL.GRAVITY) r = held ? 14 : 24;
      else if (t === TOOL.CANNON) r = 16;
      else if (t === TOOL.SPAWNER) g = 3;
      const gi = Math.min(MAX_GAP, Math.round(g)), ri = Math.min(400, Math.round(r * 2));
      if (gi !== gap) {
        gap = gi;
        for (let i = 0; i < 4; i++) ticks[i].style.transform = SHIFT[i][gi];
      }
      if (ri !== ring) ringEl.style.width = ringEl.style.height = PX[ring = ri];
      const ci = TOOLS[t].bar ? Math.round(ts[TOOL_STATE.COOL_FRACTION] * 20) : 0;
      if (ci !== cool) coolEl.style.transform = SCALE[cool = ci];

      const canUse = ts[TOOL_STATE.AIM] !== 0;
      const hit = feel.hit;
      const cls = (canUse ? 1 : 0) | (held ? 2 : 0) | (hit ? 4 : 0);
      if (cls !== classes) {
        classes = cls;
        cross.classList.toggle('can', canUse);
        cross.classList.toggle('held', held);
        cross.classList.toggle('hit', hit);
      }

      // A harness camera is always a free camera: no point saying so in
      // every screenshot.
      const flying = !ctx.harness && (out[OUT.PLAYER_FLAGS] & PFLAG.NOCLIP) !== 0;
      // Game time behind the clock because the machine cannot keep up
      // (main.js, governor.js): the same pill as the player's own slow
      // motion, with the factor that is really running, in tenths.
      const gov = ctx.governor, lag = gov && gov.slow && !ctx.harness ? Math.max(1, Math.min(9, Math.round(gov.speed * 10))) : 0;
      const st = (state.slow ? 1 : 0) | (state.paused ? 2 : 0) | (flying ? 4 : 0) | lag << 3;
      if (st !== status) {
        status = st;
        statusEl.textContent = '';
        for (let i = 0; i < STATUS.length; i++) {
          // Pause hides the slow-motion pill: one state at a time is enough.
          if (!(st & (1 << i) || (i === 0 && lag)) || (i === 0 && st & 2)) continue;
          const s = document.createElement('span');
          s.textContent = i === 0 && lag ? `Slow motion ${((state.slow ? SLOW_FACTOR : 1) * lag / 10).toFixed(state.slow ? 2 : 1)}x` : STATUS[i];
          statusEl.appendChild(s);
        }
      }
    },
  };
}
