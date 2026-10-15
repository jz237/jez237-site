import {nativeRiderStartFrameView,nativeRiderStartAnatomy} from './native-rider-start-pose.js';
import {NATIVE_RIDER_LINKS} from './native-articulated-rider.js';

// Newly authored boarding geometry for the detailed rider. The eighteen
// signed records are generated from the caller's actual neutral anatomy and
// steering supports. No original frame coordinates, animation table or mesh
// are included. Their pose is evaluated by the recovered actor15 algorithm
// with EXPLICIT modern dimensions, then the real auxiliary/body solvers.
//
// Only ordinary startup56..84 is authored here. Phase holds, frame advancement,
// input/B processing, outgoing blend and all physical history live elsewhere.
const AXES=['x','y','z'],vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(...AXES.map(k=>a[k]+b[k])),sub=(a,b)=>vec(...AXES.map(k=>a[k]-b[k]));
const mul=(p,t)=>vec(p.x*t,p.y*t,p.z*t),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const length=p=>Math.hypot(p.x,p.y,p.z),distance=(a,b)=>length(sub(a,b)),mid=(a,b)=>mul(add(a,b),.5);
function vector(p,name){
 if(!p||!AXES.every(k=>Number.isFinite(p[k])))throw new TypeError(`${name} requires finite XYZ`);
 return copy(p);
}
function unit(p,name){const n=length(p);if(!Number.isFinite(n)||n<=1e-10)throw new RangeError(`${name} is collapsed`);return mul(p,1/n);}
function rotate(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
function same(a,b,name){if(Math.abs(a-b)>1e-6*Math.max(1,a,b))throw new RangeError(`Start records require symmetric ${name}`);return a;}
const smooth=t=>t*t*t*(t*(t*6-15)+10);
const FIELDS=['drop','back','torso','thigh','shin'];
// Fractions of the independently measured body height; radians for angles.
// Body fitting moves desired anatomy only, never an actual solved joint.
const KEYS=[
 {frame:56,drop:-.10,back:.20,torso:.90,thigh:2.80,shin:0},
 {frame:61,drop:-.35,back:.15,torso:1.18,thigh:2.10,shin:.10},
 {frame:67,drop:-.18,back:.06,torso:.72,thigh:1.10,shin:.30},
 {frame:74,drop:-.02,back:.025,torso:.20,thigh:.10,shin:.08},
 {frame:84,drop:0,back:0,torso:0,thigh:0,shin:0}
];
function key(frame){
 let i=0;while(i<KEYS.length-2&&frame>=KEYS[i+1].frame)i++;
 const a=KEYS[i],b=KEYS[i+1],t=smooth((frame-a.frame)/(b.frame-a.frame));
 return Object.fromEntries(FIELDS.map(k=>[k,a[k]*(1-t)+b[k]*t]));
}
function goals(rest,height,k,reach){
 const p=Array(19);p[2]=add(rest[2],vec(0,-k.drop*height,-k.back*height));
 for(const i of [1,3,4,11,12])p[i]=add(p[2],rotate(sub(rest[i],rest[2]),k.torso));
 p[0]=add(p[1],rotate(sub(rest[0],rest[1]),k.torso*.3));
 for(const [hip,knee,ankle,toe]of [[7,8,9,10],[15,16,17,18]]){
  p[hip]=add(p[2],sub(rest[hip],rest[2]));
  p[knee]=add(p[hip],rotate(sub(rest[knee],rest[hip]),k.thigh));
  p[ankle]=add(p[knee],rotate(sub(rest[ankle],rest[knee]),k.shin));
  p[toe]=add(p[ankle],rotate(sub(rest[toe],rest[ankle]),k.shin));
 }
 for(const i of [5,6,13,14])p[i]=copy(rest[i]);
 for(let pass=0;pass<16;pass++){
  const shifts=[[3,5],[11,13]].map(([shoulder,wrist])=>{
   const d=sub(p[wrist],p[shoulder]),n=length(d);return n>reach?mul(d,(n-reach)/n):vec();
  });
  const shift=mid(...shifts);for(let i=0;i<19;i++)if(![5,6,13,14].includes(i))p[i]=add(p[i],shift);
 }
 return p;
}
function record(position,first){
 const a=unit(first,'authored record direction'),b=Math.abs(a.y)<.9?vec(0,1,0):vec(0,0,1);
 const coordinatesS16=AXES.map(k=>Math.round(position[k]*10));
 if(coordinatesS16.some(v=>!Number.isInteger(v)||v< -32768||v>32767))throw new RangeError('Authored start coordinates exceed signed16 records');
 return {coordinatesS16,firstDirectionS8:AXES.map(k=>Math.round(a[k]*127)),secondDirectionS8:AXES.map(k=>Math.round(b[k]*127))};
}

/** Native-local nineteen-role rest anatomy; anchorRig uses the established
 * craft-local WORLD geometry from createAuthoredNativeAnchorRig. Rest lengths
 * and its physical radius remain separate mechanics, never fitted per frame.
 * This explicitly adapts the source's fixed-size pose geometry to the detailed
 * model; it does not claim original animation or fixed-dimension equality. */
export function createAuthoredNativeStartRecords({scale,restTargetsLocal,anchorRig}={}){
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive and finite');
 if(!Array.isArray(restTargetsLocal)||restTargetsLocal.length!==19)throw new TypeError('Start rest anatomy requires nineteen vectors');
 const rest=restTargetsLocal.map((p,i)=>vector(p,`restTargetsLocal[${i}]`));
 for(const [a,b]of NATIVE_RIDER_LINKS)if(distance(rest[a],rest[b])<=1e-10)throw new RangeError('Start rest anatomy has a collapsed link');
 const rig=Object.fromEntries(['center','supportA','supportB'].map(k=>[k,mul(vector(anchorRig?.[k],`anchorRig.${k}`),1/scale)]));
 const shoulder=mid(rest[3],rest[11]),neckAxis=unit(sub(rest[1],shoulder),'neutral head/shoulder axis');
 const axial=dot(sub(shoulder,rest[2]),neckAxis),halfSpan=distance(rest[3],rest[11])/2;
 if(axial<=1e-10||Math.abs(dot(sub(rest[3],shoulder),neckAxis))>1e-6*halfSpan)
  throw new RangeError('Start anatomy requires an upright symmetric shoulder/head plane');
 const upper=same(distance(rest[3],rest[4]),distance(rest[11],rest[12]),'upper arms');
 const lower=same(distance(rest[4],rest[5]),distance(rest[12],rest[13]),'forearms');
 const grip=same(distance(rest[5],rest[6]),distance(rest[13],rest[14]),'hand extensions');
 const toe=same(distance(rest[9],rest[10]),distance(rest[17],rest[18]),'foot extensions');
 const reach=upper+lower,height=Math.max(...rest.map(p=>p.y))-Math.min(...rest.map(p=>p.y));
 const anatomy=nativeRiderStartAnatomy({neckShoulderNative:Math.hypot(axial,halfSpan),shoulderHalfSpanNative:halfSpan,
  armUpperSquaredNative:upper*upper,armLowerSquaredNative:lower*lower,maxReachNative:reach+1e-5,
  neckHeadNative:axial+distance(rest[1],shoulder),headExtensionNative:distance(rest[0],rest[1]),
  gripExtensionNative:grip,toeExtensionNative:toe,auxiliaryAlongNative:0,
  auxiliaryGripHalfSpanNative:distance(rest[6],rest[14])/2,auxiliarySupportSpanNative:distance(rig.supportA,rig.supportB)});
 const provenance=Object.freeze({geometry:'new authored ordinary launch path and signed18-record geometry from the detailed model',
  mechanics:'recovered actor15 placement/three shoulder passes/arm IK/point mapping with explicit modern anatomical dimensions',
  timing:'ordinary selected frames56..84 only; lifecycle owns phase/clock/terminal blend',
  compatibility:'new high-resolution artwork and anatomy; not original records or fixed-dimension pose equality'});
 function selectFrame(view){
  const expected=nativeRiderStartFrameView({animationFrame:view?.requestedAnimationFrame});
  if(Object.keys(view).length!==Object.keys(expected).length||Object.keys(expected).some(k=>view[k]!==expected[k]))
   throw new RangeError('Start records require the actual descriptor7 frame view');
  const frame=view.evaluatedAnimationFrame;if(frame<56)throw new RangeError('Authored ordinary launch starts at frame56');
  if(reach<=.25)throw new RangeError('Start anatomy is too small for signed-record quantization');
  const p=goals(rest,height,key(frame),reach-.25),center=mid(p[3],p[11]);
  const neck=sub(center,mul(unit(sub(p[1],center),'authored head/shoulder axis'),axial));
  const map=[9,8,7,17,16,15,2,1,5,4,3,13,12,11];
  const directions=[sub(p[10],p[9]),sub(p[9],p[8]),sub(p[8],p[7]),sub(p[18],p[17]),sub(p[17],p[16]),sub(p[16],p[15]),
   sub(p[1],p[2]),sub(p[0],p[1]),sub(p[6],p[5]),sub(p[5],p[4]),sub(p[4],p[3]),
   sub(p[14],p[13]),sub(p[13],p[12]),sub(p[12],p[11])];
  const records=map.map((point,i)=>record(p[point],directions[i]));
  records.push(record(neck,sub(center,neck)),record(mid(p[6],p[14]),sub(p[6],p[14])),
   record(rig.center,vec(0,0,1)),record(rig.supportA,sub(rig.supportB,rig.supportA)));
  return {evaluatedAnimationFrame:frame,records};
 }
 // Eagerly validate all authored samples before this provider is installed.
 for(let f=56;f<=84;f++)selectFrame(nativeRiderStartFrameView({animationFrame:f}));
 return Object.freeze({selectFrame,anatomy,provenance});
}
