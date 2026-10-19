import test from 'node:test';
import assert from 'node:assert/strict';
import {createRaceWater,createRaceWaterRandom,advanceRaceWaterFrame,stepRaceWater,captureRaceWater,readRaceWater,
 setRaceWater,currentRaceWater,activeRaceWaterHeight,raceWaterHeight,raceWaterAISelectionCircle,raceWaterActorMotionInputs} from '../race-water.js';
import {sourceWaterConditions} from '../source-water-conditions.js';
import {createNativeWaterField,forceNativeWaterLine,createNativeWaterPatch,stepNativeWaterPatch} from '../native-water-field.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {wave,createState} from '../simulation.js';
import {captureWindowFrame,readWindowFrame} from '../player-window-presentation.js';
import {createRecorder,recordMoment,replayClip,replaySample} from '../instant-replay.js';

const craft=(x=0,z=0)=>({x,z,heading:0,hydro:{y:0}});
const make=(crafts=[craft()],options={})=>createRaceWater({crafts,baseAmplitudeNative:20,seed:17,...options});
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('source gameplay amplitudes distinguish every venue and player count, with Stunt forced1P',()=>{
 const a=[20,20,20,40,10,30,20,25,25],b=[15,15,15,35,5,20,15,20,20];
 for(let courseIndex=0;courseIndex<9;courseIndex++)for(const players of [1,2]){
  assert.deepEqual(sourceWaterConditions({courseIndex,players}),{courseIndex,variant:0,players,baseAmplitudeNative:(players===1?a:b)[courseIndex],seaChoice:0,customSea:false,period:20});
  assert.equal(sourceWaterConditions({courseIndex,players,stunt:true,seaChoice:2}).baseAmplitudeNative,a[courseIndex]);
  assert.equal(sourceWaterConditions({courseIndex,players,reverse:true,seaChoice:2}).baseAmplitudeNative,a[courseIndex]);
 }
 assert.equal(sourceWaterConditions({courseId:'neon',seaChoice:1}).baseAmplitudeNative,10);
 assert.equal(sourceWaterConditions({courseId:'neon',seaChoice:2}).baseAmplitudeNative,40);
 for(const sample of [0,13,30])assert.equal(sourceWaterConditions({courseIndex:6,seaChoice:3,random31:sample}).baseAmplitudeNative,sample+10);
 assert.throws(()=>sourceWaterConditions({courseIndex:6,seaChoice:3}));
 assert.throws(()=>sourceWaterConditions({courseIndex:9}));
});
test('source water uses the low15 bits of its32bit LCG and permits seed0',()=>{
 const random=createRaceWaterRandom(17);
 for(const [value,state]of [[25974,1579902326],[22391,3232257911],[12260,794669028]]){assert.equal(random(),value);assert.equal(random.state,state);}
 assert.equal(createRaceWaterRandom(0)(),12345);
});

test('water retains the source AI circle only after its first completed frame',()=>{
 const c=craft(12,-24),s=make([c]);
 assert.throws(()=>raceWaterAISelectionCircle(s),/completed source water frame/);
 stepRaceWater(s,[c],.025);assert.throws(()=>raceWaterAISelectionCircle(s),/completed source water frame/);
 stepRaceWater(s,[c],.025);
 const circle=raceWaterAISelectionCircle(s),mesh=s.selectionMeshesNative[0];
 assert.equal(circle,mesh.selectionCircleNative);assert.equal(circle.radiusSquared,2250000);
 assert.deepEqual(mesh.snappedCenterNative,{x:s.previousPatchCentersNative[0].xNative,z:s.previousPatchCentersNative[0].zNative});
 assert.ok(Object.isFrozen(circle)&&Object.isFrozen(mesh)&&Object.isFrozen(s.selectionMeshesNative));
 assert.notDeepEqual({x:circle.x,z:circle.z},{x:s.lastPlan.patches[0].xNative,z:s.lastPlan.patches[0].zNative});
 c.x+=30;stepRaceWater(s,[c],1,{active:false});assert.equal(raceWaterAISelectionCircle(s),circle);
 stepRaceWater(s,[c],.05);assert.notDeepEqual(raceWaterAISelectionCircle(s),circle);
 assert.equal(circle,mesh.selectionCircleNative);assert.throws(()=>raceWaterAISelectionCircle(captureRaceWater(s)),/host race water/);
});

test('AI reads patch0 despite reverse two-player generation order and inactive water evolution',()=>{
 const crafts=[craft(0,0),craft(100,50)],s=make(crafts,{initialNoise:false});
 advanceRaceWaterFrame(s,crafts,{simulationActive:false});
 assert.deepEqual(s.lastPlan.patches.map(p=>p.playerIndex),[1,0]);
 assert.equal(s.selectionMeshesNative[0].patchIndex,0);assert.equal(s.selectionMeshesNative[1].patchIndex,1);
 assert.equal(raceWaterAISelectionCircle(s),s.selectionMeshesNative[0].selectionCircleNative);
 assert.notDeepEqual(s.selectionMeshesNative[0].selectionCircleNative,s.selectionMeshesNative[1].selectionCircleNative);
 const circle=raceWaterAISelectionCircle(s),field=structuredClone(s.field);
 crafts[0].x=80;crafts[0].heading=1;advanceRaceWaterFrame(s,crafts,{simulationActive:false});
 assert.notDeepEqual(raceWaterAISelectionCircle(s),circle);assert.deepEqual(s.field,field);
});

test('selection preparation failure cannot partially evolve the field or replace prior circles',()=>{
 const c=craft(),s=make([c]);advanceRaceWaterFrame(s,[c]);
 s.selectionRadiusNative=NaN;const before=structuredClone(s);
 assert.throws(()=>advanceRaceWaterFrame(s,[c]),/selectionRadiusNative/);
 assert.deepEqual(s,before);
});
test('actor water inputs expose completed native patch0 words and the owned relocation radius',()=>{
 const crafts=[craft(12,-24),craft(100,50)],s=make(crafts,{selectionRadiusNative:1024,initialNoise:false});
 assert.throws(()=>raceWaterActorMotionInputs(s),/completed source water frame/);
 advanceRaceWaterFrame(s,crafts,{simulationActive:false});
 const before=structuredClone(s),a=raceWaterActorMotionInputs(s),bits=new DataView(new ArrayBuffer(4));
 const values=a.waterRangeWords2428.map(w=>{bits.setUint32(0,w);return bits.getFloat32(0);});
 const circle=raceWaterAISelectionCircle(s);
 assert.deepEqual(values,[circle.x,circle.z,circle.radiusSquared]);assert.equal(a.radius4720,1024);
 assert.deepEqual(s,before);assert.ok(Object.isFrozen(a)&&Object.isFrozen(a.waterRangeWords2428));
 assert.throws(()=>{a.waterRangeWords2428[0]=0;},TypeError);
 crafts[0].x+=100;crafts[0].heading=1;advanceRaceWaterFrame(s,crafts,{simulationActive:false});
 assert.notDeepEqual(raceWaterActorMotionInputs(s),a);
 assert.deepEqual(a.waterRangeWords2428.map(w=>{bits.setUint32(0,w);return bits.getFloat32(0);}),values);
 assert.throws(()=>raceWaterActorMotionInputs({...s}),/host race water/);
});
test('actor water inputs reject display snapshots, stale menu circles and invalid relocation data',()=>{
 const c=craft(),s=make([c]);advanceRaceWaterFrame(s,[c]);
 assert.throws(()=>raceWaterActorMotionInputs(captureRaceWater(s)),/host race water/);
 s.menuActive=true;assert.throws(()=>raceWaterActorMotionInputs(s),/race water scene/);
 s.menuActive=false;s.selectionRadiusNative=NaN;assert.throws(()=>raceWaterActorMotionInputs(s),/signed32/);
});
test('race water seed matches normalized ghost setup metadata',()=>{
 const a=createRace({mode:'time',waveSeed:1014}),b=createRace({mode:'time',waveSeed:a.waveSeed});
 assert.equal(a.waveSeed,17);assert.equal(a.raceWater.seed,17);assert.deepEqual(a.raceWater.field.heightQ,b.raceWater.field.heightQ);
});
test('water uses one logical update per50ms and ignores paused elapsed time',()=>{
 const c=craft(),s=make([c]);stepRaceWater(s,[c],.025);assert.equal(s.frames,0);
 const before=s.field.heightQ.slice();stepRaceWater(s,[c],1,{active:false});assert.deepEqual(s.field.heightQ,before);assert.equal(s.remainder,.025);
 stepRaceWater(s,[c],.025);assert.equal(s.frames,1);assert.equal(s.field.phaseCounter,1);assert.equal(s.field.patchUpdates,1);
 assert.equal(s.remainder,0);assert.equal(s.stepsLast,1);
});
test('stationary water histories match across30/60/144Hz host accumulation',()=>{
 const histories=[];
 for(const hz of [30,60,144]){const c=craft(12,-24),s=make([c]);for(let i=0;i<hz*3;i++)stepRaceWater(s,[c],1/hz);assert.equal(s.frames,60);histories.push(s);}
 for(const s of histories.slice(1)){assert.deepEqual(s.field.heightQ,histories[0].field.heightQ);assert.deepEqual(s.field.velocityQ,histories[0].field.velocityQ);assert.deepEqual(s.previousPatchCentersNative,histories[0].previousPatchCentersNative);assert.deepEqual(s.selectionMeshesNative,histories[0].selectionMeshesNative);}
});
test('forcing uses the prior snapped camera while the after-hull camera selects new patches',()=>{
 const c=craft(),s=make([c],{initialNoise:false}),oldCamera=s.cameras[0],oldCenter={...s.previousPatchCentersNative[0]};
 c.x=7;c.z=3;c.heading=Math.PI/2;advanceRaceWaterFrame(s,[c]);
 const call=s.lastPlan.forcing[0];
 near(call.xNative,Math.fround(oldCenter.xNative+Math.fround(s.field.parameters.radius*64*oldCamera.horizontalForward[0])),1e-4);
 near(call.zNative,Math.fround(oldCenter.zNative+Math.fround(s.field.parameters.radius*64*oldCamera.horizontalForward[1])),1e-4);
 assert.notEqual(s.cameras[0],oldCamera);assert.equal(s.previousPositions[0].x,280);
 const independent=createNativeWaterField();
 for(const q of s.lastPlan.forcing)forceNativeWaterLine(independent,q);
 for(const q of s.lastPlan.patches)stepNativeWaterPatch(independent,createNativeWaterPatch(independent,q));
 assert.deepEqual(s.field.heightQ,independent.heightQ);assert.deepEqual(s.field.velocityQ,independent.velocityQ);
});
test('two-player water evolves overlapping patches twice in P2thenP1 order',()=>{
 const crafts=[craft(),craft(.1,.2)],s=make(crafts),prior=s.field.heightQ.slice();advanceRaceWaterFrame(s,crafts);
 assert.deepEqual(s.lastPlan.patches.map(q=>q.playerIndex),[1,0]);assert.equal(s.field.patchUpdates,2);
 assert.notDeepEqual(s.field.heightQ,prior);
 const independent=createNativeWaterField({players:2});independent.heightQ.set(prior);
 for(const q of s.lastPlan.forcing)forceNativeWaterLine(independent,q);
 for(const q of s.lastPlan.patches)stepNativeWaterPatch(independent,createNativeWaterPatch(independent,q));
 assert.deepEqual(s.field.heightQ,independent.heightQ);
});
test('read-only snapshots preserve negative coordinates, full signed heights and datum without solver history',()=>{
 const c=craft(),s=make([c],{datumNative:-100});s.field.heightQ[0]=-1;s.field.heightQ[1]=32767;
 const view=captureRaceWater(s),read=readRaceWater(structuredClone(view));assert.ok(read);
 assert.notEqual(view.heightQ.buffer,s.field.heightQ.buffer);assert.notEqual(read.heightQ.buffer,view.heightQ.buffer);
 assert.deepEqual(Object.keys(view).sort(),['datumNative','heightQ','revision','scale']);
 for(const p of [[0,0],[-.001,-.001],[3,4],[-203.2,-311.9]]){setRaceWater(s);const h=activeRaceWaterHeight(...p);setRaceWater(read);near(activeRaceWaterHeight(...p),h);near(h,raceWaterHeight(s,...p));}
 assert.throws(()=>advanceRaceWaterFrame(read,[c]));
 for(const change of [{heightQ:new Int16Array(128)},{heightQ:new Float32Array(128*384)},{datumNative:32768},{scale:NaN},{revision:-1}])assert.equal(readRaceWater({...view,...change}),false);
 setRaceWater(null);
});
test('two live races own separate fields and pause/replay cannot advance their water',()=>{
 const a=createRace({mode:'time',waveSeed:17}),b=createRace({mode:'time',waveSeed:23});
 assert.ok(a.raceWater&&b.raceWater);assert.notDeepEqual(a.raceWater.field.heightQ,b.raceWater.field.heightQ);
 a.phase='running';b.phase='running';const bBefore=b.raceWater.field.heightQ.slice();
 for(let i=0;i<3;i++)stepRace(a,{},1/60);assert.equal(a.raceWater.frames,1);assert.deepEqual(b.raceWater.field.heightQ,bBefore);
 assert.equal(currentRaceWater(),a.raceWater);near(wave(10,-20,a.time),raceWaterHeight(a.raceWater,10,-20));
 const before=captureRaceWater(a.raceWater);a.phase='paused';stepRace(a,{throttle:1},1/60);assert.deepEqual(captureRaceWater(a.raceWater),before);
 createState();assert.equal(currentRaceWater(),null);
});
test('separate window validation copies source heights and rejects malformed water frames',()=>{
 const state=createRace({mode:'versus'}),native=captureRaceWater(state.raceWater);
 const water={native,wake:[],impacts:[],craft:[],level:0},wire=captureWindowFrame(state,water),view=readWindowFrame(structuredClone(wire));assert.ok(view);
 const value=view.water.native.heightQ[0];native.heightQ[0]++;assert.equal(view.water.native.heightQ[0],value);
 const bad=structuredClone(wire);bad.water.native.heightQ=new Int16Array(3);assert.equal(readWindowFrame(bad),null);
 assert.equal(view.water.native.velocityQ,undefined);
});
test('recorded water is bounded display history and replay sampling leaves host phase untouched',()=>{
 const state=createRace({mode:'time'}),rec=createRecorder();state.phase='running';
 for(let i=0;i<210;i++){for(let j=0;j<3;j++)stepRace(state,{},1/60);recordMoment(rec,state,{native:captureRaceWater(state.raceWater)});}
 assert.ok(rec.frames.length<=201);const clip=replayClip(rec);assert.ok(clip);
 const phase=state.raceWater.field.phaseCounter,frames=state.raceWater.frames,heights=state.raceWater.field.heightQ.slice();
 const sample=replaySample(clip,(clip.start+clip.end)/2);setRaceWater(sample.water.native);wave(0,0,sample.time);
 assert.equal(state.raceWater.field.phaseCounter,phase);assert.equal(state.raceWater.frames,frames);assert.deepEqual(state.raceWater.field.heightQ,heights);
 setRaceWater(state.raceWater);
});
test('custom browser seas keep their existing independent water model',()=>{
 for(const seaState of ['calm','chop','storm','surf']){const s=createRace({course:getCourse('neon'),seaState});assert.equal(s.raceWater,null);assert.equal(currentRaceWater(),null);}
});
