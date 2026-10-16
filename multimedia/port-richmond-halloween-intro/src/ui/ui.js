// PORT RICHMOND: Halloween intro - UI layer (owner: UI).
//
//   import { createUI } from './ui/ui.js';
//   const ui = createUI({ stage, onStart(withSound), onSkip(info), onMute(muted), onReplay(), onQuality(q) });
//   ui.setProgress(0.4, 'Loading the street');  ui.setState('ready');
//   every frame:  ui.updateTitle(filmSeconds)   // title overlay + chapter highlight, deterministic from t
//
// The layer is DOM inside the stage (see ui.css). It owns the start gate, the in-film Skip / Mute / Full screen
// controls, the title-state page actions and an HTML/CSS recreation of the game's title menu. It never touches the
// renderer or the audio: user actions arrive in main.js through the callbacks. See docs/ui-notes.md for the
// integration contract.
//
// State machine (ui.state):  loading -> ready -> playing -> title,  title --R/replay--> playing,  any -> error
//   The UI moves itself on user actions (Start -> playing, Skip -> title, Replay -> playing) and on
//   updateTitle(t >= FILM.duration) while playing (-> title). main.js drives loading/ready/error with setState().
//
// Capture mode (?capture=1, or createUI({ capture: true })): start gate, controls, actions and notes are never shown
// and no wall-clock transition runs; the title overlay is drawn purely from updateTitle(t) for frame capture.

import { CUES, FILM, SECTIONS } from '../film/cues.js';

const TITLE = 'PORT RICHMOND';
const SUBTITLE = 'PHILADELPHIA   -   THE FIRST NIGHT';
const TAGLINE = 'Survive the outbreak in the real streets around Witte St & E Venango.';
// The game's title menu rows (PRMenu + PRHUDMenu.cpp), New Game selected, no save on this machine.
// ink / dink: ink widths (em) of label / description in Roboto, the game's font (tools/ui/roboto-metrics.mjs); every
// text is fitted to its game width with letter-spacing, so the composition holds with Noto Sans, Segoe UI or SF.
const MENU = [
  { label: 'New Game', ink: 4.7633, desc: 'Free Roam', dink: 4.6363, sel: true },
  { label: 'Continue', ink: 3.8953, desc: 'no saved game yet', dink: 8.2366, off: true },
  { label: 'Showcase', ink: 4.5188, desc: 'every zombie type, every weapon', dink: 14.4549 },
  { label: 'Horde', ink: 2.5963, desc: 'arcade waves', dink: 5.9976 },
  { label: 'Rooftop Overwatch', ink: 8.3968, desc: "sniper on a roof - clear E Venango for the survivors' van", dink: 24.2415 },
  { label: 'Fly over the neighbourhood', ink: 11.8961, desc: 'explore the whole map', dink: 9.9536 },
  { label: 'Controls', ink: 3.6612 },
  { label: 'Settings', ink: 3.5718 },
  { label: 'Quit', ink: 1.7314 },
];
const HINTS = 'New Game: Free Roam   -   Showcase: every zombie type   -   Horde: arcade waves';
const KEYS = 'Arrows / mouse to choose   -   Enter to select';
const QUALITIES = [['auto', 'Auto'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']];
// Ink widths in em. The title is the width measured on review/ref/title_3.jpg (7.77 em at the game's 64 pt); the
// rest are Roboto at the game's sizes.
const INK_EM = { title: 7.770, sub: 16.4839, tag: 30.0599, demo: 5.351, hints: 35.9051, tab: 6.1604, keys: 19.8398 };

// Title animation (film seconds). Everything is a pure function of t.
const T_FADE = CUES.titleFadeIn; // washes fade in with the street
const T_DRAW = CUES.titleDraw; // letters rise in one by one, then the gold rule draws
const T_MENU = CUES.menuIn; // rows slide in one by one, New Game's band sweeps in
const LETTER_STEP = 0.06;
const LETTER_DUR = 0.45;
const ROW_STEP = 0.1;
const ROW_DUR = 0.35;
const T_DONE = T_MENU + 1.6; // everything settled (83.6 with the default cues)

const ICONS = {
  play: '<path d="M7.5 5.2v13.6L18.8 12z"/>',
  skip: '<path d="M3.6 6.3v11.4L11 12zM11.6 6.3v11.4L19 12z"/><rect x="19.3" y="6" width="2.1" height="12" rx=".7"/>',
  soundOn: '<path d="M3.8 9.3h3.5L12 5.4v13.2l-4.7-3.9H3.8z"/><path d="M15 9a4.2 4.2 0 0 1 0 6M17.6 6.6a7.6 7.6 0 0 1 0 10.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  soundOff: '<path d="M3.8 9.3h3.5L12 5.4v13.2l-4.7-3.9H3.8z"/><path d="M15.6 9.6l4.8 4.8M20.4 9.6l-4.8 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  fsOn: '<path d="M4 9.2V4h5.2M14.8 4H20v5.2M20 14.8V20h-5.2M9.2 20H4v-5.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  fsOff: '<path d="M9.2 4v5.2H4M20 9.2h-5.2V4M14.8 20v-5.2H20M4 14.8h5.2V20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  replay: '<path d="M5.3 12.6A6.8 6.8 0 1 0 7.4 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.6 3.9v4.6h4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  reel: '<rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.2 9.3v5.4l4.6-2.7z"/>',
  back: '<path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  warn: '<path d="M12 3.6 2.4 20.2h19.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.6v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.15"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const seg = (t, a, d) => clamp01((t - a) / d);
const easeOut = (x) => 1 - (1 - x) * (1 - x) * (1 - x);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const noop = () => {};

function ensureCss() {
  if (document.querySelector('link[data-prh-ui], link[rel="stylesheet"][href*="ui/ui.css"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./ui.css', import.meta.url).href;
  link.dataset.prhUi = '';
  document.head.appendChild(link);
}

function titleMarkup() {
  const letters = [...TITLE].map((ch) => `<span class="prh-ch">${ch}</span>`).join('');
  const rows = MENU.map((r, i) => {
    const cls = `prh-row${r.sel ? ' is-sel' : ''}${r.off ? ' is-off' : ''}`;
    const band = r.sel ? '<span class="prh-band"></span><span class="prh-bar"></span>' : '';
    const desc = r.desc ? `<span class="prh-desc" data-ink="${r.dink}">${esc(r.desc)}</span>` : '';
    return `<div class="${cls}" style="--i:${i}">${band}<div class="prh-t prh-row-text"><span class="prh-label" data-ink="${r.ink}">${esc(r.label)}</span>${desc}</div></div>`;
  }).join('');
  const label = `${TITLE} title screen, recreated from the game: Philadelphia, The First Night. ` +
    `Menu: ${MENU.map((r) => r.label + (r.desc ? ` (${r.desc})` : '')).join(', ')}. New Game is selected. Demo beta.`;
  return `
  <div class="prh-title" role="img" aria-label="${esc(label)}">
    <div class="prh-wash"></div>
    <div class="prh-rowsband"></div>
    <div class="prh-logo">
      <div class="prh-t prh-logo-title"><span class="prh-word">${letters}</span><span class="prh-rule"></span></div>
      <div class="prh-t prh-logo-sub" data-ink="${INK_EM.sub}">${esc(SUBTITLE)}</div>
      <div class="prh-t prh-logo-tag" data-ink="${INK_EM.tag}">${esc(TAGLINE)}</div>
    </div>
    <div class="prh-menu">${rows}</div>
    <div class="prh-foot">
      <div class="prh-t prh-demo" data-ink="${INK_EM.demo}">DEMO BETA</div>
      <div class="prh-t prh-hints" data-ink="${INK_EM.hints}">${esc(HINTS)}</div>
      <div class="prh-t prh-tab" data-ink="${INK_EM.tab}">Tab: next area</div>
      <div class="prh-t prh-keys" data-ink="${INK_EM.keys}">${esc(KEYS)}</div>
    </div>
  </div>`;
}

function startMarkup(uid) {
  const radios = QUALITIES.map(([q, l]) =>
    `<label><input type="radio" name="${uid}-q" value="${q}"${q === 'auto' ? ' checked' : ''}><span>${l}</span></label>`).join('');
  return `
  <div class="prh-start">
    <div class="prh-start-card" role="group" aria-labelledby="${uid}-h" aria-describedby="${uid}-w">
      <div class="prh-kicker">Halloween 2026 · Real-time film</div>
      <div class="prh-start-logo" role="heading" aria-level="2" id="${uid}-h">
        <span class="prh-start-title">PORT RICHMOND</span>
        <span class="prh-start-sub"><span class="prh-sr">: </span>Halloween Intro</span>
      </div>
      <div class="prh-start-line">A real-time Three.js film for the Unreal Engine 5 zombie game.</div>
      <div class="prh-warn" id="${uid}-w">${svg('warn')}<span><b>Content warning.</b> Graphic horror, blood and gore, and sudden loud sounds. No strobing or flashing lights.</span></div>
      <div class="prh-start-actions">
        <button type="button" class="prh-btn prh-btn-primary" data-act="start-sound" disabled>${svg('play')}<span>Start with sound</span></button>
        <button type="button" class="prh-btn" data-act="start-muted" disabled>${svg('soundOff')}<span>Start muted</span></button>
      </div>
      <div class="prh-start-opts">
        <fieldset class="prh-quality">
          <legend>Quality</legend>
          <span class="prh-seg">${radios}</span>
          <span class="prh-q-auto" aria-live="polite"></span>
        </fieldset>
        <div class="prh-progress">
          <div class="prh-progress-track" role="progressbar" aria-label="Loading the film" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="prh-progress-fill"></div></div>
          <div class="prh-progress-label" aria-live="polite">Loading…</div>
        </div>
        <div class="prh-start-foot">
          <span class="prh-keyhint"><kbd>Space</kbd> start · <kbd>S</kbd> skip · <kbd>M</kbd> mute</span>
          <button type="button" class="prh-linkbtn" data-act="skip-start" disabled>Skip to the title screen</button>
        </div>
      </div>
    </div>
  </div>`;
}

function controlsMarkup(links) {
  return `
  <div class="prh-controls" role="group" aria-label="Film controls">
    <button type="button" class="prh-ctl prh-skip" data-act="skip" aria-keyshortcuts="S Escape">${svg('skip')}<span>Skip intro</span></button>
    <button type="button" class="prh-ctl prh-icon" data-act="mute" aria-pressed="false" aria-keyshortcuts="M">${svg('soundOn')}</button>
    <button type="button" class="prh-ctl prh-icon" data-act="fullscreen" aria-keyshortcuts="F" hidden>${svg('fsOn')}</button>
  </div>
  <nav class="prh-actions" aria-label="Page">
    <button type="button" class="prh-pill prh-gold" data-act="replay" aria-label="Replay intro" aria-keyshortcuts="R">${svg('replay')}<span class="prh-long">Replay intro</span><span class="prh-short">Replay</span></button>
    <a class="prh-pill" href="${esc(links.titleWalk)}" aria-label="Watch the game's title walk">${svg('reel')}<span class="prh-long">Watch the game's title walk</span><span class="prh-short">Title walk</span></a>
    <a class="prh-pill" href="${esc(links.multimedia)}" aria-label="Back to Multimedia">${svg('back')}<span class="prh-long">Multimedia</span><span class="prh-short">Multimedia</span></a>
    <button type="button" class="prh-pill prh-icon" data-act="mute" aria-pressed="false" aria-keyshortcuts="M">${svg('soundOn')}</button>
  </nav>
  <div class="prh-note" role="status"></div>
  <div class="prh-error" role="alert">
    <div class="prh-error-card">
      <div class="prh-error-title">The film couldn't start</div>
      <div class="prh-error-msg"></div>
      <div class="prh-error-actions">
        <button type="button" class="prh-btn prh-btn-primary" data-act="reload">Try again</button>
        <a class="prh-btn" href="${esc(links.titleWalk)}">Watch the game's title walk</a>
      </div>
    </div>
  </div>`;
}

let uidSeq = 0;

/**
 * @param {object} o
 * @param {HTMLElement} o.stage            16:9 film stage (the renderer canvas lives in it too)
 * @param {(withSound:boolean)=>void} o.onStart   user pressed Start (inside the click/key gesture)
 * @param {(info:{from:string})=>void} o.onSkip   skip to the game's title state ({from:'playing'|'ready'})
 * @param {(muted:boolean)=>void} o.onMute
 * @param {()=>void} o.onReplay
 * @param {(q:'auto'|'high'|'medium'|'low')=>void} o.onQuality
 * @param {(t:number, info:{withSound:boolean})=>void} [o.onSeek]  optional: makes the page's chapter list clickable
 * @param {boolean} [o.capture]           default: URL has capture=1
 * @param {string} [o.poster]             optional image URL behind the start gate
 * @param {{titleWalk?:string, multimedia?:string}} [o.links]
 * @param {Element} [o.fullscreenTarget]  default: closest [data-prh-fullscreen] ancestor of the stage
 */
export function createUI(o = {}) {
  const stage = o.stage;
  if (!stage) throw new Error('createUI: a stage element is required');
  const cb = {
    start: o.onStart || noop, skip: o.onSkip || noop, mute: o.onMute || noop,
    replay: o.onReplay || noop, quality: o.onQuality || noop, seek: o.onSeek || null,
  };
  const params = new URLSearchParams(location.search);
  const capture = o.capture ?? (params.has('capture') && params.get('capture') !== '0'); // same test as main.js
  const links = { titleWalk: '../port-richmond-title-loop/', multimedia: '../', ...(o.links || {}) };
  const uid = `prh${++uidSeq}`;
  const reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  ensureCss();
  stage.classList.add('prh-stage');
  const root = document.createElement('div');
  root.className = 'prh-ui';
  root.tabIndex = -1; // focus parking spot when the focused control disappears
  root.dataset.state = 'loading';
  if (capture) root.dataset.capture = '1';
  root.innerHTML = titleMarkup() + (capture ? '' : startMarkup(uid) + controlsMarkup(links));
  stage.appendChild(root);
  if (o.poster) root.style.setProperty('--prh-poster', `url("${String(o.poster).replace(/"/g, '%22')}")`);

  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];

  // ------------------------------------------------------------------------------------------ title overlay
  const T = {
    root: $('.prh-title'),
    wash: $('.prh-wash'),
    rowsband: $('.prh-rowsband'),
    title: $('.prh-logo-title'),
    letters: $$('.prh-ch'),
    rule: $('.prh-rule'),
    sub: $('.prh-logo-sub'),
    tag: $('.prh-logo-tag'),
    rows: $$('.prh-row'),
    band: $('.prh-band'),
    bar: $('.prh-bar'),
    foot: $('.prh-foot'),
  };
  // style writes only when a value changes (updateTitle runs every frame)
  const cache = new Map();
  const put = (el, prop, v) => {
    let c = cache.get(el);
    if (!c) cache.set(el, (c = {}));
    if (c[prop] === v) return;
    c[prop] = v;
    el.style[prop] = v;
  };
  const f3 = (x) => (Math.round(x * 1000) / 1000).toString();

  // Fit each game text to its Roboto ink width: letter-spacing (em) within a readable range; the title, whose bold
  // fallbacks run up to ~10% wider, is condensed with scaleX for the rest (DESIGN.md: "bold white condensed sans").
  function fitTexts() {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    const measure = (el, text, perGlyph) => {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily || 'sans-serif'}`;
      const chars = [...text];
      const adv = perGlyph ? chars.reduce((a, ch) => a + ctx.measureText(ch).width, 0) : ctx.measureText(text).width;
      const first = ctx.measureText(chars[0]);
      const last = ctx.measureText(chars[chars.length - 1]);
      const lsb = Number.isFinite(first.actualBoundingBoxLeft) ? -first.actualBoundingBoxLeft : 7;
      const rsb = Number.isFinite(last.actualBoundingBoxRight) ? last.width - last.actualBoundingBoxRight : 6;
      return { ink: (adv - lsb - rsb) / 100, lsb: lsb / 100, gaps: Math.max(1, chars.length - 1) };
    };
    // title (letters are inline-blocks: per-glyph advances, no kerning between them)
    const m = measure(T.title, TITLE, true);
    let ls = (INK_EM.title - m.ink) / m.gaps;
    let sx = 1;
    if (ls < -0.02) { ls = -0.02; sx = INK_EM.title / (m.ink + ls * m.gaps); } else if (ls > 0.08) ls = 0.08;
    sx = Math.max(0.82, Math.min(1, sx));
    T.title.style.setProperty('--ls', ls.toFixed(4));
    T.title.style.setProperty('--sx', sx.toFixed(4));
    T.title.style.setProperty('--lsb', m.lsb.toFixed(4));
    for (const el of root.querySelectorAll('.prh-title [data-ink]')) {
      const target = parseFloat(el.dataset.ink);
      const mm = measure(el, el.textContent, false);
      const v = Math.max(-0.045, Math.min(0.06, (target - mm.ink) / mm.gaps));
      el.style.setProperty('--ls', v.toFixed(4));
    }
  }
  fitTexts();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTexts).catch(noop);

  let lastT = -1;
  let titleVisible = false;
  let isSettled = false; // the title has finished drawing (page actions may show)
  let lastUpdate = 0;
  let pendingSkipIn = false;

  function renderTitle(t) {
    const show = t >= T_FADE;
    if (show !== titleVisible) {
      titleVisible = show;
      T.root.classList.toggle('is-on', show);
    }
    const settled = t >= T_DONE;
    if (settled !== isSettled) {
      isSettled = settled;
      root.classList.toggle('is-settled', settled);
    }
    if (!show) { lastT = t; return; }
    if (settled && lastT >= T_DONE) { lastT = t; return; } // nothing moves any more
    // a jump from a hidden overlay straight to the settled title (skip): soft wall-clock fade, never in capture
    if (pendingSkipIn || (!capture && settled && lastT < T_FADE && state === 'title')) {
      pendingSkipIn = false;
      if (!reduceMotion.matches && !capture) {
        T.root.classList.remove('prh-skipin');
        void T.root.offsetWidth; // restart the animation
        T.root.classList.add('prh-skipin');
      }
    }
    lastT = t;

    put(T.wash, 'opacity', f3(easeInOut(seg(t, T_FADE, 1.2))));
    // letters: rise and fade in one by one (the space keeps its slot)
    let k = 0;
    for (const el of T.letters) {
      const p = easeOut(seg(t, T_DRAW + k * LETTER_STEP, LETTER_DUR));
      put(el, 'opacity', f3(p));
      put(el, 'transform', p >= 1 ? 'none' : `translate3d(0, ${f3((1 - p) * 0.24)}em, 0)`);
      k++;
    }
    const pr = easeInOut(seg(t, T_DRAW + 0.55, 0.75));
    put(T.rule, 'opacity', pr > 0 ? '1' : '0');
    put(T.rule, 'transform', `scaleX(${f3(pr)})`);
    const ps = easeOut(seg(t, T_DRAW + 1.0, 0.6));
    put(T.sub, 'opacity', f3(ps));
    put(T.sub, 'clipPath', ps >= 1 ? 'none' : `inset(-20% ${f3((1 - ps) * 100)}% -20% 0)`);
    put(T.tag, 'opacity', f3(easeOut(seg(t, T_DRAW + 1.35, 0.6))));
    // menu
    put(T.rowsband, 'opacity', f3(easeInOut(seg(t, T_MENU - 0.1, 0.6))));
    T.rows.forEach((el, i) => {
      const p = easeOut(seg(t, T_MENU + i * ROW_STEP, ROW_DUR));
      put(el, 'opacity', f3(p));
      put(el, 'transform', p >= 1 ? 'none' : `translate3d(${f3(-(1 - p) * 0.8)}em, 0, 0)`);
    });
    if (T.band) put(T.band, 'transform', `scaleX(${f3(easeOut(seg(t, T_MENU + 0.12, 0.45)))})`);
    if (T.bar) put(T.bar, 'transform', `scaleY(${f3(easeOut(seg(t, T_MENU + 0.04, 0.22)))})`);
    put(T.foot, 'opacity', f3(easeOut(seg(t, T_MENU + 1.05, 0.5))));
  }
  renderTitle(-1);

  // ------------------------------------------------------------------------------------------ chapters (page)
  // The page may render the film's sections into [data-prh-chapters] (one [data-prh-chapter][data-t] each).
  let chapterEls = null;
  let chapterOn = -2;
  let chapterQueried = 0;
  function chapters() {
    // the page may render its list after createUI(): look again (at most once a second) while it is empty
    if (chapterEls === null || (!chapterEls.length && performance.now() - chapterQueried > 1000)) {
      chapterQueried = performance.now();
      chapterEls = [...document.querySelectorAll('[data-prh-chapter]')];
      if (cb.seek) {
        for (const el of chapterEls) {
          const t = parseFloat(el.dataset.t);
          if (!Number.isFinite(t) || el.dataset.prhSeek) continue;
          el.dataset.prhSeek = '1';
          el.setAttribute('role', 'button');
          el.tabIndex = 0;
          const go = () => seek(t);
          el.addEventListener('click', go);
          el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        }
      }
    }
    return chapterEls;
  }
  function highlightChapter(t) {
    const els = chapters();
    if (!els.length) return;
    let on = -1;
    if (state === 'playing' || state === 'title') {
      on = SECTIONS.length - 1;
      for (let i = 0; i < SECTIONS.length; i++) if (t < SECTIONS[i].end) { on = i; break; }
    }
    if (on === chapterOn) return;
    chapterOn = on;
    els.forEach((el, i) => {
      el.classList.toggle('on', i === on);
      if (i === on) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
  }

  // ------------------------------------------------------------------------------------------ state
  let state = 'loading';
  let muted = false;
  let quality = 'auto';
  const startBtns = $$('[data-act="start-sound"], [data-act="start-muted"], [data-act="skip-start"]');
  const progressFill = $('.prh-progress-fill');
  const progressTrack = $('.prh-progress-track');
  const progressLabel = $('.prh-progress-label');
  const muteBtns = $$('[data-act="mute"]');
  const fsBtn = $('[data-act="fullscreen"]');
  const note = $('.prh-note');
  const errMsg = $('.prh-error-msg');
  let fallbackTimer = 0;

  function applyState(s) {
    const prev = state;
    state = s;
    root.dataset.state = s;
    for (const b of startBtns) b.disabled = s !== 'ready';
    document.documentElement.classList.toggle('prh-playing', s === 'playing');
    if (s !== 'title') hideNote();
    if (s === 'playing' || s === 'title') wake();
    if (s === 'title' && prev !== 'title') {
      // if main.js doesn't drive updateTitle (or its clock has not moved yet), settle the title shortly
      clearTimeout(fallbackTimer);
      const since = performance.now();
      fallbackTimer = setTimeout(() => {
        if (state === 'title' && lastUpdate < since + 1) { pendingSkipIn = !capture; renderTitle(Math.max(FILM.duration, T_DONE)); }
      }, 600);
    }
    // focus must not stay on a control that just went away (and must not land on Skip, where Space would skip)
    const a = document.activeElement;
    if (a && root.contains(a) && a !== root) {
      const group = a.closest('.prh-start, .prh-controls, .prh-actions, .prh-error');
      const shown = { 'prh-start': s === 'loading' || s === 'ready', 'prh-controls': s === 'playing' || (s === 'title' && !isSettled), 'prh-actions': s === 'title', 'prh-error': s === 'error' };
      if (group && !shown[[...group.classList].find((c) => c in shown)]) root.focus({ preventScroll: true });
    }
    highlightChapter(lastT);
  }

  function setMutedUI(m) {
    muted = !!m;
    for (const b of muteBtns) {
      b.setAttribute('aria-pressed', String(muted));
      b.setAttribute('aria-label', muted ? 'Unmute sound (M)' : 'Mute sound (M)');
      b.title = muted ? 'Unmute (M)' : 'Mute (M)';
      b.innerHTML = svg(muted ? 'soundOff' : 'soundOn');
    }
  }
  setMutedUI(false);

  // ------------------------------------------------------------------------------------------ actions
  function revealStage() {
    // phones: bring the whole film into view when it starts
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < -2 || r.bottom > vh + 2) {
      try { stage.scrollIntoView({ block: r.height <= vh ? 'center' : 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' }); } catch (e) { /* old browsers */ }
    }
  }
  function start(withSound) {
    if (state !== 'ready') return;
    setMutedUI(!withSound);
    cb.start(!!withSound);
    if (state === 'ready') applyState('playing');
    revealStage();
  }
  const canSkip = () => state === 'playing' || state === 'ready' || (state === 'title' && !isSettled);
  function skip() {
    if (!canSkip()) return;
    const from = state;
    cb.skip({ from });
    if (state === from && from !== 'title') applyState('title');
    if (from === 'ready') revealStage();
  }
  function replay() {
    if (state !== 'title') return;
    cb.replay();
    if (state === 'title') applyState('playing');
  }
  function toggleMute() {
    if (state !== 'playing' && state !== 'title') return;
    setMutedUI(!muted);
    cb.mute(muted);
  }
  function seek(t) {
    if (!cb.seek || (state !== 'ready' && state !== 'playing' && state !== 'title')) return;
    if (state === 'ready') setMutedUI(false);
    cb.seek(t, { withSound: !muted });
    if (state === 'ready' || state === 'title') applyState(t >= FILM.duration ? 'title' : 'playing');
  }

  // full screen (wrapper marked [data-prh-fullscreen] keeps the stage letterboxed at 16:9)
  const fsTarget = o.fullscreenTarget || stage.closest('[data-prh-fullscreen]') || null;
  const fsEnabled = !!(fsTarget && (document.fullscreenEnabled || document.webkitFullscreenEnabled));
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  function toggleFullscreen() {
    if (!fsEnabled) return;
    if (fsElement()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else {
      const req = fsTarget.requestFullscreen || fsTarget.webkitRequestFullscreen;
      try { const r = req.call(fsTarget); if (r && r.catch) r.catch(noop); } catch (e) { /* not allowed */ }
    }
  }
  function syncFs() {
    if (!fsBtn) return;
    const on = fsElement() === fsTarget;
    fsBtn.innerHTML = svg(on ? 'fsOff' : 'fsOn');
    fsBtn.setAttribute('aria-label', on ? 'Exit full screen (F)' : 'Full screen (F)');
    fsBtn.title = on ? 'Exit full screen (F)' : 'Full screen (F)';
  }
  if (fsBtn && fsEnabled) {
    fsBtn.hidden = false;
    syncFs();
    document.addEventListener('fullscreenchange', syncFs);
    document.addEventListener('webkitfullscreenchange', syncFs);
  }

  let noteTimer = 0;
  function showNote() {
    if (!note || capture) return;
    note.innerHTML = 'This menu is a recreation of the game\'s title screen. PORT RICHMOND runs in Unreal Engine 5, ' +
      `so it can't be played here. <a href="${esc(links.titleWalk)}">Watch the game's title walk</a>`;
    note.classList.add('is-on');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(hideNote, 5200);
  }
  function hideNote() { if (note) note.classList.remove('is-on'); clearTimeout(noteTimer); }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b && root.contains(b)) {
      if (b.disabled) return;
      switch (b.dataset.act) {
        case 'start-sound': start(true); break;
        case 'start-muted': start(false); break;
        case 'skip-start': skip(); break;
        case 'skip': skip(); break;
        case 'mute': toggleMute(); break;
        case 'fullscreen': toggleFullscreen(); break;
        case 'replay': replay(); break;
        case 'reload': location.reload(); break;
        default: break;
      }
      return;
    }
    if (state === 'title' && e.target.closest('.prh-title')) showNote();
  });
  root.addEventListener('change', (e) => {
    const r = e.target;
    if (r && r.type === 'radio' && r.name === `${uid}-q`) {
      quality = r.value;
      cb.quality(quality);
    }
  });
  // ------------------------------------------------------------------------------------------ idle + keyboard
  let idleTimer = 0;
  function wake() {
    root.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (root.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) return;
      if (state === 'playing' || state === 'title') root.classList.add('is-idle');
    }, 2000);
  }
  const wakeEvents = ['pointermove', 'pointerdown', 'wheel'];
  for (const ev of wakeEvents) stage.addEventListener(ev, wake, { passive: true });
  root.addEventListener('focusin', wake);

  let stageVisible = true;
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((es) => { for (const e of es) stageVisible = e.intersectionRatio > 0.2; }, { threshold: [0, 0.2, 0.5] });
    io.observe(stage);
  }
  const interactive = (el) => !!(el && el.closest && el.closest('button, a[href], input, select, textarea, summary, [role="button"], [contenteditable=""], [contenteditable="true"]'));
  function onKey(e) {
    if (capture || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return;
    const tgt = e.target;
    if (tgt && (tgt.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tgt.tagName)) && !(tgt.type === 'radio' && root.contains(tgt))) return;
    const k = e.key;
    const lower = k.length === 1 ? k.toLowerCase() : k;
    if (state === 'ready') {
      // Space/Enter start from anywhere on the page while the stage is in view (focused buttons and links keep
      // their own Space/Enter; a focused quality radio keeps Space for itself)
      if ((k === ' ' || k === 'Enter') && stageVisible && !interactive(tgt)) {
        e.preventDefault();
        start(true);
      }
      return;
    }
    if (state === 'playing' || (state === 'title' && !isSettled)) {
      if (lower === 's' || k === 'Escape') { e.preventDefault(); skip(); return; }
    }
    if (state === 'title' && lower === 'r') { e.preventDefault(); replay(); return; }
    if ((state === 'playing' || state === 'title') && lower === 'm') { e.preventDefault(); toggleMute(); wake(); return; }
    if ((state === 'playing' || state === 'title') && lower === 'f' && fsEnabled) { e.preventDefault(); toggleFullscreen(); }
  }
  window.addEventListener('keydown', onKey);

  // ------------------------------------------------------------------------------------------ API
  const api = {
    /** Loading progress 0..1 with an optional label (shown under the bar). */
    setProgress(p, label) {
      const v = clamp01(Number(p) || 0);
      if (progressFill) progressFill.style.transform = `scaleX(${v.toFixed(4)})`;
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(Math.round(v * 100)));
      if (progressLabel) {
        const pct = `${Math.round(v * 100)}%`;
        progressLabel.textContent = label ? (/%/.test(label) || state === 'ready' ? label : `${label} · ${pct}`) : (v >= 1 ? 'Ready' : `Loading… ${pct}`);
      }
    },
    /** 'loading' | 'ready' | 'playing' | 'title' | 'error' */
    setState(s) {
      if (!['loading', 'ready', 'playing', 'title', 'error'].includes(s)) throw new Error(`createUI.setState: unknown state ${s}`);
      if (s === 'ready' && state !== 'ready') { applyState(s); api.setProgress(1, 'Ready'); return; }
      if (s !== state) applyState(s);
    },
    /** Every frame with the film time in seconds: drives the title overlay (and the chapter highlight). */
    updateTitle(t) {
      t = Number(t);
      if (!Number.isFinite(t)) return;
      lastUpdate = performance.now();
      renderTitle(t);
      highlightChapter(t);
      if (state === 'playing' && t >= FILM.duration && !capture) applyState('title');
    },
    setMuted(m) { setMutedUI(m); },
    /** q: 'auto'|'high'|'medium'|'low'; resolved (optional) shows what Auto picked, e.g. setQuality('auto', 'medium'). */
    setQuality(q, resolved) {
      if (!QUALITIES.some(([k]) => k === q)) return;
      quality = q;
      const r = root.querySelector(`input[name="${uid}-q"][value="${q}"]`);
      if (r) r.checked = true;
      const a = $('.prh-q-auto');
      if (a) a.textContent = q === 'auto' && resolved ? `→ ${resolved}` : '';
    },
    showError(msg) {
      if (errMsg) errMsg.textContent = msg ? String(msg) : 'Something went wrong while loading the film.';
      applyState('error');
    },
    get state() { return state; },
    get muted() { return muted; },
    get quality() { return quality; },
    get capture() { return capture; },
    element: root,
    destroy() {
      window.removeEventListener('keydown', onKey);
      for (const ev of wakeEvents) stage.removeEventListener(ev, wake);
      document.removeEventListener('fullscreenchange', syncFs);
      document.removeEventListener('webkitfullscreenchange', syncFs);
      if (io) io.disconnect();
      clearTimeout(idleTimer); clearTimeout(noteTimer); clearTimeout(fallbackTimer);
      document.documentElement.classList.remove('prh-playing');
      root.remove();
      stage.classList.remove('prh-stage');
    },
  };
  return api;
}

export const UI_TIMING = { T_FADE, T_DRAW, T_MENU, T_DONE };
