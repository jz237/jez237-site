/**
 * jez237.com high scores for the SceNoCo games: a top-10 board kept on this device (🏠 LOCAL) and on
 * the site's game-scores worker (🌐 GLOBAL), with 3-letter initials entered by ▲/▼ taps or the keyboard.
 *
 * Plain DOM over the game, styled by the game's own colours. While it is open it takes every key, so a
 * Space typed here never launches a ball or calls a wave behind it.
 */
const API = 'https://game-scores.jez237.workers.dev/scores/';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const INITIALS_KEY = 'jez237_initials';

export interface Entry { initials: string; score: number; level: number; ts?: number }

export interface BoardOptions {
  /** Worker board and localStorage key, e.g. `scenoco-breakout`. */
  game: string;
  title: string;
  /** Column label for `level`, e.g. `STAGE` or `MAP`. */
  levelLabel: string;
  accent: string;
  accent2: string;
  panel: string;
  font: string;
}

export interface ScoreBoard {
  readonly isOpen: boolean;
  /** The high-score table, from a title screen. */
  open(): void;
  /** A run is over: initials if it made either top 10, then the table. `done` runs when it closes. */
  submit(score: number, level: number, done?: () => void): void;
}

export function createScoreBoard(o: BoardOptions): ScoreBoard {
  const localKey = `${o.game}_highscores`;
  injectStyle(o);
  const root = document.createElement('div');
  root.className = 'jzhs hidden';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', `${o.title} high scores`);
  document.body.append(root);
  // Nothing behind the board sees a tap that starts on it.
  for (const type of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'wheel'] as const) {
    root.addEventListener(type, (e) => e.stopPropagation(), { passive: true });
  }

  let open = false;
  let onClose: (() => void) | undefined;
  let keyHandler: ((e: KeyboardEvent) => void) | null = null;
  let global: Entry[] | null = null;
  let globalError = false;

  // Every key is ours while the board is up; capture on window runs before the game's own listener.
  window.addEventListener('keydown', (e) => {
    if (!open) return;
    e.stopImmediatePropagation();
    keyHandler?.(e);
  }, true);
  window.addEventListener('keyup', (e) => { if (open) e.stopImmediatePropagation(); }, true);

  const readLocal = (): Entry[] => {
    try { const v = JSON.parse(localStorage.getItem(localKey) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
  };
  const writeLocal = (rows: Entry[]) => { try { localStorage.setItem(localKey, JSON.stringify(rows)); } catch { /* private mode */ } };
  const qualifies = (rows: Entry[], score: number) => score > 0 && (rows.length < 10 || score > (rows[rows.length - 1]?.score ?? 0));
  const insert = (rows: Entry[], e: Entry) => [...rows, e].sort((a, b) => b.score - a.score || (a.ts ?? 0) - (b.ts ?? 0)).slice(0, 10);

  async function fetchGlobal(): Promise<void> {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(API + o.game, { signal: ctl.signal, cache: 'no-store' });
      clearTimeout(timer);
      const data = await res.json();
      const rows = (Array.isArray(data) ? data : data.scores || []) as Entry[];
      global = rows.filter((r) => r && typeof r.score === 'number').sort((a, b) => b.score - a.score).slice(0, 10);
      globalError = false;
    } catch {
      globalError = true;
    }
  }

  async function postGlobal(e: Entry): Promise<boolean> {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(API + o.game, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials: e.initials, score: Math.max(0, Math.floor(e.score)), level: e.level }),
        signal: ctl.signal,
      });
      clearTimeout(timer);
      return res.ok;
    } catch {
      return false;
    }
  }

  function show(html: string) {
    root.innerHTML = html;
    root.classList.remove('hidden');
    open = true;
  }

  function close() {
    open = false;
    keyHandler = null;
    root.classList.add('hidden');
    root.innerHTML = '';
    const done = onClose;
    onClose = undefined;
    done?.();
  }

  function button(label: string, cls: string, action: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = label;
    b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); action(); });
    return b;
  }

  function table(title: string, cls: string, rows: Entry[] | null, mark: Entry | null, note: string): string {
    let body: string;
    if (!rows) body = `<li class="note">${note}</li>`;
    else if (!rows.length) body = `<li class="note">No scores yet — be the first!</li>`;
    else body = rows.map((r, i) => {
      const me = mark && r.initials === mark.initials && r.score === mark.score && r.level === mark.level;
      return `<li class="${i === 0 ? 'top ' : ''}${me ? 'me' : ''}"><span class="rk">${i + 1}.</span><span class="ic">${i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : '✦'}</span><span class="in">${esc(r.initials)}</span><span class="sc">${fmt(r.score)}</span><span class="lv">${o.levelLabel} ${r.level ?? '–'}</span></li>`;
    }).join('');
    return `<section class="col ${cls}"><h3>${title}</h3><ol>${body}</ol></section>`;
  }

  function renderBoard(mark: Entry | null, status = '') {
    const note = globalError ? 'Global board offline — try again later.' : 'Loading…';
    show(`<div class="card"><h2>${esc(o.title)}</h2><p class="sub">HIGH SCORES</p><div class="cols">${table('🏠 LOCAL', 'local', readLocal(), mark, '')}${table('🌐 GLOBAL', 'global', globalError ? null : global, mark, note)}</div><p class="status">${status}</p><div class="actions"></div></div>`);
    const actions = root.querySelector('.actions')!;
    const go = button('CONTINUE', 'jzbtn primary', close);
    actions.append(go);
    go.focus({ preventScroll: true });
    keyHandler = (e) => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); close(); } };
  }

  function renderEntry(score: number, level: number, onDone: (initials: string) => void) {
    const saved = (localStorage.getItem(INITIALS_KEY) || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(3, 'A').slice(0, 3);
    const chars = saved.split('');
    let slot = 0;
    show(`<div class="card"><h2>NEW HIGH SCORE!</h2><p class="big">${fmt(score)}</p><p class="sub">${o.levelLabel} ${level} · ENTER YOUR INITIALS</p><div class="slots"></div><p class="hint">Tap ▲ ▼ or type · Enter to save</p><div class="actions"></div></div>`);
    const slotsEl = root.querySelector('.slots')!;
    const letters: HTMLElement[] = [];
    const draw = () => letters.forEach((l, i) => { l.textContent = chars[i]!; l.parentElement!.classList.toggle('on', i === slot); });
    const step = (i: number, d: number) => {
      const at = LETTERS.indexOf(chars[i]!);
      chars[i] = LETTERS[(at + d + LETTERS.length) % LETTERS.length]!;
      slot = i;
      draw();
    };
    for (let i = 0; i < 3; i++) {
      const col = document.createElement('div');
      col.className = 'slot';
      const letter = document.createElement('div');
      letter.className = 'letter';
      letter.addEventListener('click', () => { slot = i; draw(); });
      letters.push(letter);
      col.append(button('▲', 'jzbtn arrow', () => step(i, 1)), letter, button('▼', 'jzbtn arrow', () => step(i, -1)));
      slotsEl.append(col);
    }
    draw();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const initials = chars.join('');
      try { localStorage.setItem(INITIALS_KEY, initials); } catch { /* private mode */ }
      onDone(initials);
    };
    const ok = button('SAVE', 'jzbtn primary', finish);
    root.querySelector('.actions')!.append(ok);
    keyHandler = (e) => {
      const k = e.key;
      if (k === 'Enter') { e.preventDefault(); finish(); }
      else if (k === 'ArrowUp') { e.preventDefault(); step(slot, 1); }
      else if (k === 'ArrowDown') { e.preventDefault(); step(slot, -1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); slot = (slot + 2) % 3; draw(); }
      else if (k === 'ArrowRight') { e.preventDefault(); slot = (slot + 1) % 3; draw(); }
      else if (k === 'Backspace') { e.preventDefault(); slot = Math.max(0, slot - 1); draw(); }
      else if (/^[a-z0-9]$/i.test(k)) { e.preventDefault(); chars[slot] = k.toUpperCase(); slot = Math.min(2, slot + 1); draw(); }
    };
  }

  return {
    get isOpen() { return open; },
    open() {
      onClose = undefined;
      renderBoard(null);
      void fetchGlobal().then(() => open && keyHandler && renderBoard(null));
    },
    submit(score, level, done) {
      onClose = done;
      score = Math.max(0, Math.floor(score));
      show(`<div class="card"><h2>${esc(o.title)}</h2><p class="big">${fmt(score)}</p><p class="sub">CHECKING THE BOARDS…</p></div>`);
      keyHandler = () => {};
      void fetchGlobal().then(() => {
        const local = readLocal();
        const madeLocal = qualifies(local, score);
        const madeGlobal = !globalError && qualifies(global ?? [], score);
        if (!madeLocal && !madeGlobal) return renderBoard(null, `You scored ${fmt(score)}.`);
        renderEntry(score, level, (initials) => {
          const entry: Entry = { initials, score, level, ts: Date.now() };
          if (madeLocal) writeLocal(insert(local, entry));
          if (!globalError) global = insert(global ?? [], entry); // shown at once; the post follows
          renderBoard(entry, globalError ? 'Saved on this device.' : 'Sending to the global board…');
          void postGlobal(entry).then((sent) => {
            const status = root.querySelector('.status');
            if (open && status) status.textContent = sent ? 'Saved locally and globally.' : 'Saved on this device — global board unreachable.';
          });
        });
      });
    },
  };
}

function fmt(n: number) { return Math.floor(n).toLocaleString('en-US'); }
function esc(s: unknown) { return String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`); }

function injectStyle(o: BoardOptions) {
  const css = `
.jzhs{position:fixed;inset:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;padding:max(10px,env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(10px,env(safe-area-inset-left));background:rgba(4,6,16,.58);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-family:${o.font};color:#f4f7ff;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.jzhs.hidden{display:none}
.jzhs .card{width:min(720px,100%);max-height:100%;overflow:auto;padding:18px 20px;border-radius:16px;background:${o.panel};border:2px solid ${o.accent};box-shadow:0 0 32px ${o.accent}55,inset 0 1px rgba(255,255,255,.15);text-align:center}
.jzhs h2{margin:0;font-size:clamp(20px,4vw,30px);letter-spacing:.06em;color:${o.accent2};text-shadow:0 0 14px ${o.accent2}88}
.jzhs .sub{margin:4px 0 10px;font-size:12px;letter-spacing:.18em;opacity:.8}
.jzhs .big{margin:6px 0 0;font-size:clamp(28px,6vw,44px);color:#fff;text-shadow:0 0 18px ${o.accent}}
.jzhs .cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:left}
.jzhs .col{padding:8px 10px;border-radius:10px;background:rgba(0,0,0,.28)}
.jzhs .col h3{margin:0 0 6px;font-size:13px;letter-spacing:.12em}
.jzhs .local h3{color:#5ee7ff}.jzhs .global h3{color:#ffd23f}
.jzhs ol{list-style:none;margin:0;padding:0;font-size:12px;font-variant-numeric:tabular-nums}
.jzhs li{display:grid;grid-template-columns:2.2em 1.6em 3.2em 1fr auto;gap:4px;align-items:center;padding:2px 4px;border-radius:5px}
.jzhs li .rk{text-align:right;opacity:.75}.jzhs li .sc{text-align:right}.jzhs li .lv{opacity:.6;font-size:10px;padding-left:8px;white-space:nowrap}
.jzhs li.top{font-weight:800;color:#ffe680}
.jzhs li.me{background:${o.accent2}40;box-shadow:0 0 12px ${o.accent2}aa;color:#fff}
.jzhs li.note{display:block;opacity:.7;padding:6px 4px}
.jzhs .status{min-height:1em;margin:10px 0 0;font-size:11px;opacity:.75}
.jzhs .hint{margin:8px 0 0;font-size:11px;opacity:.7}
.jzhs .slots{display:flex;justify-content:center;gap:14px;margin:8px 0}
.jzhs .slot{display:flex;flex-direction:column;align-items:center;gap:6px}
.jzhs .letter{width:56px;height:62px;display:flex;align-items:center;justify-content:center;font-size:40px;border-radius:10px;background:rgba(0,0,0,.35);border:2px solid rgba(255,255,255,.2);cursor:pointer}
.jzhs .slot.on .letter{border-color:${o.accent2};box-shadow:0 0 16px ${o.accent2}aa;color:${o.accent2}}
.jzhs .jzbtn{appearance:none;border:2px solid ${o.accent};background:rgba(0,0,0,.35);color:#fff;font:inherit;font-weight:800;letter-spacing:.1em;border-radius:10px;cursor:pointer;touch-action:manipulation}
.jzhs .jzbtn.arrow{width:56px;height:40px;font-size:16px}
.jzhs .jzbtn.primary{margin-top:12px;min-width:170px;min-height:46px;font-size:15px;background:${o.accent};color:#0b0b14;border-color:#fff}
.jzhs .jzbtn:active{transform:translateY(2px)}
@media (max-width:560px){.jzhs .cols{grid-template-columns:1fr}}
@media (max-height:460px){.jzhs .card{padding:10px 14px}.jzhs .letter{height:46px;font-size:30px}.jzhs .jzbtn.arrow{height:32px}.jzhs .jzbtn.primary{margin-top:6px;min-height:38px}.jzhs .big{font-size:26px}.jzhs ol{font-size:11px}}
.jzhs-open{appearance:none;border:2px solid ${o.accent};background:rgba(0,0,0,.4);color:#fff;font-family:${o.font};font-weight:800;letter-spacing:.12em;border-radius:12px;padding:10px 18px;cursor:pointer;touch-action:manipulation;pointer-events:auto;box-shadow:0 0 16px ${o.accent}66}
`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}
