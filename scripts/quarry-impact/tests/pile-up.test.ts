import test from 'node:test';
import assert from 'node:assert/strict';
import {PILEUP,PileUp} from '../src/pile-up';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('four cars piling into each other within the window is a PILE-UP, credited to the fastest car into the first hit',()=>{
 const p=new PileUp();
 assert.equal(p.note(1,2,10,0,0,1,8),null);assert.equal(p.note(2,3,10.4,2,1,3,6),null);
 const call=p.note(3,4,10.9,3,2,4,5);assert.deepEqual(call,{size:4,cars:[1,2,3,4],starter:1});
 assert.equal(p.note(4,1,11.1,1,1,4,5),null,'the same pile-up is not called twice');
 assert.equal(p.note(5,4,11.3,2,2,5,5),null,'one more car is not enough to call it again');
 assert.deepEqual(p.note(6,5,11.5,2,3,6,7),{size:6,cars:[1,2,3,4,5,6],starter:1},'grown by PILEUP.grow: called again, bigger');
});
test('separate crashes, slow nudges, stale hits and far-off contacts are no pile-up',()=>{
 const p=new PileUp();
 p.note(1,2,10,0,0,1,8);p.note(3,4,10.2,1,1,3,8);assert.equal(p.note(5,6,10.4,0,1,5,8),null,'three pairs that never touch each other');
 const q=new PileUp();q.note(1,2,10,0,0,1,8);q.note(2,3,10.5,0,0,2,8);assert.equal(q.note(3,4,10+PILEUP.window+.6,0,0,3,8),null,'the first hit is too old');
 const r=new PileUp();r.note(1,2,10,0,0,1,8);r.note(2,3,10.2,0,0,2,8);assert.equal(r.note(3,4,10.4,PILEUP.radius+5,0,3,8),null,'too far away');
 const s=new PileUp();s.note(1,2,10,0,0,1,8);s.note(2,3,10.2,0,0,2,8);assert.equal(s.note(3,4,10.4,0,0,3,PILEUP.closing-.5),null,'a nudge');
 assert.equal(s.note(3,3,10.4,0,0,3,8),null);assert.equal(s.note(3,4,NaN,0,0,3,8),null);
});
test('once it has gone quiet, the same cars can start a new pile-up; reset forgets everything',()=>{
 const p=new PileUp();p.note(1,2,10,0,0,1,8);p.note(2,3,10.2,0,0,2,8);assert.ok(p.note(3,4,10.4,0,0,3,8));
 p.note(1,2,20,0,0,2,8);p.note(2,3,20.2,0,0,3,8);assert.deepEqual(p.note(3,4,20.4,0,0,4,8)?.starter,2);
 p.reset();p.note(1,2,30,0,0,1,8);p.note(2,3,30.2,0,0,2,8);assert.ok(p.note(3,4,30.4,0,0,3,8));
});
test('the feed calls a pile-up with its size',()=>{
 const feed=new DerbyEventFeed();feed.note(2,'TERN 1400 #3','pileup',4,5);const m=derbyFeedMarkup(feed.visible(4),0);
 assert.ok(m.includes('PILE-UP ×5'),m);
});
