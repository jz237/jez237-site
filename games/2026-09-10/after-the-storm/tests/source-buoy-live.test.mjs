import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {createSourceBuoyLayout} from '../source-buoy-progress.js';
import {getCourse} from '../courses.js';
import {openWaterCourse} from './support/open-water-course.mjs';
function fixture(mode='time'){
 const sourceBuoyLayout=createSourceBuoyLayout({rows:[[0,2000,3,0],[0,0,0,0]],courseIndex:0});
 const gates=[{x:0,z:50,tx:0,tz:1,width:9.25,side:0},{x:-7,z:0,bx:0,bz:0,tx:0,tz:1,width:23,side:1,offset:7}];
 const s=createRace({mode,seaState:'calm',course:{...openWaterCourse(),id:'source-gate-fixture',stuntLayout:undefined,gates,
  sourceBuoyLayout,sourceVisibleGateIndices:{0:0,1:1}}});
 s.phase='running';for(const r of s.racers)Object.assign(r,{x:-30,z:-3,vx:0,vz:0,heading:0});return s;
}
const tick=(s,count=3)=>{for(let i=0;i<count;i++)stepRace(s,{},1/60);};

test('live source colored admission uses50ms history and accepts a remote correct-side plane',()=>{
 const s=fixture(),r=s.racers[0];tick(s);assert.equal(r.sourceBuoys.armed,true);assert.equal(r.passed,0);
 r.z=3;tick(s,2);assert.equal(r.passed,0,'render frames do not create extra gate samples');tick(s,1);
 assert.equal(r.passed,1);assert.equal(r.next,0);assert.equal(r.power,1);assert.equal(r.misses,0);
 assert.ok(Math.abs(r.x)>23,'the source colored consumer has no invented local span');
});

test('live source pause preserves pending sample and resumed admission without catch-up',()=>{
 const s=fixture(),r=s.racers[0];tick(s);r.z=3;tick(s,1);const before=structuredClone(r.sourceBuoys),elapsed=r.sourceBuoyElapsed;
 s.phase='paused';for(let i=0;i<100;i++)stepRace(s,{},1/30);assert.deepEqual(r.sourceBuoys,before);assert.equal(r.sourceBuoyElapsed,elapsed);
 s.phase='running';tick(s,1);assert.equal(r.passed,0);tick(s,1);assert.equal(r.passed,1);
});

test('source raw progression and visible gates stay separate and new racers never share state',()=>{
 const s=fixture('versus'),[a,b]=s.racers;assert.notEqual(a.sourceBuoys,b.sourceBuoys);
 b.z=-5;tick(s);a.z=3;tick(s);assert.equal(a.passed,1);assert.equal(b.passed,0);assert.equal(b.power,0);
 const another=fixture('versus');assert.equal(another.racers[0].sourceBuoys.logicalTicks,0);assert.equal(another.racers[0].passed,0);
});

test('source race graph retains real guides while Stunt and Free Ride keep independent progress',()=>{
 for(const id of ['greyhaven','tempest']){
  const s=createRace({course:getCourse(id)}),r=s.racers[0];assert.ok(r.sourceBuoys);assert.equal(s.racers[1].sourceBuoys,undefined,'AI secondary-route admission is still pending');
  assert.ok(s.course.sourceBuoyLayout.nodes.some(n=>n.routeGroup===1&&!n.enabled));
  for(const mode of ['stunt','practice']){const q=createRace({course:getCourse(id),mode});assert.equal(q.racers[0].sourceBuoys,undefined);}
 }
});
