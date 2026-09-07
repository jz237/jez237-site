export const MOVES={jab:{duration:.42,hit:.16,range:1.55,damage:5,clip:'jab',label:'JAB'},cross:{duration:.52,hit:.21,range:1.65,damage:10,clip:'cross',label:'CROSS'},hook:{duration:.58,hit:.24,range:1.4,damage:9,clip:'hook',label:'HOOK'},kick:{duration:.72,hit:.30,range:1.75,damage:11,clip:'lowkick',label:'LOW KICK'}};
export class Combat {
 constructor(seed=237,profiles=[]){this.profiles=profiles;this.seed=seed>>>0;this.round=0;this.wins=[0,0];this.hits=0;this.blocks=0;this.events=[];this.resetRound();}
 move(f){return this.profiles[f.id]?.[f.move]||MOVES[f.move];}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 resetRound(){this.round++;this.time=60;this.phase='intro';this.phaseTime=2.4;this.fighters=[0,1].map((id)=>({id,x:id?1.16:-1.16,previousX:id?1.16:-1.16,face:id?-1:1,hp:100,state:'idle',t:0,duration:0,move:null,hit:false,hitIndex:0,lastMove:null,think:.3+id*.3,velocity:0,serial:0}));}
 act(f,state,duration,move=null){f.state=state;f.t=0;f.duration=duration;f.move=move;f.hit=false;f.hitIndex=0;f.comboHits=0;if(move)f.lastMove=move;f.serial++;}
 step(dt){
  for(const f of this.fighters)f.previousX=f.x;
  if(this.phase!=='fight'){this.phaseTime-=dt;if(this.phaseTime<=0){if(this.phase==='intro'){this.phase='fight';this.events.push({type:'fight'});}else{if(this.wins.some(n=>n===2)){this.round=0;this.wins=[0,0];}this.resetRound();}}return;}
  this.time=Math.max(0,this.time-dt);
  for(const f of this.fighters){const o=this.fighters[1-f.id];f.t+=dt;f.think-=dt;
   if(['attack','hurt','block','dodge'].includes(f.state)&&f.t>=f.duration)this.act(f,'idle',0);
   if(f.state==='attack'){const m=this.move(f);const hits=m.hits||[m.hit];if(f.hitIndex<hits.length&&f.t>=hits[f.hitIndex]){f.hitIndex++;f.hit=f.hitIndex===hits.length;const distance=Math.abs(o.x-f.x);if(distance<m.range&&o.state!=='dodge'){const blocked=o.state==='block';f.comboHits=(f.comboHits||0)+1;o.hp=Math.max(0,o.hp-(blocked?1:m.damage));this.hits++;if(blocked)this.blocks++;this.act(o,blocked?'block':'hurt',blocked?.24:.29);o.velocity=f.face*(blocked?.25:.6);this.events.push({type:blocked?'block':'hit',attacker:f.id,target:o.id,move:f.move,damage:blocked?1:m.damage,combo:f.comboHits});}}}
   if(['idle','walk','back'].includes(f.state)&&f.think<=0){const distance=Math.abs(o.x-f.x);f.think=.12+this.random()*.20;
    if(o.state==='attack'&&o.t<this.move(o).hit&&distance<1.65*1.25&&this.random()<.53)this.act(f,this.random()<.22?'dodge':'block',.4);
    else if(distance>1.16*1.25){if(f.state!=='walk')this.act(f,'walk',0);}
    else if(this.random()<.67){const choices=(distance>1.08*1.25?['kick','cross','jab']:['jab','cross','hook','kick']).filter(m=>m!==f.lastMove);const move=choices[Math.floor(this.random()*choices.length)];this.act(f,'attack',MOVES[move].duration,move);f.think=MOVES[move].duration+.08;}
    else if(this.random()<.45){if(f.state!=='back')this.act(f,'back',0);f.think=.35;}
    else this.act(f,'idle',0);
   }
   const target=f.state==='walk'?f.face*1.25:f.state==='back'?-f.face*.9:0;f.velocity+=(target-f.velocity)*(1-Math.exp(-dt*15));f.x=Math.max(-1.17,Math.min(1.17,f.x+f.velocity*dt));
  }
  const [a,b]=this.fighters;if(b.x-a.x<1.05){const mid=Math.max(-.645,Math.min(.645,(a.x+b.x)/2));a.x=mid-.525;b.x=mid+.525;}
  if(this.time===0||this.fighters.some(f=>f.hp===0)){const winner=a.hp===b.hp?-1:a.hp>b.hp?0:1;if(winner>=0)this.wins[winner]++;this.phase='outro';this.phaseTime=4.8;this.winner=winner;for(const f of this.fighters)this.act(f,f.id===winner?'victory':'ko',5);this.events.push({type:'ko',winner});}
 }
}
