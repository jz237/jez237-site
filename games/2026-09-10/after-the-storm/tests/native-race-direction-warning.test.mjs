import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceDirectionWarning as prepare,nativeRaceLookupAngle as lookup,
 nativeRaceCircularDistance as distance,nativeRaceCircularSign as sign} from '../native-race-direction-warning.js';
const data=new DataView(new ArrayBuffer(4)),F=Math.fround;
const bits=v=>{data.setFloat32(0,v,false);return data.getUint32(0,false);};
const ri=(slot,offset)=>(0x2938-0x1f94)/4+slot*222+offset/4;
const rw=(slot,offset,value)=>({kind:'recordWordWrite',racerIndex:slot,wordIndex:offset/4,value:value>>>0});
function set(v,slot,offset,value){v.raceWords1f94[ri(slot,offset)]=value>>>0;}
function writes(result,offset){return result.operations.filter(op=>op.kind==='recordWordWrite'&&op.wordIndex===offset/4);}
function fixture(){
 const v={raceWords1f94:Array(1693).fill(0),scene:{players:1,primaryHumanIndex:0,secondaryHumanIndex:1,mode620:0,courseIndex:1,reverseDab68:0,phase650:3},
  bodiesBySlot:Array.from({length:4},()=>({positionNativeXZ:{x:0,z:0},forwardXZ:{x:0,z:1},speedB90Native:20})),
  cameraIndicesByView:[0,1],camerasByIndex:Array.from({length:2},()=>({positionNativeXZ:{x:0,z:0},directionXZ:{x:0,z:1}})),
  primaryNodesBySourceRow:Array.from({length:3},(_,i)=>({centerNativeXZ:{x:0,z:2000+i*2000},forwardXZ:{x:0,z:1},classification98:i,
   checkpointFlag9c:0,nextSourceRowA0:(i+1)%3,endpointANativeXZ:{x:500,z:2000+i*2000},endpointBNativeXZ:{x:-500,z:2000+i*2000}})),
  warningSuppressionRegionsNative:[],genericObjectCountFa40:0,genericObjects:[],
  // Independently authored numeric lookup data. This is deliberately not the
  // original table; private raw comparisons supply the actual source view.
  angleTableWords6f08:Array.from({length:512},(_,i)=>bits(90-i*90/511))};
 for(let i=0;i<4;i++){set(v,i,0,1);set(v,i,0x320,1);}
 return v;
}

test('circular helpers reduce signed angles and choose negative on an exact half turn',()=>{
 assert.equal(distance(-1,1),2);assert.equal(distance(721,-719),0);assert.equal(distance(180,0),180);
 assert.equal(sign(180,0),-1);assert.equal(sign(-180,0),-1);assert.equal(sign(1,359),1);assert.equal(sign(359,1),-1);
 // The normalized operands are232 and127, so the shorter turn is positive.
 assert.equal(distance(-2147483648,2147483647),105);assert.equal(sign(-2147483648,2147483647),1);
 assert.throws(()=>distance(2147483648,0),/target angle/);
});

test('readonly lookup uses F32 index511 and source out-of-range zero policy',()=>{
 const table=Array(512).fill(bits(70));table[255]=bits(62.125);table[511]=bits(0);table[0]=bits(90);
 assert.equal(lookup(.5,table),62.125);assert.equal(lookup(-.5,table),117.875);
 assert.equal(lookup(-1,table),180);assert.equal(lookup(1,table),0);assert.equal(lookup(-0,table),90);
 assert.equal(lookup(F(1.0000001192092896)),0);assert.equal(lookup(-1.1),0);
 assert.throws(()=>lookup(0),/512/);assert.throws(()=>lookup(NaN,table),/finite/);
});

test('aligned case emits only actual canonical direction/reset stores',()=>{
 const v=fixture(),before=structuredClone(v),result=prepare(v);
 assert.deepEqual(result.operations,[rw(0,0x2d4,0),rw(0,0x2d0,0),rw(0,0x2d8,0),rw(0,0x328,0)]);
 assert.deepEqual(v,before);assert.equal(result.diagnostic.racers[0].selectedSourceRow,0);
 assert.equal(result.operations.some(op=>op.kind==='hudWrite'),false);
});

test('camera-relative sign preserves both desired-angle stores before circular easing',()=>{
 const v=fixture();v.primaryNodesBySourceRow[0].centerNativeXZ={x:-2000,z:0};set(v,0,0x2d0,5);
 const result=prepare(v);
 assert.deepEqual(result.operations.slice(0,3),[rw(0,0x2d4,90),rw(0,0x2d4,270),rw(0,0x2d0,-6)]);
 v.primaryNodesBySourceRow[0].centerNativeXZ={x:0,z:-2000};v.bodiesBySlot[0].positionNativeXZ.z=-3000;set(v,0,0x2d0,0);
 assert.deepEqual(prepare(v).operations.slice(0,2),[rw(0,0x2d4,180),rw(0,0x2d0,-22)]);
});

test('target selection preserves strict current plane and minus256 nearest threshold',()=>{
 const v=fixture();v.primaryNodesBySourceRow[0].centerNativeXZ={x:0,z:0};v.camerasByIndex[0].positionNativeXZ={x:0,z:-1000};
 assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,0);
 v.bodiesBySlot[0].positionNativeXZ.z=.001;assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,1);
 set(v,0,0x310,1);v.bodiesBySlot[0].positionNativeXZ.z=4000-256;
 assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,1);
 v.bodiesBySlot[0].positionNativeXZ.z+=.01;assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,2);
 set(v,0,0x2f0,1);assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,0);
});

test('legal-lap mismatch uses the nearest branch even when both row identities match',()=>{
 const v=fixture();v.primaryNodesBySourceRow[0].centerNativeXZ={x:0,z:0};v.bodiesBySlot[0].positionNativeXZ.z=-1;
 assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,0);
 set(v,0,0x320,0);assert.equal(prepare(v).diagnostic.racers[0].selectedSourceRow,1);
});

test('finite checkpoint endpoint side order can suppress a center-behind warning',()=>{
 const v=fixture(),n=v.primaryNodesBySourceRow[0];n.centerNativeXZ={x:0,z:-100};n.checkpointFlag9c=1;v.bodiesBySlot[0].positionNativeXZ.z=-2000;
 n.endpointANativeXZ={x:1000,z:100};n.endpointBNativeXZ={x:-1000,z:100};
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,false);
 [n.endpointANativeXZ,n.endpointBNativeXZ]=[n.endpointBNativeXZ,n.endpointANativeXZ];
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 n.checkpointFlag9c=2;delete n.endpointANativeXZ;delete n.endpointBNativeXZ;
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
});

test('actual1f88 camera suppression precedes canonical warning overrides',()=>{
 const v=fixture();v.primaryNodesBySourceRow[0].centerNativeXZ={x:0,z:-5000};v.bodiesBySlot[0].positionNativeXZ.z=-6000;v.warningSuppressionRegionsNative=[[-1,1,-1,1]];
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,false);
 set(v,0,0x2f0,1);assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 set(v,0,0x2f0,0);set(v,0,0x328,40);assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
});

test('course zero suppression applies outside Stunt without suppressing that source mode',()=>{
 const v=fixture();v.scene.courseIndex=0;set(v,0,0x2f0,1);
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,false);
 v.scene.mode620=11;assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
});

test('Fortress Reverse exemption is lap gated and strictly inside its source radius',()=>{
 const v=fixture();Object.assign(v.scene,{courseIndex:3,reverseDab68:65535});set(v,0,0,2);set(v,0,0x2f0,1);
 v.bodiesBySlot[0].positionNativeXZ={x:-2500,z:2800};assert.equal(prepare(v).diagnostic.racers[0].warningApplied,false);
 v.bodiesBySlot[0].positionNativeXZ.x=-1800;assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 v.bodiesBySlot[0].positionNativeXZ.x=-2500;set(v,0,0,1);assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
});

test('hysteresis seeds8 and consumes its first tick in the same source call',()=>{
 const v=fixture();set(v,0,0x2f0,1);set(v,0,0x2d8,7);
 assert.deepEqual(prepare(v).operations.filter(op=>op.wordIndex>=182&&op.wordIndex<=184),
  [rw(0,0x2d8,8),rw(0,0x2e0,8),rw(0,0x2dc,1),rw(0,0x2e0,7)]);
});

test('hold completion and blend retraction follow separate original branches',()=>{
 const v=fixture();set(v,0,0x2dc,2);set(v,0,0x2e0,1);
 assert.deepEqual(prepare(v).operations.filter(op=>op.wordIndex>=182&&op.wordIndex<=184),[rw(0,0x2d8,0),rw(0,0x2e0,0)]);
 set(v,0,0x2e0,0);assert.deepEqual(writes(prepare(v),0x2dc),[rw(0,0x2dc,1)]);
 set(v,0,0x2e0,0x80000000);assert.deepEqual(writes(prepare(v),0x2e0),[rw(0,0x2e0,0x7fffffff)]);
 set(v,0,0x2f0,1);set(v,0,0x2d8,0x7fffffff);set(v,0,0x2dc,4);set(v,0,0x2e0,2);
 const saturated=prepare(v);assert.deepEqual(writes(saturated,0x2d8),[]);assert.deepEqual(writes(saturated,0x2dc),[]);assert.deepEqual(writes(saturated,0x2e0),[rw(0,0x2e0,1)]);
});

test('wrong-way audio follows new counter while warning reads prior counter',()=>{
 const v=fixture();v.bodiesBySlot[0].forwardXZ={x:0,z:-1};set(v,0,0x328,39);
 const result=prepare(v);assert.equal(result.diagnostic.racers[0].warningApplied,false);
 assert.deepEqual(result.operations.slice(-2),[rw(0,0x328,40),{kind:'audioEntry',consumer:'800c37f4',arguments:[0x35,0]}]);
 set(v,0,0x328,40);assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 v.scene.phase650=2;set(v,0,0x328,59);assert.equal(prepare(v).operations.some(op=>op.kind==='audioEntry'),false);
});

test('wrong-way speed multiplies by actualF32 coefficient and resets inside body regions',()=>{
 const v=fixture();v.bodiesBySlot[0].forwardXZ={x:0,z:-1};const boundary=F(10/F(1.8));v.bodiesBySlot[0].speedB90Native=boundary;
 assert.deepEqual(writes(prepare(v),0x328),[rw(0,0x328,1)]);
 v.bodiesBySlot[0].speedB90Native=F(boundary-.00001);assert.deepEqual(writes(prepare(v),0x328),[rw(0,0x328,0)]);
 v.bodiesBySlot[0].speedB90Native=20;v.warningSuppressionRegionsNative=[[0,100,0,100]];
 assert.deepEqual(writes(prepare(v),0x328),[rw(0,0x328,0)]);
});

test('the hundred-degree gate consumes the supplied source lookup result',()=>{
 const v=fixture();v.angleTableWords6f08[511]=bits(100);
 assert.deepEqual(writes(prepare(v),0x328),[rw(0,0x328,1)]);
 v.angleTableWords6f08[511]=bits(99.99999);assert.deepEqual(writes(prepare(v),0x328),[rw(0,0x328,0)]);
});

test('Stunt type8 scan honors actual prefix beyond64 without requiring ignored centers',()=>{
 const v=fixture();v.scene.mode620=11;v.primaryNodesBySourceRow[0].centerNativeXZ={x:0,z:-5000};v.bodiesBySlot[0].positionNativeXZ.z=-6000;
 v.genericObjects=Array.from({length:65},()=>({runtimeType4c:9}));v.genericObjects[64]={runtimeType4c:8,centerNativeXZ:{x:0,z:4095}};v.genericObjectCountFa40=65;
 assert.equal(prepare(v).diagnostic.racers[0].warningApplied,false);
 v.genericObjectCountFa40=64;assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 v.genericObjectCountFa40=65;v.genericObjects[64].centerNativeXZ.z=4096;assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
 v.genericObjects[64].centerNativeXZ.z=4095;set(v,0,0x2f0,1);assert.equal(prepare(v).diagnostic.racers[0].warningApplied,true);
});

test('actual human slot and camera selectors remain independent',()=>{
 const v=fixture();Object.assign(v.scene,{players:2,primaryHumanIndex:3,secondaryHumanIndex:1});v.cameraIndicesByView=[1,0];v.camerasByIndex[0].directionXZ={x:0,z:-1};
 const result=prepare(v);assert.deepEqual(result.diagnostic.racers.map(({viewIndex,racerIndex,cameraIndex})=>({viewIndex,racerIndex,cameraIndex})),
  [{viewIndex:0,racerIndex:3,cameraIndex:1},{viewIndex:1,racerIndex:1,cameraIndex:0}]);
 assert.deepEqual(writes(result,0x2d4),[rw(3,0x2d4,0),rw(1,0x2d4,180)]);
});

test('aliased human views see earlier writes and use view ordinal for ordered audio',()=>{
 const v=fixture();Object.assign(v.scene,{players:2,secondaryHumanIndex:0});v.bodiesBySlot[0].forwardXZ={x:0,z:-1};set(v,0,0x328,39);
 const result=prepare(v);assert.deepEqual(result.diagnostic.racers.map(r=>r.priorWrongDirection2c60),[39,40]);
 assert.deepEqual(writes(result,0x2d8),[rw(0,0x2d8,0),rw(0,0x2d8,1)]);
 assert.deepEqual(result.operations.filter(op=>op.kind==='audioEntry'),[{kind:'audioEntry',consumer:'800c37f4',arguments:[0x35,0]}]);
 set(v,0,0x328,58);assert.deepEqual(prepare(v).operations.filter(op=>op.kind==='audioEntry'),[{kind:'audioEntry',consumer:'800c37f4',arguments:[0x35,1]}]);
});

test('branch-lazy data reads preserve empty source counts and unused fields',()=>{
 assert.deepEqual(prepare({scene:{players:-1}}),{operations:[],diagnostic:{racers:[]}});
 const v=fixture();v.scene.mode620=11;delete v.scene.courseIndex;delete v.scene.reverseDab68;delete v.scene.phase650;delete v.bodiesBySlot[0].speedB90Native;
 v.hudWords7788=[NaN];assert.equal(prepare(v).operations.length,4);
 v.primaryNodesBySourceRow[0].checkpointFlag9c=1;delete v.primaryNodesBySourceRow[0].endpointANativeXZ;delete v.primaryNodesBySourceRow[0].endpointBNativeXZ;
 assert.doesNotThrow(()=>prepare(v));
});

test('sparse canonical/table inputs and actual generic prefix holes reject',()=>{
 const v=fixture();delete v.raceWords1f94[7];assert.throws(()=>prepare(v),/unsigned|word/);
 const table=Array(512);assert.throws(()=>lookup(.5,table),/word/);
 const w=fixture();w.scene.mode620=11;w.genericObjectCountFa40=1;w.genericObjects=Array(1);assert.throws(()=>prepare(w),/generic object/);
});

test('late invalid dependencies fail without changing owners and outputs are frozen',()=>{
 const v=fixture();v.scene.mode620=11;v.genericObjectCountFa40=1;v.genericObjects=[{runtimeType4c:8}];const before=structuredClone(v);
 assert.throws(()=>prepare(v),/generic.center/);assert.deepEqual(v,before);
 const w=fixture(),result=prepare(w),saved=structuredClone(result);w.raceWords1f94.fill(7);w.angleTableWords6f08.fill(0);
 assert.deepEqual(result,saved);assert.equal(Object.isFrozen(result.operations),true);assert.equal(Object.isFrozen(result.diagnostic.racers[0]),true);
});
