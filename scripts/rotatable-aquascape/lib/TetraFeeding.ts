import type {TetraSwim} from './TetraSwimming.ts';
import type {FishPoint,FishSenses} from './FishBrain.ts';
// Expressive aquarium-scale tuning, not measured cardinal-tetra kinematic data.
export const FEEDING_MAX_SPEED=220,FEEDING_MAX_PITCH=.45,FEEDING_TURN_RATE=3.8;
export type FeedingPhase='search'|'notice'|'pursuit'|'coast'|'braking'|'bite'|'pause'|'depart'|'yield'|'recover';
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
const angle=(n:number)=>Math.atan2(Math.sin(n),Math.cos(n));
const ease=(a:number,b:number,rate:number,dt:number)=>a+(b-a)*(1-Math.exp(-rate*dt));
function random(s:TetraSwim){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
/** Short, individually timed pursuit bouts with mouth aiming and braking.
 * Velocity follows the same upright orientation rendered by the model. */
export function swimForFood(s:TetraSwim,dt:number,target:FishPoint|undefined,senses:FishSenses,lowOxygen:boolean){
 if(!target&&s.feedingPhase==='search'&&s.brain.biteIn<=0)return false;
 s.elapsed+=dt;s.sinceTurn+=dt;s.remaining=Math.max(0,s.remaining-dt);
 s.startleRemaining=Math.max(0,s.startleRemaining-dt);s.startleCooldown=Math.max(0,s.startleCooldown-dt);s.avoidanceRemaining=Math.max(0,s.avoidanceRemaining-dt);
 s.feedingTimer-=dt;
 const biting=s.brain.biteIn>0;
 if(!biting&&(s.feedingPhase==='bite'||s.feedingPhase==='pause')){s.feedingPhase='depart';s.feedingTimer=.25+random(s)*.25;}
 const departing=s.feedingPhase==='depart'&&s.feedingTimer>0;
 if(departing)target=undefined;
 if(biting){s.feedingPhase=s.brain.consumedFood!==null?'bite':'pause';s.feedingTarget=null;}
 else if(departing){s.feedingTarget=null;}
 else if(target&&s.feedingTarget!==target.id){s.feedingTarget=target.id;s.feedingPhase='notice';s.feedingTimer=.06+random(s)*.19;s.feedingBurst=150+random(s)*70;}
 else if(!target){s.feedingPhase='recover';s.feedingTarget=null;}
 let yaw=s.yaw+s.depthHeading,desiredYaw=yaw,desiredPitch=0,pace=0,drive=.04,fan=.9;
 let station=false,mouthDx=0,mouthDy=0,mouthDz=0;
 if(target&&!biting){
  s.targetX=target.x;s.targetY=target.y;
  const dx=target.x-s.x,dy=target.y-s.y,dz=((s.avoidanceRemaining>0?s.avoidanceZ:target.z)??s.z)-s.z;
  const depth=dz*180,horizontal=Math.hypot(dx,depth),distance=Math.hypot(horizontal,dy);
  desiredYaw=horizontal>1?Math.atan2(-depth,dx):yaw;
  desiredPitch=clamp(Math.atan2(-dy,Math.max(1,horizontal)),-FEEDING_MAX_PITCH,FEEDING_MAX_PITCH);
  if(s.feedingPhase==='notice'&&s.feedingTimer<=0){s.feedingPhase='pursuit';s.feedingTimer=.18+random(s)*.24;}
  else if(s.feedingTimer<=0&&s.feedingPhase!=='notice'){
   s.feedingPhase=s.feedingPhase==='pursuit'?'coast':'pursuit';
   s.feedingTimer=s.feedingPhase==='pursuit'?.18+random(s)*.24:.10+random(s)*.18;
   if(s.feedingPhase==='pursuit')s.feedingBurst=150+random(s)*70;
  }
  if(s.feedingPhase==='notice'){pace=8;drive=.10;}
  else {
   pace=s.feedingPhase==='coast'?s.feedingBurst*.45:s.feedingBurst;
   drive=s.feedingPhase==='coast'?.12:1.45;fan=s.feedingPhase==='coast'?.45:.28;
   // Begin braking with enough distance to stop at the mouth, including one
   // whole simulation step. Never consume a flake using body-center proximity.
   const brakingDistance=24+s.speed*s.speed/(2*650)+s.speed*dt;
   if(distance<brakingDistance||distance<44){s.feedingPhase='braking';pace=clamp((distance-(s.mouthReach-1))*3.2,3,85);drive=.18;fan=1;}
  }
  const headingError=Math.abs(angle(desiredYaw-yaw));
  if(headingError>.35){pace=Math.min(pace,Math.max(7,s.feedingBurst*Math.pow(Math.max(0,Math.cos(headingError)),3)));fan=1;}
  // Do not pivot endlessly underneath a higher flake. Continue a short rising
  // traverse until there is horizontal room for the next upright approach.
  if(horizontal<25&&Math.abs(dy)>32&&s.feedingPhase!=='notice'){desiredYaw=yaw;pace=Math.max(pace,38);drive=.7;}
  if(distance<40&&s.speed<55&&s.feedingPhase!=='notice'&&s.avoidanceRemaining<=0){
   station=true;s.feedingPhase='braking';fan=1;drive=.10;
   // At mouth range, paired fins can make small sideways/backward adjustments.
   // Hold heading when directly above/below the particle instead of spinning.
   if(horizontal<12)desiredYaw=yaw;
   mouthDx=target.x-(s.x+Math.cos(yaw)*Math.cos(s.pitch)*s.mouthReach);
   mouthDy=target.y-(s.y-Math.sin(s.pitch)*s.mouthReach);
   mouthDz=((target.z??s.z)-s.z)*180+Math.sin(yaw)*Math.cos(s.pitch)*s.mouthReach;
   pace=Math.min(18,Math.hypot(mouthDx,mouthDy,mouthDz)*2);
  }
  if(s.avoidanceRemaining>0)pace=Math.min(pace,65);
 }else if(!biting){
  if(departing){pace=55;drive=.35;fan=.45;}else desiredYaw=Math.cos(yaw)>=0?0:Math.PI;
  s.behavior='gliding';s.remaining=.45;
 }
 // Predict full three-dimensional approaches, including another feeding fish.
 // Existing solid contacts and final pair separation still run after movement.
 const fx=Math.cos(yaw)*Math.cos(s.pitch),fy=-Math.sin(s.pitch),fz=-Math.sin(yaw)*Math.cos(s.pitch);
 let awayX=0,awayY=0,awayZ=0,crowded=false;
 for(const other of senses.neighbors){
  const dx=other.x-s.x,dy=other.y-s.y,dz=((other.z??s.z)-s.z)*180;
  const distance=Math.hypot(dx,dy,dz),clearance=(other.radius??25)+25;
  if(distance>clearance+s.speed*.35+35)continue;
  if(distance<clearance+22){const weight=(clearance+22-distance)/Math.max(1,distance);awayX-=dx*weight;awayY-=dy*weight;awayZ-=dz*weight;}
  const rx=fx*s.speed-(other.vx??0),ry=fy*s.speed-(other.vy??0),rz=fz*s.speed-(other.vz??0)*180;
  const closest=clamp((dx*rx+dy*ry+dz*rz)/Math.max(1,rx*rx+ry*ry+rz*rz),0,.35);
  if(dx*fx+dy*fy+dz*fz>0&&Math.hypot(dx-rx*closest,dy-ry*closest,dz-rz*closest)<clearance+8){
   pace=Math.min(pace,Math.max(0,(distance-clearance-6)*2));fan=1;drive=.12;
   const side=dx*fz-dz*fx;desiredYaw+=side>=0?.45:-.45;
   if(distance<clearance+12)crowded=true;
  }
 }
 if(crowded&&!biting){
  station=false;s.feedingPhase='yield';
  if(Math.hypot(awayX,awayY,awayZ)<1){awayX=-Math.sin(yaw);awayZ=-Math.cos(yaw);awayY=s.seed%2?12:-12;}
  desiredYaw=Math.atan2(-awayZ,awayX);desiredPitch=clamp(Math.atan2(-awayY,Math.max(1,Math.hypot(awayX,awayZ))),-.4,.4);
  pace=55*Math.max(0,Math.cos(angle(desiredYaw-yaw)));drive=.55;fan=1;
 }
 if(s.startleRemaining>0){pace=Math.max(pace,130);drive=1.5;desiredYaw=yaw;fan=.7;}
 if(lowOxygen){pace=Math.min(pace,11);drive=Math.min(drive,.55);}
 const turn=clamp(angle(desiredYaw-yaw),-FEEDING_TURN_RATE*dt,FEEDING_TURN_RATE*dt);yaw+=turn;
 // Keep the legacy base yaw inside 0..pi, storing front/back orientation in the
 // depth component. A 2pi representation wrap never changes the rendered pose.
 while(yaw< -Math.PI/2)yaw+=Math.PI*2;while(yaw>Math.PI*1.5)yaw-=Math.PI*2;
 s.yaw=clamp(yaw,0,Math.PI);s.depthHeading=yaw-s.yaw;s.direction=Math.cos(yaw)>=0?1:-1;
 s.pitch+=clamp(desiredPitch-s.pitch,-1.25*dt,1.25*dt);
 s.speed+=clamp(pace-s.speed,-650*dt,900*dt);s.speed=clamp(s.speed,0,FEEDING_MAX_SPEED);
 s.effort=ease(s.effort,drive,15,dt);s.pectoralEffort=ease(s.pectoralEffort,fan,12,dt);
 const horizontalSpeed=s.speed*Math.cos(s.pitch);
 s.vx=horizontalSpeed*Math.cos(yaw);s.vy=-s.speed*Math.sin(s.pitch);s.vz=-horizontalSpeed*Math.sin(yaw)/180;
 if(station&&s.startleRemaining<=0){
  const distance=Math.max(1,Math.hypot(mouthDx,mouthDy,mouthDz));
  s.vx=mouthDx/distance*s.speed;s.vy=mouthDy/distance*s.speed;s.vz=mouthDz/distance*s.speed/180;
 }
 const bounds=senses.depthBounds??[.06,.94];
 s.x=clamp(s.x+s.vx*dt,650,1230);s.y=clamp(s.y+s.vy*dt,242,515);s.z=clamp(s.z+s.vz*dt,bounds[0],bounds[1]);
 s.behavior=target||biting?'foraging':'gliding';s.wasFeeding=!!target;s.pickRemaining=0;s.browsing=false;
 if(s.feedingPhase==='recover'&&s.speed<2&&Math.abs(s.depthHeading)<.025&&Math.abs(s.pitch)<.025){s.feedingPhase='search';s.depthHeading=0;s.remaining=.4;}
 return true;
}
