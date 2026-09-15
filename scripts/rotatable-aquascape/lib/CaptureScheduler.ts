import {Matrix4,Quaternion,Vector3,type Camera} from 'three';

/** Reflection captures shade the whole scene; shadow captures only write depth.
 * Interleave these classes instead of clustering three expensive views together. */
export function interleaveCaptures(shadows:readonly string[],mirrors:readonly string[]){
 const jobs:string[]=[];
 for(let i=0;i<Math.max(shadows.length,mirrors.length);i++){
  if(i<shadows.length)jobs.push(shadows[i]);
  if(i<mirrors.length)jobs.push(mirrors[i]);
 }
 return jobs;
}

/** Full-resolution captures share a frame budget; the main view never waits for
 * a complete cycle. Oldest-first service bounds every active map's age, including
 * during continuous orbiting. A new view/lesson gets a complete fresh set. */
export class CaptureScheduler{
 private frame=0;
 private completed=new Map<string,number>();
 private position=new Vector3();private rotation=new Quaternion();private projection=new Matrix4();
 private revision:string|null=null;
 invalidate(){this.revision=null;}
 select(ids:readonly string[],camera:Camera,revision:string,limited:boolean,cadence=1){
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
  // Only secondary capture cadence changes; the main view is always drawn.
  if(cadence>1&&this.frame%cadence!==0)return new Set<string>();
  let oldest:string|undefined;
  for(const id of ids)if(oldest===undefined||this.completed.get(id)!<this.completed.get(oldest)!)oldest=id;
  return new Set(oldest===undefined?[]:[oldest]);
 }
 complete(ids:Iterable<string>){for(const id of ids)this.completed.set(id,this.frame);}
}


/** Respond to sustained slow presentation, not one loading/GC hiccup. Keep the
 * adjustment bounded to alternating frames and use a long recovery window so
 * a device does not repeatedly switch modes around the threshold. */
export class CaptureCadence{
 value:number;
 constructor(value=1){this.value=value;}
 private samples:number[]=[];
 private stable=0;
 private warmup=30;
 reset(){this.samples=[];this.stable=0;this.warmup=30;}
 observe(milliseconds:number){
  if(!Number.isFinite(milliseconds)||milliseconds<=0||milliseconds>250){this.reset();return;}
  if(this.warmup>0){this.warmup--;return;}
  this.samples.push(milliseconds);if(this.samples.length<60)return;
  const sorted=this.samples.sort((a,b)=>a-b);this.samples=[];
  if(this.value===1&&sorted[30]>24&&sorted[6]>20){this.value=2;this.stable=0;}
  else if(this.value===2){
   this.stable=sorted[30]<18&&sorted[54]<21?this.stable+1:0;
   if(this.stable>=5){this.value=1;this.stable=0;this.warmup=30;}
  }
 }
}
