import {riderPose as modernRiderPose} from './rider-pose.js';
import {createNativeArticulatedRider,NATIVE_RIDER_ORDINARY_TYPES} from './native-articulated-rider.js';
import {createNativeRiderAnchors,stepNativeRiderAnchors,nativeRiderAnchorMode} from './native-rider-anchors.js';

// An explicitly MODERN, independently authored geometry bridge. Anatomy and
// dimensions come from rider-pose.js, never original animation/mesh assets.
// The auxiliary and19-point mechanical solvers are the recovered components.
// Their physical outputs, not a visual bone or neutral constant, drive trim.
//
// Default authored targets are ordinary riding, sampled once per logical frame
// from actual conditioned steering, SI speed and simulation time. This policy
// is modern animation, not the source pose/state machine. Custom poseProvider
// may supply the same anatomy plus explicit pointTypes, anchorMode and optional
// anchorTargetsWorld. Source crouch/animation transitions are not guessed here.
//
// Native adapter use: create with an initialHull having the intended starting
// center/frame/scale, then pass {articulatedRider,riderPose} to the adapter. Its
// end-of-frame callback runs auxiliary anchors BEFORE the adapter's19-point
// solve; solved joint2 is consequently available to the NEXT force frame.

const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const add=(a,b)=>vec(a.x+b.x,a.y+b.y,a.z+b.z);
const minus=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const times=(p,t)=>vec(p.x*t,p.y*t,p.z*t);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const length=p=>Math.hypot(p.x,p.y,p.z);
const midpoint=(a,b)=>times(add(a,b),.5);
const vector=(p,name)=>{
  if(!p||![p.x,p.y,p.z].every(Number.isFinite))throw new TypeError(`${name} requires finite x, y and z`);
  return p;
};
function unit(p,name){vector(p,name);if(Math.abs(length(p)-1)>1e-6)throw new RangeError(`${name} must be unit length`);return p;}
function positive(x,name){if(!Number.isFinite(x)||x<=0)throw new RangeError(`${name} must be positive`);return x;}
function hullData(hull){
  vector(hull?.center,'hull center');positive(hull?.scale,'hull scale');
  for(const name of ['right','up','forward'])unit(hull.frame?.[name],`hull ${name}`);
  if(Math.abs(dot(hull.frame.right,hull.frame.up))+Math.abs(dot(hull.frame.up,hull.frame.forward))+
    Math.abs(dot(hull.frame.forward,hull.frame.right))>1e-6||dot(cross(hull.frame.forward,hull.frame.right),hull.frame.up)<.999999)throw new RangeError('Hull frame must be orthonormal and right handed');
  return hull;
}
function point(pose,bone,end){
  const p=pose?.targets?.[bone]?.[end];
  if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new TypeError(`pose.targets.${bone}[${end}] requires three finite coordinates`);
  return vec(...p);
}
function yawOf(pose){const yaw=pose?.yaw??0;if(!Number.isFinite(yaw))throw new TypeError('pose yaw must be finite');return yaw;}
function yawPoint(p,yaw){const c=Math.cos(yaw),s=Math.sin(yaw);return vec(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
function worldPoint(p,hull,yaw=0){
  const q=yawPoint(p,yaw),{center,frame:{right:r,up:u,forward:f}}=hull;
  return vec(center.x+r.x*q.x+u.x*q.y+f.x*q.z,
    center.y+r.y*q.x+u.y*q.y+f.y*q.z,center.z+r.z*q.x+u.z*q.y+f.z*q.z);
}
const BODY_MAP=Object.freeze([
  ['head',1],['head',0],['torso',0],['upperArmL',0],['upperArmL',1],['handL',0],['handL',1],
  ['thighL',0],['thighL',1],['shinL',1],['footL',1],
  ['upperArmR',0],['upperArmR',1],['handR',0],['handR',1],
  ['thighR',0],['thighR',1],['shinR',1],['footR',1]
].map(Object.freeze));
const TIPS=Object.freeze([[0,1],[6,5],[10,9],[14,13],[18,17]].map(Object.freeze));
function points19(p,name){
  if(!Array.isArray(p)||p.length!==19)throw new TypeError(`${name} must contain nineteen world vectors`);
  return p.map((q,i)=>copy(vector(q,`${name}[${i}]`)));
}
function pointTypes(value){
  if(!Array.isArray(value)||value.length!==19||value.some(t=>!Number.isInteger(t)||t<0||t>5))throw new RangeError('pointTypes must contain nineteen integers from 0 to 5');
  return [...value];
}
const copyResult=result=>({targets:result.targets.map(copy),historyTargets:result.historyTargets.map(copy),
  anchors:{2:copy(result.anchors[2]),3:copy(result.anchors[3])},types:[...result.types]});

/** Map authored anatomical targets into the recovered physical19-role order. */
export function authoredNativeRiderTargets(pose,hull){
  hullData(hull);const yaw=yawOf(pose);
  return BODY_MAP.map(([bone,end])=>worldPoint(point(pose,bone,end),hull,yaw));
}

/**
 * Construct a MODERN support rig from three actual steering-arc samples of the
 * authored hands. No fixed joint/center is guessed. Supports are a constructed
 * chord behind that arc, with the authored grip span; they define its allowed
 * semicircle for the recovered kernel. They are not claimed as original parts.
 */
export function createAuthoredNativeAnchorRig({geometryProvider=modernRiderPose,steeringSample=.3}={}){
  if(typeof geometryProvider!=='function')throw new TypeError('geometryProvider must be a function');
  if(!Number.isFinite(steeringSample)||steeringSample<=0||steeringSample>=Math.PI/2)throw new RangeError('steeringSample must be between 0 and pi/2');
  const poses=[-steeringSample,0,steeringSample].map(steering=>geometryProvider('',0,0,{steering}));
  const grips=poses.map(p=>midpoint(point(p,'handL',1),point(p,'handR',1)));
  const a=minus(grips[1],grips[0]),b=minus(grips[2],grips[0]),n=cross(a,b),n2=dot(n,n);
  if(n2<=1e-24)throw new RangeError('Authored steering samples do not define a circle; supply an explicit anchorRig');
  const center=add(grips[0],times(add(times(cross(b,n),dot(a,a)),times(cross(n,a),dot(b,b))),1/(2*n2)));
  const radial=minus(grips[1],center),radiusWorld=positive(length(radial),'authored steering radius');
  const span=minus(point(poses[1],'handR',1),point(poses[1],'handL',1)),spanLength=positive(length(span),'authored grip span');
  const radialUnit=times(radial,1/radiusWorld),side=times(span,1/spanLength);
  if(Math.abs(dot(radialUnit,side))>1e-6)throw new RangeError('Authored grip span must be perpendicular to its neutral steering radius');
  const chordCenter=minus(center,radial);
  return Object.freeze({provenance:'modern rider-pose steering arc',radiusWorld,
    center:Object.freeze(center),supportA:Object.freeze(add(chordCenter,times(side,-spanLength/2))),
    supportB:Object.freeze(add(chordCenter,times(side,spanLength/2)))});
}

/**
 * Authored render history: physical origins are retained; synthetic head/hand/
 * toe endpoints are rebuilt from the solved direction and authored rest length.
 * This mirrors the recovered endpoint convention using MODERN rest geometry,
 * rather than silently substituting the previous animation's desired targets.
 */
export function authoredNativeRiderHistory(positions,restTargets){
  const p=points19(positions,'positions'),rest=points19(restTargets,'restTargets');
  for(const [tip,base]of TIPS){
    const direction=minus(p[tip],p[base]),distance=length(direction);
    if(distance===0)throw new RangeError('Authored physical endpoint direction is collapsed');
    const restLength=positive(length(minus(rest[tip],rest[base])),'authored endpoint rest length');
    p[tip]=add(p[base],times(direction,restLength/distance));
  }
  return p;
}

function rigData(rig){
  for(const name of ['center','supportA','supportB'])vector(rig?.[name],`anchorRig.${name}`);
  positive(rig?.radiusWorld,'anchorRig.radiusWorld');return rig;
}
export function authoredNativeRiderAuxiliaryTargets(body,pose,hull,rig){
  if(pose.anchorTargetsWorld!==undefined){
    if(!Array.isArray(pose.anchorTargetsWorld)||pose.anchorTargetsWorld.length!==6)throw new TypeError('anchorTargetsWorld must contain six world vectors');
    return pose.anchorTargetsWorld.map((p,i)=>copy(vector(p,`anchorTargetsWorld[${i}]`)));
  }
  const yaw=yawOf(pose);
  return [worldPoint(rig.supportA,hull,yaw),worldPoint(rig.center,hull,yaw),midpoint(body[6],body[14]),
    copy(body[6]),copy(body[14]),worldPoint(rig.supportB,hull,yaw)];
}

/**
 * Adapter-ready bundle. initialHull supplies actual starting center/frame/scale.
 * geometryProvider has riderPose's pure signature and supplies authored rest.
 * poseProvider(hull,context) may supply current pure anatomical pose output.
 * Its optional pointTypes/anchorMode/anchorTargetsWorld are explicit inputs for
 * special poses; source actor animation selection/blending is not performed.
 * Duplicate calls for the same frame return a copied cache without advancing.
 * Skipped/backward frames or a missing preceding19-point solve fail explicitly.
 */
export function createAuthoredNativeRider({initialHull,geometryProvider=modernRiderPose,poseProvider,
  anchorRig,initialLogicalFrame=0,types=NATIVE_RIDER_ORDINARY_TYPES}={}){
  hullData(initialHull);const defaultTypes=pointTypes(types);
  if(typeof geometryProvider!=='function')throw new TypeError('geometryProvider must be a function');
  if(poseProvider!==undefined&&typeof poseProvider!=='function')throw new TypeError('poseProvider must be a function');
  if(!Number.isInteger(initialLogicalFrame)||initialLogicalFrame<0)throw new RangeError('initialLogicalFrame must be nonnegative');
  const suppliedRig=rigData(anchorRig??createAuthoredNativeAnchorRig({geometryProvider}));
  const rig=Object.freeze({provenance:suppliedRig.provenance??'explicit caller-authored support geometry',
    radiusWorld:suppliedRig.radiusWorld,center:Object.freeze(copy(suppliedRig.center)),
    supportA:Object.freeze(copy(suppliedRig.supportA)),supportB:Object.freeze(copy(suppliedRig.supportB))});
  const restPose=geometryProvider('',0,0,{steering:0}),restTargets=authoredNativeRiderTargets(restPose,initialHull);
  const restAux=authoredNativeRiderAuxiliaryTargets(restTargets,restPose,initialHull,rig);
  const anchorState=createNativeRiderAnchors({restTargets:restAux,radiusWorld:rig.radiusWorld});
  const articulatedRider=createNativeArticulatedRider({restTargets,types:defaultTypes,scale:initialHull.scale});
  const scale=initialHull.scale;let nextFrame=initialLogicalFrame,lastFrame=-1,cached=null;
  const sample=poseProvider??((h,c)=>{
    // Authored ordinary animation policy only; no source air/crouch/pose state
    // is inferred from contact counts or an unavailable animation descriptor.
    const x=c.controls?.conditionedXNative??c.controls?.workingXNative??0;
    if(!Number.isFinite(x))throw new TypeError('Conditioned steering must be finite');
    const turn=Math.max(-1,Math.min(1,-x/70)),speed=h.velocity?length(vector(h.velocity,'hull velocity')):0;
    return geometryProvider('',c.time,turn,{speed,steering:turn*.3});
  });
  const provider=(hull,context)=>{
    hullData(hull);
    if(hull.scale!==scale)throw new RangeError('Authored rider and hull scales must match');
    // Source simulation0 skips physical solves while its outer clock continues.
    // The adapter supplies the actual solved-frame owner for that distinction.
    const frame=context?.physicalFrame===undefined?context?.logicalFrame:initialLogicalFrame+context.physicalFrame;
    if(!Number.isInteger(frame)||frame<0||!Number.isFinite(context?.time))throw new TypeError('A logicalFrame and simulation time are required');
    if(frame===lastFrame)return copyResult(cached);
    if(frame!==nextFrame)throw new RangeError('Authored rider must receive consecutive logical frames');
    if(articulatedRider.logicalFrames!==frame-initialLogicalFrame)throw new Error('The preceding nineteen-point physical solve has not completed');
    const pose=sample(hull,context),targets=authoredNativeRiderTargets(pose,hull);
    const currentTypes=pointTypes(pose.pointTypes??defaultTypes);
    const historyTargets=authoredNativeRiderHistory(articulatedRider.points.map(p=>p.position),restTargets);
    const auxTargets=authoredNativeRiderAuxiliaryTargets(targets,pose,hull,rig);
    const auxHistory=anchorState.points.map(p=>copy(p.position));
    const mode=pose.anchorMode??nativeRiderAnchorMode(context.actorState??22);
    stepNativeRiderAnchors(anchorState,{targets:auxTargets,historyTargets:auxHistory,up:hull.frame.up,mode});
    cached={targets,historyTargets,anchors:{2:copy(anchorState.anchors[2]),3:copy(anchorState.anchors[3])},types:currentTypes};
    lastFrame=frame;nextFrame++;return copyResult(cached);
  };
  return {articulatedRider,anchorState,anchorRig:rig,riderPose:provider,restTargets:restTargets.map(copy),
    provenance:Object.freeze({geometry:'modern rider-pose anatomy/rest/steering supports',mechanics:'recovered auxiliary and nineteen-point solvers',
      history:'previous physical origins with authored synthetic endpoint lengths'})};
}
