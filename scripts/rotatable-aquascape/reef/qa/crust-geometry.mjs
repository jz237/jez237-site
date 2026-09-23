import assert from 'node:assert/strict';
import * as T from 'three';
import {coralCrust} from '../CoralCrust.ts';
import {erodedRock} from '../ReefRock.ts';
let seed=123;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rock=erodedRock(0,0,0,1,.8,.9,random),mesh=new T.Mesh(rock,new T.MeshBasicMaterial({side:T.DoubleSide}));
const ray=new T.Raycaster(new T.Vector3(0,0,3),new T.Vector3(0,0,-1));
const hit=ray.intersectObject(mesh)[0],crust=coralCrust(rock,hit.point,hit.face.normal,.65,.12,4);
assert.ok(crust.index.count>300&&crust.index.count<rock.index.count);
for(const a of Object.values(crust.attributes))assert.ok(a.array.every(Number.isFinite));
const p=crust.getAttribute('position'),n=crust.getAttribute('normal');let maxGap=0;
for(let i=0;i<p.count;i+=13){const point=new T.Vector3().fromBufferAttribute(p,i),normal=new T.Vector3().fromBufferAttribute(n,i);assert.ok(normal.length()>.99);
 ray.set(point.clone().addScaledVector(normal,.04),normal.clone().negate());ray.far=.15;
 const support=ray.intersectObject(mesh)[0];assert.ok(support,'every sampled tissue point stays on actual rock');
 const gap=support.distance-.04;assert.ok(gap>-.001&&gap<.055,'thin attached tissue, no floating lobes');maxGap=Math.max(maxGap,gap);
}
for(let i=0;i<crust.index.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i)),b=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i+1)),c=new T.Vector3().fromBufferAttribute(p,crust.index.getX(i+2));assert.ok(new T.Vector3().crossVectors(b.sub(a),c.sub(a)).length()>1e-10,'clipped triangles keep nonzero area');}
const bytes=Object.values(crust.attributes).reduce((s,a)=>s+a.array.byteLength,0)+crust.index.array.byteLength;
assert.ok(bytes<100000);
console.log('Encrusting tissue passed:',crust.index.count/3,'triangles,',bytes,'bytes, maximum sampled rock gap',maxGap);
