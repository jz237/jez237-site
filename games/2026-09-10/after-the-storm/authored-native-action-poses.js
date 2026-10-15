import {jointBetween} from './rider-pose.js';
import {NATIVE_RIDER_LINKS} from './native-articulated-rider.js';
import {nativeRiderIdlePoseOutcome} from './native-rider-action-pose-lifecycle.js';

// NEW authored action geometry for the existing high-resolution nineteen-role
// anatomy. Only playback counts/returns and actor25's fixed sample selection
// are recovered source facts. No original animation records are included.
// Angles, keyframes, root paths, supported-arm fitting and full-hull placement
// below are authored policies, not a reconstruction of original pose artwork
// or its additional input-dependent anatomical deformation.
//
// Every evaluation is pure: there is no private clock, entry capture, physical
// joint substitution, actor selection, hold/restart rule or solver mutation.
// The lifecycle owns holds, frame jumps and current/pending blend completion.
// These are desired targets, requiring the actual auxiliary/19-point solves.

const AXES=['x','y','z'],ACTORS=new Set([8,9,10,17,25]);
const COUNTS=Object.freeze({8:56,9:89,10:49,17:61,25:9});
const vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(a.x+b.x,a.y+b.y,a.z+b.z),sub=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const mul=(p,t)=>vec(p.x*t,p.y*t,p.z*t),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const length=p=>Math.hypot(p.x,p.y,p.z),mix=(a,b,t)=>add(mul(a,1-t),mul(b,t));
const smooth=t=>t*t*t*(t*(t*6-15)+10);
function vector(p,name){
 if(!p||!AXES.every(k=>Number.isFinite(p[k])))throw new TypeError(`${name} requires finite XYZ`);
 return copy(p);
}
function integer(n,name,min,max){
 if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`${name} is outside the supported native range`);
 return n;
}
function anatomy(value){
 if(!Array.isArray(value)||value.length!==19)throw new TypeError('restTargetsLocal requires nineteen native-local vectors');
 const p=value.map((v,i)=>vector(v,`restTargetsLocal[${i}]`));
 for(const [a,b]of NATIVE_RIDER_LINKS){
  const d=length(sub(p[a],p[b]));
  if(!Number.isFinite(d)||d<=1e-10)throw new RangeError(`Collapsed or unbounded rest anatomical link ${a}-${b}`);
 }
 const height=Math.max(...p.map(v=>v.y))-Math.min(...p.map(v=>v.y));
 if(!Number.isFinite(height)||height<=1e-10)throw new RangeError('Rest anatomy requires finite vertical extent');
 return {rest:p,height};
}
function hullData(hull,scale){
 if(hull?.scale!==scale)throw new RangeError('Action provider and physical hull scales must match');
 const center=vector(hull.center,'hull.center'),frame={};
 for(const key of ['right','up','forward']){
  frame[key]=vector(hull.frame?.[key],`hull.frame.${key}`);
  if(Math.abs(length(frame[key])-1)>1e-6)throw new RangeError('Hull axes must have unit length');
 }
 const {right,up,forward}=frame;
 if(Math.abs(dot(right,up))+Math.abs(dot(up,forward))+Math.abs(dot(forward,right))>1e-6||
  dot(cross(forward,right),up)<.999999)throw new RangeError('Hull frame must be orthonormal and right handed');
 return {center,frame};
}
function world(p,hull,scale){
 const {right:r,up:u,forward:f}=hull.frame;
 return vector(vec(...AXES.map(k=>hull.center[k]+scale*(r[k]*p.x+u[k]*p.y+f[k]*p.z))),'prepared action target');
}
function rotateX(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
function rotateY(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
function rotateZ(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
function rotate(p,k){return rotateY(rotateZ(rotateX(p,k.pitch),k.roll),k.yaw);}
const KEY_FIELDS=['pitch','yaw','roll','lift','shift','side','headPitch','headYaw','armA','armB','elbowA','elbowB',
 'legA','legB','kneeA','kneeB','ankleA','ankleB','extension','support'];
function key(frame,phase,values={}){return {frame,phase,...Object.fromEntries(KEY_FIELDS.map(k=>[k,0])),...values};}
function sampledKey(keys,frame){
 let i=0;while(i<keys.length-2&&frame>=keys[i+1].frame)i++;
 const a=keys[i],b=keys[i+1],t=smooth(Math.max(0,Math.min(1,(frame-a.frame)/(b.frame-a.frame))));
 return {...Object.fromEntries(KEY_FIELDS.map(k=>[k,a[k]*(1-t)+b[k]*t])),phase:a.phase};
}
const INVERTED={pitch:Math.PI,lift:.98,shift:.8,extension:1,support:1};
const TURNED={yaw:Math.PI,lift:.05};
const SPUN={yaw:Math.PI*2,lift:.16,legA:.25,legB:.25,kneeA:-.35,kneeB:-.35};
const KEYS={
 8:[key(0,'grip approach',{support:1}),key(6,'tuck',{pitch:.4,lift:.12,shift:.12,support:1}),
  key(26,'grip-supported inversion',INVERTED),key(30,'inversion hold',INVERTED),key(31,'inversion release',INVERTED),
  key(55,'settled',{support:1})],
 9:[key(0,'turn approach'),key(12,'rising turn',{yaw:Math.PI*.58,lift:.1}),key(24,'rear-facing hold',TURNED),
  key(46,'rear-facing release',TURNED),key(62,'return turn',TURNED),key(77,'turn settling',{yaw:Math.PI*1.8,lift:.04}),
  key(88,'settled',{yaw:Math.PI*2})],
 17:[key(0,'standing turn approach'),key(11,'standing turn',{yaw:Math.PI,lift:.22,roll:.06,legA:.2,legB:.2,kneeA:-.3,kneeB:-.3}),
  key(23,'standing turn hold',SPUN),key(24,'standing turn release',SPUN),key(37,'normal return',{yaw:Math.PI*2}),
  key(40,'alternate release',SPUN),key(60,'alternate return',{yaw:Math.PI*2})]
};
function directionBetween(a,b,t){
 const c=Math.max(-1,Math.min(1,dot(a,b)));
 if(c>.999999){const p=mix(a,b,t);return mul(p,1/length(p));}
 let perpendicular=sub(b,mul(a,c)),n=length(perpendicular);
 if(n<1e-10){
  const axis=AXES[AXES.map(k=>Math.abs(a[k])).indexOf(Math.min(...AXES.map(k=>Math.abs(a[k]))))],reference=vec();
  reference[axis]=1;perpendicular=sub(reference,mul(a,dot(reference,a)));n=length(perpendicular);
 }
 const angle=Math.acos(c)*t;
 return add(mul(a,Math.cos(angle)),mul(perpendicular,Math.sin(angle)/n));
}
function bone(p,rest,a,b,angle,k,extension=0){
 let d=rotateX(sub(rest[b],rest[a]),angle);
 if(extension){const n=length(d);d=mul(directionBetween(mul(d,1/n),vec(0,-1,0),extension),n);}
 p[b]=add(p[a],rotate(d,k));
}
function supportedArms(p,rest,height,amount){
 if(!amount)return p;
 const pairs=[[3,4,5,6],[11,12,13,14]],targets=pairs.map(([, ,w,g])=>({w:mix(p[w],rest[w],amount),g:mix(p[g],rest[g],amount)}));
 // Move the authored whole-body root only enough to keep both supported arms
 // reachable. This changes desired anatomy, never an actual solved joint.
 for(let pass=0;pass<16;pass++)for(let side=0;side<2;side++){
  const [shoulder,elbow,wrist]=pairs[side],d=sub(targets[side].w,p[shoulder]),n=length(d);
  const reach=length(sub(rest[elbow],rest[shoulder]))+length(sub(rest[wrist],rest[elbow]))-height*1e-6;
  if(n>reach){const shift=mul(d,(n-reach)/n);for(let i=0;i<19;i++)p[i]=add(p[i],shift);}
 }
 for(let side=0;side<2;side++){
  const [shoulder,elbow,wrist,grip]=pairs[side],target=targets[side];
  p[elbow]=vec(...jointBetween(AXES.map(k=>p[shoulder][k]),AXES.map(k=>target.w[k]),
   length(sub(rest[elbow],rest[shoulder])),length(sub(rest[wrist],rest[elbow])),AXES.map(k=>p[elbow][k])));
  p[wrist]=copy(target.w);p[grip]=copy(target.g);
 }
 return p;
}
function authoredPose(rest,height,k,actor){
 const p=Array(19),offset=vec(k.side*height,k.lift*height,k.shift*height);
 const gripCenter=mul(add(rest[6],rest[14]),.5);
 p[2]=add(actor===9?add(gripCenter,rotate(sub(rest[2],gripCenter),k)):rest[2],offset);
 bone(p,rest,2,1,0,k);p[0]=add(p[1],rotate(rotateY(rotateX(sub(rest[0],rest[1]),k.headPitch),k.headYaw),k));
 for(const [side,shoulder,elbow,wrist,grip,hip,knee,ankle,toe]of [['A',3,4,5,6,7,8,9,10],['B',11,12,13,14,15,16,17,18]]){
  bone(p,rest,2,shoulder,0,k);bone(p,rest,shoulder,elbow,k[`arm${side}`],k);
  const arm=k[`arm${side}`]+k[`elbow${side}`];bone(p,rest,elbow,wrist,arm,k);bone(p,rest,wrist,grip,arm,k);
  bone(p,rest,2,hip,0,k);bone(p,rest,hip,knee,k[`leg${side}`],k,k.extension);
  const leg=k[`leg${side}`]+k[`knee${side}`];bone(p,rest,knee,ankle,leg,k,k.extension);
  bone(p,rest,ankle,toe,leg+k[`ankle${side}`],k);
 }
 return supportedArms(p,rest,height,k.support);
}
function idleKey(frame,choice){
 const first=frame<=24,t=first?frame/24:(frame-25)/23,pulse=Math.sin(Math.PI*Math.max(0,t))**2;
 const side=choice===0||choice===2?-1:1;
 return key(frame,first?'idle look':'idle settle',{support:1,side:side*.018*pulse,lift:-.014*pulse,
  roll:side*.045*pulse,headYaw:side*.43*pulse,headPitch:(choice<2?-.08:.12)*pulse,
  armA:.04*pulse,armB:-.04*pulse});
}

/** NATIVE local rest lengths, WORLD output. Actor10 requires the actual source
 * choice0..3; actor25 requires the actual unsigned16 alternate16cc word.
 * Floored input frames clamp to the recovered final record. Actor17 returns
 * -1 when next==38 as well as at its descriptor bound; a source jump to40 is
 * intentionally valid. Actor25 ignores the stored frame, samples4/8, returns0.
 * Actual frame holds, input cancellation, point types and actor requests belong
 * to native-rider-action-pose-lifecycle/recovery, not this authored geometry. */
export function createAuthoredNativeActionPoses({scale=.025,restTargetsLocal}={}){
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive and finite');
 const {rest,height}=anatomy(restTargetsLocal);
 const provenance=Object.freeze({
  geometry:'new authored action keyframes/FK/supported-arm IK using caller-authored nineteen-role rest anatomy',
  timing:'recovered actor8/9/10/17 descriptor counts and evaluator returns; actor25 fixed descriptor0 sample4/8',
  coordinates:'native-local anatomy placed through actual full physical hull frame into world coordinates',
  compatibility:'authored equivalent anatomy and interpolation; original pose geometry/input-dependent deformations are not established'
 });
 function evaluate({actorState,animationFrame,hull,idleChoice16c4,alternate16cc}={}){
  if(!ACTORS.has(actorState))throw new RangeError('Only action actors8/9/10/17/25 are supported');
  if(!Number.isFinite(animationFrame)||animationFrame<0)throw new RangeError('animationFrame must be finite and nonnegative');
  const current=hullData(hull,scale);
  let frame=Math.min(COUNTS[actorState]-1,Math.floor(animationFrame)),next=frame+1,k;
  if(next>=COUNTS[actorState]||actorState===17&&next===38)next=-1;
  if(actorState===10){
   integer(idleChoice16c4,'actual idleChoice16c4',0,3);k=idleKey(frame,idleChoice16c4);
   next=nativeRiderIdlePoseOutcome({nextAnimationFrame:next,idleChoice16c4});
  }else if(actorState===25){
   integer(alternate16cc,'actual alternate16cc',0,65535);frame=alternate16cc===0?4:8;next=0;
   k=key(frame,'dive brace',{pitch:alternate16cc===0?.64:.48,lift:-.16,shift:.16,headPitch:-.18,
    legA:.25,legB:.25,kneeA:-.36,kneeB:-.36,support:1});
  }else k=sampledKey(KEYS[actorState],frame);
  return {targets:authoredPose(rest,height,k,actorState).map(p=>world(p,current,scale)),nextAnimationFrame:next,
   evaluatedAnimationFrame:frame,authoredPhase:k.phase,provenance};
 }
 return Object.freeze({evaluate,provenance});
}
