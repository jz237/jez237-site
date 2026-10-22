import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEngineNursePrevious,restoreEngineNurseBytes,verifyEngineNurseRevision} from './engine-nurse-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('EngineNurse preserves every prior fixture, vehicle asset, venue art and history input',verifyEngineNurseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/engine-nurse/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEngineNurseBytes(file,bytes),readEngineNursePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEngineNurseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEngineNurseBytes('src/unknown.ts',unknown),unknown);
});
