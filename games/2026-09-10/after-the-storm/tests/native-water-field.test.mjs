import test from 'node:test';
import assert from 'node:assert/strict';
import {NATIVE_WATER_GRID,nativeWaterFieldParameters,createNativeWaterField,nativeWaterVertexIndex,
  locateNativeWaterCell,createNativeWaterPatch,stepNativeWaterPatch,queryNativeWaterField,
  seedNativeWaterNoise,forceNativeWaterLine} from '../native-water-field.js';
import {nativeWaveCellImpulse} from '../native-water.js';

const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} ≠ ${b}`);
const idx=nativeWaterVertexIndex;
const patch2=f=>createNativeWaterPatch(f,{radius:2});
const fillPatch=(f,p,height,velocity=0)=>{for(const i of p.indices){f.heightQ[i]=height;f.velocityQ[i]=velocity;}};

test('explicit source selectors expose separate patch size and integer evolution parameters',()=>{
  assert.deepEqual(NATIVE_WATER_GRID,{columns:128,rows:384,spacingNative:64,fixedScale:256});
  assert.deepEqual(nativeWaterFieldParameters(),{radius:12,restoringShift:9,couplingShift:5,dampingShift:6});
  assert.deepEqual(nativeWaterFieldParameters({players:2}),{radius:10,restoringShift:9,couplingShift:5,dampingShift:6});
  assert.deepEqual(nativeWaterFieldParameters({variant:2}),nativeWaterFieldParameters({players:2}));
  assert.deepEqual(nativeWaterFieldParameters({variant:1,players:2}),{radius:16,restoringShift:10,couplingShift:4,dampingShift:5});
  assert.ok(Object.isFrozen(nativeWaterFieldParameters()));
});

test('toroidal column wrapping carries rows and preserves the full three-column-period shear',()=>{
  assert.equal(idx(127,0),127);assert.equal(idx(128,0),128*128);
  assert.equal(idx(384,0),idx(0,0));assert.equal(idx(0,384),idx(0,0));
  assert.equal(idx(-1,0),idx(127,256));
  assert.notEqual(idx(128,0),idx(0,0));
  assert.deepEqual(locateNativeWaterCell(32+24576,0),locateNativeWaterCell(32,0));
  assert.notDeepEqual(locateNativeWaterCell(32+8192,0).indices,locateNativeWaterCell(32,0).indices);
});

test('native world lookup truncates before floor selection and chooses the correct triangle',()=>{
  const a=locateNativeWaterCell(19,7),b=locateNativeWaterCell(7,19);
  assert.equal(a.upperTriangle,false);assert.equal(b.upperTriangle,true);
  assert.deepEqual(a.indices,[idx(0,0),idx(1,0),idx(1,1)]);
  assert.deepEqual(b.indices,[idx(0,0),idx(0,1),idx(1,1)]);
  assert.equal(locateNativeWaterCell(-.9,0).integerU,0);
  const negative=locateNativeWaterCell(-1,0);
  assert.equal(negative.cellU,-1);assert.equal(negative.offsetU,-63);
  assert.equal(negative.offsetV,0);
});

test('nearest patch rounding has the source negative tie behavior and finite hexagonal topology',()=>{
  const f=createNativeWaterField(),p=createNativeWaterPatch(f),small=patch2(f);
  assert.equal(p.indices.length,469);assert.equal(p.edgeCount,1332);
  assert.equal(small.indices.length,19);assert.equal(small.edgeCount,42);
  assert.equal(new Set(p.indices).size,p.indices.length);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.indices));
  assert.equal(createNativeWaterPatch(f,{xNative:-32}).centerU,0);
  assert.equal(createNativeWaterPatch(f,{xNative:-33}).centerU,-1);
  assert.deepEqual(createNativeWaterPatch(f,{xNative:17,zNative:0}).snappedCenterNative,{x:0,z:0});
  assert.throws(()=>createNativeWaterPatch(f,{radius:3}),/even/);
  assert.throws(()=>createNativeWaterPatch(f,{radius:1}),RangeError);
});

test('one central impulse has the analytic six-neighbor acceleration and damping',()=>{
  const f=createNativeWaterField(),p=patch2(f),center=idx(0,0);
  f.heightQ[center]=256;stepNativeWaterPatch(f,p);
  // Each of six incident differences contributes-8Q at the center. Restoring
  // is zero because256>>9=0. Velocity damping uses signed floor arithmetic.
  assert.equal(f.heightQ[center],208);assert.equal(f.velocityQ[center],-47);
  for(const [u,v]of [[1,0],[0,1],[1,1],[-1,0],[0,-1],[-1,-1]]){
    assert.equal(f.heightQ[idx(u,v)],8);assert.equal(f.velocityQ[idx(u,v)],8);
  }
  assert.equal(p.indices.reduce((sum,i)=>sum+f.heightQ[i],0),256);
  assert.equal(f.patchUpdates,1);
});

test('uniform elevated water has restoring acceleration set by local degree',()=>{
  const f=createNativeWaterField(),p=patch2(f);fillPatch(f,p,20*256);
  stepNativeWaterPatch(f,p);
  // Pair restoring=(5120+5120)>>9=20Q. Center degree6; corner degree3.
  assert.equal(f.heightQ[idx(0,0)],5120-120);assert.equal(f.velocityQ[idx(0,0)],-118);
  assert.equal(f.heightQ[idx(-2,-2)],5120-60);assert.equal(f.velocityQ[idx(-2,-2)],-59);
});

test('signed damping retains its asymmetric one-quantum boundary rather than a float multiplier',()=>{
  const positive=createNativeWaterField(),negative=createNativeWaterField();
  positive.velocityQ[idx(0,0)]=63;negative.velocityQ[idx(0,0)]=-1;
  stepNativeWaterPatch(positive,patch2(positive));stepNativeWaterPatch(negative,patch2(negative));
  assert.equal(positive.heightQ[idx(0,0)],63);assert.equal(positive.velocityQ[idx(0,0)],63);
  assert.equal(negative.heightQ[idx(0,0)],-1);assert.equal(negative.velocityQ[idx(0,0)],0);
});

test('integer storage wraps after force accumulation and height integration',()=>{
  const f=createNativeWaterField(),p=patch2(f);fillPatch(f,p,32760);
  f.velocityQ[idx(0,0)]=32760;stepNativeWaterPatch(f,p);
  // Six pairs each restore127Q, leaving31998Q velocity. h+v=64758
  // wraps to-778 in signed16 storage, independently of velocity damping.
  assert.equal(f.heightQ[idx(0,0)],-778);assert.equal(f.velocityQ[idx(0,0)],31499);
});

test('finite patch leaves all outside cells unchanged and shared overlaps really update twice',()=>{
  const f=createNativeWaterField(),p=patch2(f),outside=idx(40,40);
  f.heightQ[outside]=1234;f.velocityQ[outside]=-567;
  f.heightQ[idx(0,0)]=256;stepNativeWaterPatch(f,p);
  const once=f.heightQ[idx(0,0)];stepNativeWaterPatch(f,p);
  assert.notEqual(f.heightQ[idx(0,0)],once);assert.equal(f.patchUpdates,2);
  assert.equal(f.heightQ[outside],1234);assert.equal(f.velocityQ[outside],-567);
});

test('explicit patch ordering matters when neighboring camera patches overlap',()=>{
  const make=()=>{const f=createNativeWaterField();for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=(i*37)%4096-2048;return f;};
  const a=make(),b=make(),a0=createNativeWaterPatch(a,{radius:2}),a1=createNativeWaterPatch(a,{radius:2,xNative:64});
  const b0=createNativeWaterPatch(b,{radius:2}),b1=createNativeWaterPatch(b,{radius:2,xNative:64});
  stepNativeWaterPatch(a,a0);stepNativeWaterPatch(a,a1);
  stepNativeWaterPatch(b,b1);stepNativeWaterPatch(b,b0);
  assert.notDeepEqual(a.heightQ,b.heightQ);
});

test('flat source query uses signed whole-height quantization and the explicit datum',()=>{
  const f=createNativeWaterField({datumNative:-100});f.heightQ.fill(3*256+125);
  let q=queryNativeWaterField(f,19,7);
  assert.equal(q.sourcePlaneQueryNative,-97);assert.equal(q.renderHeightNative,-97);
  assert.deepEqual(q.samplesNative,[3,3,3]);
  f.heightQ.fill(-1);q=queryNativeWaterField(f,19,7);
  assert.equal(q.sourcePlaneQueryNative,-101);assert.equal(q.renderHeightNative,-101);
});

test('source normalized query and rendered height remain explicitly different on a slope',()=>{
  const f=createNativeWaterField();f.heightQ[idx(1,0)]=64*256;f.heightQ[idx(1,1)]=64*256;
  const q=queryNativeWaterField(f,32,0);
  assert.equal(q.renderHeightNative,32);
  close(q.sourcePlaneQueryNative,Math.fround(2048/Math.fround(Math.sqrt(33554432))),1e-8);
  assert.deepEqual(q.cell,{h00:0,slopeU:-64,slopeV:0,offsetU:-32,offsetV:0,referenceHeight:0});
});

test('rendered vertex storage wraps separately from the physics datum query',()=>{
  const f=createNativeWaterField({datumNative:-32768});f.heightQ.fill(-1);
  const q=queryNativeWaterField(f,19,7);
  assert.equal(q.sourcePlaneQueryNative,-32769);assert.equal(q.renderHeightNative,32767);
  assert.deepEqual(q.renderVertexHeightsNative,[32767,32767,32767]);
});

test('raw field-cell parameters compose with the recovered native buoyancy function',()=>{
  const f=createNativeWaterField({datumNative:-100});f.heightQ.fill(20*256);
  const q=queryNativeWaterField(f,19,7),response=nativeWaveCellImpulse({...q.cell,pointY:-87,k:.03,maxPairLengthNative:100});
  assert.equal(response.wet,true);close(response.immersion,7);close(response.velocity.y,.21);
  assert.equal(response.velocity.x,0);assert.equal(response.velocity.z,0);
});

test('two amplitude20 noise passes have the source input envelope and no invented random seed',()=>{
  const low=createNativeWaterField(),high=createNativeWaterField();
  assert.throws(()=>seedNativeWaterNoise(low),/explicit random15/);
  const lowStats=seedNativeWaterNoise(low,{random15:()=>0});
  const highStats=seedNativeWaterNoise(high,{random15:()=>32767});
  assert.deepEqual(lowStats,{amplitudeNative:20,randomCalls:98316});assert.deepEqual(highStats,lowStats);
  assert.ok(low.heightQ.every(h=>h===-40*256));assert.ok(high.heightQ.every(h=>h===40*256));
  assert.ok(high.velocityQ.every(v=>v===0));
});

test('noise refresh keeps five seeded terms for each pass rather than drawing six new values per vertex',()=>{
  const f=createNativeWaterField();let calls=0;
  seedNativeWaterNoise(f,{random15:()=>++calls===2?32767:0});
  assert.ok(f.heightQ.every(h=>h===-33*256));assert.equal(calls,98316);
});

test('noise passes traverse column then row in their independently specified order',()=>{
  const f=createNativeWaterField();let calls=0;
  // First-pass fresh draws7/8 affect(0,0)/(0,1); second-pass draw49166
  // affects(1,0). Every other fresh/seed term is zero.
  seedNativeWaterNoise(f,{random15:()=>[7,8,49166].includes(++calls)?32767:0});
  for(const i of [0,128,1])assert.equal(f.heightQ[i],-33*256);
  assert.equal(f.heightQ[2],-40*256);assert.equal(f.heightQ[129],-40*256);
});

test('source forcing overwrites three-vertex diagonal samples and clears only their velocity',()=>{
  const f=createNativeWaterField();f.heightQ.fill(-5*256);f.velocityQ.fill(9*256);
  const result=forceNativeWaterLine(f,{xNative:0,zNative:0,sineLookup:()=>1});
  assert.equal(result.heightNative,20);assert.equal(result.heightQ,20*256);
  assert.equal(result.lineSamples,7);assert.equal(result.phaseCounter,1);assert.equal(result.sineIndex,204);
  assert.equal(result.writtenIndices.length,18);
  for(const i of result.writtenIndices){assert.equal(f.heightQ[i],20*256);assert.equal(f.velocityQ[i],0);}
  assert.equal(f.heightQ[idx(40,40)],-5*256);assert.equal(f.velocityQ[idx(40,40)],9*256);
});

test('forcing phase wrap and a second non-advancing line retain explicit source phase ownership',()=>{
  const f=createNativeWaterField({phaseCounter:19});
  const first=forceNativeWaterLine(f,{xNative:0,zNative:0});
  assert.equal(first.phaseCounter,0);assert.equal(first.sineIndex,0);assert.equal(first.heightQ,0);
  const second=forceNativeWaterLine(f,{xNative:100,zNative:100,advance:0});
  assert.equal(second.phaseCounter,0);assert.equal(second.sineIndex,0);assert.equal(f.forcingCalls,2);
  const prepared=createNativeWaterField({phaseCounter:3});
  const third=forceNativeWaterLine(prepared,{xNative:0,zNative:0,sineLookup:()=>.123});
  assert.equal(third.heightNative,2,'forcing truncates, rather than rounds, the sine-scaled amplitude');
  const tiny=forceNativeWaterLine(prepared,{xNative:0,zNative:0,sineLookup:()=>-.001});
  assert.equal(tiny.heightNative,0,'source integer zero must not become JS negative zero');
});

test('amplitude20 forcing is not a kernel height clamp',()=>{
  const f=createNativeWaterField(),p=patch2(f);fillPatch(f,p,20*256);f.velocityQ[idx(0,0)]=3*256;
  stepNativeWaterPatch(f,p);
  close(f.heightQ[idx(0,0)]/256,22.53125);
  assert.ok(f.heightQ[idx(0,0)]>20*256);
});

test('invalid callers cannot silently change field state or force a guessed schedule',()=>{
  const f=createNativeWaterField();f.heightQ[0]=123;f.velocityQ[0]=456;
  const h=new Int16Array(f.heightQ),v=new Int16Array(f.velocityQ);
  assert.throws(()=>stepNativeWaterPatch(f,{radius:12,indices:[]}),/createNativeWaterPatch/);
  assert.throws(()=>forceNativeWaterLine(f,{xNative:0,zNative:0,period:0}),RangeError);
  assert.throws(()=>forceNativeWaterLine(f,{xNative:0,zNative:0,sineLookup:()=>2}),RangeError);
  assert.throws(()=>locateNativeWaterCell(Infinity,0),TypeError);
  assert.throws(()=>createNativeWaterField({players:3}),RangeError);
  let calls=0;assert.throws(()=>seedNativeWaterNoise(f,{random15:()=>++calls===12?NaN:0}),RangeError);
  assert.deepEqual(f.heightQ,h);assert.deepEqual(f.velocityQ,v);
  assert.equal(f.phaseCounter,0);assert.equal(f.patchUpdates,0);assert.equal(f.forcingCalls,0);
});
