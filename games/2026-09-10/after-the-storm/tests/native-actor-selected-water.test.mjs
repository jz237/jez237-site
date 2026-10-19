import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeAISelectionCircle} from '../native-ai-perception.js';
import {createRaceWater,advanceRaceWaterFrame,raceWaterActorMotionInputs} from '../race-water.js';
const evidence=JSON.parse(readFileSync(new URL('./fixtures/native-actor-selected-water-reference.json',import.meta.url)));

test('stored actor water vertex matches original mesh writes across radii, snapping and signed16 wrapping',()=>{
 assert.equal(evidence.cases.length,18);
 for(const c of evidence.cases){
  const q=prepareNativeAISelectionCircle(c.input);
  assert.deepEqual(q,c.expected);
  assert.ok(Object.isFrozen(q.storedCenterVertexNative));
 }
 const large=evidence.cases.find(c=>c.input.radius===16&&c.input.requestedCenterNative.x===0).expected;
 assert.deepEqual(large.storedCenterVertexNative,{x:-128,z:0});
 assert.notDeepEqual(large.storedCenterVertexNative,large.snappedCenterNative);
});

test('actor inputs read patch0 center and outer0 in stored coordinates without advancing water',()=>{
 const crafts=[{x:12,y:0,z:-24,heading:0},{x:100,y:0,z:50,heading:1}],
  water=createRaceWater({crafts,baseAmplitudeNative:12,amplitudeThresholdNative:500,initialNoise:false});
 assert.throws(()=>raceWaterActorMotionInputs(water),/completed source water frame/);
 advanceRaceWaterFrame(water,crafts,{simulationActive:false});
 const before=structuredClone(water),q=raceWaterActorMotionInputs(water),mesh=water.selectionMeshesNative[0];
 assert.deepEqual(q.selectedWaterVertexXZ,[mesh.storedCenterVertexNative,mesh.outerVerticesNative[0]].map(p=>[p.x,p.z]));
 assert.notDeepEqual(q.selectedWaterVertexXZ[1],Object.values(water.selectionMeshesNative[1].storedCenterVertexNative));
 assert.deepEqual(water,before);
 assert.ok(Object.isFrozen(q.selectedWaterVertexXZ)&&q.selectedWaterVertexXZ.every(Object.isFrozen));
 crafts[0].x+=40;advanceRaceWaterFrame(water,crafts,{simulationActive:false});
 assert.notDeepEqual(raceWaterActorMotionInputs(water).selectedWaterVertexXZ,q.selectedWaterVertexXZ);
 water.menuActive=true;assert.throws(()=>raceWaterActorMotionInputs(water),/race water scene/);
});
