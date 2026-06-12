/* Eight Ball Deluxe — table geometry & devices.
   Playfield logical space: 560 × 1160, y down. Slope is baked into PHYS gravity.

   Layout (faithful to Bally 1981):
   · 7-bank pool-ball drop targets mid-left, DELUXE standups behind them
   · lone 8-ball drop guarding the bonus-collect saucer, up a right-center
     channel aimed from the LEFT flipper
   · 4 in-line drops on the left, shot from the upper-right flipper
   · left orbit = Bank Shot lane; A/B top lanes + 25K arrow; C/D inlanes
   · 3 pop bumpers, two slings, three flippers, plunger w/ one-way crown gate */
'use strict';

const TABLE = (() => {
  const W = 560, H = 1160;

  /* device registries */
  const drops7 = [], deluxe = [], inline = [], bumpers = [], slings = [];
  const zones = [];
  let lone = null, saucer = null, gateSeg = null, bankTop = null;
  let FL = null, FR = null, FU = null;
  const lamps = {};          // id → {x,y,on,label}
  const posts = [];          // decorative+collide rubber posts (circ refs)

  function lamp(id,x,y,label,color){ lamps[id] = {x,y,on:false,label:label||'',color:color||'#ffb347'}; }

  function arc(cx,cy,R,a0,a1,n,r,mat,id){
    // a0→a1 radians (standard math angles, y flipped for screen)
    const out = [];
    for (let i=0;i<n;i++){
      const t0 = a0 + (a1-a0)*i/n, t1 = a0 + (a1-a0)*(i+1)/n;
      out.push(PHYS.addSeg(cx+R*Math.cos(t0), cy-R*Math.sin(t0),
                           cx+R*Math.cos(t1), cy-R*Math.sin(t1), r, mat, id));
    }
    return out;
  }

  function zone(id,x,y,r){ zones.push({id,x,y,r,inside:false,cool:0}); }

  /* ---------------- build ---------------- */
  function build(){
    PHYS.clear();
    const S = PHYS.addSeg, C = PHYS.addCirc;

    /* outer shell */
    S(16,300, 16,1010, 6, 'metal');                    // left wall
    arc(280,300, 264, Math.PI, 0, 16, 6, 'metal');     // outer crown
    S(544,300, 544,1098, 6, 'metal');                  // shooter outer wall

    /* inner arch (two pieces, gap = top lanes); R sized so the crown channel
       and shooter lane clear the 28px ball with margin */
    arc(280,300, 222, Math.PI, Math.PI*116/180, 6, 5, 'metal');   // left piece → (58,300)
    arc(280,300, 222, Math.PI*64/180, 0, 6, 5, 'metal');          // right piece → (502,300)

    /* shooter lane inner wall + floor; plunger seat at (522,1075) */
    S(502,300, 502,1108, 5, 'metal');
    S(504,1102, 544,1096, 5, 'metal');

    /* one-way gate at the crown's right gap edge (launch passes ccw);
       a blocked or stalled ball drops into the top lanes, never strands */
    gateSeg = S(384.2,104, 403.9,66.9, 4, 'metal', 'gate');
    gateSeg.pass = { x:-0.88, y:-0.47 };

    /* top lane guides + 25K arrow standup */
    S(244,72, 244,160, 6, 'plastic');
    S(316,72, 316,160, 6, 'plastic');
    C(280,128, 10, 'rubberHard', 'arrow');
    zone('zoneA', 213,140, 16);
    zone('zoneB', 347,140, 16);

    /* pop bumpers (body circle; kick handled on hit event) */
    [[185,260],[300,240],[240,350]].forEach(([x,y],i)=>{
      const c = C(x,y, 28, 'rubberHard', 'bump'+i);
      bumpers.push({circ:c, x,y, cool:0});
    });

    /* ---- left orbit (Bank Shot lane) ---- */
    S(58,300, 58,800, 5, 'metal');            // inner guide (joins arch at top)
    S(58,800, 86,852, 6, 'rubberHard');       // mouth deflector
    zone('bank', 37,560, 20);

    /* ---- in-line drop lane: near-vertical stack at left-center (real EBD),
       shot from the lower-left flipper; Bank Shot standup at the dead end ---- */
    {
      const ex=170, ey=584;                          // entrance (bottom)
      const ux=-0.244, uy=-0.970;                    // axis leans 14° LEFT going up
      const px=0.970, py=-0.244;                     // perpendicular
      const L=164;
      S(ex-px*28, ey-py*28, ex-px*28+ux*L, ey-py*28+uy*L, 6, 'plastic');  // left wall
      S(ex+px*28, ey+py*28, ex+px*28+ux*L, ey+py*28+uy*L, 6, 'plastic');  // right wall
      S(ex-px*28, ey-py*28, ex-px*28-16, ey-py*28+30, 6, 'plastic');      // mouth flare L
      S(ex+px*28, ey+py*28, 216.4,600.3, 6, 'plastic');                   // mouth flare R → seals against bank backwall end
      C(217,592, 10, 'rubber');                                           // crown post sheds balls off the junction
      const bx=ex+ux*L, by=ey+uy*L;
      bankTop = { seg: S(bx-px*24, by-py*24, bx+px*24, by+py*24, 4, 'target', 'bankT'),
                  cx:bx, cy:by };
      for (let i=0;i<4;i++){
        const s = (0.20 + i*0.22) * L;
        const cx = ex+ux*s, cy = ey+uy*s;
        const seg = S(cx-px*23, cy-py*23, cx+px*23, cy+py*23, 4, 'target', 'inl'+i);
        inline.push({seg, up:true, cx, cy});
      }
      lamp('bankT', bx+2, by-38, 'BANK SHOT');
    }

    /* ---- 7-bank of pool-ball drop targets + DELUXE standups ---- */
    {
      const Lx=230, Ly=640, Rx=420, Ry=575;
      const dx=Rx-Lx, dy=Ry-Ly, len=Math.hypot(dx,dy);
      const ux=dx/len, uy=dy/len;            // along the row
      const nx=-uy, ny=ux;                   // up-left normal (toward backwall)
      const sp = len/7;
      // backwall + side caps
      const bx1=Lx+nx*42, by1=Ly+ny*42, bx2=Rx+nx*42, by2=Ry+ny*42;
      // NOTE: up-left normal is (-uy? ...) → verify: (ux,uy)≈(0.948,-0.319); want normal pointing up-left = (-0.319,-0.948)
      const nux=uy, nuy=-ux;                 // (-0.319,-0.948) — up-left, into the box
      const BX1=Lx+nux*42, BY1=Ly+nuy*42, BX2=Rx+nux*42, BY2=Ry+nuy*42;
      S(BX1,BY1, BX2,BY2, 5, 'rubberHard');                  // backwall
      S(Lx,Ly, BX1,BY1, 5, 'metal');                          // left side
      S(Rx,Ry, BX2,BY2, 5, 'metal');                          // right side
      C(224,648, 9, 'rubber'); C(428,583, 9, 'rubber');       // end posts
      for (let i=0;i<7;i++){
        const s=(i+0.5)*sp, cx=Lx+ux*s, cy=Ly+uy*s;
        const seg = S(cx-ux*10, cy-uy*10, cx+ux*10, cy+uy*10, 4, 'target', 'drop'+i);
        drops7.push({seg, up:true, cx, cy, ux, uy});
        lamp('pool'+i, cx-nux*55, cy-nuy*55, String(i+1));
        if (i<6){
          const bcx=Lx+ux*s+nux*40, bcy=Ly+uy*s+nuy*40;
          const st = S(bcx-ux*12, bcy-uy*12, bcx+ux*12, bcy+uy*12, 4, 'target', 'dlx'+i);
          deluxe.push({seg:st, cx:bcx, cy:bcy});
        }
      }
    }

    /* ---- corner pocket (8-ball): top right, lone drop guarding the saucer.
       Shot up the lane by the upper flipper (real EBD corner-pocket shot). ---- */
    S(432,300, 444,240, 6, 'plastic');           // pocket left wall
    S(444,240, 488,244, 6, 'plastic');           // pocket top
    S(488,244, 482,296, 6, 'plastic');           // pocket right wall
    lone = { seg: S(438,307, 478,295, 4, 'target', 'lone'), up:true, cx:458, cy:301 };
    saucer = { x:461, y:266, r:15, holding:false, timer:0, cool:0 };
    lamp('eightL', 430,386, '8-BALL');
    lamp('saucerL', 458,340, 'COLLECT');

    /* ---- upper flipper: pivot left, tip right — fires up the pocket lane ---- */
    S(330,436, 344,462, 6, 'metal');             // mount stub above the pivot
    FU = PHYS.addFlipper(348,470, 58, 0.42, -0.50, 'FU');
    FU.maxAV = 50; FU.accel = 1300;

    /* ---- slings ---- */
    {
      const f1 = S(120,886, 166,946, 5, 'rubber', 'slingL');
      S(114,892, 114,938, 5, 'rubber'); S(114,938, 162,950, 5, 'rubber');
      const n1 = norm(60,-46);  // face normal (down-right)
      slings.push({seg:f1, nx:n1.x, ny:n1.y, cool:0});
      const f2 = S(398,886, 352,946, 5, 'rubber', 'slingR');
      S(403,892, 403,938, 5, 'rubber'); S(403,938, 356,950, 5, 'rubber');
      const n2 = norm(-60,-46); // face normal (down-left)
      slings.push({seg:f2, nx:n2.x, ny:n2.y, cool:0});
    }

    /* ---- in/out-lane guides ---- */
    S(60,880, 60,975, 6, 'metal');                // left guide A (outlane | inlane)
    S(60,975, 174,1006, 6, 'metal');              //   …delivers onto the flipper heel
    S(104,880, 104,940, 6, 'metal');              // left guide B
    S(458,880, 458,975, 5, 'metal');              // right guide A
    S(458,975, 386,1006, 5, 'metal');             //   …delivers onto the right flipper
    S(412,880, 412,940, 5, 'metal');              // right guide B
    zone('zoneC', 82,930, 16);   zone('zoneD', 435,930, 16);
    zone('outL', 38,1042, 17);   zone('outR', 480,1042, 17);

    /* ---- flippers + drain funnels ---- */
    FL = PHYS.addFlipper(185,1012, 90, 0.56, -0.45, 'FL');
    FR = PHYS.addFlipper(375,1012, 90, Math.PI-0.56, Math.PI+0.45, 'FR');
    S(16,1010, 192,1128, 6, 'metal');
    S(502,1010, 368,1128, 6, 'metal');

    /* lamps (inserts) */
    lamp('arrowL', 280,165, '25,000');
    lamp('A', 208,176, 'A'); lamp('B', 352,176, 'B');
    lamp('C', 82,912, 'C');  lamp('D', 439,912, 'D');
    for (let i=0;i<4;i++) lamp('x'+(i+2), 214+i*7, 566-i*34, (i+2)+'X');
    const DLET = 'DELUXE';
    for (let i=0;i<6;i++) lamp('dl'+i, 178+i*41, 796, DLET[i]);
    for (let i=0;i<7;i++) lamp('bk'+i, 86, 478+i*33, ((i+1)*10)+'K');
    lamp('again', 280,1002, 'SHOOT AGAIN', '#ff5a3c');
  }

  function norm(x,y){ const l=Math.hypot(x,y)||1; return {x:x/l, y:y/l}; }

  /* ---------------- device ops ---------------- */
  function setDrop(d, up){ d.up = up; d.seg.off = !up; }
  function resetBank(){ drops7.forEach(d=>setDrop(d,true)); }
  function resetInline(){ inline.forEach(d=>setDrop(d,true)); }
  function resetLone(up){ setDrop(lone, up); }

  /* zone & saucer & drain checks — runs inside physics step */
  function zonesCheck(ball, dt){
    for (const z of zones){
      if (z.cool > 0) z.cool -= dt;
      const dx = ball.x-z.x, dy = ball.y-z.y;
      const inside = dx*dx+dy*dy < z.r*z.r;
      if (inside && !z.inside && z.cool <= 0){
        PHYS.pushEvent({type:'zone', id:z.id, x:z.x, y:z.y});
        z.cool = 0.4;
      }
      z.inside = inside;
    }
    /* saucer capture (cooldown prevents re-swallowing the ejected ball) */
    if (saucer.cool > 0) saucer.cool -= dt;
    if (!saucer.holding && !ball.held && saucer.cool <= 0){
      const dx = ball.x-saucer.x, dy = ball.y-saucer.y;
      if (dx*dx+dy*dy < saucer.r*saucer.r){
        saucer.holding = true; ball.held = true;
        ball.x = saucer.x; ball.y = saucer.y; ball.vx = 0; ball.vy = 0; ball.w = 0;
        PHYS.pushEvent({type:'saucer'});
      }
    }
    /* drain */
    if (ball.active && !ball.held && ball.y > 1132 && ball.x < 500){
      ball.active = false;
      PHYS.pushEvent({type:'drain'});
    }
    /* bumper / sling cooldowns tick */
    for (const b of bumpers) if (b.cool>0) b.cool -= dt;
    for (const s of slings)  if (s.cool>0) s.cool -= dt;
  }

  function saucerEject(){
    saucer.holding = false;
    saucer.cool = 0.9;
    const b = PHYS.ball;
    b.held = false; b.x = saucer.x - 8; b.y = saucer.y + 10;
    b.vx = -180 + PHYS.rng()*40; b.vy = 300; b.w = 0;
  }

  return {
    W,H, build, lamps, zones,
    drops7, deluxe, inline, bumpers, slings,
    get lone(){ return lone; }, get saucer(){ return saucer; },
    get bankTop(){ return bankTop; },
    get FL(){ return FL; }, get FR(){ return FR; }, get FU(){ return FU; },
    setDrop, resetBank, resetInline, resetLone, zonesCheck, saucerEject,
    PLUNGE: { x:522, y:1075 },
  };
})();
