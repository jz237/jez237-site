import test from 'node:test';
import assert from 'node:assert/strict';
import {LOCK,bumperAt,hooks,pullsAway,lockStrain,lockEnd} from '../src/bumper-lock';
test('only a contact out at either end of the car is on a bumper',()=>{
 assert.equal(bumperAt(2.1,2.3),'front-bumper');assert.equal(bumperAt(-2.2,2.3),'rear-bumper');
 assert.equal(bumperAt(LOCK.end*2.3-.01,2.3),null,'a door or wing is not a bumper');assert.equal(bumperAt(0,2.3),null);
 assert.equal(bumperAt(NaN,2.3),null);assert.equal(bumperAt(2,0),null);
});
test('a knocked-loose bumper hooks on a moderate hit about LOCK.chance of the time; a tight one, a tap or a smash never does',()=>{
 let hooked=0;for(let seed=0;seed<1000;seed++)if(hooks(.5,5,seed))hooked++;
 assert.ok(Math.abs(hooked/1000-LOCK.chance)<.05,`${hooked} of 1000`);
 for(let seed=0;seed<200;seed++){
  assert.ok(!hooks(LOCK.loose-.01,5,seed),'bumper still tight');
  assert.ok(!hooks(.5,LOCK.minClosing-.1,seed),'a tap');assert.ok(!hooks(.5,LOCK.maxClosing+.1,seed),'a smash knocks it clean off instead');
 }
 assert.equal(hooks(.5,5,42),hooks(.5,5,42),'the same hit always goes the same way');assert.ok(!hooks(.5,NaN,1)&&!hooks(.5,5,NaN));
});
test('a car pulls away from the hook driving or reversing away from the other car, with real throttle',()=>{
 const away={x:0,z:-1};
 assert.ok(pullsAway({x:0,z:1},away,-1),'nose in, reversing out');assert.ok(pullsAway({x:0,z:-1},away,.8),'driving off');
 assert.ok(!pullsAway({x:0,z:1},away,1),'pushing in is not pulling');assert.ok(!pullsAway({x:0,z:-1},away,LOCK.pull-.1),'a feather of throttle');
 assert.ok(!pullsAway({x:1,z:0},away,1),'driving across');assert.ok(!pullsAway({x:0,z:0},away,1)&&!pullsAway({x:0,z:1},away,NaN));
});
test('strain builds only while the rope is taut and somebody pulls; the bumper tears at LOCK.strain, else it slips free',()=>{
 let s=0;for(let i=0;i<30;i++)s=lockStrain(s,true,1,1/60);assert.ok(Math.abs(s-.5)<1e-9);
 assert.equal(lockStrain(s,false,2,1/60),s-LOCK.ease/60,'slack rope eases');assert.equal(lockStrain(s,true,0,1/60),s-LOCK.ease/60,'nobody pulling eases');
 assert.ok(lockStrain(0,true,2,.5)===1,'two cars pulling apart strain it twice as fast');assert.equal(lockStrain(NaN,true,1,.1),0);
 assert.equal(lockEnd(LOCK.strain,1,.4,.5),'torn');assert.equal(lockEnd(.2,LOCK.max,.4,.5),'slipped');
 assert.equal(lockEnd(.2,1,.5+LOCK.snap+.1,.5),'snapped','a car recovered across the arena lets go');assert.equal(lockEnd(.2,1,.5,.5),null);
});
