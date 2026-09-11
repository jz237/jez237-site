import {ArcadeGame} from './game';
import {robotronSprites} from './RobotronSprites';
import {defenderFont} from './DefenderFont';
import {RobotronSound,type RobotronEvent} from './RobotronSound';
type Kind='grunt'|'hulk'|'brain'|'spheroid'|'enforcer'|'quark'|'tank'|'prog';
type Actor={x:number;y:number;kind:Kind;timer:number;vx:number;vy:number;id:number};
type Person={x:number;y:number;kind:number;alive:boolean};
type Shot={x:number;y:number;vx:number;vy:number;hostile:boolean;life:number};
const dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
const palette=[0,7,0x17,0xc7,0x1f,0x3f,0x38,0xc0,0xa4,0xff,0x38,0x17,0xcc,0x81,0x81,7].map(n=>`rgb(${(n&7)*255/7},${((n>>3)&7)*255/7},${(n>>6)*85})`);
/** Autonomous recreation: original bitmap frames and sound sequences; newly written game simulation and pilot. */
export class RobotronShow extends ArcadeGame{
 sound?:RobotronSound;demoPaused=false;phase:'battle'|'warp'|'death'='warp';phaseTime=1.2;seed=2084;actors:Actor[]=[];people:Person[]=[];shots:Shot[]=[];particles:{x:number;y:number;vx:number;vy:number;life:number;color:string}[]=[];move=[0,0];aim=[1,0];fireTime=0;stepTime=0;waveTime=0;id=0;kills=0;converted=0;humanChain=0;extraAt=25000;
 private decisionTime=0;private recentPositions:{x:number;y:number}[]=[];shotsFired=0;
 constructor(){super();this.canvas.width=292;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Robotron 2084');this.x=146;this.y=132;this.running=true;this.spawnWave();this.draw();}
 override unlock(){super.unlock();this.sound??=new RobotronSound(this.audio!);this.sound.state(this.power&&!this.demoPaused,false,this.volume);}
 override tone(){this.effect('credit');}
 effect(e:RobotronEvent){this.lastAudio=performance.now();this.sound?.effect(e);}
 rand(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 add(kind:Kind,x=12+this.rand()*268,y=36+this.rand()*187){this.actors.push({x,y,kind,timer:1+this.rand()*3,vx:(this.rand()-.5)*25,vy:(this.rand()-.5)*25,id:this.id++});}
 spawnWave(){this.decisionTime=0;this.recentPositions=[];this.actors=[];this.shots=[];this.x=146;this.y=130;this.humanChain=0;this.waveTime=0;const brain=this.wave%5===0,tank=this.wave%5===2;for(let i=0;i<(brain?8:12+Math.min(this.wave*3,35));i++){let x=12+this.rand()*268,y=36+this.rand()*186;if(Math.hypot(x-this.x,y-this.y)<60)x=x<146?18:274;this.add(brain?'brain':'grunt',x,y);}for(let i=0;i<3+Math.min(this.wave,5);i++)this.add('hulk');if(this.wave>1)for(let i=0;i<2+Math.min(3,this.wave/3);i++)this.add(tank?'quark':'spheroid');this.people=Array.from({length:brain?18:6},(_,i)=>({x:25+this.rand()*242,y:50+this.rand()*163,kind:i%3,alive:true}));this.phase='warp';this.phaseTime=1.15;this.invincible=2;}
 burst(x:number,y:number,color:string){for(let i=0;i<15;i++){const angle=i*Math.PI*2/15,s=20+this.rand()*50;this.particles.push({x,y,vx:Math.cos(angle)*s,vy:Math.sin(angle)*s,life:.25+this.rand()*.3,color});}}
 override update(delta:number){this.sound?.state(this.power&&!this.demoPaused,this.muted,this.volume);if(!this.power||this.demoPaused){this.keys.clear();this.draw();return;}if(!Number.isFinite(delta)||delta<=0)return;let remaining=Math.min(delta,2);while(remaining>1e-8){const dt=Math.min(remaining,1/60);this.advanceSimulation(dt);remaining-=dt;}this.draw();}
 private advanceSimulation(dt:number){this.time+=dt;this.invincible-=dt;this.particles=this.particles.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;return p.life>0;});if(this.phase!=='battle'){this.phaseTime-=dt;if(this.phaseTime<=0){if(this.phase==='death'){if(this.lives<=0){this.lives=3;this.wave=1;this.score=0;this.extraAt=25000;}this.spawnWave();this.effect('start');}else this.phase='battle';}return;}
 this.waveTime+=dt;this.fireTime-=dt;this.stepTime-=dt;this.decisionTime-=dt;
 if(this.decisionTime<=0){this.chooseMovement();this.decisionTime=.16;}
 const length=Math.hypot(...this.move)||1;
 this.x=Math.max(9,Math.min(283,this.x+this.move[0]/length*68*dt));this.y=Math.max(34,Math.min(230,this.y+this.move[1]/length*68*dt));
 this.keys.clear();if(this.move[0])this.keys.add(this.move[0]>0?'ArrowRight':'ArrowLeft');if(this.move[1])this.keys.add(this.move[1]>0?'ArrowDown':'ArrowUp');
 const shot=this.chooseShot();this.aim=shot?[...shot.dir]:[0,0];
 if(shot){this.keys.add('Space');if(this.fireTime<=0){this.fireTime=.11;const n=Math.hypot(...shot.dir);this.shots.push({x:this.x,y:this.y,vx:shot.dir[0]/n*235,vy:shot.dir[1]/n*235,hostile:false,life:1.4});this.shotsFired++;this.effect('fire');}}
 for(const p of this.people)if(p.alive){p.x=Math.max(10,Math.min(282,p.x+Math.sin(this.time+p.kind*8)*dt*5));if(Math.hypot(p.x-this.x,p.y-this.y)<8){p.alive=false;this.rescued++;this.humanChain++;this.score+=Math.min(5000,this.humanChain*1000);this.effect('human');this.burst(p.x,p.y,'#ffff77');}}
 for(const a of [...this.actors]){a.timer-=dt;let target={x:this.x,y:this.y},speed=20+Math.min(this.wave*2,22);if(a.kind==='hulk'||a.kind==='brain'){const p=this.people.filter(p=>p.alive).sort((p,q)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(q.x-a.x,q.y-a.y))[0];if(p)target=p;speed=a.kind==='hulk'?13:17;if(p&&Math.hypot(p.x-a.x,p.y-a.y)<7){p.alive=false;if(a.kind==='brain'){this.add('prog',p.x,p.y);this.converted++;this.effect('convert');}else this.effect('humanLost');}}
 if(['spheroid','quark'].includes(a.kind)){a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<14||a.x>278)a.vx*=-1;if(a.y<40||a.y>224)a.vy*=-1;if(a.timer<0&&this.actors.length<90){this.add(a.kind==='quark'?'tank':'enforcer',a.x,a.y);a.timer=1.5+this.rand()*2;this.effect('spawn');}}
 else {const dx=target.x-a.x,dy=target.y-a.y,n=Math.hypot(dx,dy)||1;if(a.kind==='enforcer'||a.kind==='tank'){speed=12;if(a.timer<=0){this.shots.push({x:a.x,y:a.y,vx:dx/n*72,vy:dy/n*72,hostile:true,life:4});a.timer=1.4+this.rand();this.effect(a.kind==='tank'?'tank':'enforcer');}}if(a.kind==='prog')speed=50;a.x+=dx/n*speed*dt;a.y+=dy/n*speed*dt;}
 if(Math.hypot(a.x-this.x,a.y-this.y)<8&&this.invincible<=0)this.die();}
 this.shots=this.shots.filter(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.life<=0||s.x<5||s.x>287||s.y<29||s.y>234)return false;if(s.hostile){if(Math.hypot(s.x-this.x,s.y-this.y)<6&&this.invincible<=0){this.die();return false;}return true;}const a=this.actors.find(a=>Math.abs(a.x-s.x)<6&&Math.abs(a.y-s.y)<8);if(!a)return true;if(a.kind==='hulk'){a.x+=s.vx*.016;a.y+=s.vy*.016;this.effect('hulk');}else{this.actors.splice(this.actors.indexOf(a),1);this.kills++;this.score+=a.kind==='grunt'?100:1000;this.burst(a.x,a.y,palette[(a.id%6)+1]);this.effect('robot');}return false;});
 if(this.stepTime<0){this.stepTime=.22;this.effect('step');}if(this.score>=this.extraAt){this.lives++;this.extraAt+=25000;this.effect('extra');}if(!this.actors.some(a=>a.kind!=='hulk')){this.wave++;this.effect('wave');this.spawnWave();}}
 /** Estimate actual motion, rather than aiming at a moving robot's old position. */
 private velocity(a:Actor){
  if(a.kind==='quark'||a.kind==='spheroid')return {x:a.vx,y:a.vy};
  let target:{x:number;y:number}=this;
  if(a.kind==='hulk'||a.kind==='brain')target=this.people.filter(p=>p.alive).reduce<{x:number;y:number}>((best,p)=>best===this||Math.hypot(p.x-a.x,p.y-a.y)<Math.hypot(best.x-a.x,best.y-a.y)?p:best,this);
  const dx=target.x-a.x,dy=target.y-a.y,n=Math.hypot(dx,dy)||1;
  const speed=a.kind==='hulk'?13:a.kind==='brain'?17:a.kind==='prog'?50:['enforcer','tank'].includes(a.kind)?12:20+Math.min(this.wave*2,22);
  return {x:dx/n*speed,y:dy/n*speed};
 }
 /** Fire only along a reachable eight-way lane. Hulks block a shot at robots behind them. */
 private chooseShot(){
  let best:{dir:number[];value:number}|null=null;
  const actors=this.actors.map(a=>({a,v:this.velocity(a)}));
  for(const dir of dirs){const n=Math.hypot(...dir),ux=dir[0]/n,uy=dir[1]/n;let first:Actor|undefined,near=Infinity;
   for(const {a,v}of actors){const dx=a.x-this.x,dy=a.y-this.y,closing=235-v.x*ux-v.y*uy,t=(dx*ux+dy*uy)/closing;if(t<=0||t>1.4)continue;
    const px=dx+v.x*t,py=dy+v.y*t,along=px*ux+py*uy,cross=Math.abs(px*uy-py*ux);
    if(cross<6&&along<near){first=a;near=along;}
   }
   if(!first||first.kind==='hulk')continue;
   const value=200-near+(['brain','spheroid','quark'].includes(first.kind)?45:0);
   if(!best||value>best.value)best={dir,value};
  }
  return best;
 }
 private chooseMovement(){
  const actors=this.actors.map(a=>({a,v:this.velocity(a)}));
  const foes=this.actors.filter(a=>a.kind!=='hulk');
  const enemy=foes.reduce<Actor|undefined>((best,a)=>!best||Math.hypot(a.x-this.x,a.y-this.y)<Math.hypot(best.x-this.x,best.y-this.y)?a:best,undefined);
  const humans=this.people.filter(p=>p.alive);
  const human=humans.reduce<Person|undefined>((best,p)=>!best||Math.hypot(p.x-this.x,p.y-this.y)<Math.hypot(best.x-this.x,best.y-this.y)?p:best,undefined);
  const rescue=human&&Math.hypot(human.x-this.x,human.y-this.y)<100&&this.actors.every(a=>Math.hypot(a.x-human.x,a.y-human.y)>17);
  const goal=rescue?human:enemy||human||{x:146,y:132};
  const previous=[...this.move];let best=-Infinity,chosen=dirs[0];
  for(const dir of dirs){const n=Math.hypot(...dir),vx=dir[0]/n*68,vy=dir[1]/n*68,px=this.x+vx*.26,py=this.y+vy*.26;
   let value=-Math.hypot(goal.x-px,goal.y-py)*(rescue?1.6:.8);
   value-=Math.max(0,16-px)*12+Math.max(0,px-276)*12+Math.max(0,40-py)*12+Math.max(0,py-224)*12;
   for(const {a,v}of actors){let nearest=Infinity;for(const t of [.08,.2,.38])nearest=Math.min(nearest,Math.hypot(a.x+v.x*t-this.x-vx*t,a.y+v.y*t-this.y-vy*t));
    value-=Math.max(0,38-nearest)**2*.18*(a.kind==='hulk'?1.25:1);
   }
   for(const shot of this.shots)if(shot.hostile){const dx=shot.x-this.x,dy=shot.y-this.y,rx=shot.vx-vx,ry=shot.vy-vy,t=Math.max(0,Math.min(.45,-(dx*rx+dy*ry)/(rx*rx+ry*ry||1)));value-=Math.max(0,20-Math.hypot(dx+rx*t,dy+ry*t))**2*.55;}
   // Strafe into a horizontal, vertical or diagonal firing lane while approaching.
   if(enemy&&!rescue){const v=this.velocity(enemy),t=Math.hypot(enemy.x-px,enemy.y-py)/235,dx=enemy.x+v.x*t-px,dy=enemy.y+v.y*t-py;
    const miss=Math.min(Math.abs(dx),Math.abs(dy),Math.abs(Math.abs(dx)-Math.abs(dy))/Math.SQRT2);value-=miss*.8;}
   // A short memory discourages pacing over the same few pixels or sticking in a corner.
   for(const past of this.recentPositions.slice(0,-2))value-=Math.max(0,13-Math.hypot(px-past.x,py-past.y))*.45;
   value+=(dir[0]*previous[0]+dir[1]*previous[1])*2;
   if(value>best){best=value;chosen=dir;}
  }
  this.move=[...chosen];this.recentPositions.push({x:this.x,y:this.y});if(this.recentPositions.length>14)this.recentPositions.shift();
 }
 die(){if(this.phase!=='battle')return;this.lives--;this.keys.clear();this.phase='death';this.phaseTime=1.4;this.burst(this.x,this.y,'#fff');this.effect('death');}
 sprite(name:string,x:number,y:number){const rows=robotronSprites[name];if(!rows)return;const ox=Math.round(x-rows[0].length/2),oy=Math.round(y-rows.length/2);for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const n=parseInt(rows[j][i],16);if(n){this.ctx.fillStyle=n===11?palette[[6,1,7][Math.floor(this.time*8)%3]]:palette[n];this.ctx.fillRect(ox+i,oy+j,1,1);}}}
 text(text:string,x:number,y:number,color='#fff'){this.ctx.fillStyle=color;for(const ch of text){const rows=defenderFont[ch];if(rows)for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++)if(rows[j][i]!=='0')this.ctx.fillRect(x+i,y+j,1,1);x+=7;}}
 override draw(){const c=this.ctx;if(!c)return;c.fillStyle='#000';c.fillRect(0,0,292,240);if(!this.power)return;this.text(String(this.score).padStart(7,'0'),10,5,'#ff4444');this.text('HIGH SCORE',137,5,'#ff4444');this.text(String(Math.max(100000,this.score)).padStart(7,'0'),150,15,'#ffff44');for(let i=0;i<Math.min(this.lives,6);i++)this.sprite('MNPIC',14+i*10,20);c.strokeStyle='#244cff';c.lineWidth=1;c.strokeRect(3.5,28.5,285,207);this.text('WAVE '+String(this.wave),221,239-10,'#ffff55');const frame=1+Math.floor(this.time*9)%3;
 for(const p of this.people)if(p.alive)this.sprite([`MDP${frame}`,`DDP${frame}`,`KIDDP${frame}`][p.kind],p.x,p.y);
 for(const a of this.actors){const name=a.kind==='grunt'?`RWDP${frame}`:a.kind==='hulk'?`HLKDP${frame}`:a.kind==='brain'?`BRDP${frame}`:a.kind==='prog'?`PGXPIC`:a.kind==='spheroid'?`CIRP${Math.floor(this.time*10)%8}`:a.kind==='quark'?`SQP${Math.floor(this.time*10)%8}`:a.kind==='tank'?`TNKP${1+Math.floor(this.time*8)%4}`:'ENFP0';this.sprite(name,a.x,a.y);}
 for(const s of this.shots){c.strokeStyle=s.hostile?'#ff55ff':['#ff5555','#ffff55','#55ffff'][Math.floor(this.time*20)%3];c.beginPath();c.moveTo(Math.round(s.x),Math.round(s.y));c.lineTo(Math.round(s.x-s.vx*.02),Math.round(s.y-s.vy*.02));c.stroke();}for(const p of this.particles){c.fillStyle=p.color;c.fillRect(Math.round(p.x),Math.round(p.y),1,1);}if(this.phase!=='death'&&(this.invincible<=0||Math.floor(this.time*15)%2===0))this.sprite(`MAN${Math.abs(this.move[0])>Math.abs(this.move[1])?(this.move[0]>0?'R':'L'):(this.move[1]>0?'D':'U')}P${frame}`,this.x,this.y);
 if(this.phase==='warp'){c.strokeStyle='#47ccff';for(let i=0;i<5;i++){const r=(1-this.phaseTime/1.15)*120+i*8;c.strokeRect(146-r,132-r*.65,r*2,r*1.3);}this.text('WAVE '+this.wave,124,115,'#fff');}if(this.phase==='death')this.text(this.lives<=0?'GAME OVER':'GET READY',115,120,'#ff8888');}
}
