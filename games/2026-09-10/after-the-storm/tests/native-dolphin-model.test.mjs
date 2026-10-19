import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {makeNativeDolphinParts} from '../native-dolphin-model.js';
import {makeNativeActorRenderer} from '../native-actor-render.js';
const flip=()=>new T.Matrix4().makeScale(-1,-1,1);
const draws=(front=new T.Matrix4(),back=flip())=>[24,28,16,20,20].map(partOffset=>({actorIndex:2,resourceIndex:0,bufferIndex:1,partOffset,matrixWorld:(partOffset===28?back:front).toArray()}));
const near=(a,b)=>a.forEach((v,i)=>assert.ok(Math.abs(v-b[i])<1e-10));

test('dense continuous body has outward normals, fixed head weights and a smoothly blended posterior',()=>{
 const model=makeNativeDolphinParts(),g=model.part(24).geometry,p=g.attributes.position,n=g.attributes.normal,w=g.attributes.sourceTailWeight;
 assert.ok(p.count>30000);assert.equal(w.count,p.count);assert.equal(g.groups.length,4);assert.equal(model.part(28).geometry.drawRange.count,0);
 const body=g.groups[0];let partial=0;
 for(let i=body.start;i<body.start+body.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);assert.ok(Number.isFinite(n.getX(i)+n.getY(i)+n.getZ(i)));
  if(Math.abs(y)+Math.abs(z)>1)assert.ok(y*n.getY(i)+z*n.getZ(i)>=-1e-5,'body normal faces outward');
  assert.ok(w.getX(i)>=0&&w.getX(i)<=1);if(x>=20)assert.equal(w.getX(i),0);else if(x<=-450)assert.equal(w.getX(i),1);else partial++;
 }
 assert.ok(partial>5000);for(const group of g.groups.slice(2))for(let i=group.start;i<group.start+group.count;i++)assert.equal(w.getX(i),0,'eye stays with head');
 assert.ok(model.part(16).geometry.attributes.position.count>3000);assert.ok(model.part(20).geometry.attributes.position.count>3000);model.dispose();
});

test('original front and rear transforms drive skin in model space without changing source mesh data',()=>{
 const model=makeNativeDolphinParts(),front=new T.Matrix4().makeRotationY(.7).scale(new T.Vector3(.00375,.00375,.00375)).setPosition(10,20,30),bend=new T.Matrix4().makeRotationZ(.4).setPosition(3,-2,1),back=front.clone().multiply(bend).multiply(flip());
 const input=draws(front,back),before=structuredClone(input),prepared=model.preparePose(input);
 near(prepared.matrix,bend.elements);near(prepared.normalMatrix,new T.Matrix3().getNormalMatrix(bend).elements);assert.deepEqual(input,before);
 const part=model.part(24),shader={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader},positions=part.geometry.attributes.position.array.slice();
 part.material[0].onBeforeCompile(shader);assert.match(shader.vertexShader,/sourceTailWeight/);assert.match(shader.vertexShader,/objectNormal=mix/);assert.match(shader.vertexShader,/transformed=mix/);
 model.commitPose(prepared);near(shader.uniforms.dolphinTailMatrix.value.elements,bend.elements);assert.deepEqual(part.geometry.attributes.position.array,positions);
 const neutral=model.preparePose(draws());model.commitPose(neutral);near(shader.uniforms.dolphinTailMatrix.value.elements,new T.Matrix4().elements);model.dispose();
});

test('complete pose validation precedes uniform mutation and the renderer accepts the transform-only rear part',()=>{
 const model=makeNativeDolphinParts(),shader={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader};model.part(24).material[0].onBeforeCompile(shader);
 const valid=draws(),pose=model.preparePose(valid);model.commitPose(pose);const before=shader.uniforms.dolphinTailMatrix.value.clone();
 const invalid=[valid.slice(0,4),valid.map((d,i)=>i===4?{...d,actorIndex:3}:d),valid.map((d,i)=>i===1?{...d,partOffset:24}:d),valid.map((d,i)=>i===1?{...d,matrixWorld:Array(16).fill(0)}:d),valid.map((d,i)=>i===0?{...d,matrixWorld:d.matrixWorld.map(()=>NaN)}:d)];
 for(const value of invalid){assert.throws(()=>model.preparePose(value));assert.ok(shader.uniforms.dolphinTailMatrix.value.equals(before));}
 assert.throws(()=>model.commitPose({matrix:Array(16).fill(0),normalMatrix:[NaN]}));assert.ok(shader.uniforms.dolphinTailMatrix.value.equals(before));
 const root=new T.Group(),renderer=makeNativeActorRenderer(root,{getPart:d=>model.part(d.partOffset)});assert.deepEqual(renderer.update({draws:valid}),{parts:5,actors:1});
 assert.equal(root.children[0].children[1].geometry.drawRange.count,0);assert.equal(root.children[0].children[0].geometry,model.part(24).geometry);
 const resources=new Set([24,28,16,20].flatMap(i=>{const p=model.part(i);return [p.geometry,...(Array.isArray(p.material)?p.material:[p.material])];}));let disposed=0;for(const r of resources)r.addEventListener('dispose',()=>disposed++);
 renderer.dispose();assert.equal(disposed,0);model.dispose();model.dispose();assert.equal(disposed,resources.size);assert.throws(()=>model.part(24),/disposed/);
});
