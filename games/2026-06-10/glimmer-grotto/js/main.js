// Glimmer Grotto — boot, fixed-step loop, camera, parallax, render pipeline,
// adaptive quality scaler, interactions.

import { TILE, WORLD_W, WORLD_H, SURFACE_Y, REACH, biomeAt, GEM_DEF, TREASURE_DEF, WONDERS,
  T_DIRT, T_GRASS, T_MUSH, TILE_DEF, JELLY } from './config.js';
import { clamp, lerp, mixHex } from './util.js';
import { loadAssets, IMG, tintedLayer } from './assets.js';
import { world, generate, drawChunks, drawDecor, drawWater, spawnPickupsFor,
  glowFor, solidAtPx, waterAtPx, solidAt as solidAtTile } from './world.js';
import { Player } from './player.js';
import { input, initInput, pollInput, consumeInteract, getPointerScreen } from './input.js';
import * as P from './particles.js';
import { updateCritters, drawCritters } from './critters.js';
import { renderLighting, renderBloom, renderGodRays, renderVignette, lighting } from './lighting.js';
import { initAudio, audioReady, toggleMute, isMuted, setPadChord, setFireProximity, sfx } from './audio.js';
import { state, toast, updateHUD, showRestHint, initUI, togglePanel, hideAllPanels, anyPanelOpen, discover } from './ui.js';
import { save, load, applySave, clearSave } from './save.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ------------------------------------------------------------ quality scaler
const TIERS = [
  { dpr: 2.0, light: 0.36, parts: 1.0, lights: 56, bloom: true,  rays: true  },
  { dpr: 1.7, light: 0.30, parts: 0.8, lights: 44, bloom: true,  rays: true  },
  { dpr: 1.4, light: 0.24, parts: 0.55, lights: 30, bloom: false, rays: true  },
  { dpr: 1.0, light: 0.18, parts: 0.32, lights: 18, bloom: false, rays: false },
];
const quality = {
  tier: 1, ema: 16, cooldown: 0, goodTime: 0,
  apply() {
    const t = TIERS[this.tier];
    lighting.scale = t.light;
    lighting.maxLights = t.lights;
    lighting.bloom = t.bloom;
    P.setParticleCap(t.parts);
    sizeCanvas();
  },
  frame(ms) {
    this.ema = this.ema * 0.92 + ms * 0.08;
    this.cooldown -= ms / 1000;
    if (this.cooldown <= 0) {
      if (this.ema > 31 && this.tier < TIERS.length - 1) {
        this.tier++; this.apply(); this.cooldown = 2; this.goodTime = 0;
      } else if (this.ema < 14.5) {
        this.goodTime += ms / 1000;
        if (this.goodTime > 6 && this.tier > 0) {
          this.tier--; this.apply(); this.cooldown = 3; this.goodTime = 0;
        }
      } else this.goodTime = 0;
    }
  },
};

// ------------------------------------------------------------ camera / sizing
const cam = { x: 0, y: 0, zoom: 1 };
let cssW = 0, cssH = 0, dprEff = 1;

function sizeCanvas() {
  cssW = innerWidth; cssH = innerHeight;
  dprEff = Math.min(devicePixelRatio || 1, TIERS[quality.tier].dpr);
  canvas.width = Math.round(cssW * dprEff);
  canvas.height = Math.round(cssH * dprEff);
  cam.zoom = clamp(cssW < 760 ? cssW / 390 : cssW / 720, 0.95, 2.4);
}
addEventListener('resize', sizeCanvas);

const screenToWorld = (sx, sy) => ({ x: cam.x + sx / cam.zoom, y: cam.y + sy / cam.zoom });

// ------------------------------------------------------------ state
let player = null;
let time = 0, acc = 0, last = 0, running = false;
const STEP = 1 / 60;
let curBiomeId = null;
let darkSmooth = 0.12;
let tintSmooth = '#ffb070';
let saveTimer = 0, hudTimer = 0, lastTinkToast = -99, lastBagToast = -99;
let hitstop = 0, wasTired = false, lastTiredToast = -99, wasBuffed = false;
let nearProp = null;
let restNearby = 0;
const lights = [];

// ------------------------------------------------------------ boot
async function boot() {
  const fill = document.getElementById('loadFill');
  await loadAssets(p => { fill.style.width = (p * 100) + '%'; });
  P.bakeDebris();
  generate();
  player = new Player(world.spawn.x, world.spawn.y);
  if (location.search.includes('reset')) clearSave();
  const saved = location.search.includes('reset') ? null : load();
  if (saved) {
    applySave(saved, player);
    generate();             // re-apply modified tiles onto fresh grid
  }
  initInput(canvas, {
    journal: () => togglePanel('journalPanel'),
    mute: doMute,
    escape: hideAllPanels,
  });
  initUI(player, { mute: doMute, buy: () => save(player) });
  sizeCanvas();
  quality.apply();

  const hint = document.getElementById('ctrlHint');
  const touchLikely = matchMedia('(pointer: coarse)').matches;
  hint.innerHTML = touchLikely
    ? 'wander with the <b>joystick</b> · <b>⛏</b> dig · <b>⬆</b> hop · <b>✦</b> rest, stash &amp; shop'
    : '<b>WASD / arrows</b> wander · <b>hold mouse</b> (or <b>X</b>) dig · <b>E</b> rest &amp; shop · <b>J</b> journal · <b>M</b> sound';
  const btn = document.getElementById('beginBtn');
  btn.disabled = false;
  btn.textContent = saved ? 'continue your stroll' : 'begin the descent';
  btn.addEventListener('click', () => {
    initAudio();
    document.getElementById('title').classList.add('fade');
    document.getElementById('hud').classList.remove('hidden');
    if (touchLikely) document.getElementById('touchUI').classList.remove('hidden');
    running = true;
    if (!saved) {     // gentle first-time guidance
      setTimeout(() => toast('Dig down — glimmering veins hide in the earth', 'pickaxe'), 2500);
      setTimeout(() => toast('Campfires refill your energy and stash your finds', 'campfire'), 14000);
      setTimeout(() => toast('Pemberley’s tent sells sturdier picks & brighter lanterns', 'tent'), 30000);
    }
  }, { once: true });

  addEventListener('visibilitychange', () => {
    if (document.hidden && player) save(player);
  });

  last = performance.now();
  requestAnimationFrame(loop);
  // debug handle (also handy for power users)
  window.GG = { player, world, cam, quality, get state() { return state; },
    forceFrames(n = 1) {           // drive the loop manually (testing in hidden windows)
      for (let i = 0; i < n; i++) { last = performance.now() - 16.7; loop(performance.now()); }
    } };
}

function doMute() {
  const m = toggleMute();
  document.getElementById('soundBtn').textContent = m ? '✕' : '♪';
}

// ------------------------------------------------------------ fixed-step loop
function loop(now) {
  requestAnimationFrame(loop);
  const ms = Math.min(100, now - last);
  last = now;
  if (!running) { render(); return; }
  quality.frame(ms);
  let dts = ms / 1000;
  if (hitstop > 0) { hitstop -= dts; dts *= 0.15; }   // brief slow-tick on breaks
  acc += dts;
  let steps = 0;
  while (acc >= STEP && steps < 5) {
    step(STEP);
    acc -= STEP; steps++;
  }
  if (steps === 5) acc = 0;       // drop backlog rather than spiral
  render();
}

// ------------------------------------------------------------ simulation step
function step(dt) {
  time += dt;
  pollInput(screenToWorld);
  const paused = anyPanelOpen();

  if (!paused) {
    player.update(dt, input, time);
    handleEvents();
    updatePickups(dt);
    checkProps();
    updateCritters(dt, cam, cssW / cam.zoom, cssH / cam.zoom, player, time);
    checkLandmarks(dt);
    if (consumeInteract()) interact();
  } else consumeInteract();

  P.updateParticles(dt);
  ambient(dt);

  // camera follow with gentle lookahead
  const lookX = player.face * 46 * clamp(Math.abs(player.vx) / 160, 0.2, 1);
  const tx = player.x + lookX - cssW / cam.zoom / 2;
  const ty = player.y - 46 - cssH / cam.zoom / 2;
  const k = 1 - Math.exp(-dt * 4.2);
  cam.x = clamp(lerp(cam.x, tx, k), 0, WORLD_W * TILE - cssW / cam.zoom);
  cam.y = clamp(lerp(cam.y, ty, k), -260, WORLD_H * TILE - cssH / cam.zoom);

  // biome ambience / discovery
  const ty2 = Math.floor(player.y / TILE);
  const b = biomeAt(Math.max(0, ty2));
  const onSurface = player.y / TILE < world.surf[Math.floor(player.x / TILE)] + 2;
  const effBiome = onSurface ? biomeAt(0) : b;
  if (effBiome.id !== curBiomeId) {
    curBiomeId = effBiome.id;
    if (audioReady()) setPadChord(effBiome.pad);
    if (WONDERS[effBiome.id]) {
      const w = WONDERS[effBiome.id];
      if (discover('wonder_' + effBiome.id, w.name, w.sprite)) sfx.chime(3);
      else toast(effBiome.name, w.sprite);
    } else if (!onSurface && effBiome.id !== 'earth') toast(effBiome.name);
  }
  darkSmooth = lerp(darkSmooth, effBiome.ambient, dt * 1.2);
  tintSmooth = effBiome.tint;

  // campfire crackle proximity
  if (audioReady()) setFireProximity(clamp(1 - restNearby / 240, 0, 1) * (restNearby < 999 ? 1 : 0));

  // glimmer rush: gold sparkle trail + farewell note when it fades
  if (player.buffT > 0) {
    if (Math.random() < dt * 9)
      P.sparkleBurst(player.x + (Math.random() - .5) * 26, player.y - 14 - Math.random() * 26, '#ffd87f', 1);
    wasBuffed = true;
  } else if (wasBuffed) {
    wasBuffed = false;
    toast('The glimmer rush fades — but what a lovely sprint');
  }

  if (player.tired && !wasTired && time - lastTiredToast > 20) {
    lastTiredToast = time;
    toast('You’re weary — a campfire would feel wonderful', 'icon_energy');
  }
  wasTired = player.tired;

  saveTimer += dt;
  if (saveTimer > 8) { saveTimer = 0; save(player); }
  hudTimer += dt;
  if (hudTimer > 0.15) { hudTimer = 0; updateHUD(player); }
}

// ------------------------------------------------------------ player events
function handleEvents() {
  for (const e of player.events) {
    switch (e.type) {
      case 'dig': {
        P.digChips(e.x, e.y, e.res.chip);
        const stone = e.res.type !== T_DIRT && e.res.type !== T_GRASS && e.res.type !== T_MUSH;
        if (audioReady()) (stone ? sfx.digStone : sfx.dig)();
        break;
      }
      case 'break': {
        const def = TILE_DEF[e.res.type];
        P.breakBurst(e.x, e.y, e.res.chip, def ? def.tex[0] : 'tile_stone');
        state.stats.dug++;
        hitstop = 0.045;                          // tiny satisfying pause
        if (audioReady()) sfx.crumble();
        if (e.res.vein) spawnPickupsFor(e.res.vein, e.tx, e.ty);
        break;
      }
      case 'tink':
        P.sparkleBurst(e.x, e.y, '#ffd87f', 3);
        if (audioReady()) sfx.tink();
        if (time - lastTinkToast > 8) {
          lastTinkToast = time;
          toast('Too hard for this pickaxe — Pemberley sells sturdier ones', 'pickaxe');
        }
        break;
      case 'land':
        P.dust(e.x, e.y, e.hard ? 9 : 4);
        if (audioReady() && e.hard) sfx.land();
        break;
      case 'jump': if (audioReady()) sfx.jump(); break;
      case 'splash':
        P.splash(e.x, e.y, e.v);
        if (audioReady()) sfx.splash();
        break;
    }
  }
  player.events.length = 0;
}

// ------------------------------------------------------------ pickups
function updatePickups(dt) {
  const list = world.pickups;
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.t += dt;
    const dx = player.x - p.x, dy = (player.y - 20) - p.y;
    const d = Math.hypot(dx, dy);
    if (p.t > 0.35 && d < 85) {            // magnet
      p.vx += dx / (d || 1) * 900 * dt;
      p.vy += dy / (d || 1) * 900 * dt;
    } else {
      p.vy += 640 * dt;
    }
    p.vx *= (1 - Math.min(1, dt * 1.4));
    let nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
    if (solidAtPx(nx, p.y)) { p.vx *= -0.45; nx = p.x; }
    if (solidAtPx(p.x, ny)) { p.vy *= -0.4; ny = p.y; p.vx *= 0.75; }
    if (waterAtPx(nx, ny)) { p.vy *= (1 - Math.min(1, dt * 3)); p.vx *= (1 - Math.min(1, dt * 2)); }
    p.x = nx; p.y = ny;
    if (p.t > 0.3 && d < 26) {             // collect
      if (p.kind === 'buff') {             // eaten on the spot — never needs bag room
        list.splice(i, 1);
        player.buffT = Math.min(JELLY.maxDuration, player.buffT + JELLY.duration);
        P.sparkleBurst(p.x, p.y, '#ffd87f', 18);
        P.riseIcon(p.x, p.y, IMG['glowcap_jelly']);
        toast('Glimmer Rush! Your pickaxe feels feather-light', 'glowcap_jelly');
        if (discover('jelly', JELLY.name, 'glowcap_jelly')) { if (audioReady()) sfx.chime(4); }
        else if (audioReady()) sfx.buy();
        continue;
      }
      if (player.bag.length >= player.bagCap) {
        if (time - lastBagToast > 6) {
          lastBagToast = time;
          toast('Satchel is full — rest at a campfire to stash your finds', 'icon_bag');
          if (audioReady()) sfx.bagFull();
        }
        continue;
      }
      list.splice(i, 1);
      player.bag.push({ kind: p.kind, id: p.id });
      if (p.kind === 'gem') {
        const g = GEM_DEF[p.id];
        P.sparkleBurst(p.x, p.y, g.glow, 12);
        P.riseIcon(p.x, p.y, IMG['gem_' + p.id]);
        if (discover(p.id, g.name, 'gem_' + p.id)) { if (audioReady()) sfx.chime(g.value); }
        else if (audioReady()) sfx.pop();
      } else {
        const t = TREASURE_DEF[p.id];
        P.sparkleBurst(p.x, p.y, '#ffe8b0', 14);
        P.riseIcon(p.x, p.y, IMG[p.id === 'geode' ? 'geode_open' : t.sprite]);
        if (discover(p.id, t.name, p.id === 'geode' ? 'geode_open' : t.sprite)) { if (audioReady()) sfx.chime(4); }
        else if (audioReady()) sfx.pop();
      }
    }
  }
}

function drawPickups(x0, y0, x1, y1) {
  for (const p of world.pickups) {
    if (p.x < x0 - 40 || p.x > x1 + 40 || p.y < y0 - 40 || p.y > y1 + 40) continue;
    const sprite = p.kind === 'buff' ? 'glowcap_jelly' : (p.kind === 'gem' ? 'gem_' + p.id :
      (p.id === 'geode' ? 'geode_closed' : TREASURE_DEF[p.id].sprite));
    const img = IMG[sprite];
    const s = p.kind === 'gem' ? 20 : 26;
    const bob = Math.sin(time * 4 + p.x * 0.1) * 2;
    ctx.drawImage(img, p.x - s / 2, p.y - s / 2 + bob, s, s * (img.height / img.width));
    if (p.kind === 'gem')
      lights.push({ x: p.x, y: p.y, c: glowFor(p.id), r: 46, flicker: .3, emissive: true });
    if (p.kind === 'buff')
      lights.push({ x: p.x, y: p.y, c: 'gold', r: 60, flicker: .4, emissive: true, pri: 1 });
    if (Math.random() < 0.02) P.sparkleBurst(p.x, p.y + bob, '#fff6c4', 1);
  }
}

// ------------------------------------------------------------ landmarks
let lmTimer = 0;
function checkLandmarks(dt) {
  lmTimer += dt;
  if (lmTimer < 0.4) return;
  lmTimer = 0;
  for (const lm of world.landmarks) {
    const key = 'lm_' + lm.id;
    if (state.journal[key]) continue;
    const dx = player.x - lm.x, dy = player.y - lm.y;
    if (dx * dx + dy * dy < lm.r * lm.r) {
      discover(key, lm.name, lm.sprite);
      if (audioReady()) sfx.chime(5);
      P.sparkleBurst(player.x, player.y - 40, '#ffe8b0', 16);
      setTimeout(() => toast(lm.flavor), 1700);
      save(player);
    }
  }
}

// ------------------------------------------------------------ props / interaction
function checkProps() {
  nearProp = null;
  restNearby = 999;
  let best = 90;
  for (const pr of world.props) {
    const d = Math.hypot(player.x - pr.x, player.y - pr.y);
    if (pr.type === 'campfire') restNearby = Math.min(restNearby, d);
    if (pr.interact && d < best) { best = d; nearProp = pr; }
  }
  player.restGlow = restNearby < 110 ? 1 : 0;
  if (nearProp) {
    const verb = input.usingTouch ? '✦' : 'E';
    showRestHint(nearProp.interact === 'shop'
      ? `${verb} — browse Pemberley's wares`
      : (player.bag.length ? `${verb} — rest & stash ${player.bag.length} find${player.bag.length > 1 ? 's' : ''}` : `${verb} — rest a while`));
  } else showRestHint(null);
}

function interact() {
  if (!nearProp) return;
  if (nearProp.interact === 'shop') {
    togglePanel('shopPanel');
    return;
  }
  // rest: bank bag, warm regen handled by proximity
  let gained = 0;
  for (const item of player.bag)
    gained += (item.kind === 'gem' ? GEM_DEF[item.id] : TREASURE_DEF[item.id]).value;
  player.bag.length = 0;
  if (gained > 0) {
    state.wallet += gained;
    state.stats.banked += gained;
    toast(`+${gained} shards stashed in the cart`, 'gem_amber');
  } else toast('You rest. The fire crackles kindly.', 'campfire');
  if (audioReady()) sfx.rest();
  P.sparkleBurst(player.x, player.y - 30, '#ffd87f', 8);
  save(player);
}

// ------------------------------------------------------------ ambient life
let ambT = 0;
function ambient(dt) {
  ambT += dt;
  if (ambT < 0.1) return;
  ambT = 0;
  const vw = cssW / cam.zoom, vh = cssH / cam.zoom;
  const rx = cam.x + Math.random() * vw, ry = cam.y + Math.random() * vh;
  const b = biomeAt(Math.max(0, Math.floor(ry / TILE)));
  const onSurface = ry / TILE < SURFACE_Y + 3;

  if (onSurface) {
    if (Math.random() < 0.5) P.mote(rx, ry);
    if (Math.random() < 0.1) P.firefly(rx, ry, '#e8f0a0');
  } else if (!solidAtPx(rx, ry)) {
    switch (b.id) {
      case 'earth': if (Math.random() < 0.5) P.mote(rx, ry); break;
      case 'stone': if (Math.random() < 0.3) P.mote(rx, ry); break;
      case 'crystal': if (Math.random() < 0.55) P.firefly(rx, ry, '#c79df0'); break;
      case 'mush': P.firefly(rx, ry, '#74e0d2'); break;
      case 'spring':
        if (waterAtPx(rx, ry) && !waterAtPx(rx, ry - TILE)) P.steam(rx, ry - 6);
        else if (Math.random() < .3) P.mote(rx, ry);
        break;
      case 'ruins': if (Math.random() < 0.5) P.mote(rx, ry); break;
      case 'lake': if (Math.random() < 0.4) P.firefly(rx, ry, '#9fe8ff'); break;
    }
  }
  // steam rises off warm pools (scan visible water surfaces)
  const ty0 = Math.max(0, Math.floor(cam.y / TILE));
  const ty1 = Math.min(559, Math.ceil((cam.y + vh) / TILE));
  for (let tx = Math.max(0, Math.floor(cam.x / TILE)); tx < (cam.x + vw) / TILE; tx += 3) {
    for (let ty = ty0; ty <= ty1; ty++) {
      if (!waterAtPx(tx * TILE + 1, ty * TILE + 1)) continue;
      if (!waterAtPx(tx * TILE + 1, ty * TILE - 31) && !solidAtPx(tx * TILE + 1, ty * TILE - 31)) {
        const bb = biomeAt(ty).id;
        if (bb === 'spring' && Math.random() < 0.12) P.steam((tx + .5) * TILE, ty * TILE + 2);
        else if (bb === 'lake' && Math.random() < 0.03) P.steam((tx + .5) * TILE, ty * TILE + 2);
      }
      break;
    }
  }
  // waterfall mist & froth
  for (const wf of world.waterfalls) {
    if (wf.x < cam.x - 100 || wf.x > cam.x + vw + 100) continue;
    if (Math.random() < 0.55) P.splash(wf.x + (Math.random() - .5) * 8, wf.y1, 46, 2);
    if (Math.random() < 0.3) P.steam(wf.x, wf.y1 - 6);
  }
  // drips from stalactites; campfire smoke
  for (const pr of world.props) {
    if (pr.type !== 'campfire') continue;
    if (Math.abs(pr.x - cam.x - vw / 2) > vw) continue;
    P.smoke(pr.x, pr.y - 22);
    if (Math.random() < 0.5) P.ember(pr.x, pr.y - 14);
  }
  if (Math.random() < 0.4) {
    // find a dripping stalactite in view
    for (const [i, d] of world.decor) {
      if (!d.drip) continue;
      if (d.x < cam.x || d.x > cam.x + vw || d.y < cam.y || d.y > cam.y + vh) continue;
      if (Math.random() < 0.12) { P.drip(d.x, d.y + 20); if (audioReady() && Math.random() < .3) sfx.drip(); }
      break;
    }
  }
}

// ------------------------------------------------------------ parallax
function drawParallax() {
  const sx = ctx.canvas.width / cssW;     // device scale
  ctx.setTransform(sx, 0, 0, sx, 0, 0);
  const surfPx = SURFACE_Y * TILE;
  const depthPx = cam.y + cssH / cam.zoom / 2 - surfPx;
  const skyVis = depthPx < 700;

  // deep base color
  ctx.fillStyle = mixHex('#241a12', '#0c0806', clamp(depthPx / 8000, 0, 1));
  ctx.fillRect(0, 0, cssW, cssH);

  if (skyVis) {
    const sky = IMG['bg_sky'];
    const par = 0.2;
    const yOff = (surfPx - cam.y) * cam.zoom * 0.62 - cssH * 0.78;
    drawLayerTiled(sky, 0.06, par, yOff, 1);
  }
  const b = biomeAt(Math.max(0, Math.floor((cam.y + cssH / cam.zoom / 2) / TILE)));
  if (depthPx > -200) {
    drawLayerTiled(tintedLayer('bg_far', b.tint, 0.85), 0.12, 0.10, -120, clamp(depthPx / 500 + .4, 0, 1));
    drawLayerTiled(tintedLayer('bg_mid', b.tint, 0.7), 0.26, 0.20, -60, clamp(depthPx / 500 + .2, 0, 0.9));
    if (quality.tier < 3)
      drawLayerTiled(tintedLayer('bg_near', b.tint, 0.55), 0.45, 0.36, 0, clamp(depthPx / 600, 0, 0.85));
  }
}

function drawLayerTiled(img, parX, parY, yBase, alpha) {
  if (alpha <= 0.01) return;
  const w = img.width, h = img.height;
  const scale = Math.max(cssW / w, cssH / h * 0.7) * 1.25;
  const dw = w * scale, dh = h * scale;
  let ox = (-cam.x * parX * cam.zoom) % dw;
  if (ox > 0) ox -= dw;
  const oy = yBase - cam.y * parY * cam.zoom * 0.3 + (cssH - dh) * 0.5;
  ctx.globalAlpha = alpha;
  for (let x = ox; x < cssW; x += dw)
    ctx.drawImage(img, x, oy, dw + 1, dh);
  ctx.globalAlpha = 1;
}

// ------------------------------------------------------------ render
function render() {
  if (canvas.width === 0) return;
  ctx.imageSmoothingEnabled = false;       // crisp pixel art (painterly swaps still fine)
  lights.length = 0;

  drawParallax();

  // world transform
  const s = dprEff * cam.zoom;
  ctx.setTransform(s, 0, 0, s, -cam.x * s, -cam.y * s);
  const x0 = cam.x, y0 = cam.y, x1 = cam.x + cssW / cam.zoom, y1 = cam.y + cssH / cam.zoom;

  drawChunks(ctx, x0, y0, x1, y1, lights);
  drawDecor(ctx, x0, y0, x1, y1, time, lights);
  drawCritters(ctx);
  drawWater(ctx, x0, y0, x1, y1, time, lights);

  // waterfalls: soft falling sheets with brighter streaks
  for (const wf of world.waterfalls) {
    if (wf.x < x0 - 60 || wf.x > x1 + 60 || wf.y1 < y0 - 60 || wf.y0 > y1 + 60) continue;
    const grad = ctx.createLinearGradient(0, wf.y0, 0, wf.y1);
    grad.addColorStop(0, 'rgba(205,238,255,.08)');
    grad.addColorStop(1, 'rgba(205,238,255,.32)');
    ctx.fillStyle = grad;
    ctx.fillRect(wf.x - 5, wf.y0, 10, wf.y1 - wf.y0);
    ctx.fillStyle = 'rgba(238,250,255,.38)';
    const span = wf.y1 - wf.y0;
    for (let k = 0; k < 4; k++) {
      const yy = wf.y0 + ((time * 290 + k * span / 4 + wf.x * 7) % span);
      ctx.fillRect(wf.x - 3.5 + (k % 3) * 2.6, yy, 2.4, 13);
    }
    lights.push({ x: wf.x, y: wf.y1, c: 'cyan', r: 75, a: 0.55, flicker: .4, emissive: true });
  }

  drawPickups(x0, y0, x1, y1);

  // desktop aim reticle: faint highlight on the diggable tile under the cursor
  const ps = getPointerScreen();
  if (ps && player && running) {
    const wpt = screenToWorld(ps.x, ps.y);
    const dx = wpt.x - player.x, dy = wpt.y - (player.y - player.h * 0.55);
    if (Math.hypot(dx, dy) <= REACH * 1.05) {
      const tx = Math.floor(wpt.x / TILE), ty = Math.floor(wpt.y / TILE);
      if (solidAtTile(tx, ty)) {
        ctx.save();
        ctx.globalAlpha = 0.22 + Math.sin(time * 5) * 0.06;
        ctx.strokeStyle = '#ffe8b0';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(tx * TILE + 1.5, ty * TILE + 1.5, TILE - 3, TILE - 3);
        ctx.restore();
      }
    }
  }

  if (player) player.draw(ctx, time);
  P.drawParticles(ctx, x0 - 40, y0 - 40, x1 + 40, y1 + 40, time);

  // god rays near surface
  if (TIERS[quality.tier].rays) {
    const depthPx = cam.y + cssH / cam.zoom / 2 - SURFACE_Y * TILE;
    const strength = clamp(1 - depthPx / 1500, 0, 1);
    if (strength > 0) renderGodRays(ctx, cam, cssW, cssH, SURFACE_Y * TILE, time, strength);
  }

  // lights: player lantern + nearby emissives
  if (player) {
    lights.push({ x: player.x + player.face * 8, y: player.y - 26, c: 'warm',
      r: player.lanternRadius, flicker: 0.18, pri: 0 });
    lights.push({ x: player.x, y: player.y - 24, c: 'warm', r: 46, a: 0.5, pri: 0 });
    if (player.buffT > 0)
      lights.push({ x: player.x, y: player.y - 22, c: 'gold', r: 110,
        a: Math.min(1, player.buffT), flicker: .4, pri: 0, emissive: true });
  }
  for (const L of lights) if (L.c !== 'warm' || L.r < 150) L.emissive = L.emissive ?? (L.r < 140);
  renderBloom(ctx, lights, time);
  renderLighting(ctx, cam, cssW, cssH, lights, darkSmooth, tintSmooth, time);
  renderVignette(ctx, cssW, cssH);

  // hearth warmth: soft amber wash that breathes while resting by a fire
  if (player && player.restGlow > 0.5) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.045 + Math.sin(time * 1.8) * 0.02;
    ctx.fillStyle = '#ff9a40';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

boot();
