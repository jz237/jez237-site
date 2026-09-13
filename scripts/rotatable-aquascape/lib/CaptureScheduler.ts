import {Matrix4,Quaternion,Vector3,type Camera} from 'three';

/** Full-resolution captures share a frame budget; the main view never waits for
 * a complete cycle. Oldest-first service bounds every active map's age, including
 * during continuous orbiting. A new view/lesson gets a complete fresh set. */
export class CaptureScheduler{
 private frame=0;
 private completed=new Map<string,number>();
 private position=new Vector3();private rotation=new Quaternion();private projection=new Matrix4();
 private revision:string|null=null;
 invalidate(){this.revision=null;}
 select(ids:readonly string[],camera:Camera,revision:string,limited:boolean){
  camera.updateMatrixWorld();
  const position=new Vector3().setFromMatrixPosition(camera.matrixWorld),rotation=new Quaternion().setFromRotationMatrix(camera.matrixWorld);
  const jump=this.revision!==revision||this.position.distanceToSquared(position)>2.25||this.rotation.angleTo(rotation)>.25||Math.abs(this.projection.elements[0]-camera.projectionMatrix.elements[0])>.25||Math.abs(this.projection.elements[5]-camera.projectionMatrix.elements[5])>.25;
  this.position.copy(position);this.rotation.copy(rotation);this.projection.copy(camera.projectionMatrix);this.revision=revision;
  this.frame++;
  const active=new Set(ids);
  for(const id of this.completed.keys())if(!active.has(id))this.completed.delete(id);
  if(!limited||jump)return active;
  // Newly visible mirrors must not display an empty or previous-view texture.
  const fresh=ids.filter(id=>!this.completed.has(id));
  if(fresh.length)return new Set(fresh);
  let oldest:string|undefined;
  for(const id of ids)if(oldest===undefined||this.completed.get(id)!<this.completed.get(oldest)!)oldest=id;
  return new Set(oldest===undefined?[]:[oldest]);
 }
 complete(ids:Iterable<string>){for(const id of ids)this.completed.set(id,this.frame);}
}
