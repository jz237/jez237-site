import R from '@dimforge/rapier3d-compat';
import {createQuarryPhysics,yawRotation} from '../src/quarry-layout';
import {trackPoint,terrainHeight} from '../src/rules';
export function corridorObstructions(world:R.World,statics:Map<string,R.Collider>){
  const ids=new Map([...statics].map(([id,c])=>[c.handle,id])),hits=new Map<string,{id:string;samples:number;first:{x:number;z:number;t:number}}>();
  for(let i=0;i<1200;i++){const t=i/1200,p=trackPoint(t),q=trackPoint(t+.0005),yaw=Math.atan2(q.x-p.x,q.z-p.z);
    world.intersectionsWithShape({x:p.x,y:terrainHeight(p.x,p.z)+1.15,z:p.z},yawRotation(yaw),new R.Cuboid(6,1.1,.5),c=>{const id=ids.get(c.handle)??'dynamic-prop';const old=hits.get(id);if(old)old.samples++;else hits.set(id,{id,samples:1,first:{...p,t}});return true;},undefined,undefined,undefined,undefined,c=>ids.get(c.handle)!=='terrain'&&!ids.get(c.handle)?.startsWith('ramp-'));
  }return [...hits.values()];
}
if(process.argv[1]?.endsWith('corridor-check.ts')){await R.init();const world=new R.World({x:0,y:-9.81,z:0}),q=createQuarryPhysics(R,world,false);world.step();console.log(JSON.stringify(corridorObstructions(world,q.statics),null,2));world.free();}
