import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import { templates } from '../src/assets';
import { Vehicle } from '../src/vehicle';
import { terrainGeometry } from '../src/quarry-layout';

await R.init();
const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}templates.set('coupe',model);
const base=JSON.parse(readFileSync(new URL('../source/circuit-surface-base.json',import.meta.url),'utf8'));
const fx={emit(){},mark(){},detach(){}} as any;

function boundaryRun(fps:number){
  const world=new R.World({x:0,y:-9.81,z:0}),terrain=terrainGeometry();world.timestep=1/60;
  world.createCollider(R.ColliderDesc.trimesh(terrain.positions,terrain.indices));
  const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,fx),row=base.rows[353];
  car.place(row.center.x+row.lateral.x*4.8,row.center.z+row.lateral.z*4.8,Math.atan2(row.lateral.x,row.lateral.z));
  try{
    for(let i=0;i<120;i++){car.preStep(1/60);world.step();car.postStep(1/60,0);}
    assert.equal(car.surface,'asphalt');assert.equal(car.controller.numWheels(),4);
    for(let i=0;i<4;i++)assert.ok(car.controller.wheelIsInContact(i),'all wheels settle on the actual terrain');
    car.body.setLinvel({x:row.lateral.x*8,y:0,z:row.lateral.z*8},true);
    const states:string[]=[],trace:number[]=[];let accumulator=0,steps=0,peak=0;
    for(let frame=0;frame<fps*6;frame++){
      accumulator+=1/fps;
      while(accumulator+1e-9>=1/60){
        car.input={throttle:0,steer:steps<20?.035:0,brake:steps>=30?1:0,handbrake:false};
        car.preStep(1/60);
        for(let wheel=0;wheel<4;wheel++)assert.ok(Math.abs(car.controller.wheelFrictionSlip(wheel)!-(car.surface==='asphalt'?3.2:2.4))<1e-6,'actual wheel grip follows the shared surface');
        world.step();car.postStep(1/60,steps/60);states.push(car.surface);trace.push(car.current.x,car.current.y,car.current.z,car.speed);peak=Math.max(peak,Math.abs(car.speed));
        steps++;accumulator-=1/60;
      }
      car.render(Math.max(0,accumulator/(1/60)));
    }
    assert.ok(states.includes('asphalt')&&states.includes('gravel'),'real vehicle crosses the authored pavement edge');
    assert.equal(states.filter((s,i)=>i&&s!==states[i-1]).length,1,'single clean surface crossing, without classification chatter');
    assert.equal(steps,360);assert.ok(peak>7);assert.ok(Math.abs(car.speed)<.1);assert.equal(car.health,100);
    return {trace,states};
  }finally{car.dispose();world.free();}
}

test('actual suspension, steering and braking cross the corrected pavement edge identically at30/60/144 render FPS',()=>{
  const runs=[30,60,144].map(boundaryRun);
  for(const run of runs.slice(1)){assert.deepEqual(run.states,runs[0].states);assert.deepEqual(run.trace,runs[0].trace);}
});
