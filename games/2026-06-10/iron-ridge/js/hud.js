// DOM HUD: health, ready-rack, score/wave, banners, hitmarkers, damage
// vignette, off-screen enemy arrows, leaderboard rendering, screens.

import * as THREE from 'three';
import { SHELL } from './config.js';

const $ = (id) => document.getElementById(id);
const _v = new THREE.Vector3();

export class Hud {
  constructor() {
    this.el = {
      hud: $('hud'),
      hp: $('hp-fill'),
      hpText: $('hp-text'),
      rack: $('rack'),
      chamber: $('chamber-fill'),
      reloadLabel: $('reload-label'),
      score: $('score'),
      wave: $('wave'),
      kills: $('kills'),
      combo: $('combo'),
      banner: $('banner'),
      bannerSub: $('banner-sub'),
      bannerWrap: $('banner-wrap'),
      vignette: $('vignette'),
      hitmarker: $('hitmarker'),
      arrows: $('arrows'),
      floaters: $('floaters'),
      fps: $('fps'),
      quality: $('quality'),
      reticle: $('reticle'),
    };
    this.bannerT = 0;
    this.shells = [];
    for (let i = 0; i < SHELL.rackSize; i++) {
      const d = document.createElement('div');
      d.className = 'shell';
      this.el.rack.appendChild(d);
      this.shells.push(d);
    }
    this.arrowPool = [];
    for (let i = 0; i < 6; i++) {
      const a = document.createElement('div');
      a.className = 'enemy-arrow';
      a.textContent = '▲';
      a.style.display = 'none';
      this.el.arrows.appendChild(a);
      this.arrowPool.push(a);
    }
  }

  showScreen(name) {
    for (const id of ['screen-menu', 'screen-over', 'screen-pause']) {
      $(id).classList.toggle('hidden', id !== name);
    }
    $('overlay').classList.toggle('hidden', !name);
    this.el.hud.classList.toggle('hidden', !!name && name !== '');
  }

  setHp(hp, max) {
    const f = Math.max(0, hp / max);
    this.el.hp.style.width = `${f * 100}%`;
    this.el.hp.style.background = f > 0.5 ? '#7fd24f' : f > 0.25 ? '#e8c84a' : '#e0563c';
    this.el.hpText.textContent = `${Math.ceil(hp)}`;
  }

  setGun(rack, chamber, restocking, restockFrac) {
    for (let i = 0; i < this.shells.length; i++) {
      this.shells[i].classList.toggle('spent', i >= rack);
    }
    if (restocking) {
      this.el.chamber.style.width = `${restockFrac * 100}%`;
      this.el.reloadLabel.textContent = 'RESTOCKING';
      this.el.reloadLabel.style.opacity = 1;
    } else {
      this.el.chamber.style.width = `${chamber * 100}%`;
      this.el.reloadLabel.textContent = chamber < 1 ? 'LOADING' : 'READY';
      this.el.reloadLabel.style.opacity = chamber < 1 ? 1 : 0.45;
    }
    this.el.reticle.classList.toggle('ready', !restocking && chamber >= 1);
  }

  setScore(score, wave, kills, combo) {
    this.el.score.textContent = score.toLocaleString();
    this.el.wave.textContent = wave;
    this.el.kills.textContent = kills;
    if (combo > 1) {
      this.el.combo.textContent = `×${combo.toFixed(1)} COMBO`;
      this.el.combo.style.opacity = 1;
    } else {
      this.el.combo.style.opacity = 0;
    }
  }

  banner(main, sub = '', dur = 2.6) {
    this.el.banner.textContent = main;
    this.el.bannerSub.textContent = sub;
    this.el.bannerWrap.classList.remove('hidden');
    this.el.bannerWrap.style.animation = 'none';
    void this.el.bannerWrap.offsetWidth; // restart animation
    this.el.bannerWrap.style.animation = `bannerIn ${dur}s ease forwards`;
  }

  hitmarker(kill = false) {
    const h = this.el.hitmarker;
    h.classList.toggle('kill', kill);
    h.style.animation = 'none';
    void h.offsetWidth;
    h.style.animation = 'hitPop 0.3s ease forwards';
  }

  damageFlash() {
    const v = this.el.vignette;
    v.style.animation = 'none';
    void v.offsetWidth;
    v.style.animation = 'dmgFlash 0.55s ease forwards';
  }

  floater(text, kind = '') {
    const f = document.createElement('div');
    f.className = `floater ${kind}`;
    f.textContent = text;
    f.style.left = `${50 + (Math.random() * 14 - 7)}%`;
    this.el.floaters.appendChild(f);
    setTimeout(() => f.remove(), 1300);
  }

  updateArrows(enemies, camera) {
    let i = 0;
    for (const e of enemies) {
      if (i >= this.arrowPool.length) break;
      _v.copy(e.tank.visual.root.position);
      _v.y += 1.5;
      _v.project(camera);
      const behind = _v.z > 1;
      const onScreen = !behind && Math.abs(_v.x) < 0.92 && Math.abs(_v.y) < 0.9;
      const a = this.arrowPool[i++];
      if (onScreen) { a.style.display = 'none'; continue; }
      let x = _v.x, y = _v.y;
      if (behind) { x = -x; y = -1; }
      x = Math.max(-0.92, Math.min(0.92, x));
      y = Math.max(-0.88, Math.min(0.88, y));
      const px = (x * 0.5 + 0.5) * window.innerWidth;
      const py = (-y * 0.5 + 0.5) * window.innerHeight;
      const ang = Math.atan2(px - window.innerWidth / 2, -(py - window.innerHeight / 2));
      a.style.display = 'block';
      a.style.left = `${px}px`;
      a.style.top = `${py}px`;
      a.style.transform = `translate(-50%,-50%) rotate(${ang}rad)`;
    }
    for (; i < this.arrowPool.length; i++) this.arrowPool[i].style.display = 'none';
  }

  setPerf(fps, qualityName) {
    this.el.fps.textContent = `${Math.round(fps)} fps`;
    this.el.quality.textContent = qualityName;
  }

  renderBoard(listEl, rows, youName, youScore) {
    if (rows === null) {
      listEl.innerHTML = '<div class="lb-empty">🌐 Offline — global board unavailable.</div>';
      return;
    }
    if (!rows.length) {
      listEl.innerHTML = '<div class="lb-empty">No scores yet — be the first!</div>';
      return;
    }
    listEl.innerHTML = rows.slice(0, 10).map((r, i) => {
      const me = youName && r.name === youName && r.score === youScore;
      return `<div class="lb-row${me ? ' me' : ''}">
        <span class="lb-rank">${i + 1}</span>
        <span class="lb-name">${String(r.name).slice(0, 3)}</span>
        <span class="lb-score">${(r.score | 0).toLocaleString()}</span>
      </div>`;
    }).join('');
  }
}
