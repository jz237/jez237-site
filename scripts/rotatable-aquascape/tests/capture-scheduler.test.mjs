import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera} from 'three';
import {CaptureScheduler,interleaveCaptures} from '../lib/CaptureScheduler.ts';

const ids=['shadow-left','shadow-center','shadow-right','water','glass-left','glass-right'];
test('full-scene reflection jobs alternate with depth-only shadow jobs without dropping views',()=>{
 const ordered=interleaveCaptures(ids.slice(0,3),ids.slice(3));
 const f=fixture();f.tick(ordered);
 const cycle=Array.from({length:6},()=>f.tick(ordered)[0]);
 assert.deepEqual(cycle,['shadow-left','water','shadow-center','glass-left','shadow-right','glass-right']);
 assert.deepEqual(interleaveCaptures([],ids.slice(3)),ids.slice(3));
 assert.deepEqual(interleaveCaptures(ids.slice(0,3),['water']),['shadow-left','water','shadow-center','shadow-right']);
});
function fixture(){
 const schedule=new CaptureScheduler(),camera=new PerspectiveCamera(37,1,.1,100);
 camera.position.z=21;
 const tick=(active=ids,revision='tank',limited=true)=>{
  const selected=schedule.select(active,camera,revision,limited);schedule.complete(selected);return [...selected];
 };
 return {schedule,camera,tick};
}
test('phone capture budget services all six full-detail views without starving shadows or mirrors',()=>{
 const f=fixture();assert.deepEqual(f.tick(),ids);
 for(let cycle=0;cycle<10;cycle++){
  const seen=[];
  for(let i=0;i<ids.length;i++){
   // Orbiting continuously must not starve shadows or recapture everything.
   f.camera.position.x+=.01;f.camera.lookAt(0,2.75,0);
   const selected=f.tick();assert.equal(selected.length,1);seen.push(...selected);
  }
  assert.deepEqual(new Set(seen),new Set(ids));
 }
});
test('fresh/returning mirrors, view jumps, resize, lessons and explicit invalidation refresh immediately',()=>{
 const f=fixture();f.tick();
 const subset=ids.slice(0,-1);f.tick(subset);assert.deepEqual(f.tick(),['glass-right']);
 f.camera.position.x+=4;assert.equal(f.tick().length,6);
 f.camera.fov=70;f.camera.updateProjectionMatrix();assert.equal(f.tick().length,6);
 assert.equal(f.tick(ids,'filter').length,6);
 f.schedule.invalidate();assert.equal(f.tick(ids,'filter').length,6);
 assert.equal(f.tick(ids,'filter').length,1);
});
test('full mode retains every-frame updates and held diagnostic passes cannot schedule excluded views',()=>{
 const f=fixture();
 for(let i=0;i<3;i++)assert.deepEqual(f.tick(ids,'tank',false),ids);
 assert.deepEqual(f.tick([]),[]);
 for(let i=0;i<10;i++)assert.ok(f.tick(['water']).every(id=>id==='water'));
 assert.equal(f.tick().length,5);
});
test('failed captures are retried instead of acknowledged as fresh',()=>{
 const f=fixture();f.tick();
 const first=f.schedule.select(ids,f.camera,'tank',true);
 assert.deepEqual(f.schedule.select(ids,f.camera,'tank',true),first);
 f.schedule.complete(first);
 assert.notDeepEqual(f.schedule.select(ids,f.camera,'tank',true),first);
});
