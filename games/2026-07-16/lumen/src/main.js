// Boot, fixed-step loop, input, camera feel, event→juice routing, the
// ?ns=1 North Star harness and the window.__lumen debug hook (kept in prod).

import { Sim, DT } from './sim.js';
import { Renderer } from './renderer.js';
import { UI } from './ui.js';
import { TOWERS, WORLD_W, WORLD_H, COLORS, MAPS } from './content.js';
import { saveLocal, submitGlobal, cleanInitials, dailyInfo } from './scores.js';
import { AudioEngine } from './audio.js';
import { botStep } from './bot.js';
import { journal } from './journal.js';
import { MIXES } from './content.js';

export const VERSION = 'v3.11.0';

const COARSE = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;

const params = new URLSearchParams(location.search);
const NS_MODE = params.get('ns') === '1';
if (NS_MODE) window.__lumenNS = true;

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
    // adaptive quality: drop tiers on sustained slow frames, climb back shyly
    this.qSlow = 0; this.qFast = 0; this.qRaises = 0;
    // vestibular safety: honour prefers-reduced-motion, live
    this.reduceMotion = false;
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reduceMotion = mq.matches;
      mq.addEventListener('change', e => { this.reduceMotion = e.matches; });
    } catch { }
    // browsers require a gesture before audio — arm on the first of any
    const armAudio = () => this.audio.start();
    window.addEventListener('pointerdown', armAudio, { once: true });
    window.addEventListener('keydown', armAudio, { once: true });
    if (COARSE) { document.body.classList.add('coarse'); this.renderer.setQuality(2); } // phones start mid-tier; auto may climb
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
    this.ui.renderJournal();
    this.ui.buildMapPicker(); // refresh best-wave lines
    this.startAttract();
    document.getElementById('play').onclick = () => {
      t.classList.remove('open');
      this.attract = false;
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
      const entry = { initials: init, score: s.score(), wave: s.wave, kills: s.kills, map: MAPS[this.mapIndex].id, mode: this.daily ? 'daily' : (s.campaignDone ? 'endless' : 'campaign'), board: this.daily ? dailyInfo().board : undefined };
      saveLocal(entry);
      document.getElementById('gonote').textContent = 'etching…';
      const ok = await submitGlobal(entry);
      document.getElementById('gonote').textContent = ok ? 'your light is etched into the grove ✦' : 'the dark swallowed the signal — saved locally';
      document.getElementById('gosubmit').disabled = true;
    };
  }

  selectMap(i) { this.mapIndex = i; this.daily = false; }

  selectDaily() { this.daily = true; }

  // the grove defends itself behind the title — arcade attract tradition
  startAttract() {
    this.attract = true;
    this.attractMap = ((this.attractMap ?? Math.floor(this.fx.wallTime)) + 1) % MAPS.length;
    this.sim = new Sim(this.attractMap, 4242 + this.attractMap);
    this.sim.gold = 380; // a slightly flush start so the demo builds fast
    this.renderer.pathMesh = null;
    this.renderer.clearStains();
    this.attractBotT = 0;
  }

  newRun() {
    if (this.daily) { const d = dailyInfo(); this.mapIndex = d.mapIndex; this.sim = new Sim(d.mapIndex, d.seed); }
    else this.sim = new Sim(this.mapIndex, NS_MODE ? 777 : null);
    this.renderer.pathMesh = null; // forces map mesh rebuild on next frame
    this.renderer.clearStains(); // fresh ground for a fresh story
    this.armed = null; this.selected = null;
    this.paused = false; this.speed = 1;
    const bp = document.getElementById('btnPause'); if (bp) { bp.textContent = '⏸'; bp.classList.remove('active'); }
    const bs = document.getElementById('btnSpeed'); if (bs) { bs.textContent = '×1'; bs.classList.remove('active'); }
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
    cv.addEventListener('pointerdown', e => {
      this.lastPointerType = e.pointerType;
      if (this.photo) { this.dragFrom = { x: e.clientX, y: e.clientY }; }
    }, { capture: true });
    cv.addEventListener('pointermove', e => {
      if (this.photo && this.dragFrom && e.buttons) {
        const r = cv.getBoundingClientRect();
        const k = WORLD_W / r.width / (this.photoCam ? this.photoCam.zoom : 1);
        this.photoCam.dx -= (e.clientX - this.dragFrom.x) * k;
        this.photoCam.dy -= (e.clientY - this.dragFrom.y) * k;
        this.dragFrom = { x: e.clientX, y: e.clientY };
      }
    });
    cv.addEventListener('pointerup', () => { this.dragFrom = null; });
    cv.addEventListener('wheel', e => {
      if (!this.photo || !this.photoCam) return;
      e.preventDefault();
      this.photoCam.zoom = Math.max(1.0, Math.min(1.8, this.photoCam.zoom * (e.deltaY > 0 ? 0.94 : 1.06)));
    }, { passive: false });
    const cancelBtn = document.getElementById('tapCancel');
    cancelBtn.addEventListener('click', () => {
      this.armed = null; this.pendingSpot = null;
      cancelBtn.classList.remove('show');
    });
    cv.addEventListener('click', e => {
      const w = toWorld(e);
      if (this.armed) {
        // touch flow: first tap aims (ghost + range), second tap nearby grows
        if (this.lastPointerType === 'touch') {
          const p = this.pendingSpot;
          if (!p || Math.hypot(p.x - w.x, p.y - w.y) > 70) {
            this.pendingSpot = { x: w.x, y: w.y };
            document.getElementById('tapCancel').classList.add('show');
            return;
          }
          const t = this.sim.place(this.armed, p.x, p.y);
          if (t) {
            this.juicePlace(t);
            this.armed = null; this.pendingSpot = null;
            document.getElementById('tapCancel').classList.remove('show');
          } else if (this.sim.gold < TOWERS[this.armed].cost) {
            this.ui.toast('not enough light', 'warn');
          } else {
            this.ui.toast('the ground refuses this spot', 'warn');
          }
          return;
        }
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
      if (e.key === 'p' || e.key === 'P') this.togglePause();
      if (e.key === 'c' || e.key === 'C') this.togglePhoto();
      if (e.key === 'f' || e.key === 'F') this.cycleSpeed();
    });
    // publish the truly-visible viewport height (mobile URL bars shrink it
    // without 100vh noticing) and re-fit the frame whenever it changes
    const fitViewport = () => {
      const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
      document.documentElement.style.setProperty('--vph', h + 'px');
      this.renderer.resize();
    };
    fitViewport();
    window.addEventListener('resize', fitViewport);
    window.addEventListener('orientationchange', () => setTimeout(fitViewport, 120));
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fitViewport);
  }

  togglePhoto() {
    if (!this.started) return;
    this.photo = !this.photo;
    document.body.classList.toggle('photo', this.photo);
    if (this.photo) {
      this.photoCam = { dx: this.cam.dx, dy: this.cam.dy, zoom: Math.max(1.1, this.cam.zoom) };
      this.ui.toast('photo mode — drag to pan · scroll to zoom · C to exit');
    }
  }

  togglePause() {
    if (!this.started) return;
    this.paused = !this.paused;
    document.getElementById('btnPause').textContent = this.paused ? '▶' : '⏸';
    document.getElementById('btnPause').classList.toggle('active', this.paused);
    this.ui.toast(this.paused ? 'the grove holds still' : 'the water moves again');
  }

  cycleSpeed() {
    if (!this.started) return;
    this.speed = this.speed >= 4 ? 1 : this.speed * 2;
    document.getElementById('btnSpeed').textContent = '×' + this.speed;
    document.getElementById('btnSpeed').classList.toggle('active', this.speed > 1);
  }

  armTower(id) {
    this.armed = this.armed === id ? null : id;
    this.selected = null; this.pendingSpot = null;
    this.ui.showInspect(null);
    const chip = document.getElementById('tapCancel');
    if (this.armed && COARSE) { chip.classList.add('show'); this.ui.toast('tap to aim · tap again to grow'); }
    else chip.classList.remove('show');
  }
  callSurge() { if (this.sim.startWave(true)) this.ui.banner(`WAVE ${this.sim.wave}`, 'the dark comes flowing'); }
  upgradeSelected() { if (this.selected && this.sim.upgrade(this.selected)) { this.ui.showInspect(this.selected, this.sim); this.juiceUpgrade(this.selected); this.audio.on({ type: 'upgrade' }); } }
  fuseSelected() {
    if (!this.selected) return;
    const apex = this.sim.fuse(this.selected);
    if (apex) {
      this.selected = apex;
      this.ui.showInspect(apex, this.sim);
      this.fx.shake = 10; this.fx.aberr = 0.02;
    }
  }

  sellSelected() { if (this.selected) { this.sim.sell(this.selected); this.selected = null; this.ui.showInspect(null); this.audio.on({ type: 'sell' }); } }

  // --- juice ----------------------------------------------------------------
  juicePlace(t) { this.fx.shake = Math.min(6, this.fx.shake + 2.5); this.audio.on({ type: 'place' }); }
  juiceUpgrade(t) { this.fx.shake = Math.min(6, this.fx.shake + 2); }

  routeEvents(quiet = false) {
    for (const ev of this.sim.events) {
      if (!NS_MODE && !quiet) this.audio.on(ev);
      if (quiet) { // attract: only the visual ground-story reacts
        if (ev.type === 'kill') this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: ev.boss ? 240 : 44, i: ev.boss ? 0.7 : 0.3, color: ev.color || [0.5, 0.9, 0.5] });
        if (ev.type === 'mix') this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: 120, i: 0.5, color: ev.color });
        continue;
      }
      switch (ev.type) {
        case 'waveStart':
          if (!NS_MODE) {
            if (ev.mutator) this.ui.banner(ev.mutator.name, `wave ${ev.wave} — ${ev.mutator.desc}`);
            else this.ui.banner(`WAVE ${ev.wave}`, ev.wave % 5 === 0 ? 'something vast stirs' : '');
          }
          break;
        case 'waveClear':
          this.ui.toast(`wave ${ev.wave} cleared · +◈${ev.bonus} bloom · +◈${ev.interest} interest`, 'good');
          break;
        case 'surgeBonus':
          this.ui.toast(`surge called early · +◈${ev.amount}`, 'good');
          break;
        case 'kill':
          this.fx.shake = Math.min(5, this.fx.shake + 0.25);
          if (ev.boss) { this.fx.shake = 12; this.fx.aberr = 0.024; }
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
          this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: 120, i: 0.5, color: ev.color });
          break;
        case 'bossSpawn':
          this.ui.banner(ev.name, ev.boss ? 'the grove holds its breath' : 'something vast crawls out');
          this.fx.shake = Math.min(9, this.fx.shake + 4);
          break;
        case 'fuse':
          this.ui.banner(ev.name, 'apex — the grove exceeds itself');
          this.renderer.stampQueue.push({ x: ev.x, y: ev.y, r: 220, i: 0.9, color: ev.color });
          this.renderer.fusePillars.push({ x: ev.x, y: ev.y, t: 0, color: ev.color });
          this.audio.on(ev);
          break;
        case 'bossSplit':
          this.ui.toast('it divides — burn the pieces', 'warn');
          this.fx.shake = Math.min(9, this.fx.shake + 4);
          this.fx.aberr = Math.min(0.018, this.fx.aberr + 0.008);
          break;
        case 'bossSummon':
          this.fx.shake = Math.min(8, this.fx.shake + 3.5);
          break;
        case 'tideSwell':
          this.ui.toast('the tide swells — its shell returns', 'warn');
          this.fx.shake = Math.min(7, this.fx.shake + 2.5);
          break;
        case 'bossPulse':
          this.fx.shake = Math.min(11, this.fx.shake + 7);
          this.fx.aberr = Math.min(0.022, this.fx.aberr + 0.014);
          break;
        case 'bossPhase':
          this.ui.banner('IT CRACKS OPEN', 'the light inside is not friendly');
          this.fx.shake = Math.min(10, this.fx.shake + 6);
          break;
        case 'rank':
          this.ui.toast(`${ev.name} grows wiser · rank ${'✦'.repeat(ev.rank)}`, 'good');
          this.audio.on({ type: 'upgrade' });
          break;
        case 'shieldBreak':
          this.fx.shake = Math.min(6, this.fx.shake + 1);
          break;
        case 'discover':
          this.ui.banner(ev.name, ev.desc);
          journal.addMix(ev.mix);
          break;
        case 'heartHit':
          this.fx.shake = Math.min(9, this.fx.shake + 5);
          this.fx.aberr = Math.min(0.02, this.fx.aberr + 0.012);
          this.ui.toast(`the heart dims — ${ev.lives} light left`, 'warn');
          break;
        case 'victory':
          this.ui.banner('THE GROVE ENDURES', 'the endless surge begins — how long can you shine?');
          journal.recordRun(MAPS[this.mapIndex].id, this.sim.wave, this.sim.score(), true);
          break;
        case 'gameOver':
          if (NS_MODE) break; // staged shots never show the end panel
          journal.recordRun(MAPS[this.mapIndex].id, this.sim.wave, this.sim.score(), this.sim.campaignDone);
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

    if (this.attract && !this.started) {
      this.acc += raw;
      let steps = 0;
      while (this.acc >= DT && steps < 4) {
        this.sim.step();
        this.routeEvents(true); // quiet: stains + shake only
        this.acc -= DT; steps++;
      }
      this.attractBotT += raw;
      if (this.attractBotT > 0.7) { this.attractBotT = 0; botStep(this.sim); if (this.sim.state === 'prep' && this.sim.prepLeft > 3) this.sim.startWave(true); }
      if (this.sim.state === 'over' || this.sim.wave > 22) this.startAttract();
    }
    if (this.running && this.started && !this.paused) {
      this.acc += raw * this.speed;
      let steps = 0;
      while (this.acc >= DT && steps < 8) {
        // staged shots: organic fire reads closer to the mock than forced
        // synchronized volleys (which stacked flashes into one white zone)
        this.sim.step();
        this.routeEvents();
        this.acc -= DT; steps++;
      }
    }

    // camera feel: slow drift + breathing, decaying shake
    const t = this.fx.wallTime;
    if (this.photo && this.photoCam) {
      const pc = this.photoCam;
      const mx = Math.max(0, (WORLD_W - WORLD_W / pc.zoom) / 2 - 4);
      const my = Math.max(0, (WORLD_H - WORLD_H / pc.zoom) / 2 - 4);
      pc.dx = Math.max(-mx, Math.min(mx, pc.dx));
      pc.dy = Math.max(-my, Math.min(my, pc.dy));
      this.cam.dx = pc.dx; this.cam.dy = pc.dy; this.cam.zoom = pc.zoom;
    } else if (this.nsCam) {
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
    if (this.reduceMotion) { this.fx.shake = 0; this.fx.aberr = 0; this.cam.dx = 0; this.cam.dy = 0; this.cam.zoom = 1.0; }
    // quality controller (pinned to full for staged shots)
    if (!NS_MODE) {
      const pref = this.audio.settings.quality || 'auto';
      if (pref !== 'auto') {
        const want = pref === 'high' ? 3 : pref === 'med' ? 2 : 1;
        this.renderer.setQuality(want);
      } else {
        // time-based so slow machines react in seconds, not frame counts
        if (this.frameMs > 22) { this.qSlow += raw; this.qFast = 0; } else if (this.frameMs < 12) { this.qFast += raw; this.qSlow = 0; } else { this.qSlow = 0; this.qFast = 0; }
        if (this.qSlow > 3 && this.renderer.quality > 1) { this.renderer.setQuality(this.renderer.quality - 1); this.qSlow = -3; /* grace while EMA settles */ }
        else if (this.qFast > 25 && this.renderer.quality < 3 && this.qRaises < 3) { this.renderer.setQuality(this.renderer.quality + 1); this.qFast = 0; this.qRaises++; }
      }
    }
    const sh = this.fx.shake;
    this.cam.shakeX = (Math.random() - 0.5) * sh;
    this.cam.shakeY = (Math.random() - 0.5) * sh;
    this.fx.camDx = this.cam.dx;
    // placement ghost + selection range ring for the renderer
    if (this.armed && this.started && !NS_MODE) {
      const def = TOWERS[this.armed];
      const w = this.pendingSpot || this.mouse.world;
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
    if ((this.renderer.frame & 63) === 0) {
      this.audio.setMood(Math.min(2, Math.max(0, (this.sim.wave - 1) / 19 * 2)));
      const boss = this.sim.enemies.some(en => en.def.boss);
      this.audio.setThreat(Math.min(0.65, this.sim.enemies.length / 30) + (boss ? 0.35 : 0));
    }

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
      twinveins: [ // mock density: a grove in every neighbourhood (~18 in frame)
        ['coral', 430, 300], ['tesla', 880, 260], ['bloom', 1420, 300],
        ['spire', 330, 700], ['urchin', 900, 560], ['tesla', 1520, 560],
        ['bramble', 620, 880], ['bulb', 1240, 860], ['bloom', 240, 460],
        ['urchin', 650, 480], ['coral', 1130, 420], ['bramble', 1680, 380],
        ['spire', 470, 620], ['bloom', 1050, 720], ['tesla', 780, 820],
        ['bulb', 1440, 740], ['coral', 1660, 820], ['urchin', 260, 840],
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
    s.lives = 99; // staged shots must never end mid-capture
    // stage a dense mid-flight wave (default 12; ?wave=20 stages the boss),
    // then run so the stream spreads through the tower gauntlet
    const nsWave = parseInt(params.get('wave') || '12', 10);
    s.wave = nsWave - 1;
    s.state = 'prep'; s.prepLeft = 0.01;
    s.step(); // triggers startWave
    const extra = s.spawnQueue.map(q => ({ at: q.at + 0.22, enemyType: q.enemyType, hpMul: q.hpMul * 1.6 }));
    s.spawnQueue.push(...extra);
    // the mock's columns are blue-violet beetles — pale ghosts stay in real play
    const RECAST = { wisp: 'husk', spectre: 'mite', regen: 'shellback' };
    for (const q of s.spawnQueue) q.enemyType = RECAST[q.enemyType] || q.enemyType;
    // bosses crawl — drive further so they reach mid-frame for the shot
    const driveSecs = nsWave >= 20 ? 46 : 16;
    for (let i = 0; i < 60 * driveSecs; i++) { s.step(); this.routeEvents(); }
    if (nsWave < 20) {
      // single-file columns on every loop, like the mock
      const kinds = ['husk', 'mite', 'shellback', 'dartfin', 'husk', 'grub', 'mite', 'bulwark'];
      const total = s.paths[0].total;
      for (let i = 0; i < 26; i++)
        s.spawnEnemy(kinds[i % kinds.length], 3.0, Math.max(10, Math.min(total * 0.94, total * 0.06 + i * (total * 0.88 / 26))));
      for (let i = 0; i < 60 * 2; i++) { s.step(); this.routeEvents(); }
    }
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
      // reference framing: the mock shows the ENTIRE board edge-to-edge
      this.nsCam = { dx: 0, dy: 0, zoom: 1.0 };
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
      start() { g.attract = false; g.newRun(); g.started = true; document.getElementById('title').classList.remove('open'); },
      audioState() { return g.audio.state(); },
      quality() { return g.renderer.quality; },
      uiState() { return { armed: g.armed, pending: g.pendingSpot || null, lastPtr: g.lastPointerType || null, started: g.started }; },
      qState() { return { qSlow: g.qSlow, qFast: g.qFast, frameMs: +g.frameMs.toFixed(1), q: g.renderer.quality, pref: g.audio.settings.quality || 'auto' }; },
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
