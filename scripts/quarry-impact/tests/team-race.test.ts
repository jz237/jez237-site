import test from 'node:test';
import assert from 'node:assert/strict';
import {teamOf,teamRaceActive,teamScores,teamLine,teamVerdict} from '../src/team-race';
import {readEventOptions} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
test('team races split the grid Red/Blue by slot and score field minus place for classified cars',()=>{
 assert.deepEqual([0,1,2,3,4].map(teamOf),[0,1,0,1,0]);
 // Four cars: Red slots 0,2 finish 1st and 4th; Blue slots 1,3 finish 2nd and 3rd → Red 4+1, Blue 3+2.
 assert.deepEqual(teamScores([{slot:0,scores:true},{slot:1,scores:true},{slot:3,scores:true},{slot:2,scores:true}]),[5,5]);
 // A wreck still holds its place in the order but scores nothing.
 assert.deepEqual(teamScores([{slot:1,scores:true},{slot:0,scores:true},{slot:2,scores:false},{slot:3,scores:true}]),[3,5]);
 assert.equal(teamLine([12,9],0),'TEAM RACE · RED 12 · BLUE 9 · YOU: RED');assert.equal(teamLine([12,9]),'TEAM RACE · RED 12 · BLUE 9');
 assert.equal(teamVerdict([12,9],0),'YOUR TEAM WINS · RED 12–9');assert.equal(teamVerdict([9,12],0),'YOUR TEAM LOSES · BLUE 12–9');
 assert.equal(teamVerdict([9,12]),'BLUE TEAM WINS · 12–9');assert.equal(teamVerdict([7,7],0),'TEAMS TIED · 7–7');
});
test('team races apply only to custom lap races and never combine with elimination, timed races or chases',()=>{
 const on={teams:true as const};
 assert.ok(teamRaceActive('race',true,false,'laps',on,{}));assert.ok(teamRaceActive('race',true,true,'laps',{},on));
 assert.ok(!teamRaceActive('race',true,true,'laps',on,{}),'demo reads demo options');
 assert.ok(!teamRaceActive('derby',true,false,'laps',on,{}));assert.ok(!teamRaceActive('race',false,false,'laps',on,{}));assert.ok(!teamRaceActive('race',true,false,'ordered',on,{}));
 assert.ok(!teamRaceActive('race',true,false,'laps',{teams:true,raceDuration:120},{}));assert.ok(!teamRaceActive('race',true,false,'laps',{teams:true,elimination:true},{}));
 for(const read of [readEventOptions,readDemoOptions] as const){
  assert.equal(read(JSON.stringify({version:1,teams:true})).teams,true);
  for(const clash of [{elimination:true},{raceDuration:120},{pursuit:true}])assert.equal(read(JSON.stringify({version:1,teams:true,...clash})).teams,undefined,JSON.stringify(clash));
  assert.equal(read(JSON.stringify({version:1,teams:'yes'})).teams,undefined);assert.ok(!('teams' in read(JSON.stringify({version:1}))),'old saves unchanged');
 }
});
