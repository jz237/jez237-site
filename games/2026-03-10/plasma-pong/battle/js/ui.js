// DOM: HUD panels, floating pop-ups, banners, power-up toasts and screen switching.
import { F, POWERUPS } from './config.js?v=3';

const $ = (id) => document.getElementById(id);
const hex = (c) => '#' + c.toString(16).padStart(6, '0');

export class UI {
  constructor() {
    this.screens = [...document.querySelectorAll('.screen')];
    this.hud = $('hud');
    this.popups = $('popups');
    this.banner = $('banner');
    this.cache = new Map();
    this.bannerT = 0;
  }

  show(id) {
    for (const s of this.screens) s.classList.toggle('hidden', s.id !== id);
    this.current = id;
  }
  hideScreens() { this.show(null); }

  setHud(on) {
    this.hud.classList.toggle('hidden', !on);
    document.getElementById('ui').classList.toggle('hud-on', on);
  }

  // sides: {1: {name, title, color}, -1: {...}}, maxHP per side
  buildHud(sides, W) {
    this.cache.clear();
    for (const s of [1, -1]) {
      const d = sides[s];
      const el = $('hud-' + s);
      el.style.setProperty('--c', hex(d.color));
      el.querySelector && (el.innerHTML = `
        <div class="pname" style="color:${hex(d.color)};text-shadow:0 0 10px ${hex(d.color)}">${d.name}</div>
        <div class="ptitle">${d.title}</div>
        <div class="row"><span class="lbl">CORE</span><div class="pips">${'<i class="pip"></i>'.repeat(W.cores[s].max)}</div></div>
        <div class="row"><span class="lbl">SHIELD</span><div class="cells">${'<i class="cell"></i>'.repeat(F.cells)}</div></div>
        <div class="row"><span class="lbl">BOLTS</span><div class="bolts">${'<i class="bolt"></i>'.repeat(F.boltCharges)}</div><div class="odbar"><i></i></div></div>
        <div class="fxs"></div>`);
      const r = { pips: [...el.querySelectorAll('.pip')], cells: [...el.querySelectorAll('.cell')], bolts: [...el.querySelectorAll('.bolt')], od: el.querySelector('.odbar'), odi: el.querySelector('.odbar i'), fxs: el.querySelector('.fxs') };
      // the far side's cells read right-to-left from its own point of view; keep court order for clarity
      this.cache.set(s, { el: r, last: {} });
    }
    document.documentElement.style.setProperty('--p1', hex(sides[1].color));
    document.documentElement.style.setProperty('--p2', hex(sides[-1].color));
  }

  updateHud(W) {
    for (const s of [1, -1]) {
      const c = this.cache.get(s);
      if (!c) continue;
      const { el, last } = c;
      const core = W.cores[s];
      const key = core.hp + '|' + core.max;
      if (last.core !== key) {
        last.core = key;
        el.pips.forEach((p, i) => { p.classList.toggle('on', i < core.hp); p.classList.toggle('crit', core.hp <= 2); });
      }
      const ck = W.cells[s].map((x) => Math.ceil(x.hp / x.max * 2)).join('');
      if (last.cells !== ck) {
        last.cells = ck;
        // court order (x ascending) matches the default camera for both sides
        const order = W.cells[s];
        el.cells.forEach((e, i) => { const h = Math.ceil((order[i].hp / order[i].max) * 2); e.className = 'cell h' + h; });
      }
      const m = W.meter[s];
      const ch = Math.floor(m.charges) + '|' + (m.odTime > 0);
      if (last.ch !== ch) { last.ch = ch; el.bolts.forEach((b, i) => b.classList.toggle('on', m.odTime > 0 || i < Math.floor(m.charges))); }
      const od = m.odTime > 0 ? Math.round((m.odTime / F.odTime) * 100) : Math.round(m.od);
      if (last.od !== od) {
        last.od = od;
        el.odi.style.width = od + '%';
        el.od.classList.toggle('full', m.od >= 100 && m.odTime <= 0);
        el.od.classList.toggle('active', m.odTime > 0);
      }
      const fx = W.fx[s];
      const list = [];
      for (const [k, key2] of [['titan', 'titan'], ['shrink', 'shrink'], ['nova', 'nova'], ['drone', 'drone'], ['ghost', 'ghost'], ['barrier', 'barrier'], ['chrono', 'chrono'], ['scope', 'scope'], ['magnetT', 'magnet']]) {
        if (fx[k] > 0) list.push([key2, Math.ceil(fx[k])]);
      }
      const fk = list.map((x) => x.join(':')).join(',');
      if (last.fx !== fk) {
        last.fx = fk;
        el.fxs.innerHTML = list.map(([k, t]) => `<span class="fx" style="--fc:${hex(POWERUPS[k].color)}">${POWERUPS[k].glyph}<small>${k === 'magnet' ? fx.magnet + '×' : t}</small></span>`).join('');
      }
    }
  }

  pop(x, y, text, color = '#fff', size = '') {
    const d = document.createElement('div');
    d.className = 'pop ' + size;
    d.textContent = text;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.color = color;
    this.popups.appendChild(d);
    setTimeout(() => d.remove(), 1150);
    if (this.popups.childElementCount > 14) this.popups.firstElementChild.remove();
  }

  showBanner(t1, t2 = '', color = '#2ff5ff', dur = 1.6) {
    const b = this.banner;
    b.querySelector('.b1').textContent = t1;
    b.querySelector('.b2').textContent = t2;
    b.style.setProperty('--bc', color);
    b.classList.remove('hidden', 'show');
    void b.offsetWidth;
    b.classList.add('show');
    clearTimeout(this.bannerTimer);
    if (dur > 0) this.bannerTimer = setTimeout(() => b.classList.add('hidden'), dur * 1000);
  }
  hideBanner() { this.banner.classList.add('hidden'); }

  toast(side, kind) {
    const def = POWERUPS[kind];
    const host = $('toast-' + side);
    const d = document.createElement('div');
    d.className = 'toast';
    d.style.setProperty('--tc', hex(def.color));
    d.innerHTML = `${def.glyph} ${def.name}<small>${def.desc}</small>`;
    host.innerHTML = '';
    host.appendChild(d);
    setTimeout(() => d.remove(), 1850);
  }

  hurt() {
    const f = $('flashframe');
    f.classList.add('hurt');
    setTimeout(() => f.classList.remove('hurt'), 60);
  }
}

export { $, hex };
