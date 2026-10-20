import {restoreGearboxDamageBytes} from './gearbox-damage-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplaySlicksPrevious,restoreReplaySlicksBytes,verifyReplaySlicksRevision} from './replay-slicks-invariants';
const source=(file:string)=>restoreGearboxDamageBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReplaySlicks preserves every prior fixture, vehicle asset, venue art and history input',verifyReplaySlicksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-slicks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplaySlicksBytes(file,bytes),readReplaySlicksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplaySlicksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplaySlicksBytes('src/unknown.ts',unknown),unknown);
});
