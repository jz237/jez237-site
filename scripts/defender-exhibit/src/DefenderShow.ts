import {ArcadeGame} from './game';
type Foe={x:number;y:number;kind:number;phase:number;alive:boolean;cooldown?:number};
type RescuePhase='descend'|'lift'|'intercept'|'fall'|'return';
type Rescue={lander:Foe;humanIndex:number;x:number;y:number;vy:number;phase:RescuePhase;age:number;dir:number};
type Spark={x:number;y:number;vx:number;vy:number;life:number;max:number;color:string};
/** Autonomous, original rendering of a Defender-inspired attract sequence. No ROM or player input. */
export class DefenderShow extends ArcadeGame {
 mines:{x:number;y:number;life:number}[]=[];charges:{x:number;y:number;vx:number;vy:number;life:number}[]=[]; cameraOffset=310;waveClock=0;escapeClock=0;
 world=4800; cameraX=0; shotClock=0; spawnClock=0; rescueClock=0; demoPaused=false; flash=0;
 foes:Foe[]=[]; sparks:Spark[]=[]; lasers:{x:number;y:number;dir:number;life:number}[]=[];
 rings:{x:number;y:number;life:number;color:string}[]=[];
 mission?:Rescue;nextRescue=4;rescueEvents={pickedUp:0,dropped:0,caught:0,delivered:0};
 demoHumans=Array.from({length:24},(_,i)=>180+i*194); seed=81; kills=0;
 constructor(){super();this.canvas.width=294;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Defender-inspired space battle');this.running=true;this.populateDemo();this.draw();}
 rand(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 populateDemo(){this.foes=Array.from({length:14},(_,i)=>({x:this.wrap(this.x+200+i*331),y:150+(i*83)%350,kind:i%4,phase:i*1.37,alive:true}));}
 wrap(x:number){return (x%this.world+this.world)%this.world;}
 delta(x:number){return ((x-this.x+this.world*1.5)%this.world)-this.world*.5;}
 burst(x:number,y:number,color:string){for(let i=0;i<32;i++){const a=this.rand()*Math.PI*2,v=50+this.rand()*200,life=.3+this.rand()*.7;this.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life,max:life,color})}this.rings.push({x,y,life:.6,color});this.tone(100,.13,'sawtooth');}
 groundY(x:number){const heights=[672,672,660,624,642,591,615,663,663,648,675,675,630,606,633,651,651,672,642,618,645,675,675,657,627,657,672,672,639,612,642,672];const z=this.wrap(x)/150,i=Math.floor(z);return heights[i]+(heights[(i+1)%heights.length]-heights[i])*(z-i);}
 moveX(target:number,speed:number,dt:number){this.x=this.wrap(this.x+Math.max(-speed*dt,Math.min(speed*dt,this.delta(target))));}
 moveY(target:number,speed:number,dt:number){this.y+=Math.max(-speed*dt,Math.min(speed*dt,target-this.y));}
 rescuePhase(phase:RescuePhase){if(this.mission){this.mission.phase=phase;this.mission.age=0;}}
 beginRescue(){const candidates=this.demoHumans.map((x,i)=>({x,i,d:this.delta(x)*this.dir})).filter(h=>h.d>280&&h.d<700).sort((a,b)=>Math.abs(a.d-420)-Math.abs(b.d-420));const human=candidates[0];if(!human){this.nextRescue=this.time+1;return;}
 const lander:Foe={x:human.x,y:250,kind:0,phase:0,alive:true};this.foes.push(lander);this.mission={lander,humanIndex:human.i,x:human.x,y:this.groundY(human.x)-15,vy:0,phase:'descend',age:0,dir:this.dir};}
 updateRescue(dt:number){const r=this.mission!;r.age+=dt;this.dir=r.dir;const ground=this.groundY(r.x);
 if(r.phase==='descend'){
  r.lander.y=Math.min(ground-39,r.lander.y+85*dt);this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y-105,190,dt);
  if(r.lander.y>=ground-39){r.y=r.lander.y+24;this.rescueEvents.pickedUp++;this.rescuePhase('lift');this.tone(390,.2,'sine');}
 }else if(r.phase==='lift'){
  r.lander.y-=65*dt;r.y=r.lander.y+24;this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y-105,190,dt);
  if(r.lander.y<=ground-205)this.rescuePhase('intercept');
 }else if(r.phase==='intercept'){
  r.y=r.lander.y+24;this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y,220,dt);
 }else if(r.phase==='fall'){
  r.vy=Math.min(170,r.vy+115*dt);r.y+=r.vy*dt;
  if(r.y>=ground-15){r.y=ground-15;this.carrying=false;this.mission=undefined;this.nextRescue=this.time+8;return;}
  if(r.age>.28){this.moveX(r.x,360,dt);this.moveY(r.y-18,340,dt);}
  if(Math.abs(this.delta(r.x))<23&&r.y-this.y>3&&r.y-this.y<34){this.carrying=true;this.score+=500;this.rescueEvents.caught++;this.rescuePhase('return');this.tone(920,.18,'sine');this.rings.push({x:this.x,y:this.y,life:.6,color:'#baff8e'});}
 }else {
  this.moveX(this.wrap(r.x+r.dir*105),160,dt);const target=r.age<.7?r.y-75:this.groundY(this.x)-30;this.moveY(target,145,dt);
  if(r.age>1&&Math.abs(this.y-(this.groundY(this.x)-30))<3){this.demoHumans[r.humanIndex]=this.x;this.carrying=false;this.rescued++;this.score+=500;this.rescueEvents.delivered++;this.tone(660,.2,'sine');this.mission=undefined;this.nextRescue=this.time+8+this.rand()*5;}
 }
 }
 override update(step:number){const dt=Math.max(0,Math.min(step,.04));if(!this.power){this.draw();return}if(this.demoPaused)return;
 this.time+=dt;this.flash=Math.max(0,this.flash-dt*2);this.rescueClock+=dt;this.spawnClock+=dt;this.waveClock+=dt;this.escapeClock=Math.max(0,this.escapeClock-dt);
 const oldY=this.y,oldX=this.x,oldDir=this.dir;if(!this.mission){this.dir=Math.floor(this.time/38)%2===0?1:-1;if(this.time>=this.nextRescue)this.beginRescue();}
 if(this.mission)this.updateRescue(dt);
 else {this.x=this.wrap(this.x+this.dir*245*dt);const target=this.foes.filter(e=>e.alive&&this.delta(e.x)*this.dir>80&&this.delta(e.x)*this.dir<750).sort((a,b)=>Math.abs(this.delta(a.x))-Math.abs(this.delta(b.x)))[0];const desired=target?target.y:310+Math.sin(this.time*.9)*120;this.y+=(desired-this.y)*Math.min(1,dt*3.2);}
 this.y=Math.max(140,Math.min(685,this.y));this.shotClock-=dt;
 if(this.shotClock<=0){this.lasers.push({x:this.x+this.dir*26,y:this.y,dir:this.dir,life:.8});this.shotClock=.16+this.rand()*.1;this.tone(850,.045);}
 for(const e of this.foes){if(!e.alive||e===this.mission?.lander)continue;
 const dx=-this.delta(e.x),dy=this.y-e.y;e.cooldown=(e.cooldown??(1+this.rand()*3))-dt;
 if(e.kind===0){e.x=this.wrap(e.x+Math.sin(e.phase)*25*dt);e.y+=Math.sign(this.groundY(e.x)-55-e.y)*28*dt;}
 else if(e.kind===1||e.kind===4||e.kind===5){const speed=e.kind===5?260:e.kind===4?205:130;e.x=this.wrap(e.x+(Math.abs(dx)<90?Math.cos(e.phase):Math.sign(dx))*speed*dt);e.y+=(Math.sign(dy)*65+Math.sin(this.time*5+e.phase)*55)*dt;}
 else {e.x=this.wrap(e.x+Math.cos(e.phase)*75*dt);e.y+=Math.sin(this.time+e.phase)*35*dt;}
 e.y=Math.max(125,Math.min(this.groundY(e.x)-25,e.y));
 if(e.cooldown<=0){e.cooldown=1.5+this.rand()*3;if(e.kind===2){this.mines.push({x:e.x,y:e.y,life:10});}else if(Math.abs(dx)<900){const d=Math.hypot(dx,dy)||1;this.charges.push({x:e.x,y:e.y,vx:dx/d*155,vy:dy/d*155,life:4});}}
 }
 for(const m of this.mines)m.life-=dt;this.mines=this.mines.filter(m=>m.life>0).slice(-45);
 for(const b of this.charges){b.x=this.wrap(b.x+b.vx*dt);b.y+=b.vy*dt;b.life-=dt;}this.charges=this.charges.filter(b=>b.life>0).slice(-40);
 for(const l of this.lasers){l.x=this.wrap(l.x+l.dir*1400*dt);l.life-=dt;for(const e of this.foes){const distance=Math.abs(((e.x-l.x+this.world*1.5)%this.world)-this.world*.5);if(e.alive&&(e!==this.mission?.lander||this.mission.phase==='intercept')&&distance<38&&Math.abs(e.y-l.y)<26){e.alive=false;l.life=0;if(e===this.mission?.lander){this.rescueEvents.dropped++;this.mission.vy=25;this.rescuePhase('fall');}this.score+=[150,150,250,1000,150,200][e.kind];this.kills++;this.burst(e.x,e.y,['#44ff22','#ff33dd','#cc55ff','#ff33dd','#ff3434','#44ff22'][e.kind]);if(e.kind===3)for(let j=0;j<4;j++)this.foes.push({x:this.wrap(e.x+(j-2)*24),y:e.y+(j-2)*18,kind:4,phase:j*1.6,alive:true});break}}}
 this.lasers=this.lasers.filter(l=>l.life>0);for(const s of this.sparks){s.x=this.wrap(s.x+s.vx*dt);s.y+=s.vy*dt;s.vy+=50*dt;s.life-=dt}this.sparks=this.sparks.filter(s=>s.life>0);this.rings.forEach(r=>r.life-=dt);this.rings=this.rings.filter(r=>r.life>0);
 this.foes=this.foes.filter(e=>e.alive);
 if(!this.foes.length&&!this.mission){this.wave++;this.waveClock=0;this.populateDemo();this.mines=[];this.charges=[];}
 if(this.waveClock>25&&this.spawnClock>9&&this.foes.length<28){this.spawnClock=0;this.foes.push({x:this.wrap(this.x+this.dir*850),y:180+this.rand()*280,kind:5,phase:this.rand()*8,alive:true});}
 while(this.foes.length>38){const i=this.foes.findIndex(e=>e!==this.mission?.lander);this.foes.splice(i,1);}
 if(!this.mission&&this.escapeClock===0&&[...this.foes,...this.mines,...this.charges].some(e=>Math.abs(this.delta(e.x))<24&&Math.abs(e.y-this.y)<22)){this.burst(this.x,this.y,'#fff');this.x=this.wrap(this.x+this.dir*580);this.y=210+this.rand()*230;this.escapeClock=8;this.tone(160,.2,'sawtooth');}
 this.cameraOffset+=((this.dir===1?310:650)-this.cameraOffset)*Math.min(1,dt*3);this.cameraX=this.x-this.cameraOffset;
 // The attract program's virtual input is visible in the hardware demonstration.
 this.keys.clear();if(Math.abs(this.x-oldX)>.01)this.keys.add('KeyT');if(this.dir!==oldDir)this.keys.add('KeyR');if(this.escapeClock>7.8)this.keys.add('KeyH');this.keys.add(this.dir===1?'ArrowRight':'ArrowLeft');if(Math.abs(this.y-oldY)>.1)this.keys.add(this.y<oldY?'ArrowUp':'ArrowDown');if(this.shotClock>.13)this.keys.add('Space');this.draw();
 }
 sprite(pattern:string[],x:number,y:number,scale:number,colors:Record<string,string>){const c=this.ctx;for(let row=0;row<pattern.length;row++)for(let col=0;col<pattern[row].length;col++){const color=colors[pattern[row][col]];if(color){c.fillStyle=color;c.fillRect(Math.round(x+col*scale),Math.round(y+row*scale),scale,scale)}}}
 pixelText(text:string,x:number,y:number,color:string){const glyphs:Record<string,string>={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111'};for(const ch of text){const bits=glyphs[ch];if(bits){this.ctx.fillStyle=color;for(let i=0;i<15;i++)if(bits[i]==='1')this.ctx.fillRect(x+i%3,y+Math.floor(i/3),1,1);}x+=4;}}
 override draw(){const c=this.ctx,w=294,h=240;c.shadowBlur=0;c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,w,h);if(!this.power)return;
 const sx=(x:number)=>{let v=this.wrap(x-this.cameraX);if(v>this.world-200)v-=this.world;return Math.round(v*w/960)};const sy=(y:number)=>Math.round(y/3);
 const colors=['#45ff26','#ef39e8','#b555ff','#ff35e7','#ff3434','#48ff30'];
 const human=(x:number,y:number,fall=false)=>this.sprite(fall?['..Y..','W.W.W','.WWW.','..W..','.W.W.']:['.Y.','.W.','WWW','.W.','W.W'],x-(fall?2:1),y,1,{Y:'#ffff71',W:'#bfff59'});
 const ship=(x:number,y:number,dir:number,small=false)=>{const p=['....C...........','MMWWWWWWWWYY....','..MMMMGGGG......','....G...........'];c.save();c.translate(x,y);c.scale(dir*(small?.6:1),small?.6:1);this.sprite(p,-8,-2,1,{C:'#44ffff',M:'#ff35df',W:'#fff',Y:'#ffff45',G:'#48ff54'});c.restore();};
 c.save();c.beginPath();c.rect(0,36,w,204);c.clip();
 for(let i=0;i<45;i++){const x=sx(i*107+31);if(x<0||x>=w)continue;c.fillStyle=['#a72cac','#2c7dc0','#aaa22d','#448c45'][i%4];c.fillRect(x,43+(i*71)%145,1,1);}
 c.fillStyle='#bb791f';let prev=sy(this.groundY(this.cameraX));for(let x=0;x<w;x++){const y=sy(this.groundY(this.cameraX+x*960/w));c.fillRect(x,Math.min(y,prev),1,Math.abs(y-prev)+1);prev=y;}
 for(const [i,x] of this.demoHumans.entries()){if(this.mission?.humanIndex===i&&this.mission.phase!=='descend')continue;human(sx(x),sy(this.groundY(x))-5);}
 const patterns=[['..GGG..','.G.Y.G.','G..Y..G','..GGG..','.G.G.G.','G..G..G'],['..MM...','.MMMM..','M.WW.M.','..MM...','.M..M..','M....M.'],['PPPPP','P...P','P.W.P','P...P','PPPPP'],['...P...','.P.P.P.','..PPP..','PPPWPPP','..PPP..','.P.P.P.','...P...'],['.R.R.','RRRRR','..R..','.R.R.'],['..GGGGG..','.G.....G.','GGGGGGGGG']];
 for(const e of this.foes){if(!e.alive)continue;const x=sx(e.x);if(x<-10||x>w+10)continue;const pattern=patterns[e.kind];this.sprite(pattern,x-Math.floor(pattern[0].length/2),sy(e.y)-3,1,{G:colors[e.kind],M:colors[e.kind],P:colors[e.kind],R:colors[e.kind],W:'#fff',Y:'#ffff31'});}
 for(const m of this.mines)this.sprite(['.W.','WWW','.W.'],sx(m.x)-1,sy(m.y)-1,1,{W:'#ddd'});
 for(const b of this.charges){c.fillStyle='#fff';c.fillRect(sx(b.x),sy(b.y),1,1);}
 const r=this.mission;if(r&&['lift','intercept','fall'].includes(r.phase))human(sx(r.x),sy(r.y),r.phase==='fall');
 for(const l of this.lasers){const x=sx(l.x),y=sy(l.y);c.fillStyle=['#ff38de','#b864ff','#ff4949','#47dfff'][Math.floor(this.time*24)%4];c.fillRect(x-l.dir*33,y,l.dir*33,1);c.fillStyle='#fff';c.fillRect(x,y,2,1);}
 for(const s of this.sparks){c.fillStyle=s.life>.2?s.color:'#885599';c.fillRect(sx(s.x),sy(s.y),1,1);}
 const x=sx(this.x),y=sy(this.y);ship(x,y,this.dir);c.fillStyle=Math.floor(this.time*30)%2?'#ff3de1':'#49dfff';c.fillRect(x-this.dir*(9+Math.floor(this.time*40)%5),y,3,1);
 if(this.carrying){human(x,sy(this.y+15));if(this.mission&&this.mission.age<1)this.pixelText('500',x+9,y+8,'#fff');}c.restore();
 // Native-resolution scanner, reserve ships, score and smart-bomb stock.
 const hud='#8d43c7';c.fillStyle=hud;c.fillRect(0,35,w,1);c.fillRect(84,1,131,1);c.fillRect(84,33,131,1);c.fillRect(84,1,1,33);c.fillRect(214,1,1,33);
 const radar=(wx:number)=>85+this.wrap(wx-this.x+this.world/2)/this.world*128;
 c.fillStyle='#a97324';for(let i=0;i<128;i++)c.fillRect(85+i,Math.round(3+this.groundY(this.x-this.world/2+i/128*this.world)/720*29),1,1);
 for(const e of this.foes){if(e.alive){c.fillStyle=colors[e.kind];c.fillRect(Math.round(radar(e.x)),Math.round(3+e.y/720*29),1,1);}}
 for(const hx of this.demoHumans){c.fillStyle='#76ab36';c.fillRect(Math.round(radar(hx)),31,1,1);}
 c.fillStyle='#fff';c.fillRect(149,Math.round(3+this.y/720*29),2,1);c.fillRect(136,2,26,1);c.fillRect(136,32,26,1);for(const px of [136,161]){c.fillRect(px,2,1,3);c.fillRect(px,30,1,3);}
 ship(24,15,1,true);ship(37,15,1,true);this.pixelText(String(this.score).padStart(5,'0'),43,23,['#e842de','#4ba2ff','#ffe34b'][Math.floor(this.time/8)%3]);for(let i=0;i<3;i++)this.sprite(['GGG','.G.'],73,20+i*4,1,{G:'#5bff77'});
 }
}
