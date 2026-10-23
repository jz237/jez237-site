import test from 'node:test';
import assert from 'node:assert/strict';
import {createVenueCrowd,CROWD_FLASH} from '../src/venue-crowd';
// Boolean assertions only around Three.js objects.
test('the crowd offers camera flashes; without a browser they do nothing and nothing breaks',()=>{
 const crowd=createVenueCrowd([{x:0,y:0,z:0,yaw:0},{x:2,y:0,z:0,yaw:0}]);
 const flash=crowd.root.userData.crowdFlash as (n:number)=>number;
 assert.ok(typeof flash==='function');assert.equal(flash(10),0,'no document: no flashes');
 crowd.update(1);crowd.dispose();assert.equal(flash(5),0,'disposed: none');
 assert.ok(CROWD_FLASH.max>=20&&CROWD_FLASH.life<.3,'a short burst');
});
test('after a big hit the crowd surge starts full and eases back to nothing',async()=>{
 const {CROWD_SURGE,crowdSurge}=await import('../src/venue-crowd');
 assert.equal(crowdSurge(0),1);assert.ok(crowdSurge(1)<1&&crowdSurge(1)>crowdSurge(2));assert.equal(crowdSurge(CROWD_SURGE.seconds),0);
 assert.equal(crowdSurge(-1),0);assert.equal(crowdSurge(NaN),0);
});
