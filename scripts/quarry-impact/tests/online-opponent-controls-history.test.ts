import {restoreStartReadinessBytes} from './start-readiness-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineOpponentControlsPrevious,restoreOnlineOpponentControlsBytes,verifyOnlineOpponentControlsRevision} from './online-opponent-controls-invariants';
const source=(file:string)=>restoreStartReadinessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineOpponentControls preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineOpponentControlsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-opponent-controls/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineOpponentControlsBytes(file,bytes),readOnlineOpponentControlsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineOpponentControlsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineOpponentControlsBytes('src/unknown.ts',unknown),unknown);
});
