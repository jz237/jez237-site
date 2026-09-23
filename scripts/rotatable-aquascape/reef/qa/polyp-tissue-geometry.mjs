import assert from 'node:assert/strict';import * as T from 'three';import {encrustingGarden} from '../EncrustingPolyps.ts';
let state=41;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
const sample=(x,z)=>({point:new T.Vector3(x,.3*x-.18*z,z),normal:new T.Vector3(-.3,1,.18).normalize()});
const result=encrustingGarden(0,0,.5,'zoanthid',sample,random),g=result.geometry,p=g.attributes.position,n=g.attributes.normal,phase=g.attributes.polypPhase,flex=g.attributes.polypFlex;
// Inspect complete rings, not a shader uniform: flipped winding and disconnected
// tip/seam normals previously made these tiny tentacles look like angular spikes.
const stride=1658,body=482;assert.equal(p.count,result.polypCount*stride);
for(let poly=0;poly<result.polypCount;poly++){
 const start=poly*stride;assert.equal(flex.getX(start),0);
 for(let j=0;j<24;j++){
  const off=start+body+j*49,centers=[];
  for(let row=0;row<6;row++){
   const c=new T.Vector3();for(let k=0;k<7;k++)c.add(new T.Vector3().fromBufferAttribute(p,off+row*8+k));c.multiplyScalar(1/7);centers.push(c);
   const a=off+row*8,z=a+7;assert.ok(new T.Vector3().fromBufferAttribute(p,a).distanceTo(new T.Vector3().fromBufferAttribute(p,z))<1e-7);assert.ok(new T.Vector3().fromBufferAttribute(n,a).distanceTo(new T.Vector3().fromBufferAttribute(n,z))<1e-6,'joined seam normals');
   for(let k=0;k<7;k++){const i=a+k;assert.ok(new T.Vector3().fromBufferAttribute(p,i).sub(c).dot(new T.Vector3().fromBufferAttribute(n,i))>0,'outward tentacle skin');assert.equal(phase.getX(i),phase.getX(start));}
  }
  assert.ok(new T.Vector3().fromBufferAttribute(n,off+48).dot(centers[5].clone().sub(centers[4]))>0,'closed outward tip');
 }
}
let minArea=Infinity;for(let i=0;i<g.index.count;i+=3){const a=new T.Vector3().fromBufferAttribute(p,g.index.getX(i)),b=new T.Vector3().fromBufferAttribute(p,g.index.getX(i+1)),c=new T.Vector3().fromBufferAttribute(p,g.index.getX(i+2));minArea=Math.min(minArea,b.sub(a).cross(c.sub(a)).lengthSq());}assert.ok(minArea>1e-19,'nondegenerate soft polyp faces');
const bytes=Object.values(g.attributes).reduce((v,a)=>v+a.array.byteLength,0)+g.index.array.byteLength;assert.ok(bytes<7400000,'reviewed geometry budget for61full polyps');console.log('Soft polyp tissue: outward skin,closed tips,joined seams,rooted phases; bytes',bytes);
