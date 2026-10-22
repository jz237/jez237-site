import test from 'node:test';
import assert from 'node:assert/strict';
import {WEAK_SPOT,weakSpot} from '../src/damage-handling';
import {driveDerby} from '../src/derby-driving';
const at={x:10,z:20},fwd={x:0,z:1},right={x:1,z:0};
test('a car crushed past WEAK_SPOT.onset has a weak spot on the outside of its worst end or flank; a sound car has none',()=>{
 assert.equal(weakSpot([.1,.2,.1,.1,0],at,fwd,right,2,.9),null);
 assert.deepEqual(weakSpot([.6,.2,.1,.1,0],at,fwd,right,2,.9),{x:10,z:22});assert.deepEqual(weakSpot([.1,.5,.1,.1,0],at,fwd,right,2,.9),{x:10,z:18});
 assert.deepEqual(weakSpot([.1,.1,.4,.1,0],at,fwd,right,2,.9),{x:9.1,z:20});assert.deepEqual(weakSpot([.1,.1,.1,WEAK_SPOT.onset,0],at,fwd,right,2,.9),{x:10.9,z:20});
 assert.equal(weakSpot(undefined,at,fwd,right,2,.9),null);
});
test('a derby driver steers for the rival\'s broken corner rather than its middle',()=>{
 const me={id:0,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:0,health:100,finished:false,nextCheckpoint:0,surface:'asphalt'};
 const rival=(weak:{x:number;z:number}|null)=>({id:1,current:{x:0,y:0,z:19},velocity:{x:0,y:0,z:0},forward:{x:1,y:0,z:0},right:{x:0,y:0,z:-1},speed:0,health:80,finished:false,nextCheckpoint:0,surface:'asphalt',weakSpot:weak});
 const steer=(weak:{x:number;z:number}|null)=>{const m={target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30}} as never;return driveDerby(me as never,[me as never,rival(weak) as never],m,null,1/60).steer;};
 const middle=steer(null),left=steer({x:-2.4,z:19}),right2=steer({x:2.4,z:19});console.log(JSON.stringify({middle,left,right2}));
 assert.ok(Math.abs(middle)<Math.abs(left)&&Math.sign(left)===-Math.sign(right2)&&left!==right2,'it turns toward whichever corner is broken');
});
