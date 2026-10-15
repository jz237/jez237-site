import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeAIRoute,createNativeAIRouteState,nativeAIRouteSnapshot} from '../native-ai-route.js';
import {createNativeAITargetTable,createNativeAITargetWindow,prepareNativeAITargetMetrics,advanceNativeAITarget,prepareNativeAIAim,prepareNativeAITarget} from '../native-ai-target.js';
import {getCourse} from '../courses.js';

const S=.025,F=Math.fround;
// Independently prepared synthetic geometry. Original-instruction comparisons
// also cover these numeric fields; no original game trajectory is asserted.
const axes=[[0,1],[.600616455078125,.7995372414588928],[0,-1],[1,0]];
const centers=[[0,0],[800,1200],[-1000,1700],[-900,-1100]];
const half=c=>c===2?800:c===3?500:[8,9].includes(c)?400:0;
function make(classes=[2,4,0,3],options={}){
 const source=classes.map((classification,i)=>({sourceRow:i,x:(options.centers??centers)[i][0]*S,z:(options.centers??centers)[i][1]*S,
  tx:(options.axes??axes)[i%4][0],tz:(options.axes??axes)[i%4][1],classification,routeGroup:options.groups?.[i]??0,
  suppressed:options.suppressed?.includes(i)??false,halfWidthNative:half(classification)}));
 const route=createNativeAIRoute({nodes:source,courseIndex:options.courseIndex??1,family:options.family??'primary'});
 const table=createNativeAITargetTable({route,nodes:source});return {source,route,table};
}
function sample(table,{avatar=0,navigationSourceRow=0,targetSourceRow=navigationSourceRow,positionNativeXZ={x:0,z:-1000},nodePositionsNative}={}){
 return prepareNativeAITargetMetrics(table,createNativeAITargetWindow(table,{avatar,navigationSourceRow,targetSourceRow}),{positionNativeXZ,nodePositionsNative});
}
const cardinal=[[0,1],[1,0],[0,-1],[-1,0]];

for(let difficulty=0;difficulty<4;difficulty++)for(let avatar=0;avatar<4;avatar++)test(`Sunny class${difficulty} avatar${avatar} has the independently evaluated two-pass source target`,()=>{
 const course=getCourse('greyhaven',difficulty),nodes=course.sourceBuoyLayout.nodes;
 const route=createNativeAIRoute({...course.sourceBuoyLayout,nodes}),table=createNativeAITargetTable({route,nodes});
 const reverse=difficulty===3,positionNativeXZ=reverse?{x:-1361,z:961}:{x:-2250,z:650};
 const state=createNativeAIRouteState(route,{avatar,navigationSourceRow:0}),before=nativeAIRouteSnapshot(route,state);
 const result=prepareNativeAITarget(table,{...before,positionNativeXZ});
 const branch=avatar===2;
 assert.deepEqual(result.lookahead.map(q=>q.afterTargetSourceRow),reverse?[2,2]:branch?[1,1]:[2,3]);
 assert.deepEqual(result.targetNativeXZ,reverse?{x:-3363,z:934}:branch?{x:1930.0655517578125,z:931.6806640625}:{x:4328.83984375,z:1249.0035400390625});
 assert.deepEqual(result.targetDirectionXZ,reverse?{x:-.9999091029167175,z:-.013485287316143513}:branch?{x:.9977372288703918,z:.06723418086767197}:{x:.9958805441856384,z:.09067495167255402});
 assert.equal(result.distanceNative,reverse?2002.1820068359375:branch?4189.54541015625:6606.05322265625);
 assert.deepEqual(result.originNativeXZ,positionNativeXZ);assert.deepEqual(nativeAIRouteSnapshot(route,state),before);
 assert.equal(result.window.navigationSourceRow,0);assert.equal(result.metrics.window,result.window);
 assert.equal(result.segment.directionXZ,result.targetDirectionXZ);assert.equal(result.segment.targetNativeXZ,result.targetNativeXZ);
});

test('metric sample retains seven distinct source lines and truncated plane/distance integers',()=>{
 const {table}=make(),p={x:-900,z:-1000},m=sample(table,{positionNativeXZ:p});
 assert.deepEqual(Object.keys(m.lines),['previousToTarget','hullToTarget','hullToNext','hullToNextPlusInset','hullToNextMinusInset','passingTargetToNext','hullToNavigation']);
 assert.deepEqual(m.lines.previousToTarget.originNativeXZ,{x:-900,z:-1100});assert.deepEqual(m.lines.previousToTarget.targetNativeXZ,{x:0,z:0});
 for(const key of ['hullToTarget','hullToNext','hullToNextPlusInset','hullToNextMinusInset','hullToNavigation'])assert.deepEqual(m.lines[key].originNativeXZ,p);
 assert.deepEqual([m.navigationPlaneDistanceNative,m.targetPlaneDistanceNative,m.previousTargetDistanceNative,m.navigationDistanceNative,m.targetSide],[1000,1000,1421,1345,-1]);
 assert.deepEqual(m.lines.passingTargetToNext.originNativeXZ,{x:0,z:0});
 assert.deepEqual(m.lines.hullToNext.targetNativeXZ,{x:800,z:1200});
 assert.notDeepEqual(m.lines.hullToNextPlusInset.targetNativeXZ,m.lines.hullToNextMinusInset.targetNativeXZ);
});

test('colored current-plane shortcut is strict at300 and respects the raw suppression flag',()=>{
 const {table}=make([0,4,0,3],{axes:cardinal});
 for(const [z,expected]of [[299.9999694824219,1],[300,0],[300.9,0]]){
  const prepared=sample(table,{positionNativeXZ:{x:700,z}}),result=advanceNativeAITarget(table,prepared);
  assert.equal(result.window.targetSourceRow,expected);assert.equal(result.diagnostic.generalAdvance,expected===1);
 }
 const suppressed=make([0,4,0,3],{axes:cardinal,suppressed:[0]}).table;
 const result=advanceNativeAITarget(suppressed,sample(suppressed,{positionNativeXZ:{x:700,z:299.9999694824219}}));
 assert.equal(result.window.targetSourceRow,0);assert.equal(result.diagnostic.reason,'colored-side-held');
});

test('red/yellow next-side decisions include same/opposite colors and both finite gate endpoints',()=>{
 // Literal target rows from the original prepared numeric consumer.
 const cases=[
  [0,0,-900,-1000,1],[0,0,1100,700,0],[0,1,-200,2100,1],[0,1,-900,-1000,0],
  [0,2,-900,-1000,1],[0,2,1100,700,0],[0,3,-900,-1000,1],[0,4,1100,700,0],
  [1,0,1100,700,1],[1,0,-900,-1000,0],[1,1,1100,700,1],[1,2,-900,-1000,1],
  [1,2,1100,700,0],[1,3,1100,700,1],[1,4,1100,700,1],[1,8,-900,-1000,0]
 ];
 for(const [color,next,x,z,expected]of cases){
  const {table}=make([color,next,4,3]),prepared=sample(table,{navigationSourceRow:3,targetSourceRow:0,positionNativeXZ:{x,z}});
  assert.equal(advanceNativeAITarget(table,prepared).window.targetSourceRow,expected,`${color}->${next} at${x},${z}`);
 }
});

test('checkpoint lookahead uses both inset-side predicates without updating persistent navigation',()=>{
 for(const classification of [2,3]){
  const {table}=make([classification,4,4,0],{axes:[axes[1],...cardinal.slice(1)]});
  for(const [x,z,expected]of [[-1100,-700,1],[600,500,classification===2?1:0],[-100,1800,0],[0,0,1]]){
   const result=advanceNativeAITarget(table,sample(table,{navigationSourceRow:3,targetSourceRow:0,positionNativeXZ:{x,z}}));
   assert.equal(result.window.targetSourceRow,expected);assert.equal(result.window.navigationSourceRow,3);
  }
 }
});

test('guide classes use strict500/1000 thresholds and the truncated target-plane distance',()=>{
 for(const classification of [4,8,9]){
  const {table}=make([classification,4,0,3],{axes:cardinal});
  for(const [x,z,expected]of [[0,499.9999694824219,1],[0,500,0],[0,999.9999389648438,0],[0,1000,0],[501,500,0],[999,0,1],[1000,0,0]]){
   const result=advanceNativeAITarget(table,sample(table,{positionNativeXZ:{x,z}}));assert.equal(result.window.targetSourceRow,expected,`class${classification}:${x},${z}`);
  }
 }
});

test('unhandled source classifications retain the scratch target',()=>{
 for(const c of [5,6,7,10,11,12,13,14]){
  const {table}=make([c,4,0,3]);assert.equal(advanceNativeAITarget(table,sample(table,{positionNativeXZ:{x:0,z:0}})).window.targetSourceRow,0);
 }
});

test('near-mode selection is strict at600 and keeps suppressed color offsets separate',()=>{
 for(const color of [0,1])for(const suppressed of [false,true]){
  const {table}=make([color,4,0,3],{axes:cardinal,suppressed:suppressed?[0]:[]});
  for(const [p,near]of [[{x:600,z:600},0],[{x:600,z:599.9999389648438},1]])assert.equal(prepareNativeAIAim(table,sample(table,{positionNativeXZ:p})).nearMode,near);
  const far=prepareNativeAIAim(table,sample(table)),near=prepareNativeAIAim(table,sample(table,{positionNativeXZ:{x:0,z:-100}}));
  const sign=color===0?-1:1;
  assert.deepEqual(far.segment.targetNativeXZ,suppressed?{x:sign*200,z:120}:{x:sign*250,z:-50});
  assert.deepEqual(near.segment.targetNativeXZ,{x:sign*(suppressed?200:120),z:120});
 }
});

test('direct-distance near test still applies when the plane calculation rounds up to600',()=>{
 const {table}=make([4,4,0,3],{centers:[[-17193,-5276],...centers.slice(1)],axes:[[.9434685707092285,.331462025642395],...axes.slice(1)]});
 const m=sample(table,{positionNativeXZ:{x:-16626.919921875,z:-5077.123046875}});
 assert.equal(m.targetPlaneDistanceNative,600);assert.equal(m.lines.hullToTarget.distanceNative,599.9989013671875);
 assert.equal(prepareNativeAIAim(table,m).nearMode,1);
});

test('gate aim preserves the previous-color fallback X-axis reuse in its Z output',()=>{
 const points=[[-750,-1300],[0,0],[1000,1600],[-2000,0]],aa=[[.2578310966491699,.966189980506897],axes[1],[.8662809729576111,-.49955710768699646],[0,-1]];
 const cases=[
  [0,{x:1928.7037353515625,z:-1197.6683349609375},'plus-inset',{x:543.6853637695312,z:-408.419189453125}],
  [0,{x:-1401.8958740234375,z:-1905.89404296875},'center',{x:0,z:0}],
  [0,{x:-2181.47705078125,z:-3.5630478858947754},'minus-inset',{x:-543.6853637695312,z:408.419189453125}],
  [0,{x:-152.57505798339844,z:-1074.10791015625},'previous-red-inset',{x:-543.6853637695312,z:576.4376220703125}],
  [1,{x:-1173.0760498046875,z:-1702.8548583984375},'previous-yellow-inset',{x:543.6853637695312,z:-576.4376220703125}]
 ];
 for(const [prev,positionNativeXZ,reason,target]of cases){
  const {table}=make([prev,2,4,3],{centers:points,axes:aa});
  const result=prepareNativeAIAim(table,sample(table,{navigationSourceRow:0,targetSourceRow:1,positionNativeXZ}));
  assert.equal(result.diagnostic.reason,reason);assert.deepEqual(result.segment.targetNativeXZ,target);
 }
});

test('the source orientation predicate retains its observed second-vector zero case',()=>{
 const {table}=make([2,4,0,3],{axes:[[1,0],[0,1],[0,-1],[-1,0]]});
 const result=sample(table,{positionNativeXZ:{x:2,z:-2}});
 // dx²+dz+dz=0 here; a conventional nonzero squared norm would return+1.
 assert.equal(result.targetSide,-1);assert.equal(result.targetPlaneDistanceNative,2);
 const ordinary=make([2,4,0,3],{axes:cardinal}).table;
 const zeroAim=prepareNativeAIAim(ordinary,sample(ordinary,{positionNativeXZ:{x:-680,z:0}}));
 assert.deepEqual(zeroAim.segment.targetNativeXZ,{x:-680,z:0});assert.equal(zeroAim.segment.distanceNative,0);
});

test('segment normalization divides by the rounded length, and squared underflow leaves deltas intact',()=>{
 const {table}=make([4,4,0,3],{axes:cardinal});
 const m=sample(table,{positionNativeXZ:{x:2,z:3}}),line=m.lines.hullToTarget;
 assert.deepEqual(line.directionXZ,{x:-.5547001957893372,z:-.8320503234863281});
 assert.equal(line.distanceNative,3.605551242828369);
 const zero=sample(table,{positionNativeXZ:{x:0,z:0}}).lines.hullToTarget;assert.equal(zero.distanceNative,0);assert.deepEqual(zero.directionXZ,{x:0,z:0});
 const tiny=sample(table,{positionNativeXZ:{x:1e-23,z:0}}).lines.hullToTarget;
 assert.equal(tiny.distanceNative,0);assert.equal(tiny.directionXZ.x,F(-1e-23));
});

test('Southern source lap filtering is independent of browser lap, awards and the persistent index',()=>{
 const {table}=make([8,9,8,4,3],{courseIndex:7,centers:[[0,0],[200,1500],[400,3000],[800,4500],[1000,6000]]});
 for(let avatar=0;avatar<4;avatar++)for(const [sourceLap,target,expected,skipped]of [
  [0,0,3,[0,1,2]],[1,1,3,[1,2]],[2,0,0,[]],[2,1,2,[1]],[3,0,1,[0]],[3,1,1,[]],[-1,0,1,[0]]
 ]){
  const m=sample(table,{avatar,navigationSourceRow:4,targetSourceRow:target,positionNativeXZ:{x:-2000,z:-2000}}),result=advanceNativeAITarget(table,m,{sourceLap});
  assert.equal(result.window.targetSourceRow,expected);assert.equal(result.window.navigationSourceRow,4);assert.deepEqual(result.diagnostic.southernSkippedSourceRows,skipped);
 }
 assert.throws(()=>advanceNativeAITarget(table,sample(table)),/sourceLap/);
 for(const [classes,sourceLap]of [[[9,9,4,8,3],2],[[8,8,4,9,3],3]]){
  const t=make(classes,{courseIndex:7,centers:[[0,0],[200,1500],[400,3000],[800,4500],[1000,6000]]}).table;
  const result=advanceNativeAITarget(t,sample(t,{navigationSourceRow:4,targetSourceRow:0,positionNativeXZ:{x:-2000,z:-2000}}),{sourceLap});
  assert.equal(result.window.targetSourceRow,2);assert.deepEqual(result.diagnostic.southernSkippedSourceRows,[0,1]);
 }
 const cycle=make([8,9],{courseIndex:7,centers:[[0,0],[500,500]]}).table;
 assert.throws(()=>advanceNativeAITarget(cycle,sample(cycle,{positionNativeXZ:{x:-5000,z:-5000}}),{sourceLap:0}),/no eligible target/);
});

test('moving-center snapshots are complete and copied without dragging initialized endpoints',()=>{
 const {table}=make([2,0,1,3]),initial=JSON.stringify(table),positions=table.nodes.map(n=>({sourceRow:n.sourceRow,...n.centerNativeXZ}));
 positions[0].x=430;positions[0].z=-170;positions[1].x=850;positions[1].z=1125;
 const m=sample(table,{nodePositionsNative:[...positions].reverse(),positionNativeXZ:{x:-1500,z:-1000}});
 assert.deepEqual(m.lines.hullToTarget.targetNativeXZ,{x:430,z:-170});
 assert.deepEqual(table.nodes[0].endpointPlusNativeXZ,{x:800,z:0});assert.deepEqual(table.nodes[0].endpointMinusNativeXZ,{x:-800,z:0});
 const result=prepareNativeAITarget(table,{avatar:0,navigationSourceRow:0,positionNativeXZ:{x:-1500,z:-1000},nodePositionsNative:positions});
 assert.deepEqual(result.targetNativeXZ,{x:-763.283935546875,z:1605.3135986328125});
 positions[0].x=5000;assert.equal(m.nodePositionsNative[0].x,430);assert.equal(JSON.stringify(table),initial);
});

test('initialized endpoint/passing-axis injection is explicit and independent from current centers',()=>{
 const {route,source}=make();source[0]={...source[0],initialPositionNativeXZ:{x:10,z:20},endpointPlusNativeXZ:{x:900,z:70},endpointMinusNativeXZ:{x:-750,z:-20},passingDirectionXZ:{x:.25,z:-.75}};
 const table=createNativeAITargetTable({route,nodes:source});source[0].endpointPlusNativeXZ.x=10000;
 assert.deepEqual(table.nodes[0].endpointPlusNativeXZ,{x:900,z:70});assert.deepEqual(table.nodes[0].passingDirectionXZ,{x:.25,z:-.75});
 assert.deepEqual(table.nodes[0].centerNativeXZ,{x:0,z:0});
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,endpointMinusNativeXZ:undefined}:n)}),/both/);
});

test('prepared samples and windows are immutable, serializable and explicitly restored for their table',()=>{
 const {table,source,route}=make(),window=createNativeAITargetWindow(table,{avatar:3,navigationSourceRow:0});
 const m=prepareNativeAITargetMetrics(table,window,{positionNativeXZ:{x:-900,z:-1000}}),snapshot=JSON.parse(JSON.stringify(m));
 const restored=prepareNativeAITargetMetrics(table,createNativeAITargetWindow(table,snapshot.window),snapshot);
 assert.deepEqual(restored,m);assert.ok(Object.isFrozen(m)&&Object.isFrozen(m.lines)&&Object.isFrozen(m.lines.hullToTarget.directionXZ));
 assert.throws(()=>{m.positionNativeXZ.x=1;},TypeError);assert.throws(()=>{table.nodes[0].nextByAvatar[3]=2;},TypeError);
 const other=createNativeAITargetTable({route,nodes:source});
 assert.throws(()=>prepareNativeAITargetMetrics(other,window,snapshot),/another table/);
 assert.throws(()=>advanceNativeAITarget(other,m),/another table/);assert.throws(()=>prepareNativeAIAim(other,m),/another table/);
 assert.throws(()=>advanceNativeAITarget(table,snapshot),/prepare a copied sample/);
 const result=prepareNativeAITarget(table,{avatar:3,navigationSourceRow:0,positionNativeXZ:{x:-900,z:-1000}});
 assert.deepEqual(JSON.parse(JSON.stringify(result)).originNativeXZ,result.originNativeXZ);
 assert.equal(result.window.navigationSourceRow,0);assert.equal(route.nodes[0].sourceRow,0);
});

test('invalid geometry and samples fail atomically without mutating route, table or inputs',()=>{
 const {table,source,route}=make(),before=JSON.stringify({table,source,route}),m=sample(table),positions=table.nodes.map(n=>({sourceRow:n.sourceRow,...n.centerNativeXZ}));
 const options=[{positionNativeXZ:{x:NaN,z:0}},{positionNativeXZ:{x:Infinity,z:0}},
  {positionNativeXZ:{x:3e38,z:0}},{nodePositionsNative:positions.slice(1)},
  {nodePositionsNative:positions.map((n,i)=>({...n,sourceRow:i===1?0:n.sourceRow}))},
  {nodePositionsNative:positions.map((n,i)=>({...n,sourceRow:i===1?65535:n.sourceRow}))}];
 for(const values of options){assert.throws(()=>sample(table,values));assert.equal(JSON.stringify({table,source,route}),before);}
 assert.throws(()=>createNativeAITargetWindow(table,{avatar:4,navigationSourceRow:0}),/avatar/);
 assert.throws(()=>createNativeAITargetWindow(table,{avatar:0,navigationSourceRow:65535}),/Unknown/);
 assert.throws(()=>prepareNativeAIAim(table,m,{nearMode:2}),/nearMode/);
 assert.throws(()=>advanceNativeAITarget(table,m,{sourceLap:1.1}),/sourceLap/);
 assert.throws(()=>createNativeAITargetTable({route:{...route},nodes:source}),/compiled/);
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.slice(1)}),/all source/);
 for(const field of ['halfWidthNative','suppressed'])assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,[field]:undefined}:n)}));
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,x:1}:n)}),/does not match/);
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,tx:1}:n)}),/axis/);
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,nativeType:4,suppressed:false}:n)}),/Raw type/);
 assert.throws(()=>createNativeAITargetTable({route,nodes:source.map((n,i)=>i===0?{...n,halfWidthNative:-1}:n)}),/halfWidth/);
 assert.equal(JSON.stringify({table,source,route}),before);
});
