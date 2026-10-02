// HUD secondary panels: specification sheet, controls overlay, detail-view card, guided-tour card.
import { h, icon, button, svgIcon } from './dom.js';
import { SPECS, SYSTEMS } from './data.js';

/* ------------------------------------------------------------------ size diagram (top view, 4 px per mm) */
function sizeDiagram() {
  const wing = (cx, cy, rx, ry, rot) => h('svg:ellipse', { class: 'sd-wing', cx, cy, rx, ry, transform: `rotate(${rot} ${cx} ${cy})` });
  const side = [wing(139, 53, 52, 15, 65), wing(123, 72, 40, 11, 48)];
  return h('svg:svg', { class: 'size-diagram', viewBox: '0 0 340 246', role: 'img', 'aria-label': 'The APX-9 is 28 millimetres long with a 52 millimetre wingspan' },
    h('svg:g', null, side),
    h('svg:g', { transform: 'translate(0 220) scale(1 -1)' }, side.map((n) => n.cloneNode(true))),
    h('svg:path', { class: 'sd-dim', d: 'M158 98 188 88M158 122 188 132' }),
    h('svg:ellipse', { class: 'sd-body', cx: 104, cy: 110, rx: 34, ry: 21 }),
    h('svg:ellipse', { class: 'sd-body', cx: 146, cy: 110, rx: 21, ry: 20 }),
    h('svg:ellipse', { class: 'sd-body', cx: 171, cy: 110, rx: 12, ry: 14 }),
    h('svg:path', { class: 'sd-dim', d: 'M318 6v208M313 6h10M313 214h10M70 230h112M70 225v10M182 225v10' }),
    h('svg:text', { x: 308, y: 110, transform: 'rotate(-90 308 110)', 'text-anchor': 'middle' }, 'WINGSPAN 52 MM'),
    h('svg:text', { x: 126, y: 244, 'text-anchor': 'middle' }, 'LENGTH 28 MM'));
}

/* ------------------------------------------------------------------ specifications */
export function createSpecs({ onClose }) {
  const el = h('aside', { class: 'panel specs', 'aria-label': 'Specifications', hidden: true },
    h('div', { class: 'specs-head' }, h('h2', null, 'Specifications'), button('', 'close', { class: 'icon-btn', 'aria-label': 'Close specifications', onclick: onClose })),
    h('div', { class: 'specs-scroll' },
      h('dl', { class: 'spec-list' }, SPECS.flatMap(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
      h('div', { class: 'specs-sub' }, 'Mission systems'),
      h('div', { class: 'system-icons' }, SYSTEMS.map((s) => h('div', { class: 'sys' }, svgIcon(s.svg), h('span', null, s.label)))),
      h('div', { class: 'specs-sub' }, 'Scale'),
      sizeDiagram()));
  return { el, get open() { return !el.hidden; }, setOpen(on) { el.hidden = !on; } };
}

/* ------------------------------------------------------------------ controls overlay */
const HELP_ROWS = [
  [['Drag'], 'Orbit freely in 3D'],
  [['Right-drag', 'Shift-drag'], 'Pan'],
  [['Scroll', 'Pinch'], 'Zoom'],
  [['Click'], 'Select a part (Shift-click adds to the selection)'],
  [['Double-click'], 'Zoom to a part, or reset the view on empty space'],
  [['Space'], 'Explode or reassemble'],
  [['1', '–', '6'], 'Hero, side, top, front, rear and underside views'],
  [['I', 'X', 'L'], 'Isolate the selection, x-ray the shells, toggle labels'],
  [['A', 'C'], 'Auto-rotate, auto-cycle the explode animation'],
  [['[', ']'], 'Previous or next part'],
  [['F', 'R'], 'Frame the selection, reset the view'],
  [['P', 'S', 'T'], 'Parts directory, specifications, guided tour'],
  [['Esc'], 'Clear the selection and close panels'],
];

export function createHelp({ onClose }) {
  const ok = button('Got it', null, { class: 'chip on', onclick: onClose });
  const el = h('div', { class: 'help', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'help-title', hidden: true },
    h('div', { class: 'help-card' },
      h('h2', { id: 'help-title' }, 'Exploring the APX-9'),
      h('p', null, 'Every shell, actuator, sensor and joint is its own part. Take the bee apart with the explode slider, then pick components to identify them.'),
      h('dl', { class: 'help-grid' }, HELP_ROWS.flatMap(([keys, text]) => [h('dt', null, keys.map((k) => (k === '–' ? '–' : h('kbd', null, k)))), h('dd', null, text)])),
      h('div', { class: 'help-foot' }, ok)));
  el.addEventListener('pointerdown', (e) => { if (e.target === el) onClose(); });
  let back = null;
  return {
    el, ok,
    get open() { return !el.hidden; },
    setOpen(on) {
      if (on === !el.hidden) return;
      if (on) { back = document.activeElement; el.hidden = false; ok.focus({ preventScroll: true }); }
      else { el.hidden = true; if (back && back.isConnected) back.focus({ preventScroll: true }); back = null; }
    },
  };
}

/* ------------------------------------------------------------------ detail-view card (wing / leg blow-ups) */
export function createDetail({ onClose, onItemHover, onItemPick }) {
  const title = h('h2'), sub = h('p'), list = h('ul');
  const el = h('aside', { class: 'panel detail', 'aria-label': 'Detail view', hidden: true },
    h('div', { class: 'detail-head' }, h('div', null, title, sub), button('', 'close', { class: 'icon-btn', 'aria-label': 'Close detail view', onclick: onClose })),
    list);
  let current = null;
  const rows = new Map();
  return {
    el,
    get open() { return !el.hidden; },
    get key() { return current ? current.key : null; },
    show(def, resolve) {
      current = def;
      rows.clear();
      title.textContent = def.title;
      sub.textContent = def.sub;
      list.replaceChildren(...def.items.map((it) => {
        const part = resolve(it.child);
        const b = h('button', {
          type: 'button', class: part ? null : 'missing', 'aria-disabled': part ? null : 'true',
          onpointerenter: () => part && onItemHover(part), onpointerleave: () => onItemHover(null),
          onfocus: () => part && onItemHover(part), onblur: () => onItemHover(null),
          onclick: () => part && onItemPick(part, it),
        }, it.label);
        if (part) rows.set(part, b);
        return h('li', null, b);
      }));
      el.hidden = false;
    },
    hide() { current = null; rows.clear(); el.hidden = true; },
    mark(selected) {
      const within = (s, anc) => { for (let p = s; p; p = p.parent) if (p === anc) return true; return false; };
      for (const [part, b] of rows) b.classList.toggle('on', selected.some((s) => within(s, part)));
    },
  };
}

/* ------------------------------------------------------------------ guided tour card */
export function createTour({ onPrev, onNext, onExit, onPause }) {
  const step = h('span', { class: 'tour-step' });
  const title = h('h2');
  const text = h('p');
  const dots = h('div', { class: 'tour-dots', 'aria-hidden': 'true' });
  const prev = button('', 'prev', { class: 'icon-btn', 'aria-label': 'Previous step', title: 'Previous (Left arrow)', onclick: onPrev });
  const nextLbl = h('span', { class: 'lbl' }, 'Pause tour');
  const next = h('button', { type: 'button', class: 'chip on', title: 'Pause or resume (Space)', onclick: onPause }, nextLbl);
  const el = h('section', { class: 'panel tour', 'aria-label': 'Guided tour', 'aria-live': 'polite', hidden: true },
    h('div', { class: 'tour-top' }, step, button('', 'close', { class: 'icon-btn', 'aria-label': 'End the tour', title: 'End tour (Esc)', onclick: onExit })),
    title, text, h('div', { class: 'tour-bar' }, prev, dots, next));
  return {
    el,
    setPaused(paused) { nextLbl.textContent=paused?'Resume tour':'Pause tour'; },
    get open() { return !el.hidden; },
    show() { el.hidden = false; },
    hide() { el.hidden = true; },
    set(i, steps) {
      const s = steps[i];
      step.textContent = `Step ${i + 1} of ${steps.length}`;
      title.textContent = s.title;
      text.textContent = s.text;
      if (dots.childElementCount !== steps.length) dots.replaceChildren(...steps.map(() => h('i')));
      [...dots.children].forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'now' : ''; });
      prev.disabled = i === 0;
      prev.style.opacity = i === 0 ? '0.35' : '';

    },
  };
}
