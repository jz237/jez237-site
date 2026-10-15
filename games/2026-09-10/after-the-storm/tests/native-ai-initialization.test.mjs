import test from 'node:test';
import assert from 'node:assert/strict';
import {stepNativeAIRandom,prepareNativeAIInitialization} from '../native-ai-initialization.js';
import {createNativeAIDriverState} from '../native-ai-driver.js';

function input(extra={}){return {rngState:17,racerCount:4,primaryHumanIndex:0,hullProfilesB64:[0,1,2,3],avatarsB68:[3,2,1,0],
 sourceOrder:[3,1,0,2],retainedRoleWords:[11,12,13,14],adjacentRoleWord:0,objectTypes4c:[0,1,2,1],...extra};}
const word=(r,slot,offset)=>r.nativeWordPatches.find(p=>p.slot===slot&&p.offset===offset);
const traits=r=>r.nativeWordPatches.filter(p=>[0x80,0x84,0x88].includes(p.offset));
const rolePatches=r=>r.nativeWordPatches.filter(p=>p.offset===0x5c).map(p=>[p.slot,p.value]);
const initialWords=()=>Array.from({length:4},(_,slot)=>Array.from({length:58},(_,i)=>0x55000000+slot*0x1000+i));
function apply(words,result){const copied=structuredClone(words);for(const p of result.nativeWordPatches)copied[p.slot][p.offset/4]=p.bits;return copied;}

test('shared RNG returns the exact unsigned32 state and result without a hidden seed',()=>{
 // Literal original-instruction results from explicit state0, not a game
 // startup seed or a replacement for other shared-RNG consumers.
 const expected=[12345,3554416254,2802067423,3596950572,229283573,3256818826,1051550459,3441282840];
 let state=0;
 for(const value of expected){const r=stepNativeAIRandom(state);assert.deepEqual(r,{rngState:value,value});assert.ok(Object.isFrozen(r));state=r.rngState;}
 assert.deepEqual(stepNativeAIRandom(0xffffffff),{rngState:3191464396,value:3191464396});
 for(const invalid of [undefined,-1,4294967296,.5,NaN,Infinity])assert.throws(()=>stepNativeAIRandom(invalid),/rngState/);
});

test('four-racer seed17 setup matches the raw role/trait selection and exact draw count',()=>{
 const r=prepareNativeAIInitialization(input());
 assert.equal(r.rngState,3150974849);assert.equal(r.rngCalls,16);
 assert.deepEqual(rolePatches(r),[[0,-1],[1,1],[2,2],[3,0]]);
 assert.deepEqual(r.diagnostic.roleAssignments.map(q=>q.selectedIndex),[3,1,2]);
 assert.deepEqual(traits(r).filter(p=>p.value!==0).map(p=>[p.slot,p.offset,p.value]),[[2,0x80,1],[2,0x84,1]]);
 assert.equal(r.adjacentRoleWordPatch,null);assert.deepEqual(r.context,{bodySlot:3,aiSlot:3});
});

test('ordinal, B68 avatar, B64 budget and source role remain four independent quantities',()=>{
 const q=input({hullProfilesB64:[3,0,2,1],avatarsB68:[0,3,1,2]}),r=prepareNativeAIInitialization(q);
 assert.deepEqual(r.driverStatePatches.map(p=>p.racerIndex),[0,1,2,3]);
 assert.deepEqual(r.driverStatePatches.map(p=>p.avatar),[0,3,1,2]);
 assert.deepEqual(r.driverStatePatches.map(p=>p.turnBudgetDegrees),[24,32,32,32]);
 assert.deepEqual(r.driverStatePatches.map(p=>p.role),[-1,1,2,0]);
 for(let slot=0;slot<4;slot++){
  assert.equal(word(r,slot,0).value,slot);assert.equal(word(r,slot,4).value,q.avatarsB68[slot]);
  assert.equal(word(r,slot,0x64).bits,slot===0?0x41c00000:0x42000000);
 }
});

test('unknown signed B64 profiles preserve the actual previous budget by omitting that write',()=>{
 const q=input({hullProfilesB64:[-1,4,2147483647,-2147483648]}),r=prepareNativeAIInitialization(q),before=initialWords(),after=apply(before,r);
 for(let slot=0;slot<4;slot++){
  assert.equal(word(r,slot,0x64),undefined);assert.equal(Object.hasOwn(r.driverStatePatches[slot],'turnBudgetDegrees'),false);
  assert.equal(after[slot][0x64/4],before[slot][0x64/4]);
 }
});

test('the field60 loop writes1.0 only to the retained slot3 context, including a solo scene',()=>{
 for(const racerCount of [1,2,3,4]){
  const r=prepareNativeAIInitialization(input({rngState:17,racerCount,sourceOrder:[3,1,0,2].slice(0,racerCount)}));
  assert.deepEqual(r.nativeWordPatches.filter(p=>p.offset===0x60),[{slot:3,offset:0x60,kind:'f32',value:1,bits:0x3f800000,field:'field60'}]);
  for(const p of r.driverStatePatches)assert.equal(Object.hasOwn(p,'basePowerFactor'),false);
 }
});

test('zero racers still initialize all four stored slots and traits but retain every role and field60',()=>{
 const q=input({rngState:0,racerCount:0,sourceOrder:[],retainedRoleWords:[91,92,93,94],objectTypes4c:[]});delete q.adjacentRoleWord;
 const r=prepareNativeAIInitialization(q);
 assert.equal(r.rngState,3441282840);assert.equal(r.rngCalls,8);assert.deepEqual(rolePatches(r),[]);
 assert.equal(r.nativeWordPatches.some(p=>p.offset===0x60),false);assert.deepEqual(r.inverseOrderPatches,[]);
 assert.deepEqual(r.driverStatePatches.map(p=>p.racerIndex),[0,1,2,3]);
 assert.ok(r.driverStatePatches.every(p=>!Object.hasOwn(p,'role')));
 assert.deepEqual(traits(r).filter(p=>p.value!==0).map(p=>[p.slot,p.offset]),[[0,0x84]]);
 assert.equal(r.cameraBytePatches.length,64);
});

test('one active racer does not clear inactive roles or skip all-slot optional traits',()=>{
 const r=prepareNativeAIInitialization(input({rngState:0,racerCount:1,sourceOrder:[3],retainedRoleWords:[91,92,93,94]}));
 assert.equal(r.rngState,3441282840);assert.equal(r.rngCalls,8);assert.deepEqual(rolePatches(r),[[0,-1]]);
 assert.equal(r.diagnostic.roleAssignments.length,0);assert.equal(traits(r).length,12);
 assert.ok(r.driverStatePatches.slice(1).every(p=>!Object.hasOwn(p,'role')));
});

test('native random role selection can select a retained inactive source slot',()=>{
 const r=prepareNativeAIInitialization(input({rngState:2,racerCount:2,sourceOrder:[2,0],retainedRoleWords:[-1,-1,-1,-1]}));
 assert.equal(r.rngState,4195558694);assert.equal(r.rngCalls,12);
 assert.deepEqual(rolePatches(r),[[0,-1],[1,-1],[3,0]]);
 assert.equal(r.diagnostic.roleAssignments[0].selectedIndex,3);
 assert.deepEqual(traits(r).filter(p=>p.value!==0).map(p=>[p.slot,p.offset]),[[1,0x84],[1,0x88]]);
});

test('source slot4 alias writes are returned separately instead of becoming a fifth racer',()=>{
 const q=input({rngState:3592616142,adjacentRoleWord:-1,objectTypes4c:[]}),r=prepareNativeAIInitialization(q);
 assert.deepEqual(r.adjacentRoleWordPatch,{value:2,bits:2});assert.deepEqual(rolePatches(r),[[0,-1],[1,-1],[2,0],[3,1]]);
 assert.equal(r.diagnostic.roleAssignments[2].selectedIndex,4);
 assert.equal(r.driverStatePatches.length,4);assert.ok(r.nativeWordPatches.every(p=>p.slot<4));
 const occupied=prepareNativeAIInitialization({...q,adjacentRoleWord:0});
 assert.equal(occupied.adjacentRoleWordPatch,null);assert.notDeepEqual(rolePatches(occupied),rolePatches(r));
 assert.equal(occupied.rngState,r.rngState);assert.equal(occupied.rngCalls,r.rngCalls);
});

test('a needed adjacent word is explicit and a repeating source role scan rejects atomically',()=>{
 const missing=input({rngState:3592616142});delete missing.adjacentRoleWord;
 const missingBefore=structuredClone(missing);assert.throws(()=>prepareNativeAIInitialization(missing),/adjacentRoleWord/);assert.deepEqual(missing,missingBefore);
 const repeating=input({rngState:0,racerCount:2,primaryHumanIndex:1,sourceOrder:[3,1],retainedRoleWords:[91,92,93,94],adjacentRoleWord:-1});
 const before=structuredClone(repeating);assert.throws(()=>prepareNativeAIInitialization(repeating),/scan repeats/);assert.deepEqual(repeating,before);
 // No scan reaches that word in this zero-count call; it is not fabricated.
 const zero=input({racerCount:0,sourceOrder:[]});delete zero.adjacentRoleWord;assert.doesNotThrow(()=>prepareNativeAIInitialization(zero));
});

test('source-order inverse writes preserve duplicate order and retain omitted inverse slots',()=>{
 const r=prepareNativeAIInitialization(input({sourceOrder:[0,0,3,3]}));
 assert.deepEqual(r.inverseOrderPatches,[{index:0,value:0},{index:0,value:1},{index:3,value:2},{index:3,value:3}]);
 const prior=[71,72,73,74];for(const p of r.inverseOrderPatches)prior[p.index]=p.value;
 assert.deepEqual(prior,[1,72,73,3]);
 const short=prepareNativeAIInitialization(input({racerCount:1,sourceOrder:[3]}));
 assert.deepEqual(short.inverseOrderPatches,[{index:3,value:0}]);
});

test('proximity setup filters exact type1 indices while leaving the raw prefix scan interpretation separate',()=>{
 const r=prepareNativeAIInitialization(input({objectTypes4c:[0,1,5,1,-1,2,1]}));
 assert.equal(r.proximityCount,3);assert.deepEqual(r.proximityObjectIndicesPrefix,[1,3,6]);
 // This qualifying index prefix is not raw objects0,1,2, which the later
 // source proximity-distance consumer scans using this same count.
 assert.notDeepEqual(r.proximityObjectIndicesPrefix,[0,1,2]);
 assert.equal(prepareNativeAIInitialization(input({objectTypes4c:[]})).proximityCount,0);
 assert.equal(prepareNativeAIInitialization(input({objectTypes4c:Array(64).fill(1)})).proximityCount,64);
});

test('camera patches change exact prefix RGBA and corner Y/RGB, preserving every XZ and corner alpha byte',()=>{
 const r=prepareNativeAIInitialization(input()),cameras=Array.from({length:2},()=>new Uint8Array(112).fill(85));
 assert.equal(r.cameraBytePatches.length,64);
 for(const p of r.cameraBytePatches)cameras[p.cameraIndex][p.relativeByteOffset+48]=p.value;
 for(const camera of cameras){
  for(let vertex=0;vertex<3;vertex++)assert.deepEqual([...camera.slice(vertex*16+12,vertex*16+16)],[255,0,0,255]);
  for(let vertex=0;vertex<4;vertex++){
   const base=48+vertex*16;assert.deepEqual([...camera.slice(base,base+8)],[85,85,0,0,85,85,85,85]);
   assert.deepEqual([...camera.slice(base+12,base+16)],[255,255,255,85]);
  }
 }
 assert.ok(r.cameraBytePatches.every(p=>p.relativeByteOffset>=-36&&p.relativeByteOffset<=62));
});

test('partial patches retain motion history, slow/contact flags, action state and prior raw input',()=>{
 const q=input(),r=prepareNativeAIInitialization(q),before=initialWords(),after=apply(before,r);
 for(let slot=0;slot<4;slot++){
  const p=r.driverStatePatches[slot];
  assert.deepEqual(p.motionState,{recoveryPhase:0,offCircleBehindFrames:0,flagB0:0,flagB4:1});
  for(const offset of [0x90,0x94,0x98,0x9c,0xa4,0xa8,0xb8,0xbc,0xc0,0xc4,0xc8,0xcc,0xd0,0xd4,0xe0,0xe4]){
   assert.equal(word(r,slot,offset),undefined);assert.equal(after[slot][offset/4],before[slot][offset/4]);
  }
  assert.equal(word(r,slot,0x74).field,'cityRouteFlag74');assert.equal(word(r,slot,0x74).value,1);
  for(const key of ['flag94','fieldE0','lastRawXNative'])assert.equal(Object.hasOwn(p,key),false);
 }
});

test('warm setup applies only the next patch and never substitutes a cold zeroed driver state',()=>{
 const q=input(),a=prepareNativeAIInitialization(q),first=apply(initialWords(),a);
 const roles=first.map(words=>words[0x5c/4]|0);
 const b=prepareNativeAIInitialization({...q,rngState:a.rngState,hullProfilesB64:[4,4,4,4],retainedRoleWords:roles}),second=apply(first,b);
 for(let slot=0;slot<4;slot++){
  assert.equal(second[slot][0x64/4],first[slot][0x64/4]);assert.equal(second[slot][0x90/4],first[slot][0x90/4]);
  assert.equal(second[slot][0xc4/4],first[slot][0xc4/4]);assert.equal(Object.hasOwn(b.driverStatePatches[slot],'turnBudgetDegrees'),false);
 }
 assert.notDeepEqual(b.diagnostic,a.diagnostic);
});

test('explicit nested merge composes the patch with real retained driver state without losing history',()=>{
 const old=Array.from({length:4},(_,racerIndex)=>createNativeAIDriverState({racerIndex,avatar:racerIndex,role:racerIndex===0?-1:racerIndex-1,
  turnBudgetDegrees:48,motionState:{previousMotionDirection:{x:.6,y:0,z:.8},recoveryPhase:3,stuckFrames:71,dryMarkedContact:1,
   offCircleBehindFrames:203,flagB0:1,flagB4:0},courseEscapeFrames:42,courseEscapeActive:true,dryFloorFrames:35,fieldE0:2,flag94:17,lastRawXNative:35}));
 const before=structuredClone(old),q=input({racerCount:1,sourceOrder:[3],hullProfilesB64:[-1,3,0,1],avatarsB68:[3,0,2,1],retainedRoleWords:old.map(s=>s.role)});
 const r=prepareNativeAIInitialization(q),merged=old.map((s,i)=>createNativeAIDriverState({...s,...r.driverStatePatches[i],motionState:{...s.motionState,...r.driverStatePatches[i].motionState}}));
 for(let slot=0;slot<4;slot++){
  const s=merged[slot];assert.deepEqual(s.motionState.previousMotionDirection,old[slot].motionState.previousMotionDirection);
  assert.equal(s.motionState.stuckFrames,71);assert.equal(s.motionState.dryMarkedContact,1);assert.equal(s.motionState.recoveryPhase,0);
  assert.equal(s.motionState.offCircleBehindFrames,0);assert.equal(s.motionState.flagB0,0);assert.equal(s.motionState.flagB4,1);
  assert.equal(s.fieldE0,2);assert.equal(s.flag94,17);assert.equal(s.lastRawXNative,35);assert.equal(s.courseEscapeActive,false);
 }
 assert.deepEqual(merged.map(s=>s.turnBudgetDegrees),[48,24,32,32]);assert.deepEqual(merged.map(s=>s.avatar),[3,0,2,1]);
 assert.deepEqual(merged.map(s=>s.role),[-1,0,1,2]);assert.deepEqual(old,before);
});

test('copied setup patches are deterministic, immutable, serializable and do not retain input arrays',()=>{
 const q=input(),before=structuredClone(q),a=prepareNativeAIInitialization(q),b=prepareNativeAIInitialization(structuredClone(q));
 assert.deepEqual(a,b);assert.deepEqual(q,before);assert.deepEqual(JSON.parse(JSON.stringify(a)),a);
 assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.driverStatePatches[0].motionState)&&Object.isFrozen(a.nativeWordPatches[0]));
 q.avatarsB68[0]=99;q.objectTypes4c[0]=1;q.sourceOrder.reverse();
 assert.equal(a.driverStatePatches[0].avatar,3);assert.deepEqual(a.proximityObjectIndicesPrefix,[1,3]);
 assert.throws(()=>{a.driverStatePatches[0].motionState.recoveryPhase=5;},TypeError);
});

test('invalid or absent source fields are rejected without repairing or mutating them',()=>{
 const cases=[{rngState:-1},{rngState:4294967296},{racerCount:5},{racerCount:-1},{primaryHumanIndex:4},
  {hullProfilesB64:[0,1,2]},{hullProfilesB64:[0,1,2,NaN]},{hullProfilesB64:new Array(4)},
  {avatarsB68:[0,1,2,4294967295]},{retainedRoleWords:new Array(4)},{retainedRoleWords:[0,1,2,.1]},
  {adjacentRoleWord:NaN},{sourceOrder:[0,1,2]},{sourceOrder:[0,1,2,4]},{sourceOrder:new Array(4)},
  {objectTypes4c:Array(65).fill(1)},{objectTypes4c:new Array(3)},{objectTypes4c:[1,undefined]},{objectTypes4c:undefined}];
 for(const change of cases){const q=input(change),before=structuredClone(q);assert.throws(()=>prepareNativeAIInitialization(q));assert.deepEqual(q,before);}
 assert.throws(()=>prepareNativeAIInitialization(),/input/);
});
