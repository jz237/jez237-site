import assert from 'node:assert/strict';
import * as T from 'three';
import {encrustingGarden} from '../EncrustingPolyps.ts';
let seed=728;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(const kind of ['zoanthid','stony']){
 const normal=new T.Vector3(-.3,1,.18).normalize();
 const sample=(x,z)=>({point:new T.Vector3(x,.3*x-.18*z,z),normal});
 const result=encrustingGarden(0,0,.5,kind,sample,random),g=result.geometry,p=g.getAttribute('position'),n=g.getAttribute('normal'),flex=g.getAttribute('polypFlex');
 assert.ok(g.index);assert.ok(result.polypCount>20);assert.ok(result.attachmentError<.00301);
 assert.equal(result.tentacleCount,kind==='zoanthid'?result.polypCount*24:0);
 let flexible=0,highest=0;
 for(let i=0;i<p.count;i++){
  assert.ok(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i)+n.getX(i)+n.getY(i)+n.getZ(i)));assert.ok(flex.getX(i)>=0&&flex.getX(i)<=1);flexible+=flex.getX(i)>0?1:0;
  highest=Math.max(highest,(p.getY(i)-.3*p.getX(i)+.18*p.getZ(i))/Math.sqrt(1+.3**2+.18**2));
 }
 assert.ok(highest<.085,'no spherical colony support protrudes from rock');
 assert.equal(flexible>0,kind==='zoanthid','only soft tentacle fringes move');
 // Empty support must not manufacture a floating mat or a free-standing polyp.
 const empty=encrustingGarden(0,0,.5,kind,()=>null,random);assert.equal(empty.polypCount,0);assert.equal(empty.geometry.index.count,0);
 console.log(kind,result.polypCount,'polyps',result.tentacleCount,'tentacles',g.index.count/3,'triangles');
}
