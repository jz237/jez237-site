import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {plantCurrent} from '../lib/PlantCurrent.ts';

// Exercise the scalar GLSL deformation itself, including its analytic normal.
// This catches detached petioles, incorrect moving highlights, and excess travel.
const material=new T.MeshPhysicalMaterial();
plantCurrent(material,{value:0},true);
const shader={uniforms:{},vertexShader:'',fragmentShader:''};
material.onBeforeCompile(shader,{});
const helpers=shader.vertexShader.slice(shader.vertexShader.indexOf('vec4 leafBend'),shader.vertexShader.indexOf('vec3 bendPlant'));
const scalarJS=helpers.replace(/vec[34] (\w+)\(([^)]*)\)/g,(_,name,args)=>`function ${name}(${args.replace(/vec3 /g,'')})`)
 .replace(/\b(?:float|vec4) (\w+)/g,'let $1').replace(/\b(sin|cos)\(/g,'Math.$1(');
const motion=new Function('waterTime','leafMotion','plantRoot',`const vec3=(x,y,z)=>({x,y,z}),vec4=(x,y,z,w)=>({x,y,z,w});${scalarJS};return {position:animatedLeaf,normal:animatedLeafNormal};`);
const v=(x,y,z)=>({x,y,z});
const length=p=>Math.hypot(p.x,p.y,p.z);
const sub=(a,b)=>v(a.x-b.x,a.y-b.y,a.z-b.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;

test('leaf petioles stay attached while free tips sweep and midribs curve',()=>{
 const tips=[];let curvature=0;
 for(let t=0;t<30;t+=.15){
  const f=motion(t,v(1.7,.3,.8),v(2,1,-1)).position;
  assert.deepEqual(f(v(0,0,0)),v(0,0,0));
  const tip=f(v(0,1,0)),middle=f(v(0,.5,0));tips.push(tip.z);
  curvature=Math.max(curvature,Math.abs(middle.z-tip.z*.5));
 }
 assert.ok(Math.max(...tips)-Math.min(...tips)>.5,'broad leaves must visibly flex');
 assert.ok(curvature>.04,'a moving blade must curve, not only rotate as a rigid sheet');
});

test('leaf displacement fits the clearance reserved during planting',()=>{
 for(let t=0;t<40;t+=.53)for(const phase of [0,1.9,4.8])for(let y=0;y<=1;y+=.1)for(const x of [-.55,0,.55]){
  const a=.4,p=v(x,y,-.15*y*y),f=motion(t,v(phase,a,.9),v(-3,1,1));
  assert.ok(length(sub(f.position({...p}),p))<=a*1.6+1e-8);
 }
});

test('animated normals remain perpendicular to the deformed leaf surface',()=>{
 const eps=1e-5;
 for(const t of [0,.7,2.4,7.3,14])for(const y of [.1,.5,.9]){
  const f=motion(t,v(1.7,.4,1.1),v(2,1,-1)),p=v(.2,y,0);
  const center=f.position({...p}),dx=sub(f.position(v(p.x+eps,y,0)),center),dy=sub(f.position(v(p.x,y+eps,0)),center);
  const n=f.normal(p,v(0,0,1));
  assert.ok(Number.isFinite(length(n)));
  assert.ok(Math.abs(dot(n,dx))/(length(n)*length(dx))<1e-4);
  assert.ok(Math.abs(dot(n,dy))/(length(n)*length(dy))<1e-4);
 }
});
