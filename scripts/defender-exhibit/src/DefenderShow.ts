import {ArcadeGame} from './game';
type Foe={x:number;y:number;kind:number;phase:number;alive:boolean};
type Spark={x:number;y:number;vx:number;vy:number;life:number;max:number;color:string};
/** Autonomous, original rendering of a Defender-inspired attract sequence. No ROM or player input. */
export class DefenderShow extends ArcadeGame {
 world=4800; cameraX=0; shotClock=0; spawnClock=0; rescueClock=0; demoPaused=false; flash=0;
 foes:Foe[]=[]; sparks:Spark[]=[]; lasers:{x:number;y:number;dir:number;life:number}[]=[];
 rings:{x:number;y:number;life:number;color:string}[]=[];
 demoHumans=Array.from({length:24},(_,i)=>180+i*194); seed=81; kills=0;
 constructor(){super();this.canvas.width=960;this.canvas.height=720;this.canvas.setAttribute('aria-label','Autonomous Defender-inspired space battle');this.running=true;this.populateDemo();this.draw();}
 rand(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 populateDemo(){this.foes=Array.from({length:26},(_,i)=>({x:200+i*177,y:150+(i*83)%350,kind:i%4,phase:i*1.37,alive:true}));}
 wrap(x:number){return (x%this.world+this.world)%this.world;}
 delta(x:number){return ((x-this.x+this.world*1.5)%this.world)-this.world*.5;}
 burst(x:number,y:number,color:string){for(let i=0;i<32;i++){const a=this.rand()*Math.PI*2,v=50+this.rand()*200,life=.3+this.rand()*.7;this.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life,max:life,color})}this.rings.push({x,y,life:.6,color});this.tone(100,.13,'sawtooth');}
 override update(step:number){const dt=Math.max(0,Math.min(step,.04));if(!this.power){this.draw();return}if(this.demoPaused)return;
 this.time+=dt;this.flash=Math.max(0,this.flash-dt*2);this.rescueClock+=dt;this.spawnClock+=dt;
 const cycle=this.rescueClock%22;const oldY=this.y;this.dir=Math.floor(this.time/38)%2===0?1:-1;
 this.x=this.wrap(this.x+this.dir*(cycle>13&&cycle<17?150:245)*dt);
 if(cycle>12&&cycle<18){const desired=cycle<15?590:260;this.y+=(desired-this.y)*Math.min(1,dt*2.4);if(cycle>14.5&&cycle<15.5&&!this.carrying){this.carrying=true;this.score+=500;this.burst(this.x,this.y+22,'#ffee80');}if(cycle>17.3&&this.carrying){this.carrying=false;this.rescued++;this.score+=500;}}
 else {const target=this.foes.filter(e=>e.alive&&this.delta(e.x)*this.dir>80&&this.delta(e.x)*this.dir<750).sort((a,b)=>Math.abs(this.delta(a.x))-Math.abs(this.delta(b.x)))[0];const desired=target?target.y:310+Math.sin(this.time*.9)*120;this.y+=(desired-this.y)*Math.min(1,dt*3.2);}
 this.y=Math.max(140,Math.min(595,this.y));this.shotClock-=dt;
 if(this.shotClock<=0){this.lasers.push({x:this.x+this.dir*26,y:this.y,dir:this.dir,life:.8});this.shotClock=.16+this.rand()*.1;this.tone(850,.045);}
 for(const e of this.foes){if(!e.alive)continue;e.x=this.wrap(e.x+(e.kind===1?-this.dir*95:Math.sin(e.phase)*28)*dt);e.y+=Math.sin(this.time*1.6+e.phase)*22*dt;e.y=Math.max(130,Math.min(560,e.y));}
 for(const l of this.lasers){l.x=this.wrap(l.x+l.dir*1400*dt);l.life-=dt;for(const e of this.foes){const distance=Math.abs(((e.x-l.x+this.world*1.5)%this.world)-this.world*.5);if(e.alive&&distance<38&&Math.abs(e.y-l.y)<26){e.alive=false;l.life=0;this.score+=150;this.kills++;this.burst(e.x,e.y,['#74ff85','#ff557e','#d37aff','#ffcc55'][e.kind]);break}}}
 this.lasers=this.lasers.filter(l=>l.life>0);for(const s of this.sparks){s.x=this.wrap(s.x+s.vx*dt);s.y+=s.vy*dt;s.vy+=50*dt;s.life-=dt}this.sparks=this.sparks.filter(s=>s.life>0);this.rings.forEach(r=>r.life-=dt);this.rings=this.rings.filter(r=>r.life>0);
 if(this.spawnClock>2.2){this.spawnClock=0;this.foes=this.foes.filter(e=>e.alive);for(let i=0;i<6;i++){const x=this.wrap(this.x+this.dir*(420+i*100));this.foes.push({x,y:170+this.rand()*340,kind:Math.floor(this.rand()*4),phase:this.rand()*8,alive:true});this.rings.push({x,y:this.foes.at(-1)!.y,life:.6,color:'#7edcff'})}if(this.foes.length>38)this.foes.splice(0,this.foes.length-38);}
 this.wave=1+Math.floor(this.kills/20);this.cameraX=this.x- (this.dir===1?310:650);
 // The attract program's virtual input is visible in the hardware demonstration.
 this.keys.clear();this.keys.add(this.dir===1?'ArrowRight':'ArrowLeft');if(Math.abs(this.y-oldY)>.1)this.keys.add(this.y<oldY?'ArrowUp':'ArrowDown');if(this.shotClock>.13)this.keys.add('Space');this.draw();
 }
 sprite(pattern:string[],x:number,y:number,scale:number,colors:Record<string,string>){const c=this.ctx;for(let row=0;row<pattern.length;row++)for(let col=0;col<pattern[row].length;col++){const color=colors[pattern[row][col]];if(color){c.fillStyle=color;c.fillRect(Math.round(x+col*scale),Math.round(y+row*scale),scale,scale)}}}
 override draw(){const c=this.ctx,w=960,h=720;c.fillStyle='#010308';c.fillRect(0,0,w,h);if(!this.power)return;
 // sx uses the left edge as origin, retaining wraparound at both travel directions.
 const screen=(x:number)=>{let v=this.wrap(x-this.cameraX);if(v>this.world-200)v-=this.world;return v};
 c.save();c.beginPath();c.rect(0,96,w,574);c.clip();
 for(let layer=0;layer<3;layer++){c.globalAlpha=.25+layer*.2;for(let i=0;i<75;i++){const x=this.wrap(i*151.7-this.cameraX*(.08+layer*.08))%960,y=110+(i*87.3+layer*51)%450;c.fillStyle=i%7===0?'#76acff':'#b5ddff';c.fillRect(x,y,layer===2?2:1,layer===2?2:1)}}c.globalAlpha=1;
 const haze=c.createRadialGradient(710,440,0,710,440,500);haze.addColorStop(0,'#13305a22');haze.addColorStop(1,'#00000000');c.fillStyle=haze;c.fillRect(0,96,w,574);
 for(let layer=0;layer<3;layer++){const top=layer===2?625:570+layer*26;c.beginPath();c.moveTo(0,670);for(let px=0;px<=960;px+=6){const z=this.cameraX*(.4+layer*.3)+px;const y=top-Math.abs(Math.sin(z*.006))*35-Math.abs(Math.sin(z*.017+1))*18;c.lineTo(px,y)}c.lineTo(w,670);c.closePath();c.fillStyle=['#07111e','#131624','#251c23'][layer];c.fill();c.strokeStyle=['#214263','#5b4571','#ff934d'][layer];c.lineWidth=layer===2?2.5:1;c.shadowColor=c.strokeStyle;c.shadowBlur=layer===2?8:0;c.stroke();}
 c.shadowBlur=6;c.shadowColor='#baffb0';for(const x of this.demoHumans){const a=screen(x);if(a<0||a>w)continue;this.sprite(['.Y.','.W.','WWW','.W.','W.W'],a,609,2,{Y:'#ffe3a1',W:'#b5ff86'})}
 const patterns=[['..GGGG..','.GGGGGG.','GG.GG.GG','..GGGG..','.G.GG.G.','G..GG..G'],['...RR...','..RRRR..','.RRWWRR.','RRRRRRRR','..R..R..','.R....R.'],['..PPPP..','.PPWWPP.','PPWWWWPP','.PPWWPP.','..PPPP..'],['...YY...','..YYYY..','.YYWWYY.','YYYYYYYY','.Y.YY.Y.','Y......Y']];
 for(const e of this.foes){if(!e.alive)continue;const x=screen(e.x);if(x<-40||x>w+40)continue;const color=['#64ff7e','#ff426c','#b06aff','#ffcc49'][e.kind];c.shadowColor=color;c.shadowBlur=12;this.sprite(patterns[e.kind],x-12,e.y-10,3,{G:color,R:color,P:color,Y:color,W:'#efffff'});if(e.kind===0){c.strokeStyle='#78ff7e22';c.beginPath();c.moveTo(x,e.y+15);c.lineTo(x-18,e.y+65);c.lineTo(x+18,e.y+65);c.closePath();c.fillStyle='#71ff8110';c.fill()}}
 c.globalCompositeOperation='lighter';for(const l of this.lasers){const x=screen(l.x);const g=c.createLinearGradient(x-l.dir*110,l.y,x,l.y);g.addColorStop(0,'#ff337700');g.addColorStop(.5,'#fa528d');g.addColorStop(.8,'#69dfff');g.addColorStop(1,'#ffffff');c.fillStyle=g;c.shadowColor='#5dcfff';c.shadowBlur=13;c.fillRect(x-l.dir*110,l.y-1.5,l.dir*110,3);}
 for(const s of this.sparks){c.globalAlpha=Math.max(0,s.life/s.max);c.fillStyle=s.color;c.shadowColor=s.color;c.shadowBlur=8;c.fillRect(screen(s.x),s.y,3,3)}c.globalAlpha=1;for(const r of this.rings){c.globalAlpha=r.life/.6;c.strokeStyle=r.color;c.shadowColor=r.color;c.shadowBlur=10;c.lineWidth=2;c.beginPath();c.arc(screen(r.x),r.y,(.6-r.life)*100+3,0,Math.PI*2);c.stroke()}c.globalAlpha=1;c.globalCompositeOperation='source-over';
 const x=screen(this.x);c.save();c.translate(x,this.y);c.scale(this.dir,1);c.shadowColor='#69d8ff';c.shadowBlur=12;this.sprite(['......CCC.......','..WWWWWWWWWW....','WWWWWWWWWWWWWWWW','...WWWWWWWW.....','......WW........'],-24,-7,3,{W:'#e5ffff',C:'#42d9ff'});c.globalCompositeOperation='lighter';const flame=25+Math.sin(this.time*57)*9;c.fillStyle='#ff6c29';c.shadowColor='#ff6325';c.shadowBlur=17;c.beginPath();c.moveTo(-24,-3);c.lineTo(-24-flame,1);c.lineTo(-24,6);c.fill();c.fillStyle='#ffeda0';c.fillRect(-35,-1,12,4);c.restore();
 if(this.carrying){c.shadowColor='#baff7b';this.sprite(['.Y.','.W.','WWW','.W.','W.W'],x-3,this.y+15,2,{Y:'#fff1af',W:'#aaff80'});c.fillStyle='#cfff8d';c.font='bold 16px monospace';c.fillText('500',x+28,this.y+30)}c.restore();
 // A compact, period-inspired radar and score rail stays readable on the cabinet.
 c.fillStyle='#050912';c.fillRect(0,0,960,96);c.fillRect(0,670,960,50);c.strokeStyle='#294968';c.lineWidth=2;c.strokeRect(254,15,450,58);c.fillStyle='#09253e';c.fillRect(254+this.wrap(this.cameraX)/this.world*450,17,90,54);for(const e of this.foes){if(e.alive){c.fillStyle=['#66ff88','#ff567b','#be7aff','#ffdd55'][e.kind];c.fillRect(254+e.x/this.world*450,22+e.y/660*40,3,3)}}c.fillStyle='#fff';c.fillRect(254+this.x/this.world*450,22+this.y/660*40,5,3);
 c.shadowColor='#69dfff';c.shadowBlur=7;c.font='bold 26px monospace';c.fillStyle='#e2ffff';c.fillText(String(this.score).padStart(7,'0'),24,43);c.font='bold italic 26px monospace';c.fillStyle='#ffca58';c.fillText('DEFENDER',754,43);c.font='12px monospace';c.fillStyle='#819fb7';c.fillText('1UP  /  AUTOPILOT',24,66);c.fillText('WAVE '+String(this.wave).padStart(2,'0'),788,66);c.font='14px monospace';c.fillStyle='#98bdd0';c.fillText('DEFEND THE HUMANOIDS',26,700);c.fillStyle='#b4ff9a';c.fillText(this.carrying?'HUMANOID RESCUED':'PLANET PATROL',365,700);c.fillStyle='#f9bf67';c.fillText('ATTRACT MODE',789,700);c.shadowBlur=0;
 const vignette=c.createRadialGradient(480,360,230,480,360,590);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#00000088');c.fillStyle=vignette;c.fillRect(0,0,w,h);c.fillStyle='#00000028';for(let y=0;y<h;y+=3)c.fillRect(0,y,w,1);
 }
}
