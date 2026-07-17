// Boot, fixed-step loop, input, camera feel, event→juice routing, the
// ?ns=1 North Star harness and the window.__lumen debug hook (kept in prod).

import { Sim, DT } from './sim.js';
import { Renderer } from './renderer.js';
import { UI } from './ui.js';
import { TOWERS, WORLD_W, WORLD_H, COLORS, MAPS } from './content.js';
import { saveLocal, submitGlobal, cleanInitials } from './scores.js';
import { AudioEngine } from './audio.js';

export const VERSION = 'v1.4.0';

const params = new URLSearchParams(location.search);
const NS_MODE = params.get('ns') === '1';

class Game {
  constructor() {
    this.canvas = document.getElementById('cv');
    this.renderer = new Renderer(this.canvas);
    this.mapIndex = Math.min(MAPS.length - 1, Math.max(0, parseInt(params.get('map') || '1', 10) - 1));
    this.sim = new Sim(this.mapIndex, NS_MODE ? 777 : null);
    this.audio = new AudioEngine(); // before UI — sliders read persisted settings
    this.ui = new UI(document.body, this);
    this.armed = null;          // tower id being placed
    this.selected = null;       // placed tower selected
    this.mouse = { x: 0, y: 0, world: { x: 0, y: 0 } };
    this.running = !NS_MODE;    // ns mode drives manually then resumes
    this.speed = 1;
    this.acc = 0;
    this.last = performance.now();
    this.fx = {
      aberr: 0, shake: 0, shakeX: 0, shakeY: 0, wallTime: 0, camDx: 0,
    };
    this.cam = { dx: 0, dy: 0, zoom: 1.0, shakeX: 0, shakeY: 0 };
    this.frameMs = 16;
    this.started = false;
    // browsers require a gesture before audio — arm on the first of any
    const armAudio = () => this.audio.start();
    window.addEventListener('pointerdown', armAudio, { once: true });
    window.addEventListener('keydown', armAudio, { once: true });
    this.bindInput();
    this.installDebug();
    document.querySelector('#ver').textContent = 'LUMEN ' + VERSION;
    if (NS_MODE) this.stageNorthStar();
    else this.showTitle();
    requestAnimationFrame(t => this.tick(t));
  }

  showTitle() {
    const t = document.getElementById('title');
    t.classList.add('open');
    this.ui.renderBoard();
    document.getElementById('play').onclick = () => {
      t.classList.remove('open');
      this.newRun();
      this.started = true;
      this.ui.banner('THE GROVE WAKES', 'grow your light — the surge is coming');
    };
    // game-over panel buttons (idempotent wiring)
    document.getElementById('goagain').onclick = () => {
      this.ui.hideGameOver();
      this.showTitle();
    };
    document.getElementById('gosubmit').onclick = async () => {
      const init = cleanInitials(document.getElementById('goinit').value);
      const s = this.sim;
      const entry = { initials: init, score: s.score(), wave: s.wave, kills: s.kills, map: MAPS[this.mapIndex].id, mode: s.campaignDone ? 'endless' : 'campaign' };
      saveLocal(entry);
      document.getElementById('gonote').textContent = 'etching…';
      const ok = await submitGlobal(entry);
      document.getElementById('gonote').textContent = ok ? 'your light is etched into the grove ✦' : 'the dark swallowed the signal — saved locally';
      document.getElementById('gosubmit').disabled = true;
    };
  }

  selectMap(i) { this.mapIndex = i; }

  newRun() {
    this.sim = new Sim(this.mapIndex, NS_MODE ? 777 : null);
    this.renderer.pathMesh = null; // forces map mesh rebuild on next frame
    this.renderer.clearStains(); // fresh ground for a fresh story
    this.armed = null; this.selected = null;
    this.ui.showInspect(null);
    this.ui.hideGameOver();
    document.getElementById('gosubmit').disabled = false;
    document.getElementById('goinit').value = '';
    this.submitted = false;
  }

  // --- input ---------------------------------------------------------------
  bindInput() {
    const cv = this.canvas;
    const toWorld = (e) => {
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * WORLD_W;
      const y = (e.clientY - r.top) / r.height * WORLD_H;
      return { x, y };
    };
    cv.addEventListener('mousemove', e => {
      this.mouse.world = toWorld(e);
    });
    cv.addEventListener('click', e => {
      const w = toWorld(e);
      if (this.armed) {
        const t = this.sim.place(this.armed, w.x, w.y);
        if (t) {
          this.juicePlace(t);
          if (!e.shiftKey) this.armed = null;
        } else if (this.sim.gold < TOWERS[this.armed].cost) {
          this.ui.toast('not enough light', 'warn');
        }
        return;
      }
      // select tower
      let best = null, bd = 60 * 60;
      for (const t of this.sim.towers) {
        const dx = t.x - w.x, dy = t.y - w.y, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = t; }
      }
      this.selected = best;
      this.ui.showInspect(best, this.sim);
    });
    cv.addEventListener('contextmenu', e => { e.preventDefault(); this.armed = null; this.selected = null; this.ui.showInspect(null); });
    const towerKeys = Object.keys(TOWERS);
    window.addEventListener('keydown', e => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= towerKeys.length) this.armTower(towerKeys[n - 1]);
      if (e.key === 'Escape') { this.armed = null; this.selected = null; this.ui.showInspect(null); }
      if (e.key === ' ') { e.preventDefault(); this.callSurge(); }
      if (e.key === 'u' && this.selected) this.upgradeSelected();
      if (e.key === 'm' || e.key === 'M') { const m = this.audio.toggleMute(); this.ui.toast(m ? 'the grove falls silent' : 'the grove sings again'); }
    });
    window.addEventListener('resize', () => this.renderer.resize());
  }

  armTower(id) { this.armed = this.armed === id ? null : id; this.selected = null; this.ui.showInspect(null); }
  callSurge() { if (this.sim.startWave(true)) this.ui.banner(`WAVE ${this.sim.wave}`, 'the dark comes flowing'); }
  upgradeSelected() { if (this.selected && this.sim.upgrade(this.selected)) { this.ui.showInspect(this.selected, this.sim); this.juiceUpgrade(this.selected); this.audio.on({ type: 'upgrade' }); } }
  sellSelected() { if (this.selected) { this.sim.sell(this.selected); this.selected = null; this.ui.showInspect(null); this.audio.on({ type: 'sell' }); } }

  // --- juice ----------------------------------------------------------------
  juicePlace(t) { this.fx.shake = Math.min(6, this.fx.shake + 2.5); this.audio.on({ type: 'place' }); }
  juiceUpgrade(t) { this.fx.shake = Math.min(6, this.fx.shake + 2); }

  routeEvents() {
    for (const ev of this.sim.events) {
      if (!NS_MODE) this.audio.on(ev);
      switch (ev.type) {
        case 'waveStart':
          if (!NS_MODE) this.ui.banner(`WAVE ${ev.wave}`, ev.wave % 5 === 0 ? 'something vast stirs' : '');
          break;
        case 'waveClear':
          this.ui.toast(`wave ${ev.wave} cleared · +◈${ev.bonus} bloom · +◈${ev.interest} interest`, 'good');
          break;
        case 'surgeBonus':
          this.ui.toast(`surge called early · +◈${ev.amount}`, 'good');
          break;
        case 'kill':
          this.fx.shake = Math.min(5, this.fx.shake + 0.25);
          // each death soaks a whisper of its colour into the ground
          this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: ev.boss ? 240 : 44, i: ev.boss ? 0.7 : 0.3, color: ev.color || [0.5, 0.9, 0.5] });
          break;
        case 'impact':
          this.fx.shake = Math.min(5, this.fx.shake + 0.4);
          this.fx.aberr = Math.min(0.012, this.fx.aberr + 0.0035);
          if (ev.splash > 0) this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: 52, i: 0.17, color: ev.color });
          break;
        case 'mix':
          this.fx.shake = Math.min(7, this.fx.shake + 1.6);
          this.fx.aberr = Math.min(0.016, this.fx.aberr + 0.006);
          // reactions paint the terrain in the blended hue — the run's story
          this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: 150, i: 0.85, color: ev.color });
          break;
        case 'bossSpawn':
          this.ui.banner(ev.name, ev.boss ? 'the grove holds its breath' : 'something vast crawls out');
          this.fx.shake = Math.min(9, this.fx.shake + 4);
          break;
        case 'bossPulse':
          this.fx.shake = Math.min(11, this.fx.shake + 7);
          this.fx.aberr = Math.min(0.022, this.fx.aberr + 0.014);
          break;
        case 'bossPhase':
          this.ui.banner('IT CRACKS OPEN', 'the light inside is not friendly');
          this.fx.shake = Math.min(10, this.fx.shake + 6);
          break;
        case 'shieldBreak':
          this.fx.shake = Math.min(6, this.fx.shake + 1);
          break;
        case 'discover':
          this.ui.banner(ev.name, ev.desc);
          break;
        case 'heartHit':
          this.fx.shake = Math.min(9, this.fx.shake + 5);
          this.fx.aberr = Math.min(0.02, this.fx.aberr + 0.012);
          this.ui.toast(`the heart dims — ${ev.lives} light left`, 'warn');
          break;
        case 'victory':
          this.ui.banner('THE GROVE ENDURES', 'the endless surge begins — how long can you shine?');
          break;
        case 'gameOver':
          if (NS_MODE) break; // staged shots never show the end panel
          this.ui.banner('THE LIGHT GOES OUT', `the grove survived ${ev.wave - 1} waves`);
          setTimeout(() => this.ui.showGameOver(this.sim, this.sim.campaignDone), 2200);
          break;
      }
    }
  }

  // --- loop ------------------------------------------------------------------
  tick(now) {
    const raw = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.frameMs = this.frameMs * 0.95 + raw * 1000 * 0.05;
    this.fx.wallTime += raw;

    if (this.running && this.started) {
      this.acc += raw * this.speed;
      let steps = 0;
      while (this.acc >= DT && steps < 8) {
        // staged shots: synchronize a tower volley every ~2.5s so bursts
        // catch arcs + beams + shells converging mid-flight
        if (NS_MODE && this.sim.time % 2.5 < DT) {
          let k = 0;
          for (const tw of this.sim.towers) { tw.cool = Math.min(tw.cool, 0.02 + (k++ % 4) * 0.05); }
        }
        this.sim.step();
        this.routeEvents();
        this.acc -= DT; steps++;
      }
    }

    // camera feel: slow drift + breathing, decaying shake
    const t = this.fx.wallTime;
    if (this.nsCam) {
      // staged-shot composition: locked frame with only a faint breath
      this.cam.dx = this.nsCam.dx;
      this.cam.dy = this.nsCam.dy;
      this.cam.zoom = this.nsCam.zoom + Math.sin(t * 0.07) * 0.004;
    } else {
      this.cam.dx = Math.sin(t * 0.11) * 9;
      this.cam.dy = Math.cos(t * 0.09) * 6;
      this.cam.zoom = 1.012 + Math.sin(t * 0.07) * 0.012;
    }
    this.fx.shake = Math.max(0, this.fx.shake - raw * 14);
    this.fx.aberr = Math.max(0, this.fx.aberr - raw * 0.02);
    const sh = this.fx.shake;
    this.cam.shakeX = (Math.random() - 0.5) * sh;
    this.cam.shakeY = (Math.random() - 0.5) * sh;
    this.fx.camDx = this.cam.dx;
    // placement ghost + selection range ring for the renderer
    if (this.armed && this.started && !NS_MODE) {
      const def = TOWERS[this.armed];
      const w = this.mouse.world;
      this.fx.ghost = {
        x: w.x, y: w.y, def,
        valid: this.sim.canPlace(w.x, w.y) && this.sim.gold >= def.cost,
        range: def.levels[0].range,
      };
    } else this.fx.ghost = null;
    if (this.selected && this.sim.towers.includes(this.selected)) {
      const st = this.sim.towerStats(this.selected);
      this.fx.selRing = { x: this.selected.x, y: this.selected.y, range: st.range, color: this.selected.def.color };
    } else this.fx.selRing = null;
    if ((this.renderer.frame & 63) === 0) this.audio.setMood(Math.min(2, Math.max(0, (this.sim.wave - 1) / 19 * 2)));

    this.renderer.render(this.sim, this.cam, this.fx, raw || 0.016);
    this.ui.update(this.sim, this.armed);
    const fpsEl = document.getElementById('fps');
    if (fpsEl && (this.renderer.frame & 31) === 0) fpsEl.textContent = `${Math.round(1000 / Math.max(1, this.frameMs))}`;
    requestAnimationFrame(tt => this.tick(tt));
  }

  // --- North Star harness -----------------------------------------------------
  // ?ns=1 → deterministic staged scene: mid-run wave with 6 towers firing.
  stageNorthStar() {
    const s = this.sim;
    this.started = true;
    s.gold = 100000;
    // a varied grove near the action: per-map anchors, spiral-searched to legal spots
    const ANCHORS = {
      rootdelta: [
        ['coral', 520, 640], ['tesla', 640, 830], ['bloom', 900, 860],
        ['spire', 1090, 760], ['urchin', 1240, 660], ['tesla', 1380, 620],
        ['bramble', 480, 900], ['bulb', 1160, 680],
      ],
      twinveins: [
        ['coral', 640, 560], ['tesla', 900, 620], ['bloom', 1150, 640],
        ['spire', 480, 580], ['urchin', 1350, 700], ['tesla', 1500, 740],
        ['bramble', 1000, 850], ['bulb', 1180, 580],
      ],
      caldera: [
        ['coral', 950, 500], ['tesla', 1200, 700], ['bloom', 600, 600],
        ['spire', 500, 800], ['urchin', 900, 800], ['tesla', 1450, 650],
        ['bramble', 350, 700], ['bulb', 1000, 640],
      ],
    };
    const anchors = ANCHORS[s.map.id] || ANCHORS.rootdelta;
    for (const [type, ax, ay] of anchors) {
      let placed = null;
      outer: for (let r = 0; r <= 220 && !placed; r += 28) {
        for (let a = 0; a < 8; a++) {
          const x = ax + Math.cos(a * 0.785 + r) * r, y = ay + Math.sin(a * 0.785 + r) * r;
          placed = s.place(type, x, y);
          if (placed) break outer;
          if (r === 0) break; // center tried once
        }
      }
      if (placed) placed.level = 2;
      else console.warn('ns: no spot near', ax, ay);
    }
    s.gold = 480;
    // stage a dense mid-flight wave (default 12; ?wave=20 stages the boss),
    // then run so the stream spreads through the tower gauntlet
    const nsWave = parseInt(params.get('wave') || '12', 10);
    s.wave = nsWave - 1;
    s.state = 'prep'; s.prepLeft = 0.01;
    s.step(); // triggers startWave
    const extra = s.spawnQueue.map(q => ({ at: q.at + 0.22, enemyType: q.enemyType, hpMul: q.hpMul * 1.6 }));
    s.spawnQueue.push(...extra);
    // bosses crawl — drive further so they reach mid-frame for the shot
    const driveSecs = nsWave >= 20 ? 46 : 16;
    for (let i = 0; i < 60 * driveSecs; i++) { s.step(); this.routeEvents(); }
    // boss frames need a living swarm around the great one — restock escorts
    if (nsWave >= 20) {
      const boss = s.enemies.find(e => e.def.boss);
      const bs = boss ? boss.s : s.paths[0].total * 0.35;
      const kinds = ['mite', 'dartfin', 'grub', 'wisp', 'husk', 'mite', 'dartfin', 'brood'];
      // spread the swarm along the whole gauntlet so every tower is firing:
      // a dense knot around the boss plus a stream reaching toward the heart
      const total = s.paths[0].total;
      for (let i = 0; i < 30; i++) {
        const type = kinds[i % kinds.length];
        let at;
        if (i < 12) at = bs - 70 - i * 30 + (i % 3) * 16;          // knot behind boss
        else at = bs + 90 + (i - 12) * ((total * 0.92 - bs) / 18); // stream ahead
        s.spawnEnemy(type, 4.0, Math.max(10, Math.min(total * 0.94, at)));
      }
      for (let i = 0; i < 60 * 2; i++) { s.step(); this.routeEvents(); } // towers open fire; stains burn in
    }
    // compose the frame: zoom toward the action (boss if present, else the
    // busiest cluster of creatures), clamped so world edges stay off-screen
    {
      const boss = s.enemies.find(e => e.def.boss || e.def.miniboss);
      if (boss && boss.def.boss && boss.hp > boss.maxHp * 0.48) {
        boss.hp = boss.maxHp * 0.48; // stage phase 2 — the cracked-open state is the shot
        for (let i = 0; i < 30; i++) { s.step(); this.routeEvents(); }
      }
      let fx, fy;
      if (boss) {
        // frame boss AND heart together when both can fit
        const [hx2, hy2] = s.map.heart;
        fx = boss.x + (hx2 - boss.x) * 0.38;
        fy = boss.y + (hy2 - boss.y) * 0.38;
      }
      else if (s.enemies.length) {
        fx = s.enemies.reduce((a, e) => a + e.x, 0) / s.enemies.length;
        fy = s.enemies.reduce((a, e) => a + e.y, 0) / s.enemies.length;
      } else { fx = WORLD_W / 2; fy = WORLD_H / 2; }
      const zoom = 1.17;
      const mx = (WORLD_W - WORLD_W / zoom) / 2 - 4;
      const my = (WORLD_H - WORLD_H / zoom) / 2 - 4;
      this.nsCam = {
        dx: Math.max(-mx, Math.min(mx, (fx - WORLD_W / 2) * 0.45)),
        dy: Math.max(-my, Math.min(my, (fy - WORLD_H / 2) * 0.45)),
        zoom,
      };
    }
    this.running = true;
    window.__lumen.nsReady = true;
  }

  installDebug() {
    const g = this;
    window.__lumen = {
      version: VERSION,
      nsReady: false,
      get sim() { return g.sim; },
      stats() {
        return {
          version: VERSION, wave: g.sim.wave, gold: g.sim.gold, lives: g.sim.lives,
          enemies: g.sim.enemies.length, towers: g.sim.towers.length,
          projectiles: g.sim.projectiles.length, particles: g.sim.particles.length,
          state: g.sim.state, frameMs: +g.frameMs.toFixed(2),
          canvas: [g.canvas.width, g.canvas.height],
        };
      },
      drive(secs) { const n = Math.floor(secs / DT); for (let i = 0; i < n; i++) { g.sim.step(); g.routeEvents(); } },
      render() { g.renderer.render(g.sim, g.cam, g.fx, 0.016); },
      place(type, x, y) { return g.sim.place(type, x, y); },
      gold(n) { g.sim.gold = n; },
      startWave() { return g.sim.startWave(true); },
      start() { g.started = true; document.getElementById('title').classList.remove('open'); },
      audioState() { return g.audio.state(); },
      pixelStats() {
        const gl = g.renderer.gl;
        const w = 64, h = 36;
        const px = new Uint8Array(w * h * 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
        let lum = 0, maxL = 0, nonBlack = 0;
        for (let i = 0; i < w * h; i++) {
          const l = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
          lum += l; if (l > maxL) maxL = l; if (l > 0.02) nonBlack++;
        }
        return { avgLum: +(lum / (w * h)).toFixed(3), maxLum: +maxL.toFixed(3), nonBlackFrac: +(nonBlack / (w * h)).toFixed(3) };
      },
    };
  }
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    new Game();
  } catch (e) {
    document.getElementById('glfail').style.display = 'grid';
    console.error(e);
  }
});
