import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {loadedAnimationBank} from './helpers/loaded-animation-bank.mjs';
import {createNativePresentationAnimationResources as createResources} from '../native-presentation-animation-resource.js';
import {prepareNativeDolphinActorMotion} from '../native-dolphin-actor-motion.js';
import {prepareNativePresentationWingAnimation} from '../native-presentation-wing-animation.js';
import {prepareNativePresentationArticulatedActor} from '../native-presentation-articulated-actor.js';
import {prepareNativePresentationSpecialActor} from '../native-presentation-special-actor.js';
import {createNativeWaterField} from '../native-water-field.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from '../native-math-tables.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
import {prepareNativePresentationWingAnimationUpdate,prepareNativePresentationArticulatedActorUpdate,prepareNativePresentationSpecialActorUpdate} from '../native-race-state.js';
const fixture=name=>JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/'+name+'.json.gz',import.meta.url))));
function resources(animations){const bank=loadedAnimationBank(animations),resourceWordsE73c=Array(43).fill(0);resourceWordsE73c[0xa4/4]=0xffffffff;resourceWordsE73c[0x48/4]=bank.animationTableAddress;
 return {resourceWordsE73c,animationResources:createResources({resourceWordsE73c,loadedBanks:{0:bank}})};
}
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');};
test('retained loaded banks reproduce all original dolphin motion operations without normalized animation maps',()=>{
 const e=fixture('native-dolphin-actor-motion'),provider=resources(e.animationsByResourceIndex[5]);
 const fields=[0,1].map(pattern=>{const field=createNativeWaterField({datumNative:-100});field.heightQ.forEach((_,i)=>field.heightQ[i]=pattern?((i*7919+37)%20001)-10000:768);return field;});
 for(const [i,c]of e.cases.entries()){
  const actorWordsF060=[...e.baseActorWords],hudWords7788=[...e.baseHudWords],courseWordsEe20=[...e.courseWordsEe20];
  for(const [at,w]of c.input.actorOverrides)actorWordsF060[at]=w;for(const [at,w]of c.input.hudOverrides)hudWords7788[at]=w;for(const [at,w]of c.input.courseOverrides)courseWordsEe20[at]=w;
  const q=prepareNativeDolphinActorMotion({...c.input,...provider,actorWordsF060,hudWords7788,courseWordsEe20,collisionGeometry:e.collisionGeometry,waterField:fields[c.input.waterPattern],sineTableWords4350:nativeSineTableWords(),angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS});
  assert.deepEqual(q.operations,c.operations,'loaded dolphin '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256);assert.deepEqual(q.actorControlWords62d0,c.actorControlWords62d0);
 }
});
test('loaded animation sampling preserves original complete bird, articulated and special draw results',()=>{
 let checked=0;
 for(const [name,prepare]of [['native-presentation-wing-animation',prepareNativePresentationWingAnimation],['native-presentation-articulated-actor',prepareNativePresentationArticulatedActor],['native-presentation-three-part-actor',prepareNativePresentationArticulatedActor],['native-presentation-special-actor',prepareNativePresentationSpecialActor]]){
  const e=fixture(name),provider=resources(e.animationsByIndex??{0:e.animation});
  for(const [i,c]of e.cases.entries()){
   if(c.input.resourceIndex!==0)continue;
   const actorWordsF060=[...e.baseActorWords];for(const [at,w]of c.input.actorOverrides)actorWordsF060[at]=w;
   const q=prepare({...c.input,...provider,actorWordsF060});
   assert.deepEqual(q.operations,c.operations,name+' loaded '+i);assert.equal(digest(q.actorWordsF060),c.actorSHA256);checked++;
  }
 }
 assert.equal(checked,1008);
});

test('canonical drawing uses matching retained bank metadata and rejects a stale provider atomically',()=>{
 for(const [name,update]of [['native-presentation-wing-animation',prepareNativePresentationWingAnimationUpdate],['native-presentation-articulated-actor',prepareNativePresentationArticulatedActorUpdate],['native-presentation-special-actor',prepareNativePresentationSpecialActorUpdate]]){
  const e=fixture(name),provider=resources(e.animationsByIndex??{0:e.animation}),c=e.cases.find(c=>c.input.resourceIndex===0&&c.input.drawType!==12);
  const state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:c.input.courseIndex??0,players:1,mode620:4}));
  state.actorWordsF060=[...e.baseActorWords];for(const [at,w]of c.input.actorOverrides)state.actorWordsF060[at]=w;
  state.resourceWordsE73c=[...provider.resourceWordsE73c];state.graphicsCorners.renderBufferIndex=c.input.bufferIndex;state.scene.activity624=c.input.activity624;
  state.scene.championshipCountAa00=c.input.championshipCountAa00??0;const before=structuredClone(state);
  const q=update(state,{...c.input,animationResources:provider.animationResources,resourceWordsE73c:Array(43).fill(0)});
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(state,before);
  state.resourceWordsE73c[0x48/4]+=4;const changed=structuredClone(state);
  assert.throws(()=>update(state,{...c.input,...provider}),/no longer matches/);assert.deepEqual(state,changed);
 }
});
