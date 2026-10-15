// Independently reconstructed actor23 physical pose preparation. No animation,
// mesh, texture or original pose records are included. The caller supplies all
// nineteen ACTUAL solved points and their prior-rendered-pose stored deltas.
// The fixed procedural dimensions below assume a rig compatible with those
// native dimensions at the supplied scale. An authored rest rig is not evidence
// that its resulting trajectory or appearance equals the original rider.
//
// Call once after five hull ticks, before the auxiliary and nineteen-point
// physical solves. Source prediction adds .95*storedDelta then -3.5 NATIVE units
// on WORLD Y, once per outer frame. This is a frame displacement, not gravity
// acceleration or a five-times-applied hull force. The prediction's -16000 Y
// clamp precedes anatomical fitting; the final points can lie below that bound.
// Actor23 uses type0 points; their projection copies these prepared targets.
// Subsequent link passes can still move them. Datum recovery reads the solved
// torso point2 at the beginning of the NEXT outer frame.
//
// Binary32 arithmetic and double literal stages follow the recovered order in
// native units. Conversion to/from world units is explicit. This is not a claim
// to emulate every floating-point exception mode of the original processor.
// Undefined collapsed divisions are rejected; no fallback body is fabricated.
// Actor7 is a separate 85-frame playback consumer and requires an independently
// authored recovery pose provider. This module does not supply its pose records.

const COUNT=19,AXES=['x','y','z'],F=Math.fround;
const ENDPOINTS=Object.freeze([[1,0,25],[5,6,3.5],[9,10,10],[13,14,3.5],[17,18,10]].map(Object.freeze));
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(F(a.x+b.x),F(a.y+b.y),F(a.z+b.z));
const minus=(a,b)=>vec(F(a.x-b.x),F(a.y-b.y),F(a.z-b.z));
const times=(a,t)=>vec(F(a.x*t),F(a.y*t),F(a.z*t));
const length=a=>F(Math.sqrt(F(F(F(a.x*a.x)+F(a.y*a.y))+F(a.z*a.z))));
function finite(value,name){
  if(!Number.isFinite(value))throw new RangeError(`${name} is outside finite native arithmetic`);
  return value;
}
function scaleValue(scale){
  if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive');
  return scale;
}
function vector(p,name){
  if(!p||!AXES.every(a=>Number.isFinite(p[a])))throw new TypeError(`${name} requires finite x, y and z`);
  return p;
}
function nativeVector(p,scale,name){
  vector(p,name);return vec(...AXES.map(a=>finite(F(p[a]/scale),name)));
}
function nativeVectors(points,count,scale,name){
  if(!Array.isArray(points)||points.length!==count)throw new TypeError(`${name} must contain ${count} world vectors`);
  return points.map((p,i)=>nativeVector(p,scale,`${name}[${i}]`));
}
function axis(p,name){
  vector(p,name);
  if(Math.abs(Math.hypot(p.x,p.y,p.z)-1)>1e-6)throw new RangeError(`${name} must be a unit hull axis`);
  return nativeVector(p,1,name);
}
function ratio(numerator,denominator,name){
  if(!Number.isFinite(denominator)||denominator===0)throw new RangeError(`Collapsed ${name}`);
  return finite(F(numerator/denominator),name);
}
// Pose normalization preserves a zero first direction. The length helpers also
// preserve coincident endpoints; other divisions in the producer are undefined.
function normalized(p){
  const n=finite(length(p),'pose direction');
  return n===0?copy(p):times(p,ratio(1,n,'pose direction'));
}
function enforceLength(p,a,b,distance){
  const d=minus(p[b],p[a]),n=finite(length(d),'body length');
  if(n!==0)p[b]=add(p[a],times(d,ratio(F(distance),n,'body length')));
}
function pushAway(p,point,other,distance){
  const d=minus(p[point],p[other]);
  p[point]=add(p[point],times(d,ratio(distance,length(d),'body separation')));
}
function worldVectors(points,scale){
  return points.map(p=>vec(...AXES.map(a=>finite(finite(p[a],'prepared point')*scale,'world point'))));
}

// The producer fills a render pose and normalizes its first directions before
// the physical consumer reads targets. Rebuilding these five synthetic
// endpoints preserves that intervening normalization and mixed precision.
function decodedPhysicalPoints(points){
  const p=points.map(copy);
  for(const [origin,endpoint,distance] of ENDPOINTS){
    const direction=normalized(minus(p[endpoint],p[origin]));
    p[endpoint]=distance===3.5
      ?vec(...AXES.map(a=>F(p[origin][a]+direction[a]*distance)))
      :add(p[origin],times(direction,distance));
  }
  return p;
}
function decodedAuxiliaryPoints(points){
  const p=points.map(copy),forward=normalized(minus(p[5],p[0]));
  const back=normalized(minus(p[2],p[1])),right=normalized(minus(p[3],p[4]));
  p[3]=vec(...AXES.map(a=>F(p[2][a]+back[a]*1.867542+right[a]*10.135)));
  p[4]=vec(...AXES.map(a=>F(p[2][a]+back[a]*1.867542-right[a]*10.135)));
  p[5]=add(p[0],times(forward,10));
  return p;
}
function auxiliaryTargets(center,forward,up,right){
  const raised=vec(...AXES.map(a=>F(center[a]+up[a]*13+forward[a]*37)));
  const pivot=vec(...AXES.map(a=>F(raised[a]-forward[a]*41.070999)));
  const back=normalized(times(forward,-1)),side=normalized(right);
  return [copy(center),raised,pivot,
    vec(...AXES.map(a=>F(pivot[a]+back[a]*1.867542+side[a]*10.135))),
    vec(...AXES.map(a=>F(pivot[a]+back[a]*1.867542-side[a]*10.135))),
    add(center,times(normalized(forward),10))];
}

/** Pure actor23 target preparation; inputs/outputs are world displacements. */
export function prepareNativeRiderWipeoutPose({positions,storedDeltas,center,forward,up,right,scale=.025}={}){
  scaleValue(scale);
  const current=nativeVectors(positions,COUNT,scale,'positions');
  const history=nativeVectors(storedDeltas,COUNT,scale,'storedDeltas');
  const c=nativeVector(center,scale,'center'),f=axis(forward,'forward'),u=axis(up,'up'),r=axis(right,'right');
  const p=current.map((point,i)=>{
    const target=add(point,times(history[i],F(.95)));
    target.y=Math.max(-16000,F(target.y-3.5));return target;
  });
  let neck=minus(p[1],p[2]);
  neck=times(neck,ratio(14.483002,length(neck),'head base'));
  p[1]=add(p[2],neck);
  const shoulderCenter=add(p[2],times(neck,F(.8662847876548767)));
  const shoulderDirection=minus(p[3],p[11]);
  const shoulder=times(shoulderDirection,ratio(7,length(shoulderDirection),'shoulder spacing'));
  p[3]=add(shoulderCenter,shoulder);p[11]=minus(shoulderCenter,shoulder);
  const hipDirection=vec(...AXES.map(a=>F(.5*F(p[7][a]+p[15][a])-p[1][a])));
  const hipCenter=add(p[2],times(hipDirection,ratio(2.729486,length(hipDirection),'hip center')));
  const hipDirectionAcross=minus(p[7],p[15]);
  const hip=times(hipDirectionAcross,ratio(3.133,length(hipDirectionAcross),'hip spacing'));
  p[7]=add(hipCenter,hip);p[15]=minus(hipCenter,hip);
  for(const [point,other,distance] of [[4,15,2],[5,15,4],[6,15,6],[12,7,2],[13,7,4],[14,7,6],
    [8,1,2],[9,1,4],[10,1,6],[16,1,2],[17,1,4],[18,1,6]])pushAway(p,point,other,distance);
  for(const [a,b,distance] of [[1,0,25],[3,4,8.543002128601074],[11,12,8.543002128601074],
    [4,5,10.456999778747559],[12,13,10.456999778747559],[5,6,3.5],[13,14,3.5],
    [7,8,17.263002395629883],[15,16,17.263002395629883],
    [8,9,18.86184310913086],[16,17,18.86184310913086],[9,10,10],[17,18,10]])enforceLength(p,a,b,distance);
  return {targets:worldVectors(decodedPhysicalPoints(p),scale),
    auxiliaryTargets:worldVectors(auxiliaryTargets(c,f,u,r),scale),nextAnimationFrame:0};
}

/**
 * Reconstruct targets read from a previously completed physical render pose.
 * Capture after BOTH solves; retain until the NEXT solve's history storage.
 * Do not use the current prepared targets as this prior-frame history, and do
 * not subtract hull velocity from these world points. Arrays are copied.
 *
 * This reproduces the source fixed endpoint extensions at the explicit scale;
 * arbitrary authored rig dimensions require an explicit compatible-rig policy.
 * These values are history targets, not mutations to the current solved points.
 */
export function physicalPoseHistoryTargets({positions,auxiliaryPositions,scale=.025}={}){
  scaleValue(scale);
  const p=nativeVectors(positions,COUNT,scale,'positions');
  const aux=nativeVectors(auxiliaryPositions,6,scale,'auxiliaryPositions');
  return {historyTargets:worldVectors(decodedPhysicalPoints(p),scale),
    auxiliaryHistoryTargets:worldVectors(decodedAuxiliaryPoints(aux),scale)};
}
