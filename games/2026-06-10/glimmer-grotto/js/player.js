// Player: weighty-but-gentle platforming physics, digging, cozy animation.

import { TILE, REACH, ENERGY_MAX, TILE_DEF, UPGRADES } from './config.js';
import { clamp, lerp } from './util.js';
import { IMG } from './assets.js';
import { solidAt, waterAtPx, damageTile, tileAt } from './world.js';
import { T_AIR } from './config.js';

const GRAV = 1150, MAX_FALL = 620, WALK = 165, ACCEL = 1300, AIR_ACCEL = 760,
  FRICTION = 1500, JUMP_V = 365, COYOTE = 0.11, BUFFER = 0.12;

export class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 20; this.h = 38;
    this.vx = 0; this.vy = 0;
    this.onGround = false; this.inWater = false;
    this.face = 1;
    this.coyote = 0; this.jumpBuf = 0;
    this.energy = ENERGY_MAX;
    this.energyMax = ENERGY_MAX;
    this.upgrades = { pick: 0, lantern: 0, satchel: 0 };
    this.bag = [];                    // {kind,id}
    this.swingT = 0; this.swinging = false; this.digTarget = null;
    this.walkPhase = 0;
    this.sx = 1; this.sy = 1;         // squash & stretch springs
    this.restGlow = 0;                // 1 when resting at fire
    this.events = [];                 // {type,...} consumed by main
    this.peakFall = 0;
  }

  get pickDef() { return UPGRADES.pick.tiers[this.upgrades.pick]; }
  get lanternRadius() { return UPGRADES.lantern.tiers[this.upgrades.lantern].radius; }
  get bagCap() { return UPGRADES.satchel.tiers[this.upgrades.satchel].cap; }
  get tired() { return this.energy < 12; }

  aabbSolid(x, y) {
    const x0 = Math.floor((x - this.w / 2) / TILE), x1 = Math.floor((x + this.w / 2 - 0.01) / TILE);
    const y0 = Math.floor((y - this.h) / TILE), y1 = Math.floor((y - 0.01) / TILE);
    for (let ty = y0; ty <= y1; ty++)
      for (let tx = x0; tx <= x1; tx++)
        if (solidAt(tx, ty)) return true;
    return false;
  }

  update(dt, input, time) {
    const wasInWater = this.inWater;
    this.inWater = waterAtPx(this.x, this.y - this.h * 0.5);
    if (this.inWater !== wasInWater && Math.abs(this.vy) > 90)
      this.events.push({ type: 'splash', x: this.x, y: this.y, v: Math.abs(this.vy) });

    // -------- horizontal
    const want = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const maxV = WALK * (this.inWater ? 0.62 : 1) * (this.tired ? 0.75 : 1);
    if (want !== 0) {
      const a = (this.onGround ? ACCEL : AIR_ACCEL) * (this.inWater ? 0.6 : 1);
      this.vx = clamp(this.vx + want * a * dt, -maxV, maxV);
      this.face = want;
      if (this.onGround) this.walkPhase += dt * 11;
    } else {
      const f = (this.onGround ? FRICTION : 240) * dt;
      this.vx = Math.abs(this.vx) <= f ? 0 : this.vx - Math.sign(this.vx) * f;
    }

    // -------- vertical
    if (input.jump) this.jumpBuf = BUFFER;
    else this.jumpBuf = Math.max(0, this.jumpBuf - dt);
    this.coyote = this.onGround ? COYOTE : Math.max(0, this.coyote - dt);

    if (this.inWater) {
      this.vy += GRAV * 0.22 * dt;
      this.vy = clamp(this.vy, -150, 130);
      if (input.jump) this.vy = Math.max(this.vy - 480 * dt, -150);
      this.vy -= this.vy * 1.4 * dt;     // drag
    } else {
      this.vy = Math.min(this.vy + GRAV * dt, MAX_FALL);
      if (this.jumpBuf > 0 && this.coyote > 0) {
        this.vy = -JUMP_V; this.jumpBuf = 0; this.coyote = 0;
        this.sx = 0.78; this.sy = 1.24;
        this.events.push({ type: 'jump', x: this.x, y: this.y });
      }
      if (!input.jump && this.vy < -140) this.vy = -140;   // variable jump height
    }
    if (this.vy > 0) this.peakFall = Math.max(this.peakFall, this.vy);

    // -------- integrate w/ tile collision (axis separated)
    let nx = this.x + this.vx * dt;
    if (this.aabbSolid(nx, this.y)) {
      const step = Math.sign(this.vx);
      while (Math.abs(nx - this.x) > 0.2 && this.aabbSolid(nx, this.y)) nx -= step * 0.5;
      if (this.aabbSolid(nx, this.y)) nx = this.x;
      this.vx = 0;
    }
    this.x = nx;

    let ny = this.y + this.vy * dt;
    const wasGround = this.onGround;
    this.onGround = false;
    if (this.aabbSolid(this.x, ny)) {
      const step = Math.sign(this.vy);
      while (Math.abs(ny - this.y) > 0.2 && this.aabbSolid(this.x, ny)) ny -= step * 0.5;
      if (this.aabbSolid(this.x, ny)) ny = this.y;
      if (this.vy > 0) {
        this.onGround = true;
        if (!wasGround && this.peakFall > 330) {
          const oof = (this.peakFall - 330) / 290;
          this.energy = Math.max(0, this.energy - Math.min(14, oof * 9));
          this.sx = 1 + clamp(oof, 0, .5) * 0.45; this.sy = 1 - clamp(oof, 0, .5) * 0.4;
          this.events.push({ type: 'land', x: this.x, y: this.y, hard: oof > 0.4 });
        } else if (!wasGround) {
          this.sx = 1.12; this.sy = 0.9;
          this.events.push({ type: 'land', x: this.x, y: this.y, hard: false });
        }
        this.peakFall = 0;
      }
      this.vy = 0;
    }
    this.y = ny;

    // -------- digging
    this.updateDig(dt, input);

    // -------- energy regen & anim springs
    const resting = this.restGlow > 0.5;
    this.energy = Math.min(this.energyMax, this.energy + (resting ? 14 : 1.1) * dt);
    this.sx = lerp(this.sx, 1, Math.min(1, dt * 9));
    this.sy = lerp(this.sy, 1, Math.min(1, dt * 9));
    if (want === 0) this.walkPhase = lerp(this.walkPhase % (Math.PI * 2), 0, Math.min(1, dt * 8));
  }

  // pick the tile to dig from input intent
  resolveTarget(input) {
    const cx = this.x, cy = this.y - this.h * 0.55;
    let dx, dy;
    if (input.aimActive) {                  // mouse / touch-drag aim
      dx = input.aimX - cx; dy = input.aimY - cy;
    } else {
      dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
      if (dx === 0 && dy === 0) dx = this.face;
    }
    const len = Math.hypot(dx, dy) || 1;
    const reach = Math.min(REACH, input.aimActive ? len : REACH);
    // straight up/down: the body straddles two columns — clear whichever
    // is solid so the miner can actually descend (or tunnel upward)
    if (!input.aimActive && dx === 0 && dy !== 0) {
      const cols = [Math.floor(cx / TILE),
        Math.floor((cx - this.w / 2) / TILE), Math.floor((cx + this.w / 2 - 0.01) / TILE)];
      for (let d = TILE * 0.6; d <= reach; d += TILE * 0.45) {
        const ty = Math.floor((cy + dy * d) / TILE);
        for (const tx of cols)
          if (solidAt(tx, ty)) return { tx, ty, dx: 0, dy, center: true };
      }
      return null;
    }
    // walk a short ray, return first solid tile
    for (let d = TILE * 0.6; d <= reach; d += TILE * 0.45) {
      const tx = Math.floor((cx + dx / len * d) / TILE);
      const ty = Math.floor((cy + dy / len * d) / TILE);
      if (solidAt(tx, ty)) return { tx, ty, dx: dx / len, dy: dy / len };
    }
    return null;
  }

  updateDig(dt, input) {
    const speed = this.pickDef.speed * (this.tired ? 0.55 : 1);
    if (this.swinging) {
      this.swingT += dt * speed;
      if (this.swingT >= 0.38) {
        this.swinging = false;
        if (this.digTarget) {
          const { tx, ty } = this.digTarget;
          const res = damageTile(tx, ty, this.pickDef.power, this.pickDef.pick);
          if (res.hit) {
            this.energy = Math.max(0, this.energy - 0.8);
            this.events.push({ type: res.blocked ? 'tink' : (res.broken ? 'break' : 'dig'),
              tx, ty, x: (tx + .5) * TILE, y: (ty + .5) * TILE, res });
          }
        }
      }
    }
    if (!this.swinging && input.dig) {
      const target = this.resolveTarget(input);
      if (target) {
        this.digTarget = target;
        this.swinging = true; this.swingT = 0;
        if (target.dx !== 0) this.face = Math.sign(target.dx);
        this.events.push({ type: 'swing' });
      } else this.digTarget = null;
    }
    // gentle drift over the shaft while digging vertically, so the miner
    // settles into the hole instead of standing on its lip
    if (input.dig && this.digTarget && this.digTarget.center) {
      const want = (this.digTarget.tx + 0.5) * TILE;
      this.vx += (want - this.x) * 6 * dt;
    }
  }

  draw(ctx, time) {
    const img = IMG['miner'], pickImg = IMG['pickaxe'];
    const w = img.width / 4, h = img.height / 4;
    const bobY = this.onGround ? Math.abs(Math.sin(this.walkPhase)) * -2.4 : 0;

    // soft contact shadow grounds the miner
    if (this.onGround) {
      const g = ctx.createRadialGradient(this.x, this.y - 1, 1, this.x, this.y - 1, 13);
      g.addColorStop(0, 'rgba(8,4,2,.34)'); g.addColorStop(1, 'rgba(8,4,2,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(this.x, this.y - 1, 13, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    }
    const lean = clamp(this.vx / WALK, -1, 1) * 0.08 +
      (this.onGround ? Math.sin(this.walkPhase) * 0.05 : clamp(this.vy / 600, -.12, .18));
    const px = this.x, py = this.y + bobY;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(lean);
    ctx.scale(this.face * this.sx, this.sy);

    // pickaxe behind body mid-swing
    const swingK = Math.min(1, this.swingT / 0.32);
    const swingA = this.swinging ? lerp(-2.2, 0.5, swingK) : -1.9;
    const handX = 7, handY = -h * 0.45;
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(swingA);
    ctx.drawImage(pickImg, -4, -pickImg.height / 4 + 4, pickImg.width / 4, pickImg.height / 4);
    if (this.swinging && swingK > 0.45 && swingK < 0.8) {   // glint at the apex
      ctx.globalAlpha = (0.8 - swingK) * 2.2;
      ctx.fillStyle = '#fff6c4';
      ctx.fillRect(pickImg.width / 8 - 3, -pickImg.height / 4 + 2, 3, 3);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.drawImage(img, -w / 2, -h, w, h);

    // lantern on hip, swaying
    const limg = IMG['lantern'];
    ctx.save();
    ctx.translate(-6, -h * 0.38);
    ctx.rotate(Math.sin(time * 2.2 + this.x * 0.01) * 0.16 + lean * 1.6);
    ctx.drawImage(limg, -limg.width / 8, 0, limg.width / 4, limg.height / 4);
    ctx.restore();

    ctx.restore();

    // dig target marker (subtle)
    if (this.digTarget && this.swinging) {
      const { tx, ty } = this.digTarget;
      ctx.save();
      ctx.globalAlpha = 0.28 + Math.sin(time * 10) * 0.1;
      ctx.strokeStyle = '#ffd87f';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(tx * TILE + 2, ty * TILE + 2, TILE - 4, TILE - 4);
      ctx.restore();
    }
  }
}
