import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLLED,rolledBy} from '../src/derby-moments';
import {wreckCause} from '../src/wreck-cause';
import {ROOF_SLIDE,SIDE_SLIDE,ROLL_SHED,roofSlide} from '../src/damage-handling';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('a car left on its roof soon after a hit was rolled by that hitter, once per roll',()=>{
 const hit={by:3,at:10};
 assert.equal(rolledBy(ROLLED.sustain,true,hit,11),3);
 assert.equal(rolledBy(ROLLED.sustain-.05,true,hit,11),-1,'only a moment upside down');
 assert.equal(rolledBy(1,false,hit,11),-1,'already counted for this roll');
 assert.equal(rolledBy(1,true,hit,10+ROLLED.window+.1),-1,'the hit was too long ago');
 assert.equal(rolledBy(1,true,undefined,11),-1);assert.equal(rolledBy(NaN,true,hit,11),-1);
});
test('a car finished upside down went out ON ITS ROOF, after an engine drop or a fire; the feed tells of a roll',()=>{
 const base={engineOut:false,fireHeat:0,wheelsLost:0,seized:false,fuel:.5};
 assert.equal(wreckCause({...base,inverted:true,wheelsLost:2}),'ON ITS ROOF');assert.equal(wreckCause({...base,inverted:true,engineOut:true}),'ENGINE OUT');
 assert.equal(wreckCause(base),'WRECKED');
 const feed=new DerbyEventFeed();feed.note(0,'VESPER GT #1','rolled',5);assert.ok(derbyFeedMarkup(feed.visible(5),0).includes('ROLLED'));
});
test('a car sliding on its roof scrapes harder the faster it goes, and not at all at a crawl',()=>{
 assert.equal(roofSlide(ROOF_SLIDE.speed),0);assert.equal(roofSlide(1),0);assert.equal(roofSlide(NaN),0);
 assert.ok(roofSlide(ROOF_SLIDE.speed+1)>0&&roofSlide(ROOF_SLIDE.speed+1)<roofSlide(ROOF_SLIDE.full*.8));assert.equal(roofSlide(ROOF_SLIDE.full*2),1);
});
test('a car counts as on its side only when tipped well past upright',()=>{
 assert.ok(SIDE_SLIDE.up>0&&SIDE_SLIDE.up<.5,'tilted past about 66 degrees');
});
test('a roll sheds only what was already hanging loose, at the same moment a roll is credited',()=>{
 assert.equal(ROLL_SHED.at,ROLLED.sustain);assert.ok(ROLL_SHED.loose>0&&ROLL_SHED.loose<1);
});
