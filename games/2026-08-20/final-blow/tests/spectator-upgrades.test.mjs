import test from 'node:test';
import assert from 'node:assert/strict';
import {carryOpponentMemory,createOpponentMemory,learnOpponent,opponentHabits} from '../engine/ai-adaptation.mjs';
import {projectileIntent} from '../engine/ai-projectiles.mjs';
import {comboObjective,scoreComboOption} from '../engine/ai-strategy.mjs';
import {getKitMoveProfile} from '../engine/fighter-kits.mjs';
import {FIGHTER_SCALE} from '../engine/defense.mjs';
import {normalizeSpectatorConfig,configuredDirector,addSpectatorConfig,spectatorConfigFromUrl} from '../engine/spectator-config.mjs';
import {ReplayFrames} from '../engine/instant-replay.mjs';

test('round memory preserves bounded evidence and gives changed habits room to win',()=>{
 const old=createOpponentMemory();old.events=Array.from({length:30},(_,frame)=>({frame,type:'attack',kind:'heavy',level:'low'}));
 const memory=carryOpponentMemory(old,1000);assert.equal(memory.events.length,8);assert.equal(memory.roundsRemembered,1);assert.equal(memory.last,null);
 assert.equal(opponentHabits(memory).repeatedLow,true);
 for(let i=0;i<16;i++){
  learnOpponent(memory,{frame:1100+i*2,grounded:true,attacking:false});
  learnOpponent(memory,{frame:1101+i*2,grounded:true,attacking:true,attackKind:'light',attackLevel:'mid',attackFrame:1});
 }
 assert.equal(opponentHabits(memory).repeatedLow,false);
 learnOpponent(memory,{frame:2050,grounded:true,attacking:false});assert.ok(memory.events.every(e=>!e.expires));
 assert.equal(old.events.length,30,'carrying must not mutate the old round');
});
const self={id:'jez',x:500,y:600,grounded:true};
const shot={x:750,y:550,vx:-600,width:40,height:30,level:'low',lifeFrames:100,armFrames:0};
const observation=(extra={})=>({frame:100,x:1000,projectiles:[{...shot,...extra}]});
test('projectile defense blocks emergencies and layers, jumps only with clearance and ignores stale shots',()=>{
 assert.equal(projectileIntent(self,observation({x:590}),100,.9).reason,'projectile-block');
 assert.equal(projectileIntent(self,observation({x:590}),100,.9).down,true);
 assert.equal(projectileIntent(self,observation(),100,.2).reason,'projectile-jump');
 assert.notEqual(projectileIntent(self,observation({y:240}),100,.2)?.reason,'projectile-jump');
 assert.equal(projectileIntent(self,{...observation(),projectiles:[shot,{...shot,x:790}]},100,.2).reason,'projectile-block');
 assert.equal(projectileIntent(self,observation({x:1080}),100,.9).reason,'projectile-advance');
 assert.equal(projectileIntent(self,observation({vx:600}),100),null);
 assert.equal(projectileIntent(self,observation({lifeFrames:5}),110),null);
 assert.equal(projectileIntent({...self,grounded:false},observation(),100),null);
});
test('a ranged fighter counters with a real same-lane projectile, never a melee counter stance',()=>{
 const move=getKitMoveProfile('donald','commandSpecial');
 const intent=projectileIntent({...self,id:'donald'},observation({x:1040,y:600+move.projectile.yOffsets[0]*FIGHTER_SCALE}),100,.1);
 assert.equal(intent.reason,'projectile-counter');assert.ok(getKitMoveProfile('donald',intent.action).projectile);
 assert.notEqual(projectileIntent({...self,id:'alan'},observation({x:1040}),100,.1)?.reason,'projectile-counter');
});
test('combo scoring changes between corner carry, knockdown and affordable lethal damage',()=>{
 const attacker={x:500,combo:{hits:0}},open={x:700,health:80},corner={x:1180,health:80};
 const carry={cost:0,move:{damage:12,push:500,startupFrames:8}},down={cost:0,move:{damage:14,push:50,knockdown:true,startupFrames:8}};
 assert.equal(comboObjective(attacker,open),'corner-carry');assert.equal(comboObjective(attacker,corner),'knockdown');
 assert.ok(scoreComboOption(carry,attacker,open)>scoreComboOption(down,attacker,open));
 assert.ok(scoreComboOption(down,attacker,corner)>scoreComboOption(carry,attacker,corner));
 const dying={...open,health:5};assert.equal(comboObjective(attacker,dying),'finish');
 assert.ok(scoreComboOption(carry,attacker,dying)>scoreComboOption({cost:100,move:{damage:60,startupFrames:15}},attacker,dying));
});
test('custom matches validate settings and reproduce the selected pair, stage and series through a share URL',()=>{
 const fighters=['jez','benny','donald'],stages=['alley'];
 const config={first:'jez',second:'benny',stage:'alley',difficulty:'pro',bestOf:5};
 assert.deepEqual(normalizeSpectatorConfig(config,fighters,stages),config);
 for(const bad of [{second:'jez'},{first:'unknown'},{stage:'missing'},{difficulty:'impossible'},{bestOf:2}])assert.equal(normalizeSpectatorConfig({...config,...bad},fighters,stages),null);
 const url=addSpectatorConfig('https://jez237.com/game/?demo=237',config);
 assert.deepEqual(normalizeSpectatorConfig(spectatorConfigFromUrl(url),fighters,stages),config);
 let cycle=1;const director=configuredDirector({next:()=>({cycle:cycle++,picks:['donald','jez'],stage:'randomized'}),peek:()=>({cycle,picks:['donald','jez'],stage:'randomized'}),snapshot:()=>({})},config);
 for(let i=0;i<3;i++){assert.deepEqual(director.peek(),director.next());assert.deepEqual(director.peek().picks,['jez','benny']);assert.equal(director.peek().stage,'alley');}
});
test('replay storage stays bounded and releases its picture canvases',()=>{
 const buffer=new ReplayFrames(3);for(let tick=0;tick<10;tick++)buffer.add({tick,canvas:{width:768}});
 assert.deepEqual(buffer.frames.map(f=>f.tick),[7,8,9]);const frames=[...buffer.frames];buffer.clear();assert.equal(buffer.frames.length,0);assert.ok(frames.every(f=>f.canvas.width===1));
});
