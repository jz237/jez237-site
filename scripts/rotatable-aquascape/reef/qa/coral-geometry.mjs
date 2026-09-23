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
