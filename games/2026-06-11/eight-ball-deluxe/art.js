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
  function billiard(ctx,x,y,r,i,dim,striped,num){
    // pool ball: i 0-6 = colour index, i -1 = the 8-ball; striped = 9-15 style
    const col = i === -1 ? '#1a1a1e' : BALLCOLS[((i%7)+7)%7];
    const g = ctx.createRadialGradient(x-r*0.35,y-r*0.4,r*0.15,x,y,r);
    if (striped){
      g.addColorStop(0, dim ? '#7a7468' : '#ffffff');
      g.addColorStop(0.6, dim ? '#5e584c' : '#ece4d2');
      g.addColorStop(1, dim ? '#46403a' : '#b8b0a0');
    } else {
      g.addColorStop(0, dim ? '#6e655a' : '#fff');
      g.addColorStop(0.25, dim ? shade(col,-55) : col);
      g.addColorStop(1, dim ? shade(col,-75) : shade(col,-35));
    }
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    if (striped){
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.clip();
      ctx.fillStyle = dim ? shade(col,-55) : col;
      ctx.fillRect(x-r, y-r*0.42, r*2, r*0.84);
      ctx.restore();
    }
    ctx.fillStyle = dim ? '#3c372f' : '#f6efdf';
    ctx.beginPath(); ctx.arc(x,y,r*0.52,0,7); ctx.fill();
    ctx.fillStyle = dim ? '#17120c' : '#221a10';
    ctx.font = `700 ${Math.round(r*0.74)}px Georgia,serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(String(num !== undefined ? num : i+1), x, y+r*0.05);
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

    /* wood plank grain for the out-of-play margins */
    ctx.globalAlpha = 0.35; ctx.strokeStyle='#1c0e06'; ctx.lineWidth=1;
    for (let y=6;y<TABLE.H;y+=11){
      ctx.beginPath(); ctx.moveTo(0,y);
      for(let x=0;x<TABLE.W;x+=44) ctx.lineTo(x, y + Math.sin(x*0.04+y)*1.8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* royal-blue playfield deck inside the wall boundary (real EBD blue) */
    const deckPath = () => {
      ctx.beginPath();
      ctx.arc(280,300, 261, Math.PI, 0);     // under the crown
      ctx.lineTo(541,1158); ctx.lineTo(19,1158); ctx.closePath();
    };
    deckPath();
    const pf = ctx.createLinearGradient(0,0,0,TABLE.H);
    pf.addColorStop(0,'#2a4cb4'); pf.addColorStop(.5,'#2343a4'); pf.addColorStop(1,'#1b3488');
    ctx.fillStyle = pf; ctx.fill();
    /* subtle weave on the blue */
    ctx.save(); deckPath(); ctx.clip();
    ctx.globalAlpha = 0.05; ctx.strokeStyle='#dfe8ff'; ctx.lineWidth=1;
    for (let y=40;y<TABLE.H;y+=9){
      ctx.beginPath(); ctx.moveTo(14,y); ctx.lineTo(TABLE.W-14,y); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* yellow lasso-rope pinstripes (the EBD border motif) */
    ctx.strokeStyle='#e8c44a'; ctx.lineWidth=2.6; ctx.setLineDash([11,5]);
    ctx.beginPath(); ctx.arc(280,300, 240, Math.PI, 0);
    ctx.lineTo(520,1100); ctx.lineTo(40,1100); ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle='rgba(232,196,74,.45)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.arc(280,300, 246, Math.PI, 0);
    ctx.lineTo(526,1106); ctx.lineTo(34,1106); ctx.closePath(); ctx.stroke();
    /* corner lasso loops */
    for (const [lx,ly] of [[70,1070],[490,1070]]){
      ctx.strokeStyle='#e8c44a'; ctx.lineWidth=2.2;
      ctx.beginPath(); ctx.arc(lx,ly,12,0,7); ctx.stroke();
      ctx.beginPath(); ctx.arc(lx+7,ly-4,7,0,7); ctx.stroke();
    }
    ctx.restore();

    /* ----- explosion burst behind the 7-bank (EBD "EACH TARGET DOWN" art) ----- */
    ctx.save();
    ctx.translate(330,545);
    for (let layer=0; layer<2; layer++){
      const spikes = layer? 12 : 16, R = layer? 105 : 150, rIn = layer? 40 : 58;
      ctx.fillStyle = layer? 'rgba(255,243,192,.95)' : 'rgba(248,196,60,.9)';
      ctx.beginPath();
      for (let i=0;i<spikes*2;i++){
        const a = (i/(spikes*2))*Math.PI*2 + (layer?0.13:0);
        const r = i%2 ? rIn : R*(0.8+0.25*Math.sin(i*2.7));
        ctx[i?'lineTo':'moveTo'](Math.cos(a)*r*1.15, Math.sin(a)*r*0.8);
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle='#b02a14'; ctx.textAlign='center';
    ctx.font='800 10.5px Georgia,serif';
    ctx.fillText('EACH TARGET DOWN', 30, -16);
    ctx.fillText('SCORES 2000', 30, -3);
    ctx.restore();

    /* ----- green felt pool panel with the full 15-ball rack ----- */
    ctx.save();
    rr(ctx,140,738,280,184,26);
    const felt=ctx.createRadialGradient(280,830,40,280,841,210);
    felt.addColorStop(0,'#2d9152'); felt.addColorStop(.7,'#1e7a40'); felt.addColorStop(1,'#13522a');
    ctx.fillStyle=felt; ctx.fill();
    ctx.strokeStyle='#e8c44a'; ctx.lineWidth=2.6; ctx.stroke();
    ctx.clip();
    /* rack: point-down triangle, stripes high, 8 in the heart (like the art) */
    const rows = [[11,12,13,14,15],[7,8,9,10],[4,5,6],[2,3],[1]];
    rows.forEach((row,ri)=>{
      row.forEach((n,ci)=>{
        const x = 280 + (ci - (row.length-1)/2)*27.4;
        const y = 772 + ri*26.5;
        billiard(ctx, x, y, 13.2, n===8 ? -1 : ((n-1)%7), false, n>8, n);
      });
    });
    ctx.restore();

    /* OUTHOLE bonus text + crossed cues, left-centre like the original */
    ctx.save();
    ctx.translate(150,724); ctx.textAlign='center';
    ctx.fillStyle='#f3e2b8'; ctx.font='800 8.6px Georgia,serif';
    ctx.fillText('OUTHOLE RACKS UP', 0, 0);
    ctx.fillText('7000 BONUS FOR', 0, 11);
    ctx.fillText('EACH LIT BALL', 0, 22);
    for (const m of [-0.45, 0.45]){
      ctx.save(); ctx.translate(0,-32); ctx.rotate(m); ctx.globalAlpha=.9;
      const cg=ctx.createLinearGradient(-34,0,38,0);
      cg.addColorStop(0,'#caa46a'); cg.addColorStop(1,'#6e4a26');
      ctx.fillStyle=cg; ctx.fillRect(-34,-1.8,72,3.6);
      ctx.restore();
    }
    ctx.restore();

    /* 25,000 WHEN LIT banner at the crown */
    ctx.save();
    ctx.translate(280,36); ctx.textAlign='center';
    rr(ctx,-44,-11,88,22,6);
    ctx.fillStyle='#b02a14'; ctx.fill();
    ctx.strokeStyle='#e8c44a'; ctx.lineWidth=1.6; ctx.stroke();
    ctx.fillStyle='#ffe9b8'; ctx.font='800 10px Georgia,serif';
    ctx.fillText('25,000', 0, -0.5);
    ctx.font='700 6.4px sans-serif';
    ctx.fillText('WHEN LIT', 0, 7.5);
    ctx.restore();

    /* yellow horseshoe around SHOOT AGAIN (the EBD bottom-centre icon) */
    ctx.save();
    ctx.translate(280,996);
    ctx.strokeStyle='#e8c44a'; ctx.lineWidth=7; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(0,4,34, Math.PI*0.86, Math.PI*0.14, false); ctx.stroke();
    ctx.strokeStyle='rgba(120,80,16,.55)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,4,34, Math.PI*0.86, Math.PI*0.14, false); ctx.stroke();
    for (let i=0;i<7;i++){
      const a = Math.PI*0.86 - (i/6)*(Math.PI*0.72+Math.PI);
      ctx.fillStyle='#8a6020';
      ctx.beginPath(); ctx.arc(Math.cos(a)*34, 4+Math.sin(a)*34, 1.8, 0, 7); ctx.fill();
    }
    ctx.restore();

    /* ----- BANK SHOT VALUE ladder panel (left, rope-bordered like the art) ----- */
    rr(ctx,66,448,46,250,10);
    ctx.fillStyle='rgba(10,18,52,.55)'; ctx.fill();
    ctx.strokeStyle='#e8c44a'; ctx.lineWidth=1.8; ctx.stroke();
    ctx.save();
    ctx.translate(89,442); ctx.textAlign='center';
    ctx.fillStyle='#ffe9b8'; ctx.font='800 8px Georgia,serif';
    ctx.fillText('BANK SHOT', 0, -10);
    ctx.fillText('VALUE', 0, 0);
    ctx.restore();

    /* ----- inserts (off state) ----- */
    const L = TABLE.lamps;
    for (const id in L){
      const lp = L[id];
      if (id.startsWith('pool')) billiard(ctx,lp.x,lp.y,13,+id.slice(4),true);
      else if (id.startsWith('dl')&&id!=='dlx'){ insertCircle(ctx,lp.x,lp.y,11,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,11,'#d8bc7a'); }
      else if (id.startsWith('x')){ insertCircle(ctx,lp.x,lp.y,13,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,10,'#d8a88a'); }
      else if (id.startsWith('bk')){ insertRect(ctx,lp.x-17,lp.y-8,34,16,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,9,'#e0c484'); }
      else if (id==='A'||id==='B'||id==='C'||id==='D'){ insertCircle(ctx,lp.x,lp.y,10,'#0f7a38'); label(ctx,lp.x,lp.y,lp.label,11,'#9adbae'); }
      else if (id==='eightL'){ insertCircle(ctx,lp.x,lp.y,13,'#111'); label(ctx,lp.x,lp.y,'8',12,'#999'); }
      else if (id==='saucerL'){ insertRect(ctx,lp.x-26,lp.y-8,52,16,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,8,'#e0c484'); }
      else if (id==='again'){ insertCircle(ctx,lp.x,lp.y,14,'#7a3a10'); label(ctx,lp.x,lp.y-3,'SHOOT',6,'#f0c890'); label(ctx,lp.x,lp.y+4,'AGAIN',6,'#f0c890'); }
      else if (id==='arrowL'){ insertRect(ctx,lp.x-24,lp.y-8,48,16,'#7a1c10'); label(ctx,lp.x,lp.y,lp.label,8,'#e8a88a'); }
      else if (id==='bankT'){ insertRect(ctx,lp.x-28,lp.y-8,56,16,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,8,'#e0c484'); }
    }
    /* shot arrows (cream-outlined like classic playfield art) */
    arrow(ctx, 170,648, -1.82, '#cf3a28');         // up the in-line lane
    arrow(ctx, 414,430, -1.14, '#cf3a28');         // up the corner-pocket lane
    arrow(ctx, 37,756, -1.57, '#e8c44a');          // left lane

    /* ----- baked GI light pools (warm lamps under plastics) ----- */
    [[240,300,120,.13],[150,520,90,.10],[460,300,80,.12],[280,940,150,.12],[37,560,60,.10]].forEach(([x,y,r,a])=>{
      const g=ctx.createRadialGradient(x,y,4,x,y,r);
      g.addColorStop(0,`rgba(255,196,120,${a})`); g.addColorStop(1,'rgba(255,196,120,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    });

    /* ----- sling plastics: red-curtain panels with cowboy silhouettes ----- */
    for (const m of [1,-1]){
      ctx.save();
      if (m<0){ ctx.translate(518,0); ctx.scale(-1,1); }   // mirror for right sling
      ctx.beginPath();
      ctx.moveTo(116,882); ctx.lineTo(170,950); ctx.lineTo(110,942); ctx.closePath();
      const g=ctx.createLinearGradient(110,880,170,950);
      g.addColorStop(0,'#8e2f23'); g.addColorStop(1,'#5e1810');
      ctx.fillStyle=g; ctx.fill();
      /* curtain stripes */
      ctx.save(); ctx.clip();
      ctx.strokeStyle='rgba(255,210,170,.22)'; ctx.lineWidth=3;
      for (let sx=104; sx<176; sx+=8){ ctx.beginPath(); ctx.moveTo(sx,876); ctx.lineTo(sx,956); ctx.stroke(); }
      /* cowboy silhouette: hat + head + shoulders */
      ctx.fillStyle='#f3e2b8';
      ctx.beginPath(); ctx.ellipse(136,914,4.6,5.4,0,0,7); ctx.fill();           // head
      ctx.beginPath(); ctx.ellipse(136,909,9,2.4,0,0,7); ctx.fill();             // brim
      rr(ctx,132,901,8,6,2); ctx.fill();                                          // crown
      ctx.beginPath(); ctx.ellipse(136,928,9.5,7,0,Math.PI,0); ctx.fill();        // shoulders
      ctx.restore();
      ctx.strokeStyle='rgba(246,239,223,.85)'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.restore();
    }

    /* ----- mechanical: walls, guides, posts ----- */
    drawWalls(ctx);

    /* bumper base art rings (white + rope, like the real blue upper field) */
    for (const b of TABLE.bumpers){
      ctx.strokeStyle='rgba(243,236,220,.65)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(b.x,b.y,40,0,7); ctx.stroke();
      ctx.strokeStyle='rgba(232,196,74,.5)'; ctx.lineWidth=1.6;
      ctx.setLineDash([7,4]);
      ctx.beginPath(); ctx.arc(b.x,b.y,46,0,7); ctx.stroke();
      ctx.setLineDash([]);
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
    plastic:['#7aa0e8','#3a64c4','#1d3470','rgba(220,235,255,.45)'],
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
    ctx.fillStyle='rgba(8,12,30,.45)'; rr(ctx,-12,-3,24,11,3); ctx.fill();
    /* white face (real EBD targets are white), coloured ball roundel */
    const g=ctx.createLinearGradient(0,-7,0,5);
    g.addColorStop(0,'#ffffff'); g.addColorStop(0.45,'#efe8d6'); g.addColorStop(1,'#bfb49a');
    ctx.fillStyle=g; rr(ctx,-11,-7,22,11,3); ctx.fill();
    ctx.strokeStyle='rgba(24,16,8,.6)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-9.5,-6); ctx.lineTo(9.5,-6); ctx.stroke();
    if (num){
      const rg=ctx.createRadialGradient(-1.4,-3,0.5,0,-1.6,5.4);
      rg.addColorStop(0, shade(col,46)); rg.addColorStop(1, shade(col,-18));
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,-1.6,5,0,7); ctx.fill();
      ctx.strokeStyle='rgba(24,16,8,.45)'; ctx.lineWidth=0.8; ctx.stroke();
      ctx.fillStyle='#fff7e6'; ctx.font='700 7.2px Georgia,serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(num,0,-1.4);
    } else {
      ctx.fillStyle = col;
      rr(ctx,-7,-4.5,14,5,2); ctx.fill();
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
    /* body: white base like the real machine */
    const g=ctx.createRadialGradient(b.x-7,b.y-9,4,b.x,b.y,29);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.6,'#e4dcc8'); g.addColorStop(1,'#a89c80');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(b.x,b.y,27,0,7); ctx.fill();
    ctx.strokeStyle='rgba(40,28,12,.45)'; ctx.lineWidth=1; ctx.stroke();
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
    /* plastic body: white with cream shading (real EBD flippers are white) */
    taperPath(ctx,f.px,f.py,tx,ty,r0-2.8,r1-2.6);
    const g=ctx.createLinearGradient(f.px,f.py-r0,f.px,f.py+r0);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.5,'#f0e9d8'); g.addColorStop(1,'#c8bda4');
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
