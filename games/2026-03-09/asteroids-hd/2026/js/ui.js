// DOM: HUD panels, floating pop-ups, banners, power-up toasts and screen switching.
import { F, POWERUPS } from './config.js?v=2';
import { bossHP, bossMax, dashLen, odLen } from './sim.js?v=2';

const $ = (id) => document.getElementById(id);
const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const FX_SHOW = ['triple', 'rapid', 'shield', 'missiles', 'magnet', 'phase', 'chrono', 'drone', 'rail'];

export class UI {
  constructor() {
    this.screens = [...document.querySelectorAll('.screen')];
    this.hud = $('hud');
    this.popups = $('popups');
    this.banner = $('banner');
    this.cache = new Map();
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

  buildHud(sides, W) {
    this.cache.clear();
    for (const s of [1, -1]) {
      const d = sides[s];
      const el = $('hud-' + s);
      el.style.setProperty('--c', hex(d.color));
      const ship = W.ships.find((q) => q.side === s);
      if (!ship && W.boss) {
        el.innerHTML = `
          <div class="pname" style="color:${hex(d.color)};text-shadow:0 0 10px ${hex(d.color)}">${d.name}</div>
          <div class="ptitle">${d.title}</div>
          <div class="row"><span class="lbl">EYES</span><div class="pips eyes">${'<i class="pip"></i>'.repeat(4)}</div></div>
          <div class="row"><span class="lbl">HIVE</span><div class="hpbar"><i></i></div></div>
          <div class="fxs"></div>`;
        this.cache.set(s, { boss: true, el: { pips: [...el.querySelectorAll('.pip')], bar: el.querySelector('.hpbar i') }, last: {} });
        continue;
      }
      const max = ship ? ship.max : F.hull;
      el.innerHTML = `
        <div class="pname" style="color:${hex(d.color)};text-shadow:0 0 10px ${hex(d.color)}">${d.name}</div>
        <div class="ptitle">${d.title}</div>
        <div class="row"><span class="lbl">HULL</span><div class="pips">${'<i class="pip"></i>'.repeat(max)}</div></div>
        <div class="row"><span class="lbl">BOOST</span><div class="dash"><i></i></div><div class="odbar"><i></i></div></div>
        <div class="fxs"></div>`;
      this.cache.set(s, { el: { pips: [...el.querySelectorAll('.pip')], dash: el.querySelector('.dash'), dashi: el.querySelector('.dash i'), od: el.querySelector('.odbar'), odi: el.querySelector('.odbar i'), fxs: el.querySelector('.fxs') }, last: {} });
    }
    document.documentElement.style.setProperty('--p1', hex(sides[1].color));
    document.documentElement.style.setProperty('--p2', hex(sides[-1].color));
  }

  updateHud(W) {
    for (const s of [1, -1]) {
      const c = this.cache.get(s);
      if (!c) continue;
      const { el, last } = c;
      if (c.boss) {
        const B = W.boss;
        if (!B) continue;
        const k = B.eyes.map((e) => (e.hp > 0 ? 1 : 0)).join('') + '|' + bossHP(B);
        if (last.k !== k) {
          last.k = k;
          el.pips.forEach((p, i) => p.classList.toggle('on', B.eyes[i].hp > 0));
          el.bar.style.width = Math.round((bossHP(B) / bossMax(B)) * 100) + '%';
        }
        continue;
      }
      const ship = W.ships.find((q) => q.side === s);
      if (!ship) continue;
      const hk = ship.hp + '|' + ship.max;
      if (last.hp !== hk) {
        last.hp = hk;
        el.pips.forEach((p, i) => { p.classList.toggle('on', i < ship.hp); p.classList.toggle('crit', ship.hp <= 2); });
      }
      const dk = ship.dashCD <= 0 ? 100 : Math.round((1 - ship.dashCD / dashLen(W, s)) * 100);
      if (last.dash !== dk) { last.dash = dk; el.dashi.style.width = Math.max(0, dk) + '%'; el.dash.classList.toggle('ready', dk >= 100); }
      const od = ship.odTime > 0 ? Math.round((ship.odTime / odLen(W, s)) * 100) : Math.round(ship.od);
      if (last.od !== od) {
        last.od = od;
        el.odi.style.width = od + '%';
        el.od.classList.toggle('full', ship.od >= F.odMax && ship.odTime <= 0);
        el.od.classList.toggle('active', ship.odTime > 0);
      }
      const list = [];
      for (const k of FX_SHOW) {
        const v = k === 'shield' ? ship.fx.shield : ship.fx[k];
        if (v > 0) list.push([k, k === 'shield' ? v + '×' : Math.ceil(v)]);
      }
      const fk = list.map((x) => x.join(':')).join(',');
      if (last.fx !== fk) {
        last.fx = fk;
        el.fxs.innerHTML = list.map(([k, t]) => `<span class="fx" style="--fc:${hex(POWERUPS[k].color)}">${POWERUPS[k].glyph}<small>${t}</small></span>`).join('');
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

  showBanner(t1, t2 = '', color = '#39f3ff', dur = 1.6) {
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
