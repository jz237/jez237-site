import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRiderWipeoutPose,physicalPoseHistoryTargets} from '../native-rider-wipeout-pose.js';
import {createNativeArticulatedRider,stepNativeArticulatedRider} from '../native-articulated-rider.js';
import {createNativeRiderAnchors,stepNativeRiderAnchors} from '../native-rider-anchors.js';

const v=([x,y,z])=>({x,y,z}),rows=p=>p.map(v),triples=p=>p.map(({x,y,z})=>[x,y,z]);
const scaleRows=(p,s)=>p.map(q=>({x:q.x*s,y:q.y*s,z:q.z*s}));
const ZERO={x:0,y:0,z:0},UP={x:0,y:1,z:0},FORWARD={x:0,y:0,z:1},RIGHT={x:1,y:0,z:0};
// An independently authored synthetic rig. These are not source animation or
// mesh records. Expected numbers below were checked against bounded original
// instruction execution on this rig, including render-pose normalization.
const RIG=rows([[0,75,2],[0,50,2],[0,35,4],[-7,48,2],[-15,42,7],[-20,35,10],[-21,32,14],
  [-3,32,5],[-4,17,8],[-4,1,10],[-4,0,20],[7,48,2],[15,42,7],[20,35,10],[21,32,14],
  [3,32,5],[4,17,8],[4,1,10],[4,0,20]]);
const GOLDEN=rows([[0,70.85581970214844,2.002157211303711],[0,45.85595703125,2.0858726501464844],
  [0,31.5,4],[-7,43.93634796142578,2.341820478439331],[-14.055652618408203,40.679508209228516,5.890573501586914],
  [-21.34918212890625,34.188697814941406,9.635257720947266],[-23.14645767211914,32.20916748046875,11.893854141235352],
  [-3.132999897003174,28.80819320678711,4.451963901519775],[-4.212118148803711,12.003618240356445,8.253673553466797],
  [-4.327093601226807,-6.701353073120117,10.678525924682617],[-4.437839984893799,-8.78622055053711,20.458148956298828],
  [7,43.93634796142578,2.341820478439331],[14.055652618408203,40.679508209228516,5.890573501586914],
  [21.34918212890625,34.188697814941406,9.635257720947266],[23.14645767211914,32.20916748046875,11.893854141235352],
  [3.132999897003174,28.80819320678711,4.451963901519775],[4.212118148803711,12.003618240356445,8.253673553466797],
  [4.327093601226807,-6.701353073120117,10.678525924682617],[4.437839984893799,-8.78622055053711,20.458148956298828]]);
const AUX=rows([[0,0,0],[0,13,37],[0,13,-4.0709991455078125],
  [10.135000228881836,13,-5.938540935516357],[-10.135000228881836,13,-5.938540935516357],[0,0,10]]);
const request=(overrides={})=>({positions:RIG,storedDeltas:RIG.map(()=>({...ZERO})),
  center:ZERO,forward:FORWARD,up:UP,right:RIGHT,scale:1,...overrides});
const close=(actual,expected,epsilon=1e-6)=>assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);

test('actor23 complete synthetic target fixture matches source float order',()=>{
  const prepared=prepareNativeRiderWipeoutPose(request());
  assert.deepEqual(prepared.targets,GOLDEN);
  assert.deepEqual(prepared.auxiliaryTargets,AUX);
  assert.equal(prepared.nextAnimationFrame,0);
});

test('physical stored displacement is retained before the once-frame world-Y drop',()=>{
  const p=prepareNativeRiderWipeoutPose(request({storedDeltas:RIG.map(()=>({x:2,y:-1,z:3}))}));
  assert.deepEqual(p.targets[2],{x:Math.fround(2*Math.fround(.95)),y:Math.fround(Math.fround(35-Math.fround(.95))-3.5),z:Math.fround(4+Math.fround(3*Math.fround(.95)))});
  // This is neither an input velocity nor five separate gravity applications.
  assert.equal(prepareNativeRiderWipeoutPose(request()).targets[2].y,31.5);
});

test('hull roll moves support targets while ballistic fall remains world vertical',()=>{
  const a=.47,prepared=prepareNativeRiderWipeoutPose(request({center:{x:350.5,y:-31.7,z:-811.9},
    right:{x:Math.cos(a),y:Math.sin(a),z:0},up:{x:-Math.sin(a),y:Math.cos(a),z:0}}));
  assert.deepEqual(prepared.targets,GOLDEN);
  assert.deepEqual(triples(prepared.auxiliaryTargets),[
    [350.5,-31.700000762939453,-811.9000244140625],
    [344.61248779296875,-20.1096134185791,-774.9000244140625],
    [344.61248779296875,-20.1096134185791,-815.9710083007812],
    [353.6485290527344,-15.519611358642578,-817.8385620117188],
    [335.5764465332031,-24.699615478515625,-817.8385620117188],
    [350.5,-31.700000762939453,-801.9000244140625]]);
});

test('world conversion surrounds source arithmetic without scaling unit axes',()=>{
  for(const scale of [.025,.05,1]){
    const prepared=prepareNativeRiderWipeoutPose(request({positions:scaleRows(RIG,scale),scale}));
    assert.deepEqual(prepared.targets,scaleRows(GOLDEN,scale));
    assert.deepEqual(prepared.auxiliaryTargets,scaleRows(AUX,scale));
  }
});

test('lower-Y clamp applies to prediction before body fitting',()=>{
  const positions=RIG.map(p=>({...p,y:p.y-15999}));
  const prepared=prepareNativeRiderWipeoutPose(request({positions,center:{x:0,y:-15999,z:0}}));
  assert.deepEqual(prepared.targets[9],{x:-4.348191738128662,y:-16005.6689453125,z:10.911287307739258});
  assert.equal(prepared.targets[2].y,-15967.5);
  assert.ok(prepared.targets[9].y<-16000);
});

test('history reconstruction preserves solved torso and normalizes fixed endpoint extensions',()=>{
  const h=physicalPoseHistoryTargets({positions:RIG,auxiliaryPositions:AUX,scale:1});
  assert.deepEqual(h.historyTargets[2],RIG[2]);
  assert.deepEqual(h.historyTargets[0],RIG[0]);
  // The deliberately authored hand-to-wrist separation is not 3.5 native units.
  assert.notDeepEqual(h.historyTargets[6],RIG[6]);
  const wrist=RIG[5],hand=h.historyTargets[6];
  close(Math.hypot(hand.x-wrist.x,hand.y-wrist.y,hand.z-wrist.z),3.5);
  assert.notStrictEqual(h.historyTargets[2],RIG[2]);
  assert.equal(h.auxiliaryHistoryTargets.length,6);
});

test('history source directions can be zero without fabricating an orientation',()=>{
  const points=RIG.map(p=>({...p}));points[0]={...points[1]};
  const aux=Array.from({length:6},()=>({...ZERO}));
  const h=physicalPoseHistoryTargets({positions:points,auxiliaryPositions:aux,scale:1});
  assert.deepEqual(h.historyTargets[0],points[1]);
  assert.deepEqual(h.auxiliaryHistoryTargets,aux);
});

test('preparation and history never mutate or alias caller state',()=>{
  const input=request();const before=structuredClone(input);
  for(const p of [...input.positions,...input.storedDeltas,input.center,input.forward,input.up,input.right])Object.freeze(p);
  Object.freeze(input.positions);Object.freeze(input.storedDeltas);Object.freeze(input);
  const prepared=prepareNativeRiderWipeoutPose(input);
  const h=physicalPoseHistoryTargets({positions:input.positions,auxiliaryPositions:prepared.auxiliaryTargets,scale:1});
  prepared.targets[2].y=999;h.historyTargets[2].y=998;h.auxiliaryHistoryTargets[0].x=997;
  assert.deepEqual(input,before);
  assert.equal(prepared.auxiliaryTargets[0].x,0);
});

test('missing, invalid or collapsed geometry rejects without a substitute pose',()=>{
  assert.throws(()=>prepareNativeRiderWipeoutPose(),TypeError);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({positions:RIG.slice(1)})),TypeError);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({storedDeltas:RIG.map(()=>({x:0,y:NaN,z:0}))})),TypeError);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({scale:0})),RangeError);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({up:{x:0,y:2,z:0}})),RangeError);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({positions:RIG.map(()=>({...ZERO}))})),/Collapsed/);
  assert.throws(()=>prepareNativeRiderWipeoutPose(request({center:{x:Number.MAX_VALUE,y:0,z:0}})),RangeError);
  assert.throws(()=>physicalPoseHistoryTargets({positions:RIG,auxiliaryPositions:[]}),TypeError);
});

test('prepared coupled source order lets the actual solved torso cross datum',()=>{
  const scale=.025,positions=scaleRows(RIG,scale),types=Array(19).fill(0);
  const start=prepareNativeRiderWipeoutPose(request({positions,scale}));
  const rider=createNativeArticulatedRider({restTargets:positions,positions,historyTargets:positions,types,scale});
  const auxiliary=createNativeRiderAnchors({positions:start.auxiliaryTargets,
    historyTargets:start.auxiliaryTargets,radiusWorld:41.07099914550781*scale});
  let previous=physicalPoseHistoryTargets({positions,auxiliaryPositions:start.auxiliaryTargets,scale});
  const y=[];
  for(let frame=1;frame<=8;frame++){
    const prepared=prepareNativeRiderWipeoutPose(request({positions:rider.points.map(p=>p.position),
      storedDeltas:rider.points.map(p=>p.storedDelta),scale}));
    stepNativeRiderAnchors(auxiliary,{targets:prepared.auxiliaryTargets,
      historyTargets:previous.auxiliaryHistoryTargets,up:UP,mode:1});
    stepNativeArticulatedRider(rider,{targets:prepared.targets,historyTargets:previous.historyTargets,
      center:ZERO,up:UP,anchors:auxiliary.anchors,types});
    previous=physicalPoseHistoryTargets({positions:rider.points.map(p=>p.position),
      auxiliaryPositions:auxiliary.points.map(p=>p.position),scale});
    y.push(rider.jointWorld.y);
    assert.ok(rider.points.every(p=>Object.values(p.position).every(Number.isFinite)));
  }
  assert.equal(y.findIndex(value=>value<0)+1,4);
  // Prepared original arithmetic on the same authored rig gives this frame4
  // torso Y. Existing constraint helpers use double arithmetic, hence tolerance.
  close(y[3],-4.18681526184082*scale,2e-6);
  assert.ok(y[7]<y[3]);
});
