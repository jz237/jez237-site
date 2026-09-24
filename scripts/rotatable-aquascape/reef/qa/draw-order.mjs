import assert from 'node:assert/strict';
import * as T from 'three';
import {reefDrawOrderReady,optimizeReefDrawOrder} from '../ReefDrawOrder.ts';
import {branchingColony} from '../CoralMorphology.ts';
import {buildAnemones} from '../Anemones.ts';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
let seed=84;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const coral=mergeGeometries(branchingColony(new T.Vector3(),1,.8,random),false);
const anemone=buildAnemones([new T.Vector3(3,1,.8),new T.Vector3(-3,.8,1)],{value:0},random,p=>p.y-.28).mesh;
const faceSet=a=>{const out=[];for(let i=0;i<a.length;i+=3){const t=[a[i],a[i+1],a[i+2]],k=t.indexOf(Math.min(...t));out.push([t[k],t[(k+1)%3],t[(k+2)%3]].join(','));}return out.sort();};
const misses=a=>{const cache=[];let n=0;for(const v of a){const i=cache.indexOf(v);if(i<0){n++;if(cache.length===32)cache.pop();}else cache.splice(i,1);cache.unshift(v);}return n;};
await reefDrawOrderReady;
for(const mesh of [new T.Mesh(coral,new T.MeshStandardMaterial()),anemone]){
 const geometry=mesh.geometry,old=geometry.index.array.slice(),attrs=Object.fromEntries(Object.entries(geometry.attributes).map(([k,a])=>[k,a.array.slice()]));
 const before=misses(old),stats=optimizeReefDrawOrder(mesh),after=misses(geometry.index.array);
 assert.equal(stats.meshes,1);assert.equal(stats.triangles,old.length/3);
 assert.deepEqual(faceSet(geometry.index.array),faceSet(old),'identical oriented faces: no dropped/reversed detail');
 for(const [k,a] of Object.entries(geometry.attributes))assert.deepEqual(a.array,attrs[k],'byte-identical '+k);
 assert.ok(after<=before,'vertex-cache work must not increase');console.log({name:mesh.name||'coral',before,after,triangles:stats.triangles});
}
const transparent=new T.Mesh(coral.clone(),new T.MeshBasicMaterial({transparent:true}));assert.equal(optimizeReefDrawOrder(transparent).meshes,0);
const grouped=new T.Mesh(coral.clone(),new T.MeshBasicMaterial());grouped.geometry.addGroup(0,3,0);assert.equal(optimizeReefDrawOrder(grouped).meshes,0);
const partial=new T.Mesh(coral.clone(),new T.MeshBasicMaterial());partial.geometry.setDrawRange(3,30);assert.equal(optimizeReefDrawOrder(partial).meshes,0);
console.log('Opaque submission preserves every triangle and attribute; grouped, partial and transparent draws remain untouched.');
