// NEW authored actor7 geometry, with recovered playback timing ONLY. No source
// animation records, mesh data or source anatomical pose is included. Nineteen
// rest targets define the caller's anatomy and must match its physical rig.
// Local rest lengths are NATIVE units; entryPositions and results are WORLD
// positions. The explicit scale and current physical hull frame do conversion.
//
// Construct a fresh provider at each actor7 entry. The first supplied actual
// solved pose is captured in that entry hull frame; later supplied poses do not
// replace it. There is no internal animation clock. Sampling, skipping frames,
// replay seeking and repeated rendering cannot advance a physical state.
//
// Rear approach, stern/climb offsets, body angles and interpolation are authored
// policies. They do not establish original recovery appearance, collision-free
// movement or physical remount success. Targets still require the real anchor,
// nineteen-point/link solves and lifecycle. No joint is placed into physics by
// this module, and target torso2 must never substitute for the solved datum gate.

const AXES=['x','y','z'],COUNT=19;
const EDGES=Object.freeze([[2,1],[1,0],[2,3],[3,4],[4,5],[5,6],[2,7],[7,8],[8,9],[9,10],
 [2,11],[11,12],[12,13],[13,14],[2,15],[15,16],[16,17],[17,18]].map(Object.freeze));
const vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(a.x+b.x,a.y+b.y,a.z+b.z),minus=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const times=(p,t)=>vec(p.x*t,p.y*t,p.z*t),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const magnitude=p=>Math.hypot(p.x,p.y,p.z),mix=(a,b,t)=>add(times(a,1-t),times(b,t));
const smooth=t=>t*t*t*(t*(t*6-15)+10);
function vector(p,name){
 if(!p||!AXES.every(k=>Number.isFinite(p[k])))throw new TypeError(`${name} requires finite XYZ`);
 return copy(p);
}
function points(value,name){
 if(!Array.isArray(value)||value.length!==COUNT)throw new TypeError(`${name} requires nineteen vectors`);
 return value.map((p,i)=>vector(p,`${name}[${i}]`));
}
function anatomy(value,name){
 const out=points(value,name);
 for(const [a,b]of EDGES)if(!(magnitude(minus(out[b],out[a]))>1e-10))throw new RangeError(`${name} has a collapsed ${a}-${b} anatomical edge`);
 return out;
}
function hullData(value,scale){
 const center=vector(value?.center,'hull.center'),frame={};
 if(value?.scale!==scale)throw new RangeError('Recovery provider and hull scales must match');
 for(const k of ['right','up','forward']){
  frame[k]=vector(value.frame?.[k],`hull.frame.${k}`);
  if(Math.abs(magnitude(frame[k])-1)>1e-6)throw new RangeError('Hull axes must have unit length');
 }
 const {right,up,forward}=frame;
 if(Math.abs(dot(right,up))+Math.abs(dot(up,forward))+Math.abs(dot(forward,right))>1e-6||
  dot(cross(forward,right),up)<.999999)throw new RangeError('Hull frame must be orthonormal and right handed');
 return {center,frame};
}
function toLocal(world,hull,scale){
 const delta=minus(world,hull.center),{right,up,forward}=hull.frame;
 return vec(dot(delta,right)/scale,dot(delta,up)/scale,dot(delta,forward)/scale);
}
function toWorld(local,hull,scale){
 const {right,up,forward}=hull.frame;
 return vector(vec(...AXES.map(k=>hull.center[k]+scale*(right[k]*local.x+up[k]*local.y+forward[k]*local.z))),'prepared world target');
}
function rotateX(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
function rotateZ(p,a){const c=Math.cos(a),s=Math.sin(a);return vec(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
function bodyRotation(p,key){return rotateZ(rotateX(p,key.pitch),key.roll);}
function interpolateKey(a,b,t){
 const out={};
 for(const name of ['rootX','rootY','rootZ','pitch','roll','headPitch'])out[name]=a[name]*(1-t)+b[name]*t;
 for(const name of ['arms','elbows','thighs','knees','ankles'])out[name]=a[name].map((value,i)=>value*(1-t)+b[name][i]*t);
 return out;
}
function authoredKeys(rest){
 const root=rest[2],height=Math.max(...rest.map(p=>p.y))-Math.min(...rest.map(p=>p.y));
 if(!(height>1e-10))throw new RangeError('Authored rest anatomy requires vertical extent');
 const key=(frame,name,values)=>({frame,name,rootX:root.x,rootY:root.y,rootZ:root.z,pitch:0,roll:0,
  headPitch:0,arms:[0,0],elbows:[0,0],thighs:[0,0],knees:[0,0],ankles:[0,0],...values});
 // -36 is the native point-hull stern station. All following relative offsets
 // and angles are new animation choices, scaled to the caller's rest stature.
 return [
  key(12,'water-to-stern',{rootY:-height*.12,rootZ:-36-height*.45,pitch:1.05,headPitch:-.65,
   arms:[-1.1,-1.1],elbows:[.1,.1],thighs:[-.3,-.3],knees:[-.35,-.35],ankles:[.15,.15]}),
  key(28,'stern-hold',{rootY:-height*.04,rootZ:-36-height*.12,pitch:.58,headPitch:-.4,
   arms:[-.85,-.85],elbows:[.48,.48],thighs:[-.18,-.28],knees:[-.4,-.35],ankles:[.15,.1]}),
  key(42,'climb',{rootY:root.y*.63,rootZ:root.z-height*.15,pitch:.29,roll:.055,headPitch:-.2,
   arms:[-.35,-.23],elbows:[.31,.22],thighs:[.58,.34],knees:[-.78,-.5],ankles:[.3,.18]}),
  key(50,'seated-settle',{rootY:root.y*.96,rootZ:root.z-height*.025,pitch:.055,headPitch:-.04,
   arms:[-.07,-.05],elbows:[.08,.06],thighs:[.1,.07],knees:[-.12,-.09],ankles:[.04,.03]}),
  key(56,'ordinary',{})
 ];
}
function authoredPose(rest,key){
 const p=Array(COUNT);p[2]=vec(key.rootX,key.rootY,key.rootZ);
 const edge=(a,b,angle=0)=>{p[b]=add(p[a],bodyRotation(rotateX(minus(rest[b],rest[a]),angle),key));};
 edge(2,1);edge(1,0,key.headPitch);
 for(const [side,shoulder,elbow,wrist,hand,hip,knee,ankle,toe]of [[0,3,4,5,6,7,8,9,10],[1,11,12,13,14,15,16,17,18]]){
  edge(2,shoulder);edge(shoulder,elbow,key.arms[side]);
  const forearm=key.arms[side]+key.elbows[side];edge(elbow,wrist,forearm);edge(wrist,hand,forearm);
  edge(2,hip);edge(hip,knee,key.thighs[side]);
  const shin=key.thighs[side]+key.knees[side];edge(knee,ankle,shin);edge(ankle,toe,shin+key.ankles[side]);
 }
 return p;
}
// Spherical direction interpolation prevents a limb disappearing when an
// actual fallen segment points opposite its authored approach direction. An
// exact half-turn gets a deterministic authored plane, never a physics axis.
function directionBetween(a,b,t){
 const cosine=Math.max(-1,Math.min(1,dot(a,b)));
 if(cosine>.999999){const q=mix(a,b,t);return times(q,1/magnitude(q));}
 let perpendicular=minus(b,times(a,cosine)),n=magnitude(perpendicular);
 if(n<1e-10){
  const absolute=AXES.map(k=>Math.abs(a[k])),axis=AXES[absolute.indexOf(Math.min(...absolute))];
  const reference=vec();reference[axis]=1;perpendicular=minus(reference,times(a,dot(reference,a)));n=magnitude(perpendicular);
 }
 perpendicular=times(perpendicular,1/n);
 const angle=Math.acos(cosine)*t;
 return add(times(a,Math.cos(angle)),times(perpendicular,Math.sin(angle)));
}
function captureBlend(entry,target,t){
 if(t===0)return entry.map(copy);if(t===1)return target.map(copy);
 const out=Array(COUNT);out[2]=mix(entry[2],target[2],t);
 for(const [a,b]of EDGES){
  const from=minus(entry[b],entry[a]),to=minus(target[b],target[a]),aLength=magnitude(from),bLength=magnitude(to);
  const direction=directionBetween(times(from,1/aLength),times(to,1/bLength),t);
  out[b]=add(out[a],times(direction,aLength*(1-t)+bLength*t));
 }
 return out;
}

/** Factory for one actor7 occurrence. restTargetsLocal contains NATIVE-length
 * XYZ in right/up/forward role order, not world positions. A frame>=56 sample
 * needs no entry pose (actor24 can enter7 directly at57); it returns exact rest.
 * Earlier samples require actual entryPositions once. Supplied entryPositions
 * after capture are ignored so a changing physical solve cannot rebase motion.
 * Playback uses floor(input), clamps85+to84, then returns+1 through83 or-1.
 * No fractional rendering time or hidden callback count affects that result. */
export function createAuthoredNativeRecoveryPose({scale=.025,restTargetsLocal}={}){
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive and finite');
 const rest=anatomy(restTargetsLocal,'restTargetsLocal'),keys=authoredKeys(rest);
 const provenance=Object.freeze({
  geometry:'new authored recovery keyframes and caller-authored nineteen-role rest anatomy',
  timing:'recovered actor7 85-frame playback; ordinary targets by authored frame56',
  coordinates:'native local rest lengths; actual world entry and output; current physical hull frame',
  compatibility:'matching physical rest rig required; source animation appearance and collision clearance are not established'
 });
 let entry=null;
 function evaluate({animationFrame,hull,entryPositions}={}){
  if(!Number.isFinite(animationFrame)||animationFrame<0)throw new RangeError('animationFrame must be finite and nonnegative');
  const current=hullData(hull,scale),frame=Math.min(84,Math.floor(animationFrame));
  if(!entry&&entryPositions!==undefined)entry=anatomy(points(entryPositions,'entryPositions').map(p=>toLocal(p,current,scale)),'captured entryPositions');
  if(frame<56&&!entry)throw new Error('Actual solved entryPositions are required before recovery frame56');
  let local,authoredPhase;
  if(frame>=56){local=rest.map(copy);authoredPhase='ordinary';}
  else if(frame<12){
   local=captureBlend(entry,authoredPose(rest,keys[0]),smooth(frame/12));authoredPhase='fallen-to-water';
  }else{
   let index=0;while(index<keys.length-2&&frame>=keys[index+1].frame)index++;
   const a=keys[index],b=keys[index+1],t=smooth((frame-a.frame)/(b.frame-a.frame));
   local=authoredPose(rest,interpolateKey(a,b,t));authoredPhase=a.name;
  }
  return {targets:local.map(p=>toWorld(p,current,scale)),nextAnimationFrame:frame<84?frame+1:-1,
   evaluatedAnimationFrame:frame,authoredPhase,entryCaptured:entry!==null,provenance};
 }
 return Object.freeze({evaluate,provenance});
}
