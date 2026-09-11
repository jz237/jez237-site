import test from 'node:test';
import assert from 'node:assert/strict';
import {getCourse,sampleRoute} from '../courses.js';
import {stuntCourse} from '../stunts.js';
import {barrierCollision,barrierPiles} from '../course-barriers.js';
const point=(x,z)=>[(x-420)*.5,(z-310)*.5];
test('Dolphin Park preserves its curved island, wet inner basin and separate eastern islets',()=>{
 const c=getCourse('practice');assert.equal(c.name,'Dolphin Park');assert.equal(c.layoutRevision,1);
 for(const p of [[235,310],[345,167],[332,447],[689,395]])assert.ok(c.ground(...point(...p))>2,JSON.stringify(p));
 for(const p of [[380,310],[450,390],[580,310],[109,378],[359,540]])assert.ok(c.ground(...point(...p))<-3,JSON.stringify(p));
 for(const p of sampleRoute(c.anchors,384))assert.ok(c.ground(p.x,p.z)<-2,JSON.stringify(p));
});
test('mapped park jetties and arch provide real clearances and solid supports',()=>{
 const c=getCourse('practice'),piers=c.crossbars.filter(b=>b.material==='wood');assert.equal(piers.length,10);
 for(const b of piers){assert.equal(barrierCollision([b],b.x,0,b.z,.3,1.1),false);assert.equal(barrierCollision([b],b.x,3,b.z,.3,1.1),true);const p=barrierPiles(b)[0];assert.equal(barrierCollision([b],p.x,0,p.z,.3,1.1),true);}
 const [x,z]=point(707,277);assert.ok(c.ground(x,z)<-3);assert.equal(barrierCollision(c.crossbars,x,0,z),false);assert.equal(barrierCollision(c.crossbars,x,6,z),true);
});
test('authored park stunt rings and grouped ramps retain original order in every class selection',()=>{
 const centers=[[500,409],[527,344],[549,280],[532,129],[483,89],[407,78],[335,81],[109,378],[132,424],[359,540]];
 for(let d=0;d<4;d++){const c=stuntCourse(getCourse('practice',d));assert.equal(c.rings.length,10);assert.equal(c.ramps.length,4);assert.equal(c.checkpoints.length,4);assert.equal(c.reverse,false);
 assert.deepEqual(c.rings.map(r=>[r.x,r.z]),centers.map(p=>point(...p)));assert.ok(c.ramps.slice(0,3).every(r=>r.tx<0&&r.tz>0));assert.ok(c.ramps[3].tx>0&&c.ramps[3].tz>0);
 for(const r of c.rings)assert.ok(c.ground(r.x,r.z)<-2);
 }
});
import {createRace,stepRace} from '../race-core.js';
test('a powered hull can traverse the mapped jetty and rock arch without collision',()=>{
 const c=getCourse('practice'),b=c.crossbars[2],[ax,az]=point(707,277);
 for(const passage of [{x:ax,z:az,tx:0,tz:1,run:17},{x:b.x+b.tx*b.length/8,z:b.z+b.tz*b.length/8,tx:-b.tz,tz:b.tx,run:6}]){
  const s=createRace({course:c,mode:'practice',seaState:'calm'}),r=s.racers[0];s.phase='running';r.x=passage.x-passage.tx*12;r.z=passage.z-passage.tz*12;r.heading=Math.atan2(passage.tx,passage.tz);let impacts=0;
  for(let i=0;i<600&&(r.x-passage.x)*passage.tx+(r.z-passage.z)*passage.tz<passage.run;i++){stepRace(s,{throttle:.65,dampen:true},1/60);if(r.collision>0)impacts++;}
  assert.ok((r.x-passage.x)*passage.tx+(r.z-passage.z)*passage.tz>=passage.run);assert.equal(impacts,0,JSON.stringify(passage));assert.equal(r.dq,'');
 }
});
