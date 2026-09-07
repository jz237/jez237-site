import * as THREE from 'three';

// Author in the target rig's own rest space; do not transfer another skeleton's poses.
export function authoredMotion(model) {
 const bones=[];model.traverse(o=>{if(o.isBone)bones.push(o);});
 const rest=bones.map(b=>({p:b.position.clone(),q:b.quaternion.clone()}));
 const get=n=>model.getObjectByName(n),V=(x,y,z)=>new THREE.Vector3(x,y,z);
 const world=v=>model.localToWorld(v.clone());
 const point=b=>b.getWorldPosition(new THREE.Vector3());
 const reset=()=>{bones.forEach((b,i)=>{b.position.copy(rest[i].p);b.quaternion.copy(rest[i].q);});model.updateMatrixWorld(true);};
 const turn=(bone,child,target)=>{
  const from=point(child).sub(point(bone)).normalize(),to=target.clone().sub(point(bone)).normalize();
  const q=new THREE.Quaternion().setFromUnitVectors(from,to).multiply(bone.getWorldQuaternion(new THREE.Quaternion()));
  bone.quaternion.copy(bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(q));model.updateMatrixWorld(true);
 };
 const ik=(a,b,c,target,pole)=>{
  const A=get(a),B=get(b),C=get(c),origin=point(A),end=world(target),hint=world(pole);
  const l1=origin.distanceTo(point(B)),l2=point(B).distanceTo(point(C));
  const direction=end.clone().sub(origin),distance=THREE.MathUtils.clamp(direction.length(),Math.abs(l1-l2)+.001,l1+l2-.005);direction.normalize();
  const along=(l1*l1-l2*l2+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,l1*l1-along*along));
  const bend=hint.sub(origin).addScaledVector(direction,-hint.dot(direction)).normalize();
  const elbow=origin.clone().addScaledVector(direction,along).addScaledVector(bend,height);
  turn(A,B,elbow);turn(B,C,origin.clone().addScaledVector(direction,distance));
 };
 const ease=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
 const pulse=(t,hit,duration)=>t<hit?ease(t/hit):1-ease((t-hit)/(duration-hit));
 const definitions={guard:[1,0],walk_fwd:[.72,0],walk_back:[.8,0],block:[.5,.12],dodge:[.55,.22],hit_body:[.4,.1],jab:[.42,.16],cross:[.52,.21],hook:[.58,.24],lowkick:[.72,.30]};
 const clips={};reset();const footRest=Object.fromEntries(['LeftFoot','RightFoot'].map(n=>[n,get(n).getWorldQuaternion(new THREE.Quaternion())]));
 for(const [name,[duration,hit]] of Object.entries(definitions)) {
  const times=[],tracks=bones.map(()=>({p:[],q:[]}));
  for(let k=0;k<=72;k++) {
   reset();const t=duration*k/72,s=name==='guard'?0:pulse(t,hit,duration),breath=name==='guard'?Math.sin(t*Math.PI*2)*.006:0;
   const hip=get('Hips');hip.position.y-=.13-breath+(name==='dodge'?.09*s:0);
   const yaw=-.22+(name==='cross'?.38:name==='hook'?-.34:name==='lowkick'?.30:0)*s;
   hip.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(V(0,1,0),yaw));model.updateMatrixWorld(true);
   const left=V(.16,1.46,.33),right=V(-.16,1.48,.22);if(name==='block'){left.x-=.04*s;right.x+=.04*s;left.y+=.05*s;right.y+=.04*s;}if(name==='hit_body'){hip.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(V(1,0,0),-.08*s));model.updateMatrixWorld(true);}
   if(name==='jab')left.lerp(V(.12,1.48,.62),s);
   if(name==='cross')right.lerp(V(-.08,1.48,.64),s);
   if(name==='hook'){left.x+=Math.sin(s*Math.PI)*.17;left.z+=s*.18;left.y+=s*.015;left.x-=s*.19;}
   ik('LeftArm','LeftForeArm','LeftHand',left,V(.32,1.12,.10));
   ik('RightArm','RightForeArm','RightHand',right,V(-.32,1.12,.06));
   const lf=V(.17,.15,.23),rf=V(-.17,.15,-.22);
   if(name.startsWith('walk_')){const phase=t/duration*Math.PI*2,direction=name==='walk_fwd'?1:-1;lf.z+=Math.sin(phase)*.09*direction;rf.z-=Math.sin(phase)*.09*direction;lf.y+=Math.max(0,Math.cos(phase))*.045;rf.y+=Math.max(0,-Math.cos(phase))*.045;}
   if(name==='lowkick')rf.lerp(V(-.08,.48,.65),s);
   ik('LeftUpLeg','LeftLeg','LeftFoot',lf,V(.18,.55,.52));
   ik('RightUpLeg','RightLeg','RightFoot',rf,V(-.18,.55,.35));
   // Keep the boots level while knees and hips move over the planted feet.
   for(const side of ['Left','Right']){const foot=get(side+'Foot'),i=bones.indexOf(foot);foot.quaternion.copy(foot.parent.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(footRest[side+'Foot']));}
   model.updateMatrixWorld(true);times.push(t);
   bones.forEach((b,i)=>{b.position.toArray(tracks[i].p,tracks[i].p.length);b.quaternion.toArray(tracks[i].q,tracks[i].q.length);});
  }
  clips[name]=new THREE.AnimationClip(name,duration,bones.flatMap((b,i)=>[new THREE.VectorKeyframeTrack(b.name+'.position',times,tracks[i].p),new THREE.QuaternionKeyframeTrack(b.name+'.quaternion',times,tracks[i].q)]));
 }
 reset();return clips;
}
