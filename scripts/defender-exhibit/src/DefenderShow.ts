import {defenderSprites} from './DefenderSprites';
import {ArcadeGame} from './game';
import {DefenderSound} from './DefenderSound';
import type {SoundEvent} from './DefenderSound';
type Foe={x:number;y:number;kind:number;phase:number;alive:boolean;cooldown?:number;captive?:number;target?:number};
type RescuePhase='descend'|'lift'|'intercept'|'fall'|'return';
type Rescue={lander:Foe;humanIndex:number;x:number;y:number;vy:number;phase:RescuePhase;age:number;dir:number};
type Spark={x:number;y:number;vx:number;vy:number;life:number;max:number;color:string};
/** Autonomous, original rendering of a Defender-inspired attract sequence. Original bitmap data; autonomous pilot, not CPU emulation. */
export class DefenderShow extends ArcadeGame {
 sound?:DefenderSound;
 override unlock(){super.unlock();this.sound??=new DefenderSound(this.audio!);this.sound.state(this.power&&!this.demoPaused,false,this.volume,this.keys.has('KeyT'));}
 effect(event:SoundEvent){this.lastAudio=performance.now();this.sound?.effect(event);}
 override tone(_frequency=180,_duration=.07,_type:OscillatorType='square'){this.effect('credit');}

 mines:{x:number;y:number;life:number}[]=[];charges:{x:number;y:number;vx:number;vy:number;life:number}[]=[]; cameraOffset=310;waveClock=0;escapeClock=0;
 world=4800; cameraX=0; shotClock=0; spawnClock=0; rescueClock=0; demoPaused=false; flash=0;
 foes:Foe[]=[]; sparks:Spark[]=[]; lasers:{x:number;y:number;dir:number;life:number}[]=[];
 rings:{x:number;y:number;life:number;color:string}[]=[];
 mission?:Rescue;nextRescue=4;rescueEvents={pickedUp:0,dropped:0,caught:0,delivered:0};
 demoHumans=Array.from({length:10},(_,i)=>180+i*460); seed=81; kills=0;
 looseHumans:{x:number;y:number;vy:number;index:number;lander:Foe}[]=[];
 velocityX=0;thrusting=false;
 bombs=3;nextExtra=10000;stage:'battle'|'wave'|'death'|'over'='battle';stageTimer=0;waveBonus=0;deadHumans=new Set<number>();planet=true;bombClock=0;deaths=0;bombsUsed=0;
 visible(wx:number){const x=this.wrap(wx-this.cameraX);return x<960||x>this.world-30;}
 killFoe(e:Foe,quiet=false){
  if(!e.alive)return;e.alive=false;
  if(e===this.mission?.lander){if(this.mission.phase==='descend'){this.mission=undefined;this.nextRescue=this.time+3;}else {this.rescueEvents.dropped++;this.mission.vy=25;this.rescuePhase('fall');}}
  if(e.captive!==undefined){this.looseHumans.push({x:e.x,y:e.y+24,vy:25,index:e.captive,lander:e});e.captive=undefined;this.rescueEvents.dropped++;this.effect('fall');}
  this.score+=[150,150,250,1000,150,200][e.kind];this.kills++;
  this.burst(e.x,e.y,['#28b600','#ff33dd','#cc55ff','#ff33dd','#ff3434','#28b600'][e.kind],quiet?undefined:e.kind===3?'pod':e.kind===2?'bomber':e.kind===1?'mutant':e.kind===4||e.kind===5?'swarmer':'explosion',quiet);
  if(e.kind===3)for(let j=0;j<4;j++)this.foes.push({x:this.wrap(e.x+(j-2)*24),y:e.y+(j-2)*18,kind:4,phase:j*1.6,alive:true});
 }
 smartBomb(){
  if(this.bombs===0||this.stage!=='battle')return;
  this.bombs--;this.bombsUsed++;this.bombClock=.3;this.effect('bomb');
  // Pod children created by a bomb are caught by the same screen-wide blast.
  for(let pass=0;pass<2;pass++)for(const e of [...this.foes])if(this.visible(e.x))this.killFoe(e,true);
  this.mines=this.mines.filter(e=>!this.visible(e.x));this.charges=this.charges.filter(e=>!this.visible(e.x));
 }
 loseShip(){
  if(this.stage!=='battle'||this.invincible>0)return;
  this.lives--;this.deaths++;this.burst(this.x,this.y,'#fff','death');this.stage=this.lives>0?'death':'over';this.stageTimer=this.lives>0?1.8:4;this.keys.clear();
  if(this.mission){if(this.mission.phase!=='descend')this.deadHumans.add(this.mission.humanIndex);this.mission=undefined;}this.carrying=false;this.lasers=[];this.checkPlanet();
 }
 awardExtra(){while(this.score>=this.nextExtra){this.nextExtra+=10000;this.lives++;this.bombs++;this.effect('extra');}}
 completeWave(){this.waveBonus=(10-this.deadHumans.size)*100*Math.min(this.wave,5);this.score+=this.waveBonus;this.awardExtra();this.stage='wave';this.stageTimer=3;this.keys.clear();this.lasers=[];this.charges=[];this.mines=[];}
 advanceStage(dt:number){
  for(const s of this.sparks){s.x=this.wrap(s.x+s.vx*dt);s.y+=s.vy*dt;s.life-=dt;}this.sparks=this.sparks.filter(s=>s.life>0);this.stageTimer-=dt;if(this.stageTimer>0)return;
  if(this.stage==='wave'){this.wave++;if(this.wave%5===0){this.deadHumans.clear();this.planet=true;}this.populateDemo();}
  else if(this.stage==='over'){this.score=0;this.wave=1;this.lives=3;this.bombs=3;this.nextExtra=10000;this.deadHumans.clear();this.planet=true;this.populateDemo();}
  this.looseHumans=[];this.velocityX=0;this.thrusting=false;this.x=this.wrap(this.x+480);this.y=300;this.invincible=2;this.mines=[];this.charges=[];this.waveClock=0;this.nextRescue=this.time+3;this.stage='battle';this.effect('start');
 }
 checkPlanet(){if(this.deadHumans.size===10&&this.planet){this.planet=false;this.effect('planet');this.flash=1;for(const e of this.foes)if(e.kind===0)e.kind=1;}}

 constructor(){super();this.canvas.width=294;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Defender-inspired space battle');this.running=true;this.populateDemo();this.draw();}
 rand(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 populateDemo(){const w=Math.min(this.wave,4)-1;const kinds=[...Array([15,20,20,20][w]).fill(this.planet?0:1),...Array([0,3,4,5][w]).fill(2),...Array([0,1,3,4][w]).fill(3)];this.foes=kinds.map((kind,i)=>({x:this.wrap(this.x+240+i*this.world/kinds.length),y:150+(i*83)%330,kind,phase:i*1.37,alive:true}));}
 wrap(x:number){return (x%this.world+this.world)%this.world;}
 delta(x:number){return ((x-this.x+this.world*1.5)%this.world)-this.world*.5;}
 burst(x:number,y:number,color:string,event:SoundEvent='explosion',quiet=false){for(let i=0;i<32;i++){const a=this.rand()*Math.PI*2,v=50+this.rand()*200,life=.3+this.rand()*.7;this.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life,max:life,color})}this.sparks=this.sparks.slice(-600);this.rings.push({x,y,life:.6,color});if(!quiet)this.effect(event);}
 groundY(x:number){const heights=[672,672,660,624,642,591,615,663,663,648,675,675,630,606,633,651,651,672,642,618,645,675,675,657,627,657,672,672,639,612,642,672];const z=this.wrap(x)/150,i=Math.floor(z);return heights[i]+(heights[(i+1)%heights.length]-heights[i])*(z-i);}
 // Facing reverses immediately, but thrust must first brake the existing velocity.
 fly(desired:number,dt:number){const change=Math.max(-720*dt,Math.min(720*dt,desired-this.velocityX));this.thrusting=Math.abs(change)>.01||Math.abs(desired)>100;this.velocityX+=change;this.x=this.wrap(this.x+this.velocityX*dt);}
 moveX(target:number,speed:number,dt:number){this.fly(Math.max(-speed,Math.min(speed,this.delta(target)*4)),dt);}
 // Sweep across the full travelled distance, including the world seam, so frame rate cannot skip a target.
 shotDistance(from:number,to:number,dir:number){return this.wrap((to-from)*dir);}
 hitDistance(from:number,y:number,dir:number,travel:number,x:number,targetY:number,halfWidth:number,halfHeight:number){if(Math.abs(y-targetY)>halfHeight)return Infinity;const ahead=this.shotDistance(from,x,dir);if(ahead>this.world-halfWidth)return 0;return ahead<=travel+halfWidth?Math.max(0,ahead-halfWidth):Infinity;}
 fireLaser(l:{x:number;y:number;dir:number;life:number},dt:number){
  const from=l.x,travel=1400*dt;let nearest=Infinity;let target:Foe|undefined;
  for(const e of this.foes){if(!e.alive)continue;const widths=[16,16,13,13,10,20],heights=[12,12,12,12,6,6];const distance=this.hitDistance(from,l.y,l.dir,travel,e.x,e.y,widths[e.kind],heights[e.kind]);if(distance<nearest){nearest=distance;target=e;}}
  if(target){l.x=this.wrap(from+l.dir*nearest);l.life=0;this.killFoe(target);}else {l.x=this.wrap(from+l.dir*travel);l.life-=dt;}
 }
 humanPosition(index:number){
  if(this.deadHumans.has(index))return undefined;
  const r=this.mission;if(r?.humanIndex===index&&r.phase!=='descend')return r.phase==='return'?{x:this.x,y:this.y+15}:{x:r.x,y:r.y};
  const lander=this.foes.find(e=>e.alive&&e.captive===index);if(lander)return{x:lander.x,y:lander.y+24};
  const fall=this.looseHumans.find(h=>h.index===index);return fall??{x:this.demoHumans[index],y:this.groundY(this.demoHumans[index])-15};
 }
 // WVTAB's inter-wave deltas increase speed after wave four; native movement still uses seconds, not 6809 ticks.
 enemySpeedScale(kind:number){const extra=Math.max(0,this.wave-4);if(kind===0)return Math.min(0x60,0x2e+extra*2)/0x2e;if(kind===1)return Math.min(0x60,0x28+extra*2)/0x28;if(kind===4)return Math.min(0x60,0x22+extra*4)/0x22;return 1;}

 moveY(target:number,speed:number,dt:number){this.y+=Math.max(-speed*dt,Math.min(speed*dt,target-this.y));}
 rescuePhase(phase:RescuePhase){if(this.mission){this.mission.phase=phase;this.mission.age=0;}}
 beginRescue(){const candidates=this.demoHumans.map((x,i)=>({x,i,d:this.delta(x)*this.dir})).filter(h=>!this.deadHumans.has(h.i)&&!this.foes.some(e=>e.captive===h.i)&&!this.looseHumans.some(e=>e.index===h.i)&&h.d>280&&h.d<800).sort((a,b)=>Math.abs(a.d-420)-Math.abs(b.d-420));const human=candidates[0];if(!human){this.nextRescue=this.time+1;return;}
 const lander=this.foes.filter(e=>e.kind===0&&e.alive&&e.captive===undefined).sort((a,b)=>Math.abs(this.wrap(a.x-human.x+this.world/2)-this.world/2)-Math.abs(this.wrap(b.x-human.x+this.world/2)-this.world/2))[0];if(!lander)return;lander.target=undefined;this.mission={lander,humanIndex:human.i,x:human.x,y:this.groundY(human.x)-15,vy:0,phase:'descend',age:0,dir:this.dir};}
 updateRescue(dt:number){const r=this.mission!;r.age+=dt;this.dir=r.dir;const ground=this.groundY(r.x);
 if(r.phase==='descend'){
  const dx=this.wrap(r.x-r.lander.x+this.world/2)-this.world/2;r.lander.x=this.wrap(r.lander.x+Math.max(-120*dt,Math.min(120*dt,dx)));if(Math.abs(dx)<25)r.lander.y=Math.min(ground-39,r.lander.y+85*dt);this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y-105,190,dt);
  if(r.lander.y>=ground-39&&Math.abs(dx)<25){r.y=r.lander.y+24;this.rescueEvents.pickedUp++;this.rescuePhase('lift');this.effect('abduct');}
 }else if(r.phase==='lift'){
  r.lander.y-=65*dt;r.y=r.lander.y+24;this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y-105,190,dt);
  if(r.lander.y<=ground-205)this.rescuePhase('intercept');
 }else if(r.phase==='intercept'){
  r.lander.y-=65*dt;r.y=r.lander.y+24;this.moveX(this.wrap(r.x-r.dir*290),170,dt);this.moveY(r.lander.y,220,dt);if(r.lander.y<125){this.deadHumans.add(r.humanIndex);r.lander.kind=1;this.mission=undefined;this.nextRescue=this.time+4;this.checkPlanet();}
 }else if(r.phase==='fall'){
  if(r.age>=.16&&r.age-dt<.16)this.effect('fall');
  r.vy=Math.min(170,r.vy+115*dt);r.y+=r.vy*dt;
  if(r.y>=ground-15){r.y=ground-15;if(r.vy>100)this.deadHumans.add(r.humanIndex);this.checkPlanet();this.carrying=false;this.mission=undefined;this.nextRescue=this.time+8;return;}
  if(r.age>.28){this.moveX(r.x,360,dt);this.moveY(r.y-18,340,dt);}
  if(Math.abs(this.delta(r.x))<23&&r.y-this.y>3&&r.y-this.y<34){this.carrying=true;this.score+=500;this.rescueEvents.caught++;this.rescuePhase('return');this.effect('catch');this.rings.push({x:this.x,y:this.y,life:.6,color:'#baff8e'});}
 }else {
  this.moveX(this.wrap(r.x+r.dir*105),160,dt);const target=r.age<.7?r.y-75:this.groundY(this.x)-30;this.moveY(target,145,dt);
  if(r.age>1&&Math.abs(this.y-(this.groundY(this.x)-30))<3){this.demoHumans[r.humanIndex]=this.x;this.carrying=false;this.rescued++;this.score+=500;this.rescueEvents.delivered++;this.effect('delivery');this.mission=undefined;this.nextRescue=this.time+8+this.rand()*5;}
 }
 }
 override update(step:number){this.sound?.state(this.power&&!this.demoPaused,!this.audio||this.muted,this.volume,this.keys.has('KeyT'));const dt=Math.max(0,Math.min(step,.04));if(!this.power){this.draw();return}if(this.demoPaused)return;
 this.time+=dt;this.invincible=Math.max(0,this.invincible-dt);this.bombClock=Math.max(0,this.bombClock-dt);if(this.stage!=='battle'){this.thrusting=false;this.advanceStage(dt);this.draw();return;}this.checkPlanet();this.flash=Math.max(0,this.flash-dt*2);this.rescueClock+=dt;this.spawnClock+=dt;this.waveClock+=dt;this.escapeClock=Math.max(0,this.escapeClock-dt);
 for(const h of this.looseHumans){h.vy=Math.min(170,h.vy+115*dt);h.y+=h.vy*dt;if(h.y>=this.groundY(h.x)-15&&h.vy>100)this.deadHumans.add(h.index);}
 this.looseHumans=this.looseHumans.filter(h=>h.y<this.groundY(h.x)-15);
 if(!this.mission&&this.looseHumans.length){const h=this.looseHumans.sort((a,b)=>Math.abs(this.delta(a.x))-Math.abs(this.delta(b.x)))[0];this.looseHumans.splice(this.looseHumans.indexOf(h),1);this.mission={lander:h.lander,humanIndex:h.index,x:h.x,y:h.y,vy:h.vy,phase:'fall',age:.2,dir:Math.sign(this.delta(h.x))||this.dir};}
 const oldY=this.y,oldDir=this.dir;this.thrusting=false;if(!this.mission){this.dir=Math.floor(this.time/38)%2===0?1:-1;if(this.planet&&this.time>=this.nextRescue)this.beginRescue();}
 if(this.mission)this.updateRescue(dt);
 else {this.fly(this.dir*245,dt);const target=this.foes.filter(e=>e.alive&&this.delta(e.x)*this.dir>80&&this.delta(e.x)*this.dir<750).sort((a,b)=>Math.abs(this.delta(a.x))-Math.abs(this.delta(b.x)))[0];const desired=target?target.y:310+Math.sin(this.time*.9)*120;this.y+=(desired-this.y)*Math.min(1,dt*3.2);}
 this.y=Math.max(140,Math.min(685,this.y));this.shotClock-=dt;
 if(this.shotClock<=0){this.lasers.push({x:this.x+this.dir*26,y:this.y,dir:this.dir,life:.8});this.shotClock=.16+this.rand()*.1;this.effect('fire');}
 for(const e of this.foes){if(!e.alive||e===this.mission?.lander)continue;
 const dx=-this.delta(e.x),dy=this.y-e.y;e.cooldown=(e.cooldown??(1+this.rand()*3))-dt;
 if(e.kind===0){
  if(e.captive!==undefined){e.y-=55*dt;if(e.y<=125){this.deadHumans.add(e.captive);e.captive=undefined;e.kind=1;this.checkPlanet();}}
  else {
   const available=this.demoHumans.map((x,i)=>({x,i,d:this.wrap(x-e.x+this.world/2)-this.world/2})).filter(h=>!this.deadHumans.has(h.i)&&this.mission?.humanIndex!==h.i&&!this.looseHumans.some(f=>f.index===h.i)&&!this.foes.some(f=>f!==e&&(f.captive===h.i||f.target===h.i))).sort((a,b)=>Math.abs(a.d)-Math.abs(b.d));
   const h=available[0];if(h){e.target=h.i;e.x=this.wrap(e.x+Math.max(-55*this.enemySpeedScale(0)*dt,Math.min(55*this.enemySpeedScale(0)*dt,h.d)));e.y+=Math.sign(this.groundY(e.x)-39-e.y)*28*dt;if(Math.abs(h.d)<12&&e.y>=this.groundY(e.x)-40){e.captive=h.i;e.target=undefined;this.rescueEvents.pickedUp++;if(this.visible(e.x))this.effect('abduct');}}
   else {e.target=undefined;e.x=this.wrap(e.x+Math.sin(e.phase)*55*dt);}
  }
 }
 else if(e.kind===1||e.kind===4||e.kind===5){const speed=e.kind===5?260:e.kind===4?205:130;e.x=this.wrap(e.x+(Math.abs(dx)<90?Math.cos(e.phase):Math.sign(dx))*speed*this.enemySpeedScale(e.kind)*dt);e.y+=(Math.sign(dy)*65+Math.sin(this.time*5+e.phase)*55)*dt;}
 else {e.x=this.wrap(e.x+Math.cos(e.phase)*75*dt);e.y+=Math.sin(this.time+e.phase)*35*dt;}
 e.y=Math.max(125,Math.min(this.groundY(e.x)-25,e.y));
 if(e.cooldown<=0){e.cooldown=1.5+this.rand()*3;if(e.kind===2){this.mines.push({x:e.x,y:e.y,life:10});}else if(Math.abs(dx)<900){const d=Math.hypot(dx,dy)||1;this.charges.push({x:e.x,y:e.y,vx:dx/d*155,vy:dy/d*155,life:4});}}
 }
 for(const m of this.mines)m.life-=dt;this.mines=this.mines.filter(m=>m.life>0).slice(-45);
 for(const b of this.charges){b.x=this.wrap(b.x+b.vx*dt);b.y+=b.vy*dt;b.life-=dt;}this.charges=this.charges.filter(b=>b.life>0).slice(-40);
 for(const l of this.lasers)if(l.life>0)this.fireLaser(l,dt);
 this.lasers=this.lasers.filter(l=>l.life>0);for(const s of this.sparks){s.x=this.wrap(s.x+s.vx*dt);s.y+=s.vy*dt;s.vy+=50*dt;s.life-=dt}this.sparks=this.sparks.filter(s=>s.life>0);this.rings.forEach(r=>r.life-=dt);this.rings=this.rings.filter(r=>r.life>0);
 this.foes=this.foes.filter(e=>e.alive);
 if(!this.foes.length&&!this.mission&&!this.looseHumans.length){this.completeWave();this.draw();return;}
 if(this.waveClock>[30,25,20,16][Math.min(this.wave,4)-1]&&this.spawnClock>9&&this.foes.length<28){this.spawnClock=0;this.foes.push({x:this.wrap(this.x+this.dir*850),y:180+this.rand()*280,kind:5,phase:this.rand()*8,alive:true});}
 while(this.foes.length>38){const i=this.foes.findIndex(e=>e!==this.mission?.lander);this.foes.splice(i,1);}
 const danger=[...this.foes,...this.mines,...this.charges].filter(e=>Math.abs(this.delta(e.x))<130&&Math.abs(e.y-this.y)<100);
 if(!this.mission&&this.invincible===0&&(danger.length>=2||this.foes.filter(e=>e.alive&&this.visible(e.x)).length>=6)&&this.bombs>0)this.smartBomb();
 else if(!this.mission&&danger.length>=2&&this.escapeClock===0){this.x=this.wrap(this.x+this.dir*(500+this.rand()*1000));this.y=210+this.rand()*230;this.escapeClock=8;this.velocityX=0;this.effect('hyperspace');if(this.rand()>192/256)this.loseShip();else this.invincible=.8;}
 if([...this.foes.filter(e=>e.alive),...this.mines,...this.charges].some(e=>Math.abs(this.delta(e.x))<20&&Math.abs(e.y-this.y)<17))this.loseShip();
 this.awardExtra();

 this.cameraOffset+=((this.dir===1?310:650)-this.cameraOffset)*Math.min(1,dt*3);this.cameraX=this.x-this.cameraOffset;
 // The attract program's virtual input is visible in the hardware demonstration.
 this.keys.clear();if(this.bombClock>0)this.keys.add('KeyB');if(this.thrusting)this.keys.add('KeyT');if(this.dir!==oldDir)this.keys.add('KeyR');if(this.escapeClock>7.8)this.keys.add('KeyH');this.keys.add(this.dir===1?'ArrowRight':'ArrowLeft');if(Math.abs(this.y-oldY)>.1)this.keys.add(this.y<oldY?'ArrowUp':'ArrowDown');if(this.shotClock>.13)this.keys.add('Space');if(this.stage!=='battle')this.keys.clear();this.draw();
 }
 sprite(pattern:string[],x:number,y:number,scale:number,colors:Record<string,string>){const c=this.ctx;for(let row=0;row<pattern.length;row++)for(let col=0;col<pattern[row].length;col++){const color=colors[pattern[row][col]];if(color){c.fillStyle=color;c.fillRect(Math.round(x+col*scale),Math.round(y+row*scale),scale,scale)}}}
 pixelText(text:string,x:number,y:number,color:string){const glyphs:Record<string,string>={'A':'010101111101101','B':'110101110101110','C':'111100100100111','D':'110101101101110','E':'111100110100111','G':'111100101101111','H':'101101111101101','I':'111010010010111','K':'101101110101101','L':'100100100100111','M':'101111111101101','N':'101111111111101','O':'111101101101111','P':'110101110100100','R':'110101110101101','S':'111100111001111','T':'111010010010010','U':'101101101101111','V':'101101101101010','W':'101101111111101','Y':'101101010010010','0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111'};for(const ch of text){const bits=glyphs[ch];if(bits){this.ctx.fillStyle=color;for(let i=0;i<15;i++)if(bits[i]==='1')this.ctx.fillRect(x+i%3,y+Math.floor(i/3),1,1);}x+=4;}}
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
 for(const [i,x] of this.demoHumans.entries()){if(this.deadHumans.has(i)||this.foes.some(e=>e.captive===i)||this.looseHumans.some(e=>e.index===i))continue;if(this.mission?.humanIndex===i&&this.mission.phase!=='descend')continue;human(sx(x),sy(this.groundY(x))-8);}
 const frame=Math.floor(this.time*8);const frames=[['LND10','LND20','LND30'],['SCZD10'],['TIED10','TIED20','TIED30','TIED40'],['PRBD10'],['SWMD10'],['UFOD10','UFOD20','UFOD30']];
 for(const e of this.foes){if(!e.alive)continue;const x=sx(e.x);if(x<-10||x>w+10)continue;const list=frames[e.kind];this.bitmap(list[frame%list.length],x,sy(e.y)-4);}
 for(const m of this.mines)this.bitmap(frame%2?'BMBD10':'BMBD20',sx(m.x),sy(m.y)-1);
 for(const b of this.charges){c.fillStyle='#fff';c.fillRect(sx(b.x),sy(b.y),1,1);}
 for(const e of this.foes)if(e.captive!==undefined)human(sx(e.x),sy(e.y+24));for(const h of this.looseHumans)human(sx(h.x),sy(h.y),true);
 const r=this.mission;if(r&&['lift','intercept','fall'].includes(r.phase))human(sx(r.x),sy(r.y),r.phase==='fall');
 for(const l of this.lasers){const x=sx(l.x),y=sy(l.y);c.fillStyle=['#ff38de','#b864ff','#ff4949','#47dfff'][Math.floor(this.time*24)%4];c.fillRect(x-l.dir*33,y,l.dir*33,1);c.fillStyle='#fff';c.fillRect(x,y,2,1);}
 for(const s of this.sparks){c.fillStyle=s.life>.2?s.color:'#885599';c.fillRect(sx(s.x),sy(s.y),1,1);}
 const x=sx(this.x),y=sy(this.y);if(this.stage==='battle'&&(this.invincible===0||Math.floor(this.time*12)%2))ship(x,y,this.dir);c.fillStyle=Math.floor(this.time*30)%2?'#ff3de1':'#49dfff';if(this.stage==='battle')c.fillRect(x-this.dir*(9+Math.floor(this.time*40)%5),y,3,1);
 if(this.carrying){human(x,sy(this.y+15));if(this.mission&&this.mission.age<1)this.pixelText('500',x+9,y+8,'#fff');}c.restore();
 // Native-resolution scanner, reserve ships, score and smart-bomb stock.
 const hud='#8d43c7';c.fillStyle=hud;c.fillRect(0,35,w,1);c.fillRect(84,1,131,1);c.fillRect(84,33,131,1);c.fillRect(84,1,1,33);c.fillRect(214,1,1,33);
 const radar=(wx:number)=>85+this.wrap(wx-this.x+this.world/2)/this.world*128;
 c.fillStyle='#a97324';if(this.planet)for(let i=0;i<128;i++)c.fillRect(85+i,Math.round(3+this.groundY(this.x-this.world/2+i/128*this.world)/720*29),1,1);
 for(const e of this.foes){if(e.alive){c.fillStyle=colors[e.kind];c.fillRect(Math.round(radar(e.x)),Math.round(3+e.y/720*29),1,1);}}
 for(let i=0;i<this.demoHumans.length;i++){const human=this.humanPosition(i);if(!human)continue;c.fillStyle='#76ab36';c.fillRect(Math.round(radar(human.x)),Math.round(3+human.y/720*29),1,1);}
 c.fillStyle='#fff';c.fillRect(149,Math.round(3+this.y/720*29),2,1);c.fillRect(136,2,26,1);c.fillRect(136,32,26,1);for(const px of [136,161]){c.fillRect(px,2,1,3);c.fillRect(px,30,1,3);}
 for(let i=0;i<Math.min(5,this.lives-1);i++)ship(20+i*12,15,1,true);this.pixelText(String(this.score).padStart(5,'0'),35,23,['#e842de','#4ba2ff','#ffe34b'][Math.floor(this.time/8)%3]);for(let i=0;i<Math.min(5,this.bombs);i++)this.bitmap('SBD10',76,10+i*4);
 if(this.stage==='wave'){this.pixelText('ATTACK WAVE '+this.wave+' COMPLETED',95,105,'#fff');this.pixelText('HUMANOID BONUS '+this.waveBonus,103,122,'#ffff55');}
 if(this.stage==='over')this.pixelText('GAME OVER',129,112,'#fff');
 if(this.flash>0){c.fillStyle='#a97324';for(let i=0;i<80;i++)c.fillRect((i*37+this.time*55)%w,235-this.flash*(i%17)*9,1,1);}
 if(this.bombClock>0&&Math.floor(this.bombClock*25)%2){c.fillStyle='#ffffff';c.globalAlpha=.28;c.fillRect(0,36,w,204);c.globalAlpha=1;}

 }
}
