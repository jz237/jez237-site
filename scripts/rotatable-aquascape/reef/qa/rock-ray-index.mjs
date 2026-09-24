import assert from 'node:assert/strict';import * as T from 'three';import {rockRayIndex} from '../RockRayIndex.ts';import {erodedRock} from '../ReefRock.ts';
let state=28091;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
const mesh=new T.Mesh(erodedRock(.3,1,-.2,.8,.6,.7,random)),fast=rockRayIndex(mesh),ray=new T.Raycaster();let hits=0;
for(let i=0;i<600;i++){const origin=new T.Vector3(random()*3-1.2,random()*2.6-.3,random()*3-1.7),dir=new T.Vector3(.3,1,-.2).sub(origin).normalize();if(i%3===0)dir.set(random()-.5,random()-.5,random()-.5).normalize();const far=i%4===0?.1:3;
ray.set(origin,dir);ray.far=far;const expected=ray.intersectObject(mesh,false)[0],actual=fast(origin,dir,far);assert.equal(Boolean(actual),Boolean(expected));if(actual){hits++;assert.ok(actual.point.distanceTo(expected.point)<1e-7);assert.ok(actual.face.normal.dot(expected.face.normal)>.99999);}}
console.log('Attachment BVH agrees with Three.js for 600 rays,',hits,'hits, including short rays and inside starts.');
