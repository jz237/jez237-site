import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {stepNativeAIRandom} from '../native-ai-initialization.js';
import {prepareNativeRiderActionStartup,NATIVE_RIDER_ACTION_LIMITS} from '../native-rider-action-startup.js';
import {playerInput,createInputSampler} from '../player-input.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-rider-action-startup-reference.json',import.meta.url)));
const create=(mode='time',extra={})=>createRace({mode,physics:'native',course:getCourse('greyhaven'),waveSeed:123,...extra});
const sequences={8:[{KeyE:true},{KeyQ:true}],9:[{KeyD:true},{KeyE:true},{KeyA:true},{KeyQ:true}],17:[{KeyD:true},{KeyQ:true},{KeyA:true},{KeyE:true}]};
const fromKeys=keys=>playerInput(keys??{},null,0,false,{},null,null,true);
function run(actor,hz=20){
 const s=create(),a=s.nativeHost.world.adapters[0],sequence=sequences[actor],events=[];
 const before=s.nativeHost.onFrame;s.nativeHost.onFrame=(...args)=>{const state=a.riderLifecycle.state;
  events.push({frame:a.logicalFrames,actor:state.actorState,pending:state.pendingActor,animation:state.animationFrame,
   effects:structuredClone(a.riderLifecycle.lastEffects),rng:s.nativeLaunch.snapshot().scene.rngState4640});return before?.(...args);};
 const input=(_,frame)=>fromKeys(sequence[frame-160]);
 for(let i=0;i<hz*12;i++)stepNativeRaceHost(s.nativeHost,1/hz,[input]);
 return {s,a,events,commands:s.nativeContactAudio.drain()};
}

test('original partial startup stores retain untouched gesture/idle fields and use the shared input epoch',()=>{
 assert.deepEqual(NATIVE_RIDER_ACTION_LIMITS,reference.constants);
 for(const c of reference.cases){const before=structuredClone(c.input);assert.deepEqual(prepareNativeRiderActionStartup(c.input,c.tick),c.expected);assert.deepEqual(c.input,before);}
 const c=reference.cases[0];assert.throws(()=>prepareNativeRiderActionStartup(c.input,-1));
 assert.throws(()=>prepareNativeRiderActionStartup({...c.input,idleChoice16c4:undefined},0));
});

test('ordinary keyboard gestures enter all three physical action poses and each completion emits one original cue',()=>{
 for(const actor of [8,9,17]){
  const {s,a,events,commands}=run(actor),entered=events.filter(e=>e.actor===actor),feedback=events.filter(e=>e.effects.some(q=>q.kind==='actionPoseCue'));
  assert.ok(entered.length>15,`actor${actor} must physically animate`);assert.equal(feedback.length,1);
  assert.equal(feedback[0].effects.find(q=>q.kind==='actionPoseCue').actorState,actor);
  assert.equal(a.riderLifecycle.state.actorState,22);assert.equal(s.racers[0].dq,'');
  const cues=commands.filter(c=>c.arguments[0]===0x06000b00&&c.frame>0);
  assert.equal(cues.length,1);assert.equal(cues[0].frame,feedback[0].frame);assert.ok([8,9].includes(cues[0].arguments[1]));
  assert.ok(a.articulatedRider.points.every(p=>Object.values(p.position).every(Number.isFinite)));
 }
});

test('gesture playback, shared clock, action history, physical state and audio are independent of30/60/144Hz refresh',()=>{
 const outputs=[30,60,144].map(hz=>{const {s,a,events,commands}=run(9,hz);return {events,commands,canonical:s.nativeLaunch.snapshot(),
  hull:a.hull,rider:a.articulatedRider,actions:a.riderActions.inputHistory,controls:a.controlState};});
 assert.deepEqual(outputs[1],outputs[0]);assert.deepEqual(outputs[2],outputs[0]);
});

test('idle pose consumes exactly one shared gameplay draw after101 qualifying frames and returns through the real blend',()=>{
 const s=create(),a=s.nativeHost.world.adapters[0],initial=s.nativeLaunch.snapshot().scene.rngState4640;
 const expected=stepNativeAIRandom(initial);let ordinaryAt=0,idleAt=0,returned=false;
 for(let frame=1;frame<=225;frame++){
  stepNativeRaceHost(s.nativeHost,.05,[{}]);const r=a.riderLifecycle.state,g=s.nativeLaunch.snapshot().scene;
  if(!ordinaryAt&&r.actorState===22&&r.pendingActor<0)ordinaryAt=frame;
  if(!idleAt&&r.actorState===10){idleAt=frame;assert.equal(a.riderActions.idleChoice16c4,expected.value&3);}
  assert.equal(g.rngState4640,idleAt?expected.rngState:initial,'no speculative draw during input capture or ordinary motion');
  if(idleAt&&r.actorState===22&&r.pendingActor<0)returned=true;
 }
 assert.equal(idleAt-ordinaryAt,101);assert.ok(returned);
});

test('each captured rider view reads canonical records but draws from the latest shared RNG when called',()=>{
 const s=create('versus'),runtime=s.nativeLaunch,seed=runtime.snapshot().scene.rngState4640;
 const first=runtime.riderActionContext(0),second=runtime.riderActionContext(1),one=stepNativeAIRandom(seed),two=stepNativeAIRandom(one.rngState);
 assert.equal(runtime.snapshot().scene.rngState4640,seed);assert.equal(second.randomUnsigned32(),one.value);assert.equal(first.randomUnsigned32(),two.value);
 assert.equal(runtime.snapshot().scene.rngState4640,two.rngState);
 s.racers[1].dq='prepared terminal record';const view=runtime.riderActionContext(1);
 assert.notEqual(view.poseCompletion.record2c24,0);assert.equal(first.poseCompletion.record2c24,0);
 assert.equal(view.poseCompletion.racerIndex,1);assert.equal(view.poseCompletion.primaryRacerIndex,runtime.snapshot().scene.primaryHumanIndex);
});

test('retained unsigned input clock wraps after the frame, advances through simulation0 and holds during browser pause',()=>{
 for(const c of reference.clocks){
  const retained=create().nativeLaunch.snapshot();retained.scene.inputTick1960=c.input;
  const runtime=create('time',{nativeInitialRaceState:retained}).nativeLaunch;
  assert.deepEqual(runtime.advanceInputClock(),{previous:c.input,value:c.expected});assert.equal(runtime.inputClock(),c.expected);
 }
 const initial=create().nativeLaunch.snapshot();initial.scene.inputTick1960=0xffffffff;initial.scene.simulation648=0;
 const s=create('time',{nativeInitialRaceState:initial}),h=s.nativeHost,a=h.world.adapters[0];
 assert.equal(a.riderActions.inputHistory.gestureTick15f0,0xffffffff);
 stepNativeRaceHost(h,.05,[{}]);assert.equal(a.lastControls.state.tick,0xffffffff);assert.equal(s.nativeLaunch.inputClock(),0);
 assert.deepEqual(h.lastInputClock,{previous:0xffffffff,value:0});assert.equal(h.world.ticks,0);
 const before=s.nativeLaunch.snapshot();stepNativeRaceHost(h,1,[{}],{active:false});assert.deepEqual(s.nativeLaunch.snapshot(),before);
 stepNativeRaceHost(h,.05,[{}]);assert.equal(a.lastControls.state.tick,0);assert.equal(s.nativeLaunch.inputClock(),1);
});

test('native keyboard and separate-player sampling reach circle thresholds without changing analog or modern steering',()=>{
 const sample=createInputSampler(()=>null,()=>true),pair=sample({KeyA:true,ArrowRight:true},{},[null,null],true);
 assert.equal(pair[0].steer,1);assert.equal(pair[1].steer,-1);
 assert.equal(playerInput({KeyA:true},null).steer,.8);
 const pad={connected:true,axes:[.5,0,0,0],buttons:Array.from({length:17},()=>({value:0,pressed:false}))};
 assert.equal(playerInput({},pad).steer,playerInput({},pad,0,false,{},null,null,true).steer);
});
