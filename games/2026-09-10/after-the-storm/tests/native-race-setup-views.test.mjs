import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceState,nativeRaceStateSnapshot,prepareNativeRaceStateOperations,
 prepareNativeRaceWaveSelectionUpdate,nativeRaceGridPlacementView,nativeRaceComputerProfileView} from '../native-race-state.js';

const ri=a=>(a-0x1f94)/4;
function fixture(){
 const raceWords1f94=Array(1693).fill(0),hudWords7788=Array(1442).fill(0);
 [3,0,1,2].forEach((v,i)=>raceWords1f94[ri(0x26c0)+i]=v);
 [0,1,2,3].forEach((v,i)=>raceWords1f94[ri(0x3990)+i]=v);
 return createNativeRaceState({raceWords1f94,hudWords7788,scene:{main638:1,mode620:4,courseIndex:1,racerCount:4,
  primaryHumanIndex:2,secondaryHumanIndex:1,players:2,pendingPlayers60c:1,field4964:0,simulation648:1,
  finishSourceRow:0,directionFlag1f90:0,rngState4640:0xffffffff,seed6f00:17}});
}
const primaryNodes=[{sourceRow:0,centerNativeXZ:{x:100,z:200},forwardXZ:{x:0,z:1},rightXZ:{x:1,z:0}}];

test('canonical setup keeps pending players, active players and the two RNG owners separate',()=>{
 const s=fixture(),before=nativeRaceStateSnapshot(s);
 const normal=prepareNativeRaceWaveSelectionUpdate(s,{kind:0,courseWaves1P:[10,27],courseWavesOther:[20,13]});
 assert.equal(normal.waveValue,27);assert.equal(normal.state.scene.state600,0);
 assert.equal(normal.state.scene.players,2);assert.equal(normal.state.scene.pendingPlayers60c,1);
 assert.equal(normal.state.scene.rngState4640,0xffffffff);
 const random=prepareNativeRaceWaveSelectionUpdate(s,{kind:3});
 assert.equal(random.waveValue,22);assert.equal(random.state.scene.rngState4640,3191464396);
 assert.equal(random.state.scene.seed6f00,17);assert.equal(random.state.scene.state600,1);
 assert.deepEqual(random.operations,[{kind:'sourceWordWrite',field:'state600',value:1},
  {kind:'sourceWordWrite',field:'rngState4640',value:3191464396}]);
 assert.deepEqual(nativeRaceStateSnapshot(s),before);
 assert.throws(()=>prepareNativeRaceWaveSelectionUpdate(s,{kind:4}),/kind/);
 assert.deepEqual(nativeRaceStateSnapshot(s),before);
});

test('grid placement reads actual retained26c0 order while ranking remains independent',()=>{
 const s=fixture(),before=nativeRaceStateSnapshot(s),v=nativeRaceGridPlacementView(s,{racerIndex:0,primaryNodes});
 assert.deepEqual(v.positionNative,{x:56,y:0,z:-312});assert.equal(v.diagnostic.matrixEvaluated,false);
 const changed=prepareNativeRaceStateOperations(s,[{kind:'raceWordWrite',wordIndex:ri(0x26c0),value:0}]).state;
 assert.deepEqual(nativeRaceGridPlacementView(changed,{racerIndex:0,primaryNodes}).positionNative,{x:216,y:0,z:-72});
 assert.deepEqual(changed.raceWords1f94.slice(ri(0x3990),ri(0x3990)+4),[0,1,2,3]);
 assert.equal(nativeRaceComputerProfileView(s,2),false);assert.equal(nativeRaceComputerProfileView(s,1),false);
 assert.equal(nativeRaceComputerProfileView(s,0),true);assert.deepEqual(nativeRaceStateSnapshot(s),before);
});

test('training reads the selected canonical record word before preparing its explicit anchor recipe',()=>{
 const s=fixture(),training=prepareNativeRaceStateOperations(s,[{kind:'sourceWordWrite',field:'main638',value:21},
  {kind:'recordWordWrite',racerIndex:3,wordIndex:0x338/4,value:3}]).state;
 const trainingAnchorsNative=[{x:10,y:2,z:30},null,null,{x:70,y:-1,z:-20}];
 const v=nativeRaceGridPlacementView(training,{racerIndex:3,trainingAnchorsNative});
 assert.deepEqual(v.positionNative,{x:62,y:-1,z:-20});assert.deepEqual(v.forwardNative,{x:1,y:0,z:-1});
 assert.equal(v.diagnostic.physicalInitialization,false);assert.equal(training.raceWords1f94[ri(0x2c70)+3*222],3);
});
