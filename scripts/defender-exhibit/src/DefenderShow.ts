import {defenderSprites} from './DefenderSprites';
import {defenderFont} from './DefenderFont';
import {ArcadeGame} from './game';
import {DefenderSound} from './DefenderSound';
import type {SoundEvent} from './DefenderSound';
import {decidePilot} from './DefenderPilot';
import type {PilotAction} from './DefenderPilot';
type Foe={id?:number;x:number;y:number;kind:number;phase:number;alive:boolean;cooldown?:number;captive?:number;target?:number;vx?:number;vy?:number;spawn?:number};
type Fall={x:number;y:number;vy:number;index:number;lander?:Foe};
type Laser={x:number;y:number;dir:number;life:number;age?:number};
type Spark={x:number;y:number;vx:number;vy:number;life:number;max:number;color:string};

/** Native Defender recreation. The read-only pilot controls only ship inputs; every human has one physical state. */
export class DefenderShow extends ArcadeGame {
 sound?:DefenderSound;
 world=4800;cameraX=0;cameraOffset=310;demoPaused=false;seed=81;
 foes:Foe[]=[];looseHumans:Fall[]=[];carriedHumans:number[]=[];
 demoHumans=Array.from({length:10},(_,i)=>180+i*460);deadHumans=new Set<number>();
 mines:{x:number;y:number;life:number}[]=[];charges:{x:number;y:number;vx:number;vy:number;life:number}[]=[];
 lasers:Laser[]=[];sparks:Spark[]=[];rings:{x:number;y:number;life:number;color:string}[]=[];
 popups:{x:number;y:number;text:string;life:number}[]=[];
 velocityX=0;thrusting=false;shotClock=0;escapeClock=0;bombClock=0;flash=0;
 waveClock=0;spawnClock=0;landerReserve=0;squadClock=0;baiterClock=18;nextId=1;
 bombs=3;nextExtra=10000;planet=true;kills=0;deaths=0;bombsUsed=0;maxCarried=0;
 stage:'battle'|'wave'|'death'|'over'='battle';stageTimer=0;waveBonus=0;
 pilotAction:PilotAction='patrol';pilotTarget?:Foe;
 rescueEvents={pickedUp:0,dropped:0,caught:0,delivered:0};

 constructor(){super();this.canvas.width=294;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Defender space rescue');this.running=true;this.populateDemo();this.draw();}
 override unlock(){super.unlock();this.sound??=new DefenderSound(this.audio!);this.sound.state(this.power&&!this.demoPaused,false,this.volume,this.thrusting);}
 effect(event:SoundEvent){this.lastAudio=performance.now();this.sound?.effect(event);}
 override tone(_frequency=180,_duration=.07,_type:OscillatorType='square'){this.effect('credit');}
 rand(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 wrap(x:number){return(x%this.world+this.world)%this.world;}
 delta(x:number){return((x-this.x+this.world*1.5)%this.world)-this.world*.5;}
 visible(x:number){const offset=this.wrap(x-this.cameraX);return offset<960||offset>this.world-30;}
 groundY(x:number){const heights=[672,672,660,624,642,591,615,663,663,648,675,675,630,606,633,651,651,672,642,618,645,675,675,657,627,657,672,672,639,612,642,672];const z=this.wrap(x)/150,i=Math.floor(z);return heights[i]+(heights[(i+1)%heights.length]-heights[i])*(z-i);}
 fly(desired:number,dt:number){const change=Math.max(-900*dt,Math.min(900*dt,desired-this.velocityX));this.thrusting=Math.abs(change)>.01||Math.abs(desired)>100;this.velocityX+=change;this.x=this.wrap(this.x+this.velocityX*dt);}
 moveX(target:number,speed:number,dt:number){this.fly(Math.max(-speed,Math.min(speed,this.delta(target)*4)),dt);}
 moveY(target:number,speed:number,dt:number){this.y+=Math.max(-speed*dt,Math.min(speed*dt,target-this.y));}

 // WVTAB: first four waves, followed by bounded inter-wave deltas. Timing below is in native seconds.
 enemySpeedScale(kind:number){const w=Math.min(3,this.wave-1),extra=Math.max(0,this.wave-4);if(kind===0)return Math.min(96,[22,30,38,46][w]+extra*2)/22;if(kind===1)return Math.min(96,[12,28,36,40][w]+extra*4)/12;if(kind===4)return Math.min(96,[22,30,32,34][w]+extra*2)/22;return 1;}
 spawnFoe(kind:number,x:number,y:number,phase=0):Foe{const e:Foe={id:this.nextId++,x:this.wrap(x),y,kind,phase,alive:true,spawn:.55,cooldown:1+this.rand()*2};this.foes.push(e);return e;}
 populateDemo(){
  this.foes=[];this.pilotTarget=undefined;this.waveClock=0;this.squadClock=0;this.baiterClock=18;
  const w=Math.min(3,this.wave-1);this.landerReserve=[15,20,20,20][w];this.spawnSquad();
  for(let i=0;i<[0,3,4,5][w];i++)this.spawnFoe(2,this.x+1000+i*190,180+i%2*80,i%2?0:Math.PI);
  for(let i=0;i<[0,1,3,4][w];i++)this.spawnFoe(3,this.x+1500+i*530,220+i%3*85,i*1.7);
 }
 spawnSquad(){const count=Math.min(5,this.landerReserve);for(let i=0;i<count;i++)this.spawnFoe(this.planet?0:1,this.x+500+i*500,180+(i*63)%220,i*1.7);this.landerReserve-=count;this.squadClock=[30,25,20,16][Math.min(3,this.wave-1)];}
 updateSpawns(dt:number){
  this.squadClock-=dt;const active=this.foes.filter(e=>e.alive&&e.kind===0).length;
  if(this.landerReserve>0&&(active===0||this.squadClock<=0)&&active<8)this.spawnSquad();
  this.baiterClock-=dt;
  if(this.baiterClock<=0&&this.foes.filter(e=>e.kind===5).length<12){this.spawnFoe(5,this.x-this.dir*740,180+this.rand()*300,this.rand()*6);this.baiterClock=Math.max(2.4,14.8-Math.max(0,this.wave-4)*.4-this.waveClock*.045);}
 }

 humanPosition(index:number){
  if(this.deadHumans.has(index))return undefined;
  const carried=this.carriedHumans.indexOf(index);if(carried>=0)return{x:this.wrap(this.x+(carried%3-1)*9),y:this.y+20+Math.floor(carried/3)*10};
  const lander=this.foes.find(e=>e.alive&&e.captive===index);if(lander)return{x:lander.x,y:lander.y+24};
  return this.looseHumans.find(h=>h.index===index)??{x:this.demoHumans[index],y:this.groundY(this.demoHumans[index])-15};
 }
 isGrounded(index:number){return !this.deadHumans.has(index)&&!this.carriedHumans.includes(index)&&!this.looseHumans.some(h=>h.index===index)&&!this.foes.some(e=>e.alive&&e.captive===index);}
 updateHumans(dt:number){
  const remaining:Fall[]=[];
  for(const h of this.looseHumans){
   h.vy=Math.min(170,h.vy+115*dt);h.y+=h.vy*dt;
   // Ground resolution comes first: a ship cannot scoop up a grounded human.
   if(h.y>=this.groundY(h.x)-15){if(h.vy>100)this.deadHumans.add(h.index);else {this.demoHumans[h.index]=h.x;this.score+=250;this.popup(h.x,h.y,'250');this.effect('delivery');}continue;}
   if(Math.abs(this.delta(h.x))<24&&h.y-this.y>3&&h.y-this.y<34){this.carriedHumans.push(h.index);this.rescueEvents.caught++;this.score+=500;this.popup(this.x,this.y,'500');this.effect('catch');}
   else remaining.push(h);
  }
  this.looseHumans=remaining;this.carrying=this.carriedHumans.length>0;this.maxCarried=Math.max(this.maxCarried,this.carriedHumans.length);
  if(this.carrying&&this.y>=this.groundY(this.x)-32){
   const count=this.carriedHumans.length;
   for(const [i,index]of this.carriedHumans.entries())this.demoHumans[index]=this.wrap(this.x+(i-(count-1)/2)*12);
   this.rescueEvents.delivered+=count;this.rescued+=count;this.score+=500*count;this.popup(this.x,this.y,String(500*count));this.carriedHumans=[];this.carrying=false;this.effect('delivery');
  }
  this.checkPlanet();
 }
 checkPlanet(){if(this.deadHumans.size===10&&this.planet){this.planet=false;this.effect('planet');this.flash=1;for(const e of this.foes)if(e.kind===0)e.kind=1;}}
 popup(x:number,y:number,text:string){this.popups.push({x,y,text,life:1.1});this.popups=this.popups.slice(-12);}

 updateEnemies(dt:number){
  for(const e of this.foes){
   if(!e.alive)continue;if((e.spawn??0)>0){e.spawn=Math.max(0,e.spawn!-dt);continue;}
   const oldY=e.y;const dx=-this.delta(e.x),dy=this.y-e.y;
   e.cooldown=(e.cooldown??2)-dt;
   if(e.kind===0){
    if(e.captive!==undefined){e.y-=60*dt;if(e.y<=120){this.deadHumans.add(e.captive);e.captive=undefined;e.kind=1;this.checkPlanet();}}
    else {
     const available=this.demoHumans.map((x,i)=>({x,i,d:this.wrap(x-e.x+this.world/2)-this.world/2})).filter(h=>this.isGrounded(h.i)&&!this.foes.some(f=>f!==e&&f.alive&&f.target===h.i)).sort((a,b)=>Math.abs(a.d)-Math.abs(b.d));
     const h=available.find(h=>h.i===e.target)??available[0];
     if(h){e.target=h.i;const speed=80*this.enemySpeedScale(0);e.x=this.wrap(e.x+Math.max(-speed*dt,Math.min(speed*dt,h.d)));if(Math.abs(h.d)<70)e.y=Math.min(this.groundY(e.x)-39,e.y+85*dt);if(Math.abs(h.d)<12&&e.y>=this.groundY(e.x)-40){e.captive=h.i;e.target=undefined;this.rescueEvents.pickedUp++;if(this.visible(e.x))this.effect('abduct');}}
     else {e.target=undefined;e.x=this.wrap(e.x+Math.sin(e.phase)*65*dt);}
    }
   }else if(e.kind===1||e.kind===4||e.kind===5){
    const speed=(e.kind===5?310:e.kind===4?190:155)*Math.min(2,this.enemySpeedScale(e.kind));
    const targetVx=Math.sign(dx)*speed,turn=e.kind===4?3.8:e.kind===5?1.8:2.8;
    e.vx=(e.vx??targetVx)+(targetVx-(e.vx??targetVx))*Math.min(1,turn*dt);
    e.x=this.wrap(e.x+e.vx*dt);e.y+=(Math.max(-145,Math.min(145,dy*1.5))+Math.sin(this.time*5+e.phase)*(e.kind===4?50:15))*dt;
   }else {e.x=this.wrap(e.x+Math.cos(e.phase)*(e.kind===2?95:50)*dt);e.y+=Math.sin(this.time*.9+e.phase)*(e.kind===2?18:35)*dt;}
   e.y=Math.max(120,Math.min(this.planet?this.groundY(e.x)-25:675,e.y));e.vy=(e.y-oldY)/Math.max(dt,.001);
   if(e.cooldown<=0){
    const pressure=Math.max(.55,1-Math.max(0,this.wave-4)*.035-this.waveClock*.001);
    e.cooldown=(1.6+this.rand()*2.5)*pressure;
    if(e.kind===2)this.mines.push({x:e.x,y:e.y,life:10});
    else if(e.kind!==3&&Math.abs(dx)<1100){const d=Math.hypot(dx,dy)||1;this.charges.push({x:e.x,y:e.y,vx:dx/d*155,vy:dy/d*155,life:4});}
   }
  }
 }

 killFoe(e:Foe,quiet=false){
  if(!e.alive||(e.spawn??0)>0)return;e.alive=false;
  if(e.captive!==undefined){this.looseHumans.push({x:e.x,y:e.y+24,vy:25,index:e.captive,lander:e});e.captive=undefined;this.rescueEvents.dropped++;if(this.visible(e.x))this.effect('fall');}
  this.score+=[150,150,250,1000,150,200][e.kind];this.kills++;
  this.burst(e.x,e.y,['#28b600','#ff33dd','#cc55ff','#ff33dd','#ff3434','#28b600'][e.kind],e.kind===3?'pod':e.kind===2?'bomber':e.kind===1?'mutant':e.kind===4||e.kind===5?'swarmer':'explosion',quiet||!this.visible(e.x));
  if(e.kind===3)for(let j=0;j<4;j++){const child=this.spawnFoe(4,e.x+(j-2)*18,e.y+(j-2)*12,j*1.6);child.spawn=0;child.vx=Math.cos(j*1.6)*220;}
 }
 burst(x:number,y:number,color:string,event:SoundEvent='explosion',quiet=false){
  // Flat radial pixel debris, with persistent colored spokes rather than gravity-driven confetti.
  for(let i=0;i<40;i++){const a=i/40*Math.PI*2,v=75+this.rand()*180,life=.3+this.rand()*.55;this.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life,max:life,color});}
  this.sparks=this.sparks.slice(-640);if(!quiet)this.effect(event);
 }
 shotDistance(from:number,to:number,dir:number){return this.wrap((to-from)*dir);}
 hitDistance(from:number,y:number,dir:number,travel:number,x:number,targetY:number,halfWidth:number,halfHeight:number){if(Math.abs(y-targetY)>halfHeight)return Infinity;const ahead=this.shotDistance(from,x,dir);if(ahead>this.world-halfWidth)return 0;return ahead<=travel+halfWidth?Math.max(0,ahead-halfWidth):Infinity;}
 fireLaser(l:Laser,dt:number){
  const from=l.x,travel=1400*dt;let nearest=Infinity,target:Foe|undefined;
  for(const e of this.foes){if(!e.alive||(e.spawn??0)>0)continue;const widths=[16,16,13,13,10,20],heights=[12,12,12,12,6,6];const distance=this.hitDistance(from,l.y,l.dir,travel,e.x,e.y,widths[e.kind],heights[e.kind]);if(distance<nearest){nearest=distance;target=e;}}
  l.age=(l.age??0)+dt;
  if(target){l.x=this.wrap(from+l.dir*nearest);l.life=0;this.killFoe(target);}else {l.x=this.wrap(from+l.dir*travel);l.life-=dt;}
 }
 smartBomb(){
  if(this.bombs<=0||this.stage!=='battle'||this.bombClock>0)return;this.bombs--;this.bombsUsed++;this.bombClock=.3;this.effect('bomb');
  for(let pass=0;pass<2;pass++)for(const e of [...this.foes])if(this.visible(e.x))this.killFoe(e,true);
  this.mines=this.mines.filter(e=>!this.visible(e.x));this.charges=this.charges.filter(e=>!this.visible(e.x));
 }
 hyperspace(){if(this.escapeClock>0||this.carriedHumans.length)return;this.escapeClock=8;this.x=this.wrap(this.x+this.dir*(500+this.rand()*1000));this.y=210+this.rand()*230;this.velocityX=0;this.effect('hyperspace');if(this.rand()>192/256)this.loseShip();else this.invincible=.8;}
 loseShip(){
  if(this.stage!=='battle'||this.invincible>0)return;this.lives--;this.deaths++;this.burst(this.x,this.y,'#fff','death');
  // Passengers become ordinary falling humans; distant landers and humans are not rewritten by a ship loss.
  for(const index of this.carriedHumans)this.looseHumans.push({x:this.x,y:this.y+20,vy:25,index});
  this.carriedHumans=[];this.carrying=false;this.stage=this.lives>0?'death':'over';this.stageTimer=this.lives>0?1.8:4;this.keys.clear();this.lasers=[];this.pilotTarget=undefined;
 }
 awardExtra(){while(this.score>=this.nextExtra){this.nextExtra+=10000;this.lives++;this.bombs++;this.effect('extra');}}
 completeWave(){this.waveBonus=(10-this.deadHumans.size)*100*Math.min(this.wave,5);this.score+=this.waveBonus;this.awardExtra();this.stage='wave';this.stageTimer=3;this.keys.clear();this.lasers=[];this.charges=[];this.mines=[];this.foes=[];}
 advanceStage(dt:number){
  this.stageTimer-=dt;if(this.stageTimer>0)return;
  if(this.stage==='wave'){this.wave++;if(this.wave%5===0){this.deadHumans.clear();this.planet=true;}this.populateDemo();}
  else if(this.stage==='over'){this.score=0;this.wave=1;this.lives=3;this.bombs=3;this.nextExtra=10000;this.deadHumans.clear();this.looseHumans=[];this.planet=true;this.populateDemo();}
  this.velocityX=0;this.thrusting=false;this.x=this.wrap(this.x+480);this.y=300;this.invincible=2;this.mines=[];this.charges=[];this.stage='battle';this.effect('start');
 }
 updateEffects(dt:number){for(const s of this.sparks){s.x=this.wrap(s.x+s.vx*dt);s.y+=s.vy*dt;s.life-=dt;}this.sparks=this.sparks.filter(s=>s.life>0);for(const p of this.popups){p.life-=dt;p.y-=18*dt;}this.popups=this.popups.filter(p=>p.life>0);}

 override update(step:number){
  this.sound?.state(this.power&&!this.demoPaused,!this.audio||this.muted,this.volume,this.thrusting);
  if(!this.power){this.draw();return;}if(this.demoPaused)return;const dt=Math.max(0,Math.min(step,.04));if(!dt)return;
  this.time+=dt;this.invincible=Math.max(0,this.invincible-dt);this.bombClock=Math.max(0,this.bombClock-dt);this.escapeClock=Math.max(0,this.escapeClock-dt);this.flash=Math.max(0,this.flash-dt*1.5);this.updateEffects(dt);
  if(this.stage!=='battle'){this.thrusting=false;this.advanceStage(dt);this.draw();return;}
  this.waveClock+=dt;this.updateSpawns(dt);this.updateEnemies(dt);
  const hazards=[...this.foes.filter(e=>e.alive&&(e.spawn??0)<=0),...this.mines,...this.charges];
  const decision=decidePilot({x:this.x,y:this.y,dir:this.dir,velocityX:this.velocityX,world:this.world,carried:this.carriedHumans.length,previous:this.pilotTarget,foes:this.foes,falls:this.looseHumans,hazards,ground:x=>this.groundY(x)});
  this.pilotAction=decision.action;this.pilotTarget=decision.target as Foe|undefined;
  const oldY=this.y,oldDir=this.dir;this.dir=decision.dir;this.moveX(decision.x,decision.speed,dt);this.moveY(decision.y,390,dt);this.y=Math.max(132,Math.min(680,this.y));
  this.updateHumans(dt);this.shotClock-=dt;
  if(decision.fire&&this.shotClock<=0){this.lasers.push({x:this.wrap(this.x+this.dir*26),y:this.y,dir:this.dir,life:.8,age:0});this.shotClock=.13;this.effect('fire');}
  for(const m of this.mines)m.life-=dt;this.mines=this.mines.filter(m=>m.life>0).slice(-45);
  for(const b of this.charges){b.x=this.wrap(b.x+b.vx*dt);b.y+=b.vy*dt;b.life-=dt;}this.charges=this.charges.filter(b=>b.life>0).slice(-40);
  for(const l of this.lasers)if(l.life>0)this.fireLaser(l,dt);this.lasers=this.lasers.filter(l=>l.life>0);this.foes=this.foes.filter(e=>e.alive);
  const danger=[...this.foes.filter(e=>e.alive&&(e.spawn??0)<=0),...this.mines,...this.charges].filter(e=>Math.abs(this.delta(e.x))<85&&Math.abs(e.y-this.y)<65);
  const immediate=danger.filter(e=>Math.abs(this.delta(e.x))<50&&Math.abs(e.y-this.y)<40);
  if(this.invincible===0&&this.bombs>0&&(immediate.length||danger.length>=3))this.smartBomb();
  else if(this.invincible===0&&this.bombs===0&&immediate.length&&this.pilotAction!=='fall')this.hyperspace();
  if([...this.foes.filter(e=>(e.spawn??0)<=0&&e.alive),...this.mines,...this.charges].some(e=>Math.abs(this.delta(e.x))<20&&Math.abs(e.y-this.y)<17))this.loseShip();
  this.awardExtra();
  if(this.stage==='battle'&&this.landerReserve===0&&!this.foes.some(e=>e.kind!==5)&&!this.looseHumans.length&&!this.carriedHumans.length)this.completeWave();
  this.cameraOffset+=((this.dir===1?310:650)-this.cameraOffset)*Math.min(1,dt*3);this.cameraX=this.x-this.cameraOffset;
  this.keys.clear();if(this.stage==='battle'){if(this.bombClock>0)this.keys.add('KeyB');if(this.thrusting)this.keys.add('KeyT');if(this.dir!==oldDir)this.keys.add('KeyR');if(this.escapeClock>7.8)this.keys.add('KeyH');if(Math.abs(this.y-oldY)>.1)this.keys.add(this.y<oldY?'ArrowUp':'ArrowDown');if(this.shotClock>.08)this.keys.add('Space');}
  this.draw();
 }

 sprite(pattern:string[],x:number,y:number,scale:number,colors:Record<string,string>){const c=this.ctx;for(let row=0;row<pattern.length;row++)for(let col=0;col<pattern[row].length;col++){const color=colors[pattern[row][col]];if(color){c.fillStyle=color;c.fillRect(Math.round(x+col*scale),Math.round(y+row*scale),scale,scale)}}}
 textWidth(text:string){return [...text].reduce((n,ch)=>n+(defenderFont[ch]?.[0].length??3)+1,0);}
 pixelText(text:string,x:number,y:number,color:string){for(const ch of text){const glyph=defenderFont[ch];if(glyph)this.sprite(glyph,x,y,1,{'1':color});x+=(glyph?.[0].length??3)+1;}}
 centeredText(text:string,y:number,color:string){this.pixelText(text,Math.round((294-this.textWidth(text))/2),y,color);}
 bitmap(name:string,x:number,y:number){
  const pattern=defenderSprites[name];if(!pattern)return;
  const cycle=[0x38,0x3f,0x07,0xc7,0xc0,0xf8,0xff];const t=Math.floor(this.time*12);
  const bytes=[0,cycle[t%7],7,0x28,0x2f,0x81,0xa4,0x15,0xc7,255,cycle[t%7],255,cycle[t%7],cycle[t%7],cycle[(t+2)%7],cycle[(t+4)%7]];
  const colors:Record<string,string>={};for(let i=1;i<16;i++){const b=bytes[i];colors[i.toString(16)]=`rgb(${Math.round((b&7)*255/7)},${Math.round(((b>>3)&7)*255/7)},${Math.round((b>>6)*255/3)})`;}
  this.sprite(pattern,Math.round(x-pattern[0].length/2),Math.round(y),1,colors);
 }
 override draw(){const c=this.ctx,w=294,h=240;c.shadowBlur=0;c.globalAlpha=1;c.fillStyle='#000';c.fillRect(0,0,w,h);if(!this.power)return;
 const sx=(x:number)=>{let v=this.wrap(x-this.cameraX);if(v>this.world-200)v-=this.world;return Math.round(v*w/960)};const sy=(y:number)=>Math.round(y/3);
 const colors=['#45ff26','#ef39e8','#b555ff','#ff35e7','#ff3434','#48ff30'];
 const human=(x:number,y:number,fall=false)=>this.bitmap(fall?'ASTD20':Math.floor(this.time*4)%2?'ASTD10':'ASTD30',x,y);
 const ship=(x:number,y:number,dir:number,small=false)=>this.bitmap(small?'PLAM0':dir>0?'PLD10':'PLD20',x,y-3);
 c.save();c.beginPath();c.rect(0,36,w,204);c.clip();
 for(let i=0;i<45;i++){const x=sx(i*107+31);if(x<0||x>=w)continue;c.fillStyle=['#a72cac','#2c7dc0','#aaa22d','#448c45'][i%4];c.fillRect(x,43+(i*71)%145,1,1);}
 c.fillStyle='#bb791f';let prev=sy(this.groundY(this.cameraX));if(this.planet)for(let x=0;x<w;x++){const y=sy(this.groundY(this.cameraX+x*960/w));c.fillRect(x,Math.min(y,prev),1,Math.abs(y-prev)+1);prev=y;}
 for(const [i,x] of this.demoHumans.entries())if(this.isGrounded(i))human(sx(x),sy(this.groundY(x))-8);
 const frame=Math.floor(this.time*8);const frames=[['LND10','LND20','LND30'],['SCZD10'],['TIED10','TIED20','TIED30','TIED40'],['PRBD10'],['SWMD10'],['UFOD10','UFOD20','UFOD30']];
 for(const e of this.foes){if(!e.alive)continue;const x=sx(e.x);if(x<-10||x>w+10)continue;if((e.spawn??0)>0){c.fillStyle='#ddd';for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=e.spawn!*45;c.fillRect(x+Math.cos(a)*r,sy(e.y)+Math.sin(a)*r,1,1);}continue;}const list=frames[e.kind];this.bitmap(list[frame%list.length],x,sy(e.y)-4);}
 for(const m of this.mines)this.bitmap(frame%2?'BMBD10':'BMBD20',sx(m.x),sy(m.y)-1);
 for(const b of this.charges){c.fillStyle='#fff';c.fillRect(sx(b.x),sy(b.y),1,1);}
 for(const e of this.foes)if(e.captive!==undefined)human(sx(e.x),sy(e.y+24));for(const h of this.looseHumans)human(sx(h.x),sy(h.y),true);
 for(const l of this.lasers){const x=sx(l.x),y=sy(l.y),length=Math.min(65,Math.max(2,(l.age??.1)*420));const shades=['#783caf','#d64cde','#48a5ed','#87ffff','#fff'];for(let i=0;i<length;i++){c.fillStyle=shades[Math.min(4,Math.floor(i/length*5))];c.fillRect(x-l.dir*(length-i),y,1,1);}c.fillStyle='#fff';c.fillRect(x,y,2,1);}
 for(const s of this.sparks){c.fillStyle=s.life>.2?s.color:'#885599';c.fillRect(sx(s.x),sy(s.y),1,1);if(s.life>.25)c.fillRect(sx(s.x-s.vx*.018),sy(s.y-s.vy*.018),1,1);}
 const x=sx(this.x),y=sy(this.y);if(this.stage==='battle'&&(this.invincible===0||Math.floor(this.time*12)%2))ship(x,y,this.dir);c.fillStyle=Math.floor(this.time*30)%2?'#ff3de1':'#49dfff';if(this.stage==='battle')c.fillRect(x-this.dir*(9+Math.floor(this.time*40)%5),y,3,1);
 for(const index of this.carriedHumans){const p=this.humanPosition(index)!;human(sx(p.x),sy(p.y));}
 for(const p of this.popups)this.pixelText(p.text,sx(p.x)+8,sy(p.y)-5,'#fff');c.restore();
 // Native-resolution scanner, reserve ships, score and smart-bomb stock.
 const hud='#8d43c7';c.fillStyle=hud;c.fillRect(0,35,w,1);c.fillRect(84,1,131,1);c.fillRect(84,33,131,1);c.fillRect(84,1,1,33);c.fillRect(214,1,1,33);
 const radar=(wx:number)=>85+this.wrap(wx-this.x+this.world/2)/this.world*128;
 c.fillStyle='#a97324';if(this.planet)for(let i=0;i<128;i++)c.fillRect(85+i,Math.round(3+this.groundY(this.x-this.world/2+i/128*this.world)/720*29),1,1);
 for(const e of this.foes){if(e.alive){c.fillStyle=colors[e.kind];c.fillRect(Math.round(radar(e.x)),Math.round(3+e.y/720*29),1,1);}}
 for(let i=0;i<this.demoHumans.length;i++){const human=this.humanPosition(i);if(!human)continue;c.fillStyle='#76ab36';c.fillRect(Math.round(radar(human.x)),Math.round(3+human.y/720*29),1,1);}
 c.fillStyle='#fff';c.fillRect(149,Math.round(3+this.y/720*29),2,1);const viewLeft=Math.round(149-this.cameraOffset/this.world*128);c.fillRect(viewLeft,2,26,1);c.fillRect(viewLeft,32,26,1);for(const px of [viewLeft,viewLeft+25]){c.fillRect(px,2,1,3);c.fillRect(px,30,1,3);}
 for(let i=0;i<Math.min(5,this.lives-1);i++)ship(20+i*12,15,1,true);this.pixelText(String(this.score).padStart(5,'0'),29,23,['#e842de','#4ba2ff','#ffe34b'][Math.floor(this.time/8)%3]);for(let i=0;i<Math.min(5,this.bombs);i++)this.bitmap('SBD10',76,10+i*4);
 if(this.stage==='wave'){this.centeredText('ATTACK WAVE '+this.wave+' COMPLETED',105,'#fff');this.centeredText('HUMANOID BONUS '+this.waveBonus,124,'#ffff55');}
 if(this.stage==='over')this.centeredText('GAME OVER',112,'#fff');
 if(this.flash>0){c.fillStyle='#a97324';for(let i=0;i<80;i++)c.fillRect((i*37+this.time*55)%w,235-this.flash*(i%17)*9,1,1);}
 if(this.bombClock>0&&Math.floor(this.bombClock*25)%2){c.fillStyle='#ffffff';c.globalAlpha=.28;c.fillRect(0,36,w,204);c.globalAlpha=1;}

 }
}
