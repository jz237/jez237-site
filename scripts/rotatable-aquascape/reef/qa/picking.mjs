import assert from 'node:assert/strict';import * as T from 'three';
import {accelerateReefPicking} from '../ReefPicking.ts';
import {identifyGeometry,mergeIdentified,noteForHit} from '../ReefIdentification.ts';
import {optimizeReefDrawOrder,reefDrawOrderReady} from '../ReefDrawOrder.ts';
const parts=Array.from({length:20},(_,i)=>identifyGeometry(new T.SphereGeometry(.23,24,16).translate(i%5*.7,Math.floor(i/5)*.7,Math.sin(i)*.12),{title:'Colony '+i,description:''}));
const nested=mergeIdentified([mergeIdentified(parts.slice(0,8)),...parts.slice(8,15)]),old=mergeIdentified([nested,...parts.slice(15)]),flat=mergeIdentified(parts);
for(const name of Object.keys(old.attributes))assert.deepEqual(flat.getAttribute(name).array,old.getAttribute(name).array,'single merge preserves '+name);
assert.deepEqual(flat.index.array,old.index.array);assert.deepEqual(flat.userData.identification,old.userData.identification);
const mesh=new T.Mesh(flat,new T.MeshBasicMaterial({side:T.DoubleSide}));mesh.position.set(-1,-.4,.2);mesh.rotation.y=.21;mesh.scale.set(1.2,.9,.7);mesh.updateMatrixWorld();
await reefDrawOrderReady;optimizeReefDrawOrder(mesh);
const native=mesh.raycast,ray=new T.Raycaster(),rays=[];
for(let y=-.6;y<2.5;y+=.18)for(let x=-1.6;x<3;x+=.19)rays.push([new T.Vector3(x,y,4),new T.Vector3(0,0,-1)]);
rays.push([new T.Vector3(0,0,0),new T.Vector3(1,0,0)]);
const expected=rays.map(([o,d])=>{ray.set(o,d);return ray.intersectObject(mesh,false).map(h=>({distance:h.distance,face:h.faceIndex,note:noteForHit(h)?.title}));});
const stats=accelerateReefPicking(mesh);assert.equal(stats.meshes,1);assert.ok(stats.bytes<flat.index.array.byteLength*.1);
for(let i=0;i<rays.length;i++){ray.set(...rays[i]);const hits=ray.intersectObject(mesh,false).map(h=>({distance:h.distance,face:h.faceIndex,note:noteForHit(h)?.title}));assert.deepEqual(hits,expected[i],'exact intersections and labels survive bounds filtering');assert.deepEqual(flat.drawRange,{start:0,count:Infinity});}
// Mutation and partial draws must use the native path rather than stale bounds.
for(const mutate of [()=>flat.setDrawRange(3,123),()=>{flat.setDrawRange(0,Infinity);flat.translate(4,0,0);}]){
 mutate();ray.set(new T.Vector3(3,.5,4),new T.Vector3(0,0,-1));const a=[];native.call(mesh,ray,a);const b=ray.intersectObject(mesh,false);assert.deepEqual(b.map(h=>h.faceIndex),a.sort((x,y)=>x.distance-y.distance).map(h=>h.faceIndex));
}
console.log('Exact picking matches native rays, labels, transforms and mutation fallback:',stats,rays.length,'rays');
