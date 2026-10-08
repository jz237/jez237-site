import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineStallPrevious,restoreEngineStallBytes,verifyEngineStallRevision} from './engine-stall-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Engine stall preserves every prior fixture, vehicle asset, control and camera input',verifyEngineStallRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-stall/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineStallBytes(file,bytes),readEngineStallPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineStallBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineStallBytes('src/unknown.ts',unknown),unknown);
});
