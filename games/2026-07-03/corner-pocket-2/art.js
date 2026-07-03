/* Corner Pocket II: Back Room — playfield art.
   Static base pre-rendered at 2× into an offscreen canvas; dynamic elements
   (balls, flippers, targets, bumpers, spinner, magnet, lamps, fx) drawn per
   frame in playfield coordinates. Theme: the after-hours money game — deep
   green felt under smoke, neon signage, cash and dice on the table. */
'use strict';

const ART = (() => {
  const SC = 2;                       // base art supersample
  let base = null;

  const BALLCOLS = ['#f2b03c','#2467c4','#cf3a28','#7b3fa0','#e06a1f','#2e7d4f','#8c2f23'];
  const NEON = { mint:'#63e0b8', pink:'#ff9df0', gold:'#ffd257', blue:'#8fd0ff', red:'#ff5a6e' };

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
  function shade(hex,amt){
    const n=parseInt(hex.slice(1),16);
    let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt;
    r=r<0?0:r>255?255:r; g=g<0?0:g>255?255:g; b=b<0?0:b>255?255:b;
    return `rgb(${r},${g},${b})`;
  }
  function hexA(hex,a){
    const n=parseInt(hex.slice(1),16);
    return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`;
  }
  function billiard(ctx,x,y,r,i,dim,striped,num){
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

  /* neon tube lettering: dark halo, coloured glow, hot core */
  function neon(ctx, txt, x, y, size, col, italic){
    ctx.save();
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font = `${italic?'italic ':''}800 ${size}px Georgia,serif`;
    ctx.shadowColor = col; ctx.shadowBlur = size*0.9;
    ctx.fillStyle = col; ctx.fillText(txt, x, y);
    ctx.shadowBlur = size*0.35;
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
    ctx.fillText(txt, x, y);
    ctx.restore();
  }

  /* a scattered dollar bill */
  function bill(ctx,x,y,rot){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
    ctx.fillStyle='#274d33'; rr(ctx,-26,-11,52,22,2); ctx.fill();
    ctx.strokeStyle='#b9d8a9'; ctx.lineWidth=1; rr(ctx,-22,-8,44,16,2); ctx.stroke();
    ctx.fillStyle='#b9d8a9';
    ctx.beginPath(); ctx.arc(0,0,6,0,7); ctx.fill();
    ctx.fillStyle='#274d33'; ctx.font='800 9px Georgia,serif';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('$',0,0.5);
    ctx.restore();
  }

  /* a little die face */
  function die(ctx,x,y,s,rot,n){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
    const g=ctx.createLinearGradient(-s,-s,s,s);
    g.addColorStop(0,'#fdf8ea'); g.addColorStop(1,'#cfc4a8');
    ctx.fillStyle=g; rr(ctx,-s,-s,s*2,s*2,s*0.3); ctx.fill();
    ctx.strokeStyle='rgba(20,12,8,.6)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#b02a2a';
    const P = { 1:[[0,0]], 2:[[-1,-1],[1,1]], 3:[[-1,-1],[0,0],[1,1]],
                4:[[-1,-1],[1,-1],[-1,1],[1,1]], 5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],
                6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]] }[n] || [[0,0]];
    for (const [px,py] of P){
      ctx.beginPath(); ctx.arc(px*s*0.45, py*s*0.45, s*0.16, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- static base ---------- */
  function build(){
    base = document.createElement('canvas');
    base.width = TABLE.W*SC; base.height = TABLE.H*SC;
    const ctx = base.getContext('2d');
    ctx.scale(SC,SC);

    /* midnight walnut behind everything */
    const wood = ctx.createLinearGradient(0,0,TABLE.W,0);
    wood.addColorStop(0,'#150a05'); wood.addColorStop(.5,'#241208'); wood.addColorStop(1,'#130a05');
    ctx.fillStyle = wood; ctx.fillRect(0,0,TABLE.W,TABLE.H);
    ctx.globalAlpha = 0.3; ctx.strokeStyle='#0c0603'; ctx.lineWidth=1;
    for (let y=6;y<TABLE.H;y+=11){
      ctx.beginPath(); ctx.moveTo(0,y);
      for(let x=0;x<TABLE.W;x+=44) ctx.lineTo(x, y + Math.sin(x*0.04+y)*1.8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* deep-green felt deck inside the wall boundary */
    const deckPath = () => {
      ctx.beginPath();
      ctx.arc(280,300, 261, Math.PI, 0);
      ctx.lineTo(541,1158); ctx.lineTo(19,1158); ctx.closePath();
    };
    deckPath();
    const pf = ctx.createLinearGradient(0,0,0,TABLE.H);
    pf.addColorStop(0,'#17372a'); pf.addColorStop(.5,'#122e22'); pf.addColorStop(1,'#0c2016');
    ctx.fillStyle = pf; ctx.fill();
    /* felt nap */
    ctx.save(); deckPath(); ctx.clip();
    ctx.globalAlpha = 0.05; ctx.strokeStyle='#cfe8d8'; ctx.lineWidth=1;
    for (let y=40;y<TABLE.H;y+=9){
      ctx.beginPath(); ctx.moveTo(14,y); ctx.lineTo(TABLE.W-14,y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    /* smoke wisps drifting across the felt */
    for (const [sx,sy,sr,sa] of [[150,250,90,.05],[420,420,110,.045],[240,720,130,.05],[460,860,80,.04],[90,520,70,.04]]){
      const sg = ctx.createRadialGradient(sx,sy,4,sx,sy,sr);
      sg.addColorStop(0,`rgba(196,220,205,${sa})`); sg.addColorStop(1,'rgba(196,220,205,0)');
      ctx.fillStyle = sg;
      ctx.save(); ctx.translate(sx,sy); ctx.scale(1.8,0.7); ctx.translate(-sx,-sy);
      ctx.beginPath(); ctx.arc(sx,sy,sr,0,7); ctx.fill();
      ctx.restore();
    }
    /* gold pinstripe border */
    ctx.strokeStyle='rgba(255,210,87,.5)'; ctx.lineWidth=2.2; ctx.setLineDash([13,6]);
    ctx.beginPath(); ctx.arc(280,300, 240, Math.PI, 0);
    ctx.lineTo(520,1100); ctx.lineTo(40,1100); ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    /* neon BACK ROOM sign in the crown */
    neon(ctx, 'Back Room', 280, 250, 26, NEON.pink, true);
    neon(ctx, 'no house rules', 280, 274, 9, NEON.mint, true);
    /* neon $ by the back-room hole */
    neon(ctx, '$', 508, 250, 22, NEON.gold);
    /* neon OPEN LATE on the left wood rail, rotated */
    ctx.save(); ctx.translate(35,240); ctx.rotate(-1.05);
    neon(ctx, 'open late', 0, 0, 12, NEON.blue, true);
    ctx.restore();

    /* scattered money + dice + a hand of cards on the felt */
    bill(ctx, 470,640, 0.4); bill(ctx, 448,662, -0.15); bill(ctx, 330,335, -0.5);
    bill(ctx, 90,700, 0.9);
    die(ctx, 300,395, 8, 0.4, 5); die(ctx, 322,388, 7, -0.7, 3);
    /* cards fanned near the right rail */
    ctx.save(); ctx.translate(478,760);
    for (let i=0;i<3;i++){
      ctx.save(); ctx.rotate(-0.5 + i*0.35);
      ctx.fillStyle='#f6efdf'; rr(ctx,-13,-38,26,38,3); ctx.fill();
      ctx.strokeStyle='rgba(20,12,8,.5)'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle = i===1 ? '#b02a2a' : '#1c1c22';
      ctx.font='800 11px Georgia,serif'; ctx.textAlign='center';
      ctx.fillText(['♠','♥','♣'][i], -6, -26);
      ctx.restore();
    }
    ctx.restore();
    /* chalk cube by the hustle bank */
    ctx.save(); ctx.translate(508,560); ctx.rotate(0.2);
    ctx.fillStyle='#4f8fd0'; rr(ctx,-7,-7,14,14,2); ctx.fill();
    ctx.fillStyle='#3a6ea8'; rr(ctx,-7,-7,14,5,2); ctx.fill();
    ctx.restore();

    /* ----- THE MONEY TABLE: mahogany rails, brighter felt, brass pockets ----- */
    {
      const F = TABLE.FELT;
      /* rail bed */
      ctx.fillStyle='#3a1f0e';
      rr(ctx, F.x0-16, F.y0-16, (F.x1-F.x0)+32, (F.y1-F.y0)+32, 14); ctx.fill();
      ctx.strokeStyle='rgba(255,210,87,.4)'; ctx.lineWidth=1.6;
      rr(ctx, F.x0-13, F.y0-13, (F.x1-F.x0)+26, (F.y1-F.y0)+26, 12); ctx.stroke();
      /* felt */
      const fg = ctx.createRadialGradient((F.x0+F.x1)/2, (F.y0+F.y1)/2, 30, (F.x0+F.x1)/2, (F.y0+F.y1)/2, 170);
      fg.addColorStop(0,'#2d9152'); fg.addColorStop(.7,'#1e7a40'); fg.addColorStop(1,'#14582e');
      ctx.fillStyle=fg;
      rr(ctx, F.x0-4, F.y0-4, (F.x1-F.x0)+8, (F.y1-F.y0)+8, 8); ctx.fill();
      /* head string + spots */
      ctx.strokeStyle='rgba(255,255,255,.14)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(F.x0+8, 545); ctx.lineTo(F.x1-8, 545); ctx.stroke();
      for (const r of TABLE.RACK){
        ctx.fillStyle='rgba(255,255,255,.2)';
        ctx.beginPath(); ctx.arc(r.x, r.y+6, 2.5, 0, 7); ctx.fill();
      }
      /* the mouth: worn felt ramp marks under the gap */
      ctx.strokeStyle='rgba(255,210,87,.35)'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(222,622); ctx.lineTo(240,648); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(274,622); ctx.lineTo(256,648); ctx.stroke();
      /* mini table label */
      ctx.fillStyle='rgba(255,240,210,.75)'; ctx.font='800 9px Georgia,serif';
      ctx.textAlign='center';
      ctx.fillText('THE MONEY TABLE', (F.x0+F.x1)/2, F.y0+18);
      ctx.font='600 7px sans-serif'; ctx.fillStyle='rgba(255,240,210,.45)';
      ctx.fillText('SINK ALL 3 · SCRATCH AND YOU PAY', (F.x0+F.x1)/2, F.y0+29);
    }

    /* wager/lane micro-labels + shot arrows */
    arrow(ctx, 258,680, -1.62, NEON.gold);          // up into the money table mouth
    arrow(ctx, 414,430, -1.14, NEON.pink);          // up the back-room lane
    arrow(ctx, 92,722, -1.32, NEON.blue);           // up the inner-loop spinner slot
    ctx.textAlign='center'; ctx.font='800 8px Georgia,serif';
    ctx.fillStyle='#ffe9b8';
    ctx.fillText('MONEY', 232,700); ctx.fillText('TABLE', 232,710);
    ctx.fillText('BACK', 448,452); ctx.fillText('ROOM', 448,462);
    ctx.fillText('STAKES', 96,754);
    ctx.fillText('HUSTLE BANK', 420,690);
    ctx.fillText('OPENS THE DOOR', 420,700);

    /* ----- inserts (off state) ----- */
    const L = TABLE.lamps;
    for (const id in L){
      const lp = L[id];
      if (id.startsWith('mb')) billiard(ctx,lp.x,lp.y,12,[0,4,2][+id.slice(2)],true,+id.slice(2)===1,lp.label);
      else if (id.startsWith('ch')){ insertCircle(ctx,lp.x,lp.y,11,'#173a5e'); label(ctx,lp.x,lp.y,lp.label,11,'#7ab2e0'); }
      else if (id.startsWith('x')){ insertCircle(ctx,lp.x,lp.y,13,'#5a2018'); label(ctx,lp.x,lp.y,lp.label,10,'#d8a88a'); }
      else if (id==='A'||id==='B'||id==='C'||id==='D'){ insertCircle(ctx,lp.x,lp.y,10,'#0f7a38'); label(ctx,lp.x,lp.y,lp.label,11,'#9adbae'); }
      else if (id==='sb'||id==='jackL'){ insertRect(ctx,lp.x-26,lp.y-8,52,16,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,7.5,'#e0c484'); }
      else if (id==='lockL'){ insertRect(ctx,lp.x-20,lp.y-8,40,16,'#7a1c10'); label(ctx,lp.x,lp.y,lp.label,8,'#e8a88a'); }
      else if (id==='masse'){ insertCircle(ctx,lp.x,lp.y,12,'#3d1d5e'); label(ctx,lp.x,lp.y,'M',10,'#c9a0f0'); }
      else if (id==='kickL'){ insertRect(ctx,lp.x-17,lp.y-8,34,16,'#7a1c10'); label(ctx,lp.x,lp.y,lp.label,8,'#e8a88a'); }
      else if (id==='spinL'){ insertRect(ctx,lp.x-20,lp.y-8,40,16,'#173a5e'); label(ctx,lp.x,lp.y,lp.label,7,'#7ab2e0'); }
      else if (id==='run'||id==='hr'){ insertRect(ctx,lp.x-34,lp.y-8,68,16,'#7a5a14'); label(ctx,lp.x,lp.y,lp.label,7,'#e0c484'); }
      else if (id==='again'){ insertCircle(ctx,lp.x,lp.y,14,'#7a3a10'); label(ctx,lp.x,lp.y-3,'SHOOT',6,'#f0c890'); label(ctx,lp.x,lp.y+4,'AGAIN',6,'#f0c890'); }
      else if (id==='pkAL'||id==='pkBL'){ insertCircle(ctx,lp.x,lp.y,9,'#7a5a14'); label(ctx,lp.x,lp.y,'$',10,'#e0c484'); }
    }

    /* ----- baked GI light pools (cold back-room lamps) ----- */
    [[240,300,120,.10],[190,500,110,.09],[460,300,80,.11],[280,940,150,.10],[37,560,60,.09]].forEach(([x,y,r,a])=>{
      const g=ctx.createRadialGradient(x,y,4,x,y,r);
      g.addColorStop(0,`rgba(160,220,255,${a})`); g.addColorStop(1,'rgba(160,220,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
    });

    /* ----- sling plastics: emerald panels with dollar-sign silhouettes ----- */
    for (const m of [1,-1]){
      ctx.save();
      if (m<0){ ctx.translate(518,0); ctx.scale(-1,1); }
      ctx.beginPath();
      ctx.moveTo(116,882); ctx.lineTo(170,950); ctx.lineTo(110,942); ctx.closePath();
      const g=ctx.createLinearGradient(110,880,170,950);
      g.addColorStop(0,'#1c6e46'); g.addColorStop(1,'#0d3a22');
      ctx.fillStyle=g; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle='rgba(200,255,225,.2)'; ctx.lineWidth=3;
      for (let sx=104; sx<176; sx+=8){ ctx.beginPath(); ctx.moveTo(sx,876); ctx.lineTo(sx,956); ctx.stroke(); }
      ctx.fillStyle='#ffe9b8'; ctx.font='800 22px Georgia,serif';
      ctx.textAlign='center'; ctx.fillText('$', 138, 934);
      ctx.restore();
      ctx.strokeStyle='rgba(246,239,223,.85)'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.restore();
    }

    /* ----- mechanical: walls, guides, posts ----- */
    drawWalls(ctx);

    /* bumper base rings */
    for (const b of TABLE.bumpers){
      ctx.strokeStyle='rgba(243,236,220,.5)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(b.x,b.y,40,0,7); ctx.stroke();
      ctx.strokeStyle='rgba(255,210,87,.4)'; ctx.lineWidth=1.6;
      ctx.setLineDash([7,4]);
      ctx.beginPath(); ctx.arc(b.x,b.y,46,0,7); ctx.stroke();
      ctx.setLineDash([]);
    }

    /* apron */
    const ap = ctx.createLinearGradient(0,1062,0,TABLE.H);
    ap.addColorStop(0,'#123524'); ap.addColorStop(1,'#0a2015');
    ctx.fillStyle=ap;
    ctx.beginPath();
    ctx.moveTo(10,1160); ctx.lineTo(10,1108); ctx.lineTo(208,1058);
    ctx.lineTo(352,1058); ctx.lineTo(550,1108); ctx.lineTo(550,1160); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='rgba(255,210,87,.5)'; ctx.lineWidth=2; ctx.stroke();
    ctx.strokeStyle='rgba(255,210,87,.4)'; ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(22,1112); ctx.lineTo(210,1066); ctx.lineTo(350,1066); ctx.lineTo(538,1112);
    ctx.stroke();
    ctx.fillStyle='rgba(255,210,87,.7)';
    for (const [rx,ry] of [[60,1115],[140,1096],[230,1072],[330,1072],[420,1096],[500,1115]]){
      ctx.beginPath(); ctx.arc(rx,ry,2.2,0,7); ctx.fill();
    }
    neon(ctx, 'BACK ROOM', 280, 1122, 21, NEON.pink, true);
    ctx.font='600 9px sans-serif'; ctx.fillStyle='rgba(243,226,184,.7)'; ctx.textAlign='center';
    ctx.fillText('THE HOUSE ALWAYS WINS', 280, 1142);
    ctx.font='600 7.5px sans-serif'; ctx.fillStyle='rgba(243,226,184,.45)';
    ctx.fillText('CORNER POCKET · BOARD TWO · 3 BALLS PER GAME', 280, 1153);

    /* print grain + night vignette */
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
    const vg = ctx.createRadialGradient(280,580,200,280,580,640);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(4,10,7,.3)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,TABLE.W,TABLE.H);

    return base;
  }

  /* recessed glass inserts */
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

  /* shaded capsule rails */
  function shadedCapsule(ctx,ax,ay,bx,by,r,cols){
    const dx=bx-ax, dy=by-ay, L=Math.hypot(dx,dy)||1;
    const nx=-dy/L, ny=dx/L;
    capsulePath(ctx,ax+2.5,ay+4,bx+2.5,by+4,r+0.5);
    ctx.fillStyle='rgba(6,14,10,.35)'; ctx.fill();
    const mx=(ax+bx)/2, my=(ay+by)/2;
    const sgn = (nx - ny) < 0 ? 1 : -1;
    const g=ctx.createLinearGradient(mx+nx*r*sgn,my+ny*r*sgn,mx-nx*r*sgn,my-ny*r*sgn);
    g.addColorStop(0,cols[0]); g.addColorStop(0.45,cols[1]); g.addColorStop(1,cols[2]);
    capsulePath(ctx,ax,ay,bx,by,r);
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='rgba(10,20,14,.6)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.strokeStyle=cols[3]||'rgba(255,255,255,.35)'; ctx.lineWidth=Math.max(1,r*0.28);
    ctx.beginPath();
    ctx.moveTo(ax+nx*r*0.45*sgn, ay+ny*r*0.45*sgn);
    ctx.lineTo(bx+nx*r*0.45*sgn, by+ny*r*0.45*sgn);
    ctx.stroke();
  }

  const RAIL_COLS = {
    metal:  ['#dfe5ea','#9aa4ad','#525a62','rgba(255,255,255,.5)'],
    rubber: ['#4ecf9a','#238a5e','#0e4a30','rgba(190,255,225,.4)'],
    rubberHard: ['#4ecf9a','#238a5e','#0e4a30','rgba(190,255,225,.4)'],
    cushion:['#8a5a2c','#5e3a18','#33200c','rgba(255,220,170,.4)'],
    plastic:['#d883c8','#a4459a','#5e2158','rgba(255,220,250,.4)'],
    wood:   ['#cdb084','#a8895c','#6e5430','rgba(255,235,200,.4)'],
  };

  function drawWalls(ctx){
    for (const s of PHYS.segs()){
      if (s.id && (s.id.startsWith('h')&&s.id.length<=2 || s.id.startsWith('ch') || s.id==='door')) continue; // dynamic targets
      if (s.id==='gate' || s.id==='boxgate') continue;
      shadedCapsule(ctx,s.ax,s.ay,s.bx,s.by,s.r+1.5, RAIL_COLS[s.mat]||RAIL_COLS.wood);
      const len = Math.hypot(s.bx-s.ax, s.by-s.ay);
      if ((s.mat==='plastic'||s.mat==='wood'||s.mat==='cushion') && len > 90){
        const n = Math.max(2, Math.round(len/110));
        for (let i=0;i<n;i++){
          const t = (i+0.5)/n;
          const sx = s.ax + (s.bx-s.ax)*t, sy = s.ay + (s.by-s.ay)*t;
          const sg = ctx.createRadialGradient(sx-0.8,sy-1,0.3,sx,sy,2.6);
          sg.addColorStop(0,'#f4f0e4'); sg.addColorStop(1,'#5e5648');
          ctx.fillStyle = sg;
          ctx.beginPath(); ctx.arc(sx,sy,2.4,0,7); ctx.fill();
          ctx.strokeStyle='rgba(30,20,10,.6)'; ctx.lineWidth=0.7;
          ctx.beginPath(); ctx.moveTo(sx-1.5,sy); ctx.lineTo(sx+1.5,sy); ctx.stroke();
        }
      }
    }
    for (const c of PHYS.circs()){
      if (c.id && c.id.startsWith('bump')) continue;
      ctx.fillStyle='rgba(6,14,10,.35)';
      ctx.beginPath(); ctx.arc(c.x+2,c.y+3.5,c.r+1,0,7); ctx.fill();
      const g=ctx.createRadialGradient(c.x-c.r*0.4,c.y-c.r*0.5,1,c.x,c.y,c.r+2);
      g.addColorStop(0,'#6ee0ac');
      g.addColorStop(0.55,'#2a9a64');
      g.addColorStop(1,'#0e4a30');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(c.x,c.y,c.r+1,0,7); ctx.fill();
      ctx.strokeStyle='rgba(8,20,14,.55)'; ctx.lineWidth=1.1; ctx.stroke();
      ctx.fillStyle='rgba(235,255,245,.55)';
      ctx.beginPath(); ctx.arc(c.x-c.r*0.3,c.y-c.r*0.35,c.r*0.22,0,7); ctx.fill();
    }
    /* money-table pocket holes over the felt */
    for (const pk of TABLE.pockets){
      const g = ctx.createRadialGradient(pk.x,pk.y,2,pk.x,pk.y,15);
      g.addColorStop(0,'#050505'); g.addColorStop(.75,'#101012'); g.addColorStop(1,'#2c2c30');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(pk.x,pk.y,15,0,7); ctx.fill();
      ctx.strokeStyle='#b08a4a'; ctx.lineWidth=2.6;
      ctx.beginPath(); ctx.arc(pk.x,pk.y,15.5,0,7); ctx.stroke();
    }
    /* back-room lock hole */
    const lh = TABLE.lockHole;
    const g2 = ctx.createRadialGradient(lh.x,lh.y,2,lh.x,lh.y,18);
    g2.addColorStop(0,'#06050a'); g2.addColorStop(.8,'#1c1a22'); g2.addColorStop(1,'#3c3a44');
    ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(lh.x,lh.y,18,0,7); ctx.fill();
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(lh.x,lh.y,18,0,7); ctx.stroke();
    /* kickback coil housing in the left outlane */
    ctx.fillStyle='#1c1a22';
    rr(ctx, 24,1016, 28,26, 4); ctx.fill();
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=1.4;
    rr(ctx, 24,1016, 28,26, 4); ctx.stroke();
    /* magnet core under the playfield glass */
    const mg = TABLE.magnet;
    ctx.strokeStyle='rgba(200,135,255,.4)'; ctx.lineWidth=2;
    ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.arc(mg.x,mg.y,20,0,7); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(200,135,255,.16)';
    ctx.beginPath(); ctx.arc(mg.x,mg.y,14,0,7); ctx.fill();
  }

  /* ---------- dynamic drawing (playfield coords) ---------- */
  function drawLamps(ctx,t){
    const L=TABLE.lamps;
    ctx.save();
    for (const id in L){
      const lp=L[id]; if (!lp.on) continue;
      const pulse = .82 + .18*Math.sin(t*6 + lp.x);
      ctx.globalCompositeOperation='lighter';
      const r = id.startsWith('mb')?30: id==='again'?44 : 26;
      const g=ctx.createRadialGradient(lp.x,lp.y,2,lp.x,lp.y,r);
      const col = lp.color;
      g.addColorStop(0,'rgba(240,255,248,'+(0.8*pulse)+')');
      g.addColorStop(0.35, hexA(col,0.5*pulse));
      g.addColorStop(1,'rgba(99,224,184,0)');
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(lp.x,lp.y,r,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
      if (id.startsWith('mb')) billiard(ctx,lp.x,lp.y,12,[0,4,2][+id.slice(2)],false,+id.slice(2)===1,lp.label);
      else {
        ctx.fillStyle='rgba(240,255,248,.95)';
        ctx.font='700 '+(id==='again'||id==='sb'||id==='jackL'||id==='run'||id==='hr'||id==='spinL'?8:11)+'px sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(lp.label, lp.x, lp.y+0.5);
      }
    }
    ctx.restore();
  }

  function drawDropTarget(ctx,d,col,letter){
    const a = d.anim !== undefined ? d.anim : (d.up ? 1 : 0);
    ctx.save(); ctx.translate(d.cx,d.cy);
    ctx.rotate(Math.atan2(d.seg.by-d.seg.ay, d.seg.bx-d.seg.ax));
    ctx.fillStyle='rgba(6,12,8,.8)';
    rr(ctx,-12,-3,24,6,2); ctx.fill();
    ctx.restore();
    if (a <= 0.03) return;
    ctx.save();
    ctx.translate(d.cx,d.cy);
    ctx.rotate(Math.atan2(d.seg.by-d.seg.ay, d.seg.bx-d.seg.ax));
    ctx.translate(0, (1-a)*9);
    ctx.globalAlpha = Math.min(1, a*2.2);
    ctx.fillStyle='rgba(8,30,18,.45)'; rr(ctx,-12,-3,24,11,3); ctx.fill();
    const g=ctx.createLinearGradient(0,-7,0,5);
    g.addColorStop(0,'#ffffff'); g.addColorStop(0.45,'#efe8d6'); g.addColorStop(1,'#bfb49a');
    ctx.fillStyle=g; rr(ctx,-11,-7,22,11,3); ctx.fill();
    ctx.strokeStyle='rgba(8,20,14,.6)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-9.5,-6); ctx.lineTo(9.5,-6); ctx.stroke();
    if (letter){
      const rg=ctx.createRadialGradient(-1.4,-3,0.5,0,-1.6,5.4);
      rg.addColorStop(0, shade(col,46)); rg.addColorStop(1, shade(col,-18));
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,-1.6,5.4,0,7); ctx.fill();
      ctx.strokeStyle='rgba(8,20,14,.45)'; ctx.lineWidth=0.8; ctx.stroke();
      ctx.fillStyle='#fff7e6'; ctx.font='700 7.2px Georgia,serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(letter,0,-1.4);
    }
    ctx.restore();
  }

  function drawStandup(ctx,st,letter,lit){
    ctx.save();
    ctx.translate(st.cx,st.cy);
    ctx.rotate(Math.atan2(st.seg.by-st.seg.ay, st.seg.bx-st.seg.ax));
    ctx.fillStyle='rgba(6,14,10,.32)'; rr(ctx,-9.5,-2.5,19,8,2.5); ctx.fill();
    ctx.fillStyle='#8a6a3a'; rr(ctx,-10,1.5,20,3.5,1.5); ctx.fill();
    const g=ctx.createLinearGradient(0,-6,0,4);
    g.addColorStop(0, lit?'#e0f2ff':'#c8dcec'); g.addColorStop(1, lit?'#6aa8e0':'#7a99b4');
    ctx.fillStyle=g; rr(ctx,-8.5,-6,17,9,2.5); ctx.fill();
    ctx.strokeStyle='rgba(8,20,14,.5)'; ctx.lineWidth=0.9; ctx.stroke();
    ctx.fillStyle= lit?'#0d3a6e':'#1c4a7e';
    ctx.font='800 8px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(letter,0,-1.4);
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const fg=ctx.createRadialGradient(0,-2,1,0,-2,16);
      fg.addColorStop(0,'rgba(143,208,255,.55)'); fg.addColorStop(1,'rgba(143,208,255,0)');
      ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(0,-2,16,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
    ctx.restore();
  }

  /* dice pop bumper: cream skirt, white die cap with red pips */
  function drawBumper(ctx,b,glow,t){
    const lit = glow>0;
    const kick = lit ? glow : 0;
    const skirtR = 33 + kick*3.5;
    const capDy = kick*2.6;
    ctx.fillStyle='rgba(6,14,10,.35)';
    ctx.beginPath(); ctx.arc(b.x+3,b.y+5,skirtR,0,7); ctx.fill();
    const sk=ctx.createRadialGradient(b.x-6,b.y-9,6,b.x,b.y,skirtR+1);
    sk.addColorStop(0,'#fcf4e0'); sk.addColorStop(.7,'#e8d9b8'); sk.addColorStop(1,'#bfa87e');
    ctx.fillStyle=sk;
    ctx.beginPath(); ctx.arc(b.x,b.y,skirtR,0,7); ctx.fill();
    ctx.strokeStyle='rgba(30,40,26,.45)'; ctx.lineWidth=1.1; ctx.stroke();
    ctx.strokeStyle='rgba(120,96,60,.3)'; ctx.lineWidth=1;
    for (let i=0;i<8;i++){
      const a=i*Math.PI/4 + 0.39;
      ctx.beginPath();
      ctx.moveTo(b.x+Math.cos(a)*27, b.y+Math.sin(a)*27);
      ctx.lineTo(b.x+Math.cos(a)*skirtR, b.y+Math.sin(a)*skirtR);
      ctx.stroke();
    }
    const g=ctx.createRadialGradient(b.x-7,b.y-9,4,b.x,b.y,29);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.6,'#e4dcc8'); g.addColorStop(1,'#a89c80');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(b.x,b.y,27,0,7); ctx.fill();
    ctx.strokeStyle='rgba(24,32,20,.45)'; ctx.lineWidth=1; ctx.stroke();
    /* die cap */
    const cy = b.y + capDy;
    ctx.save();
    ctx.translate(b.x,cy); ctx.rotate(0.32 + b.pip*0.5);
    const dg=ctx.createLinearGradient(-16,-16,16,16);
    dg.addColorStop(0, lit?'#ffffff':'#f4eeda'); dg.addColorStop(1, lit?'#e8dfc4':'#c4b896');
    ctx.fillStyle=dg; rr(ctx,-15,-15,30,30,7); ctx.fill();
    ctx.strokeStyle='rgba(24,32,20,.55)'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.fillStyle= lit?'#e03434':'#b02a2a';
    const pips = { 1:[[0,0]], 2:[[-1,-1],[1,1]], 3:[[-1,-1],[0,0],[1,1]] }[b.pip] || [[0,0]];
    for (const [px,py] of pips){
      ctx.beginPath(); ctx.arc(px*7.2, py*7.2, 3.1, 0, 7); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,.3)';
    ctx.beginPath(); ctx.ellipse(b.x-5,cy-7.5,8,4,-0.6,0,7); ctx.fill();
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const fg=ctx.createRadialGradient(b.x,b.y,4,b.x,b.y,64*glow+30);
      fg.addColorStop(0,'rgba(180,255,220,'+(0.75*glow)+')');
      fg.addColorStop(1,'rgba(99,224,184,0)');
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
    taperPath(ctx,f.px+2.5,f.py+4.5,tx+2.5,ty+4.5,r0,r1);
    ctx.fillStyle='rgba(6,14,10,.4)'; ctx.fill();
    taperPath(ctx,f.px,f.py,tx,ty,r0,r1);
    const rg=ctx.createLinearGradient(f.px,f.py-r0,f.px,f.py+r0);
    rg.addColorStop(0,'#4ecf9a'); rg.addColorStop(1,'#14603c');
    ctx.fillStyle=rg; ctx.fill();
    ctx.strokeStyle='rgba(8,26,16,.6)'; ctx.lineWidth=1.1; ctx.stroke();
    taperPath(ctx,f.px,f.py,tx,ty,r0-2.8,r1-2.6);
    const g=ctx.createLinearGradient(f.px,f.py-r0,f.px,f.py+r0);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.5,'#eee9d6'); g.addColorStop(1,'#c2b89e');
    ctx.fillStyle=g; ctx.fill();
    ctx.strokeStyle='rgba(30,90,60,.4)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(f.px,f.py); ctx.lineTo(tx,ty); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1.6;
    ctx.beginPath();
    ctx.moveTo(f.px+(tx-f.px)*0.12, f.py+(ty-f.py)*0.12-3.4);
    ctx.lineTo(f.px+(tx-f.px)*0.85, f.py+(ty-f.py)*0.85-2.2);
    ctx.stroke();
    const pg=ctx.createRadialGradient(f.px-1.6,f.py-2,1,f.px,f.py,6.2);
    pg.addColorStop(0,'#f3dca0'); pg.addColorStop(1,'#7e5a1c');
    ctx.beginPath(); ctx.arc(f.px,f.py,6,0,7);
    ctx.fillStyle=pg; ctx.fill();
    ctx.strokeStyle='rgba(20,32,14,.6)'; ctx.lineWidth=1; ctx.stroke();
    ctx.restore();
  }

  function drawBall(ctx,x,y){
    ctx.fillStyle='rgba(4,14,9,.2)';
    ctx.beginPath(); ctx.ellipse(x+5,y+8,16.5,13.5,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(4,14,9,.36)';
    ctx.beginPath(); ctx.ellipse(x+3.5,y+6,13,10.5,0,0,7); ctx.fill();
    const g=ctx.createRadialGradient(x-5,y-6,1.5,x,y,14.4);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.2,'#eef2f5');
    g.addColorStop(.5,'#aab4bc'); g.addColorStop(.8,'#5a646c'); g.addColorStop(1,'#272e34');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,y,14,0,7); ctx.fill();
    /* cold felt reflection wrapping the lower half */
    ctx.fillStyle='rgba(70,160,115,.30)';
    ctx.beginPath(); ctx.ellipse(x+2.5,y+6.5,8.6,4.6,0.35,0,7); ctx.fill();
    ctx.fillStyle='rgba(30,80,55,.25)';
    ctx.beginPath(); ctx.ellipse(x,y+10.4,7,2.4,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.95)';
    ctx.beginPath(); ctx.arc(x-5.2,y-6.2,2.8,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.4)';
    ctx.beginPath(); ctx.arc(x+3.6,y-8.8,1.3,0,7); ctx.fill();
  }

  /* captive pool balls (object balls): 1 solid gold, 5 solid orange, 9 stripe */
  function drawObjectBall(ctx,b){
    ctx.fillStyle='rgba(4,14,9,.3)';
    ctx.beginPath(); ctx.ellipse(b.x+3,b.y+5,12,9.5,0,0,7); ctx.fill();
    const idx = b.num===1?0 : b.num===5?4 : 0;
    billiard(ctx, b.x, b.y, b.r, idx, false, b.num===9, b.num);
  }

  function drawSpinner(ctx,sp,t){
    /* rotating bar in the left orbit — foreshortened by cos(ang) */
    const c = Math.cos(sp.ang);
    const half = 17 * Math.abs(c);
    ctx.save();
    ctx.translate(sp.x, sp.y);
    /* bracket */
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-19,-9); ctx.lineTo(-19,0); ctx.moveTo(19,-9); ctx.lineTo(19,0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-19,-8); ctx.lineTo(19,-8); ctx.stroke();
    /* plate */
    const flip = c < 0;
    const g=ctx.createLinearGradient(0,-half,0,half);
    g.addColorStop(0, flip?'#8fd0ff':'#ffd257'); g.addColorStop(1, flip?'#2a5a8a':'#a06a10');
    ctx.fillStyle=g;
    rr(ctx,-15, -half, 30, Math.max(2.5, half*2), 2.5); ctx.fill();
    ctx.strokeStyle='rgba(10,20,14,.6)'; ctx.lineWidth=1; ctx.stroke();
    if (Math.abs(c) > 0.5){
      ctx.fillStyle = flip?'#123a5e':'#5e3c08';
      ctx.font='800 8px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.save(); ctx.scale(1, Math.abs(c)); ctx.fillText('$', 0, 0.5); ctx.restore();
    }
    ctx.restore();
  }

  function drawMagnet(ctx,mg,t){
    if (mg.lit){
      ctx.globalCompositeOperation='lighter';
      const pulse = .6 + .4*Math.sin(t*9);
      const g=ctx.createRadialGradient(mg.x,mg.y,2,mg.x,mg.y,34);
      g.addColorStop(0,`rgba(220,170,255,${0.5*pulse})`);
      g.addColorStop(1,'rgba(200,135,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(mg.x,mg.y,34,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
    const active = mg.holding || mg.spark > 0;
    if (active){
      ctx.strokeStyle='rgba(230,190,255,.85)'; ctx.lineWidth=1.6;
      for (let i=0;i<5;i++){
        const a = PHYS.rng()*Math.PI*2;
        const r1 = 6 + PHYS.rng()*8, r2 = 18 + PHYS.rng()*14;
        ctx.beginPath();
        ctx.moveTo(mg.x+Math.cos(a)*r1, mg.y+Math.sin(a)*r1);
        ctx.lineTo(mg.x+Math.cos(a+0.4)*(r1+r2)/2, mg.y+Math.sin(a+0.4)*(r1+r2)/2);
        ctx.lineTo(mg.x+Math.cos(a)*r2, mg.y+Math.sin(a)*r2);
        ctx.stroke();
      }
    }
  }

  function drawKicker(ctx,k, lit){
    if (lit){
      ctx.globalCompositeOperation='lighter';
      const g=ctx.createRadialGradient(k.x,k.y+14,2,k.x,k.y+14,26);
      g.addColorStop(0,'rgba(255,120,140,.5)'); g.addColorStop(1,'rgba(255,90,110,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(k.x,k.y+14,26,0,7); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    }
    if (k.anim > 0){
      const p = k.anim/0.5;
      ctx.fillStyle=`rgba(255,220,230,${0.8*p})`;
      rr(ctx, k.x-8, k.y - 30*(1-p), 16, 34, 4); ctx.fill();
    }
  }

  function drawHole(ctx,lh){
    /* held (locked) balls sit visible in the hole */
    for (let i=0;i<lh.held.length;i++){
      const s = lh.slots[i];
      drawBall(ctx, s.x, s.y);
    }
  }

  function drawPlunger(ctx,pull){
    const x=526, top=1090+pull*22;
    ctx.fillStyle='#3a2a10';
    ctx.fillRect(x-4, top+12, 8, 60);
    ctx.strokeStyle='#9aa6ae'; ctx.lineWidth=2;
    ctx.beginPath();
    for(let i=0;i<7;i++){
      ctx.moveTo(x-8, top+16+i*7); ctx.lineTo(x+8, top+19+i*7);
    }
    ctx.stroke();
    const g=ctx.createRadialGradient(x-2,top-2,1,x,top,9);
    g.addColorStop(0,'#6ee0ac'); g.addColorStop(1,'#14603c');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(x,top,9,0,7); ctx.fill();
  }

  function drawGate(ctx){
    const g=PHYS.segs().find(s=>s.id==='gate');
    if (!g) return;
    ctx.strokeStyle='rgba(220,225,235,.85)'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(g.ax,g.ay); ctx.lineTo(g.bx,g.by); ctx.stroke();
    ctx.beginPath(); ctx.arc(g.ax,g.ay,3,0,7); ctx.fillStyle='#cfd5dd'; ctx.fill();
  }

  return { build, get base(){return base;}, SC, NEON,
           drawLamps, drawDropTarget, drawStandup, drawBumper,
           drawFlipper, drawBall, drawObjectBall, drawSpinner, drawMagnet,
           drawKicker, drawHole, drawPlunger, drawGate,
           billiard, rr, shade, hexA, neon };
})();
