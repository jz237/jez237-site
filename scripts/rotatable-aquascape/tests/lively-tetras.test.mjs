import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createTetraSwim,advanceTetraSwim,startleTetra} from '../lib/TetraSwimming.ts';
import {createSchoolRoute,advanceSchoolRoute,schoolActivity} from '../lib/SchoolRoute.ts';
import {calmSwordLeaves} from '../lib/SwordCurrent.ts';
const empty={food:[],neighbors:[],daylight:1};
test('daytime school retains bursts and individual speed variation over ten minutes',()=>{
 const fish=Array.from({length:6},(_,i)=>{const s=createTetraSwim(237+i*7919);s.brain.seed+=i*3571;return s;});
 const route=createSchoolRoute();let burst=0,rest=0,varied=0,loose=0,tight=0;
 for(let frame=0;frame<600*30;frame++){
  const goal=advanceSchoolRoute(route,1/30,fish.map((s,id)=>({...s,id})));
  fish.forEach((s,i)=>{const a=schoolActivity(route,goal,i);advanceTetraSwim(s,1/30,false,false,{...empty,schoolGoal:a.goal,schoolAffinity:a.affinity});
   burst+=s.speed>35&&s.behavior==='burst'?1:0;rest+=s.brain.intent.kind==='rest'?1:0;});
  if(Math.max(...fish.map(s=>s.speed))-Math.min(...fish.map(s=>s.speed))>12)varied++;
  const goals=fish.map((_,i)=>schoolActivity(route,goal,i).goal.x);
  if(Math.max(...goals)-Math.min(...goals)>150)loose++;else if(new Set(goals).size===1)tight++;
 }
 assert.equal(rest,0);assert.ok(burst>100);assert.ok(varied>1000);assert.ok(loose>1000&&tight>1000);
});
test('evening settles a fish and daylight immediately wakes it',()=>{
 const s=createTetraSwim();for(let i=0;i<300;i++)advanceTetraSwim(s,1/30,false,false,{...empty,daylight:.27});
 assert.equal(s.brain.intent.kind,'rest');assert.ok(s.speed<1);
 for(let i=0;i<150;i++)advanceTetraSwim(s,1/30,false,false,empty);
 assert.notEqual(s.brain.intent.kind,'rest');assert.ok(s.speed>10);
});
test('food triggers acceleration and interception from another height and depth',()=>{
 const s=createTetraSwim();s.x=900;s.y=390;s.z=.1;let ateAt=Infinity,peak=0;
 for(let i=0;i<30*30;i++){
  advanceTetraSwim(s,1/30,false,false,{...empty,food:[{id:42,x:1000,y:228+i/30*5,z:.67}]});peak=Math.max(peak,s.speed);
  if(s.brain.consumedFood===42){ateAt=i/30;break;}
 }
 assert.ok(peak>38);assert.ok(ateAt<22,`food reached after ${ateAt} seconds`);
});
test('glass tap causes a brief bounded dart without repeated-tap lockup or spinning',()=>{
 const s=createTetraSwim();assert.equal(startleTetra(s),true);assert.ok(s.startleRemaining<.3);assert.equal(startleTetra(s),false);
 let peak=0;for(let i=0;i<60;i++){const yaw=s.yaw;advanceTetraSwim(s,1/60,false,false,empty);peak=Math.max(peak,s.speed);assert.ok(Math.abs(s.yaw-yaw)<=.9/60);}
 assert.ok(peak>50);assert.equal(s.startleRemaining,0);assert.ok(s.y>220&&s.y<530);
});
test('runtime depth can reach water behind and in front of the hardscape',()=>{
 const s=createTetraSwim();let rear=1,front=0;
 for(let i=0;i<600*30;i++){advanceTetraSwim(s,1/30,false,false,{...empty,depthBounds:[-.26,1.26]});rear=Math.min(rear,s.z);front=Math.max(front,s.z);}
 assert.ok(rear<-.12&&front>1.12,`${rear} to ${front}`);
});
test('sword and ground-cover motion is calmed without altering authored geometry',()=>{
 const scene=new T.Scene();const meshes=['sword','stem','carpet','grass'].map(species=>{
  const g=new T.PlaneGeometry();g.setAttribute('leafMotion',new T.InstancedBufferAttribute(new Float32Array([1,.4,1]),3));
  g.setAttribute('plantRoot',new T.InstancedBufferAttribute(new Float32Array([0,0,0]),3));g.setAttribute('plantFlex',new T.InstancedBufferAttribute(new Float32Array([.4]),1));const m=new T.InstancedMesh(g,new T.MeshBasicMaterial(),1);m.setMatrixAt(0,new T.Matrix4().makeTranslation(0,1,0));m.userData.plantSpecies=species;scene.add(m);return m;
 });
 const vertices=meshes[0].geometry.attributes.position.array.slice(),matrix=meshes[0].instanceMatrix.array.slice();
 calmSwordLeaves(scene);calmSwordLeaves(scene);
 assert.ok(Math.abs(meshes[0].geometry.attributes.leafMotion.getY(0)-.112)<1e-6);
 assert.ok(Math.abs(meshes[0].geometry.attributes.leafMotion.getZ(0)-.6)<1e-6);
 assert.ok(Math.abs(meshes[1].geometry.attributes.leafMotion.getY(0)-.4)<1e-6);
 for(const mesh of meshes.slice(2)){assert.ok(mesh.geometry.attributes.leafMotion.getY(0)<.041);assert.ok(mesh.geometry.attributes.plantFlex.getX(0)<.05);}
 assert.deepEqual(meshes[0].geometry.attributes.position.array,vertices);assert.deepEqual(meshes[0].instanceMatrix.array,matrix);
});
