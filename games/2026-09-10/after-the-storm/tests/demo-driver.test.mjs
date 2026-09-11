import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemoScene,demoInput,demoSceneDone,DEMO_SCENES} from '../demo-driver.js';
import {stepRace} from '../race-core.js';

test('demo tours all nine venues and wraps to the first scene',()=>{
 assert.equal(new Set(DEMO_SCENES.map(s=>s[0])).size,9);
 assert.equal(createDemoScene(DEMO_SCENES.length).course.id,createDemoScene(0).course.id);
 assert.equal(createDemoScene().demoRun,true);
});
for(let index=0;index<DEMO_SCENES.length;index++)test('live demo drives '+DEMO_SCENES[index].join(' / '),()=>{
 const s=createDemoScene(index);let steps=0,maxSpeed=0,near=0,samples=0,distanceSum=0;
 while(!demoSceneDone(s)&&steps++<7200){stepRace(s,demoInput(s),1/60);maxSpeed=Math.max(maxSpeed,...s.racers.map(r=>r.speed));
  if(s.mode==='race'&&s.time>8)for(const r of s.racers){const distance=Math.min(...s.racers.filter(q=>q!==r).map(q=>Math.hypot(q.x-r.x,q.z-r.z)));samples++;distanceSum+=distance;if(distance<5)near++;}}
 const r=s.racers[0];
 assert.ok(demoSceneDone(s),'scene must end without hanging');
 assert.ok(maxSpeed>8,'ski must actually drive');
 assert.equal(r.dq,'');
 if(s.mode==='stunt'){assert.equal(r.stunt.nextCheckpoint,4);assert.ok(r.stunt.rings>=14);}
 else {assert.ok(r.lap>1,'complete a physical lap before timeout');assert.ok(maxSpeed>20,'racing pack must exceed 72 km/h while followers may yield');assert.ok(distanceSum/samples>12,'pack should spread out');assert.ok(near/samples<.08,'riders should rarely crowd within five metres');}
 assert.ok(Number.isFinite(r.x+r.z+r.hydro.y));
});
test('stalled demo requests normal rescue input without injecting position or progress',()=>{
 const s=createDemoScene();s.phase='running';demoInput(s);
 s.time=11;const before=[s.racers[0].x,s.racers[0].z,s.racers[0].passed];
 assert.equal(demoInput(s).rescue,true);assert.deepEqual([s.racers[0].x,s.racers[0].z,s.racers[0].passed],before);
 assert.ok(!demoInput(s).rescue,'rescue is not continuously held');
});
test('paused and finished demos issue no throttle',()=>{
 const s=createDemoScene();s.phase='paused';assert.ok(!demoInput(s).throttle);s.phase='results';assert.ok(demoSceneDone(s));assert.ok(!demoInput(s).throttle);
});
