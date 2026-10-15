import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryScratchLayout as compile,prepareNativePrimaryScratchContext as prepare} from '../native-primary-scratch-context.js';

const WEEDS=[[-2130,-3130],[-60,-2380],[10,-3940],[-3980,620],[-4610,1620],[-4690,-490]].map(([x,z])=>({x,z}));
function data(){return {nodes:[-10,0,10].map((x,i)=>({sourceRow:i,centerNativeXZ:{x,z:0},nextSourceRowA0:(i+1)%3,previousSourceRowA8:(i+2)%3})),
 regionsNative:[[-10000,10000,-10000,10000]],weedCentersNativeXZ:WEEDS.map(p=>({...p})),weedRadiusSquaredNative:22500,
 portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]};}
const sample=(x=0,y=0,z=0)=>({racerIndex:0,state638:1,players:1,primaryHumanIndex:0,secondaryHumanIndex:1,
 courseIndex:1,bodyPositionNative:{x,y,z}});
const record=()=>({postJudgeSourceRow2c48:1,weed2c50:7,region2c54:0,progressRow2940:17});

test('nearest compares only primary previous/current/next and retains the canonical record owner',()=>{
 const input=data();input.nodes.push({sourceRow:3,centerNativeXZ:{x:9,z:0},nextSourceRowA0:3,previousSourceRowA8:3});
 input.nodes[1].previousSourceRowA8=0;input.nodes[1].nextSourceRowA0=2;
 const state=record(),r=prepare(compile(input),state,sample(9));
 assert.equal(r.diagnostic.nearest.candidateSourceRow,2,'unlinked sourceRow3 is not searched despite being nearer');
 assert.deepEqual(r.recordWrites,{postJudgeSourceRow2c48:2});assert.equal(state.postJudgeSourceRow2c48,1);assert.equal(state.progressRow2940,17);
 assert.equal(Object.hasOwn(r.recordWrites,'progressRow2940'),false);
});

test('equal distances prefer current over previous and next',()=>{
 const layout=compile(data());
 for(const x of [-5,5]){
  const r=prepare(layout,record(),sample(x));assert.equal(r.diagnostic.nearest.candidateSourceRow,1);assert.deepEqual(r.recordWrites,{});
  assert.equal(r.diagnostic.nearest.candidateRegionIds,null);assert.equal(r.diagnostic.nearest.regionShared,null);
 }
});

test('a previous/next tie beats the farther current using previous priority',()=>{
 const input=data();input.nodes[1].centerNativeXZ={x:0,z:100};
 const r=prepare(compile(input),record(),sample());
 assert.deepEqual(r.diagnostic.nearest.distancesSquaredNative,{current:10000,previous:100,next:100});
 assert.equal(r.diagnostic.nearest.candidateSourceRow,0);assert.equal(r.recordWrites.postJudgeSourceRow2c48,0);
});

test('nearest update requires first/last region overlap, not a shared discarded middle region',()=>{
 const input=data();input.nodes[0].centerNativeXZ={x:0,z:0};input.nodes[1].centerNativeXZ={x:1000,z:0};input.nodes[2].centerNativeXZ={x:-1000,z:0};
 input.regionsNative=[[-100,-25,-100,100],[-100,100,-100,100],[-100,-25,-100,100]];
 const blocked=prepare(compile(input),record(),sample(-50));
 assert.equal(blocked.diagnostic.nearest.candidateSourceRow,0);assert.deepEqual(blocked.diagnostic.nearest.craftRegionIds,[0,2]);
 assert.deepEqual(blocked.diagnostic.nearest.candidateRegionIds,[1,-1]);assert.equal(blocked.diagnostic.nearest.regionShared,false);assert.deepEqual(blocked.recordWrites,{});
 input.regionsNative.push([-100,100,-100,100]);
 assert.deepEqual(prepare(compile(input),record(),sample(-50)).recordWrites,{postJudgeSourceRow2c48:0});
});

test('two missing coarse regions do not authorize a nearest-row change',()=>{
 const input=data();input.regionsNative=[];
 const r=prepare(compile(input),record(),sample(9));assert.equal(r.diagnostic.nearest.candidateSourceRow,2);
 assert.equal(r.diagnostic.nearest.regionShared,false);assert.deepEqual(r.recordWrites,{});
});

test('current physical centers are complete per-sample inputs and do not alter compiled centers',()=>{
 const layout=compile(data()),q=sample();assert.deepEqual(prepare(layout,record(),q).recordWrites,{});
 const moved=[{sourceRow:2,x:0,z:0},{sourceRow:0,x:-10,z:0},{sourceRow:1,x:100,z:0}];
 const r=prepare(layout,record(),{...q,nodePositionsNative:moved});assert.deepEqual(r.recordWrites,{postJudgeSourceRow2c48:2});
 assert.equal(layout.nodes[1].centerNativeXZ.x,0);moved[0].x=999;assert.equal(r.diagnostic.nearest.distancesSquaredNative.next,0);
});

test('nonordinary main states retain2c48 and main2 uses actual alternate scratch coordinates',()=>{
 const layout=compile(data());
 for(const main of [-1,0,8,21]){
  const r=prepare(layout,{}, {...sample(9),state638:main});assert.equal(r.diagnostic.nearest,null);assert.deepEqual(r.recordWrites,{});
 }
 const r=prepare(layout,{postJudgeSourceRow2c48:999}, {...sample(),state638:2,bodyPositionNative:null,alternatePositionNativeXZ:{x:-0,z:1.00000008}});
 assert.equal(r.diagnostic.nearest,null);assert(Object.is(r.positionNative.x,-0));assert(Object.is(r.positionNative.y,0));assert.equal(r.positionNative.z,Math.fround(1.00000008));
});

test('weed selection uses first three centers below difficulty2 and all six otherwise',()=>{
 const layout=compile(data()),p=WEEDS[3];
 for(const difficulty of [-1,0,1]){
  const r=prepare(layout,record(),{...sample(p.x,0,p.z),courseIndex:4,difficulty});assert.equal(r.recordWrites.weed2c50,0);assert.equal(r.diagnostic.weedHitIndex,null);
 }
 for(const difficulty of [2,3,2147483647]){
  const r=prepare(layout,record(),{...sample(p.x,0,p.z),courseIndex:4,difficulty});assert.equal(r.recordWrites.weed2c50,1);assert.equal(r.diagnostic.weedHitIndex,3);
 }
});

test('weed height and native squared-radius boundaries are inclusive and have no water-datum offset',()=>{
 const layout=compile(data()),p=WEEDS[0],q={...sample(p.x+150,40,p.z),courseIndex:4,difficulty:1};
 assert.equal(prepare(layout,record(),q).recordWrites.weed2c50,1);
 assert.equal(prepare(layout,record(),{...q,bodyPositionNative:{x:p.x+150.001,y:40,z:p.z}}).recordWrites.weed2c50,0);
 assert.equal(prepare(layout,record(),{...q,bodyPositionNative:{x:p.x+150,y:40.001,z:p.z}}).recordWrites.weed2c50,0);
 assert.equal(prepare(layout,record(),{...q,state638:2,alternatePositionNativeXZ:{x:p.x,z:p.z},bodyPositionNative:{x:999,y:999,z:999}}).recordWrites.weed2c50,1);
});

test('source courses5/6 use their distinct inclusive native rectangles without a Y gate',()=>{
 const layout=compile(data());
 for(const [courseIndex,p]of [[5,{x:-1000,y:99999,z:-5450}],[5,{x:2600,y:-99999,z:1500}],
  [6,{x:-300,y:1000,z:700}],[6,{x:300,y:-1000,z:4400}]]){
  const r=prepare(layout,{region2c54:0},{...sample(),state638:0,courseIndex,bodyPositionNative:p});
  assert.deepEqual(r.recordWrites,{region2c54:1});assert.deepEqual(r.effects,[{kind:'courseRegionEnterCue',arguments:[]}]);
 }
 assert.equal(prepare(layout,{region2c54:0},{...sample(301,0,700),state638:0,courseIndex:6}).recordWrites.region2c54,0);
});

test('course-region cues follow actual primary/secondary slots and retain exit argument identity',()=>{
 const layout=compile(data()),q={...sample(500,0,800),state638:0,courseIndex:6,players:2,primaryHumanIndex:2,secondaryHumanIndex:3};
 assert.deepEqual(prepare(layout,{region2c54:1},{...q,racerIndex:2}).effects,[{kind:'courseRegionExitCue',arguments:[0]}]);
 assert.deepEqual(prepare(layout,{region2c54:1},{...q,racerIndex:3}).effects,[{kind:'courseRegionExitCue',arguments:[1]}]);
 assert.deepEqual(prepare(layout,{region2c54:1},{...q,racerIndex:0}).effects,[]);
 assert.deepEqual(prepare(layout,{region2c54:1},{...q,racerIndex:3,players:1}).effects,[]);
});

test('a signed retained region word is compared numerically with new0/1, not coerced to a boolean',()=>{
 const layout=compile(data()),q={...sample(0,0,800),state638:0,courseIndex:6};
 assert.deepEqual(prepare(layout,{region2c54:-1},q).effects,[{kind:'courseRegionEnterCue',arguments:[]}]);
 assert.deepEqual(prepare(layout,{region2c54:1},q).effects,[]);
 assert.deepEqual(prepare(layout,{region2c54:1},q).recordWrites,{region2c54:1},'the actual course write remains represented even if unchanged');
});

test('compiled tables and results are detached immutable numeric copies',()=>{
 const input=data(),layout=compile(input),state=record(),q=sample(9),r=prepare(layout,state,q);
 input.nodes[2].centerNativeXZ.x=999;input.weedCentersNativeXZ[0].x=999;
 assert.equal(layout.nodes[2].centerNativeXZ.x,10);assert.equal(layout.weedCentersNativeXZ[0].x,-2130);
 assert.deepEqual(state,record());assert(Object.isFrozen(r));assert(Object.isFrozen(r.diagnostic.nearest.distancesSquaredNative));
 assert.throws(()=>{r.recordWrites.postJudgeSourceRow2c48=99;},TypeError);
});

test('unsupported table ownership/ranges and missing actual conditional inputs reject',()=>{
 const input=data(),layout=compile(input);
 assert.throws(()=>compile({...input,weedCentersNativeXZ:WEEDS.slice(0,3)}),/six/);
 assert.throws(()=>compile({...input,nodes:input.nodes.map((n,i)=>({...n,sourceRow:i+1}))}),/array order/);
 assert.throws(()=>prepare(structuredClone(layout),record(),sample()),/compiled/);
 assert.throws(()=>prepare(layout,{},sample()),/postJudgeSourceRow2c48/);
 assert.throws(()=>prepare(layout,record(),{...sample(),courseIndex:4}),/difficulty/);
 assert.throws(()=>prepare(layout,{}, {...sample(),state638:0,courseIndex:6}),/region2c54/);
 assert.throws(()=>prepare(layout,record(),{...sample(),nodePositionsNative:[{sourceRow:0,x:0,z:0}]}),/complete/);
 assert.throws(()=>prepare(layout,record(),{...sample(),bodyPositionNative:{x:3e38,y:0,z:3e38}}),/float32/);
});
