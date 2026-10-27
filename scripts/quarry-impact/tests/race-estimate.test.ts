import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ESTIMATE,estimateFinishes,type EstimateRow} from '../src/race-estimate';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
const row=(o:Partial<EstimateRow>):EstimateRow=>({finished:false,finishTime:0,passed:0,penalty:0,health:100,...o});
test('a car still racing finishes the distance it has left at its own pace; finished, wrecked and barely-started cars get none',()=>{
  // 72 checkpoints (3 laps); 60 s gone. Half distance at 60 s → about 120 s; three quarters → about 80 s.
  const rows=[row({finished:true,finishTime:58}),row({passed:54}),row({passed:36,penalty:5}),row({passed:40,health:0}),row({passed:ESTIMATE.minimum-1})];
  const t=estimateFinishes(rows,72,60);
  assert.equal(t[0],null);assert.ok(Math.abs(t[1]!-80)<1e-9);assert.ok(Math.abs(t[2]!-125)<1e-9,'its recovery penalties count');assert.equal(t[3],null);assert.equal(t[4],null);
});
test('nobody is estimated ahead of a car classified in front of them',()=>{
  const t=estimateFinishes([row({finished:true,finishTime:90}),row({passed:70}),row({passed:69})],72,60);
  assert.ok(t[1]!>=90+ESTIMATE.gap-1e-9,'not faster than the finisher ahead');assert.ok(t[2]!>=t[1]!+ESTIMATE.gap-1e-9,'nor than the running car ahead');
  assert.deepEqual(estimateFinishes([row({passed:Number.NaN}),row({passed:10,health:Number.NaN})],72,60),[null,null]);
  assert.deepEqual(estimateFinishes([row({passed:10})],72,0),[null]);
});
test('main estimates only solo lap races, and labels the estimates in the results and standings',()=>{
  assert.ok(main.includes("if(mode!=='race'||online?.active||demo||pursuit||activeClubRound!==null||raceTimeLimit()||waypointRace||eliminationRace())return;"));
  assert.ok(main.includes("estimateFinishes(ordered,raceLaps()*24,elapsed)"));
  assert.ok(main.includes("const rank = ordered.findIndex(isPlayer) + 1;\n  estimateField(ordered);"));
  assert.ok(main.includes("(raceEstimates.has(c.id)?'≈ '+formatTime(raceEstimates.get(c.id)!)+' · STILL RACING':(c.health<=0?causeOf(c)??'RETIRED':'DNF')"));
  assert.ok(main.includes(":state==='result'?(raceEstimates.has(c.id)?'≈ '+formatTime(raceEstimates.get(c.id)!):'DNF'):"));
  assert.ok(main.includes('demo=watch;demoRestart=0;raceEstimates=new Map();'),'a new event forgets the last one');
});
