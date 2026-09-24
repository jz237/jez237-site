import assert from 'node:assert/strict';
import * as T from 'three';
import {surfaceColony} from '../SurfaceColony.ts';
for(const normal of [new T.Vector3(0,1,0),new T.Vector3(.3,.65,.7).normalize(),new T.Vector3(0,.2,1).normalize()]){
 const rock=new T.PlaneGeometry(3,3,16,16);rock.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),normal));
 const support=new T.Mesh(rock,new T.MeshBasicMaterial({side:T.DoubleSide}));let seed=45;
 const colony=surfaceColony(support,new T.Vector3(),normal,.5,.23,()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;});
 let primaryRoots=0;
 for(const geometry of colony.geometries){
  for(const a of Object.values(geometry.attributes))assert.ok(a.array.every(Number.isFinite));
  const p=geometry.getAttribute('position');for(let i=0;i<p.count;i++)assert.ok(new T.Vector3().fromBufferAttribute(p,i).distanceTo(colony.obstacle.center)<=colony.obstacle.radius,'navigation encloses transformed tissue');
  if(geometry.type==='TubeGeometry'&&geometry.parameters.tubularSegments===8){
   const root=geometry.parameters.path.getPointAt(0).applyMatrix4(colony.transform);assert.ok(Math.abs(root.dot(normal))<.012,'primary roots remain attached after arbitrary face orientation');primaryRoots++;
  }
 }
 assert.ok(primaryRoots>=7);assert.ok(colony.triangles<45000,'five-section terminal shoulders retain every original branch/cup within45000triangles');assert.ok(colony.geometries.at(-1).index.count>0,'living foot hugs the support');
 const axis=new T.Vector3(0,1,0).transformDirection(colony.transform);assert.ok(axis.y>.65&&axis.dot(normal)>.7,'growth rises toward open water');
 console.log('Sloping colony passed:',normal.toArray(),primaryRoots,'roots,',colony.triangles,'triangles');
}
