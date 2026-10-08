import * as T from 'three';
import {constructionResponse,type ConstructionRole} from './vehicle-construction';
import {queueWreckNormals} from './wreck-batch';
import {computeWreckNormals,computeWreckBounds} from './wreck-normals';
import {finishCoupeNormals,stampCoupeImpact} from './coupe-realism';
const bounds=new T.Box3();
const finish=(mesh:T.Mesh)=>{computeWreckNormals(mesh.geometry);finishCoupeNormals(mesh);};
/** Light contacts use one smooth shallow compression, not the eight-stage fold
 * integration used for structural crashes. Paint and wear share this pass. */
export function scuffGeometry(mesh:T.Mesh,contact:T.Vector3,direction:T.Vector3,paint?:T.Color){
 const geometry=mesh.geometry,position=geometry.attributes.position,rest=mesh.userData.wreckRest as T.BufferAttribute;
 const to=mesh.userData.wreckToModel as T.Matrix4,from=mesh.userData.wreckFromModel as T.Matrix4;
 const radius=.7,radius2=radius*radius;
 if(!geometry.boundingBox)geometry.computeBoundingBox();
 if(bounds.copy(geometry.boundingBox!).applyMatrix4(to).distanceToPoint(contact)>=radius)return false;
 const wear=geometry.attributes.impactWear,transfer=geometry.attributes.transferPaint;
 const orig=new T.Vector3(),current=new T.Vector3(),offset=new T.Vector3();let changed=false;
 for(let i=0;i<position.count;i++){
  current.fromBufferAttribute(position,i).applyMatrix4(to);const distance2=current.distanceToSquared(contact);if(distance2>=radius2)continue;
  orig.fromBufferAttribute(rest,i);const weight=(1-distance2/radius2)**2;
  const construction=constructionResponse(orig.x,orig.y,orig.z,direction.y,mesh.userData.constructionRole as ConstructionRole);
  const roof=T.MathUtils.smoothstep(orig.y,1.1,1.5)*(1-Math.abs(direction.y));
  const strength=.04*weight*(1-roof*.64)*construction.strength*Math.max(0,1-current.distanceToSquared(orig)/.81);
  current.addScaledVector(direction,strength);offset.copy(current).sub(orig);
  if(offset.lengthSq()>construction.budget**2)current.copy(orig).add(offset.setLength(construction.budget));
  current.applyMatrix4(from);position.setXYZ(i,current.x,current.y,current.z);
  if(wear)wear.setXY(i,Math.min(1,wear.getX(i)+weight*.72),Math.min(1,wear.getY(i)+weight*.48));
  if(paint&&transfer){const paintWeight=Math.max(0,1-orig.distanceTo(contact)/.71);if(paintWeight>0)transfer.setXYZW(i,paint.r,paint.g,paint.b,Math.min(.8,transfer.getW(i)+paintWeight*.096));}
  changed=true;
 }
 if(!changed)return false;
 position.needsUpdate=true;if(wear)wear.needsUpdate=true;if(paint&&transfer)transfer.needsUpdate=true;
 queueWreckNormals(mesh,finish);stampCoupeImpact(mesh,contact.clone().applyMatrix4(from),direction.clone().transformDirection(from),1.4);computeWreckBounds(geometry);return true;
}
