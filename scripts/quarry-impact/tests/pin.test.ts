import test from 'node:test';
import assert from 'node:assert/strict';
import {PIN,pinnedBy,pinClock} from '../src/damage-handling';
import {PIN_HOLD,holdingPin,pinHoldAfter} from '../src/derby-driving';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
import {DESTRUCTION_POINTS} from '../src/derby-moments';
import {bodyworkDentDamage} from '../src/bodywork-response';
import {accumulateStructure} from '../src/structural-damage';
const hard=PIN.force*2;
test('a car shoved into a wall from the far side is pinned by the car doing the shoving',()=>{
 const pin=pinnedBy(0,0,[{x:.9,z:2.1,force:hard,by:3},{x:-.9,z:-2.2,force:hard*40,by:-1}]);
 assert.deepEqual(pin,{push:0,against:1},'nose shoved, rear corner against the wall');
 assert.deepEqual(pinnedBy(0,0,[{x:-1,z:0,force:hard,by:-1},{x:1,z:0,force:hard,by:5},{x:0,z:-2,force:hard*3,by:-1}]),{push:1,against:0},'the wall straight across, not the one behind');
 assert.deepEqual(pinnedBy(0,0,[{x:0,z:2,force:hard,by:1},{x:0,z:-2,force:hard*2,by:4}]),{push:1,against:0},'squeezed between two cars: the harder shove is credited');
});
test('a light touch, a shove from one side only, a wall pushing on its own or the same car on both ends is no pin',()=>{
 assert.equal(pinnedBy(0,0,[{x:0,z:2,force:PIN.force*.9,by:1},{x:0,z:-2,force:hard,by:-1}]),null,'too light');
 assert.equal(pinnedBy(0,0,[{x:0,z:2,force:hard,by:1}]),null,'nothing behind it');
 assert.equal(pinnedBy(0,0,[{x:0,z:2,force:hard,by:1},{x:2,z:0,force:hard,by:-1}]),null,'the wall at a right angle: it can slide away');
 assert.equal(pinnedBy(0,0,[{x:0,z:2,force:hard,by:-1},{x:0,z:-2,force:hard,by:-1}]),null,'wedged between walls, nobody pinning it');
 assert.equal(pinnedBy(0,0,[{x:0,z:2,force:hard,by:2},{x:0,z:-2,force:hard,by:2}]),null,'one car cannot pin against itself');
 assert.equal(pinnedBy(0,0,[{x:0,z:0,force:hard,by:2},{x:0,z:-2,force:hard,by:-1}]),null,'a push at the centre has no side');
 assert.equal(pinnedBy(0,0,[{x:NaN,z:2,force:hard,by:2},{x:0,z:-2,force:NaN,by:-1}]),null);
});
test('the pin clock counts up while held and bleeds off faster once free, so a flicker stays one pin',()=>{
 let t=0;for(let i=0;i<60;i++)t=pinClock(t,true,1/60);assert.ok(Math.abs(t-1)<1e-9);
 assert.ok(t>=PIN.hold,'a second held is a pin');
 t=pinClock(t,false,.05);assert.ok(t>PIN.hold&&Math.abs(t-(1-.05*PIN.decay))<1e-9,'a 50 ms flicker leaves it pinned');
 for(let i=0;i<60;i++)t=pinClock(t,false,1/60);assert.equal(t,0);
 assert.equal(pinClock(NaN,true,1/60),0);assert.equal(pinClock(.4,true,0),0);
 assert.ok(PIN.wall>0&&PIN.wall<1&&PIN.gap>0);
 assert.ok(PIN.feed>PIN.hold,'only a pin held a while longer makes the derby feed');
 assert.ok(bodyworkDentDamage(PIN.rate*PIN.gap*PIN.wall)>0,'every tick dents the panels, even on the wall side');
 const structure=[0,0,0,0,0];accumulateStructure(structure,'sedan',{x:0,y:.5,z:-2.2},{x:0,y:0,z:1},PIN.rate*PIN.gap*PIN.wall);assert.ok(structure[1]>0,'and crumples the structure');
});
test('an AI pressed into a pinned target keeps the throttle down for a while, then gives up until it is free',()=>{
 assert.ok(holdingPin(.1,0,.2,4),'starts on a pinned target');
 assert.ok(!holdingPin(0,0,.2,4),'never starts on a free one');
 assert.ok(holdingPin(0,1,.2,4),'carries on through a bounce once started');
 assert.ok(!holdingPin(.1,PIN_HOLD.time,.2,4),'gives up after PIN_HOLD.time');
 assert.ok(!holdingPin(.1,0,PIN_HOLD.aim+.1,4)&&!holdingPin(.1,0,.2,PIN_HOLD.close+1),'not pointed at it or too far off');
 assert.equal(pinHoldAfter(.3,PIN_HOLD.time),-1,'spent while the target is still pinned');
 assert.ok(!holdingPin(.3,-1,.2,4),'a spent hold does not restart on the same pin');
 assert.equal(pinHoldAfter(0,-1),0,'free again: ready for the next one');assert.equal(pinHoldAfter(.3,0),0);
});
test('the feed calls a pin, credited to the driver doing it, worth more than a PIT and less than a roll',()=>{
 const feed=new DerbyEventFeed();feed.note(4,'TERN 1400 #5','pinned',3);assert.ok(derbyFeedMarkup(feed.visible(3),4).includes('<strong>PINNED'));
 assert.ok(DESTRUCTION_POINTS.pin>DESTRUCTION_POINTS.pit&&DESTRUCTION_POINTS.pin<DESTRUCTION_POINTS.rolled);
});
