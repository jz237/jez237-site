// Pure display contract shared by the detailed and built-in riders. Explicit
// targets bypass authored motion/IK; copying keeps replay/physical DTOs isolated
// from renderer writes. There is no solver, timer, model loader or Three import.
export const RIDER_TARGET_BONES=Object.freeze(['torso','head','pelvis',
 'upperArmL','forearmL','handL','thighL','shinL','footL','upperArmR','forearmR','handR','thighR','shinR','footR']);
const names=new Set(RIDER_TARGET_BONES);
function angle(n,name){if(!Number.isFinite(n))throw new TypeError(name+' must be finite');return n;}
export function prepareRiderTargetPose(pose){
 if(!pose||typeof pose!=='object'||!pose.targets||typeof pose.targets!=='object'||Array.isArray(pose.targets))
  throw new TypeError('targetPose requires anatomical targets');
 if(Object.keys(pose.targets).some(name=>!names.has(name)))throw new RangeError('Unknown targetPose bone');
 const yaw=angle(pose.yaw??0,'targetPose.yaw'),headYaw=angle(pose.headYaw??0,'targetPose.headYaw');
 const targets=Object.fromEntries(RIDER_TARGET_BONES.map(name=>{
  const pair=pose.targets[name];
  if(!Array.isArray(pair)||pair.length!==2)throw new TypeError('targetPose '+name+' requires two endpoints');
  const points=pair.map(p=>{
   if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new TypeError('targetPose '+name+' requires finite XYZ arrays');
   return [...p];
  });
  if(!Number.isFinite(Math.hypot(...points[1].map((n,i)=>n-points[0][i]))))throw new RangeError('targetPose '+name+' segment is too large');
  return [name,points];
 }));
 // The detailed bars need only a display yaw. Measure the actual two grip tips
 // instead of running the modern helm spring or inferring geometry from input.
 const left=targets.handL[1],right=targets.handR[1],dx=right[0]-left[0],dz=right[2]-left[2];
 const steering=Math.hypot(dx,dz)>1e-12?Math.atan2(-dz,dx):0;
 return {targets,yaw,headYaw,steering};
}
