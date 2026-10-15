import test from 'node:test';
import assert from 'node:assert/strict';
import {NATIVE_RIDER_ANCHOR_ROLES,nativeRiderAnchorMode,prepareNativeRiderAnchorRest,
  solveNativeRiderAnchors,createNativeRiderAnchors,stepNativeRiderAnchors} from '../native-rider-anchors.js';

const vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>({...p});
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const vectorClose=(a,b,e=1e-10)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
const subtract=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const targets=()=>[vec(-1,0,-1),vec(),vec(.5,.4,1),vec(-.5,.4,1),vec(.5,.4,1),vec(1,0,-1)];
const zero=()=>Array.from({length:6},()=>vec());
const solve=(options={})=>solveNativeRiderAnchors({positions:targets(),targets:targets(),storedDeltas:zero(),
  up:vec(0,1,0),radiusWorld:1,...options});

test('auxiliary rows and recovered actor initializer mode remain separate from point types',()=>{
  assert.deepEqual(NATIVE_RIDER_ANCHOR_ROLES,['supportA','center','pivot','gripA','gripB','supportB']);
  for(const actor of [8,17,18,19,20,21])assert.equal(nativeRiderAnchorMode(actor),0);
  for(const actor of [-1,7,9,22,25])assert.equal(nativeRiderAnchorMode(actor),1);
  assert.throws(()=>nativeRiderAnchorMode(256),RangeError);
});

test('caller-authored rest selects radius without any fixed source or visual neutral joint',()=>{
  const p=targets(),rest=prepareNativeRiderAnchorRest(p);
  close(rest.radiusWorld,Math.hypot(.5,.4,1));assert.ok(Object.isFrozen(rest));
  const state=createNativeRiderAnchors({restTargets:p});p[2].y=999;
  assert.notEqual(state.points[2].position.y,999);assert.equal(state.logicalFrames,0);
  assert.throws(()=>createNativeRiderAnchors(),/six/);
});

test('mode0 copies all six targets without fitting a circle or requiring a hull up axis',()=>{
  const p=targets(),result=solve({targets:p,up:undefined,mode:0});
  assert.deepEqual(result.positions,p);assert.equal(result.branch,'copy');
  vectorClose(result.anchors[2],p[3]);vectorClose(result.anchors[3],p[4]);
  result.positions[3].x=999;assert.notEqual(result.anchors[2].x,999);assert.notEqual(p[3].x,999);
});

test('inside candidate projects to support plane and circle, translating both grips by exactly the same correction',()=>{
  const p=targets(),result=solve(),expected=vec(1/Math.sqrt(5),0,2/Math.sqrt(5));
  assert.equal(result.branch,'planeArc');vectorClose(result.positions[2],expected);
  for(const i of [0,1,5])vectorClose(result.positions[i],p[i]);
  const correction=subtract(expected,p[2]);
  vectorClose(subtract(result.anchors[2],p[3]),correction);
  vectorClose(subtract(result.anchors[3],p[4]),correction);
  vectorClose(subtract(result.anchors[3],result.anchors[2]),subtract(p[4],p[3]));
});

test('outside half-plane clips to signed axis endpoints, while the boundary takes the arc branch',()=>{
  for(const x of [-.5,.5]){
    const p=targets();p[2]=vec(x,.4,-1);const result=solve({targets:p});
    assert.equal(result.branch,x<0?'endpointNegative':'endpointPositive');
    vectorClose(result.positions[2],vec(Math.sign(x),0,0));
  }
  const p=targets();p[2]=vec(.5,.4,0);const result=solve({targets:p});
  assert.equal(result.branch,'planeArc');vectorClose(result.positions[2],vec(1,0,0));
});

test('uncapped target projection retains forty percent up motion and negative history before circle fitting',()=>{
  const p=[vec(-1,-1,0),vec(),vec(100,1,.2),vec(-1,1,.2),vec(1,1,.2),vec(1,-1,0)];
  const current=p.map(copy);current[2]=vec();const delta=zero();delta[2].y=-.5;
  const result=solve({positions:current,targets:p,storedDeltas:delta});
  vectorClose(result.candidate,vec(100,.1,.2));
  delta[2].y=.5;const positive=solve({positions:current,targets:p,storedDeltas:delta});
  vectorClose(positive.candidate,vec(100,.4,.2));
  assert.ok(positive.positions[2].y>result.positions[2].y);
});

test('other explicit nonzero mode fits current pivot without target following',()=>{
  const p=targets(),current=p.map(copy);current[2]=vec(-1,3,1);
  const result=solve({positions:current,mode:2,up:undefined});
  vectorClose(result.candidate,current[2]);vectorClose(result.positions[2],vec(-Math.SQRT1_2,0,Math.SQRT1_2));
});

test('recovered mechanical solve is invariant under rigid rotation, translation and world-unit scaling',()=>{
  const p=targets(),result=solve(),transform=q=>vec(3-q.y,4+q.z,2-q.x);
  const actual=solve({positions:p.map(transform),targets:p.map(transform),up:vec(-1,0,0)});
  for(let i=0;i<6;i++)vectorClose(actual.positions[i],transform(result.positions[i]));
  const scale=q=>vec(q.x*7,q.y*7,q.z*7),scaled=solve({positions:p.map(scale),targets:p.map(scale),radiusWorld:7});
  for(let i=0;i<6;i++)vectorClose(scaled.positions[i],scale(result.positions[i]));
});

test('history output is solved current minus explicit prior rendered targets and remains independent per rider',()=>{
  const p=targets(),a=createNativeRiderAnchors({restTargets:p,radiusWorld:1}),b=createNativeRiderAnchors({restTargets:p,radiusWorld:1});
  const history=p.map(q=>vec(q.x+.2,q.y-.1,q.z+.3));
  stepNativeRiderAnchors(a,{targets:p,historyTargets:history,up:vec(0,1,0)});
  for(let i=0;i<6;i++)vectorClose(a.points[i].storedDelta,subtract(a.points[i].position,history[i]));
  assert.equal(a.logicalFrames,1);assert.equal(b.logicalFrames,0);assert.deepEqual(b.points.map(q=>q.position),p);
});

test('invalid support/candidate geometry and missing history fail before state mutation',()=>{
  const p=targets(),state=createNativeRiderAnchors({restTargets:p,radiusWorld:1}),before=structuredClone(state);
  assert.throws(()=>stepNativeRiderAnchors(state,{targets:p,up:vec(0,1,0)}),/historyTargets/);
  const collapsed=p.map(copy);collapsed[5]=copy(collapsed[0]);
  assert.throws(()=>stepNativeRiderAnchors(state,{targets:collapsed,historyTargets:p,up:vec(0,1,0)}),/support plane/);
  const noDirection=p.map(copy);noDirection[2]=vec();
  assert.throws(()=>solve({positions:noDirection,targets:noDirection}),/pivot direction/);
  assert.deepEqual(state,before);
  assert.throws(()=>solve({up:vec(0,2,0)}),/unit/);assert.throws(()=>solve({radiusWorld:0}),RangeError);
});
