import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineTimedRacePrevious,restoreOnlineTimedRaceBytes,verifyOnlineTimedRaceRevision} from './online-timed-race-invariants';
const source=(file:string)=>restoreOnlineRosterBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineTimedRace preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineTimedRaceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-timed-race/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineTimedRaceBytes(file,bytes),readOnlineTimedRacePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineTimedRaceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineTimedRaceBytes('src/unknown.ts',unknown),unknown);
});

import {restoreOnlineRosterBytes} from './online-roster-invariants';
