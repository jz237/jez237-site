/* How AI Works — shared lab core: helpers, the animation scheduler, the shared
   prompt, and the handle on the page's tiny transformer (js/tinygpt.js) and its
   tokenizer (js/data.js). Load order: data, tinygpt, weights, core. */
window.Lab = (function () {
  'use strict';

  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const state = { speed: 1, paused: false };

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function h(tag, attrs, kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') {
        for (const p in v) { if (p.slice(0, 2) === '--') e.style.setProperty(p, v[p]); else e.style[p] = v[p]; }
      }
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(c => { if (c != null) e.append(c); });
    return e;
  }

  const clamp = (v, a, b) => Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: t => 1 - Math.pow(1 - t, 3),
    back: t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2)
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (p, d) => (p * 100).toFixed(d == null ? (p < 0.1 ? 1 : 0) : d) + '%';

  function hash(str) {
    let x = 2166136261;
    for (let i = 0; i < str.length; i++) x = Math.imul(x ^ str.charCodeAt(i), 16777619);
    return x >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function softmax(logits, T) {
    T = T || 1;
    const m = Math.max.apply(null, logits);
    const e = logits.map(v => Math.exp((v - m) / T));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map(v => v / s);
  }
  function pickIndex(probs, u) {
    let acc = 0;
    for (let i = 0; i < probs.length; i++) { acc += probs[i]; if (u < acc) return i; }
    return probs.length - 1;
  }

  /* ---------- colour ---------- */
  const C = {
    cyan: '#39cfff', gold: '#e6bd67', green: '#84e37a', rose: '#ff7f9c',
    violet: '#9d86ff', orange: '#ffb060', text: '#eef7fb', muted: '#9fb8c9',
    dim: '#6f8da3', ink: '#020812'
  };
  function rgba(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  // value in [-1, 1] -> diverging colour (rose = negative, cyan = positive)
  function heat(v) {
    const a = 0.1 + 0.9 * clamp(Math.abs(v));
    return v >= 0 ? 'rgba(57,207,255,' + a.toFixed(3) + ')' : 'rgba(255,127,156,' + a.toFixed(3) + ')';
  }
  function vecFor(key, n) {
    const r = rng(hash(key));
    return Array.from({ length: n }, () => r() * 2 - 1);
  }

  /* ---------- canvas + scene scheduler ---------- */
  function fit(cv) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    const w = Math.max(10, Math.round(r.width)), hh = Math.max(10, Math.round(r.height));
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(hh * dpr)) {
      cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr);
    }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h: hh };
  }
  function rr(ctx, x, y, w, hh, r) {
    r = Math.max(0, Math.min(r, w / 2, hh / 2));
    ctx.beginPath();
    if (w <= 0 || hh <= 0) return;      // nothing to draw on a collapsed canvas
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + hh, r);
    ctx.arcTo(x + w, y + hh, x, y + hh, r);
    ctx.arcTo(x, y + hh, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const scenes = [];
  let rafOn = false, last = 0;
  function frame(now) {
    const dt = Math.max(0, Math.min(50, now - last)) || 16;     // a frame stamp can sit a hair before the clock read in kick()
    last = now;
    let any = false;
    if (!document.hidden) {
      for (const s of scenes) {
        if (!s.vis) continue;
        any = true;
        if (!s.el.offsetWidth && !s.el.getClientRects().length) continue;   // inside a closed chapter
        const d = state.paused ? 0 : dt * state.speed;
        s.t += d;
        // one bad frame must not kill an animation for good; give up only if it keeps failing
        try { s.tick(d, s.t); s.bad = 0; } catch (err) { s.bad = (s.bad || 0) + 1; if (s.bad > 5) s.vis = false; if (s.bad === 1) console.error('[lab scene]', err); }
      }
    }
    if (any) requestAnimationFrame(frame); else rafOn = false;
  }
  function kick() {
    if (rafOn) return;
    rafOn = true; last = performance.now();
    requestAnimationFrame(frame);
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      const s = scenes.find(x => x.el === e.target);
      if (s) { s.vis = e.isIntersecting; if (s.vis) kick(); }
    });
  }, { rootMargin: '120px' }) : null;
  // tick(dt, t) runs every frame while `el` is on screen. dt is 0 while paused.
  function scene(el, tick) {
    const s = { el, tick, vis: !io, t: 0 };
    scenes.push(s);
    if (io) io.observe(el); else kick();
    return s;
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && scenes.some(s => s.vis)) kick(); });

  /* ---------- cancellable step sequences ---------- */
  function seq() {
    let id = 0;
    return {
      begin() { return ++id; },
      stop() { id++; },
      ok(k) { return k === id; },
      // resolves true when the wait finished, false if the run was cancelled
      wait(ms, k) {
        return new Promise(res => {
          if (reduce || ms <= 0) return res(k === id);
          let acc = 0, prev = performance.now();
          const t0 = prev;
          (function step() {
            if (k !== id) return res(false);
            const now = performance.now();
            acc += state.paused ? 0 : (now - prev) * state.speed;
            prev = now;
            if (acc >= ms) return res(true);
            // rAF stalls in background tabs; fall back to a timer so runs still finish
            if (document.hidden) setTimeout(step, 60); else requestAnimationFrame(step);
            void t0;
          })();
        });
      }
    };
  }

  /* ---------- the tokenizer and the tiny transformer ---------- */
  const D = window.LabData, bpe = D.bpe, V = D.vocab, TMAX = D.config.T;
  const W = window.LAB_WEIGHTS;
  const shipOK = !!(W && W.signature === D.signature && window.TinyGPT);
  const model = shipOK ? window.TinyGPT.unpack(W) : new window.TinyGPT(D.config, 5);
  const shipped = shipOK ? Float32Array.from(model.w) : null;
  // word classes are OUR labels, used only to colour the maps; the model never sees them
  const CLS = {};
  [['who', 'cat dog mouse bird robot model gardener farmer dragon'],
    ['thing', 'mat sofa fence sun garden rug floor park roof soil morning ball book prompt text word token food cheese seeds bread plants flowers rain'],
    ['doing', 'sat slept chased ran watched purred barked ate sang read watered learned predicted planted grew warmed fell trained was'],
    ['describing', 'tired hungry happy curious warm new next'],
    ['glue', 'the on in under at a from so because it she he .']
  ].forEach(g => g[1].split(' ').forEach(w => { CLS[w] = g[0]; }));
  const aiL = [];
  const ai = {
    model, V, T: TMAX, data: D,
    state: shipOK ? 'shipped' : 'random',       // 'shipped' | 'random' | 'training' | 'custom'
    shippedSteps: shipOK ? W.steps : 0,
    word: m => V.word(m), label: m => V.label(m), cls: m => CLS[V.word(m)] || 'glue', tokId: m => V.tokId(m),
    tokenize: D.tokenize,
    // the model can only ever see its last T tokens, start marker included
    window: mids => [V.BOS].concat(mids.slice(-(TMAX - 1))),
    // next(mids) -> [{m, w, p}] every token the model could say next, most likely first
    next(mids) {
      const p = model.next(ai.window(mids)), out = [];
      for (let m = 0; m < p.length; m++) out.push({ m, w: V.word(m), p: p[m] });
      return out.sort((x, y) => y.p - x.p);
    },
    trace: mids => model.trace(ai.window(mids)),
    emb: m => model.row('E', m, D.config.d),
    pos: i => model.row('P', i, D.config.d),
    cos(a, b) { let s = 0, x = 0, y = 0; for (let i = 0; i < a.length; i++) { s += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; } return s / Math.sqrt(x * y || 1); },
    // real tokens only (no start marker / unknown), nearest first
    neighbours(m, k) {
      const e = ai.emb(m), out = [];
      for (let j = 2; j < V.size; j++) if (j !== m) out.push({ m: j, s: ai.cos(e, ai.emb(j)) });
      return out.sort((x, y) => y.s - x.s).slice(0, k || 3);
    },
    onChange: fn => aiL.push(fn),
    changed(state) { if (state) ai.state = state; aiL.forEach(fn => fn(ai.state)); kick(); },
    restore() { if (shipped) { model.w.set(shipped); model.m.fill(0); model.v.fill(0); model.steps = 0; ai.changed('shipped'); } },
    reset(seed) { model.init(seed == null ? (Date.now() & 0xffff) : seed); ai.changed('random'); },
    canRestore: !!shipped
  };

  /* ---------- one prompt, shared by every chapter ---------- */
  const promptL = [], MAXP = 10;
  let prompt = null;
  function setPrompt(text) {
    const clean = String(text).toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\s+/g, ' ').trim() || 'the cat sat on the';
    const all = D.tokenize(clean), pieces = all.slice(0, MAXP);
    prompt = { text: clean, pieces, mids: pieces.map(p => p.m), cut: all.length - pieces.length, unknown: pieces.filter(p => !p.known) };
    try { localStorage.setItem('lab-prompt', clean); } catch (e) { /* private mode */ }
    promptL.forEach(fn => fn(prompt));
    kick();
    return prompt;
  }
  let saved = '';
  try { saved = localStorage.getItem('lab-prompt') || ''; } catch (e) { /* ignore */ }
  setPrompt(saved || 'the cat sat on the');

  /* ---------- global motion controls ---------- */
  const listeners = [];
  function setMotion(patch) {
    Object.assign(state, patch);
    document.documentElement.classList.toggle('lab-paused', state.paused);
    listeners.forEach(fn => fn(state));
    kick();
  }

  return {
    reduce, state, setMotion, onMotion: fn => listeners.push(fn),
    $, $$, h, clamp, lerp, ease, esc, pct, hash, rng, softmax, pickIndex,
    C, rgba, heat, vecFor, fit, rr, scene, kick, seq, bpe, ai,
    get prompt() { return prompt; }, setPrompt, onPrompt: fn => promptL.push(fn)
  };
})();
