import test from 'node:test';
import assert from 'node:assert/strict';
import {createOpponentMemory,learnOpponent,opponentHabits} from '../engine/ai-adaptation.mjs';
import {createAiBrain,stepAiBrain,decideAiIntent,resetAiBrain,visibleOpponentObservation} from '../engine/ai.mjs';
const idle=(frame,extra={})=>({frame,x:600,grounded:true,guarding:false,attacking:false,attackFrame:0,down:false,...extra});
function train(memory,kind){
  for(let frame=0;frame<=210;frame++){
    const phase=frame%60;
    const extra=kind==='jump'?{grounded:phase<20}:
      kind==='guard'?{guarding:true}:
      {attacking:phase>=20&&phase<45,attackFrame:phase-20,attackKind:'heavy',attackLevel:kind==='low'?'low':'mid'};
    learnOpponent(memory,idle(frame,extra));
  }
}
test('memory counts visible actions once, expires old patterns and ignores duplicate observations',()=>{
  for(const kind of ['jump','low','heavy','guard']){
    const memory=createOpponentMemory();train(memory,kind);
    const habits=opponentHabits(memory);
    assert.ok(kind==='jump'?habits.jumps>=3:kind==='low'?habits.repeatedLow:kind==='heavy'?habits.repeatedHeavy:habits.holdsGuard,kind);
    const before=JSON.stringify(memory);learnOpponent(memory,idle(210));assert.equal(JSON.stringify(memory),before);
    learnOpponent(memory,idle(1200));
    assert.deepEqual(opponentHabits(memory),{jumps:0,attacks:0,repeatedLow:false,repeatedHeavy:false,holdsGuard:false});
  }
  const memory=createOpponentMemory();
  learnOpponent(memory,idle(0));learnOpponent(memory,idle(1,{grounded:false,juggled:true}));
  assert.equal(opponentHabits(memory).jumps,0,'being launched is not a voluntary jump habit');
});
test('learning only starts when behavior reaches the reaction-delayed observation',()=>{
  const brain=createAiBrain('pro'),self={id:'jez',x:500,grounded:true};
  for(let frame=0;frame<15;frame++){
    stepAiBrain(brain,{frame,self,opponent:{x:650,grounded:frame===0},roll:.5});
    assert.equal(opponentHabits(brain.opponentMemory).jumps,frame>=10?1:0);
  }
  resetAiBrain(brain);
  assert.equal(opponentHabits(brain.opponentMemory).jumps,0);
});
test('trained brains change their response without making reads guaranteed',()=>{
  const scenarios=[
    ['jump','adaptive-anti-air',idle(220,{grounded:false})],
    ['guard','guard-break-throw',idle(220,{x:570,guarding:true})],
    ['heavy','bait-heavy',idle(220,{attacking:true,attackKind:'heavy',attackLevel:'mid',attackRange:130,attackFrame:1,attackActiveEndFrame:18})],
    ['low','anticipate-low',idle(220)],
  ];
  for(const [habit,reason,observation] of scenarios){
    let hits=0;
    for(let i=0;i<200;i++){
      const brain=createAiBrain('pro');train(brain.opponentMemory,habit);
      const intent=decideAiIntent(brain,{frame:229,self:{id:'jez',x:500,grounded:true,meter:0},observation,roll:i/200});
      if(intent.reason===reason)hits++;
    }
    assert.ok(hits>20&&hits<200,`${reason}: ${hits}/200`);
  }
});
test('a fresh confirmed hit gets an early decision once; a blocked hit does not',()=>{
  for(const connected of ['hit','block']){
    const brain=createAiBrain('pro');
    const opponent={x:600,grounded:true};const self={id:'jez',x:500,grounded:true,meter:0};
    for(let frame=0;frame<25;frame++)stepAiBrain(brain,{frame,self,opponent,roll:.5});
    brain.nextDecisionFrame=100;
    const confirming={...self,attacking:{kitAction:'light'},attackConnected:connected,attackSerial:4,attackHits:1};
    const before=brain.decisions;
    stepAiBrain(brain,{frame:25,self:confirming,opponent,roll:.5});
    assert.equal(brain.decisions,before+(connected==='hit'?1:0));
    const after=brain.decisions;
    stepAiBrain(brain,{frame:26,self:confirming,opponent,roll:.5});
    assert.equal(brain.decisions,after,'same contact must not bypass cadence twice');
  }
});
