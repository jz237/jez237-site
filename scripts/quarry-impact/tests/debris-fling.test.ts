import test from 'node:test';
import assert from 'node:assert/strict';
import {DEBRIS_FLING,debrisFling} from '../src/damage-handling';
test('big hits throw broken parts along the blow with a lift; slow knocks barely move them',()=>{
 const slow=debrisFling({x:1,y:0,z:0},2),hard=debrisFling({x:1,y:0,z:0},40);
 assert.ok(hard.x>slow.x*10&&hard.y>0,'along the blow, lifted');assert.ok(Math.abs(hard.z)<1e-12);
 const huge=debrisFling({x:0,y:0,z:-3},999);assert.ok(Math.abs(huge.z+DEBRIS_FLING.max)<1e-9&&Math.abs(huge.y-DEBRIS_FLING.max*DEBRIS_FLING.lift)<1e-9,'capped, direction normalised');
 assert.deepEqual(debrisFling({x:0,y:0,z:0},50),{x:0,y:0,z:0});assert.deepEqual(debrisFling({x:1,y:0,z:0},NaN),{x:0,y:0,z:0});
 assert.ok(debrisFling({x:0,y:-1,z:0},30).y>=0,'never driven into the ground');
});
