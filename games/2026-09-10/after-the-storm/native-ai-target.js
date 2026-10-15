// Independently reconstructed numeric AI lookahead, metric and aim producers.
// This leaf does not select a course table, change persistent navigation or
// primary progress, predict motion, steer, award power, or advance a clock.
import {createNativeAIRouteState} from './native-ai-route.js';

const F=Math.fround,tables=new WeakMap(),windows=new WeakMap(),preparations=new WeakMap();
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
function integer(value,name,min=-2147483648,max=2147483647){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid ${name}`);return value;
}
function finite(value,name='AI target value'){
 if(!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must be finite binary32`);return F(value);
}
const add=(a,b)=>finite(a+b),sub=(a,b)=>finite(a-b),mul=(a,b)=>finite(a*b),div=(a,b)=>finite(a/b);
function point(value,name){
 if(!value||typeof value!=='object')throw new TypeError(`Expected ${name} x/z`);
 return {x:finite(value.x,`${name}.x`),z:finite(value.z,`${name}.z`)};
}
const plus=(a,b,k=1)=>({x:add(a.x,mul(b.x,k)),z:add(a.z,mul(b.z,k))});
const minus=(a,b,k=1)=>({x:sub(a.x,mul(b.x,k)),z:sub(a.z,mul(b.z,k))});
const perpendicular=v=>({x:v.z,z:finite(-v.x)});
function dataFor(table){const data=tables.get(table);if(!data)throw new TypeError('Expected a compiled native AI target table');return data;}
function windowFor(table,window){
 const data=dataFor(table);
 if(windows.get(window)!==table)throw new TypeError('Target window belongs to another table; restore its row fields explicitly');
 return data;
}
function preparedFor(table,prepared){
 const data=dataFor(table);
 if(preparations.get(prepared)!==table)throw new TypeError('Target metrics belong to another table; prepare a copied sample explicitly');
 return data;
}
function classification(type){
 return [1,5,7,10,13,16,19,22].includes(type)?1:[8,11,14,17,20,23].includes(type)?4:
  type===2||type===3?type:type>=24?type-18:0;
}

/** Compile the immutable geometry for one explicitly selected route table.
 * `route` is a createNativeAIRoute result. `nodes` contains ALL corresponding
 * sourceBuoyLayout.nodes, including the groups excluded by the human judge.
 * Those x/z coordinates are WORLD units; every field ending Native is native
 * distance, and all axes are dimensionless binary32 values. No heading is
 * regenerated here: the route's exact supplied axis (or its declared phase
 * fallback) is retained. The source half width and raw suppression identity
 * must be supplied; human `enabled` and nextSourceRow do not replace them.
 *
 * Initialized endpoints remain fixed when current centers later move. An
 * actual initialized runtime endpoint/passing-axis snapshot may be injected
 * with endpointPlusNativeXZ, endpointMinusNativeXZ and passingDirectionXZ.
 */
export function createNativeAITargetTable({route,nodes}={}){
 // This also rejects a structurally similar but uncompiled foreign graph.
 createNativeAIRouteState(route,{avatar:0,navigationSourceRow:route?.nodes?.[0]?.sourceRow});
 if(!Array.isArray(nodes)||nodes.length!==route.nodes.length)throw new RangeError('Expected all source geometry nodes');
 const supplied=new Map();
 for(const node of nodes){
  const row=integer(node?.sourceRow,'sourceRow',0,65535);
  if(supplied.has(row))throw new RangeError('Duplicate target geometry sourceRow');supplied.set(row,node);
 }
 const copied=route.nodes.map(q=>{
  const n=supplied.get(q.sourceRow);if(!n)throw new RangeError('Missing target geometry sourceRow');
  const center=point({x:q.x/route.scale,z:q.z/route.scale},'initial route center');
  const suppliedCenter=point({x:n.x/route.scale,z:n.z/route.scale},'geometry node');
  if(center.x!==suppliedCenter.x||center.z!==suppliedCenter.z||n.classification!==q.classification)
   throw new RangeError('Target geometry does not match its route');
  if(n.tx!==undefined&&finite(n.tx)!==q.tx||n.tz!==undefined&&finite(n.tz)!==q.tz)
   throw new RangeError('Target geometry axis does not match its route');
  const halfWidthNative=finite(n.halfWidthNative,'halfWidthNative');
  if(halfWidthNative<0)throw new RangeError('Invalid halfWidthNative');
  let suppressed=n.suppressed;
  if(n.nativeType!==undefined){
   integer(n.nativeType,'nativeType',0,32);
   if(classification(n.nativeType)!==q.classification)throw new RangeError('Raw type does not match route classification');
   const rawSuppressed=n.nativeType===4||n.nativeType===5;
   if(suppressed!==undefined&&suppressed!==rawSuppressed)throw new RangeError('Inconsistent raw suppression identity');
   suppressed=rawSuppressed;
  }
  if(typeof suppressed!=='boolean')throw new TypeError('Supply suppressed or nativeType explicitly');
  const forwardXZ=point({x:q.tx,z:q.tz},'forward axis'),acrossXZ=perpendicular(forwardXZ);
  const initial=point(n.initialPositionNativeXZ??center,'initialized center');
  if((n.endpointPlusNativeXZ===undefined)!==(n.endpointMinusNativeXZ===undefined))throw new TypeError('Supply both initialized endpoints');
  const endpointPlusNativeXZ=n.endpointPlusNativeXZ===undefined?plus(initial,acrossXZ,halfWidthNative):point(n.endpointPlusNativeXZ,'plus endpoint');
  const endpointMinusNativeXZ=n.endpointMinusNativeXZ===undefined?minus(initial,acrossXZ,halfWidthNative):point(n.endpointMinusNativeXZ,'minus endpoint');
  const passingDirectionXZ=n.passingDirectionXZ===undefined?
   q.classification===0?{x:finite(-acrossXZ.x),z:finite(-acrossXZ.z)}:
    q.classification===1?{...acrossXZ}:{x:0,z:0}:point(n.passingDirectionXZ,'passing axis');
  return {sourceRow:q.sourceRow,classification:q.classification,routeGroup:q.routeGroup,suppressed,halfWidthNative,
   centerNativeXZ:center,initialPositionNativeXZ:initial,forwardXZ,acrossXZ,passingDirectionXZ,
   endpointPlusNativeXZ,endpointMinusNativeXZ,nextByAvatar:[...q.nextByAvatar],previousByAvatar:[...q.previousByAvatar]};
 });
 if(supplied.size!==copied.length)throw new RangeError('Unknown target geometry sourceRow');
 const table=freeze({scale:route.scale,courseIndex:route.courseIndex,family:route.family,nodes:copied,
  provenance:{status:'reconstructed-native-ai-target-producers',coordinates:route.provenance.coordinates,
   units:'native XZ distances; dimensionless binary32 axes',endpoints:'initialized once; mutable centers are separate',
   scope:'two lookahead passes and aim only; source table selection and later course/floor/proximity corrections are external'}});
 tables.set(table,{nodes:copied,byRow:new Map(copied.map(n=>[n.sourceRow,n]))});return table;
}

/** A scratch lookahead window, separate from the persistent navigation index.
 * Pass real avatar identity and navigationSourceRow from the route state.
 * Omit targetSourceRow only for the source's initial target=current window.
 * JSON row fields can be restored by calling this function again explicitly.
 */
export function createNativeAITargetWindow(table,{avatar,navigationSourceRow,targetSourceRow=navigationSourceRow}={}){
 const data=dataFor(table);integer(avatar,'avatar',0,3);
 const node=row=>{integer(row,'sourceRow',0,65535);const q=data.byRow.get(row);if(!q)throw new RangeError('Unknown target sourceRow');return q;};
 const current=node(navigationSourceRow),target=node(targetSourceRow),next=node(target.nextByAvatar[avatar]),previous=node(target.previousByAvatar[avatar]);
 const window=freeze({avatar,navigationSourceRow,targetSourceRow,nextSourceRow:next.sourceRow,previousSourceRow:previous.sourceRow,
  navigationClassification:current.classification,targetClassification:target.classification,
  nextClassification:next.classification,previousClassification:previous.classification});
 windows.set(window,table);return window;
}

// The source's segment normalizer divides each component by the rounded
// length. It is intentionally different from the reciprocal-multiply helper
// used by predicted/right directions. A squared underflow leaves deltas intact.
function segment(origin,target){
 const x=sub(target.x,origin.x),z=sub(target.z,origin.z),squared=add(mul(x,x),mul(z,z));
 const distanceNative=squared===0?squared:finite(Math.sqrt(squared));
 return {originNativeXZ:{...origin},targetNativeXZ:{...target},
  directionXZ:squared===0?{x,z}:{x:div(x,distanceNative),z:div(z,distanceNative)},distanceNative};
}
function distance(a,b){const x=sub(a.x,b.x),z=sub(a.z,b.z);return finite(Math.sqrt(add(mul(x,x),mul(z,z))));}
function truncated(value){const n=Math.trunc(value);return integer(n===0?0:n,'native distance integer',0,2147483647);}
function lineDistance(p,a,b){
 if(a.x===b.x){const x=sub(p.x,a.x);return p.x>=a.x?x:finite(-x);}
 const slope=div(sub(b.z,a.z),sub(b.x,a.x));
 const denominator=finite(Math.sqrt(add(mul(slope,slope),1)));
 const numerator=add(add(mul(slope,p.x),mul(-1,p.z)),sub(a.z,mul(slope,a.x)));
 return div(numerator>=0?numerator:finite(-numerator),denominator);
}
// Preserve the actual producer's second-vector zero predicate: dx²+dz+dz.
// Replacing it with a conventional squared norm changes original decisions.
function side(p,a,b){
 const ax=sub(a.x,p.x),az=sub(a.z,p.z);
 if(add(mul(ax,ax),mul(az,az))===0)return -1;
 const bx=sub(b.x,p.x),bz=sub(b.z,p.z);
 if(add(add(mul(bx,bx),bz),bz)===0)return -1;
 return mul(ax,bz)<mul(bx,az)?1:-1;
}
function positions(data,overrides){
 if(overrides===undefined)return data.nodes.map(n=>({sourceRow:n.sourceRow,...n.centerNativeXZ}));
 if(!Array.isArray(overrides)||overrides.length!==data.nodes.length)throw new RangeError('Expected one native current center per node');
 const copied=new Map();
 for(const value of overrides){
  const row=integer(value?.sourceRow,'position sourceRow',0,65535);
  if(!data.byRow.has(row)||copied.has(row))throw new RangeError('Unknown or duplicate current-center sourceRow');
  copied.set(row,{sourceRow:row,...point(value,'current center')});
 }
 return data.nodes.map(n=>copied.get(n.sourceRow));
}

/** One copied actual-body/current-center sample of the source metric producer.
 * positionNativeXZ is body+44/+4c; nodePositionsNative is a COMPLETE native
 * {sourceRow,x,z} snapshot when centers move. Only centers are overridden.
 * The prepared sample is immutable and owned by this table. To restore JSON,
 * rebuild its window and prepare the recorded position/center sample again.
 */
export function prepareNativeAITargetMetrics(table,window,{positionNativeXZ,nodePositionsNative}={}){
 const data=windowFor(table,window),p=point(positionNativeXZ,'body position'),copied=positions(data,nodePositionsNative);
 const byRow=new Map(copied.map(n=>[n.sourceRow,n])),center=row=>point(byRow.get(row),'node center');
 const current=data.byRow.get(window.navigationSourceRow),target=data.byRow.get(window.targetSourceRow),next=data.byRow.get(window.nextSourceRow);
 const c=center(current.sourceRow),t=center(target.sourceRow),n=center(next.sourceRow),previous=center(window.previousSourceRow);
 const lines={previousToTarget:segment(previous,t),hullToTarget:segment(p,t),hullToNext:segment(p,n),
  hullToNextPlusInset:segment(p,minus(next.endpointPlusNativeXZ,next.acrossXZ,50)),
  hullToNextMinusInset:segment(p,plus(next.endpointMinusNativeXZ,next.acrossXZ,50)),
  passingTargetToNext:segment(plus(t,target.passingDirectionXZ,50),plus(n,next.passingDirectionXZ,50)),
  hullToNavigation:segment(p,c)};
 const prepared=freeze({window,positionNativeXZ:p,nodePositionsNative:copied,lines,
  navigationPlaneDistanceNative:truncated(lineDistance(p,c,plus(c,current.acrossXZ,256))),
  targetPlaneDistanceNative:truncated(lineDistance(p,t,plus(t,target.acrossXZ,256))),
  previousTargetDistanceNative:truncated(distance(t,previous)),navigationDistanceNative:truncated(distance(c,p)),
  targetSide:side(t,plus(t,target.forwardXZ,256),p)});
 preparations.set(prepared,table);return prepared;
}

/** One source lookahead pass. It only changes the returned scratch target.
 * Southern additionally requires the actual signed source lap counter; its
 * class8/9 skips are source decisions, not browser-lap or tide inferences.
 */
export function advanceNativeAITarget(table,prepared,{sourceLap}={}){
 const data=preparedFor(table,prepared),w=prepared.window,p=prepared.positionNativeXZ;
 if(table.courseIndex===7||sourceLap!==undefined)integer(sourceLap,'sourceLap');
 const centers=new Map(prepared.nodePositionsNative.map(n=>[n.sourceRow,n]));
 const t=data.byRow.get(w.targetSourceRow),n=data.byRow.get(w.nextSourceRow),tc=centers.get(t.sourceRow),nc=centers.get(n.sourceRow);
 const lines=prepared.lines;let advance=false,reason='held';
 if(w.targetClassification===0||w.targetClassification===1){
  const red=w.targetClassification===0;
  if(w.targetSourceRow===w.navigationSourceRow&&prepared.navigationPlaneDistanceNative<300&&!t.suppressed){advance=true;reason='current-colored-plane-near';}
  else{
   let a,b;
   if(w.nextClassification===0||w.nextClassification===1||w.nextClassification===4){
    const normal=perpendicular(lines.hullToNext.directionXZ);
    a=red?minus(tc,normal,80):plus(tc,normal,80);b=nc;
    if(red&&w.nextClassification===1)b=plus(nc,normal,300);
    if(!red&&w.nextClassification===0)b=minus(nc,normal,300);
   }else if(w.nextClassification===2||w.nextClassification===3){
    const normal=perpendicular((red?lines.hullToNextMinusInset:lines.hullToNextPlusInset).directionXZ);
    a=red?minus(tc,normal,80):plus(tc,normal,80);
    b=red?plus(n.endpointMinusNativeXZ,normal,50):minus(n.endpointPlusNativeXZ,normal,50);
   }
   if(a){advance=side(p,a,b)===(red?-1:1);reason=advance?'colored-next-side':'colored-side-held';}
  }
 }else if(w.targetClassification===2||w.targetClassification===3){
  advance=side(p,nc,minus(t.endpointPlusNativeXZ,t.acrossXZ,120))===1&&
   side(p,nc,plus(t.endpointMinusNativeXZ,t.acrossXZ,120))===-1;
  reason=advance?'checkpoint-lookahead-span':'checkpoint-span-held';
 }else if([4,8,9].includes(w.targetClassification)){
  advance=lines.hullToTarget.distanceNative<500||prepared.targetPlaneDistanceNative<500&&lines.hullToTarget.distanceNative<1000;
  reason=advance?'guide-distance':'guide-distance-held';
 }
 let row=advance?w.nextSourceRow:w.targetSourceRow;const skipped=[];
 if(table.courseIndex===7){
  const skip=classification=>sourceLap===0||sourceLap===1?classification===8||classification===9:sourceLap===2?classification===9:classification===8;
  const seen=new Set();
  while(skip(data.byRow.get(row).classification)){
   if(seen.has(row))throw new RangeError('Southern lookahead contains no eligible target');seen.add(row);skipped.push(row);
   row=data.byRow.get(row).nextByAvatar[w.avatar];
  }
 }
 const window=createNativeAITargetWindow(table,{avatar:w.avatar,navigationSourceRow:w.navigationSourceRow,targetSourceRow:row});
 return freeze({window,diagnostic:{reason,generalAdvance:advance,beforeTargetSourceRow:w.targetSourceRow,afterTargetSourceRow:row,southernSkippedSourceRows:skipped}});
}

/** Source near-mode selection plus aim-point production. An explicit0/1
 * nearMode can instead evaluate that exact source parameter in isolation.
 * Later corrections may change direction alone: do not reconstruct this
 * segment from its point after applying those corrections.
 */
export function prepareNativeAIAim(table,prepared,{nearMode}={}){
 const data=preparedFor(table,prepared),w=prepared.window,p=prepared.positionNativeXZ;
 const near=nearMode===undefined?+(prepared.targetPlaneDistanceNative<600||prepared.lines.hullToTarget.distanceNative<600):integer(nearMode,'nearMode',0,1);
 const t=data.byRow.get(w.targetSourceRow),centers=new Map(prepared.nodePositionsNative.map(n=>[n.sourceRow,n]));
 const tc=centers.get(t.sourceRow),nc=centers.get(w.nextSourceRow),previous=centers.get(w.previousSourceRow);
 const direction=prepared.lines.hullToTarget.directionXZ,passing=prepared.lines.passingTargetToNext.directionXZ;
 let aim={x:tc.x,z:tc.z},reason='center';
 if(w.targetClassification===0||w.targetClassification===1){
  const red=w.targetClassification===0,longitudinal=near?120:-50,lateral=near?120:250;
  const a=mul(t.suppressed?120:longitudinal,direction.x),b=mul(t.suppressed?200:lateral,direction.z);
  const c=mul(t.suppressed?120:longitudinal,direction.z),d=mul(t.suppressed?200:lateral,direction.x);
  let x=red?sub(a,b):add(a,b),z=red?add(c,d):sub(c,d);
  if(!t.suppressed){x=sub(x,mul(0,passing.x));z=sub(z,mul(0,passing.z));}
  aim={x:add(aim.x,x),z:add(aim.z,z)};reason=t.suppressed?'suppressed-colored-offset':'colored-offset';
 }else if(w.targetClassification===2||w.targetClassification===3){
  const minusInset=plus(t.endpointMinusNativeXZ,t.acrossXZ,120),plusInset=minus(t.endpointPlusNativeXZ,t.acrossXZ,120);
  if(side(p,minusInset,nc)===-1){aim=minusInset;reason='minus-inset';}
  else if(side(p,plusInset,nc)===1){aim=plusInset;reason='plus-inset';}
  else if(w.targetSourceRow!==w.navigationSourceRow){
   const normal=perpendicular(direction);
   if(w.previousClassification===0&&side(p,minus(previous,normal,50),tc)===1){
    // Both coordinates really use across.x in this source fallback.
    aim={x:add(t.endpointMinusNativeXZ.x,mul(t.acrossXZ.x,120)),z:add(t.endpointMinusNativeXZ.z,mul(t.acrossXZ.x,120))};reason='previous-red-inset';
   }else if(w.previousClassification===1&&side(p,plus(previous,normal,50),tc)===-1){
    aim={x:sub(t.endpointPlusNativeXZ.x,mul(t.acrossXZ.x,120)),z:sub(t.endpointPlusNativeXZ.z,mul(t.acrossXZ.x,120))};reason='previous-yellow-inset';
   }
  }
 }
 return freeze({nearMode:near,segment:segment(p,aim),diagnostic:{reason}});
}

/** Complete bounded target pipeline for ONE source outer producer sample:
 * metrics -> lookahead -> metrics -> lookahead -> metrics -> near/aim.
 * source80400 runs this branch only for scene input state3; the other branch
 * is its separate zero-axis/pulsed-button producer. Motion prediction precedes
 * this pipeline; course/floor/proximity corrections and steering follow it.
 */
export function prepareNativeAITarget(table,{avatar,navigationSourceRow,positionNativeXZ,nodePositionsNative,sourceLap}={}){
 let window=createNativeAITargetWindow(table,{avatar,navigationSourceRow}),prepared;
 const sample={positionNativeXZ,nodePositionsNative},lookahead=[];
 for(let pass=0;pass<2;pass++){
  prepared=prepareNativeAITargetMetrics(table,window,sample);
  const result=advanceNativeAITarget(table,prepared,{sourceLap});window=result.window;lookahead.push(result.diagnostic);
 }
 prepared=prepareNativeAITargetMetrics(table,window,sample);
 const aim=prepareNativeAIAim(table,prepared);
 return freeze({window,metrics:prepared,lookahead,nearMode:aim.nearMode,segment:aim.segment,
  originNativeXZ:aim.segment.originNativeXZ,targetNativeXZ:aim.segment.targetNativeXZ,
  targetDirectionXZ:aim.segment.directionXZ,distanceNative:aim.segment.distanceNative,diagnostic:aim.diagnostic});
}
