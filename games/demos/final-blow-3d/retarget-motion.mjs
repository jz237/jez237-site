import * as THREE from 'three';

// Transfer each bone's world-space rotation relative to its rest orientation.
// Matching names alone is insufficient: the rigs use different pelvis bases.
export function retargetMotion(source, original, targetRest, targetParents) {
 source.updateMatrixWorld(true);
 const sourceBones=new Map(),sourceRest=new Map();
 source.traverse(o=>{if(targetRest.has(o.name)){sourceBones.set(o.name,o);sourceRest.set(o.name,o.getWorldQuaternion(new THREE.Quaternion()).invert());}});
 const names=[...targetRest.keys()].filter(n=>sourceBones.has(n));
 if(names.length<20)throw new Error("Animation skeleton correspondence is incomplete");
 const values=new Map(names.map(n=>[n,[]]));
 const mixer=new THREE.AnimationMixer(source);mixer.clipAction(original).play();
 const frames=Math.max(2,Math.ceil(original.duration*60)+1),times=[];
 const desired=new Map(),q=new THREE.Quaternion();
 for(let frame=0;frame<frames;frame++){
  const time=original.duration*frame/(frames-1);times.push(time);
  mixer.setTime(Math.min(time,original.duration-1e-7));source.updateMatrixWorld(true);
  for(const name of names){
   q.copy(sourceBones.get(name).getWorldQuaternion(new THREE.Quaternion())).multiply(sourceRest.get(name)).multiply(targetRest.get(name));
   desired.set(name,q.clone());
  }
  for(const name of names){
   const parent=targetParents.get(name),parentQ=desired.get(parent)||targetRest.get(parent)||new THREE.Quaternion();
   q.copy(parentQ).invert().multiply(desired.get(name)).normalize();
   const array=values.get(name);
   if(array.length&&q.dot(new THREE.Quaternion().fromArray(array,array.length-4))<0)q.set(-q.x,-q.y,-q.z,-q.w);
   q.toArray(array,array.length);
  }
 }
 mixer.stopAllAction();mixer.uncacheRoot(source);
 const clip=original.clone();clip.tracks=clip.tracks.filter(t=>!t.name.endsWith('.quaternion'));
 for(const name of names)clip.tracks.push(new THREE.QuaternionKeyframeTrack(name+'.quaternion',times,values.get(name)));
 return clip;
}
