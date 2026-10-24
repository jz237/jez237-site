import {AI_DIFFICULTIES} from './ai-difficulty';
import {clamp,wrap,DEFINITIONS} from './rules';
import {longWay} from './damage-handling';
import type {ArenaLayout} from './derby-arena';
import type {DriverCar,DriverMemory} from './driving-brain';
import type {AIInput as Input} from './ai-input';

export type DerbyManeuver={kind:'back out'|'run up';x:number;z:number;startX:number;startZ:number;time:number;slow:number;charge?:boolean};
/** Offline derby cars (car.charge) take a run at it: stuck slow against the target, they reverse straight away to CHARGE.room
 * of run-up, then come back flat out once lined up instead of easing in. */
export const CHARGE={close:9,slow:5,room:18,time:5,aim:.4,speed:40,minRun:4,cooldown:3.5} as const;
/** Late-derby frenzy (offline): with FRENZY.alive or fewer cars left running, the drivers go FRENZY.factor times harder: faster
 * between hits and back for another charge sooner. */
export const FRENZY={alive:4,factor:1.25} as const;
/** Hold the pin (offline charge cars): nose-in, within PIN_HOLD.close m of a target that is being pinned (pinTime>0) and
 * pointed within PIN_HOLD.aim radians of it, keep the throttle down for up to PIN_HOLD.time seconds instead of backing off.
 * `held` is the hold so far: 0 not holding (starts only on a pinned target), negative spent until the target is free again. */
export const PIN_HOLD={time:2.5,aim:.6,close:7} as const;
export const holdingPin=(pinTime:number|undefined,held:number,angle:number,gap:number)=>(held>0||held===0&&(pinTime??0)>0)&&held<PIN_HOLD.time&&Math.abs(angle)<PIN_HOLD.aim&&gap<PIN_HOLD.close;
/** Rock free (offline charge cars): pinned PIN_ESCAPE.after seconds (past the point the pin starts crushing), the driver rocks the
 * car, full reverse then full throttle on opposite locks, swapping every PIN_ESCAPE.swing seconds, and keeps at it until the car
 * is free (pinTime back to 0), so easing the pressure for a moment does not stop the wriggling. */
export const PIN_ESCAPE={after:1.2,swing:.7} as const;
export const rocking=(pinTime:number|undefined,already:boolean)=>{const t=pinTime??0;return t>=PIN_ESCAPE.after||already&&t>0;};
export function rockInput(rocked:number,carId:number):Input{
  const back=Math.floor(Math.max(0,rocked)/PIN_ESCAPE.swing)%2===0,lock=carId%2?1:-1;
  return{throttle:back?-1:1,steer:back?lock:-lock,brake:0,handbrake:false};
}
/** The hold after a step that did not hold: spent (-1) while the target is still pinned after one, otherwise reset to 0. */
export const pinHoldAfter=(pinTime:number|undefined,held:number)=>held!==0&&(pinTime??0)>0?-1:0;
export const frenzyFactor=(alive:number)=>Number.isFinite(alive)&&alive>=2&&alive<=FRENZY.alive?FRENZY.factor:1;
/** Hunt the leader (offline scored derbies): the car leading on points weighs HUNT.bonus more as a target to every other driver, so
 * a lead has to be defended. A leader counts once ahead by HUNT.margin points or more, with HUNT.field or more cars running (two
 * cars left are already after each other). */
export const HUNT={bonus:8,margin:1,field:3} as const;
export function pointsLeader(points:readonly {id:number;points:number;running:boolean}[]){
  const live=points.filter(p=>p.running&&Number.isFinite(p.points)).sort((a,b)=>b.points-a.points);
  return live.length>=HUNT.field&&live[0].points-live[1].points>=HUNT.margin?live[0].id:-1;
}
const dist=(a:{x:number;z:number},b:{x:number;z:number})=>Math.hypot(a.x-b.x,a.z-b.z);

/** Conservative swept-car clearance. Cars and wrecks matter when backing out,
 * even though the scenery probes deliberately exclude vehicle colliders. */
export function derbyTrafficClearance(car:DriverCar,cars:DriverCar[],x:number,z:number){
 const footprint=(c:DriverCar)=>c.kind?{length:DEFINITIONS[c.kind].halfLength+.15,width:DEFINITIONS[c.kind].halfWidth+.10}:{length:2.8,width:1};
 const self=footprint(car);let clear=30;
 for(const other of cars){
  if(other.id===car.id)continue;
  const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
  const ahead=dx*x+dz*z,side=Math.abs(dx*z-dz*x);
  const shape=footprint(other);
  const halfAlong=Math.abs(other.forward.x*x+other.forward.z*z)*shape.length+Math.abs(other.right.x*x+other.right.z*z)*shape.width;
  const halfAcross=Math.abs(other.forward.x*z-other.forward.z*x)*shape.length+Math.abs(other.right.x*z-other.right.z*x)*shape.width;
  if(ahead>0&&side<halfAcross+self.width+.15)clear=Math.min(clear,Math.max(0,ahead-halfAlong-self.length));
 }
 return clear;
}

function maneuver(car:DriverCar,cars:DriverCar[],m:DriverMemory,arena:ArenaLayout|null,reverse:boolean):DerbyManeuver{
 const yaw=Math.atan2(car.forward.x,car.forward.z)+(reverse?Math.PI:0),preferred=(car.id+m.attempts)%2?1:-1;
 let best=-Infinity,goal={x:car.current.x,z:car.current.z};
 for(const turn of [0,preferred*.35,-preferred*.35,preferred*.7,-preferred*.7]){
  const x=Math.sin(yaw+turn),z=Math.cos(yaw+turn),rx=car.current.x-(arena?.x??car.current.x),rz=car.current.z-(arena?.z??car.current.z);
  const projection=rx*x+rz*z,edge=arena?-projection+Math.sqrt(Math.max(0,projection*projection+(arena.radius-6)**2-rx*rx-rz*rz)):Infinity;
  const traffic=derbyTrafficClearance(car,cars,x,z),staticClear=reverse?m.clear.rear:m.clear.front;
  const room=Math.max(0,Math.min(16,edge,traffic,staticClear+Math.abs(turn)*5));
  const score=room-Math.abs(turn)*2+(turn*preferred>0?.2:0);
  if(score>best){best=score;goal={x:car.current.x+x*Math.max(3,room),z:car.current.z+z*Math.max(3,room)};}
 }
 return{kind:reverse?'back out':'run up',...goal,startX:car.current.x,startZ:car.current.z,time:0,slow:0};
}

/** Derby-specific commitment and recovery. Make actual room after a low-speed
 * contact, then rebuild momentum before selecting the next attack. */
/** Shielding (offline cars with a weak spot): a rival within SHIELD.range, closing faster than SHIELD.closing and pointed at
 * this car (within SHIELD.aim) while the weak spot faces it (within SHIELD.facing) makes the driver turn the weak spot away. */
export const SHIELD={range:14,closing:4,aim:.85,facing:.5,steer:1,throttle:.6} as const;
export function weakSpotThreat(car:DriverCar,cars:DriverCar[]){
  const w=car.weakSpot;if(!w)return null;const wx=w.x-car.current.x,wz=w.z-car.current.z,wl=Math.hypot(wx,wz);if(wl<.1)return null;
  for(const o of cars){
    if(o.id===car.id||o.health<=0)continue;const ax=o.current.x-car.current.x,az=o.current.z-car.current.z,d=Math.hypot(ax,az);if(d>SHIELD.range||d<.5)continue;
    const closing=-((o.velocity.x-car.velocity.x)*ax+(o.velocity.z-car.velocity.z)*az)/d,pointed=-(o.forward.x*ax+o.forward.z*az)/d,facing=(wx*ax+wz*az)/(wl*d);
    if(closing>SHIELD.closing&&pointed>SHIELD.aim&&facing>SHIELD.facing)return o;
  }
  return null;
}
/** Reverse ramming (protectFront cars): in range of the target they back into it at up to REVERSE_RAM.speed m/s. */
export const REVERSE_RAM={range:30,speed:9} as const;
export function driveDerby(car:DriverCar,cars:DriverCar[],m:DriverMemory,arena:ArenaLayout|null,dt:number,difficulty:{derbyPace:number;interceptLead:number;frenzy?:number;leader?:number}=AI_DIFFICULTIES.amateur,targetId?:number,attackPoint?:{x:number;z:number}):Input{
 const yaw=Math.atan2(car.forward.x,car.forward.z);
 let target=cars.find(c=>c.id===m.target&&c.health>0&&(targetId===undefined||c.id===targetId));
 if(!target||m.commit<=0){
  let best=-Infinity;
  for(const other of cars){
   if(other.id===car.id||other.health<=0||(targetId!==undefined&&other.id!==targetId))continue;
   const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z,d=Math.hypot(dx,dz);
   const angle=Math.abs(wrap(Math.atan2(dx,dz)-yaw));
   const flank=Math.abs((dx*other.right.x+dz*other.right.z)/Math.max(1,d));
   let crowded=0;for(const c of cars)if(c.id!==car.id&&c.id!==other.id&&dist(c.current,other.current)<7)crowded++;
   const score=32-Math.abs(d-19)*.58-angle*9+flank*7+(100-other.health)*.045+(other.id===m.target?5:0)-crowded*3+(other.id===difficulty.leader?HUNT.bonus:0);
   if(score>best){best=score;target=other;}
  }
  m.target=target?.id??-1;m.commit=2.2+(car.id%4)*.35;
 }
 if(!target)return{throttle:0,steer:0,brake:1,handbrake:false};
 let nearest=Infinity;for(const c of cars)if(c.id!==car.id)nearest=Math.min(nearest,dist(c.current,car.current));
 const stalled=Math.abs(car.speed)<.9||(nearest<7&&Math.abs(car.speed)<3.2);
 m.stalled=stalled?m.stalled+dt:Math.max(0,m.stalled-dt*2);
 // Pinned: rock the car to wriggle free (offline charge).
 if(car.charge){if(rocking(car.pinTime,(m.rock??-1)>=0)){m.rock=(m.rock??-1)<0?0:m.rock!+dt;m.derby=undefined;m.stalled=0;m.phase='rock free';const rock=rockInput(m.rock,car.id);m.steer=rock.steer;return rock;}m.rock=-1;}
 // Hold the pin: pressed into a target that is pinned against a wall or another car, keep shoving (offline charge).
 if(car.charge&&(!m.derby||m.derby.charge)){const angle=wrap(Math.atan2(target.current.x-car.current.x,target.current.z-car.current.z)-yaw);
  if(holdingPin(target.pinTime,m.pinHold??0,angle,dist(car.current,target.current))){m.pinHold=(m.pinHold??0)+dt;m.derby=undefined;m.stalled=0;m.steer+=clamp(clamp(angle*1.75,-1,1)-m.steer,-dt*4.5,dt*4.5);m.phase='pin';return{throttle:1,steer:m.steer,brake:0,handbrake:false};}
  m.pinHold=pinHoldAfter(target.pinTime,m.pinHold??0);}
 if(!m.derby&&m.stalled>1.15){
  const rear=Math.min(m.clear.rear,derbyTrafficClearance(car,cars,-car.forward.x,-car.forward.z));
  m.attempts++;m.derby=maneuver(car,cars,m,arena,rear>1.6);m.stalled=0;
 }
 // Shield the broken corner: a rival closing fast and pointed at it gets a stronger part of the car instead.
 if(car.weakSpot&&!m.derby){const threat=weakSpotThreat(car,cars);if(threat){
  const wx=car.weakSpot.x-car.current.x,wz=car.weakSpot.z-car.current.z,ax=threat.current.x-car.current.x,az=threat.current.z-car.current.z;
  const cross=wx*az-wz*ax,steer=clamp(-Math.sign(cross||1)*SHIELD.steer,-1,1);m.steer+=clamp(steer-m.steer,-dt*4,dt*4);m.phase='shield';
  return{throttle:SHIELD.throttle,steer:m.steer,brake:0,handbrake:false};}}
 // A wrecked front: save the engine and ram in reverse, rear first (a real derby habit), when the target is in range.
 const aimAt=target.weakSpot??target.current;
 if(car.protectFront&&!m.derby&&dist(car.current,aimAt)<REVERSE_RAM.range){
  const angle=wrap(Math.atan2(car.current.x-aimAt.x,car.current.z-aimAt.z)-yaw);
  const steer=clamp(-angle*1.6,-.9,.9);m.steer+=clamp(steer-m.steer,-dt*3,dt*3);m.phase='reverse ram';
  return{throttle:car.speed>-REVERSE_RAM.speed?-1:0,steer:m.steer,brake:0,handbrake:false};
 }
 m.chargeCool=Math.max(0,(m.chargeCool??0)-dt);
 // Stuck nose-to-nose at low speed: back straight off for a run-up (offline charge).
 if(car.charge&&!m.derby&&targetId===undefined&&m.chargeCool===0&&dist(car.current,target.current)<CHARGE.close&&Math.abs(car.speed)<CHARGE.slow){
  const dx=car.current.x-target.current.x,dz=car.current.z-target.current.z,d=Math.max(.1,Math.hypot(dx,dz));
  let x=target.current.x+dx/d*CHARGE.room,z=target.current.z+dz/d*CHARGE.room;
  if(arena){const r=Math.hypot(x-arena.x,z-arena.z),limit=arena.radius-8;if(r>limit){x=arena.x+(x-arena.x)*limit/r;z=arena.z+(z-arena.z)*limit/r;}}
  m.derby={kind:'back out',x,z,startX:car.current.x,startZ:car.current.z,time:0,slow:0,charge:true};m.chargeCool=CHARGE.cooldown/(difficulty.frenzy??1);m.stalled=0;
 }
 let tx=0,tz=0,desired=19*difficulty.derbyPace;
 if(m.derby){
  const plan=m.derby;plan.time+=dt;plan.slow=Math.abs(car.speed)<.65?plan.slow+dt:0;
  const reached=dist(car.current,plan)<2.8,travel=Math.hypot(car.current.x-plan.startX,car.current.z-plan.startZ);
  if(plan.kind==='back out'){
   const rear=Math.min(m.clear.rear,derbyTrafficClearance(car,cars,-car.forward.x,-car.forward.z));
   if(reached||travel>(plan.charge?CHARGE.room:12)||plan.time>(plan.charge?CHARGE.time:3.7)||plan.slow>1.5||rear<1.4){m.derby=plan.charge?undefined:maneuver(car,cars,m,arena,false);m.stalled=0;if(plan.charge)m.commit=Math.max(m.commit,2.5);}
   else{
    const angle=wrap(Math.atan2(car.current.x-plan.x,car.current.z-plan.z)-yaw);
    const steer=clamp(-angle*1.6,-.8,.8);m.steer+=clamp(steer-m.steer,-dt*3,dt*3);m.phase='back out';
    return{throttle:car.speed> -6.5?-.85:0,steer:m.steer,brake:car.speed< -7?.3:0,handbrake:false};
   }
  }
  // A finished charge back-out clears the plan: go straight on to the charge below.
  const run=m.derby;
  if(run&&run.kind==='run up'&&(targetId!==undefined||dist(car.current,run)<3||run.time>3.2||run.slow>1.25)){
   m.derby=undefined;m.commit=0;m.stalled=0;
  }else if(run){tx=run.x;tz=run.z;desired=11;m.phase='run up';}
 }
 if(!m.derby){
  const d=dist(car.current,target.current),lead=clamp(d/(Math.abs(car.speed)+12),.12,.85)*difficulty.interceptLead;
  // Go for the rival's broken corner when it has one (offline): finish off what is already crushed.
  const aim=target.weakSpot??target.current;
  tx=aim.x+target.velocity.x*lead;tz=aim.z+target.velocity.z*lead;if(attackPoint){tx=attackPoint.x;tz=attackPoint.z;}m.phase='intercept';
 }
 if(arena){
 const radius=Math.hypot(tx-arena.x,tz-arena.z),limit=arena.radius-8;
 if(radius>limit){tx=arena.x+(tx-arena.x)*limit/radius;tz=arena.z+(tz-arena.z)*limit/radius;}
 if(Math.hypot(car.current.x-arena.x,car.current.z-arena.z)>arena.radius-7){tx=arena.x;tz=arena.z;desired=11;m.phase='re-enter';}
 }
 const angle=wrap(Math.atan2(tx-car.current.x,tz-car.current.z)-yaw);
 let steer=clamp(angle*1.75,-1,1);desired=Math.min(desired,clamp(23-Math.abs(angle)*12,4.5,23));
 // Lined up with room to run: flat out (offline charge).
 if(car.charge&&!m.derby&&Math.abs(angle)<CHARGE.aim&&dist(car.current,target.current)>CHARGE.minRun){desired=CHARGE.speed;m.phase='charge';}
 // A short lock toward a target behind it: go the long way round on the good lock (offline cars carry steerSkew).
 {const way=longWay(angle,car.steerSkew??0);if(way!==null){steer=way;m.phase='long way';}}
 for(const other of cars){
  if(other.id===car.id||(!m.derby&&other.id===target.id))continue;
  const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
  const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
  if(ahead<0||ahead>5+Math.abs(car.speed)*.8||Math.abs(side)>3.4)continue;
  if(targetId!==undefined&&ahead<7&&Math.abs(side)<2)desired=Math.min(desired,Math.max(3,Math.abs(other.speed)-1));
  const strength=(1-ahead/(6+Math.abs(car.speed)*.8))*(1-Math.abs(side)/4);
  steer+=(side===0?(car.id%2?1:-1):-Math.sign(side))*strength*1.2;
 }
 if(m.clear.front<Math.max(5,Math.abs(car.speed)*.8)){
  steer+=(m.clear.left>m.clear.right?-1:1)*.85;desired=Math.min(desired,Math.max(2,m.clear.front*.8));m.phase='avoid barrier';
 }
 m.steer+=clamp(clamp(steer,-1,1)-m.steer,-dt*4.5,dt*4.5);
 return{throttle:clamp((desired-car.speed)*.4,0,1),steer:m.steer,brake:clamp((car.speed-desired)/5,0,1),handbrake:false};
}
