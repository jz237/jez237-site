import * as T from './vendor/three.module.js';
import {RIDER_TARGET_BONES,prepareRiderTargetPose} from './rider-target-pose.js';

// Independently authored rest axes of the EXISTING built-in rider. Its original
// meshes are instanced under these bones only when explicit physical targets
// are first supplied. No artwork, material, shadow flags or geometry is replaced
// with a lower-detail body; the static fallback remains unchanged in modern mode.
const REST=Object.freeze({
 torso:[[0,.98,-.40],[0,1.62,-.035]],head:[[0,1.84,.07],[0,2.20,.16]],pelvis:[[0,.98,-.40],[0,1.16,-.40]],
 upperArmL:[[-.26,1.62,-.035],[-.36,1.30,.32]],forearmL:[[-.36,1.30,.32],[-.44,1.13,.73]],handL:[[-.44,1.13,.73],[-.44,1.13,.825]],
 thighL:[[-.13,.99,-.42],[-.43,.70,.04]],shinL:[[-.43,.70,.04],[-.50,.40,-.35]],footL:[[-.50,.40,-.35],[-.50,.40,-.13]],
 upperArmR:[[.26,1.62,-.035],[.36,1.30,.32]],forearmR:[[.36,1.30,.32],[.44,1.13,.73]],handR:[[.44,1.13,.73],[.44,1.13,.825]],
 thighR:[[.13,.99,-.42],[.43,.70,.04]],shinR:[[.43,.70,.04],[.50,.40,-.35]],footR:[[.50,.40,-.35],[.50,.40,-.13]]
});
const up=new T.Vector3(0,1,0);

/** Bind the default v.rider after construction and BEFORE installBlenderRider.
 * bindings are {bone,mesh} for its existing direct mesh children. A successful
 * detailed install replaces updateRider and disposes the old shared geometry.
 * Explicit targetPose is display-only; absent/null restores the static fallback.
 */
export function installFallbackRider(v,{bindings}={}){
 if(!v?.rider?.isObject3D||!Array.isArray(bindings)||!bindings.length)throw new TypeError('Expected a built-in rider and mesh bindings');
 const root=v.rider,seen=new Set();
 for(const q of bindings){
  if(!REST[q?.bone]||!q.mesh?.isMesh||q.mesh.parent!==root||seen.has(q.mesh))throw new TypeError('Invalid fallback rider mesh binding');
  seen.add(q.mesh);
 }
 const staticChildren=[...root.children],visibility=staticChildren.map(o=>o.visible);
 let rig=null,active=false,previousMotion,previousRoot;
 function build(){
  const nativeRoot=new T.Group();nativeRoot.name='Built-in / physical rider targets';root.add(nativeRoot);
  const groups={},bones={};
  for(const name of RIDER_TARGET_BONES){
   const [a,b]=REST[name],start=new T.Vector3(...a),direction=new T.Vector3(...b).sub(start),length=direction.length();
   const restMatrix=new T.Matrix4().compose(start,new T.Quaternion().setFromUnitVectors(up,direction.normalize()),new T.Vector3(1,1,1));
   const g=new T.Group();g.name=name;nativeRoot.add(g);groups[name]=g;bones[name]={length,inverse:restMatrix.invert()};
  }
  for(const {bone,mesh:original}of bindings){
   original.updateMatrix();const mesh=original.clone(false);mesh.name=original.name||'Built-in / '+bone;
   mesh.matrixAutoUpdate=false;mesh.matrix.multiplyMatrices(bones[bone].inverse,original.matrix);
   mesh.matrix.decompose(mesh.position,mesh.quaternion,mesh.scale);groups[bone].add(mesh);
  }
  return {root:nativeRoot,groups,bones};
 }
 const start=new T.Vector3(),end=new T.Vector3(),direction=new T.Vector3();
 v.updateRider=({targetPose}={})=>{
  if(targetPose===undefined||targetPose===null){
   if(active){
    rig.root.visible=false;staticChildren.forEach((o,i)=>o.visible=visibility[i]);
    root.position.copy(previousRoot.position);root.quaternion.copy(previousRoot.quaternion);
    if(previousMotion===undefined)delete root.userData.riderMotion;else root.userData.riderMotion=previousMotion;
    active=false;
   }
   root.userData.nativePhysical=false;return;
  }
  // Complete validation precedes lazy allocation or changes to the old artwork.
  const p=prepareRiderTargetPose(targetPose);
  if(!active){previousMotion=root.userData.riderMotion;previousRoot={position:root.position.clone(),quaternion:root.quaternion.clone()};}
  rig??=build();staticChildren.forEach(o=>o.visible=false);rig.root.visible=true;
  root.position.set(0,0,0);root.rotation.set(0,p.yaw,0);
  for(const [name,[a,b]]of Object.entries(p.targets)){
   const g=rig.groups[name];start.fromArray(a);end.fromArray(b);direction.subVectors(end,start);const length=direction.length();
   g.position.copy(start);g.quaternion.setFromUnitVectors(up,direction.normalize());g.scale.set(1,length/rig.bones[name].length,1);
  }
  rig.groups.head.rotateY(p.headYaw);active=true;root.userData.nativePhysical=true;
  root.userData.riderMotion={nativePhysical:true,lean:0,compression:0,forward:0,wetness:0,steering:p.steering};
 };
 return v;
}
