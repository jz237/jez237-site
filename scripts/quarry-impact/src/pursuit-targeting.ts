import type {PursuitSession} from './pursuit';
export type PursuitPosition={id:number;x:number;z:number;vx:number;vz:number;health:number};
export type PursuitIntent={kind:'escape'|'route'|'intercept'|'stop';target:number|null;point?:{x:number;z:number}};
/** Near-range attacks require a clear driving corridor. Far targets stay on the course. */
export class PursuitTargeting{
 private locks=new Map<number,{id:number;until:number}>();
 reset(){this.locks.clear();}
 intent(session:PursuitSession,car:PursuitPosition,cars:readonly PursuitPosition[],time:number,clearCorridor:(target:PursuitPosition)=>boolean):PursuitIntent{
  if(session.complete||car.health<=0||!session.role(car.id))return{kind:'stop',target:null};
  if(session.role(car.id)==='runner')return{kind:session.result(car.id)?.outcome==='running'?'escape':'stop',target:null};
  const targets=cars.filter(c=>c.id!==car.id&&c.health>0&&session.role(c.id)==='runner'&&session.result(c.id)?.outcome==='running');
  const distance=(c:PursuitPosition)=>Math.hypot(c.x-car.x,c.z-car.z);
  const lock=this.locks.get(car.id),held=lock&&lock.until>time?targets.find(c=>c.id===lock.id):undefined;
  const target=held??targets.sort((a,b)=>distance(a)-distance(b)||a.id-b.id)[0];
  if(!target){this.locks.delete(car.id);return{kind:'stop',target:null};}
  if(!held)this.locks.set(car.id,{id:target.id,until:time+1.2});
  const range=distance(target);
  if(range>22||!clearCorridor(target))return{kind:'route',target:target.id};
  const lead=Math.min(.6,range/Math.max(8,Math.hypot(car.vx,car.vz)));
  const point={x:target.x+target.vx*lead,z:target.z+target.vz*lead};
  if(!clearCorridor({...target,...point}))return{kind:'route',target:target.id};
  return{kind:'intercept',target:target.id,point};
 }
}
