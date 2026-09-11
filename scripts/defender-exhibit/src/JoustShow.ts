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
 sound?:JoustSound;demoPaused=false;engine:any;renderer:any;accumulator=0;restartTime=0;flapTick=0;kills=0;eggsCollected=0;seed=1982;
 constructor(){super();this.canvas.width=292;this.canvas.height=240;this.canvas.setAttribute('aria-label','Autonomous Williams Joust');this.engine=new JoustEngine({mode:'1p',lives:5,seed:this.seed,holdUntilInput:false});this.renderer=new (Renderer as any)(this.canvas);Object.assign(this.renderer,{scale:1,scaleX:1,scaleY:1,ox:0,oy:0});this.running=true;this.draw();}
 override unlock(){super.unlock();this.sound??=new JoustSound(this.audio!);this.sound.state(this.power&&!this.demoPaused,this.muted,this.volume);}
 override tone(){this.sound?.effect('credit');this.lastAudio=performance.now();}
 pilot(){
  const p=this.engine.players[0],input={left:false,right:false,flap:false};if(!p?.alive||p.materializing>0)return input;
  this.flapTick++;const flap=(n:number)=>{input.flap=this.flapTick%n===0;};
  const nearLava=p.y>WORLD.FLOOR-48;
  const danger=this.engine.enemies.find((e:any)=>e.alive&&e.materializing<=0&&Math.abs(wrapDelta(p.x,e.x))<26&&e.y<p.y+2&&p.y-e.y<32);
  const ptero=this.engine.pteros.find((e:any)=>e.alive&&Math.abs(wrapDelta(p.x,e.x))<46&&Math.abs(e.y-p.y)<40);
  if(danger||ptero){const e=danger||ptero,dx=wrapDelta(p.x,e.x);input.left=dx>0;input.right=dx<0;flap(4);return input;}
  const eggs=this.engine.eggs.filter((e:any)=>!e.dead&&['egg','shake','walking','mounting','hatching'].includes(e.state)&&e.y<WORLD.FLOOR-6);
  const foes=this.engine.enemies.filter((e:any)=>e.alive&&e.materializing<=0);
  const nearest=(items:any[])=>items.sort((a,b)=>Math.abs(wrapDelta(p.x,a.x))+Math.abs(a.y-p.y)*.7-Math.abs(wrapDelta(p.x,b.x))-Math.abs(b.y-p.y)*.7)[0];
  const egg=nearest(eggs),target=egg||nearest(foes);
  if(target){const dx=wrapDelta(p.x,target.x),aim=egg?target.y-2:Math.max(38,target.y-17);const brake=(p.vx||0)*9;
   input.left=dx-brake< -4;input.right=dx-brake>4;
   if(nearLava||p.y>aim+5)flap(nearLava?4:5);else if(p.y>=aim-7)flap(egg?12:9);
  }else{input.right=Math.floor(this.time/4)%2===0;input.left=!input.right;if(p.y>120||nearLava)flap(6);else if(p.y>85)flap(15);}
  return input;
 }
 override update(delta:number){this.sound?.state(this.power&&!this.demoPaused,this.muted,this.volume);if(!this.power||this.demoPaused){this.keys.clear();this.draw();return;}if(!Number.isFinite(delta)||delta<=0)return;this.accumulator+=Math.min(delta,2);const step=1/PHYS.TICK_HZ;
  while(this.accumulator>=step){this.accumulator-=step;this.time+=step;const input=this.pilot();this.keys.clear();if(input.left)this.keys.add('ArrowLeft');if(input.right)this.keys.add('ArrowRight');if(input.flap)this.keys.add('Space');
   const snap=this.engine.tick([input]);for(const e of snap.events){this.sound?.effect(e.type);this.lastAudio=performance.now();if(e.type==='enemyDie')this.kills++;if(e.type==='eggCollect')this.eggsCollected++;}
   if(this.engine.waveCleared&&this.engine.clearTimer<=0)this.engine.nextWave();
   this.renderer.updateFx(1);this.renderer.time=this.engine.animFrame;const p=this.engine.players[0];this.x=p.x;this.y=p.y;this.score=p.score;this.lives=p.lives;this.wave=this.engine.wave;this.rescued=this.eggsCollected;
   if(this.engine.gameOver){this.restartTime+=step;if(this.restartTime>3){this.engine=new JoustEngine({mode:'1p',lives:5,seed:++this.seed,holdUntilInput:false});this.restartTime=0;this.sound?.effect('start');}}else this.restartTime=0;
  }this.draw();
 }
 text(text:string,x:number,y:number,color:string){this.ctx.fillStyle=color;for(const ch of text){const rows=defenderFont[ch];if(rows)for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++)if(rows[j][i]!=='0')this.ctx.fillRect(x+i,y+j,1,1);x+=7;}}
 override draw(){if(!this.ctx)return;if(!this.power){this.ctx.fillStyle='#000';this.ctx.fillRect(0,0,292,240);return;}if(!this.renderer)return;this.renderer.render(this.engine.snapshot());this.text(String(this.score).padStart(7,'0'),8,5,'#ffff00');this.text('JOUST',126,5,'#ff9500');this.text('WAVE '+this.wave,225,5,'#00ddff');this.text('MOUNTS '+Math.max(0,this.lives),8,228,'#ffff00');if(this.engine.gameOver)this.text('GAME OVER',113,110,'#ffb400');}
}
