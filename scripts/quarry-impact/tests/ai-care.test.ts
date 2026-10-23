import test from 'node:test';
import assert from 'node:assert/strict';
import {OVERHEAT_FIRE,coolThrottle,runningHot,longWay,LONG_WAY} from '../src/damage-handling';
test('an overheating AI backs off far enough to cool; reversing and gentle throttle are left alone',()=>{
 const t=coolThrottle(1,true);assert.ok(t<OVERHEAT_FIRE.throttle);assert.equal(runningHot(.8,false,t),false,'the eased throttle no longer runs it hot');
 assert.equal(coolThrottle(1,false),1);assert.equal(coolThrottle(.2,true),.2);assert.equal(coolThrottle(-1,true),-1);
});
test('with a short lock toward a target behind it, the AI turns the long way on its good lock',()=>{
 // Target well to the left-behind (negative angle) with the left lock short (negative skew): go right instead.
 assert.equal(longWay(-2.4,-.5),1);assert.equal(longWay(2.4,.5),-1);
 assert.equal(longWay(-2.4,.5),null,'the short side is the other way: turn as usual');
 assert.equal(longWay(-1,-.5),null,'target ahead enough: just turn');
 assert.equal(longWay(-2.4,-.1),null,'a slightly short lock is no reason');
 assert.equal(longWay(NaN,-.5),null);assert.ok(LONG_WAY.angle>Math.PI/2);
});
test('in a derby, a car with its left lock short and its target behind-left turns right round to it',async()=>{
 const {driveDerby}=await import('../src/derby-driving');
 const car=(steerSkew:number)=>({id:0,current:{x:0,y:0,z:0},velocity:{x:0,y:0,z:0},forward:{x:0,y:0,z:1},right:{x:1,y:0,z:0},speed:4,health:60,finished:false,nextCheckpoint:0,surface:'asphalt',steerSkew});
 const rival={id:1,current:{x:-8,y:0,z:-12},velocity:{x:0,y:0,z:0},forward:{x:1,y:0,z:0},right:{x:0,y:0,z:-1},speed:0,health:80,finished:false,nextCheckpoint:0,surface:'asphalt'};
 const run=(skew:number)=>{const m={target:-1,commit:0,stalled:0,reverse:0,escape:0,escapeSteer:0,attempts:0,steer:0,lane:0,phase:'approach',scan:0,clear:{front:30,left:30,right:30,rear:30}} as never;let out={steer:0};
  for(let k=0;k<40;k++)out=driveDerby(car(skew) as never,[car(skew) as never,rival as never],m,null,1/60);return{steer:out.steer,phase:(m as {phase:string}).phase};};
 const sound=run(0),bent=run(-.5),otherSide=run(.5);
 assert.ok(sound.steer<0,'a sound car turns left toward it');assert.ok(bent.steer>0&&bent.phase==='long way','the bent car goes the long way');
 assert.ok(otherSide.steer<0&&otherSide.phase!=='long way','a short right lock does not stop a left turn');
});
