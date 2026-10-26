import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSparkLightPrevious,restoreSparkLightBytes,verifySparkLightRevision} from './spark-light-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SparkLight preserves every prior fixture, vehicle asset, venue art and history input',verifySparkLightRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/spark-light/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSparkLightBytes(file,bytes),readSparkLightPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSparkLightBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSparkLightBytes('src/unknown.ts',unknown),unknown);
});
