import {ArcadeGame} from './game';
import API from './joust/engine.js';
import DATA from './joust/data.js';
import {Renderer} from './joust/render.js';
import {JoustSound} from './JoustSound';
import {defenderFont} from './DefenderFont';
const {JoustEngine,wrapDelta}=API as any;
const {WORLD,PHYS}=DATA;
/** The existing site's source-faithful Joust engine, driven by an exhibit-only pilot. */
export class JoustShow extends ArcadeGame{
 sound?:JoustSound;demoPaused=false;engine:any;renderer:any;accumulator=0;restartTime=0;flapTick=0;kills=0;eggsCollected=0;seed=1982;route:any[]=[];routeAge=0;routeTarget:any=null;
 constructor(){super();this.canvas.width=292;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Williams Joust');this.engine=new JoustEngine({mode:'1p',lives:5,seed:this.seed,holdUntilInput:false});this.renderer=new (Renderer as any)(this.canvas);Object.assign(this.renderer,{scale:1,scaleX:1,scaleY:1,ox:0,oy:0});this.running=true;this.draw();}
 override unlock(){super.unlock();this.sound??=new JoustSound(this.audio!);this.sound.state(this.power&&!this.demoPaused,this.muted,this.volume);}
 override tone(){this.sound?.effect('credit');this.lastAudio=performance.now();}
 // Feet-space obstacles include the mount's width and rider height. Rebuild from
 // live shelves so burned/eroded platforms stop blocking routes immediately.
 obstacles(){return this.engine.platforms.filter((p:any)=>p.sprite).map((p:any)=>({x1:p.x1-12,x2:p.x2+12,y1:p.y+1,y2:p.y+(this.renderer.spr[p.sprite]?._wh||8)+21}));}
 clearPath(a:any,b:any,blocks=this.obstacles()){
  const dx=wrapDelta(a.x,b.x),dy=b.y-a.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/3));
  for(let i=1;i<=n;i++){const x=API.wrapX(a.x+dx*i/n),y=a.y+dy*i/n;
   if(blocks.some((r:any)=>[-WORLD.WRAP_SPAN,0,WORLD.WRAP_SPAN].some(w=>x+w>r.x1&&x+w<r.x2&&y>r.y1&&y<r.y2)))return false;
  }return true;
 }
 navigate(p:any,goal:any){
  const blocks=this.obstacles();if(this.clearPath(p,goal,blocks)){this.route=[];this.routeTarget=null;return goal;}
  if(!this.route.length||--this.routeAge<=0||!this.routeTarget||Math.abs(wrapDelta(goal.x,this.routeTarget.x))>18||Math.abs(goal.y-this.routeTarget.y)>14){
   // A small wrapping grid finds passages around either end of every shelf.
   // Diagonal corner cutting is forbidden; smoothing retains body clearance.
   const cols=51,rows=31,dx=WORLD.WRAP_SPAN/cols,dy=6;
   const nodes=Array.from({length:cols*rows},(_,i)=>({x:WORLD.WRAP_MIN+(i%cols)*dx,y:WORLD.CEIL+Math.floor(i/cols)*dy}));
   const free=nodes.map(n=>this.clearPath(n,n,blocks));
   const nearest=(v:any)=>{let best=-1,d=Infinity;nodes.forEach((n,i)=>{const nd=Math.hypot(wrapDelta(v.x,n.x),v.y-n.y);if(free[i]&&nd<d){d=nd;best=i;}});return best;};
   const from=nearest(p),to=nearest(goal),prev=new Int32Array(nodes.length).fill(-1),queue=[from];
   if(from>=0&&to>=0){prev[from]=from;for(let h=0;h<queue.length&&prev[to]<0;h++){const i=queue[h],x=i%cols,y=Math.floor(i/cols);
    for(const [ax,ay]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){const ny=y+ay;if(ny<0||ny>=rows)continue;const j=ny*cols+(x+ax+cols)%cols;if(prev[j]>=0||!free[j]||!this.clearPath(nodes[i],nodes[j],blocks))continue;prev[j]=i;queue.push(j);}
   }}
   this.route=[];if(to>=0&&prev[to]>=0){for(let i=to;i!==from;i=prev[i])this.route.unshift(nodes[i]);}
   this.routeAge=24;this.routeTarget={...goal};
  }
  while(this.route.length>1&&Math.hypot(wrapDelta(p.x,this.route[0].x),p.y-this.route[0].y)<10)this.route.shift();
  let next=this.route[0];for(const n of this.route){if(this.clearPath(p,n,blocks))next=n;else break;}
  return next||goal;
 }
 defeatEffect(e:any){
  if(!['enemyDie','pteroDie','playerDie'].includes(e.type))return;
  const player=e.type==='playerDie',ptero=e.type==='pteroDie';
  this.renderer.addEffect(['FL1','FL2','FL3'],e.x,e.y-(ptero?0:8),ptero?2.2:player?1.8:1.4,ptero||player?22:16);
  this.renderer.burst(player?'ash':'feather',e.x,e.y,{n:player?16:ptero?18:10,col:player?'#cccccc':ptero?'#39c06a':'#ffe14d',size:1,life:player?45:30});
 }
 pilot(){
  const p=this.engine.players[0],input={left:false,right:false,flap:false};if(!p?.alive||p.materializing>0)return input;
  this.flapTick++;const flap=(n:number)=>{input.flap=this.flapTick%n===0;};
  const nearLava=p.y>WORLD.FLOOR-48;
  const danger=this.engine.enemies.find((e:any)=>e.alive&&e.materializing<=0&&Math.abs(wrapDelta(p.x,e.x))<26&&e.y<p.y+2&&p.y-e.y<32&&this.clearPath(p,e));
  const ptero=this.engine.pteros.find((e:any)=>e.alive&&Math.abs(wrapDelta(p.x,e.x))<46&&Math.abs(e.y-p.y)<40);
  if(danger||ptero){const e=danger||ptero,dx=wrapDelta(p.x,e.x);input.left=dx>0;input.right=dx<0;flap(4);return input;}
  const eggs=this.engine.eggs.filter((e:any)=>!e.dead&&['egg','shake','walking','mounting','hatching'].includes(e.state)&&e.y<WORLD.FLOOR-6);
  const foes=this.engine.enemies.filter((e:any)=>e.alive&&e.materializing<=0);
  const nearest=(items:any[])=>items.sort((a,b)=>Math.abs(wrapDelta(p.x,a.x))+Math.abs(a.y-p.y)*.7-Math.abs(wrapDelta(p.x,b.x))-Math.abs(b.y-p.y)*.7)[0];
  const egg=nearest(eggs),target=egg||nearest(foes);
  if(target){const goal={x:target.x,y:egg?target.y-2:Math.max(38,target.y-17)},waypoint=this.navigate(p,goal);const dx=wrapDelta(p.x,waypoint.x),aim=waypoint.y;const brake=(p.vx||0)*(this.route.length?5:9);
   input.left=dx-brake< -4;input.right=dx-brake>4;
   const predicted=p.y+(p.vy||0)*10;
   if(nearLava||predicted>aim+5)flap(nearLava?4:5);else if(predicted>=aim-7)flap(egg?12:9);
   // Airborne steering takes effect on wing strokes, including braking at a turn.
   if((input.left&&p.vx>0)||(input.right&&p.vx<0))flap(7);
  }else{input.right=Math.floor(this.time/4)%2===0;input.left=!input.right;if(p.y>120||nearLava)flap(6);else if(p.y>85)flap(15);}
  return input;
 }
 override update(delta:number){this.sound?.state(this.power&&!this.demoPaused,this.muted,this.volume);if(!this.power||this.demoPaused){this.keys.clear();this.draw();return;}if(!Number.isFinite(delta)||delta<=0)return;this.accumulator+=Math.min(delta,2);const step=1/PHYS.TICK_HZ;
  while(this.accumulator>=step){this.accumulator-=step;this.time+=step;const input=this.pilot();this.keys.clear();if(input.left)this.keys.add('ArrowLeft');if(input.right)this.keys.add('ArrowRight');if(input.flap)this.keys.add('Space');
   const snap=this.engine.tick([input]);for(const e of snap.events){this.sound?.effect(e.type);this.defeatEffect(e);this.lastAudio=performance.now();if(e.type==='enemyDie')this.kills++;if(e.type==='eggCollect')this.eggsCollected++;}
   if(this.engine.waveCleared&&this.engine.clearTimer<=0)this.engine.nextWave();
   this.renderer.updateFx(1);this.renderer.time=this.engine.animFrame;const p=this.engine.players[0];this.x=p.x;this.y=p.y;this.score=p.score;this.lives=p.lives;this.wave=this.engine.wave;this.rescued=this.eggsCollected;
   if(this.engine.gameOver){this.restartTime+=step;if(this.restartTime>3){this.engine=new JoustEngine({mode:'1p',lives:5,seed:++this.seed,holdUntilInput:false});this.restartTime=0;this.route=[];this.routeTarget=null;this.sound?.effect('start');}}else this.restartTime=0;
  }this.draw();
 }
 text(text:string,x:number,y:number,color:string){this.ctx.fillStyle=color;for(const ch of text){const rows=defenderFont[ch];if(rows)for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++)if(rows[j][i]!=='0')this.ctx.fillRect(x+i,y+j,1,1);x+=7;}}
 override draw(){if(!this.ctx)return;if(!this.power){this.ctx.fillStyle='#000';this.ctx.fillRect(0,0,292,240);return;}if(!this.renderer)return;this.renderer.render(this.engine.snapshot());this.text(String(this.score).padStart(7,'0'),8,5,'#ffff00');this.text('JOUST',126,5,'#ff9500');this.text('WAVE '+this.wave,225,5,'#00ddff');this.text('MOUNTS '+Math.max(0,this.lives),8,228,'#ffff00');if(this.engine.gameOver)this.text('GAME OVER',113,110,'#ffb400');}
}
