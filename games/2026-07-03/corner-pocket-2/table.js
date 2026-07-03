/* Corner Pocket II: Back Room — table geometry & devices.
   Playfield logical space: 560 × 1160, y down. Slope is baked into PHYS gravity.

   Layout (original — the money game):
   · THE MONEY TABLE: a live mini pool table upper-left — 3 captive object
     balls, 2 real corner pockets, cushion rails, a 40px mouth underneath.
     Knock the object balls in with the pinball. Scratch and you pay.
   · BACK ROOM upper right: a kickout hole behind a swinging-door drop
     target — wager awards, 2 physical ball locks, 3-ball multiball
   · HUSTLE 6-bank drop targets mid-right, CHALK standups behind them
   · left orbit with a SPINNER (stakes) — full loops advance bonus X
   · Massé MAGNET save above the drain, KICKBACK in the left outlane
   · 3 dice pop bumpers, A/B top lanes + SIDE BET mystery in the crown */
'use strict';

const TABLE = (() => {
  const W = 560, H = 1160;

  /* device registries */
  const drops = [], chalk = [], bumpers = [], slings = [];
  const zones = [];
  const pockets = [];             // money-table pockets
  let door = null;                // back-room swinging door (drop target)
  let lockHole = null;            // back-room kickout hole (holds up to 2)
  let gateSeg = null;
  let FL = null, FR = null, FU = null;
  const lamps = {};               // id → {x,y,on,label}
  /* spinner lives in the INNER LOOP slot between the orbit guide and the
     Money Table's left rail — ripped by up-shots, plunder from bumper
     spills, and everything the funnel feeds through */
  const spinner = { x:82, y:480, ang:0, vel:0, accum:0 };
  const magnet  = { x:280, y:972, r:26, lit:false, holding:null, t:0, spark:0 };
  const kicker  = { x:38, y:1008, armed:false, anim:0, postT:0 };
  let kickPost = null;
  const FELT    = { x0:106, y0:388, x1:280, y1:610 };
  const RACK    = [ {x:138,y:585}, {x:172,y:585}, {x:204,y:585} ];

  let objectBalls = [], steelBalls = [];

  function lamp(id,x,y,label,color){ lamps[id] = {x,y,on:false,label:label||'',color:color||'#63e0b8'}; }

  function arc(cx,cy,R,a0,a1,n,r,mat,id){
    const out = [];
    for (let i=0;i<n;i++){
      const t0 = a0 + (a1-a0)*i/n, t1 = a0 + (a1-a0)*(i+1)/n;
      out.push(PHYS.addSeg(cx+R*Math.cos(t0), cy-R*Math.sin(t0),
                           cx+R*Math.cos(t1), cy-R*Math.sin(t1), r, mat, id));
    }
    return out;
  }

  function zone(id,x,y,r){ zones.push({id,x,y,r,cool:0}); }

  /* ---------------- build ---------------- */
  function build(){
    PHYS.clear();
    const S = PHYS.addSeg, C = PHYS.addCirc;

    /* outer shell (proven board-one hull) */
    S(16,300, 16,700, 6, 'metal');                     // left wall
    S(16,700, 16,860, 6, 'rubber');                    //   …cushion section
    S(16,860, 16,1010, 6, 'metal');
    arc(280,300, 264, Math.PI, 0, 30, 6, 'metal');     // outer crown
    S(544,300, 544,1098, 6, 'metal');                  // shooter outer wall

    /* inner arch (two pieces, gap = top lanes) */
    arc(280,300, 222, Math.PI, Math.PI*116/180, 10, 5, 'metal');
    arc(280,300, 222, Math.PI*64/180, 0, 10, 5, 'metal');

    /* shooter lane inner wall + floor; plunger seat at (522,1075) */
    S(502,300, 502,1108, 5, 'metal');
    S(504,1102, 544,1096, 5, 'metal');

    /* one-way gate at the crown's right gap edge (launch passes ccw) */
    gateSeg = S(384.2,104, 403.9,66.9, 4, 'metal', 'gate');
    gateSeg.pass = { x:-0.88, y:-0.47 };

    /* top lanes: single centre guide (A | B), SIDE BET rollover in the crown */
    S(280,72, 280,160, 6, 'plastic');
    zone('zoneA', 228,140, 17);
    zone('zoneB', 332,140, 17);
    zone('sidebet', 280,48, 18);

    /* dice pop bumpers */
    [[190,255],[310,240],[250,350]].forEach(([x,y],i)=>{
      const c = C(x,y, 28, 'rubberHard', 'bump'+i);
      bumpers.push({circ:c, x,y, cool:0, pip: i+1});
    });

    /* ---- left orbit: spinner lane, loops the crown ---- */
    S(58,300, 58,560, 5, 'metal');            // inner guide
    S(58,560, 80,660, 5, 'metal');            // catch funnel (board-one geometry family)
    S(80,660, 110,745, 5, 'metal');
    /* the slot right of the guide is the INNER LOOP: up-shots (and bumper
       spills) thread it, rip the spinner at (82,480), and deflect off the
       inner arch into the top lanes. The funnel feeds near-misses in and
       carries descending balls safely out at (110,745). */

    /* ---- THE MONEY TABLE (upper-left mini pool table) ----
       Full cushion rails; the only way in or out is the 40px mouth in the
       floor at bottom-right. Pockets are capture circles snug in the two top
       corners — bank the object balls UP off the rails to sink them. */
    /* top rail leans 8° (left end high): a ball fired up the mouth rebounds
       with leftward drift and comes down ON the rack — clean shots break.
       Balls banked into the rail also roll right toward the far pocket. */
    S(106,385, 280,410, 5, 'cushion');
    S(106,385, 106,560, 5, 'cushion');        // left rail
    /* bottom-left corner is CHAMFERED: balls riding up the funnel into the
       inner-loop slot sweep past it instead of smacking a corner post */
    S(106,560, 130,610, 5, 'cushion');
    /* floor rail ends at 214: with 5px caps + the 14px ball radius that
       leaves a true 28px entry window (214→280) under the right rail */
    S(130,610, 214,610, 5, 'cushion');
    S(280,410, 280,606, 5, 'cushion');        // right rail
    pockets.push({ id:'pkA', x:122, y:404 });
    pockets.push({ id:'pkB', x:264, y:424 });
    lamp('pkAL', 126,442, '$');
    lamp('pkBL', 262,452, '$');

    /* ---- BACK ROOM (upper right): swinging door + kickout hole ----
       Same proven pocket hull as board one's corner pocket. */
    S(432,300, 444,240, 6, 'plastic');           // left wall
    S(444,240, 488,244, 6, 'plastic');           // top
    S(488,244, 482,296, 6, 'plastic');           // right wall
    S(489,222, 443,238, 5, 'plastic');           // roof seal
    door = { seg: S(438,307, 478,295, 4, 'target', 'door'), up:true, cx:458, cy:301 };
    lockHole = { x:461, y:266, r:15, held:[], cool:0,
                 slots:[{x:455,y:272},{x:472,y:256},{x:461,y:266}] };
    lamp('lockL', 430,386, 'LOCK');
    lamp('jackL', 458,340, 'JACKPOT', '#ffd257');

    /* ---- upper flipper: pivot left, tip right — fires up the back-room lane ---- */
    S(330,436, 344,462, 6, 'metal');             // mount stub
    FU = PHYS.addFlipper(348,470, 58, 0.42, -0.50, 'FU');
    FU.maxAV = 58; FU.accel = 1600; FU.rTip = 9;

    /* ---- HUSTLE 6-bank drop targets + CHALK standups behind ---- */
    {
      const Lx=335, Ly=648, Rx=485, Ry=592;
      const dx=Rx-Lx, dy=Ry-Ly, len=Math.hypot(dx,dy);
      const ux=dx/len, uy=dy/len;              // along the row (up-right)
      const nux=uy, nuy=-ux;                   // up-left normal, into the box
      const sp = len/6;
      /* right side cap + end posts; left side is a ONE-WAY spill gate */
      S(Rx,Ry, Rx+nux*42, Ry+nuy*42, 5, 'metal');
      const lg = S(307,595, 325,644, 4, 'metal', 'boxgate');
      lg.pass = { x:-0.55, y:0.835 };
      C(329,650, 9, 'rubber'); C(493,589, 9, 'rubber');
      const HL = 'HUSTLE';
      for (let i=0;i<6;i++){
        const s=(i+0.5)*sp, cx=Lx+ux*s, cy=Ly+uy*s;
        const seg = S(cx-ux*10, cy-uy*10, cx+ux*10, cy+uy*10, 4, 'target', 'h'+i);
        drops.push({seg, up:true, cx, cy, ux, uy, letter:HL[i]});
        const bcx=Lx+ux*s+nux*40, bcy=Ly+uy*s+nuy*40;
        if (i<5){
          const st = S(bcx-ux*15.4, bcy-uy*15.4, bcx+ux*15.4, bcy+uy*15.4, 4, 'target', 'ch'+i);
          chalk.push({seg:st, cx:bcx, cy:bcy});
          lamp('ch'+i, bcx-nux*72, bcy-nuy*72, 'CHALK'[i], '#8fd0ff');
        } else {
          S(bcx-ux*15.4, bcy-uy*15.4, bcx+ux*15.4, bcy+uy*15.4, 4, 'plastic');
        }
      }
    }

    /* ---- slings ---- */
    {
      const f1 = S(120,886, 166,946, 5, 'rubber', 'slingL');
      S(114,892, 114,934, 5, 'plastic'); S(104,940, 162,956, 5, 'plastic');
      const n1 = norm(60,-46);
      slings.push({seg:f1, nx:n1.x, ny:n1.y, cool:0});
      const f2 = S(398,886, 352,946, 5, 'rubber', 'slingR');
      S(403,892, 403,934, 5, 'plastic'); S(412,940, 356,956, 5, 'plastic');
      const n2 = norm(-60,-46);
      slings.push({seg:f2, nx:n2.x, ny:n2.y, cool:0});
    }

    /* ---- in/out-lane guides ---- */
    S(60,856, 60,975, 6, 'metal');
    S(60,975, 174,1006, 6, 'metal');
    S(104,880, 104,940, 6, 'metal');
    S(458,856, 458,975, 5, 'metal');
    S(458,975, 386,1006, 5, 'metal');
    S(412,880, 412,940, 5, 'metal');
    zone('zoneC', 82,930, 16);   zone('zoneD', 435,930, 16);
    zone('outL', 38,940, 17);    zone('outR', 481,940, 17);
    zone('kick', 38,1008, 17);
    /* outlane deflector posts, flush on the walls; the LEFT one drops for
       half a second when the kickback fires so the ball can ride the whole
       outlane up into the spinner lane */
    kickPost = C(33,812, 11, 'rubber');
    C(486,812, 11, 'rubber');

    /* ---- flippers + drain funnels ---- */
    FL = PHYS.addFlipper(175,1012, 90, 0.56, -0.45, 'FL');
    FR = PHYS.addFlipper(385,1012, 90, Math.PI-0.63, Math.PI+0.42, 'FR');
    S(16,1010, 192,1128, 6, 'metal');
    S(502,1010, 368,1128, 6, 'metal');

    /* lamps (inserts) */
    lamp('sb', 280,196, 'SIDE BET', '#ffd257');
    lamp('A', 228,180, 'A'); lamp('B', 332,180, 'B');
    lamp('C', 82,912, 'C');  lamp('D', 439,912, 'D');
    lamp('x2', 222,936, '2X'); lamp('x3', 252,956, '3X');
    lamp('x4', 308,956, '4X'); lamp('x5', 338,936, '5X');
    lamp('masse', 280,935, 'MASSE', '#c887ff');
    lamp('kickL', 38,972, 'KICK', '#ff5a6e');
    lamp('spinL', 82,532, 'STAKES', '#8fd0ff');
    for (let i=0;i<3;i++) lamp('mb'+i, 150+i*40, 655, String([1,5,9][i]));
    lamp('run', 190,690, 'RUN THE TABLE', '#ffd257');
    lamp('hr', 330,770, 'HIGH ROLLER', '#ff9df0');
    lamp('again', 280,1002, 'SHOOT AGAIN', '#ff5a6e');

    /* ---- balls: 3 steel (multiball pool) + 3 captive object balls ---- */
    steelBalls = []; objectBalls = [];
    for (let i=0;i<3;i++) steelBalls.push(PHYS.addBall('steel', 14, 1, 0));
    [1,5,9].forEach((n,i)=>{
      const b = PHYS.addBall('object', 12.5, 1.35, n);
      b.home = {x:RACK[i].x, y:RACK[i].y};
      objectBalls.push(b);
    });
    rackObjects(true);
  }

  function norm(x,y){ const l=Math.hypot(x,y)||1; return {x:x/l, y:y/l}; }

  /* ---------------- device ops ---------------- */
  function setDrop(d, up){ d.up = up; d.seg.off = !up; }
  function resetBank(){ drops.forEach(d=>setDrop(d,true)); }
  function resetDoor(up){ setDrop(door, up); }

  function rackObjects(instant){
    objectBalls.forEach((b)=>{
      b.active = true; b.held = false;
      b.x = b.home.x; b.y = b.home.y - (instant?0:26);
      b.px = b.x; b.py = b.y;
      b.vx = 0; b.vy = instant?0:60; b.w = 0; b.lowTime = 0;
    });
  }
  function respawnObject(b){
    b.active = true; b.held = false;
    b.x = b.home.x; b.y = b.home.y - 20; b.px=b.x; b.py=b.y;
    b.vx = 0; b.vy = 40; b.w = 0; b.lowTime = 0;
  }

  /* zone & pocket & lock & magnet & drain checks — runs per ball inside physics */
  function zonesCheck(ball, dt){
    /* zone crossings (edge-triggered per ball) */
    if (!ball._zin) ball._zin = {};
    for (const z of zones){
      const dx = ball.x-z.x, dy = ball.y-z.y;
      const inside = dx*dx+dy*dy < z.r*z.r;
      if (inside && !ball._zin[z.id] && z.cool <= 0){
        PHYS.pushEvent({type:'zone', id:z.id, ball, x:z.x, y:z.y});
        z.cool = 0.12;
      }
      ball._zin[z.id] = inside;
    }

    /* Money Table felt drag + pockets */
    ball.feltDrag = ball.x > FELT.x0 && ball.x < FELT.x1 && ball.y > FELT.y0 && ball.y < FELT.y1;
    if (ball.feltDrag && !ball.held){
      for (const pk of pockets){
        const dx = ball.x-pk.x, dy = ball.y-pk.y;
        const d2 = dx*dx+dy*dy;
        if (ball.type === 'object' && d2 < 12*12){
          ball.active = false;
          PHYS.pushEvent({type:'moneyPocket', id:pk.id, ball, x:pk.x, y:pk.y});
        } else if (ball.type === 'steel' && d2 < 9.5*9.5){
          ball.held = true; ball.x = pk.x; ball.y = pk.y; ball.vx = 0; ball.vy = 0; ball.w = 0;
          PHYS.pushEvent({type:'scratch', id:pk.id, ball, x:pk.x, y:pk.y});
        }
      }
    }

    /* back-room hole capture (steel only; slot 3 exists so the multiball-
       starting third ball is physically caught before the release) */
    if (ball.type === 'steel' && !ball.held && lockHole.cool <= 0 && lockHole.held.length < 3){
      const dx = ball.x-lockHole.x, dy = ball.y-lockHole.y;
      if (dx*dx+dy*dy < lockHole.r*lockHole.r){
        ball.held = true;
        const slot = lockHole.slots[lockHole.held.length];
        ball.x = slot.x; ball.y = slot.y; ball.vx = 0; ball.vy = 0; ball.w = 0;
        lockHole.held.push(ball);
        PHYS.pushEvent({type:'hole', ball});
      }
    }

    /* Massé magnet (steel only, descending) */
    if (magnet.lit && !magnet.holding && ball.type === 'steel' && !ball.held && ball.vy > -40){
      const dx = ball.x-magnet.x, dy = ball.y-magnet.y;
      if (dx*dx+dy*dy < magnet.r*magnet.r){
        magnet.holding = ball; magnet.t = 0;
        ball.held = true; ball.x = magnet.x; ball.y = magnet.y;
        ball.vx = 0; ball.vy = 0;
        PHYS.pushEvent({type:'magnet', ball});
      }
    }

    /* drain */
    if (ball.active && !ball.held && ball.y > 1132 && ball.x < 500){
      ball.active = false;
      PHYS.pushEvent({type:'drain', ball});
    }
  }

  /* per-step device tick (called once from game preStep) */
  function tick(dt){
    for (const z of zones) if (z.cool > 0) z.cool -= dt;
    for (const b of bumpers) if (b.cool>0) b.cool -= dt;
    for (const s of slings)  if (s.cool>0) s.cool -= dt;
    if (lockHole.cool > 0) lockHole.cool -= dt;
    if (kicker.anim > 0) kicker.anim -= dt;
    if (kicker.postT > 0){
      kicker.postT -= dt;
      if (kicker.postT <= 0 && kickPost) kickPost.off = false;
    }
    if (magnet.spark > 0) magnet.spark -= dt;

    /* spinner: balls crossing the zone spin it up; ticks emit 'spin' events */
    let inZone = null;
    for (const b of PHYS.balls){
      if (!b.active || b.held || b.type!=='steel') continue;
      const dx = b.x-spinner.x, dy = b.y-spinner.y;
      if (dx*dx+dy*dy < 20*20){ inZone = b; break; }
    }
    if (inZone){
      const want = -inZone.vy * 0.055;          // upward ball = positive spin
      if (Math.abs(want) > Math.abs(spinner.vel)) spinner.vel = want;
      inZone.vy *= 1 - 1.6*dt;                  // the spinner robs a little speed
    }
    if (Math.abs(spinner.vel) > 0.4){
      spinner.ang += spinner.vel * dt;
      const brake = 14 + Math.abs(spinner.vel)*0.55;
      const s = Math.sign(spinner.vel);
      spinner.vel -= s * brake * dt;
      if (Math.sign(spinner.vel) !== s) spinner.vel = 0;
      spinner.accum += Math.abs(spinner.vel) * dt;
      while (spinner.accum > Math.PI){
        spinner.accum -= Math.PI;
        PHYS.pushEvent({type:'spin', up: spinner.vel > 0});
      }
    }

    /* magnet hold — crackle then fling */
    if (magnet.holding){
      magnet.t += dt;
      const b = magnet.holding;
      b.x = magnet.x + (PHYS.rng()-0.5)*3;
      b.y = magnet.y + (PHYS.rng()-0.5)*3;
      if (magnet.t > 0.85){
        b.held = false;
        /* strong sideways component — a massé that drops straight back
           down the middle is no save at all */
        b.vx = (PHYS.rng() < 0.5 ? -1 : 1) * (420 + PHYS.rng()*240);
        b.vy = -(1200 + PHYS.rng()*300);
        b.slide = 0.2;
        magnet.holding = null; magnet.lit = false; magnet.spark = 0.5;
        PHYS.pushEvent({type:'magnetFling', ball:b});
      }
    }
  }

  /* back-room hole: eject the most recent ball (wager award / not locking) */
  function holeEject(){
    const b = lockHole.held.pop();
    if (!b) return null;
    lockHole.cool = 0.9;
    b.held = false;
    b.x = lockHole.x - 6; b.y = lockHole.y + 12;
    b.vx = -160 + PHYS.rng()*40; b.vy = 340; b.w = 0;
    return b;
  }
  /* multiball: kick everything out with stagger handled by game */
  function holeRelease(){
    const out = [];
    while (lockHole.held.length){
      const b = lockHole.held.pop();
      b.held = false;
      b.x = lockHole.x - 6; b.y = lockHole.y + 12 + out.length*4;
      b.vx = -180 - out.length*60 + PHYS.rng()*40; b.vy = 320; b.w = 0;
      out.push(b);
    }
    lockHole.cool = 1.2;
    return out;
  }

  function kickbackFire(ball){
    kicker.anim = 0.5;
    if (kickPost){ kickPost.off = true; kicker.postT = 0.55; }
    ball.x = kicker.x;                         // centre it in the channel
    ball.vx = 0;
    ball.vy = -1560;
    ball.slide = 0.2;
  }

  return {
    W,H, build, lamps, zones, pockets, spinner, magnet, kicker,
    FELT, RACK,
    drops, chalk, bumpers, slings,
    get door(){ return door; }, get lockHole(){ return lockHole; },
    get objectBalls(){ return objectBalls; }, get steelBalls(){ return steelBalls; },
    get FL(){ return FL; }, get FR(){ return FR; }, get FU(){ return FU; },
    setDrop, resetBank, resetDoor, rackObjects, respawnObject,
    zonesCheck, tick, holeEject, holeRelease, kickbackFire,
    PLUNGE: { x:522, y:1075 },
  };
})();
