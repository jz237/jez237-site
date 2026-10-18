import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
import {playerInput} from '../player-input.js';

const gestures={1:['KeyA','KeyD'],2:['KeyD','KeyA'],3:['KeyE','KeyQ'],4:['KeyQ','KeyE']};
// Fresh grid, unchanged source ramp/waves, actual keyboard controls. Four
// straight-throttle frames on either side isolate the gesture from the helm's
// own steering history. No airborne placement, action override or score edit.
function drive(kind,{hold=kind===3?15:1,hz=60}={}){
 const s=createRace({course:getCourse('greyhaven'),mode:'stunt',physics:'native',waveSeed:17}),r=s.racers[0];
 const a=s.nativeHost.world.adapters[0],pilot=createNativeRacePilot({course:s.course}),events=[];
 const initialGeometry=JSON.stringify({rings:s.course.rings,ramps:s.course.ramps,anchors:s.course.anchors});
 const original=s.nativeHost.world.afterFrame;
 s.nativeHost.world.afterFrame=(...args)=>{
  const result=original(...args);
  events.push({frame:s.nativeHost.world.frames,action:a.actionState.action,actor:a.lastFrame.actorState,
   wet:a.wetState.wetCountC78,landing:structuredClone(a.lastFrame.landing),
   trick:s.nativeLaunch.stuntView().awards.totals.trick,pending:r.stunt.pending});
  return s.nativeHost.world.frames===600?false:result;
 };
 for(let i=0;i<40*hz&&s.nativeHost.world.frames<600;i++)stepRace(s,()=>{
  const helm=pilot.input(s,r),delta=s.nativeHost.world.frames-539;
  if(delta< -4||delta>hold+4)return helm;
  const keys={KeyW:true};if(delta>=0&&delta<=hold)keys[gestures[kind][delta===0?0:1]]=true;
  return playerInput(keys,null,0,false,{},null,null,true);
 },1/hz);
 assert.equal(s.nativeHost.world.frames,600);assert.equal(s.nativeHost.world.remainder,0);
 assert.equal(s.phase,'running');assert.equal(r.dq,'');
 assert.equal(JSON.stringify({rings:s.course.rings,ramps:s.course.ramps,anchors:s.course.anchors}),initialGeometry);
 return {s,a,events};
}

for(const [kind,flag,points,move]of [[1,'positiveRoll',47,4],[2,'negativeRoll',50,3],[4,'flip',79,5],[3,'dive',680,11]]){
 test(`fresh-grid ${flag} gesture reaches its physical action and original ${points}-point award`,()=>{
  const {s,events}=drive(kind),hud=s.nativeStuntHud;
  assert.ok(events.some(e=>e.action===kind&&e.wet===0),'the gesture activates during real airborne travel');
  assert.ok(events.some(e=>e.landing.move===move));
  if(kind!==3){
   const settled=events.filter(e=>e.landing.settled);assert.equal(settled.length,1);assert.equal(settled[0].landing.move,6);
   assert.ok(settled[0].landing.effects.some(e=>e.consumer==='800c35b4'));
   assert.equal(settled[0].trick,0,'landing precedes queued display transfer');
  }else assert.ok(events.some(e=>e.actor===25));
  assert.equal(hud.completedTricks[flag],true);assert.equal(hud.tricks,1);assert.equal(hud.pending,0);
  assert.equal(s.nativeLaunch.stuntView().awards.totals.trick,points);
  assert.ok(events.some(e=>e.pending>0));assert.equal(events.at(-1).trick,points);
 });
}

test('a physically over-held flip fails landing and cannot receive a successful trick award',()=>{
 const {s,events}=drive(4,{hold:5}),settled=events.filter(e=>e.landing.settled);
 assert.ok(events.some(e=>e.action===4));assert.equal(settled.length,1);assert.equal(settled[0].landing.move,8);
 assert.equal(settled[0].landing.effects.some(e=>e.consumer==='800c35b4'),false);
 assert.equal(s.nativeStuntHud.completedTricks.flip,false);assert.equal(s.nativeStuntHud.pending,0);
 assert.equal(s.nativeLaunch.stuntView().awards.totals.trick,0);
});

test('fresh-grid aerial flip and settlement have identical physical and scoring histories at30 and144Hz',()=>{
 const runs=[30,144].map(hz=>{const {s,a,events}=drive(4,{hz});return {events,hud:s.nativeStuntHud,
  source:s.nativeLaunch.snapshot(),hull:a.hull,rider:a.articulatedRider,actions:a.riderActions.inputHistory,
  world:s.nativeStuntWorld};});
 assert.deepEqual(runs[0],runs[1]);
});
