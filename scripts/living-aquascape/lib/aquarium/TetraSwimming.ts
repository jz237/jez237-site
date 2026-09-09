export type TetraBehavior='cruising'|'burst'|'gliding'|'approaching'|'inspecting'|'foraging';
export type TetraSwim={x:number;y:number;vx:number;vy:number;yaw:number;pitch:number;speed:number;direction:1|-1;sinceTurn:number;elapsed:number;behavior:TetraBehavior;remaining:number;targetX:number;targetY:number;cruiseSpeed:number;effort:number;pectoralEffort:number;seed:number;wasFeeding:boolean;turnRate:number};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const ease=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-dt*rate));
function random(s:TetraSwim){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function createTetraSwim(seed=237):TetraSwim{return {x:1110,y:330,vx:16,vy:0,yaw:0,pitch:0,speed:16,direction:1,sinceTurn:10,elapsed:0,behavior:'cruising',remaining:2.6,targetX:1190,targetY:345,cruiseSpeed:16,effort:.7,pectoralEffort:.35,seed,wasFeeding:false,turnRate:.8};}
function enter(s:TetraSwim,behavior:TetraBehavior){
 s.behavior=behavior;
 const r=random(s);
 if(behavior==='cruising'){s.remaining=3+r*5;s.cruiseSpeed=11+random(s)*10;s.targetY=300+random(s)*105;}
 if(behavior==='burst'){s.remaining=.7+r*1.1;s.cruiseSpeed=24+random(s)*7;}
 if(behavior==='gliding')s.remaining=1.8+r*2.6;
 if(behavior==='inspecting')s.remaining=2.2+r*3.5;
 if(behavior==='approaching'){
  // Leaf and branch margins in the photographic planting, kept near the current depth.
  const sites=[[1170,380],[1090,397],[975,382],[890,327],[760,355],[690,340]];
  const ahead=sites.filter(([x,y])=>(x-s.x)*s.direction>25&&(x-s.x)*s.direction<250&&Math.abs(y-s.y)<85);
  const pool=ahead.length?ahead:sites.filter(([,y])=>Math.abs(y-s.y)<85);
  const chosen=pool[Math.floor(r*pool.length)]||sites[2];
  s.targetX=chosen[0];s.targetY=chosen[1]-12;s.remaining=20;
  if(s.sinceTurn>6&&Math.sign(s.targetX-s.x)!==s.direction){s.direction=s.direction===1?-1:1;s.sinceTurn=0;s.turnRate=.65+random(s)*.2;}
 }
 if(behavior==='foraging'){s.remaining=2+r*2;s.targetX=990+random(s)*65;s.targetY=257+random(s)*10;}
}
/** Stable upright locomotion, with time-based decisions rather than per-frame randomness. */
export function advanceTetraSwim(s:TetraSwim,seconds:number,feeding=false,lowOxygen=false){
 const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.1);if(!dt)return;
 s.elapsed+=dt;s.sinceTurn+=dt;s.remaining-=dt;
 if(feeding&&!s.wasFeeding)enter(s,'foraging');
 if(!feeding&&s.wasFeeding)enter(s,'gliding');
 s.wasFeeding=feeding;
 if(s.remaining<=0){
  if(feeding)enter(s,'foraging');
  else if(s.behavior==='burst')enter(s,'gliding');
  else if(s.behavior==='approaching')enter(s,'inspecting');
  else if(s.behavior==='inspecting')enter(s,random(s)<.6?'burst':'cruising');
  else {const roll=random(s);enter(s,roll<.36?'approaching':roll<.70?'burst':'cruising');}
 }
 if(s.sinceTurn>6&&((s.direction===1&&s.x>1210)||(s.direction===-1&&s.x<660))){s.direction=s.direction===1?-1:1;s.sinceTurn=0;s.turnRate=.65+random(s)*.2;if(!feeding)enter(s,'cruising');}
 if(feeding&&s.sinceTurn>6&&(s.targetX-s.x)*s.direction<-22){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}
 const heading=s.direction===1?0:Math.PI;
 const turning=Math.abs(heading-s.yaw)>.18;
 const inspecting=s.behavior==='inspecting';
 const look=inspecting?(1+Math.sin(s.elapsed*1.1))*.045:0;
 const desired=heading+(s.direction===1?look:-look);
 s.yaw+=clamp(desired-s.yaw,-dt*s.turnRate,dt*s.turnRate);
 let pace=s.cruiseSpeed,drive=s.cruiseSpeed/28,fan=.35;
 if(s.behavior==='burst'){drive=1+(s.cruiseSpeed-24)/20;fan=.25;}
 if(s.behavior==='gliding'){pace=0;drive=.025;fan=.18;}
 if(inspecting){pace=0;drive=.02;fan=.8+Math.sin(s.elapsed*1.7)*.12;}
 if(s.behavior==='approaching'||s.behavior==='foraging'){
  const distance=(s.targetX-s.x)*s.direction;
  pace=clamp((distance-5)*.55,0,s.behavior==='foraging'?23:15);
  drive=pace/24;fan=pace<3?.8:.4;
  if(s.behavior==='approaching'&&Math.abs(s.targetX-s.x)<19&&Math.abs(s.targetY-s.y)<17){enter(s,'inspecting');pace=0;drive=.02;fan=.9;}
 }
 if(turning){pace=Math.min(pace,8);drive=.3;fan=.7;}
 if(lowOxygen){pace=Math.min(pace,11);drive=Math.min(drive,.55);}
 s.speed=ease(s.speed,pace,s.behavior==='gliding'?.65:1.65,dt);
 s.effort=ease(s.effort,drive,3,dt);s.pectoralEffort=ease(s.pectoralEffort,fan,3,dt);
 const holding=s.behavior==='inspecting';
 const wantedVy=turning||holding?0:clamp((s.targetY-s.y)*.12,-1.7,1.7);
 s.vy=ease(s.vy,wantedVy,2,dt);
 s.vx=s.speed*Math.cos(s.yaw);s.x+=s.vx*dt;s.y+=s.vy*dt;
 const wantedPitch=turning?0:holding?Math.sin(s.elapsed*.9)*.025:clamp(Math.atan2(-s.vy,Math.max(10,s.speed)),-.12,.12);
 s.pitch=ease(s.pitch,wantedPitch,2,dt);
}
export function tetraBehaviorLabel(s:TetraSwim){return {cruising:'Exploring',burst:'Short swimming burst',gliding:'Gliding',approaching:'Approaching a leaf',inspecting:'Inspecting the planting',foraging:'Looking for food'}[s.behavior];}
