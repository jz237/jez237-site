/**
 * Screen-space label layout for the studio.
 *
 * Two kinds of label share the layer:
 *  - floating labels (system landmarks, study landmarks) sit above their piece and are nudged apart when they collide;
 *  - "label every piece" labels are pulled out into a column down each side of the stage, joined to their piece by a
 *    leader line, so the model in the middle stays visible.
 *
 * Each entry of `placed` is { el, x, y, kind, priority } with x/y the projected anchor in CSS pixels.
 * Returns { leaders, shown, total } where `leaders` is SVG markup for the leader lines.
 */

const ROW = 20;            // vertical pitch of a side-column label
const MARGIN = 14;         // gap between a column and the edge of the stage
const TOP = 16;
const BOTTOM_RIGHT = 46;    // the explode panel overlaps the bottom edge of the label layer
const BOTTOM_LEFT = 118;   // the camera toolbar and gesture hint sit in the bottom-left corner

const sizes = new WeakMap();

/** Label sizes never change after creation, so measure once: reading offsetWidth every frame forces a reflow. */
function measure(el) {
  let s = sizes.get(el);
  if (!s) {
    s = { w: el.offsetWidth, h: el.offsetHeight };
    if (s.w) sizes.set(el, s);
  }
  return s.w ? s : { w: 80, h: 22 };
}

function floating(list) {
  let leaders = '';
  list.sort((a, b) => a.y - b.y);
  for (let i = 0; i < list.length; i++) {
    const l = list[i];
    const { w, h } = measure(l.el);
    l.w = w;
    l.h = h;
    const ax = l.x, ay = l.y;
    for (let pass = 0; pass < 4; pass++) {
      for (let j = 0; j < i; j++) {
        const o = list[j];
        if (Math.abs(l.x - o.x) < (l.w + o.w) / 2 + 4 && Math.abs(l.y - o.y) < (l.h + o.h) / 2 + 2) l.y = o.y + (o.h + l.h) / 2 + 3;
      }
    }
    l.el.classList.remove('col-l', 'col-r');
    l.el.style.left = `${l.x}px`;
    l.el.style.top = `${l.y}px`;
    if (Math.abs(l.y - ay) > 6) leaders += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${l.x.toFixed(1)}" y2="${(l.y - 2).toFixed(1)}"/>`;
  }
  return leaders;
}

function column(list, side, W, H) {
  const bottom = H - (side === 'l' ? BOTTOM_LEFT : BOTTOM_RIGHT);
  const capacity = Math.max(1, Math.floor((bottom - TOP) / ROW));
  if (list.length > capacity) {
    // not enough room: keep the largest pieces; zooming in drops off-screen pieces and frees rows for the rest
    list.sort((a, b) => b.priority - a.priority);
    for (const l of list.splice(capacity)) l.el.hidden = true;
  }
  list.sort((a, b) => a.y - b.y);
  // one pass down to clear overlaps, one pass up to pull the column back inside the stage
  let y = TOP;
  for (const l of list) { l.ly = Math.max(l.y, y); y = l.ly + ROW; }
  let limit = bottom;
  for (let i = list.length - 1; i >= 0; i--) { list[i].ly = Math.min(list[i].ly, limit); limit = list[i].ly - ROW; }
  let leaders = '';
  for (const l of list) {
    const { w } = measure(l.el);
    const lx = side === 'l' ? MARGIN : W - MARGIN;
    l.el.classList.toggle('col-l', side === 'l');
    l.el.classList.toggle('col-r', side === 'r');
    l.el.style.left = `${lx}px`;
    l.el.style.top = `${l.ly}px`;
    const edge = side === 'l' ? lx + w + 3 : lx - w - 3;
    leaders += `<line x1="${l.x.toFixed(1)}" y1="${l.y.toFixed(1)}" x2="${edge.toFixed(1)}" y2="${l.ly.toFixed(1)}"/>`;
  }
  return { leaders, shown: list.length };
}

export function layoutLabels(placed, W, H) {
  const floats = placed.filter(l => l.kind !== 'all');
  const all = placed.filter(l => l.kind === 'all');
  let leaders = floating(floats);
  let shown = 0;
  if (all.length) {
    // split at the median so both columns carry the same number of labels and leaders rarely cross the model
    all.sort((a, b) => a.x - b.x);
    const half = Math.ceil(all.length / 2);
    const left = column(all.slice(0, half), 'l', W, H);
    const right = column(all.slice(half), 'r', W, H);
    leaders += left.leaders + right.leaders;
    shown = left.shown + right.shown;
  }
  return { leaders, shown, total: all.length };
}
