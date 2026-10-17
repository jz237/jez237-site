import {restoreOnlineOpponentControlsBytes} from './online-opponent-controls-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineOpponentsPrevious,restoreOnlineOpponentsBytes,verifyOnlineOpponentsRevision} from './online-opponents-invariants';
const source=(file:string)=>restoreOnlineOpponentControlsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineOpponents preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineOpponentsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-opponents/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineOpponentsBytes(file,bytes),readOnlineOpponentsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineOpponentsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineOpponentsBytes('src/unknown.ts',unknown),unknown);
});
