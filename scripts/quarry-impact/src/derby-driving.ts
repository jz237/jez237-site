import {AI_DIFFICULTIES} from './ai-difficulty';
import {clamp,wrap,DEFINITIONS} from './rules';
import type {ArenaLayout} from './derby-arena';
import type {DriverCar,DriverMemory} from './driving-brain';
import type {Input} from './vehicle';

export type DerbyManeuver={kind:'back out'|'run up';x:number;z:number;startX:number;startZ:number;time:number;slow:number};
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

function maneuver(car:DriverCar,cars:DriverCar[],m:DriverMemory,arena:ArenaLayout,reverse:boolean):DerbyManeuver{
 const yaw=Math.atan2(car.forward.x,car.forward.z)+(reverse?Math.PI:0),preferred=(car.id+m.attempts)%2?1:-1;
 let best=-Infinity,goal={x:car.current.x,z:car.current.z};
 for(const turn of [0,preferred*.35,-preferred*.35,preferred*.7,-preferred*.7]){
  const x=Math.sin(yaw+turn),z=Math.cos(yaw+turn),rx=car.current.x-arena.x,rz=car.current.z-arena.z;
  const projection=rx*x+rz*z,edge=-projection+Math.sqrt(Math.max(0,projection*projection+(arena.radius-6)**2-rx*rx-rz*rz));
  const traffic=derbyTrafficClearance(car,cars,x,z),staticClear=reverse?m.clear.rear:m.clear.front;
  const room=Math.max(0,Math.min(16,edge,traffic,staticClear+Math.abs(turn)*5));
  const score=room-Math.abs(turn)*2+(turn*preferred>0?.2:0);
  if(score>best){best=score;goal={x:car.current.x+x*Math.max(3,room),z:car.current.z+z*Math.max(3,room)};}
 }
 return{kind:reverse?'back out':'run up',...goal,startX:car.current.x,startZ:car.current.z,time:0,slow:0};
}

/** Derby-specific commitment and recovery. Make actual room after a low-speed
 * contact, then rebuild momentum before selecting the next attack. */
export function driveDerby(car:DriverCar,cars:DriverCar[],m:DriverMemory,arena:ArenaLayout,dt:number,difficulty:{derbyPace:number;interceptLead:number}=AI_DIFFICULTIES.amateur):Input{
 const yaw=Math.atan2(car.forward.x,car.forward.z);
 let target=cars.find(c=>c.id===m.target&&c.health>0);
 if(!target||m.commit<=0){
  let best=-Infinity;
  for(const other of cars){
   if(other.id===car.id||other.health<=0)continue;
   const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z,d=Math.hypot(dx,dz);
   const angle=Math.abs(wrap(Math.atan2(dx,dz)-yaw));
   const flank=Math.abs((dx*other.right.x+dz*other.right.z)/Math.max(1,d));
   let crowded=0;for(const c of cars)if(c.id!==car.id&&c.id!==other.id&&dist(c.current,other.current)<7)crowded++;
   const score=32-Math.abs(d-19)*.58-angle*9+flank*7+(100-other.health)*.045+(other.id===m.target?5:0)-crowded*3;
   if(score>best){best=score;target=other;}
  }
  m.target=target?.id??-1;m.commit=2.2+(car.id%4)*.35;
 }
 if(!target)return{throttle:0,steer:0,brake:1,handbrake:false};
 let nearest=Infinity;for(const c of cars)if(c.id!==car.id)nearest=Math.min(nearest,dist(c.current,car.current));
 const stalled=Math.abs(car.speed)<.9||(nearest<7&&Math.abs(car.speed)<3.2);
 m.stalled=stalled?m.stalled+dt:Math.max(0,m.stalled-dt*2);
 if(!m.derby&&m.stalled>1.15){
  const rear=Math.min(m.clear.rear,derbyTrafficClearance(car,cars,-car.forward.x,-car.forward.z));
  m.attempts++;m.derby=maneuver(car,cars,m,arena,rear>1.6);m.stalled=0;
 }
 let tx=0,tz=0,desired=19*difficulty.derbyPace;
 if(m.derby){
  const plan=m.derby;plan.time+=dt;plan.slow=Math.abs(car.speed)<.65?plan.slow+dt:0;
  const reached=dist(car.current,plan)<2.8,travel=Math.hypot(car.current.x-plan.startX,car.current.z-plan.startZ);
  if(plan.kind==='back out'){
   const rear=Math.min(m.clear.rear,derbyTrafficClearance(car,cars,-car.forward.x,-car.forward.z));
   if(reached||travel>12||plan.time>3.7||plan.slow>1.5||rear<1.4){m.derby=maneuver(car,cars,m,arena,false);m.stalled=0;}
   else{
    const angle=wrap(Math.atan2(car.current.x-plan.x,car.current.z-plan.z)-yaw);
    const steer=clamp(-angle*1.6,-.8,.8);m.steer+=clamp(steer-m.steer,-dt*3,dt*3);m.phase='back out';
    return{throttle:car.speed> -6.5?-.85:0,steer:m.steer,brake:car.speed< -7?.3:0,handbrake:false};
   }
  }
  const run=m.derby!;
  if(run.kind==='run up'&&(dist(car.current,run)<3||run.time>3.2||run.slow>1.25)){
   m.derby=undefined;m.commit=0;m.stalled=0;
  }else{tx=run.x;tz=run.z;desired=11;m.phase='run up';}
 }
 if(!m.derby){
  const d=dist(car.current,target.current),lead=clamp(d/(Math.abs(car.speed)+12),.12,.85)*difficulty.interceptLead;
  tx=target.current.x+target.velocity.x*lead;tz=target.current.z+target.velocity.z*lead;m.phase='intercept';
 }
 const radius=Math.hypot(tx-arena.x,tz-arena.z),limit=arena.radius-8;
 if(radius>limit){tx=arena.x+(tx-arena.x)*limit/radius;tz=arena.z+(tz-arena.z)*limit/radius;}
 if(Math.hypot(car.current.x-arena.x,car.current.z-arena.z)>arena.radius-7){tx=arena.x;tz=arena.z;desired=11;m.phase='re-enter';}
 const angle=wrap(Math.atan2(tx-car.current.x,tz-car.current.z)-yaw);
 let steer=clamp(angle*1.75,-1,1);desired=Math.min(desired,clamp(23-Math.abs(angle)*12,4.5,23));
 for(const other of cars){
  if(other.id===car.id||(!m.derby&&other.id===target.id))continue;
  const dx=other.current.x-car.current.x,dz=other.current.z-car.current.z;
  const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
  if(ahead<0||ahead>5+Math.abs(car.speed)*.8||Math.abs(side)>3.4)continue;
  const strength=(1-ahead/(6+Math.abs(car.speed)*.8))*(1-Math.abs(side)/4);
  steer+=(side===0?(car.id%2?1:-1):-Math.sign(side))*strength*1.2;
 }
 if(m.clear.front<Math.max(5,Math.abs(car.speed)*.8)){
  steer+=(m.clear.left>m.clear.right?-1:1)*.85;desired=Math.min(desired,Math.max(2,m.clear.front*.8));m.phase='avoid barrier';
 }
 m.steer+=clamp(clamp(steer,-1,1)-m.steer,-dt*4.5,dt*4.5);
 return{throttle:clamp((desired-car.speed)*.4,0,1),steer:m.steer,brake:clamp((car.speed-desired)/5,0,1),handbrake:false};
}
