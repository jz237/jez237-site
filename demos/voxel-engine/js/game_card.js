// The result card: one number, a medal, what it was made of, and what to do
// next. Used by every mode with a result; it knows nothing about any of them.
import { points } from './game_score.js';

export const MEDALS = ['No medal', 'Bronze', 'Silver', 'Gold'];
// The number counts up for this long (ms).
const COUNT_MS = 900;

const el = (tag, cls, parent, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};

export function createCard() {
  const root = el('div', '', document.body);
  root.id = 'result';
  root.hidden = true;
  const card = el('div', 'card', root);
  const kicker = el('div', 'kicker', card);
  const medalEl = el('div', 'medal', card);
  const medalName = el('div', 'medal-name', card);
  const valueEl = el('div', 'value', card);
  const bestEl = el('div', 'best', card);
  const stats = el('dl', '', card);
  const nextEl = el('p', 'next', card);
  const foot = el('footer', '', card);
  let timer = 0;
  // Space is jump: a player in the air when the card comes up must not
  // press its focused button with it. (Enter and a click still do.)
  for (const type of ['keydown', 'keyup']) {
    root.addEventListener(type, (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  const api = {
    get shown() { return !root.hidden; },
    // r: { kicker, medal 0..3, medalName, value, format(v), best, isBest,
    //      lost, rows: [[k, v]], next, buttons: [{ label, primary, act }] }
    // `format` writes the number (default: grouped digits); `lost` is a
    // result with nothing won (no count, the name in red).
    show(r) {
      const format = r.format || points;
      kicker.textContent = r.kicker;
      medalEl.dataset.medal = String(r.medal);
      medalName.textContent = r.medalName || MEDALS[r.medal] || '';
      root.classList.toggle('lost', !!r.lost);
      bestEl.textContent = r.isBest ? 'New best' : r.best != null ? `Best ${format(r.best)}` : '';
      bestEl.classList.toggle('new', !!r.isBest);
      stats.textContent = '';
      for (const [k, v] of r.rows) {
        el('dt', '', stats, k);
        el('dd', '', stats, v);
      }
      nextEl.textContent = r.next || '';
      foot.textContent = '';
      let first = null;
      for (const b of r.buttons) {
        const btn = el('button', b.primary ? 'primary' : '', foot, b.label);
        btn.addEventListener('click', () => { api.hide(); b.act(); });
        if (b.primary && !first) first = btn;
      }
      root.hidden = false;
      document.body.classList.add('result-up');
      // Enter or a pad's A goes for the obvious thing.
      if (first) first.focus({ preventScroll: true });
      const t0 = performance.now();
      clearInterval(timer);
      const tick = () => {
        const u = Math.min(1, (performance.now() - t0) / COUNT_MS);
        // Fast at first, settling onto the figure.
        valueEl.textContent = r.lost ? r.value : format(r.value * (1 - (1 - u) ** 3));
        if (u >= 1) clearInterval(timer);
      };
      tick();
      timer = setInterval(tick, 33);
    },
    hide() {
      if (root.hidden) return;
      clearInterval(timer);
      root.hidden = true;
      document.body.classList.remove('result-up');
    },
    // What the lit button says ('' with none).
    get label() {
      const b = foot.querySelector('button.primary');
      return b ? b.textContent : '';
    },
    // The button a pad's A or B presses: the primary one, or the last. Or
    // the one with this label, when there is one.
    press(primary, label) {
      const named = label ? [...foot.querySelectorAll('button')].find((x) => x.textContent === label) : null;
      const b = named || foot.querySelector(primary ? 'button.primary' : 'button:last-child');
      if (b) b.click();
    },
  };
  return api;
}
