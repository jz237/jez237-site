// Minimal, unobtrusive playback controls. They fade away while the film plays
// and return on pointer movement or keyboard focus.

const ICONS = {
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/></svg>',
  replay: '<svg viewBox="0 0 24 24"><path d="M12 5a7 7 0 1 1-6.6 4.7l1.9.6A5 5 0 1 0 12 7v3L7.5 6 12 2z"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4zM15.5 9l5 6m0-6l-5 6" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>',
  motion: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M12 7.5v4.8l3 1.8" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
  // a bee's wing pair over a hexagon cell: the interactive modes
  explore: '<svg viewBox="0 0 24 24"><path d="M12 13.2l3.4 2v3.9L12 21l-3.4-1.9v-3.9z" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M11.4 12.2C9 7.5 4.6 6.9 4.2 9.3c-.3 2 3.4 3.3 7.2 2.9zM12.6 12.2C15 7.5 19.4 6.9 19.8 9.3c.3 2-3.4 3.3-7.2 2.9z" fill="currentColor" opacity=".85"/></svg>',
};

export class Controls {
  constructor(opts) {
    this.opts = opts;
    this.dirty = false;
    const bar = document.createElement('div');
    bar.id = 'controls';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Film controls');
    bar.innerHTML = `
      <button class="btn" data-act="play" aria-label="Pause">${ICONS.pause}</button>
      <button class="btn" data-act="replay" aria-label="Replay from the beginning">${ICONS.replay}</button>
      <div class="scrub" role="slider" tabindex="0" aria-label="Timeline" aria-valuemin="0" aria-valuemax="${opts.duration}" aria-valuenow="0"><div class="fill"></div><div class="knob"></div></div>
      <span class="time">0:00</span>
      <button class="btn" data-act="motion" aria-label="Gentle motion" aria-pressed="false">${ICONS.motion}</button>
      <button class="btn" data-act="sound" aria-label="Turn sound on" aria-pressed="false">${ICONS.soundOff}</button>
      <button class="btn" data-act="explore" aria-label="Explore the garden" aria-haspopup="true" aria-expanded="false">${ICONS.explore}</button>
      <button class="btn" data-act="full" aria-label="Fullscreen">${ICONS.full}</button>
      <div class="pop" role="menu" hidden>
        <button role="menuitem" data-mode="fly">Fly as APX-9</button>
        <button role="menuitem" data-mode="follow">Follow APX-9</button>
      </div>`;
    document.body.appendChild(bar);
    this.bar = bar;
    this.playBtn = bar.querySelector('[data-act=play]');
    this.soundBtn = bar.querySelector('[data-act=sound]');
    this.motionBtn = bar.querySelector('[data-act=motion]');
    this.scrub = bar.querySelector('.scrub');
    this.fill = bar.querySelector('.fill');
    this.knob = bar.querySelector('.knob');
    this.timeEl = bar.querySelector('.time');
    this.motionBtn.setAttribute('aria-pressed', String(opts.reduced()));

    this.enabled = true;
    this.pop = bar.querySelector('.pop');
    bar.addEventListener('click', async (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.mode) { this.pop.hidden = true; opts.onMode?.(b.dataset.mode); return; }
      const act = b.dataset.act;
      if (act === 'explore') {
        this.pop.hidden = !this.pop.hidden;
        b.setAttribute('aria-expanded', String(!this.pop.hidden));
        if (!this.pop.hidden) this.pop.querySelector('button').focus();
      }
      if (act === 'play') opts.onPlayPause();
      if (act === 'replay') opts.onReplay();
      if (act === 'full') this.toggleFull();
      if (act === 'sound') {
        const on = await opts.onSound();
        this.soundBtn.innerHTML = on ? ICONS.soundOn : ICONS.soundOff;
        this.soundBtn.setAttribute('aria-pressed', String(on));
        this.soundBtn.setAttribute('aria-label', on ? 'Mute sound' : 'Turn sound on');
      }
      if (act === 'motion') {
        const r = opts.onMotion();
        this.motionBtn.setAttribute('aria-pressed', String(r));
        this.dirty = true;
        this.toast(r ? 'Gentle motion on' : 'Full motion');
      }
      this.poke();
    });

    const seekFrom = (ev) => {
      const r = this.scrub.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      opts.onSeek(k * opts.duration);
    };
    let dragging = false;
    this.scrub.addEventListener('pointerdown', (e) => { dragging = true; this.scrub.setPointerCapture(e.pointerId); seekFrom(e); });
    this.scrub.addEventListener('pointermove', (e) => { if (dragging) seekFrom(e); });
    this.scrub.addEventListener('pointerup', () => { dragging = false; });
    this.scrub.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') opts.onSeek(Math.min(opts.duration, this.t + 2));
      if (e.key === 'ArrowLeft') opts.onSeek(Math.max(0, this.t - 2));
    });

    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      if (e.target.closest && e.target.closest('.scrub')) return;
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'k') { e.preventDefault(); opts.onPlayPause(); }
      else if (k === 'r') opts.onReplay();
      else if (k === 'f') this.toggleFull();
      else if (k === 'm') this.soundBtn.click();
      else if (k === 'h') document.body.classList.toggle('clean');
      else if (k === 'arrowright') opts.onSeek(Math.min(opts.duration, this.t + 2));
      else if (k === 'arrowleft') opts.onSeek(Math.max(0, this.t - 2));
      this.poke();
    });
    ['pointermove', 'pointerdown', 'touchstart'].forEach((ev) => window.addEventListener(ev, () => { if (this.enabled) this.poke(); }, { passive: true }));
    this.t = 0;
    this.poke();
  }

  enable(on) {
    this.enabled = on;
    this.bar.hidden = !on;
    this.pop.hidden = true;
    if (!on) document.body.classList.remove('ui-awake', 'ended');
  }

  setSound(on) {
    this.soundBtn.innerHTML = on ? ICONS.soundOn : ICONS.soundOff;
    this.soundBtn.setAttribute('aria-pressed', String(on));
    this.soundBtn.setAttribute('aria-label', on ? 'Mute sound' : 'Turn sound on');
  }

  poke() {
    document.body.classList.add('ui-awake');
    clearTimeout(this._hide);
    this._hide = setTimeout(() => {
      if (!this.bar.matches(':hover') && !this.bar.contains(document.activeElement)) document.body.classList.remove('ui-awake');
    }, 2600);
  }

  toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }

  toast(msg) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toast);
    this._toast = setTimeout(() => el.classList.remove('show'), 1800);
  }

  showGentleNotice() {
    const n = document.createElement('div');
    n.id = 'gentle';
    n.innerHTML = `<p>Your system asks for reduced motion. The film will play with a steadier camera and slower wings.</p>
      <div><button data-k="gentle">Play gently</button><button data-k="full">Play full motion</button></div>`;
    document.body.appendChild(n);
    n.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.k === 'full' && this.opts.reduced()) this.motionBtn.click();
      n.remove();
      this.opts.onPlayPause();
    });
  }

  ended() {
    this.poke();
    document.body.classList.add('ended');
  }

  sync(state) {
    this.t = state.t;
    const k = state.t / this.opts.duration;
    this.fill.style.transform = `scaleX(${k})`;
    this.knob.style.left = `${k * 100}%`;
    this.scrub.setAttribute('aria-valuenow', state.t.toFixed(1));
    const s = Math.floor(state.t);
    this.timeEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const playing = state.playing;
    if (this._playing !== playing) {
      this._playing = playing;
      this.playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
      this.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      if (playing) document.body.classList.remove('ended');
    }
  }
}
