import test from 'node:test';
import assert from 'node:assert/strict';
import {createFullLibrarySelector,FULL_LIBRARY_BANKS,normalLibraryPhase,fullLibraryAttackFrame} from '../engine/full-library.mjs';

test('every bank can add a drawing without changing its canonical pose or held endpoint',()=>{
 for(const id of ['jez','benny'])for(const bank of FULL_LIBRARY_BANKS){
  const f={def:{id}},select=createFullLibrarySelector();
  const pose={bank:bank.startsWith('inbetween-')?bank.slice(10):bank,frame:1,artBank:bank,artScale:1.05};
  const first=select(f,f,pose,10,true),last=select(f,f,pose,12,true),held=select(f,f,pose,100,true);
  assert.equal(first.artBank,'full-'+bank,`${id}/${bank}`);
  for(const out of [first,last,held]){assert.equal(out.bank,pose.bank);assert.equal(out.frame,pose.frame);assert.equal(out.artScale,pose.artScale);}
  assert.deepEqual(last,pose);assert.deepEqual(held,pose);
 }
});

test('quarter-tick contacts retain their endpoint and special clocks interpolate only within a phase',()=>{
 const a={kind:'special',activeStartFrame:10,activeEndFrame:16,totalFrames:30};
 const f={def:{id:'jez'},attacking:a,attackFrame:15.75,grounded:true},select=createFullLibrarySelector(),pose={bank:'unified-ext3',frame:2};
 assert.equal(select(f,f,pose,15.75,true).artBank,'full-unified-ext3');
 f.attackFrame=15.875;assert.equal(select(f,f,pose,15.875,true),pose);
 f.attackFrame=11;assert.equal(fullLibraryAttackFrame(f,{attack:a,grounded:true,frame:10},.5),10.5);
 f.attackFrame=10;assert.equal(fullLibraryAttackFrame(f,{attack:a,grounded:true,frame:9},.5),10);
 f.hitstunFrames=2;f.attackFrame=11;assert.equal(fullLibraryAttackFrame(f,{attack:a,grounded:true,frame:10},.5),11);
});
test('late loads cannot insert a drawing into an existing pose; other fighters are untouched',()=>{
 const f={def:{id:'jez'}},select=createFullLibrarySelector(),pose={bank:'unified',frame:0};
 assert.equal(select(f,f,pose,0,false),pose);
 assert.equal(select(f,f,pose,.25,true),pose);
 assert.equal(select(f,f,{...pose,frame:1},1,true).artBank,'full-unified');
 const other={def:{id:'alan'}};assert.equal(select(other,other,pose,0,true),pose);
});
test('short attack intervals contain both drawings without extending the move or losing contact',()=>{
 const attack={kind:'light',activeStartFrame:4,activeEndFrame:7,totalFrames:15};
 const f={def:{id:'jez'},attacking:attack},select=createFullLibrarySelector();
 const before=JSON.stringify(attack),pose={bank:'smooth-flow',frame:1};
 for(let slot=0;slot<8;slot++){
  f.attackFrame=1+(slot+.25)*3/8;const first=select(f,f,pose,f.attackFrame,true);
  f.attackFrame=1+(slot+.75)*3/8;const last=select(f,f,pose,f.attackFrame,true);
  assert.equal(first.artBank,'full-smooth-flow');assert.equal(last.artBank,undefined);
 }
 f.attackFrame=4;assert.equal(select(f,f,{bank:'smooth-contact',frame:1},4,true).artBank,undefined);
 f.attackFrame=6;assert.equal(select(f,f,{bank:'smooth-contact',frame:1},6,true).artBank,'full-smooth-contact');
 assert.equal(JSON.stringify(attack),before);
 assert.equal(normalLibraryPhase({...f,attacking:{...attack,superMove:true}},'smooth-flow'),null);
});
