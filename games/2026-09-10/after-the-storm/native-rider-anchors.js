// Independent auxiliary physical rider-anchor mechanics, rows19..24. Targets,
// rest geometry and radius belong to the caller; no original pose/mesh data is
// included. Roles are geometric, not assertions about original visual parts.
//
// Solve once after current pose preparation and BEFORE the19-point rider solve.
// Its type2/type3 hand constraints consume these actual grip outputs. C68 is a
// separate source mode field, not the point type of row21. Mode0 copies targets;
// mode1 follows the pivot target with uncapped up-axis lag/history then fits a
// semicircle. Other nonzero modes fit the retained current pivot without that
// target-following stage. The observed actor initializer selects only0 or1.
//
// All geometry is in world units. Native's fixed circle radius is represented
// by explicit radiusWorld; deriving it from authored rest is a modern rig choice.
// historyTargets come from the prior rendered physical pose, not a new visual
// bone read. The per-frame storedDelta is current-historyTarget, not m/s.

export const NATIVE_RIDER_ANCHOR_ROLES=Object.freeze(['supportA','center','pivot','gripA','gripB','supportB']);
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const minus=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const add=(a,b)=>vec(a.x+b.x,a.y+b.y,a.z+b.z);
const times=(p,t)=>vec(p.x*t,p.y*t,p.z*t);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const length=p=>Math.hypot(p.x,p.y,p.z);
function vector(p,name){
  if(!p||![p.x,p.y,p.z].every(Number.isFinite))throw new TypeError(`${name} requires finite x, y and z`);
  return p;
}
function vectors(rows,name){
  if(!Array.isArray(rows)||rows.length!==6)throw new TypeError(`${name} must contain six world vectors`);
  return rows.map((p,i)=>copy(vector(p,`${name}[${i}]`)));
}
function positive(v,name){if(!Number.isFinite(v)||v<=0)throw new RangeError(`${name} must be positive`);return v;}
function modeValue(mode){if(!Number.isInteger(mode)||mode<0||mode>255)throw new RangeError('mode must be an integer from 0 to 255');return mode;}

/** Recovered actor-initialization selection; later explicit mode remains owned by caller. */
export function nativeRiderAnchorMode(actorState){
  if(!Number.isInteger(actorState)||actorState<-1||actorState>255)throw new RangeError('actorState must be an integer from -1 to 255');
  return actorState===8||actorState===17||(actorState>=18&&actorState<=21)?0:1;
}

/** Authored rest-radius derivation is explicit and does not choose a source pose. */
export function prepareNativeRiderAnchorRest(restTargets){
  const p=vectors(restTargets,'restTargets');
  return Object.freeze({radiusWorld:positive(length(minus(p[2],p[1])),'rest pivot radius')});
}

/**
 * Pure auxiliary solve. The circle center is target1, its support axis is
 * target5-target0, and the allowed semicircle points from that support chord
 * toward the center. Outside that half-plane, the pivot clips to a signed axis
 * endpoint. On the boundary it takes the plane/arc branch (strict comparison).
 * Geometry with a collapsed plane/direction is rejected before state mutation;
 * no source fallback for its undefined divide-by-zero case is invented.
 */
export function solveNativeRiderAnchors({positions,targets,storedDeltas,up,mode=1,radiusWorld}={}){
  const current=vectors(positions,'positions'),goal=vectors(targets,'targets');
  const history=vectors(storedDeltas,'storedDeltas');modeValue(mode);positive(radiusWorld,'radiusWorld');
  if(mode===0)return {positions:goal,anchors:{2:copy(goal[3]),3:copy(goal[4])},branch:'copy',candidate:copy(goal[2])};
  let pivot=current[2];
  if(mode===1){
    vector(up,'up');if(Math.abs(length(up)-1)>1e-6)throw new RangeError('up must be a unit hull axis');
    const d=minus(goal[2],pivot),oldUp=dot(history[2],up);
    pivot=add(add(pivot,d),times(up,(oldUp<0?.6*oldUp:0)-.6*dot(d,up)));
  }
  const candidate=copy(pivot),axis=minus(goal[5],goal[0]),normal=cross(minus(goal[1],goal[5]),axis);
  const normalSquared=dot(normal,normal);
  if(normalSquared===0)throw new RangeError('Anchor support plane is collapsed');
  const r=minus(pivot,goal[1]);let direction,branch;
  if(dot(r,cross(axis,normal))<0){
    const sign=dot(r,axis)<0?-1:1;direction=times(axis,sign);
    branch=sign<0?'endpointNegative':'endpointPositive';
  }else{
    direction=minus(r,times(normal,dot(r,normal)/normalSquared));branch='planeArc';
  }
  const distance=length(direction);
  if(distance===0)throw new RangeError('Anchor pivot direction is collapsed');
  goal[2]=add(goal[1],times(direction,radiusWorld/distance));
  const correction=minus(goal[2],targets[2]);
  goal[3]=add(goal[3],correction);goal[4]=add(goal[4],correction);
  for(const p of goal)vector(p,'solved auxiliary point');
  return {positions:goal,anchors:{2:copy(goal[3]),3:copy(goal[4])},branch,candidate};
}

/** Copy explicit authored initial geometry and history; no neutral joint is invented. */
export function createNativeRiderAnchors({restTargets,positions=restTargets,historyTargets=positions,radiusWorld}={}){
  const p=vectors(positions,'positions'),history=vectors(historyTargets,'historyTargets');
  const radius=radiusWorld===undefined?prepareNativeRiderAnchorRest(restTargets).radiusWorld:positive(radiusWorld,'radiusWorld');
  return {radiusWorld:radius,logicalFrames:0,mode:null,branch:null,
    points:p.map((position,i)=>({position,storedDelta:minus(position,history[i])})),
    anchors:{2:copy(p[3]),3:copy(p[4])}};
}

/** One logical-frame auxiliary solve, followed by explicit rendered-target history storage. */
export function stepNativeRiderAnchors(state,{targets,historyTargets,up,mode=1}={}){
  if(!state||state.points?.length!==6)throw new TypeError('Expected a six-point auxiliary rider state');
  const history=vectors(historyTargets,'historyTargets');
  const solved=solveNativeRiderAnchors({positions:state.points.map(p=>p.position),targets,
    storedDeltas:state.points.map(p=>p.storedDelta),up,mode,radiusWorld:state.radiusWorld});
  state.points=solved.positions.map((position,i)=>({position,storedDelta:minus(position,history[i])}));
  state.anchors=solved.anchors;state.mode=mode;state.branch=solved.branch;state.logicalFrames++;
  return state;
}
