import assert from 'node:assert/strict';
import * as T from 'three';
import {reefButtresses} from '../ReefButtress.ts';
import {sandHeight} from '../ReefOptics.ts';
import {topSurfaceSampler} from '../RockSurface.ts';
const seeded=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
const detail=reefButtresses(seeded(2309231920));
assert.equal(detail.stats.rocks,9);assert.equal(detail.stats.colonies,4);
assert.equal(detail.stats.rockTriangles,95220);assert.ok(detail.stats.coralTriangles<150000);
assert.ok(detail.stats.polyps>80);assert.ok(detail.stats.tentacles>800);
assert.ok(detail.stats.maxAttachmentError<.00301);
for(let index=0;index<detail.rocks.length;index++){
 const rock=detail.rocks[index],p=rock.getAttribute('position'),o=detail.obstacles[index];
 let clearance=Infinity;
 for(let i=0;i<p.count;i++){
  const v=new T.Vector3().fromBufferAttribute(p,i);
  assert.ok(v.distanceTo(o.center)<=o.radius,'every actual stone vertex lies inside navigation bounds');
  clearance=Math.min(clearance,v.y-sandHeight(v.x,v.z));
 }
 if(index!==1&&index!==3)assert.ok(Math.abs(clearance+.035)<1e-6,'base stone is partly buried in actual terrain');
 else{
  const support=topSurfaceSampler([detail.rocks[index-1]]);let penetration=Infinity;
  for(let i=0;i<p.count;i++){
   const h=support(p.getX(i),2,p.getZ(i));if(h)penetration=Math.min(penetration,p.getY(i)-h.point.y);
  }
  assert.ok(penetration<-.05,'upper shoulder overlaps its supporting stone');
 }
}
// New growth must have finite geometry and the same attribute layouts used by
// the existing batches; no custom draw group is needed to carry this detail.
for(const g of [...detail.rocks,...detail.corals,...detail.gardens]){
 for(const a of Object.values(g.attributes))assert.ok(a.array.every(Number.isFinite));
 assert.ok(g.index&&g.index.count>0);g.dispose();
}
console.log('Reef outcrop support passed:',detail.stats);
