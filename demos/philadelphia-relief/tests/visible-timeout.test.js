import test from 'node:test';
import assert from 'node:assert/strict';
import { createVisibleTimeout } from '../src/visible-timeout.js';

function fixture(t,hidden=false){
  t.mock.timers.enable({apis:['setTimeout','Date']});
  const doc=new EventTarget();doc.hidden=hidden;let expired=0;
  const timer=createVisibleTimeout(doc,()=>expired++,90000,()=>Date.now());
  t.after(()=>timer.dispose());
  return {timer,get expired(){return expired;},
    tick:ms=>t.mock.timers.tick(ms),hide(value){doc.hidden=value;doc.dispatchEvent(new Event('visibilitychange'));}};
}
test('photographic loading gets ninety foreground seconds even after a long background pause',t=>{
  const f=fixture(t);f.timer.start();f.tick(40000);f.hide(true);f.tick(600000);
  assert.equal(f.expired,0);f.hide(false);f.tick(49999);assert.equal(f.expired,0);
  f.tick(1);assert.equal(f.expired,1);f.tick(90000);assert.equal(f.expired,1);
});
test('repeated starts and tab switches cannot extend an active foreground loading budget',t=>{
  const f=fixture(t);f.timer.start();
  for(let i=0;i<8;i++){
    f.tick(10000);f.timer.start();f.hide(true);f.tick(180000);f.hide(false);
  }
  f.tick(9999);assert.equal(f.expired,0);f.tick(1);assert.equal(f.expired,1);
});
test('a hidden initial view waits for visibility and a deliberate retry receives a fresh budget',t=>{
  const f=fixture(t,true);f.timer.start();f.tick(180000);assert.equal(f.expired,0);
  f.hide(false);f.tick(89000);f.timer.cancel();f.tick(2000);assert.equal(f.expired,0);
  f.timer.start();f.tick(89999);assert.equal(f.expired,0);f.tick(1);assert.equal(f.expired,1);
});
test('disposing an active or hidden view cancels timers and prevents visibility from restarting them',t=>{
  const f=fixture(t);f.timer.start();f.tick(10000);f.hide(true);f.timer.dispose();
  f.hide(false);f.timer.start();f.tick(180000);assert.equal(f.expired,0);
});
