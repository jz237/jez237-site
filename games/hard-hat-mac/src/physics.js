// Axis-aligned box world + vertical-cylinder character controller.
// Boxes: { x0,y0,z0,x1,y1,z1, surf, dyn?, conv?: {x,z}, noFloor?, ghost? }
import { clamp } from './util.js';

export const GRAVITY = 30;
export const STEP = 0.34;
const CELL = 4;

export class PhysWorld {
  constructor() { this.grid = new Map(); this.statics = []; this.dyn = []; this.stamp = 1; this._out = []; }
  key(cx, cz) { return cx * 73856093 ^ cz * 19349663; }
  add(b) {
    b._s = 0; this.statics.push(b);
    for (let cx = Math.floor(b.x0 / CELL); cx <= Math.floor(b.x1 / CELL); cx++)
      for (let cz = Math.floor(b.z0 / CELL); cz <= Math.floor(b.z1 / CELL); cz++) {
        const k = this.key(cx, cz); let a = this.grid.get(k);
        if (!a) this.grid.set(k, a = []); a.push(b);
      }
    return b;
  }
  addDyn(b) { b.dyn = true; b.dx = b.dy = b.dz = 0; b.enabled = b.enabled !== false; b._s = 0; this.dyn.push(b); return b; }
  remove(b) {
    if (b.dyn) { const i = this.dyn.indexOf(b); if (i >= 0) this.dyn.splice(i, 1); return; }
    for (const a of this.grid.values()) { const i = a.indexOf(b); if (i >= 0) a.splice(i, 1); }
    const i = this.statics.indexOf(b); if (i >= 0) this.statics.splice(i, 1);
  }
  // Move a dynamic box to a new min corner, recording the delta for riders.
  moveDyn(b, x0, y0, z0) {
    const w = b.x1 - b.x0, h = b.y1 - b.y0, d = b.z1 - b.z0;
    b.dx += x0 - b.x0; b.dy += y0 - b.y0; b.dz += z0 - b.z0;
    b.x0 = x0; b.y0 = y0; b.z0 = z0; b.x1 = x0 + w; b.y1 = y0 + h; b.z1 = z0 + d;
  }
  clearDeltas() { for (const b of this.dyn) b.dx = b.dy = b.dz = 0; }
  query(x0, z0, x1, z1) {
    const out = this._out; out.length = 0; const s = ++this.stamp;
    for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++)
      for (let cz = Math.floor(z0 / CELL); cz <= Math.floor(z1 / CELL); cz++) {
        const a = this.grid.get(this.key(cx, cz)); if (!a) continue;
        for (const b of a) if (b._s !== s) { b._s = s; out.push(b); }
      }
    for (const b of this.dyn) if (b.enabled && b.x1 >= x0 && b.x0 <= x1 && b.z1 >= z0 && b.z0 <= z1) out.push(b);
    return out;
  }
  // Highest walkable top at (x,z) that is <= y (+tolerance). Returns box or null.
  groundBelow(x, z, y, r = 0, tol = 0.05) {
    let best = null, by = -Infinity;
    for (const b of this.query(x - r, z - r, x + r, z + r)) {
      if (b.noFloor || b.ghost) continue;
      if (x + r < b.x0 || x - r > b.x1 || z + r < b.z0 || z - r > b.z1) continue;
      if (b.y1 <= y + tol && b.y1 > by) { by = b.y1; best = b; }
    }
    return best;
  }
  pointSolid(x, y, z) {
    for (const b of this.query(x, z, x, z)) {
      if (b.ghost) continue;
      if (x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1 && y > b.y0 && y < b.y1) return b;
    }
    return null;
  }
  segmentBlocked(ax, ay, az, bx, by, bz, step = 0.5) {
    const d = Math.hypot(bx - ax, by - ay, bz - az), n = Math.max(1, Math.ceil(d / step));
    for (let i = 1; i < n; i++) {
      const t = i / n;
      if (this.pointSolid(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t)) return true;
    }
    return false;
  }
}

function circleRect(x, z, r, b) {
  const cx = clamp(x, b.x0, b.x1), cz = clamp(z, b.z0, b.z1);
  const dx = x - cx, dz = z - cz;
  return dx * dx + dz * dz < r * r;
}

// body: { x,y,z, vx,vy,vz, r, h, onGround, ground, wasGround }
// Caller applies gravity / input to velocity; this integrates and resolves.
export function moveBody(world, b, dt, snap = true) {
  b.wasGround = b.onGround; b.hitWall = null;
  if (b.onGround && b.ground) {
    const g = b.ground;
    if (g.dyn) { b.x += g.dx; b.y += g.dy; b.z += g.dz; }
    if (g.conv) { b.x += g.conv.x * dt; b.z += g.conv.z * dt; }
  }
  const prevY = b.y;
  b.x += b.vx * dt; b.z += b.vz * dt; b.y += b.vy * dt;
  const pad = b.r + 1.5;
  const boxes = world.query(b.x - pad, b.z - pad, b.x + pad, b.z + pad);

  // horizontal push-out (two passes for corners)
  for (let pass = 0; pass < 2; pass++) {
    for (const bx of boxes) {
      if (bx.ghost) continue;
      const footY = Math.max(b.y, prevY);
      if (bx.y1 <= footY + STEP || bx.y0 >= b.y + b.h - 0.02) continue;
      const cx = clamp(b.x, bx.x0, bx.x1), cz = clamp(b.z, bx.z0, bx.z1);
      let dx = b.x - cx, dz = b.z - cz; const d2 = dx * dx + dz * dz;
      if (d2 >= b.r * b.r) continue;
      let nx, nz, pen;
      if (d2 > 1e-10) { const d = Math.sqrt(d2); nx = dx / d; nz = dz / d; pen = b.r - d; }
      else {
        const l = b.x - bx.x0, rr = bx.x1 - b.x, f = b.z - bx.z0, k = bx.z1 - b.z, m = Math.min(l, rr, f, k);
        if (m === l) { nx = -1; nz = 0; pen = l + b.r; } else if (m === rr) { nx = 1; nz = 0; pen = rr + b.r; }
        else if (m === f) { nx = 0; nz = -1; pen = f + b.r; } else { nx = 0; nz = 1; pen = k + b.r; }
      }
      b.x += nx * pen; b.z += nz * pen;
      const vn = b.vx * nx + b.vz * nz; if (vn < 0) { b.vx -= vn * nx; b.vz -= vn * nz; }
      b.hitWall = bx;
    }
  }

  // vertical
  const rs = b.r * 0.72;
  if (b.vy <= 0) {
    let best = -Infinity, bb = null;
    const low = b.y - (snap && b.wasGround ? STEP : 0) - 1e-4;
    for (const bx of boxes) {
      if (bx.ghost || bx.noFloor) continue;
      if (!circleRect(b.x, b.z, rs, bx)) continue;
      const top = bx.y1;
      if (top <= prevY + STEP + 1e-4 && top >= low && top > best) { best = top; bb = bx; }
    }
    if (bb) { b.y = best; b.vy = 0; b.onGround = true; b.ground = bb; }
    else { b.onGround = false; b.ground = null; }
  } else {
    for (const bx of boxes) {
      if (bx.ghost) continue;
      if (!circleRect(b.x, b.z, b.r * 0.8, bx)) continue;
      if (bx.y0 >= prevY + b.h - 0.06 && bx.y0 < b.y + b.h) { b.y = bx.y0 - b.h; b.vy = 0; b.bonked = true; }
    }
    b.onGround = false; b.ground = null;
  }
  return b;
}
