import test from 'node:test';
import assert from 'node:assert/strict';
import {frameDelta} from '../lib/aquarium/frame.ts';
test('a queued first frame cannot run the scene backwards',()=>{
 let time=0;let last=1040;
 for(const now of [1033,1050,1067,5000]){
   const dt=frameDelta(now,last);last=now;time+=dt;
   const phase=(time*.015)%1;
   assert.ok(phase>=0&&phase<1,'curve lookup must stay inside its valid domain');
   assert.ok(dt>=0&&dt<=.1,'scene steps must be finite and bounded');
 }
 assert.ok(time>0);
 assert.equal(frameDelta(NaN,0),0);
});
