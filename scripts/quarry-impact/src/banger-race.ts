import type {EventOptions} from './event-rules';
/** Banger race: a custom lap race where AI drivers pick fights. A driver with a rival close ahead
 * (and its turn in the aggression rota) rams it for a short burst, then cools down and races on. */
export const BANGER={range:12,cone:.45,burst:1.4,cooldown:5,rota:4} as const;
export function bangerRaceActive(mode:string,custom:boolean,demo:boolean,format:string,event:Pick<EventOptions,'banger'|'teams'|'elimination'|'raceDuration'>,options:Pick<EventOptions,'banger'|'teams'|'elimination'|'raceDuration'>):boolean{
  const o=demo?options:event;return mode==='race'&&custom&&format==='laps'&&o.banger===true&&!o.teams&&!o.elimination&&!o.raceDuration;
}
type Car={id:number;health:number;finished?:boolean;current:{x:number;z:number};forward:{x:number;z:number}};
export class BangerAggression{
  private state=new Map<number,{target:number;until:number;rest:number}>();
  reset(){this.state.clear();}
  /** The rival this driver is ramming now, or -1. */
  target(car:Car,cars:readonly Car[],time:number){
    const s=this.state.get(car.id)??{target:-1,until:0,rest:0};
    if(s.target>=0&&time<s.until&&cars.some(c=>c.id===s.target&&c.health>0)){this.state.set(car.id,s);return s.target;}
    if(s.target>=0){s.target=-1;s.rest=time+BANGER.cooldown;}
    if(time<s.rest||car.health<=0||car.finished||Math.floor(time/2+car.id)%BANGER.rota!==0){this.state.set(car.id,s);return -1;}
    let best=-1,bestD:number=BANGER.range;
    for(const o of cars){if(o.id===car.id||o.health<=0||o.finished)continue;const dx=o.current.x-car.current.x,dz=o.current.z-car.current.z,d=Math.hypot(dx,dz);if(d<1e-3||d>=bestD)continue;if((dx*car.forward.x+dz*car.forward.z)/d<BANGER.cone)continue;best=o.id;bestD=d;}
    if(best>=0){s.target=best;s.until=time+BANGER.burst;}
    this.state.set(car.id,s);return best;
  }
}
