// Pooled particle system + cosmetic debris rocks. Caps adapt to quality tier.

import { TILE } from './config.js';
import { solidAtPx, waterAtPx } from './world.js';
import { IMG } from './assets.js';
import { mulberry32 } from './util.js';

const MAX_POOL = 900;
const pool = [];
let head = 0;
export let capScale = 1;       // set by quality scaler (0..1)
export function setParticleCap(s) { capScale = s; }

let alive = 0;
function emit(p) {
  if (alive >= MAX_POOL * capScale) return;
  for (let n = 0; n < MAX_POOL; n++) {
    head = (head + 1) % MAX_POOL;
    if (!pool[head] || pool[head].dead) {
      pool[head] = { dead: false, ...p };
      alive++;
      return;
    }
  }
}

// pebble sprites baked from tile textures (so debris matches terrain art)
const pebbles = [];
export function bakeDebris() {
  const rnd = mulberry32(77);
  for (const tex of ['tile_dirt', 'tile_stone', 'tile_crystal', 'tile_mushroom', 'tile_ruins', 'tile_spring']) {
    for (let k = 0; k < 2; k++) {
      const s = 7 + Math.floor(rnd() * 4);
      const c = document.createElement('canvas'); c.width = c.height = s;
      const x = c.getContext('2d');
      x.beginPath();
      x.ellipse(s / 2, s / 2, s / 2 - .5, s / 2 - 1.2, rnd() * 3, 0, Math.PI * 2);
      x.clip();
      const src = IMG[tex];
      x.drawImage(src, rnd() * (src.width - 40), rnd() * (src.height - 40), 40, 40, 0, 0, s, s);
      x.fillStyle = 'rgba(255,240,200,.35)'; x.fillRect(0, 0, s, 1.5);
      x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(0, s - 1.5, s, 1.5);
      pebbles.push({ c, tex });
    }
  }
}
function pebbleFor(tex) {
  const opts = pebbles.filter(p => p.tex === tex);
  return (opts.length ? opts : pebbles)[(Math.random() * (opts.length || pebbles.length)) | 0].c;
}

// ----------------------------------------------------------- spawners
export function digChips(x, y, color, n = 7) {
  for (let i = 0; i < n; i++)
    emit({ type: 'chip', x: x + (Math.random() - .5) * 18, y: y + (Math.random() - .5) * 18,
      vx: (Math.random() - .5) * 190, vy: -60 - Math.random() * 140,
      life: .5 + Math.random() * .45, t: 0, size: 1.5 + Math.random() * 2.5, color, grav: 760, collide: true });
}
export function breakBurst(x, y, color, tex, n = 12) {
  digChips(x, y, color, n);
  for (let i = 0; i < 3; i++)
    emit({ type: 'rock', x, y, img: pebbleFor(tex),
      vx: (Math.random() - .5) * 160, vy: -120 - Math.random() * 110,
      life: 2.6, t: 0, rot: Math.random() * 6, vr: (Math.random() - .5) * 9, grav: 820, collide: true, settle: true });
  emit({ type: 'puff', x, y, vx: 0, vy: -14, life: .8, t: 0, size: 13, color: 'rgba(120,95,70,.25)' });
}
export function sparkleBurst(x, y, hex, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * 130;
    emit({ type: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40,
      life: .6 + Math.random() * .6, t: 0, size: 1.2 + Math.random() * 2.2, color: hex, grav: 140 });
  }
}
export function dust(x, y, n = 4) {
  for (let i = 0; i < n; i++)
    emit({ type: 'puff', x: x + (Math.random() - .5) * 16, y, vx: (Math.random() - .5) * 40,
      vy: -8 - Math.random() * 18, life: .6 + Math.random() * .4, t: 0,
      size: 5 + Math.random() * 6, color: 'rgba(150,120,90,.22)' });
}
export function mote(x, y) {
  emit({ type: 'mote', x, y, vx: (Math.random() - .5) * 7, vy: -3 - Math.random() * 6,
    life: 4 + Math.random() * 4, t: 0, size: .9 + Math.random() * 1.3, color: '#ffe8b0' });
}
export function firefly(x, y, hex = '#d8f0a0') {
  emit({ type: 'fly', x, y, vx: 0, vy: 0, life: 5 + Math.random() * 5, t: 0,
    size: 1.4 + Math.random() * 1.2, color: hex, ph: Math.random() * 9 });
}
export function drip(x, y) {
  emit({ type: 'drip', x, y, vx: 0, vy: 30, life: 2.4, t: 0, size: 1.6,
    color: '#a8d8e8', grav: 700, collide: true });
}
export function steam(x, y) {
  emit({ type: 'steam', x: x + (Math.random() - .5) * 20, y, vx: (Math.random() - .5) * 9,
    vy: -20 - Math.random() * 12, life: 2.2 + Math.random() * 1.4, t: 0,
    size: 5 + Math.random() * 7, color: 'rgba(235,245,252,.09)' });
}
export function splash(x, y, v, n = 10) {
  for (let i = 0; i < n; i++)
    emit({ type: 'drip', x: x + (Math.random() - .5) * 20, y,
      vx: (Math.random() - .5) * 150, vy: -Math.random() * v * 0.45,
      life: .9, t: 0, size: 1.6 + Math.random(), color: '#bce8f0', grav: 700 });
}
export function smoke(x, y) {
  emit({ type: 'steam', x: x + (Math.random() - .5) * 6, y, vx: (Math.random() - .5) * 6,
    vy: -16 - Math.random() * 10, life: 2.8, t: 0, size: 4 + Math.random() * 5,
    color: 'rgba(90,80,75,.18)' });
}
export function riseIcon(x, y, img) {   // collected-gem pop: sprite floats up & fades
  emit({ type: 'icon', x, y: y - 6, vx: 0, vy: -42, life: 0.9, t: 0, img, size: 18 });
}
export function ember(x, y) {
  emit({ type: 'spark', x: x + (Math.random() - .5) * 10, y, vx: (Math.random() - .5) * 18,
    vy: -36 - Math.random() * 30, life: 1 + Math.random(), t: 0,
    size: 1 + Math.random() * 1.4, color: '#ffb050', grav: -16 });
}

// ----------------------------------------------------------- sim + draw
export function updateParticles(dt) {
  alive = 0;
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (!p || p.dead) continue;
    p.t += dt;
    if (p.t >= p.life) { p.dead = true; continue; }
    alive++;
    if (p.type === 'fly') {
      p.ph += dt;
      p.vx = Math.sin(p.ph * 1.3) * 16; p.vy = Math.cos(p.ph * 1.7) * 9;
    }
    if (p.grav) p.vy += p.grav * dt;
    let nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
    if (p.collide) {
      if (solidAtPx(nx, ny)) {
        if (p.settle && Math.abs(p.vy) < 60) { p.vx = 0; p.vy = 0; nx = p.x; ny = p.y; }
        else {
          if (solidAtPx(nx, p.y)) { p.vx *= -0.4; nx = p.x; }
          if (solidAtPx(p.x, ny)) { p.vy *= -0.35; ny = p.y; p.vx *= 0.6; if (p.type === 'drip') p.dead = true; }
        }
      }
      if (p.type === 'drip' && waterAtPx(nx, ny)) p.dead = true;
    }
    p.x = nx; p.y = ny;
    if (p.vr) p.rot += p.vr * dt;
  }
}

export function drawParticles(ctx, x0, y0, x1, y1, time) {
  // pass 1: normal blending
  for (const p of pool) {
    if (!p || p.dead || p.type === 'spark' || p.type === 'mote' || p.type === 'fly') continue;
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
    const k = 1 - p.t / p.life;
    if (p.type === 'rock') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, k * 3);
      ctx.drawImage(p.img, -p.img.width / 2, -p.img.height / 2);
      ctx.restore();
    } else if (p.type === 'icon') {
      const pop = p.t < 0.18 ? 1 + (0.18 - p.t) * 2.2 : 1;   // squashy entrance
      const s = p.size * pop;
      ctx.globalAlpha = Math.min(1, k * 2.5);
      ctx.drawImage(p.img, p.x - s / 2, p.y - s / 2, s, s * (p.img.height / p.img.width));
      ctx.globalAlpha = 1;
    } else if (p.type === 'puff' || p.type === 'steam') {
      ctx.globalAlpha = k;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + p.t * 1.2), 0, 7); ctx.fill();
    } else {
      ctx.globalAlpha = Math.min(1, k * 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
  }
  ctx.globalAlpha = 1;
  // pass 2: additive glows
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const p of pool) {
    if (!p || p.dead) continue;
    if (p.type !== 'spark' && p.type !== 'mote' && p.type !== 'fly') continue;
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
    const k = 1 - p.t / p.life;
    let a = k;
    if (p.type === 'fly') a = (0.4 + 0.6 * Math.abs(Math.sin(p.ph * 2.6))) * Math.min(1, k * 4);
    if (p.type === 'mote') a = Math.min(1, k * 2.5) * (0.35 + .3 * Math.sin(time * 3 + p.x));
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}
