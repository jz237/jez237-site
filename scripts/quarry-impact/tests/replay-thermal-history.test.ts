import {restoreReplayBurstBytes} from './replay-burst-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayThermalPrevious,restoreReplayThermalBytes,verifyReplayThermalRevision} from './replay-thermal-invariants';
const source=(file:string)=>restoreReplayBurstBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReplayThermal preserves every prior fixture, vehicle asset, control and camera input',verifyReplayThermalRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-thermal/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayThermalBytes(file,bytes),readReplayThermalPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayThermalBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayThermalBytes('src/unknown.ts',unknown),unknown);
});
