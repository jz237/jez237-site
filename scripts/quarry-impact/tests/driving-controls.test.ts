import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultControls,readControls,drivingInput,steeringAxis,bindKey,type Pad} from '../src/driving-controls';
import {verifyControlsRevision} from './controls-invariants';
const pad=(axis=0,buttons:Record<number,number>={},index=0):Pad=>({id:'Test standard controller',index,connected:true,axes:[axis],buttons:Array.from({length:8},(_,n)=>({value:buttons[n]??0,pressed:(buttons[n]??0)>.5,touched:false}))});
const drive=(keys:string[]=[],speed=0)=>drivingInput(defaultControls(),new Set(keys),[],speed);
test('keyboard arrows agree with WASD, cancel opposites, brake at speed and reverse at rest',()=>{
 for(const pair of [['KeyW','ArrowUp'],['KeyS','ArrowDown'],['KeyA','ArrowLeft'],['KeyD','ArrowRight']])assert.deepEqual(drive([pair[0]],10),drive([pair[1]],10));
 assert.equal(drive(['KeyA']).steer,-1);assert.equal(drive(['KeyD']).steer,1);assert.equal(drive(['KeyA','KeyD']).steer,0);
 assert.deepEqual(drive(['KeyS'],10),{throttle:0,brake:1,steer:0,handbrake:false});assert.equal(drive(['KeyS']).throttle,-.6);
 assert.equal(drive(['KeyW','KeyS']).brake,1);assert.equal(drive(['KeyW','KeyS']).throttle,0);assert.equal(drive(['Space']).handbrake,true);
});
test('rebinding rejects conflicts and shortcuts and survives save/reload independently',()=>{
 const config=defaultControls();assert.equal(bindKey(config,'throttle',0,'KeyL'),null);assert.match(bindKey(config,'reverse',0,'KeyL')!,/already assigned/);assert.match(bindKey(config,'left',0,'KeyP')!,/reserved/);
 const loaded=readControls(JSON.stringify(config));assert.equal(drivingInput(loaded,new Set(['KeyW']),[],0).throttle,0);assert.equal(drivingInput(loaded,new Set(['KeyL']),[],0).throttle,1);assert.equal(drivingInput(loaded,new Set(['ArrowUp']),[],0).throttle,1);loaded.keys.throttle[0]='KeyZ';assert.equal(config.keys.throttle[0],'KeyL');
});
test('corrupt and hostile saves reset keys and clamp calibration, including button conflicts',()=>{
 for(const bad of ['{','null','{"version":2}',JSON.stringify({...defaultControls(),keys:{}}),JSON.stringify({...defaultControls(),keys:{...defaultControls().keys,left:['KeyW']}})])assert.deepEqual(readControls(bad),defaultControls());
 const bounded=readControls(JSON.stringify({...defaultControls(),deadzone:99,saturation:-99,center:99,curve:9,speedAssist:9,throttleButton:0}));assert.equal(bounded.deadzone,.45);assert.equal(bounded.saturation,.5);assert.equal(bounded.center,.5);assert.equal(bounded.curve,3);assert.equal(bounded.speedAssist,1);assert.equal(bounded.throttleButton,7);
});
test('axis calibration removes drift, rescales travel, curves and inverts without nonfinite output',()=>{
 const config=defaultControls();assert.equal(steeringAxis(.1,config),0);assert.equal(steeringAxis(-1,config),-1);assert.equal(steeringAxis(1,config),1);config.center=.1;assert.equal(steeringAxis(.1,config),0);config.center=0;config.curve=2;assert.ok(steeringAxis(.5,config)<.25);config.invert=true;assert.ok(steeringAxis(.5,config)<0);config.saturation=.5;assert.equal(steeringAxis(.5,config),-1);assert.equal(steeringAxis(NaN,config),0);
});
test('gamepad slots, missing axes, disconnects and button mapping have deterministic fallback',()=>{
 const config=defaultControls();config.pad=1;const pads=[pad(-1),pad(1,{7:1,0:1},1)];assert.deepEqual(drivingInput(config,new Set(),pads,20),{steer:1,throttle:1,brake:0,handbrake:true});pads[1].connected=false;assert.equal(drivingInput(config,new Set(['KeyA']),pads,0).steer,-1);pads[1].connected=true;config.axis=4;config.center=.25;assert.equal(drivingInput(config,new Set(),pads,0).steer,0);
 config.throttleButton=1;config.axis=0;assert.equal(drivingInput(config,new Set(),[pad(0,{1:1},1)],0).throttle,1);
});
test('pedal deadzones and mixed keyboard/gamepad preserve braking and release cleanly',()=>{
 const c=defaultControls();assert.equal(drivingInput(c,new Set(),[pad(0,{7:.03})],0).throttle,0);assert.equal(drivingInput(c,new Set(['KeyW']),[pad(0,{6:1})],0).brake,1);assert.equal(drivingInput(c,new Set(),[pad(0,{6:1})],-2).throttle,-.6);assert.deepEqual(drivingInput(c,new Set(),[],0),{throttle:0,steer:0,brake:0,handbrake:false});
});
test('speed steering assist is optional, symmetric and stateless across repeated network samples',()=>{
 const c=defaultControls(),keys=new Set(['KeyD']);assert.equal(drivingInput(c,keys,[],50).steer,1);c.speedAssist=1;const forward=drivingInput(c,keys,[],50);assert.ok(forward.steer<.5);assert.deepEqual(drivingInput(c,keys,[],-50),forward);assert.deepEqual(drivingInput(c,keys,[],50),forward);assert.equal(drivingInput(c,keys,[],0).steer,1);assert.equal(drivingInput(c,keys,[],1000).steer,.35);assert.equal(drivingInput(c,keys,[],NaN).steer,1);
});
test('controls revision preserves exact prior local livery bytes',verifyControlsRevision);
