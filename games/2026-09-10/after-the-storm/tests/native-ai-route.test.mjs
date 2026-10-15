import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeAIRoute,createNativeAIRouteState,nativeAIRouteWindow,nativeAIRouteSnapshot,stepNativeAIRoute} from '../native-ai-route.js';
import {getCourse} from '../courses.js';

const S=.025;
const nodes=()=>[0,100,-200,-100].map((z,i)=>({sourceRow:i*20+41,x:0,z:z*S,tx:0,tz:1,classification:i===0?3:4,routeGroup:0}));
const graph=()=>createNativeAIRoute({nodes:nodes()});
const row=g=>g.nodes.map(q=>q.sourceRow);
function circuit(g,avatar){
 const byRow=new Map(g.nodes.map(q=>[q.sourceRow,q]));let q=g.nodes[0],out=[];
 do{assert.ok(out.length<g.nodes.length+1);out.push(q.sourceRow);q=byRow.get(q.nextByAvatar[avatar]);}while(q.sourceRow!==g.nodes[0].sourceRow);
 return out;
}

// Literal expected circuits independently evaluated by the original numeric
// link-builder for the user's USA Rev1 reference. No ROM is needed by tests.
const sunnyCircuits=[
 [
  [0,2,3,6,7,10,14,15,17,22,24,25,26,28,30,31,34,37,39,41,43,44,45,47,49,50,51,52,56],
  [0,2,3,6,7,10,14,15,16,17,19,21,22,24,25,26,28,30,34,36,37,39,41,43,44,45,47,49,50,51,52,53],
  [0,1,2,3,5,6,7,10,11,14,15,17,22,24,25,26,28,30,34,37,39,41,43,44,45,47,49,50,51,52,55],
  [0,2,3,6,7,8,10,12,14,15,17,20,22,24,25,26,27,28,30,33,34,35,37,39,40,41,43,44,45,47,49,50,51,52,54,58]
 ],[
  [0,2,3,6,7,10,14,15,17,21,22,23,24,26,27,28,31,34,35,37,39,40,41,43,45,46,47,48,52],
  [0,2,3,6,7,10,14,15,16,17,18,20,21,22,23,24,26,27,31,33,34,35,37,39,40,41,43,45,46,47,48,49],
  [0,1,2,3,5,6,7,10,11,14,15,17,21,22,23,24,26,27,31,34,35,37,39,40,41,43,45,46,47,48,51],
  [0,2,3,6,7,8,10,12,14,15,17,19,21,22,23,24,25,26,27,30,31,32,34,35,36,37,39,40,41,43,45,46,47,48,50,54]
 ],[
  [0,2,3,6,7,10,14,15,17,21,22,23,24,26,27,28,29,32,35,37,39,41,42,43,45,47,48,49,50,54],
  [0,2,3,6,7,10,14,15,16,17,18,20,21,22,23,24,26,27,29,32,34,35,37,39,41,42,43,45,47,48,49,50,51],
  [0,1,2,3,5,6,7,10,11,14,15,17,21,22,23,24,26,27,29,32,35,37,39,41,42,43,45,47,48,49,50,53],
  [0,2,3,6,7,8,10,12,14,15,17,19,21,22,23,24,25,26,27,29,31,32,33,35,37,38,39,41,42,43,45,47,48,49,50,52,56]
 ],[
  [0,2,4,5,8,10,12,13,17,20,21,22,26,29,30,32,35,36,37,39,40,41,44,45,48,49,50,51,53],
  [0,2,4,5,8,10,13,17,21,26,29,30,35,37,39,41,44,45,48,49,50,51,53],
  [0,2,4,5,8,10,11,13,17,19,21,24,26,29,30,34,35,37,39,41,42,44,45,48,49,50,51,53],
  [0,2,4,5,6,8,9,10,13,15,17,18,21,25,26,27,29,30,33,35,37,39,41,44,45,47,48,49,50,51,52,53]
 ]
];
for(let difficulty=0;difficulty<4;difficulty++)for(let avatar=0;avatar<4;avatar++)test(`Sunny class${difficulty} avatar${avatar} retains the independent original route circuit`,()=>{
 const course=getCourse('greyhaven',difficulty),g=createNativeAIRoute({...course.sourceBuoyLayout,nodes:course.sourceBuoyLayout.nodes});
 const raw=createNativeAIRoute({rows:course.sourceRouteRowsByClass[difficulty],courseIndex:1});
 assert.deepEqual(circuit(g,avatar),sunnyCircuits[difficulty][avatar]);
 assert.deepEqual(raw.nodes.map(q=>q.nextByAvatar),g.nodes.map(q=>q.nextByAvatar));
 assert.deepEqual(raw.nodes.map(q=>q.previousByAvatar),g.nodes.map(q=>q.previousByAvatar));
 const byRow=new Map(g.nodes.map(q=>[q.sourceRow,q]));
 for(const sourceRow of sunnyCircuits[difficulty][avatar]){
  const q=byRow.get(sourceRow),next=byRow.get(q.nextByAvatar[avatar]);
  assert.equal(next.previousByAvatar[avatar],sourceRow);
 }
 if(difficulty===0){assert.equal(g.nodes[2].nextByAvatar[avatar],3);assert.equal(course.sourceBuoyLayout.nodes[2].nextSourceRow,4);}
});

test('all raw group families preserve the avatar graph and excluded-row immediate defaults',()=>{
 const rows=[3,8,11,14,17,20,23,0,6].map((type,i)=>[i*100,i*200,type,0]),g=createNativeAIRoute({rows});
 assert.deepEqual(g.nodes[0].nextByAvatar,[2,2,2,2]);
 assert.deepEqual(g.nodes[2].nextByAvatar,[3,4,5,6]);
 assert.deepEqual(g.nodes[7].previousByAvatar,[3,4,5,6]);
 assert.deepEqual(g.nodes[1].nextByAvatar,[2,2,2,2]);
 assert.deepEqual(g.nodes[1].previousByAvatar,[0,0,0,0]);
 assert.deepEqual(circuit(g,0),[0,2,3,7]);assert.deepEqual(circuit(g,3),[0,2,6,7]);
 // Training's raw27 group1 is separate from other venues' group2.
 const special=[[0,0,3,0],[0,100,27,0],[0,200,11,0]];
 assert.equal(createNativeAIRoute({rows:special,courseIndex:0}).nodes[1].routeGroup,1);
 assert.equal(createNativeAIRoute({rows:special,courseIndex:1}).nodes[1].routeGroup,2);
});

for(let avatar=0;avatar<4;avatar++)test(`avatar${avatar} has strict sampled forward and previous-plane backtracking`,()=>{
 const g=graph(),state=createNativeAIRouteState(g,{avatar});
 for(const [z,expected,decision]of [[-101,81,'backward-plane'],[-100,41,'unchanged'],[-1,41,'unchanged'],[0,41,'unchanged'],[1,61,'forward-plane'],[101,61,'forward-plane']]){
  const result=stepNativeAIRoute(g,state,{position:{x:0,z:z*S}});
  assert.equal(result.state.navigationSourceRow,expected);assert.equal(result.diagnostic.decision,decision);
  assert.equal(state.navigationSourceRow,41);assert.equal(result.window.current.sourceRow,expected);
  assert.deepEqual(Object.keys(result.state).sort(),['avatar','navigationSourceRow']);
 }
});

test('the backward test uses the old previous node and can override a forward store',()=>{
 const source=nodes();source[3].tz=-1;const g=createNativeAIRoute({nodes:source}),state=createNativeAIRouteState(g,{avatar:2});
 const result=stepNativeAIRoute(g,state,{position:{x:0,z:S}});
 assert.equal(result.diagnostic.forward,true);assert.equal(result.diagnostic.backward,true);
 assert.equal(result.diagnostic.testedPreviousSourceRow,101);assert.equal(result.state.navigationSourceRow,81);
});

test('oblique binary32 cancellation preserves the strict zero boundary',()=>{
 const input=nodes();input[0].tx=.6;input[0].tz=.8;const g=createNativeAIRoute({nodes:input}),state=createNativeAIRouteState(g,{avatar:0});
 for(const [x,expected]of [[4,41],[4.0000005,61],[3.9999995,41]]){
  const result=stepNativeAIRoute(g,state,{position:{x:x*S,z:-3*S}});
  assert.equal(result.state.navigationSourceRow,expected);
  if(x===4)assert.equal(result.diagnostic.forwardDotNative,0);
 }
});

test('mutable current centers are supplied as a copied complete snapshot for both planes and window positions',()=>{
 const g=graph(),state=createNativeAIRouteState(g,{avatar:1});
 assert.equal(stepNativeAIRoute(g,state,{position:{x:0,z:S}}).state.navigationSourceRow,61);
 const positions=g.nodes.map(q=>({sourceRow:q.sourceRow,x:q.x,z:q.z}));positions[0].z=10*S;
 const result=stepNativeAIRoute(g,state,{position:{x:0,z:S},nodePositions:[...positions].reverse()});
 assert.equal(result.state.navigationSourceRow,41);assert.equal(result.diagnostic.forwardDotNative,-9);
 assert.equal(result.window.current.z,10*S);positions[0].z=100;
 assert.equal(result.window.current.z,10*S);assert.equal(g.nodes[0].z,0);
 positions[0].z=0;positions[3].z=10*S;
 assert.equal(stepNativeAIRoute(g,state,{position:{x:0,z:S},nodePositions:positions}).state.navigationSourceRow,81);
});

test('initial window, independent state, explicit table restoration and pause have no progress or clock side effects',()=>{
 const g=graph(),a=createNativeAIRouteState(g,{avatar:3}),b=createNativeAIRouteState(g,{avatar:3});
 const w=nativeAIRouteWindow(g,a);assert.deepEqual([w.current.sourceRow,w.target.sourceRow,w.next.sourceRow,w.previous.sourceRow],[41,41,61,101]);
 assert.deepEqual([w.current.classification,w.target.classification,w.next.classification,w.previous.classification],[3,3,4,4]);
 const moved=stepNativeAIRoute(g,a,{position:{x:0,z:S}});assert.equal(b.navigationSourceRow,41);
 const paused=stepNativeAIRoute(g,moved.state,{active:false});assert.equal(paused.state,moved.state);
 const snapshot=nativeAIRouteSnapshot(g,moved.state),other=createNativeAIRoute({nodes:nodes(),family:'secondary'});
 assert.throws(()=>stepNativeAIRoute(other,moved.state,{position:{x:0,z:0}}),/another graph/);
 const restored=createNativeAIRouteState(other,JSON.parse(JSON.stringify(snapshot)));assert.deepEqual(restored,moved.state);
 snapshot.navigationSourceRow=41;assert.equal(restored.navigationSourceRow,61);
 assert.ok(Object.isFrozen(g)&&Object.isFrozen(g.nodes)&&Object.isFrozen(g.nodes[0].nextByAvatar)&&Object.isFrozen(a));
 assert.throws(()=>{a.navigationSourceRow=61;},TypeError);assert.throws(()=>{w.current.x=100;},TypeError);
 assert.deepEqual(row(g),[41,61,81,101]);
});

test('explicit metadata is copied and raw heading fallback keeps quantized quadrants',()=>{
 const input=nodes(),g=createNativeAIRoute({nodes:input});input[0].x=99;input[0].tx=1;
 assert.equal(g.nodes[0].x,0);assert.equal(g.nodes[0].tx,0);
 const headings=createNativeAIRoute({rows:[0,90,180,270].map((heading,i)=>[i,0,i===0?3:0,heading])});
 assert.deepEqual(headings.nodes.map(q=>[q.tx,q.tz]),[[0,1],[1,0],[0,-1],[-1,0]]);
 assert.equal(headings.provenance.coordinates,'4096-phase-trig-fallback');
 assert.equal(g.provenance.coordinates,'explicit-node-axis-binary32');
});

test('invalid graph, state and current-center samples reject atomically within source bounds',()=>{
 const g=graph(),state=createNativeAIRouteState(g,{avatar:0}),before=JSON.stringify({g,state});
 const positions=g.nodes.map(q=>({sourceRow:q.sourceRow,x:q.x,z:q.z}));
 for(const options of [{position:{x:NaN,z:0}},{position:{x:Infinity,z:0}},{position:{x:0,z:0},active:1},
  {position:{x:0,z:0},nodePositions:positions.slice(1)},
  {position:{x:0,z:0},nodePositions:positions.map((q,i)=>({...q,sourceRow:i===1?41:q.sourceRow}))},
  {position:{x:0,z:0},nodePositions:positions.map((q,i)=>({...q,sourceRow:i===1?65535:q.sourceRow}))}]){
  assert.throws(()=>stepNativeAIRoute(g,state,options));assert.equal(JSON.stringify({g,state}),before);
 }
 assert.throws(()=>createNativeAIRoute({nodes:[]}),/1\.\.64/);
 assert.throws(()=>createNativeAIRoute({nodes:Array(65).fill(nodes()[0])}),/1\.\.64/);
 assert.throws(()=>createNativeAIRoute({nodes:[nodes()[0],nodes()[0]]}),/Duplicate/);
 assert.throws(()=>createNativeAIRoute({nodes:[{...nodes()[0],tx:0,tz:0}]}),/unit/);
 assert.throws(()=>createNativeAIRoute({nodes:[{...nodes()[0],routeGroup:7}]}),/routeGroup/);
 assert.throws(()=>createNativeAIRoute({nodes:[{...nodes()[0],classification:15}]}),/classification/);
 assert.throws(()=>createNativeAIRoute({rows:[[0,0,3,-1]]}),/sentinel/);
 assert.throws(()=>createNativeAIRoute({rows:[[32768,0,3,0]]}),/field0/);
 assert.throws(()=>createNativeAIRouteState(g,{avatar:4}),/avatar/);
 assert.throws(()=>createNativeAIRouteState(g,{avatar:0,navigationSourceRow:1}),/Unknown/);
 assert.throws(()=>nativeAIRouteWindow(g,{avatar:0,navigationSourceRow:41}),/another graph/);
 const huge=createNativeAIRoute({scale:1,nodes:[{...nodes()[0],x:-3e38,tx:1,tz:0}]}),h=createNativeAIRouteState(huge,{avatar:0});
 assert.throws(()=>stepNativeAIRoute(huge,h,{position:{x:3e38,z:0}}),/finite binary32/);
});
