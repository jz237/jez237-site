import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineDropPrevious,restoreEngineDropBytes,verifyEngineDropRevision} from './engine-drop-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('EngineDrop preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineDropRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-drop/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineDropBytes(file,bytes),readEngineDropPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineDropBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineDropBytes('src/unknown.ts',unknown),unknown);
});
