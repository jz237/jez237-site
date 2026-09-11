import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {fernCurrent} from '../lib/FernCurrent.ts';

const shader={uniforms:{},vertexShader:''};
const material=new T.MeshPhysicalMaterial();fernCurrent(material,{value:0});material.onBeforeCompile(shader,{});
const helpers=shader.vertexShader.slice(shader.vertexShader.indexOf('vec4 fernFlow'));
const scalarJS=helpers.replace(/vec[34] (\w+)\(([^)]*)\)/g,(_,name,args)=>`function ${name}(${args.replace(/(?:vec3|float) /g,'')})`)
 .replace(/\b(?:float|vec4) (\w+)/g,'let $1').replace(/\b(sin|cos|max)\(/g,'Math.$1(');
const motion=new Function('fernTime','modelMatrix',`const vec4=(x,y,z,w)=>({x,y,z,w});${scalarJS};return {position:fernBend,normal:fernNormal};`);
const xyz=p=>new T.Vector3(p.x,p.y,p.z);

test('fern current anchors the base and stays bounded throughout a varying cycle',()=>{
 const tips=[];
 for(let t=0;t<30;t+=.13){
  const f=motion(t,[null,null,null,{x:2,z:-1}]).position;
  assert.deepEqual(f({x:.2,y:0,z:-.1}),{x:.2,y:0,z:-.1});
  for(const h of [.1,.25,.43]){
   const p=new T.Vector3(.2,h,-.1),q=xyz(f({...p}));
   assert.ok(q.distanceTo(p)<=h*h*.31+1e-9);
   if(h===.43)tips.push(q.x);
  }
 }
 assert.ok(Math.max(...tips)-Math.min(...tips)>.07);
});

test('fern lighting normals follow both directions of the moving frond',()=>{
 const n=new T.Vector3(.3,.7,.2).normalize(),a=n.clone().cross(new T.Vector3(1,0,0)).normalize(),b=n.clone().cross(a).normalize(),eps=1e-6;
 for(const t of [0,.7,3.1,12])for(const h of [.05,.2,.4]){
  const f=motion(t,[null,null,null,{x:2,z:-1}]),p=new T.Vector3(.2,h,-.1),center=xyz(f.position({...p})),normal=xyz(f.normal({...p},{...n})).normalize();
  for(const tangent of [a,b]){
   const q=p.clone().addScaledVector(tangent,eps),deformed=xyz(f.position({...q})).sub(center).normalize();
   assert.ok(Math.abs(normal.dot(deformed))<1e-5);
  }
 }
});
