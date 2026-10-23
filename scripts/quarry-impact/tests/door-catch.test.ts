import test from 'node:test';
import assert from 'node:assert/strict';
import {DOOR_CATCH,doorTip,doorBase} from '../src/door-swing';
const hinge={x:-.9,y:.6,z:.8};
test('an open door reaches out from the side it hangs on, and back along the car',()=>{
 const shut=doorTip(hinge,-1,1.1,0);assert.ok(Math.abs(shut.x-hinge.x)<1e-12&&Math.abs(shut.z-(hinge.z-1.1))<1e-12,'shut: flush along the side');
 const open=doorTip(hinge,-1,1.1,DOOR_CATCH.open+.3);assert.ok(open.x<hinge.x-.7,'a left door swings out to the left');assert.ok(open.z>hinge.z-1.1&&open.z<hinge.z);
 const right=doorTip({...hinge,x:.9},1,1.1,1);assert.ok(right.x>1.7);assert.equal(right.y,hinge.y);
});
test('only a door swung well open is caught; one hanging just ajar is not',()=>{
 assert.ok(doorBase(1)<DOOR_CATCH.open,'a fully loose door at rest hangs inside the catch angle');
 assert.ok(Math.hypot(...(['x','z'] as const).map(k=>doorTip(hinge,-1,1.1,DOOR_CATCH.open)[k]-hinge[k]))-1.1<1e-12,'the door keeps its length');
});
