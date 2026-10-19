import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {captureNativeInitialEffectBody as capture,captureNativeEffectBody,nativeEffectEngineMask} from '../native-effect-body-view.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {latchNativeRaceAdapterControls} from '../native-race-adapter.js';
import {captureNativePhysicalBoundaryDrift} from '../native-physical-body-wrap.js';
import {prepareNativePresentationEffectsInitialization} from '../native-presentation-effects-initialization.js';
import {NATIVE_PRESENTATION_EFFECT_WORDS} from '../native-presentation-effects.js';
import {queryNativeWaterField} from '../native-water-field.js';
const evidence=JSON.parse(readFileSync(new URL('./fixtures/native-initial-effect-body.json',import.meta.url)));
const b=new DataView(new ArrayBuffer(4)),word=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const fresh=()=>createRace({mode:'time',physics:'native',course:getCourse('greyhaven')});

test('initial effect view preserves twenty full original bootstrap outputs without inventing engine reset',()=>{
 assert.equal(evidence.sourceInstructions,205321);assert.equal(evidence.cases.length,20);
 for(const c of evidence.cases){
  const f=c.fields,adapter={hull:{initialization:{},scale:1,ticks:0,center:f.positionNative,frame:{forward:f.forwardNative,right:f.rightNative},
   sprayMotionNative:{velocity:f.referenceVelocityNative,centerVelocity:f.tickDisplacementNative}},
   frame:null,logicalFrames:0,remainder:0,pendingFrameCompletion:false,preparedHullTick:null,sampledHullTick:null,inactiveTicks:0,lastControls:null,
   riderLifecycle:{state:{alternateStumble:f.alternate16cc,stumbleCountdown:f.stumbleCountdown16e0}},
   lastFrame:{frameDisplacementNative:f.frameDisplacementNative},impacts:{floorImpactNative:f.floorImpactNative}};
  const before=structuredClone(adapter),q=capture(adapter,{boundaryDriftNative:f.boundaryDriftNative});
  assert.deepEqual(q,f,c.label);assert.deepEqual(adapter,before);assert.ok(Object.isFrozen(q.positionNative));
  assert.equal(word(q.floorImpactNative),c.retainedFloorWord);assert.equal(c.floorBytesWritten,false);
  assert.equal(c.engineBytesWritten,false);assert.equal(c.engineHalfAfter,c.retainedEngineHalf);assert.ok(c.resetBytesWritten);
  assert.throws(()=>nativeEffectEngineMask({bodyFieldsBySlot:[q]},0),/engineMaskC66/);
 }
});

test('real prepared startup can seed complete AE7C4 without sampling controls or advancing hull, rider, water or RNG',()=>{
 const race=fresh(),host=race.nativeHost,a=host.world.adapters[0],water=host.world.water;
 const before={hull:structuredClone(a.hull),rider:structuredClone(a.articulatedRider),water:structuredClone(water.field),canonical:race.nativeLaunch.snapshot(),control:structuredClone(a.controlState)};
 // Fresh62E50(a2=0) explicitly writes BF4/BF0 zero. This caller owns that
 // fresh-load choice; the capture does not infer it from the current position.
 const fields=capture(a,{boundaryDriftNative:{x:0,z:0}}),queries=[];
 assert.throws(()=>capture(a),/boundary drift/);assert.throws(()=>captureNativeEffectBody(a,{boundaryDriftNative:{x:0,z:0}}),/completed/);
 const result=prepareNativePresentationEffectsInitialization({courseIndex:1,racerCount:1,clockLow32:12345,
  effectWords0790:Array(NATIVE_PRESENTATION_EFFECT_WORDS).fill(0),effectControlWords6d60:Array(22).fill(0),bodyFieldsBySlot:[fields],
  queryNative:(x,z)=>{queries.push([x,z]);return queryNativeWaterField(water.field,x,z).sourcePlaneQueryNative;}});
 assert.equal(result.seed6f00,12345);assert.equal(result.diagnostic.effectCount,1);
 assert.deepEqual(queries,[[fields.positionNative.x,fields.positionNative.z]]);
 assert.ok(result.operations.some(o=>o.kind==='presentationEffectVertexWrite'&&o.bufferIndex===0));
 assert.ok(result.operations.some(o=>o.kind==='presentationEffectVertexWrite'&&o.bufferIndex===1));
 assert.deepEqual({hull:a.hull,rider:a.articulatedRider,water:water.field,canonical:race.nativeLaunch.snapshot(),control:a.controlState},before);
 assert.equal(a.lastControls,null);assert.equal(a.frame,null);assert.equal(a.logicalFrames,0);
 stepNativeRaceHost(host,.05,[{}]);assert.throws(()=>capture(a,{boundaryDriftNative:{x:0,z:0}}),/fresh/);
 assert.doesNotThrow(()=>captureNativeEffectBody(a,{boundaryDriftNative:captureNativePhysicalBoundaryDrift(a)}));
});

test('initial capture requires actual retained contacts and drift and rejects even input-only startup mutation',()=>{
 const a=fresh().nativeHost.world.adapters[0];a.impacts.floorImpactNative=2.5;
 assert.equal(capture(a,{boundaryDriftNative:{x:4,z:-8}}).floorImpactNative,2.5);
 assert.deepEqual(capture(a,{boundaryDriftNative:{x:4,z:-8}}).boundaryDriftNative,{x:4,z:-8});
 assert.throws(()=>capture(a,{boundaryDriftNative:{x:NaN,z:0}}),/boundary drift/);
 a.impacts.floorImpactNative=NaN;assert.throws(()=>capture(a,{boundaryDriftNative:{x:0,z:0}}),/floor impact/);a.impacts.floorImpactNative=0;
 latchNativeRaceAdapterControls(a,{});assert.throws(()=>capture(a,{boundaryDriftNative:{x:0,z:0}}),/fresh/);
});
