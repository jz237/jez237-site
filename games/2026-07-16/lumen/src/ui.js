// HTML HUD wiring: resource bar, tower cards, surge button, tower inspect,
// toasts. Pure DOM — the canvas stays untouched by UI concerns.

import { TOWERS, ECON, MAPS, ENEMIES, waveComp } from './content.js';
import { localScores, fetchGlobal, dailyInfo } from './scores.js';
import { journal } from './journal.js';
import { MIXES } from './content.js';

const GLYPHS = { coral: '❋', tesla: '✺', spire: '❆', urchin: '✴', bloom: '❁', bramble: '✿', bulb: '◉' };
const FOE_GLYPHS = { mite: '·', grub: '◗', wisp: '✧', husk: '▣', brood: '◉', shellback: '⬡',
  dartfin: '➤', bulwark: '▲', spectre: '☽', regen: '✚', broodmother: '❂', unlit: '⬤' };

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
    for (const [id, kind] of [['volMaster', 'master'], ['volMusic', 'music'], ['volSfx', 'sfx'], ['volVoice', 'voice']]) {
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
    const daily = dailyInfo();
    const db = document.createElement('button');
    db.className = 'mapcard daily' + (this.game.daily ? ' sel' : '');
    db.innerHTML = `<div class="mname">☀ DAILY GROVE</div><div class="mblurb">${daily.label} · one seed for everyone · own board</div>`;
    db.addEventListener('click', () => {
      this.game.selectDaily();
      for (const c of wrap.children) c.classList.remove('sel');
      db.classList.add('sel');
      this.renderBoard();
    });
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
        this.renderBoard();
      });
      wrap.appendChild(b);
    });
    wrap.appendChild(db);
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
    const global = await fetchGlobal(this.game.daily ? dailyInfo().board : undefined);
    const list = (global && global.length ? global : local).slice(0, 8);
    if (!list.length) { el.innerHTML = '<div class="btitle">BRIGHTEST GROVES</div><div style="opacity:0.5;font-size:12px">no lights etched yet — be first</div>'; return; }
    const rows = list.map((s, i) =>
      `<tr><td class="rk">${i + 1}</td><td>${(s.initials || '???')}</td><td class="sc">${s.score}</td><td class="rk">${(s.extra && s.extra.wave) ? 'w' + s.extra.wave : ''}</td></tr>`).join('');
    el.innerHTML = `<div class="btitle">${this.game.daily ? '☀ TODAY’S GROVES' : 'BRIGHTEST GROVES'} ${global && global.length ? '· GLOBAL' : '· THIS GROVE'}</div><table>${rows}</table>`;
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
      card.innerHTML = `<span class="key">${i}</span><span class="chip"><span class="glyph">${GLYPHS[id] || '❖'}</span></span><span class="cname">${t.name}</span><span class="cost">◈ ${t.cost}</span>`;
      card.title = t.desc;
      card.addEventListener('click', () => this.game.armTower(id));
      this.el.cards.appendChild(card);
      i++;
    }
  }

  toast(text, cls = '') {
    if (window.__lumenNS) return; // staged captures stay clean
    const d = document.createElement('div');
    d.className = 'toast ' + cls;
    d.textContent = text;
    this.el.toasts.appendChild(d);
    setTimeout(() => d.classList.add('show'), 16);
    setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 500); }, 2600);
  }

  banner(text, sub = '') {
    if (window.__lumenNS) return; // staged captures stay clean
    const b = this.el.banner;
    b.innerHTML = `<div class="btext">${text}</div>${sub ? `<div class="bsub">${sub}</div>` : ''}`;
    b.classList.remove('bshow');
    void b.offsetWidth;
    b.classList.add('bshow');
  }

  update(sim, armed) {
    const set = (key, el, val) => { if (this.lastVals[key] !== val) { el.textContent = val; this.lastVals[key] = val; } };
    // (surge uses innerHTML directly below — not routed through set())
    set('gold', this.el.gold, `◈ ${sim.gold}`);
    set('lives', this.el.lives, `❤ ${sim.lives}`);
    set('wave', this.el.wave, sim.state === 'prep' ? `WAVE ${sim.wave + 1}` : `WAVE ${sim.wave}`);
    const ws = document.getElementById('waveSub');
    if (ws) {
      if (sim.state === 'wave' && sim.waveTotal) {
        const remaining = Math.min(sim.waveTotal, sim.spawnQueue.length + sim.enemies.length);
        set('waveSub', ws, `☄ ${remaining} / ${sim.waveTotal}`);
      } else set('waveSub', ws, '');
    }
    // surge button
    const s = this.el.surge;
    if (sim.state === 'prep') {
      const bonus = Math.floor(Math.max(0, sim.prepLeft) * ECON.surgeBonusPerSec);
      const coarse = document.body.classList.contains('coarse');
      s.innerHTML = coarse ? `<span class="schip">≋</span>SURGE +◈${bonus}` : `<span class="schip">≋</span>CALL THE SURGE +◈${bonus} (${Math.ceil(Math.max(0, sim.prepLeft))}s)`;
      s.classList.add('ready');
      s.disabled = false;
    } else {
      s.innerHTML = sim.state === 'wave' ? `<span class="schip">≋</span>` + (document.body.classList.contains('coarse') ? 'INBOUND' : 'SURGE INBOUND') : '—';
      s.classList.remove('ready');
      s.disabled = true;
    }
    // upcoming-wave forecast during prep (total information)
    const pv = document.getElementById('wavePreview');
    if (pv) {
      if (sim.state === 'prep') {
        const next = sim.wave + 1;
        if (this._pvWave !== next) {
          this._pvWave = next;
          const comp = waveComp(next);
          const counts = {};
          for (const e of comp.entries) counts[e.type] = (counts[e.type] || 0) + Math.floor(e.count);
          const bits = Object.keys(counts).map(t => {
            const d = ENEMIES[t];
            const c = d.color.map(v => Math.floor(Math.pow(v, 0.7) * 255)).join(',');
            const big = d.boss || d.miniboss;
            return `<span class="pvfoe${big ? ' pvboss' : ''}" style="--fc: rgb(${c})" title="${d.name}">${FOE_GLYPHS[t] || '?'}${big ? ' ' + d.name : '×' + counts[t]}</span>`;
          }).join('');
          const mut = comp.mutator ? `<span class="pvmut">${comp.mutator.name}</span>` : '';
          pv.innerHTML = `<span class="pvlabel">NEXT</span>${bits}${mut}`;
          pv.classList.add('show');
        }
      } else if (this._pvWave !== -1) {
        this._pvWave = -1;
        pv.classList.remove('show');
      }
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
      <div class="irow dim">${tower.def.attack === 'aura' ? 'support' : 'kills ' + tower.kills + (sim.towerRank(tower) ? ' · rank ' + '✦'.repeat(sim.towerRank(tower)) : '')}${tower.def.status ? ' · inflicts ' + tower.def.status : ''}${tower.attuned ? ' · <span style=\"color:#9eff9e\">attuned +10%</span>' : ''}</div>
      <div class="ibtns">
        ${next ? `<button id="btnUp" ${sim.gold < next.cost ? 'disabled' : ''}>GROW ◈${next.cost}</button>` : '<span class="dim">fully grown</span>'}
        <button id="btnSell">RELEASE ◈${Math.floor(tower.spent * ECON.sellRefund)}</button>
      </div>
      ${(() => { const f = sim.canFuse(tower); return f ? `<div class="ibtns"><button id="btnFuse" ${sim.gold < 300 ? 'disabled' : ''} style="border-color: rgb(190,120,255); box-shadow: 0 0 14px -6px rgb(190,120,255)">⬢ FUSE ◈300 → ${f.apexDef.name}</button></div>` : ''; })()}`;
    el.classList.add('open');
    const up = el.querySelector('#btnUp');
    if (up) up.onclick = () => this.game.upgradeSelected();
    const fu = el.querySelector('#btnFuse');
    if (fu) fu.onclick = () => this.game.fuseSelected();
    el.querySelector('#btnSell').onclick = () => this.game.sellSelected();
  }
}
