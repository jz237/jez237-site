import {DrivingBrain,type DriverCar,type Clearance} from './driving-brain';
import {PursuitTargeting,type PursuitPosition} from './pursuit-targeting';
import type {PursuitSession} from './pursuit';
import type {Input} from './vehicle';
const position=(car:DriverCar):PursuitPosition=>({id:car.id,x:car.current.x,z:car.current.z,vx:car.velocity.x,vz:car.velocity.z,health:car.health});
/** Chase uses road navigation, obstacle probes and unsticking even during attacks.
 * Only the intended runner is exempt from traffic avoidance; allies remain obstacles. */
export class PursuitDriving{
 readonly targeting=new PursuitTargeting();
 constructor(readonly brain:DrivingBrain){}
 reset(){this.targeting.reset();this.brain.reset();}
 update(session:PursuitSession,car:DriverCar,cars:DriverCar[],dt:number,time:number,route:readonly {x:number;z:number}[],probe:()=>Clearance,clearCorridor:(target:PursuitPosition)=>boolean):Input{
  const intent=this.targeting.intent(session,position(car),cars.map(position),time,clearCorridor);
  if(intent.kind==='stop')return{throttle:0,steer:0,brake:1,handbrake:false};
  const attack=(intent.kind==='intercept'||intent.kind==='stage')&&intent.target!==null?{id:intent.target,point:intent.point!}:undefined;
  if(intent.kind==='stage'&&intent.point&&Math.hypot(intent.point.x-car.current.x,intent.point.z-car.current.z)<4)return{throttle:0,steer:0,brake:1,handbrake:false};
  if(attack&&intent.kind!=='stage'){
   const dx=attack.point.x-car.current.x,dz=attack.point.z-car.current.z;
   const ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
   // An overshot runner can be closer than our turning circle. Back towards it
   // only in a clear rear corridor, braking forward momentum before reversing.
   if(!this.brain.memory.get(car.id)?.derby&&ahead< -2&&ahead> -10&&Math.abs(side)<4){
    const occupied=cars.some(other=>{if(other.id===car.id||other.id===attack.id)return false;const x=other.current.x-car.current.x,z=other.current.z-car.current.z;const back=-(x*car.forward.x+z*car.forward.z);return back>0&&back< -ahead+4&&Math.abs(x*car.right.x+z*car.right.z)<3;});
    const clearance=probe();
    if(!occupied&&clearance.rear>Math.max(3,Math.abs(car.speed)*.8)){
     if(car.speed>1)return{throttle:0,steer:0,brake:1,handbrake:false};
     return{throttle:-.65,steer:Math.max(-1,Math.min(1,Math.atan2(side,-ahead)*1.75)),brake:0,handbrake:false};
    }
   }
  }
  return this.brain.update(car,cars,'race',dt,probe,route,attack);
 }
}
