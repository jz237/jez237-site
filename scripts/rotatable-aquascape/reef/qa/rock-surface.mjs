import assert from 'node:assert/strict';
import * as T from 'three';
import {topSurfaceSampler} from '../RockSurface.ts';
const geometries=[new T.IcosahedronGeometry(1,5),new T.IcosahedronGeometry(.6,4).translate(.45,1.1,.1)];
const fast=topSurfaceSampler(geometries),meshes=geometries.map(g=>new T.Mesh(g,new T.MeshBasicMaterial())),ray=new T.Raycaster();
let comparisons=0;
for(let x=-1.1;x<=1.1;x+=.091)for(let z=-1.1;z<=1.1;z+=.107)for(const top of [.65,2.5]){
 ray.set(new T.Vector3(x,top,z),new T.Vector3(0,-1,0));ray.far=2.5;const hit=ray.intersectObjects(meshes,false)[0],sample=fast(x,top,z);assert.equal(Boolean(sample),Boolean(hit));if(hit){assert.ok(sample.point.distanceTo(hit.point)<1e-7);assert.ok(sample.normal.dot(hit.face.normal)>.999999);comparisons++;}
}
console.log('Rock attachment index matches Three.js raycasts:',comparisons,'hits, including overhangs and depth limits.');
