import * as T from 'three';
import type {BodySphere} from './GrazerCollision.ts';
import envelope from './AngelfishEnvelope.json' with {type:'json'};

export type AngelFood={id:number;position:T.Vector3};
export type AngelState={id:number;position:T.Vector3;previous:T.Vector3;goal:T.Vector3;yaw:number;pitch:number;speed:number;effort:number;seed:number;timer:number;hover:number;bite:number;startle:number;hunger:number;target:number|null;stalled:number;lastDistance:number;phase:number;size:number;behavior:string;consumed:number|null;detour:number;detourYaw:number;yawRate:number;pitchRate:number;blocked:number;social:T.Vector3;recovery:T.Vector3;retreat:number};
export type AngelSenses={food:AngelFood[];other:{position:T.Vector3;radius:number}[];daylight:number;companion?:T.Vector3;clear:(position:T.Vector3,yaw:number,pitch:number,size:number)=>boolean};
const clamp=T.MathUtils.clamp;
function random(s:AngelState){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
export function createAngel(id:number):AngelState{return {id,position:new T.Vector3(id?2.5:-2.2,3.1+id*.6,1.55),previous:new T.Vector3(),goal:new T.Vector3(id?-2:2,3.4,1.5),yaw:id?Math.PI:0,pitch:0,speed:0,effort:.2,seed:237+id*7349,timer:8,hover:0,bite:0,startle:0,hunger:.65-id*.12,target:null,stalled:0,lastDistance:Infinity,phase:id*3.71,size:id?.58:.64,behavior:'Exploring the planting',consumed:null,detour:0,detourYaw:0,yawRate:0,pitchRate:0,blocked:0,social:new T.Vector3(),recovery:new T.Vector3(),retreat:0};}
export function angelForward(yaw:number,pitch:number){return new T.Vector3(Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.sin(yaw)*Math.cos(pitch));}
/** Overlapping volumes enclose torso, median fins, tail and pelvic streamers,
 * including the GPU wave's displacement. They rotate with the upright animal. */
export function angelBody(position:T.Vector3,yaw:number,pitch:number,size:number):BodySphere[]{
 const forward=angelForward(yaw,pitch),up=new T.Vector3(-Math.cos(yaw)*Math.sin(pitch),Math.cos(pitch),Math.sin(yaw)*Math.sin(pitch));
 const lateral=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw));
 return envelope.map(([x,y,z,r])=>({center:position.clone().addScaledVector(forward,x*size).addScaledVector(up,y*size).addScaledVector(lateral,z*size),radius:r*size}));
}
function newGoal(s:AngelState,senses:AngelSenses){
 for(let i=0;i<9;i++){
  const rear=s.id===0&&i<4;
  const p=rear?new T.Vector3(1.7+random(s)*.95,3.55+random(s)*.48,-.75+random(s)*.55):s.id===1&&senses.companion?senses.companion.clone().add(new T.Vector3((random(s)-.5)*2.8,(random(s)-.5)*.65,(random(s)-.5)*1.1)):new T.Vector3((random(s)-.5)*7.5,1.85+random(s)*2.3,(random(s)-.5)*3.5);
  const yaw=Math.atan2(-(p.z-s.position.z),p.x-s.position.x);
  if(senses.clear(p,yaw,0,s.size)){s.goal.copy(p);s.timer=Math.min(28,8+s.position.distanceTo(p)/.22+random(s)*4);return;}
 }
 // Retain an open-water route when dense planting rejects a sampled destination.
 s.goal.set(-s.position.x,3+random(s)*.8,s.position.z>0?1.62:-1.62);s.timer=4;
}
/** Qualitative angelfish behavior, not measured species-specific kinematics.
 * Individual exploration and hovering replace tetra school alignment. */
export function advanceAngel(s:AngelState,dt:number,senses:AngelSenses){
 s.consumed=null;if(dt<=0)return;s.previous.copy(s.position);s.phase+=dt;
 s.hunger=clamp(s.hunger+dt*.001,0,1);s.timer-=dt;s.bite=Math.max(0,s.bite-dt);s.hover=Math.max(0,s.hover-dt);s.startle=Math.max(0,s.startle-dt);
 // A blocked fish first sculls out along one committed clear direction. It
 // does not alternate between a rejected turn and a fresh turn every frame.
 if(s.retreat>0){
  s.retreat=Math.max(0,s.retreat-dt);s.speed=0;s.yawRate*=Math.exp(-dt*4);s.pitchRate*=Math.exp(-dt*4);
  const p=s.position.clone().addScaledVector(s.recovery,dt*.18);
  if(senses.clear(p,s.yaw,s.pitch,s.size))s.position.copy(p);else s.retreat=0;
  s.effort=.11;s.behavior='Sculling clear of an obstacle';
  if(s.retreat===0){s.timer=0;s.detour=0;s.social.multiplyScalar(.3);}
  return;
 }
 let food=senses.food.find(f=>f.id===s.target);
 if(!food){s.target=null;s.stalled=0;s.lastDistance=Infinity;}
 if(!food&&s.hunger>.16&&s.bite===0&&senses.daylight>.4){
  let best=Infinity;
  for(const f of senses.food){if(f.position.y>4.35||f.position.y<1.7)continue;const d=f.position.distanceTo(s.position);let score=d;
   for(const n of senses.other)if(n.radius>.45&&n.position.distanceTo(f.position)<d)score+=.9;
   if(score<best&&d<4.8){best=score;food=f;}
  }
  if(food){s.target=food.id;s.hover=0;}
 }
 const desired=food?food.position.clone():s.goal.clone();
 if(!food&&(s.timer<=0||s.position.distanceTo(s.goal)<.4)){if(s.hover===0&&random(s)<.44)s.hover=.8+random(s)*2.1;newGoal(s,senses);}
 let pace=senses.daylight<.4?.10:.30+.075*Math.sin(s.phase*.19+s.id)+.055*Math.sin(s.phase*.31+s.id*3)**2;
 s.behavior=senses.daylight<.4?'Resting in dim light':s.hover>0?'Hovering and inspecting':'Cruising between plants';
 if(food){
  const d=s.position.distanceTo(food.position);s.stalled=d<s.lastDistance-.02?0:s.stalled+dt;if(d<s.lastDistance-.02)s.lastDistance=d;
  if(s.stalled>2.4){s.target=null;s.bite=.8;s.stalled=0;newGoal(s,senses);}
  pace=d>.65?(Math.sin(s.phase*8+s.id)>.2?1.25:.64):clamp((d-.43)*3,.045,.55);
  s.behavior=d>.7?'Approaching a falling flake':'Braking for a precise bite';
  const mouth=s.position.clone().addScaledVector(angelForward(s.yaw,s.pitch),.78*s.size);
  if(mouth.distanceTo(food.position)<.11&&s.speed<.7){s.consumed=food.id;s.target=null;s.hunger=Math.max(0,s.hunger-.14);s.bite=.75+random(s)*.75;s.hover=.3;newGoal(s,senses);s.behavior='Taking a bite';}
 }
 if(s.hover>0||s.bite>.8)pace=.035;
 if(s.startle>0){pace=1.5;s.behavior='A short startle dart';}
 const verticalError=desired.y-s.position.y,delta=desired.sub(s.position).normalize();
 s.detour=Math.max(0,s.detour-dt);if(s.detour>0){delta.copy(angelForward(s.detourYaw,0));pace=Math.min(pace,.22);}
 // A loose companion preference, not synchronized schooling. Filter the
 // social steering so passing tetras do not make the head twitch each frame.
 const social=new T.Vector3();
 for(const n of senses.other){const away=s.position.clone().sub(n.position),d=away.length(),mate=n.position===senses.companion,range=mate?1.35:1.12+n.radius;if(d<range&&d>.0001){social.addScaledVector(away,(mate?2.0:2.8)*(range-d)/d);if(d<.45+n.radius)pace=Math.min(pace,.16);}}
 if(senses.companion&&!food){const toward=senses.companion.clone().sub(s.position),d=toward.length();if(d>1.65){social.addScaledVector(toward,Math.min(1.1,(d-1.65)*.6)/d);if(d>2.3)s.hover=0;}}
 if(senses.companion&&s.position.distanceTo(senses.companion)<1.8)social.add(new T.Vector3(0,s.id?-.06:.06,s.id?.38:-.7));
 social.clampLength(0,1.8);s.social.lerp(social,1-Math.exp(-dt*2));delta.add(s.social);
 let yaw=Math.atan2(-delta.z,delta.x),pitch=clamp(Math.atan2(delta.y,Math.hypot(delta.x,delta.z)),-.26,.26);
 const error=Math.atan2(Math.sin(yaw-s.yaw),Math.cos(yaw-s.yaw));
 const turnLimit=food||s.startle>0?1.6:.65;
 const desiredTurn=clamp(error*1.7,-turnLimit,turnLimit),desiredPitch=clamp((pitch-s.pitch)*1.8,-.30,.30);
 s.yawRate=T.MathUtils.lerp(s.yawRate,desiredTurn,1-Math.exp(-dt*3));s.pitchRate=T.MathUtils.lerp(s.pitchRate,desiredPitch,1-Math.exp(-dt*3));
 yaw=s.yaw+s.yawRate*dt;pitch=clamp(s.pitch+s.pitchRate*dt,-.26,.26);
 pace*=Math.max(.12,Math.cos(error));s.speed+=clamp(pace-s.speed,-dt*(food?3.5:.65),dt*(food||s.startle?4.5:.38));
 const to=s.position.clone().addScaledVector(angelForward(yaw,pitch),s.speed*dt);
 // Fin sculling lets a deep-bodied angelfish gain/lose height without pointing
 // its whole body steeply upward or downward.
 if(s.hover===0)to.y+=clamp(verticalError*.3,-.16,.16)*dt;
 // Test intermediate translation AND orientation so bursts cannot tunnel.
 const steps=Math.max(1,Math.ceil(s.position.distanceTo(to)/.035),Math.ceil(Math.abs(yaw-s.yaw)/.08));let valid=true;
 for(let i=1;i<=steps;i++){const t=i/steps;if(!senses.clear(s.position.clone().lerp(to,t),s.yaw+(yaw-s.yaw)*t,s.pitch+(pitch-s.pitch)*t,s.size)){valid=false;break;}}
 if(valid){s.position.copy(to);s.yaw=yaw;s.pitch=pitch;s.blocked=Math.max(0,s.blocked-dt*2);}else{
  s.speed*=Math.exp(-dt*5);s.stalled+=dt;s.blocked+=dt;s.behavior='Turning around an obstacle';
  // Commit to one recovery for a whole interval. Do not flip the yaw left
  // and right when successive contact checks reject neighboring poses.
  s.yawRate*=Math.exp(-dt*5);s.pitchRate*=Math.exp(-dt*5);
  if(s.detour<=0){
   s.detour=2;s.detourYaw=s.yaw;s.recovery.set(0,0,0);
   const forward=angelForward(s.yaw,s.pitch);
   const directions=[forward.clone().negate(),new T.Vector3(0,0,1),new T.Vector3(0,0,-1),new T.Vector3(0,1,0),new T.Vector3(0,-1,0)];
   directions.push(new T.Vector3(1,0,0),new T.Vector3(-1,0,0));
   let best=0;
   for(const direction of directions){let length=0;
    for(let i=1;i<=3;i++){if(!senses.clear(s.position.clone().addScaledVector(direction,i*.14),s.yaw,s.pitch,s.size))break;length=i*.14;}
    // Prefer retreating from the obstruction, with a slight preference for
    // open front water rather than pushing farther into the dense planting.
    const end=s.position.clone().addScaledVector(direction,length);let turningRoom=0;
    if(length>.14)for(const angle of [-.9,.9])if(senses.clear(end,s.yaw+angle,0,s.size))turningRoom++;
    const score=length+turningRoom*.16-(length>.2?.02*direction.dot(forward):0);
    if(length>.07&&score>best){best=score;s.recovery.copy(direction);s.retreat=Math.min(2,length/.18);if(turningRoom===2&&length>=.28)break;}
   }
   s.timer=0;
  }

 }
 s.effort=clamp(.055+s.speed*.28+(food&&s.speed>.55?.35:0)+(s.startle>0?.35:0),.045,1);
}
