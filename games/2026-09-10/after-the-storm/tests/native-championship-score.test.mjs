import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {prepareNativeChampionshipScore as score} from '../native-championship-score.js';
import {prepareNativeChampionshipScoreUpdate as update} from '../native-race-state.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-championship-score.json',import.meta.url)));
const base=(0x2938-0x1f94)/4;
function state(c){
 const p=Array.from({length:52},(_,i)=>(0x25000000+i*31)>>>0),r=Array.from({length:1693},(_,i)=>(0x41000000+i*23)>>>0);
 p[1]=c.round;p.splice(4,4,...c.totals.map(v=>v>>>0));p.splice(8+c.round*4,4,...c.previous.map(v=>v>>>0));
 for(let s=0;s<4;s++){r[base+s*222+1]=c.places[s]>>>0;r[base+s*222+187]=c.dq[s]>>>0;}
 return {profileWordsB330:p,raceWords1f94:r,hudWords7788:Array(1442).fill(0),scene:{participantCount60e:c.count},
  roundOrderE718:[90,91,92,93],racerOrderA9dc:[99,98,97,96]};
}
function digest(words){const bytes=Buffer.alloc(words.length*4);words.forEach((v,i)=>bytes.writeUInt32BE(v,i*4));return createHash('sha256').update(bytes).digest('hex');}
test('championship awards and both slot-order passes match604 full original executions',()=>{
 for(const [i,c]of fixture.cases.entries()){
  const s=state(c),before=structuredClone(s),q=score(s),out=update(s);
  assert.deepEqual(q.operations,c.operations,'ordered source writes case '+i);
  assert.deepEqual(out.state.profileWordsB330,c.finalProfile);
  assert.deepEqual(out.state.roundOrderE718,c.roundOrder);assert.deepEqual(out.state.racerOrderA9dc,c.totalOrder);
  assert.equal(digest(out.state.raceWords1f94),c.raceSHA256);
  assert.deepEqual(out.state.hudWords7788,s.hudWords7788);assert.deepEqual(out.effects,[]);
  assert.deepEqual(s,before);assert.equal(q.diagnostic.roundAdvanced,false);
 }
});
test('scoring requires explicit order owners and late failure is atomic',()=>{
 const s=state(fixture.cases[0]);delete s.racerOrderA9dc;const before=structuredClone(s);
 assert.throws(()=>update(s),/championship order owner/);assert.deepEqual(s,before);
 for(const count of [5,-32769,1.5])assert.throws(()=>score({...s,scene:{participantCount60e:count}}),/participants/);
 for(const round of [8,0xffffffff]){const q=state(fixture.cases[0]);q.profileWordsB330[1]=round;assert.throws(()=>score(q),/round/);}
});
test('the award function is an invocation, not an idempotent display or round advance',()=>{
 const s=state(fixture.cases[0]),first=update(s).state,second=update(first).state;
 assert.deepEqual(first.profileWordsB330.slice(4,8),[7,4,2,1]);
 assert.deepEqual(second.profileWordsB330.slice(4,8),[14,8,4,2]);
 assert.equal(second.profileWordsB330[1],s.profileWordsB330[1]);
 assert.ok(Object.isFrozen(first)&&Object.isFrozen(first.racerOrderA9dc));
});
