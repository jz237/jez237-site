// Part inspector (right panel / mobile bottom sheet) and the parts directory (left drawer with search).
import { h, icon, button } from './dom.js';
import { GROUPS } from './data.js';

const groupTitle = (g) => GROUPS[g]?.title || (g ? g.replace(/-/g, ' ').toUpperCase() : 'APX-9');

function ancestry(part) {
  const out = [];
  for (let p = part; p && p.node && !p.isRoot; p = p.parent) out.unshift(p);
  return out;
}

function selectableList(bee) {
  const out = [];
  const visit = (p) => { if (p.selectable !== false) out.push(p); for (const c of p.children) visit(c); };
  for (const t of bee.tops) visit(t);
  return out;
}

/* ====================================================================== inspector */
export class Inspector {
  constructor(app, { host, actions }) {
    this.app = app;
    this.actions = actions;
    this.order = selectableList(app.bee);
    this.el = h('aside', { class: 'panel inspector', 'aria-label': 'Part inspector', hidden: true });
    this.body = h('div', { class: 'insp-scroll' });
    this.foot = h('div', { class: 'insp-foot' });
    this.head = h('div', { class: 'insp-head' });
    this.el.append(this.head, this.body, this.foot);
    host.append(this.el);
    this.open = false;
  }

  get width() { return this.open && !this.el.hidden ? this.el.getBoundingClientRect().width : 0; }

  render() {
    const sel = this.app.selection;
    const parts = sel.selected;
    if (!parts.length) { this.hide(); return; }
    const wasHidden = this.el.hidden;
    this.open = true;
    this.el.hidden = false;
    if (wasHidden) void this.el.offsetWidth;
    this.el.classList.add('is-open');
    const primary = sel.primary || parts[0];
    const multi = parts.length > 1;

    // header: breadcrumbs + close
    const crumbs = h('nav', { class: 'crumbs', 'aria-label': 'Part hierarchy' });
    crumbs.append(h('button', { type: 'button', class: 'crumb', onclick: () => this.actions.clear() }, 'APX-9'));
    if (!multi) {
      for (const a of ancestry(primary).slice(0, -1)) {
        crumbs.append(h('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '/'), h('button', { type: 'button', class: 'crumb', onclick: () => this.actions.select(a) }, a.name));
      }
      crumbs.append(h('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '/'), h('span', { class: 'crumb is-here' }, primary.name));
    }
    this.head.replaceChildren(crumbs, button('', 'close', { class: 'icon-btn', 'aria-label': 'Close inspector', title: 'Close (Esc)', onclick: () => this.actions.clear() }));

    // body
    const body = [];
    if (multi) {
      body.push(h('div', { class: 'insp-chip' }, 'MULTI-SELECTION'), h('h2', { class: 'insp-name' }, `${parts.length} parts selected`));
      body.push(h('ul', { class: 'insp-list' }, parts.slice(0, 40).map((p) => h('li', null, h('button', { type: 'button', class: 'row', onclick: () => this.actions.select(p) }, h('span', { class: 'row-name' }, p.name), h('span', { class: 'row-meta' }, groupTitle(p.group)))))));
    } else {
      const g = GROUPS[primary.group];
      body.push(h('div', { class: 'insp-chip' }, groupTitle(primary.group)));
      body.push(h('h2', { class: 'insp-name' }, primary.name));
      if (primary.info) body.push(h('p', { class: 'insp-info' }, primary.info));
      const specs = Object.entries(primary.specs || {});
      if (specs.length) {
        body.push(h('div', { class: 'insp-sub' }, 'Specification'));
        body.push(h('dl', { class: 'insp-specs' }, specs.map(([k, v]) => [h('dt', null, k), h('dd', null, String(v))])));
      }
      const own = primary.bullets?.length ? primary.bullets : g?.bullets;
      if (own?.length) {
        body.push(h('div', { class: 'insp-sub' }, primary.bullets?.length ? 'Features' : 'Blueprint notes'));
        body.push(h('ul', { class: 'insp-bullets' }, own.map((b) => h('li', null, b))));
      }
      if (primary.children.length) {
        const kids = primary.children.filter((c) => c.selectable !== false);
        body.push(h('div', { class: 'insp-sub' }, `Components (${kids.length})`));
        body.push(h('ul', { class: 'insp-list' }, kids.slice(0, 60).map((c) => h('li', null, h('button', {
          type: 'button', class: 'row', onclick: () => this.actions.select(c), onpointerenter: () => this.actions.hover(c), onpointerleave: () => this.actions.hover(null),
        }, h('span', { class: 'row-name' }, c.name), c.children.length ? h('span', { class: 'row-meta' }, `${c.children.length}`) : null)))));
        if (kids.length > 60) body.push(h('p', { class: 'insp-more' }, `+ ${kids.length - 60} more`));
      }
      const dims = this.size(primary);
      if (dims) body.push(h('div', { class: 'insp-meta' }, h('span', null, 'SIZE'), h('b', null, dims)));
    }
    this.body.replaceChildren(...body);
    this.body.scrollTop = 0;

    // actions + prev/next
    const idx = this.order.indexOf(primary);
    const isolate = sel.isolate, xray = sel.xray;
    const act = h('div', { class: 'insp-actions' },
      !multi && primary.parent && !primary.parent.isRoot ? button('Parent', 'up', { class: 'chip', title: 'Select the parent assembly', onclick: () => this.actions.select(primary.parent) }) : null,
      button('Isolate', 'isolate', { class: `chip${isolate ? ' on' : ''}`, 'aria-pressed': String(isolate), title: 'Show only the selection (I)', onclick: () => this.actions.isolate(!sel.isolate) }),
      button('X-ray', 'xray', { class: `chip${xray ? ' on' : ''}`, 'aria-pressed': String(xray), title: 'Ghost the outer shells (X)', onclick: () => this.actions.xray(!sel.xray) }),
      button('Frame', 'frame', { class: 'chip', title: 'Zoom to the selection (F)', onclick: () => this.actions.frame() }));
    const nav = h('div', { class: 'insp-nav' },
      button('', 'prev', { class: 'icon-btn', 'aria-label': 'Previous part', title: 'Previous part ([)', onclick: () => this.step(-1) }),
      h('span', { class: 'insp-count' }, idx >= 0 ? `${idx + 1} / ${this.order.length}` : `${this.order.length} parts`),
      button('', 'next', { class: 'icon-btn', 'aria-label': 'Next part', title: 'Next part (])', onclick: () => this.step(1) }));
    this.foot.replaceChildren(act, nav);
    this.actions.layout?.();
  }

  size(part) {
    const r = part.hasBounds ? part.radius : 0;
    if (!(r > 0)) return '';
    const d = r * 2;
    return d >= 10 ? `~${d.toFixed(0)} mm` : d >= 1 ? `~${d.toFixed(1)} mm` : `~${(d * 1000).toFixed(0)} µm`;
  }

  step(dir) {
    const sel = this.app.selection;
    const cur = sel.primary || sel.selected[0];
    let i = this.order.indexOf(cur);
    i = i < 0 ? (dir > 0 ? 0 : this.order.length - 1) : (i + dir + this.order.length) % this.order.length;
    this.actions.select(this.order[i], true);
  }

  hide() {
    this.open = false;
    this.el.classList.remove('is-open');
    this.el.hidden = true;
    this.actions.layout?.();
  }
}

/* ====================================================================== directory */
export class Directory {
  constructor(app, { host, actions }) {
    this.app = app;
    this.actions = actions;
    this.index = selectableList(app.bee).map((p) => ({ p, hay: `${p.name} ${p.id} ${p.info || ''} ${groupTitle(p.group)}`.toLowerCase() }));
    this.rows = new Map();
    this.open = false;
    this.input = h('input', { type: 'search', class: 'dir-input', placeholder: 'Search parts…', 'aria-label': 'Search parts', autocomplete: 'off', spellcheck: 'false' });
    this.input.addEventListener('input', () => this.search(this.input.value));
    this.tree = h('div', { class: 'dir-tree', role: 'tree' });
    this.results = h('ul', { class: 'dir-results', hidden: true });
    this.details = h('div', { class: 'dir-details' },
      button('Wing structure', 'wing', { class: 'chip', onclick: () => this.actions.detail('wing') }),
      button('Leg mechanism', 'leg', { class: 'chip', onclick: () => this.actions.detail('leg') }));
    this.el = h('aside', { class: 'panel directory', 'aria-label': 'Parts directory', hidden: true },
      h('div', { class: 'dir-head' }, h('h2', null, 'Parts'), h('span', { class: 'dir-count' }, `${this.index.length}`), button('', 'close', { class: 'icon-btn', 'aria-label': 'Close parts directory', onclick: () => this.actions.toggleDirectory(false) })),
      h('div', { class: 'dir-search' }, icon('search'), this.input),
      this.details,
      this.tree, this.results);
    host.append(this.el);
    this.build();
  }

  get width() { return this.open ? this.el.getBoundingClientRect().width : 0; }

  setOpen(on) {
    this.open = on;
    this.el.hidden = !on;
    if (on) { this.sync(); }
  }

  row(part, depth) {
    const hasKids = part.children.some((c) => c.selectable !== false);
    const btn = h('button', {
      type: 'button', class: 'dir-row', role: 'treeitem', 'data-id': part.id, style: { '--d': depth },
      onclick: () => this.actions.select(part, true),
      onpointerenter: () => this.actions.hover(part), onpointerleave: () => this.actions.hover(null),
    }, h('span', { class: 'dir-name' }, part.name), part.children.length ? h('span', { class: 'row-meta' }, `${part.children.length}`) : null);
    this.rows.set(part, btn);
    if (!hasKids) return h('div', { class: 'dir-node leaf' }, btn);
    const det = h('details', { class: 'dir-node' }, h('summary', null, icon('chevron', 'chev'), btn));
    let filled = false;
    const fill = () => {
      if (filled) return;
      filled = true;
      for (const c of part.children) if (c.selectable !== false) det.append(this.row(c, depth + 1));
    };
    det.addEventListener('toggle', () => { if (det.open) fill(); });
    det._fill = fill;
    det._part = part;
    return det;
  }

  build() {
    const byGroup = new Map();
    for (const t of this.app.bee.tops) {
      const g = t.group || 'chassis';
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g).push(t);
    }
    const keys = [...byGroup.keys()].sort((a, b) => (GROUPS[a]?.order ?? 99) - (GROUPS[b]?.order ?? 99));
    const frag = [];
    for (const g of keys) {
      const tops = byGroup.get(g);
      let count = 0;
      const sec = h('details', { class: 'dir-group', open: keys.length < 3 ? true : null }, h('summary', null, icon('chevron', 'chev'), h('span', { class: 'dir-gname' }, groupTitle(g)), h('span', { class: 'row-meta' }, '')));
      for (const t of tops) {
        sec.append(this.row(t, 0));
        for (const _ of t.walk()) count++;
      }
      sec.querySelector('.row-meta').textContent = String(count);
      frag.push(sec);
    }
    this.tree.replaceChildren(...frag);
  }

  search(q) {
    q = q.trim().toLowerCase();
    if (!q) { this.results.hidden = true; this.tree.hidden = false; return; }
    const terms = q.split(/\s+/);
    const hits = this.index.filter((e) => terms.every((t) => e.hay.includes(t))).slice(0, 80);
    this.tree.hidden = true;
    this.results.hidden = false;
    this.results.replaceChildren(...(hits.length ? hits.map(({ p }) => h('li', null, h('button', {
      type: 'button', class: 'row', onclick: () => this.actions.select(p, true), onpointerenter: () => this.actions.hover(p), onpointerleave: () => this.actions.hover(null),
    }, h('span', { class: 'row-name' }, p.name), h('span', { class: 'row-meta' }, groupTitle(p.group))))) : [h('li', { class: 'dir-empty' }, 'No matching parts')]));
  }

  /** Highlight the current selection and reveal it in the tree. */
  sync() {
    if (!this.open) return;
    const primary = this.app.selection.primary;
    if (primary) {
      // open each ancestor (top group first) so the rows exist, then scroll to the primary row
      const chain = ancestry(primary);
      for (const a of chain.slice(0, -1)) {
        const det = this.rows.get(a)?.closest('details.dir-node');
        if (det) { det.open = true; det._fill?.(); }
      }
      const grp = this.rows.get(chain[0])?.closest('.dir-group');
      if (grp) grp.open = true;
    }
    const sel = new Set(this.app.selection.selected);
    for (const [p, btn] of this.rows) btn.classList.toggle('is-sel', sel.has(p));
    const btn = primary && this.rows.get(primary);
    if (btn) btn.scrollIntoView({ block: 'nearest' });
  }
}
