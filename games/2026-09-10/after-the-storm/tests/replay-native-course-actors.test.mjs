import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
const assets=Object.fromEntries([0,2].map(i=>[i,new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)))]));

test('live dolphin replay retains detached complete poses without canonical state, buffers or clock advancement',()=>{
 const state=createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay(){}}});
 const rec=createRecorder();
 for(let i=0;i<12;i++){stepRace(state,{throttle:1},1/60);recordMoment(rec,state,null);}
 const frames=rec.frames.filter(f=>f.nativeCourseActors),a=frames[0],b=frames[1];
 assert.ok(a.nativeCourseActors.presentation.draws.some(d=>d.actorIndex===0));
 assert.deepEqual(Object.keys(a.nativeCourseActors).sort(),['presentation','resourceWords']);
 assert.deepEqual(Object.keys(a.nativeCourseActors.presentation),['draws']);
 assert.equal(a.nativeCourseActors.resourceWords.length,43);
 const canonical=state.nativeLaunch.snapshot(),ticks=state.nativeHost.world.ticks,audio=state.nativeContactAudio.snapshot();
 const clip={frames:[a,b]},copy=structuredClone(a.nativeCourseActors);
 const middle=replaySample(clip,(a.time+b.time)/2),end=replaySample(clip,b.time);
 assert.deepEqual(middle.nativeCourseActors,a.nativeCourseActors);
 assert.deepEqual(end.nativeCourseActors,b.nativeCourseActors);
 middle.nativeCourseActors.presentation.draws.length=0;middle.nativeCourseActors.resourceWords[0]=123;
 assert.deepEqual(a.nativeCourseActors,copy);
 assert.deepEqual(state.nativeLaunch.snapshot(),canonical);assert.equal(state.nativeHost.world.ticks,ticks);
 assert.deepEqual(state.nativeContactAudio.snapshot(),audio);
 assert.notEqual(b.nativeCourseActors.presentation.draws,state.nativeHost.lastCourseActorDisplay.presentation.draws);
});

test('actor absence boundaries never borrow the current live pose and recorder remains bounded',()=>{
 const state=createRace({mode:'practice',course:getCourse('practice')}),rec=createRecorder();
 const presentation={draws:[{actorIndex:0,matrixWorld:[1,2,3]}]},resources=Array(43).fill(0);
 state.phase='running';recordMoment(rec,state,null);
 state.nativeHost={lastCourseActorDisplay:{presentation,state:{resourceWordsE73c:resources}}};state.time=.05;recordMoment(rec,state,null);
 const first=rec.frames[0],second=rec.frames[1];
 assert.equal(Object.hasOwn(first,'nativeCourseActors'),false);
 assert.equal(replaySample({frames:[first,second]},.025).nativeCourseActors,null);
 assert.deepEqual(replaySample({frames:[first,second]},.05).nativeCourseActors.presentation,presentation);
 presentation.draws[0].matrixWorld[0]=99;resources[0]=88;
 assert.equal(second.nativeCourseActors.presentation.draws[0].matrixWorld[0],1);assert.equal(second.nativeCourseActors.resourceWords[0],0);
 delete state.nativeHost;state.time=.1;recordMoment(rec,state,null);const third=rec.frames[2];
 assert.deepEqual(replaySample({frames:[second,third]},.075).nativeCourseActors,second.nativeCourseActors);
 assert.equal(replaySample({frames:[second,third]},.1).nativeCourseActors,null);
 for(let i=3;i<230;i++){state.time=i*.05;recordMoment(rec,state,null);}
 assert.ok(rec.frames.length<=201);assert.ok(rec.frames[0].time>=state.time-10);
});

test('replay holds detached completed scene-effect geometry without effect storage, buffers or clocks',()=>{
 const state=createRace({mode:'practice',physics:'native',course:getCourse('practice'),nativeCourseActors:{assets,onDisplay(){}}});
 const rec=createRecorder();
 for(let i=0;i<90;i++){stepRace(state,{throttle:1,steer:.4},1/60);recordMoment(rec,state,null);}
 const frames=rec.frames.filter(f=>f.nativeSceneEffects?.draws.length),a=frames.at(-2),b=frames.at(-1);
 assert.ok(frames.length>20);assert.deepEqual(Object.keys(a.nativeSceneEffects),['draws']);
 assert.ok(a.nativeSceneEffects.draws.every(d=>['spray','splash','wake','droplet'].includes(d.family)&&!('graphicsBuffers' in d)));
 const canonical=state.nativeLaunch.snapshot(),effects=state.nativeHost.sceneEffects.snapshot(),copy=structuredClone(a.nativeSceneEffects),clip={frames:[a,b]};
 const middle=replaySample(clip,(a.time+b.time)/2),end=replaySample(clip,b.time);
 assert.deepEqual(middle.nativeSceneEffects,a.nativeSceneEffects);assert.deepEqual(end.nativeSceneEffects,b.nativeSceneEffects);
 middle.nativeSceneEffects.draws.length=0;assert.deepEqual(a.nativeSceneEffects,copy);
 assert.notEqual(b.nativeSceneEffects.draws,state.nativeHost.lastSceneEffectDisplay.presentation.draws);
 assert.deepEqual(state.nativeLaunch.snapshot(),canonical);assert.deepEqual(state.nativeHost.sceneEffects.snapshot(),effects);
 const plain=createRecorder(),modern=createRace({mode:'practice',course:getCourse('practice')});modern.phase='running';recordMoment(plain,modern,null);
 assert.equal(Object.hasOwn(plain.frames[0],'nativeSceneEffects'),false);
});
