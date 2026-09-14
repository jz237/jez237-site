import test from 'node:test';import assert from 'node:assert/strict';
import {waterTempC,seasonOf,tempFactor,pressureFactor,pressureWord,closedSeasonsFor,closedNote,seasonLine} from '../season.js';
import {SPECIES} from '../species.js';
test('water temperature follows the year and species have comfort bands',()=>{
 assert.ok(waterTempC(30)<4&&waterTempC(30)>2,'late January '+waterTempC(30));assert.ok(waterTempC(212)>26&&waterTempC(212)<29,'late July '+waterTempC(212));
 assert.equal(seasonOf(15),'winter');assert.equal(seasonOf(120),'spring');assert.equal(seasonOf(200),'summer');assert.equal(seasonOf(290),'fall');assert.equal(seasonOf(350),'winter');
 assert.equal(tempFactor(SPECIES.largemouth,22),1);assert.ok(tempFactor(SPECIES.largemouth,4)<.35,'bass in January '+tempFactor(SPECIES.largemouth,4));
 assert.ok(tempFactor(SPECIES.walleye,10)>tempFactor(SPECIES.largemouth,10),'walleye like it colder');assert.ok(tempFactor(SPECIES.bluegill,30)>.7);
});
test('pressure: feeding ahead of a front, lockjaw behind it',()=>{
 assert.equal(pressureFactor(-2.5),1.25);assert.equal(pressureFactor(-.8),1.12);assert.equal(pressureFactor(0),1);assert.equal(pressureFactor(1),.85);assert.equal(pressureFactor(3),.7);assert.equal(pressureFactor(NaN),1);
 assert.equal(pressureWord(-2),'falling fast');assert.equal(pressureWord(.2),'steady');
});
test('Pennsylvania closed seasons as understood: bass April 15 to mid-June, walleye March 15 to early May',()=>{
 assert.equal(closedSeasonsFor({year:2026,month:4,day:14}).bass,false);assert.equal(closedSeasonsFor({year:2026,month:4,day:15}).bass,true);
 assert.equal(closedSeasonsFor({year:2026,month:6,day:12}).bass,true,'Friday 12 June 2026 still closed');assert.equal(closedSeasonsFor({year:2026,month:6,day:13}).bass,false,'Saturday 13 June 2026 opens');
 assert.equal(closedSeasonsFor({year:2026,month:9,day:14}).bass,false);
 assert.equal(closedSeasonsFor({year:2026,month:3,day:14}).walleye,false);assert.equal(closedSeasonsFor({year:2026,month:3,day:15}).walleye,true);
 assert.equal(closedSeasonsFor({year:2026,month:5,day:1}).walleye,true,'Friday 1 May 2026 closed');assert.equal(closedSeasonsFor({year:2026,month:5,day:2}).walleye,false,'first Saturday in May opens');
 const c={bass:true,walleye:false};assert.match(closedNote('largemouth',c),/catch and immediate release/);assert.equal(closedNote('musky',c),null);assert.equal(closedNote('walleye',{bass:false,walleye:true}).length>5,true);
 assert.equal(seasonLine(120,c),'spring · bass C&R only');assert.equal(seasonLine(200,{bass:false,walleye:false}),'summer');
});
