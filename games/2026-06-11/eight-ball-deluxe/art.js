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
      ctx.fillStyle = i%2 ? 'rgba(228,116,44,.20)' : 'rgba(198,62,38,.15)';
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.arc(0,0, 390, a, a+Math.PI/26);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    /* knock the burst back with deck colour ring */
    const fade = ctx.createRadialGradient(220,560,40,220,560,400);
    fade.addColorStop(0,'rgba(236,220,186,0)');
    fade.addColorStop(.5,'rgba(236,220,186,.3)');
    fade.addColorStop(1,'rgba(236,220,186,.96)');
    ctx.fillStyle=fade; ctx.fillRect(0,110,TABLE.W,900);

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
    ctx.translate(118,742); ctx.rotate(1.05); ctx.globalAlpha=.8;
    const cue=ctx.createLinearGradient(0,0,118,0);
    cue.addColorStop(0,'#caa46a'); cue.addColorStop(1,'#6e4a26');
    ctx.fillStyle=cue; ctx.fillRect(0,-2.4,118,4.8);
    ctx.fillStyle='#2266cc'; ctx.fillRect(-7,-3.2,7,6.4);
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

    /* subtle print grain + warm edge vignette tie everything together */
    const gr = document.createElement('canvas'); gr.width = gr.height = 160;
    const gctx = gr.getContext('2d');
    const gid = gctx.createImageData(160,160);
    for (let i=0;i<gid.data.length;i+=4){
      const v = 90 + Math.random()*165;
      gid.data[i]=gid.data[i+1]=gid.data[i+2]=v; gid.data[i+3]=255;
    }
    gctx.putImageData(gid,0,0);
    ctx.save();
    ctx.globalAlpha = 0.045;
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = ctx.createPattern(gr,'repeat');
    ctx.fillRect(10,10,TABLE.W-20,TABLE.H-20);
    ctx.restore();
    const vg = ctx.createRadialGradient(280,580,220,280,580,660);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(46,22,8,.16)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,TABLE.W,TABLE.H);

    return base;
  }

  /* recessed glass inserts: dark glass face, inner shadow, brass rim, gloss */
  function insertCircle(ctx,x,y,r,col){
    const g=ctx.createRadialGradient(x,y-r*0.3,r*0.2,x,y,r);
    g.addColorStop(0, shade(col,18)); g.addColorStop(0.75,col); g.addColorStop(1, shade(col,-22));
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.5)'; ctx.lineWidth=1.6; ctx.stroke();
    ctx.strokeStyle='rgba(186,142,74,.85)'; ctx.lineWidth=1.1;
    ctx.beginPath(); ctx.arc(x,y,r+1.4,0,7); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.10)';
    ctx.beginPath(); ctx.ellipse(x-r*0.25,y-r*0.4,r*0.55,r*0.28,-0.5,0,7); ctx.fill();
  }
  function insertRect(ctx,x,y,w,h,col){
    const g=ctx.createLinearGradient(x,y,x,y+h);
    g.addColorStop(0, shade(col,16)); g.addColorStop(0.5,col); g.addColorStop(1, shade(col,-20));
    ctx.fillStyle=g; rr(ctx,x,y,w,h,4); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.5)'; ctx.lineWidth=1.6; ctx.stroke();
    rr(ctx,x-1.4,y-1.4,w+2.8,h+2.8,5);
    ctx.strokeStyle='rgba(186,142,74,.85)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.09)';
    rr(ctx,x+2,y+1.5,w-4,h*0.34,2.5); ctx.fill();
  }
  function label(ctx,x,y,txt,size,col){
    ctx.fillStyle=col; ctx.font=`700 ${size}px sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(txt,x,y+0.5);
  }
  function arrow(ctx,x,y,ang,col){
    /* classic playfield arrow: long rounded shaft + triangular head, cream keyline */
    ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(22,0);
    ctx.lineTo(4,-11); ctx.lineTo(4,-4.5);
    ctx.lineTo(-20,-4.5); ctx.quadraticCurveTo(-24,0,-20,4.5);
    ctx.lineTo(4,4.5); ctx.lineTo(4,11);
    ctx.closePath();
    ctx.lineJoin='round';
    ctx.strokeStyle='rgba(246,239,223,.95)'; ctx.lineWidth=3.4; ctx.stroke();
    const g=ctx.createLinearGradient(0,-10,0,10);
    g.addColorStop(0,shade(col,26)); g.addColorStop(1,shade(col,-18));
    ctx.fillStyle=g; ctx.fill();
    ctx.restore();
  }

  /* shaded capsule: drop shadow onto the deck, cross-axis gradient, dark rim,
     thin top highlight — reads as a dimensional rail instead of a flat bar */
  function shadedCapsule(ctx,ax,ay,bx,by,r,cols){
    const dx=bx-ax, dy=by-ay, L=Math.hypot(dx,dy)||1;
    const nx=-dy/L, ny=dx/L;                 // perpendicular
    /* soft shadow */
    capsulePath(ctx,ax+2.5,ay+4,bx+2.5,by+4,r+0.5);
    ctx.fillStyle='rgba(46,26,12,.28)'; ctx.fill();
    /* body with cross gradient (light from upper-left) */
    const mx=(ax+bx)/2, my=(ay+by)/2;
    const sgn = (nx - ny) < 0 ? 1 : -1;      // make the lit side face up-left
    const g=ctx.createLinearGradient(mx+nx*r*sgn,my+ny*r*sgn,mx-nx*r*sgn,my-ny*r*sgn);
    g.addColorStop(0,cols[0]); g.addColorStop(0.45,cols[1]); g.addColorStop(1,cols[2]);
    capsulePath(ctx,ax,ay,bx,by,r);
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='rgba(40,22,10,.55)'; ctx.lineWidth=1.1; ctx.stroke();
    /* specular line along the lit edge */
    ctx.strokeStyle=cols[3]||'rgba(255,255,255,.35)'; ctx.lineWidth=Math.max(1,r*0.28);
    ctx.beginPath();
    ctx.moveTo(ax+nx*r*0.45*sgn, ay+ny*r*0.45*sgn);
    ctx.lineTo(bx+nx*r*0.45*sgn, by+ny*r*0.45*sgn);
    ctx.stroke();
  }

  const RAIL_COLS = {
    metal:  ['#e8ebee','#a8afb6','#5c636a','rgba(255,255,255,.55)'],
    rubber: ['#e06a4e','#b03a24','#6e1d10','rgba(255,200,170,.4)'],
    rubberHard: ['#e06a4e','#b03a24','#6e1d10','rgba(255,200,170,.4)'],
    plastic:['#d8604a','#b03826','#701d10','rgba(255,205,180,.4)'],
    wood:   ['#cdb084','#a8895c','#6e5430','rgba(255,235,200,.4)'],
  };

  function drawWalls(ctx){
    /* every collision capsule gets a rendered body */
    for (const s of PHYS.segs()){
      if (s.id && (s.id.startsWith('drop')||s.id.startsWith('dlx')||s.id.startsWith('inl')||s.id==='lone'||s.id==='bankT')) continue; // dynamic
      if (s.id==='gate') continue;     // gate drawn dynamically (wire)
      shadedCapsule(ctx,s.ax,s.ay,s.bx,s.by,s.r+1.5, RAIL_COLS[s.mat]||RAIL_COLS.wood);
    }
    for (const c of PHYS.circs()){
      if (c.id && c.id.startsWith('bump')) continue;       // bumpers dynamic
      const isArrow = c.id==='arrow';
      /* post shadow */
      ctx.fillStyle='rgba(46,26,12,.3)';
      ctx.beginPath(); ctx.arc(c.x+2,c.y+3.5,c.r+1,0,7); ctx.fill();
      const g=ctx.createRadialGradient(c.x-c.r*0.4,c.y-c.r*0.5,1,c.x,c.y,c.r+2);
      g.addColorStop(0, isArrow?'#ffe2a0':'#e8765c');
      g.addColorStop(0.55, isArrow?'#d8a248':'#b03a24');
      g.addColorStop(1, isArrow?'#8a6020':'#6e1d10');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r+1,0,7); ctx.fill();
      ctx.strokeStyle='rgba(40,18,8,.55)'; ctx.lineWidth=1.1; ctx.stroke();
      /* screw glint */
      ctx.fillStyle='rgba(255,245,225,.55)';
      ctx.beginPath(); ctx.arc(c.x-c.r*0.3,c.y-c.r*0.35,c.r*0.22,0,7); ctx.fill();
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
    /* extrusion shadow + slot */
    ctx.fillStyle='rgba(40,22,10,.4)'; rr(ctx,-12,-3,24,11,3); ctx.fill();
    /* face with vertical sheen */
    const g=ctx.createLinearGradient(0,-7,0,5);
    g.addColorStop(0, shade(col,46)); g.addColorStop(0.4, col); g.addColorStop(1, shade(col,-34));
    ctx.fillStyle=g; rr(ctx,-11,-7,22,11,3); ctx.fill();
    ctx.strokeStyle='rgba(24,10,4,.65)'; ctx.lineWidth=1.1; ctx.stroke();
    /* top bevel highlight */
    ctx.strokeStyle='rgba(255,240,210,.55)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-9.5,-6); ctx.lineTo(9.5,-6); ctx.stroke();
    if (num){
      const rg=ctx.createRadialGradient(-1,-2.6,0.5,0,-1.6,5);
      rg.addColorStop(0,'#fdf6e4'); rg.addColorStop(1,'#d8c8a4');
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,-1.6,4.8,0,7); ctx.fill();
      ctx.strokeStyle='rgba(40,22,10,.4)'; ctx.lineWidth=0.8; ctx.stroke();
      ctx.fillStyle='#2a1810'; ctx.font='700 7.4px Georgia,serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(num,0,-1.2);
    }
    ctx.restore();
  }

  function drawStandup(ctx,st,letter,lit){
    /* small cream roll-under target with a red letter, brass base */
    ctx.save();
    ctx.translate(st.cx,st.cy);
    ctx.rotate(Math.atan2(st.seg.by-st.seg.ay, st.seg.bx-st.seg.ax));
    ctx.fillStyle='rgba(40,22,10,.32)'; rr(ctx,-9.5,-2.5,19,8,2.5); ctx.fill();   // shadow
    ctx.fillStyle='#8a6a3a'; rr(ctx,-10,1.5,20,3.5,1.5); ctx.fill();              // brass base
    const g=ctx.createLinearGradient(0,-6,0,4);
    g.addColorStop(0, lit?'#fff3d2':'#f0e2c2'); g.addColorStop(1, lit?'#f3c86a':'#c4ae84');
    ctx.fillStyle=g; rr(ctx,-8.5,-6,17,9,2.5); ctx.fill();
    ctx.strokeStyle='rgba(40,22,10,.5)'; ctx.lineWidth=0.9; ctx.stroke();
    ctx.fillStyle= lit?'#b02a14':'#8e2f23';
    ctx.font='800 8px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(letter,0,-1.4);
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const fg=ctx.createRadialGradient(0,-2,1,0,-2,16);
      fg.addColorStop(0,'rgba(255,220,150,.5)'); fg.addColorStop(1,'rgba(255,220,150,0)');
      ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(0,-2,16,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
    ctx.restore();
  }

  function drawBumper(ctx,b,glow,t){
    /* drop shadow */
    ctx.fillStyle='rgba(40,22,10,.3)';
    ctx.beginPath(); ctx.arc(b.x+3,b.y+5,33,0,7); ctx.fill();
    /* skirt: shaded cream petals */
    const sk=ctx.createRadialGradient(b.x-6,b.y-9,6,b.x,b.y,34);
    sk.addColorStop(0,'#fcf4e0'); sk.addColorStop(.7,'#e8d9b8'); sk.addColorStop(1,'#bfa87e');
    ctx.fillStyle=sk;
    ctx.beginPath(); ctx.arc(b.x,b.y,33,0,7); ctx.fill();
    ctx.strokeStyle='rgba(60,40,20,.45)'; ctx.lineWidth=1.1; ctx.stroke();
    /* body */
    const g=ctx.createRadialGradient(b.x-7,b.y-9,4,b.x,b.y,29);
    g.addColorStop(0,'#f08a60'); g.addColorStop(.55,'#c2402c'); g.addColorStop(1,'#741d10');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(b.x,b.y,27,0,7); ctx.fill();
    ctx.strokeStyle='rgba(40,14,8,.5)'; ctx.lineWidth=1; ctx.stroke();
    /* amber glass cap with brass ring */
    const lit = glow>0;
    const cap=ctx.createRadialGradient(b.x-4.5,b.y-6.5,2,b.x,b.y,19);
    cap.addColorStop(0, lit?'#fff8e0':'#ffe3a4');
    cap.addColorStop(.7, lit?'#ffc964':'#cf913a');
    cap.addColorStop(1, lit?'#e89a3a':'#8e5e1e');
    ctx.fillStyle=cap;
    ctx.beginPath(); ctx.arc(b.x,b.y,18,0,7); ctx.fill();
    ctx.strokeStyle='rgba(186,142,74,.9)'; ctx.lineWidth=1.6; ctx.stroke();
    ctx.strokeStyle='rgba(50,26,8,.5)'; ctx.lineWidth=0.9;
    ctx.beginPath(); ctx.arc(b.x,b.y,19.4,0,7); ctx.stroke();
    /* glass gloss */
    ctx.fillStyle='rgba(255,255,255,.28)';
    ctx.beginPath(); ctx.ellipse(b.x-5,b.y-7.5,8.5,4.4,-0.6,0,7); ctx.fill();
    ctx.fillStyle = lit?'#7e1f14':'#6e4716';
    ctx.font='800 9px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('100', b.x, b.y+1.5);
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const fg=ctx.createRadialGradient(b.x,b.y,4,b.x,b.y,64*glow+30);
      fg.addColorStop(0,'rgba(255,230,170,'+(0.8*glow)+')');
      fg.addColorStop(1,'rgba(255,160,60,0)');
      ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(b.x,b.y,64*glow+30,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
  }

  function taperPath(ctx,ax,ay,bx,by,r0,r1){
    const d=Math.hypot(bx-ax,by-ay)||1, a=Math.atan2(by-ay,bx-ax);
    const phi=Math.acos(Math.max(-1,Math.min(1,(r0-r1)/d)));
    ctx.beginPath();
    ctx.arc(ax,ay,r0,a+phi,a-phi);
    ctx.arc(bx,by,r1,a-phi,a+phi);
    ctx.closePath();
  }

  function drawFlipper(ctx,f){
    const tx=f.px+Math.cos(f.ang)*f.len, ty=f.py+Math.sin(f.ang)*f.len;
    const r0=(f.r||13)+1.5, r1=(f.rTip||9.5)+1.5;
    ctx.save();
    /* shadow */
    taperPath(ctx,f.px+2.5,f.py+4.5,tx+2.5,ty+4.5,r0,r1);
    ctx.fillStyle='rgba(40,22,10,.34)'; ctx.fill();
    /* rubber edge */
    taperPath(ctx,f.px,f.py,tx,ty,r0,r1);
    const rg=ctx.createLinearGradient(f.px,f.py-r0,f.px,f.py+r0);
    rg.addColorStop(0,'#d8604a'); rg.addColorStop(1,'#7e2412');
    ctx.fillStyle=rg; ctx.fill();
    ctx.strokeStyle='rgba(46,16,8,.6)'; ctx.lineWidth=1.1; ctx.stroke();
    /* plastic body */
    taperPath(ctx,f.px,f.py,tx,ty,r0-2.8,r1-2.6);
    const g=ctx.createLinearGradient(f.px,f.py-r0,f.px,f.py+r0);
    g.addColorStop(0,'#fff0cc'); g.addColorStop(.45,'#f6c05e'); g.addColorStop(1,'#c2811f');
    ctx.fillStyle=g; ctx.fill();
    /* centre groove + specular */
    ctx.strokeStyle='rgba(140,84,18,.4)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(f.px,f.py); ctx.lineTo(tx,ty); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1.6;
    ctx.beginPath();
    ctx.moveTo(f.px+(tx-f.px)*0.12, f.py+(ty-f.py)*0.12-3.4);
    ctx.lineTo(f.px+(tx-f.px)*0.85, f.py+(ty-f.py)*0.85-2.2);
    ctx.stroke();
    /* brass pivot dome */
    const pg=ctx.createRadialGradient(f.px-1.6,f.py-2,1,f.px,f.py,6.2);
    pg.addColorStop(0,'#f3dca0'); pg.addColorStop(1,'#7e5a1c');
    ctx.beginPath(); ctx.arc(f.px,f.py,6,0,7);
    ctx.fillStyle=pg; ctx.fill();
    ctx.strokeStyle='rgba(50,32,8,.6)'; ctx.lineWidth=1; ctx.stroke();
    ctx.restore();
  }

  function drawBall(ctx,x,y){
    /* contact shadow (tight + soft halo) */
    ctx.fillStyle='rgba(30,16,8,.18)';
    ctx.beginPath(); ctx.ellipse(x+5,y+8,16.5,13.5,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(30,16,8,.34)';
    ctx.beginPath(); ctx.ellipse(x+3.5,y+6,13,10.5,0,0,7); ctx.fill();
    /* chrome */
    const g=ctx.createRadialGradient(x-5,y-6,1.5,x,y,14.4);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.2,'#eef2f5');
    g.addColorStop(.5,'#aab4bc'); g.addColorStop(.8,'#5a646c'); g.addColorStop(1,'#272e34');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,y,14,0,7); ctx.fill();
    /* warm playfield reflection wrapping the lower half */
    ctx.fillStyle='rgba(214,150,80,.30)';
    ctx.beginPath(); ctx.ellipse(x+2.5,y+6.5,8.6,4.6,0.35,0,7); ctx.fill();
    ctx.fillStyle='rgba(120,70,40,.25)';
    ctx.beginPath(); ctx.ellipse(x,y+10.4,7,2.4,0,0,7); ctx.fill();
    /* speculars */
    ctx.fillStyle='rgba(255,255,255,.95)';
    ctx.beginPath(); ctx.arc(x-5.2,y-6.2,2.8,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.4)';
    ctx.beginPath(); ctx.arc(x+3.6,y-8.8,1.3,0,7); ctx.fill();
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
