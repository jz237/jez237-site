// Independently reconstructed physical rider projection/constraint kernel.
// The caller owns all pose/rest geometry, animation, body side assignment and
// auxiliary grip anchors. No original animation or mesh data is included.
//
// Run ONCE after each five-tick hull frame, then latch jointWorld for the NEXT
// frame's trim preparation. This is not a 100Hz force or a visual-bone lookup.
// The 19-point solve uses 22 links and eight Jacobi passes. Its storedDelta is
// solvedPosition-historyTarget, NOT a velocity or an inferred finite difference.
// historyTargets must therefore come from the caller's prior rendered pose.
//
// The separate auxiliary handlebar/seat solver, target animation, pose-specific
// point types and rider collision are not ported. A separate controls helper may
// preprocess crouch targets and supply its explicit manipulation deltas below.
// Type2/3 grip anchors must be supplied explicitly. Anatomical names describe
// the recovered chain topology; A/B deliberately leaves handedness to the rig.

export const NATIVE_RIDER_ROLES=Object.freeze([
  'headTip','headBase','torsoRoot','shoulderA','elbowA','wristA','gripA',
  'hipA','kneeA','ankleA','toeA','shoulderB','elbowB','wristB','gripB',
  'hipB','kneeB','ankleB','toeB'
]);
export const NATIVE_RIDER_LINKS=Object.freeze([
  [0,1],[1,3],[1,11],[1,2],[3,11],[3,2],[3,4],[4,5],[5,6],
  [11,2],[11,12],[12,13],[13,14],[2,7],[2,15],[7,15],[7,8],
  [8,9],[9,10],[15,16],[16,17],[17,18]
].map(Object.freeze));
export const NATIVE_RIDER_ORDINARY_TYPES=Object.freeze([1,1,1,1,1,1,2,1,1,4,4,1,1,1,3,1,1,4,4]);
const COUNT=19,LINK_GAIN=.5/(1+17*.1),PASSES=8;
const vec=(x=0,y=0,z=0)=>({x,y,z});
const copy=p=>vec(p.x,p.y,p.z);
const subtract=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const length=p=>Math.hypot(p.x,p.y,p.z);
const fixed=type=>type===0||type===2||type===3;
function vector(p,name){
  if(!p||![p.x,p.y,p.z].every(Number.isFinite))throw new TypeError(`${name} requires finite x, y and z`);
  return p;
}
function vectors(rows,name){
  if(!Array.isArray(rows)||rows.length!==COUNT)throw new TypeError(`${name} must contain nineteen world vectors`);
  return rows.map((p,i)=>copy(vector(p,`${name}[${i}]`)));
}
function pointTypes(types){
  if(!Array.isArray(types)||types.length!==COUNT||types.some(t=>!Number.isInteger(t)||t<0||t>5))throw new RangeError('types must contain nineteen integers from 0 to 5');
  return [...types];
}
function lengths(restLengths){
  if(!Array.isArray(restLengths)||restLengths.length!==22||restLengths.some(d=>!Number.isFinite(d)||d<=0))throw new RangeError('restLengths must contain twenty-two positive world lengths');
  return [...restLengths];
}
function scaleValue(scale){
  if(!Number.isFinite(scale)||scale<=0)throw new RangeError('scale must be positive');
  return scale;
}

/** Map an independently authored anatomical pose to the explicit point order. */
export function nativeRiderTargetsFromPose(pose){
  return NATIVE_RIDER_ROLES.map(role=>copy(vector(pose?.[role],`pose.${role}`)));
}

/** Derive all link rest lengths from the caller's own nineteen world targets. */
export function prepareNativeRiderRest(restTargets){
  const p=vectors(restTargets,'restTargets');
  return Object.freeze(lengths(NATIVE_RIDER_LINKS.map(([a,b])=>length(subtract(p[b],p[a])))));
}

/**
 * Pure target projection before links. Up is the hull's unit world up axis;
 * scale converts the 50-unit target limit and two minimum-up thresholds to
 * world units. anchors[2]/anchors[3] are actual physical auxiliary outputs,
 * independent of targets[6]/targets[14]. This helper does not invent them.
 * Optional manipulationDeltas add to the prior stored deltas before testing
 * the sign of their up projection. They are world displacements, not forces or
 * a post-solve velocity. Source crouch writes this same channel before clipping.
 */
export function projectNativeRiderTargets({positions,targets,storedDeltas,manipulationDeltas,
  types=NATIVE_RIDER_ORDINARY_TYPES,center,up,anchors={},scale=.025}={}){
  const current=vectors(positions,'positions'),goal=vectors(targets,'targets');
  const history=vectors(storedDeltas,'storedDeltas'),kinds=pointTypes(types);
  const manipulation=manipulationDeltas===undefined?null:vectors(manipulationDeltas,'manipulationDeltas');
  vector(center,'center');vector(up,'up');scaleValue(scale);
  if(Math.abs(length(up)-1)>1e-6)throw new RangeError('up must be a unit hull axis');
  if(!anchors||typeof anchors!=='object')throw new TypeError('anchors must be an object');
  for(const kind of [2,3])if(kinds.includes(kind))vector(anchors[kind],`anchors[${kind}]`);
  for(let i=COUNT-1;i>=0;i--){
    const kind=kinds[i];
    if(kind===0){current[i]=copy(goal[i]);continue;}
    if(kind===2||kind===3){current[i]=copy(anchors[kind]);continue;}
    let p=current[i],d=subtract(goal[i],p);
    const distance=length(d),limit=50*scale;
    if(kind===1&&distance>limit){
      const t=limit/distance;d=vec(d.x*t,d.y*t,d.z*t);
      p=subtract(goal[i],d);
    }
    const delta=manipulation?vec(history[i].x+manipulation[i].x,
      history[i].y+manipulation[i].y,history[i].z+manipulation[i].z):history[i];
    const oldUp=dot(delta,up);
    const adjustment=(oldUp<0?.6*oldUp:0)-.6*dot(d,up);
    p=vec(p.x+d.x+adjustment*up.x,p.y+d.y+adjustment*up.y,p.z+d.z+adjustment*up.z);
    if(kind===4||kind===5){
      const minimum=(kind===4?.107405:3.107405)*scale;
      const push=Math.max(0,minimum-dot(subtract(p,center),up));
      p.x+=push*up.x;p.y+=push*up.y;p.z+=push*up.z;
    }
    current[i]=p;
  }
  return current;
}

/**
 * Eight simultaneous link passes; positions/rest lengths are world quantities.
 * A fixed first endpoint doubles the second endpoint correction, otherwise a
 * fixed second endpoint doubles the first. That ordered source rule also means
 * a link between two fixed types moves its second endpoint. The ordinary setup
 * has no such link. A collapsed current link is rejected explicitly; no source
 * fallback direction or fabricated physical point is asserted.
 */
export function solveNativeRiderLinks(positions,restLengths,{types=NATIVE_RIDER_ORDINARY_TYPES}={}){
  const p=vectors(positions,'positions'),rest=lengths(restLengths),kinds=pointTypes(types);
  for(let pass=0;pass<PASSES;pass++){
    const changes=Array.from({length:COUNT},()=>vec());
    for(let j=NATIVE_RIDER_LINKS.length-1;j>=0;j--){
      const [a,b]=NATIVE_RIDER_LINKS[j],d=subtract(p[b],p[a]),distance=length(d);
      if(distance===0)throw new RangeError(`Collapsed rider link ${a}-${b}`);
      const t=LINK_GAIN*(rest[j]/distance-1),aWeight=fixed(kinds[a])?0:fixed(kinds[b])?-2:-1;
      const bWeight=fixed(kinds[a])?2:fixed(kinds[b])?0:1;
      for(const axis of ['x','y','z']){
        changes[a][axis]+=aWeight*t*d[axis];changes[b][axis]+=bWeight*t*d[axis];
      }
    }
    for(let i=0;i<COUNT;i++){
      p[i].x+=changes[i].x;p[i].y+=changes[i].y;p[i].z+=changes[i].z;
      vector(p[i],`solved point ${i}`);
    }
  }
  return p;
}

/**
 * Create from authored restTargets, or explicit restLengths plus positions.
 * Initial history defaults to positions (zero stored displacement at reset).
 * All vectors/rest arrays are copied. No constant neutral joint is supplied.
 */
export function createNativeArticulatedRider({restTargets,restLengths,positions=restTargets,
  historyTargets=positions,types=NATIVE_RIDER_ORDINARY_TYPES,scale=.025}={}){
  scaleValue(scale);
  if(restTargets!==undefined&&restLengths!==undefined)throw new TypeError('Supply restTargets or restLengths, not both');
  const rest=restLengths===undefined?prepareNativeRiderRest(restTargets):Object.freeze(lengths(restLengths));
  const p=vectors(positions,'positions'),history=vectors(historyTargets,'historyTargets'),kinds=pointTypes(types);
  return {scale,restLengths:rest,logicalFrames:0,
    points:p.map((position,i)=>({position,storedDelta:subtract(position,history[i]),type:kinds[i]})),
    jointWorld:copy(p[2])};
}

/**
 * One logical-frame solve. targets/historyTargets/anchors are explicit world
 * values from the authored pose provider; historyTargets are intentionally
 * mandatory. Source target clipping occurs once BEFORE the eight link passes,
 * so links may move a foot below that projection's minimum afterwards. Optional
 * manipulationDeltas apply only during this frame's projection. Stored deltas
 * are then replaced by solvedPosition-historyTarget, as in the source consumer.
 * Validation/solving completes before any state mutation on failure.
 */
export function stepNativeArticulatedRider(state,{targets,historyTargets,center,up,anchors,manipulationDeltas,
  types=state?.points?.map(p=>p.type)}={}){
  if(!state||state.points?.length!==COUNT)throw new TypeError('Expected a nineteen-point articulated rider');
  const history=vectors(historyTargets,'historyTargets'),kinds=pointTypes(types);
  const projected=projectNativeRiderTargets({positions:state.points.map(p=>p.position),targets,
    storedDeltas:state.points.map(p=>p.storedDelta),manipulationDeltas,types:kinds,center,up,anchors,scale:state.scale});
  const solved=solveNativeRiderLinks(projected,state.restLengths,{types:kinds});
  state.points=solved.map((position,i)=>({position,storedDelta:subtract(position,history[i]),type:kinds[i]}));
  state.jointWorld=copy(solved[2]);state.logicalFrames++;
  return state;
}
