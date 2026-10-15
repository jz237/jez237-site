import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceResetLayout} from '../native-race-reset.js';
import {createNativePrimaryRacePhaseLayout} from '../native-primary-race-phase.js';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceStartup,prepareNativeRaceOrdinaryUpdate} from '../native-race-state.js';

const ri=a=>(a-0x1f94)/4,hi=a=>(a-0x7788)/4;
function fixture(){
 const nodes=Array.from({length:4},(_,i)=>({sourceRow:i,referenceNativeXZ:{x:0,z:i*1000},centerNativeXZ:{x:0,z:i*1000},
  forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0},endpointANativeXZ:{x:100,z:i*1000},endpointBNativeXZ:{x:-100,z:i*1000},
  halfWidthNative8c:100,length88:1000,classification98:i===0?3:i%2,checkpointFlag9c:i===0?1:0,enabledC8:1,
  nextSourceRowA0:(i+1)%4,previousSourceRowA8:(i+3)%4,previousSourceRowB4:(i+3)%4,alternateNextSourceRowA4:-1,routeGroupC0:0}));
 const raceWords1f94=Array(1693).fill(0),hudWords7788=Array(1442).fill(0);
 [2,0,3,1].forEach((v,i)=>raceWords1f94[ri(0x26c0)+i]=v);
 for(let camera=0;camera<2;camera++){
  const base=0x7c80+camera*0x10c;
  for(const [offset,bits]of [[0x4c,0],[0x54,0xc4fa0000],[0x64,0],[0x6c,0x3f800000],
   [0x7c,0],[0x84,0],[0xf0,0],[0xf4,0xbf800000]])hudWords7788[hi(base+offset)]=bits;
 }
 hudWords7788[hi(0x7a50)]=0x3f2aaaab;
 const scene={cold8224:0,clockStopped817c:0,phase650:0,simulation648:1,main638:1,mode620:0,activity624:-1,
  primaryHumanIndex:0,secondaryHumanIndex:1,players:1,courseIndex:1,racerCount:4,primaryCount:4,finishSourceRow:0,
  difficulty:1,reverseDab68:0,restart6f8:0,forceFirst8228:0,demoOffset5438:0,event628:0,configuredLaps728:3,
  missLimit8174:5,noFinish8178:0,missesEnabled72e:1,state600:0,directionFlag1f90:0,
  ambientD4b00:0,fortressD8240:0,metadataD9b0:7,metadataCb32c:8,seed6f00:17};
 const reset=createNativeRaceResetLayout({nodes,boundaryNativeXZ:[],objectKinds4c:[],checkpointSeconds:90,
  checkpointSlackNative:256,recordTimeTemplateWords:[599999,0,0,0,0x494e4900],stuntTemplateWords:[0,0,0,0x494e4900]});
 const layout=createNativePrimaryRacePhaseLayout({nodes,regionsNative:[[-100000,100000,-100000,100000]],fortressRegionsNative:[],
  weedCentersNativeXZ:Array.from({length:6},(_,i)=>({x:50000+i*100,z:50000})),weedRadiusSquaredNative:22500,
  portRegionNative:[-1000,2600,-5450,1500],cityRegionNative:[-300,300,700,4400]});
 let state=prepareNativeRaceStartup(reset,createNativeRaceState({raceWords1f94,hudWords7788,scene})).state;
 state=prepareNativeRaceStateOperations(state,[{kind:'sourceWordWrite',field:'phase650',value:1}]).state;
 const bodiesBySlot=Array.from({length:4},()=>({positionNativeXZ:{x:5000,z:-1000},forwardXZ:{x:0,z:1},speedB90Native:20,
  frameSpeedB98:60,speedBbc:60,speedBc0:40,field15c0:0,field16d0:0,actorState:15}));
 const input={primary:{samplesBySlot:bodiesBySlot.map(b=>({bodyPositionNative:{...b.positionNativeXZ,y:0},priorBodyPointNative:{...b.positionNativeXZ}}))},
  bodiesBySlot,cameraIndicesByView:[0,1],pressedButtonsB58BySlot:[0,0,0,0],
  // Authored endpoint-only angle samples; this integration fixture contains
  // no original table payload and makes no exact source-table claim.
  angleTableWords6f08:Array(512).fill(0),warningSuppressionRegionsNative:[],allowedRegionsNative:[[-10000,10000,-10000,10000]]};
 return {layout,state,input};
}
const names=r=>r.diagnostic.consumers.map(c=>c.consumer);
const all=['overlayFc39c','overlayEf504','overlayF23a0','overlayF03e0','overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc'];

test('one ordinary source call composes all eight consumers and the launch changes reach next-frame timing',()=>{
 const c=fixture();let s=c.state;
 for(let frame=1;frame<=47;frame++){
  const r=prepareNativeRaceOrdinaryUpdate(c.layout,s,{...c.input,pressedButtonsB58BySlot:[frame===47?0x8000:0,0,0,0]});
  assert.deepEqual(names(r),all);assert.equal(r.diagnostic.conditionalStart,true);s=r.state;
  assert.equal(r.effects.some(e=>all.includes(e.consumer)),false,'consumed numeric overlays are not pending callbacks');
  if(frame===46){assert.equal(s.scene.phase650,2);assert.equal(s.scene.clockStopped817c,0);assert.equal(s.raceWords1f94[ri(0x2ad4)],0);}
 }
 assert.equal(s.raceWords1f94[ri(0x2ad4)],50);assert.equal(s.raceWords1f94[ri(0x2a64)],5);
 assert.equal(s.raceWords1f94[ri(0x2960)],1);assert.equal(s.raceWords1f94[ri(0x2c4c)],1);
 assert.equal(s.hudWords7788[hi(0x8b58)],0x01000000);assert.notEqual(s.scene.seed6f00,17);
 assert.equal(c.state.scene.seed6f00,17);assert.equal(c.state.scene.phase650,1);
});

test('late boundary retirement leaves that call ordered and blocks start control on the following update',()=>{
 const c=fixture(),before=nativeRaceStateSnapshot(c.state);
 before.raceWords1f94[ri(0x2c1c)]=1;before.raceWords1f94[ri(0x2c20)]=0;
 const input=structuredClone(c.input);input.bodiesBySlot[0].positionNativeXZ.x=12000;
 input.primary.samplesBySlot[0].bodyPositionNative.x=12000;input.primary.samplesBySlot[0].priorBodyPointNative.x=12000;
 const first=prepareNativeRaceOrdinaryUpdate(c.layout,createNativeRaceState(before),input);
 assert.deepEqual(names(first),all);assert.equal(first.state.raceWords1f94[ri(0x2c24)],1);
 const charge=first.state.hudWords7788[hi(0x8a90)],second=prepareNativeRaceOrdinaryUpdate(c.layout,first.state,input);
 assert.deepEqual(names(second),all.filter(n=>n!=='overlayF03e0'));assert.equal(second.diagnostic.conditionalStart,false);
 assert.equal(second.state.hudWords7788[hi(0x8a90)],charge);
});

test('inactive source activity runs no HUD consumers and needs no body or lookup samples',()=>{
 const c=fixture(),s=prepareNativeRaceStateOperations(c.state,[{kind:'sourceHalfwordWrite',field:'activity624',value:0}]).state;
 const before=nativeRaceStateSnapshot(s),r=prepareNativeRaceOrdinaryUpdate(c.layout,s);
 assert.equal(r.applied,false);assert.deepEqual(r.diagnostic.consumers,[]);assert.deepEqual(r.tailOperations,[]);assert.deepEqual(r.effects,[]);
 assert.deepEqual(nativeRaceStateSnapshot(r.state),before);
});

test('Fortress gate feedback and both HUD consumers share the selected canonical camera coordinates',()=>{
 const c=fixture(),s=nativeRaceStateSnapshot(c.state),input=structuredClone(c.input);
 Object.assign(s.scene,{courseIndex:3,difficulty:1,reverseDab68:1,finishSourceRow:3,racerCount:1});
 for(const [address,value]of [[0x2938,2],[0x2c58,2],[0x2944,0],[0x2958,1],[0x2954,-1]])s.raceWords1f94[ri(address)]=value>>>0;
 input.bodiesBySlot[0].positionNativeXZ={x:-10,z:10};
 input.primary.samplesBySlot[0]={bodyPositionNative:{x:-10,y:0,z:10},priorBodyPointNative:{x:-10,z:-10}};
 input.primary.gateObjectNativeXZ={x:0,z:0};
 const original=createNativeRaceState(s),cues=r=>r.effects.filter(e=>e.kind==='fortressGateCue').length;
 assert.equal(cues(prepareNativeRaceOrdinaryUpdate(c.layout,original,input)),1);
 // Only camera0 moves outside the cue's4000-native-unit range. Selecting
 // camera1 must still use its own HUD record, including for primary judging.
 const far=prepareNativeRaceStateOperations(original,[0x7ccc,0x7cd4].map(address=>
  ({kind:'hudWrite',byteOffset:address-0x7788,width:4,value:0x45bb8000}))).state;
 assert.equal(cues(prepareNativeRaceOrdinaryUpdate(c.layout,far,input)),0);
 assert.equal(cues(prepareNativeRaceOrdinaryUpdate(c.layout,far,{...input,cameraIndicesByView:[1,0]})),1);
 assert.throws(()=>prepareNativeRaceOrdinaryUpdate(c.layout,original,{...input,
  primary:{...input.primary,gateCamerasNativeXZ:[{x:6000,z:6000}]}}),/overlaps canonical/);
 assert.deepEqual(nativeRaceStateSnapshot(original),s);
});

test('a rejected final consumer cannot commit earlier HUD, RNG or countdown changes',()=>{
 const c=fixture(),before=nativeRaceStateSnapshot(c.state),input=structuredClone(c.input);
 delete input.bodiesBySlot[0].field16d0;
 assert.throws(()=>prepareNativeRaceOrdinaryUpdate(c.layout,c.state,input),/field16d0/);
 assert.deepEqual(nativeRaceStateSnapshot(c.state),before);
 assert.throws(()=>prepareNativeRaceOrdinaryUpdate(c.layout,c.state,{...c.input,camerasByIndex:[]}),/overlaps canonical/);
});
