import assert from 'node:assert/strict';
import * as T from 'three';
import {reefFootGardens} from '../ReefFootGardens.ts';
import {sandHeight} from '../ReefOptics.ts';
let seed=2309232345;const random=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
const f=reefFootGardens(random);assert.equal(f.stats.rocks,10);assert.ok(f.stats.polyps>80);assert.ok(f.stats.triangles<550000);assert.ok(f.stats.maxAttachmentError<.00301);
for(let i=0;i<f.rocks.length;i++){
 const p=f.rocks[i].getAttribute('position'),o=f.obstacles[i];let gap=Infinity;
 for(let j=0;j<p.count;j++){const v=new T.Vector3().fromBufferAttribute(p,j);assert.ok(v.distanceTo(o.center)<=o.radius);gap=Math.min(gap,v.y-sandHeight(v.x,v.z));}
 assert.ok(Math.abs(gap+.035)<1e-6,'fragments buried against actual sand surface');
}
console.log('Fine reef foot gardens:',f.stats);
