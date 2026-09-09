import {createFishBrain,thinkFish,rememberPlant,type FishBrain,type FishSenses} from './FishBrain.ts';
export const MAX_TETRA_PITCH=.24;
export const MAX_TETRA_VERTICAL_SPEED=5;
export type TetraBehavior='cruising'|'burst'|'gliding'|'approaching'|'inspecting'|'foraging';
export type TetraSwim={x:number;y:number;vx:number;vy:number;yaw:number;pitch:number;speed:number;direction:1|-1;sinceTurn:number;elapsed:number;behavior:TetraBehavior;remaining:number;targetX:number;targetY:number;cruiseSpeed:number;effort:number;pectoralEffort:number;seed:number;wasFeeding:boolean;turnRate:number;depthTarget:number;depthRemaining:number;depthBand:number;brain:FishBrain;z:number;vz:number;targetZ:number;depthHeading:number;depthTimer:number};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const ease=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-dt*rate));
function random(s:TetraSwim){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function createTetraSwim(seed=237):TetraSwim{return {x:1110,y:330,vx:16,vy:0,yaw:0,pitch:0,speed:16,direction:1,sinceTurn:10,elapsed:0,behavior:'cruising',remaining:2.6,targetX:1190,targetY:345,cruiseSpeed:16,effort:.7,pectoralEffort:.35,seed,wasFeeding:false,turnRate:.8,depthTarget:445,depthRemaining:20,depthBand:2,z:.62,vz:0,targetZ:.18,depthHeading:0,depthTimer:0,brain:createFishBrain()};}
function enter(s:TetraSwim,behavior:TetraBehavior){
 s.behavior=behavior;
 const r=random(s);
 if(behavior==='cruising'){s.remaining=3+r*5;s.cruiseSpeed=11+random(s)*10;s.targetY=s.depthTarget;}
 if(behavior==='burst'){s.remaining=.7+r*1.1;s.cruiseSpeed=24+random(s)*7;}
 if(behavior==='gliding')s.remaining=1.8+r*2.6;
 if(behavior==='inspecting'){s.remaining=2.2+r*3.5;rememberPlant(s.brain,s.targetX,s.targetY);}
 if(behavior==='approaching'){
  // Leaf and branch margins in the photographic planting, kept near the current depth.
  const sites=[[1170,380],[1090,397],[975,382],[890,327],[760,355],[690,340],[1180,480],[1060,465],[950,490],[810,465],[820,287],[990,275],[1150,290]];
  const ahead=sites.filter(([x,y])=>(x-s.x)*s.direction>25&&(x-s.x)*s.direction<250&&Math.abs(y-s.y)<85);
  const pool=ahead.length?ahead:sites.filter(([,y])=>Math.abs(y-s.y)<85);
  const novel=pool.filter(([x,y])=>!s.brain.visited.some(v=>Math.hypot(v.x-x,v.y-y)<55));const options=novel.length?novel:pool;const chosen=options[Math.floor(r*options.length)]||sites[2];
  s.targetX=chosen[0];s.targetY=chosen[1]-12;s.remaining=20;
  if(s.sinceTurn>6&&Math.sign(s.targetX-s.x)!==s.direction){s.direction=s.direction===1?-1:1;s.sinceTurn=0;s.turnRate=.65+random(s)*.2;}
 }
 if(behavior==='foraging'){s.remaining=2+r*2;s.targetX=990+random(s)*65;s.targetY=257+random(s)*10;}
}
/** Stable upright locomotion, with time-based decisions rather than per-frame randomness. */
export function advanceTetraSwim(s:TetraSwim,seconds:number,feeding=false,lowOxygen=false,senses?:FishSenses){
 const dt=clamp(Number.isFinite(seconds)?seconds:0,0,.1);if(!dt)return;
 const intent=senses?thinkFish(s.brain,dt,s.x,s.y,s.speed,senses,s.z):null;
 if(intent)feeding=intent.kind==='feed';
 s.elapsed+=dt;s.sinceTurn+=dt;s.remaining-=dt;
 if(!feeding){s.depthRemaining-=dt;if(s.depthRemaining<=0&&Math.abs(s.depthTarget-s.y)<24){s.depthBand=(s.depthBand+1+(random(s)<.25?1:0))%3;const bands=[[267,305],[345,390],[440,485]];const band=bands[s.depthBand];s.depthTarget=band[0]+random(s)*(band[1]-band[0]);s.depthRemaining=18+random(s)*18;}}
 if(feeding&&!s.wasFeeding)enter(s,'foraging');
 if(!feeding&&s.wasFeeding)enter(s,'gliding');
 s.wasFeeding=feeding;
 if(s.remaining<=0){
  if(feeding)enter(s,'foraging');
  else if(s.behavior==='burst')enter(s,'gliding');
  else if(s.behavior==='approaching')enter(s,'inspecting');
  else if(s.behavior==='inspecting')enter(s,random(s)<.6?'burst':'cruising');
  else {const roll=random(s);enter(s,roll<.36&&Math.abs(s.depthTarget-s.y)<30?'approaching':roll<.70?'burst':'cruising');}
 }
 if(s.sinceTurn>6&&((s.direction===1&&s.x>1210)||(s.direction===-1&&s.x<660))){s.direction=s.direction===1?-1:1;s.sinceTurn=0;s.turnRate=.65+random(s)*.2;if(!feeding)enter(s,'cruising');}
 if(feeding&&s.sinceTurn>6&&(s.targetX-s.x)*s.direction<-22){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}
 if(intent?.target){s.targetX=clamp(intent.target.x,650,1220);s.targetY=clamp(intent.target.y,240,500);if(intent.kind==='school'||intent.kind==='space'){s.behavior='cruising';s.cruiseSpeed=intent.kind==='space'?9:15;s.remaining=Math.max(1,s.remaining);}if(s.sinceTurn>6&&(s.targetX-s.x)*s.direction<-35){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}}
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
  if(Math.abs(s.targetY-s.y)>20)pace=Math.max(pace,7);
  drive=pace/24;fan=pace<3?.8:.4;
  if(s.behavior==='approaching'&&Math.abs(s.targetX-s.x)<19&&Math.abs(s.targetY-s.y)<17){enter(s,'inspecting');pace=0;drive=.02;fan=.9;}
 }
 if(intent?.kind==='school'){pace=clamp(Math.abs(intent.target?.vx??12)*.5+Math.abs(s.targetX-s.x)*.16,6,23);drive=pace/28;}
 if(intent?.kind==='rest'){pace=0;drive=.015;fan=.85;s.behavior='gliding';s.remaining=2;}
 if(turning){pace=Math.min(pace,8);drive=.3;fan=.7;}
 if(lowOxygen){pace=Math.min(pace,11);drive=Math.min(drive,.55);}
 s.speed=ease(s.speed,pace,s.behavior==='gliding'?.65:1.65,dt);
 s.effort=ease(s.effort,drive,3,dt);s.pectoralEffort=ease(s.pectoralEffort,fan,3,dt);
 const holding=s.behavior==='inspecting'||intent?.kind==='rest';
 const goalY=intent?.target||s.behavior==='approaching'||s.behavior==='foraging'?s.targetY:s.depthTarget;
 const climbLimit=Math.min(MAX_TETRA_VERTICAL_SPEED,Math.max(1,s.speed)*Math.tan(MAX_TETRA_PITCH));
 const wantedVy=turning||holding?0:clamp((goalY-s.y)*.16,-climbLimit,climbLimit);
 s.vy=ease(s.vy,wantedVy,2,dt);
 s.vx=s.speed*Math.cos(s.yaw);s.x+=s.vx*dt;s.y+=s.vy*dt;
 const wantedPitch=turning?0:holding?Math.sin(s.elapsed*.9)*.025:clamp(Math.atan2(-s.vy,Math.max(1,s.speed)),-MAX_TETRA_PITCH,MAX_TETRA_PITCH);
 // Depth is normalized back-to-front. Commit to a destination, then linger before choosing another.
 s.depthTimer-=dt;
 if(Math.abs(s.z-s.targetZ)<.045&&s.depthTimer<=0){s.targetZ=s.targetZ<.5?.72+random(s)*.2:.08+random(s)*.22;s.depthTimer=8+random(s)*10;}
 const targetZ=intent?.target?.z??(feeding?.65:s.targetZ);
 const desiredVz=holding||turning?0:clamp((targetZ-s.z)*.15,-s.speed*.65/180,s.speed*.65/180);
 s.vz=ease(s.vz,desiredVz,1.6,dt);s.z=clamp(s.z+s.vz*dt,.06,.94);
 const depthAngle=turning?0:Math.atan2(-s.vz*180,Math.max(2,s.speed))*s.direction;
 s.depthHeading+=clamp(depthAngle-s.depthHeading,-.25*dt,.25*dt);
 s.pitch+=clamp((wantedPitch-s.pitch)*(1-Math.exp(-dt*2)),-.25*dt,.25*dt);
}
export function tetraBehaviorLabel(s:TetraSwim){if(s.brain.intent.kind==='rest')return 'Resting';if(s.brain.intent.kind==='school')return 'Following the school';if(s.brain.intent.kind==='space')return 'Making space';return {cruising:'Exploring',burst:'Short swimming burst',gliding:'Gliding',approaching:'Approaching a leaf',inspecting:'Inspecting the planting',foraging:'Looking for food'}[s.behavior];}


