import * as T from 'three';
import {scuffGeometry} from './collision-scar-geometry';
import type {VehicleSurface} from './vehicle-surface';

/** Make a small permanent dent on actual visible bodywork without changing
 * health or mechanical components. Collider witnesses can sit just beyond the
 * painted mesh; fall back to the nearest visible panel vertex in that case. */
export function markCollision(panels:readonly T.Mesh[],contact:T.Vector3,direction:T.Vector3,_surface:VehicleSurface,paint?:T.Color){
 const axis=direction.clone();if(axis.lengthSq()<1e-12)axis.set(0,0,-1);else axis.normalize();
 const eligible=panels.filter(p=>{
  if(!p.userData.wreckRest||p.userData.constructionRole==='engine')return false;
  for(let node:T.Object3D|null=p;node;node=node.parent)if(!node.visible)return false;
  return true;
 });
 // Center the small field on reachable bodywork. A collider witness may lie
 // outside the skin or in an open cockpit; a barely overlapping field can
 // otherwise change vertices by an invisible fraction of a millimetre.
 let at:T.Vector3|undefined,best=Infinity,bestOrder=Infinity;const vertex=new T.Vector3();
 const bounds=new T.Box3();
 // Search the nearest panel bounds first, retaining original panel/vertex
 // order for equal-distance witnesses so the selected bodywork stays stable.
 const candidates=eligible.map((panel,order)=>{
  if(!panel.geometry.boundingBox)panel.geometry.computeBoundingBox();
  return{panel,order,distance:bounds.copy(panel.geometry.boundingBox!).applyMatrix4(panel.userData.wreckToModel).distanceToPoint(contact)**2};
 }).sort((a,b)=>a.distance-b.distance||a.order-b.order);
 for(const {panel,order,distance:lowerBound}of candidates){
  if(lowerBound>best)break;
  const position=panel.geometry.attributes.position,toModel=panel.userData.wreckToModel as T.Matrix4;
  for(let i=0;i<position.count;i++){vertex.fromBufferAttribute(position,i).applyMatrix4(toModel);const distance=vertex.distanceToSquared(contact);if(distance<best||distance===best&&order<bestOrder){best=distance;bestOrder=order;at=vertex.clone();}}
 }
 if(!at)return false;
 let marked=false;
 for(const panel of eligible)if(scuffGeometry(panel,at,axis,paint))marked=true;
 return marked;
}
