import {createFishBrain,thinkFish,rememberPlant,type FishBrain,type FishSenses} from './FishBrain.ts';
export const MAX_TETRA_PITCH=.24;
export const MAX_TETRA_VERTICAL_SPEED=14;
export type TetraBehavior='cruising'|'burst'|'gliding'|'approaching'|'inspecting'|'foraging';
export type TetraSwim={x:number;y:number;vx:number;vy:number;yaw:number;pitch:number;speed:number;direction:1|-1;sinceTurn:number;elapsed:number;behavior:TetraBehavior;remaining:number;targetX:number;targetY:number;cruiseSpeed:number;effort:number;pectoralEffort:number;seed:number;wasFeeding:boolean;turnRate:number;depthTarget:number;depthRemaining:number;depthBand:number;brain:FishBrain;z:number;vz:number;targetZ:number;depthHeading:number;depthTimer:number;startleRemaining:number;startleCooldown:number;avoidanceRemaining:number;avoidanceZ:number;strokeRemaining:number;powerStroke:boolean;browsing:boolean;};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const ease=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-dt*rate));
function random(s:TetraSwim){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function createTetraSwim(seed=237):TetraSwim{return {x:1110,y:330,vx:16,vy:0,yaw:0,pitch:0,speed:16,direction:1,sinceTurn:10,elapsed:0,behavior:'cruising',remaining:2.6,targetX:1190,targetY:345,cruiseSpeed:16,effort:.7,pectoralEffort:.35,seed,wasFeeding:false,turnRate:.8,depthTarget:445,depthRemaining:20,depthBand:2,z:.62,vz:0,targetZ:.18,depthHeading:0,depthTimer:0,startleRemaining:0,startleCooldown:0,avoidanceRemaining:0,avoidanceZ:.5,strokeRemaining:.15+(seed%17)*.019,powerStroke:true,browsing:false,brain:createFishBrain()};}
function enter(s:TetraSwim,behavior:TetraBehavior){
 s.behavior=behavior;
 const r=random(s);
 if(behavior==='cruising'){s.remaining=2+r*4;s.cruiseSpeed=16+random(s)*15;s.targetY=s.depthTarget;}
 if(behavior==='burst'){s.remaining=.28+r*.6;s.cruiseSpeed=38+random(s)*18;}
 if(behavior==='gliding')s.remaining=.65+r*1.1;
 if(behavior==='inspecting'){s.remaining=.7+r*1.4;rememberPlant(s.brain,s.targetX,s.targetY);}
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
 if(intent?.kind==='browse'&&intent.target&&!s.browsing){s.behavior='approaching';s.remaining=18;s.browsing=true;}
 if(intent?.kind!=='browse'&&s.behavior!=='inspecting')s.browsing=false;
 s.strokeRemaining-=dt;
 if(s.strokeRemaining<=0){s.powerStroke=!s.powerStroke;s.strokeRemaining=s.powerStroke?.20+random(s)*.32:.18+random(s)*.4;}
 s.startleRemaining=Math.max(0,s.startleRemaining-dt);s.startleCooldown=Math.max(0,s.startleCooldown-dt);s.avoidanceRemaining=Math.max(0,s.avoidanceRemaining-dt);
 s.elapsed+=dt;s.sinceTurn+=dt;s.remaining-=dt;
 if(!feeding){s.depthRemaining-=dt;if(s.depthRemaining<=0&&Math.abs(s.depthTarget-s.y)<24){s.depthBand=(s.depthBand+1+(random(s)<.25?1:0))%3;const bands=[[267,305],[345,390],[440,485]];const band=bands[s.depthBand];s.depthTarget=band[0]+random(s)*(band[1]-band[0]);s.depthRemaining=8+random(s)*12;}}
 if(feeding&&!s.wasFeeding)enter(s,'foraging');
 if(!feeding&&s.wasFeeding)enter(s,'gliding');
 s.wasFeeding=feeding;
 if(s.remaining<=0){s.browsing=false;
  if(feeding)enter(s,'foraging');
  else if(s.behavior==='burst')enter(s,'gliding');
  else if(s.behavior==='approaching')enter(s,'inspecting');
  else if(s.behavior==='inspecting')enter(s,random(s)<.6?'burst':'cruising');
  else {const roll=random(s);enter(s,roll<.36&&Math.abs(s.depthTarget-s.y)<30?'approaching':roll<.70?'burst':'cruising');}
 }
 if(s.sinceTurn>6&&((s.direction===1&&s.x>1210)||(s.direction===-1&&s.x<660))){s.direction=s.direction===1?-1:1;s.sinceTurn=0;s.turnRate=.65+random(s)*.2;if(!feeding)enter(s,'cruising');}
 if(feeding&&s.sinceTurn>6&&(s.targetX-s.x)*s.direction<-22){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}
 if(intent?.target){s.targetX=clamp(intent.target.x,650,1220);s.targetY=clamp(intent.target.y,220,500);if(s.sinceTurn>(feeding?1.3:4)&&(s.targetX-s.x)*s.direction<-25){s.direction=s.direction===1?-1:1;s.sinceTurn=0;}}
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
  pace=clamp((distance-5)*.55,0,s.behavior==='foraging'?58:18);
  if(Math.abs(s.targetY-s.y)>20)pace=Math.max(pace,feeding?44:9);
  if(feeding)pace=Math.max(pace,Math.min(48,Math.hypot(s.targetX-s.x,s.targetY-s.y,((intent?.target?.z??s.z)-s.z)*180)*1.1));
  drive=pace/24;fan=pace<3?.8:.4;
  if(s.behavior==='approaching'&&Math.abs(s.targetX-s.x)<19&&Math.abs(s.targetY-s.y)<17){enter(s,'inspecting');pace=0;drive=.02;fan=.9;}
 }
 if(intent?.kind==='school'&&s.behavior==='cruising'){pace=clamp(s.cruiseSpeed*.65+Math.abs(intent.target?.vx??17)*.35+Math.abs(s.targetX-s.x)*.014,16,37);drive=pace/28;}
 // Unequal short propulsion bouts and coasts within travel. Frequencies are illustrative,
 // not claimed as measured cardinal kinematics; body and paired fins remain independent.
 if(!turning&&!inspecting&&s.behavior!=='gliding'&&s.startleRemaining<=0){
  if(s.powerStroke){pace*=1.06;drive*=1.08;}
  else {pace*=.86;drive*=.16;fan=Math.max(fan,.32);}
 }
 if(s.browsing&&inspecting){const peck=(s.elapsed+(s.seed%29)*.1)%1.25;if(peck<.11){pace=5;drive=.15;fan=.9;}}
 if(s.startleRemaining>0){pace=72;drive=1.7;fan=1;}
 if(intent?.kind==='rest'){pace=0;drive=.015;fan=.85;s.behavior='gliding';s.remaining=2;}
 if(turning){pace=Math.min(pace,8);drive=.3;fan=.7;}
 if(lowOxygen){pace=Math.min(pace,11);drive=Math.min(drive,.55);}
 // Anticipate a close approach before the hard contact constraint is needed.
 if(senses){for(const other of senses.neighbors){const dx=other.x-s.x,dy=other.y-s.y,dz=((other.z??s.z)-s.z)*180;const distance=Math.hypot(dx,dy,dz);const ahead=dx*s.direction>0;const closing=(s.vx-(other.vx??0))*dx+(s.vy-(other.vy??0))*dy;if(ahead&&closing>0&&distance<65&&Math.abs(dy)<22&&Math.abs(dz)<25){pace=Math.min(pace,Math.max(12,(distance-45)*.8));fan=Math.max(fan,.85);drive=Math.min(drive,.18);}}}
 s.speed=ease(s.speed,pace,s.startleRemaining>0?18:feeding||inspecting?5:s.behavior==='gliding'?.65:s.behavior==='burst'?7:1.65,dt);
 s.effort=ease(s.effort,drive,8,dt);s.pectoralEffort=ease(s.pectoralEffort,fan,3,dt);
 const holding=s.startleRemaining<=0&&(s.behavior==='inspecting'||intent?.kind==='rest');
 const goalY=intent?.target||s.behavior==='approaching'||s.behavior==='foraging'?s.targetY:s.depthTarget;
 const climbLimit=Math.min(feeding?MAX_TETRA_VERTICAL_SPEED:5,Math.max(1,s.speed)*Math.tan(MAX_TETRA_PITCH));
 const wantedVy=turning||holding?0:clamp((goalY-s.y)*.16,-climbLimit,climbLimit);
 s.vy=ease(s.vy,wantedVy,2,dt);
 s.vx=s.speed*Math.cos(s.yaw);s.x+=s.vx*dt;s.y+=s.vy*dt;
 const wantedPitch=turning?0:holding?Math.sin(s.elapsed*.9)*.025:clamp(Math.atan2(-s.vy,Math.max(1,s.speed)),-MAX_TETRA_PITCH,MAX_TETRA_PITCH);
 // Depth is normalized back-to-front. Commit to a destination, then linger before choosing another.
 s.depthTimer-=dt;
 if(Math.abs(s.z-s.targetZ)<.045&&s.depthTimer<=0){s.targetZ=s.targetZ<.5?.72+random(s)*.2:.08+random(s)*.22;s.depthTimer=8+random(s)*10;}
 const bounds=senses?.depthBounds??[.06,.94];
 if(senses?.depthBounds&&!intent?.target&&s.targetZ>=.06&&s.targetZ<=.94)s.targetZ=s.targetZ<.5?bounds[0]+.08:bounds[1]-.08;
 const targetZ=s.avoidanceRemaining>0?s.avoidanceZ:intent?.target?.z??(feeding?.65:s.targetZ);
 const desiredVz=holding||turning?0:clamp((targetZ-s.z)*(feeding?.9:.28),-s.speed*.65/180,s.speed*.65/180);
 s.vz=ease(s.vz,desiredVz,1.6,dt);s.z=clamp(s.z+s.vz*dt,bounds[0],bounds[1]);
 const depthAngle=turning?0:Math.atan2(-s.vz*180,Math.max(2,s.speed))*s.direction;
 s.depthHeading+=clamp(depthAngle-s.depthHeading,-.25*dt,.25*dt);
 s.pitch+=clamp((wantedPitch-s.pitch)*(1-Math.exp(-dt*2)),-.25*dt,.25*dt);
}
export function tetraBehaviorLabel(s:TetraSwim){if(s.brain.intent.kind==='rest')return 'Resting';if(s.brain.intent.kind==='school')return 'Following the school';if(s.brain.intent.kind==='space')return 'Making space';if(s.browsing)return s.behavior==='inspecting'?'Picking near the planting':'Browsing a feeding patch';return {cruising:'Exploring',burst:'Short swimming burst',gliding:'Gliding',approaching:'Approaching a leaf',inspecting:'Inspecting the planting',foraging:'Looking for food'}[s.behavior];}



/** A short underwater startle, with refractory time so repeated taps cannot trap the school. */
export function startleTetra(s:TetraSwim){
 if(s.startleCooldown>0)return false;
 s.startleRemaining=.16+random(s)*.12;s.startleCooldown=2+random(s);
 s.behavior='burst';s.remaining=.65+random(s)*.5;s.cruiseSpeed=32+random(s)*14;
 s.brain.decisionIn=0;return true;
}
