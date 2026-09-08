import test from 'node:test';
import assert from 'node:assert/strict';
import {fighterStyle,roundStrategy,strategicIntent,selectComboContinuation,meterOpportunity,FIGHT_STYLES} from '../engine/ai-strategy.mjs';
import {createAiBrain,stepAiBrain,resolveDemoCpuInput} from '../engine/ai.mjs';
import {createFighterMove,getKitMoveProfile,fighterActionGroup} from '../engine/fighter-kits.mjs';
import {canCancelAttack} from '../engine/combos.mjs';
const self=(id='jez',extra={})=>({id,x:500,health:80,meter:100,grounded:true,...extra});
const other=(extra={})=>({frame:100,x:630,health:80,grounded:true,attacking:false,attackFrame:0,attackActiveEndFrame:0,attackTotalFrames:0,...extra});
const choose=(id='jez',a={},b={},extra={})=>strategicIntent({id,self:self(id,a),opponent:other(b),frame:109,timeRemaining:99,roll:.2,...extra});
test('health and clock change risk, while a tied fight stays active',()=>{
 assert.equal(roundStrategy(self('jez',{health:90}),other({health:60}),20),'protect-lead');
 assert.equal(roundStrategy(self('jez',{health:50}),other({health:80}),70),'chase');
 assert.equal(roundStrategy(self('jez',{health:70}),other(),8),'desperation');
 assert.equal(roundStrategy(self(),other(),8),'balanced');
 assert.equal(choose('jez',{health:90},{health:60},{timeRemaining:20}).movement,'retreat');
 assert.equal(choose('jez',{health:40},{x:1000},{timeRemaining:8}).movement,'advance');
});
test('cornered fighters escape toward open space; pressure keeps an opponent trapped',()=>{
 for(const id of Object.keys(FIGHT_STYLES)){
  const escape=choose(id,{x:90},{x:300});assert.equal(escape.reason,'corner-escape');assert.equal(escape.movement,'advance');
  const mirrored=choose(id,{x:1190},{x:980});assert.equal(mirrored.movement,'advance');
  const pressure=choose(id,{x:940},{x:1170});assert.equal(pressure.reason,'corner-pressure');assert.notEqual(pressure.movement,'retreat');
 }
});
test('personality changes distance, initiative and reset duration across the entire roster',()=>{
 assert.equal(Object.keys(FIGHT_STYLES).length,10);
 assert.equal(new Set(Object.values(FIGHT_STYLES).map(s=>s.name)).size,10);
 const sample=id=>{let advance=0,attack=0;for(let i=0;i<1000;i++){
  const intent=choose(id,{}, {x:650},{roll:i/1000});
  if(intent?.movement==='advance')advance++;if(intent?.action)attack++;
 }return {advance,attack};};
 const jez=sample('jez'),benny=sample('benny');assert.ok(benny.attack>jez.attack);assert.ok(benny.advance>jez.advance);
 const signatures=Object.keys(FIGHT_STYLES).map(id=>{
  const tally={};for(const distance of [90,150,250,430])for(let i=0;i<200;i++){
   const intent=choose(id,{}, {x:500+distance},{roll:i/200});
   const key=`${distance}:${intent?.movement}:${intent?.action}:${Boolean(intent?.dash)}`;
   tally[key]=(tally[key]||0)+1;
  }return JSON.stringify(tally);
 });
 assert.equal(new Set(signatures).size,10,'every fighter needs a distinct measured decision pattern');
 assert.ok(fighterStyle('donald').range>fighterStyle('deathblow').range);
 assert.ok(fighterStyle('benny').reset<fighterStyle('jez').reset);
});
test('combo choices obey real cancel windows, reach and cost for every fighter',()=>{
 for(const id of Object.keys(FIGHT_STYLES)){
  let choices=0;
  for(const action of ['light','heavy','special']){
   const attack=createFighterMove(id,action);if(!attack)continue;
   for(let frame=0;frame<attack.totalFrames;frame++){
    const fighter=self(id,{attacking:attack,attackFrame:frame,attackConnected:'hit',confirmWindowFrames:6,attackHits:1});
    const choice=selectComboContinuation(id,fighter,other({x:570}),.1);
    if(choice){choices++;assert.ok(canCancelAttack(attack,fighterActionGroup(choice),frame,'hit'));}
    assert.equal(selectComboContinuation(id,{...fighter,attackConnected:'block'},other(),.1),null);
    assert.equal(selectComboContinuation(id,{...fighter,confirmWindowFrames:0},other(),.1),null);
    assert.equal(selectComboContinuation(id,fighter,other({x:4000}),.1),null);
   }
  }
  assert.ok(choices>0,`${id} needs a legal continuation`);
 }
});
test('the director cannot spend meter on guarded guesses or cancel a blocked strike',()=>{
 const brain=createAiBrain('pro');brain.opponentMemory.last=other({guarding:true});
 const safe={guard:true};assert.deepEqual(resolveDemoCpuInput(brain,safe,{super:true},self(),109),safe);
 assert.equal(meterOpportunity(self(),other({guarding:true}),109,'super'),false);
 assert.equal(meterOpportunity(self('jez',{blockstunFrames:8}),other(),109,'enhanced'),true);
 const attack=createFighterMove('jez','light');
 const blocked=resolveDemoCpuInput(brain,safe,{enhanced:true},self('jez',{attacking:attack,attackConnected:'block'}),109);
 assert.equal(blocked.enhanced,false);assert.equal(blocked.super,false);
 const confirming={...brain,intent:{reason:'hit-confirm'}};
 assert.equal(resolveDemoCpuInput(confirming,{heavy:true},{super:true},self('jez',{attacking:attack,attackConnected:'hit'}),109).heavy,true);
});
test('completed exchanges create bounded repositioning, never pauses inside attacks',()=>{
 const brain=createAiBrain('pro'),context={exhibition:true,timeRemaining:99},opponent={x:630,health:80,grounded:true};
 for(let frame=0;frame<30;frame++)stepAiBrain(brain,{frame,self:self(),opponent,context,roll:.5});
 const attack=createFighterMove('jez','light');
 stepAiBrain(brain,{frame:30,self:self('jez',{attacking:attack,attackConnected:'block'}),opponent,context,roll:.5});
 stepAiBrain(brain,{frame:31,self:self(),opponent,context,roll:.5});
 assert.equal(brain.exchangeUntil,31+fighterStyle('jez').reset);
 assert.equal(choose('jez',{}, {},{frame:35,until:brain.exchangeUntil}).reason,'exchange-reset');
 assert.notEqual(choose('jez',{}, {},{frame:70,until:brain.exchangeUntil})?.reason,'exchange-reset');
 assert.equal(choose('jez',{attacking:attack},{},{frame:35,until:brain.exchangeUntil}),null);
 assert.notEqual(choose('jez',{health:30},{health:80},{timeRemaining:5,frame:35,until:brain.exchangeUntil})?.reason,'exchange-reset');
});
