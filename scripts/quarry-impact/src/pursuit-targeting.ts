import type {PursuitSession} from './pursuit';
export type PursuitPosition={id:number;x:number;z:number;vx:number;vz:number;health:number};
export type PursuitIntent={kind:'escape'|'route'|'intercept'|'stage'|'stop';target:number|null;point?:{x:number;z:number}};
/** Near-range attacks require a clear driving corridor. Far targets stay on the course. */
export class PursuitTargeting{
 private locks=new Map<number,{id:number;until:number}>();
 private staging=new Map<number,{epoch:number;target:number;x:number;z:number;point:{x:number;z:number}}>();
 reset(){this.locks.clear();this.staging.clear();}
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
  if(range>60||!clearCorridor(target))return{kind:'route',target:target.id};
  // A stopped runner otherwise attracts a solid ring of slow cars. Keep two
  // attackers active while the rest open space for reverse/run-up maneuvers.
  const nearby=cars.filter(c=>c.health>0&&session.role(c.id)==='chaser'&&Math.hypot(c.x-target.x,c.z-target.z)<60).sort((a,b)=>a.id-b.id);
  if(target.health<95&&Math.hypot(target.vx,target.vz)<3&&nearby.length>2){
   const first=Math.floor(time/10)*2%nearby.length,index=nearby.findIndex(c=>c.id===car.id);
   if(index!==first&&index!==(first+1)%nearby.length){
    const dx=car.x-target.x,dz=car.z-target.z,length=Math.max(1,Math.hypot(dx,dz)),side=car.id%2?1:-1;
    const epoch=Math.floor(time/10),saved=this.staging.get(car.id);
    const point=saved&&saved.epoch===epoch&&saved.target===target.id&&Math.hypot(saved.x-target.x,saved.z-target.z)<5?saved.point:{x:target.x+dx/length*20+dz/length*side*7,z:target.z+dz/length*20-dx/length*side*7};
    if(point!==saved?.point)this.staging.set(car.id,{epoch,target:target.id,x:target.x,z:target.z,point});
    if(clearCorridor({...target,...point}))return{kind:'stage',target:target.id,point};
   }
  }
  const lead=Math.min(.6,range/Math.max(8,Math.hypot(car.vx,car.vz)));
  const point={x:target.x+target.vx*lead,z:target.z+target.vz*lead};
  if(!clearCorridor({...target,...point}))return{kind:'route',target:target.id};
  return{kind:'intercept',target:target.id,point};
 }
}
