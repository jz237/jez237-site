import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpeedwayCrowdPrevious,restoreSpeedwayCrowdBytes,verifySpeedwayCrowdRevision} from './speedway-crowd-invariants';
const source=(file:string)=>restoreStadiumCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SpeedwayCrowd preserves every prior fixture, vehicle asset, control and camera input',verifySpeedwayCrowdRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/speedway-crowd/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpeedwayCrowdBytes(file,bytes),readSpeedwayCrowdPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpeedwayCrowdBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpeedwayCrowdBytes('src/unknown.ts',unknown),unknown);
});

import {restoreStadiumCrowdBytes} from './stadium-crowd-invariants';
