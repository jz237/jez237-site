import assert from 'node:assert/strict';
import * as T from 'three';
import {reefAnemoneBackdrop} from '../ReefAnemoneBackdrop.ts';
import {sandHeight} from '../ReefOptics.ts';
const seeded=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
const d=reefAnemoneBackdrop(seeded(2309240417));
assert.ok(d.stats.triangles<750000,'outer outcrop plus detailed inner arch backing stays within reviewed geometry budget');
for(const [i,g] of d.rocks.entries()){
 const p=g.getAttribute('position');let gap=Infinity;
 for(let j=0;j<p.count;j++){
  const v=new T.Vector3().fromBufferAttribute(p,j);
  assert.ok([v.x,v.y,v.z].every(Number.isFinite));
  assert.ok(Math.abs(v.x)<5.04&&Math.abs(v.z)<2.3,'stones remain inside glass');
  assert.ok(d.obstacles.some(o=>v.distanceTo(o.center)<=o.radius),'navigation encloses all new rock');
  gap=Math.min(gap,v.y-sandHeight(v.x,v.z));
 }
 if(i<2||i===7)assert.ok(Math.abs(gap+.035)<1e-6,'base stones settle into uneven sand');
}
// A broad rear sightline must actually intersect solid volume, not a flat card.
const m=new T.MeshBasicMaterial(),meshes=d.rocks.map(g=>new T.Mesh(g,m)),ray=new T.Raycaster();let hit=0,total=0;
for(let x=3.7;x<=4.5;x+=.1)for(let y=.65;y<=2.65;y+=.1){total++;ray.set(new T.Vector3(x,y,1.5),new T.Vector3(0,0,-1));if(ray.intersectObjects(meshes,false).length)hit++;}
assert.ok(hit/total>.85,'outcrop covers rear anemone sightline');
console.log('Anemone backing geometry:',{...d.stats,coverage:hit/total});

let innerHits=0,innerTotal=0;
for(let x=1.8;x<=2.9;x+=.1)for(let y=.65;y<=2.35;y+=.1){innerTotal++;ray.set(new T.Vector3(x,y,3),new T.Vector3(0,0,-1));if(ray.intersectObjects(meshes,false).length)innerHits++;}
assert.ok(innerHits/innerTotal>.9,'inner arch behind the host must be backed by live rock instead of exposed rear glass');
for(const g of d.rocks.slice(7)){g.computeBoundingBox();assert.ok(g.boundingBox.min.x>1.25,'preserve the central sand channel');assert.ok(g.boundingBox.max.z<-.8,'new backing remains behind the foreground arch');}
console.log('Inner arch backing coverage:',innerHits/innerTotal);
