import test from 'node:test';
import assert from 'node:assert/strict';
import {createGamepadRumble,updateGamepadRumble,resetGamepadRumble,DEFAULT_RUMBLE_PREFERENCES,RUMBLE_INTERVAL_MS} from '../gamepad-rumble.js';

function game(mode='race'){const racer=player=>({id:player,player,human:true,collision:0,speed:18,finishTime:null,dq:'',hydro:{landingId:0,impact:0,load:1,wet:1,airborne:false}});return {phase:'running',mode,racers:mode==='versus'?[racer(0),racer(1)]:[racer(0)]};}
function pad(index=0){const calls=[],resets=[],actuator={effects:['dual-rumble'],playEffect(type,params){calls.push({type,...params});return Promise.resolve('complete');},reset(){resets.push(true);return Promise.resolve('complete');}};return {index,id:'fake-'+index,connected:true,vibrationActuator:actuator,calls,resets};}
function setup(mode='race',preferences=DEFAULT_RUMBLE_PREFERENCES){const mixer=createGamepadRumble(),state=game(mode),pads=[pad(0),pad(1)],update=now=>updateGamepadRumble(mixer,state,pads,preferences,now);update(0);return {mixer,state,pads,update};}

test('first observation never invents collision or landing feedback',()=>{
 const mixer=createGamepadRumble(),state=game(),p=pad();state.racers[0].collision=1;Object.assign(state.racers[0].hydro,{landingId:5,impact:12,load:3});for(const now of [0,16,100,200])updateGamepadRumble(mixer,state,[p],undefined,now);assert.equal(p.calls.length,0);
});

test('independent players receive only their own collisions and configured strengths',()=>{
 const {state,pads,update}=setup('versus',{enabled:true,strength:[.25,.75]});state.racers[0].collision=1;assert.equal(update(16),1);assert.equal(pads[0].calls.length,1);assert.equal(pads[1].calls.length,0);assert.ok(pads[0].calls[0].strongMagnitude<=.25);
 state.racers[1].collision=1;assert.equal(update(32),1);assert.equal(pads[0].calls.length,1);assert.equal(pads[1].calls.length,1);assert.ok(pads[1].calls[0].strongMagnitude>.25&&pads[1].calls[0].strongMagnitude<=.75);for(const p of pads){assert.equal(p.calls[0].type,'dual-rumble');assert.equal(p.calls[0].startDelay,0);assert.ok(p.calls[0].duration<=80);}
});

test('landing feedback requires a new landingId and scales with actual impact',()=>{
 const {state,pads,update}=setup(),h=state.racers[0].hydro;h.impact=10;update(20);assert.equal(pads[0].calls.length,0);h.landingId=1;update(40);assert.equal(pads[0].calls.length,1);update(150);assert.equal(pads[0].calls.length,1);h.landingId=2;h.impact=2;update(250);assert.equal(pads[0].calls.length,2);assert.ok(pads[0].calls[1].strongMagnitude<pads[0].calls[0].strongMagnitude);h.landingId=0;update(400);assert.equal(pads[0].calls.length,2);
});

test('continuous engine power or hull loading cannot cause constant buzzing',()=>{
 const {state,pads,update}=setup(),r=state.racers[0];r.throttle=1;for(let now=10;now<=1000;now+=10)update(now);assert.equal(pads[0].calls.length,0);r.hydro.load=2.5;update(1010);assert.equal(pads[0].calls.length,1);for(let now=1020;now<=2000;now+=10)update(now);assert.equal(pads[0].calls.length,1);r.hydro.load=1;update(2010);r.hydro.load=2.5;update(2020);assert.equal(pads[0].calls.length,2);r.hydro.load=1;update(2100);r.hydro.load=2.5;update(2120);assert.equal(pads[0].calls.length,2);
});

test('effect calls are throttled per device; the current strongest event replaces old pending work',()=>{
 const {state,pads,update}=setup(),r=state.racers[0];r.collision=1;update(10);assert.equal(pads[0].calls.length,1);
 r.collision=0;update(20);r.hydro.landingId=1;r.hydro.impact=2;update(30);r.collision=1;update(40);r.hydro.landingId=2;r.hydro.impact=3;update(50);assert.equal(pads[0].calls.length,1);update(109);assert.equal(pads[0].calls.length,1);update(110);assert.equal(pads[0].calls.length,2);assert.equal(pads[0].calls[1].strongMagnitude,pads[0].calls[0].strongMagnitude);update(300);assert.equal(pads[0].calls.length,2);assert.equal(RUMBLE_INTERVAL_MS,100);
});

test('disable, pause, countdown, results and explicit reset cancel active and pending events',()=>{
 for(const phase of ['paused','countdown','results']){const {mixer,state,pads,update}=setup(),r=state.racers[0];r.collision=1;update(10);r.hydro.landingId=1;r.hydro.impact=9;update(20);state.phase=phase;update(25);assert.equal(pads[0].resets.length,1);update(30);assert.equal(pads[0].resets.length,1);state.phase='running';update(150);update(250);assert.equal(pads[0].calls.length,1);resetGamepadRumble(mixer);}
 const preferences={enabled:true,strength:[.25,.25]},{mixer,state,pads,update}=setup('race',preferences);state.racers[0].collision=1;update(10);preferences.enabled=false;update(20);assert.equal(pads[0].resets.length,1);preferences.enabled=true;update(120);assert.equal(pads[0].calls.length,1);state.racers[0].collision=0;update(130);state.racers[0].collision=1;update(140);assert.equal(pads[0].calls.length,2);resetGamepadRumble(mixer);assert.equal(pads[0].resets.length,2);
});

test('zero strength, disconnected controllers and non-human racers receive no effects',()=>{
 for(const mutate of [({pads})=>pads[0].connected=false,({state})=>state.racers[0].human=false,({state})=>state.racers[0].dq='Course out',({state})=>state.racers[0].finishTime=1]){const s=setup();mutate(s);s.state.racers[0].collision=1;s.update(20);assert.equal(s.pads[0].calls.length,0);}
 const s=setup('versus',{enabled:true,strength:[0,.25]});s.state.racers.forEach(r=>r.collision=1);s.update(20);assert.equal(s.pads[0].calls.length,0);assert.equal(s.pads[1].calls.length,1);
});

test('unsupported actuators are ignored and legacy pulse actuators work without reset',()=>{
 const mixer=createGamepadRumble(),state=game(),calls=[],p={connected:true,hapticActuators:[{pulse(value,duration){calls.push({value,duration});return Promise.resolve(true);}}]};updateGamepadRumble(mixer,state,[p],undefined,0);state.racers[0].collision=1;updateGamepadRumble(mixer,state,[p],undefined,10);assert.equal(calls.length,1);assert.ok(calls[0].value<=.25);assert.ok(calls[0].duration<=80);state.phase='paused';updateGamepadRumble(mixer,state,[p],undefined,20);assert.equal(calls.length,1);
 for(const bad of [null,{}, {vibrationActuator:{effects:['trigger-rumble'],playEffect(){throw Error('unsupported');}}},{get vibrationActuator(){throw Error('blocked');}}]){assert.doesNotThrow(()=>updateGamepadRumble(mixer,game(),[bad],undefined,100));}
});

test('actuator exceptions and promise rejections are handled without deferred playback',async()=>{
 for(const asynchronous of [false,true]){const {mixer,state,pads,update}=setup();pads[0].vibrationActuator.playEffect=()=>asynchronous?Promise.reject(Error('denied')):(()=>{throw Error('denied');})();pads[0].vibrationActuator.reset=()=>Promise.reject(Error('reset denied'));state.racers[0].collision=1;assert.doesNotThrow(()=>update(10));await Promise.resolve();await Promise.resolve();state.racers[0].hydro.landingId=1;state.racers[0].hydro.impact=12;assert.equal(update(150),0);resetGamepadRumble(mixer);await Promise.resolve();await Promise.resolve();assert.equal(pads[0].calls.length,0);}
});

test('state replacement, reconnect and clock reset rebaseline event history',()=>{
 const {mixer,state,pads,update}=setup();state.racers[0].collision=1;update(10);const next=game();next.racers[0].collision=1;updateGamepadRumble(mixer,next,pads,undefined,20);assert.equal(pads[0].resets.length,1);updateGamepadRumble(mixer,next,pads,undefined,200);assert.equal(pads[0].calls.length,1);next.racers[0].collision=0;updateGamepadRumble(mixer,next,pads,undefined,210);next.racers[0].collision=1;updateGamepadRumble(mixer,next,pads,undefined,220);assert.equal(pads[0].calls.length,2);updateGamepadRumble(mixer,next,pads,undefined,10);assert.equal(pads[0].resets.length,2);assert.equal(pads[0].calls.length,2);
 const replacement=pad();updateGamepadRumble(mixer,next,[replacement],undefined,300);assert.equal(replacement.calls.length,0);next.racers[0].collision=0;updateGamepadRumble(mixer,next,[replacement],undefined,310);next.racers[0].collision=1;updateGamepadRumble(mixer,next,[replacement],undefined,320);assert.equal(replacement.calls.length,1);
});

test('null state, malformed input, expired pending pulses and invalid strength are quiet',()=>{
 assert.equal(updateGamepadRumble({},null,null),0);assert.doesNotThrow(()=>resetGamepadRumble({}));const {mixer,state,pads,update}=setup();state.racers[0].collision=1;update(10);assert.equal(updateGamepadRumble(mixer,null,pads,undefined,20),0);assert.equal(pads[0].resets.length,1);assert.equal(updateGamepadRumble(mixer,state,pads,{enabled:true,strength:[NaN]},100),0);assert.equal(updateGamepadRumble(mixer,state,pads,undefined,NaN),0);
 const s=setup();s.state.racers[0].collision=1;s.update(10);s.state.racers[0].hydro.landingId=1;s.state.racers[0].hydro.impact=9;s.update(20);s.update(1000);assert.equal(s.pads[0].calls.length,1);
});
