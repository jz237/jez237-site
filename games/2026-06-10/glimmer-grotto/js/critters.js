// Gentle ambient critters: moths, snails, bats, fish, birds.
// Capped, spawned near the camera, culled when far. Pure scenery — nothing bites.

import { TILE, biomeAt, T_GRASS } from './config.js';
import { IMG } from './assets.js';
import { solidAt, waterAt, tileAt } from './world.js';
import { clamp } from './util.js';

const list = [];
const CAP = 10;
let spawnT = 0, batCool = 3;

export function updateCritters(dt, cam, vw, vh, player, time) {
  spawnT -= dt; batCool -= dt;
  if (spawnT <= 0) { spawnT = 0.45; trySpawn(cam, vw, vh, player); }

  // bats roost in ceilings and flutter off when the miner wanders below
  if (batCool <= 0) {
    const ptx = Math.floor(player.x / TILE), pty = Math.floor(player.y / TILE);
    const b = biomeAt(Math.max(0, pty));
    if (b.id === 'stone' || b.id === 'crystal' || b.id === 'ruins') {
      for (let dy = -6; dy <= -3; dy++) {
        const ty = pty + dy;
        if (solidAt(ptx, ty) && !solidAt(ptx, ty + 1)) {
          if (Math.random() < 0.12 && list.length < CAP + 3) {
            const n = 2 + (Math.random() * 2 | 0);
            for (let k = 0; k < n; k++)
              list.push({ kind: 'bat', x: ptx * TILE + 16 + (Math.random() - .5) * 36,
                y: (ty + 1) * TILE + 10, vx: (Math.random() < .5 ? -1 : 1) * (55 + Math.random() * 55),
                vy: -16, t: 0, life: 4.5, ph: Math.random() * 7 });
            batCool = 14;
          } else batCool = 2;
          break;
        }
      }
    } else batCool = 2;
  }

  for (let i = list.length - 1; i >= 0; i--) {
    const c = list[i];
    c.t += dt; c.ph += dt;
    switch (c.kind) {
      case 'moth':
        c.x = c.ax + Math.sin(c.ph * 1.1) * 26 + Math.sin(c.ph * 2.7) * 8;
        c.y = c.ay + Math.cos(c.ph * 1.6) * 16;
        c.dir = Math.cos(c.ph * 1.1) >= 0 ? 1 : -1;
        break;
      case 'snail': {
        c.x += c.vx * dt;
        const aheadX = Math.floor((c.x + Math.sign(c.vx) * 7) / TILE);
        const bodyY = Math.floor((c.y - 4) / TILE), floorY = Math.floor((c.y + 3) / TILE);
        if (solidAt(aheadX, bodyY) || !solidAt(aheadX, floorY)) c.vx = -c.vx;
        c.dir = Math.sign(c.vx);
        break;
      }
      case 'fish': {
        c.x += c.vx * dt;
        c.y += Math.sin(c.ph * 2) * 7 * dt;
        const nx = Math.floor((c.x + Math.sign(c.vx) * 12) / TILE);
        if (!waterAt(nx, Math.floor(c.y / TILE))) c.vx = -c.vx;
        const pd = Math.hypot(player.x - c.x, player.y - c.y);
        if (pd < 60) c.vx = Math.sign(c.x - player.x || 1) * Math.abs(c.vx) * 1.01;
        c.dir = Math.sign(c.vx);
        break;
      }
      case 'bird':
        if (!c.flying) {
          if (Math.hypot(player.x - c.x, player.y - c.y) < 95) {
            c.flying = true;
            c.vx = Math.sign(c.x - player.x || 1) * 95;
            c.vy = -75;
            c.life = c.t + 3;
          }
        } else {
          c.x += c.vx * dt; c.y += c.vy * dt; c.vy -= 28 * dt;
          c.dir = Math.sign(c.vx);
        }
        break;
      case 'bat':
        c.x += c.vx * dt;
        c.y += (Math.sin(c.ph * 9) * 34 + c.vy) * dt;
        c.dir = Math.sign(c.vx);
        break;
    }
    const off = c.x < cam.x - vw * 0.7 || c.x > cam.x + vw * 1.7 ||
      c.y < cam.y - vh * 0.7 || c.y > cam.y + vh * 1.7;
    if (c.t > c.life || off) list.splice(i, 1);
  }
}

function trySpawn(cam, vw, vh, player) {
  if (list.length >= CAP) return;
  const x = cam.x + Math.random() * vw, y = cam.y + Math.random() * vh;
  const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
  if (ty < 0 || ty > 556) return;
  if (Math.hypot(player.x - x, player.y - y) < 130) return;     // not right on top of the miner
  const b = biomeAt(ty);
  if (waterAt(tx, ty)) {
    if (waterAt(tx, ty + 1) && Math.random() < 0.6)
      list.push({ kind: 'fish', x, y, vx: (Math.random() < .5 ? -1 : 1) * (24 + Math.random() * 22),
        t: 0, life: 20, ph: Math.random() * 7, dir: 1 });
    return;
  }
  if (solidAt(tx, ty)) return;
  if (tileAt(tx, ty + 1) === T_GRASS && Math.random() < 0.5) {
    list.push({ kind: 'bird', x, y: (ty + 1) * TILE, vx: 0, vy: 0, t: 0, life: 26, ph: Math.random() * 7, dir: 1 });
  } else if ((b.id === 'mush' || b.id === 'crystal') && Math.random() < 0.6) {
    list.push({ kind: 'moth', ax: x, ay: y, x, y, t: 0, life: 17, ph: Math.random() * 7, dir: 1 });
  } else if (solidAt(tx, ty + 1) &&
      (b.id === 'earth' || b.id === 'stone' || b.id === 'spring' || b.id === 'ruins') &&
      Math.random() < 0.4) {
    list.push({ kind: 'snail', x, y: (ty + 1) * TILE, vx: (Math.random() < .5 ? -1 : 1) * 4.5,
      t: 0, life: 26, ph: 0, dir: 1 });
  }
}

export function drawCritters(ctx) {
  for (const c of list) {
    const img = IMG[c.kind];
    if (!img) continue;
    const w = img.width / 4, h = img.height / 4;
    const fade = clamp(Math.min(c.t * 3, (c.life - c.t) * 2), 0, 1);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(c.x, c.y);
    if ((c.dir || 1) < 0) ctx.scale(-1, 1);
    let sy = 1;
    if (c.kind === 'bat') sy = 1 + Math.sin(c.ph * 22) * 0.35;
    if (c.kind === 'moth') sy = 1 + Math.sin(c.ph * 16) * 0.3;
    if (c.kind === 'bird' && c.flying) sy = 1 + Math.sin(c.ph * 20) * 0.3;
    ctx.scale(1, sy);
    const grounded = c.kind === 'snail' || (c.kind === 'bird' && !c.flying);
    ctx.drawImage(img, -w / 2, grounded ? -h : -h / 2, w, h);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
