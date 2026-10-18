import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {freshNativeStuntAwards,enqueueNativeStuntAward,advanceNativeStuntAwards} from '../native-stunt-awards.js';
import {createNativeStuntScoring,stepNativeStuntScoring,collectNativeStuntRing} from '../native-stunt-scoring.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-stunt-awards-reference.json',import.meta.url)));
const award=(points,kind='trick',finish=false)=>({kind,points,finish});

test('all queue occupancy patterns and numeric display transfers match original execution',()=>{
 for(const c of reference.enqueue){const before=structuredClone(c.state);assert.deepEqual(enqueueNativeStuntAward(c.state,c.award).state,c.expected);assert.deepEqual(c.state,before);}
 for(const c of reference.advance){
  const before=structuredClone(c.state),out=advanceNativeStuntAwards(c.state);
  assert.deepEqual(out.state,c.expected);assert.deepEqual(out.display.map(({slot,alpha})=>({slot,alpha})),c.alpha);
  assert.equal(out.pulseBlend,c.pulseBlend);assert.deepEqual(c.state,before);
 }
});

test('awards draw for23 source calls, transfer once, and retain non-type slot memory',()=>{
 let s=enqueueNativeStuntAward(freshNativeStuntAwards(),award(500)).state;const frames=[];
 assert.equal(s.totals.total,0);
 for(let i=0;i<23;i++){
  const out=advanceNativeStuntAwards(s);s=out.state;frames.push(out.display[0]);
  assert.equal(out.transfers.length,i===22?1:0);assert.equal(s.totals.total,i===22?500:0);
 }
 assert.deepEqual(frames.slice(0,5).map(q=>q.alpha),[0,63,127,191,255]);
 assert.deepEqual(frames.slice(19).map(q=>q.alpha),[255,191,127,63]);
 assert.equal(s.slots[0].type,0);assert.equal(s.slots[0].amount,500);assert.equal(s.slots[0].age,23);
 assert.deepEqual(s.totals,{total:500,time:0,ring:0,trick:500});
 for(let i=0;i<50;i++){const out=advanceNativeStuntAwards(s);s=out.state;assert.deepEqual(out.display,[]);assert.deepEqual(out.transfers,[]);}
 assert.equal(s.totals.total,500);
});

test('full queues replace slot0 without paying the evicted award and reset both pulse words',()=>{
 let s=freshNativeStuntAwards();
 for(let i=1;i<=4;i++){const out=enqueueNativeStuntAward(s,award(i*100));s=out.state;assert.equal(out.slot,i-1);assert.equal(out.replaced,null);}
 for(let i=0;i<5;i++)s=advanceNativeStuntAwards(s).state;
 const out=enqueueNativeStuntAward(s,award(999,'ring',true));s=out.state;
 assert.equal(out.slot,0);assert.equal(out.replaced.amount,100);assert.equal(s.slots[0].finishOffset,-32);assert.equal(s.slots[1].age,5);
 assert.equal(s.pulsePhase,0);assert.equal(s.pulseTick,0);
 for(let i=0;i<23;i++)s=advanceNativeStuntAwards(s).state;
 assert.deepEqual(s.totals,{total:1899,time:0,ring:999,trick:900});
});

test('simultaneous transfers preserve slot order and independently cap total and categories',()=>{
 let s=freshNativeStuntAwards();for(const a of [award(99990,'time'),award(30,'ring'),award(40),award(50,'time')])s=enqueueNativeStuntAward(s,a).state;
 for(let i=0;i<22;i++)s=advanceNativeStuntAwards(s).state;
 const out=advanceNativeStuntAwards(s);
 assert.deepEqual(out.transfers.map(q=>q.slot),[0,1,2,3]);assert.deepEqual(out.transfers.map(q=>q.total),[99990,99999,99999,99999]);
 assert.deepEqual(out.state.totals,{total:99999,time:99999,ring:30,trick:40});
});

test('source motion falls back, bounces once and exits left without sharing mutable states',()=>{
 let s=enqueueNativeStuntAward(freshNativeStuntAwards(),award(10)).state;const ys=[],xs=[];
 for(let i=0;i<23;i++){const out=advanceNativeStuntAwards(s);ys.push(out.display[0].y);xs.push(out.display[0].x);s=out.state;}
 assert.equal(Math.min(...ys),-50);assert.deepEqual(ys.slice(0,10),[0,-8,-15,-21,-26,-30,-33,-35,-36,-36]);
 assert.equal(xs[17],-10);assert.equal(xs[22],-60);assert.equal(s.slots[0].x,-70);
 assert.ok(Object.isFrozen(s)&&Object.isFrozen(s.slots[0]));
 assert.throws(()=>enqueueNativeStuntAward(s,award(5,'toString')));
 assert.throws(()=>enqueueNativeStuntAward(s,{kind:'trick',points:1}));
 assert.throws(()=>advanceNativeStuntAwards({...s,slots:s.slots.slice(1)}));
});

test('existing pose, ring and delayed finish awards feed the queue without premature totals',()=>{
 let scoring=createNativeStuntScoring(),queue=freshNativeStuntAwards();
 const consume=out=>{scoring=out.state;for(const a of out.awards)queue=enqueueNativeStuntAward(queue,a).state;};
 consume(stepNativeStuntScoring(scoring,{move:1}));consume(stepNativeStuntScoring(scoring,{move:1}));consume(stepNativeStuntScoring(scoring,{move:0}));
 consume(collectNativeStuntRing(scoring,{ringIndex:0}));
 consume(stepNativeStuntScoring(scoring,{move:2,checkpoint:{atFinishLine:true,completeRun:true,remainingClockNative:1000,crossingOffsetNative:0}}));
 assert.equal(queue.totals.total,0);
 for(let i=0;i<20;i++){consume(stepNativeStuntScoring(scoring,{move:0,active:false}));queue=advanceNativeStuntAwards(queue).state;}
 assert.equal(queue.totals.total,0);assert.equal(queue.slots[3].amount,500);assert.equal(queue.slots[3].finishOffset,-32);
 for(let i=0;i<23;i++)queue=advanceNativeStuntAwards(queue).state;
 assert.deepEqual(queue.totals,{total:851,time:50,ring:50,trick:751});
});
