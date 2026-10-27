import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TOUCH,touchSteer} from '../src/touch-drive';
import {drivingInput,readControls} from '../src/driving-controls';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
test('the steering pad: a small dead zone, then lock grows with the slide up to full at the reach, either way',()=>{
  assert.equal(touchSteer(0,844),0);assert.equal(touchSteer(3,844),0,'a resting thumb does not steer');
  const reach=Math.min(TOUCH.maxReach,844*TOUCH.reach);assert.equal(touchSteer(reach,844),1);assert.equal(touchSteer(-reach*3,844),-1);
  assert.ok(touchSteer(reach/2,844)>0&&touchSteer(reach/2,844)<1);assert.equal(touchSteer(-reach/2,844),-touchSteer(reach/2,844));
  assert.equal(touchSteer(Number.NaN,844),0);assert.ok(touchSteer(40,320)===1,'a narrow screen still has a usable reach');
});
test('touch pedals drive through the same input rules as keys and pads; no touch leaves input exactly as before',()=>{
  const config=readControls(null),none=new Set<string>();
  assert.deepEqual(drivingInput(config,none,[],10),drivingInput(config,none,[],10,true,true,undefined));
  const gas=drivingInput(config,none,[],10,true,true,{steer:.5,gas:1,reverse:0,handbrake:false});assert.equal(gas.throttle,1);assert.ok(gas.steer>0&&gas.steer<=.5,'speed-sensitive steering applies');
  const braking=drivingInput(config,none,[],10,true,true,{steer:0,gas:0,reverse:1,handbrake:true});assert.equal(braking.brake,1);assert.equal(braking.throttle,0);assert.equal(braking.handbrake,true);
  const reversing=drivingInput(config,none,[],0,true,true,{steer:0,gas:0,reverse:1,handbrake:false});assert.ok(reversing.throttle<0,'held at a stop it reverses');
  assert.equal(drivingInput(config,new Set([config.keys.left[0]]),[],0,true,true,{steer:0,gas:0,reverse:0,handbrake:false}).steer<0,true,'a resting thumb leaves the keys in charge');
});
test('main feeds the pedals only while the touch controls show, and shows them only while the player drives',()=>{
  assert.ok(main.includes(",touchDrive.active?touchDrive.pedals:undefined);"));
  assert.ok(main.includes("touchDrive.show((state==='playing'||state==='countdown')&&!demo&&!studio&&!preparingEvent&&!!p&&!p.finished&&!clubPlayerStopped&&!splitRun);"));
  assert.ok(main.includes('const touchDrive=new TouchDrive(document.body);'));
  assert.ok(css.includes('body.touch-driving .controls{display:none}')&&css.includes('.touch-drive[hidden]{display:none}'));
});
