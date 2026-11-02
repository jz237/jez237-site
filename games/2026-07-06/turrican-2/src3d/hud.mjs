// HUD on the 2D overlay canvas. Virtual space: height 540, width 540*aspect (no stretching).
const WCOL={spread:'#ffd23f',beam:'#6cf3ff',bounce:'#ff7ad9',seeker:'#ff9a3c',flare:'#ff6a2a',prism:'#d9a8ff'};
const WNAME={spread:'SCATTER',beam:'ARC LANCE',bounce:'RICOCHET',seeker:'SEEKER SWARM',flare:'SOLAR FLARE',prism:'PRISM CANNON'};
const WORDER=['spread','beam','bounce','seeker','flare','prism'];

export function createHUD(dx){
  let banner=null;
  function setBanner(text,sub){banner={text,sub,t:0};}
  let VH=540;
  function frame(aspect,cssH){VH=Math.max(400,Math.min(540,(cssH||540)*1.08));const vw=VH*aspect;dx.save();dx.scale(960/vw,540/VH);return vw;}
  function bar(x,y,w,h,f,col,segments){dx.fillStyle='rgba(8,16,26,.75)';dx.fillRect(x-1,y-1,w+2,h+2);
    const n=segments||1,gap=n>1?2:0,sw=(w-gap*(n-1))/n;for(let i=0;i<n;i++){const fill=Math.max(0,Math.min(1,f*n-i));if(fill<=0)continue;dx.fillStyle=col;dx.fillRect(x+i*(sw+gap),y,sw*fill,h);}
    dx.fillStyle='rgba(255,255,255,.18)';dx.fillRect(x,y,w*Math.max(0,f),1);}
  function crystalIcon(x,y,s,col){dx.save();dx.translate(x,y);dx.beginPath();dx.moveTo(0,-s);dx.lineTo(s*.55,-s*.2);dx.lineTo(s*.35,s);dx.lineTo(-s*.35,s);dx.lineTo(-s*.55,-s*.2);dx.closePath();
    dx.shadowColor=col;dx.shadowBlur=8;dx.fillStyle=col;dx.fill();dx.shadowBlur=0;dx.fillStyle='rgba(255,255,255,.55)';dx.beginPath();dx.moveTo(0,-s);dx.lineTo(s*.2,-s*.1);dx.lineTo(0,s*.6);dx.closePath();dx.fill();dx.restore();}
  function text(t,x,y,size,col,align='left',weight='600'){dx.font=`${weight} ${size}px "Rajdhani","Trebuchet MS",system-ui,sans-serif`;dx.textAlign=align;dx.textBaseline='alphabetic';dx.fillStyle=col;dx.fillText(t,x,y);}

  function draw(s,aspect,project,clock,dt,cssH){
    const vw=frame(aspect,cssH),p=s.player;
    // top shade
    const g=dx.createLinearGradient(0,0,0,78);g.addColorStop(0,'rgba(2,8,16,.82)');g.addColorStop(1,'rgba(2,8,16,0)');dx.fillStyle=g;dx.fillRect(0,0,vw,78);
    const L=Math.max(18,vw*.025),R=vw-L;
    // armour
    text('ARMOR',L,22,11,'#8fb3c4');const low=p.energy<30;const ac=low?(Math.sin(clock*12)>0?'#ff5d6a':'#ff9aa2'):'#73f0ea';
    bar(L,28,170,7,p.energy/p.maxEnergy,ac,10);text(String(Math.max(0,Math.ceil(p.energy))).padStart(3,'0'),L+180,36,16,'#eafcff','left','700');
    // lives: small helmet pips
    for(let i=0;i<Math.min(8,p.lives);i++){dx.fillStyle='#bfe9f5';dx.beginPath();dx.arc(L+5+i*13,50,4.2,Math.PI,0);dx.lineTo(L+9.2+i*13,54);dx.lineTo(L+.8+i*13,54);dx.closePath();dx.fill();dx.fillStyle='#63eeff';dx.fillRect(L+2.5+i*13,48.5,5,1.6);}
    if(p.lives>8)text('×'+p.lives,L+108,55,11,'#bfe9f5');
    // weapon block
    const cx=vw*.36,wc=WCOL[p.weapon]||'#fff',lvl=p.weapons[p.weapon]||1;
    dx.save();dx.shadowColor=wc;dx.shadowBlur=10;text(p.morph?'ROLL CORE':WNAME[p.weapon],cx,26,15,wc,'left','700');dx.restore();
    for(let i=0;i<3;i++){dx.fillStyle=i<lvl?wc:'rgba(255,255,255,.15)';dx.beginPath();dx.moveTo(cx+i*14,40);dx.lineTo(cx+i*14+10,40);dx.lineTo(cx+i*14+7,46);dx.lineTo(cx+i*14-3,46);dx.closePath();dx.fill();}
    // owned weapons (number keys 1-6 pick directly): lit diamonds, the gun in hand ringed
    WORDER.forEach((w,i)=>{const own=(p.weapons[w]||0)>0,x=cx+3+i*9,y=55;dx.fillStyle=own?WCOL[w]:'rgba(255,255,255,.12)';dx.globalAlpha=own?(w===p.weapon?1:.55):1;
      dx.beginPath();dx.moveTo(x,y-3.4);dx.lineTo(x+3.4,y);dx.lineTo(x,y+3.4);dx.lineTo(x-3.4,y);dx.closePath();dx.fill();dx.globalAlpha=1;
      if(w===p.weapon){dx.strokeStyle='rgba(255,255,255,.85)';dx.lineWidth=1;dx.strokeRect(x-4.5,y-4.5,9,9);}});
    // prism charge meter: fills, then pulses white when the shot is fully built
    if(p.weapon==='prism'&&p.charging&&p.charge>0.02){const f=Math.min(1,p.charge),full=f>=1,w=64,x=cx+60,y=55;dx.fillStyle='rgba(8,16,26,.75)';dx.fillRect(x-1,y-3,w+2,6);
      const gr=dx.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,'#7fe6ff');gr.addColorStop(.5,'#d9a8ff');gr.addColorStop(1,'#ffb3e6');dx.fillStyle=full?(Math.sin(clock*24)>0?'#ffffff':'#ffe9ff'):gr;dx.fillRect(x,y-2,w*f,4);
      text(full?'READY':'CHARGE',x+w+5,y+3,9,full?'#ffffff':'#d9a8ff','left','700');}
    text('CRYO',cx+52,46,10,'#a9eeff');for(let i=0;i<p.bombs;i++){dx.fillStyle='#a9eeff';dx.fillRect(cx+80+i*7,39,4,7);}
    text('SHOCK',cx+52+Math.max(48,p.bombs*7+34),46,10,'#67ffd4');for(let i=0;i<p.lines;i++){dx.fillStyle='#67ffd4';dx.fillRect(cx+52+Math.max(48,p.bombs*7+34)+36+i*7,39,4,7);}
    // timer
    const tl=Math.max(0,s.time),tcol=tl<30?(Math.sin(clock*10)>0?'#ff6b78':'#ffb3ba'):'#c9dbe5';
    text(`${Math.floor(tl/60)}:${String(Math.floor(tl%60)).padStart(2,'0')}`,vw*.62,30,18,tcol,'center','700');
    // shards + score
    crystalIcon(R-118,24,8,'#7fe6ff');text(String(p.gems),R-104,31,20,'#dff9ff','left','700');
    text(String(p.score).padStart(7,'0'),R,54,15,'#eaf4ff','right','700');text('SCORE',R-74,54,9,'#7d97a6','right');
    // boss bar
    const b=s.boss;if(b&&b.alive&&b.awake){const w=Math.min(420,vw*.5),x=vw/2-w/2,y=VH-46;dx.fillStyle='rgba(4,10,18,.7)';dx.fillRect(x-12,y-24,w+24,40);
      dx.save();dx.shadowColor='#ff3b5a';dx.shadowBlur=8;text(b.name,vw/2,y-8,13,'#ffc0c8','center','700');dx.restore();
      bar(x,y,w,6,Math.max(0,b.hp/b.maxHp),b.open?(Math.sin(clock*14)>0?'#fff27a':'#ffb347'):'#ff4d6d',24);
      dx.fillStyle='rgba(255,255,255,.5)';for(const f of [1/3,2/3])dx.fillRect(x+w*f,y-2,1,10);
      if(b.open)text('CORE EXPOSED',vw/2,y+18,9,'#fff27a','center','700');}
    // banner
    if(banner){banner.t+=dt;const t=banner.t;if(t>2.6)banner=null;else{const a=Math.min(1,t*5)*Math.min(1,(2.6-t)*3);dx.globalAlpha=a;
      const w=Math.min(vw*.7,520),y=150;const grd=dx.createLinearGradient(vw/2-w/2,0,vw/2+w/2,0);grd.addColorStop(0,'rgba(255,40,70,0)');grd.addColorStop(.5,banner.text==='WARNING'?'rgba(255,40,70,.35)':'rgba(80,220,255,.28)');grd.addColorStop(1,'rgba(255,40,70,0)');
      dx.fillStyle=grd;dx.fillRect(vw/2-w/2,y-34,w,52);dx.save();dx.shadowColor=banner.text==='WARNING'?'#ff3b5a':'#6cf3ff';dx.shadowBlur=14;
      text(banner.text,vw/2,y,30,banner.text==='WARNING'?'#ffd6dc':'#e6fdff','center','800');dx.restore();if(banner.sub)text(banner.sub,vw/2,y+16,12,'#b7cad6','center','600');dx.globalAlpha=1;}}
    // floating score text
    for(const f of s.floats){if(f.line||!f.text)continue;const q=project(f.x+6,f.y);if(!q)continue;const a=Math.min(1,f.life*2.5);dx.globalAlpha=a;
      dx.save();dx.shadowColor='#000';dx.shadowBlur=4;text(f.text,q.x*vw,q.y*VH,f.text.length>5?12:11,f.text==='1UP'?'#ff9fb3':'#f2fbff','center','700');dx.restore();dx.globalAlpha=1;}
    dx.restore();
  }
  return {draw,setBanner};
}
