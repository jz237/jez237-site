/* Corner Pocket II: Back Room — game logic, presentation, input, scores.
   Original money-game ruleset over the gen-two multiball engine; Pinball
   Illusions-style scrolling camera and LED/DMD panel. Deterministic sim
   (PHYS.seed + injected inputs) for tests.

   RULES SUMMARY
   · THE MONEY TABLE: knock the 3 captive pool balls into the mini pockets.
     Each sink pays the Money Ball value (climbs). Sink all 3 = RUN THE TABLE.
     Steel ball in a pocket = SCRATCH — Money Ball value resets.
   · HUSTLE 6-bank lights the LOCK. Back-room hole: wager award when unlit,
     ball lock when lit. Lock 2, then the third shot starts 3-ball MULTIBALL —
     pockets pay JACKPOT, the hole pays SUPER JACKPOT.
   · CHALK standups (behind the bank) light the Massé magnet save.
   · Spinner = stakes; 40 spins arm the kickback. Full loop advances bonus X.
   · A-B-C-D lights SIDE BET in the crown (mystery). Bankroll × X pays at
     ball end and carries the whole game. */
'use strict';

const GAME = (() => {

  /* ================= canvas / camera ================= */
  const canvas = document.getElementById('pf');
  const ctx = canvas.getContext('2d');
  let cssW=0, cssH=0, DPR=1, panelH=64;
  let zoom=1, zoomFull=1, fullView=false, ox=0;
  const cam = { y:0 };
  let shake = 0, shakeX = 0;

  function resize(){
    cssW = innerWidth; cssH = innerHeight;
    DPR = Math.min(devicePixelRatio||1, 2.2);
    if (cssW*cssH*DPR*DPR > 6.4e6) DPR = Math.sqrt(6.4e6/(cssW*cssH));
    canvas.width = Math.round(cssW*DPR); canvas.height = Math.round(cssH*DPR);
    canvas.style.width = cssW+'px'; canvas.style.height = cssH+'px';
    panelH = Math.max(54, Math.min(84, Math.round(cssH*0.085)));
    const availH = cssH - panelH;
    zoom = Math.min(cssW/TABLE.W, availH/430);
    zoomFull = Math.min(cssW/TABLE.W, availH/TABLE.H);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  addEventListener('resize', resize);
  addEventListener('orientationchange', ()=>setTimeout(resize,220));

  function multiView(){ return PHYS.liveSteel().length > 1; }
  function viewZoom(){ return (fullView || multiView() || zoom<=zoomFull+0.001) ? zoomFull : zoom; }

  function focusBall(){
    let f = null;
    for (const b of PHYS.balls){
      if (b.type!=='steel' || !b.active) continue;
      if (TABLE.lockHole.held.includes(b)) continue;
      if (!f || b.y > f.y) f = b;
    }
    return f;
  }

  function updateCam(dt){
    const z = viewZoom();
    const viewH = (cssH-panelH)/z;
    if (viewH >= TABLE.H){ cam.y = (TABLE.H-viewH)/2; return; }
    let ty;
    if (state==='attract'){
      ty = (TABLE.H-viewH)/2 + Math.sin(tNow*0.22)* (TABLE.H-viewH)/2 * 0.9;
    } else {
      const b = focusBall();
      const focusY = b ? b.y + b.vy*0.12 : 980;
      ty = focusY - viewH*0.52;
    }
    ty = Math.max(0, Math.min(TABLE.H-viewH, ty));
    const k = 1 - Math.exp(-dt*7.5);
    cam.y += (ty-cam.y)*k;
  }

  /* ================= DMD ================= */
  const F57 = {
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
    '?':[14,17,1,6,4,0,4],'+':[0,4,4,31,4,4,0],'$':[4,15,20,14,5,30,4],
  };
  const DMD = { W:104, H:22, q:[], cur:null };
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
  function dmdText(g, txt, cx, row){
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
    g.fillStyle = '#04140d'; g.fillRect(0,0,dmdCv.width,dmdCv.height);
    g.fillStyle = 'rgba(99,224,184,.07)';
    for (let y=0;y<DMD.H;y++) for(let x=0;x<DMD.W;x++) g.fillRect(x*3,y*3,2.2,2.2);
    g.fillStyle = '#63e0b8';
    const cur = DMD.cur;
    if (cur){
      const o = cur.opts;
      if (o.blink && (tNow*5|0)%2) { /* off-phase */ }
      else {
        const lines = cur.lines;
        const top = lines.length===1 ? 7 : 2;
        lines.forEach((ln,i)=> dmdText(g, ln, DMD.W/2, top+i*9));
      }
      if (o.ballAnim){
        const p = 1 - cur.tt/cur.dur;
        const bx = (4 + p*(DMD.W-8))|0, by = DMD.H-5;
        g.beginPath(); g.arc(bx*3, by*3, 6, 0, 7); g.fill();
        g.fillStyle='#04140d'; g.beginPath(); g.arc(bx*3,by*3,2.6,0,7); g.fill();
        g.fillStyle='#63e0b8';
      }
    } else {
      if (state==='play'||state==='serve'||state==='bonus'){
        const P = plr();
        dmdText(g, demoMode ? 'DEMO MODE' : 'PLAYER '+(curP+1)+'  BALL '+ballNo, DMD.W/2, 2);
        dmdText(g, demoMode ? 'PRESS START' : '$'+fmt(P.bankroll*5000)+' × '+P.bonusX, DMD.W/2, 12);
      } else {
        dmdText(g, 'BACK ROOM', DMD.W/2, 2);
        const hs = best();
        dmdText(g, hs? 'HI '+fmt(hs) : 'THE HOUSE WINS', DMD.W/2, 12);
      }
    }
    return dmdCv;
  }

  /* ================= state ================= */
  let state = 'attract';      // attract | serve | play | bonus-wait | bonus | bonus-end | over | paused
  let pausedFrom = null;
  let players = [], curP = 0, ballNo = 1, BALLS = 3;
  let credits = 0, tNow = 0;
  let tilted = false, tiltBob = 0;
  let plungePull = 0, plungeHeld = false;
  let seatBall = null, autoLaunch = 0, pendingServes = 0;
  let bonusTimer = 0, bonusLeft = 0, endTimer = 0;
  let doorTimer = 0, wagerTimer = 0, rackTimer = 0;
  let scratches = [];                 // {ball, t} — multiball can scratch twice
  const mb = { active:false, saveT:0, jack:100000 };
  const hr = { active:false, t:0 };
  let lastSpinUp = -99, clickCool = 0;
  let lastMajor = 0;
  let flashes = [];
  let bumpGlow = [0,0,0];
  let slingFlash = [0,0];
  let nanCount = 0, drainCount = 0;
  let attractIdle = 0;

  function newPlayer(){
    return { score:0, bankroll:0, bonusX:1,
             hustle:[true,true,true,true,true,true],   // targets still UP
             chalk:0, locks:0, runs:0, sunk:0, spins:0,
             moneyVal:25000, abcd:0, sbLit:false, masseLit:false,
             kickArmed:true, mbPlayed:false, hrDone:false,
             extraBalls:0, replays:0 };
  }
  const plr = () => players[curP];
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
  const best = () => +(localStorage.getItem('cp2-best')||0);

  /* ================= scoring ================= */
  const REPLAY_AT = [600000, 1200000];
  function score(n){
    const p = plr(); if (!p || tilted) return;
    if (hr.active) n *= 2;
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
  function bankroll(n){
    const p = plr(); if (!p) return;
    p.bankroll = Math.min(40, p.bankroll + n);
  }

  /* ================= lamps sync ================= */
  function syncLamps(){
    const L = TABLE.lamps, p = plr();
    if (!p) return;
    for (let i=0;i<3;i++) L['mb'+i].on = !!(p.sunk & (1<<i));
    L.run.on = p.sunk===7 || (rackTimer>0 && (tNow*4|0)%2===0);
    for (let i=0;i<5;i++) L['ch'+i].on = !!(p.chalk & (1<<i));
    for (let i=0;i<4;i++) L['x'+(i+2)].on = p.bonusX >= i+2;
    L.A.on = !!(p.abcd&1); L.B.on = !!(p.abcd&2);
    L.C.on = !!(p.abcd&4); L.D.on = !!(p.abcd&8);
    L.sb.on = p.sbLit && (tNow*3|0)%2===0;
    L.lockL.on = lockLit() && !mb.active && (tNow*3|0)%2===0;
    L.jackL.on = mb.active && (tNow*4|0)%2===0;
    L.masse.on = TABLE.magnet.lit;
    L.kickL.on = p.kickArmed;
    L.spinL.on = (tNow*2|0)%2===0;
    L.hr.on = hr.active ? (tNow*5|0)%2===0 : (p.runs>=2 && p.mbPlayed && !p.hrDone);
    L.again.on = p.extraBalls>0;
    L.pkAL.on = mb.active || (tNow*2|0)%2===0;
    L.pkBL.on = mb.active || (tNow*2|0)%2===1;
  }
  function attractLamps(){
    const L = TABLE.lamps, ids = Object.keys(L);
    const ph = (tNow*2.2)%3;
    ids.forEach((id,i)=>{
      const lp = L[id];
      if (ph<1) lp.on = (i + (tNow*8|0)) % 6 === 0;
      else if (ph<2) lp.on = Math.sin(lp.y*0.02 - tNow*5) > 0.6;
      else lp.on = (tNow*4|0)%2===0 && Math.sin(lp.x*0.05+lp.y)>0;
    });
  }
  function lockLit(){ const p = plr(); return p ? p.hustle.every(u=>!u) : false; }

  /* ================= game flow ================= */
  function startGame(n){
    AU.init(); AU.resume();
    players = []; for (let i=0;i<n;i++) players.push(newPlayer());
    curP = 0; ballNo = 1;
    hide('title'); hide('how'); hide('scores'); hide('over');
    showTouchBtns(true);
    AU.sfx.jingle();
    AU.say('Welcome to the back room', 2);
    dmdShow(['BACK ROOM','MONEY ON THE TABLE'],2.2);
    applyState();
    serve(false);
  }

  /* sync the physical table to the incoming player's saved state */
  function applyState(){
    const p = plr();
    doorTimer = 0; wagerTimer = 0; rackTimer = 0;
    scratches = []; pendingServes = 0;
    mb.active = false; mb.saveT = 0;
    hr.active = false; hr.t = 0;
    TABLE.drops.forEach((d,i)=>TABLE.setDrop(d, p.hustle[i]));
    TABLE.resetDoor(true);
    TABLE.magnet.lit = p.masseLit; TABLE.magnet.holding = null;
    p.kickArmed = true;
    /* object balls: hidden if sunk, racked otherwise */
    TABLE.objectBalls.forEach((b,i)=>{
      if (p.sunk & (1<<i)){ b.active = false; b.held = false; }
      else TABLE.respawnObject(b);
    });
    /* locked balls: match the physical hole to this player's lock count */
    const hole = TABLE.lockHole;
    while (hole.held.length > p.locks){
      const b = hole.held.pop(); b.active = false; b.held = false;
    }
    while (hole.held.length < p.locks){
      const b = troughBall();
      if (!b) break;
      const slot = hole.slots[hole.held.length];
      b.active = true; b.held = true;
      b.x = slot.x; b.y = slot.y; b.px=b.x; b.py=b.y; b.vx=0; b.vy=0;
      hole.held.push(b);
    }
  }
  function troughBall(){
    for (const b of TABLE.steelBalls)
      if (!b.active && !b.held && b !== seatBall) return b;
    return null;
  }
  function serveBall(auto){
    const b = troughBall();
    if (!b) return null;
    b.active = true; b.held = true; b.lowTime = 0; b._srch = 0;
    b.x = TABLE.PLUNGE.x; b.y = TABLE.PLUNGE.y; b.px=b.x; b.py=b.y;
    b.vx = 0; b.vy = 0; b.w = 0; b._zin = null;
    seatBall = b;
    plungePull = 0; plungeHeld = false;
    autoLaunch = auto ? 0.9 : 0;
    return b;
  }
  /* the seat holds ONE ball — extra saves queue until it launches */
  function requestServe(auto){
    if (seatBall){ pendingServes++; return; }
    serveBall(auto);
  }
  function serve(again){
    state = 'serve';
    tilted = false; tiltBob = 0;
    const p = plr();
    p.bonusX = 1; p.abcd = 1;                 // A spotted at ball start
    serveBall(false);
    if (!again) dmdShow(['PLAYER '+(curP+1),'BALL '+ballNo],1.8);
  }
  function launch(){
    if (!seatBall) return;
    const b = seatBall;
    b.held = false;
    b.vy = -(1390 + plungePull*1600) * (0.99+PHYS.rng()*0.02);
    b.vx = 0;
    AU.sfx.launch(plungePull);
    plungePull = 0; plungeHeld = false; autoLaunch = 0;
    seatBall = null;
    if (state==='serve') state = 'play';
    major();
  }
  /* every steel ball the PLAYER still owns: in play, seated, magnet-held,
     scratch-held, queued for serve, or awaiting a hole eject — everything
     except the machine's locked balls. Drains must not end the ball while
     any of these will come back. */
  function liveCount(){
    const p = plr();
    let n = pendingServes;
    const hole = TABLE.lockHole;
    const lockedForPlayer = Math.min(hole.held.length, p ? p.locks : 0);
    for (const b of PHYS.balls){
      if (b.type!=='steel' || !b.active) continue;
      if (hole.held.includes(b)) continue;
      n++;
    }
    n += hole.held.length - lockedForPlayer;   // wager / super-jackpot ejects pending
    return n;
  }

  function endOfBall(){
    const p = plr();
    seatBall = null; pendingServes = 0;
    if (tilted){ finishBall(); return; }
    state = 'bonus';
    bonusLeft = p.bankroll; bonusTimer = 0.45;
    dmdShow(['CASH OUT $'+fmt(p.bankroll*5000) + (p.bonusX>1?' ×'+p.bonusX:'')],1.4);
  }
  function finishBall(){
    if (demoMode){ endDemo(); return; }
    const p = plr();
    if (p.extraBalls > 0){
      p.extraBalls--;
      AU.say('Same player shoots again', 1);
      applyState();
      serve(true);
      return;
    }
    let nx = curP+1;
    if (nx >= players.length){ nx = 0; ballNo++; }
    if (ballNo > BALLS){ gameOver(); return; }
    curP = nx;
    applyState();
    serve(false);
  }
  function gameOver(){
    state = 'over'; AU.shutUp();
    AU.sfx.over();
    showTouchBtns(false);
    const m = (Math.floor(PHYS.rng()*10))*10;
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
    if (bestScore > best()) localStorage.setItem('cp2-best', bestScore);
    const card = document.getElementById('overCard');
    let rows = players.map((p,i)=>
      `<div><span>PLAYER ${i+1} · ${p.runs} run${p.runs!==1?'s':''}</span><span>${fmt(p.score)}</span></div>`).join('');
    card.innerHTML =
      `<p class="sub">game over</p><h1 class="logo" style="font-size:30px">Cash out</h1>`+
      `<div class="rows">${rows}</div>`+
      `<p class="tiny">best in this room: ${fmt(best())}</p>`+
      `<div class="init" id="init"><span class="cur">A</span><span>A</span><span>A</span></div>`+
      `<p class="tiny">put your name on the house ledger</p>`+
      `<button class="btn" id="bSave">Sign the ledger</button>`+
      `<button class="btn ghost" id="bSkip">Play again</button>`;
    show('over');
    initials = ['A','A','A']; initCur = 0; paintInitials();
    document.getElementById('bSave').onclick = saveScore;
    document.getElementById('bSkip').onclick = ()=>{ hide('over'); startGame(players.length); };
  }

  /* ================= rules: switch handling ================= */
  function major(){ lastMajor = tNow; }
  const pick = a => a[(PHYS.rng()*a.length)|0];

  function hustleDown(i, spotted){
    const p = plr();
    if (!p.hustle[i]) return;
    p.hustle[i] = false;
    TABLE.setDrop(TABLE.drops[i], false);
    bankroll(1); score(3000);
    AU.sfx.drop(); major();
    const d = TABLE.drops[i];
    addFlash(d.cx, d.cy, 46, '255,210,87');
    if (p.hustle.every(u=>!u)){
      dmdShow(['HUSTLE!','LOCK IS LIT'],2,{blink:true});
      AU.say('Lock is lit. Bring it to the back room', 1);
      score(15000);
    } else if (spotted){
      AU.sfx.spot();
    }
  }

  function startMultiball(){
    const p = plr();
    p.locks = 0; p.mbPlayed = true;
    p.hustle = p.hustle.map(()=>true);           // bank resets for the next cycle
    TABLE.resetBank();
    mb.active = true; mb.saveT = 12; mb.jack = 100000;
    const out = TABLE.holeRelease();
    for (const b of out){ b._zin = null; b._srch = 0; }
    AU.sfx.multiball(); major();
    AU.say('Multiball. Rob the house blind', 2);
    dmdShow(['MULTIBALL','JACKPOT AT THE POCKETS'],2.6,{blink:true});
    addFlash(TABLE.lockHole.x, TABLE.lockHole.y, 150, '255,210,87');
  }
  function endMultiball(){
    if (!mb.active) return;
    mb.active = false; mb.saveT = 0;
    doorTimer = 1.2;                             // door pops back up
    dmdShow(['MULTIBALL OVER'],1.4);
  }

  function startHighRoller(){
    const p = plr();
    p.hrDone = true;
    hr.active = true; hr.t = 40;
    AU.sfx.jackpot(); major();
    AU.say('High roller. Everything pays double', 2);
    dmdShow(['HIGH ROLLER','EVERYTHING ×2 · 40 SEC'],2.6,{blink:true});
  }

  function mysteryAward(){
    const p = plr();
    const awards = [
      ()=>{ score(50000); dmdShow(['SIDE BET','50,000'],1.8); },
      ()=>{ p.moneyVal = Math.min(95000, p.moneyVal+20000); dmdShow(['SIDE BET','MONEY BALL UP'],1.8); },
      ()=>{ const i = p.hustle.findIndex(u=>u); if (i>=0) hustleDown(i,true); dmdShow(['SIDE BET','HUSTLE SPOTTED'],1.8); },
      ()=>{ bankroll(3); dmdShow(['SIDE BET','BANKROLL +3'],1.8); },
      ()=>{ p.kickArmed = true; dmdShow(['SIDE BET','KICKBACK LIT'],1.8); },
      ()=>{ TABLE.magnet.lit = true; p.masseLit = true; dmdShow(['SIDE BET','MASSE LIT'],1.8); },
    ];
    pick(awards)();
    AU.sfx.sidebet(); major();
  }

  function handleEvent(ev){
    if (window.__hitlog) window.__hitlog.push(ev.id || ev.type);
    const p = plr();
    switch (ev.type){
      case 'nan': nanCount++; return;
      case 'click':
        if (clickCool <= 0){ AU.sfx.click(ev.speed); clickCool = 0.05; }
        if (ev.obj && ev.speed > 250) score(510);
        return;
      case 'drain': {
        drainCount++;
        if (ev.ball.type === 'object'){
          /* a wandering pool ball found the drain — quietly re-rack it */
          const i = TABLE.objectBalls.indexOf(ev.ball);
          if (p && !(p.sunk & (1<<i))) setTimeout0(()=>TABLE.respawnObject(ev.ball), 1.4);
          return;
        }
        if (state!=='play' && state!=='serve') return;
        if (mb.saveT > 0){
          requestServe(true);
          dmdShow(['BALL SAVED'],1);
          return;
        }
        const left = liveCount();
        if (left >= 1){
          if (mb.active && left <= 1) endMultiball();
          AU.sfx.drain();
          return;
        }
        AU.sfx.drain();
        if (!tilted && PHYS.rng()<0.45) AU.say(pick(['The house thanks you','Pay the man','Better luck next life']), 0);
        endTimer = 0.9;
        state = 'bonus-wait';
        return;
      }
      case 'moneyPocket': {
        if (!p) return;
        const i = TABLE.objectBalls.indexOf(ev.ball);
        if (i>=0) p.sunk |= (1<<i);
        const val = mb.active ? p.moneyVal*2 : p.moneyVal;
        score(val); bankroll(2);
        AU.sfx.cash(); major();
        addFlash(ev.x, ev.y, 90, '255,210,87');
        dmdShow([ev.ball.num+' BALL SUNK','$'+fmt(val)],1.6);
        if (mb.active){ AU.sfx.jackpot(); dmdShow(['JACKPOT','$'+fmt(val)],2,{blink:true}); }
        p.moneyVal = Math.min(95000, p.moneyVal + 10000);
        if (p.sunk === 7){
          p.runs++; bankroll(4);
          score(100000 * Math.min(3, p.runs));
          AU.sfx.runTable();
          AU.say('Run the table! Money in the bank', 2);
          dmdShow(['RUN THE TABLE','$'+fmt(100000*Math.min(3,p.runs))],2.6,{ballAnim:true});
          rackTimer = 1.6;
          if (p.runs === 2) extraBall();
        }
        return;
      }
      case 'scratch': {
        if (!p) return;
        scratches.push({ball: ev.ball, t: 0.9});
        p.moneyVal = 25000;
        AU.sfx.scratch(); major();
        AU.say(pick(['You scratched. Pay up','Scratch. That comes out of your pocket']), 1);
        dmdShow(['SCRATCH!','MONEY BALL RESET'],2,{blink:true});
        addFlash(ev.x, ev.y, 60, '255,90,110');
        return;
      }
      case 'hole': {
        if (!p) return;
        AU.sfx.hole(); major();
        if (mb.active){
          score(250000);
          AU.sfx.jackpot();
          AU.say('Super jackpot', 2);
          dmdShow(['SUPER JACKPOT','250,000'],2.4,{blink:true});
          addFlash(TABLE.lockHole.x, TABLE.lockHole.y, 130, '255,157,240');
          wagerTimer = 1.2;
        } else if (p.runs>=2 && p.mbPlayed && !p.hrDone){
          startHighRoller();
          score(50000);
          wagerTimer = 1.6;
        } else if (lockLit()){
          if (p.locks >= 2){
            score(50000);
            startMultiball();
          } else {
            p.locks++;
            score(25000); bankroll(1);
            AU.sfx.lock();
            AU.say('Ball '+p.locks+' locked', 1);
            dmdShow(['BALL '+p.locks+' LOCKED', p.locks===2?'ONE MORE FOR MULTIBALL':'LOCK ANOTHER'],2.2,{blink:true});
            serveBall(false);
            doorTimer = 1.4;
          }
        } else {
          /* the wager: hold the ball, spin the wheel */
          score(5000);
          wagerTimer = 1.5;
          const p2 = p;
          const awards = [
            ()=>{ score(25000); dmdShow(['WAGER PAYS','25,000'],1.6); },
            ()=>{ score(50000); dmdShow(['WAGER PAYS','50,000'],1.6); },
            ()=>{ p2.moneyVal = Math.min(95000, p2.moneyVal+15000); dmdShow(['WAGER PAYS','MONEY BALL UP'],1.6); },
            ()=>{ const i = p2.hustle.findIndex(u=>u); if (i>=0){ hustleDown(i,true); } dmdShow(['WAGER PAYS','HUSTLE SPOTTED'],1.6); },
            ()=>{ bankroll(2); dmdShow(['WAGER PAYS','BANKROLL +2'],1.6); },
            ()=>{ p2.kickArmed = true; dmdShow(['WAGER PAYS','KICKBACK LIT'],1.6); },
          ];
          pick(awards)();
          AU.sfx.sidebet();
        }
        return;
      }
      case 'magnet':
        AU.sfx.magnetGrab(); major();
        dmdShow(['MASSE SAVE'],1.2,{blink:true});
        return;
      case 'magnetFling': {
        AU.sfx.magnetFling();
        plr().masseLit = false;
        addFlash(TABLE.magnet.x, TABLE.magnet.y, 90, '200,135,255');
        AU.say('Nice massé', 0);
        return;
      }
      case 'spin': {
        if (state!=='play' && state!=='serve') return;
        if (!p) return;
        score(mb.active ? 3000 : 1000);
        AU.sfx.spinTick();
        p.spins++;
        if (ev.up) lastSpinUp = tNow;
        if (p.spins % 40 === 0 && !p.kickArmed){
          p.kickArmed = true;
          dmdShow(['KICKBACK LIT'],1.4);
          AU.sfx.spot();
        }
        return;
      }
      case 'zone': return handleZone(ev);
      case 'hit':  return handleHit(ev);
    }
  }

  function awardLoop(p){
    lastSpinUp = -99;
    score(10000); AU.sfx.bankshot(); major();
    if (p.bonusX < 5){
      p.bonusX++;
      dmdShow(['FULL LOOP','BONUS '+p.bonusX+'×'],1.5);
    } else {
      score(15000);
      dmdShow(['FULL LOOP','25,000'],1.4);
    }
    addFlash(82,300, 80, '143,208,255');
  }

  /* setTimeout at sim rate (deterministic) */
  const simTimers = [];
  function setTimeout0(fn, t){ simTimers.push({fn, t}); }
  function stepSimTimers(dt){
    for (let i=simTimers.length-1;i>=0;i--){
      simTimers[i].t -= dt;
      if (simTimers[i].t <= 0){ const f = simTimers[i].fn; simTimers.splice(i,1); f(); }
    }
  }

  function handleZone(ev){
    const p = plr();
    const id = ev.id;
    if (state!=='play' && state!=='serve') return;
    if (ev.ball && ev.ball.type !== 'steel') return;
    switch (id){
      case 'zoneA': case 'zoneB': case 'zoneC': case 'zoneD': {
        /* an up-spin followed by a top lane = the inner loop came all the way round */
        if ((id==='zoneA'||id==='zoneB') && state==='play' && tNow - lastSpinUp < 2.6) awardLoop(p);
        const bit = {zoneA:1,zoneB:2,zoneC:4,zoneD:8}[id];
        score(1000); AU.sfx.rollover(); major();
        if (!(p.abcd & bit)){
          p.abcd |= bit;
          if (p.abcd === 15){
            p.abcd = 0; score(10000);
            p.sbLit = true;
            AU.sfx.spot();
            dmdShow(['A-B-C-D','SIDE BET IS LIT'],1.8);
          }
        }
        return;
      }
      case 'sidebet': {
        if (state==='play' && tNow - lastSpinUp < 2.6) awardLoop(p);
        if (p.sbLit){ p.sbLit = false; mysteryAward(); addFlash(280,60,60,'255,210,87'); }
        else { score(1000); AU.sfx.rollover(); }
        return;
      }
      case 'outL': case 'outR':
        if (state==='play'){ score(5000); AU.sfx.rollover(); }
        return;
      case 'kick': {
        if (state!=='play') return;
        if (p.kickArmed && ev.ball && ev.ball.vy > -40){
          p.kickArmed = false;
          TABLE.kickbackFire(ev.ball);
          score(5000); AU.sfx.kickback(); major();
          dmdShow(['KICKBACK'],1);
          addFlash(38,1008, 60, '255,90,110');
        }
        return;
      }
    }
  }

  function handleHit(ev){
    const p = plr();
    if (!p) return;
    const id = ev.id;
    if (/^h[0-5]$/.test(id)){
      if (ev.speed > 55) hustleDown(+id.slice(1), false);
      return;
    }
    if (id.startsWith('ch')){
      const i = +id.slice(2);
      if (ev.speed > 40 && !(p.chalk & (1<<i))){
        p.chalk |= (1<<i);
        score(3000); AU.sfx.standup(); major();
        const st = TABLE.chalk[i];
        addFlash(st.cx, st.cy, 40, '143,208,255');
        if (p.chalk === 31){
          p.chalk = 0;
          score(15000);
          TABLE.magnet.lit = true; p.masseLit = true;
          AU.sfx.spot();
          AU.say('Chalk up. Massé is ready', 1);
          dmdShow(['C-H-A-L-K','MASSE SAVE LIT'],2.2,{blink:true});
        }
      }
      return;
    }
    if (id === 'door'){
      if (TABLE.door.up && ev.speed > 55){
        TABLE.resetDoor(false);
        score(5000); AU.sfx.drop(); major();
        addFlash(458,301, 50, '255,157,240');
        dmdShow([mb.active?'SHOOT THE HOLE':'THE DOOR IS OPEN'],1.2);
      }
      return;
    }
    if (id.startsWith('bump')){
      const i = +id.slice(4), b = TABLE.bumpers[i];
      if (b.cool <= 0 && ev.ball){
        b.cool = 0.07;
        const ball = ev.ball;
        const dx = ball.x-b.x, dy = ball.y-b.y, dl = Math.hypot(dx,dy)||1;
        const kick = 1000 + PHYS.rng()*110;
        ball.vx = ball.vx*0.3 + dx/dl*kick;
        ball.vy = ball.vy*0.3 + dy/dl*kick;
        ball.slide = 0.34;
        score(100); AU.sfx.bumper();
        bumpGlow[i] = 1;
        addFlash(b.x,b.y, 56, '110,224,172');
      }
      return;
    }
    if (id === 'slingL' || id === 'slingR'){
      const i = id==='slingL'?0:1, s = TABLE.slings[i];
      if (s.cool <= 0 && ev.speed > 35 && ev.ball){
        s.cool = 0.15;
        ev.ball.vx += s.nx*960; ev.ball.vy += s.ny*960 - 110;
        ev.ball.slide = 0.28;
        score(100); AU.sfx.sling();
        slingFlash[i] = 1;
      }
      return;
    }
  }

  /* ================= per-frame sim glue ================= */
  PHYS.cb.zones = TABLE.zonesCheck;
  PHYS.cb.preStep = function(dt){
    TABLE.tick(dt);
    /* queued saves take the seat as soon as it frees up */
    if (!seatBall && pendingServes > 0){
      pendingServes--;
      serveBall(true);
    }
    /* plunger seat */
    if (seatBall){
      if (plungeHeld && plungePull<1) plungePull = Math.min(1, plungePull + dt*1.35);
      seatBall.x = TABLE.PLUNGE.x; seatBall.y = TABLE.PLUNGE.y + plungePull*20;
      if (autoLaunch > 0){
        autoLaunch -= dt;
        if (autoLaunch <= 0){ plungePull = 0.85 + PHYS.rng()*0.15; launch(); }
      }
    }
    /* back-room door pops back up */
    if (doorTimer > 0){
      doorTimer -= dt;
      if (doorTimer <= 0 && !mb.active) TABLE.resetDoor(true);
    }
    /* wager / super-jackpot hole eject — re-arm until only locked balls remain */
    if (wagerTimer > 0){
      wagerTimer -= dt;
      if (wagerTimer <= 0 && plr() && TABLE.lockHole.held.length > plr().locks){
        TABLE.holeEject(); AU.sfx.eject();
        doorTimer = 1.2;
        if (TABLE.lockHole.held.length > plr().locks) wagerTimer = 1.0;
      }
    }
    /* re-rack after RUN THE TABLE */
    if (rackTimer > 0){
      rackTimer -= dt;
      if (rackTimer <= 0){
        const p = plr();
        if (p){ p.sunk = 0; TABLE.rackObjects(false); AU.sfx.spot(); }
      }
    }
    /* scratch: hold the cue ball in the pocket, then spit it out the mouth */
    for (let i=scratches.length-1;i>=0;i--){
      const s = scratches[i];
      s.t -= dt;
      if (s.t <= 0){
        scratches.splice(i,1);
        const b = s.ball;
        b.held = false;
        b.x = 250 + i*4; b.y = 636; b.px=b.x; b.py=b.y;
        b.vx = (PHYS.rng()-0.5)*80; b.vy = 260;
        AU.sfx.eject();
      }
    }
  };

  function nudge(dx,dy){
    if (state!=='play' || tilted) return;
    for (const b of PHYS.liveSteel()){ b.vx += dx; b.vy += dy; }
    shake = 0.4; shakeX = dx*0.014;
    AU.sfx.nudge();
    tiltBob += 1;
    if (tiltBob >= 3){
      tilted = true;
      TABLE.FL.on = TABLE.FR.on = TABLE.FU.on = false;
      AU.sfx.tilt(); AU.say('Tilt. House keeps the stake', 2);
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
    if (clickCool > 0) clickCool -= PHYS.DT;
    stepSimTimers(PHYS.DT);

    if (mb.saveT > 0){
      mb.saveT -= PHYS.DT;
      if (mb.saveT <= 0) dmdShow(['BALL SAVE OFF'],0.9);
    }
    if (hr.active){
      hr.t -= PHYS.DT;
      if (hr.t <= 0){ hr.active = false; dmdShow(['HIGH ROLLER OVER'],1.4); }
    }

    if (state==='bonus-wait'){
      endTimer -= PHYS.DT;
      if (endTimer<=0) endOfBall();
    } else if (state==='bonus'){
      bonusTimer -= PHYS.DT;
      if (bonusTimer<=0){
        if (bonusLeft>0 && !tilted){
          bonusLeft--;
          score(5000*plr().bonusX);
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
      /* multiball bookkeeping backstop (covers non-drain ball exits) */
      if (mb.active && liveCount() <= 1) endMultiball();
      /* weak plunge fell back to the seat → re-seat it */
      if (!seatBall){
        for (const b of PHYS.liveSteel()){
          if (b.x>504 && b.y>1030 && Math.abs(b.vy)<28 && Math.abs(b.vx)<28){
            b.held = true; seatBall = b; plungePull = 0;
            if (liveCount() === 1) state = 'serve';
            break;
          }
        }
      }
      /* stuck-ball rescue, per steel ball */
      for (const b of PHYS.liveSteel()){
        if (b.lowTime > 3 && b.y < 1050){
          if (window.__searchCount !== undefined) window.__searchCount++;
          if (window.__noSearch){ b.lowTime = 0; continue; }
          b.lowTime = 0;
          b._srch = (b._srch||0)+1;
          if (b._srch >= 3 && liveCount() === 1){
            b._srch = 0;
            b.held = true; b.x = TABLE.PLUNGE.x; b.y = TABLE.PLUNGE.y;
            b.px = b.x; b.py = b.y; b.vx = 0; b.vy = 0; b.w = 0;
            seatBall = b; plungePull = 0; plungeHeld = false;
            state = 'serve';
            dmdShow(['BALL SEARCH','BALL RETURNED'],1.8);
          } else if (b._srch >= 2){
            const dx = 280-b.x, dy = 780-b.y, dl = Math.hypot(dx,dy)||1;
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
        AU.say(pick(['The house always wins','That all you got, kid?','Money on the table. Take it',
                     'You gonna shoot or just stand there?']), 0);
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
  let auditT = 0;

  /* ================= AI player (attract demo + test harness) ================= */
  let demoMode = false;
  const AI = {
    on: false, holdL: 0, holdR: 0, coolL: 0, coolR: 0, plungeT: 0, lastNudge: -9,
    step(){
      if (!this.on) return;
      if (seatBall){
        this.plungeT += PHYS.DT;
        if (this.plungeT > 1.1){
          plungePull = 0.5 + PHYS.rng()*0.5;
          launch();
          this.plungeT = 0;
        }
        return;
      }
      if (state !== 'play') return;
      let zoneL = false, zoneR = false, nearFU = false, low = null;
      for (const b of PHYS.liveSteel()){
        if (b.y > 935 && b.y < 1058 && b.vy > -60 && b.x > 160 && b.x < 295) zoneL = true;
        if (b.y > 935 && b.y < 1058 && b.vy > -60 && b.x > 265 && b.x < 400) zoneR = true;
        if (b.x > 330 && b.x < 432 && b.y > 425 && b.y < 515 && b.vy > -40) nearFU = true;
        if (!low || b.y > low.y) low = b;
      }
      if (zoneL && this.coolL <= 0){ flip('L', true); this.holdL = 0.10 + PHYS.rng()*0.10; this.coolL = 0.5; }
      if ((zoneR || nearFU) && this.coolR <= 0){ flip('R', true); this.holdR = 0.09 + PHYS.rng()*0.10; this.coolR = 0.5; }
      if (this.holdL > 0){ this.holdL -= PHYS.DT; if (this.holdL <= 0) flip('L', false); }
      if (this.holdR > 0){ this.holdR -= PHYS.DT; if (this.holdR <= 0) flip('R', false); }
      if (this.coolL > 0) this.coolL -= PHYS.DT;
      if (this.coolR > 0) this.coolR -= PHYS.DT;
      if (low && low.y > 1010 && Math.abs(low.x-280) < 26 && low.vy > 150 && tNow - this.lastNudge > 5){
        this.lastNudge = tNow;
        nudge((low.x < 280 ? 1 : -1) * 140, -150);
      }
    },
    reset(){ this.holdL = this.holdR = this.coolL = this.coolR = this.plungeT = 0; flip('L',false); flip('R',false); }
  };
  function startDemo(){
    demoMode = true; AI.reset(); AI.on = true;
    players = [newPlayer()]; curP = 0; ballNo = 1;
    hide('title'); hide('how'); hide('scores');
    applyState();
    serve(false);
    dmdShow(['DEMO','PRESS START'], 3);
  }
  function endDemo(){
    if (!demoMode) return;
    demoMode = false; AI.on = false; AI.reset();
    players = []; state = 'attract'; attractIdle = 0;
    seatBall = null; pendingServes = 0;
    for (const b of PHYS.steel()){ b.active=false; b.held=false; }
    TABLE.lockHole.held.length = 0;
    AU.shutUp();
    show('title');
  }
  window.addEventListener('keydown', () => { attractIdle = 0; if (demoMode) endDemo(); }, true);
  window.addEventListener('pointerdown', () => { attractIdle = 0; if (demoMode) endDemo(); }, true);

  /* ================= flash fx ================= */
  function addFlash(x,y,r,col){ flashes.push({x,y,r,col,age:0,max:0.35}); if(flashes.length>24)flashes.shift(); }

  /* ================= render ================= */
  const HCOLS = ['#d8a028','#2467c4','#cf3a28','#7b3fa0','#e06a1f','#2e7d4f'];
  function render(alpha){
    const z = viewZoom();
    const viewW = TABLE.W*z;
    ox = Math.max(0,(cssW-viewW)/2);
    const bg = ctx.createLinearGradient(0,0,cssW,0);
    bg.addColorStop(0,'#030604'); bg.addColorStop(.5,'#0a120c'); bg.addColorStop(1,'#030604');
    ctx.fillStyle = bg; ctx.fillRect(0,0,cssW,cssH);
    if (ox > 2){
      for (const side of [ox-14, ox+viewW]){
        const rg = ctx.createLinearGradient(side,0,side+14,0);
        rg.addColorStop(0,'#20130a'); rg.addColorStop(.45,'#33200f'); rg.addColorStop(1,'#140c06');
        ctx.fillStyle = rg; ctx.fillRect(side,panelH,14,cssH-panelH);
        ctx.fillStyle = 'rgba(255,210,87,.16)';
        ctx.fillRect(side+2,panelH,1.5,cssH-panelH);
      }
    }

    ctx.save();
    ctx.beginPath(); ctx.rect(ox,panelH,viewW,cssH-panelH); ctx.clip();
    ctx.translate(ox + shakeX*46*shake, panelH + (shake>0? Math.sin(tNow*70)*5*shake:0));
    ctx.scale(z,z);
    ctx.translate(0, -cam.y);

    ctx.drawImage(ART.base, 0,0,TABLE.W*ART.SC,TABLE.H*ART.SC, 0,0,TABLE.W,TABLE.H);

    if (state==='attract') attractLamps(); else syncLamps();
    ART.drawLamps(ctx, tNow);

    /* devices */
    const p = plr();
    TABLE.drops.forEach((d,i)=> ART.drawDropTarget(ctx,d, HCOLS[i], d.letter));
    ART.drawDropTarget(ctx, TABLE.door, '#16161a','$');
    TABLE.chalk.forEach((st,i)=> ART.drawStandup(ctx,st,'CHALK'[i], p? !!(p.chalk&(1<<i)) : false));
    TABLE.bumpers.forEach((b,i)=>{ ART.drawBumper(ctx,b,bumpGlow[i],tNow); });
    ART.drawSpinner(ctx, TABLE.spinner, tNow);
    ART.drawMagnet(ctx, TABLE.magnet, tNow);
    ART.drawKicker(ctx, TABLE.kicker, p ? p.kickArmed : false);
    ART.drawHole(ctx, TABLE.lockHole);
    ART.drawGate(ctx);
    ART.drawPlunger(ctx, plungePull);
    ART.drawFlipper(ctx, TABLE.FL); ART.drawFlipper(ctx, TABLE.FR); ART.drawFlipper(ctx, TABLE.FU);

    /* object balls */
    for (const b of TABLE.objectBalls){
      if (!b.active) continue;
      ART.drawObjectBall(ctx, b);
    }
    /* steel balls */
    for (const b of PHYS.steel()){
      if (!b.active && b !== seatBall) continue;
      if (TABLE.lockHole.held.includes(b)) continue;   // drawn by drawHole
      const bx = b.px + (b.x-b.px)*alpha, by = b.py + (b.y-b.py)*alpha;
      const spd = Math.hypot(b.vx, b.vy);
      if (spd > 1200){
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

    if (tilted){
      ctx.fillStyle = 'rgba(3,8,5,.45)';
      ctx.fillRect(0,cam.y,TABLE.W,cssH/z);
    }
    const edgeW = 26/z;
    for (const [x0,x1] of [[0,edgeW],[TABLE.W,TABLE.W-edgeW]]){
      const eg = ctx.createLinearGradient(x0,0,x1,0);
      eg.addColorStop(0,'rgba(4,12,8,.34)'); eg.addColorStop(1,'rgba(4,12,8,0)');
      ctx.fillStyle = eg;
      ctx.fillRect(Math.min(x0,x1),cam.y,edgeW,cssH/z+4);
    }
    ctx.restore();

    renderPanel();
  }

  function renderPanel(){
    const g = ctx.createLinearGradient(0,0,0,panelH);
    g.addColorStop(0,'#0a1610'); g.addColorStop(1,'#050c08');
    ctx.fillStyle = g; ctx.fillRect(0,0,cssW,panelH);
    ctx.fillStyle = 'rgba(99,224,184,.25)'; ctx.fillRect(0,panelH-1.5,cssW,1.5);

    const pad = 12;
    ctx.textBaseline = 'middle';
    const n = players.length || 1;
    const ledCol = '#63e0b8';
    ctx.shadowColor = 'rgba(99,224,184,.7)';
    if (state==='attract' && !players.length){
      ctx.shadowBlur = 10;
      ctx.fillStyle = ledCol;
      ctx.font = `700 ${Math.round(panelH*0.34)}px Consolas,monospace`;
      ctx.textAlign='left';
      ctx.fillText('BACK ROOM', pad, panelH*0.32);
      ctx.font = `600 ${Math.round(panelH*0.22)}px Consolas,monospace`;
      ctx.fillStyle = '#5e9a82';
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
        ctx.fillStyle = act? '#a8f0d4' : 'rgba(99,224,184,.55)';
        ctx.fillText(fmt(p.score), x, y);
        if (n<=2 || act){
          ctx.shadowBlur = 0;
          ctx.font = `600 ${Math.round(panelH*0.17)}px Consolas,monospace`;
          ctx.fillStyle = act ? '#5e9a82':'rgba(94,154,130,.5)';
          if (n<=2) ctx.fillText('P'+(i+1)+(act?' ◂':''), x, y+panelH*0.3);
        }
      });
      ctx.shadowBlur = 0;
      ctx.font = `600 ${Math.round(panelH*0.18)}px Consolas,monospace`;
      ctx.fillStyle = '#5e9a82'; ctx.textAlign='left';
      const info = state==='attract' ? 'GAME OVER' : 'BALL '+ballNo+' / '+BALLS + (mb.active? '  MULTIBALL':'');
      ctx.fillText(info+'   CREDITS '+credits, pad, panelH*0.88);
    }
    ctx.shadowBlur = 0;

    if (window.__debugHud){
      ctx.font = '11px Consolas,monospace'; ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(4, panelH+4, 250, 110);
      ctx.fillStyle = TABLE.FL.on ? '#7dff8a' : '#888';
      ctx.fillText('FL '+(TABLE.FL.on?'UP':'dn')+' ['+[...flipSrc.L].join(' ')+']', 8, panelH+8);
      ctx.fillStyle = TABLE.FR.on ? '#7dff8a' : '#888';
      ctx.fillText('FR '+(TABLE.FR.on?'UP':'dn')+' ['+[...flipSrc.R].join(' ')+']', 8, panelH+22);
      ctx.fillStyle = '#5e9a82';
      inputLog.slice(-6).forEach((l,i)=> ctx.fillText(l.t%100000+' '+l.e, 8, panelH+38+i*12));
    }

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
    for (const d of [...TABLE.drops, TABLE.door]){
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
     blur, hide, pointercancel, and a buttons-watchdog. */
  const LKEYS = ['ShiftLeft','KeyZ','ArrowLeft','KeyA'];
  const RKEYS = ['ShiftRight','Slash','ArrowRight','KeyD','Quote'];
  const flipSrc = { L:new Set(), R:new Set() };
  const keyLastSeen = {};

  const inputLog = [];
  function ilog(ev){
    inputLog.push({ t: performance.now()|0, e: ev,
                    L: [...flipSrc.L].join('|'), R: [...flipSrc.R].join('|') });
    if (inputLog.length > 200) inputLog.shift();
  }

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
        if (code === 'ShiftLeft' || code === 'ShiftRight') continue;
        if (tNow - (keyLastSeen[code]||0) > 2.0){
          ilog('watchdog -'+code);
          releaseSrc(side, src);
        }
      }
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
      if (seatBall && !e.repeat){ plungeHeld = true; AU.resume(); }
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
    if (c==='Space'||c==='ArrowDown'){ if (seatBall && plungeHeld) launch(); }
  });
  addEventListener('blur', ()=>{ ilog('blur'); releaseAllInputs();
    if (state==='play'||state==='serve') pauseGame(); });
  document.addEventListener('visibilitychange', ()=>{
    releaseAllInputs();
    if (document.hidden && (state==='play'||state==='serve') && !window.__headless) pauseGame();
  });

  /* pointers (mouse + touch unified) */
  const ptrs = new Map();
  const ptrSide = x => x < cssW/2 ? 'L':'R';
  document.addEventListener('pointerdown', e=>{
    if (e.target.closest('button,.overlay,#init,a')) return;
    AU.init(); AU.resume();
    try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
    const side = ptrSide(e.clientX);
    ptrs.set(e.pointerId, {side, x0:e.clientX, y0:e.clientY, t0:performance.now(), nudged:false});
    if (seatBall) plungeHeld = true;
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
      if (e.pointerType==='mouse' && e.buttons===0) endPtr(e);
    }
  });
  function endPtr(e){
    const o = ptrs.get(e.pointerId);
    if (!o) return;
    ptrs.delete(e.pointerId);
    ilog('pu '+e.pointerId);
    releaseSrc(o.side, 'ptr:'+e.pointerId);
    if (seatBall && plungeHeld && ptrs.size===0) launch();
  }
  document.addEventListener('pointerup', endPtr);
  document.addEventListener('pointercancel', endPtr);
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
    seatBall = null; pendingServes = 0;
    for (const b of PHYS.steel()){ b.active=false; b.held=false; }
    TABLE.lockHole.held.length = 0;
    showTouchBtns(false); AU.shutUp();
    show('title');
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
      'v1 · Hold <b>left / right half</b> for flippers · hold anywhere &amp; release to plunge · <b>swipe up</b> to nudge · top buttons: view · sound · pause';
  }
  document.getElementById('bHow').onclick = ()=>{ hide('title'); show('how'); };
  document.getElementById('bHowBack').onclick = ()=>{ hide('how'); show('title'); };
  document.getElementById('bGuide').onclick = ()=>{ hide('how'); show('guide'); buildGuide(); };
  document.getElementById('bGuideBack').onclick = ()=>{ hide('guide'); show('how'); };

  /* table guide: miniature playfield + numbered callouts */
  function buildGuide(){
    const FEATURES = [
      { at: [190, 500], name: 'The Money Table',
        desc: 'A live mini pool table — 3 real captive balls. Shoot the pinball up the mouth (bottom-right) and knock them into the two corner pockets. Sink all 3 = RUN THE TABLE.' },
      { at: [114, 409], name: 'Pockets & scratches',
        desc: 'Each sink pays the climbing Money Ball value. Put the SILVER ball in a pocket and you SCRATCH — value resets.' },
      { at: [458, 290], name: 'The Back Room',
        desc: 'Knock down the $ door, shoot the hole. Unlit = wager award. Lit (HUSTLE complete) = ball LOCK. Lock 2, third shot starts 3-ball MULTIBALL.' },
      { at: [410, 620], name: 'HUSTLE bank',
        desc: '6 drop targets. Complete the word to light the lock.' },
      { at: [396, 566], name: 'CHALK standups',
        desc: 'Behind the bank. Spell C-H-A-L-K to light the Massé magnet save above the drain.' },
      { at: [280, 972], name: 'Massé magnet',
        desc: 'When lit, it snatches a draining ball, crackles, and hurls it back into play.' },
      { at: [82, 480], name: 'Spinner (stakes)',
        desc: 'In the inner-loop slot left of the Money Table. 40 spins arm the KICKBACK; rip it through to the top for a FULL LOOP — bonus X up.' },
      { at: [280, 48], name: 'SIDE BET (crown)',
        desc: 'Complete A-B-C-D lanes to light it — the crown rollover then pays a mystery award.' },
    ];
    const cv = document.getElementById('guideCv');
    const sc = 230 / TABLE.W;
    cv.width = 230; cv.height = Math.round(TABLE.H * sc);
    const g2 = cv.getContext('2d');
    g2.drawImage(ART.base, 0, 0, cv.width, cv.height);
    g2.fillStyle = 'rgba(3,8,5,.25)'; g2.fillRect(0,0,cv.width,cv.height);
    FEATURES.forEach((f, i) => {
      const x = f.at[0]*sc, y = f.at[1]*sc;
      g2.beginPath(); g2.arc(x, y, 9, 0, 7);
      g2.fillStyle = '#63e0b8'; g2.fill();
      g2.strokeStyle = '#04140d'; g2.lineWidth = 1.5; g2.stroke();
      g2.fillStyle = '#04140d'; g2.font = '800 11px sans-serif';
      g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText(String(i+1), x, y+0.5);
    });
    document.getElementById('guideList').innerHTML =
      FEATURES.map(f => `<li><b style="color:#a8f0d4">${f.name}</b><br>${f.desc}</li>`).join('');
  }
  document.getElementById('bScores').onclick = async ()=>{
    hide('title'); show('scores');
    document.getElementById('tBoard').innerHTML = '<div class="tiny">checking the ledger…</div>';
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
    card.innerHTML = `<p class="sub">the house ledger</p><h1 class="logo" style="font-size:30px">High rollers</h1>
      <div class="board" id="finalBoard"><div class="tiny">signing the ledger…</div></div>
      <button class="btn" id="bAgain2">Play again</button>
      <button class="btn ghost" id="bTitle2">Title</button>`;
    document.getElementById('bAgain2').onclick = ()=>{ hide('over'); startGame(players.length); };
    document.getElementById('bTitle2').onclick = quitToTitle;
    await Scores.submit(name, bestP.score, bestP.runs+' run'+(bestP.runs!==1?'s':''));
    await Scores.fetchBoard();
    document.getElementById('finalBoard').innerHTML = Scores.html(name, bestP.score);
  }

  /* ================= global scores ================= */
  const Scores = {
    BASE:'https://game-scores.jez237.workers.dev/scores/',
    ns:'corner-pocket-2', board:null,
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
      if (this.board==='offline') return '<div class="tiny">the ledger is unreachable — score kept locally</div>';
      if (!this.board) return '<div class="tiny">checking the ledger…</div>';
      if (!this.board.length) return '<div class="tiny">no high rollers yet — run the table</div>';
      let done = false;
      return this.board.map((s,i)=>{
        const hl = !done && s.name===hlName && s.score===hlScore;
        if (hl) done = true;
        return `<div class="br"${hl?' style="background:rgba(99,224,184,.12);outline:1px solid rgba(99,224,184,.4)"':''}>`+
          `<span class="rk">${i+1}</span><span class="nm">${s.name}</span><span class="sc">${fmt(s.score)}</span><span class="ex">${s.extra}</span></div>`;
      }).join('');
    }
  };

  /* ================= boot ================= */
  TABLE.build();
  ART.build();
  resize();
  requestAnimationFrame(frame);

  /* headless screenshot staging: ?shot=play|full|title|serve|multiball */
  window.__debugHud = new URLSearchParams(location.search).get('debug') === '1';
  const shotMode = new URLSearchParams(location.search).get('shot');
  if (shotMode){
    window.__headless = true;
    AU.setMute(true);
    if (shotMode !== 'title'){
      PHYS.seed(7); startGame(1);
      if (shotMode !== 'serve'){
        if (seatBall){ const b = seatBall; b.held = false; b.vy = -2200; seatBall = null; state = 'play'; }
        for (let i=0;i<240*2.2;i++) simStep();
        if (shotMode === 'multiball'){
          const p = plr();
          p.hustle = p.hustle.map(()=>false); TABLE.drops.forEach(d=>TABLE.setDrop(d,false));
          p.locks = 2; applyStateLocks();
          startMultiball();
          for (let i=0;i<240*0.8;i++) simStep();
        }
        if (shotMode === 'full') fullView = true;
      }
    }
    updateCam(1); render(1);
  }
  function applyStateLocks(){
    const p = plr(), hole = TABLE.lockHole;
    while (hole.held.length < p.locks){
      const b = troughBall(); if (!b) break;
      const slot = hole.slots[hole.held.length];
      b.active = true; b.held = true; b.x = slot.x; b.y = slot.y; b.px=b.x; b.py=b.y;
      hole.held.push(b);
    }
  }

  /* ================= debug hooks ================= */
  window.__g = {
    get state(){
      const p = plr();
      const bs = PHYS.steel().map(b=>({x:+b.x.toFixed(1),y:+b.y.toFixed(1),active:b.active,held:b.held}));
      const os = TABLE.objectBalls.map(b=>({x:+b.x.toFixed(1),y:+b.y.toFixed(1),active:b.active,num:b.num}));
      return { mode:state, steel:bs, objects:os,
        player: p? {score:p.score,bankroll:p.bankroll,bonusX:p.bonusX,runs:p.runs,sunk:p.sunk,
                    hustle:p.hustle.slice(),chalk:p.chalk,locks:p.locks,moneyVal:p.moneyVal,
                    spins:p.spins,abcd:p.abcd,kickArmed:p.kickArmed,masseLit:p.masseLit,
                    extraBalls:p.extraBalls} : null,
        curP, ballNo, credits, tilted, nanCount, drainCount,
        mb: {active:mb.active, saveT:+mb.saveT.toFixed(2)},
        hr: {active:hr.active, t:+hr.t.toFixed(1)},
        locked: TABLE.lockHole.held.length,
        seated: !!seatBall };
    },
    step(ms){ const n = Math.round(ms/1000/PHYS.DT); for(let i=0;i<n;i++) simStep(); return this.snap(); },
    snap(){ const b=focusBall()||PHYS.steel()[0]; return {x:+b.x.toFixed(2),y:+b.y.toFixed(2),vx:+b.vx.toFixed(1),vy:+b.vy.toFixed(1),mode:state,nan:nanCount,drains:drainCount}; },
    setBall(x,y,vx,vy){
      let b = focusBall();
      if (!b){ b = troughBall() || PHYS.steel()[0]; }
      if (b === seatBall) seatBall = null;
      b.active=true;b.held=false;b.x=x;b.y=y;b.px=x;b.py=y;b.vx=vx||0;b.vy=vy||0;b.w=0;b.lowTime=0;b._zin=null;
      if(state==='serve')state='play';
      return b;
    },
    launch(power){ if(!seatBall) return false; plungePull=Math.max(0,Math.min(1,power)); launch(); return true; },
    flip(side,on){ flip(side,on); },
    nudge(dx,dy){ nudge(dx,dy); },
    start(n){ startGame(n||1); },
    seed(s){ PHYS.seed(s); },
    sw(id){ handleEvent(
      id==='drain'?{type:'drain', ball:focusBall()||PHYS.steel()[0]}:
      id==='hole'?{type:'hole', ball:PHYS.steel()[0]}:
      id.startsWith('pk')?{type:'moneyPocket', id, ball:TABLE.objectBalls.find(b=>b.active)||TABLE.objectBalls[0], x:0,y:0}:
      id==='scratch'?{type:'scratch', id:'pkA', ball:focusBall()||PHYS.steel()[0], x:114,y:409}:
      id==='spin'?{type:'spin', up:true}:
      id.startsWith('zone')||['sidebet','outL','outR','kick'].includes(id)?{type:'zone',id, ball:focusBall()||PHYS.steel()[0]}:
      {type:'hit',id,speed:200,x:0,y:0, ball:focusBall()||PHYS.steel()[0]}); },
    endBall(){ for (const b of PHYS.liveSteel()) b.active=false; seatBall=null; handleEvent({type:'drain', ball:PHYS.steel()[0]}); },
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
