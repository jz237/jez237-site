import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeEndingPresentation} from '../native-ending-presentation.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-ending-presentation.json',import.meta.url),'utf8'));
const ix=a=>(a-0x6d50)/4;
function input(c){
 const value={scene:{primaryHumanIndex:c.primary,reverseDab68:c.reverse},endingMenuWords6d50:[...c.ending],profileWordsB330:Array(50).fill(0),raceWords1f94:Array(1693).fill(0)};
 value.profileWordsB330[2]=c.difficulty;c.points.forEach((v,i)=>value.profileWordsB330[4+i]=v>>>0);c.times.forEach((v,i)=>value.profileWordsB330[40+i]=v>>>0);
 c.records.forEach((v,i)=>value.raceWords1f94[(0x2660-0x1f94)/4+i]=v>>>0);value.raceWords1f94[(0x2c70-0x1f94)/4+c.primary*222]=c.rank>>>0;return value;
}

test('274 original layout executions match round labels, records, tied standings, colors and preview order',()=>{
 for(const c of reference.cases){
  const s=input(c.input),before=structuredClone(s),p=prepareNativeEndingPresentation(s,c.input);
  assert.deepEqual(p.commands,c.commands);assert.deepEqual(s,before);assert.ok(Object.isFrozen(p.commands));
  assert.deepEqual(p.diagnostic.sourceLogicalSize,[320,240]);assert.equal(p.diagnostic.graphicsExecuted,false);
 }
});

test('standings preserve sorted slots, selected avatar names and competition ranking through ties',()=>{
 const c=reference.cases.find(c=>c.input.points.join(',')==='43,43,10,8'&&c.input.ending[ix(0x6e80)+1]===10),p=prepareNativeEndingPresentation(input(c.input),c.input);
 const text=p.commands.filter(c=>c.kind==='text');
 assert.deepEqual(text.filter((_,i)=>i%3===0).map(c=>c.text),['1','1','3','4']);
 assert.deepEqual(text.filter((_,i)=>i%3===1).map(c=>c.text),['RIDER TWO','RIDER THREE','RIDER ONE','RIDER ZERO']);
 assert.deepEqual(p.commands.filter(c=>c.kind==='riderPreview').map(c=>c.riderIndex),[1,0,2,3]);
 assert.equal(text.filter(c=>c.mode===6).length,2);
 const depth=p.commands.findIndex(c=>c.kind==='depthClear'),restore=p.commands.findIndex(c=>c.kind==='restoreColorTarget'),preview=p.commands.findIndex(c=>c.kind==='riderPreview');
 assert.ok(depth<restore&&restore<preview);
});

test('unused data stays optional and malformed late names or source traversal never partially modify owners',()=>{
 const idle={endingMenuWords6d50:Array(126).fill(0)};
 for(let slot=0;slot<10;slot++)delete idle.endingMenuWords6d50[ix(0x6e80+slot*16)+1];
 assert.deepEqual(prepareNativeEndingPresentation(idle).commands,[]);
 const c=reference.cases.find(c=>c.input.ending[ix(0x6e80)+1]===10),s=input(c.input),before=structuredClone(s);
 const missing={...c.input,riderNamesB298:[...c.input.riderNamesB298]};delete missing.riderNamesB298[0];
 assert.throws(()=>prepareNativeEndingPresentation(s,missing),/riderNames/);assert.deepEqual(s,before);
 s.endingMenuWords6d50[ix(0x6e80)]=0;s.endingMenuWords6d50[ix(0x6e80+9*16)]=1;s.endingMenuWords6d50[ix(0x6e80+9*16)+1]=10;
 assert.throws(()=>prepareNativeEndingPresentation(s,c.input),/ten-panel owner/);
});
