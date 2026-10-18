import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {playerInput} from '../player-input.js';
const ri=a=>(a-0x1f94)/4;
const create=id=>createRace({mode:'stunt',physics:'native',course:getCourse(id),waveSeed:17});

for(const [id,minRings]of [['practice',10],['greyhaven',10],['amber',1],['citadel',9],['reed',16],['port',16],['neon',6],['tempest',10],['glacier',5]])test(`${id}: physical Stunt route crosses all checkpoints, drains awards and hands off its final score`,()=>{
 const s=create(id),r=s.racers[0],pilot=createNativeRacePilot({course:s.course});
 const geometry=JSON.stringify({anchors:s.course.anchors,rings:s.course.rings,checkpoints:s.course.checkpoints,ramps:s.course.ramps});
 const checkpointRows=[...s.course.gates.slice(1),s.course.gates[0]].map(q=>q.sourceRow);
 assert.equal(checkpointRows.length,4);
 const crossings=[];let previous=0,finishFrame=null,postraceScore=null;
 for(let frame=0;frame<2400&&s.phase!=='results';frame++){
  stepRace(s,()=>pilot.input(s,r),.05);
  const cp=r.stunt.nextCheckpoint;
  if(cp!==previous){
   assert.equal(cp,previous+1);
   const judge=s.nativeHost.lastStunt.diagnostic.racers[0].checkpoint;
   assert.equal(judge.crossed,true);assert.equal(judge.continueFinish,true);assert.equal(judge.aperture,true);
   assert.equal(judge.sourceRow,checkpointRows[previous]);
   assert.ok(judge.timePoints>=0);assert.ok(judge.crossingOffsetNative>=0&&judge.crossingOffsetNative<=50);
   crossings.push({frame:s.nativeHost.world.frames,remaining:r.stunt.remaining,points:judge.timePoints});previous=cp;
  }
  if(s.phase==='postrace'&&finishFrame===null){finishFrame=s.nativeHost.world.frames;postraceScore=r.stunt.score;}
 }
 assert.equal(s.phase,'results');assert.equal(r.dq,'');assert.equal(r.stunt.complete,true);assert.equal(crossings.length,4);
 assert.ok(finishFrame!==null&&s.nativeHost.world.frames>finishFrame,'the original result animation and fade run');
 assert.ok(r.stunt.rings>=minRings);assert.equal(r.stunt.rings,s.nativeStuntWorld.rings.filter(q=>q.collected).length);
 const awards=s.nativeLaunch.stuntView().awards,raw=s.nativeLaunch.snapshot();
 assert.ok(awards.slots.every(q=>q.type===0));assert.equal(r.stunt.delayedBonus,0);assert.equal(r.stunt.pending,0);
 assert.equal(s.result.score,awards.totals.total);assert.ok(s.result.score>=postraceScore);
 assert.equal(awards.totals.total,awards.totals.time+awards.totals.ring+awards.totals.trick);
 assert.equal(raw.raceWords1f94[ri(0x1fd8)],1,'source record insertion completes after award drain');
 assert.equal(raw.raceWords1f94[ri(0x26e8)+s.course.sourceWaterCourseIndex*12],s.result.score);
 assert.equal(s.nativeResult.exit.consumer,'801ecf18');assert.equal(s.nativeResult.exit.gameState,56);
 assert.equal(s.demoRun,true);assert.equal(s.nativePreview,true);
 assert.equal(JSON.stringify({anchors:s.course.anchors,rings:s.course.rings,checkpoints:s.course.checkpoints,ramps:s.course.ramps}),geometry);
});

const sequences={8:[{KeyE:true},{KeyQ:true}],9:[{KeyD:true},{KeyE:true},{KeyA:true},{KeyQ:true}],17:[{KeyD:true},{KeyQ:true},{KeyA:true},{KeyE:true}]};
function gesture(actor,hz=20,somersault=false){
 const s=create('greyhaven'),a=s.nativeHost.world.adapters[0],actors=new Set();
 const onFrame=s.nativeHost.onFrame;s.nativeHost.onFrame=(...args)=>{actors.add(a.riderLifecycle.state.actorState);return onFrame(...args);};
 for(let i=0;i<hz*15;i++)stepRace(s,()=>playerInput(sequences[actor][s.nativeHost.world.frames-100]??(somersault&&s.nativeHost.world.frames>=104&&s.nativeHost.world.frames<160?{KeyE:true}:{}),null,0,false,{},null,null,true),1/hz);
 return {s,a,actors};
}
test('three ordinary keyboard gestures physically animate and earn the original Stunt pose awards',()=>{
 for(const [actor,kind,points]of [[8,'handstand',310],[9,'backwards',556],[17,'stand',135]]){
  const {s,a,actors}=gesture(actor),r=s.racers[0];
  assert.ok(actors.has(actor));assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(r.dq,'');
  assert.equal(r.stunt.score,points);assert.equal(r.stunt.rings,0);assert.equal(r.stunt.completedTricks[kind],true);assert.equal(r.stunt.tricks,1);
  assert.equal(r.stunt.pending,0);assert.equal(s.nativeLaunch.stuntView().awards.totals.trick,points);
  assert.ok(a.articulatedRider.points.every(p=>Object.values(p.position).every(Number.isFinite)));
 }
});
test('physical Stunt gesture score, body, rider and owner remain identical at30 and144Hz',()=>{
 const outputs=[30,144].map(hz=>{const {s,a}=gesture(17,hz);return {hud:s.nativeStuntHud,world:s.nativeStuntWorld,source:s.nativeLaunch.snapshot(),hull:a.hull,rider:a.articulatedRider,actions:a.riderActions.inputHistory};});
 assert.deepEqual(outputs[0],outputs[1]);
});

test('holding rearward trim after the standing gesture produces a physical somersault and its shared-category award',()=>{
 const {s,a}=gesture(17,20,true),hud=s.nativeStuntHud;
 assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(s.racers[0].dq,'');
 assert.equal(hud.completedTricks.stand,true);assert.equal(hud.completedTricks.somersault,true);
 assert.equal(hud.tricks,2);assert.equal(hud.score,542);assert.equal(hud.pending,0);
 assert.equal(s.nativeLaunch.stuntView().awards.totals.trick,542);
});
