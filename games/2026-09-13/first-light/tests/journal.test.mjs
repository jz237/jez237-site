import test from 'node:test';import assert from 'node:assert/strict';
import {summarizeSpecies,journalOverview,hearsayClock,journalLine,bestText,catchHour,hourLabel} from '../journal.js';
import {SPECIES} from '../species.js';
import {fromLocal} from '../game-clock.js';
const J={catches:[
 {species:'largemouth',lengthIn:15.6,weightLb:2.4,sizeClass:'common',lure:'walker',technique:'walking the dog',hour:6.5},
 {species:'largemouth',lengthIn:18.4,weightLb:3.9,sizeClass:'trophy',lure:'walker',technique:'walking the dog',hour:7.2},
 {species:'largemouth',lengthIn:9.1,weightLb:.5,sizeClass:'young',lure:'worm',technique:'lift & drop',at:fromLocal({year:2026,month:9,day:14,hour:19,minute:15})},
 {species:'smallmouth',lengthIn:14.2,weightLb:1.8,sizeClass:'common',lure:'squarebill',technique:'stop & go',hour:13.1}
]};
test('a species summary counts, keeps bests per class and bins the hours',()=>{
 const s=summarizeSpecies(J,'largemouth');
 assert.equal(s.count,3);assert.equal(s.best.lengthIn,18.4);assert.equal(s.bestByClass.young.lengthIn,9.1);assert.equal(s.bestByClass.trophy.lengthIn,18.4);
 assert.equal(s.hours[6],1);assert.equal(s.hours[7],1);assert.equal(s.hours[19],1,'an entry with only a clock timestamp still lands in its hour');
 assert.equal(s.peakHour,6);assert.deepEqual(s.lures[0],{key:'walker',n:2});assert.equal(s.techniques[0].key,'walking the dog');assert.equal(s.firm,true);
 const none=summarizeSpecies(J,'musky');assert.equal(none.count,0);assert.equal(none.best,null);assert.equal(none.peakHour,null);assert.equal(none.firm,false);
});
test('hearsay is the species diel curve, 24 hourly values inside [0,1]',()=>{
 for(const id of ['largemouth','walleye','bluegill']){const h=hearsayClock(SPECIES[id]);assert.equal(h.length,24);assert.ok(h.every(v=>v>=0&&v<=1));}
 const bass=hearsayClock(SPECIES.largemouth,6.5,19.5);assert.ok(bass[6]>bass[13],'crepuscular hearsay peaks at dawn over noon');
 const walleye=hearsayClock(SPECIES.walleye,6.5,19.5);assert.ok(walleye[22]>walleye[12]);
});
test('the overview and the menu line read the whole book',()=>{
 const o=journalOverview(J);assert.equal(o.count,4);assert.equal(o.species,2);assert.equal(o.best.lengthIn,18.4);
 assert.match(journalLine(J),/4 fish, 2 species · best a 18.4 in largemouth bass · 3 lb 14 oz/);
 assert.match(journalLine({catches:[]}),/empty/);assert.equal(bestText(null),null);assert.equal(catchHour({}),null);assert.equal(hourLabel(0),'12 AM');assert.equal(hourLabel(19),'7 PM');
});
