/* Corner Pocket — game logic, presentation, input, scores.
   Eight Ball Deluxe-inspired ruleset; Pinball Illusions-style scrolling camera and
   LED/DMD panel. Deterministic sim (PHYS.seed + injected inputs) for tests. */
'use strict';

const GAME = (() => {

  /* ================= canvas / camera ================= */
  const canvas = document.getElementById('pf');
  const ctx = canvas.getContext('2d');
  let cssW=0, cssH=0, DPR=1, panelH=64;
  let zoom=1, zoomFull=1, fullView=false, ox=0;
  const cam = { y:0, vy:0 };
  let shake = 0, shakeX = 0;

  function resize(){
    cssW = innerWidth; cssH = innerHeight;
    DPR = Math.min(devicePixelRatio||1, 2.2);
    if (cssW*cssH*DPR*DPR > 6.4e6) DPR = Math.sqrt(6.4e6/(cssW*cssH));
    canvas.width = Math.round(cssW*DPR); canvas.height = Math.round(cssH*DPR);
    canvas.style.width = cssW+'px'; canvas.style.height = cssH+'px';
    panelH = Math.max(54, Math.min(84, Math.round(cssH*0.085)));
    const availH = cssH - panelH;
    zoom = Math.min(cssW/TABLE.W, availH/430);       // scrolling zoom (≥430px of field visible)
    zoomFull = Math.min(cssW/TABLE.W, availH/TABLE.H);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  addEventListener('resize', resize);
  addEventListener('orientationchange', ()=>setTimeout(resize,220));

  function viewZoom(){ return (fullView || zoom<=zoomFull+0.001) ? zoomFull : zoom; }

  function updateCam(dt){
    const z = viewZoom();
    const viewH = (cssH-panelH)/z;
    if (viewH >= TABLE.H){ cam.y = (TABLE.H-viewH)/2; return; }
    const b = PHYS.ball;
    let ty;
    if (state==='attract'){
      ty = (TABLE.H-viewH)/2 + Math.sin(tNow*0.22)* (TABLE.H-viewH)/2 * 0.9;
    } else {
      const focusY = b.active||b.held ? b.y + b.vy*0.12 : 980;
      ty = focusY - viewH*0.52;
    }
    ty = Math.max(0, Math.min(TABLE.H-viewH, ty));
    const k = 1 - Math.exp(-dt*7.5);
    cam.y += (ty-cam.y)*k;
  }

  /* ================= DMD ================= */
  const F57 = {  // 5×7 font, 7 rows of 5-bit
    '0':[14,17,19,21,25,17,14],'1':[4,12,4,4,4,4,14],'2':[14,17,1,2,4,8,31],
    '3':[31,2,4,2,1,17,14],'4':[2,6,10,18,31,2,2],'5':[31,16,30,1,1,17,14],
    '6':[6,8,16,30,17,17,14],'7':[31,1,2,4,8,8,8],'8':[14,17,17,14,17,17,14],
    '9':[14,17,17,15,1,2,12],
    A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[14,17,16,16,16,17,14],
    D:[28,18,17,17,17,18,28],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],
    G:[14,17,16,23,17,17,15],H:[17,17,17,31,17,17,17],I:[14,4,4,4,4,4,14],
    J:[7,2,2,2,2,18,12],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],
    M:[17,27,21,21,17,17,17],N:[17,17,25,21,19,17,17],O:[14,17,17,17,17,17,14],
    P:[30,17,17,30,16,16,16],Q:[14,17,17,17,21,18,13],R:[30,17,17,30,20,18,17],
    S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],
    V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,21,10],X:[17,17,10,4,10,17,17],
    Y:[17,17,10,4,4,4,4],Z:[31,1,2,4,8,16,31],
    ' ':[0,0,0,0,0,0,0],'!':[4,4,4,4,4,0,4],'.':[0,0,0,0,0,12,12],
    '-':[0,0,0,31,0,0,0],"'":[12,4,8,0,0,0,0],',':[0,0,0,0,12,4,8],
    ':':[0,12,12,0,12,12,0],'×':[0,17,10,4,10,17,0],'/':[1,1,2,4,8,16,16],
    '?':[14,17,1,6,4,0,4],'+':[0,4,4,31,4,4,0],
  };
  const DMD = { W:104, H:22, q:[], cur:null, t:0 };
  const dmdCv = document.createElement('canvas');

  function dmdShow(lines, dur, opts){
    DMD.q.push({lines:Array.isArray(lines)?lines:[lines], dur:dur||1.6, opts:opts||{}});
    if (DMD.q.length>4) DMD.q.shift();
  }
  function dmdStep(dt){
    if (DMD.cur){
      DMD.cur.tt -= dt;
      if (DMD.cur.tt<=0) DMD.cur=null;
    }
    if (!DMD.cur && DMD.q.length){ DMD.cur = DMD.q.shift(); DMD.cur.tt = DMD.cur.dur; }
  }
  function dmdText(g, txt, cx, row, bright){
    txt = String(txt).toUpperCase();
    const w = txt.length*6-1;
    let x = Math.round(cx - w/2);
    for (const ch of txt){
      const gl = F57[ch] || F57[' '];
      for (let r=0;r<7;r++) for(let c=0;c<5;c++)
        if (gl[r] & (16>>c)) g.fillRect((x+c)*3, (row+r)*3, 2.2, 2.2);
      x += 6;
    }
  }
  function renderDMD(){
    dmdCv.width = DMD.W*3; dmdCv.height = DMD.H*3;
    const g = dmdCv.getContext('2d');
    g.fillStyle = '#1a0c04'; g.fillRect(0,0,dmdCv.width,dmdCv.height);
    /* faint dot grid */
    g.fillStyle = 'rgba(255,140,40,.07)';
    for (let y=0;y<DMD.H;y++) for(let x=0;x<DMD.W;x++) g.fillRect(x*3,y*3,2.2,2.2);
    g.fillStyle = '#ff9b2d';
    const cur = DMD.cur;
    if (cur){
      const o = cur.opts;
      if (o.blink && (tNow*5|0)%2) { /* off-phase */ }
      else {
        const lines = cur.lines;
        const top = lines.length===1 ? 7 : 2;
        lines.forEach((ln,i)=> dmdText(g, ln, DMD.W/2, top+i*9, true));
      }
      if (o.ballAnim){ // 8-ball rolling across
        const p = 1 - cur.tt/cur.dur;
        const bx = (4 + p*(DMD.W-8))|0, by = DMD.H-5;
        g.beginPath(); g.arc(bx*3, by*3, 6, 0, 7); g.fill();
        g.fillStyle='#1a0c04'; g.beginPath(); g.arc(bx*3,by*3,2.6,0,7); g.fill();
        g.fillStyle='#ff9b2d';
      }
    } else {
      /* idle status */
      if (state==='play'||state==='serve'||state==='bonus'){
        const P = cur ? null : plr();
        dmdText(g, demoMode ? 'DEMO MODE' : 'PLAYER '+(curP+1)+'  BALL '+ballNo, DMD.W/2, 2);
        dmdText(g, demoMode ? 'PRESS START' : fmt(P.bonusBalls*7000)+' × '+P.bonusX, DMD.W/2, 12);
      } else {
        dmdText(g, 'CORNER POCKET', DMD.W/2, 2);
        const hs = best();
        dmdText(g, hs? 'HI '+fmt(hs) : 'STOP TALKING', DMD.W/2, 12);
      }
    }
    return dmdCv;
  }

  /* ================= state ================= */
  let state = 'attract';      // attract | serve | play | bonus | over | paused
  let pausedFrom = null;
  let players = [], curP = 0, ballNo = 1, BALLS = 3;
  let credits = 0, tNow = 0;
  let tilted = false, tiltBob = 0, tiltWarns = 0;
  let plungePull = 0, plungeHeld = false, served = false;
  let bonusTimer = 0, bonusLeft = 0, endTimer = 0;
  let saucerTimer = 0, rackPending = false, loneTimer = 0;
  let stillX = 0, stillY = 0, stillT = 0, searchN = 0, lastSearchT = -99, auditT = 0;
  let lastMajor = 0, quipIdx = 0;
  let flashes = [];           // {x,y,r,col,age,max}
  let bumpGlow = [0,0,0];
  let slingFlash = [0,0];
  let nanCount = 0, drainCount = 0;
  let attractT = 0;
  let matchShown = false;

  function newPlayer(i){
    return { score:0, bonusBalls:0, bonusX:1, racks:0,
             letters:0, abcd:0, bankLvl:0, extraBalls:0,
             replays:0, stripes: i%2===1,
             /* physical rack state persists per player between balls */
             drops:[true,true,true,true,true,true,true], lone:true };
  }
  const plr = () => players[curP];
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
  const best = () => +(localStorage.getItem('ebd-best')||0);

  /* ================= scoring ================= */
  const REPLAY_AT = [450000, 900000];
  function score(n){
    const p = plr(); if (!p || tilted) return;
    const before = p.score; p.score += n;
    for (const r of REPLAY_AT) if (before < r && p.score >= r) replay('REPLAY');
  }
  function replay(label){
    credits++; AU.sfx.knocker();
    dmdShow([label,'CREDIT '+credits],2.2,{blink:true});
  }
  function extraBall(){
    plr().extraBalls++; TABLE.lamps.again.on = true;
    AU.sfx.extra(); AU.say('Same player shoots again', 1);
    dmdShow(['EXTRA BALL'],2,{blink:true});
  }

  /* ================= lamps sync ================= */
  function syncLamps(){
    const L = TABLE.lamps, p = plr();
    if (!p){ return; }
    for (let i=0;i<7;i++) L['pool'+i].on = !p.drops[i];
    const rackDone = p.drops.every(d=>!d);
    L.eightL.on = rackDone && (tNow*3|0)%2===0;
    L.saucerL.on = rackDone && !p.lone;
    for (let i=0;i<6;i++) L['dl'+i].on = !!(p.letters & (1<<i));
    for (let i=0;i<4;i++) L['x'+(i+2)].on = p.bonusX >= i+2;
    L.A.on = !!(p.abcd&1); L.B.on = !!(p.abcd&2);
    L.C.on = !!(p.abcd&4); L.D.on = !!(p.abcd&8);
    for (let i=0;i<7;i++) L['bk'+i].on = p.bankLvl > i;
    L.again.on = p.extraBalls>0;
    L.arrowL.on = (tNow*2|0)%2===0;
    L.bankT.on = TABLE.inline.every(d=>!d.up) && !p._bankT && (tNow*3|0)%2===0;
  }
  function attractLamps(){
    const L = TABLE.lamps, ids = Object.keys(L);
    const ph = (tNow*2.2)%3;
    ids.forEach((id,i)=>{
      const lp = L[id];
      if (ph<1) lp.on = (i + (tNow*8|0)) % 6 === 0;                  // chase
      else if (ph<2) lp.on = Math.sin(lp.y*0.02 - tNow*5) > 0.6;     // wave
      else lp.on = (tNow*4|0)%2===0 && Math.sin(lp.x*0.05+lp.y)>0;   // sparkle
    });
  }

  /* ================= game flow ================= */
  function startGame(n){
    AU.init(); AU.resume();
    players = []; for (let i=0;i<n;i++) players.push(newPlayer(i));
    curP = 0; ballNo = 1; credits = Math.max(0,credits-0);
    hide('title'); hide('how'); hide('scores'); hide('over');
    showTouchBtns(true);
    AU.sfx.jingle();
    AU.say('Corner Pocket', 2);
    dmdShow(['CORNER POCKET','RACK EM UP'],2.2);
    applyRackState();
    serve(false);
  }
  function applyRackState(){
    const p = plr();
    loneTimer = 0;
    TABLE.drops7.forEach((d,i)=>TABLE.setDrop(d, p.drops[i]));
    TABLE.resetInline();
    TABLE.resetLone(p.lone);
    if (TABLE.saucer.holding){ TABLE.saucer.holding=false; }
  }
  function serve(again){
    state = 'serve'; served = false; tilted = false; tiltBob = 0; tiltWarns = 0;
    plungePull = 0; plungeHeld = false; rackPending = false;
    const p = plr();
    p.bonusX = 1; p.abcd = 1; p._bankT = false;   // A spotted at ball start (EBD rule)
    TABLE.resetInline();
    const b = PHYS.ball;
    b.active = true; b.held = true; b.lowTime = 0;
    b.x = TABLE.PLUNGE.x; b.y = TABLE.PLUNGE.y; b.px=b.x; b.py=b.y;
    b.vx = 0; b.vy = 0; b.w = 0;
    AU.drone(0.15 + Math.min(0.8, p.bonusBalls*0.03));
    if (!again) dmdShow(['PLAYER '+(curP+1),'BALL '+ballNo],1.8);
  }
  function endOfBall(){
    AU.drone(0);
    const p = plr();
    if (tilted){ finishBall(); return; }
    state = 'bonus';
    bonusLeft = p.bonusBalls; bonusTimer = 0.45;
    dmdShow(['BONUS '+fmt(p.bonusBalls*7000) + (p.bonusX>1?' ×'+p.bonusX:'')],1.4);
  }
  function finishBall(){
    if (demoMode){ endDemo(); return; }
    const p = plr();
    if (p.extraBalls > 0){
      p.extraBalls--;
      AU.say('Same player shoots again', 1);
      serve(true);
      return;
    }
    /* next player / ball */
    let nx = curP+1;
    while (nx < players.length && !players[nx]) nx++;
    if (nx >= players.length){ nx = 0; ballNo++; }
    if (ballNo > BALLS){ gameOver(); return; }
    curP = nx;
    applyRackState();
    serve(false);
  }
  function gameOver(){
    state = 'over'; AU.drone(0); AU.shutUp();
    AU.sfx.over();
    showTouchBtns(false);
    /* match sequence */
    const m = (Math.floor(PHYS.rng()*10))*10;
    matchShown = false;
    setTimeout(()=>{
      AU.sfx.match();
      const winners = players.filter(p=>p.score%100===m);
      dmdShow(['MATCH '+(m<10?'0':'')+m], 2.4, {blink:true});
      if (winners.length){ setTimeout(()=>{ AU.sfx.matchWin(); credits+=winners.length; },900); }
      setTimeout(showGameOver, 1700);
    }, 600);
  }
  function showGameOver(){
    const bestScore = Math.max(...players.map(p=>p.score));
    if (bestScore > best()) localStorage.setItem('ebd-best', bestScore);
    const card = document.getElementById('overCard');
    let rows = players.map((p,i)=>
      `<div><span>PLAYER ${i+1} · ${p.racks} rack${p.racks!==1?'s':''}</span><span>${fmt(p.score)}</span></div>`).join('');
    card.innerHTML =
      `<p class="sub">game over</p><h1 class="logo" style="font-size:30px">Chalk it up</h1>`+
      `<div class="rows">${rows}</div>`+
      `<p class="tiny">best on this machine: ${fmt(best())}</p>`+
      `<div class="init" id="init"><span class="cur">A</span><span>A</span><span>A</span></div>`+
      `<p class="tiny">carve your initials into the pool hall wall</p>`+
      `<button class="btn" id="bSave">Leave your mark</button>`+
      `<button class="btn ghost" id="bSkip">Play again</button>`;
    show('over');
    initials = ['A','A','A']; initCur = 0; paintInitials();
    document.getElementById('bSave').onclick = saveScore;
    document.getElementById('bSkip').onclick = ()=>{ hide('over'); startGame(players.length); };
  }

  /* ================= rules: switch handling ================= */
  function major(){ lastMajor = tNow; }

  function poolDown(i, spotted){
    const p = plr();
    if (!p.drops[i]) return;
    p.drops[i] = false;
    TABLE.setDrop(TABLE.drops7[i], false);
    p.bonusBalls++; score(2000);
    AU.sfx.drop(); major();
    AU.drone(0.15 + Math.min(0.8, p.bonusBalls*0.03));
    const d = TABLE.drops7[i];
    addFlash(d.cx, d.cy, 46, '255,179,71');
    if (p.drops.every(x=>!x)){
      dmdShow(['SHOOT THE','EIGHT BALL'],2,{blink:true});
      AU.say('Shoot the eight ball', 1);
    } else if (spotted){
      AU.sfx.spot();
    }
  }

  function handleEvent(ev){
    if (window.__hitlog) window.__hitlog.push(ev.id || ev.type);
    const p = plr();
    switch (ev.type){
      case 'nan': nanCount++; return;
      case 'drain':
        drainCount++;
        if (state!=='play' && state!=='serve') return;
        AU.sfx.drain();
        if (!tilted && PHYS.rng()<0.45 && state==='play') AU.say(pick(['Stop talking and start chalking','Quit playing with yourself']), 0);
        endTimer = 0.9;             // small beat, then bonus count
        state = 'bonus-wait';
        return;
      case 'saucer': {
        AU.sfx.saucer(); major();
        score(3000);
        const rackDone = p.drops.every(d=>!d) && !p.lone;
        saucerTimer = rackDone ? 2.0 : 1.1;
        rackPending = rackDone;
        if (rackDone){
          p.racks++; p.bonusBalls++; score(25000);
          AU.sfx.eight();
          AU.say('Corner Pocket', 2);
          dmdShow(['RACK '+p.racks+' COMPLETE','CORNER POCKET'],2.4,{ballAnim:true});
          addFlash(TABLE.saucer.x, TABLE.saucer.y, 130, '255,220,150');
        } else {
          dmdShow(['BONUS HOLD','+3000'],1.2);
        }
        return;
      }
      case 'zone': return handleZone(ev.id);
      case 'hit':  return handleHit(ev);
    }
  }

  function handleZone(id){
    const p = plr();
    if (state!=='play' && state!=='serve') return;
    switch (id){
      case 'zoneA': case 'zoneB': case 'zoneC': case 'zoneD': {
        const bit = {zoneA:1,zoneB:2,zoneC:4,zoneD:8}[id];
        score(1000); AU.sfx.rollover(); major();
        if (!(p.abcd & bit)){
          p.abcd |= bit;
          if (p.abcd === 15){
            p.abcd = 0; score(10000);
            AU.sfx.spot();
            dmdShow(['A-B-C-D','POOL BALL SPOTTED'],1.8);
            const i = p.drops.findIndex(d=>d);
            if (i>=0) poolDown(i, true);
          }
        }
        return;
      }
      case 'bank2':
        if (PHYS.ball.vy > -100) return;      // inner channel only counts going UP
        /* fall through */
      case 'bank': {
        if (state!=='play') return;
        const val = Math.min(7, p.bankLvl+1)*10000;
        score(val); AU.sfx.bankshot(); major();
        dmdShow(['LEFT LANE','+'+fmt(val)],1.4);
        addFlash(86, 580, 90, '120,190,255');
        if (p.bankLvl < 7) p.bankLvl++;
        if (val === 70000 && !p._bank70){ p._bank70 = true; extraBall(); }
        return;
      }
      case 'top25': {
        if (state!=='play' && state!=='serve') return;
        if (TABLE.lamps.arrowL.on){
          score(25000); AU.sfx.standup(); major();
          dmdShow(['25,000'],1);
          addFlash(280,60, 60, '255,217,138');
        } else { score(1000); AU.sfx.rollover(); }
        return;
      }
      case 'outL': case 'outR':
        if (state==='play'){ score(5000); AU.sfx.rollover(); }
        return;
    }
  }

  function handleHit(ev){
    const p = plr();
    if (!p) return;
    const id = ev.id;
    if (id.startsWith('drop')){
      if (ev.speed > 55) poolDown(+id.slice(4), false);
      return;
    }
    if (id.startsWith('dlx')){
      const i = +id.slice(3);
      if (ev.speed > 40 && !(p.letters & (1<<i))){
        p.letters |= (1<<i);
        score(3000); AU.sfx.standup(); major();
        const st = TABLE.deluxe[i];
        addFlash(st.cx, st.cy, 40, '255,217,138');
        if (p.letters === 63){
          p.letters = 0;
          score(50000);
          p.replays++;
          replay('POCKET');
          AU.say('Corner pocket!', 2);
          dmdShow(['P-O-C-K-E-T','REPLAY'],2.4,{blink:true});
          /* resetting the bank lets bonus keep building (real rule) */
          p.drops = p.drops.map(()=>true);
          TABLE.resetBank();
        }
      }
      return;
    }
    if (id.startsWith('inl')){
      const i = +id.slice(3);
      const d = TABLE.inline[i];
      if (d.up && ev.speed > 55){
        TABLE.setDrop(d,false);
        score(8000); AU.sfx.drop(); major();
        if (p.bonusX < 5){
          p.bonusX++;
          dmdShow(['BONUS '+p.bonusX+'×'],1.2);
          if (p.bonusX===5) AU.say('Get the chalk', 0);
        }
        addFlash(d.cx, d.cy, 40, '120,190,255');
      }
      return;
    }
    if (id === 'lone'){
      if (TABLE.lone.up && ev.speed > 55){
        TABLE.resetLone(false); p.lone = false;
        score(5000); AU.sfx.drop(); major();
        addFlash(429,296, 50, '255,255,255');
        if (p.drops.every(d=>!d)) dmdShow(['SAUCER LIT','COLLECT THE RACK'],1.6);
      }
      return;
    }
    if (id.startsWith('bump')){
      const i = +id.slice(4), b = TABLE.bumpers[i];
      if (b.cool <= 0){
        b.cool = 0.07;
        const ball = PHYS.ball;
        const dx = ball.x-b.x, dy = ball.y-b.y, dl = Math.hypot(dx,dy)||1;
        /* impulse blends with incoming momentum — no teleport-style direction snap */
        const kick = 1000 + PHYS.rng()*110;
        ball.vx = ball.vx*0.3 + dx/dl*kick;
        ball.vy = ball.vy*0.3 + dy/dl*kick;
        ball.slide = 0.34;        // kicked ball SLIDES before it rolls — sheds speed fast
        score(100); AU.sfx.bumper();
        bumpGlow[i] = 1;
        addFlash(b.x,b.y, 56, '255,160,80');
      }
      return;
    }
    if (id === 'slingL' || id === 'slingR'){
      const i = id==='slingL'?0:1, s = TABLE.slings[i];
      if (s.cool <= 0 && ev.speed > 35){
        s.cool = 0.15;
        const ball = PHYS.ball;
        ball.vx += s.nx*960; ball.vy += s.ny*960 - 110;
        ball.slide = 0.28;
        score(100); AU.sfx.sling();
        slingFlash[i] = 1;
      }
      return;
    }
    if (id === 'bankT'){
      if (TABLE.inline.every(d=>!d.up) && !p._bankT){
        p._bankT = true;
        score(50000); AU.sfx.bankshot(); major();
        AU.say('Bank shot', 1);
        dmdShow(['BANK SHOT','50,000'],2,{blink:true});
        addFlash(TABLE.bankTop.cx, TABLE.bankTop.cy, 70, '120,190,255');
      } else if (ev.speed > 40){
        score(1000); AU.sfx.standup();
      }
      return;
    }
  }

  const pick = a => a[(PHYS.rng()*a.length)|0];

  /* ================= per-frame sim glue ================= */
  PHYS.cb.zones = TABLE.zonesCheck;
  PHYS.cb.preStep = function(dt){
    /* plunger */
    const b = PHYS.ball;
    if (state==='serve' && b.held){
      if (plungeHeld && plungePull<1){ plungePull = Math.min(1, plungePull + dt*1.35); }
      b.x = TABLE.PLUNGE.x; b.y = TABLE.PLUNGE.y + plungePull*20;
    }
    /* saucer hold / re-rack / eject (lone resets after the ball clears the pocket) */
    if (saucerTimer > 0){
      saucerTimer -= dt;
      if (saucerTimer <= 0){
        if (rackPending){
          const p = plr();
          if (p){ p.drops = p.drops.map(()=>true); p.lone = true; p.stripes = !p.stripes; }
          TABLE.resetBank();
          loneTimer = 1.2;
          rackPending = false;
        }
        if (TABLE.saucer.holding){ TABLE.saucerEject(); AU.sfx.eject(); }
      }
    }
    if (loneTimer > 0){
      loneTimer -= dt;
      if (loneTimer <= 0) TABLE.resetLone(true);
    }
  };

  function launch(){
    const b = PHYS.ball;
    if (state!=='serve' || !b.held) return;
    b.held = false;
    /* crown-clear threshold ≈1950 px/s: tap fails visibly, 40% just clears, full rips */
    b.vy = -(1390 + plungePull*1600) * (0.99+PHYS.rng()*0.02);
    b.vx = 0;
    AU.sfx.launch(plungePull);
    plungePull = 0; plungeHeld = false;
    state = 'play'; served = true; major();
  }

  function nudge(dx,dy){
    if (state!=='play' || tilted) return;
    const b = PHYS.ball;
    if (b.active && !b.held){ b.vx += dx; b.vy += dy; }
    shake = 0.4; shakeX = dx*0.014;
    AU.sfx.nudge();
    tiltBob += 1;
    if (tiltBob >= 3){
      tilted = true;
      TABLE.FL.on = TABLE.FR.on = TABLE.FU.on = false;
      AU.sfx.tilt(); AU.say('Tilt', 2);
      dmdShow(['TILT'], 2.5, {blink:true});
    } else if (tiltBob >= 2){
      AU.sfx.tiltWarn();
      dmdShow(['DANGER'], 0.9, {blink:true});
    }
  }

  function simStep(){
    PHYS.step();
    const evs = PHYS.drainEvents();
    for (const e of evs) handleEvent(e);
    tNow += PHYS.DT;
    tiltBob = Math.max(0, tiltBob - PHYS.DT*0.4);

    /* timers driven at sim rate for determinism */
    if (state==='bonus-wait'){
      endTimer -= PHYS.DT;
      if (endTimer<=0) endOfBall();
    } else if (state==='bonus'){
      bonusTimer -= PHYS.DT;
      if (bonusTimer<=0){
        if (bonusLeft>0 && !tilted){
          bonusLeft--;
          score(7000*plr().bonusX);
          AU.sfx.chime(bonusLeft%3);
          bonusTimer = 0.16;
        } else {
          bonusTimer = 0; endTimer = 0.5; state='bonus-end';
        }
      }
    } else if (state==='bonus-end'){
      endTimer -= PHYS.DT;
      if (endTimer<=0) finishBall();
    } else if (state==='play'){
      /* weak plunge fell back to the seat → re-serve */
      const b = PHYS.ball;
      if (b.active && !b.held && b.x>504 && b.y>1030 && Math.abs(b.vy)<28 && Math.abs(b.vx)<28){
        state = 'serve'; b.held = true; plungePull = 0;
      }
      /* stuck-ball rescue: velocity- AND position-based, escalating like a real
         ball search — gentle kick, hard kick toward centre, then back to plunger */
      if (!b.held){
        if (Math.abs(b.x-stillX) < 1.5 && Math.abs(b.y-stillY) < 1.5) stillT += PHYS.DT;
        else { stillX = b.x; stillY = b.y; stillT = 0; }
        if (!window.__noSearch && (b.lowTime > 3 || stillT > 2.6) && b.y < 1050){
          if (window.__searchCount !== undefined) window.__searchCount++;   // test instrumentation
          b.lowTime = 0; stillT = 0;
          if (tNow - lastSearchT > 15) searchN = 0;
          lastSearchT = tNow; searchN++;
          if (searchN >= 3){
            searchN = 0;
            b.held = true; b.x = TABLE.PLUNGE.x; b.y = TABLE.PLUNGE.y;
            b.px = b.x; b.py = b.y; b.vx = 0; b.vy = 0; b.w = 0;
            plungePull = 0; plungeHeld = false;
            state = 'serve';
            dmdShow(['BALL SEARCH','BALL RETURNED'],1.8);
          } else if (searchN === 2){
            const dx = 280-b.x, dy = 720-b.y, dl = Math.hypot(dx,dy)||1;
            b.vx = dx/dl*950; b.vy = dy/dl*950 - 200;
            dmdShow(['BALL SEARCH'],1);
          } else {
            b.vx += (PHYS.rng()-0.5)*340; b.vy -= 300 + PHYS.rng()*160;
            dmdShow(['BALL SEARCH'],1);
          }
        }
      }
      /* idle taunt */
      if (tNow - lastMajor > 22){
        lastMajor = tNow;
        AU.say(pick(['Stop talking and start chalking','Quit playing with yourself','Shoot the eight ball']), 0);
      }
    }
    auditT += PHYS.DT;
    if (auditT > 0.5){ auditT = 0; keyAudit(); }
    if (state === 'attract' && !demoMode && !window.__headless){
      attractIdle += PHYS.DT;
      if (attractIdle > 14 && !document.getElementById('title').classList.contains('hide')){
        attractIdle = 0;
        startDemo();
      }
    }
    AI.step();
    dmdStep(PHYS.DT);
  }

  /* ================= AI player (attract demo + test harness) ================= */
  let demoMode = false, attractIdle = 0;
  const AI = {
    on: false, holdL: 0, holdR: 0, coolL: 0, coolR: 0, plungeT: 0, lastNudge: -9,
    step(){
      if (!this.on) return;
      const b = PHYS.ball;
      if (state === 'serve' && b.held){
        this.plungeT += PHYS.DT;
        if (this.plungeT > 1.1){
          plungePull = 0.5 + PHYS.rng()*0.5;
          launch();
          this.plungeT = 0;
        }
        return;
      }
      if (state !== 'play' || !b.active || b.held) return;
      /* lower flippers: strike when the ball is in the window and not rising fast */
      const zoneL = b.y > 935 && b.y < 1058 && b.vy > -60 && b.x > 160 && b.x < 295;
      const zoneR = b.y > 935 && b.y < 1058 && b.vy > -60 && b.x > 265 && b.x < 400;
      const nearFU = b.x > 330 && b.x < 432 && b.y > 425 && b.y < 515 && b.vy > -40;
      if (zoneL && this.coolL <= 0){ flip('L', true); this.holdL = 0.10 + PHYS.rng()*0.10; this.coolL = 0.5; }
      if ((zoneR || nearFU) && this.coolR <= 0){ flip('R', true); this.holdR = 0.09 + PHYS.rng()*0.10; this.coolR = 0.5; }
      if (this.holdL > 0){ this.holdL -= PHYS.DT; if (this.holdL <= 0) flip('L', false); }
      if (this.holdR > 0){ this.holdR -= PHYS.DT; if (this.holdR <= 0) flip('R', false); }
      if (this.coolL > 0) this.coolL -= PHYS.DT;
      if (this.coolR > 0) this.coolR -= PHYS.DT;
      /* desperation nudge on a centre drain approach */
      if (b.y > 1010 && Math.abs(b.x-280) < 26 && b.vy > 150 && tNow - this.lastNudge > 5){
        this.lastNudge = tNow;
        nudge((b.x < 280 ? 1 : -1) * 140, -150);
      }
    },
    reset(){ this.holdL = this.holdR = this.coolL = this.coolR = this.plungeT = 0; flip('L',false); flip('R',false); }
  };
  function startDemo(){
    demoMode = true; AI.reset(); AI.on = true;
    players = [newPlayer(0)]; curP = 0; ballNo = 1;
    hide('title'); hide('how'); hide('scores');
    applyRackState();
    serve(false);
    dmdShow(['DEMO','PRESS START'], 3);
  }
  function endDemo(){
    if (!demoMode) return;
    demoMode = false; AI.on = false; AI.reset();
    players = []; state = 'attract'; attractIdle = 0;
    AU.drone(0); AU.shutUp();
    show('title');
  }
  window.addEventListener('keydown', () => { attractIdle = 0; if (demoMode) endDemo(); }, true);
  window.addEventListener('pointerdown', () => { attractIdle = 0; if (demoMode) endDemo(); }, true);

  /* ================= flash fx ================= */
  function addFlash(x,y,r,col){ flashes.push({x,y,r,col,age:0,max:0.35}); if(flashes.length>24)flashes.shift(); }

  /* ================= render ================= */
  function render(alpha){
    const z = viewZoom();
    const viewW = TABLE.W*z;
    ox = Math.max(0,(cssW-viewW)/2);
    /* gutters: dark room + wood cabinet rails hugging the table */
    const bg = ctx.createLinearGradient(0,0,cssW,0);
    bg.addColorStop(0,'#070503'); bg.addColorStop(.5,'#120c06'); bg.addColorStop(1,'#070503');
    ctx.fillStyle = bg; ctx.fillRect(0,0,cssW,cssH);
    if (ox > 2){
      for (const side of [ox-14, ox+viewW]){
        const rg = ctx.createLinearGradient(side,0,side+14,0);
        rg.addColorStop(0,'#3a2010'); rg.addColorStop(.45,'#5a3418'); rg.addColorStop(1,'#241308');
        ctx.fillStyle = rg; ctx.fillRect(side,panelH,14,cssH-panelH);
        ctx.fillStyle = 'rgba(255,217,138,.18)';
        ctx.fillRect(side+2,panelH,1.5,cssH-panelH);
      }
    }

    ctx.save();
    ctx.beginPath(); ctx.rect(ox,panelH,viewW,cssH-panelH); ctx.clip();
    ctx.translate(ox + shakeX*46*shake, panelH + (shake>0? Math.sin(tNow*70)*5*shake:0));
    ctx.scale(z,z);
    ctx.translate(0, -cam.y);

    /* static base */
    ctx.drawImage(ART.base, 0,0,TABLE.W*ART.SC,TABLE.H*ART.SC, 0,0,TABLE.W,TABLE.H);

    /* lamps */
    if (state==='attract') attractLamps(); else syncLamps();
    ART.drawLamps(ctx, tNow);

    /* devices */
    const p = plr();
    TABLE.drops7.forEach((d,i)=> ART.drawDropTarget(ctx,d, ['#f2b03c','#2467c4','#cf3a28','#7b3fa0','#e06a1f','#2e7d4f','#8c2f23'][i], String(i+1)));
    TABLE.inline.forEach(d=> ART.drawDropTarget(ctx,d,'#2467c4',''));
    ART.drawDropTarget(ctx, TABLE.lone, '#16161a','8');
    TABLE.deluxe.forEach((st,i)=> ART.drawStandup(ctx,st,'POCKET'[i], p? !!(p.letters&(1<<i)) : false));
    ART.drawStandup(ctx, TABLE.bankTop, '50', TABLE.lamps.bankT.on);
    TABLE.bumpers.forEach((b,i)=>{ ART.drawBumper(ctx,b,bumpGlow[i],tNow); });
    ART.drawSaucer(ctx, TABLE.saucer);
    ART.drawGate(ctx);
    ART.drawPlunger(ctx, plungePull);
    ART.drawFlipper(ctx, TABLE.FL); ART.drawFlipper(ctx, TABLE.FR); ART.drawFlipper(ctx, TABLE.FU);

    /* ball */
    const b = PHYS.ball;
    if ((b.active||b.held) && !TABLE.saucer.holding){
      const bx = b.px + (b.x-b.px)*alpha, by = b.py + (b.y-b.py)*alpha;
      const spd = Math.hypot(b.vx, b.vy);
      if (spd > 1200){                          // motion-blur streak
        const n = Math.min(3, spd/900|0), ux = b.vx/spd, uy = b.vy/spd;
        for (let i = 1; i <= n; i++){
          ctx.globalAlpha = 0.15*(1 - i/(n+1));
          ctx.fillStyle = '#b8c2ca';
          ctx.beginPath(); ctx.arc(bx-ux*i*8, by-uy*i*8, 13.5-i*1.4, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ART.drawBall(ctx,bx,by);
    }

    /* flashes */
    ctx.globalCompositeOperation = 'lighter';
    for (const f of flashes){
      const k = 1-f.age/f.max;
      const g = ctx.createRadialGradient(f.x,f.y,2,f.x,f.y,f.r*(1+ (1-k)*0.6));
      g.addColorStop(0,`rgba(${f.col},${0.55*k})`);
      g.addColorStop(1,`rgba(${f.col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r*1.6,0,7); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    /* tilt veil */
    if (tilted){
      ctx.fillStyle = 'rgba(10,5,2,.45)';
      ctx.fillRect(0,cam.y,TABLE.W,cssH/z);
    }
    /* glass edge shading where the cabinet meets the playfield */
    const edgeW = 26/z;
    for (const [x0,x1] of [[0,edgeW],[TABLE.W,TABLE.W-edgeW]]){
      const eg = ctx.createLinearGradient(x0,0,x1,0);
      eg.addColorStop(0,'rgba(20,10,4,.34)'); eg.addColorStop(1,'rgba(20,10,4,0)');
      ctx.fillStyle = eg;
      ctx.fillRect(Math.min(x0,x1),cam.y,edgeW,cssH/z+4);
    }
    ctx.restore();

    renderPanel();
  }

  function renderPanel(){
    /* backbox panel: LED scores + DMD */
    const g = ctx.createLinearGradient(0,0,0,panelH);
    g.addColorStop(0,'#16100a'); g.addColorStop(1,'#0c0805');
    ctx.fillStyle = g; ctx.fillRect(0,0,cssW,panelH);
    ctx.fillStyle = 'rgba(255,179,71,.25)'; ctx.fillRect(0,panelH-1.5,cssW,1.5);

    const pad = 12;
    ctx.textBaseline = 'middle';
    /* scores */
    const n = players.length || 1;
    const ledCol = '#ffb347';
    ctx.shadowColor = 'rgba(255,155,45,.7)';
    if (state==='attract' && !players.length){
      ctx.shadowBlur = 10;
      ctx.fillStyle = ledCol;
      ctx.font = `700 ${Math.round(panelH*0.34)}px Consolas,monospace`;
      ctx.textAlign='left';
      ctx.fillText('CORNER POCKET', pad, panelH*0.32);
      ctx.font = `600 ${Math.round(panelH*0.22)}px Consolas,monospace`;
      ctx.fillStyle = '#caa46a';
      ctx.shadowBlur = 0;
      ctx.fillText('HIGH '+fmt(best()), pad, panelH*0.72);
    } else {
      const slotW = Math.min(190, (cssW*0.55-pad)/Math.min(n,2));
      players.forEach((p,i)=>{
        const col = i%2, row = (i/2)|0;
        const x = pad + col*slotW, y = panelH*(n>2 ? (row? 0.74:0.3) : 0.42);
        const act = i===curP && state!=='attract';
        ctx.font = `700 ${Math.round(panelH*(n>2?0.26:0.4))}px Consolas,monospace`;
        ctx.textAlign='left';
        ctx.shadowBlur = act?12:4;
        ctx.fillStyle = act? '#ffd98a' : 'rgba(255,179,71,.55)';
        ctx.fillText(fmt(p.score), x, y);
        if (n<=2 || act){
          ctx.shadowBlur = 0;
          ctx.font = `600 ${Math.round(panelH*0.17)}px Consolas,monospace`;
          ctx.fillStyle = act ? '#caa46a':'rgba(202,164,106,.5)';
          if (n<=2) ctx.fillText('P'+(i+1)+(act?' ◂':''), x, y+panelH*0.3);
        }
      });
      /* ball / credit info */
      ctx.shadowBlur = 0;
      ctx.font = `600 ${Math.round(panelH*0.18)}px Consolas,monospace`;
      ctx.fillStyle = '#caa46a'; ctx.textAlign='left';
      const info = state==='attract' ? 'GAME OVER' : 'BALL '+ballNo+' / '+BALLS;
      ctx.fillText(info+'   CREDITS '+credits, pad, panelH*0.88);
    }
    ctx.shadowBlur = 0;

    /* ?debug=1 overlay: live flipper source sets + recent input events */
    if (window.__debugHud){
      ctx.font = '11px Consolas,monospace'; ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(4, panelH+4, 250, 110);
      ctx.fillStyle = TABLE.FL.on ? '#7dff8a' : '#888';
      ctx.fillText('FL '+(TABLE.FL.on?'UP':'dn')+' ['+[...flipSrc.L].join(' ')+']', 8, panelH+8);
      ctx.fillStyle = TABLE.FR.on ? '#7dff8a' : '#888';
      ctx.fillText('FR '+(TABLE.FR.on?'UP':'dn')+' ['+[...flipSrc.R].join(' ')+']', 8, panelH+22);
      ctx.fillStyle = '#caa46a';
      inputLog.slice(-6).forEach((l,i)=> ctx.fillText(l.t%100000+' '+l.e, 8, panelH+38+i*12));
    }

    /* DMD on the right */
    const dmd = renderDMD();
    const dw = Math.min(cssW*0.42, panelH*4.7), dh = dw*(DMD.H/DMD.W);
    const dx = cssW-dw-10, dy = (panelH-dh)/2;
    ctx.fillStyle = '#000'; ART.rr(ctx,dx-4,dy-4,dw+8,dh+8,5); ctx.fill();
    ctx.drawImage(dmd, dx, dy, dw, dh);
  }

  /* ================= main loop ================= */
  let last = 0, acc = 0;
  function frame(ts){
    requestAnimationFrame(frame);
    if (!last) last = ts;
    let dt = (ts-last)/1000; last = ts;
    if (dt > 0.06) dt = 0.06;
    if (state==='paused'){ render(1); return; }
    acc += dt;
    while (acc >= PHYS.DT){ simStep(); acc -= PHYS.DT; }
    for (let i=0;i<bumpGlow.length;i++) bumpGlow[i] = Math.max(0, bumpGlow[i]-dt*5);
    /* drop-target drop/rise animation */
    for (const d of [...TABLE.drops7, ...TABLE.inline, TABLE.lone]){
      const want = d.up ? 1 : 0;
      if (d.anim === undefined) d.anim = want;
      else if (d.anim !== want){
        const step = dt/0.07;
        d.anim += Math.sign(want - d.anim) * Math.min(Math.abs(want - d.anim), step);
      }
    }
    for (let i=0;i<2;i++) slingFlash[i] = Math.max(0, slingFlash[i]-dt*5);
    for (const f of flashes) f.age += dt;
    flashes = flashes.filter(f=>f.age<f.max);
    shake = Math.max(0, shake-dt*1.4);
    updateCam(dt);
    render(acc/PHYS.DT);
  }

  /* ================= input =================
     Each flipper is energized iff its SET of active sources is non-empty
     ('key:<code>' | 'ptr:<id>' | 'api'). Sources are dropped on release,
     blur, hide, pointercancel, and a buttons-watchdog — flippers can never
     stick up from a missed release event. */
  const LKEYS = ['ShiftLeft','KeyZ','ArrowLeft','KeyA'];
  const RKEYS = ['ShiftRight','Slash','ArrowRight','KeyD','Quote'];
  const flipSrc = { L:new Set(), R:new Set() };
  const keyLastSeen = {};                       // code → performance.now() of last keydown (incl. repeats)

  /* input ring buffer for field debugging (__g.inputLog, ?debug=1 overlay) */
  const inputLog = [];
  function ilog(ev){
    inputLog.push({ t: performance.now()|0, e: ev,
                    L: [...flipSrc.L].join('|'), R: [...flipSrc.R].join('|') });
    if (inputLog.length > 200) inputLog.shift();
  }

  /* watchdogs against swallowed releases:
     · modifier keys don't auto-repeat, but every later event can be asked
       via getModifierState — drop Shift sources the instant it reads false
     · non-modifier keys DO auto-repeat, so a held key refreshes keyLastSeen;
       a key source silent for >2s means its keyup was swallowed            */
  function modifierAudit(e){
    if (!e.getModifierState) return;
    if (!e.getModifierState('Shift')){
      if (flipSrc.L.has('key:ShiftLeft')){ ilog('watchdog -ShiftLeft'); releaseSrc('L','key:ShiftLeft'); }
      if (flipSrc.R.has('key:ShiftRight')){ ilog('watchdog -ShiftRight'); releaseSrc('R','key:ShiftRight'); }
    }
  }
  function keyAudit(){
    for (const side of ['L','R']){
      for (const src of flipSrc[side]){
        if (!src.startsWith('key:')) continue;
        const code = src.slice(4);
        if (code === 'ShiftLeft' || code === 'ShiftRight') continue;   // covered by modifierAudit
        if (tNow - (keyLastSeen[code]||0) > 2.0){                      // sim-clock: keyboards auto-repeat well under 2s
          ilog('watchdog -'+code);
          releaseSrc(side, src);
        }
      }
      /* pointer sources must exist in the live pointer map */
      for (const src of flipSrc[side]){
        if (src.startsWith('ptr:') && !ptrs.has(+src.slice(4))){
          ilog('watchdog -'+src);
          releaseSrc(side, src);
        }
      }
    }
  }

  function syncFlip(side){
    const want = flipSrc[side].size > 0 && !tilted && state!=='paused' && state!=='attract';
    if (side==='L'){
      if (want !== TABLE.FL.on) AU.sfx[want?'flipUp':'flipDn']();
      TABLE.FL.on = want;
    } else {
      if (want !== TABLE.FR.on) AU.sfx[want?'flipUp':'flipDn']();
      TABLE.FR.on = want; TABLE.FU.on = want;
    }
  }
  function press(side, src){ if (!flipSrc[side].has(src)){ flipSrc[side].add(src); syncFlip(side); } }
  function releaseSrc(side, src){ if (flipSrc[side].delete(src)) syncFlip(side); }
  function releaseAllInputs(){
    flipSrc.L.clear(); flipSrc.R.clear();
    syncFlip('L'); syncFlip('R');
  }
  /* legacy/api entry point (used by __g and tests) */
  function flip(side,on){ if (on) press(side,'api'); else releaseSrc(side,'api'); }

  addEventListener('keydown', e=>{
    const k = e.key, c = e.code;
    keyLastSeen[c] = tNow;
    if (!e.repeat) ilog('kd '+c);
    modifierAudit(e);
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(k)) e.preventDefault();
    if (k==='p'||k==='P'||k==='Escape'){
      if (state==='play'||state==='serve') return pauseGame();
      if (state==='paused') return resumeGame();
    }
    if (k==='m'||k==='M'){ const m = AU.toggleMute(); dmdShow([m?'MUTED':'SOUND ON'],1); return; }
    if (k==='v'||k==='V'){ fullView = !fullView; return; }
    if (state==='attract' && (k==='Enter')){ startGame(1); return; }
    if (state==='paused' && k==='Enter') return resumeGame();
    if (LKEYS.includes(c)) press('L','key:'+c);
    if (RKEYS.includes(c)) press('R','key:'+c);
    if (c==='Space'||c==='ArrowDown'){
      if (state==='serve' && !e.repeat){ plungeHeld = true; AU.resume(); }
      else if (state==='play' && c==='Space' && !e.repeat) nudge((PHYS.rng()-0.5)*60, -170);
    }
    if (state==='play' && !e.repeat){
      if (c==='ArrowUp'||c==='KeyW') nudge((PHYS.rng()-0.5)*60, -170);
      if (c==='KeyQ') nudge(150,-70);
      if (c==='KeyE') nudge(-150,-70);
    }
  });
  addEventListener('keyup', e=>{
    const c = e.code;
    ilog('ku '+c);
    modifierAudit(e);
    releaseSrc('L','key:'+c); releaseSrc('R','key:'+c);
    if (c==='Space'||c==='ArrowDown'){ if (state==='serve' && plungeHeld) launch(); }
  });
  addEventListener('blur', ()=>{ ilog('blur'); releaseAllInputs();
    if (state==='play'||state==='serve') pauseGame(); });
  document.addEventListener('visibilitychange', ()=>{
    releaseAllInputs();
    if (document.hidden && (state==='play'||state==='serve') && !window.__headless) pauseGame();
  });

  /* pointers (mouse + touch unified); body has touch-action:none */
  const ptrs = new Map();   // pointerId → {side,x0,y0,t0,nudged}
  const ptrSide = x => x < cssW/2 ? 'L':'R';
  document.addEventListener('pointerdown', e=>{
    if (e.target.closest('button,.overlay,#init')) return;
    AU.init(); AU.resume();
    try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
    const side = ptrSide(e.clientX);
    ptrs.set(e.pointerId, {side, x0:e.clientX, y0:e.clientY, t0:performance.now(), nudged:false});
    if (state==='serve') plungeHeld = true;
    ilog('pd '+e.pointerId+e.pointerType[0]+side);
    press(side, 'ptr:'+e.pointerId);
  });
  document.addEventListener('pointermove', e=>{
    modifierAudit(e);
    const o = ptrs.get(e.pointerId);
    if (o){
      const dy = e.clientY-o.y0, dx = e.clientX-o.x0;
      if (!o.nudged && performance.now()-o.t0 < 220 && dy < -30 && Math.abs(dy) > Math.abs(dx)*1.3){
        o.nudged = true; nudge(dx*1.4, -180);
      }
      /* watchdog: mouse button already up (release happened off-window) */
      if (e.pointerType==='mouse' && e.buttons===0) endPtr(e);
    }
  });
  function endPtr(e){
    const o = ptrs.get(e.pointerId);
    if (!o) return;
    ptrs.delete(e.pointerId);
    ilog('pu '+e.pointerId);
    releaseSrc(o.side, 'ptr:'+e.pointerId);
    if (state==='serve' && plungeHeld && ptrs.size===0) launch();
  }
  document.addEventListener('pointerup', endPtr);
  document.addEventListener('pointercancel', endPtr);
  /* keep page from scrolling/zooming on touch (some browsers ignore touch-action) */
  document.addEventListener('touchmove', e=>{
    if (!e.target.closest('button,.overlay')) e.preventDefault();
  }, {passive:false});
  document.addEventListener('contextmenu', e=>{ if (state==='play') e.preventDefault(); });

  /* ================= pause / overlays ================= */
  function show(id){ document.getElementById(id).classList.remove('hide'); }
  function hide(id){ document.getElementById(id).classList.add('hide'); }
  function pauseGame(){ if (state==='paused') return; pausedFrom = state; state='paused'; show('pause'); syncFlip('L'); syncFlip('R'); }
  function resumeGame(){ hide('pause'); state = pausedFrom||'play'; last = 0; syncFlip('L'); syncFlip('R'); }
  function quitToTitle(){
    hide('pause'); hide('over'); state='attract'; players=[];
    showTouchBtns(false); AU.drone(0); AU.shutUp();
    show('title'); renderBoardInto(null);
  }
  function showTouchBtns(onGame){
    ['btnPause','btnMute','btnView'].forEach(id=>{
      document.getElementById(id).classList.toggle('hide', !onGame);
    });
  }

  document.querySelectorAll('#title [data-p]').forEach(b=>{
    b.addEventListener('click', ()=> startGame(+b.dataset.p));
  });
  if ('ontouchstart' in window){
    document.getElementById('titleHint').innerHTML =
      'Hold <b>left / right half</b> for flippers · hold anywhere &amp; release to plunge · <b>swipe up</b> to nudge · top buttons: view · sound · pause';
  }
  document.getElementById('bHow').onclick = ()=>{ hide('title'); show('how'); };
  document.getElementById('bHowBack').onclick = ()=>{ hide('how'); show('title'); };
  document.getElementById('bGuide').onclick = ()=>{ hide('how'); show('guide'); buildGuide(); };
  document.getElementById('bGuideBack').onclick = ()=>{ hide('guide'); show('how'); };

  /* table guide: miniature playfield + numbered callouts, generated from the registry */
  function buildGuide(){
    const FEATURES = [
      { at: [TABLE.lamps.pool3.x, TABLE.lamps.pool3.y-58], name: '7-bank pool-ball drop targets',
        desc: '2,000 each + 7,000 bonus. Clear all 7 to light the 8-BALL.' },
      { at: [TABLE.lone.cx, TABLE.lone.cy], name: '8-BALL & corner pocket',
        desc: 'Knock the lone 8-ball target, then the saucer collects the rack (shoot it from the upper flipper).' },
      { at: [TABLE.deluxe[2].cx, TABLE.deluxe[2].cy], name: 'POCKET letters',
        desc: 'Exposed behind downed targets. Spell P-O-C-K-E-T for a replay.' },
      { at: [TABLE.inline[1].cx, TABLE.inline[1].cy], name: 'In-line drops + Bank Shot',
        desc: '4 drops raise your bonus to 5×; the target behind them scores 50,000.' },
      { at: [38, 470], name: 'Left lane (Bank Shot value)',
        desc: 'Climbs 10K→70K per trip; 70K lights extra ball. Loops to the top.' },
      { at: [TABLE.lamps.A.x, TABLE.lamps.A.y-18], name: 'A-B top lanes & 25,000 crown',
        desc: 'A-B-C-D completion spots a pool ball. The crown rollover pays 25,000 when lit.' },
      { at: [TABLE.lamps.C.x, TABLE.lamps.C.y+18], name: 'C / D inlanes',
        desc: 'Complete A-B-C-D with the flipper-return lanes.' },
      { at: [280, 946], name: 'Bonus multipliers',
        desc: '2× to 5× from the in-line drops — applied to your bonus at ball end. Bonus carries all game.' },
    ];
    const cv = document.getElementById('guideCv');
    const sc = 230 / TABLE.W;
    cv.width = 230; cv.height = Math.round(TABLE.H * sc);
    const g2 = cv.getContext('2d');
    g2.drawImage(ART.base, 0, 0, cv.width, cv.height);
    g2.fillStyle = 'rgba(8,6,3,.25)'; g2.fillRect(0,0,cv.width,cv.height);
    FEATURES.forEach((f, i) => {
      const x = f.at[0]*sc, y = f.at[1]*sc;
      g2.beginPath(); g2.arc(x, y, 9, 0, 7);
      g2.fillStyle = '#ffb347'; g2.fill();
      g2.strokeStyle = '#1a0e02'; g2.lineWidth = 1.5; g2.stroke();
      g2.fillStyle = '#1a0e02'; g2.font = '800 11px sans-serif';
      g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText(String(i+1), x, y+0.5);
    });
    document.getElementById('guideList').innerHTML =
      FEATURES.map(f => `<li><b style="color:#ffd98a">${f.name}</b><br>${f.desc}</li>`).join('');
  }
  document.getElementById('bScores').onclick = async ()=>{
    hide('title'); show('scores');
    document.getElementById('tBoard').innerHTML = '<div class="tiny">checking the wall…</div>';
    await Scores.fetchBoard();
    document.getElementById('tBoard').innerHTML = Scores.html();
  };
  document.getElementById('bScoresBack').onclick = ()=>{ hide('scores'); show('title'); };
  document.getElementById('bResume').onclick = resumeGame;
  document.getElementById('bQuit').onclick = quitToTitle;
  document.getElementById('btnPause').onclick = ()=>{ state==='paused'?resumeGame():pauseGame(); };
  document.getElementById('btnMute').onclick = ()=>{ AU.toggleMute(); };
  document.getElementById('btnView').onclick = ()=>{ fullView = !fullView; };

  /* initials */
  let initials = ['A','A','A'], initCur = 0;
  function paintInitials(){
    const el = document.getElementById('init'); if (!el) return;
    [...el.children].forEach((s,i)=>{
      s.textContent = initials[i];
      s.classList.toggle('cur', i===initCur);
    });
  }
  addEventListener('keydown', e=>{
    if (state!=='over' || document.getElementById('over').classList.contains('hide')) return;
    const k = e.key;
    if (/^[a-z0-9]$/i.test(k)){ initials[initCur] = k.toUpperCase(); initCur = Math.min(2,initCur+1); paintInitials(); }
    else if (k==='Backspace'){ e.preventDefault(); initCur = Math.max(0,initCur-1); paintInitials(); }
    else if (k==='ArrowLeft'){ initCur=Math.max(0,initCur-1); paintInitials(); }
    else if (k==='ArrowRight'){ initCur=Math.min(2,initCur+1); paintInitials(); }
    else if (k==='ArrowUp'||k==='ArrowDown'){
      const d = k==='ArrowUp'?1:-1;
      const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
      initials[initCur] = A[(A.indexOf(initials[initCur])+d+A.length)%A.length];
      paintInitials();
    }
    else if (k==='Enter') saveScore();
  });
  /* tap initials to cycle on touch */
  document.addEventListener('click', e=>{
    const sp = e.target.closest('#init span'); if (!sp) return;
    initCur = [...sp.parentNode.children].indexOf(sp);
    const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    initials[initCur] = A[(A.indexOf(initials[initCur])+1)%A.length];
    paintInitials();
  });

  async function saveScore(){
    const bestP = players.reduce((a,b)=>a.score>b.score?a:b, players[0]);
    const name = initials.join('');
    const card = document.getElementById('overCard');
    card.innerHTML = `<p class="sub">the pool hall wall</p><h1 class="logo" style="font-size:30px">Legends</h1>
      <div class="board" id="finalBoard"><div class="tiny">chalking it up…</div></div>
      <button class="btn" id="bAgain2">Play again</button>
      <button class="btn ghost" id="bTitle2">Title</button>`;
    document.getElementById('bAgain2').onclick = ()=>{ hide('over'); startGame(players.length); };
    document.getElementById('bTitle2').onclick = quitToTitle;
    await Scores.submit(name, bestP.score, bestP.racks+' rack'+(bestP.racks!==1?'s':''));
    await Scores.fetchBoard();
    document.getElementById('finalBoard').innerHTML = Scores.html(name, bestP.score);
  }
  function renderBoardInto(){ /* refresh title board lazily when opened */ }

  /* ================= global scores ================= */
  const Scores = {
    BASE:'https://game-scores.jez237.workers.dev/scores/',
    ns:'corner-pocket', board:null,
    url(){ return this.BASE+this.ns; },
    async fetchBoard(){
      try{
        const r = await fetch(this.url());
        const d = await r.json();
        this.board = (Array.isArray(d)?d:(d.scores||[]))
          .map(s=>({name:String(s.initials||s.name||'???').slice(0,3).toUpperCase(),score:s.score|0,extra:String(s.extra||'')}))
          .sort((a,b)=>b.score-a.score).slice(0,8);
      }catch(e){ this.board = 'offline'; }
      return this.board;
    },
    async submit(name,score,extra){
      try{
        await fetch(this.url(), {method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({initials:name,score,extra})});
        this.board = null;
      }catch(e){}
    },
    html(hlName,hlScore){
      if (this.board==='offline') return '<div class="tiny">the wall is unreachable — score kept locally</div>';
      if (!this.board) return '<div class="tiny">checking the wall…</div>';
      if (!this.board.length) return '<div class="tiny">no legends yet — run the table</div>';
      let done = false;
      return this.board.map((s,i)=>{
        const hl = !done && s.name===hlName && s.score===hlScore;
        if (hl) done = true;
        return `<div class="br"${hl?' style="background:rgba(255,179,71,.14);outline:1px solid rgba(255,179,71,.4)"':''}>`+
          `<span class="rk">${i+1}</span><span class="nm">${s.name}</span><span class="sc">${fmt(s.score)}</span><span class="ex">${s.extra}</span></div>`;
      }).join('');
    }
  };

  /* ================= boot ================= */
  TABLE.build();
  ART.build();
  resize();
  requestAnimationFrame(frame);

  /* headless screenshot staging: ?shot=play|full|title|serve (CI/visual checks) */
  window.__debugHud = new URLSearchParams(location.search).get('debug') === '1';
  const shotMode = new URLSearchParams(location.search).get('shot');
  if (shotMode){
    window.__headless = true;
    AU.setMute(true);
    if (shotMode !== 'title'){
      PHYS.seed(7); startGame(1);
      if (shotMode !== 'serve'){
        const b = PHYS.ball; b.held = false; b.vy = -2200; state = 'play';
        for (let i=0;i<240*2.2;i++) simStep();
        if (shotMode === 'full') fullView = true;
      }
    }
    updateCam(1); render(1);
  }

  /* ================= debug hooks ================= */
  window.__g = {
    get state(){
      const p = plr();
      return { mode:state, ball:{x:PHYS.ball.x,y:PHYS.ball.y,vx:PHYS.ball.vx,vy:PHYS.ball.vy,active:PHYS.ball.active,held:PHYS.ball.held},
        player: p? {score:p.score,bonusBalls:p.bonusBalls,bonusX:p.bonusX,racks:p.racks,letters:p.letters,abcd:p.abcd,bankLvl:p.bankLvl,drops:p.drops.slice(),lone:p.lone,extraBalls:p.extraBalls} : null,
        curP, ballNo, credits, tilted, nanCount, drainCount, saucerHolding:TABLE.saucer.holding };
    },
    step(ms){ const n = Math.round(ms/1000/PHYS.DT); for(let i=0;i<n;i++) simStep(); return this.snap(); },
    snap(){ const b=PHYS.ball; return {x:+b.x.toFixed(2),y:+b.y.toFixed(2),vx:+b.vx.toFixed(1),vy:+b.vy.toFixed(1),mode:state,nan:nanCount,drains:drainCount}; },
    setBall(x,y,vx,vy){ const b=PHYS.ball; b.active=true;b.held=false;b.x=x;b.y=y;b.px=x;b.py=y;b.vx=vx||0;b.vy=vy||0;b.w=0;b.lowTime=0; if(state==='serve')state='play'; },
    launch(power){ if(state!=='serve') return false; plungePull=Math.max(0,Math.min(1,power)); launch(); return true; },
    flip(side,on){ flip(side,on); },
    nudge(dx,dy){ nudge(dx,dy); },
    start(n){ startGame(n||1); },
    seed(s){ PHYS.seed(s); },
    sw(id){ handleEvent(id==='drain'?{type:'drain'}:id==='saucer'?{type:'saucer'}:id.startsWith('zone')||['bank','outL','outR'].includes(id)?{type:'zone',id}:{type:'hit',id,speed:200,x:0,y:0}); },
    endBall(){ PHYS.ball.active=false; handleEvent({type:'drain'}); },
    get phys(){ return PHYS; }, get table(){ return TABLE; },
    get ai(){ return AI; },
    get inputLog(){ return inputLog; },
    get flipSrc(){ return { L:[...flipSrc.L], R:[...flipSrc.R] }; },
    startDemo(){ startDemo(); }, stopDemo(){ endDemo(); },
    set headless(v){ window.__headless = v; },
    render(){ updateCam(1/60); render(1); return 'rendered'; },
    cam(y){ if (y!==undefined) cam.y = y; return cam.y; },
    view(full){ fullView = !!full; },
  };

  return { startGame };
})();
