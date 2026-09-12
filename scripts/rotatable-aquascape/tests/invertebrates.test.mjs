import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Invertebrates} from '../lib/Invertebrates.ts';
import {createTetraSwim,advanceTetraSwim} from '../lib/TetraSwimming.ts';

test('nine grazers remain attached, animate independently and fit their instance pools',()=>{
 const scene=new T.Scene(),life=new Invertebrates(scene,(x,z)=>.5+.03*x);
 const starts=life.animals.map(a=>a.position.clone()),states=new Set();
 for(let i=0;i<600;i++){
  life.update(.05);
  for(const a of life.animals){assert.ok(Number.isFinite(a.position.length()));assert.ok(Math.abs(a.normal.length()-1)<1e-6);if(a.id>=7)assert.equal(a.position.z,2.321);else assert.ok(Math.abs(a.position.y-(.53+.03*a.position.x))<1e-6);}
  states.add(life.animals.slice(0,6).map(a=>a.grazing?'g':'w').join(''));
 }
 assert.equal(life.animals.length,9);assert.ok(states.size>5);life.animals.forEach((a,i)=>assert.ok(a.position.distanceTo(starts[i])>.015));
 for(const mesh of life.root.children){assert.ok(mesh.count<=mesh.instanceMatrix.count,'instance capacity');assert.ok(Array.from(mesh.instanceMatrix.array).every(Number.isFinite));}
 const before=life.root.children.map(m=>Array.from(m.instanceMatrix.array));life.update(0);assert.deepEqual(life.root.children.map(m=>Array.from(m.instanceMatrix.array)),before);
 life.root.visible=false;const d=life.animals[0].distance;life.update(1);assert.equal(life.animals[0].distance,d);life.dispose();assert.equal(scene.children.length,0);
});
test('a grazer can be ray-picked by its rendered geometry',()=>{
 const scene=new T.Scene(),life=new Invertebrates(scene,()=>.5);scene.updateMatrixWorld();const a=life.animals[7],ray=new T.Raycaster(a.position.clone().add(new T.Vector3(0,0,1)),new T.Vector3(0,0,-1));const hit=life.pick(ray);assert.equal(hit?.info.animalId,7);assert.match(hit.info.name,/Ramshorn/);life.dispose();
});
test('cardinals cannot inspect a patch at the wrong depth or after an unsuccessful approach',()=>{
 const s=createTetraSwim(237);s.x=900;s.y=350;s.z=.1;s.speed=0;s.behavior='approaching';s.remaining=10;s.browsing=true;
 s.brain.intent={kind:'browse',reason:'test',target:{id:-101,x:900,y:350,z:1.1}};s.brain.decisionIn=10;
 advanceTetraSwim(s,.05,false,false,{food:[],neighbors:[],daylight:1,depthBounds:[-.26,1.26]});assert.equal(s.behavior,'approaching');assert.equal(s.brain.visited.length,0);
 s.remaining=.001;s.brain.decisionIn=10;advanceTetraSwim(s,.05,false,false,{food:[],neighbors:[],daylight:1});assert.notEqual(s.behavior,'inspecting');assert.equal(s.brain.visited.length,0);
});
