import test from 'node:test';
import assert from 'node:assert/strict';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('the derby feed tells of a dropped engine, a torn-off wing and a PIT, credited to the driver who did it',()=>{
 const feed=new DerbyEventFeed();
 feed.note(3,'KESSLER R6 #4','engine',10);feed.note(5,'TERN 1400 #6','wing',11);feed.note(0,'VESPER GT #1','pit',12);
 const markup=derbyFeedMarkup(feed.visible(12),0);
 for(const label of ['ENGINE OUT','WING OFF','PIT'])assert.ok(markup.includes(label),label);
 assert.ok(/class="feed-followed"><strong>PIT/.test(markup),'the followed driver is marked');
 assert.equal(feed.visible(25).length,0,'entries fade after eight seconds');
});
test('a door torn off by a passing car is credited to that driver as DOOR OFF',async()=>{
 const {DESTRUCTION_POINTS}=await import('../src/derby-moments');
 const feed=new DerbyEventFeed();feed.note(2,'KESSLER R6 #3','door',4);assert.ok(derbyFeedMarkup(feed.visible(4),0).includes('DOOR OFF'));
 assert.ok(DESTRUCTION_POINTS.door>0&&DESTRUCTION_POINTS.door<=DESTRUCTION_POINTS.pit);
});
