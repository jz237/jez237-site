import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Invertebrates} from '../lib/Invertebrates.ts';
import {grazerBody,bodiesOverlap,fishTouch,sweptPose,shrimpHip} from '../lib/GrazerCollision.ts';
import {shrimpCarapace} from '../lib/GrazerGeometry.ts';
const up=new T.Vector3(0,1,0),forward=new T.Vector3(1,0,0);
test('all ten leg roots begin inside the shell, not outside its underside',()=>{
 const mesh=new T.Mesh(shrimpCarapace(),new T.MeshBasicMaterial({side:T.DoubleSide}));mesh.updateMatrixWorld();
 for(let k=0;k<5;k++)for(const side of [-1,1]){const hip=shrimpHip(k,side),hit=new T.Raycaster(hip,up).intersectObject(mesh)[0];assert.ok(hit,'hip needs shell over it');assert.ok(hit.face.normal.dot(up)>0,'first crossing must leave the shell interior');}
});
test('swept body checks prevent tunneling and preserve true front-to-back separation',()=>{
 const obstacle=grazerBody(new T.Vector3(),up,forward);assert.equal(sweptPose(new T.Vector3(-1,0,0),new T.Vector3(1,0,0),up,up,forward,forward,p=>!bodiesOverlap(grazerBody(p,up,forward),obstacle)),false);
 assert.equal(sweptPose(new T.Vector3(-1,0,.3),new T.Vector3(1,0,.3),up,up,forward,forward,p=>!bodiesOverlap(grazerBody(p,up,forward),obstacle)),true);
 const fish={id:1,previous:new T.Vector3(-1,.1,0),position:new T.Vector3(1,.1,0),forward,size:.52};assert.ok(fishTouch(fish,obstacle));assert.equal(fishTouch({...fish,previous:fish.previous.clone().add(new T.Vector3(0,0,.5)),position:fish.position.clone().add(new T.Vector3(0,0,.5))},obstacle),null);
});
test('fish contact causes a bounded backward escape with cooldown and safe return',()=>{
 const life=new Invertebrates(new T.Scene(),()=>.5),a=life.animals[0],origin=a.position.clone(),f=new T.Vector3().setFromMatrixColumn(a.matrix,0).normalize();
 const fish={id:42,position:origin.clone().addScaledVector(up,.1),forward:f,size:.52};life.update(1/60,undefined,[fish]);assert.ok(a.escape);assert.ok(life.fishCorrections.has(42));const escape=a.escape;let max=0;
 for(let i=0;i<25;i++){life.update(1/60,undefined,[fish]);max=Math.max(max,a.position.distanceTo(origin));assert.equal(a.escape,escape,'repeated touch must not restart escape');}
 assert.ok(max>.15,'a touch produces a visible quick dart');assert.ok(a.position.clone().sub(origin).dot(f)<0,'escape includes backward motion');assert.ok(max<.7);
 const freeze=a.position.clone();life.update(0);assert.deepEqual(a.position,freeze);
 for(let i=0;i<190;i++)life.update(1/60);assert.equal(a.escape,undefined);assert.ok(a.position.distanceTo(origin)<.08,'settles back without teleporting');life.dispose();
});
test('rock and glass contact checks reserve the full body, not only the feet',()=>{
 const obstacle={center:new T.Vector3(0,1,0),radius:.2},life=new Invertebrates(new T.Scene(),()=>.5,[],undefined,[obstacle]);
 assert.equal(life.solidClear(new T.Vector3(0,.95,0),up,forward,false),false);assert.equal(life.solidClear(new T.Vector3(4.95,1,0),up,forward,false),false);assert.equal(life.solidClear(new T.Vector3(0,1,1),up,forward,false),true);life.dispose();
});
