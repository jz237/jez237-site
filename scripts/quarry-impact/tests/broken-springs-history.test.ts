import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrokenSpringsPrevious,restoreBrokenSpringsBytes,verifyBrokenSpringsRevision} from './broken-springs-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BrokenSprings preserves every prior fixture, vehicle asset, venue art and history input',verifyBrokenSpringsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/broken-springs/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrokenSpringsBytes(file,bytes),readBrokenSpringsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrokenSpringsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrokenSpringsBytes('src/unknown.ts',unknown),unknown);
});
