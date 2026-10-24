import test from 'node:test';
import assert from 'node:assert/strict';
import {DOMINO,dominoBy,SLAM,DESTRUCTION_POINTS} from '../src/derby-moments';
import {DerbyEventFeed,derbyFeedMarkup} from '../src/derby-event-feed';
test('a car knocked by a rival into a third car soon after is a DOMINO for that rival; not for the struck car itself, nor stale',()=>{
 assert.equal(dominoBy({by:0,at:10},1,2,10.6),0);assert.equal(dominoBy({by:2,at:10},1,2,10.6),-1,'knocked back into the car that hit it');
 assert.equal(dominoBy({by:0,at:10},1,2,10+SLAM.window+.1),-1,'too long after');assert.equal(dominoBy(undefined,1,2,10),-1);assert.equal(dominoBy({by:1,at:10},1,2,10.2),-1);
 assert.ok(DOMINO.knock>DOMINO.big&&DOMINO.closing>0,'a real knock starts the chain; the knock-on can be lighter');
 assert.ok(DESTRUCTION_POINTS.domino>0&&DESTRUCTION_POINTS.domino<DESTRUCTION_POINTS.slam);
});
test('the feed adds a repeat of the same moment by the same driver to its line (×N) and brings it to the top',()=>{
 const f=new DerbyEventFeed();f.note(0,'VESPER GT #1','domino',1);f.note(3,'TERN 1400 #4','pinned',2);f.note(0,'VESPER GT #1','domino',3);
 const v=f.visible(3);assert.equal(v.length,2,'one line each');assert.equal(v[0].kind,'domino','the repeat is on top');assert.equal(v[0].count,2);
 assert.ok(derbyFeedMarkup(v,0).includes('DOMINO ×2'));
 f.note(0,'VESPER GT #1','domino',12);assert.equal(f.visible(12).find(e=>e.kind==='domino')?.count,1,'a fresh line once the old one has gone');
});
test('each pile-up keeps a line of its own: its count is its size',()=>{
 const f=new DerbyEventFeed();f.note(2,'ROOK 1100 #3','pileup',4,4);f.note(2,'ROOK 1100 #3','pileup',5,5);
 const v=f.visible(5);assert.equal(v.length,2);assert.deepEqual(v.map(e=>e.count),[5,4]);
});
