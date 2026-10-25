import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeSquealPrevious,restoreBrakeSquealBytes,verifyBrakeSquealRevision} from './brake-squeal-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BrakeSqueal preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeSquealRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-squeal/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeSquealBytes(file,bytes),readBrakeSquealPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeSquealBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeSquealBytes('src/unknown.ts',unknown),unknown);
});
