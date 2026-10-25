import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrashLitterPrevious,restoreCrashLitterBytes,verifyCrashLitterRevision} from './crash-litter-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrashLitter preserves every prior fixture, vehicle asset, venue art and history input',verifyCrashLitterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crash-litter/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrashLitterBytes(file,bytes),readCrashLitterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrashLitterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrashLitterBytes('src/unknown.ts',unknown),unknown);
});
