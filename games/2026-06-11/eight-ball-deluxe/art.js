/* Eight Ball Deluxe — playfield art.
   Static base pre-rendered at 2× into an offscreen canvas; dynamic elements
   (ball, flippers, targets, bumpers, lamps, effects) drawn per frame in
   playfield coordinates. Evokes the 1981 Bally cabinet art (cream playfield,
   orange sunburst, billiard imagery) without copying it. */
'use strict';

const ART = (() => {
  const SC = 2;                       // base art supersample
  let base = null;

  const BALLCOLS = ['#f2b03c','#2467c4','#cf3a28','#7b3fa0','#e06a1f','#2e7d4f','#8c2f23'];

  /* ---------- small helpers ---------- */
  function rr(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  }
  function capsulePath(ctx,ax,ay,bx,by,r){
    const a = Math.atan2(by-ay,bx-ax);
    ctx.beginPath();
    ctx.arc(ax,ay,r,a+Math.PI/2,a-Math.PI/2);
    ctx.arc(bx,by,r,a-Math.PI/2,a+Math.PI/2);
    ctx.closePath();
  }
  function billiard(ctx,x,y,r,i,dim){
    // pool ball i (0-based → ball 1..7); dim = unlit insert
    const col = BALLCOLS[i%7];
    const g = ctx.createRadialGradient(x-r*0.35,y-r*0.4,r*0.15,x,y,r);
    g.addColorStop(0, dim ? '#6e655a' : '#fff');
    g.addColorStop(0.25, dim ? shade(col,-55) : col);
    g.addColorStop(1, dim ? shade(col,-75) : shade(col,-35));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    ctx.fillStyle = dim ? '#3c372f' : '#f6efdf';
    ctx.beginPath(); ctx.arc(x,y,r*0.52,0,7); ctx.fill();
    ctx.fillStyle = dim ? '#17120c' : '#221a10';
    ctx.font = `700 ${Math.round(r*0.78)}px Georgia,serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(String(i+1), x, y+r*0.05);
  }
  function shade(hex,amt){
    const n=parseInt(hex.slice(1),16);
    let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt;
    r=r<0?0:r>255?255:r; g=g<0?0:g>255?255:g; b=b<0?0:b>255?255:b;
    return `rgb(${r},${g},${b})`;
  }

  /* ---------- static base ---------- */
  function build(){
    base = document.createElement('canvas');
    base.width = TABLE.W*SC; base.height = TABLE.H*SC;
    const ctx = base.getContext('2d');
    ctx.scale(SC,SC);

    /* deep wood behind everything */
    const wood = ctx.createLinearGradient(0,0,TABLE.W,0);
    wood.addColorStop(0,'#2a160a'); wood.addColorStop(.5,'#3a2010'); wood.addColorStop(1,'#27140a');
    ctx.fillStyle = wood; ctx.fillRect(0,0,TABLE.W,TABLE.H);

    /* playfield deck */
    const pf = ctx.createLinearGradient(0,0,0,TABLE.H);
    pf.addColorStop(0,'#efe3c6'); pf.addColorStop(.55,'#ecdcba'); pf.addColorStop(1,'#e4d2ab');
    ctx.fillStyle = pf;
    ctx.fillRect(10,10,TABLE.W-20,TABLE.H-20);

    /* faint wood grain on deck */
    ctx.globalAlpha = 0.05; ctx.strokeStyle='#7a5a30'; ctx.lineWidth=1;
    for (let y=14;y<TABLE.H;y+=7){
      ctx.beginPath(); ctx.moveTo(12,y);
      for(let x=12;x<TABLE.W-10;x+=40) ctx.lineTo(x, y + Math.sin(x*0.05+y)*1.6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* ----- painted art ----- */
    /* big orange sunburst radiating from behind the 7-bank */
    ctx.save();
    ctx.translate(220,560);
    for (let i=0;i<26;i++){
      const a = (i/26)*Math.PI*2;
      ctx.fillStyle = i%2 ? 'rgba(232,108,32,.34)' : 'rgba(206,52,28,.26)';
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.arc(0,0, 330, a, a+Math.PI/26);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    /* knock the burst back with deck colour ring */
    const fade = ctx.createRadialGradient(220,560,60,220,560,360);
    fade.addColorStop(0,'rgba(236,220,186,0)');
    fade.addColorStop(.62,'rgba(236,220,186,.22)');
    fade.addColorStop(1,'rgba(236,220,186,.94)');
    ctx.fillStyle=fade; ctx.fillRect(0,140,TABLE.W,860);

    /* chalk-blue pinstripe frame */
    ctx.strokeStyle='rgba(38,102,204,.5)'; ctx.lineWidth=2.4;
    ctx.strokeRect(30,46,TABLE.W-60,1054);
    ctx.strokeStyle='rgba(206,52,28,.45)'; ctx.lineWidth=1.2;
    ctx.strokeRect(36,52,TABLE.W-72,1042);

    /* script title on the lower playfield */
    ctx.save();
    ctx.translate(262,712); ctx.rotate(-0.045);
    ctx.textAlign='center';
    ctx.font='italic 900 44px Georgia,serif';
    ctx.lineWidth=7; ctx.strokeStyle='#f6efdf'; ctx.lineJoin='round';
    ctx.strokeText('Eight Ball',0,0); ctx.strokeText('Deluxe',0,46);
    const tg = ctx.createLinearGradient(0,-34,0,60);
    tg.addColorStop(0,'#e8702a'); tg.addColorStop(.5,'#cf3a28'); tg.addColorStop(1,'#9c2418');
    ctx.fillStyle=tg;
    ctx.fillText('Eight Ball',0,0); ctx.fillText('Deluxe',0,46);
    ctx.restore();

    /* painted rack of balls near the apron */
    ctx.save();
    ctx.translate(280,852); ctx.globalAlpha=.85;
    let k=0;
    for (let row=0;row<3;row++) for(let c=0;c<=row;c++){
      const x=(c-row/2)*30, y=row*26-20;
      if (row===1 && c===0){ // 8 ball in the heart of the rack
        const g=ctx.createRadialGradient(x-4,y-24-4,2,x,y-24+26-26,12);
        ctx.fillStyle='#191919';
        ctx.beginPath(); ctx.arc(x,y,12,0,7); ctx.fill();
        ctx.fillStyle='#f1ead8'; ctx.beginPath(); ctx.arc(x,y,6,0,7); ctx.fill();
        ctx.fillStyle='#111'; ctx.font='700 9px Georgia,serif';
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('8',x,y+0.5);
      } else billiard(ctx,x,y,12,(k*3+1)%7,false);
      k++;
    }
    ctx.restore();

    /* cue + chalk doodle by the left orbit */
    ctx.save();
    ctx.translate(96,760); ctx.rotate(0.9);
    const cue=ctx.createLinearGradient(0,0,150,0);
    cue.addColorStop(0,'#caa46a'); cue.addColorStop(1,'#6e4a26');
    ctx.fillStyle=cue; ctx.fillRect(0,-2.6,150,5.2);
    ctx.fillStyle='#2266cc'; ctx.fillRect(-8,-3.4,8,6.8);
    ctx.restore();

    /* ----- inserts (off state) ----- */
    const L = TABLE.lamps;
    for (const id in L){
      const lp = L[id];
      if (id.startsWith('pool')) billiard(ctx,lp.x,lp.y,13,+id.slice(4),true);
      else if (id.startsWith('dl')&&id!=='dlx'){ insertCircle(ctx,lp.x,lp.y,11,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,11,'#caa48a'); }
      else if (id.startsWith('x')){ insertRect(ctx,lp.x-14,lp.y-9,28,18,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,10,'#caa48a'); }
      else if (id.startsWith('bk')){ insertRect(ctx,lp.x-17,lp.y-8,34,16,'#1d3a5c'); label(ctx,lp.x,lp.y,lp.label,9,'#8fb4d8'); }
      else if (id==='A'||id==='B'||id==='C'||id==='D'){ insertCircle(ctx,lp.x,lp.y,10,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,11,'#caa48a'); }
      else if (id==='eightL'){ insertCircle(ctx,lp.x,lp.y,13,'#111'); label(ctx,lp.x,lp.y,'8',12,'#888'); }
      else if (id==='saucerL'){ insertRect(ctx,lp.x-26,lp.y-8,52,16,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,8,'#caa48a'); }
      else if (id==='again'){ insertRect(ctx,lp.x-38,lp.y-8,76,16,'#5a1418'); label(ctx,lp.x,lp.y,lp.label,8,'#d88'); }
      else if (id==='arrowL'){ insertRect(ctx,lp.x-24,lp.y-8,48,16,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,8,'#caa48a'); }
      else if (id==='bankT'){ insertRect(ctx,lp.x-28,lp.y-8,56,16,'#1d3a5c'); label(ctx,lp.x,lp.y,lp.label,8,'#8fb4d8'); }
    }
    /* shot arrows */
    arrow(ctx, 170,648, -1.82, '#cf3a28');         // up the in-line lane
    arrow(ctx, 414,430, -1.14, '#cf3a28');         // up the corner-pocket lane
    arrow(ctx, 37,756, -1.57, '#2266cc');          // left lane

    /* ----- baked GI light pools (warm lamps under plastics) ----- */
    [[240,300,120,.13],[150,520,90,.10],[460,300,80,.12],[280,940,150,.12],[37,560,60,.10]].forEach(([x,y,r,a])=>{
      const g=ctx.createRadialGradient(x,y,4,x,y,r);
      g.addColorStop(0,`rgba(255,196,120,${a})`); g.addColorStop(1,'rgba(255,196,120,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    });

    /* ----- sling plastics ----- */
    for (const m of [1,-1]){
      ctx.save();
      if (m<0){ ctx.translate(518,0); ctx.scale(-1,1); }   // mirror for right sling
      ctx.beginPath();
      ctx.moveTo(116,882); ctx.lineTo(170,950); ctx.lineTo(110,942); ctx.closePath();
      const g=ctx.createLinearGradient(110,880,170,950);
      g.addColorStop(0,'#e2603f'); g.addColorStop(1,'#a22d1c');
      ctx.fillStyle=g; ctx.fill();
      ctx.strokeStyle='rgba(246,239,223,.75)'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='rgba(255,236,190,.9)';
      ctx.beginPath(); ctx.arc(126,898,3,0,7); ctx.fill();
      ctx.restore();
    }

    /* ----- mechanical: walls, guides, posts ----- */
    drawWalls(ctx);

    /* bumper base art rings */
    for (const b of TABLE.bumpers){
      ctx.strokeStyle='rgba(206,52,28,.55)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(b.x,b.y,40,0,7); ctx.stroke();
      ctx.strokeStyle='rgba(38,102,204,.4)'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.arc(b.x,b.y,46,0,7); ctx.stroke();
    }

    /* apron */
    const ap = ctx.createLinearGradient(0,1062,0,TABLE.H);
    ap.addColorStop(0,'#7e1f14'); ap.addColorStop(1,'#54130c');
    ctx.fillStyle=ap;
    ctx.beginPath();
    ctx.moveTo(10,1160); ctx.lineTo(10,1108); ctx.lineTo(208,1058);
    ctx.lineTo(352,1058); ctx.lineTo(550,1108); ctx.lineTo(550,1160); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='rgba(255,217,138,.5)'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#f3e2b8'; ctx.textAlign='center';
    ctx.font='italic 900 19px Georgia,serif';
    ctx.fillText('EIGHT BALL DELUXE', 280, 1124);
    ctx.font='600 9px sans-serif'; ctx.fillStyle='rgba(243,226,184,.7)';
    ctx.fillText('STOP TALKING AND START CHALKING', 280, 1142);

    return base;
  }

  function insertCircle(ctx,x,y,r,col){
    ctx.fillStyle=col;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.45)'; ctx.lineWidth=1.4; ctx.stroke();
  }
  function insertRect(ctx,x,y,w,h,col){
    ctx.fillStyle=col; rr(ctx,x,y,w,h,4); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.45)'; ctx.lineWidth=1.4; ctx.stroke();
  }
  function label(ctx,x,y,txt,size,col){
    ctx.fillStyle=col; ctx.font=`700 ${size}px sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y+0.5);
  }
  function arrow(ctx,x,y,ang,col){
    ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
    ctx.fillStyle=col; ctx.globalAlpha=.8;
    ctx.beginPath();
    ctx.moveTo(16,0); ctx.lineTo(-6,-9); ctx.lineTo(-2,0); ctx.lineTo(-6,9);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawWalls(ctx){
    /* every collision capsule gets a rendered body */
    for (const s of PHYS.segs()){
      if (s.id && (s.id.startsWith('drop')||s.id.startsWith('dlx')||s.id.startsWith('inl')||s.id==='lone'||s.id==='bankT')) continue; // dynamic
      let fill='#b9b3a4', edge='rgba(40,30,18,.6)';
      if (s.mat==='rubber'||s.mat==='rubberHard'){ fill='#c9483a'; edge='rgba(60,12,8,.7)'; }
      if (s.mat==='plastic'){ fill='#d8513e'; edge='rgba(70,16,10,.65)'; }
      if (s.id==='gate'){ fill='rgba(160,160,170,.0)'; }
      if (s.id==='gate') continue;     // gate drawn dynamically (wire)
      capsulePath(ctx,s.ax,s.ay,s.bx,s.by,s.r+1.5);
      ctx.fillStyle=fill; ctx.fill();
      ctx.strokeStyle=edge; ctx.lineWidth=1.4; ctx.stroke();
      // metal rail highlight
      if (s.mat==='metal'){
        ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.moveTo(s.ax,s.ay-2); ctx.lineTo(s.bx,s.by-2); ctx.stroke();
      }
    }
    for (const c of PHYS.circs()){
      if (c.id && c.id.startsWith('bump')) continue;       // bumpers dynamic
      const isArrow = c.id==='arrow';
      const g=ctx.createRadialGradient(c.x-2,c.y-3,1,c.x,c.y,c.r+2);
      g.addColorStop(0, isArrow?'#ffd98a':'#e86a52');
      g.addColorStop(1, isArrow?'#b87b1e':'#7e1f14');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r+1.5,0,7); ctx.fill();
      ctx.strokeStyle='rgba(40,10,6,.6)'; ctx.lineWidth=1.3; ctx.stroke();
    }
  }

  /* ---------- dynamic drawing (playfield coords) ---------- */
  function drawLamps(ctx,t){
    const L=TABLE.lamps;
    ctx.save();
    for (const id in L){
      const lp=L[id]; if (!lp.on) continue;
      const pulse = .82 + .18*Math.sin(t*6 + lp.x);
      ctx.globalCompositeOperation='lighter';
      const r = id.startsWith('pool')?30: id==='again'?44 : 26;
      const g=ctx.createRadialGradient(lp.x,lp.y,2,lp.x,lp.y,r);
      const col = lp.color;
      g.addColorStop(0,'rgba(255,236,180,'+(0.85*pulse)+')');
      g.addColorStop(0.35, hexA(col,0.5*pulse));
      g.addColorStop(1,'rgba(255,179,71,0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(lp.x,lp.y,r,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
      /* bright insert face */
      if (id.startsWith('pool')) billiard(ctx,lp.x,lp.y,13,+id.slice(4),false);
      else {
        ctx.fillStyle='rgba(255,240,200,.92)';
        ctx.font='700 '+(id.startsWith('bk')?9: id==='again'||id==='saucerL'||id==='arrowL'?8:11)+'px sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(lp.label, lp.x, lp.y+0.5);
      }
    }
    ctx.restore();
  }
  function hexA(hex,a){
    const n=parseInt(hex.slice(1),16);
    return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;
  }

  function drawDropTarget(ctx,d,col,num){
    if (!d.up){    // dark slot
      ctx.fillStyle='rgba(20,12,6,.8)';
      ctx.save(); ctx.translate(d.cx,d.cy);
      ctx.rotate(Math.atan2(d.seg.by-d.seg.ay, d.seg.bx-d.seg.ax));
      rr(ctx,-12,-3,24,6,2); ctx.fill(); ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(d.cx,d.cy);
    ctx.rotate(Math.atan2(d.seg.by-d.seg.ay, d.seg.bx-d.seg.ax));
    /* body shadow, face, top bevel */
    ctx.fillStyle='rgba(0,0,0,.35)'; rr(ctx,-12,-4,24,12,3); ctx.fill();
    const g=ctx.createLinearGradient(0,-6,0,6);
    g.addColorStop(0, shade(col,40)); g.addColorStop(1, shade(col,-30));
    ctx.fillStyle=g; rr(ctx,-11,-6,22,10,3); ctx.fill();
    ctx.strokeStyle='rgba(20,8,4,.7)'; ctx.lineWidth=1.2; ctx.stroke();
    if (num){
      ctx.fillStyle='#fff7e8'; ctx.beginPath(); ctx.arc(0,-1,5.5,0,7); ctx.fill();
      ctx.fillStyle='#23150a'; ctx.font='700 8px Georgia,serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(num,0,-0.5);
    }
    ctx.restore();
  }

  function drawStandup(ctx,st,letter,lit){
    ctx.save();
    ctx.translate(st.cx,st.cy);
    ctx.rotate(Math.atan2(st.seg.by-st.seg.ay, st.seg.bx-st.seg.ax));
    const g=ctx.createLinearGradient(0,-5,0,5);
    g.addColorStop(0, lit?'#ffe9b8':'#caa46a'); g.addColorStop(1, lit?'#e8a23c':'#8a6a3a');
    ctx.fillStyle=g; rr(ctx,-12,-5,24,9,2.5); ctx.fill();
    ctx.strokeStyle='rgba(20,10,4,.7)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.fillStyle= lit?'#5a2010':'#3a2c18';
    ctx.font='800 9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(letter,0,0);
    ctx.restore();
  }

  function drawBumper(ctx,b,glow,t){
    /* skirt */
    ctx.fillStyle='#efe6d2';
    ctx.beginPath(); ctx.arc(b.x,b.y,33,0,7); ctx.fill();
    ctx.strokeStyle='rgba(60,40,20,.4)'; ctx.lineWidth=1; ctx.stroke();
    /* body */
    const g=ctx.createRadialGradient(b.x-6,b.y-8,4,b.x,b.y,30);
    g.addColorStop(0,'#ff9b5a'); g.addColorStop(.6,'#d8513e'); g.addColorStop(1,'#8e2417');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(b.x,b.y,27,0,7); ctx.fill();
    /* cap */
    const lit = glow>0;
    const cap=ctx.createRadialGradient(b.x-4,b.y-6,2,b.x,b.y,18);
    cap.addColorStop(0, lit?'#fff6da':'#ffd98a');
    cap.addColorStop(1, lit?'#ffb347':'#b8742a');
    ctx.fillStyle=cap;
    ctx.beginPath(); ctx.arc(b.x,b.y,17,0,7); ctx.fill();
    ctx.strokeStyle='rgba(60,30,8,.55)'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.fillStyle = lit?'#7e1f14':'#5e3a14';
    ctx.font='800 9px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('100', b.x, b.y+0.5);
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const fg=ctx.createRadialGradient(b.x,b.y,4,b.x,b.y,64*glow+30);
      fg.addColorStop(0,'rgba(255,230,170,'+(0.8*glow)+')');
      fg.addColorStop(1,'rgba(255,160,60,0)');
      ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(b.x,b.y,64*glow+30,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
  }

  function drawFlipper(ctx,f){
    const tx=f.px+Math.cos(f.ang)*f.len, ty=f.py+Math.sin(f.ang)*f.len;
    /* shadow */
    ctx.save();
    capsulePath(ctx,f.px+2,f.py+4,tx+2,ty+4,f.r);
    ctx.fillStyle='rgba(0,0,0,.3)'; ctx.fill();
    /* rubber */
    capsulePath(ctx,f.px,f.py,tx,ty,f.r);
    ctx.fillStyle='#c9483a'; ctx.fill();
    /* plastic body */
    capsulePath(ctx,f.px,f.py,tx,ty,f.r-3);
    const g=ctx.createLinearGradient(f.px,f.py-10,f.px,f.py+10);
    g.addColorStop(0,'#ffe9b8'); g.addColorStop(.5,'#ffc964'); g.addColorStop(1,'#d8892a');
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='rgba(80,40,8,.5)'; ctx.lineWidth=1.2; ctx.stroke();
    /* pivot dome */
    ctx.beginPath(); ctx.arc(f.px,f.py,5.5,0,7);
    ctx.fillStyle='#8a5a1c'; ctx.fill();
    ctx.restore();
  }

  function drawBall(ctx,x,y){
    /* drop shadow */
    ctx.fillStyle='rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.ellipse(x+4,y+6,13.4,11.5,0,0,7); ctx.fill();
    /* chrome */
    const g=ctx.createRadialGradient(x-5,y-6,1.5,x,y,14);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.22,'#e8eef2');
    g.addColorStop(.55,'#9aa6ae'); g.addColorStop(.85,'#525c64'); g.addColorStop(1,'#30383e');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,y,14,0,7); ctx.fill();
    /* environment glint */
    ctx.fillStyle='rgba(255,217,138,.25)';
    ctx.beginPath(); ctx.ellipse(x+4,y+5,5.5,3.5,0.7,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.arc(x-5,y-6,2.6,0,7); ctx.fill();
  }

  function drawSaucer(ctx,s){
    const g=ctx.createRadialGradient(s.x,s.y,2,s.x,s.y,18);
    g.addColorStop(0,'#06050a'); g.addColorStop(.8,'#1c1a22'); g.addColorStop(1,'#3c3a44');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s.x,s.y,18,0,7); ctx.fill();
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(s.x,s.y,18,0,7); ctx.stroke();
    if (s.holding) drawBall(ctx,s.x,s.y);
  }

  function drawPlunger(ctx,pull){
    const x=526, top=1090+pull*22;
    ctx.fillStyle='#5e3a14';
    ctx.fillRect(x-4, top+12, 8, 60);
    /* spring */
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=2;
    ctx.beginPath();
    for(let i=0;i<7;i++){
      ctx.moveTo(x-8, top+16+i*7); ctx.lineTo(x+8, top+19+i*7);
    }
    ctx.stroke();
    /* tip */
    const g=ctx.createRadialGradient(x-2,top-2,1,x,top,9);
    g.addColorStop(0,'#e86a52'); g.addColorStop(1,'#7e1f14');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,top,9,0,7); ctx.fill();
  }

  function drawGate(ctx){
    const g=TABLE && PHYS.segs().find(s=>s.id==='gate');
    if (!g) return;
    ctx.strokeStyle='rgba(220,225,235,.85)'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(g.ax,g.ay); ctx.lineTo(g.bx,g.by); ctx.stroke();
    ctx.beginPath(); ctx.arc(g.ax,g.ay,3,0,7); ctx.fillStyle='#cfd5dd'; ctx.fill();
  }

  return { build, get base(){return base;}, SC,
           drawLamps, drawDropTarget, drawStandup, drawBumper,
           drawFlipper, drawBall, drawSaucer, drawPlunger, drawGate,
           billiard, rr, shade, hexA };
})();
