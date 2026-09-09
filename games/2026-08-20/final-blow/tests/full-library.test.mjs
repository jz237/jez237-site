import test from 'node:test';
import assert from 'node:assert/strict';
import {createFullLibrarySelector,FULL_LIBRARY_FIGHTERS,fullLibraryBanks,normalLibraryPhase,fullLibraryAttackFrame} from '../engine/full-library.mjs';

test('every bank can add a drawing without changing its canonical pose or held endpoint',()=>{
 for(const id of FULL_LIBRARY_FIGHTERS)for(const bank of fullLibraryBanks(id)){
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
 const other={def:{id:'unknown'}};assert.equal(select(other,other,pose,0,true),pose);
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

test('roster manifests only request banks each character owns',()=>{
 assert.equal(fullLibraryBanks('jez').length,28);
 assert.equal(fullLibraryBanks('commissioner').length,20);
 for(const id of ['alan','devil','donald'])assert.equal(fullLibraryBanks(id).length,23);
 for(const id of ['ali','cyraxx','deathblow','post'])assert.equal(fullLibraryBanks(id).length,24);
 assert.deepEqual(fullLibraryBanks('unknown'),[]);
 const f={def:{id:'commissioner'}},pose={bank:'specials',frame:0};
 assert.equal(createFullLibrarySelector()(f,f,pose,1,true),pose);
});

test('painted startup and recovery companions follow original four/three/four slot timing',()=>{
 const a={kind:'light',activeStartFrame:5,activeEndFrame:8,totalFrames:20};
 const f={def:{id:'ali'},attacking:a,attackConnected:'hit'};
 for(const [bank,start,duration,slots] of [['painted-flow',1,4,4],['painted-flow',8,12,3],['painted-recovery',8,12,4]]){
  for(let slot=0;slot<slots;slot++)for(const half of [.25,.75]){
   f.attackFrame=start+(slot+half)*duration/slots;
   assert.ok(Math.abs(normalLibraryPhase(f,bank)-half)<1e-9,`${bank}/${slot}/${half}`);
  }
 }
 f.attackFrame=1.25;assert.equal(normalLibraryPhase(f,'painted-recovery'),null);
 f.attackConnected=null;f.attackFrame=9;
 assert.ok(Math.abs(normalLibraryPhase(f,'painted-flow')-.1)<1e-9);
});
