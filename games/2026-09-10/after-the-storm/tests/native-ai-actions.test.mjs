import test from 'node:test';
import assert from 'node:assert/strict';
import {
 nativeAIWaterSamplePoints,prepareNativeAIWaterTrim,nativeAICameraContains,
 nativeAITrafficBlocked,prepareNativeAIButtons,prepareNativeAITrainingAction,prepareNativeAITail,
} from '../native-ai-actions.js';

const trim={positionNative:{x:0,y:1,z:0},forwardNative:{x:0,y:.1,z:1},datumNative:0,
 waterHeightsNative:[0,0],state638:1,mode620:4,difficulty:1,courseIndex:1,fieldC7c:0,
 flag94:0,markedBox15de:0,rawYNative:-42};
const cameraCornersNative=[{x:10,z:10},{x:10,z:-10},{x:-10,z:10},{x:-10,z:-10}];
const camera=p=>nativeAICameraContains({cameraCornersNative,positionNative:p});
const buttons={heldButtons:0,state638:1,fieldC7c:0,flag98:0,actorC54:22,pendingActorC5c:22,
 record2c24:0,difficulty:1,toggleD9914:0,phase8c:0,trafficBlocked:false,impactNormalNative:{x:0,y:0,z:0}};
const action={positionNative:{x:-1142,y:30,z:4199},rawXNative:12,rawYNative:-35,action16f4:0,
 actionState16d4:0,bodyUpY:.5,markedBox15de:0,fieldC7c:0,flag9c:1,fieldE0:1,
 firstCircleAction:1,secondCircleAction:0};
const tail={...action,racerIndex:0,courseIndex:1,trainingSelection:0,mode620:11,
 navigation2948:7,previousNavigationGlobal:6};
const xyz=(x,y,z)=>({x,y,z});
const runAction=input=>prepareNativeAITrainingAction({...action,...input});

test('water sample positions use native forward components without normalization or SI conversion',()=>{
 const input={positionNative:xyz(10,12,-20),forwardNative:xyz(.25,.3,-.5)};
 const samples=nativeAIWaterSamplePoints(input);
 assert.deepEqual(samples,[{x:10,z:-20},{x:138,z:-276}]);
 assert.deepEqual(nativeAIWaterSamplePoints({...input,forwardNative:xyz(2,0,0)}),[{x:10,z:-20},{x:1034,z:-20}]);
 assert.notEqual(samples[0],input.positionNative);
 assert.ok(Object.isFrozen(samples)&&samples.every(Object.isFrozen));
});

test('water trim stores two relative samples with source int32-to-float datum rounding',()=>{
 const output=prepareNativeAIWaterTrim({...trim,datumNative:16777217,waterHeightsNative:[16777218,16777236],difficulty:0});
 assert.deepEqual(output,{rawYNative:-42,field48:2,field4c:20});
 assert.deepEqual(prepareNativeAIWaterTrim({...trim,datumNative:100,waterHeightsNative:[119,121],fieldC7c:1}),
  {rawYNative:70,field48:19,field4c:21});
});

test('state0/8 trim uses strict float32 .2 and exposed-center conditions before mode/difficulty',()=>{
 for(const state638 of [0,8]){
  const q={...trim,state638,forwardNative:xyz(0,.2,1),difficulty:0};
  assert.equal(prepareNativeAIWaterTrim(q).rawYNative,-42);
  assert.equal(prepareNativeAIWaterTrim({...q,forwardNative:xyz(0,.20000002,1)}).rawYNative,35);
  assert.equal(prepareNativeAIWaterTrim({...q,forwardNative:xyz(0,.3,1),positionNative:xyz(0,0,0)}).rawYNative,-42);
  assert.equal(prepareNativeAIWaterTrim({...q,forwardNative:xyz(0,.3,1),fieldC7c:1}).rawYNative,-42);
 }
});

test('ordinary trim distinguishes actual difficulty and flag94 from other modes',()=>{
 assert.equal(prepareNativeAIWaterTrim({...trim,difficulty:0,waterHeightsNative:[21,0],fieldC7c:1}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...trim,difficulty:3,waterHeightsNative:[21,0],fieldC7c:1}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim(trim).rawYNative,52);
 assert.equal(prepareNativeAIWaterTrim({...trim,flag94:1}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...trim,mode620:11,flag94:1}).rawYNative,52);
 assert.equal(prepareNativeAIWaterTrim({...trim,forwardNative:xyz(0,-0,1)}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...trim,waterHeightsNative:[20,20],fieldC7c:1}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...trim,waterHeightsNative:[20,20.00001],fieldC7c:1}).rawYNative,70);
 assert.equal(prepareNativeAIWaterTrim({...trim,waterHeightsNative:[21,0],fieldC7c:2}).rawYNative,-42);
});

test('course6 Expert trim overrides retain strict native coordinate boundaries',()=>{
 const q={...trim,difficulty:2,courseIndex:6,markedBox15de:1,forwardNative:xyz(0,-.1,1)};
 for(const z of [-2570,-2300,-900])assert.equal(prepareNativeAIWaterTrim({...q,positionNative:xyz(0,1,z)}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...q,positionNative:xyz(0,1,-2500)}).rawYNative,-70);
 assert.equal(prepareNativeAIWaterTrim({...q,positionNative:xyz(0,1,-1000)}).rawYNative,70);
 for(const x of [-350,400])assert.equal(prepareNativeAIWaterTrim({...q,positionNative:xyz(x,1,-1000)}).rawYNative,-42);
 assert.equal(prepareNativeAIWaterTrim({...q,difficulty:1,positionNative:xyz(0,1,-2500)}).rawYNative,-42);
});

test('camera predicate preserves source corner order and asymmetric collinear edges',()=>{
 assert.equal(camera({x:0,z:0}),true);
 assert.equal(camera({x:10,z:0}),true);
 assert.equal(camera({x:0,z:10}),true);
 assert.equal(camera({x:-10,z:0}),false);
 assert.equal(camera({x:0,z:-10}),false);
 assert.equal(camera({x:10,z:10}),true);
 assert.equal(camera({x:11,z:0}),false);
 assert.equal(nativeAICameraContains({cameraCornersNative:[cameraCornersNative[1],cameraCornersNative[0],cameraCornersNative[2],cameraCornersNative[3]],positionNative:{x:0,z:0}}),false);
});

test('rotated camera preserves the unusual source point degeneracy rather than a generic polygon test',()=>{
 const rotated=cameraCornersNative.map(p=>({x:-p.z,z:p.x}));
 assert.equal(nativeAICameraContains({cameraCornersNative:rotated,positionNative:{x:8,z:8}}),false);
 assert.equal(nativeAICameraContains({cameraCornersNative:rotated,positionNative:{x:8,z:7}}),true);
 assert.equal(nativeAICameraContains({cameraCornersNative:rotated,positionNative:{x:6,z:2}}),false);
 assert.equal(nativeAICameraContains({cameraCornersNative:rotated,positionNative:{x:6,z:1}}),true);
 assert.equal(nativeAICameraContains({cameraCornersNative:Array.from({length:4},()=>({x:0,z:0})),positionNative:{x:0,z:0}}),false);
});

test('traffic uses source B90 frame displacement and selected-camera predicate, excluding self',()=>{
 const racer=(speed,x=0)=>({positionNative:{x,z:0},frameSpeedNative:speed});
 const q={cameraCornersNative,racerIndex:0,racers:[racer(9),racer(0)]};
 assert.equal(nativeAITrafficBlocked(q),true);
 assert.equal(nativeAITrafficBlocked({...q,racers:[racer(8),racer(0)]}),false);
 assert.equal(nativeAITrafficBlocked({...q,racers:[racer(9),racer(0,30)]}),false);
 assert.equal(nativeAITrafficBlocked({...q,racers:[racer(100)]}),false);
 assert.equal(nativeAITrafficBlocked({...q,racerIndex:1,racers:[racer(0),racer(9)]}),true);
 assert.equal(nativeAITrafficBlocked({...q,racers:[]}),false);
});

test('empty and solo traffic skip camera reads while multiple racers require actual corners',()=>{
 const racer={positionNative:{x:0,z:0},frameSpeedNative:100};
 const q={racerIndex:0,racers:[],get cameraCornersNative(){throw new Error('unexpected camera read');}};
 assert.equal(nativeAITrafficBlocked(q),false);
 q.racers=[racer];assert.equal(nativeAITrafficBlocked(q),false);
 q.racers.push(racer);assert.throws(()=>nativeAITrafficBlocked(q),/unexpected camera read/);
 assert.throws(()=>nativeAITrafficBlocked({racerIndex:0,racers:[racer,racer]}),/cameraCornersNative/);
 assert.throws(()=>nativeAITrafficBlocked({racerIndex:1,racers:[racer]}),/integer/);
});

test('traffic threshold retains binary32 subtraction/multiplier behavior',()=>{
 const racers=[{positionNative:{x:0,z:0},frameSpeedNative:8.333333015441895},
  {positionNative:{x:0,z:0},frameSpeedNative:0}];
 assert.equal(nativeAITrafficBlocked({cameraCornersNative,racerIndex:0,racers}),false);
 assert.equal(nativeAITrafficBlocked({cameraCornersNative,racerIndex:0,racers:[{...racers[0],frameSpeedNative:8.333333969116211},racers[1]]}),true);
});

test('button order clears R, toggles B, then traffic removes A|Z; flag98 restores A|Z',()=>{
 assert.deepEqual(prepareNativeAIButtons({...buttons,heldButtons:0x10}),{heldButtons:0xe000,trafficTested:true});
 assert.deepEqual(prepareNativeAIButtons({...buttons,heldButtons:0x10,trafficBlocked:true}),{heldButtons:0x4000,trafficTested:true});
 assert.deepEqual(prepareNativeAIButtons({...buttons,heldButtons:0x10,trafficBlocked:true,flag98:1}),{heldButtons:0xa000,trafficTested:true});
 assert.deepEqual(prepareNativeAIButtons({...buttons,heldButtons:0xffff,trafficBlocked:true}),{heldButtons:0x1fef,trafficTested:true});
});

test('actor7/23 button branch preserves its own record/difficulty/toggle gates without traffic fallthrough',()=>{
 for(const actorC54 of [7,23]){
  assert.deepEqual(prepareNativeAIButtons({...buttons,actorC54,heldButtons:0x10,trafficBlocked:true}),{heldButtons:0xe000,trafficTested:false});
  assert.deepEqual(prepareNativeAIButtons({...buttons,actorC54,heldButtons:0x10,record2c24:1}),{heldButtons:0x4000,trafficTested:false});
  assert.deepEqual(prepareNativeAIButtons({...buttons,actorC54,heldButtons:0x10,difficulty:0}),{heldButtons:0x4000,trafficTested:false});
  assert.deepEqual(prepareNativeAIButtons({...buttons,actorC54,heldButtons:0xffff,toggleD9914:1}),{heldButtons:0x1fef,trafficTested:false});
 }
});

test('actor24 exact zero-normal/pending actor branch precedes phase3 and ordinary traffic',()=>{
 const q={...buttons,actorC54:24,fieldC7c:1,heldButtons:0xa010,phase8c:3,trafficBlocked:true};
 assert.deepEqual(prepareNativeAIButtons(q),{heldButtons:0,trafficTested:false});
 assert.deepEqual(prepareNativeAIButtons({...q,pendingActorC5c:7}),{heldButtons:0xa000,trafficTested:false});
 assert.deepEqual(prepareNativeAIButtons({...q,phase8c:0,impactNormalNative:xyz(0,0,.000001)}),{heldButtons:0,trafficTested:true});
 assert.deepEqual(prepareNativeAIButtons({...buttons,state638:8,phase8c:3,heldButtons:0xa010}),{heldButtons:0,trafficTested:false});
});

test('training circles use strict radius, a separate second center and first-circle priority',()=>{
 assert.deepEqual(runAction({positionNative:xyz(-3142,30,4199)}),{rawXNative:12,rawYNative:-35,action16f4:0});
 assert.deepEqual(runAction({positionNative:xyz(-3141.999,30,4199)}),{rawXNative:0,rawYNative:-70,action16f4:5});
 assert.deepEqual(runAction({positionNative:xyz(3441,30,3619),firstCircleAction:0,secondCircleAction:1}),{rawXNative:12,rawYNative:-35,action16f4:0});
 assert.deepEqual(runAction({positionNative:xyz(1441,30,3619),firstCircleAction:0,secondCircleAction:1}),{rawXNative:0,rawYNative:-70,action16f4:5});
 assert.deepEqual(runAction({positionNative:xyz(0,30,4000),firstCircleAction:0,secondCircleAction:1}),{rawXNative:12,rawYNative:-35,action16f4:0});
 assert.deepEqual(runAction({flag9c:0}),{rawXNative:12,rawYNative:-35,action16f4:0});
});

test('training entry request returns before later upright neutralization',()=>{
 assert.deepEqual(runAction({actionState16d4:2,bodyUpY:1}),{rawXNative:0,rawYNative:-70,action16f4:5});
 assert.deepEqual(runAction({fieldE0:2,actionState16d4:2,bodyUpY:.5}),{rawXNative:0,rawYNative:-70,action16f4:0});
 assert.deepEqual(runAction({fieldE0:2,actionState16d4:2,bodyUpY:.500001}),{rawXNative:0,rawYNative:0,action16f4:0});
});

test('training opposite turn actions preserve y==60 and strict up-Y boundary',()=>{
 const q={firstCircleAction:2,markedBox15de:1};
 assert.equal(runAction({...q,positionNative:xyz(-1142,59,4199)}).rawXNative,70);
 assert.equal(runAction({...q,positionNative:xyz(-1142,60,4199)}).rawXNative,12);
 assert.equal(runAction({...q,positionNative:xyz(-1142,61,4199)}).rawXNative,-70);
 assert.equal(runAction({...q,firstCircleAction:3}).rawXNative,-70);
 assert.equal(runAction({...q,actionState16d4:2,bodyUpY:.5}).rawXNative,70);
 assert.equal(runAction({...q,actionState16d4:2,bodyUpY:.500001}).rawXNative,0);
 assert.equal(runAction({...q,markedBox15de:0}).rawXNative,-70);
 assert.equal(runAction({...q,markedBox15de:0,fieldC7c:1}).rawXNative,12);
});

test('tail E0 clear/advance/rearm order runs even outside action courses',()=>{
 const q={...tail,courseIndex:6,navigation2948:14};
 assert.deepEqual(prepareNativeAITail(q),{rawXNative:12,rawYNative:-35,action16f4:0,fieldE0:2,previousNavigationGlobal:14});
 assert.equal(prepareNativeAITail({...q,markedBox15de:1}).fieldE0,1);
 assert.equal(prepareNativeAITail({...q,markedBox15de:1,fieldC7c:1}).fieldE0,0);
 assert.equal(prepareNativeAITail({...q,fieldE0:9}).fieldE0,9);
});

test('course0 selection is slot-specific and sees the updated E0 before actions',()=>{
 const q={...tail,courseIndex:0,trainingSelection:1,actionState16d4:2,bodyUpY:1};
 assert.deepEqual(prepareNativeAITail(q),{rawXNative:0,rawYNative:0,action16f4:0,fieldE0:2,previousNavigationGlobal:7});
 assert.deepEqual(prepareNativeAITail({...q,markedBox15de:1}),{rawXNative:0,rawYNative:-70,action16f4:5,fieldE0:1,previousNavigationGlobal:7});
 assert.equal(prepareNativeAITail({...q,racerIndex:1}).rawYNative,-35);
 assert.equal(prepareNativeAITail({...q,trainingSelection:3}).rawXNative,12);
});

test('Sunny Stunt requests use navigation2948 edge and one shared previous-navigation word',()=>{
 const q={...tail,flag9c:0};
 assert.deepEqual(prepareNativeAITail(q),{rawXNative:12,rawYNative:-70,action16f4:2,fieldE0:2,previousNavigationGlobal:7});
 assert.equal(prepareNativeAITail({...q,previousNavigationGlobal:7}).rawYNative,-35);
 const next=prepareNativeAITail({...q,navigation2948:13,previousNavigationGlobal:7});
 assert.deepEqual(next,{rawXNative:12,rawYNative:70,action16f4:1,fieldE0:2,previousNavigationGlobal:13});
 assert.equal(prepareNativeAITail({...q,racerIndex:1,navigation2948:13,previousNavigationGlobal:next.previousNavigationGlobal}).action16f4,0);
 assert.equal(prepareNativeAITail({...q,mode620:4}).action16f4,0);
});

test('actions are detached pure snapshots and reject malformed physical/control payloads',()=>{
 const input=structuredClone(tail),before=structuredClone(input);
 Object.freeze(input.positionNative);Object.freeze(input);
 const result=prepareNativeAITail(input);
 assert.deepEqual(input,before);assert.ok(Object.isFrozen(result));
 assert.throws(()=>prepareNativeAITail({...tail,bodyUpY:NaN}),/binary32/);
 assert.throws(()=>prepareNativeAITrainingAction({...action,firstCircleAction:4}),/integer/);
 assert.throws(()=>prepareNativeAIButtons({...buttons,trafficBlocked:1}),/boolean/);
 assert.throws(()=>prepareNativeAIButtons({...buttons,heldButtons:65536}),/integer/);
 assert.throws(()=>prepareNativeAIWaterTrim({...trim,waterHeightsNative:[0]}),/center and ahead/);
 assert.throws(()=>prepareNativeAIWaterTrim({...trim,waterHeightsNative:Array(2)}),/binary32/);
 assert.throws(()=>prepareNativeAIWaterTrim({...trim,datumNative:.5}),/integer/);
 assert.throws(()=>prepareNativeAIWaterTrim({...trim,rawYNative:128}),/integer/);
 assert.throws(()=>nativeAICameraContains({cameraCornersNative:[...cameraCornersNative.slice(0,3),{x:32768,z:0}],positionNative:{x:0,z:0}}),/integer/);
 assert.throws(()=>nativeAITrafficBlocked({cameraCornersNative,racerIndex:1,racers:[{positionNative:{x:0,z:0},frameSpeedNative:0}]}),/integer/);
});
