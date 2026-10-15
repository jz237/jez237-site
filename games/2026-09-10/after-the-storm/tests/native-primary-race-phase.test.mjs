import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativePrimaryRacePhaseLayout,createNativePrimaryRacePhaseState,nativePrimaryRacePhaseRecord,
 prepareNativePrimaryRacePhase,prepareNativePrimaryRacePhasePresentationTail} from '../native-primary-race-phase.js';

const F=Math.fround,BASE=0x2938,word=(a)=>(a-BASE)/4;
const bits=v=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,v,false);return d.getUint32(0,false);};
function put(row,address,value){row[word(address)]=value>>>0;}
function fixture(){
 // Prepared authored state, deliberately not an initializer/reset oracle.
 const nodes=Array.from({length:4},(_,i)=>({sourceRow:i,centerNativeXZ:{x:0,z:i*1000},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},
  endpointANativeXZ:{x:100,z:i*1000},endpointBNativeXZ:{x:-100,z:i*1000},halfWidthNative8c:100,length88:1000,
  classification98:i===0?3:i%2,checkpointFlag9c:i===0?1:0,enabledC8:1,nextSourceRowA0:(i+1)%4,previousSourceRowA8:(i+3)%4,routeGroupC0:0}));
 const layout={nodes,regionsNative:[[-100000,100000,-100000,100000]],fortressRegionsNative:[],
  weedCentersNativeXZ:Array.from({length:6},(_,i)=>({x:50000+i*100,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]};
 const records=Array.from({length:4},(_,i)=>{
  const row=Array(222).fill(0);
  for(const [a,v]of [[0x2938,1],[0x293c,i],[0x2944,0],[0x2954,-1],[0x2958,1],[0x2a64,3],[0x2a70,1],
   [0x2aa0,65000+i*1000],[0x2aa8,70000],[0x2ad4,190000+i*1000],[0x2c48,0],[0x2c58,1],[0x2c74,-1],
   [0x2c88,0x801aee20],[0x2948,0x12340000+i],[0x294c,0x76540000+i],[0x2c90,0xff123400+i]])put(row,a,v);
  return row;
 });
 const globals={primaryHumanIndex:0,secondaryHumanIndex:1,players:1,courseIndex:1,missLimit8174:5,noFinish8178:0,clockStopped817c:0,
  event628:0,state638:1,mode620:4,configuredLaps728:3,difficulty:0,directionFlag1f90:0,fortressFlag1fc8:0,southernLap1fcc:0,
  drakeFog1fd0:0,flag1fc4:0,flag1fd4:0,flag1fd8:0,bestTime1fe0:80000,bestLapFlag2658:0,recordFlag8a98:0,ambientD4b00:0,
  fortressD8240:0,primaryCount:4,finishSourceRow:0,missesEnabled72e:1,reverse:0,finishMetric39b0:100000,dqMetric39b4:-100000,
  checkpointSlackNative39c4:50,activity624:-1,state650:3,racerCount:4,state600:0,metadataD9b0:7,metadataCb32c:8,
  placeChanged8a9c:0,finishWait1fdc:0,recordPlace2650:0,bestLapFlag2654:0};
 const state={recordWords2938BySlot:records,projectionDistance39a0BySlot:[11,22,33,44],orderByPlace:[3,2,1,0],globals,
  scratchPositionNative:{x:77,y:88,z:99},courseRecords:{fastLap22c0:[999999,1,2,3,90],
   normalTimes1ff0:[[999999,11,12,13,51],[999999,21,22,23,61],[999999,31,32,33,71]],
   reverseTime23b0:[999999,4,5,6,81],bestSplits24a0:Array(9).fill(0),recordPlace2660:-2,bestLapFlag2690:-3}};
 const input={samplesBySlot:Array.from({length:4},()=>({bodyPositionNative:{x:-10,y:0,z:10},priorBodyPointNative:{x:-10,z:-10}})),
  gateObjectNativeXZ:{x:0,z:0},gateCamerasNativeXZ:[{x:10000,z:10000},{x:10000,z:10000}]};
 return {layout,state,input};
}
const run=c=>prepareNativePrimaryRacePhase(createNativePrimaryRacePhaseLayout(c.layout),createNativePrimaryRacePhaseState(c.state),c.input);
const view=(r,i)=>nativePrimaryRacePhaseRecord(r.state,i);

test('one canonical full record preserves navigation, unknown words and independent per-slot projection storage',()=>{
 const c=fixture(),before=structuredClone(c.state),r=run(c);
 assert.deepEqual(c.state,before);assert.ok(Object.isFrozen(r.state.recordWords2938BySlot[0]));
 for(let i=0;i<4;i++){
  for(const a of [0x2948,0x294c,0x2c90])assert.equal(r.state.recordWords2938BySlot[i][word(a)],before.recordWords2938BySlot[i][word(a)]);
  const v=view(r,i);assert.equal(v.lap2938,2);assert.equal(v.timingWords2a9c[5],65025+i*1000);
  assert.equal(v.timingWords2a9c[14],190050+i*1000);assert.equal(v.splitState2c34,i===0?0:1);
  assert.equal(v.projectionDistance39a0,10);assert.equal(Object.hasOwn(v,'finishTime2ad4'),false);
 }
 const detached=view(r,0);detached.timingWords2a9c[14]=1;assert.equal(view(r,0).timingWords2a9c[14],190050);
 assert.deepEqual(r.state.scratchPositionNative,{x:-10,y:0,z:10});
});

test('ascending primary calls share finish allocation before one rank pass and selected-human record saving',()=>{
 const c=fixture();Object.assign(c.state.globals,{configuredLaps728:1,primaryHumanIndex:2});
 c.state.recordWords2938BySlot.forEach((row,i)=>put(row,0x293c,3-i));
 const r=run(c);assert.equal(r.state.globals.finishMetric39b0,60000);assert.deepEqual(r.state.orderByPlace,[0,1,2,3]);
 assert.deepEqual(r.diagnostic.racers.map(x=>x.racerIndex),[0,1,2,3]);
 for(let i=0;i<4;i++){
  const v=view(r,i);assert.equal(v.finished2c2c,1);assert.equal(v.metric2c64,100000-i*10000);
  assert.equal(v.power2a64,i===2?3:0);assert.equal(v.place293c,i);assert.equal(v.timingWords2a9c[14],65025+i*1000);
 }
 assert.equal(r.state.globals.flag1fd8,1);assert.equal(r.state.globals.finishWait1fdc,1);
 assert.equal(r.state.globals.placeChanged8a9c,1);assert.equal(r.state.courseRecords.fastLap22c0[0],67025);
 assert.deepEqual(r.state.courseRecords.normalTimes1ff0[0].slice(0,4),[67025,7,8,0]);
 assert.deepEqual(r.effects.slice(-3).map(x=>x.consumer),['overlayFc39c','overlayEf504','overlayF23a0']);
 assert.equal(r.continuation,'ordinaryPresentationTail');
});

test('finish reconciliation commits its equal-time increment into canonical timing word14',()=>{
 const c=fixture();c.state.globals.racerCount=2;
 c.state.recordWords2938BySlot.forEach((row,i)=>{
  put(row,0x2958,0);put(row,0x2c2c,i<2?1:0);put(row,0x2c64,bits(10000-i*1000));put(row,0x2ad4,1000);
 });
 const r=run(c);assert.equal(view(r,0).timingWords2a9c[14],1000);assert.equal(view(r,1).timingWords2a9c[14],1001);
 assert.equal(view(r,0).reconciled2c3c,1);assert.equal(view(r,1).reconciled2c3c,1);
 assert.equal(r.state.courseRecords.normalTimes1ff0[0][0],1000);
 assert.deepEqual(r.diagnostic.finishMetrics.timeIncrements,[{processingRacer:0,racerIndex:1,before:1000,after:1001}]);
});

test('Southern route-family changes become visible to later racers within the same outer call',()=>{
 const c=fixture();c.state.globals.courseIndex=7;
 const r=run(c);assert.equal(r.state.globals.southernLap1fcc,1);
 assert.equal(view(r,0).recordFamily,'primary');
 for(let i=1;i<4;i++)assert.equal(view(r,i).recordFamily,'secondary');
});

test('comparison splits share the selected-course record table and have no separate persistent alias',()=>{
 const c=fixture();Object.assign(c.state.globals,{mode620:0,racerCount:1});c.state.courseRecords.bestSplits24a0[0]=190100;
 const r=run(c),v=view(r,0);assert.equal(v.splitState2c34,2);assert.equal(v.splitDelta2c30,75);assert.equal(v.splitTimer2c38,40);
 assert.equal(r.state.courseRecords.bestSplits24a0[0],190100);assert.equal(Object.hasOwn(r.state,'comparisonTimes'),false);
});

test('versus final time can override places while retaining the independently sorted3990 order and signed gaps',()=>{
 const c=fixture();Object.assign(c.state.globals,{mode620:1,players:2,racerCount:2});
 for(let i=0;i<2;i++){
  const row=c.state.recordWords2938BySlot[i];put(row,0x2958,0);put(row,0x2c2c,1);
  put(row,0x2c64,bits(100+i*100));put(row,0x2ad4,1000+i*1000);
 }
 const r=run(c);assert.deepEqual(r.state.orderByPlace.slice(0,2),[1,0]);
 assert.equal(view(r,0).place293c,0);assert.equal(view(r,1).place293c,1);
 assert.equal(r.state.globals.flag1fd4,1);assert.equal(r.state.globals.flag1fd8,1);
 assert.ok(Object.is(view(r,0).routeGap2c68,-0));assert.ok(Object.is(view(r,1).routeGap2c68,0));
});

test('the real76378 region transition precedes the same-slot award effects',()=>{
 const c=fixture();Object.assign(c.state.globals,{courseIndex:5,racerCount:1});
 const r=run(c);assert.equal(view(r,0).region2c54,1);
 assert.deepEqual(r.effects[0],{kind:'courseRegionEnterCue',arguments:[]});assert.equal(r.effects[1].kind,'raceCue');
});

test('main2 scratch uses actual alternate XZ with Y0 and does not require a fabricated body sample',()=>{
 const c=fixture();Object.assign(c.state.globals,{state638:2,racerCount:1});
 c.input.samplesBySlot[0]={alternatePositionNativeXZ:{x:45,z:-10}};
 const r=run(c);assert.deepEqual(r.state.scratchPositionNative,{x:45,y:0,z:-10});
 assert.equal(view(r,0).timingWords2a9c[14],190000);assert.equal(view(r,0).metric2c64,0);
 assert.equal(view(r,0).projectionDistance39a0,0);assert.equal(view(r,1).projectionDistance39a0,22);
});

test('inactive activity skips all ordinary consumers and zero active count retains the previous shared scratch',()=>{
 const c=fixture();c.state.globals.activity624=0;c.input={};
 const disabled=run(c);assert.equal(disabled.applied,false);assert.deepEqual(disabled.effects,[]);
 assert.deepEqual(disabled.state,createNativePrimaryRacePhaseState(c.state));
 c.state.globals.activity624=-1;c.state.globals.racerCount=0;
 const empty=run(c);assert.equal(empty.applied,true);assert.deepEqual(empty.state.scratchPositionNative,{x:77,y:88,z:99});
 assert.deepEqual(empty.state.recordWords2938BySlot,c.state.recordWords2938BySlot);
 assert.deepEqual(empty.state.projectionDistance39a0BySlot,[11,22,33,44]);
});

test('late invalid source data rejects the detached phase without committing earlier racer/global changes',()=>{
 const c=fixture();c.input.samplesBySlot[3]={};const before=structuredClone(c.state);
 assert.throws(()=>run(c),/bodyPositionNative|body position/);assert.deepEqual(c.state,before);
 c.state.globals.mode620=11;assert.throws(()=>run(c),/separate source stunt phase/);
 c.state.globals.activity624=0;assert.equal(run(c).applied,false);
 assert.throws(()=>createNativePrimaryRacePhaseState({...c.state,recordWords2938BySlot:[Array(221).fill(0)]}),/222/);
});

test('presentation continuation reads fresh callback-mutated status and signed16 scene flags',()=>{
 const c=fixture(),r=run(c),fresh=structuredClone(r.state);
 assert.equal(prepareNativePrimaryRacePhasePresentationTail(fresh).conditionalCalled,true);
 put(fresh.recordWords2938BySlot[0],0x2c24,1);
 assert.equal(prepareNativePrimaryRacePhasePresentationTail(fresh).conditionalCalled,false);
 put(fresh.recordWords2938BySlot[0],0x2c24,0);fresh.globals.event628=-32768;
 const tail=prepareNativePrimaryRacePhasePresentationTail(fresh);assert.equal(tail.conditionalCalled,false);
 assert.deepEqual(tail.effects.map(x=>x.consumer),['overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc']);
 fresh.globals.event628=32768;assert.throws(()=>prepareNativePrimaryRacePhasePresentationTail(fresh),/event628/);
});
