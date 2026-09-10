import {createSchoolRoute,advanceSchoolRoute,schoolLane} from '../lib/SchoolRoute.ts';
import {separateFish} from '../lib/FishCollisions.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createTetraSwim,advanceTetraSwim} from '../lib/TetraSwimming.ts';
test('sixteen independent tetras stay cohesive while exploring shared depth',()=>{
 const fish=Array.from({length:16},(_,i)=>{const s=createTetraSwim(237+i*7919);Object.assign(s,{x:860+i%4*65,y:315+Math.floor(i/4)*38,z:.3+i%3*.17});s.brain.seed=723+i*3571;return s;});
 const route=createSchoolRoute();let minX=Infinity,maxX=-Infinity;
 let spread=0,samples=0,minDepth=1,maxDepth=0,schooling=0;
 for(let frame=0;frame<60*180;frame++){
  const t=frame/60,snapshot=fish.map((s,id)=>({id,x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,radius:28}));
  const schoolGoal=advanceSchoolRoute(route,1/60,snapshot);
  fish.forEach((s,i)=>{advanceTetraSwim(s,1/60,false,false,{food:[],neighbors:snapshot.filter(n=>n.id!==i),schoolGoal:schoolLane(schoolGoal,i)});assert.ok(Number.isFinite(s.x+s.y+s.z+s.yaw));assert.ok(s.x>600&&s.x<1260);});
  const bodies=fish.map((s,id)=>({id,x:s.x,y:s.y,z:s.z,radius:28}));separateFish(bodies);bodies.forEach((b,i)=>Object.assign(fish[i],{x:b.x,y:b.y,z:b.z}));
  for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)assert.ok(Math.hypot(fish[i].x-fish[j].x,fish[i].y-fish[j].y,(fish[i].z-fish[j].z)*180)>=55.95,'bodies must remain separate');
  if(frame%60===0){const cx=fish.reduce((v,s)=>v+s.x,0)/16,cy=fish.reduce((v,s)=>v+s.y,0)/16,cz=fish.reduce((v,s)=>v+s.z,0)/16;minX=Math.min(minX,cx);maxX=Math.max(maxX,cx);spread+=fish.reduce((v,s)=>v+Math.hypot(s.x-cx,s.y-cy,(s.z-cz)*180),0)/16;samples++;minDepth=Math.min(minDepth,cz);maxDepth=Math.max(maxDepth,cz);schooling+=fish.filter(s=>s.brain.intent.kind==='school').length;}
 }
 assert.ok(maxX-minX>300,`school must traverse the tank, span ${maxX-minX}`);
 assert.ok(spread/samples<150,`mean school radius ${spread/samples}`);assert.ok(maxDepth-minDepth>.18,'school should move through depth');assert.ok(schooling/samples>4,'schooling remains a frequent behavior');assert.equal(new Set(fish.map(s=>s.seed)).size,16,'individual decisions retain independent randomness');
});


