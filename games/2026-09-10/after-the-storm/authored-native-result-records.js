import {nativeRiderResultFrameView} from './native-rider-start-pose.js';
import {createAuthoredNativeRecordRig} from './authored-native-start-records.js';

// New high-resolution motion, authored after privately inspecting the six
// original result sequences. These are modern anatomical targets, not copied
// source records. The original descriptor counts, evaluator and lifecycle own
// playback. This pure record producer has no clock or physical-state writes.
const AXES=['x','y','z'],vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(...AXES.map(k=>a[k]+b[k])),sub=(a,b)=>vec(...AXES.map(k=>a[k]-b[k]));
const mul=(p,n)=>vec(p.x*n,p.y*n,p.z*n),length=p=>Math.hypot(p.x,p.y,p.z);
function rx(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
function ry(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
function rz(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
const fields=['pitch','yaw','roll','lift','back','head','armA','armB','elbowA','elbowB','crossA','crossB','leg','knee'];
const key=(frame,values={})=>({frame,...Object.fromEntries(fields.map(k=>[k,0])),...values});
const both={pitch:-.3,armA:-2,armB:-2,elbowA:-.35,elbowB:-.35,head:-.12};
const one={pitch:-.12,armA:-1.9,elbowA:-.45};
const slump={pitch:-.15,lift:.025,back:-.08,armA:.8,elbowA:-.3,head:.35};
// The detailed craft's saddle is taller/longer than the reference craft.
// Place the low crouch over its rear step rather than inside the saddle.
const crouch={lift:-.22,back:.9,pitch:-.25,leg:-.75,knee:1.15,armA:.3,armB:.35,head:.25};
const KEYS={
 1:[key(0),key(10,{lift:-.025,armA:-.5,armB:-.5}),key(24,both),key(32,{...both,armA:-2.25,armB:-2.25}),
  key(42,both),key(52,{...both,armA:-2.2,armB:-2.2}),key(66,both),key(77,{pitch:-.1,armA:-.6,armB:-.6}),key(88)],
 2:[key(0),key(8,one),key(18,{...one,armA:-1.05}),key(34,{...one,armA:-1}),
  key(48,{...one,roll:.08}),key(64,{...one,roll:-.1,armA:-2.15}),key(76,one),key(89,{armA:-.6}),key(99)],
 3:[key(0),key(10,slump),key(18,{...slump,head:.42}),key(36,slump),key(45,{armA:.35,head:.15}),key(53)],
 4:[key(0),key(6,{back:.9,lift:.13}),key(12,crouch),key(24,{...crouch,elbowB:-.65}),key(36,crouch),
  key(52,{...crouch,elbowA:-.5,head:.4}),key(64,crouch),key(72,{back:.9,lift:.13}),key(78)],
 5:[key(0),key(8,{armA:-1,armB:-.9,crossA:-.3,crossB:.3}),key(17,{pitch:-.3,armA:-1.8,armB:-1.6}),
  key(23,{pitch:-1,back:.35,lift:-.05,armA:-1,armB:-2}),
  key(30,{pitch:-1.9,back:.8,lift:-1.1,armA:-.8,armB:-1.2,leg:.5,knee:-.8}),
  key(39,{pitch:-1.4,back:.8,lift:-2.1,armA:-1.2,armB:-.5,leg:.4,knee:-.5})],
 6:[key(0),key(8,{pitch:-.2,armA:-.65,armB:-.4,crossB:-.8}),
  key(16,{lift:-.06,pitch:-.15,armA:.15,armB:.6,crossA:.6,head:.25}),
  key(33,{lift:-.05,pitch:-.15,armA:.2,armB:.7,crossA:.6,head:.3}),key(44,{armA:.3,armB:.4,head:.12}),key(53)]
};
function sample(keys,frame){
 let i=0;while(i<keys.length-2&&frame>=keys[i+1].frame)i++;
 const a=keys[i],b=keys[i+1],t=Math.max(0,Math.min(1,(frame-a.frame)/(b.frame-a.frame))),s=t*t*t*(t*(t*6-15)+10);
 return Object.fromEntries(fields.map(k=>[k,a[k]*(1-s)+b[k]*s]));
}
function targets(rest,height,reach,k,actor){
 const p=Array(19),rotate=d=>ry(rz(rx(d,k.pitch),k.roll),k.yaw);
 p[2]=add(rest[2],vec(0,k.lift*height,-k.back*height));
 const bone=(a,b,angle=0,yaw=0)=>{p[b]=add(p[a],rotate(ry(rx(sub(rest[b],rest[a]),angle),yaw)));};
 bone(2,1);p[0]=add(p[1],rotate(rx(sub(rest[0],rest[1]),k.head)));
 for(const [side,shoulder,elbow,wrist,hand,hip,knee,ankle,toe]of [['A',3,4,5,6,7,8,9,10],['B',11,12,13,14,15,16,17,18]]){
  bone(2,shoulder);bone(shoulder,elbow,k[`arm${side}`],k[`cross${side}`]);
  bone(elbow,wrist,k[`arm${side}`]+k[`elbow${side}`],k[`cross${side}`]);
  bone(wrist,hand,k[`arm${side}`]+k[`elbow${side}`],k[`cross${side}`]);
  bone(2,hip);bone(hip,knee,k.leg);bone(knee,ankle,k.leg+k.knee);bone(ankle,toe,k.leg+k.knee);
 }
 if(actor===2||actor===3){
  // Source2/3 constrain the second grip. Fit desired torso reach before
  // the source elbow solve; never overwrite the actual physical rider.
  p[13]=copy(rest[13]);p[14]=copy(rest[14]);
  const delta=sub(p[13],p[11]),n=length(delta);
  if(n>reach-.25){const shift=mul(delta,(n-(reach-.25))/n);for(let i=0;i<19;i++)if(i!==13&&i!==14)p[i]=add(p[i],shift);}
 }
 return p;
}

export function createAuthoredNativeResultRecords(options={}){
 const rig=createAuthoredNativeRecordRig(options),{rest,height,reach,anatomy,encodeTargets}=rig;
 if(reach<=.25)throw new RangeError('Result anatomy is too small for signed-record quantization');
 const provenance=Object.freeze({
  geometry:'new authored celebration, one-arm celebration, slump, crouch, backward fall and disappointed-gesture keyframes on detailed anatomy',
  reference:'motions inspected privately from original result1..6; no original frame arrays or mesh data included',
  mechanics:'original result evaluators with explicitly adapted modern anatomical dimensions',
  compatibility:'authored motion interpretation; not original animation-coordinate or physical-trajectory equality'
 });
 function selectFrame(view){
  const expected=nativeRiderResultFrameView({actorState:view?.actorState,animationFrame:view?.requestedAnimationFrame});
  if(Object.keys(view).length!==Object.keys(expected).length||Object.keys(expected).some(k=>view[k]!==expected[k]))
   throw new RangeError('Result records require the actual result descriptor frame view');
  const frame=view.evaluatedAnimationFrame,k=sample(KEYS[view.actorState],frame);
  return {evaluatedAnimationFrame:frame,records:encodeTargets(targets(rest,height,reach,k,view.actorState))};
 }
 return Object.freeze({selectFrame,anatomy,provenance});
}
