/* Corner Pocket II — physics core, generation two.
   Fixed-timestep, swept circle-vs-capsule/circle collision, deterministic
   given a seed + identical inputs. All randomness must go through PHYS.rng.

   NEW over board one: N simultaneous balls with elastic ball-ball collision
   and per-ball mass/radius — this powers real MULTIBALL and the live captive
   pool balls on the Money Table. */
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
     Gravity tuned steeper than the literal 6.5° table (≈9.5° equivalent) —
     on screen a true-scale slope reads feather-light. */
  const DT       = 1/240;        // base physics step
  const GRAV     = 1750;
  const BALL_R   = 14;
  const MAXV     = 2650;         // px/s hard cap — a steel ball, not a laser
  const SPINDECAY= 0.55;         // per-second spin decay
  const DRAGV    = 2000;         // extra drag above this — must stay ABOVE the
                                 // crown-clear speed (~1950) or plunges die

  /* material: restitution, contact friction (spin coupling) */
  const MATS = {
    wood:   { e: 0.26, f: 0.16 },
    metal:  { e: 0.34, f: 0.08 },
    rubber: { e: 0.62, f: 0.26 },
    rubberHard: { e: 0.50, f: 0.22 },
    cushion:{ e: 0.72, f: 0.20 },     // billiard rail — livelier than pinball rubber
    target: { e: 0.40, f: 0.10 },
    flipper:{ e: 0.48, f: 0.30 },
    plastic:{ e: 0.32, f: 0.10 },
  };

  /* ---------- balls ----------
     type 'steel'  — the game balls (served, drain, score)
     type 'object' — captive pool balls living on the Money Table            */
  const balls = [];
  function addBall(type, r, m, num){
    const b = {
      type, r, m, num: num||0,
      x: 0, y: 0, vx: 0, vy: 0, w: 0,
      px: 0, py: 0,            // previous (for render interpolation)
      active: false,            // in play (false: in trough / swallowed)
      held: false,              // captured by lock / plunger seat / magnet
      lowTime: 0,               // seconds nearly stationary (stuck detect)
      slide: 0,                 // post-impulse sliding (kinetic > rolling friction)
      feltDrag: false,          // set per-step by table when on the Money Table
      home: {x:0,y:0},          // rack spot for object balls
    };
    balls.push(b);
    return b;
  }
  const steel  = () => balls.filter(b=>b.type==='steel');
  const liveSteel = () => balls.filter(b=>b.type==='steel' && b.active && !b.held);

  /* ---------- colliders ----------
     seg : capsule {t:'seg', ax,ay,bx,by, r, mat, id?, off?}
     circ: {t:'circ', x,y, r, mat, id?, off?}
     id → switch / device hook, off → collision disabled (dropped target)   */
  let segs = [], circs = [];
  function clear(){ segs = []; circs = []; balls.length = 0; }
  function addSeg(ax,ay,bx,by,r,mat,id){ const s={t:'seg',ax,ay,bx,by,r,mat:mat||'wood',id:id||null,off:false}; segs.push(s); return s; }
  function addCirc(x,y,r,mat,id){ const c={t:'circ',x,y,r,mat:mat||'wood',id:id||null,off:false}; circs.push(c); return c; }

  /* ---------- flippers ---------- */
  const flippers = [];
  function addFlipper(px,py,len,rest,end,id){
    const f = { px,py,len,rest,end, ang:rest, av:0, on:false,
                r:13, rTip:9.5,
                id, maxAV: 66, accel: 1900, retAV: 30 };
    flippers.push(f); return f;
  }

  /* events emitted during a step: {type, id, ball, x,y, speed} */
  let events = [];

  /* ---------- swept collision helpers ---------- */
  const hit = { t: 0, nx: 0, ny: 0, pen: 0, obj: null };
  let toiPen = 0;

  function toiCircle(px,py,vx,vy, cx,cy, R){
    const dx = px-cx, dy = py-cy;
    const a = vx*vx + vy*vy;
    const b = 2*(dx*vx + dy*vy);
    const c = dx*dx + dy*dy - R*R;
    toiPen = 0;
    if (c < 0) {
      const d = Math.sqrt(dx*dx+dy*dy) || 1e-6;
      if ((dx*vx+dy*vy)/d < 1){ toiPen = R-d; return 0; }
      return -1;
    }
    if (a < 1e-9) return -1;
    const disc = b*b - 4*a*c;
    if (disc < 0) return -1;
    const t = (-b - Math.sqrt(disc)) / (2*a);
    return t >= 0 ? t : -1;
  }

  function sweepSeg(px,py,vx,vy,rad,S,dt){
    const R = S.r + rad;
    const ex = S.bx - S.ax, ey = S.by - S.ay;
    const L = Math.hypot(ex,ey) || 1e-6;
    const ux = ex/L, uy = ey/L;
    let nx = -uy, ny = ux;
    const relx = px - S.ax, rely = py - S.ay;
    let d0 = relx*nx + rely*ny;
    if (d0 < 0){ nx=-nx; ny=-ny; d0=-d0; }
    const dv = vx*nx + vy*ny;
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
      const s = relx*ux + rely*uy;
      if (s >= 0 && s <= L && dv < 1){ best = 0; bnx = nx; bny = ny; bpen = R-d0; }
    }
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

  function flipperContact(f, px,py){
    const tx = f.px + Math.cos(f.ang)*f.len, ty = f.py + Math.sin(f.ang)*f.len;
    const ex = tx-f.px, ey = ty-f.py;
    const L2 = ex*ex+ey*ey;
    let s = ((px-f.px)*ex + (py-f.py)*ey) / L2;
    s = s<0?0:(s>1?1:s);
    return { cx: f.px + ex*s, cy: f.py + ey*s, s, tx, ty };
  }

  /* ---------- impact response (per ball) ---------- */
  function bounce(ball, nx,ny, mat, svx,svy){
    const m = MATS[mat] || MATS.wood;
    const rvx = ball.vx - (svx||0), rvy = ball.vy - (svy||0);
    const vn = rvx*nx + rvy*ny;
    if (vn >= 0) return 0;
    const tx = -ny, ty = nx;
    let vt = rvx*tx + rvy*ty;
    let e = m.e;
    const avn = -vn;
    if (avn < 90) e *= avn/90;      // restitution fades at low speed (kills jitter)
    const Jn = (1+e) * avn;
    const slip = vt - ball.w * ball.r;
    let dvt = -m.f * slip;
    const cap = 2.2 * m.f * Jn;
    if (dvt >  cap) dvt =  cap;
    else if (dvt < -cap) dvt = -cap;
    vt += dvt;
    ball.w += -2.5 * dvt / ball.r * 0.55;
    /* surface micro-imperfection: ±1.5% angular jitter on real impacts */
    if (avn > 120){
      const ja = (rng() - 0.5) * 0.05;
      const ca = Math.cos(ja), sa = Math.sin(ja);
      const jn = nx*ca - ny*sa, jny = nx*sa + ny*ca;
      const jtx = -jny, jty = jn;
      const vnNew2 = -e * vn;
      ball.vx = (svx||0) + jn*vnNew2 + jtx*vt;
      ball.vy = (svy||0) + jny*vnNew2 + jty*vt;
      return avn;
    }
    const vnNew = -e * vn;
    ball.vx = (svx||0) + nx*vnNew + tx*vt;
    ball.vy = (svy||0) + ny*vnNew + ty*vt;
    return avn;
  }

  /* ---------- ball ↔ ball ----------
     Discrete pairwise resolution (positions corrected by inverse mass,
     restitution 0.93 — the pool-ball click). Two passes per micro-step keep
     rack stacks stable. Worst-case closing speed per 1/240 step is ~22px vs
     ≥26px combined radii, so pairs cannot tunnel through each other.       */
  function collideBalls(){
    for (let pass = 0; pass < 2; pass++){
      for (let i = 0; i < balls.length; i++){
        const A = balls[i]; if (!A.active || A.held) continue;
        for (let j = i+1; j < balls.length; j++){
          const B = balls[j]; if (!B.active || B.held) continue;
          const dx = B.x-A.x, dy = B.y-A.y;
          const rr = A.r + B.r;
          const d2 = dx*dx + dy*dy;
          if (d2 >= rr*rr) continue;
          const d = Math.sqrt(d2) || 1e-6;
          const nx = dx/d, ny = dy/d;
          const invA = 1/A.m, invB = 1/B.m, invS = invA+invB;
          const pen = rr - d + 0.05;
          A.x -= nx*pen*invA/invS; A.y -= ny*pen*invA/invS;
          B.x += nx*pen*invB/invS; B.y += ny*pen*invB/invS;
          const rvx = B.vx-A.vx, rvy = B.vy-A.vy;
          const vn = rvx*nx + rvy*ny;
          if (vn < 0){
            const e = 0.93;
            const jimp = -(1+e)*vn/invS;
            A.vx -= jimp*invA*nx; A.vy -= jimp*invA*ny;
            B.vx += jimp*invB*nx; B.vy += jimp*invB*ny;
            /* light tangential coupling — throw/english */
            const tx = -ny, ty = nx;
            const vt = rvx*tx + rvy*ty + (A.w*A.r + B.w*B.r)*0.3;
            const jt = -vt*0.10/invS;
            A.vx -= jt*invA*tx; A.vy -= jt*invA*ty;
            B.vx += jt*invB*tx; B.vy += jt*invB*ty;
            A.w *= 0.7; B.w *= 0.7;
            if (pass===0 && -vn > 55)
              events.push({type:'click', x:(A.x+B.x)/2, y:(A.y+B.y)/2, speed:-vn,
                           obj: (A.type==='object'||B.type==='object')});
            if (-vn > 380){ A.slide = Math.max(A.slide,0.16); B.slide = Math.max(B.slide,0.16); }
          }
        }
      }
    }
  }

  /* ---------- step ---------- */
  const cb = {
    zones: null,        // fn(ball, dt) — rollovers, pockets, drain, magnet
    preStep: null,      // fn(dt) — plunger, lock kickouts etc.
  };

  function stepFlippers(dt){
    for (const f of flippers){
      const dir = Math.sign(f.end - f.rest) || 1;
      if (f._rc > 0) f._rc -= dt;
      if (f.on){
        f.av += dir * f.accel * dt;
        if (Math.abs(f.av) > f.maxAV) f.av = dir * f.maxAV;
        f.ang += f.av * dt;
        if ((dir>0 && f.ang >= f.end) || (dir<0 && f.ang <= f.end)){ f.ang = f.end; f.av = 0; }
        if ((dir>0 && f.ang < f.rest) || (dir<0 && f.ang > f.rest)){ f.ang = f.rest; f.av = 0; }
      } else {
        f.av = -dir * f.retAV;
        f.ang += f.av * dt;
        if ((dir>0 && f.ang <= f.rest) || (dir<0 && f.ang >= f.rest)){ f.ang = f.rest; f.av = 0; }
      }
    }
  }

  function collideFlippers(){
    for (const f of flippers){
      for (const ball of balls){
        if (!ball.active || ball.held) continue;
        const c = flipperContact(f, ball.x, ball.y);
        const dx = ball.x - c.cx, dy = ball.y - c.cy;
        const d = Math.hypot(dx,dy);
        const R = f.r + (f.rTip - f.r)*c.s + ball.r;
        if (d < R){
          const nx = d>1e-6 ? dx/d : 0, ny = d>1e-6 ? dy/d : -1;
          const rx = c.cx - f.px, ry = c.cy - f.py;
          const svx = -f.av * ry, svy = f.av * rx;
          ball.x = c.cx + nx*R; ball.y = c.cy + ny*R;
          const sp = bounce(ball, nx,ny,'flipper', svx,svy);
          const ex2 = ball.vx*ball.vx + ball.vy*ball.vy;
          const lim = MAXV*1.1;
          if (ex2 > lim*lim){ const k = lim/Math.sqrt(ex2); ball.vx*=k; ball.vy*=k; }
          if (sp > 60){
            if (!f._rc || f._rc <= 0){
              const dir = Math.sign(f.end - f.rest) || 1;
              let tau = (ry*nx - rx*ny) * sp / f.len * 0.012;
              if (tau * dir > 0) tau = 0;
              tau = Math.max(-16, Math.min(16, tau));
              f.av += tau;
              f._rc = 0.08;
            }
            if (sp > 500) ball.slide = Math.max(ball.slide, Math.min(0.3, sp/6000));
            events.push({type:'flipperHit', id:f.id, ball, x:ball.x, y:ball.y, speed:sp});
          }
        }
      }
    }
  }

  function moveBall(ball, dt){
    // forces
    ball.vy += GRAV * dt;
    {
      const sp = Math.hypot(ball.vx, ball.vy);
      if (sp > 1e-3){
        let dec = ball.type==='object' ? 96 : 70;   // pool balls sit down sooner
        if (ball.feltDrag) dec += 120;              // nap of the Money Table felt
        if (ball.slide > 0){
          dec += 560 * Math.min(1, ball.slide / 0.25);
          ball.slide -= dt;
        }
        const k = Math.max(0, 1 - (dec*dt)/sp - 0.06*dt);
        ball.vx *= k; ball.vy *= k;
      } else if (ball.slide > 0) ball.slide -= dt;
    }
    ball.w  *= 1 - SPINDECAY*dt;
    ball.vx += -ball.w * ball.vy * 0.00002;
    ball.vy +=  ball.w * ball.vx * 0.00002;

    let sp2 = ball.vx*ball.vx + ball.vy*ball.vy;
    if (sp2 > DRAGV*DRAGV){
      const sp = Math.sqrt(sp2);
      const k = 1 - Math.min(0.5, (sp-DRAGV)*0.00055) * dt * 18;
      ball.vx *= k; ball.vy *= k;
      sp2 = ball.vx*ball.vx + ball.vy*ball.vy;
    }
    if (sp2 > MAXV*MAXV){ const k = MAXV/Math.sqrt(sp2); ball.vx*=k; ball.vy*=k; }

    // swept move with up to 5 impacts
    let rem = dt;
    for (let iter = 0; iter < 5 && rem > 1e-7; iter++){
      let bt = rem, bo = null, bnx = 0, bny = 0, bpen = 0;
      for (let i = 0; i < segs.length; i++){
        const S = segs[i]; if (S.off) continue;
        if (S.pass && (ball.vx*S.pass.x + ball.vy*S.pass.y) > 0) continue;
        if (S.steelOnly && ball.type !== 'steel') continue;
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
      const sp = bounce(ball, bnx,bny, bo.mat, 0,0);
      if (bo.id) events.push({type:'hit', id:bo.id, ball, x:ball.x, y:ball.y, speed:sp, nx:bnx, ny:bny});
      const push = Math.min(bpen, 2) + 0.05;
      ball.x += bnx*push; ball.y += bny*push;
    }
  }

  function microStep(dt){
    stepFlippers(dt);
    let any = false;
    for (const ball of balls){
      if (!ball.active || ball.held) continue;
      any = true;
      moveBall(ball, dt);
    }
    if (!any){ if (cb.zones) for (const b of balls) if (b.active) cb.zones(b, dt); return; }

    collideBalls();
    collideFlippers();

    if (cb.zones) for (const b of balls) if (b.active) cb.zones(b, dt);

    // NaN guard
    for (const ball of balls){
      if (!isFinite(ball.x) || !isFinite(ball.y) || !isFinite(ball.vx) || !isFinite(ball.vy)){
        events.push({type:'nan'});
        ball.x = 280; ball.y = 600; ball.vx = 0; ball.vy = 0; ball.w = 0;
      }
    }
  }

  function step(){
    let moving = false;
    for (const f of flippers) if (f.on || Math.abs(f.av) > 0.5) { moving = true; break; }
    for (const b of balls){ b.px = b.x; b.py = b.y; }
    if (cb.preStep) cb.preStep(DT);
    if (moving){ const h = DT/4; microStep(h); microStep(h); microStep(h); microStep(h); }
    else { const h = DT/2; microStep(h); microStep(h); }   // 480Hz base: multiball pair stability

    // stuck detection (game decides what to do)
    for (const b of balls){
      if (b.active && !b.held){
        const sp = Math.hypot(b.vx, b.vy);
        if (sp < 6) b.lowTime += DT; else b.lowTime = 0;
      }
    }
  }

  function drainEvents(){ const e = events; events = []; return e; }
  function pushEvent(e){ events.push(e); }

  return {
    DT, GRAV, BALL_R, MAXV, MATS,
    balls, steel, liveSteel,
    segs: () => segs, circs: () => circs, flippers,
    clear, addSeg, addCirc, addFlipper, addBall,
    step, drainEvents, pushEvent, cb,
    seed, rng,
  };
})();
