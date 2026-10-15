import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRiderStumblePose} from '../native-rider-stumble-pose.js';

const rows=p=>p.map(([x,y,z])=>({x,y,z})),ZERO={x:0,y:0,z:0};
// Independently authored physical rig, never original animation/mesh records.
// These25 expected targets were checked against the complete common source
// producer and its subsequent pose-to-physical import on this synthetic input.
const RIG=rows([[0,75,2],[0,50,2],[0,35,4],[-7,48,2],[-15,42,7],[-20,35,10],[-21,32,14],
  [-3,32,5],[-4,17,8],[-4,1,10],[-4,0,20],[7,48,2],[15,42,7],[20,35,10],[21,32,14],
  [3,32,5],[4,17,8],[4,1,10],[4,0,20]]);
const GOLDEN=rows([[0,32.102394104003906,21.963218688964844],[0,32.102394104003906,-3.0367815494537354],
  [0,29.86080551147461,11.271700859069824],[2.3597357273101807,31.802658081054688,-1.1235194206237793],
  [8.71015739440918,26.341896057128906,-2.807292938232422],[8.83347225189209,16.147441864013672,-5.132537841796875],
  [10.135000228881836,13.000000953674316,-5.938540458679199],[3.133000135421753,29.084423065185547,8.654961585998535],
  [7.22681188583374,13.629348754882812,15.16592025756836],[-3.500000238418579,-1,10],
  [-1.1285631656646729,-9.952716827392578,13.771626472473145],[-2.3597357273101807,31.802658081054688,-1.1235194206237793],
  [-8.71015739440918,26.341896057128906,-2.807292938232422],[-8.83347225189209,16.147441864013672,-5.132537841796875],
  [-10.135000228881836,13.000000953674316,-5.938540458679199],[-3.133000135421753,29.084423065185547,8.654961585998535],
  [-7.22681188583374,13.629348754882812,15.16592025756836],[3.500000238418579,-1,10],
  [1.1285631656646729,-9.952716827392578,13.771626472473145]]);
const AUX=rows([[0,0,0],[0,13,37],[0,13,-4.0709991455078125],
  [10.135000228881836,13,-5.938540935516357],[-10.135000228881836,13,-5.938540935516357],[0,0,10]]);
const scaled=(points,s)=>points.map(p=>({x:p.x*s,y:p.y*s,z:p.z*s}));
const request=(overrides={})=>({positions:RIG,storedDeltas:RIG.map(()=>({...ZERO})),center:ZERO,
  up:{x:0,y:1,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},yawForward:{x:0,z:1},
  auxiliaryPivot:{x:0,y:13,z:-4.070999},auxiliaryPivotDelta:ZERO,scale:1,...overrides});
const delta=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const cosine=(a,b)=>(a.x*b.x+a.y*b.y+a.z*b.z)/Math.hypot(a.x,a.y,a.z)/Math.hypot(b.x,b.y,b.z);

test('common actor24 full25target synthetic fixture matches source arithmetic',()=>{
  const r=prepareNativeRiderStumblePose(request());
  assert.deepEqual(r.targets,GOLDEN);assert.deepEqual(r.auxiliaryTargets,AUX);assert.equal(r.nextAnimationFrame,0);
});

test('world position and storedDelta conversion leaves native dimensions explicit',()=>{
  for(const scale of [.025,.05,1]){
    const q=request({positions:scaled(RIG,scale),scale});q.auxiliaryPivot={x:0,y:13*scale,z:-4.070999*scale};
    const r=prepareNativeRiderStumblePose(q);
    assert.deepEqual(r.targets,scaled(GOLDEN,scale));assert.deepEqual(r.auxiliaryTargets,scaled(AUX,scale));
  }
});

test('actual auxiliary pivot history affects support circle and body fitting',()=>{
  const base=prepareNativeRiderStumblePose(request());
  const moved=prepareNativeRiderStumblePose(request({auxiliaryPivot:{x:0,y:70,z:41},auxiliaryPivotDelta:{x:3,y:5,z:-2}}));
  assert.notDeepEqual(moved.auxiliaryTargets[2],base.auxiliaryTargets[2]);
  assert.notDeepEqual(moved.targets[2],base.targets[2]);
  const d=delta(moved.auxiliaryTargets[2],moved.auxiliaryTargets[1]);
  assert.ok(Math.abs(Math.hypot(d.x,d.y,d.z)-41.070999)<1e-5);
  assert.ok(d.y>=0);assert.ok(d.z<0,'forward projection is capped at a negative value');
});

test('head uses explicitly retained yaw record basis independently of fitted torso',()=>{
  const ordinary=prepareNativeRiderStumblePose(request());
  const yaw=prepareNativeRiderStumblePose(request({yawForward:{x:1,z:0}}));
  assert.deepEqual(yaw.targets.slice(1),ordinary.targets.slice(1));
  assert.equal(yaw.targets[0].x,25);assert.equal(yaw.targets[0].y,yaw.targets[1].y);
  assert.equal(yaw.targets[0].z,yaw.targets[1].z);
});

test('toe extension follows source upper-leg direction after knee fitting',()=>{
  const {targets:p}=prepareNativeRiderStumblePose(request());
  for(const [hip,knee,ankle,toe]of [[7,8,9,10],[15,16,17,18]]){
    const extension=delta(p[toe],p[ankle]);
    assert.ok(cosine(extension,delta(p[knee],p[hip]))>.9999999);
    assert.ok(cosine(extension,delta(p[ankle],p[knee]))<.9);
  }
});

test('preparation copies actual state and cannot overwrite physical points/history',()=>{
  const q=request(),before=structuredClone(q);
  for(const p of [...q.positions,...q.storedDeltas,q.center,q.forward,q.up,q.right,q.auxiliaryPivot,q.auxiliaryPivotDelta])Object.freeze(p);
  Object.freeze(q.positions);Object.freeze(q.storedDeltas);
  const r=prepareNativeRiderStumblePose(q);r.targets[2].y=999;r.auxiliaryTargets[2].y=998;
  assert.deepEqual(q,before);
  assert.deepEqual(prepareNativeRiderStumblePose(q),prepareNativeRiderStumblePose(q));
});

test('alternate record-dependent branch is explicitly gated without ordinary fallback',()=>{
  for(const alternateStumble of [1,2,-1,true])assert.throws(()=>prepareNativeRiderStumblePose(request({alternateStumble})),/separate authored/);
});

test('invalid/missing actual physics inputs and undefined collapsed geometry reject',()=>{
  assert.throws(()=>prepareNativeRiderStumblePose(),TypeError);
  assert.throws(()=>prepareNativeRiderStumblePose(request({auxiliaryPivot:undefined})),/auxiliaryPivot/);
  assert.throws(()=>prepareNativeRiderStumblePose(request({auxiliaryPivotDelta:undefined})),/auxiliaryPivotDelta/);
  assert.throws(()=>prepareNativeRiderStumblePose(request({yawForward:undefined})),/yawForward/);
  assert.throws(()=>prepareNativeRiderStumblePose(request({yawForward:{x:0,z:0}})),RangeError);
  assert.throws(()=>prepareNativeRiderStumblePose(request({scale:0})),RangeError);
  assert.throws(()=>prepareNativeRiderStumblePose(request({storedDeltas:RIG.slice(1)})),TypeError);
  assert.throws(()=>prepareNativeRiderStumblePose(request({up:{x:0,y:2,z:0}})),RangeError);
  assert.throws(()=>prepareNativeRiderStumblePose(request({positions:RIG.map(()=>({...ZERO}))})),/Collapsed/);
  assert.throws(()=>prepareNativeRiderStumblePose(request({auxiliaryPivotDelta:{x:0,y:Infinity,z:0}})),TypeError);
});
