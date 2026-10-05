// The interactive modes' interface, set in the film's typography: a quiet
// corner menu, a one-line hint, the pollen gauge (seven cells, like the
// cuff gauge on APX-9) with the honey count, a chevron home to the skep,
// controls help (H), the menu panel (modes, time of day, sound, photo,
// fullscreen, gentle motion) and photo mode's strip.

const ICON = {
  menu: '<svg viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M15.5 4.5a7.5 7.5 0 1 0 4 13.6A8 8 0 0 1 15.5 4.5z" fill="currentColor"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="1.4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

export class Hud {
  constructor(opts) {
    this.opts = opts;
    const el = document.createElement('div');
    el.id = 'hud';
    el.innerHTML = `
      <div class="hud-corner">
        <button class="hud-btn hud-menu" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
        <span class="hud-title"></span>
      </div>
      <button class="hud-swap" aria-label=""></button>
      <div class="hud-bottom">
        <div class="hud-hint" role="status" aria-live="polite"></div>
        <div class="hud-gauge" aria-label="Pollen">
          <span class="cells">${'<i></i>'.repeat(7)}</span>
          <span class="honey" title="Pollen delivered to the skep"><b>0</b> deposits</span>
        </div>
      </div>
      <div class="hud-arrow" aria-hidden="true">${ICON.chevron}</div>
      <div class="hud-panel" role="dialog" aria-label="Garden menu" hidden>
        <div class="seg" role="radiogroup" aria-label="Mode">
          <button data-mode="film" role="radio">Film</button><button data-mode="fly" role="radio">Fly</button><button data-mode="follow" role="radio">Follow</button>
        </div>
        <label class="tod"><span class="ico">${ICON.moon}</span><input type="range" min="0" max="1" step="0.01" aria-label="Time of day"/><span class="ico">${ICON.sun}</span></label>
        <div class="row">
          <button data-act="sound" aria-pressed="false">Sound off</button>
          <button data-act="photo">Photo mode</button>
          <button data-act="help">Controls</button>
        </div>
        <div class="row">
          <button data-act="gentle" aria-pressed="false">Gentle motion</button>
          <button data-act="full">Fullscreen</button>
        </div>
      </div>
      <div class="hud-help" hidden></div>
      <div class="hud-photo" hidden>
        <span class="txt"></span>
        <button data-act="save">Save PNG</button><button data-act="exitphoto">Done</button>
      </div>
      <div class="hud-flash"></div>`;
    document.body.appendChild(el);
    this.el = el;
    this.q = (s) => el.querySelector(s);
    this.cells = [...el.querySelectorAll('.cells i')];
    this.hintEl = this.q('.hud-hint');
    this.honeyEl = this.q('.honey b');
    this.arrow = this.q('.hud-arrow');
    this.panel = this.q('.hud-panel');
    this.help = this.q('.hud-help');
    this.photo = this.q('.hud-photo');
    this.slider = this.q('.tod input');
    this.swapBtn = this.q('.hud-swap');
    this.title = this.q('.hud-title');
    this._hint = '';
    this._hintUntil = 0;
    this._baseHint = '';

    this.q('.hud-menu').addEventListener('click', () => this.togglePanel());
    this.swapBtn.addEventListener('click', () => opts.onSwap());
    this.slider.addEventListener('input', () => opts.onTime(parseFloat(this.slider.value)));
    el.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { this.togglePanel(false); opts.onMode(b.dataset.mode); }));
    el.addEventListener('click', async (e) => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      const a = b.dataset.act;
      if (a === 'sound') this.setSound(await opts.onSound());
      if (a === 'photo') { this.togglePanel(false); opts.onPhoto(); }
      if (a === 'help') { this.togglePanel(false); this.toggleHelp(true); }
      if (a === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.(); }
      if (a === 'gentle') { const r = opts.onGentle(); b.setAttribute('aria-pressed', String(r)); }
      if (a === 'save') opts.onSave();
      if (a === 'exitphoto') opts.onPhoto();
    });
    // keep clicks on the interface from steering the bee
    for (const ev of ['mousedown', 'touchstart', 'wheel']) el.addEventListener(ev, (e) => { if (e.target.closest('button, input, .hud-panel, .hud-help')) e.stopPropagation(); }, { passive: true });
  }

  show(on) { document.body.classList.toggle('explore', on); }

  setMode(mode, { touch = false } = {}) {
    this.mode = mode;
    document.body.dataset.mode = mode;
    this.title.textContent = mode === 'fly' ? 'Flying as APX-9' : mode === 'follow' ? 'Following APX-9' : '';
    this.swapBtn.textContent = mode === 'fly' ? 'Autopilot' : 'Take the controls';
    this.swapBtn.setAttribute('aria-label', mode === 'fly' ? 'Hand APX-9 back to its autopilot (C)' : 'Take control of APX-9 (C)');
    this.el.querySelectorAll('.seg button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    this.touch = touch;
    this._renderHelp();
  }

  setGentle(on) { this.q('[data-act=gentle]').setAttribute('aria-pressed', String(on)); }

  setSound(on) {
    const b = this.q('[data-act=sound]');
    b.textContent = on ? 'Sound on' : 'Sound off';
    b.setAttribute('aria-pressed', String(on));
  }

  setTime(v) { this.slider.value = String(v); }

  togglePanel(force) {
    const open = force ?? this.panel.hidden;
    this.panel.hidden = !open;
    this.q('.hud-menu').setAttribute('aria-expanded', String(open));
    this.q('.hud-menu').innerHTML = open ? ICON.close : ICON.menu;
    if (open) this.toggleHelp(false);
    this.opts.onPanel?.(open);
  }

  toggleHelp(force) {
    const open = force ?? this.help.hidden;
    this.help.hidden = !open;
    if (open) this._renderHelp();
  }

  get overlayOpen() { return !this.panel.hidden || !this.help.hidden; }

  _renderHelp() {
    const t = this.touch;
    const fly = this.mode === 'fly';
    const rows = fly
      ? (t
        ? [['Left stick', 'up/down: fly forward · back; left/right: turn'], ['Drag the view', 'look around and steer'], ['▲ ▼', 'climb · descend'], ['»', 'boost'], ['Settle', 'descend gently onto a bloom to land and gather pollen'], ['The skep', 'fly into the doorway to deposit pollen']]
        : [['Mouse', 'steer (click to capture the pointer, Esc to release)'], ['W S · ↑ ↓', 'fly forward · back'], ['A D · ← →', 'turn (the camera turns with you)'], ['Space / E · Shift / Q', 'climb · descend'], ['F or hold left mouse', 'boost'], ['Settle on a bloom', 'descend gently onto it to gather pollen'], ['The skep', 'fly into its doorway to deposit'], ['The escapement', 'touch it to wind the garden']])
      : (t
        ? [['Drag', 'orbit the camera'], ['Pinch', 'zoom'], ['Take the controls', 'fly APX-9 from where it is']]
        : [['Drag', 'orbit the camera'], ['Wheel', 'zoom'], ['C', 'take the controls, from where APX-9 is']]);
    const common = t ? [] : [['C', fly ? 'hand back to the autopilot' : ''], ['T · [ ]', 'time of day'], ['P', 'photo mode'], ['M', 'sound'], ['H', 'this help'], ['G', 'menu']].filter((r) => r[1]);
    const gp = fly && !t ? [['Gamepad', 'sticks fly and look · A climb · B or LT descend · RB boost · Y autopilot']] : [];
    this.help.innerHTML = `<h2>${fly ? 'Flying as APX-9' : 'Following APX-9'}</h2><dl>${[...rows, ...common, ...gp].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl><p class="foot">${t ? 'Tap anywhere to close' : 'Press H to close'}</p>`;
  }

  // a message for a few seconds, then back to the standing hint
  flashHint(text, secs = 3.5) {
    this._hint = text;
    this._hintUntil = performance.now() + secs * 1000;
    this._setHint(text);
  }

  baseHint(text) {
    this._baseHint = text;
    if (performance.now() > this._hintUntil) this._setHint(text);
  }

  _setHint(text) {
    if (this.hintEl.textContent === text) return;
    this.hintEl.classList.remove('in');
    void this.hintEl.offsetWidth;
    this.hintEl.textContent = text;
    this.hintEl.classList.add('in');
  }

  flash() {
    const f = this.q('.hud-flash');
    f.classList.remove('go');
    void f.offsetWidth;
    f.classList.add('go');
  }

  update({ pollen, honey, arrow, photo, photoText, hint }) {
    if (hint !== undefined) this.baseHint(hint);
    if (performance.now() > this._hintUntil && this._hint) { this._hint = ''; this._setHint(this._baseHint); }
    const n = pollen * 7;
    this.cells.forEach((c, i) => { const k = Math.max(0, Math.min(1, n - i)); c.style.setProperty('--k', k.toFixed(2)); });
    if (String(honey) !== this.honeyEl.textContent) this.honeyEl.textContent = String(honey);
    if (arrow) {
      this.arrow.style.opacity = '1';
      this.arrow.style.transform = `translate(${arrow.x.toFixed(1)}px, ${arrow.y.toFixed(1)}px) rotate(${arrow.a.toFixed(3)}rad)`;
    } else this.arrow.style.opacity = '0';
    this.photo.hidden = !photo;
    if (photo) this.photo.querySelector('.txt').textContent = photoText;
    document.body.classList.toggle('photo', !!photo);
  }
}
