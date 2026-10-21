import {burnLevel,type GroundFire} from './fluid-leaks';
/** AI drivers and fire (offline events only): steer round burning puddles and props ahead, ease off
 * when one is dead ahead and close, and when already standing in flames floor it straight out. */
export const FIRE_AVOID={look:5,lookPerSpeed:1.1,margin:1.6,steer:.95,slow:.45} as const;
type Car={id:number;current:{x:number;z:number};forward:{x:number;z:number};right:{x:number;z:number};speed:number};
type Input={throttle:number;steer:number;brake:number;handbrake:boolean};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function avoidFires(car:Car,input:Input,fires:readonly GroundFire[],time:number,inFlames=0):Input{
  if(inFlames>0)return{throttle:1,steer:clamp(input.steer*.4,-1,1),brake:0,handbrake:false};
  const range=FIRE_AVOID.look+Math.abs(car.speed)*FIRE_AVOID.lookPerSpeed;let push=0,brake=0;
  for(const f of fires){
    const level=burnLevel(f,time);if(level<=0)continue;
    const dx=f.x-car.current.x,dz=f.z-car.current.z,ahead=dx*car.forward.x+dz*car.forward.z,side=dx*car.right.x+dz*car.right.z;
    const width=f.radius+FIRE_AVOID.margin;if(ahead<=0||ahead>range||Math.abs(side)>width)continue;
    const strength=(1-ahead/range)*(1-Math.abs(side)/width)*Math.min(1,level*1.5);
    // Steer to the far side of the fire; dead centre, each driver picks its own side.
    push+=(Math.abs(side)<.15?(car.id%2?1:-1):-Math.sign(side))*strength;
    if(ahead<6&&Math.abs(side)<f.radius+.8)brake=Math.max(brake,strength*FIRE_AVOID.slow);
  }
  if(push===0&&brake===0)return input;
  return{throttle:input.throttle*(1-brake),steer:clamp(input.steer+push*FIRE_AVOID.steer,-1,1),brake:Math.max(input.brake,brake*.6),handbrake:input.handbrake};
}
