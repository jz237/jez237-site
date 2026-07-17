// HTML HUD wiring: resource bar, tower cards, surge button, tower inspect,
// toasts. Pure DOM — the canvas stays untouched by UI concerns.

import { TOWERS, ECON } from './content.js';

export class UI {
  constructor(root, game) {
    this.game = game;
    this.root = root;
    this.el = {
      gold: root.querySelector('#gold'),
      lives: root.querySelector('#lives'),
      wave: root.querySelector('#wave'),
      surge: root.querySelector('#surge'),
      cards: root.querySelector('#cards'),
      toasts: root.querySelector('#toasts'),
      inspect: root.querySelector('#inspect'),
      banner: root.querySelector('#banner'),
      title: root.querySelector('#title'),
      fps: root.querySelector('#fps'),
    };
    this.buildCards();
    this.el.surge.addEventListener('click', () => game.callSurge());
    this.lastVals = {};
  }

  buildCards() {
    this.el.cards.innerHTML = '';
    let i = 1;
    for (const id of Object.keys(TOWERS)) {
      const t = TOWERS[id];
      const card = document.createElement('button');
      card.className = 'card';
      card.dataset.tower = id;
      const cssColor = `rgb(${t.color.map(c => Math.floor(Math.pow(c, 0.7) * 255)).join(',')})`;
      card.style.setProperty('--glow', cssColor);
      card.innerHTML = `<span class="key">${i}</span><span class="cname">${t.name}</span><span class="cost">◈ ${t.cost}</span>`;
      card.title = t.desc;
      card.addEventListener('click', () => this.game.armTower(id));
      this.el.cards.appendChild(card);
      i++;
    }
  }

  toast(text, cls = '') {
    const d = document.createElement('div');
    d.className = 'toast ' + cls;
    d.textContent = text;
    this.el.toasts.appendChild(d);
    setTimeout(() => d.classList.add('show'), 16);
    setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 500); }, 2600);
  }

  banner(text, sub = '') {
    const b = this.el.banner;
    b.innerHTML = `<div class="btext">${text}</div>${sub ? `<div class="bsub">${sub}</div>` : ''}`;
    b.classList.remove('bshow');
    void b.offsetWidth;
    b.classList.add('bshow');
  }

  update(sim, armed) {
    const set = (key, el, val) => { if (this.lastVals[key] !== val) { el.textContent = val; this.lastVals[key] = val; } };
    set('gold', this.el.gold, `◈ ${sim.gold}`);
    set('lives', this.el.lives, `❤ ${sim.lives}`);
    set('wave', this.el.wave, sim.state === 'prep' ? `WAVE ${sim.wave + 1}` : `WAVE ${sim.wave}`);
    // surge button
    const s = this.el.surge;
    if (sim.state === 'prep') {
      const bonus = Math.floor(Math.max(0, sim.prepLeft) * ECON.surgeBonusPerSec);
      s.textContent = `CALL THE SURGE  +◈${bonus}  (${Math.ceil(Math.max(0, sim.prepLeft))}s)`;
      s.classList.add('ready');
      s.disabled = false;
    } else {
      s.textContent = sim.state === 'wave' ? 'SURGE INBOUND' : '—';
      s.classList.remove('ready');
      s.disabled = true;
    }
    // card affordability + armed state
    for (const card of this.el.cards.children) {
      const t = TOWERS[card.dataset.tower];
      card.classList.toggle('poor', sim.gold < t.cost);
      card.classList.toggle('armed', armed === card.dataset.tower);
    }
  }

  showInspect(tower, sim) {
    const el = this.el.inspect;
    if (!tower) { el.classList.remove('open'); return; }
    const next = tower.def.levels[tower.level + 1];
    const st = sim.towerStats(tower);
    const statLine = tower.def.attack === 'aura'
      ? `+${Math.round(st.buffRate * 100)}% rate · +${Math.round(st.buffDmg * 100)}% damage · range ${st.range}`
      : `damage ${st.damage} · range ${st.range} · rate ${st.rate.toFixed(2)}/s`;
    el.innerHTML = `
      <div class="iname">${tower.def.name} <span class="ilvl">◆${'◆'.repeat(tower.level)}</span></div>
      <div class="irow">${statLine}</div>
      <div class="irow dim">${tower.def.attack === 'aura' ? 'support' : 'kills ' + tower.kills}${tower.def.status ? ' · inflicts ' + tower.def.status : ''}</div>
      <div class="ibtns">
        ${next ? `<button id="btnUp" ${sim.gold < next.cost ? 'disabled' : ''}>GROW ◈${next.cost}</button>` : '<span class="dim">fully grown</span>'}
        <button id="btnSell">RELEASE ◈${Math.floor(tower.spent * ECON.sellRefund)}</button>
      </div>`;
    el.classList.add('open');
    const up = el.querySelector('#btnUp');
    if (up) up.onclick = () => this.game.upgradeSelected();
    el.querySelector('#btnSell').onclick = () => this.game.sellSelected();
  }
}
