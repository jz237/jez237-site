import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeEndingMenuDisplay,prepareNativeEndingMenuPostDisplay} from '../native-ending-menu.js';
import {prepareNativeEndingMenuDisplayUpdate,prepareNativeEndingMenuPostDisplayUpdate} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ending-display.json',import.meta.url),'utf8'));
const seed=createRace({mode:'time',physics:'native',course:getCourse('greyhaven')}).nativeLaunch.snapshot();
const ix=a=>(a-0x6d50)/4;
const views={displayListHead:0x81000000,externalReturns:reference.externalReturns,fadeTemplateWords6cc0:[0,0,0,0x10000,0,0,0,0,0x10000]};
function input(c){
 const s=structuredClone(seed);Object.assign(s.scene,{initLatch63c:c.latch,gameStateAb24:c.state,returnState630:c.destination});
 s.hudWords7788[(0x8a14-0x7788)/4]=(0xbeef0000|(c.fade&65535))>>>0;s.endingMenuWords6d50=Array(126).fill(0);return s;
}

test('ending display caller matches144 original executions and preserves returned drawing heads',()=>{
 for(const c of reference.cases){
  const s=input(c),before=structuredClone(s),p=prepareNativeEndingMenuDisplay(s,views);
  assert.deepEqual(p.operations,c.operations);assert.equal(p.displayListHead,c.displayListHead);assert.deepEqual(s,before);
  if(!p.diagnostic.firstEntry)assert.deepEqual(prepareNativeEndingMenuPostDisplay(s).operations,p.operations.slice(p.operations.findIndex(o=>o.consumer==='802c602c')+1));
 }
});

test('first entry defers input; subsequent controls expand after drawing and hand off only after fade completion',()=>{
 const s=input({latch:1,state:102,destination:0,fade:0});s.endingMenuWords6d50[ix(0x6df4)]=1;s.menuWordsE658[0]=0x1000;
 const first=prepareNativeEndingMenuDisplayUpdate(s,views,{expandInput:true});
 assert.equal(first.state.scene.initLatch63c,0);assert.equal(first.state.scene.gameStateAb24,102);assert.equal(first.state.endingMenuWords6d50[ix(0x6df8)],0);
 const next=prepareNativeEndingMenuDisplayUpdate(first.state,views,{expandInput:true});
 assert.equal(next.state.scene.gameStateAb24,103);assert.equal(next.state.scene.returnState630,2);assert.equal(next.state.scene.initLatch63c,1);
 assert.equal(next.displayListHead,0x81000400);
 const draw=next.operations.findIndex(o=>o.consumer==='802c602c'),timer=next.operations.findIndex(o=>o.kind==='endingMenuWrite');
 assert.ok(timer>draw);assert.equal(next.effects.at(-1).consumer,'800c1f60');
 const pending=prepareNativeEndingMenuPostDisplayUpdate(next.state,views,{expandInput:true});assert.deepEqual(pending.operations,[]);
 const done=structuredClone(next.state);done.hudWords7788[(0x8a14-0x7788)/4]=1;
 assert.deepEqual(prepareNativeEndingMenuPostDisplayUpdate(done).effects,[{kind:'externalCall',consumer:'801eb180',arguments:[]}]);
 done.scene.returnState630=100;
 assert.deepEqual(prepareNativeEndingMenuPostDisplayUpdate(done).effects,[{kind:'externalCall',consumer:'801ec9c8',arguments:[]}]);
});

test('late invalid renderer returns and fade data reject atomically while first entry only needs its reached return',()=>{
 const s=input({latch:1,state:102,destination:0,fade:0});
 assert.equal(prepareNativeEndingMenuDisplayUpdate(s,{displayListHead:0,externalReturns:{'80093dbc':4}}).displayListHead,4);
 s.scene.initLatch63c=0;s.endingMenuWords6d50[ix(0x6df4)]=1;s.menuWordsE658[0]=0x8000;const before=structuredClone(s);
 assert.throws(()=>prepareNativeEndingMenuDisplayUpdate(s,{...views,externalReturns:{...views.externalReturns,'802c602c':7}}),/aligned/);
 assert.throws(()=>prepareNativeEndingMenuDisplayUpdate(s,{...views,fadeTemplateWords6cc0:undefined},{expandInput:true}),/fadeTemplate/);
 assert.deepEqual(s,before);
});
