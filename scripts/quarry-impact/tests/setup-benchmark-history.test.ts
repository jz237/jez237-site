import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSetupBenchmarkPrevious,restoreSetupBenchmarkBytes,verifySetupBenchmarkRevision} from './setup-benchmark-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SetupBenchmark preserves every prior fixture, vehicle asset, control and camera input',verifySetupBenchmarkRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/setup-benchmark/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSetupBenchmarkBytes(file,bytes),readSetupBenchmarkPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSetupBenchmarkBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSetupBenchmarkBytes('src/unknown.ts',unknown),unknown);
});
