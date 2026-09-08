import test from 'node:test';
import assert from 'node:assert/strict';
import {createAiBrain, decideAiIntent, visibleOpponentObservation, observedAttackTiming, selectRecoveryPunish, preferTacticalInput} from '../engine/ai.mjs';
import {getKitMoveProfile} from '../engine/fighter-kits.mjs';
const roster=['jez','benny','alan','ali','commissioner','cyraxx','deathblow','devil','donald','post'];
const self=id=>({id,x:500,grounded:true,health:100,meter:0});
const observe=(extra={})=>visibleOpponentObservation({x:590,grounded:true,...extra},100);

test('recovery reads account for reaction age and stop at the end of the observed attack',()=>{
  const o=observe({attacking:{activeEndFrame:12,totalFrames:35},attackFrame:9});
  assert.deepEqual(observedAttackTiming(o,100),{live:true,recovery:0});
  assert.deepEqual(observedAttackTiming(o,109),{live:false,recovery:17});
  assert.deepEqual(observedAttackTiming(o,140),{live:false,recovery:0});
});
test('all fighters choose a punish that reaches and fits the remaining recovery',()=>{
  for(const id of roster){
    assert.equal(selectRecoveryPunish(id,600,40),null);
    assert.equal(selectRecoveryPunish(id,60,2),null);
    for(const distance of [70,100,130,160]) for(const recovery of [8,12,20,35]){
      const choice=selectRecoveryPunish(id,distance,recovery);
      if(!choice)continue;
      const move=getKitMoveProfile(id,choice.action,{limb:choice.limb});
      assert.ok(move.range>=distance, id);
      assert.ok(move.startupFrames+2<=recovery,id);
    }
    assert.ok(selectRecoveryPunish(id,70,35),id);
  }
});
test('brains punish recovery, mix against visible guards, and avoid distant normal attacks',()=>{
  for(const id of roster){
    const seen=new Set();
    const recovery=observe({attacking:{level:'mid',activeEndFrame:12,totalFrames:50},attackFrame:20});
    for(let i=0;i<200;i++){
      const roll=i/200;
      seen.add(decideAiIntent(createAiBrain('pro'),{self:self(id),frame:109,observation:recovery,roll}).reason);
      for(const crouching of [true,false]){
        const intent=decideAiIntent(createAiBrain('pro'),{self:self(id),frame:109,observation:observe({guarding:true,crouch:crouching}),roll});
        if(intent.reason==='guard-mix'){
          assert.equal(intent.down,!crouching);
          seen.add(crouching?'overhead':'low');
        }
      }
      const far=decideAiIntent(createAiBrain('pro'),{self:self(id),frame:109,observation:observe({x:1100}),roll});
      assert.ok(!['light','heavy','throw'].includes(far.action),`${id} swings ${far.action} at 600`);
    }
    for(const reason of ['recovery-punish','overhead','low'])assert.ok(seen.has(reason),`${id}: ${reason}`);
  }
});
test('exhibitions honor actionable tactics without interrupting attacks or repeatedly pulsing them',()=>{
  const fighter=self('jez'), brain={intent:{reason:'recovery-punish'}};
  assert.equal(preferTacticalInput(brain,{heavy:true},fighter),true);
  assert.equal(preferTacticalInput(brain,{},fighter),false);
  for(const extra of [{attacking:{}},{hitstunFrames:8},{blockstunFrames:8},{down:true},{grounded:false}])
    assert.equal(preferTacticalInput(brain,{heavy:true},{...fighter,...extra}),false);
  assert.equal(preferTacticalInput({intent:{reason:'low-block'}},{guard:true,down:true},fighter),true);
  assert.equal(preferTacticalInput({intent:{reason:'hit-confirm'}},{special:true},{...fighter,attacking:{}}),true);
});
