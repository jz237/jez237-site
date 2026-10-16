import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteeringDefaultRefreshPrevious,restoreSteeringDefaultRefreshBytes,verifySteeringDefaultRefreshRevision} from './steering-default-refresh-invariants';
const source=(file:string)=>restoreNoRespawnDerbyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SteeringDefaultRefresh preserves every prior fixture, vehicle asset, control and camera input',verifySteeringDefaultRefreshRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steering-default-refresh/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSteeringDefaultRefreshBytes(file,bytes),readSteeringDefaultRefreshPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteeringDefaultRefreshBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteeringDefaultRefreshBytes('src/unknown.ts',unknown),unknown);
});

import {restoreNoRespawnDerbyBytes} from './no-respawn-derby-invariants';
