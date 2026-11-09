// The way into VR: finds out whether this browser, in this page, can start
// an immersive session, and only then puts an "Enter VR" button on the start
// card and in the menu, with the few VR options. Where it cannot, the start
// card gets one line that says where VR is to be had. The mode itself
// (xr.js and what it imports) is fetched when the button is used. main.js
// loads this file only where `navigator.xr` exists; nothing here touches
// the flat game.

const KEY = 'voxel-engine.vr.v1';
// turn: 'snap' (30 degree steps) or 'smooth'; hand: the one that holds the
// tool; quality: 'auto' (low on a standalone headset, medium on a PC, lower
// when frames are missed), or a tier to stay on; mirror: the left eye on the
// page's canvas; adapt: step the picture down when the headset misses frames;
// sharp: how sharp the picture is drawn ('auto': as the headset is judged
// and as it keeps up; or one of four steps, the player's own choice, made
// from inside the headset); rise: metres the player has put themselves up
// or down by (xr_rig.js: Stature).
const DEFAULTS = { turn: 'snap', vignette: true, seated: false, hand: 'right', quality: 'auto', mirror: true, adapt: true, sharp: 'auto', rise: 0 };
const CHOICES = { turn: ['snap', 'smooth'], hand: ['left', 'right'], quality: ['auto', 'low', 'medium'], sharp: ['auto', 'sharp', 'even', 'fast', 'coarse'] };
const RANGES = { rise: [-0.8, 0.8] };
// The same options from the URL, which win: vrturn=smooth, vrvignette=0,
// vrseated=1, vrhand=left, vrq=low, vrmirror=0, vradapt=0.
const QUERY = { turn: 'vrturn', vignette: 'vrvignette', seated: 'vrseated', hand: 'vrhand', quality: 'vrq', mirror: 'vrmirror', adapt: 'vradapt', sharp: 'vrsharp', rise: 'vrrise' };

function sanitize(raw, into) {
  if (!raw || typeof raw !== 'object') return into;
  for (const k of Object.keys(DEFAULTS)) {
    const v = raw[k];
    if (CHOICES[k]) { if (CHOICES[k].includes(v)) into[k] = v; }
    else if (RANGES[k]) { if (Number.isFinite(v)) into[k] = Math.max(RANGES[k][0], Math.min(RANGES[k][1], v)); }
    else if (typeof v === 'boolean') into[k] = v;
  }
  return into;
}

// What the page has stored, and on top of it what the URL asks for (which
// is for this visit only and is never written back).
function load(params) {
  const stored = { ...DEFAULTS };
  try { sanitize(JSON.parse(localStorage.getItem(KEY)), stored); } catch (e) { /* no storage, or not ours: the defaults */ }
  const url = {};
  for (const k of Object.keys(QUERY)) {
    if (!params.has(QUERY[k])) continue;
    const v = params.get(QUERY[k]);
    url[k] = CHOICES[k] ? v : RANGES[k] ? Number(v) : !/^(0|false|off|no)$/i.test(v);
  }
  return { stored, opts: sanitize(url, { ...stored }) };
}

function save(stored) {
  try { localStorage.setItem(KEY, JSON.stringify(stored)); } catch (e) { /* lasts for the session */ }
}

function framed() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

const el = (tag, props, ...children) => {
  const n = Object.assign(document.createElement(tag), props || {});
  n.append(...children);
  return n;
};

export function offer(ctx) {
  const xr = navigator.xr;
  if (!xr || !xr.isSessionSupported || !xr.requestSession) return;
  const { stored, opts } = load(ctx.params);
  const card = document.getElementById('start'), menu = document.getElementById('menu');
  const play = document.getElementById('play');
  const state = { opts, mode: null, busy: false, offered: false, hinted: false, where: null };
  const buttons = [], notes = [];
  ctx.vr = state;
  if (window.__vx) window.__vx.vr = state;

  const say = (text) => {
    for (const n of notes) { n.textContent = text; n.hidden = !text; }
  };
  const label = () => {
    for (const b of buttons) {
      b.textContent = state.mode ? 'Leave VR' : state.busy ? 'Starting VR' : 'Enter VR';
      // (Not disabled while starting: that would drop the keyboard focus to
      // the page, where Enter starts the flat game.)
      b.setAttribute('aria-busy', String(state.busy && !state.mode));
    }
  };

  async function enter() {
    if (state.mode) { state.mode.leave(); return; }
    if (state.busy) return;
    state.busy = true;
    say('');
    label();
    // Asked for inside the click, as the browser requires; the code for the
    // mode is fetched while the headset decides.
    let asked;
    try {
      // (hand-tracking: the joints of the hands, where the headset and the
      // player allow them; without them a pinch is still an input source.)
      asked = xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'hand-tracking'] });
    } catch (e) {
      asked = Promise.reject(e);
    }
    const code = import('./xr.js');
    code.catch(() => {});
    let session = null;
    try {
      session = await asked;
      const mod = await code;
      opts.onEnd = () => { state.mode = null; state.busy = false; label(); };
      // What the player sets from inside the headset is kept like what
      // they set in the menu.
      opts.keep = (key, value) => { if (key in DEFAULTS) { sanitize({ [key]: value }, opts); stored[key] = opts[key]; save(stored); } };
      state.mode = await mod.start(ctx, session, opts);
    } catch (e) {
      // Declined at the headset's prompt, no headset after all, the session
      // gone before it began, or the mode's code did not arrive.
      if (session && !state.mode) { try { session.end().catch(() => {}); } catch (err) { /* already over */ } }
      state.mode = null;
      if (!(e && e.name === 'NotAllowedError')) console.warn('VR did not start:', e);
      say(e && e.name === 'NotAllowedError' ? 'VR was not allowed to start.' : 'VR did not start: ' + String((e && e.message) || e));
    }
    state.busy = false;
    label();
  }
  state.enter = enter;

  function build() {
    if (state.offered) return;
    state.offered = true;
    if (state.where) { state.where.remove(); state.where = null; }
    const make = () => {
      const b = el('button', { className: 'vr-enter' });
      // (The start card starts the flat game on any click that reaches it.)
      b.addEventListener('click', (ev) => { ev.stopPropagation(); enter(); });
      buttons.push(b);
      const n = el('p', { className: 'note', hidden: true });
      notes.push(n);
      return [b, n];
    };
    if (card && play) {
      const [b, n] = make();
      play.after(' ', b);
      (document.getElementById('lockmsg') || b).after(n);
    }
    const footer = menu && menu.querySelector('footer');
    if (footer) {
      const [b, n] = make();
      footer.prepend(b);
      footer.before(n);
      footer.before(panel());
    }
    label();
  }

  // The VR options, in the menu's own controls.
  function panel() {
    const refresh = [];
    const seg = (key, names) => {
      const box = el('div', { className: 'seg' });
      for (const [v, text] of names) {
        const b = el('button', {}, text);
        b.addEventListener('click', () => { opts[key] = stored[key] = v; save(stored); for (const f of refresh) f(); });
        refresh.push(() => b.classList.toggle('on', opts[key] === v));
        box.append(b);
      }
      return box;
    };
    const check = (key) => {
      const c = el('input', { type: 'checkbox' });
      c.addEventListener('change', () => { opts[key] = stored[key] = c.checked; save(stored); });
      refresh.push(() => { c.checked = opts[key]; });
      return c;
    };
    const row = (text, control, cls = 'row') => el(cls === 'row' ? 'div' : 'label', { className: cls }, el('span', {}, text), control);
    const box = el('section', { id: 'vr-options' },
      el('h3', {}, 'VR'),
      row('Turning', seg('turn', [['snap', 'Snap 30°'], ['smooth', 'Smooth']])),
      row('Tool hand', seg('hand', [['left', 'Left'], ['right', 'Right']])),
      row('Quality in VR', seg('quality', [['auto', 'Auto'], ['low', 'Low'], ['medium', 'Medium']])),
      row('Vignette while moving', check('vignette'), 'row check'),
      row('Seated (fixed eye height)', check('seated'), 'row check'));
    for (const f of refresh) f();
    return box;
  }

  // One line where the page is not allowed to start VR at all: in a frame
  // whose host has not passed the permission on (a sandboxed embed).
  function hint() {
    if (state.hinted || state.offered || !card) return;
    state.hinted = true;
    if (state.where) { state.where.remove(); state.where = null; }
    // (In a frame nothing is said: a game served inside a host's page is
    // always framed, and the line was noise on every visit.)
    if (framed()) return;
    const text = 'VR is switched off for this page by the site that serves it.';
    (document.getElementById('lockmsg') || play || card.lastChild).after(el('p', { className: 'note', id: 'vr-hint' }, text));
  }

  // One quiet line where the browser could do VR and no headset answers
  // (a desktop browser, mostly): the mode exists, and this is where to look
  // for it. Not on a phone or tablet, whose card has no room to spare.
  function where() {
    if (state.where || state.offered || state.hinted || !card) return;
    let coarse = false;
    try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) { /* unknown: a desktop */ }
    if (coarse) return;
    const n = el('p', { className: 'note', id: 'vr-where' }, 'VR: open this page in a headset\'s browser, or connect one to this PC.');
    // (Quieter than the card's other notes, which say something is wrong.)
    n.style.color = 'inherit';
    n.style.opacity = '0.6';
    const last = card.lastElementChild;
    if (last && last.classList.contains('note')) last.before(n); else card.append(n);
    state.where = n;
  }

  const look = () => {
    const policy = document.permissionsPolicy || document.featurePolicy;
    let allowed = true;
    try { if (policy && policy.allowsFeature) allowed = policy.allowsFeature('xr-spatial-tracking'); } catch (e) { /* unknown: ask */ }
    if (!allowed) { hint(); return; }
    let asked;
    try { asked = xr.isSessionSupported('immersive-vr'); } catch (e) { asked = Promise.reject(e); }
    asked.then((ok) => { if (ok) build(); else where(); }, (e) => { if (e && e.name === 'SecurityError') hint(); });
  };
  look();
  // A headset plugged in or switched on later.
  if (xr.addEventListener) xr.addEventListener('devicechange', look);
}
