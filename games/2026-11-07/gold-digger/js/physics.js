// Tile physics for the digger: one function moves a body through the tile map for one fixed step. The
// simulation uses it for the player and the navigation builder (nav.js) uses the very same function to
// probe every jump and drop, so the autopilot's map of "where can I get to from here" is exact.
import { T, SOLID, CLIMB, PHYS } from './config.js?v=12';

export const EPS = 1e-4;
export function tileAt(M, x, y) {
  if (x < 0 || x >= M.w || y < 0) return T.ROCK;
  if (y >= M.h) return T.AIR;           // open sky above the map (the start shaft)
  return M.tiles[y * M.w + x];
}
export const solidT = (M, x, y) => SOLID[tileAt(M, x, y)] === 1;
export const climbT = (M, x, y) => CLIMB[tileAt(M, x, y)] === 1;
// a cell you can stand on top of when coming down onto it: a plank, or any ladder rung (ladders catch you, so a
// ladder shaft through a floor is never a hole and nobody falls down a whole shaft)
export function oneWayT(M, x, y) {
  const t = tileAt(M, x, y);
  return t === T.PLANK || t === T.LADDER;
}
export function standable(M, x, y) {
  // can a body stand in cell (x, y): the cell and the one above are free, and below is a floor
  const a = tileAt(M, x, y), b = tileAt(M, x, y + 1);
  if (SOLID[a] || SOLID[b] || a === T.WATER || a === T.LAVA) return false;
  return solidT(M, x, y - 1) || oneWayT(M, x, y - 1);
}

// does the box [x0,x1] x [y0,y1] overlap a solid cell?
function hitSolid(M, x0, y0, x1, y1) {
  const cx0 = Math.floor(x0 + EPS), cx1 = Math.floor(x1 - EPS), cy0 = Math.floor(y0 + EPS), cy1 = Math.floor(y1 - EPS);
  for (let y = cy0; y <= cy1; y++) for (let x = cx0; x <= cx1; x++) if (solidT(M, x, y)) return true;
  return false;
}
export function boxOverlapsTile(M, x0, y0, x1, y1, kind) {
  const cx0 = Math.floor(x0 + EPS), cx1 = Math.floor(x1 - EPS), cy0 = Math.floor(y0 + EPS), cy1 = Math.floor(y1 - EPS);
  for (let y = cy0; y <= cy1; y++) for (let x = cx0; x <= cx1; x++) if (tileAt(M, x, y) === kind) return true;
  return false;
}

// A fresh body (player, or a probe in nav.js)
export function makeBody(x, y) {
  return { x, y, vx: 0, vy: 0, face: 1, ground: true, state: 'walk', peakY: y, coyote: 0, buffer: 0, jumpHeld: false,
    dropT: 0, onLift: -1, landed: 0, fell: 0, inWater: false, headUnder: false, climbX: 0, stepT: 0, bonk: 0 };
}

// One fixed step. inp: { mx, my, jump } (held). plats: moving platforms [{ x0, x1, y, vy }] (lifts), may be null.
// Returns nothing; sets B.landed = metres fallen on the step it lands (0 otherwise), B.fell = water landing flag.
export function stepBody(M, B, inp, dt, plats, bootFall = 0) {
  const P = PHYS, hw = P.w / 2;
  B.landed = 0; B.splash = 0; B.bonk = 0;
  const mx = inp.mx || 0, my = inp.my || 0;
  const jumpEdge = inp.jump && !B.jumpHeld;
  B.jumpHeld = !!inp.jump;
  if (jumpEdge) B.buffer = P.buffer; else B.buffer = Math.max(0, B.buffer - dt);
  B.dropT = Math.max(0, B.dropT - dt);
  const cx = Math.floor(B.x), midY = Math.floor(B.y + 0.8);
  const wasWater = B.inWater;
  B.inWater = tileAt(M, cx, Math.floor(B.y + 0.6)) === T.WATER;
  B.headUnder = tileAt(M, cx, Math.floor(B.y + 1.45)) === T.WATER;
  if (B.inWater && !wasWater && B.state !== 'climb') { B.splash = Math.abs(B.vy); B.peakY = B.y; }

  // --- grab a ladder / rope
  if (B.state !== 'climb') {
    const onClimb = climbT(M, cx, midY) || climbT(M, cx, Math.floor(B.y + 0.15));
    const belowClimb = B.ground && climbT(M, cx, Math.floor(B.y - 0.5)) && !solidT(M, cx, Math.floor(B.y - 0.5));
    if ((my > 0.5 && onClimb) || (my < -0.5 && (belowClimb || (onClimb && !B.ground)))) {
      B.state = 'climb'; B.climbX = cx + 0.5; B.vx = 0; B.vy = 0; B.ground = false; B.peakY = B.y;
      if (my < -0.5 && belowClimb) B.y -= 0.05;
    }
  }

  if (B.state === 'climb') {
    B.x += (B.climbX - B.x) * Math.min(1, dt * 18);
    if (Math.abs(mx) > 0.2) B.face = Math.sign(mx);
    B.vy = my * P.climb; B.vx = 0;
    if (jumpEdge) {
      B.state = 'walk'; B.vy = P.jumpV * 0.62; B.vx = mx * P.run * 0.8; if (mx) B.face = Math.sign(mx);
      B.buffer = 0; B.peakY = B.y;
    } else {
      let ny = B.y + B.vy * dt;
      const ccx = Math.floor(B.climbX);
      // climbing up past the top rung: stand on it
      if (B.vy > 0 && !climbT(M, ccx, Math.floor(ny + 0.05)) && !climbT(M, ccx, Math.floor(ny + 0.9))) {
        const top = Math.floor(ny + 0.05);
        if (tileAt(M, ccx, top - 1) === T.LADDER) { ny = top; B.state = 'walk'; B.ground = true; B.vy = 0; }
        else ny = B.y;   // top of a rope: hang there
      }
      if (B.vy > 0 && hitSolid(M, B.x - hw, ny, B.x + hw, ny + P.h)) ny = B.y;   // ceiling
      // climbing down onto the floor
      if (B.vy < 0 && (hitSolid(M, B.x - hw, ny, B.x + hw, ny + 0.01))) { ny = Math.ceil(ny); B.state = 'walk'; B.ground = true; B.vy = 0; }
      // ...or onto a lift platform
      if (B.vy < 0 && B.state === 'climb' && plats) for (let i = 0; i < plats.length; i++) {
        const p = plats[i];
        if (B.x + hw > p.x0 && B.x - hw < p.x1 && B.y >= p.y - 0.02 && ny <= p.y + 0.02) { ny = p.y; B.state = 'walk'; B.ground = true; B.vy = 0; B.onLift = i; break; }
      }
      // off the bottom of a rope in mid-air: let go
      if (B.state === 'climb' && B.vy < 0 && !climbT(M, ccx, Math.floor(ny + 0.6)) && !climbT(M, ccx, Math.floor(ny + 0.1))) { B.state = 'walk'; B.peakY = ny; }
      B.y = ny;
      // step off sideways onto a floor beside the ladder
      if (B.state === 'climb' && Math.abs(mx) > 0.5) {
        const fy = Math.round(B.y);
        if (Math.abs(B.y - fy) < 0.32) {
          const nx = Math.floor(B.climbX + Math.sign(mx) * 0.9);
          if (standable(M, nx, fy) || (fy >= 1 && (solidT(M, nx, fy - 1) || oneWayT(M, nx, fy - 1)) && !solidT(M, nx, fy) && !solidT(M, nx, fy + 1))) {
            B.state = 'walk'; B.y = fy; B.ground = true; B.vy = 0; B.peakY = fy; B.vx = Math.sign(mx) * P.run * 0.6; B.face = Math.sign(mx);
          }
        }
      }
      if (B.state === 'climb') { B.peakY = B.y; return; }
    }
  }

  // --- horizontal
  const swim = B.inWater;
  const maxRun = swim ? P.swimRun : P.run;
  const target = mx * maxRun;
  const acc = B.ground ? (Math.abs(target) > 0.01 ? P.accel : P.decel) : P.airAccel;
  if (B.vx < target) B.vx = Math.min(target, B.vx + acc * dt); else if (B.vx > target) B.vx = Math.max(target, B.vx - acc * dt);
  if (Math.abs(mx) > 0.2) B.face = Math.sign(mx);

  // --- vertical
  if (B.ground) B.coyote = P.coyote; else B.coyote = Math.max(0, B.coyote - dt);
  if (swim) {
    B.vy -= P.swimGrav * dt;
    if (my > 0.3 || inp.jump) B.vy = Math.min(P.swimUp, B.vy + 14 * dt);
    B.vy = Math.max(-P.swimMax, Math.min(B.vy, P.swimUp + 2));
    // hop out at the surface
    if (B.buffer > 0 && !B.headUnder) { B.vy = P.jumpV * 0.82; B.buffer = 0; }
    B.peakY = B.y;
  } else {
    if (B.buffer > 0 && B.coyote > 0) {
      if (my < -0.5 && B.ground && oneWayT(M, Math.floor(B.x), Math.floor(B.y - 0.5)) && !solidT(M, Math.floor(B.x), Math.floor(B.y - 0.5))) {
        B.dropT = 0.25; B.ground = false;   // down + jump drops through a plank
      } else { B.vy = P.jumpV; B.ground = false; B.coyote = 0; B.peakY = B.y; }
      B.buffer = 0;
    }
    if (!inp.jump && B.vy > 0 && !B.ground) B.vy -= B.vy * (1 - P.jumpCut) * Math.min(1, dt * 14);   // short hop when released
    B.vy = Math.max(-P.maxFall, B.vy - P.grav * dt);
  }

  // move X
  let nx = B.x + B.vx * dt;
  if (hitSolid(M, nx - hw, B.y, nx + hw, B.y + P.h)) {
    if (B.vx > 0) nx = Math.floor(nx + hw) - hw - EPS; else if (B.vx < 0) nx = Math.ceil(nx - hw) + hw + EPS;
    if (hitSolid(M, nx - hw, B.y, nx + hw, B.y + P.h)) nx = B.x;
    B.vx = 0;
  }
  B.x = nx;

  // move Y
  let ny = B.y + B.vy * dt;
  const wasGround = B.ground;
  B.ground = false;
  if (B.vy <= 0) {
    // solid floor
    let floorY = -1;
    for (let y = Math.floor(B.y - EPS); y >= Math.floor(ny + EPS); y--) if (hitSolid(M, B.x - hw, y, B.x + hw, y + 1)) { floorY = y + 1; break; }
    if (floorY >= 0) {
      ny = floorY;
      if (hitSolid(M, B.x - hw, ny, B.x + hw, ny + P.h)) ny = B.y;
      B.ground = true;
    } else if (B.dropT <= 0) {
      // one-way tops (planks, ladder tops) the feet crossed this step
      const top = Math.floor(B.y + EPS);
      if (ny < top && B.y >= top - EPS) {
        const x0 = Math.floor(B.x - hw + EPS), x1 = Math.floor(B.x + hw - EPS);
        for (let x = x0; x <= x1; x++) if (oneWayT(M, x, top - 1)) { ny = top; B.ground = true; break; }
      }
    }
    // lifts
    B.onLift = -1;
    if (plats && !B.ground && B.dropT <= 0) {
      for (let i = 0; i < plats.length; i++) {
        const p = plats[i];
        if (B.x + hw > p.x0 && B.x - hw < p.x1 && B.y >= p.y - 0.06 - Math.max(0, -p.vy) * dt && ny <= p.y + 0.02) { ny = p.y; B.ground = true; B.onLift = i; break; }
      }
    }
    if (B.ground) {
      const fall = B.peakY - ny;
      if (!wasGround && fall > 0.05) B.landed = fall;
      B.vy = 0; B.peakY = ny;
    }
  } else if (hitSolid(M, B.x - hw, B.y, B.x + hw, ny + P.h)) {
    ny = Math.floor(ny + P.h) - P.h - EPS; B.vy = 0; B.bonk = 1;
    if (ny < B.y) ny = B.y;
  }
  B.y = ny;
  if (!B.ground && !swim) B.peakY = Math.max(B.peakY, B.y);
  if (swim && B.landed) B.landed = 0;
}

// fall damage in hearts for a landing of `fall` metres (0 = fine, 99 = lethal)
export function fallHurt(fall, bootLvl = 0, extra = 0) {
  const safe = PHYS.safeFall + (bootLvl >= 1 ? 1.6 : 0) + (bootLvl >= 2 ? 1.2 : 0) + extra;
  const lethal = PHYS.lethalFall + (bootLvl >= 1 ? 1.6 : 0) + (bootLvl >= 2 ? 1.2 : 0) + extra;
  if (fall <= safe) return 0;
  if (fall >= lethal) return 99;
  return 1 + Math.floor((fall - safe) / PHYS.hurtPer);
}
