import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeNativeDolphinRenderer} from '../native-dolphin-render.js';
function resources(slot=0){const words=Array(43).fill(0);words[0x9c/4]=0xffffffff;words[0xa4/4]=0xffffffff;words[(0x9c+slot*8)/4]=0;words[(0x44+slot*44)/4]=6;return words;}
function actor(actorIndex,resourceIndex=0,bend=.2){const front=new T.Matrix4().makeTranslation(actorIndex*4,0,0),back=front.clone().multiply(new T.Matrix4().makeRotationZ(bend)).multiply(new T.Matrix4().makeScale(-1,-1,1));return [24,28,16,20,20].map(partOffset=>({actorIndex,resourceIndex,bufferIndex:0,partOffset,matrixWorld:(partOffset===28?back:front).toArray()}));}

test('retained bank identity selects dolphins in either slot and each actor owns independent skin uniforms',()=>{
 const root=new T.Group(),r=makeNativeDolphinRenderer(root),metadata=resources(1),draws=[...actor(1,1,.1),...actor(2,1,.5),{resourceIndex:0}];
 assert.deepEqual(r.update({draws},metadata),{parts:10,actors:2});const group=root.children[0],a=group.children[0],b=group.children[5];assert.notEqual(a.geometry,b.geometry);assert.notEqual(a.material[0],b.material[0]);
 const shader=mesh=>{const s={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader};mesh.material[0].onBeforeCompile(s);return s;},first=shader(a),second=shader(b);
 assert.ok(Math.abs(first.uniforms.dolphinTailMatrix.value.elements[0]-Math.cos(.1))<1e-12);assert.ok(Math.abs(second.uniforms.dolphinTailMatrix.value.elements[0]-Math.cos(.5))<1e-12);
 const geometry=a.geometry;r.update({draws:actor(1,1,.3)},metadata);assert.equal(a.geometry,geometry);assert.ok(Math.abs(first.uniforms.dolphinTailMatrix.value.elements[0]-Math.cos(.3))<1e-12);assert.ok(group.children.slice(5).every(m=>!m.visible));r.dispose();
});

test('a late invalid actor leaves earlier visible geometry, matrices and skin pose intact',()=>{
 const root=new T.Group(),r=makeNativeDolphinRenderer(root),metadata=resources();r.update({draws:actor(1)},metadata);
 const group=root.children[0],a=group.children[0],geometry=a.geometry,before=a.matrix.clone(),shader={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader};a.material[0].onBeforeCompile(shader);const skin=shader.uniforms.dolphinTailMatrix.value.clone();
 assert.throws(()=>r.update({draws:[...actor(1,0,.8),...actor(3).slice(0,4)]},metadata),/all five/);
 assert.equal(group.children.length,5);assert.equal(a.geometry,geometry);assert.ok(a.matrix.equals(before));assert.ok(shader.uniforms.dolphinTailMatrix.value.equals(skin));assert.equal(a.visible,true);
 const wrong=[...metadata];wrong[0x44/4]=0;assert.throws(()=>r.update({draws:[]},wrong),/six loaded/);assert.equal(a.visible,true);r.dispose();
});

test('retired actors and course changes release owned models once without disposing retained active actors',()=>{
 const root=new T.Group(),r=makeNativeDolphinRenderer(root);r.update({draws:[...actor(1),...actor(2)]},resources());const meshes=root.children[0].children;
 let first=0,second=0;meshes[0].geometry.addEventListener('dispose',()=>first++);meshes[5].geometry.addEventListener('dispose',()=>second++);
 r.update({draws:actor(1)},resources());assert.equal(first,0);assert.equal(second,1);
 const empty=resources();empty[0x9c/4]=3;r.update({draws:[]},empty);assert.equal(first,1);assert.equal(second,1);assert.ok(meshes.every(m=>!m.visible));
 r.dispose();r.dispose();assert.equal(first,1);assert.equal(second,1);assert.equal(root.children.length,0);assert.throws(()=>r.update({draws:[]},resources()),/disposed/);
});
