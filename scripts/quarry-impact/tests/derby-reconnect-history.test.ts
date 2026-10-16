import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDerbyReconnectPrevious,restoreDerbyReconnectBytes,verifyDerbyReconnectRevision} from './derby-reconnect-invariants';
const source=(file:string)=>restoreOnlineTimedRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DerbyReconnect preserves every prior fixture, vehicle asset, control and camera input',verifyDerbyReconnectRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/derby-reconnect/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDerbyReconnectBytes(file,bytes),readDerbyReconnectPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDerbyReconnectBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDerbyReconnectBytes('src/unknown.ts',unknown),unknown);
});

import {restoreOnlineTimedRaceBytes} from './online-timed-race-invariants';
