import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {DrivingBrain} from '../src/driving-brain';
import {raceGridSlot,directionForCar,circuitRoute,checkRoute,lapProgress} from '../src/event-rules';
import {WaypointRace,nearestRoad} from '../src/waypoint-race';
test('real vehicle dynamics complete opposing and all waypoint formats with navigation and recovery',async(t)=>{
  await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}for(const kind of ['coupe','sedan','hatch']as const)templates.set(kind,model);
  for(const format of ['opposing','ordered','free','random']as const){
    const scene=new T.Scene(),world=new R.World({x:0,y:-9.81,z:0}),brain=new DrivingBrain(),count=24,race=format==='opposing'?null:new WaypointRace(format,1,22);world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
    const cars=Array.from({length:count},(_,id)=>{const c=new Vehicle(id,(['coupe','sedan','hatch']as const)[id%3],0xffffff,scene,world,{emit(){},mark(){},detach(){}}as any),p=raceGridSlot(id,format==='opposing'?'opposing':'forward');c.place(p.x,p.z,p.yaw);c.nextCheckpoint=p.next;c.passed=race?0:p.passed;return c;});
    for(let step=0;step<90;step++){for(const c of cars)c.preStep(1/60);world.step();for(const c of cars)c.postStep(1/60,0);}
    let elapsed=0,recoveries=0;
    for(let step=0;step<360*60&&!cars.every(c=>c.finished);step++){
      elapsed=step/60;
      for(const c of cars){const nav=race?.navigation(c.id,c.current);if(nav)c.nextCheckpoint=nav.next;const route=nav?.route??circuitRoute(directionForCar('opposing',c.id));c.offTrackTime=nearestRoad(c.current).distance>14?c.offTrackTime+1/60:0;if(c.offTrackTime>7||c.rollTime>4){const a=route[(c.nextCheckpoint+23)%24],b=route[c.nextCheckpoint];c.place(a.x,a.z,Math.atan2(b.x-a.x,b.z-a.z));c.offTrackTime=0;c.penalty+=5;brain.memory.delete(c.id);recoveries++;}c.input=brain.update(c,cars,'race',1/60,undefined,route);c.preStep(1/60);}
      world.step();
      for(const c of cars){c.postStep(1/60,elapsed);if(race){race.sample(c.id,c.current);c.passed=race.get(c.id).passed;c.finished=race.get(c.id).finished;}else{const route=circuitRoute(directionForCar('opposing',c.id)),check=checkRoute(route,c.current.x,c.current.z,c.nextCheckpoint,c.checkpointDistance);c.checkpointDistance=check.distance;if(check.passed){c.nextCheckpoint=(c.nextCheckpoint+1)%24;c.checkpointDistance=Infinity;if(!c.finished){c.passed++;c.finished=lapProgress(c.passed,1).finished;}}}}
    }
    const complete=cars.filter(c=>c.finished).length;t.diagnostic(`${format}: ${complete}/${count} completed in ${elapsed.toFixed(1)}s, ${recoveries} recoveries on unobstructed dynamics fixture`);assert.equal(complete,count,`${format}: progress ${cars.map(c=>c.passed)} targets ${cars.map(c=>race?.get(c.id).target)}`);
    for(const c of cars){assert.ok(c.current.toArray().every(Number.isFinite));c.dispose();}world.free();
  }
});
