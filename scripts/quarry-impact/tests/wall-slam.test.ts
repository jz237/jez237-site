import test from 'node:test';
import assert from 'node:assert/strict';
import {SLAM,slamBy,isSlam,DESTRUCTION_POINTS} from '../src/derby-moments';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('a wall hit soon after a rival knocked the car there is credited to that rival',()=>{
 assert.equal(slamBy({by:4,at:10},2,10.8),4);assert.equal(slamBy({by:0,at:10},2,10+SLAM.window),0,'right up to the window');
 assert.equal(slamBy({by:4,at:10},2,10+SLAM.window+.01),-1,'too long after: it drove there itself');
 assert.equal(slamBy(undefined,2,10),-1,'nobody hit it');assert.equal(slamBy({by:2,at:10},2,10.2),-1,'not its own hit');
 assert.equal(slamBy({by:4,at:10},2,9.9),-1,'not a hit from the future');assert.equal(slamBy({by:-1,at:10},2,10.2),-1);assert.equal(slamBy({by:4,at:NaN},2,10.2),-1);
});
test('only a solid wall hit is called a WALL SLAM, in the feed and worth as much as a PIT',()=>{
 assert.ok(isSlam(SLAM.big)&&isSlam(40));assert.ok(!isSlam(SLAM.big-.1)&&!isSlam(NaN)&&!isSlam(-5));
 const feed=new DerbyEventFeed();feed.note(0,'VESPER GT #1','slam',5);assert.ok(derbyFeedMarkup(feed.visible(5),0).includes('<strong>WALL SLAM'));
 assert.ok(DESTRUCTION_POINTS.slam>DESTRUCTION_POINTS.wing&&DESTRUCTION_POINTS.slam<=DESTRUCTION_POINTS.pit&&DESTRUCTION_POINTS.slam<DESTRUCTION_POINTS.pin);
});
