import test from 'node:test';
import assert from 'node:assert/strict';
import {EXCHANGE_STYLES,selectComboContinuation} from '../engine/ai-strategy.mjs';
import {createAiBrain,stepAiBrain,resolveDemoCpuInput} from '../engine/ai.mjs';
import {createFighterMove,getKitMoveProfile} from '../engine/fighter-kits.mjs';
import {recoveryApproach} from '../engine/ai-defense.mjs';
import {boundedBodyOffset,contactPoint} from '../engine/combat-presentation.mjs';

test('every fighter ends its route budget, while a multi-hit move counts once',()=>{
 for(const [id,style] of Object.entries(EXCHANGE_STYLES)){
  const attack=createFighterMove(id,'light');
  for(let frame=0;frame<attack.totalFrames;frame++){
   assert.equal(selectComboContinuation(id,{id,x:500,grounded:true,health:100,meter:100,
    attacking:attack,attackFrame:frame,attackConnected:'hit',confirmWindowFrames:9,
    aiBrain:{exchangeMoves:style.moves}},{x:570,health:80},.1),null,id);
  }
 }
 const brain=createAiBrain('pro'),opponent={x:700,grounded:true,health:100};
 const fighter={id:'jez',x:500,health:100,meter:0,grounded:true,aiBrain:brain};
 const context={exhibition:true,timeRemaining:90};
 for(let frame=0;frame<25;frame++)stepAiBrain(brain,{frame,self:fighter,opponent,context});
 for(let frame=25;frame<35;frame++)stepAiBrain(brain,{frame,self:{...fighter,attacking:createFighterMove('jez','special'),attackSerial:1,attackHits:frame-24,attackConnected:'hit'},opponent,context});
 assert.equal(brain.exchangeMoves,1);
 stepAiBrain(brain,{frame:35,self:fighter,opponent,context});
 assert.equal(brain.exchangeMoves,0);assert.ok(brain.exchangeUntil>35);
 const first=brain.exchangeUntil;
 stepAiBrain(brain,{frame:70,self:{...fighter,attacking:createFighterMove('jez','light'),attackSerial:2,attackConnected:'block'},opponent,context});
 stepAiBrain(brain,{frame:71,self:fighter,opponent,context});
 assert.ok(brain.exchangeUntil>first,'each completed exchange earns a reset');
 assert.equal(brain.intent.reason,'exchange-reset');
});

test('closing a punish gap requires time to walk and strike, and cannot be replaced by the director',()=>{
 for(const id of Object.keys(EXCHANGE_STYLES)){
  const self={id,x:500,grounded:true},reach=getKitMoveProfile(id,'light').range;
  const observed={x:500+reach+15,frame:100,grounded:true,attacking:true,attackFrame:25,attackActiveEndFrame:20,attackTotalFrames:80};
  const intent=recoveryApproach(self,observed,100);assert.equal(intent?.reason,'recovery-approach',id);
  assert.equal(recoveryApproach(self,observed,155),null);
  assert.equal(recoveryApproach({...self,blockstunFrames:5},observed,100),null);
  assert.equal(recoveryApproach(self,{...observed,attackFrame:10},100),null);
  assert.deepEqual(resolveDemoCpuInput({intent},{right:true,guard:true},{super:true},self,100),{right:true,guard:true});
 }
});

test('contact stays on the receiving body; mirrored body offsets honor the separation cap',()=>{
 const victim={x:700,y:600,width:78,height:200};
 for(const direction of [-1,1]){
  const tip={x:700-direction*25,y:435};
  assert.deepEqual(contactPoint({level:'mid'},victim,direction,tip,null),tip);
  const missed=contactPoint({level:'low'},victim,direction,{x:300,y:300},null);
  assert.equal(missed.y,550);assert.ok(Math.abs(missed.x-700)<40);
  assert.equal(Math.abs(boundedBodyOffset(60*direction,direction,130)),0);
  assert.equal(boundedBodyOffset(60*direction,direction,150),7*direction);
  assert.equal(boundedBodyOffset(-15*direction,direction,130),-15*direction);
 }
});
