import test from 'node:test';
import assert from 'node:assert/strict';
import {deliberateDefense} from '../engine/ai-defense.mjs';
import {viewerPhase,VIEWER_MOVES} from '../engine/move-viewer.mjs';
import {createFighterMove} from '../engine/fighter-kits.mjs';
const self={id:'jez',x:500,grounded:true,movement:{walkBack:180}};
const threat={frame:100,x:580,grounded:true,attacking:true,attackKind:'heavy',attackLevel:'mid',attackFrame:2,attackStartupFrame:24,attackActiveEndFrame:30,attackRange:150};
test('slow windups invite a reachable interrupt; late observations do not',()=>{
 assert.equal(deliberateDefense(self,threat,100,.1)?.reason,'windup-interrupt');
 assert.notEqual(deliberateDefense(self,threat,119,.1)?.reason,'windup-interrupt');
 assert.notEqual(deliberateDefense(self,{...threat,attackKind:'special'},100,.1)?.reason,'windup-interrupt');
 assert.equal(deliberateDefense(self,threat,130,.1),null);
 assert.equal(deliberateDefense({...self,blockstunFrames:3},threat,100,.1),null);
});
test('retreat requires time and stage space; crouch cover never answers overhead',()=>{
 assert.equal(deliberateDefense(self,{...threat,x:640},100,.5)?.reason,'spacing-defense');
 assert.equal(deliberateDefense({...self,x:30},{...threat,x:170},100,.5),null);
 assert.equal(deliberateDefense(self,{...threat,attackFrame:23},100,.5),null);
 assert.equal(deliberateDefense(self,{...threat,attackFrame:23},100,.3)?.reason,'crouch-cover');
 assert.equal(deliberateDefense(self,{...threat,attackFrame:23,attackLevel:'overhead'},100,.3),null);
});
test('viewer contact matches each kit\'s real attack window',()=>{
 for(const id of ['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post'])for(const row of VIEWER_MOVES){
  if(row.reaction)continue;const move=createFighterMove(id,row.action,row.context);if(!move)continue;
  assert.equal(viewerPhase(move.activeStartFrame,move),'CONTACT');
  assert.equal(viewerPhase(move.activeEndFrame,move),'RECOVERY');
  assert.equal(viewerPhase(move.totalFrames+1,move),'READY');
 }
});
