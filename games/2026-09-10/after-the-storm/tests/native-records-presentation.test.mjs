import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRecordsPresentation as prepare} from '../native-records-presentation.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-records-presentation.json',import.meta.url),'utf8'));
const ix=a=>(a-0x80c0)/4,ri=a=>(a-0x1f94)/4;
function fixture(c=reference.cases[0]){
 const words=[...reference.baseRecords];for(const [i,v]of c.overrides)words[i]=v;
 return {recordsBrowserWords80c0:words,raceWords1f94:[...reference.raceWords1f94]};
}
const views=reference.sourceViews;

test('records layout matches355 original executions with ordered text, styles, previews, clips and arrows',()=>{
 for(const [index,c]of reference.cases.entries()){
  const state=fixture(c),before=structuredClone(state),q=prepare(state,views);
  assert.deepEqual(q.commands,c.commands,`original caller case${index}`);assert.deepEqual(state,before);
  assert.ok(Object.isFrozen(q.commands));assert.ok(q.commands.every(Object.isFrozen));
  assert.deepEqual(q.diagnostic.sourceLogicalSize,[320,240]);
 }
});

test('ordinary, reverse and stunt records select distinct stored names, times, scores and avatars',()=>{
 const s=fixture(),a=s.recordsBrowserWords80c0;a[ix(0x80ec)]=2;
 for(const [kind,tag,previews]of [[1,'T',4],[2,'S',3],[3,'R',1]]){
  a[ix(0x80f0)]=kind;const q=prepare(s,views).commands;
  assert.equal(q.filter(c=>c.kind==='riderPreview').length,previews);
  assert.ok(q.some(c=>c.kind==='text'&&c.text===`${tag}20`));
  assert.equal(q.filter(c=>c.kind==='score').length,kind===2?3:0);
  assert.equal(q.filter(c=>c.kind==='time').length,kind===1?4:kind===3?1:0);
 }
});

test('post-race highlight uses time-record flags even on a stunt page; reverse retains its clipped placeholder',()=>{
 const s=fixture(),a=s.recordsBrowserWords80c0;a[ix(0x80ec)]=2;a[ix(0x80f0)]=2;a[ix(0x81a4)]=1;
 s.raceWords1f94[ri(0x2668)]=2;s.raceWords1f94[ri(0x2930)]=1;
 let q=prepare(s,views).commands,mode,scoreModes=[];
 for(const c of q){if(c.kind==='style')mode=c.mode;if(c.kind==='score')scoreModes.push(mode);}
 assert.deepEqual(scoreModes,[0,6,0]);assert.equal(q.some(c=>c.kind==='text'&&['<','>'].includes(c.text)),false);
 a[ix(0x80f0)]=3;q=prepare(s,views).commands;
 assert.ok(q.some(c=>c.kind==='text'&&c.text==='---'&&c.x===155&&c.y===302));
});

test('unreached records are optional; malformed reached data rejects without altering retained owners',()=>{
 const s=fixture(),a=s.recordsBrowserWords80c0;a[ix(0x80ec)]=10;a[ix(0x810c)]=10;
 delete s.raceWords1f94;assert.doesNotThrow(()=>prepare(s,views));
 a[ix(0x80ec)]=9;assert.deepEqual(prepare(s).commands,[]);
 a[ix(0x80ec)]=1;a[ix(0x80f0)]=1;assert.throws(()=>prepare(s,views),/raceWords/);
 s.raceWords1f94=[...reference.raceWords1f94];s.raceWords1f94[ri(0x1ff0+60+40+16)]=0x41424344;
 const before=structuredClone(s);assert.throws(()=>prepare(s,views),/terminate/);assert.deepEqual(s,before);
 s.raceWords1f94[ri(0x1ff0+60+40+16)]=0x41424300;s.raceWords1f94[ri(0x22c0+20+12)]=99;
 assert.throws(()=>prepare(s,views),/variant/);
});
