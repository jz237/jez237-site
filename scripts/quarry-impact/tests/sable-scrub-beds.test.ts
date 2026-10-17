import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import * as T from 'three';
import {createSableGroundcover} from '../src/sable-groundcover';import {SABLE} from '../src/sable-course';
test('scrub beds fade completely at their boundaries and conform to the canyon terrain',()=>{
 const cover=createSableGroundcover();try{
 const mesh=cover.root.getObjectByName('weathered-scrub-beds') as T.Mesh,geometry=mesh.geometry,p=geometry.attributes.position,color=geometry.attributes.color,index=geometry.index!;
 assert.equal(color.itemSize,4);assert.equal(p.count%49,0);assert.ok(p.count>0);let minimumClearance=Infinity;
 for(let base=0;base<p.count;base+=49){
  assert.ok(color.getW(base)>.2);
  for(let j=0;j<16;j++){assert.equal(color.getW(base+33+j),0);assert.ok(color.getW(base+1+j)>0);assert.ok(color.getW(base+17+j)>0);}
 }
 for(let i=0;i<p.count;i++){assert.ok(Math.abs(p.getY(i)-SABLE.height(p.getX(i),p.getZ(i))-.025)<1e-4);assert.ok(color.getW(i)>=0&&color.getW(i)<=.35);}
 for(let i=0;i<index.count;i+=3){const a=new T.Vector2(p.getX(index.getX(i)),p.getZ(index.getX(i))),b=new T.Vector2(p.getX(index.getX(i+1)),p.getZ(index.getX(i+1))),c=new T.Vector2(p.getX(index.getX(i+2)),p.getZ(index.getX(i+2)));const center=a.clone().add(b).add(c).multiplyScalar(1/3),radius=Math.max(center.distanceTo(a),center.distanceTo(b),center.distanceTo(c));minimumClearance=Math.min(minimumClearance,SABLE.distance(center.x,center.y)-radius);}
 assert.ok(minimumClearance>24,'entire ground decal triangles remain off the racing corridor');
 assert.equal(createHash('sha256').update(JSON.stringify(cover.root.userData.placements)).digest('hex'),'66788bc93d7d1a8b26e01c1b43dd3dfb6f7b5dffd9df73a2660168256db45b3b','all prior shrubs and stones retain identical placement');
 }finally{cover.dispose();}
});
