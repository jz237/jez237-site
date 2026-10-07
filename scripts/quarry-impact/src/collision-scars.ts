import * as T from 'three';
import {dentGeometry} from './wreck-geometry';
import type {VehicleSurface} from './vehicle-surface';

/** Make a small permanent dent on actual visible bodywork without changing
 * health or mechanical components. Collider witnesses can sit just beyond the
 * painted mesh; fall back to the nearest visible panel vertex in that case. */
export function markCollision(panels:readonly T.Mesh[],contact:T.Vector3,direction:T.Vector3,surface:VehicleSurface,paint?:T.Color){
 const strength=1.4,axis=direction.clone();if(axis.lengthSq()<1e-12)axis.set(0,0,-1);else axis.normalize();
 const eligible=panels.filter(p=>{
  if(!p.userData.wreckRest||p.userData.constructionRole==='engine')return false;
  for(let node:T.Object3D|null=p;node;node=node.parent)if(!node.visible)return false;
  return true;
 });
 // Center the small field on reachable bodywork. A collider witness may lie
 // outside the skin or in an open cockpit; a barely overlapping field can
 // otherwise change vertices by an invisible fraction of a millimetre.
 let at:T.Vector3|undefined,best=Infinity;const vertex=new T.Vector3();
 const bounds=new T.Box3();
 for(const panel of eligible){
  if(!panel.geometry.boundingBox)panel.geometry.computeBoundingBox();
  if(bounds.copy(panel.geometry.boundingBox!).applyMatrix4(panel.userData.wreckToModel).distanceToPoint(contact)**2>best)continue;
  const position=panel.geometry.attributes.position,toModel=panel.userData.wreckToModel as T.Matrix4;
  for(let i=0;i<position.count;i++){vertex.fromBufferAttribute(position,i).applyMatrix4(toModel);const distance=vertex.distanceToSquared(contact);if(distance<best){best=distance;at=vertex.clone();}}
 }
 if(!at)return false;
 let marked=false;
 for(const panel of eligible){
  if(dentGeometry(panel,at,axis,strength)>0){
   // Even a shallow dent needs an observable finish change. Reuse the existing
   // persistent primer/metal shader instead of adding a transient hit effect.
   const wear=panel.geometry.attributes.impactWear,position=panel.geometry.attributes.position;
   for(let i=0;i<position.count;i++){
    vertex.fromBufferAttribute(position,i).applyMatrix4(panel.userData.wreckToModel);
    const weight=Math.max(0,1-vertex.distanceTo(at)/.6);
    if(weight>0)wear.setXY(i,Math.min(1,wear.getX(i)+weight*.72),Math.min(1,wear.getY(i)+weight*.48));
   }
   wear.needsUpdate=true;surface.transfer(panel,at,8,paint);marked=true;
  }
 }
 return marked;
}
