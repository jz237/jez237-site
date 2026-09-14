import test from 'node:test';import assert from 'node:assert/strict';
import {snagChance,abradeRate,attemptFree,snagBreakSeconds,strengthFactor,lineWord,FRAYED} from '../snag.js';
import {unlockedRigs,nextUnlock,newlyUnlocked,isUnlocked} from '../unlocks.js';
import {LURES,RIGS} from '../tackle.js';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('snags happen on the bottom in wood, cranks worst, topwater never',()=>{
 assert.equal(snagChance('laydown',false,.3,LURES.squarebill),0);assert.equal(snagChance('laydown',true,0,LURES.squarebill),0);
 assert.ok(snagChance('laydown',true,.3,LURES.squarebill)>snagChance('laydown',true,.3,LURES.worm));assert.equal(snagChance('laydown',true,.3,LURES.walker),0);
 assert.ok(snagChance('laydown',true,.3,LURES.worm)>snagChance('riprap',true,.3,LURES.worm));assert.equal(snagChance('open',true,.3,LURES.worm),0);
 assert.ok(abradeRate('laydown',true)>abradeRate('laydown',false));assert.equal(abradeRate('pads',true),0);
});
test('bow and snap frees a snag far more often than snapping under load, and a frayed line breaks sooner',()=>{
 let slack=0,tight=0;const r=rng(7);for(let s=1;s<=200;s++){if(attemptFree(1.0,r))slack++;if(attemptFree(0,r))tight++;}
 assert.ok(slack>90&&slack<130,'slack frees about half: '+slack);assert.ok(tight<50,'tight rarely: '+tight);
 assert.ok(snagBreakSeconds(0)>snagBreakSeconds(.5));assert.equal(strengthFactor(0),1);assert.equal(strengthFactor(1),.5);
 assert.equal(lineWord(0),'good');assert.equal(lineWord(FRAYED),'frayed');assert.equal(lineWord(.7),'badly frayed');
});
test('three rigs to start, the rest earned from the journal',()=>{
 const empty={catches:[]};assert.deepEqual(unlockedRigs(empty),['finesse','topwater','float']);assert.match(nextUnlock(empty),/Squarebill casting unlocks after three fish in the journal \(3 more\)/);
 const three={catches:[{sizeClass:'common'},{sizeClass:'young'},{sizeClass:'common'}]};assert.ok(isUnlocked('crank',three));assert.ok(!isUnlocked('bottom',three));assert.ok(!isUnlocked('musky',three));
 assert.deepEqual(newlyUnlocked(unlockedRigs(empty),three),['Squarebill casting']);
 const trophy={catches:[{sizeClass:'trophy'}]};assert.ok(isUnlocked('musky',trophy));assert.ok(!isUnlocked('crank',trophy));
 const many={catches:Array.from({length:6},()=>({sizeClass:'common'}))};assert.ok(isUnlocked('bottom',many));assert.match(nextUnlock(many),/Musky casting unlocks after a trophy-class fish/);
 const all={catches:[...many.catches,{sizeClass:'legend'}]};assert.equal(nextUnlock(all),null);assert.equal(unlockedRigs(all).length,RIGS.length);
});
