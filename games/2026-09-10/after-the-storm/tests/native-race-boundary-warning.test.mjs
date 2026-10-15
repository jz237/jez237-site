import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRaceOutsideAllowedRegion,prepareNativeRaceBoundaryWarning,prepareNativeRaceRetirement} from '../native-race-boundary-warning.js';
const index=a=>(a-0x1f94)/4,base=i=>0x2938+i*0x378;
const bits=f=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,f,false);return d.getUint32(0,false);};
function fixture(){
 const raceWords1f94=Array.from({length:1693},(_,i)=>(0x23450000+i)>>>0),hudWords7788=Array.from({length:1442},(_,i)=>(0x12340000+i)>>>0);
 for(let i=0;i<4;i++)for(const [offset,v]of [[0x2ec,0],[0x2f4,0],[0x2e4,0],[0x2e8,0],[0x19c,1000],[0x2c4,1000]])raceWords1f94[index(base(i)+offset)]=v;
 raceWords1f94[index(0x39b4)]=bits(-100000);hudWords7788[(0x8b5c-0x7788)/4]=119;
 return {raceWords1f94,hudWords7788,globals:{mode620:4,players:1,primaryHumanIndex:0,secondaryHumanIndex:1,courseIndex:1,missesEnabled72e:1,main638:1},
  bodiesBySlot:Array.from({length:4},()=>({positionNativeXZ:{x:20,z:20},field16d0:0,actorState:22})),allowedRegionsNative:[[-10,10,-10,10]]};
}
function put(q,racer,offset,v){q.raceWords1f94[index(base(racer)+offset)]=v>>>0;}
function apply(q,operations){const words=[...q.raceWords1f94];for(const op of operations){
 if(op.kind==='recordWordWrite')words[index(base(op.racerIndex))+op.wordIndex]=op.value;
 else if(op.kind==='raceWordWrite')words[op.wordIndex]=op.value;
 }return words;}
const value=(words,racer,offset)=>words[index(base(racer)+offset)];
const cues=r=>r.operations.filter(op=>op.kind==='audioEntry');

test('actual1f80 rectangles use inclusive bounds and remain distinct from any coarse region',()=>{
 const q={courseIndex:1,allowedRegionsNative:[[-10,10,-20,20],[100,110,200,220]]};
 for(const p of [{x:-10,z:-20},{x:10,z:20},{x:105,z:210}])assert.equal(nativeRaceOutsideAllowedRegion(p,q),false);
 assert.equal(nativeRaceOutsideAllowedRegion({x:10.001,z:20},q),true);
 assert.equal(nativeRaceOutsideAllowedRegion({x:0,z:0},{courseIndex:8,allowedRegionsNative:[]}),true);
 assert.throws(()=>nativeRaceOutsideAllowedRegion({x:0,z:0},{courseIndex:1,allowedRegionsNative:[[0,0,0,0]]}),/sentinel/);
});

test('Dolphin radius uses the actual float32 radial query and requires no rectangle table',()=>{
 for(const p of [{x:7700,z:0},{x:4620,z:6160},{x:0,z:-7700}])assert.equal(nativeRaceOutsideAllowedRegion(p,{courseIndex:0}),false);
 assert.equal(nativeRaceOutsideAllowedRegion({x:7700.001,z:0},{courseIndex:0}),true);
 assert.equal(nativeRaceOutsideAllowedRegion({x:7700.0001,z:0},{courseIndex:0}),false);
});

test('warning arms the canonical timing96/97 words and reads72e independently of configured laps',()=>{
 const q=fixture(),before=structuredClone(q);q.globals.configuredLaps728=0;
 const r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
 assert.deepEqual(r.operations,[{kind:'recordWordWrite',racerIndex:0,wordIndex:185,value:1},{kind:'recordWordWrite',racerIndex:0,wordIndex:186,value:139}]);
 assert.equal(value(a,0,0x2e4),1);assert.equal(value(a,0,0x2e8),139);assert.deepEqual(q.raceWords1f94,before.raceWords1f94);
 q.globals.missesEnabled72e=0;q.globals.configuredLaps728=3;assert.deepEqual(prepareNativeRaceBoundaryWarning(q).operations,[]);
});

test('body16d0 alternative begins at81 and is completely bypassed on course8',()=>{
 const q=fixture();q.bodiesBySlot[0].positionNativeXZ={x:0,z:0};q.bodiesBySlot[0].field16d0=80;
 assert.deepEqual(prepareNativeRaceBoundaryWarning(q).operations,[]);
 q.bodiesBySlot[0].field16d0=81;assert.equal(prepareNativeRaceBoundaryWarning(q).operations[0].value,1);
 q.globals.courseIndex=8;delete q.bodiesBySlot[0].field16d0;
 assert.deepEqual(prepareNativeRaceBoundaryWarning(q).operations,[]);
});

test('clearing a warning preserves its counter and never reads an actor or unused72e gate',()=>{
 const q=fixture();put(q,0,0x2e4,-1);put(q,0,0x2e8,77);q.bodiesBySlot[0].positionNativeXZ={x:0,z:0};
 delete q.bodiesBySlot[0].actorState;delete q.globals.missesEnabled72e;
 const r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
 assert.deepEqual(r.operations,[{kind:'recordWordWrite',racerIndex:0,wordIndex:185,value:0}]);assert.equal(value(a,0,0x2e8),77);
});

test('actors23/7 freeze an already-active warning including a zero retirement counter',()=>{
 for(const actor of [23,7])for(const counter of [0,1,119]){
  const q=fixture();put(q,0,0x2e4,1);put(q,0,0x2e8,counter);q.bodiesBySlot[0].actorState=actor;
  const r=prepareNativeRaceBoundaryWarning(q);assert.deepEqual(r.operations,[]);assert.deepEqual(r.diagnostic.numericCalls,[]);
 }
 const q=fixture();q.bodiesBySlot[0].actorState=23;
 assert.equal(prepareNativeRaceBoundaryWarning(q).operations[0].value,1,'a new warning arms before any actor read');
});

test('source countdown cue boundaries preserve audio-before-decrement and the16d0 argument bias',()=>{
 for(const [counter,field,arg]of [[120,0,null],[119,0,5],[100,0,4],[20,81,128],[1,0,null]]){
  const q=fixture();put(q,0,0x2e4,1);put(q,0,0x2e8,counter);q.bodiesBySlot[0].field16d0=field;
  const r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
  assert.equal(value(a,0,0x2e8),counter-1);
  assert.deepEqual(cues(r),arg===null?[]:[{kind:'audioEntry',consumer:'800c37f4',arguments:[10,arg]}]);
  if(arg!==null)assert.equal(r.operations[0].kind,'audioEntry');
 }
});

test('counter1 reaches0 without retiring until the next source call; negative counters are retained',()=>{
 const q=fixture();put(q,0,0x2e4,1);put(q,0,0x2e8,1);
 const first=prepareNativeRaceBoundaryWarning(q);q.raceWords1f94=apply(q,first.operations);
 assert.equal(value(q.raceWords1f94,0,0x2ec),0);assert.equal(value(q.raceWords1f94,0,0x2e8),0);
 const second=prepareNativeRaceBoundaryWarning(q),a=apply(q,second.operations);
 assert.equal(value(a,0,0x2ec),1);assert.equal(value(a,0,0x32c),bits(-100000));assert.equal(a[index(0x39b4)],bits(-90000));
 assert.deepEqual(second.diagnostic.numericCalls,[{consumer:'800762d0',racerIndex:0,operationIndex:0,prepared:true}]);
 for(const n of [-1,-2147483648]){const x=fixture();put(x,0,0x2e4,1);put(x,0,0x2e8,n);assert.deepEqual(prepareNativeRaceBoundaryWarning(x).operations,[]);}
});

test('both selected human loops share actual retirement allocation and preserve all unrelated words',()=>{
 const q=fixture();Object.assign(q.globals,{players:2,primaryHumanIndex:2,secondaryHumanIndex:0});
 for(const racer of [2,0]){put(q,racer,0x2e4,1);put(q,racer,0x2e8,0);}
 const before=structuredClone(q),r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
 assert.equal(value(a,2,0x32c),bits(-100000));assert.equal(value(a,0,0x32c),bits(-90000));assert.equal(a[index(0x39b4)],bits(-80000));
 assert.deepEqual(q,before);
 const changed=new Set(r.operations.filter(o=>o.kind!=='audioEntry').map(o=>o.kind==='raceWordWrite'?o.wordIndex:index(base(o.racerIndex))+o.wordIndex));
 for(let i=0;i<a.length;i++)if(!changed.has(i))assert.equal(a[i],q.raceWords1f94[i]);
 assert.equal(r.operations.some(o=>o.kind==='hudWrite'||o.kind==='sourceWordWrite'),false);
});

test('aliased selected humans observe first-loop arming and retirement instead of detached copies',()=>{
 const q=fixture();Object.assign(q.globals,{players:2,secondaryHumanIndex:0});
 const r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
 assert.deepEqual(r.operations.map(o=>o.value),[1,139,138]);assert.equal(value(a,0,0x2e8),138);assert.equal(r.diagnostic.queries.length,2);
 put(q,0,0x2e4,1);put(q,0,0x2e8,0);const retired=prepareNativeRaceBoundaryWarning(q);
 assert.equal(retired.diagnostic.numericCalls.length,1);assert.equal(retired.diagnostic.queries.length,1);
});

test('versus completion suppresses eligibility using selected records, not rank/order or active count',()=>{
 const q=fixture();Object.assign(q.globals,{mode620:1,players:2,primaryHumanIndex:2,secondaryHumanIndex:3});
 put(q,2,0x2f4,1);put(q,3,0x2e4,1);put(q,3,0x2e8,99);delete q.globals.missesEnabled72e;
 const r=prepareNativeRaceBoundaryWarning(q),a=apply(q,r.operations);
 assert.equal(r.diagnostic.versusSuppressed,true);assert.equal(value(a,3,0x2e4),0);assert.equal(value(a,3,0x2e8),99);
 assert.deepEqual(r.diagnostic.queries.map(v=>v.racerIndex),[3]);
});

test('real retirement preserves signedzero and the mode1/status2 no-allocation branch',()=>{
 const q=fixture();q.raceWords1f94[index(0x39b4)]=0x80000000;
 const r=prepareNativeRaceRetirement(q.raceWords1f94,{racerIndex:0,main638:1,mode620:4}),a=apply(q,r.operations);
 assert.equal(value(a,0,0x32c),0x80000000);assert.equal(a[index(0x39b4)],bits(10000));
 put(q,0,0x19c,599999);q.raceWords1f94[index(0x39b4)]=0x7fc01234;
 assert.deepEqual(prepareNativeRaceRetirement(q.raceWords1f94,{racerIndex:0,main638:1,mode620:1}).operations,
  [{kind:'recordWordWrite',racerIndex:0,wordIndex:187,value:2}]);
 assert.deepEqual(prepareNativeRaceRetirement(q.raceWords1f94,{main638:0}).operations,[]);
});

test('retirement uses mode11 timing88 first and total timing14 at its literal threshold',()=>{
 for(const [mode,stunt,total,status]of [[11,0,0,2],[11,1,599998,1],[11,1,599999,2],[4,0,599998,1],[4,0,599999,2]]){
  const q=fixture();put(q,0,0x2c4,stunt);put(q,0,0x19c,total);
  const r=prepareNativeRaceRetirement(q.raceWords1f94,{main638:1,racerIndex:0,mode620:mode});assert.equal(r.operations[0].value,status);
 }
});

test('source reads are lazy and malformed late inputs reject atomically',()=>{
 const q=fixture();q.globals.mode620=1;put(q,0,0x2f4,1);delete q.globals.secondaryHumanIndex;delete q.globals.courseIndex;
 delete q.bodiesBySlot;delete q.allowedRegionsNative;assert.doesNotThrow(()=>prepareNativeRaceBoundaryWarning(q));
 const late=fixture();late.globals.players=2;delete late.bodiesBySlot[1].positionNativeXZ;const before=structuredClone(late);
 assert.throws(()=>prepareNativeRaceBoundaryWarning(late),/positionNativeXZ/);assert.deepEqual(late,before);
 assert.throws(()=>prepareNativeRaceBoundaryWarning({...late,raceWords1f94:Array(1692).fill(0)}),/1693/);
 assert.throws(()=>prepareNativeRaceBoundaryWarning({...late,hudWords7788:Array(1441).fill(0)}),/1442/);
 const bad=fixture();put(bad,0,0x2e4,1);put(bad,0,0x2e8,0);bad.raceWords1f94[index(0x39b4)]=0x7fc01234;
 assert.throws(()=>prepareNativeRaceBoundaryWarning(bad),/dqMetric/);
});
