/* Eight Ball Deluxe — physics core.
   Fixed-timestep, swept circle-vs-capsule/circle collision, deterministic
   given a seed + identical inputs. All randomness must go through PHYS.rng. */
'use strict';

const PHYS = (() => {

  /* ---------- deterministic rng ---------- */
  let rngState = 1234567;
  function seed(s){ rngState = (s|0) || 1; }
  function rng(){ // mulberry32
    rngState |= 0; rngState = (rngState + 0x6D2B79F5) | 0;
    let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /* ---------- constants ----------
     Scale: playfield 560px wide ≈ 20.25in → 1px ≈ 0.92mm.
     Gravity along a 6.5° sloped table: 9.81*sin(6.5°) ≈ 1.11 m/s² ≈ 1210 px/s². */
  const DT       = 1/240;        // base physics step
  const GRAV     = 1210;
  const BALL_R   = 14;
  const MAXV     = 3400;         // px/s hard cap (≈3.1 m/s)
  const ROLLFRIC = 0.16;         // per-second rolling resistance
  const SPINDECAY= 0.55;         // per-second spin decay

  /* material: restitution, contact friction (spin coupling) */
  const MATS = {
    wood:   { e: 0.30, f: 0.16 },
    metal:  { e: 0.42, f: 0.08 },
    rubber: { e: 0.78, f: 0.26 },
    rubberHard: { e: 0.60, f: 0.22 },
    target: { e: 0.46, f: 0.10 },
    flipper:{ e: 0.55, f: 0.30 },
    plastic:{ e: 0.38, f: 0.10 },
  };

  /* ---------- ball ---------- */
  const ball = {
    x: 0, y: 0, vx: 0, vy: 0, w: 0, r: BALL_R,
    px: 0, py: 0,           // previous (for render interpolation)
    active: false,           // in play (false: in trough/saucer/being served)
    held: false,             // captured by saucer / plunger seat
    lowTime: 0,              // seconds spent nearly stationary (stuck detect)
  };

  /* ---------- colliders ----------
     seg : capsule {t:'seg', ax,ay,bx,by, r, mat, id?, off?}
     circ: {t:'circ', x,y, r, mat, id?, off?}
     id → switch / device hook, off → collision disabled (dropped target)   */
  let segs = [], circs = [];
  function clear(){ segs = []; circs = []; }
  function addSeg(ax,ay,bx,by,r,mat,id){ const s={t:'seg',ax,ay,bx,by,r,mat:mat||'wood',id:id||null,off:false}; segs.push(s); return s; }
  function addCirc(x,y,r,mat,id){ const c={t:'circ',x,y,r,mat:mat||'wood',id:id||null,off:false}; circs.push(c); return c; }

  /* ---------- flippers ----------
     {pivot, len, rest, end, ang, av, on, r}  — rest/end absolute radians.
     Left-style flipper sweeps rest→end counterclockwise (negative dir in
     screen coords means upward); handled generically via sign.            */
  const flippers = [];
  function addFlipper(px,py,len,rest,end,id){
    const f = { px,py,len,rest,end, ang:rest, av:0, on:false, r:11.5, id,
                maxAV: 56, accel: 1500, retAV: 26 };
    flippers.push(f); return f;
  }

  /* events emitted during a step: {type, id, x,y, speed} */
  let events = [];

  /* ---------- swept collision helpers ----------
     Returns earliest time of impact t∈[0,dt] of moving point (ball center,
     inflated radii) or -1. Out params via shared object to avoid GC.      */
  const hit = { t: 0, nx: 0, ny: 0, pen: 0, obj: null };
  let toiPen = 0;

  function toiCircle(px,py,vx,vy, cx,cy, R){
    // |p + v t - c|² = R²
    const dx = px-cx, dy = py-cy;
    const a = vx*vx + vy*vy;
    const b = 2*(dx*vx + dy*vy);
    const c = dx*dx + dy*dy - R*R;
    toiPen = 0;
    if (c < 0) {                      // already inside: contact now if approaching
      const d = Math.sqrt(dx*dx+dy*dy) || 1e-6;
      if ((dx*vx+dy*vy)/d < 1){ toiPen = R-d; return 0; } // resolve overlap now
      return -1;
    }
    if (a < 1e-9) return -1;
    const disc = b*b - 4*a*c;
    if (disc < 0) return -1;
    const t = (-b - Math.sqrt(disc)) / (2*a);
    return t >= 0 ? t : -1;
  }

  function sweepSeg(px,py,vx,vy,rad,S,dt){
    // capsule = segment inflated by S.r ; total R = S.r + rad
    const R = S.r + rad;
    const ex = S.bx - S.ax, ey = S.by - S.ay;
    const L = Math.hypot(ex,ey) || 1e-6;
    const ux = ex/L, uy = ey/L;          // along segment
    let nx = -uy, ny = ux;               // unit normal
    // signed dist of ball to infinite line
    const relx = px - S.ax, rely = py - S.ay;
    let d0 = relx*nx + rely*ny;
    if (d0 < 0){ nx=-nx; ny=-ny; d0=-d0; }  // normal toward ball
    const dv = vx*nx + vy*ny;            // closing speed along normal (negative = approaching)
    let best = -1, bnx=0, bny=0, bpen=0;
    if (d0 >= R){
      if (dv < -1e-9){
        const t = (d0 - R) / (-dv);
        if (t <= dt){
          const s = (relx + vx*t)*ux + (rely + vy*t)*uy;
          if (s >= 0 && s <= L){ best = t; bnx = nx; bny = ny; }
        }
      }
    } else {
      // already within slab of the line: check segment span & resolve now
      const s = relx*ux + rely*uy;
      if (s >= 0 && s <= L && dv < 1){ best = 0; bnx = nx; bny = ny; bpen = R-d0; }
    }
    // endpoints
    for (let e = 0; e < 2; e++){
      const cx = e ? S.bx : S.ax, cy = e ? S.by : S.ay;
      const t = toiCircle(px,py,vx,vy,cx,cy,R);
      if (t >= 0 && t <= dt && (best < 0 || t < best)){
        const hx = px+vx*t-cx, hy = py+vy*t-cy;
        const hl = Math.hypot(hx,hy)||1e-6;
        best = t; bnx = hx/hl; bny = hy/hl; bpen = toiPen;
      }
    }
    if (best >= 0){ hit.t = best; hit.nx = bnx; hit.ny = bny; hit.pen = bpen; return true; }
    return false;
  }

  function sweepCirc(px,py,vx,vy,rad,C,dt){
    const t = toiCircle(px,py,vx,vy,C.x,C.y,C.r+rad);
    if (t >= 0 && t <= dt){
      const hx = px+vx*t-C.x, hy = py+vy*t-C.y;
      const hl = Math.hypot(hx,hy)||1e-6;
      hit.t = t; hit.nx = hx/hl; hit.ny = hy/hl; hit.pen = toiPen;
      return true;
    }
    return false;
  }

  /* closest point on flipper capsule axis to p */
  function flipperContact(f, px,py){
    const tx = f.px + Math.cos(f.ang)*f.len, ty = f.py + Math.sin(f.ang)*f.len;
    const ex = tx-f.px, ey = ty-f.py;
    const L2 = ex*ex+ey*ey;
    let s = ((px-f.px)*ex + (py-f.py)*ey) / L2;
    s = s<0?0:(s>1?1:s);
    return { cx: f.px + ex*s, cy: f.py + ey*s, s, tx, ty };
  }

  /* ---------- impact response ---------- */
  function bounce(nx,ny, mat, svx,svy, objId, speedScaleE){
    const m = MATS[mat] || MATS.wood;
    // relative velocity vs (possibly moving) surface
    const rvx = ball.vx - (svx||0), rvy = ball.vy - (svy||0);
    const vn = rvx*nx + rvy*ny;
    if (vn >= 0) return 0;
    const tx = -ny, ty = nx;
    let vt = rvx*tx + rvy*ty;
    // restitution fades at low speed to kill jitter
    let e = m.e * (speedScaleE !== undefined ? speedScaleE : 1);
    const avn = -vn;
    if (avn < 90) e *= avn/90;
    // spin/friction: slip = vt - ω r
    const slip = vt - ball.w * ball.r;
    const dvt = -m.f * slip;
    vt += dvt;
    ball.w += -2.5 * dvt / ball.r * 0.55;     // partial spin transfer (2D approx)
    const vnNew = -e * vn;
    ball.vx = (svx||0) + nx*vnNew + tx*vt;
    ball.vy = (svy||0) + ny*vnNew + ty*vt;
    return avn;
  }

  /* ---------- step ---------- */
  /* devices/zones handled by table+game via callbacks set here */
  const cb = {
    zones: null,        // fn(ball, dt) — rollovers, saucer, drain, kickers
    preStep: null,      // fn(dt) — plunger etc.
  };

  function stepFlippers(dt){
    for (const f of flippers){
      const dir = Math.sign(f.end - f.rest) || 1;
      if (f.on){
        f.av += dir * f.accel * dt;
        if (Math.abs(f.av) > f.maxAV) f.av = dir * f.maxAV;
        f.ang += f.av * dt;
        if ((dir>0 && f.ang >= f.end) || (dir<0 && f.ang <= f.end)){ f.ang = f.end; f.av = 0; }
      } else {
        f.av = -dir * f.retAV;
        f.ang += f.av * dt;
        if ((dir>0 && f.ang <= f.rest) || (dir<0 && f.ang >= f.rest)){ f.ang = f.rest; f.av = 0; }
      }
    }
  }

  function collideFlippers(){
    // discrete vs current pose, with surface velocity; called every micro-step
    for (const f of flippers){
      const c = flipperContact(f, ball.x, ball.y);
      const dx = ball.x - c.cx, dy = ball.y - c.cy;
      const d = Math.hypot(dx,dy);
      const R = f.r + ball.r;
      if (d < R){
        const nx = d>1e-6 ? dx/d : 0, ny = d>1e-6 ? dy/d : -1;
        // surface velocity at contact = ω × (contact - pivot)
        const rx = c.cx - f.px, ry = c.cy - f.py;
        const svx = -f.av * ry, svy = f.av * rx;
        // push out
        ball.x = c.cx + nx*R; ball.y = c.cy + ny*R;
        const sp = bounce(nx,ny,'flipper', svx,svy, f.id);
        if (sp > 60) events.push({type:'flipperHit', id:f.id, x:ball.x, y:ball.y, speed:sp});
      }
    }
  }

  function microStep(dt){
    if (!ball.active || ball.held) { stepFlippers(dt); return; }

    // forces
    ball.vy += GRAV * dt;
    // rolling resistance + spin decay + faint magnus curl
    const fr = 1 - ROLLFRIC*dt;
    ball.vx *= fr; ball.vy *= fr;
    ball.w  *= 1 - SPINDECAY*dt;
    ball.vx += -ball.w * ball.vy * 0.00004;
    ball.vy +=  ball.w * ball.vx * 0.00004;

    let sp2 = ball.vx*ball.vx + ball.vy*ball.vy;
    if (sp2 > MAXV*MAXV){ const k = MAXV/Math.sqrt(sp2); ball.vx*=k; ball.vy*=k; }

    stepFlippers(dt);

    // swept move with up to 5 impacts
    let rem = dt;
    for (let iter = 0; iter < 5 && rem > 1e-7; iter++){
      let bt = rem, bo = null, bnx = 0, bny = 0, bpen = 0;
      for (let i = 0; i < segs.length; i++){
        const S = segs[i]; if (S.off) continue;
        if (S.pass && (ball.vx*S.pass.x + ball.vy*S.pass.y) > 0) continue;  // one-way gate
        if (sweepSeg(ball.x,ball.y,ball.vx,ball.vy,ball.r,S,rem) && hit.t < bt){
          bt = hit.t; bnx = hit.nx; bny = hit.ny; bpen = hit.pen; bo = S;
        }
      }
      for (let i = 0; i < circs.length; i++){
        const C = circs[i]; if (C.off) continue;
        if (sweepCirc(ball.x,ball.y,ball.vx,ball.vy,ball.r,C,rem) && hit.t < bt){
          bt = hit.t; bnx = hit.nx; bny = hit.ny; bpen = hit.pen; bo = C;
        }
      }
      ball.x += ball.vx * bt; ball.y += ball.vy * bt;
      rem -= bt;
      if (!bo) break;
      const sp = bounce(bnx,bny, bo.mat, 0,0, bo.id);
      if (bo.id) events.push({type:'hit', id:bo.id, x:ball.x, y:ball.y, speed:sp, nx:bnx, ny:bny});
      // separate: resolve any standing penetration plus a hair to avoid re-hit
      const push = Math.min(bpen, 2) + 0.05;
      ball.x += bnx*push; ball.y += bny*push;
    }

    collideFlippers();

    if (cb.zones) cb.zones(ball, dt);

    // NaN guard (should never trip; keeps a bad frame from killing the game)
    if (!isFinite(ball.x) || !isFinite(ball.y) || !isFinite(ball.vx) || !isFinite(ball.vy)){
      events.push({type:'nan'});
      ball.x = 280; ball.y = 600; ball.vx = 0; ball.vy = 0; ball.w = 0;
    }
  }

  function step(){
    // micro-step at 1/960 while any flipper is energized/moving for clean
    // flipper contact; 1/240 otherwise.
    let moving = false;
    for (const f of flippers) if (f.on || Math.abs(f.av) > 0.5) { moving = true; break; }
    ball.px = ball.x; ball.py = ball.y;
    if (cb.preStep) cb.preStep(DT);
    if (moving){ const h = DT/4; microStep(h); microStep(h); microStep(h); microStep(h); }
    else microStep(DT);

    // stuck detection (game decides what to do)
    if (ball.active && !ball.held){
      const sp = Math.hypot(ball.vx, ball.vy);
      if (sp < 6) ball.lowTime += DT; else ball.lowTime = 0;
    }
  }

  function drainEvents(){ const e = events; events = []; return e; }
  function pushEvent(e){ events.push(e); }

  return {
    DT, GRAV, BALL_R, MAXV, MATS,
    ball, segs: () => segs, circs: () => circs, flippers,
    clear, addSeg, addCirc, addFlipper,
    step, drainEvents, pushEvent, cb,
    seed, rng,
  };
})();
