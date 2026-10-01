import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
export type CameraObstruction=(from:T.Vector3,to:T.Vector3)=>number|null;

/** Query the same enabled solids used by the event, excluding the subject and
 * sensors. The returned distance supports a near-side fallback in tight spaces. */
export function cameraObstruction(world:R.World,from:T.Vector3,to:T.Vector3,subject?:R.RigidBody):number|null{
  const direction=to.clone().sub(from),length=direction.length();if(length<.001)return null;
  direction.divideScalar(length);
  const hit=world.castRay(new R.Ray(from,direction),length,true,R.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,subject);
  return hit&&hit.timeOfImpact<length-.025?hit.timeOfImpact:null;
}

/** Check a small aperture, not only the optical centre, to keep the near plane
 * out of thin posts and walls. All rays originate at the subject. */
export function clearCameraView(focus:T.Vector3,position:T.Vector3,obstruction:CameraObstruction,subjectPoints:T.Vector3[]=[]){
  const direction=position.clone().sub(focus).normalize(),right=new T.Vector3().crossVectors(direction,new T.Vector3(0,1,0));
  if(right.lengthSq()<.001)right.set(1,0,0);else right.normalize();
  const up=new T.Vector3().crossVectors(right,direction).normalize();
  for(const [x,y]of [[0,0],[-.22,0],[.22,0],[0,-.22],[0,.22]]){
    const end=position.clone().addScaledVector(right,x).addScaledVector(up,y);
    if(obstruction(focus,end)!==null)return false;
  }
  return subjectPoints.every(point=>obstruction(point,position)===null);
}

/** Prefer a nearby view of the same subject. Only pull toward the subject if
 * every external angle is blocked, e.g. inside a structure or a dense pile-up. */
export function unobstructedDemoPosition(focus:T.Vector3,desired:T.Vector3,obstruction:CameraObstruction,ground:(x:number,z:number)=>number,subjectPoints:T.Vector3[]=[]){
  if(clearCameraView(focus,desired,obstruction,subjectPoints))return desired.clone();
  const offset=desired.clone().sub(focus),candidates:T.Vector3[]=[];
  for(const lift of [0,3,7,12])for(const angle of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI]){
    if(!lift&&!angle)continue;
    const p=offset.clone().applyAxisAngle(new T.Vector3(0,1,0),angle).add(focus);p.y+=lift;
    p.y=Math.max(p.y,ground(p.x,p.z)+.7);candidates.push(p);
  }
  candidates.sort((a,b)=>a.distanceToSquared(desired)-b.distanceToSquared(desired));
  for(const p of candidates)if(clearCameraView(focus,p,obstruction,subjectPoints))return p;
  const distance=obstruction(focus,desired),length=offset.length();
  if(distance!==null&&length>.001){
    const p=focus.clone().addScaledVector(offset,Math.max(.25,distance-.4)/length);
    if(clearCameraView(focus,p,obstruction,subjectPoints))return p;
  }
  // A subject may itself be embedded in a collider after a crash. Keep the
  // previous intended position instead of producing an invalid teleport.
  return desired.clone();
}
