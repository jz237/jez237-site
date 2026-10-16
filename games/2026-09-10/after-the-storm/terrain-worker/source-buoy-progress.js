// Independent numeric reconstruction of source buoy admission. One call is
// one 50 ms logical sample; the host owns scheduling and skips paused calls.
// This does not sweep/interpolate virtual crossings, change laps or timers,
// award Stunt points, move a craft, select AI branches, or finish a race.
export const SOURCE_BUOY_STEP_MS=50;
const F=Math.fround,MAX=0x7fffffff;
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const forwardSides=[0,0,0,1,0,1,0,0,1,0];
const slackNative=[256,256,1200,256,256,256,512,1300,512,256];
const courseRegions=freeze([
 [[-32768,32767,-32768,32767]],
 [[-30000,1000,-50,30000],[-30000,1000,-30000,50],[500,30000,-50,30000],[500,30000,-30000,50]],
 [[-30000,-1800,-30000,3950],[-30000,30000,3950,30000],[-1800,30000,-30000,3950]],
 [[-2951,799,-250,30000],[-30000,-2800,-30000,-250],[-2800,30000,-30000,-250],[-2607,30000,-250,30000],[-30000,-2800,-250,30000]],
 [[-1000,12000,-1000,29000],[-12000,1000,-29000,1000],[-1000,12000,-29000,1000],[-12000,1000,-1000,29000]],
 [[-30000,-600,-30000,-1250],[-3750,30000,-3250,27500],[-3750,30000,-30000,-1250],[-30000,-2000,-3250,27500]],
 [[700,30000,-1800,30000],[-30000,1250,-1800,30000],[700,30000,-30000,200],[-30000,1250,-30000,200]],
 [[2420,30000,-30000,1000],[-30000,2580,-1000,30000],[-30000,2580,-30000,1000],[2420,30000,-1000,30000]],
 [[-2600,29200,-26600,-3600],[-28800,-600,-27000,2000],[-28800,-600,-2000,26500],[-2600,29200,-4000,2000],[-2600,29200,-2000,26500]],
 [[-32768,32767,-32768,32767]]
]);
const layouts=new WeakMap();
function integer(n,name,min=0,max=MAX){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError(`Invalid ${name}`);return n;}
function finite(n,name){if(!Number.isFinite(n)||!Number.isFinite(F(n)))throw new TypeError(`${name} must be finite binary32`);return F(n);}
function boolean(n,name){if(typeof n!=='boolean')throw new TypeError(`${name} must be boolean`);return n;}
function prepared(layout){const q=layouts.get(layout);if(!q)throw new TypeError('Expected a source buoy layout');return q;}
function position(p,scale){if(!p)throw new TypeError('Expected position x/z');return {x:finite(p.x/scale,'position.x'),z:finite(p.z/scale,'position.z')};}
function pairRegions(regions,p){let first=-1,last=-1;for(let i=0;i<regions.length;i++){const r=regions[i];if(r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3]){if(first<0)first=i;else last=i;}}return [first,last];}
const regionsMatch=(a,b)=>a.some(i=>i>=0&&b.includes(i));
const dot=(x,z,a,b)=>F(F(x*a)+F(z*b));

/** Course header selection is independent of class and player count.
 * Mode 1's header has the same numeric side flags. Main state 8 suppresses
 * reverse XOR; setup state 21 does not load the normal source route at all.
 */
export function sourceBuoyCourseRules(courseIndex,{reverse=false,reverseOverride=false,mainState=1}={}){
 integer(courseIndex,'courseIndex',0,9);integer(mainState,'mainState',0,255);
 boolean(reverse,'reverse');boolean(reverseOverride,'reverseOverride');
 return freeze({courseIndex,checkpointSide:forwardSides[courseIndex]^(mainState!==8&&(reverse||reverseOverride)?1:0),
  checkpointSlackNative:slackNative[courseIndex],regionsNative:courseRegions[courseIndex].map(r=>[...r])});
}

function decodeRow(row,sourceRow,courseIndex,mode,scale){
 if(!Array.isArray(row)||row.length!==4)throw new TypeError('Expected four-short source rows');
 row.forEach((v,i)=>integer(v,`row ${sourceRow} field ${i}`,-32768,32767));
 const [x,z,type,heading]=row;integer(type,'nativeType',0,32);
 if(heading===-1)throw new RangeError('Remove source sentinel rows');
 const classification=[1,5,7,10,13,16,19,22].includes(type)?1:type===2?2:type===3?3:
  [8,11,14,17,20,23].includes(type)?4:type>=24?type-18:0;
 let routeGroup=[6,7,8,24,25,29,30,31,32].includes(type)?1:type>=9&&type<=23?Math.floor((type-9)/3)+2:0;
 if(type===26||type===27)routeGroup=courseIndex===0?(type===27?1:0):2;
 const phase=Math.trunc(F(F(heading/360)*4096))&4095,a=phase*Math.PI*2/4096;
 let tx=F(Math.sin(a)),tz=F(Math.cos(a));
 if(phase%1024===0)[tx,tz]=[[0,1],[1,0],[0,-1],[-1,0]][phase/1024];
 return {sourceRow,x:x*scale,z:z*scale,tx,tz,classification,routeGroup,
  suppressed:type===4||type===5,nativeType:type,nativeHeading:heading,
  halfWidthNative:classification===2?800:classification===3?courseIndex===0&&mode!=='stunt'?370:500:[8,9].includes(classification)?400:0};
}

/** Compile copied, immutable course metadata. `rows` are native four-short
 * [x,z,type,heading] rows. Alternatively inject world-space `nodes` with stable
 * sourceRow, x,z,tx,tz, classification and optional routeGroup/nextSourceRow,
 * enabled/checkpoint/halfWidthNative. tx/tz is the native forward axis; exact
 * initialized source axes may be injected instead of the phase-table fallback.
 * `regions` are world Xmin/Xmax/Zmin/Zmax; `regionsNative` are native units.
 */
export function createSourceBuoyLayout({rows,nodes,regions,regionsNative,scale=.025,courseIndex=6,mode='race',
 reverse=false,reverseOverride=false,mainState=1,checkpointSide,checkpointSlackNative,finishSourceRow}={}){
 integer(courseIndex,'courseIndex',0,9);integer(mainState,'mainState',0,255);
 if(mode!=='race'&&mode!=='stunt')throw new RangeError('mode must be race or stunt');
 if(!Number.isFinite(scale)||scale<=0||scale>1)throw new RangeError('Invalid world scale');
 const rules=sourceBuoyCourseRules(courseIndex,{reverse,reverseOverride,mainState});
 if((rows===undefined)===(nodes===undefined))throw new TypeError('Supply rows or nodes');
 const supplied=rows??nodes;
 if(!Array.isArray(supplied)||supplied.length<1||supplied.length>256)throw new RangeError('Expected 1..256 source nodes');
 const source=rows===undefined?nodes:rows.map((r,i)=>decodeRow(r,i,courseIndex,mode,scale));
 const native=source.map((n,i)=>{
  const p=position(n,scale),tx=finite(n.tx,'node.tx'),tz=finite(n.tz,'node.tz');
  if(Math.abs(tx*tx+tz*tz-1)>.002)throw new RangeError('Expected unit forward axis');
  const classification=integer(n.classification,'classification',0,14),routeGroup=integer(n.routeGroup??0,'routeGroup',0,6);
  const suppressed=n.suppressed===undefined?false:boolean(n.suppressed,'suppressed');
  const half=finite(n.halfWidthNative??(n.halfWidth===undefined?classification===2?800:classification===3?courseIndex===0&&mode!=='stunt'?370:500:0:n.halfWidth/scale),'halfWidthNative');
  if(half<0||half>32768)throw new RangeError('Invalid half width');
  const checkpoint=n.checkpoint===undefined?[2,3,5].includes(classification):boolean(n.checkpoint,'checkpoint');
  return {sourceRow:integer(n.sourceRow??i,'sourceRow',0,65535),x:p.x,z:p.z,tx,tz,classification,routeGroup,halfWidthNative:half,checkpoint,
   enabled:n.enabled===undefined?routeGroup<2&&!suppressed&&[0,1,2,3].includes(classification):boolean(n.enabled,'enabled'),
   nextSourceRow:n.nextSourceRow,nativeType:n.nativeType,nativeHeading:n.nativeHeading};
 });
 const byRow=new Map(native.map(n=>[n.sourceRow,n]));
 if(byRow.size!==native.length)throw new RangeError('Duplicate sourceRow identity');
 native.forEach((n,i)=>{if(n.nextSourceRow===undefined){let next=(i+1)%native.length;if(n.routeGroup<2)while(native[next].routeGroup>=2)next=(next+1)%native.length;n.nextSourceRow=native[next].sourceRow;}integer(n.nextSourceRow,'nextSourceRow',0,65535);if(!byRow.has(n.nextSourceRow))throw new RangeError('Unknown next source row');});
 if(regions!==undefined&&regionsNative!==undefined)throw new TypeError('Supply world or native regions');
 const rawRegions=regions??regionsNative??rules.regionsNative,regionScale=regions===undefined?1:scale;
 if(!Array.isArray(rawRegions)||rawRegions.length>64)throw new RangeError('Invalid regions');
 const compiledRegions=rawRegions.map(r=>{if(!Array.isArray(r)||r.length!==4)throw new TypeError('Expected four region bounds');const q=r.map(v=>finite(v/regionScale,'region bound'));if(q[0]>q[1]||q[2]>q[3])throw new RangeError('Reversed region bounds');return q;});
 const side=integer(checkpointSide??rules.checkpointSide,'checkpointSide',0,1),slack=finite(checkpointSlackNative??rules.checkpointSlackNative,'checkpointSlackNative');
 if(slack<0)throw new RangeError('Negative checkpoint slack');
 const finish=finishSourceRow??[...native].reverse().find(n=>n.classification===3)?.sourceRow??native[0].sourceRow;
 if(!byRow.has(finish))throw new RangeError('Unknown finish source row');
 const visibleRow=start=>{let n=byRow.get(start);for(let i=0;i<native.length;i++){if(n.enabled)return n.sourceRow;n=byRow.get(n.nextSourceRow);}return null;};
 native.forEach(n=>{n.nextVisibleSourceRow=visibleRow(n.nextSourceRow);});
 const layout=freeze({scale,courseIndex,mode,mainState,checkpointSide:side,checkpointSlackNative:slack,finishSourceRow:finish,
  nodes:native.map(n=>({...n,x:n.x*scale,z:n.z*scale})),regions:compiledRegions.map(r=>r.map(v=>v*scale))});
 layouts.set(layout,{native,byRow,regions:compiledRegions,visibleRow});return layout;
}

/** Side/arming is per racer. Lap and lap legality are host-owned; the step
 * defaults its optional native lapLegalCounter to the supplied lap, introducing
 * no synthetic lockout. Source starts power5 on training/Stunt, otherwise0.
 */
export function createSourceBuoyProgress(layout,{nextSourceRow=layout?.finishSourceRow,side=-1,armed=false,power,
 lapMisses=0,totalMisses=0,missLimitReached=false,missedCheckpoint=false,logicalTicks=0}={}){
 const data=prepared(layout);if(!data.byRow.has(nextSourceRow))throw new RangeError('Unknown next source row');
 return copyState({nextSourceRow,side,armed,power:power??(layout.courseIndex===0||layout.mode==='stunt'?5:0),
  lapMisses,totalMisses,missLimitReached,missedCheckpoint,logicalTicks});
}
function copyState(s){
 if(!s)throw new TypeError('Expected source buoy state');
 return {nextSourceRow:integer(s.nextSourceRow,'nextSourceRow',0,65535),side:integer(s.side,'side',-1,1),armed:boolean(s.armed,'armed'),
  power:integer(s.power,'power',0,5),lapMisses:integer(s.lapMisses,'lapMisses'),totalMisses:integer(s.totalMisses,'totalMisses'),
  missLimitReached:boolean(s.missLimitReached,'missLimitReached'),missedCheckpoint:boolean(s.missedCheckpoint,'missedCheckpoint'),logicalTicks:integer(s.logicalTicks,'logicalTicks')};
}
export function sourceBuoyRegions(layout,p){return pairRegions(prepared(layout).regions,position(p,layout.scale));}
/** Initial source visible/scored nodes share the enabled flag. This mapping
 * follows actual main links; it never advances state or invents guide gates.
 */
export function sourceBuoyVisibleRow(layout,sourceRow){const data=prepared(layout);if(!data.byRow.has(sourceRow))throw new RangeError('Unknown source row');return data.visibleRow(sourceRow);}

function measure(layout,data,node,p,center=node){
 const {tx,tz,classification,halfWidthNative:h}=node,{x,z}=center,tangentX=tz,tangentZ=-tx;
 const sideSign=classification===0?-1:classification===1?1:0;
 const ax=layout.mode==='race'?F(x-F(F(F(sideSign*tangentX)*50)*.5)):x;
 const az=layout.mode==='race'?F(z-F(F(F(sideSign*tangentZ)*50)*.5)):z;
 let vx=F(p.x-ax),vz=F(p.z-az);const length=F(Math.sqrt(F(F(vx*vx)+F(vz*vz))));
 if(length>0){vx=F(vx/length);vz=F(vz/length);}
 const headingDot=dot(vx,vz,tx,tz),sideDeterminant=F(F(tz*vx)-F(tx*vz));
 const currentPlaneDistanceNative=dot(F(p.x-x),F(p.z-z),tx,tz);
 let spanCoordinateNative=null,spanPass=true;
 if(node.checkpoint){
  // Checkpoint span uses the fixed endpoint pair, not the moving center.
  const bx=F(node.x-F(tangentX*h)),bz=F(node.z-F(tangentZ*h));
  let sx=tangentX,sz=tangentZ;
  if(layout.mode==='race'){
   sx=F(F(node.x+F(tangentX*h))-bx);sz=F(F(node.z+F(tangentZ*h))-bz);
   const spanLength=F(Math.sqrt(F(F(sx*sx)+F(sz*sz))));
   if(spanLength>0){sx=F(sx/spanLength);sz=F(sz/spanLength);}
  }
  spanCoordinateNative=dot(F(p.x-bx),F(p.z-bz),sx,sz);
  spanPass=layout.mode==='stunt'?0<=spanCoordinateNative&&spanCoordinateNative<=F(h+h):
   layout.checkpointSide===0?spanCoordinateNative<=F(F(h*2)+layout.checkpointSlackNative):-layout.checkpointSlackNative<=spanCoordinateNative;
 }
 const riderRegions=pairRegions(data.regions,p),nodeRegions=pairRegions(data.regions,center),sharedRegion=regionsMatch(riderRegions,nodeRegions);
 return {headingDot,sideDeterminant,currentPlaneDistanceNative,spanCoordinateNative,spanPass,riderRegions,nodeRegions,sharedRegion};
}

/** One source logical sample, pure input/state ownership. A successful event
 * always identifies the one actual current sourceRow and its source link;
 * there is no loop consuming later rows in the same sample.
 *
 * nativeEventCode:0 none,1 correct enabled colored gate (even at power5),
 * 2 counted/announced wrong side. AI receives code2 but does not increment
 * human miss counters. Unscored nodes and disabled misses still advance.
 * Reaching missLimit sets a flag; source immediately DQs only a human with
 * limit0, before advancing that gate. Host owns later DQ/lap/record handling.
 *
 * `finished`/`disqualified` suppress awards, not source graph admission.
 * Stunt has symmetric CP bounds, no side shift/region/lap-legal admission,
 * no buoy power/miss awards. Course3's sluice/lap/alternate-route effects are
 * explicitly left to the host; this leaf reports admission only.
 * `currentNodePosition`, when supplied, is the current WORLD X/Z of this one
 * source row after hull contacts and before buoy motion. Heading/side origin,
 * plane diagnostics and region admission use it. Authored axes, fixed span
 * endpoints, immutable links and enabled flags remain separate metadata.
 */
export function stepSourceBuoyProgress(layout,state,{position:p,previousPosition,active=true,lap=0,lapLegalCounter=lap,
 human=true,missesEnabled=true,mainState=layout?.mainState??1,missLimit=5,finished=false,disqualified=false,currentNodePosition}={}){
 const data=prepared(layout),next=copyState(state),node=data.byRow.get(next.nextSourceRow);
 if(!node)throw new RangeError('Unknown state source row');
 for(const [name,value] of Object.entries({active,human,missesEnabled,finished,disqualified}))boolean(value,name);
 integer(lap,'lap',-50,MAX);integer(lapLegalCounter,'lapLegalCounter',-50,MAX);integer(mainState,'mainState',0,255);integer(missLimit,'missLimit');
 if(!active)return {state:next,event:null,diagnostic:null};
 const center=currentNodePosition===undefined?node:position(currentNodePosition,layout.scale);
 const current=position(p,layout.scale),diagnostic=measure(layout,data,node,current,center);
 const previous=previousPosition===undefined?null:position(previousPosition,layout.scale);
 diagnostic.previousPlaneDistanceNative=previous===null?null:dot(F(previous.x-center.x),F(previous.z-center.z),node.tx,node.tz);
 next.logicalTicks=integer(next.logicalTicks+1,'logicalTicks');
 if(next.side===-1&&diagnostic.headingDot>0)next.side=diagnostic.sideDeterminant>=0?1:0;
 else if(diagnostic.headingDot<=0)next.side=-1;
 if(!next.armed&&next.side===-1)next.armed=true;
 const reject=reason=>({state:next,event:null,diagnostic:{...diagnostic,rejection:reason}});
 if(!next.armed)return reject('unarmed');
 if(next.side<0)return reject('approach');
 if(layout.mode==='race'&&lapLegalCounter!==lap){next.armed=false;return reject('lap-legal-counter');}
 if(!diagnostic.spanPass){next.armed=false;if(layout.mode==='stunt')next.missedCheckpoint=true;return reject('checkpoint-span');}
 const regionRequired=layout.mode==='race'&&(node.enabled||layout.courseIndex===3&&node.classification===4);
 if(regionRequired&&!diagnostic.sharedRegion){next.armed=false;return reject('region');}
 const side=next.side,colored=node.classification===0||node.classification===1;
 const correct=colored?side===node.classification:null;
 const event={sourceRow:node.sourceRow,nextSourceRow:node.nextSourceRow,classification:node.classification,
  checkpoint:node.checkpoint,atFinishLine:node.sourceRow===layout.finishSourceRow,
  kind:node.checkpoint?node.sourceRow===layout.finishSourceRow?'finish':'checkpoint':colored?'buoy':'guide',
  side,correct,enabled:node.enabled,nextVisibleSourceRow:node.nextVisibleSourceRow,advanced:true,nativeEventCode:0,powerDelta:0,missDelta:0,
  immediateDisqualification:false,checkpointTimingEligible:false,crossingOffsetNative:null,
  requiresCourseEventRules:layout.mode==='race'&&layout.courseIndex===3};
 next.missedCheckpoint=false;
 if(layout.mode==='race'&&!node.checkpoint&&!finished&&!disqualified&&colored&&node.enabled){
  if(correct){event.nativeEventCode=1;event.powerDelta=next.power<5?1:0;next.power+=event.powerDelta;}
  else if(missesEnabled&&mainState===1){
   if(human){next.lapMisses=integer(next.lapMisses+1,'lapMisses');next.totalMisses=integer(next.totalMisses+1,'totalMisses');event.missDelta=1;}
   if(next.totalMisses>=missLimit){next.missLimitReached=true;if(human&&missLimit===0){event.advanced=false;event.immediateDisqualification=true;return {state:next,event,diagnostic};}}
   event.nativeEventCode=2;
  }
 }
 next.nextSourceRow=node.nextSourceRow;next.side=-1;next.armed=true;
 event.checkpointTimingEligible=node.checkpoint&&lap>0&&!finished&&!disqualified&&
  (layout.mode==='stunt'||!next.missLimitReached&&layout.courseIndex!==0&&!event.requiresCourseEventRules);
 if(event.checkpointTimingEligible&&diagnostic.previousPlaneDistanceNative!==null){
  const a=Math.abs(diagnostic.currentPlaneDistanceNative),b=Math.abs(diagnostic.previousPlaneDistanceNative),sum=F(a+b);
  if(sum>0)event.crossingOffsetNative=Math.trunc(F(F(a/sum)*50));
 }
 return {state:next,event,diagnostic};
}
