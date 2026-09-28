/** CPU-only check of the benchmark's actual braked Vehicle poses. Rendered
 * models are unnecessary here: the real suspension and body colliders run
 * against the complete shared quarry world, including all new root bands.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { templates } from '../src/assets';
import { Vehicle } from '../src/vehicle';
import { createQuarryPhysics } from '../src/quarry-layout';

const input=process.argv[2],output=process.argv[3];
assert.ok(input&&output,'Provide the saved stop preflight and a new output JSON path');
assert.equal(fs.existsSync(output),false,'Do not overwrite earlier contact evidence');
const source=fs.readFileSync(input),plan=JSON.parse(source.toString()),results:any[]=[];
await R.init();
const model=new T.Group();
for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}
templates.set('coupe',model);
for(const stop of plan.stops){
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  const physics=createQuarryPhysics(R,world,true),ids=new Map([...physics.statics].map(([id,c])=>[c.handle,id]));
  const trees=[...physics.statics].filter(([id])=>id.startsWith('tree-north-'));
  const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);
  const contacts=new Set<string>();let closest={distance:Infinity,id:'',seconds:0},maximumDrift=0;
  try{
    car.place(stop.x,stop.z,stop.yaw); // Exact __quarry.teleport path.
    const initial={...car.body.translation()};
    for(let step=0;step<16*60;step++){
      car.input={throttle:0,brake:1,steer:0,handbrake:false};
      car.preStep(1/60);world.step();car.postStep(1/60,step/60);
      const p=car.body.translation();maximumDrift=Math.max(maximumDrift,Math.hypot(p.x-stop.x,p.z-stop.z));
      for(const body of [car.collider,car.roof]){
        world.contactPairsWith(body,other=>{const id=ids.get(other.handle);if(id?.startsWith('tree-north-'))world.contactPair(body,other,m=>{if(m.numSolverContacts())contacts.add(id);});});
        if(step%60===0||step===16*60-1)for(const [id,tree]of trees){
          const contact=body.contactCollider(tree,10);
          if(contact&&contact.distance<closest.distance)closest={distance:contact.distance,id,seconds:(step+1)/60};
        }
      }
    }
    results.push({id:stop.id,pose:stop,initial,final:{...car.body.translation()},finalVelocity:{...car.body.linvel()},maximumPlanarDrift:maximumDrift,
      nearestTreeProxy:closest,treeContactIds:[...contacts],seconds:16,simulationSteps:960});
  }finally{car.dispose();world.free();}
}
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
const report={checkedAt:new Date().toISOString(),kind:'actual-vehicle-forest-stop-contact-audit',input,inputSHA256:hash(source),
  placementsSHA256:hash(fs.readFileSync('src/quarry-north-forest.json')),layoutSHA256:hash(fs.readFileSync('src/quarry-layout.ts')),
  vehicleSHA256:hash(fs.readFileSync('src/vehicle.ts')),browserLaunched:false,measuredPerformanceFrames:0,results};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,stops:results.map(r=>({id:r.id,nearestTreeProxy:r.nearestTreeProxy,maximumPlanarDrift:r.maximumPlanarDrift,treeContactIds:r.treeContactIds}))},null,2));
for(const result of results){
  assert.equal(result.treeContactIds.length,0,result.id+' must not contact any new stem or root proxy');
  assert.ok(result.nearestTreeProxy.distance>.5,result.id+' retains physical body clearance throughout settling');
  assert.ok(result.maximumPlanarDrift<1,result.id+' remains a braked inspection stop');
}
