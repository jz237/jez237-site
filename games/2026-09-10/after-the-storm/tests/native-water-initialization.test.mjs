import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {prepareNativeWaterInitialization} from '../native-water-initialization.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceWaterInitialization} from '../native-race-state.js';
import {stepNativeAIRandom} from '../native-ai-initialization.js';

function gridHash(result){
 const packed=Buffer.alloc(49152*4);
 for(let i=0;i<49152;i++){packed.writeInt16BE(result.heightQ[i],i*4);packed.writeInt16BE(result.velocityQ[i],i*4+2);}
 return createHash('sha256').update(packed).digest('hex');
}
function state(extra={}){return createNativeRaceState({raceWords1f94:Array.from({length:1693},(_,i)=>(0x8a123456+i)>>>0),
 hudWords7788:Array.from({length:1442},(_,i)=>(0xf1234567+i)>>>0),
 scene:{rngState4640:0xdeadbeef,seed6f00:0xfedc,phase650:3,activity624:-1,...extra}});}

test('both full water passes and shared RNG match original execution for amplitude20',()=>{
 // Digest of all49,152 interleaved signed16 height/velocity pairs from the
 // complete original initializer, with actual RNG and rounding helpers.
 const r=prepareNativeWaterInitialization({amplitudeNative:20,rngState4640:0xdeadbeef});
 assert.equal(gridHash(r),'543cf2203e58cd70f3f59e0adf9e1b704d517b7c04306146d6e68c2c3bb87d27');
 assert.equal(r.rngState4640,4186349699);assert.equal(r.rngCalls,98316);
 assert.equal(r.heightQ.length,49152);assert.equal(r.velocityQ.length,49152);
 assert.ok(r.velocityQ.every(v=>v===0));
 assert.ok(Object.isFrozen(r)&&Object.isFrozen(r.heightQ)&&Object.isFrozen(r.velocityQ));
 assert.throws(()=>{r.heightQ[0]=99;},TypeError);
});

test('canonical water preparation keeps the unsigned shared word and retains the independent HUD seed',()=>{
 const original=state(),before=nativeRaceStateSnapshot(original);
 const r=prepareNativeRaceWaterInitialization(original,{amplitudeNative:20});
 assert.equal(r.state.scene.rngState4640,4186349699);assert.equal(r.state.scene.seed6f00,0xfedc);
 assert.deepEqual(r.state.scene,{...before.scene,rngState4640:4186349699});
 assert.deepEqual(r.state.raceWords1f94,before.raceWords1f94);assert.deepEqual(r.state.hudWords7788,before.hudWords7788);
 assert.deepEqual(r.operations,[{kind:'sourceWordWrite',field:'rngState4640',value:4186349699}]);
 assert.deepEqual(r.effects,[]);assert.deepEqual(r.diagnostic,{rngCalls:98316});
 assert.equal(gridHash(r.water),'543cf2203e58cd70f3f59e0adf9e1b704d517b7c04306146d6e68c2c3bb87d27');
 assert.deepEqual(nativeRaceStateSnapshot(original),before);
 // Any following shared-stream caller takes THIS returned word. Scene
 // startup may have intervening callers; none are silently skipped here.
 assert.deepEqual(stepNativeAIRandom(r.state.scene.rngState4640),{rngState:2878108160,value:2878108160});
});

for(const [amplitudeNative,rngState4640,expectedRng,expectedHash]of [
 [0,0,1238451396,'3381de4ca9f3a477f25989dfc8b744e7916046b7aa369f61a9a2f7dc0963ec9e'],
 [1,0xffffffff,2886210707,'3381de4ca9f3a477f25989dfc8b744e7916046b7aa369f61a9a2f7dc0963ec9e'],
 [127,1,3885659381,'ee10517b909fd9c2bc7919731d7c2f0dfc1253ba3155b6304a1899b3175cea11']]){
 test(`whole original initializer matches amplitude${amplitudeNative} and explicit shared seed${rngState4640}`,()=>{
  const r=prepareNativeWaterInitialization({amplitudeNative,rngState4640});
  assert.equal(r.rngState4640,expectedRng);assert.equal(r.rngCalls,98316);assert.equal(gridHash(r),expectedHash);
  if(amplitudeNative===0)assert.ok(r.heightQ.every(v=>v===0)&&r.velocityQ.every(v=>v===0));
 });
}

test('shared32-bit operations preserve high bits without changing signed source-word semantics',()=>{
 const original=state({rngState4640:0});
 const r=prepareNativeRaceStateOperations(original,[{kind:'sourceWordWrite',field:'rngState4640',value:0xffffffff},
  {kind:'sourceWordWrite',field:'state600',value:0xffffffff}]);
 assert.equal(r.state.scene.rngState4640,0xffffffff);assert.equal(r.state.scene.state600,-1);
 assert.equal(original.scene.rngState4640,0);
 assert.deepEqual(createNativeRaceState(nativeRaceStateSnapshot(r.state)),r.state);
});

test('actual amplitude and shared seed are explicit and invalid preparation leaves retained state intact',()=>{
 for(const input of [undefined,null,[],{}, {amplitudeNative:20}, {rngState4640:0}])
  assert.throws(()=>prepareNativeWaterInitialization(input));
 for(const amplitudeNative of [-1,128,.5,NaN,Infinity])
  assert.throws(()=>prepareNativeWaterInitialization({amplitudeNative,rngState4640:0}),/amplitudeNative/);
 for(const rngState4640 of [-1,0x100000000,.5,NaN,Infinity])
  assert.throws(()=>prepareNativeWaterInitialization({amplitudeNative:20,rngState4640}),/rngState4640/);
 const original=state(),before=nativeRaceStateSnapshot(original);
 assert.throws(()=>prepareNativeRaceWaterInitialization(original),/amplitudeNative/);
 assert.deepEqual(nativeRaceStateSnapshot(original),before);
 const missing=state();const snapshot=nativeRaceStateSnapshot(missing);delete snapshot.scene.rngState4640;
 assert.throws(()=>prepareNativeRaceWaterInitialization(createNativeRaceState(snapshot),{amplitudeNative:0}),/rngState4640/);
});
