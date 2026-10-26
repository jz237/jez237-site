import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWornEnginesPrevious,restoreWornEnginesBytes,verifyWornEnginesRevision} from './worn-engines-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WornEngines preserves every prior fixture, vehicle asset, venue art and history input',verifyWornEnginesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/worn-engines/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWornEnginesBytes(file,bytes),readWornEnginesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWornEnginesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWornEnginesBytes('src/unknown.ts',unknown),unknown);
});
