import test from 'node:test';
import assert from 'node:assert/strict';
import {NATIVE_RIDER_TUNE_DEFAULTS,createNativeRiderControlState,
  prepareNativeRiderControls,finishNativeRiderControls} from '../native-rider-controls.js';
import {createNativeControlState,sampleNativeControls} from '../native-controls.js';

const F=Math.fround,vec=(x=0,y=0,z=0)=>({x,y,z});
const close=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const vectorClose=(a,b,e=1e-7)=>['x','y','z'].forEach(k=>close(a[k],b[k],e));
const fresh=()=>createNativeRiderControlState({baseLateralRetention:.85,baseRollBalance:.03});
const targets=()=>Array.from({length:19},(_,i)=>vec(5*.025,(50+i)*.025,7*.025));
const prepare=(state=fresh(),options={})=>prepareNativeRiderControls(state,options);
const finish=(prepared,options={})=>finishNativeRiderControls(prepared.state,{targets:targets(),center:vec(),up:vec(0,1,0),...options});
const step=(state,options={})=>finishNativeRiderControls(prepare(state,options).state).state;

test('native tune record defaults are explicit five values and require a selected physical profile',()=>{
  assert.deepEqual(NATIVE_RIDER_TUNE_DEFAULTS,{tuneB6c:5,tuneB70:5,tuneB74:5});
  assert.ok(Object.isFrozen(NATIVE_RIDER_TUNE_DEFAULTS));
  const state=fresh();assert.equal(state.crouchFactor,1);
  assert.equal(state.lateralRetention,F(.85));assert.equal(state.rollBalance,F(.03));
  assert.throws(()=>createNativeRiderControlState(),/baseLateralRetention/);
  assert.throws(()=>createNativeRiderControlState({baseLateralRetention:1.1,baseRollBalance:.03}));
});

test('R raises lateral retention and its branch preserves the previous roll-balance value',()=>{
  // Raw-backed preparation fixture: base .85, prior roll .02, held R.
  const state={...fresh(),rollBalance:F(.02)},before=structuredClone(state);
  const a=prepare(state,{heldButtons:0x8010,pressedButtons:0x8010});
  assert.equal(a.lateralRetention,0.9700000286102295);
  assert.equal(a.rollBalance,F(.02));assert.equal(a.gravityNative,F(-.192));
  assert.deepEqual(state,before);assert.equal(a.state.heldButtons,0x8010);
});

test('R release slews once per logical frame and ordinary roll balance restores immediately',()=>{
  let state=step(fresh(),{heldButtons:0x10,pressedButtons:0x10});
  const values=[];
  for(let i=0;i<13;i++){
    const a=prepare(state);values.push(a.lateralRetention);assert.equal(a.rollBalance,F(.03));
    state=finishNativeRiderControls(a.state).state;
  }
  assert.equal(values[0],0.9600000381469727);
  assert.equal(values[1],0.9500000476837158);
  assert.equal(values.at(-1),F(.85));
  assert.equal(state.lateralRetention,F(.85));
});

test('source contact modes use their own retention and roll branches; R has priority',()=>{
  for(const [contactMode,q] of [[1,F(.999)],[2,0.9399999976158142],[99,0.9399999976158142]]){
    const a=prepare(fresh(),{contactMode});assert.equal(a.lateralRetention,q);
    assert.equal(a.rollBalance,F(F(.03)*F(.01)));
    const b=prepare(fresh(),{contactMode,heldButtons:0x10});
    assert.equal(b.lateralRetention,0.9700000286102295);assert.equal(b.rollBalance,F(.03));
  }
});

test('B begins only on a fresh press in ordinary actor22 when its factor is exactly one',()=>{
  for(const actorState of [7,8,9,17,23,24,25]){
    const a=prepare(fresh(),{actorState,heldButtons:0x4000,pressedButtons:0x4000});
    assert.equal(a.enteredCrouch,false);assert.equal(a.crouchFactor,1);
  }
  assert.equal(prepare(fresh(),{heldButtons:0x4000}).enteredCrouch,false);
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  assert.equal(a.enteredCrouch,true);assert.equal(a.crouchFactor,F(.9));
  assert.equal(a.gravityNative,-0.3360000550746918);
});

test('held B completes eleven binary32 frames and does not automatically restart',()=>{
  let state=fresh();const factors=[],gravity=[];
  for(let i=0;i<13;i++){
    const a=prepare(state,{heldButtons:0x4000,pressedButtons:i===0?0x4000:0});
    factors.push(a.crouchFactor);gravity.push(a.gravityNative);
    state=finishNativeRiderControls(a.state).state;
  }
  assert.deepEqual(factors.slice(0,4),[0.8999999761581421,0.9099999666213989,0.9199999570846558,0.9299999475479126]);
  assert.equal(factors[9],0.9899998903274536);
  assert.equal(factors[10],0.9999998807907104);assert.equal(factors[11],1);
  assert.equal(gravity[10],-0.19200018048286438);assert.equal(gravity[11],F(-.192));
});

test('B release still affects its current frame and resets only after post-hull preprocessing',()=>{
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  const b=finish(a),release=prepare(b.state);
  assert.equal(release.crouchFactor,0.9099999666213989);
  assert.ok(release.gravityNative<F(-.192));
  const released=finish(release);assert.equal(released.state.crouchFactor,1);
  assert.ok(released.targets[0].y<targets()[0].y);
  assert.equal(prepare(released.state).gravityNative,F(-.192));
  const restart=prepare(released.state,{heldButtons:0x4000,pressedButtons:0x4000});
  assert.equal(restart.enteredCrouch,true);
});

test('a second B edge during an active effect does not restart its factor',()=>{
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  const state=finishNativeRiderControls(a.state).state;
  const b=prepare(state,{heldButtons:0x4000,pressedButtons:0x4000});
  assert.equal(b.enteredCrouch,false);assert.equal(b.crouchFactor,state.crouchFactor);
});

test('B physical targets and manipulation deltas match bounded native fixtures in world units',()=>{
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  const input=targets(),before=structuredClone(input),result=finish(a,{targets:input});
  // Independent raw fixture at native current target[5,50,7]: B target Y
  // becomes45.01806640625; per-joint manipulation increment is−1.1000000238.
  vectorClose(result.targets[0],vec(.125,45.01806640625*.025,.175),1e-12);
  vectorClose(result.manipulationDeltas[0],vec(0,F(-1.1)*.025,0),1e-12);
  assert.equal(result.targets.length,19);assert.equal(result.manipulationDeltas.length,19);
  assert.deepEqual(input,before);result.targets[0].x=999;assert.equal(input[0].x,.125);
  result.manipulationDeltas[0].y=999;assert.equal(result.manipulationDeltas[1].y,F(-1.1)*.025);
});

test('B target compression follows hull up and scales explicitly',()=>{
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  const native=Array.from({length:19},()=>vec(5,50,7));
  const normal=finish(a,{targets:native,scale:1});
  const turn=p=>vec(-p.y+100,p.x-20,p.z+30);
  const rotated=finish(a,{targets:native.map(turn),center:turn(vec()),up:vec(-1,0,0),scale:1});
  for(let i=0;i<19;i++)vectorClose(rotated.targets[i],turn(normal.targets[i]),1e-5);
  vectorClose(rotated.manipulationDeltas[0],vec(-F(-1.1),0,0));
});

test('inactive target preprocessing preserves caller precision and returns independent zero deltas',()=>{
  const p=targets();p[0].x=1/3;
  const result=finish(prepare(),{targets:p});assert.deepEqual(result.targets,p);
  assert.notEqual(result.targets,p);assert.notEqual(result.targets[0],p[0]);
  assert.ok(result.manipulationDeltas.every(v=>v.x===0&&v.y===0&&v.z===0));
});

test('gravity is final after native rider dry and actor multipliers, including active B',()=>{
  for(let riderIndex=0;riderIndex<4;riderIndex++)for(const wet of [false,true])for(const actorState of [22,23]){
    let expected=F(-.192);
    if(!wet&&riderIndex===1)expected=F(expected*F(1.2));
    else if(!wet&&riderIndex===2)expected=F(expected*F(.9));
    if(actorState===23)expected=F(expected*F(.7));
    assert.equal(prepare(fresh(),{riderIndex,wet,actorState}).gravityNative,expected);
  }
  assert.equal(prepare(fresh(),{riderIndex:1,wet:false,heldButtons:0x4000,pressedButtons:0x4000}).gravityNative,
    F(F(F(-.192)*F(1.2))*F(F(F(1-F(.9))*F(7.5))+1)));
});

test('sampled A/Z engine and B/R physical channels remain independent',()=>{
  let raw=createNativeControlState(),physical=fresh();
  for(const heldButtons of [0xe010,0xe010,0xa010,0]){
    const sample=sampleNativeControls(raw,{heldButtons});raw=sample.state;
    const result=prepare(physical,{heldButtons:sample.heldButtons,pressedButtons:sample.pressedButtons});
    assert.equal(sample.throttle,!!(heldButtons&0xa000));
    physical=finishNativeRiderControls(result.state).state;
  }
  assert.equal(physical.crouchFactor,1);
});

test('no-target finish supports explicit adapters without physical riders and advances the same lifecycle',()=>{
  const a=prepare(fresh(),{heldButtons:0x4000,pressedButtons:0x4000});
  const noPose=finishNativeRiderControls(a.state),withPose=finish(a);
  assert.equal(noPose.targets,null);assert.equal(noPose.manipulationDeltas,null);
  assert.deepEqual(noPose.state,withPose.state);
});

test('independent craft states and serializable replay state preserve R/B lifecycle',()=>{
  const other=fresh(),initial=structuredClone(other);
  const a=prepare(other,{heldButtons:0x4010,pressedButtons:0x4010});
  const b=finishNativeRiderControls(a.state);
  assert.deepEqual(other,initial);assert.ok(Object.isFrozen(b.state));
  const restored=JSON.parse(JSON.stringify(b.state));
  assert.deepEqual(prepare(restored,{heldButtons:0x4010}),prepare(b.state,{heldButtons:0x4010}));
  assert.equal(prepare(fresh()).crouchFactor,1);
});

test('invalid fields or phase changes reject before mutating caller state or pose',()=>{
  const state=fresh(),before=structuredClone(state);
  for(const options of [{heldButtons:65536},{pressedButtons:0x4000},{actorState:.5},{riderIndex:4},
    {wet:1},{contactMode:-1}])assert.throws(()=>prepare(state,options));
  const a=prepare(state),p=targets(),saved=structuredClone(p);
  assert.throws(()=>prepare(a.state),/ready/);
  assert.throws(()=>finishNativeRiderControls(state),/prepared/);
  assert.throws(()=>finish(a,{heldButtons:0x10}),/frame-sampled/);
  assert.throws(()=>finish(a,{targets:p.slice(1)}),/nineteen/);
  assert.throws(()=>finish(a,{up:vec(0,2,0)}),/unit/);
  assert.throws(()=>finish(a,{scale:0}),/positive/);
  assert.throws(()=>finish(a,{center:vec(NaN,0,0)}),/finite/);
  assert.deepEqual(state,before);assert.deepEqual(p,saved);
});
