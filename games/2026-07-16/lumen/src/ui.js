// HTML HUD wiring: resource bar, tower cards, surge button, tower inspect,
// toasts. Pure DOM — the canvas stays untouched by UI concerns.

import { TOWERS, ECON, MAPS } from './content.js';
import { localScores, fetchGlobal } from './scores.js';
import { journal } from './journal.js';
import { MIXES } from './content.js';

const GLYPHS = { coral: '❋', tesla: '✺', spire: '❆', urchin: '✴', bloom: '❁', bramble: '✿', bulb: '◉' };

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
    this.buildMapPicker();
    // audio sliders on the title screen
    for (const [id, kind] of [['volMaster', 'master'], ['volMusic', 'music'], ['volSfx', 'sfx']]) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.value = game.audio ? game.audio.settings[kind] : 0.7;
      el.addEventListener('input', () => game.audio.setVolume(kind, parseFloat(el.value)));
    }
    const qsel = document.getElementById('qualitySel');
    if (qsel) {
      qsel.value = (game.audio && game.audio.settings.quality) || 'auto';
      qsel.addEventListener('change', () => { game.audio.settings.quality = qsel.value; game.audio.save(); });
    }
    this.el.surge.addEventListener('click', () => game.callSurge());
    const bp = document.getElementById('btnPause');
    if (bp) bp.addEventListener('click', () => game.togglePause());
    const bs = document.getElementById('btnSpeed');
    if (bs) bs.addEventListener('click', () => game.cycleSpeed());
    this.lastVals = {};
  }

  buildMapPicker() {
    const wrap = document.getElementById('maps');
    if (!wrap) return;
    wrap.innerHTML = '';
    MAPS.forEach((m, i) => {
      const b = document.createElement('button');
      b.className = 'mapcard' + (i === this.game.mapIndex ? ' sel' : '');
      const best = journal.get().best[m.id];
      const bestLine = best ? `<div class="mbest">${best.won ? '✦ ' : ''}best · wave ${best.wave}</div>` : '';
      b.innerHTML = `<div class="mname">${m.name}</div><div class="mblurb">${m.blurb}</div>${bestLine}`;
      b.addEventListener('click', () => {
        this.game.selectMap(i);
        for (const c of wrap.children) c.classList.remove('sel');
        b.classList.add('sel');
      });
      wrap.appendChild(b);
    });
  }

  renderJournal() {
    const el = document.getElementById('journal');
    if (!el) return;
    const j = journal.get();
    const chips = Object.keys(MIXES).map(id => {
      const m = MIXES[id];
      const found = !!j.mixes[id];
      const c = m.color.map(v => Math.floor(Math.pow(v, 0.7) * 255)).join(',');
      return `<span class="jchip${found ? ' found' : ''}" style="--jc: rgb(${c})" title="${found ? m.desc : 'undiscovered reaction'}">${found ? m.name : '?'}</span>`;
    }).join('');
    el.innerHTML = `<span class="jlabel">REACTIONS</span>${chips}`;
  }

  async renderBoard() {
    const el = document.getElementById('board');
    if (!el) return;
    const local = localScores();
    el.innerHTML = '<div class="btitle">BRIGHTEST GROVES</div><div class="dim" style="opacity:0.5">reaching into the dark…</div>';
    const global = await fetchGlobal();
    const list = (global && global.length ? global : local).slice(0, 8);
    if (!list.length) { el.innerHTML = '<div class="btitle">BRIGHTEST GROVES</div><div style="opacity:0.5;font-size:12px">no lights etched yet — be first</div>'; return; }
    const rows = list.map((s, i) =>
      `<tr><td class="rk">${i + 1}</td><td>${(s.initials || '???')}</td><td class="sc">${s.score}</td><td class="rk">${(s.extra && s.extra.wave) ? 'w' + s.extra.wave : ''}</td></tr>`).join('');
    el.innerHTML = `<div class="btitle">BRIGHTEST GROVES ${global && global.length ? '· GLOBAL' : '· THIS GROVE'}</div><table>${rows}</table>`;
  }

  showGameOver(sim, won) {
    const g = document.getElementById('gameover');
    document.getElementById('gotitle').textContent = won ? 'THE GROVE ENDURES' : 'THE LIGHT GOES OUT';
    document.getElementById('gosub').textContent =
      `${won ? 'campaign complete' : 'overrun'} · wave ${sim.wave} · ${sim.kills} fallen · ${MAPS[this.game.mapIndex].name}`;
    document.getElementById('goscore').textContent = `✦ ${sim.score()}`;
    document.getElementById('gonote').textContent = '';
    g.classList.add('open');
  }

  hideGameOver() { document.getElementById('gameover').classList.remove('open'); }

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
      card.innerHTML = `<span class="key">${i}</span><span class="glyph">${GLYPHS[id] || '❖'}</span><span class="cname">${t.name}</span><span class="cost">◈ ${t.cost}</span>`;
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
