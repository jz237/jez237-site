import assert from 'node:assert/strict';
import * as T from 'three';
import {branchingColony,platingColony} from '../CoralMorphology.ts';
let seed=84;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const branches=branchingColony(new T.Vector3(),1,.8,random),plate=platingColony(0,0,0,1,.4),all=[...branches,plate];
let bytes=0,triangles=0;
for(const g of all){assert.ok(g.index,'keep shared vertices');triangles+=g.index.count/3;bytes+=g.index.array.byteLength;
 for(const a of Object.values(g.attributes)){assert.ok(a.array.every(Number.isFinite));bytes+=a.array.byteLength;}
 if(g.type==='TubeGeometry'){const n=g.getAttribute('normal'),s=g.parameters.radialSegments,steps=g.parameters.tubularSegments;for(let j=0;j<=steps;j++){const a=j*(s+1),b=a+s;assert.ok(new T.Vector3().fromBufferAttribute(n,a).distanceTo(new T.Vector3().fromBufferAttribute(n,b))<1e-6,'no hard longitudinal shading seam');}}
}
const normal=plate.getAttribute('normal'),p=plate.getAttribute('position'),half=p.count/2;let up=0,down=0;
for(let i=0;i<half;i++){up+=normal.getY(i);down+=normal.getY(i+half);}assert.ok(up/half>.65&&down/half<-.65,'plate surfaces face outwards');
assert.ok(bytes<2000000,'detailed colony and plate use less memory than the 2674320-byte prior geometry');
console.log('Stony coral geometry passed:',triangles,'triangles,',bytes,'bytes, outward plate tissue and smooth branch seams.');

// A coral foot follows a slope without bridging a separate lower shelf.
const slope=(x,z)=>x>.09?-.24:.35*x+.15*z;
const attached=branchingColony(new T.Vector3(),1,.8,random,slope).at(-1);
assert.equal(attached.name,'Rock-conforming colony base');
const ap=attached.getAttribute('position'),an=attached.getAttribute('normal');
assert.ok(attached.index.count>150,'retain a connected crust on the supported slope');
for(const index of attached.index.array){const x=ap.getX(index),z=ap.getZ(index);assert.ok(x<.091,'do not leave disconnected tissue on the lower shelf');assert.ok(Math.abs(ap.getY(index)-slope(x,z)-.003)<1e-6,'crust hugs the actual support');assert.ok(an.getY(index)>.8,'supported tissue faces outwards');}
console.log('Coral attachment passed: sloping support, outward normals and no detached lower-shelf fragments.');

// The same random seed produces genuinely different colony architecture while
// retaining the same branch/cup detail and bounded geometry allocation.
const fixture=style=>{let state=684;return branchingColony(new T.Vector3(),1,.8,()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;},undefined,style);};
const forms=['canopy','bushy','antler'].map(style=>{const meshes=fixture(style),bounds=new T.Box3();let count=0;for(const g of meshes){g.computeBoundingBox();bounds.union(g.boundingBox);count+=g.index.count;}return {style,meshes,bounds,count};});
assert.equal(forms[0].count,forms[1].count);assert.equal(forms[1].count,forms[2].count,'shape diversity does not multiply geometry');
assert.ok(forms[2].bounds.max.y>forms[0].bounds.max.y*1.1,'antler form grows taller than spreading canopy');
assert.ok(forms[0].bounds.max.x-forms[0].bounds.min.x>forms[2].bounds.max.x-forms[2].bounds.min.x,'canopy spreads farther laterally');
for(const {style,meshes} of forms){
 for(const g of meshes.filter(g=>g.type==='TubeGeometry')){const p=g.getAttribute('position'),{radialSegments:s,tubularSegments:steps,path,radius}=g.parameters,center=path.getPointAt(1);let mean=0;for(let k=0;k<s;k++)mean+=new T.Vector3().fromBufferAttribute(p,steps*(s+1)+k).distanceTo(center);assert.ok(mean/s>radius*.58,'rounded tips must not taper to needle points');}
 assert.deepEqual(meshes[0].getAttribute('position').array,fixture(style)[0].getAttribute('position').array,'art geometry stays reproducible');
}
console.log('Growth forms passed: distinct canopy, bushy and antler silhouettes; same detail count; rounded tips.');
