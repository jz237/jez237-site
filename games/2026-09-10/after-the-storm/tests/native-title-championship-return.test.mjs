import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeTitleMenuReturn as title,prepareNativeChampionshipMenuReturn as championship} from '../native-menu-return-initialization.js';
import {prepareNativeMenuReturnUpdate as update} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const views={connectedMask4340:1,titleAvatarPairsAc44:[[0,1],[2,3],[1,2],[3,0]],
 courseRiderTraits:Array.from({length:12},(_,c)=>Array.from({length:4},(_,r)=>[c*100+r,0x80000000+r,0xffffffff-r])),
 courseResourcePairs:Array.from({length:9},(_,i)=>[i-10,i+20]),
 championshipCourseOrderAc14:[[0,1,2,3,4,5,6,7],[8,9,10,11,0,1,2,3],[4,5,6,7,8,9,10,11]],courseWaves:Array.from({length:12},(_,i)=>i*10-20),otherAvatarsA9b4:[1,2,3],
 fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000],slotTemplateWords6c50:Array(11).fill(0)};
function fixture(){const v=createRace({physics:'native',mode:'time',course:getCourse('sunny-beach')}).nativeLaunch.snapshot();
 Object.assign(v.scene,{gameStateAb24:81,titlePairSelectionA9fc:-1,trainingSelectionDa9f8:0,fortressD8240:0,fortressCourse3a10:7,
  championshipCountAa00:0,variant6f4:0,metadataD9b0:0,rngState4640:0,configuredLaps728:7});
 const bytes=new DataView(new ArrayBuffer(136));bytes.setUint8(0,0x90);
 for(let r=0;r<4;r++)[-128+r,-1-r,127-r].forEach((b,i)=>bytes.setInt8(24+r*14+11+i,b));
 v.saveWordsB280=Array.from({length:34},(_,i)=>bytes.getUint32(i*4));v.profileWordsB330[1]=0;v.profileWordsB330[2]=0;return v;}
test('title return advances counters, reads the saved unlock flag and preserves ordered demo tune writes',()=>{
 const v=fixture();Object.assign(v.scene,{trainingSelectionDa9f8:2,titlePairSelectionA9fc:3,primaryHumanIndex:1});
 const before=structuredClone(v),q=update(v,'title',views),s=q.state.scene;
 assert.deepEqual([s.gameStateAb24,s.main638,s.courseIndex,s.racerCount,s.players,s.configuredLaps728,s.unlockAb60,s.fieldA9ac],[2,0,0,2,1,3,1,1]);
 assert.deepEqual(q.operations.filter(o=>o.field==='trainingSelectionDa9f8').map(o=>o.value),[3,0]);
 assert.deepEqual(q.operations.filter(o=>o.field==='titlePairSelectionA9fc').map(o=>o.value),[4,0]);
 const tunes=q.effects.filter(o=>o.kind==='bodyTuneWordWrite');
 assert.deepEqual(tunes.filter(o=>o.wordIndex===0).map(o=>[o.racerIndex,o.value]),[[0,1],[1,1],[1,0]]);
 assert.deepEqual(tunes.slice(-3).map(o=>o.value),[0,0x80000000,0xffffffff]);
 const primary=q.operations.findLastIndex(o=>o.kind==='bodyTuneWordWrite'&&o.wordIndex===0);
 assert.deepEqual(q.operations[primary+1],{kind:'sourceHalfwordWrite',field:'variant6f6',value:0});
 assert.deepEqual(q.effects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
 assert.equal(q.diagnostic.controllerResetExecuted,true);
 const resource=q.operations.findIndex(o=>o.consumer==='8009684c'),reset=q.operations.findIndex(o=>o.kind==='deviceInputWrite'),fade=q.operations.findIndex(o=>o.kind==='hudWrite');
 assert.ok(resource<reset&&reset<fade);
 assert.deepEqual(v,before);assert.ok(Object.isFrozen(q.state));assert.equal(q.state.profileWordsB330[1],0);
});
test('title counter wraps as signed32; retained high course clamps only the resource pair',()=>{
 const v=fixture();Object.assign(v.scene,{fortressD8240:-1,courseIndex:11,trainingSelectionDa9f8:2147483647});
 v.saveWordsB280[0]=0x80000000;const q=update(v,'title',views);
 assert.equal(q.state.scene.trainingSelectionDa9f8,-2147483648);assert.equal(q.state.scene.unlockAb60,0);assert.equal(q.state.scene.courseIndex,11);
 assert.deepEqual(q.effects.find(o=>o.consumer==='8009684c').arguments,[0x08060000,(-2)>>>0,28]);
 assert.equal(q.effects.find(o=>o.kind==='bodyTuneWordWrite'&&o.wordIndex===1).value,1101);
 v.scene.titlePairSelectionA9fc=2147483647;const before=structuredClone(v);
 assert.throws(()=>update(v,'title',views),/titleAvatarPairsAc44 index/);assert.deepEqual(v,before);
});
test('championship selects the profile course and count, retains configured laps and consumes one shared RNG step',()=>{
 for(const [difficulty,round,course,racers,simulation]of [[0,0,0,1,2],[0,1,1,4,1],[0,2,2,2,2],[0,4,4,1,1],[1,3,11,1,2]]){
  const v=fixture();v.profileWordsB330[1]=round;v.profileWordsB330[2]=difficulty;
  const q=update(v,'championship',views),s=q.state.scene;
  assert.deepEqual([s.gameStateAb24,s.main638,s.courseIndex,s.racerCount,s.simulation648,s.configuredLaps728],[30,8,course,racers,simulation,7]);
  assert.equal(q.state.profileWordsB330[0],course);assert.equal(s.rngState4640,12345);assert.equal(s.championshipCountAa00,course===0?1:0);
  assert.deepEqual(q.effects.find(o=>o.consumer==='80096960').arguments,course===1?[0,0,1,2,3]:[1,0,1,0,0]);
  assert.deepEqual(q.effects.at(-1),{kind:'externalCall',consumer:'800c21f4',arguments:[2,course]});
 }
});
test('championship preserves fortress intermediate write, signed counter boundary, and duplicate body-slot updates',()=>{
 for(const [before,after]of [[-32768,-32767],[9998,9999],[9999,9999],[32767,32767]]){
  const v=fixture();Object.assign(v.scene,{fortressD8240:1,championshipCountAa00:before});
  const q=update(v,'championship',views);
  assert.equal(q.state.scene.championshipCountAa00,after);
  assert.deepEqual(q.operations.filter(o=>o.kind==='profileWrite').map(o=>o.value),[7,0]);
 }
 const v=fixture();v.profileWordsB330[1]=2;Object.assign(v.scene,{secondaryHumanIndex:2,variant6f4:-1,metadataD9b0:1});
 const q=update(v,'championship',views),tunes=q.effects.filter(o=>o.kind==='bodyTuneWordWrite'&&o.racerIndex===2);
 assert.deepEqual(tunes.map(o=>o.value),[1,(-127)>>>0,(-2)>>>0,126,2,(-126)>>>0,(-3)>>>0,125]);
 // Seed0 yields candidate1, matching the primary: the source advances to2.
 assert.deepEqual(q.effects.find(o=>o.consumer==='80096960').arguments,[1,5,2,0,0]);
});
test('unavailable tables and late fade input reject without partially committing; unused fortress word is optional',()=>{
 const v=fixture();delete v.scene.fortressCourse3a10;
 assert.doesNotThrow(()=>title(v,views));assert.doesNotThrow(()=>championship(v,views));
 for(const [destination,bad]of [['title',{...views,courseResourcePairs:[]}],['championship',{...views,otherAvatarsA9b4:[4,2,3]}],['championship',{...views,slotTemplateWords6c50:[]}]]){
  const before=structuredClone(v);assert.throws(()=>update(v,destination,bad),RangeError);assert.deepEqual(v,before);
 }
 v.profileWordsB330[2]=0xffffffff;assert.throws(()=>championship(v,views),RangeError);
});
test('sparse reached trait and resource rows reject instead of silently omitting writes',()=>{
 const v=fixture(),badTraits=structuredClone(views);delete badTraits.courseRiderTraits[0][1][1];
 assert.throws(()=>title(v,badTraits),RangeError);
 const badPair=structuredClone(views);delete badPair.courseResourcePairs[0][1];
 assert.throws(()=>title(v,badPair),RangeError);assert.throws(()=>championship(v,badPair),RangeError);
 const badRiders=structuredClone(views);delete badRiders.otherAvatarsA9b4[1];
 assert.throws(()=>championship(v,badRiders),RangeError);
});
test('title reset reads the host connection mask, preserves disconnected data and rejects a missing mask atomically',()=>{
 const v=fixture();v.deviceWords4308.fill(0xffffffff);v.menuWordsE658.fill(0xa5a5a5a5);const before=structuredClone(v);
 const q=update(v,'title',{...views,connectedMask4340:5});
 const bytes=q.state.deviceWords4308.flatMap(w=>[w>>>24,(w>>>16)&255,(w>>>8)&255,w&255]);
 assert.deepEqual(bytes,[...Array(10).fill(0),...Array(10).fill(255),...Array(10).fill(0),...Array(10).fill(255)]);
 assert.deepEqual(q.state.menuWordsE658,v.menuWordsE658);
 assert.throws(()=>update(v,'title',{...views,connectedMask4340:undefined}),RangeError);assert.deepEqual(v,before);
 const limited={...views,courseRiderTraits:views.courseRiderTraits.slice(0,1)};
 assert.doesNotThrow(()=>title(v,limited));v.scene.fortressD8240=1;v.scene.courseIndex=1;assert.throws(()=>title(v,limited),RangeError);
});

function resourceFixture(){
 const value=fixture();value.resourceWordsB330=Array.from({length:36},(_,i)=>0x11110000+i);
 value.resourceWordsB538=Array.from({length:8},(_,i)=>0x22220000+i);value.resourceWordsE73c=Array.from({length:43},(_,i)=>0x33330000+i);
 return {value,source:{...views,riderOrder6ef0:[0,2,3,1],defaultRiderTraits:Array.from({length:4},()=>[5,5,5]),
  riderDescriptorRowsABD0:Array.from({length:16},(_,id)=>[100+id,200+id,300+id,400+id]),
  avatarLookupWordsACD0:Array.from({length:8},(_,id)=>Array.from({length:51},(_,i)=>id*1000+i)),
  mode0BaseWordsAB90:[10,20,30,40],mode2BaseWordsABA0:[10,20,30,40,50,60,70,80],
  courseResourcePairs:Array.from({length:9},()=>[0,-1]),courseDescriptorRowsB4a8:Array.from({length:9},(_,i)=>[100+i,200+i,300+i,400+i]),
  courseByteLengthWordsCE18:Array(9).fill(65)}};
}
test('return resource expansion consumes title, rider and championship initializers at their source positions',()=>{
 for(const destination of ['title','rider','championship']){
  const {value,source}=resourceFixture(),before=structuredClone(value),q=update(value,destination,source,{expandResourceInitializers:true});
  assert.deepEqual(q.diagnostic.expandedResourceConsumers,destination==='rider'?['80096960']:['80096960','8009684c']);
  assert.ok(q.effects.every(o=>o.consumer!=='80096960'&&o.consumer!=='8009684c'));
  assert.equal(q.state.resourceWordsB330.length,36);assert.equal(q.state.resourceWordsE73c[0],destination==='rider'?3:1);
  if(destination==='rider'){
   assert.deepEqual(Array.from({length:8},(_,i)=>q.state.resourceWordsB330[i*4]),[100,101,102,103,104,105,106,107]);
   assert.deepEqual(q.state.resourceWordsB330.slice(32),[0,0,0,0]);assert.deepEqual(q.state.resourceWordsB538,before.resourceWordsB538);
  }else{
   assert.deepEqual(q.state.resourceWordsB330.slice(8,12),[0,0,0,0]);assert.deepEqual(q.state.resourceWordsB330.slice(12),before.resourceWordsB330.slice(12));
   assert.equal(q.state.resourceWordsB538[3],0x60000);assert.deepEqual(q.state.resourceWordsB538.slice(4,6),before.resourceWordsB538.slice(4,6));
  }
  const resource=q.operations.findIndex(o=>o.kind==='resourceWrite'),fade=q.operations.findIndex(o=>o.kind==='hudWrite'&&o.byteOffset===0x8a10-0x7788);
  assert.ok(destination==='championship'?fade<resource:resource<fade);
  assert.equal(q.diagnostic.resourceLoadingPerformed,false);assert.deepEqual(value,before);
 }
});
test('extended menu resources require retained storage and late failures leave controller/profile/HUD owners unchanged',()=>{
 const {value,source}=resourceFixture(),before=structuredClone(value);
 const short={...value,resourceWordsB330:value.resourceWordsB330.slice(0,20)};
 assert.throws(()=>update(short,'rider',source,{expandResourceInitializers:true}),/36/);
 const bad=structuredClone(source);bad.courseDescriptorRowsB4a8[0][3]=NaN;
 assert.throws(()=>update(value,'title',bad,{expandResourceInitializers:true}),RangeError);assert.deepEqual(value,before);
 assert.throws(()=>update(value,'rider',source,{expandResourceInitializers:1}),TypeError);
 const q=update(value,'rider',source);assert.deepEqual(q.state.resourceWordsB330,value.resourceWordsB330);assert.deepEqual(q.diagnostic.expandedResourceConsumers,[]);
});
